---
type: entregable
materia: inteligencia-de-negocios
actividad: 2
status: borrador
date: 2026-09-03
last-updated: 2026-09-03
tags: [escuela, entregable, utch, business-intelligence, investigacion]
ai-first: true
---

## For future Claude

Entregable de [[01-YOU/identity|Fora]] para la **Actividad 2** de [[11-ESCUELA/10-cuatrimestre/inteligencia-de-negocios/_moc-inteligencia-de-negocios|Inteligencia de Negocios]] ([[yadhira-moreno]], [[utch]], 10º cuatrimestre): buscar empresas que aplican BI e identificar **ventajas, impacto y capacidades**. Estado as of 2026-09-03: borrador completo, sin entregar, sin fecha límite confirmada. Las cifras de mercado y de ROI vienen de agregadores de estadísticas de baja trazabilidad — están marcadas con su nivel de confianza y **no deben citarse como dato duro** sin ir a la fuente primaria. Los casos de empresa sí tienen fuente identificable.

# Actividad 2 — Ventajas, impacto y capacidades de la inteligencia de negocios

**Materia:** Inteligencia de Negocios (10º cuatrimestre)
**Profesora:** Yadhira Alejandra Moreno Delgado
**Alumno:** Ángel Iván López Delgado
**Carrera:** Entornos Virtuales y Negocios Digitales
**Fecha:** 3 de septiembre de 2026

---

## 1. Introducción

La consigna de la actividad (slide 6 de `Fundamentos.pptx`) es doble: buscar empresas que aplican inteligencia de negocios e **identificar las ventajas, el impacto y las capacidades** de la disciplina. Este documento resuelve las dos partes con la misma lógica: primero se define de qué se está hablando, luego se documentan casos reales de empresas, y de esos casos se extraen las tres dimensiones pedidas. La idea es no listar beneficios genéricos de folleto, sino amarrar cada ventaja a algo que una empresa concreta hizo con datos.

El punto de partida es la definición que la propia materia da por buena:

> Se refiere al uso de datos en una empresa para facilitar la toma de decisiones. Abarca la comprensión del funcionamiento actual de la empresa, bien como la anticipación de acontecimientos futuros, con el objetivo de ofrecer conocimientos para respaldar las decisiones empresariales.
>
> — `Fundamentos.pptx`, slide 3

Dos verbos organizan todo lo que sigue: **comprender** el presente (reportes, tableros, indicadores) y **anticipar** el futuro (modelado predictivo, minería de datos). La inteligencia de negocios no es una herramienta, es la capa que convierte datos operativos dispersos en decisiones defendibles.

### 1.1 Delimitación: BI, análisis de negocios y análisis de datos

Antes de hablar de ventajas conviene separar tres términos que en la práctica se usan como sinónimos y no lo son:

| Concepto | Qué es | Naturaleza |
|---|---|---|
| **Inteligencia de negocios (BI)** | Uso de los datos de la empresa para decidir; incluye minería de datos, estadística y modelado predictivo | Sistema / disciplina |
| **Análisis de negocios (BA)** | Práctica de usar los datos propios para anticipar tendencias y resultados | Negocio |
| **Análisis de datos** | Extracción, limpieza, transformación y construcción de sistemas para gestionar datos | Técnica |
| **Ciencia de datos** | Área que combina estadística, método científico, IA y análisis de datos | Área |
| **Minería de datos** | Descubrimiento de patrones en grandes volúmenes de datos | Técnica dentro del área |

Fuente de las definiciones: `Fundamentos.pptx`, slides 3–9. Confianza: `stated`.

La distinción operativa: el análisis de datos construye la tubería, el análisis de negocios interpreta lo que sale de ella, y la inteligencia de negocios es el conjunto —tubería, interpretación y el circuito de decisión que las conecta.

---

## 2. Empresas que aplican inteligencia de negocios

### 2.1 Netflix — personalización como motor de retención

Netflix opera un sistema de recomendación alimentado por el comportamiento de visualización de cada usuario (qué ve, cuándo, cuánto tiempo, en qué dispositivo, dónde abandona). Se estima que alrededor del **80 % de las horas vistas en la plataforma provienen de contenido sugerido por el sistema de recomendación**, y la propia compañía ha valuado públicamente el ahorro por retención de suscriptores atribuible a la personalización en el orden de **1,000 millones de dólares anuales** (as of 2026, illumin.usc.edu/netflixs-recommendation-systems-entertainment-made-for-you/).

