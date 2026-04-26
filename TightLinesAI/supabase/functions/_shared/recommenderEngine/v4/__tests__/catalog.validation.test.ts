import { assert, assertEquals, assertThrows } from "jsr:@std/assert";
import {
  FLY_ARCHETYPE_IDS_V4,
  type FlyArchetypeIdV4,
  FORAGE_BUCKETS_V4,
  FORAGE_POLICY_V4,
  LURE_ARCHETYPE_IDS_V4,
  type LureArchetypeIdV4,
  RECOMMENDER_V4_CONTEXTS,
  RECOMMENDER_V4_SPECIES,
  SURFACE_FLY_IDS_V4,
  type TacticalPace,
} from "../contracts.ts";
import { FLY_ARCHETYPES_V4 } from "../candidates/flies.ts";
import { LURE_ARCHETYPES_V4 } from "../candidates/lures.ts";
import { fly, lure } from "../candidates/factory.ts";

const ALL_ARCHETYPES_V4 = [...LURE_ARCHETYPES_V4, ...FLY_ARCHETYPES_V4];
const WATER_CLARITIES = ["clear", "stained", "dirty"] as const;
const PACE_INDEX: Record<TacticalPace, number> = {
  slow: 0,
  medium: 1,
  fast: 2,
};

function hasDuplicates(values: readonly string[]): boolean {
  return new Set(values).size !== values.length;
}

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

