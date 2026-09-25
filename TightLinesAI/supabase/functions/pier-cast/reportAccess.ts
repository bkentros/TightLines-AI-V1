import {
  PIER_CAST_PUBLIC_RELEASE,
  PIER_CAST_RESEARCH_DISCLOSURE,
} from "../_shared/pierCastEngine/config/publicRelease.ts";
import type { PierCastReviewOutlookResponse } from "../_shared/pierCastEngine/index.ts";
import { selectPierCastDailyHeadline } from "../_shared/pierCastEngine/scoring/headline.ts";
import type { PierCastReviewDateOutlook } from "../_shared/pierCastEngine/types.ts";

const PRIMARY_SPECIES_IDS = new Set([
  "atlantic_salmon",
  "coho_salmon",
  "chinook_salmon",
  "steelhead",
  "brown_trout",
  "lake_trout",
  "freshwater_drum",
]);

function primaryHeadline(date: PierCastReviewDateOutlook) {
  if (date.headline.overall.status !== "available") return date.headline;
  return selectPierCastDailyHeadline(
    date.species.filter((species) => PRIMARY_SPECIES_IDS.has(species.speciesId))
      .map((species) => ({
        speciesId: species.speciesId,
        biological: species.biological,
        coverage: species.coverage,
        targetingEligibility: species.targetingEligibility,
        promotion: species.promotion,
      })),
  );
}

export class PierCastAccessError extends Error {
  constructor(readonly code: string, message: string, readonly status: number) {
    super(message);
  }
}

/** Public map projection: modeled temperature only, never scores or species. */
export function temperatureMapOnly(outlook: PierCastReviewOutlookResponse) {
  const cities = outlook.cities.map((city) => ({
    cityId: city.cityId,
    points: (city.temperatureTimeline ?? []).map((point) => ({
      validAt: point.validAt,
      temperatureC: point.temperatureC,
    })),
  }));
  const expectedPointCount = cities[0]?.points.length ?? 0;
  const expectedTimes = cities[0]?.points.map((point) => point.validAt) ?? [];
  const timelineIsOrdered = expectedTimes.every((validAt, index) => {
    const parsed = Date.parse(validAt);
    return Number.isFinite(parsed) &&
      (index === 0 || parsed > Date.parse(expectedTimes[index - 1]!));
  });
  if (
    cities.length === 0 ||
    expectedPointCount === 0 ||
    !timelineIsOrdered ||
    cities.some((city) =>
      city.points.length !== expectedPointCount ||
      city.points.some((point, index) =>
        point.validAt !== expectedTimes[index] ||
        !Number.isFinite(point.temperatureC)
      )
    )
  ) {
    throw new Error("A complete coherent temperature map cycle is required.");
  }
  return {
    mode: "nearshore_temperature_map" as const,
    generatedAt: outlook.generatedAt,
    disclosure:
      "Modeled NOAA LMHOFS surface guidance at audited nearshore cells. It is not a pier thermometer and may not resolve harbor mixing, depth, river plumes, waves, or ice.",
    source: {
      productId: outlook.source.productId,
      issuedAt: outlook.source.issuedAt,
      fetchedAt: outlook.source.fetchedAt,
      cycleAgeHours: outlook.source.cycleAgeHours,
    },
    cities,
  };
}
export function leaderboardOnly(
  outlook:
    & Pick<
      PierCastReviewOutlookResponse,
      "generatedAt" | "dailyScoreSnapshot"
    >
    & {
      cities: Array<
        Pick<
          PierCastReviewOutlookResponse["cities"][number],
          "cityId" | "dates"
        >
      >;
    },
  options?: { maxCities?: number; releasePolicyVersion?: string },
) {
  const cities = outlook.cities.map((city) => ({
    cityId: city.cityId,
    dates: city.dates.slice(0, 1).map((date) => ({
      localDate: date.localDate,
      headline: primaryHeadline(date),
    })),
  })).sort((a, b) =>
    (b.dates[0]?.headline.overall.score ?? -1) -
      (a.dates[0]?.headline.overall.score ?? -1) ||
    a.cityId.localeCompare(b.cityId)
  ).slice(0, options?.maxCities ?? 5);
  const snapshot = outlook.dailyScoreSnapshot;
  return {
    generatedAt: outlook.generatedAt,
    disclosure: PIER_CAST_RESEARCH_DISCLOSURE,
    releasePolicyVersion: options?.releasePolicyVersion ??
      PIER_CAST_PUBLIC_RELEASE.version,
    ...(snapshot
      ? {
        dailyScoreSnapshot: {
          status: snapshot.status,
          lakeDate: snapshot.lakeDate,
          setAt: snapshot.setAt,
          publishAt: snapshot.publishAt,
        },
      }
      : {}),
    cities,
  };
}
export function cityReportOnly(
  outlook: PierCastReviewOutlookResponse,
  cityId: string,
): PierCastReviewOutlookResponse {
  const city = outlook.cities.find((c) => c.cityId === cityId);
  if (!city) {
    throw new PierCastAccessError(
      "city_unavailable",
      "This city is not available.",
      404,
    );
  }
  const { additionalSpeciesResearch: _research, ...report } = city;
  return {
    ...outlook,
    cities: [{
      ...report,
      dates: report.dates.map((date) => ({
        ...date,
        headline: primaryHeadline(date),
      })),
    }],
    ...(outlook.dailyScoreSnapshot
      ? {
        dailyScoreSnapshot: {
          ...outlook.dailyScoreSnapshot,
          cities: outlook.dailyScoreSnapshot.cities.filter((c) =>
            c.cityId === cityId
          ).map((city) => ({
            ...city,
            date: {
              ...city.date,
              headline: primaryHeadline(city.date),
            },
          })),
        },
      }
      : {}),
  };
}

export function createPierReportAccess(deps: {
  readOutlook: () => Promise<PierCastReviewOutlookResponse | null>;
  readClaimKeys: (userId: string) => Promise<string[]>;
  cityTimezone: (cityId: string) => string | null;
  claim: (
    userId: string,
    key: string,
    report: PierCastReviewOutlookResponse,
  ) => Promise<unknown>;
  now?: () => Date;
}) {
  return async (userId: string, free: boolean, cityId: string) => {
    const claimKeys = free ? await deps.readClaimKeys(userId) : [];
    const timezone = deps.cityTimezone(cityId);
    if (!timezone) {
      throw new PierCastAccessError(
        "city_unavailable",
        "This city is not publicly available yet.",
        404,
      );
    }
    const localDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(deps.now?.() ?? new Date());
    const key = `${cityId}:${localDate}`;
    if (claimKeys.length >= 4 && !claimKeys.includes(key)) {
      throw new PierCastAccessError(
        "subscription_required",
        "Your four free PierCast reports have been used. Upgrade for another report.",
        403,
      );
    }
    const outlook = await deps.readOutlook();
    if (
      !outlook ||
      (outlook.formulaVersion !==
          "piercast-opportunity-modes-bounded-temperature-v3" &&
        !outlook.dailyScoreSnapshot)
    ) {
      throw new PierCastAccessError(
        "report_unavailable",
        "Today's report is not ready yet.",
        503,
      );
    }
    const report = cityReportOnly(outlook, cityId);
    if (report.cities[0]?.dates[0]?.localDate !== localDate) {
      throw new PierCastAccessError(
        "report_unavailable",
        "Today's report is not ready yet.",
        503,
      );
    }
    return free ? await deps.claim(userId, key, report) : report;
  };
}
