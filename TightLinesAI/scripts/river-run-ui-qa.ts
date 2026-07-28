import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import {
  formatRiverRunSpecies,
  resolveRiverRunTarget,
  riverRunRiverChoices,
  riverRunSeasonChoices,
  riverRunSpeciesChoices,
  riverRunStateChoices,
} from "../lib/riverRunCatalogSelection";
import type { RiverRunCatalogResponse } from "../lib/riverRunContracts";

const catalog: RiverRunCatalogResponse = {
  states: [
    {
      state: "MI",
      displayName: "Michigan",
      rivers: [
        {
          riverId: "pere_marquette",
          displayName: "Pere Marquette River",
          state: "MI",
          runs: [
            {
              runId: "pm_fall_chinook",
              displayName: "Fall Chinook",
              species: "chinook_salmon",
              season: "fall",
            },
            {
              runId: "pm_spring_steelhead",
              displayName: "Spring Steelhead",
              species: "steelhead",
              season: "spring",
            },
          ],
        },
        {
          riverId: "betsie",
          displayName: "Betsie River",
          state: "MI",
          runs: [
            {
              runId: "betsie_fall_chinook",
              displayName: "Fall Chinook",
              species: "chinook_salmon",
              season: "fall",
            },
          ],
        },
      ],
    },
    {
      state: "WI",
      displayName: "Wisconsin",
      rivers: [
        {
          riverId: "root",
          displayName: "Root River",
          state: "WI",
          runs: [
            {
              runId: "root_fall_coho",
              displayName: "Fall Coho",
              species: "coho_salmon",
              season: "fall",
            },
          ],
        },
      ],
    },
  ],
};

assert.deepEqual(
  riverRunStateChoices(catalog).map((choice) => choice.id),
  ["MI", "WI"],
);
assert.deepEqual(
  riverRunSeasonChoices(catalog, "MI").map((choice) => choice.id),
  ["fall", "spring"],
);
assert.deepEqual(
  riverRunSpeciesChoices(catalog, "MI", "fall").map((choice) => choice.id),
  ["chinook_salmon"],
);
assert.deepEqual(
  riverRunRiverChoices(catalog, "MI", "fall", "chinook_salmon").map(
    (choice) => choice.id,
  ),
  ["pere_marquette", "betsie"],
);
assert.deepEqual(
  riverRunRiverChoices(catalog, "WI", "fall", "coho_salmon").map(
    (choice) => choice.id,
  ),
  ["root"],
);
assert.equal(formatRiverRunSpecies("chinook_salmon"), "Chinook Salmon");

const target = resolveRiverRunTarget(catalog, {
  stateCode: "MI",
  season: "fall",
  species: "chinook_salmon",
  riverId: "betsie",
});
assert.equal(target?.run.runId, "betsie_fall_chinook");
assert.equal(
  resolveRiverRunTarget(catalog, {
    stateCode: "MI",
    season: "spring",
    species: "chinook_salmon",
    riverId: "pere_marquette",
  }),
  null,
);

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const chinookPath = `${projectRoot}assets/images/fish/chinook_salmon.png`;
assert(existsSync(chinookPath), "Missing River Run Chinook image");
const png = readFileSync(chinookPath);
assert.equal(png.subarray(1, 4).toString("ascii"), "PNG");
assert.equal(
  png[25],
  6,
  "Chinook image must be an RGBA PNG with transparency",
);

console.log(
  "River Run UI QA passed: catalog order, downstream filtering, target resolution, and Chinook alpha asset.",
);
