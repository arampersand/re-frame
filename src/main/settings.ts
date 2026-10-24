import { app, safeStorage } from 'electron'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

type Settings = { vaultPath: string; groqKeyEnc?: string }

const file = () => join(app.getPath('userData'), 'settings.json')

export function loadSettings(): Settings {
  const fallback: Settings = { vaultPath: join(homedir(), 'Documents', 'ReFrame') }
  if (!existsSync(file())) return fallback
  try { return { ...fallback, ...JSON.parse(readFileSync(file(), 'utf8')) } } catch { return fallback }
}

function save(s: Settings) { writeFileSync(file(), JSON.stringify(s, null, 2)) }

export function getGroqKey(): string | null {
  const enc = loadSettings().groqKeyEnc
  if (!enc) return process.env.GROQ_API_KEY || null
  const buf = Buffer.from(enc, 'base64')
  return safeStorage.isEncryptionAvailable() ? safeStorage.decryptString(buf) : buf.toString('utf8')
}

export function setGroqKey(key: string) {
  const s = loadSettings()
  const buf = safeStorage.isEncryptionAvailable() ? safeStorage.encryptString(key) : Buffer.from(key, 'utf8')
  save({ ...s, groqKeyEnc: key ? buf.toString('base64') : undefined })
}
