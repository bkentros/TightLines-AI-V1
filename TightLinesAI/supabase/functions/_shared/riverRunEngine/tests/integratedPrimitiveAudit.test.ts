import { assert, assertEquals } from "jsr:@std/assert";
import {
  addDays,
  canonicalBaselineDay,
  type ConditionsSuggestCheckpoint,
  type ConditionsSuggestEvidenceByDate,
  type ConditionsSuggestLabel,
  daysBetween,
  PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
  type PrimitiveDisplay,
  resolveConditionsSuggestCheckpoints,
  resolveInterpretationNote,
  resolveRunStage,
  type RiverRunConditionsSuggestBaseline,
  type RiverRunReasonCode,
  type RunStage,
  scoreConditionsSuggest,
  scoreFishability,
  scoreFishInRiver,
  scorePush,
} from "../index.ts";

const run = PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE;
const prohibitedCopy = [
  /catch probability/i,
  /\bguarantee(?:d)?\b/i,
  /\bloaded\b/i,
  /\bstacked\b/i,
  /hot bite/i,
  /\b(?:shows|confirms|proves) (?:that )?fish (?:moved|entered)\b/i,
  /\bfish are entering\b/i,
  /\b(?:safe|unsafe) to (?:wade|boat|float)\b/i,
  /\b(?:clear|stained|turbid) water\b/i,
] as const;

Deno.test("integrated PM copy matrix explains every simultaneous disagreement", () => {
  const stages = stageVariants();
  const conditions = conditionsVariants();
  const pushes = pushVariants();
  const fishabilities = fishabilityVariants();
  const presence = presenceVariants();

  assertEquals(
    new Set(stages.map((item) => item.stage)),
    new Set([
      "pre_run",
      "beginning",
      "building",
      "peak",
      "tapering",
      "ending",
      "post_run",
    ]),
  );
  assertEquals(
    new Set(conditions.map((item) => item.label)),
    new Set([
      "Ahead",
      "Typical",
      "Delayed",
      "Insufficient evidence",
      "Evaluating",
      "Timing complete",
    ]),
  );
  assertEquals(
    new Set(pushes.map((item) => item.label)),
    new Set([
      "Weak",
      "No clear push",
      "Possible",
      "Strong",
      "Very strong",
      "Unavailable",
      "Waiting for run",
      "Run complete",
    ]),
  );
  assertEquals(
    new Set(fishabilities.map((item) => item.label)),
    new Set([
      "Poor",
      "Tough",
      "Fishable",
      "Good",
      "Excellent",
      "Unavailable",
    ]),
  );
  const presenceScores = presence.map((item) => item.score!);
  assertEquals(Math.min(...presenceScores), 0);
  assertEquals(Math.max(...presenceScores), 100);
  assert(
    presenceScores.every((value) =>
      Number.isInteger(value) && value >= 0 && value <= 100
    ),
  );

  const displays = [
    ...stages.map((item) => item.display),
    ...conditions,
    ...pushes,
    ...fishabilities,
    ...presence,
  ];
  for (const display of displays) auditDisplay(display);

  let combinations = 0;
  let multiFindingCombinations = 0;
  for (const stage of stages) {
    for (const condition of conditions) {
      for (const push of pushes) {
        for (const fishability of fishabilities) {
          for (const fishInRiver of presence) {
            combinations++;
            const expected = expectedInterpretationCodes({
              runStage: stage.stage,
              conditionsSuggestLabel: condition.label,
              push,
              fishability,
              fishInRiver,
            });
            const note = resolveInterpretationNote({
              runStage: stage.stage,
              conditionsSuggestLabel: condition.label,
              push,
              fishability,
              fishInRiver,
            });
            if (expected.length === 0) {
              assertEquals(note, undefined);
              continue;
            }
            assert(note);
            assertEquals(
              new Set(note.reasonCodes),
              new Set(expected),
              `unexplained combination: ${stage.stage} / ${condition.label} / ${push.label} / ${fishability.label} / ${fishInRiver.score}`,
            );
            assert(note.headline.trim().length > 0);
            assert(note.detail.trim().length > 0);
            assert(note.detail.length <= 900);
            assertEquals(
              /(?:^|\s)\d+\.\s/.test(note.detail),
              false,
              "How to Read Today must not use inline numbered paragraphs",
            );
            if (expected.length > 1) {
              assertEquals(
                note.detail.split("\n\n").length,
                expected.length,
                "Each mixed-read finding must render as its own clean paragraph",
              );
            }
            auditCopy(`${note.headline} ${note.detail}`);
            if (expected.length > 1) multiFindingCombinations++;
          }
        }
      }
    }
  }

  assertEquals(combinations, 129_024);
  assert(multiFindingCombinations > 0);
});

