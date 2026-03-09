from datetime import date
from sqlalchemy.orm import Session
from app.database.models import HabitLog, Habit, DailyScore


def compute_habit_score(credit: int, total_tasks: int, tasks_completed: int, effort_percent: int) -> float:
    """
    HabitScore = C × (t / T) × (E / 100)
    """
    if total_tasks == 0:
        return 0.0
    task_completion = tasks_completed / total_tasks
    effort_modifier = effort_percent / 100.0
    return credit * task_completion * effort_modifier


def log_habit(db: Session, user_id: str, habit_id: str, tasks_completed: int, effort_percent: int) -> HabitLog:
    """Log a habit completion and update daily scores."""
    habit = db.query(Habit).filter(Habit.id == habit_id, Habit.user_id == user_id).first()
    if not habit:
        raise ValueError("Habit not found")

    total_tasks = len(habit.tasks)
    
    # Clamp values to avoid > 100% effort/score explosions
    if total_tasks > 0:
        tasks_completed = min(tasks_completed, total_tasks)
    effort_percent = min(effort_percent, 100)

    score = compute_habit_score(habit.credit, total_tasks, tasks_completed, effort_percent)

    today = date.today()
    log = db.query(HabitLog).filter(HabitLog.habit_id == habit_id, HabitLog.date == today).first()
    
    if log:
        log.tasks_completed = tasks_completed
        log.effort_percent = effort_percent
        log.score = score
    else:
        log = HabitLog(
            habit_id=habit_id,
            date=today,
            tasks_completed=tasks_completed,
            effort_percent=effort_percent,
            score=score,
        )
        db.add(log)
        
    db.commit()

    # Update daily scores
    update_daily_score(db, user_id)

    db.refresh(log)
    return log


def update_daily_score(db: Session, user_id: str):
    """Recalculate today's daily score for the user."""
    today = date.today()

    # Get all habits for user
    habits = db.query(Habit).filter(Habit.user_id == user_id).all()

    total_score = 0.0
    max_score = 0.0

    for habit in habits:
        max_score += habit.credit
        # Get today's log for this habit
        log = (
            db.query(HabitLog)
            .filter(HabitLog.habit_id == habit.id, HabitLog.date == today)
            .order_by(HabitLog.id.desc())
            .first()
        )
        if log:
            total_score += log.score

    effort_index = (total_score / max_score * 100) if max_score > 0 else 0.0

    # Upsert daily score
    daily = db.query(DailyScore).filter(
        DailyScore.user_id == user_id, DailyScore.date == today
    ).first()

    if daily:
        daily.total_score = total_score
        daily.max_score = max_score
        daily.effort_index = effort_index
    else:
        daily = DailyScore(
            user_id=user_id,
            date=today,
            total_score=total_score,
            max_score=max_score,
            effort_index=effort_index,
        )
        db.add(daily)

    db.commit()
