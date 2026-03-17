// =============================================================================
// ENGINE V3 — Measured Scoring Engine
// Phase 3: Measured-only scoring, regime, weighting, missing-data reweighting.
// Historical baselines are context only — never substitute for measured vars.
// =============================================================================

import type {
  NormalizedEnvironmentV3,
  GeoContextV3,
  ScoreEngineResultV3,
  ScoreVariableContributionV3,
  ScoreVariableId,
  RegimeV3,
  DataCoverageV3,
} from './types.ts';
import type { WeightProfile } from './weights/weightProfiles.ts';
import { getWeightProfile } from './weights/weightProfiles.ts';
import { reweightForMissingAndRegime } from './weights/reweight.ts';
import { resolvePrimaryConditionsRegime } from './regime/resolveRegime.ts';
import { runAssessmentsV3, type AssessmentResultV3 } from './assessments/assessmentsV3.ts';

function scoreToBand(score: number): 'Poor' | 'Fair' | 'Good' | 'Great' {
  if (score < 35) return 'Poor';
  if (score < 55) return 'Fair';
  if (score < 75) return 'Good';
  return 'Great';
}

/**
 * Determines which variables are eligible for scoring:
 * - In the weight profile for this mode
 * - Assessment returned applicable
 * - Assessment has data (missing vars are removed, weights renormalized)
 */
function getEligibleVariables(
  profile: WeightProfile,
  assessments: Map<ScoreVariableId, AssessmentResultV3>
): ScoreVariableId[] {
  const eligible: ScoreVariableId[] = [];
  for (const v of profile.variables) {
    const a = assessments.get(v.variableId);
    if (!a) continue;
    if (!a.applicable) continue;
    if (!a.hasData) continue;
    eligible.push(v.variableId);
  }
  return eligible;
}

/**
 * Runs the V3 measured scoring engine.
 * - No inferred freshwater water temp
 * - Historical baselines are context only
 * - Regime and missing-data reweighting applied
 */
export function runScoreEngineV3(
  env: NormalizedEnvironmentV3,
  geoContext: GeoContextV3
): ScoreEngineResultV3 {
  const mode = geoContext.environmentMode;
  const region = geoContext.region;
  const month = geoContext.month;

  const profile = getWeightProfile(region, month, mode);
  const assessments = runAssessmentsV3(env, geoContext);
  const regime = resolvePrimaryConditionsRegime(env, geoContext);

  const eligibleVariables = getEligibleVariables(profile, assessments);
  const reweight = reweightForMissingAndRegime(profile, eligibleVariables, regime);

  const contributions: ScoreVariableContributionV3[] = [];
  let weightedSum = 0;

  for (const v of profile.variables) {
    const a = assessments.get(v.variableId);
    const baseWeight = reweight.baseWeights[v.variableId] ?? 0;
    const regimeScaled = reweight.regimeScaledWeights[v.variableId] ?? 0;
    const finalWeight = reweight.finalNormalizedWeights[v.variableId] ?? 0;
    const isEligible = eligibleVariables.includes(v.variableId);

    const contrib: ScoreVariableContributionV3 = {
      variableId: v.variableId,
      tier: v.tier,
      componentScore: a?.componentScore ?? 50,
      baseWeight,
      regimeScaledWeight: regimeScaled,
      finalNormalizedWeight: finalWeight,
      direction: a?.direction ?? 'neutral',
      stateLabel: a?.stateLabel ?? 'unknown',
      tags: a?.tags ?? [],
      applicable: isEligible,
    };
    contributions.push(contrib);

    if (isEligible && a) {
      weightedSum += a.componentScore * finalWeight;
    }
  }

  const overallScore = Math.round(Math.max(0, Math.min(100, weightedSum)));
  const scoreBand = scoreToBand(overallScore);

  const topDrivers = contributions
    .filter((c) => c.applicable && c.direction === 'positive' && c.componentScore >= 65)
    .sort((a, b) => b.componentScore - a.componentScore)
    .slice(0, 5)
    .map((c) => c.stateLabel);

  const topSuppressors = contributions
    .filter((c) => c.applicable && c.direction === 'negative' && c.componentScore < 50)
    .sort((a, b) => a.componentScore - b.componentScore)
    .slice(0, 5)
    .map((c) => c.stateLabel);

  return {
    overallScore,
    scoreBand,
    regime,
    contributions,
    topDrivers,
    topSuppressors,
    weightProfileId: profile.profileId,
    eligibleVariables,
    removedVariables: reweight.removedVariables,
    baseWeights: reweight.baseWeights,
    regimeScaledWeights: reweight.regimeScaledWeights,
    finalNormalizedWeights: reweight.finalNormalizedWeights,
    dataCoverageUsed: env.data_coverage,
  };
}
