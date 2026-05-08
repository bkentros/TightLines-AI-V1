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
  allPurposeReliable: 18,
  allPurposeVersatile: 12,
  bigFishUpside: 20,
  bigFishHighRisk: 12,
  clarityStrength: 8,
  primaryForage: 12,
  secondaryForage: 6,
  baselineColumn: 10,
  baselinePrimaryPace: 10,
  baselineSecondaryPace: 6,
  surfaceCautionPenalty: -8,
} as const;

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

  for (const tag of scenario.scenario_tags) {
    if (profile.condition_tags.includes(tag)) {
      score += addScore(reasons, `condition_tag:${tag}`, SCORE.conditionTag);
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

  return {
    profile,
    side,
    score,
    reasons,
  };
}
