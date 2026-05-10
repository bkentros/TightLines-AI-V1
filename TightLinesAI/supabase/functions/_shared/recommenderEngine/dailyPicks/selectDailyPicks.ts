import type { DailyScenario } from "./buildDailyScenario.ts";
import type { CandidateScore } from "./scoreCandidate.ts";

export type DailyPicksVariant = "A" | "B";

export type DailyPicksSelection = {
  lure_of_the_day: CandidateScore;
  honorable_lure: CandidateScore;
  fly_of_the_day: CandidateScore;
  honorable_fly: CandidateScore;
};

export type DailyPicksFamilyDiversitySideDiagnostics = {
  top_family_group: string;
  honorable_family_group: string;
  different_family_selected: boolean;
  different_family_available_in_band: boolean;
};

export type DailyPicksFamilyDiversityDiagnostics = {
  lures: DailyPicksFamilyDiversitySideDiagnostics;
  flies: DailyPicksFamilyDiversitySideDiagnostics;
};

const TOP_QUALITY_BAND = 18;
const HONORABLE_QUALITY_BAND = 24;
const TOP_COMMANDING_SCORE_LEAD = 10;
const TOP_JITTER_POINTS = TOP_QUALITY_BAND;
const HONORABLE_JITTER_POINTS = 12;

