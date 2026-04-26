/**
 * Audit production slot rotation across representative 30-date windows and
 * summarize targeted seasonal-row inclusion opportunities for new fly archetypes.
 *
 * Usage:
 *   deno run -A scripts/audit-recommender-slot-stickiness-and-row-inclusion.ts
 */
import type { WaterClarity } from "../supabase/functions/_shared/recommenderEngine/contracts/input.ts";
import type {
  ArchetypeProfileV4,
  FlyArchetypeIdV4,
  SeasonalRowV4,
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
  type CandidateScoreTrace,
  type RebuildSlotPick,
  type RebuildSlotSelectionTrace,
  selectArchetypesForSide,
} from "../supabase/functions/_shared/recommenderEngine/rebuild/selectSide.ts";
import type {
  FlyDailyConditionState,
  LureDailyConditionState,
} from "../supabase/functions/_shared/recommenderEngine/rebuild/conditionWindows.ts";

type Side = "lure" | "fly";
type Classification =
  | "healthy_rotation"
  | "slot_1_sticky"
  | "slot_2_sticky"
  | "first_two_sticky"
  | "honest_narrow_winter_lane"
  | "needs_selector_weight_review"
  | "fly_side_structural_thinness_review";

type NewFlyId =
  | "warmwater_crawfish_fly"
  | "warmwater_worm_fly"
  | "foam_gurgler_fly"
  | "pike_flash_fly";

const OUT_DIR = "docs/audits/recommender-rebuild";
const JSON_PATH = `${OUT_DIR}/slot-stickiness-and-row-inclusion.json`;
const MD_PATH = `${OUT_DIR}/slot-stickiness-and-row-inclusion.md`;
const DATE_COUNT = 30;
const NEW_FLY_IDS: readonly NewFlyId[] = [
  "warmwater_crawfish_fly",
  "warmwater_worm_fly",
  "foam_gurgler_fly",
  "pike_flash_fly",
];

const ALL_ROWS: readonly SeasonalRowV4[] = [
  ...LARGEMOUTH_BASS_SEASONAL_ROWS_V4,
  ...SMALLMOUTH_BASS_SEASONAL_ROWS_V4,
  ...NORTHERN_PIKE_SEASONAL_ROWS_V4,
  ...TROUT_SEASONAL_ROWS_V4,
];
const ALL_ARCHETYPES = [...LURE_ARCHETYPES_V4, ...FLY_ARCHETYPES_V4];
const ARCHETYPE_BY_ID = new Map<string, ArchetypeProfileV4>(
  ALL_ARCHETYPES.map((a) => [a.id, a]),
);
const FLY_BY_ID = new Map<string, ArchetypeProfileV4>(
  FLY_ARCHETYPES_V4.map((a) => [a.id, a]),
);

const WIND_MPH: Record<WindBand, number> = {
  calm: 3,
  breezy: 9,
  windy: 16,
};

const SOUTHERN_LMB_LAKE_REGIONS = new Set([
  "florida",
  "gulf_coast",
  "southeast_atlantic",
]);

type ContextSpec = {
  id: string;
  label: string;
  species: SeasonalRowV4["species"];
  water_type: SeasonalRowV4["water_type"];
  preferred_regions: readonly string[];
  month: number;
  clarity: WaterClarity;
  regime: DailyRegime;
  wind_band: WindBand;
  start_date: string;
  winter?: boolean;
  surface_focus?: boolean;
};

