import type {
  EngineContext,
  RegionKey,
  ScoreBand,
  ScoredVariableKey,
  SharedNormalizedOutput,
  TimingStrength,
} from "../contracts/mod.ts";
import type { ActiveVariableScore } from "./types.ts";
import { labelForDriver } from "./driverLabels.ts";
import { computeActiveWeights } from "./reweight.ts";
import { freshwaterEliteEnvelopeRaw } from "../config/freshwaterEliteEnvelopes.ts";
import { ENGINE_SCORE_EPSILON } from "./engineScoreMath.ts";

const FACTOR_SURFACE_MIN_WEIGHTED_CONTRIBUTION = 6;
const FACTOR_SURFACE_MIN_ENGINE_SCORE = ENGINE_SCORE_EPSILON;
const V43_FACTOR_SURFACE_MIN_ENGINE_SCORE = 0.01;
const POSITIVE_RAW_SCORE_DIVISOR = 3.2;
const NEGATIVE_RAW_SCORE_DIVISOR = 4;
const MAJOR_SUPPRESSOR_POLICY_THRESHOLD = -10;
const UNDERPARITY_REGIONS = new Set<RegionKey>([
  "northeast",
  "florida",
  "mountain_west",
  "pacific_northwest",
  "northern_california",
  "appalachian",
  "inland_northwest",
  "hawaii",
]);

export type ScoreDayOptions = {
  mode?: "production" | "legacy";
  timingStrength?: TimingStrength | null;
  currentSpeedKnotsMax?: number | null;
  activePrecipNow?: boolean | null;
  precipRateNowInPerHr?: number | null;
  precip72hIn?: number | null;
  precip7dIn?: number | null;
};

export type ScoreDayResult = {
  score: number;
  band: ScoreBand;
  contributions: ActiveVariableScore[];
  drivers: ActiveVariableScore[];
  suppressors: ActiveVariableScore[];
  normalized: SharedNormalizedOutput;
  legacy_score?: number;
  legacy_band?: ScoreBand;
  prime_disqualification_reasons?: string[];
};

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

export function scoreDay(
  norm: SharedNormalizedOutput,
  options: ScoreDayOptions = {},
): ScoreDayResult {
  const legacy = scoreDayLegacy(norm);
  if (options.mode === "legacy") return legacy;
  return scoreDayV46CombinedLight(norm, legacy, options);
}

function scoreDayLegacy(norm: SharedNormalizedOutput): ScoreDayResult {
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

  // Report factor rows should explain conditions that are meaningfully helping
  // or limiting, not every tiny weighted edge. The score keeps all nuance, but
  // the user-facing factor list requires both local variable strength and
  // enough weighted impact to avoid contradictory-looking copy near neutral.
  const surfacedDrivers = pos.filter((c) =>
    c.weightedContribution >= FACTOR_SURFACE_MIN_WEIGHTED_CONTRIBUTION &&
    c.score >= FACTOR_SURFACE_MIN_ENGINE_SCORE
  );
  const surfacedSuppressors = neg.filter((c) =>
    c.weightedContribution <= -FACTOR_SURFACE_MIN_WEIGHTED_CONTRIBUTION &&
    c.score <= -FACTOR_SURFACE_MIN_ENGINE_SCORE
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
    neg,
  );

  return {
    score: finalScore,
    band: bandFromScore(finalScore),
    contributions,
    drivers: surfacedDrivers.slice(0, 2),
    suppressors: surfacedSuppressors.slice(0, 2),
    normalized: norm,
  };
}

type SupportDiagnostics = {
  positiveDriverMass: number;
  negativeSuppressorMass: number;
  strongestDriverContribution: number;
  strongestSuppressorContribution: number;
  surfacedDriverCount: number;
  surfacedSuppressorCount: number;
  hasRealDriver: boolean;
};

type V43RowFacts = {
  norm: SharedNormalizedOutput;
  legacy: ScoreDayResult;
  contributions: ActiveVariableScore[];
  drivers: ActiveVariableScore[];
  suppressors: ActiveVariableScore[];
  support: SupportDiagnostics;
  activeHeavyRain: boolean;
  recentWetRain: boolean;
  severeThermal: boolean;
  severeMovementRunoffPrecip: boolean;
  shutdown: boolean;
  majorSuppressor: boolean;
  moderateSuppressor: boolean;
  supportScore: number;
  cleanSupport: boolean;
  strongSupport: boolean;
  trustedSuppressorSupport: boolean;
};

