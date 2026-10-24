import pytest

from app import store
from app.config import settings


@pytest.fixture(autouse=True)
def isolated_state(tmp_path, monkeypatch):
    """Cada test arranca del seed, sin llaves y sin tocar Google."""
    monkeypatch.setattr(settings, "STATE_FILE", tmp_path / "state.json")
    monkeypatch.setattr(settings, "DRY_RUN", True)
    for k in ("ANTHROPIC_API_KEY", "GROQ_API_KEY", "GEMINI_API_KEY", "OPENAI_API_KEY",
              "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REFRESH_TOKEN"):
        monkeypatch.setattr(settings, k, "")
    store.load(reset=True)
    yield


@pytest.fixture
def client():
    from fastapi.testclient import TestClient

    from app.main import app
    with TestClient(app) as c:
        yield c
