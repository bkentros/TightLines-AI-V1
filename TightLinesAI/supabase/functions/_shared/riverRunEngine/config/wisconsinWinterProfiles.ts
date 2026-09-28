import type {
  ActivityRules,
  AuditedRiverRunProfile,
  RiverRunConfigurationDocument,
} from "../types.ts";
import { getMovementEngineDefinition } from "./movementEngines.ts";
import {
  GREAT_LAKES_LAKE_RUN_BROWN_TROUT_WINTER_HOLDING_BIOLOGY_PROFILE,
  GREAT_LAKES_STEELHEAD_WINTER_HOLDING_BIOLOGY_PROFILE,
} from "./speciesBiology.ts";
import {
  WISCONSIN_WINTER_PASS1_DECISIONS,
  type WisconsinWinterRiverDecision,
  type WisconsinWinterSpeciesDecision,
} from "./wisconsinWinterPass1.ts";
import {
  MILWAUKEE_CONFIGURATION_DOCUMENT,
  MILWAUKEE_FALL_BROWN_TROUT_RUN_PROFILE,
  MILWAUKEE_FALL_STEELHEAD_RUN_PROFILE,
} from "./onboarding/milwaukee.ts";
import {
  ROOT_CONFIGURATION_DOCUMENT,
  ROOT_FALL_BROWN_TROUT_RUN_PROFILE,
  ROOT_FALL_STEELHEAD_RUN_PROFILE,
} from "./onboarding/root.ts";
import {
  SHEBOYGAN_CONFIGURATION_DOCUMENT,
  SHEBOYGAN_FALL_BROWN_TROUT_RUN_PROFILE,
  SHEBOYGAN_FALL_STEELHEAD_RUN_PROFILE,
} from "./onboarding/sheboygan.ts";
import {
  KEWAUNEE_FALL_BROWN_TROUT_RUN_PROFILE,
  KEWAUNEE_FALL_STEELHEAD_RUN_PROFILE,
  MIDWEST_DRAFT_CONFIGURATION_DOCUMENTS,
} from "./onboarding/midwest.ts";
import {
  FALL_2026_DRAFT_CONFIGURATION_DOCUMENTS,
  MANITOWOC_FALL_BROWN,
  MANITOWOC_FALL_STEELHEAD,
} from "./onboarding/fall2026.ts";

const fallProfiles = new Map<string, AuditedRiverRunProfile>([
  [
    MILWAUKEE_FALL_STEELHEAD_RUN_PROFILE.runId,
    MILWAUKEE_FALL_STEELHEAD_RUN_PROFILE,
  ],
  [
    MILWAUKEE_FALL_BROWN_TROUT_RUN_PROFILE.runId,
    MILWAUKEE_FALL_BROWN_TROUT_RUN_PROFILE,
  ],
  [
    SHEBOYGAN_FALL_STEELHEAD_RUN_PROFILE.runId,
    SHEBOYGAN_FALL_STEELHEAD_RUN_PROFILE,
  ],
  [
    SHEBOYGAN_FALL_BROWN_TROUT_RUN_PROFILE.runId,
    SHEBOYGAN_FALL_BROWN_TROUT_RUN_PROFILE,
  ],
  [ROOT_FALL_STEELHEAD_RUN_PROFILE.runId, ROOT_FALL_STEELHEAD_RUN_PROFILE],
  [ROOT_FALL_BROWN_TROUT_RUN_PROFILE.runId, ROOT_FALL_BROWN_TROUT_RUN_PROFILE],
  [
    KEWAUNEE_FALL_STEELHEAD_RUN_PROFILE.runId,
    KEWAUNEE_FALL_STEELHEAD_RUN_PROFILE,
  ],
  [
    KEWAUNEE_FALL_BROWN_TROUT_RUN_PROFILE.runId,
    KEWAUNEE_FALL_BROWN_TROUT_RUN_PROFILE,
  ],
  [MANITOWOC_FALL_STEELHEAD.runId, MANITOWOC_FALL_STEELHEAD],
  [MANITOWOC_FALL_BROWN.runId, MANITOWOC_FALL_BROWN],
]);

