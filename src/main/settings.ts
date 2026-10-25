import { app, safeStorage } from 'electron'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

type Settings = {
  vaultPath: string; groqKeyEnc?: string; sttEngine?: 'local' | 'groq'
  googleRefreshEnc?: string; googleEmail?: string | null; googleCalendarId?: string
}

const file = () => join(app.getPath('userData'), 'settings.json')

export function loadSettings(): Settings {
  const fallback: Settings = { vaultPath: join(homedir(), 'Documents', 'MyBrainBook') }
  if (!existsSync(file())) return fallback
  try { return { ...fallback, ...JSON.parse(readFileSync(file(), 'utf8')) } } catch { return fallback }
}

function save(s: Settings) { writeFileSync(file(), JSON.stringify(s, null, 2)) }

export function saveSettings(patch: Partial<Settings>) { save({ ...loadSettings(), ...patch }) }

/** Presence only: never touches the keychain, so it can't block the app. */
export const hasGroqKey = () => !!(loadSettings().groqKeyEnc || process.env.GROQ_API_KEY)

// Keychain reads are async: if macOS asks for permission, only this call waits, not the whole app.
const cache = new Map<string, string>()
export async function decryptSecret(enc: string): Promise<string> {
  const hit = cache.get(enc)
  if (hit !== undefined) return hit
  const buf = Buffer.from(enc, 'base64')
  const out = (await safeStorage.isAsyncEncryptionAvailable()) ? (await safeStorage.decryptStringAsync(buf)).result : buf.toString('utf8')
  cache.set(enc, out)
  return out
}
export async function encryptSecret(plain: string): Promise<string> {
  const buf = (await safeStorage.isAsyncEncryptionAvailable()) ? await safeStorage.encryptStringAsync(plain) : Buffer.from(plain, 'utf8')
  const enc = buf.toString('base64')
  cache.set(enc, plain)
  return enc
}

export async function getGroqKey(): Promise<string | null> {
  const enc = loadSettings().groqKeyEnc
  return enc ? decryptSecret(enc) : process.env.GROQ_API_KEY || null
}

export async function setGroqKey(key: string) {
  saveSettings({ groqKeyEnc: key ? await encryptSecret(key) : undefined })
}
