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
import { BOIS_BRULE_HISTORICAL_WATER_TEMPERATURE_NORMALS } from "./boisBruleHistoricalTemperature.generated.ts";
import { buildWeatherOnlyActivity } from "./weatherOnlyActivity.ts";

export const BOIS_BRULE_RIVER_PROFILE: RiverProfile = {
  riverId: "bois_brule",
  displayName: "Bois Brule River",
  state: "WI",
  region: "great_lakes",
  timezone: "America/Chicago",
  mouthLat: 46.754,
  mouthLon: -91.607,
  hydraulicSources: [{
    sourceId: "bois_brule_brule_usgs",
    provider: "USGS",
    siteId: "04025500",
    name: "Bois Brule River at Brule — upstream of Highway 2",
    role: "primary",
    primaryMetric: "flow_cfs",
    availableMetrics: ["flow_cfs", "gage_height_ft"],
    historyYearsAvailable: 81,
    maxAgeHours: 2,
    reachQuality: "acceptable",
    reachNotes:
      "Measured upstream of Highway 2 and outside the fall product corridor. It is incoming spring-fed mainstem context, not a mouth, rapids, fishway, refuge, or lower-river measurement; winter ice can affect the reading.",
  }],
  waterTemperatureSources: [],
  historicalWaterTemperatureSource: {
    sourceId: "bois_brule_lower_historical_temperature",
    provider: "USGS",
    siteId: "04026005",
    name:
      "Bois Brule River near Lake Superior — discontinued historical sensor",
    historicalStartYear: 2021,
    historicalEndYear: 2023,
    baselineVersion:
      "bois-brule-lower-approved-exact-date-temperature-2021-2023-v1",
    reachNotes:
      "Historical-only lower-river context from the discontinued station. It is never a current temperature, trend, current-versus-average comparison, or substitute for conditions at the mouth, refuges, fishway, or Highway 2.",
    attribution:
      "U.S. Geological Survey approved 15-minute archive; one daily mean requires at least 72 valid observations and each displayed exact-date average requires at least two qualifying years.",
    normals: BOIS_BRULE_HISTORICAL_WATER_TEMPERATURE_NORMALS,
  },
  fishCountSources: [{
    sourceId: "bois_brule_wdnr_fall_fishway",
    provider: "WISCONSIN_DNR_BRULE",
    facilityName: "Bois Brule Sea Lamprey Barrier Fishway",
    observationType: "weir_passage",
    eligibleSpecies: [
      "chinook_salmon",
      "coho_salmon",
      "steelhead",
      "lake_run_brown_trout",
    ],
    sourceUrl:
      "https://dnr.wisconsin.gov/topic/Fishing/lakesuperior/boisbrulefishing",
    updateCadence: "seasonal",
    maximumAgeHours: 240,
    preliminary: false,
    operatingSeason:
      "Fall video-monitoring period, generally July-November; Wisconsin DNR currently publishes a finalized seasonal update",
    representedReach:
      "Fishway at the sea lamprey barrier roughly six river miles upstream of Lake Superior",
    limitation:
      "The finalized fishway count omits fish that remain or are harvested below the barrier and is not a live whole-river abundance estimate. Publication can occur after the monitored season.",
    recapturePolicy:
      "Use the newest official fall report's species summary totals once; never add weekly phenology bars to the reported totals.",
    attribution:
      "Wisconsin Department of Natural Resources Bois Brule River Fall Fishway Update",
  }],
  weatherPoints: [{
    weatherPointId: "bois_brule_hwy2_weather",
    lat: 46.5377778,
    lon: -91.5952778,
    role: "primary",
  }],
  foundation: {
    version: "bois-brule-foundation-v3-release",
    corridorLengthMiles: 18,
    downstreamTerminus: "Lake Superior mouth",
    upstreamTerminus:
      "Downstream side of the U.S. Highway 2 bridge for all four supported fall runs",
    targetSpecies: [
      "chinook_salmon",
      "coho_salmon",
      "steelhead",
      "lake_run_brown_trout",
    ],
    reaches: [
      {
        reachId: "bois_brule_mouth_lower",
        displayName:
          "Mouth & Lower River — Lake Superior to the Fishway Refuge",
        order: 1,
        role: "downstream",
        gaugeRepresented: false,
        notes:
          "Lake entry and lower holding corridor. Guidance stops outside the signed 500-foot refuge below the sea-lamprey barrier.",
        sourceNotes:
          "Wisconsin DNR Brule fishing page, State Forest refuge rules, and owner-approved section decision.",
      },
      {
        reachId: "bois_brule_rapids",
        displayName: "Rapids Reach — Fishway Refuge to County Highway FF",
        order: 2,
        role: "middle",
        gaugeRepresented: false,
        notes:
          "The fishway passes trout and salmon, but the permanent 500-foot refuge and seasonal Box Car and Mays Ledges refuges are excluded from fishing guidance.",
        sourceNotes:
          "Wisconsin DNR fishway page, 2025 fishway update, State Forest refuge rules, and lower-river creel map.",
      },
      {
        reachId: "bois_brule_upper_lower",
        displayName: "Upper Lower River — County Highway FF to Highway 2",
        order: 3,
        role: "terminal",
        gaugeRepresented: false,
        notes:
          "The fall product corridor ends on the downstream side of Highway 2 for regulatory scope, not because Highway 2 is a biological barrier.",
        sourceNotes:
          "Wisconsin DNR current Brule seasons and owner-approved conservative fall endpoint.",
      },
    ],
    primaryGaugeReachId: null,
    contextualGaugeSiteIds: ["04025500", "04026005"],
    weatherStrategy: {
      mode: "single_point",
      primaryWeatherPointId: "bois_brule_hwy2_weather",
      basinRepresentation:
        "Modeled weather near Highway 2 is context only. It does not measure lower-river rainfall, water temperature, clarity, hydraulic response, or fish movement.",
      sourceNotes:
        "Production-shaped Open-Meteo probe at the active USGS station coordinates, 2026-08-26.",
    },
    stateRegulations: [{
      state: "WI",
      version: "wisconsin-2026-2027-fishing-regulations",
      jurisdiction:
        "Wisconsin DNR Bois Brule River and Brule River State Forest regulations",
      reminderCopy:
        "The lower river below Highway 2 is open only from the last Saturday in March through Nov. 15 and has a night-fishing closure. Box Car Hole is closed July 15-Oct. 31, Mays Ledges is closed Sept. 1-May 31, and the signed 500-foot refuge on both sides of the sea-lamprey barrier is never open. Check current rules and every posted refuge sign.",
      accessAndSafetyNotes:
        "Section labels are orientation ranges, not promises of legal access, safe wading or boating, or equal fish distribution. State Forest parking is day use only.",
      sourceNotes:
        "Wisconsin DNR current Brule fishing page, State Forest refuge page, and 2026-2027 regulations; recheck at release.",
    }],
    evidenceNotes:
      "Owner-approved Douglas County/Lake Superior identity, three-section mouth-to-Highway-2 corridor, refuge exclusions, partial upstream Gauge Read, and four-species 2/8/9/7 portfolio. Fishway totals prove recurrence and passage, not catch rates or uniform distribution.",
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
      "Gauge Read refreshes upstream flow and height independently. Historical lower-river temperature is an exact-date static baseline, never a refreshed current reading. Invalid or stale hydraulics fail closed and later valid observations recover automatically.",
  },
  conditionDataCapabilities: {
    hydraulics: { status: "available" },
    waterTemperature: {
      status: "unavailable",
      notes:
        "No current representative measured-water-temperature source exists. The discontinued lower-river archive supplies historical exact-date context only.",
    },
  },
  supportStatus: "beta",
  gaugeLimitationCopy:
    "Flow and height are measured upstream of Highway 2, outside the fall corridor. Current measured water temperature is unavailable. Where coverage qualifies, the temperature line shows only an exact-date 2021-2023 historical average from the discontinued lower-river sensor—not today's temperature, a trend, fish passage, or conditions at every lower-river section.",
  regulationReminderCopy:
    "The lower river closes after Nov. 15 and has a night-fishing restriction. Box Car, Mays Ledges, and the permanent 500-foot fishway refuge have separate closures. Verify current Wisconsin rules and posted refuge signs before fishing.",
};

