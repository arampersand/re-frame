# Re-Frame — contexto para el equipo

> Nombre provisional. El nombre final lo decide branding (Vic).
> Pásale este archivo a tu Claude o ChatGPT al inicio de cada sesión.
> Recorrido del usuario y lógica del onboarding: `docs/USER-JOURNEY.md`.

## Equipo
| Quién | GitHub | Rol |
|---|---|---|
| Ary | arampersand | Integrador, explicador, motor de onboarding |
| Magio | magiobus | Audio, estado por tema, frontend |
| Bart | yosoybartsolo | Acciones (Google Calendar) y pitch |
| Leo | leo12L | Datos de demo, preguntas del onboarding, pruebas de usuario |
| Vic | pendiente | Branding, landing y diseño del deck |

## El hackathon
- **Dónde:** UTEP, El Paso, Texas. 3 días.
- **Track 1: Higher Education — Personalized Education for Every Student.**
- **Reto literal:** *"Build something that helps a student understand what they
  know, identify what they are struggling with, and decide what they should
  study next."*

## El problema
En la universidad la clase va al ritmo del profesor, no del estudiante. Quien
no entendió algo a las 10:45 no lo sabe con claridad hasta que reprueba el
parcial. En El Paso esto pega más fuerte:
- Muchos estudiantes son primera generación y trabajan mientras estudian: no
  tienen horas extra para releer el capítulo completo.
- Muchos piensan en español y estudian en inglés: la clase mezcla idiomas.
- Las herramientas de IA que ya usan **contestan** preguntas, pero no saben qué
  vieron en clase, qué entendieron, ni cuándo vence su examen. Y la tentación
  es pedirles que hagan la tarea.

## La solución en una frase
**Re-Frame escucha tu clase, sabe qué entendiste y qué no, te lo reexplica de
cuatro formas y aparta en tu calendario el tiempo para repasarlo antes de tu
examen. Explica, nunca hace la tarea.**

## Cómo cubre los tres pilares del track
| Pilar | En Re-Frame |
|---|---|
| Understand what they know | Transcripción de cada clase + quiz de 3 después de cada explicación → estado por tema (dominado, en progreso, laguna, sin ver). |
| Identify what they struggle with | Cada frase que tocas como "no entendí" y cada pregunta fallada baja el tema. El mapa de temas lo muestra en rojo. |
| Decide what to study next | Pantalla **Hoy**: el tema más débil de la entrega más cercana, en un hueco libre de tu calendario. Apruebas y queda en Google Calendar con recibo. |

## Por qué no es "otro chatbot"
Lo dijo el equipo: *"nuestro second brain no es un bot; sabe y hace"*.
1. **Sabe:** tiene tus clases, tus temas, tus fechas. No le explicas nada.
2. **Hace:** propone, pides permiso con un clic, ejecuta en Google Calendar.
3. **Comprueba:** cada acción deja un recibo. Sin recibo, no pasó.
4. **Tiene límites:** si le pides "hazme la tarea", se niega y te arma un plan
   guiado. Esto es una feature visible en la demo, no una letra chica.

## Decisiones cerradas (no reabrir sin razón nueva)
1. **Track 1, universitario.** Nada de K-12 ni educación especial infantil.
2. **App de escritorio con Electron.** Para capturar audio de clase con
   confianza. Stack: Electron + React + TypeScript + Tailwind, backend FastAPI.
3. **Default alive.** La demo arranca con un semestre ya vivido: 4 materias,
   clases transcritas, temas con estado, entregas próximas. Nunca enseñamos una
   app vacía que "algún día" será buena.
4. **Explica, no hace la tarea.** Regla determinista en código.
5. **Una acción, bien hecha:** agendar repaso en Google Calendar con permiso y
   recibo verificado. Gmail y otros conectores son stretch.
6. **Sin contraseñas del LMS.** UTEP usa Blackboard. Importamos el link iCal y
   el syllabus en PDF. En el pitch: *"nunca pedimos tu contraseña"*.
7. **"Múltiples representaciones", no "estilos de aprendizaje".** La teoría de
   estilos (visual, auditivo) está desacreditada en pedagogía; un juez de
   Education lo sabe. Siempre damos las 4 representaciones; la preferencia del
   estudiante solo decide cuál ve primero.
8. **Nada de fine-tuning.** El perfil y el historial van como contexto.

## Lo que descartamos y por qué
| Idea | Por qué no |
|---|---|
| Teachers Bridge (certificar maestros bilingües) | Sólida pero "no suena tan sexy" para jueces; además El Paso hoy despide maestros generales. |
| Second brain de vida adulta, finanzas, fiscal | Se sale del track: cae en Finance, no en Education. |
| Pomodoro + bloqueo de redes + leaderboard | No prueba que el sistema "sabe y hace". Queda como stretch. |
| Comunicación para no verbales, hardware | Track universitario y sin tiempo para hardware. |
| Recomendador de trabajos | Fuera del pilar "qué estudiar después". Stretch. |

## Usuaria de la demo
**Sofía Ramírez**, 3er semestre de Ingeniería en Sistemas Computacionales.
Primera generación, trabaja medio tiempo, piensa en español y su profe de
Estructuras de Datos mezcla inglés. Su parcial de árboles es en 4 días y las
rotaciones AVL no le quedaron. Materia héroe: **Estructuras de Datos**.

## Guion de la demo (90 segundos)
1. **Clase en vivo.** Suena un clip de clase de 2 minutos. La transcripción
   aparece por segmentos, con las frases en inglés marcadas.
2. **"No entendí".** Sofía toca *"el subárbol izquierdo del nodo que sube…"*.
   Aparece el diagrama de la rotación, la analogía, el ejemplo con números.
3. **Quiz de 3.** Falla una. Rotaciones AVL sigue en rojo en *Mis temas*.
4. **Hoy.** *"Tu examen de árboles es el martes y Rotaciones AVL está en 31 %.
   Te propongo 50 minutos el sábado a las 7 pm."* Clic en Agendar.
5. **Recibo.** Aparece en Google Calendar proyectado. Recibo verificado.
6. **El límite.** Escribe *"hazme la tarea 5"*. Re-Frame se niega y le da un
   plan guiado en 4 pasos con un bloque de 40 minutos.

**Plan B de cada paso:** clip ya transcrito en el seed; contenido de respaldo
si no hay LLM; recibo `skipped` honesto si no hay Google; video grabado.

## Pitch en tres frases
1. *"Los estudiantes de UTEP no reprueban por flojos; reprueban porque se
   enteran tarde de lo que no entendieron."*
2. *"Re-Frame escucha la clase, detecta la laguna el mismo día y aparta el
   tiempo para cerrarla antes del examen."*
3. *"Y nunca hace la tarea por ti: te enseña a hacerla."*

## Glosario
- **Default alive:** la app ya tiene vida cuando la abres; nunca demo vacía.
- **Recibo:** prueba del sistema destino de que una acción pasó.
- **Laguna:** tema con score < 45 %.
- **Contrato:** modelo de `backend/app/contracts.py`; lo que viaja entre backend y desktop.
