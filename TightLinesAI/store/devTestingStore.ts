/**
 * Dev Testing Store — Location overrides for QA
 *
 * Used only in __DEV__ to simulate "no location" and override coordinates
 * for testing coastal / Great Lakes / inland behavior without physically moving.
 * Not exposed to production users.
 *
 * Persisted via AsyncStorage so toggles survive app restarts.
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'dev_testing_store';

export interface OverrideLocation {
  lat: number;
  lon: number;
  label: string;
}

export interface DevTestingState {
  /** When true, Home uses null coords → "Sync location" state */
  ignoreGps: boolean;
  /** When set, Home uses these coords instead of GPS */
  overrideLocation: OverrideLocation | null;
  /** Load persisted state from AsyncStorage */
  load: () => Promise<void>;
  setIgnoreGps: (value: boolean) => Promise<void>;
  setOverrideLocation: (loc: OverrideLocation | null) => Promise<void>;
  /** Clear override and use GPS again */
  clearOverride: () => Promise<void>;
}

async function persist(data: { ignoreGps?: boolean; overrideLocation?: OverrideLocation | null }) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Non-fatal
  }
}

export const useDevTestingStore = create<DevTestingState>((set, get) => ({
  ignoreGps: false,
  overrideLocation: null,

  load: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        set({
          ignoreGps: Boolean(parsed.ignoreGps),
          overrideLocation:
            parsed.overrideLocation &&
            typeof parsed.overrideLocation.lat === 'number' &&
            typeof parsed.overrideLocation.lon === 'number'
              ? {
                  lat: parsed.overrideLocation.lat,
                  lon: parsed.overrideLocation.lon,
                  label: String(parsed.overrideLocation.label ?? 'Custom'),
                }
              : null,
        });
      }
    } catch {
      // Ignore
    }
  },

  setIgnoreGps: async (value) => {
    set({ ignoreGps: value });
    await persist({ ignoreGps: value, overrideLocation: get().overrideLocation });
  },

  setOverrideLocation: async (loc) => {
    set({ overrideLocation: loc });
    await persist({ ignoreGps: get().ignoreGps, overrideLocation: loc });
  },

  clearOverride: async () => {
    set({ overrideLocation: null });
    await persist({ ignoreGps: get().ignoreGps, overrideLocation: null });
  },
}));

/** Preset locations for quick testing (coastal, Great Lakes, inland) */
export const LOCATION_PRESETS: OverrideLocation[] = [
  { lat: 27.9506, lon: -82.4572, label: 'Tampa, FL (coastal)' },
  { lat: 42.3314, lon: -83.0458, label: 'Detroit, MI (Great Lakes)' },
  { lat: 39.0997, lon: -94.5786, label: 'Kansas City, MO (inland)' },
  { lat: 40.7128, lon: -74.006, label: 'New York, NY (coastal)' },
];
