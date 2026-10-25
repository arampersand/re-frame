// Google Calendar: the app only gets its own "MyBrainBook" calendar (scope calendar.app.created),
// never the rest of the student's agenda. Deadlines come from 03-DEADLINES.md and are added
// only after the student approves them.
import { app, safeStorage, shell } from 'electron'
import { createServer } from 'node:http'
import { createHash, randomBytes } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { loadSettings, saveSettings } from './settings'
import { vaultPath } from './vault'

const CLIENT_ID = import.meta.env.MAIN_VITE_GOOGLE_CLIENT_ID ?? ''
// Google treats installed-app secrets as non-confidential; it still stays out of git (.env.local).
const CLIENT_SECRET = import.meta.env.MAIN_VITE_GOOGLE_CLIENT_SECRET ?? ''
const SCOPE = 'https://www.googleapis.com/auth/calendar.app.created'
const API = 'https://www.googleapis.com/calendar/v3'

export type Deadline = { key: string; date: string; time: string | null; course: string; what: string; kind: string }

const syncFile = () => join(app.getPath('userData'), 'calendar-sync.json')
type SyncState = { added: Record<string, string>; ignored: string[] }
const loadSync = (): SyncState => existsSync(syncFile()) ? JSON.parse(readFileSync(syncFile(), 'utf8')) : { added: {}, ignored: [] }
const saveSync = (s: SyncState) => writeFileSync(syncFile(), JSON.stringify(s, null, 2))

const enc = (s: string) => (safeStorage.isEncryptionAvailable() ? safeStorage.encryptString(s) : Buffer.from(s)).toString('base64')
const dec = (s: string) => { const b = Buffer.from(s, 'base64'); return safeStorage.isEncryptionAvailable() ? safeStorage.decryptString(b) : b.toString() }

export function calendarStatus() {
  const s = loadSettings()
  return { configured: !!CLIENT_ID, connected: !!s.googleRefreshEnc, email: s.googleEmail ?? null }
}

/** Desktop OAuth: loopback redirect + PKCE, opened in the student's browser. */
export async function connectCalendar(): Promise<{ ok: boolean; detail: string }> {
  if (!CLIENT_ID) return { ok: false, detail: 'Google Calendar is not configured in this build yet.' }
  const verifier = randomBytes(32).toString('base64url')
  const challenge = createHash('sha256').update(verifier).digest('base64url')
  const state = randomBytes(16).toString('hex')

  let code = '', redirect = ''
  try {
    ({ code, redirect } = await new Promise<{ code: string; redirect: string }>((resolve, reject) => {
    const server = createServer((req, res) => {
      const u = new URL(req.url ?? '/', 'http://127.0.0.1')
      if (u.pathname !== '/') { res.writeHead(404).end(); return }
      const ok = u.searchParams.get('state') === state && u.searchParams.get('code')
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      res.end(`<body style="font-family:system-ui;background:#0f1115;color:#e8eaf0;display:grid;place-items:center;height:100vh"><div style="text-align:center"><h2>${ok ? 'Google Calendar connected ✓' : 'Could not connect'}</h2><p>You can go back to MyBrainBook.</p></div></body>`)
      server.close()
      ok ? resolve({ code: u.searchParams.get('code')!, redirect }) : reject(new Error(u.searchParams.get('error') ?? 'Sign-in was cancelled'))
    })
    let redirect = ''
    server.listen(0, '127.0.0.1', () => {
      const port = (server.address() as { port: number }).port
      redirect = `http://127.0.0.1:${port}`
      const auth = new URL('https://accounts.google.com/o/oauth2/v2/auth')
      Object.entries({ client_id: CLIENT_ID, redirect_uri: redirect, response_type: 'code', scope: `openid email ${SCOPE}`,
        code_challenge: challenge, code_challenge_method: 'S256', state, access_type: 'offline', prompt: 'consent' })
        .forEach(([k, v]) => auth.searchParams.set(k, v))
      shell.openExternal(auth.toString())
    })
    setTimeout(() => { server.close(); reject(new Error('Timed out waiting for Google sign-in')) }, 5 * 60 * 1000)
    }))
  } catch (e) {
    return { ok: false, detail: `Sign-in did not finish: ${(e as Error).message}` }
  }
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ code, client_id: CLIENT_ID, client_secret: CLIENT_SECRET, redirect_uri: redirect, grant_type: 'authorization_code', code_verifier: verifier })
  })
  const tok = await res.json() as { refresh_token?: string; id_token?: string; error_description?: string }
  if (!res.ok || !tok.refresh_token) return { ok: false, detail: tok.error_description ?? 'Google did not return access' }
  const email = tok.id_token ? JSON.parse(Buffer.from(tok.id_token.split('.')[1], 'base64url').toString()).email : null
  saveSettings({ googleRefreshEnc: enc(tok.refresh_token), googleEmail: email, googleCalendarId: undefined })
  return { ok: true, detail: email ? `Connected as ${email}` : 'Connected' }
}

export function disconnectCalendar() { saveSettings({ googleRefreshEnc: undefined, googleEmail: undefined, googleCalendarId: undefined }) }

async function accessToken(): Promise<string> {
  const s = loadSettings()
  if (!s.googleRefreshEnc) throw new Error('Connect Google Calendar first')
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ refresh_token: dec(s.googleRefreshEnc), client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'refresh_token' })
  })
  const j = await res.json() as { access_token?: string; error?: string }
  if (!j.access_token) { if (j.error === 'invalid_grant') disconnectCalendar(); throw new Error('Google access expired. Connect again in Integrations.') }
  return j.access_token
}

