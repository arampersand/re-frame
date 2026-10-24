#!/usr/bin/env python3
"""Markdown académico -> PDF (carta, APA-ish) vía Chrome headless.

Uso:
  md_to_pdf.py entrada.md salida.pdf [--portada-utch --materia M --titulo T [--profe P]] [--fecha "29 de septiembre de 2026"]

Quita frontmatter YAML y la sección "## For future Claude". Referencias con sangría francesa.
"""
import argparse
import base64
import datetime as dt
import html
import re
import subprocess
import sys
import tempfile
from pathlib import Path

import markdown

CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
LOGO = Path("/Users/fora/secondbrain/08-KNOWLEDGE/.utch-logo.png")
AUTOR = "Ángel Iván López Delgado"
CARRERA = "Entornos Virtuales y Negocios Digitales"
MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
         "agosto", "septiembre", "octubre", "noviembre", "diciembre"]

CSS = """
@page { size: letter; margin: 2.5cm; }
body { font-family: Arial, Helvetica, sans-serif; font-size: 12pt; line-height: 1.5; color: #000; }
h1 { font-size: 14pt; text-align: center; margin: 0 0 12pt; }
h2 { font-size: 12pt; margin: 18pt 0 6pt; }
h3 { font-size: 12pt; font-style: italic; margin: 12pt 0 6pt; }
p { margin: 0 0 8pt; text-align: justify; }
table { border-collapse: collapse; margin: 8pt auto; font-size: 10.5pt; }
th, td { border: 1px solid #555; padding: 3pt 6pt; vertical-align: top; }
th { background: #eee; }
img { max-width: 100%; }
blockquote { margin: 8pt 1.27cm; }
code { font-family: Menlo, monospace; font-size: 10pt; }
pre { background: #f4f4f4; padding: 6pt; font-size: 9.5pt; white-space: pre-wrap; }
.refs p, .refs li { padding-left: 1.27cm; text-indent: -1.27cm; text-align: left; list-style: none; }
.refs ul, .refs ol { padding-left: 0; }
.portada { height: 21.5cm; display: flex; flex-direction: column; align-items: center;
           justify-content: space-between; text-align: center; page-break-after: always; }
.portada .inst { font-size: 16pt; font-weight: bold; }
.portada img { width: 5cm; }
.portada .t { font-size: 14pt; font-weight: bold; }
.portada p { text-align: center; margin: 0; }
"""


def limpiar(md: str) -> str:
    md = re.sub(r"\A---\n.*?\n---\n", "", md, flags=re.S)
    md = re.sub(r"^## For future Claude\n.*?(?=^#{1,2} |\Z)", "", md, flags=re.S | re.M)
    # Pie de wikilinks del vault ("---" + "Relacionado: [[…]]"): es del secondbrain, no del documento.
    md = re.sub(r"(?:^-{3,}\s*\n\s*)?^Relacionado:.*\Z", "", md.rstrip(), flags=re.S | re.M)
    return md.strip() + "\n"


def envolver_referencias(body: str) -> str:
    # Todo lo que sigue a un h2/h1 "Referencias"/"References" va en .refs (hasta el siguiente h1/h2).
    patron = re.compile(r"(<h[12][^>]*>\s*(Referencias|References)[^<]*</h[12]>)(.*?)(?=<h[12]|\Z)", re.S | re.I)
    return patron.sub(lambda m: f'{m.group(1)}<div class="refs">{m.group(3)}</div>', body)


def fecha_larga(d: dt.date) -> str:
    return f"{d.day} de {MESES[d.month - 1]} de {d.year}"


def portada(materia: str, titulo: str, profe: str | None, fecha: str, equipo: list[str] | None = None) -> str:
    logo = ""
    if LOGO.exists():
        logo = f'<img src="data:image/png;base64,{base64.b64encode(LOGO.read_bytes()).decode()}">'
    e = html.escape
    profe_html = f"<p>PROFESOR(A): {e(profe)}</p>" if profe else ""
    autores_html = "".join(f"<p><b>{e(n)}</b></p>" for n in [AUTOR, *(equipo or [])])
    return f"""<div class="portada">
<p class="inst">UNIVERSIDAD TECNOLÓGICA DE CHIHUAHUA</p>
{logo}
<p>{e(CARRERA)}</p>
<p>{e(materia)}</p>
<p class="t">{e(titulo)}</p>
<div><p>PRESENTA:</p>{autores_html}{profe_html}</div>
<p>Chihuahua, Chih., a {e(fecha)}</p>
</div>"""


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("entrada")
    ap.add_argument("salida")
    ap.add_argument("--portada-utch", action="store_true")
    ap.add_argument("--materia", default="")
    ap.add_argument("--titulo", default="")
    ap.add_argument("--profe")
    ap.add_argument("--fecha", default=fecha_larga(dt.date.today()))
    ap.add_argument("--equipo", action="append", help="Compañero de equipo (repetible); va después del autor en la portada")
    a = ap.parse_args()

    if a.portada_utch and not (a.materia and a.titulo):
        ap.error("--portada-utch requiere --materia y --titulo")

    src = Path(a.entrada)
    body = markdown.markdown(limpiar(src.read_text(encoding="utf-8")),
                             extensions=["tables", "fenced_code", "sane_lists", "attr_list"])
    body = envolver_referencias(body)
    cover = portada(a.materia, a.titulo, a.profe, a.fecha, a.equipo) if a.portada_utch else ""
    doc = f'<!doctype html><html lang="es"><head><meta charset="utf-8"><base href="{src.parent.resolve().as_uri()}/"><style>{CSS}</style></head><body>{cover}{body}</body></html>'

    out = Path(a.salida).resolve()
    # <base href> resuelve imágenes relativas al .md sin escribir nada junto a él.
    with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False, encoding="utf-8") as f:
        f.write(doc)
        tmp = Path(f.name)
    try:
        r = subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
                            f"--print-to-pdf={out}", tmp.as_uri()], capture_output=True, text=True, timeout=120)
    finally:
        tmp.unlink(missing_ok=True)
    if r.returncode != 0 or not out.exists():
        print(r.stderr, file=sys.stderr)
        return 1
    print(out)
    return 0


if __name__ == "__main__":
    sys.exit(main())
