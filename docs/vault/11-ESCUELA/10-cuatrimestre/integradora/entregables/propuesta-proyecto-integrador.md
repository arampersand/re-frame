---
type: entregable
materia: integradora
cuatrimestre: 10
unidad: 1
status: borrador
equipo: "Equipo 5"
date: 2026-09-08
last-updated: 2026-09-11
tags: [escuela, entregable, utch, integradora, propuesta, yolo, vision-computacional, bi, pwa]
ai-first: true
---

## For future Claude

**Propuesta de proyecto integrador** del Equipo 5 ([[Fora]], [[celeste]], [[angel-cervantes]]) para [[11-ESCUELA/10-cuatrimestre/integradora/_moc-integradora|Integradora]] con [[addai-guerrero]]. Entrega en Moodle: abre 2026-09-08 00:00, **cierra 2026-09-08 23:00**. La tarea **no traía rúbrica ni plantilla** — la estructura se derivó de los entregables que ya sabemos que piden Inteligencia de Negocios y Gestión de Proyectos II sobre este mismo proyecto, más el objetivo de la asignatura (PWA + BI + inmersivo + normatividad). Idea: visión computacional con YOLO sobre las cámaras existentes del campus para medir aforo, ocupación y flujos, con la UTCH como piloto y otras instituciones como mercado. **Decisión de diseño clave: sin reconocimiento facial ni re-identificación** — conteo anónimo agregado, procesado en el borde. Ese recorte es lo que lo hace legal y vendible. Estado: borrador, faltan datos del equipo (matrículas y roles; nombres completos ya confirmados el 2026-09-11).

# Propuesta de Proyecto Integrador

**SIMA — Sistema de Inteligencia de Movilidad y Aforo**
*(nombre de trabajo, cambiable)*

- **Universidad Tecnológica de Chihuahua** · Entornos Virtuales y Negocios Digitales
- **Asignatura:** Integradora · MCCT. Addai Guerrero Quiñones
- **Equipo 5:** Ángel Iván López Delgado · Celeste Guadalupe Ramos Gurrola · Ángel Esteban Cervantes Muñoz
- **Chihuahua, Chih., a 8 de septiembre de 2026**

---

## 1. Resumen ejecutivo

Las instituciones educativas deciden sobre sus espacios físicos —dónde abrir una cafetería, qué aulas reasignar, cómo distribuir horarios, dónde colocar señalización— con base en percepción y no en evidencia. Los sistemas que ya tienen (control escolar, listas de asistencia) responden **quién está inscrito**, pero no **dónde está la gente, cuándo y cómo se mueve**.

SIMA convierte las cámaras de videovigilancia que la institución **ya tiene instaladas** en una red de sensores de aforo. Un modelo de detección de objetos (YOLO) procesa el video **en el sitio**, sin almacenarlo, y emite únicamente conteos y coordenadas anónimas. Esos datos alimentan una arquitectura de inteligencia de negocios que produce mapas de calor, curvas de ocupación por hora y flujos entre edificios, consultables desde una **aplicación web progresiva** y desde un **gemelo digital 3D** del campus.

El modelo de negocio es SaaS B2B por suscripción. La UTCH funciona como **piloto y caso de éxito documentado**; el mercado son las demás instituciones educativas, bibliotecas, museos y dependencias públicas de la región.

---

## 2. Contexto de la organización

**Organización piloto:** Universidad Tecnológica de Chihuahua (UTCH), organismo público descentralizado del Gobierno del Estado de Chihuahua.

> **Pendiente de la Unidad I:** completar con datos duros — matrícula total, número de edificios y aulas, superficie del campus, número de cámaras instaladas y modelo, área responsable de seguridad y de sistemas, organigrama y misión/visión institucional. Se obtienen en entrevista con el área correspondiente.

**Justificación de la elección:** el equipo tiene acceso directo y cotidiano al campus, lo que permite levantar requerimientos reales, hacer pruebas de campo y validar resultados contra la realidad observable. Ninguna otra organización ofrece ese nivel de acceso en un plazo de 13 semanas.

**Área usuaria objetivo:** dirección académica, servicios escolares, planeación e infraestructura, y seguridad del campus.

---

## 3. Planteamiento del problema

