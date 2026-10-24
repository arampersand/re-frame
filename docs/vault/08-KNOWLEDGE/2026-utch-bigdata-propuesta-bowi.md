---
type: knowledge
status: entregable
date: 2026-08-18
last-updated: 2026-08-18
tags: [knowledge, utch, big-data, analitica-de-datos, transporte, chihuahua, escuela]
ai-first: true
---

## For future Claude

Trabajo académico de [[01-YOU/identity|Fora]] para la materia **Analítica de Datos para Negocios Digitales** (UTCH, ago-2026). Es una propuesta conceptual de Big Data sobre el sistema de transporte público **Bowí** de Chihuahua, evaluando las 5 Vs y proponiendo un stack por etapa del ciclo de vida del dato. Las cifras de contexto de Bowí están citadas con fuente y fecha; las estimaciones de volumen son cálculos propios con supuestos declarados explícitamente (no son datos oficiales del operador). Si alguien retoma esto, revalidar las cifras de prensa antes de reusarlas.

---

# Propuesta conceptual de Big Data — Sistema de Transporte Ecológico Bowí (Chihuahua)

**Materia:** Analítica de Datos para Negocios Digitales
**Alumno:** Ángel Iván López Delgado
**Fecha:** 18 de agosto de 2026
**Organización analizada:** Sistema de Transporte Ecológico Bowí — Chihuahua, Chih., México

---

## 1. Caso de estudio

### 1.1 Contexto de la organización

Bowí es el sistema de transporte público masivo de la ciudad de Chihuahua, operado por el Gobierno del Estado de Chihuahua a través de la Dirección de Transporte y de la paraestatal *Operadora de Transporte ViveBús Chihuahua, S.A. de C.V.* El sistema arrancó operaciones como ViveBús el **24 de agosto de 2013** bajo un esquema BRT (*Bus Rapid Transit*) y fue rebautizado como Bowí durante el proceso de modernización más reciente (as of 2026-08, es.wikipedia.org/wiki/Bowí).

La estructura operativa es **híbrida y fragmentada**, y ese detalle es central para todo lo que sigue:

- **Red troncal:** corredores BRT con carril confinado, estaciones cerradas y prepago. La troncal principal conecta Centro Histórico, Quinta Gameros, Plaza de Armas, Campus UACH II y las terminales Norte y Sur (as of 2026, tiempo.com.mx).
- **Red alimentadora:** **66 rutas** operadas por **12 empresas concesionarias** afiliadas a los sindicatos CTM y CATEM (as of 2026-08, es.wikipedia.org/wiki/Bowí). Es decir: el operador estatal **no** controla directamente la mayor parte de la flota que alimenta su propio sistema.
- **Flota troncal:** 84 autobuses en la línea principal, incluyendo unidades ANKAI a gas natural (as of 2026-08, es.wikipedia.org/wiki/Bowí). En la modernización reciente se sustituyeron **100 unidades** con más de una década —y hasta 30 años— de antigüedad por vehículos modelo 2024 en las rutas 1A-Exprés, Universitaria y Oriente–Poniente, más la adquisición de **40 unidades Mercedes-Benz modelo 2026** con piso táctil y apoyo auditivo para personas con discapacidad (as of 2026, chihuahua.gob.mx/prensa).
- **Horario:** primera salida 05:30, última salida 21:40 (as of 2026, tiempo.com.mx). Ventana operativa ≈ **16 horas diarias**.
- **Canal digital:** la app **BusCUU** (lanzada en febrero de 2018) publica ubicación de estaciones, información de rutas, frecuencias y horarios (as of 2026-08, es.wikipedia.org/wiki/Bowí).
- **Tarifa:** troncal $10 general / $5 preferencial; alimentadoras $12 general / $6 preferencial (as of 2026-08, es.wikipedia.org/wiki/Bowí).

### 1.2 El dato que dispara este trabajo

Al buscar la cifra de demanda del sistema aparecen **dos números oficiales que no coinciden**:

| Cifra reportada | Alcance declarado | Fuente |
|---|---|---|
| ~30,000 pasajeros diarios promedio | Sistema | chihuahua.gob.mx / prensa estatal (2026) |
| 59,581 viajes diarios promedio mensual | Tres rutas troncales BRT | chihuahua.gob.mx / prensa estatal (2026) |

