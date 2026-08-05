import { assert, assertEquals } from "jsr:@std/assert";
import {
  addDays,
  canonicalBaselineDay,
  type ConditionsSuggestCheckpoint,
  type ConditionsSuggestEvidenceByDate,
  type ConditionsSuggestLabel,
  daysBetween,
  type FishabilityScoreInput,
  PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
  type PrimitiveDisplay,
  type PushScoreInput,
  resolveConditionsSuggestCheckpoints,
  resolveInterpretationNote,
  resolveRunStage,
  type RiverRunConditionsSuggestBaseline,
  type RunStage,
  scoreConditionsSuggest,
  scoreFishability,
  scoreFishInRiver,
  scorePush,
} from "../index.ts";

const run = PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE;

function pushForCopy(
  overrides: Partial<PushScoreInput> = {},
): ReturnType<typeof scorePush> {
  return scorePush({
    movementEngineId: "fall_cooling",
    rules: run.push,
    gaugeFreshness: "fresh",
    rainSignal: "light_rain",
    flowSignal: "stable",
    currentHydraulicValue: 550,
    hydraulicAbsoluteChange24h: 0,
    hydraulicPercentChange24h: 0,
    temperatureSignal: "neutral",
    temperatureSourceType: "same_gauge",
    waterTempF: 60,
    trackingState: "active",
    trackingStartDate: "2026-08-15",
    trackingEndDate: "2026-10-20",
    ...overrides,
  });
}

function fishabilityForCopy(
  overrides: Partial<FishabilityScoreInput> = {},
): ReturnType<typeof scoreFishability> {
  return scoreFishability({
    rules: run.fishabilityBands,
    gaugeFreshness: "fresh",
    flowBand: "ideal",
    flowSignal: "stable",
    currentHydraulicValue: 600,
    hydraulicAbsoluteChange24h: 0,
    hydraulicPercentChange24h: 0,
    ...overrides,
  });
}

const bannedPhrases = [
  /catch probability/i,
  /\bguarantee(?:d)?\b/i,
  /\bloaded\b/i,
  /\bstacked\b/i,
  /hot bite/i,
  /fall_cooling_rain_pulse/i,
  /observed rain/i,
  /\bresearch(?:ed)?\b/i,
  /\bconfigured?\b/i,
  /\bcheckpoint\b/i,
  /\bbaseline\b/i,
  /\bpercentile\b/i,
  /\bengine\b/i,
  /\bgauge\b/i,
  /\bmodeled\b/i,
  /\bhistorical\b/i,
  /\bcfs\b/i,
  /\bvisibility\b/i,
  /\brun\b/i,
  /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}\b/i,
  /\b20\d{2}-\d{2}-\d{2}\b/,
] as const;

function conditionsFor(
  kind:
    | "ahead"
    | "typical"
    | "delayed"
    | "insufficient"
    | "inactive"
    | "evaluating"
    | "complete",
) {
  if (kind === "inactive") {
    return scoreConditionsSuggest({
      localDate: "2026-07-20",
      run,
      evidenceByDate: {},
      baselines: [],
    });
  }
  if (kind === "evaluating") {
    return scoreConditionsSuggest({
      localDate: "2026-08-01",
      run,
      evidenceByDate: {},
      baselines: [],
    });
  }
  const checkpoints = resolveConditionsSuggestCheckpoints(run, "2026-09-20");
  const target = kind === "complete"
    ? checkpoints.find((item) => item.checkpointId === "peak_complete")!
    : checkpoints.find((item) => item.checkpointId === "river_start")!;
  const count = daysBetween(
    target.observationStartDate,
    target.cutoffDate,
  ) + 1;
  const evidenceByDate: ConditionsSuggestEvidenceByDate = {};
  for (
    let index = 0;
    index < (kind === "insufficient" ? 3 : count);
    index++
  ) {
    const gaugeValue = kind === "ahead" || kind === "complete"
      ? 400 + index * 60
      : kind === "delayed"
      ? 500
      : 500 + index * 20;
    const waterTempF = kind === "ahead" || kind === "complete"
      ? 65 - index
      : kind === "delayed"
      ? 70
      : 64 - index * 0.4;
    evidenceByDate[addDays(target.observationStartDate, index)] = {
      "16:00": {
        gaugeFreshness: "fresh",
        gaugeValue,
        gaugeMetric: "flow_cfs",
        gaugeSiteId: "04122500",
        waterTemperatureFreshness: "fresh",
        waterTempF,
        waterTemperatureSourceId: run.conditionsSuggest.temperatureSourceId,
      },
    };
  }
  return scoreConditionsSuggest({
    localDate: target.checkpointDate,
    run,
    evidenceByDate,
    baselines: kind === "complete"
      ? checkpoints.map(conditionsBaseline)
      : [conditionsBaseline(target)],
  });
}

