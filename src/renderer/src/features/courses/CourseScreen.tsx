// One course: its overview note plus everything filed under it.
import { useEffect, useState } from 'react'
import { rf } from '@/api'
import { Button, Card, Markdown } from '@/components/ui'
import type { Nav } from '@/App'
import { TaskRow, type Task } from '@/features/tasks/shared'

type NoteRef = { path: string; title: string; date: string | null }
type Course = {
  slug: string; index: string; indexPath: string
  lectures: NoteRef[]; readings: NoteRef[]; assignments: NoteRef[]; notes: NoteRef[]
  tasks: Task[]; recordings: { audio: string; note: string | null; title: string; date: string }[]
}

function List({ title, items, onOpen, empty }: { title: string; items: NoteRef[]; onOpen: (p: string) => void; empty: string }) {
  return (
    <Card>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{title} · {items.length}</p>
      {!items.length && <p className="text-sm text-muted">{empty}</p>}
      <ul className="space-y-1">
        {items.slice(0, 12).map(n => (
          <li key={n.path}>
            <button className="flex w-full gap-2 text-left text-sm hover:underline" onClick={() => onOpen(n.path)}>
              <span className="min-w-0 flex-1 truncate">{n.title}</span>
              {n.date && <span className="shrink-0 text-xs text-muted">{new Date(`${n.date}T12:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span>}
            </button>
          </li>
        ))}
      </ul>
    </Card>
  )
}

export function CourseScreen({ slug, go, ask, onOpenNote }: { slug: string; go: (n: Nav) => void; ask: (q: string) => void; onOpenNote: (p: string) => void }) {
  const [c, setC] = useState<Course | null>(null)
  const [tab, setTab] = useState<'overview' | 'notes'>('overview')
  const load = () => rf.dash.course(slug).then(setC)
  useEffect(() => { load() }, [slug])
  if (!c) return <div className="p-10 text-muted">Loading…</div>

  const name = c.index.match(/^# (.+)$/m)?.[1]?.replace(/\s*[—-]\s*\d+º?.*$/, '') ?? slug.replace(/-/g, ' ').replace(/(^|\s)(\p{L})/gu, (_m, sp: string, ch: string) => sp + ch.toUpperCase())
  const open = c.tasks.filter(t => t.status !== 'done')
  const toggle = async (t: Task) => { await rf.dash.taskStatus(t.key, t.status === 'done' ? 'pending' : 'done'); load() }

  return (
    <div className="h-full overflow-auto px-10 pb-10 pt-10">
      <div className="mx-auto max-w-5xl space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted">Course</p>
            <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => ask(`Sobre la materia "${name}": ¿cómo voy, qué temas traigo flojos, qué viene en las próximas entregas y qué debería estudiar esta semana? Usa mis notas de esta materia.`)}>✨ How am I doing?</Button>
            <Button variant="ghost" onClick={() => onOpenNote(c.indexPath)}>Open note</Button>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-5">
          <div className="space-y-5 md:col-span-3">
            <Card>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Pending · {open.length}</p>
              {!open.length && <p className="text-sm text-muted">Nothing pending in this course.</p>}
              {open.map(t => <TaskRow key={t.key} t={t} onClick={() => go({ screen: 'tasks', task: t.key })} onToggle={() => toggle(t)} />)}
            </Card>
            <Card>
              <div className="mb-3 flex gap-3 text-sm">
                {(['overview', 'notes'] as const).map(k => (
                  <button key={k} onClick={() => setTab(k)} className={tab === k ? 'font-semibold' : 'text-muted'}>{k === 'overview' ? 'Overview' : 'My notes'}</button>
                ))}
              </div>
              {tab === 'overview'
                ? (c.index ? <Markdown text={c.index.replace(/^# .+\n/m, '')} onLink={onOpenNote} /> : <p className="text-sm text-muted">No overview yet.</p>)
                : <List title="Notes" items={c.notes} onOpen={onOpenNote} empty="Ask the chat to make you a summary or study guide and it lands here." />}
            </Card>
          </div>
          <div className="space-y-5 md:col-span-2">
            <List title="Classes" items={c.lectures} onOpen={onOpenNote} empty="Record a class and it lands here." />
            <List title="Assignments" items={c.assignments} onOpen={onOpenNote} empty="Homework and reports land here." />
            <List title="Readings" items={c.readings} onOpen={onOpenNote} empty="Drop PDFs or slides in the chat." />
          </div>
        </div>
      </div>
    </div>
  )
}
