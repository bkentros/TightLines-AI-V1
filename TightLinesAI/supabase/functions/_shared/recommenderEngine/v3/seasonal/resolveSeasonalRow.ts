import type { RecommenderV3Context, RecommenderV3SeasonalRow, RecommenderV3Species } from "../contracts.ts";
import { LARGEMOUTH_V3_SEASONAL_ROWS } from "./largemouth.ts";
import { SMALLMOUTH_V3_SEASONAL_ROWS } from "./smallmouth.ts";
import { NORTHERN_PIKE_V3_SEASONAL_ROWS } from "./pike.ts";
import { TROUT_V3_SEASONAL_ROWS } from "./trout.ts";
import type { RegionKey } from "../../../howFishingEngine/contracts/region.ts";

/** Fallback chain: if a region has no seasonal row for the requested species,
 *  try these substitutes in order before giving up. */
const REGION_FALLBACKS: Partial<Record<RegionKey, RegionKey[]>> = {
  gulf_coast: ["south_central", "southeast_atlantic"],
  southeast_atlantic: ["south_central", "appalachian"],
  florida: ["gulf_coast", "south_central"],
  mountain_alpine: ["mountain_west", "inland_northwest"],
  alaska: ["pacific_northwest", "inland_northwest"],
  hawaii: ["southern_california", "southwest_desert"],
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
    for (let index = seasonalRows.length - 1; index >= 0; index -= 1) {
      const candidate = seasonalRows[index]!;
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

  return row;
}
