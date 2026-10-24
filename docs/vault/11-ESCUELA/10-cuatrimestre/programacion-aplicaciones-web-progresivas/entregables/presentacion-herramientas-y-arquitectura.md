---
type: entregable
materia: programacion-aplicaciones-web-progresivas
cuatrimestre: 10
status: insumo-listo
equipo: "Equipo 5"
date: 2026-09-11
last-updated: 2026-09-11
tags: [escuela, entregable, utch, pwa, presentacion, arquitectura, yolo, nextjs, proyecto-integrador]
ai-first: true
---

## For future Claude

Insumo para la **presentación de herramientas y arquitectura** que pide [[juan-carlos-bustamante]] en [[11-ESCUELA/10-cuatrimestre/programacion-aplicaciones-web-progresivas/_moc-programacion-aplicaciones-web-progresivas|PWA]]. El proyecto es el mismo [[11-ESCUELA/10-cuatrimestre/proyecto-integrador|proyecto integrador]] del Equipo 5 — esta materia solo aporta el componente PWA. Esta nota **no es la presentación**: es el contenido slide por slide más el prompt listo para pegarle a Claude Design y que él arme el deck. [[Fora]] hace el deck, no Claude Code.

**Conflicto de alcance sin resolver as of 2026-09-11:** la [[11-ESCUELA/10-cuatrimestre/integradora/entregables/propuesta-proyecto-integrador|propuesta de Integradora]] entregada el 2026-09-08 excluye explícitamente reconocimiento facial y re-identificación. Este documento asume lo contrario (re-ID persistente con cambio de ropa, para seguridad institucional). Antes de presentar hay que decidir cuál de los dos alcances es el verdadero y alinear el otro documento.

# Presentación — Herramientas, arquitectura y flujo · Proyecto integrador

- **Materia:** Programación de Aplicaciones Web Progresivas · [[juan-carlos-bustamante|Juan Carlos Bustamante Lozano]]
- **Proyecto:** [[11-ESCUELA/10-cuatrimestre/proyecto-integrador|proyecto integrador]] del Equipo 5 — [[Fora|Ángel Iván López Delgado]] · [[celeste|Celeste Guadalupe Ramos Gurrola]] · [[angel-cervantes|Ángel Esteban Cervantes Muñoz]]
- **Formato:** 8 slides, solo lo que pide la rúbrica
- **Rúbrica que hay que cubrir:** herramientas seleccionadas · arquitectura del software con patrón de diseño · patrón de programación · flujo del usuario

---

## 0. Premisa técnica que amarra todo el stack

La PWA **no procesa video**. El video lo procesa un backend de Python con GPU, corriendo aparte. La PWA es la ventana a ese backend: consume eventos, los muestra en vivo, alerta y permite consultar el histórico. Esa separación es la que justifica cada decisión de herramienta y es el argumento central del deck.

Dato técnico que vale un punto en la presentación: la re-identificación **por apariencia** (color de ropa, silueta) se rompe cuando la persona se cambia de ropa. Para que el sistema reconozca a alguien días después se necesita un **embedding facial** — un vector numérico de ~512 dimensiones derivado de la geometría del rostro, que es invariante a ropa, peinado y ángulo moderado. Ese vector es el ancla de identidad persistente y es lo que se guarda, no la foto.

---

## 1. Stack por capa (contenido del slide de herramientas)

### Capa 1 — PWA (Next.js)

| Herramienta | Para qué | Por qué esa y no otra |
|---|---|---|
| **Next.js 15 (App Router)** | Framework del sitio | Server Components para la carga inicial, streaming de datos, rutas API como proxy al backend de Python. Es el estándar de React en producción |
| **React 19 + TypeScript** | Capa de UI | Tipado de los eventos que manda el backend; errores en compilación, no en la caseta de vigilancia |
| **Serwist** (sucesor de next-pwa) | Service worker | Genera el SW, precache del App Shell y estrategias de caché. Es lo que técnicamente convierte el sitio en PWA |
| **Web App Manifest** | Instalabilidad | Icono en la pantalla del celular del guardia, arranque sin barra del navegador |
| **Web Push API + Notifications API** | Alertas | La alerta llega aunque la PWA esté cerrada. Es el requisito operativo del caso de uso |
| **TanStack Query** | Estado del servidor | Reintentos, caché, revalidación en segundo plano, y datos visibles sin conexión |
| **Tailwind CSS + shadcn/ui** | Diseño | UI legible en pantalla chica y con poca luz; alto contraste sin escribir CSS a mano |
| **IndexedDB** (vía idb) | Persistencia local | Guarda el último tablero y los eventos recientes para operar sin señal |

