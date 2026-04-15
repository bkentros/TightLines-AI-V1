import { assert } from "jsr:@std/assert";
import { LARGEMOUTH_V3_SEASONAL_ROWS } from "../v3/seasonal/largemouth.ts";

function lmbRow(
  region_key: string,
  month: number,
  context: "freshwater_lake_pond" | "freshwater_river",
) {
  const row = LARGEMOUTH_V3_SEASONAL_ROWS.find(
    (r) =>
      r.species === "largemouth_bass" &&
      r.region_key === region_key &&
      r.month === month &&
      r.context === context,
  );
  assert(row != null, `missing largemouth row ${region_key} m${month} ${context}`);
  return row;
}

Deno.test("Largemouth Phase 4: northeast clear winter lake pool stays contact-first", () => {
  const row = lmbRow("northeast", 1, "freshwater_lake_pond");
  assert(row.monthly_baseline.surface_seasonally_possible === false);
  assert(row.eligible_lure_ids.includes("blade_bait"));
  assert(!row.eligible_lure_ids.includes("walking_topwater"));
});

Deno.test("Largemouth Phase 4: upper Midwest July lake uses weed-bounded pool (not full SUMMER_LAKE hedge)", () => {
  const row = lmbRow("great_lakes_upper_midwest", 7, "freshwater_lake_pond");
  assert(row.monthly_baseline.surface_seasonally_possible === true);
  assert(!row.eligible_lure_ids.includes("walking_topwater"));
  assert(row.eligible_lure_ids.includes("swim_jig"));
  assert(row.eligible_fly_ids.includes("frog_fly"));
});

Deno.test("Largemouth Phase 4: clear northern midsummer fly pool includes finesse streamer lanes", () => {
  const row = lmbRow("northeast", 6, "freshwater_lake_pond");
  assert(row.monthly_baseline.surface_seasonally_possible === false);
  assert(row.eligible_fly_ids.includes("balanced_leech"));
  assert(row.eligible_fly_ids.includes("articulated_baitfish_streamer"));
});
