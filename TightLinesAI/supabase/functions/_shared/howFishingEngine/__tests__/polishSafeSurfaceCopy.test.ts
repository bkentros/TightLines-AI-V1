/**
 * Run: deno test --allow-read supabase/functions/_shared/howFishingEngine/__tests__/polishSafeSurfaceCopy.test.ts
 */
import { assert, assertEquals, assertStringIncludes } from "jsr:@std/assert";
import { DISPLAY_CONTEXT_LABEL } from "../contracts/context.ts";
import type { HowsFishingReport } from "../contracts/report.ts";
import {
  buildDeterministicSolunarNote,
  buildDeterministicTimingInsight,
  buildEngineLedSummaryLine,
  listSurfaceCopyForAudit,
} from "../narration/polishSafeSurfaceCopy.ts";
import {
  buildReportSummaryLine,
  buildVariableDisplayLabel,
  listSummaryCopyForAudit,
} from "../summary/summaryLine.ts";
import { buildActionableTip, listTipCopyForAudit } from "../tips/buildTips.ts";
import { listTimingCopyForAudit } from "../timing/timingNotes.ts";
import { runHowFishingReport } from "../runHowFishingReport.ts";

function minimalReport(
  overrides: Partial<HowsFishingReport>,
): HowsFishingReport {
  const base: HowsFishingReport = {
    context: "freshwater_river",
    display_context_label: DISPLAY_CONTEXT_LABEL.freshwater_river,
    location: {
      latitude: 44.6,
      longitude: -84.6,
      state_code: "MI",
      region_key: "midwest",
      timezone: "America/Detroit",
      local_date: "2026-03-29",
    },
    score: 71,
    band: "Good",
    summary_line: "Solid day ahead — more working for you than against you.",
    drivers: [],
    suppressors: [],
    actionable_tip: "Tip",
    actionable_tip_tag: "strategy_field_plan",
    daypart_preset: null,
    reliability: "high",
  };
  return { ...base, ...overrides };
}

Deno.test("buildEngineLedSummaryLine prefixes location", () => {
  const r = minimalReport({});
  const out = buildEngineLedSummaryLine(r, "Prudenville, MI");
  assertStringIncludes(out, "Prudenville");
  assertStringIncludes(out, "Solid day ahead");
});

Deno.test("buildDeterministicTimingInsight respects highlighted periods", () => {
  const r = minimalReport({
    highlighted_periods: [false, false, true, false],
    daypart_note: null,
  });
  const out = buildDeterministicTimingInsight(r);
  assertStringIncludes(out.toLowerCase(), "afternoon");
});

Deno.test("buildReportSummaryLine is deterministic and references factor names", () => {
  const out = buildReportSummaryLine({
    band: "Good",
    score: 68,
    context: "coastal",
    reliability: "high",
    drivers: [{ variable: "tide_current_movement" }],
    suppressors: [{ variable: "wind_condition" }],
    seed: "coastal|florida|2026-03-30|68",
  });
  assertStringIncludes(out.toLowerCase(), "tidal movement");
  assertStringIncludes(out.toLowerCase(), "wind");
  assertEquals(/\bbut Wind\b/.test(out), false, out);
  assertEquals(
    out,
    buildReportSummaryLine({
      band: "Good",
      score: 68,
      context: "coastal",
      reliability: "high",
      drivers: [{ variable: "tide_current_movement" }],
      suppressors: [{ variable: "wind_condition" }],
      seed: "coastal|florida|2026-03-30|68",
    }),
  );
});

Deno.test("buildReportSummaryLine stays compact when context and reliability closers are eligible", () => {
  const out = buildReportSummaryLine({
    band: "Good",
    score: 68,
    context: "coastal_flats_estuary",
    reliability: "low",
    drivers: [{ variable: "temperature_condition" }],
    suppressors: [{ variable: "wind_condition" }],
    seed: "coastal_flats_estuary|florida|2026-08-17|68|compact",
  });
  assert(out.length <= 220, `summary too long: ${out.length} chars`);
  assertEquals(/[.!?]$/.test(out), true);
});

