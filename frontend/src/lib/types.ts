export interface HomeProfile {
  address: string;
  year_built: number;
  square_footage: number;
  num_floors: number;
  home_type: "single_family" | "townhouse" | "condo";
  hvac_type: string;
  water_heater: "tank" | "tankless";
  roof_material: string;
  siding: string;
  has_basement: boolean;
  has_attic: boolean;
  has_pool: boolean;
  has_sprinkler_system: boolean;
  move_in_date: string;
}

export interface TaskOverride {
  task_name: string;
  enabled: boolean;
  frequency_months?: number;
}

export interface MaintenanceTask {
  id: string;
  category: string;
  name: string;
  frequency_months: number;
  description: string;
  estimated_time: string;
  enabled: boolean;
  dates: string[];
  freq_label: string;
}

export interface MaintenancePlan {
  tasks: MaintenanceTask[];
  total_tasks: number;
  categories: Record<string, number>;
  monthly_time_estimate: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export const DEFAULT_PROFILE: HomeProfile = {
  address: "",
  year_built: 2000,
  square_footage: 2000,
  num_floors: 2,
  home_type: "single_family",
  hvac_type: "central",
  water_heater: "tank",
  roof_material: "asphalt_shingle",
  siding: "vinyl",
  has_basement: false,
  has_attic: true,
  has_pool: false,
  has_sprinkler_system: false,
  move_in_date: "",
};