function scoreDayV46CombinedLight(
  norm: SharedNormalizedOutput,
  legacy: ScoreDayResult,
  options: ScoreDayOptions,
): ScoreDayResult {
  const activeHeavyRain = Boolean(
    options.activePrecipNow && (options.precipRateNowInPerHr ?? 0) >= 0.05,
  );
  const recentWetRain = (options.precip72hIn ?? 0) >= 1.0 ||
    (options.precip7dIn ?? 0) >= 2.0 ||
    (norm.normalized.runoff_flow_disruption?.score ?? 0) <= -1;

  const baseFacts = buildV43Facts(
    norm,
    legacy,
    legacy.contributions,
    legacy.drivers,
    legacy.suppressors,
    activeHeavyRain,
    recentWetRain,
  );
  const adjustedNorm = adjustV43NormalizedTemperature(norm, baseFacts);
  const contributions = legacy.contributions.map((c) => {
    const adjustedScore = c.key === "temperature_condition"
      ? (adjustedNorm.normalized.temperature?.final_score ?? c.score)
      : c.score;
    const adjustedWeight = v43WeightFor(baseFacts, c);
    return {
      ...c,
      score: adjustedScore,
      weight: adjustedWeight,
      weightedContribution: adjustedScore * adjustedWeight,
      label: labelForDriver(c.key, adjustedNorm.normalized),
    };
  });
  const drivers = surfaceContributions(contributions, true);
  const suppressors = surfaceContributions(contributions, false);
  const adjustedFacts = buildV43Facts(
    adjustedNorm,
    legacy,
    contributions,
    drivers,
    suppressors,
    activeHeavyRain,
    recentWetRain,
  );

  const rawSum = contributions.reduce(
    (sum, c) => sum + c.weightedContribution,
    0,
  );
  let score = scoreFromRawSum(rawSum);
  adjustedFacts.supportScore = score;
  adjustedFacts.trustedSuppressorSupport = trustedSuppressorSupport(
    adjustedFacts,
  );
  if (!adjustedFacts.shutdown) {
    score += curveLiftV3(score);
    if (adjustedFacts.support.hasRealDriver) {
      let lift = timingLiftV3(options.timingStrength ?? null);
      if (adjustedFacts.moderateSuppressor || adjustedFacts.majorSuppressor) {
        lift = adjustedFacts.trustedSuppressorSupport ||
            v43TrustedTempSupport(adjustedFacts)
          ? Math.min(lift, 1)
          : 0;
      }
      score += lift;
    }
    if (
      score >= 65 &&
      legacy.band !== "Good" &&
      !adjustedFacts.cleanSupport &&
      !adjustedFacts.strongSupport &&
      !adjustedFacts.trustedSuppressorSupport &&
      !v43TrustedTempSupport(adjustedFacts)
    ) {
      score = Math.min(score, 64);
    }
    if (primeBumpEligibleV43Base(adjustedFacts, score, options)) score += 3;
    if (
      score < 80 &&
      primeBumpEligibleV43TailPlus(adjustedFacts, score, options)
    ) {
      score += 3;
    }
    if (!v43RuntimePrimeEligible(adjustedFacts, score, options)) {
      score = Math.min(score, 79);
    }
    const beforeV46 = score;
    score = v46MiddleSpread(adjustedFacts, score);
    score = v46LowPrimeBridge(adjustedFacts, score, options);
    if (
      beforeV46 < 80 &&
      score >= 80 &&
      !v46PrimeEligibleExceptScore(adjustedFacts, beforeV46, options)
    ) {
      score = 79;
    }
    if (!v43RuntimePrimeEligible(adjustedFacts, score, options)) {
      score = Math.min(score, 79);
    }
    score = v43RuntimeContinuousTailScore(adjustedFacts, score, options);
    if (!v43RuntimePrimeEligible(adjustedFacts, score, options)) {
      score = Math.min(score, 79);
    }
  }

  score = Math.round(Math.max(
    10,
    Math.min(100, applyV43Caps(adjustedFacts, baseFacts, score)),
  ));
  if (!adjustedFacts.shutdown && score < legacy.score) score = legacy.score;

  return {
    score,
    band: bandFromScore(score),
    contributions,
    drivers,
    suppressors,
    normalized: adjustedNorm,
    legacy_score: legacy.score,
    legacy_band: legacy.band,
    prime_disqualification_reasons: v43RuntimePrimeDisqualificationReasons(
      adjustedFacts,
      score,
      options,
    ),
  };
}

