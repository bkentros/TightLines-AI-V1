import { assert } from "jsr:@std/assert";
import { SMALLMOUTH_V3_SEASONAL_ROWS } from "../v3/seasonal/smallmouth.ts";

function smbRow(
  region_key: string,
  month: number,
  context: "freshwater_lake_pond" | "freshwater_river",
) {
  const row = SMALLMOUTH_V3_SEASONAL_ROWS.find(
    (r) =>
      r.species === "smallmouth_bass" &&
      r.region_key === region_key &&
      r.month === month &&
      r.context === context,
  );
  assert(row != null, `missing smallmouth row ${region_key} m${month} ${context}`);
  return row;
}

Deno.test("Smallmouth Phase 4: midwest interior Jul–Aug river uses dirty subsurface lane", () => {
  for (const month of [7, 8] as const) {
    const row = smbRow("midwest_interior", month, "freshwater_river");
    assert(row.monthly_baseline.surface_seasonally_possible === false);
    assert(!row.eligible_lure_ids.includes("walking_topwater"));
    assert(!row.eligible_fly_ids.includes("popper_fly"));
    assert(row.eligible_fly_ids.includes("crawfish_streamer"));
  }
});

Deno.test("Smallmouth Phase 4: default northern river midsummer stays current-first (no surface kit)", () => {
  const row = smbRow("northeast", 7, "freshwater_river");
  assert(row.monthly_baseline.surface_seasonally_possible === false);
  assert(row.eligible_fly_ids.includes("crawfish_streamer"));
  assert(!row.eligible_fly_ids.includes("popper_fly"));
});
