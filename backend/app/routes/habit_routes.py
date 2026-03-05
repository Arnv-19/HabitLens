from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.core.security import get_current_user
from app.schemas.habit_schema import HabitCreate, HabitResponse
from app.services.habit_service import create_habit, get_habits, delete_habit

router = APIRouter(prefix="/habits", tags=["Habits"])


@router.get("", response_model=List[HabitResponse])
def list_habits(
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    """Get all habits for the authenticated user."""
    habits = get_habits(db, user["sub"])
    return habits


@router.post("", response_model=HabitResponse, status_code=status.HTTP_201_CREATED)
def create_new_habit(
    data: HabitCreate,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    """Create a new habit with category-specific behavior."""
    valid_categories = ("productivity", "recreation", "bonus", "essential")
    if data.category not in valid_categories:
        raise HTTPException(status_code=400, detail=f"Category must be one of: {valid_categories}")
    return create_habit(db, user["sub"], data)


@router.delete("/{habit_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_habit(
    habit_id: str,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    """Delete a habit by ID."""
    success = delete_habit(db, habit_id, user["sub"])
    if not success:
        raise HTTPException(status_code=404, detail="Habit not found")
