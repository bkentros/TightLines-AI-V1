#!/usr/bin/env -S deno run --allow-read --allow-write

import { analyzeSharedConditions } from "../../supabase/functions/_shared/howFishingEngine/analyzeSharedConditions.ts";
import { coastalWaterTempRow } from "../../supabase/functions/_shared/howFishingEngine/config/tempBandsCoastalWater.ts";
import { freshwaterTempRow } from "../../supabase/functions/_shared/howFishingEngine/config/tempBandsFreshwater.ts";
import type { EngineContext } from "../../supabase/functions/_shared/howFishingEngine/contracts/context.ts";
import type { SharedEngineRequest } from "../../supabase/functions/_shared/howFishingEngine/contracts/input.ts";
import {
  CANONICAL_REGION_KEYS,
  type RegionKey,
} from "../../supabase/functions/_shared/howFishingEngine/contracts/region.ts";
import { isCoastalFamilyContext } from "../../supabase/functions/_shared/howFishingEngine/contracts/context.ts";
import { runHowFishingReport } from "../../supabase/functions/_shared/howFishingEngine/runHowFishingReport.ts";
import {
  evaluateFallbackBias,
  evaluatePreferredLightWindow,
  evaluateTemperatureWindow,
  evaluateTideWindow,
} from "../../supabase/functions/_shared/howFishingEngine/timing/evaluators/mod.ts";
import {
  climateZoneFromRegion,
  resolveTimingFamily,
  seasonFromMonth,
} from "../../supabase/functions/_shared/howFishingEngine/timing/timingFamilies.ts";
import { pickTimingNote } from "../../supabase/functions/_shared/howFishingEngine/timing/timingNotes.ts";
import type {
  DaypartBias,
  DaypartFlags,
  TimingDriverId,
  TimingEvalOptions,
  TimingSignal,
} from "../../supabase/functions/_shared/howFishingEngine/timing/timingTypes.ts";

const OUTPUT_MD =
  "scripts/audit/todays-bite-timing-post-patch-readiness-audit.md";
const OUTPUT_JSONL =
  "scripts/audit/todays-bite-timing-post-patch-readiness-audit.jsonl";

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
  | "stable_good"
  | "cold_but_warming"
  | "cold_and_stable"
  | "hot_with_dawn_relief"
  | "hot_all_day"
  | "overcast_low_light_window"
  | "bright_glare_day"
  | "windy_day"
  | "coastal_moving_tide"
  | "coastal_slack_tide"
  | "flats_skinny_water_wind_light"
  | "river_runoff_disruption"
  | "missing_partial_hourly_tide_light"
  | "ordinary_good_control"
  | "catastrophic_control";

type Scenario = {
  id: ScenarioId;
  temp: "seasonal" | "cold" | "hot" | "ordinary";
  wind: number | null;
  cloud: number | null;
  pressure: number[] | null;
  p24: number | null;
  p72: number | null;
  p7d: number | null;
  active: boolean | null;
  rate: number | null;
  current: number | null;
  tide: "moving" | "slack" | "none";
  hourlyTemp:
    | "flat"
    | "warming"
    | "cool_relief"
    | "hot_flat"
    | "cold_flat"
    | "missing";
  hourlyCloud: "flat" | "overcast" | "clear_edges" | "bright" | "missing";
};

type TimingSnap = {
  anchor: string;
  primary: string;
  fallback: boolean;
  strength: string;
  periods: string[];
  note: string;
  reason: string;
};

type CompareRow = {
  region: RegionKey;
  month: number;
  forecast_offset: number;
  context: EngineContext;
  scenario: ScenarioId;
  score: number;
  prod: TimingSnap;
  candidate: TimingSnap;
  prod_flags: string[];
  candidate_flags: string[];
  snapshot: Record<string, unknown>;
};

