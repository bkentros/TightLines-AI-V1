import {
  isPierCastResearchCity,
  PIER_CAST_RESEARCH_DISCLOSURE,
  publicResearchSpecies,
} from "./publicRelease.ts";
import { PIER_CAST_RATING_DISCLOSURE } from "../copy/reasonCodes.ts";
import { PIER_CAST_OPEN_WATER_NOTICE } from "../copy/openWater.ts";
import { PIER_CAST_FORMULA_VERSION } from "../scoring/opportunity.ts";
import type { PierCastCatalogMode, PierCastCatalogResponse } from "../types.ts";
import { PIER_CAST_CITY_PROFILES } from "./cities.ts";
import { PIER_CAST_WISCONSIN_CITY_PROFILES } from "./wisconsinShadow.ts";

export function buildPierCastCatalog(
  mode: PierCastCatalogMode,
): PierCastCatalogResponse {
  const profiles = mode === "review"
    ? [...PIER_CAST_CITY_PROFILES, ...PIER_CAST_WISCONSIN_CITY_PROFILES]
    : PIER_CAST_CITY_PROFILES;
  const cities = profiles
    .filter((city) => mode === "review" || isPierCastResearchCity(city.cityId))
    .map((city) => ({
      cityId: city.cityId,
      displayName: city.displayName,
      stateCode: city.stateCode,
      timezone: city.timezone,
      tentative: city.tentative,
      releaseStatus: mode === "public"
        ? "public_research" as const
        : "research_only" as const,
      waterTemperatureSource: city.waterTemperatureSource,
      structures: city.structures.map((structure) => ({ ...structure })),
      species: city.species.filter((species) =>
        mode === "review" ||
        publicResearchSpecies(city.cityId).includes(species.speciesId)
      ).map((species) => ({
        ...species,
        // Public discovery must not expose the full seasonal score configuration.
        ...(mode === "public" ? { seasonalOpportunityCurve: null } : {}),
      })),
    }));

  return {
    mode,
    ratingName: "FinFindr Opportunity Rating",
    ratingDisplayFormat: "X.X/10",
    formulaVersion: PIER_CAST_FORMULA_VERSION,
    formula:
      "clamp(1, 10, 1 + (seasonalRating - 1) * (0.30 + 0.75 * temperatureSuitability))",
    winterOpenWaterNotice: PIER_CAST_OPEN_WATER_NOTICE,
    disclosure: mode === "public"
      ? PIER_CAST_RESEARCH_DISCLOSURE
      : PIER_CAST_RATING_DISCLOSURE,
    cities,
  };
}
