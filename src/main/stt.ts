// Transcription engines: Groq (cloud, needs a key) or local whisper.cpp (model downloaded once).
import { app } from 'electron'
import { spawn } from 'node:child_process'
import { createWriteStream, existsSync, mkdirSync, readFileSync, renameSync, rmSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { hasGroqKey, loadSettings, saveSettings } from './settings'
import { transcribeSegments } from './groq'

export type Engine = 'local' | 'groq'

// Apple Silicon (Metal) handles large-v3-turbo fast; Intel Macs and Windows (CPU) get a lighter model.
const MODEL = process.arch === 'arm64' && process.platform === 'darwin'
  ? { file: 'ggml-large-v3-turbo-q5_0.bin', label: 'Whisper large-v3 turbo', sizeMB: 547 }
  : { file: 'ggml-small-q5_1.bin', label: 'Whisper small', sizeMB: 181 }
const MODEL_URL = `https://huggingface.co/ggerganov/whisper.cpp/resolve/main/${MODEL.file}`

const binDir = app.isPackaged ? join(process.resourcesPath, 'whisper')
  : process.platform === 'win32' ? join(app.getAppPath(), 'vendor', 'win', 'whisper') : join(app.getAppPath(), 'vendor', 'whisper', process.arch)
const WHISPER = join(binDir, process.platform === 'win32' ? 'whisper-cli.exe' : 'whisper-cli')
const modelsDir = () => join(app.getPath('userData'), 'models')
const modelPath = () => join(modelsDir(), MODEL.file)

let download: { pct: number; error?: string } | null = null

export const localReady = () => existsSync(WHISPER) && existsSync(modelPath())

/** Saved choice, or the best available default. */
export function engine(): Engine {
  const s = loadSettings().sttEngine as Engine | undefined
  if (s) return s
  return hasGroqKey() && !localReady() ? 'groq' : 'local'
}

export function sttStatus() {
  const e = engine()
  const groqKey = hasGroqKey()
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

export type Progress = { stage: 'transcribing' | 'saving'; pct: number }
type Segment = { start: number; text: string }

function transcribeLocalFile(file: string, onProgress: (p: Progress) => void): Promise<Segment[]> {
  if (!localReady()) return Promise.reject(new Error('Download the on-device model in Integrations first'))
  const prefix = join(tmpdir(), `mbb-${randomUUID()}`)
  return new Promise((resolve, reject) => {
    const child = spawn(WHISPER, ['-m', modelPath(), '-f', file, '-l', 'auto', '-pp', '-np', '-oj', '-of', prefix, '-t', '4'])
    let err = ''
    child.stderr.on('data', d => {
      const s = d.toString()
      err = (err + s).slice(-2000)
      for (const m of s.matchAll(/progress =\s*(\d+)%/g)) onProgress({ stage: 'transcribing', pct: Number(m[1]) })
    })
    child.stdout.on('data', () => {})
    child.on('error', e => reject(e))
    child.on('close', code => {
      try {
        if (code !== 0) throw new Error(`On-device transcription failed: ${err.trim().split('\n').pop()}`)
        const j = JSON.parse(readFileSync(`${prefix}.json`, 'utf8'))
        resolve((j.transcription ?? []).map((t: { offsets: { from: number }; text: string }) => ({ start: t.offsets.from / 1000, text: t.text.trim() })))
      } catch (e) { reject(e) } finally { rmSync(`${prefix}.json`, { force: true }) }
    })
  })
}

/** Groq takes up to 25 MB per file: send the WAV in 10-minute pieces. */
async function transcribeGroqFile(file: string, onProgress: (p: Progress) => void): Promise<Segment[]> {
  const wav = readFileSync(file)
  const pcm = wav.subarray(44)
  const piece = 600 * 16000 * 2
  const out: Segment[] = []
  const n = Math.max(1, Math.ceil(pcm.length / piece))
  for (let i = 0; i < n; i++) {
    const data = pcm.subarray(i * piece, (i + 1) * piece)
    const header = Buffer.from(wav.subarray(0, 44))
    header.writeUInt32LE(36 + data.length, 4); header.writeUInt32LE(data.length, 40)
    const segs = await transcribeSegments(Buffer.concat([header, data]), `part-${i}.wav`)
    out.push(...segs.map(s => ({ start: s.start + i * 600, text: s.text })))
    onProgress({ stage: 'transcribing', pct: Math.round(((i + 1) / n) * 100) })
  }
  return out
}

export function transcribeWav(file: string, onProgress: (p: Progress) => void): Promise<Segment[]> {
  onProgress({ stage: 'transcribing', pct: 0 })
  return engine() === 'local' ? transcribeLocalFile(file, onProgress) : transcribeGroqFile(file, onProgress)
}