La diferencia puede explicarse por definiciones distintas (*pasajero* vs. *viaje*, es decir, si un transbordo alimentadora→troncal cuenta una o dos veces) o por ventanas de medición distintas. Pero el hecho de que la organización no pueda responder de forma unívoca **"¿cuánta gente mueve Bowí hoy?"** es exactamente el síntoma de un problema de datos, no de transporte. Ese es el punto de partida de esta propuesta.

**Nivel de confianza de las cifras de esta sección:** `stated` (reportadas por fuentes públicas, no auditadas por el autor).

---

## 2. Problemática

### 2.1 El problema de negocio

Bowí opera hoy con **decisiones basadas en promedios mensuales y en quejas ciudadanas**, no en evidencia granular. Las manifestaciones concretas del problema:

1. **No sabe dónde está su propia flota en tiempo real de forma confiable.** Sin un estado consolidado de posición y ocupación, no se puede gestionar el *headway* (intervalo entre unidades). El resultado observable es el **bus bunching**: tres camiones llegan pegados y luego 25 minutos de nada.
2. **No conoce la matriz Origen-Destino real.** Las validaciones registran dónde sube el usuario, pero no dónde baja ni cómo transborda. Sin OD real, el rediseño de las 66 rutas alimentadoras se hace por negociación política con las 12 concesionarias, no por demanda medida.
3. **No puede cuantificar la evasión ni conciliar ingresos** con 12 operadores privados que reportan sus propias cifras.
4. **Mantenimiento reactivo.** Las unidades se reparan cuando se varan. Cada varada en hora pico degrada el servicio de todo el corredor.
5. **La voz del usuario está fuera del sistema.** Las quejas viven en Facebook, X, WhatsApp y llamadas al call center; jamás se cruzan con la unidad, la ruta y la hora en que ocurrió el incidente.
6. **Video de seguridad sin explotar.** Las cámaras a bordo graban, pero el material solo se revisa manualmente cuando ya hubo un incidente denunciado.

### 2.2 Por qué las bases de datos relacionales tradicionales no lo resuelven

No es un capricho tecnológico. Un RDBMS clásico (PostgreSQL, SQL Server, Oracle en un servidor monolítico) falla aquí por **cinco razones estructurales**:

**a) Tasa de escritura sostenida.** La telemetría GPS+CAN de la flota genera un flujo continuo de cientos de inserciones por segundo, 16 horas al día, 365 días al año. Un RDBMS transaccional puede sostenerlo un rato, pero cada `INSERT` paga el costo de índices B-tree, WAL y garantías ACID que **la telemetría no necesita** (a nadie le importa si se pierde un ping de GPS de hace tres segundos). Se está pagando consistencia fuerte por datos que solo requieren durabilidad eventual.

**b) Datos no estructurados que no caben en una tabla.** El video de las cámaras a bordo es el 99% del volumen. Guardarlo como `BLOB` en la base relacional destruye el rendimiento del resto del sistema; guardarlo fuera con una ruta en una columna significa que la base ya no es la fuente de verdad, y entonces el modelo relacional no está resolviendo el problema, solo lo está indexando.

**c) Esquema rígido contra fuentes que cambian solas.** GTFS-Realtime evoluciona, cada proveedor de GPS manda un payload distinto, las APIs de clima y tráfico cambian de contrato sin avisar, y cada una de las 12 concesionarias entrega su información en un formato diferente. En un RDBMS cada cambio de estructura es un `ALTER TABLE` sobre una tabla de miles de millones de filas — una ventana de mantenimiento, no un martes cualquiera. Se necesita **schema-on-read**, no schema-on-write.

**d) Cargas analíticas contra cargas operativas en el mismo motor.** Consultar "el tiempo de recorrido promedio por segmento, por hora del día, por día de la semana, de los últimos 24 meses" es un escaneo de miles de millones de registros. Ejecutarlo en la misma instancia que atiende las validaciones de pago degrada el servicio en vivo. El almacenamiento por filas del RDBMS es lo peor posible para agregaciones sobre pocas columnas; ahí gana el **almacenamiento columnar**.

