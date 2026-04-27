/**
 * Focused QA audit for trout river recommendation quality.
 *
 * Audit-only: inspects real selector outputs and traces across representative
 * trout river contexts without changing selector behavior, catalog eligibility,
 * seasonal rows, generated files, or UI/copy.
 *
 * Usage:
 *   deno run -A scripts/audit-recommender-trout-river-quality-qa.ts
 */
import type { WaterClarity } from "../supabase/functions/_shared/recommenderEngine/contracts/input.ts";
import type {
  ArchetypeProfileV4,
  SeasonalRowV4,
} from "../supabase/functions/_shared/recommenderEngine/v4/contracts.ts";
import { LURE_ARCHETYPES_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/candidates/lures.ts";
import { FLY_ARCHETYPES_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/candidates/flies.ts";
import { TROUT_SEASONAL_ROWS_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/trout.ts";
import {
  buildTargetProfiles,
  computeSurfaceBlocked,
  type DailyRegime,
} from "../supabase/functions/_shared/recommenderEngine/rebuild/shapeProfiles.ts";
import {
  meanDaylightWindMph,
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

type Side = "lure" | "fly";

type Scenario = {
  id: string;
  label: string;
  region_key: string;
  month: number;
  start_date: string;
  water_clarity: WaterClarity;
  regime: DailyRegime;
  wind_mph: number;
  expected: string;
  winter_narrow_ok?: boolean;
  surface_mouse_expected?: boolean;
  mouse_valid_scenario?: boolean;
  surface_block_expected?: boolean;
  clear_subtle_expected?: boolean;
};

const OUT_DIR = "docs/audits/recommender-rebuild";
const JSON_PATH = `${OUT_DIR}/trout-river-quality-qa.json`;
const MD_PATH = `${OUT_DIR}/trout-river-quality-qa.md`;
const DATE_COUNT = 7;
const WATER_TYPE: SeasonalRowV4["water_type"] = "freshwater_river";

const ALL_ARCHETYPES = [...LURE_ARCHETYPES_V4, ...FLY_ARCHETYPES_V4];
const ARCHETYPE_BY_ID = new Map<string, ArchetypeProfileV4>(
  ALL_ARCHETYPES.map((item) => [item.id, item]),
);

const TROUT_APPROPRIATE_LURE_IDS = new Set([
  "hair_jig",
  "ned_rig",
  "blade_bait",
  "casting_spoon",
  "inline_spinner",
  "small_floating_trout_plug",
  "suspending_jerkbait",
  "soft_jerkbait",
]);

const QUESTIONABLE_BASS_FEELING_LURE_IDS = new Set([
  "tube_jig",
  "squarebill_crankbait",
  "flat_sided_crankbait",
  "lipless_crankbait",
  "walking_topwater",
  "popping_topwater",
]);

const CLEAR_SUBTLE_TROUT_IDS = new Set([
  "suspending_jerkbait",
  "soft_jerkbait",
  "slim_minnow_streamer",
  "unweighted_baitfish_streamer",
  "sculpin_streamer",
  "muddler_sculpin",
  "sculpzilla",
  "woolly_bugger",
]);

const TROUT_APPROPRIATE_FLY_IDS = new Set([
  "muddler_sculpin",
  "rabbit_strip_leech",
  "jighead_marabou_leech",
  "lead_eye_leech",
  "feather_jig_leech",
  "sculpin_streamer",
  "sculpzilla",
  "articulated_dungeon_streamer",
  "woolly_bugger",
  "articulated_baitfish_streamer",
  "bucktail_baitfish_streamer",
  "clouser_minnow",
  "conehead_streamer",
  "game_changer",
  "zonker_streamer",
  "crawfish_streamer",
  "slim_minnow_streamer",
  "unweighted_baitfish_streamer",
  "baitfish_slider_fly",
]);

const MOUSE_AND_SURFACE_FLY_IDS = new Set([
  "mouse_fly",
  "popper_fly",
  "deer_hair_slider",
]);

const STREAMER_LEECH_BUGGER_FLY_IDS = new Set([
  "muddler_sculpin",
  "rabbit_strip_leech",
  "jighead_marabou_leech",
  "lead_eye_leech",
  "feather_jig_leech",
  "sculpin_streamer",
  "sculpzilla",
  "articulated_dungeon_streamer",
  "woolly_bugger",
  "articulated_baitfish_streamer",
  "bucktail_baitfish_streamer",
  "clouser_minnow",
  "conehead_streamer",
  "game_changer",
  "zonker_streamer",
  "slim_minnow_streamer",
  "unweighted_baitfish_streamer",
  "baitfish_slider_fly",
]);

const SCENARIOS: readonly Scenario[] = [
  {
    id: "mountain_west_trout_river_january_clear_cold",
    label: "Mountain West trout river January clear cold",
    region_key: "mountain_west",
    month: 1,
    start_date: "2026-01-12",
    water_clarity: "clear",
    regime: "suppressive",
    wind_mph: 8,
    expected:
      "Cold-water trout river should bias slower/deeper: hair jig, spoon/spinner/jerkbait where legal, and sculpin/leech/bugger style flies without warmwater/bass feel.",
    winter_narrow_ok: true,
  },
  {
    id: "mountain_west_trout_river_may_clear_moderate",
    label: "Mountain West trout river May clear moderate",
    region_key: "mountain_west",
    month: 5,
    start_date: "2026-05-08",
    water_clarity: "clear",
    regime: "neutral",
    wind_mph: 7,
    expected:
      "Spring trout river should mix inline spinner, spoon, hair jig, suspending jerkbait, sculpin/leech/bugger/streamer flies, and avoid over-indexing on bass-style crankbaits/tubes/ned.",
    clear_subtle_expected: true,
  },
  {
    id: "great_lakes_trout_river_july_clear_active",
    label: "Great Lakes Upper Midwest trout river July clear active",
    region_key: "great_lakes_upper_midwest",
    month: 7,
    start_date: "2026-07-03",
    water_clarity: "clear",
    regime: "aggressive",
    wind_mph: 8,
    expected:
      "Summer trout river should show subtle baitfish/sculpin/bugger options with some surface possibility if legal and conditions allow.",
    mouse_valid_scenario: true,
    clear_subtle_expected: true,
  },
  {
    id: "appalachian_trout_river_august_clear_calm_surface",
    label: "Appalachian trout river August clear calm surface-open",
    region_key: "appalachian",
    month: 8,
    start_date: "2026-08-07",
    water_clarity: "clear",
    regime: "aggressive",
    wind_mph: 2,
    expected:
      "Calm aggressive summer trout river should make mouse/surface flies visible sometimes without hard-locking the trio.",
    surface_mouse_expected: true,
    mouse_valid_scenario: true,
    clear_subtle_expected: true,
  },
  {
    id: "appalachian_trout_river_august_clear_windy_blocked",
    label: "Appalachian trout river August clear windy/surface-blocked",
    region_key: "appalachian",
    month: 8,
    start_date: "2026-08-14",
    water_clarity: "clear",
    regime: "aggressive",
    wind_mph: 22,
    expected:
      "Windy summer trout river should remove surface/mouse/topwater and shift to subsurface trout tools.",
    surface_block_expected: true,
    clear_subtle_expected: true,
  },
  {
    id: "mountain_west_trout_river_october_stained_fall",
    label: "Mountain West trout river October stained fall active",
    region_key: "mountain_west",
    month: 10,
    start_date: "2026-10-09",
    water_clarity: "stained",
    regime: "neutral",
    wind_mph: 9,
    expected:
      "Fall stained trout river can lean streamer/reaction/sculpin/baitfish/leech, but should still feel trout rather than bass.",
  },
  {
    id: "southern_california_trout_river_june_clear",
    label: "Southern California trout river June clear warm-season",
    region_key: "southern_california",
    month: 6,
    start_date: "2026-06-12",
    water_clarity: "clear",
    regime: "neutral",
    wind_mph: 6,
    expected:
      "Regional warm-season trout row should remain trout-plausible and avoid goofy warmwater-heavy output.",
    clear_subtle_expected: true,
  },
];

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

function hourlyWindUniform(localDate: string, mph: number) {
  return Array.from({ length: 24 }, (_, hour) => ({
    time_utc: `${localDate}T${String(hour).padStart(2, "0")}:00:00Z`,
    value: mph,
  }));
}

function regimeToHows0to100(regime: DailyRegime): number {
  if (regime === "suppressive") return 30;
  if (regime === "neutral") return 50;
  return 75;
}

function rowKey(row: SeasonalRowV4): string {
  return `${row.species}|${row.region_key}|${row.water_type}|${row.month}`;
}

function findTroutRiverRow(scenario: Scenario): SeasonalRowV4 {
  const row = TROUT_SEASONAL_ROWS_V4.find((candidate) =>
    candidate.region_key === scenario.region_key &&
    candidate.water_type === WATER_TYPE &&
    candidate.month === scenario.month &&
    candidate.state_code == null
  );
  if (!row) throw new Error(`Missing trout river row for ${scenario.id}`);
  return row;
}

function chosenReasons(trace: RebuildSlotSelectionTrace): readonly string[] {
  if (!trace.chosenId) return [];
  return trace.candidateScores.find((score) => score.id === trace.chosenId)
    ?.reasons ?? [];
}

function topCandidateScores(trace: RebuildSlotSelectionTrace, limit = 6) {
  return [...trace.candidateScores]
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    .slice(0, limit);
}

function pickDetails(ids: readonly string[]) {
  return ids.map((id) => {
    const archetype = ARCHETYPE_BY_ID.get(id);
    return {
      id,
      presentation_group: archetype?.presentation_group ?? "missing",
      family_group: archetype?.family_group ?? "missing",
      column: archetype?.column ?? "missing",
      is_surface: archetype?.is_surface ?? false,
    };
  });
}

function runScenarioDate(
  scenario: Scenario,
  row: SeasonalRowV4,
  localDate: string,
) {
  const env_data = {
    weather: { wind_speed_unit: "mph" },
    hourly_wind_speed: hourlyWindUniform(localDate, scenario.wind_mph),
  };
  const daylightWindMph = meanDaylightWindMph({
    env_data,
    local_date: localDate,
    local_timezone: "America/Denver",
  });
  const surfaceBlocked = computeSurfaceBlocked({ row, daylightWindMph });
  const profiles = buildTargetProfiles({
    row,
    regime: scenario.regime,
    surfaceBlocked,
  });
  const surfaceOpen = row.column_range.includes("surface") &&
    row.surface_seasonally_possible &&
    !surfaceBlocked;
  const surfaceSlotPresent = profiles.some((profile) =>
    profile.column === "surface"
  );
  const windBand = windBandFromDaylightWindMph(daylightWindMph);
  const seedBase = `trout-river-quality-qa|${scenario.id}|${
    regimeToHows0to100(scenario.regime)
  }|${localDate}|${scenario.region_key}|trout|${WATER_TYPE}|${scenario.water_clarity}`;
  const lureTraces: RebuildSlotSelectionTrace[] = [];
  const flyTraces: RebuildSlotSelectionTrace[] = [];
  const lureConditionState: LureDailyConditionState = {
    regime: scenario.regime,
    water_clarity: scenario.water_clarity,
    surface_allowed_today: surfaceOpen,
    surface_slot_present: surfaceSlotPresent,
    daylight_wind_mph: daylightWindMph,
    wind_band: windBand,
  };
  const flyConditionState: FlyDailyConditionState = {
    regime: scenario.regime,
    surface_allowed_today: surfaceOpen,
    surface_slot_present: surfaceSlotPresent,
    daylight_wind_mph: daylightWindMph,
    wind_band: windBand,
    species: row.species,
    context: row.water_type,
    month: row.month,
  };
  const lurePicks = selectArchetypesForSide({
    side: "lure",
    row,
    species: row.species,
    context: row.water_type,
    water_clarity: scenario.water_clarity,
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
    water_clarity: scenario.water_clarity,
    profiles,
    surfaceBlocked,
    seedBase,
    currentLocalDate: localDate,
    flyConditionState,
    onSlotTrace: (trace) => flyTraces.push(trace),
  });
  return {
    local_date: localDate,
    wind_band: windBand,
    daylight_wind_mph: daylightWindMph,
    surface_open: surfaceOpen,
    surface_blocked: surfaceBlocked,
    target_profiles: profiles,
    lure_ids: lurePicks.map((pick) => pick.archetype.id),
    fly_ids: flyPicks.map((pick) => pick.archetype.id),
    lure_picks: pickDetails(lurePicks.map((pick) => pick.archetype.id)),
    fly_picks: pickDetails(flyPicks.map((pick) => pick.archetype.id)),
    lure_trace_summary: summarizeTraces(lureTraces, "lure"),
    fly_trace_summary: summarizeTraces(flyTraces, "fly"),
    lure_signature: lurePicks.map((pick) => pick.archetype.id).join("|"),
    fly_signature: flyPicks.map((pick) => pick.archetype.id).join("|"),
    first_two_lure_signature: lurePicks.slice(0, 2).map((pick) =>
      pick.archetype.id
    ).join("|"),
    first_two_fly_signature: flyPicks.slice(0, 2).map((pick) =>
      pick.archetype.id
    ).join("|"),
  };
}

function summarizeTraces(
  traces: readonly RebuildSlotSelectionTrace[],
  side: Side,
) {
  return traces.map((trace) => ({
    slot: trace.slot + 1,
    profile: trace.profile,
    chosen_id: trace.chosenId,
    chosen_reasons: chosenReasons(trace),
    finalist_ids: trace.finalistIds,
    condition_window: trace.conditionWindow,
    condition_chosen: chosenReasons(trace).some((reason) =>
      reason.startsWith("condition_window:")
    ),
    clarity_chosen: chosenReasons(trace).some((reason) =>
      reason.startsWith("clarity_strength:") ||
      reason.startsWith("clarity_specialist:")
    ),
    trout_appropriate_candidate_ids: trace.candidateScores
      .filter((score) =>
        side === "lure"
          ? TROUT_APPROPRIATE_LURE_IDS.has(score.id)
          : TROUT_APPROPRIATE_FLY_IDS.has(score.id) ||
            MOUSE_AND_SURFACE_FLY_IDS.has(score.id)
      )
      .map((score) => score.id),
    trout_appropriate_finalist_ids: trace.finalistIds.filter((id) =>
      side === "lure"
        ? TROUT_APPROPRIATE_LURE_IDS.has(id)
        : TROUT_APPROPRIATE_FLY_IDS.has(id) ||
          MOUSE_AND_SURFACE_FLY_IDS.has(id)
    ),
    questionable_candidate_ids: side === "lure"
      ? trace.candidateScores
        .filter((score) => QUESTIONABLE_BASS_FEELING_LURE_IDS.has(score.id))
        .map((score) => score.id)
      : [],
    clear_subtle_candidate_ids: trace.candidateScores
      .filter((score) => CLEAR_SUBTLE_TROUT_IDS.has(score.id))
      .map((score) => score.id),
    mouse_candidate: trace.candidateScores.some((score) =>
      score.id === "mouse_fly"
    ),
    mouse_finalist: trace.finalistIds.includes("mouse_fly"),
    top_candidate_scores: topCandidateScores(trace),
  }));
}

function duplicateValues(values: readonly string[]): string[] {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()].filter(([, count]) => count > 1).map(([value]) =>
    value
  );
}

function unique<T>(items: readonly T[]): T[] {
  return [...new Set(items)];
}

function topCounts(items: readonly string[]) {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item, (counts.get(item) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([id, count]) => ({ id, count }));
}

function deterministicEqual(
  a: ReturnType<typeof runScenarioDate>,
  b: ReturnType<typeof runScenarioDate>,
): boolean {
  return a.lure_signature === b.lure_signature &&
    a.fly_signature === b.fly_signature;
}

function validateRun(
  run: ReturnType<typeof runScenarioDate>,
): string[] {
  const failures: string[] = [];
  for (const side of ["lure", "fly"] as const) {
    const picks = side === "lure" ? run.lure_picks : run.fly_picks;
    if (picks.length !== 3) failures.push(`${side} returned ${picks.length}`);
    for (const id of duplicateValues(picks.map((pick) => pick.id))) {
      failures.push(`${side} duplicate id ${id}`);
    }
    for (const pick of picks) {
      const archetype = ARCHETYPE_BY_ID.get(pick.id);
      if (!archetype) {
        failures.push(`${side} unknown id ${pick.id}`);
        continue;
      }
      if (!archetype.species_allowed.includes("trout")) {
        failures.push(`${side} ${pick.id} is not trout eligible`);
      }
      if (!archetype.water_types_allowed.includes(WATER_TYPE)) {
        failures.push(`${side} ${pick.id} invalid for ${WATER_TYPE}`);
      }
      if (run.surface_blocked && archetype.is_surface) {
        failures.push(`${side} ${pick.id} surface pick while blocked`);
      }
    }
  }
  return failures;
}

function scenarioSignals(runs: readonly ReturnType<typeof runScenarioDate>[]) {
  let troutLureCandidateDates = 0;
  let troutLureFinalistDates = 0;
  let troutLurePickDates = 0;
  let troutFlyCandidateDates = 0;
  let troutFlyFinalistDates = 0;
  let troutFlyPickDates = 0;
  let conditionChosenDates = 0;
  let clarityChosenDates = 0;
  let surfacePickDates = 0;
  let bassFeelingLurePickDates = 0;
  let mouseCandidateDates = 0;
  let mouseFinalistDates = 0;
  let mousePickDates = 0;
  let clearSubtleCandidateDates = 0;
  let clearSubtlePickDates = 0;
  let streamerLeechOnlyDates = 0;
  for (const run of runs) {
    if (
      run.lure_trace_summary.some((trace) =>
        trace.trout_appropriate_candidate_ids.length > 0
      )
    ) troutLureCandidateDates++;
    if (
      run.lure_trace_summary.some((trace) =>
        trace.trout_appropriate_finalist_ids.length > 0
      )
    ) troutLureFinalistDates++;
    if (run.lure_ids.some((id) => TROUT_APPROPRIATE_LURE_IDS.has(id))) {
      troutLurePickDates++;
    }
    if (
      run.fly_trace_summary.some((trace) =>
        trace.trout_appropriate_candidate_ids.length > 0
      )
    ) troutFlyCandidateDates++;
    if (
      run.fly_trace_summary.some((trace) =>
        trace.trout_appropriate_finalist_ids.length > 0
      )
    ) troutFlyFinalistDates++;
    if (
      run.fly_ids.some((id) =>
        TROUT_APPROPRIATE_FLY_IDS.has(id) || MOUSE_AND_SURFACE_FLY_IDS.has(id)
      )
    ) troutFlyPickDates++;
    if (
      [...run.lure_trace_summary, ...run.fly_trace_summary].some((trace) =>
        trace.condition_chosen
      )
    ) conditionChosenDates++;
    if (
      [...run.lure_trace_summary, ...run.fly_trace_summary].some((trace) =>
        trace.clarity_chosen
      )
    ) clarityChosenDates++;
    if (
      [...run.lure_picks, ...run.fly_picks].some((pick) => pick.is_surface)
    ) surfacePickDates++;
    if (
      run.lure_ids.some((id) => QUESTIONABLE_BASS_FEELING_LURE_IDS.has(id))
    ) bassFeelingLurePickDates++;
    if (run.fly_trace_summary.some((trace) => trace.mouse_candidate)) {
      mouseCandidateDates++;
    }
    if (run.fly_trace_summary.some((trace) => trace.mouse_finalist)) {
      mouseFinalistDates++;
    }
    if (run.fly_ids.includes("mouse_fly")) mousePickDates++;
    if (
      [...run.lure_trace_summary, ...run.fly_trace_summary].some((trace) =>
        trace.clear_subtle_candidate_ids.length > 0
      )
    ) clearSubtleCandidateDates++;
    if (
      [...run.lure_ids, ...run.fly_ids].some((id) =>
        CLEAR_SUBTLE_TROUT_IDS.has(id)
      )
    ) clearSubtlePickDates++;
    if (
      run.fly_ids.every((id) => STREAMER_LEECH_BUGGER_FLY_IDS.has(id))
    ) streamerLeechOnlyDates++;
  }
  return {
    trout_lure_candidate_dates: troutLureCandidateDates,
    trout_lure_finalist_dates: troutLureFinalistDates,
    trout_lure_pick_dates: troutLurePickDates,
    trout_fly_candidate_dates: troutFlyCandidateDates,
    trout_fly_finalist_dates: troutFlyFinalistDates,
    trout_fly_pick_dates: troutFlyPickDates,
    condition_chosen_dates: conditionChosenDates,
    clarity_chosen_dates: clarityChosenDates,
    surface_pick_dates: surfacePickDates,
    bass_feeling_lure_pick_dates: bassFeelingLurePickDates,
    mouse_candidate_dates: mouseCandidateDates,
    mouse_finalist_dates: mouseFinalistDates,
    mouse_pick_dates: mousePickDates,
    clear_subtle_candidate_dates: clearSubtleCandidateDates,
    clear_subtle_pick_dates: clearSubtlePickDates,
    streamer_leech_only_dates: streamerLeechOnlyDates,
  };
}

function analyzeScenario(scenario: Scenario) {
  const row = findTroutRiverRow(scenario);
  const runs = Array.from(
    { length: DATE_COUNT },
    (_, day) =>
      runScenarioDate(scenario, row, addDays(scenario.start_date, day)),
  );
  const deterministicFailures: string[] = [];
  for (const run of runs) {
    const rerun = runScenarioDate(scenario, row, run.local_date);
    if (!deterministicEqual(run, rerun)) {
      deterministicFailures.push(run.local_date);
    }
  }
  const invariantFailures = runs.flatMap((run) =>
    validateRun(run).map((failure) => `${run.local_date}: ${failure}`)
  );
  const lureTriples = runs.map((run) => run.lure_signature);
  const flyTriples = runs.map((run) => run.fly_signature);
  const firstTwoLureTriples = runs.map((run) => run.first_two_lure_signature);
  const firstTwoFlyTriples = runs.map((run) => run.first_two_fly_signature);
  const allLureIds = runs.flatMap((run) => run.lure_ids);
  const allFlyIds = runs.flatMap((run) => run.fly_ids);
  const signals = scenarioSignals(runs);
  const reviewFlags: string[] = [];
  const bassFeelingCount =
    allLureIds.filter((id) => QUESTIONABLE_BASS_FEELING_LURE_IDS.has(id))
      .length;
  const dominantLure = topCounts(allLureIds)[0];
  const dominantFly = topCounts(allFlyIds)[0];
  const firstTwoLureSticky = unique(firstTwoLureTriples).length <= 2 &&
    unique(lureTriples).length >= 4;
  const firstTwoFlySticky = unique(firstTwoFlyTriples).length <= 2 &&
    unique(flyTriples).length >= 4;
  if (unique(lureTriples).length <= 1 && !scenario.winter_narrow_ok) {
    reviewFlags.push("lure output did not rotate in a non-winter scenario");
  }
  if (unique(flyTriples).length <= 1 && !scenario.winter_narrow_ok) {
    reviewFlags.push("fly output did not rotate in a non-winter scenario");
  }
  if (firstTwoLureSticky) {
    reviewFlags.push("first two lure slots are sticky while slot 3 rotates");
  }
  if (firstTwoFlySticky) {
    reviewFlags.push("first two fly slots are sticky while slot 3 rotates");
  }
  if (bassFeelingCount >= 8) {
    reviewFlags.push(
      `bass-feeling lure exposure is high (${bassFeelingCount}/21 picks)`,
    );
  }
  if (
    scenario.winter_narrow_ok &&
    bassFeelingCount >= 8 &&
    signals.trout_lure_pick_dates <= Math.floor(DATE_COUNT / 2)
  ) {
    reviewFlags.push("cold winter scenario may feel too warmwater/bass-like");
  }
  if (!scenario.winter_narrow_ok && dominantLure && dominantLure.count >= 5) {
    reviewFlags.push(
      `one lure archetype dominates normal scenario: ${dominantLure.id} (${dominantLure.count}/21)`,
    );
  }
  if (!scenario.winter_narrow_ok && dominantFly && dominantFly.count >= 5) {
    reviewFlags.push(
      `one fly archetype dominates normal scenario: ${dominantFly.id} (${dominantFly.count}/21)`,
    );
  }
  if (
    scenario.surface_mouse_expected &&
    signals.mouse_candidate_dates === 0
  ) {
    reviewFlags.push(
      "mouse_fly is never visible in surface-open mouse scenario",
    );
  }
  if (
    scenario.surface_mouse_expected &&
    signals.mouse_pick_dates >= DATE_COUNT - 1
  ) {
    reviewFlags.push("mouse_fly hard-locks too many surface-open dates");
  }
  if (
    !scenario.mouse_valid_scenario &&
    signals.mouse_pick_dates > 0
  ) {
    reviewFlags.push("mouse_fly picked outside valid summer/surface scenario");
  }
  if (
    scenario.surface_block_expected &&
    signals.surface_pick_dates > 0
  ) {
    reviewFlags.push("surface pick appeared in surface-blocked scenario");
  }
  if (
    scenario.clear_subtle_expected &&
    signals.clear_subtle_candidate_dates === 0
  ) {
    reviewFlags.push("clear-water scenario exposes no subtle trout tools");
  }
  if (
    scenario.surface_mouse_expected &&
    signals.streamer_leech_only_dates >= DATE_COUNT - 1
  ) {
    reviewFlags.push(
      "surface-open fly output is almost always streamer/leech/bugger only",
    );
  }
  return {
    scenario_id: scenario.id,
    label: scenario.label,
    row_key: rowKey(row),
    expected: scenario.expected,
    water_clarity: scenario.water_clarity,
    regime: scenario.regime,
    wind_mph: scenario.wind_mph,
    lure_unique_triples: unique(lureTriples).length,
    fly_unique_triples: unique(flyTriples).length,
    first_two_lure_unique_pairs: unique(firstTwoLureTriples).length,
    first_two_fly_unique_pairs: unique(firstTwoFlyTriples).length,
    first_two_lure_sticky: firstTwoLureSticky,
    first_two_fly_sticky: firstTwoFlySticky,
    trout_appropriate_lure_exposure: topCounts(
      allLureIds.filter((id) => TROUT_APPROPRIATE_LURE_IDS.has(id)),
    ),
    bass_feeling_lure_exposure: topCounts(
      allLureIds.filter((id) => QUESTIONABLE_BASS_FEELING_LURE_IDS.has(id)),
    ),
    trout_appropriate_fly_exposure: topCounts(
      allFlyIds.filter((id) => TROUT_APPROPRIATE_FLY_IDS.has(id)),
    ),
    mouse_surface_fly_exposure: topCounts(
      allFlyIds.filter((id) => MOUSE_AND_SURFACE_FLY_IDS.has(id)),
    ),
    streamer_leech_bugger_exposure: topCounts(
      allFlyIds.filter((id) => STREAMER_LEECH_BUGGER_FLY_IDS.has(id)),
    ),
    clear_subtle_exposure: topCounts(
      [...allLureIds, ...allFlyIds].filter((id) =>
        CLEAR_SUBTLE_TROUT_IDS.has(id)
      ),
    ),
    signals,
    review_flags: reviewFlags,
    deterministic_failures: deterministicFailures,
    invariant_failures: invariantFailures,
    dates: runs.map((run) => ({
      local_date: run.local_date,
      surface_blocked: run.surface_blocked,
      surface_open: run.surface_open,
      target_profiles: run.target_profiles,
      lure_ids: run.lure_ids,
      fly_ids: run.fly_ids,
      lure_picks: run.lure_picks,
      fly_picks: run.fly_picks,
      lure_trace_summary: run.lure_trace_summary,
      fly_trace_summary: run.fly_trace_summary,
      lure_repeated_presentation_groups: duplicateValues(
        run.lure_picks.map((pick) => pick.presentation_group),
      ),
      fly_repeated_presentation_groups: duplicateValues(
        run.fly_picks.map((pick) => pick.presentation_group),
      ),
      lure_repeated_family_groups: duplicateValues(
        run.lure_picks.map((pick) => pick.family_group),
      ),
      fly_repeated_family_groups: duplicateValues(
        run.fly_picks.map((pick) => pick.family_group),
      ),
      condition_chosen_slots: [
        ...run.lure_trace_summary,
        ...run.fly_trace_summary,
      ].filter((trace) => trace.condition_chosen).map((trace) => ({
        slot: trace.slot,
        chosen_id: trace.chosen_id,
        condition_window: trace.condition_window,
      })),
    })),
  };
}

function buildReport() {
  const scenarios = SCENARIOS.map(analyzeScenario);
  const hardFailures = scenarios.flatMap((scenario) => [
    ...scenario.invariant_failures.map((failure) =>
      `${scenario.scenario_id}: ${failure}`
    ),
    ...scenario.deterministic_failures.map((date) =>
      `${scenario.scenario_id}: nondeterministic on ${date}`
    ),
  ]);
  const reviewFlags = scenarios.flatMap((scenario) =>
    scenario.review_flags.map((flag) => `${scenario.scenario_id}: ${flag}`)
  );
  const severeReviewCount =
    reviewFlags.filter((flag) =>
      flag.includes("bass-feeling lure exposure is high") ||
      flag.includes("cold winter scenario may feel") ||
      flag.includes("mouse_fly is never visible") ||
      flag.includes("surface pick appeared")
    ).length;
  const recommendation = hardFailures.length > 0
    ? "needs_targeted_trout_tuning"
    : severeReviewCount >= 3
    ? "needs_targeted_trout_tuning"
    : reviewFlags.length > 0
    ? "review_flags_but_no_immediate_tuning"
    : "ship_as_is";
  return {
    generated_at: new Date().toISOString(),
    date_count: DATE_COUNT,
    scenarios,
    hard_failures: hardFailures,
    review_flags: reviewFlags,
    recommendation,
    conservative_tuning_if_needed: {
      target:
        "If later tuning is warranted, prefer a narrow trout-river species/river-confidence nudge over hard removals.",
      possible_lure_ids: [
        "hair_jig",
        "casting_spoon",
        "inline_spinner",
        "suspending_jerkbait",
        "soft_jerkbait",
      ],
      possible_fly_ids: [
        "muddler_sculpin",
        "sculpin_streamer",
        "sculpzilla",
        "woolly_bugger",
        "slim_minnow_streamer",
        "unweighted_baitfish_streamer",
        "rabbit_strip_leech",
      ],
      possible_weight: 10,
      guardrails:
        "Soft score only after hard gates; do not override species, water, surface, column, pace, row exclusions, or recent-history/diversity protections.",
    },
  };
}

function formatCounts(
  counts: readonly { id: string; count: number }[],
): string {
  return counts.map((item) => `${item.id} (${item.count})`).join(", ") ||
    "none";
}

function renderMarkdown(report: ReturnType<typeof buildReport>): string {
  const lines: string[] = [];
  lines.push("# Recommender rebuild - trout river quality QA");
  lines.push("");
  lines.push(`Generated: **${report.generated_at}**`);
  lines.push("");
  lines.push("## Executive Conclusion");
  lines.push("");
  lines.push(
    report.hard_failures.length === 0
      ? "The focused trout river QA found no hard determinism, duplicate-ID, species/water-validity, pick-count, or surface-blocking defects. The audit does surface product-review concerns around bass-feeling lure exposure and fly dominance/stickiness in some non-winter river scenarios."
      : "The focused trout river QA found hard failures that should be fixed before product tuning.",
  );
  lines.push("");
  lines.push(`- Recommendation: **${report.recommendation}**.`);
  lines.push(`- Hard failures: **${report.hard_failures.length}**.`);
  lines.push(`- Review flags: **${report.review_flags.length}**.`);
  lines.push("");
  lines.push("## Scenario Summaries");
  lines.push("");
  for (const scenario of report.scenarios) {
    lines.push(`### ${scenario.label}`);
    lines.push("");
    lines.push(`- Row: \`${scenario.row_key}\`.`);
    lines.push(`- Expected: ${scenario.expected}`);
    lines.push(
      `- Unique triples: lure ${scenario.lure_unique_triples}/${DATE_COUNT}, fly ${scenario.fly_unique_triples}/${DATE_COUNT}.`,
    );
    lines.push(
      `- First-two-slot unique pairs: lure ${scenario.first_two_lure_unique_pairs}/${DATE_COUNT}, fly ${scenario.first_two_fly_unique_pairs}/${DATE_COUNT}.`,
    );
    lines.push(
      `- Trout lure candidate/finalist/pick dates: ${scenario.signals.trout_lure_candidate_dates}/${scenario.signals.trout_lure_finalist_dates}/${scenario.signals.trout_lure_pick_dates}.`,
    );
    lines.push(
      `- Trout fly candidate/finalist/pick dates: ${scenario.signals.trout_fly_candidate_dates}/${scenario.signals.trout_fly_finalist_dates}/${scenario.signals.trout_fly_pick_dates}.`,
    );
    lines.push(
      `- Condition/clarity chosen dates: ${scenario.signals.condition_chosen_dates}/${scenario.signals.clarity_chosen_dates}.`,
    );
    lines.push(
      `- Mouse candidate/finalist/pick dates: ${scenario.signals.mouse_candidate_dates}/${scenario.signals.mouse_finalist_dates}/${scenario.signals.mouse_pick_dates}.`,
    );
    lines.push(
      `- Trout-appropriate lures: ${
        formatCounts(scenario.trout_appropriate_lure_exposure)
      }.`,
    );
    lines.push(
      `- Bass-feeling/questionable lures: ${
        formatCounts(scenario.bass_feeling_lure_exposure)
      }.`,
    );
    lines.push(
      `- Trout-appropriate flies: ${
        formatCounts(scenario.trout_appropriate_fly_exposure)
      }.`,
    );
    lines.push(
      `- Mouse/surface flies: ${
        formatCounts(scenario.mouse_surface_fly_exposure)
      }.`,
    );
    lines.push(
      `- Streamer/leech/bugger exposure: ${
        formatCounts(scenario.streamer_leech_bugger_exposure)
      }.`,
    );
    lines.push(
      `- Clear subtle exposure: ${
        formatCounts(scenario.clear_subtle_exposure)
      }.`,
    );
    for (const flag of scenario.review_flags) lines.push(`- Review: ${flag}`);
    lines.push("");
    lines.push("| Date | Lures | Flies | Surface blocked |");
    lines.push("| --- | --- | --- | --- |");
    for (const date of scenario.dates) {
      lines.push(
        `| ${date.local_date} | ${date.lure_ids.join(", ")} | ${
          date.fly_ids.join(", ")
        } | ${date.surface_blocked ? "yes" : "no"} |`,
      );
    }
    lines.push("");
  }
  lines.push("## Hard Failures");
  lines.push("");
  if (report.hard_failures.length === 0) {
    lines.push("- None.");
  } else {
    for (const failure of report.hard_failures) lines.push(`- ${failure}`);
  }
  lines.push("");
  lines.push("## Review Flags");
  lines.push("");
  if (report.review_flags.length === 0) {
    lines.push("- None.");
  } else {
    for (const flag of report.review_flags) lines.push(`- ${flag}`);
  }
  lines.push("");
  lines.push("## Conservative Tuning Recommendation");
  lines.push("");
  if (report.recommendation === "ship_as_is") {
    lines.push("Ship as-is from this audit. No trout tuning is recommended.");
  } else if (report.recommendation === "needs_targeted_trout_tuning") {
    lines.push(
      "Targeted trout tuning is worth planning, but this audit intentionally does not implement it. Prefer a small soft trout-river confidence nudge over hard removals unless future review confirms specific catalog/row defects.",
    );
    lines.push(
      `- Possible lure IDs: ${
        report.conservative_tuning_if_needed.possible_lure_ids.join(", ")
      }.`,
    );
    lines.push(
      `- Possible fly IDs: ${
        report.conservative_tuning_if_needed.possible_fly_ids.join(", ")
      }.`,
    );
    lines.push(
      `- Possible weight: +${report.conservative_tuning_if_needed.possible_weight}.`,
    );
    lines.push(
      `- Guardrails: ${report.conservative_tuning_if_needed.guardrails}`,
    );
  } else {
    lines.push(
      "Review flags are present, but no immediate tuning is recommended from this pass. The most likely next step is a focused product review of bass-feeling lure tolerance in trout river rows.",
    );
  }
  lines.push("");
  lines.push(`Full machine-readable report: \`${JSON_PATH}\`.`);
  return lines.join("\n") + "\n";
}

function main() {
  const report = buildReport();
  Deno.mkdirSync(OUT_DIR, { recursive: true });
  Deno.writeTextFileSync(JSON_PATH, JSON.stringify(report, null, 2));
  Deno.writeTextFileSync(MD_PATH, renderMarkdown(report));
  console.log(`Wrote ${JSON_PATH}`);
  console.log(`Wrote ${MD_PATH}`);
  console.log(`Recommendation: ${report.recommendation}`);
  console.log(`Hard failures: ${report.hard_failures.length}`);
  console.log(`Review flags: ${report.review_flags.length}`);
  if (report.hard_failures.length > 0) {
    for (const failure of report.hard_failures) console.error(failure);
    Deno.exit(1);
  }
}

main();
