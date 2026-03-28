"""Plan generation and ICS export endpoints."""

from datetime import date

from fastapi import APIRouter, Query
from fastapi.responses import Response

from ..models import PlanRequest, MaintenancePlan, HomeProfile, TaskOverride
from ..task_engine import generate_plan, compute_monthly_time
from ..ics_export import build_ics

router = APIRouter(prefix="/api/plan", tags=["plan"])


@router.post("", response_model=MaintenancePlan)
async def create_plan(request: PlanRequest):
    """Generate a personalized maintenance plan."""
    start = (
        date.fromisoformat(request.start_date)
        if request.start_date
        else date.today()
    )

    tasks = generate_plan(
        profile=request.profile,
        overrides=request.overrides,
        start_date=start,
        years=request.years,
    )

    # Build category counts
    categories: dict[str, int] = {}
    for t in tasks:
        if t.enabled:
            categories[t.category] = categories.get(t.category, 0) + 1

    return MaintenancePlan(
        tasks=tasks,
        total_tasks=sum(1 for t in tasks if t.enabled),
        categories=categories,
        monthly_time_estimate=compute_monthly_time(tasks),
    )


@router.post("/ics")
async def export_ics(request: PlanRequest):
    """Generate and download an .ics file for the plan."""
    start = (
        date.fromisoformat(request.start_date)
        if request.start_date
        else date.today()
    )

    tasks = generate_plan(
        profile=request.profile,
        overrides=request.overrides,
        start_date=start,
        years=request.years,
    )

    ics_data = build_ics(tasks)

    return Response(
        content=ics_data,
        media_type="text/calendar",
        headers={
            "Content-Disposition": "attachment; filename=home-maintenance.ics"
        },
    )
