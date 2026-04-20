import { assert, assertEquals, assertThrows } from "jsr:@std/assert";
import {
  FLY_ARCHETYPE_IDS_V4,
  type FlyArchetypeIdV4,
  LURE_ARCHETYPE_IDS_V4,
  SURFACE_FLY_IDS_V4,
} from "../contracts.ts";
import { FLY_ARCHETYPES_V4 } from "../candidates/flies.ts";
import { LURE_ARCHETYPES_V4 } from "../candidates/lures.ts";
import { fly, lure } from "../candidates/factory.ts";

Deno.test("catalog: lure count and id set match Appendix A / contracts (36)", () => {
  assertEquals(LURE_ARCHETYPES_V4.length, 36);
  const ids = new Set(LURE_ARCHETYPES_V4.map((x) => x.id));
  assertEquals(ids.size, 36);
  for (const id of LURE_ARCHETYPE_IDS_V4) {
    assert(ids.has(id), `missing lure ${id}`);
  }
  for (const id of ids) {
    assert(
      (LURE_ARCHETYPE_IDS_V4 as readonly string[]).includes(id),
      `unexpected lure id ${id}`,
    );
  }
});

Deno.test("catalog: fly count and id set match Appendix A / contracts (22)", () => {
  assertEquals(FLY_ARCHETYPES_V4.length, 22);
  const ids = new Set(FLY_ARCHETYPES_V4.map((x) => x.id));
  assertEquals(ids.size, 22);
  for (const id of FLY_ARCHETYPE_IDS_V4) {
    assert(ids.has(id), `missing fly ${id}`);
  }
  for (const id of ids) {
    assert(
      (FLY_ARCHETYPE_IDS_V4 as readonly string[]).includes(id),
      `unexpected fly id ${id}`,
    );
  }
});

Deno.test("P13: only popper_fly, frog_fly, mouse_fly may have fly column surface", () => {
  const surfaceSet = new Set(SURFACE_FLY_IDS_V4 as readonly string[]);
  for (const f of FLY_ARCHETYPES_V4) {
    if (f.column === "surface") {
      assert(surfaceSet.has(f.id), `illegal surface fly ${f.id}`);
    } else {
      assert(!surfaceSet.has(f.id), `surface fly id ${f.id} must use column surface`);
    }
  }
});

Deno.test("G7: surface-fly species allowances on authored catalog", () => {
  for (const f of FLY_ARCHETYPES_V4) {
    if (f.id === "popper_fly") {
      for (const s of f.species_allowed) {
        assert(s === "largemouth_bass" || s === "smallmouth_bass", `popper_fly species ${s}`);
      }
    } else if (f.id === "frog_fly") {
      for (const s of f.species_allowed) {
        assert(
          s === "largemouth_bass" || s === "northern_pike",
          `frog_fly species ${s}`,
        );
      }
    } else if (f.id === "mouse_fly") {
      assertEquals(f.species_allowed.length, 1);
      assertEquals(f.species_allowed[0], "trout");
    }
  }
});

Deno.test("G2: non-surface fly with column surface must throw (synthetic woolly_bugger)", () => {
  assertThrows(
    () =>
      fly({
        id: "woolly_bugger",
        display_name: "Woolly Bugger",
        family_group: "leech_family",
        column: "surface",
        primary_pace: "slow",
        forage_tags: ["leech_worm"],
        clarity_strengths: ["clear", "stained", "dirty"],
        species_allowed: ["trout"],
        water_types_allowed: ["freshwater_river"],
        how_to_fish_variants: ["a", "b", "c"],
      }),
    Error,
    'cannot use column "surface"',
  );
});

Deno.test("G2: lure column and pace invariants hold for full lure catalog", () => {
  for (const p of LURE_ARCHETYPES_V4) {
    assert(p.primary_pace !== undefined);
    if (p.secondary_pace !== undefined) {
      assert(p.secondary_pace !== p.primary_pace);
    }
    assert(p.forage_tags.length >= 1);
    assert(p.clarity_strengths.length >= 1);
    assertEquals(p.how_to_fish_variants.length, 3);
  }
});

Deno.test("G2: fly invariants hold for full fly catalog", () => {
  for (const p of FLY_ARCHETYPES_V4) {
    if (p.secondary_pace !== undefined) {
      assert(p.secondary_pace !== p.primary_pace);
    }
    assert(p.forage_tags.length >= 1);
    assert(p.clarity_strengths.length >= 1);
    assertEquals(p.how_to_fish_variants.length, 3);
  }
});

Deno.test("valid surface flies from catalog reconstruct via factory", () => {
  for (const id of SURFACE_FLY_IDS_V4) {
    const src = FLY_ARCHETYPES_V4.find((f) => f.id === id)!;
    const again = fly({
      id: src.id as FlyArchetypeIdV4,
      display_name: src.display_name,
      family_group: src.family_group,
      column: src.column,
      primary_pace: src.primary_pace,
      secondary_pace: src.secondary_pace,
      forage_tags: src.forage_tags,
      clarity_strengths: src.clarity_strengths,
      species_allowed: src.species_allowed,
      water_types_allowed: [...src.water_types_allowed],
      how_to_fish_variants: src.how_to_fish_variants,
    });
    assertEquals(again.id, src.id);
    assertEquals(again.is_surface, true);
  }
});

Deno.test("valid non-surface fly reconstruct via factory (clouser_minnow)", () => {
  const src = FLY_ARCHETYPES_V4.find((f) => f.id === "clouser_minnow")!;
  const again = fly({
    id: "clouser_minnow",
    display_name: src.display_name,
    family_group: src.family_group,
    column: src.column,
    primary_pace: src.primary_pace,
    secondary_pace: src.secondary_pace,
    forage_tags: src.forage_tags,
    clarity_strengths: src.clarity_strengths,
    species_allowed: src.species_allowed,
    water_types_allowed: [...src.water_types_allowed],
    how_to_fish_variants: src.how_to_fish_variants,
  });
  assertEquals(again.column, "mid");
  assertEquals(again.is_surface, false);
});

Deno.test("G7: invalid popper species on synthetic input throws", () => {
  assertThrows(
    () =>
      fly({
        id: "popper_fly",
        display_name: "Popper",
        family_group: "fly_popper",
        column: "surface",
        primary_pace: "medium",
        secondary_pace: "slow",
        forage_tags: ["surface_prey", "bluegill_perch"],
        clarity_strengths: ["clear", "stained"],
        species_allowed: ["northern_pike"],
        water_types_allowed: ["freshwater_lake_pond"],
        how_to_fish_variants: ["a", "b", "c"],
      }),
    Error,
    "popper_fly species_allowed must be bass only",
  );
});

Deno.test("representative lure reconstruct via factory (ned_rig)", () => {
  const src = LURE_ARCHETYPES_V4.find((l) => l.id === "ned_rig")!;
  const again = lure({
    id: "ned_rig",
    display_name: src.display_name,
    family_group: src.family_group,
    column: src.column,
    primary_pace: src.primary_pace,
    secondary_pace: src.secondary_pace,
    forage_tags: src.forage_tags,
    clarity_strengths: src.clarity_strengths,
    species_allowed: src.species_allowed,
    water_types_allowed: [...src.water_types_allowed],
    how_to_fish_variants: src.how_to_fish_variants,
  });
  assertEquals(again.id, "ned_rig");
});
