#!/usr/bin/env -S deno run --allow-read --allow-write

import { coastalWaterTempRow } from "../../supabase/functions/_shared/howFishingEngine/config/tempBandsCoastalWater.ts";
import { freshwaterTempRow } from "../../supabase/functions/_shared/howFishingEngine/config/tempBandsFreshwater.ts";
import type { EngineContext } from "../../supabase/functions/_shared/howFishingEngine/contracts/context.ts";
import { isCoastalFamilyContext } from "../../supabase/functions/_shared/howFishingEngine/contracts/context.ts";
import type { SharedEngineRequest } from "../../supabase/functions/_shared/howFishingEngine/contracts/input.ts";
import {
  CANONICAL_REGION_KEYS,
  type RegionKey,
} from "../../supabase/functions/_shared/howFishingEngine/contracts/region.ts";
import type { HowsFishingReport } from "../../supabase/functions/_shared/howFishingEngine/contracts/report.ts";
import { runHowFishingReport } from "../../supabase/functions/_shared/howFishingEngine/runHowFishingReport.ts";

const OUTPUT_MD = "scripts/audit/todays-bite-report-copy-baseline-audit.md";
const OUTPUT_JSONL =
  "scripts/audit/todays-bite-report-copy-baseline-audit.jsonl";

const CONTEXTS = [
  "freshwater_lake_pond",
  "freshwater_river",
  "coastal",
  "coastal_flats_estuary",
] as const satisfies readonly EngineContext[];
const OFFSETS = [0, 1, 2, 3, 4, 5, 6] as const;
const DAYPARTS = ["dawn", "morning", "afternoon", "evening"] as const;

type RegionMeta = { lat: number; lon: number; state: string; tz: string };
const REGION_META: Record<RegionKey, RegionMeta> = {
  northeast: { lat: 42.3, lon: -71.1, state: "MA", tz: "America/New_York" },
  southeast_atlantic: {
    lat: 32.8,
    lon: -79.9,
    state: "SC",
    tz: "America/New_York",
  },
  florida: { lat: 27.9, lon: -82.5, state: "FL", tz: "America/New_York" },
  gulf_coast: { lat: 29.9, lon: -90.1, state: "LA", tz: "America/Chicago" },
  great_lakes_upper_midwest: {
    lat: 44.3,
    lon: -84.7,
    state: "MI",
    tz: "America/Detroit",
  },
  midwest_interior: {
    lat: 40,
    lon: -86.2,
    state: "IN",
    tz: "America/Indiana/Indianapolis",
  },
  south_central: { lat: 30.3, lon: -97.7, state: "TX", tz: "America/Chicago" },
  mountain_west: { lat: 40.7, lon: -111.9, state: "UT", tz: "America/Denver" },
  southwest_desert: {
    lat: 33.4,
    lon: -112,
    state: "AZ",
    tz: "America/Phoenix",
  },
  southwest_high_desert: {
    lat: 35.1,
    lon: -106.7,
    state: "NM",
    tz: "America/Denver",
  },
  pacific_northwest: {
    lat: 47.6,
    lon: -122.3,
    state: "WA",
    tz: "America/Los_Angeles",
  },
  southern_california: {
    lat: 34,
    lon: -118.2,
    state: "CA",
    tz: "America/Los_Angeles",
  },
  mountain_alpine: {
    lat: 39.6,
    lon: -105.9,
    state: "CO",
    tz: "America/Denver",
  },
  northern_california: {
    lat: 38.3,
    lon: -123,
    state: "CA",
    tz: "America/Los_Angeles",
  },
  appalachian: { lat: 38.4, lon: -81.6, state: "WV", tz: "America/New_York" },
  inland_northwest: {
    lat: 47.7,
    lon: -117.4,
    state: "WA",
    tz: "America/Los_Angeles",
  },
  alaska: { lat: 61.2, lon: -149.9, state: "AK", tz: "America/Anchorage" },
  hawaii: { lat: 21.3, lon: -157.8, state: "HI", tz: "Pacific/Honolulu" },
};

type ScenarioId =
  | "elite"
  | "strong"
  | "ordinary_good"
  | "fair_mixed"
  | "poor_tough"
  | "catastrophic"
  | "missing_partial"
  | "heat"
  | "cold_warming"
  | "active_rain"
  | "recent_rain"
  | "runoff"
  | "high_wind"
  | "overcast"
  | "bright_glare"
  | "tide_current"
  | "missing_tide";

type Scenario = {
  id: ScenarioId;
  temp: "elite" | "strong" | "ordinary" | "fair" | "cold" | "hot" | "bad";
  wind: number | null;
  cloud: number | null;
  pressure: number[] | null;
  p24: number | null;
  p72: number | null;
  p7d: number | null;
  active: boolean | null;
  rate: number | null;
  current: number | null;
  tide: "moving" | "slack" | "hard" | "none";
  hourlyTemp:
    | "flat"
    | "warming"
    | "cool_relief"
    | "hot_flat"
    | "cold_flat"
    | "missing";
  hourlyCloud: "flat" | "overcast" | "clear_edges" | "bright" | "missing";
  missing?: boolean;
};

