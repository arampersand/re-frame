---
type: material
materia: gestion-de-proyectos-ii
formato: pdf
archivo-original: "Baca Urbina_ Gabriel - Evaluacion de Proyectos 6a ed pag 103 152.pdf"
date: 2026-09-21
last-updated: 2026-09-21
tags: [escuela, material, utch, gestion-de-proyectos, estudio-de-mercado, factibilidad, sima]
ai-first: true
---

## For future Claude

Análisis del **capítulo 2 "Estudio del mercado"** de *Evaluación de Proyectos*, 6ª ed., de Gabriel Baca Urbina (McGraw-Hill, 2010, ISBN 978-607-15-0260-5), leído a petición de [[Fora]] el 2026-09-21 para la materia de [[evelyn-hinojos]]. La pregunta que originó la nota: **qué herramienta permite decidir, a partir de un estudio de mercado, si el proyecto integrador es factible.** Respuesta: la **Demanda Potencial Insatisfecha (DPI)**.

La nota tiene dos mitades: (1) el método del libro con fórmulas y páginas verbatim, y (2) **la traducción del método a [[11-ESCUELA/10-cuatrimestre/proyecto-integrador|SIMA]]**, que es un B2B de universo finito y no un bien de consumo masivo — ahí el método de Baca no se aplica tal cual y esta nota dice exactamente dónde se rompe y cómo corregirlo.

Caveat de temporalidad: el libro es de 2010. Las fórmulas estadísticas no caducan, pero los ejemplos y el contexto macro sí.

# Material — Baca Urbina, cap. 2: Estudio del mercado

- **Archivo original:** `Baca Urbina_ Gabriel - Evaluacion de Proyectos 6a ed pag 103 152.pdf` (~10.7 MB)
- **Dónde estaba:** `~/Downloads/` (el archivo trae el **libro completo**, no solo las pp. 103-152 del nombre; el cap. 2 va de la pág. 11 a la 71)
- **Fuente:** Gabriel Baca Urbina, *Evaluación de Proyectos*, 6ª ed., McGraw-Hill/Interamericana, México, 2010
- **Por qué está aquí:** [[evelyn-hinojos]] lo mencionó en clase como la técnica para dictaminar factibilidad de mercado del [[11-ESCUELA/10-cuatrimestre/proyecto-integrador|proyecto integrador]]

---

## Parte 1 — El método del libro

### La herramienta: Demanda Potencial Insatisfecha (DPI)

Definición verbatim (p. 43):

> Es la cantidad de bienes o servicios que es probable que el mercado consuma en los años futuros, sobre la cual se ha determinado que ningún productor actual podrá satisfacer si prevalecen las condiciones en las cuales se hizo el cálculo.

```
DPI(año n) = Demanda proyectada(año n) − Oferta proyectada(año n)
```

Se calcula **año con año** sobre las dos curvas proyectadas, no sobre un solo dato.

### Objetivos del estudio de mercado (p. 12, verbatim)

- Ratificar la existencia de una **necesidad insatisfecha** en el mercado, o la posibilidad de brindar un mejor servicio que el que ofrecen los productos existentes.
- Determinar la **cantidad** de bienes o servicios que la comunidad estaría dispuesta a adquirir a determinados precios.
- Conocer cuáles son los **medios** para hacer llegar los bienes y servicios a los usuarios.
- Dar una idea al inversionista del **riesgo** de que su producto sea o no aceptado en el mercado.

### Estructura de análisis (fig. 2.1, p. 13)

Cuatro variables → una conclusión:

```
                 Análisis del mercado
   ┌──────────┬───────────┬───────────┬──────────────────┐
 oferta     demanda     precios     comercialización
   └──────────┴───────────┴───────────┴──────────────────┘
              Conclusiones del análisis
```

### Pasos de la investigación (p. 14)

1. Definición del problema
2. Necesidades y fuentes de información (primarias = encuesta; secundarias = estadística ya escrita)
3. Diseño, recopilación y tratamiento estadístico de los datos
4. Procesamiento y análisis
5. Informe — *"veraz, oportuno y no tendencioso"*

### Medir la demanda: Consumo Nacional Aparente (p. 15)

```
Demanda = CNA = producción nacional + importaciones − exportaciones
```

### Proyectar las curvas (pp. 17-24)

Series de tiempo. Cuatro patrones: tendencia secular, variación estacional, fluctuaciones cíclicas, movimientos irregulares. **La tendencia secular es la que aplica a oferta y demanda.**