### Capa 2 — Backend de visión (Python)

| Herramienta | Para qué | Por qué esa |
|---|---|---|
| **FastAPI** | API del backend | Asíncrono nativo, validación automática y documentación OpenAPI gratis. Soporta WebSocket en el mismo proceso |
| **Ultralytics YOLO** | Detección de personas | Detección en tiempo real de la clase `person`. Modelo maduro, documentado y con licencia clara para uso académico |
| **ByteTrack** | Seguimiento multiobjeto | Mantiene el mismo ID mientras la persona está a cuadro; evita contar veinte veces al mismo individuo |
| **InsightFace / ArcFace** | Embedding facial | Convierte el rostro en un vector de 512 dimensiones. Es el único componente que sobrevive al cambio de ropa |
| **OpenCV** | Lectura y preproceso de video | Conexión a las cámaras RTSP, recorte, normalización de cuadros |
| **PyTorch + CUDA** | Motor de inferencia | Corre los modelos en GPU; en CPU el sistema no alcanza tiempo real |
| **Celery + Redis** | Cola de trabajos | Separa la inferencia pesada de la respuesta de la API; el backend nunca se bloquea |

### Capa 3 — Datos e infraestructura

| Herramienta | Para qué | Por qué esa |
|---|---|---|
| **PostgreSQL + pgvector** | Base de datos | Guarda los eventos relacionales **y** los embeddings faciales. `pgvector` hace búsqueda por similitud coseno: "¿a quién se parece este rostro?" resuelto en la misma base, sin motor extra |
| **Redis Pub/Sub** | Bus de eventos | El backend publica la detección, la API la reenvía a la PWA por WebSocket |
| **MinIO / S3** | Recortes de imagen | Solo el recorte del rostro del evento, con política de retención. Nunca video completo |
| **Docker + Docker Compose** | Empaquetado | Un `compose up` levanta backend, base y cola. Reproducible en el servidor con GPU |
| **Nginx** | Reverse proxy | TLS y enrutamiento. La PWA **exige HTTPS** para que el service worker funcione |
| **Vercel** | Despliegue de la PWA | Despliegue del front desacoplado del backend |

---

## 2. Arquitectura del software (slide de diagrama)

Tres capas desacopladas; cada una escala y falla por separado.

    ┌─────────────────────────────────────────────┐
    │  CAPA DE PRESENTACIÓN — PWA (Next.js)       │
    │  App Shell · Service Worker · IndexedDB     │
    │  Tablero en vivo · Alertas · Búsqueda       │
    └───────────────┬─────────────────────────────┘
                    │  HTTPS (REST)  +  WebSocket (tiempo real)
                    │  Web Push (alertas con la app cerrada)
    ┌───────────────▼─────────────────────────────┐
    │  CAPA DE APLICACIÓN — FastAPI               │
    │  Fachada REST · WebSocket · Autenticación   │
    │  Orquesta: no ve cámaras, no infiere        │
    └───────┬───────────────────────┬─────────────┘
            │                       │
    ┌───────▼──────────┐   ┌────────▼─────────────┐
    │ MOTOR DE VISIÓN  │   │ CAPA DE DATOS        │
    │ OpenCV → YOLO    │   │ PostgreSQL+pgvector  │
    │ → ByteTrack      │   │ Redis · MinIO        │
    │ → ArcFace        │   │                      │
    │ (worker Celery)  │   │                      │
    └───────▲──────────┘   └──────────────────────┘
            │
      Cámaras IP / RTSP del campus

