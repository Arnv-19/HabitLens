import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    PROJECT_NAME: str = "HabitLens API"
    VERSION: str = "1.0.0"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "supersecretkey")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_HOURS: int = 72
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
    GMAIL_USER: str = os.getenv("GMAIL_USER", "")
    GMAIL_PASSWORD: str = os.getenv("GMAIL_PASSWORD", "")
    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")


settings = Settings()

if os.getenv("ENVIRONMENT") == "production" and settings.JWT_SECRET == "supersecretkey":
    raise ValueError("FATAL: JWT_SECRET must be explicitly set in production environment.")

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
