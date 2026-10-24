.PHONY: setup backend desktop test contracts check reset

PY := backend/.venv/bin/python

setup:            ## instala todo (una vez)
	python3 -m venv backend/.venv
	$(PY) -m pip install -q -r backend/requirements.txt
	cd desktop && npm install
	@test -f .env || cp .env.example .env
	@echo "Listo. Terminal 1: make backend   Terminal 2: make desktop"

backend:          ## API en http://127.0.0.1:8787  (docs en /docs)
	cd backend && .venv/bin/uvicorn app.main:app --reload --port 8787

desktop:          ## app de escritorio Electron
	cd desktop && npm run dev

contracts:        ## regenera schema.json y tipos TS desde backend/app/contracts.py
	cd backend && .venv/bin/python scripts/export_contracts.py
	cd desktop && npm run contracts

test:
	cd backend && .venv/bin/python -m pytest -q

check: test       ## lo mismo que corre CI. Córrelo antes de cada PR.
	cd backend && .venv/bin/python scripts/export_contracts.py --check
	cd desktop && npm run contracts && git diff --exit-code src/renderer/src/api/contracts.ts
	cd desktop && npm run typecheck && npm run build

reset:            ## vuelve al semestre de demo (fechas recalculadas a hoy)
	curl -s -X POST http://127.0.0.1:8787/api/demo/reset
