import { useSettingsStore } from '../stores/settingsStore';
import type { Settings } from '../types';

/**
 * Hook for accessing the user's settings across components.
 * Returns the current settings object (or null if not yet loaded).
 */
export function useSettings(): Settings | null {
  return useSettingsStore((s) => s.settings);
}
