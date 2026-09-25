import type { ActivityRules, AuditedRiverRunProfile } from "../types.ts";
import { seasonalZonePlanForRun } from "./seasonalZonePlans.ts";

type WinterReach = NonNullable<ActivityRules["inputReach"]>;

export function buildMichiganWinterSteelheadProfile(input: {
  fall: AuditedRiverRunProfile;
  activation: "12-23" | "01-01";
  transitionEnd: "01-07";
  coreStart: "01-08";
  springApproachStart: "02-15";
  startFraction: number;
  coreFraction: number;
  springApproachFraction: number;
  endFraction: number;
  inputReach: WinterReach;
  preferredStartReachIds: string[];
  scopeCopy: string;
  sourceNotes: string;
}): AuditedRiverRunProfile {
  if (
    !input.fall.activity || !input.fall.fishabilityBands ||
    !input.fall.baselineCoverage || !input.fall.waterTemperature
  ) {
    throw new Error(`${input.fall.runId} lacks required winter inputs`);
  }
  const activationOffsetToCore = input.activation === "12-23" ? 16 : 7;
  const activationOffsetToSpring = input.activation === "12-23" ? 54 : 45;
  const activationOffsetToEnd = input.activation === "12-23" ? 67 : 58;
  const fallSeasonalZonePlan = input.fall.seasonalZonePlan ??
    seasonalZonePlanForRun(input.fall.runId);
  const winterCorridorReachIds = [
    ...new Set(Object.values(fallSeasonalZonePlan.phases).flat()),
  ];
  const winterCorridorPhases = {
    beginning: [...winterCorridorReachIds],
    buildingEarly: [...winterCorridorReachIds],
    buildingEstablished: [...winterCorridorReachIds],
    buildingBroad: [...winterCorridorReachIds],
    peak: [...winterCorridorReachIds],
    tapering: [...winterCorridorReachIds],
    ending: [...winterCorridorReachIds],
  };
  const activity: ActivityRules = {
    version: `${input.fall.riverId}-winter-steelhead-activity-v1`,
    profile: "steelhead_winter_holding",
    dataMode: "observed_river",
    minimumInputContract: "weather_and_one_measured_river_input",
    inputReach: input.inputReach,
    scopeCopy: input.scopeCopy,
    weights: {
      waterTemperature: 0.45,
      temperatureTrend: 0.2,
      light: 0.2,
      riverBehavior: 0.15,
      weather: 0,
    },
    hydraulicTrend: input.fall.activity.hydraulicTrend ??
      (input.fall.push
        ? {
          rising24h: input.fall.push.hydraulic.rising24h,
          meaningfulRise24h: input.fall.push.hydraulic.meaningfulRise24h,
          sharpRise24h: input.fall.push.hydraulic.sharpRise24h,
        }
        : undefined),
    temperature: {
      coldF: 33.5,
      preferredMinF: 38,
      preferredMaxF: 45,
      warmF: 50,
      barrierF: 68,
    },
    caps: {
      noMeasuredRiverData: 59,
      noWaterTemperature: 59,
      lateRun: 100,
      ending: 100,
      stageResponseMaximum: 96,
    },
    evidenceNotes:
      "Winter Steelhead Activity estimates conditional feeding responsiveness for fish already holding in the river. Measured water temperature supplies 45%, recent measured-water direction and stability 20%, daylight/cloud cover 20%, and fishable hydraulics 15%. Precipitation receives no independent positive weight. Gradual warming or stable suitable water can help; sharp temperature change, near-freezing water, stale inputs, ice-affected flow, and unfishable hydraulics constrain the result. Air temperature is context only and never substitutes for measured water temperature.",
  };
  return {
    runId: `${input.fall.riverId}_winter_steelhead`,
    riverId: input.fall.riverId,
    biologyProfileId: "great_lakes_steelhead_winter_holding_v1",
    displayName: "Winter Steelhead",
    species: "steelhead",
    season: "winter",
    runType: "holding",
    movementEngineId: "stable_cool_holding",
    runStageCopyStrategy: input.fall.runStageCopyStrategy,
    seasonalZonePlan: {
      version: `${input.fall.riverId}-winter-steelhead-seasonal-zone-v3`,
      winterHoldingGuidance: {
        preferredStartReachIds: [...input.preferredStartReachIds],
        activityScopeCopy: input.scopeCopy,
        sourceNotes:
          `${input.sourceNotes} Preferred starting water is reach orientation based on the strongest accepted winter-condition coverage; every other audited corridor section remains viable and is not ranked as fishless.`,
      },
      phases: winterCorridorPhases,
      evidenceNotes:
        `${fallSeasonalZonePlan.evidenceNotes} Every active winter phase keeps the complete accepted Steelhead corridor in scope because retained fish may hold throughout it. Spot Finder distinguishes the best measured starting water from other viable audited winter sections; this is access orientation only and does not imply active upstream migration, equal fish distribution, or that measured conditions apply river-wide.`,
    },
    primitiveCapabilities: {
      migrationStage: { status: "available" },
      activity: { status: "available" },
      fishInRiver: { status: "available" },
      fishability: { status: "available" },
      migrationTiming: {
        status: "unavailable",
        reason: "not_applicable_to_holding",
        notes:
          "This experience follows retained overwintering fish and does not infer migration timing.",
      },
      push: {
        status: "unavailable",
        reason: "not_applicable_to_holding",
        notes: "Winter holding Activity does not claim a fresh migratory push.",
      },
    },
    runWindow: {
      preRunStart: input.activation === "12-23" ? "12-21" : "12-30",
      stagingStart: input.activation === "12-23" ? "12-22" : "12-31",
      start: input.activation,
      beginningEnd: input.transitionEnd,
      buildingEstablishedStart: input.coreStart,
      peakStart: input.springApproachStart,
      peak: input.springApproachStart,
      peakEnd: "02-24",
      taperingEnd: "02-26",
      end: "02-28",
      lateEnd: "03-01",
      postRunLateCopyEnd: "03-07",
    },
    historicalPresence: {
      maximum: input.fall.historicalPresence.maximum,
      distributionScope: input.fall.historicalPresence.distributionScope,
      curveVersion: `${input.fall.riverId}-winter-steelhead-presence-v1`,
      anchors: [
        { dayOffsetFromStart: 0, fractionOfMaximum: input.startFraction },
        {
          dayOffsetFromStart: activationOffsetToCore,
          fractionOfMaximum: input.coreFraction,
        },
        {
          dayOffsetFromStart: activationOffsetToSpring,
          fractionOfMaximum: input.springApproachFraction,
        },
        {
          dayOffsetFromStart: activationOffsetToEnd,
          fractionOfMaximum: input.endFraction,
        },
      ],
      evidenceNotes:
        "The curve begins at the accepted fall Steelhead endpoint, then holds or declines slowly through February. It represents retained seasonal opportunity, not a fish count, equal distribution, current feeding activity, or a new winter run. March 1 is reserved for a separately researched spring pathway.",
      sourceNotes: input.sourceNotes,
    },
    activity,
    fishabilityBands: {
      ...input.fall.fishabilityBands,
      version: `${input.fall.fishabilityBands.version}+winter-holding-v1`,
      evidenceNotes:
        `${input.fall.fishabilityBands.evidenceNotes} Winter reuse changes no hydraulic thresholds: Fishability remains presentation shape, not migration, activity, abundance, access, ice safety, or personal safety.`,
    },
    baselineCoverage: { ...input.fall.baselineCoverage },
    waterTemperature: {
      ...input.fall.waterTemperature,
      sourcePriority: [...input.fall.waterTemperature.sourcePriority],
      notes:
        `${input.fall.waterTemperature.notes} Winter scoring requires a fresh measured-water read for full confidence; forecast or observed air temperature is context only.`,
    },
    researchNotes:
      "Michigan winter Steelhead Pass 2. The module activates only after this river's fall-entry endpoint, follows retained fish through February 28, excludes Push and Migration Timing, and hands March 1 to a future spring model. Five-winter measured-condition replay accepted the Pass 1 thresholds and weights without calibration changes.",
    sourceNotes: input.sourceNotes,
    publicAudit: {
      isEnabled: true,
      auditVersion: `${input.fall.riverId}-winter-steelhead-pass2-v1`,
      notes:
        "Pass 2 acceptance includes exact seasonal gating, lifecycle continuity, winter Activity invariants, data fail-safes, five winters of historical measured-condition replay, 100 stratified review rows for this river, and deterministic counterfactual fixtures. The audit validates model behavior, not catch probability.",
    },
  } satisfies AuditedRiverRunProfile;
}
