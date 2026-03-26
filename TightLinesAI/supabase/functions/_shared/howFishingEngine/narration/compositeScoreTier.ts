/**
 * Human-readable tier for the rounded 0–100 composite score.
 * Provides behavioral guidance so the LLM doesn't have to infer
 * fish activity from raw score numbers alone.
 */
export function compositeScoreActivityTier(score: number): string {
  if (score >= 70) return "high — conditions strongly favor active feeding and willing strikes";
  if (score >= 55) return "moderate-high — conditions favor engaged fish responding to proper presentation";
  if (score >= 40) return "moderate — conditions support selective feeding; clean presentation matters";
  if (score >= 25) return "low — conditions are working against the bite; deliberate, precise approach needed";
  return "very low — conditions are tough across the board; narrow windows, hard-earned fish";
}
