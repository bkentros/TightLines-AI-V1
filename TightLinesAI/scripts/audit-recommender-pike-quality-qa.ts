/**
 * Focused QA audit for northern pike recommendation quality.
 *
 * This is audit-only: it inspects real selector outputs and traces across
 * representative pike contexts without changing selector behavior, catalog
 * eligibility, seasonal rows, or generated files.
 *
 * Usage:
 *   deno run -A scripts/audit-recommender-pike-quality-qa.ts
 */
import type { WaterClarity } from "../supabase/functions/_shared/recommenderEngine/contracts/input.ts";
import type {
  ArchetypeProfileV4,
  SeasonalRowV4,
} from "../supabase/functions/_shared/recommenderEngine/v4/contracts.ts";
import { LURE_ARCHETYPES_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/candidates/lures.ts";
import { FLY_ARCHETYPES_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/candidates/flies.ts";
import { NORTHERN_PIKE_SEASONAL_ROWS_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/northern_pike.ts";
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

type Side = "lure" | "fly";

type Scenario = {
  id: string;
  label: string;
  region_key: string;
  water_type: SeasonalRowV4["water_type"];
  month: number;
  start_date: string;
  water_clarity: WaterClarity;
  regime: DailyRegime;
  wind_mph: number;
  expected: string;
  warm_rotation_expected?: boolean;
  surface_expected?: boolean;
  winter_narrow_ok?: boolean;
};

const OUT_DIR = "docs/audits/recommender-rebuild";
const JSON_PATH = `${OUT_DIR}/pike-quality-qa.json`;
const MD_PATH = `${OUT_DIR}/pike-quality-qa.md`;
const DATE_COUNT = 7;

const ALL_ARCHETYPES = [...LURE_ARCHETYPES_V4, ...FLY_ARCHETYPES_V4];
const ARCHETYPE_BY_ID = new Map<string, ArchetypeProfileV4>(
  ALL_ARCHETYPES.map((item) => [item.id, item]),
);

const STRONG_PIKE_LURE_IDS = new Set([
  "pike_jerkbait",
  "large_bucktail_spinner",
  "large_profile_pike_swimbait",
  "pike_jig_and_plastic",
  "large_pike_topwater",
]);

const SHARED_PIKE_LURE_IDS = new Set([
  "spinnerbait",
  "inline_spinner",
  "casting_spoon",
  "lipless_crankbait",
  "blade_bait",
  "soft_jerkbait",
]);

const QUESTIONABLE_IF_DOMINANT_LURE_IDS = new Set([
  "squarebill_crankbait",
  "flat_sided_crankbait",
  "deep_diving_crankbait",
  "tube_jig",
]);

const STRONG_PIKE_FLY_IDS = new Set([
  "large_articulated_pike_streamer",
  "pike_bunny_streamer",
  "pike_flash_fly",
  "articulated_dungeon_streamer",
  "articulated_baitfish_streamer",
  "bucktail_baitfish_streamer",
  "deceiver",
  "game_changer",
  "clouser_minnow",
  "unweighted_baitfish_streamer",
  "baitfish_slider_fly",
]);

const SURFACE_PIKE_FLY_IDS = new Set([
  "popper_fly",
  "deer_hair_slider",
  "foam_gurgler_fly",
]);

const TROUT_OR_BASS_SPECIFIC_FLY_IDS = new Set([
  "mouse_fly",
  "warmwater_crawfish_fly",
  "warmwater_worm_fly",
  "crawfish_streamer",
  "sculpin_streamer",
  "muddler_sculpin",
  "slim_minnow_streamer",
]);

const PRODUCT_REVIEW_FLY_IDS = new Set([
  "frog_fly",
]);

const SCENARIOS: readonly Scenario[] = [
  {
    id: "glum_pike_lake_july_stained_windy",
    label: "Great Lakes Upper Midwest pike lake July stained windy/reaction",
    region_key: "great_lakes_upper_midwest",
    water_type: "freshwater_lake_pond",
    month: 7,
    start_date: "2026-07-03",
    water_clarity: "stained",
    regime: "neutral",
    wind_mph: 16,
    expected:
      "Windy summer lake should show reaction/baitfish tools, pike jerkbaits/swimbaits/bucktails, and large pike streamers without surface leakage.",
    warm_rotation_expected: true,
  },
  {
    id: "glum_pike_lake_july_clear_surface",
    label: "Great Lakes Upper Midwest pike lake July clear calm/surface-open",
    region_key: "great_lakes_upper_midwest",
    water_type: "freshwater_lake_pond",
    month: 7,
    start_date: "2026-07-10",
    water_clarity: "clear",
    regime: "aggressive",
    wind_mph: 3,
    expected:
      "Clear calm summer lake should allow surface and pike-specific baitfish tools without forcing topwater every day.",
    warm_rotation_expected: true,
    surface_expected: true,
  },
  {
    id: "glum_pike_river_july_stained",
    label: "Great Lakes Upper Midwest pike river July stained",
    region_key: "great_lakes_upper_midwest",
    water_type: "freshwater_river",
    month: 7,
    start_date: "2026-07-17",
    water_clarity: "stained",
    regime: "neutral",
    wind_mph: 9,
    expected:
      "Summer river should stay river-valid while showing pike baitfish/reaction tools and big streamers.",
    warm_rotation_expected: true,
  },
  {
    id: "glum_pike_lake_april_clear_shoulder",
    label: "Great Lakes Upper Midwest pike lake April clear shoulder season",
    region_key: "great_lakes_upper_midwest",
    water_type: "freshwater_lake_pond",
    month: 4,
    start_date: "2026-04-20",
    water_clarity: "clear",
    regime: "neutral",
    wind_mph: 9,
    expected:
      "Shoulder-season lake should still feel like pike: jerkbait/spinner/spoon/swimbait/blade and pike streamers are expected.",
    warm_rotation_expected: true,
  },
  {
    id: "glum_pike_lake_january_cold",
    label: "Great Lakes Upper Midwest pike lake January cold",
    region_key: "great_lakes_upper_midwest",
    water_type: "freshwater_lake_pond",
    month: 1,
    start_date: "2026-01-12",
    water_clarity: "clear",
    regime: "suppressive",
    wind_mph: 9,
    expected:
      "Cold pike can be narrower and deeper/slower, but should not lose pike identity entirely.",
    winter_narrow_ok: true,
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

function findPikeRow(scenario: Scenario): SeasonalRowV4 {
  const row = NORTHERN_PIKE_SEASONAL_ROWS_V4.find((candidate) =>
    candidate.region_key === scenario.region_key &&
    candidate.water_type === scenario.water_type &&
    candidate.month === scenario.month &&
    candidate.state_code == null
  );
  if (!row) throw new Error(`Missing pike row for ${scenario.id}`);
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
    local_timezone: "America/Detroit",
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
  const seedBase = `pike-quality-qa|${scenario.id}|${
    regimeToHows0to100(scenario.regime)
  }|${localDate}|${scenario.region_key}|northern_pike|${scenario.water_type}|${scenario.water_clarity}`;
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
    pike_specific_candidate_ids: trace.candidateScores
      .filter((score) =>
        side === "lure"
          ? STRONG_PIKE_LURE_IDS.has(score.id)
          : STRONG_PIKE_FLY_IDS.has(score.id) ||
            SURFACE_PIKE_FLY_IDS.has(score.id)
      )
      .map((score) => score.id),
    pike_specific_finalist_ids: trace.finalistIds.filter((id) =>
      side === "lure"
        ? STRONG_PIKE_LURE_IDS.has(id)
        : STRONG_PIKE_FLY_IDS.has(id) || SURFACE_PIKE_FLY_IDS.has(id)
    ),
    questionable_candidate_ids: side === "lure"
      ? trace.candidateScores
        .filter((score) => QUESTIONABLE_IF_DOMINANT_LURE_IDS.has(score.id))
        .map((score) => score.id)
      : [],
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
  scenario: Scenario,
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
      if (!archetype.species_allowed.includes("northern_pike")) {
        failures.push(`${side} ${pick.id} is not pike eligible`);
      }
      if (!archetype.water_types_allowed.includes(scenario.water_type)) {
        failures.push(`${side} ${pick.id} invalid for ${scenario.water_type}`);
      }
      if (run.surface_blocked && archetype.is_surface) {
        failures.push(`${side} ${pick.id} surface pick while blocked`);
      }
      if (side === "fly" && TROUT_OR_BASS_SPECIFIC_FLY_IDS.has(pick.id)) {
        failures.push(`${side} ${pick.id} is trout/bass-specific leakage`);
      }
    }
  }
  return failures;
}

function scenarioSignals(runs: readonly ReturnType<typeof runScenarioDate>[]) {
  let pikeLureCandidateDates = 0;
  let pikeLureFinalistDates = 0;
  let pikeLurePickDates = 0;
  let pikeFlyCandidateDates = 0;
  let pikeFlyFinalistDates = 0;
  let pikeFlyPickDates = 0;
  let conditionChosenDates = 0;
  let clarityChosenDates = 0;
  let surfacePickDates = 0;
  let questionableLurePickDates = 0;
  for (const run of runs) {
    if (
      run.lure_trace_summary.some((trace) =>
        trace.pike_specific_candidate_ids.length > 0
      )
    ) pikeLureCandidateDates++;
    if (
      run.lure_trace_summary.some((trace) =>
        trace.pike_specific_finalist_ids.length > 0
      )
    ) pikeLureFinalistDates++;
    if (run.lure_ids.some((id) => STRONG_PIKE_LURE_IDS.has(id))) {
      pikeLurePickDates++;
    }
    if (
      run.fly_trace_summary.some((trace) =>
        trace.pike_specific_candidate_ids.length > 0
      )
    ) pikeFlyCandidateDates++;
    if (
      run.fly_trace_summary.some((trace) =>
        trace.pike_specific_finalist_ids.length > 0
      )
    ) pikeFlyFinalistDates++;
    if (
      run.fly_ids.some((id) =>
        STRONG_PIKE_FLY_IDS.has(id) || SURFACE_PIKE_FLY_IDS.has(id)
      )
    ) pikeFlyPickDates++;
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
    if (run.lure_ids.some((id) => QUESTIONABLE_IF_DOMINANT_LURE_IDS.has(id))) {
      questionableLurePickDates++;
    }
  }
  return {
    pike_lure_candidate_dates: pikeLureCandidateDates,
    pike_lure_finalist_dates: pikeLureFinalistDates,
    pike_lure_pick_dates: pikeLurePickDates,
    pike_fly_candidate_dates: pikeFlyCandidateDates,
    pike_fly_finalist_dates: pikeFlyFinalistDates,
    pike_fly_pick_dates: pikeFlyPickDates,
    condition_chosen_dates: conditionChosenDates,
    clarity_chosen_dates: clarityChosenDates,
    surface_pick_dates: surfacePickDates,
    questionable_lure_pick_dates: questionableLurePickDates,
  };
}

function analyzeScenario(scenario: Scenario) {
  const row = findPikeRow(scenario);
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
    validateRun(scenario, run).map((failure) => `${run.local_date}: ${failure}`)
  );
  const lureTriples = runs.map((run) => run.lure_signature);
  const flyTriples = runs.map((run) => run.fly_signature);
  const allLureIds = runs.flatMap((run) => run.lure_ids);
  const allFlyIds = runs.flatMap((run) => run.fly_ids);
  const signals = scenarioSignals(runs);
  const reviewFlags: string[] = [];
  if (scenario.warm_rotation_expected && unique(lureTriples).length <= 1) {
    reviewFlags.push("warm lure output did not rotate");
  }
  if (scenario.warm_rotation_expected && unique(flyTriples).length <= 1) {
    reviewFlags.push("warm fly output did not rotate");
  }
  if (signals.pike_lure_candidate_dates === 0) {
    reviewFlags.push("no dedicated pike lure candidates appeared");
  }
  if (signals.pike_fly_candidate_dates === 0) {
    reviewFlags.push("no dedicated pike fly candidates appeared");
  }
  if (
    !scenario.winter_narrow_ok &&
    signals.pike_lure_pick_dates <= Math.floor(DATE_COUNT / 3)
  ) {
    reviewFlags.push(
      "dedicated pike lure picks are low for a warm/open context",
    );
  }
  if (signals.questionable_lure_pick_dates >= DATE_COUNT - 1) {
    reviewFlags.push(
      "questionable/shared small-profile lure bucket appears nearly every day",
    );
  }
  if (scenario.surface_expected && signals.surface_pick_dates === 0) {
    reviewFlags.push("surface-open scenario produced no surface picks");
  }
  const productReviewFlyPicks = unique(
    allFlyIds.filter((id) => PRODUCT_REVIEW_FLY_IDS.has(id)),
  );
  if (productReviewFlyPicks.length > 0) {
    reviewFlags.push(
      `pike surface fly product review: ${productReviewFlyPicks.join(", ")}`,
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
    pike_specific_lure_exposure: topCounts(
      allLureIds.filter((id) => STRONG_PIKE_LURE_IDS.has(id)),
    ),
    shared_pike_lure_exposure: topCounts(
      allLureIds.filter((id) => SHARED_PIKE_LURE_IDS.has(id)),
    ),
    questionable_lure_exposure: topCounts(
      allLureIds.filter((id) => QUESTIONABLE_IF_DOMINANT_LURE_IDS.has(id)),
    ),
    pike_specific_fly_exposure: topCounts(
      allFlyIds.filter((id) =>
        STRONG_PIKE_FLY_IDS.has(id) || SURFACE_PIKE_FLY_IDS.has(id)
      ),
    ),
    product_review_fly_exposure: topCounts(
      allFlyIds.filter((id) => PRODUCT_REVIEW_FLY_IDS.has(id)),
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
  const totalWarmScenarios = scenarios.filter((scenario) =>
    !scenario.scenario_id.includes("january")
  );
  const lowDedicatedLureWarmScenarios = totalWarmScenarios.filter((scenario) =>
    scenario.signals.pike_lure_pick_dates <= Math.floor(DATE_COUNT / 3)
  );
  const recommendation = hardFailures.length > 0
    ? "fix_hard_defect_before_tuning"
    : lowDedicatedLureWarmScenarios.length >= 2
    ? "consider_soft_pike_confidence_bump"
    : reviewFlags.length > 0
    ? "review_flags_but_no_immediate_tuning"
    : "no_change";
  return {
    generated_at: new Date().toISOString(),
    date_count: DATE_COUNT,
    scenarios,
    hard_failures: hardFailures,
    review_flags: reviewFlags,
    recommendation,
    proposed_tuning_if_needed: {
      weight: 12,
      guardrails:
        "Only as a soft scoring reason after hard gates; do not override species/water/surface/exclusion/column/pace legality; keep weaker than presentation-group diversity.",
      candidate_lure_ids: [...STRONG_PIKE_LURE_IDS].sort(),
      candidate_fly_ids: [...STRONG_PIKE_FLY_IDS].sort(),
      surface_fly_ids_only_when_surface_legal: [...SURFACE_PIKE_FLY_IDS].sort(),
    },
  };
}

function renderMarkdown(report: ReturnType<typeof buildReport>): string {
  const lines: string[] = [];
  lines.push("# Recommender rebuild - pike quality QA");
  lines.push("");
  lines.push(`Generated: **${report.generated_at}**`);
  lines.push("");
  lines.push("## Executive Conclusion");
  lines.push("");
  lines.push(
    report.hard_failures.length === 0
      ? "The focused pike QA found no hard eligibility, determinism, duplicate-ID, water-validity, or surface-blocking defects. Pike-specific fly exposure is strong; dedicated pike lure exposure is present but sometimes shares space with general reaction/crank/finesse tools."
      : "The focused pike QA found hard defects that should be fixed before tuning.",
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
      `- Pike lure candidate/finalist/pick dates: ${scenario.signals.pike_lure_candidate_dates}/${scenario.signals.pike_lure_finalist_dates}/${scenario.signals.pike_lure_pick_dates}.`,
    );
    lines.push(
      `- Pike fly candidate/finalist/pick dates: ${scenario.signals.pike_fly_candidate_dates}/${scenario.signals.pike_fly_finalist_dates}/${scenario.signals.pike_fly_pick_dates}.`,
    );
    lines.push(
      `- Pike-specific lure exposure: ${
        scenario.pike_specific_lure_exposure.map((item) =>
          `${item.id} (${item.count})`
        ).join(", ") || "none"
      }.`,
    );
    lines.push(
      `- Shared pike lure exposure: ${
        scenario.shared_pike_lure_exposure.map((item) =>
          `${item.id} (${item.count})`
        ).join(", ") || "none"
      }.`,
    );
    lines.push(
      `- Questionable-if-dominant lure exposure: ${
        scenario.questionable_lure_exposure.map((item) =>
          `${item.id} (${item.count})`
        ).join(", ") || "none"
      }.`,
    );
    lines.push(
      `- Pike fly exposure: ${
        scenario.pike_specific_fly_exposure.map((item) =>
          `${item.id} (${item.count})`
        ).join(", ") || "none"
      }.`,
    );
    lines.push(
      `- Product-review fly exposure: ${
        scenario.product_review_fly_exposure.map((item) =>
          `${item.id} (${item.count})`
        ).join(", ") || "none"
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
  lines.push("## Tuning Decision");
  lines.push("");
  if (report.recommendation === "consider_soft_pike_confidence_bump") {
    lines.push(
      "A small pike species-confidence pass is worth considering, but this audit does not justify hard eligibility removals. Proposed guardrails if implemented later:",
    );
    lines.push(`- Weight: +${report.proposed_tuning_if_needed.weight}.`);
    lines.push(
      `- Lure IDs: ${
        report.proposed_tuning_if_needed.candidate_lure_ids.join(", ")
      }.`,
    );
    lines.push(
      `- Fly IDs: ${
        report.proposed_tuning_if_needed.candidate_fly_ids.join(", ")
      }.`,
    );
    lines.push(
      `- Surface flies only when legal: ${
        report.proposed_tuning_if_needed.surface_fly_ids_only_when_surface_legal
          .join(", ")
      }.`,
    );
    lines.push(`- Guardrails: ${report.proposed_tuning_if_needed.guardrails}`);
  } else {
    lines.push(
      "No immediate pike tuning is recommended from this audit. Revisit only if user-facing pike examples repeatedly feel too generic.",
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