**Recorrido de un evento:** la cámara emite el flujo → OpenCV toma el cuadro → YOLO detecta personas → ByteTrack les asigna un ID temporal → ArcFace extrae el embedding del rostro → `pgvector` lo compara contra los ya registrados → si la similitud supera el umbral es la misma persona, si no se da de alta una identidad nueva → el evento se publica en Redis → FastAPI lo empuja por WebSocket → la PWA lo pinta sin recargar.

---

## 3. Patrón de diseño (slide dedicado)

**Patrón arquitectónico principal: Cliente–Servidor en capas (n-tier), con la PWA como cliente delgado.**
Justificación: la inferencia necesita GPU y no puede vivir en el navegador; la PWA necesita instalarse en cualquier teléfono. Separarlos es obligatorio, no una preferencia de estilo.

**Dentro de la PWA: MVVM.** En Next.js el mapeo es directo — los Server Components y el cliente de datos son el *Model*, los hooks de React y TanStack Query son el *ViewModel*, el JSX es la *View*. La vista no sabe de dónde vienen los datos.

**Patrones GoF concretos que se usan y dónde:**

| Patrón | Dónde vive | Qué resuelve |
|---|---|---|
| **Observer / Publicador-Suscriptor** | Redis Pub/Sub → WebSocket → PWA | La PWA no pregunta "¿hay algo nuevo?" cada segundo; se suscribe y el servidor le avisa |
| **Repository** | Acceso a datos en el backend | El caso de uso pide "dame los eventos de hoy" sin saber si vienen de Postgres, de caché o de Redis |
| **Strategy** | Motor de detección y de comparación | Cambiar YOLO por otro modelo, o el umbral de similitud, sin tocar el resto del sistema |
| **Singleton** | Modelo cargado en memoria y pool de conexiones | Cargar los pesos de YOLO cuesta segundos y GB de VRAM. Se carga una vez al arrancar |
| **Facade** | API REST de FastAPI | Un solo endpoint limpio esconde un pipeline de cinco etapas |
| **Adapter** | Ingesta de cámaras | Normaliza marcas y protocolos de cámara distintos a un mismo formato de cuadro |

---

## 4. Patrón de programación (slide dedicado)

No confundirlo con el anterior: el patrón de diseño dice **cómo se organizan las piezas**; el patrón de programación dice **cómo se escribe el código**.

1. **Orientado a eventos y asíncrono (event-driven, non-blocking).** Nada bloquea. `async/await` en FastAPI, `async/await` en el cliente, Celery para lo pesado. Una cámara lenta no congela a las demás.
2. **Declarativo por componentes, con flujo de datos unidireccional.** En React se describe *cómo se ve* la interfaz para un estado dado; no se manipula el DOM a mano. El estado baja, los eventos suben.
3. **Offline-first con App Shell.** El cascarón de la app (layout, navegación, estilos) se precachea en la instalación y siempre carga instantáneo; solo los datos viajan por la red. Estrategia de caché: *Network First* para el tablero en vivo, *Stale-While-Revalidate* para el histórico, *Cache First* para los recursos estáticos.
4. **Tipado estático de extremo a extremo.** TypeScript en el front, Pydantic en el backend. El contrato del evento está definido en los dos lados y el compilador lo verifica.

---

## 5. Flujo del usuario (slide dedicado)

Roles: **Operador de seguridad** (uso diario, en el celular) y **Administrador** (gestión, en escritorio).

    1. INSTALACIÓN
       Abre la URL → el navegador ofrece "Agregar a pantalla de inicio"
       → queda instalada como app, sin tienda de por medio

    2. ACCESO
       Inicia sesión → sesión persistente en el dispositivo

    3. TABLERO EN VIVO   ← pantalla principal
       Ve las zonas activas, personas detectadas ahora
       y el listado de eventos entrando en tiempo real por WebSocket

    4. ALERTA
       El backend detecta una coincidencia marcada
       → llega notificación push AUNQUE LA APP ESTÉ CERRADA
       → el operador toca la notificación

    5. DETALLE DEL EVENTO
       Recorte del rostro · zona · hora · nivel de confianza
       · historial de apariciones previas de esa misma identidad

    6. ACCIÓN
       Confirma o descarta la coincidencia (retroalimenta el umbral)
       · escala el incidente · registra nota

    7. BÚSQUEDA HISTÓRICA
       Filtra por fecha, zona o identidad
       → línea de tiempo de dónde y cuándo apareció esa persona

    8. SIN CONEXIÓN
       Sin señal, la PWA sigue mostrando el último tablero
       y los eventos ya descargados desde IndexedDB
       → al volver la señal, sincroniza en segundo plano

