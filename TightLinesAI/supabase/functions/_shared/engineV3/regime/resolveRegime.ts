// =============================================================================
// ENGINE V3 — Primary Conditions Regime Resolver
// Derives supportive | neutral | suppressive | highly_suppressive from measured
// primary conditions. Regime affects secondary/tertiary variable influence.
// =============================================================================

import type { RegimeV3 } from '../types.ts';
import type { NormalizedEnvironmentV3 } from '../types.ts';
import type { GeoContextV3 } from '../types.ts';

type PressureTrendLabel =
  | 'rapidly_falling'
  | 'slowly_falling'
  | 'stable'
  | 'slowly_rising'
  | 'rapidly_rising'
  | 'unknown';

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

function getWindSeverity(windMph: number | null): 'calm' | 'light' | 'moderate' | 'heavy' | 'severe' {
  if (windMph == null) return 'moderate';
  if (windMph <= 5) return 'calm';
  if (windMph <= 15) return 'light';
  if (windMph <= 25) return 'moderate';
  if (windMph <= 35) return 'heavy';
  return 'severe';
}

function getPrecipSeverity(env: NormalizedEnvironmentV3): 'none' | 'light' | 'moderate' | 'heavy' | 'active' {
  const current = env.precipitation.currentPrecipInHr.value ?? 0;
  const p48 = env.precipitation.precip48hrInches.value ?? 0;
  if (current > 0.1) return 'active';
  if (p48 > 2.0) return 'heavy';
  if (p48 > 0.75) return 'moderate';
  if (p48 > 0.1) return 'light';
  return 'none';
}

/**
 * Resolves primary conditions regime from measured variables only.
 * No inferred water temp, no historical baseline substitution.
 */
export function resolvePrimaryConditionsRegime(
  env: NormalizedEnvironmentV3,
  _geoContext: GeoContextV3
): RegimeV3 {
  const pressureTrend = getPressureTrend(env);
  const windMph = env.atmospheric.windSpeedMph.value;
  const windSeverity = getWindSeverity(windMph);
  const precipSeverity = getPrecipSeverity(env);

  // Strong suppressors — any one can push to highly_suppressive
  const hasRapidPressureFall = pressureTrend === 'rapidly_falling';
  const hasRapidPressureRise = pressureTrend === 'rapidly_rising';
  const hasSevereWind = windSeverity === 'severe';
  const hasHeavyPrecip = precipSeverity === 'heavy' || precipSeverity === 'active';
  const hasHeavyWind = windSeverity === 'heavy';

  // Moderate suppressors
  const hasSlowPressureFall = pressureTrend === 'slowly_falling';
  const hasModeratePrecip = precipSeverity === 'moderate';

  // Supportive indicators
  const hasStablePressure = pressureTrend === 'stable';
  const hasPreFrontWindow = pressureTrend === 'slowly_falling'; // pre-front feeding
  const hasLightWind = windSeverity === 'light' || windSeverity === 'calm';
  const hasNoPrecip = precipSeverity === 'none' || precipSeverity === 'light';

  // Highly suppressive: severe wind, rapid pressure change, or heavy precip
  if (hasSevereWind || hasRapidPressureFall || hasRapidPressureRise || hasHeavyPrecip) {
    return 'highly_suppressive';
  }

  // Suppressive: heavy wind, moderate precip, or rapid pressure
  if (hasHeavyWind || hasModeratePrecip) {
    return 'suppressive';
  }

  // Suppressive: slowly falling + some precip
  if (hasSlowPressureFall && !hasNoPrecip) {
    return 'suppressive';
  }

  // Supportive: stable pressure, light wind, no precip
  if (hasStablePressure && hasLightWind && hasNoPrecip) {
    return 'supportive';
  }

  // Supportive: pre-front window (slowly falling) with light wind and no precip
  if (hasPreFrontWindow && hasLightWind && hasNoPrecip) {
    return 'supportive';
  }

  // Neutral: mixed conditions
  return 'neutral';
}
