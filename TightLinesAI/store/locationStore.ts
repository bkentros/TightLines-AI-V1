/**
 * locationStore — User-selected fishing read location
 *
 * Allows users to choose any US city as their active fishing location instead
 * of relying on GPS. Used for trip planning ("I'm driving to Steinhatchee
 * tomorrow — show me that report now").
 *
 * Priority (in index.tsx):
 *   1. DEV ignoreGps (dev-only — no coords until user syncs)
 *   2. savedLocation (when useCustom = true)
 *   3. GPS coords (default)
 *
 * Persisted to AsyncStorage so the selection survives app restarts.
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'tightlines_location_pref_v1';

function isPlausibleUsSavedLocation(loc: { lat: number; lon: number; label: string } | null | undefined): loc is SavedLocation {
  return Boolean(
    loc &&
    Number.isFinite(loc.lat) &&
    Number.isFinite(loc.lon) &&
    typeof loc.label === 'string' &&
    loc.lon < 0 &&
    loc.lat >= 15 &&
    loc.lat <= 72,
  );
}

export interface SavedLocation {
  lat: number;
  lon: number;
  label: string; // "City, ST" — e.g. "Steinhatchee, FL"
}

interface LocationState {
  savedLocation: SavedLocation | null;
  useCustom: boolean;
  /** Profile id whose onboarding home water has already seeded Home once. */
  profileHomeSeededFor: string | null;
  // Actions
  setSavedLocation: (loc: SavedLocation) => Promise<void>;
  seedFromProfileHome: (profileId: string, loc: SavedLocation) => Promise<void>;
  clearSavedLocation: () => Promise<void>;
  setUseCustom: (val: boolean) => Promise<void>;
  load: () => Promise<void>;
}

async function persist(data: {
  savedLocation: SavedLocation | null;
  useCustom: boolean;
  profileHomeSeededFor: string | null;
}) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Non-fatal
  }
}

export const useLocationStore = create<LocationState>((set, get) => ({
  savedLocation: null,
  useCustom: false,
  profileHomeSeededFor: null,

  load: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const p = JSON.parse(raw);
      if (p && isPlausibleUsSavedLocation(p.savedLocation)) {
        set({
          savedLocation: {
            lat: p.savedLocation.lat,
            lon: p.savedLocation.lon,
            label: String(p.savedLocation.label ?? 'Custom location'),
          },
          useCustom: Boolean(p.useCustom),
          profileHomeSeededFor:
            typeof p.profileHomeSeededFor === 'string'
              ? p.profileHomeSeededFor
              : null,
        });
      } else if (p?.savedLocation != null) {
        await AsyncStorage.removeItem(STORAGE_KEY);
        set({ savedLocation: null, useCustom: false, profileHomeSeededFor: null });
      } else if (p) {
        set({
          savedLocation: null,
          useCustom: Boolean(p.useCustom),
          profileHomeSeededFor:
            typeof p.profileHomeSeededFor === 'string'
              ? p.profileHomeSeededFor
              : null,
        });
      }
    } catch {
      // Ignore
    }
  },

  setSavedLocation: async (loc) => {
    set({ savedLocation: loc, useCustom: true });
    const { profileHomeSeededFor } = get();
    await persist({ savedLocation: loc, useCustom: true, profileHomeSeededFor });
  },

  seedFromProfileHome: async (profileId, loc) => {
    set({ savedLocation: loc, useCustom: true, profileHomeSeededFor: profileId });
    await persist({
      savedLocation: loc,
      useCustom: true,
      profileHomeSeededFor: profileId,
    });
  },

  clearSavedLocation: async () => {
    set({ savedLocation: null, useCustom: false });
    const { profileHomeSeededFor } = get();
    await persist({ savedLocation: null, useCustom: false, profileHomeSeededFor });
  },

  setUseCustom: async (val) => {
    set({ useCustom: val });
    const { savedLocation, profileHomeSeededFor } = get();
    await persist({ savedLocation, useCustom: val, profileHomeSeededFor });
  },
}));
