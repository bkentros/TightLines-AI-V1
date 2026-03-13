// =============================================================================
// CORE INTELLIGENCE ENGINE — DERIVED VARIABLES
// Implements Sections 4A–4J of core_intelligence_spec.md
// Converts raw EnvironmentSnapshot into normalized derived states.
// =============================================================================

import type {
  EnvironmentSnapshot,
  WaterType,
  PressureState,
  LightCondition,
  SolunarState,
  TidePhaseState,
  TideStrengthState,
  TempTrendState,
  WaterTempZone,
  WaterTempSource,
  MoonPhaseLabel,
  PrecipCondition,
  AlertStatus,
  WindTideRelation,
  DerivedVariables,
  FreshwaterColdContext,
  FreshwaterSubtype,
  SeasonalFishBehaviorState,
  LatitudeBand,
  SaltwaterSeasonalState,
} from "./types.ts";

// ---------------------------------------------------------------------------
// Helper: parse "HH:MM" string to minutes since midnight
// ---------------------------------------------------------------------------

function hmToMinutes(hhmm: string | null): number | null {
  if (!hhmm) return null;
  const parts = hhmm.split(":");
  if (parts.length < 2) return null;
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  if (isNaN(h) || isNaN(m)) return null;
  return h * 60 + m;
}

// ---------------------------------------------------------------------------
// Section 4A — Pressure Trend
// ---------------------------------------------------------------------------

function derivePressureTrend(env: EnvironmentSnapshot): {
  pressure_change_rate_mb_hr: number | null;
  pressure_state: PressureState | null;
} {
  if (!env.pressure_mb || env.hourly_pressure_mb.length < 4) {
    return { pressure_change_rate_mb_hr: null, pressure_state: null };
  }

  const now = new Date(env.timestamp_utc).getTime();
  const target = now - 3 * 3600 * 1000;
  let closestPoint: { value: number; timeMs: number; diff: number } | null = null;

  for (const point of env.hourly_pressure_mb) {
    const t = new Date(point.time_utc).getTime();
    const diff = Math.abs(t - target);
    if (!closestPoint || diff < closestPoint.diff) {
      closestPoint = { value: point.value, timeMs: t, diff };
    }
  }

  if (!closestPoint || closestPoint.diff > 2 * 3600 * 1000) {
    return { pressure_change_rate_mb_hr: null, pressure_state: null };
  }

  // Use ACTUAL elapsed hours, not fixed 3
  const actualHours = (now - closestPoint.timeMs) / (3600 * 1000);
  if (actualHours < 0.5) {
    return { pressure_change_rate_mb_hr: null, pressure_state: null };
  }

  const rate = (env.pressure_mb - closestPoint.value) / actualHours;

  let state: PressureState;
  if (rate < -1.5) state = "rapidly_falling";
  else if (rate < -0.5) state = "slowly_falling";
  else if (rate <= 0.5) state = "stable";
  else if (rate <= 1.5) state = "slowly_rising";
  else state = "rapidly_rising";

  return { pressure_change_rate_mb_hr: rate, pressure_state: state };
}

// ---------------------------------------------------------------------------
// Section 4B — Light Condition
// ---------------------------------------------------------------------------

function deriveLightCondition(
  env: EnvironmentSnapshot,
  currentLocalMinutes: number
): LightCondition | null {
  const twilightBegin = hmToMinutes(env.civil_twilight_begin_local);
  const sunrise = hmToMinutes(env.sunrise_local);
  const sunset = hmToMinutes(env.sunset_local);
  const twilightEnd = hmToMinutes(env.civil_twilight_end_local);

  if (
    twilightBegin === null ||
    sunrise === null ||
    sunset === null ||
    twilightEnd === null
  ) {
    return null;
  }

  const cloud = env.cloud_cover_pct ?? 0;
  const clm = currentLocalMinutes;

  if (clm >= twilightEnd || clm < twilightBegin) {
    return "night";
  }

  if (clm >= twilightBegin && clm <= sunrise + 90) {
    return cloud >= 70 ? "dawn_window_overcast" : "dawn_window_clear";
  }

  if (clm >= sunset - 90 && clm <= twilightEnd) {
    return cloud >= 70 ? "dusk_window_overcast" : "dusk_window_clear";
  }

  if (cloud >= 70) return "midday_overcast";
  if (cloud >= 35) return "midday_partly_cloudy";
  return "midday_full_sun";
}

// ---------------------------------------------------------------------------
// Section 4C — Solunar State
// ---------------------------------------------------------------------------

function deriveSolunarState(
  env: EnvironmentSnapshot,
  currentLocalMinutes: number
): SolunarState | null {
  if (
    env.solunar_major_periods.length === 0 &&
    env.solunar_minor_periods.length === 0
  ) {
    return null;
  }

  const isInside = (start: string, end: string): boolean => {
    const s = hmToMinutes(start);
    const e = hmToMinutes(end);
    if (s === null || e === null) return false;
    return currentLocalMinutes >= s && currentLocalMinutes <= e;
  };

  const minutesFromWindow = (start: string, end: string): number | null => {
    const s = hmToMinutes(start);
    const e = hmToMinutes(end);
    if (s === null || e === null) return null;
    if (currentLocalMinutes >= s && currentLocalMinutes <= e) return 0;
    const distToStart = Math.abs(currentLocalMinutes - s);
    const distToEnd = Math.abs(currentLocalMinutes - e);
    return Math.min(distToStart, distToEnd);
  };

  // Check major periods
  for (const p of env.solunar_major_periods) {
    if (isInside(p.start_local, p.end_local)) return "within_major_window";
  }
  let closestMajor = Infinity;
  for (const p of env.solunar_major_periods) {
    const dist = minutesFromWindow(p.start_local, p.end_local);
    if (dist !== null && dist < closestMajor) closestMajor = dist;
  }
  if (closestMajor <= 30) return "within_30min_of_major";
  if (closestMajor <= 60) return "within_60min_of_major";
  if (closestMajor <= 90) return "within_90min_of_major";

  // Check minor periods
  for (const p of env.solunar_minor_periods) {
    if (isInside(p.start_local, p.end_local)) return "within_minor_window";
  }
  let closestMinor = Infinity;
  for (const p of env.solunar_minor_periods) {
    const dist = minutesFromWindow(p.start_local, p.end_local);
    if (dist !== null && dist < closestMinor) closestMinor = dist;
  }
  if (closestMinor <= 30) return "within_30min_of_minor";
  if (closestMinor <= 60) return "within_60min_of_minor";

  return "outside_all_windows";
}

