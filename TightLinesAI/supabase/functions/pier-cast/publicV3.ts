import { PIER_CAST_RESEARCH_DISCLOSURE } from "../_shared/pierCastEngine/config/publicRelease.ts";
import { PIER_CAST_PUBLIC_V3_RELEASE } from "../_shared/pierCastEngine/config/publicV3Release.ts";
import type {
  PierCastReviewOutlookResponse,
} from "../_shared/pierCastEngine/types.ts";
import type {
  PierCastV3ReviewOutlookResponse,
} from "../_shared/pierCastEngine/pipeline/v3ReviewOutlook.ts";

/** Present the reviewed shadow calculation through the existing public report contract. */
export function projectPublicV3Outlook(
  outlook: PierCastV3ReviewOutlookResponse,
): PierCastReviewOutlookResponse {
  if (
    outlook.cities.length !== PIER_CAST_PUBLIC_V3_RELEASE.cityIds.length ||
    outlook.cities.some((city) =>
      !PIER_CAST_PUBLIC_V3_RELEASE.cityIds.some((id) => id === city.cityId) ||
      city.dates.length !== 5 ||
      city.dates[0]?.headline.overall.status !== "available"
    )
  ) throw new Error("Complete twelve-city public outlook is required.");

  return {
    mode: "public_research",
    previewOnly: false,
    releasePolicyVersion: PIER_CAST_PUBLIC_V3_RELEASE.version,
    generatedAt: outlook.generatedAt,
    ratingName: outlook.ratingName,
    ratingDisplayFormat: outlook.ratingDisplayFormat,
    formulaVersion: outlook.formulaVersion,
    disclosure: PIER_CAST_RESEARCH_DISCLOSURE,
    source: outlook.source,
    cities: outlook.cities.map((city) => ({
      cityId: city.cityId,
      displayName: city.displayName,
      timezone: city.timezone,
      representationDecision: city.representationDecision,
      temperatureTimeline: city.temperatureTimeline,
      temperatureEvents: city.temperatureEvents,
      dates: city.dates.map((date) => ({
        ...date,
        species: date.species.map((species) => ({
          ...species,
          previewMode: "disabled_provisional" as const,
          seasonalRating: species.activeMode?.seasonalPotential ?? null,
          seasonalCurveId: null,
        })),
      })),
    })),
  };
}
