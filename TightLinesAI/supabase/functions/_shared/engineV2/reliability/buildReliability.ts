// =============================================================================
// ENGINE V2 — Reliability Layer
// Determines data confidence, degraded modules, and claim guard state.
//
// Phase 4 refinements:
// - identifyDegradedModules now correctly marks water_temp as degraded when
//   no source is available
// - resolveEffectiveWaterTemp now delegates inference to the thermal module's
//   improved model instead of using the Phase 3 stub (airTemp - 5)
// - claimGuard now also activates on very high air temp volatility with
//   inferred freshwater temp (unstable inference = weaker claims)
// =============================================================================

import type {
  NormalizedEnvironmentV2,
  ResolvedContext,
  ReliabilitySummary,
  WaterTempSource,
  ConfidenceBand,
  DegradedModule,
} from '../types/contracts.ts';
import { inferFreshwaterTemp } from '../assessments/thermal.ts';

/**
 * Resolves water temperature source and confidence given context and environment.
 */
function resolveWaterTempSource(
  env: NormalizedEnvironmentV2,
  ctx: ResolvedContext
): { source: WaterTempSource; confidence: number } {
  if (ctx.isFreshwater) {
    // Manual user entry is highest confidence for freshwater
    if (env.userOverrides.manualFreshwaterWaterTempF != null) {
      return { source: 'manual_user_entered', confidence: 1.0 };
    }
    // Freshwater temp must be inferred from air temp history
    const hasGoodAirTempHistory =
      Array.isArray(env.histories.hourlyAirTempF) &&
      env.histories.hourlyAirTempF.length >= 24;
    const airTempVolatility = computeAirTempVolatility(env);
    const baseConfidence = hasGoodAirTempHistory ? 0.65 : 0.35;
    // Rivers track air temp more closely but are less stable — reduce inference confidence
    const modeMultiplier = ctx.environmentMode === 'freshwater_river' ? 0.85 : 1.0;
    // High volatility reduces confidence
    const volatilityPenalty = airTempVolatility > 15 ? 0.15 : airTempVolatility > 8 ? 0.08 : 0;
    return {
      source: 'inferred_freshwater',
      confidence: Math.max(0.1, (baseConfidence * modeMultiplier) - volatilityPenalty),
    };
  }

  // Coastal/brackish: measured source preferred
  if (env.marine.measuredWaterTempF != null) {
    return { source: 'measured_coastal', confidence: 0.9 };
  }

  // No water temp available
  return { source: 'unavailable', confidence: 0 };
}

/**
 * Computes approximate 7-day air temperature volatility as range in mean daily temps (°F).
 * Uses daily mean (avg of high+low) to avoid counting normal diurnal range as volatility.
 */
function computeAirTempVolatility(env: NormalizedEnvironmentV2): number {
  const highs = env.histories.dailyAirTempHighF?.filter((v): v is number => v != null) ?? [];
  const lows = env.histories.dailyAirTempLowF?.filter((v): v is number => v != null) ?? [];
  const len = Math.min(highs.length, lows.length);
  if (len < 2) return 0;
  // Use daily mean to measure trend volatility (not raw high-low which captures diurnal range)
  const dailyMeans = Array.from({ length: len }, (_, i) => (highs[i] + lows[i]) / 2);
  const maxMean = Math.max(...dailyMeans);
  const minMean = Math.min(...dailyMeans);
  return maxMean - minMean;
}

/**
 * Identifies which engine modules are degraded based on data availability.
 */
function identifyDegradedModules(
  env: NormalizedEnvironmentV2,
  ctx: ResolvedContext
): DegradedModule[] {
  const degraded: DegradedModule[] = [];

  // Water temp degradation
  if (ctx.isFreshwater) {
    const hasManual = env.userOverrides.manualFreshwaterWaterTempF != null;
    const hasAirTemp = env.current.airTempF != null;
    if (!hasManual && !hasAirTemp) {
      degraded.push('water_temp');
    }
  } else {
    // Coastal: measured water temp required
    if (env.marine.measuredWaterTempF == null) {
      degraded.push('water_temp');
    }
  }

  if (env.current.airTempF == null) degraded.push('air_temp');

  // Pressure degradation — current reading OR history needed
  const hasPressureCurrent = env.current.pressureMb != null;
  const hasPressureHistory =
    Array.isArray(env.histories.hourlyPressureMb) &&
    env.histories.hourlyPressureMb.length >= 4;
  if (!hasPressureCurrent && !hasPressureHistory) {
    degraded.push('pressure_history');
  } else if (!hasPressureHistory) {
    // Have current but no trend — trend-dependent pressure assessment will be limited
    // Don't push as degraded since current reading still useful; noted in reliability notes
  }

  if (ctx.useTideVariables) {
    const hasTides =
      Array.isArray(env.marine.tidePredictionsToday) &&
      env.marine.tidePredictionsToday.length > 0;
    if (!hasTides) degraded.push('tide_data');
  }

  const hasSolunar =
    (env.solarLunar.solunarMajorPeriods?.length ?? 0) > 0 ||
    (env.solarLunar.solunarMinorPeriods?.length ?? 0) > 0;
  if (!hasSolunar) degraded.push('solunar_data');

  if (
    env.histories.precip48hrInches == null &&
    env.histories.precip7dayInches == null &&
    env.current.precipInHr == null
  ) {
    degraded.push('precip_data');
  }

  if (env.current.windSpeedMph == null) degraded.push('wind_data');

  return degraded;
}

