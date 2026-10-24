"""Exporta app/contracts.py a contracts/schema.json (lo consume el desktop).

Uso: python scripts/export_contracts.py          → escribe el archivo
     python scripts/export_contracts.py --check  → falla si está desactualizado
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from pydantic.json_schema import models_json_schema  # noqa: E402

from app.contracts import EXPORTED, REQUESTS  # noqa: E402

OUT = Path(__file__).resolve().parents[2] / "contracts" / "schema.json"


def _strip_titles(node) -> None:
    """Quita los títulos de propiedades para que no salgan alias tipo `Id1`."""
    if isinstance(node, dict):
        for prop in (node.get("properties") or {}).values():
            if isinstance(prop, dict):
                prop.pop("title", None)
        for v in node.values():
            _strip_titles(v)
    elif isinstance(node, list):
        for v in node:
            _strip_titles(v)


def build() -> str:
    # Respuestas en modo "serialization": un campo con default siempre viene,
    # así TypeScript no lo marca como opcional. Peticiones en modo "validation".
    pairs = [(m, "validation" if m in REQUESTS else "serialization") for m in EXPORTED]
    _, schema = models_json_schema(pairs, title="ReFrameContracts")
    _strip_titles(schema)
    # Raíz con una propiedad por modelo: así json-schema-to-typescript exporta todos.
    schema["type"] = "object"
    schema["properties"] = {m.__name__: {"$ref": f"#/$defs/{m.__name__}"} for m in EXPORTED}
    schema["additionalProperties"] = False
    return json.dumps(schema, ensure_ascii=False, indent=2, sort_keys=True) + "\n"


if __name__ == "__main__":
    text = build()
    if "--check" in sys.argv:
        if not OUT.exists() or OUT.read_text(encoding="utf-8") != text:
            print("contracts/schema.json está desactualizado. Corre: make contracts", file=sys.stderr)
            sys.exit(1)
        print("contratos al día")
    else:
        OUT.parent.mkdir(parents=True, exist_ok=True)
        OUT.write_text(text, encoding="utf-8")
        print(f"escrito {OUT}")
