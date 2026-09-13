import { PIER_CAST_RESEARCH_DISCLOSURE, PIER_CAST_PUBLIC_RELEASE } from "../_shared/pierCastEngine/config/publicRelease.ts";
import type { PierCastReviewOutlookResponse } from "../_shared/pierCastEngine/index.ts";

export class PierCastAccessError extends Error {
  constructor(readonly code: string, message: string, readonly status: number) {
    super(message);
  }
}
export function leaderboardOnly(
  outlook: Pick<
    PierCastReviewOutlookResponse,
    "generatedAt" | "dailyScoreSnapshot" | "cities"
  >,
) {
  const cities = outlook.cities.map((city) => ({
    cityId: city.cityId,
    dates: city.dates.slice(0, 1).map((date) => ({
      localDate: date.localDate,
      headline: date.headline,
    })),
  })).sort((a, b) =>
    (b.dates[0]?.headline.overall.score ?? -1) -
      (a.dates[0]?.headline.overall.score ?? -1) ||
    a.cityId.localeCompare(b.cityId)
  ).slice(0, 5);
  const snapshot = outlook.dailyScoreSnapshot;
  return {
    generatedAt: outlook.generatedAt,
    disclosure: PIER_CAST_RESEARCH_DISCLOSURE,
    releasePolicyVersion: PIER_CAST_PUBLIC_RELEASE.version,
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
    cities: [report],
    ...(outlook.dailyScoreSnapshot
      ? {
        dailyScoreSnapshot: {
          ...outlook.dailyScoreSnapshot,
          cities: outlook.dailyScoreSnapshot.cities.filter((c) =>
            c.cityId === cityId
          ),
        },
      }
      : {}),
  };
}

export function createPierReportAccess(deps: {
  readOutlook: () => Promise<PierCastReviewOutlookResponse | null>;
  readPrior: (userId: string) => Promise<{ report_key: string } | null>;
  cityTimezone: (cityId: string) => string | null;
  claim: (
    userId: string,
    key: string,
    report: PierCastReviewOutlookResponse,
  ) => Promise<unknown>;
  now?: () => Date;
}) {
  return async (userId: string, free: boolean, cityId: string) => {
    const prior = free ? await deps.readPrior(userId) : null;
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
    if (prior && prior.report_key !== key) {
      throw new PierCastAccessError(
        "subscription_required",
        "Your free PierCast report has been used. Upgrade for another report.",
        403,
      );
    }
    const outlook = await deps.readOutlook();
    if (!outlook?.dailyScoreSnapshot) {
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
