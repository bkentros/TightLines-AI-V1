import { assertEquals, assertThrows } from "jsr:@std/assert";
import { fly, lure } from "../candidates/factory.ts";

const baseLure = {
  id: "ned_rig" as const,
  display_name: "Ned rig",
  species_allowed: ["largemouth_bass"] as const,
  water_types_allowed: ["freshwater_lake_pond"] as const,
  family_group: "finesse_plastic",
  presentation_group: "ned_tube_finesse",
  column: "bottom" as const,
  primary_pace: "slow" as const,
  forage_tags: ["leech_worm"] as const,
  clarity_strengths: ["clear", "stained"] as const,
  how_to_fish_variants: ["a", "b", "c"] as const,
};

const baseFly = {
  id: "woolly_bugger" as const,
  display_name: "Woolly Bugger",
  species_allowed: ["trout"] as const,
  water_types_allowed: ["freshwater_river"] as const,
  family_group: "leech_family",
  presentation_group: "leech_bugger",
  column: "mid" as const,
  primary_pace: "slow" as const,
  forage_tags: ["leech_worm"] as const,
  clarity_strengths: ["clear", "stained", "dirty"] as const,
  how_to_fish_variants: ["a", "b", "c"] as const,
};

Deno.test("lure() throws on missing presentation_group (Pass 1)", () => {
  assertThrows(
    () =>
      lure({ ...baseLure, presentation_group: undefined as unknown as string }),
    Error,
    "presentation_group",
  );
});

Deno.test("lure() throws on blank presentation_group after trim (Pass 1)", () => {
  assertThrows(
    () => lure({ ...baseLure, presentation_group: "   " }),
    Error,
    "presentation_group",
  );
});

Deno.test("fly() throws on missing presentation_group (Pass 1)", () => {
  assertThrows(
    () =>
      fly({ ...baseFly, presentation_group: undefined as unknown as string }),
    Error,
    "presentation_group",
  );
});

Deno.test("fly() throws on blank presentation_group after trim (Pass 1)", () => {
  assertThrows(
    () => fly({ ...baseFly, presentation_group: "\t" }),
    Error,
    "presentation_group",
  );
});

Deno.test("lure() throws on missing column (G2)", () => {
  assertThrows(
    () =>
      lure({
        ...baseLure,
        column: undefined as unknown as typeof baseLure.column,
      }),
    Error,
    "missing or invalid column",
  );
});

Deno.test("lure() throws on missing primary_pace (G2)", () => {
  assertThrows(
    () =>
      lure({
        ...baseLure,
        primary_pace: undefined as unknown as typeof baseLure.primary_pace,
      }),
    Error,
    "primary_pace",
  );
});

Deno.test("lure() throws on duplicate primary/secondary pace (G2)", () => {
  assertThrows(
    () => lure({ ...baseLure, secondary_pace: "slow" }),
    Error,
    "secondary_pace duplicates primary_pace",
  );
});

Deno.test("lure() throws on non-adjacent secondary pace (Pass 5)", () => {
  assertThrows(
    () => lure({ ...baseLure, secondary_pace: "fast" }),
    Error,
    "secondary_pace must be adjacent to primary_pace",
  );
});

Deno.test("lure() throws on invalid secondary pace (Pass 5)", () => {
  assertThrows(
    () => lure({ ...baseLure, secondary_pace: "pause" as "medium" }),
    Error,
    "invalid secondary_pace",
  );
});

Deno.test("fly() throws when surface column is not a SURFACE_FLY_IDS_V4 id (G2/P13)", () => {
  assertThrows(
    () =>
      fly({
        ...baseFly,
        column: "surface",
      }),
    Error,
    'cannot use column "surface"',
  );
});

Deno.test("popper_fly: rejects invalid species token in species_allowed (G7)", () => {
  assertThrows(
    () =>
      fly({
        ...baseFly,
        id: "popper_fly",
        column: "surface",
        primary_pace: "medium",
        secondary_pace: "slow",
        species_allowed: [
          "largemouth_bass",
          "invalid_species" as "largemouth_bass",
        ],
        forage_tags: ["surface_prey", "bluegill_perch"],
        clarity_strengths: ["clear", "stained"],
      }),
    Error,
    "popper_fly species_allowed must be largemouth_bass",
  );
});

