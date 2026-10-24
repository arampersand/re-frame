// Dueño: Acciones. Lo que Re-Frame hizo, con prueba del sistema destino.
import { useEffect, useState } from 'react'
import { api } from '@/api/client'
import type { Receipt } from '@/api/contracts'
import { Card } from '@/components/ui'

export function ReceiptsScreen() {
  const [rs, setRs] = useState<Receipt[]>([])
  useEffect(() => { api.receipts().then(setRs) }, [])
  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-2xl font-semibold">Recibos</h1>
      <p className="text-sm text-muted">Sin recibo, no pasó. Cada acción guarda la respuesta del sistema destino.</p>
      {rs.map(r => (
        <Card key={r.id} className="text-sm">
          <div className="flex justify-between">
            <span className="font-medium">{r.target} · {r.status}{r.verified ? ' · verificado' : ''}</span>
            <span className="text-muted">{new Date(r.created_at).toLocaleString()}</span>
          </div>
          {r.reason && <p className="text-muted">{r.reason}</p>}
          {r.external_url && <a className="text-primary underline" href={r.external_url} target="_blank" rel="noreferrer">Ver en Google Calendar</a>}
        </Card>
      ))}
    </div>
  )
}