Deno.test("buildDeterministicSolunarNote stays soft and non-null when peaks exist", () => {
  const r = minimalReport({
    condition_context: {
      temperature_band: "optimal",
      temperature_trend: "stable",
      temperature_shock: "none",
      region_key: "northeast",
      available_variables: [],
      missing_variables: [],
      temperature_metabolic_context: "neutral",
      avoid_midday_for_heat: false,
      highlighted_dayparts_for_narration: [],
      normalized_variable_scores: [],
      composite_contributions: [],
      environment_snapshot: {
        current_air_temp_f: 60,
        daily_mean_air_temp_f: 60,
        measured_water_temp_f: null,
        measured_water_temp_24h_ago_f: null,
        measured_water_temp_72h_ago_f: null,
        measured_water_temp_source: null,
        daily_low_air_temp_f: 48,
        daily_high_air_temp_f: 68,
        air_temp_diurnal_range_f: 20,
        prior_day_mean_air_temp_f: 57,
        day_minus_2_mean_air_temp_f: 54,
        pressure_mb: 1015,
        wind_speed_mph: 6,
        cloud_cover_pct: 45,
        precip_24h_in: 0,
        precip_72h_in: 0,
        precip_7d_in: 0,
        active_precip_now: false,
        precip_rate_now_in_per_hr: 0,
        tide_movement_state: null,
        tide_station_id: null,
        current_speed_knots_max: null,
        sunrise_local: "06:30",
        sunset_local: "19:40",
        solunar_peak_count: 2,
        hourly_air_temp_sample_count: 24,
        hourly_cloud_cover_sample_count: 24,
        pressure_history_summary: null,
        tide_high_low_event_count: null,
        sky_narration_contract: null,
      },
    },
  });
  const out = buildDeterministicSolunarNote(r);
  assertEquals(typeof out, "string");
  assertStringIncludes(out ?? "", "bonus");
});

Deno.test("buildDeterministicTimingInsight preserves ending punctuation when trimmed", () => {
  const r = minimalReport({
    highlighted_periods: [false, true, true, false],
    daypart_note:
      "Best opportunities near around 12:10pm and around 8:25pm around the tide changes. The transition windows are the bite; slack in between is the slow stretch.",
  });
  const out = buildDeterministicTimingInsight(r);
  assert(out.length <= 200, `timing too long: ${out.length} chars`);
  assertEquals(
    /[.!?]$/.test(out),
    true,
    `timing missing end punctuation: ${out}`,
  );
});

Deno.test("river runoff label stays honest about proxy input", () => {
  assertEquals(
    buildVariableDisplayLabel("runoff_flow_disruption", "freshwater_river"),
    "Rain / Runoff",
  );
});

Deno.test("river positive runoff summary says stable flow", () => {
  const out = buildReportSummaryLine({
    band: "Good",
    score: 68,
    context: "freshwater_river",
    reliability: "high",
    drivers: [{ variable: "runoff_flow_disruption" }],
    suppressors: [],
    seed: "river-stable-flow-summary",
  });
  assertStringIncludes(out.toLowerCase(), "stable flow");
});

Deno.test("slight temperature suppressor uses proportional warmup wording", () => {
  const out = buildReportSummaryLine({
    band: "Fair",
    score: 47,
    context: "freshwater_river",
    reliability: "high",
    drivers: [{ variable: "light_cloud_condition", weightedContribution: 12 }],
    suppressors: [{
      variable: "temperature_condition",
      weightedContribution: -6.2,
      normalizedScore: -0.18,
      temperatureBreakdown: {
        context_group: "freshwater",
        measurement_source: "air_daily_mean",
        measurement_value_f: 63.9,
        band_label: "very_warm",
        band_score: 0.82,
        trend_label: "stable",
        trend_adjustment: 0,
        shock_label: "sharp_warmup",
        shock_adjustment: -1,
        final_score: -0.18,
      },
    }],
    seed: "clarkston-temp-soft-wording",
  });
  assertStringIncludes(out.toLowerCase(), "working against you a little");
  assertStringIncludes(out.toLowerCase(), "fast warmup");
  assertEquals(out.toLowerCase().includes("making things harder"), false, out);
});

Deno.test("light temperature suppressor picks thermal edge tip instead of harsh heat copy", () => {
  const out = buildActionableTip(
    "freshwater_lake_pond",
    undefined,
    {
      key: "temperature_condition",
      score: -0.18,
      label: "Temperature",
      weight: 32,
      weightedContribution: -5.8,
    },
    {
      temperature: {
        context_group: "freshwater",
        measurement_source: "air_daily_mean",
        measurement_value_f: 63.9,
        band_label: "very_warm",
        band_score: 0.82,
        trend_label: "stable",
        trend_adjustment: 0,
        shock_label: "sharp_warmup",
        shock_adjustment: -1,
        final_score: -0.18,
      },
    },
    "clarkston-temp-soft-tip",
  );
  assertEquals(
    out.actionable_tip.toLowerCase().includes("easy meal"),
    false,
    out.actionable_tip,
  );
});

