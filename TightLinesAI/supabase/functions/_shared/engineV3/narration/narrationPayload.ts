// =============================================================================
// ENGINE V3 — Narration Payload Builder
// Phase 5: Typed payload for LLM. Only approved engine facts.
// No inferred freshwater temp. Historical context as nuance only.
// =============================================================================

import type {
  NormalizedEnvironmentV3,
  GeoContextV3,
  ScoreEngineResultV3,
  WindowEngineResultV3,
  EnvironmentModeV3,
  RegimeV3,
} from '../types.ts';

/** Typed V3 narration payload — what the LLM receives. */
export interface NarrationPayloadV3 {
  environmentMode: EnvironmentModeV3;
  region: string;
  month: number;

  score: number;
  scoreBand: 'Poor' | 'Fair' | 'Good' | 'Great';
  regime: RegimeV3;
  regimeLimited: boolean;

  confidence: 'high' | 'medium' | 'low';
  dataCoverageSummary: string[];
  variableGroupsMissing: string[];
  missingVariablesNote: string | null;

  topDrivers: string[];
  topSuppressors: string[];

  bestWindows: Array<{
    startLocal: string;
    endLocal: string;
    score: number;
    reasons: string[];
  }>;
  fairWindows: Array<{
    startLocal: string;
    endLocal: string;
    score: number;
    reasons: string[];
  }>;
  poorWindows: Array<{
    startLocal: string;
    endLocal: string;
    score: number;
    reasons: string[];
  }>;

  strongestWindows: Array<{ startLocal: string; endLocal: string; reasons: string[] }>;
  weakestWindows: Array<{ startLocal: string; endLocal: string; reasons: string[] }>;
  keyReasonsForBest: string[];
  keyReasonsForPoor: string[];

  tideOverlapMajorFactor: boolean;
  timingNarrationHint: string | null;

  historicalContextFlags: string[];
  relativeToNormalNotes: string[];

  claimGuardActive: boolean;
  claimGuardInstructions: string[];

  approvedFacts: {
    airTempF: number | null;
    windSpeedMph: number | null;
    pressureStateSummary: string | null;
    cloudCoverPct: number | null;
    moonPhase: string | null;
    precipSummary: string | null;
    tideStateSummary: string | null;
    coastalWaterTempF: number | null;
    waterTempIsMeasured: boolean;
  };

  severeSuppression: boolean;
  severeSuppressionReasons: string[];
}

function deriveConfidence(
  scoreResult: ScoreEngineResultV3,
  windowResult: WindowEngineResultV3
): 'high' | 'medium' | 'low' {
  const missing = scoreResult.dataCoverageUsed.variableGroupsMissing.length;
  const hasLowBlockConfidence = windowResult.blocks.some((b) => b.confidence === 'low');
  if (missing > 4 || hasLowBlockConfidence) return 'low';
  if (missing > 2) return 'medium';
  return 'high';
}

function buildDataCoverageSummary(scoreResult: ScoreEngineResultV3): string[] {
  const cov = scoreResult.dataCoverageUsed;
  const lines: string[] = [];
  if (cov.variableGroupsPresent.length > 0) {
    lines.push(`Present: ${cov.variableGroupsPresent.slice(0, 6).join(', ')}`);
  }
  if (cov.variableGroupsMissing.length > 0) {
    lines.push(`Missing: ${cov.variableGroupsMissing.slice(0, 6).join(', ')}`);
  }
  if (cov.variableGroupsMissing.length > 4) {
    lines.push('Data coverage is limited — confidence reduced.');
  }
  return lines;
}

function buildTimingHint(windowResult: WindowEngineResultV3, timezone: string): string | null {
  const best = windowResult.bestWindows;
  if (best.length === 0) return null;
  const parts: string[] = [];
  for (const w of best.slice(0, 2)) {
    parts.push(`${w.startLocal}–${w.endLocal}`);
  }
  if (windowResult.tideOverlapMajorFactor) {
    parts.push('Moving water improves the main window');
  }
  return parts.length > 0 ? parts.join('; ') : null;
}