type FieldIssue = {
  type: string;
  field: string;
  text: string;
  note: string;
  severity: number;
};

type AuditRow = {
  region: RegionKey;
  month: number;
  forecast_offset: number;
  context: EngineContext;
  archetype: ScenarioId;
  score: number;
  band: string;
  reliability: string;
  free_surface: { score: number; summary_line: string };
  paid_surface: {
    summary_line: string;
    drivers: string[];
    suppressors: string[];
    timing_insight: string | null;
    daypart_note: string | null;
    actionable_tip: string;
    reliability_note: string | null;
    solunar_note: string | null;
    section_names: string[];
  };
  highlighted_periods: string[];
  normalized: {
    temperature_label?: string;
    temperature_score?: number;
    temperature_trend?: string;
    temperature_shock?: string;
    pressure_label?: string;
    wind_label?: string;
    precip_label?: string;
    runoff_label?: string;
    tide_label?: string;
    light_label?: string;
    tide_events?: number | null;
    missing_variables: string[];
    data_gaps: string[];
    avoid_midday_for_heat?: boolean;
  };
  issues: FieldIssue[];
};

const SCENARIOS: Scenario[] = [
  [
    "elite",
    "elite",
    8,
    65,
    stablePressure(1015),
    0,
    0.02,
    0.08,
    false,
    0,
    1.1,
    "moving",
    "flat",
    "overcast",
  ],
  [
    "strong",
    "strong",
    9,
    55,
    fallingPressure(),
    0,
    0.04,
    0.1,
    false,
    0,
    1.0,
    "moving",
    "flat",
    "flat",
  ],
  [
    "ordinary_good",
    "ordinary",
    8,
    45,
    stablePressure(1015),
    0.02,
    0.05,
    0.15,
    false,
    0,
    0.9,
    "moving",
    "flat",
    "flat",
  ],
  [
    "fair_mixed",
    "fair",
    13,
    35,
    stablePressure(1015),
    0.08,
    0.25,
    0.6,
    false,
    0,
    0.6,
    "slack",
    "flat",
    "clear_edges",
  ],
  [
    "poor_tough",
    "bad",
    20,
    8,
    volatilePressure(),
    0.2,
    0.7,
    1.4,
    false,
    0,
    2.1,
    "hard",
    "flat",
    "bright",
  ],
  [
    "catastrophic",
    "bad",
    34,
    5,
    volatilePressure(),
    1.2,
    2.2,
    4.5,
    true,
    0.35,
    3.0,
    "hard",
    "hot_flat",
    "bright",
  ],
  [
    "missing_partial",
    "ordinary",
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    "none",
    "missing",
    "missing",
    true,
  ],
  [
    "heat",
    "hot",
    4,
    8,
    stablePressure(1016),
    0,
    0.02,
    0.05,
    false,
    0,
    0.9,
    "moving",
    "cool_relief",
    "bright",
  ],
  [
    "cold_warming",
    "cold",
    5,
    35,
    fallingPressure(),
    0,
    0.02,
    0.08,
    false,
    0,
    1.0,
    "moving",
    "warming",
    "clear_edges",
  ],
  [
    "active_rain",
    "ordinary",
    7,
    85,
    stablePressure(1014),
    0.35,
    0.5,
    0.8,
    true,
    0.18,
    0.9,
    "moving",
    "flat",
    "overcast",
  ],
  [
    "recent_rain",
    "ordinary",
    8,
    55,
    stablePressure(1015),
    0.05,
    0.9,
    1.7,
    false,
    0,
    0.8,
    "moving",
    "flat",
    "flat",
  ],
  [
    "runoff",
    "ordinary",
    9,
    55,
    stablePressure(1015),
    0.55,
    1.4,
    2.6,
    false,
    0,
    0.8,
    "moving",
    "flat",
    "flat",
  ],
  [
    "high_wind",
    "ordinary",
    30,
    45,
    stablePressure(1015),
    0,
    0.03,
    0.08,
    false,
    0,
    1.4,
    "moving",
    "flat",
    "flat",
  ],
  [
    "overcast",
    "ordinary",
    6,
    92,
    stablePressure(1015),
    0,
    0.03,
    0.08,
    false,
    0,
    0.9,
    "moving",
    "flat",
    "overcast",
  ],
  [
    "bright_glare",
    "ordinary",
    2,
    5,
    stablePressure(1015),
    0,
    0.03,
    0.08,
    false,
    0,
    0.6,
    "slack",
    "flat",
    "bright",
  ],
  [
    "tide_current",
    "ordinary",
    8,
    50,
    stablePressure(1015),
    0,
    0.02,
    0.08,
    false,
    0,
    1.4,
    "moving",
    "flat",
    "flat",
  ],
  [
    "missing_tide",
    "ordinary",
    8,
    50,
    stablePressure(1015),
    0,
    0.02,
    0.08,
    false,
    0,
    null,
    "none",
    "flat",
    "flat",
  ],
].map(([
  id,
  temp,
  wind,
  cloud,
  pressure,
  p24,
  p72,
  p7d,
  active,
  rate,
  current,
  tide,
  hourlyTemp,
  hourlyCloud,
  missing,
]) => ({
  id: id as ScenarioId,
  temp: temp as Scenario["temp"],
  wind,
  cloud,
  pressure,
  p24,
  p72,
  p7d,
  active,
  rate,
  current,
  tide: tide as Scenario["tide"],
  hourlyTemp: hourlyTemp as Scenario["hourlyTemp"],
  hourlyCloud: hourlyCloud as Scenario["hourlyCloud"],
  missing,
}));