// ---------------------------------------------------------------------------
// Section 4D — Tide Phase
// ---------------------------------------------------------------------------

function deriveTidePhase(
  env: EnvironmentSnapshot,
  currentUtcMs: number
): TidePhaseState | null {
  if (env.tide_predictions_today.length < 2) return null;

  // Parse tide predictions — times are stored as local "YYYY-MM-DD HH:mm"
  // We convert using the tz_offset to get UTC ms for comparison.
  const preds = env.tide_predictions_today
    .map((p) => {
      const utcMs = localTimeStringToUtcMs(p.time_local, env.tz_offset_hours);
      return { utcMs, type: p.type, height_ft: p.height_ft };
    })
    .sort((a, b) => a.utcMs - b.utcMs);

  let lastExtremum: (typeof preds)[0] | null = null;
  let nextExtremum: (typeof preds)[0] | null = null;

  for (const p of preds) {
    if (p.utcMs <= currentUtcMs) {
      lastExtremum = p;
    } else if (!nextExtremum) {
      nextExtremum = p;
    }
  }

  if (!lastExtremum || !nextExtremum) return null;

  const minutesSinceLast = (currentUtcMs - lastExtremum.utcMs) / 60000;
  const minutesToNext = (nextExtremum.utcMs - currentUtcMs) / 60000;

  if (minutesToNext <= 15 || minutesSinceLast <= 15) return "slack";

  if (minutesToNext <= 60) return "final_hour_before_slack";

  if (lastExtremum.type === "L" && nextExtremum.type === "H") {
    return minutesSinceLast <= 120 ? "incoming_first_2_hours" : "incoming_mid";
  }

  if (lastExtremum.type === "H" && nextExtremum.type === "L") {
    return minutesSinceLast <= 120 ? "outgoing_first_2_hours" : "outgoing_mid";
  }

  return null;
}

// Convert "YYYY-MM-DD HH:mm" local station time to UTC ms using known offset
function localTimeStringToUtcMs(localStr: string, tzOffsetHours: number): number {
  // Parse without timezone assumption then shift by offset
  const normalized = localStr.replace(" ", "T") + ":00";
  const localMs = new Date(normalized + "Z").getTime(); // treats as UTC
  return localMs - tzOffsetHours * 3600 * 1000;        // subtract offset to get UTC
}

// ---------------------------------------------------------------------------
// Section 4E — Tide Strength
// ---------------------------------------------------------------------------

function deriveTideStrength(env: EnvironmentSnapshot): {
  range_strength_pct: number | null;
  tide_strength_state: TideStrengthState | null;
} {
  if (
    env.tide_predictions_today.length < 2 ||
    env.tide_predictions_30day.length < 10
  ) {
    return { range_strength_pct: null, tide_strength_state: null };
  }

  const todayHighs = env.tide_predictions_today
    .filter((p) => p.type === "H")
    .map((p) => p.height_ft);
  const todayLows = env.tide_predictions_today
    .filter((p) => p.type === "L")
    .map((p) => p.height_ft);

  if (todayHighs.length === 0 || todayLows.length === 0) {
    return { range_strength_pct: null, tide_strength_state: null };
  }

  const todayRange =
    Math.max(...todayHighs) - Math.min(...todayLows);

  const dailyRanges = env.tide_predictions_30day.map((d) => d.high_ft - d.low_ft);
  dailyRanges.sort((a, b) => a - b);

  const p10 = percentile(dailyRanges, 10);
  const p90 = percentile(dailyRanges, 90);

  const denom = Math.max(p90 - p10, 0.1);
  const raw = ((todayRange - p10) / denom) * 100;
  const strengthPct = Math.round(Math.max(0, Math.min(100, raw)));

  let state: TideStrengthState;
  if (strengthPct >= 85) state = "strong_movement";
  else if (strengthPct >= 65) state = "above_average_movement";
  else if (strengthPct >= 40) state = "moderate_movement";
  else if (strengthPct >= 15) state = "weak_movement";
  else state = "minimal_movement";

  return { range_strength_pct: strengthPct, tide_strength_state: state };
}

