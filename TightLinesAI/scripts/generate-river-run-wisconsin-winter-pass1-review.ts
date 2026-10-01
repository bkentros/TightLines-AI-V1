import {
  RIVER_RUN_RIVER_PROFILES,
  RIVER_RUN_RUN_PROFILES,
  WISCONSIN_WINTER_PASS1_DECISIONS,
  WISCONSIN_WINTER_PASS1_EXCLUSIONS,
  WISCONSIN_WINTER_PASS1_SOURCE_LEDGER,
} from "../supabase/functions/_shared/riverRunEngine/index.ts";
import { riverRunSpotFinderForRiver } from "../lib/riverRunSpotFinder.ts";

const OUTPUT = new URL(
  "../docs/audits/river-run-wisconsin-winter-pass1-review.json",
  import.meta.url,
);
const riversById = new Map(
  RIVER_RUN_RIVER_PROFILES.map((river) => [river.riverId, river]),
);
const runsById = new Map(
  RIVER_RUN_RUN_PROFILES.map((run) => [run.runId, run]),
);

const review = {
  schemaVersion: "wisconsin-winter-pass1-review-v1",
  decisionDate: "2026-09-28",
  status: "implementation_specification_only",
  releaseSafety: {
    winterProfilesRegisteredAtPass1: false,
    productionAllowlistChangedByPass1: false,
    historicalActivityCalibrationDeferredToPass2: true,
  },
  sourceLedger: WISCONSIN_WINTER_PASS1_SOURCE_LEDGER,
  exclusions: WISCONSIN_WINTER_PASS1_EXCLUSIONS,
  rivers: WISCONSIN_WINTER_PASS1_DECISIONS.map((decision) => {
    const river = riversById.get(decision.riverId);
    if (!river) throw new Error(`Missing river ${decision.riverId}`);
    if (!river.foundation) {
      throw new Error(`Missing river foundation ${decision.riverId}`);
    }
    const foundation = river.foundation;
    return {
      riverId: decision.riverId,
      displayName: decision.displayName,
      legalSeasonNotes: decision.legalSeasonNotes,
      gaugeAuditNotes: decision.gaugeAuditNotes,
      species: decision.species.map((species) => {
        const fall = runsById.get(species.fallRunId);
        if (!fall) throw new Error(`Missing fall run ${species.fallRunId}`);
        const finder = riverRunSpotFinderForRiver(
          decision.riverId,
          species.species,
          "WI",
        );
        return {
          species: species.species,
          fallRunId: species.fallRunId,
          fallEnd: fall.runWindow.end,
          futureRunId: species.futureRunId,
          futureRunRegisteredAtPass1: false,
          activationMonthDay: species.activationMonthDay,
          winterEndMonthDay: species.endMonthDay,
          exactNextDayHandoff:
            species.activationMonthDay === nextMonthDay(fall.runWindow.end),
          startingPresenceFraction: species.startingPresenceFraction,
          activityMode: species.activityMode,
          corridorReachIds: species.corridorReachIds,
          preferredStartReachIds: species.preferredStartReachIds,
          activityReachIds: species.activityReachIds,
          hydraulicSourceIds: species.hydraulicSourceIds,
          waterTemperatureSourceIds: species.waterTemperatureSourceIds,
          weatherPointIds: species.weatherPointIds,
          sourceResolution: {
            reaches: species.corridorReachIds.every((id) =>
              foundation.reaches.some((reach) => reach.reachId === id)
            ),
            hydraulics: species.hydraulicSourceIds.every((id) =>
              river.hydraulicSources.some((source) => source.sourceId === id)
            ),
            waterTemperature: species.waterTemperatureSourceIds.every((id) =>
              river.waterTemperatureSources.some((source) =>
                source.sourceId === id
              )
            ),
            weather: species.weatherPointIds.every((id) =>
              river.weatherPoints.some((point) => point.weatherPointId === id)
            ),
          },
          spotFinderSectionIds: finder?.sections.map((section) => section.id) ??
            [],
          lifecycleContract: species.lifecycleContract,
          evidenceNotes: species.evidenceNotes,
        };
      }),
    };
  }),
};

const serialized = `${JSON.stringify(review, null, 2)}\n`;

if (Deno.args.includes("--check")) {
  const current = await Deno.readTextFile(OUTPUT);
  if (current !== serialized) {
    throw new Error("Wisconsin winter Pass 1 review artifact is stale.");
  }
  console.log("Wisconsin winter Pass 1 review artifact is current.");
} else {
  await Deno.writeTextFile(OUTPUT, serialized);
  console.log(`Wrote ${OUTPUT.pathname}`);
}

function nextMonthDay(monthDay: string): string {
  const [month, day] = monthDay.split("-").map(Number);
  const date = new Date(Date.UTC(2000, month - 1, day));
  date.setUTCDate(date.getUTCDate() + 1);
  const nextMonth = String(date.getUTCMonth() + 1).padStart(2, "0");
  const nextDay = String(date.getUTCDate()).padStart(2, "0");
  return `${nextMonth}-${nextDay}`;
}
