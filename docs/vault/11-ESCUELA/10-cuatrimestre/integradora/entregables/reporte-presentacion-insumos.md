---
type: entregable
materia: integradora
cuatrimestre: 10
unidad: 3
status: borrador
equipo: "Equipo 5"
date: 2026-10-09
last-updated: 2026-10-09
tags: [escuela, entregable, utch, integradora, sima, cronograma, presupuesto, legal, resultados]
ai-first: true
---

## For future Claude

Insumos que [[Fora]] le pasa a [[celeste]] para el **Reporte de presentación del proyecto: documentación final, exposición y evaluación** de [[11-ESCUELA/10-cuatrimestre/integradora/_moc-integradora|Integradora]] ([[addai-guerrero]]). Ella lo pidió por WhatsApp el 2026-10-08 (cronograma, presupuesto, aspectos legales) y el 2026-10-09 (resultados: avances y resultados esperados). Celeste arma el reporte; esto es la información. El presupuesto está **recalculado para el pivote a negocios comerciales** (sin la aportación en especie de la UTCH del [[11-ESCUELA/10-cuatrimestre/integradora/entregables/plan-gestion-y-metodologia|plan de gestión]] del 2026-09-13). Inicio del cronograma: 2026-09-02 (decisión de Fora). Cifras = estimaciones sin cotizar.

# SIMA — Insumos para el reporte de presentación del proyecto

**Proyecto:** SIMA, sistema de medición de afluencia con visión computacional sobre cámaras existentes
**Equipo 5 · IEVND101M · Integradora:** Ángel Iván López Delgado · Celeste Guadalupe Ramos Gurrola · Ángel Esteban Cervantes Muñoz
**Mercado (desde el 2 de octubre de 2026):** negocios comerciales con afluencia: supermercados, cafeterías, restaurantes y espacios tipo Living Lab.

---

## 1. Cronograma

Duración: 13 semanas, del 2 de septiembre al 1 de diciembre de 2026. Metodología híbrida: PMBOK (predictivo) para la estructuración y el cierre, y Scrum (sprints de 2 semanas) para la construcción.

### 1.1 Por unidad

| Unidad | Semanas | Fechas | Enfoque | Ponderación |
|---|---|---|---|---|
| I. Estructuración del proyecto | 1–4 | 2 sep – 29 sep | Predictivo | 33 % |
| II. Dirección del proyecto | 5–11 | 30 sep – 17 nov | Ágil (3 sprints + piloto) | 53 % |
| III. Presentación del proyecto | 12–13 | 18 nov – 1 dic | Predictivo | 14 % |

### 1.2 Detalle de actividades

| Sem. | Fechas | Actividad | Responsable | Estado |
|---|---|---|---|---|
| 1 | 2 – 8 sep | Formación del equipo, definición del proyecto y propuesta del proyecto integrador (entregada el 8 sep) | Equipo | Terminada |
| 2 | 9 – 15 sep | Plan de gestión del proyecto y selección de metodología (13 sep): alcance, roles, riesgos y presupuesto inicial | Celeste (gestión) · equipo | Terminada |
| 3 | 16 – 22 sep | Contexto de la organización, problemática e indicadores | Ángel C. (BI) | Por confirmar |
| 4 | 23 – 29 sep | Diseño de la arquitectura (visión → datos → PWA) y marco normativo | Ángel L. (técnico) · Celeste (legal) | Por confirmar |
| 5 | 30 sep – 6 oct | **Pivote de mercado** a negocios comerciales (2 oct) · pitch deck con solicitud de 3 pilotos gratuitos (2 oct) · acta de aprobación del proyecto (5 oct) · **Sprint 1 inicia**: backend de visión (FastAPI + YOLO + seguimiento) | Equipo | Terminada |
| 6 | 7 – 13 oct | **Sprint 1 cierra**: primeras pruebas con video real (9 oct), medición de error contra conteo manual | Ángel L. | En curso |
| 7 | 14 – 20 oct | **Sprint 2**: cambio de detector a RF-DETR (licencia Apache 2.0), dos cámaras simultáneas, calibración por cámara | Ángel L. | Pendiente |
| 8 | 21 – 27 oct | **Sprint 2**: procesos ETL y almacén de datos (aforo, entradas/salidas, tiempo de permanencia) · acercamiento a negocios piloto · convenio de piloto y aviso de privacidad | Ángel L. · Celeste · Ángel C. | Pendiente |
| 9 | 28 oct – 3 nov | **Sprint 3**: PWA instalable con tablero de indicadores y modo sin conexión | Ángel L. · Ángel C. | Pendiente |
| 10 | 4 – 10 nov | **Sprint 3**: mapas de calor y gemelo digital (reproducción de un día) · instalación en el primer negocio piloto | Ángel L. | Pendiente |
| 11 | 11 – 17 nov | **Piloto en campo**: operación en negocio(s), validación contra conteo manual, levantamiento de hallazgos para el negocio | Equipo | Pendiente |
| 12 | 18 – 24 nov | Documentación final, resultados del piloto, modelo de negocio validado | Celeste · Ángel C. | Pendiente |
| 13 | 25 nov – 1 dic | Demostración funcional, presentación ejecutiva y evaluación | Equipo | Pendiente |

