// Every class recording: play it, see if it's transcribed and filed, and answer the brain if it asks which course.
import { useEffect, useState } from 'react'
import { rf, listen } from '@/api'
import { Button, Card, Markdown } from '@/components/ui'

type Item = {
  audio: string; note: string | null; title: string; date: string; sizeMB: number
  status: 'recording' | 'not-transcribed' | 'transcribed' | 'filed'; course: string | null
}
type Reply = { text: string; sessionId: string | null }

const BADGE: Record<Item['status'], { label: string; cls: string }> = {
  recording: { label: 'Recording…', cls: 'bg-gap/20 text-gap' },
  'not-transcribed': { label: 'Not transcribed', cls: 'bg-progress/20 text-progress' },
  transcribed: { label: 'Transcribed · not filed', cls: 'bg-primary/20 text-primary' },
  filed: { label: 'Filed', cls: 'bg-mastered/20 text-mastered' }
}

export function RecordingHistory({ refresh, onOpenNote }: { refresh: number; onOpenNote: (p: string) => void }) {
  const [items, setItems] = useState<Item[]>([])
  const [playing, setPlaying] = useState<string | null>(null)
  const [working, setWorking] = useState<Record<string, string>>({})
  const [replies, setReplies] = useState<Record<string, Reply>>({})
  const [answer, setAnswer] = useState<Record<string, string>>({})
  const [courses, setCourses] = useState<{ slug: string; name: string }[]>([])

  const load = () => rf.audio.list().then(setItems)
  useEffect(() => { load(); rf.dash.courses().then(setCourses) }, [refresh])
  useEffect(() => listen(rf.audio.onProgress, (p: { pct: number }) => {
    setWorking(w => {
      const key = Object.keys(w).find(k => w[k].startsWith('Transcribing'))
      return key ? { ...w, [key]: `Transcribing… ${p.pct}%` } : w
    })
  }), [])

  const busy = (audio: string, label: string | null) => setWorking(w => {
    const n = { ...w }
    if (label) n[audio] = label; else delete n[audio]
    return n
  })
  const done = (audio: string, r: Reply) => { setReplies(x => ({ ...x, [audio]: r })); busy(audio, null); load() }

  const transcribe = async (it: Item) => {
    busy(it.audio, 'Transcribing… 0%')
    const r = await rf.audio.retry(it.audio)
    if (!r.ok) { done(it.audio, { text: `Couldn't transcribe: ${r.detail}`, sessionId: null }); return }
    busy(it.audio, 'Filing in your brain…')
    done(it.audio, await rf.audio.finish(r.rel))
  }
  const file = async (it: Item) => {
    busy(it.audio, 'Filing in your brain…')
    done(it.audio, await rf.audio.finish(it.note!))
  }
  /** Keeps the same Codex conversation, so "it's Integradora" is enough. */
  const reply = async (it: Item, text: string) => {
    if (!text.trim()) return
    const prev = replies[it.audio]
    busy(it.audio, 'Filing in your brain…')
    setAnswer(a => ({ ...a, [it.audio]: '' }))
    const r = await rf.audio.followup(prev?.sessionId ?? null,
      prev?.sessionId ? text : `About the class recording ${it.note}: ${text}. File it accordingly following AGENTS.md and reply in 1-2 lines with where it went as a [[wikilink]].`)
    done(it.audio, r)
  }
  const pickCourse = (it: Item, c: { slug: string; name: string }) =>
    reply(it, `Es de la materia ${c.name} (02-COURSES/${c.slug}). Archívala ahí siguiendo AGENTS.md.`)

  if (!items.length) return null
  return (
    <div>
      <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-muted">Your recordings</p>
      <div className="space-y-2">
        {items.map(it => {
          const w = working[it.audio]
          const r = replies[it.audio]
          const when = new Date(it.date).toLocaleString(undefined, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
          const stuck = it.status === 'transcribed' && !w
          return (
            <Card key={it.audio} className="p-3">
              <div className="flex items-center gap-3">
                <button onClick={() => setPlaying(p => (p === it.audio ? null : it.audio))}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface-2 hover:bg-primary hover:text-primary-ink">
                  {playing === it.audio ? '■' : '▶'}
                </button>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{it.title}</p>
                  <p className="text-xs text-muted">{when} · {it.sizeMB} MB{it.course ? ` · ${it.course}` : ''}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${BADGE[it.status].cls}`}>{BADGE[it.status].label}</span>
                {w
                  ? <span className="w-40 shrink-0 animate-pulse text-right text-xs text-muted">{w}</span>
                  : <div className="flex shrink-0 gap-1.5">
                      {it.status === 'not-transcribed' && <Button onClick={() => transcribe(it)}>Transcribe</Button>}
                      {it.status === 'transcribed' && !r && <Button onClick={() => file(it)}>File it</Button>}
                      {it.note && <Button variant="ghost" onClick={() => onOpenNote(it.note!)}>Open</Button>}
                    </div>}
              </div>
              {playing === it.audio && <audio autoPlay controls className="mt-3 w-full" src={`brain://vault/${encodeURI(it.audio)}`} onEnded={() => setPlaying(null)} />}

              {r && (
                <div className="mt-3 rounded-lg bg-surface-2 p-3 text-sm">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">🧠 Your brain</p>
                  <Markdown text={r.text || 'No answer. Try again.'} onLink={onOpenNote} />
                  {stuck && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-muted">Which course is it?</p>
                      <div className="flex flex-wrap gap-1.5">
                        {courses.map(c => (
                          <button key={c.slug} onClick={() => pickCourse(it, c)}
                            className="rounded-full border border-border px-2.5 py-1 text-xs hover:border-primary hover:bg-primary/10">{c.name}</button>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input value={answer[it.audio] ?? ''} onChange={e => setAnswer(a => ({ ...a, [it.audio]: e.target.value }))}
                          onKeyDown={e => e.key === 'Enter' && reply(it, answer[it.audio] ?? '')}
                          placeholder="Or answer here: a new course, 'it was a test, delete it'…"
                          className="flex-1 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm outline-none focus:border-primary" />
                        <Button onClick={() => reply(it, answer[it.audio] ?? '')} disabled={!(answer[it.audio] ?? '').trim()}>Send</Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
