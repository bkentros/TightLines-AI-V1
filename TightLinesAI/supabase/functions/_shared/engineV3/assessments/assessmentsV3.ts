// =============================================================================
// ENGINE V3 — Measured-Only Assessments
// No inferred freshwater water temp. Coastal water temp only when measured.
// =============================================================================

import type {
  NormalizedEnvironmentV3,
  GeoContextV3,
  ScoreVariableId,
  EnvironmentModeV3,
} from '../types.ts';

export interface AssessmentResultV3 {
  variableId: ScoreVariableId;
  componentScore: number;
  stateLabel: string;
  tags: string[];
  direction: 'positive' | 'negative' | 'neutral';
  applicable: boolean;
  hasData: boolean;
}

// ---------------------------------------------------------------------------
// Air temp trend — from measured temp trend; no water temp inference
// ---------------------------------------------------------------------------

function assessAirTempTrend(
  env: NormalizedEnvironmentV3,
  _ctx: GeoContextV3
): AssessmentResultV3 {
  const trend = env.atmospheric.airTempTrend3Day.value;
  const dirF = env.atmospheric.airTempTrendDirectionF.value;
  const airTemp = env.atmospheric.airTempF.value;

  if (trend == null && dirF == null) {
    return {
      variableId: 'air_temp_trend',
      componentScore: 50,
      stateLabel: 'air_temp_trend_unknown',
      tags: ['air_temp_trend_data_unavailable'],
      direction: 'neutral',
      applicable: true,
      hasData: false,
    };
  }

  // Heat stress from air temp (measured) — not water temp
  const inHeatStress = airTemp != null && airTemp >= 90;

  let score: number;
  let stateLabel: string;
  let tags: string[];
  let direction: 'positive' | 'negative' | 'neutral';

  const t = (trend ?? '').toLowerCase();
  if (t.includes('warming') || t.includes('rising')) {
    score = inHeatStress ? 38 : 58;
    stateLabel = inHeatStress ? 'warming_in_heat' : 'warming_trend';
    tags = inHeatStress ? ['warming', 'heat_stress_from_air'] : ['warming_trend'];
    direction = inHeatStress ? 'negative' : 'neutral';
  } else if (t.includes('cooling') || t.includes('falling')) {
    score = 68;
    stateLabel = 'cooling_trend';
    tags = ['cooling_trend', 'often_favorable'];
    direction = 'positive';
  } else if (t.includes('stable') || t === '') {
    score = 62;
    stateLabel = 'stable_air_temp';
    tags = ['stable_temperature'];
    direction = 'neutral';
  } else {
    score = 55;
    stateLabel = 'air_temp_trend_mixed';
    tags = ['air_temp_trend'];
    direction = 'neutral';
  }

  return {
    variableId: 'air_temp_trend',
    componentScore: Math.max(0, Math.min(100, score)),
    stateLabel,
    tags,
    direction,
    applicable: true,
    hasData: true,
  };
}

// ---------------------------------------------------------------------------
// Pressure — from pressureMb, pressureTrend, pressureChangeRateMbHr
// ---------------------------------------------------------------------------

type PressureTrendLabel = 'rapidly_falling' | 'slowly_falling' | 'stable' | 'slowly_rising' | 'rapidly_rising' | 'unknown';

function getPressureTrend(env: NormalizedEnvironmentV3): PressureTrendLabel {
  const rate = env.atmospheric.pressureChangeRateMbHr.value;
  const trendStr = env.atmospheric.pressureTrend.value;
  if (trendStr) {
    const m: Record<string, PressureTrendLabel> = {
      rapidly_falling: 'rapidly_falling',
      slowly_falling: 'slowly_falling',
      stable: 'stable',
      slowly_rising: 'slowly_rising',
      rapidly_rising: 'rapidly_rising',
    };
    if (m[trendStr]) return m[trendStr];
  }
  if (rate != null) {
    if (rate < -0.8) return 'rapidly_falling';
    if (rate < -0.2) return 'slowly_falling';
    if (rate <= 0.2) return 'stable';
    if (rate <= 0.8) return 'slowly_rising';
    return 'rapidly_rising';
  }
  return 'unknown';
}

