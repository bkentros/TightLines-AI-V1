import { assert, assertEquals, assertMatch } from "jsr:@std/assert";
import {
  BETSIE_CONFIGURATION_DOCUMENT,
  BIG_MANISTEE_CONFIGURATION_DOCUMENT,
  type DirectEventSample,
  GRAND_CONFIGURATION_DOCUMENT,
  MUSKEGON_CONFIGURATION_DOCUMENT,
  PERE_MARQUETTE_CONFIGURATION_DOCUMENT,
  PLATTE_CONFIGURATION_DOCUMENT,
  scorePush,
  ST_JOSEPH_CONFIGURATION_DOCUMENT,
  validateRunProfile,
  WHITE_CONFIGURATION_DOCUMENT,
} from "../index.ts";

const END = "2026-10-10T20:00:00.000Z";

function series(low: number, high: number): DirectEventSample[] {
  const values = [...Array(7).fill(low), ...Array(6).fill(high)];
  const end = Date.parse(END);
  return values.map((value, index) => ({
    windowEndAt: new Date(end - (values.length - 1 - index) * 4 * 3_600_000)
      .toISOString(),
    value,
    observationCount: 8,
  }));
}

const qualified = [
  PERE_MARQUETTE_CONFIGURATION_DOCUMENT,
  BIG_MANISTEE_CONFIGURATION_DOCUMENT,
  MUSKEGON_CONFIGURATION_DOCUMENT,
  ST_JOSEPH_CONFIGURATION_DOCUMENT,
  GRAND_CONFIGURATION_DOCUMENT,
  WHITE_CONFIGURATION_DOCUMENT,
];

const sameReachTemperatureRivers = new Set([
  "big_manistee",
  "muskegon",
  "st_joseph",
]);

Deno.test("every qualified Michigan fall run uses the direct event model and validates", () => {
  const runs = qualified.flatMap((document) => document.runs);
  assertEquals(runs.length, 19);

  for (const document of qualified) {
    for (const run of document.runs) {
      const validation = validateRunProfile(run, document.river);
      assertEquals(
        validation.valid,
        true,
        `${run.runId}: ${
          validation.issues.map((issue) => issue.message).join("; ")
        }`,
      );
      assertEquals(
        run.primitiveCapabilities.push.status,
        "available",
        run.runId,
      );
      assertEquals(run.push?.model, "direct_event_state", run.runId);
      assertEquals(run.push?.directEvent?.hydraulic, "trigger", run.runId);
      assertEquals(run.push?.directEvent?.persistenceHours, 48, run.runId);
      assertEquals(
        run.push?.directEvent?.temperature,
        sameReachTemperatureRivers.has(document.river.riverId)
          ? "trigger_and_constraint"
          : "disabled",
        run.runId,
      );
      assertMatch(run.push?.version ?? "", /direct-push-v1$/);
    }
  }
});

Deno.test("every qualified Michigan run can detect a river-specific flow event without temperature", () => {
  for (const run of qualified.flatMap((document) => document.runs)) {
    const rules = run.push!;
    const low = Math.max(rules.hydraulic.lowValue * 1.1, 10);
    const absolute = rules.hydraulic.sharpRise24h.absolute * 1.1;
    const relative = low * rules.hydraulic.sharpRise24h.percent / 100 * 1.1;
    const high = low + Math.max(absolute, relative);
    assert(
      high < rules.hydraulic.severeHighValue,
      `${run.runId} fixture exceeds severe water`,
    );

    const result = scorePush({
      movementEngineId: run.movementEngineId,
      rules,
      gaugeFreshness: "fresh",
      flowSignal: "stable",
      currentHydraulicValue: high,
      hydraulicAbsoluteChange24h: high - low,
      hydraulicPercentChange24h: (high - low) / low * 100,
      hydraulicChanges: [],
      hydraulicFourHourSeries: series(low, high),
      rainSignal: "missing_rain_data",
      temperatureSignal: "neutral_missing",
      temperatureSourceType: "unavailable",
      waterTempF: null,
      temperatureChanges: [],
      temperatureFourHourSeries: [],
      trackingState: "active",
      trackingStartDate: "2026-09-01",
      trackingEndDate: "2026-12-31",
    });

    assertEquals(result.label, "Strong", run.runId);
    assertEquals(result.model, "direct_event_state", run.runId);
    assertEquals(result.directSignals?.hydraulic?.phase, "holding", run.runId);
  }
});

Deno.test("unsupported Michigan reaches remain fail-closed", () => {
  for (
    const document of [
      BETSIE_CONFIGURATION_DOCUMENT,
      PLATTE_CONFIGURATION_DOCUMENT,
    ]
  ) {
    for (const run of document.runs) {
      assertEquals(
        run.primitiveCapabilities.push.status,
        "unavailable",
        run.runId,
      );
      assertEquals(run.push, undefined, run.runId);
    }
  }
});

Deno.test("flow-only Michigan Push configurations disclose their single-reach scope", () => {
  for (
    const document of [
      PERE_MARQUETTE_CONFIGURATION_DOCUMENT,
      GRAND_CONFIGURATION_DOCUMENT,
      WHITE_CONFIGURATION_DOCUMENT,
    ]
  ) {
    for (const run of document.runs) {
      assertEquals(run.push?.directEvent?.temperature, "disabled", run.runId);
      assert(
        /only|excluded|hydraulic response/i.test(run.push?.evidenceNotes ?? ""),
        `${run.runId} must explain why temperature is not scored`,
      );
    }
  }
});
