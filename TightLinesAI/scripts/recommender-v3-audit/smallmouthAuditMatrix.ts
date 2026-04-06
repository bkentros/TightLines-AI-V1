import type { EngineContext } from "../../supabase/functions/_shared/howFishingEngine/contracts/context.ts";
import type { RegionKey } from "../../supabase/functions/_shared/howFishingEngine/contracts/region.ts";
import type { WaterClarity } from "../../supabase/functions/_shared/recommenderEngine/index.ts";

export type SmallmouthAuditAnchorKey =
  | "great_lakes_clear_lake"
  | "kentucky_highland_lake"
  | "tennessee_river"
  | "pennsylvania_river"
  | "wisconsin_natural_lake"
  | "minnesota_fall_lake"
  | "colorado_river"
  | "washington_river"
  | "ohio_dirty_reservoir"
  | "willamette_river_smb"
  | "northern_california_smb_river"
  | "northeast_connecticut_river"
  | "illinois_river_smb";

export type SmallmouthAuditAnchor = {
  key: SmallmouthAuditAnchorKey;
  label: string;
  latitude: number;
  longitude: number;
  state_code: string;
  timezone: string;
  context: EngineContext;
  region_key: RegionKey;
  default_clarity: WaterClarity;
  audit_role: "core_monthly" | "seasonal_overlay";
  notes: string;
};

