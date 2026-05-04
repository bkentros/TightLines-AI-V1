import { lookupWaterReaderSeason } from "../waterReaderEngine/seasons.ts";
import type { WaterReaderSeason } from "../waterReaderEngine/contracts.ts";
import type { WaterReaderSeasonContext } from "./contracts.ts";

export function buildWaterReaderSeasonContext(state: string, currentDate: Date): WaterReaderSeasonContext {
  const lookup = lookupWaterReaderSeason(state, currentDate);
  if (!lookup) {
    return {
      season: "summer",
      seasonGroup: "unknown",
      inTransitionWindow: false,
      transitionFrom: null,
      transitionTo: null,
      seasonContextKey: "group:unknown|season:summer|transition:none",
    };
  }

  const transitionFrom = lookup.inTransitionWindow ? lookup.transitionFrom ?? null : null;
  const transitionTo = lookup.inTransitionWindow ? lookup.transitionTo ?? null : null;
  const transitionKey = transitionFrom && transitionTo
    ? `transition:${transitionFrom}->${transitionTo}`
    : "transition:none";

  return {
    season: lookup.season,
    seasonGroup: lookup.seasonGroup,
    inTransitionWindow: lookup.inTransitionWindow,
    transitionFrom: transitionFrom as WaterReaderSeason | null,
    transitionTo: transitionTo as WaterReaderSeason | null,
    seasonContextKey: `group:${lookup.seasonGroup}|season:${lookup.season}|${transitionKey}`,
  };
}