Lo relevante para BI no es el algoritmo, es el circuito: el dato de consumo no solo alimenta la interfaz, también alimenta las decisiones de **compra y producción de contenido**. Netflix decide en qué invertir con base en la demanda observada, no en la intuición del comprador de catálogo.

**Confianza:** `medium` — la cifra del 80 % es ampliamente citada en literatura académica y de industria; la de 1,000 mdd proviene de declaraciones de la empresa y no de un estado financiero auditado.

### 2.2 Amazon — recomendación y cadena de suministro

El caso canónico. La estimación más citada —originalmente de McKinsey (2013)— atribuye cerca del **35 % de las ventas de Amazon a su motor de recomendación** (as of 2026, glinden.blogspot.com/2006/12/35-of-sales-from-recommendations.html; marketingwithdave.com/case-study-amazons-recommendation-engine...). Amazon nunca ha confirmado oficialmente ese porcentaje, así que debe tratarse como estimación de industria, no como dato de la empresa.

Más sólido, y menos citado en clase, es el uso de BI en **logística**: previsión de demanda por SKU y por región para decidir qué inventario colocar en cuál centro de distribución antes de que exista la orden. Ahí el BI no vende más, sino que **baja el costo de servir**.

**Confianza:** `speculation` para el 35 %; `high` para el uso de analítica en previsión de demanda (es un hecho público y documentado en su arquitectura tecnológica).

### 2.3 Zara (Inditex) — el dato en el piso de venta

Zara es el contraejemplo útil: su ventaja no nació de una plataforma de BI, sino de un ciclo de retroalimentación cortísimo entre tienda y diseño. Los encargados de tienda reportan diariamente qué se vende, qué se prueba y no se compra, y qué piden los clientes que no existe; esa información llega al equipo de diseño en días, no en temporadas. El resultado es el que la literatura destaca: **reducción drástica del stock muerto** frente a competidores que planean colecciones con un año de anticipación (as of 2026, pontia.tech/5-casos-de-exito-de-empresas-que-utilizan-big-data/).

Lección para la materia: la arquitectura BI vale por la velocidad del circuito de decisión, no por el tamaño del almacén de datos.

**Confianza:** `medium`.

### 2.4 Grupo Bimbo — caso mexicano documentado

El más útil para un contexto nacional. Grupo Bimbo rediseñó el análisis de datos de su área comercial sobre una arquitectura de nube: ingesta y orquestación con **Azure Data Factory**, transformación con **Azure Databricks**, almacenamiento y modelo semántico en **Azure Synapse Analytics**, y visualización en **Power BI**. La aplicación de negocio se llama *Route to Market* y entrega métricas de canal de venta a distintos detallistas para seguimiento (as of 2026, news.microsoft.com/es-es/2022/11/02/grupo-bimbo-transforma-el-analisis-de-datos-de-su-area-comercial-gracias-a-las-soluciones-de-microsoft/).

Este caso es el que mejor mapea con lo que pide el proyecto integrador de la materia, porque **muestra la arquitectura completa por capas**: fuente → ETL → almacén → capa semántica → visualización. Es exactamente el diagrama que hay que saber dibujar.

**Confianza:** `high` — caso publicado por el proveedor con nombres de producto y descripción de arquitectura.

### 2.5 Coca-Cola FEMSA — analítica en operación de distribución

Coca-Cola FEMSA declara el uso de **Power BI y SQL** como herramientas de gestión de datos e inteligencia de negocios, con incorporación creciente de IA para acelerar la generación de casos de uso analíticos (as of 2026, dplnews.com/lecciones-de-bimbo-coca-cola-femsa-y-bineo-data-e-ia/). El valor está en la ruta: miles de puntos de venta, decisiones diarias de reposición, y un margen que depende de acertar cuánto producto baja de cada camión.

**Confianza:** `medium` — declaraciones en foro de industria, sin métricas públicas de resultado.

### 2.6 Starbucks — el programa de lealtad como fuente de datos

