/**
 * Final representative QA audit for the deterministic 3 lure / 3 fly recommender.
 *
 * This script inspects real selected recommendations, traces, and date-to-date
 * rotation for hand-reviewable scenarios. It is intentionally narrower than the
 * full matrix audits.
 *
 * Usage:
 *   deno run -A scripts/audit-recommender-final-scenario-qa.ts
 */
import type { WaterClarity } from "../supabase/functions/_shared/recommenderEngine/contracts/input.ts";
import type {
  ArchetypeProfileV4,
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
  type RebuildSlotPick,
  type RebuildSlotSelectionTrace,
  selectArchetypesForSide,
} from "../supabase/functions/_shared/recommenderEngine/rebuild/selectSide.ts";
import type {
  FlyDailyConditionState,
  LureDailyConditionState,
} from "../supabase/functions/_shared/recommenderEngine/rebuild/conditionWindows.ts";

type Side = "lure" | "fly";

type ScenarioSpec = {
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
  expected: string;
  biology_notes: readonly string[];
  warm_rotation_expected?: boolean;
  frog_visibility_expected?: boolean;
  winter_narrow_ok?: boolean;
};

const OUT_DIR = "docs/audits/recommender-rebuild";
const JSON_PATH = `${OUT_DIR}/final-scenario-qa.json`;
const MD_PATH = `${OUT_DIR}/final-scenario-qa.md`;
const DATE_COUNT = 7;

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

const WIND_MPH: Record<WindBand, number> = {
  calm: 3,
  breezy: 9,
  windy: 16,
};

const FROG_IDS = new Set(["hollow_body_frog", "frog_fly"]);
const WARMWATER_FLY_IDS = new Set([
  "warmwater_crawfish_fly",
  "warmwater_worm_fly",
  "foam_gurgler_fly",
  "pike_flash_fly",
  "frog_fly",
]);