function hashString(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function deterministicJitter(args: {
  scenario: DailyScenario;
  seed: string;
  variant: DailyPicksVariant;
  side: "lure" | "fly";
  slot: "top" | "honorable";
  id: string;
  maxPoints: number;
}): number {
  const hash = hashString([
    args.seed,
    args.scenario.local_date,
    args.scenario.recommendation_goal,
    args.variant,
    args.side,
    args.slot,
    args.id,
  ].join("|"));
  return (hash % 10_000) / 10_000 * args.maxPoints;
}

function uniqueBestScores(args: {
  scores: CandidateScore[];
  side: "lure" | "fly";
}): CandidateScore[] {
  const byId = new Map<string, CandidateScore>();
  for (const score of args.scores) {
    if (score.side !== args.side) continue;
    const existing = byId.get(score.profile.id);
    if (
      existing == null ||
      score.score > existing.score ||
      (score.score === existing.score && score.profile.id < existing.profile.id)
    ) {
      byId.set(score.profile.id, score);
    }
  }
  const unique = [...byId.values()];
  if (unique.length < 2) {
    throw new Error(
      `daily picks insufficient candidates for ${args.side}: need 2, got ${unique.length}`,
    );
  }
  return unique;
}

function scoreDescendingThenId(
  a: { adjusted: number; candidate: CandidateScore },
  b: { adjusted: number; candidate: CandidateScore },
): number {
  if (b.adjusted !== a.adjusted) return b.adjusted - a.adjusted;
  if (b.candidate.score !== a.candidate.score) {
    return b.candidate.score - a.candidate.score;
  }
  return a.candidate.profile.id.localeCompare(b.candidate.profile.id);
}

function rawScoreDescendingThenId(
  a: CandidateScore,
  b: CandidateScore,
): number {
  if (b.score !== a.score) return b.score - a.score;
  return a.profile.id.localeCompare(b.profile.id);
}

function bestByAdjusted(
  candidates: CandidateScore[],
  adjustedScore: (candidate: CandidateScore) => number,
): CandidateScore {
  return candidates
    .map((candidate) => ({ candidate, adjusted: adjustedScore(candidate) }))
    .sort(scoreDescendingThenId)[0]!.candidate;
}

function hasScoreReasonPrefix(
  candidate: CandidateScore,
  prefix: string,
): boolean {
  return candidate.reasons.some((reason) => reason.startsWith(prefix));
}

function hasActiveGoalReason(
  candidate: CandidateScore,
  scenario: DailyScenario,
): boolean {
  return hasScoreReasonPrefix(
    candidate,
    `goal:${scenario.recommendation_goal}:`,
  );
}

function hasConditionReason(candidate: CandidateScore): boolean {
  return hasScoreReasonPrefix(candidate, "condition_tag:");
}

function hasPriorityConditionSignal(scenario: DailyScenario): boolean {
  return scenario.scenario_tags.some((tag) =>
    tag === "cold_slow" ||
    tag === "dirty_vibration" ||
    tag === "runoff_streamer" ||
    tag === "current_swing"
  );
}

function preferGoalAndConditionFitWhenAvailable(
  candidates: CandidateScore[],
  scenario: DailyScenario,
): CandidateScore[] {
  const goalAndConditionFit = candidates.filter((candidate) =>
    hasActiveGoalReason(candidate, scenario) && hasConditionReason(candidate)
  );
  if (goalAndConditionFit.length > 0) return goalAndConditionFit;

  const conditionFit = candidates.filter(hasConditionReason);
  if (hasPriorityConditionSignal(scenario) && conditionFit.length > 0) {
    return conditionFit;
  }

  const goalFit = candidates.filter((candidate) =>
    hasActiveGoalReason(candidate, scenario)
  );
  if (goalFit.length > 0) return goalFit;

  return conditionFit.length > 0 ? conditionFit : candidates;
}

function qualityBand(
  candidates: CandidateScore[],
  bestScore: number,
  band: number,
): CandidateScore[] {
  const inBand = candidates.filter((candidate) =>
    candidate.score >= bestScore - band
  );
  return inBand.length > 0 ? inBand : candidates;
}

function candidatesRespectingAvoids(args: {
  candidates: CandidateScore[];
  avoidIds: ReadonlySet<string>;
}): CandidateScore[] {
  const notAvoided = args.candidates.filter((candidate) =>
    !args.avoidIds.has(candidate.profile.id)
  );
  return notAvoided.length > 0 ? notAvoided : args.candidates;
}

function preferNonSurfaceOnCautionWhenAvailable(
  candidates: CandidateScore[],
  scenario: DailyScenario,
): CandidateScore[] {
  if (scenario.surface_daily_gate !== "caution") return candidates;
  const nonSurface = candidates.filter((candidate) =>
    !candidate.profile.is_surface
  );
  return nonSurface.length > 0 ? nonSurface : candidates;
}

function differentFamilyCandidates(args: {
  candidates: CandidateScore[];
  top: CandidateScore;
}): CandidateScore[] {
  return args.candidates.filter((candidate) =>
    candidate.profile.family_group !== args.top.profile.family_group
  );
}

function selectTop(args: {
  candidates: CandidateScore[];
  side: "lure" | "fly";
  scenario: DailyScenario;
  seed: string;
  variant: DailyPicksVariant;
  avoidIds: ReadonlySet<string>;
}): CandidateScore {
  const bestScore = Math.max(
    ...args.candidates.map((candidate) => candidate.score),
  );
  const inBand = qualityBand(args.candidates, bestScore, TOP_QUALITY_BAND);
  const eligible = candidatesRespectingAvoids({
    candidates: inBand,
    avoidIds: args.avoidIds,
  });
  const surfaceEligible = preferNonSurfaceOnCautionWhenAvailable(
    eligible,
    args.scenario,
  );
  const varietyEligible = preferGoalAndConditionFitWhenAvailable(
    surfaceEligible,
    args.scenario,
  );
  const rawRanked = [...varietyEligible].sort(rawScoreDescendingThenId);
  const rawBest = rawRanked[0]!;
  const rawSecond = rawRanked[1];

  if (
    rawSecond == null ||
    rawBest.score - rawSecond.score >= TOP_COMMANDING_SCORE_LEAD
  ) {
    return rawBest;
  }

  return bestByAdjusted(varietyEligible, (candidate) =>
    candidate.score +
    deterministicJitter({
      scenario: args.scenario,
      seed: args.seed,
      variant: args.variant,
      side: args.side,
      slot: "top",
      id: candidate.profile.id,
      maxPoints: TOP_JITTER_POINTS,
    }));
}

function diversityBonus(
  candidate: CandidateScore,
  top: CandidateScore,
): number {
  if (candidate.profile.presentation_group !== top.profile.presentation_group) {
    return 10;
  }
  if (candidate.profile.family_group !== top.profile.family_group) return 6;
  if (candidate.profile.column !== top.profile.column) return 3;
  return 0;
}

function selectHonorable(args: {
  candidates: CandidateScore[];
  top: CandidateScore;
  side: "lure" | "fly";
  scenario: DailyScenario;
  seed: string;
  variant: DailyPicksVariant;
  avoidIds: ReadonlySet<string>;
}): CandidateScore {
  const remaining = args.candidates.filter((candidate) =>
    candidate.profile.id !== args.top.profile.id
  );
  if (remaining.length < 1) {
    throw new Error(
      `daily picks insufficient candidates for ${args.side}: need 2, got 1`,
    );
  }

  const bestRemainingScore = Math.max(
    ...remaining.map((candidate) => candidate.score),
  );
  const inBand = qualityBand(
    remaining,
    bestRemainingScore,
    HONORABLE_QUALITY_BAND,
  );
  const differentFamilyInBand = differentFamilyCandidates({
    candidates: inBand,
    top: args.top,
  });
  const familyEligible = differentFamilyInBand.length > 0
    ? differentFamilyInBand
    : inBand;
  const eligible = candidatesRespectingAvoids({
    candidates: familyEligible,
    avoidIds: args.avoidIds,
  });
  const surfaceEligible = preferNonSurfaceOnCautionWhenAvailable(
    eligible,
    args.scenario,
  );
  const varietyEligible = preferGoalAndConditionFitWhenAvailable(
    surfaceEligible,
    args.scenario,
  );

  return bestByAdjusted(varietyEligible, (candidate) =>
    candidate.score +
    diversityBonus(candidate, args.top) +
    deterministicJitter({
      scenario: args.scenario,
      seed: args.seed,
      variant: args.variant,
      side: args.side,
      slot: "honorable",
      id: candidate.profile.id,
      maxPoints: HONORABLE_JITTER_POINTS,
    }));
}

function selectSide(args: {
  scores: CandidateScore[];
  side: "lure" | "fly";
  scenario: DailyScenario;
  seed: string;
  variant: DailyPicksVariant;
  avoidIds?: readonly string[];
}): [CandidateScore, CandidateScore] {
  const candidates = uniqueBestScores({
    scores: args.scores,
    side: args.side,
  });
  const avoidIds = new Set(args.avoidIds ?? []);
  const top = selectTop({
    candidates,
    side: args.side,
    scenario: args.scenario,
    seed: args.seed,
    variant: args.variant,
    avoidIds,
  });
  const honorable = selectHonorable({
    candidates,
    top,
    side: args.side,
    scenario: args.scenario,
    seed: args.seed,
    variant: args.variant,
    avoidIds,
  });
  return [top, honorable];
}

function familyDiversityForSide(args: {
  scores: CandidateScore[];
  side: "lure" | "fly";
  top: CandidateScore;
  honorable: CandidateScore;
}): DailyPicksFamilyDiversitySideDiagnostics {
  const candidates = uniqueBestScores({
    scores: args.scores,
    side: args.side,
  });
  const remaining = candidates.filter((candidate) =>
    candidate.profile.id !== args.top.profile.id
  );
  const bestRemainingScore = Math.max(
    ...remaining.map((candidate) => candidate.score),
  );
  const inBand = qualityBand(
    remaining,
    bestRemainingScore,
    HONORABLE_QUALITY_BAND,
  );
  const differentFamilyAvailableInBand = differentFamilyCandidates({
    candidates: inBand,
    top: args.top,
  }).length > 0;

  return {
    top_family_group: args.top.profile.family_group,
    honorable_family_group: args.honorable.profile.family_group,
    different_family_selected: args.top.profile.family_group !==
      args.honorable.profile.family_group,
    different_family_available_in_band: differentFamilyAvailableInBand,
  };
}

export function buildDailyPicksFamilyDiversityDiagnostics(args: {
  selection: DailyPicksSelection;
  lureScores: CandidateScore[];
  flyScores: CandidateScore[];
}): DailyPicksFamilyDiversityDiagnostics {
  return {
    lures: familyDiversityForSide({
      scores: args.lureScores,
      side: "lure",
      top: args.selection.lure_of_the_day,
      honorable: args.selection.honorable_lure,
    }),
    flies: familyDiversityForSide({
      scores: args.flyScores,
      side: "fly",
      top: args.selection.fly_of_the_day,
      honorable: args.selection.honorable_fly,
    }),
  };
}

export function selectDailyPicks(args: {
  lureScores: CandidateScore[];
  flyScores: CandidateScore[];
  scenario: DailyScenario;
  seed: string;
  variant: DailyPicksVariant;
  avoidLureIds?: readonly string[];
  avoidFlyIds?: readonly string[];
}): DailyPicksSelection {
  const [lureOfTheDay, honorableLure] = selectSide({
    scores: args.lureScores,
    side: "lure",
    scenario: args.scenario,
    seed: args.seed,
    variant: args.variant,
    avoidIds: args.avoidLureIds,
  });
  const [flyOfTheDay, honorableFly] = selectSide({
    scores: args.flyScores,
    side: "fly",
    scenario: args.scenario,
    seed: args.seed,
    variant: args.variant,
    avoidIds: args.avoidFlyIds,
  });

  return {
    lure_of_the_day: lureOfTheDay,
    honorable_lure: honorableLure,
    fly_of_the_day: flyOfTheDay,
    honorable_fly: honorableFly,
  };
}
