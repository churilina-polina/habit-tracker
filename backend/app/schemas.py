import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models import HabitCategory


class UserCreate(BaseModel):
    email: EmailStr
    name: str = Field(min_length=1, max_length=255)
    password: str = Field(min_length=8)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    name: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class HabitCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    category: HabitCategory = HabitCategory.OTHER
    reminder_enabled: bool = False
    reminder_time: datetime.time | None = None


class HabitUpdate(BaseModel):
    title: str | None = None
    category: HabitCategory | None = None
    reminder_enabled: bool | None = None
    reminder_time: datetime.time | None = None
    is_active: bool | None = None


class HabitOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    category: HabitCategory
    reminder_enabled: bool
    reminder_time: datetime.time | None
    is_active: bool
    completed_today: bool = False
    current_streak: int = 0
    last_7_days: list[bool] = []


class HabitStats(BaseModel):
    habit_id: int
    current_streak: int
    longest_streak: int
    completion_rate_7d: float
    completion_rate_30d: float
    history: list[dict]


class NotificationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    habit_id: int | None
    message: str
    is_read: bool
    created_at: datetime.datetime
