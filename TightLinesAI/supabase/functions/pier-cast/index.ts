import { PIER_CAST_LEGACY_ROSTER_VERSION } from "../_shared/pierCastEngine/config/privateCalibration.ts";
import {
  isPierCastResearchRoster,
  PIER_CAST_PUBLIC_RELEASE,
  PIER_CAST_RESEARCH_DETAIL,
  PIER_CAST_RESEARCH_DISCLOSURE,
} from "../_shared/pierCastEngine/config/publicRelease.ts";
import {
  createPierReportAccess,
  leaderboardOnly,
  PierCastAccessError,
} from "./reportAccess.ts";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  isAdminEmail,
  resolveServerSubscriptionTier,
} from "../_shared/appAccess.ts";
import {
  applyPierCastDailyScoreSnapshot,
  buildPierCastCatalog,
  buildPierCastReviewOutlook,
  buildPierCastWisconsinReviewOutlook,
  PIER_CAST_ENGINE_VERSION,
  PIER_CAST_FORMULA_VERSION,
  type PierCastArchiveClient,
  type PierCastShadowOutcomeRead,
  readLatestFreshPierCastLmhofsBatch,
  readLatestFreshPierCastWisconsinLmhofsBatch,
  readPublishedPierCastDailyScoreSnapshot,
  recordPierCastShadowOutcome,
  withholdPierCastCurrentDayScores,
} from "../_shared/pierCastEngine/index.ts";
import { createPierCastHandler } from "./handler.ts";

const database = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

const archiveClient: PierCastArchiveClient = {
  rpc: async (functionName, arguments_) => {
    const { data, error } = await database.rpc(functionName, arguments_);
    return {
      data,
      error: error ? { message: error.message } : null,
    };
  },
};

async function readOutlook() {
  const now = new Date();
  const [batch, dailyScoreSnapshot] = await Promise.all([
    readLatestFreshPierCastLmhofsBatch(archiveClient, now),
    readPublishedPierCastDailyScoreSnapshot(archiveClient, now),
  ]);
  if (!batch) return null;
  const liveOutlook = buildPierCastReviewOutlook({
    batch,
    evaluationTime: now.toISOString(),
  });
  return dailyScoreSnapshot
    ? applyPierCastDailyScoreSnapshot(liveOutlook, dailyScoreSnapshot)
    : withholdPierCastCurrentDayScores(liveOutlook);
}
async function readExpansionOutlook() {
  const now = new Date();
  const batch = await readLatestFreshPierCastWisconsinLmhofsBatch(
    archiveClient,
    now,
  );
  return batch
    ? buildPierCastWisconsinReviewOutlook({
      batch,
      evaluationTime: now.toISOString(),
    })
    : null;
}
async function account(request: Request) {
  const token = request.headers.get("x-user-token") ??
    request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) {
    throw new PierCastAccessError(
      "unauthorized",
      "Sign in to use PierCast.",
      401,
    );
  }
  const { data: { user }, error } = await database.auth.getUser(token);
  if (error || !user) {
    throw new PierCastAccessError(
      "unauthorized",
      "Sign in to use PierCast.",
      401,
    );
  }
  const { data: profile, error: profileError } = await database.from("profiles")
    .select("subscription_tier").eq("id", user.id).single();
  if (profileError || !profile) throw new Error("Profile unavailable");
  return {
    userId: user.id,
    free:
      resolveServerSubscriptionTier(profile.subscription_tier, user.email) ===
        "free",
  };
}
async function readPublicOutlook() {
  const released = buildPierCastCatalog("public").cities;
  if (!released.length) return null;
  const outlook = await readOutlook();
  if (!outlook) return null;
  const allowed = new Set(
    released.filter((city) => {
      const report = outlook.cities.find((c) => c.cityId === city.cityId);
      return !!report && report.dates.every((date) =>
        isPierCastResearchRoster(
          city.cityId,
          date.species.map((s) => s.speciesId),
          outlook.dailyScoreSnapshot?.cities.some((row) =>
              row.cityId === city.cityId &&
              row.date.localDate === date.localDate
            )
            ? outlook.dailyScoreSnapshot.speciesRosterVersion ??
              PIER_CAST_LEGACY_ROSTER_VERSION
            : PIER_CAST_PUBLIC_RELEASE.rosterVersion,
        )
      );
    }).map((city) => city.cityId),
  );
  return {
    ...outlook,
    mode: "public_research" as const,
    previewOnly: false,
    releasePolicyVersion: PIER_CAST_PUBLIC_RELEASE.version,
    disclosure: `${PIER_CAST_RESEARCH_DISCLOSURE} ${PIER_CAST_RESEARCH_DETAIL}`,
    cities: outlook.cities.filter((city) => allowed.has(city.cityId)),
    ...(outlook.dailyScoreSnapshot
      ? {
        dailyScoreSnapshot: {
          ...outlook.dailyScoreSnapshot,
          cities: outlook.dailyScoreSnapshot.cities.filter((city) =>
            allowed.has(city.cityId)
          ),
        },
      }
      : {}),
  };
}

