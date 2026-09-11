import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  archivePierCastDailyScoreSnapshot,
  archivePierCastShadowForecast,
  buildPierCastDailyScoreSnapshot,
  buildPierCastReviewOutlook,
  ingestPierCastCalibrationObservations,
  ingestPierCastTemperatureCycle,
  PIER_CAST_BASELINE_FORMULA_VERSION,
  PIER_CAST_ENGINE_VERSION,
  type PierCastArchiveClient,
  pierCastDailyScoreLakeDateForCycle,
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
});

Deno.serve(handler);
