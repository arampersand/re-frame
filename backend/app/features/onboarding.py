"""Onboarding como elicitación avanzada. Dueño: Ary (motor) + Magio (UI) + Leo (preguntas).

Principios (ver docs/USER-JOURNEY.md):
1. Nunca preguntes lo que puedes importar (iCal, syllabus) o medir (quiz).
2. Pregunta por conducta reciente, no por etiquetas ("¿qué hiciste la última
   vez que…?" en vez de "¿eres visual?").
3. Escalera de porqués: la meta declarada casi nunca es la meta real.
4. Revelado > declarado: la preferencia de explicación se MIDE con un contraste.
5. Cada pregunta dice por qué la hacemos y se puede saltar. Máximo 8.
6. Al final, reflejamos "esto entendí de ti" y el estudiante corrige.

El motor es determinista. El LLM solo extrae valores de respuestas abiertas y
redacta la pregunta de seguimiento; si no hay LLM, todo sigue funcionando.
"""
from __future__ import annotations

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app import store
from app.ai.llm_client import chat_json
from app.contracts import (
    Evidence, OnboardingAnswer, OnboardingOption, OnboardingQuestion, OnboardingState,
    Profile, Reflection,
)

router = APIRouter(prefix="/api/onboarding", tags=["onboarding"])

O = OnboardingOption
# Banco de preguntas. El orden es la prioridad. `ask_if` decide si aplica.
# Para editar textos no hace falta programar: cambia prompt/why/labels.
BANK: list[dict] = [
    {"q": OnboardingQuestion(
        id="goal", slot="goal", kind="text",
        prompt="Si este semestre sale como quieres, ¿qué es distinto en diciembre?",
        why="Todo lo que te proponga va a apuntar a esto.")},
    {"q": OnboardingQuestion(
        id="stake", slot="stake", kind="text",
        prompt="¿Y qué pasa si no lo logras?",
        why="Lo que está en juego decide qué tan agresivo es tu plan de repaso."),
     "ask_if": lambda a: _answered(a, "goal"), "ladder_from": "goal"},
    {"q": OnboardingQuestion(
        id="work", slot="work_hours", kind="choice",
        prompt="¿Cuántas horas a la semana trabajas?",
        why="Si trabajas, te propongo bloques cortos en vez de sesiones largas.",
        options=[O(id="0", label="No trabajo"), O(id="1-15", label="Hasta 15"),
                 O(id="16-30", label="16 a 30"), O(id="30+", label="Más de 30")])},
    {"q": OnboardingQuestion(
        id="window", slot="study_window", kind="choice",
        prompt="¿A qué hora sí te entra lo que estudias?",
        why="Ahí acomodo tus repasos en el calendario.",
        options=[O(id="morning", label="En la mañana"), O(id="afternoon", label="En la tarde"),
                 O(id="night", label="En la noche"), O(id="gaps", label="En huecos entre clases")])},
    {"q": OnboardingQuestion(
        id="episode", slot="help_style", kind="text",
        prompt="Cuéntame la última vez que no entendiste algo en clase. ¿Qué hiciste después?",
        why="Me dice cómo buscas ayuda hoy, para no estorbarte y llenar el hueco correcto.")},
    {"q": OnboardingQuestion(
        id="contrast", slot="representation", kind="contrast",
        prompt="Tres formas de explicar Big-O. ¿Cuál te hizo click más rápido?",
        why="No te pregunto si eres visual: lo medimos. Esta será la primera forma que veas.",
        options=[
            O(id="diagram", label="Un dibujo: la curva de n² se dispara y la de log n casi no sube."),
            O(id="analogy", label="Buscar un nombre en el directorio: hoja por hoja (n) o abriendo a la mitad (log n)."),
            O(id="example", label="Con 1,000 datos: n² son un millón de pasos; log n son 10."),
            O(id="summary", label="Big-O cuenta cómo crecen los pasos cuando crece la entrada."),
        ])},
    {"q": OnboardingQuestion(
        id="lang", slot="think_lang", kind="choice",
        prompt="Cuando resuelves un problema de matemáticas, ¿en qué idioma piensas?",
        why="Te explico en ese idioma aunque la clase sea en otro.",
        options=[O(id="es", label="Español"), O(id="en", label="Inglés"), O(id="mix", label="Una mezcla")])},
    {"q": OnboardingQuestion(
        id="worry", slot="worry_course", kind="choice",
        prompt="¿Qué materia te quita el sueño?",
        why="Empiezo midiendo esa con un quiz corto, en vez de preguntarte qué tan bien vas.",
        options=[])},  # se llena con las materias importadas
]
BY_ID = {b["q"].id: b for b in BANK}
MAX_QUESTIONS = len(BANK)

