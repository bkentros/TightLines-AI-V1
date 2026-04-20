/**
 * lmbLakeViewerScenarios.ts
 *
 * LMB lake/pond archive audit grid:
 * - **Two archive dates per month** (8th and 22nd) for weather spread — 11 regions × 12 × 2,
 *   minus one slot per region (see below).
 * - **July 8 clarity sweep**: same archive as a single July-8 pull, **three** scenarios per
 *   region (`clear` / `stained` / `dirty`) to isolate clarity effects on rank, daily payload,
 *   and color — **one** network fetch per region for those three (see builder dedupe).
 *
 * Total: 11 × (12 × 2 − 1) + 11 × 3 = **286** scenarios.
 *
 * Used by `buildLmbLakeViewerArchiveEnv.ts` and `runLmbLakeViewer.ts`.
 *
 * `context` is always `freshwater_lake_pond` — river eligibility is separate in
 * `v3/seasonal/largemouth.ts`.
 */

import type { EngineContext } from "../../supabase/functions/_shared/howFishingEngine/contracts/context.ts";
import type { WaterClarity } from "../../supabase/functions/_shared/recommenderEngine/contracts/input.ts";

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

const ARCHIVE_YEAR = 2025;
/** Two snapshots per month for archive weather diversity. */
const ARCHIVE_DAYS_IN_MONTH: readonly [number, number] = [8, 22];

/** Peak-season anchor for the clarity sweep (same `local_date` → shared archive fetch). */
const CLARITY_SWEEP_MONTH = 7;
const CLARITY_SWEEP_DAY = 8;
const CLARITY_SWEEP_LEVELS: readonly WaterClarity[] = [
  "clear",
  "stained",
  "dirty",
];

type RegionAnchor = {
  id_prefix: string;
  region_label: string;
  state_code: string;
  timezone: string;
  latitude: number;
  longitude: number;
  water_clarity: WaterClarity;
  clarity_by_month?: Partial<Record<number, WaterClarity>>;
};

const LMB_LAKE_VIEWER_REGIONS: readonly RegionAnchor[] = [
  {
    id_prefix: "fl",
    region_label: "Florida",
    state_code: "FL",
    timezone: "America/New_York",
    latitude: 26.94,
    longitude: -80.8,
    water_clarity: "stained",
  },
  {
    id_prefix: "tx",
    region_label: "Texas",
    state_code: "TX",
    timezone: "America/Chicago",
    latitude: 32.35,
    longitude: -97.28,
    water_clarity: "stained",
  },
  {
    id_prefix: "ga",
    region_label: "Georgia",
    state_code: "GA",
    timezone: "America/New_York",
    latitude: 33.15,
    longitude: -83.24,
    water_clarity: "stained",
  },
  {
    id_prefix: "il",
    region_label: "Midwest (Illinois)",
    state_code: "IL",
    timezone: "America/Chicago",
    latitude: 40.1,
    longitude: -88.2,
    water_clarity: "stained",
  },
  {
    id_prefix: "mn",
    region_label: "Great Lakes (Minnesota)",
    state_code: "MN",
    timezone: "America/Chicago",
    latitude: 47.16,
    longitude: -94.39,
    water_clarity: "stained",
  },
  {
    id_prefix: "ny",
    region_label: "Northeast (New York)",
    state_code: "NY",
    timezone: "America/New_York",
    latitude: 43.21,
    longitude: -75.92,
    water_clarity: "clear",
    clarity_by_month: {
      4: "stained",
      5: "stained",
      10: "stained",
      11: "stained",
    },
  },
  {
    id_prefix: "la",
    region_label: "Gulf Coast (Louisiana)",
    state_code: "LA",
    timezone: "America/Chicago",
    latitude: 30.22,
    longitude: -92.02,
    water_clarity: "stained",
  },
  {
    id_prefix: "ca",
    region_label: "Southern California",
    state_code: "CA",
    timezone: "America/Los_Angeles",
    latitude: 34.53,
    longitude: -118.61,
    water_clarity: "clear",
    clarity_by_month: { 10: "stained", 11: "stained", 12: "stained" },
  },
  {
    id_prefix: "or",
    region_label: "Pacific Northwest (Oregon)",
    state_code: "OR",
    timezone: "America/Los_Angeles",
    latitude: 44.73,
    longitude: -122.15,
    water_clarity: "stained",
    clarity_by_month: { 7: "clear", 8: "clear", 9: "clear" },
  },
  {
    id_prefix: "co",
    region_label: "Mountain West (Colorado)",
    state_code: "CO",
    timezone: "America/Denver",
    latitude: 39.54,
    longitude: -105.07,
    water_clarity: "clear",
    clarity_by_month: { 10: "stained", 4: "stained", 5: "stained" },
  },
  {
    id_prefix: "oh",
    region_label: "Lake Erie (Ohio)",
    state_code: "OH",
    timezone: "America/New_York",
    latitude: 41.45,
    longitude: -82.71,
    water_clarity: "stained",
    clarity_by_month: { 10: "clear", 11: "clear" },
  },
];

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

/** Same coordinates + calendar day + timezone → one archive pull (clarity is client input). */
export function lmbLakeViewerArchiveDedupeKey(s: LmbLakeViewerScenario): string {
  return [
    s.latitude.toFixed(5),
    s.longitude.toFixed(5),
    s.local_date,
    s.timezone,
  ].join("|");
}

function expandRegionsToScenarios(): LmbLakeViewerScenario[] {
  const out: LmbLakeViewerScenario[] = [];

  for (const r of LMB_LAKE_VIEWER_REGIONS) {
    for (let month = 1; month <= 12; month += 1) {
      const water_clarity = r.clarity_by_month?.[month] ?? r.water_clarity;
      for (const day of ARCHIVE_DAYS_IN_MONTH) {
        if (month === CLARITY_SWEEP_MONTH && day === CLARITY_SWEEP_DAY) {
          continue;
        }
        out.push({
          id: `lmb_viewer_${r.id_prefix}_m${pad2(month)}_d${pad2(day)}`,
          region_label: r.region_label,
          state_code: r.state_code,
          timezone: r.timezone,
          latitude: r.latitude,
          longitude: r.longitude,
          local_date: `${ARCHIVE_YEAR}-${pad2(month)}-${pad2(day)}`,
          context: "freshwater_lake_pond",
          water_clarity,
        });
      }
    }

    const sweepDate =
      `${ARCHIVE_YEAR}-${pad2(CLARITY_SWEEP_MONTH)}-${pad2(CLARITY_SWEEP_DAY)}`;
    for (const c of CLARITY_SWEEP_LEVELS) {
      out.push({
        id:
          `lmb_viewer_${r.id_prefix}_m${pad2(CLARITY_SWEEP_MONTH)}_d${pad2(CLARITY_SWEEP_DAY)}_${c}`,
        region_label: r.region_label,
        state_code: r.state_code,
        timezone: r.timezone,
        latitude: r.latitude,
        longitude: r.longitude,
        local_date: sweepDate,
        context: "freshwater_lake_pond",
        water_clarity: c,
      });
    }
  }

  return out;
}

export const LMB_LAKE_VIEWER_SCENARIOS: readonly LmbLakeViewerScenario[] =
  expandRegionsToScenarios();