function assessPressure(env: NormalizedEnvironmentV3, ctx: GeoContextV3): AssessmentResultV3 {
  const trend = getPressureTrend(env);
  const pressureMb = env.atmospheric.pressureMb.value;
  const mode = ctx.environmentMode;

  // Level modifier
  let levelMod = 0;
  if (pressureMb != null) {
    if (pressureMb < 990) levelMod = -8;
    else if (pressureMb < 1005) levelMod = -3;
    else if (pressureMb > 1035) levelMod = -5;
    else if (pressureMb > 1025) levelMod = 3;
  }

  let baseScore: number;
  let stateLabel: string;
  let tags: string[];
  let direction: 'positive' | 'negative' | 'neutral';

  switch (trend) {
    case 'rapidly_rising':
      baseScore = 22;
      stateLabel = 'post_front_pressure_spike';
      tags = ['post_front_lockdown', 'sharply_rising_pressure'];
      direction = 'negative';
      break;
    case 'slowly_rising':
      baseScore = 52;
      stateLabel = 'stabilizing_after_front';
      tags = ['pressure_recovering'];
      direction = 'neutral';
      break;
    case 'stable':
      baseScore = 72;
      stateLabel = 'stable_pressure';
      tags = ['stable_pressure', 'fish_adapted'];
      direction = 'positive';
      break;
    case 'slowly_falling':
      baseScore = 78;
      stateLabel = 'falling_pressure_feeding_window';
      tags = ['falling_pressure', 'pre_front_feeding_pickup'];
      direction = 'positive';
      break;
    case 'rapidly_falling':
      baseScore = 30;
      stateLabel = 'rapid_pressure_fall_front_incoming';
      tags = ['rapid_pressure_drop', 'front_approaching'];
      direction = 'negative';
      break;
    default:
      baseScore = 48;
      stateLabel = 'pressure_trend_unknown';
      tags = ['pressure_data_limited'];
      direction = 'neutral';
      break;
  }

  const mult = mode === 'freshwater_river' ? 0.85 : 1.0;
  const score = Math.max(0, Math.min(100, Math.round((baseScore + levelMod - 50) * mult + 50)));

  return {
    variableId: 'pressure',
    componentScore: score,
    stateLabel,
    tags,
    direction,
    applicable: true,
    hasData: pressureMb != null || trend !== 'unknown',
  };
}

// ---------------------------------------------------------------------------
// Wind
// ---------------------------------------------------------------------------

function assessWind(env: NormalizedEnvironmentV3, ctx: GeoContextV3): AssessmentResultV3 {
  const speedMph = env.atmospheric.windSpeedMph.value;
  const mode = ctx.environmentMode;
  const isCoastal = ctx.waterType === 'saltwater' || ctx.waterType === 'brackish';

  if (speedMph == null) {
    return {
      variableId: 'wind',
      componentScore: 52,
      stateLabel: 'wind_data_unavailable',
      tags: ['wind_speed_unknown'],
      direction: 'neutral',
      applicable: true,
      hasData: false,
    };
  }

  let score: number;
  let stateLabel: string;
  let tags: string[];
  let direction: 'positive' | 'negative' | 'neutral';

  if (speedMph <= 5) {
    if (isCoastal) {
      score = 48;
      stateLabel = 'dead_calm_coastal';
      tags = ['glass_calm_coastal', 'reduced_water_movement'];
      direction = 'neutral';
    } else if (mode === 'freshwater_lake') {
      score = 55;
      stateLabel = 'calm_lake';
      tags = ['calm_surface'];
      direction = 'neutral';
    } else {
      score = 62;
      stateLabel = 'calm_river';
      tags = ['calm_conditions'];
      direction = 'neutral';
    }
  } else if (speedMph <= 12) {
    score = isCoastal ? 72 : mode === 'freshwater_river' ? 65 : 75;
    stateLabel = 'light_favorable_wind';
    tags = ['light_wind'];
    direction = 'positive';
  } else if (speedMph <= 20) {
    score = isCoastal ? 72 : mode === 'freshwater_river' ? 58 : 62;
    stateLabel = 'moderate_wind';
    tags = ['moderate_wind'];
    direction = isCoastal ? 'positive' : 'neutral';
  } else if (speedMph <= 28) {
    score = 40;
    stateLabel = 'heavy_wind';
    tags = ['heavy_wind', 'rough_water'];
    direction = 'negative';
  } else {
    score = Math.max(5, 28 - Math.max(0, speedMph - 32) * 2);
    stateLabel = 'strong_wind_suppression';
    tags = ['dangerous_wind', 'fishing_significantly_impaired'];
    direction = 'negative';
  }

  return {
    variableId: 'wind',
    componentScore: Math.max(0, Math.min(100, score)),
    stateLabel,
    tags,
    direction,
    applicable: true,
    hasData: true,
  };
}