Deno.test("frog_fly: rejects smallmouth_bass (G7)", () => {
  assertThrows(
    () =>
      fly({
        ...baseFly,
        id: "frog_fly",
        column: "surface",
        primary_pace: "slow",
        secondary_pace: "medium",
        species_allowed: ["smallmouth_bass"],
        forage_tags: ["surface_prey"],
        clarity_strengths: ["stained", "dirty"],
        water_types_allowed: ["freshwater_lake_pond"],
      }),
    Error,
    "frog_fly species_allowed must be largemouth_bass and/or northern_pike",
  );
});

Deno.test("mouse_fly: rejects multiple species (G7)", () => {
  assertThrows(
    () =>
      fly({
        ...baseFly,
        id: "mouse_fly",
        column: "surface",
        primary_pace: "slow",
        secondary_pace: "medium",
        species_allowed: ["trout", "largemouth_bass"],
        forage_tags: ["surface_prey"],
        clarity_strengths: ["clear", "stained"],
      }),
    Error,
    'mouse_fly species_allowed must be exactly ["trout"]',
  );
});

Deno.test("mouse_fly: rejects pike-only species_allowed (G7)", () => {
  assertThrows(
    () =>
      fly({
        ...baseFly,
        id: "mouse_fly",
        column: "surface",
        primary_pace: "slow",
        secondary_pace: "medium",
        species_allowed: ["northern_pike"],
        forage_tags: ["surface_prey"],
        clarity_strengths: ["clear", "stained"],
      }),
    Error,
    'mouse_fly species_allowed must be exactly ["trout"]',
  );
});

Deno.test("foam_gurgler_fly: accepts bass and pike but rejects trout (G7)", () => {
  const p = fly({
    ...baseFly,
    id: "foam_gurgler_fly",
    presentation_group: "surface_fly_gurgler",
    family_group: "fly_gurgler",
    column: "surface",
    primary_pace: "medium",
    secondary_pace: "slow",
    species_allowed: [
      "largemouth_bass",
      "smallmouth_bass",
      "northern_pike",
    ],
    forage_tags: ["surface_prey", "baitfish"],
    clarity_strengths: ["clear", "stained", "dirty"],
    water_types_allowed: ["freshwater_lake_pond", "freshwater_river"],
  });
  assertEquals(p.id, "foam_gurgler_fly");
  assertEquals(p.gear_mode, "fly");
  assertEquals(p.is_surface, true);

  assertThrows(
    () =>
      fly({
        ...baseFly,
        id: "foam_gurgler_fly",
        presentation_group: "surface_fly_gurgler",
        family_group: "fly_gurgler",
        column: "surface",
        primary_pace: "medium",
        secondary_pace: "slow",
        species_allowed: ["trout"],
        forage_tags: ["surface_prey", "baitfish"],
        clarity_strengths: ["clear", "stained", "dirty"],
        water_types_allowed: ["freshwater_lake_pond", "freshwater_river"],
      }),
    Error,
    "foam_gurgler_fly species_allowed must be largemouth_bass",
  );
});

Deno.test("popper_fly: accepts bass, pike, and/or trout surface fly (G7)", () => {
  const p = fly({
    ...baseFly,
    id: "popper_fly",
    presentation_group: "surface_fly_popper_slider",
    column: "surface",
    primary_pace: "medium",
    secondary_pace: "slow",
    species_allowed: [
      "largemouth_bass",
      "smallmouth_bass",
      "northern_pike",
      "trout",
    ],
    forage_tags: ["surface_prey", "bluegill_perch"],
    clarity_strengths: ["clear", "stained"],
    water_types_allowed: ["freshwater_lake_pond", "freshwater_river"],
  });
  assertEquals(p.gear_mode, "fly");
  assertEquals(p.is_surface, true);
});
