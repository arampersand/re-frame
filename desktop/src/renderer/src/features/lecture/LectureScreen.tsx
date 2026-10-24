// Dueño: Audio (grabación) + Frontend (layout). Clase en vivo y transcripción.
import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from '@/api/client'
import type { Course, ExplainRequest, Lecture, Segment } from '@/api/contracts'
import { Button, Card, ErrorNote } from '@/components/ui'
import { ExplainPanel } from '@/features/explain/ExplainPanel'
import { useRecorder } from './useRecorder'

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

export function LectureScreen() {
  const [courses, setCourses] = useState<Course[]>([])
  const [courseId, setCourseId] = useState('')
  const [lectures, setLectures] = useState<Lecture[]>([])
  const [lecture, setLecture] = useState<Lecture | null>(null)
  const [explain, setExplain] = useState<ExplainRequest | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { api.courses().then(c => { setCourses(c); setCourseId(c[0]?.id ?? '') }) }, [])
  useEffect(() => {
    if (!courseId) return
    api.lectures(courseId).then(ls => { setLectures(ls); setLecture(ls[0] ?? null) })
  }, [courseId])

  // El grabador vive fuera del ciclo de render: guardamos el id de la clase en un ref.
  const liveId = useRef<string | null>(null)
  const onChunk = useCallback((blob: Blob, offset: number) => {
    const id = liveId.current
    if (!id) return
    api.uploadAudio(id, blob, offset)
      .then(segs => setLecture(l => (l && l.id === id ? { ...l, segments: [...(l.segments ?? []), ...segs] } : l)))
      .catch(e => setError(String(e)))
  }, [])
  const rec = useRecorder(onChunk)

  const startNew = async () => {
    setError(null)
    const l = await api.newLecture(courseId, `Clase ${new Date().toLocaleDateString()}`)
    liveId.current = l.id
    setLecture(l); setLectures(ls => [l, ...ls])
    await rec.start().catch(e => setError(`Micrófono: ${e}`))
  }
  const stop = async () => { rec.stop(); if (lecture) setLecture(await api.finishLecture(lecture.id)) }

  const uploadFile = async (f: File) => {
    if (!lecture) return
    setError(null)
    try {
      const segs = await api.uploadAudio(lecture.id, f, 0, f.name)
      setLecture({ ...lecture, segments: [...(lecture.segments ?? []), ...segs] })
    } catch (e) { setError(String(e)) }
  }

  const confused = async (s: Segment) => {
    if (!lecture) return
    const topicId = lecture.topic_ids?.at(-1)
    await api.confused(lecture.id, s.id, topicId).catch(() => undefined)
    setLecture({ ...lecture, segments: lecture.segments?.map(x => (x.id === s.id ? { ...x, confused: true } : x)) })
    setExplain({ text: s.text, lecture_id: lecture.id, segment_ids: [s.id], topic_id: topicId })
  }

  return (
    <div className="grid h-full grid-cols-[1fr_minmax(360px,42%)] gap-4">
      <div className="flex min-h-0 flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <select value={courseId} onChange={e => setCourseId(e.target.value)}
            className="rounded-lg border border-border bg-surface px-2 py-1.5 text-sm">
            {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={lecture?.id ?? ''} onChange={e => setLecture(lectures.find(l => l.id === e.target.value) ?? null)}
            className="rounded-lg border border-border bg-surface px-2 py-1.5 text-sm">
            {lectures.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}
          </select>
          {rec.recording
            ? <Button onClick={stop}>■ Detener</Button>
            : <Button onClick={startNew} disabled={!courseId}>● Grabar clase</Button>}
          <label className="cursor-pointer text-sm text-muted underline">
            Subir audio
            <input type="file" accept="audio/*" hidden onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0])} />
          </label>
          {rec.recording && <span className="animate-pulse text-sm text-gap">grabando…</span>}
        </div>
        <ErrorNote error={error} />
        <Card className="min-h-0 flex-1 overflow-auto">
          <p className="mb-3 text-xs text-muted">Toca una frase que no entendiste.</p>
          {(lecture?.segments ?? []).map(s => (
            <button key={s.id} onClick={() => confused(s)}
              className={`mb-1 block w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-surface-2 ${s.confused ? 'border-l-2 border-gap bg-surface-2' : ''}`}>
              <span className="mr-2 font-mono text-xs text-muted">{fmt(s.start_s)}</span>
              {s.lang === 'en' && <span className="mr-1 text-xs text-muted">[EN]</span>}
              {s.text}
            </button>
          ))}
          {!lecture?.segments?.length && <p className="text-sm text-muted">Sin transcripción todavía.</p>}
        </Card>
      </div>
      <div className="min-h-0">
        {explain
          ? <ExplainPanel request={explain} onClose={() => setExplain(null)} />
          : <Card className="h-full text-sm text-muted">La explicación aparece aquí: diagrama, analogía, ejemplo y resumen.</Card>}
      </div>
    </div>
  )
}
