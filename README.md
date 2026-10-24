# Re-Frame

**Escucha tu clase. Detecta lo que no entendiste. Te lo explica de nuevo. Agenda el repaso.**

Re-Frame es un copiloto de escritorio para universitarios. Graba y transcribe la
clase en español o inglés. Tocas la frase que no entendiste y te la explica en
cuatro representaciones: diagrama, analogía, ejemplo resuelto y resumen. Un quiz
de tres preguntas actualiza el mapa de lo que sabes. Después propone un bloque
de repaso antes de tu siguiente examen y, con tu permiso, lo pone en Google
Calendar con un recibo verificado.

Explica, nunca hace la tarea.

> Hackathon UTEP · Track 1: Personalized Education for Every Student.
> Nombre provisional.

## Arranque en 3 comandos

Requisitos: Python 3.12+, Node 22+, make.

```bash
make setup      # instala backend y desktop, crea .env
make backend    # terminal 1 → API en http://127.0.0.1:8787/docs
make desktop    # terminal 2 → abre la app
```

Funciona **sin ninguna llave**: arranca con un semestre de demo ya cargado. Las
llaves activan la transcripción real, el LLM y Google Calendar. Ver `.env.example`.

### Llaves: cómo las repartimos
- **Cada quien** saca su propia llave gratis en console.groq.com y la pone en
  su `.env` como `GROQ_API_KEY`. Con eso funcionan el LLM y la transcripción.
- **Anthropic** (opcional, mejores explicaciones): una sola llave del equipo,
  compartida por mensaje privado. Nunca en el chat del grupo ni en git.
- **Google Calendar:** solo en la máquina de la demo.
- **No** las ponemos en Vercel ni detrás de un endpoint: una ruta que devuelve
  llaves es pública para cualquiera que la encuentre.

## Cómo está hecho

```
re-frame/
├── backend/                FastAPI · Python
│   ├── app/contracts.py    ← API compartida. Fuente de verdad.
│   ├── app/features/       una feature por archivo: lectures, explain, topics, today, ask, ingest
│   ├── app/ai/             LLM con failover Anthropic → Groq → Gemini → OpenAI
│   ├── app/audio/          Whisper (OpenAI o Groq)
│   ├── app/tools/          Google Calendar con verificación
│   ├── app/integrity.py    la regla "no hago tu tarea"
│   └── seed/               el semestre de demo (default alive)
├── desktop/                Electron · React · TypeScript · Tailwind
│   └── src/renderer/src/
│       ├── features/       today, lecture, explain, topics, receipts
│       ├── api/            cliente + tipos generados de contracts.py
│       └── theme/tokens.css  ← la marca vive aquí
├── contracts/schema.json   generado
└── docs/                   CONTEXT.md · ROADMAP.md
```

Flujo de cada acción: **propuesta → permiso → acción → recibo**. Un recibo con
`verified: true` significa que releímos el evento en Google y existe.

## Trabajar en equipo

- Lee [CONTRIBUTING.md](CONTRIBUTING.md): mapa de quién toca qué, ramas y PRs.
- Si usas Claude Code o similar, el repo trae [CLAUDE.md](CLAUDE.md) con las reglas.
- `make check` corre lo mismo que CI. Córrelo antes de cada PR.
- Contexto del proyecto y guion de la demo: [docs/CONTEXT.md](docs/CONTEXT.md).
- Recorrido del usuario y onboarding: [docs/USER-JOURNEY.md](docs/USER-JOURNEY.md).
- Etapas y funciones deseadas: [docs/ROADMAP.md](docs/ROADMAP.md).

## API rápida

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/today` | Plan del día: acciones propuestas, entregas, lagunas |
| POST | `/api/actions/{id}/approve` | Ejecuta en Google Calendar y devuelve el recibo |
| POST | `/api/lectures` | Empieza una clase |
| POST | `/api/lectures/{id}/audio` | Sube un pedazo de audio, devuelve segmentos |
| POST | `/api/lectures/{id}/segments/{seg}/confused` | "No entendí esto" |
| POST | `/api/explain` | 4 representaciones + quiz |
| POST | `/api/topics/{id}/quiz` | Resultado del quiz, actualiza el tema |
| POST | `/api/ask` | Pregunta libre con guardia de integridad |
| GET/POST | `/api/onboarding…` | Elicitación de 8 preguntas, reflexión y confirmación |
| POST | `/api/demo/reset` | Vuelve al semestre de demo |

Documentación interactiva en `http://127.0.0.1:8787/docs`.
