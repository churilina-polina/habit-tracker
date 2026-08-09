from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    secret_key: str = "insecure-dev-key"
    database_url: str = "sqlite+aiosqlite:///./habit_tracker.db"
    redis_url: str = "redis://localhost:6379/0"
    access_token_expire_minutes: int = 60 * 24
    algorithm: str = "HS256"


settings = Settings()