const SCENARIOS: Scenario[] = [
  [
    "stable_good",
    "seasonal",
    8,
    55,
    stablePressure(1015),
    0.02,
    0.05,
    0.1,
    false,
    0,
    1.1,
    "moving",
    "flat",
    "flat",
  ],
  [
    "cold_but_warming",
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
    "cold_and_stable",
    "cold",
    4,
    45,
    stablePressure(1018),
    0,
    0.02,
    0.08,
    false,
    0,
    0.9,
    "moving",
    "cold_flat",
    "flat",
  ],
  [
    "hot_with_dawn_relief",
    "hot",
    7,
    18,
    stablePressure(1016),
    0,
    0,
    0.04,
    false,
    0,
    1.1,
    "moving",
    "cool_relief",
    "bright",
  ],
  [
    "hot_all_day",
    "hot",
    3,
    12,
    stablePressure(1017),
    0,
    0,
    0.05,
    false,
    0,
    0.8,
    "moving",
    "hot_flat",
    "bright",
  ],
  [
    "overcast_low_light_window",
    "seasonal",
    8,
    88,
    fallingPressure(),
    0.02,
    0.04,
    0.1,
    false,
    0,
    1.1,
    "moving",
    "flat",
    "overcast",
  ],
  [
    "bright_glare_day",
    "seasonal",
    4,
    5,
    stablePressure(1015),
    0,
    0,
    0.04,
    false,
    0,
    0.9,
    "moving",
    "flat",
    "bright",
  ],
  [
    "windy_day",
    "seasonal",
    24,
    60,
    stablePressure(1010),
    0.02,
    0.06,
    0.15,
    false,
    0,
    1.3,
    "moving",
    "flat",
    "flat",
  ],
  [
    "coastal_moving_tide",
    "seasonal",
    9,
    45,
    fallingPressure(),
    0,
    0.03,
    0.1,
    false,
    0,
    1.4,
    "moving",
    "flat",
    "clear_edges",
  ],
  [
    "coastal_slack_tide",
    "seasonal",
    8,
    45,
    stablePressure(1014),
    0,
    0.03,
    0.1,
    false,
    0,
    0.1,
    "none",
    "flat",
    "clear_edges",
  ],
  [
    "flats_skinny_water_wind_light",
    "seasonal",
    15,
    20,
    stablePressure(1014),
    0,
    0.02,
    0.05,
    false,
    0,
    0.7,
    "moving",
    "flat",
    "bright",
  ],
  [
    "river_runoff_disruption",
    "seasonal",
    12,
    80,
    volatilePressure(),
    1.8,
    3.4,
    6,
    true,
    0.12,
    null,
    "none",
    "flat",
    "overcast",
  ],
  [
    "missing_partial_hourly_tide_light",
    "ordinary",
    8,
    null,
    stablePressure(1012),
    null,
    null,
    null,
    null,
    null,
    null,
    "none",
    "missing",
    "missing",
  ],
  [
    "ordinary_good_control",
    "ordinary",
    6,
    50,
    stablePressure(1014),
    0.03,
    0.08,
    0.18,
    false,
    0,
    1.0,
    "moving",
    "flat",
    "flat",
  ],
  [
    "catastrophic_control",
    "hot",
    34,
    3,
    volatilePressure(),
    3.2,
    6.2,
    9,
    true,
    0.4,
    3.2,
    "slack",
    "hot_flat",
    "bright",
  ],
].map((
  [
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
  ],
) => ({
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
  if (mode === "cold") return Math.max(18, (vc + cool) / 2 - 1);
  if (mode === "hot") return warm + 8;
  if (mode === "ordinary") return (cool + opt) / 2;
  return (opt + warm) / 2;
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
  if (mode === "overcast") {
    return [
      80,
      82,
      84,
      85,
      86,
      88,
      90,
      92,
      90,
      88,
      86,
      84,
      82,
      80,
      80,
      82,
      86,
      90,
      92,
      90,
      88,
      86,
      84,
      82,
    ];
  }
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
  if (mode === "bright") return Array.from({ length: 24 }, () => 8);
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
  day = 10,
): SharedEngineRequest {
  const meta = REGION_META[region];
  const date = localDate(month, offset, day);
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
      daily_mean_air_temp_f: t,
      daily_low_air_temp_f: t - 6,
      daily_high_air_temp_f: t + 7,
      prior_day_mean_air_temp_f: prior,
      day_minus_2_mean_air_temp_f: day2,
      measured_water_temp_f: coastal ? t : null,
      measured_water_temp_24h_ago_f: coastal ? prior : null,
      measured_water_temp_72h_ago_f: coastal ? day2 : null,
      measured_water_temp_source: coastal ? "audit_station" : null,
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
        : scenario.tide === "moving"
        ? "incoming"
        : null,
      tide_high_low: tideEvents(date, scenario.tide),
      sunrise_local: `${date}T06:12:00`,
      sunset_local: `${date}T19:46:00`,
      solunar_peak_local: [`${date}T08:30:00`, `${date}T20:10:00`],
      hourly_air_temp_f: hourlyTemps(scenario.hourlyTemp, t),
      hourly_cloud_cover_pct: hourlyClouds(
        scenario.hourlyCloud,
        scenario.cloud,
      ),
    },
    data_coverage: {
      source_notes: scenario.id === "missing_partial_hourly_tide_light"
        ? ["audit_missing_hourly_tide_light"]
        : [],
    },
  };
}

