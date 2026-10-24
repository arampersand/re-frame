---
type: entregable
materia: integradora
cuatrimestre: 10
unidad: 1
status: borrador
equipo: "Equipo 5"
date: 2026-09-13
last-updated: 2026-09-13
tags: [escuela, entregable, utch, integradora, plan-de-gestion, metodologia, yolo, vision-computacional, bi, pwa]
ai-first: true
---

## For future Claude

**Reporte de investigación: Plan de Gestión del Proyecto y Selección de la Metodología** del Equipo 5 ([[Fora]], [[celeste]], [[angel-cervantes]]) para [[11-ESCUELA/10-cuatrimestre/integradora/_moc-integradora|Integradora]] con [[addai-guerrero]]. Se redactó el 2026-09-13 contra una **lista de cotejo de coevaluación de 10 criterios** que el profe publicó en `virtualti.utch.edu.mx`; cada sección de este documento mapea 1:1 a un criterio de esa lista (ver tabla al final).

**Cambio de alcance importante:** este documento asume **re-identificación persistente de personas**, a diferencia de la [[11-ESCUELA/10-cuatrimestre/integradora/entregables/propuesta-proyecto-integrador|propuesta del 2026-09-08]] que la excluía explícitamente. [[Fora]] lo decidió así el 2026-09-13 con el criterio de que es un proyecto académico que no va a salir al mercado. La sección 6 conserva el tratamiento normativo porque el criterio 6 de la rúbrica lo exige, pero está redactado como requisito a gestionar, no como restricción de diseño. El documento viejo queda desalineado — hay que decidir si se corrige o se deja como versión anterior.

**Cifras del presupuesto (sección 8): estimaciones sin cotizar.** Están marcadas como supuesto. Antes de la entrega final hay que cotizar el nodo de borde y confirmar cuánto pone cada integrante.

# Reporte de investigación
## Plan de Gestión del Proyecto y Selección de la Metodología

**SIMA — Sistema de Inteligencia de Movilidad y Aforo**

- **Universidad Tecnológica de Chihuahua** · Entornos Virtuales y Negocios Digitales · 10.º cuatrimestre
- **Asignatura:** Integradora · MCCT. Addai Guerrero Quiñones
- **Equipo 5:** Ángel Iván López Delgado · Celeste Guadalupe Ramos Gurrola · Ángel Esteban Cervantes Muñoz
- **Chihuahua, Chih., a 13 de septiembre de 2026**

---

## 1. Descripción y justificación del proyecto

### 1.1 El problema

Las instituciones educativas administran espacios físicos sin ningún dato sobre cómo se usan. Sus sistemas actuales —control escolar, listas de asistencia, credencialización— responden **quién está inscrito**, pero no **dónde está la gente, cuándo, cuánto tiempo permanece y cómo se desplaza**. Las consecuencias son observables en cualquier campus:

1. **Aulas y espacios subutilizados conviviendo con espacios saturados**, porque la asignación se hace por costumbre y no por medición.
2. **Decisiones de infraestructura sin evidencia**: ampliar un estacionamiento, reubicar la cafetería o abrir un acceso se resuelve por presión anecdótica.
3. **Congestión en las transiciones entre clases**, sin datos de dónde ocurre ni cuánto dura.
4. **Servicios dimensionados a ciegas**: biblioteca, cafetería, laboratorios y sanitarios operan sin conocer su demanda real por franja horaria.
5. **Eventos institucionales sin medición de impacto**: ferias, jornadas y campañas no reportan aforo real ni permanencia.
6. **Zonas restringidas sin control efectivo de quién entra y cuándo**: laboratorios, almacenes y áreas administrativas dependen de llave física o de credencial prestable.

**Problema central:** la institución no cuenta con un sistema que convierta la ocupación física de sus espacios en información accionable para decidir.

### 1.2 La solución

SIMA convierte las cámaras de videovigilancia que la institución **ya tiene instaladas** en una red de sensores inteligentes. Un modelo de detección de objetos de la familia YOLO procesa el video en un **nodo de cómputo en el borde** —dentro del campus, sin subirlo a servicios externos— y genera dos capas de información:

- **Capa de aforo (agregada):** conteos, densidad, trayectorias y flujos por zona y franja horaria.
- **Capa de identidad (re-identificación):** vector de características de cada persona detectada, que permite reconocer a la misma persona en cámaras distintas y en días distintos, incluso con cambio de vestimenta. Habilita el control de acceso a zonas restringidas y el análisis de recorridos individuales.

