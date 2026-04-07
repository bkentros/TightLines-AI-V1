import { assert, assertEquals } from "jsr:@std/assert";
import { FLY_ARCHETYPES_V3, LURE_ARCHETYPES_V3 } from "../v3/index.ts";
import { FLY_ARCHETYPE_IDS_V3, LURE_ARCHETYPE_IDS_V3 } from "../v3/index.ts";
import { RESOLVED_COLOR_SHADE_POOLS_V3 } from "../v3/index.ts";
import {
  LARGEMOUTH_V3_SEASONAL_ROWS,
  LARGEMOUTH_V3_SUPPORTED_REGIONS,
} from "../v3/index.ts";

Deno.test("V3 phase 2 lure and fly archetype libraries cover every declared archetype id", () => {
  assertEquals(Object.keys(LURE_ARCHETYPES_V3).sort(), [...LURE_ARCHETYPE_IDS_V3].sort());
  assertEquals(Object.keys(FLY_ARCHETYPES_V3).sort(), [...FLY_ARCHETYPE_IDS_V3].sort());
});

Deno.test("V3 phase 2 resolved color lanes keep at least three realistic shade examples", () => {
  for (const [theme, shades] of Object.entries(RESOLVED_COLOR_SHADE_POOLS_V3)) {
    assert(shades.length >= 3, `${theme} should provide at least 3 shade examples`);
  }
});

Deno.test("V3 phase 2 largemouth seasonal rows cover every supported region, context, and month", () => {
  for (const region of LARGEMOUTH_V3_SUPPORTED_REGIONS) {
    for (const context of ["freshwater_lake_pond", "freshwater_river"] as const) {
      const monthSet = new Set(
        LARGEMOUTH_V3_SEASONAL_ROWS
          .filter((row) => row.region_key === region && row.context === context)
          .map((row) => row.month),
      );
      const months = [...monthSet].sort((a, b) => a - b);
      assertEquals(months, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    }
  }
});

Deno.test("V3 phase 2 largemouth seasonal rows keep candidate pools populated and scoped", () => {
  for (const row of LARGEMOUTH_V3_SEASONAL_ROWS) {
    assert(
      row.viable_lure_archetypes.length >= 5,
      `${row.region_key} ${row.context} month ${row.month} should keep a usable lure pool`,
    );
    assert(
      row.viable_fly_archetypes.length >= 4,
      `${row.region_key} ${row.context} month ${row.month} should keep a usable fly pool`,
    );
  }
});
