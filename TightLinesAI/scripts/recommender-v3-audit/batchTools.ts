import { resolveRegionForCoordinates } from "../../supabase/functions/_shared/howFishingEngine/context/resolveRegion.ts";
import { buildSharedEngineRequestFromEnvData } from "../../supabase/functions/_shared/howFishingEngine/request/buildFromEnvData.ts";
import {
  runRecommenderV3,
  runRecommenderV3Surface,
  type RecommenderRequest,
} from "../../supabase/functions/_shared/recommenderEngine/index.ts";
import type { RecommenderV3ArchetypeId } from "../../supabase/functions/_shared/recommenderEngine/index.ts";
import type {
  ArchivedRecommenderAuditScenario,
  RecommenderAuditScoreKey,
} from "../recommenderCalibrationScenarios.ts";
import { fetchArchiveWeather } from "../audit/lib/fetchArchiveWeather.ts";
import { fetchSunriseSunset } from "../audit/lib/fetchSunriseSunset.ts";
import { fetchUSNOMoon } from "../audit/lib/fetchUSNOMoon.ts";
import { findDailyIndex, findNoonHourIndex } from "../audit/lib/dateUtils.ts";
import { mapArchiveToEnvData } from "../audit/lib/mapArchiveToEnvData.ts";
import {
  buildArchiveEnvPath,
  buildReviewSheetJsonPath,
  buildReviewSheetMarkdownPath,
  type ArchiveBatchBundle,
  type ArchiveScenarioBundle,
} from "./archiveBundle.ts";

export type ReviewScoreCard = Record<RecommenderAuditScoreKey, number | null>;

type AuditEngineStatus =
  | "pending_archived_env_data"
  | "archive_env_failed"
  | "complete";

type ActualCandidate = {
  id: string;
  display_name: string;
  score: number;
  tactical_lane: string;
  color_theme: string;
  color_recommendations: string[];
};

type ReviewSheetScenario = {
  scenario_id: string;
  label: string;
  priority: ArchivedRecommenderAuditScenario["priority"];
  species: ArchivedRecommenderAuditScenario["species"];
  context: ArchivedRecommenderAuditScenario["context"];
  water_clarity: ArchivedRecommenderAuditScenario["water_clarity"];
  state_code: string;
  timezone: string;
  local_date: string;
  latitude: number;
  longitude: number;
  expectation: ArchivedRecommenderAuditScenario["expectation"];
  engine_run_status: AuditEngineStatus;
  archived_env_summary: string[];
  actual_output: {
    top_1_lure: ActualCandidate | null;
    top_3_lures: ActualCandidate[];
    top_1_fly: ActualCandidate | null;
    top_3_flies: ActualCandidate[];
    color_notes: string[];
    daily_profile_notes: string[];
  };
  review: {
    precheck_flags: string[];
    top_1_verdict: string;
    top_3_verdict: string;
    scores: ReviewScoreCard;
    failure_clusters: string[];
    notes: string;
  };
};

type ReviewSheet = {
  batch_id: string;
  generated_at: string;
  archive_bundle_generated_at: string | null;
  scenario_count: number;
  score_keys: readonly RecommenderAuditScoreKey[];
  scenarios: ReviewSheetScenario[];
};

function emptyScoreCard(scoreKeys: readonly RecommenderAuditScoreKey[]): ReviewScoreCard {
  return Object.fromEntries(scoreKeys.map((key) => [key, null])) as ReviewScoreCard;
}

function toActualCandidate(candidate: ReturnType<typeof runRecommenderV3>["lure_recommendations"][number]): ActualCandidate {
  return {
    id: candidate.id,
    display_name: candidate.display_name,
    score: candidate.score,
    tactical_lane: candidate.tactical_lane,
    color_theme: candidate.color_theme,
    color_recommendations: candidate.color_recommendations,
  };
}

function buildRequest(
  scenario: ArchivedRecommenderAuditScenario,
  bundle: ArchiveScenarioBundle,
): RecommenderRequest {
  return {
    location: {
      latitude: scenario.latitude,
      longitude: scenario.longitude,
      state_code: scenario.state_code,
      region_key: bundle.location.region_key,
      local_date: scenario.local_date,
      local_timezone: scenario.timezone,
      month: bundle.location.month,
    },
    species: scenario.species,
    context: scenario.context,
    water_clarity: scenario.water_clarity,
    env_data: (bundle.shared_environment ?? {}) as Record<string, unknown>,
  };
}

