/** Run: `cd TightLinesAI && deno run -A scripts/example-a-strict-pools.ts` */
import { buildEligiblePoolV4 } from "../supabase/functions/_shared/recommenderEngine/v4/engine/buildEligiblePool.ts";
import type { SeasonalRowV4 } from "../supabase/functions/_shared/recommenderEngine/v4/contracts.ts";
import { FLY_ARCHETYPE_IDS_V4, LURE_ARCHETYPE_IDS_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/contracts.ts";

const allLures = [...LURE_ARCHETYPE_IDS_V4];
const allFlies = [...FLY_ARCHETYPE_IDS_V4];

const row: SeasonalRowV4 = {
  species: "largemouth_bass",
  region_key: "great_lakes_upper_midwest",
  month: 6,
  water_type: "freshwater_lake_pond",
  column_range: ["bottom", "mid", "upper", "surface"],
  column_baseline: "upper",
  pace_range: ["slow", "medium", "fast"],
  pace_baseline: "fast",
  primary_forage: "bluegill_perch",
  secondary_forage: "baitfish",
  surface_seasonally_possible: true,
  primary_lure_ids: allLures,
  primary_fly_ids: allFlies,
};

const colSet = ["upper", "surface"] as const;
const paceSet = ["fast", "medium"] as const;

const flyPool = buildEligiblePoolV4(
  "fly",
  row,
  [...colSet],
  [...paceSet],
  "stained",
  "largemouth_bass",
  "freshwater_lake_pond",
);
const lurePool = buildEligiblePoolV4(
  "lure",
  row,
  [...colSet],
  [...paceSet],
  "stained",
  "largemouth_bass",
  "freshwater_lake_pond",
);

console.log("§14.1-style strict slice: columns", colSet, "paces", paceSet, "clarity stained");
console.log(
  "fly_pool",
  flyPool.length,
  flyPool.map((a) => ({ id: a.id, family: a.family_group, col: a.column, pp: a.primary_pace, sp: a.secondary_pace })),
);
console.log("fly_family_groups", [...new Set(flyPool.map((a) => a.family_group))]);
console.log("lure_pool_count", lurePool.length);
console.log("lure_family_count", new Set(lurePool.map((a) => a.family_group)).size);
