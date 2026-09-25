import { create } from "zustand";

import type { PierCastMapFilter, PierCastMapMode } from "../lib/pierCastMap";

type PierCastMapView = {
  center: [number, number];
  zoom: number;
};

type PierCastMapStore = {
  selectedState: PierCastMapFilter;
  mode: PierCastMapMode;
  selectedValidAt: string | null;
  view: PierCastMapView;
  setSelectedState: (state: PierCastMapFilter) => void;
  setMode: (mode: PierCastMapMode) => void;
  setSelectedValidAt: (validAt: string | null) => void;
  setView: (view: PierCastMapView) => void;
};

export const usePierCastMapStore = create<PierCastMapStore>((set) => ({
  selectedState: "ALL",
  mode: "score",
  selectedValidAt: null,
  view: { center: [-85.25, 43.65], zoom: 5.25 },
  setSelectedState: (selectedState) => set({ selectedState }),
  setMode: (mode) => set({ mode }),
  setSelectedValidAt: (selectedValidAt) => set({ selectedValidAt }),
  setView: (view) => set({ view }),
}));