Deno.test("integrated PM season boundaries cannot retain an active Push", () => {
  const strongInputs = {
    movementEngineId: run.movementEngineId,
    rules: run.push,
    gaugeFreshness: "fresh" as const,
    rainSignal: "strong_rain" as const,
    flowSignal: "sharp_rise" as const,
    currentHydraulicValue: 650,
    hydraulicAbsoluteChange24h: 100,
    hydraulicPercentChange24h: 18,
    temperatureSignal: "strong_cooling" as const,
    temperatureSourceType: "same_gauge" as const,
    waterTempF: 58,
    trackingStartDate: "2026-08-15",
    trackingEndDate: "2026-10-20",
  };
  const before = scorePush({
    ...strongInputs,
    trackingState: "not_started",
  });
  const after = scorePush({
    ...strongInputs,
    trackingState: "complete",
  });

  assertEquals(before.score, null);
  assertEquals(before.label, "Waiting for run");
  assertEquals(after.score, null);
  assertEquals(after.label, "Run complete");
});

Deno.test("integrated historical presence honors lower river-specific caps", () => {
  const cappedRun = {
    ...run,
    historicalPresence: {
      ...run.historicalPresence,
      maximum: 6 as const,
    },
  };
  const values: number[] = [];
  for (
    let localDate = "2026-07-20";
    localDate <= "2026-11-10";
    localDate = addDays(localDate, 1)
  ) {
    values.push(scoreFishInRiver(cappedRun, localDate).score!);
  }

  assertEquals(Math.max(...values), 60);
  assert(values.every((value) => value >= 0 && value <= 60));
});

function expectedInterpretationCodes(input: {
  runStage: RunStage;
  conditionsSuggestLabel: ConditionsSuggestLabel;
  push: PrimitiveDisplay;
  fishability: PrimitiveDisplay;
  fishInRiver: PrimitiveDisplay;
}): RiverRunReasonCode[] {
  const codes: RiverRunReasonCode[] = [];
  if (isAtLeast(input.push, 70) && isAtMost(input.fishability, 49)) {
    codes.push("strong_push_low_fishability");
  }
  if (
    input.conditionsSuggestLabel === "Ahead" &&
    input.runStage === "beginning"
  ) {
    codes.push("beginning_ahead_conditions");
  }
  if (input.runStage === "peak" && isAtMost(input.push, 49)) {
    codes.push("peak_presence_weak_push");
  }
  if (
    isAtLeast(input.fishability, 70) &&
    presenceFraction(input.fishInRiver) <= 0.3
  ) {
    codes.push("good_fishability_low_presence");
  }
  if (
    input.conditionsSuggestLabel === "Delayed" &&
    isAtLeast(input.push, 70)
  ) {
    codes.push("delayed_conditions_strong_push");
  }
  if (
    input.runStage === "post_run" &&
    typeof input.fishInRiver.score === "number" &&
    input.fishInRiver.score > 0
  ) {
    codes.push("post_run_residual_presence");
  }
  return codes;
}

function stageVariants(): Array<{
  stage: RunStage;
  display: ReturnType<typeof resolveRunStage>;
}> {
  return [
    "2026-08-01",
    "2026-08-15",
    "2026-08-25",
    "2026-09-20",
    "2026-10-05",
    "2026-10-22",
    "2026-10-28",
  ].map((localDate) => {
    const display = resolveRunStage(run, localDate);
    return { stage: display.stage, display };
  });
}

function conditionsVariants(): ReturnType<typeof scoreConditionsSuggest>[] {
  return [
    conditionsFor("ahead"),
    conditionsFor("typical"),
    conditionsFor("delayed"),
    conditionsFor("insufficient"),
    conditionsFor("evaluating"),
    conditionsFor("complete"),
  ];
}

