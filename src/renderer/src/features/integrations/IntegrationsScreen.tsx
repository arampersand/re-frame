import { useEffect, useState, type ReactNode } from 'react'
import { rf, listen } from '@/api'
import { Button, Card, Dot } from '@/components/ui'

type Stt = {
  engine: 'local' | 'groq'; ready: boolean; groqKey: boolean
  local: { ready: boolean; binary: boolean; model: string; sizeMB: number; download: { pct: number; error?: string } | null }
}

function Option({ active, onClick, title, sub, badge }: { active: boolean; onClick: () => void; title: string; sub: string; badge?: ReactNode }) {
  return (
    <button onClick={onClick}
      className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left ${active ? 'border-primary bg-primary/10' : 'border-border hover:bg-surface-2'}`}>
      <span className={`mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 ${active ? 'border-primary bg-primary' : 'border-muted'}`} />
      <span className="flex-1">
        <span className="flex items-center justify-between gap-2 font-medium">{title}{badge}</span>
        <span className="block text-xs text-muted">{sub}</span>
      </span>
    </button>
  )
}

const Chip = ({ ok, children }: { ok: boolean; children: ReactNode }) =>
  <span className={`rounded-full px-2 py-0.5 text-xs ${ok ? 'bg-mastered/20 text-mastered' : 'bg-surface-2 text-muted'}`}>{children}</span>

export function IntegrationsScreen({ onChange }: { onChange: () => void }) {
  const [codex, setCodex] = useState<{ installed: boolean; loggedIn: boolean; detail: string } | null>(null)
  const [stt, setStt] = useState<Stt | null>(null)
  const [key, setKey] = useState('')
  const [msg, setMsg] = useState<{ ok: boolean; detail: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const [pct, setPct] = useState<number | null>(null)
  const [cal, setCal] = useState<{ configured: boolean; connected: boolean; email: string | null } | null>(null)
  const [calMsg, setCalMsg] = useState<{ ok: boolean; detail: string } | null>(null)
  const [calBusy, setCalBusy] = useState(false)

  const refresh = () => {
    rf.codex.status().then(setCodex)
    rf.calendar.status().then(setCal)
    rf.stt.status().then((s: Stt) => { setStt(s); if (s.local.download && !s.local.download.error) setPct(s.local.download.pct) })
    onChange()
  }
  useEffect(refresh, [])
  useEffect(() => listen(rf.stt.onProgress, (p: number) => setPct(p)), [])

  const connectCal = async () => {
    setCalBusy(true); setCalMsg(null)
    setCalMsg(await rf.calendar.connect())
    setCalBusy(false); refresh()
  }
  const disconnectCal = async () => { await rf.calendar.disconnect(); setCalMsg(null); refresh() }

  const login = async () => { setBusy(true); await rf.codex.login(); setBusy(false); refresh() }

  const choose = async (engine: 'local' | 'groq') => { setMsg(null); setStt(await rf.stt.setEngine(engine)); onChange() }

  const saveKey = async () => {
    if (!key.trim()) return
    setBusy(true); setMsg(null)
    const r = await rf.groq.setKey(key.trim())
    setMsg(r.ok ? { ok: true, detail: 'Key saved. Groq is connected.' } : { ok: false, detail: `Key not saved: ${r.detail}` })
    setBusy(false)
    if (r.ok) { setKey(''); await rf.stt.setEngine('groq') }
    refresh()
  }

  const download = async () => {
    setPct(0); setMsg(null)
    const r = await rf.stt.download()
    setPct(null)
    if (!r.ok) setMsg({ ok: false, detail: r.detail })
    else { await rf.stt.setEngine('local'); setMsg({ ok: true, detail: 'On-device transcription is ready.' }) }
    refresh()
  }

  return (
    <div className="h-full overflow-auto px-10 pb-10 pt-10">
      <div className="mx-auto max-w-2xl space-y-5">
        <div>
          <h1 className="text-2xl font-bold">Integrations</h1>
          <p className="text-sm text-muted">Your brain stays on your Mac as plain notes. These connect the parts that need AI.</p>
        </div>

        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 font-semibold"><Dot ok={codex ? codex.loggedIn : null} /> AI · ChatGPT</p>
              <p className="mt-1 text-sm text-muted">Uses your ChatGPT account (built in, nothing to install). It reads and writes the notes in your brain to answer you.</p>
              {busy && !codex?.loggedIn && <p className="mt-2 text-xs text-muted">Finish signing in in your browser…</p>}
            </div>
            {codex?.loggedIn
              ? <span className="rounded-full bg-mastered/20 px-3 py-1 text-xs text-mastered">Connected</span>
              : <Button onClick={login} disabled={busy || !codex?.installed}>Connect with ChatGPT</Button>}
          </div>
        </Card>

        <Card>
          <p className="flex items-center gap-2 font-semibold"><Dot ok={stt ? stt.ready : null} /> Transcription · Record class</p>
          <p className="mt-1 text-sm text-muted">Pick how your classes become text. Both understand Spanish and English.</p>

          {stt && (
            <div className="mt-4 space-y-2">
              <Option active={stt.engine === 'local'} onClick={() => choose('local')}
                title="On this Mac"
                sub={`Free, private, works offline. One-time download of ${stt.local.model} (${stt.local.sizeMB} MB).`}
                badge={<Chip ok={stt.local.ready}>{stt.local.ready ? 'Ready' : pct !== null ? `${pct}%` : 'Not downloaded'}</Chip>} />
              {stt.engine === 'local' && !stt.local.ready && (
                <div className="pl-9">
                  {pct !== null
                    ? <div className="h-2 overflow-hidden rounded-full bg-surface-2"><div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} /></div>
                    : <Button onClick={download} disabled={!stt.local.binary}>Download ({stt.local.sizeMB} MB)</Button>}
                  {!stt.local.binary && <p className="mt-1 text-xs text-gap">This build is missing the on-device engine. Use Groq for now.</p>}
                </div>
              )}

              <Option active={stt.engine === 'groq'} onClick={() => choose('groq')}
                title="Groq (cloud)"
                sub="Fastest. Needs a free key from console.groq.com/keys."
                badge={<Chip ok={stt.groqKey}>{stt.groqKey ? 'Key saved' : 'No key'}</Chip>} />
              {stt.engine === 'groq' && (
                <div className="flex gap-2 pl-9">
                  <input type="password" value={key} onChange={e => setKey(e.target.value)} onKeyDown={e => e.key === 'Enter' && saveKey()}
                    placeholder={stt.groqKey ? '•••••••• (saved, paste a new one to replace)' : 'Paste your key: gsk_…'}
                    className="flex-1 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-primary" />
                  <Button onClick={saveKey} disabled={busy || !key.trim()}>{busy ? 'Checking…' : 'Save'}</Button>
                </div>
              )}
            </div>
          )}
          {msg && <p className={`mt-3 rounded-lg px-3 py-2 text-sm ${msg.ok ? 'bg-mastered/15 text-mastered' : 'bg-gap/15 text-gap'}`}>{msg.detail}</p>}
        </Card>

        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 font-semibold"><Dot ok={cal ? cal.connected : null} /> Google Calendar</p>
              <p className="mt-1 text-sm text-muted">When your brain finds homework, exams or projects, it asks before adding them to a <b>MyBrainBook</b> calendar with reminders. It can only see and edit that calendar, never the rest of yours.</p>
              {cal?.connected && cal.email && <p className="mt-2 text-xs text-muted">{cal.email} · <button className="underline" onClick={disconnectCal}>Disconnect</button></p>}
              {calBusy && <p className="mt-2 text-xs text-muted">Finish signing in in your browser…</p>}
              {cal && !cal.configured && <p className="mt-2 text-xs text-muted">Available in the next update.</p>}
            </div>
            {cal?.connected
              ? <span className="rounded-full bg-mastered/20 px-3 py-1 text-xs text-mastered">Connected</span>
              : <Button onClick={connectCal} disabled={calBusy || !cal?.configured}>Connect</Button>}
          </div>
          {calMsg && <p className={`mt-3 rounded-lg px-3 py-2 text-sm ${calMsg.ok ? 'bg-mastered/15 text-mastered' : 'bg-gap/15 text-gap'}`}>{calMsg.detail}</p>}
        </Card>

        <Card className="opacity-60">
          <p className="font-semibold">Coming soon</p>
          <p className="mt-1 text-sm text-muted">Blackboard / Canvas / Moodle calendar · Google Drive</p>
        </Card>
      </div>
    </div>
  )
}
