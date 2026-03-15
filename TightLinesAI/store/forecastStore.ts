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
import type { WeeklyOverviewBundle, WaterType } from '../lib/howFishing';
import { getCachedWeeklyForecast, setCachedWeeklyForecast } from '../lib/howFishing';

let forecastGeneration = 0;
let inFlightKey: string | null = null;
let currentForecastKey: string | null = null;
let inFlightPromise: Promise<void> | null = null;

function makeKey(lat: number, lon: number, waterType: WaterType | 'auto' = 'auto', freshwaterSubtype: 'lake' | 'river_stream' | 'reservoir' = 'lake'): string {
  return `${lat.toFixed(4)}:${lon.toFixed(4)}:${waterType}:${freshwaterSubtype}`;
}

export interface ForecastState {
  forecast: WeeklyOverviewBundle | null;
  isLoading: boolean;
  error: string | null;
  lastFetchedAt: number | null;

  loadForecast: (
    latitude: number,
    longitude: number,
    envData: unknown,
    options?: {
      waterType?: WaterType | 'auto';
      freshwaterSubtype?: 'lake' | 'river_stream' | 'reservoir';
    }
  ) => Promise<void>;
  clear: () => void;
}

export const useForecastStore = create<ForecastState>((set, get) => ({
  forecast: null,
  isLoading: false,
  error: null,
  lastFetchedAt: null,

  loadForecast: async (latitude, longitude, envData, options) => {
    const waterType = options?.waterType ?? 'auto';
    const freshwaterSubtype = options?.freshwaterSubtype ?? 'lake';
    const key = makeKey(latitude, longitude, waterType, freshwaterSubtype);

    // Deduplicate in-flight
    if (inFlightPromise && inFlightKey === key) {
      return inFlightPromise;
    }

    if (currentForecastKey && currentForecastKey !== key) {
      set({ forecast: null });
    }

    const promise = (async () => {
      const myGen = ++forecastGeneration;

      // Stale-while-revalidate: show cached data immediately if available
      if (!get().forecast) {
        try {
          const cached = await getCachedWeeklyForecast(latitude, longitude, waterType, freshwaterSubtype);
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
            water_type: waterType,
            freshwater_subtype: freshwaterSubtype,
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
        currentForecastKey = key;

        // Persist to cache
        await setCachedWeeklyForecast(latitude, longitude, result, waterType, freshwaterSubtype);
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
    currentForecastKey = null;
    set({ forecast: null, error: null, lastFetchedAt: null });
  },
}));
