// The morning routine: what's late, what's today, what's coming, and what you still don't get.
import { useEffect, useState } from 'react'
import { rf } from '@/api'
import { Button, Card } from '@/components/ui'
import type { Nav } from '@/App'
import { TaskRow, type Task } from '@/features/tasks/shared'

type Today = {
  day: string; overdue: Task[]; today: Task[]; week: Task[]; later: Task[]
  events: { date: string; time: string | null; title: string; source: string; link?: string; key?: string; path?: string }[]
  struggles: { topic: string; course: string; what: string }[]
  unfiled: number; inbox: number
}

const greeting = () => { const h = new Date().getHours(); return h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches' }

export function TodayScreen({ go, ask, onOpenNote }: { go: (n: Nav) => void; ask: (q: string) => void; onOpenNote: (p: string) => void }) {
  const [d, setD] = useState<Today | null>(null)
  const load = () => rf.dash.today().then(setD)
  useEffect(() => { load() }, [])

  const toggle = async (t: Task) => { await rf.dash.taskStatus(t.key, t.status === 'done' ? 'pending' : 'done'); load() }
  const open = (t: Task) => go({ screen: 'tasks', task: t.key })
  const dateLabel = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })

  const section = (title: string, tasks: Task[], tone = '') => tasks.length > 0 && (
    <div>
      <p className={`mb-1 px-2 text-xs font-semibold uppercase tracking-wide ${tone || 'text-muted'}`}>{title}</p>
      {tasks.map(t => <TaskRow key={t.key} t={t} onClick={() => open(t)} onToggle={() => toggle(t)} />)}
    </div>
  )

  const nothing = d && !d.overdue.length && !d.today.length && !d.week.length

  return (
    <div className="h-full overflow-auto px-10 pb-10 pt-10">
      <div className="mx-auto max-w-4xl space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm capitalize text-muted">{dateLabel}</p>
            <h1 className="text-3xl font-bold tracking-tight">{greeting()} 👋</h1>
          </div>
          <Button onClick={() => ask('Plánea mi día: revisa mis pendientes, mi calendario y lo que traigo flojo, y dime qué hago hoy, en qué orden y cuánto tiempo, en una lista corta.')}>✨ Plan my day</Button>
        </div>

        <div className="grid gap-5 md:grid-cols-5">
          <Card className="md:col-span-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-semibold">To do</p>
              <button className="text-xs text-muted underline" onClick={() => go({ screen: 'tasks' })}>All tasks</button>
            </div>
            {!d && <p className="text-sm text-muted">Loading…</p>}
            {nothing && <p className="px-2 py-4 text-sm text-muted">Nothing due this week 🎉 Tell the chat about any homework or exam and it shows up here.</p>}
            <div className="space-y-3">
              {d && section('Overdue', d.overdue, 'text-gap')}
              {d && section('Today', d.today, 'text-progress')}
              {d && section('This week', d.week)}
              {d && nothing && section('Later', d.later)}
            </div>
          </Card>

          <div className="space-y-5 md:col-span-2">
            <Card>
              <div className="mb-2 flex items-center justify-between">
                <p className="font-semibold">Next 7 days</p>
                <button className="text-xs text-muted underline" onClick={() => go({ screen: 'calendar' })}>Calendar</button>
              </div>
              {!d?.events.length && <p className="text-sm text-muted">No events.</p>}
              <ul className="space-y-1.5">
                {d?.events.slice(0, 8).map((e, i) => (
                  <li key={i}>
                    <button className="flex w-full gap-2 text-left text-sm" onClick={() => e.key ? go({ screen: 'tasks', task: e.key }) : e.path ? onOpenNote(e.path) : e.link && window.open(e.link)}>
                      <span className="w-20 shrink-0 text-xs text-muted">{new Date(`${e.date}T12:00:00`).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' })}{e.time ? ` ${e.time}` : ''}</span>
                      <span className="min-w-0 flex-1 truncate">{e.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </Card>

            <Card>
              <p className="mb-2 font-semibold">Still fuzzy</p>
              {!d?.struggles.length && <p className="text-sm text-muted">Nothing flagged. When you say "no entendí", it lands here.</p>}
              <ul className="space-y-2">
                {d?.struggles.map((s, i) => (
                  <li key={i}>
                    <button className="w-full text-left" onClick={() => ask(`Explícame "${s.topic}"${s.course ? ` de ${s.course}` : ''} usando mis notas, con un ejemplo, y luego hazme 2 preguntas para ver si ya lo entendí.`)}>
                      <span className="block text-sm">{s.topic}</span>
                      <span className="block text-xs text-muted">{[s.course, s.what].filter(Boolean).join(' · ')}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </Card>

            {d && (d.unfiled > 0 || d.inbox > 0) && (
              <Card className="text-sm">
                <p className="mb-1 font-semibold">Needs filing</p>
                {d.unfiled > 0 && <button className="block text-left underline" onClick={() => go({ screen: 'record' })}>{d.unfiled} recording{d.unfiled > 1 ? 's' : ''} not filed yet</button>}
                {d.inbox > 0 && <button className="block text-left underline" onClick={() => ask('Revisa mi 00-INBOX y archiva cada cosa en su materia. Si no estás seguro de alguna, pregúntame.')}>{d.inbox} item{d.inbox > 1 ? 's' : ''} in your inbox: file them</button>}
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