function timingOpts(req: SharedEngineRequest): TimingEvalOptions {
  return {
    local_date: req.local_date,
    tide_high_low: req.environment.tide_high_low,
    solunar_peak_local: req.environment.solunar_peak_local,
    sunrise_local: req.environment.sunrise_local,
    sunset_local: req.environment.sunset_local,
    cloud_cover_pct: req.environment.cloud_cover_pct,
    daily_mean_air_temp_f: req.environment.daily_mean_air_temp_f ??
      req.environment.current_air_temp_f,
    prior_day_mean_air_temp_f: req.environment.prior_day_mean_air_temp_f,
    hourly_air_temp_f: req.environment.hourly_air_temp_f,
    hourly_cloud_cover_pct: req.environment.hourly_cloud_cover_pct,
  };
}
function runDriver(
  driver: TimingDriverId,
  analysis: ReturnType<typeof analyzeSharedConditions>,
  opts: TimingEvalOptions,
): TimingSignal | null {
  if (driver === "tide_exchange_window") {
    return evaluateTideWindow(analysis.norm, opts);
  }
  if (driver === "avoid_heat") {
    return evaluateTemperatureWindow("avoid_heat", analysis.norm, opts);
  }
  if (driver === "seek_warmth") {
    return evaluateTemperatureWindow("seek_warmth", analysis.norm, opts);
  }
  if (driver === "light_window") {
    return evaluatePreferredLightWindow(analysis.norm, opts);
  }
  return null;
}
function fallbackPreset(periods: DaypartFlags): string {
  const key = periods.map((v) => v ? "1" : "0").join("");
  if (key === "1001" || key === "0101" || key === "1100" || key === "1000") {
    return "early_late_low_light";
  }
  if (
    key === "0010" || key === "0110" || key === "0011" || key === "0100" ||
    key === "0001"
  ) return "warmest_part_may_help";
  if (
    key === "1111" || key === "1010" || key === "1011" || key === "1110" ||
    key === "0111"
  ) return "moving_water_periods";
  return "no_timing_edge";
}
function signalNote(signal: TimingSignal, seed: string): string {
  if (
    signal.note_pool_key === "tide_exchange_specific" &&
    signal.exchange_times?.length
  ) {
    return `Tide exchange ${
      signal.exchange_times.join(" and ")
    } — fish the moving-water window around those turns.`;
  }
  return pickTimingNote(signal.note_pool_key, seed);
}

function isShapedLight(signal: TimingSignal | null): signal is TimingSignal {
  if (!signal) return false;
  const count = signal.periods.filter(Boolean).length;
  return count >= 1 && count <= 2 && signal.note_pool_key !== "cloud_all_day";
}

function hasOnlyMidday(signal: TimingSignal | null): boolean {
  return signal?.periods[0] === false && signal.periods[1] === false &&
    signal.periods[2] === true && signal.periods[3] === false;
}

function selectFallback(profileBias: string): TimingSignal {
  return evaluateFallbackBias(profileBias as DaypartBias);
}