/**
 * Maps degraded modules + water temp confidence → overall confidence band.
 */
function computeOverallConfidence(
  degraded: DegradedModule[],
  waterTempConfidence: number,
  claimGuardActive: boolean
): ConfidenceBand {
  // Critical degradation = water temp unavailable, OR both air temp AND pressure missing
  const criticalDegraded =
    degraded.includes('water_temp') ||
    (degraded.includes('air_temp') && degraded.includes('pressure_history'));

  // Solunar and precip are secondary — don't count them toward severe degradation
  const primaryDegraded = degraded.filter(
    m => m !== 'solunar_data' && m !== 'precip_data'
  );
  const severeDegradation = primaryDegraded.length >= 4;

  if (waterTempConfidence < 0.1) return 'very_low';
  if (claimGuardActive && criticalDegraded) return 'very_low';
  if (claimGuardActive && severeDegradation) return 'low';
  if (primaryDegraded.length >= 3 || waterTempConfidence < 0.3) return 'low';
  if (primaryDegraded.length >= 1 || waterTempConfidence < 0.70) return 'moderate';
  if (claimGuardActive) return 'moderate'; // claim guard alone → moderate (not low)
  if (waterTempConfidence >= 1.0 && primaryDegraded.length === 0) return 'very_high';
  return 'high';
}

/**
 * Builds the full reliability summary consumed by the feature output and narration layers.
 */
export function buildReliabilitySummary(
  env: NormalizedEnvironmentV2,
  ctx: ResolvedContext
): ReliabilitySummary {
  const { source: waterTempSource, confidence: waterTempConfidence } = resolveWaterTempSource(env, ctx);

  const degradedModules = identifyDegradedModules(env, ctx);

  const criticalInferredInputs: string[] = [];
  if (waterTempSource === 'inferred_freshwater') {
    criticalInferredInputs.push('Water temperature (inferred from air temperature model)');
  }
  if (ctx.isFreshwater && env.userOverrides.manualFreshwaterWaterTempF == null) {
    criticalInferredInputs.push('Freshwater temperature (user did not provide manual entry)');
  }

  // Claim guard activates when water temp is unavailable, very low confidence,
  // OR when temp is inferred with high air temp volatility (unstable inference)
  const airTempVolatilityHigh = computeAirTempVolatility(env) > 18;
  const claimGuardActive =
    waterTempSource === 'unavailable' ||
    waterTempConfidence < 0.25 ||
    (waterTempSource === 'inferred_freshwater' && airTempVolatilityHigh);

  const safeForTacticalSpecificity =
    !claimGuardActive && degradedModules.length <= 2;

  const overallConfidenceBand = computeOverallConfidence(
    degradedModules,
    waterTempConfidence,
    claimGuardActive
  );

  const notes: string[] = [];
  if (waterTempSource === 'inferred_freshwater') {
    notes.push('Freshwater temperature is estimated from air temperature — actual temp may vary');
  }
  if (waterTempSource === 'unavailable') {
    notes.push('Water temperature unavailable — water-temp-driven assessments are suppressed');
  }
  if (degradedModules.includes('tide_data') && ctx.useTideVariables) {
    notes.push('Tide data unavailable — tidal assessments are suppressed');
  }
  if (degradedModules.includes('pressure_history')) {
    notes.push('Limited pressure history — pressure trend assessment may be less accurate');
  }

  return {
    overallConfidenceBand,
    waterTempSource,
    waterTempConfidence,
    degradedModules,
    criticalInferredInputs,
    claimGuardActive,
    safeForTacticalSpecificity,
    notes,
  };
}

/**
 * Resolves the final water temperature value and source to use for engine scoring.
 * Applies source priority rules from the architecture spec.
 * Uses the thermal module's improved inference model (replaces Phase 3 stub).
 */
export function resolveEffectiveWaterTemp(
  env: NormalizedEnvironmentV2,
  ctx: ResolvedContext
): { tempF: number | null; source: WaterTempSource } {
  if (ctx.isFreshwater) {
    // Priority 1: manual user entry
    if (env.userOverrides.manualFreshwaterWaterTempF != null) {
      return { tempF: env.userOverrides.manualFreshwaterWaterTempF, source: 'manual_user_entered' };
    }
    // Priority 2: infer from air temp history using the thermal module's model
    const inferred = inferFreshwaterTemp(env, ctx);
    if (inferred != null) {
      return { tempF: inferred, source: 'inferred_freshwater' };
    }
    return { tempF: null, source: 'unavailable' };
  }

  // Coastal/brackish
  if (env.marine.measuredWaterTempF != null) {
    return { tempF: env.marine.measuredWaterTempF, source: 'measured_coastal' };
  }
  return { tempF: null, source: 'unavailable' };
}
