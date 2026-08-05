import type { HistoricalPresenceConfig } from "../types.ts";

export type RunOpportunityStrength = "limited" | "moderate" | "strong";
export type RunDistributionScope =
  HistoricalPresenceConfig["distributionScope"];

export type RunOpportunityCopyContext = {
  strength: RunOpportunityStrength;
  distributionScope: RunDistributionScope;
};

/**
 * The researched 1-10 river/species ceiling is the single source of truth for
 * absolute opportunity wording. Presence labels remain relative to that run's
 * own ceiling; this tier prevents a lower-ceiling peak from borrowing the
 * language of a signature run.
 */
export function resolveRunOpportunityStrength(
  maximum: HistoricalPresenceConfig["maximum"] | number,
): RunOpportunityStrength {
  if (maximum <= 3) return "limited";
  if (maximum <= 7) return "moderate";
  return "strong";
}

export function resolveRunOpportunityCopyContext(
  historicalPresence: Pick<
    HistoricalPresenceConfig,
    "maximum" | "distributionScope"
  >,
): RunOpportunityCopyContext {
  return {
    strength: resolveRunOpportunityStrength(historicalPresence.maximum),
    distributionScope: historicalPresence.distributionScope,
  };
}
