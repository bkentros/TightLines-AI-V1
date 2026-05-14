import type {
  EngineContext,
  ScoreBand,
  ScoredVariableKey,
  SharedNormalizedOutput,
} from "../contracts/mod.ts";
import type { ActiveVariableScore } from "./types.ts";
import { labelForDriver } from "./driverLabels.ts";
import { computeActiveWeights } from "./reweight.ts";
import { freshwaterEliteEnvelopeRaw } from "../config/freshwaterEliteEnvelopes.ts";

const FACTOR_SURFACE_MIN_WEIGHTED_CONTRIBUTION = 6;
const POSITIVE_RAW_SCORE_DIVISOR = 3.2;
const NEGATIVE_RAW_SCORE_DIVISOR = 4;
const MAJOR_SUPPRESSOR_POLICY_THRESHOLD = -10;

function scoreForKey(
  key: ScoredVariableKey,
  norm: SharedNormalizedOutput["normalized"],
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
    available,
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
      : 50 + rawSum / NEGATIVE_RAW_SCORE_DIVISOR,
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
  const curveAdjusted = applyEliteScoreCurvePolicy(
    clamped,
    norm,
    contributions,
    rawSum,
  );

  const finalScore = applyRainWetFinalScorePolicy(
    curveAdjusted,
    norm,
    contributions,
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
  contributions: ActiveVariableScore[],
  suppressors: ActiveVariableScore[],
): number {
  let capped = score;
  const precipScore = norm.normalized.precipitation_disruption?.score;
  if (precipScore != null && precipScore <= -1.1) {
    capped = Math.min(capped, 55);
  } else if (precipScore != null && precipScore <= -0.45) {
    capped = Math.min(
      capped,
      Math.round(55 + 10 * smoothstep(-1.1, -0.45, precipScore)),
    );
  }
  if (hasMajorSuppressor(suppressors) && capped > 70) capped = 69;
  if (isMissingOrPartial(norm) && capped > 64) capped = 64;
  if (norm.reliability !== "high" && capped > 72) capped = 72;
  if (strongestSuppressor(contributions) >= 10 && capped > 69) capped = 69;
  return capped;
}

function hasMajorSuppressor(suppressors: ActiveVariableScore[]): boolean {
  return suppressors.some((s) =>
    s.weightedContribution <= MAJOR_SUPPRESSOR_POLICY_THRESHOLD
  );
}

function applyEliteScoreCurvePolicy(
  score: number,
  norm: SharedNormalizedOutput,
  contributions: ActiveVariableScore[],
  rawSum: number,
): number {
  if (!isFreshwaterContext(norm.context) || !hasCompleteHighQualityData(norm)) {
    return score;
  }

  const month = parseInt(norm.location.local_date.slice(5, 7), 10) || 1;
  const envelope = freshwaterEliteEnvelopeRaw(
    norm.location.region_key,
    month,
    norm.context,
  );
  if (envelope == null || envelope <= 0) return score;

  const pos = positiveDriverMass(contributions);
  const suppressor = strongestSuppressor(contributions);
  const rawRatio = rawSum / envelope;
  const posGate = norm.context === "freshwater_lake_pond"
    ? smoothstep(68, 82, pos)
    : smoothstep(52, 68, pos);
  const suppressorGate = 1 - smoothstep(2.5, 5.5, suppressor);
  const relativeGate = smoothstep(0.88, 1.0, rawRatio) *
    posGate *
    suppressorGate;
  const maxBoost = norm.context === "freshwater_lake_pond" ? 22 : 26;
  let adjusted = Math.min(94, Math.round(score + maxBoost * relativeGate));

  const rareGate = rareUpperNineGate(norm, rawRatio, suppressor);
  adjusted = Math.min(98, Math.round(adjusted + 5 * rareGate));
  return adjusted;
}

function rareUpperNineGate(
  norm: SharedNormalizedOutput,
  rawRatio: number,
  suppressor: number,
): number {
  const n = norm.normalized;
  const noWetPrecip = (n.precipitation_disruption?.score ?? 0) > -0.15;
  const movementOk = norm.context === "freshwater_river"
    ? (n.runoff_flow_disruption?.score ?? -2) >= 0.45
    : true;
  if (!noWetPrecip || !movementOk) return 0;
  return smoothstep(0.98, 1.02, rawRatio) *
    smoothstep(1.65, 1.9, n.temperature?.final_score ?? -2) *
    smoothstep(0.7, 1.1, n.wind_condition?.score ?? -2) *
    smoothstep(0.7, 1.0, n.light_cloud_condition?.score ?? -2) *
    (1 - smoothstep(1.5, 3.5, suppressor));
}

function isFreshwaterContext(context: EngineContext): boolean {
  return context === "freshwater_lake_pond" || context === "freshwater_river";
}

function hasCompleteHighQualityData(norm: SharedNormalizedOutput): boolean {
  return norm.reliability === "high" && !isMissingOrPartial(norm);
}

function isMissingOrPartial(norm: SharedNormalizedOutput): boolean {
  return norm.missing_variables.length > 0 || norm.data_gaps.length > 0;
}

function positiveDriverMass(contributions: ActiveVariableScore[]): number {
  return contributions
    .filter((c) => c.weightedContribution > 0)
    .reduce((sum, c) => sum + c.weightedContribution, 0);
}

function strongestSuppressor(contributions: ActiveVariableScore[]): number {
  return Math.max(
    0,
    ...contributions
      .filter((c) => c.weightedContribution < 0)
      .map((c) => Math.abs(c.weightedContribution)),
  );
}

function smoothstep(edge0: number, edge1: number, value: number): number {
  if (edge0 === edge1) return value >= edge1 ? 1 : 0;
  const x = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));
  return x * x * (3 - 2 * x);
}
