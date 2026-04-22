import { assert, assertEquals, assertNotEquals } from "jsr:@std/assert";
import { FLY_ARCHETYPES_V4 } from "../v4/candidates/flies.ts";
import { LURE_ARCHETYPES_V4 } from "../v4/candidates/lures.ts";
import type {
  ArchetypeProfileV4,
  SeasonalRowV4,
  TacticalPace,
} from "../v4/contracts.ts";
import {
  buildHowToFishCopy,
  buildWhyChosenCopy,
  copyVariantIndex,
  HOW_COPY_BY_ARCHETYPE_ID,
} from "../rebuild/copy.ts";

const catalog = [...LURE_ARCHETYPES_V4, ...FLY_ARCHETYPES_V4];

function pacesFor(a: ArchetypeProfileV4): TacticalPace[] {
  return [a.primary_pace, ...(a.secondary_pace ? [a.secondary_pace] : [])];
}

const row = (archetype: ArchetypeProfileV4): SeasonalRowV4 => ({
  species: archetype.species_allowed[0]!,
  region_key: "appalachian",
  month: 6,
  water_type: archetype.water_types_allowed[0]!,
  column_range: ["bottom", "mid", "upper", "surface"],
  column_baseline: archetype.column === "surface" ? "upper" : archetype.column,
  pace_range: ["slow", "medium", "fast"],
  pace_baseline: archetype.primary_pace,
  primary_forage: archetype.forage_tags[0]!,
  surface_seasonally_possible: true,
  primary_lure_ids: [],
  primary_fly_ids: [],
});

Deno.test("rebuild copy: every archetype supported pace has three how-to-fish variants", () => {
  for (const archetype of catalog) {
    const copy = HOW_COPY_BY_ARCHETYPE_ID[archetype.id];
    for (const pace of pacesFor(archetype)) {
      const variants = copy[pace];
      assert(variants, `${archetype.id} missing ${pace} how copy`);
      assertEquals(variants.length, 3, `${archetype.id} ${pace}`);
      for (const variant of variants) {
        assert(variant.length > 0, `${archetype.id} ${pace} has empty copy`);
        assert(
          variant.split(/[.!?]/).filter((part) => part.trim().length > 0)
            .length <= 2,
          `${archetype.id} ${pace} copy should stay brief: ${variant}`,
        );
      }
    }
  }
});

Deno.test("rebuild copy: why and how use the selected pace, including secondary pace", () => {
  const swimJig = LURE_ARCHETYPES_V4.find((a) => a.id === "swim_jig")!;
  const mediumProfile = { column: swimJig.column, pace: "medium" as const };
  const fastProfile = { column: swimJig.column, pace: "fast" as const };

  const mediumWhy = buildWhyChosenCopy({
    archetype: swimJig,
    row: row(swimJig),
    targetProfile: mediumProfile,
    variant: 0,
  });
  const fastWhy = buildWhyChosenCopy({
    archetype: swimJig,
    row: row(swimJig),
    targetProfile: fastProfile,
    variant: 0,
  });

  assert(mediumWhy.includes("medium"));
  assert(fastWhy.includes("fast"));

  const mediumHow = buildHowToFishCopy({
    archetype: swimJig,
    targetProfile: mediumProfile,
    variant: 0,
  });
  const fastHow = buildHowToFishCopy({
    archetype: swimJig,
    targetProfile: fastProfile,
    variant: 0,
  });

  assertNotEquals(mediumHow, fastHow);
});

Deno.test("rebuild copy: generated card copy avoids internal wording", () => {
  const banned = /\b(engine|slot|target|selected|baseline|model|diagnostic)\b/i;

  for (const archetype of catalog) {
    for (const pace of pacesFor(archetype)) {
      for (const variant of [0, 1, 2] as const) {
        const profile = { column: archetype.column, pace };
        const why = buildWhyChosenCopy({
          archetype,
          row: row(archetype),
          targetProfile: profile,
          variant,
        });
        const how = buildHowToFishCopy({
          archetype,
          targetProfile: profile,
          variant,
        });

        assert(
          !banned.test(why),
          `${archetype.id} why leaks internal wording: ${why}`,
        );
        assert(
          !banned.test(how),
          `${archetype.id} how leaks internal wording: ${how}`,
        );
      }
    }
  }
});

Deno.test("rebuild copy: deterministic variant index stays in the three-template range", () => {
  for (const field of ["why", "how"] as const) {
    const idx = copyVariantIndex("user|date|archetype|pace", field);
    assert(idx === 0 || idx === 1 || idx === 2);
  }
});