function buildArchiveSummaryLines(bundle: ArchiveScenarioBundle | undefined): string[] {
  if (!bundle) return ["Archived env bundle has not been built yet."];
  if (bundle.status !== "ready") {
    return [`Archive env build failed: ${bundle.error ?? "unknown_error"}`];
  }
  return [
    `Region: ${bundle.location.region_key}`,
    `Archive weather timezone: ${bundle.archive_summary.archive_timezone ?? bundle.location.timezone}`,
    `Noon air temp: ${bundle.archive_summary.noon_air_temp_f ?? "n/a"} F`,
    `Noon pressure: ${bundle.archive_summary.pressure_noon_mb ?? "n/a"} mb`,
    `Noon cloud cover: ${bundle.archive_summary.cloud_cover_noon_pct ?? "n/a"}%`,
    `Daily high/low: ${bundle.archive_summary.daily_high_air_temp_f ?? "n/a"} / ${
      bundle.archive_summary.daily_low_air_temp_f ?? "n/a"
    } F`,
    `Daily wind max: ${bundle.archive_summary.daily_wind_max_mph ?? "n/a"} mph`,
    `Daily precip: ${bundle.archive_summary.daily_precip_in ?? "n/a"} in`,
    `Moon phase: ${bundle.archive_summary.moon_phase ?? "n/a"}`,
    `Sunrise/sunset: ${bundle.archive_summary.sunrise_local ?? "n/a"} / ${
      bundle.archive_summary.sunset_local ?? "n/a"
    }`,
    ...((bundle.data_coverage.source_notes ?? []).map((note) => `Coverage: ${note}`)),
  ];
}

function precheckFlags(
  scenario: ArchivedRecommenderAuditScenario,
  raw: ReturnType<typeof runRecommenderV3>,
): string[] {
  const flags: string[] = [];
  const combined = [...raw.lure_recommendations, ...raw.fly_recommendations];
  const top1Ids = [
    raw.lure_recommendations[0]?.id,
    raw.fly_recommendations[0]?.id,
  ].filter((value): value is NonNullable<typeof value> => value != null);

  if (top1Ids.some((id) => scenario.expectation.primary_lanes.includes(id))) {
    flags.push("TOP1_PRIMARY_HIT");
  } else {
    flags.push("TOP1_PRIMARY_MISS");
  }

  if (combined.some((candidate) => scenario.expectation.primary_lanes.includes(candidate.id))) {
    flags.push("TOP3_PRIMARY_PRESENT");
  } else {
    flags.push("TOP3_PRIMARY_MISSING");
  }

  const disallowed = combined
    .filter((candidate) => scenario.expectation.disallowed_lanes?.includes(candidate.id))
    .map((candidate) => candidate.id);
  if (disallowed.length > 0) {
    flags.push(`DISALLOWED_PRESENT:${disallowed.join(",")}`);
  } else {
    flags.push("NO_DISALLOWED_PRESENT");
  }

  const colorHits = [
    raw.lure_recommendations[0]?.color_theme,
    raw.fly_recommendations[0]?.color_theme,
  ].filter((value): value is NonNullable<typeof value> => value != null)
    .filter((theme) => scenario.expectation.expected_color_lanes.includes(theme));
  if (colorHits.length > 0) {
    flags.push(`TOP_COLOR_MATCH:${colorHits.join(",")}`);
  } else {
    flags.push("TOP_COLOR_MISS");
  }

  return flags;
}

function formatCandidateMarkdown(candidate: ActualCandidate): string {
  return `${candidate.display_name} \`${candidate.id}\` | theme: \`${candidate.color_theme}\` | colors: ${
    candidate.color_recommendations.join(", ")
  }`;
}