async function gcal(path: string, init: RequestInit = {}) {
  const res = await fetch(`${API}${path}`, { ...init, headers: { Authorization: `Bearer ${await accessToken()}`, 'Content-Type': 'application/json', ...(init.headers ?? {}) } })
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error((body as { error?: { message?: string } }).error?.message ?? `Google Calendar ${res.status}`)
  return body as Record<string, unknown>
}

/** The app's own calendar; created once. */
async function calendarId(): Promise<string> {
  const s = loadSettings()
  if (s.googleCalendarId) return s.googleCalendarId
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  const cal = await gcal('/calendars', { method: 'POST', body: JSON.stringify({ summary: 'MyBrainBook', description: 'Homework, exams and projects from MyBrainBook', timeZone: tz }) })
  saveSettings({ googleCalendarId: cal.id as string })
  return cal.id as string
}

/** Rows of the table in 03-DEADLINES.md: | Date | Course | What | Kind | ... */
export function readDeadlines(): Deadline[] {
  const file = join(vaultPath(), '03-DEADLINES.md')
  if (!existsSync(file)) return []
  const out: Deadline[] = []
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    // Resolve [[path|Alias]] first: the alias pipe would otherwise split the cell.
    const flat = line.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_x, p: string, l?: string) => l ?? (p.endsWith('/index') ? p.split('/').slice(-2, -1)[0] : p.split('/').pop()!))
    const cells = flat.split('|').slice(1, -1).map(c => c.trim())
    const m = cells[0]?.match(/^(\d{4}-\d{2}-\d{2})(?:[ T](\d{1,2}:\d{2}))?/)
    if (!m || cells.length < 3) continue
    const course = cells[1] ?? ''
    const what = cells[2] ?? ''
    const kind = (cells[3] ?? '').toLowerCase()
    const key = createHash('sha1').update(`${m[1]}|${course}|${what}`).digest('hex').slice(0, 16)
    out.push({ key, date: m[1], time: m[2] ?? null, course, what, kind })
  }
  return out
}

/** Upcoming deadlines that are neither in Google Calendar yet nor ignored by the student. */
export function pendingDeadlines(): Deadline[] {
  if (!calendarStatus().connected) return []
  const today = new Date().toLocaleDateString('en-CA')
  const s = loadSync()
  return readDeadlines().filter(d => d.date >= today && !s.added[d.key] && !s.ignored.includes(d.key))
}

function eventFor(d: Deadline) {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  const exam = /exam|quiz|midterm|final|parcial|examen/i.test(`${d.kind} ${d.what}`)
  const reminders = [{ method: 'popup', minutes: 24 * 60 }, { method: 'popup', minutes: 120 }, ...(exam ? [{ method: 'popup', minutes: 3 * 24 * 60 }] : [])]
  const summary = `${exam ? '📝' : '📌'} ${d.what}${d.course ? ` · ${d.course}` : ''}`
  if (!d.time) {
    const next = new Date(`${d.date}T12:00:00`); next.setDate(next.getDate() + 1)
    // All-day: reminders count back from midnight, so 900 min = 9:00 the day before.
    const allDay = [{ method: 'popup', minutes: 900 }, ...(exam ? [{ method: 'popup', minutes: 2 * 1440 + 900 }] : [])]
    return { summary, description: `${d.kind || 'deadline'} · added by MyBrainBook`, start: { date: d.date }, end: { date: next.toLocaleDateString('en-CA') }, reminders: { useDefault: false, overrides: allDay } }
  }
  const [h, m] = d.time.split(':').map(Number)
  const start = `${d.date}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`
  const endD = new Date(`${start}`); endD.setMinutes(endD.getMinutes() + (exam ? 90 : 30))
  const end = `${endD.toLocaleDateString('en-CA')}T${endD.toTimeString().slice(0, 8)}`
  return { summary, description: `${d.kind || 'deadline'} · added by MyBrainBook`, start: { dateTime: start, timeZone: tz }, end: { dateTime: end, timeZone: tz }, reminders: { useDefault: false, overrides: reminders } }
}

/** Adds the approved deadlines; ignores the rest so we don't ask again. Returns what happened per item. */
export async function addDeadlines(approve: string[], ignore: string[]) {
  const s = loadSync()
  s.ignored.push(...ignore.filter(k => !s.ignored.includes(k)))
  const all = readDeadlines()
  const results: { key: string; ok: boolean; detail: string; link?: string }[] = []
  const cal = approve.length ? await calendarId() : ''
  for (const key of approve) {
    const d = all.find(x => x.key === key)
    if (!d) continue
    try {
      const ev = await gcal(`/calendars/${encodeURIComponent(cal)}/events`, { method: 'POST', body: JSON.stringify(eventFor(d)) })
      // Read it back: only count it if Google really has it.
      await gcal(`/calendars/${encodeURIComponent(cal)}/events/${ev.id}`)
      s.added[key] = ev.id as string
      results.push({ key, ok: true, detail: d.what, link: ev.htmlLink as string })
    } catch (e) {
      results.push({ key, ok: false, detail: `${d.what}: ${(e as Error).message}` })
    }
  }
  saveSync(s)
  return results
}
