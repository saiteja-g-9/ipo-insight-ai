from pydantic import BaseModel, Field


class IPOAnalysisResponse(BaseModel):
    summary: str = Field(min_length=1, max_length=2000)
    strengths: list[str] = Field(min_length=1, max_length=8)
    risks: list[str] = Field(min_length=1, max_length=8)
    bull_case: str = Field(min_length=1, max_length=1500)
    bear_case: str = Field(min_length=1, max_length=1500)
    financial_health: str = Field(min_length=1, max_length=1500)
    recommendation: str = Field(min_length=1, max_length=500)
    confidence: int = Field(ge=0, le=100)
