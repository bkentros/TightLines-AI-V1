import type { EngineContext } from "../../../howFishingEngine/contracts/context.ts";
import type { WaterClarity } from "../../contracts/input.ts";
import {
  type ArchetypeProfileV4,
  FLY_ARCHETYPE_IDS_V4,
  type FlyArchetypeIdV4,
  type ForageBucket,
  LURE_ARCHETYPE_IDS_V4,
  type LureArchetypeIdV4,
  type RecommenderV4Species,
  SURFACE_FLY_IDS_V4,
  type SurfaceFlyIdV4,
  TACTICAL_COLUMNS_V4,
  TACTICAL_PACES_V4,
  type TacticalColumn,
  type TacticalPace,
} from "../contracts.ts";

type LureFactoryInput = {
  id: LureArchetypeIdV4;
  display_name: string;
  species_allowed: readonly RecommenderV4Species[];
  water_types_allowed: readonly EngineContext[];
  family_group: string;
  presentation_group: string;
  column: TacticalColumn;
  primary_pace: TacticalPace;
  secondary_pace?: TacticalPace;
  forage_tags: readonly ForageBucket[];
  clarity_strengths: readonly WaterClarity[];
  how_to_fish_variants: readonly [string, string, string];
};

type FlyFactoryInput = {
  id: FlyArchetypeIdV4;
  display_name: string;
  species_allowed: readonly RecommenderV4Species[];
  water_types_allowed: readonly EngineContext[];
  family_group: string;
  presentation_group: string;
  column: TacticalColumn;
  primary_pace: TacticalPace;
  secondary_pace?: TacticalPace;
  forage_tags: readonly ForageBucket[];
  clarity_strengths: readonly WaterClarity[];
  how_to_fish_variants: readonly [string, string, string];
};

function assertValidColumn(
  id: string,
  column: TacticalColumn | undefined,
): asserts column is TacticalColumn {
  if (
    column === undefined ||
    !(TACTICAL_COLUMNS_V4 as readonly string[]).includes(column)
  ) {
    throw new Error(
      `[recommender v4] archetype "${id}" missing or invalid column.`,
    );
  }
}

function assertPrimaryPace(
  id: string,
  primary: TacticalPace | undefined,
): asserts primary is TacticalPace {
  if (
    primary === undefined ||
    !(TACTICAL_PACES_V4 as readonly string[]).includes(primary)
  ) {
    throw new Error(
      `[recommender v4] archetype "${id}" missing or invalid primary_pace.`,
    );
  }
}

function assertPacePair(
  id: string,
  primary: TacticalPace,
  secondary?: TacticalPace,
) {
  if (secondary === undefined) return;
  if (!(TACTICAL_PACES_V4 as readonly string[]).includes(secondary)) {
    throw new Error(
      `[recommender v4] archetype "${id}" invalid secondary_pace ("${secondary}").`,
    );
  }
  if (secondary === primary) {
    throw new Error(
      `[recommender v4] archetype "${id}" secondary_pace duplicates primary_pace ("${primary}").`,
    );
  }
  const primaryIndex = TACTICAL_PACES_V4.indexOf(primary);
  const secondaryIndex = TACTICAL_PACES_V4.indexOf(secondary);
  if (Math.abs(primaryIndex - secondaryIndex) !== 1) {
    throw new Error(
      `[recommender v4] archetype "${id}" secondary_pace must be adjacent to primary_pace ("${primary}" -> "${secondary}").`,
    );
  }
}

function assertForageAndClarity(
  id: string,
  input: {
    forage_tags: readonly ForageBucket[];
    clarity_strengths: readonly string[];
  },
) {
  if (input.forage_tags.length < 1) {
    throw new Error(
      `[recommender v4] archetype "${id}" must have at least one forage_tags entry (G2).`,
    );
  }
  if (input.clarity_strengths.length < 1) {
    throw new Error(
      `[recommender v4] archetype "${id}" must have at least one clarity_strengths entry (G2).`,
    );
  }
}

function assertSpeciesWater(
  id: string,
  species_allowed: readonly RecommenderV4Species[],
  water_types_allowed: readonly EngineContext[],
) {
  if (species_allowed.length < 1) {
    throw new Error(
      `[recommender v4] archetype "${id}" must have species_allowed (G2).`,
    );
  }
  if (water_types_allowed.length < 1) {
    throw new Error(
      `[recommender v4] archetype "${id}" must have water_types_allowed (G2).`,
    );
  }
}

function assertHowToFishVariants(
  id: string,
  v: readonly [string, string, string] | undefined,
) {
  if (v === undefined || v.length !== 3) {
    throw new Error(
      `[recommender v4] archetype "${id}" how_to_fish_variants must be length 3 (G2).`,
    );
  }
}

