import { useEffect, useState } from 'react'
import { rf } from '@/api'
import { Dot } from '@/components/ui'
import { ChatScreen } from '@/features/chat/ChatScreen'
import { BrainScreen } from '@/features/brain/BrainScreen'
import { RecordScreen } from '@/features/record/RecordScreen'
import { IntegrationsScreen } from '@/features/integrations/IntegrationsScreen'
import { Welcome } from '@/features/welcome/Welcome'

type ScreenId = 'chat' | 'brain' | 'record' | 'integrations'
const NAV: { id: ScreenId; label: string; icon: string }[] = [
  { id: 'chat', label: 'Chat', icon: '💬' },
  { id: 'record', label: 'Record class', icon: '🎙️' },
  { id: 'brain', label: 'My brain', icon: '🧠' },
  { id: 'integrations', label: 'Integrations', icon: '🔌' }
]

export function App() {
  const [screen, setScreen] = useState<ScreenId>('chat')
  const [note, setNote] = useState<string | null>(null)
  const [codexOk, setCodexOk] = useState<boolean | null>(null)
  const [groqOk, setGroqOk] = useState<boolean | null>(null)
  const [welcome, setWelcome] = useState(false)

  const refreshStatus = () => {
    rf.codex.status().then(s => setCodexOk(s.loggedIn))
    rf.stt.status().then(s => setGroqOk(s.ready))
  }
  useEffect(refreshStatus, [screen])
  useEffect(() => { rf.codex.status().then(s => setWelcome(!s.loggedIn)) }, [])

  const openNote = (path: string) => {
    setNote(path.endsWith('.md') || path.endsWith('.pdf') ? path : `${path}.md`)
    setScreen('brain')
  }

  if (welcome) return <Welcome onDone={() => { setWelcome(false); refreshStatus() }} />

  return (
    <div className="flex h-full">
      <nav className="flex w-56 flex-col gap-1 border-r border-border bg-surface p-3 pt-10 drag">
        <p className="mb-5 px-2 text-lg font-bold tracking-tight">MyBrainBook</p>
        {NAV.map(s => (
          <button key={s.id} onClick={() => setScreen(s.id)}
            className={`no-drag flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm ${screen === s.id ? 'bg-primary text-primary-ink' : 'text-muted hover:bg-surface-2'}`}>
            <span>{s.icon}</span>{s.label}
          </button>
        ))}
        <div className="no-drag mt-auto space-y-1.5 px-2 text-xs text-muted">
          <button className="flex items-center gap-2" onClick={() => setScreen('integrations')}><Dot ok={codexOk} /> AI · Codex</button>
          <button className="flex items-center gap-2" onClick={() => setScreen('integrations')}><Dot ok={groqOk} /> Transcription</button>
        </div>
      </nav>
      <main className="min-w-0 flex-1 overflow-hidden">
        {screen === 'chat' && <ChatScreen onOpenNote={openNote} />}
        {screen === 'record' && <RecordScreen onOpenNote={openNote} onSetup={() => setScreen('integrations')} />}
        {screen === 'brain' && <BrainScreen selected={note} onSelect={setNote} />}
        {screen === 'integrations' && <IntegrationsScreen onChange={refreshStatus} />}
      </main>
    </div>
  )
}