Ambas capas alimentan una **arquitectura de inteligencia de negocios** que produce mapas de calor, curvas de ocupación, matrices de flujo entre edificios y reportes de acceso, consultables desde una **aplicación web progresiva (PWA)** instalable y desde un **gemelo digital tridimensional** del campus.

### 1.3 Por qué importa

- **Aprovecha infraestructura pagada.** El costo de entrada es bajo: las cámaras ya existen; solo se agrega capacidad de cómputo. Es el argumento principal frente a soluciones de sensores dedicados que exigen hardware nuevo en cada punto.
- **Rescata un activo de datos que hoy se destruye.** El video de CCTV se graba, se sobrescribe cada pocos días y se pierde. SIMA extrae el valor antes de que se borre.
- **El problema no es exclusivo de la UTCH.** Cualquier organización con espacios físicos y afluencia lo tiene, lo que hace el proyecto escalable más allá del piloto.
- **Cubre íntegramente el objetivo de la asignatura**, que exige aplicaciones web progresivas, herramientas de inteligencia de negocios, desarrollo inmersivo y consideración de la normatividad aplicable.
- **Viabilidad técnica comprobada.** La detección de personas con YOLO y la re-identificación con redes de extracción de características son tecnologías maduras y documentadas. El riesgo del proyecto no está en el algoritmo, sino en la integración y en el acceso a la infraestructura.

---

## 2. Público objetivo

### 2.1 Organización piloto

**Universidad Tecnológica de Chihuahua**, organismo público descentralizado del Gobierno del Estado de Chihuahua. Se elige porque el equipo tiene acceso directo y cotidiano al campus, lo que permite levantar requerimientos reales, hacer pruebas de campo y validar resultados contra la realidad observable. Ninguna otra organización ofrece ese nivel de acceso en un plazo de 13 semanas.

> **Pendiente de la Unidad I:** completar con datos duros —matrícula total, número de edificios y aulas, superficie del campus, número y modelo de cámaras instaladas, área responsable de seguridad y de sistemas, organigrama, misión y visión. Se obtienen mediante entrevista con las áreas correspondientes.

### 2.2 Caracterización de usuarios

| Perfil de usuario | Qué necesita | Beneficio esperado |
|---|---|---|
| **Dirección académica** | Saber qué aulas se ocupan realmente y en qué porcentaje | Reasignación de espacios con evidencia; detección de aulas ociosas |
| **Planeación e infraestructura** | Sustentar inversiones en obra y equipamiento | Decisiones de ampliación respaldadas por series históricas de ocupación |
| **Servicios escolares** | Dimensionar cafetería, biblioteca y sanitarios | Ajuste de horarios y personal a la demanda real por franja |
| **Seguridad del campus** | Saber quién entra a zonas restringidas y cuándo | Registro automático de accesos; alertas de presencia no autorizada |
| **Difusión y vinculación** | Medir el impacto real de eventos y campañas | Aforo verificado, permanencia por stand, efectividad de señalización |
| **Dirección general** | Una vista ejecutiva del uso del campus | Tablero consolidado y reportes periódicos sin pedir información a nadie |

### 2.3 Segmentos de mercado

1. **Primario:** universidades e institutos tecnológicos, públicos y privados.
2. **Secundario:** bibliotecas públicas, museos y centros culturales.
3. **Terciario:** dependencias municipales y estatales con atención al público.
4. **Extensión futura:** plazas comerciales, centros de convenciones y parques industriales.

El denominador común de los cuatro segmentos: tienen espacios físicos, tienen afluencia, ya tienen cámaras instaladas y no miden nada.

---

## 3. Ventajas competitivas

### 3.1 Comparación con alternativas existentes

| Alternativa | Qué hace | Limitación que SIMA resuelve |
|---|---|---|
| **Conteo manual / bitácora de vigilante** | Registro en papel de entradas | Esporádico, propenso a error, no auditable, sin serie histórica ni análisis |
| **Torniquetes y control de acceso por credencial** | Cuentan entradas al edificio | Ciegos dentro del espacio; la credencial se presta; no miden permanencia ni flujo interno |
| **Sensores dedicados de conteo (infrarrojo, térmicos)** | Aforo por punto de paso | Requieren hardware nuevo e instalación en cada punto; no dan trayectorias ni identidad |
| **Conteo por señal WiFi / Bluetooth** | Estimación de dispositivos presentes | Cuenta dispositivos, no personas; falla con quien trae dos equipos o ninguno; precisión baja |
| **Suites comerciales de analítica de CCTV** (Hikvision, Axis, Verkada, Milestone) | Analítica integrada al hardware del fabricante | Licenciamiento caro, dependencia de hardware propietario, datos procesados en nube extranjera, sin capa de inteligencia de negocios ni visualización inmersiva |

