---
type: material
materia: inteligencia-de-negocios
formato: pdf
archivo-original: "EBOOK _ Procesos ETL.pdf"
autor: PowerData
date: 2026-09-02
last-updated: 2026-09-02
tags: [escuela, material, utch, business-intelligence, etl, elt, data-warehouse, lectura]
ai-first: true
---

## For future Claude

Resumen sustantivo del ebook de ETL que dio [[yadhira-moreno]] en [[11-ESCUELA/10-cuatrimestre/inteligencia-de-negocios/_moc-inteligencia-de-negocios|Inteligencia de Negocios]] (Moodle [[utch]], descargado 2026-09-02). El PDF no se guardó en el vault; esta nota conserva las listas y definiciones operativas — que es lo que se usa para un entregable — no el PDF. Es material de **editor de software** (PowerData), así que trae sesgo comercial: lo señalo donde aplica.

# Material — Ebook "Procesos ETL: la base de la inteligencia de negocio"

- **Archivo original:** `EBOOK _ Procesos ETL.pdf`
- **Autor:** PowerData (consultora española de gestión y gobierno de datos, powerdata.es) — 22 pp., 944 KB
- **Dónde estaba:** sección "Material" del curso 10M en Moodle → `~/Downloads/`
- **Estado local:** borrado. Recuperable del Moodle o del sitio de PowerData.

## Índice del ebook

Definición de proceso ETL (p.3) · Extracción, transformación y carga (p.4) · Procesamiento en herramientas ETL (p.7) · Evolución de los procesos ETL (p.8) · ¿Por qué se usan herramientas ETL? (p.9) · Desafíos (p.10) · Integración inteligente de datos y agilidad del negocio (p.12) · Características de herramientas ETL (p.14) · Evaluar herramientas ETL (p.16) · Desarrollo personalizado vs. herramienta ETL (p.17) · ¿ETL o ELT? (p.19)

## Qué es ETL

**E**xtract · **T**ransform · **L**oad. Es la parte de integración de datos de todo proyecto BI: mueve datos desde una o múltiples fuentes, los reformatea y limpia, los carga en otro lugar (base de datos, **data mart** o **data warehouse**), y desde ahí se analizan o se usan para alimentar otro sistema operacional.

Se usa en dos escenarios: incorporar aplicaciones nuevas, e **integrar sistemas heredados** (aplicaciones viejas del entorno de la empresa, p. ej. ERPs) — donde la dificultad típica es que la tecnología vieja complique la integración.

## Las tres fases (esto es lo examinable)

### 1. Extracción
Pasos: extraer de los sistemas de origen → analizar lo extraído (chequeo) → interpretar el chequeo para verificar que cumple la estructura esperada; **si no, los datos se rechazan** → convertir a un formato listo para transformar.

Cuidados:
- Los formatos y la organización de los datos difieren en cada sistema origen, porque casi todo proyecto de almacenamiento **fusiona fuentes distintas**.
- Las fuentes suelen ser bases relacionales o ficheros planos, pero también no relacionales u otras estructuras.
- **La regla de oro:** exigir siempre que la extracción cause **impacto mínimo en el sistema origen**. Si son muchos datos, el origen se puede ralentizar o colapsar. Por eso en sistemas grandes la extracción se programa en horarios o días de interferencia nula o mínima.

### 2. Transformación
Aplica reglas de negocio o funciones sobre lo extraído. Las reglas pueden ser declarativas, basadas en excepciones o en restricciones, pero deben ser: **declarativas · independientes · claras · inteligibles · con una finalidad útil para el negocio**.

Transformaciones típicas (la lista completa del ebook):
- Seleccionar solo ciertas columnas (p. ej. no cargar las que tienen nulos).
- **Traducir códigos** (origen guarda "H"/"M", destino necesita "1"/"2").
- **Codificar valores libres** ("Hombre" → "H", "Sr" → "1").
- **Obtener valores calculados** (`total_venta = cantidad * precio`).
- Unir datos de múltiples fuentes (búsquedas, combinaciones).
- Calcular totales sobre múltiples filas (ventas totales por región).
- Generar campos clave en el destino.
- **Transponer o pivotar** (columnas a filas y viceversa).
- Dividir una columna en varias ("García, Miguel" → Nombre + Apellido).
- Bifurcar por calidad: datos OK → pasan a carga; datos erróneos → políticas de tratamiento de excepciones.

### 3. Carga
Los datos transformados entran al sistema destino. Según los requerimientos, puede sobrescribir la información antigua o resumir transacciones y guardar un promedio. Los **data warehouse mantienen historial**, lo que permite auditar y tener el rastro de todo el valor a lo largo del tiempo.