| Método | Cuándo | Limitación |
|---|---|---|
| Gráfico | Solo intuición | No sirve para pronosticar |
| Medias móviles | Serie muy irregular | Pierde términos; **solo proyecta 1 periodo adelante** |
| **Mínimos cuadrados (regresión)** | El estándar del libro | Hay que validar el ajuste con el coeficiente de correlación |

### Fuentes primarias: muestreo y tamaño de muestra (pp. 27-28)

**Tipo de muestreo: no probabilístico.** Argumento del libro: en evaluación de proyectos siempre hay una **estratificación previa implícita** (solo encuestas a quien consume la categoría), así que el muestreo probabilístico *"queda fuera de aplicación"*.

Fórmula 2.24:

```
n = (σ² · Z²) / E²
```

- **σ** = desviación estándar del consumo, de una **prueba piloto de ≥30 personas** (teorema del límite central)
- **Z** = 1.96 al 95% de confianza
- **E** = error máximo permitido

Ejemplo del libro (champú): σ = 2.1 L, Z = 1.96, E = 0.4 → **n = 106**. Bajando E a 5% → **n = 6 776**. La precisión cuesta dinero y tiempo.

### Conclusión del estudio (pp. 52-53, verbatim)

> Por último, y en forma numérica, debe decirse cuál es la magnitud del mercado potencial que existe para el producto en **unidades/año**. La conclusión debe referirse a si se recomienda **continuar con el estudio** o si lo mejor es **detenerse** por falta de mercado o por cualquier otra causa.

### Las tres advertencias que el libro repite

1. **DPI grande ≠ mercado fácil** (p. 13): *"Una demanda insatisfecha clara y grande no siempre indica que pueda penetrarse con facilidad en ese mercado, ya que éste puede estar en manos de un monopolio u oligopolio."*
2. **Criterio real de rechazo** (p. 44): si no hay datos para separar oferta de demanda, *"un proyecto debería rechazarse sólo cuando en la curva de tendencia de la demanda la pendiente fuera cero o negativa"*. No poder calcular la DPI **no** significa que no exista.
3. **Primarias > secundarias** (p. 44): *"los datos obtenidos de fuentes primarias son más importantes que los obtenidos de fuentes secundarias, dados los problemas de confiabilidad de estos últimos"*.

### Cuando no hay estadísticas: terceros factores (p. 44)

El libro resuelve el caso más común con **indicadores proxy**: no hay datos de pigmentos → se analiza la venta de pinturas; no hay datos de grenetina → se analiza la venta de gelatina y papel fotográfico. Este es el mecanismo que salva a SIMA (ver abajo).

### Referencia del caso práctico (mermelada, tablas 2.15-2.16, p. 66)

DPI calculada en **dos escenarios**:

| Año | DPI optimista (ton) | DPI pesimista (ton) |
|---|---|---|
| 1 | 8 884 | 6 820 |
| 5 | 20 594 | 15 356 |

Conclusión del caso (p. 69): *"desde el punto de vista del mercado, el proyecto se presenta atractivo."* Ese es el formato de cierre que se espera.

---

## Parte 2 — Aterrizado a SIMA

Contexto del producto: [[11-ESCUELA/10-cuatrimestre/proyecto-integrador|SIMA]] — visión computacional (YOLO) sobre las cámaras existentes de la [[utch]], con re-identificación persistente, arquitectura BI, PWA y gemelo digital 3D con mapas de calor. Cliente piloto: UTCH. Mercado declarado: instituciones educativas y públicas.

### Paso 0 — Fijar la unidad de medida (nadie lo hace y sin esto nada cuadra)

Baca pide la conclusión en **unidades/año**. SIMA no se vende por piezas. Tres candidatas:

| Unidad | A favor | En contra |
|---|---|---|
| Plantel-licencia/año | Fácil de contar, el universo es un directorio público | No escala con el tamaño del cliente |
| **Cámara monitoreada/año** | **Refleja el costo real (cómputo por stream) y escala con el cliente** | Requiere estimar cámaras por plantel vía encuesta |
| Personas contadas/año | — | No es facturable; es una métrica de uso, no de mercado |

**Recomendación: cámara monitoreada/año como unidad primaria, planteles/año como unidad secundaria de conteo de clientes.** Fíjenla antes de buscar un solo dato, porque define qué estadística sirve y cuál no.