Starbucks usa los datos transaccionales de su programa de lealtad y su app para personalizar ofertas y promociones a nivel individuo, y para decidir ubicación de nuevas tiendas cruzando datos demográficos, de tráfico y de desempeño de sucursales existentes (as of 2026, ikusi.com/mx/blog/empresas-que-utilizan-business-intelligence/).

**Confianza:** `medium`.

---

## 3. Ventajas de la inteligencia de negocios

Extraídas de los casos anteriores, no de una lista genérica:

1. **Decisiones basadas en evidencia, no en opinión.** El cambio de fondo: se sustituye la discusión de quién tiene más antigüedad por la de qué dice el dato. En Zara esto es literal — el diseño obedece a la venta observada.
2. **Una sola versión de la verdad.** Al consolidar fuentes dispersas (ERP, punto de venta, CRM, web) en un almacén con capa semántica, la organización deja de discutir *qué número es el correcto* y pasa a discutir *qué hacer con él*. En el caso Bimbo esa capa semántica es un componente explícito de la arquitectura.
3. **Reducción del tiempo de ciclo de la decisión.** Un tablero de autoservicio elimina la dependencia del área de sistemas para responder preguntas rutinarias. El analista deja de producir reportes y empieza a producir hallazgos.
4. **Detección temprana de desviaciones.** Indicadores con umbrales y alertas convierten el reporte mensual en monitoreo continuo: el problema se ve cuando aún es barato corregirlo.
5. **Personalización a escala.** Netflix y Amazon son la demostración: BI permite tratar a millones de clientes de forma distinta sin costo marginal humano.
6. **Optimización de inventario y de costo de servir.** Previsión de demanda → menos stock muerto, menos faltantes, menos capital inmovilizado.
7. **Rendición de cuentas medible.** Con indicadores definidos, cada área tiene un número que la representa y una línea base contra la cual comparar.
8. **Habilitación de la analítica avanzada.** Un BI bien montado es el prerrequisito de cualquier proyecto de ciencia de datos o IA: sin datos limpios, integrados e históricos, no hay modelo que entrenar.

### 3.1 Ventajas expresadas en números (con reserva)

Los agregadores de estadísticas de industria reportan, entre otras cifras:

| Indicador reportado | Valor | Fuente |
|---|---|---|
| Mercado global de BI y analítica hacia 2026 | ≈ 55.5 mil millones USD (CAGR 10.1 %) | scoop.market.us/business-intelligence-statistics/ |
| Empresas globales con al menos una plataforma BI/analítica | > 78 % (2025) | scoop.market.us/business-intelligence-statistics/ |
| ROI promedio reportado en implementaciones BI | ≈ 112 %, periodo de recuperación ≈ 1.6 años | insightmarkresearch.com/insights/business-intelligence-statistics-key-facts-adoption-roi-trends |
| Organizaciones que califican BI como crítico o muy importante | 94 % | zipdo.co/business-intelligence-statistics/ |

**Advertencia metodológica (importante):** estas cifras circulan entre sitios agregadores que se citan entre sí y rara vez enlazan al estudio original. Sirven para dimensionar el fenómeno, **no como evidencia**. Confianza: `speculation`. Si la profesora pide fuente primaria, hay que ir a los reportes de Gartner, IDC o Forrester directamente.

---

## 4. Impacto de la inteligencia de negocios

El impacto se distingue de la ventaja: la ventaja es lo que la herramienta ofrece; el impacto es lo que cambia en la organización cuando se adopta. Se manifiesta en cuatro planos.

### 4.1 Impacto financiero
- Incremento de ingreso por personalización y venta cruzada (Netflix, Amazon).
- Reducción de costo operativo por optimización de inventario, ruta y capacidad instalada (Zara, Coca-Cola FEMSA).
- Mejor asignación de presupuesto de marketing: se sostiene el gasto que se puede atribuir a resultado y se corta el que no. Este es el impacto que la materia persigue explícitamente, porque el objetivo declarado de la asignatura es un modelo de análisis **para la toma de decisiones de marketing**.

### 4.2 Impacto operativo
- Sustitución del reporte manual por el tablero: horas de trabajo de captura y consolidación que se liberan.
- Estandarización de definiciones: qué cuenta como "cliente activo", qué cuenta como "venta". Suena burocrático y es donde se caen la mitad de los proyectos BI.
- Ciclos de planeación más cortos: de trimestral a semanal o diario.