function v46HardSpreadBlock(facts: V43RowFacts): boolean {
  return facts.shutdown ||
    facts.activeHeavyRain ||
    facts.recentWetRain ||
    facts.severeMovementRunoffPrecip ||
    isMissingOrPartial(facts.norm) ||
    facts.norm.reliability !== "high";
}

function v46StrongDriverSupport(facts: V43RowFacts): boolean {
  const support = facts.support;
  const dominance = support.positiveDriverMass -
    support.negativeSuppressorMass;
  return support.surfacedDriverCount >= 2 &&
    dominance >= 14 &&
    support.strongestDriverContribution >= 14 &&
    (facts.cleanSupport ||
      facts.strongSupport ||
      facts.trustedSuppressorSupport);
}

function v46StrongSuppressorSupport(facts: V43RowFacts): boolean {
  const support = facts.support;
  return support.surfacedSuppressorCount >= 1 &&
    support.negativeSuppressorMass >= 10 &&
    !facts.trustedSuppressorSupport &&
    support.positiveDriverMass < support.negativeSuppressorMass + 10;
}

function v46MiddleSpread(facts: V43RowFacts, score: number): number {
  if (v46HardSpreadBlock(facts) || facts.severeThermal) return score;
  const support = facts.support;
  const dominance = support.positiveDriverMass -
    support.negativeSuppressorMass;
  let spread = 0;
  if (
    score >= 59 &&
    score < 65 &&
    v46StrongDriverSupport(facts) &&
    dominance >= 14
  ) {
    spread += 3;
    if (support.positiveDriverMass >= 58) spread += 1;
  }
  if (score >= 50 && score <= 58 && v46StrongSuppressorSupport(facts)) {
    spread -= 2;
    if (support.negativeSuppressorMass >= 20) spread -= 1;
  }
  if (facts.moderateSuppressor || facts.majorSuppressor) {
    spread = Math.min(spread, facts.trustedSuppressorSupport ? 1 : 0);
  }
  return score + spread;
}

function v46PrimeEligibleExceptScore(
  facts: V43RowFacts,
  score: number,
  options: ScoreDayOptions,
): boolean {
  return score < 80 &&
    v43RuntimePrimeDisqualificationReasons(facts, score, options).length === 0;
}

function v46LowPrimeBridge(
  facts: V43RowFacts,
  score: number,
  options: ScoreDayOptions,
): number {
  if (v46HardSpreadBlock(facts) || facts.severeThermal) return score;
  if (score < 75 || score >= 80) return score;
  if (!v46PrimeEligibleExceptScore(facts, score, options)) return score;
  const support = facts.support;
  const dominance = support.positiveDriverMass -
    support.negativeSuppressorMass;
  if (
    support.surfacedDriverCount < 2 ||
    !facts.cleanSupport ||
    support.positiveDriverMass < 60 ||
    support.negativeSuppressorMass > 2.5 ||
    support.strongestDriverContribution < 16 ||
    (support.positiveDriverMass < 68 &&
      support.strongestDriverContribution >
        support.positiveDriverMass * 0.72) ||
    dominance < 22 ||
    normalizedCleanliness(facts.norm) <= -0.25
  ) {
    return score;
  }
  return score + (80 - score);
}

