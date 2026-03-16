// =============================================================================
// ENGINE V2 — Main Entrypoint
// runEngineV2() is the single deterministic engine evaluation function.
//
// Execution order per architecture spec:
//   1. Validate confirmed context
//   2. Normalize raw environment data
//   3. Resolve context (region, seasonal-state, etc.)
//   4. Build reliability summary
//   5. Run assessment modules
//      Phase 4 REAL: thermal, pressure, wind
//      Phase 5 REAL: tempTrend, light, timeOfDay, precipRunoff, tideCurrent, moonSolunar
//   6. Run behavior engine (Phase 5 — full synthesis from all assessments)
//   7. Build opportunity curve / windows (Phase 6 — real time-block engine)
//   8. Compute weighted score from all implemented assessments
//   9. Build LLM-approved payload with real drivers/suppressors
//
// STUB STATUS (as of Phase 6):
//   - weekly forecast: secondary, uses basic heuristics
// =============================================================================

import type {
  HowFishingRequestV2,
  RawEnvironmentData,
  HowFishingEngineOutput,
  LLMApprovedReportPayload,
  AssessmentOutputs,
  BehaviorOutputs,
  ReliabilitySummary,
  ResolvedContext,
  WaterTempSource,
  ActivityState,
  FeedingReadiness,
  PositioningTendency,
  PresentationSpeedBias,
} from './types/contracts.ts';
import { normalizeEnvironment } from './normalization/normalizeEnvironment.ts';
import { resolveContext, validateRequestContext } from './context/resolveContext.ts';
import { buildReliabilitySummary, resolveEffectiveWaterTemp } from './reliability/buildReliability.ts';
import { scoreToScoreBand } from './config/scoreBands.ts';
import { assessThermal } from './assessments/thermal.ts';
import { assessPressure } from './assessments/pressure.ts';
import { assessWind } from './assessments/wind.ts';
import { assessTempTrend } from './assessments/tempTrend.ts';
import { assessLight, classifyLightCondition } from './assessments/light.ts';
import { assessTimeOfDay } from './assessments/timeOfDay.ts';
import { assessPrecipRunoff } from './assessments/precipRunoff.ts';
import { assessTideCurrent } from './assessments/tideCurrent.ts';
import { assessMoonSolunar } from './assessments/moonSolunar.ts';
import { buildOpportunityCurve, deriveTimimgNarrationFacts } from './windows/buildOpportunityCurve.ts';

// ---------------------------------------------------------------------------
// Engine error
// ---------------------------------------------------------------------------

export class EngineV2Error extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'EngineV2Error';
  }
}

// ---------------------------------------------------------------------------
// Phase 5 assessment runner — all modules now have real implementations
// ---------------------------------------------------------------------------

function runAssessments(
  env: ReturnType<typeof normalizeEnvironment>,
  ctx: ResolvedContext,
  reliability: ReliabilitySummary,
  thermalPrelim: ReturnType<typeof assessThermal>,
  pressurePrelim: ReturnType<typeof assessPressure>,
  windPrelim: ReturnType<typeof assessWind>,
  thermalStateLabel: string,
  lightCondition: ReturnType<typeof classifyLightCondition>,
  prelimScore: number
): AssessmentOutputs {
  // Reuse prelim assessments (already computed) to avoid duplicate work
  const thermal = thermalPrelim;
  const pressure = pressurePrelim;
  const wind = windPrelim;
  const tempTrend = assessTempTrend(env, ctx, thermalStateLabel);
  const light = assessLight(env, ctx, thermalStateLabel);
  const timeOfDay = assessTimeOfDay(env, ctx, lightCondition, thermalStateLabel);
  const precipRunoff = assessPrecipRunoff(env, ctx);
  const tideCurrent = assessTideCurrent(env, ctx);
  const moonSolunar = assessMoonSolunar(env, ctx, prelimScore);

  return {
    thermal,
    tempTrend,
    pressure,
    wind,
    light,
    precipRunoff,
    tideCurrent,
    moonSolunar,
    timeOfDay,
  };
}

