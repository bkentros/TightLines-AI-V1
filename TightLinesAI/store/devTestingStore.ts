/**
 * Dev Testing Store — QA/admin device toggles
 *
 * Persisted via AsyncStorage. Location overrides were removed — use the home
 * screen location picker instead.
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'dev_testing_store';

export interface DevTestingState {
  /** When true, Home uses null coords → "Sync location" state */
  ignoreGps: boolean;
  load: () => Promise<void>;
  setIgnoreGps: (value: boolean) => Promise<void>;
}

async function persist(data: {
  ignoreGps?: boolean;
}) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Non-fatal
  }
}

export const useDevTestingStore = create<DevTestingState>((set) => ({
  ignoreGps: false,

  load: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        set({
          ignoreGps: Boolean(parsed.ignoreGps),
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
    });
  },
}));
