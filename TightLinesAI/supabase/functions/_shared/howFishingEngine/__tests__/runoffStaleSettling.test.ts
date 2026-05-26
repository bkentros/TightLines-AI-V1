import { assert, assertEquals } from "jsr:@std/assert";
import { analyzeSharedConditions } from "../analyzeSharedConditions.ts";
import { buildSharedNormalizedOutput } from "../normalize/buildNormalized.ts";
import { normalizeRunoff } from "../normalize/normalizeRunoff.ts";
import { scoreDay } from "../score/scoreDay.ts";
import { scoreDayOptionsFromRequest } from "../analyzeSharedConditions.ts";
import { runHowFishingReport } from "../runHowFishingReport.ts";
import type {
  EngineContext,
  SharedEngineRequest,
  SharedNormalizedOutput,
} from "../contracts/mod.ts";
import { analyzeRecommenderConditions } from "../../recommenderEngine/sharedAnalysis.ts";
import type { RecommenderRequest } from "../../recommenderEngine/contracts/input.ts";
import { resolveDailyPicksSeasonalRow } from "../../recommenderEngine/dailyPicks/resolveDailyPicksSeasonalRow.ts";
import { runDailyPicksEngine } from "../../recommenderEngine/dailyPicks/runDailyPicksEngine.ts";

function pressureHistory(): number[] {
  return Array.from({ length: 24 }, () => 1014);
}

function riverReq(
  overrides: Partial<SharedEngineRequest["environment"]> = {},
  reqOverrides: Partial<SharedEngineRequest> = {},
): SharedEngineRequest {
  return {
    latitude: 44.3,
    longitude: -84.7,
    state_code: "MI",
    region_key: "great_lakes_upper_midwest",
    local_date: "2026-04-15",
    local_timezone: "America/Detroit",
    context: "freshwater_river",
    environment: {
      current_air_temp_f: 52,
      daily_mean_air_temp_f: 52,
      daily_low_air_temp_f: 45,
      daily_high_air_temp_f: 61,
      prior_day_mean_air_temp_f: 52,
      day_minus_2_mean_air_temp_f: 51,
      pressure_mb: 1014,
      pressure_history_mb: pressureHistory(),
      wind_speed_mph: 7,
      cloud_cover_pct: 62,
      precip_rate_now_in_per_hr: 0,
      active_precip_now: false,
      precip_24h_in: 0.03,
      precip_72h_in: 0.16,
      precip_7d_in: 1.55,
      tide_movement_state: null,
      current_speed_knots_max: null,
      tide_high_low: null,
      tide_height_hourly_ft: null,
      ...overrides,
    },
    data_coverage: { source_notes: [] },
    ...reqOverrides,
  };
}

function contextReq(
  context: EngineContext,
  overrides: Partial<SharedEngineRequest["environment"]> = {},
): SharedEngineRequest {
  return {
    ...riverReq(overrides),
    context,
    environment: {
      ...riverReq(overrides).environment,
      tide_movement_state: context === "freshwater_river" ? null : "incoming",
      current_speed_knots_max: context === "freshwater_river" ? null : 1.1,
      tide_high_low: context === "freshwater_river" ? null : [
        { time: "2026-04-15T05:30:00", value: 0.2, type: "L" as const },
        { time: "2026-04-15T11:45:00", value: 2.5, type: "H" as const },
        { time: "2026-04-15T18:10:00", value: 0.3, type: "L" as const },
      ],
    },
  };
}

function scoreWithOldRunoff(req: SharedEngineRequest) {
  const norm = buildSharedNormalizedOutput(req);
  const oldRunoff = normalizeRunoff(
    req.region_key,
    req.environment.precip_24h_in,
    req.environment.precip_72h_in,
    req.environment.precip_7d_in,
    Number.parseInt(req.local_date.slice(5, 7), 10),
    { activeHeavyRain: true },
  );
  const oldNorm: SharedNormalizedOutput = {
    ...norm,
    normalized: {
      ...norm.normalized,
      runoff_flow_disruption: oldRunoff ?? undefined,
    },
  };
  return scoreDay(
    oldNorm,
    scoreDayOptionsFromRequest(
      req,
      analyzeSharedConditions(req).timing.timing_strength,
    ),
  );
}

Deno.test("runoff stale-settling: Great Lakes April/May stale elevated runoff softens but stays Fair", () => {
  for (const month of [4, 5]) {
    const mean = month === 5 ? 62 : 52;
    const req = riverReq({
      current_air_temp_f: mean,
      daily_mean_air_temp_f: mean,
      daily_low_air_temp_f: mean - 7,
      daily_high_air_temp_f: mean + 9,
      prior_day_mean_air_temp_f: mean,
      day_minus_2_mean_air_temp_f: mean - 1,
    }, {
      local_date: `2026-${String(month).padStart(2, "0")}-15`,
    });
    const analysis = analyzeSharedConditions(req);
    const oldScore = scoreWithOldRunoff(req);
    const runoff = analysis.norm.normalized.runoff_flow_disruption;

    assertEquals(runoff?.label, "elevated");
    assert(runoff);
    assert(runoff.detail?.includes("stale_settling_p7d_only"));
    assert(
      runoff.score < 0,
      `runoff must remain negative, got ${runoff.score}`,
    );
    assert(
      analysis.scored.score > oldScore.score,
      `expected stale-settling softness to lift score, old ${oldScore.score}, new ${analysis.scored.score}`,
    );
    assertEquals(analysis.scored.band, "Fair");
  }
});

