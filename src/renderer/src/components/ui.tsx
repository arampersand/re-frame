import type { ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-card border border-border bg-surface p-4 ${className}`}>{children}</div>
}

export function Button({ children, onClick, variant = 'primary', disabled, className = '' }: {
  children: ReactNode; onClick?: () => void; variant?: 'primary' | 'ghost' | 'danger'; disabled?: boolean; className?: string
}) {
  const base = 'rounded-lg px-3 py-1.5 text-sm font-medium transition disabled:opacity-40'
  const style = variant === 'primary'
    ? 'bg-primary text-primary-ink hover:brightness-110'
    : variant === 'danger' ? 'bg-gap text-white hover:brightness-110'
    : 'border border-border text-text hover:bg-surface-2'
  return <button className={`${base} ${style} ${className}`} onClick={onClick} disabled={disabled}>{children}</button>
}

export function Dot({ ok }: { ok: boolean | null }) {
  const cls = ok === null ? 'bg-unseen' : ok ? 'bg-mastered' : 'bg-gap'
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${cls}`} />
}

/** Markdown with [[wikilinks]] shown as chips. */
export function Markdown({ text, onLink }: { text: string; onLink?: (path: string) => void }) {
  const body = text
    .replace(/^---\n[\s\S]*?\n---\n/, '')
    .replace(/\[\[([^\]|]+)(\|([^\]]+))?\]\]/g, (_m, p: string, _a, label?: string) =>
      `[${label ?? p.split('/').pop()}](wiki:${encodeURIComponent(p)})`)
  return (
    <div className="prose-rf">
      <ReactMarkdown remarkPlugins={[remarkGfm]} urlTransform={u => u}
        components={{
          a: ({ href, children }) => href?.startsWith('wiki:')
            ? <button className="wikilink" onClick={() => onLink?.(decodeURIComponent(href.slice(5)))}>{children}</button>
            : <a href={href} target="_blank" rel="noreferrer">{children}</a>
        }}>{body}</ReactMarkdown>
    </div>
  )
}
