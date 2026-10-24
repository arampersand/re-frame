"""Transcripción bilingüe. OpenAI Whisper primero, Groq Whisper de respaldo.

Recibe un archivo de audio completo (webm/ogg/wav/mp3/m4a): el desktop graba
segmentos de ~15 s y sube cada uno como archivo independiente.
"""
from __future__ import annotations

import io

from loguru import logger

from app.config import settings

_GROQ_BASE = "https://api.groq.com/openai/v1"


async def transcribe_file(data: bytes, filename: str) -> dict | None:
    """Devuelve {"text", "lang", "segments": [{"start","end","text"}]} o None."""
    if len(data) < 2000:
        logger.warning(f"STT: audio demasiado corto ({len(data)} bytes)")
        return None
    for name, key, base, model in (
        ("openai", settings.OPENAI_API_KEY, None, "whisper-1"),
        ("groq", settings.GROQ_API_KEY, _GROQ_BASE, "whisper-large-v3-turbo"),
    ):
        if not key:
            continue
        try:
            return await _whisper(data, filename, key, base, model)
        except Exception as exc:  # siguiente proveedor
            logger.warning(f"STT {name} falló: {exc}")
    logger.warning("STT: sin proveedor (configura OPENAI_API_KEY o GROQ_API_KEY)")
    return None


async def _whisper(data: bytes, filename: str, key: str, base: str | None, model: str) -> dict:
    from openai import AsyncOpenAI

    client = AsyncOpenAI(api_key=key, base_url=base) if base else AsyncOpenAI(api_key=key)
    buf = io.BytesIO(data)
    buf.name = filename
    kwargs = {"model": model, "file": buf, "response_format": "verbose_json"}
    if settings.STT_LANGUAGE:
        kwargs["language"] = settings.STT_LANGUAGE
    resp = await client.audio.transcriptions.create(**kwargs)
    lang = (getattr(resp, "language", "") or "").lower()
    lang = "es" if lang.startswith(("es", "spanish")) else "en" if lang.startswith(("en", "english")) else None
    segments = [
        {"start": float(s.start), "end": float(s.end), "text": s.text.strip()}
        for s in (getattr(resp, "segments", None) or [])
    ]
    return {"text": resp.text.strip(), "lang": lang, "segments": segments}