// ---------------------------------------------------------------------------
// Cloud cover / light — no thermal state for freshwater (no water temp)
// Use air temp as proxy for heat stress when air is very hot
// ---------------------------------------------------------------------------

function assessCloudCoverLight(env: NormalizedEnvironmentV3, _ctx: GeoContextV3): AssessmentResultV3 {
  const cloudPct = env.atmospheric.cloudCoverPct.value;
  const airTemp = env.atmospheric.airTempF.value;
  const inHeatStress = airTemp != null && airTemp >= 90;

  if (cloudPct == null) {
    return {
      variableId: 'cloud_cover_light',
      componentScore: 52,
      stateLabel: 'light_condition_unknown',
      tags: ['cloud_cover_data_unavailable'],
      direction: 'neutral',
      applicable: true,
      hasData: false,
    };
  }

  let score: number;
  let stateLabel: string;
  let tags: string[];
  let direction: 'positive' | 'negative' | 'neutral';

  if (cloudPct >= 75) {
    score = 72;
    stateLabel = 'overcast_extended_window';
    tags = ['overcast_light', 'low_light_extends_active_period'];
    direction = 'positive';
  } else if (cloudPct >= 50) {
    score = 68;
    stateLabel = 'mostly_cloudy_favorable';
    tags = ['mixed_cloud_cover', 'soft_light_conditions'];
    direction = 'positive';
  } else if (cloudPct >= 25) {
    score = 58;
    stateLabel = 'partly_cloudy_mixed';
    tags = ['partly_cloudy', 'variable_light_conditions'];
    direction = 'neutral';
  } else if (cloudPct >= 10) {
    score = inHeatStress ? 38 : 50;
    stateLabel = inHeatStress ? 'bright_light_in_heat' : 'mostly_clear_sky';
    tags = inHeatStress ? ['bright_clear_sky', 'heat_stress_from_air'] : ['mostly_clear'];
    direction = inHeatStress ? 'negative' : 'neutral';
  } else {
    score = inHeatStress ? 27 : 42;
    stateLabel = inHeatStress ? 'full_sun_heat_compounded' : 'bright_full_sun';
    tags = inHeatStress ? ['full_sun', 'heat_stress_compounded'] : ['full_sun', 'activity_concentrated_dawn_dusk'];
    direction = 'negative';
  }

  return {
    variableId: 'cloud_cover_light',
    componentScore: Math.max(0, Math.min(100, score)),
    stateLabel,
    tags,
    direction,
    applicable: true,
    hasData: true,
  };
}

// ---------------------------------------------------------------------------
// Precipitation
// ---------------------------------------------------------------------------

