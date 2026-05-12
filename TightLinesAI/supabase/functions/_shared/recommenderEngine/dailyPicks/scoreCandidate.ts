import type {
  ArchetypeProfileV4,
  ForageBucket,
  SeasonalRowV4,
  TacticalPace,
} from "../v4/contracts.ts";
import type { DailyScenario } from "./buildDailyScenario.ts";
import type { CandidateSide } from "./buildCandidatePool.ts";
import { assertScenarioMatchesSeasonalRow } from "./assertScenarioMatchesSeasonalRow.ts";

export type CandidateScore = {
  profile: ArchetypeProfileV4;
  side: CandidateSide;
  score: number;
  reasons: string[];
};

const SCORE = {
  base: 100,
  conditionTag: 16,
  secondaryConditionTagInGroup: 0,
  subtleSlowLane: 10,
  crawBottomLane: 6,
  heatSlowBottomLane: 6,
  allPurposeReliable: 18,
  allPurposeVersatile: 12,
  bigFishUpside: 20,
  bigFishHighRisk: 12,
  troutBigFishLureUpside: 12,
  troutDirtyCurrentMismatchPenalty: -12,
  clarityStrength: 8,
  primaryForage: 12,
  secondaryForage: 6,
  baselineColumn: 10,
  baselinePrimaryPace: 10,
  baselineSecondaryPace: 6,
  surfaceCautionPenalty: -24,
} as const;

const CONDITION_TAG_GROUPS: readonly (readonly string[])[] = [
  ["wind_reaction", "dirty_vibration"],
  ["warming_search", "open_water_search"],
  ["low_light_surface", "calm_surface"],
];

const CONDITION_TAG_GROUP_BY_TAG = new Map<string, string>(
  CONDITION_TAG_GROUPS.flatMap((group) =>
    group.map((tag) => [tag, group.join("|")] as const)
  ),
);

function addScore(
  reasons: string[],
  label: string,
  value: number,
): number {
  reasons.push(`${label}:${value >= 0 ? "+" : ""}${value}`);
  return value;
}

function paceMatchesBaseline(
  profile: ArchetypeProfileV4,
  pace: TacticalPace,
): "primary" | "secondary" | null {
  if (profile.primary_pace === pace) return "primary";
  if (profile.secondary_pace === pace) return "secondary";
  return null;
}

function hasForage(
  profile: ArchetypeProfileV4,
  forage: ForageBucket | undefined,
): boolean {
  return forage != null && profile.forage_tags.includes(forage);
}

function hasScenarioTag(
  scenario: DailyScenario,
  tags: readonly string[],
): boolean {
  return scenario.scenario_tags.some((tag) => tags.includes(tag));
}

function hasSlowPace(profile: ArchetypeProfileV4): boolean {
  return profile.primary_pace === "slow" || profile.secondary_pace === "slow";
}

function isReliableSlowSubtleProfile(profile: ArchetypeProfileV4): boolean {
  return hasSlowPace(profile) &&
    profile.goal_tags.includes("reliable_action") &&
    profile.condition_tags.some((tag) =>
      tag === "clear_subtle" || tag === "cold_slow" ||
      tag === "heat_finesse"
    );
}

function isSlowSubtleAllPurposeLane(args: {
  profile: ArchetypeProfileV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, scenario } = args;
  return scenario.recommendation_goal === "all_purpose" &&
    scenario.activity_level !== "active" &&
    (scenario.water_clarity === "clear" ||
      scenario.water_clarity === "stained") &&
    hasScenarioTag(scenario, ["clear_subtle", "cold_slow", "heat_finesse"]) &&
    isReliableSlowSubtleProfile(profile);
}

