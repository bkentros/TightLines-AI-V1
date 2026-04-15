import { assert } from "jsr:@std/assert";
import { NORTHERN_PIKE_V3_SEASONAL_ROWS } from "../v3/seasonal/pike.ts";

function pikeRow(
  region_key: string,
  month: number,
  context: "freshwater_lake_pond" | "freshwater_river",
) {
  const row = NORTHERN_PIKE_V3_SEASONAL_ROWS.find(
    (r) =>
      r.species === "northern_pike" &&
      r.region_key === region_key &&
      r.month === month &&
      r.context === context,
  );
  assert(row != null, `missing pike row ${region_key} m${month} ${context}`);
  return row;
}

Deno.test("Pike Phase 4: interior Jul–Aug heat = bottom bias, no surface hedge kit", () => {
  for (const rk of ["midwest_interior", "south_central", "appalachian"] as const) {
    for (const month of [7, 8] as const) {
      for (const ctx of ["freshwater_lake_pond", "freshwater_river"] as const) {
        const row = pikeRow(rk, month, ctx);
        assert(row.monthly_baseline.surface_seasonally_possible === false);
        assert(
          row.monthly_baseline.typical_seasonal_water_column === "low" ||
            row.monthly_baseline.typical_seasonal_water_column === "mid_low",
          `${rk} m${month} ${ctx}: expected deep column stack for bottom-authored summer interior`,
        );
      }
    }
  }
});
