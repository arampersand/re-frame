// Shared bits for tasks across Today, Tasks, Courses and Calendar.
export type Task = {
  key: string; date: string; time: string | null; title: string; kind: string; status: string
  course: string | null; courseName: string
}

const DAY = 86400000
const at = (t: Pick<Task, 'date' | 'time'>) => new Date(`${t.date}T${t.time ?? '23:59'}:00`)

/** "Overdue 2 days", "Today 10:00", "Tomorrow", "Thu 28", "in 12 days". */
export function due(t: Pick<Task, 'date' | 'time'>) {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const d = new Date(`${t.date}T00:00:00`)
  const days = Math.round((d.getTime() - today.getTime()) / DAY)
  const time = t.time ? ` · ${t.time}` : ''
  if (days < 0) return { label: `Overdue ${-days} ${days === -1 ? 'day' : 'days'}`, tone: 'text-gap' }
  if (days === 0) return { label: `Today${time}`, tone: 'text-progress' }
  if (days === 1) return { label: `Tomorrow${time}`, tone: 'text-progress' }
  if (days < 7) return { label: `${d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' })}${time}`, tone: 'text-text' }
  return { label: `${d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })} · in ${days} days`, tone: 'text-muted' }
}

export const KIND_ICON: Record<string, string> = { exam: '📝', quiz: '❓', homework: '📚', project: '🛠️', presentation: '🎤', class: '🏫' }
export const isLate = (t: Task) => at(t) < new Date() && t.status !== 'done'

export function TaskRow({ t, onClick, onToggle }: { t: Task; onClick?: () => void; onToggle?: () => void }) {
  const d = due(t)
  const done = t.status === 'done'
  return (
    <div className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-surface-2">
      {onToggle && (
        <button onClick={onToggle} title={done ? 'Mark pending' : 'Mark done'}
          className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border text-xs ${done ? 'border-mastered bg-mastered text-white' : 'border-muted hover:border-primary'}`}>
          {done ? '✓' : ''}
        </button>
      )}
      <button onClick={onClick} className="flex min-w-0 flex-1 items-center gap-3 text-left">
        <span>{KIND_ICON[t.kind] ?? '📌'}</span>
        <span className="min-w-0 flex-1">
          <span className={`block truncate text-sm ${done ? 'text-muted line-through' : ''}`}>{t.title}</span>
          {t.courseName && <span className="block truncate text-xs text-muted">{t.courseName}</span>}
        </span>
        <span className={`shrink-0 text-xs ${done ? 'text-muted' : d.tone}`}>{d.label}</span>
      </button>
    </div>
  )
}