function toReviewScenario(
  scenario: ArchivedRecommenderAuditScenario,
  bundle: ArchiveScenarioBundle | undefined,
  scoreKeys: readonly RecommenderAuditScoreKey[],
): ReviewSheetScenario {
  if (!bundle) {
    return {
      scenario_id: scenario.id,
      label: scenario.label,
      priority: scenario.priority,
      species: scenario.species,
      context: scenario.context,
      water_clarity: scenario.water_clarity,
      state_code: scenario.state_code,
      timezone: scenario.timezone,
      local_date: scenario.local_date,
      latitude: scenario.latitude,
      longitude: scenario.longitude,
      expectation: scenario.expectation,
      engine_run_status: "pending_archived_env_data",
      archived_env_summary: buildArchiveSummaryLines(undefined),
      actual_output: {
        top_1_lure: null,
        top_3_lures: [],
        top_1_fly: null,
        top_3_flies: [],
        color_notes: [],
        daily_profile_notes: [],
      },
      review: {
        precheck_flags: [],
        top_1_verdict: "",
        top_3_verdict: "",
        scores: emptyScoreCard(scoreKeys),
        failure_clusters: [],
        notes: "",
      },
    };
  }

  if (bundle.status !== "ready" || !bundle.shared_environment) {
    return {
      scenario_id: scenario.id,
      label: scenario.label,
      priority: scenario.priority,
      species: scenario.species,
      context: scenario.context,
      water_clarity: scenario.water_clarity,
      state_code: scenario.state_code,
      timezone: scenario.timezone,
      local_date: scenario.local_date,
      latitude: scenario.latitude,
      longitude: scenario.longitude,
      expectation: scenario.expectation,
      engine_run_status: "archive_env_failed",
      archived_env_summary: buildArchiveSummaryLines(bundle),
      actual_output: {
        top_1_lure: null,
        top_3_lures: [],
        top_1_fly: null,
        top_3_flies: [],
        color_notes: [],
        daily_profile_notes: [],
      },
      review: {
        precheck_flags: bundle.error ? [bundle.error] : [],
        top_1_verdict: "",
        top_3_verdict: "",
        scores: emptyScoreCard(scoreKeys),
        failure_clusters: [],
        notes: "",
      },
    };
  }

  const req = buildRequest(scenario, bundle);
  const raw = runRecommenderV3(req);
  const surface = runRecommenderV3Surface(req);
  const topLures = raw.lure_recommendations.map(toActualCandidate);
  const topFlies = raw.fly_recommendations.map(toActualCandidate);

  return {
    scenario_id: scenario.id,
    label: scenario.label,
    priority: scenario.priority,
    species: scenario.species,
    context: scenario.context,
    water_clarity: scenario.water_clarity,
    state_code: scenario.state_code,
    timezone: scenario.timezone,
    local_date: scenario.local_date,
    latitude: scenario.latitude,
    longitude: scenario.longitude,
    expectation: scenario.expectation,
    engine_run_status: "complete",
    archived_env_summary: buildArchiveSummaryLines(bundle),
    actual_output: {
      top_1_lure: topLures[0] ?? null,
      top_3_lures: topLures,
      top_1_fly: topFlies[0] ?? null,
      top_3_flies: topFlies,
      color_notes: [
        ...surface.lure_rankings.slice(0, 3).map((candidate) => `${candidate.display_name}: ${candidate.color_guide}`),
        ...surface.fly_rankings.slice(0, 3).map((candidate) => `${candidate.display_name}: ${candidate.color_guide}`),
      ],
      daily_profile_notes: [
        `Shared score: ${raw.daily_payload.source_score} (${raw.daily_payload.source_band})`,
        `Daily nudges: mood=${raw.daily_payload.mood_nudge}, water_column=${raw.daily_payload.water_column_nudge}, presentation=${raw.daily_payload.presentation_nudge}`,
        `Resolved profile: water_column=${raw.resolved_profile.final_water_column}, mood=${raw.resolved_profile.final_mood}, presentation=${raw.resolved_profile.final_presentation_style}`,
        `Variables considered: ${raw.variables_considered.join(", ")}`,
      ],
    },
    review: {
      precheck_flags: precheckFlags(scenario, raw),
      top_1_verdict: "",
      top_3_verdict: "",
      scores: emptyScoreCard(scoreKeys),
      failure_clusters: [],
      notes: "",
    },
  };
}

