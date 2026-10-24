# Citas reales: buscar y verificar fuentes

Regla: **ninguna referencia entra al documento sin verificarse contra una fuente externa en esta sesión.** La memoria del modelo no cuenta como verificación: autores, años, títulos y DOI inventados son el error que más rápido tumba un trabajo ante un comité.

## Dónde buscar

| Fuente | Para qué | Cómo |
|---|---|---|
| Crossref API | Verificar DOI y metadatos exactos | `curl -s "https://api.crossref.org/works/10.xxxx/yyyy"` o búsqueda: `curl -s "https://api.crossref.org/works?query.bibliographic=<título+autor>&rows=5"` |
| doi.org (content negotiation) | Sacar la referencia ya formateada en APA | `curl -sLH "Accept: text/x-bibliography; style=apa" https://doi.org/10.xxxx/yyyy` (también `; locale=es-ES`) |
| OpenAlex | Buscar literatura por tema, citas, año | `curl -s "https://api.openalex.org/works?search=<tema>&filter=from_publication_date:2021-01-01&per-page=10"` |
| Semantic Scholar | Papers de computación/IA, abstracts | `curl -s "https://api.semanticscholar.org/graph/v1/paper/search?query=<tema>&fields=title,authors,year,externalIds,abstract&limit=10"` |
| arXiv | Preprints de IA recientes | `https://export.arxiv.org/api/query?search_query=all:<tema>&max_results=10` |
| Redalyc, SciELO, Latindex | Literatura en español / LATAM (los comités mexicanos la valoran) | WebSearch con `site:redalyc.org` o `site:scielo.org.mx` |
| Google Scholar | Búsqueda general | WebSearch (no tiene API; úsalo para descubrir, verifica con Crossref) |
| Repositorios institucionales | Tesis mexicanas (UNAM, UACJ, UACH, etc.) | WebSearch `site:<dominio> <tema>` |

## Proceso por cada fuente

1. Encontrarla (OpenAlex / Semantic Scholar / WebSearch).
2. **Confirmar que existe** con el DOI en Crossref o la página oficial del editor/repositorio.
3. **Confirmar que dice lo que se le atribuye**: leer al menos el abstract (y la sección relevante si la afirmación es central). Nunca citar un paper por su título.
4. Generar la referencia APA (content negotiation del DOI) y revisarla contra `apa7.md`; corregir mayúsculas y cursivas que el servicio deja mal.
5. Registrar en la nota del documento una tabla de fuentes: referencia, DOI/URL, qué afirmación sostiene, fecha de verificación.

## Si no se puede verificar

Marcar `[REF PENDIENTE: afirmación que necesita fuente]` y listarlo en el reporte a Fora. Mejor un hueco visible que una cita falsa.

## Criterios de calidad de fuentes

- Preferir revistas arbitradas, memorias de congreso con revisión, libros de editorial académica, informes de organismos oficiales (INEGI, OCDE, UNESCO, CEPAL).
- Recientes (últimos 5 años) para tecnología e IA; clásicos se valen para fundamentos teóricos.
- Preprints de arXiv: aceptables en IA, pero decir que es preprint y no apoyar solo en ellos la afirmación central.
- Mezclar literatura internacional con literatura en español o latinoamericana cuando exista.
- Evitar: Wikipedia, blogs sin autor, contenido generado por IA, páginas de venta de productos.
