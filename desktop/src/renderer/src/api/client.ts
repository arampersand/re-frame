// Único punto de contacto con el backend. Si cambias una ruta aquí, cámbiala en backend también.
import type {
  AskResponse, Course, Explanation, ExplainRequest, Lecture, ProposedAction,
  QuizResult, Receipt, Segment, Student, TodayView, Topic
} from './contracts'

export const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://127.0.0.1:8787'

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, init)
  if (!res.ok) throw new Error(`${res.status} ${(await res.text()).slice(0, 200)}`)
  return res.json() as Promise<T>
}
const post = <T>(path: string, body?: unknown) =>
  req<T>(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined })

export const api = {
  health: () => req<{ ok: boolean; llm: Record<string, boolean>; stt: boolean; calendar: boolean; dry_run: boolean }>('/api/health'),
  student: () => req<Student>('/api/student'),
  courses: () => req<Course[]>('/api/courses'),
  today: () => req<TodayView>('/api/today'),
  approve: (id: string) => post<Receipt>(`/api/actions/${id}/approve`),
  reject: (id: string) => post<ProposedAction>(`/api/actions/${id}/reject`),
  receipts: () => req<Receipt[]>('/api/receipts'),
  topics: (courseId?: string) => req<Topic[]>(`/api/topics${courseId ? `?course_id=${courseId}` : ''}`),
  quiz: (topicId: string, r: QuizResult) => post<Topic>(`/api/topics/${topicId}/quiz`, r),
  lectures: (courseId?: string) => req<Lecture[]>(`/api/lectures${courseId ? `?course_id=${courseId}` : ''}`),
  lecture: (id: string) => req<Lecture>(`/api/lectures/${id}`),
  newLecture: (course_id: string, title: string) => post<Lecture>('/api/lectures', { course_id, title }),
  finishLecture: (id: string) => post<Lecture>(`/api/lectures/${id}/finish`),
  uploadAudio: (id: string, blob: Blob, offsetS: number, filename = 'chunk.webm') => {
    const fd = new FormData()
    fd.append('file', blob, filename)
    fd.append('offset_s', String(offsetS))
    return req<Segment[]>(`/api/lectures/${id}/audio`, { method: 'POST', body: fd })
  },
  confused: (lectureId: string, segId: string, topicId?: string) =>
    post<Segment>(`/api/lectures/${lectureId}/segments/${segId}/confused${topicId ? `?topic_id=${topicId}` : ''}`),
  explain: (body: ExplainRequest) => post<Explanation>('/api/explain', body),
  ask: (text: string) => post<AskResponse>('/api/ask', { text }),
  reset: () => post<{ ok: boolean }>('/api/demo/reset')
}
