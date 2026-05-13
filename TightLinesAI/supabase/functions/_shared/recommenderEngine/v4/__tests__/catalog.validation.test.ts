import { assert, assertEquals, assertThrows } from "jsr:@std/assert";
import {
  CONDITION_TAGS_V4,
  FLY_ARCHETYPE_IDS_V4,
  type FlyArchetypeIdV4,
  FORAGE_BUCKETS_V4,
  FORAGE_POLICY_V4,
  GOAL_TAGS_V4,
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

Deno.test("catalog: lure count and id set match Appendix A / contracts (48)", () => {
  assertEquals(LURE_ARCHETYPES_V4.length, 48);
  const ids = new Set(LURE_ARCHETYPES_V4.map((x) => x.id));
  assertEquals(ids.size, 48);
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

Deno.test("trout river quality: small_floating_trout_plug is trout-only river surface", () => {
  const plug = LURE_ARCHETYPES_V4.find((lure) =>
    lure.id === "small_floating_trout_plug"
  );
  assert(plug, "expected small_floating_trout_plug in lure catalog");
  assertEquals(plug.display_name, "Floating Trout Plug");
  assertEquals(plug.species_allowed, ["trout"]);
  assertEquals(plug.water_types_allowed, ["freshwater_river"]);
  assertEquals(plug.column, "surface");
  assertEquals(plug.primary_pace, "medium");
  assertEquals(plug.secondary_pace, "slow");
  assertEquals(plug.is_surface, true);
  assert(plug.family_group.trim().length > 0);
  assert(plug.presentation_group.trim().length > 0);
  assertEquals(plug.how_to_fish_variants.length, 3);
});

Deno.test("catalog: fly count and id set match Appendix A / contracts (32)", () => {
  assertEquals(FLY_ARCHETYPES_V4.length, 32);
  const ids = new Set(FLY_ARCHETYPES_V4.map((x) => x.id));
  assertEquals(ids.size, 32);
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
      for (const s of f.species_allowed) {
        assert(
          s === "largemouth_bass" || s === "trout",
          `mouse_fly species ${s}`,
        );
      }
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
        condition_tags: ["cold_slow"],
        goal_tags: ["reliable_action"],
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

Deno.test("Pass 4A: authored condition and goal tags are valid, unique, and non-empty", () => {
  for (const p of ALL_ARCHETYPES_V4) {
    assert(p.condition_tags.length >= 1, `${p.id} condition_tags`);
    assert(p.goal_tags.length >= 1, `${p.id} goal_tags`);
    assert(
      !hasDuplicates([...p.condition_tags]),
      `${p.id} duplicate condition_tags`,
    );
    assert(!hasDuplicates([...p.goal_tags]), `${p.id} duplicate goal_tags`);
    for (const tag of p.condition_tags) {
      assert(
        (CONDITION_TAGS_V4 as readonly string[]).includes(tag),
        `${p.id} invalid condition_tag ${tag}`,
      );
    }
    for (const tag of p.goal_tags) {
      assert(
        (GOAL_TAGS_V4 as readonly string[]).includes(tag),
        `${p.id} invalid goal_tag ${tag}`,
      );
    }
  }
});

Deno.test("Pass 4A: buzzbait catalog identity stays fast surface reaction, not slow finesse", () => {
  const buzzbait = LURE_ARCHETYPES_V4.find((lure) => lure.id === "buzzbait");
  assert(buzzbait, "expected buzzbait in lure catalog");
  assertEquals(buzzbait.column, "surface");
  assertEquals(buzzbait.primary_pace, "fast");
  assertEquals(buzzbait.secondary_pace, "medium");
  assert(buzzbait.condition_tags.includes("low_light_surface"));
  assert(buzzbait.condition_tags.includes("wind_reaction"));
  assert(buzzbait.condition_tags.includes("dirty_vibration"));
  assert(!buzzbait.condition_tags.includes("clear_subtle"));
  assert(!buzzbait.condition_tags.includes("heat_finesse"));
  assert(buzzbait.goal_tags.includes("big_fish_upside"));
  assert(buzzbait.goal_tags.includes("high_risk_high_reward"));
});

Deno.test("Pass 5D.1: large pike tube is pike-first cold/slow bottom inventory", () => {
  const largePikeTube = LURE_ARCHETYPES_V4.find((lure) =>
    lure.id === "large_pike_tube"
  );
  assert(largePikeTube, "expected large_pike_tube in lure catalog");
  assertEquals(largePikeTube.display_name, "Large Tube Jig");
  assertEquals(largePikeTube.species_allowed, ["northern_pike"]);
  assertEquals(largePikeTube.water_types_allowed, [
    "freshwater_lake_pond",
    "freshwater_river",
  ]);
  assertEquals(largePikeTube.column, "bottom");
  assertEquals(largePikeTube.primary_pace, "slow");
  assertEquals(largePikeTube.secondary_pace, "medium");
  assertEquals(largePikeTube.forage_tags, ["baitfish", "bluegill_perch"]);
  assert(largePikeTube.condition_tags.includes("cold_slow"));
  assert(largePikeTube.condition_tags.includes("current_swing"));
  assert(largePikeTube.condition_tags.includes("cover_ambush"));
  assert(largePikeTube.goal_tags.includes("big_fish_upside"));
  assert(largePikeTube.goal_tags.includes("reliable_action"));
  assertEquals(largePikeTube.presentation_group, "pike_tube");
});

Deno.test("Pass 7C: glidebait is bass-only Big Fish mid-column inventory", () => {
  const glidebait = LURE_ARCHETYPES_V4.find((lure) => lure.id === "glidebait");
  assert(glidebait, "expected glidebait in lure catalog");
  assertEquals(glidebait.display_name, "Glide Bait");
  assertEquals(glidebait.species_allowed, [
    "largemouth_bass",
    "smallmouth_bass",
  ]);
  assertEquals(glidebait.water_types_allowed, ["freshwater_lake_pond"]);
  assertEquals(glidebait.column, "mid");
  assertEquals(glidebait.primary_pace, "slow");
  assertEquals(glidebait.secondary_pace, "medium");
  assertEquals(glidebait.is_surface, false);
  assertEquals(glidebait.clarity_strengths, ["clear", "stained"]);
  assertEquals(glidebait.condition_tags, [
    "clear_subtle",
    "open_water_search",
    "cover_ambush",
  ]);
  assertEquals(glidebait.goal_tags, [
    "big_fish_upside",
    "high_risk_high_reward",
  ]);
  assertEquals(glidebait.presentation_group, "glidebait");
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

Deno.test("how-to-fish copy is guide-facing and not reused verbatim across archetypes", () => {
  const seen = new Map<string, string>();
  const bannedTerms = [
    "daily signal",
    "condition_tag",
    "score",
    "confidence",
    "surface gate",
    "engine",
  ];

  for (const p of ALL_ARCHETYPES_V4) {
    assertEquals(p.how_to_fish_variants.length, 3);
    assertEquals(
      new Set(p.how_to_fish_variants).size,
      3,
      `${p.id} should have three distinct how-to-fish variants`,
    );

    for (const copy of p.how_to_fish_variants) {
      assert(copy.length <= 220, `${p.id} how-to copy is too long: ${copy}`);
      assert(!copy.includes("_"), `${p.id} leaks internal token copy: ${copy}`);
      for (const term of bannedTerms) {
        assert(
          !copy.toLowerCase().includes(term),
          `${p.id} leaks "${term}" in how-to copy: ${copy}`,
        );
      }

      const previousId = seen.get(copy);
      assert(
        previousId == null,
        `${p.id} reuses how-to copy from ${previousId}: ${copy}`,
      );
      seen.set(copy, p.id);
    }
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

Deno.test("SMB quality: casting_spoon is pike/trout only, not bass", () => {
  const spoon = LURE_ARCHETYPES_V4.find((lure) => lure.id === "casting_spoon");
  assert(spoon, "expected casting_spoon in lure catalog");
  assert(
    !spoon.species_allowed.includes("largemouth_bass"),
    "casting_spoon should not be LMB eligible",
  );
  assert(
    !spoon.species_allowed.includes("smallmouth_bass"),
    "casting_spoon should not be SMB eligible",
  );
  assert(spoon.species_allowed.includes("northern_pike"));
  assert(spoon.species_allowed.includes("trout"));
});

Deno.test("Pass 4B.1: weightless stick worm stays non-trout while Ned remains trout-compatible finesse", () => {
  const stickWorm = LURE_ARCHETYPES_V4.find((candidate) =>
    candidate.id === "weightless_stick_worm"
  );
  assert(stickWorm, "expected weightless_stick_worm in lure catalog");
  assertEquals(stickWorm.species_allowed, [
    "largemouth_bass",
    "smallmouth_bass",
  ]);
  assert(
    !stickWorm.species_allowed.includes("trout"),
    "weightless_stick_worm should not be trout eligible",
  );

  const nedRig = LURE_ARCHETYPES_V4.find((candidate) =>
    candidate.id === "ned_rig"
  );
  assert(nedRig, "expected ned_rig in lure catalog");
  assertEquals(nedRig.species_allowed, [
    "largemouth_bass",
    "smallmouth_bass",
    "trout",
  ]);
  assertEquals(nedRig.column, "bottom");
  assertEquals(nedRig.primary_pace, "slow");
  assert(nedRig.condition_tags.includes("cold_slow"));
  assert(nedRig.condition_tags.includes("clear_subtle"));
  assertEquals(nedRig.goal_tags, ["reliable_action"]);
  assert(!nedRig.goal_tags.includes("big_fish_upside"));
});

Deno.test("Pass 4B.1: row-authored broad eligibility is kept for current runtime compatibility", () => {
  const expectedSpeciesById = new Map<LureArchetypeIdV4, readonly string[]>([
    ["tube_jig", ["largemouth_bass", "smallmouth_bass", "northern_pike"]],
    [
      "squarebill_crankbait",
      ["largemouth_bass", "smallmouth_bass", "northern_pike"],
    ],
    [
      "flat_sided_crankbait",
      ["largemouth_bass", "smallmouth_bass", "northern_pike"],
    ],
    [
      "deep_diving_crankbait",
      ["largemouth_bass", "smallmouth_bass", "northern_pike"],
    ],
    [
      "lipless_crankbait",
      ["largemouth_bass", "smallmouth_bass", "northern_pike"],
    ],
    [
      "soft_jerkbait",
      ["largemouth_bass", "smallmouth_bass", "northern_pike"],
    ],
    [
      "blade_bait",
      ["largemouth_bass", "smallmouth_bass", "northern_pike", "trout"],
    ],
    ["buzzbait", ["largemouth_bass", "smallmouth_bass", "northern_pike"]],
  ]);

  for (const [id, expectedSpecies] of expectedSpeciesById) {
    const lure = LURE_ARCHETYPES_V4.find((candidate) => candidate.id === id);
    assert(lure, `expected ${id} in lure catalog`);
    assertEquals(lure.species_allowed, expectedSpecies);
  }

  const broadFlySpecies = new Map<FlyArchetypeIdV4, readonly string[]>([
    [
      "clouser_minnow",
      ["smallmouth_bass", "largemouth_bass", "northern_pike", "trout"],
    ],
    [
      "articulated_baitfish_streamer",
      ["smallmouth_bass", "largemouth_bass", "northern_pike", "trout"],
    ],
    [
      "woolly_bugger",
      ["smallmouth_bass", "largemouth_bass", "northern_pike", "trout"],
    ],
    [
      "rabbit_strip_leech",
      ["smallmouth_bass", "largemouth_bass", "northern_pike", "trout"],
    ],
    [
      "jighead_marabou_leech",
      ["largemouth_bass", "smallmouth_bass", "northern_pike", "trout"],
    ],
    [
      "lead_eye_leech",
      ["largemouth_bass", "smallmouth_bass", "northern_pike", "trout"],
    ],
    [
      "feather_jig_leech",
      ["largemouth_bass", "smallmouth_bass", "northern_pike", "trout"],
    ],
    [
      "unweighted_baitfish_streamer",
      ["largemouth_bass", "smallmouth_bass", "northern_pike", "trout"],
    ],
    [
      "baitfish_slider_fly",
      ["largemouth_bass", "smallmouth_bass", "northern_pike", "trout"],
    ],
    [
      "popper_fly",
      ["largemouth_bass", "smallmouth_bass", "northern_pike", "trout"],
    ],
    [
      "deer_hair_slider",
      ["largemouth_bass", "smallmouth_bass", "northern_pike", "trout"],
    ],
  ]);

  for (const [id, expectedSpecies] of broadFlySpecies) {
    const flyProfile = FLY_ARCHETYPES_V4.find((candidate) =>
      candidate.id === id
    );
    assert(flyProfile, `expected ${id} in fly catalog`);
    assertEquals(flyProfile.species_allowed, expectedSpecies);
  }

  const popper = FLY_ARCHETYPES_V4.find((candidate) =>
    candidate.id === "popper_fly"
  );
  assert(popper, "expected popper_fly in fly catalog");
  assert(popper.goal_tags.includes("reliable_action"));
  assert(popper.goal_tags.includes("versatile_search"));
  assert(!popper.goal_tags.includes("high_risk_high_reward"));
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
      condition_tags: src.condition_tags,
      goal_tags: src.goal_tags,
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
      condition_tags: src.condition_tags,
      goal_tags: src.goal_tags,
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

Deno.test("QA-5A: crawfish flies share family group for selector diversity", () => {
  const riverCraw = FLY_ARCHETYPES_V4.find((f) =>
    f.id === "crawfish_streamer"
  )!;
  const warmwaterCraw = FLY_ARCHETYPES_V4.find((f) =>
    f.id === "warmwater_crawfish_fly"
  )!;

  assertEquals(riverCraw.family_group, "crawfish_fly");
  assertEquals(warmwaterCraw.family_group, "crawfish_fly");
  assertEquals(riverCraw.presentation_group, "crawfish_fly");
  assertEquals(warmwaterCraw.presentation_group, "crawfish_fly");
});

Deno.test("QA-5A: spinnerbait is not trout catalog inventory", () => {
  const spinnerbait = LURE_ARCHETYPES_V4.find((l) => l.id === "spinnerbait")!;

  assert(!spinnerbait.species_allowed.includes("trout"));
});

Deno.test("QA-5B: new inventory keeps narrow species and water truth", () => {
  const byLure = new Map(LURE_ARCHETYPES_V4.map((l) => [l.id, l]));
  const byFly = new Map(FLY_ARCHETYPES_V4.map((f) => [f.id, f]));

  const compactGlide = byLure.get("compact_glidebait")!;
  assertEquals(compactGlide.species_allowed, ["smallmouth_bass"]);
  assertEquals(compactGlide.water_types_allowed, ["freshwater_lake_pond"]);
  assert(compactGlide.goal_tags.includes("big_fish_upside"));

  const magnumWorm = byLure.get("magnum_worm")!;
  assertEquals(magnumWorm.species_allowed, ["largemouth_bass"]);
  assertEquals(magnumWorm.water_types_allowed, ["freshwater_lake_pond"]);

  const pikeSpinnerbait = byLure.get("pike_spinnerbait")!;
  assertEquals(pikeSpinnerbait.species_allowed, ["northern_pike"]);
  assert(pikeSpinnerbait.goal_tags.includes("reliable_action"));
  assert(pikeSpinnerbait.goal_tags.includes("big_fish_upside"));

  const pikeGlide = byLure.get("pike_glidebait")!;
  assertEquals(pikeGlide.species_allowed, ["northern_pike"]);
  assertEquals(pikeGlide.water_types_allowed, ["freshwater_lake_pond"]);
  assert(pikeGlide.goal_tags.includes("high_risk_high_reward"));

  const bluegillStreamer = byFly.get("bluegill_streamer")!;
  assertEquals(bluegillStreamer.species_allowed, ["largemouth_bass"]);
  assertEquals(bluegillStreamer.water_types_allowed, ["freshwater_lake_pond"]);
  assertEquals(bluegillStreamer.forage_tags, ["bluegill_perch", "baitfish"]);
});

Deno.test("QA-5C: same-style Big Fish expansions share selector families", () => {
  const byLure = new Map(LURE_ARCHETYPES_V4.map((l) => [l.id, l]));

  assertEquals(
    byLure.get("compact_glidebait")!.family_group,
    byLure.get("glidebait")!.family_group,
  );
  assertEquals(
    byLure.get("big_smallmouth_tube")!.family_group,
    byLure.get("tube_jig")!.family_group,
  );
  assertEquals(byLure.get("pike_spinnerbait")!.species_allowed, [
    "northern_pike",
  ]);
  assertEquals(
    byLure.get("pike_spinnerbait")!.family_group ===
      byLure.get("spinnerbait")!.family_group,
    false,
  );
});

Deno.test("QA-7: pike bucktail participates in stained reaction traces", () => {
  const bucktail = LURE_ARCHETYPES_V4.find((l) =>
    l.id === "large_bucktail_spinner"
  )!;

  assert(bucktail.condition_tags.includes("wind_reaction"));
  assert(bucktail.condition_tags.includes("dirty_vibration"));
  assert(bucktail.goal_tags.includes("big_fish_upside"));
});

Deno.test("QA-5B: new inventory has manifest, asset, and frontend image mapping", async () => {
  const newLureIds = [
    "compact_glidebait",
    "magnum_jerkbait",
    "big_smallmouth_tube",
    "wake_bait",
    "magnum_worm",
    "pike_spinnerbait",
    "weedless_spoon",
    "shallow_minnowbait",
    "pike_glidebait",
  ] as const;
  const newFlyIds = ["bluegill_streamer"] as const;
  const repoRoot = new URL("../../../../../../", import.meta.url);
  const manifest = await Deno.readTextFile(
    new URL("scripts/data/recommenderTackleImageManifest.ts", repoRoot),
  );
  const lureImageMap = await Deno.readTextFile(
    new URL("lib/lureImages.ts", repoRoot),
  );
  const flyImageMap = await Deno.readTextFile(
    new URL("lib/flyImages.ts", repoRoot),
  );

  for (const id of newLureIds) {
    assert(manifest.includes(`key: "${id}"`), `${id} missing manifest entry`);
    assert(
      lureImageMap.includes(`${id}:`) &&
        lureImageMap.includes(`assets/images/lures/${id}.png`),
      `${id} missing frontend lure image mapping`,
    );
    const stat = await Deno.stat(
      new URL(`assets/images/lures/${id}.png`, repoRoot),
    );
    assert(stat.isFile, `${id} lure asset is not a file`);
  }

  for (const id of newFlyIds) {
    assert(manifest.includes(`key: "${id}"`), `${id} missing manifest entry`);
    assert(
      flyImageMap.includes(`${id}:`) &&
        flyImageMap.includes(`assets/images/flies/${id}.png`),
      `${id} missing frontend fly image mapping`,
    );
    const stat = await Deno.stat(
      new URL(`assets/images/flies/${id}.png`, repoRoot),
    );
    assert(stat.isFile, `${id} fly asset is not a file`);
  }
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
      condition_tags: src.condition_tags,
      goal_tags: src.goal_tags,
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
    condition_tags: src.condition_tags,
    goal_tags: src.goal_tags,
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
        condition_tags: ["calm_surface"],
        goal_tags: ["reliable_action"],
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
    condition_tags: src.condition_tags,
    goal_tags: src.goal_tags,
    species_allowed: src.species_allowed,
    water_types_allowed: [...src.water_types_allowed],
    how_to_fish_variants: src.how_to_fish_variants,
  });
  assertEquals(again.id, "ned_rig");
});
