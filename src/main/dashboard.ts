// Read-only views of the brain for the sidebar: courses, tasks (03-DEADLINES.md) and the calendar.
// The brain stays the source of truth; nothing here is cached.
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { createHash } from 'node:crypto'
import { vaultPath } from './vault'
import { calendarStatus, listEvents } from './calendar'
import { listRecordings } from './recording'

export type Task = {
  key: string; line: number; date: string; time: string | null; title: string; kind: string; status: string
  course: string | null; courseName: string
}
type NoteRef = { path: string; title: string; date: string | null }

const read = (rel: string) => { const f = join(vaultPath(), rel); return existsSync(f) ? readFileSync(f, 'utf8') : '' }
const titleOf = (text: string, path: string) =>
  text.match(/^# (.+)$/m)?.[1]?.trim() ?? path.split('/').pop()!.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/-/g, ' ')
const dateOf = (text: string, path: string) => text.match(/^date: (\d{4}-\d{2}-\d{2})/m)?.[1] ?? path.match(/(\d{4}-\d{2}-\d{2})/)?.[1] ?? null

// ---------- Tasks ----------

/** Every row of the table in 03-DEADLINES.md, keeping the course slug from its wikilink. */
export function listTasks(): Task[] {
  const lines = read('03-DEADLINES.md').split('\n')
  const out: Task[] = []
  lines.forEach((line, i) => {
    const slug = line.match(/\[\[02-COURSES\/([^/\]|]+)\//)?.[1] ?? null
    const flat = line.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_x, p: string, l?: string) =>
      l ?? (p.endsWith('/index') ? p.split('/').slice(-2, -1)[0] : p.split('/').pop()!))
    const cells = flat.split('|').slice(1, -1).map(c => c.trim())
    const m = cells[0]?.match(/^(\d{4}-\d{2}-\d{2})(?:[ T](\d{1,2}:\d{2}))?/)
    if (!m || cells.length < 3) return
    out.push({
      key: createHash('sha1').update(`${m[1]}|${cells[1]}|${cells[2]}`).digest('hex').slice(0, 16),
      line: i, date: m[1], time: m[2] ?? null, courseName: cells[1] ?? '', course: slug,
      title: cells[2] ?? '', kind: (cells[3] ?? '').toLowerCase(), status: (cells[4] ?? 'pending').toLowerCase() || 'pending'
    })
  })
  return out.sort((a, b) => `${a.date} ${a.time ?? '23:59'}`.localeCompare(`${b.date} ${b.time ?? '23:59'}`))
}

/** Marks a row done (or pending again) by rewriting only its status cell. */
export function setTaskStatus(key: string, status: 'done' | 'pending') {
  const task = listTasks().find(t => t.key === key)
  if (!task) return false
  const file = join(vaultPath(), '03-DEADLINES.md')
  const lines = readFileSync(file, 'utf8').split('\n')
  // Split on pipes outside [[...]] so wikilink aliases survive.
  const parts = lines[task.line].split(/\|(?![^[]*\]\])/)
  if (parts.length >= 7) parts[5] = ` ${status} `
  else parts.splice(parts.length - 1, 0, ` ${status} `)
  lines[task.line] = parts.join('|')
  writeFileSync(file, lines.join('\n'))
  return true
}

// ---------- Courses ----------

function notesIn(dir: string): NoteRef[] {
  const abs = join(vaultPath(), dir)
  if (!existsSync(abs)) return []
  return readdirSync(abs)
    .filter(f => f.endsWith('.md') && f !== 'index.md')
    .map(f => {
      const path = `${dir}/${f}`
      const text = read(path)
      return { path, title: titleOf(text, path), date: dateOf(text, path) }
    })
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
}

