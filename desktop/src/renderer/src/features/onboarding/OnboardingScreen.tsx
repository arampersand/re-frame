// Dueño: Magio (UI) + Ary (motor). Elicitación de 8 preguntas, una a la vez,
// y al final "esto entendí de ti" con corrección. Diseño: docs/USER-JOURNEY.md.
import { useEffect, useState } from 'react'
import { api } from '@/api/client'
import type { OnboardingAnswer, OnboardingQuestion, OnboardingState, Reflection } from '@/api/contracts'
import { Button, Card, ErrorNote } from '@/components/ui'

// Solo las respuestas abiertas se corrigen con texto libre; las de opción se
// corrigen rehaciendo el onboarding (sus valores alimentan reglas exactas).
const EDITABLE = new Set(['goal', 'stake', 'help_style'])

const SOURCE: Record<Reflection['source'], string> = {
  measured: 'medido', stated: 'lo dijiste', inferred: 'inferido', imported: 'importado'
}

function Question({ q, busy, onAnswer }: {
  q: OnboardingQuestion; busy: boolean; onAnswer: (a: OnboardingAnswer) => void
}) {
  const [text, setText] = useState('')
  useEffect(() => setText(''), [q.id])
  const submitText = () => text.trim() && onAnswer({ question_id: q.id, text: text.trim() })

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold leading-tight text-balance">{q.prompt}</h2>
        <p className="text-sm text-muted">Por qué te pregunto: {q.why}</p>
      </div>

      {q.kind === 'text' && (
        <div className="flex flex-col gap-2">
          <textarea id={`q-${q.id}`} autoFocus rows={3} value={text} disabled={busy}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.metaKey || e.ctrlKey) && submitText()}
            placeholder="Escribe como le contarías a un amigo…"
            className="w-full resize-none rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-primary" />
          <div><Button onClick={submitText} disabled={busy || !text.trim()}>Continuar</Button></div>
        </div>
      )}

      {q.kind === 'choice' && (
        <div className="grid gap-2 sm:grid-cols-2">
          {q.options.map(o => (
            <button key={o.id} disabled={busy} onClick={() => onAnswer({ question_id: q.id, option_id: o.id })}
              className="rounded-lg border border-border bg-surface px-4 py-3 text-left text-sm hover:border-primary hover:bg-surface-2 disabled:opacity-50">
              {o.label}
            </button>
          ))}
        </div>
      )}

      {q.kind === 'contrast' && (
        <div className="grid gap-3 sm:grid-cols-2">
          {q.options.map((o, i) => (
            <button key={o.id} disabled={busy} onClick={() => onAnswer({ question_id: q.id, option_id: o.id })}
              className="flex flex-col gap-2 rounded-card border border-border bg-surface p-4 text-left hover:border-primary disabled:opacity-50">
              <span className="font-mono text-xs text-muted">Opción {String.fromCharCode(65 + i)}</span>
              <span className="text-sm leading-relaxed">{o.label}</span>
            </button>
          ))}
        </div>
      )}

      {q.allow_skip && (
        <button disabled={busy} onClick={() => onAnswer({ question_id: q.id, skipped: true })}
          className="self-start text-sm text-muted underline hover:text-text">
          Prefiero no contestar
        </button>
      )}
    </div>
  )
}

function Reflections({ state, busy, onConfirm, onRestart }: {
  state: OnboardingState; busy: boolean
  onConfirm: (c: Record<string, string>) => void; onRestart: () => void
}) {
  const [edits, setEdits] = useState<Record<string, string>>({})
  const [editing, setEditing] = useState<string | null>(null)
  const confirmed = state.profile.confirmed

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold">{confirmed ? 'Lo que sé de ti' : 'Esto entendí de ti'}</h2>
        <p className="text-sm text-muted">
          {confirmed
            ? 'Así ajusto tus bloques de estudio y tus explicaciones.'
            : 'Corrige lo que esté mal. Lo que corrijas pesa más que cualquier cosa que yo infiera.'}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {state.reflections.map(r => (
          <Card key={r.slot} className="flex items-start gap-3 py-3">
            <div className="flex-1 text-sm">
              {editing === r.slot ? (
                <input id={`fix-${r.slot}`} autoFocus value={edits[r.slot] ?? ''}
                  onChange={e => setEdits(x => ({ ...x, [r.slot]: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && setEditing(null)}
                  placeholder="Escríbelo como es en realidad"
                  className="w-full rounded-md border border-primary bg-surface-2 px-2 py-1" />
              ) : (
                <p>{edits[r.slot] ? <><span className="text-muted line-through">{r.statement}</span> {edits[r.slot]}</> : r.statement}</p>
              )}
            </div>
            <span className="rounded-full bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-muted">{SOURCE[r.source]}</span>
            {!confirmed && EDITABLE.has(r.slot) && (
              <button onClick={() => setEditing(editing === r.slot ? null : r.slot)}
                className="text-xs text-primary underline">{editing === r.slot ? 'Listo' : 'Corregir'}</button>
            )}
          </Card>
        ))}
        {state.reflections.length === 0 && <p className="text-sm text-muted">Saltaste todo. Te iré conociendo con el uso.</p>}
      </div>
      <div className="flex flex-wrap gap-2">
        {!confirmed && <Button onClick={() => onConfirm(edits)} disabled={busy}>Así soy, empezar</Button>}
        <Button variant="ghost" onClick={onRestart} disabled={busy}>Rehacer desde el inicio</Button>
      </div>
    </div>
  )
}

export function OnboardingScreen({ onDone }: { onDone: () => void }) {
  const [state, setState] = useState<OnboardingState | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { api.onboarding().then(setState).catch(e => setError(String(e))) }, [])

  const run = async (fn: () => Promise<OnboardingState>) => {
    setBusy(true); setError(null)
    try { setState(await fn()) } catch (e) { setError(String(e)) } finally { setBusy(false) }
  }

  if (!state) return <ErrorNote error={error} />
  const pct = Math.min(100, Math.round((state.step / state.total_estimate) * 100))

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 py-4">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between font-mono text-xs text-muted">
          <span>{state.done ? 'Tu perfil' : `Pregunta ${state.step + 1} de ~${state.total_estimate}`}</span>
          {busy && <span>pensando…</span>}
        </div>
        <div className="h-1 rounded bg-surface-2">
          <div className="h-1 rounded bg-primary transition-all" style={{ width: `${state.done ? 100 : pct}%` }} />
        </div>
      </div>
      <ErrorNote error={error} />
      {state.next_question
        ? <Question q={state.next_question} busy={busy} onAnswer={a => run(() => api.onboardingAnswer(a))} />
        : <Reflections state={state} busy={busy}
            onConfirm={async c => { await run(() => api.onboardingConfirm(c)); onDone() }}
            onRestart={() => run(api.onboardingStart)} />}
    </div>
  )
}
