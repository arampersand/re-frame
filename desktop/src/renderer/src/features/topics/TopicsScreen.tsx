// Dueño: Estado por tema. El mapa de lo que sabes y lo que no.
import { useEffect, useState } from 'react'
import { api } from '@/api/client'
import type { Course, Topic } from '@/api/contracts'
import { Card, StatusDot, statusLabel } from '@/components/ui'

export function TopicsScreen() {
  const [courses, setCourses] = useState<Course[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  useEffect(() => { api.courses().then(setCourses); api.topics().then(setTopics) }, [])
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {courses.map(c => (
        <Card key={c.id}>
          <h2 className="mb-3 font-semibold">{c.name}</h2>
          {topics.filter(t => t.course_id === c.id).map(t => (
            <div key={t.id} className="mb-2">
              <div className="flex items-center gap-2 text-sm">
                <StatusDot status={t.status} />
                <span className="flex-1">{t.title}</span>
                <span className="text-xs text-muted">{statusLabel(t.status)}</span>
              </div>
              <div className="mt-1 h-1.5 rounded bg-surface-2">
                <div className="h-1.5 rounded bg-primary" style={{ width: `${Math.round(t.score * 100)}%` }} />
              </div>
            </div>
          ))}
        </Card>
      ))}
    </div>
  )
}
