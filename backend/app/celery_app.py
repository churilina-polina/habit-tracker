from celery import Celery
from celery.schedules import crontab

from app.config import settings

celery_app = Celery("habit_tracker", broker=settings.redis_url, backend=settings.redis_url)

celery_app.conf.beat_schedule = {
    "check-reminders-every-minute": {
        "task": "app.tasks.send_due_reminders",
        "schedule": crontab(minute="*"),
    }
}
celery_app.conf.timezone = "Europe/Moscow"
celery_app.autodiscover_tasks(["app"])