const baseDocuments = new Map<string, RiverRunConfigurationDocument>([
  ["milwaukee", MILWAUKEE_CONFIGURATION_DOCUMENT],
  ["sheboygan", SHEBOYGAN_CONFIGURATION_DOCUMENT],
  ["root", ROOT_CONFIGURATION_DOCUMENT],
  [
    "kewaunee_river",
    requiredDocument(MIDWEST_DRAFT_CONFIGURATION_DOCUMENTS, "kewaunee_river"),
  ],
  [
    "manitowoc",
    requiredDocument(FALL_2026_DRAFT_CONFIGURATION_DOCUMENTS, "manitowoc"),
  ],
]);

export const WISCONSIN_WINTER_RUN_PROFILES: AuditedRiverRunProfile[] =
  WISCONSIN_WINTER_PASS1_DECISIONS.flatMap((river) =>
    river.species.map((decision) =>
      buildWisconsinWinterProfile(
        river,
        decision,
        requiredFallProfile(decision.fallRunId),
      )
    )
  );

export const WISCONSIN_WINTER_CONFIGURATION_DOCUMENTS:
  RiverRunConfigurationDocument[] = WISCONSIN_WINTER_PASS1_DECISIONS.map(
    (river) => {
      const base = baseDocuments.get(river.riverId);
      if (!base) throw new Error(`Missing base document for ${river.riverId}`);
      const winterRuns = WISCONSIN_WINTER_RUN_PROFILES.filter((run) =>
        run.riverId === river.riverId
      );
      return {
        ...base,
        configVersion: `2026-09-28-${river.riverId}-wisconsin-winter-pass3-v1`,
        movementEngineVersion: [
          base.movementEngineVersion,
          getMovementEngineDefinition("stable_cool_holding").version,
        ].join("+"),
        biologyProfiles: [
          ...base.biologyProfiles,
          GREAT_LAKES_STEELHEAD_WINTER_HOLDING_BIOLOGY_PROFILE,
          GREAT_LAKES_LAKE_RUN_BROWN_TROUT_WINTER_HOLDING_BIOLOGY_PROFILE,
        ],
        runs: [...base.runs, ...winterRuns],
      };
    },
  );

