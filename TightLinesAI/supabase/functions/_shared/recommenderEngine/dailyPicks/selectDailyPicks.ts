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

export type DailyPicksFinalistTier =
  | "goal_and_priority_condition"
  | "goal_or_priority_condition"
  | "daily_lane_specialist"
  | "credible_fallback";

export type DailyPicksFinalistSingletonCause =
  | "hard_gated_scarcity"
  | "family_diversity_scarcity"
  | "surface_safety_scarcity";

export type DailyPicksFinalistPoolSlotDiagnostics = {
  side: "lure" | "fly";
  slot: "top" | "honorable";
  tier: DailyPicksFinalistTier;
  selected_tier_pool_size: number;
  expanded_tiers: readonly DailyPicksFinalistTier[];
  expanded_pool_size: number;
  pool_size: number;
  singleton_cause?: DailyPicksFinalistSingletonCause;
  finalist_ids: readonly string[];
  set_b_after_exact_id_avoidance_pool_size?: number;
  set_b_different_presentation_pool_size?: number;
  set_b_different_family_pool_size?: number;
  set_b_final_expanded_pool_size?: number;
  set_b_same_family_same_presentation_reintroduced?: boolean;
  surface_closed_surface_candidate_count?: number;
  surface_caution_surface_candidate_count?: number;
  dirty_wind_coverage_pool_used?: boolean;
  dirty_wind_coverage_pool_source?: "broad" | "avoidable_exact_id" | "none";
  dirty_wind_coverage_pool_size?: number;
  dirty_wind_coverage_pool_ids?: readonly string[];
  dirty_wind_coverage_narrowed_pool_size?: number;
  dirty_wind_coverage_broad_pool_size?: number;
};

export type DailyPicksFinalistPoolDiagnostics =
  readonly DailyPicksFinalistPoolSlotDiagnostics[];

const TOP_QUALITY_BAND = 18;
const HONORABLE_QUALITY_BAND = 24;
const SET_B_EXACT_ID_FALLBACK_BAND = 36;
const TARGET_FINALIST_POOL_SIZE = 4;
const SET_B_NOVELTY_FINALIST_POOL_SIZE = 2;
const GROUP_NOVELTY_SCORE_BAND = 10;
const BIG_FISH_GOAL_BACKFILL_SCORE_BAND = 12;
const DIRTY_WIND_PRIORITY_PROTECTION_BAND = 12;
const DIRTY_WIND_BIG_FISH_GOAL_PROTECTION_BAND = 2;
const DIRTY_WIND_COVERAGE_QUALITY_BAND = 24;
const SPECIALIST_FINALIST_QUALITY_BAND = 36;
const AVOIDED_DIRTY_WIND_REUSE_LEAD = 30;
const BIG_FISH_PAIR_GOAL_COVERAGE_BAND = 30;
const PIKE_SET_B_ALL_PURPOSE_FLY_RISK_RELIABILITY_BAND = 12;
const PIKE_CLEAR_CALM_CONTROL_BAND = 24;
const OPEN_SURFACE_SAME_SIDE_DIVERSITY_BAND = 24;