**e) El escalamiento vertical tiene techo y precio.** La única salida de un RDBMS monolítico es comprar un servidor más grande. Es caro, tiene límite físico y no da tolerancia a fallos. El enfoque Big Data escala **horizontalmente** con nodos commodity y replicación.

> **Aclaración importante:** esto no significa "matar el RDBMS". La base relacional **se queda** para lo que es buena: catálogo de rutas y paradas, padrón de operadores, contratos con concesionarias, conciliación financiera. El punto es que **no puede ser el único almacén**, porque el 95% de los datos valiosos de Bowí no son transaccionales.

---

## 3. Justificación de Big Data — evaluación de las 5 Vs

### Supuestos de cálculo (declarados explícitamente)

Las cifras oficiales no incluyen tamaño total de flota ni instrumentación. Para poder estimar se asumen los siguientes parámetros, todos conservadores y verificables/ajustables:

| Parámetro | Valor asumido | Base del supuesto |
|---|---|---|
| Flota total instrumentada | 500 unidades | 84 troncales confirmadas + estimación de las 66 rutas alimentadoras a ~6 unidades por ruta |
| Ventana operativa diaria | 16 h | Derivada del horario 05:30–21:40 |
| Frecuencia de ping GPS/telemetría | 1 Hz (1 por segundo) | Estándar en AVL de transporte público |
| Tamaño de evento de telemetría | ~250 bytes (JSON crudo) | Lat, lon, velocidad, rumbo, timestamp, ID unidad, ID ruta, 8–10 señales CAN |
| Cámaras a bordo | 2 por unidad, H.264 @ 1 Mbps | Configuración típica de CCTV vehicular |
| Validaciones de pago | 60,000 / día | Punto medio entre las dos cifras oficiales en conflicto |

**Nivel de confianza:** `medium` — son estimaciones de ingeniería, no datos del operador.

---

### 3.1 Volumen — estimación del flujo y acumulación

**Telemetría de flota (GPS + CAN bus)**

```
500 unidades × 3,600 pings/hora × 16 horas   = 28,800,000 eventos/día
28,800,000 eventos × 250 bytes               ≈ 7.2 GB/día (crudo)
7.2 GB × 365 días                            ≈ 2.6 TB/año (crudo)
```

Comprimido en formato columnar (Parquet + Snappy, factor típico 5–8×) baja a **≈ 350–500 GB/año**, que es el histórico realmente consultable.

**Video CCTV a bordo**

```
1 Mbps = 0.125 MB/s
0.125 MB/s × 57,600 s (16 h)                 = 7.2 GB/cámara/día
7.2 GB × 2 cámaras × 500 unidades            ≈ 7.2 TB/día
```

Con una política de retención de 7 días en almacenamiento caliente: **≈ 50 TB activos permanentemente**. Este solo componente hace inviable cualquier arquitectura de servidor único.

**Datos transaccionales y de contexto**

```
60,000 validaciones/día × 300 bytes           ≈ 18 MB/día  (≈ 6.6 GB/año)
Logs de app BusCUU, clima, tráfico, redes     ≈ 1–2 GB/día
```

**Resumen de volumen**

| Fuente | Volumen diario | Acumulación anual | Naturaleza |
|---|---|---|---|
| Video CCTV | ~7.2 TB | 50 TB (retención 7 días) | No estructurado |
| Telemetría GPS/CAN | ~7.2 GB | ~2.6 TB crudo / ~0.5 TB comprimido | Semiestructurado |
| Contexto externo + logs | ~1.5 GB | ~550 GB | Semiestructurado |
| Validaciones de pago | ~18 MB | ~6.6 GB | Estructurado |
| **Total** | **≈ 7.2 TB/día** | **decenas de TB activos** | Mixto |

**Conclusión de la V:** el volumen califica, pero el argumento fuerte no es el tamaño bruto — es que **el 99.9% del volumen es no estructurado y el 0.1% restante es el que hoy toma las decisiones**. Esa desproporción es la definición operativa del problema.

---

### 3.2 Velocidad — frecuencia de generación e ingesta

Bowí necesita **las tres modalidades simultáneamente**, no una:

**Streaming en tiempo real (latencia objetivo < 3 s)**