// ---------------------------------------------------------------------------
// Weighted score composer — Phase 5
//
// Weight philosophy per starter config:
//
// freshwater_lake:
//   thermal(0.28) + pressure(0.18) + wind(0.10) + tempTrend(0.14) +
//   light(0.08) + timeOfDay(0.08) + precipRunoff(0.06) + moonSolunar(0.04) + tideCurrent(0)
//
// freshwater_river:
//   thermal(0.26) + pressure(0.16) + wind(0.08) + tempTrend(0.14) +
//   light(0.06) + timeOfDay(0.08) + precipRunoff(0.08) + moonSolunar(0.04) + tideCurrent(0.10)
//   (river flow inferred from precip; tideCurrent is low-weight river flow proxy)
//
// brackish:
//   tideCurrent(0.28) + thermal(0.16) + pressure(0.14) + wind(0.12) +
//   light(0.06) + timeOfDay(0.06) + precipRunoff(0.08) + tempTrend(0.06) + moonSolunar(0.04)
//
// saltwater:
//   tideCurrent(0.30) + thermal(0.14) + pressure(0.14) + wind(0.12) +
//   light(0.06) + timeOfDay(0.06) + precipRunoff(0.08) + tempTrend(0.06) + moonSolunar(0.04)
//
// All weights sum to 1.0 (verified below).
// ---------------------------------------------------------------------------

interface FullWeightProfile {
  thermal: number;
  tempTrend: number;
  pressure: number;
  wind: number;
  light: number;
  timeOfDay: number;
  precipRunoff: number;
  tideCurrent: number;
  moonSolunar: number;
}

// Weights sum to 1.0 for each mode
const WEIGHT_PROFILES: Record<string, FullWeightProfile> = {
  // thermal(0.28)+pressure(0.18)+wind(0.10)+tempTrend(0.14)+light(0.08)+timeOfDay(0.08)+precipRunoff(0.06)+moonSolunar(0.04)+tideCurrent(0.04) = 1.00
  freshwater_lake: {
    thermal: 0.28,
    pressure: 0.18,
    wind: 0.10,
    tempTrend: 0.14,
    light: 0.08,
    timeOfDay: 0.08,
    precipRunoff: 0.06,
    moonSolunar: 0.04,
    tideCurrent: 0.04, // neutral pass-through for lake (applicable: false)
  },
  // thermal(0.26)+pressure(0.16)+wind(0.08)+tempTrend(0.14)+light(0.06)+timeOfDay(0.08)+precipRunoff(0.08)+moonSolunar(0.04)+tideCurrent(0.10) = 1.00
  freshwater_river: {
    thermal: 0.26,
    pressure: 0.16,
    wind: 0.08,
    tempTrend: 0.14,
    light: 0.06,
    timeOfDay: 0.08,
    precipRunoff: 0.08,
    moonSolunar: 0.04,
    tideCurrent: 0.10, // river flow proxy
  },
  // tideCurrent(0.28)+thermal(0.16)+pressure(0.14)+wind(0.12)+precipRunoff(0.08)+light(0.06)+timeOfDay(0.06)+tempTrend(0.06)+moonSolunar(0.04) = 1.00
  brackish: {
    tideCurrent: 0.28,
    thermal: 0.16,
    pressure: 0.14,
    wind: 0.12,
    precipRunoff: 0.08,
    light: 0.06,
    timeOfDay: 0.06,
    tempTrend: 0.06,
    moonSolunar: 0.04,
  },
  // tideCurrent(0.30)+thermal(0.14)+pressure(0.14)+wind(0.12)+precipRunoff(0.08)+light(0.06)+timeOfDay(0.06)+tempTrend(0.06)+moonSolunar(0.04) = 1.00
  saltwater: {
    tideCurrent: 0.30,
    thermal: 0.14,
    pressure: 0.14,
    wind: 0.12,
    precipRunoff: 0.08,
    light: 0.06,
    timeOfDay: 0.06,
    tempTrend: 0.06,
    moonSolunar: 0.04,
  },
};

function getWeightProfile(ctx: ResolvedContext): FullWeightProfile {
  return WEIGHT_PROFILES[ctx.environmentMode] ?? WEIGHT_PROFILES.freshwater_lake;
}

