import { assert, assertEquals } from "jsr:@std/assert";
import {
  addDays,
  PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
  type PrimitiveDisplay,
  resolveInterpretationNote,
  resolveRunStage,
  type RunStage,
  type ScheduleLabel,
  type ScheduleRefreshesByDate,
  scoreFishability,
  scoreFishInRiver,
  scorePush,
  scoreSchedule,
} from "../index.ts";

const run = PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE;

const bannedPhrases = [
  /catch probability/i,
  /\bguarantee(?:d)?\b/i,
  /\bloaded\b/i,
  /\bstacked\b/i,
  /hot bite/i,
  /fall_cooling_rain_pulse/i,
] as const;

function refreshes(
  localDate: string,
  favorabilityIndex: number,
): ScheduleRefreshesByDate {
  const result: ScheduleRefreshesByDate = {};
  for (let offset = -7; offset <= -1; offset++) {
    result[addDays(localDate, offset)] = {
      "16:00": {
        favorabilityIndex,
        gaugeFreshness: "fresh",
        missingNonGaugeInputCount: 0,
        reasonCodes: ["gauge_fresh"],
      },
    };
  }
  return result;
}

function scheduleFor(localDate: string, favorabilityIndex: number) {
  const stage = resolveRunStage(run, localDate);
  return scoreSchedule({
    localDate,
    stage: stage.stage,
    window: stage.window,
    refreshesByDate: refreshes(localDate, favorabilityIndex),
  });
}

function text(display: PrimitiveDisplay): string {
  return [
    display.label,
    display.headline,
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
    scorePush({
      behaviorProfile: "fall_cooling_rain_pulse",
      gaugeFreshness: "fresh",
      rainSignal: "dry",
      flowSignal: "falling",
      temperatureSignal: "strong_warming",
      temperatureSourceType: "same_gauge",
      flowBand: "low",
    }),
    scorePush({
      behaviorProfile: "fall_cooling_rain_pulse",
      gaugeFreshness: "fresh",
      rainSignal: "dry",
      flowSignal: "stable",
      temperatureSignal: "neutral",
      temperatureSourceType: "same_gauge",
      flowBand: "low",
    }),
    scorePush({
      behaviorProfile: "fall_cooling_rain_pulse",
      gaugeFreshness: "fresh",
      rainSignal: "meaningful_rain",
      flowSignal: "rising",
      temperatureSignal: "cooling",
      temperatureSourceType: "same_gauge",
    }),
    scorePush({
      behaviorProfile: "fall_cooling_rain_pulse",
      gaugeFreshness: "fresh",
      rainSignal: "meaningful_rain",
      flowSignal: "rising",
      temperatureSignal: "cooling",
      temperatureSourceType: "same_gauge",
      flowBand: "ideal",
    }),
    scorePush({
      behaviorProfile: "fall_cooling_rain_pulse",
      gaugeFreshness: "fresh",
      rainSignal: "heavy_rain",
      flowSignal: "meaningful_rise",
      temperatureSignal: "strong_cooling",
      temperatureSourceType: "same_gauge",
      flowBand: "ideal",
    }),
    scorePush({
      behaviorProfile: "fall_cooling_rain_pulse",
      gaugeFreshness: "missing",
      rainSignal: "heavy_rain",
      flowSignal: "meaningful_rise",
      temperatureSignal: "strong_cooling",
      temperatureSourceType: "same_gauge",
      flowBand: "ideal",
    }),
  ];
}

