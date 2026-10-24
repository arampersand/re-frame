// Obsidian-style graph: notes are nodes, [[wikilinks]] are edges. Canvas + d3-force.
import { useEffect, useRef, useState } from 'react'
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide, type SimulationNodeDatum } from 'd3-force'
import { rf } from '@/api'

type N = SimulationNodeDatum & { id: string; label: string; group: string; links: number }
type L = { source: N | string; target: N | string }

const PALETTE = ['#7c5cff', '#2fbf71', '#f2b632', '#ef5b5b', '#3fb8f0', '#ff7ac6', '#ff9f43', '#00d2d3', '#a3e635', '#c084fc', '#f87171', '#94a3b8', '#fde047', '#5eead4']

export function GraphView({ selected, onSelect }: { selected: string | null; onSelect: (p: string) => void }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [groups, setGroups] = useState<{ name: string; color: string }[]>([])

  useEffect(() => {
    const el = canvas.current!
    const ctx = el.getContext('2d')!
    let nodes: N[] = []
    let links: L[] = []
    let hover: N | null = null
    let view = { x: 0, y: 0, k: 1 }
    let drag: { node?: N; panX?: number; panY?: number; moved?: boolean } | null = null
    const color = new Map<string, string>()
    let raf = 0

    const resize = () => {
      const r = el.parentElement!.getBoundingClientRect()
      el.width = r.width * devicePixelRatio
      el.height = r.height * devicePixelRatio
      el.style.width = `${r.width}px`
      el.style.height = `${r.height}px`
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(el.parentElement!)

    const radius = (n: N) => 4 + Math.sqrt(n.links) * 2.6
    const toWorld = (cx: number, cy: number) => {
      const r = el.getBoundingClientRect()
      return { x: (cx - r.left - r.width / 2 - view.x) / view.k, y: (cy - r.top - r.height / 2 - view.y) / view.k }
    }
    const hit = (cx: number, cy: number) => {
      const p = toWorld(cx, cy)
      return nodes.find(n => Math.hypot(n.x! - p.x, n.y! - p.y) < radius(n) + 4) ?? null
    }

    const sim = forceSimulation<N>()
      .force('charge', forceManyBody().strength(-160))
      .force('center', forceCenter(0, 0))
      .force('collide', forceCollide<N>().radius(n => radius(n) + 8))
      .alphaDecay(0.02)

    const draw = () => {
      const w = el.width, h = el.height, dpr = devicePixelRatio
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, w, h)
      ctx.setTransform(dpr * view.k, 0, 0, dpr * view.k, w / 2 + view.x * dpr, h / 2 + view.y * dpr)
      const near = new Set<string>()
      const focus = hover ?? nodes.find(n => n.id === selected) ?? null
      if (focus) for (const l of links) {
        const s = l.source as N, t = l.target as N
        if (s.id === focus.id) near.add(t.id)
        if (t.id === focus.id) near.add(s.id)
      }
      ctx.lineWidth = 1 / view.k
      for (const l of links) {
        const s = l.source as N, t = l.target as N
        const lit = focus && (s.id === focus.id || t.id === focus.id)
        ctx.strokeStyle = lit ? 'rgba(124,92,255,0.9)' : focus ? 'rgba(154,161,178,0.08)' : 'rgba(154,161,178,0.25)'
        ctx.beginPath(); ctx.moveTo(s.x!, s.y!); ctx.lineTo(t.x!, t.y!); ctx.stroke()
      }
      for (const n of nodes) {
        const dim = focus && n.id !== focus.id && !near.has(n.id)
        ctx.globalAlpha = dim ? 0.2 : 1
        ctx.fillStyle = color.get(n.group) ?? '#9aa1b2'
        ctx.beginPath(); ctx.arc(n.x!, n.y!, radius(n), 0, Math.PI * 2); ctx.fill()
        if (n.id === selected) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 2 / view.k; ctx.stroke() }
        if (view.k > 0.7 || n.links > 3 || n === focus || near.has(n.id)) {
          ctx.fillStyle = '#e8eaf0'
          ctx.font = `${11 / Math.max(view.k, 0.8)}px Inter, system-ui, sans-serif`
          ctx.textAlign = 'center'
          ctx.fillText(n.label, n.x!, n.y! + radius(n) + 12 / Math.max(view.k, 0.8))
        }
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }

    rf.vault.graph().then((g: { nodes: N[]; links: L[] }) => {
      const gs = [...new Set(g.nodes.map(n => n.group))]
      gs.forEach((name, i) => color.set(name, PALETTE[i % PALETTE.length]))
      setGroups(gs.map(name => ({ name, color: color.get(name)! })))
      nodes = g.nodes
      links = g.links
      sim.nodes(nodes).force('link', forceLink<N, any>(links).id(d => d.id).distance(60).strength(0.6)).alpha(1).restart()
    })
    raf = requestAnimationFrame(draw)

    const down = (e: MouseEvent) => {
      const n = hit(e.clientX, e.clientY)
      drag = n ? { node: n } : { panX: e.clientX - view.x, panY: e.clientY - view.y }
    }
    const move = (e: MouseEvent) => {
      if (drag?.node) {
        const p = toWorld(e.clientX, e.clientY)
        drag.node.fx = p.x; drag.node.fy = p.y; drag.moved = true
        sim.alphaTarget(0.3).restart()
      } else if (drag) {
        view = { ...view, x: e.clientX - drag.panX!, y: e.clientY - drag.panY! }
      } else {
        hover = hit(e.clientX, e.clientY)
        el.style.cursor = hover ? 'pointer' : 'grab'
      }
    }
    const up = () => {
      if (drag?.node) {
        if (!drag.moved) onSelect(drag.node.id)
        drag.node.fx = null; drag.node.fy = null
        sim.alphaTarget(0)
      }
      drag = null
    }
    const wheel = (e: WheelEvent) => {
      e.preventDefault()
      view = { ...view, k: Math.min(4, Math.max(0.2, view.k * (e.deltaY < 0 ? 1.1 : 0.9))) }
    }
    el.addEventListener('mousedown', down)
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
    el.addEventListener('wheel', wheel, { passive: false })
    return () => {
      cancelAnimationFrame(raf); sim.stop(); ro.disconnect()
      el.removeEventListener('mousedown', down)
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
      el.removeEventListener('wheel', wheel)
    }
  }, [selected])

  return (
    <div className="relative h-full w-full">
      <canvas ref={canvas} />
      <div className="absolute bottom-4 left-4 space-y-1 rounded-lg border border-border bg-surface/90 p-3 text-xs">
        {groups.map(g => <p key={g.name} className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: g.color }} />{g.name}</p>)}
      </div>
    </div>
  )
}
