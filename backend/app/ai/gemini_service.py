from decimal import Decimal

from google import genai
from google.genai import types
from pydantic import ValidationError

from app.core.config import settings
from app.models.ipo import IPO
from app.schemas.ai import IPOAnalysisResponse

import traceback


class GeminiServiceError(Exception):
    """Raised when Gemini cannot produce a valid IPO analysis."""


def _format_value(value: Decimal | None, suffix: str = "") -> str:
    return f"{value}{suffix}" if value is not None else "Not available"


def build_ipo_prompt(ipo: IPO) -> str:
    """Build a factual, structured context for an IPO analysis request."""
    return f"""You are an impartial IPO research analyst. Analyze only the IPO information below.
Do not invent financial metrics, news, valuations, or guarantees. State uncertainty where the data is limited.
This is educational research, not personalized financial advice.

Company: {ipo.company.name}
Industry: {ipo.company.industry or "Not available"}
Description: {ipo.company.description or "Not available"}
Issue price band: INR {ipo.issue_price_low} to INR {ipo.issue_price_high}
Issue size: INR {ipo.issue_size} crore
Lot size: {ipo.lot_size}
Exchange: {ipo.exchange}
IPO status: {ipo.status}
Grey market premium (GMP): INR {_format_value(ipo.gmp)}
Retail subscription: {_format_value(ipo.subscription_retail, "x")}
QIB subscription: {_format_value(ipo.subscription_qib, "x")}
NII subscription: {_format_value(ipo.subscription_nii, "x")}
"""


def analyze_ipo(ipo: IPO) -> IPOAnalysisResponse:
    if not settings.GEMINI_API_KEY:
        raise GeminiServiceError("Gemini API key is not configured")

    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        response = client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=build_ipo_prompt(ipo),
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=IPOAnalysisResponse,
                temperature=0.2,
            ),
        )
        if not response.text:
            raise GeminiServiceError("Gemini returned an empty analysis")
        return IPOAnalysisResponse.model_validate_json(response.text)
    except ValidationError as exc:
        raise GeminiServiceError("Gemini returned an invalid analysis format") from exc
    except GeminiServiceError:
        raise
    except Exception as exc:
        traceback.print_exc()
        raise GeminiServiceError(f"{type(exc).__name__}: {exc}") from exc
    finally:
        if "client" in locals():
            client.close()
