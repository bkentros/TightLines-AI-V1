import type {
  ActivityRules,
  AuditedRiverRunProfile,
  FishabilityBands,
  RiverProfile,
  RiverRunConfigurationDocument,
} from "../../types.ts";
import { getMovementEngineDefinition } from "../movementEngines.ts";
import {
  GREAT_LAKES_CHINOOK_BIOLOGY_PROFILE,
  GREAT_LAKES_COHO_BIOLOGY_PROFILE,
  GREAT_LAKES_STEELHEAD_FALL_ENTRY_BIOLOGY_PROFILE,
} from "../speciesBiology.ts";

const WHITE_OBSERVED_ACTIVITY_SCOPE =
  "This read combines Fruitvale Road flow, measured water temperature below Hesperia Dam, and Pines Point weather as complementary conditions for the below-Hesperia corridor. The sensors are in different reaches, so verify conditions at the water you fish.";

function whiteObservedActivity(input: {
  version: string;
  profile: ActivityRules["profile"];
  weights: ActivityRules["weights"];
  temperature: ActivityRules["temperature"];
  stageResponseAdjustment?: NonNullable<
    ActivityRules["stageResponseAdjustment"]
  >;
  ending: number;
  lifecycle?: NonNullable<ActivityRules["caps"]["lifecycleRamp"]>;
  evidenceNotes: string;
}): ActivityRules {
  return {
    version: input.version,
    profile: input.profile,
    dataMode: "observed_river",
    minimumInputContract: "weather_and_one_measured_river_input",
    inputReach: {
      reachIds: [
        "white_lower_river",
        "white_forest_corridor",
        "white_upper_accessible_corridor",
      ],
      hydraulicSourceIds: ["white_fruitvale_usgs"],
      waterTemperatureSourceIds: ["white_weaver_st_temperature"],
      weatherPointIds: ["white_pines_point_weather"],
      notes:
        "Fruitvale hydraulics and Weaver Street temperature are accepted as complementary, independently freshness-gated below-Hesperia corridor inputs. They are not presented as co-located measurements.",
    },
    scopeCopy: WHITE_OBSERVED_ACTIVITY_SCOPE,
    weights: input.weights,
    temperature: input.temperature,
    stageResponseAdjustment: input.stageResponseAdjustment,
    hydraulicTrend: {
      rising24h: { absolute: 25, percent: 8 },
      meaningfulRise24h: { absolute: 50, percent: 15 },
      sharpRise24h: { absolute: 100, percent: 30 },
    },
    caps: {
      noMeasuredRiverData: 69,
      noWaterTemperature: 69,
      lateRun: 100,
      ending: input.ending,
      ...(input.stageResponseAdjustment ? { stageResponseMaximum: 96 } : {}),
      ...(input.lifecycle
        ? { taperingPenalty: 15, lifecycleRamp: input.lifecycle }
        : {}),
    },
    evidenceNotes: input.evidenceNotes,
  };
}

const WHITE_WEAVER_ACTIVITY_TEMPERATURE = {
  sourcePriority: ["white_weaver_st_temperature"],
  upstreamFallbackPositiveSignalCap: 1 as const,
  notes:
    "Weaver Street is the accepted measured-temperature input for White River Activity. It represents the below-Hesperia tailwater and is combined with Fruitvale hydraulics as a separately labeled corridor input.",
};