WINDOWS = {"morning": (7, 12), "afternoon": (13, 18), "night": (18, 23), "gaps": (10, 20)}
BLOCK_MINUTES = {"0": 50, "1-15": 40, "16-30": 25, "30+": 25}
LABELS = {"diagram": "un diagrama", "analogy": "una analogía", "example": "un ejemplo resuelto",
          "summary": "un resumen"}


def _state() -> dict:
    return store.section("onboarding", _empty())


def _empty() -> dict:
    return {"answered": {}, "profile": {"slots": {}, "confirmed": False}}


def _answered(answered: dict, qid: str) -> bool:
    a = answered.get(qid)
    return bool(a) and not a.get("skipped")


def _question(bid: str) -> OnboardingQuestion:
    q = BY_ID[bid]["q"].model_copy(deep=True)
    if q.id == "worry":
        q.options = [O(id=c["id"], label=c["name"]) for c in store.all("courses")]
    return q


def _next(answered: dict) -> OnboardingQuestion | None:
    for b in BANK:
        qid = b["q"].id
        if qid in answered:
            continue
        if "ask_if" in b and not b["ask_if"](answered):
            continue
        q = _question(qid)
        if qid == "stake":
            q.prompt = answered.get("goal", {}).get("ladder_prompt") or q.prompt
        return q
    return None


async def _extract(slot: str, prompt: str, text: str) -> tuple[str, float, str | None]:
    """Respuesta abierta → (valor, confianza, cita). Sin LLM: la respuesta tal cual."""
    data = await chat_json(
        "Extraes datos de un estudiante a partir de su respuesta. Devuelve SOLO JSON "
        '{"value": "resumen de 3 a 12 palabras", "confidence": 0.0-1.0, "quote": "frase literal clave"}. '
        "confidence baja si la respuesta es vaga. No inventes.",
        f"Dato buscado: {slot}\nPregunta: {prompt}\nRespuesta: {text}",
    )
    value = str(data.get("value") or "").strip()
    if not value:
        return text.strip()[:120], 0.5, text.strip()[:160]
    try:
        conf = max(0.0, min(1.0, float(data.get("confidence", 0.6))))
    except (TypeError, ValueError):
        conf = 0.6
    return value, conf, (data.get("quote") or None)


async def _ladder(goal: str) -> str | None:
    """Siguiente peldaño de la escalera de porqués, en palabras del estudiante."""
    data = await chat_json(
        "Eres un orientador. El estudiante dijo su meta. Escribe UNA pregunta corta, cálida, "
        "en español, que descubra qué está en juego para él (beca, promedio, trabajo, familia, "
        'visa) sin sugerir respuestas. Devuelve SOLO JSON {"question": "..."}',
        goal,
    )
    q = str(data.get("question") or "").strip()
    return q if 10 < len(q) < 160 else None


def _set(profile: dict, slot: str, ev: Evidence) -> None:
    """Lo medido le gana a lo declarado, y lo declarado a lo inferido."""
    rank = {"inferred": 0, "imported": 1, "stated": 2, "measured": 3}
    cur = profile["slots"].get(slot)
    if cur and rank[cur["source"]] > rank[ev.source] and cur["confidence"] >= ev.confidence:
        return
    profile["slots"][slot] = ev.model_dump()


async def _apply(answer: OnboardingAnswer, q: OnboardingQuestion, profile: dict, record: dict) -> None:
    if answer.skipped:
        return
    if q.kind == "text":
        text = (answer.text or "").strip()
        if not text:
            raise HTTPException(422, "respuesta vacía; usa skipped=true para saltar")
        value, conf, quote = await _extract(q.slot, q.prompt, text)
        _set(profile, q.slot, Evidence(value=value, source="stated", confidence=conf, quote=quote))
        if q.id == "goal":
            record["ladder_prompt"] = await _ladder(text)
        return
    valid = {o.id: o.label for o in q.options}
    if answer.option_id not in valid:
        raise HTTPException(422, f"opción inválida para {q.id}")
    oid = answer.option_id
    source = "measured" if q.kind == "contrast" else "stated"
    _set(profile, q.slot, Evidence(value=oid, source=source, confidence=0.8 if source == "measured" else 0.9,
                                   quote=valid[oid]))
    # Inferencias deterministas: cada una dice de qué respuesta salió.
    if q.id == "work":
        _set(profile, "block_minutes", Evidence(value=str(BLOCK_MINUTES[oid]), source="inferred",
                                                confidence=0.7, quote=valid[oid]))
    if q.id == "lang":
        _set(profile, "explain_lang", Evidence(value="en" if oid == "en" else "es", source="inferred",
                                               confidence=0.7, quote=valid[oid]))