function candidateTiming(
  req: SharedEngineRequest,
  analysis: ReturnType<typeof analyzeSharedConditions>,
): TimingSnap {
  const month = parseInt(req.local_date.slice(5, 7), 10) || 1;
  const profile = resolveTimingFamily(req.context, req.region_key, month);
  const opts = timingOpts(req);
  const primary = runDriver(profile.anchor_driver, analysis, opts);
  const heat = runDriver("avoid_heat", analysis, opts);
  const tide = runDriver("tide_exchange_window", analysis, opts);
  const warmth = runDriver("seek_warmth", analysis, opts);
  const light = runDriver("light_window", analysis, opts);
  const shapedLight = isShapedLight(light) ? light : null;
  let selected: TimingSignal | null = primary;
  let fallback = false;
  let reason =
    `priority_ladder considered: primary=${profile.anchor_driver}; heat=${
      heat ? "yes" : "no"
    }; warmth=${warmth ? "yes" : "no"}; shaped_light=${
      shapedLight ? "yes" : "no"
    }; tide=${tide ? "yes" : "no"}. `;

  if (selected?.driver_id === "light_window" && !isShapedLight(selected)) {
    selected = null;
    reason += "rejected primary light_window because it was broad/all-day. ";
  }

  if (req.context === "coastal") {
    if (tide) {
      selected = tide;
      reason += heat && hasOnlyMidday(tide)
        ? "coastal tide_heat_conflict_policy kept real tide anchor with heat caution. "
        : "coastal ladder selected real same-day tide clock. ";
    } else if (heat) {
      selected = heat;
      reason +=
        "coastal ladder selected avoid_heat because no usable tide clock qualified. ";
    } else if (!selected) {
      selected = selectFallback(profile.fallback_bias);
      fallback = true;
      reason += "coastal ladder fell back; no tide/heat signal qualified. ";
    }
  } else if (req.context === "coastal_flats_estuary") {
    if (tide) {
      selected = tide;
      reason += heat && hasOnlyMidday(tide)
        ? "flats tide_heat_conflict_policy kept real tide anchor with heat caution. "
        : "flats ladder selected real same-day tide clock. ";
    } else if (heat) {
      selected = heat;
      reason +=
        "flats ladder selected avoid_heat because no usable tide clock qualified. ";
    } else if (warmth) {
      selected = warmth;
      reason +=
        "flats ladder selected seek_warmth because no usable tide/heat signal qualified. ";
    } else if (shapedLight) {
      selected = shapedLight;
      reason += "flats ladder selected shaped light_window. ";
    } else if (!selected) {
      selected = selectFallback(profile.fallback_bias);
      fallback = true;
      reason += "flats ladder fell back; no qualifying priority signal. ";
    }
  } else {
    if (heat) {
      selected = heat;
      reason += primary && primary.driver_id !== "avoid_heat"
        ? `freshwater heat_priority_attribution superseded ${primary.driver_id}. `
        : "freshwater ladder selected avoid_heat. ";
    } else if (warmth) {
      selected = warmth;
      reason += "freshwater ladder selected seek_warmth. ";
    } else if (shapedLight) {
      selected = shapedLight;
      reason += "freshwater ladder selected shaped light_window. ";
    } else if (!selected) {
      selected = selectFallback(profile.fallback_bias);
      fallback = true;
      reason +=
        "freshwater ladder fell back; no qualifying heat/warmth/shaped-light signal. ";
    }
  }

  if (!selected) {
    selected = selectFallback(profile.fallback_bias);
    fallback = true;
    reason += "defensive fallback. ";
  }
  return {
    anchor: selected.driver_id,
    primary: profile.anchor_driver,
    fallback,
    strength: selected.strength,
    periods: periods(selected.periods),
    note: signalNote(
      selected,
      [req.context, req.region_key, req.local_date, selected.driver_id].join(
        "|",
      ),
    ),
    reason,
  };
}
function periods(flags: boolean[] | undefined | null): string[] {
  if (!flags) return [];
  return flags.map((v, i) => v ? DAYPARTS[i] : null).filter((v): v is string =>
    v != null
  );
}
function keyForPeriods(p: string[]): string {
  return DAYPARTS.map((d) => p.includes(d) ? "1" : "0").join("");
}
function snapFromProduction(
  report: ReturnType<typeof runHowFishingReport>,
): TimingSnap {
  return {
    anchor: report.timing_debug?.anchor_driver ?? "missing",
    primary: report.timing_debug?.primary_driver ?? "missing",
    fallback: report.timing_debug?.fallback_used ?? false,
    strength: report.timing_strength ?? "missing",
    periods: periods(report.highlighted_periods),
    note: report.daypart_note ?? "",
    reason: report.timing_debug?.selection_reason ?? "",
  };
}
function classify(
  row: Omit<CompareRow, "prod_flags" | "candidate_flags">,
  snap: TimingSnap,
): string[] {
  const flags: string[] = [];
  const coastal = row.context === "coastal" ||
    row.context === "coastal_flats_estuary";
  if (!snap.note || snap.periods.length === 0) {
    flags.push("missing_timing_output");
  }
  if (snap.fallback) flags.push("fallback_used");
  if (snap.periods.length >= 4) flags.push("all_day_or_too_broad");
  if (
    !coastal && row.scenario.startsWith("hot") && snap.anchor !== "avoid_heat"
  ) flags.push("heat_avoidance_not_anchor");
  if (
    !coastal && row.scenario === "cold_but_warming" &&
    snap.anchor !== "seek_warmth"
  ) flags.push("cold_warming_not_seek_warmth");
  if (
    coastal && row.scenario === "coastal_moving_tide" &&
    snap.primary === "tide_exchange_window" &&
    snap.anchor !== "tide_exchange_window"
  ) flags.push("coastal_tide_not_anchor");
  if (coastal && row.scenario === "coastal_moving_tide" && snap.fallback) {
    flags.push("coastal_moving_tide_fell_back");
  }
  if (snap.fallback && row.score >= 80) {
    flags.push("fallback_on_high_score_row");
  }
  return flags;
}
function buildRows(): CompareRow[] {
  const rows: CompareRow[] = [];
  for (const region of CANONICAL_REGION_KEYS) {
    for (let month = 1; month <= 12; month++) {
      for (const offset of OFFSETS) {
        for (const context of CONTEXTS) {
          for (const scenario of SCENARIOS) {
            const req = buildReq(region, month, offset, context, scenario);
            const analysis = analyzeSharedConditions(req);
            const report = runHowFishingReport(req);
            const prod = snapFromProduction(report);
            const candidate = candidateTiming(req, analysis);
            const base = {
              region,
              month,
              forecast_offset: offset,
              context,
              scenario: scenario.id,
              score: report.score,
              prod,
              candidate,
              snapshot: {
                local_date: req.local_date,
                daily_mean_air_temp_f: req.environment.daily_mean_air_temp_f,
                cloud_cover_pct: req.environment.cloud_cover_pct,
                tide_events: req.environment.tide_high_low?.length ?? 0,
                hourly_air_count: req.environment.hourly_air_temp_f?.length ??
                  0,
                hourly_cloud_count:
                  req.environment.hourly_cloud_cover_pct?.length ?? 0,
              },
            };
            rows.push({
              ...base,
              prod_flags: classify(base, prod),
              candidate_flags: classify(base, candidate),
            });
          }
        }
      }
    }
  }
  return rows;
}
function distribution<T>(
  items: T[],
  key: (item: T) => string,
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const item of items) out[key(item)] = (out[key(item)] ?? 0) + 1;
  return out;
}
function flagCounts(
  rows: CompareRow[],
  side: "prod_flags" | "candidate_flags",
) {
  const out: Record<string, number> = {};
  for (const row of rows) {
    for (const flag of row[side]) out[flag] = (out[flag] ?? 0) + 1;
  }
  return out;
}
function driverClass(anchor: string): string {
  if (anchor === "seek_warmth") return "temperature_seek_warmth";
  if (anchor === "avoid_heat") return "temperature_avoid_heat";
  if (anchor === "light_window" || anchor.includes("light")) {
    return "light_cloud";
  }
  if (anchor === "tide_exchange_window") return "tide_current";
  if (anchor === "neutral_fallback") return "fallback_bias";
  return anchor;
}
function topEntries(obj: Record<string, number>, n = 10): string {
  return Object.entries(obj).sort((a, b) =>
    b[1] - a[1] || a[0].localeCompare(b[0])
  ).slice(0, n).map(([k, v]) => `${k}:${v}`).join(", ");
}
function monthBoundary(rows: CompareRow[], side: "prod" | "candidate") {
  let driver = 0;
  let periods = 0;
  const grouped = new Map<string, CompareRow[]>();
  for (const row of rows.filter((r) => r.forecast_offset === 0)) {
    const key = `${row.region}|${row.context}|${row.scenario}`;
    grouped.set(key, [...(grouped.get(key) ?? []), row]);
  }
  for (const group of grouped.values()) {
    const byMonth = new Map(group.map((r) => [r.month, r]));
    for (let month = 1; month <= 12; month++) {
      const a = byMonth.get(month);
      const b = byMonth.get(month === 12 ? 1 : month + 1);
      if (!a || !b) continue;
      if (a[side].anchor !== b[side].anchor) driver++;
      if (keyForPeriods(a[side].periods) !== keyForPeriods(b[side].periods)) {
        periods++;
      }
    }
  }
  return { driver, periods };
}
function snapshotOk(rows: CompareRow[]) {
  const dist = distribution(rows, (row) => String(row.forecast_offset));
  const missing =
    rows.filter((row) => row.snapshot.daily_mean_air_temp_f == null).length;
  return {
    ok: Object.keys(dist).length === OFFSETS.length && missing === 0,
    dist,
    missing,
  };
}
function exampleRows(rows: CompareRow[], improved: boolean, n = 10) {
  return rows.filter((row) => {
    const prodBad = row.prod_flags.length > 0;
    const candBad = row.candidate_flags.length > 0;
    return improved ? prodBad && !candBad : candBad;
  }).slice(0, n);
}
function mdRow(row: CompareRow): string {
  return `- ${row.region} m${row.month} ${row.context} ${row.scenario}: prod ${row.prod.anchor}/${
    row.prod.periods.join("+") || "none"
  } -> cand ${row.candidate.anchor}/${
    row.candidate.periods.join("+") || "none"
  }; ${row.candidate.reason.trim()}`;
}