function buildV43Facts(
  norm: SharedNormalizedOutput,
  legacy: ScoreDayResult,
  contributions: ActiveVariableScore[],
  drivers: ActiveVariableScore[],
  suppressors: ActiveVariableScore[],
  activeHeavyRain: boolean,
  recentWetRain: boolean,
): V43RowFacts {
  const support = conditionSupport(contributions, drivers, suppressors);
  const severeThermal =
    (norm.normalized.temperature?.final_score ?? 0) <= -1.75;
  const severeMovementRunoffPrecip =
    (norm.normalized.precipitation_disruption?.score ?? 0) <= -1.5 ||
    (norm.normalized.runoff_flow_disruption?.score ?? 0) <= -1.5 ||
    (norm.normalized.wind_condition?.score ?? 0) <= -1.5 ||
    (norm.normalized.tide_current_movement?.score ?? 0) <= -1.5;
  const shutdown = activeHeavyRain || severeMovementRunoffPrecip;
  const majorSuppressor = support.strongestSuppressorContribution <= -10;
  const moderateSuppressor = support.strongestSuppressorContribution <= -6;
  const base: V43RowFacts = {
    norm,
    legacy,
    contributions,
    drivers,
    suppressors,
    support,
    activeHeavyRain,
    recentWetRain,
    severeThermal,
    severeMovementRunoffPrecip,
    shutdown,
    majorSuppressor,
    moderateSuppressor,
    supportScore: legacy.score,
    cleanSupport: false,
    strongSupport: false,
    trustedSuppressorSupport: false,
  };
  base.cleanSupport = cleanSupport(base);
  base.strongSupport = strongSupport(base);
  base.trustedSuppressorSupport = trustedSuppressorSupport(base);
  return base;
}

function conditionSupport(
  contributions: ActiveVariableScore[],
  drivers: ActiveVariableScore[],
  suppressors: ActiveVariableScore[],
): SupportDiagnostics {
  const positive = contributions.filter((c) => c.weightedContribution > 0);
  const negative = contributions.filter((c) => c.weightedContribution < 0);
  const positiveDriverMass = positive.reduce(
    (sum, c) => sum + c.weightedContribution,
    0,
  );
  const negativeSuppressorMass = negative.reduce(
    (sum, c) => sum + Math.abs(c.weightedContribution),
    0,
  );
  const strongestDriverContribution = Math.max(
    0,
    ...positive.map((c) => c.weightedContribution),
  );
  const strongestSuppressorContribution = Math.min(
    0,
    ...negative.map((c) => c.weightedContribution),
  );
  return {
    positiveDriverMass,
    negativeSuppressorMass,
    strongestDriverContribution,
    strongestSuppressorContribution,
    surfacedDriverCount: drivers.length,
    surfacedSuppressorCount: suppressors.length,
    hasRealDriver: drivers.length > 0 || strongestDriverContribution >= 10,
  };
}

function adjustV43NormalizedTemperature(
  norm: SharedNormalizedOutput,
  facts: V43RowFacts,
): SharedNormalizedOutput {
  const temp = norm.normalized.temperature;
  if (!temp || !UNDERPARITY_REGIONS.has(norm.location.region_key)) return norm;
  const shockLike = Math.abs(temp.shock_adjustment ?? 0) >= 0.35 ||
    (temp.shock_label ?? "").toLowerCase().includes("shock");
  if (
    facts.severeThermal ||
    shockLike ||
    facts.activeHeavyRain ||
    facts.recentWetRain ||
    facts.shutdown ||
    isMissingOrPartial(norm) ||
    facts.severeMovementRunoffPrecip
  ) {
    return norm;
  }
  const noShock = Math.abs(temp.shock_adjustment ?? 0) < 0.2;
  const seasonalNormal = temp.final_score >= -1.55 && temp.final_score <= 0.2;
  if (!noShock || !seasonalNormal) return norm;
  const delta = Math.max(0, Math.min(1.35, 0.45 - temp.final_score));
  if (delta === 0) return norm;
  return {
    ...norm,
    normalized: {
      ...norm.normalized,
      temperature: {
        ...temp,
        final_score: Math.max(-2, Math.min(2, temp.final_score + delta)),
      },
    },
  };
}

function v43WeightFor(facts: V43RowFacts, c: ActiveVariableScore): number {
  let weight = c.weight;
  if (
    UNDERPARITY_REGIONS.has(facts.norm.location.region_key) &&
    noStructuralHardBlock(facts)
  ) {
    if (c.key === "temperature_condition" && c.score < 0) weight *= 0.88;
    if (
      (c.key === "wind_condition" || c.key === "light_cloud_condition" ||
        c.key === "tide_current_movement") &&
      c.score > 0
    ) {
      weight *= 1.05;
    }
  }
  return weight;
}

