/**
 * Prototype audit: compare current authored row primary-id pools against a broader
 * geometry/catalog pool while still exercising the production selector.
 *
 * Usage:
 *   deno run -A scripts/audit-recommender-geometry-pool-comparison.ts
 */
import type { WaterClarity } from "../supabase/functions/_shared/recommenderEngine/contracts/input.ts";
import type {
  ArchetypeProfileV4,
  FlyArchetypeIdV4,
  LureArchetypeIdV4,
  SeasonalRowV4,
  TacticalPace,
} from "../supabase/functions/_shared/recommenderEngine/v4/contracts.ts";
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
  type RebuildSlotPick,
  type RebuildSlotSelectionTrace,
  selectArchetypesForSide,
} from "../supabase/functions/_shared/recommenderEngine/rebuild/selectSide.ts";
import type {
  FlyDailyConditionState,
  LureDailyConditionState,
} from "../supabase/functions/_shared/recommenderEngine/rebuild/conditionWindows.ts";
import { paceIndex } from "../supabase/functions/_shared/recommenderEngine/rebuild/constants.ts";

type Mode = "current_row_pool" | "geometry_catalog_pool";

const OUT_DIR = "docs/audits/recommender-rebuild";
const JSON_PATH = `${OUT_DIR}/geometry-pool-comparison.json`;
const MD_PATH = `${OUT_DIR}/geometry-pool-comparison.md`;
const CELLS_PREVIEW = 100;

const ALL_ROWS: readonly SeasonalRowV4[] = [
  ...LARGEMOUTH_BASS_SEASONAL_ROWS_V4,
  ...SMALLMOUTH_BASS_SEASONAL_ROWS_V4,
  ...NORTHERN_PIKE_SEASONAL_ROWS_V4,
  ...TROUT_SEASONAL_ROWS_V4,
];

const ALL_ARCHETYPES = [...LURE_ARCHETYPES_V4, ...FLY_ARCHETYPES_V4];
const CATALOG_BY_ID = new Map<string, ArchetypeProfileV4>(
  ALL_ARCHETYPES.map((a) => [a.id, a]),
);

const CLARITIES: readonly WaterClarity[] = ["clear", "stained", "dirty"];
const REGIMES: readonly DailyRegime[] = [
  "suppressive",
  "neutral",
  "aggressive",
];
const WIND_PROFILES: readonly WindBand[] = ["calm", "breezy", "windy"];
const MODES: readonly Mode[] = ["current_row_pool", "geometry_catalog_pool"];
const SOUTHERN_LMB_LAKE_REGIONS = new Set([
  "florida",
  "gulf_coast",
  "southeast_atlantic",
]);
const WIND_MPH: Record<WindBand, number> = {
  calm: 3,
  breezy: 9,
  windy: 16,
};
const GEOMETRY_ROW_CACHE = new WeakMap<SeasonalRowV4, SeasonalRowV4>();

type CellResult = {
  mode: Mode;
  species: SeasonalRowV4["species"];
  region_key: string;
  month: number;
  water_type: SeasonalRowV4["water_type"];
  clarity: WaterClarity;
  regime: DailyRegime;
  wind_surface_state: WindBand;
  surface_open: boolean;
  surface_blocked: boolean;
  target_profiles: { column: string; pace: string }[];
  lure_chosen_ids: string[];
  fly_chosen_ids: string[];
  lure_presentation_groups: string[];
  fly_presentation_groups: string[];
  lure_family_groups: string[];
  fly_family_groups: string[];
  lure_count: number;
  fly_count: number;
  fewer_than_3_lures: boolean;
  fewer_than_3_flies: boolean;
  zero_lure_side: boolean;
  zero_fly_side: boolean;
  repeated_presentation_groups: string[];
  avoidable_repeated_presentation_groups: string[];
  unavoidable_repeated_presentation_groups: string[];
  repeated_family_groups: string[];
  southern_lmb_warm_lake_surface_slot_context: boolean;
  frog_candidate: boolean;
  frog_finalist: boolean;
  frog_pick: boolean;
  surface_slot_open_topwater_picks: number;
  surface_slot_frog_picks: number;
  invalid_pick_samples: InvalidPickSample[];
  adjacent_repeat_lure_slot0: boolean | null;
  adjacent_repeat_fly_slot0: boolean | null;
  adjacent_repeat_lure_triple: boolean | null;
  adjacent_repeat_fly_triple: boolean | null;
};

type InvalidPickSample = {
  reason: string;
  side: "lure" | "fly";
  id?: string;
  profile?: { column: string; pace: string };
  species: SeasonalRowV4["species"];
  water_type: SeasonalRowV4["water_type"];
  row_key: string;
};

type ModeAcc = {
  cell_count: number;
  three_lure_cells: number;
  three_fly_cells: number;
  fewer_than_3_lure_cells: number;
  fewer_than_3_fly_cells: number;
  zero_lure_cells: number;
  zero_fly_cells: number;
  repeated_presentation_group_cells: number;
  avoidable_repeated_presentation_group_cells: number;
  unavoidable_repeated_presentation_group_cells: number;
  repeated_family_group_cells: number;
  adjacent_same_lure_top_cells: number;
  adjacent_same_fly_top_cells: number;
  adjacent_same_lure_triple_cells: number;
  adjacent_same_fly_triple_cells: number;
  southern_lmb_frog_surface_slot_context_cells: number;
  southern_lmb_frog_candidate_cells: number;
  southern_lmb_frog_finalist_cells: number;
  southern_lmb_frog_pick_cells: number;
  invalid_pick_cells: number;
  invalid_pick_samples: InvalidPickSample[];
  species_topwater_split: Record<
    string,
    { surface_slot_cells: number; open_water_picks: number; frog_picks: number }
  >;
};