function assertPresentationGroup(
  id: string,
  presentation_group: string | undefined,
) {
  if (
    presentation_group === undefined || typeof presentation_group !== "string"
  ) {
    throw new Error(
      `[recommender v4] archetype "${id}" missing or invalid presentation_group.`,
    );
  }
  if (presentation_group.trim().length < 1) {
    throw new Error(
      `[recommender v4] archetype "${id}" presentation_group must be a non-empty string after trimming.`,
    );
  }
}

function validateFlySurfaceRules(id: FlyArchetypeIdV4, column: TacticalColumn) {
  const isSurfaceFly = (SURFACE_FLY_IDS_V4 as readonly string[]).includes(id);
  if (isSurfaceFly && column !== "surface") {
    throw new Error(
      `[recommender v4] fly archetype "${id}" must use column "surface" (P13/G2).`,
    );
  }
  if (!isSurfaceFly && column === "surface") {
    throw new Error(
      `[recommender v4] fly archetype "${id}" cannot use column "surface" (P13/G2).`,
    );
  }
}

function validateSurfaceFlySpeciesGate(
  id: FlyArchetypeIdV4,
  species_allowed: readonly RecommenderV4Species[],
) {
  if (!(SURFACE_FLY_IDS_V4 as readonly string[]).includes(id)) return;

  const surfaceId = id as SurfaceFlyIdV4;
  if (surfaceId === "popper_fly" || surfaceId === "deer_hair_slider") {
    for (const s of species_allowed) {
      if (
        s !== "largemouth_bass" && s !== "smallmouth_bass" &&
        s !== "northern_pike" && s !== "trout"
      ) {
        throw new Error(
          `[recommender v4] ${surfaceId} species_allowed must be largemouth_bass, smallmouth_bass, northern_pike, and/or trout only (G7/P23); got: ${
            species_allowed.join(", ")
          }.`,
        );
      }
    }
    return;
  }

  if (surfaceId === "foam_gurgler_fly") {
    for (const s of species_allowed) {
      if (
        s !== "largemouth_bass" && s !== "smallmouth_bass" &&
        s !== "northern_pike"
      ) {
        throw new Error(
          `[recommender v4] foam_gurgler_fly species_allowed must be largemouth_bass, smallmouth_bass, and/or northern_pike only (G7/P23); got: ${
            species_allowed.join(", ")
          }.`,
        );
      }
    }
    return;
  }

  if (surfaceId === "frog_fly") {
    for (const s of species_allowed) {
      if (s !== "largemouth_bass" && s !== "northern_pike") {
        throw new Error(
          `[recommender v4] frog_fly species_allowed must be largemouth_bass and/or northern_pike only (G7/P23); got: ${
            species_allowed.join(", ")
          }.`,
        );
      }
    }
    return;
  }

  if (surfaceId === "mouse_fly") {
    if (species_allowed.length !== 1 || species_allowed[0] !== "trout") {
      throw new Error(
        `[recommender v4] mouse_fly species_allowed must be exactly ["trout"] (G7/P23); got: ${
          species_allowed.join(", ")
        }.`,
      );
    }
  }
}

export function lure(input: LureFactoryInput): ArchetypeProfileV4 {
  if (!(LURE_ARCHETYPE_IDS_V4 as readonly string[]).includes(input.id)) {
    throw new Error(
      `[recommender v4] lure archetype id "${input.id}" is not in LURE_ARCHETYPE_IDS_V4.`,
    );
  }

  assertValidColumn(input.id, input.column);
  assertPrimaryPace(input.id, input.primary_pace);
  assertPacePair(input.id, input.primary_pace, input.secondary_pace);
  assertForageAndClarity(input.id, input);
  assertSpeciesWater(
    input.id,
    input.species_allowed,
    input.water_types_allowed,
  );
  assertHowToFishVariants(input.id, input.how_to_fish_variants);
  assertPresentationGroup(input.id, input.presentation_group);

  return {
    ...input,
    gear_mode: "lure",
    is_surface: input.column === "surface",
  };
}

export function fly(input: FlyFactoryInput): ArchetypeProfileV4 {
  if (!(FLY_ARCHETYPE_IDS_V4 as readonly string[]).includes(input.id)) {
    throw new Error(
      `[recommender v4] fly archetype id "${input.id}" is not in FLY_ARCHETYPE_IDS_V4.`,
    );
  }

  assertValidColumn(input.id, input.column);
  assertPrimaryPace(input.id, input.primary_pace);
  assertPacePair(input.id, input.primary_pace, input.secondary_pace);
  assertForageAndClarity(input.id, input);
  assertSpeciesWater(
    input.id,
    input.species_allowed,
    input.water_types_allowed,
  );
  assertHowToFishVariants(input.id, input.how_to_fish_variants);
  assertPresentationGroup(input.id, input.presentation_group);

  validateFlySurfaceRules(input.id, input.column);
  validateSurfaceFlySpeciesGate(input.id, input.species_allowed);

  return {
    ...input,
    gear_mode: "fly",
    is_surface: input.column === "surface",
  };
}
