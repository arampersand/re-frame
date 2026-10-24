"""Pregunta libre con integridad académica. Dueño: Explicador + Integrador."""
from __future__ import annotations

from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from fastapi import APIRouter

from app import integrity, store
from app.ai.llm_client import chat_json, chat_text
from app.config import settings
from app.contracts import AskRequest, AskResponse, ProposedAction

router = APIRouter(prefix="/api", tags=["ask"])

STEPS_PROMPT = """El estudiante pidió que le hicieran trabajo evaluado. NO lo hagas.
Devuelve SOLO JSON {"steps": ["...", "...", "...", "..."]}: 4 pasos concretos para
que lo haga él mismo, sin dar la respuesta. Idioma: {lang}."""


def _guided_block(text: str) -> ProposedAction:
    tz = ZoneInfo(settings.TIMEZONE)
    start = (datetime.now(tz) + timedelta(days=1)).replace(hour=18, minute=0, second=0, microsecond=0)
    return ProposedAction(
        id=store.new_id("act"), kind="study_block",
        title="Trabajo guiado: " + text[:50],
        why="Pediste que lo hiciera por ti; mejor te aparto tiempo y te guío paso a paso.",
        start_at=start.isoformat(), end_at=(start + timedelta(minutes=40)).isoformat(),
    )


@router.post("/ask", response_model=AskResponse)
async def ask(req: AskRequest) -> AskResponse:
    lang = req.lang or store.student().get("preferred_lang", "es")
    if integrity.asks_for_graded_work(req.text):
        data = await chat_json(STEPS_PROMPT.replace("{lang}", lang), req.text)
        steps = data.get("steps") if isinstance(data.get("steps"), list) else None
        default = integrity.DEFAULT_STEPS_EN if lang == "en" else integrity.DEFAULT_STEPS_ES
        action = store.upsert("actions", _guided_block(req.text).model_dump())
        return AskResponse(
            refused=True, message=integrity.refusal(lang),
            guided_steps=[str(s) for s in (steps or default)][:6],
            suggested_action=ProposedAction(**action),
        )
    answer = await chat_text(
        "Eres Re-Frame, tutor universitario. Explica breve y claro, sin resolver "
        f"tareas evaluadas. Idioma: {lang}.", req.text,
    )
    return AskResponse(refused=False, message=answer or "No tengo conexión al modelo ahora mismo.")
