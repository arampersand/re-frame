---
type: knowledge
status: borrador
date: 2026-09-29
last-updated: 2026-09-29
tags: [escuela, cifin-2026, congreso, ia, resumen, second-brain]
ai-first: true
confidence: medium
---

## For future Claude

Resumen para el CIFIN 2026 sobre el enfoque de memoria operativa ([[enfoque-narrativo]], [[base-investigacion]]). Sustituye a [[resumen-v1]]. **Superado por [[resumen-v3]] (2026-10-02).** En Drive se llama "Una inteligencia artificial con acceso a tu segundo cerebro — Resumen CIFIN 2026 (borrador)" (renombrado 2026-09-29); ahí es donde Fora lo revisa y edita, así que **si hay diferencias, la versión de Drive manda**. Métricas del caso A medidas el 2026-09-29. El caso B (Living Lab) va descrito por capacidades, sin cifras, por decisión de Fora (2026-09-29: "está probado y jala"; no poner tiempos ni datos tan específicos). Hueco que queda: correo de correspondencia. Español: 297/300 palabras.

# CIFIN 2026 — Resumen (enfoque memoria operativa)

- **Google Doc para revisar:** https://docs.google.com/document/d/1qkfSObnVfqnqkvEADeurDyft65Skw-XgEJyCzgSRsD8/edit (carpeta UTCH de Drive), hecho sobre la plantilla oficial del resumen.
- **Eje:** Inteligencia Artificial — Redefiniendo el Rol del Ingeniero.

## Títulos

- **ES:** Una inteligencia artificial con acceso a tu segundo cerebro: memoria operativa para recordar, decidir y actuar
- **EN:** An Artificial Intelligence with Access to Your Second Brain: Operational Memory to Remember, Decide and Act

## Autores

Ángel Iván López Delgado (a, *) — autor único
a Entornos Virtuales y Negocios Digitales, UTCH, México
*Correspondencia: elfora.dev@gmail.com [¿institucional?] · ORCID: https://orcid.org/0009-0009-0967-4830 (verificado en el registro público 2026-09-29)

Sin superíndices de afiliación (autor único; Fora pidió quitarlos).

Magio **no es coautor** (decisión de Fora, 2026-09-29): su caso se referencia como comunicación personal. Ya había cedido derechos de uso del caso ([[enfoque-narrativo]]). En el artículo completo, agregar agradecimiento.

## Resumen

Los agentes de inteligencia artificial ya razonan con solvencia, pero trabajan sin contexto: desconocen los proyectos, reglas y decisiones previas de quien los usa, y la memoria de los asistentes comerciales es cerrada, poco auditable y dependiente del proveedor. Este trabajo propone y evalúa la memoria operativa, un segundo cerebro propio al que los agentes tienen acceso: documentos de texto estructurados y versionados que los agentes consultan para decidir y actualizan al actuar. Sobre el patrón de wiki persistente mantenido por modelos de lenguaje y una implementación de código abierto, la memoria se organizó en capas semántica, episódica y procedimental. Se estudiaron dos casos, medidos con control de versiones y bitácoras de los agentes: el trabajo de un ingeniero con múltiples proyectos durante cuatro meses y la administración automatizada de un espacio de innovación en Chihuahua. En el primero, la memoria alcanzó 341 documentos, 4,106 enlaces internos y 244 versiones registradas, además de 19 reglas derivadas de correcciones del usuario que el agente aplica sin reentrenamiento. En el segundo, los agentes revocan automáticamente el acceso por impago, apagan climatización e iluminación en espacios vacíos y dan al personal el contexto operativo y documental de la empresa. Con ambos se propone un modelo de madurez de seis niveles, de la nota personal a la actuación gobernada sobre sistemas físicos. Como limitaciones: dos casos, sin grupo de control y con métricas de proceso; la implicación es tratar esta memoria como infraestructura propia y auditable, transferible a dominios con alta carga documental como los despachos jurídicos. El aporte original es el modelo y mostrar una misma arquitectura en trabajo de conocimiento y en un entorno ciberfísico. Se concluye que el nuevo rol del ingeniero no es operar la inteligencia artificial, sino diseñar y gobernar la memoria con la que trabaja.