La institución genera un flujo constante de personas por sus instalaciones y **no captura ningún dato de ese flujo**. Las consecuencias observables:

1. **Espacios subutilizados y espacios saturados coexistiendo.** No hay forma de saber qué aulas se ocupan realmente ni en qué porcentaje, así que la asignación se hace por costumbre.
2. **Decisiones de infraestructura sin evidencia.** Ampliar un estacionamiento, mover una cafetería o abrir un acceso se decide por presión anecdótica, no por medición.
3. **Congestión en horas de transición** entre clases, sin datos de dónde ni cuánto dura.
4. **Servicios dimensionados a ciegas** — cafetería, biblioteca, laboratorios y sanitarios operan sin conocer su demanda real por franja horaria.
5. **Eventos institucionales sin medición de impacto.** Ferias de carreras, jornadas y campañas no reportan aforo real ni permanencia por stand, así que no se sabe qué funcionó.

**Problema central:** la institución carece de un sistema que convierta la ocupación física de sus espacios en información accionable para la toma de decisiones.

---

## 4. Justificación

- **Aprovecha infraestructura existente.** El costo de entrada es bajo porque las cámaras ya están instaladas y pagadas; solo se agrega capacidad de cómputo en el borde. Ese es el argumento comercial principal frente a soluciones de sensores dedicados.
- **Genera un activo de datos que hoy no existe.** El video de CCTV se graba, se sobreescribe y se pierde. SIMA extrae el valor antes de que se borre.
- **Escalable a otras instituciones.** El problema no es exclusivo de la UTCH: cualquier organización con espacios físicos y afluencia lo tiene.
- **Cubre íntegramente el objetivo de la asignatura**, que exige aplicaciones progresivas, herramientas de inteligencia en los negocios, desarrollo inmersivo y consideración de la normatividad aplicable.
- **Viabilidad técnica comprobada.** La detección de personas con YOLO es tecnología madura y documentada; el riesgo del proyecto no está en el algoritmo sino en la integración y en el acceso.

---

## 5. Objetivos

### 5.1 Objetivo general

Desarrollar e implementar un sistema de inteligencia de movilidad y aforo que, mediante visión computacional aplicada a la infraestructura de videovigilancia existente, genere indicadores de ocupación y flujo de personas, entregados a través de una aplicación web progresiva y una visualización inmersiva, para sustentar la toma de decisiones de la UTCH y de instituciones análogas, con apego a la normatividad de protección de datos personales.

### 5.2 Objetivos específicos

1. Levantar los requerimientos del cliente y definir los indicadores que efectivamente usará para decidir.
2. Implementar el módulo de visión computacional con YOLO para detección y seguimiento anónimo de personas.
3. Diseñar y construir la arquitectura de inteligencia de negocios: extracción, transformación, carga y almacenamiento de series de tiempo.
4. Desarrollar la aplicación web progresiva de consulta, instalable y con capacidad de operación sin conexión.
5. Construir el componente inmersivo: representación tridimensional del campus con proyección de mapas de calor.
6. Documentar el marco normativo aplicable y el diseño de privacidad del sistema.
7. Formular y validar el modelo de negocio y la estrategia de comercialización.

---

## 6. Alcance y delimitación

### 6.1 Dentro del alcance

| # | Entrega |
|---|---|
| 1 | Módulo de detección y conteo anónimo de personas sobre video |
| 2 | Seguimiento de trayectorias dentro de una misma cámara y proyección al plano del campus |
| 3 | Base de datos de series de tiempo con métricas agregadas |
| 4 | Procesos de extracción, transformación y carga |
| 5 | PWA con tablero de indicadores, instalable y con caché sin conexión |
| 6 | Mapas de calor y visualización 3D del campus |
| 7 | Aviso de privacidad, señalización y documentación de cumplimiento |
| 8 | Modelo de negocio y propuesta comercial |
| 9 | Piloto funcional en **dos a tres zonas** del campus |

### 6.2 Fuera del alcance (delimitación explícita)

