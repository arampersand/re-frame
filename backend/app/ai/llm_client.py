"""Multi-provider LLM client (copiado de Auren).

Fallback chain on provider="auto": Anthropic → Groq → Gemini → OpenAI.
All functions fail-open: return {} / "" / None instead of raising.
"""

from __future__ import annotations

import json
from typing import Literal

import httpx as _httpx
from loguru import logger

from app.config import settings

GROQ_DEFAULT_MODEL = "llama-3.3-70b-versatile"
GEMINI_DEFAULT_MODEL = "gemini-2.5-flash"
CLAUDE_DEFAULT_MODEL = settings.ANTHROPIC_MODEL
_GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"

_openai_client = None
_groq_client = None
_anthropic_client = None

_GPT_TO_CLAUDE = {
    "gpt-4.1": CLAUDE_DEFAULT_MODEL,
    "gpt-4.1-mini": CLAUDE_DEFAULT_MODEL,
    "gpt-4o": CLAUDE_DEFAULT_MODEL,
    "gpt-4o-mini": CLAUDE_DEFAULT_MODEL,
}

ProviderType = Literal["auto", "openai", "groq", "gemini", "anthropic"]


def _get_openai_client():
    global _openai_client
    if not settings.OPENAI_API_KEY:
        return None
    if _openai_client is None:
        try:
            from openai import AsyncOpenAI
            from httpx import Timeout
            _openai_client = AsyncOpenAI(
                api_key=settings.OPENAI_API_KEY,
                timeout=Timeout(60.0, connect=10.0),
            )
        except ImportError:
            logger.warning("openai SDK not installed")
            return None
    return _openai_client


def _get_groq_client():
    global _groq_client
    if not settings.GROQ_API_KEY:
        return None
    if _groq_client is None:
        from groq import AsyncGroq
        _groq_client = AsyncGroq(api_key=settings.GROQ_API_KEY)
    return _groq_client


def _get_anthropic_client():
    global _anthropic_client
    if not settings.ANTHROPIC_API_KEY:
        return None
    if _anthropic_client is None:
        from anthropic import AsyncAnthropic
        _anthropic_client = AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
    return _anthropic_client


def _should_use_groq(model: str, provider: str) -> bool:
    if provider in ("openai", "anthropic"):
        return False
    if provider == "groq":
        return True
    # auto: cualquier llave de Groq participa en el failover.
    return bool(settings.GROQ_API_KEY)


def _groq_model(model: str) -> str:
    return model if model.startswith(("llama", "mixtral")) else GROQ_DEFAULT_MODEL


def _should_use_anthropic(model: str, provider: str) -> bool:
    if provider == "anthropic":
        return True
    if provider in ("openai", "groq", "gemini"):
        return False
    return bool(
        settings.ANTHROPIC_API_KEY
        and not any(model.startswith(p) for p in ("llama", "mixtral"))
    )


def _claude_model(model: str) -> str:
    return _GPT_TO_CLAUDE.get(model, CLAUDE_DEFAULT_MODEL)


def _parse_json_text(text: str) -> dict:
    text = text.strip()
    if text.startswith("```"):
        text = text.removeprefix("```json").removeprefix("```").removesuffix("```").strip()
    if not text.startswith("{"):
        start = text.find("{")
        if start >= 0:
            text = text[start:]
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        logger.error(f"LLM returned invalid JSON: {text[:500]}")
        return {}


async def _gemini_call(prompt: str, expect_json: bool = False) -> str | None:
    if not settings.GEMINI_API_KEY:
        return None
    url = _GEMINI_URL.format(model=GEMINI_DEFAULT_MODEL)
    system_note = " Respond with valid JSON only." if expect_json else ""
    try:
        async with _httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                f"{url}?key={settings.GEMINI_API_KEY}",
                json={
                    "contents": [{"parts": [{"text": prompt + system_note}]}],
                    "generationConfig": {"temperature": 0.1, "maxOutputTokens": 4000},
                },
            )
            resp.raise_for_status()
            return resp.json()["candidates"][0]["content"]["parts"][0]["text"]
    except Exception as exc:
        logger.warning(f"gemini_call failed: {exc}")
        return None


