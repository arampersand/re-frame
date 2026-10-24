import { app, BrowserWindow, dialog, ipcMain, session, shell } from 'electron'
import { join } from 'node:path'
import { ensureVault, tree, readNote, courses, vaultPath, graph } from './vault'
import { codexStatus, codexLogin, prepareCodex } from './codex'
import { testKey } from './groq'
import { getGroqKey, setGroqKey } from './settings'
import { listChats, getChat, newChat, sendChat, startLecture, lectureChunk, finishLecture, importPdf } from './brain'

let win: BrowserWindow | null = null
const send = (channel: string, payload: unknown) => win?.webContents.send(channel, payload)

function createWindow(): void {
  win = new BrowserWindow({
    width: 1320,
    height: 860,
    minWidth: 960,
    minHeight: 640,
    title: 'MyBrainBook',
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#0f1115',
    webPreferences: { preload: join(__dirname, '../preload/index.js'), sandbox: false, contextIsolation: true }
  })
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
  if (process.env.ELECTRON_RENDERER_URL) win.loadURL(process.env.ELECTRON_RENDERER_URL)
  else win.loadFile(join(__dirname, '../renderer/index.html'))
}

function registerIpc() {
  ipcMain.handle('vault:info', () => ({ path: ensureVault(), courses: courses() }))
  ipcMain.handle('vault:tree', () => tree())
  ipcMain.handle('vault:graph', () => graph())
  ipcMain.handle('vault:read', (_e, rel: string) => readNote(rel))
  ipcMain.handle('vault:reveal', (_e, rel?: string) => shell.showItemInFolder(rel ? join(vaultPath(), rel) : vaultPath()))

  ipcMain.handle('chat:list', () => listChats())
  ipcMain.handle('chat:get', (_e, id: string) => getChat(id))
  ipcMain.handle('chat:new', () => newChat())
  ipcMain.handle('chat:send', (_e, id: string, text: string) => sendChat(id, text, ev => send('chat:event', { chatId: id, ...ev })))

  ipcMain.handle('codex:status', () => codexStatus())
  ipcMain.handle('codex:login', () => codexLogin())

  ipcMain.handle('groq:status', () => ({ hasKey: !!getGroqKey() }))
  ipcMain.handle('groq:setKey', async (_e, key: string) => {
    const r = key ? await testKey(key) : { ok: true, detail: 'Key removed' }
    if (r.ok) setGroqKey(key)
    return r
  })
  ipcMain.handle('groq:test', async () => {
    const key = getGroqKey()
    return key ? testKey(key) : { ok: false, detail: 'No key yet' }
  })

  ipcMain.handle('audio:start', () => startLecture())
  ipcMain.handle('audio:chunk', (_e, rel: string, data: ArrayBuffer, offsetS: number) =>
    lectureChunk(rel, Buffer.from(data), offsetS, t => send('audio:text', { rel, ...t })))
  ipcMain.handle('audio:finish', (_e, rel: string) => finishLecture(rel, ev => send('task:event', { task: 'lecture', ...ev })))

  ipcMain.handle('pdf:pick', async () => {
    const r = await dialog.showOpenDialog(win!, { properties: ['openFile', 'multiSelections'], filters: [{ name: 'PDF', extensions: ['pdf'] }] })
    return r.canceled ? [] : r.filePaths
  })
  ipcMain.handle('pdf:import', async (_e, paths: string[]) => {
    const out: string[] = []
    for (const p of paths) out.push((await importPdf(p, ev => send('task:event', { task: 'pdf', ...ev }))).text)
    return out
  })
}

app.whenReady().then(() => {
  ensureVault()
  prepareCodex()
  session.defaultSession.setPermissionRequestHandler((_wc, permission, cb) => cb(permission === 'media'))
  registerIpc()
  createWindow()
  app.on('activate', () => BrowserWindow.getAllWindows().length === 0 && createWindow())
})

app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit())
