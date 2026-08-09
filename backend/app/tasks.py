import asyncio
import datetime

from sqlalchemy import select

from app.celery_app import celery_app
from app.database import AsyncSessionLocal
from app.models import Habit, HabitLog, Notification


async def _send_due_reminders_async():
    now = datetime.datetime.now()
    current_time = now.time().replace(second=0, microsecond=0)
    today = now.date()

    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(Habit).where(
                Habit.reminder_enabled.is_(True),
                Habit.is_active.is_(True),
                Habit.reminder_time == current_time,
            )
        )
        due_habits = result.scalars().all()

        for habit in due_habits:
            log_result = await db.execute(
                select(HabitLog).where(HabitLog.habit_id == habit.id, HabitLog.date == today)
            )
            if log_result.scalar_one_or_none() is not None:
                continue  # уже отмечена сегодня — напоминание не нужно

            db.add(
                Notification(
                    user_id=habit.owner_id,
                    habit_id=habit.id,
                    message=f"Не забудь: «{habit.title}» сегодня ещё не отмечена",
                )
            )
        await db.commit()


@celery_app.task(name="app.tasks.send_due_reminders")
def send_due_reminders():
    """Раз в минуту проверяет привычки с включённым напоминанием на текущее время
    и создаёт уведомление, если привычка ещё не отмечена сегодня."""
    asyncio.run(_send_due_reminders_async())