**Palabras clave:** memoria de agentes; gestión del conocimiento; arquitecturas cognitivas; control de versiones; sistemas ciberfísicos.

## Abstract

Artificial intelligence agents now reason competently, yet they work without context: they do not know their users' projects, rules or past decisions, and the memory built into commercial assistants is closed, hard to audit and tied to a single vendor. This study proposes and evaluates operational memory, a second brain of one's own that agents can access: structured, version-controlled text documents that agents read to make decisions and update as they act. Building on the pattern of a persistent wiki maintained by language models and on an open-source implementation, memory was organized into semantic, episodic and procedural layers. Two cases were studied using version-control data and logs written by the agents: an engineer running multiple projects over four months, and the automated management of an innovation space in Chihuahua, Mexico. In the first, the memory reached 341 documents, 4,106 internal links and 244 committed versions, plus 19 rules derived from user corrections that the agent applies without retraining. In the second, agents autonomously revoke access for non-payment, switch off climate control and lighting in empty spaces, and give staff the company's operational and documentary context. Drawing on both cases, we propose a six-level maturity model that runs from personal notes to governed action on physical systems. Limitations include the number of cases, the absence of a control group and the use of process metrics; the implication is to treat agent memory as owned, auditable infrastructure that transfers to document-intensive fields such as law firms. The original contribution is the maturity model and the documentation of a single architecture in both knowledge work and a cyber-physical environment. We conclude that the engineer's new role is not to operate artificial intelligence but to design and govern the memory it works with.

**Keywords:** agent memory; knowledge management; cognitive architectures; version control; cyber-physical systems.

## Referencias (formato del congreso, verificadas 2026-09-29)

- Bustillos, A. "Sistema de agentes para la administración del Living Lab CUU (control de acceso, climatización, iluminación y contexto de la empresa)," comunicación personal, Chihuahua, México, septiembre de 2026. *(No hay repo ni publicación pública del sistema; revisado en GitHub `magiobus` el 2026-09-29.)*
- Ghelbur, E. "obsidian-second-brain (versión 0.8.0)," *GitHub* (software de código abierto, licencia MIT), 2026. Dirección de internet: https://github.com/eugeniughelbur/obsidian-second-brain
- Karpathy, A. "LLM Wiki," *GitHub Gist*, 4 de abril de 2026. Dirección de internet: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
- Sumers, T. R., S. Yao, K. Narasimhan y T. L. Griffiths. "Cognitive architectures for language agents," *arXiv*, arXiv:2309.02427, 2023. https://doi.org/10.48550/arXiv.2309.02427

## Origen de cada cifra

| Cifra | Cómo se midió (2026-09-29) |
|---|---|
| 341 documentos | `git ls-files '*.md' \| wc -l` en el vault |
| 4,106 enlaces | conteo de `[[...]]` en esos archivos |
| 244 versiones | `git rev-list --count HEAD` (primer commit 2026-05-29) |
| 19 reglas | archivos `feedback_*.md` de la memoria de Claude Code |
| cuatro meses | 2026-05-29 → 2026-09-29 |

## Pendientes antes de enviar (8-oct)

- [x] Caso Living Lab descrito por capacidades (sin cifras, decisión de Fora)
- [x] Magio como referencia (comunicación personal), no coautor
- [ ] Opcional: que [[magio-bustillos]] confirme que la frase describe bien su sistema
- [x] ORCID: 0009-0009-0967-4830
- [ ] Decidir correo de correspondencia (Gmail o institucional)
- [ ] ¿Tutor de la UTCH? (la web lo permite)
- [ ] Re-medir cifras si se envía después de unos días
- [ ] Revisar campos del Google Form de registro

Relacionado: [[enfoque-narrativo]] · [[base-investigacion]] · [[inventario-ia]] · [[cifin-2026-convocatoria]] · [[resumen-v1]] · [[Fora]]
