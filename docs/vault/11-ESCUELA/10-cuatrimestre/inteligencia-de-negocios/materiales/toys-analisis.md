---
type: material
materia: inteligencia-de-negocios
formato: xlsx
archivo-original: "toys.xlsx"
dataset-origen: classicmodels
date: 2026-09-02
last-updated: 2026-09-02
tags: [escuela, material, utch, business-intelligence, sql, excel, dataset, analisis]
ai-first: true
---

## For future Claude

Registro de `toys.xlsx`, el libro de Excel con consultas ya resueltas sobre la base [[11-ESCUELA/10-cuatrimestre/inteligencia-de-negocios/materiales/mysqlsampledatabase-classicmodels|classicmodels]] que dio [[yadhira-moreno]] en [[11-ESCUELA/10-cuatrimestre/inteligencia-de-negocios/_moc-inteligencia-de-negocios|Inteligencia de Negocios]] (Moodle [[utch]], 2026-09-02). El .xlsx no se guardó; aquí quedan las hojas, sus columnas y los datos chicos completos. **Contiene un error de cálculo confirmado** (ver la sección de abajo) — leerla antes de reusar cualquier cifra de este archivo.

# Material — `toys.xlsx` (análisis sobre classicmodels)

- **Archivo original:** `toys.xlsx` · 78 KB · 7 hojas
- **Dónde estaba:** sección "Material" del curso 10M en Moodle → `~/Downloads/`
- **Estado local:** borrado. Reproducible: son consultas SQL sobre `classicmodels`.
- **Formato de fechas:** seriales de Excel (base 1899-12-30). 37627 = 2003-01-06.

## Las 7 hojas

| Hoja | Filas | Columnas |
|---|---|---|
| `ventas_deuda_oficina` | 7 | officeCode, city, ventas, total_pagado, deuda, porcentaje de pagado, porcentaje por cobrar |
| `ventas_por_anio_mes` | 326 | orderNumber, orderDate, total_cantidad, subtotal, total |
| `pagos_por_anio_mes` | 273 | customerNumber, checkNumber, paymentDate, amount |
| `productos_venta_utilidad` | 109 | productCode, productName, buyPrice, priceEach, utilidad, porcentaje |
| `ventas_categoria` | 7 | productLine, priceEach |
| `utilidades_anio_mes` | 326 | orderNumber, orderDate, compra, venta, utilidad, porcentaje |
| `comentarios` | 80 | orderNumber, orderDate, requiredDate, shippedDate, status, comments, customerNumber |

Pese a los nombres, `ventas_por_anio_mes` y `utilidades_anio_mes` **no están agrupadas por año-mes**: están por pedido, con la fecha cruda. El agrupamiento se deja para el alumno.

## ⚠️ Error de cálculo confirmado en dos hojas

En `ventas_por_anio_mes` y `utilidades_anio_mes` el total está calculado como **SUMA(cantidad) × SUMA(precio unitario)** en vez de **SUMA(cantidad × precio)**. Es el clásico error de agregar dos columnas por separado después de un JOIN.

Prueba con el pedido **10100** (4 líneas, verificadas contra el dump SQL):

| | Hoja | Real |
|---|---|---|
| Venta | 45,577.84 (= 151 × 301.84) | **10,223.83** |
| Compra | 27,936.51 (= 151 × 185.01) | **6,283.47** |
| Utilidad | 27,906.91 | **3,940.36** |

Efecto en el agregado: la hoja da **$112.3 M de ventas totales**; las ventas reales de classicmodels en 2003-2005 son **≈ $9.6 M**. Está inflado ~12×.

Qué hacer con esto:
- **No citar ninguna cifra absoluta de esas dos hojas.**
- El SQL correcto es `SUM(quantityOrdered * priceEach)` con `GROUP BY`, nunca `SUM(quantityOrdered) * SUM(priceEach)`.
- Puede ser un error involuntario de la profe o un ejercicio de detección puesto a propósito. **Preguntarle antes de corregirlo en público** — confianza `high` en el error, `speculation` en la intención.
- Las otras cinco hojas no dependen de ese cálculo y se ven sanas.

## Datos completos de las hojas chicas

### `ventas_deuda_oficina`
Ventas y cobranza por oficina. Las cifras de "ventas" arrastran el mismo problema de escala, pero **los porcentajes sí son comparables entre oficinas** porque el error afecta parejo.

