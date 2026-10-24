---
type: knowledge
status: superseded
date: 2026-09-18
last-updated: 2026-09-18
tags: [escuela, utch, cifin-2026, congreso, ia, investigacion]
ai-first: true
confidence: high
---

## For future Claude

**Superado as of 2026-09-21:** el marco cambió a un modelo de madurez de memoria operativa con dos casos — ver [[enfoque-narrativo]]. Este texto se conserva como referencia de redacción (cumple formato y longitud) pero el v2 se escribe sobre el nuevo enfoque.

Borrador v1 del resumen (abstract) que [[Fora]] enviará al 2do Congreso Internacional de las Fronteras de las Ingenierías (CIFIN 2026, UACJ + [[utch]]), eje temático de Inteligencia Artificial. Fecha límite de envío: 8-oct-2026; artículo completo si es aceptado: 30-oct-2026. El tema es el propio vault de Fora enmarcado como arquitectura de memoria persistente para agentes de IA. Las cifras del resumen se midieron del vault el 2026-09-18 y hay que **recalcularlas antes de enviar** si pasan semanas. Ver convocatoria y logística en [[cifin-2026-convocatoria]].

# CIFIN 2026 — Resumen v1

## Metadatos de autoría (para la plantilla)

- **Autor único y de correspondencia:** Ángel Iván López Delgado
- **Afiliación:** Entornos Virtuales y Negocios Digitales, Universidad Tecnológica de Chihuahua, México
- **Correo:** elfora.dev@gmail.com *(evaluar usar el institucional)*
- **ORCID:** pendiente — crear en orcid.org (gratis, ~5 min). La plantilla lo pide obligatorio.
- **Eje temático:** Inteligencia Artificial — Redefiniendo el Rol del Ingeniero
- **Modalidad:** por definir (presencial / virtual)

## Título

**ES:** Memoria operativa versionada para asistentes de inteligencia artificial: arquitectura y caso de estudio longitudinal en trabajo de ingeniería multiproyecto

**EN:** Version-Controlled Operational Memory for AI Assistants: Architecture and a Longitudinal Case Study in Multi-Project Engineering Work

## Resumen

El objetivo es reducir el costo de re-contextualización que enfrenta un ingeniero cuando delega trabajo a asistentes de inteligencia artificial: cada sesión inicia sin memoria del proyecto, lo que obliga a reconstruirlo manualmente y genera decisiones inconsistentes entre dominios. Se siguió investigación-acción mediante un caso de estudio longitudinal instrumentado de 113 días, entre mayo y septiembre de 2026, donde se diseñó e implementó una memoria externa formada por archivos de texto plano con metadatos tipados, reglas declarativas de enrutamiento, enlaces bidireccionales obligatorios, marcadores de recencia y niveles de confianza por afirmación, expuesta a los agentes mediante el Model Context Protocol; la instrumentación se obtuvo del sistema de control de versiones y de una bitácora de operaciones escrita por los propios agentes. El sistema alcanzó 318 notas y 3,896 enlaces internos, equivalentes a 12.3 enlaces por nota, con 313 notas conformes al contrato de escritura legible por máquina, 1,210 operaciones de agente registradas en 88 días y 227 versiones confirmadas, cubriendo simultáneamente formación universitaria, proyectos propios y trabajo remunerado. Las limitaciones son un solo participante, la ausencia de grupo de control y el uso de métricas de proceso y no de resultado, por lo que la reducción de esfuerzo percibida es autorreportada; la implicación principal es tratar la memoria del asistente como infraestructura versionada y auditable, y no como historial conversacional. El valor original está en el contrato de escritura propuesto, que convierte notas personales en contexto recuperable y verificable por una máquina sin sacrificar su utilidad para el autor, y en su reproducibilidad con herramientas libres. Se concluye que una memoria externa tipada y versionada es una capa viable y de bajo costo para el trabajo de ingeniería asistido por inteligencia artificial, y se plantea como trabajo futuro su evaluación multiparticipante con métricas de resultado.

**Palabras clave:** memoria persistente; agentes de inteligencia artificial; gestión del conocimiento personal; Model Context Protocol; ingeniería asistida por IA.

## Abstract

The objective of this research is to reduce the re-contextualization cost an engineer incurs when delegating work to artificial intelligence assistants: every session starts without memory of the project, forcing manual context reconstruction and producing inconsistent decisions across work domains. An action-research strategy was followed through a 113-day instrumented longitudinal case study, from May to September 2026, in which an external memory was designed and implemented as plain-text files with typed metadata, declarative routing rules, mandatory bidirectional links, recency markers and per-claim confidence levels, exposed to agents through the Model Context Protocol; instrumentation was drawn from the version control system and from an operations log written by the agents themselves. The system reached 318 notes and 3,896 internal links, equivalent to 12.3 links per note, with 313 notes compliant with the machine-readable writing contract, 1,210 agent operations logged over 88 days and 227 committed versions, simultaneously covering university coursework, personal ventures and paid employment. Limitations are a single participant, the absence of a control group and the use of process rather than outcome metrics, so the perceived effort reduction is self-reported; the main implication is to treat assistant memory as versioned, auditable infrastructure rather than conversational history. The original value lies in the proposed writing contract, which turns personal notes into context that a machine can retrieve and verify without sacrificing their usefulness to the author, and in its reproducibility with free tools. We conclude that a typed, version-controlled external memory is a viable, low-cost layer for AI-assisted engineering work, and propose multi-participant evaluation with outcome metrics as future work.

**Keywords:** persistent memory; artificial intelligence agents; personal knowledge management; Model Context Protocol; AI-assisted engineering.

## Evidencia (medida del vault el 2026-09-18)

| Métrica | Valor |
|---|---|
| Notas markdown | 318 |
| Enlaces internos | 3,896 (12.3 por nota) |
| Notas con contrato AI-first | 313 de 318 |
| Operaciones de agente registradas | 1,210 en 88 días de bitácora |
| Versiones confirmadas (commits) | 227 |
| Periodo continuo de operación | 2026-05-29 → 2026-09-18 (113 días) |
| Dominios cubiertos | escuela (27 notas), proyectos (57), empresas (26), personas (35) |

## Pendientes antes de enviar

- [ ] Crear ORCID
- [ ] Decidir correo (institucional vs personal) y modalidad
- [ ] Vaciar este texto a la plantilla Word oficial (dos columnas, encabezado del congreso)
- [ ] Agregar sección de Referencias (la plantilla la exige): literatura de PKM, memoria de agentes/context engineering, MCP
- [ ] Recalcular métricas el día del envío
- [ ] Registrar en el Google Form antes del 8-oct-2026

Relacionado: [[_moc-escuela]] · [[utch]] · [[Fora]] · [[justenvs]]