**Regla de diseño a declarar en voz alta:** el operador **nunca** ve video. Ve eventos. Esa restricción es de producto, no una limitación técnica.

---

## 6. Slide de privacidad y marco legal (no la quites)

Es el slide que separa un proyecto de escuela de un proyecto defendible, y adelanta la pregunta que te van a hacer.

- El rostro es **dato personal sensible** bajo la LGPDPPSO y los criterios del INAI. La UTCH es sujeto obligado.
- Qué se almacena: el **vector** del embedding y un recorte del rostro con retención definida. **No** video continuo.
- Un vector no es reversible a fotografía, pero **sí es un identificador biométrico** — decirlo explícitamente da credibilidad.
- Controles del diseño: consentimiento informado, aviso de privacidad publicado, señalización en zonas cubiertas, bitácora de accesos al sistema, retención con borrado automático y cifrado en reposo.
- Pendiente real del proyecto: **autorización formal de la institución**. Es el riesgo #1 y hay que nombrarlo.

---

## 7. Prompt listo para Claude Design

Pegar tal cual en Claude Design. Cubre los 8 slides.

---

**INICIO DEL PROMPT**

Diseña una presentación de 8 slides, en español, para una clase universitaria de Programación de Aplicaciones Web Progresivas en la Universidad Tecnológica de Chihuahua. La expone un equipo de 3 alumnos de Ingeniería en Entornos Virtuales y Negocios Digitales ante su profesor.

ESTILO VISUAL
Técnico y sobrio, no corporativo genérico. Fondo oscuro, acento en un solo color frío (azul o cian), tipografía sans-serif de alta legibilidad, tipo monoespaciada para nombres de tecnologías. Cada slide debe leerse desde el fondo del salón: máximo 6 bullets por slide, frases cortas, nada de párrafos. Prioriza diagramas y tablas sobre texto corrido. Sin emojis. Sin fotos de archivo.

CONTEXTO DEL PROYECTO
Sistema de videoanálisis para seguridad del campus universitario. Cámaras existentes alimentan un backend de Python con GPU que detecta personas con YOLO y genera un identificador biométrico facial, de modo que el sistema reconozca a la misma persona días después aunque cambie de ropa. La aplicación web progresiva es la ventana a ese backend: no procesa video, consume eventos en tiempo real, alerta y permite consultar el histórico.

SLIDE 1 — PORTADA
El sistema todavía no tiene nombre: no inventes uno ni dejes marcadores. Título: "Proyecto integrador". Subtítulo: "Herramientas, arquitectura y flujo de usuario". Debajo: Universidad Tecnológica de Chihuahua · Entornos Virtuales y Negocios Digitales · Programación de Aplicaciones Web Progresivas · Equipo 5: Ángel Iván López Delgado, Celeste Guadalupe Ramos Gurrola, Ángel Esteban Cervantes Muñoz · Chihuahua, Chih., septiembre de 2026.

SLIDE 2 — EL PROBLEMA Y LA DECISIÓN TÉCNICA
Dos bloques lado a lado.
Izquierda, el problema: la institución tiene cámaras que graban y se sobreescriben; si ocurre un incidente, revisar el video es manual, lento y no conecta apariciones del mismo individuo en días distintos.
Derecha, la decisión: la PWA no procesa video. El video lo procesa un servidor aparte con GPU; la PWA consume los eventos que ese servidor produce.
Abajo, una frase destacada: "La re-identificación por apariencia se rompe con un cambio de ropa. Por eso el ancla de identidad es un embedding facial: un vector de 512 dimensiones invariante a ropa y peinado."

