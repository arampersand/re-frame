# Second Brain — <Nombre del alumno>

Se carga en cada sesión de Claude Code abierta en este vault.

## Quién soy
<Nombre>, alumno de <carrera> en <universidad>, <N>º cuatrimestre.
Nombre completo para documentos formales: <Nombre completo>. Matrícula: <opcional>.

## Reglas de operación
- Markdown only. Frontmatter YAML con `type`, `status`, `last-updated`, `tags`.
- Cada archivo tiene al menos un `[[wikilink]]` a otro relacionado.
- Español por default. Voz directa.

## Routing
| Tema | Dónde va |
|---|---|
| Índice de la escuela | `11-ESCUELA/_moc-escuela.md` |
| Materia | `11-ESCUELA/<NN>-cuatrimestre/<materia>/_moc-<materia>.md` |
| Notas de clase | `.../<materia>/clases/YYYY-MM-DD-<tema>.md` |
| Material del profe (PDF, slides) analizado | `.../<materia>/materiales/<slug>.md` |
| Tareas / entregables | `.../<materia>/entregables/<slug>.md` |
| Proyecto integrador (transversal) | `11-ESCUELA/<NN>-cuatrimestre/proyecto-integrador.md` |
| Profes y compañeros | `07-PEOPLE/<slug>.md` |
| Guías de estudio reusables | `08-KNOWLEDGE/<YYYY>-<fuente>-<tema>.md` |
| Daily log | `06-LOG/Daily/YYYY-MM-DD.md` |

## Cross-linking
- Cada materia linkea a su profe, al proyecto integrador y a sus entregables.
- Cada profe linkea a su(s) materia(s).
- Cada entregable linkea a su materia y a los materiales que usó.

## Materiales y PDFs
- El vault guarda solo `.md`. Cuando llegue un PDF o slides del profe: analizarlo y documentarlo en `materiales/` (resumen, conceptos clave, lo que piden evaluar).
- Los entregables se exportan a PDF (skill `escritura-academica`), se suben a Drive y el link se guarda en la nota del entregable.
- Todo lo que se sube a Moodle va en PDF, nunca Word.

## Tareas
- `utch tareas` / `utch agenda --dias 14` para ver lo pendiente en Moodle.
- Al detectar una tarea nueva: crear la nota en `entregables/` con fecha de cierre, instrucciones y rúbrica, y linkearla desde el MOC de la materia.

## Antes de responder
1. Revisa `11-ESCUELA/_moc-escuela.md`.
2. Si la pregunta es de una materia, lee su `_moc` antes de buscar.
