/**
 * Dev Testing Store — Location overrides for QA
 *
 * Used only in __DEV__ to simulate "no location" and override coordinates
 * for testing coastal / inland behavior without physically moving.
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

export type DevSubscriptionTier = 'free' | 'angler' | 'master_angler';

export interface DevTestingState {
  /** When true, Home uses null coords → "Sync location" state */
  ignoreGps: boolean;
  /** When set, Home uses these coords instead of GPS */
  overrideLocation: OverrideLocation | null;
  /** When set (__DEV__ only), overrides profile subscription_tier for feature gating */
  overrideSubscriptionTier: DevSubscriptionTier | null;
  /** Load persisted state from AsyncStorage */
  load: () => Promise<void>;
  setIgnoreGps: (value: boolean) => Promise<void>;
  setOverrideLocation: (loc: OverrideLocation | null) => Promise<void>;
  setOverrideSubscriptionTier: (tier: DevSubscriptionTier | null) => Promise<void>;
  /** Clear override and use GPS again */
  clearOverride: () => Promise<void>;
}

async function persist(data: {
  ignoreGps?: boolean;
  overrideLocation?: OverrideLocation | null;
  overrideSubscriptionTier?: DevSubscriptionTier | null;
}) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Non-fatal
  }
}

export const useDevTestingStore = create<DevTestingState>((set, get) => ({
  ignoreGps: false,
  overrideLocation: null,
  overrideSubscriptionTier: null,

  load: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        const tier = parsed.overrideSubscriptionTier;
        const validTier =
          tier === 'free' || tier === 'angler' || tier === 'master_angler' ? tier : null;
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
          overrideSubscriptionTier: validTier,
        });
      }
    } catch {
      // Ignore
    }
  },

  setIgnoreGps: async (value) => {
    set({ ignoreGps: value });
    await persist({
      ignoreGps: value,
      overrideLocation: get().overrideLocation,
      overrideSubscriptionTier: get().overrideSubscriptionTier,
    });
  },

  setOverrideSubscriptionTier: async (tier) => {
    set({ overrideSubscriptionTier: tier });
    await persist({
      ignoreGps: get().ignoreGps,
      overrideLocation: get().overrideLocation,
      overrideSubscriptionTier: tier,
    });
  },

  setOverrideLocation: async (loc) => {
    set({ overrideLocation: loc });
    await persist({
      ignoreGps: get().ignoreGps,
      overrideLocation: loc,
      overrideSubscriptionTier: get().overrideSubscriptionTier,
    });
  },

  clearOverride: async () => {
    set({ overrideLocation: null });
    await persist({
      ignoreGps: get().ignoreGps,
      overrideLocation: null,
      overrideSubscriptionTier: get().overrideSubscriptionTier,
    });
  },
}));

/** Preset locations for quick testing (coastal, inland, and edge-case routing) */
export const LOCATION_PRESETS: OverrideLocation[] = [
  { lat: 27.9506, lon: -82.4572, label: 'Tampa, FL (coastal)' },
  { lat: 29.7244, lon: -93.8708, label: 'Sabine Pass, TX (coastal, small town)' },
  { lat: 29.5636, lon: -91.5251, label: 'Cypremort Point, LA (coastal, small town)' },
  { lat: 29.3808, lon: -94.9027, label: 'San Leon, TX (coastal, small town)' },
  { lat: 29.8186, lon: -81.2731, label: 'St. Augustine, FL (coastal)' },
  { lat: 29.9822, lon: -81.4684, label: 'Palatka, FL (coastal-adjacent inland river)' },
  { lat: 29.7141, lon: -85.0246, label: 'Apalachicola, FL (coastal, small town)' },
  { lat: 29.1352, lon: -83.0310, label: 'Steinhatchee, FL (coastal, small town)' },
  { lat: 29.1461, lon: -80.9710, label: 'New Smyrna Beach, FL (coastal)' },
  { lat: 34.7215, lon: -76.7260, label: 'Beaufort, NC (coastal, small town)' },
  { lat: 35.5402, lon: -75.4668, label: 'Manteo, NC (Outer Banks coastal)' },
  { lat: 31.3791, lon: -81.4181, label: 'Brunswick, GA (coastal)' },
  { lat: 32.0341, lon: -80.9029, label: 'Tybee Island, GA (coastal)' },
  { lat: 37.8664, lon: -122.3130, label: 'Point Richmond, CA (coastal bay)' },
  { lat: 35.3658, lon: -120.8499, label: 'Morro Bay, CA (coastal, small town)' },
  { lat: 48.7491, lon: -122.4782, label: 'Bellingham, WA (coastal)' },
  { lat: 41.0359, lon: -71.9545, label: 'Montauk, NY (coastal)' },
  { lat: 39.0997, lon: -94.5786, label: 'Kansas City, MO (inland)' },
  { lat: 38.9717, lon: -95.2353, label: 'Lawrence, KS (inland, small city)' },
  { lat: 36.1320, lon: -95.9400, label: 'Tulsa, OK (inland)' },
  { lat: 35.1231, lon: -98.7426, label: 'Hobart, OK (inland, small town)' },
  { lat: 43.3033, lon: -91.7857, label: 'Decorah, IA (inland, driftless)' },
  { lat: 45.6797, lon: -111.0386, label: 'Bozeman, MT (inland)' },
  { lat: 42.5629, lon: -114.4609, label: 'Twin Falls, ID (inland)' },
  { lat: 34.5400, lon: -112.4685, label: 'Random Inland Probe A (AZ)' },
  { lat: 33.2720, lon: -87.5650, label: 'Random Inland Probe B (AL)' },
  { lat: 40.7128, lon: -74.006, label: 'New York, NY (coastal)' },
  { lat: 27.7035, lon: -82.1918, label: 'Edge Probe Inside 50mi A (central FL, approximate)' },
  { lat: 28.2194, lon: -81.6428, label: 'Edge Probe Outside 50mi A (central FL, approximate)' },
  { lat: 29.7866, lon: -95.2193, label: 'Edge Probe Inside 50mi B (upper TX coast, approximate)' },
  { lat: 30.1916, lon: -95.5890, label: 'Edge Probe Outside 50mi B (upper TX coast, approximate)' },
  { lat: 32.7226, lon: -80.8437, label: 'Edge Probe Inside 50mi C (SC lowcountry, approximate)' },
  { lat: 33.1468, lon: -81.6832, label: 'Edge Probe Outside 50mi C (SC/GA inland, approximate)' },
  { lat: 29.2486, lon: -90.2118, label: 'Random Marsh Probe (LA coastal)' },
  { lat: 44.9232, lon: -85.1166, label: 'Random Bay Probe (northern MI inland/coastal test)' },
];
