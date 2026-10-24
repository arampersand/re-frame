---
type: knowledge
status: activo
date: 2026-09-21
last-updated: 2026-09-29
tags: [escuela, utch, cifin-2026, congreso, ia, second-brain, agentes, narrativa]
ai-first: true
confidence: medium
---

## For future Claude

Enfoque conceptual acordado para la ponencia de [[Fora]] en el CIFIN 2026 (ver [[cifin-2026-convocatoria]]). Sustituye el marco del borrador [[resumen-v1]], que era demasiado "sistema de notas personal". La idea central: un modelo de madurez de memoria operativa (N0→N5) con dos casos de estudio, el vault de Fora (digital) y la automatización del [[living-lab]] por [[magio-bustillos]] con agentes Hermes (ciberfísica). **Pendiente as of 2026-09-21:** confirmar coautoría con Magio y verificar qué datos duros existen del caso B. Nada del caso B está aún documentado en este vault.

# CIFIN 2026 — enfoque narrativo

## El error a evitar

Si la ponencia se lee como "cómo organizo mis notas", está muerta. El público asocia sistemas de notas con productividad personal, la categoría más devaluada que hay: todos lo intentaron, todos lo abandonaron. El trabajo tiene que abrir con un problema de ingeniería, no con una herramienta.

## El problema que sí duele

Documentar siempre fue un impuesto: cuesta hoy, sirve en seis meses, y quien lo paga rara vez lo cobra. El incentivo está roto, y por eso nadie documenta — no es flojera.

Lo que cambió con los agentes es que **el retorno de documentar se volvió inmediato**. Cada nota mejora al agente que te asiste esa misma tarde, y otra vez mañana, y en cada sesión siguiente. La documentación dejó de ser costo hundido y se volvió infraestructura productiva.

Ese es el gancho, y es transversal: médicos, abogados, ingenieros — todos odian documentar y todos escuchan cuando les explicas por qué ahora sí les conviene.

## La contribución: modelo de madurez de memoria operativa

| Nivel | Qué hace | Quién está ahí |
|---|---|---|
| **N0 — Notas** | Texto para humanos. Se pudre, nadie lo relee. | Casi todo el mundo |
| **N1 — Estructura** | Metadatos tipados, reglas de enrutamiento, enlaces obligatorios. Recuperable por máquina. | Los disciplinados |
| **N2 — Ingesta** | El conocimiento entra solo: juntas transcritas, correo, commits, sensores. No depende de fuerza de voluntad. | Fora |
| **N3 — Contexto** | El agente lee esa memoria y decide con ella. Se acaba el re-explicar. | Fora |
| **N4 — Actuación** | El agente escribe de vuelta y ejecuta hacia sistemas externos. Lazo cerrado. | Fora (digital), Living Lab (físico) |
| **N5 — Gobernanza** | Cada acción queda auditada y es reversible porque la memoria está versionada; hay política de qué se hace solo y qué requiere humano. | La frontera |

Por qué funciona: aporta **contribución conceptual** (el modelo, no puro anecdotario), deja que **cada profesión se ubique** en la tabla, y da la **narrativa de la ponencia** — arranca con algo que todos hacen (tomar notas) y termina con un minisplit apagándose solo.

## Los dos casos

- **Caso A — vault de Fora (dominio del conocimiento).** Niveles N1–N3, con métricas medidas el 2026-09-18: 318 notas, 3,896 enlaces (12.3 por nota), 313 conformes al contrato AI-first, 1,210 operaciones de agente en 88 días de bitácora, 227 commits, 113 días continuos, tres dominios en paralelo (escuela, proyectos, trabajo).
- **Caso B — Living Lab (dominio ciberfísico).** Niveles N4–N5. Agentes Hermes sobre un second brain del espacio: control de acceso ligado a pagos (revocación automática de chapa por impago), monitoreo y apagado de climatización ociosa, reportes de ocupación, corriendo sobre Raspberry Pis (ver [[raspi-living-lab]]). Autoría de [[magio-bustillos]]; cedió derechos de uso a Fora, pero se propone **coautoría** porque el caso es suyo y en un congreso cuesta cero y suma.

Datos por verificar del caso B antes de prometer resultados: volumen y periodo de eventos de acceso, número de revocaciones automáticas y su latencia, ciclos de climatización y horas de operación evitadas, kWh medidos o estimados, tiempo corriendo y número de intervenciones manuales. **Si hay kWh, ese número se roba el paper** y además abre el eje de Sustentabilidad como alternativa.

