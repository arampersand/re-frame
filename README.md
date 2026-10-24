# Re-Frame

**The second brain for students.** A Mac app where everything from school lives in one place, as plain notes you own:

- **Chat** like ChatGPT, but it answers from *your* classes, PDFs and deadlines, and cites the note it used.
- **Record class.** Hit record, it transcribes every 15 s (Spanish or English). When you stop, it figures out which course it was and files it with summary, key concepts and open questions. If it is not sure, it asks.
- **PDFs.** Drag a PDF from school into the chat; it lands in the right course.
- **My brain.** Folder view and an Obsidian-style graph of how your courses, teachers, classes and assignments connect.
- **Integrations.** AI runs on the ChatGPT plan you already have (via Codex). Transcription runs on Groq Whisper (free key).

The brain is a folder of markdown at `~/Documents/ReFrame`. It opens in Obsidian as is. `AGENTS.md` inside it tells the AI how to be a tutor for that student: answer from their material, explain instead of doing graded work, track what they don't get yet.

## Run it

Requires Node 22+, yarn and the [Codex CLI](https://github.com/openai/codex) logged in with ChatGPT (`codex login`).

```bash
yarn
yarn dev
```

First launch creates `~/Documents/ReFrame` from `seed/vault` (an empty template). Add your Groq key in **Integrations** to record classes.

## How it's built

```
src/main/        Electron main: vault files, Codex runner, Groq transcription, IPC
  vault.ts       brain folder, tree, wikilink graph
  codex.ts       `codex exec --json` in the brain folder, streamed to the UI
  groq.ts        Whisper client + serial queue (ported from dictadito)
  brain.ts       chats, class recordings, PDF import
src/preload/     the `window.reframe` API
src/renderer/    React UI: Chat, Record class, My brain (files + graph), Integrations
seed/vault/      empty brain template + AGENTS.md (the tutor rules)
```

Never commit builds, recordings or anyone's personal notes: `.gitignore` blocks `out/`, `dist/`, media and packaged apps.