export type SmallmouthMatrixScenario = {
  id: string;
  anchor_key: SmallmouthAuditAnchorKey;
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
  matrix_role: "core_monthly" | "seasonal_overlay";
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

export const SMALLMOUTH_AUDIT_ANCHORS: readonly SmallmouthAuditAnchor[] = [
  {
    key: "great_lakes_clear_lake",
    label: "Great Lakes clear natural lake",
    latitude: 45.0727,
    longitude: -84.6748,
    state_code: "MI",
    timezone: "America/Detroit",
    context: "freshwater_lake_pond",
    region_key: "great_lakes_upper_midwest",
    default_clarity: "clear",
    audit_role: "core_monthly",
    notes: "Primary clear-lake SMB benchmark for tube, drop-shot, topwater, jerkbait, and baitfish seasonal transitions.",
  },
  {
    key: "kentucky_highland_lake",
    label: "Kentucky highland lake",
    latitude: 36.9156,
    longitude: -86.3922,
    state_code: "KY",
    timezone: "America/Chicago",
    context: "freshwater_lake_pond",
    region_key: "south_central",
    default_clarity: "stained",
    audit_role: "core_monthly",
    notes: "Wind- and stain-sensitive smallmouth lake benchmark where spinnerbait, swimbait, and jerkbait lanes need to show correctly.",
  },
  {
    key: "tennessee_river",
    label: "Tennessee current river",
    latitude: 35.3973,
    longitude: -84.6705,
    state_code: "TN",
    timezone: "America/New_York",
    context: "freshwater_river",
    region_key: "south_central",
    default_clarity: "stained",
    audit_role: "core_monthly",
    notes: "Core river benchmark for current seams, rock, spinnerbait, inline spinner, and bounded seasonal river behavior.",
  },
  {
    key: "pennsylvania_river",
    label: "Pennsylvania clear river",
    latitude: 41.9912,
    longitude: -77.5542,
    state_code: "PA",
    timezone: "America/New_York",
    context: "freshwater_river",
    region_key: "great_lakes_upper_midwest",
    default_clarity: "clear",
    audit_role: "core_monthly",
    notes: "Clear-river benchmark for northern smallmouth seasonal tightening and baitfish-first behavior within the app's Great Lakes / Upper Midwest region map.",
  },
  {
    key: "wisconsin_natural_lake",
    label: "Wisconsin natural lake",
    latitude: 46.0481,
    longitude: -89.486,
    state_code: "WI",
    timezone: "America/Chicago",
    context: "freshwater_lake_pond",
    region_key: "great_lakes_upper_midwest",
    default_clarity: "clear",
    audit_role: "seasonal_overlay",
    notes: "Clear northern natural-lake overlay for spawn, summer bluebird, and baitfish/topwater tradeoffs.",
  },
  {
    key: "minnesota_fall_lake",
    label: "Minnesota northern lake",
    latitude: 46.7296,
    longitude: -94.6859,
    state_code: "MN",
    timezone: "America/Chicago",
    context: "freshwater_lake_pond",
    region_key: "great_lakes_upper_midwest",
    default_clarity: "stained",
    audit_role: "seasonal_overlay",
    notes: "Northern stained-lake overlay for fall baitfish tightening and winter discipline.",
  },
  {
    key: "colorado_river",
    label: "Colorado western river",
    latitude: 38.4783,
    longitude: -107.8762,
    state_code: "CO",
    timezone: "America/Denver",
    context: "freshwater_river",
    region_key: "mountain_west",
    default_clarity: "clear",
    audit_role: "seasonal_overlay",
    notes: "Western river overlay for postspawn soft-minnow/open-water behavior and cleaner fall-winter posture.",
  },
  {
    key: "washington_river",
    label: "Washington inland river",
    latitude: 46.2396,
    longitude: -119.1006,
    state_code: "WA",
    timezone: "America/Los_Angeles",
    context: "freshwater_river",
    region_key: "inland_northwest",
    default_clarity: "clear",
    audit_role: "seasonal_overlay",
    notes: "Northwest river overlay for early-fall and cool-season baitfish/current reads.",
  },
  {
    key: "ohio_dirty_reservoir",
    label: "Ohio dirty reservoir",
    latitude: 40.367,
    longitude: -82.9962,
    state_code: "OH",
    timezone: "America/New_York",
    context: "freshwater_lake_pond",
    region_key: "midwest_interior",
    default_clarity: "dirty",
    audit_role: "seasonal_overlay",
    notes: "Dirty-water overlay for visible smallmouth lake/reservoir behavior in prespawn, summer stain, and winter control.",
  },
  {
    key: "willamette_river_smb",
    label: "Willamette River smallmouth",
    latitude: 44.94,
    longitude: -123.03,
    state_code: "OR",
    timezone: "America/Los_Angeles",
    context: "freshwater_river",
    region_key: "pacific_northwest",
    default_clarity: "clear",
    audit_role: "seasonal_overlay",
    notes: "Northwest clear-river overlay for spring tube, summer topwater, September NORTHWEST_EARLY_FALL suspending window, and November cool-down tightening.",
  },
  {
    key: "northern_california_smb_river",
    label: "Northern California smallmouth river",
    latitude: 38.78,
    longitude: -123.02,
    state_code: "CA",
    timezone: "America/Los_Angeles",
    context: "freshwater_river",
    region_key: "northern_california",
    default_clarity: "clear",
    audit_role: "seasonal_overlay",
    notes: "NorCal clear-river overlay confirming spring tube, summer topwater, and fall jerkbait western river posture for northern_california SMB.",
  },
  {
    key: "northeast_connecticut_river",
    label: "Connecticut River smallmouth",
    latitude: 42.33,
    longitude: -72.64,
    state_code: "MA",
    timezone: "America/New_York",
    context: "freshwater_river",
    region_key: "northeast",
    default_clarity: "clear",
    audit_role: "seasonal_overlay",
    notes: "Northeast clear-river overlay for the distinct northeast SMB rows: bold-topwater June override, and active-November jerkbait posture vs GLUM's winter-locked tube.",
  },
  {
    key: "illinois_river_smb",
    label: "Illinois River dirty smallmouth",
    latitude: 41.37,
    longitude: -88.84,
    state_code: "IL",
    timezone: "America/Chicago",
    context: "freshwater_river",
    region_key: "great_lakes_upper_midwest",
    default_clarity: "dirty",
    audit_role: "seasonal_overlay",
    notes: "GLUM dirty-river overlay: April spring where spinnerbait/ned_rig displace finesse tube via clarity penalty, July summer where ALL clear-water lures (tube, suspending, squarebill, walking, inline_spinner) are penalized and paddle_tail_swimbait wins as the only dirty-friendly option in GREAT_LAKES_CLEAR_SUMMER_RIVER, and October fall where spinnerbait displaces suspending_jerkbait.",
  },
] as const;

const CORE_MONTHLY_MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

const OVERLAY_MONTHS_BY_ANCHOR: Record<
  Exclude<
    SmallmouthAuditAnchorKey,
    "great_lakes_clear_lake" | "kentucky_highland_lake" | "tennessee_river" | "pennsylvania_river"
  >,
  readonly number[]
> = {
  wisconsin_natural_lake: [5, 6, 8, 10],
  minnesota_fall_lake: [4, 8, 10, 11],
  colorado_river: [3, 6, 9, 12],
  washington_river: [4, 7, 9, 11],
  ohio_dirty_reservoir: [4, 6, 8, 12],
  willamette_river_smb: [4, 6, 9, 11],
  northern_california_smb_river: [3, 6, 8, 10],
  northeast_connecticut_river: [4, 6, 9, 11],
  illinois_river_smb: [4, 7, 10],
};

function focusWindow(month: number): string {
  if (month === 1 || month === 12) return "winter_control";
  if (month === 2 || month === 3) return "prespawn_opening";
  if (month === 4 || month === 5) return "spawn_postspawn_transition";
  if (month >= 6 && month <= 8) return "summer_positioning";
  return "fall_transition";
}

function scenarioId(anchor: SmallmouthAuditAnchor, month: number): string {
  return `smb_matrix_${anchor.key}_${String(month).padStart(2, "0")}`;
}

function scenarioLabel(anchor: SmallmouthAuditAnchor, month: number): string {
  return `${anchor.label}, ${focusWindow(month).replace(/_/g, " ")} month ${month}`;
}

function buildScenario(anchor: SmallmouthAuditAnchor, month: number): SmallmouthMatrixScenario {
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

export const SMALLMOUTH_CORE_MONTHLY_MATRIX: readonly SmallmouthMatrixScenario[] =
  SMALLMOUTH_AUDIT_ANCHORS
    .filter((anchor) => anchor.audit_role === "core_monthly")
    .flatMap((anchor) => CORE_MONTHLY_MONTHS.map((month) => buildScenario(anchor, month)));

export const SMALLMOUTH_OVERLAY_MATRIX: readonly SmallmouthMatrixScenario[] =
  SMALLMOUTH_AUDIT_ANCHORS
    .filter((anchor) => anchor.audit_role === "seasonal_overlay")
    .flatMap((anchor) =>
      OVERLAY_MONTHS_BY_ANCHOR[
        anchor.key as keyof typeof OVERLAY_MONTHS_BY_ANCHOR
      ].map((month) => buildScenario(anchor, month))
    );

export const SMALLMOUTH_FULL_AUDIT_MATRIX: readonly SmallmouthMatrixScenario[] = [
  ...SMALLMOUTH_CORE_MONTHLY_MATRIX,
  ...SMALLMOUTH_OVERLAY_MATRIX,
];
