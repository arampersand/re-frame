"""Integridad académica: Re-Frame explica, nunca hace la tarea por ti.

Regla determinista (no depende del LLM). Si el texto pide entregar trabajo
evaluado, se rechaza y se ofrece un plan guiado. Agrega patrones aquí con test.
"""
from __future__ import annotations

import re

_PATTERNS = [
    r"\b(haz|hazme|haga|resuelve|resuélveme|resuelveme|contesta|contéstame|escribe|escríbeme|redacta)\b.{0,25}\b(tarea|ensayo|examen|quiz|proyecto|ejercicios?|práctica|practica|reporte)\b",
    r"\bdame\b.{0,15}\b(las )?respuestas\b",
    r"\b(do|write|finish|solve|complete)\b.{0,15}\b(my|the)\b.{0,15}\b(homework|assignment|essay|exam|quiz|project|lab)\b",
    r"\b(give me|send me)\b.{0,15}\b(the )?answers\b",
]
_RX = [re.compile(p, re.IGNORECASE) for p in _PATTERNS]


def asks_for_graded_work(text: str) -> bool:
    return any(rx.search(text) for rx in _RX)


def refusal(lang: str = "es") -> str:
    if lang == "en":
        return ("I won't do it for you, but I'll break it down so you can do it yourself. "
                "Here's a guided plan, and I can block time on your calendar for it.")
    return ("No la hago por ti, pero te la desarmo para que la hagas tú. "
            "Aquí tienes un plan guiado y te puedo apartar tiempo en tu calendario.")


DEFAULT_STEPS_ES = [
    "Lee el enunciado y escribe en una línea qué te piden entregar.",
    "Identifica qué tema de clase usa; abre su explicación en Re-Frame.",
    "Resuelve un caso pequeño a mano antes de escribir la versión final.",
    "Revisa tu respuesta contra el ejemplo resuelto del tema.",
]
DEFAULT_STEPS_EN = [
    "Read the prompt and write in one line what you must deliver.",
    "Find which lecture topic it uses; open its explanation in Re-Frame.",
    "Solve a tiny case by hand before writing the final version.",
    "Check your answer against the topic's worked example.",
]
