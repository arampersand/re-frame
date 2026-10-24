---
type: index
status: activo
date: 2026-09-02
last-updated: 2026-09-04
tags: [escuela, index, utch]
ai-first: true
---

## For future Claude

Índice de la carpeta de escuela de [[Fora]]: la carrera **Entornos Virtuales y Negocios Digitales** en la [[utch|Universidad Tecnológica de Chihuahua]]. Un subfolder por cuatrimestre, dentro uno por materia. Cuatrimestre en curso as of 2026-09: el **décimo**, con 6 materias, todas listadas abajo con su profe. Regla dura de esta carpeta: **no se guardan archivos binarios** — cada material se analiza y se documenta en markdown.

# Escuela — UTCH

- **Alumno:** [[Fora]] (Ángel Iván López Delgado)
- **Institución:** [[utch|Universidad Tecnológica de Chihuahua]]
- **Carrera:** Entornos Virtuales y Negocios Digitales
- **Programa:** Programa educativo 2020 / Matutino / **Décimo Ingeniería**
- **Cuatrimestre actual:** 10º (as of 2026-09)

## 10º cuatrimestre — 6 materias

| Materia | Profe | Estado de la nota |
|---|---|---|
| [[11-ESCUELA/10-cuatrimestre/integradora/_moc-integradora|Integradora]] | [[addai-guerrero|Addai Guerrero Quiñones]] | stub — falta encuadre |
| [[11-ESCUELA/10-cuatrimestre/ingles-ix/_moc-ingles-ix|Inglés IX]] | [[jose-enrique-iglesias|José Enrique Iglesias García]] | objetivo, competencias y unidades |
| [[11-ESCUELA/10-cuatrimestre/programacion-aplicaciones-web-progresivas/_moc-programacion-aplicaciones-web-progresivas|Programación de Aplicaciones Web Progresivas]] | [[juan-carlos-bustamante|Juan Carlos Bustamante Lozano]] | stub — falta encuadre |
| [[11-ESCUELA/10-cuatrimestre/negociacion-empresarial/_moc-negociacion-empresarial|Negociación empresarial]] | [[karina-jimenez|Karina Edith Jiménez Lozano]] | stub — falta encuadre |
| [[11-ESCUELA/10-cuatrimestre/inteligencia-de-negocios/_moc-inteligencia-de-negocios|Inteligencia de Negocios]] | [[yadhira-moreno|Yadhira Alejandra Moreno Delgado]] | **la más completa** — objetivo, proyecto integrador y 6 materiales analizados |
| [[11-ESCUELA/10-cuatrimestre/gestion-de-proyectos-ii/_moc-gestion-de-proyectos-ii|Gestión de Proyectos II]] | [[evelyn-hinojos|Evelyn Paulina Hinojos Cepeda]] | temario completo + horas/faltas (2026-09-04) |

Fuente del listado: pantalla de cursos del Moodle UTCH (as of 2026-09-02). Confianza `stated`.

## El proyecto integrador es transversal

**Nota eje: [[11-ESCUELA/10-cuatrimestre/proyecto-integrador|proyecto-integrador]]** — ahí viven el cliente, el equipo, los entregables y qué aporta cada materia. Las 6 materias enlazan a esa nota; no se duplica el contexto.

No es un trabajo escrito: es un proyecto que **se construye y se documenta**. [[11-ESCUELA/10-cuatrimestre/integradora/_moc-integradora|Integradora]] lo articula y las demás materias le dan herramientas.

## Estructura de cada materia

```
<cuatrimestre>/<materia-slug>/
  _moc-<materia>.md   contexto: profe, temario, evaluación, bitácora de clases
  clases/         YYYY-MM-DD-<tema>.md — transcripts y notas de clase
  materiales/     una nota .md por material — NO se guardan los binarios
  entregables/    tareas, proyectos, exámenes
```

## Convenciones

- Clases: `clases/YYYY-MM-DD-<slug-del-tema>.md`, frontmatter `type: clase`.
- Materiales: **no se guardan archivos binarios en el vault**. Cada material que da el profe se analiza y se documenta en `materiales/<slug>.md`, con `archivo-original:` en el frontmatter para poder rebajarlo del Moodle. Los datasets chicos van completos dentro de la nota.
- Todo linkea a la nota de la materia y a la del profe en `07-PEOPLE/`.

## Relacionado

- [[utch]] — la institucion
- Profes y compañeros: [[yadhira-moreno]] · [[addai-guerrero]] · [[juan-carlos-bustamante]] · [[evelyn-hinojos]] · [[angel-cervantes]]
- [[01-YOU/identity|Fora]] — en entregables escolares va el nombre legal (Ángel Iván López Delgado), no "Fora Delgado"
- Memoria de Claude (fuera del vault): `project_hacking_etico_utch`

[[index]]
