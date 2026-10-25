// Anything the student drops into the chat lands in the brain first (00-INBOX or 08-RECORDINGS),
// turned into something Codex can read: PDF → text, audio → transcript, Word → text, images → seen directly.
import { execFile } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, extname, join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { inVault, writeNote } from './vault'
import { transcribeWav, type Progress } from './stt'

export type Prepared = { lines: string[]; images: string[] }
type Emit = (text: string) => void

const today = () => new Date().toLocaleDateString('en-CA')
const run = (cmd: string, args: string[]) => new Promise<void>((res, rej) =>
  execFile(cmd, args, { timeout: 600000 }, err => (err ? rej(err) : res())))

const IMAGE = /\.(png|jpe?g|gif|webp|heic|heif|tiff?|bmp)$/i
const AUDIO = /\.(m4a|mp3|wav|aac|aiff?|caf|flac|mp4|mov|m4v)$/i
const DOC = /\.(docx?|rtf|rtfd|odt|html?|pages)$/i
const TEXT = /\.(md|txt|csv|json|tex)$/i

/** Unique, readable file name inside a vault folder. */
function place(folder: string, src: string): string {
  const ext = extname(src)
  const stem = basename(src, ext).replace(/[^\p{L}\p{N}._-]+/gu, '-').replace(/-+/g, '-').slice(0, 60) || 'file'
  let rel = `${folder}/${stem}${ext.toLowerCase()}`
  for (let i = 2; existsSync(inVault(rel)); i++) rel = `${folder}/${stem}-${i}${ext.toLowerCase()}`
  mkdirSync(inVault(folder), { recursive: true })
  copyFileSync(src, inVault(rel))
  return rel
}

async function pdf(src: string, emit: Emit): Promise<string> {
  const rel = place('00-INBOX', src)
  emit(`Reading ${basename(src)}`)
  const { extractText, getDocumentProxy } = await import('unpdf')
  const doc = await getDocumentProxy(new Uint8Array(readFileSync(src)))
  const { text } = await extractText(doc, { mergePages: true })
  const md = rel.replace(/\.pdf$/i, '.md')
  writeNote(md, `---\ntype: reading\ndate: ${today()}\nsource: ${basename(rel)}\ntags: [reading]\n---\n# ${basename(rel, '.pdf')}\n\nPDF: ![[${rel}]]\n\n## Extracted text\n\n${text}\n`)
  return `- PDF ${rel} (its text is in ${md})`
}

async function image(src: string, images: string[], emit: Emit): Promise<string> {
  let rel = place('00-INBOX', src)
  // Codex reads common formats; iPhone photos (HEIC) become JPG with macOS sips.
  if (/\.(heic|heif|tiff?|bmp)$/i.test(rel) && process.platform === 'darwin') {
    const jpg = rel.replace(/\.[^.]+$/, '.jpg')
    await run('/usr/bin/sips', ['-s', 'format', 'jpeg', inVault(rel), '--out', inVault(jpg)])
    rmSync(inVault(rel), { force: true })
    rel = jpg
  }
  emit(`Looking at ${basename(src)}`)
  images.push(inVault(rel))
  return `- Image ${rel} (attached so you can see it)`
}

async function audio(src: string, emit: Emit, onProgress: (p: Progress) => void): Promise<string> {
  const rel = place('08-RECORDINGS', src)
  const wav = join(tmpdir(), `mbb-${randomUUID()}.wav`)
  emit(`Transcribing ${basename(src)}`)
  try {
    if (process.platform !== 'darwin') {
      if (!/\.wav$/i.test(rel)) throw new Error('not wav')
      copyFileSync(inVault(rel), wav)
    } else await run('/usr/bin/afconvert', ['-f', 'WAVE', '-d', 'LEI16@16000', '-c', '1', inVault(rel), wav])
  } catch {
    return `- Audio ${rel} (could not be converted for transcription; ask the student for another format)`
  }
  try {
    const segs = await transcribeWav(wav, onProgress)
    const pad = (n: number) => String(n).padStart(2, '0')
    const t = segs.filter(s => s.text).map(s => `[${pad(Math.floor(s.start / 60))}:${pad(Math.floor(s.start % 60))}] ${s.text}`).join('\n')
    const note = `00-INBOX/${today()}-${basename(rel, extname(rel))}.md`
    writeNote(note, `---\ntype: lecture\ndate: ${today()}\naudio: ${rel}\nstatus: raw\ntags: [lecture]\n---\n# ${basename(src)}\n\n![[${rel}]]\n\n## Transcript\n${t}\n`)
    return `- Audio ${rel}, transcribed into ${note} (treat it like a class recording unless it's clearly something else)`
  } catch (e) {
    return `- Audio ${rel} (transcription failed: ${(e as Error).message})`
  } finally {
    rmSync(wav, { force: true })
  }
}

