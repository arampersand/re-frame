// When the brain finds new deadlines, offer to put them in Google Calendar. Never adds without a click.
import { useEffect, useState } from 'react'
import { rf, listen } from '@/api'
import { Button } from '@/components/ui'

type Deadline = { key: string; date: string; time: string | null; course: string; what: string; kind: string }
type Result = { key: string; ok: boolean; detail: string; link?: string }

const when = (d: Deadline) => {
  const day = new Date(`${d.date}T12:00:00`).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })
  return d.time ? `${day} · ${d.time}` : day
}

export function CalendarPrompt() {
  const [items, setItems] = useState<Deadline[]>([])
  const [picked, setPicked] = useState<Set<string>>(new Set())
  const [hidden, setHidden] = useState<string>('')
  const [busy, setBusy] = useState(false)
  const [results, setResults] = useState<Result[] | null>(null)

  const check = () => rf.calendar.pending().then((d: Deadline[]) => {
    setItems(d)
    setPicked(new Set(d.map(x => x.key)))
  })
  useEffect(() => {
    check()
    const t = window.setInterval(check, 60000)
    return () => window.clearInterval(t)
  }, [])
  // After the brain answers, files a class or a PDF, look for new dates.
  useEffect(() => listen(rf.chat.onEvent, (e: { kind: string }) => { if (e.kind === 'done') check() }), [])
  useEffect(() => listen(rf.onTask, (e: { kind: string }) => { if (e.kind === 'done') check() }), [])

  const signature = items.map(i => i.key).join(',')
  if (results) return (
    <div className="fixed bottom-5 right-5 z-50 w-96 rounded-card border border-border bg-surface p-4 shadow-2xl">
      <p className="font-semibold">📅 Google Calendar</p>
      <ul className="mt-2 space-y-1 text-sm">
        {results.map(r => <li key={r.key} className={r.ok ? 'text-mastered' : 'text-gap'}>{r.ok ? '✓' : '✕'} {r.detail}{r.link && <> · <a className="underline" href={r.link} target="_blank" rel="noreferrer">open</a></>}</li>)}
      </ul>
      <Button variant="ghost" className="mt-3" onClick={() => { setResults(null); check() }}>Close</Button>
    </div>
  )
  if (!items.length || hidden === signature) return null

  const toggle = (k: string) => setPicked(p => { const n = new Set(p); n.has(k) ? n.delete(k) : n.add(k); return n })
  const add = async () => {
    setBusy(true)
    const approve = items.filter(i => picked.has(i.key)).map(i => i.key)
    const ignore = items.filter(i => !picked.has(i.key)).map(i => i.key)
    setResults(await rf.calendar.add(approve, ignore))
    setBusy(false)
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 w-96 rounded-card border border-primary/60 bg-surface p-4 shadow-2xl">
      <p className="font-semibold">📅 {items.length} new {items.length === 1 ? 'date' : 'dates'} in your brain</p>
      <p className="text-xs text-muted">Add them to Google Calendar with reminders?</p>
      <ul className="mt-3 max-h-60 space-y-1.5 overflow-auto">
        {items.map(d => (
          <li key={d.key}>
            <label className="flex cursor-pointer items-start gap-2 text-sm">
              <input type="checkbox" className="mt-1 accent-[var(--color-primary)]" checked={picked.has(d.key)} onChange={() => toggle(d.key)} />
              <span><span className="font-medium">{d.what}</span><span className="block text-xs text-muted">{when(d)}{d.course ? ` · ${d.course}` : ''}</span></span>
            </label>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex gap-2">
        <Button onClick={add} disabled={busy || picked.size === 0}>{busy ? 'Adding…' : `Add ${picked.size} to Google Calendar`}</Button>
        <Button variant="ghost" onClick={() => setHidden(signature)}>Not now</Button>
      </div>
    </div>
  )
}
