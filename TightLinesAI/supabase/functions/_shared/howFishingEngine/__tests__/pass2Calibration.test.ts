import { assert, assertAlmostEquals, assertEquals } from "jsr:@std/assert";
import {
  seasonalBracket,
  seasonalValue,
} from "../config/seasonalInterpolation.ts";
import { calibratedRegionalThermalScore } from "../config/regionalThermalCalibration.ts";
import { CANONICAL_REGION_KEYS } from "../contracts/region.ts";
import { normalizeTemperature } from "../normalize/normalizeTemperature.ts";
import { normalizeLight } from "../normalize/normalizeLight.ts";
import { buildSharedNormalizedOutput } from "../normalize/buildNormalized.ts";
import { analyzeSharedConditions } from "../analyzeSharedConditions.ts";
import {
  runHowFishingReport,
  runHowFishingScoreOnly,
} from "../runHowFishingReport.ts";
import { computeActiveWeights } from "../score/reweight.ts";
import { buildDailyScenario } from "../../recommenderEngine/dailyPicks/buildDailyScenario.ts";
import { resolveDailyPicksSeasonalRow } from "../../recommenderEngine/dailyPicks/resolveDailyPicksSeasonalRow.ts";
import type { EngineContext, SharedEngineRequest } from "../contracts/mod.ts";

function request(
  overrides: Partial<SharedEngineRequest> = {},
): SharedEngineRequest {
  return {
    latitude: 32.3,
    longitude: -86.3,
    state_code: "AL",
    region_key: "south_central",
    local_date: "2026-01-15",
    local_timezone: "UTC",
    context: "freshwater_lake_pond",
    data_coverage: {},
    environment: {
      daily_mean_air_temp_f: 65,
      prior_day_mean_air_temp_f: 65,
      day_minus_2_mean_air_temp_f: 65,
      daily_high_air_temp_f: 73,
      daily_low_air_temp_f: 57,
      pressure_history_mb: Array(25).fill(1013),
      wind_speed_mph: 8,
      cloud_cover_pct: 75,
      precip_24h_in: 0,
      precip_72h_in: 0,
      precip_7d_in: 0,
      active_precip_now: false,
      precip_rate_now_in_per_hr: 0,
    },
    ...overrides,
  };
}

Deno.test("Pass 2: seasonal anchors wrap years and respect leap days", () => {
  assertEquals(seasonalBracket("2026-01-15"), { from: 1, to: 2, fraction: 0 });
  assertEquals(seasonalBracket("2026-01-01"), {
    from: 12,
    to: 1,
    fraction: 17 / 31,
  });
  assertEquals(seasonalBracket("2028-03-01"), {
    from: 2,
    to: 3,
    fraction: 15 / 29,
  });
  assertEquals(seasonalValue("2026-11-15", (m) => m * 2), 22);
});

Deno.test("Pass 2: all midmonth thermal anchors preserve their table suitability", () => {
  for (const region of CANONICAL_REGION_KEYS) {
    for (let month = 1; month <= 12; month++) {
      for (const context of ["freshwater_river", "coastal"] as const) {
        const date = `2026-${String(month).padStart(2, "0")}-15`;
        for (const t of [35, 55, 75, 95]) {
          const oldCall = normalizeTemperature(
            context,
            region,
            month,
            t,
            t,
            t,
          )!;
          const calendar = normalizeTemperature(
            context,
            region,
            month,
            t,
            t,
            t,
            { localDate: date },
          )!;
          assertEquals(calendar.band_score, oldCall.band_score);
          assertEquals(calendar.final_score, oldCall.final_score);
        }
      }
    }
  }
});

Deno.test("Pass 2: regional correction is monotone, bounded, and preserves thermal extremes", () => {
  for (const region of CANONICAL_REGION_KEYS) {
    let previous = -2;
    for (let i = -200; i <= 200; i++) {
      const score = i / 100;
      const value = calibratedRegionalThermalScore(region, score);
      assert(value >= previous - 1e-10);
      assert(value >= score - 1e-10);
      assert(value - score <= 1.00001);
      if (score <= -1.5 || score >= .5) assertEquals(value, score);
      previous = value;
    }
  }
});

Deno.test("Pass 2: temperature and its provenance never change when only rain changes", () => {
  for (const context of ["freshwater_lake_pond", "freshwater_river"] as const) {
    const req = request({
      region_key: "florida",
      local_date: "2026-11-15",
      context,
    });
    const expected = buildSharedNormalizedOutput(req).normalized.temperature;
    for (const rain of [0, .999, 1, 1.001, 3]) {
      req.environment.precip_24h_in = rain;
      req.environment.precip_72h_in = rain;
      req.environment.precip_7d_in = rain;
      const a = analyzeSharedConditions(req);
      assertEquals(a.norm.normalized.temperature, expected);
      assertAlmostEquals(
        a.scored.contributions.reduce((sum, c) => sum + c.weight, 0),
        100,
        1e-8,
      );
      assertEquals(
        a.scored.contributions.find((c) => c.key === "temperature_condition")
          ?.score,
        expected?.final_score,
      );
    }
  }
});

