import { assertEquals } from "jsr:@std/assert";
import {
  addDays,
  type FlowBand,
  type PrimitiveDisplay,
  resolveRunStage,
  RIVER_RUN_CONFIGURATION_DOCUMENTS,
  type RunStage,
  scoreActivity,
  scoreFishability,
  scoreFishInRiver,
  unavailableActivity,
  unavailableFishability,
} from "../index.ts";

const retiredPrimitiveReference = /\bpush\b|\btiming\b/i;
const publicCopyFields = [
  "label",
  "headline",
  "whereToStart",
  "detail",
  "tip",
] as const;

Deno.test("all public primitive copy excludes retired primitives", () => {
  const runs = RIVER_RUN_CONFIGURATION_DOCUMENTS.flatMap((document) =>
    document.runs
  );

  assertEquals(RIVER_RUN_CONFIGURATION_DOCUMENTS.length, 12);
  assertEquals(runs.length, 41);
  assertEquals(
    new Set(runs.map((run) => run.species)),
    new Set([
      "chinook_salmon",
      "coho_salmon",
      "steelhead",
      "lake_run_brown_trout",
    ]),
  );

  for (const document of RIVER_RUN_CONFIGURATION_DOCUMENTS) {
    assertEquals(
      retiredPrimitiveReference.test(document.river.gaugeLimitationCopy),
      false,
      `${document.river.riverId} gauge limitation references a retired primitive: ${document.river.gaugeLimitationCopy}`,
    );
  }

  for (const run of runs) {
    for (
      let localDate = "2026-01-01";
      localDate <= "2026-12-31";
      localDate = addDays(localDate, 1)
    ) {
      auditPublicDisplay(
        "Migration Stage",
        run.runId,
        localDate,
        resolveRunStage(run, localDate),
      );
      auditPublicDisplay(
        "Fish In River",
        run.runId,
        localDate,
        scoreFishInRiver(run, localDate),
      );
    }

    const activityCapability = run.primitiveCapabilities.activity;
    if (activityCapability.status === "available" && run.activity) {
      for (const stage of PUBLIC_STAGES) {
        auditPublicDisplay(
          "Activity",
          run.runId,
          stage,
          scoreActivity({
            rules: run.activity,
            requestDate: "2026-10-10",
            targetDate: "2026-10-10",
            runStage: stage,
            staging: stage === "pre_run",
            waterTempF: 52,
            temperatureTrend: "neutral",
            gaugeFreshness: "fresh",
            weatherFreshness: "fresh",
            flowBand: "ideal",
            currentHydraulicValue: 500,
            fishabilityBands: run.fishabilityBands,
            flowSignal: "stable",
            hourlyWeather: representativeWeather("2026-10-10"),
            refreshSlot: "12:00",
            copyStrategy: run.runStageCopyStrategy,
          }),
        );
      }
    } else {
      auditPublicDisplay(
        "Activity",
        run.runId,
        "unavailable",
        unavailableActivity({
          reason: activityCapability.status === "unavailable"
            ? activityCapability.reason
            : "no_accepted_activity_calibration",
          requestDate: "2026-10-10",
          publicCopy: activityCapability.status === "unavailable"
            ? activityCapability.publicCopy
            : undefined,
        }),
      );
    }

    const fishabilityCapability = run.primitiveCapabilities.fishability;
    if (fishabilityCapability.status === "available" && run.fishabilityBands) {
      for (const flowBand of PUBLIC_FLOW_BANDS) {
        auditPublicDisplay(
          "Fishability",
          run.runId,
          flowBand,
          scoreFishability({
            rules: run.fishabilityBands,
            gaugeFreshness: "fresh",
            flowBand,
            flowSignal: flowBand === "very_high" || flowBand === "blown_out"
              ? "sharp_rise"
              : "stable",
            currentHydraulicValue: 500,
            localDate: "2026-10-10",
            copyStrategy: run.runStageCopyStrategy,
          }),
        );
      }
    } else {
      auditPublicDisplay(
        "Fishability",
        run.runId,
        "unavailable",
        unavailableFishability(
          fishabilityCapability.status === "unavailable"
            ? fishabilityCapability.reason
            : "no_accepted_hydraulic_source",
          run.runStageCopyStrategy,
        ),
      );
    }
  }
});

const PUBLIC_STAGES: RunStage[] = [
  "pre_run",
  "beginning",
  "building",
  "peak",
  "tapering",
  "ending",
  "post_run",
];

const PUBLIC_FLOW_BANDS: FlowBand[] = [
  "very_low",
  "low",
  "normal_fishable",
  "ideal",
  "high_fishable",
  "very_high",
  "blown_out",
];

function representativeWeather(localDate: string) {
  return Array.from({ length: 24 }, (_, hour) => ({
    time_local: `${localDate}T${String(hour).padStart(2, "0")}:00`,
    cloud_cover_pct: 70,
    shortwave_w_m2: hour >= 8 && hour <= 18 ? 280 : 0,
    clear_sky_shortwave_w_m2: hour >= 8 && hour <= 18 ? 650 : 0,
    precipitation_in: hour >= 6 && hour <= 8 ? 0.01 : 0,
  }));
}

function auditPublicDisplay(
  primitiveName: string,
  runId: string,
  localDate: string,
  display: Pick<
    PrimitiveDisplay,
    "label" | "headline" | "whereToStart" | "detail" | "tip"
  >,
) {
  for (const field of publicCopyFields) {
    const value = display[field];
    if (typeof value !== "string") continue;
    assertEquals(
      retiredPrimitiveReference.test(value),
      false,
      `${runId} ${localDate} ${primitiveName}.${field} references a retired primitive: ${value}`,
    );
  }
}