Deno.test("runoff stale-settling: Great Lakes June snowmelt-risk elevated runoff remains blocked", () => {
  const req = riverReq({}, { local_date: "2026-06-15" });
  const analysis = analyzeSharedConditions(req);
  const oldScore = scoreWithOldRunoff(req);
  const runoff = analysis.norm.normalized.runoff_flow_disruption;

  assertEquals(runoff?.label, "elevated");
  assert(runoff);
  assert(!runoff.detail?.includes("stale_settling_p7d_only"));
  assertEquals(analysis.scored.score, oldScore.score);
});

Deno.test("runoff stale-settling: active heavy rain and high recent rain remain unchanged", () => {
  const active = analyzeSharedConditions(riverReq({
    active_precip_now: true,
    precip_rate_now_in_per_hr: 0.08,
  })).norm.normalized.runoff_flow_disruption;
  assertEquals(active?.label, "elevated");
  assert(active);
  assert(!active.detail?.includes("stale_settling_p7d_only"));

  const highRecent = analyzeSharedConditions(riverReq({
    precip_24h_in: 0.20,
    precip_72h_in: 0.16,
  })).norm.normalized.runoff_flow_disruption;
  assertEquals(highRecent?.label, "elevated");
  assert(highRecent);
  assert(!highRecent.detail?.includes("stale_settling_p7d_only"));
});

Deno.test("runoff stale-settling: blown-out runoff remains unchanged", () => {
  const runoff = analyzeSharedConditions(riverReq({
    precip_24h_in: 0.20,
    precip_72h_in: 2.20,
    precip_7d_in: 6.0,
  })).norm.normalized.runoff_flow_disruption;

  assertEquals(runoff?.label, "blown_out");
  assert(runoff);
  assert(!runoff.detail?.includes("stale_settling_p7d_only"));
});

Deno.test("runoff stale-settling: lake, coastal, and flats precipitation are unchanged by river-only marker", () => {
  for (
    const context of [
      "freshwater_lake_pond",
      "coastal",
      "coastal_flats_estuary",
    ] as const
  ) {
    const norm = buildSharedNormalizedOutput(contextReq(context));
    assertEquals(norm.normalized.runoff_flow_disruption, undefined);
    assert(
      !norm.normalized.precipitation_disruption?.detail?.includes(
        "stale_settling_p7d_only",
      ),
      `${context} should not receive river stale-settling detail`,
    );
  }
});

Deno.test("runoff stale-settling: report copy surfaces candidate-scored factors without stale/missing contradictions", () => {
  const report = runHowFishingReport(riverReq());
  const runoff = report.condition_context?.normalized_variable_scores.find(
    (v) => v.variable_key === "runoff_flow_disruption",
  );

  assert(runoff?.engine_detail?.includes("stale_settling_p7d_only"));
  assert(
    report.suppressors.some((s) => s.variable === "runoff_flow_disruption"),
    JSON.stringify(report.suppressors),
  );
  assert(
    !report.drivers.some((d) => d.variable === "runoff_flow_disruption"),
    JSON.stringify(report.drivers),
  );
  assert(
    /\b(runoff|river|flow)\b/i.test(
      report.suppressors.find((s) => s.variable === "runoff_flow_disruption")
        ?.label ?? "",
    ),
    JSON.stringify(report.suppressors),
  );
});

function runRecommenderActivity(req: SharedEngineRequest) {
  const analysis = analyzeSharedConditions(req);
  const recReq: RecommenderRequest = {
    location: {
      latitude: req.latitude,
      longitude: req.longitude,
      state_code: req.state_code ?? "MI",
      region_key: req.region_key,
      local_date: req.local_date,
      local_timezone: req.local_timezone,
      month: Number.parseInt(req.local_date.slice(5, 7), 10),
    },
    species: "river_trout",
    context: "freshwater_river",
    water_clarity: "stained",
    recommendation_goal: "all_purpose",
    env_data: {
      ...req.environment,
      weather: { wind_speed_unit: "mph" },
    },
  };
  const recAnalysis = analyzeRecommenderConditions(recReq);
  const seasonalRow = resolveDailyPicksSeasonalRow({
    species: "river_trout",
    region_key: req.region_key,
    month: recReq.location.month,
    water_type: req.context,
  });
  return runDailyPicksEngine({
    req: recReq,
    analysis: {
      ...recAnalysis,
      norm: analysis.norm,
      scored: analysis.scored,
    },
    seasonalRow,
    seed: "runoff-stale-settling-test",
    variant: "A",
  }).scenario.activity_level;
}

Deno.test("runoff stale-settling: recommender does not move in a bad direction", () => {
  const activity = runRecommenderActivity(riverReq());
  assert(["neutral", "active"].includes(activity), activity);
});
