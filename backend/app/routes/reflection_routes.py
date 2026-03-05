from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.core.security import get_current_user
from app.services.reflection_service import generate_reflection

router = APIRouter(prefix="/reflection", tags=["Reflection"])


@router.get("/today")
def get_today_reflection(
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    """Get AI-generated daily reflection based on today's performance."""
    reflection = generate_reflection(db, user["sub"])
    return {"reflection": reflection}
