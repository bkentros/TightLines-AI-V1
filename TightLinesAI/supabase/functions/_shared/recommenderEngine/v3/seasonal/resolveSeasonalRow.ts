import type {
  RecommenderV3Context,
  RecommenderV3ResolvedSeasonalRow,
  RecommenderV3SeasonalRow,
  RecommenderV3Species,
} from "../contracts.ts";
import { LARGEMOUTH_V3_SEASONAL_ROWS } from "./largemouth.ts";
import { SMALLMOUTH_V3_SEASONAL_ROWS } from "./smallmouth.ts";
import { NORTHERN_PIKE_V3_SEASONAL_ROWS } from "./pike.ts";
import { TROUT_V3_SEASONAL_ROWS } from "./trout.ts";
import type { RegionKey } from "../../../howFishingEngine/contracts/region.ts";

/** Fallback chain: if a region has no seasonal row for the requested species,
 *  try these substitutes in order before giving up. */
const REGION_FALLBACKS: Partial<Record<RegionKey, RegionKey[]>> = {
  // original entries (unchanged)
  gulf_coast: ["southeast_atlantic", "south_central"],
  southeast_atlantic: ["appalachian", "south_central"],
  florida: ["gulf_coast", "southeast_atlantic"],
  mountain_alpine: ["mountain_west", "inland_northwest"],
  alaska: ["pacific_northwest", "inland_northwest"],
  hawaii: ["southern_california", "southwest_desert"],
  // complete coverage for all 18 canonical regions
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
  species: RecommenderV3Species,
): readonly RecommenderV3SeasonalRow[] {
  switch (species) {
    case "largemouth_bass":
      return LARGEMOUTH_V3_SEASONAL_ROWS;
    case "smallmouth_bass":
      return SMALLMOUTH_V3_SEASONAL_ROWS;
    case "trout":
      return TROUT_V3_SEASONAL_ROWS;
    case "northern_pike":
      return NORTHERN_PIKE_V3_SEASONAL_ROWS;
    default:
      throw new Error(
        `V3 currently supports seasonal rows for largemouth_bass, smallmouth_bass, northern_pike, and trout only. Received '${species}'.`,
      );
  }
}

function matchesBase(
  candidate: RecommenderV3SeasonalRow,
  species: RecommenderV3Species,
  rk: RegionKey,
  month: number,
  context: RecommenderV3Context,
): boolean {
  return (
    candidate.species === species &&
    candidate.region_key === rk &&
    candidate.month === month &&
    candidate.context === context
  );
}

/**
 * Resolve a seasonal row from an explicit table (tests may pass augmented arrays).
 * Resolution order within each region: state-scoped row matching `stateCode` first,
 * then the unscoped row (`state_code` unset). Then REGION_FALLBACKS chain.
 */
export function resolveSeasonalRowFromTable(
  seasonalRows: readonly RecommenderV3SeasonalRow[],
  species: RecommenderV3Species,
  region_key: RegionKey,
  month: number,
  context: RecommenderV3Context,
  stateCode?: string,
): RecommenderV3ResolvedSeasonalRow {
  const findInRegion = (
    rk: RegionKey,
  ): { row: RecommenderV3SeasonalRow; used_state_scoped_row: boolean } | undefined => {
    const st = stateCode?.trim();
    if (st) {
      for (const candidate of seasonalRows) {
        if (
          matchesBase(candidate, species, rk, month, context) &&
          candidate.state_code === st
        ) {
          return { row: candidate, used_state_scoped_row: true };
        }
      }
    }
    for (const candidate of seasonalRows) {
      if (
        matchesBase(candidate, species, rk, month, context) &&
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
      `No V3 seasonal row found for ${species} in ${region_key}, month ${month}, context ${context}.`,
    );
  }

  const { row, used_state_scoped_row } = hit;

  if (row.eligible_lure_ids.length < 3 || row.eligible_fly_ids.length < 3) {
    throw new Error(
      `Seasonal row for ${species} ${region_key} month ${month} ${context} must have at least 3 eligible lures and 3 eligible flies.`,
    );
  }

  return {
    ...row,
    source_region_key,
    used_region_fallback: source_region_key !== region_key,
    used_state_scoped_row,
  };
}

export function resolveSeasonalRowV3(
  species: RecommenderV3Species,
  region_key: RegionKey,
  month: number,
  context: RecommenderV3Context,
  stateCode?: string,
): RecommenderV3ResolvedSeasonalRow {
  return resolveSeasonalRowFromTable(
    seasonalRowsForSpecies(species),
    species,
    region_key,
    month,
    context,
    stateCode,
  );
}
