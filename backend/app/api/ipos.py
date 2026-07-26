from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.db.session import get_db
from app.models.company import Company
from app.models.ipo import IPO, IPOStatus
from app.schemas.ipo import IPOCreate, IPOResponse, IPOUpdate

router = APIRouter(prefix="/ipos", tags=["IPOs"])
DatabaseSession = Annotated[Session, Depends(get_db)]


def _get_ipo_or_404(ipo_id: int, db: Session) -> IPO:
    ipo = db.scalar(select(IPO).options(joinedload(IPO.company)).where(IPO.id == ipo_id))
    if ipo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="IPO not found")
    return ipo


def _validate_company(company_id: int, db: Session) -> None:
    if db.get(Company, company_id) is None:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Company not found")


@router.get("", response_model=list[IPOResponse], summary="List IPOs")
def list_ipos(
    db: DatabaseSession,
    search: Annotated[str | None, Query(max_length=100, description="Filter by company name")] = None,
    ipo_status: Annotated[IPOStatus | None, Query(alias="status", description="Filter by IPO status")] = None,
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
) -> list[IPO]:
    statement = select(IPO).join(IPO.company).options(joinedload(IPO.company))
    if search:
        statement = statement.where(Company.name.ilike(f"%{search.strip()}%"))
    if ipo_status is not None:
        statement = statement.where(IPO.status == ipo_status)
    statement = statement.order_by(IPO.open_date.desc()).offset(skip).limit(limit)
    return list(db.scalars(statement).unique())


@router.get("/{ipo_id}", response_model=IPOResponse, summary="Get an IPO by ID")
def get_ipo(ipo_id: int, db: DatabaseSession) -> IPO:
    return _get_ipo_or_404(ipo_id, db)


@router.post("", response_model=IPOResponse, status_code=status.HTTP_201_CREATED, summary="Create an IPO")
def create_ipo(payload: IPOCreate, db: DatabaseSession) -> IPO:
    _validate_company(payload.company_id, db)
    ipo = IPO(**payload.model_dump())
    db.add(ipo)
    db.commit()
    db.refresh(ipo)
    return _get_ipo_or_404(ipo.id, db)


@router.put("/{ipo_id}", response_model=IPOResponse, summary="Update an IPO")
def update_ipo(ipo_id: int, payload: IPOUpdate, db: DatabaseSession) -> IPO:
    ipo = _get_ipo_or_404(ipo_id, db)
    changes = payload.model_dump(exclude_unset=True)
    if "company_id" in changes:
        _validate_company(changes["company_id"], db)
    for field, value in changes.items():
        setattr(ipo, field, value)
    if ipo.issue_price_low > ipo.issue_price_high:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid price band")
    if ipo.close_date < ipo.open_date:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid IPO dates")
    if ipo.listing_date is not None and ipo.listing_date < ipo.close_date:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid listing date")
    db.commit()
    return _get_ipo_or_404(ipo.id, db)


@router.delete("/{ipo_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete an IPO")
def delete_ipo(ipo_id: int, db: DatabaseSession) -> Response:
    ipo = _get_ipo_or_404(ipo_id, db)
    db.delete(ipo)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
