import type {
  ActivityRules,
  AuditedRiverRunProfile,
  FishabilityBands,
  HistoricalPresenceConfig,
  RiverProfile,
  RiverRunConfigurationDocument,
} from "../../types.ts";
import { getMovementEngineDefinition } from "../movementEngines.ts";
import {
  GREAT_LAKES_CHINOOK_BIOLOGY_PROFILE,
  GREAT_LAKES_COHO_BIOLOGY_PROFILE,
  GREAT_LAKES_LAKE_RUN_BROWN_TROUT_BIOLOGY_PROFILE,
  GREAT_LAKES_STEELHEAD_FALL_ENTRY_BIOLOGY_PROFILE,
} from "../speciesBiology.ts";
import { WISCONSIN_FIXED_FLOW_SEASONAL_NORMALS } from "./wisconsinFixedFlowSeasonal.generated.ts";

const MILWAUKEE_ESTABROOK_ACTIVITY_SCOPE =
  "This read combines Estabrook flow, measured water temperature, and local weather for the Urban Greenway near Estabrook Park. It does not directly measure Harbor & Downtown or the North Shore above Kletzsch.";

function milwaukeeObservedActivity(input: {
  version: string;
  profile: ActivityRules["profile"];
  weights: ActivityRules["weights"];
  temperature: ActivityRules["temperature"];
  stageResponseAdjustment?: NonNullable<
    ActivityRules["stageResponseAdjustment"]
  >;
  ending: number;
  warmWaterMaximum?: number;
  lifecycle?: NonNullable<ActivityRules["caps"]["lifecycleRamp"]>;
  evidenceNotes: string;
}): ActivityRules {
  return {
    version: input.version,
    profile: input.profile,
    dataMode: "observed_river",
    minimumInputContract: "weather_and_one_measured_river_input",
    inputReach: {
      reachIds: ["milwaukee_urban_greenway"],
      hydraulicSourceIds: ["milwaukee_estabrook_usgs"],
      waterTemperatureSourceIds: ["milwaukee_estabrook_temperature"],
      weatherPointIds: ["milwaukee_estabrook_weather"],
      notes:
        "All observed inputs are paired at the Estabrook Park portion of the Urban Greenway. No measured-input claim may be extended to the harbor or North Shore.",
    },
    scopeCopy: MILWAUKEE_ESTABROOK_ACTIVITY_SCOPE,
    weights: input.weights,
    temperature: input.temperature,
    stageResponseAdjustment: input.stageResponseAdjustment,
    hydraulicTrend: {
      rising24h: { absolute: 50, percent: 10 },
      meaningfulRise24h: { absolute: 150, percent: 28 },
      sharpRise24h: { absolute: 370, percent: 57 },
    },
    caps: {
      noMeasuredRiverData: 64,
      noWaterTemperature: 64,
      lateRun: 100,
      ending: input.ending,
      stageResponseMaximum: 96,
      ...(input.warmWaterMaximum !== undefined
        ? { warmWaterMaximum: input.warmWaterMaximum }
        : {}),
      ...(input.lifecycle
        ? { taperingPenalty: 15, lifecycleRamp: input.lifecycle }
        : {}),
    },
    evidenceNotes: input.evidenceNotes,
  };
}

const MILWAUKEE_ESTABROOK_ACTIVITY_TEMPERATURE = {
  sourcePriority: ["milwaukee_estabrook_temperature"],
  upstreamFallbackPositiveSignalCap: 1 as const,
  notes:
    "The Estabrook sensor is the sole accepted measured-temperature input for the Urban Greenway Activity scope. It is not a harbor or North Shore measurement.",
};