Deno.test("catalog: fly count and id set match Appendix A / contracts (31)", () => {
  assertEquals(FLY_ARCHETYPES_V4.length, 31);
  const ids = new Set(FLY_ARCHETYPES_V4.map((x) => x.id));
  assertEquals(ids.size, 31);
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

Deno.test("P13: only SURFACE_FLY_IDS_V4 entries may use fly column surface", () => {
  const surfaceSet = new Set(SURFACE_FLY_IDS_V4 as readonly string[]);
  assert(surfaceSet.has("foam_gurgler_fly"));
  for (const f of FLY_ARCHETYPES_V4) {
    if (f.column === "surface") {
      assert(surfaceSet.has(f.id), `illegal surface fly ${f.id}`);
    } else {
      assert(
        !surfaceSet.has(f.id),
        `surface fly id ${f.id} must use column surface`,
      );
    }
  }
});

Deno.test("G7: surface-fly species allowances on authored catalog", () => {
  for (const f of FLY_ARCHETYPES_V4) {
    if (f.id === "popper_fly" || f.id === "deer_hair_slider") {
      for (const s of f.species_allowed) {
        assert(
          s === "largemouth_bass" || s === "smallmouth_bass" ||
            s === "northern_pike" ||
            s === "trout",
          `${f.id} species ${s}`,
        );
      }
    } else if (f.id === "foam_gurgler_fly") {
      assert(!f.species_allowed.includes("trout"));
      for (const s of f.species_allowed) {
        assert(
          s === "largemouth_bass" || s === "smallmouth_bass" ||
            s === "northern_pike",
          `foam_gurgler_fly species ${s}`,
        );
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
        presentation_group: "leech_bugger",
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
      assert(
        Math.abs(PACE_INDEX[p.primary_pace] - PACE_INDEX[p.secondary_pace]) ===
          1,
        `${p.id} secondary_pace must be adjacent to primary_pace`,
      );
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
      assert(
        Math.abs(PACE_INDEX[p.primary_pace] - PACE_INDEX[p.secondary_pace]) ===
          1,
        `${p.id} secondary_pace must be adjacent to primary_pace`,
      );
    }
    assert(p.forage_tags.length >= 1);
    assert(p.clarity_strengths.length >= 1);
    assertEquals(p.how_to_fish_variants.length, 3);
  }
});

Deno.test("Pass 1: every lure and fly has non-empty presentation_group", () => {
  for (const p of LURE_ARCHETYPES_V4) {
    assert(p.presentation_group.trim().length > 0, `lure ${p.id}`);
  }
  for (const p of FLY_ARCHETYPES_V4) {
    assert(p.presentation_group.trim().length > 0, `fly ${p.id}`);
  }
});

Deno.test("Pass 5: catalog species and water allowances are valid, unique, and non-empty", () => {
  for (const p of ALL_ARCHETYPES_V4) {
    assert(p.species_allowed.length > 0, `${p.id} species_allowed`);
    assert(p.water_types_allowed.length > 0, `${p.id} water_types_allowed`);
    assert(
      !hasDuplicates([...p.species_allowed]),
      `${p.id} duplicate species_allowed`,
    );
    assert(
      !hasDuplicates([...p.water_types_allowed]),
      `${p.id} duplicate water_types_allowed`,
    );
    for (const species of p.species_allowed) {
      assert(
        (RECOMMENDER_V4_SPECIES as readonly string[]).includes(species),
        `${p.id} invalid species ${species}`,
      );
    }
    for (const waterType of p.water_types_allowed) {
      assert(
        (RECOMMENDER_V4_CONTEXTS as readonly string[]).includes(waterType),
        `${p.id} invalid water type ${waterType}`,
      );
    }
  }
});

Deno.test("Pass 5: forage and clarity tags are valid and species-compatible", () => {
  for (const p of ALL_ARCHETYPES_V4) {
    assert(!hasDuplicates([...p.forage_tags]), `${p.id} duplicate forage tag`);
    assert(
      !hasDuplicates([...p.clarity_strengths]),
      `${p.id} duplicate clarity strength`,
    );
    for (const forage of p.forage_tags) {
      assert(
        (FORAGE_BUCKETS_V4 as readonly string[]).includes(forage),
        `${p.id} invalid forage tag ${forage}`,
      );
      assert(
        p.species_allowed.some((species) =>
          FORAGE_POLICY_V4[species].has(forage)
        ),
        `${p.id} forage tag ${forage} is not supported by any allowed species`,
      );
    }
    for (const clarity of p.clarity_strengths) {
      assert(
        (WATER_CLARITIES as readonly string[]).includes(clarity),
        `${p.id} invalid clarity strength ${clarity}`,
      );
    }
  }
});

Deno.test("Pass 5: is_surface flag matches canonical column", () => {
  for (const p of ALL_ARCHETYPES_V4) {
    assertEquals(p.is_surface, p.column === "surface", `${p.id} is_surface`);
  }
});

Deno.test("Pass 1: catalog round-trip via lure() / fly() preserves presentation_group", () => {
  for (const src of LURE_ARCHETYPES_V4) {
    const again = lure({
      id: src.id as LureArchetypeIdV4,
      display_name: src.display_name,
      family_group: src.family_group,
      presentation_group: src.presentation_group,
      column: src.column,
      primary_pace: src.primary_pace,
      secondary_pace: src.secondary_pace,
      forage_tags: src.forage_tags,
      clarity_strengths: src.clarity_strengths,
      species_allowed: src.species_allowed,
      water_types_allowed: [...src.water_types_allowed],
      how_to_fish_variants: src.how_to_fish_variants,
    });
    assertEquals(again.presentation_group, src.presentation_group);
  }
  for (const src of FLY_ARCHETYPES_V4) {
    const again = fly({
      id: src.id as FlyArchetypeIdV4,
      display_name: src.display_name,
      family_group: src.family_group,
      presentation_group: src.presentation_group,
      column: src.column,
      primary_pace: src.primary_pace,
      secondary_pace: src.secondary_pace,
      forage_tags: src.forage_tags,
      clarity_strengths: src.clarity_strengths,
      species_allowed: src.species_allowed,
      water_types_allowed: [...src.water_types_allowed],
      how_to_fish_variants: src.how_to_fish_variants,
    });
    assertEquals(again.presentation_group, src.presentation_group);
  }
});

Deno.test("Pass 1: shallow / medium crankbait archetypes share presentation_group crankbait", () => {
  const shallow = LURE_ARCHETYPES_V4.find((l) =>
    l.id === "squarebill_crankbait"
  )!;
  const flat = LURE_ARCHETYPES_V4.find((l) => l.id === "flat_sided_crankbait")!;
  const medium = LURE_ARCHETYPES_V4.find((l) =>
    l.id === "medium_diving_crankbait"
  )!;
  assertEquals(shallow.presentation_group, "crankbait");
  assertEquals(flat.presentation_group, "crankbait");
  assertEquals(medium.presentation_group, "crankbait");
});

Deno.test("Pass 11: surface fly popper, slider, and gurgler use distinct presentation groups", () => {
  const popper = FLY_ARCHETYPES_V4.find((f) => f.id === "popper_fly")!;
  const slider = FLY_ARCHETYPES_V4.find((f) => f.id === "deer_hair_slider")!;
  const gurgler = FLY_ARCHETYPES_V4.find((f) => f.id === "foam_gurgler_fly")!;
  assertEquals(popper.presentation_group, "surface_fly_popper_slider");
  assertEquals(slider.presentation_group, "surface_fly_slider");
  assertEquals(gurgler.presentation_group, "surface_fly_gurgler");
});

Deno.test("Pass 11: baitfish_slider_fly has slider-specific presentation group", () => {
  const slider = FLY_ARCHETYPES_V4.find((f) => f.id === "baitfish_slider_fly")!;
  assertEquals(slider.presentation_group, "baitfish_slider");
});

Deno.test("Pass 1: frog_fly and mouse_fly share surface_fly_frog_mouse", () => {
  const frog = FLY_ARCHETYPES_V4.find((f) => f.id === "frog_fly")!;
  const mouse = FLY_ARCHETYPES_V4.find((f) => f.id === "mouse_fly")!;
  assertEquals(frog.presentation_group, "surface_fly_frog_mouse");
  assertEquals(mouse.presentation_group, "surface_fly_frog_mouse");
});

Deno.test("valid surface flies from catalog reconstruct via factory", () => {
  for (const id of SURFACE_FLY_IDS_V4) {
    const src = FLY_ARCHETYPES_V4.find((f) => f.id === id)!;
    const again = fly({
      id: src.id as FlyArchetypeIdV4,
      display_name: src.display_name,
      family_group: src.family_group,
      presentation_group: src.presentation_group,
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
    presentation_group: src.presentation_group,
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
        presentation_group: "surface_fly_popper_slider",
        column: "surface",
        primary_pace: "medium",
        secondary_pace: "slow",
        forage_tags: ["surface_prey", "bluegill_perch"],
        clarity_strengths: ["clear", "stained"],
        species_allowed: [
          "largemouth_bass",
          "invalid_species" as "largemouth_bass",
        ],
        water_types_allowed: ["freshwater_lake_pond"],
        how_to_fish_variants: ["a", "b", "c"],
      }),
    Error,
    "popper_fly species_allowed must be largemouth_bass",
  );
});

Deno.test("representative lure reconstruct via factory (ned_rig)", () => {
  const src = LURE_ARCHETYPES_V4.find((l) => l.id === "ned_rig")!;
  const again = lure({
    id: "ned_rig",
    display_name: src.display_name,
    family_group: src.family_group,
    presentation_group: src.presentation_group,
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
