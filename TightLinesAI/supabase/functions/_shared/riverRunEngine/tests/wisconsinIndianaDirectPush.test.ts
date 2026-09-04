import { assert, assertEquals, assertMatch } from "jsr:@std/assert";
import {
  BOIS_BRULE_CONFIGURATION_DOCUMENT,
  FALL_2026_DRAFT_CONFIGURATION_DOCUMENTS,
  MIDWEST_DRAFT_CONFIGURATION_DOCUMENTS,
  MILWAUKEE_CONFIGURATION_DOCUMENT,
  ROOT_CONFIGURATION_DOCUMENT,
  scorePush,
  SHEBOYGAN_CONFIGURATION_DOCUMENT,
  ST_JOSEPH_CONFIGURATION_DOCUMENT,
  validateConfigurationRevision,
  validateRunProfile,
} from "../index.ts";
import type { DirectEventSample } from "../types.ts";

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

const manitowoc = FALL_2026_DRAFT_CONFIGURATION_DOCUMENTS.find((document) =>
  document.river.riverId === "manitowoc"
)!;
const trailCreek = MIDWEST_DRAFT_CONFIGURATION_DOCUMENTS.find((document) =>
  document.river.riverId === "trail_creek"
)!;
const kewaunee = MIDWEST_DRAFT_CONFIGURATION_DOCUMENTS.find((document) =>
  document.river.riverId === "kewaunee_river"
)!;

const qualified = [
  MILWAUKEE_CONFIGURATION_DOCUMENT,
  SHEBOYGAN_CONFIGURATION_DOCUMENT,
  manitowoc,
  trailCreek,
  kewaunee,
  ST_JOSEPH_CONFIGURATION_DOCUMENT,
];
const lowerConfidenceProxies = [
  ROOT_CONFIGURATION_DOCUMENT,
  BOIS_BRULE_CONFIGURATION_DOCUMENT,
];
const constraintOnlyRivers = new Set([
  "milwaukee",
  "trail_creek",
  "kewaunee_river",
]);
const expectedHydraulics = new Map([
  ["milwaukee", [50, 10, 150, 28, 370, 57]],
  ["sheboygan", [15, 7, 50, 20, 150, 52]],
  ["manitowoc", [11, 8.9, 37, 21.3, 99, 48.2]],
  ["trail_creek", [5.3, 9.9, 20, 35.8, 67.9, 101.4]],
  ["kewaunee_river", [3, 10, 14, 35, 90, 98]],
  ["st_joseph", [120, 5, 240, 11, 450, 19]],
]);

Deno.test("every qualified Wisconsin and Indiana fall run validates with river-specific direct Push", () => {
  const runs = qualified.flatMap((document) => document.runs);
  assertEquals(runs.length, 19);

  for (const document of qualified) {
    const revisionIssues = validateConfigurationRevision({
      configKey: document.river.riverId,
      revision: 1,
      status: document.runs.every((run) => run.publicAudit.isEnabled)
        ? "published"
        : "draft",
      document,
      evidenceNotes: "Wisconsin and Indiana direct Push configuration audit.",
    });
    assert(
      revisionIssues.every((issue) => issue.severity !== "error"),
      revisionIssues.map((issue) => issue.message).join("\n"),
    );
    const expected = expectedHydraulics.get(document.river.riverId)!;
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
        document.river.riverId === "st_joseph"
          ? "trigger_and_constraint"
          : constraintOnlyRivers.has(document.river.riverId)
          ? "constraint_only"
          : "disabled",
        run.runId,
      );
      assertEquals(
        [
          run.push?.hydraulic.rising24h.absolute,
          run.push?.hydraulic.rising24h.percent,
          run.push?.hydraulic.meaningfulRise24h.absolute,
          run.push?.hydraulic.meaningfulRise24h.percent,
          run.push?.hydraulic.sharpRise24h.absolute,
          run.push?.hydraulic.sharpRise24h.percent,
        ],
        expected,
        run.runId,
      );
      assertMatch(run.push?.version ?? "", /direct-push-v1$/);
    }
  }
});

Deno.test("every qualified Wisconsin and Indiana run detects its local flow event", () => {
  for (const run of qualified.flatMap((document) => document.runs)) {
    const rules = run.push!;
    const low = Math.max(rules.hydraulic.lowValue * 1.1, 10);
    const absolute = rules.hydraulic.sharpRise24h.absolute * 1.1;
    const relative = low * rules.hydraulic.sharpRise24h.percent / 100 * 1.1;
    const high = low + Math.max(absolute, relative);
    assert(high < rules.hydraulic.severeHighValue, run.runId);

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
    assertEquals(result.directSignals?.hydraulic?.phase, "holding", run.runId);
  }
});

