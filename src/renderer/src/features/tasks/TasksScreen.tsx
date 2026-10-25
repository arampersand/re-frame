// Every deadline from the brain; open one to see its context and related notes.
import { useEffect, useState } from 'react'
import { rf } from '@/api'
import { Button, Card } from '@/components/ui'
import type { Nav } from '@/App'
import { TaskRow, due, KIND_ICON, type Task } from './shared'

type Context = { task: Task; related: { path: string; title: string; date: string | null }[]; courseIndex: string | null }

export function TasksScreen({ initial, go, ask, onOpenNote, onChange }: {
  initial?: string; go: (n: Nav) => void; ask: (q: string) => void; onOpenNote: (p: string) => void; onChange: () => void
}) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selected, setSelected] = useState<string | null>(initial ?? null)
  const [ctx, setCtx] = useState<Context | null>(null)
  const [showDone, setShowDone] = useState(false)

  const load = () => rf.dash.tasks().then(setTasks)
  useEffect(() => { load() }, [])
  useEffect(() => { if (selected) rf.dash.taskContext(selected).then(setCtx); else setCtx(null) }, [selected, tasks])

  const toggle = async (t: Task) => { await rf.dash.taskStatus(t.key, t.status === 'done' ? 'pending' : 'done'); await load(); onChange() }
  const open = tasks.filter(t => t.status !== 'done')
  const done = tasks.filter(t => t.status === 'done').reverse()

  return (
    <div className="flex h-full">
      <div className="w-[26rem] shrink-0 overflow-auto border-r border-border p-4 pt-10">
        <h1 className="mb-3 px-2 text-2xl font-bold">Tasks</h1>
        {!tasks.length && <p className="px-2 text-sm text-muted">No tasks yet. Tell the chat about homework, exams or projects, or drop the syllabus, and they show up here (and in your calendar).</p>}
        {open.map(t => (
          <div key={t.key} className={selected === t.key ? 'rounded-lg ring-1 ring-primary' : ''}>
            <TaskRow t={t} onClick={() => setSelected(t.key)} onToggle={() => toggle(t)} />
          </div>
        ))}
        {done.length > 0 && (
          <button className="mt-4 px-2 text-xs text-muted underline" onClick={() => setShowDone(s => !s)}>
            {showDone ? 'Hide' : 'Show'} {done.length} done
          </button>
        )}
        {showDone && done.map(t => <TaskRow key={t.key} t={t} onClick={() => setSelected(t.key)} onToggle={() => toggle(t)} />)}
      </div>

      <div className="flex-1 overflow-auto px-10 pb-10 pt-10">
        {!ctx && <p className="mt-24 text-center text-muted">Pick a task to see what it's about.</p>}
        {ctx && (() => {
          const t = ctx.task
          const d = due(t)
          return (
            <div className="mx-auto max-w-2xl space-y-5">
              <div>
                <p className="text-sm text-muted">{KIND_ICON[t.kind] ?? '📌'} {t.kind || 'task'}{t.courseName ? ` · ${t.courseName}` : ''}</p>
                <h2 className="mt-1 text-3xl font-bold tracking-tight">{t.title}</h2>
                <p className={`mt-2 text-lg ${t.status === 'done' ? 'text-mastered' : d.tone}`}>
                  {t.status === 'done' ? '✓ Done' : d.label}
                  <span className="ml-2 text-sm text-muted">{new Date(`${t.date}T12:00:00`).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}{t.time ? ` · ${t.time}` : ''}</span>
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => ask(`Dame el contexto completo de "${t.title}"${t.courseName ? ` (${t.courseName})` : ''}, para el ${t.date}: qué piden exactamente, con qué criterios me califican, qué material de mis notas me sirve, cómo voy y cuáles son los siguientes 3 pasos. Explica, no lo hagas por mí.`)}>✨ Get full context</Button>
                <Button variant="ghost" onClick={() => toggle(t)}>{t.status === 'done' ? 'Mark as pending' : '✓ Mark done'}</Button>
                {t.course && <Button variant="ghost" onClick={() => go({ screen: 'course', slug: t.course! })}>Open course</Button>}
              </div>
              <Card>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Related notes</p>
                {!ctx.related.length && <p className="text-sm text-muted">No notes found with this name yet. "Get full context" searches your whole brain.</p>}
                <ul className="space-y-1">
                  {ctx.related.map(n => (
                    <li key={n.path}><button className="w-full truncate text-left text-sm hover:underline" onClick={() => onOpenNote(n.path)}>📝 {n.title}<span className="ml-2 text-xs text-muted">{n.path.split('/').slice(-2, -1)[0]}</span></button></li>
                  ))}
                  {ctx.courseIndex && <li><button className="text-left text-sm hover:underline" onClick={() => onOpenNote(ctx.courseIndex!)}>📘 Course overview</button></li>}
                </ul>
              </Card>
            </div>
          )
        })()}
      </div>
    </div>
  )
}
