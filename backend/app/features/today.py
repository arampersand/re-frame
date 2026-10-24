"""Hoy: el copiloto propone, tú apruebas, Google confirma.
Dueño: Acciones (ver issues `area:actions`).

DISPARADOR → CONTEXTO → DECISIÓN → PERMISO → ACCIÓN → RECIBO.
El planificador es determinista: no necesita LLM para decidir qué repasar.
"""
from __future__ import annotations

from datetime import datetime, time, timedelta
from zoneinfo import ZoneInfo

from fastapi import APIRouter, HTTPException

from app import store
from app.config import settings
from app.features import onboarding
from app.contracts import Deadline, ProposedAction, Receipt, TodayView, Topic
from app.tools.calendar_tool import calendar_tool

router = APIRouter(prefix="/api", tags=["today"])

HORIZON_DAYS = 7
MAX_PROPOSALS = 3
STUDY_WINDOW = (time(17, 0), time(22, 0))
MINUTES = {"laguna": 50, "sin_ver": 50, "en_progreso": 25, "dominado": 15}


def _tz() -> ZoneInfo:
    return ZoneInfo(settings.TIMEZONE)


def _parse(iso: str) -> datetime:
    d = datetime.fromisoformat(iso)
    return d if d.tzinfo else d.replace(tzinfo=_tz())


def _overlaps(a0, a1, b0, b1) -> bool:
    return a0 < b1 and b0 < a1


def _window() -> tuple[time, time]:
    """La ventana que el estudiante eligió en el onboarding, o la default."""
    w = onboarding.study_window()
    return (time(w[0]), time(w[1])) if w else STUDY_WINDOW


def _next_slot(after: datetime, minutes: int, taken: list[tuple[datetime, datetime]]) -> datetime:
    day = after.date()
    w0, w1 = _window()
    for _ in range(HORIZON_DAYS):
        start = datetime.combine(day, w0, _tz())
        end_window = datetime.combine(day, w1, _tz())
        start = max(start, after)
        while start + timedelta(minutes=minutes) <= end_window:
            end = start + timedelta(minutes=minutes)
            if not any(_overlaps(start, end, b0, b1) for b0, b1 in taken):
                return start
            start += timedelta(minutes=15)
        day += timedelta(days=1)
    return after


def plan(now: datetime, busy: list[tuple[datetime, datetime]]) -> list[ProposedAction]:
    """Repasa primero el tema más débil de la entrega más cercana."""
    topics = {t["id"]: t for t in store.all("topics")}
    deadlines = sorted(
        (d for d in store.all("deadlines") if now < _parse(d["due_at"]) <= now + timedelta(days=HORIZON_DAYS)),
        key=lambda d: d["due_at"],
    )
    taken = list(busy) + [
        (_parse(a["start_at"]), _parse(a["end_at"]))
        for a in store.all("actions") if a["status"] in ("proposed", "approved", "done")
    ]
    out: list[ProposedAction] = []
    used_topics: set[str] = set()
    for d in deadlines:
        weak = sorted(
            (topics[t] for t in d["topic_ids"] if t in topics and topics[t]["status"] != "dominado"
             and t not in used_topics),
            key=lambda t: t["score"],
        )
        if not weak:
            continue
        t = weak[0]
        # Laguna = bloque completo; si trabaja, el onboarding lo acorta.
        minutes = MINUTES[t["status"]]
        if (cap := onboarding.block_minutes()):
            minutes = min(minutes, cap) if t["status"] != "laguna" else max(cap, 25)
        start = _next_slot(now + timedelta(minutes=30), minutes, taken)
        end = start + timedelta(minutes=minutes)
        if end > _parse(d["due_at"]):
            continue
        taken.append((start, end))
        used_topics.add(t["id"])
        course = store.get("courses", d["course_id"]) or {"name": ""}
        out.append(ProposedAction(
            id=store.new_id("act"), kind="study_block",
            title=f"Repasar {t['title']} ({course['name']})",
            why=(f"Tu {d['kind']} \"{d['title']}\" vence el "
                 f"{_parse(d['due_at']).strftime('%d/%m %H:%M')} y {t['title']} "
                 f"está en {t['status'].replace('_', ' ')} ({int(t['score'] * 100)}%)."),
            topic_ids=[t["id"]], deadline_id=d["id"],
            start_at=start.isoformat(), end_at=end.isoformat(),
        ))
        if len(out) >= MAX_PROPOSALS:
            break
    return out


