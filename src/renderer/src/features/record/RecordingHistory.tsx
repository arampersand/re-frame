// Every class recording: play it, and see if it's transcribed and filed in the brain.
import { useEffect, useState } from 'react'
import { rf, listen } from '@/api'
import { Button, Card } from '@/components/ui'

type Item = {
  audio: string; note: string | null; title: string; date: string; sizeMB: number
  status: 'recording' | 'not-transcribed' | 'transcribed' | 'filed'; course: string | null
}

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

  const load = () => rf.audio.list().then(setItems)
  useEffect(() => { load() }, [refresh])
  useEffect(() => listen(rf.audio.onProgress, (p: { rel: string; pct: number }) => {
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

  const transcribe = async (it: Item) => {
    busy(it.audio, 'Transcribing… 0%')
    const r = await rf.audio.retry(it.audio)
    if (r.ok) { busy(it.audio, 'Filing in your brain…'); await rf.audio.finish(r.rel) }
    busy(it.audio, null)
    load()
  }
  const file = async (it: Item) => {
    busy(it.audio, 'Filing in your brain…')
    await rf.audio.finish(it.note!)
    busy(it.audio, null)
    load()
  }

  if (!items.length) return null
  return (
    <div>
      <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-muted">Your recordings</p>
      <div className="space-y-2">
        {items.map(it => {
          const w = working[it.audio]
          const when = new Date(it.date).toLocaleString(undefined, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
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
                      {it.status === 'transcribed' && <Button onClick={() => file(it)}>File it</Button>}
                      {it.note && <Button variant="ghost" onClick={() => onOpenNote(it.note!)}>Open</Button>}
                    </div>}
              </div>
              {playing === it.audio && <audio autoPlay controls className="mt-3 w-full" src={`brain://vault/${encodeURI(it.audio)}`} onEnded={() => setPlaying(null)} />}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
