// Transcription engines: Groq (cloud, needs a key) or local whisper.cpp (model downloaded once).
import { app } from 'electron'
import { execFile } from 'node:child_process'
import { createWriteStream, existsSync, mkdirSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { getGroqKey, loadSettings, saveSettings } from './settings'
import { transcribe as groqTranscribe } from './groq'

export type Engine = 'local' | 'groq'

// Apple Silicon handles large-v3-turbo in ~1 s per chunk; Intel gets a lighter model to keep up.
const MODEL = process.arch === 'arm64'
  ? { file: 'ggml-large-v3-turbo-q5_0.bin', label: 'Whisper large-v3 turbo', sizeMB: 547 }
  : { file: 'ggml-small-q5_1.bin', label: 'Whisper small', sizeMB: 181 }
const MODEL_URL = `https://huggingface.co/ggerganov/whisper.cpp/resolve/main/${MODEL.file}`

const binDir = app.isPackaged ? join(process.resourcesPath, 'whisper') : join(app.getAppPath(), 'vendor', 'whisper', process.arch)
const WHISPER = join(binDir, 'whisper-cli')
const modelsDir = () => join(app.getPath('userData'), 'models')
const modelPath = () => join(modelsDir(), MODEL.file)

let download: { pct: number; error?: string } | null = null

export const localReady = () => existsSync(WHISPER) && existsSync(modelPath())

/** Saved choice, or the best available default. */
export function engine(): Engine {
  const s = loadSettings().sttEngine as Engine | undefined
  if (s) return s
  return getGroqKey() && !localReady() ? 'groq' : 'local'
}

export function sttStatus() {
  const e = engine()
  const groqKey = !!getGroqKey()
  const local = localReady()
  return {
    engine: e,
    ready: e === 'local' ? local : groqKey,
    groqKey,
    local: { ready: local, binary: existsSync(WHISPER), model: MODEL.label, sizeMB: MODEL.sizeMB, download }
  }
}

export function setEngine(e: Engine) { saveSettings({ sttEngine: e }) }

export async function downloadModel(onProgress: (pct: number) => void): Promise<{ ok: boolean; detail: string }> {
  if (localReady()) return { ok: true, detail: 'Already downloaded' }
  if (download && !download.error) return { ok: false, detail: 'Already downloading' }
  mkdirSync(modelsDir(), { recursive: true })
  const part = modelPath() + '.part'
  download = { pct: 0 }
  try {
    const res = await fetch(MODEL_URL)
    if (!res.ok || !res.body) throw new Error(`Download failed (${res.status})`)
    const total = Number(res.headers.get('content-length')) || MODEL.sizeMB * 1048576
    const out = createWriteStream(part)
    let got = 0, last = -1
    for await (const chunk of res.body as unknown as AsyncIterable<Uint8Array>) {
      if (!out.write(chunk)) await new Promise<void>(r => out.once('drain', () => r()))
      got += chunk.length
      const pct = Math.floor((got / total) * 100)
      if (pct !== last) { last = pct; download = { pct }; onProgress(pct) }
    }
    await new Promise<void>((r, j) => out.end((err?: Error | null) => (err ? j(err) : r())))
    if (statSync(part).size < MODEL.sizeMB * 1048576 * 0.9) throw new Error('Download incomplete, try again')
    renameSync(part, modelPath())
    download = null
    return { ok: true, detail: 'Ready' }
  } catch (e) {
    rmSync(part, { force: true })
    download = { pct: 0, error: (e as Error).message }
    return { ok: false, detail: (e as Error).message }
  }
}

function transcribeLocal(wav: Buffer): Promise<string> {
  if (!localReady()) return Promise.reject(new Error('Download the local model in Integrations first'))
  const file = join(tmpdir(), `mbb-${randomUUID()}.wav`)
  writeFileSync(file, wav)
  return new Promise((resolve, reject) => {
    execFile(WHISPER, ['-m', modelPath(), '-f', file, '-l', 'auto', '-nt', '-np', '-t', '4'], { timeout: 120000, maxBuffer: 8 * 1048576 },
      (err, stdout, stderr) => {
        rmSync(file, { force: true })
        if (err) return reject(new Error(`Local transcription failed: ${(stderr || err.message).trim().split('\n').pop()}`))
        resolve(stdout.replace(/\s+/g, ' ').trim())
      })
  })
}

/** Audio arrives as 16 kHz mono WAV from the renderer; works for both engines. */
export async function transcribeChunk(wav: Buffer, name: string): Promise<string> {
  if (engine() === 'local') return transcribeLocal(wav)
  return groqTranscribe(wav, name)
}