```
28,800,000 eventos ÷ 57,600 s de operación   ≈ 500 eventos/segundo (promedio)
Pico en hora punta (~1.8× el promedio)       ≈ 900 eventos/segundo
```

Casos de uso que **solo** funcionan en esta ventana: ETA en vivo para el usuario en BusCUU, detección de *bunching* en curso, alerta de unidad detenida fuera de parada, botón de pánico del operador, y desvío dinámico ante un bloqueo vial.

**Near real-time (micro-batch, latencia de segundos a minutos)**

Validaciones de pago consolidadas por estación, ocupación estimada por unidad, tablero operativo del centro de control. Aquí una latencia de 1–5 minutos es aceptable y abarata mucho la arquitectura.

**Batch (horario / diario / mensual)**

Reconstrucción de la matriz Origen-Destino, reentrenamiento de modelos de demanda, conciliación de ingresos con las 12 concesionarias, reportes de indicadores para la Secretaría, análisis histórico de puntualidad por segmento.

**Por qué esto rompe el modelo tradicional:** un RDBMS sirve para *consultar* estado, no para *reaccionar* a un flujo. Detectar que dos unidades de la troncal están a menos de 200 metros una de otra requiere **procesamiento de eventos complejos sobre ventanas deslizantes** — un patrón que en SQL sobre tabla se traduce en polling cada N segundos, que es caro, tardío y no escala.

---

### 3.3 Variedad — tipos de datos involucrados

**Estructurados (~1% del volumen, 100% del uso actual)**
- Validaciones de pago: `timestamp`, `id_tarjeta`, `id_unidad`, `id_estación`, `tarifa`, `tipo_usuario`
- Catálogo GTFS estático: rutas, paradas, itinerarios, calendarios de servicio
- Padrón de operadores, roles y asignación de turnos
- Órdenes de mantenimiento e inventario de refacciones
- Contratos y esquemas de pago con las 12 empresas concesionarias

**Semiestructurados (~0.1%)**
- Telemetría GPS en JSON o Protobuf (un esquema distinto por proveedor de dispositivo)
- **GTFS-Realtime** (Protocol Buffers): `VehiclePosition`, `TripUpdate`, `ServiceAlert`
- Señales de CAN bus: RPM, temperatura de motor, presión de aceite, nivel de combustible/gas, eventos de apertura de puertas, frenadas bruscas
- Logs de la app BusCUU: búsquedas, rutas consultadas, sesiones, crashes
- APIs externas: clima (CONAGUA), tráfico, calendario escolar y de eventos masivos

**No estructurados (~99.9%)**
- **Video** de cámaras a bordo y de estaciones
- **Audio** del sistema de comunicación con operadores
- **Texto libre:** quejas en Facebook y X, mensajes de WhatsApp al canal de atención, transcripciones del call center, reportes de incidente redactados por supervisores
- **Imágenes:** fotos de daños en unidades, evidencia fotográfica de incidentes
- **Documentos:** PDFs de actas, dictámenes técnicos, convenios con concesionarias

**El argumento decisivo:** el valor no está en ninguna de estas fuentes por separado — está en **cruzarlas**. La pregunta "¿por qué se dispararon las quejas de la ruta Oriente–Poniente el martes?" solo se responde uniendo texto de redes sociales + telemetría GPS + validaciones + clima + un evento masivo en el calendario de la ciudad. Ningún esquema relacional predefinido puede anticipar esa consulta. Eso exige un **data lake con schema-on-read**.

---

### 3.4 Veracidad — retos de calidad y confiabilidad

Esta es la V más subestimada y, en el caso de Bowí, la más crítica. Retos concretos identificados:

**a) La contradicción documentada.** 30,000 pasajeros/día contra 59,581 viajes/día en tres troncales. Sin un **diccionario de datos y una definición canónica** de *pasajero*, *viaje*, *abordaje* y *transbordo*, cualquier KPI construido encima hereda la ambigüedad. Esto se resuelve con gobernanza, no con tecnología.

**b) Deriva y pérdida de señal GPS.** Chihuahua tiene zonas de sombra (pasos a desnivel, cañadas, edificios del centro). El resultado son saltos de posición físicamente imposibles (unidad "teletransportada" 2 km en un segundo) y huecos de varios minutos. Se requieren reglas de plausibilidad física (velocidad máxima, aceleración máxima) y *map-matching* contra la geometría de la ruta.

