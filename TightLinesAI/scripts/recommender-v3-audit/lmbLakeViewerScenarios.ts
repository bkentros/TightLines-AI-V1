/**
 * lmbLakeViewerScenarios.ts
 *
 * 18 LMB lake/pond scenarios across 6 popular US regions.
 * Used by the archive env builder and the viewer runner — no expectations,
 * this is a visual audit tool not a scoring batch.
 *
 * Regions:
 *   Florida                 — subtropical, year-round fishery
 *   Texas                   — south_central, major reservoir culture
 *   Georgia                 — southeast_atlantic, highland reservoirs
 *   Midwest (Illinois)      — midwest_interior, natural lakes + impoundments
 *   Great Lakes (Minnesota) — great_lakes_upper_midwest, clear weedy lakes
 *   Northeast (New York)    — northeast, clear natural lakes
 */

import type { EngineContext } from "../../supabase/functions/_shared/howFishingEngine/contracts/context.ts";
import type { WaterClarity } from "../../supabase/functions/_shared/recommenderEngine/index.ts";

export type LmbLakeViewerScenario = {
  id: string;
  region_label: string;
  state_code: string;
  timezone: string;
  latitude: number;
  longitude: number;
  local_date: string;
  context: EngineContext;
  water_clarity: WaterClarity;
};

// Archive-representative dates aligned with the standard audit calendar.
// All dates are 2025 midpoints for each target month.

