import type {
  AuditedObservedRiverRunProfile,
  RiverProfile,
  RiverRunConfigurationDocument,
} from "../../types.ts";
import { getMovementEngineDefinition } from "../movementEngines.ts";
import { BIG_MANISTEE_RIVER_PROFILE } from "../rivers.ts";
import { GREAT_LAKES_LAKE_RUN_BROWN_TROUT_BIOLOGY_PROFILE } from "../speciesBiology.ts";

/** Compatibility alias retained for deterministic release-review fixtures. */
export const BIG_MANISTEE_BROWN_REVIEW_RIVER_PROFILE: RiverProfile =
  BIG_MANISTEE_RIVER_PROFILE;

/** Owner-approved public Big Manistee lake-run Brown Trout profile. */
export const BIG_MANISTEE_FALL_BROWN_TROUT_RUN_PROFILE:
  AuditedObservedRiverRunProfile = {
    runId: "big_manistee_fall_brown_trout",
    riverId: "big_manistee",
    biologyProfileId: "great_lakes_lake_run_brown_trout_v1",
    displayName: "Fall Migratory Brown Trout",
    species: "lake_run_brown_trout",
    season: "fall",
    runType: "fall_repeat_spawn",
    movementEngineId: "fall_repeat_spawner_cooling",
    runStageCopyStrategy: "big_manistee_tailwater",
    primitiveCapabilities: {
      migrationStage: { status: "available" },
      activity: { status: "available" },
      fishInRiver: { status: "available" },
      migrationTiming: { status: "available" },
      push: { status: "available" },
      fishability: { status: "available" },
    },
    runWindow: {
      preRunStart: "08-15",
      stagingStart: "08-25",
      start: "09-05",
      beginningEnd: "09-15",
      buildingEstablishedStart: "09-16",
      buildingBroadStart: "09-23",
      peakStart: "09-25",
      peak: "10-01",
      peakEnd: "10-15",
      taperingEnd: "10-31",
      end: "11-30",
      lateEnd: "12-01",
      postRunLateCopyEnd: "12-15",
    },
    historicalPresence: {
      maximum: 5,
      distributionScope: "sectional",
      curveVersion: "big-manistee-migratory-brown-presence-v1-release",
      evidenceNotes:
        "The Big Manistee supports a documented trophy Brown Trout fishery and direct Lake Michigan access below Tippy Dam, including Michigan's 41.45-pound state-record Brown Trout. Michigan DNR identifies lake-run Browns, late-summer and early-fall tributary entry, September-October spawning, Brown Trout below Tippy, and a small recurring migratory Brown component in the connected Manistee system. The 5/10 ceiling deliberately represents a real but moderate sectional migration with exceptional fish potential without treating resident Brown Trout catches, stocking, or a record fish as proof of a strong migratory run.",
      sourceNotes:
        "Michigan DNR Brown Trout species profile; Little Manistee River 1984 weir periodicity and 1968-present counts; Tippy Dam Recreation Area General Management Plan; Manistee River below Tippy Dam Status Report 2004-4; 2016 and 2022-2023 Manistee River creel surveys; and Michigan DNR state-record fish table. The nearby measured run peaked in September and lingered into November. The October 1 Big Manistee reference peak and 5/10 ceiling remain conservative analog calibration because no direct Big Manistee migratory count series separates lake-run from resident Browns.",
      anchors: [
        { dayOffsetFromStart: 0, fractionOfMaximum: .08 },
        { dayOffsetFromStart: 10, fractionOfMaximum: .22 },
        { dayOffsetFromStart: 18, fractionOfMaximum: .55 },
        { dayOffsetFromStart: 20, fractionOfMaximum: .75 },
        { dayOffsetFromStart: 26, fractionOfMaximum: 1 },
        { dayOffsetFromStart: 40, fractionOfMaximum: .9 },
        { dayOffsetFromStart: 56, fractionOfMaximum: .65 },
        { dayOffsetFromStart: 71, fractionOfMaximum: .3 },
        { dayOffsetFromStart: 86, fractionOfMaximum: .12 },
      ],
    },
    activity: {
      version: "big-manistee-fall-brown-activity-v1-release",
      profile: "brown_trout_fall_reaction",
      dataMode: "observed_river",
      minimumInputContract: "weather_and_one_measured_river_input",
      inputReach: {
        reachIds: ["big_manistee_tippy_tailwater"],
        hydraulicSourceIds: ["big_manistee_wellston_usgs"],
        waterTemperatureSourceIds: ["big_manistee_wellston_temperature"],
        weatherPointIds: ["big_manistee_wellston_weather"],
        notes:
          "Observed Activity is limited to the Wellston/Tippy tailwater reach. Lower-river conditions require independent observation.",
      },
      scopeCopy:
        "The measured conditions represent the Wellston/Tippy tailwater in the Upper river. Migratory Brown Trout can be distributed elsewhere below Tippy Dam, where temperature, clarity, and presentation conditions can differ.",
      earlySeasonScopeCopy:
        "Early migratory Brown Trout may still be lakeward or in the Lower and Middle river. Do not apply this Wellston-based score unchanged to those sections.",
      weights: {
        light: .25,
        waterTemperature: .45,
        riverBehavior: .2,
        weather: .1,
      },
      hydraulicTrend: {
        rising24h: { absolute: 50, percent: 3 },
        meaningfulRise24h: { absolute: 100, percent: 7 },
        sharpRise24h: { absolute: 180, percent: 12 },
      },
      temperature: {
        coldF: 38,
        preferredMinF: 44,
        preferredMaxF: 58,
        warmF: 64,
        barrierF: 70,
      },
      caps: {
        noMeasuredRiverData: 69,
        noWaterTemperature: 69,
        lateRun: 100,
        ending: 100,
      },
      evidenceNotes:
        "Observed-river Activity for a living migratory Brown Trout already present near Wellston. Measured water temperature leads, effective light and tailwater presentation are secondary, and precipitation remains restrained cover context. Brown Trout are repeat spawners, so no salmon mortality ramp, taper penalty, ending ceiling, or automatic post-spawn departure is applied. The model is intentionally scoped to the Tippy tailwater and does not infer lower-river conditions.",
    },
    push: {
      version: "big-manistee-fall-brown-push-v1",
      hydraulic: {
        metric: "flow_cfs",
        sourceLabel: "Wellston tailwater",
        lowValue: 1200,
        highValue: 2300,
        severeHighValue: 3500,
        rising24h: { absolute: 50, percent: 3 },
        meaningfulRise24h: { absolute: 100, percent: 7 },
        sharpRise24h: { absolute: 180, percent: 12 },
      },
      rain: {
        meaningful48hIn: .35,
        strong48hIn: .75,
        heavy48hIn: 1.5,
      },
      temperature: {
        suitabilityLabel: "Big Manistee migratory Brown Trout spawning entry",
        coldHoldingF: 38,
        supportiveMinF: 40,
        preferredMinF: 44,
        supportiveMaxF: 58,
        tooWarmF: 64,
        migrationBarrierF: 70,
      },
      caps: {
        staleGauge: 55,
        unknownTrend: 49,
        noGaugeResponse: 69,
        tooWarm: 69,
        migrationBarrier: 49,
        severeHighFlow: 49,
        outsideExtendedWindow: 69,
        coldHolding: 49,
      },
      evidenceNotes:
        "The run reuses the accepted Wellston hydraulic response because it is the same regulated migratory corridor, while Brown Trout retain their own repeat-spawner temperature branch. Rain remains precursor-only and Strong movement language still requires measured gauge response.",
      sourceNotes:
        "USGS 04125550 discharge and measured water temperature; Michigan DNR Brown Trout fall-entry and spawning biology. Thresholds are the owner-accepted conservative Great Lakes lake-run Brown calibration.",
    },
    fishabilityBands: {
      version: "big-manistee-tailwater-fishability-v2-core-ideal",
      metric: "flow_cfs",
      sourceLabel: "Wellston tailwater",
      tooLow: { max: 1100 },
      lowFishable: { min: 1100, max: 1400 },
      ideal: { min: 1400, max: 1750 },
      highFishable: { min: 1750, max: 2500 },
      blownOut: { min: 3500 },
      caps: {
        staleGauge: 55,
        unknownTrend: 69,
        veryLow: 45,
        blownOut: 24,
        sharpRiseHigh: 40,
      },
      evidenceNotes:
        "The accepted Wellston bands classify presentation shape in the same regulated Upper-river reach for every migratory species. They do not estimate Brown Trout abundance, certify downstream conditions, or determine access or safety.",
      sourceNotes:
        "USGS 04125550 daily discharge, 1996-2025; Michigan DNR Tippy Dam management plan; and the accepted 2026-08-27 Big Manistee Fishability reconciliation.",
    },
    baselineCoverage: {
      metric: "flow_cfs",
      version: "big-manistee-fall-brown-flow-baseline-v1",
      hasPercentileBaselines: true,
      coveredWindowPercent: 1,
      minimumHistoryYears: 29,
      sourceNotes:
        "USGS 04125550 daily discharge covers the complete fall lake-run Brown Trout lifecycle. Sherman and other contextual stations are never blended into scoring.",
    },
    waterTemperature: {
      sourcePriority: ["big_manistee_wellston_temperature"],
      upstreamFallbackPositiveSignalCap: 0,
      notes:
        "Use only same-gauge Wellston measured water temperature. Air temperature and upstream context cannot substitute. The read is limited to the Upper river near Tippy Dam.",
    },
    conditionsSuggest: {
      baselineVersion: "big-manistee-fall-brown-conditions-v1",
      temperatureSourceId: "big_manistee_wellston_temperature",
      finalCheckpointDaysAfterPeak: 5,
      minimumUsableYears: 10,
      minimumCoveragePercent: .8,
      aheadPercentile: 75,
      delayedPercentile: 25,
      coolEnoughPercentileCap: 75,
      gaugeWeight: .4,
      waterTemperatureWeight: .6,
    },
    userCopyHints: {
      stagingTip:
        "Begin with Manistee Lake, the harbor, river entrance, and Lower river when evaluating early migratory Brown Trout entry.",
      preRunTip:
        "A trophy Brown Trout can occur outside the core calendar; one fish does not prove a strong or broadly distributed migration.",
      peakTip:
        "Compare the Upper river below Tippy with the Middle river, avoid active spawning fish, and keep Wellston measurements in their actual reach.",
      endingTip:
        "Surviving Brown Trout may hold in the river or return lakeward after spawning; this fall model does not assert which path an individual fish takes.",
    },
    researchNotes:
      "Owner-approved Big Manistee lake-run Brown Trout release profile. The calendar follows DNR late-summer/early-fall tributary residence, September-October spawning evidence, and the nearby Little Manistee weir record of a September peak lingering into November. October 1 is an analog reference rather than a direct Big Manistee count peak. Resident and migratory Browns can overlap; the product never labels an individual fish's origin from appearance, location, or date alone.",
    sourceNotes:
      "docs/onboarding/river-run/big_manistee/runs/fall-migratory-brown-trout.md",
    publicAudit: {
      isEnabled: true,
      auditVersion: "big-manistee-fall-brown-release-audit-v1",
      notes:
        "Owner accepted the reviewed Big Manistee lake-run Brown Trout profile for public catalog promotion on 2026-08-29. Production deployment remains a separate explicit release action.",
    },
  };

export const BIG_MANISTEE_BROWN_CONFIGURATION_DOCUMENT:
  RiverRunConfigurationDocument = {
    schemaVersion: "river-run-config-v1",
    configVersion: "2026-08-29-big-manistee-brown-release.5+seasonal-zone-v3",
    movementEngineVersion: getMovementEngineDefinition(
      "fall_repeat_spawner_cooling",
    ).version,
    river: BIG_MANISTEE_BROWN_REVIEW_RIVER_PROFILE,
    biologyProfiles: [GREAT_LAKES_LAKE_RUN_BROWN_TROUT_BIOLOGY_PROFILE],
    runs: [BIG_MANISTEE_FALL_BROWN_TROUT_RUN_PROFILE],
  };
