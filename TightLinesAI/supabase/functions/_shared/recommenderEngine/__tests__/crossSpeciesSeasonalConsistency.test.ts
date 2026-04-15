import { assert } from "jsr:@std/assert";
import type { RecommenderV3SeasonalRow } from "../v3/contracts.ts";
import { FLY_ARCHETYPES_V3 } from "../v3/candidates/flies.ts";
import { LURE_ARCHETYPES_V3 } from "../v3/candidates/lures.ts";
import { LARGEMOUTH_V3_SEASONAL_ROWS } from "../v3/seasonal/largemouth.ts";
import { NORTHERN_PIKE_V3_SEASONAL_ROWS } from "../v3/seasonal/pike.ts";
import { SMALLMOUTH_V3_SEASONAL_ROWS } from "../v3/seasonal/smallmouth.ts";
import { TROUT_V3_SEASONAL_ROWS } from "../v3/seasonal/trout.ts";

function surfaceFlagMatchesEligiblePools(row: RecommenderV3SeasonalRow): void {
  const hasSurfaceLure = row.eligible_lure_ids.some(
    (id) => LURE_ARCHETYPES_V3[id].is_surface,
  );
  const hasSurfaceFly = row.eligible_fly_ids.some(
    (id) => FLY_ARCHETYPES_V3[id].is_surface,
  );
  const hasSurface = hasSurfaceLure || hasSurfaceFly;
  assert(
    row.monthly_baseline.surface_seasonally_possible === hasSurface,
    `${row.species} ${row.region_key} m${row.month} ${row.context}: surface_seasonally_possible (${row.monthly_baseline.surface_seasonally_possible}) must match presence of surface-tagged lures/flies in eligible pools (${hasSurface})`,
  );
}

Deno.test(
  "Cross-species: surface_seasonally_possible matches eligible lure/fly pool surface content (trout, pike, smallmouth, largemouth)",
  () => {
    for (const row of TROUT_V3_SEASONAL_ROWS) surfaceFlagMatchesEligiblePools(row);
    for (const row of NORTHERN_PIKE_V3_SEASONAL_ROWS) surfaceFlagMatchesEligiblePools(row);
    for (const row of SMALLMOUTH_V3_SEASONAL_ROWS) surfaceFlagMatchesEligiblePools(row);
    for (const row of LARGEMOUTH_V3_SEASONAL_ROWS) surfaceFlagMatchesEligiblePools(row);
  },
);

Deno.test("Cross-species: trout seasonal rows remain river-only (blueprint scope)", () => {
  for (const row of TROUT_V3_SEASONAL_ROWS) {
    assert(row.context === "freshwater_river");
  }
});
