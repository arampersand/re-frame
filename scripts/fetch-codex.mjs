// Downloads the official Codex CLI binaries (npm @openai/codex) for both Mac archs
// into vendor/codex/<arch>/codex so they ship inside the app. Not committed.
import { execFileSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, readdirSync, copyFileSync, chmodSync, existsSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

const VERSION = process.env.CODEX_VERSION || '0.164.0'
for (const arch of ['arm64', 'x64']) {
  const out = join('vendor', 'codex', arch)
  if (existsSync(join(out, 'codex'))) { console.log(`codex ${arch} already there`); continue }
  const tmp = mkdtempSync(join(tmpdir(), `codex-${arch}-`))
  execFileSync('npm', ['pack', `@openai/codex@${VERSION}-darwin-${arch}`, '--silent'], { cwd: tmp })
  const tgz = readdirSync(tmp).find(f => f.endsWith('.tgz'))
  execFileSync('tar', ['-xzf', tgz], { cwd: tmp })
  const find = (dir, name) => readdirSync(dir).flatMap(f => {
    const p = join(dir, f)
    return statSync(p).isDirectory() ? find(p, name) : (f === name ? [p] : [])
  })
  mkdirSync(out, { recursive: true })
  // codex itself + ripgrep, which Codex uses to search the student's notes.
  for (const name of ['codex', 'rg']) {
    const bin = find(join(tmp, 'package'), name)[0]
    if (!bin) throw new Error(`${name} not found for ${arch}`)
    copyFileSync(bin, join(out, name))
    chmodSync(join(out, name), 0o755)
    console.log(`${name} ${arch} ← ${bin.replace(tmp, '')}`)
  }
}
