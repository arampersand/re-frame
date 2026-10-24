---
name: escritura-academica
description: Redacta y revisa documentos académicos en español (default) o inglés con registro formal, APA 7 y referencias verificadas — resúmenes/abstracts de congreso, artículos completos (IMRyD), entregables escolares de la UTCH con portada, y propuestas/protocolos de investigación. Incluye plantillas, guías de estilo por idioma, checklist de revisor y exportación a PDF. Úsalo cuando Fora pida escribir, estructurar, pulir o revisar un texto académico o escolar. Triggers "abstract", "resumen para el congreso", "artículo", "ponencia", "CIFIN", "ensayo", "reporte para la escuela", "entregable", "tarea de la UTCH", "protocolo", "propuesta de investigación", "marco teórico", "referencias APA", "cítame esto", "revísalo como revisor", "pásalo a inglés académico".
---

# escritura-academica

Skill para escribir documentos académicos que pasen un comité o un profe exigente. El texto final es de Fora: el skill estructura, redacta, verifica y critica, pero no inventa datos ni fuentes.

## Reglas duras (no negociables)

1. **Cero referencias inventadas.** Toda fuente se verifica antes de citarla (ver `references/citas-reales.md`). Si no se puede verificar, se marca `[REF PENDIENTE: …]` y se avisa. Nunca rellenar con una cita "plausible".
2. **Cero datos inventados.** Cifras, resultados, muestras y porcentajes salen de Fora o de una fuente citada. Si falta un dato, dejar `[DATO: qué falta]`.
3. **La convocatoria manda.** Si hay convocatoria o plantilla oficial (congreso, revista, profe), sus reglas pisan a este skill: extensión, orden, estilo de cita, formato.
4. **Autoría:** en documentos formales el autor es **Ángel Iván López Delgado**, Entornos Virtuales y Negocios Digitales, Universidad Tecnológica de Chihuahua (UTCH), Chihuahua, México. Nunca "Fora" en un documento académico.
5. **Entregas a Moodle UTCH van en PDF**, nunca .docx. PDFs se generan fuera del vault, se suben a Drive y el .md queda en el vault (regla del vault).

## Flujo

### 1. Identificar tipo de documento e idioma

| Pide… | Plantilla |
|---|---|
| Resumen / abstract de congreso o revista | `templates/resumen-congreso.md` |
| Artículo completo, ponencia en extenso, capítulo | `templates/articulo-completo.md` |
| Tarea, reporte, ensayo, caso de estudio para una materia | `templates/entregable-utch.md` |
| Propuesta, protocolo, anteproyecto, integradora, tesis | `templates/propuesta-protocolo.md` |

Idioma: **español de México por default**. Si el documento pide inglés (o bilingüe, como el abstract del CIFIN), carga también `references/estilo-en.md`. Nunca traducir literal: se reescribe en el registro del otro idioma.

### 2. Recolectar insumos antes de escribir

Preguntar solo lo que falte y no se pueda sacar del vault:
- Convocatoria / instrucciones del profe (extensión, estructura, estilo de cita, fecha).
- Objetivo o tesis central en una oración. Si Fora no la puede decir en una oración, el problema es de enfoque, no de redacción: ayudarle a afilarla primero.
- Datos, resultados y fuentes que ya tiene.
- Materia y profe (entregables UTCH).

Buscar contexto en el vault antes de preguntar (`11-ESCUELA/`, `08-KNOWLEDGE/`, `02-PROJECTS/`).

### 3. Redactar

- Seguir la plantilla correspondiente y la guía de estilo del idioma (`references/estilo-es.md` o `references/estilo-en.md`).
- Citas en **APA 7** (`references/apa7.md`) salvo que la convocatoria diga otra cosa.
- Borrador en markdown dentro del vault (ruta según `CLAUDE.md` del vault; lo escolar va en `11-ESCUELA/…`), con frontmatter del vault.
- Contar palabras de las secciones con límite (`wc -w` sobre el fragmento) y reportarlo.

### 4. Revisar como comité

Pasar el borrador por `references/revision.md` antes de entregarlo a Fora. Reportar los hallazgos priorizados (bloqueantes → mejoras), no solo "quedó bien". Esta revisión también sirve sola: "revísame esto como revisor".

### 5. Exportar

- **PDF (entregables UTCH, versiones para leer):** `scripts/md_to_pdf.py` (ver abajo).
- **Plantilla Word oficial (congresos/revistas que dan .docx):** usar el skill `anthropic-skills:docx` y **llenar la plantilla oficial** descargada, no recrearla. Respetar columnas, fuentes y estilos que trae.
- Después: subir a Drive (`gog drive upload <archivo> --parent <folderId>`; escuela → carpeta UTCH `1V14Inac6IepeiaQybqd_u4fsJOQDUNZZ`), guardar el link en la nota .md y borrar la copia local.

## Exportar a PDF

```bash
~/.claude/skills/escritura-academica/.venv/bin/python \
  ~/.claude/skills/escritura-academica/scripts/md_to_pdf.py \
  <entrada.md> <salida.pdf> \
  [--portada-utch --materia "Nombre de la materia" --titulo "Título del trabajo" --profe "Nombre del profe"] \
  [--fecha "29 de septiembre de 2026"] [--equipo "Nombre compañero" ...]
```

- Quita el frontmatter YAML y la sección `## For future Claude` automáticamente.
- `--portada-utch` agrega la portada institucional con el escudo (`/Users/fora/secondbrain/08-KNOWLEDGE/.utch-logo.png`).
- Carta, márgenes 2.5 cm, Arial 12 / interlineado 1.5, referencias con sangría francesa (sección cuyo título empiece con "Referencias" o "References").
- Usa Chrome headless; si falla, avisar en vez de cambiar a otro formato.
- Salida siempre en el scratchpad de la sesión, nunca dentro del vault.

## Archivos

- `references/estilo-es.md` — registro académico en español, muletillas prohibidas, normas RAE que más se violan.
- `references/estilo-en.md` — registro académico en inglés y trampas de hispanohablante.
- `references/apa7.md` — citas en texto y lista de referencias, ejemplos en ambos idiomas.
- `references/citas-reales.md` — cómo buscar y verificar fuentes (DOI, Crossref, Google Scholar, repositorios LATAM).
- `references/revision.md` — checklist de revisor por pares.
- `templates/*.md` — esqueletos por tipo de documento.
