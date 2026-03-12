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
  let closest: { value: number; diff: number } | null = null;

  for (const point of env.hourly_pressure_mb) {
    const t = new Date(point.time_utc).getTime();
    const diff = Math.abs(t - target);
    if (!closest || diff < closest.diff) {
      closest = { value: point.value, diff };
    }
  }

  if (!closest || closest.diff > 2 * 3600 * 1000) {
    return { pressure_change_rate_mb_hr: null, pressure_state: null };
  }

  const rate = (env.pressure_mb - closest.value) / 3;

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

  const isWithin30MinOf = (start: string, end: string): boolean => {
    const s = hmToMinutes(start);
    const e = hmToMinutes(end);
    if (s === null || e === null) return false;
    return (
      (currentLocalMinutes >= s - 30 && currentLocalMinutes < s) ||
      (currentLocalMinutes > e && currentLocalMinutes <= e + 30)
    );
  };

  for (const p of env.solunar_major_periods) {
    if (isInside(p.start_local, p.end_local)) return "within_major_window";
  }

  for (const p of env.solunar_major_periods) {
    if (isWithin30MinOf(p.start_local, p.end_local)) return "within_30min_of_major";
  }

  for (const p of env.solunar_minor_periods) {
    if (isInside(p.start_local, p.end_local)) return "within_minor_window";
  }

  for (const p of env.solunar_minor_periods) {
    if (isWithin30MinOf(p.start_local, p.end_local)) return "within_30min_of_minor";
  }

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

    // 72-hour window comparison
    const nowTzMs = nowMs + env.tz_offset_hours * 3600 * 1000;
    const currentHour = new Date(nowTzMs).getUTCHours();

    const todayMean = getHourlyMeanForDay(env.hourly_air_temp_f, nowTzMs, 0, currentHour);
    const threeDaysAgoMean = getHourlyMeanForDay(
      env.hourly_air_temp_f,
      nowTzMs,
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

function getHourlyMeanForDay(
  hourly: Array<{ time_utc: string; value: number }>,
  localNowMs: number,
  msBack: number,
  throughHour: number
): number | null {
  const dayStartLocal = localNowMs - msBack - (localNowMs % (24 * 3600 * 1000));
  const dayEndLocal = dayStartLocal + throughHour * 3600 * 1000;
  const vals = hourly
    .filter((h) => {
      const t = new Date(h.time_utc).getTime();
      return t >= dayStartLocal && t < dayEndLocal;
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
// ---------------------------------------------------------------------------

function estimateFreshwaterTemp(env: EnvironmentSnapshot): number | null {
  const highs = env.daily_air_temp_high_f;
  const lows = env.daily_air_temp_low_f;
  if (highs.length < 7 || lows.length < 7) return null;

  // Compute daily means for last 7 days (index 0=6 days ago, index 6=today)
  const means: Array<number | null> = [];
  for (let i = 0; i < 7; i++) {
    means.push(dailyMean(highs[i], lows[i]));
  }

  const weights = [0.30, 0.25, 0.20, 0.12, 0.07, 0.04, 0.02];
  // means[6]=today, means[5]=yesterday, ... means[0]=6 days ago
  // weights[0]=today weight, weights[1]=yesterday weight, ...

  let weighted = 0;
  let totalWeight = 0;
  for (let i = 0; i < 7; i++) {
    const dayIndex = 6 - i; // today=6, yesterday=5, ...
    if (means[dayIndex] !== null) {
      weighted += (means[dayIndex] as number) * weights[i];
      totalWeight += weights[i];
    }
  }

  if (totalWeight < 0.5) return null; // too much missing data

  const baseEstimate = weighted / totalWeight;

  // Latitude-season correction (Section 4G table)
  const month = new Date(env.timestamp_utc).getUTCMonth() + 1;
  const season = getMeteoSeason(month);
  const correction = getLatSeasonCorrection(env.lat, season);

  return Math.round((baseEstimate + correction) * 10) / 10;
}

type MeteoSeason = "DJF" | "MAM" | "JJA" | "SON";

function getMeteoSeason(month: number): MeteoSeason {
  if (month === 12 || month <= 2) return "DJF";
  if (month <= 5) return "MAM";
  if (month <= 8) return "JJA";
  return "SON";
}

function getLatSeasonCorrection(lat: number, season: MeteoSeason): number {
  const table: Record<MeteoSeason, [number, number, number]> = {
    DJF: [-2, -4, -5],
    MAM: [-3, -5, -6],
    JJA: [-4, -6, -8],
    SON: [-3, -5, -7],
  };
  const row = table[season];
  if (lat < 33) return row[0];
  if (lat <= 40) return row[1];
  return row[2];
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
// Wind-Tide Relation (Section 5J)
// ---------------------------------------------------------------------------

function deriveWindTideRelation(
  windDirectionDeg: number | null,
  // V1: tide_flow_deg not available from NOAA data — always neutral per spec
): WindTideRelation {
  if (windDirectionDeg === null) return "neutral_or_unknown_relationship";
  // tide_flow_deg requires pre-mapped tidal axis dataset not available in V1
  return "neutral_or_unknown_relationship";
}

// ---------------------------------------------------------------------------
// Water Temperature Source Routing (Section 2D)
// ---------------------------------------------------------------------------

function resolveWaterTemp(
  env: EnvironmentSnapshot,
  waterType: WaterType
): { water_temp_f: number | null; water_temp_source: WaterTempSource } {
  if (waterType === "freshwater") {
    const est = estimateFreshwaterTemp(env);
    if (est !== null) {
      return { water_temp_f: est, water_temp_source: "freshwater_air_model" };
    }
    return { water_temp_f: null, water_temp_source: "unavailable" };
  }

  // Saltwater / brackish — use measured if available
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

  const { pressure_change_rate_mb_hr, pressure_state } = derivePressureTrend(env);
  const light_condition = deriveLightCondition(env, clm);
  const solunar_state = deriveSolunarState(env, clm);
  const tide_phase_state = deriveTidePhase(env, currentUtcMs);
  const { range_strength_pct, tide_strength_state } = deriveTideStrength(env);
  const { temp_trend_direction_f, temp_trend_state } = deriveTempTrend(env);
  const { water_temp_f, water_temp_source } = resolveWaterTemp(env, waterType);
  const water_temp_zone = deriveWaterTempZone(water_temp_f, waterType);
  const moon_phase = deriveMoonPhase(env.moon_phase_label, env.moon_phase_is_waxing);
  const precip_condition = derivePrecipCondition(
    env.current_precip_in_hr,
    env.precip_48hr_inches,
    waterType
  );

  const { alert: cold_stun_alert, status: cold_stun_status } = deriveColdStunAlert(
    waterType,
    env.measured_water_temp_f,
    env.measured_water_temp_72h_ago_f,
    env.timestamp_utc
  );

  const { alert: salinity_disruption_alert, status: salinity_disruption_status } =
    deriveSalinityDisruptionAlert(waterType, env.precip_48hr_inches);

  const wind_tide_relation = deriveWindTideRelation(env.wind_direction_deg);

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
    moon_phase,
    precip_condition,
    cold_stun_alert,
    cold_stun_status,
    salinity_disruption_alert,
    salinity_disruption_status,
    wind_tide_relation,
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
