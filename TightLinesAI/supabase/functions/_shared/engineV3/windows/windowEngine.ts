// =============================================================================
// ENGINE V3 — Time Window Engine
// Phase 4: Context-sensitive windows, regime gating, measured drivers only.
// No inferred freshwater water temp. Historical context as nuance only.
// =============================================================================

import type {
  NormalizedEnvironmentV3,
  GeoContextV3,
  RegimeV3,
  ScoreEngineResultV3,
  WindowBlockV3,
  WindowBlockIdV3,
  WindowQualityV3,
  WindowEngineResultV3,
  WindowInfluenceSourceV3,
} from '../types.ts';
import type { WindowContextProfile } from './windowContextProfiles.ts';
import { getWindowContextProfile } from './windowContextProfiles.ts';

// ---------------------------------------------------------------------------
// Time block definition
// ---------------------------------------------------------------------------

interface TimeBlockDef {
  id: WindowBlockIdV3;
  label: string;
  startMinutes: number;
  endMinutes: number;
  baseTodScore: number;
}

function parseTimeMinutes(timeStr: string | null | undefined): number | null {
  if (!timeStr) return null;
  const match = String(timeStr).match(/(\d{1,2}):(\d{2})/);
  if (!match) return null;
  return parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
}

function minutesToHHMM(minutes: number): string {
  const clamped = ((minutes % 1440) + 1440) % 1440;
  const rounded = Math.round(clamped / 15) * 15;
  const finalMinutes = rounded % 1440;
  const h = Math.floor(finalMinutes / 60);
  const m = finalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function buildTimeBlocks(env: NormalizedEnvironmentV3): TimeBlockDef[] {
  const sunrise = parseTimeMinutes(env.light_daylight.sunriseLocal.value) ?? 360;
  const sunset = parseTimeMinutes(env.light_daylight.sunsetLocal.value) ?? 1140;
  const twilightBegin = parseTimeMinutes(env.light_daylight.civilTwilightBegin.value) ?? sunrise - 30;
  const twilightEnd = parseTimeMinutes(env.light_daylight.civilTwilightEnd.value) ?? sunset + 30;

  const preDawnStart = Math.max(0, twilightBegin - 30);
  const dawnEnd = sunrise + 30;
  const morningEnd = sunrise + 150;
  const afternoonStart = sunset - 180;
  const duskStart = sunset - 30;
  const eveningEnd = Math.min(1439, twilightEnd + 90);

  return [
    { id: 'pre_dawn', label: 'pre-dawn', startMinutes: preDawnStart, endMinutes: twilightBegin, baseTodScore: 52 },
    { id: 'dawn', label: 'dawn', startMinutes: twilightBegin, endMinutes: dawnEnd, baseTodScore: 82 },
    { id: 'morning', label: 'morning', startMinutes: dawnEnd, endMinutes: morningEnd, baseTodScore: 72 },
    { id: 'midday', label: 'midday', startMinutes: morningEnd, endMinutes: afternoonStart, baseTodScore: 45 },
    { id: 'afternoon', label: 'afternoon', startMinutes: afternoonStart, endMinutes: duskStart, baseTodScore: 58 },
    { id: 'dusk', label: 'dusk', startMinutes: duskStart, endMinutes: twilightEnd, baseTodScore: 80 },
    { id: 'evening', label: 'evening', startMinutes: twilightEnd, endMinutes: eveningEnd, baseTodScore: 50 },
    { id: 'night', label: 'night', startMinutes: eveningEnd, endMinutes: 1439, baseTodScore: 30 },
  ];
}

// ---------------------------------------------------------------------------
// Regime gating — how much secondary/tertiary can influence windows
// ---------------------------------------------------------------------------

const REGIME_TIER_STRENGTH: Record<RegimeV3, { secondary: number; tertiary: number }> = {
  supportive: { secondary: 1.25, tertiary: 1.35 },
  neutral: { secondary: 1.0, tertiary: 1.0 },
  suppressive: { secondary: 0.6, tertiary: 0.3 },
  highly_suppressive: { secondary: 0.3, tertiary: 0.1 },
};

// ---------------------------------------------------------------------------
// Tide overlap modifier (coastal only) — measured tide data
// ---------------------------------------------------------------------------

function computeTideOverlapModifier(
  block: TimeBlockDef,
  env: NormalizedEnvironmentV3
): { modifier: number; reason: string | null; isMajor: boolean } {
  const preds = env.marine_tide.tidePredictionsToday ?? [];
  if (preds.length < 2) return { modifier: 0, reason: null, isMajor: false };

  type TideEvent = { minutesSinceMidnight: number; type: 'H' | 'L' };
  const events: TideEvent[] = [];
  for (const p of preds) {
    const m = parseTimeMinutes(p.timeLocal);
    if (m != null) events.push({ minutesSinceMidnight: m, type: p.type });
  }
  events.sort((a, b) => a.minutesSinceMidnight - b.minutesSinceMidnight);

  const blockMid = (block.startMinutes + block.endMinutes) / 2;
  let prev: TideEvent | null = null;
  let next: TideEvent | null = null;
  for (const e of events) {
    if (e.minutesSinceMidnight <= blockMid) prev = e;
    else if (next == null) next = e;
  }
  if (prev == null && next) prev = events[events.length - 1];
  if (prev == null || next == null) return { modifier: 0, reason: null, isMajor: false };

  const minsSincePrev = (blockMid - prev.minutesSinceMidnight + 1440) % 1440;
  const minsToNext = (next.minutesSinceMidnight - blockMid + 1440) % 1440;
  const cycleLen = minsSincePrev + minsToNext;
  const positionFrac = cycleLen > 0 ? minsSincePrev / cycleLen : 0.5;
  const movementStrength = Math.sin(Math.PI * positionFrac);
  const nearSlack = minsSincePrev < 45 || minsToNext < 45;

  if (nearSlack) {
    return { modifier: -22, reason: 'dead_slack_water', isMajor: true };
  }
  if (movementStrength > 0.75) {
    const label = prev.type === 'L' ? 'peak_incoming_tide' : 'peak_outgoing_tide';
    return { modifier: 28, reason: label, isMajor: true };
  }
  if (movementStrength > 0.4) {
    const label = prev.type === 'L' ? 'incoming_tide' : 'outgoing_tide';
    return { modifier: 15, reason: label, isMajor: true };
  }
  return { modifier: 5, reason: 'moderate_tidal_movement', isMajor: false };
}

// ---------------------------------------------------------------------------
// Light/cloud modifier — measured cloud cover; heat from air temp (measured)
// ---------------------------------------------------------------------------

function computeLightModifier(
  block: TimeBlockDef,
  cloudPct: number | null,
  inHeatStress: boolean,
  ctxProfile: WindowContextProfile
): number {
  const cloud = cloudPct ?? 50;

  if (block.id === 'midday') {
    if (!ctxProfile.cloudCanImproveMidday) return 0;
    if (cloud >= 75) return 12;
    if (cloud >= 50) return 5;
    if (cloud < 20 && inHeatStress) return -15;
    if (cloud < 20) return -8;
    return 0;
  }

  if (block.id === 'dawn' || block.id === 'dusk') return 0;
  if (cloud >= 75) return 5;
  return 0;
}

// ---------------------------------------------------------------------------
// Air-temp context modifier — NO water temp; use air temp for heat/cold proxy
// Cold: warming midday helps. Hot: low-light helps. Measured air only.
// ---------------------------------------------------------------------------

function computeAirTempContextModifier(
  block: TimeBlockDef,
  airTempF: number | null,
  ctxProfile: WindowContextProfile
): number {
  if (airTempF == null) return 0;

  const inHeatStress = airTempF >= 90;
  const inColdContext = airTempF <= 45;

  if (inHeatStress) {
    if (block.id === 'midday') return -20;
    if (block.id === 'afternoon') return -12;
    if (block.id === 'dawn' || block.id === 'dusk') return 0;
    return -8;
  }

  if (inColdContext && ctxProfile.favorsWarmingPeriods) {
    if (block.id === 'midday' || block.id === 'afternoon') return 8;
    if (block.id === 'dawn' || block.id === 'pre_dawn') return -15;
    if (block.id === 'night') return -12;
    return -5;
  }

  if (ctxProfile.favorsLowLightPeriods && (block.id === 'dawn' || block.id === 'dusk')) {
    return 5;
  }

  return 0;
}

// ---------------------------------------------------------------------------
// Pressure modifier — from score contributions
// ---------------------------------------------------------------------------

function computePressureModifier(scoreResult: ScoreEngineResultV3): number {
  const pressure = scoreResult.contributions.find((c) => c.variableId === 'pressure');
  if (!pressure?.applicable) return 0;
  if (pressure.stateLabel === 'post_front_pressure_spike') return -25;
  if (pressure.stateLabel === 'rapid_pressure_fall_front_incoming') return 0;
  if (pressure.componentScore >= 72) return 5;
  return 0;
}

// ---------------------------------------------------------------------------
// Wind modifier
// ---------------------------------------------------------------------------

function computeWindModifier(scoreResult: ScoreEngineResultV3): number {
  const wind = scoreResult.contributions.find((c) => c.variableId === 'wind');
  if (!wind?.applicable) return 0;
  if (wind.stateLabel === 'strong_wind_suppression') return -25;
  if (wind.componentScore < 40) return -12;
  if (wind.componentScore < 55) return -5;
  return 0;
}

// ---------------------------------------------------------------------------
// Precip modifier
// ---------------------------------------------------------------------------

function computePrecipModifier(scoreResult: ScoreEngineResultV3): number {
  const precip = scoreResult.contributions.find((c) => c.variableId === 'precipitation');
  if (!precip?.applicable) return 0;
  if (precip.stateLabel.includes('heavy') || precip.stateLabel.includes('active_rain')) return -18;
  if (precip.stateLabel.includes('moderate')) return -8;
  return 0;
}

// ---------------------------------------------------------------------------
// Solunar modifier — regime-gated; never rescues highly suppressive
// ---------------------------------------------------------------------------

function computeSolunarModifier(
  block: TimeBlockDef,
  env: NormalizedEnvironmentV3,
  blockScoreBeforeSolunar: number,
  regime: RegimeV3,
  ctxProfile: WindowContextProfile
): { modifier: number; reason: string | null } {
  const strength = REGIME_TIER_STRENGTH[regime];
  if (!ctxProfile.solunarCanShape) return { modifier: 0, reason: null };
  if (regime === 'highly_suppressive') return { modifier: 0, reason: null };
  if (regime === 'suppressive' && strength.tertiary < 0.5) return { modifier: 0, reason: null };

  const minThreshold = block.id === 'night' ? 25 : 50;
  if (blockScoreBeforeSolunar < minThreshold) return { modifier: 0, reason: null };

  const major = env.lunar_solunar.solunarMajorPeriods ?? [];
  const minor = env.lunar_solunar.solunarMinorPeriods ?? [];

  for (const p of major) {
    const start = parseTimeMinutes(p.startLocal);
    const end = parseTimeMinutes(p.endLocal);
    if (start == null || end == null) continue;
    const overlapStart = Math.max(block.startMinutes, start);
    const overlapEnd = Math.min(block.endMinutes, end);
    if (overlapEnd - overlapStart >= 20) {
      const base = 8;
      const scaled = Math.round(base * strength.tertiary);
      return { modifier: scaled, reason: 'solunar_major_period_overlap' };
    }
  }

  for (const p of minor) {
    const start = parseTimeMinutes(p.startLocal);
    const end = parseTimeMinutes(p.endLocal);
    if (start == null || end == null) continue;
    const overlapStart = Math.max(block.startMinutes, start);
    const overlapEnd = Math.min(block.endMinutes, end);
    if (overlapEnd - overlapStart >= 20) {
      const base = 4;
      const scaled = Math.round(base * strength.tertiary);
      return { modifier: scaled, reason: 'solunar_minor_period_overlap' };
    }
  }

  return { modifier: 0, reason: null };
}

// ---------------------------------------------------------------------------
// Severe suppression cap
// ---------------------------------------------------------------------------

function getSevereCap(scoreResult: ScoreEngineResultV3): number {
  const wind = scoreResult.contributions.find((c) => c.variableId === 'wind');
  const pressure = scoreResult.contributions.find((c) => c.variableId === 'pressure');
  const precip = scoreResult.contributions.find((c) => c.variableId === 'precipitation');

  if (wind?.stateLabel === 'strong_wind_suppression') return 48;
  if (pressure?.stateLabel === 'post_front_pressure_spike') return 52;
  if (precip?.stateLabel.includes('heavy') || precip?.stateLabel.includes('active_rain')) return 50;

  const airTemp = scoreResult.contributions.find((c) => c.variableId === 'air_temp_trend');
  if (airTemp?.stateLabel.includes('heat') && airTemp.componentScore < 35) return 48;

  return 100;
}

// ---------------------------------------------------------------------------
// Historical context note — nuance only, never substitute
// ---------------------------------------------------------------------------

function buildHistoricalContextNote(
  env: NormalizedEnvironmentV3,
  ctxProfile: WindowContextProfile,
  block: TimeBlockDef
): string | null {
  const hist = env.historical_context_inputs;
  if (!hist.airTempBaseline || !hist.stateResolved) return null;

  const airTemp = env.atmospheric.airTempF.value;
  if (airTemp == null) return null;

  const { avgTempNormalF, rangeLowF, rangeHighF } = hist.airTempBaseline;
  const warmerThanNormal = airTemp > avgTempNormalF + 5;
  const coolerThanNormal = airTemp < avgTempNormalF - 5;

  if (ctxProfile.favorsWarmingPeriods && coolerThanNormal && (block.id === 'midday' || block.id === 'afternoon')) {
    return 'cooler-than-normal conditions; midday warming may offer relative improvement';
  }
  if (ctxProfile.favorsLowLightPeriods && warmerThanNormal && (block.id === 'dawn' || block.id === 'dusk')) {
    return 'warmer-than-normal; low-light windows favored';
  }

  return null;
}

// ---------------------------------------------------------------------------
// Score a single block and build WindowBlockV3
// ---------------------------------------------------------------------------

function scoreBlock(
  block: TimeBlockDef,
  env: NormalizedEnvironmentV3,
  geoContext: GeoContextV3,
  scoreResult: ScoreEngineResultV3,
  ctxProfile: WindowContextProfile,
  severeCap: number
): WindowBlockV3 {
  const regime = scoreResult.regime;

  const airTemp = env.atmospheric.airTempF.value;
  const cloudPct = env.atmospheric.cloudCoverPct.value;
  const inHeatStress = airTemp != null && airTemp >= 90;
  const isCoastal = geoContext.waterType === 'saltwater' || geoContext.waterType === 'brackish';

  let score = block.baseTodScore;
  const reasons: string[] = [];
  const suppressors: string[] = [];
  let primarySummary = '';
  let secondarySummary = '';
  let tertiarySummary = '';
  let shapedMainlyBy: WindowInfluenceSourceV3 = 'primary';
  let tideOverlapMajor = false;

  if (block.id === 'dawn' || block.id === 'dusk') {
    reasons.push('low_light_advantage');
    primarySummary = 'low light and stable conditions support this window';
  } else if (block.id === 'morning') {
    reasons.push('early_morning_activity');
    primarySummary = 'early morning favorable period';
  }

  const lightMod = computeLightModifier(block, cloudPct, inHeatStress, ctxProfile);
  score += lightMod;
  if (lightMod >= 8) {
    reasons.push('overcast_extends_window');
    secondarySummary = (secondarySummary ? secondarySummary + '; ' : '') + 'cloud cover softens midday';
  } else if (lightMod <= -8) {
    suppressors.push('bright_sun_suppresses_midday');
  }

  const airMod = computeAirTempContextModifier(block, airTemp, ctxProfile);
  score += airMod;
  if (airMod >= 5) reasons.push('favorable_air_temp_context');
  else if (airMod <= -15) suppressors.push('heat_or_cold_suppression');

  const pressureMod = computePressureModifier(scoreResult);
  score += pressureMod;
  if (pressureMod <= -15) suppressors.push('post_front_pressure_spike');
  else if (pressureMod >= 5) reasons.push('stable_pressure');

  const precipMod = computePrecipModifier(scoreResult);
  score += precipMod;
  if (precipMod <= -10) suppressors.push('recent_precipitation');

  const windMod = computeWindModifier(scoreResult);
  score += windMod;
  if (windMod <= -12) suppressors.push('wind_degrades_window');

  if (isCoastal && ctxProfile.tidePrimary) {
    const { modifier: tideMod, reason: tideReason, isMajor } = computeTideOverlapModifier(block, env);
    score += tideMod;
    if (tideReason) {
      reasons.push(tideReason);
      if (isMajor) tideOverlapMajor = true;
    }
    if (windMod <= -12) suppressors.push('strong_wind_degrades_tide_window');
  }

  const { modifier: solunarMod, reason: solunarReason } = computeSolunarModifier(
    block,
    env,
    score,
    regime,
    ctxProfile
  );
  score += solunarMod;
  if (solunarReason) {
    reasons.push(solunarReason);
    tertiarySummary = 'solunar overlap gives modest boost';
    if (solunarMod >= 6) shapedMainlyBy = 'tertiary';
  }

  score = Math.min(score, severeCap);
  score = Math.max(0, Math.min(100, Math.round(score)));

  if (tideOverlapMajor && isCoastal) shapedMainlyBy = 'primary';

  const confidence =
    env.data_coverage.variableGroupsMissing.length > 4 ? 'low' :
    env.data_coverage.variableGroupsMissing.length > 2 ? 'medium' : 'high';

  const historicalNote = buildHistoricalContextNote(env, ctxProfile, block);

  const regimeInfluence =
    regime === 'supportive'
      ? 'secondary and tertiary variables can meaningfully shape windows'
      : regime === 'neutral'
        ? 'secondary moderate, tertiary modest'
        : regime === 'suppressive'
          ? 'tertiary muted'
          : 'secondary and tertiary heavily muted';

  const band: WindowQualityV3 =
    score >= 68 ? 'best' : score >= 45 ? 'fair' : 'poor';

  return {
    blockId: block.id,
    label: block.label,
    startLocal: minutesToHHMM(block.startMinutes),
    endLocal: minutesToHHMM(block.endMinutes),
    score,
    band,
    confidence,
    reasons: [...new Set(reasons)].slice(0, 5),
    suppressors: [...new Set(suppressors)].slice(0, 4),
    primaryFactorSummary: primarySummary || 'time-of-day baseline',
    secondaryFactorSummary: secondarySummary || '—',
    tertiaryFactorSummary: tertiarySummary || '—',
    regimeInfluence,
    shapedMainlyBy,
    tideOverlapMajor,
    historicalContextNote: historicalNote,
  };
}

// ---------------------------------------------------------------------------
// Main entry
// ---------------------------------------------------------------------------

export function runWindowEngineV3(
  env: NormalizedEnvironmentV3,
  geoContext: GeoContextV3,
  scoreResult: ScoreEngineResultV3
): WindowEngineResultV3 {
  const ctxProfile = getWindowContextProfile(
    geoContext.region,
    geoContext.month,
    geoContext.environmentMode
  );

  const blocks = buildTimeBlocks(env);
  const severeCap = getSevereCap(scoreResult);

  const scoredBlocks: WindowBlockV3[] = [];
  for (const block of blocks) {
    if (block.endMinutes <= block.startMinutes) continue;
    scoredBlocks.push(
      scoreBlock(block, env, geoContext, scoreResult, ctxProfile, severeCap)
    );
  }

  const bestWindows = scoredBlocks.filter((b) => b.band === 'best');
  const fairWindows = scoredBlocks.filter((b) => b.band === 'fair');
  const poorWindows = scoredBlocks.filter((b) => b.band === 'poor');

  const peakWindowScore = scoredBlocks.reduce((max, b) => Math.max(max, b.score), 0);

  const sortedByScore = [...scoredBlocks].sort((a, b) => b.score - a.score);
  const strongestWindows = sortedByScore.slice(0, 3);
  const weakestWindows = sortedByScore.slice(-3).reverse();

  const keyReasonsForBest = [...new Set(bestWindows.flatMap((w) => w.reasons))].slice(0, 5);
  const keyReasonsForPoor = [...new Set(poorWindows.flatMap((w) => w.suppressors))].slice(0, 5);

  const regimeLimited =
    scoreResult.regime === 'suppressive' || scoreResult.regime === 'highly_suppressive';

  const tideOverlapMajorFactor =
    (geoContext.waterType === 'saltwater' || geoContext.waterType === 'brackish') &&
    bestWindows.some((w) => w.tideOverlapMajor);

  if (bestWindows.length === 0 && fairWindows.length > 0 && scoreResult.overallScore >= 45) {
    const topFair = fairWindows.reduce((max, w) => (w.score > max.score ? w : max), fairWindows[0]);
    topFair.band = 'best';
    bestWindows.push(topFair);
    fairWindows.splice(fairWindows.indexOf(topFair), 1);
  }

  return {
    blocks: scoredBlocks,
    bestWindows,
    fairWindows,
    poorWindows,
    peakWindowScore,
    strongestWindows,
    weakestWindows,
    keyReasonsForBest,
    keyReasonsForPoor,
    regimeLimited,
    tideOverlapMajorFactor,
  };
}
