import random
from datetime import date
from sqlalchemy.orm import Session
from app.database.models import Habit, HabitLog, DailyScore


def generate_reflection(db: Session, user_id: str) -> str:
    """Generate a motivational daily reflection based on today's performance."""
    today = date.today()

    daily = db.query(DailyScore).filter(
        DailyScore.user_id == user_id, DailyScore.date == today
    ).first()

    habits = db.query(Habit).filter(Habit.user_id == user_id).all()

    completed_habits = []
    missed_habits = []

    for habit in habits:
        log = (
            db.query(HabitLog)
            .filter(HabitLog.habit_id == habit.id, HabitLog.date == today)
            .first()
        )
        if log and log.tasks_completed > 0:
            completed_habits.append(habit.title)
        else:
            missed_habits.append(habit.title)

    effort = daily.effort_index if daily else 0.0

    # Generate reflection based on performance tier
    if effort >= 80:
        templates = [
            f"Outstanding day! You crushed it with {len(completed_habits)} habits completed. Your discipline is paying off! 🔥",
            f"Incredible effort today — {effort:.0f}% effort index. Keep this momentum going! 💪",
            f"You showed strong focus today, especially with {', '.join(completed_habits[:3])}. Remarkable consistency!",
        ]
    elif effort >= 50:
        templates = [
            f"Solid progress today with {len(completed_habits)} habits done. A few more and you'll hit your peak! 📈",
            f"Good effort at {effort:.0f}%. {missed_habits[0] if missed_habits else 'Keep going'} could push you higher tomorrow.",
            f"Decent day! You stayed consistent with {', '.join(completed_habits[:2])}. Build on this tomorrow! ✨",
        ]
    elif effort > 0:
        templates = [
            f"Today was a start — {len(completed_habits)} habits completed. Even small steps matter. Tomorrow, aim higher! 🌱",
            f"You showed up today, and that counts. Focus on {missed_habits[0] if missed_habits else 'one more habit'} tomorrow.",
            f"Every journey has slow days. You managed {effort:.0f}% today. Reset and come back stronger! 💫",
        ]
    else:
        templates = [
            "Looks like today was a rest day. That's okay — recovery matters too. Come back refreshed tomorrow! 🌙",
            "No habits logged today, but tomorrow is a fresh start. You've got this! 🚀",
            "Even champions take breaks. Plan your habits for tomorrow and start strong! 💡",
        ]

    return random.choice(templates)
