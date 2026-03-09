from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.models import Habit
from app.database.database import get_db
from app.core.security import get_current_user
from app.schemas.habit_schema import HabitCreate, HabitResponse, HabitUpdate
from app.services.habit_service import create_habit, get_habits, delete_habit, update_habit

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
    return create_habit(db, user["sub"], data)


@router.get("/{habit_id}", response_model=HabitResponse)
def get_habit(
    habit_id: str,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    """Get a single habit by ID."""
    habit = db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == user["sub"]).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    return habit


@router.put("/{habit_id}", response_model=HabitResponse)
def modify_habit(
    habit_id: str,
    data: HabitUpdate,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    """Update a habit's title, category, or credit."""
    habit = update_habit(db, habit_id, user["sub"], data.model_dump(exclude_unset=True))
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    return habit


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