function isCrawBottomAllPurposeLane(args: {
  profile: ArchetypeProfileV4;
  row: SeasonalRowV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, row, scenario } = args;
  return scenario.recommendation_goal === "all_purpose" &&
    scenario.activity_level !== "active" &&
    (scenario.water_clarity === "clear" ||
      scenario.water_clarity === "stained") &&
    !scenario.scenario_tags.includes("dirty_vibration") &&
    profile.column === "bottom" &&
    hasSlowPace(profile) &&
    profile.goal_tags.includes("reliable_action") &&
    profile.forage_tags.includes("crawfish") &&
    (row.primary_forage === "crawfish" ||
      row.secondary_forage === "crawfish") &&
    hasScenarioTag(scenario, ["clear_subtle", "cold_slow", "current_swing"]);
}

function isHeatSlowBottomAllPurposeLane(args: {
  profile: ArchetypeProfileV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, scenario } = args;
  return scenario.recommendation_goal === "all_purpose" &&
    scenario.activity_level !== "active" &&
    (scenario.water_clarity === "clear" ||
      scenario.water_clarity === "stained") &&
    scenario.scenario_tags.includes("heat_finesse") &&
    profile.column === "bottom" &&
    hasSlowPace(profile) &&
    profile.goal_tags.includes("reliable_action");
}

