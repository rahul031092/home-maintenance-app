import { HomeProfile, TaskOverride } from "./types";

const PROFILE_KEY = "home-maintenance-profile";
const OVERRIDES_KEY = "home-maintenance-overrides";

export function loadProfile(): HomeProfile | null {
  const raw = localStorage.getItem(PROFILE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveProfile(profile: HomeProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function loadOverrides(): TaskOverride[] {
  const raw = localStorage.getItem(OVERRIDES_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveOverrides(overrides: TaskOverride[]) {
  localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides));
}
