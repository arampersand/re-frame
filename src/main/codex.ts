import { spawn, execFile, execFileSync } from 'node:child_process'
import { homedir } from 'node:os'
import { vaultPath } from './vault'

// Apps launched from Finder don't inherit the shell PATH: ask the login shell, plus common spots.
function shellPath(): string {
  try {
    return execFileSync(process.env.SHELL || '/bin/zsh', ['-ilc', 'printf %s "$PATH"'], { timeout: 4000, encoding: 'utf8' }).trim()
  } catch { return '' }
}
const PATH = [shellPath(), '/opt/homebrew/bin', '/usr/local/bin', `${homedir()}/.local/bin`, `${homedir()}/.npm-global/bin`, '/usr/bin', '/bin', process.env.PATH ?? '']
  .filter(Boolean).join(':')
const env = { ...process.env, PATH }

export type CodexEvent =
  | { kind: 'session'; sessionId: string }
  | { kind: 'message'; text: string }
  | { kind: 'command'; text: string }
  | { kind: 'done'; text: string }
  | { kind: 'error'; text: string }

/** Turns a shell command Codex runs into something a student can read. */
function describe(cmd: string): string {
  const inner = cmd.replace(/^\/bin\/(z|ba)?sh -lc\s+/, '').replace(/^["']|["']$/g, '')
  const files = inner.match(/[\w./-]+\.(md|pdf)/g)
  if (/^(rg|grep)\b/.test(inner)) return `Searching your brain${files ? `: ${files[0]}` : ''}`
  if (files?.length) return `Reading ${[...new Set(files)].slice(0, 3).join(', ')}`
  return inner.length > 80 ? inner.slice(0, 80) + '…' : inner
}

export function runCodex(prompt: string, sessionId: string | null, onEvent: (e: CodexEvent) => void): Promise<{ sessionId: string | null; text: string }> {
  const args = ['exec', '--json', '-C', vaultPath(), '-s', 'workspace-write', '--skip-git-repo-check']
  if (sessionId) args.push('resume', sessionId, prompt)
  else args.push(prompt)

  return new Promise(res => {
    const child = spawn('codex', args, { env, cwd: vaultPath(), stdio: ['ignore', 'pipe', 'pipe'] })
    let sid = sessionId
    let last = ''
    let buf = ''
    let stderr = ''
    child.stdout.on('data', chunk => {
      buf += chunk.toString()
      let i: number
      while ((i = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, i).trim()
        buf = buf.slice(i + 1)
        if (!line.startsWith('{')) continue
        try {
          const ev = JSON.parse(line)
          if (ev.type === 'thread.started' && ev.thread_id) {
            sid = ev.thread_id
            onEvent({ kind: 'session', sessionId: ev.thread_id })
          } else if (ev.type === 'item.completed' && ev.item?.type === 'agent_message') {
            last = ev.item.text
            onEvent({ kind: 'message', text: ev.item.text })
          } else if (ev.type === 'item.started' && ev.item?.type === 'command_execution') {
            onEvent({ kind: 'command', text: describe(ev.item.command) })
          } else if (ev.type === 'item.completed' && ev.item?.type === 'file_change') {
            const paths = (ev.item.changes ?? []).map((c: { path: string }) => c.path.replace(vaultPath() + '/', ''))
            onEvent({ kind: 'command', text: `Updated ${paths.join(', ') || 'notes'}` })
          } else if (ev.type === 'error' || ev.type === 'turn.failed') {
            onEvent({ kind: 'error', text: ev.message ?? ev.error?.message ?? 'Codex error' })
          }
        } catch { /* partial or non-JSON line */ }
      }
    })
    child.stderr.on('data', d => { stderr += d.toString() })
    child.on('error', err => {
      onEvent({ kind: 'error', text: `Could not start Codex: ${err.message}` })
      res({ sessionId: sid, text: '' })
    })
    child.on('close', code => {
      if (code !== 0 && !last) onEvent({ kind: 'error', text: stderr.trim().split('\n').slice(-3).join('\n') || `Codex exited with ${code}` })
      onEvent({ kind: 'done', text: last })
      res({ sessionId: sid, text: last })
    })
  })
}

export function codexStatus(): Promise<{ installed: boolean; loggedIn: boolean; detail: string }> {
  return new Promise(res => {
    execFile('codex', ['login', 'status'], { env }, (err, stdout, stderr) => {
      const out = `${stdout}${stderr}`.trim()
      if (err && (err as NodeJS.ErrnoException).code === 'ENOENT') return res({ installed: false, loggedIn: false, detail: 'Codex CLI not installed' })
      res({ installed: true, loggedIn: /logged in/i.test(out) && !/not logged in/i.test(out), detail: out })
    })
  })
}

export function codexLogin(): Promise<boolean> {
  return new Promise(res => {
    const child = spawn('codex', ['login'], { env, stdio: 'ignore' })
    child.on('error', () => res(false))
    child.on('close', code => res(code === 0))
  })
}
