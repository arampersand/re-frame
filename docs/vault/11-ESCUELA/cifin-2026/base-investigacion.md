---
type: knowledge
status: activo
date: 2026-09-29
last-updated: 2026-09-29
tags: [escuela, cifin-2026, congreso, ia, referencias, second-brain]
ai-first: true
confidence: high
---

## For future Claude

Base de investigación de la ponencia de [[Fora]] en el CIFIN 2026 ([[cifin-2026-convocatoria]]). Decisión de Fora (2026-09-29): el marco técnico de la ponencia es el repositorio `obsidian-second-brain` de Eugeniu Ghelbur, que a su vez extiende el patrón "LLM Wiki" de Andrej Karpathy; sobre esa base se presentan dos casos de estudio. Metadatos verificados el 2026-09-29 contra GitHub (API y HTML), no de memoria. Las estrellas y la versión cambian rápido: re-verificar antes del artículo completo.

# CIFIN 2026 — base de investigación

## Casos de estudio (decisión de Fora, 2026-09-29)

- **Caso A — Fora:** todo lo que hace con su second brain (el vault, los agentes que lo leen y escriben, skills, bitácora, trabajo multiproyecto). Métricas en [[inventario-ia]].
- **Caso B — [[magio-bustillos]]:** su caso de estudio del [[living-lab]] (agentes que controlan accesos y climatización). Se le ofrece coautoría. Datos pendientes.
- Abogados: solo implicación / ejemplo hipotético, no caso (ver [[enfoque-narrativo]]).

## Referencias base (verificadas 2026-09-29)

**1. obsidian-second-brain** — la herramienta sobre la que corre el caso A.
- Repo: https://github.com/eugeniughelbur/obsidian-second-brain
- Autor: Eugeniu Ghelbur (afiliación declarada: Single Grain). Licencia MIT.
- Trae `CITATION.cff` (el autor pide cita si se usa en investigación).
- Creado 2026-03-24. As of 2026-09-29: 4,645 estrellas, 577 forks, última versión v0.17.0 (2026-09-26).
- **Versión que usa Fora: 0.8.0** (instalada en `~/.claude/skills/obsidian-second-brain`, último commit local 2026-05-28). Para el método se cita la versión usada, no la última.
- Qué aporta: arquitectura en capas (operaciones del vault, herramientas de pensamiento, motor de contexto, agentes programados, agente de fondo), regla de escritura AI-first, validador al escribir, conexión por MCP, corre en varios agentes (Claude Code, Codex CLI, Gemini CLI, OpenCode). Detalle en `architecture.md` del repo.

**2. LLM Wiki (Karpathy)** — el patrón conceptual.
- https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f — creado **2026-04-04** (verificado en el HTML; un resumidor automático reportó 2023 por error).
- Idea central, cita textual: el LLM "incrementally builds and maintains a persistent wiki" y "the wiki is a persistent, compounding artifact". Contrasta con RAG (NotebookLM, subir archivos a ChatGPT), que redescubre el conocimiento en cada pregunta.
- El propio gist lista usos: personal, investigación, lectura de libros, negocio/equipo. Sirve para justificar la transferibilidad (abogados).

### En APA 7

Ghelbur, E. (2026). *obsidian-second-brain* (Versión 0.8.0) [Software]. GitHub. https://github.com/eugeniughelbur/obsidian-second-brain

Karpathy, A. (2026, 4 de abril). *LLM Wiki* [Gist]. GitHub. https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f

Ojo: el artículo completo del CIFIN usa su propio formato de referencias, no APA (ver [[cifin-2026-convocatoria]]). Convertir al entregar.

## Cómo encaja en la ponencia

La ponencia no presenta la herramienta como propia. La contribución de Fora es: (1) la aplicación sostenida durante cuatro meses en trabajo real de ingeniería con evidencia versionada, (2) sus propias extensiones (reglas de feedback, skills, bitácora, verificación de estado vivo) y (3) el modelo de madurez N0–N5 que ubica los dos casos. Hay que dejar clara esa línea para que nadie diga que se presenta el trabajo de otro.

Relacionado: [[enfoque-narrativo]] · [[inventario-ia]] · [[cifin-2026-convocatoria]] · [[magio-bustillos]] · [[living-lab]] · [[Fora]]
