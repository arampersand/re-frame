// Chats, lecture recordings and PDF imports: everything lands as files in the student's brain.
import { copyFileSync, existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync, appendFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { runCodex, type CodexEvent } from './codex'
import { TranscriptionQueue } from './groq'
import { transcribeChunk } from './stt'
import { inVault, vaultPath, writeNote } from './vault'

type Msg = { role: 'user' | 'assistant'; text: string; steps?: string[]; at: string }
export type Chat = { id: string; title: string; sessionId: string | null; createdAt: string; messages: Msg[] }

const chatsDir = () => join(vaultPath(), '04-CHATS')
const chatFile = (id: string) => join(chatsDir(), `${id}.json`)
const now = () => new Date().toISOString()
const today = () => new Date().toLocaleDateString('en-CA')

export function listChats(): Pick<Chat, 'id' | 'title' | 'createdAt'>[] {
  if (!existsSync(chatsDir())) return []
  return readdirSync(chatsDir())
    .filter(f => f.endsWith('.json'))
    .map(f => JSON.parse(readFileSync(join(chatsDir(), f), 'utf8')) as Chat)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(({ id, title, createdAt }) => ({ id, title, createdAt }))
}

export const getChat = (id: string): Chat => JSON.parse(readFileSync(chatFile(id), 'utf8'))
const saveChat = (c: Chat) => { mkdirSync(chatsDir(), { recursive: true }); writeFileSync(chatFile(c.id), JSON.stringify(c, null, 2)) }

export function newChat(): Chat {
  const c: Chat = { id: randomUUID().slice(0, 8), title: 'New chat', sessionId: null, createdAt: now(), messages: [] }
  saveChat(c)
  return c
}

export async function sendChat(id: string, text: string, emit: (e: CodexEvent) => void): Promise<Chat> {
  const chat = getChat(id)
  if (!chat.messages.length) chat.title = text.slice(0, 48)
  chat.messages.push({ role: 'user', text, at: now() })
  saveChat(chat)
  const steps: string[] = []
  const r = await runCodex(text, chat.sessionId, e => {
    if (e.kind === 'command') steps.push(e.text)
    emit(e)
  })
  chat.sessionId = r.sessionId
  chat.messages.push({ role: 'assistant', text: r.text || 'I could not answer. Check Integrations → Codex.', steps, at: now() })
  saveChat(chat)
  return chat
}

// ---------- Lecture recording ----------

const queue = new TranscriptionQueue()

/** Recordings land in the INBOX; Codex figures out which course they belong to. */
export function startLecture(): string {
  const d = new Date()
  const hhmm = `${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}`
  const weekday = d.toLocaleDateString('en-US', { weekday: 'long' })
  const rel = `00-INBOX/${today()}-recording-${hhmm}.md`
  writeNote(rel, `---\ntype: lecture\ndate: ${today()}\nrecorded_at: ${weekday} ${d.toTimeString().slice(0, 5)}\nstatus: raw\ntags: [lecture]\n---\n# Class recording — ${today()}\n\n## Transcript\n`)
  return rel
}

const stamp = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`

export function lectureChunk(rel: string, audio: Buffer, offsetS: number, emit: (t: { offsetS: number; text?: string; error?: string }) => void) {
  queue.enqueue(async () => {
    try {
      const text = await transcribeChunk(audio, `chunk-${offsetS}.wav`)
      if (text) appendFileSync(inVault(rel), `[${stamp(offsetS)}] ${text}\n`)
      emit({ offsetS, text })
    } catch (e) {
      emit({ offsetS, error: (e as Error).message })
    }
  })
}

export const drainLecture = () => queue.idle()

export async function finishLecture(rel: string, emit: (e: CodexEvent) => void) {
  await queue.idle()
  const prompt = `I just recorded a class: ${rel}. Follow "Ingesting a class recording" in AGENTS.md. First figure out which course it is from the content and from the day/time it was recorded vs each course schedule in 02-COURSES/*/index.md. If you are confident, move it to that course's lectures/ folder with its topic slug. If you are NOT sure, leave it in 00-INBOX and end your reply asking me which course it is (list the options). Reply in 2-3 lines in Spanish: which course, what it was about and the new note as a [[wikilink]].`
  return runCodex(prompt, null, emit)
}

// ---------- PDF import ----------

export async function importPdf(src: string, emit: (e: CodexEvent) => void) {
  const name = basename(src).replace(/\s+/g, '-')
  const dir = '00-INBOX'
  const pdfRel = `${dir}/${name}`
  const mdRel = `${dir}/${name.replace(/\.pdf$/i, '')}.md`
  mkdirSync(inVault(dir), { recursive: true })
  copyFileSync(src, inVault(pdfRel))
  emit({ kind: 'command', text: `Copied ${name} to ${dir}` })

  const { extractText, getDocumentProxy } = await import('unpdf')
  const pdf = await getDocumentProxy(new Uint8Array(readFileSync(src)))
  const { text } = await extractText(pdf, { mergePages: true })
  writeNote(mdRel, `---\ntype: reading\ndate: ${today()}\nsource: ${name}\ntags: [reading]\n---\n# ${name.replace(/\.pdf$/i, '')}\n\nPDF: ${name}\n\n## Extracted text\n\n${text}\n`)
  emit({ kind: 'command', text: `Extracted text to ${mdRel}` })

  const prompt = `I just added a PDF from school: ${mdRel} (extracted text of ${pdfRel}). Figure out which course it belongs to from its content and the course indexes. If confident, move BOTH files to that course's readings/ folder and follow "Ingesting a PDF" in AGENTS.md. If not sure, leave them in 00-INBOX and ask me which course (list the options). Reply in 2 lines in Spanish with what it is about and where it went, as a [[wikilink]].`
  return runCodex(prompt, null, emit)
}
