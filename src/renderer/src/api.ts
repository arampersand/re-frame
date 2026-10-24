import type { ReframeApi } from '../../preload'

declare global { interface Window { reframe: ReframeApi } }
export const rf = window.reframe

export type TreeNode = { name: string; path: string; dir: boolean; children?: TreeNode[] }
export type Msg = { role: 'user' | 'assistant'; text: string; steps?: string[]; at: string }
export type Chat = { id: string; title: string; sessionId: string | null; createdAt: string; messages: Msg[] }
export type CodexEvent = { kind: 'session' | 'message' | 'command' | 'done' | 'error'; text?: string; sessionId?: string }

/** Subscribe to a main-process event; returns the cleanup for useEffect. */
export function listen<T>(sub: (cb: (p: T) => void) => number, cb: (p: T) => void) {
  const id = sub(cb)
  return () => rf.off(id)
}