SLIDE 3 — HERRAMIENTAS SELECCIONADAS
Tres columnas, una por capa. Cada herramienta con una línea de justificación de máximo 8 palabras.
Columna 1, PWA (Next.js): Next.js 15 App Router — framework y rutas API; React 19 + TypeScript — UI tipada; Serwist — service worker y estrategias de caché; Web App Manifest — instalable sin tienda; Web Push API — alerta con la app cerrada; TanStack Query — caché y reintentos; Tailwind + shadcn/ui — UI legible en pantalla chica; IndexedDB — datos disponibles sin conexión.
Columna 2, Backend de visión (Python): FastAPI — API asíncrona con WebSocket; Ultralytics YOLO — detección de personas en tiempo real; ByteTrack — seguimiento multiobjeto; InsightFace/ArcFace — embedding facial persistente; OpenCV — ingesta y preproceso de cuadros; PyTorch + CUDA — inferencia en GPU; Celery + Redis — cola de trabajos pesados.
Columna 3, Datos e infraestructura: PostgreSQL + pgvector — eventos y búsqueda por similitud; Redis Pub/Sub — bus de eventos en tiempo real; MinIO/S3 — recortes con retención; Docker Compose — despliegue reproducible; Nginx — TLS, requisito del service worker; Vercel — despliegue de la PWA.

SLIDE 4 — ARQUITECTURA DEL SOFTWARE
Diagrama de bloques de tres capas, de arriba hacia abajo.
Bloque superior: CAPA DE PRESENTACIÓN — PWA Next.js (App Shell, Service Worker, IndexedDB, tablero en vivo, alertas, búsqueda).
Flechas hacia abajo etiquetadas: HTTPS/REST, WebSocket (tiempo real), Web Push.
Bloque medio: CAPA DE APLICACIÓN — FastAPI (fachada REST, WebSocket, autenticación). Nota: orquesta, no infiere.
Dos bloques inferiores lado a lado: MOTOR DE VISIÓN (OpenCV → YOLO → ByteTrack → ArcFace, en workers de Celery) y CAPA DE DATOS (PostgreSQL + pgvector, Redis, MinIO).
Al pie, entrando al motor de visión: Cámaras IP / RTSP del campus.
En una banda inferior, el recorrido de un evento en seis pasos encadenados con flechas: cuadro capturado → YOLO detecta persona → ByteTrack asigna ID temporal → ArcFace extrae embedding → pgvector busca coincidencia por similitud → evento publicado y empujado a la PWA por WebSocket.

SLIDE 5 — PATRÓN DE DISEÑO
Arriba, dos afirmaciones destacadas: patrón arquitectónico "Cliente–Servidor en capas (n-tier), PWA como cliente delgado"; dentro de la PWA, "MVVM — Server Components y cliente de datos = Model; hooks y TanStack Query = ViewModel; JSX = View".
Abajo, tabla de tres columnas (Patrón, Dónde vive, Qué resuelve):
Observer / Pub-Sub | Redis Pub/Sub → WebSocket → PWA | La PWA no consulta en bucle: se suscribe y el servidor le avisa.
Repository | Acceso a datos del backend | El caso de uso pide datos sin saber de qué fuente vienen.
Strategy | Motor de detección y comparación | Cambiar de modelo o de umbral sin tocar el resto.
Singleton | Modelo en memoria y pool de conexiones | Los pesos de YOLO se cargan una sola vez al arrancar.
Facade | API REST de FastAPI | Un endpoint limpio esconde un pipeline de cinco etapas.
Adapter | Ingesta de cámaras | Normaliza marcas y protocolos distintos a un formato único.