Deno.test("Pass 2: adverse heat and shock never receive regional relief", () => {
  const hot = normalizeTemperature(
    "freshwater_lake_pond",
    "florida",
    7,
    104,
    104,
    104,
    { localDate: "2026-07-15" },
  )!;
  assert(hot.final_score < 0);
  assertEquals(hot.regional_calibration_adjustment, 0);
  const shock = normalizeTemperature(
    "freshwater_lake_pond",
    "florida",
    11,
    65,
    77,
    83,
    { localDate: "2026-11-15" },
  )!;
  assertEquals(shock.shock_label, "sharp_cooldown");
  assertEquals(shock.regional_calibration_adjustment, 0);
});

Deno.test("Pass 2: hourly air fallback has explicit lower confidence; freshwater water observations are not reinterpreted as air", () => {
  const req = request();
  req.environment.current_air_temp_f = 65;
  req.environment.daily_mean_air_temp_f = null;
  const a = analyzeSharedConditions(req);
  assertEquals(
    a.norm.normalized.temperature?.source_quality,
    "current_air_fallback",
  );
  assert(a.norm.reliability !== "high");
  assert(a.scored.score <= 72);
  const daily = request();
  daily.environment.measured_water_temp_f = 80;
  const n = buildSharedNormalizedOutput(daily);
  assertEquals(n.normalized.temperature?.measurement_value_f, 65);
  assertEquals(n.normalized.temperature?.source_quality, "daily_air_proxy");
});

Deno.test("Pass 2: measured-water history uses its actual 72h interval for trend and sustained shock", () => {
  const water = (past: number) =>
    normalizeTemperature("coastal", "florida", 1, 50, 50, 50, {
      measuredWaterTempF: 65,
      measuredWaterTemp24hAgoF: 60,
      measuredWaterTemp72hAgoF: past,
    })!;
  assertEquals(water(47).history_span_hours, 72);
  assertEquals(water(47).shock_label, "none");
  assertEquals(water(38).shock_label, "sharp_warmup");
  const air = normalizeTemperature(
    "freshwater_lake_pond",
    "south_central",
    1,
    65,
    60,
    47,
  )!;
  assertEquals(air.history_span_hours, 48);
  assertEquals(air.shock_label, "sharp_warmup");
});

Deno.test("Pass 2: light scoring is continuous at cloud and wind transitions", () => {
  for (
    const context of [
      "freshwater_lake_pond",
      "freshwater_river",
      "coastal",
      "coastal_flats_estuary",
    ] as const
  ) {
    for (const coldRelief of [0, .5, 1]) {
      for (const wind of [2, 17.999, 18, 22]) {
        for (const cloud of [10, 20, 25, 50, 69, 75, 85, 90]) {
          const a = normalizeLight(cloud - .0001, context, {
            coldRelief,
            windMph: wind,
          })!;
          const b = normalizeLight(cloud + .0001, context, {
            coldRelief,
            windMph: wind,
          })!;
          assert(
            Math.abs(a.score - b.score) <= .0002,
            `${context} cloud ${cloud}`,
          );
        }
      }
    }
    assertAlmostEquals(
      normalizeLight(95, context, { windMph: 17.99999 })!.score,
      normalizeLight(95, context, { windMph: 18.00001 })!.score,
      .0001,
    );
  }
});

Deno.test("Pass 2: seasonal weights always sum to 100 for the available factors", () => {
  for (const region of CANONICAL_REGION_KEYS) {
    for (let month = 1; month <= 12; month++) {
      const req = request({
        region_key: region,
        local_date: `2026-${String(month).padStart(2, "0")}-01`,
      });
      const norm = buildSharedNormalizedOutput(req);
      const weights = computeActiveWeights(
        req.context,
        region,
        req.local_date,
        new Set(norm.available_variables),
      );
      assertAlmostEquals(
        weights.reduce((s, w) => s + w.finalWeight, 0),
        100,
        1e-8,
      );
    }
  }
});

