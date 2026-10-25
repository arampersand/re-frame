// Calendar tools for Codex, served as a streamable-HTTP MCP server on 127.0.0.1 with a per-launch token.
// Codex adds, checks and removes events itself; the student never has to press a button.
import { createServer } from 'node:http'
import { randomBytes } from 'node:crypto'
import { addEvent, calendarStatus, deleteEvent, listEvents, type EventInput } from './calendar'

export const MCP_TOKEN = randomBytes(24).toString('hex')
let port = 0
export const mcpCalendarUrl = () => (port ? `http://127.0.0.1:${port}/mcp` : null)

const TOOLS = [
  {
    name: 'calendar_status',
    description: "Is the student's Google Calendar connected? Call this before saying anything about their calendar.",
    annotations: { readOnlyHint: true },
    inputSchema: { type: 'object', properties: {} }
  },
  {
    name: 'add_calendar_event',
    description: "Add a class, exam, homework or any dated item to the student's Google Calendar (their MyBrainBook calendar), with reminders. The event is read back from Google before this returns, so ok:true means it really exists.",
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Short title, e.g. "Clase extra: Arquitectura de Redes"' },
        date: { type: 'string', description: 'YYYY-MM-DD' },
        time: { type: 'string', description: 'HH:MM 24 h. Omit for an all-day item.' },
        duration_minutes: { type: 'number', description: 'Default 30 (90 for exams).' },
        kind: { type: 'string', enum: ['class', 'exam', 'quiz', 'homework', 'project', 'presentation', 'other'] },
        course: { type: 'string' },
        notes: { type: 'string' }
      },
      required: ['title', 'date']
    }
  },
  {
    name: 'list_calendar_events',
    description: 'List events in the MyBrainBook calendar (to find one before changing or deleting it, or to check what is scheduled).',
    annotations: { readOnlyHint: true },
    inputSchema: { type: 'object', properties: { from: { type: 'string', description: 'YYYY-MM-DD, default yesterday' }, to: { type: 'string', description: 'YYYY-MM-DD' } } }
  },
  {
    name: 'delete_calendar_event',
    description: 'Delete an event from the MyBrainBook calendar by id (get it from list_calendar_events). Confirms it is gone.',
    inputSchema: { type: 'object', properties: { event_id: { type: 'string' } }, required: ['event_id'] }
  }
]

async function callTool(name: string, args: Record<string, unknown>) {
  switch (name) {
    case 'calendar_status': return calendarStatus()
    case 'add_calendar_event': return addEvent(args as unknown as EventInput)
    case 'list_calendar_events': return listEvents(args.from as string | undefined, args.to as string | undefined)
    case 'delete_calendar_event': return deleteEvent(String(args.event_id))
    default: throw new Error(`Unknown tool ${name}`)
  }
}

type Rpc = { jsonrpc: '2.0'; id?: number | string; method: string; params?: Record<string, unknown> }

async function handle(msg: Rpc) {
  const reply = (result: unknown) => ({ jsonrpc: '2.0', id: msg.id, result })
  switch (msg.method) {
    case 'initialize':
      return reply({
        protocolVersion: (msg.params?.protocolVersion as string) ?? '2025-03-26',
        capabilities: { tools: {} },
        serverInfo: { name: 'mybrainbook-calendar', version: '1.0.0' }
      })
    case 'ping': return reply({})
    case 'tools/list': return reply({ tools: TOOLS })
    case 'tools/call': {
      const p = msg.params as { name: string; arguments?: Record<string, unknown> }
      try {
        const out = await callTool(p.name, p.arguments ?? {})
        return reply({ content: [{ type: 'text', text: JSON.stringify(out) }], isError: (out as { ok?: boolean }).ok === false })
      } catch (e) {
        return reply({ content: [{ type: 'text', text: JSON.stringify({ ok: false, error: (e as Error).message }) }], isError: true })
      }
    }
    default:
      return msg.id === undefined ? null : { jsonrpc: '2.0', id: msg.id, error: { code: -32601, message: `Method not found: ${msg.method}` } }
  }
}

export function startCalendarMcp(): Promise<void> {
  return new Promise(resolve => {
    const server = createServer(async (req, res) => {
      if (req.headers.authorization !== `Bearer ${MCP_TOKEN}`) { res.writeHead(401).end(); return }
      if (req.method !== 'POST') { res.writeHead(405).end(); return }
      let body = ''
      for await (const chunk of req) body += chunk
      let parsed: Rpc | Rpc[]
      try { parsed = JSON.parse(body) } catch { res.writeHead(400).end(); return }
      const batch = Array.isArray(parsed) ? parsed : [parsed]
      const results = (await Promise.all(batch.map(handle))).filter(Boolean)
      if (!results.length) { res.writeHead(202).end(); return }
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(Array.isArray(parsed) ? results : results[0]))
    })
    server.listen(0, '127.0.0.1', () => { port = (server.address() as { port: number }).port; resolve() })
  })
}
