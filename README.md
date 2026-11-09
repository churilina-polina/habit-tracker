# Habitly — трекер привычек

[![CI](https://github.com/churilina-polina/habit-tracker/actions/workflows/ci.yml/badge.svg)](https://github.com/churilina-polina/habit-tracker/actions/workflows/ci.yml)
![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-async-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Celery](https://img.shields.io/badge/Celery-Redis-37814A?logo=celery&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)

Веб-приложение для отслеживания привычек: ежедневный чеклист, стрики, статистика и напоминания. Светлый минималистичный интерфейс.

> **In short (EN):** habit tracker web app with a daily checklist, streaks, statistics and reminders.
> Async FastAPI + SQLAlchemy 2, React, PostgreSQL, Celery/Redis reminders, Docker, GitHub Actions CI.

## Идея

Каждая привычка отмечается одним кликом раз в день. Приложение считает стрик (сколько дней подряд привычка выполняется), показывает процент выполнения за неделю/месяц и присылает напоминание, если привычка ещё не отмечена к заданному времени.

## Стек

**Backend:** Python 3.12, FastAPI (async), SQLAlchemy 2.0 (async), PostgreSQL, JWT-авторизация, Celery + Redis (фоновые напоминания), pytest.

**Frontend:** React 18, React Router, Axios, Recharts (график динамики), чистый CSS с дизайн-токенами (без UI-фреймворков).

**Инфраструктура:** Docker + docker-compose (backend, frontend/nginx, PostgreSQL, Redis, Celery worker + beat), CI на GitHub Actions.

## Возможности

- Регистрация/логин по email + JWT
- CRUD привычек с категориями (здоровье, учёба, продуктивность, другое)
- Ежедневный чеклист с одним кликом на выполнение
- Стрики (текущий и лучший) и процент выполнения за 7/30 дней
- График динамики по дням (Recharts)
- Напоминания: Celery Beat раз в минуту проверяет привычки с включённым напоминанием и создаёт уведомление, если привычка ещё не отмечена
- Приватность: у каждого пользователя видны только свои привычки

## Запуск через Docker

```bash
git clone https://github.com/churilina-polina/habit-tracker.git
cd habit-tracker
docker compose up --build
```

- Фронтенд: `http://localhost:5173`
- API: `http://localhost:8000`, документация — `http://localhost:8000/docs`

## Локальный запуск без Docker

**Backend:**

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

**Напоминания (опционально, нужен Redis):**

```bash
celery -A app.celery_app worker --loglevel=info
celery -A app.celery_app beat --loglevel=info
```

## Тесты

```bash
cd backend
pytest
```

## Структура проекта

```
habit-tracker/
├── backend/          # FastAPI приложение
│   └── app/
│       ├── routers/  # auth, habits, notifications
│       ├── models.py
│       ├── schemas.py
│       ├── streaks.py    # логика подсчёта стриков
│       ├── celery_app.py # фоновые напоминания
│       └── tests/
├── frontend/         # React SPA
│   └── src/
│       ├── pages/    # Login, Register, Dashboard, HabitDetail
│       └── components/
└── docker-compose.yml
```
