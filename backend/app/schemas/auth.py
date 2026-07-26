from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100, examples=["Aarav Sharma"])
    email: EmailStr = Field(examples=["aarav@example.com"])
    password: str = Field(min_length=8, max_length=72, examples=["strong-password"])


class UserLogin(BaseModel):
    email: EmailStr = Field(examples=["aarav@example.com"])
    password: str = Field(min_length=1, max_length=72, examples=["strong-password"])


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