function fishabilityDisplays(): PrimitiveDisplay[] {
  return [
    scoreFishability({
      gaugeFreshness: "fresh",
      weatherFreshness: "fresh",
      flowBand: "blown_out",
      flowSignal: "sharp_rise",
      rainSignal: "heavy_rain",
    }),
    scoreFishability({
      gaugeFreshness: "fresh",
      weatherFreshness: "fresh",
      flowBand: "blown_out",
      flowSignal: "stable",
      rainSignal: "dry",
    }),
    scoreFishability({
      gaugeFreshness: "fresh",
      weatherFreshness: "fresh",
      flowBand: "low",
      flowSignal: "stable",
      rainSignal: "dry",
    }),
    scoreFishability({
      gaugeFreshness: "fresh",
      weatherFreshness: "fresh",
      flowBand: "normal_fishable",
      flowSignal: "stable",
      rainSignal: "dry",
    }),
    scoreFishability({
      gaugeFreshness: "fresh",
      weatherFreshness: "fresh",
      flowBand: "ideal",
      flowSignal: "stable",
      rainSignal: "dry",
    }),
    scoreFishability({
      gaugeFreshness: "fresh",
      weatherFreshness: "fresh",
      flowSignal: "stable",
      rainSignal: "dry",
    }),
  ];
}

function fishInRiverDisplays(): PrimitiveDisplay[] {
  return [
    scoreFishInRiver(run, "2026-08-01"),
    scoreFishInRiver(run, "2026-08-15"),
    scoreFishInRiver(run, "2026-08-25"),
    scoreFishInRiver(run, "2026-09-05"),
    scoreFishInRiver(run, "2026-09-20"),
  ];
}

