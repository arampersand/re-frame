// Dueño: Audio. Graba en pedazos independientes de CHUNK_S segundos:
// se reinicia el MediaRecorder en cada pedazo para que cada archivo sea decodificable solo.
import { useRef, useState } from 'react'

const CHUNK_S = 15

export function useRecorder(onChunk: (blob: Blob, offsetS: number) => void) {
  const [recording, setRecording] = useState(false)
  const stream = useRef<MediaStream | null>(null)
  const timer = useRef<number | null>(null)
  const recorder = useRef<MediaRecorder | null>(null)
  const offset = useRef(0)

  const startChunk = () => {
    if (!stream.current) return
    const rec = new MediaRecorder(stream.current, { mimeType: 'audio/webm;codecs=opus' })
    const parts: Blob[] = []
    const startedAt = offset.current
    rec.ondataavailable = e => e.data.size && parts.push(e.data)
    rec.onstop = () => onChunk(new Blob(parts, { type: 'audio/webm' }), startedAt)
    rec.start()
    recorder.current = rec
  }

  const start = async () => {
    stream.current = await navigator.mediaDevices.getUserMedia({ audio: true })
    offset.current = 0
    setRecording(true)
    startChunk()
    timer.current = window.setInterval(() => {
      recorder.current?.stop()
      offset.current += CHUNK_S
      startChunk()
    }, CHUNK_S * 1000)
  }

  const stop = () => {
    if (timer.current) window.clearInterval(timer.current)
    recorder.current?.stop()
    stream.current?.getTracks().forEach(t => t.stop())
    stream.current = null
    setRecording(false)
  }

  return { recording, start, stop }
}
