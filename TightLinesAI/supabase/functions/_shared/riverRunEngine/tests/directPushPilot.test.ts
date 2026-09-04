import { assertEquals, assertMatch, assertNotMatch } from "jsr:@std/assert";
import {
  buildDirectEventSeries,
  CLACKAMAS_FALL_COHO,
  type DirectEventSample,
  MANITOWOC_FALL_CHINOOK,
  OSWEGO_FALL_CHINOOK,
  type PushScoreInput,
  scorePush,
} from "../index.ts";

const END = "2026-10-10T20:00:00.000Z";

function series(values: number[]): DirectEventSample[] {
  const end = Date.parse(END);
  return values.map((value, index) => ({
    windowEndAt: new Date(end - (values.length - 1 - index) * 4 * 3_600_000)
      .toISOString(),
    value,
    observationCount: 8,
  }));
}

function score(
  rules: NonNullable<typeof MANITOWOC_FALL_CHINOOK.push>,
  overrides: Partial<PushScoreInput> = {},
) {
  return scorePush({
    movementEngineId: "fall_cooling",
    rules,
    gaugeFreshness: "fresh",
    flowSignal: "stable",
    currentHydraulicValue: 100,
    hydraulicAbsoluteChange24h: 0,
    hydraulicPercentChange24h: 0,
    hydraulicChanges: [],
    hydraulicFourHourSeries: series(Array(19).fill(100)),
    rainSignal: "missing_rain_data",
    temperatureSignal: "neutral_missing",
    temperatureSourceType: "unavailable",
    waterTempF: null,
    temperatureChanges: [],
    temperatureFourHourSeries: [],
    trackingState: "active",
    trackingStartDate: "2026-09-05",
    trackingEndDate: "2026-11-01",
    ...overrides,
  });
}

Deno.test("direct Push has a neutral floor and never emits a negative label", () => {
  const result = score(MANITOWOC_FALL_CHINOOK.push!);
  assertEquals(result.label, "Neutral");
  assertEquals(result.score, 50);
  assertEquals(result.model, "direct_event_state");
  assertMatch(result.detail, /not fish entry or abundance/i);
});

Deno.test("direct Push outage and inactive copy names only configured inputs", () => {
  const missingFlow = score(MANITOWOC_FALL_CHINOOK.push!, {
    gaugeFreshness: "missing",
    currentHydraulicValue: null,
    hydraulicFourHourSeries: [],
  });
  assertMatch(missingFlow.headline, /flow reading is unavailable/i);
  assertMatch(missingFlow.detail, /direct flow event cannot be estimated/i);
  assertNotMatch(missingFlow.detail, /species.*do not have/i);

  const waiting = score(MANITOWOC_FALL_CHINOOK.push!, {
    trackingState: "not_started",
  });
  assertMatch(waiting.detail, /measured river flow is not scored/i);
  assertNotMatch(waiting.detail, /rain|temperature/i);

  const missingBoth = score(CLACKAMAS_FALL_COHO.push!, {
    gaugeFreshness: "missing",
    currentHydraulicValue: null,
    hydraulicFourHourSeries: [],
    temperatureSourceType: "unavailable",
    waterTempF: null,
    temperatureFourHourSeries: [],
  });
  assertMatch(missingBoth.headline, /flow and water-temperature readings/i);
  assertMatch(missingBoth.detail, /direct water event cannot be estimated/i);
});

Deno.test("flow event freezes its baseline, holds, then downgrades on partial reversal", () => {
  const elevated = score(MANITOWOC_FALL_CHINOOK.push!, {
    currentHydraulicValue: 140,
    hydraulicFourHourSeries: series([
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      140,
      140,
      140,
      140,
      140,
      140,
    ]),
  });
  assertEquals(elevated.label, "Elevated");
  assertEquals(elevated.directSignals?.hydraulic?.baseline, 100);
  assertEquals(elevated.directSignals?.hydraulic?.phase, "holding");

  const fading = score(MANITOWOC_FALL_CHINOOK.push!, {
    currentHydraulicValue: 120,
    hydraulicFourHourSeries: series([
      100,
      100,
      100,
      100,
      100,
      100,
      100,
      140,
      140,
      140,
      140,
      130,
      120,
    ]),
  });
  assertEquals(fading.label, "Possible");
  assertEquals(fading.directSignals?.hydraulic?.phase, "fading");
});

Deno.test("event persistence expires 48 hours from first qualifying onset", () => {
  const values = [
    100,
    100,
    100,
    100,
    100,
    100,
    140,
    140,
    140,
    140,
    140,
    140,
    140,
    140,
    140,
    140,
    140,
    140,
    140,
    140,
  ];
  const result = score(MANITOWOC_FALL_CHINOOK.push!, {
    currentHydraulicValue: 140,
    hydraulicFourHourSeries: series(values),
  });
  assertEquals(result.label, "Neutral");
});

