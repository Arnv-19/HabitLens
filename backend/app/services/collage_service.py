from datetime import date
from sqlalchemy.orm import Session
from app.database.models import HabitPhoto
from app.utils.image_utils import create_collage
from typing import Optional


def get_today_photos(db: Session, user_id: str):
    """Get all photos uploaded today, sorted chronologically."""
    today = date.today()
    return (
        db.query(HabitPhoto)
        .filter(
            HabitPhoto.user_id == user_id,
            HabitPhoto.created_at >= today.isoformat(),
        )
        .order_by(HabitPhoto.created_at.asc())
        .all()
    )


def generate_collage(db: Session, user_id: str) -> Optional[str]:
    """Generate a chronological collage of today's habit photos as base64."""
    photos = get_today_photos(db, user_id)
    if not photos:
        return None

    image_data_list = [p.image_data for p in photos]
    return create_collage(image_data_list)