**c) Dispositivos apagados o manipulados.** Con 12 concesionarias privadas operando las alimentadoras, existe un incentivo real para que el equipo de rastreo "falle" cuando conviene. Hay que medir **cobertura de telemetría por operador** como métrica de calidad de primera clase y meterla en el contrato.

**d) Relojes desincronizados.** Sin NTP forzado en cada dispositivo, los eventos llegan con timestamps desfasados y el ordenamiento temporal se rompe. Obliga a distinguir **event time** de **processing time** en el motor de streaming y a manejar eventos tardíos con *watermarks*.

**e) Duplicados por reintento.** Al recuperarse una conexión celular caída, el dispositivo reenvía su buffer. Sin claves de idempotencia (`id_dispositivo` + `timestamp_evento`), el conteo se infla.

**f) Sesgo de selección en el canal de quejas.** Las redes sociales sobre-representan a quien tiene smartphone, datos móviles y disposición a reclamar públicamente. El usuario cautivo de una alimentadora periférica —justo el más afectado— es el que menos aparece. Interpretar el sentimiento social como "la voz del usuario" sin corregir este sesgo produce políticas mal dirigidas.

**g) Evasión y subconteo estructural.** Cada pasajero que no valida es un registro que nunca existe. La demanda medida por validaciones es, por construcción, un **piso**, no la realidad. La corrección requiere una fuente independiente: conteo por visión computacional sobre el video, o sensores de conteo de puertas.

**h) Deriva del catálogo GTFS.** Cuando cambian las rutas alimentadoras, el GTFS estático suele actualizarse semanas después. Durante ese periodo, todo cálculo de desviación contra el itinerario planeado es basura silenciosa.

**Estrategia de mitigación:** validación automatizada en la ingesta (contratos de datos + *quarantine queue* para eventos que fallen), arquitectura **medallion** (Bronze = crudo inmutable, Silver = validado y conformado, Gold = agregados de negocio) y catálogo con linaje para que cada KPI sea rastreable hasta el evento crudo que lo originó.

---

### 3.5 Valor — beneficio directo y ventaja competitiva

Bowí es un servicio público: la "ventaja competitiva" se mide en **calidad de servicio, sostenibilidad financiera y legitimidad política**. Beneficios concretos, ordenados por relación impacto/esfuerzo:

**1. Gestión dinámica de intervalos (anti-bunching) — impacto alto, esfuerzo medio**
Detectar en vivo que dos unidades convergen y ordenar retención en estación o salto de paradas. La literatura de BRT reporta reducciones típicas de 15–25% en la variabilidad del tiempo de espera. Traducción para el usuario: *"ya sé cuándo pasa"*, que es lo que realmente define la percepción de calidad del transporte público.

**2. Asignación de flota por demanda real — impacto alto, esfuerzo medio**
Modelo predictivo de demanda por parada, hora y día usando histórico + clima + calendario escolar + eventos. Permite mover unidades a donde hace falta en lugar de correr una frecuencia plana. Mismo costo operativo, mayor cobertura efectiva.

**3. Mantenimiento predictivo desde CAN bus — impacto alto, esfuerzo medio**
Detectar degradación (temperatura, presión, patrones de frenado) antes de la falla. Menos varadas en hora pico, mayor vida útil de la flota nueva 2024/2026 — un activo que el Estado acaba de pagar y necesita proteger.

**4. Recuperación de ingresos por evasión — impacto alto, esfuerzo alto**
Conteo por visión computacional cruzado contra validaciones registradas, por unidad y por operador. Convierte una sospecha en una cifra defendible frente a las concesionarias.

**5. Rediseño de las 66 rutas alimentadoras con OD real — impacto muy alto, esfuerzo alto**
Inferir la matriz Origen-Destino a partir de validaciones encadenadas y telemetría permite rediseñar la red con evidencia. **Este es el mayor cambio estructural**: convierte una negociación política en una discusión técnica con datos sobre la mesa.

**6. Información confiable al ciudadano en BusCUU — impacto alto, esfuerzo bajo**
ETA real derivado de posición en vivo, no del horario teórico. Es el beneficio más visible y el más barato una vez que existe el pipeline de streaming.

