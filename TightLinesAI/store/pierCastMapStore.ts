import { create } from "zustand";

import type { PierCastMapFilter, PierCastMapMode } from "../lib/pierCastMap";

type PierCastMapView = {
  center: [number, number];
  zoom: number;
};

type PierCastMapStore = {
  selectedState: PierCastMapFilter;
  mode: PierCastMapMode;
  windVisible: boolean;
  selectedValidAt: string | null;
  view: PierCastMapView;
  setSelectedState: (state: PierCastMapFilter) => void;
  setMode: (mode: PierCastMapMode) => void;
  setWindVisible: (visible: boolean) => void;
  setSelectedValidAt: (validAt: string | null) => void;
  setView: (view: PierCastMapView) => void;
};

export const usePierCastMapStore = create<PierCastMapStore>((set) => ({
  selectedState: "ALL",
  mode: "score",
  windVisible: true,
  selectedValidAt: null,
  view: { center: [-83.7, 44.65], zoom: 3.35 },
  setSelectedState: (selectedState) => set({ selectedState }),
  setMode: (mode) => set({ mode }),
  setWindVisible: (windVisible) => set({ windVisible }),
  setSelectedValidAt: (selectedValidAt) => set({ selectedValidAt }),
  setView: (view) => set({ view }),
}));
