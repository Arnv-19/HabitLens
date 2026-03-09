from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date, timedelta
from typing import Optional

from app.database.database import get_db
from app.database.models import DailyScore, Habit, HabitLog
from app.core.security import get_current_user
from app.schemas.habit_schema import HabitLogCreate, HabitLogResponse
from app.services.scoring_service import log_habit

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.post("/habit-log", response_model=HabitLogResponse)
def create_habit_log(
    data: HabitLogCreate,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    """Log habit completion and compute score."""
    log = log_habit(db, user["sub"], data.habit_id, data.tasks_completed, data.effort_percent)
    return log


@router.get("/habit-log", response_model=list[HabitLogResponse])
def get_habit_logs(
    habit_id: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    """Fetch logs optionally filtered by habit, start_date, and end_date."""
    user_id = user["sub"]
    
    query = db.query(HabitLog).join(Habit).filter(Habit.user_id == user_id)
    
    if habit_id:
        query = query.filter(HabitLog.habit_id == habit_id)
    if start_date:
        query = query.filter(HabitLog.date >= start_date)
    if end_date:
        query = query.filter(HabitLog.date <= end_date)
        
    return query.order_by(HabitLog.date.desc()).all()


@router.delete("/habit-log/{log_id}", status_code=204)
def delete_habit_log(
    log_id: str,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    """Delete a habit log entry. Only recalculates score if log was for today."""
    log = db.query(HabitLog).join(Habit).filter(HabitLog.id == log_id, Habit.user_id == user["sub"]).first()
    if not log:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Log not found")
        
    is_today = log.date == date.today()
    db.delete(log)
    db.commit()
    
    if is_today:
        from app.services.scoring_service import update_daily_score
        update_daily_score(db, user["sub"])



@router.get("")
def get_dashboard(
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    """Get today's dashboard overview."""
    today = date.today()
    user_id = user["sub"]

    daily = db.query(DailyScore).filter(
        DailyScore.user_id == user_id, DailyScore.date == today
    ).first()

    total_habits = db.query(Habit).filter(Habit.user_id == user_id).count()

    # Calculate streak
    streak = 0
    check_date = today
    while True:
        score = db.query(DailyScore).filter(
            DailyScore.user_id == user_id, DailyScore.date == check_date
        ).first()
        if score and score.total_score > 0:
            streak += 1
            check_date -= timedelta(days=1)
        else:
            break

    return {
        "effort_index": daily.effort_index if daily else 0.0,
        "daily_score": daily.total_score if daily else 0.0,
        "streak": streak,
        "total_habits": total_habits,
    }


@router.get("/weekly")
def get_weekly(
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    """Get effort index for the last 7 days."""
    today = date.today()
    user_id = user["sub"]
    result = []

    for i in range(6, -1, -1):
        d = today - timedelta(days=i)
        score = db.query(DailyScore).filter(
            DailyScore.user_id == user_id, DailyScore.date == d
        ).first()
        result.append({
            "date": d.isoformat(),
            "effort_index": score.effort_index if score else 0.0,
        })

    return result


@router.get("/monthly")
def get_monthly(
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    """Get effort values for the current month (heatmap data)."""
    today = date.today()
    first_day = today.replace(day=1)
    user_id = user["sub"]

    scores = db.query(DailyScore).filter(
        DailyScore.user_id == user_id,
        DailyScore.date >= first_day,
        DailyScore.date <= today,
    ).all()

    return [
        {
            "date": s.date.isoformat(),
            "effort_index": s.effort_index,
            "total_score": s.total_score,
        }
        for s in scores
    ]