function conditionsFor(
  kind:
    | "ahead"
    | "typical"
    | "delayed"
    | "insufficient"
    | "evaluating"
    | "complete",
): ReturnType<typeof scoreConditionsSuggest> {
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
  const expectedDays = daysBetween(
    checkpoint.observationStartDate,
    checkpoint.cutoffDate,
  ) + 1;
  return {
    riverId: run.riverId,
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
    historicalSamples: [10, 30, 50, 70, 90].map((
      evidenceIndex,
      index,
    ) => ({
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
    sourceNotes: "Integrated audit fixture.",
  };
}

function pushVariants(): PrimitiveDisplay[] {
  const base = {
    movementEngineId: run.movementEngineId,
    rules: run.push,
    gaugeFreshness: "fresh" as const,
    flowSignal: "stable" as const,
    currentHydraulicValue: 550,
    hydraulicAbsoluteChange24h: 0,
    hydraulicPercentChange24h: 0,
    rainSignal: "light_rain" as const,
    temperatureSignal: "neutral" as const,
    temperatureSourceType: "same_gauge" as const,
    waterTempF: 60,
    trackingState: "active" as const,
    trackingStartDate: "2026-08-15",
    trackingEndDate: "2026-10-20",
  };
  return [
    scorePush({
      ...base,
      flowSignal: "falling",
      rainSignal: "dry",
      temperatureSignal: "strong_warming",
      waterTempF: 69,
    }),
    scorePush(base),
    scorePush({
      ...base,
      flowSignal: "rising",
      hydraulicAbsoluteChange24h: 20,
      hydraulicPercentChange24h: 3,
      rainSignal: "meaningful_rain",
      temperatureSignal: "cooling",
    }),
    scorePush({
      ...base,
      flowSignal: "meaningful_rise",
      hydraulicAbsoluteChange24h: 50,
      hydraulicPercentChange24h: 8,
      rainSignal: "heavy_rain",
      temperatureSignal: "strong_cooling",
    }),
    scorePush({
      ...base,
      flowSignal: "sharp_rise",
      hydraulicAbsoluteChange24h: 100,
      hydraulicPercentChange24h: 15,
      rainSignal: "strong_rain",
      temperatureSignal: "strong_cooling",
    }),
    scorePush({
      ...base,
      gaugeFreshness: "missing",
      currentHydraulicValue: null,
    }),
    scorePush({ ...base, trackingState: "not_started" }),
    scorePush({ ...base, trackingState: "complete" }),
  ];
}

function fishabilityVariants(): PrimitiveDisplay[] {
  const score = (
    flowBand:
      | "very_low"
      | "low"
      | "normal_fishable"
      | "ideal"
      | "high_fishable"
      | "very_high"
      | "blown_out"
      | undefined,
    flowSignal:
      | "unknown"
      | "falling"
      | "stable"
      | "rising"
      | "meaningful_rise"
      | "sharp_rise",
    value: number | null,
  ) =>
    scoreFishability({
      rules: run.fishabilityBands,
      gaugeFreshness: value == null ? "missing" : "fresh",
      flowBand,
      flowSignal,
      currentHydraulicValue: value,
      hydraulicAbsoluteChange24h: 0,
      hydraulicPercentChange24h: 0,
    });
  return [
    score("blown_out", "sharp_rise", 1_700),
    score("very_high", "stable", 1_200),
    score("low", "stable", 450),
    score("normal_fishable", "stable", 500),
    score("ideal", "stable", 600),
    score(undefined, "unknown", null),
  ];
}

function presenceVariants(): ReturnType<typeof scoreFishInRiver>[] {
  const byScore = new Map<number, ReturnType<typeof scoreFishInRiver>>();
  for (
    let localDate = "2026-07-20";
    localDate <= "2026-11-10";
    localDate = addDays(localDate, 1)
  ) {
    const display = scoreFishInRiver(run, localDate);
    if (!byScore.has(display.score!)) byScore.set(display.score!, display);
  }
  return [...byScore.values()].toSorted((a, b) => a.score! - b.score!);
}

function auditDisplay(display: PrimitiveDisplay): void {
  assert(display.label.trim().length > 0);
  assert(display.headline.trim().length > 0);
  assert(display.detail.trim().length > 0);
  assert(display.tip.trim().length > 0);
  assert(
    /^(?:Begin|Start|Fish|Keep|Skip|Leave|Do not|Stop|Choose|Stay|Concentrate|Target|Work|Check|Cover)\b/
      .test(
        display.tip.trim(),
      ),
    `Guide's Read must lead with a concrete action: ${display.tip}`,
  );
  assertEquals(
    /\blet\b.+\bdecide\b|should be practical|keep(?:ing)? expectations (?:measured|conservative)|^focus on\b|use your judgment|postpone (?:the )?river trip/i
      .test(display.tip),
    false,
    `Guide's Read is too open-ended: ${display.tip}`,
  );
  assert(display.reasonCodes.length > 0);
  auditCopy(
    `${display.label} ${display.headline} ${display.detail} ${display.tip}`,
  );
}

function auditCopy(copy: string): void {
  for (const pattern of prohibitedCopy) {
    assertEquals(
      pattern.test(copy),
      false,
      `prohibited copy ${pattern}: ${copy}`,
    );
  }
}

function isAtLeast(display: PrimitiveDisplay, threshold: number): boolean {
  return typeof display.score === "number" && display.score >= threshold;
}

function isAtMost(display: PrimitiveDisplay, threshold: number): boolean {
  return typeof display.score === "number" && display.score <= threshold;
}

function presenceFraction(display: PrimitiveDisplay): number {
  if (typeof display.score !== "number") return Number.POSITIVE_INFINITY;
  const riverCeiling =
    (display as PrimitiveDisplay & { riverCeiling?: number }).riverCeiling;
  return typeof riverCeiling === "number" && riverCeiling > 0
    ? display.score / riverCeiling
    : display.score / 100;
}
