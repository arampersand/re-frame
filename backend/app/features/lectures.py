"""Clases: grabar por segmentos, transcribir, marcar "no entendí".
Dueño: Audio (ver issues `area:audio`).
"""
from __future__ import annotations

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from pydantic import BaseModel

from app import store
from app.audio.stt import transcribe_file
from app.contracts import Lecture, Segment
from app.features.topics import mark_confused

router = APIRouter(prefix="/api/lectures", tags=["lectures"])


class NewLecture(BaseModel):
    course_id: str
    title: str


@router.get("", response_model=list[Lecture])
async def list_lectures(course_id: str | None = None):
    items = store.all("lectures")
    if course_id:
        items = [x for x in items if x["course_id"] == course_id]
    return sorted(items, key=lambda x: x["recorded_at"], reverse=True)


@router.get("/{lecture_id}", response_model=Lecture)
async def get_lecture(lecture_id: str):
    lec = store.get("lectures", lecture_id)
    if not lec:
        raise HTTPException(404, "clase no encontrada")
    return lec


@router.post("", response_model=Lecture)
async def create_lecture(body: NewLecture):
    if not store.get("courses", body.course_id):
        raise HTTPException(404, "materia no encontrada")
    course_topics = [t["id"] for t in store.all("topics") if t["course_id"] == body.course_id]
    lec = Lecture(
        id=store.new_id("lec"), course_id=body.course_id, title=body.title,
        recorded_at=store.now_iso(), status="recording", topic_ids=course_topics,
    )
    return store.upsert("lectures", lec.model_dump())


@router.post("/{lecture_id}/audio", response_model=list[Segment])
async def upload_audio(lecture_id: str, file: UploadFile = File(...), offset_s: float = Form(0.0)):
    """Sube un pedazo de audio (o un archivo completo). Devuelve los segmentos nuevos."""
    lec = store.get("lectures", lecture_id)
    if not lec:
        raise HTTPException(404, "clase no encontrada")
    result = await transcribe_file(await file.read(), file.filename or "chunk.webm")
    if result is None:
        raise HTTPException(503, "no se pudo transcribir: revisa OPENAI_API_KEY o GROQ_API_KEY")
    parts = result["segments"] or [{"start": 0.0, "end": 0.0, "text": result["text"]}]
    new = [
        Segment(
            id=store.new_id("seg"), lecture_id=lecture_id, lang=result["lang"],
            start_s=offset_s + p["start"], end_s=offset_s + p["end"], text=p["text"],
        ).model_dump()
        for p in parts if p["text"]
    ]
    lec["segments"].extend(new)
    store.upsert("lectures", lec)
    return new


@router.post("/{lecture_id}/finish", response_model=Lecture)
async def finish_lecture(lecture_id: str):
    lec = store.get("lectures", lecture_id)
    if not lec:
        raise HTTPException(404, "clase no encontrada")
    lec["status"] = "done"
    return store.upsert("lectures", lec)


@router.post("/{lecture_id}/segments/{segment_id}/confused", response_model=Segment)
async def segment_confused(lecture_id: str, segment_id: str, topic_id: str | None = None):
    """El estudiante tocó una frase: "no entendí esto"."""
    lec = store.get("lectures", lecture_id)
    seg = next((s for s in (lec or {}).get("segments", []) if s["id"] == segment_id), None)
    if not seg:
        raise HTTPException(404, "segmento no encontrado")
    seg["confused"] = True
    store.upsert("lectures", lec)
    if topic_id:
        mark_confused(topic_id)
    return seg
