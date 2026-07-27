from fastapi import FastAPI

from app.api.router import api_router
from app.core.config import settings
from app.db.session import engine
from app.db.base import Base

# Create all database tables if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version="0.1.0",
    description="API for IPO research and investment analysis.",
)

app.include_router(api_router)


@app.get("/", tags=["Health"])
def root() -> dict[str, str]:
    return {"message": "IPO Insight AI Backend Running"}