export const MILWAUKEE_RIVER_PROFILE: RiverProfile = {
  riverId: "milwaukee",
  displayName: "Milwaukee River",
  state: "WI",
  region: "great_lakes",
  timezone: "America/Chicago",
  mouthLat: 43.025,
  mouthLon: -87.899,
  hydraulicSources: [{
    sourceId: "milwaukee_estabrook_usgs",
    provider: "USGS",
    siteId: "04087000",
    name: "Milwaukee River at Milwaukee — Estabrook Park",
    role: "primary",
    primaryMetric: "flow_cfs",
    availableMetrics: ["flow_cfs", "gage_height_ft"],
    historyYearsAvailable: 112,
    maxAgeHours: 2,
    reachQuality: "good",
    reachNotes:
      "Directly represents the Urban Greenway near Estabrook Park. Harbor water levels can be Lake Michigan/seiche affected, and this source does not measure the North Shore above Kletzsch.",
  }],
  waterTemperatureSources: [{
    sourceId: "milwaukee_estabrook_temperature",
    provider: "USGS",
    siteId: "04087000",
    name: "Milwaukee River at Milwaukee — measured water temperature",
    role: "primary",
    priority: 1,
    sourceType: "same_gauge",
    maxAgeHours: 2,
    smoothingWindowHours: 3,
    minValidF: 30,
    maxValidF: 90,
    maxRateChangeFPerHour: 4,
    maxPeerDifferenceF: 6,
    reachNotes:
      "Measured at Estabrook Park in the Urban Greenway. It does not directly represent Milwaukee Harbor or the North Shore above Kletzsch.",
    attribution:
      "U.S. Geological Survey Water Data for the Nation; recent readings are provisional and subject to revision.",
  }],
  fixedFlowSeasonalBaseline: {
    baselineVersion:
      "milwaukee-estabrook-post-removal-date-window-2019-2025-v2",
    historicalStartYear: 2019,
    historicalEndYear: 2025,
    attribution:
      "U.S. Geological Survey approved daily mean discharge, fixed 2019–2025 post-Estabrook-removal comparison period, with date-relative coverage through Feb. 15 for the complete supported report tail.",
    normals: WISCONSIN_FIXED_FLOW_SEASONAL_NORMALS.milwaukee,
  },
  weatherPoints: [{
    weatherPointId: "milwaukee_estabrook_weather",
    lat: 43.1000116,
    lon: -87.9089745,
    role: "primary",
  }],
  foundation: {
    version: "milwaukee-foundation-v3-release",
    corridorLengthMiles: 32,
    downstreamTerminus: "Milwaukee Harbor mouth at Lake Michigan",
    upstreamTerminus:
      "Downstream face of Bridge Street Dam in Grafton for all four supported runs",
    targetSpecies: [
      "chinook_salmon",
      "coho_salmon",
      "steelhead",
      "lake_run_brown_trout",
    ],
    reaches: [
      {
        reachId: "milwaukee_harbor_downtown",
        displayName: "Harbor & Downtown — Lake Michigan to North Avenue",
        order: 1,
        role: "harbor",
        gaugeRepresented: false,
        notes:
          "Lake Michigan entry and lower-river corridor. Harbor levels can oscillate with the lake; lake-run Brown Trout opportunity is concentrated toward this lower reach but does not end here.",
        sourceNotes:
          "Wisconsin DNR Milwaukee fall access material, Milwaukee Estuary documentation, and owner-approved Gate 2/3 endpoint decision.",
      },
      {
        reachId: "milwaukee_urban_greenway",
        displayName: "Urban Greenway — North Avenue to Kletzsch Park",
        order: 2,
        role: "middle",
        gaugeRepresented: true,
        notes:
          "North Avenue and Estabrook dams are removed. The Estabrook USGS station directly represents part of this reach.",
        sourceNotes:
          "Wisconsin DNR habitat-management record and USGS 04087000 station record.",
      },
      {
        reachId: "milwaukee_north_shore",
        displayName: "North Shore — Kletzsch Park to Bridge Street Dam",
        order: 3,
        role: "terminal",
        gaugeRepresented: false,
        notes:
          "Kletzsch and Mequon-Thiensville provide operational passage; Bridge Street Dam is the conservative complete upstream barrier. The signed Kletzsch bypass/refuge is closed to fishing.",
        sourceNotes:
          "Wisconsin DNR Kletzsch refuge rule, habitat-management actions, and fishing-season definition.",
      },
    ],
    primaryGaugeReachId: "milwaukee_urban_greenway",
    contextualGaugeSiteIds: ["04087170"],
    weatherStrategy: {
      mode: "single_point",
      primaryWeatherPointId: "milwaukee_estabrook_weather",
      basinRepresentation:
        "Modeled Estabrook-area weather is context for the Urban Greenway only and does not measure river response.",
      sourceNotes:
        "Production-shaped Open-Meteo probe at the Estabrook station coordinates, 2026-08-26.",
    },
    stateRegulations: [{
      state: "WI",
      version: "wisconsin-2026-2027-fishing-regulations",
      jurisdiction: "Wisconsin DNR Lake Michigan tributary regulations",
      reminderCopy:
        "The signed Kletzsch fish-passage refuge is closed to fishing year-round. From Sept. 15 through the first Saturday in May, fishing in Lake Michigan tributaries is prohibited from one-half hour after sunset to one-half hour before sunrise. Check current Wisconsin regulations, posted refuge boundaries, property access, and emergency orders.",
      accessAndSafetyNotes:
        "Section names are orientation ranges, not promises of legal access, fish passage under every flow, wading, boating, or safety.",
      sourceNotes:
        "Wisconsin DNR 2026-2027 fishing regulations, Lake Michigan tributary definition, and Kletzsch FH1022 refuge rule; recheck at release.",
    }],
    evidenceNotes:
      "Owner-approved Milwaukee identity, sections, restrictions, and four-species portfolio. The 2026-08-26 Gate 4B correction recognizes Bridge Street Dam as the common complete physical endpoint while retaining lower-river-weighted Brown Trout opportunity copy.",
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
      "Gauge Read resolves flow, height, and temperature independently from the paginated five-minute USGS feed. Every observed Activity read is limited to the Estabrook Urban Greenway reach, including Brown Trout; it is never presented as Harbor or North Shore measurement truth.",
  },
  conditionDataCapabilities: {
    hydraulics: { status: "available" },
    waterTemperature: { status: "available" },
  },
  supportStatus: "beta",
  gaugeLimitationCopy:
    "Measured at Estabrook Park in the Urban Greenway. Harbor levels can move with Lake Michigan, and this station does not represent the North Shore above Kletzsch.",
  regulationReminderCopy:
    "The signed Kletzsch fish-passage refuge is closed year-round. From Sept. 15 through the first Saturday in May, Lake Michigan tributary night-fishing restrictions apply. Verify current Wisconsin rules, signs, access, and emergency orders before fishing.",
};

