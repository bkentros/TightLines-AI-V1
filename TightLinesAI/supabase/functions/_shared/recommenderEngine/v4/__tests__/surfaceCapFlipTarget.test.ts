import { assertEquals } from "jsr:@std/assert";
import { createMulberry32 } from "../engine/prng.ts";
import { enforceSurfaceCapV4 } from "../engine/pickTop3.ts";
import type { PickedArchetypeV4 } from "../engine/pickTop3.ts";
import { LURE_ARCHETYPES_V4 } from "../candidates/lures.ts";
import { createCollectingDiagWriter, type RecommenderV4DiagPayload } from "../engine/diagnostics.ts";
import type { SeasonalRowV4 } from "../contracts.ts";

const row = (): SeasonalRowV4 => ({
  species: "largemouth_bass",
  region_key: "appalachian",
  month: 6,
  water_type: "freshwater_lake_pond",
  column_range: ["bottom", "mid", "upper", "surface"],
  column_baseline: "upper",
  pace_range: ["slow", "medium", "fast"],
  pace_baseline: "fast",
  primary_forage: "baitfish",
  surface_seasonally_possible: true,
  primary_lure_ids: ["ned_rig"],
  primary_fly_ids: ["woolly_bugger"],
});

Deno.test("surfaceCapFlipTarget: flips last surface to anchor column from distribution[0]", () => {
  const walk = LURE_ARCHETYPES_V4.find((l) => l.id === "walking_topwater")!;
  const pop = LURE_ARCHETYPES_V4.find((l) => l.id === "popping_topwater")!;
  const picks: PickedArchetypeV4[] = [
    {
      archetype: walk,
      slotColumn: "surface",
      slotPace: "medium",
      role: "headline",
    },
    {
      archetype: pop,
      slotColumn: "surface",
      slotPace: "medium",
      role: "secondary",
    },
    {
      archetype: LURE_ARCHETYPES_V4.find((l) => l.id === "squarebill_crankbait")!,
      slotColumn: "upper",
      slotPace: "fast",
      role: "outward",
    },
  ];
  const colDist = ["mid", "mid", "surface"] as const;
  const pool = LURE_ARCHETYPES_V4;
  const seed = createMulberry32(77);
  const diags: RecommenderV4DiagPayload[] = [];
  const out = enforceSurfaceCapV4(
    picks,
    colDist,
    pool,
    seed,
    ["bottom", "mid", "upper", "surface"],
    new Set(["slow", "medium", "fast"]),
    new Set(["bottom", "mid", "upper", "surface"]),
    createCollectingDiagWriter(diags),
    "lure",
    row(),
  );
  const surfaces = out.filter((p) => p.archetype.column === "surface").length;
  assertEquals(surfaces <= 1, true);
  assertEquals(out[1]!.archetype.column, "mid");
  assertEquals(diags.some((d) => d.event === "surface_cap_fired"), true);
});
