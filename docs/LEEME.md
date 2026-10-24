# Secondbrain estudiantil — kit de Fora

Todo lo de la escuela que vive en mi second brain (Obsidian + Claude Code), tal cual lo uso en el 10º cuatrimestre de Entornos Virtuales y Negocios Digitales (UTCH). La idea es que lo copien y lo armen para alumnos.

## Qué hay en esta carpeta

| Carpeta | Qué es |
|---|---|
| `vault/` | Las notas en markdown. Se abre directo en Obsidian ("Open folder as vault"). |
| `vault/11-ESCUELA/` | El corazón: un folder por cuatrimestre, uno por materia. Cada materia tiene `_moc-<materia>.md` (índice), `clases/`, `materiales/` y `entregables/`. También el CIFIN 2026 (ponencia en congreso, v1→v3 + dictamen). |
| `vault/07-PEOPLE/` | Una nota por profe (y compañeros del equipo integrador). Cada materia linkea a su profe. |
| `vault/08-KNOWLEDGE/` | Guías de estudio y conocimiento reusable (inglés, negociación, BI, matrices, hacking ético). |
| `vault/04-COMPANIES/utch.md` | La institución como nodo del grafo. |
| `vault/03-GUIONES/` | Dos guiones de reels donde explico este mismo sistema (Moodle → second brain, "ya no hago mis tareas"). |
| `pdfs-entregados/` | Los PDFs que sí entregué en Moodle, más docs, pitch deck y evidencias del proyecto integrador (SIMA). |
| `herramientas/escritura-academica/` | Skill de Claude Code: redacción académica, APA 7, plantillas (entregable con portada, resumen de congreso, artículo, protocolo) y `scripts/md_to_pdf.py` para sacar el PDF. |
| `herramientas/utch-cli/utch` | CLI en Python que lee las tareas de Moodle (VirtualTI) con la API oficial de la app móvil. |
| `CLAUDE-plantilla.md` | Las reglas que Claude sigue en el vault, versión estudiante. Se renombra a `CLAUDE.md` en la raíz del vault. |

## Cómo funciona el flujo

1. **Moodle → vault.** `utch tareas` / `utch agenda` lista lo pendiente. El material de cada clase (PDF, slides) se le pasa a Claude, que lo **analiza y lo deja en markdown** en `materiales/`. Regla: el vault guarda solo `.md`, los binarios no.
2. **Cada materia es un MOC.** `_moc-<materia>.md` tiene objetivo, unidades, profe, criterios de evaluación y links a clases/materiales/entregables.
3. **Proyecto transversal.** `proyecto-integrador.md` es la nota eje: cliente, equipo y qué aporta cada materia. Las materias linkean ahí en vez de duplicar el contexto.
4. **Entregable.** Claude redacta en `entregables/<nombre>.md` usando el contexto de la materia y la skill `escritura-academica` (portada, APA). Luego se exporta a PDF, el PDF se sube a Drive y el link queda en la nota.
5. **Grafo.** Todo tiene `[[wikilinks]]`: materia ↔ profe ↔ proyecto ↔ entregable. Por eso Claude puede responder "¿qué me falta de Inteligencia de Negocios?" sin buscar a ciegas.

## Para armarlo desde cero

1. Instalar Obsidian y Claude Code.
2. Crear una carpeta vault y copiar ahí `CLAUDE-plantilla.md` como `CLAUDE.md`.
3. Copiar la estructura de `vault/11-ESCUELA/` (vaciar las notas o usarlas de ejemplo).
4. Skill: copiar `herramientas/escritura-academica/` a `~/.claude/skills/`. **Ojo:** trae mi nombre como autor en `SKILL.md`, `scripts/md_to_pdf.py` (variable `AUTOR`) y en las plantillas; cámbienlo por el del alumno. Requiere `pip install markdown` (y lo que pida el script) en un venv dentro de la skill.
5. CLI: copiar `herramientas/utch-cli/utch` a `~/.local/bin/`, `chmod +x`, y correr `utch login` (pide matrícula y contraseña una vez; guarda solo el token en `~/.config/utch/config.json`). Sirve para cualquier Moodle cambiando `WWWROOT`.
6. Opcional: MCP de Obsidian para que Claude busque en el vault con ranking.

## Notas

- Las notas traen datos reales míos, de profes y compañeros. Son de ejemplo, no para republicarse.
- `Reporte_Frameworks_PWA_Lucia_...pdf` no se incluyó porque es trabajo de una compañera.