function buildHistoricalContextFlags(env: NormalizedEnvironmentV3): string[] {
  const flags: string[] = [];
  const hist = env.historical_context_inputs;
  if (!hist.stateResolved) return flags;

  const airTemp = env.atmospheric.airTempF.value;
  if (hist.airTempBaseline && airTemp != null) {
    const { avgTempNormalF } = hist.airTempBaseline;
    if (airTemp > avgTempNormalF + 5) flags.push('warmer_than_normal');
    else if (airTemp < avgTempNormalF - 5) flags.push('cooler_than_normal');
  }

  const precip48 = env.precipitation.precip48hrInches.value ?? 0;
  if (hist.precipBaseline && precip48 > 0) {
    const { precipTotalNormalInches } = hist.precipBaseline;
    if (precip48 > precipTotalNormalInches * 1.5) flags.push('wetter_than_normal');
    else if (precip48 < precipTotalNormalInches * 0.5 && hist.precipBaseline.precipTotalNormalInches > 0.5) {
      flags.push('drier_than_normal');
    }
  }

  return flags;
}

function buildRelativeToNormalNotes(env: NormalizedEnvironmentV3, ctx: GeoContextV3): string[] {
  const notes: string[] = [];
  const hist = env.historical_context_inputs;
  if (!hist.stateResolved) return notes;

  const airTemp = env.atmospheric.airTempF.value;
  if (hist.airTempBaseline && airTemp != null) {
    const { avgTempNormalF } = hist.airTempBaseline;
    if (airTemp > avgTempNormalF + 5) {
      notes.push(`Recent temperatures have run warmer than normal for this month.`);
    } else if (airTemp < avgTempNormalF - 5) {
      notes.push(`Recent temperatures have run cooler than normal for this month.`);
    }
  }

  const precip48 = env.precipitation.precip48hrInches.value ?? 0;
  if (hist.precipBaseline && precip48 > 0) {
    const { precipTotalNormalInches } = hist.precipBaseline;
    if (precip48 > precipTotalNormalInches * 1.5) {
      notes.push(`Recent rainfall has been above normal for this month.`);
    }
  }

  return notes;
}

function buildClaimGuardInstructions(
  payload: Partial<NarrationPayloadV3>,
  mode: EnvironmentModeV3
): string[] {
  const instructions: string[] = [];

  // Always: no invented precision
  instructions.push('Do not invent scores, windows, or biological certainty.');
  instructions.push('Use "may", "could", "tends to" for behavior interpretation — not measured fact.');

  if (payload.confidence === 'low' || payload.confidence === 'medium') {
    instructions.push('Data coverage is limited — avoid overstating confidence.');
  }

  if (mode === 'freshwater_lake' || mode === 'freshwater_river') {
    instructions.push('Freshwater: do not reference water temperature as a measured fact.');

    if (mode === 'freshwater_river') {
      instructions.push('River: do not imply measured flow or current — only precipitation effects.');
    }
  }

  if (payload.historicalContextFlags && payload.historicalContextFlags.length > 0) {
    instructions.push('Historical context is for comparison only — frame as "relative to normal", not measured fact.');
  }

  return instructions;
}

function buildPressureStateSummary(scoreResult: ScoreEngineResultV3): string | null {
  const p = scoreResult.contributions.find((c) => c.variableId === 'pressure');
  if (!p?.applicable) return null;
  if (p.stateLabel === 'post_front_pressure_spike') return 'Post-front pressure spike — fish adjusting.';
  if (p.stateLabel === 'rapid_pressure_fall_front_incoming') return 'Rapid pressure fall — front approaching.';
  if (p.stateLabel === 'falling_pressure_feeding_window') return 'Falling pressure — pre-front feeding window.';
  if (p.stateLabel === 'stable_pressure') return 'Stable pressure — fish adapted to conditions.';
  return p.stateLabel.replace(/_/g, ' ');
}

function buildPrecipSummary(env: NormalizedEnvironmentV3): string | null {
  const p48 = env.precipitation.precip48hrInches.value ?? 0;
  const current = env.precipitation.currentPrecipInHr.value ?? 0;
  if (current > 0.1) return 'Active rain — conditions degrading.';
  if (p48 > 2) return 'Heavy recent rain — runoff likely.';
  if (p48 > 0.75) return 'Moderate recent rain.';
  if (p48 > 0.1) return 'Light recent rain.';
  return 'Dry, stable conditions.';
}

function buildTideStateSummary(
  env: NormalizedEnvironmentV3,
  mode: EnvironmentModeV3
): string | null {
  if (mode !== 'saltwater' && mode !== 'brackish') return null;
  const preds = env.marine_tide.tidePredictionsToday ?? [];
  if (preds.length < 2) return null;
  if (env.water_temperature.coastalMeasuredF.value != null) {
    return `Tide data available. Coastal water ${env.water_temperature.coastalMeasuredF.value}°F (measured).`;
  }
  return 'Tide data available.';
}

