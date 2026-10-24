import { useEffect, useRef, useState } from 'react'
import { rf, listen, type Chat, type CodexEvent } from '@/api'
import { Button, Markdown } from '@/components/ui'

type ChatMeta = { id: string; title: string; createdAt: string }

const SUGGESTIONS = [
  '¿Qué no he entendido esta semana y qué estudio antes de mi examen?',
  'Explícame las rotaciones dobles AVL con un dibujo',
  'Hazme la tarea 5 del heap',
  'Hazme 3 preguntas para ver si entendí eigenvalores'
]

export function ChatScreen({ onOpenNote }: { onOpenNote: (p: string) => void }) {
  const [chats, setChats] = useState<ChatMeta[]>([])
  const [chat, setChat] = useState<Chat | null>(null)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [live, setLive] = useState<{ steps: string[]; messages: string[]; error?: string }>({ steps: [], messages: [] })
  const [dropping, setDropping] = useState(false)
  const bottom = useRef<HTMLDivElement>(null)

  const loadList = () => rf.chat.list().then(setChats)
  useEffect(() => {
    loadList()
  }, [])
  useEffect(() => listen(rf.chat.onEvent, (e: CodexEvent & { chatId: string }) => {
    if (e.kind === 'command') setLive(l => ({ ...l, steps: [...l.steps, e.text!] }))
    if (e.kind === 'message') setLive(l => ({ ...l, messages: [...l.messages, e.text!] }))
    if (e.kind === 'error') setLive(l => ({ ...l, error: e.text }))
  }), [])
  useEffect(() => listen(rf.onTask, (e: CodexEvent) => {
    if (e.kind === 'command') setLive(l => ({ ...l, steps: [...l.steps, e.text!] }))
  }), [])
  useEffect(() => { bottom.current?.scrollIntoView({ behavior: 'smooth' }) }, [chat, live])

  const open = async (id: string) => setChat(await rf.chat.get(id))
  const fresh = async () => { const c = await rf.chat.create(); setChat(c); loadList() }

  const send = async (text = input) => {
    if (!text.trim() || busy) return
    let c = chat ?? await rf.chat.create()
    setInput('')
    setBusy(true)
    setLive({ steps: [], messages: [] })
    setChat({ ...c, messages: [...c.messages, { role: 'user', text, at: new Date().toISOString() }] })
    c = await rf.chat.send(c.id, text)
    setChat(c)
    setBusy(false)
    setLive({ steps: [], messages: [] })
    loadList()
  }

  const importPdfs = async (paths: string[]) => {
    if (!paths.length) return
    setBusy(true)
    setLive({ steps: [`Importing ${paths.length} PDF…`], messages: [] })
    const replies: string[] = await rf.pdf.import(paths)
    let c = chat ?? await rf.chat.create()
    c = { ...c, messages: [...c.messages, { role: 'assistant', text: `📄 ${replies.join('\n\n')}`, at: new Date().toISOString() }] }
    setChat(c)
    setBusy(false)
    setLive({ steps: [], messages: [] })
  }

  return (
    <div className="flex h-full">
      <aside className="flex w-60 flex-col border-r border-border p-3 pt-10">
        <Button onClick={fresh} className="mb-3">+ New chat</Button>
        <div className="flex-1 space-y-1 overflow-auto">
          {chats.map(c => (
            <button key={c.id} onClick={() => open(c.id)}
              className={`block w-full truncate rounded-lg px-3 py-2 text-left text-sm ${chat?.id === c.id ? 'bg-surface-2' : 'text-muted hover:bg-surface-2'}`}>
              {c.title}
            </button>
          ))}
        </div>
      </aside>

      <section className={`relative flex min-w-0 flex-1 flex-col ${dropping ? 'ring-2 ring-primary ring-inset' : ''}`}
        onDragOver={e => { e.preventDefault(); setDropping(true) }}
        onDragLeave={() => setDropping(false)}
        onDrop={e => {
          e.preventDefault(); setDropping(false)
          importPdfs([...e.dataTransfer.files].filter(f => f.name.toLowerCase().endsWith('.pdf')).map(f => rf.pdf.pathFor(f)))
        }}>
        <div className="flex-1 overflow-auto px-8 pb-4 pt-10">
          {!chat?.messages.length && !busy && (
            <div className="mx-auto mt-16 max-w-xl text-center">
              <p className="text-3xl font-bold">Hola 👋 ¿qué estudiamos hoy?</p>
              <p className="mt-2 text-sm text-muted">Te contesto con tus clases, tus PDFs y tus fechas. Arrastra un PDF aquí para agregarlo a tu cerebro.</p>
              <div className="mt-8 grid grid-cols-2 gap-2">
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => send(s)} className="rounded-card border border-border bg-surface p-3 text-left text-sm hover:bg-surface-2">{s}</button>
                ))}
              </div>
            </div>
          )}
          <div className="mx-auto max-w-3xl space-y-5">
            {chat?.messages.map((m, i) => m.role === 'user'
              ? <div key={i} className="ml-auto w-fit max-w-[80%] rounded-2xl bg-primary px-4 py-2 text-sm text-primary-ink">{m.text}</div>
              : <div key={i}>
                  {!!m.steps?.length && (
                    <details className="mb-1 text-xs text-muted"><summary className="cursor-pointer">🧠 Used {m.steps.length} steps in your brain</summary>
                      <ul className="ml-4 mt-1 list-disc">{m.steps.map((s, j) => <li key={j}>{s}</li>)}</ul></details>
                  )}
                  <Markdown text={m.text} onLink={onOpenNote} />
                </div>)}
            {busy && (
              <div className="space-y-1 text-sm text-muted">
                {live.steps.slice(-6).map((s, i) => <p key={i}>🧠 {s}</p>)}
                {live.messages.map((m, i) => <p key={`m${i}`} className="italic">{m}</p>)}
                <p className="animate-pulse">Pensando…</p>
                {live.error && <p className="text-gap">{live.error}</p>}
              </div>
            )}
            <div ref={bottom} />
          </div>
        </div>

        <div className="border-t border-border p-4">
          <div className="mx-auto flex max-w-3xl items-end gap-2">
            <Button variant="ghost" onClick={async () => importPdfs(await rf.pdf.pick())} disabled={busy}>📄 PDF</Button>
            <textarea value={input} onChange={e => setInput(e.target.value)} rows={1}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
              placeholder="Pregúntale a tu cerebro…"
              className="max-h-40 flex-1 resize-none rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary" />
            <Button onClick={() => send()} disabled={busy || !input.trim()}>Send</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
