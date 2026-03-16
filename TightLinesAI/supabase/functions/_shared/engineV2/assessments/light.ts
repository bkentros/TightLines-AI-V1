// =============================================================================
// ENGINE V2 — Light Assessment
//
// Evaluates ambient light intensity and cloud cover for fish activity effects.
// Non-species-specific. Operates on broad low-light advantage principles.
//
// Logic summary:
// - Low light (overcast, cloud cover) generally reduces fish spookiness and
//   can extend active feeding periods across the day
// - Bright, full-sun conditions concentrate activity to low-light windows
//   and can suppress midday activity particularly in clear or warm water
// - The effect is context-sensitive: cool/overcast fall/spring days behave
//   differently than blazing midsummer sun
// - No species-specific "topwater" or "sight fishing" language
//
// Data used:
// - cloudCoverPct from current env
// - thermal state (heat stress amplifies bright-sun suppression)
// - seasonal state (summer vs autumn context)
// =============================================================================

import type {
  SingleAssessment,
  NormalizedEnvironmentV2,
  ResolvedContext,
} from '../types/contracts.ts';

type LightConditionLabel =
  | 'overcast'       // cloud_cover_pct >= 75
  | 'mostly_cloudy'  // 50–74%
  | 'partly_cloudy'  // 25–49%
  | 'mostly_clear'   // 10–24%
  | 'full_sun'       // < 10%
  | 'unknown';

function classifyLightCondition(cloudPct: number | null | undefined): LightConditionLabel {
  if (cloudPct == null) return 'unknown';
  if (cloudPct >= 75) return 'overcast';
  if (cloudPct >= 50) return 'mostly_cloudy';
  if (cloudPct >= 25) return 'partly_cloudy';
  if (cloudPct >= 10) return 'mostly_clear';
  return 'full_sun';
}

function lightToScore(
  condition: LightConditionLabel,
  ctx: ResolvedContext,
  thermalStateLabel: string
): { score: number; stateLabel: string; tags: string[]; direction: 'positive' | 'negative' | 'neutral' } {
  const inHeatStress = thermalStateLabel === 'heat_stress' || thermalStateLabel === 'severe_heat';
  const isCoastal = ctx.isCoastal;

  switch (condition) {
    case 'overcast':
      // Overcast is broadly positive — extends activity window across the day
      return {
        score: 72,
        stateLabel: 'overcast_extended_window',
        tags: ['overcast_light', 'low_light_extends_active_period', 'fish_less_spooky'],
        direction: 'positive',
      };

    case 'mostly_cloudy':
      return {
        score: 68,
        stateLabel: 'mostly_cloudy_favorable',
        tags: ['mixed_cloud_cover', 'soft_light_conditions'],
        direction: 'positive',
      };

    case 'partly_cloudy':
      // Neutral to slight positive — some cloud softening, some sun exposure
      return {
        score: 58,
        stateLabel: 'partly_cloudy_mixed',
        tags: ['partly_cloudy', 'variable_light_conditions'],
        direction: 'neutral',
      };

    case 'mostly_clear': {
      const heatPenalty = inHeatStress ? 12 : 0;
      return {
        score: Math.max(35, 50 - heatPenalty),
        stateLabel: inHeatStress ? 'bright_light_in_heat' : 'mostly_clear_sky',
        tags: inHeatStress
          ? ['bright_clear_sky', 'amplified_heat_suppression', 'activity_concentrated_low_light_windows']
          : ['mostly_clear', 'activity_favors_low_light_windows'],
        direction: inHeatStress ? 'negative' : 'neutral',
      };
    }

    case 'full_sun': {
      // Bright full sun — most suppressive for daytime, especially in heat or clear water
      const heatPenalty = inHeatStress ? 18 : 0;
      const baseScore = isCoastal ? 45 : 42; // coastal slightly more tolerant
      return {
        score: Math.max(20, baseScore - heatPenalty),
        stateLabel: inHeatStress ? 'full_sun_heat_compounded' : 'bright_full_sun',
        tags: inHeatStress
          ? ['full_sun', 'heat_stress_compounded', 'activity_window_narrow']
          : ['full_sun', 'activity_concentrated_dawn_dusk', 'midday_suppressed'],
        direction: 'negative',
      };
    }

    case 'unknown':
    default:
      return {
        score: 52,
        stateLabel: 'light_condition_unknown',
        tags: ['cloud_cover_data_unavailable'],
        direction: 'neutral',
      };
  }
}

// ---------------------------------------------------------------------------
// Main light assessment
// ---------------------------------------------------------------------------

export function assessLight(
  env: NormalizedEnvironmentV2,
  ctx: ResolvedContext,
  thermalStateLabel: string
): SingleAssessment {
  const cloudPct = env.current.cloudCoverPct;
  const condition = classifyLightCondition(cloudPct);
  const { score, stateLabel, tags, direction } = lightToScore(condition, ctx, thermalStateLabel);

  return {
    componentScore: Math.max(0, Math.min(100, score)),
    stateLabel,
    dominantTags: tags,
    direction,
    confidenceDependency: condition === 'unknown' ? 'very_low' : 'moderate',
    applicable: true,
  };
}

// ---------------------------------------------------------------------------
// Export light condition label for use in timeOfDay module
// ---------------------------------------------------------------------------

export { classifyLightCondition, type LightConditionLabel };