function buildWisconsinWinterProfile(
  river: WisconsinWinterRiverDecision,
  decision: WisconsinWinterSpeciesDecision,
  fall: AuditedRiverRunProfile,
): AuditedRiverRunProfile {
  if (!fall.activity) throw new Error(`${fall.runId} lacks Activity inputs`);
  const measuredWater = decision.activityMode === "measured_water";
  const flowAirProxy = decision.activityMode === "flow_air_proxy";
  const useFishability = decision.hydraulicSourceIds.length > 0;
  if (
    useFishability && (!fall.fishabilityBands || !fall.baselineCoverage)
  ) {
    throw new Error(`${fall.runId} lacks required winter hydraulics`);
  }
  if (measuredWater && !fall.waterTemperature) {
    throw new Error(`${fall.runId} lacks required measured water temperature`);
  }
  const brown = decision.species === "lake_run_brown_trout";
  const transitionEnd = decision.activationMonthDay >= "01-16"
    ? "01-24"
    : "01-07";
  const coreStart = transitionEnd === "01-24" ? "01-25" : "01-08";
  const springApproachStart = "02-15";
  const end = decision.endMonthDay;
  const fractions = retainedFractions(
    decision.startingPresenceFraction,
    brown,
  );
  const profile: ActivityRules["profile"] = brown
    ? "brown_trout_winter_holding"
    : "steelhead_winter_holding";
  const inputReach: NonNullable<ActivityRules["inputReach"]> = {
    reachIds: [...decision.activityReachIds],
    hydraulicSourceIds: [...decision.hydraulicSourceIds],
    waterTemperatureSourceIds: [...decision.waterTemperatureSourceIds],
    weatherPointIds: [...decision.weatherPointIds],
    notes:
      `${decision.evidenceNotes} Inputs apply only to the named Activity reaches and cannot be extrapolated to every winter section.`,
  };
  const activity: ActivityRules = {
    version: `${decision.futureRunId}-activity-pass3-v1`,
    profile,
    dataMode: decision.activityMode === "weather_air_proxy"
      ? "weather_only"
      : "observed_river",
    winterTemperatureMode: measuredWater
      ? "measured_water"
      : "air_temperature_proxy",
    minimumInputContract: measuredWater
      ? "weather_and_one_measured_river_input"
      : "adaptive",
    ...(measuredWater ? {} : { confidenceCeiling: "Limited" as const }),
    inputReach,
    scopeCopy: `${decision.evidenceNotes} This read applies only to ${
      decision.activityReachIds.join(
        ", ",
      )
    }; other listed sections remain viable but require direct verification.`,
    weights: measuredWater
      ? {
        waterTemperature: .45,
        temperatureTrend: .2,
        light: .2,
        riverBehavior: .15,
        weather: 0,
      }
      : flowAirProxy
      ? {
        waterTemperature: 0,
        temperatureTrend: 0,
        light: .25,
        riverBehavior: .25,
        weather: .5,
      }
      : {
        waterTemperature: 0,
        temperatureTrend: 0,
        light: .4,
        riverBehavior: 0,
        weather: .6,
      },
    hydraulicTrend: fall.activity.hydraulicTrend ?? (fall.push
      ? {
        rising24h: fall.push.hydraulic.rising24h,
        meaningfulRise24h: fall.push.hydraulic.meaningfulRise24h,
        sharpRise24h: fall.push.hydraulic.sharpRise24h,
      }
      : undefined),
    temperature: brown
      ? {
        coldF: 33.5,
        preferredMinF: 39,
        preferredMaxF: 47,
        warmF: 52,
        barrierF: 68,
      }
      : {
        coldF: 33.5,
        preferredMinF: 38,
        preferredMaxF: 45,
        warmF: 50,
        barrierF: 68,
      },
    caps: {
      noMeasuredRiverData: flowAirProxy ? 59 : measuredWater ? 59 : 64,
      noWaterTemperature: measuredWater ? 59 : 100,
      lateRun: 100,
      ending: 100,
      stageResponseMaximum: 96,
      ...(decision.activityMode === "weather_air_proxy"
        ? { weatherOnlyMaximum: 64, weatherOnlyTomorrowMaximum: 62 }
        : {}),
    },
    evidenceNotes: winterActivityEvidence(decision, brown),
  };
  const phases = Object.fromEntries(
    [
      "beginning",
      "buildingEarly",
      "buildingEstablished",
      "buildingBroad",
      "peak",
      "tapering",
      "ending",
    ].map((phase) => [phase, [...decision.corridorReachIds]]),
  ) as NonNullable<AuditedRiverRunProfile["seasonalZonePlan"]>["phases"];

  return {
    runId: decision.futureRunId,
    riverId: river.riverId,
    biologyProfileId: brown
      ? "great_lakes_lake_run_brown_trout_winter_holding_v1"
      : "great_lakes_steelhead_winter_holding_v1",
    displayName: brown ? "Winter Lake-run Brown Trout" : "Winter Steelhead",
    species: decision.species,
    season: "winter",
    runType: "holding",
    movementEngineId: "stable_cool_holding",
    runStageCopyStrategy: fall.runStageCopyStrategy,
    seasonalZoneReachIds: [...decision.corridorReachIds],
    seasonalZonePlan: {
      version: `${decision.futureRunId}-seasonal-zone-pass3-v1`,
      winterHoldingGuidance: {
        preferredStartReachIds: [...decision.preferredStartReachIds],
        activityScopeCopy: activity.scopeCopy!,
        sourceNotes:
          `${decision.evidenceNotes} Preferred reaches are starting orientation only; all corridor reaches remain viable unless a documented closure removes them.`,
      },
      phases,
      evidenceNotes: brown
        ? "Every active phase remains in the accepted lower-river or harbor corridor. The product does not imply upstream winter migration, equal distribution, or that a nonrepresentative inland gauge measures harbor conditions."
        : "Every active phase retains the accepted winter Steelhead corridor. Preferred starting water does not make other audited reaches fishless or extend the Activity inputs river-wide.",
    },
    primitiveCapabilities: {
      migrationStage: { status: "available" },
      activity: { status: "available" },
      fishInRiver: { status: "available" },
      fishability: useFishability ? fall.primitiveCapabilities.fishability : {
        status: "unavailable",
        reason: "no_accepted_hydraulic_source",
        notes:
          "No accepted gauge directly represents this winter Activity corridor.",
      },
      migrationTiming: {
        status: "unavailable",
        reason: "not_applicable_to_holding",
        notes:
          "This pathway follows retained winter fish and does not infer migration timing.",
      },
      push: {
        status: "unavailable",
        reason: "not_applicable_to_holding",
        notes: "Winter holding Activity does not claim a fresh migratory push.",
      },
    },
    runWindow: {
      preRunStart: shiftMonthDay(decision.activationMonthDay, -2),
      stagingStart: shiftMonthDay(decision.activationMonthDay, -1),
      start: decision.activationMonthDay,
      beginningEnd: transitionEnd,
      buildingEstablishedStart: coreStart,
      peakStart: springApproachStart,
      peak: springApproachStart,
      peakEnd: "02-24",
      taperingEnd: "02-26",
      end,
      lateEnd: "03-01",
      postRunLateCopyEnd: "03-07",
    },
    historicalPresence: {
      maximum: fall.historicalPresence.maximum,
      distributionScope: brown
        ? "concentrated"
        : fall.historicalPresence.distributionScope,
      curveVersion: `${decision.futureRunId}-presence-pass3-v1`,
      anchors: [
        { dayOffsetFromStart: 0, fractionOfMaximum: fractions.start },
        {
          dayOffsetFromStart: winterOffset(
            decision.activationMonthDay,
            coreStart,
          ),
          fractionOfMaximum: fractions.core,
        },
        {
          dayOffsetFromStart: winterOffset(
            decision.activationMonthDay,
            springApproachStart,
          ),
          fractionOfMaximum: fractions.approach,
        },
        {
          dayOffsetFromStart: winterOffset(decision.activationMonthDay, end),
          fractionOfMaximum: fractions.end,
        },
      ],
      evidenceNotes: brown
        ? "The curve begins at the accepted fall Brown Trout endpoint and declines conservatively through February. It represents lower-river winter opportunity, not a count, universal retention, equal distribution, feeding Activity, or a separate migration."
        : "The curve begins at the accepted fall Steelhead endpoint and declines slowly through February. It represents retained seasonal opportunity, not a count, equal distribution, feeding Activity, or a new winter run. March is reserved for a separate spring pathway.",
      sourceNotes: decision.lifecycleContract,
    },
    activity,
    ...(useFishability && fall.fishabilityBands
      ? {
        fishabilityBands: {
          ...fall.fishabilityBands,
          version: `${fall.fishabilityBands.version}+winter-holding-pass3-v1`,
          evidenceNotes:
            `${fall.fishabilityBands.evidenceNotes} Winter reuse changes no hydraulic thresholds and remains reach-scoped presentation shape—not activity, abundance, migration, access, ice, or personal safety.`,
        },
      }
      : {}),
    ...(useFishability && fall.baselineCoverage
      ? { baselineCoverage: { ...fall.baselineCoverage } }
      : {}),
    ...(measuredWater && fall.waterTemperature
      ? {
        waterTemperature: {
          ...fall.waterTemperature,
          sourcePriority: [...decision.waterTemperatureSourceIds],
          notes:
            `${fall.waterTemperature.notes} Winter scoring requires a fresh measured-water read; air temperature is context only and never substituted.`,
        },
      }
      : {}),
    researchNotes:
      "Wisconsin winter Pass 3. Pass 1 accepted species, dates, corridors, regulations, gauges, and exclusions. The implementation dependency adds species-correct holding profiles and Pass 2 fixed-period replay calibration. Pass 3 accepts exact seasonal gating, source isolation, deterministic behavior, access rendering, production release safety, and no pre-activation visibility.",
    sourceNotes:
      "Wisconsin DNR trout and salmon seasons, Lake Michigan fall-fishing rules, A Year of Fishing, 2026 Fishing Report, Root River/Besadny facility reports, current stocking summaries, and the river-specific onboarding dossier. See docs/onboarding/river-run/wisconsin-winter-2026-pass1.md.",
    publicAudit: {
      isEnabled: true,
      auditVersion: `${decision.futureRunId}-pass3-v1`,
      notes:
        "Pass 3 acceptance requires fixed-period historical replay, deterministic counterfactuals, exact fall-to-winter handoffs, winter-only seasonal visibility, source fail-safes, species-correct copy, Spot Finder corridor checks, API release checks, and regenerated review artifacts.",
    },
  } satisfies AuditedRiverRunProfile;
}

