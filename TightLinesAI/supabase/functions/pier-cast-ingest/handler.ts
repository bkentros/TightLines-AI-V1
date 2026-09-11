import type {
  PierCastDailyScoreSnapshotCommitSummary,
  PierCastObservationIngestionSummary,
  PierCastShadowForecastCommitSummary,
  PierCastTemperatureIngestionOutcome,
} from "../_shared/pierCastEngine/index.ts";

const INTERNAL_KEY_HEADER = "x-pier-cast-internal-key";

export type PierCastIngestHandlerDependencies = {
  internalSecret: string | null;
  ingest: () => Promise<PierCastTemperatureIngestionOutcome>;
  ingestObservations?: () => Promise<PierCastObservationIngestionSummary>;
  archiveShadowForecast?: (
    outcome: Exclude<
      PierCastTemperatureIngestionOutcome,
      { status: "unavailable" }
    >,
  ) => Promise<PierCastShadowForecastCommitSummary>;
  archiveDailyScoreSnapshot?: (
    outcome: Extract<
      PierCastTemperatureIngestionOutcome,
      { status: "live_committed" }
    >,
  ) => Promise<PierCastDailyScoreSnapshotCommitSummary>;
};

export function createPierCastIngestHandler(
  dependencies: PierCastIngestHandlerDependencies,
): (request: Request) => Promise<Response> {
  return async (request) => {
    if (request.method !== "POST") {
      return json({ error: "method_not_allowed" }, 405);
    }
    const secret = dependencies.internalSecret;
    if (!secret || secret.trim().length < 16) {
      return json({ error: "pier_cast_ingest_misconfigured" }, 500);
    }
    const suppliedSecret = request.headers.get(INTERNAL_KEY_HEADER);
    if (!suppliedSecret || !constantTimeEqual(suppliedSecret, secret)) {
      return json({ error: "pier_cast_ingest_forbidden" }, 403);
    }

    const observationPromise = dependencies.ingestObservations?.();
    let outcome: PierCastTemperatureIngestionOutcome;
    try {
      outcome = await dependencies.ingest();
    } catch {
      const calibrationObservations = await settleObservations(
        observationPromise,
      );
      return json(
        { error: "pier_cast_ingest_failed", calibrationObservations },
        503,
      );
    }
    const calibrationObservations = await settleObservations(
      observationPromise,
    );
    if (outcome.status === "unavailable") {
      return json({
        status: outcome.status,
        source: outcome.source,
        fallbackUsed: outcome.fallbackUsed,
        diagnostics: outcome.diagnostics,
        calibrationObservations,
        shadowForecast: null,
        dailyScoreSnapshot: null,
      }, 503);
    }

    const [shadowForecast, dailyScoreSnapshot] = await Promise.all([
      settleShadowForecast(dependencies.archiveShadowForecast, outcome),
      outcome.status === "live_committed"
        ? settleDailyScoreSnapshot(
          dependencies.archiveDailyScoreSnapshot,
          outcome,
        )
        : Promise.resolve(null),
    ]);

    return json({
      status: outcome.status,
      source: outcome.source,
      fallbackUsed: outcome.fallbackUsed,
      issuedAt: outcome.batch.issuedAt,
      fetchedAt: outcome.batch.fetchedAt,
      cycleAgeHours: outcome.batch.cycleAgeHours,
      cityCount: outcome.batch.cities.length,
      sampleCount: outcome.batch.cities.reduce(
        (sum, city) => sum + city.samples.length,
        0,
      ),
      diagnostics: outcome.diagnostics,
      calibrationObservations,
      shadowForecast,
      dailyScoreSnapshot,
    });
  };
}

type PierCastDailyScoreSnapshotResult =
  | PierCastDailyScoreSnapshotCommitSummary
  | {
    status: "unavailable";
    lakeDate: null;
    setAt: null;
    publishAt: null;
    cityCount: 0;
    diagnostics: string[];
  };

async function settleDailyScoreSnapshot(
  archive: PierCastIngestHandlerDependencies["archiveDailyScoreSnapshot"],
  outcome: Extract<
    PierCastTemperatureIngestionOutcome,
    { status: "live_committed" }
  >,
): Promise<PierCastDailyScoreSnapshotResult | null> {
  if (!archive) return null;
  try {
    return await archive(outcome);
  } catch (error) {
    return {
      status: "unavailable",
      lakeDate: null,
      setAt: null,
      publishAt: null,
      cityCount: 0,
      diagnostics: [
        `daily_score_snapshot_archive_failed:${
          error instanceof Error ? error.message : String(error)
        }`,
      ],
    };
  }
}

type PierCastShadowForecastResult = PierCastShadowForecastCommitSummary | {
  status: "unavailable";
  runId: null;
  generatedAt: null;
  forecastCount: 0;
  diagnostics: string[];
};

async function settleShadowForecast(
  archive: PierCastIngestHandlerDependencies["archiveShadowForecast"],
  outcome: Exclude<
    PierCastTemperatureIngestionOutcome,
    { status: "unavailable" }
  >,
): Promise<PierCastShadowForecastResult | null> {
  if (!archive) return null;
  try {
    return await archive(outcome);
  } catch (error) {
    return {
      status: "unavailable",
      runId: null,
      generatedAt: null,
      forecastCount: 0,
      diagnostics: [
        `shadow_forecast_archive_failed:${
          error instanceof Error ? error.message : String(error)
        }`,
      ],
    };
  }
}

async function settleObservations(
  promise: Promise<PierCastObservationIngestionSummary> | undefined,
): Promise<PierCastObservationIngestionSummary | null> {
  if (!promise) return null;
  try {
    return await promise;
  } catch (error) {
    return {
      status: "unavailable",
      requestedSourceCount: 0,
      successfulSourceCount: 0,
      committedRecordCount: 0,
      usableRecordCount: 0,
      rejectedRecordCount: 0,
      diagnostics: [
        `observation_ingestion_failed:${
          error instanceof Error ? error.message : String(error)
        }`,
      ],
      sources: [],
    };
  }
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

function constantTimeEqual(left: string, right: string): boolean {
  const length = Math.max(left.length, right.length);
  let difference = left.length ^ right.length;
  for (let index = 0; index < length; index += 1) {
    difference |= (left.charCodeAt(index) || 0) ^
      (right.charCodeAt(index) || 0);
  }
  return difference === 0;
}