### Paso 1 — Demanda: el CNA no aplica, hay que traducirlo

`producción nacional + importaciones − exportaciones` está pensado para un bien físico comerciable. SIMA es software B2B de universo finito. La traducción honesta:

```
Demanda = (planteles del universo objetivo) × (cámaras promedio por plantel)
```

Fuentes secundarias reales y citables:

| Fuente | Qué saca |
|---|---|
| SEP — Formato 911 / Sistema Nacional de Información Estadística Educativa | Número de planteles por nivel y por estado, serie histórica |
| ANUIES — Anuario Estadístico de Educación Superior | Planteles y matrícula de educación superior |
| INEGI — Censo Nacional de Gobiernos (CNGE/CNGMD) | Inmuebles públicos, gasto estatal en seguridad |
| INEGI — DENUE | Integradores y proveedores de videovigilancia en Chihuahua (sirve para la **oferta**) |

Empiecen por Chihuahua como mercado inicial y México como mercado ampliado. Dos universos, dos DPI.

### Paso 2 — Terceros factores: aquí es donde SIMA se salva

**No existe estadística de "sistemas de medición de aforo instalados en instituciones educativas".** Cero. Eso no mata el estudio: es exactamente el caso de la p. 44. Proxies defendibles:

- **Matrícula por plantel** — más alumnos en la misma superficie = presión de aforo. Serie histórica disponible en SEP/ANUIES, tendencia claramente ascendente.
- **Gasto público estatal en seguridad y videovigilancia** — proxy de la infraestructura de cámaras ya instalada, que es el insumo de SIMA.
- **Planteles con infraestructura de red/CCTV** — el subconjunto real al que se le puede vender sin obra nueva.

El argumento de mercado de SIMA se vuelve: *las cámaras ya están instaladas y creciendo; lo que no existe es la capa de analítica sobre ellas.* Eso es una DPI, y es más fuerte que un número inventado.

### Paso 3 — Oferta

| Capa de competencia | Jugadores | Lectura |
|---|---|---|
| Fabricantes de CCTV con analítica embebida | Hikvision, Dahua, Axis | Oligopolio de marca; venden conteo básico, no re-ID ni gemelo digital |
| Plataformas VMS | Milestone y similares | Capa de gestión, analítica por plugin de terceros |
| People counting dedicado | Xovis, V-Count y similares | Enfocados a retail, no a campus; precio en USD |
| Integradores locales en Chihuahua | Vía DENUE | Instalan hardware; casi ninguno ofrece analítica propia |

**Lo que hay que demostrar no es que no exista competencia — sí existe — sino que la oferta efectivamente instalada en instituciones educativas públicas de Chihuahua es ≈ 0.** Ahí está la DPI. Dato duro a conseguir: cuántas de las IES del estado miden aforo hoy con algo que no sea conteo manual. Sale de la encuesta, no de una estadística.

### Paso 4 — Encuesta: dónde se rompe la fórmula de Baca (importante)

**La fórmula `n = σ²Z²/E²` asume población infinita.** El universo de SIMA no lo es: son decenas de instituciones en el estado, no millones de consumidores de champú. Si aplican la fórmula tal cual les va a salir un `n` mayor que el universo completo, y la maestra lo va a ver.

Corrección por población finita:

```
n_ajustada = n / (1 + (n − 1) / N)
```

donde `N` es el universo real de planteles. Con `N` chico (digamos 30-50 IES en Chihuahua), lo más probable es que lo correcto sea **censo o entrevistas a profundidad con todos**, no muestreo. **Justifíquenlo por escrito en el reporte en vez de esconderlo** — reconocer la limitación del método vale más que forzar la fórmula.

Qué medir en la encuesta (esto alimenta σ):

1. **Cámaras instaladas por plantel** → la σ de esta variable es la que entra a la fórmula, y × el universo da la demanda en cámaras-año
2. **¿Miden aforo hoy? ¿Cómo?** → separa oferta de demanda, que es el dato que no existe en ninguna estadística
3. **Disposición a pagar por cámara/año** → alimenta el análisis de precios (cap. 2, pp. 44-47) y luego el estudio económico
4. **Quién decide y quién firma** → en B2B público la unidad de decisión no es una persona; sin esto la comercialización (4ª variable de la fig. 2.1) queda hueca
5. **Aceptación de re-identificación persistente** → ver abajo, es la pregunta que más pesa