## Diferenciación (la pregunta que van a hacer en la sesión)

"¿Esto no es lo mismo que la memoria de ChatGPT?" — cuatro respuestas, y conviene que sean una sección explícita del artículo:

1. **Auditable.** La memoria vive en control de versiones. Cuando el agente revoca un acceso, hay un commit que dice con qué información y cuándo. La memoria de un asistente comercial es caja negra.
2. **Portable.** Texto plano. No depende del modelo ni de que el proveedor siga existiendo.
3. **Soberana.** Corre local. Para un hospital o un despacho no es preferencia, es requisito legal.
4. **Gobernada.** La escribe el agente, pero la política la pone el humano. Es memoria con reglas, no historial conversacional.

## Cierre alineado al eje

El eje es "Inteligencia Artificial: redefiniendo el rol del ingeniero". Conclusión natural: **el ingeniero deja de ejecutar y pasa a especificar y gobernar**. Ya no escribe cada comando; escribe las reglas, diseña la memoria y audita lo que el sistema hizo. El entregable de ese nuevo rol no es código, es la memoria operativa. Se cierra con el Living Lab: un espacio físico que se administra solo porque alguien se tomó la molestia de escribir bien cómo funciona.

## Limitaciones que se declaran de frente

Dos casos, sin grupo de control, métricas de proceso y no de resultado. El modelo de madurez es propuesta conceptual, sin validación con terceros. Declararlo antes que el revisor lo convierte en rigor, y el trabajo futuro se escribe solo: validar la escalera con profesionales de otros dominios.

## Decisiones 2026-09-29

- **Premisa pública:** "Si lo puedes escribir, una IA lo puede operar." Escalera persona → despacho → edificio. Diferenciador frente a la memoria de los chats: la del chat recuerda quién eres; la memoria operativa recuerda cómo trabajas, es del usuario, auditable, compartida entre agentes y opera (stated por Fora, redacción de Claude).
- **Abogados NO es caso de estudio:** Fora no lo ha construido (stated). Entra solo como implicación/transferibilidad en el resumen y como ejemplo hipotético en la plática. Casos reales: vault (A) y Living Lab (B).
- Consecuencia: el caso B pesa más. Sin datos de [[magio-bustillos]], el B baja a "aplicación en curso" y el resumen se sostiene con el A.
- **Caso B descrito por Fora (stated, 2026-09-29):** el sistema de [[magio-bustillos]] en el [[living-lab]] (1) controla el acceso: si alguien no paga, lo quita de la licencia y le revoca el acceso al establecimiento; (2) apaga aires y luces cuando ya no hay nadie; (3) tiene todo el contexto de la empresa, así que quienes manejan contenido y documentos, con sus agentes de IA, consultan tanto los datos de lo que ha pasado como los documentos para trabajar más rápido. Cubre memoria (N1–N3) y actuación física (N4). **Sin números todavía.**
- **Magio NO es coautor** (decisión de Fora, 2026-09-29): su caso va referenciado como comunicación personal (no hay repo público que citar). Autor único: Ángel Iván López Delgado.
- **El segundo cerebro es de la persona, no de la IA** (corrección de Fora): la IA lo comparte y lo usa. Nunca redactar "segundo cerebro para la IA".
- Inventario de otros trabajos con IA y métricas re-medidas: [[inventario-ia]].
- **Base de investigación:** repo obsidian-second-brain (Ghelbur) + patrón LLM Wiki (Karpathy). Caso A = todo lo que Fora hace con el second brain; caso B = Magio con el Living Lab. Referencias verificadas en [[base-investigacion]].

## Siguientes pasos

- [ ] Hablar con [[magio-bustillos]]: coautoría y qué datos del Living Lab existen
- [ ] Redactar resumen v2 sobre este marco (reemplaza [[resumen-v1]])
- [ ] Bajar a "descripción de arquitectura" cualquier parte del caso B que no se sostenga con números
- [ ] ORCID de Fora (en proceso) y decidir modalidad
- [ ] Enviar por el Google Form antes del 8-oct-2026

Relacionado: [[cifin-2026-convocatoria]] · [[resumen-v1]] · [[living-lab]] · [[magio-bustillos]] · [[raspi-living-lab]] · [[_moc-escuela]] · [[utch]] · [[Fora]]
