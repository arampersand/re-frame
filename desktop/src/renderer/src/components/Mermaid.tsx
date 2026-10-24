import { useEffect, useId, useState } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({ startOnLoad: false, theme: 'dark', securityLevel: 'strict' })

export function Mermaid({ code }: { code: string }) {
  const id = useId().replace(/:/g, '')
  const [svg, setSvg] = useState('')
  const [error, setError] = useState(false)
  useEffect(() => {
    let alive = true
    mermaid.render(`m${id}`, code)
      .then(r => alive && (setSvg(r.svg), setError(false)))
      .catch(() => alive && setError(true))
    return () => { alive = false }
  }, [code, id])
  if (error) return <pre className="overflow-auto text-xs text-muted">{code}</pre>
  return <div className="flex max-h-[420px] justify-center overflow-auto [&_svg]:h-auto [&_svg]:max-w-full" dangerouslySetInnerHTML={{ __html: svg }} />
}