async function doc(src: string, emit: Emit): Promise<string> {
  const rel = place('00-INBOX', src)
  emit(`Reading ${basename(src)}`)
  const md = rel.replace(/\.[^.]+$/, '.md')
  const txt = join(tmpdir(), `mbb-${randomUUID()}.txt`)
  try {
    // textutil ships with macOS: Word, RTF, ODT, HTML, Pages → plain text.
    if (process.platform !== 'darwin') throw new Error('textutil is macOS-only')
    await run('/usr/bin/textutil', ['-convert', 'txt', '-output', txt, inVault(rel)])
    writeNote(md, `---\ntype: reading\ndate: ${today()}\nsource: ${basename(rel)}\ntags: [reading]\n---\n# ${basename(rel)}\n\nOriginal: ![[${rel}]]\n\n## Extracted text\n\n${readFileSync(txt, 'utf8')}\n`)
    return `- Document ${rel} (its text is in ${md})`
  } catch {
    return `- Document ${rel} (could not extract text automatically; try reading it yourself)`
  } finally {
    rmSync(txt, { force: true })
  }
}

export async function prepareAttachments(paths: string[], emit: Emit, onProgress: (p: Progress) => void): Promise<Prepared> {
  const out: Prepared = { lines: [], images: [] }
  for (const p of paths) {
    try {
      if (/\.pdf$/i.test(p)) out.lines.push(await pdf(p, emit))
      else if (IMAGE.test(p)) out.lines.push(await image(p, out.images, emit))
      else if (AUDIO.test(p)) out.lines.push(await audio(p, emit, onProgress))
      else if (DOC.test(p)) out.lines.push(await doc(p, emit))
      else {
        const rel = place('00-INBOX', p)
        emit(`Saved ${basename(p)}`)
        out.lines.push(TEXT.test(p) ? `- File ${rel}` : `- File ${rel} (format the app can't open; inspect it if you can)`)
      }
    } catch (e) {
      out.lines.push(`- ${basename(p)}: could not be added (${(e as Error).message})`)
    }
  }
  return out
}

/** Short voice dictation for the chat box: PCM in, text out, with the student's chosen engine. */
export async function dictate(pcm: Buffer): Promise<string> {
  const header = Buffer.alloc(44)
  header.write('RIFF', 0); header.writeUInt32LE(36 + pcm.length, 4); header.write('WAVE', 8)
  header.write('fmt ', 12); header.writeUInt32LE(16, 16); header.writeUInt16LE(1, 20); header.writeUInt16LE(1, 22)
  header.writeUInt32LE(16000, 24); header.writeUInt32LE(32000, 28); header.writeUInt16LE(2, 32); header.writeUInt16LE(16, 34)
  header.write('data', 36); header.writeUInt32LE(pcm.length, 40)
  const wav = join(tmpdir(), `mbb-dictation-${randomUUID()}.wav`)
  const { writeFileSync } = await import('node:fs')
  writeFileSync(wav, Buffer.concat([header, pcm]))
  try {
    const segs = await transcribeWav(wav, () => {})
    return segs.map(s => s.text).join(' ').replace(/\s+/g, ' ').trim()
  } finally {
    rmSync(wav, { force: true })
  }
}