@router.get("/today", response_model=TodayView)
async def today() -> TodayView:
    now = datetime.now(_tz())
    pending = [a for a in store.all("actions") if a["status"] == "proposed"]
    if not pending:
        raw = await calendar_tool.busy(now.isoformat(), (now + timedelta(days=HORIZON_DAYS)).isoformat())
        busy = [(_parse(b["start"]), _parse(b["end"])) for b in raw]
        for a in plan(now, busy):
            store.upsert("actions", a.model_dump())
    actions = [a for a in store.all("actions") if a["status"] in ("proposed", "approved", "done", "failed")]
    upcoming = sorted(
        (d for d in store.all("deadlines") if _parse(d["due_at"]) > now), key=lambda d: d["due_at"]
    )[:6]
    weakest = sorted(
        (t for t in store.all("topics") if t["status"] != "sin_ver"), key=lambda t: t["score"]
    )[:5]
    return TodayView(
        date=now.date().isoformat(), student=store.student(),
        actions=[ProposedAction(**a) for a in sorted(actions, key=lambda a: a["start_at"])],
        upcoming=[Deadline(**d) for d in upcoming], weakest_topics=[Topic(**t) for t in weakest],
    )


async def execute(action: dict) -> Receipt:
    """PERMISO ya lo dio el clic. Aquí: ACCIÓN y RECIBO."""
    rid = store.new_id("rcp")
    if settings.DRY_RUN or not calendar_tool.configured:
        reason = "DRY_RUN activo" if settings.DRY_RUN else "Google Calendar no configurado"
        return Receipt(id=rid, action_id=action["id"], target="google_calendar",
                       status="skipped", reason=reason, created_at=store.now_iso())
    res = await calendar_tool.create_event(
        summary=f"📚 {action['title']}", start_at=action["start_at"], end_at=action["end_at"],
        description=f"{action['why']}\n\nAgendado por Re-Frame con tu aprobación.",
    )
    if not res["ok"]:
        return Receipt(id=rid, action_id=action["id"], target="google_calendar",
                       status="failed", reason=res["error"][:300], created_at=store.now_iso())
    verified = await calendar_tool.verify_event(res["event_id"])
    return Receipt(id=rid, action_id=action["id"], target="google_calendar", status="sent",
                   verified=verified, external_id=res["event_id"], external_url=res["html_link"],
                   reason=None if verified else "Google aceptó pero no se pudo releer el evento",
                   created_at=store.now_iso())


@router.post("/actions/{action_id}/approve", response_model=Receipt)
async def approve(action_id: str) -> Receipt:
    action = store.get("actions", action_id)
    if not action:
        raise HTTPException(404, "acción no encontrada")
    if action["status"] != "proposed":
        raise HTTPException(409, f"la acción ya está {action['status']}")
    action["status"] = "approved"
    store.upsert("actions", action)
    receipt = await execute(action)
    store.upsert("receipts", receipt.model_dump())
    action["receipt_id"] = receipt.id
    action["status"] = {"sent": "done", "skipped": "approved", "failed": "failed"}[receipt.status]
    store.upsert("actions", action)
    return receipt


@router.post("/actions/{action_id}/reject", response_model=ProposedAction)
async def reject(action_id: str) -> ProposedAction:
    action = store.get("actions", action_id)
    if not action:
        raise HTTPException(404, "acción no encontrada")
    action["status"] = "rejected"
    return ProposedAction(**store.upsert("actions", action))


@router.get("/receipts", response_model=list[Receipt])
async def receipts() -> list[Receipt]:
    return [Receipt(**r) for r in sorted(store.all("receipts"), key=lambda r: r["created_at"], reverse=True)]
