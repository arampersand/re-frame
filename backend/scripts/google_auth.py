"""Saca tu GOOGLE_REFRESH_TOKEN para Calendar. Una sola vez por persona.

1. Google Cloud Console → APIs → habilita "Google Calendar API".
2. Credenciales → OAuth client ID → tipo "Desktop app". Copia ID y secret al .env.
3. Pantalla de consentimiento en modo Testing y agrega tu correo como test user.
4. Corre:  python scripts/google_auth.py   y pega el token que imprime en .env.
"""
from __future__ import annotations

import http.server
import secrets
import sys
import threading
import urllib.parse
import webbrowser
from pathlib import Path

import httpx

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app.config import settings  # noqa: E402

PORT = 8765
REDIRECT = f"http://127.0.0.1:{PORT}/callback"
SCOPE = "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.freebusy"
result: dict = {}


class Handler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):  # noqa: N802
        q = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
        result.update({k: v[0] for k, v in q.items()})
        self.send_response(200)
        self.end_headers()
        self.wfile.write("Listo. Regresa a la terminal.".encode())

    def log_message(self, *_):
        pass


def main() -> None:
    if not (settings.GOOGLE_CLIENT_ID and settings.GOOGLE_CLIENT_SECRET):
        sys.exit("Falta GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET en .env")
    state = secrets.token_urlsafe(16)
    url = "https://accounts.google.com/o/oauth2/v2/auth?" + urllib.parse.urlencode({
        "client_id": settings.GOOGLE_CLIENT_ID, "redirect_uri": REDIRECT, "response_type": "code",
        "scope": SCOPE, "access_type": "offline", "prompt": "consent", "state": state,
    })
    server = http.server.HTTPServer(("127.0.0.1", PORT), Handler)
    threading.Thread(target=server.handle_request, daemon=True).start()
    print("Abriendo el navegador. Si no abre, visita:\n" + url)
    webbrowser.open(url)
    while "code" not in result and "error" not in result:
        threading.Event().wait(0.3)
    if result.get("state") != state or "code" not in result:
        sys.exit(f"Falló la autorización: {result}")
    resp = httpx.post("https://oauth2.googleapis.com/token", data={
        "code": result["code"], "client_id": settings.GOOGLE_CLIENT_ID,
        "client_secret": settings.GOOGLE_CLIENT_SECRET, "redirect_uri": REDIRECT,
        "grant_type": "authorization_code",
    })
    resp.raise_for_status()
    token = resp.json().get("refresh_token")
    print(f"\nGOOGLE_REFRESH_TOKEN={token}\n\nPégalo en tu .env (nunca en git).")


if __name__ == "__main__":
    main()
