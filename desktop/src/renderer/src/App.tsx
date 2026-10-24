// Dueño: Integrador. Navegación. Para agregar una pantalla: una línea en NAV y un case en render.
import { useEffect, useState } from 'react'
import { api } from '@/api/client'
import { TodayScreen } from '@/features/today/TodayScreen'
import { LectureScreen } from '@/features/lecture/LectureScreen'
import { TopicsScreen } from '@/features/topics/TopicsScreen'
import { ReceiptsScreen } from '@/features/receipts/ReceiptsScreen'
import { OnboardingScreen } from '@/features/onboarding/OnboardingScreen'

type ScreenId = 'today' | 'lecture' | 'topics' | 'receipts' | 'profile'

const NAV: { id: ScreenId; label: string }[] = [
  { id: 'today', label: 'Hoy' },
  { id: 'lecture', label: 'Clase' },
  { id: 'topics', label: 'Mis temas' },
  { id: 'receipts', label: 'Recibos' },
  { id: 'profile', label: 'Mi perfil' }
]

export function App() {
  const [screen, setScreen] = useState<ScreenId>('today')
  const [online, setOnline] = useState<boolean | null>(null)
  useEffect(() => {
    api.health().then(() => setOnline(true)).catch(() => setOnline(false))
    // Primera vez: si el perfil no está confirmado, arranca en el onboarding.
    api.onboarding().then(s => !s.profile.confirmed && setScreen('profile')).catch(() => undefined)
  }, [])

  const render = (id: ScreenId) => {
    switch (id) {
      case 'today': return <TodayScreen />
      case 'lecture': return <LectureScreen />
      case 'topics': return <TopicsScreen />
      case 'receipts': return <ReceiptsScreen />
      case 'profile': return <OnboardingScreen onDone={() => setScreen('today')} />
    }
  }

  return (
    <div className="flex h-full">
      <nav className="flex w-52 flex-col gap-1 border-r border-border bg-surface p-3">
        <p className="mb-4 px-2 text-lg font-bold tracking-tight">Re-Frame</p>
        {NAV.map(s => (
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
        {online === false ? null : render(screen)}
      </main>
    </div>
  )
}
