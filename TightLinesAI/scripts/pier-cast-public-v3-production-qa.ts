import {
  buildPierCastV3ReviewOutlook,
  combinePierCastV3LmhofsBatches,
  type PierCastArchiveClient,
  readLatestCoherentPierCastV3SourceCohorts,
} from "../supabase/functions/_shared/pierCastEngine/index.ts";
import { projectPublicV3Outlook } from "../supabase/functions/pier-cast/publicV3.ts";
import { PIER_CAST_PUBLIC_V3_RELEASE } from "../supabase/functions/_shared/pierCastEngine/config/publicV3Release.ts";
import {
  cityReportOnly,
  leaderboardOnly,
} from "../supabase/functions/pier-cast/reportAccess.ts";

const base = Deno.env.get("SUPABASE_URL")?.replace(/\/+$/, "");
const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
if (!base || !key) {
  throw new Error("Supabase production configuration is required.");
}

const database: PierCastArchiveClient = {
  rpc: async (name, args) => {
    const response = await fetch(`${base}/rest/v1/rpc/${name}`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
    });
    const data = await response.json();
    return response.ok ? { data, error: null } : {
      data: null,
      error: { message: data?.message ?? `${name}: ${response.status}` },
    };
  },
};

const now = new Date();
const cohorts = await readLatestCoherentPierCastV3SourceCohorts({
  database,
  now,
  maxAgeHours: 13,
});
if (!cohorts) {
  throw new Error("No complete matching public cycle within 13 hours.");
}

const review = buildPierCastV3ReviewOutlook({
  batch: combinePierCastV3LmhofsBatches(
    cohorts.primary,
    cohorts.expansion,
    cohorts.lakeHuron,
    cohorts.fiveCity,
    cohorts.chicagoAlpena,
  ),
  evaluationTime: now.toISOString(),
});
const outlook = projectPublicV3Outlook(review);
const leaderboard = leaderboardOnly(outlook, {
  maxCities: PIER_CAST_PUBLIC_V3_RELEASE.cityIds.length,
  releasePolicyVersion: outlook.releasePolicyVersion,
});

if (leaderboard.cities.length !== PIER_CAST_PUBLIC_V3_RELEASE.cityIds.length) {
  throw new Error(
    `Public leaderboard returned ${leaderboard.cities.length} cities.`,
  );
}
for (
  const cityId of [
    ...PIER_CAST_PUBLIC_V3_RELEASE.cityIds,
  ]
) {
  if (!outlook.cities.some((city) => city.cityId === cityId)) {
    throw new Error(`Public outlook is missing ${cityId}.`);
  }
  if (!leaderboard.cities.some((city) => city.cityId === cityId)) {
    throw new Error(`Public leaderboard is missing ${cityId}.`);
  }
}
for (const city of outlook.cities) {
  const report = cityReportOnly(outlook, city.cityId);
  if (report.cities.length !== 1 || report.cities[0].dates.length !== 5) {
    throw new Error(
      `${city.cityId} did not produce one complete five-day report.`,
    );
  }
}

console.log(
  `PASS: public v3 projection yields ${PIER_CAST_PUBLIC_V3_RELEASE.cityIds.length} ranked cities and complete five-day reports from ${cohorts.issuedAt} (${
    review.source.cycleAgeHours.toFixed(1)
  } hours old).`,
);
for (const city of leaderboard.cities) {
  const date = city.dates[0];
  const modelDate = review.cities.find((candidate) =>
    candidate.cityId === city.cityId
  )?.dates[0];
  const projectedSpecies = date?.headline.drivingSpeciesId ?? "none";
  const modelSpecies = modelDate?.headline.drivingSpeciesId ?? "none";
  const modelScore = modelDate?.headline.overall;
  const projectedScore = date?.headline.overall;
  const projectionNote = projectedSpecies === modelSpecies
    ? ""
    : ` (model top: ${
      modelScore?.status === "available"
        ? modelScore.displayScore.toFixed(1)
        : "unavailable"
    } ${modelSpecies})`;
  console.log(
    `${city.cityId}: ${
      projectedScore?.status === "available"
        ? projectedScore.displayScore.toFixed(1)
        : "unavailable"
    } ${projectedSpecies}${projectionNote}`,
  );
}
