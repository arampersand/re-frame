# Recorrido del usuario y lógica de la plataforma

Este documento responde tres preguntas:
1. ¿Qué vive el estudiante desde que abre Re-Frame hasta que termina el semestre?
2. ¿Cómo entiende Re-Frame quién es sin hacerle un formulario de 40 campos?
3. ¿Qué decide la plataforma sola y qué decide el estudiante?

## El modelo mental: un ciclo, tres velocidades

Re-Frame repite el mismo ciclo a tres velocidades. Cada vuelta deja datos que
mejoran la siguiente.

| Velocidad | Ciclo | Qué aprende Re-Frame |
|---|---|---|
| Por clase | Grabar → "no entendí" → 4 formas → quiz | Qué temas son laguna, dónde se pierde |
| Por día | Hoy: propuesta → permiso → calendario → recibo | Qué horarios acepta y cuáles rechaza |
| Por semana | Domingo: qué se movió, qué está en riesgo, plan | Si el plan funciona o hay que cambiarlo |

Encima de las tres está el **perfil**: lo que Re-Frame cree del estudiante,
cada dato con su fuente y su confianza.

## Etapas del estudiante

### 0. Primera vez (3 a 4 minutos)
Meta: que en el primer uso ya vea su semana organizada. Nunca una app vacía.

1. **Importar sin escribir.** Pega el link iCal de Blackboard y arrastra los
   syllabus en PDF. Re-Frame saca materias, entregas, temas y prerequisitos.
   Nunca pide contraseña.
2. **Conversación de 8 preguntas** (elicitación, abajo).
3. **Medir en vez de preguntar.** Un quiz de 3 preguntas de la materia que más
   le preocupa. Así arranca el mapa con datos reales, no con autoevaluaciones.
4. **Reflexión:** "Esto entendí de ti". El estudiante corrige lo que esté mal.
5. **Primer Hoy:** su semana con los primeros bloques propuestos.

### 1. Antes de clase (2 minutos, opcional)
Si la clase de hoy usa un tema que está en laguna, Re-Frame lo avisa:
*"Hoy ven AVL y árboles de búsqueda sigue en 62 %. Repasa este resumen."*

### 2. En clase
Graba. Toca "no entendí" en la frase exacta. No interrumpe nada más.

### 3. Después de clase (5 minutos)
Resumen de 5 viñetas, explicación de las frases marcadas y quiz de 3. El mapa
se mueve.

### 4. Hoy
El tema más débil de la entrega más cercana, en la ventana de estudio del
perfil, con la duración que aguanta su horario de trabajo. Aprueba o rechaza.
Cada rechazo es un dato: tres rechazos seguidos a las 6 pm generan una pregunta.

### 5. Bloque de estudio
Al llegar la hora: explicación del tema, ejercicio guiado y quiz al final.
(Pomodoro y modo foco son stretch.)

### 6. Domingo
Resumen de la semana: qué temas subieron, qué entrega está en riesgo, y el
plan propuesto para la semana. Un clic para aprobarlo todo.

### 7. Modo examen
Cuando falta una semana: plan día por día que cubre los temas del examen
ordenados por debilidad y prerequisitos.

### 8. Fin de semestre
Reporte de qué dominó y qué quedó flojo. Lo flojo que es prerequisito de la
siguiente materia se queda en el mapa para el próximo semestre.

## Elicitación avanzada: cómo entiende quién eres

### El problema de los formularios
Un formulario pregunta "¿Eres visual o auditivo?" y "¿Qué tan bien vas en
Cálculo, del 1 al 5?". Ambas respuestas son poco confiables: la gente se
describe mal y sobreestima o subestima lo que sabe. Además aburre y la gente lo
abandona.

### Seis reglas
1. **No preguntes lo que puedes importar.** Materias, fechas y temas vienen del
   iCal y del syllabus.
2. **No preguntes lo que puedes medir.** Qué tan bien va se mide con un quiz.
   Qué explicación le sirve se mide con un contraste.
3. **Pregunta por conducta reciente, no por etiquetas.** *"Cuéntame la última
   vez que no entendiste algo en clase. ¿Qué hiciste?"* revela cómo busca ayuda
   mejor que *"¿cómo prefieres aprender?"*.
4. **Escalera de porqués.** La meta declarada casi nunca es la real.
   *"Pasar Estructuras con A"* → *"¿Y si no?"* → *"Pierdo la beca"*. Lo que está
   en juego cambia qué tan agresivo es el plan.
5. **Cada pregunta dice por qué la hace y se puede saltar.** Máximo 8.
6. **Refleja y deja corregir.** Al final, "esto entendí de ti" en frases
   simples. Lo que el estudiante corrige queda con confianza total.

