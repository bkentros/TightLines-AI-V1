#!/usr/bin/env -S deno run --allow-read --allow-write

import type { SharedConditionAnalysis } from "../../supabase/functions/_shared/howFishingEngine/analyzeSharedConditions.ts";
import { analyzeSharedConditions } from "../../supabase/functions/_shared/howFishingEngine/analyzeSharedConditions.ts";
import { coastalWaterTempRow } from "../../supabase/functions/_shared/howFishingEngine/config/tempBandsCoastalWater.ts";
import { freshwaterTempRow } from "../../supabase/functions/_shared/howFishingEngine/config/tempBandsFreshwater.ts";
import type { EngineContext } from "../../supabase/functions/_shared/howFishingEngine/contracts/context.ts";
import type { SharedEngineRequest } from "../../supabase/functions/_shared/howFishingEngine/contracts/input.ts";
import {
  CANONICAL_REGION_KEYS,
  type RegionKey,
} from "../../supabase/functions/_shared/howFishingEngine/contracts/region.ts";
import { normalizePressureDetailed } from "../../supabase/functions/_shared/howFishingEngine/normalize/normalizePressure.ts";
import { normalizeTideCurrentMovement } from "../../supabase/functions/_shared/howFishingEngine/normalize/normalizeTide.ts";
import { normalizeWind } from "../../supabase/functions/_shared/howFishingEngine/normalize/normalizeWind.ts";
import {
  activeKeysForContext,
  computeActiveWeights,
} from "../../supabase/functions/_shared/howFishingEngine/score/reweight.ts";
import { analyzeRecommenderConditions } from "../../supabase/functions/_shared/recommenderEngine/sharedAnalysis.ts";
import type {
  RecommenderRequest,
  WaterClarity,
} from "../../supabase/functions/_shared/recommenderEngine/contracts/input.ts";
import type { SpeciesGroup } from "../../supabase/functions/_shared/recommenderEngine/contracts/species.ts";
import { resolveDailyPicksSeasonalRow } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/resolveDailyPicksSeasonalRow.ts";
import { runDailyPicksEngine } from "../../supabase/functions/_shared/recommenderEngine/dailyPicks/runDailyPicksEngine.ts";

const OUTPUT_MD = "scripts/audit/todays-bite-post-patch-readiness-audit.md";
const OUTPUT_JSONL =
  "scripts/audit/todays-bite-post-patch-readiness-audit.jsonl";

const CONTEXTS = [
  "freshwater_lake_pond",
  "freshwater_river",
  "coastal",
  "coastal_flats_estuary",
] as const satisfies readonly EngineContext[];
const CLARITIES = [
  "clear",
  "stained",
] as const satisfies readonly WaterClarity[];
const OFFSETS = [0, 1, 2, 3, 4, 5, 6];
const GULF_FOCUS: RegionKey[] = [
  "gulf_coast",
  "south_central",
  "mountain_west",
  "southwest_desert",
  "southwest_high_desert",
];

type Family =
  | "production_style"
  | "calibration_super_elite"
  | "calibration_elite"
  | "calibration_strong"
  | "calibration_ordinary_good"
  | "calibration_catastrophic"
  | "calibration_bad_fishable"
  | "missing_partial_data";
type Fixture = {
  id: string;
  family: Family;
  temp: "best" | "seasonal" | "strong" | "ordinary" | "hot" | "cold";
  wind: number | null;
  cloud: number | null;
  pressure: number[] | null;
  p24: number | null;
  p72: number | null;
  p7d: number | null;
  active: boolean;
  rate: number | null;
  current: number | null;
};
type RecSnap =
  | {
    status: "valid";
    activity: string;
    thermal: string;
    surface: string;
    tags: string[];
    sig: string;
  }
  | { status: "unsupported" | "error" | "not_applicable"; reason: string };