const CONTEXTS: readonly ContextSpec[] = [
  {
    id: "florida_lmb_lake_warm_stained_surface",
    label: "Florida LMB lake/pond warm stained surface",
    species: "largemouth_bass",
    water_type: "freshwater_lake_pond",
    preferred_regions: ["florida"],
    month: 8,
    clarity: "stained",
    regime: "aggressive",
    wind_band: "calm",
    start_date: "2026-08-01",
    surface_focus: true,
  },
  {
    id: "gulf_lmb_lake_warm_stained_surface",
    label: "Gulf Coast LMB lake/pond warm stained surface",
    species: "largemouth_bass",
    water_type: "freshwater_lake_pond",
    preferred_regions: ["gulf_coast", "southeast_atlantic"],
    month: 8,
    clarity: "stained",
    regime: "aggressive",
    wind_band: "calm",
    start_date: "2026-08-01",
    surface_focus: true,
  },
  {
    id: "lmb_river_warm",
    label: "LMB river warm context",
    species: "largemouth_bass",
    water_type: "freshwater_river",
    preferred_regions: ["gulf_coast", "southeast_atlantic", "appalachian"],
    month: 7,
    clarity: "stained",
    regime: "neutral",
    wind_band: "breezy",
    start_date: "2026-07-01",
  },
  {
    id: "smallmouth_lake_summer",
    label: "Smallmouth lake/pond summer context",
    species: "smallmouth_bass",
    water_type: "freshwater_lake_pond",
    preferred_regions: ["great_lakes_upper_midwest", "northeast"],
    month: 7,
    clarity: "clear",
    regime: "neutral",
    wind_band: "breezy",
    start_date: "2026-07-01",
  },
  {
    id: "smallmouth_river_summer",
    label: "Smallmouth river summer context",
    species: "smallmouth_bass",
    water_type: "freshwater_river",
    preferred_regions: ["great_lakes_upper_midwest", "appalachian"],
    month: 7,
    clarity: "clear",
    regime: "neutral",
    wind_band: "breezy",
    start_date: "2026-07-01",
  },
  {
    id: "pike_lake_summer",
    label: "Pike lake/pond summer context",
    species: "northern_pike",
    water_type: "freshwater_lake_pond",
    preferred_regions: ["great_lakes_upper_midwest", "midwest_interior"],
    month: 7,
    clarity: "stained",
    regime: "neutral",
    wind_band: "breezy",
    start_date: "2026-07-01",
  },
  {
    id: "pike_river_summer",
    label: "Pike river summer context",
    species: "northern_pike",
    water_type: "freshwater_river",
    preferred_regions: ["great_lakes_upper_midwest", "midwest_interior"],
    month: 7,
    clarity: "stained",
    regime: "neutral",
    wind_band: "breezy",
    start_date: "2026-07-01",
  },
  {
    id: "trout_river_summer",
    label: "Trout river summer context",
    species: "trout",
    water_type: "freshwater_river",
    preferred_regions: ["mountain_west", "mountain_alpine", "northeast"],
    month: 7,
    clarity: "clear",
    regime: "neutral",
    wind_band: "calm",
    start_date: "2026-07-01",
  },
  {
    id: "cold_winter_bass_lake",
    label: "Cold winter bass lake/pond context",
    species: "largemouth_bass",
    water_type: "freshwater_lake_pond",
    preferred_regions: ["appalachian", "midwest_interior"],
    month: 1,
    clarity: "clear",
    regime: "suppressive",
    wind_band: "breezy",
    start_date: "2026-01-01",
    winter: true,
  },
  {
    id: "cold_winter_trout_river",
    label: "Cold winter trout river context",
    species: "trout",
    water_type: "freshwater_river",
    preferred_regions: ["mountain_west", "mountain_alpine", "northeast"],
    month: 1,
    clarity: "clear",
    regime: "suppressive",
    wind_band: "breezy",
    start_date: "2026-01-01",
    winter: true,
  },
];

function pct(part: number, whole: number): number {
  return whole ? Math.round((10000 * part) / whole) / 100 : 0;
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

function nextLocalDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const dt = new Date(Date.UTC(y!, m! - 1, d! + 1));
  return `${dt.getUTCFullYear()}-${
    String(dt.getUTCMonth() + 1).padStart(2, "0")
  }-${String(dt.getUTCDate()).padStart(2, "0")}`;
}

function addDays(startDate: string, offset: number): string {
  let date = startDate;
  for (let i = 0; i < offset; i++) date = nextLocalDate(date);
  return date;
}

