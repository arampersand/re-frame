"""Estado por tema: qué sabe y qué no. Lógica determinista y testeada.
Dueño: Estado por tema (ver issues `area:mastery`).
"""
from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app import store
from app.contracts import QuizResult, Topic

router = APIRouter(prefix="/api/topics", tags=["topics"])

MASTERED, IN_PROGRESS = 0.75, 0.45
QUIZ_WEIGHT = 0.5
CONFUSED_PENALTY = 0.1


def status_for(score: float, seen: bool) -> str:
    if not seen:
        return "sin_ver"
    if score >= MASTERED:
        return "dominado"
    if score >= IN_PROGRESS:
        return "en_progreso"
    return "laguna"


def apply_quiz(topic: dict, result: QuizResult) -> dict:
    ratio = min(result.correct, result.total) / result.total
    old = topic["score"] if topic.get("last_seen_at") else ratio
    topic["score"] = round((1 - QUIZ_WEIGHT) * old + QUIZ_WEIGHT * ratio, 3)
    topic["last_seen_at"] = store.now_iso()
    topic["status"] = status_for(topic["score"], True)
    return topic


def apply_confused(topic: dict) -> dict:
    topic["confused_count"] = topic.get("confused_count", 0) + 1
    topic["score"] = round(max(0.0, topic["score"] - CONFUSED_PENALTY), 3)
    topic["last_seen_at"] = store.now_iso()
    topic["status"] = status_for(topic["score"], True)
    return topic


def mark_confused(topic_id: str) -> dict | None:
    t = store.get("topics", topic_id)
    return store.upsert("topics", apply_confused(t)) if t else None


@router.get("", response_model=list[Topic])
async def list_topics(course_id: str | None = None):
    items = store.all("topics")
    return [t for t in items if not course_id or t["course_id"] == course_id]


@router.post("/{topic_id}/quiz", response_model=Topic)
async def quiz_result(topic_id: str, body: QuizResult):
    t = store.get("topics", topic_id)
    if not t:
        raise HTTPException(404, "tema no encontrado")
    return store.upsert("topics", apply_quiz(t, body))


@router.post("/{topic_id}/confused", response_model=Topic)
async def topic_confused(topic_id: str):
    t = mark_confused(topic_id)
    if not t:
        raise HTTPException(404, "tema no encontrado")
    return t
