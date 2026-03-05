import uuid
from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from datetime import datetime

from app.database.database import get_db
from app.database.models import HabitPhoto, User
from app.core.security import get_current_user
from app.services.collage_service import generate_collage
from app.services.email_service import send_daily_summary
from app.services.reflection_service import generate_reflection
from app.utils.image_utils import save_upload
from app.database.models import DailyScore
from datetime import date

router = APIRouter(prefix="/collage", tags=["Collage"])


@router.post("/upload-photo")
async def upload_photo(
    habit_id: str,
    task_id: str = None,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    """Upload a photo for a habit task."""
    content = await file.read()
    filename = f"{uuid.uuid4()}_{file.filename}"
    filepath = save_upload(content, filename)

    photo = HabitPhoto(
        user_id=user["sub"],
        habit_id=habit_id,
        task_id=task_id,
        image_path=filepath,
    )
    db.add(photo)
    db.commit()
    db.refresh(photo)

    return {"id": photo.id, "image_path": photo.image_path}


@router.post("/generate")
def generate_daily_collage(
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    """Generate today's chronological collage and optionally email summary."""
    user_id = user["sub"]
    collage_path = generate_collage(db, user_id)

    if not collage_path:
        return {"message": "No photos to create collage today."}

    # Get reflection and effort
    reflection = generate_reflection(db, user_id)
    daily = db.query(DailyScore).filter(
        DailyScore.user_id == user_id, DailyScore.date == date.today()
    ).first()
    effort = daily.effort_index if daily else 0.0

    # Send email
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        send_daily_summary(db_user.email, effort, reflection, collage_path)

    return {
        "message": "Collage generated and emailed!",
        "collage_path": collage_path,
        "effort_index": effort,
        "reflection": reflection,
    }
