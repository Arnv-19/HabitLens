import smtplib
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from app.core.config import settings


def send_daily_summary(
    to_email: str,
    effort_index: float,
    reflection: str,
    collage_path: str | None = None,
):
    """Send the daily summary email with collage, effort index, and AI reflection."""

    msg = MIMEMultipart()
    msg["From"] = settings.GMAIL_USER
    msg["To"] = to_email
    msg["Subject"] = f"🌟 HabitLens Daily Summary — Effort Index: {effort_index:.1f}%"

    body = f"""
    <html>
    <body style="background:#000;color:#fff;font-family:sans-serif;padding:20px;">
        <h1 style="color:#fff;">📊 Your Daily HabitLens Summary</h1>
        <p><strong>Effort Index:</strong> {effort_index:.1f}%</p>
        <p><strong>AI Reflection:</strong> {reflection}</p>
        {"<p><em>See your day's collage attached below.</em></p>" if collage_path else ""}
    </body>
    </html>
    """
    msg.attach(MIMEText(body, "html"))

    # Attach collage if available
    if collage_path and os.path.exists(collage_path):
        with open(collage_path, "rb") as f:
            img = MIMEImage(f.read(), name="daily_collage.jpg")
            msg.attach(img)

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(settings.GMAIL_USER, settings.GMAIL_PASSWORD)
            server.send_message(msg)

        # Clean up collage after sending
        if collage_path and os.path.exists(collage_path):
            os.remove(collage_path)

        return True
    except Exception as e:
        print(f"Email send failed: {e}")
        return False