| # | Queda fuera | Razón |
|---|---|---|
| 1 | **Reconocimiento facial** | Dato biométrico sensible; incompatible con el marco legal y con la aceptación institucional |
| 2 | **Identificación o re-identificación de individuos** | El sistema cuenta personas, no persigue personas |
| 3 | **Almacenamiento de video o de imágenes** | El video se procesa y se descarta en el borde |
| 4 | Cobertura total del campus | El piloto se limita a las zonas acordadas con la institución |
| 5 | Instalación de cámaras nuevas | Se trabaja sobre la infraestructura existente |
| 6 | Control de acceso o funciones de seguridad | No es un producto de vigilancia |
| 7 | Integración con sistemas de control escolar | Se contempla como fase posterior, fuera del cuatrimestre |

> Esta delimitación no es una limitación técnica: es **la propuesta de valor**. Un sistema que no puede identificar a nadie es el único que una institución pública puede comprar sin conflicto jurídico ni rechazo de la comunidad estudiantil.

---

## 7. Descripción de la solución

### 7.1 Arquitectura general

```
Cámaras existentes (CCTV / IP)
        |
        v
[ Nodo de borde ]  ── YOLO (detección) + seguimiento multiobjeto
        |            El video NUNCA sale del nodo ni se almacena
        v
Eventos anónimos: {zona, timestamp, conteo, coordenada en plano}
        |
        v
[ ETL ]  ── limpieza, validación, agregación por ventana de tiempo
        |
        v
[ Almacén de datos ]  ── series de tiempo + dimensiones (zona, día, franja)
        |
        +--> [ PWA ]  tablero de indicadores, instalable, offline
        |
        +--> [ Gemelo digital 3D ]  mapas de calor sobre el modelo del campus
```

### 7.2 Módulo de visión computacional

- Modelo de detección de objetos de la familia **YOLO**, clase `person`, ejecutado sobre el flujo de video.
- **Seguimiento multiobjeto** para no contar dos veces a la misma persona dentro de un mismo cuadro y para derivar dirección de movimiento.
- **Homografía**: transformación de las coordenadas de la imagen a coordenadas del plano arquitectónico, de modo que varias cámaras alimenten un solo mapa.
- **Atributos agregados no identificatorios** que sí se pueden derivar sin comprometer la privacidad: densidad por metro cuadrado, dirección predominante de flujo, si la persona está en movimiento o detenida, tamaño del grupo. Ninguno de estos atributos permite reconstruir quién era.
- El nodo emite **únicamente datos numéricos**. No emite imágenes.

> **Punto a validar en la Unidad I:** la calidad del video de las cámaras existentes (resolución, cuadros por segundo, ángulo, iluminación) determina la precisión alcanzable. Debe medirse antes de comprometer cifras de exactitud.

### 7.3 Arquitectura de inteligencia de negocios

| Capa | Contenido |
|---|---|
| **Fuentes** | Eventos del nodo de borde · horario oficial de clases · calendario de eventos institucionales · datos meteorológicos (variable explicativa del uso de espacios abiertos) |
| **Extracción y transformación** | Validación, eliminación de duplicados, agregación por ventanas de 5 y 15 minutos, enriquecimiento con la dimensión tiempo y la dimensión espacio |
| **Almacenamiento** | Modelo dimensional orientado a series de tiempo: tabla de hechos de aforo con dimensiones de zona, fecha, franja horaria y tipo de día |
| **Análisis** | Comparativos por periodo, detección de patrones y anomalías, correlación entre horario académico y ocupación real |
| **Presentación** | PWA · gemelo digital · reportes exportables para la dirección |

### 7.4 Aplicación web progresiva

Justificación técnica del formato: el usuario final —un directivo o un responsable de planeación— consulta el tablero desde el celular, caminando por el campus, con señal intermitente.

- Instalable en el dispositivo, sin pasar por tienda de aplicaciones.
- Operación sin conexión: el último tablero consultado permanece disponible.
- Notificaciones cuando una zona rebasa un umbral de aforo definido.
- Interfaz adaptable a teléfono, tableta y escritorio.

### 7.5 Componente inmersivo y multisensorial

- **Gemelo digital del campus:** modelo tridimensional navegable donde los mapas de calor se proyectan sobre los edificios y plazas reales, con línea de tiempo para reproducir un día completo.
- **Capa multisensorial:** alertas sonoras y hápticas en la PWA al superarse umbrales de saturación, de modo que el responsable reciba la señal sin necesidad de mirar la pantalla.
- Ejecución en navegador mediante gráficos web, con posibilidad de extensión a realidad virtual.

