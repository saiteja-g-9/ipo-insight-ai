from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import settings
from app.db.base import Base
from app.db.session import engine

import app.models

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version="0.1.0",
    description="API for IPO research and investment analysis.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # TEMPORARY
    allow_credentials=False,  # TEMPORARY
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get("/")
def root():
    return {"message": "IPO Insight AI Backend Running"}