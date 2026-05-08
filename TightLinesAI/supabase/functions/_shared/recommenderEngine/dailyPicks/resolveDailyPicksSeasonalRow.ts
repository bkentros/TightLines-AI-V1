import type { EngineContext } from "../../howFishingEngine/contracts/context.ts";
import type { RegionKey } from "../../howFishingEngine/contracts/region.ts";
import type { SpeciesGroup } from "../contracts/species.ts";
import type { RecommenderV4Species, SeasonalRowV4 } from "../v4/contracts.ts";
import { LARGEMOUTH_BASS_SEASONAL_ROWS_V4 } from "../v4/seasonal/generated/largemouth_bass.ts";
import { NORTHERN_PIKE_SEASONAL_ROWS_V4 } from "../v4/seasonal/generated/northern_pike.ts";
import { SMALLMOUTH_BASS_SEASONAL_ROWS_V4 } from "../v4/seasonal/generated/smallmouth_bass.ts";
import { TROUT_SEASONAL_ROWS_V4 } from "../v4/seasonal/generated/trout.ts";

export class DailyPicksSeasonalRowMissingError extends Error {
  readonly species: RecommenderV4Species;
  readonly region_key: RegionKey;
  readonly month: number;
  readonly water_type: EngineContext;

  constructor(args: {
    species: RecommenderV4Species;
    region_key: RegionKey;
    month: number;
    water_type: EngineContext;
  }) {
    super(
      `Daily picks seasonal matrix has no exact row for ${args.species} x ${args.region_key} x month ${args.month} x ${args.water_type}.`,
    );
    this.name = "DailyPicksSeasonalRowMissingError";
    this.species = args.species;
    this.region_key = args.region_key;
    this.month = args.month;
    this.water_type = args.water_type;
  }
}

export function speciesToDailyPicksV4Species(
  species: SpeciesGroup | RecommenderV4Species,
): RecommenderV4Species {
  switch (species) {
    case "largemouth_bass":
    case "smallmouth_bass":
    case "northern_pike":
    case "trout":
      return species;
    case "pike_musky":
      return "northern_pike";
    case "river_trout":
      return "trout";
    default:
      throw new Error(
        `daily picks seasonal row: unsupported species '${species}'`,
      );
  }
}

function rowsForSpecies(
  species: RecommenderV4Species,
): readonly SeasonalRowV4[] {
  switch (species) {
    case "largemouth_bass":
      return LARGEMOUTH_BASS_SEASONAL_ROWS_V4;
    case "smallmouth_bass":
      return SMALLMOUTH_BASS_SEASONAL_ROWS_V4;
    case "northern_pike":
      return NORTHERN_PIKE_SEASONAL_ROWS_V4;
    case "trout":
      return TROUT_SEASONAL_ROWS_V4;
  }
}

function isBaseRow(row: SeasonalRowV4): boolean {
  return row.state_code == null || row.state_code === "";
}

export function resolveDailyPicksSeasonalRow(args: {
  species: SpeciesGroup | RecommenderV4Species;
  region_key: RegionKey;
  month: number;
  water_type: EngineContext;
}): SeasonalRowV4 {
  const species = speciesToDailyPicksV4Species(args.species);
  for (const row of rowsForSpecies(species)) {
    if (
      isBaseRow(row) &&
      row.species === species &&
      row.region_key === args.region_key &&
      row.month === args.month &&
      row.water_type === args.water_type
    ) {
      return row;
    }
  }

  throw new DailyPicksSeasonalRowMissingError({
    species,
    region_key: args.region_key,
    month: args.month,
    water_type: args.water_type,
  });
}
