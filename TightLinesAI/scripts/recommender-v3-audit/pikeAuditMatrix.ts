import type { EngineContext } from "../../supabase/functions/_shared/howFishingEngine/contracts/context.ts";
import type { RegionKey } from "../../supabase/functions/_shared/howFishingEngine/contracts/region.ts";
import type { WaterClarity } from "../../supabase/functions/_shared/recommenderEngine/contracts/input.ts";

export type PikeAuditAnchorKey =
  | "minnesota_northwoods_lake"
  | "new_york_adirondack_lake"
  | "rainy_river_pike"
  | "alaska_pike_lake"
  | "north_dakota_reservoir"
  | "idaho_mountain_river";

export type PikeAuditAnchor = {
  key: PikeAuditAnchorKey;
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

export type PikeMatrixScenario = {
  id: string;
  anchor_key: PikeAuditAnchorKey;
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

export const PIKE_AUDIT_ANCHORS: readonly PikeAuditAnchor[] = [
  {
    key: "minnesota_northwoods_lake",
    label: "Minnesota northwoods pike lake",
    latitude: 47.157,
    longitude: -94.392,
    state_code: "MN",
    timezone: "America/Chicago",
    context: "freshwater_lake_pond",
    region_key: "great_lakes_upper_midwest",
    default_clarity: "stained",
    audit_role: "core_monthly",
    notes:
      "Prime northern-core stained weed-lake benchmark. Covers full-year pike posture from hard-water jerkbait through aggressive fall feedup.",
  },
  {
    key: "new_york_adirondack_lake",
    label: "New York Adirondack clear pike lake",
    latitude: 44.329,
    longitude: -74.132,
    state_code: "NY",
    timezone: "America/New_York",
    context: "freshwater_lake_pond",
    region_key: "northeast",
    default_clarity: "clear",
    audit_role: "core_monthly",
    notes:
      "Northern-core clear-water lake benchmark. Tests color discipline and finesse posture across seasons where perch/shad patterns dominate over firetiger.",
  },
  {
    key: "rainy_river_pike",
    label: "Rainy River pike river system",
    latitude: 48.622,
    longitude: -93.394,
    state_code: "MN",
    timezone: "America/Chicago",
    context: "freshwater_river",
    region_key: "great_lakes_upper_midwest",
    default_clarity: "stained",
    audit_role: "core_monthly",
    notes:
      "Northern-core river benchmark. Tests current-seam pike posture, spinnerbait and jerkbait in moving water, and distinct spring/fall river behavior.",
  },
  {
    key: "alaska_pike_lake",
    label: "Alaska interior pike lake",
    latitude: 64.842,
    longitude: -147.723,
    state_code: "AK",
    timezone: "America/Anchorage",
    context: "freshwater_lake_pond",
    region_key: "alaska",
    default_clarity: "stained",
    audit_role: "seasonal_overlay",
    notes:
      "Far-north Alaska lake overlay. Validates northern-core rows under extreme photoperiod and cold-window conditions for key open-water months.",
  },
  {
    key: "north_dakota_reservoir",
    label: "North Dakota interior reservoir",
    latitude: 47.512,
    longitude: -101.425,
    state_code: "ND",
    timezone: "America/Chicago",
    context: "freshwater_lake_pond",
    region_key: "midwest_interior",
    default_clarity: "stained",
    audit_role: "seasonal_overlay",
    notes:
      "Interior-edge prairie reservoir overlay. Tests the INTERIOR_EDGE row grouping where summer/fall seasons are condensed and early-year conditions are harsher.",
  },
  {
    key: "idaho_mountain_river",
    label: "Idaho mountain river pike",
    latitude: 47.406,
    longitude: -116.812,
    state_code: "ID",
    timezone: "America/Los_Angeles",
    context: "freshwater_river",
    region_key: "inland_northwest",
    default_clarity: "clear",
    audit_role: "seasonal_overlay",
    notes:
      "Mountain-region river overlay. Tests MOUNTAIN row behavior in a clear, cold river context with compressed seasons and finesse color posture.",
  },
] as const;

const CORE_MONTHLY_MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

const OVERLAY_MONTHS_BY_ANCHOR: Record<
  Exclude<PikeAuditAnchorKey, "minnesota_northwoods_lake" | "new_york_adirondack_lake" | "rainy_river_pike">,
  readonly number[]
> = {
  alaska_pike_lake: [5, 7, 9, 11],
  north_dakota_reservoir: [2, 5, 8, 10],
  idaho_mountain_river: [4, 7, 9, 12],
};

function focusWindow(month: number): string {
  if (month === 1 || month === 12) return "winter_control";
  if (month === 2 || month === 3) return "prespawn_opening";
  if (month === 4 || month === 5) return "spawn_postspawn_transition";
  if (month >= 6 && month <= 8) return "summer_positioning";
  return "fall_transition";
}

function scenarioId(anchor: PikeAuditAnchor, month: number): string {
  return `pike_matrix_${anchor.key}_${String(month).padStart(2, "0")}`;
}

function scenarioLabel(anchor: PikeAuditAnchor, month: number): string {
  return `${anchor.label}, ${focusWindow(month).replace(/_/g, " ")} month ${month}`;
}

function buildScenario(anchor: PikeAuditAnchor, month: number): PikeMatrixScenario {
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

export const PIKE_CORE_MONTHLY_MATRIX: readonly PikeMatrixScenario[] =
  PIKE_AUDIT_ANCHORS
    .filter((anchor) => anchor.audit_role === "core_monthly")
    .flatMap((anchor) => CORE_MONTHLY_MONTHS.map((month) => buildScenario(anchor, month)));

export const PIKE_OVERLAY_MATRIX: readonly PikeMatrixScenario[] =
  PIKE_AUDIT_ANCHORS
    .filter((anchor) => anchor.audit_role === "seasonal_overlay")
    .flatMap((anchor) =>
      OVERLAY_MONTHS_BY_ANCHOR[
        anchor.key as keyof typeof OVERLAY_MONTHS_BY_ANCHOR
      ].map((month) => buildScenario(anchor, month))
    );

export const PIKE_FULL_AUDIT_MATRIX: readonly PikeMatrixScenario[] = [
  ...PIKE_CORE_MONTHLY_MATRIX,
  ...PIKE_OVERLAY_MATRIX,
];