type ModeMetrics = ReturnType<typeof accToMetrics>;

function emptyAcc(): ModeAcc {
  return {
    cell_count: 0,
    three_lure_cells: 0,
    three_fly_cells: 0,
    fewer_than_3_lure_cells: 0,
    fewer_than_3_fly_cells: 0,
    zero_lure_cells: 0,
    zero_fly_cells: 0,
    repeated_presentation_group_cells: 0,
    avoidable_repeated_presentation_group_cells: 0,
    unavoidable_repeated_presentation_group_cells: 0,
    repeated_family_group_cells: 0,
    adjacent_same_lure_top_cells: 0,
    adjacent_same_fly_top_cells: 0,
    adjacent_same_lure_triple_cells: 0,
    adjacent_same_fly_triple_cells: 0,
    southern_lmb_frog_surface_slot_context_cells: 0,
    southern_lmb_frog_candidate_cells: 0,
    southern_lmb_frog_finalist_cells: 0,
    southern_lmb_frog_pick_cells: 0,
    invalid_pick_cells: 0,
    invalid_pick_samples: [],
    species_topwater_split: {},
  };
}

function pct(part: number, whole: number): number {
  return whole ? Math.round((10000 * part) / whole) / 100 : 0;
}

function accToMetrics(acc: ModeAcc) {
  return {
    total_cells: acc.cell_count,
    pct_exactly_3_lure_picks: pct(acc.three_lure_cells, acc.cell_count),
    pct_exactly_3_fly_picks: pct(acc.three_fly_cells, acc.cell_count),
    zero_lure_cells: acc.zero_lure_cells,
    zero_fly_cells: acc.zero_fly_cells,
    fewer_than_3_lure_cells: acc.fewer_than_3_lure_cells,
    fewer_than_3_fly_cells: acc.fewer_than_3_fly_cells,
    repeated_presentation_group_cells: acc.repeated_presentation_group_cells,
    repeated_presentation_group_rate_pct: pct(
      acc.repeated_presentation_group_cells,
      acc.cell_count,
    ),
    avoidable_repeated_presentation_group_cells:
      acc.avoidable_repeated_presentation_group_cells,
    avoidable_repeated_presentation_group_rate_pct: pct(
      acc.avoidable_repeated_presentation_group_cells,
      acc.cell_count,
    ),
    unavoidable_repeated_presentation_group_cells:
      acc.unavoidable_repeated_presentation_group_cells,
    unavoidable_repeated_presentation_group_rate_pct: pct(
      acc.unavoidable_repeated_presentation_group_cells,
      acc.cell_count,
    ),
    repeated_family_group_cells: acc.repeated_family_group_cells,
    repeated_family_group_rate_pct: pct(
      acc.repeated_family_group_cells,
      acc.cell_count,
    ),
    adjacent_same_top_lure_rate_pct: pct(
      acc.adjacent_same_lure_top_cells,
      acc.cell_count,
    ),
    adjacent_same_top_fly_rate_pct: pct(
      acc.adjacent_same_fly_top_cells,
      acc.cell_count,
    ),
    adjacent_same_lure_triple_rate_pct: pct(
      acc.adjacent_same_lure_triple_cells,
      acc.cell_count,
    ),
    adjacent_same_fly_triple_rate_pct: pct(
      acc.adjacent_same_fly_triple_cells,
      acc.cell_count,
    ),
    southern_lmb_frog_surface_slot_context_cells:
      acc.southern_lmb_frog_surface_slot_context_cells,
    southern_lmb_frog_candidate_rate_when_surface_slot: pct(
      acc.southern_lmb_frog_candidate_cells,
      acc.southern_lmb_frog_surface_slot_context_cells,
    ),
    southern_lmb_frog_finalist_rate_when_surface_slot: pct(
      acc.southern_lmb_frog_finalist_cells,
      acc.southern_lmb_frog_surface_slot_context_cells,
    ),
    southern_lmb_frog_pick_rate_when_surface_slot: pct(
      acc.southern_lmb_frog_pick_cells,
      acc.southern_lmb_frog_surface_slot_context_cells,
    ),
    invalid_pick_cells: acc.invalid_pick_cells,
    invalid_pick_samples: acc.invalid_pick_samples.slice(0, 50),
    topwater_split_by_species: acc.species_topwater_split,
  };
}

function rowKey(row: SeasonalRowV4): string {
  return `${row.species}|${row.region_key}|${row.month}|${row.water_type}`;
}

function duplicateValues<T>(xs: readonly T[]): T[] {
  const counts = new Map<T, number>();
  for (const x of xs) counts.set(x, (counts.get(x) ?? 0) + 1);
  return [...counts.entries()].filter(([, n]) => n > 1).map(([x]) => x);
}