const primitiveCapabilities: AuditedRiverRunProfile["primitiveCapabilities"] = {
  migrationStage: { status: "available" },
  activity: { status: "available" },
  fishInRiver: { status: "available" },
  fishability: {
    status: "unavailable",
    reason: "no_accepted_hydraulic_source",
    notes:
      "The active hydraulic station is above Highway 2 and does not support lower-corridor presentation bands.",
  },
  migrationTiming: {
    status: "unavailable",
    reason: "no_accepted_historical_baseline",
    notes:
      "Historical exact-date temperature context is not a live run-progress model, and no paired lower-corridor baseline supports early, typical, or delayed claims.",
  },
  push: {
    status: "unavailable",
    reason: "no_accepted_hydraulic_or_water_temperature_source",
    notes:
      "No current same-reach lower-corridor hydraulic and measured-temperature pair can confirm movement.",
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
    anchors: input.anchors,
    evidenceNotes: input.evidenceNotes,
    sourceNotes: input.sourceNotes,
  };
}

const sharedRunFields = {
  riverId: "bois_brule",
  season: "fall" as const,
  runStageCopyStrategy: "onboarding_corridor" as const,
  primitiveCapabilities,
  publicAudit: {
    isEnabled: true,
    auditVersion: "bois-brule-four-species-release-audit-v1",
    notes:
      "Owner accepted all four Bois Brule fall profiles for public catalog promotion on 2026-08-29. Production deployment remains a separate explicit release action.",
  },
};