const MILWAUKEE_BASELINE = {
  metric: "flow_cfs" as const,
  version: "milwaukee-estabrook-post-removal-fall-2019-2025-v1",
  hasPercentileBaselines: true,
  coveredWindowPercent: 1,
  minimumHistoryYears: 7,
  sourceNotes:
    "USGS 04087000 daily mean discharge, fixed 2019-2025 post-Estabrook-removal interval. The Aug. 1-Jan. 15 audit contained 1,176 daily observations: p10 170, p25 237, median 359, p75 594, p90 1,110, and p95 1,520 CFS.",
};

const MILWAUKEE_FISHABILITY: FishabilityBands = {
  version: "milwaukee-estabrook-fishability-v2",
  metric: "flow_cfs",
  sourceLabel: "Estabrook Park Urban Greenway reach",
  tooLow: { max: 170 },
  lowFishable: { min: 170, max: 237 },
  ideal: { min: 237, max: 594 },
  highFishable: { min: 594, max: 1110 },
  blownOut: { min: 1520 },
  caps: {
    staleGauge: 55,
    unknownTrend: 49,
    veryLow: 45,
    blownOut: 24,
    sharpRiseHigh: 40,
  },
  evidenceNotes:
    "Accepted post-removal seasonal-percentile bands describe presentation shape near Estabrook Park only. The p90-p95 interval is intentionally very high rather than being folded into ordinary high-fishable water. These bands do not establish fish abundance, access, wading or boating safety, or conditions in the harbor or North Shore.",
  sourceNotes:
    "USGS 04087000 daily mean discharge audit for Aug. 1-Jan. 15 in 2019-2025, rechecked 2026-08-27. Boundaries use p10/p25/p75/p90/p95 so exceptional high water cannot receive the same grade as an ordinary high-fishable presentation.",
};