function conditionsBaseline(
  checkpoint: ConditionsSuggestCheckpoint,
): RiverRunConditionsSuggestBaseline {
  const indices = [10, 30, 50, 70, 90];
  const expectedDays = daysBetween(
    checkpoint.observationStartDate,
    checkpoint.cutoffDate,
  ) + 1;
  return {
    riverId: "pere_marquette",
    runId: run.runId,
    checkpointId: checkpoint.checkpointId,
    referenceDayOfYear: canonicalBaselineDay(checkpoint.checkpointDate),
    observationStartDayOfYear: canonicalBaselineDay(
      checkpoint.observationStartDate,
    ),
    baselineVersion: run.conditionsSuggest.baselineVersion,
    gaugeMetric: "flow_cfs",
    gaugeSiteId: "04122500",
    temperatureSourceId: run.conditionsSuggest.temperatureSourceId,
    componentSamples: {
      gaugeAbsoluteRise: [0, 200, 400, 600, 800],
      gaugeRelativeRisePct: [0, 20, 40, 60, 80],
      meanWaterTempF: [50, 55, 60, 65, 70],
      waterCoolingF: [-5, 0, 5, 10, 15],
    },
    historicalSamples: indices.map((evidenceIndex, index) => ({
      year: 2021 + index,
      usableDays: expectedDays,
      gaugeAbsoluteRise: index * 200,
      gaugeRelativeRisePct: index * 20,
      meanWaterTempF: 70 - index * 5,
      waterCoolingF: -5 + index * 5,
      gaugeResponsePercentile: 10 + index * 20,
      waterTemperaturePercentile: 10 + index * 20,
      evidenceIndex,
    })),
    indexPercentiles: { p10: 18, p25: 30, p75: 70, p90: 82 },
    distinctYears: 5,
    expectedDays,
    minimumUsableDays: Math.ceil(
      expectedDays * run.conditionsSuggest.minimumCoveragePercent,
    ),
    sourceNotes: "Test.",
  };
}

function text(display: PrimitiveDisplay): string {
  return [
    display.label,
    display.headline,
    display.whereToStart ?? "",
    display.detail,
    display.tip,
  ].join(" ");
}

function assertComplete(display: PrimitiveDisplay) {
  assert(display.label.trim().length > 0);
  assert(display.headline.trim().length > 0);
  assert(display.detail.trim().length > 0);
  assert(display.tip.trim().length > 0);
  assert(display.reasonCodes.length > 0);
}

function assertNoBanned(value: string) {
  for (const phrase of bannedPhrases) {
    assertEquals(
      phrase.test(value),
      false,
      `Banned phrase matched ${phrase}: ${value}`,
    );
  }
}

function assertDimensionCopy(
  name: string,
  display: PrimitiveDisplay,
  required: RegExp,
  forbidden: RegExp[],
) {
  const value = text(display);
  assert(
    required.test(value),
    `${name} copy should include ${required}: ${value}`,
  );
  for (const phrase of forbidden) {
    assertEquals(
      phrase.test(value),
      false,
      `${name} copy should stay dimension-specific: ${value}`,
    );
  }
}

function pushDisplays(): PrimitiveDisplay[] {
  return [
    pushForCopy({
      rainSignal: "dry",
      flowSignal: "falling",
      temperatureSignal: "strong_warming",
      waterTempF: 69,
    }),
    pushForCopy({
      rainSignal: "dry",
      flowSignal: "stable",
      temperatureSignal: "neutral",
    }),
    pushForCopy({
      rainSignal: "meaningful_rain",
      flowSignal: "rising",
      temperatureSignal: "cooling",
      hydraulicAbsoluteChange24h: 20,
      hydraulicPercentChange24h: 3,
    }),
    pushForCopy({
      rainSignal: "heavy_rain",
      flowSignal: "meaningful_rise",
      temperatureSignal: "strong_cooling",
      hydraulicAbsoluteChange24h: 50,
      hydraulicPercentChange24h: 8,
    }),
    pushForCopy({
      rainSignal: "strong_rain",
      flowSignal: "sharp_rise",
      temperatureSignal: "strong_cooling",
      hydraulicAbsoluteChange24h: 100,
      hydraulicPercentChange24h: 15,
    }),
    pushForCopy({
      gaugeFreshness: "missing",
      rainSignal: "heavy_rain",
      flowSignal: "meaningful_rise",
      temperatureSignal: "strong_cooling",
    }),
    pushForCopy({ trackingState: "not_started" }),
    pushForCopy({ trackingState: "complete" }),
    pushForCopy({ trackingState: "offseason" }),
  ];
}