function formatScenarioMarkdown(
  scenario: ReviewSheetScenario,
  scoreKeys: readonly RecommenderAuditScoreKey[],
): string {
  const lines: string[] = [];
  lines.push(`## ${scenario.scenario_id}`);
  lines.push("");
  lines.push(`- Label: ${scenario.label}`);
  lines.push(`- Priority: ${scenario.priority}`);
  lines.push(`- Date: ${scenario.local_date}`);
  lines.push(`- State: ${scenario.state_code}`);
  lines.push(`- Context: ${scenario.context}`);
  lines.push(`- Water clarity: ${scenario.water_clarity}`);
  lines.push(`- Coordinates: ${scenario.latitude}, ${scenario.longitude}`);
  lines.push(`- Engine status: ${scenario.engine_run_status}`);
  lines.push("");
  lines.push("Expected seasonal story:");
  lines.push(`- ${scenario.expectation.seasonal_story}`);
  lines.push("Expected primary lanes:");
  for (const lane of scenario.expectation.primary_lanes) lines.push(`- ${lane}`);
  if (scenario.expectation.acceptable_secondary_lanes?.length) {
    lines.push("Acceptable secondary lanes:");
    for (const lane of scenario.expectation.acceptable_secondary_lanes) lines.push(`- ${lane}`);
  }
  if (scenario.expectation.disallowed_lanes?.length) {
    lines.push("Disallowed lanes:");
    for (const lane of scenario.expectation.disallowed_lanes) lines.push(`- ${lane}`);
  }
  lines.push("Expected color themes:");
  for (const color of scenario.expectation.expected_color_lanes) lines.push(`- ${color}`);
  if (scenario.expectation.notes?.length) {
    lines.push("Expectation notes:");
    for (const note of scenario.expectation.notes) lines.push(`- ${note}`);
  }
  lines.push("");
  lines.push("Archived env summary:");
  for (const note of scenario.archived_env_summary) lines.push(`- ${note}`);
  lines.push("");
  lines.push("Actual output:");
  lines.push(`- Top 1 lure: ${scenario.actual_output.top_1_lure ? formatCandidateMarkdown(scenario.actual_output.top_1_lure) : ""}`);
  lines.push("- Top 3 lures:");
  for (const candidate of scenario.actual_output.top_3_lures) lines.push(`- ${formatCandidateMarkdown(candidate)}`);
  lines.push(`- Top 1 fly: ${scenario.actual_output.top_1_fly ? formatCandidateMarkdown(scenario.actual_output.top_1_fly) : ""}`);
  lines.push("- Top 3 flies:");
  for (const candidate of scenario.actual_output.top_3_flies) lines.push(`- ${formatCandidateMarkdown(candidate)}`);
  lines.push("- Color notes:");
  for (const note of scenario.actual_output.color_notes) lines.push(`- ${note}`);
  lines.push("- Daily profile notes:");
  for (const note of scenario.actual_output.daily_profile_notes) lines.push(`- ${note}`);
  lines.push("");
  lines.push("Review:");
  lines.push("- Precheck flags:");
  for (const flag of scenario.review.precheck_flags) lines.push(`- ${flag}`);
  lines.push("- Top 1 verdict:");
  lines.push("- Top 3 verdict:");
  for (const key of scoreKeys) lines.push(`- ${key}:`);
  lines.push("- failure_clusters:");
  lines.push("- notes:");
  lines.push("");
  return lines.join("\n");
}

