import { contextBridge, ipcRenderer, webUtils } from 'electron'

// Functions don't survive the contextBridge as return values, so listeners get an id.
const listeners = new Map<number, [string, (...a: any[]) => void]>()
let nextId = 1
const on = (channel: string) => (cb: (payload: any) => void): number => {
  const fn = (_e: unknown, p: unknown) => cb(p)
  ipcRenderer.on(channel, fn)
  listeners.set(nextId, [channel, fn])
  return nextId++
}
const off = (id: number) => {
  const l = listeners.get(id)
  if (l) ipcRenderer.removeListener(l[0], l[1])
  listeners.delete(id)
}

const api = {
  vault: {
    info: () => ipcRenderer.invoke('vault:info'),
    tree: () => ipcRenderer.invoke('vault:tree'),
    graph: () => ipcRenderer.invoke('vault:graph'),
    read: (rel: string) => ipcRenderer.invoke('vault:read', rel),
    reveal: (rel?: string) => ipcRenderer.invoke('vault:reveal', rel)
  },
  chat: {
    list: () => ipcRenderer.invoke('chat:list'),
    get: (id: string) => ipcRenderer.invoke('chat:get', id),
    create: () => ipcRenderer.invoke('chat:new'),
    send: (id: string, text: string) => ipcRenderer.invoke('chat:send', id, text),
    onEvent: on('chat:event')
  },
  codex: {
    status: () => ipcRenderer.invoke('codex:status'),
    login: () => ipcRenderer.invoke('codex:login')
  },
  groq: {
    status: () => ipcRenderer.invoke('groq:status'),
    setKey: (key: string) => ipcRenderer.invoke('groq:setKey', key),
    test: () => ipcRenderer.invoke('groq:test')
  },
  audio: {
    start: () => ipcRenderer.invoke('audio:start'),
    chunk: (rel: string, data: ArrayBuffer, offsetS: number) => ipcRenderer.invoke('audio:chunk', rel, data, offsetS),
    finish: (rel: string) => ipcRenderer.invoke('audio:finish', rel),
    onText: on('audio:text')
  },
  pdf: {
    pick: () => ipcRenderer.invoke('pdf:pick'),
    import: (paths: string[]) => ipcRenderer.invoke('pdf:import', paths),
    pathFor: (file: File) => webUtils.getPathForFile(file)
  },
  onTask: on('task:event'),
  off
}

contextBridge.exposeInMainWorld('reframe', api)
export type ReframeApi = typeof api
