// Captures the mic as 16 kHz mono 16-bit PCM and hands it over about once a second.
// The main process streams it to a WAV on disk, so a long class never lives in memory.
import { useRef, useState } from 'react'

export function usePcmRecorder(onPcm: (pcm: ArrayBuffer) => void) {
  const [recording, setRecording] = useState(false)
  const [level, setLevel] = useState(0)
  const ctx = useRef<AudioContext | null>(null)
  const stream = useRef<MediaStream | null>(null)
  const node = useRef<ScriptProcessorNode | null>(null)
  const pending = useRef<Int16Array[]>([])
  const flushT = useRef<number | null>(null)

  const flush = () => {
    const parts = pending.current
    if (!parts.length) return
    pending.current = []
    const len = parts.reduce((n, p) => n + p.length, 0)
    const out = new Int16Array(len)
    let o = 0
    for (const p of parts) { out.set(p, o); o += p.length }
    onPcm(out.buffer)
  }

  const start = async () => {
    stream.current = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: false, noiseSuppression: true } })
    ctx.current = new AudioContext({ sampleRate: 16000 })
    const src = ctx.current.createMediaStreamSource(stream.current)
    node.current = ctx.current.createScriptProcessor(4096, 1, 1)
    node.current.onaudioprocess = e => {
      const f = e.inputBuffer.getChannelData(0)
      const pcm = new Int16Array(f.length)
      let peak = 0
      for (let i = 0; i < f.length; i++) {
        const v = Math.max(-1, Math.min(1, f[i]))
        pcm[i] = v * 0x7fff
        peak = Math.max(peak, Math.abs(v))
      }
      pending.current.push(pcm)
      setLevel(peak)
    }
    src.connect(node.current)
    node.current.connect(ctx.current.destination)
    flushT.current = window.setInterval(flush, 1000)
    setRecording(true)
  }

  const stop = async () => {
    if (flushT.current) window.clearInterval(flushT.current)
    node.current?.disconnect()
    stream.current?.getTracks().forEach(t => t.stop())
    await ctx.current?.close()
    flush()
    setRecording(false)
    setLevel(0)
  }

  return { recording, level, start, stop }
}