function fishabilityDisplays(): PrimitiveDisplay[] {
  return [
    fishabilityForCopy({
      flowBand: "blown_out",
      flowSignal: "sharp_rise",
      currentHydraulicValue: 1_700,
      hydraulicAbsoluteChange24h: 300,
      hydraulicPercentChange24h: 21.4,
    }),
    fishabilityForCopy({
      flowBand: "very_high",
      flowSignal: "stable",
      currentHydraulicValue: 1_200,
    }),
    fishabilityForCopy({
      flowBand: "low",
      flowSignal: "stable",
      currentHydraulicValue: 450,
    }),
    fishabilityForCopy({
      flowBand: "normal_fishable",
      flowSignal: "stable",
      currentHydraulicValue: 500,
    }),
    fishabilityForCopy(),
    fishabilityForCopy({
      flowBand: undefined,
      flowSignal: "stable",
    }),
  ];
}

function fishInRiverDisplays(): PrimitiveDisplay[] {
  return [
    scoreFishInRiver(run, "2026-06-30"),
    scoreFishInRiver(run, "2026-08-01"),
    scoreFishInRiver(run, "2026-08-15"),
    scoreFishInRiver(run, "2026-08-25"),
    scoreFishInRiver(run, "2026-09-05"),
    scoreFishInRiver(run, "2026-09-20"),
    scoreFishInRiver(run, "2026-11-10"),
  ];
}

Deno.test("primitive copy is complete for every reachable label", () => {
  const runStages = [
    resolveRunStage(run, "2026-08-10"),
    resolveRunStage(run, "2026-08-22"),
    resolveRunStage(run, "2026-08-25"),
    resolveRunStage(run, "2026-09-10"),
    resolveRunStage(run, "2026-09-20"),
    resolveRunStage(run, "2026-10-01"),
    resolveRunStage(run, "2026-10-22"),
    resolveRunStage(run, "2026-11-05"),
    resolveRunStage(run, "2026-11-11"),
  ];
  const conditions = [
    conditionsFor("ahead"),
    conditionsFor("typical"),
    conditionsFor("delayed"),
    conditionsFor("insufficient"),
    conditionsFor("inactive"),
    conditionsFor("evaluating"),
    conditionsFor("complete"),
  ];
  const displays = [
    ...runStages,
    ...conditions,
    ...pushDisplays(),
    ...fishabilityDisplays(),
    ...fishInRiverDisplays(),
  ];

  assertEquals(
    new Set(runStages.map((item) => item.label)),
    new Set([
      "Before migration",
      "Beginning",
      "Building",
      "Peak",
      "Tapering",
      "Ending",
      "After migration",
      "Offseason",
    ]),
  );
  assertEquals(
    new Set(conditions.map((item) => item.label)),
    new Set([
      "Ahead",
      "Typical",
      "Delayed",
      "Insufficient evidence",
      "Not monitoring yet",
      "Evaluating",
      "Timing complete",
    ]),
  );
  assertEquals(
    new Set(pushDisplays().map((item) => item.label)),
    new Set([
      "Weak",
      "No clear push",
      "Possible",
      "Strong",
      "Very strong",
      "Unavailable",
      "Waiting for migration",
      "Migration complete",
      "Offseason",
    ]),
  );
  assertEquals(
    new Set(fishabilityDisplays().map((item) => item.label)),
    new Set([
      "Poor",
      "Tough",
      "Fishable",
      "Good",
      "Excellent",
      "Unavailable",
    ]),
  );
  assertEquals(
    new Set(fishInRiverDisplays().map((item) => item.label)),
    new Set([
      "Not expected yet",
      "Low presence",
      "Limited presence",
      "Moderate presence",
      "Peak presence",
      "Migration complete",
      "Offseason",
    ]),
  );

  for (const display of displays) {
    assertComplete(display);
    assertNoBanned(text(display));
  }
});

