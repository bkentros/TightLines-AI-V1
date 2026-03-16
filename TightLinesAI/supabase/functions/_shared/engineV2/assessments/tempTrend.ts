// =============================================================================
// ENGINE V2 — Temperature Trend Assessment
//
// Evaluates the direction and magnitude of recent air/water temperature change.
// Non-species-specific. Operates on broad behavioral momentum principles.
//
// Logic summary:
// - Warming trend in cool/cold contexts = supportive (fish responding to improving conditions)
// - Warming trend when already hot = slightly negative (digging into stress territory)
// - Cooling trend after heat stress = supportive (relief improving conditions)
// - Sharp cooling from comfort = suppressive (rapid metabolic disruption)
// - Stable / no trend = neutral baseline
// - High volatility (big swings) = confidence penalty
//
// Data used:
// - dailyAirTempHighF / dailyAirTempLowF history (primary)
// - hourlyAirTempF history (secondary for rate estimation)
// - weather.temp_trend_3day / temp_trend_direction_f from get-environment (fallback)
// =============================================================================

import type {
  SingleAssessment,
  NormalizedEnvironmentV2,
  ResolvedContext,
} from '../types/contracts.ts';

type TrendDirection =
  | 'rapid_warming'
  | 'warming'
  | 'stable'
  | 'cooling'
  | 'rapid_cooling'
  | 'unknown';

// ---------------------------------------------------------------------------
// Compute trend from available history
// ---------------------------------------------------------------------------

function computeAirTempTrend(env: NormalizedEnvironmentV2): {
  direction: TrendDirection;
  deltaDegF: number | null;
} {
  // Try raw daily history first
  const highs = env.histories.dailyAirTempHighF?.filter((v): v is number => v != null) ?? [];
  const lows = env.histories.dailyAirTempLowF?.filter((v): v is number => v != null) ?? [];

  if (highs.length >= 4 && lows.length >= 4) {
    // Compare 3-day average (most recent) to 3-day average (3 days prior)
    const n = Math.min(highs.length, lows.length);
    const recentAvgs: number[] = [];
    const olderAvgs: number[] = [];

    for (let i = n - 3; i < n; i++) {
      recentAvgs.push((highs[i] + lows[i]) / 2);
    }
    for (let i = Math.max(0, n - 6); i < n - 3; i++) {
      olderAvgs.push((highs[i] + lows[i]) / 2);
    }

    if (recentAvgs.length >= 2 && olderAvgs.length >= 2) {
      const recentMean = recentAvgs.reduce((a, b) => a + b, 0) / recentAvgs.length;
      const olderMean = olderAvgs.reduce((a, b) => a + b, 0) / olderAvgs.length;
      const delta = recentMean - olderMean; // positive = warming

      let direction: TrendDirection;
      if (delta >= 8) direction = 'rapid_warming';
      else if (delta >= 3) direction = 'warming';
      else if (delta >= -3) direction = 'stable';
      else if (delta >= -8) direction = 'cooling';
      else direction = 'rapid_cooling';

      return { direction, deltaDegF: Math.round(delta * 10) / 10 };
    }
  }

  // Fallback: check get-environment pre-computed trend field (weather blob passthrough)
  const rawEnv = env as unknown as Record<string, unknown>;
  const weather = rawEnv.weather as Record<string, unknown> | undefined;
  if (weather) {
    const precomputed = weather.temp_trend_3day as string | undefined;
    const deltaF = weather.temp_trend_direction_f as number | undefined;
    if (precomputed) {
      const map: Record<string, TrendDirection> = {
        rapid_warming: 'rapid_warming',
        warming: 'warming',
        stable: 'stable',
        cooling: 'cooling',
        rapid_cooling: 'rapid_cooling',
      };
      return { direction: map[precomputed] ?? 'unknown', deltaDegF: deltaF ?? null };
    }
  }

  return { direction: 'unknown', deltaDegF: null };
}

// ---------------------------------------------------------------------------
// Context-aware scoring
// ---------------------------------------------------------------------------