export const LMB_LAKE_VIEWER_SCENARIOS: readonly LmbLakeViewerScenario[] = [
  // ─── Florida (florida region) ─────────────────────────────────────────────
  // Lake Okeechobee area — stained natural lakes, classic FL LMB fishery
  {
    id: "lmb_viewer_fl_01",
    region_label: "Florida",
    state_code: "FL",
    timezone: "America/New_York",
    latitude: 26.94,
    longitude: -80.80,
    local_date: "2025-01-16",
    context: "freshwater_lake_pond",
    water_clarity: "stained",
  },
  {
    id: "lmb_viewer_fl_03",
    region_label: "Florida",
    state_code: "FL",
    timezone: "America/New_York",
    latitude: 26.94,
    longitude: -80.80,
    local_date: "2025-03-20",
    context: "freshwater_lake_pond",
    water_clarity: "stained",
  },
  {
    id: "lmb_viewer_fl_07",
    region_label: "Florida",
    state_code: "FL",
    timezone: "America/New_York",
    latitude: 26.94,
    longitude: -80.80,
    local_date: "2025-07-16",
    context: "freshwater_lake_pond",
    water_clarity: "stained",
  },

  // ─── Texas (south_central region) ─────────────────────────────────────────
  // Granbury/Cleburne area — classic TX reservoir, stained/productive water
  {
    id: "lmb_viewer_tx_03",
    region_label: "Texas",
    state_code: "TX",
    timezone: "America/Chicago",
    latitude: 32.35,
    longitude: -97.28,
    local_date: "2025-03-20",
    context: "freshwater_lake_pond",
    water_clarity: "stained",
  },
  {
    id: "lmb_viewer_tx_06",
    region_label: "Texas",
    state_code: "TX",
    timezone: "America/Chicago",
    latitude: 32.35,
    longitude: -97.28,
    local_date: "2025-06-18",
    context: "freshwater_lake_pond",
    water_clarity: "stained",
  },
  {
    id: "lmb_viewer_tx_10",
    region_label: "Texas",
    state_code: "TX",
    timezone: "America/Chicago",
    latitude: 32.35,
    longitude: -97.28,
    local_date: "2025-10-15",
    context: "freshwater_lake_pond",
    water_clarity: "stained",
  },

  // ─── Georgia (southeast_atlantic region) ──────────────────────────────────
  // Lake Sinclair area — highland reservoir, stained productive water
  {
    id: "lmb_viewer_ga_04",
    region_label: "Georgia",
    state_code: "GA",
    timezone: "America/New_York",
    latitude: 33.15,
    longitude: -83.24,
    local_date: "2025-04-16",
    context: "freshwater_lake_pond",
    water_clarity: "stained",
  },
  {
    id: "lmb_viewer_ga_07",
    region_label: "Georgia",
    state_code: "GA",
    timezone: "America/New_York",
    latitude: 33.15,
    longitude: -83.24,
    local_date: "2025-07-16",
    context: "freshwater_lake_pond",
    water_clarity: "stained",
  },
  {
    id: "lmb_viewer_ga_10",
    region_label: "Georgia",
    state_code: "GA",
    timezone: "America/New_York",
    latitude: 33.15,
    longitude: -83.24,
    local_date: "2025-10-15",
    context: "freshwater_lake_pond",
    water_clarity: "stained",
  },

  // ─── Midwest — Illinois (midwest_interior region) ─────────────────────────
  // Central Illinois — natural lake/impoundment, stained
  {
    id: "lmb_viewer_il_04",
    region_label: "Midwest (Illinois)",
    state_code: "IL",
    timezone: "America/Chicago",
    latitude: 40.10,
    longitude: -88.20,
    local_date: "2025-04-16",
    context: "freshwater_lake_pond",
    water_clarity: "stained",
  },
  {
    id: "lmb_viewer_il_07",
    region_label: "Midwest (Illinois)",
    state_code: "IL",
    timezone: "America/Chicago",
    latitude: 40.10,
    longitude: -88.20,
    local_date: "2025-07-16",
    context: "freshwater_lake_pond",
    water_clarity: "stained",
  },
  {
    id: "lmb_viewer_il_10",
    region_label: "Midwest (Illinois)",
    state_code: "IL",
    timezone: "America/Chicago",
    latitude: 40.10,
    longitude: -88.20,
    local_date: "2025-10-15",
    context: "freshwater_lake_pond",
    water_clarity: "stained",
  },

  // ─── Great Lakes — Minnesota (great_lakes_upper_midwest region) ───────────
  // Leech Lake area — classic MN bass lake, stained weed-laden water
  {
    id: "lmb_viewer_mn_05",
    region_label: "Great Lakes (Minnesota)",
    state_code: "MN",
    timezone: "America/Chicago",
    latitude: 47.16,
    longitude: -94.39,
    local_date: "2025-05-15",
    context: "freshwater_lake_pond",
    water_clarity: "stained",
  },
  {
    id: "lmb_viewer_mn_07",
    region_label: "Great Lakes (Minnesota)",
    state_code: "MN",
    timezone: "America/Chicago",
    latitude: 47.16,
    longitude: -94.39,
    local_date: "2025-07-16",
    context: "freshwater_lake_pond",
    water_clarity: "stained",
  },
  {
    id: "lmb_viewer_mn_09",
    region_label: "Great Lakes (Minnesota)",
    state_code: "MN",
    timezone: "America/Chicago",
    latitude: 47.16,
    longitude: -94.39,
    local_date: "2025-09-17",
    context: "freshwater_lake_pond",
    water_clarity: "stained",
  },

  // ─── Northeast — New York (northeast region) ──────────────────────────────
  // Oneida Lake area — clear natural lake, productive NY LMB fishery
  {
    id: "lmb_viewer_ny_05",
    region_label: "Northeast (New York)",
    state_code: "NY",
    timezone: "America/New_York",
    latitude: 43.21,
    longitude: -75.92,
    local_date: "2025-05-15",
    context: "freshwater_lake_pond",
    water_clarity: "clear",
  },
  {
    id: "lmb_viewer_ny_07",
    region_label: "Northeast (New York)",
    state_code: "NY",
    timezone: "America/New_York",
    latitude: 43.21,
    longitude: -75.92,
    local_date: "2025-07-16",
    context: "freshwater_lake_pond",
    water_clarity: "clear",
  },
  {
    id: "lmb_viewer_ny_10",
    region_label: "Northeast (New York)",
    state_code: "NY",
    timezone: "America/New_York",
    latitude: 43.21,
    longitude: -75.92,
    local_date: "2025-10-15",
    context: "freshwater_lake_pond",
    water_clarity: "stained",
  },
];
