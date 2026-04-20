import type {
  RecommenderV3ArchetypeProfile,
  RecommenderV3ScoreBreakdown,
  ResolvedColorThemeV3,
} from "./contracts.ts";
import type { ResolvedColorDecisionV3 } from "../v4/colorDecision.ts";

export type ScoredCandidate = {
  profile: RecommenderV3ArchetypeProfile;
  /** Rounded for display / API parity with audits. */
  score: number;
  /** Full-precision total for ordering; reduces artificial rank-1/2 ties from rounding. */
  sort_score: number;
  tactical_fit: number;
  practicality_fit: number;
  forage_fit: number;
  clarity_fit: number;
  /** Post-selection diversity bonus applied in topThreeSelection. Zero for candidates that were not considered as a changeup slot. Not a per-archetype fit score. */
  diversity_bonus: number;
  color_theme: ResolvedColorThemeV3;
  color_recommendations: [string, string, string];
  /** Same object as used for `color_theme` / pools; carried for RankedArchetype `color_decision` (Section 5B). */
  resolved_color_decision: ResolvedColorDecisionV3;
  breakdown: RecommenderV3ScoreBreakdown[];
  /** Provisional copy; `selectTopThreeCandidates` rewrites from `diversity_bonus` + role note. */
  why_chosen: string;
  how_to_fish_by_role: [string, string, string];
};
