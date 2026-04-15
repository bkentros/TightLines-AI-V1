import { assert } from "jsr:@std/assert";
import { TROUT_V3_SEASONAL_ROWS } from "../v3/seasonal/trout.ts";

function troutRow(region_key: string, month: number) {
  const row = TROUT_V3_SEASONAL_ROWS.find(
    (r) =>
      r.species === "trout" &&
      r.region_key === region_key &&
      r.month === month &&
      r.context === "freshwater_river",
  );
  assert(row != null, `missing trout row ${region_key} m${month}`);
  return row;
}

Deno.test("Trout Phase 4: Northern California October keeps explicit mouse / surface window", () => {
  const row = troutRow("northern_california", 10);
  assert(row.monthly_baseline.surface_seasonally_possible === true);
  assert(row.eligible_fly_ids.includes("mouse_fly"));
});

Deno.test("Trout Phase 4: default western inland fall months stay subsurface-only", () => {
  for (const rk of ["pacific_northwest", "inland_northwest", "mountain_west"] as const) {
    for (const month of [9, 10, 11] as const) {
      const row = troutRow(rk, month);
      assert(row.monthly_baseline.surface_seasonally_possible === false);
      assert(!row.eligible_fly_ids.includes("mouse_fly"));
    }
  }
});
