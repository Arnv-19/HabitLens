from sqlalchemy.orm import Session
from app.database.models import CalendarEvent
from app.utils.ics_parser import parse_ics
from typing import List


def upload_ics(db: Session, user_id: str, file_content: bytes) -> List[CalendarEvent]:
    """Parse ICS file and store events for the user."""
    parsed = parse_ics(file_content)
    created = []

    for event_data in parsed:
        event = CalendarEvent(
            user_id=user_id,
            title=event_data["title"],
            start_time=event_data["start_time"],
            end_time=event_data["end_time"],
        )
        db.add(event)
        created.append(event)

    db.commit()
    for e in created:
        db.refresh(e)
    return created


def get_events(db: Session, user_id: str) -> List[CalendarEvent]:
    """Get all calendar events for a user."""
    return db.query(CalendarEvent).filter(CalendarEvent.user_id == user_id).all()
