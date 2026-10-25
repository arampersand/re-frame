import { useEffect, useState } from 'react'
import { rf } from '@/api'
import { Dot } from '@/components/ui'
import { ChatScreen } from '@/features/chat/ChatScreen'
import { BrainScreen } from '@/features/brain/BrainScreen'
import { RecordScreen } from '@/features/record/RecordScreen'
import { IntegrationsScreen } from '@/features/integrations/IntegrationsScreen'
import { Welcome } from '@/features/welcome/Welcome'
import { TodayScreen } from '@/features/today/TodayScreen'
import { CourseScreen } from '@/features/courses/CourseScreen'
import { TasksScreen } from '@/features/tasks/TasksScreen'
import { CalendarScreen } from '@/features/calendar/CalendarScreen'

export type Nav =
  | { screen: 'today' | 'chat' | 'record' | 'brain' | 'integrations' | 'calendar' }
  | { screen: 'tasks'; task?: string }
  | { screen: 'course'; slug: string }
type Course = { slug: string; name: string; pending: number }

const MAIN: { screen: 'today' | 'chat' | 'tasks' | 'calendar' | 'record'; label: string; icon: string }[] = [
  { screen: 'today', label: 'Today', icon: '☀️' },
  { screen: 'chat', label: 'Chat', icon: '💬' },
  { screen: 'tasks', label: 'Tasks', icon: '✅' },
  { screen: 'calendar', label: 'Calendar', icon: '📅' },
  { screen: 'record', label: 'Record class', icon: '🎙️' }
]

export function App() {
  const [nav, setNav] = useState<Nav>({ screen: 'today' })
  const [note, setNote] = useState<string | null>(null)
  const [chatSeed, setChatSeed] = useState<{ text: string; n: number } | null>(null)
  const [codexOk, setCodexOk] = useState<boolean | null>(null)
  const [sttOk, setSttOk] = useState<boolean | null>(null)
  const [welcome, setWelcome] = useState(false)
  const [courses, setCourses] = useState<Course[]>([])
  const [openTasks, setOpenTasks] = useState(0)
  const [coursesOpen, setCoursesOpen] = useState(true)

  const refreshStatus = () => {
    rf.codex.status().then(s => setCodexOk(s.loggedIn))
    rf.stt.status().then(s => setSttOk(s.ready))
    rf.dash.courses().then(setCourses)
    rf.dash.tasks().then((t: { status: string }[]) => setOpenTasks(t.filter(x => x.status !== 'done').length))
  }
  useEffect(refreshStatus, [nav])
  useEffect(() => { rf.codex.status().then(s => setWelcome(!s.loggedIn)) }, [])

  const openNote = (path: string) => {
    setNote(/\.(md|pdf|m4a|wav)$/i.test(path) ? path : `${path}.md`)
    setNav({ screen: 'brain' })
  }
  /** Opens a fresh chat and sends this question right away. */
  const ask = (text: string) => { setChatSeed({ text, n: Date.now() }); setNav({ screen: 'chat' }) }

  if (welcome) return <Welcome onDone={() => { setWelcome(false); refreshStatus() }} />

  const item = (active: boolean) =>
    `no-drag flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm ${active ? 'bg-primary text-primary-ink' : 'text-muted hover:bg-surface-2'}`

  return (
    <div className="flex h-full">
      <nav className="flex w-56 flex-col gap-1 overflow-y-auto border-r border-border bg-surface p-3 pt-10 drag">
        <p className="mb-5 px-2 text-lg font-bold tracking-tight">MyBrainBook</p>
        {MAIN.map(s => (
          <button key={s.screen} onClick={() => setNav({ screen: s.screen } as Nav)} className={item(nav.screen === s.screen)}>
            <span>{s.icon}</span><span className="flex-1">{s.label}</span>
            {s.screen === 'tasks' && openTasks > 0 && <span className={`rounded-full px-1.5 text-xs ${nav.screen === 'tasks' ? 'bg-white/20' : 'bg-surface-2'}`}>{openTasks}</span>}
          </button>
        ))}

        <button onClick={() => setCoursesOpen(o => !o)} className="no-drag mt-4 flex items-center justify-between px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted">
          Courses <span>{coursesOpen ? '▾' : '▸'}</span>
        </button>
        {coursesOpen && courses.map(c => (
          <button key={c.slug} onClick={() => setNav({ screen: 'course', slug: c.slug })}
            className={item(nav.screen === 'course' && nav.slug === c.slug)} title={c.name}>
            <span className="flex-1 truncate">{c.name}</span>
            {c.pending > 0 && <span className="rounded-full bg-progress/20 px-1.5 text-xs text-progress">{c.pending}</span>}
          </button>
        ))}
        {coursesOpen && !courses.length && <p className="px-3 text-xs text-muted">They appear as you record classes and add files.</p>}

        <div className="mt-4 space-y-1">
          <button onClick={() => setNav({ screen: 'brain' })} className={item(nav.screen === 'brain')}><span>🧠</span>My brain</button>
          <button onClick={() => setNav({ screen: 'integrations' })} className={item(nav.screen === 'integrations')}><span>🔌</span>Integrations</button>
        </div>

        <div className="no-drag mt-auto space-y-1.5 px-2 pt-4 text-xs text-muted">
          <button className="flex items-center gap-2" onClick={() => setNav({ screen: 'integrations' })}><Dot ok={codexOk} /> AI · Codex</button>
          <button className="flex items-center gap-2" onClick={() => setNav({ screen: 'integrations' })}><Dot ok={sttOk} /> Transcription</button>
        </div>
      </nav>
      <main className="min-w-0 flex-1 overflow-hidden">
        {nav.screen === 'today' && <TodayScreen go={setNav} ask={ask} onOpenNote={openNote} />}
        {nav.screen === 'chat' && <ChatScreen onOpenNote={openNote} seed={chatSeed} />}
        {nav.screen === 'tasks' && <TasksScreen key={nav.task ?? 'all'} initial={nav.task} go={setNav} ask={ask} onOpenNote={openNote} onChange={refreshStatus} />}
        {nav.screen === 'calendar' && <CalendarScreen go={setNav} onOpenNote={openNote} />}
        {nav.screen === 'course' && <CourseScreen key={nav.slug} slug={nav.slug} go={setNav} ask={ask} onOpenNote={openNote} />}
        {nav.screen === 'record' && <RecordScreen onOpenNote={openNote} onSetup={() => setNav({ screen: 'integrations' })} />}
        {nav.screen === 'brain' && <BrainScreen selected={note} onSelect={setNote} />}
        {nav.screen === 'integrations' && <IntegrationsScreen onChange={refreshStatus} />}
      </main>
    </div>
  )
}
