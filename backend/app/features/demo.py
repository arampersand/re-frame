"""Datos base, salud y reset de la demo. Dueño: Integrador."""
from __future__ import annotations

from fastapi import APIRouter

from app import store
from app.config import settings
from app.contracts import Course, Deadline, Student
from app.tools.calendar_tool import calendar_tool

router = APIRouter(prefix="/api", tags=["demo"])


@router.get("/health")
async def health():
    return {
        "ok": True,
        "llm": {k: bool(getattr(settings, f"{k.upper()}_API_KEY")) for k in ("anthropic", "groq", "gemini", "openai")},
        "stt": bool(settings.OPENAI_API_KEY or settings.GROQ_API_KEY),
        "calendar": calendar_tool.configured,
        "dry_run": settings.DRY_RUN,
    }


@router.get("/student", response_model=Student)
async def student():
    return store.student()


@router.get("/courses", response_model=list[Course])
async def courses():
    return store.all("courses")


@router.get("/deadlines", response_model=list[Deadline])
async def deadlines():
    return sorted(store.all("deadlines"), key=lambda d: d["due_at"])


@router.post("/demo/reset")
async def reset():
    """Vuelve al semestre de demo con fechas recalculadas a partir de hoy."""
    store.load(reset=True)
    return {"ok": True}
