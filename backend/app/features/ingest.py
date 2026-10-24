"""Importar el semestre sin pedir contraseñas. Dueño: Acciones / Datos.

Pendiente (issues `area:ingest`): hoy responden 501 para que el desktop pueda
cablear la UI sin esperar. Nunca pedimos usuario ni contraseña del LMS.
"""
from __future__ import annotations

from fastapi import APIRouter, File, HTTPException, UploadFile
from pydantic import BaseModel

router = APIRouter(prefix="/api/ingest", tags=["ingest"])


class IcalRequest(BaseModel):
    url: str  # link de exportación iCal de Blackboard / Google / Outlook


@router.post("/ical")
async def ingest_ical(body: IcalRequest):
    """TODO: bajar el .ics, convertir VEVENT → Deadline, ligar a Course."""
    raise HTTPException(501, "pendiente: ver issue de importar iCal")


@router.post("/syllabus")
async def ingest_syllabus(file: UploadFile = File(...)):
    """TODO: PDF del syllabus → temas (Topic) y fechas (Deadline) vía LLM."""
    raise HTTPException(501, "pendiente: ver issue de importar syllabus")
