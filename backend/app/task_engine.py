"""
Task engine: filters and adjusts maintenance tasks based on the home profile.
"""

from datetime import date

from .models import HomeProfile, MaintenanceTask, TaskOverride
from .tasks_data import TASKS
from .date_utils import generate_dates, freq_label

# Tasks to remove for condos
CONDO_EXCLUDED = {
    "Clean Gutters",
    "Inspect Roof for Damage",
    "Inspect Siding & Exterior Paint",
    "Check Caulking Around Windows & Doors",
    "Winterize Outdoor Faucets",
    "Check Weather Stripping",
}

# Tasks to remove when feature is absent
NO_ATTIC_EXCLUDED = {"Inspect Attic Insulation"}
TANKLESS_EXCLUDED = {"Check Water Heater Anode Rod"}

# Additional tasks for specific features
POOL_TASKS = [
    ("Pool", "Check Pool Chemistry", 1,
     "Test pool water pH (7.2-7.6), chlorine (1-3 ppm), and alkalinity (80-120 ppm). "
     "Adjust chemicals as needed. Clean skimmer baskets and check pump operation.",
     "15 min"),
    ("Pool", "Winterize Pool", 12,
     "Lower water level, add winterizing chemicals, blow out plumbing lines, "
     "cover the pool. Do this before the first freeze. "
     "Consider hiring a professional for the first time.",
     "2-3 hours"),
]

SPRINKLER_TASKS = [
    ("Irrigation", "Test Sprinkler System", 3,
     "Run each sprinkler zone and check for: broken heads, misaligned spray, "
     "dry spots, or leaks. Clean clogged nozzles. Adjust coverage as needed.",
     "30 min"),
    ("Irrigation", "Winterize Sprinklers", 12,
     "Blow out sprinkler lines with compressed air before the first freeze. "
     "Shut off the water supply to the irrigation system. "
     "Most people hire a professional for this (~$50-100).",
     "1 hour"),
]

BASEMENT_TASKS = [
    ("Plumbing", "Check Sump Pump", 3,
     "Pour a bucket of water into the sump pit to trigger the pump. "
     "Verify it turns on, pumps water out, and shuts off. "
     "Check the discharge pipe for blockages. Test the backup battery if you have one.",
     "10 min"),
    ("Interior", "Inspect Basement for Moisture", 6,
     "Check basement walls and floor for: water stains, efflorescence (white powder), "
     "cracks, musty odors, or condensation. Check around windows and where walls meet floor. "
     "Address issues early to prevent mold and structural damage.",
     "20 min"),
]


def _home_age(profile: HomeProfile) -> int:
    """Calculate home age in years."""
    return date.today().year - profile.year_built


def _build_task_list(profile: HomeProfile) -> list[tuple]:
    """Build the full task list based on profile features."""
    tasks = list(TASKS)

    # Add feature-specific tasks
    if profile.has_pool:
        tasks.extend(POOL_TASKS)
    if profile.has_sprinkler_system:
        tasks.extend(SPRINKLER_TASKS)
    if profile.has_basement:
        tasks.extend(BASEMENT_TASKS)

    return tasks


def _should_exclude(task_name: str, profile: HomeProfile) -> bool:
    """Check if a task should be excluded based on the profile."""
    if profile.home_type == "condo" and task_name in CONDO_EXCLUDED:
        return True
    if not profile.has_attic and task_name in NO_ATTIC_EXCLUDED:
        return True
    if profile.water_heater == "tankless" and task_name in TANKLESS_EXCLUDED:
        return True
    return False


def _adjust_frequency(task_name: str, base_freq: int, profile: HomeProfile) -> int:
    """Adjust task frequency based on home age and conditions."""
    age = _home_age(profile)

    if age > 20:
        if task_name in ("Inspect Roof for Damage", "Inspect Electrical Panel"):
            if base_freq >= 12:
                return 6
    if age > 30:
        if task_name == "Check Caulking Around Windows & Doors":
            if base_freq >= 12:
                return 6

    if age < 5:
        if task_name == "Professional HVAC Tune-Up":
            if base_freq <= 6:
                return 12
        if task_name == "Check Surge Protectors":
            if base_freq <= 24:
                return 36

    if age < 3:
        if task_name == "Inspect Siding & Exterior Paint":
            if base_freq <= 12:
                return 24

    return base_freq


def generate_plan(
    profile: HomeProfile,
    overrides: list[TaskOverride],
    start_date: date,
    years: int = 2,
) -> list[MaintenanceTask]:
    """Generate a personalized maintenance plan."""
    end_date = date(start_date.year + years, start_date.month, start_date.day)
    override_map = {o.task_name: o for o in overrides}

    all_tasks = _build_task_list(profile)
    result = []

    for idx, (category, name, base_freq, description, est_time) in enumerate(all_tasks):
        # Check exclusions
        if _should_exclude(name, profile):
            continue

        # Apply frequency adjustments
        freq = _adjust_frequency(name, base_freq, profile)

        # Apply overrides
        enabled = True
        override = override_map.get(name)
        if override:
            enabled = override.enabled
            if override.frequency_months is not None:
                freq = override.frequency_months

        # Generate dates
        dates = generate_dates(name, freq, start_date, end_date) if enabled else []

        task = MaintenanceTask(
            id=f"task-{idx}",
            category=category,
            name=name,
            frequency_months=freq,
            description=description,
            estimated_time=est_time,
            enabled=enabled,
            dates=[d.isoformat() for d in dates],
            freq_label=freq_label(freq),
        )
        result.append(task)

    return result


def compute_monthly_time(tasks: list[MaintenanceTask]) -> str:
    """Estimate total monthly time commitment."""
    total_minutes = 0
    for task in tasks:
        if not task.enabled:
            continue
        # Parse estimated time to get minutes
        est = task.estimated_time.lower()
        minutes = 0
        if "hour" in est:
            try:
                # Handle "2-3 hours" -> take average
                parts = est.split("hour")[0].strip()
                if "-" in parts:
                    lo, hi = parts.split("-")
                    minutes = (float(lo) + float(hi)) / 2 * 60
                else:
                    minutes = float(parts) * 60
            except ValueError:
                minutes = 60
        elif "min" in est:
            try:
                parts = est.split("min")[0].strip()
                if "(" in parts:
                    parts = parts.split("(")[0].strip()
                minutes = float(parts)
            except ValueError:
                minutes = 15

        # Monthly contribution = minutes / frequency_months
        if task.frequency_months > 0:
            total_minutes += minutes / task.frequency_months

    hours = int(total_minutes // 60)
    mins = int(total_minutes % 60)
    if hours > 0:
        return f"~{hours}h {mins}min/month"
    return f"~{mins}min/month"