### 3.2 Diferenciadores

1. **Opera sobre la infraestructura existente.** No exige cambiar cámaras ni comprar sensores. El costo marginal de sumar una cámara a un sitio ya instalado es prácticamente cero, lo que hace que el margen crezca con la escala dentro del mismo cliente.
2. **Procesamiento en el borde.** El video se analiza dentro del campus y no se transmite a servidores externos. Para un sujeto obligado eso es un argumento de soberanía de la información que las suites en nube no pueden ofrecer.
3. **Capa de inteligencia de negocios propia.** Las suites comerciales entregan alertas y clips; SIMA entrega un modelo dimensional consultable, con comparativos históricos, detección de patrones y correlación con el horario académico.
4. **Componente inmersivo.** El gemelo digital tridimensional con reproducción histórica de mapas de calor no existe en las soluciones de CCTV del mercado.
5. **PWA instalable.** El directivo consulta el tablero desde el celular, caminando por el campus y con señal intermitente, sin pasar por una tienda de aplicaciones.
6. **Desarrollo y soporte local, precio en pesos.** Frente a licenciamiento en dólares y soporte remoto en otro huso horario.

---

## 4. Objetivos

### 4.1 Objetivo general

Desarrollar e implementar un sistema de inteligencia de movilidad y aforo que, mediante visión computacional aplicada a la infraestructura de videovigilancia existente de la Universidad Tecnológica de Chihuahua, genere indicadores de ocupación, flujo e identificación de personas, entregados a través de una aplicación web progresiva y una visualización inmersiva tridimensional, para sustentar la toma de decisiones institucionales sobre el uso de sus espacios físicos.

### 4.2 Objetivos específicos

1. **Levantar los requerimientos** del cliente institucional y definir el catálogo de indicadores que efectivamente usará para decidir.
2. **Implementar el módulo de visión computacional** con YOLO para detección de personas y seguimiento multiobjeto sobre el flujo de video.
3. **Implementar el módulo de re-identificación** que genere y compare vectores de características, permitiendo reconocer a la misma persona entre cámaras distintas y entre sesiones separadas en el tiempo.
4. **Diseñar y construir la arquitectura de inteligencia de negocios**: procesos de extracción, transformación y carga, y almacén dimensional orientado a series de tiempo.
5. **Desarrollar la aplicación web progresiva** de consulta, instalable, con caché sin conexión y notificaciones por umbral.
6. **Construir el componente inmersivo**: gemelo digital tridimensional del campus con proyección de mapas de calor y línea de tiempo.
7. **Documentar el marco normativo aplicable** y el diseño de tratamiento de datos del sistema.
8. **Formular el modelo de negocio** y la estrategia de comercialización del producto.
9. **Ejecutar un piloto funcional** en dos o tres zonas reales del campus y validar sus resultados contra medición manual.

---

## 5. Alcance del proyecto

### 5.1 Nota de cambio de alcance

> **Control de cambios — 2026-09-13.** La propuesta inicial (2026-09-08) excluía explícitamente el reconocimiento y la re-identificación de personas, delimitando el sistema al conteo anónimo. El equipo modifica el alcance para **incluir re-identificación persistente**, con el fin de habilitar el control de acceso a zonas restringidas y el análisis de recorridos individuales, que son los casos de uso de mayor valor para el área de seguridad del campus. Este documento sustituye la delimitación anterior. El cambio incrementa la complejidad técnica del módulo de visión y amplía las obligaciones de la sección 6.

### 5.2 Dentro del alcance

| # | Entregable |
|---|---|
| 1 | Módulo de detección y conteo de personas sobre video en tiempo real |
| 2 | Seguimiento multiobjeto y proyección de coordenadas al plano arquitectónico mediante homografía |
| 3 | Módulo de re-identificación: extracción de vector de características y correspondencia entre cámaras y entre sesiones |
| 4 | Padrón de personas enroladas para el control de zonas restringidas |
| 5 | Base de datos de series de tiempo con métricas agregadas y registro de eventos de acceso |
| 6 | Procesos de extracción, transformación y carga |
| 7 | PWA con tablero de indicadores, instalable, con caché sin conexión y notificaciones |
| 8 | Mapas de calor y gemelo digital tridimensional del campus |
| 9 | Documentación de tratamiento de datos y aviso de privacidad |
| 10 | Modelo de negocio y propuesta comercial |
| 11 | Piloto funcional en dos a tres zonas del campus, validado contra conteo manual |

