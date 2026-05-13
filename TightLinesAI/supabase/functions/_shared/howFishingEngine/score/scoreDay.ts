import type { ScoreBand, ScoredVariableKey, SharedNormalizedOutput } from "../contracts/mod.ts";
import type { ActiveVariableScore } from "./types.ts";
import { labelForDriver } from "./driverLabels.ts";
import { computeActiveWeights } from "./reweight.ts";

const FACTOR_SURFACE_MIN_WEIGHTED_CONTRIBUTION = 6;
const POSITIVE_RAW_SCORE_DIVISOR = 3.2;
const NEGATIVE_RAW_SCORE_DIVISOR = 4;
const MAJOR_SUPPRESSOR_POLICY_THRESHOLD = -10;

function scoreForKey(
  key: ScoredVariableKey,
  norm: SharedNormalizedOutput["normalized"]
): number | null {
  switch (key) {
    case "temperature_condition":
      return norm.temperature?.final_score ?? null;
    case "pressure_regime":
      return norm.pressure_regime?.score ?? null;
    case "wind_condition":
      return norm.wind_condition?.score ?? null;
    case "light_cloud_condition":
      return norm.light_cloud_condition?.score ?? null;
    case "precipitation_disruption":
      return norm.precipitation_disruption?.score ?? null;
    case "runoff_flow_disruption":
      return norm.runoff_flow_disruption?.score ?? null;
    case "tide_current_movement":
      return norm.tide_current_movement?.score ?? null;
    default:
      return null;
  }
}

export function bandFromScore(score0to100: number): ScoreBand {
  if (score0to100 >= 80) return "Prime";
  if (score0to100 >= 65) return "Good";
  if (score0to100 >= 50) return "Fair";
  if (score0to100 >= 35) return "Poor";
  return "Tough";
}

export function scoreDay(norm: SharedNormalizedOutput): {
  score: number;
  band: ScoreBand;
  contributions: ActiveVariableScore[];
  drivers: ActiveVariableScore[];
  suppressors: ActiveVariableScore[];
} {
  const available = new Set(norm.available_variables);
  const weights = computeActiveWeights(
    norm.context,
    norm.location.region_key,
    norm.location.local_date,
    available
  );

  const contributions: ActiveVariableScore[] = [];
  for (const { key, finalWeight } of weights) {
    const vs = scoreForKey(key, norm.normalized);
    if (vs == null) continue;
    contributions.push({
      key,
      score: vs,
      label: labelForDriver(key, norm.normalized),
      weight: finalWeight,
      weightedContribution: finalWeight * vs,
    });
  }

  const rawSum = contributions.reduce((a, c) => a + c.weightedContribution, 0);
  const score = Math.round(
    rawSum >= 0
      ? 50 + rawSum / POSITIVE_RAW_SCORE_DIVISOR
      : 50 + rawSum / NEGATIVE_RAW_SCORE_DIVISOR
  );
  // Floor at 10 so the display minimum is 1.0/10 — catastrophic conditions still
  // show a number rather than zero. The positive side uses a slightly more
  // generous ramp so context-perfect seasonal setups can realistically reach
  // the top band, while the negative side stays unchanged to avoid making poor
  // conditions look too forgiving.
  const clamped = Math.max(10, Math.min(100, score));
  const pos = contributions
    .filter((c) => c.weightedContribution > 0)
    .sort((a, b) => b.weightedContribution - a.weightedContribution);
  const neg = contributions
    .filter((c) => c.weightedContribution < 0)
    .sort((a, b) => a.weightedContribution - b.weightedContribution);

  const baseOrder = (k: ScoredVariableKey) =>
    weights.find((w) => w.key === k)?.base ?? 0;

  const tieBreak = (a: ActiveVariableScore, b: ActiveVariableScore) =>
    baseOrder(b.key) - baseOrder(a.key);

  pos.sort((a, b) =>
    b.weightedContribution !== a.weightedContribution
      ? b.weightedContribution - a.weightedContribution
      : tieBreak(a, b)
  );
  neg.sort((a, b) =>
    a.weightedContribution !== b.weightedContribution
      ? a.weightedContribution - b.weightedContribution
      : tieBreak(a, b)
  );

  const surfacedDrivers = pos.filter((c) =>
    c.weightedContribution >= FACTOR_SURFACE_MIN_WEIGHTED_CONTRIBUTION
  );
  const surfacedSuppressors = neg.filter((c) =>
    c.weightedContribution <= -FACTOR_SURFACE_MIN_WEIGHTED_CONTRIBUTION
  );

  // Phase 9F production-wired rain/wet final-score policy. Rollback is local:
  // return `clamped`/`bandFromScore(clamped)` directly without changing
  // normalizers, callers, contributions, drivers, or suppressors.
  const finalScore = applyRainWetFinalScorePolicy(
    clamped,
    norm,
    surfacedSuppressors,
  );

  return {
    score: finalScore,
    band: bandFromScore(finalScore),
    contributions,
    drivers: surfacedDrivers.slice(0, 2),
    suppressors: surfacedSuppressors.slice(0, 2),
  };
}

function applyRainWetFinalScorePolicy(
  score: number,
  norm: SharedNormalizedOutput,
  suppressors: ActiveVariableScore[],
): number {
  let capped = score;
  if (hasActiveRainDisruption(norm)) capped = Math.min(capped, 55);
  if (hasWetRecentRainDisruption(norm)) capped = Math.min(capped, 65);
  if (hasMajorSuppressor(suppressors) && capped > 70) capped = 69;
  return capped;
}

function hasActiveRainDisruption(norm: SharedNormalizedOutput): boolean {
  return norm.normalized.precipitation_disruption?.label ===
    "active_disruption";
}

function hasWetRecentRainDisruption(norm: SharedNormalizedOutput): boolean {
  const precip = norm.normalized.precipitation_disruption;
  return precip?.label === "recent_rain" && precip.score <= -0.45;
}

function hasMajorSuppressor(suppressors: ActiveVariableScore[]): boolean {
  return suppressors.some((s) =>
    s.weightedContribution <= MAJOR_SUPPRESSOR_POLICY_THRESHOLD
  );
}