function rowKey(row: SeasonalRowV4): string {
  return `${row.species}|${row.region_key}|${row.water_type}|${row.month}`;
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

function findRepresentativeRow(spec: ContextSpec): SeasonalRowV4 {
  const rows = ALL_ROWS.filter((row) =>
    row.species === spec.species &&
    row.water_type === spec.water_type &&
    row.month === spec.month &&
    row.state_code == null
  );
  for (const region of spec.preferred_regions) {
    const match = rows.find((row) => row.region_key === region);
    if (match) return match;
  }
  if (rows[0]) return rows[0];
  throw new Error(`No representative row found for ${spec.id}`);
}

function runContextDate(
  spec: ContextSpec,
  row: SeasonalRowV4,
  localDate: string,
) {
  const env_data = envForWind(localDate, spec.wind_band);
  const daylightWindMph = meanDaylightWindMph({
    env_data,
    local_date: localDate,
    local_timezone: "UTC",
  });
  const surfaceBlocked = computeSurfaceBlocked({ row, daylightWindMph });
  const profiles = buildTargetProfiles({
    row,
    regime: spec.regime,
    surfaceBlocked,
  });
  const surfaceOpen = row.column_range.includes("surface") &&
    row.surface_seasonally_possible &&
    !surfaceBlocked;
  const surfaceSlotPresent = profiles.some((profile) =>
    profile.column === "surface"
  );
  const wind_band = windBandFromDaylightWindMph(daylightWindMph);
  const seedBase = `slot-stickiness|${spec.id}|${
    regimeToHows0to100(spec.regime)
  }|${localDate}|${row.region_key}|${row.species}|${row.water_type}|${spec.clarity}|${spec.wind_band}`;
  const lureConditionState: LureDailyConditionState = {
    regime: spec.regime,
    water_clarity: spec.clarity,
    surface_allowed_today: surfaceOpen,
    surface_slot_present: surfaceSlotPresent,
    daylight_wind_mph: daylightWindMph,
    wind_band,
  };
  const flyConditionState: FlyDailyConditionState = {
    regime: spec.regime,
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
    water_clarity: spec.clarity,
    profiles,
    surfaceBlocked,
    seedBase,
    currentLocalDate: localDate,
    lureConditionState,
    onSlotTrace: (trace) => lureTraces.push(trace),
  });
  const flyPicks = selectArchetypesForSide({
    side: "fly",
    row,
    species: row.species,
    context: row.water_type,
    water_clarity: spec.clarity,
    profiles,
    surfaceBlocked,
    seedBase,
    currentLocalDate: localDate,
    flyConditionState,
    onSlotTrace: (trace) => flyTraces.push(trace),
  });
  return {
    local_date: localDate,
    profiles,
    surfaceBlocked,
    surfaceOpen,
    surfaceSlotPresent,
    lurePicks,
    flyPicks,
    lureTraces,
    flyTraces,
  };
}

function chosenScore(
  trace: RebuildSlotSelectionTrace,
): CandidateScoreTrace | null {
  if (!trace.chosenId) return null;
  return trace.candidateScores.find((score) => score.id === trace.chosenId) ??
    null;
}

function hasReason(
  trace: RebuildSlotSelectionTrace,
  predicate: (reason: string) => boolean,
): boolean {
  return chosenScore(trace)?.reasons.some(predicate) ?? false;
}

function adjacentSameRate(values: readonly string[]): number {
  let same = 0;
  for (let i = 1; i < values.length; i++) {
    if (values[i] === values[i - 1]) same++;
  }
  return pct(same, Math.max(0, values.length - 1));
}

function duplicateRate(values: readonly string[]): number {
  return pct(values.length - unique(values).length, values.length);
}

function slotValues(
  runs: readonly ReturnType<typeof runContextDate>[],
  side: Side,
  slot: number,
  field: "id" | "presentation_group" | "family_group",
): string[] {
  return runs.map((run) => {
    const pick = side === "lure" ? run.lurePicks[slot] : run.flyPicks[slot];
    return pick?.archetype[field] ?? "missing";
  });
}

function tracesForSide(
  run: ReturnType<typeof runContextDate>,
  side: Side,
): RebuildSlotSelectionTrace[] {
  return side === "lure" ? run.lureTraces : run.flyTraces;
}

function shouldMarkFlySideStructuralThinness(
  row: SeasonalRowV4,
  side: Side,
  slotPgUniqueCounts: readonly number[],
): boolean {
  return side === "fly" &&
    (row.species === "largemouth_bass" ||
      row.species === "smallmouth_bass" ||
      row.species === "northern_pike") &&
    slotPgUniqueCounts.some((count) => count <= 2);
}

