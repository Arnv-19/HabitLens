from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class GoogleAuthRequest(BaseModel):
    token: str


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    avatar_emoji: Optional[str] = "😊"
    created_at: datetime

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    avatar_emoji: Optional[str] = None


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