function toMarkdown(
  batchId: string,
  sheet: ReviewSheet,
  scoreKeys: readonly RecommenderAuditScoreKey[],
): string {
  const title = batchId.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  const lakeCount = sheet.scenarios.filter((scenario) => scenario.context === "freshwater_lake_pond").length;
  const riverCount = sheet.scenarios.filter((scenario) => scenario.context === "freshwater_river").length;
  const coreCount = sheet.scenarios.filter((scenario) => scenario.priority === "core").length;
  const secondaryCount = sheet.scenarios.length - coreCount;
  const completedCount = sheet.scenarios.filter((scenario) => scenario.engine_run_status === "complete").length;
  const sections = sheet.scenarios.map((scenario) => formatScenarioMarkdown(scenario, scoreKeys)).join("\n");

  return [
    `# ${title.replace(/ V3 /g, " V3 ").replace(/ Largemouth /g, " Largemouth ") } Review Sheet`,
    "",
    `Generated: ${sheet.generated_at}`,
    `Archive bundle generated: ${sheet.archive_bundle_generated_at ?? "not built yet"}`,
    `Scenario count: ${sheet.scenario_count}`,
    `Contexts: ${lakeCount} lake/pond, ${riverCount} river`,
    `Priority mix: ${coreCount} core, ${secondaryCount} secondary`,
    `Completed engine runs: ${completedCount}/${sheet.scenario_count}`,
    "",
    "This sheet is the scoring surface for the freshwater V3 recommender audit batch.",
    "It supports archive-backed engine runs, real top-3 output capture, and lightweight precheck flags before manual scoring.",
    "",
    "Scoring rubric:",
    "- 2 = clearly right",
    "- 1 = acceptable but not ideal",
    "- 0 = wrong or concerning",
    "",
    "Required score keys:",
    ...scoreKeys.map((key) => `- ${key}`),
    "",
    sections,
  ].join("\n");
}

export async function writeArchiveBundleForBatch(
  batchId: string,
  scenarios: readonly ArchivedRecommenderAuditScenario[],
): Promise<void> {
  const builtScenarios: ArchiveScenarioBundle[] = [];

  async function buildScenarioBundle(
    scenario: ArchivedRecommenderAuditScenario,
  ): Promise<ArchiveScenarioBundle> {
    const region = resolveRegionForCoordinates(scenario.latitude, scenario.longitude);
    const month = Number.parseInt(scenario.local_date.slice(5, 7), 10) || 1;

    const failed = (error: string): ArchiveScenarioBundle => ({
      scenario_id: scenario.id,
      label: scenario.label,
      status: "archive_fetch_failed",
      location: {
        latitude: scenario.latitude,
        longitude: scenario.longitude,
        state_code: scenario.state_code,
        timezone: scenario.timezone,
        local_date: scenario.local_date,
        region_key: region.region_key,
        month,
      },
      archive_summary: {
        archive_timezone: null,
        noon_air_temp_f: null,
        pressure_noon_mb: null,
        cloud_cover_noon_pct: null,
        daily_high_air_temp_f: null,
        daily_low_air_temp_f: null,
        daily_precip_in: null,
        daily_wind_max_mph: null,
        moon_phase: null,
        sunrise_local: null,
        sunset_local: null,
      },
      env_data: null,
      shared_environment: null,
      data_coverage: {},
      error,
    });

    const archive = await fetchArchiveWeather(
      scenario.latitude,
      scenario.longitude,
      scenario.local_date,
    );
    if (!archive) return failed("archive_weather_unavailable");

    const [sun, moon] = await Promise.all([
      fetchSunriseSunset(
        scenario.latitude,
        scenario.longitude,
        scenario.local_date,
        scenario.timezone,
      ),
      fetchUSNOMoon(
        scenario.latitude,
        scenario.longitude,
        scenario.local_date,
        archive.tz_offset_seconds / 3600,
      ),
    ]);

    const envData = mapArchiveToEnvData(
      archive,
      scenario.local_date,
      scenario.timezone,
      sun,
      moon,
      null,
    );
    if (sun) {
      envData.sun = { sunrise: sun.sunrise, sunset: sun.sunset };
    }

    const sharedReq = buildSharedEngineRequestFromEnvData(
      scenario.latitude,
      scenario.longitude,
      scenario.local_date,
      scenario.timezone,
      scenario.context,
      envData,
      0,
      { useCalendarDayProfileForToday: true },
    );

    const noonIndex = findNoonHourIndex(
      archive.hourly_times_unix,
      scenario.local_date,
      scenario.timezone,
    );
    const dailyIndex = findDailyIndex(
      archive.daily_times_unix,
      scenario.local_date,
      scenario.timezone,
    );

    return {
      scenario_id: scenario.id,
      label: scenario.label,
      status: "ready",
      location: {
        latitude: scenario.latitude,
        longitude: scenario.longitude,
        state_code: scenario.state_code,
        timezone: scenario.timezone,
        local_date: scenario.local_date,
        region_key: region.region_key,
        month,
      },
      archive_summary: {
        archive_timezone: archive.timezone,
        noon_air_temp_f: noonIndex >= 0 ? archive.hourly_temp_f[noonIndex] ?? null : null,
        pressure_noon_mb: noonIndex >= 0 ? archive.hourly_pressure_msl[noonIndex] ?? null : null,
        cloud_cover_noon_pct: noonIndex >= 0 ? archive.hourly_cloud_cover[noonIndex] ?? null : null,
        daily_high_air_temp_f: dailyIndex >= 0 ? archive.daily_temp_max_f[dailyIndex] ?? null : null,
        daily_low_air_temp_f: dailyIndex >= 0 ? archive.daily_temp_min_f[dailyIndex] ?? null : null,
        daily_precip_in: dailyIndex >= 0 ? archive.daily_precip_in[dailyIndex] ?? null : null,
        daily_wind_max_mph: dailyIndex >= 0 ? archive.daily_wind_max_mph[dailyIndex] ?? null : null,
        moon_phase: moon?.phase ?? null,
        sunrise_local: sun?.sunrise ?? moon?.sun_rise ?? null,
        sunset_local: sun?.sunset ?? moon?.sun_set ?? null,
      },
      env_data: envData,
      shared_environment: sharedReq.environment,
      data_coverage: sharedReq.data_coverage,
      error: null,
    };
  }

  for (const [index, scenario] of scenarios.entries()) {
    console.log(`[${index + 1}/${scenarios.length}] Building archive env for ${scenario.id} (${scenario.local_date})`);
    builtScenarios.push(await buildScenarioBundle(scenario));
  }

  const bundle: ArchiveBatchBundle = {
    batch_id: batchId,
    generated_at: new Date().toISOString(),
    scenario_count: builtScenarios.length,
    scenarios: builtScenarios,
  };

  const path = buildArchiveEnvPath(batchId);
  await Deno.writeTextFile(path, `${JSON.stringify(bundle, null, 2)}\n`);

  const readyCount = builtScenarios.filter((scenario) => scenario.status === "ready").length;
  const failedCount = builtScenarios.length - readyCount;
  console.log(`Wrote ${path}`);
  console.log(`Archive bundle ready for ${readyCount}/${builtScenarios.length} scenarios`);
  if (failedCount > 0) console.log(`Archive bundle failures: ${failedCount}`);
}