SLIDE 6 — PATRÓN DE PROGRAMACIÓN
Encabezado aclaratorio en una línea: "El patrón de diseño organiza las piezas. El patrón de programación define cómo se escribe el código."
Cuatro bloques numerados, cada uno con título y dos líneas:
1. Orientado a eventos y asíncrono (non-blocking) — async/await en FastAPI y en el cliente, Celery para lo pesado; una cámara lenta no congela a las demás.
2. Declarativo por componentes, flujo unidireccional — se describe cómo se ve la UI para un estado dado; el estado baja, los eventos suben.
3. Offline-first con App Shell — el cascarón se precachea y siempre carga instantáneo; solo los datos viajan. Network First para el tablero en vivo, Stale-While-Revalidate para el histórico, Cache First para estáticos.
4. Tipado estático de extremo a extremo — TypeScript en el front, Pydantic en el backend; el contrato del evento está verificado por el compilador.

SLIDE 7 — FLUJO DEL USUARIO
Diagrama de flujo vertical u horizontal de 8 pasos numerados, con iconografía de línea mínima. Indica arriba los dos roles: Operador de seguridad (celular, uso diario) y Administrador (escritorio, gestión).
1. Instalación — abre la URL, "Agregar a pantalla de inicio", queda instalada sin tienda.
2. Acceso — inicia sesión, sesión persistente en el dispositivo.
3. Tablero en vivo — zonas activas y eventos entrando por WebSocket.
4. Alerta — notificación push aunque la app esté cerrada.
5. Detalle del evento — recorte del rostro, zona, hora, confianza, apariciones previas.
6. Acción — confirma o descarta la coincidencia, escala el incidente, registra nota.
7. Búsqueda histórica — filtra por fecha, zona o identidad; línea de tiempo de apariciones.
8. Sin conexión — muestra el último tablero desde IndexedDB y sincroniza al recuperar señal.
Al pie, en banda destacada: "El operador nunca ve video. Ve eventos."

SLIDE 8 — PRIVACIDAD Y MARCO LEGAL
Título: "Lo que tratamos y bajo qué reglas".
Cinco puntos:
El rostro es dato personal sensible bajo la LGPDPPSO y los criterios del INAI; la UTCH es sujeto obligado.
Se almacena el vector del embedding y un recorte del rostro con retención definida; no se almacena video continuo.
El vector no se revierte a fotografía, pero sí es un identificador biométrico y se trata como tal.
Controles: consentimiento informado, aviso de privacidad publicado, señalización en zonas cubiertas, bitácora de accesos, borrado automático por retención, cifrado en reposo.
Riesgo número uno del proyecto: autorización formal de la institución.
Cierra el slide con una línea destacada: "Un sistema de este tipo se sostiene por su marco legal, no por su exactitud."

**FIN DEL PROMPT**

---

## 8. Preguntas que te van a hacer y cómo responder

| Pregunta previsible | Respuesta corta |
|---|---|
| ¿Por qué PWA y no una app nativa? | Instalable sin tienda, una sola base de código, se actualiza sin que el usuario apruebe nada, y con push y offline cubre el caso de uso completo |
| ¿Por qué no corres YOLO en el navegador con TensorFlow.js? | Los cuadros de las cámaras no pasan por el navegador, y los modelos de re-ID facial no caben ni corren en tiempo real en un celular |
| ¿Cómo reconoce a alguien con otra ropa? | El identificador es geometría facial convertida en vector, no apariencia |
| ¿Qué pasa si no hay internet? | El App Shell y el histórico descargado siguen disponibles desde IndexedDB; al recuperar señal se sincroniza |
| ¿Es legal? | Es legal con consentimiento expreso, aviso de privacidad y autorización institucional. Sin eso no se instala — y eso es parte del alcance, no un trámite |

---

Relacionado: [[11-ESCUELA/10-cuatrimestre/programacion-aplicaciones-web-progresivas/_moc-programacion-aplicaciones-web-progresivas|PWA]] · [[11-ESCUELA/10-cuatrimestre/proyecto-integrador|proyecto integrador]] · [[11-ESCUELA/10-cuatrimestre/integradora/entregables/propuesta-proyecto-integrador|Propuesta de proyecto Integrador]] · [[juan-carlos-bustamante]] · [[celeste]] · [[angel-cervantes]] · [[utch]] · [[Fora]]