function noStructuralHardBlock(facts: V43RowFacts): boolean {
  return facts.norm.reliability === "high" &&
    !isMissingOrPartial(facts.norm) &&
    !facts.shutdown &&
    !facts.activeHeavyRain &&
    !facts.recentWetRain &&
    !facts.severeMovementRunoffPrecip;
}

function surfaceContributions(
  contributions: ActiveVariableScore[],
  positive: boolean,
): ActiveVariableScore[] {
  return contributions
    .filter((c) =>
      positive
        ? c.weightedContribution >= FACTOR_SURFACE_MIN_WEIGHTED_CONTRIBUTION &&
          c.score >= V43_FACTOR_SURFACE_MIN_ENGINE_SCORE
        : c.weightedContribution <= -FACTOR_SURFACE_MIN_WEIGHTED_CONTRIBUTION &&
          c.score <= -V43_FACTOR_SURFACE_MIN_ENGINE_SCORE
    )
    .sort((a, b) =>
      positive
        ? b.weightedContribution - a.weightedContribution
        : a.weightedContribution - b.weightedContribution
    )
    .slice(0, 2);
}

function cleanSupport(facts: V43RowFacts): boolean {
  const support = facts.support;
  return facts.norm.reliability === "high" &&
    !isMissingOrPartial(facts.norm) &&
    !facts.shutdown &&
    !facts.recentWetRain &&
    !facts.moderateSuppressor &&
    support.surfacedDriverCount >= 1 &&
    support.positiveDriverMass >= 18;
}

function strongSupport(facts: V43RowFacts): boolean {
  const support = facts.support;
  return facts.norm.reliability === "high" &&
    !isMissingOrPartial(facts.norm) &&
    !facts.shutdown &&
    !facts.recentWetRain &&
    support.surfacedDriverCount >= 1 &&
    support.positiveDriverMass >= 24 &&
    support.positiveDriverMass >= support.negativeSuppressorMass + 10;
}

function trustedSuppressorSupport(facts: V43RowFacts): boolean {
  const support = facts.support;
  const dominance = support.positiveDriverMass -
    support.negativeSuppressorMass;
  return (facts.moderateSuppressor || facts.majorSuppressor) &&
    facts.norm.reliability === "high" &&
    !isMissingOrPartial(facts.norm) &&
    !facts.shutdown &&
    !facts.recentWetRain &&
    facts.supportScore >= 58 &&
    support.surfacedDriverCount >= 2 &&
    support.strongestDriverContribution >= 12 &&
    dominance >= 12 &&
    !facts.severeMovementRunoffPrecip &&
    (!facts.severeThermal || dominance >= 18);
}

function v43TrustedTempSupport(facts: V43RowFacts): boolean {
  const support = facts.support;
  const temp = facts.contributions.find((c) =>
    c.key === "temperature_condition"
  );
  if (!temp || temp.weightedContribution > -5) return false;
  return facts.norm.reliability === "high" &&
    !isMissingOrPartial(facts.norm) &&
    !facts.shutdown &&
    !facts.activeHeavyRain &&
    !facts.recentWetRain &&
    !facts.severeMovementRunoffPrecip &&
    !facts.majorSuppressor &&
    support.surfacedDriverCount >= 2 &&
    support.positiveDriverMass >= support.negativeSuppressorMass + 18 &&
    support.positiveDriverMass >= 42 &&
    support.strongestDriverContribution >= 14;
}

function applyV43Caps(
  adjusted: V43RowFacts,
  original: V43RowFacts,
  score: number,
): number {
  let capped = score;
  const trustedTemp = v43TrustedTempSupport(adjusted);
  if (isMissingOrPartial(original.norm)) capped = Math.min(capped, 64);
  if (original.norm.reliability !== "high") capped = Math.min(capped, 72);
  if (original.activeHeavyRain) capped = Math.min(capped, 55);
  if (original.recentWetRain) {
    capped = original.legacy.band === "Good" || original.legacy.band === "Prime"
      ? Math.min(capped, original.legacy.score)
      : Math.min(capped, 64);
  }
  if (adjusted.shutdown && !original.activeHeavyRain) {
    capped = Math.min(capped, 40);
  }
  if (adjusted.majorSuppressor) capped = Math.min(capped, 69);
  if (
    adjusted.moderateSuppressor &&
    !adjusted.trustedSuppressorSupport &&
    !trustedTemp
  ) {
    capped = Math.min(capped, 64);
  }
  if (trustedTemp && original.legacy.band !== "Good") {
    capped = Math.min(capped, 69);
  }
  if (adjusted.severeMovementRunoffPrecip) capped = Math.min(capped, 69);
  return capped;
}

