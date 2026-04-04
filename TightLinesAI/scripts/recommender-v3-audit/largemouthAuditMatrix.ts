import type { EngineContext } from "../../supabase/functions/_shared/howFishingEngine/contracts/context.ts";
import type { RegionKey } from "../../supabase/functions/_shared/howFishingEngine/contracts/region.ts";
import type { WaterClarity } from "../../supabase/functions/_shared/recommenderEngine/index.ts";

export type LargemouthAuditAnchorKey =
  | "florida_lake"
  | "texas_reservoir"
  | "alabama_river"
  | "new_york_natural_lake"
  | "georgia_highland"
  | "louisiana_grass_lake"
  | "ozarks_reservoir"
  | "minnesota_weed_lake"
  | "california_delta";

export type LargemouthAuditAnchor = {
  key: LargemouthAuditAnchorKey;
  label: string;
  latitude: number;
  longitude: number;
  state_code: string;
  timezone: string;
  context: EngineContext;
  region_key: RegionKey;
  default_clarity: WaterClarity;
  audit_role:
    | "core_monthly"
    | "seasonal_overlay";
  notes: string;
};

export type LargemouthMatrixScenario = {
  id: string;
  anchor_key: LargemouthAuditAnchorKey;
  label: string;
  month: number;
  local_date: string;
  state_code: string;
  timezone: string;
  latitude: number;
  longitude: number;
  context: EngineContext;
  region_key: RegionKey;
  default_clarity: WaterClarity;
  matrix_role:
    | "core_monthly"
    | "seasonal_overlay";
  focus_window: string;
};

const MONTH_TO_ARCHIVE_DATE_2025: Record<number, string> = {
  1: "2025-01-16",
  2: "2025-02-19",
  3: "2025-03-20",
  4: "2025-04-16",
  5: "2025-05-15",
  6: "2025-06-18",
  7: "2025-07-16",
  8: "2025-08-14",
  9: "2025-09-17",
  10: "2025-10-15",
  11: "2025-11-12",
  12: "2025-12-10",
};

export const LARGEMOUTH_AUDIT_ANCHORS: readonly LargemouthAuditAnchor[] = [
  {
    key: "florida_lake",
    label: "Florida shallow natural lake",
    latitude: 26.94,
    longitude: -80.8,
    state_code: "FL",
    timezone: "America/New_York",
    context: "freshwater_lake_pond",
    region_key: "florida",
    default_clarity: "stained",
    audit_role: "core_monthly",
    notes: "Tropical largemouth benchmark for winter control, early prespawn openings, and long warm-season grass behavior.",
  },
  {
    key: "texas_reservoir",
    label: "Texas reservoir",
    latitude: 31.101,
    longitude: -95.566,
    state_code: "TX",
    timezone: "America/Chicago",
    context: "freshwater_lake_pond",
    region_key: "south_central",
    default_clarity: "stained",
    audit_role: "core_monthly",
    notes: "South-central reservoir benchmark for windy baitfish windows, winter tightening, and fall shad behavior.",
  },
  {
    key: "alabama_river",
    label: "Alabama river current system",
    latitude: 34.8,
    longitude: -87.67,
    state_code: "AL",
    timezone: "America/Chicago",
    context: "freshwater_river",
    region_key: "south_central",
    default_clarity: "stained",
    audit_role: "core_monthly",
    notes: "River largemouth benchmark for current seams, dirty-water cover lanes, and bounded warm-season river behavior.",
  },
  {
    key: "new_york_natural_lake",
    label: "New York natural lake",
    latitude: 42.642,
    longitude: -76.718,
    state_code: "NY",
    timezone: "America/New_York",
    context: "freshwater_lake_pond",
    region_key: "northeast",
    default_clarity: "clear",
    audit_role: "core_monthly",
    notes: "Northern clear-lake benchmark for finesse, cooler seasonal posture, and restrained surface behavior.",
  },
  {
    key: "georgia_highland",
    label: "Georgia highland reservoir",
    latitude: 34.579,
    longitude: -83.543,
    state_code: "GA",
    timezone: "America/New_York",
    context: "freshwater_lake_pond",
    region_key: "south_central",
    default_clarity: "clear",
    audit_role: "seasonal_overlay",
    notes: "Clear highland-reservoir overlay for spring baitfish reads and cleaner color behavior.",
  },
  {
    key: "louisiana_grass_lake",
    label: "Louisiana grass lake",
    latitude: 30.208,
    longitude: -92.329,
    state_code: "LA",
    timezone: "America/Chicago",
    context: "freshwater_lake_pond",
    region_key: "gulf_coast",
    default_clarity: "stained",
    audit_role: "seasonal_overlay",
    notes: "Southern grass overlay for early-fall topwater, frog, swim-jig, and spinnerbait lanes.",
  },
  {
    key: "ozarks_reservoir",
    label: "Ozarks reservoir",
    latitude: 36.525,
    longitude: -93.214,
    state_code: "MO",
    timezone: "America/Chicago",
    context: "freshwater_lake_pond",
    region_key: "midwest_interior",
    default_clarity: "clear",
    audit_role: "seasonal_overlay",
    notes: "Shad-transition and inland-reservoir overlay for fall and cold-season crankbait / jerkbait behavior.",
  },
  {
    key: "minnesota_weed_lake",
    label: "Minnesota weed lake",
    latitude: 46.7296,
    longitude: -94.6859,
    state_code: "MN",
    timezone: "America/Chicago",
    context: "freshwater_lake_pond",
    region_key: "great_lakes_upper_midwest",
    default_clarity: "clear",
    audit_role: "seasonal_overlay",
    notes: "Northern weedline overlay for midsummer edge behavior and bluebird adjustments.",
  },
  {
    key: "california_delta",
    label: "California Delta freshwater reach",
    latitude: 38.035,
    longitude: -121.636,
    state_code: "CA",
    timezone: "America/Los_Angeles",
    context: "freshwater_river",
    region_key: "northern_california",
    default_clarity: "stained",
    audit_role: "seasonal_overlay",
    notes: "Western tidal-fresh overlay for grass/current behavior and late-fall stained-water largemouth lanes.",
  },
] as const;

