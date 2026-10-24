import type { ReactNode } from 'react'
import type { Topic } from '@/api/contracts'

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-card border border-border bg-surface p-4 ${className}`}>{children}</div>
}

export function Button({ children, onClick, variant = 'primary', disabled }: {
  children: ReactNode; onClick?: () => void; variant?: 'primary' | 'ghost'; disabled?: boolean
}) {
  const base = 'rounded-lg px-3 py-1.5 text-sm font-medium transition disabled:opacity-40'
  const style = variant === 'primary'
    ? 'bg-primary text-primary-ink hover:brightness-110'
    : 'border border-border text-text hover:bg-surface-2'
  return <button className={`${base} ${style}`} onClick={onClick} disabled={disabled}>{children}</button>
}

const STATUS: Record<Topic['status'], { label: string; cls: string }> = {
  dominado: { label: 'Dominado', cls: 'bg-mastered' },
  en_progreso: { label: 'En progreso', cls: 'bg-progress' },
  laguna: { label: 'Laguna', cls: 'bg-gap' },
  sin_ver: { label: 'Sin ver', cls: 'bg-unseen' }
}

export function StatusDot({ status }: { status: Topic['status'] }) {
  return <span title={STATUS[status].label} className={`inline-block h-2.5 w-2.5 rounded-full ${STATUS[status].cls}`} />
}
export const statusLabel = (s: Topic['status']) => STATUS[s].label

export function ErrorNote({ error }: { error: string | null }) {
  return error ? <p className="text-sm text-gap">{error}</p> : null
}