Deno.test("primitive copy stays dimension-specific", () => {
  for (
    const display of [
      resolveRunStage(run, "2026-08-10"),
      resolveRunStage(run, "2026-09-20"),
    ]
  ) {
    assertDimensionCopy(
      "Migration Stage",
      display,
      /river run|season|fish/i,
      [
        /\bcfs\b/i,
        /water temperature/i,
        /rainfall/i,
        /fishability score/i,
      ],
    );
  }
  for (
    const display of [
      conditionsFor("ahead"),
      conditionsFor("delayed"),
    ]
  ) {
    assertDimensionCopy(
      "Migration Timing",
      display,
      /run|seasonal pace|usual/i,
      [
        /\bcfs\b/i,
        /wading|boating safety/i,
        /fish count/i,
      ],
    );
  }
  for (const display of pushDisplays()) {
    assertDimensionCopy(
      "Push",
      display,
      /\bPush\b|fresh|movement/i,
      [
        /historical presence level/i,
        /earlier timing than typical/i,
        /wading|boating safety/i,
      ],
    );
    if (typeof display.score === "number") {
      assert(
        /fresh[- ](?:wave|fish|movement)/i.test(
          display.headline ?? "",
        ),
        `Active Push headline must explain fresh-fish movement: ${display.headline}`,
      );
    }
  }
  for (const display of fishabilityDisplays()) {
    assertDimensionCopy(
      "Fishability",
      display,
      /river|flow|Fishability/i,
      [
        /earlier timing than typical/i,
        /fresh-push signal/i,
        /historical presence level/i,
      ],
    );
  }
  for (const display of fishInRiverDisplays()) {
    assertDimensionCopy("Fish In River", display, /river|seasonal|fish/i, [
      /\bcfs\b/i,
      /water temperature/i,
      /rainfall/i,
    ]);
  }
});

Deno.test("interpretation copy has no banned phrases", () => {
  const notes = [
    resolveInterpretationNote({
      runStage: "building",
      conditionsSuggestLabel: "Typical",
      push: strongPush(),
      fishability: toughFishability(),
      fishInRiver: scoreFishInRiver(run, "2026-09-05"),
    }),
    resolveInterpretationNote({
      runStage: "pre_run",
      conditionsSuggestLabel: "Ahead",
      push: possiblePush(),
      fishability: goodFishability(),
      fishInRiver: scoreFishInRiver(run, "2026-08-15"),
    }),
    resolveInterpretationNote({
      runStage: "peak",
      conditionsSuggestLabel: "Typical",
      push: weakPush(),
      fishability: goodFishability(),
      fishInRiver: scoreFishInRiver(run, "2026-09-20"),
    }),
    resolveInterpretationNote({
      runStage: "beginning",
      conditionsSuggestLabel: "Typical",
      push: possiblePush(),
      fishability: excellentFishability(),
      fishInRiver: scoreFishInRiver(run, "2026-08-01"),
    }),
    resolveInterpretationNote({
      runStage: "building",
      conditionsSuggestLabel: "Delayed",
      push: strongPush(),
      fishability: goodFishability(),
      fishInRiver: scoreFishInRiver(run, "2026-09-05"),
    }),
  ];

  for (const note of notes) {
    assert(note);
    assert(note.headline.trim().length > 0);
    assert(note.detail.trim().length > 0);
    assert(note.reasonCodes.length > 0);
    assertNoBanned([note.headline, note.detail].join(" "));
  }
});