export async function writeReviewSheetForBatch(
  batchId: string,
  scenarios: readonly ArchivedRecommenderAuditScenario[],
  scoreKeys: readonly RecommenderAuditScoreKey[],
): Promise<void> {
  let archiveBundle: ArchiveBatchBundle | null = null;
  const archivePath = buildArchiveEnvPath(batchId);
  try {
    const raw = await Deno.readTextFile(archivePath);
    archiveBundle = JSON.parse(raw) as ArchiveBatchBundle;
  } catch {
    archiveBundle = null;
  }

  const bundleByScenarioId = new Map(
    archiveBundle?.scenarios.map((scenario) => [scenario.scenario_id, scenario]) ?? [],
  );

  const sheet: ReviewSheet = {
    batch_id: batchId,
    generated_at: new Date().toISOString(),
    archive_bundle_generated_at: archiveBundle?.generated_at ?? null,
    scenario_count: scenarios.length,
    score_keys: scoreKeys,
    scenarios: scenarios.map((scenario) =>
      toReviewScenario(scenario, bundleByScenarioId.get(scenario.id), scoreKeys)
    ),
  };

  const outputJson = buildReviewSheetJsonPath(batchId);
  const outputMarkdown = buildReviewSheetMarkdownPath(batchId);
  await Deno.writeTextFile(outputJson, `${JSON.stringify(sheet, null, 2)}\n`);
  await Deno.writeTextFile(outputMarkdown, `${toMarkdown(batchId, sheet, scoreKeys)}\n`);
  console.log(`Wrote ${outputMarkdown}`);
  console.log(`Wrote ${outputJson}`);
}

export function topPrimaryHit(
  scenario: ArchivedRecommenderAuditScenario,
  top1Id: RecommenderV3ArchetypeId | undefined,
): boolean {
  if (!top1Id) return false;
  return scenario.expectation.primary_lanes.includes(top1Id);
}
