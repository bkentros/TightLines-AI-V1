// =============================================================================
// ENGINE V3 — Missing-Data Reweighting and Regime Scaling
// - Missing variables are removed; remaining weights renormalized
// - Regime modulates base weights (supportive: secondary/tertiary gain; suppressive: tertiary muted)
// =============================================================================

import type { RegimeV3, ScoreVariableId, VariableTierV3 } from '../types.ts';
import type { WeightProfile, VariableWeightEntry } from './weightProfiles.ts';

export interface ReweightResult {
  eligibleVariables: ScoreVariableId[];
  removedVariables: ScoreVariableId[];
  baseWeights: Record<ScoreVariableId, number>;
  regimeScaledWeights: Record<ScoreVariableId, number>;
  finalNormalizedWeights: Record<ScoreVariableId, number>;
}

/** Regime scaling factors by tier. Supportive: secondary/tertiary gain; highly_suppressive: tertiary muted. */
const REGIME_TIER_SCALARS: Record<RegimeV3, Record<VariableTierV3, number>> = {
  supportive: {
    primary: 1.0,
    secondary: 1.25,
    tertiary: 1.35,
  },
  neutral: {
    primary: 1.0,
    secondary: 1.0,
    tertiary: 1.0,
  },
  suppressive: {
    primary: 1.15,
    secondary: 0.85,
    tertiary: 0.5,
  },
  highly_suppressive: {
    primary: 1.2,
    secondary: 0.6,
    tertiary: 0.2,
  },
};

/**
 * 1. Filter to eligible variables (in profile and has data)
 * 2. Apply regime scaling to base weights
 * 3. Renormalize so eligible weights sum to 1.0
 */
export function reweightForMissingAndRegime(
  profile: WeightProfile,
  eligibleVariableIds: ScoreVariableId[],
  regime: RegimeV3
): ReweightResult {
  const removedVariables: ScoreVariableId[] = [];
  const baseWeights: Record<ScoreVariableId, number> = {} as Record<ScoreVariableId, number>;
  const regimeScaledWeights: Record<ScoreVariableId, number> = {} as Record<ScoreVariableId, number>;
  const finalNormalizedWeights: Record<ScoreVariableId, number> = {} as Record<ScoreVariableId, number>;

  const profileVarIds = new Set(profile.variables.map((v) => v.variableId));
  const eligibleSet = new Set(eligibleVariableIds);

  for (const v of profile.variables) {
    const id = v.variableId;
    baseWeights[id] = v.baseWeight;

    if (!eligibleSet.has(id)) {
      removedVariables.push(id);
      regimeScaledWeights[id] = 0;
      finalNormalizedWeights[id] = 0;
      continue;
    }

    const scalars = REGIME_TIER_SCALARS[regime];
    const scalar = scalars[v.tier] ?? 1.0;
    regimeScaledWeights[id] = v.baseWeight * scalar;
  }

  // Sum of regime-scaled weights for eligible vars
  let sum = 0;
  for (const id of eligibleVariableIds) {
    sum += regimeScaledWeights[id] ?? 0;
  }

  if (sum <= 0) {
    // Fallback: equal weights for eligible
    const n = eligibleVariableIds.length;
    const eq = n > 0 ? 1 / n : 0;
    for (const id of eligibleVariableIds) {
      finalNormalizedWeights[id] = eq;
    }
  } else {
    for (const id of eligibleVariableIds) {
      finalNormalizedWeights[id] = (regimeScaledWeights[id] ?? 0) / sum;
    }
  }

  return {
    eligibleVariables: eligibleVariableIds,
    removedVariables,
    baseWeights,
    regimeScaledWeights,
    finalNormalizedWeights,
  };
}