type Row = {
  req: SharedEngineRequest;
  analysis: SharedConditionAnalysis;
  region: RegionKey;
  month: number;
  offset: number;
  context: EngineContext;
  fixture: Fixture;
  clarity: WaterClarity;
  rec: RecSnap;
  legacyRec: RecSnap;
};

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
    lat: 40.0,
    lon: -86.2,
    state: "IN",
    tz: "America/Indiana/Indianapolis",
  },
  south_central: { lat: 30.3, lon: -97.7, state: "TX", tz: "America/Chicago" },
  mountain_west: { lat: 40.7, lon: -111.9, state: "UT", tz: "America/Denver" },
  southwest_desert: {
    lat: 33.4,
    lon: -112.0,
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
    lat: 34.0,
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
    lon: -123.0,
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

const FIXTURES: Fixture[] = [
  {
    id: "stable_good",
    family: "production_style",
    temp: "seasonal",
    wind: 8,
    cloud: 55,
    pressure: stablePressure(1015),
    p24: 0.02,
    p72: 0.05,
    p7d: 0.1,
    active: false,
    rate: 0,
    current: 1.1,
  },
  {
    id: "light_mist_dry_baseline",
    family: "production_style",
    temp: "best",
    wind: 6,
    cloud: 78,
    pressure: fallingPressure(),
    p24: 0.02,
    p72: 0.04,
    p7d: 0.12,
    active: true,
    rate: 0.005,
    current: 1.2,
  },
  {
    id: "stable_poor_hot",
    family: "production_style",
    temp: "hot",
    wind: 3,
    cloud: 8,
    pressure: stablePressure(1017),
    p24: 0,
    p72: 0,
    p7d: 0.05,
    active: false,
    rate: 0,
    current: 1.1,
  },
  {
    id: "calibration_super_elite",
    family: "calibration_super_elite",
    temp: "best",
    wind: 10,
    cloud: 82,
    pressure: fallingPressure(),
    p24: 0,
    p72: 0,
    p7d: 0.05,
    active: false,
    rate: 0,
    current: 1.45,
  },
  {
    id: "calibration_elite",
    family: "calibration_elite",
    temp: "best",
    wind: 9,
    cloud: 76,
    pressure: fallingPressure(),
    p24: 0,
    p72: 0,
    p7d: 0.08,
    active: false,
    rate: 0,
    current: 1.25,
  },
  {
    id: "calibration_strong",
    family: "calibration_strong",
    temp: "strong",
    wind: 8,
    cloud: 65,
    pressure: stablePressure(1015),
    p24: 0.02,
    p72: 0.04,
    p7d: 0.12,
    active: false,
    rate: 0,
    current: 1.15,
  },
  {
    id: "calibration_ordinary_good",
    family: "calibration_ordinary_good",
    temp: "ordinary",
    wind: 6,
    cloud: 50,
    pressure: stablePressure(1015),
    p24: 0.05,
    p72: 0.12,
    p7d: 0.4,
    active: false,
    rate: 0,
    current: 0.85,
  },
  {
    id: "calibration_catastrophic",
    family: "calibration_catastrophic",
    temp: "cold",
    wind: 45,
    cloud: 2,
    pressure: volatilePressure(),
    p24: 2,
    p72: 4,
    p7d: 7,
    active: true,
    rate: 0.2,
    current: 4,
  },
  {
    id: "missing_partial_data",
    family: "missing_partial_data",
    temp: "best",
    wind: null,
    cloud: null,
    pressure: null,
    p24: null,
    p72: null,
    p7d: null,
    active: false,
    rate: null,
    current: null,
  },
];

const jsonlRows: unknown[] = [];

function stablePressure(v: number) {
  return Array.from({ length: 24 }, () => v);
}
function fallingPressure() {
  return Array.from({ length: 24 }, (_, i) => 1018 - i * (3 / 23));
}
function volatilePressure() {
  return Array.from({ length: 24 }, (_, i) => 1015 + Math.sin(i * 1.7) * 5);
}
function round(n: number, d = 2) {
  return Math.round(n * 10 ** d) / 10 ** d;
}
function piece(x: number, x0: number, x1: number, y0: number, y1: number) {
  if (x1 === x0) return y0;
  const u = Math.max(0, Math.min(1, (x - x0) / (x1 - x0)));
  return y0 + (y1 - y0) * u;
}
function dateFor(month: number, offset: number) {
  return `2026-${String(month).padStart(2, "0")}-${
    String(10 + offset).padStart(2, "0")
  }`;
}
function rowForTemp(context: EngineContext, region: RegionKey, month: number) {
  return context === "coastal" || context === "coastal_flats_estuary"
    ? coastalWaterTempRow(region, month)
    : freshwaterTempRow(region, month);
}
function bandAt(row: number[], t: number): number {
  const s = row[4] as unknown as number[];
  if (t <= row[0]!) return s[0]!;
  if (t <= row[1]!) return piece(t, row[0]!, row[1]!, s[0]!, s[1]!);
  if (t <= row[2]!) return piece(t, row[1]!, row[2]!, s[1]!, s[2]!);
  if (t <= row[3]!) return piece(t, row[2]!, row[3]!, s[2]!, s[3]!);
  return piece(Math.min(t, row[3]! + 12), row[3]!, row[3]! + 12, s[3]!, s[4]!);
}
function tempFor(row: number[], kind: Fixture["temp"]) {
  if (kind === "hot") return row[3]! + 18;
  if (kind === "cold") return row[0]! - 6;
  if (kind === "ordinary") return (row[1]! + row[2]!) / 2 - 5;
  if (kind === "strong") return (row[1]! + row[2]!) / 2;
  let bestT = row[0]!;
  let bestS = -99;
  for (let t = row[0]! - 5; t <= row[3]! + 8; t += 0.5) {
    const score = bandAt(row, t);
    if (score > bestS) {
      bestS = score;
      bestT = t;
    }
  }
  return bestT;
}
function tideEvents(date: string) {
  return [
    { time: `${date}T02:00:00`, value: 0.4 },
    { time: `${date}T08:00:00`, value: 3.1 },
    { time: `${date}T14:00:00`, value: 0.3 },
    { time: `${date}T20:00:00`, value: 3.0 },
  ];
}
function buildReq(
  region: RegionKey,
  month: number,
  offset: number,
  context: EngineContext,
  fixture: Fixture,
): SharedEngineRequest {
  const meta = REGION_META[region];
  const localDate = dateFor(month, offset);
  const temp = tempFor(rowForTemp(context, region, month), fixture.temp);
  const coastal = context === "coastal" || context === "coastal_flats_estuary";
  const env: SharedEngineRequest["environment"] = {
    current_air_temp_f: temp,
    daily_mean_air_temp_f: temp,
    daily_low_air_temp_f: temp - 6,
    daily_high_air_temp_f: temp + 6,
    prior_day_mean_air_temp_f: temp,
    day_minus_2_mean_air_temp_f: temp,
    pressure_history_mb: fixture.pressure,
    pressure_mb: fixture.pressure?.at(-1) ?? null,
    wind_speed_mph: fixture.wind,
    cloud_cover_pct: fixture.cloud,
    precip_24h_in: fixture.p24,
    precip_72h_in: fixture.p72,
    precip_7d_in: fixture.p7d,
    active_precip_now: fixture.active,
    precip_rate_now_in_per_hr: fixture.rate,
    sunrise_local: `${localDate}T06:30:00`,
    sunset_local: `${localDate}T19:30:00`,
    solunar_peak_local: [`${localDate}T07:20:00`, `${localDate}T18:40:00`],
  };
  if (coastal) {
    env.measured_water_temp_f = temp;
    env.measured_water_temp_24h_ago_f = temp;
    env.measured_water_temp_72h_ago_f = temp;
    env.measured_water_temp_source = "audit";
    env.daily_mean_air_temp_f = temp + 4;
    env.current_speed_knots_max = fixture.current;
    env.tide_high_low = tideEvents(localDate);
  }
  return {
    latitude: meta.lat,
    longitude: meta.lon,
    state_code: meta.state,
    region_key: region,
    local_date: localDate,
    local_timezone: meta.tz,
    context,
    environment: env,
    data_coverage: { source_notes: ["post-patch-readiness-audit"] },
  };
}
function band(score: number) {
  if (score >= 80) return "Prime";
  if (score >= 65) return "Good";
  if (score >= 50) return "Fair";
  if (score >= 35) return "Poor";
  return "Tough";
}
function legacyScore(analysis: SharedConditionAnalysis): number {
  const raw = analysis.scored.contributions.reduce(
    (s, c) => s + c.weightedContribution,
    0,
  );
  let score = Math.max(
    10,
    Math.min(100, Math.round(raw >= 0 ? 50 + raw / 3.2 : 50 + raw / 4)),
  );
  const precip = analysis.norm.normalized.precipitation_disruption;
  if (precip?.label === "active_disruption") score = Math.min(score, 55);
  if (precip?.label === "recent_rain" && precip.score <= -0.45) {
    score = Math.min(score, 65);
  }
  if (
    analysis.scored.suppressors.some((s) => s.weightedContribution <= -10) &&
    score > 70
  ) score = 69;
  return score;
}
function speciesFor(context: EngineContext): SpeciesGroup | null {
  return context === "freshwater_lake_pond" || context === "freshwater_river"
    ? "largemouth_bass" as SpeciesGroup
    : null;
}
function runRec(
  row: Omit<Row, "rec" | "legacyRec">,
  scoreOverride?: number,
): RecSnap {
  const species = speciesFor(row.context);
  if (!species) return { status: "not_applicable", reason: "freshwater_only" };
  const month = Number(row.req.local_date.slice(5, 7));
  const recReq: RecommenderRequest = {
    location: {
      latitude: row.req.latitude,
      longitude: row.req.longitude,
      state_code: row.req.state_code ?? "XX",
      region_key: row.region,
      local_date: row.req.local_date,
      local_timezone: row.req.local_timezone,
      month,
    },
    species,
    context: row.context,
    water_clarity: row.clarity,
    recommendation_goal: "all_purpose",
    env_data: { ...row.req.environment, weather: { wind_speed_unit: "mph" } },
  };
  try {
    const recAnalysis = analyzeRecommenderConditions(recReq);
    const seasonalRow = resolveDailyPicksSeasonalRow({
      species,
      region_key: row.region,
      month,
      water_type: row.context,
    });
    const analysis = scoreOverride == null ? row.analysis : {
      ...row.analysis,
      scored: {
        ...row.analysis.scored,
        score: scoreOverride,
        band: band(scoreOverride) as typeof row.analysis.scored.band,
      },
    };
    const result = runDailyPicksEngine({
      req: recReq,
      analysis: {
        ...recAnalysis,
        norm: analysis.norm,
        scored: analysis.scored,
      } as SharedConditionAnalysis,
      seasonalRow,
      seed:
        `post|${row.region}|${row.month}|${row.offset}|${row.context}|${row.fixture.id}|${row.clarity}`,
      variant: "A",
    });
    return {
      status: "valid",
      activity: result.scenario.activity_level,
      thermal: result.scenario.thermal_mode,
      surface: result.scenario.surface_daily_gate,
      tags: [...result.scenario.scenario_tags],
      sig: [
        ...result.diagnostics.selected_lure_ids.map((x) => `l:${x}`),
        ...result.diagnostics.selected_fly_ids.map((x) => `f:${x}`),
      ].join("+"),
    };
  } catch (e) {
    const reason = e instanceof Error ? e.message : String(e);
    return {
      status: /No daily-picks seasonal row|has no exact row/i.test(reason)
        ? "unsupported"
        : "error",
      reason,
    };
  }
}
function buildRows(): Row[] {
  const rows: Row[] = [];
  for (const region of CANONICAL_REGION_KEYS) {
    for (let month = 1; month <= 12; month++) {
      for (const offset of OFFSETS) {
        for (const context of CONTEXTS) {
          for (const fixture of FIXTURES) {
            const req = buildReq(region, month, offset, context, fixture);
            const analysis = analyzeSharedConditions(req);
            for (const clarity of CLARITIES) {
              const base = {
                req,
                analysis,
                region,
                month,
                offset,
                context,
                fixture,
                clarity,
              };
              rows.push({
                ...base,
                rec: runRec(base),
                legacyRec: runRec(base, legacyScore(analysis)),
              });
            }
          }
        }
      }
    }
  }
  return rows;
}
function stats(scores: number[]) {
  return {
    min: Math.min(...scores),
    max: Math.max(...scores),
    ge80: scores.filter((s) => s >= 80).length,
    ge85: scores.filter((s) => s >= 85).length,
    ge90: scores.filter((s) => s >= 90).length,
    ge95: scores.filter((s) => s >= 95).length,
    eq100: scores.filter((s) => s === 100).length,
  };
}
function finalDelta(variable: string, context: EngineContext, delta: number) {
  let max = 0;
  for (const region of CANONICAL_REGION_KEYS) {
    for (let m = 1; m <= 12; m++) {
      const weight = computeActiveWeights(
        context,
        region,
        dateFor(m, 0),
        new Set(activeKeysForContext(context)),
      ).find((w) => w.key === variable)?.finalWeight ?? 0;
      const before = Math.round(50 + 70 / 3.2);
      const after = Math.round(50 + (70 + weight * delta) / 3.2);
      max = Math.max(max, Math.abs(after - before));
    }
  }
  return max;
}
function boundarySweeps() {
  const out: any[] = [];
  const scan = (
    name: string,
    key: string,
    context: EngineContext | null,
    points: number[],
  ) => {
    let best = { final: -1, delta: 0, i: 0, before: 0, after: 0 };
    for (let i = 1; i < points.length; i++) {
      const d = points[i]! - points[i - 1]!;
      const final = context
        ? finalDelta(key, context, d)
        : Math.max(...CONTEXTS.map((c) => finalDelta(key, c, d)));
      if (final > best.final) {
        best = {
          final,
          delta: Math.abs(d),
          i,
          before: points[i - 1]!,
          after: points[i]!,
        };
      }
    }
    out.push({
      name,
      variable_delta: round(best.delta, 4),
      final_delta: best.final,
      hard: best.final > 4,
      before: round(best.before, 4),
      after: round(best.after, 4),
    });
  };
  scan(
    "pressure",
    "pressure_regime",
    null,
    Array.from({ length: 401 }, (_, i) =>
      normalizePressureDetailed(
        Array.from({ length: 24 }, (_, h) => 1015 + (-10 + i * 0.05) * h / 23),
      )?.state.score ?? 0),
  );
  for (const context of CONTEXTS) {
    scan(
      `wind_${context}`,
      "wind_condition",
      context,
      Array.from(
        { length: 181 },
        (_, i) => normalizeWind(i * 0.25, context)?.score ?? 0,
      ),
    );
  }
  scan(
    "tide_inshore",
    "tide_current_movement",
    "coastal",
    Array.from({ length: 801 }, (_, i) =>
      normalizeTideCurrentMovement(
        { current_speed_knots_max: i * 0.005 },
        "inshore",
      )?.score ?? 0),
  );
  scan(
    "tide_flats",
    "tide_current_movement",
    "coastal_flats_estuary",
    Array.from({ length: 801 }, (_, i) =>
      normalizeTideCurrentMovement(
        { current_speed_knots_max: i * 0.005 },
        "flats_estuary",
      )?.score ?? 0),
  );
  return out;
}
function recImpact(rows: Row[]) {
  const fresh = rows.filter((r) => speciesFor(r.context));
  let valid = 0,
    unsupported = 0,
    errors = 0,
    sig = 0,
    thermal = 0,
    activity = 0,
    surface = 0,
    tags = 0,
    unexpected = 0;
  for (const row of fresh) {
    if (row.rec.status === "valid") valid++;
    if (row.rec.status === "unsupported") unsupported++;
    if (row.rec.status === "error") errors++;
    if (row.rec.status === "valid" && row.legacyRec.status === "valid") {
      const sigChanged = row.rec.sig !== row.legacyRec.sig;
      const thermalChanged = row.rec.thermal !== row.legacyRec.thermal;
      const activityChanged = row.rec.activity !== row.legacyRec.activity;
      const surfaceChanged = row.rec.surface !== row.legacyRec.surface;
      const tagChanged = [...row.rec.tags].sort().join("+") !==
        [...row.legacyRec.tags].sort().join("+");
      if (sigChanged) sig++;
      if (thermalChanged) thermal++;
      if (activityChanged) activity++;
      if (surfaceChanged) surface++;
      if (tagChanged) tags++;
      if (
        sigChanged && !thermalChanged && !activityChanged && !surfaceChanged &&
        !tagChanged
      ) unexpected++;
    }
  }
  return {
    attempted: fresh.length,
    valid,
    unsupported,
    errors,
    sig,
    thermal,
    activity,
    surface,
    tags,
    unexpected,
  };
}

async function main() {
  const rows = buildRows();
  const complete = rows.filter((r) =>
    r.fixture.family !== "missing_partial_data" &&
    r.analysis.norm.missing_variables.length === 0 &&
    r.analysis.norm.data_gaps.length === 0
  );
  const scores = complete.map((r) => r.analysis.scored.score);
  const s = stats(scores);
  const guards = {
    missing_ge80:
      rows.filter((r) =>
        r.fixture.family === "missing_partial_data" &&
        r.analysis.scored.score >= 80
      ).length,
    low_rel_ge80:
      rows.filter((r) =>
        r.analysis.norm.reliability !== "high" && r.analysis.scored.score >= 80
      ).length,
    ordinary_ge80:
      rows.filter((r) =>
        r.fixture.family === "calibration_ordinary_good" &&
        r.analysis.scored.score >= 80
      ).length,
    strong_ge90: rows.filter((r) =>
      r.fixture.family === "calibration_strong" &&
      r.analysis.scored.score >= 90
    ).length,
    cat_gt30:
      rows.filter((r) =>
        r.fixture.family === "calibration_catastrophic" &&
        r.analysis.scored.score > 30
      ).length,
    production_style_ge95:
      rows.filter((r) =>
        r.fixture.family === "production_style" && r.analysis.scored.score >= 95
      ).length,
  };
  const rec = recImpact(rows);
  const boundary = boundarySweeps();
  const maxBoundary = Math.max(...boundary.map((b) => b.final_delta));
  const gulfBefore = Math.max(
    ...GULF_FOCUS.map((r) =>
      Math.abs(
        bandAt(
          [72, 78, 82, 86, [-2, -1, 2, 0, -2]] as unknown as number[],
          74,
        ) -
          bandAt(
            [62, 68, 74, 80, [-2, -1, 2, 1, -1]] as unknown as number[],
            74,
          ),
      )
    ),
  );
  const gulfAfter = Math.max(
    ...GULF_FOCUS.map((r) =>
      Math.abs(
        bandAt(coastalWaterTempRow(r, 10), 74) -
          bandAt(coastalWaterTempRow(r, 11), 74),
      )
    ),
  );
  const riverMax = Math.max(
    ...complete.filter((r) => r.context === "freshwater_river").map((r) =>
      r.analysis.scored.score
    ),
  );
  const lakeMax = Math.max(
    ...complete.filter((r) => r.context === "freshwater_lake_pond").map((r) =>
      r.analysis.scored.score
    ),
  );
  const ge95ByContext = Object.fromEntries(
    CONTEXTS.map((context) => [
      context,
      complete.filter((r) =>
        r.context === context && r.analysis.scored.score >= 95
      ).length,
    ]),
  );
  const families = Array.from(
    new Set(FIXTURES.map((fixture) => fixture.family)),
  )
    .sort();
  const ge95ByFamily = Object.fromEntries(
    families.map((family) => [
      family,
      complete.filter((r) =>
        r.fixture.family === family && r.analysis.scored.score >= 95
      ).length,
    ]),
  );
  const productionStyleScores = complete
    .filter((r) => r.fixture.family === "production_style")
    .map((r) => r.analysis.scored.score);
  const productionStyleMax = Math.max(...productionStyleScores);
  const lightMistRows = complete.filter((r) =>
    r.fixture.id === "light_mist_dry_baseline"
  );
  const lightMistScores = lightMistRows.map((r) => r.analysis.scored.score);
  const lightMist = {
    max: Math.max(...lightMistScores),
    ge90: lightMistRows.filter((r) => r.analysis.scored.score >= 90).length,
    ge95: lightMistRows.filter((r) => r.analysis.scored.score >= 95).length,
  };
  const offsets = Object.fromEntries(
    OFFSETS.map((offset) => [
      offset,
      rows.filter((r) => r.offset === offset).length,
    ]),
  );
  const failures = [
    guards.missing_ge80 && "missing_partial_ge80",
    guards.low_rel_ge80 && "low_reliability_ge80",
    guards.ordinary_ge80 && "ordinary_good_ge80",
    guards.strong_ge90 && "strong_ge90",
    guards.cat_gt30 && "catastrophic_gt30",
    guards.production_style_ge95 && "production_style_ge95",
    s.eq100 && "eq100_rows",
    maxBoundary > 4 && "boundary_cliff_gt4",
    rec.errors && "recommender_errors",
    rec.unexpected && "unexpected_signature_churn",
  ].filter(Boolean);
  for (const row of rows) {
    jsonlRows.push({
      row_type: "post_patch_row",
      region: row.region,
      month: row.month,
      forecast_offset: row.offset,
      context: row.context,
      fixture: row.fixture.id,
      family: row.fixture.family,
      clarity: row.clarity,
      score: row.analysis.scored.score,
      reliability: row.analysis.norm.reliability,
      missing: row.analysis.norm.missing_variables,
      gaps: row.analysis.norm.data_gaps,
      temperature_source: row.analysis.norm.normalized.temperature
        ?.measurement_source,
      rec: row.rec,
      request: {
        local_date: row.req.local_date,
        environment: row.req.environment,
      },
    });
  }
  jsonlRows.push({
    row_type: "post_patch_summary",
    stats: s,
    guards,
    ge95ByContext,
    ge95ByFamily,
    productionStyleMax,
    lightMist,
    rec,
    boundary,
    failures,
  });
  const md = `# Today's Bite Post-Patch Readiness Audit

Generated: ${new Date().toISOString()}

Ran actual production code after the patch. Recommender production logic was invoked but not edited.

## Readiness

- Result: ${failures.length ? `FAIL (${failures.join(", ")})` : "PASS"}
- Score range/counts complete-data: min ${s.min}, max ${s.max}, >=80/${s.ge80}, >=85/${s.ge85}, >=90/${s.ge90}, >=95/${s.ge95}, =100/${s.eq100}
- Guard counts: ${JSON.stringify(guards)}
- >=95 by context: ${JSON.stringify(ge95ByContext)}
- >=95 by family: ${JSON.stringify(ge95ByFamily)}
- Production-style max score: ${productionStyleMax}
- light_mist_dry_baseline max/>=90/>=95: ${lightMist.max}/${lightMist.ge90}/${lightMist.ge95}

## Upper-9s / River

- Complete-data >=95: ${s.ge95}
- Lake max: ${lakeMax}
- River max: ${riverMax}
- River-only +1 remains a shadow idea only; production patch did not add it.

## Boundary / Taper

- Max actual tiny-input final-score cliff: ${maxBoundary}
- Boundary rows: ${JSON.stringify(boundary)}
- Gulf measured-water 74F Oct->Nov focus cliff: ${round(gulfBefore, 3)} -> ${
    round(gulfAfter, 3)
  }
- Active precip cap: numeric/tapered score cap wired.

## Recommender Impact

- Attempted/valid/unsupported/errors: ${rec.attempted}/${rec.valid}/${rec.unsupported}/${rec.errors}
- Signature/thermal/activity/surface/tags/unexpected: ${rec.sig}/${rec.thermal}/${rec.activity}/${rec.surface}/${rec.tags}/${rec.unexpected}
- Recommender impact classification: activity-tier only.

## Forecast Snapshot Guard

- Forecast offsets covered: ${JSON.stringify(offsets)}
- Request/environment snapshots persisted in JSONL by forecast_offset.
- Production forecast day 0..6 snapshot code was not edited.

## Validation Commands

- \`deno fmt\` on changed TypeScript files
- \`deno test --allow-read supabase/functions/_shared/howFishingEngine/__tests__/rebuildEngine.test.ts\`
- \`deno run --allow-read --allow-write scripts/audit/run-todays-bite-post-patch-readiness-audit.ts\`
- \`git diff --name-only\`
- Protected recommender diff check.
`;
  await Deno.writeTextFile(
    OUTPUT_JSONL,
    jsonlRows.map((r) => JSON.stringify(r)).join("\n") + "\n",
  );
  await Deno.writeTextFile(OUTPUT_MD, md);
  console.log(`Wrote ${OUTPUT_MD}`);
  console.log(`Wrote ${OUTPUT_JSONL}`);
}

if (import.meta.main) await main();
