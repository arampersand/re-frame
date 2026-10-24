# Re-Frame — rules for coding agents

- Electron + React + TypeScript + Tailwind v4, yarn. No backend server: the main process does files, Codex and Groq.
- The student's brain is plain markdown in `~/Documents/ReFrame`. Its behavior lives in `seed/vault/AGENTS.md`; change tutor behavior there, not in code.
- Colors only through `src/renderer/src/theme/tokens.css` tokens.
- New screen: folder in `src/renderer/src/features/`, one entry in `NAV` in `App.tsx`. New main capability: an `ipcMain.handle` in `src/main/index.ts` + method in `src/preload/index.ts`.
- `seed/vault` is a blank template. Never commit real student notes, recordings, PDFs or builds.
- Before finishing: `yarn typecheck`.