export const BOIS_BRULE_FALL_CHINOOK_RUN_PROFILE: AuditedRiverRunProfile = {
  ...sharedRunFields,
  runId: "bois_brule_fall_chinook",
  biologyProfileId: "great_lakes_chinook_v1",
  displayName: "Fall Chinook",
  species: "chinook_salmon",
  runType: "fall_spawn",
  movementEngineId: "fall_cooling",
  runWindow: {
    preRunStart: "06-15",
    stagingStart: "06-25",
    start: "07-01",
    beginningEnd: "07-20",
    buildingEstablishedStart: "07-21",
    buildingBroadStart: "08-10",
    peakStart: "08-15",
    peak: "09-05",
    peakEnd: "09-30",
    taperingEnd: "10-10",
    end: "10-15",
    lateEnd: "10-20",
    postRunLateCopyEnd: "10-31",
  },
  historicalPresence: presence({
    maximum: 2,
    distributionScope: "sectional",
    version: "bois-brule-chinook-presence-v1-release",
    anchors: [
      { dayOffsetFromStart: 0, fractionOfMaximum: .08 },
      { dayOffsetFromStart: 19, fractionOfMaximum: .2 },
      { dayOffsetFromStart: 40, fractionOfMaximum: .5 },
      { dayOffsetFromStart: 66, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 91, fractionOfMaximum: .75 },
      { dayOffsetFromStart: 101, fractionOfMaximum: .4 },
      { dayOffsetFromStart: 106, fractionOfMaximum: .2 },
      { dayOffsetFromStart: 111, fractionOfMaximum: .05 },
      { dayOffsetFromStart: 121, fractionOfMaximum: 0 },
    ],
    evidenceNotes:
      "Owner-conservative 2/10 sectional calibration. Wisconsin DNR calls this a smaller run, sets early-July to mid-October timing with a mid-August to late-September peak, and counted 612 fishway passages in 2025. Fishway passage is not uniform river distribution.",
    sourceNotes:
      "Wisconsin DNR current Brule fishing page, 2023-2025 fishway updates, 2026-2027 regulations, and owner-approved cohort portfolio.",
  }),
  activity: buildWeatherOnlyActivity({
    version: "bois-brule-fall-chinook-weather-activity-v2-release",
    profile: "chinook_fall_reaction",
    reachIds: [
      "bois_brule_mouth_lower",
      "bois_brule_rapids",
      "bois_brule_upper_lower",
    ],
    weatherPointId: "bois_brule_hwy2_weather",
    inputNotes:
      "USGS 04025500 hydraulics are upstream of the product corridor and the discontinued 04026005 temperature archive is historical-only; neither enters Activity. Modeled weather near Highway 2 is the only scoring source.",
    scopeCopy:
      "This Limited weather-only read uses modeled weather near Highway 2 as broad context for legal sections from the Lake Superior mouth through the lower corridor; it does not measure river level, clarity, or water temperature in those reaches.",
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
      peakEnd: "09-30",
      taperingEnd: "10-10",
      endingEnd: "10-31",
    },
    evidenceNotes:
      "Hidden Chinook response candidate for a fish already present. It scores effective light and restrained same-block precipitation only, preserves the small sectional run in Stage/Fish In River rather than Activity, and cannot infer temperature, river response, passage, movement, abundance, catch probability, access, or safety.",
  }),
  researchNotes:
    "Hidden Gate 4A sectional Chinook candidate. Seasonal and refuge restrictions precede every section plan; terminal copy remains semelparous and species-correct.",
  sourceNotes: "docs/onboarding/river-run/bois_brule/runs/fall-chinook.md",
};

