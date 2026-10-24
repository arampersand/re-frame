// Dueño: Acciones + Frontend. Propuesta → permiso → acción → recibo.
import { useEffect, useState } from 'react'
import { api } from '@/api/client'
import type { AskResponse, Receipt, TodayView } from '@/api/contracts'
import { Button, Card, ErrorNote, StatusDot } from '@/components/ui'

const when = (iso: string) => new Date(iso).toLocaleString([], { weekday: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

function ReceiptLine({ r }: { r: Receipt }) {
  const color = r.status === 'sent' ? 'text-mastered' : r.status === 'failed' ? 'text-gap' : 'text-progress'
  return (
    <p className={`text-xs ${color}`}>
      Recibo: {r.status}{r.verified ? ' · verificado en Google' : ''}{r.reason ? ` · ${r.reason}` : ''}
      {r.external_url && <a className="ml-1 underline" href={r.external_url} target="_blank" rel="noreferrer">abrir</a>}
    </p>
  )
}

export function TodayScreen() {
  const [view, setView] = useState<TodayView | null>(null)
  const [receipts, setReceipts] = useState<Record<string, Receipt>>({})
  const [ask, setAsk] = useState('')
  const [answer, setAnswer] = useState<AskResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = () => api.today().then(setView).catch(e => setError(String(e)))
  useEffect(() => {
    load()
    api.receipts().then(rs => setReceipts(Object.fromEntries(rs.map(r => [r.action_id, r])))).catch(() => undefined)
  }, [])

  const approve = async (id: string) => {
    const r = await api.approve(id).catch(e => { setError(String(e)); return null })
    if (r) setReceipts(m => ({ ...m, [id]: r }))
    load()
  }
  const send = async () => { if (ask.trim()) setAnswer(await api.ask(ask)) }

  if (!view) return <ErrorNote error={error ?? null} />
  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-sm text-muted">Hola, {view.student.name.split(' ')[0]}</p>
          <h1 className="text-2xl font-semibold">Esto es lo que haría hoy por ti</h1>
        </div>
        <ErrorNote error={error} />
        {view.actions.map(a => (
          <Card key={a.id} className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{a.title}</p>
                <p className="text-sm text-muted">{when(a.start_at)} → {new Date(a.end_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              {a.status === 'proposed'
                ? <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => api.reject(a.id).then(load)}>No</Button>
                    <Button onClick={() => approve(a.id)}>Agendar</Button>
                  </div>
                : <span className="text-xs text-muted">{a.status}</span>}
            </div>
            <p className="text-sm">{a.why}</p>
            {receipts[a.id] && <ReceiptLine r={receipts[a.id]} />}
          </Card>
        ))}
        <Card className="flex flex-col gap-2">
          <p className="text-sm font-medium">Pregúntale a Re-Frame</p>
          <div className="flex gap-2">
            <input value={ask} onChange={e => setAsk(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ej. explícame heaps… o prueba: hazme la tarea 5"
              className="flex-1 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm" />
            <Button onClick={send}>Enviar</Button>
          </div>
          {answer && (
            <div className="text-sm">
              <p className={answer.refused ? 'text-progress' : ''}>{answer.message}</p>
              {answer.guided_steps.length > 0 && (
                <ol className="mt-1 list-decimal pl-5 text-muted">{answer.guided_steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
              )}
              {answer.suggested_action && <p className="mt-1 text-xs text-muted">Te dejé un bloque propuesto en tu lista.</p>}
            </div>
          )}
        </Card>
      </div>
      <div className="flex flex-col gap-4">
        <Card>
          <h2 className="mb-2 font-semibold">Próximas entregas</h2>
          {view.upcoming.map(d => (
            <div key={d.id} className="flex justify-between border-b border-border py-1.5 text-sm last:border-0">
              <span>{d.title}</span><span className="text-muted">{when(d.due_at)}</span>
            </div>
          ))}
        </Card>
        <Card>
          <h2 className="mb-2 font-semibold">Tus lagunas</h2>
          {view.weakest_topics.map(t => (
            <div key={t.id} className="flex items-center gap-2 py-1 text-sm">
              <StatusDot status={t.status} /><span className="flex-1">{t.title}</span>
              <span className="text-muted">{Math.round(t.score * 100)}%</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}
