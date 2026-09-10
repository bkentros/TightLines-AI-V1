import { PIER_CAST_RATING_DISCLOSURE } from "../copy/reasonCodes.ts";
import { PIER_CAST_OPEN_WATER_NOTICE } from "../copy/openWater.ts";
import { PIER_CAST_FORMULA_VERSION } from "../scoring/opportunity.ts";
import type { PierCastCatalogMode, PierCastCatalogResponse } from "../types.ts";
import { PIER_CAST_CITY_PROFILES } from "./cities.ts";

export function buildPierCastCatalog(
  mode: PierCastCatalogMode,
): PierCastCatalogResponse {
  const cities = PIER_CAST_CITY_PROFILES
    .filter((city) => mode === "review" || city.publicEnabled)
    .map((city) => ({
      cityId: city.cityId,
      displayName: city.displayName,
      stateCode: city.stateCode,
      timezone: city.timezone,
      tentative: city.tentative,
      releaseStatus: "research_only" as const,
      waterTemperatureSource: city.waterTemperatureSource,
      structures: city.structures.map((structure) => ({ ...structure })),
      species: city.species.map((species) => ({ ...species })),
    }));

  return {
    mode,
    ratingName: "FinFindr Opportunity Rating",
    ratingDisplayFormat: "X.X/10",
    formulaVersion: PIER_CAST_FORMULA_VERSION,
    formula: "1 + (seasonalRating - 1) * temperatureSuitability",
    winterOpenWaterNotice: PIER_CAST_OPEN_WATER_NOTICE,
    disclosure: PIER_CAST_RATING_DISCLOSURE,
    cities,
  };
}