export const BOIS_BRULE_FALL_COHO_RUN_PROFILE: AuditedRiverRunProfile = {
  ...sharedRunFields,
  runId: "bois_brule_fall_coho",
  biologyProfileId: "great_lakes_coho_v1",
  displayName: "Fall Coho",
  species: "coho_salmon",
  runType: "fall_spawn",
  movementEngineId: "fall_cooling",
  runWindow: {
    preRunStart: "08-01",
    stagingStart: "08-15",
    start: "08-25",
    beginningEnd: "09-05",
    buildingEstablishedStart: "09-06",
    buildingBroadStart: "09-10",
    peakStart: "09-15",
    peak: "09-28",
    peakEnd: "10-15",
    taperingEnd: "10-31",
    end: "11-15",
    lateEnd: "11-25",
    postRunLateCopyEnd: "11-30",
  },
  historicalPresence: presence({
    maximum: 8,
    distributionScope: "broad",
    version: "bois-brule-coho-presence-v1-release",
    anchors: [
      { dayOffsetFromStart: 0, fractionOfMaximum: .08 },
      { dayOffsetFromStart: 11, fractionOfMaximum: .3 },
      { dayOffsetFromStart: 21, fractionOfMaximum: .62 },
      { dayOffsetFromStart: 34, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 51, fractionOfMaximum: .9 },
      { dayOffsetFromStart: 67, fractionOfMaximum: .6 },
      { dayOffsetFromStart: 82, fractionOfMaximum: .25 },
      { dayOffsetFromStart: 92, fractionOfMaximum: .08 },
      { dayOffsetFromStart: 97, fractionOfMaximum: 0 },
    ],
    evidenceNotes:
      "Approved 8/10 broad calibration. DNR sets late-August to late-November movement and a September-weighted peak; 2023 peaked in week 39, 2024 in the last week of September, and 2025 highest counts extended from late September through mid-October.",
    sourceNotes:
      "Wisconsin DNR current Brule fishing page, 2023-2025 fishway updates, 2026-2027 regulations, and owner-approved cohort portfolio.",
  }),
  activity: buildWeatherOnlyActivity({
    version: "bois-brule-fall-coho-weather-activity-v2-release",
    profile: "coho_fall_reaction",
    reachIds: [
      "bois_brule_mouth_lower",
      "bois_brule_rapids",
      "bois_brule_upper_lower",
    ],
    weatherPointId: "bois_brule_hwy2_weather",
    inputNotes:
      "USGS 04025500 hydraulics are outside the lower product corridor and 04026005 supplies historical exact-date temperature only. Both are excluded; modeled Highway 2 weather is the sole Activity input.",
    scopeCopy:
      "This Limited weather-only read uses modeled weather near Highway 2 as broad context for legal lower-river sections; it does not measure river level, clarity, or water temperature across the corridor.",
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
      peakEnd: "10-15",
      taperingEnd: "10-31",
      endingEnd: "11-25",
    },
    evidenceNotes:
      "Hidden Coho response candidate for a fish already present. It scores effective light and restrained same-block precipitation only with conservative weather-only ceilings and continuous terminal lifecycle decline; it cannot infer fresh entry, abundance, passage, catch probability, access, or safety.",
  }),
  researchNotes:
    "Hidden Gate 4A broad Coho candidate. The curve preserves a current late-September anchor and mid-October shoulder while the lower-river season closes Nov. 15.",
  sourceNotes: "docs/onboarding/river-run/bois_brule/runs/fall-coho.md",
};

