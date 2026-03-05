from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import engine
from app.database.models import Base

from app.routes.auth_routes import router as auth_router
from app.routes.habit_routes import router as habit_router
from app.routes.task_routes import router as task_router
from app.routes.calendar_routes import router as calendar_router
from app.routes.dashboard_routes import router as dashboard_router
from app.routes.collage_routes import router as collage_router
from app.routes.quote_routes import router as quote_router
from app.routes.reflection_routes import router as reflection_router

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="HabitLens API",
    description="Production-ready habit tracking platform backend",
    version="1.0.0",
)

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth_router)
app.include_router(habit_router)
app.include_router(task_router)
app.include_router(calendar_router)
app.include_router(dashboard_router)
app.include_router(collage_router)
app.include_router(quote_router)
app.include_router(reflection_router)


@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Welcome to HabitLens API!", "docs": "/docs"}
