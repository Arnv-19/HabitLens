from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.database.models import CalendarEvent, HabitTask, Habit
from app.core.security import get_current_user
from app.services.calendar_service import upload_ics, get_events

router = APIRouter(prefix="/calendar", tags=["Calendar"])


@router.post("/upload")
async def upload_calendar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    """Upload an ICS file to import calendar events."""
    content = await file.read()
    events = upload_ics(db, user["sub"], content)
    return {"message": f"Imported {len(events)} events", "count": len(events)}


@router.get("")
def list_events(
    include_tasks: bool = False,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    """
    Get calendar events. If include_tasks=True, also returns
    timed habit tasks as calendar entries.
    """
    events = get_events(db, user["sub"])
    result = [
        {
            "id": e.id,
            "title": e.title,
            "start_time": e.start_time.isoformat() if e.start_time else None,
            "end_time": e.end_time.isoformat() if e.end_time else None,
            "type": "event",
        }
        for e in events
    ]

    if include_tasks:
        habits = db.query(Habit).filter(Habit.user_id == user["sub"]).all()
        for habit in habits:
            for task in habit.tasks:
                if task.time is not None:
                    result.append({
                        "id": task.id,
                        "title": f"{habit.title} — {task.task_name}",
                        "start_time": task.time.isoformat() if task.time else None,
                        "end_time": None,
                        "type": "habit_task",
                    })

    return result
