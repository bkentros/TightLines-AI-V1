import type {
  PierCastDailyScoreSnapshotCommitSummary,
  PierCastFieldTemperatureInput,
  PierCastFieldTemperatureRecord,
  PierCastObservationIngestionSummary,
  PierCastShadowForecastCommitSummary,
  PierCastTemperatureIngestionOutcome,
} from "../_shared/pierCastEngine/index.ts";

const INTERNAL_KEY_HEADER = "x-pier-cast-internal-key";
const OPERATION_HEADER = "x-pier-cast-operation";

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
  validateFieldObservation?: (
    input: PierCastFieldTemperatureInput,
  ) => PierCastFieldTemperatureRecord;
  archiveFieldObservations?: (
    records: readonly PierCastFieldTemperatureRecord[],
  ) => Promise<number>;
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

    const operation = request.headers.get(OPERATION_HEADER);
    if (operation === "field-temperature") {
      return await handleFieldTemperature(request, dependencies);
    }
    if (operation) return json({ error: "pier_cast_operation_invalid" }, 400);

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

async function handleFieldTemperature(
  request: Request,
  dependencies: PierCastIngestHandlerDependencies,
): Promise<Response> {
  if (
    !dependencies.validateFieldObservation ||
    !dependencies.archiveFieldObservations
  ) {
    return json({ error: "pier_cast_field_ingest_misconfigured" }, 500);
  }
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > 1_000_000) {
    return json({ error: "pier_cast_field_batch_too_large" }, 413);
  }
  let body: unknown;
  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > 1_000_000) {
      return json({ error: "pier_cast_field_batch_too_large" }, 413);
    }
    body = JSON.parse(rawBody);
  } catch {
    return json({ error: "pier_cast_field_payload_invalid" }, 400);
  }
  if (
    !body || typeof body !== "object" ||
    !Array.isArray((body as { records?: unknown }).records)
  ) {
    return json({ error: "pier_cast_field_payload_invalid" }, 400);
  }
  const inputs = (body as { records: unknown[] }).records;
  if (inputs.length === 0 || inputs.length > 1000) {
    return json({ error: "pier_cast_field_payload_invalid" }, 400);
  }

  let records: PierCastFieldTemperatureRecord[];
  try {
    records = inputs.map((record) =>
      dependencies.validateFieldObservation!(
        record as PierCastFieldTemperatureInput,
      )
    );
  } catch {
    return json({ error: "pier_cast_field_payload_invalid" }, 400);
  }
  try {
    const committedRecordCount = await dependencies.archiveFieldObservations(
      records,
    );
    return json({
      status: "committed",
      committedRecordCount,
      usableRecordCount: records.filter((record) =>
        record.recordStatus === "usable"
      ).length,
      rejectedRecordCount: records.filter((record) =>
        record.recordStatus === "rejected"
      ).length,
      protocolVersion: records[0].protocolVersion,
    });
  } catch {
    return json({ error: "pier_cast_field_archive_failed" }, 503);
  }
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
