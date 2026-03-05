import uuid
from datetime import datetime, date, time as py_time
from sqlalchemy import (
    Column, String, Text, Integer, Float, Boolean, Date, Time,
    DateTime, ForeignKey,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database.database import Base


def gen_uuid():
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    name = Column(Text, nullable=False)
    email = Column(Text, unique=True, nullable=False)
    avatar_emoji = Column(Text, default="😊")
    created_at = Column(DateTime, default=datetime.utcnow)

    habits = relationship("Habit", back_populates="user", cascade="all, delete-orphan")
    photos = relationship("HabitPhoto", back_populates="user", cascade="all, delete-orphan")
    daily_scores = relationship("DailyScore", back_populates="user", cascade="all, delete-orphan")
    calendar_events = relationship("CalendarEvent", back_populates="user", cascade="all, delete-orphan")


class Habit(Base):
    __tablename__ = "habits"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    user_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=False)
    title = Column(Text, nullable=False)
    category = Column(Text, nullable=False)  # productivity, recreation, bonus, essential
    credit = Column(Integer, default=1)
    is_fixed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="habits")
    tasks = relationship("HabitTask", back_populates="habit", cascade="all, delete-orphan")
    logs = relationship("HabitLog", back_populates="habit", cascade="all, delete-orphan")
    photos = relationship("HabitPhoto", back_populates="habit", cascade="all, delete-orphan")


class HabitTask(Base):
    __tablename__ = "habit_tasks"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    habit_id = Column(UUID(as_uuid=False), ForeignKey("habits.id"), nullable=False)
    task_name = Column(Text, nullable=False)
    time = Column(Time, nullable=True)

    habit = relationship("Habit", back_populates="tasks")


class HabitLog(Base):
    __tablename__ = "habit_logs"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    habit_id = Column(UUID(as_uuid=False), ForeignKey("habits.id"), nullable=False)
    date = Column(Date, default=date.today)
    tasks_completed = Column(Integer, default=0)
    effort_percent = Column(Integer, default=0)
    score = Column(Float, default=0.0)

    habit = relationship("Habit", back_populates="logs")


class HabitPhoto(Base):
    __tablename__ = "habit_photos"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    user_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=False)
    habit_id = Column(UUID(as_uuid=False), ForeignKey("habits.id"), nullable=False)
    task_id = Column(UUID(as_uuid=False), nullable=True)
    image_data = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="photos")
    habit = relationship("Habit", back_populates="photos")


class DailyScore(Base):
    __tablename__ = "daily_scores"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    user_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=False)
    date = Column(Date, default=date.today)
    total_score = Column(Float, default=0.0)
    max_score = Column(Float, default=0.0)
    effort_index = Column(Float, default=0.0)

    user = relationship("User", back_populates="daily_scores")


class CalendarEvent(Base):
    __tablename__ = "calendar_events"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    user_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=False)
    title = Column(Text, nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="calendar_events")
