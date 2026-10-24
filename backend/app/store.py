"""Almacén del hackathon: un JSON en memoria que se guarda en disco.

Default alive: al arrancar carga `data/state.json`; si no existe, copia el
semestre de demo de `seed/`. `POST /api/demo/reset` vuelve al seed.
Colecciones: student, courses, deadlines, topics, lectures, actions, receipts,
canned_explanations (contenido de respaldo cuando no hay LLM).

Si alguien necesita una colección nueva: agrégala al seed, no a otro archivo.
"""
from __future__ import annotations

import json
import re
import uuid
from datetime import datetime, timedelta, timezone
from typing import Any
from zoneinfo import ZoneInfo

from app.config import settings

_state: dict[str, Any] = {}
COLLECTIONS = ("courses", "deadlines", "topics", "lectures", "actions", "receipts")


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def new_id(prefix: str) -> str:
    return f"{prefix}_{uuid.uuid4().hex[:10]}"


def load(reset: bool = False) -> None:
    global _state
    sf = settings.STATE_FILE
    if reset or not sf.exists():
        seed = json.loads(settings.SEED_FILE.read_text(encoding="utf-8"))
        _state = resolve_relative(seed)
        for name in COLLECTIONS:
            _state.setdefault(name, [])
        _state.setdefault("canned_explanations", {})
        save()
        return
    _state = json.loads(sf.read_text(encoding="utf-8"))
    for name in COLLECTIONS:
        _state.setdefault(name, [])
    _state.setdefault("canned_explanations", {})


_REL = re.compile(r"^rel:([+-]\d+)d@(\d{2}):(\d{2})$")


def resolve_relative(obj: Any, today: datetime | None = None) -> Any:
    """El seed usa fechas relativas ("rel:+3d@23:59") para que la demo
    siempre tenga entregas en el futuro, sin importar cuándo la corras."""
    tz = ZoneInfo(settings.TIMEZONE)
    base = (today or datetime.now(tz)).astimezone(tz)
    if isinstance(obj, str):
        m = _REL.match(obj)
        if not m:
            return obj
        days, hh, mm = int(m.group(1)), int(m.group(2)), int(m.group(3))
        d = (base + timedelta(days=days)).replace(hour=hh, minute=mm, second=0, microsecond=0)
        return d.isoformat()
    if isinstance(obj, dict):
        return {k: resolve_relative(v, base) for k, v in obj.items()}
    if isinstance(obj, list):
        return [resolve_relative(v, base) for v in obj]
    return obj


def save() -> None:
    settings.STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    settings.STATE_FILE.write_text(json.dumps(_state, ensure_ascii=False, indent=2), encoding="utf-8")


def _ensure() -> None:
    if not _state:
        load()


def student() -> dict:
    _ensure()
    return _state["student"]


def all(collection: str) -> list[dict]:  # noqa: A001
    _ensure()
    return _state[collection]


def get(collection: str, item_id: str) -> dict | None:
    return next((x for x in all(collection) if x["id"] == item_id), None)


def upsert(collection: str, item: dict) -> dict:
    items = all(collection)
    for i, x in enumerate(items):
        if x["id"] == item["id"]:
            items[i] = item
            break
    else:
        items.append(item)
    save()
    return item


def canned_explanation(topic_id: str | None) -> dict | None:
    _ensure()
    return _state["canned_explanations"].get(topic_id or "")