### El perfil: cada dato sabe de dónde salió

```
slot: "representation"
value: "example"
source: measured     ← imported | stated | inferred | measured
confidence: 0.8
quote: "Con 1,000 datos: n² son un millón de pasos; log n son 10."
```

Prioridad cuando dos fuentes chocan: **medido > declarado > importado >
inferido**. Una corrección del estudiante en la reflexión gana siempre.

### Las 8 preguntas y qué alimentan

| # | Pregunta | Tipo | Slot | Qué decide en la app |
|---|---|---|---|---|
| 1 | Si el semestre sale como quieres, ¿qué es distinto en diciembre? | abierta | goal | El "por qué" de cada propuesta |
| 2 | ¿Y qué pasa si no lo logras? (redactada por el LLM a partir de la 1) | abierta | stake | Qué tan agresivo es el plan |
| 3 | ¿Cuántas horas a la semana trabajas? | opción | work_hours → block_minutes | Duración de los bloques |
| 4 | ¿A qué hora sí te entra lo que estudias? | opción | study_window | Cuándo propone bloques |
| 5 | La última vez que no entendiste algo, ¿qué hiciste? | abierta | help_style | Cómo y cuándo intervenir |
| 6 | Tres formas de explicar Big-O, ¿cuál te hizo click? | contraste | representation (medido) | Qué representación ve primero |
| 7 | ¿En qué idioma piensas cuando resuelves matemáticas? | opción | think_lang → explain_lang | Idioma de las explicaciones |
| 8 | ¿Qué materia te quita el sueño? | opción | worry_course | Qué materia se mide primero |

Las preguntas son adaptativas: si salta la 1, no aparece la 2. Las opciones de
la 8 salen de las materias importadas.

### Qué hace el LLM y qué no
- **Sí:** convertir una respuesta abierta en un valor corto con confianza y la
  frase que lo respalda; redactar la pregunta 2 con las palabras del
  estudiante.
- **No:** decidir qué preguntar, inferir datos sensibles, ni elegir el plan.
  Eso es determinista y tiene pruebas.
- **Sin LLM:** todo sigue funcionando. La respuesta abierta se guarda tal cual
  con confianza 0.5.

### Elicitación continua
El onboarding es solo la primera vuelta. El perfil se sigue ajustando con lo que
el estudiante hace:

| Señal | Inferencia | Qué pasa |
|---|---|---|
| Rechaza 3 bloques en la misma hora | Esa hora no le sirve | Pregunta de una línea: "¿6 pm no te funciona?" |
| Siempre abre primero la pestaña Ejemplo | Su representación real es otra | Ajusta `representation` como medido |
| Su autoevaluación alta, quiz bajo | Sobreconfianza en esa materia | Más quizzes cortos en esa materia |
| Marca "no entendí" en frases en inglés | La barrera es el idioma, no el tema | Explica en español aunque el tema esté en progreso |

Esta tabla es roadmap (E2 y stretch). Lo implementado hoy es el onboarding.

## Qué decide quién

| Decide Re-Frame | Decide el estudiante |
|---|---|
| Qué tema repasar y por qué | Si el bloque se agenda o no |
| En qué hueco del calendario | Corregir cualquier dato de su perfil |
| Qué representación mostrar primero | Saltar cualquier pregunta |
| Negarse a hacer trabajo evaluado | Rehacer el onboarding cuando quiera |

Nada se escribe en su calendario sin su clic. Todo lo escrito tiene recibo.

## Estado de implementación

| Pieza | Estado |
|---|---|
| Motor de onboarding de 8 preguntas, adaptativo, con fuentes y confianza | Hecho, `backend/app/features/onboarding.py`, con pruebas |
| Reflexión "esto entendí de ti" y correcciones | Hecho en backend |
| Perfil ajusta la ventana y la duración de los bloques en Hoy | Hecho |
| Perfil ajusta la representación y el idioma del Explicador | Hecho |
| Pantalla de onboarding en la app | Pendiente, issue de onboarding |
| Importar iCal y syllabus | Pendiente, endpoints en 501 |
| Quiz diagnóstico inicial | Pendiente |
| Elicitación continua, revisión del domingo, modo examen | Stretch |

## API del onboarding

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/onboarding` | Estado actual y siguiente pregunta |
| POST | `/api/onboarding/start` | Empieza de cero |
| POST | `/api/onboarding/answer` | `{question_id, option_id}` o `{question_id, text}` o `{question_id, skipped: true}` |
| POST | `/api/onboarding/confirm` | `{corrections: {slot: "texto"}}` y confirma el perfil |