export const WHITE_RIVER_PROFILE: RiverProfile = {
  riverId: "white",
  displayName: "White River",
  state: "MI",
  region: "great_lakes",
  timezone: "America/Detroit",
  mouthLat: 43.37,
  mouthLon: -86.42,
  hydraulicSources: [{
    sourceId: "white_fruitvale_usgs",
    provider: "USGS",
    siteId: "04122200",
    name: "White River near Whitehall, MI — Fruitvale Road",
    role: "primary",
    primaryMetric: "flow_cfs",
    availableMetrics: ["flow_cfs", "gage_height_ft"],
    historyYearsAvailable: 69,
    maxAgeHours: 2,
    reachQuality: "good",
    reachNotes:
      "Fruitvale Road represents the free-flowing lower mainstem and nearby lower corridor. It does not measure White Lake backwater or the upper Hesperia reach.",
  }],
  waterTemperatureSources: [{
    sourceId: "white_weaver_st_temperature",
    provider: "MONITOR_MY_WATERSHED",
    siteId: "Weaver St",
    seriesId: "5989",
    name: "South Branch White River at Weaver Street",
    role: "primary",
    priority: 1,
    sourceType: "nearby_gauge",
    maxAgeHours: 2,
    smoothingWindowHours: 3,
    minValidF: 30,
    maxValidF: 85,
    maxRateChangeFPerHour: 3,
    maxPeerDifferenceF: 5,
    historicalStartYear: 2022,
    historicalEndYear: 2026,
    reachNotes:
      "Measured about 0.25 mile below Hesperia Dam. It directly represents the upper tailwater and is used with separately labeled Fruitvale hydraulics as a complementary below-Hesperia Activity input.",
    attribution:
      "Trout Unlimited via Monitor My Watershed, CC BY-SA 4.0; raw observations are provisional.",
  }],
  weatherPoints: [{
    weatherPointId: "white_pines_point_weather",
    lat: 43.53,
    lon: -86.1,
    role: "primary",
  }],
  foundation: {
    version: "white-foundation-v1-draft",
    corridorLengthMiles: 33,
    downstreamTerminus:
      "Covell Park / Business US-31 White River bridge near White Lake",
    upstreamTerminus: "Downstream face of Hesperia Dam",
    targetSpecies: ["chinook_salmon", "coho_salmon", "steelhead"],
    reaches: [
      {
        reachId: "white_lower_river",
        displayName:
          "Lower river — Covell Park/Business US-31 to Fruitvale Road",
        order: 1,
        role: "downstream",
        gaugeRepresented: true,
        notes:
          "Fruitvale hydraulics apply at the upper endpoint and nearby free-flowing mainstem, not White Lake backwater.",
        sourceNotes:
          "Michigan DNR Lower White River assessment and USGS 04122200 metadata.",
      },
      {
        reachId: "white_forest_corridor",
        displayName: "Forest corridor — Fruitvale Road to Pines Point",
        order: 2,
        role: "middle",
        gaugeRepresented: false,
        notes:
          "Fruitvale is lower-end hydraulic context only; no whole-section gauge is claimed.",
        sourceNotes: "Michigan DNR Lower White River assessment.",
      },
      {
        reachId: "white_upper_accessible_corridor",
        displayName: "Upper accessible corridor — Pines Point to Hesperia Dam",
        order: 3,
        role: "terminal",
        gaugeRepresented: false,
        notes:
          "Weaver Street temperature represents only the immediate Hesperia tailwater. Hesperia Dam is the hard upstream endpoint.",
        sourceNotes:
          "Michigan DNR White River assessments and White River Watershed Partnership monitoring description.",
      },
    ],
    locations: [{
      locationId: "white_hesperia_dam",
      officialName: "Hesperia Dam",
      state: "MI",
      latitude: 43.5705,
      longitude: -86.042,
      coordinateSource:
        "Michigan DNR assessment and local mapping; orientation coordinate pending final official GIS verification",
      coordinateStatus: "provisional",
      reachId: "white_upper_accessible_corridor",
      kind: "barrier",
      fishPassage: "impassable",
      publicUpstreamLimit: true,
      publicAccess: "restricted",
      fishingSuitability: { bank: "unknown", wading: "no", boat: "no" },
      beginnerSuitable: false,
      restrictionNotes:
        "No current fish passage is configured. River Run guidance ends below the dam; obey posted closures and dam-safety boundaries.",
      sourceNotes:
        "Michigan DNR Lower White River Status Report 0460 and owner approval 2026-08-24.",
    }],
    primaryGaugeReachId: "white_lower_river",
    contextualGaugeSiteIds: [],
    weatherStrategy: {
      mode: "single_point",
      primaryWeatherPointId: "white_pines_point_weather",
      basinRepresentation:
        "Modeled Pines Point weather supplies local light and precipitation context to the observed below-Hesperia Activity model alongside independently freshness-gated Fruitvale hydraulics and Weaver Street temperature.",
      sourceNotes:
        "Phase B White River weather-point audit; exact coordinate remains subject to integration verification.",
    },
    stateRegulations: [{
      state: "MI",
      version: "michigan-2026-fishing-regulations-through-2027-03-31",
      jurisdiction: "Michigan DNR White River regulations",
      reminderCopy:
        "Check current Michigan fishing regulations, posted closures, and Hesperia Dam boundaries before fishing.",
      accessAndSafetyNotes:
        "Section names are orientation only and do not guarantee access, legal methods, boating, wading, or safety.",
      sourceNotes:
        "Michigan DNR 2026 Fishing Regulations; recheck immediately before release.",
    }],
    evidenceNotes:
      "All configured migratory guidance ends below Hesperia Dam. DNR documents annual Chinook, Coho, and Steelhead migrations; Coho uses a deliberately sparse hidden-review profile rather than an unsupported state.",
  },
  conditionRefreshSchedule: {
    activeSlots: [
      "00:00",
      "04:00",
      "08:00",
      "12:00",
      "16:00",
      "20:00",
      "21:00",
    ],
    inactiveSlots: ["00:00"],
    evidenceNotes:
      "Gauge Read refreshes each accepted station independently. Activity uses the separately labeled Fruitvale and Weaver Street readings as complementary below-Hesperia corridor inputs.",
  },
  conditionDataCapabilities: {
    hydraulics: { status: "available" },
    waterTemperature: { status: "available" },
  },
  supportStatus: "beta",
  gaugeLimitationCopy:
    "Flow and height are measured at Fruitvale Road; water temperature is measured below Hesperia Dam. Each reading describes only its named reach.",
  regulationReminderCopy:
    "Check current Michigan regulations and posted Hesperia Dam boundaries. River Run guidance never extends above the dam.",
};