function primeBumpEligibleV43Base(
  facts: V43RowFacts,
  score: number,
  options: ScoreDayOptions,
): boolean {
  const support = facts.support;
  return productionizablePrimeEligible(facts, score, options) &&
    support.surfacedDriverCount >= 2 &&
    support.positiveDriverMass >= 45 &&
    support.negativeSuppressorMass <= 4;
}

function primeBumpEligibleV43TailPlus(
  facts: V43RowFacts,
  score: number,
  options: ScoreDayOptions,
): boolean {
  const support = facts.support;
  return score >= 77 &&
    productionizablePrimeEligible(facts, score + 3, options) &&
    support.surfacedDriverCount >= 2 &&
    support.positiveDriverMass >= 68 &&
    support.negativeSuppressorMass <= 2 &&
    support.strongestDriverContribution >= 16;
}

function productionizablePrimeEligible(
  facts: V43RowFacts,
  preCapScore: number,
  options: ScoreDayOptions,
): boolean {
  return productionizablePrimeDisqualificationReasons(facts, options).length ===
      0 &&
    (facts.supportScore >= 70 || preCapScore >= 80);
}

function productionizablePrimeDisqualificationReasons(
  facts: V43RowFacts,
  options: ScoreDayOptions,
): string[] {
  const support = facts.support;
  const reasons: string[] = [];
  if (facts.norm.reliability !== "high") reasons.push("non_high_reliability");
  if (facts.norm.missing_variables.length > 0) {
    reasons.push("missing_variables");
  }
  if (facts.norm.data_gaps.length > 0) reasons.push("data_gaps");
  if (facts.activeHeavyRain) reasons.push("active_heavy_rain");
  if (facts.recentWetRain) reasons.push("recent_wet_rain_or_runoff");
  if (facts.shutdown) reasons.push("shutdown_row");
  if (facts.severeMovementRunoffPrecip) {
    reasons.push("severe_movement_runoff_precip");
  }
  if (facts.moderateSuppressor) reasons.push("moderate_suppressor");
  if (facts.majorSuppressor) reasons.push("major_suppressor");
  if ((options.currentSpeedKnotsMax ?? 0) > 1.8) {
    reasons.push("extreme_current_speed");
  }
  if (support.surfacedDriverCount < 2) reasons.push("surfaced_drivers_lt_2");
  if (support.positiveDriverMass < 35) reasons.push("positive_mass_lt_35");
  if (support.strongestDriverContribution < 12) {
    reasons.push("strongest_driver_lt_12");
  }
  if (support.negativeSuppressorMass > 4) reasons.push("negative_mass_gt_4");
  const lowest = normalizedCleanliness(facts.norm);
  if (lowest <= -0.25) {
    reasons.push(`normalized_lte_-0.25:${lowest.toFixed(2)}`);
  }
  return reasons;
}

function relaxedMinorNegativePrimeEligible(
  facts: V43RowFacts,
  preCapScore: number,
  options: ScoreDayOptions,
): boolean {
  const support = facts.support;
  const normalized = allNormalizedScores(facts.norm);
  const minorNegativeCount =
    normalized.filter((score) => score > -0.45 && score <= -0.25).length;
  const hardNegative = normalized.some((score) => score <= -0.45);
  const runtimeReasons = productionizablePrimeDisqualificationReasons(
    facts,
    options,
  ).filter((reason) => !reason.startsWith("normalized_lte_-0.25"));
  return runtimeReasons.length === 0 &&
    !hardNegative &&
    minorNegativeCount <= 1 &&
    support.surfacedDriverCount >= 2 &&
    support.positiveDriverMass >= 65 &&
    support.negativeSuppressorMass <= 4.25 &&
    support.strongestDriverContribution >= 18 &&
    (facts.supportScore >= 70 || preCapScore >= 80);
}

