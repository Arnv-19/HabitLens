from enum import Enum
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date


class HabitCategory(str, Enum):
    productivity = "productivity"
    recreation = "recreation"
    bonus = "bonus"
    essential = "essential"


class HabitCreate(BaseModel):
    title: str
    category: HabitCategory
    credit: int = 1
    is_fixed: bool = False
    tasks: Optional[List[str]] = None  # task names to auto-create


class HabitUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[HabitCategory] = None
    credit: Optional[int] = None


class HabitResponse(BaseModel):
    id: str
    user_id: str
    title: str
    category: str
    credit: int
    is_fixed: bool
    created_at: datetime
    tasks: List["TaskResponse"] = []

    class Config:
        from_attributes = True


class HabitLogCreate(BaseModel):
    habit_id: str
    tasks_completed: int
    effort_percent: int


class HabitLogResponse(BaseModel):
    id: str
    habit_id: str
    date: date
    tasks_completed: int
    effort_percent: int
    score: float

    class Config:
        from_attributes = True


class TaskResponse(BaseModel):
    id: str
    habit_id: str
    task_name: str
    time: Optional[str] = None

    class Config:
        from_attributes = True


# Resolve forward reference
HabitResponse.model_rebuild()
