/**
 * This test iterates the production-reachable surface, not the full Cartesian product
 * over canonical regions. The upstream gate in `supabase/functions/recommender/index.ts`
 * rejects any (state, species, context) combo not present in `STATE_SPECIES_MAP`, so
 * biologically impossible tuples like northern_pike in Florida are not part of the
 * engine's contract.
 */
import { assert } from "jsr:@std/assert";
import type { SpeciesGroup } from "../../contracts/species.ts";
import { STATE_SPECIES_MAP } from "../../config/stateSpeciesGating.ts";
import { STATE_TO_REGION } from "../../../howFishingEngine/config/stateToRegion.ts";
import type { RecommenderV3Context, RecommenderV3Species } from "../contracts.ts";
import {
  isContextAllowedForRecommenderV3,
  toRecommenderV3Species,
} from "../scope.ts";
import { resolveSeasonalRowV3 } from "./resolveSeasonalRow.ts";

function tupleLabel(
  stateCode: string,
  v3Species: RecommenderV3Species,
  regionKey: string,
  month: number,
  context: RecommenderV3Context,
): string {
  return `(stateCode=${stateCode}, v3Species=${v3Species}, regionKey=${regionKey}, month=${month}, context=${context})`;
}

Deno.test(
  "resolveSeasonalRowV3: production-reachable STATE_SPECIES_MAP surface has sufficient seasonal coverage",
  () => {
    const missingRegion = Object.keys(STATE_SPECIES_MAP).filter(
      (sc) => STATE_TO_REGION[sc] === undefined,
    );
    if (missingRegion.length > 0) {
      console.warn(
        `[resolveSeasonalRow.cartesian] Skipping states with no bulk STATE_TO_REGION entry: ${missingRegion.join(", ")}`,
      );
    }

    for (const stateCode of Object.keys(STATE_SPECIES_MAP).sort()) {
      const speciesMap = STATE_SPECIES_MAP[stateCode];
      if (!speciesMap) continue;

      const regionKey = STATE_TO_REGION[stateCode];
      if (regionKey === undefined) continue;

      for (const [legacySpecies, entry] of Object.entries(speciesMap)) {
        const v3Species = toRecommenderV3Species(legacySpecies as SpeciesGroup);
        if (v3Species === null) continue;

        for (const context of entry.contexts) {
          if (!isContextAllowedForRecommenderV3(v3Species, context)) continue;

          for (let month = 1; month <= 12; month++) {
            let row;
            try {
              row = resolveSeasonalRowV3(v3Species, regionKey, month, context);
            } catch (err) {
              throw new Error(
                `resolveSeasonalRowV3 threw ${tupleLabel(stateCode, v3Species, regionKey, month, context)}: ${err}`,
              );
            }
            assert(
              row.eligible_lure_ids.length >= 3,
              `eligible_lure_ids.length >= 3 failed ${tupleLabel(stateCode, v3Species, regionKey, month, context)} (got ${row.eligible_lure_ids.length})`,
            );
            assert(
              row.eligible_fly_ids.length >= 3,
              `eligible_fly_ids.length >= 3 failed ${tupleLabel(stateCode, v3Species, regionKey, month, context)} (got ${row.eligible_fly_ids.length})`,
            );
            assert(
              (row.primary_lure_ids?.length ?? 0) >= 1,
              `primary_lure_ids.length >= 1 failed ${tupleLabel(stateCode, v3Species, regionKey, month, context)}`,
            );
            assert(
              (row.primary_fly_ids?.length ?? 0) >= 1,
              `primary_fly_ids.length >= 1 failed ${tupleLabel(stateCode, v3Species, regionKey, month, context)}`,
            );
          }
        }
      }
    }
  },
);
