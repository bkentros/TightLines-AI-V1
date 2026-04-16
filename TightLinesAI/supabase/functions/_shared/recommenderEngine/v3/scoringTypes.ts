import type {
  RecommenderV3ArchetypeProfile,
  RecommenderV3ScoreBreakdown,
  ResolvedColorThemeV3,
} from "./contracts.ts";

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
  opportunity_mix_fit: number;
  color_theme: ResolvedColorThemeV3;
  color_recommendations: [string, string, string];
  breakdown: RecommenderV3ScoreBreakdown[];
  why_chosen: string;
  how_to_fish_by_role: [string, string, string];
};
