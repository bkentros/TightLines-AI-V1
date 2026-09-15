import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  archivePierCastDailyScoreSnapshot,
  archivePierCastFieldTemperatureObservations,
  archivePierCastPortWashingtonShadowForecast,
  archivePierCastShadowForecast,
  archivePierCastV3ShadowForecast,
  archivePierCastWisconsinShadowForecast,
  buildPierCastDailyScoreSnapshot,
  buildPierCastPortWashingtonReviewOutlook,
  buildPierCastReviewOutlook,
  buildPierCastV3ReviewOutlook,
  buildPierCastWisconsinReviewOutlook,
  combinePierCastV3LmhofsBatches,
  ingestPierCastCalibrationObservations,
  ingestPierCastPortWashingtonShadowCycle,
  ingestPierCastTemperatureCycle,
  ingestPierCastWisconsinShadowCycle,
  PIER_CAST_BASELINE_FORMULA_VERSION,
  PIER_CAST_ENGINE_VERSION,
  PIER_CAST_V3_ENGINE_VERSION,
  type PierCastArchiveClient,
  pierCastDailyScoreLakeDateForCycle,
  readLatestFreshPierCastLmhofsBatch,
  readLatestFreshPierCastWisconsinLmhofsBatch,
  validatePierCastFieldTemperatureObservation,
} from "../_shared/pierCastEngine/index.ts";
import { createPierCastIngestHandler } from "./handler.ts";

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

const handler = createPierCastIngestHandler({
  internalSecret: Deno.env.get("PIER_CAST_INTERNAL_KEY") ?? null,
  ingest: () =>
    ingestPierCastTemperatureCycle({
      database: archiveClient,
      engineVersion: PIER_CAST_ENGINE_VERSION,
    }),
  ingestObservations: () =>
    ingestPierCastCalibrationObservations({
      database: archiveClient,
    }),
  validateFieldObservation: (input) =>
    validatePierCastFieldTemperatureObservation(input),
  archiveFieldObservations: (records) =>
    archivePierCastFieldTemperatureObservations(archiveClient, records),
  archiveShadowForecast: async (outcome) => {
    const evaluationTime = new Date().toISOString();
    const activeOutlook = buildPierCastReviewOutlook({
      batch: outcome.batch,
      evaluationTime,
    });
    const baselineOutlook = buildPierCastReviewOutlook({
      batch: outcome.batch,
      evaluationTime,
      formulaVersion: PIER_CAST_BASELINE_FORMULA_VERSION,
    });
    const active = await archivePierCastShadowForecast({
      database: archiveClient,
      outlook: activeOutlook,
      batch: outcome.batch,
      ingestionSource: outcome.source,
      engineVersion: PIER_CAST_ENGINE_VERSION,
    });
    const comparator = await archivePierCastShadowForecast({
      database: archiveClient,
      outlook: baselineOutlook,
      batch: outcome.batch,
      ingestionSource: outcome.source,
      engineVersion: PIER_CAST_ENGINE_VERSION,
    });
    return { ...active, comparator };
  },
  archiveDailyScoreSnapshot: async (outcome) => {
    const generatedAt = new Date().toISOString();
    const snapshot = buildPierCastDailyScoreSnapshot({
      batch: outcome.batch,
      lakeDate: pierCastDailyScoreLakeDateForCycle(outcome.batch.issuedAt),
      generatedAt,
      engineVersion: PIER_CAST_ENGINE_VERSION,
    });
    return await archivePierCastDailyScoreSnapshot({
      database: archiveClient,
      snapshot,
    });
  },
  ingestPortWashingtonShadow: async () => {
    const outcome = await ingestPierCastPortWashingtonShadowCycle({
      database: archiveClient,
      engineVersion: PIER_CAST_ENGINE_VERSION,
    });
    if (outcome.status === "unavailable") {
      return {
        status: outcome.status,
        source: outcome.source,
        fallbackUsed: outcome.fallbackUsed,
        cityCount: 0,
        sampleCount: 0,
        diagnostics: outcome.diagnostics,
        shadowForecast: null,
      };
    }
    const evaluationTime = new Date().toISOString();
    const outlook = buildPierCastPortWashingtonReviewOutlook({
      batch: outcome.batch,
      evaluationTime,
    });
    const shadowForecast = await archivePierCastPortWashingtonShadowForecast({
      database: archiveClient,
      outlook,
      batch: outcome.batch,
      ingestionSource: outcome.source,
      engineVersion: PIER_CAST_ENGINE_VERSION,
    });
    return {
      status: outcome.status,
      source: outcome.source,
      fallbackUsed: outcome.fallbackUsed,
      issuedAt: outcome.batch.issuedAt,
      fetchedAt: outcome.batch.fetchedAt,
      cycleAgeHours: outcome.batch.cycleAgeHours,
      cityCount: 1,
      sampleCount: 121,
      diagnostics: outcome.diagnostics,
      shadowForecast,
    };
  },
  ingestWisconsinShadow: async () => {
    const outcome = await ingestPierCastWisconsinShadowCycle({
      database: archiveClient,
      engineVersion: PIER_CAST_ENGINE_VERSION,
    });
    if (outcome.status === "unavailable") {
      return {
        status: outcome.status,
        source: outcome.source,
        fallbackUsed: outcome.fallbackUsed,
        cityCount: 0,
        sampleCount: 0,
        diagnostics: outcome.diagnostics,
        shadowForecast: null,
      };
    }
    const evaluationTime = new Date().toISOString();
    const outlook = buildPierCastWisconsinReviewOutlook({
      batch: outcome.batch,
      evaluationTime,
    });
    const shadowForecast = await archivePierCastWisconsinShadowForecast({
      database: archiveClient,
      outlook,
      batch: outcome.batch,
      ingestionSource: outcome.source,
      engineVersion: PIER_CAST_ENGINE_VERSION,
    });
    return {
      status: outcome.status,
      source: outcome.source,
      fallbackUsed: outcome.fallbackUsed,
      issuedAt: outcome.batch.issuedAt,
      fetchedAt: outcome.batch.fetchedAt,
      cycleAgeHours: outcome.batch.cycleAgeHours,
      cityCount: 4,
      sampleCount: 484,
      diagnostics: outcome.diagnostics,
      shadowForecast,
    };
  },
  ingestV3Shadow: async () => {
    const now = new Date();
    const [primary, expansion] = await Promise.all([
      readLatestFreshPierCastLmhofsBatch(archiveClient, now),
      readLatestFreshPierCastWisconsinLmhofsBatch(archiveClient, now),
    ]);
    if (!primary || !expansion) {
      throw new Error("Formula v3 source cohorts are unavailable.");
    }
    const batch = combinePierCastV3LmhofsBatches(primary, expansion);
    const outlook = buildPierCastV3ReviewOutlook({
      batch,
      evaluationTime: now.toISOString(),
    });
    const shadowForecast = await archivePierCastV3ShadowForecast({
      database: archiveClient,
      outlook,
      batch,
      ingestionSource: "fresh_archived_complete_cycle",
      engineVersion: PIER_CAST_V3_ENGINE_VERSION,
    });
    return {
      status: shadowForecast.status,
      source: "fresh_archived_complete_cycle" as const,
      issuedAt: batch.issuedAt,
      cityCount: 9 as const,
      sampleCount: 1089 as const,
      shadowForecast,
    };
  },
});

Deno.serve(handler);