Deno.test("new constraint-only temperature cannot manufacture Push during a flow outage", () => {
  for (
    const run of qualified.flatMap((document) => document.runs).filter((run) =>
      run.push?.directEvent?.temperature === "constraint_only"
    )
  ) {
    const result = scorePush({
      movementEngineId: run.movementEngineId,
      rules: run.push!,
      gaugeFreshness: "missing",
      flowSignal: "unknown",
      currentHydraulicValue: null,
      hydraulicAbsoluteChange24h: null,
      hydraulicPercentChange24h: null,
      hydraulicChanges: [],
      hydraulicFourHourSeries: [],
      rainSignal: "missing_rain_data",
      temperatureSignal: "cooling",
      temperatureSourceType: "same_gauge",
      waterTempF: run.push!.temperature.supportiveMinF,
      temperatureChanges: [],
      temperatureFourHourSeries: series(60, 50),
      trackingState: "active",
      trackingStartDate: "2026-09-01",
      trackingEndDate: "2026-12-31",
    });

    assertEquals(result.label, "Unavailable", run.runId);
    assertEquals(result.score, null, run.runId);
    assertMatch(result.headline, /flow reading is unavailable/i, run.runId);
  }
});

Deno.test("Root and Bois Brule expose capped lower-confidence flow proxies", () => {
  const expected = new Map([
    ["root", [7, 21, 33, 57.1, 123, 137.4]],
    ["bois_brule", [4, 2.7, 11, 7.2, 33, 19.7]],
  ]);

  for (const document of lowerConfidenceProxies) {
    const revisionIssues = validateConfigurationRevision({
      configKey: document.river.riverId,
      revision: 1,
      status: "published",
      document,
      evidenceNotes: "Lower-confidence upstream Push proxy audit.",
    });
    assert(
      revisionIssues.every((issue) => issue.severity !== "error"),
      revisionIssues.map((issue) => issue.message).join("\n"),
    );

    for (const run of document.runs) {
      assertEquals(
        run.primitiveCapabilities.push.status,
        "available",
        run.runId,
      );
      assertEquals(run.push?.model, "direct_event_state", run.runId);
      assertEquals(run.push?.directEvent?.hydraulic, "trigger", run.runId);
      assertEquals(run.push?.directEvent?.temperature, "disabled", run.runId);
      assertEquals(
        run.push?.directEvent?.evidenceConfidence,
        "lower",
        run.runId,
      );
      assertEquals(run.push?.directEvent?.maximumLevel, 2, run.runId);
      assertMatch(run.push?.directEvent?.limitationCopy ?? "", /upstream/i);
      assertEquals(
        [
          run.push?.hydraulic.rising24h.absolute,
          run.push?.hydraulic.rising24h.percent,
          run.push?.hydraulic.meaningfulRise24h.absolute,
          run.push?.hydraulic.meaningfulRise24h.percent,
          run.push?.hydraulic.sharpRise24h.absolute,
          run.push?.hydraulic.sharpRise24h.percent,
        ],
        expected.get(document.river.riverId),
        run.runId,
      );

      const rules = run.push!;
      const low = rules.hydraulic.lowValue * 1.1;
      const high = low + Math.max(
        rules.hydraulic.sharpRise24h.absolute * 1.1,
        low * rules.hydraulic.sharpRise24h.percent / 100 * 1.1,
      );
      assert(high < rules.hydraulic.severeHighValue, run.runId);
      const result = scorePush({
        movementEngineId: run.movementEngineId,
        rules,
        gaugeFreshness: "fresh",
        flowSignal: "sharp_rise",
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

      assertEquals(result.label, "Elevated", run.runId);
      assertEquals(result.score, 78, run.runId);
      assertEquals(result.evidenceConfidence, "Lower", run.runId);
      assertEquals(result.directSignals?.hydraulic?.level, 2, run.runId);
      assertEquals(result.components?.hydraulicBase, 2, run.runId);
      assertMatch(result.headline, /lower-confidence upstream flow proxy/i);
      assertMatch(result.detail, /directional context only/i);

      const stale = scorePush({
        movementEngineId: run.movementEngineId,
        rules,
        gaugeFreshness: "stale",
        flowSignal: "sharp_rise",
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
      assertEquals(stale.label, "Possible", run.runId);
      assertEquals(stale.score, 64, run.runId);
      assertEquals(stale.directSignals?.hydraulic?.level, 1, run.runId);
      assertMatch(stale.detail, /stale.*reduced by one level/i, run.runId);

      const unavailable = scorePush({
        movementEngineId: run.movementEngineId,
        rules,
        gaugeFreshness: "missing",
        flowSignal: "unknown",
        currentHydraulicValue: null,
        hydraulicChanges: [],
        hydraulicFourHourSeries: [],
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
      assertEquals(unavailable.label, "Unavailable", run.runId);
      assertEquals(unavailable.evidenceConfidence, "Lower", run.runId);
      assertMatch(unavailable.headline, /flow reading is unavailable/i);
      assertMatch(unavailable.detail, /directional context only/i);
    }
  }
});