function retainedFractions(start: number, brown: boolean) {
  const deltas = brown ? [.05, .1, .15] : [.04, .08, .12];
  return {
    start,
    core: Math.max(.05, round2(start - deltas[0])),
    approach: Math.max(.05, round2(start - deltas[1])),
    end: Math.max(.05, round2(start - deltas[2])),
  };
}

function winterActivityEvidence(
  decision: WisconsinWinterSpeciesDecision,
  brown: boolean,
): string {
  const species = brown ? "lake-run Brown Trout" : "Steelhead";
  const mode = decision.activityMode === "measured_water"
    ? "Fresh measured water temperature leads, recent measured-water direction and stability are secondary, daylight/cloud cover ranks windows, and reach-representative hydraulics qualify presentation."
    : decision.activityMode === "flow_air_proxy"
    ? "A three-day modeled-air pattern is an explicitly Limited thermal proxy, measured reach-representative hydraulics qualify presentation, and daylight/cloud cover ranks windows."
    : "A three-day modeled-air pattern and daylight/cloud cover provide explicitly Limited weather context; no river state or water temperature is inferred.";
  return `Winter ${species} Activity estimates conditional feeding responsiveness for fish already present. ${mode} Stable mild conditions or gradual warming can help; deep cold, rapid reversals, large swings, stale data, and unfishable hydraulics constrain the result. Rain receives no independent positive credit and Activity is never abundance, migration, catch probability, access, or safety.`;
}