function assessPrecipitation(env: NormalizedEnvironmentV3, ctx: GeoContextV3): AssessmentResultV3 {
  const p48 = env.precipitation.precip48hrInches.value ?? 0;
  const p7 = env.precipitation.precip7dayInches.value ?? 0;
  const current = env.precipitation.currentPrecipInHr.value ?? 0;
  const mode = ctx.environmentMode;

  let category: 'none' | 'light' | 'moderate' | 'heavy' | 'active';
  if (current > 0.1) category = 'active';
  else if (p48 > 2.0) category = 'heavy';
  else if (p48 > 0.75) category = 'moderate';
  else if (p48 > 0.1) category = 'light';
  else category = 'none';

  const saturated = p7 > 4.0;
  const isRiver = mode === 'freshwater_river';
  const isBrackish = mode === 'brackish';

  let score: number;
  let stateLabel: string;
  let tags: string[];
  let direction: 'positive' | 'negative' | 'neutral';

  switch (category) {
    case 'none':
      score = 62;
      stateLabel = 'dry_stable_conditions';
      tags = ['no_recent_precipitation'];
      direction = 'neutral';
      break;
    case 'light':
      score = 60;
      stateLabel = 'light_recent_rain';
      tags = ['light_recent_rain'];
      direction = 'neutral';
      break;
    case 'active':
      score = isRiver || isBrackish ? 35 : 48;
      stateLabel = 'active_rain_suppression';
      tags = ['active_rainfall'];
      direction = 'negative';
      break;
    case 'moderate':
      score = isRiver ? 42 : isBrackish ? 42 : 50;
      if (saturated) score -= 6;
      score = Math.max(25, score);
      stateLabel = isRiver ? 'moderate_rain_river_affected' : 'moderate_recent_rain';
      tags = ['moderate_recent_rain'];
      direction = isRiver || isBrackish ? 'negative' : 'neutral';
      break;
    case 'heavy':
      score = isRiver ? 28 : isBrackish ? 28 : 40;
      if (saturated) score -= 8;
      score = Math.max(18, score);
      stateLabel = isRiver ? 'heavy_rain_runoff_suppression' : 'heavy_recent_rain';
      tags = ['heavy_recent_rain'];
      direction = 'negative';
      break;
    default:
      score = 52;
      stateLabel = 'precipitation_data_unavailable';
      tags = ['precipitation_history_not_available'];
      direction = 'neutral';
      break;
  }

  // Unknown when no precip data
  const hasData = p48 > 0 || p7 > 0 || current > 0 || (p48 === 0 && p7 === 0 && env.precipitation.precip48hrInches.provenance !== 'missing');

  return {
    variableId: 'precipitation',
    componentScore: Math.max(0, Math.min(100, score)),
    stateLabel,
    tags,
    direction,
    applicable: true,
    hasData: env.precipitation.precip48hrInches.provenance !== 'missing' || env.precipitation.precip7dayInches.provenance !== 'missing',
  };
}

// ---------------------------------------------------------------------------
// Solunar / moon
// ---------------------------------------------------------------------------

function parseTimeMinutes(timeStr: string | null | undefined): number | null {
  if (!timeStr) return null;
  const match = String(timeStr).match(/(\d{1,2}):(\d{2})/);
  if (!match) return null;
  return parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
}

