import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps import get_current_user
from app.models import Habit, HabitLog, User
from app.schemas import HabitCreate, HabitOut, HabitStats, HabitUpdate
from app.streaks import completion_rate, current_streak, longest_streak

router = APIRouter(prefix="/habits", tags=["habits"])


async def _get_owned_habit(habit_id: int, user: User, db: AsyncSession) -> Habit:
    result = await db.execute(
        select(Habit).where(Habit.id == habit_id, Habit.owner_id == user.id)
    )
    habit = result.scalar_one_or_none()
    if habit is None:
        raise HTTPException(status_code=404, detail="Привычка не найдена")
    return habit


async def _completed_dates(habit_id: int, db: AsyncSession) -> set[datetime.date]:
    result = await db.execute(
        select(HabitLog.date).where(HabitLog.habit_id == habit_id, HabitLog.completed.is_(True))
    )
    return {row[0] for row in result.all()}


@router.get("", response_model=list[HabitOut])
async def list_habits(
    db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Habit).where(Habit.owner_id == user.id, Habit.is_active.is_(True))
    )
    habits = result.scalars().all()
    today = datetime.date.today()

    output = []
    for habit in habits:
        dates = await _completed_dates(habit.id, db)
        item = HabitOut.model_validate(habit)
        item.completed_today = today in dates
        item.current_streak = current_streak(dates, today)
        item.last_7_days = [
            (today - datetime.timedelta(days=offset)) in dates for offset in range(6, -1, -1)
        ]
        output.append(item)
    return output


@router.post("", response_model=HabitOut, status_code=201)
async def create_habit(
    payload: HabitCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    habit = Habit(owner_id=user.id, **payload.model_dump())
    db.add(habit)
    await db.commit()
    await db.refresh(habit)
    return HabitOut.model_validate(habit)


@router.patch("/{habit_id}", response_model=HabitOut)
async def update_habit(
    habit_id: int,
    payload: HabitUpdate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    habit = await _get_owned_habit(habit_id, user, db)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(habit, field, value)
    await db.commit()
    await db.refresh(habit)
    return HabitOut.model_validate(habit)


@router.delete("/{habit_id}", status_code=204)
async def delete_habit(
    habit_id: int, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)
):
    habit = await _get_owned_habit(habit_id, user, db)
    await db.delete(habit)
    await db.commit()


@router.post("/{habit_id}/toggle", response_model=HabitOut)
async def toggle_today(
    habit_id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    habit = await _get_owned_habit(habit_id, user, db)
    today = datetime.date.today()

    result = await db.execute(
        select(HabitLog).where(HabitLog.habit_id == habit.id, HabitLog.date == today)
    )
    log = result.scalar_one_or_none()

    if log is None:
        db.add(HabitLog(habit_id=habit.id, date=today, completed=True))
    else:
        await db.delete(log)
    await db.commit()

    dates = await _completed_dates(habit.id, db)
    item = HabitOut.model_validate(habit)
    item.completed_today = today in dates
    item.current_streak = current_streak(dates, today)
    item.last_7_days = [
        (today - datetime.timedelta(days=offset)) in dates for offset in range(6, -1, -1)
    ]
    return item


@router.get("/{habit_id}/stats", response_model=HabitStats)
async def habit_stats(
    habit_id: int, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)
):
    habit = await _get_owned_habit(habit_id, user, db)
    dates = await _completed_dates(habit.id, db)
    today = datetime.date.today()

    history = [
        {
            "date": (today - datetime.timedelta(days=offset)).isoformat(),
            "completed": (today - datetime.timedelta(days=offset)) in dates,
        }
        for offset in range(27, -1, -1)
    ]

    return HabitStats(
        habit_id=habit.id,
        current_streak=current_streak(dates, today),
        longest_streak=longest_streak(dates),
        completion_rate_7d=completion_rate(dates, today, 7),
        completion_rate_30d=completion_rate(dates, today, 30),
        history=history,
    )