---

## 8. Indicadores propuestos

### 8.1 Indicadores organizacionales

| Indicador | Definición | Decisión que habilita |
|---|---|---|
| Aforo por zona y franja horaria | Personas presentes por intervalo | Dimensionamiento de servicios |
| Porcentaje de ocupación | Aforo real / capacidad declarada | Reasignación de aulas y espacios |
| Tiempo de permanencia | Duración media de estancia por zona | Evaluación del uso de biblioteca y áreas comunes |
| Flujo entre edificios | Volumen y dirección de desplazamientos | Rediseño de rutas y señalización |
| Índice de saturación en accesos | Densidad máxima en puntos de entrada | Apertura de accesos alternos, ajuste de horarios |
| Curva de transición entre clases | Aforo en pasillos en los cambios de hora | Escalonamiento de horarios |
| Espacios subutilizados | Zonas bajo umbral de ocupación sostenido | Ahorro operativo, reconversión de espacios |

### 8.2 Indicadores de marketing y eventos

| Indicador | Definición | Decisión que habilita |
|---|---|---|
| Aforo de evento | Asistentes reales frente a registrados | Medición de convocatoria |
| Permanencia por stand o módulo | Tiempo medio frente a cada punto | Valuación de espacios en ferias |
| Efectividad de señalización | Cambio de flujo antes y después de instalarla | Optimización de la comunicación en sitio |
| Atracción de zona | Proporción de visitantes que se detienen | Ubicación de campañas y módulos informativos |
| Alcance de campaña interna | Personas expuestas a un punto de comunicación | Justificación de inversión en promoción |

---

## 9. Marco normativo y diseño de privacidad

Sección obligada por el objetivo de la asignatura y, en la práctica, condición de venta.

### 9.1 Normatividad aplicable

| Ordenamiento | Aplicación al proyecto |
|---|---|
| **Ley General de Protección de Datos Personales en Posesión de Sujetos Obligados** | Rige a la UTCH por ser organismo público. Define principios de licitud, finalidad, proporcionalidad y minimización |
| **Ley Federal de Protección de Datos Personales en Posesión de los Particulares** | Aplicable a los clientes privados del mercado objetivo |
| **Criterios del INAI sobre videovigilancia y datos biométricos** | Establecen que la imagen del rostro y los rasgos biométricos son datos personales sensibles |
| **Ley General de Transparencia y Acceso a la Información Pública** | Obliga a publicar el aviso de privacidad y el tratamiento de los datos |
| **ISO/IEC 27001 (referencia voluntaria)** | Marco de seguridad de la información para el manejo del sistema |

### 9.2 Principios de diseño adoptados

1. **Minimización.** Se capta el mínimo dato necesario: un conteo y una coordenada. Nada más.
2. **Anonimización en origen.** La conversión de imagen a número ocurre en el nodo de borde. El dato personal nunca viaja por la red ni llega al almacén.
3. **No conservación de video.** Los cuadros se procesan en memoria y se descartan.
4. **Imposibilidad de re-identificación.** El sistema no genera ni almacena vector de identidad alguno; dos apariciones de la misma persona en días distintos son, para el sistema, dos eventos sin relación.
5. **Agregación mínima.** Los datos se publican agregados por zona y ventana temporal, nunca a nivel de individuo.
6. **Transparencia.** Aviso de privacidad publicado y señalización visible en las zonas cubiertas.

> Este apartado es también un argumento comercial: convierte la objeción previsible ("nos están vigilando") en una característica documentada del producto.

---

## 10. Modelo de negocio

### 10.1 Propuesta de valor

*Inteligencia de ocupación para instituciones, sobre las cámaras que ya tienen instaladas, sin identificar a nadie.*

Frente a las alternativas:

| Alternativa | Limitación que SIMA resuelve |
|---|---|
| Conteo manual | Costoso, esporádico, propenso a error |
| Sensores dedicados de conteo | Requieren inversión en hardware e instalación en cada punto |
| Sistemas de control de acceso | Miden entradas, no ocupación ni movimiento interno |
| Analítica de CCTV comercial | Orientada a seguridad e identificación; conflicto normativo y costo elevado |

### 10.2 Segmentos de cliente