### 4.3 Impacto organizacional y cultural
El más lento y el más determinante. BI redistribuye poder: quien controlaba la información deja de tener esa palanca cuando el dato es de autoservicio. Los efectos observables:
- Aparecen roles nuevos (analista de BI, ingeniero de datos, *data steward*).
- Se vuelve exigible la **alfabetización de datos**: un tablero que nadie sabe leer no cambia ninguna decisión.
- Cambia el criterio de discusión en juntas — de anécdota a indicador.

**Riesgo del plano cultural:** si la organización no acompaña la herramienta con gobernanza y capacitación, el resultado típico es la proliferación de tableros contradictorios; es decir, se reproduce en digital el problema que se quería resolver.

### 4.4 Impacto estratégico
- El dato se vuelve **activo**: se inventaría, se gobierna y se valúa.
- Habilita nuevos modelos de negocio (monetización de datos, servicios predictivos, precios dinámicos).
- Reduce la asimetría frente al competidor que decide más rápido.

### 4.5 Impacto negativo y limitaciones (lo que casi nunca aparece en la lista)
Un tratamiento honesto tiene que incluir el costo:
- **Calidad del dato** — reportada como el principal obstáculo en iniciativas de datos (≈ 40 %), seguida de integración (≈ 39 %) y seguridad/privacidad (≈ 34 %) (as of 2026, zipdo.co/business-intelligence-statistics/; confianza `speculation`). Basura entra, basura sale, pero ahora con gráfica bonita y aire de autoridad.
- **Costo y tiempo de implementación** — licencias, infraestructura y, sobre todo, el trabajo de integración, que suele ser la mayor parte del proyecto.
- **Privacidad y cumplimiento** — en México aplica la Ley Federal de Protección de Datos Personales en Posesión de los Particulares; personalizar implica tratar datos personales y eso tiene régimen legal.
- **Parálisis por análisis** — más tableros no es más decisión.
- **Sesgo histórico** — un modelo entrenado con el pasado tiende a reproducirlo; si la empresa atendió mal a un segmento, el modelo aprenderá a seguir ignorándolo.

---

## 5. Capacidades de la inteligencia de negocios

Las capacidades son lo que un sistema BI *puede hacer*. Se ordenan por madurez creciente, siguiendo el modelo analítico estándar:

| Nivel | Pregunta que responde | Capacidad | Ejemplo |
|---|---|---|---|
| **Descriptiva** | ¿Qué pasó? | Reportes, tableros, KPIs, consolidación histórica | Venta por región del mes pasado |
| **Diagnóstica** | ¿Por qué pasó? | Desglose (*drill-down*), correlación, análisis de causa | La caída viene de un canal y una SKU específicos |
| **Predictiva** | ¿Qué va a pasar? | Modelado predictivo, minería de datos, pronóstico | Demanda esperada por tienda la próxima semana |
| **Prescriptiva** | ¿Qué debo hacer? | Optimización, simulación, recomendación automatizada | Cuánto producto cargar en cada camión |

### 5.1 Capacidades técnicas por capa de arquitectura

Estas son las que hay que saber nombrar para el proyecto integrador:

1. **Integración de datos (ETL/ELT).** Extraer de fuentes heterogéneas, limpiar, transformar y cargar. Es la capa donde se consume la mayor parte del esfuerzo real del proyecto.
2. **Almacenamiento analítico.** *Data warehouse* (estructurado, esquema definido), *data lake* (crudo, esquema al leer) o *lakehouse* (híbrido). En el caso Bimbo: Azure Synapse.
3. **Modelado semántico.** Traducir tablas a conceptos de negocio ("venta neta", "cliente activo") para que el usuario no necesite SQL. Es lo que hace que el autoservicio funcione.
4. **Visualización y tableros.** Power BI, Tableau, Looker, Qlik. Es la punta del iceberg, y por eso la que se confunde con "el BI".
5. **Consulta ad hoc y autoservicio.** Que un usuario de negocio pueda armar su propia vista sin ticket a sistemas.
6. **Minería de datos y modelado predictivo.** Segmentación, clasificación, reglas de asociación, pronóstico de series de tiempo.
7. **Alertas y monitoreo por excepción.** El sistema avisa cuando un indicador se sale de rango, en lugar de esperar a que alguien abra el reporte.
8. **Gobierno de datos y seguridad.** Catálogo, linaje, control de acceso por rol, seguridad a nivel de fila. Sin esto, el autoservicio se vuelve fuga de información.
9. **Analítica en tiempo real / *streaming*.** Para decisiones que no aguantan el lote nocturno.
10. **Analítica aumentada.** Generación de explicaciones e insights asistida por IA y consulta en lenguaje natural sobre el modelo semántico — la frontera actual de las plataformas (as of 2026, improvado.io/blog/business-intelligence-trends).

