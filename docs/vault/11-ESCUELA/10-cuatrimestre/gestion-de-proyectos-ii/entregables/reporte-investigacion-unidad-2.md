---
type: entregable
materia: gestion-de-proyectos-ii
cuatrimestre: 10
unidad: 2
status: borrador
equipo: "Equipo 5"
date: 2026-10-19
last-updated: 2026-10-19
entrega: "en físico, escrito a mano"
drive: "https://drive.google.com/file/d/1ohWXk-LvpPrbudY7rtpaZFJpAbwmX79x/view"
tags: [escuela, entregable, utch, gestion-de-proyectos, gestion-hibrida, riesgos]
ai-first: true
---

## For future Claude

Reporte de investigación de la **Unidad II de [[11-ESCUELA/10-cuatrimestre/gestion-de-proyectos-ii/_moc-gestion-de-proyectos-ii|Gestión de Proyectos II]]** con [[evelyn-hinojos]]: implementación del modelo de gestión híbrido (15%, coevaluación con lista de cotejo de 10 criterios, 15 puntos). **Es en equipo** (Equipo 5: [[Fora]], [[celeste]], [[angel-cervantes]]) y **se entrega en físico, escrito a mano**; por eso esta es la versión resumida (2026-10-19), que reemplaza a una primera de ~1,670 palabras. El PDF con portada vive en Drive solo como respaldo; no se sube a Moodle. Los ejemplos usan [[11-ESCUELA/10-cuatrimestre/proyecto-integrador|SIMA]] ya con el pivote a negocios comerciales; los roles del ejemplo son genéricos, no el reparto real del equipo. Cada sección mapea a un criterio de la lista de cotejo (tabla al final). Fuentes verificadas el 2026-10-19 (Crossref, OpenAlex, scrumguides.org, catálogo de biblioteca para el PMBOK).

# Reporte de investigación: implementación del modelo de gestión híbrido

## 1. Introducción

El modelo de gestión híbrido combina la planeación del enfoque tradicional con los ciclos cortos del enfoque ágil. Este reporte explica cómo se aplica en cada etapa de un proyecto y lo ejemplifica con SIMA, un sistema que usa las cámaras de un negocio para medir el aforo de clientes.

## 2. Objetivo

Explicar cómo se implementa el modelo de gestión híbrido en la planeación, los riesgos, la puesta en marcha y el cierre de un proyecto, con ejemplos aplicados.

## 3. Desarrollo

### 3.1 Modelo de gestión híbrido

Es la combinación, dentro de un mismo proyecto, del enfoque predictivo (tradicional) con el adaptativo (ágil). El *PMBOK Guide* reconoce los tres enfoques y pide elegir el que mejor se ajuste al proyecto (Project Management Institute [PMI], 2021). Sus características son:

- Alcance, presupuesto e hitos se fijan al inicio, como en el enfoque tradicional.
- El trabajo se ejecuta en iteraciones cortas (*sprints*) con entregas y revisión del cliente, como en Scrum (Schwaber y Sutherland, 2020).
- Lo que no puede cambiar se controla con plan; lo que sí puede cambiar se ajusta en cada iteración.

Gemino et al. (2021) estudiaron 477 proyectos: el 52% era híbrido, y estos lograron el mismo éxito que los ágiles y mayor satisfacción de los interesados que los tradicionales.

### 3.2 Planeación

Tiene dos niveles. El tradicional define objetivo, alcance, cronograma de hitos y recursos. El ágil planea cada *sprint* eligiendo tareas de una lista priorizada de requerimientos (*backlog*).

**Ejemplo:** objetivo de SIMA: medir el aforo por zona y horario en 12 semanas con las cámaras que el negocio ya tiene. Fuera de alcance: instalar cámaras. Tres hitos (prototipo, tablero, entrega final), cada uno con dos *sprints* de dos semanas.

### 3.3 Organización

Se combina un líder de proyecto (plan, presupuesto y cliente) con los roles de Scrum: el dueño del producto prioriza el *backlog* y el equipo de desarrollo se organiza para construirlo (Schwaber y Sutherland, 2020). El equipo se comunica en reuniones diarias cortas; al cliente se le informa en cada hito.

**Ejemplo de organización del equipo:**

| Rol | Responsabilidad |
|---|---|
| Líder y dueño del producto | Plan, prioridades y trato con el cliente |
| Visión computacional | Detección y conteo de personas |
| Tablero y aplicación | Indicadores y aplicación web |

### 3.4 Identificación de riesgos

Un riesgo es un evento incierto que afecta un objetivo del proyecto (PMI, 2021). Se registran en la planeación y se revisan al final de cada *sprint*.

