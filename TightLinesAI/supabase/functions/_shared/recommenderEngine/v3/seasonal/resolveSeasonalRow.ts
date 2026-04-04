import type { RecommenderV3Context, RecommenderV3SeasonalRow, RecommenderV3Species } from "../contracts.ts";
import { LARGEMOUTH_V3_SEASONAL_ROWS } from "./largemouth.ts";
import { SMALLMOUTH_V3_SEASONAL_ROWS } from "./smallmouth.ts";
import { NORTHERN_PIKE_V3_SEASONAL_ROWS } from "./pike.ts";
import { TROUT_V3_SEASONAL_ROWS } from "./trout.ts";
import type { RegionKey } from "../../../howFishingEngine/contracts/region.ts";

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

  let row: RecommenderV3SeasonalRow | undefined;
  for (let index = seasonalRows.length - 1; index >= 0; index -= 1) {
    const candidate = seasonalRows[index]!;
    if (
      candidate.species === species &&
      candidate.region_key === region_key &&
      candidate.month === month &&
      candidate.context === context
    ) {
      row = candidate;
      break;
    }
  }

  if (!row) {
    throw new Error(
      `No V3 seasonal row found for ${species} in ${region_key}, month ${month}, context ${context}.`,
    );
  }

  return row;
}