### 5.3 Fuera del alcance

| # | Queda fuera | Razón |
|---|---|---|
| 1 | Cobertura total del campus | El piloto se limita a las zonas acordadas con la institución |
| 2 | Instalación de cámaras nuevas | Se trabaja sobre la infraestructura existente |
| 3 | Almacenamiento prolongado de video | Solo se conserva el segmento asociado a un evento de acceso; el resto se descarta tras el procesamiento |
| 4 | Integración con el sistema de control escolar | Se contempla como fase posterior, fuera del cuatrimestre |
| 5 | Accionamiento físico de puertas y cerraduras | El sistema notifica y registra; no ejecuta el control electromecánico |
| 6 | Aplicación nativa para tiendas de aplicaciones | La PWA cubre el requerimiento sin ese costo |
| 7 | Despliegue en instituciones distintas a la UTCH | El mercado se documenta, no se atiende durante el cuatrimestre |

### 5.4 Criterios de aceptación

- El sistema procesa video de al menos dos cámaras simultáneas en tiempo cercano al real.
- El conteo de aforo se desvía menos de un 15 % respecto a la validación manual.
- El módulo de re-identificación reconoce correctamente a una persona enrolada en al menos 8 de cada 10 apariciones en condiciones controladas.
- La PWA es instalable y conserva el último tablero consultado sin conexión.
- El gemelo digital reproduce un día completo de ocupación.

---

## 6. Aspectos legales y normativos

El sistema trata datos personales y, al incorporar re-identificación, **datos personales sensibles de naturaleza biométrica**. El cumplimiento no es opcional: es condición de la autorización institucional.

### 6.1 Normatividad aplicable

| Ordenamiento | Aplicación al proyecto |
|---|---|
| **Ley General de Protección de Datos Personales en Posesión de Sujetos Obligados (LGPDPPSO)** | Rige a la UTCH por ser organismo público descentralizado. Establece los principios de licitud, finalidad, proporcionalidad, minimización, calidad, información y responsabilidad |
| **Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)** | Aplicable a los clientes privados del mercado objetivo |
| **Criterios y recomendaciones del INAI en materia de videovigilancia y datos biométricos** | Determinan que la imagen del rostro y los rasgos biométricos constituyen datos personales sensibles y exigen consentimiento expreso para su tratamiento |
| **Ley General de Transparencia y Acceso a la Información Pública** | Obliga a publicar el aviso de privacidad y a documentar el tratamiento |
| **Ley de Protección de Datos Personales del Estado de Chihuahua** | Normativa local complementaria aplicable a la institución |
| **ISO/IEC 27001 (referencia voluntaria)** | Marco de gestión de seguridad de la información para la operación del sistema |

### 6.2 Obligaciones derivadas y cómo se atienden

| Obligación | Atención en el proyecto |
|---|---|
| Consentimiento expreso para datos biométricos | **Enrolamiento voluntario y documentado** de las personas incluidas en el padrón de zonas restringidas. Nadie entra al padrón sin haberlo firmado |
| Aviso de privacidad integral | Redacción, publicación en el portal institucional y señalización física visible en las zonas cubiertas |
| Evaluación de impacto en la protección de datos | Elaboración durante la Unidad I, previa a la puesta en operación del piloto |
| Principio de minimización | Se almacena el vector de características, no la fotografía. El video crudo se descarta salvo el asociado a un evento de acceso |
| Seguridad de la información | Cifrado en reposo y en tránsito, control de acceso por rol al tablero, bitácora de consultas |
| Derechos ARCO | Procedimiento documentado para que cualquier persona acceda, rectifique, cancele u oponga el tratamiento de sus datos |
| Designación de responsable | El titular del área institucional que resguarde el sistema, definido en el convenio |

### 6.3 Instrumento habilitante

El proyecto requiere un **convenio o autorización formal** de la UTCH que ampare: (a) el acceso a la infraestructura de videovigilancia existente, (b) el tratamiento de datos con fines académicos y de piloto, y (c) la delimitación de zonas cubiertas. Su gestión es la primera actividad del cronograma y el riesgo número uno del proyecto.

---

## 7. Capital humano y material

### 7.1 Capital humano