function unique<T>(xs: readonly T[]): T[] {
  return [...new Set(xs)];
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

function nextLocalDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const dt = new Date(Date.UTC(y!, m! - 1, d! + 1));
  return `${dt.getUTCFullYear()}-${
    String(dt.getUTCMonth() + 1).padStart(2, "0")
  }-${String(dt.getUTCDate()).padStart(2, "0")}`;
}

function regimeToHows0to100(r: DailyRegime): number {
  if (r === "suppressive") return 30;
  if (r === "neutral") return 50;
  return 75;
}

function geometryCatalogRow(row: SeasonalRowV4): SeasonalRowV4 {
  const cached = GEOMETRY_ROW_CACHE.get(row);
  if (cached != null) return cached;

  const geometryRow = {
    ...row,
    primary_lure_ids: LURE_ARCHETYPES_V4.filter((a) =>
      a.species_allowed.includes(row.species) &&
      a.water_types_allowed.includes(row.water_type)
    ).map((a) => a.id as LureArchetypeIdV4),
    primary_fly_ids: FLY_ARCHETYPES_V4.filter((a) =>
      a.species_allowed.includes(row.species) &&
      a.water_types_allowed.includes(row.water_type)
    ).map((a) => a.id as FlyArchetypeIdV4),
  };
  GEOMETRY_ROW_CACHE.set(row, geometryRow);
  return geometryRow;
}

function rowForMode(row: SeasonalRowV4, mode: Mode): SeasonalRowV4 {
  return mode === "current_row_pool" ? row : geometryCatalogRow(row);
}

function presentationRepeatAvoidability(
  traces: readonly RebuildSlotSelectionTrace[],
) {
  const seenGroups = new Set<string>();
  const pickedIds = new Set<string>();
  const avoidable: string[] = [];
  const unavoidable: string[] = [];

  for (const trace of traces) {
    if (trace.chosenId == null) continue;
    const chosen = CATALOG_BY_ID.get(trace.chosenId);
    if (chosen == null) continue;
    const group = chosen.presentation_group;
    if (seenGroups.has(group)) {
      const hadOtherGroup = trace.candidateScores.some((candidate) => {
        if (pickedIds.has(candidate.id)) return false;
        const candidateProfile = CATALOG_BY_ID.get(candidate.id);
        return candidateProfile != null &&
          candidateProfile.presentation_group !== group;
      });
      if (hadOtherGroup) avoidable.push(group);
      else unavoidable.push(group);
    }
    seenGroups.add(group);
    pickedIds.add(trace.chosenId);
  }

  return { avoidable: unique(avoidable), unavoidable: unique(unavoidable) };
}

function paceCompatible(
  profilePace: TacticalPace,
  archetype: ArchetypeProfileV4,
) {
  return archetype.primary_pace === profilePace ||
    archetype.secondary_pace === profilePace ||
    Math.abs(paceIndex(archetype.primary_pace) - paceIndex(profilePace)) ===
      1 ||
    (archetype.secondary_pace != null &&
      Math.abs(paceIndex(archetype.secondary_pace) - paceIndex(profilePace)) ===
        1);
}

function validatePicks(args: {
  row: SeasonalRowV4;
  side: "lure" | "fly";
  picks: readonly RebuildSlotPick[];
  surfaceBlocked: boolean;
}): InvalidPickSample[] {
  const { row, side, picks, surfaceBlocked } = args;
  const samples: InvalidPickSample[] = [];
  const ids = picks.map((p) => p.archetype.id);
  const excluded = new Set(
    side === "lure"
      ? (row.excluded_lure_ids ?? [])
      : (row.excluded_fly_ids ?? []),
  );

  if (new Set(ids).size !== ids.length) {
    samples.push({
      reason: "duplicate_archetype_id",
      side,
      species: row.species,
      water_type: row.water_type,
      row_key: rowKey(row),
    });
  }

  for (const pick of picks) {
    const { archetype, profile } = pick;
    const base = {
      side,
      id: archetype.id,
      profile: { column: profile.column, pace: profile.pace },
      species: row.species,
      water_type: row.water_type,
      row_key: rowKey(row),
    };
    if (!archetype.species_allowed.includes(row.species)) {
      samples.push({ ...base, reason: "species_not_allowed" });
    }
    if (!archetype.water_types_allowed.includes(row.water_type)) {
      samples.push({ ...base, reason: "water_type_not_allowed" });
    }
    if (archetype.column !== profile.column) {
      samples.push({ ...base, reason: "column_mismatch" });
    }
    if (!paceCompatible(profile.pace, archetype)) {
      samples.push({ ...base, reason: "pace_not_compatible" });
    }
    if (surfaceBlocked && archetype.is_surface) {
      samples.push({ ...base, reason: "surface_pick_when_blocked" });
    }
    if (excluded.has(archetype.id)) {
      samples.push({ ...base, reason: "row_exclusion_ignored" });
    }
  }

  return samples;
}

function runCell(args: {
  baseRow: SeasonalRowV4;
  mode: Mode;
  clarity: WaterClarity;
  regime: DailyRegime;
  windBand: WindBand;
  localDate: string;
}): Omit<
  CellResult,
  | "adjacent_repeat_lure_slot0"
  | "adjacent_repeat_fly_slot0"
  | "adjacent_repeat_lure_triple"
  | "adjacent_repeat_fly_triple"
