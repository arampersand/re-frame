---
type: material
materia: inteligencia-de-negocios
formato: sql
archivo-original: "mysqlsampledatabase.zip"
dataset: classicmodels
date: 2026-09-02
last-updated: 2026-09-02
tags: [escuela, material, utch, business-intelligence, sql, mysql, dataset]
ai-first: true
---

## For future Claude

Documentación del dataset transaccional de [[11-ESCUELA/10-cuatrimestre/inteligencia-de-negocios/_moc-inteligencia-de-negocios|Inteligencia de Negocios]] ([[yadhira-moreno]], Moodle [[utch]], descargado 2026-09-02). Es `classicmodels`, la base de ejemplo pública de MySQL Tutorial. **No se guardó el .sql en el vault porque es público y re-descargable**; aquí queda el esquema completo, los conteos y para qué se usa. Esquema y conteos extraídos del dump real, no de la documentación oficial.

# Material — Base de datos `classicmodels`

- **Archivo original:** `mysqlsampledatabase.zip` (54 KB) → contiene `mysqlsampledatabase.sql` (210 KB, dump del 2016-05-24)
- **Dónde estaba:** sección "Material" del curso 10M en Moodle → `~/Downloads/`
- **Estado local:** borrado. Es la sample database estándar de https://www.mysqltutorial.org — se vuelve a bajar de ahí o del Moodle.
- **Motor:** MySQL, `CREATE DATABASE classicmodels`, charset latin1.

## Qué modela

Un **distribuidor de modelos a escala de colección** (autos clásicos, motos, aviones, barcos, trenes, camiones). Tiene el ciclo completo de venta B2B: oficinas → empleados → clientes asignados a un representante → pedidos → líneas de pedido → pagos. Por eso sirve para BI: hay hechos (ventas, pagos) y dimensiones naturales (tiempo, producto, cliente, geografía, empleado).

- **Rango temporal de los datos:** 2003-01-06 a 2005-06-11.
- **7 oficinas:** San Francisco (1), Boston (2), NYC (3), Paris (4), Tokyo (5), Sydney (6), London (7).
- **7 líneas de producto:** Classic Cars, Motorcycles, Planes, Ships, Trains, Trucks and Buses, Vintage Cars.

## Esquema (8 tablas)

| Tabla | Filas | Llave primaria |
|---|---|---|
| `orderdetails` | 2,996 | (orderNumber, productCode) |
| `orders` | 326 | orderNumber |
| `payments` | 273 | (customerNumber, checkNumber) |
| `customers` | 122 | customerNumber |
| `products` | 110 | productCode |
| `employees` | 23 | employeeNumber |
| `offices` | 7 | officeCode |
| `productlines` | 7 | productLine |

### Columnas

**`offices`** — officeCode, city, phone, addressLine1, addressLine2, state, country, postalCode, territory.

**`employees`** — employeeNumber, lastName, firstName, extension, email, officeCode → `offices`, **reportsTo → `employees`** (auto-referencia: es la jerarquía del organigrama), jobTitle.

**`customers`** — customerNumber, customerName, contactLastName, contactFirstName, phone, addressLine1/2, city, state, postalCode, country, **salesRepEmployeeNumber → `employees`**, creditLimit.

**`productlines`** — productLine, textDescription, htmlDescription, image (blob).

**`products`** — productCode, productName, productLine → `productlines`, productScale, productVendor, productDescription, quantityInStock, **buyPrice** (costo), **MSRP** (precio de lista).

**`orders`** — orderNumber, orderDate, requiredDate, shippedDate, **status** (Shipped, Resolved, Cancelled, On Hold, Disputed, In Process), comments, customerNumber → `customers`.

**`orderdetails`** — orderNumber → `orders`, productCode → `products`, quantityOrdered, **priceEach** (precio real de venta, distinto de MSRP), orderLineNumber.

**`payments`** — customerNumber → `customers`, checkNumber, paymentDate, amount.

### Relaciones

```
offices 1─n employees ─┐ (reportsTo: employees 1─n employees)
                       └─1─n customers ─1─n orders ─1─n orderdetails ─n─1 products ─n─1 productlines
                                        └─1─n payments
```

## Cómo se usa en la materia

Es la fuente cruda; los análisis ya resueltos sobre ella están en [[11-ESCUELA/10-cuatrimestre/inteligencia-de-negocios/materiales/toys-analisis|toys.xlsx]]. Las consultas que la profe ya sacó implican dominar: `JOIN` de 3-4 tablas, `GROUP BY` con agregados, cálculo de margen (`priceEach - buyPrice`), y agrupación por año-mes sobre `orderDate`.

Trampas del dataset que conviene saber de antemano:
- **`priceEach` ≠ `MSRP`** — el precio real de venta por línea está en `orderdetails`; usar MSRP infla las ventas.
- **La utilidad se calcula por línea de pedido**, cruzando `orderdetails.priceEach` con `products.buyPrice`.
- **`orders.status` incluye Cancelled y Disputed** — si no se filtran, las ventas quedan infladas con pedidos que nunca se cobraron.
- **`payments` no se ata a un pedido**, solo al cliente. Por eso "deuda" solo se puede calcular a nivel cliente/oficina, no por pedido.
- `shippedDate` puede ser NULL (pedidos cancelados o en proceso).

Relacionado: [[11-ESCUELA/10-cuatrimestre/inteligencia-de-negocios/_moc-inteligencia-de-negocios|Inteligencia de Negocios]] · [[11-ESCUELA/10-cuatrimestre/inteligencia-de-negocios/materiales/toys-analisis|toys.xlsx — análisis]] · [[11-ESCUELA/10-cuatrimestre/inteligencia-de-negocios/materiales/ebook-procesos-etl|Ebook procesos ETL]]
