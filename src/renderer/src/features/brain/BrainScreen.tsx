import { useEffect, useState } from 'react'
import { rf, type TreeNode } from '@/api'
import { Button, Markdown } from '@/components/ui'
import { GraphView } from './GraphView'

function Node({ n, depth, selected, onSelect }: { n: TreeNode; depth: number; selected: string | null; onSelect: (p: string) => void }) {
  const [open, setOpen] = useState(depth < 1 || !!selected?.startsWith(n.path + '/'))
  const pad = { paddingLeft: 8 + depth * 14 }
  if (n.dir) return (
    <div>
      <button style={pad} onClick={() => setOpen(!open)} className="flex w-full items-center gap-1.5 rounded px-2 py-1 text-left text-sm text-muted hover:bg-surface-2">
        <span className="w-3 text-xs">{open ? '▾' : '▸'}</span>📁 {n.name}
      </button>
      {open && n.children?.map(c => <Node key={c.path} n={c} depth={depth + 1} selected={selected} onSelect={onSelect} />)}
    </div>
  )
  return (
    <button style={pad} onClick={() => onSelect(n.path)}
      className={`block w-full truncate rounded px-2 py-1 pl-6 text-left text-sm ${selected === n.path ? 'bg-primary text-primary-ink' : 'hover:bg-surface-2'}`}>
      {n.name.endsWith('.pdf') ? '📄' : '📝'} {n.name.replace(/\.md$/, '')}
    </button>
  )
}

export function BrainScreen({ selected, onSelect }: { selected: string | null; onSelect: (p: string) => void }) {
  const [tree, setTree] = useState<TreeNode[]>([])
  const [text, setText] = useState('')
  const [path, setPath] = useState('')
  const [mode, setMode] = useState<'files' | 'graph'>(selected ? 'files' : 'graph')

  const load = () => rf.vault.tree().then(setTree)
  useEffect(() => { load(); rf.vault.info().then(i => setPath(i.path)) }, [])
  useEffect(() => {
    if (!selected) { setText(''); return }
    if (selected.endsWith('.pdf')) { setText(`PDF: **${selected}**\n\nIts extracted text and summary live in the \`.md\` with the same name.`); return }
    rf.vault.read(selected).then(setText).catch(() => setText(`_Note not found: ${selected}_`))
  }, [selected])

  return (
    <div className="flex h-full">
      <aside className="w-72 overflow-auto border-r border-border p-3 pt-10">
        <div className="mb-3 flex rounded-lg border border-border p-0.5 text-xs">
          {(['graph', 'files'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 rounded-md py-1.5 ${mode === m ? 'bg-primary text-primary-ink' : 'text-muted hover:bg-surface-2'}`}>
              {m === 'graph' ? '🕸️ Graph' : '📝 Note'}
            </button>
          ))}
        </div>
        <div className="mb-3 flex items-center justify-between px-2">
          <p className="text-sm font-semibold">My brain</p>
          <div className="flex gap-1">
            <Button variant="ghost" onClick={load}>↻</Button>
            <Button variant="ghost" onClick={() => rf.vault.reveal(selected ?? undefined)}>Finder</Button>
          </div>
        </div>
        {tree.map(n => <Node key={n.path} n={n} depth={0} selected={selected} onSelect={p => { onSelect(p); setMode('files') }} />)}
        <p className="mt-4 break-all px-2 text-xs text-muted">{path}</p>
      </aside>
      {mode === 'graph' ? (
        <section className="relative flex-1 overflow-hidden">
          <GraphView selected={selected} onSelect={p => { onSelect(p); setMode('files') }} />
          <p className="pointer-events-none absolute right-4 top-10 text-xs text-muted">Click a node to open it · drag to move · scroll to zoom</p>
        </section>
      ) : (
      <article className="flex-1 overflow-auto px-10 pb-10 pt-10">
        {selected
          ? <><p className="mb-4 text-xs text-muted">{selected}</p><Markdown text={text} onLink={p => onSelect(p.endsWith('.md') ? p : `${p}.md`)} /></>
          : <div className="mt-24 text-center text-muted">
              <p className="text-2xl">🧠</p>
              <p className="mt-2">Everything you record, upload and chat lives here as plain notes.</p>
              <p className="text-sm">Start with <button className="wikilink" onClick={() => onSelect('01-ME/profile.md')}>profile</button> or <button className="wikilink" onClick={() => onSelect('03-DEADLINES.md')}>deadlines</button>.</p>
            </div>}
      </article>
      )}
    </div>
  )
}