function assessSolunarMoon(env: NormalizedEnvironmentV3, _ctx: GeoContextV3): AssessmentResultV3 {
  const major = env.lunar_solunar.solunarMajorPeriods ?? [];
  const minor = env.lunar_solunar.solunarMinorPeriods ?? [];
  const tzHours = env.geo.tzOffsetHours ?? 0;
  const nowLocalMinutes = ((new Date().getUTCHours() * 60 + new Date().getUTCMinutes() + tzHours * 60) % 1440 + 1440) % 1440;

  let solunarSupport: 'major_active' | 'minor_active' | 'approaching_major' | 'none' | 'unknown' = 'unknown';
  if (major.length > 0 || minor.length > 0) {
    for (const p of major) {
      const start = parseTimeMinutes(p.startLocal);
      const end = parseTimeMinutes(p.endLocal);
      if (start != null && end != null) {
        if (nowLocalMinutes >= start && nowLocalMinutes <= end) solunarSupport = 'major_active';
        else if (nowLocalMinutes >= start - 45 && nowLocalMinutes < start) solunarSupport = 'approaching_major';
      }
    }
    if (solunarSupport === 'unknown') {
      for (const p of minor) {
        const start = parseTimeMinutes(p.startLocal);
        const end = parseTimeMinutes(p.endLocal);
        if (start != null && end != null && nowLocalMinutes >= start && nowLocalMinutes <= end) {
          solunarSupport = 'minor_active';
          break;
        }
      }
    }
    if (solunarSupport === 'unknown') solunarSupport = 'none';
  }

  let baseScore: number;
  let stateLabel: string;
  let tags: string[];

  switch (solunarSupport) {
    case 'major_active':
      baseScore = 72;
      stateLabel = 'solunar_major_period_active';
      tags = ['solunar_major_period_active'];
      break;
    case 'approaching_major':
      baseScore = 65;
      stateLabel = 'solunar_major_approaching';
      tags = ['solunar_major_approaching'];
      break;
    case 'minor_active':
      baseScore = 60;
      stateLabel = 'solunar_minor_period_active';
      tags = ['solunar_minor_period_active'];
      break;
    case 'none':
      baseScore = 50;
      stateLabel = 'between_solunar_periods';
      tags = ['between_solunar_periods'];
      break;
    default:
      baseScore = 50;
      stateLabel = 'solunar_data_unavailable';
      tags = ['solunar_data_unavailable'];
      break;
  }

  const phase = env.lunar_solunar.moonPhase.value;
  const phaseAdj = phase && (String(phase).toLowerCase().includes('new') || String(phase).toLowerCase().includes('full')) ? 5 : 0;
  const score = Math.max(45, Math.min(77, baseScore + phaseAdj));

  return {
    variableId: 'solunar_moon',
    componentScore: score,
    stateLabel,
    tags,
    direction: score >= 65 ? 'positive' : score <= 48 ? 'negative' : 'neutral',
    applicable: true,
    hasData: major.length > 0 || minor.length > 0,
  };
}

// ---------------------------------------------------------------------------
// Daylight / time of day — from sunrise/sunset
// Heat stress from air temp (measured), not water temp
// ---------------------------------------------------------------------------

