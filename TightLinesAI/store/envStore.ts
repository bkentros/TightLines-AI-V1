/**
 * Environmental Data Store — Zustand
 *
 * Holds env data, loading state, and error for the Live Conditions widget
 * and other consumers. Uses lib/env for fetching; this store is a thin
 * React-friendly wrapper.
 *
 * Stale-while-revalidate: when returning to the app with no in-memory data,
 * we show last cached data (even expired) immediately, then refresh in background.
 *
 * @see docs/ENV_API_IMPLEMENTATION_PLAN.md
 */

import { create } from 'zustand';
import type { EnvironmentData } from '../lib/env';

/** Incremented on each loadEnv call; used to ignore results from superseded requests */
let loadGeneration = 0;
let inFlightRequestKey: string | null = null;
let inFlightRequestPromise: Promise<void> | null = null;

function makeRequestKey(
  latitude: number,
  longitude: number,
  units: 'imperial' | 'metric',
  forceRefresh: boolean
): string {
  return [
    latitude.toFixed(4),
    longitude.toFixed(4),
    units,
    forceRefresh ? 'force' : 'cached',
  ].join(':');
}

export interface EnvState {
  /** Current environment data, or null if not loaded */
  envData: EnvironmentData | null;
  /** Environment used for the last How's Fishing report (for results screen mini cards) */
  lastReportEnv: EnvironmentData | null;
  /** Whether a fetch is in progress */
  isLoading: boolean;
  /** Error message if the last fetch failed */
  error: string | null;
  /** Last coordinates used (for refresh/same-location checks) */
  lastCoords: { lat: number; lon: number } | null;

  /** Set env used for the latest report (call before navigating to results) */
  setLastReportEnv: (env: EnvironmentData | null) => void;
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
  lastReportEnv: null,
  isLoading: false,
  error: null,
  lastCoords: null,

  setLastReportEnv: (env) => set({ lastReportEnv: env }),

  loadEnv: async (latitude, longitude, options = {}) => {
    const { units = 'imperial', forceRefresh = false } = options;
    const requestKey = makeRequestKey(latitude, longitude, units, forceRefresh);

    if (inFlightRequestPromise && inFlightRequestKey === requestKey) {
      return inFlightRequestPromise;
    }

    const requestPromise = (async () => {
    const { lastCoords, envData } = get();

    // Clear stale data when location changed so we don't show wrong location's weather
    const coordsChanged =
      !lastCoords ||
      Math.abs(lastCoords.lat - latitude) > 0.01 ||
      Math.abs(lastCoords.lon - longitude) > 0.01;
    if (coordsChanged) {
      set({ envData: null });
    }

    const myGeneration = ++loadGeneration;

    // Stale-while-revalidate: if we have no data to show, try to show last cached (even expired)
    // so the user sees something immediately when returning to the app instead of long loading.
    if (!forceRefresh && !get().envData) {
      try {
        const { getStaleCachedEnv } = await import('../lib/env');
        const stale = await getStaleCachedEnv(latitude, longitude);
        if (stale && myGeneration === loadGeneration) {
          set({ envData: stale, lastCoords: { lat: latitude, lon: longitude }, error: null });
        }
      } catch {
        // Non-fatal; we'll show loading then fresh or error
      }
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
      // Ignore result if a newer load was started (e.g. user changed tab or location)
      if (myGeneration !== loadGeneration) return;
      set({
        envData: data,
        lastCoords: { lat: latitude, lon: longitude },
        isLoading: false,
        error: null,
      });
    } catch (err) {
      if (myGeneration !== loadGeneration) return;
      const message = err instanceof Error ? err.message : 'Failed to load conditions';
      const existingEnvData = get().envData;
      const shouldKeepSilent =
        Boolean(existingEnvData) &&
        !forceRefresh &&
        !message.includes('Please wait');
      set({
        envData: existingEnvData, // keep any existing (e.g. stale) data so user sees something and can retry
        isLoading: false,
        error: shouldKeepSilent ? null : message,
      });
    }
    })().finally(() => {
      if (inFlightRequestKey === requestKey) {
        inFlightRequestKey = null;
        inFlightRequestPromise = null;
      }
    });

    inFlightRequestKey = requestKey;
    inFlightRequestPromise = requestPromise;

    return requestPromise;
  },

  clear: () => {
    set({ envData: null, lastReportEnv: null, error: null, lastCoords: null });
  },
}));
