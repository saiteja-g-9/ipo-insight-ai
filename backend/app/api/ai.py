from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.ai.gemini_service import GeminiServiceError, analyze_ipo
from app.db.session import get_db
from app.models.ipo import IPO
from app.schemas.ai import IPOAnalysisResponse

# from app.core.config import settings

router = APIRouter(prefix="/ai", tags=["AI Analysis"])
DatabaseSession = Annotated[Session, Depends(get_db)]


@router.post(
    "/analyze/{ipo_id}",
    response_model=IPOAnalysisResponse,
    summary="Generate an AI IPO analysis",
    responses={
        404: {"description": "IPO not found"},
        502: {"description": "Gemini analysis request failed"},
        503: {"description": "Gemini is not configured"},
    },
)

def analyze_ipo_by_id(ipo_id: int, db: DatabaseSession) -> IPOAnalysisResponse:
    ipo = db.scalar(select(IPO).options(joinedload(IPO.company)).where(IPO.id == ipo_id))
    if ipo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="IPO not found")

    # # DEBUG
    # print("=" * 60)
    # print("API KEY:", repr(settings.GEMINI_API_KEY))
    # print("MODEL:", settings.GEMINI_MODEL)
    # print("=" * 60)

    try:
        return analyze_ipo(ipo)
    except GeminiServiceError as exc:
        status_code = (
            status.HTTP_503_SERVICE_UNAVAILABLE
            if "not configured" in str(exc)
            else status.HTTP_502_BAD_GATEWAY
        )
        raise HTTPException(status_code=status_code, detail=str(exc)) from exc
