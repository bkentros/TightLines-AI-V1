import type {
  AuditedRiverRunProfile,
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
import { buildWeatherOnlyActivity } from "./weatherOnlyActivity.ts";
import { WISCONSIN_FIXED_FLOW_SEASONAL_NORMALS } from "./wisconsinFixedFlowSeasonal.generated.ts";

export const ROOT_RIVER_PROFILE: RiverProfile = {
  riverId: "root",
  displayName: "Root River",
  state: "WI",
  region: "great_lakes",
  timezone: "America/Chicago",
  mouthLat: 42.733,
  mouthLon: -87.778,
  hydraulicSources: [{
    sourceId: "root_horlick_usgs",
    provider: "USGS",
    siteId: "04087240",
    name: "Root River at Racine — below Horlick Dam",
    role: "primary",
    primaryMetric: "flow_cfs",
    availableMetrics: ["flow_cfs", "gage_height_ft"],
    historyYearsAvailable: 62,
    maxAgeHours: 2,
    reachQuality: "acceptable",
    reachNotes:
      "Measured 350 feet below Horlick Dam and upstream of the Steelhead Facility product endpoint. It is upper-river hydraulic context, not a Lincoln Park, downtown, or harbor measurement and not proof of fish passage.",
  }],
  waterTemperatureSources: [{
    sourceId: "root_60th_street_temperature",
    provider: "USGS",
    siteId: "04087234",
    name:
      "Root River at 60th Street near Caledonia — measured water temperature",
    role: "primary",
    priority: 1,
    sourceType: "nearby_gauge",
    maxAgeHours: 2,
    smoothingWindowHours: 3,
    minValidF: 30,
    maxValidF: 90,
    maxRateChangeFPerHour: 4,
    maxPeerDifferenceF: 6,
    historicalStartYear: 2017,
    historicalEndYear: 2026,
    reachNotes:
      "Measured far upstream at 60th Street, above Horlick Dam and the product corridor. It is a separately labeled upper-river input, not a lower-river temperature and not co-located with the hydraulic gauge.",
    attribution:
      "U.S. Geological Survey Water Data for the Nation; recent readings are provisional and subject to revision.",
  }],
  fixedFlowSeasonalBaseline: {
    baselineVersion: "root-horlick-date-window-2019-2024-v2",
    historicalStartYear: 2019,
    historicalEndYear: 2024,
    attribution:
      "U.S. Geological Survey approved daily mean discharge, fixed 2019–2024 comparison period, with date-relative coverage through Feb. 15. This is Gauge Read context only, not a Fishability calibration.",
    normals: WISCONSIN_FIXED_FLOW_SEASONAL_NORMALS.root,
  },
  weatherPoints: [{
    weatherPointId: "root_horlick_weather",
    lat: 42.751389,
    lon: -87.823611,
    role: "primary",
  }],
  foundation: {
    version: "root-foundation-v4-release",
    corridorLengthMiles: 3.8,
    downstreamTerminus: "Racine Harbor mouth at Lake Michigan",
    upstreamTerminus:
      "Downstream face of the operated Root River Steelhead Facility weir in Lincoln Park for all four supported runs",
    targetSpecies: [
      "chinook_salmon",
      "coho_salmon",
      "steelhead",
      "lake_run_brown_trout",
    ],
    reaches: [
      {
        reachId: "root_harbor_downtown",
        displayName: "Harbor & Downtown — Lake Michigan to 6th Street",
        order: 1,
        role: "harbor",
        gaugeRepresented: false,
        notes:
          "Lake entry and lower-city corridor. The accepted gauges are upstream and do not directly represent harbor conditions.",
        sourceNotes:
          "Wisconsin DNR Root River access map and owner-approved Gate 2 section decision.",
      },
      {
        reachId: "root_city_parks",
        displayName: "City Parks — 6th Street to Island Park",
        order: 2,
        role: "middle",
        gaugeRepresented: false,
        notes:
          "Public orientation corridor through lower Racine parks. Section naming does not guarantee shoreline access, safe wading, or equal fish distribution.",
        sourceNotes:
          "Wisconsin DNR Root River access map and waterbody records.",
      },
      {
        reachId: "root_lincoln_park",
        displayName: "Lincoln Park — Island Park to the Steelhead Facility",
        order: 3,
        role: "terminal",
        gaugeRepresented: false,
        notes:
          "The v1 corridor stops below the seasonal facility weir. Operations can block, process, or pass fish; do not infer passage or direct anglers above the facility from gauge data.",
        sourceNotes:
          "Wisconsin DNR facility page, 2023-2025 facility reports, and owner-approved conservative product endpoint.",
      },
    ],
    primaryGaugeReachId: null,
    contextualGaugeSiteIds: ["04087240", "04087234"],
    weatherStrategy: {
      mode: "single_point",
      primaryWeatherPointId: "root_horlick_weather",
      basinRepresentation:
        "Modeled weather near Horlick Dam supports only the independently calibrated Limited weather-only Activity model. It does not measure lower-river response, water temperature, or fish movement.",
      sourceNotes:
        "Production-shaped Open-Meteo probe at the Horlick hydraulic-station coordinates, 2026-08-26.",
    },
    stateRegulations: [{
      state: "WI",
      version: "wisconsin-2026-2027-fishing-regulations",
      jurisdiction: "Wisconsin DNR Lake Michigan tributary regulations",
      reminderCopy:
        "From Sept. 15 through the first Saturday in May, fishing in Lake Michigan tributaries is prohibited from one-half hour after sunset to one-half hour before sunrise. Steelhead Facility operations can block, process, or pass fish. Check current Wisconsin regulations, facility operations, fish-consumption advice, posted signs, property access, and emergency orders.",
      accessAndSafetyNotes:
        "Section labels are orientation ranges, not promises of legal access, safe wading or boating, or equal fish distribution.",
      sourceNotes:
        "Wisconsin DNR 2026-2027 fishing regulations, fall tributary guidance, Root River facility page, and owner-approved copy locks; recheck at release.",
    }],
    evidenceNotes:
      "Owner-approved Racine Root River identity, three-section mouth-to-facility corridor, operational-passage warning, and four-species 8/9/7/7 portfolio. DNR facility returns are bounded operational samples, not catch rates or complete run censuses.",
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
      "Gauge Read resolves Horlick flow/height and 60th Street temperature independently. Weather-only Activity refreshes from modeled Horlick weather without consuming either upstream river source. Observation, refresh, and device times remain separate; invalid or stale metrics fail closed and recover automatically.",
  },
  conditionDataCapabilities: {
    hydraulics: { status: "available" },
    waterTemperature: { status: "available" },
  },
  supportStatus: "beta",
  gaugeLimitationCopy:
    "Flow and height are measured below Horlick Dam; water temperature is measured farther upstream at 60th Street. These are separate upper-river readings, not harbor conditions, product-corridor measurements, or proof of fish passage at the Steelhead Facility.",
  regulationReminderCopy:
    "From Sept. 15 through the first Saturday in May, Lake Michigan tributary night-fishing restrictions apply. Steelhead Facility operations can block, process, or pass fish. Verify current Wisconsin rules, facility status, advisories, signs, property access, and emergency orders.",
};

const primitiveCapabilities: AuditedRiverRunProfile["primitiveCapabilities"] = {
  migrationStage: { status: "available" },
  activity: { status: "available" },
  fishInRiver: { status: "available" },
  fishability: {
    status: "unavailable",
    reason: "no_accepted_hydraulic_source",
    notes:
      "USGS 04087240 is 350 feet below Horlick Dam and 5.2 miles above the mouth, upstream of the product endpoint below the operated Steelhead Facility. It remains useful upper-river Gauge Read context but cannot support a presentation grade for the harbor-to-facility corridor.",
  },
  migrationTiming: {
    status: "unavailable",
    reason: "no_accepted_historical_baseline",
    notes:
      "The 60th Street temperature history has not passed the separate daily-gap and baseline audit required for Migration Timing.",
  },
  push: {
    status: "unavailable",
    reason: "no_accepted_historical_baseline",
    notes:
      "The separated upper-river sources and operational facility endpoint do not support a lower-corridor movement claim.",
  },
};

function presence(input: {
  maximum: HistoricalPresenceConfig["maximum"];
  version: string;
  anchors: HistoricalPresenceConfig["anchors"];
  evidenceNotes: string;
  sourceNotes: string;
}): HistoricalPresenceConfig {
  return {
    maximum: input.maximum,
    distributionScope: "broad",
    curveVersion: input.version,
    evidenceNotes: input.evidenceNotes,
    sourceNotes: input.sourceNotes,
    anchors: input.anchors,
  };
}

const sharedRunFields = {
  riverId: "root",
  season: "fall" as const,
  runStageCopyStrategy: "onboarding_corridor" as const,
  primitiveCapabilities,
  publicAudit: {
    isEnabled: true,
    auditVersion: "root-four-species-release-audit-v1",
    notes:
      "Owner accepted all four Root fall profiles for public catalog promotion on 2026-08-29. Production deployment remains a separate explicit release action.",
  },
};

export const ROOT_FALL_CHINOOK_RUN_PROFILE: AuditedRiverRunProfile = {
  ...sharedRunFields,
  runId: "root_fall_chinook",
  biologyProfileId: "great_lakes_chinook_v1",
  displayName: "Fall Chinook",
  species: "chinook_salmon",
  runType: "fall_spawn",
  movementEngineId: "fall_cooling",
  runWindow: {
    preRunStart: "08-01",
    stagingStart: "08-15",
    start: "08-25",
    beginningEnd: "09-08",
    buildingEstablishedStart: "09-09",
    buildingBroadStart: "09-20",
    peakStart: "10-01",
    peak: "10-08",
    peakEnd: "10-18",
    taperingEnd: "10-31",
    end: "11-10",
    lateEnd: "11-20",
    postRunLateCopyEnd: "11-30",
  },
  historicalPresence: presence({
    maximum: 8,
    version: "root-chinook-presence-v1-release",
    anchors: [
      { dayOffsetFromStart: 0, fractionOfMaximum: .06 },
      { dayOffsetFromStart: 15, fractionOfMaximum: .2 },
      { dayOffsetFromStart: 27, fractionOfMaximum: .45 },
      { dayOffsetFromStart: 37, fractionOfMaximum: .72 },
      { dayOffsetFromStart: 44, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 54, fractionOfMaximum: .9 },
      { dayOffsetFromStart: 67, fractionOfMaximum: .55 },
      { dayOffsetFromStart: 77, fractionOfMaximum: .2 },
      { dayOffsetFromStart: 87, fractionOfMaximum: .05 },
      { dayOffsetFromStart: 97, fractionOfMaximum: 0 },
    ],
    evidenceNotes:
      "The owner-approved 8/10 broad ceiling is supported by 2,409, 1,899, and 3,548 facility captures in 2023-2025. DNR reports strongest 2025 movement in early-to-mid October, while facility start dates are operational and cannot define first entry.",
    sourceNotes:
      "Wisconsin DNR Root River 2023-2025 fall summaries, 2024-2025 facility report, regional Chinook biology, current regulations, and owner-approved portfolio calibration.",
  }),
  activity: buildWeatherOnlyActivity({
    version: "root-fall-chinook-weather-activity-v3-gauge-clarity-release",
    profile: "chinook_fall_reaction",
    reachIds: [
      "root_harbor_downtown",
      "root_city_parks",
      "root_lincoln_park",
    ],
    weatherPointId: "root_horlick_weather",
    inputNotes:
      "Horlick hydraulics and 60th Street water temperature remain available to their accepted non-Activity surfaces but are excluded from Activity because both are upstream of the product corridor, are not co-located, and are separated from the corridor by the operated facility and additional reach. Modeled Horlick weather is the only Activity scoring source.",
    scopeCopy:
      "A live water-temperature gauge exists at 60th Street, but it is upstream of Horlick Dam and does not represent the supported corridor below the Steelhead Facility, so Activity excludes it. This Limited read uses modeled weather near Horlick and does not measure river level, clarity, or water temperature in the supported reaches.",
    stageResponseAdjustment: {
      pre_run: -5,
      beginning: -5,
      building: 0,
      peak: 0,
      tapering: 0,
      ending: 0,
      post_run: 0,
    },
    lifecycle: {
      peakEnd: "10-18",
      taperingEnd: "10-31",
      endingEnd: "11-20",
    },
    evidenceNotes:
      "Hidden Chinook response candidate for a fish already present in the Root product corridor. It scores effective light and restrained same-block precipitation only, with conservative weather-only ceilings and a continuous terminal lifecycle decline. It cannot infer temperature, river response, passage, movement, abundance, catch probability, access, or safety.",
  }),
  researchNotes:
    "Hidden Gate 4B broad Chinook candidate. The operational facility is the conservative product endpoint, not an absolute biological barrier; terminal copy retains semelparous lifecycle truth and Activity remains explicitly Limited and weather-only.",
  sourceNotes: "docs/onboarding/river-run/root/runs/fall-chinook.md",
};

export const ROOT_FALL_COHO_RUN_PROFILE: AuditedRiverRunProfile = {
  ...sharedRunFields,
  runId: "root_fall_coho",
  biologyProfileId: "great_lakes_coho_v1",
  displayName: "Fall Coho",
  species: "coho_salmon",
  runType: "fall_spawn",
  movementEngineId: "fall_cooling",
  runWindow: {
    preRunStart: "08-15",
    stagingStart: "08-25",
    start: "09-05",
    beginningEnd: "09-15",
    buildingEstablishedStart: "09-16",
    buildingBroadStart: "09-25",
    peakStart: "10-05",
    peak: "10-15",
    peakEnd: "10-25",
    taperingEnd: "11-10",
    end: "11-20",
    lateEnd: "11-30",
    postRunLateCopyEnd: "12-10",
  },
  historicalPresence: presence({
    maximum: 9,
    version: "root-coho-presence-v1-release",
    anchors: [
      { dayOffsetFromStart: 0, fractionOfMaximum: .06 },
      { dayOffsetFromStart: 10, fractionOfMaximum: .2 },
      { dayOffsetFromStart: 20, fractionOfMaximum: .5 },
      { dayOffsetFromStart: 30, fractionOfMaximum: .8 },
      { dayOffsetFromStart: 40, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 50, fractionOfMaximum: .9 },
      { dayOffsetFromStart: 66, fractionOfMaximum: .55 },
      { dayOffsetFromStart: 76, fractionOfMaximum: .22 },
      { dayOffsetFromStart: 86, fractionOfMaximum: .06 },
      { dayOffsetFromStart: 96, fractionOfMaximum: 0 },
    ],
    evidenceNotes:
      "The owner-approved 9/10 broad ceiling is anchored by 5,559 facility captures in 2025, the second-highest on record, plus 3,839 in 2024. DNR reports early-to-mid October movement; processing and egg-take dates are treated as biased observations, not first-entry dates.",
    sourceNotes:
      "Wisconsin DNR Root River 2023-2025 fall summaries, 2024-2025 facility report, regional Coho biology, current regulations, and owner-approved portfolio calibration.",
  }),
  activity: buildWeatherOnlyActivity({
    version: "root-fall-coho-weather-activity-v3-gauge-clarity-release",
    profile: "coho_fall_reaction",
    reachIds: [
      "root_harbor_downtown",
      "root_city_parks",
      "root_lincoln_park",
    ],
    weatherPointId: "root_horlick_weather",
    inputNotes:
      "Horlick hydraulics and 60th Street water temperature remain available to their accepted non-Activity surfaces but are excluded from Activity because both are upstream of the product corridor, are not co-located, and are separated from the corridor by the operated facility and additional reach. Modeled Horlick weather is the only Activity scoring source.",
    scopeCopy:
      "A live water-temperature gauge exists at 60th Street, but it is upstream of Horlick Dam and does not represent the supported corridor below the Steelhead Facility, so Activity excludes it. This Limited read uses modeled weather near Horlick and does not measure river level, clarity, or water temperature in the supported reaches.",
    stageResponseAdjustment: {
      pre_run: -5,
      beginning: -5,
      building: 0,
      peak: 0,
      tapering: 0,
      ending: 0,
      post_run: 0,
    },
    lifecycle: {
      peakEnd: "10-25",
      taperingEnd: "11-10",
      endingEnd: "11-30",
    },
    evidenceNotes:
      "Hidden Coho response candidate for a fish already present in the Root product corridor. It scores effective light and restrained same-block precipitation only, with conservative weather-only ceilings and a continuous terminal lifecycle decline. It cannot infer temperature, river response, passage, movement, abundance, catch probability, access, or safety.",
  }),
  researchNotes:
    "Hidden Gate 4B broad Coho candidate. Its stronger ceiling and calendar are independent of Chinook, while post-spawn copy remains terminal and species-correct; Activity remains explicitly Limited and weather-only.",
  sourceNotes: "docs/onboarding/river-run/root/runs/fall-coho.md",
};

export const ROOT_FALL_STEELHEAD_RUN_PROFILE: AuditedRiverRunProfile = {
  ...sharedRunFields,
  runId: "root_fall_steelhead",
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
    peak: "10-10",
    peakEnd: "10-31",
    taperingEnd: "11-30",
    end: "12-31",
    lateEnd: "01-15",
    postRunLateCopyEnd: "01-31",
  },
  historicalPresence: presence({
    maximum: 7,
    version: "root-steelhead-fall-presence-v2-local-peak-release",
    anchors: [
      { dayOffsetFromStart: 0, fractionOfMaximum: .12 },
      { dayOffsetFromStart: 15, fractionOfMaximum: .35 },
      { dayOffsetFromStart: 24, fractionOfMaximum: .65 },
      { dayOffsetFromStart: 39, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 60, fractionOfMaximum: .9 },
      { dayOffsetFromStart: 90, fractionOfMaximum: .75 },
      { dayOffsetFromStart: 121, fractionOfMaximum: .62 },
    ],
    evidenceNotes:
      "Owner/local 7/10 broad fall-opportunity calibration with an exact Oct. 10 peak anchor supplied by a Wisconsin angler. DNR confirms recurring Steelhead and explicitly warns that fall facility totals are an operational subset, not the overall run. The surrounding stage and presence shoulders are conservative interpolations around the field anchor and remain separate from winter holding and spring spawning.",
    sourceNotes:
      "Wisconsin DNR Root River 2019-2025 facility reports, Steelhead strain guide, 2024 stocking summary, current regulations, and owner-relayed Wisconsin local calibration.",
  }),
  activity: buildWeatherOnlyActivity({
    version:
      "root-fall-steelhead-weather-activity-v3-gauge-clarity-local-calendar-release",
    profile: "steelhead_feeding",
    reachIds: [
      "root_harbor_downtown",
      "root_city_parks",
      "root_lincoln_park",
    ],
    weatherPointId: "root_horlick_weather",
    inputNotes:
      "Horlick hydraulics and 60th Street water temperature remain available to their accepted non-Activity surfaces but are excluded from Activity because both are upstream of the product corridor, are not co-located, and are separated from the corridor by the operated facility and additional reach. Modeled Horlick weather is the only Activity scoring source.",
    scopeCopy:
      "A live water-temperature gauge exists at 60th Street, but it is upstream of Horlick Dam and does not represent the supported corridor below the Steelhead Facility, so Activity excludes it. This Limited read uses modeled weather near Horlick and does not measure river level, clarity, or water temperature in the supported reaches.",
    evidenceNotes:
      "Hidden Steelhead response candidate for a living fish already present in the Root product corridor. It scores effective light and restrained same-block precipitation, applies the 0.80 Limited-evidence scale, and has no salmon mortality ramp, taper penalty, or ending cap. It cannot infer temperature-led feeding, river response, passage, movement, abundance, catch probability, access, or safety.",
  }),
  researchNotes:
    "Hidden Gate 4B fall-entry candidate. Completion ends only this seasonal estimate; living Steelhead can overwinter, later spawn, or return lakeward. Activity has no salmon lifecycle penalty and remains explicitly Limited and weather-only.",
  sourceNotes: "docs/onboarding/river-run/root/runs/fall-steelhead.md",
};