Deno.test("temperature requires meaningful matched cooling and heat constrains it", () => {
  const rules = CLACKAMAS_FALL_COHO.push!;
  const tinyCooling = score(rules, {
    currentHydraulicValue: 1_310,
    hydraulicFourHourSeries: series(Array(19).fill(1_310)),
    temperatureSourceType: "same_gauge",
    waterTempF: 59.5,
    temperatureFourHourSeries: series([
      60,
      60,
      60,
      60,
      60,
      60,
      60,
      59.5,
      59.5,
      59.5,
      59.5,
      59.5,
      59.5,
    ]),
  });
  assertEquals(tinyCooling.label, "Neutral");

  const cooling = score(rules, {
    currentHydraulicValue: 1_310,
    hydraulicFourHourSeries: series(Array(19).fill(1_310)),
    temperatureSourceType: "same_gauge",
    waterTempF: 58,
    temperatureFourHourSeries: series([
      60,
      60,
      60,
      60,
      60,
      60,
      60,
      58,
      58,
      58,
      58,
      58,
      58,
    ]),
  });
  assertEquals(cooling.label, "Elevated");

  const stillTooWarm = score(rules, {
    currentHydraulicValue: 1_310,
    hydraulicFourHourSeries: series(Array(19).fill(1_310)),
    temperatureSourceType: "same_gauge",
    waterTempF: 66,
    temperatureFourHourSeries: series([
      70,
      70,
      70,
      70,
      70,
      70,
      70,
      66,
      66,
      66,
      66,
      66,
      66,
    ]),
  });
  assertEquals(stillTooWarm.label, "Possible");
});

Deno.test("temperature-only mode works and a repeating diel cycle stays neutral", () => {
  const baseRules = CLACKAMAS_FALL_COHO.push!;
  const rules = {
    ...baseRules,
    directEvent: { ...baseRules.directEvent!, hydraulic: "disabled" as const },
  };
  const cooling = score(rules, {
    gaugeFreshness: "missing",
    currentHydraulicValue: null,
    hydraulicFourHourSeries: [],
    temperatureSourceType: "receiving_water",
    waterTempF: 58,
    temperatureFourHourSeries: series([
      60,
      60,
      60,
      60,
      60,
      60,
      60,
      58,
      58,
      58,
      58,
      58,
      58,
    ]),
  });
  assertEquals(cooling.label, "Elevated");

  const diel = score(rules, {
    gaugeFreshness: "missing",
    currentHydraulicValue: null,
    hydraulicFourHourSeries: [],
    temperatureSourceType: "same_gauge",
    waterTempF: 60,
    temperatureFourHourSeries: series([
      60,
      58,
      56,
      55,
      56,
      58,
      60,
      58,
      56,
      55,
      56,
      58,
      60,
    ]),
  });
  assertEquals(diel.label, "Neutral");
});

Deno.test("flow must clear both river-specific absolute and relative thresholds", () => {
  const result = score(OSWEGO_FALL_CHINOOK.push!, {
    currentHydraulicValue: 10_500,
    hydraulicFourHourSeries: series([
      10_000,
      10_000,
      10_000,
      10_000,
      10_000,
      10_000,
      10_000,
      10_500,
      10_500,
      10_500,
      10_500,
      10_500,
      10_500,
    ]),
  });
  assertEquals(result.label, "Neutral");
});

Deno.test("flow and cooling corroborate without double counting", () => {
  const result = score(CLACKAMAS_FALL_COHO.push!, {
    currentHydraulicValue: 1_900,
    hydraulicFourHourSeries: series([
      1_300,
      1_300,
      1_300,
      1_300,
      1_300,
      1_300,
      1_300,
      1_900,
      1_900,
      1_900,
      1_900,
      1_900,
      1_900,
    ]),
    temperatureSourceType: "same_gauge",
    waterTempF: 58,
    temperatureFourHourSeries: series([
      60,
      60,
      60,
      60,
      60,
      60,
      60,
      58,
      58,
      58,
      58,
      58,
      58,
    ]),
  });
  assertEquals(result.label, "Elevated");
  assertMatch(result.detail, /both showing/i);
});

Deno.test("severe high water suppresses rather than rewards an event", () => {
  const result = score(MANITOWOC_FALL_CHINOOK.push!, {
    currentHydraulicValue: 1_300,
    hydraulicFourHourSeries: series([
      700,
      700,
      700,
      700,
      700,
      700,
      700,
      1_300,
      1_300,
      1_300,
      1_300,
      1_300,
      1_300,
    ]),
  });
  assertEquals(result.label, "Neutral");
});

Deno.test("four-hour medians reject a single provider spike", () => {
  const observations = Array.from({ length: 16 }, (_, index) => ({
    at: new Date(Date.parse(END) - (15 - index) * 15 * 60_000).toISOString(),
    value: index === 14 ? 500 : 100,
  }));
  const result = buildDirectEventSeries({
    observations,
    refreshAtUtc: END,
    observedAt: (observation) => observation.at,
    value: (observation) => observation.value,
    historyHours: 0,
  });
  assertEquals(result[0].value, 100);
});

Deno.test("direct Push remains inactive outside Beginning through Tapering", () => {
  for (const trackingState of ["not_started", "complete"] as const) {
    const result = score(MANITOWOC_FALL_CHINOOK.push!, { trackingState });
    assertEquals(result.score, null);
    assertEquals(result.model, "direct_event_state");
  }
});
