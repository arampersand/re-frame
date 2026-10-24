import { contextBridge } from 'electron'

// Lo mínimo. Si necesitas exponer algo de Node al renderer, va aquí y en un issue.
contextBridge.exposeInMainWorld('reframe', { platform: process.platform })
