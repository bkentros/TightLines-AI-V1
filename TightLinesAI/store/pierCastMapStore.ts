import { create } from "zustand";

import type { PierCastMapFilter, PierCastMapMode } from "../lib/pierCastMap";
import type { PierCastMapTimeModeV4 } from "../lib/pierCastConditionsV4";

type PierCastMapView = {
  center: [number, number];
  zoom: number;
};

type PierCastMapStore = {
  selectedState: PierCastMapFilter;
  mode: PierCastMapMode;
  timeMode: PierCastMapTimeModeV4;
  windVisible: boolean;
  observationsVisible: boolean;
  selectedValidAt: string | null;
  view: PierCastMapView;
  setSelectedState: (state: PierCastMapFilter) => void;
  setMode: (mode: PierCastMapMode) => void;
  setTimeMode: (mode: PierCastMapTimeModeV4) => void;
  setWindVisible: (visible: boolean) => void;
  setObservationsVisible: (visible: boolean) => void;
  setSelectedValidAt: (validAt: string | null) => void;
  setView: (view: PierCastMapView) => void;
};

export const usePierCastMapStore = create<PierCastMapStore>((set) => ({
  selectedState: "ALL",
  mode: "temperature",
  timeMode: "now",
  windVisible: true,
  observationsVisible: false,
  selectedValidAt: null,
  view: { center: [-83.7, 44.65], zoom: 3.35 },
  setSelectedState: (selectedState) => set({ selectedState }),
  setMode: (mode) => set({ mode }),
  setTimeMode: (timeMode) => set({ timeMode }),
  setWindVisible: (windVisible) => set({ windVisible }),
  setObservationsVisible: (observationsVisible) => set({ observationsVisible }),
  setSelectedValidAt: (selectedValidAt) => set({ selectedValidAt }),
  setView: (view) => set({ view }),
}));
