# Roadmap por etapas

Cuatro etapas. Cada una termina con algo que se puede enseñar. Los issues de
GitHub están etiquetados con su etapa (milestone).

## E0 · Arranque (hoy, primeras 2 horas)
Meta: los 5 corren la app en su máquina y cada uno sabe su área.
- Todos: `make setup`, `make backend`, `make desktop`. Ver la pantalla Hoy.
- Integrador: repo, llaves compartidas, Google OAuth de la cuenta de demo.
- Branding: nombre, logo y paleta inicial en `theme/tokens.css`.

## E1 · Corte vertical real (día 1)
Meta: **clase grabada → transcripción → "no entendí" → explicación con LLM →
quiz → tema actualizado → bloque en Google Calendar con recibo verificado.**
Todo real, feo está bien.
- Grabación por segmentos de 15 s en Electron + transcripción bilingüe.
- Explicador con LLM respetando el contrato, Mermaid renderizado.
- Quiz que mueve el estado del tema.
- Google Calendar de punta a punta con verificación.
- Guardia de integridad con plan guiado.
- Semestre de demo completo y clip de clase grabado.

## E2 · Lo que lo hace ganar (día 2)
Meta: que se sienta producto, no prototipo.
- Importar iCal de Blackboard y syllabus en PDF (onboarding sin contraseñas).
- Detectar automáticamente de qué tema habla cada segmento.
- Huecos libres reales desde Google Calendar en la pantalla Hoy.
- Toggle español / inglés en toda la interfaz y en las explicaciones.
- Mapa de temas con prerequisitos ("para entender AVL primero BST").
- Onboarding de 5 preguntas.

## E3 · Demo (día 3)
Meta: ganar la sala.
- 09:00 pulido visual con el branding final.
- 12:00 **freeze** de `main`.
- Video de respaldo de la demo completa.
- Deck, guion, 5 ensayos cronometrados.

## Funciones que estaría chido tener
Ordenadas por impacto en la demo contra esfuerzo. Lo de arriba primero.

| Función | Por qué suma | Esfuerzo |
|---|---|---|
| Resaltar en vivo la frase "difícil" (el LLM detecta jerga nueva y la subraya) | Momento visual fuerte en la clase en vivo | Medio |
| Explicación por voz con TTS | Accesibilidad; útil manejando o en el bus | Bajo |
| Repaso espaciado: el sistema re-agenda temas dominados a los 3 y 7 días | Ciencia del aprendizaje real; jueces de Education lo valoran | Bajo |
| Flashcards automáticas desde la transcripción | Material de estudio sin esfuerzo | Bajo |
| Resumen de clase en 5 viñetas al terminar de grabar | Valor inmediato, fácil de demostrar | Bajo |
| Modo examen: plan día por día hacia una fecha | Responde "qué estudio después" a escala semanal | Medio |
| Pomodoro integrado en el bloque agendado | Lo pidió el equipo; cierra el ciclo plan → foco | Bajo |
| Bloqueo de distracciones durante el bloque (Electron puede hacerlo a nivel app) | Muy visual; ahora sí es posible por ser escritorio | Medio |
| Conector Gmail: correo al profe para pedir asesoría, con permiso | Segunda acción con recibo | Medio |
| Grupos de estudio con leaderboard de temas dominados | Retención y loop social | Alto |
| Recomendador de oportunidades (becas, internships) según la meta | Lo pidió el equipo; fuera del core | Alto |
| Second brain: notas propias ligadas a cada tema | Visión de producto a largo plazo | Alto |

## Fuera de alcance del hackathon
Hacer tareas, entrar al LMS con contraseña, fine-tuning, app móvil, multiusuario real.
