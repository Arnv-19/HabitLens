from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from pydantic import BaseModel, Field

from app.database.database import get_db
from app.database.models import User
from app.schemas.user_schema import GoogleAuthRequest, AuthResponse, UserResponse
from app.utils.jwt_utils import create_access_token
from app.core.config import settings
from app.core.security import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/google", response_model=AuthResponse)
def google_login(data: GoogleAuthRequest, db: Session = Depends(get_db)):
    """Authenticate user via Google OAuth token."""
    try:
        idinfo = id_token.verify_oauth2_token(
            data.token,
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID,
        )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token",
        )

    email = idinfo.get("email")
    name = idinfo.get("name", "User")

    if not email:
        raise HTTPException(status_code=400, detail="Email not found in token")

    # Find or create user
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(name=name, email=email)
        db.add(user)
        db.commit()
        db.refresh(user)

    # Generate JWT
    access_token = create_access_token({"sub": user.id, "email": user.email})

    return AuthResponse(
        access_token=access_token,
        user=UserResponse.model_validate(user),
    )


class AvatarUpdate(BaseModel):
    avatar_emoji: str = Field(..., max_length=10)

@router.get("/me", response_model=UserResponse)
def get_me(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Get the current authenticated user's profile."""
    user = db.query(User).filter(User.id == current_user["sub"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse.model_validate(user)

@router.put("/me/avatar", response_model=UserResponse)
def update_avatar(
    data: AvatarUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Update user's avatar emoji."""
    user = db.query(User).filter(User.id == current_user["sub"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    user.avatar_emoji = data.avatar_emoji
    db.commit()
    db.refresh(user)
    
    return UserResponse.model_validate(user)