const primitiveCapabilities = {
  migrationStage: { status: "available" as const },
  activity: { status: "available" as const },
  fishInRiver: { status: "available" as const },
  fishability: { status: "available" as const },
  migrationTiming: {
    status: "unavailable" as const,
    reason: "no_accepted_historical_baseline" as const,
    notes:
      "No Milwaukee Migration Timing model is accepted; seasonal Migration Stage remains calendar based.",
  },
  push: {
    status: "unavailable" as const,
    reason: "no_accepted_historical_baseline" as const,
    notes:
      "No legacy Push model is accepted; current measurements must not be presented as confirmed fish movement.",
  },
};

function presence(input: {
  maximum: HistoricalPresenceConfig["maximum"];
  distributionScope: HistoricalPresenceConfig["distributionScope"];
  version: string;
  anchors: HistoricalPresenceConfig["anchors"];
  evidenceNotes: string;
  sourceNotes: string;
}): HistoricalPresenceConfig {
  return {
    maximum: input.maximum,
    distributionScope: input.distributionScope,
    curveVersion: input.version,
    evidenceNotes: input.evidenceNotes,
    sourceNotes: input.sourceNotes,
    anchors: input.anchors,
  };
}

const sharedRunFields = {
  riverId: "milwaukee",
  season: "fall" as const,
  runStageCopyStrategy: "onboarding_corridor" as const,
  primitiveCapabilities,
  fishabilityBands: MILWAUKEE_FISHABILITY,
  baselineCoverage: MILWAUKEE_BASELINE,
  publicAudit: {
    isEnabled: true,
    auditVersion: "milwaukee-four-species-release-audit-v1",
    notes:
      "Owner accepted all four Milwaukee fall profiles for public catalog promotion on 2026-08-29. Production deployment remains a separate explicit release action.",
  },
};

