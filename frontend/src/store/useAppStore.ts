import { create } from "zustand";
import {
  HomeProfile,
  MaintenancePlan,
  TaskOverride,
  ChatMessage,
  DEFAULT_PROFILE,
} from "../lib/types";
import { loadProfile, saveProfile, loadOverrides, saveOverrides } from "../lib/storage";

interface AppState {
  step: number;
  setStep: (step: number) => void;

  profile: HomeProfile;
  setProfile: (profile: HomeProfile) => void;

  plan: MaintenancePlan | null;
  setPlan: (plan: MaintenancePlan) => void;

  overrides: TaskOverride[];
  setOverrides: (overrides: TaskOverride[]) => void;
  updateOverride: (taskName: string, update: Partial<TaskOverride>) => void;

  chatMessages: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
  appendToLastMessage: (content: string) => void;

  ollamaAvailable: boolean | null;
  setOllamaAvailable: (available: boolean) => void;

  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  step: 1,
  setStep: (step) => set({ step }),

  profile: loadProfile() || DEFAULT_PROFILE,
  setProfile: (profile) => {
    saveProfile(profile);
    set({ profile });
  },

  plan: null,
  setPlan: (plan) => set({ plan }),

  overrides: loadOverrides(),
  setOverrides: (overrides) => {
    saveOverrides(overrides);
    set({ overrides });
  },
  updateOverride: (taskName, update) => {
    const { overrides } = get();
    const idx = overrides.findIndex((o) => o.task_name === taskName);
    let next: TaskOverride[];
    if (idx >= 0) {
      next = [...overrides];
      next[idx] = { ...next[idx], ...update };
    } else {
      next = [...overrides, { task_name: taskName, enabled: true, ...update }];
    }
    saveOverrides(next);
    set({ overrides: next });
  },

  chatMessages: [],
  addChatMessage: (msg) =>
    set((s) => ({ chatMessages: [...s.chatMessages, msg] })),
  appendToLastMessage: (content) =>
    set((s) => {
      const msgs = [...s.chatMessages];
      if (msgs.length > 0) {
        msgs[msgs.length - 1] = {
          ...msgs[msgs.length - 1],
          content: msgs[msgs.length - 1].content + content,
        };
      }
      return { chatMessages: msgs };
    }),

  ollamaAvailable: null,
  setOllamaAvailable: (available) => set({ ollamaAvailable: available }),

  loading: false,
  setLoading: (loading) => set({ loading }),
}));