function assessDaylightTimeOfDay(env: NormalizedEnvironmentV3, ctx: GeoContextV3): AssessmentResultV3 {
  const sunrise = parseTimeMinutes(env.light_daylight.sunriseLocal.value);
  const sunset = parseTimeMinutes(env.light_daylight.sunsetLocal.value);
  const twilightBegin = parseTimeMinutes(env.light_daylight.civilTwilightBegin.value);
  const twilightEnd = parseTimeMinutes(env.light_daylight.civilTwilightEnd.value);
  const tzHours = env.geo.tzOffsetHours ?? 0;
  const nowLocalMinutes = ((new Date().getUTCHours() * 60 + new Date().getUTCMinutes() + tzHours * 60) % 1440 + 1440) % 1440;
  const airTemp = env.atmospheric.airTempF.value;
  const inHeatStress = airTemp != null && airTemp >= 90;
  const cloudPct = env.atmospheric.cloudCoverPct.value;
  const overcast = cloudPct != null && cloudPct >= 50;
  const brightSun = cloudPct != null && cloudPct < 25;

  if (sunrise == null || sunset == null) {
    return {
      variableId: 'daylight_time_of_day',
      componentScore: 52,
      stateLabel: 'time_of_day_unknown',
      tags: ['time_of_day_cannot_be_determined'],
      direction: 'neutral',
      applicable: true,
      hasData: false,
    };
  }

  const preDawnStart = twilightBegin ?? sunrise - 45;
  const dawnEnd = sunrise + 30;
  const earlyMorningEnd = sunrise + 150;
  const lateAfternoonStart = sunset - 180;
  const duskStart = sunset - 30;
  const duskEnd = twilightEnd ?? sunset + 45;
  const eveningEnd = duskEnd + 90;

  let period: string;
  let score: number;
  let stateLabel: string;
  let tags: string[];
  let direction: 'positive' | 'negative' | 'neutral';

  if (nowLocalMinutes < preDawnStart) {
    period = 'night';
    score = 48;
    stateLabel = 'night_limited_data';
    tags = ['night'];
    direction = 'neutral';
  } else if (nowLocalMinutes < dawnEnd) {
    period = 'dawn';
    score = 82;
    stateLabel = 'dawn_prime_window';
    tags = ['dawn_window', 'low_light_peak'];
    direction = 'positive';
  } else if (nowLocalMinutes < earlyMorningEnd) {
    period = 'early_morning';
    score = overcast ? 72 : 68;
    stateLabel = 'early_morning_good_window';
    tags = ['early_morning'];
    direction = 'positive';
  } else if (nowLocalMinutes < lateAfternoonStart) {
    period = 'midday';
    score = overcast ? 58 : brightSun && inHeatStress ? 28 : brightSun ? 38 : 45;
    stateLabel = brightSun && inHeatStress ? 'midday_heat_suppression' : 'midday_window';
    tags = ['midday'];
    direction = brightSun && !overcast ? 'negative' : 'neutral';
  } else if (nowLocalMinutes < duskStart) {
    period = 'late_afternoon';
    score = overcast ? 65 : 60;
    stateLabel = 'late_afternoon_improving';
    tags = ['late_afternoon'];
    direction = 'neutral';
  } else if (nowLocalMinutes < duskEnd) {
    period = 'dusk';
    score = 80;
    stateLabel = 'dusk_prime_window';
    tags = ['dusk_window', 'low_light_peak'];
    direction = 'positive';
  } else if (nowLocalMinutes < eveningEnd) {
    period = 'evening';
    score = ctx.waterType === 'saltwater' || ctx.waterType === 'brackish' ? 62 : 52;
    stateLabel = 'evening_winding_down';
    tags = ['evening'];
    direction = 'neutral';
  } else {
    period = 'night';
    score = 48;
    stateLabel = 'night_limited_data';
    tags = ['night'];
    direction = 'neutral';
  }

  return {
    variableId: 'daylight_time_of_day',
    componentScore: Math.max(0, Math.min(100, score)),
    stateLabel,
    tags,
    direction,
    applicable: true,
    hasData: true,
  };
}

// ---------------------------------------------------------------------------
// Tide / current — brackish and saltwater only; river uses precip proxy
// ---------------------------------------------------------------------------

