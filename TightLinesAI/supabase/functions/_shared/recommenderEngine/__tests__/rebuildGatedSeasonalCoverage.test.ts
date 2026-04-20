/**
 * Ensures every **state-gated** freshwater recommender tuple the UI can submit has a
 * seasonal row for all 12 months (bulk `STATE_TO_REGION` region).
 *
 * This does not cover geographic overrides (e.g. mountain_alpine vs mountain_west from
 * elevation); those regions must still appear in `data/seasonal-matrix` / generated TS.
 */
import { assertEquals } from "jsr:@std/assert";
import { STATE_TO_REGION } from "../../howFishingEngine/config/stateToRegion.ts";
import type { EngineContext } from "../../howFishingEngine/contracts/context.ts";
import { STATE_SPECIES_MAP } from "../config/stateSpeciesGating.ts";
import type { SpeciesGroup } from "../contracts/species.ts";
import { hasSeasonalRowRebuild } from "../rebuild/seasonalResolve.ts";
import {
  isContextAllowedForRecommenderV3,
  toRecommenderV3Species,
} from "../v3/scope.ts";

const FW_CONTEXTS: EngineContext[] = [
  "freshwater_lake_pond",
  "freshwater_river",
];

const RECOMMENDER_UI_SPECIES: SpeciesGroup[] = [
  "largemouth_bass",
  "smallmouth_bass",
  "pike_musky",
  "river_trout",
];

Deno.test({
  name:
    "rebuild: gated state × species × freshwater context has full 12-month seasonal rows (bulk region)",
  fn() {
    const gaps: string[] = [];

    for (const [state, speciesMap] of Object.entries(STATE_SPECIES_MAP)) {
      const region_key = STATE_TO_REGION[state];
      if (region_key === undefined) continue;

      for (const species of RECOMMENDER_UI_SPECIES) {
        const entry = speciesMap[species];
        if (!entry) continue;

        const v3 = toRecommenderV3Species(species);
        if (v3 === null) continue;

        for (const context of entry.contexts) {
          if (!FW_CONTEXTS.includes(context)) continue;
          if (!isContextAllowedForRecommenderV3(v3, context)) continue;

          for (let month = 1; month <= 12; month++) {
            if (!hasSeasonalRowRebuild(v3, region_key, month, context)) {
              gaps.push(
                `${state} species=${species} ctx=${context} month=${month} region=${region_key}`,
              );
            }
          }
        }
      }
    }

    assertEquals(
      gaps,
      [],
      gaps.length > 0
        ? `Missing seasonal rows for gated UI (${gaps.length} gaps). First: ${gaps[0]}`
        : "",
    );
  },
});
