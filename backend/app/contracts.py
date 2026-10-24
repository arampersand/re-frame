"""Contratos compartidos entre backend y desktop. FUENTE DE VERDAD.

Regla de equipo: cambiar este archivo es cambiar la API de los 7.
- Solo con issue etiquetado `contract-change` y aprobación del integrador.
- Después de cambiarlo: `make contracts` regenera `contracts/schema.json` y
  `desktop/src/renderer/src/api/contracts.ts`. CI falla si no lo hiciste.
- Agregar un campo OPCIONAL no rompe a nadie. Renombrar o borrar sí.
"""
from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

Lang = Literal["es", "en"]
TopicStatus = Literal["sin_ver", "laguna", "en_progreso", "dominado"]


class Contract(BaseModel):
    # Las respuestas siempre traen todos los campos: TypeScript los ve requeridos.
    model_config = ConfigDict(json_schema_serialization_defaults_required=True)


# ---------- Perfil y semestre ----------

class Student(Contract):
    id: str
    name: str
    career: str
    semester: int
    preferred_lang: Lang = "es"
    goal: str = ""
    # Cómo prefiere que le expliquen primero. No es "estilo de aprendizaje":
    # el explicador SIEMPRE devuelve las 4 representaciones; esto solo ordena.
    preferred_representation: Literal["diagram", "analogy", "example", "summary"] = "diagram"


class Course(Contract):
    id: str
    name: str
    professor: str = ""
    schedule: str = ""  # texto libre: "L/M 10:30-11:50"


class Deadline(Contract):
    id: str
    course_id: str
    title: str
    due_at: str  # ISO-8601
    topic_ids: list[str] = []
    kind: Literal["tarea", "examen", "proyecto", "quiz"] = "tarea"


# ---------- Clases y transcripción ----------

class Segment(Contract):
    id: str
    lecture_id: str
    start_s: float
    end_s: float
    text: str
    lang: Lang | None = None
    confused: bool = False  # el estudiante marcó "no entendí" aquí


class Lecture(Contract):
    id: str
    course_id: str
    title: str
    recorded_at: str
    status: Literal["recording", "done"] = "done"
    topic_ids: list[str] = []
    segments: list[Segment] = []


# ---------- Explicación en múltiples representaciones ----------

class QuizQuestion(Contract):
    id: str
    prompt: str
    options: list[str] = Field(min_length=2)
    answer_index: int
    why: str = ""


class Explanation(Contract):
    topic_id: str | None = None
    topic_title: str
    lang: Lang = "es"
    diagram_mermaid: str  # código Mermaid; el desktop lo renderiza
    analogy: str
    worked_example: str
    summary: str
    quiz: list[QuizQuestion] = []
    degraded: bool = False  # True = no hubo LLM y se usó contenido de respaldo


class ExplainRequest(Contract):
    text: str  # fragmento que no entendió (o pregunta libre)
    topic_id: str | None = None
    lecture_id: str | None = None
    segment_ids: list[str] = []
    lang: Lang | None = None


# ---------- Estado por tema (lo que sabe / lo que no) ----------

class Topic(Contract):
    id: str
    course_id: str
    title: str
    status: TopicStatus = "sin_ver"
    score: float = Field(default=0.0, ge=0.0, le=1.0)
    confused_count: int = 0
    last_seen_at: str | None = None
    prerequisites: list[str] = []


class QuizResult(Contract):
    correct: int = Field(ge=0)
    total: int = Field(gt=0)


# ---------- Hoy: acciones propuestas, permiso y recibo ----------

ActionKind = Literal["study_block", "reminder"]
ActionStatus = Literal["proposed", "approved", "rejected", "done", "failed"]


class ProposedAction(Contract):
    id: str
    kind: ActionKind
    title: str
    why: str  # por qué el copiloto lo propone (siempre visible)
    topic_ids: list[str] = []
    deadline_id: str | None = None
    start_at: str  # ISO-8601
    end_at: str
    status: ActionStatus = "proposed"
    receipt_id: str | None = None


class Receipt(Contract):
    """Prueba del sistema destino. Sin recibo, el estado es desconocido."""
    id: str
    action_id: str
    target: Literal["google_calendar"]
    status: Literal["sent", "failed", "skipped"]
    reason: str | None = None  # obligatorio en failed/skipped
    verified: bool = False  # True = re-leímos el evento en Google y existe
    external_id: str | None = None
    external_url: str | None = None
    created_at: str


class TodayView(Contract):
    date: str
    student: Student
    actions: list[ProposedAction]
    upcoming: list[Deadline]
    weakest_topics: list[Topic]


# ---------- Integridad académica ----------

class AskRequest(Contract):
    text: str
    lang: Lang | None = None


class AskResponse(Contract):
    refused: bool  # True = pidió que le hicieran la tarea
    message: str
    guided_steps: list[str] = []
    suggested_action: ProposedAction | None = None


# Modelos que el desktop ENVÍA (se exportan con defaults opcionales).
REQUESTS = [ExplainRequest, QuizResult, AskRequest]

# Modelos exportados a JSON Schema / TypeScript. Agrega aquí los nuevos.
EXPORTED = [
    Student, Course, Deadline, Segment, Lecture, QuizQuestion, Explanation,
    ExplainRequest, Topic, QuizResult, ProposedAction, Receipt, TodayView,
    AskRequest, AskResponse,
]
