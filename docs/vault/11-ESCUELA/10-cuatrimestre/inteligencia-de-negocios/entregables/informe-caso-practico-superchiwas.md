---
type: entregable
status: entregado
date: 2026-10-09
last-updated: 2026-10-09
tags: [escuela, utch, inteligencia-de-negocios, entregable, caso-practico]
ai-first: true
---

## For future Claude

Entregable de equipo (equipo de Integradora: [[Fora]], [[celeste]], [[angel-cervantes]]) para **Inteligencia de Negocios** con [[yadhira-moreno]]. Tarea Moodle "Informe de caso práctico" (assignid 1012, cmid 2815), cierra **2026-10-09 23:59**, 40% de la unidad I (heteroevaluación, rúbrica). Entrega individual en Moodle (teamsubmission 0): cada integrante sube el PDF. Generado el 2026-10-09; **Entregado en Moodle el 2026-10-09** (status `submitted`) por Fora; Celeste y Ángel suben el suyo.

# Informe de caso práctico — Super Chiwas

- **Consigna (Moodle):** informe de caso práctico con contexto de la organización, interpretación de indicadores organizacionales y de marketing, planteamiento de la problemática y componentes de la arquitectura BI.
- **Insumos:** carpeta "Actividad" del material de la unidad 1 (cmid 2803): `1. Material 1.pdf` (caso Super Chiwas: solicitud del CEO Sergius Tierras de detectar meses de menor venta, con desglose interactivo mes → día, y formato de análisis), `2. datos_superchiwas.csv` (11,342 registros diarios 2020, 17 sucursales), `3. Catalogo_sucursal.csv`, `4. transporte_JUL2018.csv` y `5. retail_analysis.xlsx` (estos dos no se usaron: no pertenecen al caso Super Chiwas).
- **PDF (Drive UTCH):** https://drive.google.com/file/d/1tSU0mYhvLsb7ATy4vG9-v9y1OpE5UZ3r/view

## Hallazgos clave

- Ventas 2020: $1,822.2 M; 207,000 clientes; 720,103 créditos; adeudo vigente 4.5% de ventas.
- Mes más bajo: abril ($37.7 M, −79% vs marzo; coincide con la emergencia sanitaria, DOF 31/03/2020). Abr–jun = 8.1% del año. Más alto: diciembre ($284.1 M, 15.6%). Enero es el más bajo de los meses normales.
- Sucursales casi idénticas (5.8–6.0% cada una); el adeudo varía de 3.9% (Arboledas) a 4.8% (Allende).
- Venta diaria estable dentro de cada mes; día de la semana sin efecto (<2%).
- Arquitectura propuesta: fuentes → ETL (Power Query) → modelo estrella (Hechos_Ventas + Dim_Fecha/Sucursal/EstatusAdeudo) → DAX → tablero Power BI con drill-down Año > Mes > Día.

## Estructura del PDF

Portada (3 integrantes, profesora, grupo IEVND101M) · 1 Introducción · 2 Objetivo · 3 Contexto · 4 Indicadores organizacionales · 5 Indicadores de marketing · 6 Problemática · 7 Arquitectura BI · 8 Recomendaciones · 9 Conclusiones · Referencias APA · Anexo con el formato de análisis de Super Chiwas. 12 páginas, 6 figuras.

Relacionado: [[11-ESCUELA/10-cuatrimestre/inteligencia-de-negocios/_moc-inteligencia-de-negocios|Inteligencia de Negocios]] · [[11-ESCUELA/10-cuatrimestre/proyecto-integrador|Proyecto integrador]]