Deno.test("representative mixed reads remain composition-safe", () => {
  const cases: Array<{
    name: string;
    runStage: RunStage;
    conditionsSuggestLabel: ConditionsSuggestLabel;
    push: PrimitiveDisplay;
    fishability: PrimitiveDisplay;
    fishInRiver: PrimitiveDisplay;
    expectedNotes?: string[];
  }> = [
    {
      name: "Beginning + Ahead",
      runStage: "beginning",
      conditionsSuggestLabel: "Ahead",
      push: possiblePush(),
      fishability: goodFishability(),
      fishInRiver: scoreFishInRiver(run, "2026-08-15"),
      expectedNotes: [
        "beginning_ahead_conditions",
        "good_fishability_low_presence",
      ],
    },
    {
      name: "Before migration + Insufficient evidence",
      runStage: "pre_run",
      conditionsSuggestLabel: "Insufficient evidence",
      push: possiblePush(),
      fishability: goodFishability(),
      fishInRiver: scoreFishInRiver(run, "2026-08-15"),
    },
    {
      name: "Building + Typical + Weak Push",
      runStage: "building",
      conditionsSuggestLabel: "Typical",
      push: weakPush(),
      fishability: goodFishability(),
      fishInRiver: scoreFishInRiver(run, "2026-09-05"),
    },
    {
      name: "Peak + Weak Push",
      runStage: "peak",
      conditionsSuggestLabel: "Typical",
      push: weakPush(),
      fishability: goodFishability(),
      fishInRiver: scoreFishInRiver(run, "2026-09-20"),
      expectedNotes: ["peak_presence_weak_push"],
    },
    {
      name: "Peak + Delayed + Weak Push",
      runStage: "peak",
      conditionsSuggestLabel: "Delayed",
      push: weakPush(),
      fishability: goodFishability(),
      fishInRiver: scoreFishInRiver(run, "2026-09-20"),
      expectedNotes: [
        "peak_presence_weak_push",
        "peak_delayed_conditions",
      ],
    },
    {
      name: "Peak presence + Poor Fishability",
      runStage: "peak",
      conditionsSuggestLabel: "Typical",
      push: possiblePush(),
      fishability: poorFishability(),
      fishInRiver: scoreFishInRiver(run, "2026-09-20"),
    },
    {
      name: "Excellent Fishability + Very unlikely Fish In River",
      runStage: "pre_run",
      conditionsSuggestLabel: "Insufficient evidence",
      push: possiblePush(),
      fishability: excellentFishability(),
      fishInRiver: scoreFishInRiver(run, "2026-08-01"),
      expectedNotes: ["good_fishability_low_presence"],
    },
    {
      name: "Strong Push + Delayed Conditions Suggest",
      runStage: "building",
      conditionsSuggestLabel: "Delayed",
      push: strongPush(),
      fishability: goodFishability(),
      fishInRiver: scoreFishInRiver(run, "2026-09-05"),
      expectedNotes: ["delayed_conditions_strong_push"],
    },
    {
      name: "Strong Push + Low Fishability",
      runStage: "building",
      conditionsSuggestLabel: "Typical",
      push: strongPush(),
      fishability: toughFishability(),
      fishInRiver: scoreFishInRiver(run, "2026-09-05"),
      expectedNotes: ["strong_push_low_fishability"],
    },
    {
      name: "Strong Push + Delayed Conditions + Tough Fishability",
      runStage: "building",
      conditionsSuggestLabel: "Delayed",
      push: strongPush(),
      fishability: toughFishability(),
      fishInRiver: scoreFishInRiver(run, "2026-09-05"),
      expectedNotes: [
        "strong_push_low_fishability",
        "delayed_conditions_strong_push",
      ],
    },
    {
      name: "After migration + residual historical presence",
      runStage: "post_run",
      conditionsSuggestLabel: "Timing complete",
      push: pushForCopy({ trackingState: "complete" }),
      fishability: goodFishability(),
      fishInRiver: scoreFishInRiver(run, "2026-10-25"),
      expectedNotes: [
        "good_fishability_low_presence",
        "post_run_residual_presence",
      ],
    },
  ];

  for (const item of cases) {
    const displays = [item.push, item.fishability, item.fishInRiver];
    for (const display of displays) {
      assertComplete(display);
      assertNoBanned(text(display));
    }
    const note = resolveInterpretationNote(item);
    if (item.expectedNotes) {
      assertEquals(
        new Set(note?.reasonCodes),
        new Set(item.expectedNotes),
        `${item.name} should include the required interpretation note`,
      );
      assertNoBanned([note?.headline, note?.detail].join(" "));
    }
  }
});

function weakPush(): PrimitiveDisplay {
  return pushDisplays().find((item) => item.label === "Weak")!;
}

function possiblePush(): PrimitiveDisplay {
  return pushDisplays().find((item) => item.label === "Possible")!;
}

function strongPush(): PrimitiveDisplay {
  return pushDisplays().find((item) => item.label === "Strong")!;
}

function poorFishability(): PrimitiveDisplay {
  return fishabilityDisplays().find((item) => item.label === "Poor")!;
}

function toughFishability(): PrimitiveDisplay {
  return fishabilityDisplays().find((item) => item.label === "Tough")!;
}

function goodFishability(): PrimitiveDisplay {
  return fishabilityDisplays().find((item) => item.label === "Good")!;
}

function excellentFishability(): PrimitiveDisplay {
  return fishabilityDisplays().find((item) => item.label === "Excellent")!;
}