function hashString(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function deterministicUnitInterval(args: {
  scenario: DailyScenario;
  seed: string;
  variant: DailyPicksVariant;
  side: "lure" | "fly";
  slot: "top" | "honorable";
  finalistIds: readonly string[];
}): number {
  const hash = hashString([
    args.seed,
    args.scenario.local_date,
    args.scenario.region_key,
    args.scenario.water_type,
    args.scenario.water_clarity,
    args.scenario.recommendation_goal,
    args.variant,
    args.side,
    args.slot,
    args.finalistIds.join(","),
  ].join("|"));
  return (hash % 1_000_000) / 1_000_000;
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

function rawScoreDescendingThenId(
  a: CandidateScore,
  b: CandidateScore,
): number {
  if (b.score !== a.score) return b.score - a.score;
  return a.profile.id.localeCompare(b.profile.id);
}

function finalistTier(args: {
  candidate: CandidateScore;
  scenario: DailyScenario;
}): 1 | 2 | 3 | 4 {
  const activeGoal = hasActiveGoalReason(args.candidate, args.scenario);
  const priorityCondition = hasPriorityConditionReason(
    args.candidate,
    args.scenario,
  );
  if (activeGoal && priorityCondition) return 1;
  if (activeGoal || priorityCondition) return 2;
  if (
    hasDailyLaneReason(args.candidate) ||
    hasSpecialistDailyLaneReason(args.candidate)
  ) {
    return 3;
  }
  return 4;
}

function finalistTierLabel(tier: 1 | 2 | 3 | 4): DailyPicksFinalistTier {
  switch (tier) {
    case 1:
      return "goal_and_priority_condition";
    case 2:
      return "goal_or_priority_condition";
    case 3:
      return "daily_lane_specialist";
    case 4:
      return "credible_fallback";
  }
}

function expandedFinalistPool(args: {
  candidates: CandidateScore[];
  scenario: DailyScenario;
}): {
  tier: DailyPicksFinalistTier;
  selectedTierCandidates: CandidateScore[];
  expandedTiers: DailyPicksFinalistTier[];
  candidates: CandidateScore[];
} {
  const rankedByTier = args.candidates.map((candidate) => ({
    candidate,
    tier: finalistTier({ candidate, scenario: args.scenario }),
  }));
  const bestTier = Math.min(...rankedByTier.map((entry) => entry.tier)) as
    | 1
    | 2
    | 3
    | 4;
  const selectedTierCandidates = rankedByTier
    .filter((entry) => entry.tier === bestTier)
    .map((entry) => entry.candidate)
    .sort((a, b) => a.profile.id.localeCompare(b.profile.id));
  const expanded: CandidateScore[] = [];
  const expandedTiers: DailyPicksFinalistTier[] = [];
  for (let tier = bestTier; tier <= 4; tier++) {
    const tierCandidates = rankedByTier
      .filter((entry) => entry.tier === tier)
      .map((entry) => entry.candidate);
    if (tierCandidates.length === 0) continue;
    expanded.push(...tierCandidates);
    expandedTiers.push(finalistTierLabel(tier as 1 | 2 | 3 | 4));
    if (
      expanded.length >= TARGET_FINALIST_POOL_SIZE ||
      expanded.length >= args.candidates.length
    ) {
      break;
    }
  }
  return {
    tier: finalistTierLabel(bestTier),
    selectedTierCandidates,
    expandedTiers,
    candidates: expanded
      .sort((a, b) => a.profile.id.localeCompare(b.profile.id)),
  };
}

function uniformFinalistPick(args: {
  candidates: CandidateScore[];
  scenario: DailyScenario;
  seed: string;
  variant: DailyPicksVariant;
  side: "lure" | "fly";
  slot: "top" | "honorable";
}): CandidateScore {
  const pool = expandedFinalistPool({
    candidates: args.candidates,
    scenario: args.scenario,
  }).candidates;
  const finalistIds = pool.map((candidate) => candidate.profile.id);
  const index = Math.min(
    pool.length - 1,
    Math.floor(
      deterministicUnitInterval({
        scenario: args.scenario,
        seed: args.seed,
        variant: args.variant,
        side: args.side,
        slot: args.slot,
        finalistIds,
      }) * pool.length,
    ),
  );
  return pool[index]!;
}

function uniformExactPoolPick(args: {
  candidates: CandidateScore[];
  scenario: DailyScenario;
  seed: string;
  variant: DailyPicksVariant;
  side: "lure" | "fly";
  slot: "top" | "honorable";
}): CandidateScore {
  const pool = args.candidates
    .slice()
    .sort((a, b) => a.profile.id.localeCompare(b.profile.id));
  const finalistIds = pool.map((candidate) => candidate.profile.id);
  const index = Math.min(
    pool.length - 1,
    Math.floor(
      deterministicUnitInterval({
        scenario: args.scenario,
        seed: args.seed,
        variant: args.variant,
        side: args.side,
        slot: args.slot,
        finalistIds,
      }) * pool.length,
    ),
  );
  return pool[index]!;
}

function finalistPoolDiagnostics(args: {
  candidates: CandidateScore[];
  setBBaseCandidates?: CandidateScore[];
  dirtyWindCoverage?: DirtyWindCoverageCandidateSet;
  scenario: DailyScenario;
  side: "lure" | "fly";
  slot: "top" | "honorable";
  variant: DailyPicksVariant;
  avoidedGroups: AvoidedGroupContext;
}): DailyPicksFinalistPoolSlotDiagnostics {
  const pool = args.dirtyWindCoverage
    ? {
      tier: "goal_or_priority_condition" as const,
      selectedTierCandidates: args.dirtyWindCoverage.candidates,
      expandedTiers: ["goal_or_priority_condition" as const],
      candidates: args.dirtyWindCoverage.candidates,
    }
    : expandedFinalistPool({
      candidates: args.candidates,
      scenario: args.scenario,
    });
  const setBBaseCandidates = args.setBBaseCandidates ?? args.candidates;
  const setBBestScore = Math.max(
    ...setBBaseCandidates.map((candidate) => candidate.score),
  );
  const setBDifferentPresentation = args.variant === "B"
    ? setBBaseCandidates.filter((candidate) =>
      !args.avoidedGroups.presentationGroups.has(
        candidate.profile.presentation_group,
      ) && candidate.score >= setBBestScore - GROUP_NOVELTY_SCORE_BAND
    )
    : [];
  const setBDifferentFamily = args.variant === "B"
    ? setBBaseCandidates.filter((candidate) =>
      !args.avoidedGroups.familyGroups.has(candidate.profile.family_group) &&
      candidate.score >= setBBestScore - GROUP_NOVELTY_SCORE_BAND
    )
    : [];
  const setBSameFamilySamePresentationReintroduced = args.variant === "B" &&
    pool.candidates.some((candidate) =>
      args.avoidedGroups.familyGroups.has(candidate.profile.family_group) &&
      args.avoidedGroups.presentationGroups.has(
        candidate.profile.presentation_group,
      )
    );
  const surfaceFinalists =
    pool.candidates.filter((candidate) => candidate.profile.is_surface).length;
  return {
    side: args.side,
    slot: args.slot,
    tier: pool.tier,
    selected_tier_pool_size: pool.selectedTierCandidates.length,
    expanded_tiers: pool.expandedTiers,
    expanded_pool_size: pool.candidates.length,
    pool_size: pool.candidates.length,
    singleton_cause: pool.candidates.length === 1
      ? (args.scenario.surface_daily_gate === "caution"
        ? "surface_safety_scarcity"
        : args.slot === "honorable"
        ? "family_diversity_scarcity"
        : "hard_gated_scarcity")
      : undefined,
    finalist_ids: pool.candidates.map((candidate) => candidate.profile.id),
    set_b_after_exact_id_avoidance_pool_size: args.variant === "B"
      ? setBBaseCandidates.length
      : undefined,
    set_b_different_presentation_pool_size: args.variant === "B"
      ? setBDifferentPresentation.length
      : undefined,
    set_b_different_family_pool_size: args.variant === "B"
      ? setBDifferentFamily.length
      : undefined,
    set_b_final_expanded_pool_size: args.variant === "B"
      ? pool.candidates.length
      : undefined,
    set_b_same_family_same_presentation_reintroduced: args.variant === "B"
      ? setBSameFamilySamePresentationReintroduced
      : undefined,
    surface_closed_surface_candidate_count:
      args.scenario.surface_daily_gate === "closed"
        ? surfaceFinalists
        : undefined,
    surface_caution_surface_candidate_count:
      args.scenario.surface_daily_gate === "caution"
        ? surfaceFinalists
        : undefined,
    dirty_wind_coverage_pool_used: args.dirtyWindCoverage != null,
    dirty_wind_coverage_pool_source: args.dirtyWindCoverage?.source ??
      (args.side === "lure" && args.slot === "honorable" &&
          isDirtyStainedWindReactionScenario(args.scenario)
        ? "none"
        : undefined),
    dirty_wind_coverage_pool_size: args.dirtyWindCoverage?.candidates.length,
    dirty_wind_coverage_pool_ids: args.dirtyWindCoverage?.candidates.map((
      candidate,
    ) => candidate.profile.id),
    dirty_wind_coverage_narrowed_pool_size: args.dirtyWindCoverage
      ?.narrowedSize,
    dirty_wind_coverage_broad_pool_size: args.dirtyWindCoverage?.broadSize,
  };
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

function hasDailyLaneReason(candidate: CandidateScore): boolean {
  return hasScoreReasonPrefix(candidate, "daily_lane:");
}

function hasScenarioClarityReason(
  candidate: CandidateScore,
  scenario: DailyScenario,
): boolean {
  return hasScoreReasonPrefix(
    candidate,
    `clarity_strength:${scenario.water_clarity}:`,
  );
}

function hasSpecialistDailyLaneReason(candidate: CandidateScore): boolean {
  return hasDailyLaneReason(candidate) &&
    candidate.profile.goal_tags.includes("reliable_action") &&
    !candidate.profile.goal_tags.includes("versatile_search") &&
    !candidate.profile.goal_tags.includes("big_fish_upside") &&
    !candidate.profile.goal_tags.includes("high_risk_high_reward");
}

function hasActiveReasonForAny(
  candidate: CandidateScore,
  tags: readonly DailyScenarioTag[],
): boolean {
  return tags.some((tag) =>
    hasScoreReasonPrefix(candidate, `condition_tag:${tag}:`)
  );
}

function isCloseSpecialistFinalist(args: {
  candidate: CandidateScore;
  scenario: DailyScenario;
}): boolean {
  const { candidate, scenario } = args;
  if (scenario.recommendation_goal !== "all_purpose") {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  const dirtyReaction = tags.has("dirty_vibration") ||
    tags.has("wind_reaction");
  const slowSubtle = tags.has("cold_slow") ||
    tags.has("clear_subtle") ||
    tags.has("heat_finesse");

  if (
    dirtyReaction &&
    hasActiveReasonForAny(candidate, ["dirty_vibration", "wind_reaction"]) &&
    hasScenarioClarityReason(candidate, scenario) &&
    !hasActiveGoalReason(candidate, scenario)
  ) {
    return true;
  }

  if (
    slowSubtle &&
    !tags.has("dirty_vibration") &&
    candidate.profile.column === "bottom" &&
    (candidate.profile.primary_pace === "slow" ||
      candidate.profile.secondary_pace === "slow") &&
    hasActiveReasonForAny(candidate, [
      "cold_slow",
      "clear_subtle",
      "heat_finesse",
    ])
  ) {
    return true;
  }

  return false;
}

function includeCloseSpecialistFinalists(args: {
  candidates: CandidateScore[];
  broadCandidates: CandidateScore[];
  scenario: DailyScenario;
  bestScore: number;
}): CandidateScore[] {
  const byId = new Map(args.candidates.map((candidate) => [
    candidate.profile.id,
    candidate,
  ]));
  for (const candidate of args.broadCandidates) {
    if (byId.has(candidate.profile.id)) continue;
    if (
      candidate.score >= args.bestScore - SPECIALIST_FINALIST_QUALITY_BAND &&
      isCloseSpecialistFinalist({ candidate, scenario: args.scenario })
    ) {
      byId.set(candidate.profile.id, candidate);
    }
  }
  return [...byId.values()];
}

function bestDailyLaneCandidate(
  candidates: CandidateScore[],
): CandidateScore | null {
  return candidates
    .filter(hasDailyLaneReason)
    .sort(rawScoreDescendingThenId)[0] ?? null;
}

function protectHigherScoringDailyLane(args: {
  selected: CandidateScore;
  candidates: CandidateScore[];
}): CandidateScore {
  const bestDailyLane = bestDailyLaneCandidate(args.candidates);
  if (bestDailyLane && bestDailyLane.score > args.selected.score) {
    return bestDailyLane;
  }
  return args.selected;
}

type DailyScenarioTag = DailyScenario["scenario_tags"][number];

function priorityConditionTags(scenario: DailyScenario): DailyScenarioTag[] {
  const tags = new Set(scenario.scenario_tags);
  const priority: DailyScenarioTag[] = [];
  const add = (tag: DailyScenarioTag) => {
    if (tags.has(tag) && !priority.includes(tag)) priority.push(tag);
  };

  if (scenario.surface_daily_gate === "open") {
    add("low_light_surface");
    add("calm_surface");
  }

  add("dirty_vibration");
  add("wind_reaction");
  add("clear_subtle");

  if (!tags.has("dirty_vibration") && !tags.has("wind_reaction")) {
    add("heat_finesse");
  }

  add("cold_slow");
  add("runoff_streamer");
  add("current_swing");
  return priority;
}

function hasPriorityConditionReason(
  candidate: CandidateScore,
  scenario: DailyScenario,
): boolean {
  return priorityConditionTags(scenario).some((tag) =>
    hasScoreReasonPrefix(candidate, `condition_tag:${tag}:`)
  );
}

function hasPriorityConditionSignal(scenario: DailyScenario): boolean {
  return priorityConditionTags(scenario).length > 0;
}

function hasHighRiskOnlyProfile(candidate: CandidateScore): boolean {
  return candidate.profile.goal_tags.includes("high_risk_high_reward") &&
    !candidate.profile.goal_tags.includes("reliable_action") &&
    !candidate.profile.goal_tags.includes("versatile_search");
}

function isRiskyAllPurposeSurfacePick(
  candidate: CandidateScore,
  scenario: DailyScenario,
): boolean {
  if (scenario.recommendation_goal !== "all_purpose") return false;
  if (hasActiveGoalReason(candidate, scenario)) return false;
  return candidate.profile.is_surface || hasHighRiskOnlyProfile(candidate);
}

function isReliableAllPurposeNonSurface(
  candidate: CandidateScore,
  scenario: DailyScenario,
): boolean {
  return scenario.recommendation_goal === "all_purpose" &&
    !candidate.profile.is_surface &&
    hasActiveGoalReason(candidate, scenario) &&
    !hasHighRiskOnlyProfile(candidate);
}

function isStrongAllPurposeSurfaceWindow(scenario: DailyScenario): boolean {
  if (
    scenario.recommendation_goal !== "all_purpose" ||
    scenario.surface_daily_gate !== "open"
  ) {
    return false;
  }
  const tags = new Set(scenario.scenario_tags);
  const strongSurfaceSignal = tags.has("low_light_surface") &&
    tags.has("calm_surface");
  const suppressedThermal = tags.has("cold_slow") || tags.has("heat_finesse");
  return strongSurfaceSignal && !suppressedThermal &&
    scenario.activity_level === "active";
}

function preferGoalAndConditionFitWhenAvailable(args: {
  candidates: CandidateScore[];
  scenario: DailyScenario;
  requireActiveGoal?: boolean;
}): CandidateScore[] {
  const { candidates, scenario } = args;
  const goalAndPriorityConditionFit = candidates.filter((candidate) =>
    hasActiveGoalReason(candidate, scenario) &&
    hasPriorityConditionReason(candidate, scenario)
  );
  if (goalAndPriorityConditionFit.length > 0) {
    return goalAndPriorityConditionFit;
  }

  const goalFit = candidates.filter((candidate) =>
    hasActiveGoalReason(candidate, scenario)
  );
  if (args.requireActiveGoal && goalFit.length > 0) return goalFit;

  const priorityConditionFit = candidates.filter((candidate) =>
    hasPriorityConditionReason(candidate, scenario)
  );
  if (priorityConditionFit.length > 0) return priorityConditionFit;

  const goalAndConditionFit = candidates.filter((candidate) =>
    hasActiveGoalReason(candidate, scenario) && hasConditionReason(candidate)
  );
  if (goalAndConditionFit.length > 0) return goalAndConditionFit;

  const conditionFit = candidates.filter(hasConditionReason);
  if (hasPriorityConditionSignal(scenario) && conditionFit.length > 0) {
    return conditionFit;
  }

  if (goalFit.length > 0) return goalFit;

  return conditionFit.length > 0 ? conditionFit : candidates;
}

function withCloseBigFishGoalFit(args: {
  candidates: CandidateScore[];
  preferred: CandidateScore[];
  scenario: DailyScenario;
}): CandidateScore[] {
  if (args.scenario.recommendation_goal !== "big_fish") {
    return args.preferred;
  }
  if (
    args.preferred.some((candidate) =>
      hasActiveGoalReason(candidate, args.scenario) &&
      hasPriorityConditionReason(candidate, args.scenario)
    )
  ) {
    return args.preferred;
  }
  const bestPreferredScore = Math.max(
    ...args.preferred.map((candidate) => candidate.score),
  );
  const byId = new Map(args.preferred.map((candidate) => [
    candidate.profile.id,
    candidate,
  ]));
  const reactionPriority = args.scenario.scenario_tags.includes(
    "dirty_vibration",
  ) || args.scenario.scenario_tags.includes("wind_reaction");
  for (const candidate of args.candidates) {
    if (
      reactionPriority &&
      !hasConditionReason(candidate) &&
      !hasScenarioClarityReason(candidate, args.scenario)
    ) {
      continue;
    }
    if (
      hasActiveGoalReason(candidate, args.scenario) &&
      candidate.score >= bestPreferredScore - BIG_FISH_GOAL_BACKFILL_SCORE_BAND
    ) {
      byId.set(candidate.profile.id, candidate);
    }
  }
  return [...byId.values()];
}

function hasGuideCredibleBigFishGoalFit(
  candidate: CandidateScore,
  scenario: DailyScenario,
): boolean {
  return hasActiveGoalReason(candidate, scenario) &&
    (hasPriorityConditionReason(candidate, scenario) ||
      hasConditionReason(candidate) ||
      hasScenarioClarityReason(candidate, scenario) ||
      hasDailyLaneReason(candidate) ||
      hasSpecialistDailyLaneReason(candidate));
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

function qualityBandRespectingAvoids(args: {
  candidates: CandidateScore[];
  inBand: CandidateScore[];
  avoidIds: ReadonlySet<string>;
  bestScore: number;
}): CandidateScore[] {
  const inBandNotAvoided = args.inBand.filter((candidate) =>
    !args.avoidIds.has(candidate.profile.id)
  );
  if (inBandNotAvoided.length > 0) return inBandNotAvoided;

  const closeNotAvoided = args.candidates.filter((candidate) =>
    !args.avoidIds.has(candidate.profile.id) &&
    candidate.score >= args.bestScore - SET_B_EXACT_ID_FALLBACK_BAND
  );
  if (closeNotAvoided.length > 0) return closeNotAvoided;

  return args.inBand;
}

function hasDirtyWindPriorityReason(
  candidate: CandidateScore,
  scenario: DailyScenario,
): boolean {
  const tags = new Set(scenario.scenario_tags);
  return (tags.has("dirty_vibration") &&
    hasScoreReasonPrefix(candidate, "condition_tag:dirty_vibration:")) ||
    (tags.has("wind_reaction") &&
      hasScoreReasonPrefix(candidate, "condition_tag:wind_reaction:"));
}

function isDirtyWindReactionScenario(scenario: DailyScenario): boolean {
  return scenario.species === "smallmouth_bass" &&
    isDirtyStainedWindReactionScenario(scenario);
}

function isDirtyStainedWindReactionScenario(scenario: DailyScenario): boolean {
  return (
    (scenario.water_clarity === "stained" ||
      scenario.water_clarity === "dirty") &&
    (scenario.scenario_tags.includes("dirty_vibration") ||
      scenario.scenario_tags.includes("wind_reaction"))
  );
}

function isPikeClearCalmControlScenario(scenario: DailyScenario): boolean {
  const lowWind = scenario.wind_mode === "calm" ||
    (scenario.daylight_wind_mph != null && scenario.daylight_wind_mph < 6);
  const closedOrCaution = scenario.surface_daily_gate === "closed" ||
    scenario.surface_daily_gate === "caution";
  return scenario.species === "northern_pike" &&
    scenario.water_clarity === "clear" &&
    (scenario.light_mode === "bright" || scenario.light_mode === "glare") &&
    lowWind &&
    closedOrCaution &&
    !scenario.scenario_tags.includes("dirty_vibration") &&
    !scenario.scenario_tags.includes("wind_reaction");
}

function pikeClearControlText(candidate: CandidateScore): string {
  return [
    candidate.profile.id,
    candidate.profile.display_name,
    candidate.profile.family_group,
    candidate.profile.presentation_group,
  ].join(" ").toLowerCase();
}

function isPikeNoisyFlashProfile(candidate: CandidateScore): boolean {
  const text = pikeClearControlText(candidate);
  return text.includes("flash") ||
    text.includes("spinner") ||
    text.includes("spoon") ||
    text.includes("bucktail") ||
    text.includes("buzz") ||
    text.includes("topwater");
}

function isControlledPikeBigFishUpside(candidate: CandidateScore): boolean {
  return candidate.profile.goal_tags.includes("big_fish_upside") &&
    !candidate.profile.is_surface &&
    !isPikeNoisyFlashProfile(candidate);
}

function isPikeClearCalmNoisySelection(
  candidate: CandidateScore,
  scenario: DailyScenario,
): boolean {
  if (!isPikeClearCalmControlScenario(scenario)) return false;
  if (candidate.profile.is_surface || isPikeNoisyFlashProfile(candidate)) {
    return true;
  }
  return candidate.profile.goal_tags.includes("high_risk_high_reward") &&
    !isControlledPikeBigFishUpside(candidate);
}

function isPikeClearCalmControlledAlternative(
  candidate: CandidateScore,
  scenario: DailyScenario,
): boolean {
  if (candidate.profile.is_surface || isPikeNoisyFlashProfile(candidate)) {
    return false;
  }

  if (scenario.recommendation_goal === "all_purpose") {
    const reliableOrVersatile =
      candidate.profile.goal_tags.includes("reliable_action") ||
      candidate.profile.goal_tags.includes("versatile_search");
    return reliableOrVersatile &&
      hasActiveGoalReason(candidate, scenario) &&
      !candidate.profile.goal_tags.includes("high_risk_high_reward") &&
      (hasPriorityConditionReason(candidate, scenario) ||
        hasConditionReason(candidate) ||
        hasScenarioClarityReason(candidate, scenario) ||
        hasDailyLaneReason(candidate) ||
        hasSpecialistDailyLaneReason(candidate));
  }

  return hasActiveGoalReason(candidate, scenario) &&
    isControlledPikeBigFishUpside(candidate) &&
    (hasPriorityConditionReason(candidate, scenario) ||
      hasConditionReason(candidate) ||
      hasScenarioClarityReason(candidate, scenario) ||
      hasDailyLaneReason(candidate) ||
      hasSpecialistDailyLaneReason(candidate));
}

function dirtyWindCoverageCandidates(args: {
  candidates: CandidateScore[];
  side: "lure" | "fly";
  scenario: DailyScenario;
  top: CandidateScore;
}): CandidateScore[] {
  if (
    args.side !== "lure" ||
    !isDirtyStainedWindReactionScenario(args.scenario) ||
    hasDirtyWindPriorityReason(args.top, args.scenario)
  ) {
    return [];
  }

  const reactionFits = differentFamilyCandidates({
    candidates: args.candidates,
    top: args.top,
  }).filter((candidate) =>
    candidate.profile.id !== args.top.profile.id &&
    hasDirtyWindPriorityReason(candidate, args.scenario)
  );
  if (reactionFits.length === 0) return [];

  const bestReactionScore = Math.max(
    ...reactionFits.map((candidate) => candidate.score),
  );
  return reactionFits
    .filter((candidate) =>
      candidate.score >= bestReactionScore - DIRTY_WIND_COVERAGE_QUALITY_BAND
    )
    .sort((a, b) => a.profile.id.localeCompare(b.profile.id));
}

type DirtyWindCoverageCandidateSet = {
  candidates: CandidateScore[];
  source: "broad" | "avoidable_exact_id";
  narrowedSize: number;
  broadSize: number;
};

function dirtyWindHonorableCoverageSet(args: {
  narrowedCandidates: CandidateScore[];
  broadCandidates: CandidateScore[];
  avoidedFallbackCandidates: CandidateScore[];
  side: "lure" | "fly";
  scenario: DailyScenario;
  top: CandidateScore;
}): DirtyWindCoverageCandidateSet | null {
  const narrowed = dirtyWindCoverageCandidates({
    candidates: args.narrowedCandidates,
    side: args.side,
    scenario: args.scenario,
    top: args.top,
  });
  const broad = dirtyWindCoverageCandidates({
    candidates: args.broadCandidates,
    side: args.side,
    scenario: args.scenario,
    top: args.top,
  });
  if (broad.length > 0) {
    return {
      candidates: broad,
      source: "broad",
      narrowedSize: narrowed.length,
      broadSize: broad.length,
    };
  }

  const avoidedFallback = dirtyWindCoverageCandidates({
    candidates: args.avoidedFallbackCandidates,
    side: args.side,
    scenario: args.scenario,
    top: args.top,
  });
  if (avoidedFallback.length > 0) {
    return {
      candidates: avoidedFallback,
      source: "avoidable_exact_id",
      narrowedSize: narrowed.length,
      broadSize: broad.length,
    };
  }

  return null;
}

function protectDirtyWindPriorityFit(args: {
  selected: CandidateScore;
  candidates: CandidateScore[];
  scenario: DailyScenario;
  top?: CandidateScore;
}): CandidateScore {
  if (
    !isDirtyWindReactionScenario(args.scenario) ||
    hasDirtyWindPriorityReason(args.selected, args.scenario)
  ) {
    return args.selected;
  }

  const candidates = args.top
    ? preferDifferentFamilyWhenAvailable({
      candidates: args.candidates,
      top: args.top,
    })
    : args.candidates;
  const protectsAgainstActiveGoal = args.scenario.recommendation_goal ===
      "big_fish" && hasActiveGoalReason(args.selected, args.scenario);
  const reactionFit = candidates
    .filter((candidate) =>
      candidate.profile.id !== args.top?.profile.id &&
      hasDirtyWindPriorityReason(candidate, args.scenario) &&
      (protectsAgainstActiveGoal
        ? candidate.score >=
          args.selected.score - DIRTY_WIND_BIG_FISH_GOAL_PROTECTION_BAND
        : candidate.score >=
          args.selected.score - DIRTY_WIND_PRIORITY_PROTECTION_BAND)
    )
    .sort((a, b) => {
      const aGoal = hasActiveGoalReason(a, args.scenario) ? 1 : 0;
      const bGoal = hasActiveGoalReason(b, args.scenario) ? 1 : 0;
      return bGoal - aGoal || b.score - a.score ||
        a.profile.id.localeCompare(b.profile.id);
    })[0];

  return reactionFit ?? args.selected;
}

function recoverAvoidedDirtyWindWhenClearlyBetter(args: {
  selected: CandidateScore;
  candidates: CandidateScore[];
  avoidIds: ReadonlySet<string>;
  scenario: DailyScenario;
  top?: CandidateScore;
}): CandidateScore[] {
  if (args.avoidIds.size === 0) return [args.selected];
  if (
    hasPriorityConditionReason(args.selected, args.scenario) ||
    !priorityConditionTags(args.scenario).some((tag) =>
      tag === "dirty_vibration" || tag === "wind_reaction"
    )
  ) {
    return [args.selected];
  }

  const avoidedReaction = args.candidates
    .filter((candidate) =>
      args.avoidIds.has(candidate.profile.id) &&
      candidate.profile.id !== args.top?.profile.id &&
      (!args.top ||
        candidate.profile.family_group !== args.top.profile.family_group) &&
      hasDirtyWindPriorityReason(candidate, args.scenario) &&
      candidate.score >= args.selected.score + AVOIDED_DIRTY_WIND_REUSE_LEAD
    )
    .sort(rawScoreDescendingThenId)[0];
  return avoidedReaction ? [avoidedReaction] : [args.selected];
}

type AvoidedGroupContext = {
  presentationGroups: ReadonlySet<string>;
  familyGroups: ReadonlySet<string>;
};

function avoidedGroupContext(args: {
  candidates: CandidateScore[];
  avoidIds: ReadonlySet<string>;
}): AvoidedGroupContext {
  const presentationGroups = new Set<string>();
  const familyGroups = new Set<string>();
  for (const candidate of args.candidates) {
    if (!args.avoidIds.has(candidate.profile.id)) continue;
    presentationGroups.add(candidate.profile.presentation_group);
    familyGroups.add(candidate.profile.family_group);
  }
  return { presentationGroups, familyGroups };
}

function preferSetBGroupNoveltyWhenAvailable(args: {
  candidates: CandidateScore[];
  variant: DailyPicksVariant;
  avoidedGroups: AvoidedGroupContext;
  scenario: DailyScenario;
}): CandidateScore[] {
  if (args.variant !== "B") return args.candidates;
  const bestScore = Math.max(
    ...args.candidates.map((candidate) => candidate.score),
  );
  const byId = new Map<string, CandidateScore>();
  if (args.avoidedGroups.presentationGroups.size > 0) {
    const differentPresentation = args.candidates.filter((candidate) =>
      !args.avoidedGroups.presentationGroups.has(
        candidate.profile.presentation_group,
      ) && candidate.score >= bestScore - GROUP_NOVELTY_SCORE_BAND
    );
    for (const candidate of differentPresentation) {
      byId.set(candidate.profile.id, candidate);
    }
  }
  if (
    byId.size < SET_B_NOVELTY_FINALIST_POOL_SIZE &&
    args.avoidedGroups.familyGroups.size > 0
  ) {
    const differentFamily = args.candidates.filter((candidate) =>
      !args.avoidedGroups.familyGroups.has(candidate.profile.family_group) &&
      candidate.score >= bestScore - GROUP_NOVELTY_SCORE_BAND
    );
    for (const candidate of differentFamily) {
      byId.set(candidate.profile.id, candidate);
    }
  }
  if (args.scenario.recommendation_goal === "all_purpose") {
    const closeSpecialists = args.candidates.filter((candidate) =>
      isCloseSpecialistFinalist({
        candidate,
        scenario: args.scenario,
      }) && candidate.score >= bestScore - GROUP_NOVELTY_SCORE_BAND
    );
    for (const candidate of closeSpecialists) {
      byId.set(candidate.profile.id, candidate);
    }
  }
  if (byId.size > 0) return [...byId.values()];
  return args.candidates;
}

function preferNonSurfaceOnCautionWhenAvailable(args: {
  candidates: CandidateScore[];
  scenario: DailyScenario;
  preserveActiveGoal?: boolean;
}): CandidateScore[] {
  const { candidates, scenario } = args;
  if (scenario.surface_daily_gate !== "caution") return candidates;
  const nonSurface = candidates.filter((candidate) =>
    !candidate.profile.is_surface
  );
  if (args.preserveActiveGoal) {
    const activeGoalAvailable = candidates.some((candidate) =>
      hasActiveGoalReason(candidate, scenario)
    );
    const activeGoalStillAvailable = nonSurface.some((candidate) =>
      hasActiveGoalReason(candidate, scenario)
    );
    if (activeGoalAvailable && !activeGoalStillAvailable) return candidates;
  }
  return nonSurface.length > 0 ? nonSurface : candidates;
}

function differentPresentationCandidates(args: {
  candidates: CandidateScore[];
  top: CandidateScore;
}): CandidateScore[] {
  return args.candidates.filter((candidate) =>
    candidate.profile.presentation_group !== args.top.profile.presentation_group
  );
}

function differentFamilyCandidates(args: {
  candidates: CandidateScore[];
  top: CandidateScore;
}): CandidateScore[] {
  return args.candidates.filter((candidate) =>
    candidate.profile.family_group !== args.top.profile.family_group
  );
}

function preferDifferentFamilyWhenAvailable(args: {
  candidates: CandidateScore[];
  top: CandidateScore;
}): CandidateScore[] {
  const differentFamily = differentFamilyCandidates(args);
  return differentFamily.length > 0 ? differentFamily : args.candidates;
}

function isCredibleOpenSurfaceColumnAlternative(args: {
  candidate: CandidateScore;
  selected: CandidateScore;
  scenario: DailyScenario;
}): boolean {
  if (args.candidate.profile.is_surface) return false;
  if (
    args.candidate.score <
      args.selected.score - OPEN_SURFACE_SAME_SIDE_DIVERSITY_BAND
  ) {
    return false;
  }

  if (args.scenario.recommendation_goal === "all_purpose") {
    return isReliableAllPurposeNonSurface(args.candidate, args.scenario) ||
      (!hasHighRiskOnlyProfile(args.candidate) &&
        (hasPriorityConditionReason(args.candidate, args.scenario) ||
          hasConditionReason(args.candidate) ||
          hasScenarioClarityReason(args.candidate, args.scenario) ||
          hasDailyLaneReason(args.candidate) ||
          hasSpecialistDailyLaneReason(args.candidate)));
  }

  const strongConditionFit = hasConditionReason(args.candidate) &&
    (hasPriorityConditionReason(args.candidate, args.scenario) ||
      hasScenarioClarityReason(args.candidate, args.scenario) ||
      hasDailyLaneReason(args.candidate) ||
      hasSpecialistDailyLaneReason(args.candidate));

  return hasActiveGoalReason(args.candidate, args.scenario) ||
    hasGuideCredibleBigFishGoalFit(args.candidate, args.scenario) ||
    strongConditionFit;
}

function applyOpenSurfaceSameSideColumnDiversity(args: {
  top: CandidateScore;
  honorable: CandidateScore;
  candidates: CandidateScore[];
  scenario: DailyScenario;
  avoidIds: ReadonlySet<string>;
  avoidedGroups: AvoidedGroupContext;
}): [CandidateScore, CandidateScore] {
  if (
    args.scenario.surface_daily_gate !== "open" ||
    !args.top.profile.is_surface ||
    !args.honorable.profile.is_surface
  ) {
    return [args.top, args.honorable];
  }

  const nonAvoided = candidatesRespectingAvoids({
    candidates: args.candidates,
    avoidIds: args.avoidIds,
  });
  const replacement = bestRawCloseCandidate({
    candidates: preferDifferentFamilyWhenAvailable({
      candidates: nonAvoided,
      top: args.top,
    }),
    selected: args.honorable,
    predicate: (candidate) =>
      candidate.profile.id !== args.top.profile.id &&
      !args.avoidIds.has(candidate.profile.id) &&
      candidate.profile.family_group !== args.top.profile.family_group &&
      isCredibleOpenSurfaceColumnAlternative({
        candidate,
        selected: args.honorable,
        scenario: args.scenario,
      }),
    scenario: args.scenario,
    top: args.top,
    avoidedGroups: args.avoidedGroups,
  });

  return replacement ? [args.top, replacement] : [args.top, args.honorable];
}

function topFinalistCandidates(args: {
  candidates: CandidateScore[];
  scenario: DailyScenario;
  variant: DailyPicksVariant;
  avoidIds: ReadonlySet<string>;
  avoidedGroups: AvoidedGroupContext;
}): CandidateScore[] {
  return topFinalistCandidateSet(args).candidates;
}

function topFinalistCandidateSet(args: {
  candidates: CandidateScore[];
  scenario: DailyScenario;
  variant: DailyPicksVariant;
  avoidIds: ReadonlySet<string>;
  avoidedGroups: AvoidedGroupContext;
}): { candidates: CandidateScore[]; setBBaseCandidates: CandidateScore[] } {
  const bestScore = Math.max(
    ...args.candidates.map((candidate) => candidate.score),
  );
  const inBand = qualityBand(args.candidates, bestScore, TOP_QUALITY_BAND);
  const eligibleAvoiding = qualityBandRespectingAvoids({
    candidates: args.candidates,
    inBand,
    avoidIds: args.avoidIds,
    bestScore,
  });
  const eligible = eligibleAvoiding;
  const broadEligible = candidatesRespectingAvoids({
    candidates: args.candidates,
    avoidIds: args.avoidIds,
  });
  const broadHardEligible = args.candidates;
  const surfaceEligibleBase = preferNonSurfaceOnCautionWhenAvailable({
    candidates: eligible,
    scenario: args.scenario,
  });
  const broadSurfaceEligible = preferNonSurfaceOnCautionWhenAvailable({
    candidates: broadEligible,
    scenario: args.scenario,
  });
  const broadHardSurfaceEligible = preferNonSurfaceOnCautionWhenAvailable({
    candidates: broadHardEligible,
    scenario: args.scenario,
  });
  const surfaceEligible = includeCloseSpecialistFinalists({
    candidates: surfaceEligibleBase,
    broadCandidates: broadSurfaceEligible,
    scenario: args.scenario,
    bestScore,
  });
  const varietyEligible = withCloseBigFishGoalFit({
    candidates: surfaceEligible,
    preferred: surfaceEligible,
    scenario: args.scenario,
  });
  const noveltyEligible = preferSetBGroupNoveltyWhenAvailable({
    candidates: varietyEligible,
    variant: args.variant,
    avoidedGroups: args.avoidedGroups,
    scenario: args.scenario,
  });
  return {
    candidates: noveltyEligible,
    setBBaseCandidates: varietyEligible,
  };
}

function selectTop(args: {
  candidates: CandidateScore[];
  side: "lure" | "fly";
  scenario: DailyScenario;
  seed: string;
  variant: DailyPicksVariant;
  avoidIds: ReadonlySet<string>;
  avoidedGroups: AvoidedGroupContext;
}): CandidateScore {
  const noveltyEligible = topFinalistCandidates({
    candidates: args.candidates,
    scenario: args.scenario,
    variant: args.variant,
    avoidIds: args.avoidIds,
    avoidedGroups: args.avoidedGroups,
  });
  const broadEligible = candidatesRespectingAvoids({
    candidates: args.candidates,
    avoidIds: args.avoidIds,
  });
  const broadHardEligible = args.candidates;
  const broadSurfaceEligible = preferNonSurfaceOnCautionWhenAvailable({
    candidates: broadEligible,
    scenario: args.scenario,
  });
  const broadHardSurfaceEligible = preferNonSurfaceOnCautionWhenAvailable({
    candidates: broadHardEligible,
    scenario: args.scenario,
  });
  const selected = uniformFinalistPick({
    candidates: noveltyEligible,
    scenario: args.scenario,
    seed: args.seed,
    variant: args.variant,
    side: args.side,
    slot: "top",
  });
  const dailyLaneProtected = protectHigherScoringDailyLane({
    selected,
    candidates: noveltyEligible,
  });
  const dirtyWindProtected = protectDirtyWindPriorityFit({
    selected: dailyLaneProtected,
    candidates: broadSurfaceEligible,
    scenario: args.scenario,
  });
  const recovered = recoverAvoidedDirtyWindWhenClearlyBetter({
    selected: dirtyWindProtected,
    candidates: broadHardSurfaceEligible,
    avoidIds: args.avoidIds,
    scenario: args.scenario,
  })[0]!;
  const heatSafe = applyHeatFinesseSafety({
    selected: recovered,
    broadCandidates: broadSurfaceEligible,
    scenario: args.scenario,
    avoidedGroups: args.avoidedGroups,
  });
  const pikeClearControlSafe = applyPikeClearCalmControlSafety({
    selected: heatSafe,
    broadCandidates: broadSurfaceEligible,
    scenario: args.scenario,
    avoidedGroups: args.avoidedGroups,
  });
  return applyTopGoalSafety({
    selected: pikeClearControlSafe,
    broadCandidates: broadSurfaceEligible,
    scenario: args.scenario,
    avoidedGroups: args.avoidedGroups,
  });
}

function bestRawCloseCandidate(args: {
  candidates: CandidateScore[];
  selected: CandidateScore;
  predicate: (candidate: CandidateScore) => boolean;
  scenario?: DailyScenario;
  top?: CandidateScore | null;
  avoidedGroups?: AvoidedGroupContext;
}): CandidateScore | null {
  const conditionFitRank = (candidate: CandidateScore): number => {
    if (!args.scenario) return 0;
    if (
      hasActiveGoalReason(candidate, args.scenario) &&
      hasPriorityConditionReason(candidate, args.scenario)
    ) {
      return 3;
    }
    if (
      hasActiveGoalReason(candidate, args.scenario) &&
      hasConditionReason(candidate)
    ) {
      return 2;
    }
    if (hasPriorityConditionReason(candidate, args.scenario)) return 1;
    return 0;
  };
  const safetyDiversityRank = (candidate: CandidateScore): number => {
    let rank = 0;
    if (args.top) {
      if (
        candidate.profile.presentation_group !==
          args.top.profile.presentation_group
      ) {
        rank += 8;
      }
      if (candidate.profile.family_group !== args.top.profile.family_group) {
        rank += 5;
      }
    }
    if (args.avoidedGroups) {
      if (
        !args.avoidedGroups.presentationGroups.has(
          candidate.profile.presentation_group,
        )
      ) {
        rank += 3;
      }
      if (
        !args.avoidedGroups.familyGroups.has(candidate.profile.family_group)
      ) {
        rank += 2;
      }
    }
    if (
      candidate.profile.presentation_group !==
        args.selected.profile.presentation_group
    ) {
      rank += 1;
    }
    return rank;
  };
  return args.candidates
    .filter((candidate) =>
      candidate.profile.id !== args.selected.profile.id &&
      candidate.score >= args.selected.score - HONORABLE_QUALITY_BAND &&
      args.predicate(candidate)
    )
    .sort((a, b) =>
      conditionFitRank(b) - conditionFitRank(a) ||
      safetyDiversityRank(b) - safetyDiversityRank(a) ||
      b.score - a.score ||
      a.profile.id.localeCompare(b.profile.id)
    )[0] ?? null;
}

function applyHonorableGoalSafety(args: {
  selected: CandidateScore;
  broadCandidates: CandidateScore[];
  avoidedFallbackCandidates?: CandidateScore[];
  top: CandidateScore;
  side: "lure" | "fly";
  scenario: DailyScenario;
  variant: DailyPicksVariant;
  avoidedGroups: AvoidedGroupContext;
}): CandidateScore {
  if (
    args.scenario.recommendation_goal === "big_fish" &&
    !hasActiveGoalReason(args.selected, args.scenario)
  ) {
    const conditionCredibleUpside = hasPriorityConditionReason(
        args.selected,
        args.scenario,
      )
      ? bestRawCloseCandidate({
        candidates: preferDifferentFamilyWhenAvailable({
          candidates: args.broadCandidates,
          top: args.top,
        }),
        selected: args.selected,
        predicate: (candidate) =>
          candidate.profile.id !== args.top.profile.id &&
          hasActiveGoalReason(candidate, args.scenario) &&
          hasPriorityConditionReason(candidate, args.scenario),
        scenario: args.scenario,
        top: args.top,
        avoidedGroups: args.avoidedGroups,
      })
      : null;
    if (conditionCredibleUpside) return conditionCredibleUpside;

    if (hasPriorityConditionReason(args.selected, args.scenario)) {
      const guideCredibleUpside = bestRawCloseCandidate({
        candidates: preferDifferentFamilyWhenAvailable({
          candidates: args.broadCandidates,
          top: args.top,
        }),
        selected: args.selected,
        predicate: (candidate) =>
          candidate.profile.id !== args.top.profile.id &&
          hasGuideCredibleBigFishGoalFit(candidate, args.scenario),
        scenario: args.scenario,
        top: args.top,
        avoidedGroups: args.avoidedGroups,
      });
      if (guideCredibleUpside) return guideCredibleUpside;

      return args.selected;
    }

    const upside = bestRawCloseCandidate({
      candidates: preferDifferentFamilyWhenAvailable({
        candidates: args.broadCandidates,
        top: args.top,
      }),
      selected: args.selected,
      predicate: (candidate) =>
        candidate.profile.id !== args.top.profile.id &&
        hasActiveGoalReason(candidate, args.scenario),
      scenario: args.scenario,
      top: args.top,
      avoidedGroups: args.avoidedGroups,
    });
    if (upside) return upside;

    const conditionFit = bestRawCloseCandidate({
      candidates: preferDifferentFamilyWhenAvailable({
        candidates: args.broadCandidates,
        top: args.top,
      }),
      selected: args.selected,
      predicate: (candidate) =>
        candidate.profile.id !== args.top.profile.id &&
        hasPriorityConditionReason(candidate, args.scenario),
      scenario: args.scenario,
      top: args.top,
      avoidedGroups: args.avoidedGroups,
    });
    if (conditionFit) return conditionFit;

    const guideAcceptableConditionFit = bestRawCloseCandidate({
      candidates: preferDifferentFamilyWhenAvailable({
        candidates: args.broadCandidates,
        top: args.top,
      }),
      selected: args.selected,
      predicate: (candidate) =>
        candidate.profile.id !== args.top.profile.id &&
        hasConditionReason(candidate),
      scenario: args.scenario,
      top: args.top,
      avoidedGroups: args.avoidedGroups,
    });
    if (guideAcceptableConditionFit) return guideAcceptableConditionFit;

    if (hasConditionReason(args.selected)) {
      return args.selected;
    }

    const legalNonAvoidedFallbacks = preferDifferentFamilyWhenAvailable({
      candidates: args.broadCandidates,
      top: args.top,
    }).filter((candidate) =>
      candidate.profile.id !== args.top.profile.id &&
      candidate.profile.id !== args.selected.profile.id
    );
    if (legalNonAvoidedFallbacks.length > 0) {
      return args.selected;
    }

    const avoidedUpside = args.avoidedFallbackCandidates
      ? bestRawCloseCandidate({
        candidates: preferDifferentFamilyWhenAvailable({
          candidates: args.avoidedFallbackCandidates,
          top: args.top,
        }),
        selected: args.selected,
        predicate: (candidate) =>
          candidate.profile.id !== args.top.profile.id &&
          hasActiveGoalReason(candidate, args.scenario),
        scenario: args.scenario,
        top: args.top,
        avoidedGroups: args.avoidedGroups,
      })
      : null;
    if (avoidedUpside) return avoidedUpside;
  }

  const setBPikeFlyReliability = protectPikeSetBAllPurposeFlyReliability({
    selected: args.selected,
    broadCandidates: args.broadCandidates,
    top: args.top,
    side: args.side,
    scenario: args.scenario,
    variant: args.variant,
    avoidedGroups: args.avoidedGroups,
  });
  if (setBPikeFlyReliability !== args.selected) {
    return setBPikeFlyReliability;
  }

  if (
    args.scenario.recommendation_goal === "all_purpose" &&
    isRiskyAllPurposeSurfacePick(args.top, args.scenario) &&
    isRiskyAllPurposeSurfacePick(args.selected, args.scenario)
  ) {
    const reliableNonSurface = bestRawCloseCandidate({
      candidates: preferDifferentFamilyWhenAvailable({
        candidates: args.broadCandidates,
        top: args.top,
      }),
      selected: args.selected,
      predicate: (candidate) =>
        candidate.profile.id !== args.top.profile.id &&
        isReliableAllPurposeNonSurface(candidate, args.scenario),
      scenario: args.scenario,
      top: args.top,
      avoidedGroups: args.avoidedGroups,
    });
    if (reliableNonSurface) return reliableNonSurface;
  }

  if (
    args.scenario.recommendation_goal === "all_purpose" &&
    args.top.profile.is_surface &&
    args.selected.profile.is_surface &&
    !isStrongAllPurposeSurfaceWindow(args.scenario)
  ) {
    const reliableNonSurface = bestRawCloseCandidate({
      candidates: preferDifferentFamilyWhenAvailable({
        candidates: args.broadCandidates,
        top: args.top,
      }),
      selected: args.selected,
      predicate: (candidate) =>
        candidate.profile.id !== args.top.profile.id &&
        isReliableAllPurposeNonSurface(candidate, args.scenario),
      scenario: args.scenario,
      top: args.top,
      avoidedGroups: args.avoidedGroups,
    });
    if (reliableNonSurface) return reliableNonSurface;
  }

  return args.selected;
}

function isPikeSetBAllPurposeRiskOnlyFly(args: {
  candidate: CandidateScore;
  scenario: DailyScenario;
}): boolean {
  if (
    args.scenario.species !== "northern_pike" ||
    args.scenario.recommendation_goal !== "all_purpose" ||
    args.candidate.side !== "fly" ||
    hasActiveGoalReason(args.candidate, args.scenario)
  ) {
    return false;
  }
  return args.candidate.profile.goal_tags.includes("high_risk_high_reward") ||
    args.candidate.profile.goal_tags.includes("big_fish_upside");
}

function isReliablePikeAllPurposeFlyAlternative(args: {
  candidate: CandidateScore;
  scenario: DailyScenario;
}): boolean {
  if (
    args.candidate.side !== "fly" ||
    !hasActiveGoalReason(args.candidate, args.scenario)
  ) {
    return false;
  }
  const reliableOrVersatile =
    args.candidate.profile.goal_tags.includes("reliable_action") ||
    args.candidate.profile.goal_tags.includes("versatile_search");
  if (!reliableOrVersatile) return false;
  return hasPriorityConditionReason(args.candidate, args.scenario) ||
    hasConditionReason(args.candidate) ||
    hasScenarioClarityReason(args.candidate, args.scenario) ||
    hasDailyLaneReason(args.candidate) ||
    hasSpecialistDailyLaneReason(args.candidate);
}

function protectPikeSetBAllPurposeFlyReliability(args: {
  selected: CandidateScore;
  broadCandidates: CandidateScore[];
  top: CandidateScore;
  side: "lure" | "fly";
  scenario: DailyScenario;
  variant: DailyPicksVariant;
  avoidedGroups: AvoidedGroupContext;
}): CandidateScore {
  if (
    args.variant !== "B" ||
    args.side !== "fly" ||
    !isPikeSetBAllPurposeRiskOnlyFly({
      candidate: args.selected,
      scenario: args.scenario,
    })
  ) {
    return args.selected;
  }

  return bestRawCloseCandidate({
    candidates: preferDifferentFamilyWhenAvailable({
      candidates: args.broadCandidates,
      top: args.top,
    }),
    selected: args.selected,
    predicate: (candidate) =>
      candidate.profile.id !== args.top.profile.id &&
      candidate.score >=
        args.selected.score -
          PIKE_SET_B_ALL_PURPOSE_FLY_RISK_RELIABILITY_BAND &&
      isReliablePikeAllPurposeFlyAlternative({
        candidate,
        scenario: args.scenario,
      }),
    scenario: args.scenario,
    top: args.top,
    avoidedGroups: args.avoidedGroups,
  }) ?? args.selected;
}

function applyTopGoalSafety(args: {
  selected: CandidateScore;
  broadCandidates: CandidateScore[];
  scenario: DailyScenario;
  avoidedGroups: AvoidedGroupContext;
}): CandidateScore {
  if (
    args.scenario.recommendation_goal !== "big_fish" ||
    hasActiveGoalReason(args.selected, args.scenario) ||
    hasPriorityConditionReason(args.selected, args.scenario)
  ) {
    return args.selected;
  }

  return bestRawCloseCandidate({
    candidates: args.broadCandidates,
    selected: args.selected,
    predicate: (candidate) => hasActiveGoalReason(candidate, args.scenario),
    scenario: args.scenario,
    top: null,
    avoidedGroups: args.avoidedGroups,
  }) ?? args.selected;
}

function bigFishPairGoalCoveragePool(args: {
  candidates: CandidateScore[];
  selected: CandidateScore;
  remaining: CandidateScore;
  scenario: DailyScenario;
  avoidIds: ReadonlySet<string>;
}): CandidateScore[] {
  if (args.scenario.recommendation_goal !== "big_fish") return [];

  const surfaceSafe = preferNonSurfaceOnCautionWhenAvailable({
    candidates: args.candidates,
    scenario: args.scenario,
    preserveActiveGoal: true,
  });
  const legalGoalFits = surfaceSafe.filter((candidate) =>
    candidate.profile.id !== args.selected.profile.id &&
    candidate.profile.id !== args.remaining.profile.id &&
    candidate.profile.family_group !== args.remaining.profile.family_group &&
    !args.avoidIds.has(candidate.profile.id) &&
    hasActiveGoalReason(candidate, args.scenario)
  );
  if (legalGoalFits.length === 0) return [];

  const bestGoalScore = Math.max(
    ...legalGoalFits.map((candidate) => candidate.score),
  );
  const credible = legalGoalFits.filter((candidate) =>
    candidate.score >= bestGoalScore - BIG_FISH_PAIR_GOAL_COVERAGE_BAND &&
    candidate.score >= args.selected.score - BIG_FISH_PAIR_GOAL_COVERAGE_BAND
  );
  if (credible.length === 0) return [];

  const goalAndPriorityCondition = credible.filter((candidate) =>
    hasPriorityConditionReason(candidate, args.scenario)
  );
  if (goalAndPriorityCondition.length > 0) return goalAndPriorityCondition;

  const guideCredibleGoalFits = credible.filter((candidate) =>
    hasConditionReason(candidate) ||
    hasScenarioClarityReason(candidate, args.scenario) ||
    hasDailyLaneReason(candidate) ||
    hasSpecialistDailyLaneReason(candidate)
  );
  return guideCredibleGoalFits.length > 0 ? guideCredibleGoalFits : credible;
}

function preservingDirtyWindPairCoverage(args: {
  pool: CandidateScore[];
  selected: CandidateScore;
  remaining: CandidateScore;
  scenario: DailyScenario;
}): CandidateScore[] {
  if (
    !isDirtyStainedWindReactionScenario(args.scenario) ||
    !hasDirtyWindPriorityReason(args.selected, args.scenario) ||
    hasDirtyWindPriorityReason(args.remaining, args.scenario)
  ) {
    return args.pool;
  }

  return args.pool.filter((candidate) =>
    hasDirtyWindPriorityReason(candidate, args.scenario)
  );
}

function ensureBigFishPairGoalCoverage(args: {
  top: CandidateScore;
  honorable: CandidateScore;
  candidates: CandidateScore[];
  side: "lure" | "fly";
  scenario: DailyScenario;
  seed: string;
  variant: DailyPicksVariant;
  avoidIds: ReadonlySet<string>;
}): [CandidateScore, CandidateScore] {
  if (
    args.scenario.recommendation_goal !== "big_fish" ||
    (hasActiveGoalReason(args.top, args.scenario) &&
      hasActiveGoalReason(args.honorable, args.scenario))
  ) {
    return [args.top, args.honorable];
  }

  const topHasActiveGoal = hasActiveGoalReason(args.top, args.scenario);
  const honorableHasActiveGoal = hasActiveGoalReason(
    args.honorable,
    args.scenario,
  );

  if (topHasActiveGoal !== honorableHasActiveGoal) {
    const selected = topHasActiveGoal ? args.honorable : args.top;
    const remaining = topHasActiveGoal ? args.top : args.honorable;
    const replacementPool = bigFishPairGoalCoveragePool({
      candidates: args.candidates,
      selected,
      remaining,
      scenario: args.scenario,
      avoidIds: args.avoidIds,
    });
    const conditionCrediblePool = replacementPool.filter((candidate) =>
      hasGuideCredibleBigFishGoalFit(candidate, args.scenario)
    );
    const selectedHasConditionFit = hasPriorityConditionReason(
      selected,
      args.scenario,
    ) || hasConditionReason(selected);
    const finalPool = selectedHasConditionFit
      ? conditionCrediblePool
      : replacementPool;
    const coverageSafePool = preservingDirtyWindPairCoverage({
      pool: finalPool,
      selected,
      remaining,
      scenario: args.scenario,
    });
    if (coverageSafePool.length === 0) return [args.top, args.honorable];

    const replacement = uniformExactPoolPick({
      candidates: coverageSafePool,
      scenario: args.scenario,
      seed: args.seed,
      variant: args.variant,
      side: args.side,
      slot: topHasActiveGoal ? "honorable" : "top",
    });
    return topHasActiveGoal
      ? [args.top, replacement]
      : [replacement, args.honorable];
  }

  const topReplacementPool = bigFishPairGoalCoveragePool({
    candidates: args.candidates,
    selected: args.top,
    remaining: args.honorable,
    scenario: args.scenario,
    avoidIds: args.avoidIds,
  });
  const topCoverageSafePool = preservingDirtyWindPairCoverage({
    pool: topReplacementPool,
    selected: args.top,
    remaining: args.honorable,
    scenario: args.scenario,
  });
  const honorableReplacementPool = bigFishPairGoalCoveragePool({
    candidates: args.candidates,
    selected: args.honorable,
    remaining: args.top,
    scenario: args.scenario,
    avoidIds: args.avoidIds,
  });
  const honorableCoverageSafePool = preservingDirtyWindPairCoverage({
    pool: honorableReplacementPool,
    selected: args.honorable,
    remaining: args.top,
    scenario: args.scenario,
  });
  if (
    topCoverageSafePool.length === 0 &&
    honorableCoverageSafePool.length === 0
  ) {
    return [args.top, args.honorable];
  }

  const topHasPriorityFit = hasPriorityConditionReason(args.top, args.scenario);
  const honorableHasPriorityFit = hasPriorityConditionReason(
    args.honorable,
    args.scenario,
  );
  const replaceHonorable = honorableCoverageSafePool.length > 0 &&
    (!honorableHasPriorityFit ||
      topHasPriorityFit ||
      topCoverageSafePool.length === 0);

  if (replaceHonorable) {
    return [
      args.top,
      uniformExactPoolPick({
        candidates: honorableCoverageSafePool,
        scenario: args.scenario,
        seed: args.seed,
        variant: args.variant,
        side: args.side,
        slot: "honorable",
      }),
    ];
  }

  if (topCoverageSafePool.length > 0) {
    return [
      uniformExactPoolPick({
        candidates: topCoverageSafePool,
        scenario: args.scenario,
        seed: args.seed,
        variant: args.variant,
        side: args.side,
        slot: "top",
      }),
      args.honorable,
    ];
  }

  return [args.top, args.honorable];
}

function isGuideCredibleSetBExactReplacement(args: {
  candidate: CandidateScore;
  selected: CandidateScore;
  other: CandidateScore;
  scenario: DailyScenario;
}): boolean {
  if (args.candidate.score < args.selected.score - HONORABLE_QUALITY_BAND) {
    return false;
  }

  if (args.scenario.recommendation_goal === "big_fish") {
    if (
      !hasActiveGoalReason(args.other, args.scenario) &&
      !hasActiveGoalReason(args.candidate, args.scenario)
    ) {
      return false;
    }
    return hasGuideCredibleBigFishGoalFit(args.candidate, args.scenario) ||
      hasPriorityConditionReason(args.candidate, args.scenario) ||
      hasConditionReason(args.candidate) ||
      hasScenarioClarityReason(args.candidate, args.scenario) ||
      hasDailyLaneReason(args.candidate) ||
      hasSpecialistDailyLaneReason(args.candidate);
  }

  return isReliableAllPurposeNonSurface(args.candidate, args.scenario) ||
    hasPriorityConditionReason(args.candidate, args.scenario) ||
    hasConditionReason(args.candidate) ||
    hasScenarioClarityReason(args.candidate, args.scenario) ||
    hasDailyLaneReason(args.candidate) ||
    hasSpecialistDailyLaneReason(args.candidate);
}

function repairSetBExactAvoidance(args: {
  top: CandidateScore;
  honorable: CandidateScore;
  candidates: CandidateScore[];
  scenario: DailyScenario;
  avoidIds: ReadonlySet<string>;
  avoidedGroups: AvoidedGroupContext;
}): [CandidateScore, CandidateScore] {
  if (args.avoidIds.size === 0) return [args.top, args.honorable];

  const surfaceSafe = preferNonSurfaceOnCautionWhenAvailable({
    candidates: args.candidates,
    scenario: args.scenario,
    preserveActiveGoal: args.scenario.recommendation_goal === "big_fish",
  });
  const replacementFor = (
    selected: CandidateScore,
    other: CandidateScore,
  ): CandidateScore | null => {
    if (!args.avoidIds.has(selected.profile.id)) return null;
    const legal = surfaceSafe.filter((candidate) =>
      !args.avoidIds.has(candidate.profile.id) &&
      candidate.profile.id !== selected.profile.id &&
      candidate.profile.id !== other.profile.id
    );
    if (legal.length === 0) return null;
    return bestRawCloseCandidate({
      candidates: preferDifferentFamilyWhenAvailable({
        candidates: legal,
        top: other,
      }),
      selected,
      predicate: (candidate) =>
        isGuideCredibleSetBExactReplacement({
          candidate,
          selected,
          other,
          scenario: args.scenario,
        }),
      scenario: args.scenario,
      top: other,
      avoidedGroups: args.avoidedGroups,
    });
  };

  let top = args.top;
  let honorable = args.honorable;
  const honorableReplacement = replacementFor(honorable, top);
  if (honorableReplacement) honorable = honorableReplacement;
  const topReplacement = replacementFor(top, honorable);
  if (topReplacement) top = topReplacement;
  return [top, honorable];
}

function applyHeatFinesseSafety(args: {
  selected: CandidateScore;
  broadCandidates: CandidateScore[];
  scenario: DailyScenario;
  top?: CandidateScore;
  avoidedGroups: AvoidedGroupContext;
}): CandidateScore {
  if (
    !args.scenario.scenario_tags.includes("heat_finesse") ||
    args.selected.profile.primary_pace !== "fast" ||
    hasPriorityConditionReason(args.selected, args.scenario)
  ) {
    return args.selected;
  }

  const candidates = args.top
    ? preferDifferentFamilyWhenAvailable({
      candidates: args.broadCandidates,
      top: args.top,
    })
    : args.broadCandidates;
  return bestRawCloseCandidate({
    candidates,
    selected: args.selected,
    predicate: (candidate) =>
      candidate.profile.id !== args.top?.profile.id &&
      hasScoreReasonPrefix(candidate, "condition_tag:heat_finesse:"),
    scenario: args.scenario,
    top: args.top ?? null,
    avoidedGroups: args.avoidedGroups,
  }) ?? args.selected;
}

function applyPikeClearCalmControlSafety(args: {
  selected: CandidateScore;
  broadCandidates: CandidateScore[];
  scenario: DailyScenario;
  top?: CandidateScore;
  avoidedGroups: AvoidedGroupContext;
}): CandidateScore {
  if (!isPikeClearCalmNoisySelection(args.selected, args.scenario)) {
    return args.selected;
  }

  const candidates = args.top
    ? preferDifferentFamilyWhenAvailable({
      candidates: args.broadCandidates,
      top: args.top,
    })
    : args.broadCandidates;
  return bestRawCloseCandidate({
    candidates,
    selected: args.selected,
    predicate: (candidate) =>
      candidate.profile.id !== args.top?.profile.id &&
      candidate.score >=
        args.selected.score - PIKE_CLEAR_CALM_CONTROL_BAND &&
      isPikeClearCalmControlledAlternative(candidate, args.scenario),
    scenario: args.scenario,
    top: args.top ?? null,
    avoidedGroups: args.avoidedGroups,
  }) ?? args.selected;
}

function selectHonorable(args: {
  candidates: CandidateScore[];
  top: CandidateScore;
  side: "lure" | "fly";
  scenario: DailyScenario;
  seed: string;
  variant: DailyPicksVariant;
  avoidIds: ReadonlySet<string>;
  avoidedGroups: AvoidedGroupContext;
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
  const eligibleAvoiding = qualityBandRespectingAvoids({
    candidates: remaining,
    inBand,
    avoidIds: args.avoidIds,
    bestScore: bestRemainingScore,
  });
  const eligible = eligibleAvoiding;
  const broadEligible = candidatesRespectingAvoids({
    candidates: remaining,
    avoidIds: args.avoidIds,
  });
  const broadHardEligible = remaining;
  const shouldRequireActiveGoal = args.scenario.recommendation_goal ===
      "big_fish" && !hasActiveGoalReason(args.top, args.scenario);
  const surfaceEligibleBase = preferNonSurfaceOnCautionWhenAvailable({
    candidates: eligible,
    scenario: args.scenario,
    preserveActiveGoal: shouldRequireActiveGoal,
  });
  const broadSurfaceEligible = preferNonSurfaceOnCautionWhenAvailable({
    candidates: broadEligible,
    scenario: args.scenario,
    preserveActiveGoal: shouldRequireActiveGoal,
  });
  const broadHardSurfaceEligible = preferNonSurfaceOnCautionWhenAvailable({
    candidates: broadHardEligible,
    scenario: args.scenario,
    preserveActiveGoal: shouldRequireActiveGoal,
  });
  const surfaceEligible = includeCloseSpecialistFinalists({
    candidates: surfaceEligibleBase,
    broadCandidates: broadSurfaceEligible,
    scenario: args.scenario,
    bestScore: bestRemainingScore,
  });
  const differentFamilyAfterAvoids = differentFamilyCandidates({
    candidates: broadSurfaceEligible,
    top: args.top,
  });
  const differentFamilyAfterHardGates = differentFamilyCandidates({
    candidates: broadHardSurfaceEligible,
    top: args.top,
  });
  const differentFamilyInBand = differentFamilyCandidates({
    candidates: surfaceEligible,
    top: args.top,
  });
  const familyEligible = differentFamilyAfterAvoids.length > 0
    ? (differentFamilyInBand.length > 0
      ? differentFamilyInBand
      : differentFamilyAfterAvoids)
    : differentFamilyAfterHardGates.length > 0
    ? differentFamilyAfterHardGates
    : surfaceEligible;
  const safetyCandidates = differentFamilyAfterAvoids.length > 0 ||
      differentFamilyAfterHardGates.length === 0
    ? broadSurfaceEligible
    : broadHardSurfaceEligible;
  const avoidedFallbackCandidates = args.scenario.recommendation_goal ===
      "big_fish"
    ? broadHardSurfaceEligible
    : undefined;
  const fitEligible = withCloseBigFishGoalFit({
    candidates: familyEligible,
    preferred: familyEligible,
    scenario: args.scenario,
  });
  const setBNoveltyEligible = preferSetBGroupNoveltyWhenAvailable({
    candidates: fitEligible,
    variant: args.variant,
    avoidedGroups: args.avoidedGroups,
    scenario: args.scenario,
  });
  const dirtyWindCoverage = dirtyWindHonorableCoverageSet({
    narrowedCandidates: setBNoveltyEligible,
    broadCandidates: safetyCandidates,
    avoidedFallbackCandidates: broadHardSurfaceEligible,
    side: args.side,
    scenario: args.scenario,
    top: args.top,
  });
  const coverageEligible = dirtyWindCoverage?.candidates ?? setBNoveltyEligible;
  const differentPresentationInBand = differentPresentationCandidates({
    candidates: coverageEligible,
    top: args.top,
  }).filter((candidate) =>
    candidate.score >=
      Math.max(...coverageEligible.map((entry) => entry.score)) -
        GROUP_NOVELTY_SCORE_BAND
  );
  const varietyEligible =
    differentPresentationInBand.length >= TARGET_FINALIST_POOL_SIZE
      ? differentPresentationInBand
      : coverageEligible;

  const naturalSelected = uniformFinalistPick({
    candidates: varietyEligible,
    scenario: args.scenario,
    seed: args.seed,
    variant: args.variant,
    side: args.side,
    slot: "honorable",
  });
  const selected = dirtyWindCoverage &&
      !hasDirtyWindPriorityReason(naturalSelected, args.scenario)
    ? uniformExactPoolPick({
      candidates: dirtyWindCoverage.candidates,
      scenario: args.scenario,
      seed: args.seed,
      variant: args.variant,
      side: args.side,
      slot: "honorable",
    })
    : naturalSelected;
  const coverageOverrideUsed = selected !== naturalSelected;
  const dailyLaneProtected = coverageOverrideUsed
    ? selected
    : protectHigherScoringDailyLane({
      selected,
      candidates: varietyEligible,
    });
  const dirtyWindProtected = protectDirtyWindPriorityFit({
    selected: dailyLaneProtected,
    candidates: safetyCandidates,
    scenario: args.scenario,
    top: args.top,
  });
  const recovered = recoverAvoidedDirtyWindWhenClearlyBetter({
    selected: dirtyWindProtected,
    candidates: broadHardSurfaceEligible,
    avoidIds: args.avoidIds,
    scenario: args.scenario,
    top: args.top,
  })[0]!;
  const heatSafe = applyHeatFinesseSafety({
    selected: recovered,
    broadCandidates: safetyCandidates,
    scenario: args.scenario,
    top: args.top,
    avoidedGroups: args.avoidedGroups,
  });
  const pikeClearControlSafe = applyPikeClearCalmControlSafety({
    selected: heatSafe,
    broadCandidates: safetyCandidates,
    scenario: args.scenario,
    top: args.top,
    avoidedGroups: args.avoidedGroups,
  });
  return applyHonorableGoalSafety({
    selected: pikeClearControlSafe,
    broadCandidates: safetyCandidates,
    avoidedFallbackCandidates,
    top: args.top,
    side: args.side,
    scenario: args.scenario,
    variant: args.variant,
    avoidedGroups: args.avoidedGroups,
  });
}

function honorableFinalistCandidates(args: {
  candidates: CandidateScore[];
  top: CandidateScore;
  scenario: DailyScenario;
  variant: DailyPicksVariant;
  avoidIds: ReadonlySet<string>;
  avoidedGroups: AvoidedGroupContext;
}): CandidateScore[] {
  return honorableFinalistCandidateSet(args).candidates;
}

type HonorableFinalistCandidateSet = {
  candidates: CandidateScore[];
  setBBaseCandidates: CandidateScore[];
  dirtyWindCoverage?: DirtyWindCoverageCandidateSet;
};

function honorableFinalistCandidateSet(args: {
  candidates: CandidateScore[];
  top: CandidateScore;
  scenario: DailyScenario;
  variant: DailyPicksVariant;
  avoidIds: ReadonlySet<string>;
  avoidedGroups: AvoidedGroupContext;
}): HonorableFinalistCandidateSet {
  const remaining = args.candidates.filter((candidate) =>
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
  const eligibleAvoiding = qualityBandRespectingAvoids({
    candidates: remaining,
    inBand,
    avoidIds: args.avoidIds,
    bestScore: bestRemainingScore,
  });
  const shouldRequireActiveGoal = args.scenario.recommendation_goal ===
      "big_fish" && !hasActiveGoalReason(args.top, args.scenario);
  const surfaceEligible = preferNonSurfaceOnCautionWhenAvailable({
    candidates: eligibleAvoiding,
    scenario: args.scenario,
    preserveActiveGoal: shouldRequireActiveGoal,
  });
  const broadEligible = candidatesRespectingAvoids({
    candidates: remaining,
    avoidIds: args.avoidIds,
  });
  const broadHardEligible = remaining;
  const broadSurfaceEligible = preferNonSurfaceOnCautionWhenAvailable({
    candidates: broadEligible,
    scenario: args.scenario,
    preserveActiveGoal: shouldRequireActiveGoal,
  });
  const broadHardSurfaceEligible = preferNonSurfaceOnCautionWhenAvailable({
    candidates: broadHardEligible,
    scenario: args.scenario,
    preserveActiveGoal: shouldRequireActiveGoal,
  });
  const differentFamilyAfterAvoids = differentFamilyCandidates({
    candidates: broadSurfaceEligible,
    top: args.top,
  });
  const differentFamilyAfterHardGates = differentFamilyCandidates({
    candidates: broadHardSurfaceEligible,
    top: args.top,
  });
  const differentFamilyInBand = differentFamilyCandidates({
    candidates: surfaceEligible,
    top: args.top,
  });
  const familyEligible = differentFamilyAfterAvoids.length > 0
    ? (differentFamilyInBand.length > 0
      ? differentFamilyInBand
      : differentFamilyAfterAvoids)
    : differentFamilyAfterHardGates.length > 0
    ? differentFamilyAfterHardGates
    : surfaceEligible;
  const fitEligible = withCloseBigFishGoalFit({
    candidates: familyEligible,
    preferred: familyEligible,
    scenario: args.scenario,
  });
  const setBNoveltyEligible = preferSetBGroupNoveltyWhenAvailable({
    candidates: fitEligible,
    variant: args.variant,
    avoidedGroups: args.avoidedGroups,
    scenario: args.scenario,
  });
  const safetyCandidates = differentFamilyAfterAvoids.length > 0 ||
      differentFamilyAfterHardGates.length === 0
    ? broadSurfaceEligible
    : broadHardSurfaceEligible;
  const dirtyWindCoverage = dirtyWindHonorableCoverageSet({
    narrowedCandidates: setBNoveltyEligible,
    broadCandidates: safetyCandidates,
    avoidedFallbackCandidates: broadHardSurfaceEligible,
    side: args.candidates[0]?.side ?? "lure",
    scenario: args.scenario,
    top: args.top,
  });
  const coverageEligible = dirtyWindCoverage?.candidates ?? setBNoveltyEligible;
  const differentPresentationInBand = differentPresentationCandidates({
    candidates: coverageEligible,
    top: args.top,
  }).filter((candidate) =>
    candidate.score >=
      Math.max(...coverageEligible.map((entry) => entry.score)) -
        GROUP_NOVELTY_SCORE_BAND
  );
  return {
    candidates: differentPresentationInBand.length >= TARGET_FINALIST_POOL_SIZE
      ? differentPresentationInBand
      : coverageEligible,
    setBBaseCandidates: fitEligible,
    dirtyWindCoverage: dirtyWindCoverage ?? undefined,
  };
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
  const avoidedGroups = avoidedGroupContext({ candidates, avoidIds });
  const top = selectTop({
    candidates,
    side: args.side,
    scenario: args.scenario,
    seed: args.seed,
    variant: args.variant,
    avoidIds,
    avoidedGroups,
  });
  const honorable = selectHonorable({
    candidates,
    top,
    side: args.side,
    scenario: args.scenario,
    seed: args.seed,
    variant: args.variant,
    avoidIds,
    avoidedGroups,
  });
  const [coveredTop, coveredHonorable] = ensureBigFishPairGoalCoverage({
    top,
    honorable,
    candidates,
    side: args.side,
    scenario: args.scenario,
    seed: args.seed,
    variant: args.variant,
    avoidIds,
  });
  const [exactSafeTop, exactSafeHonorable] = repairSetBExactAvoidance({
    top: coveredTop,
    honorable: coveredHonorable,
    candidates,
    scenario: args.scenario,
    avoidIds,
    avoidedGroups,
  });
  return applyOpenSurfaceSameSideColumnDiversity({
    top: exactSafeTop,
    honorable: exactSafeHonorable,
    candidates,
    scenario: args.scenario,
    avoidIds,
    avoidedGroups,
  });
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

function finalistPoolDiagnosticsForSide(args: {
  scores: CandidateScore[];
  side: "lure" | "fly";
  top: CandidateScore;
  scenario: DailyScenario;
  variant: DailyPicksVariant;
  avoidIds?: readonly string[];
}): DailyPicksFinalistPoolDiagnostics {
  const candidates = uniqueBestScores({
    scores: args.scores,
    side: args.side,
  });
  const avoidIds = new Set(args.avoidIds ?? []);
  const avoidedGroups = avoidedGroupContext({ candidates, avoidIds });
  const topCandidateSet = topFinalistCandidateSet({
    candidates,
    scenario: args.scenario,
    variant: args.variant,
    avoidIds,
    avoidedGroups,
  });
  const topCandidates = topCandidateSet.candidates;
  const honorableCandidateSet = honorableFinalistCandidateSet({
    candidates,
    top: args.top,
    scenario: args.scenario,
    variant: args.variant,
    avoidIds,
    avoidedGroups,
  });
  const honorableCandidates = honorableCandidateSet.candidates;
  return [
    finalistPoolDiagnostics({
      candidates: topCandidates,
      setBBaseCandidates: topCandidateSet.setBBaseCandidates,
      scenario: args.scenario,
      side: args.side,
      slot: "top",
      variant: args.variant,
      avoidedGroups,
    }),
    finalistPoolDiagnostics({
      candidates: honorableCandidates,
      setBBaseCandidates: honorableCandidateSet.setBBaseCandidates,
      dirtyWindCoverage: honorableCandidateSet.dirtyWindCoverage,
      scenario: args.scenario,
      side: args.side,
      slot: "honorable",
      variant: args.variant,
      avoidedGroups,
    }),
  ];
}

export function buildDailyPicksFinalistPoolDiagnostics(args: {
  selection: DailyPicksSelection;
  lureScores: CandidateScore[];
  flyScores: CandidateScore[];
  scenario: DailyScenario;
  variant: DailyPicksVariant;
  avoidLureIds?: readonly string[];
  avoidFlyIds?: readonly string[];
}): DailyPicksFinalistPoolDiagnostics {
  return [
    ...finalistPoolDiagnosticsForSide({
      scores: args.lureScores,
      side: "lure",
      top: args.selection.lure_of_the_day,
      scenario: args.scenario,
      variant: args.variant,
      avoidIds: args.avoidLureIds,
    }),
    ...finalistPoolDiagnosticsForSide({
      scores: args.flyScores,
      side: "fly",
      top: args.selection.fly_of_the_day,
      scenario: args.scenario,
      variant: args.variant,
      avoidIds: args.avoidFlyIds,
    }),
  ];
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
