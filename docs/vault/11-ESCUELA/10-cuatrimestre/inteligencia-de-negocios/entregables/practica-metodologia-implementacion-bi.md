---
type: entregable
status: generado
date: 2026-10-23
last-updated: 2026-10-23
tags: [escuela, utch, inteligencia-de-negocios, entregable, practica, dashboard, etl]
ai-first: true
---

## For future Claude

Práctica en equipo ([[Fora]], [[celeste]], [[angel-cervantes]]) para **Inteligencia de Negocios** con [[yadhira-moreno]], generada el 2026-10-23 en PDF. Es un caso **hipotético**: no hubo datos, así que todo es planeación (requerimientos, ETL simulado, wireframe y propuesta de valor). Las cifras del boceto son ilustrativas y se presentan así en el documento. Materia: [[11-ESCUELA/10-cuatrimestre/inteligencia-de-negocios/_moc-inteligencia-de-negocios|Inteligencia de Negocios]].

- **PDF (Drive UTCH):** https://drive.google.com/file/d/10KnriU1XJeDqPq-jtFsc7SCfwJbgho6f/view (6 páginas, portada con los 3 integrantes)

## 1. Introducción

Una cadena local de tiendas de ropa detectó que sus ganancias bajaron este trimestre, pero no sabe si el problema está en una sucursal, en una categoría de producto (calzado, chamarras, camisas) o en un método de pago. Este documento aplica las cinco fases de la metodología de implementación de inteligencia de negocios (BI) para proponer cómo resolverlo: definición de requerimientos, identificación de fuentes, limpieza de datos (ETL), diseño del tablero y estrategia de adopción. Como el reto es simulado y no se cuenta con datos reales, la propuesta describe el procedimiento que el equipo seguiría y las cifras del boceto son solo ilustrativas.

## 2. Objetivo

Diseñar la propuesta de un tablero de inteligencia de negocios que permita al Director General identificar qué sucursal, categoría de ropa o método de pago está provocando la caída de utilidad del trimestre, para tomar decisiones correctivas con base en datos.

## 3. Fase 1 — Requerimientos

### 3.1 Preguntas clave del Director General

1. ¿Qué sucursal tuvo la mayor caída de utilidad este trimestre en comparación con el trimestre anterior y con el mismo trimestre del año pasado?
2. ¿Qué categoría de ropa (calzado, chamarras, camisas, etc.) está perdiendo margen o volumen de venta, y en qué sucursales ocurre?
3. ¿Qué método de pago está restando ganancia al negocio por comisiones bancarias, ventas a meses sin intereses, devoluciones o contracargos?

### 3.2 KPIs principales

Tabla 1. KPIs principales del tablero

| KPI | Fórmula | Qué responde |
|---|---|---|
| Margen de utilidad bruta (%) por sucursal y categoría | (Ventas − Costo de mercancía) / Ventas × 100 | Dónde se gana menos por cada peso vendido |
| Variación trimestral de utilidad (%) | (Utilidad trimestre actual − Utilidad trimestre anterior) / Utilidad trimestre anterior × 100 | Qué tanto cayó la utilidad y en qué segmento |

Como indicadores de apoyo se proponen la **tasa de devolución** (productos devueltos / productos vendidos × 100) y el **costo por método de pago** (comisiones / ventas cobradas con ese método × 100).

## 4. Fases 2 y 3 — Fuentes y ETL (simulado)

### 4.1 Fuente de datos

Se supone que la empresa entrega un archivo de Excel de ventas que cada sucursal llena manualmente, con las columnas: folio, fecha, sucursal, categoría, producto, precio, costo, método de pago y devolución.

### 4.2 Problemas detectados en el archivo

Tabla 2. Problemas de calidad de datos en el Excel de la empresa

| Problema | Ejemplo | Impacto en el análisis |
|---|---|---|
| Nombres de sucursal inconsistentes | "CDMX", "Cd. de Mex", "Cdmx", "Centro " (con espacio) | Una sola sucursal aparece como varias y sus ventas se dividen |
| Fechas con formatos distintos | 23/10/2026, 10-23-26, "23 oct", número serial de Excel | No se puede agrupar por mes ni por trimestre |
| Valores nulos | Ventas sin costo y tickets sin método de pago | El margen se calcula mal o la venta queda sin clasificar |
| Categorías inconsistentes | "Calzado", "zapatos", "Tenis", "CALZADO" | La categoría real queda fragmentada |
| Montos guardados como texto | "$1,250.00", "1250 pesos" | No se pueden sumar ni promediar |
| Métodos de pago con varios nombres | "TDC", "Tarjeta crédito", "Visa", "crédito" | No se puede medir el costo de cada método |
| Registros duplicados | El mismo folio capturado dos veces | Ventas infladas |
| Devoluciones mezcladas | A veces en negativo, a veces en otra columna | La tasa de devolución no es confiable |

### 4.3 Reglas de limpieza (ETL)

**Regla 1 — Estandarizar con catálogos maestros.** Se eliminan espacios sobrantes y se convierte el texto a mayúsculas. Después, cada sucursal, categoría y método de pago se sustituye por su nombre oficial con una tabla de equivalencias (por ejemplo, "Cd. de Mex" → "CDMX", "zapatos" → "CALZADO", "Visa" → "TARJETA CRÉDITO"). Los valores que no existan en el catálogo no se cargan: se envían a una hoja de rechazos para su revisión.

**Regla 2 — Validar fechas, montos y registros incompletos.** Todas las fechas se convierten al formato AAAA-MM-DD y los montos a valor numérico (sin "$" ni separadores de miles). Si una fila no tiene fecha, precio o costo, no entra al sistema y se reporta. Si un folio aparece más de una vez, se conserva solo el primer registro.

