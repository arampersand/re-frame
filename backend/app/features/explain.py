"""Explicador: el mismo concepto en 4 representaciones + quiz de 3.
Dueño: Explicador (ver issues `area:explain`).

Nunca falla hacia el usuario: si el LLM no responde o responde mal, usa el
contenido de respaldo del seed (degraded=True) para que la demo siga viva.
"""
from __future__ import annotations

from fastapi import APIRouter
from loguru import logger
from pydantic import ValidationError

from app import store
from app.ai.llm_client import chat_json
from app.contracts import Explanation, ExplainRequest

router = APIRouter(prefix="/api", tags=["explain"])

SYSTEM = """Eres Re-Frame, tutor de un estudiante universitario de {career}.
El estudiante no entendió algo en clase. Explica el MISMO concepto de 4 formas
y luego verifica con un quiz. Nunca resuelvas tareas ni exámenes por él.

Responde SOLO JSON con esta forma exacta:
{{
  "topic_title": "nombre corto del concepto",
  "diagram_mermaid": "código Mermaid válido (flowchart TD o graph) sin fences",
  "analogy": "analogía de la vida diaria, 2-4 oraciones",
  "worked_example": "ejemplo resuelto paso a paso con números o código pequeño",
  "summary": "3 viñetas que empiecen con '- '",
  "quiz": [
    {{"id": "q1", "prompt": "...", "options": ["...","...","...","..."], "answer_index": 0, "why": "..."}},
    {{"id": "q2", ...}}, {{"id": "q3", ...}}
  ]
}}
Idioma de toda la respuesta: {lang_name}. Nivel: {semester}° semestre.
Representación preferida (ponla más cuidada): {pref}."""


def _context(req: ExplainRequest) -> str:
    parts = [f"Lo que no entendió: {req.text}"]
    if req.topic_id and (t := store.get("topics", req.topic_id)):
        parts.append(f"Tema de la materia: {t['title']}")
    if req.lecture_id and (lec := store.get("lectures", req.lecture_id)):
        segs = lec["segments"]
        if req.segment_ids:
            idx = [i for i, s in enumerate(segs) if s["id"] in req.segment_ids]
            lo, hi = (max(0, min(idx) - 3), max(idx) + 4) if idx else (0, 0)
            segs = segs[lo:hi]
        else:
            segs = segs[-12:]
        if segs:
            parts.append("Lo que dijo el profesor:\n" + "\n".join(s["text"] for s in segs))
    return "\n\n".join(parts)


def _fallback(req: ExplainRequest, lang: str) -> Explanation:
    canned = store.canned_explanation(req.topic_id)
    if canned:
        return Explanation(**{**canned, "degraded": True})
    title = req.text[:60]
    return Explanation(
        topic_id=req.topic_id, topic_title=title, lang=lang, degraded=True,
        diagram_mermaid=f'flowchart TD\n  A["{title}"] --> B["Configura una llave de LLM"]',
        analogy="Sin conexión al modelo no puedo generar la analogía todavía.",
        worked_example="Configura ANTHROPIC_API_KEY o GROQ_API_KEY en .env.",
        summary="- Modo sin LLM\n- Revisa /api/health\n- El seed tiene ejemplos completos",
        quiz=[],
    )


@router.post("/explain", response_model=Explanation)
async def explain(req: ExplainRequest) -> Explanation:
    st = store.student()
    lang = req.lang or st.get("preferred_lang", "es")
    system = SYSTEM.format(
        career=st["career"], semester=st["semester"],
        lang_name="español" if lang == "es" else "English",
        pref=st.get("preferred_representation", "diagram"),
    )
    data = await chat_json(system, _context(req))
    if data:
        try:
            return Explanation(**{**data, "topic_id": req.topic_id, "lang": lang})
        except ValidationError as exc:
            logger.warning(f"explain: el LLM no respetó el contrato: {exc.error_count()} errores")
    return _fallback(req, lang)
