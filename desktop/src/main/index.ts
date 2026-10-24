import { app, BrowserWindow, session, shell } from 'electron'
import { join } from 'node:path'

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 960,
    minHeight: 640,
    title: 'Re-Frame',
    backgroundColor: '#0f1115',
    webPreferences: { preload: join(__dirname, '../preload/index.js'), sandbox: true, contextIsolation: true }
  })
  // Links externos (Google Calendar) en el navegador, no dentro de la app.
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
  if (process.env.ELECTRON_RENDERER_URL) win.loadURL(process.env.ELECTRON_RENDERER_URL)
  else win.loadFile(join(__dirname, '../renderer/index.html'))
}

app.whenReady().then(() => {
  // El micrófono es la feature central: lo permitimos solo para 'media'.
  session.defaultSession.setPermissionRequestHandler((_wc, permission, cb) => cb(permission === 'media'))
  createWindow()
  app.on('activate', () => BrowserWindow.getAllWindows().length === 0 && createWindow())
})

app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit())