Deno.test("primitive copy is complete for every reachable label", () => {
  const runStages = [
    resolveRunStage(run, "2026-08-10"),
    resolveRunStage(run, "2026-08-25"),
    resolveRunStage(run, "2026-09-10"),
    resolveRunStage(run, "2026-09-20"),
    resolveRunStage(run, "2026-10-01"),
    resolveRunStage(run, "2026-10-15"),
    resolveRunStage(run, "2026-11-05"),
  ];
  const schedules = [
    scheduleFor("2026-08-15", 6),
    scheduleFor("2026-09-20", 0),
    scheduleFor("2026-09-10", -2),
    scoreSchedule({
      localDate: "2026-09-10",
      stage: "building",
      window: resolveRunStage(run, "2026-09-10").window,
      refreshesByDate: {},
    }),
  ];
  const displays = [
    ...runStages,
    ...schedules,
    ...pushDisplays(),
    ...fishabilityDisplays(),
    ...fishInRiverDisplays(),
  ];

  assertEquals(
    new Set(runStages.map((item) => item.label)),
    new Set([
      "Pre-run",
      "Beginning",
      "Building",
      "Peak",
      "Tapering",
      "Ending",
      "Post-run",
    ]),
  );
  assertEquals(
    new Set(schedules.map((item) => item.label)),
    new Set(["Ahead", "On schedule", "Behind", "Uncertain"]),
  );
  assertEquals(
    new Set(pushDisplays().map((item) => item.label)),
    new Set([
      "Weak",
      "Limited",
      "Possible",
      "Strong",
      "Very strong",
      "Unavailable",
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
      "Very unlikely",
      "A few possible",
      "Building presence",
      "Likely present",
      "Peak presence",
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
      "Run Stage",
      display,
      /calendar|configured run window/i,
      [
        /broader progression/i,
        /movement signal/i,
        /river shape/i,
        /seasonal presence/i,
      ],
    );
  }
  for (
    const display of [
      scheduleFor("2026-08-15", 6),
      scheduleFor("2026-09-10", -2),
    ]
  ) {
    assertDimensionCopy(
      "Schedule",
      display,
      /broader progression|completed-day/i,
      [
        /movement signal/i,
        /river shape/i,
        /seasonal presence/i,
      ],
    );
  }
  for (const display of pushDisplays()) {
    assertDimensionCopy("Push", display, /movement signal/i, [
      /river shape/i,
      /seasonal presence/i,
    ]);
  }
  for (const display of fishabilityDisplays()) {
    assertDimensionCopy("Fishability", display, /river shape/i, [
      /movement signal/i,
      /seasonal presence/i,
    ]);
  }
  for (const display of fishInRiverDisplays()) {
    assertDimensionCopy("Fish In River", display, /seasonal presence/i, [
      /movement signal/i,
      /river shape/i,
    ]);
  }
});

Deno.test("interpretation copy has no banned phrases", () => {
  const notes = [
    resolveInterpretationNote({
      runStage: "building",
      scheduleLabel: "On schedule",
      push: strongPush(),
      fishability: toughFishability(),
      fishInRiver: scoreFishInRiver(run, "2026-09-05"),
    }),
    resolveInterpretationNote({
      runStage: "pre_run",
      scheduleLabel: "Ahead",
      push: possiblePush(),
      fishability: goodFishability(),
      fishInRiver: scoreFishInRiver(run, "2026-08-15"),
    }),
    resolveInterpretationNote({
      runStage: "peak",
      scheduleLabel: "On schedule",
      push: weakPush(),
      fishability: goodFishability(),
      fishInRiver: scoreFishInRiver(run, "2026-09-20"),
    }),
    resolveInterpretationNote({
      runStage: "beginning",
      scheduleLabel: "On schedule",
      push: possiblePush(),
      fishability: excellentFishability(),
      fishInRiver: scoreFishInRiver(run, "2026-08-01"),
    }),
    resolveInterpretationNote({
      runStage: "building",
      scheduleLabel: "Behind",
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
    scheduleLabel: ScheduleLabel;
    push: PrimitiveDisplay;
    fishability: PrimitiveDisplay;
    fishInRiver: PrimitiveDisplay;
    expectedNote?: string;
  }> = [
    {
      name: "Pre-run + Ahead",
      runStage: "pre_run",
      scheduleLabel: "Ahead",
      push: possiblePush(),
      fishability: goodFishability(),
      fishInRiver: scoreFishInRiver(run, "2026-08-15"),
      expectedNote: "pre_run_ahead_schedule",
    },
    {
      name: "Pre-run + Uncertain",
      runStage: "pre_run",
      scheduleLabel: "Uncertain",
      push: possiblePush(),
      fishability: goodFishability(),
      fishInRiver: scoreFishInRiver(run, "2026-08-15"),
    },
    {
      name: "Building + On schedule + Weak Push",
      runStage: "building",
      scheduleLabel: "On schedule",
      push: weakPush(),
      fishability: goodFishability(),
      fishInRiver: scoreFishInRiver(run, "2026-09-05"),
    },
    {
      name: "Peak + Weak Push",
      runStage: "peak",
      scheduleLabel: "On schedule",
      push: weakPush(),
      fishability: goodFishability(),
      fishInRiver: scoreFishInRiver(run, "2026-09-20"),
      expectedNote: "peak_presence_weak_push",
    },
    {
      name: "Peak presence + Poor Fishability",
      runStage: "peak",
      scheduleLabel: "On schedule",
      push: possiblePush(),
      fishability: poorFishability(),
      fishInRiver: scoreFishInRiver(run, "2026-09-20"),
    },
    {
      name: "Excellent Fishability + Very unlikely Fish In River",
      runStage: "pre_run",
      scheduleLabel: "Uncertain",
      push: possiblePush(),
      fishability: excellentFishability(),
      fishInRiver: scoreFishInRiver(run, "2026-08-01"),
      expectedNote: "good_fishability_low_presence",
    },
    {
      name: "Strong Push + Behind Schedule",
      runStage: "building",
      scheduleLabel: "Behind",
      push: strongPush(),
      fishability: goodFishability(),
      fishInRiver: scoreFishInRiver(run, "2026-09-05"),
      expectedNote: "behind_schedule_strong_push",
    },
    {
      name: "Strong Push + Low Fishability",
      runStage: "building",
      scheduleLabel: "On schedule",
      push: strongPush(),
      fishability: toughFishability(),
      fishInRiver: scoreFishInRiver(run, "2026-09-05"),
      expectedNote: "strong_push_low_fishability",
    },
  ];

  for (const item of cases) {
    const displays = [item.push, item.fishability, item.fishInRiver];
    for (const display of displays) {
      assertComplete(display);
      assertNoBanned(text(display));
    }
    const note = resolveInterpretationNote(item);
    if (item.expectedNote) {
      assertEquals(
        note?.reasonCodes,
        [item.expectedNote],
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
