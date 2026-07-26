"""create companies and ipos tables with seed data

Revision ID: 20260726_0002
Revises: 20260726_0001
Create Date: 2026-07-26
"""

from datetime import date

from alembic import op
import sqlalchemy as sa

revision = "20260726_0002"
down_revision = "20260726_0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "companies",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("industry", sa.String(length=150)),
        sa.Column("headquarters", sa.String(length=255)),
        sa.Column("founded_year", sa.Integer()),
        sa.Column("description", sa.Text()),
        sa.Column("website", sa.String(length=255)),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("name"),
    )
    op.create_index(op.f("ix_companies_id"), "companies", ["id"], unique=False)
    op.create_index(op.f("ix_companies_name"), "companies", ["name"], unique=False)

    op.create_table(
        "ipos",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("company_id", sa.Integer(), nullable=False),
        sa.Column("issue_price_low", sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column("issue_price_high", sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column("issue_size", sa.Numeric(precision=14, scale=2), nullable=False),
        sa.Column("lot_size", sa.Integer(), nullable=False),
        sa.Column("listing_date", sa.Date()),
        sa.Column("open_date", sa.Date(), nullable=False),
        sa.Column("close_date", sa.Date(), nullable=False),
        sa.Column("exchange", sa.String(length=50), nullable=False),
        sa.Column("status", sa.String(length=16), nullable=False),
        sa.Column("gmp", sa.Numeric(precision=10, scale=2)),
        sa.Column("subscription_retail", sa.Numeric(precision=10, scale=2)),
        sa.Column("subscription_qib", sa.Numeric(precision=10, scale=2)),
        sa.Column("subscription_nii", sa.Numeric(precision=10, scale=2)),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["company_id"], ["companies.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_ipos_id"), "ipos", ["id"], unique=False)
    op.create_index(op.f("ix_ipos_status"), "ipos", ["status"], unique=False)

    companies = sa.table(
        "companies",
        sa.column("id", sa.Integer), sa.column("name", sa.String), sa.column("industry", sa.String),
        sa.column("headquarters", sa.String), sa.column("founded_year", sa.Integer),
        sa.column("description", sa.Text), sa.column("website", sa.String),
    )
    op.bulk_insert(companies, [
        {"id": 1, "name": "Hyundai Motor India", "industry": "Automotive", "headquarters": "Gurugram, Haryana", "founded_year": 1996, "description": "Indian passenger vehicle manufacturer.", "website": "https://www.hyundai.com/in"},
        {"id": 2, "name": "Swiggy", "industry": "Consumer Internet", "headquarters": "Bengaluru, Karnataka", "founded_year": 2014, "description": "Food delivery and quick commerce platform.", "website": "https://www.swiggy.com"},
        {"id": 3, "name": "NTPC Green Energy", "industry": "Renewable Energy", "headquarters": "New Delhi", "founded_year": 2022, "description": "Renewable energy subsidiary of NTPC Limited.", "website": "https://www.ntpcgreenenergy.com"},
        {"id": 4, "name": "Bajaj Housing Finance", "industry": "Financial Services", "headquarters": "Pune, Maharashtra", "founded_year": 2008, "description": "Housing finance company in the Bajaj Group.", "website": "https://www.bajajhousingfinance.in"},
        {"id": 5, "name": "Waaree Energies", "industry": "Renewable Energy", "headquarters": "Mumbai, Maharashtra", "founded_year": 1990, "description": "Solar PV module manufacturer.", "website": "https://www.waaree.com"},
        {"id": 6, "name": "Tata Technologies", "industry": "Engineering Services", "headquarters": "Pune, Maharashtra", "founded_year": 1994, "description": "Product engineering and digital services company.", "website": "https://www.tatatechnologies.com"},
        {"id": 7, "name": "Bharti Hexacom", "industry": "Telecommunications", "headquarters": "New Delhi", "founded_year": 1995, "description": "Telecommunications service provider.", "website": "https://www.bhartihexacom.in"},
        {"id": 8, "name": "Ola Electric Mobility", "industry": "Electric Vehicles", "headquarters": "Bengaluru, Karnataka", "founded_year": 2017, "description": "Electric two-wheeler and battery technology company.", "website": "https://olaelectric.com"},
        {"id": 9, "name": "Afcons Infrastructure", "industry": "Infrastructure", "headquarters": "Mumbai, Maharashtra", "founded_year": 1959, "description": "Engineering and construction company.", "website": "https://www.afcons.com"},
    ])

    ipos = sa.table(
        "ipos",
        sa.column("id", sa.Integer), sa.column("company_id", sa.Integer), sa.column("issue_price_low", sa.Numeric), sa.column("issue_price_high", sa.Numeric), sa.column("issue_size", sa.Numeric), sa.column("lot_size", sa.Integer), sa.column("listing_date", sa.Date), sa.column("open_date", sa.Date), sa.column("close_date", sa.Date), sa.column("exchange", sa.String), sa.column("status", sa.String), sa.column("gmp", sa.Numeric), sa.column("subscription_retail", sa.Numeric), sa.column("subscription_qib", sa.Numeric), sa.column("subscription_nii", sa.Numeric),
    )
    op.bulk_insert(ipos, [
        {"id": 1, "company_id": 1, "issue_price_low": 1865, "issue_price_high": 1960, "issue_size": 27870, "lot_size": 7, "listing_date": date(2024, 10, 22), "open_date": date(2024, 10, 15), "close_date": date(2024, 10, 17), "exchange": "NSE, BSE", "status": "Listed", "gmp": 0, "subscription_retail": 0.50, "subscription_qib": 6.97, "subscription_nii": 0.60},
        {"id": 2, "company_id": 2, "issue_price_low": 371, "issue_price_high": 390, "issue_size": 11296, "lot_size": 38, "listing_date": date(2024, 11, 13), "open_date": date(2024, 11, 6), "close_date": date(2024, 11, 8), "exchange": "NSE, BSE", "status": "Listed", "gmp": 0, "subscription_retail": 1.14, "subscription_qib": 6.02, "subscription_nii": 0.41},
        {"id": 3, "company_id": 3, "issue_price_low": 102, "issue_price_high": 108, "issue_size": 10000, "lot_size": 138, "listing_date": date(2024, 11, 27), "open_date": date(2024, 11, 19), "close_date": date(2024, 11, 22), "exchange": "NSE, BSE", "status": "Listed", "gmp": 0, "subscription_retail": 3.44, "subscription_qib": 3.80, "subscription_nii": 2.29},
        {"id": 4, "company_id": 4, "issue_price_low": 66, "issue_price_high": 70, "issue_size": 6560, "lot_size": 214, "listing_date": date(2024, 9, 16), "open_date": date(2024, 9, 9), "close_date": date(2024, 9, 11), "exchange": "NSE, BSE", "status": "Listed", "gmp": 0, "subscription_retail": 7.04, "subscription_qib": 209.36, "subscription_nii": 41.50},
        {"id": 5, "company_id": 5, "issue_price_low": 1427, "issue_price_high": 1503, "issue_size": 4321, "lot_size": 9, "listing_date": date(2024, 10, 28), "open_date": date(2024, 10, 21), "close_date": date(2024, 10, 23), "exchange": "NSE, BSE", "status": "Listed", "gmp": 0, "subscription_retail": 10.79, "subscription_qib": 215.03, "subscription_nii": 65.25},
        {"id": 6, "company_id": 6, "issue_price_low": 475, "issue_price_high": 500, "issue_size": 3042.51, "lot_size": 30, "listing_date": date(2023, 11, 30), "open_date": date(2023, 11, 22), "close_date": date(2023, 11, 24), "exchange": "NSE, BSE", "status": "Listed", "gmp": 0, "subscription_retail": 16.50, "subscription_qib": 203.41, "subscription_nii": 62.11},
        {"id": 7, "company_id": 7, "issue_price_low": 542, "issue_price_high": 570, "issue_size": 4275, "lot_size": 26, "listing_date": date(2024, 4, 12), "open_date": date(2024, 4, 3), "close_date": date(2024, 4, 5), "exchange": "NSE, BSE", "status": "Listed", "gmp": 0, "subscription_retail": 2.83, "subscription_qib": 48.57, "subscription_nii": 10.52},
        {"id": 8, "company_id": 8, "issue_price_low": 72, "issue_price_high": 76, "issue_size": 6145.56, "lot_size": 195, "listing_date": date(2024, 8, 9), "open_date": date(2024, 8, 2), "close_date": date(2024, 8, 6), "exchange": "NSE, BSE", "status": "Listed", "gmp": 0, "subscription_retail": 3.92, "subscription_qib": 5.31, "subscription_nii": 2.40},
        {"id": 9, "company_id": 9, "issue_price_low": 440, "issue_price_high": 463, "issue_size": 5430, "lot_size": 32, "listing_date": date(2024, 11, 4), "open_date": date(2024, 10, 25), "close_date": date(2024, 10, 29), "exchange": "NSE, BSE", "status": "Listed", "gmp": 0, "subscription_retail": 5.05, "subscription_qib": 101.04, "subscription_nii": 33.87},
    ])


def downgrade() -> None:
    op.drop_index(op.f("ix_ipos_status"), table_name="ipos")
    op.drop_index(op.f("ix_ipos_id"), table_name="ipos")
    op.drop_table("ipos")
    op.drop_index(op.f("ix_companies_name"), table_name="companies")
    op.drop_index(op.f("ix_companies_id"), table_name="companies")
    op.drop_table("companies")
