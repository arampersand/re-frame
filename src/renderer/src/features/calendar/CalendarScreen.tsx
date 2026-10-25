// Month view: Google Calendar (MyBrainBook calendar) when connected, plus the brain's own dates and classes.
import { useEffect, useMemo, useState } from 'react'
import { rf } from '@/api'
import { Button } from '@/components/ui'
import type { Nav } from '@/App'

type Item = { date: string; time: string | null; title: string; source: 'google' | 'task' | 'class'; kind?: string; link?: string; key?: string; path?: string }
const ymd = (d: Date) => d.toLocaleDateString('en-CA')
const TONE: Record<Item['source'], string> = { google: 'bg-primary/25 text-text', task: 'bg-progress/25 text-text', class: 'bg-mastered/25 text-text' }

export function CalendarScreen({ go, onOpenNote }: { go: (n: Nav) => void; onOpenNote: (p: string) => void }) {
  const [month, setMonth] = useState(() => { const d = new Date(); d.setDate(1); return d })
  const [items, setItems] = useState<Item[]>([])
  const [google, setGoogle] = useState<boolean | null>(null)
  const [day, setDay] = useState<string>(ymd(new Date()))

  const grid = useMemo(() => {
    const first = new Date(month)
    const start = new Date(first); start.setDate(1 - ((first.getDay() + 6) % 7)) // weeks start Monday
    return Array.from({ length: 42 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d })
  }, [month])

  useEffect(() => {
    rf.calendar.status().then(s => setGoogle(s.connected))
    rf.dash.calendar(ymd(grid[0]), ymd(grid[41])).then(setItems)
  }, [grid])

  const byDay = (d: string) => items.filter(i => i.date === d)
  const today = ymd(new Date())
  const openItem = (i: Item) => i.key ? go({ screen: 'tasks', task: i.key }) : i.path ? onOpenNote(i.path) : i.link && window.open(i.link)
  const shift = (n: number) => setMonth(m => { const d = new Date(m); d.setMonth(d.getMonth() + n); return d })

  return (
    <div className="flex h-full">
      <div className="flex min-w-0 flex-1 flex-col p-6 pt-10">
        <div className="mb-4 flex items-center gap-3">
          <h1 className="flex-1 text-2xl font-bold capitalize">{month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</h1>
          <Button variant="ghost" onClick={() => shift(-1)}>‹</Button>
          <Button variant="ghost" onClick={() => { const d = new Date(); d.setDate(1); setMonth(d); setDay(today) }}>Today</Button>
          <Button variant="ghost" onClick={() => shift(1)}>›</Button>
        </div>
        <div className="grid grid-cols-7 text-center text-xs text-muted">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <div key={d} className="pb-2">{d}</div>)}
        </div>
        <div className="grid flex-1 grid-cols-7 grid-rows-6 gap-px overflow-hidden rounded-card border border-border bg-border">
          {grid.map(d => {
            const k = ymd(d)
            const list = byDay(k)
            const inMonth = d.getMonth() === month.getMonth()
            return (
              <button key={k} onClick={() => setDay(k)}
                className={`flex min-h-0 flex-col items-stretch gap-0.5 overflow-hidden p-1.5 text-left ${day === k ? 'bg-surface-2' : 'bg-surface'} ${inMonth ? '' : 'opacity-40'}`}>
                <span className={`mb-0.5 grid h-6 w-6 place-items-center rounded-full text-xs ${k === today ? 'bg-primary text-primary-ink' : 'text-muted'}`}>{d.getDate()}</span>
                {list.slice(0, 3).map((i, n) => <span key={n} className={`truncate rounded px-1 text-[11px] ${TONE[i.source]}`}>{i.time ? `${i.time} ` : ''}{i.title}</span>)}
                {list.length > 3 && <span className="px-1 text-[11px] text-muted">+{list.length - 3} more</span>}
              </button>
            )
          })}
        </div>
        <div className="mt-3 flex gap-4 text-xs text-muted">
          {google && <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-primary" />Google Calendar</span>}
          <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-progress" />Tasks & exams</span>
          <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-mastered" />Recorded classes</span>
          {google === false && <button className="underline" onClick={() => go({ screen: 'integrations' })}>Connect Google Calendar to sync</button>}
        </div>
      </div>

      <aside className="w-72 shrink-0 overflow-auto border-l border-border p-4 pt-10">
        <p className="mb-3 font-semibold capitalize">{new Date(`${day}T12:00:00`).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        {!byDay(day).length && <p className="text-sm text-muted">Nothing this day.</p>}
        <ul className="space-y-2">
          {byDay(day).map((i, n) => (
            <li key={n}>
              <button onClick={() => openItem(i)} className={`w-full rounded-lg px-3 py-2 text-left text-sm ${TONE[i.source]}`}>
                <span className="block text-xs text-muted">{i.time ?? 'All day'} · {i.source === 'google' ? 'Google Calendar' : i.source === 'class' ? 'Class' : i.kind || 'Task'}</span>
                {i.title}
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  )
}