const WHITE_FISHABILITY: FishabilityBands = {
  version: "white-fruitvale-fishability-v2",
  metric: "flow_cfs",
  sourceLabel: "Fruitvale Road reach",
  tooLow: { max: 220 },
  lowFishable: { min: 220, max: 275 },
  ideal: { min: 275, max: 440 },
  highFishable: { min: 440, max: 712 },
  blownOut: { min: 1020 },
  caps: {
    staleGauge: 55,
    unknownTrend: 49,
    veryLow: 45,
    blownOut: 24,
    sharpRiseHigh: 40,
  },
  evidenceNotes:
    "Accepted percentile calibration from the August–December USGS daily-mean distribution: p5 218, p25 275, median 341, p75 440, p95 712, and p99 1,020 CFS. The ideal band is the interquartile presentation range; high-fishable extends through p95, very-high occupies the p95–p99 tail, and blown-out presentation begins at p99. These are Fruitvale presentation-shape inputs, not access or safety thresholds.",
  sourceNotes:
    "USGS 04122200 daily discharge audit recorded in the White Phase C packets and reconciled across all public species on 2026-08-27.",
};

const WHITE_BASELINE = {
  metric: "flow_cfs" as const,
  version: "white-fruitvale-1957-2025-v1",
  hasPercentileBaselines: true,
  coveredWindowPercent: 0.999,
  minimumHistoryYears: 10,
  sourceNotes:
    "USGS 04122200 daily discharge has near-complete coverage from 1957; the Fishability replay uses the complete August–December union shared by every public fall species.",
};

