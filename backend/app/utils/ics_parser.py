from icalendar import Calendar
from datetime import datetime
from typing import List, Dict


def parse_ics(file_content: bytes) -> List[Dict]:
    """Parse an ICS file and extract calendar events."""
    cal = Calendar.from_ical(file_content)
    events = []

    for component in cal.walk():
        if component.name == "VEVENT":
            summary = str(component.get("summary", "Untitled"))
            dtstart = component.get("dtstart")
            dtend = component.get("dtend")

            start_time = dtstart.dt if dtstart else None
            end_time = dtend.dt if dtend else None

            # Convert date objects to datetime
            if start_time and not isinstance(start_time, datetime):
                start_time = datetime.combine(start_time, datetime.min.time())
            if end_time and not isinstance(end_time, datetime):
                end_time = datetime.combine(end_time, datetime.min.time())

            events.append({
                "title": summary,
                "start_time": start_time,
                "end_time": end_time,
            })

    return events
