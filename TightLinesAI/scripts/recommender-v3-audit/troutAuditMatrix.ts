import type { EngineContext } from "../../supabase/functions/_shared/howFishingEngine/contracts/context.ts";
import type { RegionKey } from "../../supabase/functions/_shared/howFishingEngine/contracts/region.ts";
import type { WaterClarity } from "../../supabase/functions/_shared/recommenderEngine/contracts/input.ts";

export type TroutAuditAnchorKey =
  | "appalachian_tailwater"
  | "northeast_freestone"
  | "mountain_west_river"
  | "pacific_northwest_river"
  | "northern_california_fall"
  | "great_lakes_highwater"
  | "alaska_big_river"
  | "idaho_runoff_edge"
  | "south_central_tailwater";

export type TroutAuditAnchor = {
  key: TroutAuditAnchorKey;
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

export type TroutMatrixScenario = {
  id: string;
  anchor_key: TroutAuditAnchorKey;
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

export const TROUT_AUDIT_ANCHORS: readonly TroutAuditAnchor[] = [
  {
    key: "appalachian_tailwater",
    label: "Appalachian clear tailwater",
    latitude: 35.4306,
    longitude: -83.4477,
    state_code: "NC",
    timezone: "America/New_York",
    context: "freshwater_river",
    region_key: "appalachian",
    default_clarity: "clear",
    audit_role: "core_monthly",
    notes: "Core trout restraint benchmark for tailwater winter control, bluebird summer tightening, and flow-bump minnow windows.",
  },
  {
    key: "northeast_freestone",
    label: "Northeast freestone river",
    latitude: 41.7268,
    longitude: -77.4529,
    state_code: "PA",
    timezone: "America/New_York",
    context: "freshwater_river",
    region_key: "northeast",
    default_clarity: "clear",
    audit_role: "core_monthly",
    notes: "Core northern freestone benchmark for winter subtlety, spring minnow openings, and late-fall high-water discipline.",
  },
  {
    key: "mountain_west_river",
    label: "Mountain West trout river",
    latitude: 38.4783,
    longitude: -107.8762,
    state_code: "CO",
    timezone: "America/Denver",
    context: "freshwater_river",
    region_key: "mountain_west",
    default_clarity: "clear",
    audit_role: "core_monthly",
    notes: "Core western trout benchmark for shoulder-season minnow control, runoff-edge transitions, and clear fall baitfish streamer behavior.",
  },
  {
    key: "pacific_northwest_river",
    label: "Pacific Northwest trout river",
    latitude: 44.3539,
    longitude: -121.5498,
    state_code: "OR",
    timezone: "America/Los_Angeles",
    context: "freshwater_river",
    region_key: "pacific_northwest",
    default_clarity: "clear",
    audit_role: "core_monthly",
    notes: "Core northwest benchmark for early-summer streamer openings, low-water summer control, and late-fall minnow tightening.",
  },
  {
    key: "northern_california_fall",
    label: "Northern California trout river",
    latitude: 41.7922,
    longitude: -122.6217,
    state_code: "CA",
    timezone: "America/Los_Angeles",
    context: "freshwater_river",
    region_key: "northern_california",
    default_clarity: "clear",
    audit_role: "seasonal_overlay",
    notes: "Fall and shoulder-season western overlay where articulated baitfish, game changer, and late-fall control must stay sensible.",
  },
  {
    key: "great_lakes_highwater",
    label: "Great Lakes / Upper Midwest trout river",
    latitude: 46.0042,
    longitude: -89.6651,
    state_code: "WI",
    timezone: "America/Chicago",
    context: "freshwater_river",
    region_key: "great_lakes_upper_midwest",
    default_clarity: "stained",
    audit_role: "seasonal_overlay",
    notes: "Northern high-water overlay for stained visibility, late-fall tightening, and spring cold-water discipline.",
  },
  {
    key: "alaska_big_river",
    label: "Alaska trout river",
    latitude: 61.5799,
    longitude: -149.4411,
    state_code: "AK",
    timezone: "America/Anchorage",
    context: "freshwater_river",
    region_key: "alaska",
    default_clarity: "clear",
    audit_role: "seasonal_overlay",
    notes: "Big-water trout overlay for strong fall baitfish windows and early-winter heavy-streamer control.",
  },
  {
    key: "idaho_runoff_edge",
    label: "Idaho runoff-edge trout river",
    latitude: 44.0772,
    longitude: -114.742,
    state_code: "ID",
    timezone: "America/Boise",
    context: "freshwater_river",
    region_key: "mountain_west",
    default_clarity: "stained",
    audit_role: "seasonal_overlay",
    notes: "Runoff-edge overlay to stress trout visibility, spinner support, and midsummer restraint when the water has color.",
  },
  {
    key: "south_central_tailwater",
    label: "South-central tailwater trout river",
    latitude: 35.4409,
    longitude: -84.6013,
    state_code: "TN",
    timezone: "America/New_York",
    context: "freshwater_river",
    region_key: "south_central",
    default_clarity: "stained",
    audit_role: "seasonal_overlay",
    notes: "Warm-tailwater overlay for stained generation pulses, summer restraint, and current-aware trout reads outside classic coldwater regions.",
  },
] as const;

const CORE_MONTHLY_MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

const OVERLAY_MONTHS_BY_ANCHOR: Record<
  Exclude<
    TroutAuditAnchorKey,
    "appalachian_tailwater" | "northeast_freestone" | "mountain_west_river" | "pacific_northwest_river"
  >,
  readonly number[]
> = {
  northern_california_fall: [2, 9, 10, 11],
  great_lakes_highwater: [3, 5, 10, 11],
  alaska_big_river: [6, 9, 11, 12],
  idaho_runoff_edge: [4, 6, 7, 8],
  south_central_tailwater: [4, 6, 7, 8],
};

function focusWindow(month: number): string {
  if (month === 1 || month === 12) return "winter_control";
  if (month === 2 || month === 3) return "prespawn_opening";
  if (month === 4 || month === 5) return "spawn_postspawn_transition";
  if (month >= 6 && month <= 8) return "summer_positioning";
  return "fall_transition";
}

function scenarioId(anchor: TroutAuditAnchor, month: number): string {
  return `trout_matrix_${anchor.key}_${String(month).padStart(2, "0")}`;
}

function scenarioLabel(anchor: TroutAuditAnchor, month: number): string {
  return `${anchor.label}, ${focusWindow(month).replace(/_/g, " ")} month ${month}`;
}

function buildScenario(anchor: TroutAuditAnchor, month: number): TroutMatrixScenario {
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

export const TROUT_CORE_MONTHLY_MATRIX: readonly TroutMatrixScenario[] =
  TROUT_AUDIT_ANCHORS
    .filter((anchor) => anchor.audit_role === "core_monthly")
    .flatMap((anchor) => CORE_MONTHLY_MONTHS.map((month) => buildScenario(anchor, month)));

export const TROUT_OVERLAY_MATRIX: readonly TroutMatrixScenario[] =
  TROUT_AUDIT_ANCHORS
    .filter((anchor) => anchor.audit_role === "seasonal_overlay")
    .flatMap((anchor) =>
      OVERLAY_MONTHS_BY_ANCHOR[
        anchor.key as keyof typeof OVERLAY_MONTHS_BY_ANCHOR
      ].map((month) => buildScenario(anchor, month))
    );

export const TROUT_FULL_AUDIT_MATRIX: readonly TroutMatrixScenario[] = [
  ...TROUT_CORE_MONTHLY_MATRIX,
  ...TROUT_OVERLAY_MATRIX,
];
