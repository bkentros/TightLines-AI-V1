import type { EngineContext } from "../../howFishingEngine/contracts/context.ts";
import type { RecommenderRequest } from "../contracts/input.ts";
import type { SpeciesGroup } from "../contracts/species.ts";
import {
  RECOMMENDER_V4_CONTEXTS,
  RECOMMENDER_V4_SPECIES,
  type RecommenderV4Context,
  type RecommenderV4Species,
} from "./contracts.ts";

export const RECOMMENDER_V4_SPECIES_META: Record<
  RecommenderV4Species,
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

const LEGACY_TO_V4_SPECIES: Partial<Record<SpeciesGroup, RecommenderV4Species>> = {
  largemouth_bass: "largemouth_bass",
  smallmouth_bass: "smallmouth_bass",
  pike_musky: "northern_pike",
  river_trout: "trout",
};

const V4_TO_LEGACY_SPECIES: Record<RecommenderV4Species, SpeciesGroup> = {
  largemouth_bass: "largemouth_bass",
  smallmouth_bass: "smallmouth_bass",
  northern_pike: "pike_musky",
  trout: "river_trout",
};

export const RECOMMENDER_V4_SPECIES_CONTEXTS: Record<
  RecommenderV4Species,
  readonly RecommenderV4Context[]
> = {
  largemouth_bass: RECOMMENDER_V4_CONTEXTS,
  smallmouth_bass: RECOMMENDER_V4_CONTEXTS,
  northern_pike: RECOMMENDER_V4_CONTEXTS,
  trout: ["freshwater_river"],
};

export function isRecommenderV4Species(x: string): x is RecommenderV4Species {
  return (RECOMMENDER_V4_SPECIES as readonly string[]).includes(x);
}

export function isRecommenderV4Context(x: string): x is RecommenderV4Context {
  return (RECOMMENDER_V4_CONTEXTS as readonly string[]).includes(x);
}

export function toRecommenderV4Species(
  species: SpeciesGroup | RecommenderV4Species,
): RecommenderV4Species | null {
  if (isRecommenderV4Species(species)) return species;
  return LEGACY_TO_V4_SPECIES[species] ?? null;
}

export function toLegacyRecommenderSpecies(
  species: RecommenderV4Species,
): SpeciesGroup {
  return V4_TO_LEGACY_SPECIES[species];
}

export function isContextAllowedForRecommenderV4(
  species: RecommenderV4Species,
  context: EngineContext,
): context is RecommenderV4Context {
  if (!isRecommenderV4Context(context)) return false;
  return RECOMMENDER_V4_SPECIES_CONTEXTS[species].includes(context);
}

export function assertRecommenderV4Scope(
  req: Pick<RecommenderRequest, "species" | "context">,
): { species: RecommenderV4Species; context: RecommenderV4Context } {
  const species = toRecommenderV4Species(req.species);
  if (!species) {
    throw new Error(`V4 is freshwater-only and does not support species '${req.species}'.`);
  }

  if (!isContextAllowedForRecommenderV4(species, req.context)) {
    throw new Error(`V4 does not support species '${species}' in context '${req.context}'.`);
  }

  return {
    species,
    context: req.context,
  };
}