Dos formas básicas de desarrollar la carga:
- **Acumulación simple** — resume todas las transacciones del período y transporta el resultado como una sola transacción (un sumatorio o promedio). Es la más sencilla y común.
- **Rolling** — la recomendable cuando se quieren **varios niveles de granularidad**: guarda resúmenes en distintos niveles (totales diarios, semanales, mensuales) o por jerarquías de las dimensiones.

La carga interactúa directamente con la base destino, así que **se aplican todas sus restricciones**; si están bien definidas, la calidad del dato queda garantizada. Restricciones típicas: valores únicos · integridad referencial · campos obligatorios · rangos de valores.

## Los 7 atributos de calidad del dato

Ningún fragmento de información debería carecer de: **completitud · conformidad · consistencia · precisión · unicidad · integridad** (el ebook los enumera como siete; el texto extraído lista seis nombrados — verificar el séptimo en el PDF si se necesita citarlo exacto. Confianza `medium`).

## ETL vs. E-LT

Mismo resultado, distinta forma. En **ETL** la herramienta transforma **registro por registro**; en **E-LT** la transformación la hace la base de datos, que evalúa **en lotes**. Ventajas de E-LT según el ebook:
- **Velocidad de proceso** — el motor procesa por lotes, no fila por fila.
- **Uso de recursos** — la base ya está optimizada para disco, memoria y proceso; las herramientas ETL no aprovechan la configuración de disco (RAID) ni el reparto de memoria/procesador, y hacen transformaciones temporales muchas veces redundantes.

Implementación E-LT en tres pasos que describe: (1) extraer y cargar los datos vía SQL a un área **staging** (temporal, se limpia en cada carga; ahí solo transformaciones simples y limpieza básica); (2) transformar con el lenguaje propio de la base (T-SQL, PL/SQL); (3) insertar en el Data Warehouse. Así la transformación queda integrada en el motor.

Advertencia útil: hay clientes con herramienta E-LT que en la práctica usan ETL **por no conocer sus ventajas**. Conocer el alcance de los recursos disponibles es parte de la decisión.

## Cultura data-driven (marco del ebook)

Ecuación que repite: **"Data driven = tecnología + organización + cultura"**, sobre tres pilares — tecnología escalable/flexible/híbrida/móvil, gobierno de los datos, y principios y valores de una cultura empresarial abierta, colaborativa e inquieta.

Cinco pasos para instaurarla: difundir la necesidad de usar datos como soporte de cualquier proceso · definir políticas que rijan el acceso · establecer indicadores para dar seguimiento a la calidad del dato · integrar analytics en las herramientas de negocio · centralizar los datos y mejorar su organización.

Tres recomendaciones de los analistas de Gartner **Alan Duncan y Frank Buytendijk** que cita: predicar con el ejemplo (los CIO deben comunicar cómo usan datos para decidir) · fomentar la transparencia · contratar gente con mentalidad orientada a datos ya desde el reclutamiento.

## Datos citados en el ebook (usar con cuidado)

Cifras que sirven para justificar un proyecto en un entregable, **todas sin año en el documento** — si se citan, verificar la fuente primero:

| Dato | Fuente que cita el ebook |
|---|---|
| Las organizaciones data-driven crecen **27% anual** en ingresos vs. **7%** de las demás | Grupo Aberdeen, *The executive's guide to effective analytics* |
| **83%** percibió mejoras en tiempos de ciclo (vs. 39% de las no data-driven) | Aberdeen |
| **12%** de las empresas data-driven redujo gastos de operación vs. **1%** de las otras | Aberdeen |
| Las organizaciones data-driven son **56% más propensas** a tener políticas formales de gobierno de datos | (sin atribuir) |
| **52.3%** de los científicos de datos ve la calidad del dato como su mayor obstáculo diario; **47.7%** pide más capacitación | CrowdFlower |
| **80%** del esfuerzo de cualquier iniciativa debe ir a asegurar y mantener la calidad del dato | (criterio del ebook) |

Sesgo a tener presente: PowerData vende servicios de gestión de datos, así que el ebook empuja "compra herramienta" frente a "desarrollo personalizado". La sección de pros y contras existe, pero no es neutral.

Relacionado: [[11-ESCUELA/10-cuatrimestre/inteligencia-de-negocios/_moc-inteligencia-de-negocios|Inteligencia de Negocios]] · [[11-ESCUELA/10-cuatrimestre/inteligencia-de-negocios/materiales/mysqlsampledatabase-classicmodels|Dataset classicmodels]] · [[yadhira-moreno]]
