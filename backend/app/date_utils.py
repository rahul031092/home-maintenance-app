"""
Date generation utilities for maintenance scheduling.
Ported from home_maintenance.py.
"""

import hashlib
from datetime import date, timedelta

from .tasks_data import SEASONAL_PREFERENCES


def generate_dates(task_name: str, freq_months: int, start: date, end: date) -> list[date]:
    """Generate event dates for a task, respecting seasonal preferences."""
    dates = []
    preferred_months = SEASONAL_PREFERENCES.get(task_name)

    if preferred_months:
        current_year = start.year
        while current_year <= end.year:
            for month in preferred_months:
                day = day_offset(task_name, month)
                d = date(current_year, month, day)
                if start <= d <= end:
                    dates.append(d)
            current_year += 1
    else:
        current = start.replace(day=day_offset(task_name, start.month))
        if current < start:
            current = advance_months(current, freq_months)

        while current <= end:
            day = day_offset(task_name, current.month)
            current = current.replace(day=min(day, month_end(current)))
            if start <= current <= end:
                dates.append(current)
            current = advance_months(current, freq_months)

    return dates


def day_offset(task_name: str, month: int) -> int:
    """Generate a consistent day-of-month (3-24) for a task."""
    h = int(hashlib.md5(f"{task_name}-{month}".encode()).hexdigest(), 16)
    return (h % 22) + 3


def advance_months(d: date, months: int) -> date:
    """Advance a date by N months."""
    month = d.month - 1 + months
    year = d.year + month // 12
    month = month % 12 + 1
    day = min(d.day, month_end(date(year, month, 1)))
    return date(year, month, day)


def month_end(d: date) -> int:
    """Return the last day of the month for date d."""
    if d.month == 12:
        return 31
    return (date(d.year, d.month + 1, 1) - timedelta(days=1)).day


def freq_label(months: int) -> str:
    """Human-readable frequency label."""
    if months == 1:
        return "Monthly"
    if months == 3:
        return "Quarterly"
    if months == 6:
        return "Twice a year"
    if months == 12:
        return "Yearly"
    if months == 24:
        return "Every 2 years"
    if months == 36:
        return "Every 3 years"
    return f"Every {months} months"
