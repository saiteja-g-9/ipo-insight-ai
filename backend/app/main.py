from fastapi import FastAPI

from app.api.router import api_router
from app.core.config import settings

app = FastAPI(
    title=settings.APP_NAME,
    version="0.1.0",
    description="API for IPO research and investment analysis.",
)
app.include_router(api_router)


@app.get("/", tags=["Health"])
def root() -> dict[str, str]:
    return {"message": "IPO Insight AI Backend Running"}