export const WHITE_FALL_CHINOOK_RUN_PROFILE: AuditedRiverRunProfile = {
  runId: "white_fall_chinook",
  riverId: "white",
  biologyProfileId: "great_lakes_chinook_v1",
  displayName: "Fall Chinook",
  species: "chinook_salmon",
  season: "fall",
  runType: "fall_spawn",
  movementEngineId: "fall_cooling",
  runStageCopyStrategy: "onboarding_corridor",
  primitiveCapabilities: {
    migrationStage: { status: "available" },
    activity: {
      status: "available",
    },
    fishInRiver: { status: "available" },
    fishability: { status: "available" },
    migrationTiming: {
      status: "unavailable",
      reason: "no_accepted_historical_baseline",
      notes:
        "No accepted same-reach paired history supports a migration-timing comparison.",
    },
    push: {
      status: "unavailable",
      reason: "no_accepted_water_temperature_source",
      notes:
        "No measured temperature source represents the Fruitvale hydraulic reach.",
    },
  },
  runWindow: {
    preRunStart: "08-01",
    stagingStart: "08-10",
    start: "08-15",
    beginningEnd: "08-23",
    buildingEstablishedStart: "09-01",
    buildingBroadStart: "09-15",
    peakStart: "10-01",
    peak: "10-08",
    peakEnd: "10-15",
    taperingEnd: "10-31",
    end: "11-10",
    lateEnd: "11-15",
    postRunLateCopyEnd: "11-17",
  },
  historicalPresence: {
    maximum: 7,
    distributionScope: "broad",
    curveVersion: "white-chinook-presence-v2-draft",
    evidenceNotes:
      "Draft 7/10 broad below-Hesperia curve opens conservatively on August 15, when DNR statewide biology supports late-summer upstream migration and catchability. Direct White observations strengthen the curve from mid-September through late October. It is not a live fish count.",
    sourceNotes:
      "Michigan DNR Lower White River Status Report 0460, Chinook biology, 2025 conservation-officer reports, and Phase C owner calibrations.",
    anchors: [
      { dayOffsetFromStart: 0, fractionOfMaximum: 0.05 },
      { dayOffsetFromStart: 7, fractionOfMaximum: 0.08 },
      { dayOffsetFromStart: 17, fractionOfMaximum: 0.12 },
      { dayOffsetFromStart: 31, fractionOfMaximum: 0.25 },
      { dayOffsetFromStart: 47, fractionOfMaximum: 0.7 },
      { dayOffsetFromStart: 54, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 61, fractionOfMaximum: 0.95 },
      { dayOffsetFromStart: 68, fractionOfMaximum: 0.8 },
      { dayOffsetFromStart: 77, fractionOfMaximum: 0.55 },
      { dayOffsetFromStart: 87, fractionOfMaximum: 0.25 },
      { dayOffsetFromStart: 92, fractionOfMaximum: 0.05 },
    ],
  },
  activity: whiteObservedActivity({
    version: "white-fall-chinook-observed-activity-v3",
    profile: "chinook_fall_reaction",
    weights: {
      light: .55,
      waterTemperature: .2,
      riverBehavior: .15,
      weather: .1,
    },
    temperature: {
      coldF: 43,
      preferredMinF: 48,
      preferredMaxF: 62,
      warmF: 68,
      barrierF: 72,
    },
    ending: 49,
    lifecycle: {
      peakEnd: "10-15",
      taperingEnd: "10-31",
      endingEnd: "11-15",
    },
    evidenceNotes:
      "Observed White River Chinook response model for a fish already present below Hesperia Dam. Fruitvale hydraulics, Weaver Street measured temperature, and Pines Point weather are independently freshness-gated and combined as complementary corridor inputs. The 55/20/15/10 weighting follows the audited Big Manistee and Muskegon Chinook calibration: effective light leads, measured temperature and river behavior materially inform the score, and precipitation remains restrained. The model identifies the stations as different reaches and does not infer migration, abundance, catch probability, access, or safety.",
  }),
  waterTemperature: WHITE_WEAVER_ACTIVITY_TEMPERATURE,
  fishabilityBands: WHITE_FISHABILITY,
  baselineCoverage: WHITE_BASELINE,
  researchNotes:
    "Owner-approved observed-input White Fall Chinook model. Fruitvale flow and Weaver Street temperature remain separately labeled while both contribute to conditional Activity.",
  sourceNotes:
    "docs/onboarding/river-run/white/runs/fall-chinook.md and its primary-source evidence ledger, completed 2026-08-24.",
  publicAudit: {
    isEnabled: true,
    auditVersion: "white-fall-chinook-observed-activity-release-audit-v2",
    notes:
      "Owner directed the measured Fruitvale-flow and Weaver-temperature Activity combination on 2026-08-26. The 2022-2025 mechanical replay passed every scoring invariant over 264 paired days but remains below the 80% historical coverage gate; see docs/audits/river-run-white-observed-activity-audit-2026-08-26.md.",
  },
};