**7. Transparencia y rendición de cuentas — impacto medio, esfuerzo bajo**
Publicar GTFS-Realtime abierto permite que Google Maps y Moovit integren Bowí sin desarrollo propio, y convierte los indicadores en un activo de legitimidad frente a la ciudadanía y el Congreso del Estado.

---

## 4. Arquitectura propuesta por etapa del ciclo de vida del dato

### 4.1 Vista general

```
   FUENTES            INGESTA           ALMACENAMIENTO      PROCESAMIENTO      CONSUMO
┌───────────┐      ┌───────────┐      ┌──────────────┐    ┌────────────┐   ┌──────────┐
│ GPS / CAN │─MQTT→│           │      │ Redis        │←───│  Flink     │──→│ Centro   │
│ 500 buses │      │           │──────│ (estado vivo)│    │ (streaming)│   │ control  │
├───────────┤      │  Apache   │      ├──────────────┤    ├────────────┤   ├──────────┤
│ Validac.  │─CDC─→│  Kafka    │──────│ Data Lake    │←───│  Spark     │──→│ BI /     │
│ (RDBMS)   │      │  (bus     │      │ MinIO/S3     │    │ (batch+ML) │   │ Superset │
├───────────┤      │  central) │      │ Parquet +    │    ├────────────┤   ├──────────┤
│ App BusCUU│─API─→│           │──────│ Iceberg      │←───│  dbt       │──→│ API GTFS │
├───────────┤      │           │      ├──────────────┤    │ (Gold)     │   │ Realtime │
│ Video CCTV│─────────────────────────│ Object store │    └────────────┘   ├──────────┤
├───────────┤      │           │      │ tier frío    │           ▲         │ Modelos  │
│ Clima/Redes│─NiFi→│           │──────│              │           │         │ ML       │
└───────────┘      └───────────┘      └──────────────┘    ┌────────────┐   └──────────┘
                         ▲                    ▲           │  Airflow   │
                         └────────────────────┴───────────│ (orquesta) │
                                                          └────────────┘
```

### 4.2 Etapa 1 — Ingesta y adquisición

| Herramienta | Función | Justificación |
|---|---|---|
| **MQTT (EMQX / Mosquitto)** | Protocolo de los dispositivos a bordo | Diseñado para redes móviles inestables y dispositivos con poco cómputo. Overhead mínimo por mensaje y QoS configurable — exactamente el escenario de una flota en movimiento con cobertura celular irregular. |
| **Apache Kafka** | Bus de eventos central | Desacopla productores de consumidores: el GPS publica una vez y lo consumen el tablero en vivo, el data lake y el detector de anomalías sin saber unos de otros. Retención configurable permite **reprocesar** el histórico si se corrige un bug en la lógica. Escala a millones de eventos/s. |
| **Debezium + Kafka Connect** | CDC desde el RDBMS de validaciones | Captura cambios del sistema transaccional **sin tocarlo ni consultarlo**. Elimina el ETL nocturno y sus ventanas de mantenimiento. |
| **Apache NiFi** | Ingesta de fuentes externas | Interfaz visual para pipelines de APIs de clima, tráfico y scraping de redes sociales. Su fortaleza es la **procedencia del dato**: rastrea cada archivo desde su origen, lo cual alimenta directamente la estrategia de Veracidad. |

### 4.3 Etapa 2 — Almacenamiento

