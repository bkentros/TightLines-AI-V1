import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { STATE_SPECIES_MAP } from "../supabase/functions/_shared/recommenderEngine/config/stateSpeciesGating.ts";

const outPath = resolve(process.cwd(), "lib/generated/recommenderStateSpecies.ts");

const contextOnlyMap = Object.fromEntries(
  Object.entries(STATE_SPECIES_MAP).map(([state, speciesMap]) => [
    state,
    Object.fromEntries(
      Object.entries(speciesMap).map(([species, entry]) => [species, entry.contexts]),
    ),
  ]),
);

const header = `/**
 * GENERATED FILE.
 * Source: supabase/functions/_shared/recommenderEngine/config/stateSpeciesGating.ts
 * Run: npx tsx scripts/generate-recommender-gating.ts
 */

`;

writeFileSync(
  outPath,
  `${header}export const STATE_SPECIES_CONTEXTS = ${JSON.stringify(contextOnlyMap, null, 2)} as const;\n`,
);