function trendToScore(
  direction: TrendDirection,
  ctx: ResolvedContext,
  thermalStateLabel: string
): { score: number; stateLabel: string; tags: string[]; direction: 'positive' | 'negative' | 'neutral' } {
  const inHeatStress = thermalStateLabel === 'heat_stress' || thermalStateLabel === 'severe_heat';
  const inColdStress = thermalStateLabel === 'cold_stress' || thermalStateLabel === 'below_comfort';

  switch (direction) {
    case 'rapid_warming': {
      if (inHeatStress) {
        // Already stressed — more heat = worse
        return {
          score: 32,
          stateLabel: 'rapid_warming_into_stress',
          tags: ['rapid_warming_adding_heat_stress', 'conditions_worsening'],
          direction: 'negative',
        };
      }
      if (inColdStress) {
        // Coming up from cold — rapid warming can be very good
        return {
          score: 72,
          stateLabel: 'rapid_warming_from_cold',
          tags: ['rapid_warming_improving', 'significant_temperature_recovery'],
          direction: 'positive',
        };
      }
      // In comfort — minor benefit; rapid change can disrupt briefly
      return {
        score: 60,
        stateLabel: 'rapid_warming_from_comfort',
        tags: ['rapid_warming', 'conditions_improving_but_change_itself_can_disrupt'],
        direction: 'neutral',
      };
    }

    case 'warming': {
      if (inHeatStress) {
        return {
          score: 42,
          stateLabel: 'warming_into_stress',
          tags: ['continued_warming', 'trending_toward_stress'],
          direction: 'neutral',
        };
      }
      // In cold/comfort: modest warming is the best freshwater scenario
      return {
        score: 72,
        stateLabel: 'warming_trend',
        tags: ['warming_trend', 'improving_conditions'],
        direction: 'positive',
      };
    }

    case 'stable':
      return {
        score: 62,
        stateLabel: 'stable_temperature',
        tags: ['stable_temperature', 'fish_adapted_to_current_thermal_conditions'],
        direction: 'neutral',
      };

    case 'cooling': {
      if (inHeatStress) {
        // Relief from heat — very supportive
        return {
          score: 72,
          stateLabel: 'cooling_relief_from_heat',
          tags: ['cooling_from_heat_stress', 'improving_conditions'],
          direction: 'positive',
        };
      }
      if (inColdStress) {
        // Getting colder from already cold — suppressive
        return {
          score: 35,
          stateLabel: 'cooling_deepening_cold',
          tags: ['continued_cooling', 'deepening_cold_suppression'],
          direction: 'negative',
        };
      }
      // Cooling from comfort: context-dependent
      const autumnContext = ctx.seasonalState === 'early_fall_feed' || ctx.seasonalState === 'late_fall_cooling';
      return {
        score: autumnContext ? 68 : 52,
        stateLabel: autumnContext ? 'fall_cooling_positive' : 'cooling_from_comfort',
        tags: autumnContext
          ? ['fall_cooling_stimulates_activity', 'seasonal_cooling_supportive']
          : ['mild_cooling', 'slight_activity_shift'],
        direction: autumnContext ? 'positive' : 'neutral',
      };
    }

    case 'rapid_cooling': {
      // Almost always suppressive — sharp thermal disruption
      if (inHeatStress) {
        return {
          score: 58,
          stateLabel: 'rapid_cooling_from_heat',
          tags: ['sharp_cooling_from_stress', 'relief_but_disruptive_transition'],
          direction: 'neutral',
        };
      }
      return {
        score: 28,
        stateLabel: 'rapid_cooling_suppression',
        tags: ['sharp_cold_front_cooling', 'thermal_disruption', 'fish_adjusting_to_rapid_change'],
        direction: 'negative',
      };
    }

    case 'unknown':
    default:
      return {
        score: 50,
        stateLabel: 'temp_trend_unknown',
        tags: ['temperature_trend_data_limited'],
        direction: 'neutral',
      };
  }
}

// ---------------------------------------------------------------------------
// Main temp trend assessment
// ---------------------------------------------------------------------------

export function assessTempTrend(
  env: NormalizedEnvironmentV2,
  ctx: ResolvedContext,
  thermalStateLabel: string
): SingleAssessment {
  const { direction, deltaDegF } = computeAirTempTrend(env);

  const { score, stateLabel, tags, direction: assessDirection } = trendToScore(direction, ctx, thermalStateLabel);

  // Rivers are slightly more sensitive to temp trend (faster exchange with air)
  const modeMultiplier = ctx.environmentMode === 'freshwater_river' ? 1.05 : 1.0;
  const adjustedScore = Math.max(0, Math.min(100, Math.round((score - 50) * modeMultiplier + 50)));

  // Confidence is lower when trend direction is unknown or delta is large (volatile)
  const highVolatility = deltaDegF != null && Math.abs(deltaDegF) > 12;
  const confidenceDep = direction === 'unknown' ? 'low'
    : highVolatility ? 'low'
    : 'moderate';

  return {
    componentScore: adjustedScore,
    stateLabel,
    dominantTags: tags,
    direction: assessDirection,
    confidenceDependency: confidenceDep,
    applicable: true,
  };
}
