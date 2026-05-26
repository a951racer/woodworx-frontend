import { create } from 'zustand';
import type { Settings, UpdateSettingsDTO } from '../types';
import * as settingsApi from '../api/settings.api';

export interface SettingsStore {
  settings: Settings | null;
  loading: boolean;
  fetchSettings: () => Promise<void>;
  updateSettings: (data: UpdateSettingsDTO) => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: null,
  loading: false,

  fetchSettings: async () => {
    set({ loading: true });
    try {
      const settings = await settingsApi.get();
      set({ settings, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  updateSettings: async (data: UpdateSettingsDTO) => {
    const prev = useSettingsStore.getState().settings;
    try {
      const settings = await settingsApi.update(data);
      set({ settings });
    } catch {
      set({ settings: prev });
    }
  },
}));
