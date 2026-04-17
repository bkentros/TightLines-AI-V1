import { assert } from "jsr:@std/assert";
import type { SpeciesGroup } from "../contracts/species.ts";
import {
  isRecommenderV3Context,
  RECOMMENDER_V3_SPECIES_CONTEXTS,
  toRecommenderV3Species,
} from "../v3/scope.ts";
import { STATE_SPECIES_MAP } from "./stateSpeciesGating.ts";

Deno.test("STATE_SPECIES_MAP: every state-advertised freshwater V3 context is allowed by RECOMMENDER_V3_SPECIES_CONTEXTS", () => {
  for (const [state_code, map] of Object.entries(STATE_SPECIES_MAP)) {
    for (const [legacySpecies, entry] of Object.entries(map)) {
      const v3Species = toRecommenderV3Species(legacySpecies as SpeciesGroup);
      if (v3Species === null) continue;

      for (const context of entry.contexts) {
        if (!isRecommenderV3Context(context)) continue;

        const allowed = RECOMMENDER_V3_SPECIES_CONTEXTS[v3Species];
        assert(
          allowed.includes(context),
          `STATE_SPECIES_MAP advertises (state_code=${state_code}, legacy_species=${legacySpecies}, context=${context}) mapped to v3_species=${v3Species}, but RECOMMENDER_V3_SPECIES_CONTEXTS[${v3Species}] does not include that context (allowed=${allowed.join(",")})`,
        );
      }
    }
  }
});