export const MILWAUKEE_FALL_CHINOOK_RUN_PROFILE: AuditedRiverRunProfile = {
  ...sharedRunFields,
  runId: "milwaukee_fall_chinook",
  biologyProfileId: "great_lakes_chinook_v1",
  displayName: "Fall Chinook",
  species: "chinook_salmon",
  runType: "fall_spawn",
  movementEngineId: "fall_cooling",
  runWindow: {
    preRunStart: "08-01",
    stagingStart: "08-15",
    start: "08-25",
    beginningEnd: "09-07",
    buildingEstablishedStart: "09-08",
    buildingBroadStart: "09-20",
    peakStart: "09-28",
    peak: "10-08",
    peakEnd: "10-18",
    taperingEnd: "10-31",
    end: "11-10",
    lateEnd: "11-20",
    postRunLateCopyEnd: "11-30",
  },
  historicalPresence: presence({
    maximum: 8,
    distributionScope: "sectional",
    version: "milwaukee-chinook-presence-v1-release",
    anchors: [
      { dayOffsetFromStart: 0, fractionOfMaximum: .08 },
      { dayOffsetFromStart: 10, fractionOfMaximum: .22 },
      { dayOffsetFromStart: 17, fractionOfMaximum: .4 },
      { dayOffsetFromStart: 26, fractionOfMaximum: .62 },
      { dayOffsetFromStart: 34, fractionOfMaximum: .82 },
      { dayOffsetFromStart: 44, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 54, fractionOfMaximum: .9 },
      { dayOffsetFromStart: 67, fractionOfMaximum: .55 },
      { dayOffsetFromStart: 77, fractionOfMaximum: .22 },
      { dayOffsetFromStart: 87, fractionOfMaximum: .06 },
      { dayOffsetFromStart: 97, fractionOfMaximum: 0 },
    ],
    evidenceNotes:
      "Owner/local 8/10 calibration. Modern Wisconsin DNR weir timing centers regional Chinook abundance in early October while Milwaukee-area evidence retains a late-September leading edge. The curve broadens from Harbor & Downtown into supported inland sections without treating comparator counts or stocking as a Milwaukee return count.",
    sourceNotes:
      "Wisconsin DNR Milwaukee fall-fishing calendar, Chinook research page, current stocking summary, corridor sources, and owner-relayed Wisconsin local calibration recorded 2026-08-26.",
  }),
  activity: milwaukeeObservedActivity({
    version: "milwaukee-fall-chinook-observed-activity-v2-release",
    profile: "chinook_fall_reaction",
    weights: {
      light: .35,
      waterTemperature: .35,
      riverBehavior: .25,
      weather: .05,
    },
    temperature: {
      coldF: 43,
      preferredMinF: 48,
      preferredMaxF: 62,
      warmF: 68,
      barrierF: 72,
    },
    stageResponseAdjustment: {
      pre_run: 0,
      beginning: 0,
      building: 5,
      peak: 0,
      tapering: 0,
      ending: 0,
      post_run: 0,
    },
    ending: 49,
    warmWaterMaximum: 43,
    lifecycle: {
      peakEnd: "10-18",
      taperingEnd: "10-31",
      endingEnd: "11-20",
    },
    evidenceNotes:
      "Estabrook-scoped observed Chinook responsiveness candidate. Measured temperature and effective light lead, river presentation remains material, precipitation is restrained same-block context, and the late semelparous lifecycle fades continuously. A bounded owner-requested five-point Building response correction preserves the rising-run opportunity without altering Stage or Fish In River. The audited 43-point warm-water ceiling preserves the 72 F barrier. Fixed replays validate behavior rather than fish abundance or catch probability.",
  }),
  waterTemperature: MILWAUKEE_ESTABROOK_ACTIVITY_TEMPERATURE,
  researchNotes:
    "Hidden Gate 4B candidate with Estabrook-scoped observed Activity. Kletzsch refuge and seasonal night restrictions must precede actionable section guidance.",
  sourceNotes: "docs/onboarding/river-run/milwaukee/runs/fall-chinook.md",
};