### 1.3 Hitos

| Hito | Fecha |
|---|---|
| Propuesta del proyecto entregada | 8 sep 2026 |
| Plan de gestión y metodología | 13 sep 2026 |
| Pivote a negocios comerciales + pitch deck | 2 oct 2026 |
| Acta de aprobación del proyecto | 5 oct 2026 |
| Primera prueba del sistema con video real | 9 oct 2026 |
| Primer negocio piloto operando | semana 10 (4 – 10 nov) |
| Cierre del piloto | 17 nov 2026 |
| Presentación final | semana 13 (25 nov – 1 dic) |

---

## 2. Presupuesto (recalculado para negocios comerciales)

> Cifras en pesos mexicanos, **estimadas por el equipo y pendientes de cotización formal**. Cambio respecto al plan de gestión del 13 de septiembre: se elimina la aportación en especie de la UTCH ($51,000) porque el proyecto ya no se pilotea en la universidad, sino en negocios. El modelo de piloto es el del pitch: **SIMA pone la instalación, el equipo de cómputo y el tablero; el negocio presta sus cámaras y da retroalimentación, sin costo para él.**

### 2.1 Costos directos (desembolso) del piloto

Escenario: 3 negocios piloto. El primer piloto se corre con equipo propio del equipo (la laptop de desarrollo ya procesa video en tiempo real, entre 27 y 68 cuadros por segundo), así que solo se compran 2 nodos.

| Concepto | Cantidad | Costo unitario | Total | Nota |
|---|---|---|---|---|
| Nodo de cómputo en el borde (mini PC o Jetson con acelerador) | 2 | $6,000 | $12,000 | Procesa el video dentro del negocio; el video no sale del local |
| Accesorios de red, montaje y energía por sitio | 3 | $800 | $2,400 | Cables, adaptadores, regleta con protección |
| Cámara IP para pruebas controladas | 1 | $1,500 | $1,500 | Para desarrollar sin depender de un negocio |
| Servidor en la nube (aplicación y base de datos) | 3 meses | $500 | $1,500 | Recibe solo conteos, no video |
| Dominio y certificado de seguridad | 1 | $400 | $400 | Anualidad |
| Almacenamiento y respaldos | 3 meses | $200 | $600 | |
| Cómputo para entrenar el modelo (GPU en la nube) | 2 meses | $200 | $400 | Ajuste fino con video de los pilotos |
| Avisos de privacidad impresos y señalización | 3 | $300 | $900 | Uno por negocio, visible en la entrada |
| Material para el acercamiento comercial | — | — | $500 | Impresos y presentación para negocios |
| Transporte a los negocios piloto | — | — | $1,500 | Instalación, calibración y validación |
| **Subtotal** | | | **$21,700** | |
| Contingencia (15 %) | | | $3,255 | Variación de precios y fallas |
| **Total de desembolso** | | | **$24,955** | |

### 2.2 Capital humano (valorizado, no es desembolso)

| Concepto | Cálculo | Valor |
|---|---|---|
| Horas aportadas | 3 integrantes × 10 h/semana × 13 semanas = 390 h | — |
| Valor de la hora (perfil junior) | $250 | — |
| **Valor del trabajo del equipo** | 390 h × $250 | **$97,500** |

### 2.3 Aportación en especie

| Aportante | Concepto | Valor estimado |
|---|---|---|
| Negocios piloto (3) | Uso de sus cámaras existentes ($6,000 por negocio) | $18,000 |
| Negocios piloto (3) | Energía, red y espacio para el nodo ($500 por negocio) | $1,500 |
| Negocios piloto (3) | Tiempo del personal para retroalimentación ($1,000 por negocio) | $3,000 |
| Equipo de trabajo | Laptop propia usada como nodo del primer piloto | $6,000 |
| **Total en especie** | | **$28,500** |

### 2.4 Costo total del proyecto

| Componente | Monto |
|---|---|
| Desembolso directo | $24,955 |
| Capital humano valorizado | $97,500 |
| Aportación en especie (negocios y equipo) | $28,500 |
| **Valor total del proyecto** | **$150,955** |

