import { useEffect, useRef, useState } from 'react'
import { rf, listen, type CodexEvent } from '@/api'
import { Button, Card, Markdown } from '@/components/ui'
import { useRecorder } from './useRecorder'
import { toWav16k } from './wav'

type Line = { offsetS: number; text?: string; error?: string }
const stamp = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

type Stt = { engine: 'local' | 'groq'; ready: boolean }

export function RecordScreen({ onOpenNote, onSetup }: { onOpenNote: (p: string) => void; onSetup: () => void }) {
  const [lines, setLines] = useState<Line[]>([])
  const [phase, setPhase] = useState<'idle' | 'recording' | 'processing' | 'done'>('idle')
  const [steps, setSteps] = useState<string[]>([])
  const [result, setResult] = useState('')
  const [elapsed, setElapsed] = useState(0)
  const rel = useRef<string | null>(null)
  const [stt, setStt] = useState<Stt | null>(null)
  const [error, setError] = useState('')
  const fails = useRef(0)
  const gotText = useRef(false)

  useEffect(() => { rf.stt.status().then(setStt) }, [])

  useEffect(() => listen(rf.audio.onText, (t: Line & { rel: string }) => {
    if (t.rel !== rel.current) return
    if (t.error) {
      // Show the problem once; two failures in a row means it won't fix itself, so stop.
      fails.current += 1
      setError(t.error)
      if (fails.current >= 2) stopRef.current?.(true)
      return
    }
    fails.current = 0
    setError('')
    if (t.text) { gotText.current = true; setLines(l => [...l, t].sort((a, b) => a.offsetS - b.offsetS)) }
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
    if (!rel.current) return
    try { rf.audio.chunk(rel.current, await toWav16k(blob), offsetS) } catch { /* empty or silent chunk */ }
  })

  const start = async () => {
    const s = await rf.stt.status()
    setStt(s)
    if (!s.ready) return
    fails.current = 0; gotText.current = false; setError('')
    rel.current = await rf.audio.start()
    setLines([]); setSteps([]); setResult(''); setElapsed(0)
    await recorder.start()
    setPhase('recording')
  }

  const stop = async (failed = false) => {
    recorder.stop()
    setPhase('processing')
    // Wait for the last chunk (it is sent when the recorder stops) to finish transcribing.
    await new Promise(r => setTimeout(r, 400))
    await rf.audio.drain()
    await new Promise(r => setTimeout(r, 50))
    // Nothing usable was transcribed: don't ask the brain to file an empty class.
    if (failed || !gotText.current) { setPhase('idle'); if (!failed) setError('No speech was transcribed. Check your microphone and try again.'); return }
    const r = await rf.audio.finish(rel.current!)
    setResult(r.text || 'Done. Check the lecture in My brain.')
    setPhase('done')
  }
  const stopRef = useRef<((failed?: boolean) => void) | null>(null)
  stopRef.current = stop

  return (
    <div className="h-full overflow-auto px-10 pb-10 pt-10">
      <div className="mx-auto max-w-3xl space-y-5">
        <div>
          <h1 className="text-2xl font-bold">Record class</h1>
          <p className="text-sm text-muted">Hit record when class starts. It transcribes every 15 seconds (Spanish or English) and when you stop, your brain figures out which class it was and files it with summary, key concepts and open questions. If it is not sure, it asks you.</p>
        </div>

        {stt && !stt.ready && phase !== 'recording' && (
          <Card className="flex items-center justify-between gap-4 border-progress/50">
            <div>
              <p className="font-semibold">Turn on transcription first</p>
              <p className="text-sm text-muted">{stt.engine === 'local' ? 'Download the on-device model once (free, works offline).' : 'Add your Groq key, or switch to on-device transcription.'}</p>
            </div>
            <Button onClick={onSetup}>Set up</Button>
          </Card>
        )}

        {error && <Card className="border-gap/50 text-sm"><span className="font-semibold text-gap">Transcription problem: </span>{error}{phase !== 'recording' && <> · <button className="underline" onClick={onSetup}>Open Integrations</button></>}</Card>}

        <Card className="flex items-center gap-4">
          {phase === 'recording'
            ? <Button variant="danger" onClick={() => stop()}>■ Stop</Button>
            : <Button onClick={start} disabled={phase === 'processing' || (stt !== null && !stt.ready)}>● Record</Button>}
          {stt && phase === 'idle' && stt.ready && <span className="text-xs text-muted">Transcribing {stt.engine === 'local' ? 'on this Mac' : 'with Groq'}</span>}
          {phase === 'recording' && <span className="flex items-center gap-2 text-sm"><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-gap" /> {stamp(elapsed)}</span>}
          {phase === 'processing' && <span className="animate-pulse text-sm text-muted">Filing it in your brain…</span>}
        </Card>

        {(lines.length > 0 || phase === 'recording') && (
          <Card>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Live transcript</p>
            {lines.length === 0 && <p className="text-sm text-muted">Listening… first text in ~15 s.</p>}
            <div className="space-y-1.5 text-sm">
              {lines.map(l => (
                <p key={l.offsetS}><span className="mr-2 font-mono text-xs text-muted">{stamp(l.offsetS)}</span>{l.text}</p>
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
