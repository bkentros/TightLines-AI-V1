import { getPierCastPrivateSpeciesIds, getPierCastPrivateAdmission, getPierCastPrivateTemperatureCurve, PIER_CAST_PRIVATE_ROSTER_VERSION } from "../config/privateCalibration.ts";
import {
  assertEquals,
  assertRejects,
  assertStringIncludes,
  assertThrows,
} from "jsr:@std/assert";
import {
  archivePierCastShadowForecast,
  buildPierCastReviewOutlook,
  buildPierCastShadowForecastPayload,
  PIER_CAST_ENGINE_VERSION,
  type PierCastArchiveClient,
} from "../index.ts";
import { completeLmhofsBatch } from "./fixtures/lmhofs.ts";

const EVALUATED_AT = "2026-09-10T00:35:00.000Z";

function snapshotInput() {
  const batch = completeLmhofsBatch();
  const outlook = buildPierCastReviewOutlook({
    batch,
    evaluationTime: EVALUATED_AT,
  });
  return {
    batch,
    outlook,
    ingestionSource: "live_lmhofs" as const,
    engineVersion: PIER_CAST_ENGINE_VERSION,
  };
}

Deno.test("shadow payload freezes 135 disabled forecasts and their model provenance", () => {
  const payload = buildPierCastShadowForecastPayload(snapshotInput());
  assertEquals(payload.run, {
    speciesRosterVersion: PIER_CAST_PRIVATE_ROSTER_VERSION,
    generatedAt: EVALUATED_AT,
    sourceIssuedAt: "2026-09-09T18:00:00.000Z",
    sourceFetchedAt: "2026-09-10T00:31:46.416Z",
    ingestionSource: "live_lmhofs",
    engineVersion: PIER_CAST_ENGINE_VERSION,
    formulaVersion: "seasonal-opportunity-bounded-temperature-v2",
    rubricVersion: "finfindr-opportunity-v1",
    seasonalCalibrationVersion: "piercast-private-seasonal-v1-core-v0.4.0",
    temperatureCalibrationVersion: "piercast-private-temperature-v1-core-v0.2.0",
    previewOnly: true,
  });
  assertEquals(payload.forecasts.length, 135);
  assertEquals(new Set(payload.forecasts.map((item) => item.cityId)).size, 5);
  assertEquals(
    new Set(payload.forecasts.map((item) => item.speciesId)).size,
    9,
  );
  assertEquals(
    payload.forecasts.every((item) =>
      item.representationDecision === "blocked_insufficient_evidence" &&
      item.promotionStatus === "blocked"
    ),
    true,
  );
  assertEquals(
    payload.forecasts.filter((item) => item.assessmentScope === "remaining_day")
      .length,
    27,
  );
  assertEquals(
    payload.forecasts.filter((item) => item.assessmentScope === "full_day")
      .length,
    108,
  );
});

Deno.test("shadow archiver makes one service-role RPC and accepts idempotent commits", async () => {
  let functionName = "";
  let arguments_: Record<string, unknown> = {};
  const database: PierCastArchiveClient = {
    rpc: (name, args) => {
      functionName = name;
      arguments_ = args;
      return Promise.resolve({
        data: {
          status: "already_committed",
          runId: "850753b5-83bf-4a2f-b28f-3ec866ee6f6d",
          forecastCount: 135,
        },
        error: null,
      });
    },
  };

  const result = await archivePierCastShadowForecast({
    database,
    ...snapshotInput(),
  });
  assertEquals(functionName, "commit_pier_cast_shadow_forecast");
  assertEquals((arguments_.p_forecasts as unknown[]).length, 135);
  assertEquals(result.status, "already_committed");
  assertEquals(result.forecastCount, 135);
  assertEquals(
    result.formulaVersion,
    "seasonal-opportunity-bounded-temperature-v2",
  );
});

Deno.test("shadow archiver rejects incomplete inputs and invalid database results", async () => {
  const input = snapshotInput();
  assertThrows(
    () =>
      buildPierCastShadowForecastPayload({
        ...input,
        batch: { ...input.batch, status: "partial" },
      }),
    Error,
    "incomplete or inconsistent",
  );
  await assertRejects(
    () =>
      archivePierCastShadowForecast({
        ...input,
        database: {
          rpc: () => Promise.resolve({ data: null, error: null }),
        },
      }),
    Error,
    "invalid result",
  );
});

Deno.test("shadow ledger migration is private, append-only, and effort-aware", async () => {
  const migration = await Deno.readTextFile(
    new URL(
      "../../../../migrations/20260910150000_create_pier_cast_shadow_validation_ledger.sql",
      import.meta.url,
    ),
  );
  for (
    const table of [
      "pier_cast_shadow_forecast_runs",
      "pier_cast_shadow_forecasts",
      "pier_cast_shadow_outcomes",
    ]
  ) {
    assertStringIncludes(
      migration,
      `alter table public.${table} enable row level security`,
    );
    assertStringIncludes(
      migration,
      `revoke all on table public.${table} from public, anon, authenticated`,
    );
    assertStringIncludes(
      migration,
      `grant select on table public.${table} to service_role`,
    );
  }
  assertStringIncludes(migration, "jsonb_array_length(p_forecasts) <> 100");
  assertStringIncludes(migration, "existing PierCast shadow run is incomplete");
  assertStringIncludes(
    migration,
    "result = 'zero_catch' and catch_count = 0 and effort_minutes is not null",
  );
  assertStringIncludes(
    migration,
    "revoke all on function public.commit_pier_cast_shadow_forecast(jsonb, jsonb)",
  );
  assertStringIncludes(
    migration,
    "revoke all on function public.record_pier_cast_shadow_outcome(jsonb)",
  );

  const hardening = await Deno.readTextFile(
    new URL(
      "../../../../migrations/20260910154000_harden_pier_cast_shadow_validation_ledger.sql",
      import.meta.url,
    ),
  );
  assertStringIncludes(
    hardening,
    "PierCast shadow local dates must be consecutive and match lead day",
  );
  assertStringIncludes(
    hardening,
    "PierCast shadow outcome dedupe key conflicts with existing content",
  );
  assertStringIncludes(
    hardening,
    "generated_at <= source_issued_at + interval '24 hours'",
  );

  const ownerEvidence = await Deno.readTextFile(
    new URL(
      "../../../../migrations/20260910160000_require_effort_for_assessable_owner_outcomes.sql",
      import.meta.url,
    ),
  );
  assertStringIncludes(ownerEvidence, "and effort_minutes is not null");
  assertStringIncludes(
    ownerEvidence,
    "evidence_quality = 'direct_observation'",
  );
});
