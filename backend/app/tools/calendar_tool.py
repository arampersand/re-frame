"""Google Calendar v3 vía httpx (adaptado de Auren). Nunca lanza excepciones.

Regla de oro: crear un evento no basta. `verify_event` lo vuelve a leer en
Google; solo entonces el recibo dice verified=True.
"""
from __future__ import annotations

import httpx
from loguru import logger

from app.config import settings

_TOKEN_URL = "https://oauth2.googleapis.com/token"
_BASE = "https://www.googleapis.com/calendar/v3"


class CalendarTool:
    def __init__(self) -> None:
        self._access_token = ""

    @property
    def configured(self) -> bool:
        return bool(
            settings.GOOGLE_REFRESH_TOKEN
            and settings.GOOGLE_CLIENT_ID
            and settings.GOOGLE_CLIENT_SECRET
        )

    async def _refresh(self) -> bool:
        if not self.configured:
            return False
        try:
            async with httpx.AsyncClient(timeout=15) as client:
                resp = await client.post(_TOKEN_URL, data={
                    "refresh_token": settings.GOOGLE_REFRESH_TOKEN,
                    "client_id": settings.GOOGLE_CLIENT_ID,
                    "client_secret": settings.GOOGLE_CLIENT_SECRET,
                    "grant_type": "refresh_token",
                })
                resp.raise_for_status()
                self._access_token = resp.json()["access_token"]
            return True
        except Exception as exc:
            logger.warning(f"Google token refresh falló: {exc}")
            return False

    async def _request(self, method: str, path: str, **kwargs) -> httpx.Response:
        if not self._access_token:
            await self._refresh()
        async with httpx.AsyncClient(timeout=15) as client:
            headers = {"Authorization": f"Bearer {self._access_token}"}
            resp = await client.request(method, f"{_BASE}{path}", headers=headers, **kwargs)
            if resp.status_code == 401 and await self._refresh():
                headers = {"Authorization": f"Bearer {self._access_token}"}
                resp = await client.request(method, f"{_BASE}{path}", headers=headers, **kwargs)
            resp.raise_for_status()
            return resp

    def _cal(self) -> str:
        return settings.GOOGLE_CALENDAR_ID

    async def create_event(self, summary: str, start_at: str, end_at: str, description: str = "") -> dict:
        """{"ok", "event_id", "html_link"} o {"ok": False, "error"}."""
        body = {
            "summary": summary,
            "description": description,
            "start": {"dateTime": start_at, "timeZone": settings.TIMEZONE},
            "end": {"dateTime": end_at, "timeZone": settings.TIMEZONE},
            "reminders": {"useDefault": False, "overrides": [{"method": "popup", "minutes": 15}]},
        }
        try:
            data = (await self._request("POST", f"/calendars/{self._cal()}/events", json=body)).json()
            return {"ok": True, "event_id": data.get("id"), "html_link": data.get("htmlLink")}
        except Exception as exc:
            logger.error(f"Calendar create_event falló: {exc}")
            return {"ok": False, "error": str(exc)}

    async def verify_event(self, event_id: str) -> bool:
        """Relee el evento en Google. True solo si existe y no está cancelado."""
        try:
            data = (await self._request("GET", f"/calendars/{self._cal()}/events/{event_id}")).json()
            return data.get("status") != "cancelled"
        except Exception as exc:
            logger.warning(f"Calendar verify_event falló: {exc}")
            return False

    async def busy(self, time_min: str, time_max: str) -> list[dict]:
        """Intervalos ocupados. [] si no hay Google configurado."""
        if not self.configured:
            return []
        try:
            data = (await self._request("POST", "/freeBusy", json={
                "timeMin": time_min, "timeMax": time_max,
                "timeZone": settings.TIMEZONE, "items": [{"id": self._cal()}],
            })).json()
            return data.get("calendars", {}).get(self._cal(), {}).get("busy", [])
        except Exception as exc:
            logger.warning(f"Calendar busy falló: {exc}")
            return []


calendar_tool = CalendarTool()
