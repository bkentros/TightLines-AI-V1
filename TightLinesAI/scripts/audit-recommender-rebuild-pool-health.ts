/**
 * Pass 7 — Variety and pool health audit after rebuild selector + rows are stable.
 *
 * Usage (from repo `TightLinesAI/`):
 *   deno run -A scripts/audit-recommender-rebuild-pool-health.ts
 *
 * Writes:
 *   docs/audits/recommender-rebuild/pool-health-report.json
 *   docs/audits/recommender-rebuild/pool-health-report.md
 */
import type { WaterClarity } from "../supabase/functions/_shared/recommenderEngine/contracts/input.ts";
import type { SeasonalRowV4 } from "../supabase/functions/_shared/recommenderEngine/v4/contracts.ts";
import { FLY_ARCHETYPES_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/candidates/flies.ts";
import { LURE_ARCHETYPES_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/candidates/lures.ts";
import { LARGEMOUTH_BASS_SEASONAL_ROWS_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/largemouth_bass.ts";
import { SMALLMOUTH_BASS_SEASONAL_ROWS_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/smallmouth_bass.ts";
import { NORTHERN_PIKE_SEASONAL_ROWS_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/northern_pike.ts";
import { TROUT_SEASONAL_ROWS_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/trout.ts";
import {
  buildTargetProfiles,
  computeSurfaceBlocked,
  type DailyRegime,
} from "../supabase/functions/_shared/recommenderEngine/rebuild/shapeProfiles.ts";
import {
  meanDaylightWindMph,
  type WindBand,
  windBandFromDaylightWindMph,
} from "../supabase/functions/_shared/recommenderEngine/rebuild/wind.ts";
import {
  type RebuildSlotSelectionTrace,
  selectArchetypesForSide,
} from "../supabase/functions/_shared/recommenderEngine/rebuild/selectSide.ts";
import type {
  FlyDailyConditionState,
  LureDailyConditionState,
} from "../supabase/functions/_shared/recommenderEngine/rebuild/conditionWindows.ts";

const OUT_DIR = "docs/audits/recommender-rebuild";
const JSON_PATH = `${OUT_DIR}/pool-health-report.json`;
const MD_PATH = `${OUT_DIR}/pool-health-report.md`;
/** Set `TL_POOL_AUDIT_FULL_CELLS=1` to embed every cell in JSON (large file). Default: metrics + preview only. */
const FULL_CELLS = Deno.env.get("TL_POOL_AUDIT_FULL_CELLS") === "1";
const CELLS_PREVIEW = 200;

const ALL_ROWS: readonly SeasonalRowV4[] = [
  ...LARGEMOUTH_BASS_SEASONAL_ROWS_V4,
  ...SMALLMOUTH_BASS_SEASONAL_ROWS_V4,
  ...NORTHERN_PIKE_SEASONAL_ROWS_V4,
  ...TROUT_SEASONAL_ROWS_V4,
];

const CATALOG_BY_ID: Map<
  string,
  (typeof LURE_ARCHETYPES_V4 | typeof FLY_ARCHETYPES_V4)[number]
> = new Map(
  [...LURE_ARCHETYPES_V4, ...FLY_ARCHETYPES_V4].map((a) => [a.id, a]),
);

const CLARITIES: readonly WaterClarity[] = ["clear", "stained", "dirty"];
const REGIMES: readonly DailyRegime[] = [
  "suppressive",
  "neutral",
  "aggressive",
];
const WIND_PROFILES: readonly WindBand[] = ["calm", "breezy", "windy"];

const SOUTHERN_LMB_LAKE_REGIONS = new Set([
  "florida",
  "gulf_coast",
  "southeast_atlantic",
]);

/** Daylight mean wind mph targets for audit bands (surface blocks when > 14). */
const WIND_MPH: Record<WindBand, number> = {
  calm: 3,
  breezy: 9,
  windy: 16,
};

function regimeToHows0to100(r: DailyRegime): number {
  if (r === "suppressive") return 30;
  if (r === "neutral") return 50;
  return 75;
}

function hourlyWindUniform(localDate: string, mph: number) {
  return Array.from({ length: 24 }, (_, hour) => ({
    time_utc: `${localDate}T${String(hour).padStart(2, "0")}:00:00Z`,
    value: mph,
  }));
}

function envForWind(
  localDate: string,
  band: WindBand,
): Record<string, unknown> {
  return {
    weather: { wind_speed_unit: "mph" },
    hourly_wind_speed: hourlyWindUniform(localDate, WIND_MPH[band]),
  };
}

/** Values that appear more than once in `xs` (order: first-seen duplicate). */
function duplicateValues<T>(xs: readonly T[]): T[] {
  const m = new Map<T, number>();
  for (const x of xs) m.set(x, (m.get(x) ?? 0) + 1);
  return [...m.entries()].filter(([, n]) => n > 1).map(([k]) => k);
}

function unique<T>(xs: readonly T[]): T[] {
  return [...new Set(xs)];
}

type CellResult = {
  species: SeasonalRowV4["species"];
  region_key: string;
  month: number;
  water_type: SeasonalRowV4["water_type"];
  clarity: WaterClarity;
  regime: DailyRegime;
  wind_surface_state: WindBand;
  daylight_wind_mph: number;
  surface_open: boolean;
  surface_blocked: boolean;
  target_profiles: { column: string; pace: string }[];
  lure_candidate_counts_by_slot: number[];
  fly_candidate_counts_by_slot: number[];
  lure_chosen_ids: string[];
  fly_chosen_ids: string[];
  lure_presentation_groups: string[];
  fly_presentation_groups: string[];
  lure_family_groups: string[];
  fly_family_groups: string[];
  lure_repeated_presentation_groups: string[];
  fly_repeated_presentation_groups: string[];
  lure_avoidable_repeated_presentation_groups: string[];
  fly_avoidable_repeated_presentation_groups: string[];
  lure_unavoidable_repeated_presentation_groups: string[];
  fly_unavoidable_repeated_presentation_groups: string[];
  lure_repeated_family_groups: string[];
  fly_repeated_family_groups: string[];
  lure_count: number;
  fly_count: number;
  fewer_than_3_lures: boolean;
  fewer_than_3_flies: boolean;
  zero_lure_side: boolean;
  zero_fly_side: boolean;
  southern_lmb_warm_lake_frog_context: boolean;
  southern_lmb_warm_lake_surface_slot_context: boolean;
  frog_candidate: boolean;
  frog_finalist: boolean;
  frog_pick: boolean;
  frog_exposure: boolean;
  topwater_surface_picks: number;
  topwater_distinct_presentation_groups: number;
  surface_slot_open_topwater_picks: number;
  surface_slot_frog_picks: number;
  thin_classification: string;
  /** Same first lure id on local_date vs +1 day (same other dims). */
  adjacent_repeat_lure_slot0: boolean | null;
  /** Same first fly id on local_date vs +1 day. */
  adjacent_repeat_fly_slot0: boolean | null;
};

type GroupMetrics = {
  cell_count: number;
  pct_three_lures: number;
  pct_three_flies: number;
  pct_fewer_than_3_lures: number;
  pct_fewer_than_3_flies: number;
  zero_lure_cells: number;
  zero_fly_cells: number;
  repeated_presentation_group_cells: number;
  repeated_presentation_group_rate_pct: number;
  avoidable_repeated_presentation_group_cells: number;
  avoidable_repeated_presentation_group_rate_pct: number;
  unavoidable_repeated_presentation_group_cells: number;
  unavoidable_repeated_presentation_group_rate_pct: number;
  repeated_family_group_cells: number;
  adjacent_same_lure_top_cells: number;
  adjacent_same_fly_top_cells: number;
  surface_open_cells: number;
  topwater_variety_ok_cells: number;
  southern_frog_context_cells: number;
  southern_frog_exposed_cells: number;
  southern_frog_surface_slot_context_cells: number;
  southern_frog_candidate_cells: number;
  southern_frog_finalist_cells: number;
  southern_frog_pick_cells: number;
  surface_slot_cells: number;
  surface_slot_open_topwater_pick_cells: number;
  surface_slot_frog_pick_cells: number;
};

type GroupAcc = {
  cell_count: number;
  count_three_lures: number;
  count_three_flies: number;
  count_fewer_than_3_lures: number;
  count_fewer_than_3_flies: number;
  zero_lure_cells: number;
  zero_fly_cells: number;
  repeated_presentation_group_cells: number;
  avoidable_repeated_presentation_group_cells: number;
  unavoidable_repeated_presentation_group_cells: number;
  repeated_family_group_cells: number;
  adjacent_same_lure_top_cells: number;
  adjacent_same_fly_top_cells: number;
  surface_open_cells: number;
  topwater_variety_ok_cells: number;
  southern_frog_context_cells: number;
  southern_frog_exposed_cells: number;
  southern_frog_surface_slot_context_cells: number;
  southern_frog_candidate_cells: number;
  southern_frog_finalist_cells: number;
  southern_frog_pick_cells: number;
  surface_slot_cells: number;
  surface_slot_open_topwater_pick_cells: number;
  surface_slot_frog_pick_cells: number;
};

function emptyAcc(): GroupAcc {
  return {
    cell_count: 0,
    count_three_lures: 0,
    count_three_flies: 0,
    count_fewer_than_3_lures: 0,
    count_fewer_than_3_flies: 0,
    zero_lure_cells: 0,
    zero_fly_cells: 0,
    repeated_presentation_group_cells: 0,
    avoidable_repeated_presentation_group_cells: 0,
    unavoidable_repeated_presentation_group_cells: 0,
    repeated_family_group_cells: 0,
    adjacent_same_lure_top_cells: 0,
    adjacent_same_fly_top_cells: 0,
    surface_open_cells: 0,
    topwater_variety_ok_cells: 0,
    southern_frog_context_cells: 0,
    southern_frog_exposed_cells: 0,
    southern_frog_surface_slot_context_cells: 0,
    southern_frog_candidate_cells: 0,
    southern_frog_finalist_cells: 0,
    southern_frog_pick_cells: 0,
    surface_slot_cells: 0,
    surface_slot_open_topwater_pick_cells: 0,
    surface_slot_frog_pick_cells: 0,
  };
}

function accumulateGroup(
  bucket: GroupAcc,
  c: CellResult,
  adjLure: boolean | null,
  adjFly: boolean | null,
) {
  bucket.cell_count++;
  if (c.lure_count === 3) bucket.count_three_lures++;
  if (c.fly_count === 3) bucket.count_three_flies++;
  if (c.fewer_than_3_lures) bucket.count_fewer_than_3_lures++;
  if (c.fewer_than_3_flies) bucket.count_fewer_than_3_flies++;
  if (c.zero_lure_side) bucket.zero_lure_cells++;
  if (c.zero_fly_side) bucket.zero_fly_cells++;
  if (
    c.lure_repeated_presentation_groups.length > 0 ||
    c.fly_repeated_presentation_groups.length > 0
  ) {
    bucket.repeated_presentation_group_cells++;
  }
  if (
    c.lure_avoidable_repeated_presentation_groups.length > 0 ||
    c.fly_avoidable_repeated_presentation_groups.length > 0
  ) {
    bucket.avoidable_repeated_presentation_group_cells++;
  }
  if (
    c.lure_unavoidable_repeated_presentation_groups.length > 0 ||
    c.fly_unavoidable_repeated_presentation_groups.length > 0
  ) {
    bucket.unavoidable_repeated_presentation_group_cells++;
  }
  if (
    c.lure_repeated_family_groups.length > 0 ||
    c.fly_repeated_family_groups.length > 0
  ) {
    bucket.repeated_family_group_cells++;
  }
  if (adjLure === true) bucket.adjacent_same_lure_top_cells++;
  if (adjFly === true) bucket.adjacent_same_fly_top_cells++;
  if (c.surface_open) {
    bucket.surface_open_cells++;
    if (
      c.topwater_surface_picks >= 2 &&
      c.topwater_distinct_presentation_groups >= 2
    ) {
      bucket.topwater_variety_ok_cells++;
    }
  }
  if (c.target_profiles.some((profile) => profile.column === "surface")) {
    bucket.surface_slot_cells++;
    bucket.surface_slot_open_topwater_pick_cells +=
      c.surface_slot_open_topwater_picks;
    bucket.surface_slot_frog_pick_cells += c.surface_slot_frog_picks;
  }
  if (c.southern_lmb_warm_lake_frog_context) {
    bucket.southern_frog_context_cells++;
    if (c.frog_exposure) bucket.southern_frog_exposed_cells++;
  }
  if (c.southern_lmb_warm_lake_surface_slot_context) {
    bucket.southern_frog_surface_slot_context_cells++;
    if (c.frog_candidate) bucket.southern_frog_candidate_cells++;
    if (c.frog_finalist) bucket.southern_frog_finalist_cells++;
    if (c.frog_pick) bucket.southern_frog_pick_cells++;
  }
}

function accToMetrics(b: GroupAcc): GroupMetrics {
  const n = b.cell_count;
  const pct = (x: number) => (n ? Math.round((10000 * x) / n) / 100 : 0);
  return {
    cell_count: n,
    pct_three_lures: pct(b.count_three_lures),
    pct_three_flies: pct(b.count_three_flies),
    pct_fewer_than_3_lures: pct(b.count_fewer_than_3_lures),
    pct_fewer_than_3_flies: pct(b.count_fewer_than_3_flies),
    zero_lure_cells: b.zero_lure_cells,
    zero_fly_cells: b.zero_fly_cells,
    repeated_presentation_group_cells: b.repeated_presentation_group_cells,
    repeated_presentation_group_rate_pct: pct(
      b.repeated_presentation_group_cells,
    ),
    avoidable_repeated_presentation_group_cells:
      b.avoidable_repeated_presentation_group_cells,
    avoidable_repeated_presentation_group_rate_pct: pct(
      b.avoidable_repeated_presentation_group_cells,
    ),
    unavoidable_repeated_presentation_group_cells:
      b.unavoidable_repeated_presentation_group_cells,
    unavoidable_repeated_presentation_group_rate_pct: pct(
      b.unavoidable_repeated_presentation_group_cells,
    ),
    repeated_family_group_cells: b.repeated_family_group_cells,
    adjacent_same_lure_top_cells: b.adjacent_same_lure_top_cells,
    adjacent_same_fly_top_cells: b.adjacent_same_fly_top_cells,
    surface_open_cells: b.surface_open_cells,
    topwater_variety_ok_cells: b.topwater_variety_ok_cells,
    southern_frog_context_cells: b.southern_frog_context_cells,
    southern_frog_exposed_cells: b.southern_frog_exposed_cells,
    southern_frog_surface_slot_context_cells:
      b.southern_frog_surface_slot_context_cells,
    southern_frog_candidate_cells: b.southern_frog_candidate_cells,
    southern_frog_finalist_cells: b.southern_frog_finalist_cells,
    southern_frog_pick_cells: b.southern_frog_pick_cells,
    surface_slot_cells: b.surface_slot_cells,
    surface_slot_open_topwater_pick_cells:
      b.surface_slot_open_topwater_pick_cells,
    surface_slot_frog_pick_cells: b.surface_slot_frog_pick_cells,
  };
}

function classifyThin(c: CellResult, row: SeasonalRowV4): string {
  if (
    !c.zero_lure_side && !c.zero_fly_side && !c.fewer_than_3_lures &&
    !c.fewer_than_3_flies
  ) {
    return "ok";
  }
  const minLureSlot = Math.min(...c.lure_candidate_counts_by_slot);
  const minFlySlot = Math.min(...c.fly_candidate_counts_by_slot);
  if (c.zero_lure_side) {
    if (row.primary_lure_ids.length < 3) return "likely_row_authoring_issue";
    if (minLureSlot === 0 && row.primary_lure_ids.length >= 3) {
      return "likely_honest_inventory_limit";
    }
    return "needs_human_review";
  }
  if (c.zero_fly_side) {
    if (row.primary_fly_ids.length < 3) return "likely_row_authoring_issue";
    if (minFlySlot === 0 && row.primary_fly_ids.length >= 3) {
      return "likely_honest_inventory_limit";
    }
    return "needs_human_review";
  }
  if (c.fewer_than_3_lures || c.fewer_than_3_flies) {
    if (
      (c.fewer_than_3_lures && minLureSlot <= 2) ||
      (c.fewer_than_3_flies && minFlySlot <= 2)
    ) {
      return "likely_honest_inventory_limit";
    }
    return "needs_human_review";
  }
  return "needs_human_review";
}

function presentationRepeatAvoidability(
  traces: readonly RebuildSlotSelectionTrace[],
): {
  avoidable: string[];
  unavoidable: string[];
} {
  const seenPresentationGroups = new Set<string>();
  const pickedIds = new Set<string>();
  const avoidable: string[] = [];
  const unavoidable: string[] = [];

  for (const trace of traces) {
    if (trace.chosenId == null) continue;
    const chosen = CATALOG_BY_ID.get(trace.chosenId);
    if (chosen == null) continue;
    const group = chosen.presentation_group;

    if (seenPresentationGroups.has(group)) {
      const hadDifferentAvailableGroup = trace.candidateScores.some(
        (candidate) => {
          if (pickedIds.has(candidate.id)) return false;
          const candidateProfile = CATALOG_BY_ID.get(candidate.id);
          return candidateProfile != null &&
            candidateProfile.presentation_group !== group;
        },
      );
      if (hadDifferentAvailableGroup) {
        avoidable.push(group);
      } else {
        unavoidable.push(group);
      }
    }

    seenPresentationGroups.add(group);
    pickedIds.add(trace.chosenId);
  }

  return {
    avoidable: unique(avoidable),
    unavoidable: unique(unavoidable),
  };
}

function runCell(args: {
  row: SeasonalRowV4;
  clarity: WaterClarity;
  regime: DailyRegime;
  windBand: WindBand;
  local_date: string;
}): Omit<
  CellResult,
  | "thin_classification"
  | "adjacent_repeat_lure_slot0"
  | "adjacent_repeat_fly_slot0"
> {
  const { row, clarity, regime, windBand, local_date } = args;
  const species = row.species;
  const context = row.water_type;
  const env_data = envForWind(local_date, windBand);
  const daylightWindMph = meanDaylightWindMph({
    env_data,
    local_date,
    local_timezone: "UTC",
  });
  const surfaceBlocked = computeSurfaceBlocked({ row, daylightWindMph });
  const profiles = buildTargetProfiles({ row, regime, surfaceBlocked });
  const wind_band = windBandFromDaylightWindMph(daylightWindMph);
  const surfaceAllowedToday = row.column_range.includes("surface") &&
    row.surface_seasonally_possible &&
    !surfaceBlocked;
  const surfaceSlotPresent = profiles.some((p) => p.column === "surface");

  const lureConditionState: LureDailyConditionState = {
    regime,
    water_clarity: clarity,
    surface_allowed_today: surfaceAllowedToday,
    surface_slot_present: surfaceSlotPresent,
    daylight_wind_mph: daylightWindMph,
    wind_band,
  };
  const flyConditionState: FlyDailyConditionState = {
    regime,
    surface_allowed_today: surfaceAllowedToday,
    surface_slot_present: surfaceSlotPresent,
    daylight_wind_mph: daylightWindMph,
    wind_band,
    species,
    context,
    month: row.month,
  };

  const howsTag = regimeToHows0to100(regime);
  const seedBase =
    `audit|${howsTag}|${local_date}|${row.region_key}|${species}|${context}|${clarity}|${windBand}`;

  const lureTraces: RebuildSlotSelectionTrace[] = [];
  const flyTraces: RebuildSlotSelectionTrace[] = [];

  const lureSlotPicks = selectArchetypesForSide({
    side: "lure",
    row,
    species,
    context,
    water_clarity: clarity,
    profiles,
    surfaceBlocked,
    seedBase,
    currentLocalDate: local_date,
    lureConditionState,
    onSlotTrace: (t) => lureTraces.push(t),
  });

  const flySlotPicks = selectArchetypesForSide({
    side: "fly",
    row,
    species,
    context,
    water_clarity: clarity,
    profiles,
    surfaceBlocked,
    seedBase,
    currentLocalDate: local_date,
    flyConditionState,
    onSlotTrace: (t) => flyTraces.push(t),
  });

  const lure_chosen_ids = lureSlotPicks.map((p) => p.archetype.id);
  const fly_chosen_ids = flySlotPicks.map((p) => p.archetype.id);
  const lure_presentation_groups = lureSlotPicks.map((p) =>
    p.archetype.presentation_group
  );
  const fly_presentation_groups = flySlotPicks.map((p) =>
    p.archetype.presentation_group
  );
  const lure_family_groups = lureSlotPicks.map((p) => p.archetype.family_group);
  const fly_family_groups = flySlotPicks.map((p) => p.archetype.family_group);

  const surfacePicks = [...lureSlotPicks, ...flySlotPicks].filter((p) =>
    p.archetype.is_surface
  );
  const topwaterPG = unique(
    surfacePicks.map((p) => p.archetype.presentation_group),
  );
  const openTopwaterPicks = surfaceSlotPresent
    ? surfacePicks.filter((p) =>
      p.archetype.presentation_group === "topwater_open" ||
      p.archetype.presentation_group === "surface_fly_popper_slider" ||
      p.archetype.presentation_group === "surface_fly_slider" ||
      p.archetype.presentation_group === "surface_fly_gurgler"
    ).length
    : 0;
  const frogSurfacePicks = surfaceSlotPresent
    ? surfacePicks.filter((p) =>
      p.archetype.id === "hollow_body_frog" || p.archetype.id === "frog_fly"
    ).length
    : 0;

  const lureRepeatAvoidability = presentationRepeatAvoidability(lureTraces);
  const flyRepeatAvoidability = presentationRepeatAvoidability(flyTraces);

  const southern_frog_context = species === "largemouth_bass" &&
    SOUTHERN_LMB_LAKE_REGIONS.has(row.region_key) &&
    context === "freshwater_lake_pond" &&
    row.month >= 3 &&
    row.month <= 10 &&
    row.surface_seasonally_possible;

  const frog_in_row = row.primary_fly_ids.includes("frog_fly") &&
    row.primary_lure_ids.includes("hollow_body_frog");
  const frog_candidate = southern_frog_context && frog_in_row &&
    surfaceSlotPresent &&
    (lureTraces.some((t) =>
      t.profile.column === "surface" &&
      t.candidateScores.some((score) => score.id === "hollow_body_frog")
    ) ||
      flyTraces.some((t) =>
        t.profile.column === "surface" &&
        t.candidateScores.some((score) => score.id === "frog_fly")
      ));
  const frog_finalist = southern_frog_context && frog_in_row &&
    surfaceSlotPresent &&
    (lureTraces.some((t) =>
      t.profile.column === "surface" &&
      t.finalistIds.includes("hollow_body_frog")
    ) ||
      flyTraces.some((t) =>
        t.profile.column === "surface" && t.finalistIds.includes("frog_fly")
      ));
  const frog_pick = southern_frog_context && frog_in_row &&
    surfaceSlotPresent &&
    (lure_chosen_ids.includes("hollow_body_frog") ||
      fly_chosen_ids.includes("frog_fly"));
  const frog_exposure = frog_finalist || frog_pick;

  const cell: Omit<
    CellResult,
    | "thin_classification"
    | "adjacent_repeat_lure_slot0"
    | "adjacent_repeat_fly_slot0"
  > = {
    species,
    region_key: row.region_key,
    month: row.month,
    water_type: context,
    clarity,
    regime,
    wind_surface_state: windBand,
    daylight_wind_mph: daylightWindMph,
    surface_open: surfaceAllowedToday,
    surface_blocked: surfaceBlocked,
    target_profiles: profiles.map((p) => ({ column: p.column, pace: p.pace })),
    lure_candidate_counts_by_slot: lureTraces.map((t) =>
      t.eligibleCandidateCount
    ),
    fly_candidate_counts_by_slot: flyTraces.map((t) =>
      t.eligibleCandidateCount
    ),
    lure_chosen_ids,
    fly_chosen_ids,
    lure_presentation_groups,
    fly_presentation_groups,
    lure_family_groups,
    fly_family_groups,
    lure_repeated_presentation_groups: duplicateValues(
      lure_presentation_groups,
    ),
    fly_repeated_presentation_groups: duplicateValues(fly_presentation_groups),
    lure_avoidable_repeated_presentation_groups:
      lureRepeatAvoidability.avoidable,
    fly_avoidable_repeated_presentation_groups: flyRepeatAvoidability.avoidable,
    lure_unavoidable_repeated_presentation_groups:
      lureRepeatAvoidability.unavoidable,
    fly_unavoidable_repeated_presentation_groups:
      flyRepeatAvoidability.unavoidable,
    lure_repeated_family_groups: duplicateValues(lure_family_groups),
    fly_repeated_family_groups: duplicateValues(fly_family_groups),
    lure_count: lure_chosen_ids.length,
    fly_count: fly_chosen_ids.length,
    fewer_than_3_lures: lure_chosen_ids.length < 3,
    fewer_than_3_flies: fly_chosen_ids.length < 3,
    zero_lure_side: lure_chosen_ids.length === 0,
    zero_fly_side: fly_chosen_ids.length === 0,
    southern_lmb_warm_lake_frog_context: southern_frog_context && frog_in_row &&
      surfaceAllowedToday,
    southern_lmb_warm_lake_surface_slot_context: southern_frog_context &&
      frog_in_row &&
      surfaceAllowedToday && surfaceSlotPresent,
    frog_candidate,
    frog_finalist,
    frog_pick,
    frog_exposure: !!frog_exposure,
    topwater_surface_picks: surfacePicks.length,
    topwater_distinct_presentation_groups: topwaterPG.length,
    surface_slot_open_topwater_picks: openTopwaterPicks,
    surface_slot_frog_picks: frogSurfacePicks,
  };

  return cell;
}

function nextLocalDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const dt = new Date(Date.UTC(y!, m! - 1, d! + 1));
  const yy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

function main() {
  const generated_at = new Date().toISOString();
  const cells: CellResult[] = [];

  const globalAcc = emptyAcc();
  const bySpecies = new Map<string, GroupAcc>();
  const byRegion = new Map<string, GroupAcc>();
  const bySpeciesRegionWater = new Map<string, GroupAcc>();

  const getBucket = (map: Map<string, GroupAcc>, key: string) => {
    let b = map.get(key);
    if (!b) {
      b = emptyAcc();
      map.set(key, b);
    }
    return b;
  };

  for (const row of ALL_ROWS) {
    if (row.state_code != null && String(row.state_code).trim() !== "") {
      continue;
    }
    const mm = String(row.month).padStart(2, "0");
    const local_date = `2026-${mm}-15`;

    for (const clarity of CLARITIES) {
      for (const regime of REGIMES) {
        for (const windBand of WIND_PROFILES) {
          const baseCell = runCell({
            row,
            clarity,
            regime,
            windBand,
            local_date,
          });

          const nextCell = runCell({
            row,
            clarity,
            regime,
            windBand,
            local_date: nextLocalDate(local_date),
          });

          const adjLure = baseCell.lure_chosen_ids[0] != null &&
              nextCell.lure_chosen_ids[0] != null
            ? baseCell.lure_chosen_ids[0] === nextCell.lure_chosen_ids[0]
            : null;
          const adjFly = baseCell.fly_chosen_ids[0] != null &&
              nextCell.fly_chosen_ids[0] != null
            ? baseCell.fly_chosen_ids[0] === nextCell.fly_chosen_ids[0]
            : null;

          const full: CellResult = {
            ...baseCell,
            thin_classification: "ok",
            adjacent_repeat_lure_slot0: adjLure,
            adjacent_repeat_fly_slot0: adjFly,
          };
          full.thin_classification = classifyThin(full, row);
          cells.push(full);

          accumulateGroup(globalAcc, full, adjLure, adjFly);
          accumulateGroup(
            getBucket(bySpecies, full.species),
            full,
            adjLure,
            adjFly,
          );
          accumulateGroup(
            getBucket(byRegion, full.region_key),
            full,
            adjLure,
            adjFly,
          );
          const srw = `${full.species}|${full.region_key}|${full.water_type}`;
          accumulateGroup(
            getBucket(bySpeciesRegionWater, srw),
            full,
            adjLure,
            adjFly,
          );
        }
      }
    }
  }

  const zeroLures = cells.filter((c) => c.zero_lure_side);
  const zeroFlies = cells.filter((c) => c.zero_fly_side);
  const thinCells = cells.filter((c) =>
    c.fewer_than_3_lures ||
    c.fewer_than_3_flies ||
    c.zero_lure_side ||
    c.zero_fly_side
  );
  const worstThin = [...thinCells]
    .sort((a, b) => (a.lure_count + a.fly_count) - (b.lure_count + b.fly_count))
    .slice(0, 40);

  const global = accToMetrics(globalAcc);
  const by_species: Record<string, GroupMetrics> = {};
  for (const [k, v] of bySpecies) by_species[k] = accToMetrics(v);
  const by_region: Record<string, GroupMetrics> = {};
  for (const [k, v] of byRegion) by_region[k] = accToMetrics(v);
  const by_species_region_water: Record<string, GroupMetrics> = {};
  for (const [k, v] of bySpeciesRegionWater) {
    by_species_region_water[k] = accToMetrics(v);
  }

  const southernFrogContexts = cells.filter((c) =>
    c.southern_lmb_warm_lake_frog_context
  );
  const southernFrogSurfaceSlotContexts = cells.filter((c) =>
    c.southern_lmb_warm_lake_surface_slot_context
  );
  const southernFrogExposed = southernFrogContexts.filter((c) =>
    c.frog_exposure
  );
  const southernFrogCandidate = southernFrogSurfaceSlotContexts.filter((c) =>
    c.frog_candidate
  );
  const southernFrogFinalist = southernFrogSurfaceSlotContexts.filter((c) =>
    c.frog_finalist
  );
  const southernFrogPick = southernFrogSurfaceSlotContexts.filter((c) =>
    c.frog_pick
  );
  const repeatedPgCells = cells.filter((c) =>
    c.lure_repeated_presentation_groups.length > 0 ||
    c.fly_repeated_presentation_groups.length > 0
  );
  const avoidableRepeatedPgCells = cells.filter((c) =>
    c.lure_avoidable_repeated_presentation_groups.length > 0 ||
    c.fly_avoidable_repeated_presentation_groups.length > 0
  );
  const unavoidableRepeatedPgCells = cells.filter((c) =>
    c.lure_unavoidable_repeated_presentation_groups.length > 0 ||
    c.fly_unavoidable_repeated_presentation_groups.length > 0
  );

  const topwaterVarietyRate = global.surface_open_cells
    ? global.topwater_variety_ok_cells / global.surface_open_cells
    : 0;

  const report = {
    generated_at,
    matrix: {
      rows_scanned:
        ALL_ROWS.filter((r) =>
          r.state_code == null || String(r.state_code).trim() === ""
        ).length,
      clarities: CLARITIES.length,
      regimes: REGIMES.length,
      wind_profiles: WIND_PROFILES.length,
      total_cells: cells.length,
    },
    metrics_global: {
      ...global,
      topwater_variety_rate_when_surface_open:
        Math.round(10000 * topwaterVarietyRate) / 100,
      southern_lmb_frog_exposure_rate: southernFrogContexts.length
        ? Math.round(
          10000 * southernFrogExposed.length / southernFrogContexts.length,
        ) / 100
        : 0,
      repeated_presentation_group_rate_pct: global.cell_count
        ? Math.round(
          10000 * global.repeated_presentation_group_cells / global.cell_count,
        ) / 100
        : 0,
      avoidable_repeated_presentation_group_rate_pct: global.cell_count
        ? Math.round(
          10000 * global.avoidable_repeated_presentation_group_cells /
            global.cell_count,
        ) / 100
        : 0,
      unavoidable_repeated_presentation_group_rate_pct: global.cell_count
        ? Math.round(
          10000 * global.unavoidable_repeated_presentation_group_cells /
            global.cell_count,
        ) / 100
        : 0,
      repeated_family_group_rate_pct: global.cell_count
        ? Math.round(
          10000 * global.repeated_family_group_cells / global.cell_count,
        ) / 100
        : 0,
      adjacent_same_top_lure_rate_pct: global.cell_count
        ? Math.round(
          10000 * global.adjacent_same_lure_top_cells / global.cell_count,
        ) / 100
        : 0,
      adjacent_same_top_fly_rate_pct: global.cell_count
        ? Math.round(
          10000 * global.adjacent_same_fly_top_cells / global.cell_count,
        ) / 100
        : 0,
      southern_lmb_frog_candidate_rate_when_surface_slot:
        southernFrogSurfaceSlotContexts.length
          ? Math.round(
            10000 * southernFrogCandidate.length /
              southernFrogSurfaceSlotContexts.length,
          ) / 100
          : 0,
      southern_lmb_frog_finalist_rate_when_surface_slot:
        southernFrogSurfaceSlotContexts.length
          ? Math.round(
            10000 * southernFrogFinalist.length /
              southernFrogSurfaceSlotContexts.length,
          ) / 100
          : 0,
      southern_lmb_frog_pick_rate_when_surface_slot:
        southernFrogSurfaceSlotContexts.length
          ? Math.round(
            10000 * southernFrogPick.length /
              southernFrogSurfaceSlotContexts.length,
          ) / 100
          : 0,
    },
    metrics_by_species: by_species,
    metrics_by_region: by_region,
    metrics_by_species_region_water: by_species_region_water,
    rollups: {
      zero_lure_cells: zeroLures.length,
      zero_fly_cells: zeroFlies.length,
      southern_frog_context_cells: southernFrogContexts.length,
      southern_frog_exposed_cells: southernFrogExposed.length,
      southern_frog_surface_slot_context_cells:
        southernFrogSurfaceSlotContexts.length,
      southern_frog_candidate_cells: southernFrogCandidate.length,
      southern_frog_finalist_cells: southernFrogFinalist.length,
      southern_frog_pick_cells: southernFrogPick.length,
      repeated_presentation_group_cells: repeatedPgCells.length,
      avoidable_repeated_presentation_group_cells:
        avoidableRepeatedPgCells.length,
      unavoidable_repeated_presentation_group_cells:
        unavoidableRepeatedPgCells.length,
    },
    worst_thin_pool_samples: worstThin,
    zero_lure_samples: zeroLures.slice(0, 50),
    zero_fly_samples: zeroFlies.slice(0, 50),
    classification_counts: cells.reduce<Record<string, number>>((acc, c) => {
      acc[c.thin_classification] = (acc[c.thin_classification] ?? 0) + 1;
      return acc;
    }, {}),
    cells_included: FULL_CELLS,
    cells_total: cells.length,
    cells_preview: cells.slice(0, CELLS_PREVIEW),
    ...(FULL_CELLS ? { cells } : {}),
  };

  Deno.mkdirSync(OUT_DIR, { recursive: true });
  Deno.writeTextFileSync(JSON_PATH, JSON.stringify(report, null, 2));
  if (FULL_CELLS) {
    const jsonlPath = `${OUT_DIR}/pool-health-report.cells.jsonl`;
    const jsonl = cells.map((c) => JSON.stringify(c)).join("\n");
    Deno.writeTextFileSync(jsonlPath, jsonl + "\n");
    console.log(`Wrote ${jsonlPath} (full cells, newline-delimited)`);
  }

  const md: string[] = [];
  md.push("# Recommender rebuild — pool health audit (Pass 7)");
  md.push("");
  md.push(`Generated: **${generated_at}**`);
  md.push("");
  md.push("## Matrix");
  md.push("");
  md.push(`- Seasonal rows (unscoped): ${report.matrix.rows_scanned}`);
  md.push(`- Total evaluated cells: **${report.matrix.total_cells}**`);
  md.push(
    `- Dimensions: ${report.matrix.clarities} clarities × ${report.matrix.regimes} regimes × ${report.matrix.wind_profiles} wind/surface bands`,
  );
  md.push("");
  md.push("## Global metrics");
  md.push("");
  md.push("| Metric | Value |");
  md.push("| --- | --- |");
  md.push(`| Cells | ${global.cell_count} |`);
  md.push(`| % 3 lure picks | ${global.pct_three_lures}% |`);
  md.push(`| % 3 fly picks | ${global.pct_three_flies}% |`);
  md.push(`| % <3 lure picks | ${global.pct_fewer_than_3_lures}% |`);
  md.push(`| % <3 fly picks | ${global.pct_fewer_than_3_flies}% |`);
  md.push(`| Zero-output lure cells | ${global.zero_lure_cells} |`);
  md.push(`| Zero-output fly cells | ${global.zero_fly_cells} |`);
  md.push(
    `| Repeated presentation-group cells | ${global.repeated_presentation_group_cells} (${report.metrics_global.repeated_presentation_group_rate_pct}%) |`,
  );
  md.push(
    `| Avoidable repeated presentation-group cells | ${global.avoidable_repeated_presentation_group_cells} (${report.metrics_global.avoidable_repeated_presentation_group_rate_pct}%) |`,
  );
  md.push(
    `| Unavoidable repeated presentation-group cells | ${global.unavoidable_repeated_presentation_group_cells} (${report.metrics_global.unavoidable_repeated_presentation_group_rate_pct}%) |`,
  );
  md.push(
    `| Repeated family-group cells | ${global.repeated_family_group_cells} (${report.metrics_global.repeated_family_group_rate_pct}%) |`,
  );
  md.push(
    `| Adjacent-date same top lure (rate) | ${report.metrics_global.adjacent_same_top_lure_rate_pct}% |`,
  );
  md.push(
    `| Adjacent-date same top fly (rate) | ${report.metrics_global.adjacent_same_top_fly_rate_pct}% |`,
  );
  md.push(
    `| Topwater variety rate (surface open, ≥2 surface picks & ≥2 pres. groups) | ${report.metrics_global.topwater_variety_rate_when_surface_open}% |`,
  );
  md.push(
    `| Southern LMB warm-season lake frog exposure rate | ${report.metrics_global.southern_lmb_frog_exposure_rate}% |`,
  );
  md.push(
    `| Southern LMB frog candidate rate when surface slot exists | ${report.metrics_global.southern_lmb_frog_candidate_rate_when_surface_slot}% |`,
  );
  md.push(
    `| Southern LMB frog finalist rate when surface slot exists | ${report.metrics_global.southern_lmb_frog_finalist_rate_when_surface_slot}% |`,
  );
  md.push(
    `| Southern LMB frog pick rate when surface slot exists | ${report.metrics_global.southern_lmb_frog_pick_rate_when_surface_slot}% |`,
  );
  md.push("");
  md.push("## Southern LMB frog exposure");
  md.push("");
  md.push(
    `Contexts (LMB × FL/Gulf/Southeast × lake × months 3–10 × surface open × row lists frog): **${southernFrogContexts.length}**; with frog in finalists or picks: **${southernFrogExposed.length}**.`,
  );
  md.push(
    `Surface-slot contexts: **${southernFrogSurfaceSlotContexts.length}**; frog candidate: **${southernFrogCandidate.length}**; frog finalist: **${southernFrogFinalist.length}**; frog pick: **${southernFrogPick.length}**.`,
  );
  md.push(
    `Surface-slot topwater split across all species: open-water surface picks **${global.surface_slot_open_topwater_pick_cells}**, frog surface picks **${global.surface_slot_frog_pick_cells}**.`,
  );
  md.push("");
  md.push("## Avoidable presentation-group repeats");
  md.push("");
  md.push(
    `A repeated presentation group is marked avoidable when the repeated slot still had at least one legal, not-yet-picked candidate with a different presentation group in its compatible candidate pool.`,
  );
  md.push("");
  md.push(`- Repeated presentation-group cells: **${repeatedPgCells.length}**`);
  md.push(
    `- Avoidable repeated presentation-group cells: **${avoidableRepeatedPgCells.length}**`,
  );
  md.push(
    `- Unavoidable repeated presentation-group cells: **${unavoidableRepeatedPgCells.length}**`,
  );
  md.push("");
  md.push("## Zero-output samples");
  md.push("");
  md.push(`- Lure zero: **${zeroLures.length}** (showing up to 50 in JSON)`);
  md.push(`- Fly zero: **${zeroFlies.length}**`);
  md.push("");
  md.push("## Worst thin-pool samples (lowest combined pick counts)");
  md.push("");
  if (worstThin.length === 0) {
    md.push(
      "_No cells with fewer than three picks or zero-output sides in this matrix run._",
    );
  } else {
    md.push("```json");
    md.push(JSON.stringify(worstThin.slice(0, 15), null, 2));
    md.push("```");
  }
  md.push("");
  md.push("## Thin classification distribution");
  md.push("");
  md.push("```json");
  md.push(JSON.stringify(report.classification_counts, null, 2));
  md.push("```");
  md.push("");
  md.push("## Notes");
  md.push("");
  md.push(
    "- Expect ~10 minutes on a typical laptop (≈30k cells × 2 dates × full `selectArchetypesForSide` × lure + fly).",
  );
  md.push(
    "- Regimes are driven by fixed How’s score proxies (30 / 50 / 75) for column/pace shaping only.",
  );
  md.push(
    "- Wind uses synthetic hourly series in UTC; `windy` uses 16 mph daylight mean so surface is blocked when seasonally legal.",
  );
  md.push(
    "- Candidate counts are `eligibleCandidateCount` per slot from `selectArchetypesForSide` traces (pre–weighted draw).",
  );
  md.push(
    "- Frog exposure counts rows that list both `frog_fly` and `hollow_body_frog` and checks finalists or chosen ids.",
  );
  md.push("");
  md.push(
    `Full machine-readable report: \`${JSON_PATH}\` (default: metrics + first ${CELLS_PREVIEW} cells as \`cells_preview\`; set \`TL_POOL_AUDIT_FULL_CELLS=1\` for complete \`cells\` + \`pool-health-report.cells.jsonl\`).`,
  );

  Deno.writeTextFileSync(MD_PATH, md.join("\n"));

  console.log(`Wrote ${JSON_PATH}`);
  console.log(`Wrote ${MD_PATH}`);
  console.log(
    `Cells: ${cells.length}; zero lure: ${zeroLures.length}; zero fly: ${zeroFlies.length}`,
  );
}

main();
