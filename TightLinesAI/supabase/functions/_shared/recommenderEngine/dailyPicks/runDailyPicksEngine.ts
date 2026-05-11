import type { SharedConditionAnalysis } from "../../howFishingEngine/analyzeSharedConditions.ts";
import type { RecommenderRequest } from "../contracts/input.ts";
import type { SeasonalRowV4 } from "../v4/contracts.ts";
import {
  buildCandidatePool,
  type DailyPickCandidatePool,
} from "./buildCandidatePool.ts";
import {
  buildDailyScenario,
  type DailyScenario,
} from "./buildDailyScenario.ts";
import { type CandidateScore, scoreCandidate } from "./scoreCandidate.ts";
import {
  buildDailyPicksFamilyDiversityDiagnostics,
  buildDailyPicksFinalistPoolDiagnostics,
  type DailyPicksFamilyDiversityDiagnostics,
  type DailyPicksFinalistPoolDiagnostics,
  type DailyPicksSelection,
  type DailyPicksVariant,
  selectDailyPicks,
} from "./selectDailyPicks.ts";

export type DailyPicksEngineDiagnostics = {
  row_authored_lure_count: number;
  row_authored_fly_count: number;
  hard_gated_lure_candidate_count: number;
  hard_gated_fly_candidate_count: number;
  selected_lure_ids: readonly string[];
  selected_fly_ids: readonly string[];
  variant: DailyPicksVariant;
  avoid_lure_ids_applied: readonly string[];
  avoid_fly_ids_applied: readonly string[];
  scenario_tags: DailyScenario["scenario_tags"];
  surface_daily_gate: DailyScenario["surface_daily_gate"];
  missing_inputs: DailyScenario["missing_inputs"];
  confidence: DailyScenario["confidence"];
  family_diversity: DailyPicksFamilyDiversityDiagnostics;
  finalist_pools: DailyPicksFinalistPoolDiagnostics;
};

export type DailyPicksEngineResult = {
  row: SeasonalRowV4;
  scenario: DailyScenario;
  candidate_pool: DailyPickCandidatePool;
  lure_scores: CandidateScore[];
  fly_scores: CandidateScore[];
  selection: DailyPicksSelection;
  diagnostics: DailyPicksEngineDiagnostics;
};

export function runDailyPicksEngine(args: {
  req: RecommenderRequest;
  analysis: SharedConditionAnalysis;
  seasonalRow: SeasonalRowV4;
  seed: string;
  variant: DailyPicksVariant;
  avoidLureIds?: readonly string[];
  avoidFlyIds?: readonly string[];
}): DailyPicksEngineResult {
  const scenario = buildDailyScenario({
    req: args.req,
    analysis: args.analysis,
    seasonalRow: args.seasonalRow,
  });
  const candidatePool = buildCandidatePool({
    row: args.seasonalRow,
    scenario,
  });
  const lureScores = candidatePool.lures.map((candidate) =>
    scoreCandidate({
      profile: candidate.profile,
      side: "lure",
      row: args.seasonalRow,
      scenario,
    })
  );
  const flyScores = candidatePool.flies.map((candidate) =>
    scoreCandidate({
      profile: candidate.profile,
      side: "fly",
      row: args.seasonalRow,
      scenario,
    })
  );
  const selection = selectDailyPicks({
    lureScores,
    flyScores,
    scenario,
    seed: args.seed,
    variant: args.variant,
    avoidLureIds: args.avoidLureIds,
    avoidFlyIds: args.avoidFlyIds,
  });

  return {
    row: args.seasonalRow,
    scenario,
    candidate_pool: candidatePool,
    lure_scores: lureScores,
    fly_scores: flyScores,
    selection,
    diagnostics: {
      row_authored_lure_count: args.seasonalRow.primary_lure_ids.length,
      row_authored_fly_count: args.seasonalRow.primary_fly_ids.length,
      hard_gated_lure_candidate_count: candidatePool.lures.length,
      hard_gated_fly_candidate_count: candidatePool.flies.length,
      selected_lure_ids: [
        selection.lure_of_the_day.profile.id,
        selection.honorable_lure.profile.id,
      ],
      selected_fly_ids: [
        selection.fly_of_the_day.profile.id,
        selection.honorable_fly.profile.id,
      ],
      variant: args.variant,
      avoid_lure_ids_applied: args.avoidLureIds ?? [],
      avoid_fly_ids_applied: args.avoidFlyIds ?? [],
      scenario_tags: scenario.scenario_tags,
      surface_daily_gate: scenario.surface_daily_gate,
      missing_inputs: scenario.missing_inputs,
      confidence: scenario.confidence,
      family_diversity: buildDailyPicksFamilyDiversityDiagnostics({
        selection,
        lureScores,
        flyScores,
      }),
      finalist_pools: buildDailyPicksFinalistPoolDiagnostics({
        selection,
        lureScores,
        flyScores,
        scenario,
        variant: args.variant,
        avoidLureIds: args.avoidLureIds,
        avoidFlyIds: args.avoidFlyIds,
      }),
    },
  };
}