function classifySide(args: {
  spec: ContextSpec;
  row: SeasonalRowV4;
  side: Side;
  slotSameRates: readonly number[];
  slotUniqueCounts: readonly number[];
  slotPgUniqueCounts: readonly number[];
  fullTripleUniqueCount: number;
  slot12BoostDominancePct: number;
}): Classification {
  const [slot1Same, slot2Same] = args.slotSameRates;
  const [slot1Unique, slot2Unique] = args.slotUniqueCounts;
  const flySideStructuralThinness = shouldMarkFlySideStructuralThinness(
    args.row,
    args.side,
    args.slotPgUniqueCounts,
  );
  if (
    args.spec.winter &&
    (args.fullTripleUniqueCount <= 4 ||
      Math.max(...args.slotSameRates) >= 50 ||
      flySideStructuralThinness)
  ) {
    return "honest_narrow_winter_lane";
  }
  if (
    slot1Same >= 70 &&
    slot2Same >= 70 &&
    args.fullTripleUniqueCount > Math.max(slot1Unique, slot2Unique)
  ) {
    return flySideStructuralThinness
      ? "fly_side_structural_thinness_review"
      : "first_two_sticky";
  }
  if (slot1Same >= 80 && slot1Unique <= 3) {
    return flySideStructuralThinness
      ? "fly_side_structural_thinness_review"
      : "slot_1_sticky";
  }
  if (slot2Same >= 80 && slot2Unique <= 3) {
    return flySideStructuralThinness
      ? "fly_side_structural_thinness_review"
      : "slot_2_sticky";
  }
  if (flySideStructuralThinness) {
    return "fly_side_structural_thinness_review";
  }
  if (
    args.slot12BoostDominancePct >= 85 &&
    (slot1Same >= 70 || slot2Same >= 70)
  ) {
    return "needs_selector_weight_review";
  }
  return "healthy_rotation";
}

function analyzeSide(
  spec: ContextSpec,
  row: SeasonalRowV4,
  runs: readonly ReturnType<typeof runContextDate>[],
  side: Side,
) {
  const slotMetrics = [0, 1, 2].map((slot) => {
    const ids = slotValues(runs, side, slot, "id");
    const pgs = slotValues(runs, side, slot, "presentation_group");
    const fgs = slotValues(runs, side, slot, "family_group");
    const traces = runs.map((run) => tracesForSide(run, side)[slot]);
    const rescueCount = traces.filter((trace) =>
      trace?.varietyRescueUsed
    ).length;
    const forageBoostCount = traces.filter((trace) =>
      trace && hasReason(
        trace,
        (reason) =>
          reason.startsWith("primary_forage:") ||
          reason.startsWith("secondary_forage:"),
      )
    ).length;
    const clarityBoostCount = traces.filter((trace) =>
      trace && hasReason(
        trace,
        (reason) =>
          reason.startsWith("clarity_strength:") ||
          reason.startsWith("clarity_specialist:"),
      )
    ).length;
    const conditionBoostCount = traces.filter((trace) =>
      trace &&
      hasReason(trace, (reason) => reason.startsWith("condition_window:"))
    ).length;
    return {
      slot: slot + 1,
      unique_pick_count: unique(ids).length,
      same_pick_rate_pct: adjacentSameRate(ids),
      presentation_group_unique_count: unique(pgs).length,
      family_group_unique_count: unique(fgs).length,
      variety_rescue_used_count: rescueCount,
      forage_boost_count: forageBoostCount,
      clarity_boost_count: clarityBoostCount,
      condition_window_boost_count: conditionBoostCount,
      top_picks: topCounts(ids, 5),
    };
  });
  const triples = runs.map((run) => {
    const picks = side === "lure" ? run.lurePicks : run.flyPicks;
    return picks.map((pick) => pick.archetype.id).join("|");
  });
  const firstTwo = runs.map((run) => {
    const picks = side === "lure" ? run.lurePicks : run.flyPicks;
    return picks.slice(0, 2).map((pick) => pick.archetype.id).join("|");
  });
  const slot12BoostDominanceCount = slotMetrics.slice(0, 2).reduce(
    (sum, metric) =>
      sum + Math.max(
        metric.forage_boost_count,
        metric.clarity_boost_count,
        metric.condition_window_boost_count,
      ),
    0,
  );
  const classification = classifySide({
    spec,
    row,
    side,
    slotSameRates: slotMetrics.map((metric) => metric.same_pick_rate_pct),
    slotUniqueCounts: slotMetrics.map((metric) => metric.unique_pick_count),
    slotPgUniqueCounts: slotMetrics.map((metric) =>
      metric.presentation_group_unique_count
    ),
    fullTripleUniqueCount: unique(triples).length,
    slot12BoostDominancePct: pct(slot12BoostDominanceCount, DATE_COUNT * 2),
  });
  return {
    side,
    classification,
    slot_metrics: slotMetrics,
    full_triple_unique_count: unique(triples).length,
    full_triple_repeat_rate_pct: duplicateRate(triples),
    adjacent_full_triple_repeat_rate_pct: adjacentSameRate(triples),
    first_two_unique_count: unique(firstTwo).length,
    first_two_repeat_rate_pct: duplicateRate(firstTwo),
    same_first_two_while_slot3_rotates: unique(firstTwo).length <= 3 &&
      unique(triples).length > unique(firstTwo).length,
  };
}

