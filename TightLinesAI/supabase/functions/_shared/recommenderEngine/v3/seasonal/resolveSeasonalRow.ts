import type { RecommenderV3Context, RecommenderV3SeasonalRow, RecommenderV3Species } from "../contracts.ts";
import { LARGEMOUTH_V3_SEASONAL_ROWS } from "./largemouth.ts";
import { SMALLMOUTH_V3_SEASONAL_ROWS } from "./smallmouth.ts";
import { NORTHERN_PIKE_V3_SEASONAL_ROWS } from "./pike.ts";
import { TROUT_V3_SEASONAL_ROWS } from "./trout.ts";
import type { RegionKey } from "../../../howFishingEngine/contracts/region.ts";

/** Fallback chain: if a region has no seasonal row for the requested species,
 *  try these substitutes in order before giving up. */
const REGION_FALLBACKS: Partial<Record<RegionKey, RegionKey[]>> = {
  // original entries (unchanged)
  gulf_coast: ["south_central", "southeast_atlantic"],
  southeast_atlantic: ["south_central", "appalachian"],
  florida: ["gulf_coast", "south_central"],
  mountain_alpine: ["mountain_west", "inland_northwest"],
  alaska: ["pacific_northwest", "inland_northwest"],
  hawaii: ["southern_california", "southwest_desert"],
  // complete coverage for all 18 canonical regions
  northeast: ["great_lakes_upper_midwest", "appalachian"],
  great_lakes_upper_midwest: ["northeast", "midwest_interior"],
  midwest_interior: ["great_lakes_upper_midwest", "south_central"],
  south_central: ["southeast_atlantic", "gulf_coast"],
  mountain_west: ["inland_northwest", "mountain_alpine"],
  southwest_desert: ["southern_california", "south_central"],
  southwest_high_desert: ["mountain_west", "southwest_desert"],
  pacific_northwest: ["inland_northwest", "northern_california"],
  southern_california: ["southwest_desert", "gulf_coast"],
  northern_california: ["pacific_northwest", "mountain_west"],
  appalachian: ["northeast", "southeast_atlantic"],
  inland_northwest: ["mountain_west", "pacific_northwest"],
};

export function resolveSeasonalRowV3(
  species: RecommenderV3Species,
  region_key: RegionKey,
  month: number,
  context: RecommenderV3Context,
): RecommenderV3SeasonalRow {
  const seasonalRows = (() => {
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
  })();

  const findRow = (rk: RegionKey): RecommenderV3SeasonalRow | undefined => {
    for (const candidate of seasonalRows) {
      if (
        candidate.species === species &&
        candidate.region_key === rk &&
        candidate.month === month &&
        candidate.context === context
      ) {
        return candidate;
      }
    }
    return undefined;
  };

  let row = findRow(region_key);

  if (!row) {
    const fallbacks = REGION_FALLBACKS[region_key] ?? [];
    for (const fallback of fallbacks) {
      row = findRow(fallback);
      if (row) break;
    }
  }

  if (!row) {
    throw new Error(
      `No V3 seasonal row found for ${species} in ${region_key}, month ${month}, context ${context}.`,
    );
  }

  if (row.eligible_lure_ids.length < 3 || row.eligible_fly_ids.length < 3) {
    throw new Error(
      `Seasonal row for ${species} ${region_key} month ${month} ${context} must have at least 3 eligible lures and 3 eligible flies.`,
    );
  }

  return row;
}
