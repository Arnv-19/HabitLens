import uuid
from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from datetime import datetime

from app.database.database import get_db
from app.database.models import HabitPhoto, User
from app.core.security import get_current_user
from app.services.collage_service import generate_collage, get_today_photos
from app.services.email_service import send_daily_summary
from app.services.reflection_service import generate_heuristic_reflection
from app.utils.image_utils import process_upload
from app.database.models import DailyScore
from datetime import date
from pydantic import BaseModel

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
    try:
        b64_image = process_upload(content, file.content_type)
    except ValueError as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail=str(e))

    photo = HabitPhoto(
        user_id=user["sub"],
        habit_id=habit_id,
        task_id=task_id,
        image_data=b64_image,
    )
    db.add(photo)
    db.commit()
    db.refresh(photo)

    return {"id": photo.id, "success": True}


@router.post("/generate")
def generate_daily_collage(
    send_email: bool = False,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    """Generate today's chronological collage and optionally email summary."""
    user_id = user["sub"]
    collage_b64 = generate_collage(db, user_id)

    if not collage_b64:
        return {"message": "No photos to create collage today."}

    # Get reflection and effort
    reflection = generate_heuristic_reflection(db, user_id)
    daily = db.query(DailyScore).filter(
        DailyScore.user_id == user_id, DailyScore.date == date.today()
    ).first()
    effort = daily.effort_index if daily else 0.0

    # Send email
    if send_email:
        db_user = db.query(User).filter(User.id == user_id).first()
        if db_user and db_user.email:
            send_daily_summary(db_user.email, effort, reflection, collage_b64)

    return {
        "message": "Collage generated!",
        "effort_index": effort,
        "reflection": reflection,
        "collage_image": collage_b64,
    }


class PhotoResponse(BaseModel):
    id: str
    habit_id: str
    task_id: str | None
    image_data: str
    created_at: datetime


@router.get("/photos", response_model=list[PhotoResponse])
def get_today_uploaded_photos(
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    """Get all photos uploaded today by the user."""
    photos = get_today_photos(db, user["sub"])
    return photos


@router.delete("/photo/{photo_id}", status_code=204)
def delete_photo(
    photo_id: str,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    """Delete a specific photo."""
    photo = db.query(HabitPhoto).filter(HabitPhoto.id == photo_id, HabitPhoto.user_id == user["sub"]).first()
    if not photo:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Photo not found")
    
    db.delete(photo)
    db.commit()