function topCounts(values: readonly string[], limit: number) {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([id, count]) => ({ id, count }));
}

function frogSummary(
  spec: ContextSpec,
  row: SeasonalRowV4,
  runs: readonly ReturnType<typeof runContextDate>[],
) {
  const southernContext = row.species === "largemouth_bass" &&
    row.water_type === "freshwater_lake_pond" &&
    SOUTHERN_LMB_LAKE_REGIONS.has(row.region_key) &&
    row.month >= 3 &&
    row.month <= 10 &&
    row.surface_seasonally_possible;
  let surfaceSlotDates = 0;
  let candidateDates = 0;
  let finalistDates = 0;
  let pickDates = 0;
  for (const run of runs) {
    const surfaceSlot = run.profiles.some((profile) =>
      profile.column === "surface"
    );
    if (!southernContext || !surfaceSlot || !run.surfaceOpen) continue;
    surfaceSlotDates++;
    const traces = [...run.lureTraces, ...run.flyTraces].filter((trace) =>
      trace.profile.column === "surface"
    );
    const candidate = traces.some((trace) =>
      trace.candidateScores.some((score) =>
        score.id === "hollow_body_frog" || score.id === "frog_fly"
      )
    );
    const finalist = traces.some((trace) =>
      trace.finalistIds.some((id) =>
        id === "hollow_body_frog" || id === "frog_fly"
      )
    );
    const pick = [...run.lurePicks, ...run.flyPicks].some((slotPick) =>
      slotPick.archetype.id === "hollow_body_frog" ||
      slotPick.archetype.id === "frog_fly"
    );
    if (candidate) candidateDates++;
    if (finalist) finalistDates++;
    if (pick) pickDates++;
  }
  return {
    context_id: spec.id,
    southern_lmb_surface_context: southernContext,
    surface_slot_dates: surfaceSlotDates,
    frog_candidate_rate_pct: pct(candidateDates, surfaceSlotDates),
    frog_finalist_rate_pct: pct(finalistDates, surfaceSlotDates),
    frog_pick_rate_pct: pct(pickDates, surfaceSlotDates),
  };
}

function runSlotStickinessAudit() {
  return CONTEXTS.map((spec) => {
    const row = findRepresentativeRow(spec);
    const runs = Array.from(
      { length: DATE_COUNT },
      (_, i) => runContextDate(spec, row, addDays(spec.start_date, i)),
    );
    return {
      context_id: spec.id,
      label: spec.label,
      row_key: rowKey(row),
      clarity: spec.clarity,
      regime: spec.regime,
      wind_band: spec.wind_band,
      date_count: DATE_COUNT,
      lure: analyzeSide(spec, row, runs, "lure"),
      fly: analyzeSide(spec, row, runs, "fly"),
      frog_summary: frogSummary(spec, row, runs),
    };
  });
}

function flyCompatibleWithRow(
  fly: ArchetypeProfileV4,
  row: SeasonalRowV4,
): boolean {
  if (!fly.species_allowed.includes(row.species)) return false;
  if (!fly.water_types_allowed.includes(row.water_type)) return false;
  if (!row.column_range.includes(fly.column)) return false;
  if (!row.pace_range.includes(fly.primary_pace)) return false;
  if (
    fly.column === "surface" &&
    (!row.surface_seasonally_possible || !row.column_range.includes("surface"))
  ) {
    return false;
  }
  if (row.excluded_fly_ids?.includes(fly.id as FlyArchetypeIdV4)) return false;
  return true;
}