const CORE_MONTHLY_MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

const OVERLAY_MONTHS_BY_ANCHOR: Record<
  Exclude<LargemouthAuditAnchorKey, "florida_lake" | "texas_reservoir" | "alabama_river" | "new_york_natural_lake">,
  readonly number[]
> = {
  georgia_highland: [2, 4, 6, 10],
  louisiana_grass_lake: [3, 6, 9, 11],
  ozarks_reservoir: [2, 5, 10, 12],
  minnesota_weed_lake: [5, 7, 8, 10],
  california_delta: [3, 6, 9, 11],
};

function focusWindow(month: number): string {
  if (month === 1 || month === 12) return "winter_control";
  if (month === 2 || month === 3) return "prespawn_opening";
  if (month === 4 || month === 5) return "spawn_postspawn_transition";
  if (month >= 6 && month <= 8) return "summer_positioning";
  return "fall_transition";
}

function scenarioId(anchor: LargemouthAuditAnchor, month: number): string {
  return `lmb_matrix_${anchor.key}_${String(month).padStart(2, "0")}`;
}

function scenarioLabel(anchor: LargemouthAuditAnchor, month: number): string {
  return `${anchor.label}, ${focusWindow(month).replace(/_/g, " ")} month ${month}`;
}

function buildScenario(anchor: LargemouthAuditAnchor, month: number): LargemouthMatrixScenario {
  return {
    id: scenarioId(anchor, month),
    anchor_key: anchor.key,
    label: scenarioLabel(anchor, month),
    month,
    local_date: MONTH_TO_ARCHIVE_DATE_2025[month],
    state_code: anchor.state_code,
    timezone: anchor.timezone,
    latitude: anchor.latitude,
    longitude: anchor.longitude,
    context: anchor.context,
    region_key: anchor.region_key,
    default_clarity: anchor.default_clarity,
    matrix_role: anchor.audit_role,
    focus_window: focusWindow(month),
  };
}

export const LARGEMOUTH_CORE_MONTHLY_MATRIX: readonly LargemouthMatrixScenario[] =
  LARGEMOUTH_AUDIT_ANCHORS
    .filter((anchor) => anchor.audit_role === "core_monthly")
    .flatMap((anchor) => CORE_MONTHLY_MONTHS.map((month) => buildScenario(anchor, month)));

export const LARGEMOUTH_OVERLAY_MATRIX: readonly LargemouthMatrixScenario[] =
  LARGEMOUTH_AUDIT_ANCHORS
    .filter((anchor) => anchor.audit_role === "seasonal_overlay")
    .flatMap((anchor) =>
      OVERLAY_MONTHS_BY_ANCHOR[
        anchor.key as keyof typeof OVERLAY_MONTHS_BY_ANCHOR
      ].map((month) => buildScenario(anchor, month))
    );

export const LARGEMOUTH_FULL_AUDIT_MATRIX: readonly LargemouthMatrixScenario[] = [
  ...LARGEMOUTH_CORE_MONTHLY_MATRIX,
  ...LARGEMOUTH_OVERLAY_MATRIX,
];