export const WHITE_FALL_COHO_RUN_PROFILE: AuditedRiverRunProfile = {
  runId: "white_fall_coho",
  riverId: "white",
  biologyProfileId: "great_lakes_coho_v1",
  displayName: "Fall Coho",
  species: "coho_salmon",
  season: "fall",
  runType: "fall_spawn",
  movementEngineId: "fall_cooling",
  runStageCopyStrategy: "onboarding_corridor",
  primitiveCapabilities: {
    ...WHITE_FALL_CHINOOK_RUN_PROFILE.primitiveCapabilities,
    activity: {
      status: "available",
    },
  },
  runWindow: {
    preRunStart: "08-20",
    stagingStart: "08-27",
    start: "09-05",
    beginningEnd: "09-15",
    buildingEstablishedStart: "09-16",
    buildingBroadStart: "10-01",
    peakStart: "10-08",
    peak: "10-15",
    peakEnd: "10-25",
    taperingEnd: "11-10",
    end: "11-20",
    lateEnd: "11-30",
    postRunLateCopyEnd: "12-02",
  },
  historicalPresence: {
    maximum: 2,
    distributionScope: "broad",
    curveVersion: "white-coho-presence-v2-draft",
    evidenceNotes:
      "A deliberately low 2/10 curve represents the DNR-documented annual migration, wild fish in accessible tributaries, and occasional catches. Broad describes possible below-Hesperia distribution, not abundance or dependable fish at every section.",
    sourceNotes:
      "Michigan DNR Lower White River Status Report 0460, White Lake Status Report 2024-360, and current Coho biology; exact anchors are conservative owner calibration.",
    anchors: [
      { dayOffsetFromStart: 0, fractionOfMaximum: 0.05 },
      { dayOffsetFromStart: 10, fractionOfMaximum: 0.15 },
      { dayOffsetFromStart: 25, fractionOfMaximum: 0.35 },
      { dayOffsetFromStart: 33, fractionOfMaximum: 0.6 },
      { dayOffsetFromStart: 40, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 50, fractionOfMaximum: 0.9 },
      { dayOffsetFromStart: 66, fractionOfMaximum: 0.55 },
      { dayOffsetFromStart: 76, fractionOfMaximum: 0.25 },
      { dayOffsetFromStart: 86, fractionOfMaximum: 0.05 },
    ],
  },
  activity: whiteObservedActivity({
    version: "white-fall-coho-observed-activity-v3",
    profile: "coho_fall_reaction",
    weights: {
      light: .5,
      waterTemperature: .25,
      riverBehavior: .15,
      weather: .1,
    },
    temperature: {
      coldF: 40,
      preferredMinF: 45,
      preferredMaxF: 60,
      warmF: 64,
      barrierF: 68,
    },
    ending: 42,
    lifecycle: {
      peakEnd: "10-25",
      taperingEnd: "11-10",
      endingEnd: "11-30",
    },
    evidenceNotes:
      "Observed White River Coho response model for an occasionally present fish below Hesperia Dam. The 50/25/15/10 weighting matches the audited Pere Marquette, Big Manistee, Muskegon, and St. Joseph Coho calibration: effective light leads, followed by Weaver Street temperature, Fruitvale river behavior, and restrained precipitation. Each source is independently freshness-gated and explicitly labeled by reach. Activity remains conditional responsiveness and cannot increase the sparse presence ceiling or infer migration, abundance, catch probability, access, or safety.",
  }),
  waterTemperature: WHITE_WEAVER_ACTIVITY_TEMPERATURE,
  fishabilityBands: WHITE_FISHABILITY,
  baselineCoverage: WHITE_BASELINE,
  researchNotes:
    "Owner-approved observed-input White Fall Coho model. Activity remains conditional on a Coho being present and does not increase the conservative 2/10 presence ceiling.",
  sourceNotes:
    "docs/onboarding/river-run/white/runs/fall-coho.md; research corrected 2026-08-24.",
  publicAudit: {
    isEnabled: true,
    auditVersion: "white-fall-coho-observed-activity-release-audit-v2",
    notes:
      "Owner directed the measured Fruitvale-flow and Weaver-temperature Activity combination on 2026-08-26. The 2022-2025 mechanical replay passed every scoring invariant over 272 paired days but remains below the 80% historical coverage gate; see docs/audits/river-run-white-observed-activity-audit-2026-08-26.md.",
  },
};