function assessTideCurrent(env: NormalizedEnvironmentV3, ctx: GeoContextV3): AssessmentResultV3 {
  const mode = ctx.environmentMode;

  if (mode === 'freshwater_lake') {
    return {
      variableId: 'tide_current',
      componentScore: 55,
      stateLabel: 'tide_not_applicable_lake',
      tags: ['tide_not_applicable'],
      direction: 'neutral',
      applicable: false,
      hasData: false,
    };
  }

  if (mode === 'freshwater_river') {
    const p48 = env.precipitation.precip48hrInches.value ?? 0;
    const p7 = env.precipitation.precip7dayInches.value ?? 0;
    let score: number;
    let stateLabel: string;
    let tags: string[];
    if (p48 > 2.0 || p7 > 5.0) {
      score = 30;
      stateLabel = 'elevated_flow_likely';
      tags = ['elevated_river_flow', 'inferred_from_rain_history'];
    } else if (p48 > 0.75) {
      score = 48;
      stateLabel = 'mildly_elevated_flow';
      tags = ['flow_may_be_slightly_elevated'];
    } else {
      score = 62;
      stateLabel = 'normal_river_flow_inferred';
      tags = ['stable_river_flow_inferred'];
    }
    return {
      variableId: 'tide_current',
      componentScore: Math.max(0, Math.min(100, score)),
      stateLabel,
      tags,
      direction: score < 45 ? 'negative' : 'neutral',
      applicable: true,
      hasData: true,
    };
  }

  // Brackish / saltwater
  const preds = env.marine_tide.tidePredictionsToday ?? [];
  const tzHours = env.geo.tzOffsetHours ?? 0;
  const nowLocalMinutes = ((new Date().getUTCHours() * 60 + new Date().getUTCMinutes() + tzHours * 60) % 1440 + 1440) % 1440;

  if (preds.length < 2) {
    return {
      variableId: 'tide_current',
      componentScore: 52,
      stateLabel: 'tide_stage_unknown',
      tags: ['tide_data_limited'],
      direction: 'neutral',
      applicable: true,
      hasData: false,
    };
  }

  type TideEvent = { minutesSinceMidnight: number; type: 'H' | 'L' };
  const events: TideEvent[] = [];
  for (const p of preds) {
    const m = parseTimeMinutes(p.timeLocal);
    if (m != null) events.push({ minutesSinceMidnight: m, type: p.type });
  }
  events.sort((a, b) => a.minutesSinceMidnight - b.minutesSinceMidnight);

  let prev: TideEvent | null = null;
  let next: TideEvent | null = null;
  for (const e of events) {
    if (e.minutesSinceMidnight <= nowLocalMinutes) prev = e;
    else if (next == null) next = e;
  }
  if (prev == null && next) prev = events[events.length - 1];
  if (prev == null || next == null) {
    return {
      variableId: 'tide_current',
      componentScore: 52,
      stateLabel: 'tide_stage_unknown',
      tags: ['tide_data_limited'],
      direction: 'neutral',
      applicable: true,
      hasData: false,
    };
  }

  const minsSincePrev = (nowLocalMinutes - prev.minutesSinceMidnight + 1440) % 1440;
  const minsToNext = (next.minutesSinceMidnight - nowLocalMinutes + 1440) % 1440;

  let stage: string;
  let score: number;
  let stateLabel: string;
  let tags: string[];
  let direction: 'positive' | 'negative' | 'neutral';

  if (prev.type === 'H') {
    if (minsSincePrev <= 30) {
      stage = 'dead_slack_high';
      score = 28;
      stateLabel = 'dead_slack_high_water';
      tags = ['slack_water', 'minimal_movement'];
      direction = 'negative';
    } else if (minsToNext <= 90) {
      stage = 'approaching_low';
      score = 64;
      stateLabel = 'approaching_low_tide';
      tags = ['approaching_low', 'movement_slowing'];
      direction = 'neutral';
    } else {
      stage = 'outgoing';
      score = 74;
      stateLabel = 'outgoing_tide';
      tags = ['outgoing_tide', 'good_water_movement'];
      direction = 'positive';
    }
  } else {
    if (minsSincePrev <= 30) {
      stage = 'dead_slack_low';
      score = 30;
      stateLabel = 'dead_slack_low_water';
      tags = ['slack_water', 'minimal_movement'];
      direction = 'negative';
    } else if (minsToNext <= 90) {
      stage = 'peak_incoming';
      score = 85;
      stateLabel = 'peak_incoming_tide';
      tags = ['peak_incoming_tide', 'strong_water_movement'];
      direction = 'positive';
    } else {
      stage = 'incoming';
      score = 76;
      stateLabel = 'incoming_tide';
      tags = ['incoming_tide', 'good_water_movement'];
      direction = 'positive';
    }
  }

  return {
    variableId: 'tide_current',
    componentScore: Math.max(0, Math.min(100, score)),
    stateLabel,
    tags,
    direction,
    applicable: true,
    hasData: true,
  };
}