function requiredFallProfile(runId: string): AuditedRiverRunProfile {
  const profile = fallProfiles.get(runId);
  if (!profile) throw new Error(`Missing fall profile ${runId}`);
  return profile;
}

function requiredDocument(
  documents: RiverRunConfigurationDocument[],
  riverId: string,
): RiverRunConfigurationDocument {
  const document = documents.find((candidate) =>
    candidate.river.riverId === riverId
  );
  if (!document) throw new Error(`Missing configuration for ${riverId}`);
  return document;
}

function winterOffset(start: string, target: string): number {
  const [startMonth, startDay] = start.split("-").map(Number);
  const [targetMonth, targetDay] = target.split("-").map(Number);
  const targetYear = targetMonth < startMonth ? 2027 : 2026;
  return Math.round(
    (Date.UTC(targetYear, targetMonth - 1, targetDay) -
      Date.UTC(2026, startMonth - 1, startDay)) / 86_400_000,
  );
}

function shiftMonthDay(value: string, days: number): string {
  const [month, day] = value.split("-").map(Number);
  const shifted = new Date(Date.UTC(2026, month - 1, day + days));
  const nextMonth = String(shifted.getUTCMonth() + 1).padStart(2, "0");
  const nextDay = String(shifted.getUTCDate()).padStart(2, "0");
  return `${nextMonth}-${nextDay}`;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
