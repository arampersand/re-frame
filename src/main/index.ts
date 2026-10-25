import { app, BrowserWindow, dialog, ipcMain, net, protocol, session, shell } from 'electron'
import { pathToFileURL } from 'node:url'
import { join } from 'node:path'
import { ensureVault, tree, readNote, courses, vaultPath, graph, inVault } from './vault'
import { codexStatus, codexLogin, prepareCodex } from './codex'
import { testKey } from './groq'
import { sttStatus, setEngine, downloadModel, type Engine } from './stt'
import { getGroqKey, setGroqKey } from './settings'
import { listChats, getChat, newChat, sendChat, finishLecture } from './brain'
import { dictate } from './attachments'
import { startRecording, appendPcm, transcribeRecording, listRecordings, ensureNoteFor } from './recording'
import { calendarStatus, connectCalendar, disconnectCalendar, pendingDeadlines, addDeadlines } from './calendar'

// Never die silently: log to ~/Library/Logs/MyBrainBook/main.log instead of crashing.
import { appendFileSync, mkdirSync } from 'node:fs'
const logLine = (msg: string) => {
  try { const dir = app.getPath('logs'); mkdirSync(dir, { recursive: true }); appendFileSync(join(dir, 'main.log'), `${new Date().toISOString()} ${msg}\n`) } catch { /* ignore */ }
}
process.on('uncaughtException', e => logLine(`uncaught: ${e.stack ?? e}`))
process.on('unhandledRejection', e => logLine(`unhandled: ${(e as Error)?.stack ?? e}`))

// brain://vault/<path> serves files from the student's brain (audio players, PDFs). Range requests work.
protocol.registerSchemesAsPrivileged([{ scheme: 'brain', privileges: { standard: true, secure: true, stream: true, supportFetchAPI: true } }])

let win: BrowserWindow | null = null
const send = (channel: string, payload: unknown) => win?.webContents.send(channel, payload)

function createWindow(): void {
  win = new BrowserWindow({
    width: 1320,
    height: 860,
    minWidth: 960,
    minHeight: 640,
    title: 'MyBrainBook',
    ...(process.platform === 'darwin' ? { titleBarStyle: 'hiddenInset' as const } : { autoHideMenuBar: true }),
    backgroundColor: '#0f1115',
    webPreferences: { preload: join(__dirname, '../preload/index.js'), sandbox: false, contextIsolation: true }
  })
  win.webContents.on('render-process-gone', (_e, d) => { logLine(`renderer gone: ${d.reason}`); if (d.reason !== 'clean-exit') win?.reload() })
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
  ipcMain.handle('chat:send', (_e, id: string, text: string, files: string[] = []) =>
    sendChat(id, text, files, ev => send('chat:event', { chatId: id, ...ev }), p => send('chat:event', { chatId: id, kind: 'progress', text: `${p.pct}%` })))
  ipcMain.handle('stt:dictate', (_e, pcm: ArrayBuffer) => dictate(Buffer.from(pcm)))

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

  ipcMain.handle('calendar:status', () => calendarStatus())
  ipcMain.handle('calendar:connect', () => connectCalendar())
  ipcMain.handle('calendar:disconnect', () => disconnectCalendar())
  ipcMain.handle('calendar:pending', () => pendingDeadlines())
  ipcMain.handle('calendar:add', (_e, approve: string[], ignore: string[]) => addDeadlines(approve, ignore))

  ipcMain.handle('stt:status', () => sttStatus())
  ipcMain.handle('stt:setEngine', (_e, engine: Engine) => { setEngine(engine); return sttStatus() })
  ipcMain.handle('stt:download', () => downloadModel(pct => send('stt:progress', pct)))

  ipcMain.handle('audio:list', () => listRecordings())
  ipcMain.handle('audio:retry', (_e, audio: string) => {
    const rel = ensureNoteFor(audio)
    return transcribeRecording(rel, p => send('audio:progress', { rel, ...p })).then(r => ({ ...r, rel }))
  })
  ipcMain.handle('audio:start', () => startRecording())
  ipcMain.on('audio:pcm', (_e, rel: string, data: ArrayBuffer) => appendPcm(rel, Buffer.from(data)))
  ipcMain.handle('audio:transcribe', (_e, rel: string) => transcribeRecording(rel, p => send('audio:progress', { rel, ...p })))
  ipcMain.handle('audio:finish', (_e, rel: string) => finishLecture(rel, ev => send('task:event', { task: 'lecture', ...ev })))

  ipcMain.handle('files:pick', async () => {
    const r = await dialog.showOpenDialog(win!, { properties: ['openFile', 'multiSelections'] })
    return r.canceled ? [] : r.filePaths
  })
}

app.whenReady().then(() => {
  ensureVault()
  prepareCodex()
  protocol.handle('brain', req => {
    try {
      const rel = decodeURIComponent(new URL(req.url).pathname.replace(/^\//, ''))
      return net.fetch(pathToFileURL(inVault(rel)).toString(), { headers: req.headers })
    } catch { return new Response('Not found', { status: 404 }) }
  })
  session.defaultSession.setPermissionRequestHandler((_wc, permission, cb) => cb(permission === 'media'))
  registerIpc()
  createWindow()
  app.on('activate', () => BrowserWindow.getAllWindows().length === 0 && createWindow())
})

app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit())
