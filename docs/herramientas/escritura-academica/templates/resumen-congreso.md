# Plantilla — resumen / abstract de congreso

Default basado en la convocatoria CIFIN 2026 (UACJ), que sigue el formato de resumen estructurado tipo Emerald. Si otra convocatoria pide algo distinto, gana la convocatoria.

## Metadatos

```
Título (es): <máx. ~20 palabras, tipo oración, dice objeto + método o hallazgo>
Title (en): <APA title case>

Autor(es): Ángel Iván López Delgado*¹ [ORCID: 0000-0000-0000-0000]
¹ Entornos Virtuales y Negocios Digitales, Universidad Tecnológica de Chihuahua, México
* Autor de correspondencia: <correo>

Eje temático: <eje de la convocatoria>
```

## Cuerpo (≤ 300 palabras, prosa continua, SIN subtítulos)

Seis movimientos, en este orden, cada uno de 1 a 3 oraciones. Presupuesto aproximado de palabras:

| # | Movimiento | Palabras | Pregunta que responde |
|---|---|---|---|
| 1 | Objetivo | 30–45 | ¿Qué problema de ingeniería atiende y qué se propone lograr? Abrir con el problema, no con la herramienta. |
| 2 | Diseño / metodología / referentes teóricos | 60–80 | ¿Qué tipo de estudio (caso, experimento, diseño de artefacto), con qué datos, periodo, instrumentos y marco teórico? |
| 3 | Resultados / hallazgos / propuesta | 60–80 | ¿Qué se encontró o construyó? Con cifras concretas. |
| 4 | Limitaciones / implicaciones | 30–40 | ¿Qué no generaliza? ¿Para quién importa en la práctica? |
| 5 | Originalidad / valor | 25–35 | ¿Qué aporta que no exista en los trabajos previos? |
| 6 | Conclusiones | 20–30 | La afirmación central, en una o dos oraciones. |

Reglas del cuerpo: sin citas, sin siglas no definidas, sin "en este trabajo se presentará". Verbos en pasado para método y resultados.

## Palabras clave

Máx. 5, separadas por punto y coma, en minúsculas salvo nombres propios. No repetir palabras del título: sirven para que te encuentren por otra vía.

```
Palabras clave: término uno; término dos; término tres; término cuatro; término cinco
```

## Abstract / Keywords (inglés)

Misma estructura y mismos datos. Reescrito con `references/estilo-en.md`, no traducido literal. Mismo límite de palabras.

## Referencias

Solo si la plantilla las pide en el resumen (el CIFIN sí): 3 a 6 referencias clave, verificadas, en APA 7. Aunque el cuerpo no lleve citas, estas referencias respaldan el marco.

## Checklist antes de enviar

- [ ] `wc -w` del cuerpo en español y en inglés ≤ límite.
- [ ] Los seis movimientos presentes y en orden.
- [ ] Cifras recalculadas si el borrador tiene semanas.
- [ ] ORCID real, no placeholder.
- [ ] Plantilla Word oficial llenada con `anthropic-skills:docx`.
