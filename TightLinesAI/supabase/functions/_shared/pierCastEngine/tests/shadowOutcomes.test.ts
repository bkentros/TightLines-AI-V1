import { assertEquals, assertRejects, assertThrows } from "jsr:@std/assert";
import {
  parsePierCastShadowOutcomeInput,
  type PierCastArchiveClient,
  recordPierCastShadowOutcome,
} from "../index.ts";

function validOutcome() {
  return {
    dedupeKey: "owner-trip-20260910-0001",
    cityId: "grand_haven_mi",
    speciesId: "brown_trout",
    localDate: "2026-09-10",
    structureName: "Grand Haven South Pier",
    observedAt: "2026-09-10T12:00:00-04:00",
    assessmentStatus: "assessable",
    result: "zero_catch",
    effortMinutes: 120,
    catchCount: 0,
    sourceType: "owner_trip",
    evidenceQuality: "direct_effort",
    sourceReference: null,
    notes: "Two rods; targeted brown trout.",
  };
}

Deno.test("shadow outcome parser preserves an effort-aware zero", () => {
  const outcome = parsePierCastShadowOutcomeInput(validOutcome());
  assertEquals(outcome.effortMinutes, 120);
  assertEquals(outcome.catchCount, 0);
  assertEquals(outcome.result, "zero_catch");
  assertEquals(outcome.observedAt, "2026-09-10T16:00:00.000Z");
});

Deno.test("shadow outcome parser keeps missing and inaccessible evidence unknown", () => {
  const input = {
    ...validOutcome(),
    dedupeKey: "access-closed-20260910-0001",
    assessmentStatus: "not_assessable_access",
    result: "unknown",
    effortMinutes: null,
    catchCount: null,
    evidenceQuality: "direct_observation",
  };
  assertEquals(parsePierCastShadowOutcomeInput(input).result, "unknown");
  assertThrows(
    () => parsePierCastShadowOutcomeInput({ ...input, result: "zero_catch" }),
    Error,
    "inconsistent",
  );
});

Deno.test("shadow outcome parser rejects false negatives and unsourced reports", () => {
  assertThrows(
    () =>
      parsePierCastShadowOutcomeInput({
        ...validOutcome(),
        effortMinutes: null,
      }),
    Error,
    "explicit effort",
  );
  assertThrows(
    () =>
      parsePierCastShadowOutcomeInput({
        ...validOutcome(),
        result: "positive",
        catchCount: 0,
      }),
    Error,
    "at least 1",
  );
  assertThrows(
    () =>
      parsePierCastShadowOutcomeInput({
        ...validOutcome(),
        sourceType: "verified_pier_report",
        evidenceQuality: "verified_qualitative",
        sourceReference: null,
      }),
    Error,
    "sourceReference",
  );
  assertThrows(
    () =>
      parsePierCastShadowOutcomeInput({
        ...validOutcome(),
        result: "positive",
        catchCount: 1,
        effortMinutes: null,
      }),
    Error,
    "direct effort",
  );
});

Deno.test("shadow outcome recorder calls only the constrained RPC", async () => {
  let functionName = "";
  let arguments_: Record<string, unknown> = {};
  const database: PierCastArchiveClient = {
    rpc: (name, args) => {
      functionName = name;
      arguments_ = args;
      return Promise.resolve({
        data: {
          status: "committed",
          outcomeId: "850753b5-83bf-4a2f-b28f-3ec866ee6f6d",
        },
        error: null,
      });
    },
  };
  const result = await recordPierCastShadowOutcome(database, validOutcome());
  assertEquals(functionName, "record_pier_cast_shadow_outcome");
  assertEquals(
    (arguments_.p_outcome as { effortMinutes: number }).effortMinutes,
    120,
  );
  assertEquals(result.status, "committed");

  await assertRejects(
    () =>
      recordPierCastShadowOutcome(
        {
          rpc: () => Promise.resolve({ data: null, error: null }),
        },
        validOutcome(),
      ),
    Error,
    "invalid result",
  );
});
