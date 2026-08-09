import datetime


def current_streak(completed_dates: set[datetime.date], today: datetime.date) -> int:
    """Считает подряд идущие дни выполнения, отсчитывая от сегодня (или вчера, если
    сегодняшний день ещё не отмечен — чтобы стрик не сбрасывался до конца дня)."""
    if today in completed_dates:
        cursor = today
    elif today - datetime.timedelta(days=1) in completed_dates:
        cursor = today - datetime.timedelta(days=1)
    else:
        return 0

    streak = 0
    while cursor in completed_dates:
        streak += 1
        cursor -= datetime.timedelta(days=1)
    return streak


def longest_streak(completed_dates: set[datetime.date]) -> int:
    if not completed_dates:
        return 0
    longest = current = 0
    prev = None
    for day in sorted(completed_dates):
        if prev is not None and day == prev + datetime.timedelta(days=1):
            current += 1
        else:
            current = 1
        longest = max(longest, current)
        prev = day
    return longest


def completion_rate(completed_dates: set[datetime.date], today: datetime.date, window_days: int) -> float:
    start = today - datetime.timedelta(days=window_days - 1)
    hits = sum(1 for d in completed_dates if start <= d <= today)
    return round(hits / window_days * 100, 1)