Deno.test("report factor rows use condition-specific copy, not generic category labels", () => {
  const report = runHowFishingReport({
    latitude: 42.3,
    longitude: -71.1,
    state_code: "MA",
    region_key: "northeast",
    local_date: "2026-04-12",
    local_timezone: "America/New_York",
    context: "freshwater_river",
    environment: {
      daily_mean_air_temp_f: 58,
      prior_day_mean_air_temp_f: 52,
      day_minus_2_mean_air_temp_f: 49,
      pressure_history_mb: [1018, 1016, 1014, 1012.5],
      wind_speed_mph: 8,
      cloud_cover_pct: 65,
      precip_24h_in: 0,
      precip_72h_in: 0.04,
      precip_7d_in: 0.12,
      hourly_air_temp_f: Array.from({ length: 24 }, (_, h) => 48 + h * 0.55),
      hourly_cloud_cover_pct: Array(24).fill(65),
    },
    data_coverage: {},
  });
  const generic = new Set([
    "Temperature",
    "Pressure",
    "Wind",
    "Cloud Cover",
    "Rain",
    "Rain / Runoff",
    "Tide / Current",
    "Current",
  ]);
  for (const entry of [...report.drivers, ...report.suppressors]) {
    assertEquals(
      generic.has(entry.label),
      false,
      `generic factor label surfaced: ${entry.label}`,
    );
    assert(
      entry.label.length > entry.variable.length,
      `factor label lacks condition detail: ${entry.label}`,
    );
  }
});

Deno.test("field strategy note avoids tackle and presentation ownership", () => {
  const report = runHowFishingReport({
    latitude: 42.3,
    longitude: -71.1,
    state_code: "MA",
    region_key: "northeast",
    local_date: "2026-07-12",
    local_timezone: "America/New_York",
    context: "freshwater_lake_pond",
    environment: {
      daily_mean_air_temp_f: 91,
      prior_day_mean_air_temp_f: 90,
      day_minus_2_mean_air_temp_f: 89,
      pressure_history_mb: [1016, 1016, 1016, 1016],
      wind_speed_mph: 4,
      cloud_cover_pct: 8,
      precip_24h_in: 0,
      precip_72h_in: 0,
      precip_7d_in: 0.04,
      hourly_air_temp_f: Array.from(
        { length: 24 },
        (_, h) => h < 8 ? 80 : h < 18 ? 96 : 84,
      ),
      hourly_cloud_cover_pct: Array(24).fill(8),
    },
    data_coverage: {},
  });
  assertEquals(
    /\b(bait|lure|fly|retrieve|cast|rod|line|profile|hardware|cadence|pause|presentation)\b/i
      .test(report.actionable_tip),
    false,
    report.actionable_tip,
  );
  assert(
    /\b(window|plan|read|timing|water|condition|heat)\b/i.test(
      report.actionable_tip,
    ),
    report.actionable_tip,
  );
});

function assertCleanCopy(line: string) {
  const rendered = line
    .replaceAll("{driver}", "Temperature")
    .replaceAll("{suppressor}", "Wind");
  assertEquals(rendered, rendered.replace(/\s+/g, " ").trim());
  assertEquals(
    /\s[.,!?;:]/.test(rendered),
    false,
    `bad punctuation spacing: ${rendered}`,
  );
  assertEquals(
    /^[A-Z]/.test(rendered),
    true,
    `must start uppercase: ${rendered}`,
  );
  assertEquals(
    /[.!?]$/.test(rendered),
    true,
    `must end with punctuation: ${rendered}`,
  );
  assert(rendered.length <= 180, `copy line too long: ${rendered}`);
  for (
    const banned of [
      "headline",
      "stealing the show",
      "heavy lifting",
      "bonus column",
      "from the engine",
      "usable edge",
      "engine",
      "model",
      "baseline",
      "variable",
      "target zone",
      "prime window",
      "timing edge",
      "thermal",
      "headwind",
      "data's thin",
    ]
  ) {
    assertEquals(
      rendered.toLowerCase().includes(banned),
      false,
      `avoid vague phrase "${banned}": ${rendered}`,
    );
  }
}

Deno.test("summary copy banks stay concise and grammatically normalized", () => {
  for (const line of listSummaryCopyForAudit()) {
    assertCleanCopy(line);
  }
});

Deno.test("tip copy banks stay concise and grammatically normalized", () => {
  for (const line of listTipCopyForAudit()) {
    assertCleanCopy(line);
  }
});

Deno.test("timing copy banks stay concise and grammatically normalized", () => {
  for (const line of listTimingCopyForAudit()) {
    assertCleanCopy(line);
  }
});

Deno.test("surface copy banks stay concise and grammatically normalized", () => {
  for (const line of listSurfaceCopyForAudit()) {
    assertCleanCopy(line);
  }
});

Deno.test("driver label templates avoid internal or over-technical phrases", async () => {
  const source = await Deno.readTextFile(
    new URL("../score/driverLabels.ts", import.meta.url),
  );
  for (
    const banned of [
      "on the model",
      "baseline",
      "target zone",
      "thermal",
      "thermals",
      "composite",
      "cfs",
      "barometric",
      "hydrology",
      "heroics",
      "free conveyor belt",
      "micro-current",
      "engine sees",
    ]
  ) {
    assertEquals(
      source.toLowerCase().includes(banned),
      false,
      `driver label source contains "${banned}"`,
    );
  }
});
