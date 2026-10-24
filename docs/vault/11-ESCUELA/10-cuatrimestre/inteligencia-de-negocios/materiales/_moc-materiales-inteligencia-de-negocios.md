---
type: materiales
status: activo
materia: inteligencia-de-negocios
date: 2026-09-02
last-updated: 2026-09-02
tags: [escuela, materiales, utch, business-intelligence, index]
ai-first: true
---

## For future Claude

Índice de los materiales de [[11-ESCUELA/10-cuatrimestre/inteligencia-de-negocios/_moc-inteligencia-de-negocios|Inteligencia de Negocios]] ([[yadhira-moreno]], [[utch]]). **Regla de esta carpeta: no se guardan binarios.** Cada material que entrega la profe se analiza y se documenta en un `.md` que conserva su contenido, y el archivo original se borra. Cada nota dice cómo se llama el archivo original, por si hay que rebajarlo del Moodle.

# Materiales — Inteligencia de Negocios

## Lote 1 — recibido 2026-09-02

| Nota | Archivo original | Qué es |
|---|---|---|
| [[11-ESCUELA/10-cuatrimestre/inteligencia-de-negocios/materiales/movilizacion-saberes-previos|movilizacion-saberes-previos]] | `Inteligencia de negocios_movilizacion_sabere_previos.pptx` | Sesión de arranque, 15 slides. Contiene **Actividad 1** (caso trajes de baño + lectura del IPC 2001-2021). |
| [[11-ESCUELA/10-cuatrimestre/inteligencia-de-negocios/materiales/fundamentos-de-bi|fundamentos-de-bi]] | `Fundamentos.pptx` | Marco conceptual, 9 slides. Definiciones de BI, BA, ciencia de datos y minería. Contiene **Actividad 2**. |
| [[11-ESCUELA/10-cuatrimestre/inteligencia-de-negocios/materiales/ebook-procesos-etl|ebook-procesos-etl]] | `EBOOK _ Procesos ETL.pdf` | Ebook de PowerData, 22 pp. Las tres fases de ETL, calidad del dato, ETL vs. E-LT, cultura data-driven. |
| [[11-ESCUELA/10-cuatrimestre/inteligencia-de-negocios/materiales/mysqlsampledatabase-classicmodels|mysqlsampledatabase-classicmodels]] | `mysqlsampledatabase.zip` | Base `classicmodels` de MySQL: 8 tablas, 2003-2005. Esquema completo y trampas documentadas. |
| [[11-ESCUELA/10-cuatrimestre/inteligencia-de-negocios/materiales/toys-analisis|toys-analisis]] | `toys.xlsx` | 7 hojas de consultas ya resueltas sobre classicmodels. **Trae un error de cálculo confirmado** — leer antes de usar. |
| [[11-ESCUELA/10-cuatrimestre/inteligencia-de-negocios/materiales/hogares-equipo|hogares-equipo]] | `Hogares_equipo.xlsx` | % de hogares con cada bien por entidad federativa. **Los 32 renglones están completos en la nota.** |

## Cómo encajan

```
CONCEPTO         movilizacion-saberes-previos → fundamentos-de-bi
                 (qué es BI, por qué importa, cómo se distingue de BA y data science)
        ↓
MOVIMIENTO       ebook-procesos-etl
                 (cómo llegan los datos del origen al data warehouse)
        ↓
PRÁCTICA         classicmodels (crudo, transaccional)  →  toys-analisis (salida esperada)
                 hogares-equipo (limpio, agregado, para visualizar)
```

Apunta al objetivo de la materia: **arquitectura BI**, no reportes sueltos.

## Pendientes de este lote

- La **secuencia didáctica** (instrumentos, porcentajes y fechas de evaluación) todavía no la tenemos. Es el documento que falta.
- `hogares-equipo` no trae fuente ni año — preguntar antes de citarlo.
- El error de cálculo de `toys.xlsx`: confirmar con la profe si es involuntario o parte del ejercicio.

Relacionado: [[11-ESCUELA/10-cuatrimestre/inteligencia-de-negocios/_moc-inteligencia-de-negocios|Inteligencia de Negocios]] · [[yadhira-moreno]] · [[utch]]
