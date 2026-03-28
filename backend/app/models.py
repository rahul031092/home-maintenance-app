"""Pydantic models for request/response schemas."""

from pydantic import BaseModel


class HomeProfile(BaseModel):
    address: str = ""
    year_built: int = 2000
    square_footage: int = 2000
    num_floors: int = 2
    home_type: str = "single_family"  # single_family | townhouse | condo
    hvac_type: str = "central"
    water_heater: str = "tank"  # tank | tankless
    roof_material: str = "asphalt_shingle"
    siding: str = "vinyl"
    has_basement: bool = False
    has_attic: bool = True
    has_pool: bool = False
    has_sprinkler_system: bool = False
    move_in_date: str = ""  # ISO date string


class TaskOverride(BaseModel):
    task_name: str
    enabled: bool = True
    frequency_months: int | None = None


class PlanRequest(BaseModel):
    profile: HomeProfile
    overrides: list[TaskOverride] = []
    start_date: str = ""  # ISO date, defaults to today
    years: int = 2


class MaintenanceTask(BaseModel):
    id: str
    category: str
    name: str
    frequency_months: int
    description: str
    estimated_time: str
    enabled: bool = True
    dates: list[str] = []  # ISO date strings
    freq_label: str = ""


class MaintenancePlan(BaseModel):
    tasks: list[MaintenanceTask]
    total_tasks: int
    categories: dict[str, int]  # category -> count
    monthly_time_estimate: str


class ChatRequest(BaseModel):
    message: str
    profile: HomeProfile
    plan_summary: str = ""
    history: list[dict] = []  # [{role, content}]