async def chat_json(
    system_prompt: str,
    user_prompt: str,
    model: str = "gpt-4.1-mini",
    provider: ProviderType = "auto",
) -> dict:
    """Chat request expecting a JSON dict. Fail-open: returns {} on total failure."""

    if _should_use_anthropic(model, provider):
        try:
            client = _get_anthropic_client()
            if client is not None:
                response = await client.messages.create(
                    model=_claude_model(model),
                    max_tokens=4096,
                    temperature=0.2,
                    system=system_prompt + "\n\nRespond with valid JSON only. No markdown fences. Start with {.",
                    messages=[{"role": "user", "content": user_prompt}],
                )
                text = response.content[0].text if response.content else "{}"
                return _parse_json_text(text)
        except Exception as exc:
            logger.warning(f"Anthropic chat_json failed, falling back: {exc}")

    if _should_use_groq(model, provider):
        try:
            groq = _get_groq_client()
            if groq is not None:
                response = await groq.chat.completions.create(
                    model=_groq_model(model),
                    response_format={"type": "json_object"},
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                    temperature=0.2,
                )
                return _parse_json_text(response.choices[0].message.content or "{}")
        except Exception as exc:
            logger.warning(f"Groq chat_json failed, falling back: {exc}")

    if provider in ("gemini", "auto"):
        raw = await _gemini_call(f"{system_prompt}\n\n{user_prompt}", expect_json=True)
        if raw:
            parsed = _parse_json_text(raw)
            if parsed:
                return parsed
        if provider == "gemini":
            return {}

    client = _get_openai_client()
    if client is None:
        logger.warning("chat_json: no LLM provider available")
        return {}
    try:
        response = await client.chat.completions.create(
            model=model if not _should_use_groq(model, provider) else "gpt-4.1-mini",
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.2,
        )
    except Exception as exc:
        logger.error(f"OpenAI chat_json failed: {exc}")
        return {}
    return _parse_json_text(response.choices[0].message.content or "{}")


async def chat_text(
    system_prompt: str,
    user_prompt: str,
    model: str = "gpt-4.1-mini",
    provider: ProviderType = "auto",
) -> str:
    """Chat request expecting plain text. Fail-open: returns "" on total failure."""

    if _should_use_anthropic(model, provider):
        try:
            client = _get_anthropic_client()
            if client is not None:
                response = await client.messages.create(
                    model=_claude_model(model),
                    max_tokens=4096,
                    temperature=0.3,
                    system=system_prompt,
                    messages=[{"role": "user", "content": user_prompt}],
                )
                return response.content[0].text if response.content else ""
        except Exception as exc:
            logger.warning(f"Anthropic chat_text failed, falling back: {exc}")

    if _should_use_groq(model, provider):
        try:
            groq = _get_groq_client()
            if groq is not None:
                response = await groq.chat.completions.create(
                    model=_groq_model(model),
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                    temperature=0.3,
                )
                return response.choices[0].message.content or ""
        except Exception as exc:
            logger.warning(f"Groq chat_text failed, falling back: {exc}")

    if provider in ("gemini", "auto"):
        raw = await _gemini_call(f"{system_prompt}\n\n{user_prompt}", expect_json=False)
        if raw:
            return raw
        if provider == "gemini":
            return ""

    client = _get_openai_client()
    if client is None:
        logger.warning("chat_text: no LLM provider available")
        return ""
    try:
        response = await client.chat.completions.create(
            model=model if not _should_use_groq(model, provider) else "gpt-4.1-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.3,
        )
    except Exception as exc:
        logger.error(f"OpenAI chat_text failed: {exc}")
        return ""
    return response.choices[0].message.content or ""


async def chat_tools(
    system_prompt: str,
    user_prompt: str,
    tools: list[dict],
    model: str = "gpt-4.1-mini",
) -> dict | None:
    """Native function calling (OpenAI). Returns {"name", "arguments"} of the
    first tool call, or None (caller falls back to JSON planner)."""
    client = _get_openai_client()
    if client is None:
        return None
    try:
        response = await client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            tools=tools,
            tool_choice="auto",
            temperature=0.1,
        )
    except Exception as exc:
        logger.warning(f"OpenAI chat_tools failed (fallback to JSON planner): {exc}")
        return None
    calls = response.choices[0].message.tool_calls or []
    if not calls:
        return None
    call = calls[0]
    try:
        arguments = json.loads(call.function.arguments or "{}")
    except Exception:
        arguments = {}
    return {"name": call.function.name, "arguments": arguments}