const readReport = createPierReportAccess({
  readOutlook: readPublicOutlook,
  cityTimezone: (cityId) =>
    buildPierCastCatalog("public").cities.find((c) => c.cityId === cityId)
      ?.timezone ?? null,
  readPrior: async (userId) => {
    const { data, error } = await database.from("feature_report_trials").select(
      "report_key",
    ).eq("user_id", userId).eq("feature", "pier_cast").maybeSingle();
    if (error) throw new Error("Trial lookup failed");
    return data;
  },
  claim: async (userId, key, report) => {
    const { data, error } = await database.rpc("claim_feature_report_trial", {
      p_user_id: userId,
      p_feature: "pier_cast",
      p_report_key: key,
      p_envelope: report,
    });
    if (error?.message === "subscription_required") {
      throw new PierCastAccessError(
        "subscription_required",
        "Your free PierCast report has been used. Upgrade for another report.",
        403,
      );
    }
    if (error) throw new Error("Trial claim failed");
    return data;
  },
});

const handler = createPierCastHandler({
  readLeaderboard: async () => {
    const released = buildPierCastCatalog("public").cities;
    if (!released.length) return null;
    const snapshot = await readPublishedPierCastDailyScoreSnapshot(
      archiveClient,
      new Date(),
    );
    if (!snapshot) return null;
    // Reading the locked leaderboard never depends on a fresh conditions cycle or a trial claim.
    const cities = snapshot.cities.flatMap((row) => {
      const city = released.find((c) => c.cityId === row.cityId);
      if (
        !city ||
        !isPierCastResearchRoster(
          row.cityId,
          row.date.species.map((s) => s.speciesId),
          snapshot.speciesRosterVersion ?? PIER_CAST_LEGACY_ROSTER_VERSION,
        )
      ) return [];
      return [{
        cityId: row.cityId,
        displayName: city.displayName,
        timezone: city.timezone,
        representationDecision: "blocked_insufficient_evidence" as const,
        temperatureTimeline: [],
        dates: [row.date],
      }];
    });
    return leaderboardOnly({
      generatedAt: snapshot.setAt,
      dailyScoreSnapshot: snapshot,
      cities,
    });
  },
  readSavedReport: async (request) => {
    const { userId } = await account(request);
    const { data, error } = await database.from("feature_report_trials").select(
      "envelope",
    ).eq("user_id", userId).eq("feature", "pier_cast").maybeSingle();
    if (error) throw new Error("Trial lookup failed");
    return { report: data?.envelope ?? null };
  },
  readCityReport: async (request, cityId) => {
    const { userId, free } = await account(request);
    return await readReport(userId, free, cityId);
  },
  authorizeReview: async (request) => {
    const token = request.headers.get("x-user-token") ??
      request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
    if (!token) return false;
    const { data: { user }, error } = await database.auth.getUser(token);
    return !error && !!user && isAdminEmail(user.email);
  },
  readReviewOutlook: readOutlook,
  readExpansionReviewOutlook: readExpansionOutlook,
  readShadowReview: async () => {
    const [
      runs,
      forecasts,
      expansionRuns,
      expansionForecasts,
      outcomes,
      pairs,
      latestRun,
      latestExpansionRun,
      recentOutcomes,
    ] = await Promise.all([
      database.from("pier_cast_shadow_forecast_runs").select("run_id", {
        count: "exact",
        head: true,
      }),
      database.from("pier_cast_shadow_forecasts").select("run_id", {
        count: "exact",
        head: true,
      }),
      database.from("pier_cast_expansion_shadow_forecast_runs").select(
        "run_id",
        { count: "exact", head: true },
      ),
      database.from("pier_cast_expansion_shadow_forecasts").select("run_id", {
        count: "exact",
        head: true,
      }),
      database.from("pier_cast_shadow_outcomes").select("outcome_id", {
        count: "exact",
        head: true,
      }),
      database.from("pier_cast_shadow_validation_pairs").select(
        "outcome_id",
        {
          count: "exact",
          head: true,
        },
      ),
      database.from("pier_cast_shadow_forecast_runs").select(
        "run_id,generated_at,source_issued_at,engine_version,formula_version,forecast_count,created_at",
      ).eq("engine_version", PIER_CAST_ENGINE_VERSION).eq(
        "formula_version",
        PIER_CAST_FORMULA_VERSION,
      ).order("created_at", { ascending: false }).limit(1),
      database.from("pier_cast_expansion_shadow_forecast_runs").select(
        "run_id,generated_at,source_issued_at,engine_version,formula_version,forecast_count,created_at",
      ).eq("engine_version", PIER_CAST_ENGINE_VERSION).eq(
        "formula_version",
        PIER_CAST_FORMULA_VERSION,
      ).order("created_at", { ascending: false }).limit(1),
      database.from("pier_cast_shadow_outcomes").select(
        "outcome_id,dedupe_key,city_id,species_id,local_date,structure_name,observed_at,assessment_status,result,effort_minutes,catch_count,source_type,evidence_quality,source_reference,notes,created_at",
      ).order("created_at", { ascending: false }).limit(20),
    ]);
    for (
      const result of [
        runs,
        forecasts,
        expansionRuns,
        expansionForecasts,
        outcomes,
        pairs,
        latestRun,
        latestExpansionRun,
        recentOutcomes,
      ]
    ) {
      if (result.error) throw new Error(result.error.message);
    }
    const productionLatest = latestRun.data?.[0] as
      | Record<string, unknown>
      | undefined;
    const expansionLatest = latestExpansionRun.data?.[0] as
      | Record<string, unknown>
      | undefined;
    const latestIsExpansion = Boolean(
      expansionLatest &&
        (!productionLatest ||
          Date.parse(String(expansionLatest.created_at)) >
            Date.parse(String(productionLatest.created_at))),
    );
    const latest = latestIsExpansion ? expansionLatest : productionLatest;
    const candidateRows = latest
      ? await database.from(
        latestIsExpansion
          ? "pier_cast_expansion_shadow_forecasts"
          : "pier_cast_shadow_forecasts",
      ).select(
        "city_id,species_id,local_date,seasonal_rating,display_score,score_status",
      ).eq("run_id", String(latest.run_id)).eq("lead_day", 0).limit(20)
      : { data: [], error: null };
    if (candidateRows.error) throw new Error(candidateRows.error.message);
    const candidates = (candidateRows.data ?? []) as Record<
      string,
      unknown
    >[];
    const recent = (recentOutcomes.data ?? []) as Record<string, unknown>[];
    return {
      status: "private_shadow_validation" as const,
      runCount: (runs.count ?? 0) + (expansionRuns.count ?? 0),
      forecastCount: (forecasts.count ?? 0) +
        (expansionForecasts.count ?? 0),
      outcomeCount: outcomes.count ?? 0,
      pairedForecastCount: pairs.count ?? 0,
      latestRun: latest
        ? {
          runId: String(latest.run_id),
          generatedAt: String(latest.generated_at),
          sourceIssuedAt: String(latest.source_issued_at),
          engineVersion: String(latest.engine_version),
          formulaVersion: String(
            latest.formula_version,
          ) as "seasonal-opportunity-bounded-temperature-v2",
          forecastCount: Number(latest.forecast_count),
        }
        : null,
      outcomeCandidates: candidates.map((row) => ({
        cityId: String(row.city_id) as PierCastShadowOutcomeRead["cityId"],
        speciesId: String(
          row.species_id,
        ) as PierCastShadowOutcomeRead["speciesId"],
        localDate: String(row.local_date),
        seasonalRating: row.seasonal_rating === null
          ? null
          : Number(row.seasonal_rating),
        displayScore: row.display_score === null
          ? null
          : Number(row.display_score),
        scoreStatus: String(row.score_status) as "available" | "unavailable",
      })),
      recentOutcomes: recent.map(mapShadowOutcome),
    };
  },
  recordShadowOutcome: (outcome) =>
    recordPierCastShadowOutcome(archiveClient, outcome),
});

