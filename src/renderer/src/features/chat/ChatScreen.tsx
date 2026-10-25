import { useEffect, useRef, useState } from 'react'
import { rf, listen, type Chat, type CodexEvent } from '@/api'
import { Button, Markdown } from '@/components/ui'
import { usePcmRecorder } from '@/features/record/usePcmRecorder'

type ChatMeta = { id: string; title: string; createdAt: string }
type Attachment = { path: string; name: string }

const SUGGESTIONS = [
  '¿Qué no he entendido y qué estudio antes de mi próximo examen?',
  '¿Qué entregas tengo esta semana y cómo voy con cada una?',
  'Resúmeme mi última clase en 5 puntos',
  'Hazme 3 preguntas de mi materia más floja'
]

const icon = (name: string) =>
  /\.pdf$/i.test(name) ? '📄' : /\.(png|jpe?g|gif|webp|heic|heif|tiff?|bmp)$/i.test(name) ? '🖼️'
    : /\.(m4a|mp3|wav|aac|aiff?|caf|flac|mp4|mov|m4v)$/i.test(name) ? '🎧' : '📎'

export function ChatScreen({ onOpenNote }: { onOpenNote: (p: string) => void }) {
  const [chats, setChats] = useState<ChatMeta[]>([])
  const [chat, setChat] = useState<Chat | null>(null)
  const [input, setInput] = useState('')
  const [files, setFiles] = useState<Attachment[]>([])
  const [busy, setBusy] = useState(false)
  const [live, setLive] = useState<{ steps: string[]; messages: string[]; progress?: string; error?: string }>({ steps: [], messages: [] })
  const [dropping, setDropping] = useState(false)
  const [dictation, setDictation] = useState<'idle' | 'listening' | 'transcribing'>('idle')
  const [dictError, setDictError] = useState('')
  const pcm = useRef<ArrayBuffer[]>([])
  const box = useRef<HTMLTextAreaElement>(null)
  const bottom = useRef<HTMLDivElement>(null)
  const mic = usePcmRecorder(chunk => { pcm.current.push(chunk) })

  const loadList = () => rf.chat.list().then(setChats)
  useEffect(() => { loadList() }, [])
  useEffect(() => listen(rf.chat.onEvent, (e: CodexEvent & { chatId: string }) => {
    if (e.kind === 'command') setLive(l => ({ ...l, steps: [...l.steps, e.text!], progress: undefined }))
    if (e.kind === 'message') setLive(l => ({ ...l, messages: [...l.messages, e.text!] }))
    if (e.kind === 'error') setLive(l => ({ ...l, error: e.text }))
    if ((e.kind as string) === 'progress') setLive(l => ({ ...l, progress: e.text }))
  }), [])
  useEffect(() => { bottom.current?.scrollIntoView({ behavior: 'smooth' }) }, [chat, live])

  const open = async (id: string) => setChat(await rf.chat.get(id))
  const fresh = async () => { const c = await rf.chat.create(); setChat(c); setFiles([]); loadList() }

  const addFiles = (paths: string[]) => setFiles(f => [
    ...f, ...paths.filter(p => p && !f.some(x => x.path === p)).map(p => ({ path: p, name: p.split('/').pop()! }))
  ])

  const send = async (text = input) => {
    if ((!text.trim() && !files.length) || busy) return
    let c = chat ?? await rf.chat.create()
    const attached = files
    setInput(''); setFiles([])
    setBusy(true)
    setLive({ steps: [], messages: [] })
    const shown = text + (attached.length ? `${text ? '\n\n' : ''}📎 ${attached.map(a => a.name).join(' · ')}` : '')
    setChat({ ...c, messages: [...c.messages, { role: 'user', text: shown, at: new Date().toISOString() }] })
    c = await rf.chat.send(c.id, text.trim(), attached.map(a => a.path))
    setChat(c)
    setBusy(false)
    setLive({ steps: [], messages: [] })
    loadList()
  }

  // Dictation: tap to talk, tap again; the text lands in the box so you can fix it before sending.
  const toggleMic = async () => {
    setDictError('')
    if (dictation === 'idle') {
      const s = await rf.stt.status()
      if (!s.ready) { setDictError('Turn on transcription in Integrations to dictate.'); return }
      pcm.current = []
      try { await mic.start(); setDictation('listening') } catch (e) { setDictError(`Microphone: ${(e as Error).message}`) }
      return
    }
    if (dictation !== 'listening') return
    await mic.stop()
    setDictation('transcribing')
    const parts = pcm.current
    const total = parts.reduce((n, p) => n + p.byteLength, 0)
    const all = new Uint8Array(total)
    let o = 0
    for (const p of parts) { all.set(new Uint8Array(p), o); o += p.byteLength }
    try {
      const text: string = total > 16000 ? await rf.stt.dictate(all.buffer) : ''
      if (text) setInput(v => (v.trim() ? `${v.trimEnd()} ${text}` : text))
      else setDictError("Didn't catch that. Try again a bit closer to the mic.")
    } catch (e) {
      setDictError((e as Error).message.replace(/^Error invoking remote method '[^']+': (Error: )?/, ''))
    }
    setDictation('idle')
    box.current?.focus()
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

      <section className="relative flex min-w-0 flex-1 flex-col"
        onDragOver={e => { e.preventDefault(); setDropping(true) }}
        onDragLeave={e => { if (e.currentTarget === e.target) setDropping(false) }}
        onDrop={e => {
          e.preventDefault(); setDropping(false)
          addFiles([...e.dataTransfer.files].map(f => rf.files.pathFor(f)))
        }}>
        {dropping && (
          <div className="pointer-events-none absolute inset-3 z-10 grid place-items-center rounded-card border-2 border-dashed border-primary bg-primary/10">
            <p className="text-lg font-semibold">Drop files to add them to your brain</p>
          </div>
        )}
        <div className="flex-1 overflow-auto px-8 pb-4 pt-10">
          {!chat?.messages.length && !busy && (
            <div className="mx-auto mt-16 max-w-xl text-center">
              <p className="text-3xl font-bold">Hola 👋 ¿qué estudiamos hoy?</p>
              <p className="mt-2 text-sm text-muted">Te contesto con tus clases, tus archivos y tus fechas. Arrastra aquí PDFs, fotos del pizarrón, audios o lo que sea.</p>
              <div className="mt-8 grid grid-cols-2 gap-2">
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => send(s)} className="rounded-card border border-border bg-surface p-3 text-left text-sm hover:bg-surface-2">{s}</button>
                ))}
              </div>
            </div>
          )}
          <div className="mx-auto max-w-3xl space-y-5">
            {chat?.messages.map((m, i) => m.role === 'user'
              ? <div key={i} className="ml-auto w-fit max-w-[80%] whitespace-pre-wrap rounded-2xl bg-primary px-4 py-2 text-sm text-primary-ink">{m.text}</div>
              : <div key={i}>
                  {!!m.steps?.length && (
                    <details className="mb-1 text-xs text-muted"><summary className="cursor-pointer">🧠 Used {m.steps.length} steps in your brain</summary>
                      <ul className="ml-4 mt-1 list-disc">{m.steps.map((s, j) => <li key={j}>{s}</li>)}</ul></details>
                  )}
                  <Markdown text={m.text} onLink={onOpenNote} />
                </div>)}
            {busy && (
              <div className="space-y-1 text-sm text-muted">
                {live.steps.slice(-6).map((s, i, arr) => <p key={i}>🧠 {s}{i === arr.length - 1 && live.progress ? ` · ${live.progress}` : ''}</p>)}
                {live.messages.map((m, i) => <p key={`m${i}`} className="italic">{m}</p>)}
                <p className="animate-pulse">Pensando…</p>
                {live.error && <p className="text-gap">{live.error}</p>}
              </div>
            )}
            <div ref={bottom} />
          </div>
        </div>

        <div className="border-t border-border p-4">
          <div className="mx-auto max-w-3xl">
            {!!files.length && (
              <div className="mb-2 flex flex-wrap gap-2">
                {files.map(f => (
                  <span key={f.path} className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs">
                    {icon(f.name)} <span className="max-w-48 truncate">{f.name}</span>
                    <button className="text-muted hover:text-text" onClick={() => setFiles(x => x.filter(y => y.path !== f.path))}>✕</button>
                  </span>
                ))}
              </div>
            )}
            {dictError && <p className="mb-2 text-xs text-gap">{dictError}</p>}
            <div className="flex items-end gap-2">
              <Button variant="ghost" onClick={async () => addFiles(await rf.files.pick())} disabled={busy} className="h-10 px-3">📎</Button>
              <div className="relative flex-1">
                <textarea ref={box} value={input} onChange={e => setInput(e.target.value)} rows={1}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
                  placeholder={dictation === 'listening' ? 'Escuchando… toca el micrófono para terminar' : dictation === 'transcribing' ? 'Transcribiendo…' : 'Pregúntale a tu cerebro…'}
                  className="max-h-40 w-full resize-none rounded-xl border border-border bg-surface py-2.5 pl-4 pr-12 text-sm outline-none focus:border-primary" />
                <button onClick={toggleMic} disabled={dictation === 'transcribing' || busy} title="Dictate"
                  className={`absolute bottom-1.5 right-1.5 grid h-8 w-8 place-items-center rounded-lg text-base transition ${dictation === 'listening' ? 'animate-pulse bg-gap text-white' : 'text-muted hover:bg-surface-2'} disabled:opacity-40`}>
                  {dictation === 'transcribing' ? '…' : '🎙️'}
                </button>
                {dictation === 'listening' && (
                  <span className="absolute -top-1.5 left-4 right-14 h-1 overflow-hidden rounded-full bg-surface-2">
                    <span className="block h-full bg-gap transition-all duration-100" style={{ width: `${Math.min(100, mic.level * 160)}%` }} />
                  </span>
                )}
              </div>
              <Button onClick={() => send()} disabled={busy || (!input.trim() && !files.length)} className="h-10">Send</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
