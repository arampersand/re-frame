// Chats (with attachments) and filing class recordings: everything lands as files in the student's brain.
import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs'
import { basename, join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { runCodex, type CodexEvent } from './codex'
import { vaultPath } from './vault'
import { prepareAttachments } from './attachments'
import type { Progress } from './stt'

type Msg = { role: 'user' | 'assistant'; text: string; steps?: string[]; at: string }
export type Chat = { id: string; title: string; sessionId: string | null; createdAt: string; messages: Msg[] }

const chatsDir = () => join(vaultPath(), '04-CHATS')
const chatFile = (id: string) => join(chatsDir(), `${id}.json`)
const now = () => new Date().toISOString()

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

export async function sendChat(id: string, text: string, files: string[], emit: (e: CodexEvent) => void, onProgress: (p: Progress) => void): Promise<Chat> {
  const chat = getChat(id)
  const names = files.map(f => basename(f))
  if (!chat.messages.length) chat.title = (text || `📎 ${names.join(', ')}`).slice(0, 48)
  chat.messages.push({ role: 'user', text: text + (names.length ? `${text ? '\n\n' : ''}📎 ${names.join(' · ')}` : ''), at: now() })
  saveChat(chat)
  const steps: string[] = []
  const step = (t: string) => { steps.push(t); emit({ kind: 'command', text: t }) }

  let prompt = text
  let images: string[] = []
  if (files.length) {
    const prep = await prepareAttachments(files, step, onProgress)
    images = prep.images
    prompt = `${text || 'File these in my brain.'}\n\nI attached these files; they are already saved in my brain:\n${prep.lines.join('\n')}\n\n` +
      'Follow AGENTS.md: work out which course each one belongs to and file it there (move it out of 00-INBOX, keep recordings in 08-RECORDINGS), add any dates to 03-DEADLINES.md, ' +
      `and ${text ? 'then answer my message using them.' : 'tell me in 2-3 lines what each one is and where you put it, as [[wikilinks]]. If you are not sure of the course, ask me.'}`
  }
  const r = await runCodex(prompt, chat.sessionId, e => {
    if (e.kind === 'command') steps.push(e.text)
    emit(e)
  }, images)
  chat.sessionId = r.sessionId
  chat.messages.push({ role: 'assistant', text: r.text || 'I could not answer. Check Integrations → Codex.', steps, at: now() })
  saveChat(chat)
  return chat
}

// ---------- Lecture recording (audio + transcript live in recording.ts) ----------

export async function finishLecture(rel: string, emit: (e: CodexEvent) => void) {
  const prompt = `I just recorded a class: ${rel} (its audio lives in 08-RECORDINGS; never move or delete it, keep the audio: line and the ![[...]] embed). Follow "Ingesting a class recording" in AGENTS.md. First figure out which course it is from the content and from the day/time it was recorded vs each course schedule in 02-COURSES/*/index.md. If you are confident, move it to that course's lectures/ folder with its topic slug. If you are NOT sure, leave it in 00-INBOX and end your reply asking me which course it is (list the options). Reply in 2-3 lines in Spanish: which course, what it was about and the new note as a [[wikilink]].`
  return runCodex(prompt, null, emit)
}
