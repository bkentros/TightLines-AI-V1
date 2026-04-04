import type { EngineContext } from "../../howFishingEngine/contracts/context.ts";
import type { RecommenderRequest } from "../contracts/input.ts";
import type { SpeciesGroup } from "../contracts/species.ts";
import {
  RECOMMENDER_V3_CONTEXTS,
  RECOMMENDER_V3_SPECIES,
  type RecommenderV3Context,
  type RecommenderV3Species,
} from "./contracts.ts";

export const RECOMMENDER_V3_SPECIES_META: Record<
  RecommenderV3Species,
  { display_name: string; short_label: string }
> = {
  largemouth_bass: {
    display_name: "Largemouth Bass",
    short_label: "Largemouth",
  },
  smallmouth_bass: {
    display_name: "Smallmouth Bass",
    short_label: "Smallmouth",
  },
  northern_pike: {
    display_name: "Northern Pike",
    short_label: "Northern Pike",
  },
  trout: {
    display_name: "Trout",
    short_label: "Trout",
  },
};

const LEGACY_TO_V3_SPECIES: Partial<Record<SpeciesGroup, RecommenderV3Species>> = {
  largemouth_bass: "largemouth_bass",
  smallmouth_bass: "smallmouth_bass",
  pike_musky: "northern_pike",
  river_trout: "trout",
};

export const RECOMMENDER_V3_SPECIES_CONTEXTS: Record<
  RecommenderV3Species,
  readonly RecommenderV3Context[]
> = {
  largemouth_bass: RECOMMENDER_V3_CONTEXTS,
  smallmouth_bass: RECOMMENDER_V3_CONTEXTS,
  northern_pike: RECOMMENDER_V3_CONTEXTS,
  trout: ["freshwater_river"],
};

export function isRecommenderV3Species(x: string): x is RecommenderV3Species {
  return (RECOMMENDER_V3_SPECIES as readonly string[]).includes(x);
}

export function isRecommenderV3Context(x: string): x is RecommenderV3Context {
  return (RECOMMENDER_V3_CONTEXTS as readonly string[]).includes(x);
}

export function toRecommenderV3Species(
  species: SpeciesGroup | RecommenderV3Species,
): RecommenderV3Species | null {
  if (isRecommenderV3Species(species)) return species;
  return LEGACY_TO_V3_SPECIES[species] ?? null;
}

export function isContextAllowedForRecommenderV3(
  species: RecommenderV3Species,
  context: EngineContext,
): context is RecommenderV3Context {
  if (!isRecommenderV3Context(context)) return false;
  return RECOMMENDER_V3_SPECIES_CONTEXTS[species].includes(context);
}

export function assertRecommenderV3Scope(
  req: Pick<RecommenderRequest, "species" | "context">,
): { species: RecommenderV3Species; context: RecommenderV3Context } {
  const species = toRecommenderV3Species(req.species);
  if (!species) {
    throw new Error(`V3 is freshwater-only and does not support species '${req.species}'.`);
  }

  if (!isContextAllowedForRecommenderV3(species, req.context)) {
    throw new Error(`V3 does not support species '${species}' in context '${req.context}'.`);
  }

  return {
    species,
    context: req.context,
  };
}
