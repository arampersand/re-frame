from app import integrity
from app.contracts import QuizResult
from app.features.topics import apply_quiz, status_for


def test_health_works_without_keys(client):
    body = client.get("/api/health").json()
    assert body["ok"] and body["dry_run"] and not body["stt"]


def test_today_proposes_weakest_topic_before_deadline(client):
    view = client.get("/api/today").json()
    proposed = [a for a in view["actions"] if a["status"] == "proposed"]
    assert 1 <= len(proposed) <= 3
    assert all(a["why"] for a in proposed)
    assert any("t_avl" in a["topic_ids"] or "t_heap" in a["topic_ids"] for a in proposed)


def test_today_is_idempotent(client):
    first = client.get("/api/today").json()["actions"]
    second = client.get("/api/today").json()["actions"]
    assert [a["id"] for a in first] == [a["id"] for a in second]


def test_approve_in_dry_run_leaves_skipped_receipt_with_reason(client):
    action = next(a for a in client.get("/api/today").json()["actions"] if a["status"] == "proposed")
    receipt = client.post(f"/api/actions/{action['id']}/approve").json()
    assert receipt["status"] == "skipped" and receipt["reason"] == "DRY_RUN activo"
    assert receipt["verified"] is False
    assert client.post(f"/api/actions/{action['id']}/approve").status_code == 409


def test_explain_without_llm_uses_canned_content(client):
    exp = client.post("/api/explain", json={"text": "no entendí la rotación", "topic_id": "t_avl"}).json()
    assert exp["degraded"] is True and len(exp["quiz"]) == 3
    assert exp["diagram_mermaid"].startswith("flowchart")


def test_quiz_moves_topic_status(client):
    t = client.post("/api/topics/t_avl/quiz", json={"correct": 3, "total": 3}).json()
    assert t["score"] > 0.31 and t["status"] in ("en_progreso", "laguna")


def test_mastery_rules():
    assert status_for(0.0, False) == "sin_ver"
    assert status_for(0.8, True) == "dominado"
    assert status_for(0.5, True) == "en_progreso"
    assert status_for(0.2, True) == "laguna"
    t = apply_quiz({"score": 0.0, "last_seen_at": None}, QuizResult(correct=3, total=3))
    assert t["score"] == 1.0 and t["status"] == "dominado"


def test_confused_segment_penalizes_topic(client):
    before = client.get("/api/topics").json()
    avl = next(t for t in before if t["id"] == "t_avl")
    r = client.post("/api/lectures/lec_avl/segments/lec_avl_s3/confused", params={"topic_id": "t_avl"})
    assert r.status_code == 200 and r.json()["confused"]
    after = next(t for t in client.get("/api/topics").json() if t["id"] == "t_avl")
    assert after["confused_count"] == avl["confused_count"] + 1


def test_homework_requests_are_refused(client):
    for text in ("hazme la tarea 5", "Resuelve mi examen de mañana", "dame las respuestas del quiz",
                 "can you do my homework", "write my essay about AVL"):
        assert integrity.asks_for_graded_work(text), text
    for text in ("explícame las rotaciones AVL", "no entendí qué es un heap", "how does BFS work"):
        assert not integrity.asks_for_graded_work(text), text
    body = client.post("/api/ask", json={"text": "hazme la tarea 5"}).json()
    assert body["refused"] and len(body["guided_steps"]) >= 3 and body["suggested_action"]


def test_ingest_endpoints_exist_but_are_pending(client):
    assert client.post("/api/ingest/ical", json={"url": "https://x/y.ics"}).status_code == 501