function authoredCompatibleFlyPresentationGroups(
  row: SeasonalRowV4,
  fly: ArchetypeProfileV4,
) {
  const groups = new Set<string>();
  for (const id of row.primary_fly_ids) {
    const candidate = FLY_BY_ID.get(id);
    if (!candidate) continue;
    if (candidate.column !== fly.column) continue;
    if (!row.pace_range.includes(candidate.primary_pace)) continue;
    groups.add(candidate.presentation_group);
  }
  return groups;
}

function seasonalSense(
  id: NewFlyId,
  row: SeasonalRowV4,
): { recommend: boolean; reason: string } {
  const forage = new Set(
    [row.primary_forage, row.secondary_forage].filter(Boolean),
  );
  const warmMonth = row.month >= 4 && row.month <= 10;
  const summerSurfaceMonth = row.month >= 5 && row.month <= 9;
  if (id === "warmwater_crawfish_fly") {
    if (
      row.species !== "largemouth_bass" && row.species !== "smallmouth_bass"
    ) {
      return { recommend: false, reason: "not a bass row" };
    }
    if (!forage.has("crawfish")) {
      return {
        recommend: false,
        reason: "row forage does not include crawfish",
      };
    }
    if (!warmMonth) {
      return { recommend: false, reason: "cold-month craw posture" };
    }
    return {
      recommend: true,
      reason: "bass crawfish bottom row in warm season",
    };
  }
  if (id === "warmwater_worm_fly") {
    if (
      row.species !== "largemouth_bass" && row.species !== "smallmouth_bass"
    ) {
      return { recommend: false, reason: "not a bass row" };
    }
    if (!forage.has("leech_worm")) {
      return {
        recommend: false,
        reason: "row forage does not include leech_worm",
      };
    }
    return { recommend: true, reason: "bass leech/worm bottom row" };
  }
  if (id === "foam_gurgler_fly") {
    if (!row.surface_seasonally_possible) {
      return { recommend: false, reason: "surface seasonally blocked" };
    }
    if (!summerSurfaceMonth) {
      return { recommend: false, reason: "outside warm surface window" };
    }
    return { recommend: true, reason: "warm surface row" };
  }
  if (id === "pike_flash_fly") {
    if (row.species !== "northern_pike") {
      return { recommend: false, reason: "not a pike row" };
    }
    if (!warmMonth) return { recommend: false, reason: "cold-month pike row" };
    if (!forage.has("baitfish") && !forage.has("bluegill_perch")) {
      return { recommend: false, reason: "row forage is not baitfish/perch" };
    }
    return { recommend: true, reason: "warm pike baitfish upper row" };
  }
  return { recommend: false, reason: "unknown new fly id" };
}

function rowInclusionAudit() {
  return NEW_FLY_IDS.map((id) => {
    const fly = FLY_BY_ID.get(id)!;
    const authoredRows = ALL_ROWS.filter((row) =>
      row.primary_fly_ids.includes(id)
    );
    const eligibleRows = ALL_ROWS.filter((row) =>
      !row.primary_fly_ids.includes(id) && flyCompatibleWithRow(fly, row)
    );
    const recommendations = [];
    const notRecommended = [];
    for (const row of eligibleRows) {
      const sense = seasonalSense(id, row);
      const currentGroups = authoredCompatibleFlyPresentationGroups(row, fly);
      const improvesMacroDiversity =
        !currentGroups.has(fly.presentation_group) &&
        currentGroups.size < 3;
      const entry = {
        row_key: rowKey(row),
        current_lane_presentation_groups: currentGroups.size,
        reason: sense.reason,
        improves_macro_diversity: improvesMacroDiversity,
      };
      if (sense.recommend && improvesMacroDiversity) {
        recommendations.push(entry);
      } else {
        notRecommended.push(entry);
      }
    }
    return {
      id,
      display_name: fly.display_name,
      authored_row_count: authoredRows.length,
      eligible_not_authored_count: eligibleRows.length,
      recommended_row_count: recommendations.length,
      not_recommended_count: notRecommended.length,
      recommendation_groups: groupRows(recommendations.map((r) => r.row_key)),
      sample_recommended_rows: recommendations.slice(0, 24),
      sample_not_recommended_rows: notRecommended.slice(0, 16),
    };
  });
}

