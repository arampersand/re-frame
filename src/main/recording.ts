// Class recordings: 16 kHz mono PCM streamed to a WAV on disk while recording (nothing is lost if
// the app closes), transcribed once at the end, then compressed to .m4a and kept in 08-RECORDINGS.
import { execFile } from 'node:child_process'
import { closeSync, existsSync, fstatSync, openSync, readFileSync, rmSync, writeSync } from 'node:fs'
import { inVault, writeNote } from './vault'
import { transcribeWav, type Progress } from './stt'

const RATE = 16000
const open = new Map<string, { fd: number; wav: string }>()

const pad = (n: number) => String(n).padStart(2, '0')
const stamp = (s: number) => {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.floor(s % 60)
  return h ? `${h}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`
}

function wavHeader(dataBytes: number): Buffer {
  const h = Buffer.alloc(44)
  h.write('RIFF', 0); h.writeUInt32LE(36 + dataBytes, 4); h.write('WAVE', 8)
  h.write('fmt ', 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22)
  h.writeUInt32LE(RATE, 24); h.writeUInt32LE(RATE * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34)
  h.write('data', 36); h.writeUInt32LE(dataBytes, 40)
  return h
}

/** Creates the lecture note (00-INBOX) and the WAV it records into (08-RECORDINGS). */
export function startRecording(): string {
  const d = new Date()
  const day = d.toLocaleDateString('en-CA')
  const hhmm = `${pad(d.getHours())}${pad(d.getMinutes())}`
  const base = `${day}-${hhmm}`
  const rel = `00-INBOX/${base}-recording.md`
  const wav = `08-RECORDINGS/${base}.wav`
  writeNote(wav, '')
  const fd = openSync(inVault(wav), 'w')
  writeSync(fd, wavHeader(0))
  open.set(rel, { fd, wav })
  const weekday = d.toLocaleDateString('en-US', { weekday: 'long' })
  writeNote(rel, `---\ntype: lecture\ndate: ${day}\nrecorded_at: ${weekday} ${d.toTimeString().slice(0, 5)}\naudio: ${wav}\nstatus: recording\ntags: [lecture]\n---\n# Class recording — ${day}\n\n![[${wav}]]\n\n## Transcript\n`)
  return rel
}

export function appendPcm(rel: string, pcm: Buffer) {
  const r = open.get(rel)
  if (r) writeSync(r.fd, pcm)
}

/** Closes the WAV with the right sizes. Returns its seconds of audio. */
export function stopRecording(rel: string): { wav: string; seconds: number } | null {
  const r = open.get(rel)
  if (!r) return null
  const bytes = fstatSync(r.fd).size - 44
  writeSync(r.fd, wavHeader(bytes), 0, 44, 0)
  closeSync(r.fd)
  open.delete(rel)
  return { wav: r.wav, seconds: bytes / (RATE * 2) }
}

function toM4a(wavRel: string): Promise<string> {
  const m4a = wavRel.replace(/\.wav$/, '.m4a')
  return new Promise(resolve => {
    // afconvert ships with every Mac: AAC 32 kbps mono ≈ 15 MB per hour of class.
    execFile('/usr/bin/afconvert', ['-f', 'm4af', '-d', 'aac', '-b', '32000', inVault(wavRel), inVault(m4a)], err => {
      if (err || !existsSync(inVault(m4a))) return resolve(wavRel)
      rmSync(inVault(wavRel), { force: true })
      resolve(m4a)
    })
  })
}

/** Transcribes the whole recording, writes it into the note, compresses the audio. */
export async function transcribeRecording(rel: string, onProgress: (p: Progress) => void): Promise<{ ok: boolean; detail: string; lines: number }> {
  const done = stopRecording(rel)
  const note = readFileSync(inVault(rel), 'utf8')
  const wav = done?.wav ?? (note.match(/^audio: (.+)$/m)?.[1] ?? '')
  if (!wav || !existsSync(inVault(wav))) return { ok: false, detail: 'Recording file not found', lines: 0 }
  if (done && done.seconds < 2) return { ok: false, detail: 'The recording is too short.', lines: 0 }

  let segments: { start: number; text: string }[]
  try {
    segments = await transcribeWav(inVault(wav), onProgress)
  } catch (e) {
    // Keep the audio: the student can retry later from the note.
    writeNote(rel, note.replace('status: recording', 'status: not-transcribed'))
    return { ok: false, detail: (e as Error).message, lines: 0 }
  }
  onProgress({ stage: 'saving', pct: 100 })
  const audio = await toM4a(wav)
  const transcript = segments.filter(s => s.text).map(s => `[${stamp(s.start)}] ${s.text}`).join('\n')
  writeNote(rel, note
    .replace('status: recording', 'status: raw')
    .replaceAll(wav, audio)
    .replace(/## Transcript\n[\s\S]*$/, `## Transcript\n${transcript}\n`))
  return { ok: segments.some(s => s.text), detail: segments.length ? 'Transcribed' : 'No speech found', lines: segments.length }
}

