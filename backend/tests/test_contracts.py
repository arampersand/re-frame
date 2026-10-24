"""Si este test falla, alguien cambió app/contracts.py sin correr `make contracts`."""
import json

from app import store
from app.contracts import Course, Deadline, Explanation, Lecture, ProposedAction, Receipt, Student, Topic
from scripts.export_contracts import OUT, build


def test_schema_snapshot_is_current():
    assert OUT.exists(), "falta contracts/schema.json: corre make contracts"
    assert OUT.read_text(encoding="utf-8") == build(), "contratos desactualizados: corre make contracts"


def test_seed_respects_contracts():
    Student(**store.student())
    for model, coll in ((Course, "courses"), (Deadline, "deadlines"), (Topic, "topics"),
                        (Lecture, "lectures"), (ProposedAction, "actions"), (Receipt, "receipts")):
        for item in store.all(coll):
            model(**item)
    for exp in store.section("canned_explanations", {}).values():
        Explanation(**exp)


def test_seed_dates_are_resolved():
    raw = json.dumps(store.all("deadlines"))
    assert "rel:" not in raw
