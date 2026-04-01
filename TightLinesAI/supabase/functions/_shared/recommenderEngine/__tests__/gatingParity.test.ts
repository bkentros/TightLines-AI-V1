import { assertEquals } from "jsr:@std/assert";
import { STATE_SPECIES_MAP } from "../config/stateSpeciesGating.ts";
import { STATE_SPECIES_CONTEXTS } from "../../../../../lib/generated/recommenderStateSpecies.ts";

Deno.test("generated frontend state-species gating matches backend source", () => {
  const backendProjection = Object.fromEntries(
    Object.entries(STATE_SPECIES_MAP).map(([state, speciesMap]) => [
      state,
      Object.fromEntries(
        Object.entries(speciesMap).map(([species, entry]) => [species, entry.contexts]),
      ),
    ]),
  );

  assertEquals(
    JSON.parse(JSON.stringify(STATE_SPECIES_CONTEXTS)),
    backendProjection,
  );
});
