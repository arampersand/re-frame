// Dueño: Integrador. Navegación. Para agregar una pantalla: una línea en SCREENS.
import { useEffect, useState } from 'react'
import { api } from '@/api/client'
import { TodayScreen } from '@/features/today/TodayScreen'
import { LectureScreen } from '@/features/lecture/LectureScreen'
import { TopicsScreen } from '@/features/topics/TopicsScreen'
import { ReceiptsScreen } from '@/features/receipts/ReceiptsScreen'

const SCREENS = [
  { id: 'today', label: 'Hoy', el: <TodayScreen /> },
  { id: 'lecture', label: 'Clase', el: <LectureScreen /> },
  { id: 'topics', label: 'Mis temas', el: <TopicsScreen /> },
  { id: 'receipts', label: 'Recibos', el: <ReceiptsScreen /> }
] as const

export function App() {
  const [screen, setScreen] = useState<(typeof SCREENS)[number]['id']>('today')
  const [online, setOnline] = useState<boolean | null>(null)
  useEffect(() => { api.health().then(() => setOnline(true)).catch(() => setOnline(false)) }, [])

  return (
    <div className="flex h-full">
      <nav className="flex w-52 flex-col gap-1 border-r border-border bg-surface p-3">
        <p className="mb-4 px-2 text-lg font-bold tracking-tight">Re-Frame</p>
        {SCREENS.map(s => (
          <button key={s.id} onClick={() => setScreen(s.id)}
            className={`rounded-lg px-3 py-2 text-left text-sm ${screen === s.id ? 'bg-primary text-primary-ink' : 'text-muted hover:bg-surface-2'}`}>
            {s.label}
          </button>
        ))}
        <div className="mt-auto px-2 text-xs text-muted">
          {online === false ? <span className="text-gap">Backend apagado: corre make backend</span> : online ? 'Conectado' : '…'}
        </div>
      </nav>
      <main className="min-w-0 flex-1 overflow-auto p-6">
        {online === false ? null : SCREENS.find(s => s.id === screen)?.el}
      </main>
    </div>
  )
}