A quién: **no** a alumnos. A directores de plantel, jefes de servicios generales / infraestructura, responsables de TI y de seguridad institucional. La estratificación es exactamente lo que Baca describe: solo aplica el cuestionario quien puede opinar con propiedad.

### Paso 5 — El factor cualitativo que puede invertir el signo de la DPI

Baca (p. 44): *"es necesario analizar una serie de factores que existen en todo el mercado y que pesan aún más que el cálculo de un número llamado demanda insatisfecha."*

Para SIMA ese factor tiene nombre: **la re-identificación persistente**, decidida el 2026-09-13. Es el mayor diferenciador técnico frente a Hikvision/Axis **y** el mayor freno de compra en una institución pública mexicana (LGPDPPSO: consentimiento expreso, evaluación de impacto, padrón de enrolamiento).

El riesgo real: si la encuesta arroja que una mayoría de directivos no compraría un sistema con re-ID, entonces **la DPI del producto con re-ID es mucho menor que la del producto sin re-ID**, y el estudio de mercado estaría contradiciendo la decisión de alcance del proyecto. Dos salidas legítimas:

- **(a)** Calcular la DPI en las dos versiones del producto y presentar re-ID como módulo opcional / fase 2, lo cual es además una mejor historia comercial.
- **(b)** Sostener el re-ID y documentar en el estudio que el mercado inmediato se restringe a zonas restringidas con enrolamiento voluntario, lo cual encoge el universo pero no lo anula.

Lo que no se vale es no preguntarlo. Es el hallazgo más valioso que la encuesta puede producir.

### Paso 6 — Formato de entrega

Repliquen las tablas 2.15/2.16 con la unidad de SIMA:

| Año | Demanda proyectada (cámaras) | Oferta proyectada (cámaras) | **DPI optimista** | **DPI pesimista** |
|---|---|---|---|---|
| 1 | | | | |
| … | | | | |
| 5 | | | | |

Y cerrar con el párrafo de conclusión al estilo p. 69: magnitud del mercado potencial en cámaras-año y planteles/año, riesgos detectados, y la frase que decide — **continuar o detenerse**.

### Checklist contra el capítulo

- [ ] Unidad de medida fijada y justificada (cámara-año)
- [ ] Definición del producto SIMA con sus especificaciones
- [ ] Universo delimitado: Chihuahua y México, con `N` numérico
- [ ] Demanda histórica vía proxies (matrícula, gasto en videovigilancia) + fuente citada
- [ ] Proyección a 5 años por mínimos cuadrados, con coeficiente de correlación
- [ ] Oferta: mapa de competencia + evidencia de penetración ≈ 0 en el segmento
- [ ] Muestreo: `n` con corrección por población finita, o censo justificado
- [ ] Encuesta aplicada a tomadores de decisión, no a alumnos
- [ ] Pregunta de aceptación de re-ID incluida
- [ ] Tabla DPI optimista y pesimista, 5 años
- [ ] Análisis de precios (disposición a pagar)
- [ ] Análisis de comercialización (canal de venta a institución pública: licitación, adjudicación directa, convenio)
- [ ] Conclusión numérica + recomendación explícita

---

## Huecos abiertos

1. **¿Este entregable es de Gestión de Proyectos II o de Inteligencia de Negocios?** El estudio de mercado embona con el entregable *"interpretación de indicadores organizacionales y de marketing"* de [[11-ESCUELA/10-cuatrimestre/inteligencia-de-negocios/_moc-inteligencia-de-negocios|Inteligencia de Negocios]] tanto o más que con el temario de gestión híbrida de [[evelyn-hinojos]]. Confirmar con ambas profes antes de duplicar trabajo.
2. **`N` real del universo** — cuántas IES y planteles públicos hay en Chihuahua. Sin ese número no se puede dimensionar la muestra.
3. **Rúbrica / lista de cotejo del entregable** — sigue sin aparecer, como todo lo de esta materia.

Relacionado: [[11-ESCUELA/10-cuatrimestre/gestion-de-proyectos-ii/_moc-gestion-de-proyectos-ii|Gestión de Proyectos II]] · [[evelyn-hinojos]] · [[11-ESCUELA/10-cuatrimestre/proyecto-integrador|Proyecto integrador]] · [[11-ESCUELA/10-cuatrimestre/inteligencia-de-negocios/_moc-inteligencia-de-negocios|Inteligencia de Negocios]] · [[utch]] · [[Fora]]