Deno.serve(handler);

function mapShadowOutcome(
  row: Record<string, unknown>,
): PierCastShadowOutcomeRead {
  return {
    outcomeId: String(row.outcome_id),
    dedupeKey: String(row.dedupe_key),
    cityId: String(row.city_id) as PierCastShadowOutcomeRead["cityId"],
    speciesId: String(row.species_id) as PierCastShadowOutcomeRead["speciesId"],
    localDate: String(row.local_date),
    structureName: String(row.structure_name),
    observedAt: row.observed_at === null ? null : String(row.observed_at),
    assessmentStatus: String(
      row.assessment_status,
    ) as PierCastShadowOutcomeRead["assessmentStatus"],
    result: String(row.result) as PierCastShadowOutcomeRead["result"],
    effortMinutes: row.effort_minutes === null
      ? null
      : Number(row.effort_minutes),
    catchCount: row.catch_count === null ? null : Number(row.catch_count),
    sourceType: String(
      row.source_type,
    ) as PierCastShadowOutcomeRead["sourceType"],
    evidenceQuality: String(
      row.evidence_quality,
    ) as PierCastShadowOutcomeRead["evidenceQuality"],
    sourceReference: row.source_reference === null
      ? null
      : String(row.source_reference),
    notes: row.notes === null ? null : String(row.notes),
    createdAt: String(row.created_at),
  };
}