> {
  const row = rowForMode(args.baseRow, args.mode);
  const env_data = envForWind(args.localDate, args.windBand);
  const daylightWindMph = meanDaylightWindMph({
    env_data,
    local_date: args.localDate,
    local_timezone: "UTC",
  });
  const surfaceBlocked = computeSurfaceBlocked({ row, daylightWindMph });
  const profiles = buildTargetProfiles({
    row,
    regime: args.regime,
    surfaceBlocked,
  });
  const surfaceAllowedToday = row.column_range.includes("surface") &&
    row.surface_seasonally_possible &&
    !surfaceBlocked;
  const surfaceSlotPresent = profiles.some((p) => p.column === "surface");
  const wind_band = windBandFromDaylightWindMph(daylightWindMph);
  const seedBase = `audit|${
    regimeToHows0to100(args.regime)
  }|${args.localDate}|${row.region_key}|${row.species}|${row.water_type}|${args.clarity}|${args.windBand}`;

  const lureConditionState: LureDailyConditionState = {
    regime: args.regime,
    water_clarity: args.clarity,
    surface_allowed_today: surfaceAllowedToday,
    surface_slot_present: surfaceSlotPresent,
    daylight_wind_mph: daylightWindMph,
    wind_band,
  };
  const flyConditionState: FlyDailyConditionState = {
    regime: args.regime,
    surface_allowed_today: surfaceAllowedToday,
    surface_slot_present: surfaceSlotPresent,
    daylight_wind_mph: daylightWindMph,
    wind_band,
    species: row.species,
    context: row.water_type,
    month: row.month,
  };

  const lureTraces: RebuildSlotSelectionTrace[] = [];
  const flyTraces: RebuildSlotSelectionTrace[] = [];
  const lurePicks = selectArchetypesForSide({
    side: "lure",
    row,
    species: row.species,
    context: row.water_type,
    water_clarity: args.clarity,
    profiles,
    surfaceBlocked,
    seedBase,
    currentLocalDate: args.localDate,
    lureConditionState,
    onSlotTrace: (trace) => lureTraces.push(trace),
  });
  const flyPicks = selectArchetypesForSide({
    side: "fly",
    row,
    species: row.species,
    context: row.water_type,
    water_clarity: args.clarity,
    profiles,
    surfaceBlocked,
    seedBase,
    currentLocalDate: args.localDate,
    flyConditionState,
    onSlotTrace: (trace) => flyTraces.push(trace),
  });

  const lureGroups = lurePicks.map((p) => p.archetype.presentation_group);
  const flyGroups = flyPicks.map((p) => p.archetype.presentation_group);
  const lureFamilies = lurePicks.map((p) => p.archetype.family_group);
  const flyFamilies = flyPicks.map((p) => p.archetype.family_group);
  const lureAvoidability = presentationRepeatAvoidability(lureTraces);
  const flyAvoidability = presentationRepeatAvoidability(flyTraces);
  const surfacePicks = [...lurePicks, ...flyPicks].filter((p) =>
    p.archetype.is_surface
  );
  const openTopwaterPicks = surfaceSlotPresent
    ? surfacePicks.filter((p) =>
      p.archetype.presentation_group === "topwater_open" ||
      p.archetype.presentation_group === "surface_fly_popper_slider" ||
      p.archetype.presentation_group === "surface_fly_slider" ||
      p.archetype.presentation_group === "surface_fly_gurgler"
    ).length
    : 0;
  const frogPicks = surfaceSlotPresent
    ? surfacePicks.filter((p) =>
      p.archetype.id === "hollow_body_frog" || p.archetype.id === "frog_fly"
    ).length
    : 0;
  const southernFrogContext = row.species === "largemouth_bass" &&
    SOUTHERN_LMB_LAKE_REGIONS.has(row.region_key) &&
    row.water_type === "freshwater_lake_pond" &&
    row.month >= 3 &&
    row.month <= 10 &&
    row.surface_seasonally_possible &&
    surfaceAllowedToday &&
    surfaceSlotPresent;
  const frogCandidate = southernFrogContext &&
    (lureTraces.some((t) =>
      t.profile.column === "surface" &&
      t.candidateScores.some((score) => score.id === "hollow_body_frog")
    ) ||
      flyTraces.some((t) =>
        t.profile.column === "surface" &&
        t.candidateScores.some((score) => score.id === "frog_fly")
      ));
  const frogFinalist = southernFrogContext &&
    (lureTraces.some((t) =>
      t.profile.column === "surface" &&
      t.finalistIds.includes("hollow_body_frog")
    ) ||
      flyTraces.some((t) =>
        t.profile.column === "surface" && t.finalistIds.includes("frog_fly")
      ));
  const frogPick = southernFrogContext &&
    (lurePicks.some((p) => p.archetype.id === "hollow_body_frog") ||
      flyPicks.some((p) => p.archetype.id === "frog_fly"));
  const invalidPickSamples = [
    ...validatePicks({ row, side: "lure", picks: lurePicks, surfaceBlocked }),
    ...validatePicks({ row, side: "fly", picks: flyPicks, surfaceBlocked }),
  ];

  return {
    mode: args.mode,
    species: row.species,
    region_key: row.region_key,
    month: row.month,
    water_type: row.water_type,
    clarity: args.clarity,
    regime: args.regime,
    wind_surface_state: args.windBand,
    surface_open: surfaceAllowedToday,
    surface_blocked: surfaceBlocked,
    target_profiles: profiles.map((p) => ({ column: p.column, pace: p.pace })),
    lure_chosen_ids: lurePicks.map((p) => p.archetype.id),
    fly_chosen_ids: flyPicks.map((p) => p.archetype.id),
    lure_presentation_groups: lureGroups,
    fly_presentation_groups: flyGroups,
    lure_family_groups: lureFamilies,
    fly_family_groups: flyFamilies,
    lure_count: lurePicks.length,
    fly_count: flyPicks.length,
    fewer_than_3_lures: lurePicks.length < 3,
    fewer_than_3_flies: flyPicks.length < 3,
    zero_lure_side: lurePicks.length === 0,
    zero_fly_side: flyPicks.length === 0,
    repeated_presentation_groups: unique([
      ...duplicateValues(lureGroups),
      ...duplicateValues(flyGroups),
    ]),
    avoidable_repeated_presentation_groups: unique([
      ...lureAvoidability.avoidable,
      ...flyAvoidability.avoidable,
    ]),
    unavoidable_repeated_presentation_groups: unique([
      ...lureAvoidability.unavoidable,
      ...flyAvoidability.unavoidable,
    ]),
    repeated_family_groups: unique([
      ...duplicateValues(lureFamilies),
      ...duplicateValues(flyFamilies),
    ]),
    southern_lmb_warm_lake_surface_slot_context: southernFrogContext,
    frog_candidate: frogCandidate,
    frog_finalist: frogFinalist,
    frog_pick: frogPick,
    surface_slot_open_topwater_picks: openTopwaterPicks,
    surface_slot_frog_picks: frogPicks,
    invalid_pick_samples: invalidPickSamples,
  };
}