export const MILWAUKEE_FALL_COHO_RUN_PROFILE: AuditedRiverRunProfile = {
  ...sharedRunFields,
  runId: "milwaukee_fall_coho",
  biologyProfileId: "great_lakes_coho_v1",
  displayName: "Fall Coho",
  species: "coho_salmon",
  runType: "fall_spawn",
  movementEngineId: "fall_cooling",
  runWindow: {
    preRunStart: "08-20",
    stagingStart: "09-01",
    start: "09-10",
    beginningEnd: "09-20",
    buildingEstablishedStart: "09-21",
    buildingBroadStart: "10-01",
    peakStart: "10-10",
    peak: "10-20",
    peakEnd: "10-25",
    taperingEnd: "11-20",
    end: "11-30",
    lateEnd: "12-10",
    postRunLateCopyEnd: "12-20",
  },
  historicalPresence: presence({
    maximum: 7,
    distributionScope: "sectional",
    version: "milwaukee-coho-presence-v1-release",
    anchors: [
      { dayOffsetFromStart: 0, fractionOfMaximum: .05 },
      { dayOffsetFromStart: 10, fractionOfMaximum: .18 },
      { dayOffsetFromStart: 21, fractionOfMaximum: .5 },
      { dayOffsetFromStart: 30, fractionOfMaximum: .8 },
      { dayOffsetFromStart: 40, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 51, fractionOfMaximum: .88 },
      { dayOffsetFromStart: 71, fractionOfMaximum: .5 },
      { dayOffsetFromStart: 81, fractionOfMaximum: .22 },
      { dayOffsetFromStart: 91, fractionOfMaximum: .08 },
      { dayOffsetFromStart: 101, fractionOfMaximum: 0 },
    ],
    evidenceNotes:
      "Owner/local 7/10 calibration. Wisconsin DNR's Milwaukee-area calendar places Coho peak opportunity in October. The sectional curve does not convert stocking or generic regional opportunity into a whole-river abundance claim.",
    sourceNotes:
      "Wisconsin DNR Milwaukee fall-fishing calendar, current stocking summary, corridor sources, and owner-relayed Wisconsin local calibration recorded 2026-08-26.",
  }),
  activity: milwaukeeObservedActivity({
    version: "milwaukee-fall-coho-observed-activity-v1-release",
    profile: "coho_fall_reaction",
    weights: {
      light: .25,
      waterTemperature: .4,
      riverBehavior: .3,
      weather: .05,
    },
    temperature: {
      coldF: 40,
      preferredMinF: 45,
      preferredMaxF: 60,
      warmF: 64,
      barrierF: 68,
    },
    stageResponseAdjustment: {
      pre_run: 0,
      beginning: 4,
      building: 30,
      peak: 0,
      tapering: -5,
      ending: -5,
      post_run: 0,
    },
    ending: 42,
    lifecycle: {
      peakEnd: "10-31",
      taperingEnd: "11-20",
      endingEnd: "12-10",
    },
    evidenceNotes:
      "Estabrook-scoped observed Coho responsiveness candidate. Measured temperature leads, river presentation is secondary, effective light separates blocks, and precipitation remains restrained context. The semelparous lifecycle is continuously constrained without converting Activity into abundance or migration.",
  }),
  waterTemperature: MILWAUKEE_ESTABROOK_ACTIVITY_TEMPERATURE,
  researchNotes:
    "Hidden Gate 4B candidate with Estabrook-scoped observed Activity. The exact 7/10 ceiling retains medium-low count confidence.",
  sourceNotes: "docs/onboarding/river-run/milwaukee/runs/fall-coho.md",
};

