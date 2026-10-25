import { app } from 'electron'
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join, relative, resolve, sep } from 'node:path'
import { loadSettings } from './settings'

export const vaultPath = () => loadSettings().vaultPath

/** Creates the student's brain the first time, copying the demo seed. */
export function ensureVault(): string {
  const root = vaultPath()
  if (!existsSync(join(root, 'AGENTS.md'))) {
    const seed = app.isPackaged ? join(process.resourcesPath, 'seed', 'vault') : join(app.getAppPath(), 'seed', 'vault')
    mkdirSync(root, { recursive: true })
    cpSync(seed, root, { recursive: true, force: false, errorOnExist: false })
  }
  for (const d of ['00-INBOX', '01-ME', '02-COURSES', '04-CHATS']) mkdirSync(join(root, d), { recursive: true })
  return root
}

/** Resolves a path inside the vault and refuses anything that escapes it. */
export function inVault(rel: string): string {
  const root = resolve(vaultPath())
  const abs = resolve(root, rel)
  if (abs !== root && !abs.startsWith(root + sep)) throw new Error('Path outside the brain')
  return abs
}

export type TreeNode = { name: string; path: string; dir: boolean; children?: TreeNode[] }

export function tree(dir = vaultPath()): TreeNode[] {
  return readdirSync(dir)
    .filter(n => !n.startsWith('.') && n !== '04-CHATS')
    .sort()
    .map(name => {
      const abs = join(dir, name)
      const isDir = statSync(abs).isDirectory()
      return {
        name,
        path: relative(vaultPath(), abs),
        dir: isDir,
        children: isDir ? tree(abs) : undefined
      }
    })
    .filter(n => n.dir || /\.(md|pdf|m4a|wav)$/i.test(n.name))
}

export const readNote = (rel: string) => readFileSync(inVault(rel), 'utf8')

export function courses(): string[] {
  const dir = join(vaultPath(), '02-COURSES')
  if (!existsSync(dir)) return []
  return readdirSync(dir).filter(n => statSync(join(dir, n)).isDirectory()).sort()
}

export function writeNote(rel: string, text: string) {
  const abs = inVault(rel)
  mkdirSync(join(abs, '..'), { recursive: true })
  writeFileSync(abs, text)
}

export type Graph = { nodes: { id: string; label: string; group: string; links: number }[]; links: { source: string; target: string }[] }

function allNotes(dir = vaultPath(), out: string[] = []): string[] {
  for (const n of readdirSync(dir)) {
    if (n.startsWith('.') || n === '04-CHATS') continue
    const abs = join(dir, n)
    if (statSync(abs).isDirectory()) allNotes(abs, out)
    else if (n.endsWith('.md')) out.push(relative(vaultPath(), abs))
  }
  return out
}

/** Notes as nodes, [[wikilinks]] as edges — the Obsidian graph view. */
export function graph(): Graph {
  const notes = allNotes()
  const byName = new Map(notes.map(n => [n.split('/').pop()!.replace(/\.md$/, ''), n]))
  const set = new Set(notes)
  const links: Graph['links'] = []
  const seen = new Set<string>()
  for (const n of notes) {
    const text = readFileSync(join(vaultPath(), n), 'utf8')
    for (const m of text.matchAll(/\[\[([^\]|#]+)/g)) {
      const raw = m[1].trim()
      const target = set.has(raw) ? raw : set.has(raw + '.md') ? raw + '.md' : byName.get(raw.split('/').pop()!)
      const key = [n, target].sort().join('>')
      if (target && target !== n && !seen.has(key)) { seen.add(key); links.push({ source: n, target }) }
    }
  }
  const degree = new Map<string, number>()
  for (const l of links) for (const k of [l.source, l.target]) degree.set(k, (degree.get(k) ?? 0) + 1)
  const nodes = notes.map(id => {
    const parts = id.split('/')
    const file = parts.pop()!.replace(/\.md$/, '')
    return {
      id,
      label: file === 'index' ? parts[parts.length - 1] : file.replace(/^\d{4}-\d{2}-\d{2}-/, ''),
      group: parts[0] === '02-COURSES' ? (parts[1] ?? '02-COURSES') : (parts[0] ?? 'root'),
      links: degree.get(id) ?? 0
    }
  })
  return { nodes, links }
}
