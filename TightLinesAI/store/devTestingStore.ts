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
  /** Admin: simulate Home at this logical width (pt); null = full device width */
  homeLayoutPreviewWidth: number | null;
  load: () => Promise<void>;
  setIgnoreGps: (value: boolean) => Promise<void>;
  setHomeLayoutPreviewWidth: (value: number | null) => Promise<void>;
}

async function persist(data: {
  ignoreGps?: boolean;
  homeLayoutPreviewWidth?: number | null;
}) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Non-fatal
  }
}

export const useDevTestingStore = create<DevTestingState>((set, get) => ({
  ignoreGps: false,
  homeLayoutPreviewWidth: null,

  load: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        const previewWidth = parsed.homeLayoutPreviewWidth;
        set({
          ignoreGps: Boolean(parsed.ignoreGps),
          homeLayoutPreviewWidth: typeof previewWidth === 'number' &&
              Number.isFinite(previewWidth)
            ? previewWidth
            : null,
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
      homeLayoutPreviewWidth: get().homeLayoutPreviewWidth,
    });
  },

  setHomeLayoutPreviewWidth: async (value) => {
    set({ homeLayoutPreviewWidth: value });
    await persist({
      ignoreGps: get().ignoreGps,
      homeLayoutPreviewWidth: value,
    });
  },
}));
