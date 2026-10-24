"""El onboarding funciona sin LLM, es adaptativo y lo medido gana a lo declarado."""


def _answer(client, qid, **kw):
    r = client.post("/api/onboarding/answer", json={"question_id": qid, **kw})
    assert r.status_code == 200, r.text
    return r.json()


def test_seed_student_is_already_onboarded(client):
    st = client.get("/api/onboarding").json()
    assert st["done"] and st["profile"]["confirmed"]
    assert st["profile"]["slots"]["representation"]["source"] == "measured"


def test_full_flow_without_llm(client):
    st = client.post("/api/onboarding/start").json()
    assert st["next_question"]["id"] == "goal" and st["next_question"]["why"]
    st = _answer(client, "goal", text="sacar A en estructuras y entrar a un internship")
    assert st["next_question"]["id"] == "stake"  # escalera de porqués
    st = _answer(client, "stake", text="pierdo la beca si bajo de 3.0")
    st = _answer(client, "work", option_id="16-30")
    st = _answer(client, "window", option_id="night")
    st = _answer(client, "episode", skipped=True)
    st = _answer(client, "contrast", option_id="example")
    st = _answer(client, "lang", option_id="mix")
    assert {o["id"] for o in st["next_question"]["options"]} >= {"c_ed", "c_al"}  # materias importadas
    st = _answer(client, "worry", option_id="c_ed")
    assert st["done"] and not st["profile"]["confirmed"]
    slots = st["profile"]["slots"]
    assert slots["block_minutes"]["source"] == "inferred" and slots["block_minutes"]["value"] == "25"
    assert "help_style" not in slots  # saltada
    assert any("25 minutos" in r["statement"] for r in st["reflections"])
    st = client.post("/api/onboarding/confirm", json={"corrections": {"stake": "mantener la beca"}}).json()
    assert st["profile"]["confirmed"] and st["profile"]["slots"]["stake"]["confidence"] == 1.0
    assert client.get("/api/student").json()["preferred_representation"] == "example"


def test_stake_is_skipped_when_goal_is_skipped(client):
    client.post("/api/onboarding/start")
    st = _answer(client, "goal", skipped=True)
    assert st["next_question"]["id"] == "work"


def test_invalid_option_is_rejected(client):
    client.post("/api/onboarding/start")
    r = client.post("/api/onboarding/answer", json={"question_id": "work", "option_id": "mucho"})
    assert r.status_code == 422


def test_today_respects_study_window_from_profile(client):
    from datetime import datetime
    for a in client.get("/api/today").json()["actions"]:
        if a["status"] == "proposed":
            assert 18 <= datetime.fromisoformat(a["start_at"]).hour < 23