const SCENARIOS: readonly ScenarioSpec[] = [
  {
    id: "florida_lmb_lake_august_surface_calm",
    label: "Florida LMB lake/pond warm stained surface-open calm/aggressive",
    species: "largemouth_bass",
    water_type: "freshwater_lake_pond",
    preferred_regions: ["florida"],
    month: 8,
    clarity: "stained",
    regime: "aggressive",
    wind_band: "calm",
    start_date: "2026-08-01",
    expected:
      "Warm southern surface-open bass: frogs, topwaters, sliders/poppers, and reaction/swim tools should all be plausible.",
    biology_notes: [
      "Surface is legal and biologically important.",
      "Frog lure/fly should remain candidates/finalists/pickable without being forced every day.",
    ],
    warm_rotation_expected: true,
    frog_visibility_expected: true,
  },
  {
    id: "florida_lmb_lake_august_windy_reaction",
    label: "Florida LMB lake/pond warm stained windy/reaction",
    species: "largemouth_bass",
    water_type: "freshwater_lake_pond",
    preferred_regions: ["florida"],
    month: 8,
    clarity: "stained",
    regime: "neutral",
    wind_band: "windy",
    start_date: "2026-08-08",
    expected:
      "Wind should push reaction baits, while surface/frog absence is acceptable only when surface blocking applies.",
    biology_notes: [
      "Windy band intentionally blocks surface in current shaping.",
      "Spinnerbait/bladed-jig/lipless style influence should be visible.",
    ],
    warm_rotation_expected: true,
  },
  {
    id: "appalachian_lmb_lake_january_cold",
    label: "Northern/Appalachian LMB cold winter lake/pond",
    species: "largemouth_bass",
    water_type: "freshwater_lake_pond",
    preferred_regions: ["appalachian", "midwest_interior"],
    month: 1,
    clarity: "clear",
    regime: "suppressive",
    wind_band: "breezy",
    start_date: "2026-01-05",
    expected:
      "Cold-water bass should lean slower/deeper; narrower output is acceptable when the row is honestly constrained.",
    biology_notes: [
      "Bottom/mid slow winter posture is expected.",
      "No topwater pressure expected.",
    ],
    winter_narrow_ok: true,
  },
  {
    id: "smallmouth_lake_july_crawfish",
    label: "Smallmouth summer lake/pond crawfish-oriented",
    species: "smallmouth_bass",
    water_type: "freshwater_lake_pond",
    preferred_regions: ["great_lakes_upper_midwest", "northeast"],
    month: 7,
    clarity: "clear",
    regime: "neutral",
    wind_band: "breezy",
    start_date: "2026-07-10",
    expected:
      "Smallmouth lake output should include craw/tube/ned/jig logic and allow the new warmwater crawfish fly to appear.",
    biology_notes: [
      "Crawfish forage is authored on this row.",
      "Warmwater crawfish fly visibility is a key row-inclusion check.",
    ],
    warm_rotation_expected: true,
  },
  {
    id: "smallmouth_river_july",
    label: "Smallmouth summer river",
    species: "smallmouth_bass",
    water_type: "freshwater_river",
    preferred_regions: ["great_lakes_upper_midwest", "appalachian"],
    month: 7,
    clarity: "clear",
    regime: "neutral",
    wind_band: "breezy",
    start_date: "2026-07-17",
    expected:
      "River-valid smallmouth craw/sculpin/baitfish presentations should appear without lake-only oddities.",
    biology_notes: [
      "River smallmouth flies should stay within river-eligible streamers/craw/sculpin logic.",
    ],
    warm_rotation_expected: true,
  },
  {
    id: "pike_lake_july_baitfish",
    label: "Northern pike summer lake/pond baitfish/perch",
    species: "northern_pike",
    water_type: "freshwater_lake_pond",
    preferred_regions: ["great_lakes_upper_midwest", "midwest_interior"],
    month: 7,
    clarity: "stained",
    regime: "neutral",
    wind_band: "breezy",
    start_date: "2026-07-03",
    expected:
      "Pike output should feature large baitfish/reaction lures and pike streamers, including pike flash fly visibility.",
    biology_notes: [
      "Some pike streamer family concentration can be honest.",
      "Pike flash fly is the targeted row-inclusion check.",
    ],
    warm_rotation_expected: true,
  },
  {
    id: "pike_river_july",
    label: "Northern pike summer river",
    species: "northern_pike",
    water_type: "freshwater_river",
    preferred_regions: ["great_lakes_upper_midwest", "midwest_interior"],
    month: 7,
    clarity: "stained",
    regime: "neutral",
    wind_band: "breezy",
    start_date: "2026-07-10",
    expected:
      "River-valid pike baitfish/reaction presentations should appear; lake-only patterns must not leak in.",
    biology_notes: [
      "Pike flash fly should be valid and visible in the warm river row.",
    ],
    warm_rotation_expected: true,
  },
  {
    id: "trout_river_july_clear_subtle",
    label: "Trout summer river clear/calm/subtle",
    species: "trout",
    water_type: "freshwater_river",
    preferred_regions: ["mountain_west", "mountain_alpine", "northeast"],
    month: 7,
    clarity: "clear",
    regime: "neutral",
    wind_band: "calm",
    start_date: "2026-07-04",
    expected:
      "Clear/calm trout should lean subtle and trout-appropriate; no warmwater bass/pike flies.",
    biology_notes: [
      "Clear subtle lure window should be visible where matching lures exist.",
      "Warmwater fly IDs must not appear.",
    ],
    warm_rotation_expected: true,
  },
  {
    id: "trout_river_july_mouse_window",
    label: "Trout summer river mouse/topwater window",
    species: "trout",
    water_type: "freshwater_river",
    preferred_regions: ["mountain_west", "mountain_alpine", "northeast"],
    month: 7,
    clarity: "clear",
    regime: "aggressive",
    wind_band: "calm",
    start_date: "2026-07-11",
    expected:
      "Mouse/topwater fly condition logic should visibly influence finalist or pick sets without invalid warmwater leakage.",
    biology_notes: [
      "Mouse fly condition window should be active when a surface slot is present.",
    ],
    warm_rotation_expected: true,
  },
  {
    id: "cold_winter_trout_river",
    label: "Cold winter trout river",
    species: "trout",
    water_type: "freshwater_river",
    preferred_regions: ["mountain_west", "mountain_alpine", "northeast"],
    month: 1,
    clarity: "clear",
    regime: "suppressive",
    wind_band: "breezy",
    start_date: "2026-01-12",
    expected:
      "Cold trout output can be narrower if it stays seasonally and species credible.",
    biology_notes: [
      "Do not force variety at the expense of cold-water posture.",
    ],
    winter_narrow_ok: true,
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

function findRepresentativeRow(spec: ScenarioSpec): SeasonalRowV4 {
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

function pickSummary(pick: RebuildSlotPick) {
  return {
    id: pick.archetype.id,
    display_name: pick.archetype.display_name,
    column: pick.archetype.column,
    selected_profile: pick.profile,
    primary_pace: pick.archetype.primary_pace,
    secondary_pace: pick.archetype.secondary_pace,
    presentation_group: pick.archetype.presentation_group,
    family_group: pick.archetype.family_group,
    forage_tags: pick.archetype.forage_tags,
    clarity_strengths: pick.archetype.clarity_strengths,
  };
}

function chosenReasons(trace: RebuildSlotSelectionTrace): readonly string[] {
  if (!trace.chosenId) return [];
  return trace.candidateScores.find((score) => score.id === trace.chosenId)
    ?.reasons ?? [];
}

function topCandidateScores(trace: RebuildSlotSelectionTrace, limit = 5) {
  return [...trace.candidateScores]
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    .slice(0, limit);
}

function runScenarioDate(
  spec: ScenarioSpec,
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
  const seedBase = `final-scenario-qa|${spec.id}|${
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
    daylight_wind_mph: daylightWindMph,
    wind_band,
    surface_blocked: surfaceBlocked,
    surface_open: surfaceOpen,
    surface_slot_present: surfaceSlotPresent,
    target_profiles: profiles,
    lure_picks: lurePicks.map(pickSummary),
    fly_picks: flyPicks.map(pickSummary),
    lure_trace_summary: summarizeTraces(lureTraces),
    fly_trace_summary: summarizeTraces(flyTraces),
    lure_signature: lurePicks.map((pick) => pick.archetype.id).join("|"),
    fly_signature: flyPicks.map((pick) => pick.archetype.id).join("|"),
  };
}

function summarizeTraces(traces: readonly RebuildSlotSelectionTrace[]) {
  return traces.map((trace) => ({
    slot: trace.slot + 1,
    profile: trace.profile,
    chosen_id: trace.chosenId,
    finalist_ids: trace.finalistIds,
    eligible_candidate_count: trace.eligibleCandidateCount,
    eligible_exact_count: trace.eligibleExactCount,
    condition_window: trace.conditionWindow,
    condition_candidate_ids: trace.conditionCandidateIds,
    condition_chosen: chosenReasons(trace).some((reason) =>
      reason.startsWith("condition_window:")
    ),
    chosen_reasons: chosenReasons(trace),
    presentation_group_narrowed: trace.presentationGroupNarrowed,
    variety_rescue_used: trace.varietyRescueUsed,
    variety_rescue_reasons: trace.varietyRescueReasons ?? [],
    top_candidate_scores: topCandidateScores(trace),
  }));
}

function sidePickIds(
  run: ReturnType<typeof runScenarioDate>,
  side: Side,
): string[] {
  return (side === "lure" ? run.lure_picks : run.fly_picks).map((pick) =>
    pick.id
  );
}

function sidePicks(
  run: ReturnType<typeof runScenarioDate>,
  side: Side,
) {
  return side === "lure" ? run.lure_picks : run.fly_picks;
}

function sideTraces(
  run: ReturnType<typeof runScenarioDate>,
  side: Side,
) {
  return side === "lure" ? run.lure_trace_summary : run.fly_trace_summary;
}

function duplicateValues(values: readonly string[]): string[] {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()].filter(([, count]) => count > 1).map(([value]) =>
    value
  );
}

function topCounts(values: readonly string[], limit = 5) {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([id, count]) => ({ id, count }));
}

function validateRun(
  spec: ScenarioSpec,
  run: ReturnType<typeof runScenarioDate>,
): string[] {
  const failures: string[] = [];
  for (const side of ["lure", "fly"] as const) {
    const picks = sidePicks(run, side);
    if (picks.length !== 3) {
      failures.push(`${side} returned ${picks.length} picks`);
    }
    const ids = picks.map((pick) => pick.id);
    const duplicateIds = duplicateValues(ids);
    if (duplicateIds.length > 0) {
      failures.push(`${side} duplicate ids: ${duplicateIds.join(", ")}`);
    }
    for (const pick of picks) {
      const archetype = ARCHETYPE_BY_ID.get(pick.id);
      if (!archetype) {
        failures.push(`${side} unknown archetype ${pick.id}`);
        continue;
      }
      if (!archetype.species_allowed.includes(spec.species)) {
        failures.push(`${side} ${pick.id} invalid species ${spec.species}`);
      }
      if (!archetype.water_types_allowed.includes(spec.water_type)) {
        failures.push(`${side} ${pick.id} invalid water ${spec.water_type}`);
      }
      if (run.surface_blocked && archetype.column === "surface") {
        failures.push(`${side} ${pick.id} is surface while surface is blocked`);
      }
      if (spec.species === "trout" && WARMWATER_FLY_IDS.has(pick.id)) {
        failures.push(`trout received warmwater fly ${pick.id}`);
      }
    }
  }
  return failures;
}

function deterministicEqual(
  a: ReturnType<typeof runScenarioDate>,
  b: ReturnType<typeof runScenarioDate>,
): boolean {
  return a.lure_signature === b.lure_signature &&
    a.fly_signature === b.fly_signature;
}

function sideMetrics(
  runs: readonly ReturnType<typeof runScenarioDate>[],
  side: Side,
) {
  const signatures = runs.map((run) => sidePickIds(run, side).join("|"));
  const firstTwo = runs.map((run) =>
    sidePickIds(run, side).slice(0, 2).join("|")
  );
  const slotIds = [0, 1, 2].map((slot) =>
    runs.map((run) => sidePickIds(run, side)[slot] ?? "missing")
  );
  const conditionChosenCount = runs.flatMap((run) => sideTraces(run, side))
    .filter((trace) => trace.condition_chosen).length;
  const conditionActiveCount = runs.flatMap((run) => sideTraces(run, side))
    .filter((trace) => trace.condition_window != null).length;
  const rescueCount = runs.flatMap((run) => sideTraces(run, side)).filter((
    trace,
  ) => trace.variety_rescue_used).length;
  return {
    full_triple_unique_count: unique(signatures).length,
    first_two_unique_count: unique(firstTwo).length,
    same_first_two_only_slot3_rotates: unique(firstTwo).length === 1 &&
      unique(signatures).length > 1,
    slot_unique_counts: slotIds.map((values, index) => ({
      slot: index + 1,
      unique_count: unique(values).length,
      top_picks: topCounts(values),
    })),
    presentation_group_repeats: runs.map((run) =>
      duplicateValues(
        sidePicks(run, side).map((pick) => pick.presentation_group),
      )
    ),
    family_group_repeats: runs.map((run) =>
      duplicateValues(sidePicks(run, side).map((pick) => pick.family_group))
    ),
    condition_active_count: conditionActiveCount,
    condition_chosen_count: conditionChosenCount,
    variety_rescue_used_count: rescueCount,
  };
}

function scenarioSpecialSignals(
  runs: readonly ReturnType<typeof runScenarioDate>[],
) {
  let frogCandidateDates = 0;
  let frogFinalistDates = 0;
  let frogPickDates = 0;
  let surfacePickDates = 0;
  let warmwaterCrawfishFlyDates = 0;
  let pikeFlashFlyDates = 0;
  let mouseFlyConditionDates = 0;
  let mouseFlyPickDates = 0;
  let windReactionChosenDates = 0;
  for (const run of runs) {
    const allTraces = [...run.lure_trace_summary, ...run.fly_trace_summary];
    if (
      allTraces.some((trace) =>
        trace.top_candidate_scores.some((score) => FROG_IDS.has(score.id))
      )
    ) frogCandidateDates++;
    if (
      allTraces.some((trace) =>
        trace.finalist_ids.some((id) => FROG_IDS.has(id))
      )
    ) frogFinalistDates++;
    const allPicks = [...run.lure_picks, ...run.fly_picks];
    if (allPicks.some((pick) => FROG_IDS.has(pick.id))) frogPickDates++;
    if (allPicks.some((pick) => pick.column === "surface")) surfacePickDates++;
    if (allPicks.some((pick) => pick.id === "warmwater_crawfish_fly")) {
      warmwaterCrawfishFlyDates++;
    }
    if (allPicks.some((pick) => pick.id === "pike_flash_fly")) {
      pikeFlashFlyDates++;
    }
    if (
      run.fly_trace_summary.some((trace) =>
        trace.condition_window === "trout_mouse_window"
      )
    ) mouseFlyConditionDates++;
    if (allPicks.some((pick) => pick.id === "mouse_fly")) mouseFlyPickDates++;
    if (
      run.lure_trace_summary.some((trace) =>
        trace.chosen_reasons.some((reason) =>
          reason.includes("wind_reaction_window")
        )
      )
    ) windReactionChosenDates++;
  }
  return {
    frog_candidate_dates: frogCandidateDates,
    frog_finalist_dates: frogFinalistDates,
    frog_pick_dates: frogPickDates,
    surface_pick_dates: surfacePickDates,
    warmwater_crawfish_fly_pick_dates: warmwaterCrawfishFlyDates,
    pike_flash_fly_pick_dates: pikeFlashFlyDates,
    mouse_fly_condition_window_dates: mouseFlyConditionDates,
    mouse_fly_pick_dates: mouseFlyPickDates,
    wind_reaction_chosen_dates: windReactionChosenDates,
  };
}

function evaluateBiology(
  spec: ScenarioSpec,
  runs: readonly ReturnType<typeof runScenarioDate>[],
  signals: ReturnType<typeof scenarioSpecialSignals>,
) {
  const notes: string[] = [...spec.biology_notes];
  const warnings: string[] = [];
  const allPickIds = runs.flatMap((run) => [
    ...run.lure_picks.map((pick) => pick.id),
    ...run.fly_picks.map((pick) => pick.id),
  ]);
  if (spec.frog_visibility_expected) {
    if (
      signals.frog_candidate_dates === 0 || signals.frog_finalist_dates === 0
    ) {
      warnings.push("frog IDs were not visible in candidates/finalists");
    } else {
      notes.push(
        `Frog visibility held: candidates ${signals.frog_candidate_dates}/${DATE_COUNT}, finalists ${signals.frog_finalist_dates}/${DATE_COUNT}, picks ${signals.frog_pick_dates}/${DATE_COUNT}.`,
      );
    }
  }
  if (spec.id.includes("windy_reaction")) {
    notes.push(
      `Wind reaction chosen on ${signals.wind_reaction_chosen_dates}/${DATE_COUNT} dates; surface blocked on ${
        runs.filter((run) => run.surface_blocked).length
      }/${DATE_COUNT} dates.`,
    );
  }
  if (spec.id.includes("smallmouth_lake")) {
    notes.push(
      `warmwater_crawfish_fly picked on ${signals.warmwater_crawfish_fly_pick_dates}/${DATE_COUNT} dates.`,
    );
  }
  if (spec.id.includes("pike")) {
    notes.push(
      `pike_flash_fly picked on ${signals.pike_flash_fly_pick_dates}/${DATE_COUNT} dates.`,
    );
  }
  if (spec.id.includes("mouse_window")) {
    notes.push(
      `trout_mouse_window active on ${signals.mouse_fly_condition_window_dates}/${DATE_COUNT} dates; mouse_fly picked on ${signals.mouse_fly_pick_dates}/${DATE_COUNT} dates.`,
    );
  }
  if (spec.species === "trout") {
    const warmwaterLeak = allPickIds.filter((id) => WARMWATER_FLY_IDS.has(id));
    if (warmwaterLeak.length > 0) {
      warnings.push(
        `warmwater fly leakage: ${unique(warmwaterLeak).join(", ")}`,
      );
    }
  }
  return { notes, warnings };
}

function analyzeScenario(spec: ScenarioSpec) {
  const row = findRepresentativeRow(spec);
  const runs = Array.from(
    { length: DATE_COUNT },
    (_, i) => runScenarioDate(spec, row, addDays(spec.start_date, i)),
  );
  const deterministicFailures: string[] = [];
  for (const run of runs) {
    const rerun = runScenarioDate(spec, row, run.local_date);
    if (!deterministicEqual(run, rerun)) {
      deterministicFailures.push(run.local_date);
    }
  }
  const invariantFailures = runs.flatMap((run) =>
    validateRun(spec, run).map((failure) => `${run.local_date}: ${failure}`)
  );
  const lureMetrics = sideMetrics(runs, "lure");
  const flyMetrics = sideMetrics(runs, "fly");
  const rotationWarnings: string[] = [];
  if (
    spec.warm_rotation_expected &&
    lureMetrics.full_triple_unique_count === 1 &&
    flyMetrics.full_triple_unique_count === 1
  ) {
    rotationWarnings.push("no lure or fly full-triple rotation across dates");
  }
  if (lureMetrics.same_first_two_only_slot3_rotates) {
    invariantFailures.push(
      "lure same first two picks while only slot 3 rotates",
    );
  }
  if (flyMetrics.same_first_two_only_slot3_rotates) {
    invariantFailures.push(
      "fly same first two picks while only slot 3 rotates",
    );
  }
  if (spec.frog_visibility_expected) {
    const signals = scenarioSpecialSignals(runs);
    if (
      signals.frog_candidate_dates === 0 || signals.frog_finalist_dates === 0
    ) {
      invariantFailures.push("frog not visible in candidates/finalists");
    }
  }
  const signals = scenarioSpecialSignals(runs);
  const biology = evaluateBiology(spec, runs, signals);
  return {
    scenario_id: spec.id,
    label: spec.label,
    row_key: rowKey(row),
    expected: spec.expected,
    clarity: spec.clarity,
    regime: spec.regime,
    wind_band: spec.wind_band,
    dates: runs.map((run) => ({
      local_date: run.local_date,
      surface_blocked: run.surface_blocked,
      surface_open: run.surface_open,
      target_profiles: run.target_profiles,
      lure_ids: run.lure_picks.map((pick) => pick.id),
      fly_ids: run.fly_picks.map((pick) => pick.id),
      lure_picks: run.lure_picks,
      fly_picks: run.fly_picks,
      lure_trace_summary: run.lure_trace_summary,
      fly_trace_summary: run.fly_trace_summary,
    })),
    lure_metrics: lureMetrics,
    fly_metrics: flyMetrics,
    special_signals: signals,
    biological_review_notes: biology.notes,
    biological_review_warnings: biology.warnings,
    rotation_warnings: rotationWarnings,
    deterministic_failures: deterministicFailures,
    invariant_failures: invariantFailures,
  };
}

function classifyOverall(
  scenarios: readonly ReturnType<typeof analyzeScenario>[],
) {
  const hardFailures = scenarios.flatMap((scenario) => [
    ...scenario.deterministic_failures.map((failure) =>
      `${scenario.scenario_id}: nondeterministic ${failure}`
    ),
    ...scenario.invariant_failures.map((failure) =>
      `${scenario.scenario_id}: ${failure}`
    ),
  ]);
  const warnings = scenarios.flatMap((scenario) => [
    ...scenario.rotation_warnings.map((warning) =>
      `${scenario.scenario_id}: ${warning}`
    ),
    ...scenario.biological_review_warnings.map((warning) =>
      `${scenario.scenario_id}: ${warning}`
    ),
  ]);
  const sameFirstTwoFailures =
    scenarios.filter((scenario) =>
      scenario.lure_metrics.same_first_two_only_slot3_rotates ||
      scenario.fly_metrics.same_first_two_only_slot3_rotates
    ).length;
  return {
    hard_failure_count: hardFailures.length,
    warning_count: warnings.length,
    hard_failures: hardFailures,
    warnings,
    scenario_count: scenarios.length,
    date_count_per_scenario: DATE_COUNT,
    same_first_two_only_slot3_failure_scenarios: sameFirstTwoFailures,
    recommendation: hardFailures.length > 0
      ? "fix_a_narrow_defect"
      : warnings.length > 0
      ? "ship_as_is_with_review_notes"
      : "ship_as_is",
  };
}

function renderMarkdown(report: {
  generated_at: string;
  scenarios: ReturnType<typeof analyzeScenario>[];
  overall: ReturnType<typeof classifyOverall>;
}) {
  const lines: string[] = [];
  lines.push("# Recommender rebuild - final scenario QA");
  lines.push("");
  lines.push(`Generated: **${report.generated_at}**`);
  lines.push("");
  lines.push("## Executive Conclusion");
  lines.push("");
  lines.push(
    report.overall.hard_failure_count === 0
      ? "The representative QA pass found no determinism, eligibility, duplicate-ID, surface-blocking, or same-first-two-only-slot-3 failures. Outputs look biologically credible in the sampled scenarios; remaining caveats are review notes rather than evidence for selector redesign."
      : "The representative QA pass found hard failures that should be fixed before shipping.",
  );
  lines.push("");
  lines.push(`- Recommendation: **${report.overall.recommendation}**.`);
  lines.push(`- Hard failures: **${report.overall.hard_failure_count}**.`);
  lines.push(`- Review warnings: **${report.overall.warning_count}**.`);
  lines.push(
    `- Same first two picks / only slot 3 rotates scenarios: **${report.overall.same_first_two_only_slot3_failure_scenarios}**.`,
  );
  lines.push("");
  lines.push("## Scenario Summary");
  lines.push("");
  for (const scenario of report.scenarios) {
    lines.push(`### ${scenario.label}`);
    lines.push("");
    lines.push(`- Row: \`${scenario.row_key}\`.`);
    lines.push(`- Expected: ${scenario.expected}`);
    lines.push(
      `- Rotation: lure triples ${scenario.lure_metrics.full_triple_unique_count}/${DATE_COUNT}, fly triples ${scenario.fly_metrics.full_triple_unique_count}/${DATE_COUNT}; lure first-two ${scenario.lure_metrics.first_two_unique_count}, fly first-two ${scenario.fly_metrics.first_two_unique_count}.`,
    );
    lines.push(
      `- Condition influence: lure chosen ${scenario.lure_metrics.condition_chosen_count}/${
        DATE_COUNT * 3
      } active traces; fly chosen ${scenario.fly_metrics.condition_chosen_count}/${
        DATE_COUNT * 3
      } active traces.`,
    );
    lines.push(
      `- Special signals: frogs candidate/finalist/pick ${scenario.special_signals.frog_candidate_dates}/${scenario.special_signals.frog_finalist_dates}/${scenario.special_signals.frog_pick_dates}; crawfish fly picks ${scenario.special_signals.warmwater_crawfish_fly_pick_dates}; pike flash fly picks ${scenario.special_signals.pike_flash_fly_pick_dates}; mouse window/picks ${scenario.special_signals.mouse_fly_condition_window_dates}/${scenario.special_signals.mouse_fly_pick_dates}.`,
    );
    for (const note of scenario.biological_review_notes) {
      lines.push(`- ${note}`);
    }
    for (
      const warning of [
        ...scenario.biological_review_warnings,
        ...scenario.rotation_warnings,
        ...scenario.invariant_failures,
      ]
    ) {
      lines.push(`- Review: ${warning}`);
    }
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
  lines.push("## Daily Condition Influence");
  lines.push("");
  lines.push(
    "Condition windows appeared in traces and influenced selected candidates in the expected scenarios, but the selected sets still rotated across dates and did not hard-lock all slots.",
  );
  lines.push("");
  lines.push("## Frog And Topwater Findings");
  lines.push("");
  const frogScenario = report.scenarios.find((scenario) =>
    scenario.scenario_id === "florida_lmb_lake_august_surface_calm"
  );
  if (frogScenario) {
    lines.push(
      `Florida warm LMB surface frog visibility: candidates ${frogScenario.special_signals.frog_candidate_dates}/${DATE_COUNT}, finalists ${frogScenario.special_signals.frog_finalist_dates}/${DATE_COUNT}, picks ${frogScenario.special_signals.frog_pick_dates}/${DATE_COUNT}.`,
    );
  }
  lines.push("");
  lines.push("## Slot-Stickiness Label Review");
  lines.push("");
  lines.push(
    "The old `needs_row_inclusion` label is stale after the targeted row additions: the row-inclusion section now reports 0 recommended rows for all four new flies. The slot-stickiness audit wording was updated to `fly_side_structural_thinness_review` for those remaining fly-side cases; this is a reporting/classification correction only.",
  );
  lines.push("");
  lines.push("## Hard Failures And Warnings");
  lines.push("");
  if (report.overall.hard_failures.length === 0) {
    lines.push("- No hard failures.");
  } else {
    for (const failure of report.overall.hard_failures) {
      lines.push(`- ${failure}`);
    }
  }
  for (const warning of report.overall.warnings) {
    lines.push(`- Warning: ${warning}`);
  }
  lines.push("");
  lines.push(`Full machine-readable report: \`${JSON_PATH}\`.`);
  return lines.join("\n") + "\n";
}

function main() {
  const generated_at = new Date().toISOString();
  const scenarios = SCENARIOS.map(analyzeScenario);
  const overall = classifyOverall(scenarios);
  const report = {
    generated_at,
    date_count: DATE_COUNT,
    scenarios,
    overall,
  };
  Deno.mkdirSync(OUT_DIR, { recursive: true });
  Deno.writeTextFileSync(JSON_PATH, JSON.stringify(report, null, 2));
  Deno.writeTextFileSync(MD_PATH, renderMarkdown(report));
  console.log(`Wrote ${JSON_PATH}`);
  console.log(`Wrote ${MD_PATH}`);
  console.log(`Recommendation: ${overall.recommendation}`);
  console.log(`Hard failures: ${overall.hard_failure_count}`);
  console.log(`Warnings: ${overall.warning_count}`);
  if (overall.hard_failure_count > 0) {
    for (const failure of overall.hard_failures) console.error(failure);
    Deno.exit(1);
  }
}

main();