| Herramienta | Función | Justificación |
|---|---|---|
| **MinIO / Amazon S3** | Data lake, capa base | Almacenamiento de objetos: barato, ilimitado horizontalmente, agnóstico al formato. Separa **cómputo de almacenamiento**, que es la diferencia económica clave contra el RDBMS. Con *lifecycle policies* el video pasa a tier frío automáticamente a los 7 días. |
| **Apache Parquet** | Formato de archivo | Columnar: una consulta de "velocidad promedio por ruta" lee solo 2 de 15 columnas. Compresión 5–8× frente a JSON crudo. |
| **Apache Iceberg** | Formato de tabla sobre el lake | Resuelve el punto débil de un lake plano: da transacciones ACID, **evolución de esquema sin reescribir datos** (el `ALTER TABLE` que el RDBMS no puede pagar) y *time travel* para auditar "qué decía el dato el 3 de marzo". |
| **ClickHouse** | Almacén analítico caliente | OLAP columnar para el tablero operativo y consultas ad-hoc sub-segundo sobre los últimos 90 días de telemetría. |
| **Redis** | Estado en vivo | Última posición conocida de cada unidad, en memoria. Latencia sub-milisegundo para el ETA de la app. Los datos son efímeros por naturaleza: no necesitan durabilidad. |
| **PostgreSQL + PostGIS** | Datos maestros y geometría | **Se conserva.** Catálogo GTFS, padrón de operadores, contratos, conciliación financiera. Aquí ACID sí importa y el volumen es pequeño. La propuesta no reemplaza el relacional: lo pone en su lugar. |

### 4.4 Etapa 3 — Procesamiento

| Herramienta | Función | Justificación |
|---|---|---|
| **Apache Flink** | Procesamiento de streaming | Streaming nativo (evento por evento) con latencia de milisegundos, frente al micro-batch de Spark Streaming. Su manejo de **event time y watermarks** resuelve directamente el reto de relojes desfasados y eventos tardíos de la sección 3.4. Su motor de **CEP** expresa reglas del tipo "dos unidades de la misma ruta a menos de 200 m durante más de 60 s" de forma declarativa. |
| **Apache Spark** | Procesamiento batch y ML | Reconstrucción de la matriz OD, ETL histórico, entrenamiento de modelos. Procesamiento distribuido en memoria sobre terabytes. |
| **dbt** | Transformación analítica | Modela la capa Gold en SQL versionado en Git, con pruebas y documentación automática. Hace las definiciones de negocio (¿qué es un *viaje*?) **explícitas, versionadas y auditables** — el antídoto directo contra la contradicción de las dos cifras oficiales. |
| **Great Expectations** | Validación de calidad | Aserciones automatizadas en cada etapa del pipeline (rangos de latitud/longitud válidos para Chihuahua, velocidad < 120 km/h, no nulos en campos clave). Lo que no pasa, va a cuarentena, no a producción. |
| **Apache Airflow** | Orquestación | DAGs con dependencias, reintentos y alertas para todos los procesos batch. Fuente única de verdad sobre qué corrió, cuándo y con qué resultado. |

### 4.5 Etapa 4 — Análisis y modelado

| Herramienta | Función | Justificación |
|---|---|---|
| **Spark MLlib / XGBoost** | Predicción de demanda | Regresión sobre features de histórico, clima, día de semana, calendario escolar y eventos. XGBoost es el estándar práctico para datos tabulares y da importancia de variables interpretable — necesario para justificar decisiones ante la autoridad. |
| **Prophet / LSTM** | Series de tiempo | Estacionalidad múltiple (hora del día, día de semana, periodo escolar) para proyección de demanda a mediano plazo. |
| **YOLO / OpenCV** | Visión computacional | Conteo de pasajeros sobre el video a bordo. Es la **fuente independiente** que corrige el subconteo por evasión y permite estimar ocupación real. |
| **spaCy / modelos de lenguaje** | Análisis de texto | Clasificación de quejas por tema (puntualidad, seguridad, trato, limpieza) y análisis de sentimiento, para georreferenciarlas contra ruta y hora. |
| **MLflow** | Gestión del ciclo de vida de modelos | Versionado de experimentos, métricas y modelos en producción. Sin esto, en seis meses nadie sabe qué modelo está corriendo ni con qué datos se entrenó. |

### 4.6 Etapa 5 — Visualización y consumo

| Herramienta | Función | Justificación |
|---|---|---|
| **Grafana** | Monitoreo operativo en vivo | Tablero del centro de control: posición de flota, alertas de bunching, unidades fuera de servicio. Diseñado para series de tiempo y alertamiento. |
| **Apache Superset** | BI analítico | Exploración autoservicio para planeación y dirección. Open source, conecta nativo a ClickHouse y al lake vía Trino. |
| **Kepler.gl / QGIS** | Analítica geoespacial | Visualización de la matriz OD, mapas de calor de demanda por parada, análisis de cobertura territorial. |
| **API GTFS-Realtime** | Consumo externo | Estándar de facto de transporte público. Alimenta BusCUU y habilita integración inmediata con Google Maps, Moovit y Transit sin desarrollo adicional. |

