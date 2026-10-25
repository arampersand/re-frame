import { app } from 'electron'
import { spawn, execFile, execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { delimiter, join } from 'node:path'
import { vaultPath } from './vault'
import { MCP_TOKEN, mcpCalendarUrl } from './mcp-calendar'

// Codex ships inside the app (official @openai/codex binaries), so students install nothing.
const IS_WIN = process.platform === 'win32'
const EXE = IS_WIN ? '.exe' : ''
// Windows keeps the official layout: bin/codex.exe, codex-resources/ (sandbox helpers), codex-path/rg.exe.
const codexRoot = app.isPackaged
  ? join(process.resourcesPath, 'codex')
  : IS_WIN ? join(app.getAppPath(), 'vendor', 'win', 'codex') : join(app.getAppPath(), 'vendor', 'codex', process.arch)
const bundledDir = IS_WIN ? join(codexRoot, 'bin') : codexRoot
const BUNDLED = existsSync(join(bundledDir, `codex${EXE}`))
const CODEX = BUNDLED ? join(bundledDir, `codex${EXE}`) : 'codex'

// obsidian-mcp gives Codex BM25-ranked search over the brain (index lives in <brain>/.obsidian-mcp).
const SEARCH = app.isPackaged
  ? join(process.resourcesPath, 'obsidian-mcp', `obsidian-mcp${EXE}`)
  : IS_WIN ? join(app.getAppPath(), 'vendor', 'win', 'obsidian-mcp', 'obsidian-mcp.exe')
  : join(app.getAppPath(), 'vendor', 'obsidian-mcp', process.arch, 'obsidian-mcp')
const searchArgs = () => existsSync(SEARCH)
  ? ['-c', `mcp_servers.brain.command=${JSON.stringify(SEARCH)}`, '-c', `mcp_servers.brain.args=[${JSON.stringify(vaultPath())}]`]
  : []

/** Downloaded apps carry the quarantine flag; clear it on our own helper binaries. */
export function prepareCodex() {
  if (!BUNDLED || !app.isPackaged || IS_WIN) return
  try { execFileSync('xattr', ['-dr', 'com.apple.quarantine', process.resourcesPath]) } catch { /* not quarantined or read-only */ }
}

// Apps launched from Finder don't inherit the shell PATH: ask the login shell, plus common spots.
function shellPath(): string {
  if (IS_WIN) return ''
  try {
    return execFileSync(process.env.SHELL || '/bin/zsh', ['-ilc', 'printf %s "$PATH"'], { timeout: 4000, encoding: 'utf8' }).trim()
  } catch { return '' }
}
const PATH = (IS_WIN
  ? [bundledDir, join(codexRoot, 'codex-path'), process.env.PATH ?? process.env.Path ?? '']
  : [...(BUNDLED ? [bundledDir] : []), shellPath(), '/opt/homebrew/bin', '/usr/local/bin', `${homedir()}/.local/bin`, `${homedir()}/.npm-global/bin`, '/usr/bin', '/bin', process.env.PATH ?? ''])
  .filter(Boolean).join(delimiter)
const env = { ...process.env, PATH, ...(IS_WIN ? { Path: PATH } : {}), MBB_CALENDAR_TOKEN: MCP_TOKEN }

export type CodexEvent =
  | { kind: 'session'; sessionId: string }
  | { kind: 'message'; text: string }
  | { kind: 'command'; text: string }
  | { kind: 'done'; text: string }
  | { kind: 'error'; text: string }

/** Turns a shell command Codex runs into something a student can read. */
function describe(cmd: string): string {
  const inner = cmd.replace(/^\/bin\/(z|ba)?sh -lc\s+/, '').replace(/^.*?(powershell|pwsh)(\.exe)?"?\s+(-\w+\s+)*/i, '').replace(/^["']|["']$/g, '')
  const files = inner.match(/[\w./-]+\.(md|pdf)/g)
  if (/^(rg|grep)\b/.test(inner)) return `Searching your brain${files ? `: ${files[0]}` : ''}`
  if (files?.length) return `Reading ${[...new Set(files)].slice(0, 3).join(', ')}`
  return inner.length > 80 ? inner.slice(0, 80) + '…' : inner
}

export function runCodex(prompt: string, sessionId: string | null, onEvent: (e: CodexEvent) => void, images: string[] = []): Promise<{ sessionId: string | null; text: string }> {
  // --ignore-user-config: students get only MyBrainBook's tools, never whatever is in ~/.codex/config.toml.
  const cal = mcpCalendarUrl()
  const calendarArgs = cal ? ['-c', `mcp_servers.calendar.url=${JSON.stringify(cal)}`, '-c', 'mcp_servers.calendar.bearer_token_env_var="MBB_CALENDAR_TOKEN"',
    // Write tools need pre-approval in exec mode (nobody can click "allow"); the student consented by connecting.
    '-c', 'mcp_servers.calendar.default_tools_approval_mode="approve"'] : []
  const args = ['exec', '--json', '-C', vaultPath(), '-s', 'workspace-write', '--skip-git-repo-check', '--ignore-user-config', ...searchArgs(), ...calendarArgs]
  // --image=<path> (not -i <path>): the flag is variadic and would swallow the prompt.
  const img = images.map(p => `--image=${p}`)
  if (sessionId) args.push('resume', sessionId, ...img, prompt)
  else args.push(...img, prompt)

  return new Promise(res => {
    const child = spawn(CODEX, args, { env, cwd: vaultPath(), stdio: ['ignore', 'pipe', 'pipe'] })
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
          } else if (ev.type === 'item.started' && ev.item?.type === 'mcp_tool_call') {
            const a = ev.item.arguments ?? {}
            const what = a.query ?? a.path ?? a.pattern ?? ''
            const verb = ev.item.tool === 'add_calendar_event' ? '📅 Adding to Google Calendar' : ev.item.tool === 'delete_calendar_event' ? '📅 Removing from Google Calendar'
              : /calendar/.test(ev.item.tool) ? '📅 Checking your calendar' : /search/.test(ev.item.tool) ? 'Searching your brain' : /read/.test(ev.item.tool) ? 'Reading' : ev.item.tool
            if (/calendar/.test(ev.item.tool)) { onEvent({ kind: 'command', text: a.title ? `${verb}: ${a.title}` : verb }); continue }
            onEvent({ kind: 'command', text: what ? `${verb}: ${String(what).slice(0, 60)}` : verb })
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
    execFile(CODEX, ['login', 'status'], { env }, (err, stdout, stderr) => {
      const out = `${stdout}${stderr}`.trim()
      if (err && (err as NodeJS.ErrnoException).code === 'ENOENT') return res({ installed: false, loggedIn: false, detail: 'AI engine missing from this build' })
      res({ installed: true, loggedIn: /logged in/i.test(out) && !/not logged in/i.test(out), detail: out })
    })
  })
}

export function codexLogin(): Promise<boolean> {
  return new Promise(res => {
    const child = spawn(CODEX, ['login'], { env, stdio: 'ignore' })
    child.on('error', () => res(false))
    child.on('close', code => res(code === 0))
  })
}