| officeCode | Ciudad | Ventas | Total pagado | Deuda | % pagado | % por cobrar |
|---|---|---|---|---|---|---|
| 5 | Tokyo | 5,609,681 | 457,110 | 5,152,571 | 8.15 | 91.85 |
| 2 | Boston | 10,524,023 | 835,882 | 9,688,141 | 7.94 | 92.06 |
| 3 | NYC | 12,552,258 | 1,072,619 | 11,479,638 | 8.55 | 91.45 |
| 6 | Sydney | 12,924,365 | 1,007,293 | 11,917,072 | 7.79 | 92.21 |
| 7 | London | 16,881,476 | 1,324,326 | 15,557,150 | 7.84 | 92.16 |
| 1 | San Francisco | 17,389,884 | 1,337,440 | 16,052,444 | 7.69 | 92.31 |
| 4 | **Paris** | **36,408,023** | 2,819,169 | 33,588,854 | 7.74 | 92.26 |

Lecturas: **París vende el doble que la siguiente oficina** y más que Tokyo, Boston y NYC juntas. El % de cobranza es prácticamente idéntico en las 7 (7.7-8.5%), o sea que la mora **no es un problema de oficina, es sistémico** — buen hallazgo para un entregable, y la clase de conclusión que BI debe producir.

### `ventas_categoria`
Precio promedio de venta (`priceEach`) por línea de producto.

| Línea de producto | priceEach |
|---|---|
| Classic Cars | 214.30 |
| Planes | 134.04 |
| Trucks and Buses | 121.64 |
| Vintage Cars | 95.55 |
| Trains | 87.73 |
| Motorcycles | 81.35 |
| Ships | 80.86 |

### `productos_venta_utilidad` (109 productos)
Columnas: costo (`buyPrice`), precio (`priceEach`), utilidad absoluta y `porcentaje` = margen sobre costo. Ordenada de mayor a menor margen. Rango: **86.4% (1940s Ford truck) a 42.1% (1970 Plymouth Hemi Cuda)**.

Extremos:
- **Top 5:** 1940s Ford truck (86.43%) · 1962 Lancia Delta 16V (86.42%) · 1948 Porsche 356-A Roadster (79.55%) · 1968 Dodge Charger (78.05%) · 1970 Triumph Spitfire (77.11%)
- **Bottom 5:** 1970 Plymouth Hemi Cuda (42.10%) · 1926 Ford Fire Engine (42.71%) · 1928 Mercedes-Benz SSK (43.43%) · 1999 Indy 500 Monte Carlo SS (44.79%) · 2002 Yamaha YZR M1 (45.65%)

### `pagos_por_anio_mes`
273 pagos, 2003-01-16 a 2005-06-09, suma **$8,853,839**. Esta hoja **sí es fiel** al dump (`payments` tiene 273 filas). Sirve de contraste: los pagos reales son ~$8.85 M contra los $112 M de "ventas" de la hoja rota — otra señal del error.

### `comentarios`
Los 80 pedidos (de 326) que traen comentario. Es el lado cualitativo del dataset: notas del vendedor sobre cada pedido. Estatus: 62 Shipped, 4 Resolved, 3 Disputed, 2 Cancelled, y varias filas donde el texto del comentario se recorrió a la columna `status` (pedidos cancelados sin `shippedDate` — **la hoja está mal alineada en esas filas**, no es que el estatus se llame así).

Temas recurrentes en los comentarios: peticiones de material de marketing, disputas por el color exacto de los modelos, límites de crédito excedidos, clientes que se van con la competencia, y cancelaciones. Sirven para justificar por qué un tablero de BI necesita también dimensiones no numéricas.

## Para qué sirve este archivo

Es el **espejo de la salida esperada**: qué indicadores quiere la profe que sepas sacar de `classicmodels` — ventas y cobranza por oficina, ventas y pagos en el tiempo, margen por producto, precio por categoría. Y de paso, un caso real de por qué la calidad del dato (los 7 atributos del [[11-ESCUELA/10-cuatrimestre/inteligencia-de-negocios/materiales/ebook-procesos-etl|ebook de ETL]]: precisión, consistencia) importa: un JOIN mal agregado infló las ventas 12×.

Relacionado: [[11-ESCUELA/10-cuatrimestre/inteligencia-de-negocios/_moc-inteligencia-de-negocios|Inteligencia de Negocios]] · [[11-ESCUELA/10-cuatrimestre/inteligencia-de-negocios/materiales/mysqlsampledatabase-classicmodels|classicmodels]] · [[yadhira-moreno]]
