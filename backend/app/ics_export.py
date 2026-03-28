"""ICS calendar export for maintenance plans."""

import hashlib
from datetime import datetime, timedelta

from icalendar import Calendar, Event

from .models import MaintenanceTask


def build_ics(tasks: list[MaintenanceTask]) -> bytes:
    """Build an .ics file from a list of maintenance tasks."""
    cal = Calendar()
    cal.add("prodid", "-//Home Maintenance Planner//EN")
    cal.add("version", "2.0")
    cal.add("calscale", "GREGORIAN")
    cal.add("x-wr-calname", "Home Maintenance")

    for task in tasks:
        if not task.enabled:
            continue
        for date_str in task.dates:
            event = Event()
            dt = datetime.fromisoformat(date_str)

            uid_raw = f"homemaint-{task.name}-{date_str}"
            uid = hashlib.sha256(uid_raw.encode()).hexdigest()[:24]

            event.add("uid", f"{uid}@home-maintenance")
            event.add("dtstart", dt.date())
            event.add("dtend", (dt + timedelta(days=1)).date())
            event.add("summary", f"\U0001f3e0 [{task.category}] {task.name}")
            event.add("description",
                       f"WHAT TO DO:\n{task.description}\n\n"
                       f"ESTIMATED TIME: {task.estimated_time}\n"
                       f"FREQUENCY: {task.freq_label}")
            event.add("transp", "TRANSPARENT")

            cal.add_component(event)

    return cal.to_ical()