| Integrante | Rol | Responsabilidad principal | Entregables a su cargo |
|---|---|---|---|
| **Ángel Iván López Delgado** | Líder técnico y arquitecto de solución | Arquitectura general, visión computacional, desarrollo de la PWA y del gemelo digital | Módulo YOLO y re-identificación · procesos ETL · PWA · visualización 3D |
| **Celeste Guadalupe Ramos Gurrola** | Gestión del proyecto y relación con el cliente | Planeación, seguimiento, levantamiento de requerimientos y documentación normativa | Plan de gestión · actas y minutas · evaluación de impacto · aviso de privacidad · documentación final |
| **Ángel Esteban Cervantes Muñoz** | Inteligencia de negocios y modelo comercial | Definición de indicadores, modelo dimensional, tableros y propuesta de negocio | Catálogo de KPIs · diseño del almacén de datos · reportes · modelo de negocio y comercialización |

**Dedicación estimada:** 10 horas por semana por integrante durante 13 semanas = **390 horas-persona** en total.

> Los tres roles cubren áreas suficientemente distintas del proyecto como para que ninguno quede sin carga propia y ninguno dependa por completo del avance de otro.

**Apoyos externos requeridos:** asesoría del docente de la asignatura; contacto técnico del área de sistemas de la UTCH; contacto del área de planeación o servicios escolares como usuario de referencia.

### 7.2 Capital material

| Categoría | Recurso | Uso |
|---|---|---|
| **Institucional** | Autorización de acceso a cámaras · planos arquitectónicos del campus · acceso a la red · espacio físico para el nodo | Condición para operar el piloto |
| **Hardware** | Nodo de cómputo en el borde con capacidad de inferencia (GPU o acelerador dedicado) | Ejecución de los modelos de visión |
| | Dos cámaras IP para pruebas controladas | Desarrollo sin depender de la autorización institucional |
| | Equipos personales del equipo de trabajo | Desarrollo y documentación |
| **Software** | Biblioteca de detección de objetos · modelo de re-identificación · entorno de análisis de datos · base de datos de series de tiempo · framework web · biblioteca de gráficos tridimensionales en navegador | Todo de código abierto: sin costo de licenciamiento |
| **Servicios** | Alojamiento del almacén de datos y de la aplicación · nombre de dominio · respaldos | Operación del tablero |
| **Consumibles** | Señalización impresa para las zonas cubiertas · material de papelería | Cumplimiento y documentación |

---

## 8. Presupuesto y fuentes de financiamiento

> **Todas las cifras son estimaciones del equipo y están pendientes de cotización formal.** Se marcan como supuesto y se actualizarán al cierre de la Unidad I.

### 8.1 Presupuesto de inversión y operación del piloto (13 semanas)

| Concepto | Cantidad | Costo unitario (MXN) | Total (MXN) | Supuesto |
|---|---|---|---|---|
| Nodo de cómputo en el borde con acelerador de inferencia | 1 | $6,000 | $6,000 | Equipo de desarrollo tipo Jetson; sujeto a tipo de cambio e importación |
| Cámara IP para pruebas controladas | 2 | $1,500 | $3,000 | Gama media, alimentación por red |
| Alojamiento de aplicación y base de datos | 3 meses | $500 | $1,500 | Servidor virtual básico |
| Nombre de dominio y certificado | 1 | $400 | $400 | Anualidad |
| Almacenamiento y respaldos | 3 meses | $200 | $600 | |
| Accesorios de red y montaje | — | — | $900 | Cables, adaptadores, soportes |
| Señalización impresa y papelería | — | — | $500 | Avisos de privacidad en zonas cubiertas |
| Transporte y trabajo de campo | 13 semanas | $100 | $1,300 | Levantamiento, calibración y validación |
| **Subtotal de costos directos** | | | **$14,200** | |
| Reserva de contingencia (15 %) | | | $2,130 | Cobertura de variación de precios y fallas |
| **Total del piloto** | | | **$16,330** | |

### 8.2 Valorización del capital humano

No representa desembolso, pero forma parte del costo real del proyecto y del argumento de valor frente a la institución.

| Concepto | Cálculo | Valor (MXN) |
|---|---|---|
| Horas-persona aportadas | 3 integrantes × 10 h/sem × 13 semanas = 390 h | — |
| Valor de mercado de la hora (perfil junior) | $250 / hora | — |
| **Valor del trabajo aportado** | 390 h × $250 | **$97,500** |

### 8.3 Aportación en especie de la institución