1. **Primario:** universidades e institutos tecnológicos, públicos y privados.
2. **Secundario:** bibliotecas públicas, museos y centros culturales.
3. **Terciario:** dependencias municipales y estatales con atención al público.
4. **Extensión futura:** plazas comerciales y centros de convenciones.

### 10.3 Fuentes de ingreso

| Vía | Descripción |
|---|---|
| **Suscripción mensual (principal)** | Tarifa por cámara activa o por campus, con niveles de servicio |
| **Implementación inicial** | Cobro único por levantamiento, calibración, homografía y capacitación |
| **Estudios de movilidad** | Entregable de consultoría puntual para quien no quiere suscripción |
| **Módulos adicionales** | Gemelo digital, integración con sistemas institucionales, multi-campus |

### 10.4 Niveles de servicio propuestos

| Nivel | Incluye |
|---|---|
| **Básico** | Aforo y ocupación por zona · tablero en PWA · reportes mensuales |
| **Profesional** | Lo anterior + mapas de calor, flujos, alertas y comparativos históricos |
| **Institucional** | Lo anterior + gemelo digital 3D, multi-campus, acceso programático a los datos e integración con sistemas propios |

> **Pendiente de la Unidad II:** fijar los precios. Deben sustentarse en (a) costo real de operación por cámara, (b) disposición a pagar levantada en entrevistas, y (c) comparación con soluciones existentes en el mercado. Publicar cifras sin ese sustento debilita la propuesta.

### 10.5 Estructura de costos

- Nodo de cómputo en el borde (equipo con capacidad de inferencia), por sitio.
- Alojamiento del almacén de datos y de la aplicación.
- Desarrollo y mantenimiento.
- Instalación, calibración y soporte.

Nota relevante: el costo marginal de agregar una cámara a un sitio ya instalado es bajo, lo que hace que el margen crezca con la escala dentro de un mismo cliente.

### 10.6 Estrategia de entrada al mercado

1. **Piloto sin costo en la UTCH** a cambio de acceso, retroalimentación y autorización para documentar el caso.
2. **Caso de éxito documentado** con cifras verificables de lo que la institución descubrió sobre sus propios espacios.
3. **Venta a instituciones análogas de la región**, usando el caso como prueba y aprovechando que comparten problema, presupuesto y estructura.
4. **Expansión** a bibliotecas, museos y dependencias públicas.

---

## 11. Metodología de gestión

Se adopta un **modelo de gestión híbrido**, congruente con lo establecido en la asignatura de Gestión de Proyectos II:

- **Componente predictivo** para el marco del proyecto: fases, hitos, entregables comprometidos con la institución y documentación formal. Es lo que la organización cliente necesita para dar seguimiento.
- **Componente ágil** para la construcción: iteraciones de dos semanas con incremento demostrable al final de cada una, reuniones breves de seguimiento y ajuste continuo del alcance dentro de los límites acordados.

**Justificación:** los requerimientos de la capa de datos y visualización se van a modificar conforme el cliente vea los primeros resultados —eso exige agilidad—, mientras que los compromisos institucionales y de privacidad requieren documentación formal y fechas firmes. Ninguno de los dos enfoques puros resuelve ambas necesidades.

---

## 12. Cronograma general

Alineado a las tres unidades de la asignatura (26 horas, 13 semanas).

| Unidad | Semanas | Entregables del periodo |
|---|---|---|
| **I. Estructuración del proyecto** (33%) | 1–4 | Propuesta · contexto de la organización · problemática · requerimientos y alcance · marco normativo · diseño de la arquitectura |
| **II. Dirección del proyecto** (53%) | 5–11 | Módulo de visión computacional · procesos de extracción y carga · almacén de datos · PWA · gemelo digital · piloto en campo · modelo de negocio validado |
| **III. Presentación del proyecto** (14%) | 12–13 | Documentación final · demostración funcional · resultados del piloto · presentación ejecutiva |

---

## 13. Equipo y roles

| Integrante | Rol propuesto | Responsabilidad principal |
|---|---|---|
| Ángel Iván López Delgado | Líder técnico | Arquitectura, visión computacional, desarrollo de la PWA |
| Celeste Guadalupe Ramos Gurrola | _por definir_ | _por definir_ |
| Ángel Esteban Cervantes Muñoz | _por definir_ | _por definir_ |