function v43RuntimePrimeDisqualificationReasons(
  facts: V43RowFacts,
  preCapScore: number,
  options: ScoreDayOptions,
): string[] {
  const reasons = productionizablePrimeDisqualificationReasons(facts, options);
  const support = facts.support;
  const tempContribution =
    facts.contributions.find((c) => c.key === "temperature_condition")
      ?.weightedContribution ?? 0;
  if (
    facts.norm.context === "freshwater_lake_pond" &&
    facts.supportScore <= 73 &&
    tempContribution >= 50 &&
    support.positiveDriverMass < 73
  ) {
    reasons.push("freshwater_temp_dominated_prime_needs_more_corrob");
  }
  if (!relaxedMinorNegativePrimeEligible(facts, preCapScore, options)) {
    return reasons;
  }
  return reasons.filter((reason) => !reason.startsWith("normalized_lte_-0.25"));
}

function v43RuntimePrimeEligible(
  facts: V43RowFacts,
  preCapScore: number,
  options: ScoreDayOptions,
): boolean {
  return v43RuntimePrimeDisqualificationReasons(
    facts,
    preCapScore,
    options,
  ).length === 0;
}

function v43RuntimeContinuousTailScore(
  facts: V43RowFacts,
  score: number,
  options: ScoreDayOptions,
): number {
  const support = facts.support;
  if (
    score < 80 ||
    !v43RuntimePrimeEligible(facts, score, options) ||
    support.surfacedDriverCount < 2 ||
    support.negativeSuppressorMass > 4.25
  ) {
    return score;
  }
  const clean = normalizedCleanliness(facts.norm);
  if (
    support.positiveDriverMass >= 85 &&
    support.strongestDriverContribution >= 35 &&
    support.negativeSuppressorMass <= 2 &&
    clean > -0.45 &&
    options.timingStrength === "very_strong"
  ) {
    return 99;
  }
  if (
    support.positiveDriverMass >= 88 &&
    support.strongestDriverContribution >= 50 &&
    support.negativeSuppressorMass <= 0.1 &&
    clean > -0.45
  ) {
    return Math.max(score, 95);
  }
  let lift = 0;
  if (support.positiveDriverMass >= 60) lift += 1;
  if (support.positiveDriverMass >= 75) lift += 2;
  if (support.positiveDriverMass >= 84) lift += 2;
  if (support.strongestDriverContribution >= 30) lift += 1;
  if (support.negativeSuppressorMass <= 1) lift += 1;
  if (support.negativeSuppressorMass <= 0.25) lift += 1;
  if (clean >= 0.4) lift += 1;
  if (options.timingStrength === "strong") lift += 1;
  if (options.timingStrength === "very_strong") lift += 2;
  return Math.min(98, Math.max(score, score + lift));
}

function scoreFromRawSum(rawSum: number): number {
  const score = Math.round(
    rawSum >= 0
      ? 50 + rawSum / POSITIVE_RAW_SCORE_DIVISOR
      : 50 + rawSum / NEGATIVE_RAW_SCORE_DIVISOR,
  );
  return Math.max(10, Math.min(100, score));
}

function curveLiftV3(score: number): number {
  if (score < 35) return 2;
  if (score < 50) return 5;
  if (score < 65) return 6;
  if (score < 80) return 3;
  return 1;
}

function timingLiftV3(timingStrength: TimingStrength | null): number {
  const strength = timingStrength ?? "fair_default";
  return { fair_default: 0, good: 1, strong: 2, very_strong: 3 }[strength];
}

function allNormalizedScores(norm: SharedNormalizedOutput): number[] {
  const n = norm.normalized;
  return [
    n.temperature?.final_score,
    n.pressure_regime?.score,
    n.wind_condition?.score,
    n.light_cloud_condition?.score,
    n.precipitation_disruption?.score,
    n.runoff_flow_disruption?.score,
    n.tide_current_movement?.score,
  ].filter((score): score is number => score != null);
}

function normalizedCleanliness(norm: SharedNormalizedOutput): number {
  const scores = allNormalizedScores(norm);
  return scores.length ? Math.min(...scores) : 0;
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