Comparación: el plan del 13 de septiembre sumaba $164,830. Sube el desembolso (de $16,330 a $24,955) porque ahora hay que llevar equipo a 3 sitios distintos, y baja la aportación en especie (de $51,000 a $28,500) porque desaparece la infraestructura de la UTCH.

### 2.5 Fuentes de financiamiento del desembolso

| Fuente | Monto | Estado |
|---|---|---|
| Aportación de los integrantes | $5,000 | Por confirmar el reparto entre los tres |
| Convocatorias de apoyo a proyectos estudiantiles / incubadora | $19,955 | Por gestionar |
| **Plan B si no se consigue apoyo** | — | Pilotos escalonados con un solo nodo que rota entre negocios: el desembolso baja a ~$15,000 |

### 2.6 Modelo de ingresos después del piloto

No financia el piloto, pero sostiene el proyecto después: **instalación** (pago único: levantamiento, calibración de cámaras y capacitación) y **membresía** (pago recurrente por el tablero y los reportes). Los precios se fijan con el costo real por cámara que arroje el piloto y la disposición a pagar que se levante con los negocios.

---

## 3. Aspectos legales

### 3.1 Normatividad aplicable

Con el pivote, SIMA trabaja con **negocios privados**, así que ya no aplica la ley para dependencias públicas (LGPDPPSO), sino la de particulares.

| Ordenamiento | Cómo aplica a SIMA |
|---|---|
| **Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)**, nueva ley publicada en el DOF el 20 de marzo de 2025 | La imagen de una persona en video es un dato personal. El negocio es el **responsable** del tratamiento y SIMA es el **encargado** (procesa por cuenta del negocio) |
| **Secretaría Anticorrupción y Buen Gobierno** | Autoridad en protección de datos personales desde 2025, tras la extinción del INAI |
| **Ley Federal del Derecho de Autor** | Protección del software de SIMA (registro ante INDAUTOR) |
| **Ley Federal de Protección a la Propiedad Industrial** | Registro de la marca "SIMA" ante el IMPI |
| **Ley Federal del Trabajo** | Las cámaras también graban a los empleados del negocio: deben estar informados y SIMA no se usa para evaluar a personas en lo individual |
| **Licencias de software de código abierto** | Determinan qué componentes se pueden usar en un servicio comercial (ver 3.4) |

### 3.2 Decisiones de diseño que reducen el riesgo legal

| Decisión | Por qué importa |
|---|---|
| **Conteo anónimo por default** | SIMA cuenta personas, mide permanencia y flujos, pero no identifica a nadie. Así no trata datos sensibles |
| **Procesamiento en el borde** | El video se procesa en un equipo dentro del negocio. Al servidor solo llegan números (aforo, entradas, tiempos), nunca imágenes |
| **No se guarda video** | El video se descarta después de procesarlo; solo se conservan los conteos agregados |
| **Re-identificación solo como módulo opcional y con consentimiento** | Reconocer clientes recurrentes usa datos biométricos, que son **datos sensibles**: exige consentimiento **expreso y por escrito**. Si un negocio lo quiere, se ofrece como enrolamiento voluntario (por ejemplo, ligado a un programa de lealtad), nunca encendido por default |

### 3.3 Obligaciones y cómo se atienden

| Obligación | Cómo se cumple |
|---|---|
| Aviso de privacidad | Aviso simplificado impreso en la entrada de cada negocio piloto y aviso integral disponible en línea (QR) |
| Contrato de encargo / convenio de piloto | Documento firmado con cada negocio que fija quién es responsable y quién encargado, la finalidad (medir afluencia), la confidencialidad, la prohibición de transferir datos y el borrado al terminar el piloto |
| Minimización | Solo se guardan conteos y tiempos agregados; no fotografías ni video |
| Seguridad de la información | Cifrado en tránsito y en reposo, acceso al tablero por usuario y rol, bitácora de accesos |
| Derechos ARCO (acceso, rectificación, cancelación y oposición) | Procedimiento documentado y un correo de contacto en el aviso de privacidad |
| Aviso a empleados | El negocio informa a su personal que SIMA mide afluencia, no desempeño individual |

### 3.4 Licencias de software

| Componente | Licencia | Implicación |
|---|---|---|
| Ultralytics YOLO (detector actual) | AGPL-3.0 | Si se ofrece como servicio, obliga a liberar el código o a comprar licencia comercial. **Se migra a RF-DETR antes del primer piloto** |
| RF-DETR (detector de reemplazo) | Apache 2.0 | Permite uso comercial sin liberar el código |
| roboflow/supervision y roboflow/trackers | MIT / Apache 2.0 | Uso comercial permitido |
| Conjunto MOT17 (videos de prueba) | Uso académico / no comercial | Solo se usa para medir precisión, no para el producto |
| CrowdHuman (posible entrenamiento) | No comercial | Válido para la escuela; para el producto se entrena con video propio de los pilotos |