---

## 6. Conclusiones

1. La inteligencia de negocios no compite con el criterio del directivo: lo **arma**. Lo que cambia es que la discusión parte de un hecho compartido.
2. Las ventajas más citadas (personalización, previsión) son visibles; las decisivas son invisibles: una sola versión de la verdad y un ciclo de decisión más corto.
3. El impacto real es organizacional antes que tecnológico. La herramienta se compra en semanas; la cultura de datos tarda años.
4. Las capacidades escalan por madurez: nadie llega a lo prescriptivo si no resolvió primero la calidad de sus datos descriptivos. Intentar saltarse la escalera es el error más caro.
5. Para el proyecto integrador de la materia, el caso de **Grupo Bimbo** es el modelo a imitar en la exposición, porque expone la arquitectura por capas completa y es contexto mexicano.

---

## 7. Referencias

- Microsoft News Center. *Grupo Bimbo transforma el análisis de datos de su área comercial, gracias a las soluciones de Microsoft*. https://news.microsoft.com/es-es/2022/11/02/grupo-bimbo-transforma-el-analisis-de-datos-de-su-area-comercial-gracias-a-las-soluciones-de-microsoft/ (consultado 2026-09-03)
- DPL News. *Lecciones de Bimbo, Coca-Cola Femsa y bineo sobre data e IA*. https://dplnews.com/lecciones-de-bimbo-coca-cola-femsa-y-bineo-data-e-ia/ (consultado 2026-09-03)
- USC Viterbi, Illumin Magazine. *Netflix's Recommendation Systems: Entertainment Made for You*. https://illumin.usc.edu/netflixs-recommendation-systems-entertainment-made-for-you/ (consultado 2026-09-03)
- Linden, G. *Geeking with Greg: 35% of sales from recommendations*. http://glinden.blogspot.com/2006/12/35-of-sales-from-recommendations.html (consultado 2026-09-03)
- Pontia Tech. *5 casos de éxito de empresas que utilizan Big Data*. https://www.pontia.tech/5-casos-de-exito-de-empresas-que-utilizan-big-data/ (consultado 2026-09-03)
- Ikusi. *Empresas que utilizan Business Intelligence: casos de éxito*. https://www.ikusi.com/mx/blog/empresas-que-utilizan-business-intelligence/ (consultado 2026-09-03)
- Market.us Scoop. *Business Intelligence Statistics By Technology, Growth, Management (2026)*. https://scoop.market.us/business-intelligence-statistics/ (consultado 2026-09-03)
- InsightMark Research. *Business Intelligence Statistics: Key Facts, Adoption, ROI & Trends*. https://insightmarkresearch.com/insights/business-intelligence-statistics-key-facts-adoption-roi-trends (consultado 2026-09-03)
- Zipdo. *Business Intelligence Statistics | 2026 Edition*. https://zipdo.co/business-intelligence-statistics/ (consultado 2026-09-03)
- Improvado. *9 Business Intelligence Trends 2026: Implementation Guide*. https://improvado.io/blog/business-intelligence-trends (consultado 2026-09-03)
- Moreno Delgado, Y. A. *Fundamentos.pptx* [material de clase]. UTCH, Moodle, curso 10M Inteligencia de Negocios, 2026.

---

Relacionado: [[11-ESCUELA/10-cuatrimestre/inteligencia-de-negocios/_moc-inteligencia-de-negocios|Inteligencia de Negocios]] · [[11-ESCUELA/10-cuatrimestre/inteligencia-de-negocios/materiales/fundamentos-de-bi|Fundamentos de BI]] · [[yadhira-moreno]] · [[utch]] · [[01-YOU/identity|Fora]] · [[08-KNOWLEDGE/2026-utch-bigdata-propuesta-bowi|Propuesta Big Data Bowí]]
