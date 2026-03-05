from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import time as py_time

from app.database.database import get_db
from app.database.models import HabitTask, Habit
from app.core.security import get_current_user
from app.schemas.task_schema import TaskCreate, TaskResponse

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
    data: TaskCreate,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    """Create a new task for a habit. Blocked for productivity and essential habits."""
    habit = db.query(Habit).filter(Habit.id == data.habit_id, Habit.user_id == user["sub"]).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")

    if habit.category == "essential":
        raise HTTPException(
            status_code=403,
            detail="Cannot add tasks to essential habits. Tasks are fixed.",
        )

    parsed_time = None
    if data.time:
        try:
            parts = data.time.split(":")
            parsed_time = py_time(int(parts[0]), int(parts[1]))
        except (ValueError, IndexError):
            raise HTTPException(status_code=400, detail="Invalid time format. Use HH:MM")

    task = HabitTask(habit_id=data.habit_id, task_name=data.task_name, time=parsed_time)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: str,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    """Delete a task. Blocked for productivity and essential habits."""
    task = db.query(HabitTask).filter(HabitTask.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    habit = db.query(Habit).filter(Habit.id == task.habit_id, Habit.user_id == user["sub"]).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")

    if habit.category == "essential":
        raise HTTPException(
            status_code=403,
            detail="Cannot delete tasks from essential habits.",
        )

    db.delete(task)
    db.commit()