export const BOIS_BRULE_FALL_STEELHEAD_RUN_PROFILE: AuditedRiverRunProfile = {
  ...sharedRunFields,
  runId: "bois_brule_fall_steelhead",
  biologyProfileId: "great_lakes_steelhead_fall_entry_v1",
  displayName: "Fall Steelhead",
  species: "steelhead",
  runType: "fall_entry",
  movementEngineId: "fall_entry_cooling",
  runWindow: {
    preRunStart: "07-15",
    stagingStart: "08-01",
    start: "08-15",
    beginningEnd: "08-31",
    buildingEstablishedStart: "09-01",
    buildingBroadStart: "09-15",
    peakStart: "09-20",
    peak: "09-28",
    peakEnd: "10-20",
    taperingEnd: "11-10",
    end: "11-30",
    lateEnd: "12-15",
    postRunLateCopyEnd: "12-31",
  },
  historicalPresence: presence({
    maximum: 9,
    distributionScope: "broad",
    version: "bois-brule-steelhead-fall-presence-v2-local-peak-release",
    anchors: [
      { dayOffsetFromStart: 0, fractionOfMaximum: .15 },
      { dayOffsetFromStart: 17, fractionOfMaximum: .35 },
      { dayOffsetFromStart: 31, fractionOfMaximum: .65 },
      { dayOffsetFromStart: 44, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 66, fractionOfMaximum: .9 },
      { dayOffsetFromStart: 87, fractionOfMaximum: .78 },
      { dayOffsetFromStart: 107, fractionOfMaximum: .68 },
    ],
    evidenceNotes:
      "Approved 9/10 broad fall-opportunity calibration with an exact Sept. 28 peak anchor supplied by a Wisconsin angler. DNR reports 3,989-5,750 fishway passages in 2022-2025 and extensive movement from mid-September through late October; the surrounding shoulders conservatively preserve that measured window.",
    sourceNotes:
      "Wisconsin DNR current Brule fishing page, Lake Superior tributary FAQ, 2022-2025 fishway updates, current regulations, and owner-approved cohort portfolio.",
  }),
  activity: buildWeatherOnlyActivity({
    version:
      "bois-brule-fall-steelhead-weather-activity-v2-local-calendar-draft",
    profile: "steelhead_feeding",
    reachIds: [
      "bois_brule_mouth_lower",
      "bois_brule_rapids",
      "bois_brule_upper_lower",
    ],
    weatherPointId: "bois_brule_hwy2_weather",
    inputNotes:
      "The upstream live gauge and lower-river historical-only temperature archive cannot form a current same-reach Activity model. Both are excluded; modeled Highway 2 weather is the only scoring source.",
    scopeCopy:
      "This Limited weather-only read uses modeled weather near Highway 2 as broad context for legal lower-river sections; it does not measure river level, clarity, water temperature, or fall-entry response.",
    evidenceNotes:
      "Hidden fall-Steelhead response candidate for a fish already present. It scores effective light and restrained same-block precipitation only, applies no salmon lifecycle decline or departure assumption, and cannot infer movement, overwintering, abundance, passage, catch probability, access, or safety.",
  }),
  researchNotes:
    "Hidden Gate 4A fall-entry candidate. The lower fishing season closes Nov. 15 even though entry continues later; surviving Steelhead may overwinter and appear in the separate spring run.",
  sourceNotes: "docs/onboarding/river-run/bois_brule/runs/fall-steelhead.md",
};