<div style="page-break-before:always"></div>

## 5. Fase 4 — Boceto del tablero (wireframe)

Figura 1. Boceto del tablero de rentabilidad (cifras ilustrativas)

<div style="border:2px solid #333;font-size:9pt;line-height:1.3;margin:8px 0 4px 0;page-break-inside:avoid">
<div style="background:#1f3a5f;color:#fff;padding:8px 10px"><b style="font-size:11pt">TABLERO DE RENTABILIDAD — Cadena de tiendas de ropa</b><br>Objetivo: detectar qué genera la caída de utilidad · Usuario: Director General y gerentes de sucursal</div>
<div style="background:#eef1f5;padding:6px 10px;border-bottom:1px solid #999">Filtros: [ Trimestre ▾ ]&nbsp;&nbsp;[ Sucursal ▾ ]&nbsp;&nbsp;[ Categoría ▾ ]&nbsp;&nbsp;[ Método de pago ▾ ]</div>
<div style="display:flex;gap:6px;padding:6px">
<div style="flex:1;border:1px solid #999;padding:6px;text-align:center">UTILIDAD<br><b style="font-size:14pt">$1.2 M</b><br><span style="color:#c0392b">▼ −12%</span></div>
<div style="flex:1;border:1px solid #999;padding:6px;text-align:center">MARGEN BRUTO<br><b style="font-size:14pt">32%</b><br><span style="color:#c0392b">▼ −4 pts</span></div>
<div style="flex:1;border:1px solid #999;padding:6px;text-align:center">VAR. VS TRIM. ANTERIOR<br><b style="font-size:14pt">−12%</b><br><span style="color:#c0392b">▼</span></div>
<div style="flex:1;border:1px solid #999;padding:6px;text-align:center">TASA DE DEVOLUCIÓN<br><b style="font-size:14pt">8%</b><br><span style="color:#c0392b">▲ +3 pts</span></div>
</div>
<div style="display:flex;gap:6px;padding:0 6px 6px 6px">
<div style="flex:1;border:1px solid #999;padding:6px;height:95px"><b>Utilidad por sucursal</b><br>Barras horizontales ordenadas de peor a mejor; en rojo las que bajan.</div>
<div style="flex:1;border:1px solid #999;padding:6px;height:95px"><b>Tendencia de utilidad</b><br>Línea por mes: trimestre actual contra trimestre anterior.</div>
</div>
<div style="display:flex;gap:6px;padding:0 6px 6px 6px">
<div style="flex:1;border:1px solid #999;padding:6px;height:95px"><b>Margen por categoría</b><br>Barras agrupadas: calzado, chamarras, camisas, etc.</div>
<div style="flex:1;border:1px solid #999;padding:6px;height:95px"><b>Ventas y comisión por método de pago</b><br>Barras apiladas: efectivo, débito, crédito, meses sin intereses.</div>
</div>
<div style="border-top:1px solid #999;margin:0 6px 6px 6px;padding:6px;border:1px solid #999"><b>Detalle:</b> Sucursal | Categoría | Ventas | Costo | Margen % | Devoluciones | Var. % — ordenada de mayor a menor caída.</div>
</div>

Fuente: elaboración propia del equipo.

### 5.1 Decisiones de diseño

- **Regla de los 5 segundos:** las tarjetas de KPIs van en la parte superior izquierda, que es lo primero que se lee, con flecha y color (rojo si el indicador empeora, verde si mejora). En cinco segundos el director sabe que la utilidad bajó y cuánto.
- **Tipo de gráfica según la pregunta:** barras para comparar sucursales, categorías y métodos de pago; línea para la tendencia en el tiempo. Un mapa solo se justificaría si las sucursales estuvieran en varias ciudades; si están en la misma, no aporta información.
- **Navegación de lo general a lo particular:** al dar clic en una barra se filtra todo el tablero. Así el usuario pasa de "¿qué sucursal?" a "¿qué categoría?" y después a "¿qué método de pago?" sin cambiar de pantalla.
- **Tabla de detalle abajo:** para quien necesite el dato exacto, sin saturar la vista principal.

## 6. Fase 5 — Propuesta de valor

Para asegurar que el tablero se use y no se quede como un archivo olvidado, se propone:

1. **Capacitación corta:** una sesión de 30 minutos con el director y los gerentes para leer las tarjetas y usar los filtros, más una guía de una página.
2. **Alertas automáticas:** aviso por correo o WhatsApp al gerente cuando el margen de su sucursal baje más de 5% contra la semana anterior o cuando la tasa de devolución supere el 10%.
3. **Actualización automática:** el proceso ETL se ejecuta cada noche, de modo que nadie envía el Excel a mano y el tablero siempre muestra los datos del día anterior.
4. **Versión móvil:** una vista simplificada con las tarjetas de KPIs para que el director la consulte desde el celular.
5. **Piloto:** dos semanas con una o dos sucursales para recoger retroalimentación antes de extenderlo a toda la cadena.
6. **Junta semanal de 15 minutos** con el tablero en pantalla, para que su uso se vuelva un hábito.

## 7. Conclusiones

El problema de la cadena no es la falta de datos, sino que están dispersos y sucios: mientras una misma sucursal aparezca con tres nombres o las fechas no coincidan, ninguna gráfica va a señalar la causa real de la caída. Por eso la limpieza (ETL) es la fase que más pesa en el resultado. Con datos estandarizados, dos KPIs bien definidos y un tablero que muestre lo importante en cinco segundos, el Director General puede pasar de "las ganancias bajaron" a "la sucursal X pierde margen en calzado pagado con tarjeta de crédito" y actuar sobre eso. La propuesta de valor cierra el ciclo: un tablero solo genera valor si las personas lo consultan y reciben alertas a tiempo.
