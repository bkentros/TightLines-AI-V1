/**
 * Weekly Forecast Store — Zustand
 *
 * Manages 7-day fishing forecast data. Separate from envStore (raw weather)
 * and the analysis bundle (full engine + LLM).
 *
 * V2 change: cache key now uses environmentMode (EnvironmentModeV2) as the
 * primary discriminator instead of waterType | 'auto'. This aligns with the
 * single-confirmed-context architecture.
 *
 * Backwards compatibility: the legacy waterType/freshwaterSubtype overload is
 * retained during the transition period when the frozen V1 backend still sends
 * weekly forecast data keyed by waterType. It will be removed in Phase 14.
 */

import { create } from 'zustand';
import type { WeeklyOverviewBundle } from '../lib/howFishing';
import { getCachedWeeklyForecast, setCachedWeeklyForecast } from '../lib/howFishing';
import type { EnvironmentModeV2 } from '../lib/howFishingV2';

// ---------------------------------------------------------------------------
// Internal deduplication
// ---------------------------------------------------------------------------

let forecastGeneration = 0;
let inFlightKey: string | null = null;
let currentForecastKey: string | null = null;
let inFlightPromise: Promise<void> | null = null;

/**
 * Build the cache/dedup key.
 * V2: keyed by environmentMode.
 * V1 fallback: keyed by waterType + freshwaterSubtype (legacy; used only when
 * environmentMode is not supplied).
 */
function makeKey(
  lat: number,
  lon: number,
  environmentMode: EnvironmentModeV2 | null,
  legacyWaterType?: string,
  legacyFreshwaterSubtype?: string
): string {
  if (environmentMode) {
    return `${lat.toFixed(4)}:${lon.toFixed(4)}:${environmentMode}`;
  }
  // Legacy fallback key shape
  return `${lat.toFixed(4)}:${lon.toFixed(4)}:${legacyWaterType ?? 'auto'}:${legacyFreshwaterSubtype ?? 'lake'}`;
}

/**
 * Map environmentMode → legacy waterType string expected by the V1 backend.
 * Used to call the frozen V1 how-fishing edge function with compatible params
 * until Phase 3 replaces the backend.
 */
function environmentModeToLegacyWaterType(
  mode: EnvironmentModeV2
): 'freshwater' | 'saltwater' | 'brackish' {
  switch (mode) {
    case 'freshwater_lake':
    case 'freshwater_river':
      return 'freshwater';
    case 'saltwater':
      return 'saltwater';
    case 'brackish':
      return 'brackish';
  }
}

/**
 * Map environmentMode → legacy freshwaterSubtype for the V1 backend.
 */
function environmentModeToLegacyFreshwaterSubtype(
  mode: EnvironmentModeV2
): 'lake' | 'river_stream' | 'reservoir' {
  return mode === 'freshwater_river' ? 'river_stream' : 'lake';
}

// ---------------------------------------------------------------------------
// Store shape
// ---------------------------------------------------------------------------

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
      /** V2 preferred: single confirmed environment mode */
      environmentMode?: EnvironmentModeV2;
      /** V1 legacy fallback — ignored when environmentMode is provided */
      waterType?: 'freshwater' | 'saltwater' | 'brackish' | 'auto';
      /** V1 legacy fallback — ignored when environmentMode is provided */
      freshwaterSubtype?: 'lake' | 'river_stream' | 'reservoir';
    }
  ) => Promise<void>;
  clear: () => void;
}

// ---------------------------------------------------------------------------
// Store implementation
// ---------------------------------------------------------------------------

export const useForecastStore = create<ForecastState>((set, get) => ({
  forecast: null,
  isLoading: false,
  error: null,
  lastFetchedAt: null,

  loadForecast: async (latitude, longitude, envData, options) => {
    const environmentMode = options?.environmentMode ?? null;

    // Resolve legacy params for V1 backend compatibility
    const legacyWaterType = environmentMode
      ? environmentModeToLegacyWaterType(environmentMode)
      : (options?.waterType ?? 'auto');

    const legacyFreshwaterSubtype = environmentMode
      ? environmentModeToLegacyFreshwaterSubtype(environmentMode)
      : (options?.freshwaterSubtype ?? 'lake');

    const key = makeKey(latitude, longitude, environmentMode, legacyWaterType, legacyFreshwaterSubtype);

    // Deduplicate in-flight requests for the same key
    if (inFlightPromise && inFlightKey === key) {
      return inFlightPromise;
    }

    // Clear stale forecast when context changes
    if (currentForecastKey && currentForecastKey !== key) {
      set({ forecast: null });
    }

    const promise = (async () => {
      const myGen = ++forecastGeneration;

      // Stale-while-revalidate: show cached data immediately if available
      if (!get().forecast) {
        try {
          // Use legacy cache key for the V1 AsyncStorage entries
          const cached = await getCachedWeeklyForecast(
            latitude,
            longitude,
            legacyWaterType as 'freshwater' | 'saltwater' | 'brackish' | 'auto',
            legacyFreshwaterSubtype
          );
          if (cached && myGen === forecastGeneration) {
            set({ forecast: cached, error: null });
          }
        } catch {
          // Non-fatal — cache miss is fine
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
            // V1 backend legacy fields
            water_type: legacyWaterType,
            freshwater_subtype: legacyFreshwaterSubtype,
            // V2 context field — ignored by V1 backend, used by V2 when available
            ...(environmentMode ? { environment_mode: environmentMode } : {}),
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

        // Persist to the existing V1-keyed cache
        await setCachedWeeklyForecast(
          latitude,
          longitude,
          result,
          legacyWaterType as 'freshwater' | 'saltwater' | 'brackish' | 'auto',
          legacyFreshwaterSubtype
        );
      } catch (err) {
        if (myGen !== forecastGeneration) return;
        const message = err instanceof Error ? err.message : 'Failed to load forecast';
        set({ isLoading: false, error: message });
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