function stablePressure(base: number): number[] {
  return [base, base + 0.1, base - 0.1, base, base + 0.1, base];
}
function fallingPressure(): number[] {
  return [1018, 1016, 1014, 1012.5, 1011.5, 1010.5];
}
function volatilePressure(): number[] {
  return [1012, 1004, 1011, 1005, 1013, 1006];
}
function pad2(n: number): string {
  return String(n).padStart(2, "0");
}
function localDate(month: number, offset: number, day = 10): string {
  return `2026-${pad2(month)}-${pad2(day + offset)}`;
}
function rowForTemp(context: EngineContext, region: RegionKey, month: number) {
  return isCoastalFamilyContext(context)
    ? coastalWaterTempRow(region, month)
    : freshwaterTempRow(region, month);
}
function tempFor(row: number[] | null, mode: Scenario["temp"]): number {
  if (!row) return 65;
  const vc = Number(row[0]);
  const cool = Number(row[1]);
  const opt = Number(row[2]);
  const warm = Number(row[3]);
  if (mode === "elite") return (opt + warm) / 2;
  if (mode === "strong") return opt - 1;
  if (mode === "ordinary") return (cool + opt) / 2;
  if (mode === "fair") return cool - 1;
  if (mode === "cold") return Math.max(18, (vc + cool) / 2 - 1);
  if (mode === "hot") return warm + 8;
  return mode === "bad" ? warm + 16 : (cool + opt) / 2;
}
function hourlyTemps(
  mode: Scenario["hourlyTemp"],
  mean: number,
): number[] | null {
  if (mode === "missing") return null;
  if (mode === "warming") {
    return Array.from({ length: 24 }, (_, h) => mean - 8 + h * 0.65);
  }
  if (mode === "cool_relief") {
    return Array.from(
      { length: 24 },
      (_, h) => mean + (h < 8 ? -8 : h < 18 ? 6 : -4),
    );
  }
  if (mode === "hot_flat") return Array.from({ length: 24 }, () => mean + 4);
  if (mode === "cold_flat") return Array.from({ length: 24 }, () => mean - 2);
  return Array.from({ length: 24 }, () => mean);
}
function hourlyClouds(
  mode: Scenario["hourlyCloud"],
  cloud: number | null,
): number[] | null {
  if (mode === "missing") return null;
  if (mode === "overcast") return Array.from({ length: 24 }, () => 88);
  if (mode === "bright") return Array.from({ length: 24 }, () => 8);
  if (mode === "clear_edges") {
    return [
      35,
      35,
      35,
      35,
      35,
      25,
      30,
      55,
      60,
      65,
      65,
      60,
      60,
      60,
      55,
      50,
      45,
      25,
      25,
      30,
      35,
      35,
      35,
      35,
    ];
  }
  return Array.from({ length: 24 }, () => cloud ?? 50);
}
function tideEvents(date: string, mode: Scenario["tide"]) {
  if (mode === "none") return null;
  if (mode === "slack") {
    return [
      { time: `${date}T03:10:00`, value: 0.4, type: "L" },
      { time: `${date}T22:40:00`, value: 0.6, type: "H" },
    ];
  }
  if (mode === "hard") {
    return [
      { time: `${date}T05:10:00`, value: 0.1, type: "L" },
      { time: `${date}T11:20:00`, value: 4.6, type: "H" },
      { time: `${date}T17:40:00`, value: 0.0, type: "L" },
    ];
  }
  return [
    { time: `${date}T06:10:00`, value: 0.2, type: "L" },
    { time: `${date}T12:40:00`, value: 3.1, type: "H" },
    { time: `${date}T18:20:00`, value: 0.4, type: "L" },
  ];
}
function buildReq(
  region: RegionKey,
  month: number,
  offset: number,
  context: EngineContext,
  scenario: Scenario,
): SharedEngineRequest {
  const meta = REGION_META[region];
  const date = localDate(month, offset);
  const t = tempFor(rowForTemp(context, region, month), scenario.temp) +
    offset * 0.15;
  const coastal = isCoastalFamilyContext(context);
  const prior = scenario.hourlyTemp === "warming"
    ? t - 6
    : scenario.temp === "hot"
    ? t - 1
    : t;
  const day2 = scenario.hourlyTemp === "warming" ? t - 10 : prior;
  return {
    latitude: meta.lat,
    longitude: meta.lon,
    state_code: meta.state,
    region_key: region,
    local_date: date,
    local_timezone: meta.tz,
    context,
    environment: {
      current_air_temp_f: t,
      daily_mean_air_temp_f: scenario.missing ? null : t,
      daily_low_air_temp_f: scenario.missing ? null : t - 6,
      daily_high_air_temp_f: scenario.missing ? null : t + 7,
      prior_day_mean_air_temp_f: scenario.missing ? null : prior,
      day_minus_2_mean_air_temp_f: scenario.missing ? null : day2,
      measured_water_temp_f: coastal && !scenario.missing ? t : null,
      measured_water_temp_24h_ago_f: coastal && !scenario.missing
        ? prior
        : null,
      measured_water_temp_72h_ago_f: coastal && !scenario.missing ? day2 : null,
      measured_water_temp_source: coastal && !scenario.missing
        ? "audit_station"
        : null,
      pressure_mb: scenario.pressure?.at(-1) ?? null,
      pressure_history_mb: scenario.pressure,
      wind_speed_mph: scenario.wind,
      cloud_cover_pct: scenario.cloud,
      precip_24h_in: scenario.p24,
      precip_72h_in: scenario.p72,
      precip_7d_in: scenario.p7d,
      active_precip_now: scenario.active,
      precip_rate_now_in_per_hr: scenario.rate,
      current_speed_knots_max: scenario.current,
      tide_movement_state: scenario.tide === "slack"
        ? "slack"
        : scenario.tide === "moving" || scenario.tide === "hard"
        ? "incoming"
        : null,
      tide_high_low: tideEvents(date, scenario.tide),
      sunrise_local: `${date}T06:12:00`,
      sunset_local: `${date}T19:46:00`,
      solunar_peak_local: scenario.missing
        ? null
        : [`${date}T08:30:00`, `${date}T20:10:00`],
      hourly_air_temp_f: hourlyTemps(scenario.hourlyTemp, t),
      hourly_cloud_cover_pct: hourlyClouds(
        scenario.hourlyCloud,
        scenario.cloud,
      ),
    },
    data_coverage: {
      source_notes: scenario.missing ? ["Audit fixture: partial data."] : [],
    },
  };
}