// ---------------------------------------------------------------------------
// Coastal water temp — only when measured and coastal
// ---------------------------------------------------------------------------

function assessCoastalWaterTemp(env: NormalizedEnvironmentV3, ctx: GeoContextV3): AssessmentResultV3 {
  const mode = ctx.environmentMode;
  const isCoastal = mode === 'brackish' || mode === 'saltwater';
  const tempF = env.water_temperature.coastalMeasuredF.value;

  if (!isCoastal) {
    return {
      variableId: 'coastal_water_temp',
      componentScore: 55,
      stateLabel: 'coastal_temp_not_applicable',
      tags: ['coastal_temp_not_applicable'],
      direction: 'neutral',
      applicable: false,
      hasData: false,
    };
  }

  if (tempF == null) {
    return {
      variableId: 'coastal_water_temp',
      componentScore: 50,
      stateLabel: 'coastal_water_temp_unavailable',
      tags: ['coastal_water_temp_not_measured'],
      direction: 'neutral',
      applicable: true,
      hasData: false,
    };
  }

  // Coastal thermal band: 45–92°F comfort
  let score: number;
  let stateLabel: string;
  let tags: string[];
  let direction: 'positive' | 'negative' | 'neutral';

  if (tempF < 45) {
    score = 35;
    stateLabel = 'cold_water_coastal';
    tags = ['cold_water', 'reduced_activity'];
    direction = 'negative';
  } else if (tempF >= 65 && tempF <= 80) {
    score = 78;
    stateLabel = 'optimal_coastal_temp';
    tags = ['optimal_water_temp', 'peak_activity'];
    direction = 'positive';
  } else if (tempF >= 55 && tempF < 65) {
    score = 68;
    stateLabel = 'cool_coastal_temp';
    tags = ['cool_water', 'good_conditions'];
    direction = 'positive';
  } else if (tempF > 80 && tempF < 87) {
    score = 58;
    stateLabel = 'warm_coastal_temp';
    tags = ['warm_water', 'moderate_activity'];
    direction = 'neutral';
  } else if (tempF >= 87) {
    score = 38;
    stateLabel = 'hot_water_coastal';
    tags = ['hot_water', 'heat_stress'];
    direction = 'negative';
  } else {
    score = 62;
    stateLabel = 'coastal_temp_acceptable';
    tags = ['coastal_water_temp'];
    direction = 'neutral';
  }

  return {
    variableId: 'coastal_water_temp',
    componentScore: Math.max(0, Math.min(100, score)),
    stateLabel,
    tags,
    direction,
    applicable: true,
    hasData: true,
  };
}

// ---------------------------------------------------------------------------
// Run all assessments for a given mode
// ---------------------------------------------------------------------------

export function runAssessmentsV3(
  env: NormalizedEnvironmentV3,
  ctx: GeoContextV3
): Map<ScoreVariableId, AssessmentResultV3> {
  const mode = ctx.environmentMode;
  const results = new Map<ScoreVariableId, AssessmentResultV3>();

  const air = assessAirTempTrend(env, ctx);
  results.set('air_temp_trend', air);

  const pressure = assessPressure(env, ctx);
  results.set('pressure', pressure);

  const wind = assessWind(env, ctx);
  results.set('wind', wind);

  const cloud = assessCloudCoverLight(env, ctx);
  results.set('cloud_cover_light', cloud);

  const precip = assessPrecipitation(env, ctx);
  results.set('precipitation', precip);

  const solunar = assessSolunarMoon(env, ctx);
  results.set('solunar_moon', solunar);

  const daylight = assessDaylightTimeOfDay(env, ctx);
  results.set('daylight_time_of_day', daylight);

  const tide = assessTideCurrent(env, ctx);
  results.set('tide_current', tide);

  const coastal = assessCoastalWaterTemp(env, ctx);
  results.set('coastal_water_temp', coastal);

  return results;
}