export const MILWAUKEE_FALL_STEELHEAD_RUN_PROFILE: AuditedRiverRunProfile = {
  ...sharedRunFields,
  runId: "milwaukee_fall_steelhead",
  biologyProfileId: "great_lakes_steelhead_fall_entry_v1",
  displayName: "Fall Steelhead",
  species: "steelhead",
  runType: "fall_entry",
  movementEngineId: "fall_entry_cooling",
  runWindow: {
    preRunStart: "08-01",
    stagingStart: "08-15",
    start: "09-01",
    beginningEnd: "09-15",
    buildingEstablishedStart: "09-16",
    buildingBroadStart: "09-25",
    peakStart: "10-01",
    peak: "10-08",
    peakEnd: "10-25",
    taperingEnd: "11-20",
    end: "12-15",
    lateEnd: "12-31",
    postRunLateCopyEnd: "01-15",
  },
  historicalPresence: presence({
    maximum: 7,
    distributionScope: "sectional",
    version: "milwaukee-steelhead-fall-presence-v2-local-peak-release",
    anchors: [
      { dayOffsetFromStart: 0, fractionOfMaximum: .12 },
      { dayOffsetFromStart: 15, fractionOfMaximum: .35 },
      { dayOffsetFromStart: 24, fractionOfMaximum: .65 },
      { dayOffsetFromStart: 37, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 54, fractionOfMaximum: .9 },
      { dayOffsetFromStart: 80, fractionOfMaximum: .75 },
      { dayOffsetFromStart: 105, fractionOfMaximum: .62 },
    ],
    evidenceNotes:
      "Owner/local 7/10 calibration for Milwaukee fall Steelhead with an exact Oct. 8 peak anchor supplied by a Wisconsin angler. The surrounding stage and presence shoulders are conservative interpolations around that field anchor. Ending this model does not mean surviving Steelhead leave or die; winter holding and spring spawning remain separate lifecycle phases.",
    sourceNotes:
      "Wisconsin DNR Steelhead lifecycle and stocking/passage evidence plus owner-supplied Wisconsin local peak-date calibration recorded 2026-08-26.",
  }),
  activity: milwaukeeObservedActivity({
    version:
      "milwaukee-fall-steelhead-observed-activity-v4-local-calendar-draft",
    profile: "steelhead_feeding",
    weights: {
      light: .2,
      waterTemperature: .45,
      riverBehavior: .3,
      weather: .05,
    },
    temperature: {
      coldF: 39,
      preferredMinF: 44,
      preferredMaxF: 56,
      warmF: 66,
      barrierF: 70,
    },
    stageResponseAdjustment: {
      pre_run: 5,
      beginning: 7,
      building: 9,
      peak: 9,
      tapering: 0,
      ending: 0,
      post_run: 0,
    },
    ending: 100,
    evidenceNotes:
      "Estabrook-scoped observed Steelhead responsiveness candidate for living fish already present. Measured temperature leads, with river presentation and light secondary. The revised curve treats 64-66F as increasing stress, 66-70F as strongly constrained, and 70F as the hard barrier. Small pre-run through peak nudges preserve the approved early-stage calibration without letting the corrected October calendar inflate Peak Activity; tapering, ending, and post-run receive no lifecycle penalty. No salmon floor, mortality ramp, ending cap, or duplicated fresh-movement bonus is allowed.",
  }),
  waterTemperature: MILWAUKEE_ESTABROOK_ACTIVITY_TEMPERATURE,
  researchNotes:
    "Hidden Gate 4 fall-entry truth candidate. No salmon mortality semantics and no unbuilt winter/spring score are allowed.",
  sourceNotes: "docs/onboarding/river-run/milwaukee/runs/fall-steelhead.md",
};