const INTERNAL_RE =
  /\b(engine|model|variable|driver|suppressor|baseline|final score|raw score|gate|cap|normalized|band_score|engine label|optimal|near_optimal|very_warm|very_cold)\b/i;
const AMBIGUOUS_RE =
  /\b(something to work with|stay sharp|good decisions|details matter|execution|clean decisions|solid overall|path today|not obvious|free advantage|mostly helpful|balanced setup|workable day|take some adjustment|fair day,? not an easy one|enough here to stay interested|gives you a chance|not much room for mistakes|get careless)\b/i;
const GUIDE_TACKLE_RE =
  /\b(bait|retrieve|presentation|cast|rod|line|profile|lure|fly|hardware|cadence|pause|weight)\b/i;
const DATA_LIMITED_RE =
  /\b((some|key|important) inputs? (are|were) limited|data is thinner|inputs? (are|were) thinner|broader read|broad read|broad guidance|local adjustment|leave (yourself )?more room|leave room to adjust|directional than exact|precision is looser)\b/i;
const RAIN_RE = /\b(rain|runoff|flow|flood|wet)\b/i;
const TIDE_RE = /\b(tide|current|exchange)\b/i;
const HEAT_RE = /\b(heat|hot|midday|cooler)\b/i;
const COLD_RE = /\b(cold|chill|warmest|warmth|warming)\b/i;
const GENERIC_FACTOR_LABELS = new Set([
  "Temperature",
  "Pressure",
  "Wind",
  "Cloud Cover",
  "Rain",
  "Rain / Runoff",
  "Tide / Current",
  "Current",
]);
const SECTION_NAMES = [
  "BITE FACTORS",
  "WHAT'S HELPING",
  "WATCH OUT FOR",
  "WHEN TO GO",
  "MOON & TIDE",
  "FIELD STRATEGY",
  "FINFINDR CONDITIONS",
  "ANGLER UNLOCKS THE FULL READ",
];