function accumulate(acc: ModeAcc, cell: CellResult) {
  acc.cell_count++;
  if (cell.lure_count === 3) acc.three_lure_cells++;
  if (cell.fly_count === 3) acc.three_fly_cells++;
  if (cell.fewer_than_3_lures) acc.fewer_than_3_lure_cells++;
  if (cell.fewer_than_3_flies) acc.fewer_than_3_fly_cells++;
  if (cell.zero_lure_side) acc.zero_lure_cells++;
  if (cell.zero_fly_side) acc.zero_fly_cells++;
  if (cell.repeated_presentation_groups.length > 0) {
    acc.repeated_presentation_group_cells++;
  }
  if (cell.avoidable_repeated_presentation_groups.length > 0) {
    acc.avoidable_repeated_presentation_group_cells++;
  }
  if (cell.unavoidable_repeated_presentation_groups.length > 0) {
    acc.unavoidable_repeated_presentation_group_cells++;
  }
  if (cell.repeated_family_groups.length > 0) acc.repeated_family_group_cells++;
  if (cell.adjacent_repeat_lure_slot0 === true) {
    acc.adjacent_same_lure_top_cells++;
  }
  if (cell.adjacent_repeat_fly_slot0 === true) {
    acc.adjacent_same_fly_top_cells++;
  }
  if (cell.adjacent_repeat_lure_triple === true) {
    acc.adjacent_same_lure_triple_cells++;
  }
  if (cell.adjacent_repeat_fly_triple === true) {
    acc.adjacent_same_fly_triple_cells++;
  }
  if (cell.southern_lmb_warm_lake_surface_slot_context) {
    acc.southern_lmb_frog_surface_slot_context_cells++;
    if (cell.frog_candidate) acc.southern_lmb_frog_candidate_cells++;
    if (cell.frog_finalist) acc.southern_lmb_frog_finalist_cells++;
    if (cell.frog_pick) acc.southern_lmb_frog_pick_cells++;
  }
  if (cell.target_profiles.some((p) => p.column === "surface")) {
    const split = acc.species_topwater_split[cell.species] ?? {
      surface_slot_cells: 0,
      open_water_picks: 0,
      frog_picks: 0,
    };
    split.surface_slot_cells++;
    split.open_water_picks += cell.surface_slot_open_topwater_picks;
    split.frog_picks += cell.surface_slot_frog_picks;
    acc.species_topwater_split[cell.species] = split;
  }
  if (cell.invalid_pick_samples.length > 0) {
    acc.invalid_pick_cells++;
    if (acc.invalid_pick_samples.length < 50) {
      acc.invalid_pick_samples.push(...cell.invalid_pick_samples);
      acc.invalid_pick_samples = acc.invalid_pick_samples.slice(0, 50);
    }
  }
}

