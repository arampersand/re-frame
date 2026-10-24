from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import store
from app.features import ask, demo, explain, ingest, lectures, today, topics


@asynccontextmanager
async def lifespan(_: FastAPI):
    store.load()
    yield


app = FastAPI(title="Re-Frame API", version="0.1.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# Una línea por feature. Agregar una feature = agregar su router aquí.
for feature in (demo, lectures, topics, explain, ask, today, ingest):
    app.include_router(feature.router)