| Concepto | Valor estimado (MXN) | Nota |
|---|---|---|
| Uso de la infraestructura de videovigilancia existente | $40,000 | Valor equivalente de instalar cámaras propias en las zonas del piloto |
| Red, energía eléctrica y espacio físico | $5,000 | Durante las 13 semanas |
| Tiempo del personal institucional en entrevistas y validación | $6,000 | Estimado en horas de personal |
| **Total en especie** | **$51,000** | |

### 8.4 Costo total del proyecto

| Componente | Monto (MXN) |
|---|---|
| Desembolso directo | $16,330 |
| Capital humano valorizado | $97,500 |
| Aportación institucional en especie | $51,000 |
| **Valor total del proyecto** | **$164,830** |

### 8.5 Fuentes de financiamiento

| Fuente | Monto (MXN) | Naturaleza | Estado |
|---|---|---|---|
| Aportación de los integrantes del equipo | $5,000 | Efectivo | Por confirmar el reparto entre los tres |
| Reutilización de equipo de cómputo propio del equipo | $6,000 | En especie | A verificar si el equipo disponible cubre el requerimiento de inferencia y evita la compra del nodo |
| Infraestructura de la UTCH (cámaras, red, espacio) | $51,000 | En especie | **A gestionar — riesgo principal del proyecto** |
| Trabajo de los integrantes | $97,500 | En especie | Comprometido |
| Convocatorias de apoyo a proyectos estudiantiles / incubadora institucional | Por definir | Efectivo | A investigar durante la Unidad I |
| Ingresos por suscripción al servicio | — | Efectivo | Posterior al cuatrimestre; no financia el piloto |

### 8.6 Modelo de ingresos posterior al piloto

Aunque queda fuera del periodo del proyecto, la sostenibilidad de la solución se plantea como servicio por suscripción:

| Vía de ingreso | Descripción |
|---|---|
| Suscripción mensual | Tarifa por cámara activa o por campus, escalonada por nivel de servicio |
| Implementación inicial | Cobro único por levantamiento, calibración, homografía y capacitación |
| Estudios de movilidad | Consultoría puntual para clientes sin suscripción |
| Módulos adicionales | Gemelo digital, multi-campus, integración con sistemas institucionales |

Los niveles de servicio propuestos son **Básico** (aforo y ocupación, tablero y reportes mensuales), **Profesional** (mapas de calor, flujos, alertas y comparativos históricos) e **Institucional** (gemelo digital, multi-campus, acceso programático e integración). La fijación de precios se sustentará en el costo real de operación por cámara, la disposición a pagar levantada en entrevistas y la comparación con las soluciones del mercado.

---

## 9. Selección de la metodología

### 9.1 Metodologías investigadas

**Cascada (ciclo de vida predictivo).** Modelo secuencial en el que cada fase —requerimientos, diseño, construcción, pruebas, implantación— concluye antes de iniciar la siguiente. Produce documentación formal exhaustiva y un plan de referencia estable. Su debilidad es la rigidez: un cambio de requerimiento después de la fase de diseño obliga a rehacer trabajo. Es el enfoque que subyace al ciclo de vida predictivo descrito por el Project Management Institute (2021).

**Scrum.** Marco de trabajo ágil que organiza la construcción en iteraciones de duración fija llamadas *sprints*, con un incremento potencialmente entregable al final de cada una. Define tres responsabilidades (dueño de producto, *scrum master*, equipo de desarrollo) y eventos de planeación, revisión y retrospectiva. Destaca en entornos de requerimientos cambiantes; a cambio, genera poca documentación formal y asume un compromiso de tiempo de los roles que un equipo de tres estudiantes con carga académica difícilmente sostiene en su forma pura (Schwaber y Sutherland, 2020).

**Kanban.** Método de gestión de flujo continuo basado en visualizar el trabajo, limitar el trabajo en curso y optimizar el tiempo de ciclo. No impone iteraciones ni roles, lo que lo hace muy ligero para equipos pequeños. Su límite: al no comprometer entregas con fecha, se ajusta mal a un proyecto con hitos institucionales firmes (Anderson, 2010).

**Enfoque híbrido (PMBOK + Scrum).** Combina un marco de gestión predictivo para el gobierno del proyecto —acta de constitución, plan de gestión, control de cambios, gestión de interesados y de riesgos— con un ciclo de construcción iterativo. La séptima edición del PMBOK reconoce explícitamente los enfoques híbridos y de adaptación al contexto como práctica válida (Project Management Institute, 2021).

### 9.2 Criterios de selección y matriz de decisión

