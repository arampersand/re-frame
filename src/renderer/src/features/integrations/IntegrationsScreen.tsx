import { useEffect, useState } from 'react'
import { rf } from '@/api'
import { Button, Card, Dot } from '@/components/ui'

export function IntegrationsScreen({ onChange }: { onChange: () => void }) {
  const [codex, setCodex] = useState<{ installed: boolean; loggedIn: boolean; detail: string } | null>(null)
  const [groq, setGroq] = useState<{ hasKey: boolean } | null>(null)
  const [key, setKey] = useState('')
  const [msg, setMsg] = useState<{ ok: boolean; detail: string } | null>(null)
  const [busy, setBusy] = useState(false)

  const refresh = () => {
    rf.codex.status().then(setCodex)
    rf.groq.status().then(setGroq)
    onChange()
  }
  useEffect(refresh, [])

  const login = async () => { setBusy(true); await rf.codex.login(); setBusy(false); refresh() }
  const saveKey = async () => {
    setBusy(true)
    const r = await rf.groq.setKey(key.trim())
    setMsg(r); setBusy(false)
    if (r.ok) setKey('')
    refresh()
  }
  const test = async () => setMsg(await rf.groq.test())

  return (
    <div className="h-full overflow-auto px-10 pb-10 pt-10">
      <div className="mx-auto max-w-2xl space-y-5">
        <div>
          <h1 className="text-2xl font-bold">Integrations</h1>
          <p className="text-sm text-muted">Your brain stays on your Mac as plain notes. These connect the parts that need the cloud.</p>
        </div>

        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 font-semibold"><Dot ok={codex ? codex.loggedIn : null} /> AI · ChatGPT plan via Codex</p>
              <p className="mt-1 text-sm text-muted">Uses the ChatGPT subscription you already pay for. It reads and writes the notes in your brain to answer you.</p>
              {codex && <p className="mt-2 text-xs text-muted">{codex.installed ? codex.detail : 'Codex CLI not found. Install it with: npm i -g @openai/codex  (or brew install codex), then press Connect.'}</p>}
            </div>
            {codex?.loggedIn
              ? <span className="rounded-full bg-mastered/20 px-3 py-1 text-xs text-mastered">Connected</span>
              : <Button onClick={login} disabled={busy || !codex?.installed}>Connect</Button>}
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 font-semibold"><Dot ok={groq ? groq.hasKey : null} /> Transcription · Groq Whisper</p>
              <p className="mt-1 text-sm text-muted">Turns your class audio into text, Spanish and English. Free key at console.groq.com — the free tier covers hours of class per day.</p>
            </div>
            {groq?.hasKey && <span className="rounded-full bg-mastered/20 px-3 py-1 text-xs text-mastered">Connected</span>}
          </div>
          <div className="mt-3 flex gap-2">
            <input type="password" value={key} onChange={e => setKey(e.target.value)} placeholder={groq?.hasKey ? '•••••••• (saved)' : 'gsk_…'}
              className="flex-1 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-primary" />
            <Button onClick={saveKey} disabled={busy || !key.trim()}>Save</Button>
            {groq?.hasKey && <Button variant="ghost" onClick={test}>Test</Button>}
          </div>
          {msg && <p className={`mt-2 text-xs ${msg.ok ? 'text-mastered' : 'text-gap'}`}>{msg.detail}</p>}
        </Card>

        <Card className="opacity-60">
          <p className="font-semibold">Coming soon</p>
          <p className="mt-1 text-sm text-muted">Blackboard / Canvas calendar (iCal) · Google Calendar · Google Drive</p>
        </Card>
      </div>
    </div>
  )
}
