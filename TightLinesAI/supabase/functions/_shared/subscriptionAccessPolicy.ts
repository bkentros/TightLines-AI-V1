export type ServerSubscriptionTier = "free" | "angler" | "master_angler";

/**
 * Free users receive today's forecast score plus tomorrow's score-only preview.
 * Angler tiers receive the complete day 0...6 score strip. Report generation is
 * separately enforced by how-fishing, so this protects the score payload itself.
 */
export function maxForecastDayOffsetForTier(
  tier: ServerSubscriptionTier,
): number {
  return tier === "free" ? 1 : 6;
}