### 3.5 Formalización futura (fuera del cuatrimestre)

Constituir una **Sociedad por Acciones Simplificada (SAS)**, que se hace en línea y sin notario, para facturar (CFDI) la instalación y la membresía. Registrar la marca SIMA y el software antes de comercializar.

---

## 4. Resultados

### 4.1 Avances logrados (al 9 de octubre de 2026)

**Gestión y documentación**
- Propuesta del proyecto integrador (8 sep).
- Plan de gestión y selección de metodología: híbrido PMBOK + Scrum, elegido con una matriz de decisión (4.70 de 5 contra Cascada, Scrum puro y Kanban) (13 sep).
- Pivote de mercado a negocios comerciales (2 oct).
- Pitch deck de 11 diapositivas; en lugar de inversión se piden 3 pilotos gratuitos (2 oct).
- Acta de aprobación del proyecto (5 oct).

**Producto: módulo de visión computacional (backend)**
- Construido el sistema que recibe video, detecta personas, las sigue cuadro a cuadro y genera tres tipos de evento: **ocupación** (cuántas personas hay en una zona), **cruces** (entradas y salidas por una línea) y **permanencia** (cuánto tiempo pasa cada persona en una zona). Repositorio privado con 4 versiones y 7 de 7 pruebas automáticas pasando.
- **Primeras pruebas con video real (9 oct)**, comparando contra conteo manual:

| Video | Escenario | Error de conteo | Meta (< 15 %) |
|---|---|---|---|
| MOT17-04 | Calle, cámara alta | **13.4 %** | Cumple |
| MOT17-09 | Zona comercial, cámara cercana | **16.7 %** | No cumple por 1.7 puntos |

- Funciona en **tiempo real** en una laptop común (MacBook M1): de 27 a 68 cuadros por segundo.
- Probado en escenarios de negocio: en la caja de un supermercado midió 4 clientes atendidos con ~48 segundos cada uno; en la puerta de una tienda contó 13 entradas y 8 salidas en un minuto.
- **Hallazgo técnico:** la precisión depende más de la resolución a la que se analiza cada cámara que del tamaño del modelo, y la resolución ideal cambia por cámara. Por eso cada instalación necesita una calibración propia.
- Mejora aplicada: una tolerancia contra el parpadeo del detector redujo las visitas falsas en la tienda de 101 a 24.
- Experimento posterior: ajustando los umbrales de confianza, el error de MOT17-04 baja de 13.4 % a **7.1 %**.

### 4.2 Resultados esperados (al cierre, semana 13)

| # | Resultado esperado | Cómo se mide |
|---|---|---|
| 1 | Sistema operando en al menos 1 negocio piloto (meta: 3) | Instalación funcionando durante la semana 11 |
| 2 | Error de conteo menor a 15 % en todas las cámaras piloto | Comparación contra conteo manual de un fragmento de video de cada cámara |
| 3 | Dos cámaras procesadas al mismo tiempo en tiempo real | Prueba en el nodo de borde |
| 4 | Detector migrado a RF-DETR, sin el riesgo de licencia AGPL | Componente reemplazado y precisión igual o mejor |
| 5 | PWA instalable con tablero de indicadores que funciona sin conexión | Instalada en el teléfono del encargado de al menos un negocio |
| 6 | Mapa de calor / gemelo digital que reproduce un día completo de afluencia | Demostración en la presentación final |
| 7 | Al menos 3 hallazgos accionables para el negocio (por ejemplo, horas pico contra personal asignado, tiempo de espera en caja, zonas que nadie visita) | Reporte entregado al negocio piloto |
| 8 | Documentación legal completa: aviso de privacidad y convenio de piloto firmados | Documentos firmados por cada negocio |
| 9 | Modelo de negocio validado con los negocios entrevistados (instalación + membresía) | Entrevistas registradas y disposición a pagar documentada |

---

**Google Doc (privado, carpeta UTCH):** https://docs.google.com/document/d/1R13dZxcmKnXGZLAYbEJT3JHqWIbQHTCzAAwroGTG0Hw/edit

Fuentes internas: [[11-ESCUELA/10-cuatrimestre/proyecto-integrador|proyecto integrador]] · [[11-ESCUELA/10-cuatrimestre/integradora/entregables/plan-gestion-y-metodologia|plan de gestión]] · [[11-ESCUELA/10-cuatrimestre/integradora/entregables/pruebas-video-sprint|pruebas con video]] · [[celeste]] · [[angel-cervantes]] · [[addai-guerrero]]
