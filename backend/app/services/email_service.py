import smtplib
import base64
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from app.core.config import settings


def send_daily_summary(
    to_email: str,
    effort_index: float,
    reflection: str,
    collage_b64: str | None = None,
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
        {"<p><em>See your day's collage attached below.</em></p>" if collage_b64 else ""}
    </body>
    </html>
    """
    msg.attach(MIMEText(body, "html"))

    # Attach collage if available
    if collage_b64:
        # Strip the data URI prefix if present
        if "," in collage_b64:
            collage_b64 = collage_b64.split(",")[1]
            
        try:
            image_data = base64.b64decode(collage_b64)
            img = MIMEImage(image_data, name="daily_collage.jpg")
            msg.attach(img)
        except Exception as e:
            print(f"Failed to attach collage to email: {e}")

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(settings.GMAIL_USER, settings.GMAIL_PASSWORD)
            server.send_message(msg)

        return True
    except Exception as e:
        print(f"Email send failed: {e}")
        return False