### 4.7 Etapa 6 — Gobernanza (transversal)

| Herramienta | Función | Justificación |
|---|---|---|
| **DataHub / Apache Atlas** | Catálogo y linaje | Diccionario de datos con definiciones canónicas y trazabilidad de cada métrica hasta su evento origen. Es la solución institucional a la contradicción de la sección 1.2. |
| **Apache Ranger / IAM** | Control de acceso | Permisos por rol y por columna. El analista de operación no debe ver el identificador de tarjeta de un usuario. |
| **Seudonimización en ingesta** | Protección de datos personales | El `id_tarjeta` se convierte en hash con sal en el momento de la ingesta: se conserva la capacidad de encadenar viajes del mismo usuario (necesaria para la matriz OD) sin conservar su identidad. El video con rostros identificables se rige por retención corta y acceso restringido, conforme a la LFPDPPP y a la normativa estatal de datos personales. |

---

## 5. Conclusión

El caso de Bowí califica para un enfoque de Big Data no por moda tecnológica, sino porque **las cinco Vs se cumplen simultáneamente y se refuerzan entre sí**: un volumen dominado por datos no estructurados (≈7.2 TB/día), una velocidad que exige reacción sub-segundo para la mitad de los casos de uso (≈500–900 eventos/s), una variedad donde el valor aparece justo en el cruce de fuentes heterogéneas, una veracidad tan comprometida que la organización reporta públicamente dos cifras incompatibles de su propia demanda, y un valor medible tanto en calidad de servicio como en ingresos recuperables y legitimidad institucional.

El aporte central de la propuesta no es la lista de herramientas — es el cambio de premisa. Hoy Bowí decide con **promedios mensuales negociados**; la arquitectura propuesta lo mueve a decidir con **evidencia granular trazable**. La base de datos relacional no desaparece: se le devuelve el rol que hace bien (datos maestros y transacciones financieras) y se le quita la responsabilidad que nunca pudo cumplir (ser el único almacén de un sistema ciberfísico que genera terabytes diarios de señal continua).

**Ruta de implementación sugerida (secuencia, no cronograma):** empezar por el pipeline de streaming GPS → Kafka → Flink → Redis, porque habilita el beneficio más visible y barato (ETA real en BusCUU) y construye la infraestructura sobre la que se montan después el data lake histórico, los modelos predictivos y, al final, la analítica de video —el componente más caro y el que requiere el marco de privacidad más maduro.

---

## Referencias

- Bowí — Wikipedia en español. https://es.wikipedia.org/wiki/Bow%C3%AD (consultado 2026-08-18)
- Portal Gubernamental del Estado de Chihuahua — "Transporte público es atendido por Gobierno del Estado después de 40 años en abandono". https://chihuahua.gob.mx/prensa/transporte-publico-es-atendido-por-gobierno-del-estado-despues-de-40-anos-en-abandono
- Portal Gubernamental del Estado de Chihuahua — "Informa Bowí servicio gratuito, desvío de rutas y horario extendido". https://chihuahua.gob.mx/prensa/anuncia-bowi-servicio-gratuito-desvio-de-rutas-y-horario-extendido-durante-el-grito-de
- Tiempo — "¿La conoces? Esta es la ruta troncal del Bowí". https://www.tiempo.com.mx/local/chihuahua_mapa_bowi_ruta_troncal_terminales_estaciones_horario/
- Tiempo — "Renovamos Bowí; ajustaremos alimentadoras: De la Peña". https://www.tiempo.com.mx/local/chihuahua-transporte-publico-santiago-de-la-pena-bowi-juarezbus/
- El Congresista — "Chihuahua impulsa mejoras en movilidad con nuevo sistema de transporte Bowí". https://elcongresista.mx/politica/chihuahua/chihuahua-mejora-movilidad-transporte-bowi
- GTFS Realtime Reference — Google / MobilityData. https://gtfs.org/realtime/reference/

---

**Notas relacionadas en el vault:** [[2026-hacking-etico-plan-estudio]] · [[01-YOU/identity]]
