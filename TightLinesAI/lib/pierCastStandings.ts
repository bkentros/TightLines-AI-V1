import type {
  PierCastLeaderboardResponse,
  PierCastReviewOutlookResponse,
} from "./pierCastContracts";

/** Build a headline-only owner leaderboard without weakening public isolation. */
export function projectPierCastStandings(
  outlook: PierCastReviewOutlookResponse | PierCastLeaderboardResponse,
  supplementalOutlooks: readonly PierCastReviewOutlookResponse[] = [],
): PierCastLeaderboardResponse {
  // Public callers already receive the server's release-filtered projection.
  // Supplemental shadow data is intentionally ignored for that contract.
  if (!("mode" in outlook)) return outlook;

  const snapshot = outlook.dailyScoreSnapshot;
  const cities = new Map<
    string,
    PierCastLeaderboardResponse["cities"][number]
  >();
  const addCity = (
    cityId: string,
    date: PierCastReviewOutlookResponse["cities"][number]["dates"][number]
      | undefined,
  ) => {
    if (!date) return;
    cities.set(cityId, {
      cityId,
      dates: [{ localDate: date.localDate, headline: date.headline }],
    });
  };

  // Released cities use their immutable daily scores whenever available.
  if (snapshot) {
    snapshot.cities.forEach(({ cityId, date }) => addCity(cityId, date));
  } else {
    outlook.cities.forEach((city) => addCity(city.cityId, city.dates[0]));
  }
  // Owner-only shadow cities use their latest complete review outlook.
  supplementalOutlooks.forEach((supplemental) => {
    supplemental.cities.forEach((city) =>
      addCity(city.cityId, city.dates[0])
    );
  });

  return {
    generatedAt: supplementalOutlooks.reduce(
      (latest, supplemental) =>
        Date.parse(supplemental.generatedAt) > Date.parse(latest)
          ? supplemental.generatedAt
          : latest,
      snapshot?.setAt ?? outlook.generatedAt,
    ),
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
    cities: [...cities.values()],
  };
}
