// Ported from dictadito (GroqClient.swift + TranscriptionQueue.swift).
import { getGroqKey } from './settings'

const ENDPOINT = 'https://api.groq.com/openai/v1/audio/transcriptions'
const MODEL = 'whisper-large-v3-turbo'

export async function transcribe(audio: Buffer, filename: string, key = getGroqKey()): Promise<string> {
  if (!key) throw new Error('Add your Groq key in Integrations')
  const form = new FormData()
  form.append('file', new Blob([new Uint8Array(audio)]), filename)
  form.append('model', MODEL)
  form.append('response_format', 'verbose_json')
  // No language: Whisper detects it, classes mix Spanish and English.
  const res = await fetch(ENDPOINT, { method: 'POST', headers: { Authorization: `Bearer ${key}` }, body: form })
  const body = await res.text()
  if (!res.ok) throw new Error(`Groq ${res.status}: ${body.slice(0, 200)}`)
  return (JSON.parse(body).text ?? '').trim()
}

export async function testKey(key: string): Promise<{ ok: boolean; detail: string }> {
  try {
    const res = await fetch('https://api.groq.com/openai/v1/models', { headers: { Authorization: `Bearer ${key}` } })
    return res.ok ? { ok: true, detail: 'Groq connected' } : { ok: false, detail: `Groq said ${res.status}` }
  } catch (e) {
    return { ok: false, detail: (e as Error).message }
  }
}

/** One chunk at a time, in order, so the transcript never shuffles and recording never blocks. */
export class TranscriptionQueue {
  private chain: Promise<void> = Promise.resolve()
  pending = 0
  enqueue(job: () => Promise<void>) {
    this.pending++
    this.chain = this.chain.then(job).catch(() => {}).finally(() => { this.pending-- })
    return this.chain
  }
  idle() { return this.chain }
}