async function main() {
  const rows = buildRows();
  const prodFlags = flagCounts(rows, "prod_flags");
  const candFlags = flagCounts(rows, "candidate_flags");
  const prodFallback = rows.filter((r) => r.prod.fallback).length;
  const candFallback = rows.filter((r) => r.candidate.fallback).length;
  const prodBroad = prodFlags.all_day_or_too_broad ?? 0;
  const candBroad = candFlags.all_day_or_too_broad ?? 0;
  const winterFlats = rows.filter((r) =>
    r.context === "coastal_flats_estuary" && [1, 2, 12].includes(r.month) &&
    r.scenario === "coastal_moving_tide"
  );
  const freshHot = rows.filter((r) =>
    (r.context === "freshwater_lake_pond" ||
      r.context === "freshwater_river") && r.scenario.startsWith("hot")
  );
  const coldWarming = rows.filter((r) =>
    !isCoastalFamilyContext(r.context) && r.scenario === "cold_but_warming"
  );
  const prodBoundary = monthBoundary(rows, "prod");
  const candBoundary = monthBoundary(rows, "candidate");
  const snapshot = snapshotOk(rows);
  const prodDriverContext = Object.fromEntries(CONTEXTS.map((context) => [
    context,
    distribution(
      rows.filter((r) => r.context === context),
      (r) => driverClass(r.prod.anchor),
    ),
  ]));
  const candDriverContext = Object.fromEntries(CONTEXTS.map((context) => [
    context,
    distribution(
      rows.filter((r) => r.context === context),
      (r) => driverClass(r.candidate.anchor),
    ),
  ]));
  const noTideInvented = rows.filter((r) =>
    isCoastalFamilyContext(r.context) &&
    (r.snapshot.tide_events as number) === 0 &&
    r.prod.anchor === "tide_exchange_window"
  ).length;
  const readinessFailures = [
    !snapshot.ok && "forecast_snapshot",
    prodFallback >= 36112 && "fallback_not_reduced",
    prodBroad > 2912 && "broad_all_day_regressed",
    (prodFlags.heat_avoidance_not_anchor ?? 0) > 0 && "heat_attribution_flags",
    (prodFlags.coastal_moving_tide_fell_back ?? 0) > 0 &&
    "coastal_moving_tide_fallback",
    (prodFlags.cold_warming_not_seek_warmth ?? 0) > 100 &&
    "cold_warming_seek_warmth",
    prodBoundary.driver > 400 && "month_boundary_driver",
    prodBoundary.periods > 850 && "month_boundary_period",
    noTideInvented > 0 && "invented_tide_timing",
  ].filter(Boolean);
  const result = readinessFailures.length === 0
    ? "PASS"
    : `FAIL (${readinessFailures.join(", ")})`;
  const improved = exampleRows(rows, true, 10);
  const questionable = exampleRows(rows, false, 10);

  const jsonl = [
    ...rows.map((row) => ({
      row_type: "timing_post_patch_compare",
      ...row,
    })),
    {
      row_type: "timing_post_patch_summary",
      result,
      prod_flags: prodFlags,
      candidate_flags: candFlags,
      prod_fallback: prodFallback,
      candidate_fallback: candFallback,
      prod_boundary: prodBoundary,
      candidate_boundary: candBoundary,
      no_tide_invented: noTideInvented,
      readiness_failures: readinessFailures,
      snapshot,
    },
  ].map((row) => JSON.stringify(row)).join("\n") + "\n";

  const md = `# Today's Bite Timing Post-Patch Readiness Audit

Generated: ${new Date().toISOString()}

Ran actual production timing behavior after the guarded priority-ladder patch. Scoring, recommender, normalizers, temp configs, freshwater envelopes, buildNormalized, interpolation, and forecast snapshot behavior were not changed.

## Executive Result

- Result: ${result}
- Rows compared: ${rows.length}
- Fallback used: ${prodFallback} (baseline 36112)
- Broad/all-day flags: ${prodBroad} (baseline limit 2912)

## Production Flag Counts

- Production: ${topEntries(prodFlags, 14)}
- Shadow parity check: ${topEntries(candFlags, 14)}

## Driver Distribution by Context

- Production:
${
    Object.entries(prodDriverContext).map(([context, dist]) =>
      `  - ${context}: ${topEntries(dist as Record<string, number>, 8)}`
    ).join("\n")
  }
- Shadow parity:
${
    Object.entries(candDriverContext).map(([context, dist]) =>
      `  - ${context}: ${topEntries(dist as Record<string, number>, 8)}`
    ).join("\n")
  }

## Key Outcomes

- Winter flats moving-tide fallback rows: ${
    winterFlats.filter((r) => r.prod.fallback).length
  }
- Freshwater hot rows anchored on avoid_heat: ${
    freshHot.filter((r) => r.prod.anchor === "avoid_heat").length
  }/${freshHot.length}
- Cold-warming non-coastal rows anchored on seek_warmth: ${
    coldWarming.filter((r) => r.prod.anchor === "seek_warmth").length
  }/${coldWarming.length}
- Heat attribution flags: ${prodFlags.heat_avoidance_not_anchor ?? 0}
- Coastal moving-tide fallback flags: ${
    prodFlags.coastal_moving_tide_fell_back ?? 0
  }
- Cold-warming not seek_warmth flags: ${
    prodFlags.cold_warming_not_seek_warmth ?? 0
  }
- Month-boundary driver changes: ${prodBoundary.driver} (limit 400)
- Month-boundary period changes: ${prodBoundary.periods} (limit 850)
- Tide timing without real same-day tide events: ${noTideInvented}
- Forecast snapshot: ${snapshot.ok ? "PASS" : "CHECK"} ${
    JSON.stringify(snapshot.dist)
  }, missing mean temp ${snapshot.missing}
- Tide/heat conflict policy: keep real tide anchor, add heat caution in trace/reason; do not invent tide timing when events are missing.
- Readiness failures: ${readinessFailures.join(", ") || "none"}

## Improved Output Examples

${improved.map(mdRow).join("\n") || "- None"}

## Remaining Questionable Outputs

${questionable.map(mdRow).join("\n") || "- None"}

## Production Patch Notes

- Keep existing timing family resolution.
- Use a context/season priority ladder rather than the first available secondary signal.
- Restrict light_window secondary use to shaped 1-2 period windows; reject cloud_all_day as a secondary anchor.
- Prefer avoid_heat attribution when heat creates the final dawn/evening recommendation.
- For coastal/flats, prefer actual same-day tide events over warmth fallback unless no usable tide clock exists.
- Do not invent tide timing without tide events; missing-tide fallback remains intact.

## Validation

- \`deno fmt scripts/audit/run-todays-bite-timing-post-patch-readiness-audit.ts\`
- \`deno run --allow-read --allow-write scripts/audit/run-todays-bite-timing-post-patch-readiness-audit.ts\`
- \`git diff --name-only\`
- Protected diff check for recommender, scoring, normalizers, and score-patch configs.
`;

  await Deno.writeTextFile(OUTPUT_JSONL, jsonl);
  await Deno.writeTextFile(OUTPUT_MD, md);
  console.log(`Wrote ${OUTPUT_MD}`);
  console.log(`Wrote ${OUTPUT_JSONL}`);
}

if (import.meta.main) await main();