export const ROOT_FALL_BROWN_TROUT_RUN_PROFILE: AuditedRiverRunProfile = {
  ...sharedRunFields,
  runId: "root_fall_brown_trout",
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
    peak: "11-30",
    peakEnd: "12-15",
    taperingEnd: "12-25",
    end: "01-15",
    lateEnd: "01-31",
    postRunLateCopyEnd: "02-15",
  },
  historicalPresence: presence({
    maximum: 7,
    version: "root-lake-run-brown-presence-v1-release",
    anchors: [
      { dayOffsetFromStart: 0, fractionOfMaximum: .06 },
      { dayOffsetFromStart: 14, fractionOfMaximum: .18 },
      { dayOffsetFromStart: 31, fractionOfMaximum: .5 },
      { dayOffsetFromStart: 45, fractionOfMaximum: .78 },
      { dayOffsetFromStart: 60, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 75, fractionOfMaximum: .9 },
      { dayOffsetFromStart: 85, fractionOfMaximum: .72 },
      { dayOffsetFromStart: 106, fractionOfMaximum: .25 },
    ],
    evidenceNotes:
      "The owner-approved 7/10 broad ceiling combines a current 305-adult brood-source sample, recurring stocking, and DNR's warning that the facility normally closes before most Browns arrive. Entry builds after salmon; November-mid-December is strongest. Survivors may hold or return lakeward.",
    sourceNotes:
      "Wisconsin DNR 2025 GLFC report, 2023-2025 Root facility reports, 2024 stocking summary, Brown Trout life history, trout/salmon Q&A, and owner-approved portfolio calibration.",
  }),
  activity: buildWeatherOnlyActivity({
    version: "root-fall-brown-trout-weather-activity-v2-gauge-clarity-release",
    profile: "brown_trout_fall_reaction",
    reachIds: [
      "root_harbor_downtown",
      "root_city_parks",
      "root_lincoln_park",
    ],
    weatherPointId: "root_horlick_weather",
    inputNotes:
      "Horlick hydraulics and 60th Street water temperature remain available to their accepted non-Activity surfaces but are excluded from Activity because both are upstream of the product corridor, are not co-located, and are separated from the corridor by the operated facility and additional reach. Modeled Horlick weather is the only Activity scoring source.",
    scopeCopy:
      "A live water-temperature gauge exists at 60th Street, but it is upstream of Horlick Dam and does not represent the supported corridor below the Steelhead Facility, so Activity excludes it. This Limited read uses modeled weather near Horlick and does not measure river level, clarity, or water temperature in the supported reaches.",
    stageResponseAdjustment: {
      pre_run: 0,
      beginning: 0,
      building: 0,
      peak: 5,
      tapering: 0,
      ending: 0,
      post_run: 0,
    },
    evidenceNotes:
      "Hidden lake-run Brown Trout response candidate for a living repeat spawner already present in the Root product corridor. It scores effective light and restrained same-block precipitation, applies the 0.80 Limited-evidence scale, and uses only a five-point Peak response nudge capped at 80 to preserve lifecycle shape. It has no salmon mortality ramp, taper penalty, ending cap, or assumed post-spawn departure. It cannot infer temperature-led feeding, river response, passage, movement, abundance, catch probability, access, or safety.",
  }),
  researchNotes:
    "Hidden Gate 4B repeat-spawner candidate. No salmon death curve, universal winter holding, or universal lakeward-return claim is permitted; Activity remains explicitly Limited and weather-only.",
  sourceNotes: "docs/onboarding/river-run/root/runs/fall-brown-trout.md",
};

export const ROOT_CONFIGURATION_DOCUMENT: RiverRunConfigurationDocument = {
  schemaVersion: "river-run-config-v1",
  configVersion: "2026-08-30-root-four-species-release.7",
  movementEngineVersion: [
    getMovementEngineDefinition("fall_cooling").version,
    getMovementEngineDefinition("fall_entry_cooling").version,
    getMovementEngineDefinition("fall_repeat_spawner_cooling").version,
  ].join("+"),
  river: ROOT_RIVER_PROFILE,
  biologyProfiles: [
    GREAT_LAKES_CHINOOK_BIOLOGY_PROFILE,
    GREAT_LAKES_COHO_BIOLOGY_PROFILE,
    GREAT_LAKES_STEELHEAD_FALL_ENTRY_BIOLOGY_PROFILE,
    GREAT_LAKES_LAKE_RUN_BROWN_TROUT_BIOLOGY_PROFILE,
  ],
  runs: [
    ROOT_FALL_CHINOOK_RUN_PROFILE,
    ROOT_FALL_COHO_RUN_PROFILE,
    ROOT_FALL_STEELHEAD_RUN_PROFILE,
    ROOT_FALL_BROWN_TROUT_RUN_PROFILE,
  ],
};
