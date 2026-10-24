from pathlib import Path

from pydantic_settings import BaseSettings

BACKEND_DIR = Path(__file__).resolve().parents[1]


class Settings(BaseSettings):
    HOST: str = "127.0.0.1"
    PORT: int = 8787

    # LLM (failover Anthropic → Groq → Gemini → OpenAI). Con UNA basta.
    ANTHROPIC_API_KEY: str = ""
    ANTHROPIC_MODEL: str = "claude-sonnet-5"
    GROQ_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: str = ""

    # Transcripción: OpenAI Whisper; si no hay, Groq Whisper.
    STT_LANGUAGE: str = ""  # vacío = autodetectar (bilingüe)

    # Google Calendar (OAuth). Saca el refresh token con scripts/google_auth.py
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GOOGLE_REFRESH_TOKEN: str = ""
    GOOGLE_CALENDAR_ID: str = "primary"

    TIMEZONE: str = "America/Denver"  # El Paso
    DRY_RUN: bool = True  # True = nunca escribe en Google; deja recibo "skipped"

    # Default alive: arranca con un semestre ya cargado.
    SEED_FILE: Path = BACKEND_DIR / "seed" / "demo_semester.json"
    STATE_FILE: Path = BACKEND_DIR / "data" / "state.json"

    model_config = {
        "env_file": [str(BACKEND_DIR.parent / ".env"), str(BACKEND_DIR / ".env")],
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }


settings = Settings()
