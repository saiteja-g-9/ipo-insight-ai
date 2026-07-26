from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.models.ipo import IPOStatus


class CompanyResponse(BaseModel):
    id: int
    name: str
    industry: str | None
    headquarters: str | None
    founded_year: int | None
    description: str | None
    website: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class IPOBase(BaseModel):
    company_id: int = Field(gt=0)
    issue_price_low: Decimal = Field(gt=0, max_digits=10, decimal_places=2)
    issue_price_high: Decimal = Field(gt=0, max_digits=10, decimal_places=2)
    issue_size: Decimal = Field(gt=0, max_digits=14, decimal_places=2, description="Issue size in INR crore")
    lot_size: int = Field(gt=0)
    listing_date: date | None = None
    open_date: date
    close_date: date
    exchange: str = Field(min_length=1, max_length=50, examples=["NSE, BSE"])
    status: IPOStatus
    gmp: Decimal | None = Field(default=None, ge=0, max_digits=10, decimal_places=2)
    subscription_retail: Decimal | None = Field(default=None, ge=0, max_digits=10, decimal_places=2)
    subscription_qib: Decimal | None = Field(default=None, ge=0, max_digits=10, decimal_places=2)
    subscription_nii: Decimal | None = Field(default=None, ge=0, max_digits=10, decimal_places=2)

    @model_validator(mode="after")
    def validate_dates_and_price_band(self) -> "IPOBase":
        if self.issue_price_low > self.issue_price_high:
            raise ValueError("issue_price_low must not exceed issue_price_high")
        if self.close_date < self.open_date:
            raise ValueError("close_date must not be earlier than open_date")
        if self.listing_date is not None and self.listing_date < self.close_date:
            raise ValueError("listing_date must not be earlier than close_date")
        return self


class IPOCreate(IPOBase):
    pass


class IPOUpdate(BaseModel):
    company_id: int | None = Field(default=None, gt=0)
    issue_price_low: Decimal | None = Field(default=None, gt=0, max_digits=10, decimal_places=2)
    issue_price_high: Decimal | None = Field(default=None, gt=0, max_digits=10, decimal_places=2)
    issue_size: Decimal | None = Field(default=None, gt=0, max_digits=14, decimal_places=2)
    lot_size: int | None = Field(default=None, gt=0)
    listing_date: date | None = None
    open_date: date | None = None
    close_date: date | None = None
    exchange: str | None = Field(default=None, min_length=1, max_length=50)
    status: IPOStatus | None = None
    gmp: Decimal | None = Field(default=None, ge=0, max_digits=10, decimal_places=2)
    subscription_retail: Decimal | None = Field(default=None, ge=0, max_digits=10, decimal_places=2)
    subscription_qib: Decimal | None = Field(default=None, ge=0, max_digits=10, decimal_places=2)
    subscription_nii: Decimal | None = Field(default=None, ge=0, max_digits=10, decimal_places=2)


class IPOResponse(IPOBase):
    id: int
    created_at: datetime
    company: CompanyResponse

    model_config = ConfigDict(from_attributes=True)
