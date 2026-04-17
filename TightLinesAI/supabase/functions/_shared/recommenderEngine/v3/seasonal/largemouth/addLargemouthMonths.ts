import type {
  RecommenderV3Context,
  RecommenderV3SeasonalRow,
} from "../../contracts.ts";
import type { RegionKey } from "../../../../howFishingEngine/contracts/region.ts";
import type { AuthoredSeasonalCore } from "../tuning.ts";
import { upsertSeasonalRow } from "../tuning.ts";
import { toSeasonalRow } from "./constants.ts";

export function addLargemouthMonths(
  rows: Map<string, RecommenderV3SeasonalRow>,
  regions: readonly RegionKey[],
  context: RecommenderV3Context,
  months: readonly number[],
  core: AuthoredSeasonalCore,
) {
  for (const region_key of regions) {
    for (const month of months) {
      upsertSeasonalRow(
        rows,
        toSeasonalRow("largemouth_bass", region_key, context, month, core),
      );
    }
  }
}