Los criterios se derivan de las restricciones reales del proyecto: un cliente institucional que exige documentación formal, requerimientos de visualización que cambiarán en cuanto el usuario vea el primer tablero, un equipo de tres personas y un plazo fijo de 13 semanas.

| Criterio | Peso | Cascada | Scrum | Kanban | Híbrido |
|---|---|---|---|---|---|
| Tolerancia a requerimientos cambiantes | 25 % | 1 | 5 | 4 | 5 |
| Documentación formal para un cliente institucional | 25 % | 5 | 2 | 2 | 5 |
| Viabilidad en un equipo de 3 personas | 15 % | 3 | 3 | 5 | 4 |
| Entrega de incrementos demostrables en 13 semanas | 20 % | 1 | 5 | 4 | 5 |
| Gestión de hitos y fechas comprometidas | 15 % | 5 | 2 | 2 | 4 |
| **Total ponderado** | **100 %** | **2.80** | **3.50** | **3.35** | **4.70** |

*Escala de 1 (no lo satisface) a 5 (lo satisface plenamente).*

### 9.3 Metodología seleccionada y justificación

**Se adopta un enfoque híbrido: marco de gestión PMBOK para el gobierno del proyecto y Scrum adaptado para la construcción.**

La justificación es que las dos mitades del proyecto tienen naturalezas opuestas y ninguna metodología pura las atiende a la vez:

- **El compromiso institucional es predictivo.** La UTCH necesita un acta de constitución, un alcance documentado, fechas de hitos, un procedimiento de control de cambios y evidencia de cumplimiento normativo. Eso no se improvisa en una retrospectiva.
- **La construcción es adaptativa.** El catálogo de indicadores, el diseño del tablero y la visualización tridimensional van a cambiar en cuanto el usuario vea los primeros resultados reales. Congelar esos requerimientos en la semana 3 garantizaría entregar algo que nadie usará.

**Configuración operativa adoptada:**

| Elemento | Definición |
|---|---|
| Duración del sprint | 2 semanas (5 sprints dentro de la Unidad II) |
| Reunión de planeación | Inicio de cada sprint: selección de elementos del backlog y compromiso |
| Seguimiento | Dos sesiones breves por semana, presenciales o remotas |
| Revisión | Cierre de sprint con incremento demostrable |
| Retrospectiva | Cierre de sprint, con acuerdos de mejora registrados |
| Artefactos ágiles | Backlog de producto priorizado · backlog de sprint · tablero de tareas |
| Artefactos predictivos | Acta de constitución · plan de gestión · matriz de riesgos · registro de interesados · control de cambios · informes de avance |
| Herramientas | Tablero digital de tareas · repositorio con control de versiones · carpeta compartida de documentación |

### 9.4 Cronograma por unidad

| Unidad | Semanas | Enfoque | Entregables del periodo |
|---|---|---|---|
| **I. Estructuración del proyecto** (33 %) | 1–4 | Predictivo | Propuesta · plan de gestión · contexto de la organización · problemática · requerimientos y alcance · marco normativo · diseño de arquitectura · autorización institucional |
| **II. Dirección del proyecto** (53 %) | 5–11 | Ágil (5 sprints) | Módulo de visión y re-identificación · procesos ETL · almacén de datos · PWA · gemelo digital · piloto en campo · modelo de negocio |
| **III. Presentación del proyecto** (14 %) | 12–13 | Predictivo | Documentación final · demostración funcional · resultados del piloto · presentación ejecutiva |

### 9.5 Gestión de riesgos

| Riesgo | Impacto | Probabilidad | Respuesta |
|---|---|---|---|
| No se autoriza el acceso a las cámaras institucionales | **Crítico** | Media | Solicitud formal en la semana 1. Plan alterno: piloto con cámaras propias en una zona acotada |
| Calidad insuficiente del video existente | Alto | Media | Medición temprana de resolución, cuadros por segundo, ángulo e iluminación; elegir como piloto las zonas con mejores condiciones |
| Precisión insuficiente de la re-identificación | Alto | Alta | Enrolamiento controlado, umbrales de similitud calibrados por zona, validación manual documentada |
| Alcance excesivo para 13 semanas | Alto | **Alta** | Piloto acotado a dos o tres zonas; el resto se documenta como fase posterior. Revisión de alcance al cierre de cada sprint |
| Capacidad de cómputo insuficiente en el nodo | Medio | Media | Reducción de cuadros por segundo procesados y muestreo por intervalos |
| Rechazo de la comunidad por percepción de vigilancia | Alto | Media | Comunicación anticipada, aviso de privacidad, señalización y enrolamiento voluntario |
| Carga de trabajo desbalanceada en el equipo | Medio | Media | Roles definidos desde la semana 1 y revisión de carga en cada retrospectiva |
| Pérdida de disponibilidad de un integrante | Alto | Baja | Documentación compartida y repositorio común desde el inicio; ningún entregable con un solo responsable informado |

