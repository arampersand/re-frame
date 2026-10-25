// Groq Whisper client (ported from dictadito GroqClient.swift).
import { getGroqKey } from './settings'

const ENDPOINT = 'https://api.groq.com/openai/v1/audio/transcriptions'
const MODEL = 'whisper-large-v3-turbo'

/** Verbose transcription with timestamps (seconds). */
export async function transcribeSegments(audio: Buffer, filename: string, key = getGroqKey()): Promise<{ start: number; text: string }[]> {
  if (!key) throw new Error('Add your Groq key in Integrations')
  const form = new FormData()
  form.append('file', new Blob([new Uint8Array(audio)]), filename)
  form.append('model', MODEL)
  form.append('response_format', 'verbose_json')
  const res = await fetch(ENDPOINT, { method: 'POST', headers: { Authorization: `Bearer ${key}` }, body: form })
  const body = await res.text()
  if (!res.ok) throw new Error(res.status === 401 ? 'Groq rejected your key. Paste it again in Integrations.' : `Groq ${res.status}: ${body.slice(0, 160)}`)
  const j = JSON.parse(body)
  const segs = (j.segments ?? []) as { start: number; text: string }[]
  return segs.length ? segs.map(s => ({ start: s.start, text: s.text.trim() })) : [{ start: 0, text: (j.text ?? '').trim() }]
}

export async function testKey(key: string): Promise<{ ok: boolean; detail: string }> {
  try {
    const res = await fetch('https://api.groq.com/openai/v1/models', { headers: { Authorization: `Bearer ${key}` } })
    return res.ok ? { ok: true, detail: 'Groq connected' } : { ok: false, detail: `Groq said ${res.status}` }
  } catch (e) {
    return { ok: false, detail: (e as Error).message }
  }
}