function groupRows(rowKeys: readonly string[]) {
  const groups = new Map<string, { count: number; months: Set<number> }>();
  for (const key of rowKeys) {
    const [species, region, water, monthRaw] = key.split("|");
    const groupKey = `${species}|${region}|${water}`;
    const entry = groups.get(groupKey) ??
      { count: 0, months: new Set<number>() };
    entry.count++;
    entry.months.add(Number(monthRaw));
    groups.set(groupKey, entry);
  }
  return [...groups.entries()]
    .map(([group, value]) => ({
      group,
      count: value.count,
      months: [...value.months].sort((a, b) => a - b),
    }))
    .sort((a, b) => b.count - a.count || a.group.localeCompare(b.group));
}

function classificationCounts(
  results: ReturnType<typeof runSlotStickinessAudit>,
) {
  const counts: Record<string, number> = {};
  for (const result of results) {
    for (const side of [result.lure, result.fly]) {
      counts[side.classification] = (counts[side.classification] ?? 0) + 1;
    }
  }
  return Object.fromEntries(
    Object.entries(counts).sort((a, b) =>
      b[1] - a[1] || a[0].localeCompare(b[0])
    ),
  );
}

function writeMarkdown(report: {
  generated_at: string;
  slot_stickiness: ReturnType<typeof runSlotStickinessAudit>;
  row_inclusion: ReturnType<typeof rowInclusionAudit>;
}) {
  const md: string[] = [];
  const sticky = report.slot_stickiness.flatMap((context) =>
    [context.lure, context.fly].map((side) => ({ context, side }))
  );
  const worst = sticky.filter(({ side }) =>
    side.classification !== "healthy_rotation" &&
    side.classification !== "honest_narrow_winter_lane"
  );
  const healthy = sticky.filter(({ side }) =>
    side.classification === "healthy_rotation"
  );
  const slot12Sticky = sticky.filter(({ side }) =>
    side.classification === "slot_1_sticky" ||
    side.classification === "slot_2_sticky" ||
    side.classification === "first_two_sticky"
  );
  const selectorReview = sticky.filter(({ side }) =>
    side.classification === "needs_selector_weight_review"
  );
  const remainingRowRecommendations = report.row_inclusion.reduce(
    (sum, fly) => sum + fly.recommended_row_count,
    0,
  );
  md.push("# Recommender rebuild - slot stickiness and row inclusion audit");
  md.push("");
  md.push(`Generated: **${report.generated_at}**`);
  md.push("");
  md.push("## Executive Conclusion");
  md.push("");
  md.push(
    remainingRowRecommendations === 0
      ? "Representative 30-date windows do not show remaining new-fly row additions. Sticky warm fly contexts are now better treated as fly-side structural thinness review, not missing authored rows."
      : slot12Sticky.length === 0 && selectorReview.length === 0
      ? "Representative 30-date windows do not show a systemic slot-1/slot-2 lock-in problem. Remaining weak spots are better explained by authored row inclusion and honest narrow winter lanes than by selector weight dominance."
      : "Representative 30-date windows show some sticky contexts that need review before changing selector weights. The strongest next step is to address row inclusion for the new flies first, then re-run this audit before selector tuning.",
  );
  md.push("");
  md.push("## Slot Stickiness Summary");
  md.push("");
  for (
    const [classification, count] of Object.entries(
      classificationCounts(report.slot_stickiness),
    )
  ) {
    md.push(`- ${classification}: ${count}`);
  }
  md.push("");
  md.push("## Worst Sticky Contexts");
  md.push("");
  if (worst.length === 0) {
    md.push("- None outside honest winter/narrow lanes.");
  } else {
    for (const { context, side } of worst.slice(0, 12)) {
      const slotBits = side.slot_metrics.map((slot) =>
        `S${slot.slot} ${slot.unique_pick_count} unique / ${slot.same_pick_rate_pct}% same`
      ).join("; ");
      md.push(
        `- ${context.label} (${side.side}): ${side.classification}; ${slotBits}; triples ${side.full_triple_unique_count}/30.`,
      );
    }
  }
  md.push("");
  md.push("## Healthy Contexts");
  md.push("");
  for (const { context, side } of healthy.slice(0, 12)) {
    md.push(
      `- ${context.label} (${side.side}): ${side.full_triple_unique_count}/30 unique triples.`,
    );
  }
  md.push("");
  md.push("## Southern LMB Frog/Date-Rotation Summary");
  md.push("");
  for (
    const context of report.slot_stickiness.filter((item) =>
      item.frog_summary.southern_lmb_surface_context
    )
  ) {
    const frog = context.frog_summary;
    md.push(
      `- ${context.label}: ${frog.surface_slot_dates} surface-slot dates; candidate/finalist/pick ${frog.frog_candidate_rate_pct}% / ${frog.frog_finalist_rate_pct}% / ${frog.frog_pick_rate_pct}%.`,
    );
  }
  md.push("");
  md.push("## Are Slot 1/2 Too Deterministic?");
  md.push("");
  md.push(
    slot12Sticky.length === 0
      ? "No broad slot-1/slot-2 determinism was detected in the representative set. Sticky cases are either winter/narrow or fly-side structural thinness review."
      : `${slot12Sticky.length} side-contexts had slot-1/slot-2 stickiness and should be reviewed after row inclusion changes.`,
  );
  md.push("");
  md.push("## Are Boost Reasons Dominating Slots 1/2?");
  md.push("");
  md.push(
    selectorReview.length === 0
      ? "No side-context was classified as needing selector weight review from forage/clarity/condition dominance. Boosts appear to influence scoring without fully dictating the first two slots in this sample."
      : `${selectorReview.length} side-contexts were flagged for selector weight review because one boost family dominated slot 1/2 chosen candidates.`,
  );
  md.push("");
  md.push("## New Fly Row Inclusion Recommendations");
  md.push("");
  for (const fly of report.row_inclusion) {
    md.push(
      `### ${fly.display_name} (${fly.id})`,
    );
    md.push("");
    md.push(
      `- Authored rows now: ${fly.authored_row_count}; eligible-not-authored rows: ${fly.eligible_not_authored_count}; recommended rows: ${fly.recommended_row_count}.`,
    );
    for (const group of fly.recommendation_groups.slice(0, 12)) {
      md.push(
        `- Add to ${group.group} months ${
          group.months.join(", ")
        } (${group.count} rows).`,
      );
    }
    if (fly.recommendation_groups.length === 0) {
      md.push("- No row additions recommended from this audit.");
    }
    md.push("");
  }
  md.push("## Rows Intentionally Left Unchanged");
  md.push("");
  md.push(
    "- Cold winter rows where narrow slow/bottom posture is biologically honest.",
  );
  md.push(
    "- Trout rows for these four new flies; none of the new flies are trout archetypes.",
  );
  md.push("- Surface rows outside warm months for `foam_gurgler_fly`.");
  md.push(
    "- Pike rows outside baitfish/perch upper-column posture for `pike_flash_fly`.",
  );
  md.push("");
  md.push("## Recommended Next Implementation Pass");
  md.push("");
  md.push(
    remainingRowRecommendations === 0
      ? "Do not add more rows from this audit. Remaining warm fly-side stickiness should be treated as structural thinness review; inspect real scenario outputs before any selector-weight tuning."
      : "Implement targeted seasonal row additions for the recommended new fly rows, then rerun this audit and the existing geometry/repeat-cause audits. Do not tune selector weights unless slot stickiness remains after row inclusion.",
  );
  md.push("");
  md.push(`Full machine-readable report: \`${JSON_PATH}\`.`);
  Deno.writeTextFileSync(MD_PATH, md.join("\n") + "\n");
}

function main() {
  const generated_at = new Date().toISOString();
  const slot_stickiness = runSlotStickinessAudit();
  const row_inclusion = rowInclusionAudit();
  const report = {
    generated_at,
    date_count: DATE_COUNT,
    contexts: CONTEXTS,
    slot_stickiness,
    row_inclusion,
  };
  Deno.mkdirSync(OUT_DIR, { recursive: true });
  Deno.writeTextFileSync(JSON_PATH, JSON.stringify(report, null, 2));
  writeMarkdown({ generated_at, slot_stickiness, row_inclusion });
  console.log(`Wrote ${JSON_PATH}`);
  console.log(`Wrote ${MD_PATH}`);
  console.log(
    `Classifications: ${JSON.stringify(classificationCounts(slot_stickiness))}`,
  );
}

main();
