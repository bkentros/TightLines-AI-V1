/**
 * Environmental Data Store — Zustand
 *
 * Holds env data, loading state, and error for the Live Conditions widget
 * and other consumers. Uses lib/env for fetching; this store is a thin
 * React-friendly wrapper.
 *
 * @see docs/ENV_API_IMPLEMENTATION_PLAN.md
 */

import { create } from 'zustand';
import type { EnvironmentData } from '../lib/env';

export interface EnvState {
  /** Current environment data, or null if not loaded */
  envData: EnvironmentData | null;
  /** Whether a fetch is in progress */
  isLoading: boolean;
  /** Error message if the last fetch failed */
  error: string | null;
  /** Last coordinates used (for refresh/same-location checks) */
  lastCoords: { lat: number; lon: number } | null;

  /** Load env data for the given coordinates. Idempotent within same request. */
  loadEnv: (
    latitude: number,
    longitude: number,
    options?: { units?: 'imperial' | 'metric'; forceRefresh?: boolean }
  ) => Promise<void>;
  /** Clear stored data and error (e.g. on sign out) */
  clear: () => void;
}

export const useEnvStore = create<EnvState>((set, get) => ({
  envData: null,
  isLoading: false,
  error: null,
  lastCoords: null,

  loadEnv: async (latitude, longitude, options = {}) => {
    const { units = 'imperial', forceRefresh = false } = options;
    const { lastCoords } = get();

    // Clear stale data when location changed so we don't show wrong location's weather
    const coordsChanged =
      !lastCoords ||
      Math.abs(lastCoords.lat - latitude) > 0.01 ||
      Math.abs(lastCoords.lon - longitude) > 0.01;
    if (coordsChanged) {
      set({ envData: null });
    }

    set({ isLoading: true, error: null });

    try {
      const { getEnvironment } = await import('../lib/env');
      const data = await getEnvironment({
        latitude,
        longitude,
        units,
        forceRefresh,
      });
      set({
        envData: data,
        lastCoords: { lat: latitude, lon: longitude },
        isLoading: false,
        error: null,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load conditions';
      const isRateLimit = message.includes('Please wait');
      set({
        envData: isRateLimit ? get().envData : null,
        isLoading: false,
        error: message,
      });
    }
  },

  clear: () => {
    set({ envData: null, error: null, lastCoords: null });
  },
}));