export const MILWAUKEE_FALL_BROWN_TROUT_RUN_PROFILE: AuditedRiverRunProfile = {
  ...sharedRunFields,
  runId: "milwaukee_fall_brown_trout",
  biologyProfileId: "great_lakes_lake_run_brown_trout_v1",
  displayName: "Fall Lake-run Brown Trout",
  species: "lake_run_brown_trout",
  runType: "fall_repeat_spawn",
  movementEngineId: "fall_repeat_spawner_cooling",
  runWindow: {
    preRunStart: "09-01",
    stagingStart: "09-20",
    start: "10-01",
    beginningEnd: "10-15",
    buildingEstablishedStart: "10-16",
    buildingBroadStart: "11-01",
    peakStart: "11-15",
    peak: "11-25",
    peakEnd: "12-10",
    taperingEnd: "12-20",
    end: "01-15",
    lateEnd: "01-31",
    postRunLateCopyEnd: "02-15",
  },
  historicalPresence: presence({
    maximum: 9,
    distributionScope: "concentrated",
    version: "milwaukee-lake-run-brown-presence-v1-release",
    anchors: [
      { dayOffsetFromStart: 0, fractionOfMaximum: .05 },
      { dayOffsetFromStart: 14, fractionOfMaximum: .15 },
      { dayOffsetFromStart: 31, fractionOfMaximum: .5 },
      { dayOffsetFromStart: 45, fractionOfMaximum: .78 },
      { dayOffsetFromStart: 55, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 70, fractionOfMaximum: .9 },
      { dayOffsetFromStart: 80, fractionOfMaximum: .7 },
      { dayOffsetFromStart: 91, fractionOfMaximum: .45 },
      { dayOffsetFromStart: 106, fractionOfMaximum: .25 },
    ],
    evidenceNotes:
      "Owner/local 9/10 calibration with opportunity concentrated toward the lower river. Milwaukee County migration evidence recognizes Brown Trout moving upriver and Bridge Street Dam as the first complete physical fish barrier. DNR documents October tributary entry, late-October Milwaukee brood collection, November/early-December egg readiness, and a November-December Seeforellen spawning run. Surviving adults may hold or return lakeward; this curve never applies a terminal salmon-death assumption.",
    sourceNotes:
      "Wisconsin DNR 2026 Fishing Report, Milwaukee fall-fishing calendar, 2025 GLFC brood report, Lake Michigan trout/salmon questions, current stocking/creel evidence, and owner-relayed Wisconsin local calibration recorded 2026-08-26.",
  }),
  activity: milwaukeeObservedActivity({
    version: "milwaukee-fall-brown-observed-activity-v2-release",
    profile: "brown_trout_fall_reaction",
    weights: {
      light: .25,
      waterTemperature: .45,
      riverBehavior: .25,
      weather: .05,
    },
    temperature: {
      coldF: 38,
      preferredMinF: 44,
      preferredMaxF: 58,
      warmF: 64,
      barrierF: 70,
    },
    stageResponseAdjustment: {
      pre_run: -3,
      beginning: -2,
      building: -8,
      peak: 8,
      tapering: 2,
      ending: 0,
      post_run: -1,
    },
    ending: 100,
    evidenceNotes:
      "Brown Trout observed candidate for a living repeat spawner already present. Measured Estabrook temperature leads, with light and river presentation secondary and precipitation restrained. The read represents only the Urban Greenway near Estabrook even though the migration corridor continues from Harbor & Downtown to Bridge Street Dam. No salmon floor, mortality ramp, taper penalty, ending cap, or universal post-spawn departure is allowed.",
  }),
  waterTemperature: MILWAUKEE_ESTABROOK_ACTIVITY_TEMPERATURE,
  researchNotes:
    "Hidden Gate 4B repeat-spawner candidate corrected to the common Bridge Street physical endpoint. Opportunity remains lower-river weighted, Estabrook Activity remains Urban-Greenway scoped, and copy must not claim post-spawn death or universal lake return.",
  sourceNotes: "docs/onboarding/river-run/milwaukee/runs/fall-brown-trout.md",
};

export const MILWAUKEE_CONFIGURATION_DOCUMENT: RiverRunConfigurationDocument = {
  schemaVersion: "river-run-config-v1",
  configVersion: "2026-08-29-milwaukee-four-species-release.8+seasonal-zone-v1",
  movementEngineVersion: [
    getMovementEngineDefinition("fall_cooling").version,
    getMovementEngineDefinition("fall_entry_cooling").version,
    getMovementEngineDefinition("fall_repeat_spawner_cooling").version,
  ].join("+"),
  river: MILWAUKEE_RIVER_PROFILE,
  biologyProfiles: [
    GREAT_LAKES_CHINOOK_BIOLOGY_PROFILE,
    GREAT_LAKES_COHO_BIOLOGY_PROFILE,
    GREAT_LAKES_STEELHEAD_FALL_ENTRY_BIOLOGY_PROFILE,
    GREAT_LAKES_LAKE_RUN_BROWN_TROUT_BIOLOGY_PROFILE,
  ],
  runs: [
    MILWAUKEE_FALL_CHINOOK_RUN_PROFILE,
    MILWAUKEE_FALL_COHO_RUN_PROFILE,
    MILWAUKEE_FALL_STEELHEAD_RUN_PROFILE,
    MILWAUKEE_FALL_BROWN_TROUT_RUN_PROFILE,
  ],
};
