import { useEffect, useRef, useState } from 'react'
import { rf, listen, type CodexEvent } from '@/api'
import { Button, Card, Markdown } from '@/components/ui'
import { usePcmRecorder } from './usePcmRecorder'
import { RecordingHistory } from './RecordingHistory'

type Stt = { engine: 'local' | 'groq'; ready: boolean }
type Phase = 'idle' | 'recording' | 'transcribing' | 'filing' | 'done' | 'failed'
const pad = (n: number) => String(n).padStart(2, '0')
const clock = (s: number) => (s >= 3600 ? `${Math.floor(s / 3600)}:` : '') + `${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`

export function RecordScreen({ onOpenNote, onSetup }: { onOpenNote: (p: string) => void; onSetup: () => void }) {
  const [stt, setStt] = useState<Stt | null>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [elapsed, setElapsed] = useState(0)
  const [pct, setPct] = useState(0)
  const [steps, setSteps] = useState<string[]>([])
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const rel = useRef<string | null>(null)
  const [tick, setTick] = useState(0)

  const rec = usePcmRecorder(pcm => { if (rel.current) rf.audio.pcm(rel.current, pcm) })

  useEffect(() => { rf.stt.status().then(setStt) }, [])
  useEffect(() => listen(rf.audio.onProgress, (p: { rel: string; stage: string; pct: number }) => {
    if (p.rel === rel.current && p.stage === 'transcribing') setPct(p.pct)
  }), [])
  useEffect(() => listen(rf.onTask, (e: CodexEvent & { task: string }) => {
    if (e.task === 'lecture' && e.kind === 'command') setSteps(s => [...s, e.text!])
  }), [])
  useEffect(() => {
    if (phase !== 'recording') return
    const t = window.setInterval(() => setElapsed(e => e + 1), 1000)
    return () => window.clearInterval(t)
  }, [phase])

  const start = async () => {
    const s = await rf.stt.status()
    setStt(s)
    if (!s.ready) return
    setError(''); setSteps([]); setResult(''); setElapsed(0); setPct(0)
    try {
      rel.current = await rf.audio.start()
      await rec.start()
      setPhase('recording')
      setTick(t => t + 1)
    } catch (e) {
      setError(`Could not use the microphone: ${(e as Error).message}. Allow it in System Settings → Privacy & Security → Microphone.`)
      setPhase('idle')
    }
  }

  const stop = async () => {
    await rec.stop()
    setPhase('transcribing')
    const t = await rf.audio.transcribe(rel.current!)
    if (!t.ok) {
      setError(`${t.detail} Your audio is saved, nothing was lost.`)
      setPhase('failed')
      setTick(t => t + 1)
      return
    }
    setPhase('filing')
    const r = await rf.audio.finish(rel.current!)
    setResult(r.text || 'Done. Check the class in My brain.')
    setPhase('done')
    setTick(t => t + 1)
  }

  const busy = phase === 'transcribing' || phase === 'filing'

  return (
    <div className="h-full overflow-auto px-10 pb-10 pt-10">
      <div className="mx-auto max-w-3xl space-y-5">
        <div>
          <h1 className="text-2xl font-bold">Record class</h1>
          <p className="text-sm text-muted">Hit record when class starts and forget about it. When you stop, the audio is saved, transcribed (Spanish or English) and filed in the right course with summary, key concepts and open questions. If your brain isn't sure which class it was, it asks.</p>
        </div>

        {stt && !stt.ready && phase === 'idle' && (
          <Card className="flex items-center justify-between gap-4 border-progress/50">
            <div>
              <p className="font-semibold">Turn on transcription first</p>
              <p className="text-sm text-muted">{stt.engine === 'local' ? 'Download the on-device model once (free, works offline).' : 'Add your Groq key, or switch to on-device transcription.'}</p>
            </div>
            <Button onClick={onSetup}>Set up</Button>
          </Card>
        )}

        <Card className="flex items-center gap-4">
          {phase === 'recording'
            ? <Button variant="danger" onClick={stop}>■ Stop</Button>
            : <Button onClick={start} disabled={busy || (stt !== null && !stt.ready)}>● Record</Button>}
          {phase === 'recording' && (
            <>
              <span className="flex items-center gap-2 font-mono text-sm"><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-gap" />{clock(elapsed)}</span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
                <span className="block h-full rounded-full bg-mastered transition-all duration-100" style={{ width: `${Math.min(100, rec.level * 160)}%` }} />
              </span>
            </>
          )}
          {phase === 'idle' && stt?.ready && <span className="text-xs text-muted">Transcribes {stt.engine === 'local' ? 'on this Mac' : 'with Groq'} when you stop</span>}
        </Card>

        {phase === 'transcribing' && (
          <Card>
            <p className="mb-2 text-sm">Transcribing {clock(elapsed)} of class… {pct}%</p>
            <div className="h-2 overflow-hidden rounded-full bg-surface-2"><div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} /></div>
          </Card>
        )}

        {error && (
          <Card className="border-gap/50 text-sm">
            <span className="font-semibold text-gap">Transcription problem: </span>{error}
            {' '}<button className="underline" onClick={onSetup}>Open Integrations</button>
            {rel.current && <> · <button className="underline" onClick={() => onOpenNote(rel.current!)}>Open the recording</button></>}
          </Card>
        )}

        {(phase === 'filing' || phase === 'done') && (
          <Card>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Your brain</p>
            {phase === 'filing' && <p className="animate-pulse text-sm text-muted">Filing it in the right course…</p>}
            <ul className="space-y-0.5 text-sm text-muted">{steps.map((s, i) => <li key={i}>🧠 {s}</li>)}</ul>
            {result && <div className="mt-3"><Markdown text={result} onLink={onOpenNote} /></div>}
          </Card>
        )}
        <RecordingHistory refresh={tick} onOpenNote={onOpenNote} />
      </div>
    </div>
  )
}