> **Acción inmediata del equipo:** repartir los roles antes de la primera revisión. Un reparto defendible sería: un integrante a cargo de la relación con el cliente, el levantamiento de requerimientos y la documentación normativa; otro a cargo de la capa de inteligencia de negocios, los indicadores y el modelo de negocio. Las tres áreas del proyecto son suficientemente distintas como para que nadie quede sin carga propia.

---

## 14. Recursos requeridos

| Tipo | Recurso |
|---|---|
| **Institucional** | Autorización de acceso a las cámaras existentes · planos arquitectónicos del campus · contacto con el área de sistemas y con planeación |
| **Hardware** | Equipo de cómputo con capacidad de inferencia para el nodo de borde · cámaras de respaldo para pruebas controladas |
| **Software** | Biblioteca de detección de objetos · entorno de análisis de datos · base de datos de series de tiempo · entorno de desarrollo web · biblioteca de gráficos tridimensionales en navegador |
| **Alojamiento** | Servidor para el almacén de datos y la aplicación |

---

## 15. Riesgos y mitigación

| Riesgo | Impacto | Prob. | Mitigación |
|---|---|---|---|
| No se autoriza el acceso a las cámaras institucionales | **Crítico** | Media | Solicitud formal en la semana 1. Plan alterno: piloto con cámaras propias en una zona acotada y con autorización específica |
| Calidad insuficiente del video existente | Alto | Media | Medición temprana de la calidad; seleccionar como piloto las zonas con mejores condiciones |
| Rechazo de la comunidad estudiantil por percepción de vigilancia | Alto | Media | Comunicación anticipada, aviso de privacidad, señalización y demostración de que no se almacena video |
| Precisión insuficiente por oclusión o aglomeración | Medio | Alta | Calibración por zona, umbrales de densidad y validación contra conteo manual |
| Capacidad de cómputo insuficiente | Medio | Media | Reducción de cuadros por segundo procesados; procesamiento por muestreo |
| Carga de trabajo desbalanceada en el equipo | Medio | Media | Roles definidos desde la semana 1 y seguimiento semanal |
| Alcance excesivo para 13 semanas | Alto | **Alta** | Piloto limitado a dos o tres zonas; el resto queda documentado como fase posterior |

---

## 16. Resultados esperados

1. Sistema funcional operando sobre al menos dos zonas reales del campus.
2. Conjunto de datos de ocupación construido durante el periodo del piloto.
3. Al menos **tres hallazgos accionables** que la institución desconocía sobre el uso de sus espacios.
4. PWA instalable y en uso por al menos un responsable de área.
5. Gemelo digital con reproducción histórica de mapas de calor.
6. Documento de cumplimiento normativo y aviso de privacidad.
7. Modelo de negocio validado con al menos una institución externa entrevistada.

---

## 17. Fuentes consultadas

- Redmon, J., Divvala, S., Girshick, R. y Farhadi, A. (2016). *You Only Look Once: Unified, Real-Time Object Detection*. IEEE Conference on Computer Vision and Pattern Recognition.
- Cámara de Diputados del H. Congreso de la Unión. (2017). *Ley General de Protección de Datos Personales en Posesión de Sujetos Obligados*. Diario Oficial de la Federación.
- Cámara de Diputados del H. Congreso de la Unión. (2010). *Ley Federal de Protección de Datos Personales en Posesión de los Particulares*. Diario Oficial de la Federación.
- Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales. *Recomendaciones en materia de videovigilancia y datos biométricos*.
- Kimball, R. y Ross, M. (2013). *The Data Warehouse Toolkit: The Definitive Guide to Dimensional Modeling* (3.ª ed.). Wiley.
- Project Management Institute. (2021). *A Guide to the Project Management Body of Knowledge (PMBOK Guide)* (7.ª ed.).

> **Pendiente:** completar las fuentes en formato APA con fechas de consulta y direcciones electrónicas verificadas antes de la entrega final de la Unidad I.

---

Relacionado: [[11-ESCUELA/10-cuatrimestre/integradora/_moc-integradora|Integradora]] · [[11-ESCUELA/10-cuatrimestre/proyecto-integrador|proyecto integrador]] · [[addai-guerrero]] · [[celeste]] · [[angel-cervantes]] · [[utch]] · [[Fora]]
