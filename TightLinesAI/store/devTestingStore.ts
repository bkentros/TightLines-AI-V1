/**
 * Dev Testing Store — QA toggles (dev builds only in UI)
 *
 * Persisted via AsyncStorage. Location overrides were removed — use the home
 * screen location picker instead.
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'dev_testing_store';

export type DevSubscriptionTier = 'free' | 'angler' | 'master_angler';

export interface DevTestingState {
  /** When true, Home uses null coords → "Sync location" state */
  ignoreGps: boolean;
  /** When set (__DEV__ only in Settings UI), overrides profile subscription_tier for feature gating */
  overrideSubscriptionTier: DevSubscriptionTier | null;
  load: () => Promise<void>;
  setIgnoreGps: (value: boolean) => Promise<void>;
  setOverrideSubscriptionTier: (tier: DevSubscriptionTier | null) => Promise<void>;
}

async function persist(data: {
  ignoreGps?: boolean;
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
      overrideSubscriptionTier: get().overrideSubscriptionTier,
    });
  },

  setOverrideSubscriptionTier: async (tier) => {
    set({ overrideSubscriptionTier: tier });
    await persist({
      ignoreGps: get().ignoreGps,
      overrideSubscriptionTier: tier,
    });
  },
}));