Deno.test("Pass 2: southern month boundaries retain score/report parity with small thermal changes", () => {
  for (
    const region of [
      "florida",
      "gulf_coast",
      "south_central",
      "southeast_atlantic",
    ] as const
  ) {
    for (const month of [9, 10, 11, 12, 1, 2, 3]) {
      for (
        const context of [
          "freshwater_lake_pond",
          "freshwater_river",
          "coastal",
          "coastal_flats_estuary",
        ] as const
      ) {
        const scores: number[] = [];
        const temps: number[] = [];
        for (const day of [0, 1]) {
          const req = request({
            region_key: region,
            context,
            local_date: new Date(Date.UTC(2026, month, day)).toISOString()
              .slice(0, 10),
          });
          if (context.startsWith("coastal")) {
            Object.assign(req.environment, {
              measured_water_temp_f: 65,
              measured_water_temp_24h_ago_f: 65,
              measured_water_temp_72h_ago_f: 65,
              current_speed_knots_max: 1.3,
            });
          }
          const a = analyzeSharedConditions(req);
          const report = runHowFishingReport(req);
          assertEquals(report.score, runHowFishingScoreOnly(req));
          scores.push(report.score);
          temps.push(a.norm.normalized.temperature!.final_score);
        }
        assert(Math.abs(temps[1] - temps[0]) < .2);
        assert(
          Math.abs(scores[1] - scores[0]) <= 5,
          `${region} ${context} ${month}: ${scores}`,
        );
      }
    }
  }
});

Deno.test("Pass 2: score caps are authoritative for missing temperature and heavy rain", () => {
  const req = request();
  req.environment.daily_mean_air_temp_f = null;
  req.environment.current_air_temp_f = null;
  assert(runHowFishingReport(req).score <= 64);
  const wet = request();
  Object.assign(wet.environment, {
    active_precip_now: true,
    precip_rate_now_in_per_hr: .2,
    precip_24h_in: 2,
    precip_72h_in: 3,
    precip_7d_in: 4,
  });
  assert(runHowFishingReport(wet).score <= 55);
});

Deno.test("Pass 2: real shared winter-warm and summer-heat analyses agree with bass recommendation semantics", () => {
  for (
    const [month, t, expectedHeat] of [[1, 65, false], [7, 104, true]] as const
  ) {
    const req = request({
      local_date: `2026-${String(month).padStart(2, "0")}-15`,
    });
    Object.assign(req.environment, {
      daily_mean_air_temp_f: t,
      prior_day_mean_air_temp_f: t,
      day_minus_2_mean_air_temp_f: t,
    });
    const analysis = analyzeSharedConditions(req);
    const recReq = {
      location: {
        latitude: req.latitude,
        longitude: req.longitude,
        state_code: "AL",
        region_key: req.region_key,
        local_date: req.local_date,
        local_timezone: "UTC",
        month,
      },
      context: req.context,
      species: "largemouth_bass" as const,
      water_clarity: "clear" as const,
      recommendation_goal: "all_purpose" as const,
      env_data: req.environment,
    };
    const row = resolveDailyPicksSeasonalRow({
      species: recReq.species,
      region_key: req.region_key,
      month,
      water_type: req.context,
    });
    const scenario = buildDailyScenario({
      req: recReq,
      analysis,
      seasonalRow: row,
    });
    assertEquals(scenario.thermal_mode === "heat_limited", expectedHeat);
    assertEquals(
      analysis.condition_context.temperature_metabolic_context ===
        "heat_limited",
      expectedHeat,
    );
  }
});

Deno.test("Pass 2: moderate southern coastal WATER is never severe cold, with cold/hot tails preserved", () => {
  for (
    const region of ["gulf_coast", "florida", "southeast_atlantic"] as const
  ) {
    for (let month = 1; month <= 12; month++) {
      for (const t of [75, 78, 80]) {
        const n = normalizeTemperature("coastal", region, month, 30, 30, 30, {
          measuredWaterTempF: t,
          measuredWaterTemp24hAgoF: t,
          measuredWaterTemp72hAgoF: t,
        })!;
        assert(n.band_label !== "very_cold" && n.band_label !== "cool");
        assert(n.final_score >= 0, `${region} ${month} ${t}: ${n.final_score}`);
      }
      for (const t of [35, 105]) {
        const n = normalizeTemperature("coastal", region, month, t, t, t, {
          measuredWaterTempF: t,
          measuredWaterTemp24hAgoF: t,
          measuredWaterTemp72hAgoF: t,
        })!;
        if (t === 35) assert(n.final_score <= -1.5);
        // Winter upper anchors remain seasonally unusual warmth, not invented heat stress.
        if (t === 105 && month >= 6 && month <= 9) {
          assert(
            n.final_score <= -1.5,
          );
        }
      }
    }
  }
});

Deno.test("Pass 2: reported contribution percentages sum to 100", () => {
  const report = runHowFishingReport(request());
  const rows = report.condition_context!.composite_contributions!;
  assertAlmostEquals(
    rows.reduce((sum, row) => sum + row.weight_percent, 0),
    100,
    0.03,
  );
  for (const row of rows) {
    assertAlmostEquals(row.weight_percent, row.weight, 0.0051);
  }
});