function percentile(sortedArr: number[], pct: number): number {
  if (sortedArr.length === 0) return 0;
  const idx = (pct / 100) * (sortedArr.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sortedArr[lo];
  return sortedArr[lo] + (sortedArr[hi] - sortedArr[lo]) * (idx - lo);
}

// ---------------------------------------------------------------------------
// Section 4F — Temperature Trend
// ---------------------------------------------------------------------------

function deriveTempTrend(env: EnvironmentSnapshot): {
  temp_trend_direction_f: number | null;
  temp_trend_state: TempTrendState | null;
} {
  // Try hourly first
  const nowMs = new Date(env.timestamp_utc).getTime();

  if (env.hourly_air_temp_f.length >= 48) {
    const last24 = getRecentHourlyMean(env.hourly_air_temp_f, nowMs, 0, 24);
    const prev24 = getRecentHourlyMean(env.hourly_air_temp_f, nowMs, 24, 48);

    // 72-hour window: compare same local-time window today vs 3 days ago (local day boundaries)
    const nowTzMs = nowMs + env.tz_offset_hours * 3600 * 1000;
    const currentHour = new Date(nowTzMs).getUTCHours();

    const todayMean = getHourlyMeanForDay(
      env.hourly_air_temp_f,
      nowMs,
      env.tz_offset_hours,
      0,
      currentHour
    );
    const threeDaysAgoMean = getHourlyMeanForDay(
      env.hourly_air_temp_f,
      nowMs,
      env.tz_offset_hours,
      3 * 24 * 3600 * 1000,
      currentHour
    );

    if (
      last24 !== null &&
      prev24 !== null &&
      todayMean !== null &&
      threeDaysAgoMean !== null
    ) {
      const trend72h = todayMean - threeDaysAgoMean;
      const trend24h = last24 - prev24;

      const state = mapTempTrendState(trend72h, trend24h);
      return { temp_trend_direction_f: trend72h, temp_trend_state: state };
    }
  }

  // Fallback: use daily high/low means
  const highs = env.daily_air_temp_high_f;
  const lows = env.daily_air_temp_low_f;
  if (highs.length >= 4 && lows.length >= 4) {
    const todayMean = dailyMean(highs[highs.length - 1], lows[lows.length - 1]);
    const threeDayMean = dailyMean(highs[highs.length - 4], lows[lows.length - 4]);
    if (todayMean !== null && threeDayMean !== null) {
      const trend = todayMean - threeDayMean;
      return {
        temp_trend_direction_f: trend,
        temp_trend_state: mapTempTrendState(trend, null),
      };
    }
  }

  return { temp_trend_direction_f: null, temp_trend_state: null };
}

function mapTempTrendState(
  trend72h: number,
  trend24h: number | null
): TempTrendState {
  // rapid_cooling can use 24h delta
  if (trend24h !== null && trend24h <= -4) return "rapid_cooling";
  if (trend72h <= -5) return "rapid_cooling";
  if (trend72h >= 4) return "rapid_warming";
  if (trend72h >= 1) return "warming";
  if (trend72h <= -1) return "cooling";
  return "stable";
}

function getRecentHourlyMean(
  hourly: Array<{ time_utc: string; value: number }>,
  nowMs: number,
  hoursBack1: number,
  hoursBack2: number
): number | null {
  const start = nowMs - hoursBack2 * 3600 * 1000;
  const end = nowMs - hoursBack1 * 3600 * 1000;
  const vals = hourly
    .filter((h) => {
      const t = new Date(h.time_utc).getTime();
      return t >= start && t < end;
    })
    .map((h) => h.value);
  if (vals.length === 0) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

// Local-day boundaries in UTC ms. nowMs and tzOffsetHours define "now"; msBack is 0 for today or 3*24*3600*1000 for 3 days ago.
// throughHour is current local hour (0-23); we include hours 0 through throughHour inclusive.
function getHourlyMeanForDay(
  hourly: Array<{ time_utc: string; value: number }>,
  nowMs: number,
  tzOffsetHours: number,
  msBack: number,
  throughHour: number
): number | null {
  const offsetMs = tzOffsetHours * 3600 * 1000;
  const localEpochMs = nowMs + offsetMs;
  const localDayStartEpoch = Math.floor(localEpochMs / 86400000) * 86400000;
  const dayStartUtc = localDayStartEpoch - offsetMs - msBack;
  const dayEndUtc = dayStartUtc + (throughHour + 1) * 3600 * 1000;
  const vals = hourly
    .filter((h) => {
      const t = new Date(h.time_utc).getTime();
      return t >= dayStartUtc && t < dayEndUtc;
    })
    .map((h) => h.value);
  if (vals.length === 0) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function dailyMean(high: number | null, low: number | null): number | null {
  if (high === null || low === null) return null;
  return (high + low) / 2;
}

// ---------------------------------------------------------------------------
// Section 4G — Freshwater Water Temperature Estimate
// Lake: weighted air model + correction table + 32°F floor + deep-winter clamp
// River: groundwater blending model + 33°F floor
// ---------------------------------------------------------------------------

const GROUNDWATER_BASE_TEMP: Record<LatitudeBand, number> = {
  far_north: 42,
  north: 47,
  mid: 52,
  south: 58,
  deep_south: 65,
};

const AIR_INFLUENCE_ALPHA: Record<MeteoSeason, Record<LatitudeBand, number>> = {
  DJF: { far_north: 0.50, north: 0.55, mid: 0.60, south: 0.65, deep_south: 0.70 },
  MAM: { far_north: 0.60, north: 0.65, mid: 0.70, south: 0.72, deep_south: 0.75 },
  JJA: { far_north: 0.78, north: 0.80, mid: 0.82, south: 0.84, deep_south: 0.85 },
  SON: { far_north: 0.65, north: 0.70, mid: 0.72, south: 0.74, deep_south: 0.75 },
};

const SNOWMELT_DAMPENING: Record<LatitudeBand, number> = {
  far_north: -3,
  north: -2,
  mid: 0,
  south: 0,
  deep_south: 0,
};

function estimateFreshwaterTemp(
  env: EnvironmentSnapshot,
  subtype: FreshwaterSubtype | null,
  latBand: LatitudeBand,
  seasonalState: SeasonalFishBehaviorState | null
): number | null {
  const highs = env.daily_air_temp_high_f;
  const lows = env.daily_air_temp_low_f;
  if (highs.length < 7 || lows.length < 7) return null;

  // Compute daily means for last 7 days (index 0=6 days ago, index 6=today)
  const means: Array<number | null> = [];
  for (let i = 0; i < 7; i++) {
    means.push(dailyMean(highs[i], lows[i]));
  }

  const isRiver = subtype === "river_stream";
  const month = new Date(env.timestamp_utc).getUTCMonth() + 1;
  const season = getMeteoSeason(month);

  // Compute raw weighted air average (no corrections yet)
  const weights = isRiver
    ? [0.40, 0.28, 0.16, 0.08, 0.05, 0.02, 0.01]
    : [0.30, 0.25, 0.20, 0.12, 0.07, 0.04, 0.02];

  let weighted = 0;
  let totalWeight = 0;
  for (let i = 0; i < 7; i++) {
    const dayIndex = 6 - i;
    if (means[dayIndex] !== null) {
      weighted += (means[dayIndex] as number) * weights[i];
      totalWeight += weights[i];
    }
  }
  if (totalWeight < 0.5) return null;
  const rawAirAvg = weighted / totalWeight;

  if (isRiver) {
    // ---- RIVER: Groundwater blending model ----
    const gwBase = GROUNDWATER_BASE_TEMP[latBand];
    const alpha = AIR_INFLUENCE_ALPHA[season][latBand];
    const snowmelt = season === "MAM" ? SNOWMELT_DAMPENING[latBand] : 0;
    const blended = alpha * rawAirAvg + (1 - alpha) * (gwBase + snowmelt);
    return Math.max(33, Math.round(blended * 10) / 10);
  }

  // ---- LAKE (default): Correction table + floor + deep-winter clamp ----
  const correction = getLatSeasonCorrection(env.lat, season, subtype);
  const seasonalOffset = getSeasonalStateTempOffset(seasonalState, subtype, month);
  let estimate = rawAirAvg + correction + seasonalOffset;

  // Hard floor: liquid water cannot be below 32°F
  estimate = Math.max(32, estimate);

  // Deep-winter clamp: northern lakes under ice are 32-35°F
  if (
    seasonalState === "deep_winter_survival" &&
    (latBand === "north" || latBand === "far_north")
  ) {
    estimate = Math.max(32, Math.min(35, estimate));
  }

  return Math.round(estimate * 10) / 10;
}

type MeteoSeason = "DJF" | "MAM" | "JJA" | "SON";

function getMeteoSeason(month: number): MeteoSeason {
  if (month === 12 || month <= 2) return "DJF";
  if (month <= 5) return "MAM";
  if (month <= 8) return "JJA";
  return "SON";
}

// ---------------------------------------------------------------------------
// Altitude Effective Latitude (adjusts seasonal band for elevation)
// ---------------------------------------------------------------------------

export function computeEffectiveLatitude(lat: number, altitudeFt: number | null): number {
  if (altitudeFt === null || altitudeFt <= 1500) return lat;
  const altitudeAboveBaseline = altitudeFt - 1500;
  const latShift = (altitudeAboveBaseline / 1000) * 1.2;
  return lat + latShift;
}

export function getLatitudeBand(effectiveLat: number): LatitudeBand {
  if (effectiveLat < 30) return "deep_south";
  if (effectiveLat < 34) return "south";
  if (effectiveLat < 39) return "mid";
  if (effectiveLat < 44) return "north";
  return "far_north";
}

function getLatSeasonCorrection(
  lat: number,
  season: MeteoSeason,
  subtype: FreshwaterSubtype | null
): number {
  // Base correction table: lake/reservoir baseline
  const table: Record<MeteoSeason, [number, number, number]> = {
    DJF: [-2, -4, -5],
    MAM: [-3, -5, -6],
    JJA: [-4, -6, -8],
    SON: [-3, -5, -7],
  };
  const row = table[season];
  let base: number;
  if (lat < 33) base = row[0];
  else if (lat <= 40) base = row[1];
  else base = row[2];

  // Rivers track air more closely so the correction is roughly halved.
  // The weighted average already uses more recent data; the correction just
  // needs to be smaller since less thermal lag exists.
  if (subtype === "river_stream") return Math.round(base * 0.5);

  return base;
}

function getSeasonalStateTempOffset(
  seasonalState: SeasonalFishBehaviorState | null,
  subtype: FreshwaterSubtype | null,
  month: number
): number {
  const isRiver = subtype === "river_stream";
  const isReservoir = subtype === "reservoir";

  let offset = 0;
  switch (seasonalState) {
    case "deep_winter_survival":
      offset = isRiver ? -0.5 : isReservoir ? -2.0 : -2.5;
      break;
    case "pre_spawn_buildup":
      offset = isRiver ? 0.0 : -1.0;
      break;
    case "spawn_period":
      offset = isRiver ? 0.5 : 0.0;
      break;
    case "post_spawn_recovery":
      offset = isRiver ? 0.5 : 0.0;
      break;
    case "summer_peak_activity":
      offset = isRiver ? -0.5 : -1.0;
      break;
    case "summer_heat_suppression":
      offset = isRiver ? -1.0 : -2.0;
      break;
    case "fall_feed_buildup":
      offset = isRiver ? 0.0 : -0.5;
      break;
    case "late_fall_slowdown":
      offset = isRiver ? -0.5 : -1.5;
      break;
    default:
      offset = 0;
  }

  // Shoulder-month lakes and reservoirs usually lag air more strongly.
  if (!isRiver && (month === 3 || month === 11)) {
    offset -= 0.5;
  }

  return offset;
}

// ---------------------------------------------------------------------------
// Section 4H — Water Temperature Absolute Zone
// ---------------------------------------------------------------------------

function deriveWaterTempZone(
  waterTempF: number | null,
  waterType: WaterType
): WaterTempZone | null {
  if (waterTempF === null) return null;

  const zones: Record<WaterType, Array<[WaterTempZone, number, number]>> = {
    freshwater: [
      ["near_shutdown_cold", -Infinity, 36],
      ["lethargic", 36, 48],
      ["transitional", 48, 58],
      ["active_prime", 58, 72],
      ["peak_aggression", 72, 82],
      ["thermal_stress_heat", 82, Infinity],
    ],
    saltwater: [
      ["near_shutdown_cold", -Infinity, 50],
      ["lethargic", 50, 60],
      ["transitional", 60, 68],
      ["active_prime", 68, 80],
      ["peak_aggression", 80, 88],
      ["thermal_stress_heat", 88, Infinity],
    ],
    brackish: [
      ["near_shutdown_cold", -Infinity, 48],
      ["lethargic", 48, 58],
      ["transitional", 58, 66],
      ["active_prime", 66, 78],
      ["peak_aggression", 78, 86],
      ["thermal_stress_heat", 86, Infinity],
    ],
  };

  for (const [zone, lo, hi] of zones[waterType]) {
    if (waterTempF >= lo && waterTempF < hi) return zone;
  }

  return "thermal_stress_heat";
}

// ---------------------------------------------------------------------------
// Section 4G2 — Freshwater seasonal cold context (cold-season vs cold-shock)
// Only for freshwater when water is in a cold zone. Uses month and latitude.
// ---------------------------------------------------------------------------

function deriveFreshwaterColdContext(
  env: EnvironmentSnapshot,
  waterType: WaterType,
  waterTempZone: WaterTempZone | null,
  latBand: LatitudeBand
): FreshwaterColdContext {
  if (waterType !== "freshwater" || waterTempZone === null) return null;
  if (waterTempZone !== "near_shutdown_cold" && waterTempZone !== "lethargic") return null;

  const month = new Date(env.timestamp_utc).getUTCMonth() + 1;

  // Cold season varies by latitude band
  const coldSeasonMonths: Record<LatitudeBand, number[]> = {
    deep_south: [12, 1],
    south: [12, 1, 2],
    mid: [12, 1, 2, 3],
    north: [11, 12, 1, 2, 3, 4],
    far_north: [10, 11, 12, 1, 2, 3, 4],
  };

  const warmSeasonMonths: Record<LatitudeBand, number[]> = {
    deep_south: [5, 6, 7, 8, 9],
    south: [6, 7, 8],
    mid: [6, 7, 8],
    north: [7, 8],
    far_north: [7, 8],
  };

  if (coldSeasonMonths[latBand].includes(month)) return "seasonally_expected_cold";
  if (warmSeasonMonths[latBand].includes(month)) return "cold_shock";

  // Transition months: northern bands treat as expected, southern as shock
  return (latBand === "north" || latBand === "far_north")
    ? "seasonally_expected_cold"
    : "cold_shock";
}

// ---------------------------------------------------------------------------
// Section 4G3 — Deterministic seasonal fish-behavior state
// 5-band latitude system with river overrides for spawn timing
// ---------------------------------------------------------------------------

const FRESHWATER_SEASONAL_MAP: Record<LatitudeBand, Record<number, SeasonalFishBehaviorState>> = {
  deep_south: {
    1: "mild_winter_active",
    2: "pre_spawn_buildup",
    3: "spawn_period",
    4: "post_spawn_recovery",
    5: "summer_peak_activity",
    6: "summer_heat_suppression",
    7: "summer_heat_suppression",
    8: "summer_heat_suppression",
    9: "fall_feed_buildup",
    10: "fall_feed_buildup",
    11: "late_fall_slowdown",
    12: "mild_winter_active",
  },
  south: {
    1: "deep_winter_survival",
    2: "pre_spawn_buildup",
    3: "spawn_period",
    4: "spawn_period",
    5: "post_spawn_recovery",
    6: "summer_heat_suppression",
    7: "summer_heat_suppression",
    8: "summer_heat_suppression",
    9: "fall_feed_buildup",
    10: "late_fall_slowdown",
    11: "late_fall_slowdown",
    12: "deep_winter_survival",
  },
  mid: {
    1: "deep_winter_survival",
    2: "deep_winter_survival",
    3: "pre_spawn_buildup",
    4: "spawn_period",
    5: "spawn_period",
    6: "post_spawn_recovery",
    7: "summer_peak_activity",
    8: "summer_peak_activity",
    9: "fall_feed_buildup",
    10: "fall_feed_buildup",
    11: "late_fall_slowdown",
    12: "deep_winter_survival",
  },
  north: {
    1: "deep_winter_survival",
    2: "deep_winter_survival",
    3: "deep_winter_survival",
    4: "pre_spawn_buildup",
    5: "pre_spawn_buildup",
    6: "spawn_period",
    7: "summer_peak_activity",
    8: "summer_peak_activity",
    9: "fall_feed_buildup",
    10: "fall_feed_buildup",
    11: "late_fall_slowdown",
    12: "deep_winter_survival",
  },
  far_north: {
    1: "deep_winter_survival",
    2: "deep_winter_survival",
    3: "deep_winter_survival",
    4: "deep_winter_survival",
    5: "pre_spawn_buildup",
    6: "pre_spawn_buildup",
    7: "spawn_period",
    8: "summer_peak_activity",
    9: "fall_feed_buildup",
    10: "late_fall_slowdown",
    11: "deep_winter_survival",
    12: "deep_winter_survival",
  },
};

// Rivers warm faster than lakes; spawn shifts ~1 month earlier at north/far_north
const RIVER_SPAWN_OVERRIDES: Partial<Record<LatitudeBand, Record<number, SeasonalFishBehaviorState>>> = {
  north: {
    5: "spawn_period",          // lakes: pre_spawn_buildup
    6: "post_spawn_recovery",   // lakes: spawn_period
  },
  far_north: {
    6: "spawn_period",              // lakes: pre_spawn_buildup
    7: "summer_peak_activity",      // lakes: spawn_period
  },
};

function deriveSeasonalFishBehavior(
  env: EnvironmentSnapshot,
  waterType: WaterType,
  subtype: FreshwaterSubtype | null,
  latBand: LatitudeBand
): SeasonalFishBehaviorState | null {
  if (waterType !== "freshwater") return null;

  const month = new Date(env.timestamp_utc).getUTCMonth() + 1;
  const isRiver = subtype === "river_stream";

  // Check river overrides first
  if (isRiver) {
    const overrides = RIVER_SPAWN_OVERRIDES[latBand];
    if (overrides && overrides[month]) {
      return overrides[month]!;
    }
  }

  return FRESHWATER_SEASONAL_MAP[latBand]?.[month] ?? "deep_winter_survival";
}

// ---------------------------------------------------------------------------
// Saltwater / Brackish Seasonal Thermal Opportunity State
// ---------------------------------------------------------------------------

type CoastalBand = "north_coast" | "mid_coast" | "south_coast";

function getCoastalBand(lat: number): CoastalBand {
  if (lat >= 39) return "north_coast";
  if (lat >= 30) return "mid_coast";
  return "south_coast";
}

const SALTWATER_SEASONAL_MAP: Record<CoastalBand, Record<number, SaltwaterSeasonalState>> = {
  north_coast: {
    1: "sw_cold_inactive", 2: "sw_cold_inactive",
    3: "sw_transitional_feed", 4: "sw_transitional_feed",
    5: "sw_transitional_feed", 6: "sw_summer_peak",
    7: "sw_summer_peak", 8: "sw_summer_peak",
    9: "sw_transitional_feed", 10: "sw_transitional_feed",
    11: "sw_cold_inactive", 12: "sw_cold_inactive",
  },
  mid_coast: {
    1: "sw_cold_mild_active", 2: "sw_cold_mild_active",
    3: "sw_transitional_feed", 4: "sw_transitional_feed",
    5: "sw_summer_peak", 6: "sw_summer_heat_stress",
    7: "sw_summer_heat_stress", 8: "sw_summer_heat_stress",
    9: "sw_transitional_feed", 10: "sw_transitional_feed",
    11: "sw_cold_mild_active", 12: "sw_cold_mild_active",
  },
  south_coast: {
    1: "sw_cold_mild_active", 2: "sw_transitional_feed",
    3: "sw_transitional_feed", 4: "sw_summer_peak",
    5: "sw_summer_heat_stress", 6: "sw_summer_heat_stress",
    7: "sw_summer_heat_stress", 8: "sw_summer_heat_stress",
    9: "sw_summer_heat_stress", 10: "sw_transitional_feed",
    11: "sw_transitional_feed", 12: "sw_cold_mild_active",
  },
};

function deriveSaltwaterSeasonalState(
  env: EnvironmentSnapshot,
  waterType: WaterType
): SaltwaterSeasonalState | null {
  if (waterType === "freshwater") return null;
  const month = new Date(env.timestamp_utc).getUTCMonth() + 1;
  const band = getCoastalBand(env.lat);
  return SALTWATER_SEASONAL_MAP[band]?.[month] ?? "sw_transitional_feed";
}

// ---------------------------------------------------------------------------
// Section 4I — Severe Alerts
// ---------------------------------------------------------------------------

function deriveColdStunAlert(
  waterType: WaterType,
  measuredWaterTemp: number | null,
  measuredWaterTemp72hAgo: number | null,
  _timestampUtc: string
): { alert: boolean; status: AlertStatus } {
  if (waterType === "freshwater") {
    return { alert: false, status: "evaluated" };
  }

  const threshold = waterType === "saltwater" ? 52 : 50;
  const dropThreshold = 8;

  // If current water temp is unavailable, cannot evaluate
  if (measuredWaterTemp === null) {
    return { alert: false, status: "not_evaluable_missing_inputs" };
  }

  // Temp is above threshold — definitively not cold stun
  if (measuredWaterTemp >= threshold) {
    return { alert: false, status: "evaluated" };
  }

  // Temp is below threshold. Now check the 72h drop requirement.
  // If 72h comparison temp is unavailable, we cannot confirm the drop — not evaluable.
  if (measuredWaterTemp72hAgo === null) {
    return { alert: false, status: "not_evaluable_missing_inputs" };
  }

  // Drop = temp 72h ago minus current temp (positive = it got colder)
  const drop = measuredWaterTemp72hAgo - measuredWaterTemp;
  const alertFires = drop > dropThreshold;

  return { alert: alertFires, status: "evaluated" };
}

function deriveSalinityDisruptionAlert(
  waterType: WaterType,
  precip48hr: number | null
): { alert: boolean; status: AlertStatus } {
  if (waterType !== "brackish") {
    return { alert: false, status: "evaluated" };
  }

  if (precip48hr === null) {
    return { alert: false, status: "not_evaluable_missing_inputs" };
  }

  return {
    alert: precip48hr > 2.0,
    status: "evaluated",
  };
}

// ---------------------------------------------------------------------------
// Section 4J — Precipitation Condition
// ---------------------------------------------------------------------------

function derivePrecipCondition(
  currentPrecipInHr: number | null,
  precip48hr: number | null,
  waterType: WaterType
): PrecipCondition | null {
  if (currentPrecipInHr === null && precip48hr === null) return null;

  const cur = currentPrecipInHr ?? 0;
  const p48 = precip48hr ?? 0;

  // Saltwater aliases
  if (waterType === "saltwater") {
    if (p48 > 4.0 && cur === 0) return "post_major_storm";
    if (cur > 0) return "current_rain_any_intensity";
    return "no_precip";
  }

  // Freshwater / brackish — exact thresholds
  if (p48 > 2.0) return "post_heavy_rain_48hr";
  if (cur > 0.30) return "heavy_rain";
  if (cur >= 0.10 && cur <= 0.30) return "moderate_rain";
  if (cur > 0 && cur < 0.10) return "light_rain";
  if (cur === 0 && p48 > 0 && p48 <= 0.50) return "post_light_rain_clearing";
  return "no_precip_stable";
}

// ---------------------------------------------------------------------------
// Moon Phase Normalization
// ---------------------------------------------------------------------------

function deriveMoonPhase(
  rawLabel: string | null,
  isWaxing: boolean | null
): MoonPhaseLabel | null {
  if (!rawLabel) return null;
  const l = rawLabel.toLowerCase();

  if (l.includes("new")) return "new_moon";
  if (l.includes("full")) return "full_moon";
  if (l.includes("gibbous")) return "waxing_or_waning_gibbous";
  if (l.includes("quarter")) return "first_or_third_quarter";
  if (l.includes("crescent")) return "waxing_or_waning_crescent";

  return null;
}

// ---------------------------------------------------------------------------
// Severe Weather Detection — Safety Guard
// ---------------------------------------------------------------------------

function detectSevereWeather(env: EnvironmentSnapshot): {
  severe_weather_alert: boolean;
  severe_weather_reasons: string[];
} {
  const reasons: string[] = [];

  // Dangerous sustained wind
  if (env.wind_speed_mph !== null && env.wind_speed_mph > 30) {
    reasons.push("Dangerous sustained winds above 30 mph");
  }

  // Dangerous gusts
  if (env.gust_speed_mph !== null && env.gust_speed_mph > 45) {
    reasons.push("Dangerous wind gusts above 45 mph");
  }

  // Extreme cold
  if (env.air_temp_f !== null && env.air_temp_f < 0) {
    reasons.push("Extreme cold: air temperature below 0°F");
  }

  // Wind chill calculation (NWS formula)
  if (env.air_temp_f !== null && env.wind_speed_mph !== null &&
      env.air_temp_f <= 50 && env.wind_speed_mph >= 3) {
    const t = env.air_temp_f;
    const v = env.wind_speed_mph;
    const wc = 35.74 + 0.6215 * t - 35.75 * Math.pow(v, 0.16) + 0.4275 * t * Math.pow(v, 0.16);
    if (wc < -10) {
      reasons.push(`Dangerous wind chill of ${Math.round(wc)}°F`);
    }
  }

  // Severe precipitation
  if (env.current_precip_in_hr !== null && env.current_precip_in_hr > 1.0) {
    reasons.push("Severe precipitation exceeding 1 inch per hour");
  }

  return {
    severe_weather_alert: reasons.length > 0,
    severe_weather_reasons: reasons,
  };
}

// ---------------------------------------------------------------------------
// Wind-Tide Relation (Section 5J)
// ---------------------------------------------------------------------------

function calculateBearing(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const lat1Rad = lat1 * Math.PI / 180;
  const lat2Rad = lat2 * Math.PI / 180;
  const y = Math.sin(dLon) * Math.cos(lat2Rad);
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) -
            Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
  return ((Math.atan2(y, x) * 180 / Math.PI) + 360) % 360;
}

function deriveWindTideRelation(
  windDirectionDeg: number | null,
  tidePhaseState: import("./types.ts").TidePhaseState | null,
  env: EnvironmentSnapshot
): WindTideRelation {
  if (windDirectionDeg === null || tidePhaseState === null) {
    return "neutral_or_unknown_relationship";
  }

  // Slack or final hour: no meaningful flow to compare
  if (tidePhaseState === "slack" || tidePhaseState === "final_hour_before_slack") {
    return "neutral_or_unknown_relationship";
  }

  // Need tide station coordinates — approximate from station being "seaward"
  // If no station, stay neutral
  if (!env.nearest_tide_station_id || !env.coastal) {
    return "neutral_or_unknown_relationship";
  }

  // Simplified V1: Use bearing from the midpoint of the nearest coastline
  // Since we lack station coordinates, we approximate:
  // For US East Coast: ocean is to the east (bearing ~90° from shore)
  // For US West Coast: ocean is to the west (bearing ~270°)
  // For Gulf Coast: ocean is to the south (bearing ~180°)
  // Determine rough coast orientation from longitude
  let oceanBearing: number;
  if (env.lon > -82 && env.lat > 30) {
    // East coast (east of Florida panhandle, above Gulf)
    oceanBearing = 90;
  } else if (env.lon < -115) {
    // West coast
    oceanBearing = 270;
  } else if (env.lat < 31 && env.lon > -98) {
    // South Texas / Gulf
    oceanBearing = 170;
  } else if (env.lon >= -98 && env.lon <= -82 && env.lat < 31) {
    // Gulf Coast (LA, MS, AL, FL panhandle)
    oceanBearing = 180;
  } else {
    // Default: assume east
    oceanBearing = 90;
  }

  const isIncoming = tidePhaseState === "incoming_first_2_hours" ||
                     tidePhaseState === "incoming_mid";

  // Incoming: water flows FROM ocean TOWARD land (landward)
  // Tidal flow direction = opposite of ocean bearing (toward land)
  const landwardBearing = (oceanBearing + 180) % 360;
  const tideFlowDeg = isIncoming ? landwardBearing : oceanBearing;

  // Wind "from" direction: wind from N (0°) means air moves S (180°)
  const windFlowDeg = (windDirectionDeg + 180) % 360;

  const angleDelta = Math.abs(windFlowDeg - tideFlowDeg);
  const normalized = angleDelta > 180 ? 360 - angleDelta : angleDelta;

  if (normalized <= 45) return "wind_with_tide";
  if (normalized >= 135) return "wind_against_tide";
  return "neutral_or_unknown_relationship";
}

// ---------------------------------------------------------------------------
// Water Temperature Source Routing (Section 2D)
// ---------------------------------------------------------------------------

function resolveWaterTemp(
  env: EnvironmentSnapshot,
  waterType: WaterType,
  subtype: FreshwaterSubtype | null,
  latBand: LatitudeBand,
  seasonalState: SeasonalFishBehaviorState | null
): { water_temp_f: number | null; water_temp_source: WaterTempSource } {
  if (waterType === "freshwater") {
    const est = estimateFreshwaterTemp(env, subtype, latBand, seasonalState);
    if (est !== null) {
      return { water_temp_f: est, water_temp_source: "freshwater_air_model" };
    }
    return { water_temp_f: null, water_temp_source: "unavailable" };
  }

  if (env.measured_water_temp_f !== null && env.measured_water_temp_source !== null) {
    return {
      water_temp_f: env.measured_water_temp_f,
      water_temp_source: env.measured_water_temp_source,
    };
  }

  return { water_temp_f: null, water_temp_source: "unavailable" };
}

// ---------------------------------------------------------------------------
// LOCAL TIME CALCULATION
// ---------------------------------------------------------------------------

export function currentLocalMinutes(env: EnvironmentSnapshot): number {
  const utcMs = new Date(env.timestamp_utc).getTime();
  const localMs = utcMs + env.tz_offset_hours * 3600 * 1000;
  const localDate = new Date(localMs);
  return localDate.getUTCHours() * 60 + localDate.getUTCMinutes();
}

// ---------------------------------------------------------------------------
// MAIN EXPORT — deriveDerivedVariables
// ---------------------------------------------------------------------------

export function deriveDerivedVariables(
  env: EnvironmentSnapshot,
  waterType: WaterType
): DerivedVariables {
  const clm = currentLocalMinutes(env);
  const currentUtcMs = new Date(env.timestamp_utc).getTime();

  // Resolve freshwater subtype from hint in the snapshot
  const freshwater_subtype: FreshwaterSubtype | null =
    waterType === "freshwater" ? (env.freshwater_subtype_hint ?? "lake") : null;

  // Compute effective latitude (altitude-adjusted) and band
  const effective_latitude = computeEffectiveLatitude(env.lat, env.altitude_ft);
  const latitude_band = getLatitudeBand(effective_latitude);

  const { pressure_change_rate_mb_hr, pressure_state } = derivePressureTrend(env);
  const light_condition = deriveLightCondition(env, clm);
  const solunar_state = deriveSolunarState(env, clm);
  const tide_phase_state = deriveTidePhase(env, currentUtcMs);
  const { range_strength_pct, tide_strength_state } = deriveTideStrength(env);
  const { temp_trend_direction_f, temp_trend_state } = deriveTempTrend(env);

  // Seasonal behavior BEFORE water temp (water temp model uses it)
  const seasonal_fish_behavior = deriveSeasonalFishBehavior(
    env, waterType, freshwater_subtype, latitude_band
  );

  // Water temp with new params
  const { water_temp_f, water_temp_source } = resolveWaterTemp(
    env, waterType, freshwater_subtype, latitude_band, seasonal_fish_behavior
  );
  const water_temp_zone = deriveWaterTempZone(water_temp_f, waterType);

  // Cold context with latitude band
  const freshwater_cold_context = deriveFreshwaterColdContext(
    env, waterType, water_temp_zone, latitude_band
  );

  // Saltwater seasonal state (new)
  const saltwater_seasonal_state = deriveSaltwaterSeasonalState(env, waterType);

  const moon_phase = deriveMoonPhase(env.moon_phase_label, env.moon_phase_is_waxing);
  const precip_condition = derivePrecipCondition(
    env.current_precip_in_hr, env.precip_48hr_inches, waterType
  );

  const { alert: cold_stun_alert, status: cold_stun_status } = deriveColdStunAlert(
    waterType, env.measured_water_temp_f, env.measured_water_temp_72h_ago_f, env.timestamp_utc
  );

  const { alert: salinity_disruption_alert, status: salinity_disruption_status } =
    deriveSalinityDisruptionAlert(waterType, env.precip_48hr_inches);

  // Wind-tide with new approximation (pass tide phase and full env)
  const wind_tide_relation = deriveWindTideRelation(
    env.wind_direction_deg, tide_phase_state, env
  );

  // Severe weather detection (new)
  const { severe_weather_alert, severe_weather_reasons } = detectSevereWeather(env);

  return {
    current_local_minutes: clm,
    pressure_change_rate_mb_hr,
    pressure_state,
    light_condition,
    solunar_state,
    tide_phase_state,
    tide_strength_state,
    range_strength_pct,
    temp_trend_direction_f,
    temp_trend_state,
    water_temp_f,
    water_temp_source,
    water_temp_zone,
    freshwater_cold_context,
    freshwater_subtype,
    seasonal_fish_behavior,
    moon_phase,
    precip_condition,
    cold_stun_alert,
    cold_stun_status,
    salinity_disruption_alert,
    salinity_disruption_status,
    wind_tide_relation,
    // New fields:
    saltwater_seasonal_state,
    latitude_band,
    effective_latitude,
    severe_weather_alert,
    severe_weather_reasons,
  };
}

// Re-export helpers needed by other engine modules
export {
  hmToMinutes,
  localTimeStringToUtcMs,
  deriveWaterTempZone,
  estimateFreshwaterTemp,
  getMeteoSeason,
  getLatSeasonCorrection,
};
