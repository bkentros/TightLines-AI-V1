/**
 * locationStore — User-defined custom fishing location
 *
 * Allows users to pin any US city as their active fishing location instead
 * of relying on GPS. Used for trip planning ("I'm driving to Steinhatchee
 * tomorrow — show me that report now").
 *
 * Priority (in index.tsx):
 *   1. DEV overrideLocation (dev-only)
 *   2. savedLocation (when useCustom = true)
 *   3. GPS coords (default)
 *
 * Persisted to AsyncStorage so the selection survives app restarts.
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'tightlines_location_pref_v1';

export interface SavedLocation {
  lat: number;
  lon: number;
  label: string; // "City, ST" — e.g. "Steinhatchee, FL"
}

interface LocationState {
  savedLocation: SavedLocation | null;
  useCustom: boolean;
  // Actions
  setSavedLocation: (loc: SavedLocation) => Promise<void>;
  clearSavedLocation: () => Promise<void>;
  setUseCustom: (val: boolean) => Promise<void>;
  load: () => Promise<void>;
}

async function persist(data: { savedLocation: SavedLocation | null; useCustom: boolean }) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Non-fatal
  }
}

export const useLocationStore = create<LocationState>((set, get) => ({
  savedLocation: null,
  useCustom: false,

  load: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const p = JSON.parse(raw);
      if (
        p &&
        typeof p.savedLocation?.lat === 'number' &&
        typeof p.savedLocation?.lon === 'number'
      ) {
        set({
          savedLocation: {
            lat: p.savedLocation.lat,
            lon: p.savedLocation.lon,
            label: String(p.savedLocation.label ?? 'Custom location'),
          },
          useCustom: Boolean(p.useCustom),
        });
      }
    } catch {
      // Ignore
    }
  },

  setSavedLocation: async (loc) => {
    set({ savedLocation: loc, useCustom: true });
    await persist({ savedLocation: loc, useCustom: true });
  },

  clearSavedLocation: async () => {
    set({ savedLocation: null, useCustom: false });
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch {}
  },

  setUseCustom: async (val) => {
    set({ useCustom: val });
    const { savedLocation } = get();
    await persist({ savedLocation, useCustom: val });
  },
}));
