/**
 * Weekly Forecast Store — Zustand
 *
 * Manages 7-day fishing forecast data. Separate from envStore (raw weather)
 * and the analysis bundle (full engine + LLM).
 *
 * Pattern mirrors envStore: generation counter for race-condition safety,
 * in-flight deduplication, stale-while-revalidate via AsyncStorage cache.
 */

import { create } from 'zustand';
import type { WeeklyOverviewBundle } from '../lib/howFishing';
import { getCachedWeeklyForecast, setCachedWeeklyForecast } from '../lib/howFishing';

let forecastGeneration = 0;
let inFlightKey: string | null = null;
let inFlightPromise: Promise<void> | null = null;

function makeKey(lat: number, lon: number): string {
  return `${lat.toFixed(4)}:${lon.toFixed(4)}`;
}

export interface ForecastState {
  forecast: WeeklyOverviewBundle | null;
  isLoading: boolean;
  error: string | null;
  lastFetchedAt: number | null;

  loadForecast: (
    latitude: number,
    longitude: number,
    envData: unknown
  ) => Promise<void>;
  clear: () => void;
}

export const useForecastStore = create<ForecastState>((set, get) => ({
  forecast: null,
  isLoading: false,
  error: null,
  lastFetchedAt: null,

  loadForecast: async (latitude, longitude, envData) => {
    const key = makeKey(latitude, longitude);

    // Deduplicate in-flight
    if (inFlightPromise && inFlightKey === key) {
      return inFlightPromise;
    }

    const promise = (async () => {
      const myGen = ++forecastGeneration;

      // Stale-while-revalidate: show cached data immediately if available
      if (!get().forecast) {
        try {
          const cached = await getCachedWeeklyForecast(latitude, longitude);
          if (cached && myGen === forecastGeneration) {
            set({ forecast: cached, error: null });
          }
        } catch {
          // Non-fatal
        }
      }

      set({ isLoading: true, error: null });

      try {
        const { invokeEdgeFunction, getValidAccessToken } = await import('../lib/supabase');
        const accessToken = await getValidAccessToken();

        const result = await invokeEdgeFunction<WeeklyOverviewBundle>('how-fishing', {
          accessToken,
          body: {
            latitude,
            longitude,
            units: 'imperial',
            mode: 'weekly_overview',
            env_data: envData,
          },
        });

        if (myGen !== forecastGeneration) return;

        set({
          forecast: result,
          isLoading: false,
          error: null,
          lastFetchedAt: Date.now(),
        });

        // Persist to cache
        await setCachedWeeklyForecast(latitude, longitude, result);
      } catch (err) {
        if (myGen !== forecastGeneration) return;
        const message = err instanceof Error ? err.message : 'Failed to load forecast';
        set({
          isLoading: false,
          error: message,
        });
      }
    })().finally(() => {
      if (inFlightKey === key) {
        inFlightKey = null;
        inFlightPromise = null;
      }
    });

    inFlightKey = key;
    inFlightPromise = promise;
    return promise;
  },

  clear: () => {
    set({ forecast: null, error: null, lastFetchedAt: null });
  },
}));
