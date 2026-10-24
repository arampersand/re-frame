---
type: knowledge
status: activo
date: 2026-09-29
last-updated: 2026-09-29
tags: [escuela, cifin-2026, congreso, ia, inventario]
ai-first: true
confidence: medium
---

## For future Claude

Inventario, hecho el 2026-09-29, de todo el trabajo de [[Fora]] documentado en el vault que sirve para la ponencia del eje de Inteligencia Artificial del CIFIN 2026 (ver [[cifin-2026-convocatoria]] y [[enfoque-narrativo]]). Las cifras salen de las notas de cada proyecto y tienen la fecha de esas notas, no de hoy: **antes de ponerlas en el resumen hay que volver a medirlas contra el sistema vivo**. La conclusión propone un segundo marco ("el LLM propone, el código verifica") como alternativa o complemento del modelo de madurez de memoria.

# CIFIN 2026 — inventario de trabajo con IA

## Descripción del eje (convocatoria)

"Automatizar la toma de decisiones complejas, optimizar procesos, predecir fallas mediante mantenimiento predictivo y simular escenarios de alta precisión." Título del eje: *Redefiniendo el rol del ingeniero*.

## Hallazgo transversal

Varios sistemas de Fora en producción comparten el mismo patrón sin que se haya diseñado a propósito: **el modelo de lenguaje redacta o propone, y una capa determinista verifica antes de que algo llegue al mundo.** Nació de fallas reales (Trafickads v1 inventó una recomendación). Es un problema de ingeniería reconocible (alucinaciones en pipelines automatizados) con evidencia medible, y empata con "automatizar la toma de decisiones complejas".

## Candidatos fuertes (evidencia medible en el vault)

| Proyecto | Qué hace con IA | Evidencia que ya existe | Autoría |
|---|---|---|---|
| Vault / memoria operativa ([[enfoque-narrativo]]) | Memoria externa versionada para agentes vía MCP; contrato AI-first | Métricas re-medidas abajo | Fora |
| [[el-atletico]] | Periódico automático: dedupe IDF + LLM, extracción de hechos (gpt-4.1-mini), redacción (gpt-4.1) y **verificador determinista que decide si se publica** | 58 tests; 23 notas en pruebas; ~$0.0033 por nota (~$2.40/mes); motivos de rechazo guardados en `notas_meta.problemas` y `fuentes_items.motivo_descarte` (as of 2026-08-19) | Fora (patrón heredado de Magio) |
| [[trafickads]] | Extractor de marca: reglas deterministas + LLM solo redacta + **citas verbatim verificadas por substring**; gate de identidad en investigación externa | v1 falló porque el LLM fabricó una recomendación; prueba xcaret.com 9/9 campos verificados; tally 28/60 titulares con fuente de respaldo y 56/60 oscuros antes del fix (as of 2026-09-20) | Fora + [[pedro-gutierrez]] |
| [[sportmetrics]] | Pipeline de video → eventos de juego; atribución con confianza | La auditoría interna comparaba dos salidas del mismo motor y reportó "captura perfecta" en un juego equivocado; con verdad externa (PBP oficial LNBP) el box score se reconstruye 3,942/3,942 celdas; 236/245 partidos cruzados (as of 2026-08-26) | Repo de [[kira]]; Fora hizo auditoría y datos |
| [[pid-sdd]] | Estándar de desarrollo con IA (Spec-Driven Development) para una empresa de ingeniería, multiagente | Instalación verificada en tres agentes; constitución basada en incidentes reales; **sin piloto aún** | Fora para [[pid-electronics]] |

## Candidatos de apoyo (sirven como ejemplo, no como caso)

- [[pit]] — agente físico (ESP32-S3 + Claude): planner → executor → reviewer → narrator, failover multiproveedor, herramientas con allowlist y degradación real → fallback → mock. 20/23 tests. Prototipo de hackatón, nunca corrió end-to-end en hardware.
- [[hablar-con-santa]] — agente de voz con ventas reales en 2025; análisis estructurado de cada llamada; patrón descontar-antes/reembolsar-si-falla. Faltan los números de ventas.
- [[2026-presentacion-pid-motor-de-leads]] — diseño de calificación de leads con IA para PID (DENUE, IMMEX); "calificar 5,000 empresas cuesta ~9 USD/mes". Sin construir.
- [[whatif-futbol]] — generación de imagen/video en la GPU del [[living-lab]]; hallazgos técnicos de consistencia de personaje. Salidas borradas.
- [[2026-aoagents-agent-orchestrator]] — orquestación de agentes de código en worktrees hasta PR.
- [[furbot]] — agente conversacional deportivo; dormido desde abril.
- Skills en `~/.claude/skills/` (procedimientos que los agentes ejecutan). Ojo: de los 52 instalados, muchos son de terceros (hyperframes, remotion, marketing); no citar 52 como propios sin contarlos uno por uno.

## Descartados para este eje

Sitios y landings de clientes, juegos, Caffecito, sweeply, JustEnvs (salvo el diseño de [[justenvs-agent-bridge]], que no está construido).

## Métricas del vault re-medidas (2026-09-29)

| Métrica | 2026-09-18 (resumen v1) | 2026-09-29 |
|---|---|---|
| Notas | 318 | 341 |
| Wikilinks | 3,896 | 4,106 |
| Notas con contrato AI-first | 313 | 336 |
| Commits | 227 | 244 (primero 2026-05-29) |
| Días con bitácora de agente | 88 | 94 |
| Operaciones de agente | 1,210 | **re-medir con el mismo método del v1** (un conteo simple de viñetas da 958; el método no coincide) |

## Opciones de ponencia

1. **Memoria operativa N0–N5** ([[enfoque-narrativo]]). Ya tiene narrativa. Riesgo: el caso B (Living Lab, [[magio-bustillos]]) no tiene datos documentados y quedan 9 días.
2. **"El LLM propone, el código verifica"**: patrón de verificación determinista para automatizar decisiones con LLM, con tres casos en producción (El Atlético, Trafickads, Sport Metrics). Tiene números y responde directo al eje. Requiere re-medir tasas de rechazo en las bases de datos vivas y coautoría o reconocimiento de Pedro y Kira.
3. **Las dos**: la convocatoria permite varios resúmenes (un registro y una cuota de $500 por cada uno).

Relacionado: [[cifin-2026-convocatoria]] · [[enfoque-narrativo]] · [[resumen-v1]] · [[_moc-escuela]] · [[Fora]]