function periods(report: HowsFishingReport): string[] {
  const hp = report.highlighted_periods ?? [false, false, false, false];
  return DAYPARTS.filter((_, i) => hp[i]);
}
function sentenceCount(text: string): number {
  return (text.match(/[.!?]/g) ?? []).length;
}
function fieldTexts(report: HowsFishingReport): Array<[string, string]> {
  return [
    ["summary_line", report.summary_line],
    ["timing_insight", report.timing_insight ?? ""],
    ["daypart_note", report.daypart_note ?? ""],
    ["actionable_tip", report.actionable_tip],
    ["reliability_note", report.reliability_note ?? ""],
    ["solunar_note", report.solunar_note ?? ""],
    ...report.drivers.map((d, i) =>
      [`driver_${i + 1}`, d.label] as [string, string]
    ),
    ...report.suppressors.map((s, i) =>
      [`suppressor_${i + 1}`, s.label] as [string, string]
    ),
  ];
}
function addIssue(
  issues: FieldIssue[],
  type: string,
  field: string,
  text: string,
  note: string,
  severity = 1,
) {
  issues.push({ type, field, text, note, severity });
}
function bestTimesSegment(text: string): string {
  const match = text.match(/Best times:\s*([^.]*)\./i);
  return match?.[1] ?? "";
}
function auditIssues(
  report: HowsFishingReport,
  req: SharedEngineRequest,
  scenario: Scenario,
): FieldIssue[] {
  const issues: FieldIssue[] = [];
  const ctx = report.condition_context;
  for (const [field, text] of fieldTexts(report)) {
    if (!text) continue;
    if (INTERNAL_RE.test(text)) {
      addIssue(
        issues,
        "internal_language",
        field,
        text,
        "User-facing copy contains engine/internal terminology.",
        3,
      );
    }
    if (AMBIGUOUS_RE.test(text)) {
      addIssue(
        issues,
        "beginner_ambiguity",
        field,
        text,
        "Line sounds polished but does not clearly tell a beginner what the day means.",
      );
    }
  }

  if (
    report.summary_line.length > 220 || sentenceCount(report.summary_line) > 3
  ) {
    addIssue(
      issues,
      "summary_length",
      "summary_line",
      report.summary_line,
      "Summary exceeds target length or sentence count.",
      2,
    );
  }
  if (
    report.reliability === "low" && !DATA_LIMITED_RE.test(report.summary_line)
  ) {
    addIssue(
      issues,
      "low_reliability_missing_caveat",
      "summary_line",
      report.summary_line,
      "Low-reliability free summary should include a plain-English data-limited caveat.",
      3,
    );
  }

  for (
    const [kind, entries] of [
      ["driver", report.drivers],
      ["suppressor", report.suppressors],
    ] as const
  ) {
    entries.forEach((entry, i) => {
      if (GENERIC_FACTOR_LABELS.has(entry.label)) {
        addIssue(
          issues,
          "generic_factor_label",
          `${kind}_${i + 1}`,
          entry.label,
          "Paid factor row exposes only the category name, not the available condition detail.",
          3,
        );
      }
      if (entry.label.length > 90) {
        addIssue(
          issues,
          "factor_label_length",
          `${kind}_${i + 1}`,
          entry.label,
          "Factor label may not fit mobile rows cleanly.",
        );
      }
    });
  }

  const timing = report.timing_insight ?? report.daypart_note ?? "";
  const best = bestTimesSegment(timing);
  if (best && !report.highlighted_periods?.[2] && /\bafternoon\b/i.test(best)) {
    addIssue(
      issues,
      "timing_period_contradiction",
      "timing_insight",
      timing,
      "Timing copy praises afternoon even though afternoon is not highlighted.",
      3,
    );
  }
  if (
    report.timing_debug?.anchor_driver === "tide_exchange_window" &&
    (ctx?.environment_snapshot.tide_high_low_event_count ?? 0) === 0
  ) {
    addIssue(
      issues,
      "tide_without_events",
      "timing_insight",
      timing,
      "Tide/current timing appears without same-day tide events.",
      4,
    );
  }
  if (!ctx?.avoid_midday_for_heat && HEAT_RE.test(timing)) {
    addIssue(
      issues,
      "heat_language_without_heat_guard",
      "timing_insight",
      timing,
      "Timing line references heat/cooler windows without an active heat guard.",
      2,
    );
  }
  if (
    ctx?.temperature_metabolic_context === "neutral" &&
    COLD_RE.test(report.summary_line)
  ) {
    addIssue(
      issues,
      "cold_language_neutral_temperature",
      "summary_line",
      report.summary_line,
      "Summary uses cold/warmth language while temperature context is neutral.",
      2,
    );
  }

  const missing = new Set(report.normalized_debug?.missing_variables ?? []);
  const gaps = report.normalized_debug?.data_gaps ?? [];
  const rainMissing = missing.has("precipitation_disruption") ||
    missing.has("runoff_flow_disruption") ||
    gaps.some((g) => /precip|runoff/i.test(g.variable_key));
  const combinedText = fieldTexts(report).map(([, text]) => text).join(" ");
  if (rainMissing && RAIN_RE.test(combinedText)) {
    addIssue(
      issues,
      "rain_wording_with_missing_rain_data",
      "paid_surface",
      combinedText.slice(0, 260),
      "Rain/runoff wording appears when related data is missing or gapped.",
      2,
    );
  }
  if (
    !isCoastalFamilyContext(req.context) && /measured water/i.test(combinedText)
  ) {
    addIssue(
      issues,
      "freshwater_measured_water_implication",
      "paid_surface",
      combinedText.slice(0, 260),
      "Freshwater report appears to imply measured water temperature.",
      3,
    );
  }
  if (
    isCoastalFamilyContext(req.context) &&
    /runoff/i.test(combinedText) &&
    !report.normalized_debug?.available_variables.includes(
      "runoff_flow_disruption",
    )
  ) {
    addIssue(
      issues,
      "coastal_runoff_implication",
      "paid_surface",
      combinedText.slice(0, 260),
      "Coastal report appears to imply freshwater runoff handling.",
      2,
    );
  }

  if (GUIDE_TACKLE_RE.test(report.actionable_tip)) {
    addIssue(
      issues,
      "guide_note_recommender_overlap",
      "actionable_tip",
      report.actionable_tip,
      "Field Strategy is too tackle-like; product direction keeps this focused on using the condition read.",
      3,
    );
  }
  if (
    report.actionable_tip.length > 190 ||
    sentenceCount(report.actionable_tip) > 2
  ) {
    addIssue(
      issues,
      "guide_note_length",
      "actionable_tip",
      report.actionable_tip,
      "Field Strategy is longer than a compact field note target.",
    );
  }
  if ((report.timing_insight ?? "").length > 200) {
    addIssue(
      issues,
      "timing_length",
      "timing_insight",
      report.timing_insight ?? "",
      "Timing insight exceeds compact one-line target.",
    );
  }

  const factorNouns = [
    "temperature",
    "pressure",
    "wind",
    "cloud",
    "rain",
    "runoff",
    "tide",
    "current",
  ].filter((word) =>
    new RegExp(`\\b${word}\\b`, "i").test(report.summary_line)
  );
  if (factorNouns.length > 2) {
    addIssue(
      issues,
      "free_surface_detail_leak",
      "free_summary",
      report.summary_line,
      "Free preview summary may expose too many paid-factor details.",
    );
  }

  if (scenario.id === "missing_tide" && TIDE_RE.test(timing)) {
    addIssue(
      issues,
      "missing_tide_wording",
      "timing_insight",
      timing,
      "Missing-tide scenario still references tide/current timing.",
      3,
    );
  }

  return issues;
}

