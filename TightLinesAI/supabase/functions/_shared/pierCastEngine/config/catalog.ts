import {
  isPierCastResearchCity,
  PIER_CAST_RESEARCH_DISCLOSURE,
  publicResearchSpecies,
} from "./publicRelease.ts";
import { PIER_CAST_RATING_DISCLOSURE } from "../copy/reasonCodes.ts";
import { PIER_CAST_OPEN_WATER_NOTICE } from "../copy/openWater.ts";
import { PIER_CAST_FORMULA_VERSION } from "../scoring/opportunity.ts";
import {
  isPierCastPublicV3City,
  PIER_CAST_PUBLIC_V3_RELEASE,
  publicV3Species,
} from "./publicV3Release.ts";
import type { PierCastCatalogMode, PierCastCatalogResponse } from "../types.ts";
import { PIER_CAST_CITY_PROFILES } from "./cities.ts";
import { PIER_CAST_WISCONSIN_CITY_PROFILES } from "./wisconsinShadow.ts";
import { PIER_CAST_LAKE_HURON_CITY_PROFILES } from "./lakeHuronShadow.ts";

export function buildPierCastCatalog(
  mode: PierCastCatalogMode,
  publicModel: "v2" | "v3" = "v2",
): PierCastCatalogResponse {
  const profiles = [
    ...PIER_CAST_CITY_PROFILES,
    ...PIER_CAST_WISCONSIN_CITY_PROFILES,
    ...PIER_CAST_LAKE_HURON_CITY_PROFILES,
  ];
  const cities = profiles
    .map((city) => ({
      cityId: city.cityId,
      displayName: city.displayName,
      stateCode: city.stateCode,
      timezone: city.timezone,
      tentative: city.tentative,
      releaseStatus: mode === "public" &&
          (publicModel === "v3"
            ? isPierCastPublicV3City(city.cityId)
            : isPierCastResearchCity(city.cityId))
        ? "public_research" as const
        : "research_only" as const,
      waterTemperatureSource: city.waterTemperatureSource,
      structures: city.structures.map((structure) => ({ ...structure })),
      species: city.species.filter((species) =>
        mode === "review" ||
        (publicModel === "v3"
          ? isPierCastPublicV3City(city.cityId) &&
            publicV3Species(city.cityId).includes(species.speciesId)
          : isPierCastResearchCity(city.cityId) &&
            publicResearchSpecies(city.cityId).includes(species.speciesId))
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
    formulaVersion: publicModel === "v3" && mode === "public"
      ? PIER_CAST_PUBLIC_V3_RELEASE.formulaVersion
      : PIER_CAST_FORMULA_VERSION,
    formula: publicModel === "v3" && mode === "public"
      ? "1 + (seasonalPotential - 1) * (0.30 + 0.70 * temperatureSuitability)"
      : "clamp(1, 10, 1 + (seasonalRating - 1) * (0.30 + 0.75 * temperatureSuitability))",
    winterOpenWaterNotice: PIER_CAST_OPEN_WATER_NOTICE,
    disclosure: mode === "public"
      ? PIER_CAST_RESEARCH_DISCLOSURE
      : PIER_CAST_RATING_DISCLOSURE,
    cities,
  };
}