def reflections(profile: dict) -> list[Reflection]:
    s = profile["slots"]
    out: list[Reflection] = []

    def add(slot: str, text: str) -> None:
        out.append(Reflection(slot=slot, statement=text, source=s[slot]["source"]))

    if "goal" in s:
        add("goal", f"Tu meta: {s['goal']['value']}.")
    if "stake" in s:
        add("stake", f"Lo que está en juego: {s['stake']['value']}.")
    if "block_minutes" in s:
        add("block_minutes", f"Como trabajas, tus repasos durarán {s['block_minutes']['value']} minutos.")
    if "study_window" in s:
        a, b = WINDOWS.get(s["study_window"]["value"], (17, 22))
        add("study_window", f"Te propongo estudiar entre las {a}:00 y las {b}:00.")
    if "representation" in s:
        add("representation", f"Te hizo click {LABELS.get(s['representation']['value'], 'eso')}: lo verás primero.")
    if "explain_lang" in s:
        add("explain_lang", "Te explico en " + ("inglés." if s["explain_lang"]["value"] == "en" else "español."))
    if "help_style" in s:
        add("help_style", f"Cuando te atoras: {s['help_style']['value']}.")
    if "worry_course" in s:
        c = store.get("courses", s["worry_course"]["value"])
        add("worry_course", f"Empezamos midiendo {c['name'] if c else 'tu materia más difícil'} con un quiz corto.")
    return out


def _view(ob: dict) -> OnboardingState:
    answered = ob["answered"]
    nxt = None if ob["profile"].get("confirmed") else _next(answered)
    done = nxt is None
    return OnboardingState(
        step=len(answered), total_estimate=MAX_QUESTIONS, next_question=nxt,
        profile=Profile(**ob["profile"]), reflections=reflections(ob["profile"]) if done else [],
        done=done,
    )


def apply_to_student(profile: dict) -> None:
    """El perfil confirmado ajusta al estudiante que usan Hoy y el Explicador."""
    s, st = profile["slots"], store.student()
    if "goal" in s:
        st["goal"] = s["goal"]["value"]
    if s.get("representation", {}).get("value") in LABELS:
        st["preferred_representation"] = s["representation"]["value"]
    if "explain_lang" in s:
        st["preferred_lang"] = s["explain_lang"]["value"]
    store.save()


def study_window() -> tuple[int, int] | None:
    s = _state()["profile"]["slots"]
    return WINDOWS.get(s.get("study_window", {}).get("value", ""))


def block_minutes() -> int | None:
    v = _state()["profile"]["slots"].get("block_minutes", {}).get("value")
    return int(v) if v else None


@router.get("", response_model=OnboardingState)
async def get_state() -> OnboardingState:
    return _view(_state())


@router.post("/start", response_model=OnboardingState)
async def start() -> OnboardingState:
    ob = _state()
    ob.clear()
    ob.update(_empty())
    store.save()
    return _view(ob)


@router.post("/answer", response_model=OnboardingState)
async def answer(body: OnboardingAnswer) -> OnboardingState:
    ob = _state()
    if body.question_id not in BY_ID:
        raise HTTPException(404, "pregunta no encontrada")
    if ob["profile"].get("confirmed"):
        raise HTTPException(409, "el perfil ya está confirmado; usa /start para rehacerlo")
    record = body.model_dump()
    await _apply(body, _question(body.question_id), ob["profile"], record)
    ob["answered"][body.question_id] = record
    store.save()
    return _view(ob)


class Confirm(BaseModel):
    corrections: dict[str, str] = {}  # slot → texto corregido por el estudiante


@router.post("/confirm", response_model=OnboardingState)
async def confirm(body: Confirm) -> OnboardingState:
    ob = _state()
    for slot, text in body.corrections.items():
        if text.strip():
            _set(ob["profile"], slot, Evidence(value=text.strip(), source="stated", confidence=1.0, quote=text.strip()))
    ob["profile"]["confirmed"] = True
    apply_to_student(ob["profile"])
    store.save()
    return _view(ob)
