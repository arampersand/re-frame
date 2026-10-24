---
type: entregable
materia: integradora
cuatrimestre: 10
unidad: 2
status: listo
equipo: "Equipo 5"
date: 2026-10-09
last-updated: 2026-10-09
tags: [escuela, entregable, utch, integradora, sima, vision-computacional, yolo, pruebas, evidencia]
ai-first: true
---

## For future Claude

Evidencia de la **primera corrida del módulo de visión de SIMA sobre video real** (2026-10-09), meta del sprint de esa semana del [[11-ESCUELA/10-cuatrimestre/proyecto-integrador|proyecto integrador]]. Los binarios (PDF, videos anotados) viven en Drive; aquí solo resultados y links. El código está en `~/Sites/sima-backend` (repo privado `Foralitos/sima-backend`), commiteado en `main` (`febbe61`, `d9575b1`, `1946a0f`, 2026-10-09); el reporte del repo está en `docs/pruebas/2026-10-09.md`.

# SIMA — Pruebas con video (2026-10-09)

## Dónde está la evidencia

- **Carpeta Drive:** UTCH / SIMA — Evidencias de pruebas / 2026-10-09 → https://drive.google.com/drive/folders/1tB8BPEqEmbTSl1ZaXT2s_z2VO7PsmHrP (privada; carpeta madre `1VoVO7tS070M5S1fvMJBinnJS0DJLyb2G` sin compartir aún)
- **Reporte PDF** (portada UTCH, equipo completo, profa [[addai-guerrero]]): https://drive.google.com/file/d/1YiCC2_EOTssorvGYFLcMsUyorytTusNa/view
- Videos anotados: [cajas de súper](https://drive.google.com/file/d/1s62uQ4bgcw2gSUACVbfb_XagikRgfOmz/view) · [tienda](https://drive.google.com/file/d/1vCQxMfH_5CglB2eGgJ2u_FiN0aX7RBuj/view) · [MOT17-04 calle](https://drive.google.com/file/d/1zPUnprRrTcsWxgNf7XZKtB1euT9WMRXn/view) · [MOT17-09](https://drive.google.com/file/d/1nQrpKwXLFGht2O7FCA1ztvCVOcVYSRC2/view)
- [Gráfica SIMA vs conteo real](https://drive.google.com/file/d/1ROwY93o8iHyna9pfM4nLd0LrVs7wHPSU/view) · [datos de las corridas (zip)](https://drive.google.com/file/d/1m4Um6XZ5HZrBTicz5A9ua8wO2XFoc3Dt/view)

## Resultados (confianza `high`, medidos)

Criterio del [[11-ESCUELA/10-cuatrimestre/integradora/entregables/plan-gestion-y-metodologia|plan de gestión]] §5.4: error de conteo < 15 % vs validación manual. Referencia: conteo manual de MOTChallenge (https://motchallenge.net), personas con ≥ 50 % visible.

| Video | Config | Error vs visibles | Error vs todas | Cumple |
|---|---|---|---|---|
| MOT17-04 (calle, cámara alta) | YOLO11n, 1280 px | **13.4 %** | 47.1 % | sí |
| MOT17-09 (tiendas, cámara cercana) | YOLO11n, 640 px | **16.7 %** | 35.5 % | no (por 1.7 pts) |

- Tiempo real en la MacBook M1 de 8 GB: 27–68 fps según la resolución.
- **Hallazgo clave:** la resolución de inferencia pesa más que el tamaño del modelo y es **por cámara**. A 640 px, MOT17-04 tenía 65 % de error; a 1280 px, 13.4 %. En MOT17-09, subir la resolución lo empeora.
- Escenarios comerciales (sin conteo manual): cajas de súper (4 clientes en caja derecha, ~48 s cada uno) y tienda (13 entran / 8 salen por la puerta en 60 s).

## Correcciones al backend en este sprint

Resolución configurable (`SIMA_IMGSZ`), memoria del tracker de 2 s ajustada al fps real, tolerancia anti-parpadeo de 1 s en zonas (visitas en la tienda: 101 → 24), cierre de visitas abiertas al final, línea contada por los pies. Video anotado (`--save-video`), `summary.json`, evaluador `scripts/eval_mot.py`, matriz `scripts/experiment.sh`. 7/7 tests.

## Plan de mejora de precisión (backlog para siguientes sprints; v1 aceptada por Fora el 2026-10-09)

Experimentos rápidos del mismo día (`high`, medidos sobre las corridas ya hechas):
- Suavizar el conteo con mediana de 0.5–1 s: mejora ~1 punto. El error no es parpadeo, son personas que no se cuentan.
- **Detector a confianza 0.25 + tracker con umbral alto 0.6** (ByteTrack crea tracks nuevos solo con detecciones ≥ `high_conf_det_threshold`): MOT17-04 baja de **13.4 % a 7.1 %**. En MOT17-09 sube a 23.1 % vs visibles ≥ 50 %, pero sobre todo porque cuenta gente parcialmente tapada que esa referencia excluye → la métrica de conteo es ambigua.

Fases:
0. **Medir bien primero:** evaluación por caja (IoU → precisión y recall, no solo conteo), más secuencias con ground truth (MOT17-02/05/10/11/13, MOT20 para multitudes), video a resolución completa (los webm de prueba son 960×540; los originales y las cámaras reales son 1080p), y un video propio de negocio contado a mano.
1. **Ganancias rápidas sin entrenar:** script de calibración por cámara (busca confianza, umbrales del tracker e `imgsz` contra un minuto contado a mano y guarda la config junto a las zonas), aplicar el hallazgo 0.25/0.6, inferencia por mosaicos (SAHI) para cámaras altas, máscara para ignorar reflejos/pósters, suavizado.
2. **Cambiar el detector:** RF-DETR (Apache 2.0, ya soportado por supervision) y YOLO11m/l si hay GPU, misma matriz. Quita además el riesgo AGPL.
3. **Fine-tuning:** CrowdHuman (oclusión fuerte; licencia no comercial, ok para escuela) + 300–500 cuadros de las cámaras piloto anotados en Roboflow/CVAT, entrenado en Colab.
4. **Más allá del modelo:** guía de instalación de cámara para pilotos (altura, ángulo, 1080p) y fusión de 2 cámaras para los tapados.

## Pendientes

- Decidir si la carpeta de Drive se comparte con link (para [[celeste]], [[angel-cervantes]] y la profa).
- Siguiente: probar RF-DETR (sube MOT17-09 y quita el riesgo AGPL de YOLO), dos cámaras simultáneas, video propio de un negocio piloto con conteo manual.

Relacionado: [[11-ESCUELA/10-cuatrimestre/proyecto-integrador|Proyecto integrador]] · [[11-ESCUELA/10-cuatrimestre/integradora/_moc-integradora|Integradora]] · [[addai-guerrero]] · [[utch]]