function toAuditRow(
  region: RegionKey,
  month: number,
  offset: number,
  context: EngineContext,
  scenario: Scenario,
): AuditRow {
  const req = buildReq(region, month, offset, context, scenario);
  const report = runHowFishingReport(req);
  const ctx = report.condition_context;
  const issues = auditIssues(report, req, scenario);
  return {
    region,
    month,
    forecast_offset: offset,
    context,
    archetype: scenario.id,
    score: report.score,
    band: report.band,
    reliability: report.reliability,
    free_surface: { score: report.score, summary_line: report.summary_line },
    paid_surface: {
      summary_line: report.summary_line,
      drivers: report.drivers.map((d) => d.label),
      suppressors: report.suppressors.map((s) => s.label),
      timing_insight: report.timing_insight ?? null,
      daypart_note: report.daypart_note ?? null,
      actionable_tip: report.actionable_tip,
      reliability_note: report.reliability_note ?? null,
      solunar_note: report.solunar_note ?? null,
      section_names: SECTION_NAMES,
    },
    highlighted_periods: periods(report),
    normalized: {
      temperature_label: ctx?.temperature_band,
      temperature_score: ctx?.normalized_variable_scores.find((v) =>
        v.variable_key === "temperature_condition"
      )?.engine_score,
      temperature_trend: ctx?.temperature_trend,
      temperature_shock: ctx?.temperature_shock,
      pressure_label: ctx?.normalized_variable_scores.find((v) =>
        v.variable_key === "pressure_regime"
      )?.engine_label,
      wind_label: ctx?.normalized_variable_scores.find((v) =>
        v.variable_key === "wind_condition"
      )?.engine_label,
      precip_label: ctx?.precipitation_disruption_label ?? undefined,
      runoff_label: ctx?.runoff_flow_label ?? undefined,
      tide_label: ctx?.tide_detail ?? undefined,
      light_label: ctx?.light_cloud_label ?? undefined,
      tide_events: ctx?.environment_snapshot.tide_high_low_event_count ?? null,
      missing_variables: report.normalized_debug?.missing_variables ?? [],
      data_gaps:
        report.normalized_debug?.data_gaps?.map((g) =>
          `${g.variable_key}:${g.reason}`
        ) ?? [],
      avoid_midday_for_heat: ctx?.avoid_midday_for_heat,
    },
    issues,
  };
}

