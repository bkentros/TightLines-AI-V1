/**
 * Prototype audit: explain why presentation-group repeats remain in the rebuild
 * selector without changing production behavior.
 *
 * Usage:
 *   deno run -A scripts/audit-recommender-repeat-cause-analysis.ts
 */
import type { WaterClarity } from "../supabase/functions/_shared/recommenderEngine/contracts/input.ts";
import type {
  ArchetypeProfileV4,
  FlyArchetypeIdV4,
  LureArchetypeIdV4,
  SeasonalRowV4,
  TacticalColumn,
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
  type TargetProfile,
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
import { paceIndex } from "../supabase/functions/_shared/recommenderEngine/rebuild/constants.ts";

type Mode = "current_row_pool" | "geometry_catalog_pool";
type Side = "lure" | "fly";
type RepeatCause =
  | "single_group_lane"
  | "profile_geometry_repeat"
  | "catalog_distribution_limit"
  | "row_menu_limit"
  | "selector_choice"
  | "unknown_needs_review";

const OUT_DIR = "docs/audits/recommender-rebuild";
const JSON_PATH = `${OUT_DIR}/repeat-cause-analysis.json`;
const MD_PATH = `${OUT_DIR}/repeat-cause-analysis.md`;
const CELLS_PREVIEW = 80;
const CAUSE_SAMPLES_PER_MODE = 12;

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
const COLUMNS: readonly TacticalColumn[] = [
  "bottom",
  "mid",
  "upper",
  "surface",
];
const PACES: readonly TacticalPace[] = ["slow", "medium", "fast"];
const WIND_MPH: Record<WindBand, number> = {
  calm: 3,
  breezy: 9,
  windy: 16,
};
const GEOMETRY_ROW_CACHE = new WeakMap<SeasonalRowV4, SeasonalRowV4>();

type RunCell = {
  mode: Mode;
  row: SeasonalRowV4;
  clarity: WaterClarity;
  regime: DailyRegime;
  windBand: WindBand;
  surfaceBlocked: boolean;
  surfaceOpen: boolean;
  profiles: TargetProfile[];
  lureTraces: RebuildSlotSelectionTrace[];
  flyTraces: RebuildSlotSelectionTrace[];
  lureChosenIds: string[];
  flyChosenIds: string[];
  lureGroups: string[];
  flyGroups: string[];
  repeated: boolean;
  duplicateLaneCount: number;
  duplicateColumnCount: number;
};

type CauseRecord = {
  mode: Mode;
  cause: RepeatCause;
  side: Side;
  species: SeasonalRowV4["species"];
  region_key: string;
  water_type: SeasonalRowV4["water_type"];
  month: number;
  clarity: WaterClarity;
  regime: DailyRegime;
  wind_surface_state: WindBand;
  slot: number;
  chosen_id: string;
  presentation_group: string;
  profile: TargetProfile;
  current_lane_group_count: number;
  geometry_lane_group_count: number;
  profile_duplicate_lanes: number;
  profile_duplicate_columns: number;
};

type CauseAcc = {
  total_repeated_cells: number;
  total_repeat_slots: number;
  cause_counts: Record<RepeatCause, number>;
  repeated_cells_by_cause: Record<RepeatCause, number>;
  samples: Partial<Record<RepeatCause, CauseRecord[]>>;
};

type BucketAcc = CauseAcc & {
  cells: number;
};

type LaneAcc = {
  observations: number;
  current_lure_candidates: number;
  current_lure_presentation_groups: number;
  current_lure_family_groups: number;
  current_fly_candidates: number;
  current_fly_presentation_groups: number;
  current_fly_family_groups: number;
  geometry_lure_candidates: number;
  geometry_lure_presentation_groups: number;
  geometry_lure_family_groups: number;
  geometry_fly_candidates: number;
  geometry_fly_presentation_groups: number;
  geometry_fly_family_groups: number;
  meaningful_geometry_expansions: number;
};

type ProfileAcc = {
  observations: number;
  duplicate_lane_observations: number;
  duplicate_column_observations: number;
  capable_current_lure_macro3: number;
  capable_current_fly_macro3: number;
  capable_geometry_lure_macro3: number;
  capable_geometry_fly_macro3: number;
  repeated_current_cells: number;
  repeated_geometry_cells: number;
};

type ComparisonAcc = {
  both_repeated_cells: number;
  current_only_repeated_cells: number;
  geometry_only_repeated_cells: number;
  neither_repeated_cells: number;
  current_repeated_with_duplicate_lanes: number;
  current_repeated_with_duplicate_columns: number;
  geometry_repeated_with_duplicate_lanes: number;
  geometry_repeated_with_duplicate_columns: number;
};

function emptyCauseAcc(): CauseAcc {
  return {
    total_repeated_cells: 0,
    total_repeat_slots: 0,
    cause_counts: {
      single_group_lane: 0,
      profile_geometry_repeat: 0,
      catalog_distribution_limit: 0,
      row_menu_limit: 0,
      selector_choice: 0,
      unknown_needs_review: 0,
    },
    repeated_cells_by_cause: {
      single_group_lane: 0,
      profile_geometry_repeat: 0,
      catalog_distribution_limit: 0,
      row_menu_limit: 0,
      selector_choice: 0,
      unknown_needs_review: 0,
    },
    samples: {},
  };
}

function emptyBucketAcc(): BucketAcc {
  return { ...emptyCauseAcc(), cells: 0 };
}

function emptyLaneAcc(): LaneAcc {
  return {
    observations: 0,
    current_lure_candidates: 0,
    current_lure_presentation_groups: 0,
    current_lure_family_groups: 0,
    current_fly_candidates: 0,
    current_fly_presentation_groups: 0,
    current_fly_family_groups: 0,
    geometry_lure_candidates: 0,
    geometry_lure_presentation_groups: 0,
    geometry_lure_family_groups: 0,
    geometry_fly_candidates: 0,
    geometry_fly_presentation_groups: 0,
    geometry_fly_family_groups: 0,
    meaningful_geometry_expansions: 0,
  };
}

function emptyProfileAcc(): ProfileAcc {
  return {
    observations: 0,
    duplicate_lane_observations: 0,
    duplicate_column_observations: 0,
    capable_current_lure_macro3: 0,
    capable_current_fly_macro3: 0,
    capable_geometry_lure_macro3: 0,
    capable_geometry_fly_macro3: 0,
    repeated_current_cells: 0,
    repeated_geometry_cells: 0,
  };
}

function emptyComparisonAcc(): ComparisonAcc {
  return {
    both_repeated_cells: 0,
    current_only_repeated_cells: 0,
    geometry_only_repeated_cells: 0,
    neither_repeated_cells: 0,
    current_repeated_with_duplicate_lanes: 0,
    current_repeated_with_duplicate_columns: 0,
    geometry_repeated_with_duplicate_lanes: 0,
    geometry_repeated_with_duplicate_columns: 0,
  };
}

function pct(part: number, whole: number): number {
  return whole ? Math.round((10000 * part) / whole) / 100 : 0;
}

function avg(total: number, n: number): number {
  return n ? Math.round((100 * total) / n) / 100 : 0;
}

function unique<T>(xs: readonly T[]): T[] {
  return [...new Set(xs)];
}

function duplicateValues<T>(xs: readonly T[]): T[] {
  const counts = new Map<T, number>();
  for (const x of xs) counts.set(x, (counts.get(x) ?? 0) + 1);
  return [...counts.entries()].filter(([, n]) => n > 1).map(([x]) => x);
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

function regimeToHows0to100(r: DailyRegime): number {
  if (r === "suppressive") return 30;
  if (r === "neutral") return 50;
  return 75;
}

function rowKey(row: SeasonalRowV4): string {
  return `${row.species}|${row.region_key}|${row.water_type}|${row.month}`;
}

function laneKey(
  species: SeasonalRowV4["species"],
  water: SeasonalRowV4["water_type"],
  column: TacticalColumn,
  pace: TacticalPace,
): string {
  return `${species}|${water}|${column}|${pace}`;
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

function laneCandidates(args: {
  row: SeasonalRowV4;
  side: Side;
  column: TacticalColumn;
  pace: TacticalPace;
}): ArchetypeProfileV4[] {
  const ids = new Set<string>(
    args.side === "lure" ? args.row.primary_lure_ids : args.row.primary_fly_ids,
  );
  return (args.side === "lure" ? LURE_ARCHETYPES_V4 : FLY_ARCHETYPES_V4).filter(
    (a) =>
      ids.has(a.id) &&
      a.species_allowed.includes(args.row.species) &&
      a.water_types_allowed.includes(args.row.water_type) &&
      args.row.column_range.includes(a.column) &&
      args.row.pace_range.includes(a.primary_pace) &&
      a.column === args.column &&
      paceCompatible(args.pace, a),
  );
}

function laneStats(candidates: readonly ArchetypeProfileV4[]) {
  return {
    candidates: candidates.length,
    presentation_groups: unique(candidates.map((a) => a.presentation_group))
      .length,
    family_groups: unique(candidates.map((a) => a.family_group)).length,
  };
}

function profileGeometry(profiles: readonly TargetProfile[]) {
  const lanes = profiles.map((p) => `${p.column}|${p.pace}`);
  const columns = profiles.map((p) => p.column);
  return {
    duplicateLaneCount: profiles.length - unique(lanes).length,
    duplicateColumnCount: profiles.length - unique(columns).length,
  };
}

function runCell(args: {
  baseRow: SeasonalRowV4;
  mode: Mode;
  clarity: WaterClarity;
  regime: DailyRegime;
  windBand: WindBand;
  localDate: string;
}): RunCell {
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
  const surfaceOpen = row.column_range.includes("surface") &&
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
    surface_allowed_today: surfaceOpen,
    surface_slot_present: surfaceSlotPresent,
    daylight_wind_mph: daylightWindMph,
    wind_band,
  };
  const flyConditionState: FlyDailyConditionState = {
    regime: args.regime,
    surface_allowed_today: surfaceOpen,
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
  const geometry = profileGeometry(profiles);

  return {
    mode: args.mode,
    row,
    clarity: args.clarity,
    regime: args.regime,
    windBand: args.windBand,
    surfaceBlocked,
    surfaceOpen,
    profiles,
    lureTraces,
    flyTraces,
    lureChosenIds: lurePicks.map((p) => p.archetype.id),
    flyChosenIds: flyPicks.map((p) => p.archetype.id),
    lureGroups,
    flyGroups,
    repeated: duplicateValues([...lureGroups, ...flyGroups]).length > 0 ||
      duplicateValues(lureGroups).length > 0 ||
      duplicateValues(flyGroups).length > 0,
    duplicateLaneCount: geometry.duplicateLaneCount,
    duplicateColumnCount: geometry.duplicateColumnCount,
  };
}

function traceGroupCount(trace: RebuildSlotSelectionTrace): number {
  return unique(
    trace.candidateScores
      .map((score) => CATALOG_BY_ID.get(score.id)?.presentation_group)
      .filter((group): group is string => group != null),
  ).length;
}

function hasDifferentAvailableGroup(
  trace: RebuildSlotSelectionTrace,
  repeatedGroup: string,
  pickedIds: ReadonlySet<string>,
): boolean {
  return trace.candidateScores.some((score) => {
    if (pickedIds.has(score.id)) return false;
    const candidate = CATALOG_BY_ID.get(score.id);
    return candidate != null && candidate.presentation_group !== repeatedGroup;
  });
}

function classifyRepeat(args: {
  mode: Mode;
  currentTrace: RebuildSlotSelectionTrace;
  geometryTrace: RebuildSlotSelectionTrace;
  repeatedGroup: string;
  pickedIdsBeforeSlot: ReadonlySet<string>;
  duplicateLaneCount: number;
  duplicateColumnCount: number;
}): RepeatCause {
  const currentGroups = traceGroupCount(args.currentTrace);
  const geometryGroups = traceGroupCount(args.geometryTrace);
  const currentHadDifferent = hasDifferentAvailableGroup(
    args.currentTrace,
    args.repeatedGroup,
    args.pickedIdsBeforeSlot,
  );
  const geometryMeaningfullyExpands = geometryGroups >= currentGroups + 2 ||
    (currentGroups <= 1 && geometryGroups >= 2);

  if (currentHadDifferent) return "selector_choice";
  if (args.mode === "current_row_pool" && geometryMeaningfullyExpands) {
    return "row_menu_limit";
  }
  if (geometryGroups <= 1) return "catalog_distribution_limit";
  if (currentGroups <= 1) return "single_group_lane";
  if (args.duplicateLaneCount > 0 || args.duplicateColumnCount >= 2) {
    return "profile_geometry_repeat";
  }
  return "unknown_needs_review";
}

function repeatCauseRecords(args: {
  current: RunCell;
  geometry: RunCell;
  modeRun: RunCell;
  side: Side;
}): CauseRecord[] {
  const traces = args.side === "lure"
    ? args.modeRun.lureTraces
    : args.modeRun.flyTraces;
  const currentTraces = args.side === "lure"
    ? args.current.lureTraces
    : args.current.flyTraces;
  const geometryTraces = args.side === "lure"
    ? args.geometry.lureTraces
    : args.geometry.flyTraces;
  const pickedIds = new Set<string>();
  const seenGroups = new Set<string>();
  const records: CauseRecord[] = [];

  for (let slot = 0; slot < traces.length; slot++) {
    const trace = traces[slot]!;
    if (trace.chosenId == null) continue;
    const chosen = CATALOG_BY_ID.get(trace.chosenId);
    if (chosen == null) continue;
    const group = chosen.presentation_group;
    if (seenGroups.has(group)) {
      const currentTrace = currentTraces[slot] ?? trace;
      const geometryTrace = geometryTraces[slot] ?? trace;
      const cause = classifyRepeat({
        mode: args.modeRun.mode,
        currentTrace,
        geometryTrace,
        repeatedGroup: group,
        pickedIdsBeforeSlot: pickedIds,
        duplicateLaneCount: args.modeRun.duplicateLaneCount,
        duplicateColumnCount: args.modeRun.duplicateColumnCount,
      });
      records.push({
        mode: args.modeRun.mode,
        cause,
        side: args.side,
        species: args.modeRun.row.species,
        region_key: args.modeRun.row.region_key,
        water_type: args.modeRun.row.water_type,
        month: args.modeRun.row.month,
        clarity: args.modeRun.clarity,
        regime: args.modeRun.regime,
        wind_surface_state: args.modeRun.windBand,
        slot,
        chosen_id: trace.chosenId,
        presentation_group: group,
        profile: trace.profile,
        current_lane_group_count: traceGroupCount(currentTrace),
        geometry_lane_group_count: traceGroupCount(geometryTrace),
        profile_duplicate_lanes: args.modeRun.duplicateLaneCount,
        profile_duplicate_columns: args.modeRun.duplicateColumnCount,
      });
    }
    seenGroups.add(group);
    pickedIds.add(trace.chosenId);
  }
  return records;
}

function addCauseRecords(acc: CauseAcc, records: readonly CauseRecord[]) {
  if (records.length === 0) return;
  acc.total_repeated_cells++;
  acc.total_repeat_slots += records.length;
  const causesInCell = new Set<RepeatCause>();
  for (const record of records) {
    acc.cause_counts[record.cause]++;
    causesInCell.add(record.cause);
    const samples = acc.samples[record.cause] ?? [];
    if (samples.length < CAUSE_SAMPLES_PER_MODE) {
      samples.push(record);
      acc.samples[record.cause] = samples;
    }
  }
  for (const cause of causesInCell) acc.repeated_cells_by_cause[cause]++;
}

function addBucketRecords(
  buckets: Record<string, BucketAcc>,
  key: string,
  records: readonly CauseRecord[],
) {
  buckets[key] ??= emptyBucketAcc();
  buckets[key].cells++;
  addCauseRecords(buckets[key], records);
}

function causeMetrics(acc: CauseAcc) {
  const out: Record<
    string,
    { slots: number; slot_rate_pct: number; cells: number }
  > = {};
  for (const cause of Object.keys(acc.cause_counts) as RepeatCause[]) {
    out[cause] = {
      slots: acc.cause_counts[cause],
      slot_rate_pct: pct(acc.cause_counts[cause], acc.total_repeat_slots),
      cells: acc.repeated_cells_by_cause[cause],
    };
  }
  return {
    repeated_cells: acc.total_repeated_cells,
    repeat_slots: acc.total_repeat_slots,
    causes: out,
  };
}

function bucketMetrics(bucket: BucketAcc) {
  return {
    cells: bucket.cells,
    repeated_cells: bucket.total_repeated_cells,
    repeated_cell_rate_pct: pct(bucket.total_repeated_cells, bucket.cells),
    repeat_slots: bucket.total_repeat_slots,
    causes: causeMetrics(bucket).causes,
    dominant_cause: dominantCause(bucket),
  };
}

function dominantCause(acc: CauseAcc): RepeatCause {
  return (Object.entries(acc.cause_counts) as [RepeatCause, number][])
    .sort((a, b) => b[1] - a[1])[0]?.[0] ?? "unknown_needs_review";
}

function topBuckets(buckets: Record<string, BucketAcc>, limit = 12) {
  return Object.entries(buckets)
    .map(([bucket, acc]) => ({ bucket, ...bucketMetrics(acc) }))
    .sort((a, b) =>
      b.repeated_cell_rate_pct - a.repeated_cell_rate_pct ||
      b.repeat_slots - a.repeat_slots
    )
    .slice(0, limit);
}

function addLaneObservation(
  lanes: Record<string, LaneAcc>,
  baseRow: SeasonalRowV4,
  column: TacticalColumn,
  pace: TacticalPace,
) {
  const key = laneKey(baseRow.species, baseRow.water_type, column, pace);
  lanes[key] ??= emptyLaneAcc();
  const acc = lanes[key];
  const current = rowForMode(baseRow, "current_row_pool");
  const geometry = rowForMode(baseRow, "geometry_catalog_pool");
  const currentLures = laneStats(
    laneCandidates({ row: current, side: "lure", column, pace }),
  );
  const currentFlies = laneStats(
    laneCandidates({ row: current, side: "fly", column, pace }),
  );
  const geometryLures = laneStats(
    laneCandidates({ row: geometry, side: "lure", column, pace }),
  );
  const geometryFlies = laneStats(
    laneCandidates({ row: geometry, side: "fly", column, pace }),
  );

  acc.observations++;
  acc.current_lure_candidates += currentLures.candidates;
  acc.current_lure_presentation_groups += currentLures.presentation_groups;
  acc.current_lure_family_groups += currentLures.family_groups;
  acc.current_fly_candidates += currentFlies.candidates;
  acc.current_fly_presentation_groups += currentFlies.presentation_groups;
  acc.current_fly_family_groups += currentFlies.family_groups;
  acc.geometry_lure_candidates += geometryLures.candidates;
  acc.geometry_lure_presentation_groups += geometryLures.presentation_groups;
  acc.geometry_lure_family_groups += geometryLures.family_groups;
  acc.geometry_fly_candidates += geometryFlies.candidates;
  acc.geometry_fly_presentation_groups += geometryFlies.presentation_groups;
  acc.geometry_fly_family_groups += geometryFlies.family_groups;

  const currentGroups = currentLures.presentation_groups +
    currentFlies.presentation_groups;
  const geometryGroups = geometryLures.presentation_groups +
    geometryFlies.presentation_groups;
  if (geometryGroups >= currentGroups + 2) acc.meaningful_geometry_expansions++;
}

function laneMetrics(acc: LaneAcc) {
  return {
    observations: acc.observations,
    current_lure_candidates_avg: avg(
      acc.current_lure_candidates,
      acc.observations,
    ),
    current_lure_presentation_groups_avg: avg(
      acc.current_lure_presentation_groups,
      acc.observations,
    ),
    current_lure_family_groups_avg: avg(
      acc.current_lure_family_groups,
      acc.observations,
    ),
    current_fly_candidates_avg: avg(
      acc.current_fly_candidates,
      acc.observations,
    ),
    current_fly_presentation_groups_avg: avg(
      acc.current_fly_presentation_groups,
      acc.observations,
    ),
    current_fly_family_groups_avg: avg(
      acc.current_fly_family_groups,
      acc.observations,
    ),
    geometry_lure_candidates_avg: avg(
      acc.geometry_lure_candidates,
      acc.observations,
    ),
    geometry_lure_presentation_groups_avg: avg(
      acc.geometry_lure_presentation_groups,
      acc.observations,
    ),
    geometry_lure_family_groups_avg: avg(
      acc.geometry_lure_family_groups,
      acc.observations,
    ),
    geometry_fly_candidates_avg: avg(
      acc.geometry_fly_candidates,
      acc.observations,
    ),
    geometry_fly_presentation_groups_avg: avg(
      acc.geometry_fly_presentation_groups,
      acc.observations,
    ),
    geometry_fly_family_groups_avg: avg(
      acc.geometry_fly_family_groups,
      acc.observations,
    ),
    meaningful_geometry_expansion_rate_pct: pct(
      acc.meaningful_geometry_expansions,
      acc.observations,
    ),
  };
}

function updateProfileAcc(
  acc: ProfileAcc,
  current: RunCell,
  geometry: RunCell,
) {
  acc.observations++;
  if (current.duplicateLaneCount > 0) acc.duplicate_lane_observations++;
  if (current.duplicateColumnCount > 0) acc.duplicate_column_observations++;
  if (capableOfThreeGroups(current.lureTraces)) {
    acc.capable_current_lure_macro3++;
  }
  if (capableOfThreeGroups(current.flyTraces)) acc.capable_current_fly_macro3++;
  if (capableOfThreeGroups(geometry.lureTraces)) {
    acc.capable_geometry_lure_macro3++;
  }
  if (capableOfThreeGroups(geometry.flyTraces)) {
    acc.capable_geometry_fly_macro3++;
  }
  if (current.repeated) acc.repeated_current_cells++;
  if (geometry.repeated) acc.repeated_geometry_cells++;
}

function capableOfThreeGroups(
  traces: readonly RebuildSlotSelectionTrace[],
): boolean {
  const groups = unique(
    traces.flatMap((trace) =>
      trace.candidateScores.map((score) =>
        CATALOG_BY_ID.get(score.id)?.presentation_group
      )
    ).filter((group): group is string => group != null),
  );
  return groups.length >= 3;
}

function profileMetrics(acc: ProfileAcc) {
  return {
    observations: acc.observations,
    duplicate_lane_rate_pct: pct(
      acc.duplicate_lane_observations,
      acc.observations,
    ),
    duplicate_column_rate_pct: pct(
      acc.duplicate_column_observations,
      acc.observations,
    ),
    capable_current_lure_macro3_rate_pct: pct(
      acc.capable_current_lure_macro3,
      acc.observations,
    ),
    capable_current_fly_macro3_rate_pct: pct(
      acc.capable_current_fly_macro3,
      acc.observations,
    ),
    capable_geometry_lure_macro3_rate_pct: pct(
      acc.capable_geometry_lure_macro3,
      acc.observations,
    ),
    capable_geometry_fly_macro3_rate_pct: pct(
      acc.capable_geometry_fly_macro3,
      acc.observations,
    ),
    repeated_current_cell_rate_pct: pct(
      acc.repeated_current_cells,
      acc.observations,
    ),
    repeated_geometry_cell_rate_pct: pct(
      acc.repeated_geometry_cells,
      acc.observations,
    ),
  };
}

function updateComparisonAcc(
  acc: ComparisonAcc,
  current: RunCell,
  geometry: RunCell,
) {
  if (current.repeated && geometry.repeated) acc.both_repeated_cells++;
  else if (current.repeated) acc.current_only_repeated_cells++;
  else if (geometry.repeated) acc.geometry_only_repeated_cells++;
  else acc.neither_repeated_cells++;

  if (current.repeated && current.duplicateLaneCount > 0) {
    acc.current_repeated_with_duplicate_lanes++;
  }
  if (current.repeated && current.duplicateColumnCount > 0) {
    acc.current_repeated_with_duplicate_columns++;
  }
  if (geometry.repeated && geometry.duplicateLaneCount > 0) {
    acc.geometry_repeated_with_duplicate_lanes++;
  }
  if (geometry.repeated && geometry.duplicateColumnCount > 0) {
    acc.geometry_repeated_with_duplicate_columns++;
  }
}

function comparisonMetrics(acc: ComparisonAcc, totalCells: number) {
  return {
    both_repeated_cells: acc.both_repeated_cells,
    current_only_repeated_cells: acc.current_only_repeated_cells,
    geometry_only_repeated_cells: acc.geometry_only_repeated_cells,
    neither_repeated_cells: acc.neither_repeated_cells,
    current_only_repeated_rate_pct: pct(
      acc.current_only_repeated_cells,
      totalCells,
    ),
    geometry_only_repeated_rate_pct: pct(
      acc.geometry_only_repeated_cells,
      totalCells,
    ),
    current_repeated_duplicate_lane_overlap_rate_pct: pct(
      acc.current_repeated_with_duplicate_lanes,
      acc.both_repeated_cells + acc.current_only_repeated_cells,
    ),
    current_repeated_duplicate_column_overlap_rate_pct: pct(
      acc.current_repeated_with_duplicate_columns,
      acc.both_repeated_cells + acc.current_only_repeated_cells,
    ),
    geometry_repeated_duplicate_lane_overlap_rate_pct: pct(
      acc.geometry_repeated_with_duplicate_lanes,
      acc.both_repeated_cells + acc.geometry_only_repeated_cells,
    ),
    geometry_repeated_duplicate_column_overlap_rate_pct: pct(
      acc.geometry_repeated_with_duplicate_columns,
      acc.both_repeated_cells + acc.geometry_only_repeated_cells,
    ),
  };
}

function compareStrategies(
  globalCurrent: CauseAcc,
  globalGeometry: CauseAcc,
  profile: ProfileAcc,
) {
  const current = causeMetrics(globalCurrent);
  const geometry = causeMetrics(globalGeometry);
  const currentRowMenuSlots = current.causes.row_menu_limit?.slots ?? 0;
  const currentSelectorSlots = current.causes.selector_choice?.slots ?? 0;
  const currentProfileSlots = current.causes.profile_geometry_repeat?.slots ??
    0;
  const currentCatalogSlots =
    current.causes.catalog_distribution_limit?.slots ?? 0;
  const duplicateProfileRate = pct(
    profile.duplicate_lane_observations,
    profile.observations,
  );
  return {
    A_manual_row_menu_repair:
      `Targets ${currentRowMenuSlots} row-menu-limited repeat slots in this run; safe, but not the main lever unless humans identify biologically wrong row menus outside this classifier.`,
    B_full_geometry_catalog_pool:
      `Hard-valid in Pass 8, but this audit still sees ${geometry.repeated_cells} geometry repeated cells; too broad for a direct production switch.`,
    C_hybrid_geometry_pool:
      `Useful as a safety valve for thin authored menus, but unlikely to solve most repeats by itself because geometry still repeats heavily.`,
    D_group_aware_profile_diversification:
      `Best small production lever: preserve hard gates, then make the final slot/profile prefer a different macro group when a legal adjacent-lane alternative exists; duplicate-lane profile rate is ${duplicateProfileRate}%.`,
    E_daily_variety_slot:
      `Good companion to D: one controlled rotation slot can search same-column/same-pace first, then adjacent pace/column, without changing row/catalog truth.`,
    dominant_constraint_estimate: {
      row_menu_limit_slots: currentRowMenuSlots,
      selector_choice_slots: currentSelectorSlots,
      profile_geometry_repeat_slots: currentProfileSlots,
      catalog_distribution_limit_slots: currentCatalogSlots,
    },
  };
}

function main() {
  const generated_at = new Date().toISOString();
  const unscopedRows = ALL_ROWS.filter((r) =>
    r.state_code == null || String(r.state_code).trim() === ""
  );
  const globalCause: Record<Mode, CauseAcc> = {
    current_row_pool: emptyCauseAcc(),
    geometry_catalog_pool: emptyCauseAcc(),
  };
  const comparisonAcc = emptyComparisonAcc();
  const bucketMaps: Record<Mode, Record<string, Record<string, BucketAcc>>> = {
    current_row_pool: {
      species: {},
      species_water: {},
      species_region_water: {},
      species_region_water_month: {},
    },
    geometry_catalog_pool: {
      species: {},
      species_water: {},
      species_region_water: {},
      species_region_water_month: {},
    },
  };
  const lanes: Record<string, LaneAcc> = {};
  const profileAcc = emptyProfileAcc();
  const profileSamples: unknown[] = [];
  const cellsPreview: unknown[] = [];

  for (const row of unscopedRows) {
    for (const column of COLUMNS) {
      for (const pace of PACES) {
        addLaneObservation(lanes, row, column, pace);
      }
    }
  }

  for (const [rowIndex, baseRow] of unscopedRows.entries()) {
    if (rowIndex % 100 === 0) {
      console.error(
        `repeat-cause audit progress: row ${
          rowIndex + 1
        }/${unscopedRows.length}`,
      );
    }
    const localDate = `2026-${String(baseRow.month).padStart(2, "0")}-15`;
    for (const clarity of CLARITIES) {
      for (const regime of REGIMES) {
        for (const windBand of WIND_PROFILES) {
          const current = runCell({
            baseRow,
            mode: "current_row_pool",
            clarity,
            regime,
            windBand,
            localDate,
          });
          const geometry = runCell({
            baseRow,
            mode: "geometry_catalog_pool",
            clarity,
            regime,
            windBand,
            localDate,
          });
          updateProfileAcc(profileAcc, current, geometry);
          updateComparisonAcc(comparisonAcc, current, geometry);

          if (profileSamples.length < 120) {
            profileSamples.push({
              row_key: rowKey(baseRow),
              regime,
              wind_surface_state: windBand,
              surface_blocked: current.surfaceBlocked,
              profiles: current.profiles,
              duplicate_lane_count: current.duplicateLaneCount,
              duplicate_column_count: current.duplicateColumnCount,
              current_repeated: current.repeated,
              geometry_repeated: geometry.repeated,
            });
          }

          for (const modeRun of [current, geometry]) {
            const records = [
              ...repeatCauseRecords({
                current,
                geometry,
                modeRun,
                side: "lure",
              }),
              ...repeatCauseRecords({
                current,
                geometry,
                modeRun,
                side: "fly",
              }),
            ];
            addCauseRecords(globalCause[modeRun.mode], records);
            const species = modeRun.row.species;
            const speciesWater = `${species}|${modeRun.row.water_type}`;
            const speciesRegionWater =
              `${species}|${modeRun.row.region_key}|${modeRun.row.water_type}`;
            const speciesRegionWaterMonth =
              `${speciesRegionWater}|${modeRun.row.month}`;
            addBucketRecords(
              bucketMaps[modeRun.mode].species,
              species,
              records,
            );
            addBucketRecords(
              bucketMaps[modeRun.mode].species_water,
              speciesWater,
              records,
            );
            addBucketRecords(
              bucketMaps[modeRun.mode].species_region_water,
              speciesRegionWater,
              records,
            );
            addBucketRecords(
              bucketMaps[modeRun.mode].species_region_water_month,
              speciesRegionWaterMonth,
              records,
            );
            if (cellsPreview.length < CELLS_PREVIEW && records.length > 0) {
              cellsPreview.push({
                mode: modeRun.mode,
                row_key: rowKey(modeRun.row),
                clarity,
                regime,
                wind_surface_state: windBand,
                profiles: modeRun.profiles,
                lure_chosen_ids: modeRun.lureChosenIds,
                fly_chosen_ids: modeRun.flyChosenIds,
                lure_groups: modeRun.lureGroups,
                fly_groups: modeRun.flyGroups,
                records,
              });
            }
          }
        }
      }
    }
  }

  const lane_summary = Object.fromEntries(
    Object.entries(lanes).map(([key, acc]) => [key, laneMetrics(acc)]),
  );
  const lane_thinness_worst = Object.entries(lane_summary)
    .map(([key, metrics]) => ({ lane: key, ...metrics }))
    .sort((a, b) =>
      (a.current_lure_presentation_groups_avg +
          a.current_fly_presentation_groups_avg) -
        (b.current_lure_presentation_groups_avg +
          b.current_fly_presentation_groups_avg) ||
      b.meaningful_geometry_expansion_rate_pct -
        a.meaningful_geometry_expansion_rate_pct
    )
    .slice(0, 30);
  const report = {
    generated_at,
    matrix: {
      rows_scanned: unscopedRows.length,
      cells_per_mode: unscopedRows.length * CLARITIES.length * REGIMES.length *
        WIND_PROFILES.length,
      clarities: CLARITIES,
      regimes: REGIMES,
      wind_profiles: WIND_PROFILES,
    },
    global: {
      current_row_pool: causeMetrics(globalCause.current_row_pool),
      geometry_catalog_pool: causeMetrics(globalCause.geometry_catalog_pool),
    },
    buckets: {
      current_row_pool: Object.fromEntries(
        Object.entries(bucketMaps.current_row_pool).map(([name, map]) => [
          name,
          topBuckets(map, name === "species_region_water_month" ? 25 : 15),
        ]),
      ),
      geometry_catalog_pool: Object.fromEntries(
        Object.entries(bucketMaps.geometry_catalog_pool).map(([name, map]) => [
          name,
          topBuckets(map, name === "species_region_water_month" ? 25 : 15),
        ]),
      ),
    },
    highlighted_buckets: {
      current_row_pool: [
        "largemouth_bass|freshwater_lake_pond",
        "largemouth_bass|freshwater_river",
        "smallmouth_bass|freshwater_lake_pond",
        "northern_pike",
        "trout",
      ].map((key) => ({
        bucket: key,
        species_water: bucketMaps.current_row_pool.species_water[key]
          ? bucketMetrics(bucketMaps.current_row_pool.species_water[key])
          : undefined,
        species: bucketMaps.current_row_pool.species[key]
          ? bucketMetrics(bucketMaps.current_row_pool.species[key])
          : undefined,
      })),
    },
    lane_summary,
    lane_thinness_worst,
    profile_geometry: profileMetrics(profileAcc),
    mode_comparison: comparisonMetrics(
      comparisonAcc,
      unscopedRows.length * CLARITIES.length * REGIMES.length *
        WIND_PROFILES.length,
    ),
    profile_samples: profileSamples,
    strategy_evaluation: compareStrategies(
      globalCause.current_row_pool,
      globalCause.geometry_catalog_pool,
      profileAcc,
    ),
    cause_samples: {
      current_row_pool: globalCause.current_row_pool.samples,
      geometry_catalog_pool: globalCause.geometry_catalog_pool.samples,
    },
    cells_preview: cellsPreview,
  };

  Deno.mkdirSync(OUT_DIR, { recursive: true });
  Deno.writeTextFileSync(JSON_PATH, JSON.stringify(report, null, 2));

  const current = report.global.current_row_pool;
  const geometry = report.global.geometry_catalog_pool;
  const profile = report.profile_geometry;
  const comparison = report.mode_comparison;
  const dominant = dominantCause(globalCause.current_row_pool);
  const md: string[] = [];
  md.push("# Recommender rebuild — repeat cause analysis");
  md.push("");
  md.push(`Generated: **${generated_at}**`);
  md.push("");
  md.push("## Executive conclusion");
  md.push("");
  md.push(
    `Current production repeats are dominated by **${dominant}** in this classifier. Full geometry remains hard-useful as an audit contrast, but it does not erase structural lane repetition; the best next production pass is a hybrid preferred-pool plus group-aware rotation/third-slot rule, not a direct full-geometry switch.`,
  );
  md.push("");
  md.push("## Repeat cause breakdown");
  md.push("");
  md.push(
    "| Cause | Current repeat slots | Current slot rate | Geometry repeat slots | Geometry slot rate |",
  );
  md.push("| --- | ---: | ---: | ---: | ---: |");
  for (
    const cause of [
      "single_group_lane",
      "profile_geometry_repeat",
      "catalog_distribution_limit",
      "row_menu_limit",
      "selector_choice",
      "unknown_needs_review",
    ] as RepeatCause[]
  ) {
    md.push(
      `| ${cause} | ${current.causes[cause].slots} | ${
        current.causes[cause].slot_rate_pct
      }% | ${geometry.causes[cause].slots} | ${
        geometry.causes[cause].slot_rate_pct
      }% |`,
    );
  }
  md.push("");
  md.push(
    `- Current repeated cells: **${current.repeated_cells}**; repeat slots: **${current.repeat_slots}**.`,
  );
  md.push(
    `- Geometry repeated cells: **${geometry.repeated_cells}**; repeat slots: **${geometry.repeat_slots}**.`,
  );
  md.push(
    `- Cells repeated in both modes: **${comparison.both_repeated_cells}**.`,
  );
  md.push(
    `- Cells repeated only in current mode: **${comparison.current_only_repeated_cells}** (${comparison.current_only_repeated_rate_pct}%).`,
  );
  md.push(
    `- Cells repeated only in geometry mode: **${comparison.geometry_only_repeated_cells}** (${comparison.geometry_only_repeated_rate_pct}%).`,
  );
  md.push("");
  md.push("## Worst buckets");
  md.push("");
  for (
    const [label, key] of [
      ["Species", "species"],
      ["Species / Water", "species_water"],
      ["Species / Region / Water", "species_region_water"],
      ["Species / Region / Water / Month", "species_region_water_month"],
    ] as const
  ) {
    md.push(`### ${label}`);
    md.push("");
    for (const item of report.buckets.current_row_pool[key].slice(0, 10)) {
      md.push(
        `- ${item.bucket}: ${item.repeated_cell_rate_pct}% repeated cells (${item.repeated_cells}/${item.cells}); dominant ${item.dominant_cause}`,
      );
    }
    md.push("");
  }
  md.push("## Lane-Level Catalog Thinness");
  md.push("");
  md.push(
    "| Lane | Current lure PG avg | Current fly PG avg | Geometry lure PG avg | Geometry fly PG avg | Geometry expansion rate |",
  );
  md.push("| --- | ---: | ---: | ---: | ---: | ---: |");
  for (const lane of lane_thinness_worst.slice(0, 20)) {
    md.push(
      `| ${lane.lane} | ${lane.current_lure_presentation_groups_avg} | ${lane.current_fly_presentation_groups_avg} | ${lane.geometry_lure_presentation_groups_avg} | ${lane.geometry_fly_presentation_groups_avg} | ${lane.meaningful_geometry_expansion_rate_pct}% |`,
    );
  }
  md.push("");
  md.push("## Target Profile Geometry");
  md.push("");
  md.push(
    `- Duplicate lane profile rate: **${profile.duplicate_lane_rate_pct}%**.`,
  );
  md.push(
    `- Duplicate column profile rate: **${profile.duplicate_column_rate_pct}%**.`,
  );
  md.push(
    `- Current repeated cells with duplicate lanes: **${comparison.current_repeated_duplicate_lane_overlap_rate_pct}%**.`,
  );
  md.push(
    `- Current repeated cells with duplicate columns: **${comparison.current_repeated_duplicate_column_overlap_rate_pct}%**.`,
  );
  md.push(
    `- Current rows capable of 3 lure macro groups: **${profile.capable_current_lure_macro3_rate_pct}%**.`,
  );
  md.push(
    `- Current rows capable of 3 fly macro groups: **${profile.capable_current_fly_macro3_rate_pct}%**.`,
  );
  md.push(
    `- Geometry capable of 3 lure macro groups: **${profile.capable_geometry_lure_macro3_rate_pct}%**.`,
  );
  md.push(
    `- Geometry capable of 3 fly macro groups: **${profile.capable_geometry_fly_macro3_rate_pct}%**.`,
  );
  md.push("");
  md.push("## Dominant Issue");
  md.push("");
  md.push(
    `The dominant automated cause is **${dominant}**. Row menus matter where geometry expands a lane, but profile geometry and catalog lane distribution still cap macro diversity in many repeated cells. A pure catalog-wide pool therefore improves some lane availability without solving repeated profile asks.`,
  );
  md.push("");
  md.push("## Strategy Evaluation");
  md.push("");
  for (
    const [strategy, summary] of Object.entries(report.strategy_evaluation)
  ) {
    md.push(
      `- **${strategy}**: ${
        typeof summary === "string" ? summary : JSON.stringify(summary)
      }`,
    );
  }
  md.push("");
  md.push("## Recommendation");
  md.push("");
  md.push(
    "Next production pass should prototype strategy C plus a small piece of D: keep authored row IDs as preferred boosts, allow catalog-valid fallback/rotation candidates under row exclusions, and add a group-aware final-slot preference only when legal alternatives exist. Avoid a raw full-geometry switch and avoid broad manual row rewrites until the hybrid path is tested.",
  );
  md.push("");
  md.push(`Full machine-readable report: \`${JSON_PATH}\`.`);
  Deno.writeTextFileSync(MD_PATH, md.join("\n") + "\n");
  console.log(`Wrote ${JSON_PATH}`);
  console.log(`Wrote ${MD_PATH}`);
  console.log(
    `Current repeat slots: ${current.repeat_slots}; geometry repeat slots: ${geometry.repeat_slots}`,
  );
}

main();
