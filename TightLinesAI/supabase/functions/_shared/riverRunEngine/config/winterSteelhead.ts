import type { ActivityRules, AuditedRiverRunProfile } from "../types.ts";
import { seasonalZonePlanForRun } from "./seasonalZonePlans.ts";

type WinterReach = NonNullable<ActivityRules["inputReach"]>;

export function buildMichiganWinterSteelheadProfile(input: {
  fall: AuditedRiverRunProfile;
  activation: string;
  transitionEnd: "01-07";
  coreStart: "01-08";
  springApproachStart: "02-15";
  startFraction: number;
  coreFraction: number;
  springApproachFraction: number;
  endFraction: number;
  inputReach: WinterReach;
  activityMode?: "measured_water" | "flow_air_proxy" | "weather_air_proxy";
  preferredStartReachIds: string[];
  scopeCopy: string;
  sourceNotes: string;
  auditPhase?: "pass1" | "pass2";
}): AuditedRiverRunProfile {
  const activityMode = input.activityMode ?? "measured_water";
  if (!input.fall.activity) {
    throw new Error(`${input.fall.runId} lacks required winter inputs`);
  }
  if (
    activityMode === "measured_water" &&
    (!input.fall.fishabilityBands || !input.fall.baselineCoverage ||
      !input.fall.waterTemperature)
  ) {
    throw new Error(
      `${input.fall.runId} lacks required measured-water winter inputs`,
    );
  }
  if (
    activityMode === "flow_air_proxy" &&
    (!input.fall.fishabilityBands || !input.fall.baselineCoverage)
  ) {
    throw new Error(`${input.fall.runId} lacks required flow winter inputs`);
  }
  const activationOffsetToCore = winterOffset(
    input.activation,
    input.coreStart,
  );
  const activationOffsetToSpring = winterOffset(
    input.activation,
    input.springApproachStart,
  );
  const activationOffsetToEnd = winterOffset(input.activation, "02-28");
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
  const measuredWater = activityMode === "measured_water";
  const flowAirProxy = activityMode === "flow_air_proxy";
  const activity: ActivityRules = {
    version: `${input.fall.riverId}-winter-steelhead-activity-v1`,
    profile: "steelhead_winter_holding",
    dataMode: activityMode === "weather_air_proxy"
      ? "weather_only"
      : "observed_river",
    winterTemperatureMode: measuredWater
      ? "measured_water"
      : "air_temperature_proxy",
    minimumInputContract: measuredWater
      ? "weather_and_one_measured_river_input"
      : "adaptive",
    ...(measuredWater ? {} : { confidenceCeiling: "Limited" as const }),
    inputReach: input.inputReach,
    scopeCopy: input.scopeCopy,
    weights: measuredWater
      ? {
        waterTemperature: 0.45,
        temperatureTrend: 0.2,
        light: 0.2,
        riverBehavior: 0.15,
        weather: 0,
      }
      : flowAirProxy
      ? {
        waterTemperature: 0,
        temperatureTrend: 0,
        light: 0.25,
        riverBehavior: 0.25,
        weather: 0.5,
      }
      : {
        waterTemperature: 0,
        temperatureTrend: 0,
        light: 0.4,
        riverBehavior: 0,
        weather: 0.6,
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
      noMeasuredRiverData: flowAirProxy ? 59 : measuredWater ? 59 : 64,
      noWaterTemperature: measuredWater ? 59 : 100,
      lateRun: 100,
      ending: 100,
      stageResponseMaximum: 96,
      ...(activityMode === "weather_air_proxy"
        ? { weatherOnlyMaximum: 64, weatherOnlyTomorrowMaximum: 62 }
        : {}),
    },
    evidenceNotes: measuredWater
      ? "Winter Steelhead Activity estimates conditional feeding responsiveness for fish already holding in the river. Measured water temperature supplies 45%, recent measured-water direction and stability 20%, daylight/cloud cover 20%, and fishable hydraulics 15%. Precipitation receives no independent positive weight. Gradual warming or stable suitable water can help; sharp temperature change, near-freezing water, stale inputs, ice-affected flow, and unfishable hydraulics constrain the result. Air temperature is context only and never substitutes for measured water temperature."
      : flowAirProxy
      ? "Winter Steelhead Activity estimates conditional responsiveness for fish already holding in the river. A three-day modeled-air pattern supplies 50%, measured fishable hydraulics 25%, and daylight/cloud cover 25%. Stable mild air and gradual warming can improve the proxy; stable severe cold, rapid reversals, and large day-to-day or intraday swings reduce it. Air temperature never becomes water temperature, rain receives no independent positive score, confidence is always Limited, and the measured lower-reach flow is not extrapolated river-wide."
      : "Winter Steelhead Activity is a Limited weather-context estimate for fish already holding in the river. A three-day modeled-air pattern supplies 60% and daylight/cloud cover 40%. Stable mild air and gradual warming can improve the proxy; stable severe cold, rapid reversals, and large day-to-day or intraday swings reduce it. Air temperature never becomes water temperature or river state, rain receives no independent positive score, and the true score ceiling is 64 today and 62 tomorrow.",
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
        `${fallSeasonalZonePlan.evidenceNotes} Every active winter phase keeps the complete accepted Steelhead corridor in scope because retained fish may hold throughout it. Spot Finder distinguishes the best-supported starting water from other viable audited winter sections; this is access orientation only and does not imply active upstream migration, equal fish distribution, or that condition inputs apply river-wide.`,
    },
    primitiveCapabilities: {
      migrationStage: { status: "available" },
      activity: { status: "available" },
      fishInRiver: { status: "available" },
      fishability: input.fall.primitiveCapabilities.fishability,
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
      preRunStart: shiftMonthDay(input.activation, -2),
      stagingStart: shiftMonthDay(input.activation, -1),
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
    ...(input.fall.fishabilityBands
      ? {
        fishabilityBands: {
          ...input.fall.fishabilityBands,
          version: `${input.fall.fishabilityBands.version}+winter-holding-v1`,
          evidenceNotes:
            `${input.fall.fishabilityBands.evidenceNotes} Winter reuse changes no hydraulic thresholds: Fishability remains presentation shape, not migration, activity, abundance, access, ice safety, or personal safety.`,
        },
      }
      : {}),
    ...(input.fall.baselineCoverage
      ? { baselineCoverage: { ...input.fall.baselineCoverage } }
      : {}),
    ...(input.fall.waterTemperature && measuredWater
      ? {
        waterTemperature: {
          ...input.fall.waterTemperature,
          sourcePriority: [...input.fall.waterTemperature.sourcePriority],
          notes:
            `${input.fall.waterTemperature.notes} Winter scoring requires a fresh measured-water read for full confidence; forecast or observed air temperature is context only.`,
        },
      }
      : {}),
    researchNotes: input.auditPhase === "pass1"
      ? "Michigan winter Steelhead Pass 1. The module activates only after this river's exact fall-entry endpoint, follows retained fish through February 28, excludes Push and Migration Timing, and hands March 1 to a future spring model. Dates, input isolation, deterministic score behavior, copy, access orientation, and fail-safes are accepted; historical replay calibration remains Pass 2."
      : "Michigan winter Steelhead Pass 2. The module activates only after this river's fall-entry endpoint, follows retained fish through February 28, excludes Push and Migration Timing, and hands March 1 to a future spring model. Fixed-period historical replay of the river's accepted input contract retained the Pass 1 dates, presence curve, thresholds, and weights without calibration changes.",
    sourceNotes: input.sourceNotes,
    publicAudit: {
      isEnabled: true,
      auditVersion: `${input.fall.riverId}-winter-steelhead-${
        input.auditPhase ?? "pass2"
      }-v1`,
      notes: input.auditPhase === "pass1"
        ? "Pass 1 acceptance includes authoritative-source review, exact seasonal gating, lifecycle continuity, winter Activity invariants, source isolation, data fail-safes, full-corridor Spot Finder behavior, and deterministic counterfactual fixtures. Historical replay and final calibration acceptance remain Pass 2."
        : "Pass 2 acceptance includes exact seasonal gating, lifecycle continuity, winter Activity invariants, data fail-safes, fixed-period historical replay of only the accepted source contract, 100 stratified review rows for this river, and deterministic counterfactual fixtures. The audit validates model behavior, not catch probability.",
    },
  } satisfies AuditedRiverRunProfile;
}

function winterOffset(start: string, target: string): number {
  const [startMonth, startDay] = start.split("-").map(Number);
  const [targetMonth, targetDay] = target.split("-").map(Number);
  const startYear = 2026;
  const targetYear = targetMonth < startMonth ? 2027 : 2026;
  return Math.round(
    (Date.UTC(targetYear, targetMonth - 1, targetDay) -
      Date.UTC(startYear, startMonth - 1, startDay)) / 86_400_000,
  );
}

function shiftMonthDay(value: string, days: number): string {
  const [month, day] = value.split("-").map(Number);
  const shifted = new Date(Date.UTC(2026, month - 1, day + days));
  return `${String(shifted.getUTCMonth() + 1).padStart(2, "0")}-${
    String(shifted.getUTCDate()).padStart(2, "0")
  }`;
}