function composeScore(
  assessments: AssessmentOutputs,
  ctx: ResolvedContext,
  reliability: ReliabilitySummary
): number {
  const w = getWeightProfile(ctx);

  const rawScore =
    assessments.thermal.componentScore * w.thermal +
    assessments.tempTrend.componentScore * w.tempTrend +
    assessments.pressure.componentScore * w.pressure +
    assessments.wind.componentScore * w.wind +
    assessments.light.componentScore * w.light +
    assessments.timeOfDay.componentScore * w.timeOfDay +
    assessments.precipRunoff.componentScore * w.precipRunoff +
    // Tide/current: if not applicable (lake), use neutral 55
    (assessments.tideCurrent.applicable ? assessments.tideCurrent.componentScore : 55) * w.tideCurrent +
    assessments.moonSolunar.componentScore * w.moonSolunar;

  // Reliability confidence penalty: pull toward neutral when data is degraded
  let score = rawScore;
  if (reliability.overallConfidenceBand === 'very_low') {
    score = rawScore * 0.70 + 50 * 0.30;
  } else if (reliability.overallConfidenceBand === 'low') {
    score = rawScore * 0.85 + 50 * 0.15;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

// ---------------------------------------------------------------------------
// Severe suppression check
// Strong suppressors can cap the final score regardless of other positives.
// ---------------------------------------------------------------------------

function checkSevereSuppression(
  assessments: AssessmentOutputs,
  score: number,
  ctx: ResolvedContext
): { severeSuppression: boolean; reasons: string[]; cappedScore: number } {
  const reasons: string[] = [];
  let cap = 100;

  // Severe thermal events
  if (assessments.thermal.stateLabel === 'severe_heat') {
    reasons.push('severe_heat_stress');
    cap = Math.min(cap, 32);
  } else if (assessments.thermal.stateLabel === 'cold_stress' && assessments.thermal.componentScore < 15) {
    reasons.push('extreme_cold_water_stress');
    cap = Math.min(cap, 28);
  }

  // Sharp post-front lockdown
  if (assessments.pressure.stateLabel === 'post_front_pressure_spike') {
    reasons.push('post_front_lockdown');
    cap = Math.min(cap, 52);
  }

  // Dangerous wind
  if (assessments.wind.stateLabel === 'strong_wind_suppression') {
    reasons.push('dangerous_wind_conditions');
    cap = Math.min(cap, 40);
  }

  // Heavy runoff suppression for rivers/brackish
  if (
    assessments.precipRunoff.stateLabel === 'heavy_rain_runoff_suppression' ||
    assessments.precipRunoff.stateLabel === 'heavy_recent_rain'
  ) {
    reasons.push('heavy_runoff_degrading_conditions');
    cap = Math.min(cap, 48);
  }

  // Rapid thermal cooling from comfort
  if (assessments.tempTrend.stateLabel === 'rapid_cooling_suppression') {
    reasons.push('rapid_cold_front_cooling');
    cap = Math.min(cap, 50);
  }

  const cappedScore = Math.min(score, cap);
  return {
    severeSuppression: reasons.length > 0 && cappedScore <= 35,
    reasons,
    cappedScore,
  };
}

// ---------------------------------------------------------------------------
// Build top drivers and suppressors from all implemented assessments
// ---------------------------------------------------------------------------

function extractDriversAndSuppressors(
  assessments: AssessmentOutputs,
  reliability: ReliabilitySummary
): { topDrivers: string[]; suppressors: string[] } {
  const positive: string[] = [];
  const negative: string[] = [];

  // All assessment modules, sorted by assessment weight importance
  const modules: Array<[keyof AssessmentOutputs, number]> = [
    ['thermal', 3],
    ['tideCurrent', 3],
    ['pressure', 2],
    ['wind', 2],
    ['tempTrend', 2],
    ['light', 1],
    ['timeOfDay', 1],
    ['precipRunoff', 2],
    ['moonSolunar', 1],
  ];

  for (const [key] of modules) {
    const a = assessments[key];
    if (!a.applicable) continue;
    if (a.direction === 'positive' && a.dominantTags.length > 0) {
      positive.push(a.dominantTags[0]);
    } else if (a.direction === 'negative' && a.dominantTags.length > 0) {
      negative.push(a.dominantTags[0]);
    }
  }

  // Reliability signals
  if (reliability.claimGuardActive) {
    negative.push('limited_data_confidence');
  }
  if (reliability.waterTempSource === 'inferred_freshwater') {
    negative.push('inferred_temp_uncertainty');
  }

  return {
    topDrivers: [...new Set(positive)].slice(0, 5),
    suppressors: [...new Set(negative)].slice(0, 5),
  };
}

// ---------------------------------------------------------------------------
// Behavior synthesis — Phase 5: full synthesis from all implemented assessments
// ---------------------------------------------------------------------------

function buildBehaviorFromAssessments(
  assessments: AssessmentOutputs,
  ctx: ResolvedContext,
  score: number
): BehaviorOutputs {
  const mode = ctx.environmentMode;
  const isCoastal = ctx.isCoastal;

  // ---- Activity state from score band ----
  let activityState: ActivityState;
  if (score >= 80) activityState = 'peak';
  else if (score >= 70) activityState = 'high';
  else if (score >= 58) activityState = 'elevated';
  else if (score >= 45) activityState = 'moderate';
  else if (score >= 32) activityState = 'low';
  else if (score >= 18) activityState = 'very_low';
  else activityState = 'shutdown';

  // ---- Feeding readiness: thermal + pressure + tide interaction ----
  const thermalGood = assessments.thermal.componentScore >= 60;
  const pressureGood = assessments.pressure.componentScore >= 60;
  const tideGood = !assessments.tideCurrent.applicable || assessments.tideCurrent.componentScore >= 65;
  const thermalLabel = assessments.thermal.stateLabel;
  const suppressedThermal = thermalLabel === 'cold_stress' || thermalLabel === 'severe_heat';

  let feedingReadiness: FeedingReadiness;
  if (score < 20 || suppressedThermal) {
    feedingReadiness = 'not_feeding';
  } else if (activityState === 'shutdown' || activityState === 'very_low') {
    feedingReadiness = 'reluctant';
  } else if (thermalGood && pressureGood && tideGood && score >= 68) {
    feedingReadiness = score >= 80 ? 'aggressive' : 'active';
  } else if (score >= 55) {
    feedingReadiness = 'opportunistic';
  } else {
    feedingReadiness = 'reluctant';
  }

  // ---- Broad positioning tendency ----
  let broadPositioningTendency: PositioningTendency;

  if (isCoastal) {
    // Tidal environments
    const tideActive = assessments.tideCurrent.applicable &&
      (assessments.tideCurrent.stateLabel === 'incoming_tide' ||
       assessments.tideCurrent.stateLabel === 'peak_incoming_tide' ||
       assessments.tideCurrent.stateLabel === 'outgoing_tide' ||
       assessments.tideCurrent.stateLabel === 'early_outgoing_tide');

    if (tideActive) {
      broadPositioningTendency = 'tidal_cuts_and_creek_mouths';
    } else if (assessments.tideCurrent.stateLabel.includes('slack')) {
      broadPositioningTendency = 'variable_follows_tide';
    } else {
      broadPositioningTendency = 'current_breaks_and_structure';
    }
  } else if (mode === 'freshwater_river') {
    broadPositioningTendency = 'current_breaks_and_structure';
  } else {
    // Freshwater lake positioning based on thermal state
    if (thermalLabel === 'cold_stress' || thermalLabel === 'below_comfort') {
      broadPositioningTendency = 'deep_stable_structure';
    } else if (thermalLabel === 'warming_toward_comfort' || thermalLabel === 'spring_warming') {
      broadPositioningTendency = 'shallow_warming_flats';
    } else if (thermalLabel === 'peak_comfort') {
      // Time of day refinement
      const isLowLight = assessments.timeOfDay.stateLabel === 'dawn_prime_window' ||
        assessments.timeOfDay.stateLabel === 'dusk_prime_window' ||
        assessments.timeOfDay.stateLabel === 'early_morning_good_window';
      broadPositioningTendency = isLowLight ? 'shallow_feeding_edges' : 'mid_column_transition';
    } else if (thermalLabel === 'heat_stress' || thermalLabel === 'severe_heat') {
      broadPositioningTendency = 'deep_thermal_refuge';
    } else {
      broadPositioningTendency = 'mid_column_transition';
    }
  }

  // ---- Presentation speed bias ----
  let presentationSpeedBias: PresentationSpeedBias;
  if (thermalLabel === 'cold_stress' || (thermalLabel === 'below_comfort' && !ctx.isFreshwater)) {
    presentationSpeedBias = 'very_slow';
  } else if (thermalLabel === 'below_comfort' || thermalLabel === 'warming_toward_comfort') {
    presentationSpeedBias = 'slow';
  } else if (thermalLabel === 'heat_stress' || thermalLabel === 'severe_heat') {
    presentationSpeedBias = 'slow';
  } else if (score >= 75 && feedingReadiness === 'active' || feedingReadiness === 'aggressive') {
    presentationSpeedBias = 'fast';
  } else if (score >= 60) {
    presentationSpeedBias = 'moderate';
  } else {
    presentationSpeedBias = 'moderate';
  }

  // ---- Build driver / suppressor lists for behavior ----
  const positiveDrivers: string[] = [];
  const negativeDrivers: string[] = [];

  for (const key of ['thermal', 'tideCurrent', 'pressure', 'wind', 'tempTrend', 'precipRunoff'] as Array<keyof AssessmentOutputs>) {
    const a = assessments[key];
    if (!a.applicable) continue;
    if (a.direction === 'positive') positiveDrivers.push(...a.dominantTags.slice(0, 1));
    else if (a.direction === 'negative') negativeDrivers.push(...a.dominantTags.slice(0, 1));
  }

  const suppressionActive = activityState === 'shutdown' || activityState === 'very_low';

  return {
    activityState,
    feedingReadiness,
    opportunityState: score >= 75 ? 'great' : score >= 58 ? 'good' : score >= 40 ? 'fair' : 'poor',
    broadPositioningTendency,
    presentationSpeedBias,
    dominantPositiveDrivers: [...new Set(positiveDrivers)].slice(0, 3),
    dominantNegativeDrivers: [...new Set(negativeDrivers)].slice(0, 3),
    suppressionActive,
    suppressionReasons: suppressionActive ? [...new Set(negativeDrivers)] : [],
  };
}

// ---------------------------------------------------------------------------
// Main engine runner
// ---------------------------------------------------------------------------

export interface EngineV2Result {
  engineOutput: HowFishingEngineOutput;
  llmPayload: LLMApprovedReportPayload;
}

export function runEngineV2(
  req: HowFishingRequestV2,
  rawEnvData: RawEnvironmentData,
  targetDateOrNow?: string | null
): EngineV2Result {
  // Step 1: Validate confirmed context
  const validationError = validateRequestContext(req);
  if (validationError) {
    throw new EngineV2Error(validationError, 'INVALID_CONTEXT');
  }

  // Step 2: Normalize raw environment
  const env = normalizeEnvironment(rawEnvData);

  // Step 3: Resolve context
  const ctx = resolveContext(req, env, targetDateOrNow);

  // Step 4: Build reliability summary
  const reliability: ReliabilitySummary = buildReliabilitySummary(env, ctx);

  // Resolve effective water temperature (used in LLM payload)
  const { tempF: waterTempF, source: waterTempSource } = resolveEffectiveWaterTemp(env, ctx);

  // Pre-compute shared state for inter-module coordination:
  // thermal state label and light condition are used by timeOfDay and behavior
  const thermalPrelim = assessThermal(env, ctx, reliability);
  const thermalStateLabel = thermalPrelim.stateLabel;
  const lightCondition = classifyLightCondition(env.current.cloudCoverPct);

  // Step 5: Run all assessments
  // moonSolunar needs a preliminary score; compute from core modules first
  // to prevent circular dependency. We use a 3-module preliminary.
  const pressurePrelim = assessPressure(env, ctx);
  const windPrelim = assessWind(env, ctx);
  const prelimScore = Math.round(
    thermalPrelim.componentScore * 0.40 +
    pressurePrelim.componentScore * 0.35 +
    windPrelim.componentScore * 0.25
  );

  const assessments = runAssessments(env, ctx, reliability, thermalPrelim, pressurePrelim, windPrelim, thermalStateLabel, lightCondition, prelimScore);

  // Step 6: Compose score from all real assessments
  const rawScore = composeScore(assessments, ctx, reliability);

  // Step 7: Check severe suppression
  const { severeSuppression, reasons: severeReasons, cappedScore } = checkSevereSuppression(assessments, rawScore, ctx);

  const score = cappedScore;
  const scoreBand = scoreToScoreBand(score);

  // Step 8: Extract drivers and suppressors
  const { topDrivers, suppressors } = extractDriversAndSuppressors(assessments, reliability);

  // Step 9: Build behavior (full Phase 5 synthesis)
  const behavior: BehaviorOutputs = buildBehaviorFromAssessments(assessments, ctx, score);

  // Step 10: Build real opportunity curve (Phase 6)
  const opportunityCurve = buildOpportunityCurve(env, assessments, ctx, reliability, score);

  const engineOutput: HowFishingEngineOutput = {
    score,
    scoreBand,
    confidence: reliability.overallConfidenceBand,
    assessments,
    behavior,
    opportunityCurve,
    reliability,
    resolvedContext: ctx,
    topDrivers,
    suppressors,
    severeSuppression,
    severeSuppressionReasons: severeReasons,
    dataQualityNotes: reliability.notes,
  };

  // Step 11: Build LLM-approved payload
  const pressureAssessment = assessments.pressure as ReturnType<typeof assessPressure>;
  const pressureStateSummary = 'stateSummary' in pressureAssessment
    ? (pressureAssessment as { stateSummary: string }).stateSummary
    : null;

  const precipSummary = assessments.precipRunoff.stateLabel !== 'precipitation_data_unavailable'
    ? assessments.precipRunoff.stateLabel
    : null;

  const tideStateSummary = assessments.tideCurrent.applicable
    ? assessments.tideCurrent.stateLabel
    : null;

  const timingNarrationHint = deriveTimimgNarrationFacts(opportunityCurve, assessments, ctx, env);

  const llmPayload: LLMApprovedReportPayload = buildLLMPayload(
    engineOutput,
    waterTempF,
    waterTempSource,
    env.current.airTempF ?? null,
    env.current.windSpeedMph ?? null,
    env.solarLunar.moonPhase ?? null,
    pressureStateSummary,
    precipSummary,
    tideStateSummary,
    timingNarrationHint
  );

  return { engineOutput, llmPayload };
}

// ---------------------------------------------------------------------------
// LLM payload builder — only approved facts, no raw weather blob
// Phase 5: precipSummary and tideStateSummary now populated
// ---------------------------------------------------------------------------

function buildLLMPayload(
  output: HowFishingEngineOutput,
  waterTempF: number | null,
  waterTempSource: WaterTempSource,
  airTempF: number | null,
  windSpeedMph: number | null,
  moonPhase: string | null,
  pressureStateSummary: string | null,
  precipSummary: string | null,
  tideStateSummary: string | null,
  timingNarrationHint: string | null
): LLMApprovedReportPayload {
  const { resolvedContext: ctx, reliability, behavior, opportunityCurve } = output;

  return {
    environmentMode: ctx.environmentMode,
    region: ctx.region,
    seasonalState: ctx.seasonalState,
    score: output.score,
    scoreBand: output.scoreBand,
    confidence: output.confidence,
    bestWindows: opportunityCurve.bestWindows,
    fairWindows: opportunityCurve.fairWindows,
    poorWindows: opportunityCurve.poorWindows,
    topDrivers: output.topDrivers,
    suppressors: output.suppressors,
    activityState: behavior.activityState,
    feedingReadiness: behavior.feedingReadiness,
    broadPositioningTendency: behavior.broadPositioningTendency,
    presentationSpeedBias: behavior.presentationSpeedBias,
    severeSuppression: output.severeSuppression,
    severeSuppressionReasons: output.severeSuppressionReasons,
    claimGuardActive: reliability.claimGuardActive,
    dataQualityNotes: output.dataQualityNotes,
    approvedFacts: {
      airTempF,
      waterTempF,
      waterTempSource,
      waterTempIsInferred: waterTempSource === 'inferred_freshwater',
      windSpeedMph,
      pressureStateSummary,
      moonPhase,
      precipSummary,
      tideStateSummary, // new in Phase 5
      timingNarrationHint, // new in Phase 6
    },
  };
}