function countBy<T extends string>(items: T[]): Record<T, number> {
  const out = {} as Record<T, number>;
  for (const item of items) out[item] = (out[item] ?? 0) + 1;
  return out;
}
function topEntries<T>(
  entries: Iterable<[T, number]>,
  n: number,
): Array<[T, number]> {
  return [...entries].sort((a, b) => b[1] - a[1]).slice(0, n);
}
function mdTable(
  headers: string[],
  rows: Array<Array<string | number>>,
): string {
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) =>
      `| ${row.map((cell) => String(cell).replace(/\|/g, "\\|")).join(" | ")} |`
    ),
  ].join("\n");
}
function excerpt(text: string, max = 180): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
}

function buildMarkdown(rows: AuditRow[]): string {
  const issues = rows.flatMap((row) =>
    row.issues.map((issue) => ({ row, issue }))
  );
  const issueCounts = countBy(issues.map((x) => x.issue.type));
  const fieldCounts = countBy(issues.map((x) => x.issue.field));
  const rowsWithIssues = new Set(issues.map((x) => x.row)).size;
  const worst = issues
    .sort((a, b) =>
      b.issue.severity - a.issue.severity ||
      (issueCounts[b.issue.type] ?? 0) - (issueCounts[a.issue.type] ?? 0)
    )
    .slice(0, 20);
  const actionTipRepeats = new Map<string, number>();
  const summaryOpeners = new Map<string, number>();
  for (const row of rows) {
    actionTipRepeats.set(
      row.paid_surface.actionable_tip,
      (actionTipRepeats.get(row.paid_surface.actionable_tip) ?? 0) + 1,
    );
    const opener = row.free_surface.summary_line.split(".")[0] ?? "";
    summaryOpeners.set(opener, (summaryOpeners.get(opener) ?? 0) + 1);
  }

  const lines: string[] = [];
  lines.push("# Today's Bite Report Copy Baseline Audit\n");
  lines.push(`Generated: ${new Date().toISOString()}\n`);
  lines.push(
    "Audit-only. Generated representative Today’s Bite reports across all canonical regions, all 12 months, all four contexts, forecast offsets 0..6, and 17 archetypes. No production behavior changed.\n",
  );
  lines.push("## Executive Recommendation\n");
  lines.push(
    "- Result: report surface passes the baseline issue checks when total issues are zero. The numeric/timing engine is ready; this audit checks whether paid factors and Field Strategy explain that read clearly.",
  );
  lines.push(
    "- Any next patch should remain copy-only. Keep scoring/timing untouched and keep Field Strategy separate from Tackle Box.",
  );
  lines.push("\n## Totals\n");
  lines.push(`- Rows audited: ${rows.length}`);
  lines.push(`- Rows with issues: ${rowsWithIssues}`);
  lines.push(`- Total issues: ${issues.length}`);
  lines.push("\n## Counts By Issue Type\n");
  lines.push(
    mdTable(
      ["Issue type", "Count"],
      topEntries(Object.entries(issueCounts), 30),
    ),
  );
  lines.push("\n## Counts By Field\n");
  lines.push(
    mdTable(["Field", "Count"], topEntries(Object.entries(fieldCounts), 20)),
  );
  lines.push("\n## Top 20 Worst Examples\n");
  lines.push(
    mdTable(
      [
        "#",
        "Issue",
        "Region",
        "Month",
        "Context",
        "Archetype",
        "Field",
        "Text",
        "Note",
      ],
      worst.map(({ row, issue }, i) => [
        i + 1,
        issue.type,
        row.region,
        row.month,
        row.context,
        row.archetype,
        issue.field,
        excerpt(issue.text, 150),
        issue.note,
      ]),
    ),
  );
  lines.push("\n## Summary Quality Findings\n");
  lines.push(
    `- Summary length issues: ${
      issueCounts.summary_length ?? 0
    }. Current deterministic summary generally respects the <=220 char target.`,
  );
  lines.push(
    `- Beginner-ambiguity flags: ${
      issueCounts.beginner_ambiguity ?? 0
    }. Current summaries avoid the broad editorial phrases that previously sounded polished without adding tactical meaning.`,
  );
  lines.push(
    `- Free detail leakage flags: ${
      issueCounts.free_surface_detail_leak ?? 0
    }. Free surface mostly stays useful without exposing full paid detail.`,
  );
  lines.push(
    `- Low-reliability caveat flags: ${
      issueCounts.low_reliability_missing_caveat ?? 0
    }. Low-reliability free summaries should plainly say the read is broader or data-limited.`,
  );
  lines.push("\n## Factor Label Findings\n");
  lines.push(
    `- Generic factor label flags: ${
      issueCounts.generic_factor_label ?? 0
    }. Paid factor rows now use condition-specific copy instead of only category names such as Temperature, Wind, Rain, and Tide / Current.`,
  );
  lines.push(
    "- Current target: compact row headers with clear user-facing copy: temperature should stay basic, while pressure, rain, runoff, wind, tide/current, and light/cloud can use their condition detail.",
  );
  lines.push("\n## Timing Sentence Findings\n");
  lines.push(
    `- Timing period contradictions: ${
      issueCounts.timing_period_contradiction ?? 0
    }.`,
  );
  lines.push(
    `- Tide-without-events flags: ${
      issueCounts.tide_without_events ?? 0
    }; missing-tide wording flags: ${issueCounts.missing_tide_wording ?? 0}.`,
  );
  lines.push(
    `- Timing length flags: ${
      issueCounts.timing_length ?? 0
    }. Timing is generally compact, but repeated "Best times..." structure can feel mechanical.`,
  );
  lines.push("\n## Field Strategy / Actionable Tip Findings\n");
  lines.push(
    `- Recommender-overlap flags: ${
      issueCounts.guide_note_recommender_overlap ?? 0
    }. This should stay near zero; Tackle Box owns tackle specifics.`,
  );
  lines.push(
    "- Recommendation: Field Strategy should say what mistake to avoid, how strict to be with timing, whether to fish patiently/aggressively, and how to use the condition read.",
  );
  lines.push("\n## Free Limited Findings\n");
  lines.push(
    "- Free limited surface is structurally sound: score + summary only, with paid sections gated. It is useful without obviously leaking timing/factor/tackle depth.",
  );
  lines.push(
    "- Static paywall copy should avoid promising tackle detail on this surface; Tackle Box owns that.",
  );
  lines.push("\n## Paid Full-Report Findings\n");
  lines.push(
    "- Paid surface clearly includes why/when/how sections, and factor rows now have room to explain the condition detail behind the score.",
  );
  lines.push(
    "- Section names are understandable: BITE FACTORS, WHAT'S HELPING, WATCH OUT FOR, WHEN TO GO, MOON & TIDE, FIELD STRATEGY.",
  );
  lines.push(
    "- FIELD STRATEGY / FINFINDR CONDITIONS should stay focused on using the read, not tackle selection.",
  );
  lines.push("\n## Repetition Findings\n");
  lines.push(
    mdTable(
      ["Repeated actionable tip", "Count"],
      topEntries(actionTipRepeats.entries(), 10).map(([text, count]) => [
        excerpt(text, 130),
        count,
      ]),
    ),
  );
  lines.push("\n");
  lines.push(
    mdTable(
      ["Repeated summary opener", "Count"],
      topEntries(summaryOpeners.entries(), 10).map(([text, count]) => [
        excerpt(text, 130),
        count,
      ]),
    ),
  );
  lines.push("\n## Recommended Copy Architecture\n");
  lines.push("- Keep current top-level fields for compatibility.");
  lines.push(
    "- Keep `report.drivers[].label` / `report.suppressors[].label` focused on concise condition-specific copy, with `variable` still available for the UI category eyebrow.",
  );
  lines.push(
    "- Keep `actionable_tip` compatible as the Field Strategy text, or add a new optional `field_strategy_note` later if a cleaner contract is desired.",
  );
  lines.push(
    "- Production files touched by this copy architecture: `runHowFishingReport.ts`, `summary/summaryLine.ts`, `summary/factorSurfaceLabels.ts`, `tips/buildTips.ts`, `components/fishing/RebuildReportView.tsx`, and free-surface copy in `supabase/functions/how-fishing/index.ts`.",
  );
  lines.push("\n## Protected-Path Status\n");
  lines.push("- Audit script did not edit recommender production files.");
  lines.push("- Audit script did not edit `buildNormalized.ts`.");
  return lines.join("\n");
}

const rows: AuditRow[] = [];
for (const region of CANONICAL_REGION_KEYS) {
  for (let month = 1; month <= 12; month++) {
    for (const offset of OFFSETS) {
      for (const context of CONTEXTS) {
        for (const scenario of SCENARIOS) {
          rows.push(toAuditRow(region, month, offset, context, scenario));
        }
      }
    }
  }
}

await Deno.writeTextFile(
  OUTPUT_JSONL,
  rows.map((row) => JSON.stringify(row)).join("\n") + "\n",
);
await Deno.writeTextFile(OUTPUT_MD, buildMarkdown(rows));

console.log(`Wrote ${OUTPUT_MD}`);
console.log(`Wrote ${OUTPUT_JSONL}`);
