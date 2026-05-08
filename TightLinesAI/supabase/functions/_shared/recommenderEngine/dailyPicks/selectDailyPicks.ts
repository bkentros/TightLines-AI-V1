import type { DailyScenario } from "./buildDailyScenario.ts";
import type { CandidateScore } from "./scoreCandidate.ts";

export type DailyPicksVariant = "A" | "B";

export type DailyPicksSelection = {
  lure_of_the_day: CandidateScore;
  honorable_lure: CandidateScore;
  fly_of_the_day: CandidateScore;
  honorable_fly: CandidateScore;
};

const TOP_QUALITY_BAND = 18;
const HONORABLE_QUALITY_BAND = 24;
const TOP_JITTER_POINTS = 8;
const HONORABLE_JITTER_POINTS = 4;

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

function bestByAdjusted(
  candidates: CandidateScore[],
  adjustedScore: (candidate: CandidateScore) => number,
): CandidateScore {
  return candidates
    .map((candidate) => ({ candidate, adjusted: adjustedScore(candidate) }))
    .sort(scoreDescendingThenId)[0]!.candidate;
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

  return bestByAdjusted(eligible, (candidate) =>
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
  const eligible = candidatesRespectingAvoids({
    candidates: inBand,
    avoidIds: args.avoidIds,
  });

  return bestByAdjusted(eligible, (candidate) =>
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