| Riesgo | Causa | Consecuencia |
|---|---|---|
| Conteo impreciso | Mala luz o mal ángulo de cámara | Datos poco confiables |
| Retraso | Carga escolar y de trabajo | Se recorta alcance |
| Rechazo por privacidad | Video con personas identificables | El negocio no autoriza |

### 3.5 Control y respuesta ante riesgos

Las estrategias son evitar, mitigar, transferir o aceptar (PMI, 2021). Cada riesgo tiene un responsable y se revisa en cada *sprint*.

- **Conteo impreciso:** mitigar; probar con video real desde el primer *sprint*.
- **Retraso:** mitigar; hacer primero lo esencial del *backlog*.
- **Privacidad:** evitar; guardar solo conteos, nunca imágenes.

### 3.6 Puesta en marcha

Inicia con el acta de constitución y la reunión de arranque. Luego cada *sprint* sigue cuatro pasos: planear y asignar tareas, coordinarse en la reunión diaria, revisar lo construido con el cliente y hacer una retrospectiva (Schwaber y Sutherland, 2020). En SIMA las tareas se siguen en un tablero Kanban.

### 3.7 Seguimiento y adaptación

Se compara el avance contra los hitos y el presupuesto, y dentro del *sprint* se usa el tablero Kanban y la gráfica de trabajo pendiente (*burndown*). Los cambios de funciones entran al *backlog*; los que afectan alcance, costo o fechas requieren aprobación del líder y del cliente.

### 3.8 Conclusión y cierre

Incluye entregar el producto con aceptación del cliente, comparar resultados contra lo planeado, documentar el proyecto y registrar las lecciones aprendidas de las retrospectivas. En SIMA: tablero funcionando en el negocio, reporte de precisión lograda y lecciones para la siguiente versión.

## 4. Conclusiones

El modelo híbrido da certeza sobre costo, alcance y fechas sin perder la capacidad de corregir el rumbo cada dos semanas. En SIMA permite controlar con plan lo fijo (hitos, presupuesto, privacidad) y ajustar por iteración lo demás. Revisar los riesgos en cada *sprint* hace que los problemas aparezcan cuando todavía hay margen para resolverlos.

## Referencias

Gemino, A., Horner Reich, B. y Serrador, P. M. (2021). Agile, traditional, and hybrid approaches to project success: Is hybrid a poor second choice? *Project Management Journal, 52*(2), 161–175. https://doi.org/10.1177/8756972820973082

Project Management Institute. (2021). *A guide to the project management body of knowledge (PMBOK guide)* (7.a ed.). Project Management Institute.

Schwaber, K. y Sutherland, J. (2020). *La guía de Scrum*. https://scrumguides.org/scrum-guide.html

---

## Mapa contra la lista de cotejo (no se copia a mano)

| # | Criterio | Pts | Sección |
|---|---|---|---|
| 1 | Descripción del modelo híbrido | 2.0 | 3.1 |
| 2 | Planeación + ejemplo | 2.0 | 3.2 |
| 3 | Organización + ejemplo de equipo | 2.0 | 3.3 |
| 4 | Identificación de riesgos | 1.5 | 3.4 |
| 5 | Control y respuesta ante riesgos | 1.5 | 3.5 |
| 6 | Puesta en marcha | 1.5 | 3.6 |
| 7 | Seguimiento y adaptación | 1.0 | 3.7 |
| 8 | Conclusión y cierre | 1.5 | 3.8 |
| 9 | Fuentes y estructura | 1.0 | Referencias + citas en texto |
| 10 | Ortografía y redacción | 1.0 | Todo |

## Fuentes verificadas (2026-10-19)

| Referencia | Verificación | Sostiene |
|---|---|---|
| Gemino et al. (2021) | Crossref + abstract en OpenAlex | 477 proyectos, 52% híbridos, híbrido ≈ ágil en éxito |
| PMI (2021), PMBOK 7 | Catálogo de biblioteca, ISBN 9781628256642 | Enfoques predictivo/adaptativo/híbrido, riesgos y estrategias de respuesta |
| Schwaber y Sutherland (2020) | scrumguides.org (versión noviembre 2020) | Roles, *sprints*, eventos de Scrum |

Kuhrmann et al. (2019), *IEEE Software* 36(4), doi 10.1109/MS.2018.110161245, estaba en la versión larga y se quitó al resumir.

Relacionado: [[11-ESCUELA/10-cuatrimestre/gestion-de-proyectos-ii/_moc-gestion-de-proyectos-ii|Gestión de Proyectos II]] · [[evelyn-hinojos]] · [[11-ESCUELA/10-cuatrimestre/proyecto-integrador|Proyecto integrador]] · [[celeste]] · [[angel-cervantes]]
