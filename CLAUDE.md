# Re-Frame — reglas para agentes de código (Claude, Cursor, Copilot)

Lee esto completo antes de tocar código. Somos 5 personas trabajando en paralelo
durante un hackathon de 3 días. Tu trabajo es avanzar el issue de tu humano
**sin romper el de los otros cuatro**.

## Qué es Re-Frame
Copiloto de escritorio para universitarios: escucha la clase, sabe qué entendiste
y qué no, te lo reexplica en 4 representaciones (diagrama, analogía, ejemplo,
resumen) con quiz, y agenda el repaso en Google Calendar con tu permiso y con
recibo. **Explica, nunca hace la tarea.** Contexto completo: `docs/CONTEXT.md`.

## Reglas duras
1. **Solo toca los archivos del área del issue.** El mapa está en
   `CONTRIBUTING.md`. Si necesitas tocar otra área, detente y dile a tu humano.
2. **`backend/app/contracts.py` es la API de los 5.** No renombres ni borres
   campos. Agregar un campo opcional está bien solo si el issue tiene la
   etiqueta `contract-change`. Después corre `make contracts`.
3. **Nunca edites a mano** `contracts/schema.json` ni
   `desktop/src/renderer/src/api/contracts.ts`: se generan.
4. **Default alive.** La app debe arrancar y hacer la demo completa sin ninguna
   llave en `.env`. Todo lo que llame a un LLM, Whisper o Google necesita un
   camino de respaldo (ver `features/explain.py::_fallback`).
5. **Regla de oro de acciones.** "Ya lo hice" no cuenta. Toda acción externa
   deja un `Receipt`; `verified=True` solo si releímos el efecto en el destino.
   `failed` o `skipped` siempre con `reason`.
6. **Integridad académica.** No agregues nada que entregue trabajo evaluado
   resuelto. La regla vive en `backend/app/integrity.py` y tiene tests.
7. **Sin secretos en código.** Nunca escribas llaves en archivos versionados.
   Nunca pidas usuario/contraseña del LMS: importamos iCal y PDFs.
8. **No agregues dependencias** sin decirlo en el PR. No cambies de framework.
9. **Antes de terminar:** `make check` debe pasar. Si falla algo que no es tuyo,
   no lo "arregles": repórtalo.

## Stack
- Backend: Python 3.12+, FastAPI, Pydantic v2. Puerto 8787. Estado en
  `backend/data/state.json` (se crea desde `backend/seed/demo_semester.json`).
- Desktop: Electron + electron-vite + React 19 + TypeScript + Tailwind v4.
  Colores SOLO vía tokens de `theme/tokens.css` (`bg-surface`, `text-muted`,
  `bg-primary`, `bg-gap`…). Nada de hex sueltos en componentes.
- LLM: `app/ai/llm_client.py` (`chat_json`, `chat_text`) con failover. No
  importes SDKs de proveedores directo en features.

## Cómo agregar algo sin pisar a nadie
- Feature nueva de backend: archivo nuevo en `backend/app/features/`, con su
  `router`, y una línea en `app/main.py`. Test nuevo en `backend/tests/`.
- Pantalla nueva: carpeta nueva en `desktop/src/renderer/src/features/` y una
  línea en `SCREENS` de `App.tsx`.
- Llamada nueva al backend: un método en `api/client.ts`.
