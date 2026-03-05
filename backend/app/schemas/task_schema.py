from pydantic import BaseModel
from typing import Optional


class TaskCreate(BaseModel):
    habit_id: str
    task_name: str
    time: Optional[str] = None  # HH:MM format or null


class TaskResponse(BaseModel):
    id: str
    habit_id: str
    task_name: str
    time: Optional[str] = None

    class Config:
        from_attributes = True
