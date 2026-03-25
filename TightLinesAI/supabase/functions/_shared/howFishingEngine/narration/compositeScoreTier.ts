/**
 * Human-readable tier for the rounded 0–100 composite score.
 * Describes the model output only — no inferred on-water fish behavior.
 */
export function compositeScoreActivityTier(score: number): string {
  if (score >= 70) return "high — composite score 70–100";
  if (score >= 55) return "moderate-high — composite score 55–69";
  if (score >= 40) return "moderate — composite score 40–54";
  if (score >= 25) return "low — composite score 25–39";
  return "very low — composite score 10–24";
}