/**
 * Builds the V3 narration payload from engine outputs.
 * Only approved facts. No inferred freshwater temp. Historical context as nuance.
 */
export function buildNarrationPayloadV3(
  env: NormalizedEnvironmentV3,
  geoContext: GeoContextV3,
  scoreResult: ScoreEngineResultV3,
  windowResult: WindowEngineResultV3,
  timezone: string
): NarrationPayloadV3 {
  const mode = geoContext.environmentMode;
  const confidence = deriveConfidence(scoreResult, windowResult);
  const regimeLimited = windowResult.regimeLimited;

  const severeSuppression =
    scoreResult.regime === 'highly_suppressive' ||
    (scoreResult.regime === 'suppressive' && scoreResult.overallScore < 35);
  const severeSuppressionReasons: string[] = [];
  if (scoreResult.topSuppressors.some((s) => s.includes('wind') || s.includes('pressure'))) {
    severeSuppressionReasons.push(...scoreResult.topSuppressors.slice(0, 2));
  }
  if (severeSuppression && severeSuppressionReasons.length === 0) {
    severeSuppressionReasons.push('Tough conditions — primary suppressors dominant.');
  }

  const claimGuardActive =
    confidence !== 'high' ||
    mode === 'freshwater_river' ||
    (scoreResult.dataCoverageUsed.variableGroupsMissing.length > 2);

  const historicalContextFlags = buildHistoricalContextFlags(env);
  const relativeToNormalNotes = buildRelativeToNormalNotes(env, geoContext);

  const payload: Partial<NarrationPayloadV3> = {
    environmentMode: mode,
    region: geoContext.region,
    month: geoContext.month,
    score: scoreResult.overallScore,
    scoreBand: scoreResult.scoreBand,
    regime: scoreResult.regime,
    regimeLimited,
    confidence,
    dataCoverageSummary: buildDataCoverageSummary(scoreResult),
    variableGroupsMissing: scoreResult.dataCoverageUsed.variableGroupsMissing,
    missingVariablesNote:
      scoreResult.dataCoverageUsed.variableGroupsMissing.length > 2
        ? 'Some key variables are missing — confidence is reduced.'
        : null,
    topDrivers: scoreResult.topDrivers,
    topSuppressors: scoreResult.topSuppressors,
    bestWindows: windowResult.bestWindows.map((w) => ({
      startLocal: w.startLocal,
      endLocal: w.endLocal,
      score: w.score,
      reasons: w.reasons,
    })),
    fairWindows: windowResult.fairWindows.map((w) => ({
      startLocal: w.startLocal,
      endLocal: w.endLocal,
      score: w.score,
      reasons: w.reasons,
    })),
    poorWindows: windowResult.poorWindows.map((w) => ({
      startLocal: w.startLocal,
      endLocal: w.endLocal,
      score: w.score,
      reasons: w.reasons,
    })),
    strongestWindows: windowResult.strongestWindows.slice(0, 3).map((w) => ({
      startLocal: w.startLocal,
      endLocal: w.endLocal,
      reasons: w.reasons,
    })),
    weakestWindows: windowResult.weakestWindows.slice(0, 3).map((w) => ({
      startLocal: w.startLocal,
      endLocal: w.endLocal,
      reasons: w.reasons,
    })),
    keyReasonsForBest: windowResult.keyReasonsForBest,
    keyReasonsForPoor: windowResult.keyReasonsForPoor,
    tideOverlapMajorFactor: windowResult.tideOverlapMajorFactor,
    timingNarrationHint: buildTimingHint(windowResult, timezone),
    historicalContextFlags,
    relativeToNormalNotes,
    claimGuardActive,
    claimGuardInstructions: [],
    approvedFacts: {
      airTempF: env.atmospheric.airTempF.value,
      windSpeedMph: env.atmospheric.windSpeedMph.value,
      pressureStateSummary: buildPressureStateSummary(scoreResult),
      cloudCoverPct: env.atmospheric.cloudCoverPct.value,
      moonPhase: env.lunar_solunar.moonPhase.value,
      precipSummary: buildPrecipSummary(env),
      tideStateSummary: buildTideStateSummary(env, mode),
      coastalWaterTempF: env.water_temperature.coastalMeasuredF.value,
      waterTempIsMeasured: env.water_temperature.coastalMeasuredF.provenance === 'measured',
    },
    severeSuppression,
    severeSuppressionReasons,
  };

  payload.claimGuardInstructions = buildClaimGuardInstructions(payload, mode);

  return payload as NarrationPayloadV3;
}