function isTroutBigFishLureUpsideLane(args: {
  profile: ArchetypeProfileV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, scenario } = args;
  if (
    scenario.species !== "trout" ||
    scenario.recommendation_goal !== "big_fish" ||
    profile.gear_mode !== "lure" ||
    profile.is_surface
  ) {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  const heatLimited = scenario.thermal_mode === "heat_limited" ||
    tags.has("heat_finesse");

  switch (profile.id) {
    case "hair_jig":
      return tags.has("cold_slow") ||
        tags.has("clear_subtle") ||
        tags.has("current_swing") ||
        heatLimited;
    case "blade_bait":
      return tags.has("cold_slow") ||
        tags.has("current_swing") ||
        heatLimited;
    case "casting_spoon":
      return !heatLimited &&
        (tags.has("wind_reaction") ||
          tags.has("dirty_vibration") ||
          tags.has("open_water_search") ||
          tags.has("warming_search") ||
          tags.has("current_swing"));
    case "soft_jerkbait":
      return !heatLimited &&
        (tags.has("clear_subtle") ||
          tags.has("open_water_search") ||
          tags.has("warming_search"));
    case "suspending_jerkbait":
      return !heatLimited &&
        (tags.has("cold_slow") ||
          tags.has("clear_subtle") ||
          tags.has("wind_reaction"));
    default:
      return false;
  }
}

function isTroutDirtyCurrentMismatch(args: {
  profile: ArchetypeProfileV4;
  scenario: DailyScenario;
}): boolean {
  const { profile, scenario } = args;
  if (
    scenario.species !== "trout" ||
    scenario.water_clarity !== "dirty" ||
    scenario.water_movement_mode !== "elevated_or_dirty"
  ) {
    return false;
  }

  const tags = new Set(scenario.scenario_tags);
  const dirtyCurrentWindow = tags.has("dirty_vibration") ||
    tags.has("runoff_streamer") ||
    tags.has("current_swing");
  if (!dirtyCurrentWindow) return false;

  return profile.id === "suspending_jerkbait" &&
    !profile.clarity_strengths.includes("dirty") &&
    !profile.condition_tags.some((tag) =>
      tag === "dirty_vibration" ||
      tag === "runoff_streamer" ||
      tag === "current_swing"
    );
}

export function scoreCandidate(args: {
  profile: ArchetypeProfileV4;
  side: CandidateSide;
  row: SeasonalRowV4;
  scenario: DailyScenario;
}): CandidateScore {
  const { profile, side, row, scenario } = args;
  assertScenarioMatchesSeasonalRow({ row, scenario });

  const reasons: string[] = [`base:+${SCORE.base}`];
  let score = SCORE.base;
  const conditionGroupMatches = new Map<string, number>();

  for (const tag of scenario.scenario_tags) {
    if (profile.condition_tags.includes(tag)) {
      const group = CONDITION_TAG_GROUP_BY_TAG.get(tag) ?? tag;
      const previousMatches = conditionGroupMatches.get(group) ?? 0;
      conditionGroupMatches.set(group, previousMatches + 1);
      const value = previousMatches === 0
        ? SCORE.conditionTag
        : SCORE.secondaryConditionTagInGroup;
      score += addScore(reasons, `condition_tag:${tag}`, value);
    }
  }

  if (scenario.recommendation_goal === "all_purpose") {
    if (profile.goal_tags.includes("reliable_action")) {
      score += addScore(
        reasons,
        "goal:all_purpose:reliable_action",
        SCORE.allPurposeReliable,
      );
    }
    if (profile.goal_tags.includes("versatile_search")) {
      score += addScore(
        reasons,
        "goal:all_purpose:versatile_search",
        SCORE.allPurposeVersatile,
      );
    }
  } else {
    if (profile.goal_tags.includes("big_fish_upside")) {
      score += addScore(
        reasons,
        "goal:big_fish:big_fish_upside",
        SCORE.bigFishUpside,
      );
    }
    if (profile.goal_tags.includes("high_risk_high_reward")) {
      score += addScore(
        reasons,
        "goal:big_fish:high_risk_high_reward",
        SCORE.bigFishHighRisk,
      );
    }
    if (isTroutBigFishLureUpsideLane({ profile, scenario })) {
      score += addScore(
        reasons,
        "goal:big_fish:trout_trophy_lure",
        SCORE.troutBigFishLureUpside,
      );
    }
  }

  if (isSlowSubtleAllPurposeLane({ profile, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:slow_subtle_all_purpose",
      SCORE.subtleSlowLane,
    );
  }
  if (isCrawBottomAllPurposeLane({ profile, row, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:craw_bottom_all_purpose",
      SCORE.crawBottomLane,
    );
  }
  if (isHeatSlowBottomAllPurposeLane({ profile, scenario })) {
    score += addScore(
      reasons,
      "daily_lane:heat_slow_bottom_all_purpose",
      SCORE.heatSlowBottomLane,
    );
  }

  if (profile.clarity_strengths.includes(scenario.water_clarity)) {
    score += addScore(
      reasons,
      `clarity_strength:${scenario.water_clarity}`,
      SCORE.clarityStrength,
    );
  }

  if (hasForage(profile, row.primary_forage)) {
    score += addScore(
      reasons,
      `primary_forage:${row.primary_forage}`,
      SCORE.primaryForage,
    );
  }
  if (hasForage(profile, row.secondary_forage)) {
    score += addScore(
      reasons,
      `secondary_forage:${row.secondary_forage}`,
      SCORE.secondaryForage,
    );
  }

  if (profile.column === row.column_baseline) {
    score += addScore(
      reasons,
      `baseline_column:${row.column_baseline}`,
      SCORE.baselineColumn,
    );
  }

  const paceMatch = paceMatchesBaseline(profile, row.pace_baseline);
  if (paceMatch === "primary") {
    score += addScore(
      reasons,
      `baseline_primary_pace:${row.pace_baseline}`,
      SCORE.baselinePrimaryPace,
    );
  } else if (paceMatch === "secondary") {
    score += addScore(
      reasons,
      `baseline_secondary_pace:${row.pace_baseline}`,
      SCORE.baselineSecondaryPace,
    );
  }

  if (profile.is_surface && scenario.surface_daily_gate === "caution") {
    score += addScore(
      reasons,
      "surface_daily_gate:caution",
      SCORE.surfaceCautionPenalty,
    );
  }

  if (isTroutDirtyCurrentMismatch({ profile, scenario })) {
    score += addScore(
      reasons,
      "trout_dirty_current_mismatch",
      SCORE.troutDirtyCurrentMismatchPenalty,
    );
  }

  return {
    profile,
    side,
    score,
    reasons,
  };
}
