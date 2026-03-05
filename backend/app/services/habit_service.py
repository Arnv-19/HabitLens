from sqlalchemy.orm import Session
from app.database.models import Habit, HabitTask
from app.schemas.habit_schema import HabitCreate

# Default time-slot tasks for essential (blue) habits
ESSENTIAL_DEFAULT_TASKS = {
    "Drink Water": ["Morning", "Afternoon", "Evening", "Night"],
    "Brush Teeth": ["Morning", "Night"],
    "Eat Breakfast": ["Morning"],
    "Eat Lunch": ["Afternoon"],
    "Eat Dinner": ["Evening"],
    "Sleep Early": ["Night"],
    "Take Vitamins": ["Morning"],
    "Shower": ["Morning"],
    "Morning Routine": ["Morning"],
    "Evening Routine": ["Evening"],
    "Stretch": ["Morning", "Evening"],
    "Make Bed": ["Morning"],
    "Organize Desk": ["Morning"],
    "Hydrate": ["Morning", "Afternoon", "Evening", "Night"],
}

ESSENTIAL_FALLBACK_TASKS = ["Morning", "Afternoon", "Evening", "Night"]


def create_habit(db: Session, user_id: str, data: HabitCreate) -> Habit:
    """Create a new habit with category-specific behavior."""
    is_fixed = data.category in ("productivity", "essential")

    habit = Habit(
        user_id=user_id,
        title=data.title,
        category=data.category,
        credit=data.credit,
        is_fixed=is_fixed,
    )
    db.add(habit)
    db.flush()  # get habit.id

    # Auto-generate tasks for essential habits
    if data.category == "essential":
        task_names = ESSENTIAL_DEFAULT_TASKS.get(data.title, ESSENTIAL_FALLBACK_TASKS)
        for name in task_names:
            task = HabitTask(habit_id=habit.id, task_name=name)
            db.add(task)
    elif data.tasks:
        for name in data.tasks:
            task = HabitTask(habit_id=habit.id, task_name=name)
            db.add(task)

    db.commit()
    db.refresh(habit)
    return habit


def get_habits(db: Session, user_id: str):
    """Get all habits for a user."""
    return db.query(Habit).filter(Habit.user_id == user_id).all()


def delete_habit(db: Session, habit_id: str, user_id: str) -> bool:
    """Delete a habit. Returns True if deleted."""
    habit = db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == user_id).first()
    if not habit:
        return False
    db.delete(habit)
    db.commit()
    return True
