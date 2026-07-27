from fastapi import FastAPI

from app.api.router import api_router
from app.core.config import settings
from app.db.base import Base
from app.db.session import engine

# Import ALL models so SQLAlchemy knows about them
from app.models.user import User
# If you have these models, import them too:
# from app.models.company import Company
# from app.models.ipo import IPO

print(">>> Creating database tables...")
Base.metadata.create_all(bind=engine)
print(">>> Database tables created.")

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