export const BOIS_BRULE_FALL_BROWN_TROUT_RUN_PROFILE: AuditedRiverRunProfile = {
  ...sharedRunFields,
  runId: "bois_brule_fall_brown_trout",
  biologyProfileId: "great_lakes_lake_run_brown_trout_v1",
  displayName: "Fall Lake-run Brown Trout",
  species: "lake_run_brown_trout",
  runType: "fall_repeat_spawn",
  movementEngineId: "fall_repeat_spawner_cooling",
  runWindow: {
    preRunStart: "06-15",
    stagingStart: "06-25",
    start: "07-01",
    beginningEnd: "07-10",
    buildingEstablishedStart: "07-11",
    buildingBroadStart: "07-13",
    peakStart: "07-15",
    peak: "08-15",
    peakEnd: "09-15",
    taperingEnd: "10-01",
    end: "10-20",
    lateEnd: "10-31",
    postRunLateCopyEnd: "11-15",
  },
  historicalPresence: presence({
    maximum: 7,
    distributionScope: "broad",
    version: "bois-brule-lake-run-brown-presence-v1-release",
    anchors: [
      { dayOffsetFromStart: 0, fractionOfMaximum: .18 },
      { dayOffsetFromStart: 14, fractionOfMaximum: .65 },
      { dayOffsetFromStart: 45, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 76, fractionOfMaximum: .9 },
      { dayOffsetFromStart: 92, fractionOfMaximum: .55 },
      { dayOffsetFromStart: 111, fractionOfMaximum: .25 },
      { dayOffsetFromStart: 122, fractionOfMaximum: .08 },
    ],
    evidenceNotes:
      "Owner-conservative 7/10 broad calibration against the cohort's strongest direct Brown Trout evidence: 2,694-3,436 fishway passages in 2021-2025 and 3,143 in 2025. DNR independently sets early-July to late-October entry and a mid-July to mid-September peak.",
    sourceNotes:
      "Wisconsin DNR current Brule fishing page, 2021-2025 fishway updates, Lake Superior tributary FAQ, current regulations, and owner-approved cohort portfolio.",
  }),
  activity: buildWeatherOnlyActivity({
    version: "bois-brule-fall-brown-trout-weather-activity-v1-release",
    profile: "brown_trout_fall_reaction",
    reachIds: [
      "bois_brule_mouth_lower",
      "bois_brule_rapids",
      "bois_brule_upper_lower",
    ],
    weatherPointId: "bois_brule_hwy2_weather",
    inputNotes:
      "The discontinued lower-river temperature archive supplies seasonal historical context, not today's water temperature, and the live gauge is upstream of Highway 2. Neither enters Activity; modeled Highway 2 weather is the only scoring source.",
    scopeCopy:
      "This Limited weather-only read uses modeled weather near Highway 2 as broad context for legal lower-river sections; it does not measure river level, clarity, water temperature, spawning condition, or winter location.",
    stageResponseAdjustment: {
      pre_run: 0,
      beginning: 0,
      building: 0,
      peak: 6,
      tapering: 0,
      ending: 0,
      post_run: 0,
    },
    evidenceNotes:
      "Hidden lake-run Brown Trout response candidate for a fish already present. It scores effective light and restrained same-block precipitation only, applies the 0.80 Limited-evidence scale, and uses a bounded six-point Peak response correction capped at 80 to prevent seasonal light from making later non-peak stages look biologically stronger. It applies no salmon mortality or forced-departure logic and cannot infer movement, abundance, passage, catch probability, access, or safety.",
  }),
  researchNotes:
    "Hidden Gate 4A Lake Superior repeat-spawner candidate. It uses the early Brule calendar, not the late Lake Michigan Seeforellen calendar, and never assumes salmon mortality or universal winter holding.",
  sourceNotes: "docs/onboarding/river-run/bois_brule/runs/fall-brown-trout.md",
};

export const BOIS_BRULE_CONFIGURATION_DOCUMENT: RiverRunConfigurationDocument =
  {
    schemaVersion: "river-run-config-v1",
    configVersion: "2026-08-31-bois-brule-fish-counts.7",
    movementEngineVersion: [
      getMovementEngineDefinition("fall_cooling").version,
      getMovementEngineDefinition("fall_entry_cooling").version,
      getMovementEngineDefinition("fall_repeat_spawner_cooling").version,
    ].join("+"),
    river: BOIS_BRULE_RIVER_PROFILE,
    biologyProfiles: [
      GREAT_LAKES_CHINOOK_BIOLOGY_PROFILE,
      GREAT_LAKES_COHO_BIOLOGY_PROFILE,
      GREAT_LAKES_STEELHEAD_FALL_ENTRY_BIOLOGY_PROFILE,
      GREAT_LAKES_LAKE_RUN_BROWN_TROUT_BIOLOGY_PROFILE,
    ],
    runs: [
      BOIS_BRULE_FALL_CHINOOK_RUN_PROFILE,
      BOIS_BRULE_FALL_COHO_RUN_PROFILE,
      BOIS_BRULE_FALL_STEELHEAD_RUN_PROFILE,
      BOIS_BRULE_FALL_BROWN_TROUT_RUN_PROFILE,
    ],
  };
