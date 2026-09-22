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
  buildPierCastV3ReviewOutlook,
  buildPierCastWisconsinReviewOutlook,
  combinePierCastV3LmhofsBatches,
  PIER_CAST_ENGINE_VERSION,
  PIER_CAST_FORMULA_VERSION,
  type PierCastArchiveClient,
  type PierCastShadowOutcomeRead,
  readLatestCoherentPierCastV3SourceCohorts,
  readLatestFreshPierCastLmhofsBatch,
  readLatestFreshPierCastWisconsinLmhofsBatch,
  readPublishedPierCastDailyScoreSnapshot,
  recordPierCastShadowOutcome,
  withholdPierCastCurrentDayScores,
} from "../_shared/pierCastEngine/index.ts";
import { createPierCastHandler } from "./handler.ts";
import { projectPublicV3Outlook } from "./publicV3.ts";
import { PIER_CAST_PUBLIC_V3_RELEASE } from "../_shared/pierCastEngine/config/publicV3Release.ts";

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

// The public release uses the reviewed v3 roster for every account.
const publicCatalog = () => buildPierCastCatalog("public", "v3");

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
async function readV3Outlook(maxAgeHours = 24) {
  const now = new Date();
  const cohorts = await readLatestCoherentPierCastV3SourceCohorts({
    database: archiveClient,
    now,
    // Owner-only research previews can display a complete older cycle during
    // a short NOAA outage. Public reports retain their 13-hour freshness gate.
    maxAgeHours,
  });
  if (!cohorts) return null;
  const batch = combinePierCastV3LmhofsBatches(
    cohorts.primary,
    cohorts.expansion,
    cohorts.lakeHuron,
    cohorts.fiveCity,
    cohorts.chicagoAlpena,
    cohorts.stJosephHarrisville,
    cohorts.pentwaterCaseville,
  );
  return buildPierCastV3ReviewOutlook({
    batch,
    evaluationTime: now.toISOString(),
  });
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
  const outlook = await readV3Outlook(13);
  return outlook ? projectPublicV3Outlook(outlook) : null;
}

const readReport = createPierReportAccess({
  readOutlook: readPublicOutlook,
  cityTimezone: (cityId) =>
    publicCatalog().cities.find((c) =>
      c.cityId === cityId && c.releaseStatus === "public_research"
    )
      ?.timezone ?? null,
  readClaimKeys: async (userId) => {
    const { data, error } = await database.from("pier_cast_report_claims")
      .select(
        "report_key",
      ).eq("user_id", userId);
    if (error) throw new Error("Trial lookup failed");
    return (data ?? []).map((row) => row.report_key);
  },
  claim: async (userId, key, report) => {
    const { data, error } = await database.rpc("claim_pier_cast_report", {
      p_user_id: userId,
      p_report_key: key,
      p_envelope: report,
    });
    if (error?.message === "subscription_required") {
      throw new PierCastAccessError(
        "subscription_required",
        "Your four free PierCast reports have been used. Upgrade for another report.",
        403,
      );
    }
    if (error) throw new Error("Trial claim failed");
    return data;
  },
});

const handler = createPierCastHandler({
  readPublicCatalog: publicCatalog,
  readLeaderboard: async () => {
    const outlook = await readPublicOutlook();
    return outlook
      ? leaderboardOnly(outlook, {
        maxCities: PIER_CAST_PUBLIC_V3_RELEASE.cityIds.length,
        releasePolicyVersion: outlook.releasePolicyVersion,
      })
      : null;
  },
  readSavedReport: async (request) => {
    const { userId } = await account(request);
    const { data, error } = await database.from("pier_cast_report_claims")
      .select(
        "envelope",
      ).eq("user_id", userId).order("used_at", { ascending: false }).limit(1)
      .maybeSingle();
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
  readV3ReviewOutlook: () => readV3Outlook(),
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
