// Dueño: Explicador. Las 4 representaciones + quiz que actualiza el estado del tema.
import { useEffect, useState } from 'react'
import { api } from '@/api/client'
import type { Explanation, ExplainRequest } from '@/api/contracts'
import { Button, Card, ErrorNote } from '@/components/ui'
import { Mermaid } from '@/components/Mermaid'

const TABS = [
  ['diagram', 'Diagrama'], ['analogy', 'Analogía'], ['example', 'Ejemplo'], ['summary', 'Resumen']
] as const
type Tab = (typeof TABS)[number][0]

export function ExplainPanel({ request, onClose }: { request: ExplainRequest; onClose: () => void }) {
  const [exp, setExp] = useState<Explanation | null>(null)
  const [tab, setTab] = useState<Tab>('diagram')
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [graded, setGraded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setExp(null); setAnswers({}); setGraded(false); setError(null)
    api.explain(request).then(setExp).catch(e => setError(String(e)))
  }, [request])

  const grade = async () => {
    if (!exp) return
    const correct = exp.quiz.filter(q => answers[q.id] === q.answer_index).length
    setGraded(true)
    if (exp.topic_id) await api.quiz(exp.topic_id, { correct, total: exp.quiz.length }).catch(() => undefined)
  }

  return (
    <Card className="flex h-full flex-col gap-3 overflow-auto">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">Re-Frame</p>
          <h2 className="text-lg font-semibold">{exp?.topic_title ?? 'Pensando…'}</h2>
          {exp?.degraded && <p className="text-xs text-progress">Modo sin LLM: contenido de respaldo</p>}
        </div>
        <Button variant="ghost" onClick={onClose}>Cerrar</Button>
      </div>
      <ErrorNote error={error} />
      {exp && (
        <>
          <div className="flex gap-1">
            {TABS.map(([k, label]) => (
              <button key={k} onClick={() => setTab(k)}
                className={`rounded-md px-2.5 py-1 text-sm ${tab === k ? 'bg-primary text-primary-ink' : 'text-muted hover:bg-surface-2'}`}>
                {label}
              </button>
            ))}
          </div>
          <div className="min-h-40 overflow-hidden rounded-lg bg-surface-2 p-3 text-sm leading-relaxed whitespace-pre-wrap">
            {tab === 'diagram' && <Mermaid code={exp.diagram_mermaid} />}
            {tab === 'analogy' && exp.analogy}
            {tab === 'example' && <span className="font-mono text-[13px]">{exp.worked_example}</span>}
            {tab === 'summary' && exp.summary}
          </div>
          {exp.quiz.length > 0 && (
            <div className="flex flex-col gap-3">
              <h3 className="font-semibold">¿Ya quedó? Quiz de {exp.quiz.length}</h3>
              {exp.quiz.map(q => (
                <div key={q.id} className="text-sm">
                  <p className="mb-1">{q.prompt}</p>
                  <div className="grid gap-1">
                    {q.options.map((o, i) => {
                      const picked = answers[q.id] === i
                      const color = graded && i === q.answer_index ? 'border-mastered'
                        : graded && picked ? 'border-gap' : picked ? 'border-primary' : 'border-border'
                      return (
                        <button key={i} disabled={graded} onClick={() => setAnswers(a => ({ ...a, [q.id]: i }))}
                          className={`rounded-md border px-2 py-1 text-left ${color}`}>{o}</button>
                      )
                    })}
                  </div>
                  {graded && q.why && <p className="mt-1 text-xs text-muted">{q.why}</p>}
                </div>
              ))}
              {!graded && (
                <Button onClick={grade} disabled={Object.keys(answers).length < exp.quiz.length}>Calificar</Button>
              )}
            </div>
          )}
        </>
      )}
    </Card>
  )
}