---

## 10. Resultados esperados

1. Sistema funcional operando sobre al menos dos zonas reales del campus.
2. Conjunto de datos de ocupación y accesos construido durante el periodo del piloto.
3. Al menos **tres hallazgos accionables** que la institución desconocía sobre el uso de sus espacios.
4. PWA instalable y en uso por al menos un responsable de área.
5. Gemelo digital con reproducción histórica de mapas de calor.
6. Documentación de cumplimiento normativo y aviso de privacidad publicado.
7. Modelo de negocio formulado y contrastado con al menos una institución externa entrevistada.

---

## 11. Referencias

Anderson, D. J. (2010). *Kanban: Successful evolutionary change for your technology business*. Blue Hole Press.

Cámara de Diputados del H. Congreso de la Unión. (2017). *Ley General de Protección de Datos Personales en Posesión de Sujetos Obligados*. Diario Oficial de la Federación. https://www.diputados.gob.mx/LeyesBiblio/pdf/LGPDPPSO.pdf

Cámara de Diputados del H. Congreso de la Unión. (2010). *Ley Federal de Protección de Datos Personales en Posesión de los Particulares*. Diario Oficial de la Federación. https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPDPPP.pdf

Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales. (2021). *Recomendaciones para el tratamiento de datos personales derivado del uso de sistemas de videovigilancia*. INAI.

Kimball, R. y Ross, M. (2013). *The data warehouse toolkit: The definitive guide to dimensional modeling* (3.ª ed.). Wiley.

Project Management Institute. (2021). *A guide to the project management body of knowledge (PMBOK guide)* (7.ª ed.). Project Management Institute.

Redmon, J., Divvala, S., Girshick, R. y Farhadi, A. (2016). You only look once: Unified, real-time object detection. *Proceedings of the IEEE Conference on Computer Vision and Pattern Recognition*, 779–788. https://doi.org/10.1109/CVPR.2016.91

Schwaber, K. y Sutherland, J. (2020). *The Scrum Guide: The definitive guide to Scrum — The rules of the game*. https://scrumguides.org/

Ye, M., Shen, J., Lin, G., Xiang, T., Shao, L. y Hoi, S. C. H. (2022). Deep learning for person re-identification: A survey and outlook. *IEEE Transactions on Pattern Analysis and Machine Intelligence*, 44(6), 2872–2893. https://doi.org/10.1109/TPAMI.2021.3054775

> **Pendiente:** verificar las direcciones electrónicas y agregar fecha de consulta antes de la entrega final de la Unidad I.

---

## Anexo. Correspondencia con la lista de cotejo de coevaluación

| # | Criterio de la lista de cotejo | Sección de este reporte |
|---|---|---|
| 1 | Justificación y descripción del proyecto: problema, solución e importancia | 1 |
| 2 | Ventajas competitivas y diferenciación frente a soluciones existentes | 3 |
| 3 | Público objetivo definido y caracterizado, con necesidades y beneficios | 2 |
| 4 | Capital humano y material, con roles, responsabilidades y recursos | 7 |
| 5 | Presupuesto coherente y fuentes de financiamiento | 8 |
| 6 | Aspectos legales y normativos del desarrollo y la operación | 6 |
| 7 | Metodología investigada, comparada y seleccionada con justificación | 9 |
| 8 | Alcance del proyecto: qué incluye y qué queda fuera | 5 |
| 9 | Objetivos general y específicos, coherentes con el proyecto y su alcance | 4 |
| 10 | Fundamentación en fuentes confiables, citadas y aplicadas al proyecto | 9 y 11 |

---

Relacionado: [[11-ESCUELA/10-cuatrimestre/integradora/_moc-integradora|Integradora]] · [[11-ESCUELA/10-cuatrimestre/proyecto-integrador|proyecto integrador]] · [[11-ESCUELA/10-cuatrimestre/integradora/entregables/propuesta-proyecto-integrador|propuesta de proyecto integrador]] · [[addai-guerrero]] · [[celeste]] · [[angel-cervantes]] · [[utch]] · [[Fora]]
