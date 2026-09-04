import { assert, assertEquals, assertMatch } from "jsr:@std/assert";
import {
  BETSIE_CONFIGURATION_DOCUMENT,
  COWLITZ_CONFIGURATION_DOCUMENT,
  GREEN_CONFIGURATION_DOCUMENT,
  LOWER_GENESEE_CONFIGURATION_DOCUMENT,
  OAK_ORCHARD_CONFIGURATION_DOCUMENT,
  PLATTE_CONFIGURATION_DOCUMENT,
  PUYALLUP_CONFIGURATION_DOCUMENT,
  SALMON_NY_CONFIGURATION_DOCUMENT,
  scorePush,
  validateConfigurationRevision,
} from "../index.ts";
import type {
  DirectEventSample,
  RiverRunConfigurationDocument,
} from "../types.ts";

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

const directDocuments = [
  SALMON_NY_CONFIGURATION_DOCUMENT,
  GREEN_CONFIGURATION_DOCUMENT,
  PUYALLUP_CONFIGURATION_DOCUMENT,
  COWLITZ_CONFIGURATION_DOCUMENT,
];

const expectedHydraulics = new Map<string, number[]>([
  ["salmon_ny", [20, 4.2, 80, 13.8, 354, 51]],
  ["green", [11, 3, 38, 8.5, 144, 24]],
  ["puyallup", [90, 6.2, 210, 13.4, 674, 33.8]],
  ["cowlitz", [230, 5.2, 720, 16.4, 1310, 30.8]],
  ["lower_genesee", [140, 16.9, 340, 36.1, 726, 66]],
]);

function assertRevisionValid(
  document: RiverRunConfigurationDocument,
  status: "draft" | "published",
) {
  const issues = validateConfigurationRevision({
    configKey: document.river.riverId,
    revision: 1,
    status,
    document,
    evidenceNotes: "Remaining-river direct Push calibration audit.",
  });
  assert(
    issues.every((issue) => issue.severity !== "error"),
    issues.map((issue) => itemMessage(issue)).join("\n"),
  );
}

function itemMessage(issue: { field: string; message: string }) {
  return `${issue.field}: ${issue.message}`;
}

Deno.test("remaining direct-source rivers use exact river-specific flow thresholds", () => {
  for (const document of directDocuments) {
    assertRevisionValid(
      document,
      document.runs.every((run) => run.publicAudit.isEnabled)
        ? "published"
        : "draft",
    );
    const expected = expectedHydraulics.get(document.river.riverId)!;
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
        "standard",
        run.runId,
      );
      assertEquals(run.push?.directEvent?.maximumLevel, undefined, run.runId);
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
      assertMatch(
        run.push?.evidenceNotes ?? "",
        /consecutive-day positive rises/i,
      );
    }
  }
});

Deno.test("each remaining direct model detects its own sharp event and fails closed", () => {
  for (const run of directDocuments.flatMap((document) => document.runs)) {
    const rules = run.push!;
    const low = Math.max(rules.hydraulic.lowValue * 1.1, 10);
    const rise = Math.max(
      rules.hydraulic.sharpRise24h.absolute * 1.1,
      low * rules.hydraulic.sharpRise24h.percent / 100 * 1.1,
    );
    const high = low + rise;
    assert(high < rules.hydraulic.severeHighValue, run.runId);

    const strong = scorePush({
      movementEngineId: run.movementEngineId,
      rules,
      gaugeFreshness: "fresh",
      flowSignal: "sharp_rise",
      currentHydraulicValue: high,
      hydraulicAbsoluteChange24h: rise,
      hydraulicPercentChange24h: rise / low * 100,
      hydraulicChanges: [],
      hydraulicFourHourSeries: series(low, high),
      rainSignal: "missing_rain_data",
      temperatureSignal: "neutral_missing",
      temperatureSourceType: "unavailable",
      waterTempF: null,
      temperatureChanges: [],
      temperatureFourHourSeries: [],
      trackingState: "active",
      trackingStartDate: "2026-07-01",
      trackingEndDate: "2026-12-31",
    });
    assertEquals(strong.label, "Strong", run.runId);
    assertEquals(strong.score, 92, run.runId);
    assertMatch(strong.detail, /not fish entry or abundance/i, run.runId);

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
      trackingStartDate: "2026-07-01",
      trackingEndDate: "2026-12-31",
    });
    assertEquals(unavailable.label, "Unavailable", run.runId);
    assertMatch(
      unavailable.headline,
      /flow reading is unavailable/i,
      run.runId,
    );
  }
});

Deno.test("Lower Genesee remains a capped and explicit upstream-basin proxy", () => {
  assertRevisionValid(LOWER_GENESEE_CONFIGURATION_DOCUMENT, "published");
  const expected = expectedHydraulics.get("lower_genesee")!;
  for (const run of LOWER_GENESEE_CONFIGURATION_DOCUMENT.runs) {
    const rules = run.push!;
    assertEquals(run.primitiveCapabilities.push.status, "available", run.runId);
    assertEquals(rules.directEvent?.evidenceConfidence, "lower", run.runId);
    assertEquals(rules.directEvent?.maximumLevel, 2, run.runId);
    assertMatch(rules.directEvent?.limitationCopy ?? "", /upstream.*falls/i);
    assertEquals(
      [
        rules.hydraulic.rising24h.absolute,
        rules.hydraulic.rising24h.percent,
        rules.hydraulic.meaningfulRise24h.absolute,
        rules.hydraulic.meaningfulRise24h.percent,
        rules.hydraulic.sharpRise24h.absolute,
        rules.hydraulic.sharpRise24h.percent,
      ],
      expected,
      run.runId,
    );
    const low = rules.hydraulic.lowValue * 1.1;
    const rise = Math.max(
      rules.hydraulic.sharpRise24h.absolute * 1.1,
      low * rules.hydraulic.sharpRise24h.percent / 100 * 1.1,
    );
    const result = scorePush({
      movementEngineId: run.movementEngineId,
      rules,
      gaugeFreshness: "fresh",
      flowSignal: "sharp_rise",
      currentHydraulicValue: low + rise,
      hydraulicAbsoluteChange24h: rise,
      hydraulicPercentChange24h: rise / low * 100,
      hydraulicChanges: [],
      hydraulicFourHourSeries: series(low, low + rise),
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
    assertEquals(result.evidenceConfidence, "Lower", run.runId);
    assertMatch(result.detail, /upstream-basin context only/i, run.runId);
  }
});

Deno.test("disconnected or sensorless rivers remain explicitly excluded", () => {
  const excluded = [
    BETSIE_CONFIGURATION_DOCUMENT,
    PLATTE_CONFIGURATION_DOCUMENT,
    OAK_ORCHARD_CONFIGURATION_DOCUMENT,
  ];
  for (const document of excluded) {
    for (const run of document.runs) {
      const capability = run.primitiveCapabilities.push;
      assertEquals(
        capability.status,
        "unavailable",
        run.runId,
      );
      assertEquals(run.push, undefined, run.runId);
      if (capability.status !== "unavailable") continue;
      if (document.river.riverId === "betsie") {
        assertMatch(capability.notes, /neither is accepted/i);
      } else if (document.river.riverId === "platte") {
        assertMatch(
          document.river.gaugeLimitationCopy,
          /upstream of Platte Lake/i,
        );
      } else {
        assertMatch(capability.notes, /Reservoir.*Dam/i);
      }
    }
  }
});