export function listCourses() {
  const dir = join(vaultPath(), '02-COURSES')
  if (!existsSync(dir)) return []
  const tasks = listTasks().filter(t => t.status !== 'done' && t.date >= new Date().toLocaleDateString('en-CA'))
  return readdirSync(dir)
    .filter(n => !n.startsWith('.') && statSync(join(dir, n)).isDirectory())
    .map(slug => {
      const index = read(`02-COURSES/${slug}/index.md`)
      const next = tasks.find(t => t.course === slug) ?? null
      return {
        slug,
        name: index ? titleOf(index, slug).replace(/\s*[—-]\s*\d+º?.*$/, '') : slug.replace(/-/g, ' ').replace(/(^|\s)(\p{L})/gu, (_m, s: string, c: string) => s + c.toUpperCase()),
        lectures: notesIn(`02-COURSES/${slug}/lectures`).length,
        pending: tasks.filter(t => t.course === slug).length,
        next
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
}

export function getCourse(slug: string) {
  const base = `02-COURSES/${slug}`
  const recordings = listRecordings().filter(r => r.course === slug)
  return {
    slug,
    index: read(`${base}/index.md`),
    indexPath: `${base}/index.md`,
    lectures: notesIn(`${base}/lectures`),
    readings: notesIn(`${base}/readings`),
    assignments: notesIn(`${base}/assignments`),
    notes: notesIn(`${base}/notes`),
    tasks: listTasks().filter(t => t.course === slug),
    recordings
  }
}

/** Notes that probably belong to a task: same course, sharing words with its title. */
export function taskContext(key: string) {
  const task = listTasks().find(t => t.key === key)
  if (!task) return null
  const words = task.title.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').split(/[^a-z0-9]+/).filter(w => w.length > 3)
  const pool = task.course ? [...notesIn(`02-COURSES/${task.course}/assignments`), ...notesIn(`02-COURSES/${task.course}/readings`), ...notesIn(`02-COURSES/${task.course}/lectures`)] : []
  const scored = pool.map(n => {
    const hay = `${n.title} ${n.path}`.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    return { ...n, score: words.filter(w => hay.includes(w)).length }
  }).filter(n => n.score > 0).sort((a, b) => b.score - a.score).slice(0, 6)
  return { task, related: scored, courseIndex: task.course ? `02-COURSES/${task.course}/index.md` : null }
}

// ---------- Today ----------

export async function today() {
  const day = new Date().toLocaleDateString('en-CA')
  const week = new Date(Date.now() + 7 * 86400000).toLocaleDateString('en-CA')
  const open = listTasks().filter(t => t.status !== 'done')
  const struggles = read('01-ME/struggles.md').split('\n')
    .filter(l => /^\|/.test(l) && !/^\|\s*(Topic|---)/i.test(l) && !/\|\s*(resolved|done)\s*\|?\s*$/i.test(l))
    .map(l => l.split('|').slice(1, -1).map(c => c.trim().replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_x, p: string, a?: string) => a ?? p.split('/').slice(-2, -1)[0] ?? p)))
    .filter(c => c[0])
    .map(c => ({ topic: c[0], course: c[1] ?? '', what: c[3] ?? '' }))
  const recs = listRecordings()
  const inbox = existsSync(join(vaultPath(), '00-INBOX'))
    ? readdirSync(join(vaultPath(), '00-INBOX')).filter(f => !f.startsWith('.')).length : 0
  return {
    day,
    overdue: open.filter(t => t.date < day),
    today: open.filter(t => t.date === day),
    week: open.filter(t => t.date > day && t.date <= week),
    later: open.filter(t => t.date > week).slice(0, 5),
    events: await calendarEvents(day, week),
    struggles: struggles.slice(0, 5),
    unfiled: recs.filter(r => r.status === 'transcribed' || r.status === 'not-transcribed').length,
    inbox
  }
}

// ---------- Calendar ----------

export type CalItem = { date: string; time: string | null; title: string; source: 'google' | 'task' | 'class'; kind?: string; link?: string; key?: string; path?: string }

/** Google (MyBrainBook calendar) when connected, plus the brain's own dates; Google wins on duplicates. */
export async function calendarEvents(from: string, to: string): Promise<CalItem[]> {
  const items: CalItem[] = []
  let google = false
  if (calendarStatus().connected) {
    try {
      // Never let a slow network or a keychain prompt hold the screen: brain data shows anyway.
      const r = await Promise.race([listEvents(from, to), new Promise<{ ok: false }>(res => setTimeout(() => res({ ok: false }), 5000))])
      if (r.ok) {
        google = true
        for (const e of (r as { events: { title: string; start: string; link: string }[] }).events) {
          const [d, t] = String(e.start).split('T')
          items.push({ date: d, time: t ? t.slice(0, 5) : null, title: e.title.replace(/^[📝📌]\s*/u, ''), source: 'google', link: e.link })
        }
      }
    } catch { /* offline: fall back to the brain */ }
  }
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9áéíóúñ]+/g, '')
  for (const t of listTasks()) {
    if (t.date < from || t.date > to) continue
    if (google && items.some(i => i.date === t.date && (norm(i.title).includes(norm(t.title)) || norm(t.title).includes(norm(i.title).split('·')[0])))) continue
    items.push({ date: t.date, time: t.time, title: t.courseName ? `${t.title} · ${t.courseName}` : t.title, source: 'task', kind: t.kind, key: t.key })
  }
  for (const r of listRecordings()) {
    const d = new Date(r.date).toLocaleDateString('en-CA')
    if (d < from || d > to || !r.note) continue
    items.push({ date: d, time: new Date(r.date).toTimeString().slice(0, 5), title: `🎙️ ${r.title}`, source: 'class', path: r.note })
  }
  return items.sort((a, b) => `${a.date} ${a.time ?? '00:00'}`.localeCompare(`${b.date} ${b.time ?? '00:00'}`))
}

export const vaultRel = (abs: string) => relative(vaultPath(), abs)
