/**
 * Human-readable tier for the rounded 0–100 composite score.
 * Provides behavioral guidance so the LLM doesn't have to infer
 * fish activity from raw score numbers alone.
 */
export function compositeScoreActivityTier(score: number): string {
  if (score >= 70) return "high — fish are feeding actively and willing to commit";
  if (score >= 55) return "moderate-high — fish are engaged and responding well to proper presentation";
  if (score >= 40) return "moderate — fish are selectively willing, need a clean presentation";
  if (score >= 25) return "low — fish are tentative, require deliberate and precise approach";
  return "very low — fish are not cooperative, tough conditions across the board";
}
