/**
 * Weekly forecast was removed in the engine rebuild.
 * Store kept as a stub so existing imports do not break.
 */

import { create } from 'zustand';

export interface ForecastState {
  forecast: null;
  isLoading: boolean;
  error: string | null;
  lastFetchedAt: number | null;
  loadForecast: (
    _latitude: number,
    _longitude: number,
    _envData: unknown,
    _options?: unknown
  ) => Promise<void>;
  clear: () => void;
}

export const useForecastStore = create<ForecastState>((set) => ({
  forecast: null,
  isLoading: false,
  error: null,
  lastFetchedAt: null,
  loadForecast: async () => {
    set({ forecast: null, isLoading: false, error: null });
  },
  clear: () => set({ forecast: null, error: null, lastFetchedAt: null }),
}));
