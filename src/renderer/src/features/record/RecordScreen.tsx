import { useEffect, useRef, useState } from 'react'
import { rf, listen, type CodexEvent } from '@/api'
import { Button, Card, Markdown } from '@/components/ui'
import { useRecorder } from './useRecorder'

type Line = { offsetS: number; text?: string; error?: string }
const stamp = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

export function RecordScreen({ onOpenNote }: { onOpenNote: (p: string) => void }) {
  const [lines, setLines] = useState<Line[]>([])
  const [phase, setPhase] = useState<'idle' | 'recording' | 'processing' | 'done'>('idle')
  const [steps, setSteps] = useState<string[]>([])
  const [result, setResult] = useState('')
  const [elapsed, setElapsed] = useState(0)
  const rel = useRef<string | null>(null)

  useEffect(() => listen(rf.audio.onText, (t: Line & { rel: string }) => {
    if (t.rel === rel.current) setLines(l => [...l, t].sort((a, b) => a.offsetS - b.offsetS))
  }), [])
  useEffect(() => listen(rf.onTask, (e: CodexEvent & { task: string }) => {
    if (e.task === 'lecture' && e.kind === 'command') setSteps(s => [...s, e.text!])
  }), [])
  useEffect(() => {
    if (phase !== 'recording') return
    const t = window.setInterval(() => setElapsed(e => e + 1), 1000)
    return () => window.clearInterval(t)
  }, [phase])

  const recorder = useRecorder(async (blob, offsetS) => {
    if (rel.current) rf.audio.chunk(rel.current, await blob.arrayBuffer(), offsetS)
  })

  const start = async () => {
    rel.current = await rf.audio.start()
    setLines([]); setSteps([]); setResult(''); setElapsed(0)
    await recorder.start()
    setPhase('recording')
  }

  const stop = async () => {
    recorder.stop()
    setPhase('processing')
    // Let the last chunk upload before asking Codex to ingest.
    await new Promise(r => setTimeout(r, 800))
    const r = await rf.audio.finish(rel.current!)
    setResult(r.text || 'Done. Check the lecture in My brain.')
    setPhase('done')
  }

  return (
    <div className="h-full overflow-auto px-10 pb-10 pt-10">
      <div className="mx-auto max-w-3xl space-y-5">
        <div>
          <h1 className="text-2xl font-bold">Record class</h1>
          <p className="text-sm text-muted">Hit record when class starts. It transcribes every 15 seconds (Spanish or English) and when you stop, your brain figures out which class it was and files it with summary, key concepts and open questions. If it is not sure, it asks you.</p>
        </div>

        <Card className="flex items-center gap-4">
          {phase === 'recording'
            ? <Button variant="danger" onClick={stop}>■ Stop</Button>
            : <Button onClick={start} disabled={phase === 'processing'}>● Record</Button>}
          {phase === 'recording' && <span className="flex items-center gap-2 text-sm"><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-gap" /> {stamp(elapsed)}</span>}
          {phase === 'processing' && <span className="animate-pulse text-sm text-muted">Filing it in your brain…</span>}
        </Card>

        {(lines.length > 0 || phase === 'recording') && (
          <Card>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Live transcript</p>
            {lines.length === 0 && <p className="text-sm text-muted">Listening… first text in ~15 s.</p>}
            <div className="space-y-1.5 text-sm">
              {lines.map(l => (
                <p key={l.offsetS}><span className="mr-2 font-mono text-xs text-muted">{stamp(l.offsetS)}</span>
                  {l.error ? <span className="text-gap">{l.error}</span> : l.text}</p>
              ))}
            </div>
          </Card>
        )}

        {(phase === 'processing' || phase === 'done') && (
          <Card>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Your brain</p>
            <ul className="space-y-0.5 text-sm text-muted">{steps.map((s, i) => <li key={i}>🧠 {s}</li>)}</ul>
            {result && <div className="mt-3"><Markdown text={result} onLink={onOpenNote} /></div>}
          </Card>
        )}
      </div>
    </div>
  )
}
