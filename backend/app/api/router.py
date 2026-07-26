from fastapi import APIRouter

from app.api.ai import router as ai_router
from app.api.auth import router as auth_router
from app.api.ipos import router as ipos_router
from app.core.config import settings

api_router = APIRouter(prefix=settings.API_PREFIX)
api_router.include_router(ai_router)
api_router.include_router(auth_router)
api_router.include_router(ipos_router)


@api_router.get("/health", tags=["Health"])
def health() -> dict[str, str]:
    return {"status": "healthy"}
