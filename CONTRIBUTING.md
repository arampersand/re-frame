# Cómo trabajamos los 7 sin estorbarnos

## El flujo
1. Toma un issue y asígnatelo. Si no hay issue, créalo antes de programar.
2. Rama: `tu-nombre/numero-tema`, por ejemplo `magio/3-grabacion`.
3. Commits chicos. PR en cuanto algo funcione, aunque sea feo. **Nada directo a `main`.**
4. `make check` antes de abrir el PR. CI corre lo mismo.
5. Una persona más aprueba y se hace *squash merge*. Si toca archivos del
   integrador (ver CODEOWNERS), aprueba el integrador.
6. Después de cada merge a `main`, todos: `git pull --rebase origin main`.

## Mapa de áreas: quién toca qué

| Área | Backend | Desktop |
|---|---|---|
| Audio | `app/audio/`, `features/lectures.py` | `features/lecture/useRecorder.ts` |
| Explicador | `features/explain.py`, `features/ask.py`, `integrity.py` | `features/explain/` |
| Estado por tema | `features/topics.py` | `features/topics/` |
| Acciones | `features/today.py`, `tools/`, `features/ingest.py` | `features/today/`, `features/receipts/` |
| Datos de demo | `seed/` | — |
| Frontend y layout | — | `components/`, `features/lecture/LectureScreen.tsx` |
| Branding (Vic) | — | `theme/tokens.css`, `branding/`, `desktop/resources/` |
| Integrador | `contracts.py`, `main.py`, `store.py`, `config.py` | `App.tsx`, `api/` |

Archivos compartidos (`contracts.py`, `main.py`, `App.tsx`, `api/client.ts`):
cambios mínimos, de una línea si se puede, y avisas en el chat del equipo.

## Contratos
`backend/app/contracts.py` es la fuente de verdad de lo que viaja entre
backend y desktop. Para cambiarlo:
1. Abre un issue con la plantilla **Cambio de contrato**.
2. Agregar un campo opcional: adelante. Renombrar o borrar: lo decide el integrador.
3. `make contracts` regenera `contracts/schema.json` y los tipos TypeScript.
4. Comitea los tres archivos juntos. CI falla si se te olvida.

## Si usas Claude Code u otro agente
El repo trae `CLAUDE.md` con las reglas. Antes de pedirle algo grande dile:
*"lee CLAUDE.md y CONTRIBUTING.md; solo puedes tocar los archivos de mi área"*.
Revisa el diff antes de comitear. Si tocó archivos fuera de tu área, deshazlo.

## Si algo se rompe en main
1. Avisa en el chat.
2. `git revert` del commit culpable, no lo arregles encima a ciegas.
3. El dueño del PR lo rehace con calma en su rama.

## Freeze
Día 3 a las 12:00 se congela `main`. Después solo arreglos de demo aprobados
por el integrador.
