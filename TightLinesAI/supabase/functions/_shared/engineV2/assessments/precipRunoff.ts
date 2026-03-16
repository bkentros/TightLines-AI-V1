// =============================================================================
// ENGINE V2 — Precipitation / Runoff Assessment
//
// Evaluates the suppressive or minor supportive effects of recent precipitation
// and inferred runoff on fishing conditions.
// Non-species-specific.
//
// Logic summary:
// - Light or no rain: neutral to marginally positive in some contexts
// - Moderate recent rain: modest suppression; river/brackish more affected
// - Heavy recent rain / high 48hr accumulation: significant suppression,
//   especially for rivers (turbidity, unstable flow) and brackish (sediment flush)
// - Saltwater pelagic/open: less affected by runoff unless extreme
// - Freshwater lake: intermediate effect — no flow, but storm turnover possible
// - Claim guard awareness: turbidity is inferred, never directly measured by this engine
//
// Data used:
// - precip48hrInches (primary)
// - precip7dayInches (secondary, for saturation context)
// - precipInHr (current; active rain)
// =============================================================================

import type {
  SingleAssessment,
  NormalizedEnvironmentV2,
  ResolvedContext,
} from '../types/contracts.ts';

type PrecipCategory =
  | 'none'
  | 'light_recent'    // 48h total 0.1–0.75"
  | 'moderate_recent' // 48h total 0.75–2.0"
  | 'heavy_recent'    // 48h total > 2.0"
  | 'active'          // currently raining
  | 'unknown';

function classifyPrecip(env: NormalizedEnvironmentV2): PrecipCategory {
  const currentRate = env.current.precipInHr ?? 0;
  const precip48 = env.histories.precip48hrInches;
  const precip7day = env.histories.precip7dayInches;

  if (currentRate > 0.1) return 'active';
  if (precip48 == null && precip7day == null) return 'unknown';

  const p48 = precip48 ?? 0;
  if (p48 > 2.0) return 'heavy_recent';
  if (p48 > 0.75) return 'moderate_recent';
  if (p48 > 0.1) return 'light_recent';
  return 'none';
}

function precipToScore(
  category: PrecipCategory,
  ctx: ResolvedContext,
  precip7day: number | null | undefined
): { score: number; stateLabel: string; tags: string[]; direction: 'positive' | 'negative' | 'neutral'; claimGuardNeeded: boolean } {
  const isRiver = ctx.environmentMode === 'freshwater_river';
  const isBrackish = ctx.environmentMode === 'brackish';
  const isSalt = ctx.environmentMode === 'saltwater';
  const isLake = ctx.environmentMode === 'freshwater_lake';

  // Saturation context: high 7-day totals = likely still elevated flow/runoff
  const saturated = (precip7day ?? 0) > 4.0;

  switch (category) {
    case 'none':
      return {
        score: 62,
        stateLabel: 'dry_stable_conditions',
        tags: ['no_recent_precipitation', 'stable_water_conditions'],
        direction: 'neutral',
        claimGuardNeeded: false,
      };

    case 'light_recent':
      return {
        score: 60,
        stateLabel: 'light_recent_rain',
        tags: ['light_recent_rain', 'minimal_impact_on_conditions'],
        direction: 'neutral',
        claimGuardNeeded: false,
      };

    case 'active':
      // Active rain: rivers/brackish more affected; salt/lake minor
      if (isRiver || isBrackish) {
        return {
          score: 35,
          stateLabel: 'active_rain_suppression',
          tags: ['active_rainfall', 'runoff_affecting_conditions', 'conditions_degrading'],
          direction: 'negative',
          claimGuardNeeded: false,
        };
      }
      return {
        score: 48,
        stateLabel: 'active_rain_minor',
        tags: ['active_rain', 'moderate_impact_on_conditions'],
        direction: 'neutral',
        claimGuardNeeded: false,
      };

    case 'moderate_recent': {
      let baseScore = isSalt ? 56 : isLake ? 50 : 42; // rivers/brackish most affected
      if (saturated) baseScore -= 6;
      return {
        score: Math.max(25, baseScore),
        stateLabel: isRiver ? 'moderate_rain_river_affected' : 'moderate_recent_rain',
        tags: isRiver
          ? ['moderate_recent_rain', 'river_flow_likely_elevated', 'water_clarity_may_be_reduced']
          : isBrackish
            ? ['moderate_recent_rain', 'marsh_sediment_flush_possible', 'conditions_mixed']
            : ['moderate_recent_rain', 'conditions_somewhat_affected'],
        direction: isRiver || isBrackish ? 'negative' : 'neutral',
        claimGuardNeeded: isRiver || isBrackish, // turbidity inferred
      };
    }

    case 'heavy_recent': {
      // Heavy rain is broadly suppressive, most pronounced for rivers
      let baseScore = isSalt ? 48 : isLake ? 40 : 28;
      if (saturated) baseScore -= 8;
      return {
        score: Math.max(18, baseScore),
        stateLabel: isRiver ? 'heavy_rain_runoff_suppression' : 'heavy_recent_rain',
        tags: isRiver
          ? ['heavy_recent_rain', 'elevated_flow_likely', 'unstable_river_conditions', 'turbidity_likely_elevated']
          : isBrackish
            ? ['heavy_recent_rain', 'sediment_flush', 'degraded_clarity_inferred', 'conditions_difficult']
            : isLake
              ? ['heavy_recent_rain', 'storm_turnover_possible', 'conditions_disrupted']
              : ['heavy_recent_rain', 'conditions_somewhat_affected'],
        direction: 'negative',
        claimGuardNeeded: true, // turbidity is always inferred
      };
    }

    case 'unknown':
    default:
      return {
        score: 52,
        stateLabel: 'precipitation_data_unavailable',
        tags: ['precipitation_history_not_available'],
        direction: 'neutral',
        claimGuardNeeded: false,
      };
  }
}

// ---------------------------------------------------------------------------
// Main precip/runoff assessment
// ---------------------------------------------------------------------------

export function assessPrecipRunoff(
  env: NormalizedEnvironmentV2,
  ctx: ResolvedContext
): SingleAssessment & { claimGuardNeeded: boolean } {
  const category = classifyPrecip(env);
  const { score, stateLabel, tags, direction, claimGuardNeeded } = precipToScore(
    category,
    ctx,
    env.histories.precip7dayInches
  );

  return {
    componentScore: Math.max(0, Math.min(100, score)),
    stateLabel,
    dominantTags: tags,
    direction,
    confidenceDependency: category === 'unknown' ? 'low'
      : claimGuardNeeded ? 'low'
      : 'moderate',
    applicable: true,
    claimGuardNeeded,
  };
}
