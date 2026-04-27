/**
 * Focused QA audit for the SMB species-confidence tuning pass.
 *
 * Usage:
 *   deno run -A scripts/audit-recommender-species-confidence-qa.ts
 */
import type { WaterClarity } from "../supabase/functions/_shared/recommenderEngine/contracts/input.ts";
import type {
  ArchetypeProfileV4,
  SeasonalRowV4,
} from "../supabase/functions/_shared/recommenderEngine/v4/contracts.ts";
import { LURE_ARCHETYPES_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/candidates/lures.ts";
import { FLY_ARCHETYPES_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/candidates/flies.ts";
import { LARGEMOUTH_BASS_SEASONAL_ROWS_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/largemouth_bass.ts";
import { SMALLMOUTH_BASS_SEASONAL_ROWS_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/smallmouth_bass.ts";
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

const OUT_DIR = "docs/audits/recommender-rebuild";
const JSON_PATH = `${OUT_DIR}/species-confidence-qa.json`;
const MD_PATH = `${OUT_DIR}/species-confidence-qa.md`;
const DATE_COUNT = 7;
const SMB_CONFIDENCE_LURE_IDS = new Set([
  "tube_jig",
  "ned_rig",
  "suspending_jerkbait",
  "drop_shot_minnow",
  "soft_jerkbait",
  "football_jig",
  "finesse_jig",
  "texas_rigged_soft_plastic_craw",
  "paddle_tail_swimbait",
  "spinnerbait",
]);

const ALL_ARCHETYPES = [...LURE_ARCHETYPES_V4, ...FLY_ARCHETYPES_V4];
const ARCHETYPE_BY_ID = new Map<string, ArchetypeProfileV4>(
  ALL_ARCHETYPES.map((item) => [item.id, item]),
);

type Scenario = {
  id: string;
  label: string;
  month: number;
  start_date: string;
  water_clarity: WaterClarity;
  regime: DailyRegime;
  daylight_wind_mph: number;
};

const SCENARIOS: readonly Scenario[] = [
  {
    id: "glen_arbor_mi_smb_clear_lake_april",
    label: "Glen Arbor-like SMB clear lake/pond April",
    month: 4,
    start_date: "2026-04-20",
    water_clarity: "clear",
    regime: "neutral",
    daylight_wind_mph: 7,
  },
  {
    id: "glen_arbor_mi_smb_clear_lake_may",
    label: "Glen Arbor-like SMB clear lake/pond May",
    month: 5,
    start_date: "2026-05-15",
    water_clarity: "clear",
    regime: "neutral",
    daylight_wind_mph: 7,
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

function findSmbLakeRow(month: number): SeasonalRowV4 {
  const row = SMALLMOUTH_BASS_SEASONAL_ROWS_V4.find((candidate) =>
    candidate.region_key === "great_lakes_upper_midwest" &&
    candidate.water_type === "freshwater_lake_pond" &&
    candidate.month === month &&
    candidate.state_code == null
  );
  if (!row) {
    throw new Error(`Missing Great Lakes SMB lake row for month ${month}`);
  }
  return row;
}

function chosenReasons(trace: RebuildSlotSelectionTrace): readonly string[] {
  if (!trace.chosenId) return [];
  return trace.candidateScores.find((score) => score.id === trace.chosenId)
    ?.reasons ?? [];
}

function runScenarioDate(
  scenario: Scenario,
  row: SeasonalRowV4,
  localDate: string,
) {
  const env_data = {
    weather: { wind_speed_unit: "mph" },
    hourly_wind_speed: hourlyWindUniform(localDate, scenario.daylight_wind_mph),
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
  const seedBase = `species-confidence-qa|${scenario.id}|${
    regimeToHows0to100(scenario.regime)
  }|${localDate}|MI|great_lakes_upper_midwest|smallmouth_bass|freshwater_lake_pond|${scenario.water_clarity}`;
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
    target_profiles: profiles,
    surface_blocked: surfaceBlocked,
    wind_band: windBand,
    lure_ids: lurePicks.map((pick) => pick.archetype.id),
    fly_ids: flyPicks.map((pick) => pick.archetype.id),
    lure_trace_summary: lureTraces.map((trace) => ({
      slot: trace.slot + 1,
      profile: trace.profile,
      chosen_id: trace.chosenId,
      chosen_reasons: chosenReasons(trace),
      finalist_ids: trace.finalistIds,
      species_confidence_candidate_ids: trace.candidateScores
        .filter((score) =>
          score.reasons.some((reason) =>
            reason.startsWith("species_confidence:smallmouth_bass:")
          )
        )
        .map((score) => score.id),
      clear_reason_candidate_ids: trace.candidateScores
        .filter((score) =>
          score.reasons.includes("clarity_strength:+8") ||
          score.reasons.includes("clarity_specialist:+10")
        )
        .map((score) => score.id),
      candidate_scores: trace.candidateScores,
    })),
    fly_trace_summary: flyTraces.map((trace) => ({
      slot: trace.slot + 1,
      profile: trace.profile,
      chosen_id: trace.chosenId,
      chosen_reasons: chosenReasons(trace),
      finalist_ids: trace.finalistIds,
    })),
  };
}

function unique<T>(items: readonly T[]): T[] {
  return [...new Set(items)];
}

function topCounts(items: readonly string[]) {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item, (counts.get(item) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) =>
    b[1] - a[1] || a[0].localeCompare(b[0])
  )
    .map(([id, count]) => ({ id, count }));
}

function analyzeScenario(scenario: Scenario) {
  const row = findSmbLakeRow(scenario.month);
  const runs = Array.from(
    { length: DATE_COUNT },
    (_, day) =>
      runScenarioDate(scenario, row, addDays(scenario.start_date, day)),
  );
  const lureTriples = runs.map((run) => run.lure_ids.join("|"));
  const flyTriples = runs.map((run) => run.fly_ids.join("|"));
  const allLureIds = runs.flatMap((run) => run.lure_ids);
  const confidenceIds = new Set(
    runs.flatMap((run) =>
      run.lure_trace_summary.flatMap((trace) =>
        trace.species_confidence_candidate_ids
      )
    ),
  );
  const clearReasonIds = new Set(
    runs.flatMap((run) =>
      run.lure_trace_summary.flatMap((trace) =>
        trace.clear_reason_candidate_ids
      )
    ),
  );
  const castingSpoonAppeared = allLureIds.includes("casting_spoon");
  return {
    scenario_id: scenario.id,
    label: scenario.label,
    state_code: "MI",
    region_key: "great_lakes_upper_midwest",
    row_key: rowKey(row),
    water_clarity: scenario.water_clarity,
    local_timezone: "America/Detroit",
    lure_unique_triples: unique(lureTriples).length,
    fly_unique_triples: unique(flyTriples).length,
    smb_confidence_candidate_ids: [...confidenceIds].sort(),
    clear_reason_candidate_ids: [...clearReasonIds].sort(),
    smb_specific_lure_exposure: topCounts(
      allLureIds.filter((id) => SMB_CONFIDENCE_LURE_IDS.has(id)),
    ),
    casting_spoon_appeared: castingSpoonAppeared,
    dates: runs,
  };
}

function castingSpoonBassAudit() {
  const spoon = ARCHETYPE_BY_ID.get("casting_spoon");
  const lmbAuthored = LARGEMOUTH_BASS_SEASONAL_ROWS_V4.filter((row) =>
    row.primary_lure_ids.includes("casting_spoon")
  );
  const smbAuthored = SMALLMOUTH_BASS_SEASONAL_ROWS_V4.filter((row) =>
    row.primary_lure_ids.includes("casting_spoon")
  );
  return {
    catalog_allows_largemouth_bass: spoon?.species_allowed.includes(
      "largemouth_bass",
    ) ?? false,
    catalog_allows_smallmouth_bass: spoon?.species_allowed.includes(
      "smallmouth_bass",
    ) ?? false,
    lmb_authored_row_count: lmbAuthored.length,
    smb_authored_row_count: smbAuthored.length,
  };
}

function renderMarkdown(report: ReturnType<typeof buildReport>): string {
  const lines: string[] = [];
  lines.push("# Recommender rebuild - SMB species confidence QA");
  lines.push("");
  lines.push(`Generated: **${report.generated_at}**`);
  lines.push("");
  lines.push("## Executive Conclusion");
  lines.push("");
  lines.push(
    report.hard_failures.length === 0
      ? "The Glen Arbor-like SMB clear lake/pond samples show varied outputs, SMB confidence trace reasons on classic tools, clear-water reasons where expected, and no casting_spoon leakage for bass."
      : "The SMB species-confidence QA found hard failures that need review.",
  );
  lines.push("");
  lines.push(`- Hard failures: **${report.hard_failures.length}**.`);
  lines.push(
    `- Casting spoon bass catalog flags: LMB ${report.casting_spoon.catalog_allows_largemouth_bass}, SMB ${report.casting_spoon.catalog_allows_smallmouth_bass}.`,
  );
  lines.push(
    `- Casting spoon authored rows: LMB ${report.casting_spoon.lmb_authored_row_count}, SMB ${report.casting_spoon.smb_authored_row_count}.`,
  );
  lines.push("");
  lines.push("## Glen Arbor-Like Samples");
  lines.push("");
  for (const scenario of report.scenarios) {
    lines.push(`### ${scenario.label}`);
    lines.push("");
    lines.push(
      `- Row: \`${scenario.row_key}\`; timezone: \`${scenario.local_timezone}\`.`,
    );
    lines.push(
      `- Unique triples: lure ${scenario.lure_unique_triples}/${DATE_COUNT}, fly ${scenario.fly_unique_triples}/${DATE_COUNT}.`,
    );
    lines.push(
      `- SMB confidence candidate IDs: ${
        scenario.smb_confidence_candidate_ids.join(", ") || "none"
      }.`,
    );
    lines.push(
      `- Clear-water reason candidate IDs: ${
        scenario.clear_reason_candidate_ids.join(", ") || "none"
      }.`,
    );
    lines.push(
      `- SMB-specific lure exposure: ${
        scenario.smb_specific_lure_exposure.map((item) =>
          `${item.id} (${item.count})`
        ).join(", ") || "none"
      }.`,
    );
    lines.push("");
    lines.push("| Date | Lures | Flies |");
    lines.push("| --- | --- | --- |");
    for (const run of scenario.dates) {
      lines.push(
        `| ${run.local_date} | ${run.lure_ids.join(", ")} | ${
          run.fly_ids.join(", ")
        } |`,
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
  lines.push(`Full machine-readable report: \`${JSON_PATH}\`.`);
  return lines.join("\n") + "\n";
}

function buildReport() {
  const scenarios = SCENARIOS.map(analyzeScenario);
  const casting_spoon = castingSpoonBassAudit();
  const hard_failures: string[] = [];
  if (
    casting_spoon.catalog_allows_largemouth_bass ||
    casting_spoon.catalog_allows_smallmouth_bass
  ) {
    hard_failures.push("casting_spoon still allows LMB or SMB in catalog");
  }
  if (
    casting_spoon.lmb_authored_row_count > 0 ||
    casting_spoon.smb_authored_row_count > 0
  ) {
    hard_failures.push("casting_spoon still appears in authored LMB/SMB rows");
  }
  for (const scenario of scenarios) {
    if (scenario.casting_spoon_appeared) {
      hard_failures.push(`${scenario.scenario_id}: casting_spoon appeared`);
    }
    if (scenario.lure_unique_triples <= 1) {
      hard_failures.push(`${scenario.scenario_id}: lure output did not rotate`);
    }
    if (scenario.smb_confidence_candidate_ids.length === 0) {
      hard_failures.push(`${scenario.scenario_id}: no SMB confidence reasons`);
    }
  }
  return {
    generated_at: new Date().toISOString(),
    date_count: DATE_COUNT,
    scenarios,
    casting_spoon,
    hard_failures,
  };
}

function main() {
  const report = buildReport();
  Deno.mkdirSync(OUT_DIR, { recursive: true });
  Deno.writeTextFileSync(JSON_PATH, JSON.stringify(report, null, 2));
  Deno.writeTextFileSync(MD_PATH, renderMarkdown(report));
  console.log(`Wrote ${JSON_PATH}`);
  console.log(`Wrote ${MD_PATH}`);
  console.log(`Hard failures: ${report.hard_failures.length}`);
  if (report.hard_failures.length > 0) {
    for (const failure of report.hard_failures) console.error(failure);
    Deno.exit(1);
  }
}

main();
