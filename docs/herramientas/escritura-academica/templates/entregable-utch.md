# Plantilla — entregable escolar UTCH

Tareas, reportes, ensayos y casos de estudio de la carrera de Entornos Virtuales y Negocios Digitales. **Primero leer las instrucciones del profe** (Moodle: `utch tareas` o la asignación) y la rúbrica si existe; la estructura de abajo es el default cuando el profe no pide otra.

## Portada (la genera el script con `--portada-utch`)

```
UNIVERSIDAD TECNOLÓGICA DE CHIHUAHUA
[escudo]
Entornos Virtuales y Negocios Digitales
<Materia>
<Título del trabajo>
PRESENTA:
Ángel Iván López Delgado
PROFESOR(A): <nombre>          ← solo si se pasa --profe
Chihuahua, Chih., a <fecha larga>
```

## Cuerpo (secciones numeradas)

```markdown
## 1. Introducción
Qué se va a tratar, por qué importa en la materia y qué contiene el documento. 1 párrafo.

## 2. Objetivo
Uno general (verbo en infinitivo + qué + para qué). Específicos solo si el trabajo lo amerita.

## 3. Desarrollo
Subsecciones 3.1, 3.2… según el tema. Aquí va el trabajo real: análisis, caso, solución, respuestas.
Tablas con "Tabla 1. Título" arriba; gráficas/figuras con "Figura 1. Título" y fuente abajo.

## 4. Conclusiones
Qué se aprendió o concluyó, con postura propia. Conectar con la práctica profesional o con proyectos reales cuando aplique.

## Referencias
APA 7, verificadas.
```

## Variantes

- **Ensayo:** Introducción con tesis explícita → argumentos (uno por sección, con evidencia) → contraargumento y respuesta → conclusión. Sin "Objetivo".
- **Caso de estudio:** Antecedentes de la empresa → problema → análisis (FODA, 5 fuerzas, lo que pida la materia) → alternativas → recomendación → conclusiones.
- **Reporte de práctica técnica:** Objetivo → materiales/herramientas → procedimiento (con capturas) → resultados → conclusiones.
- **Evidencia en inglés:** misma estructura, `references/estilo-en.md`, portada igual (la portada se queda en español).

## Entrega

1. Borrador en el vault (`11-ESCUELA/<cuatrimestre>/<materia>/…`).
2. `md_to_pdf.py --portada-utch …` hacia el scratchpad.
3. Subir a Drive carpeta UTCH, link en la nota, borrar local.
4. Subir a Moodle **en PDF** solo si Fora lo aprueba.
