from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal
from enum import Enum
from typing import TYPE_CHECKING

from sqlalchemy import Date, DateTime, ForeignKey, Integer, Numeric, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.company import Company


class IPOStatus(str, Enum):
    UPCOMING = "Upcoming"
    OPEN = "Open"
    CLOSED = "Closed"
    LISTED = "Listed"


class IPO(Base):
    __tablename__ = "ipos"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    company_id: Mapped[int] = mapped_column(ForeignKey("companies.id", ondelete="CASCADE"), nullable=False)
    issue_price_low: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    issue_price_high: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    issue_size: Mapped[Decimal] = mapped_column(Numeric(14, 2), nullable=False)
    lot_size: Mapped[int] = mapped_column(Integer, nullable=False)
    listing_date: Mapped[date | None] = mapped_column(Date)
    open_date: Mapped[date] = mapped_column(Date, nullable=False)
    close_date: Mapped[date] = mapped_column(Date, nullable=False)
    exchange: Mapped[str] = mapped_column(String(50), nullable=False)
    status: Mapped[IPOStatus] = mapped_column(String(16), nullable=False, index=True)
    gmp: Mapped[Decimal | None] = mapped_column(Numeric(10, 2))
    subscription_retail: Mapped[Decimal | None] = mapped_column(Numeric(10, 2))
    subscription_qib: Mapped[Decimal | None] = mapped_column(Numeric(10, 2))
    subscription_nii: Mapped[Decimal | None] = mapped_column(Numeric(10, 2))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    company: Mapped[Company] = relationship(back_populates="ipos")