function worstBuckets(
  metricsByBucket: Record<Mode, Record<string, ModeMetrics>>,
  field: keyof Pick<
    ModeMetrics,
    | "repeated_presentation_group_rate_pct"
    | "adjacent_same_top_lure_rate_pct"
    | "adjacent_same_top_fly_rate_pct"
  >,
) {
  const out: Record<Mode, { bucket: string; value: number; cells: number }[]> =
    {
      current_row_pool: [],
      geometry_catalog_pool: [],
    };
  for (const mode of MODES) {
    out[mode] = Object.entries(metricsByBucket[mode])
      .map(([bucket, metrics]) => ({
        bucket,
        value: metrics[field] as number,
        cells: metrics.total_cells,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 12);
  }
  return out;
}

function metricDelta(
  current: ModeMetrics,
  geometry: ModeMetrics,
  field: keyof ModeMetrics,
): number {
  return Math.round(
    100 * ((geometry[field] as number) - (current[field] as number)),
  ) /
    100;
}

function yesNo(condition: boolean): "Yes" | "No" {
  return condition ? "Yes" : "No";
}

function main() {
  const generated_at = new Date().toISOString();
  const unscopedRows = ALL_ROWS.filter((r) =>
    r.state_code == null || String(r.state_code).trim() === ""
  );
  const modeAcc: Record<Mode, ModeAcc> = {
    current_row_pool: emptyAcc(),
    geometry_catalog_pool: emptyAcc(),
  };
  const bucketAcc: Record<Mode, Record<string, ModeAcc>> = {
    current_row_pool: {},
    geometry_catalog_pool: {},
  };
  const cellsPreview: CellResult[] = [];

  for (const [rowIndex, baseRow] of unscopedRows.entries()) {
    if (rowIndex % 100 === 0) {
      console.error(
        `geometry-pool audit progress: row ${
          rowIndex + 1
        }/${unscopedRows.length}`,
      );
    }
    const mm = String(baseRow.month).padStart(2, "0");
    const localDate = `2026-${mm}-15`;
    const nextDate = nextLocalDate(localDate);

    for (const clarity of CLARITIES) {
      for (const regime of REGIMES) {
        for (const windBand of WIND_PROFILES) {
          for (const mode of MODES) {
            const base = runCell({
              baseRow,
              mode,
              clarity,
              regime,
              windBand,
              localDate,
            });
            const next = runCell({
              baseRow,
              mode,
              clarity,
              regime,
              windBand,
              localDate: nextDate,
            });
            const cell: CellResult = {
              ...base,
              adjacent_repeat_lure_slot0: base.lure_chosen_ids[0] != null &&
                  next.lure_chosen_ids[0] != null
                ? base.lure_chosen_ids[0] === next.lure_chosen_ids[0]
                : null,
              adjacent_repeat_fly_slot0: base.fly_chosen_ids[0] != null &&
                  next.fly_chosen_ids[0] != null
                ? base.fly_chosen_ids[0] === next.fly_chosen_ids[0]
                : null,
              adjacent_repeat_lure_triple: base.lure_chosen_ids.length === 3 &&
                  next.lure_chosen_ids.length === 3
                ? base.lure_chosen_ids.join("|") ===
                  next.lure_chosen_ids.join("|")
                : null,
              adjacent_repeat_fly_triple: base.fly_chosen_ids.length === 3 &&
                  next.fly_chosen_ids.length === 3
                ? base.fly_chosen_ids.join("|") ===
                  next.fly_chosen_ids.join("|")
                : null,
            };
            accumulate(modeAcc[mode], cell);

            const bucket =
              `${cell.species}|${cell.region_key}|${cell.water_type}`;
            bucketAcc[mode][bucket] ??= emptyAcc();
            accumulate(bucketAcc[mode][bucket], cell);

            if (cellsPreview.length < CELLS_PREVIEW) cellsPreview.push(cell);
          }
        }
      }
    }
  }

  const metrics: Record<Mode, ModeMetrics> = {
    current_row_pool: accToMetrics(modeAcc.current_row_pool),
    geometry_catalog_pool: accToMetrics(modeAcc.geometry_catalog_pool),
  };
  const metricsByBucket: Record<Mode, Record<string, ModeMetrics>> = {
    current_row_pool: {},
    geometry_catalog_pool: {},
  };
  for (const mode of MODES) {
    for (const [bucket, acc] of Object.entries(bucketAcc[mode])) {
      metricsByBucket[mode][bucket] = accToMetrics(acc);
    }
  }

  const report = {
    generated_at,
    matrix: {
      rows_scanned: unscopedRows.length,
      clarities: CLARITIES.length,
      regimes: REGIMES.length,
      wind_profiles: WIND_PROFILES.length,
      total_cells_per_mode: metrics.current_row_pool.total_cells,
    },
    modes: metrics,
    deltas_geometry_minus_current: {
      repeated_presentation_group_rate_pct: metricDelta(
        metrics.current_row_pool,
        metrics.geometry_catalog_pool,
        "repeated_presentation_group_rate_pct",
      ),
      avoidable_repeated_presentation_group_rate_pct: metricDelta(
        metrics.current_row_pool,
        metrics.geometry_catalog_pool,
        "avoidable_repeated_presentation_group_rate_pct",
      ),
      repeated_family_group_rate_pct: metricDelta(
        metrics.current_row_pool,
        metrics.geometry_catalog_pool,
        "repeated_family_group_rate_pct",
      ),
      adjacent_same_top_lure_rate_pct: metricDelta(
        metrics.current_row_pool,
        metrics.geometry_catalog_pool,
        "adjacent_same_top_lure_rate_pct",
      ),
      adjacent_same_top_fly_rate_pct: metricDelta(
        metrics.current_row_pool,
        metrics.geometry_catalog_pool,
        "adjacent_same_top_fly_rate_pct",
      ),
      adjacent_same_lure_triple_rate_pct: metricDelta(
        metrics.current_row_pool,
        metrics.geometry_catalog_pool,
        "adjacent_same_lure_triple_rate_pct",
      ),
      adjacent_same_fly_triple_rate_pct: metricDelta(
        metrics.current_row_pool,
        metrics.geometry_catalog_pool,
        "adjacent_same_fly_triple_rate_pct",
      ),
      southern_lmb_frog_pick_rate_when_surface_slot: metricDelta(
        metrics.current_row_pool,
        metrics.geometry_catalog_pool,
        "southern_lmb_frog_pick_rate_when_surface_slot",
      ),
    },
    worst_buckets: {
      repeated_presentation_group_rate: worstBuckets(
        metricsByBucket,
        "repeated_presentation_group_rate_pct",
      ),
      adjacent_same_top_lure_rate: worstBuckets(
        metricsByBucket,
        "adjacent_same_top_lure_rate_pct",
      ),
      adjacent_same_top_fly_rate: worstBuckets(
        metricsByBucket,
        "adjacent_same_top_fly_rate_pct",
      ),
    },
    metrics_by_species_region_water: metricsByBucket,
    cells_preview: cellsPreview,
  };

  Deno.mkdirSync(OUT_DIR, { recursive: true });
  Deno.writeTextFileSync(JSON_PATH, JSON.stringify(report, null, 2));

  const cur = metrics.current_row_pool;
  const geo = metrics.geometry_catalog_pool;
  const geometrySafe = geo.invalid_pick_cells === 0;
  const materiallyReducesPg = geo.repeated_presentation_group_rate_pct <=
    cur.repeated_presentation_group_rate_pct - 5;
  const materiallyReducesFamily = geo.repeated_family_group_rate_pct <=
    cur.repeated_family_group_rate_pct - 5;
  const improvesAdjacent = geo.adjacent_same_top_lure_rate_pct <
      cur.adjacent_same_top_lure_rate_pct ||
    geo.adjacent_same_top_fly_rate_pct < cur.adjacent_same_top_fly_rate_pct;
  const frogDominance = geo.southern_lmb_frog_pick_rate_when_surface_slot > 80;

  const md: string[] = [];
  md.push("# Recommender rebuild — geometry pool comparison");
  md.push("");
  md.push(`Generated: **${generated_at}**`);
  md.push("");
  md.push("## Matrix");
  md.push("");
  md.push(`- Seasonal rows (unscoped): ${report.matrix.rows_scanned}`);
  md.push(
    `- Total evaluated cells per mode: **${report.matrix.total_cells_per_mode}**`,
  );
  md.push(
    `- Dimensions: ${report.matrix.clarities} clarities × ${report.matrix.regimes} regimes × ${report.matrix.wind_profiles} wind/surface bands`,
  );
  md.push(
    "- `current_row_pool`: authored `primary_lure_ids` / `primary_fly_ids`.",
  );
  md.push(
    "- `geometry_catalog_pool`: catalog-wide species/water IDs, preserving row geometry, forage, surface, and exclusions.",
  );
  md.push("");
  md.push("## Side-by-side metrics");
  md.push("");
  md.push("| Metric | current_row_pool | geometry_catalog_pool | Delta |");
  md.push("| --- | ---: | ---: | ---: |");
  const row = (label: string, field: keyof ModeMetrics, suffix = "") => {
    md.push(
      `| ${label} | ${cur[field]}${suffix} | ${geo[field]}${suffix} | ${
        metricDelta(cur, geo, field)
      }${suffix} |`,
    );
  };
  row("Total cells", "total_cells");
  row("% exactly 3 lure picks", "pct_exactly_3_lure_picks", "%");
  row("% exactly 3 fly picks", "pct_exactly_3_fly_picks", "%");
  row("Zero-output lure cells", "zero_lure_cells");
  row("Zero-output fly cells", "zero_fly_cells");
  row("Fewer-than-3 lure cells", "fewer_than_3_lure_cells");
  row("Fewer-than-3 fly cells", "fewer_than_3_fly_cells");
  row(
    "Repeated presentation-group rate",
    "repeated_presentation_group_rate_pct",
    "%",
  );
  row(
    "Avoidable repeated presentation-group rate",
    "avoidable_repeated_presentation_group_rate_pct",
    "%",
  );
  row(
    "Unavoidable repeated presentation-group rate",
    "unavoidable_repeated_presentation_group_rate_pct",
    "%",
  );
  row("Repeated family-group rate", "repeated_family_group_rate_pct", "%");
  row(
    "Adjacent-date same top lure rate",
    "adjacent_same_top_lure_rate_pct",
    "%",
  );
  row("Adjacent-date same top fly rate", "adjacent_same_top_fly_rate_pct", "%");
  row(
    "Adjacent-date same lure triple rate",
    "adjacent_same_lure_triple_rate_pct",
    "%",
  );
  row(
    "Adjacent-date same fly triple rate",
    "adjacent_same_fly_triple_rate_pct",
    "%",
  );
  row(
    "Southern LMB frog candidate rate when surface slot exists",
    "southern_lmb_frog_candidate_rate_when_surface_slot",
    "%",
  );
  row(
    "Southern LMB frog finalist rate when surface slot exists",
    "southern_lmb_frog_finalist_rate_when_surface_slot",
    "%",
  );
  row(
    "Southern LMB frog pick rate when surface slot exists",
    "southern_lmb_frog_pick_rate_when_surface_slot",
    "%",
  );
  row("Invalid-pick cells", "invalid_pick_cells");
  md.push("");
  md.push("## Topwater split by species");
  md.push("");
  md.push(
    "| Mode | Species | Surface-slot cells | Open-water surface picks | Frog picks |",
  );
  md.push("| --- | --- | ---: | ---: | ---: |");
  for (const mode of MODES) {
    for (
      const [species, split] of Object.entries(
        metrics[mode].topwater_split_by_species,
      )
    ) {
      md.push(
        `| ${mode} | ${species} | ${split.surface_slot_cells} | ${split.open_water_picks} | ${split.frog_picks} |`,
      );
    }
  }
  md.push("");
  md.push("## Worst buckets");
  md.push("");
  md.push("### Repeated Presentation-Group Rate");
  md.push("");
  for (const mode of MODES) {
    md.push(`**${mode}**`);
    for (
      const item of report.worst_buckets.repeated_presentation_group_rate[mode]
    ) {
      md.push(`- ${item.bucket}: ${item.value}% (${item.cells} cells)`);
    }
    md.push("");
  }
  md.push("### Adjacent Same-Top Lure Rate");
  md.push("");
  for (const mode of MODES) {
    md.push(`**${mode}**`);
    for (const item of report.worst_buckets.adjacent_same_top_lure_rate[mode]) {
      md.push(`- ${item.bucket}: ${item.value}% (${item.cells} cells)`);
    }
    md.push("");
  }
  md.push("### Adjacent Same-Top Fly Rate");
  md.push("");
  for (const mode of MODES) {
    md.push(`**${mode}**`);
    for (const item of report.worst_buckets.adjacent_same_top_fly_rate[mode]) {
      md.push(`- ${item.bucket}: ${item.value}% (${item.cells} cells)`);
    }
    md.push("");
  }
  md.push("## Safety");
  md.push("");
  md.push(`- Geometry mode invalid-pick cells: **${geo.invalid_pick_cells}**`);
  md.push(
    `- Geometry mode considered safe by hard validation: **${
      yesNo(geometrySafe)
    }**`,
  );
  if (geo.invalid_pick_samples.length > 0) {
    md.push("");
    md.push("```json");
    md.push(JSON.stringify(geo.invalid_pick_samples, null, 2));
    md.push("```");
  }
  md.push("");
  md.push("## Direct analysis");
  md.push("");
  md.push(
    `- Does geometry_catalog_pool materially reduce repeated presentation_group rate? **${
      yesNo(materiallyReducesPg)
    }**. Current ${cur.repeated_presentation_group_rate_pct}%, geometry ${geo.repeated_presentation_group_rate_pct}%.`,
  );
  md.push(
    `- Does it materially reduce repeated family_group rate? **${
      yesNo(materiallyReducesFamily)
    }**. Current ${cur.repeated_family_group_rate_pct}%, geometry ${geo.repeated_family_group_rate_pct}%.`,
  );
  md.push(
    `- Does it improve adjacent-date variety? **${
      yesNo(improvesAdjacent)
    }**. Same-top lure ${cur.adjacent_same_top_lure_rate_pct}% -> ${geo.adjacent_same_top_lure_rate_pct}%; same-top fly ${cur.adjacent_same_top_fly_rate_pct}% -> ${geo.adjacent_same_top_fly_rate_pct}%.`,
  );
  md.push(
    `- Does it increase frog/topwater variety for southern LMB without making frogs absurdly dominant? **${
      yesNo(
        geo.southern_lmb_frog_pick_rate_when_surface_slot >
            cur.southern_lmb_frog_pick_rate_when_surface_slot && !frogDominance,
      )
    }**. Frog pick rate ${cur.southern_lmb_frog_pick_rate_when_surface_slot}% -> ${geo.southern_lmb_frog_pick_rate_when_surface_slot}%.`,
  );
  md.push(
    `- Does it create any obviously bad recommendations? **${
      yesNo(!geometrySafe)
    }** by automated hard validation.`,
  );
  md.push(
    `- Are there species/regions/water types where geometry mode is clearly better? Review worst-bucket deltas above; lower geometry rates indicate likely improvement.`,
  );
  md.push(
    `- Are there species/regions/water types where current row pools are safer? Current row pools are safer where geometry expands into valid-but-regionally-questionable catalog items; this script flags hard invalidity only, not biological taste.`,
  );
  md.push(
    `- Should production move toward this architecture, or manually repair row menus? **Recommendation:** use a staged geometry-pool implementation only after a human review layer for regional exclusions/boosts. The prototype preserves hard validity, but exact row menus still encode regional taste that catalog-wide filtering cannot see.`,
  );
  md.push("");
  md.push(`Full machine-readable report: \`${JSON_PATH}\`.`);

  Deno.writeTextFileSync(MD_PATH, md.join("\n") + "\n");
  console.log(`Wrote ${JSON_PATH}`);
  console.log(`Wrote ${MD_PATH}`);
  console.log(
    `Cells/mode: ${metrics.current_row_pool.total_cells}; geometry invalid-pick cells: ${metrics.geometry_catalog_pool.invalid_pick_cells}`,
  );
}

main();
