import type { RegionKey } from "../../../howFishingEngine/contracts/region.ts";
import type { EngineContext } from "../../../howFishingEngine/contracts/context.ts";
import type { RecommenderV4Species, SeasonalRowV4 } from "../contracts.ts";
import { LARGEMOUTH_BASS_SEASONAL_ROWS_V4 } from "./generated/largemouth_bass.ts";
import { SMALLMOUTH_BASS_SEASONAL_ROWS_V4 } from "./generated/smallmouth_bass.ts";
import { NORTHERN_PIKE_SEASONAL_ROWS_V4 } from "./generated/northern_pike.ts";
import { TROUT_SEASONAL_ROWS_V4 } from "./generated/trout.ts";

/** Fallback chain — same geography discipline as v3 (§17 / v3 seasonal resolver). */
const REGION_FALLBACKS: Partial<Record<RegionKey, RegionKey[]>> = {
  gulf_coast: ["southeast_atlantic", "south_central"],
  southeast_atlantic: ["appalachian", "south_central"],
  florida: ["gulf_coast", "southeast_atlantic"],
  mountain_alpine: ["mountain_west", "inland_northwest"],
  alaska: ["pacific_northwest", "inland_northwest"],
  hawaii: ["southern_california", "southwest_desert"],
  northeast: ["great_lakes_upper_midwest", "appalachian"],
  great_lakes_upper_midwest: ["northeast", "midwest_interior"],
  midwest_interior: ["great_lakes_upper_midwest", "south_central"],
  south_central: ["southeast_atlantic", "appalachian"],
  mountain_west: ["inland_northwest", "mountain_alpine"],
  southwest_desert: ["southern_california", "south_central"],
  southwest_high_desert: ["mountain_west", "southwest_desert"],
  pacific_northwest: ["inland_northwest", "northern_california"],
  southern_california: ["southwest_desert", "gulf_coast"],
  northern_california: ["pacific_northwest", "mountain_west"],
  appalachian: ["northeast", "southeast_atlantic"],
  inland_northwest: ["mountain_west", "pacific_northwest"],
};

function seasonalRowsForSpecies(
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
    default: {
      const _exhaustive: never = species;
      return _exhaustive;
    }
  }
}

function matchesBase(
  candidate: SeasonalRowV4,
  species: RecommenderV4Species,
  rk: RegionKey,
  month: number,
  water_type: EngineContext,
): boolean {
  return (
    candidate.species === species &&
    candidate.region_key === rk &&
    candidate.month === month &&
    candidate.water_type === water_type
  );
}

export type ResolvedSeasonalRowV4 = {
  row: SeasonalRowV4;
  source_region_key: RegionKey;
  used_region_fallback: boolean;
  used_state_scoped_row: boolean;
};

export function resolveSeasonalRowFromTableV4(
  seasonalRows: readonly SeasonalRowV4[],
  species: RecommenderV4Species,
  region_key: RegionKey,
  month: number,
  water_type: EngineContext,
  stateCode?: string,
): ResolvedSeasonalRowV4 {
  const findInRegion = (
    rk: RegionKey,
  ): { row: SeasonalRowV4; used_state_scoped_row: boolean } | undefined => {
    const st = stateCode?.trim();
    if (st) {
      for (const candidate of seasonalRows) {
        if (
          matchesBase(candidate, species, rk, month, water_type) &&
          candidate.state_code === st
        ) {
          return { row: candidate, used_state_scoped_row: true };
        }
      }
    }
    for (const candidate of seasonalRows) {
      if (
        matchesBase(candidate, species, rk, month, water_type) &&
        candidate.state_code == null
      ) {
        return { row: candidate, used_state_scoped_row: false };
      }
    }
    return undefined;
  };

  let hit = findInRegion(region_key);
  let source_region_key = region_key;

  if (!hit) {
    const fallbacks = REGION_FALLBACKS[region_key] ?? [];
    for (const fallback of fallbacks) {
      hit = findInRegion(fallback);
      if (hit) {
        source_region_key = fallback;
        break;
      }
    }
  }

  if (!hit) {
    throw new Error(
      `No V4 seasonal row found for ${species} in ${region_key}, month ${month}, water_type ${water_type}.`,
    );
  }

  const { row, used_state_scoped_row } = hit;
  return {
    row,
    source_region_key,
    used_region_fallback: source_region_key !== region_key,
    used_state_scoped_row,
  };
}

export function resolveSeasonalRowV4(
  species: RecommenderV4Species,
  region_key: RegionKey,
  month: number,
  water_type: EngineContext,
  stateCode?: string,
): ResolvedSeasonalRowV4 {
  return resolveSeasonalRowFromTableV4(
    seasonalRowsForSpecies(species),
    species,
    region_key,
    month,
    water_type,
    stateCode,
  );
}
