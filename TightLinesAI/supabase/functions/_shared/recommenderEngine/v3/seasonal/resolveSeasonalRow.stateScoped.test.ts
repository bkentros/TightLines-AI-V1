import { assert, assertEquals } from "jsr:@std/assert";
import type { RegionKey } from "../../../howFishingEngine/contracts/region.ts";
import type {
  RecommenderV3Context,
  RecommenderV3SeasonalRow,
  RecommenderV3Species,
} from "../contracts.ts";
import { SMALLMOUTH_V3_SEASONAL_ROWS } from "./smallmouth.ts";
import {
  resolveSeasonalRowFromTable,
  resolveSeasonalRowV3,
} from "./resolveSeasonalRow.ts";

Deno.test(
  "resolveSeasonalRowV3: arbitrary state_code matches unscoped row when no state-scoped row exists",
  () => {
    const tuples: readonly [
      RecommenderV3Species,
      RegionKey,
      number,
      RecommenderV3Context,
      string,
    ][] = [
      ["largemouth_bass", "appalachian", 4, "freshwater_lake_pond", "OH"],
      [
        "smallmouth_bass",
        "great_lakes_upper_midwest",
        7,
        "freshwater_lake_pond",
        "WI",
      ],
      ["trout", "mountain_west", 4, "freshwater_river", "MT"],
      [
        "northern_pike",
        "great_lakes_upper_midwest",
        5,
        "freshwater_lake_pond",
        "MN",
      ],
    ];

    for (const [species, region_key, month, context, stateCode] of tuples) {
      const baseline = resolveSeasonalRowV3(
        species,
        region_key,
        month,
        context,
        undefined,
      );
      const withState = resolveSeasonalRowV3(
        species,
        region_key,
        month,
        context,
        stateCode,
      );
      assertEquals(withState, baseline);
      assertEquals(withState.used_state_scoped_row, false);
    }
  },
);

Deno.test(
  "resolveSeasonalRowFromTable: prefers state-scoped row when stateCode matches (harness row)",
  () => {
    const base = SMALLMOUTH_V3_SEASONAL_ROWS.find(
      (r) =>
        r.species === "smallmouth_bass" &&
        r.region_key === "northeast" &&
        r.month === 6 &&
        r.context === "freshwater_river" &&
        r.state_code == null,
    );
    assert(base != null, "expected unscoped northeast June river smallmouth row");

    const synthetic: RecommenderV3SeasonalRow = {
      ...base,
      state_code: "ZZ",
    };

    const table = [...SMALLMOUTH_V3_SEASONAL_ROWS, synthetic];

    const scoped = resolveSeasonalRowFromTable(
      table,
      "smallmouth_bass",
      "northeast",
      6,
      "freshwater_river",
      "ZZ",
    );
    assertEquals(scoped.state_code, "ZZ");
    assertEquals(scoped.used_state_scoped_row, true);

    const unscoped = resolveSeasonalRowFromTable(
      table,
      "smallmouth_bass",
      "northeast",
      6,
      "freshwater_river",
      undefined,
    );
    assertEquals(unscoped.state_code, undefined);
    assertEquals(unscoped.used_state_scoped_row, false);
  },
);

Deno.test(
  "resolveSeasonalRowV3: PA June northeast river smallmouth uses state row with six scoring deltas",
  () => {
    const pa = resolveSeasonalRowV3(
      "smallmouth_bass",
      "northeast",
      6,
      "freshwater_river",
      "PA",
    );
    assertEquals(pa.state_code, "PA");
    assertEquals(pa.used_state_scoped_row, true);

    const unscoped = resolveSeasonalRowV3(
      "smallmouth_bass",
      "northeast",
      6,
      "freshwater_river",
      undefined,
    );
    assertEquals(unscoped.state_code, undefined);
    assertEquals(unscoped.used_state_scoped_row, false);

    const expected: Record<string, number> = {
      tube_jig: 2.18,
      squarebill_crankbait: 2.12,
      suspending_jerkbait: 2.06,
      walking_topwater: -1.38,
      inline_spinner: -0.32,
      paddle_tail_swimbait: -0.22,
    };
    const adj = pa.state_scoring_adjustments;
    assert(adj != null && adj.length === 6);
    for (const e of adj) {
      assertEquals(e.delta, expected[e.archetype_id]);
    }
  },
);

Deno.test(
  "resolveSeasonalRowV3: ID April mountain_west river trout uses state row with four stained-gated deltas",
  () => {
    const idRow = resolveSeasonalRowV3(
      "trout",
      "mountain_west",
      4,
      "freshwater_river",
      "ID",
    );
    assertEquals(idRow.state_code, "ID");
    assertEquals(idRow.used_state_scoped_row, true);

    const mt = resolveSeasonalRowV3(
      "trout",
      "mountain_west",
      4,
      "freshwater_river",
      "MT",
    );
    const baseline = resolveSeasonalRowV3(
      "trout",
      "mountain_west",
      4,
      "freshwater_river",
      undefined,
    );
    assertEquals(mt, baseline);
    assertEquals(mt.used_state_scoped_row, false);

    const adj = idRow.state_scoring_adjustments;
    assert(adj != null && adj.length === 4);
    for (const e of adj) {
      assertEquals(e.when, { clarity: "stained" });
    }
  },
);