export const WHITE_FALL_STEELHEAD_RUN_PROFILE: AuditedRiverRunProfile = {
  runId: "white_fall_steelhead",
  riverId: "white",
  biologyProfileId: "great_lakes_steelhead_fall_entry_v1",
  displayName: "Fall Steelhead",
  species: "steelhead",
  season: "fall",
  runType: "fall_entry",
  movementEngineId: "fall_entry_cooling",
  runStageCopyStrategy: "onboarding_corridor",
  primitiveCapabilities: {
    ...WHITE_FALL_CHINOOK_RUN_PROFILE.primitiveCapabilities,
    activity: {
      status: "available",
    },
  },
  runWindow: {
    preRunStart: "09-15",
    stagingStart: "10-01",
    start: "10-20",
    beginningEnd: "10-31",
    buildingEstablishedStart: "11-01",
    buildingBroadStart: "11-15",
    peakStart: "11-20",
    peak: "11-25",
    peakEnd: "12-10",
    taperingEnd: "12-20",
    end: "12-28",
    lateEnd: "12-31",
    postRunLateCopyEnd: "01-02",
  },
  historicalPresence: {
    maximum: 7,
    distributionScope: "broad",
    curveVersion: "white-steelhead-fall-entry-v1-draft",
    evidenceNotes:
      "Draft 7/10 broad below-Hesperia fall-entry curve reflects the current DNR destination fishery and general Great Lakes late-October-through-winter entry biology. The retained late value means fish may hold; it is not a count or winter model.",
    sourceNotes:
      "Michigan DNR Lower White River Status Report 0460, Michigan Steelhead biology, and Phase C owner calibrations.",
    anchors: [
      { dayOffsetFromStart: 0, fractionOfMaximum: 0.05 },
      { dayOffsetFromStart: 7, fractionOfMaximum: 0.12 },
      { dayOffsetFromStart: 12, fractionOfMaximum: 0.22 },
      { dayOffsetFromStart: 22, fractionOfMaximum: 0.4 },
      { dayOffsetFromStart: 26, fractionOfMaximum: 0.55 },
      { dayOffsetFromStart: 31, fractionOfMaximum: 0.75 },
      { dayOffsetFromStart: 36, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 51, fractionOfMaximum: 0.95 },
      { dayOffsetFromStart: 61, fractionOfMaximum: 0.88 },
      { dayOffsetFromStart: 69, fractionOfMaximum: 0.82 },
      { dayOffsetFromStart: 72, fractionOfMaximum: 0.78 },
    ],
  },
  activity: whiteObservedActivity({
    version: "white-fall-steelhead-observed-activity-v4",
    profile: "steelhead_feeding",
    weights: {
      light: .25,
      waterTemperature: .5,
      riverBehavior: .15,
      weather: .1,
    },
    temperature: {
      coldF: 39,
      preferredMinF: 44,
      preferredMaxF: 56,
      warmF: 64,
      barrierF: 68,
    },
    stageResponseAdjustment: {
      pre_run: -25,
      beginning: -22,
      peak: 20,
      tapering: 12,
      ending: -3,
      post_run: -10,
    },
    ending: 100,
    evidenceNotes:
      "Observed White River Steelhead response model for a living fish already present below Hesperia Dam. The 25/50/15/10 weighting matches the audited Pere Marquette, Big Manistee, Muskegon, and St. Joseph Steelhead calibration: Weaver Street measured temperature leads, hourly light separates response windows, Fruitvale river behavior remains meaningful, and precipitation is restrained. A fixed 2022-2025 replay showed that favorable early temperatures otherwise made Pre-run and Beginning exceed Peak; bounded -25/-22/0/+20/+12/-3/-10 stage adjustments restore a Peak-led lifecycle without changing the measured-input weights or bypassing temperature, blown-out, missing-data, or 96-point maximum caps. Each source is independently freshness-gated and explicitly labeled by reach. The profile has no salmon mortality ramp, taper penalty, or ending cap and cannot infer migration, abundance, catch probability, access, or safety.",
  }),
  waterTemperature: WHITE_WEAVER_ACTIVITY_TEMPERATURE,
  fishabilityBands: WHITE_FISHABILITY,
  baselineCoverage: WHITE_BASELINE,
  researchNotes:
    "Owner-approved observed-input White Fall Steelhead model. Terminal behavior stops the fall-entry model without claiming fish left or using salmon mortality language.",
  sourceNotes:
    "docs/onboarding/river-run/white/runs/fall-steelhead.md and its primary-source evidence ledger, completed 2026-08-24.",
  publicAudit: {
    isEnabled: true,
    auditVersion: "white-fall-steelhead-observed-activity-release-audit-v3",
    notes:
      "Owner directed the measured Fruitvale-flow and Weaver-temperature Activity combination on 2026-08-26. The 2022-2025 mechanical replay passed every scoring invariant and the 80% coverage gate over 303 paired days; see docs/audits/river-run-white-observed-activity-audit-2026-08-26.md.",
  },
};

export const WHITE_CONFIGURATION_DOCUMENT: RiverRunConfigurationDocument = {
  schemaVersion: "river-run-config-v1",
  configVersion: "2026-08-27-white-fishability-reconciliation.4",
  movementEngineVersion: [
    getMovementEngineDefinition("fall_cooling").version,
    getMovementEngineDefinition("fall_entry_cooling").version,
  ].join("+"),
  river: WHITE_RIVER_PROFILE,
  biologyProfiles: [
    GREAT_LAKES_CHINOOK_BIOLOGY_PROFILE,
    GREAT_LAKES_COHO_BIOLOGY_PROFILE,
    GREAT_LAKES_STEELHEAD_FALL_ENTRY_BIOLOGY_PROFILE,
  ],
  runs: [
    WHITE_FALL_CHINOOK_RUN_PROFILE,
    WHITE_FALL_COHO_RUN_PROFILE,
    WHITE_FALL_STEELHEAD_RUN_PROFILE,
  ],
};
