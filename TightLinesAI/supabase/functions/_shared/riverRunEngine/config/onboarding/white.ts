import type {
  AuditedRiverRunProfile,
  FishabilityBands,
  RiverProfile,
  RiverRunConfigurationDocument,
} from "../../types.ts";
import { getMovementEngineDefinition } from "../movementEngines.ts";
import {
  GREAT_LAKES_CHINOOK_BIOLOGY_PROFILE,
  GREAT_LAKES_STEELHEAD_FALL_ENTRY_BIOLOGY_PROFILE,
} from "../speciesBiology.ts";

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
      "Measured about 0.25 mile below Hesperia Dam. It represents the immediate upper tailwater only and is never blended with Fruitvale hydraulics for Activity.",
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
    targetSpecies: ["chinook_salmon", "steelhead"],
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
        "Modeled Pines Point weather is context only while Activity is unavailable; it does not reconcile the split measurement reaches.",
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
      "Owner-approved foundation dated 2026-08-24. All configured migratory guidance ends below Hesperia Dam. Chinook and Fall Steelhead are supported Phase C candidates; Coho remains planned-catalog disabled this pass.",
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
      "Gauge Read refreshes accepted station metrics independently. No Activity score is produced from the split reaches.",
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
  version: "white-fruitvale-fishability-v1-draft",
  metric: "flow_cfs",
  sourceLabel: "Fruitvale Road",
  tooLow: { max: 220 },
  lowFishable: { min: 220, max: 275 },
  ideal: { min: 275, max: 440 },
  highFishable: { min: 440, max: 710 },
  blownOut: { min: 1020 },
  caps: {
    staleGauge: 55,
    unknownTrend: 49,
    veryLow: 45,
    blownOut: 24,
    sharpRiseHigh: 40,
  },
  evidenceNotes:
    "Draft percentile scaffolding from 10,580 August–December USGS daily means, 1957–2026: p5 218, p25 275, median 341, p75 440, p95 712, and p99 1,020 CFS. These are Fruitvale presentation-shape inputs, not access or safety thresholds, and require replay and local owner review.",
  sourceNotes:
    "USGS 04122200 daily discharge audit recorded in the White Phase C Chinook and Steelhead packets.",
};

const WHITE_BASELINE = {
  metric: "flow_cfs" as const,
  version: "white-fruitvale-1957-2026-draft",
  hasPercentileBaselines: true,
  coveredWindowPercent: 0.999,
  minimumHistoryYears: 10,
  sourceNotes:
    "USGS 04122200 daily discharge has near-complete coverage from 1957; draft Fishability replay uses the species window only.",
};

const WHITE_UNAVAILABLE_ACTIVITY_COPY = {
  headline:
    "Activity is unavailable because flow and water temperature come from different White River reaches.",
  detail:
    "Fruitvale Road flow and water temperature below Hesperia Dam remain useful as separately labeled Gauge Read measurements, but they do not describe one shared reach.",
  tip:
    "Use each Gauge Read only for its named reach; do not infer a combined river response.",
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
  primitiveCapabilities: {
    migrationStage: { status: "available" },
    activity: {
      status: "unavailable",
      reason: "no_accepted_activity_calibration",
      notes:
        "Fruitvale hydraulics and Weaver Street temperature represent different reaches; no cross-reach or weather-only Activity model is accepted.",
      publicCopy: WHITE_UNAVAILABLE_ACTIVITY_COPY,
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
    preRunStart: "08-15",
    stagingStart: "08-20",
    start: "09-10",
    beginningEnd: "09-20",
    buildingEstablishedStart: "09-25",
    buildingBroadStart: "10-01",
    peakStart: "10-08",
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
    curveVersion: "white-chinook-presence-v1-draft",
    evidenceNotes:
      "Draft 7/10 broad below-Hesperia opportunity curve uses direct White River enforcement observations from mid-September through late October 2025 and the current DNR destination-fishery assessment. It is not a fish count.",
    sourceNotes:
      "Michigan DNR Lower White River Status Report 0460, Chinook biology, 2025 conservation-officer reports, and Phase C owner calibrations.",
    anchors: [
      { dayOffsetFromStart: 0, fractionOfMaximum: 0.05 },
      { dayOffsetFromStart: 5, fractionOfMaximum: 0.12 },
      { dayOffsetFromStart: 10, fractionOfMaximum: 0.25 },
      { dayOffsetFromStart: 15, fractionOfMaximum: 0.45 },
      { dayOffsetFromStart: 21, fractionOfMaximum: 0.7 },
      { dayOffsetFromStart: 28, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 35, fractionOfMaximum: 0.95 },
      { dayOffsetFromStart: 42, fractionOfMaximum: 0.8 },
      { dayOffsetFromStart: 51, fractionOfMaximum: 0.55 },
      { dayOffsetFromStart: 61, fractionOfMaximum: 0.25 },
      { dayOffsetFromStart: 66, fractionOfMaximum: 0.05 },
    ],
  },
  fishabilityBands: WHITE_FISHABILITY,
  baselineCoverage: WHITE_BASELINE,
  researchNotes:
    "Hidden White Fall Chinook Phase C candidate. Dates, curve, 7/10 ceiling, and Fruitvale bands require replay, fixtures, local review, device QA, and owner acceptance.",
  sourceNotes:
    "docs/onboarding/river-run/white/runs/fall-chinook.md and its primary-source evidence ledger, completed 2026-08-24.",
  publicAudit: {
    isEnabled: false,
    auditVersion: "white-fall-chinook-phase-c-draft-v1",
    notes: "Hidden until every Phase C acceptance gate passes.",
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
  primitiveCapabilities: {
    ...WHITE_FALL_CHINOOK_RUN_PROFILE.primitiveCapabilities,
    activity: {
      status: "unavailable",
      reason: "no_accepted_activity_calibration",
      notes:
        "Fruitvale hydraulics and Weaver Street temperature represent different reaches; no cross-reach or weather-only Activity model is accepted.",
      publicCopy: WHITE_UNAVAILABLE_ACTIVITY_COPY,
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
  fishabilityBands: WHITE_FISHABILITY,
  baselineCoverage: WHITE_BASELINE,
  researchNotes:
    "Hidden White Fall Steelhead entry candidate. Terminal behavior stops the fall-entry model without claiming fish left or using salmon mortality language.",
  sourceNotes:
    "docs/onboarding/river-run/white/runs/fall-steelhead.md and its primary-source evidence ledger, completed 2026-08-24.",
  publicAudit: {
    isEnabled: false,
    auditVersion: "white-fall-steelhead-phase-c-draft-v1",
    notes: "Hidden until every Phase C acceptance gate passes.",
  },
};

export const WHITE_CONFIGURATION_DOCUMENT: RiverRunConfigurationDocument = {
  schemaVersion: "river-run-config-v1",
  configVersion: "2026-08-24-white-phase-c-draft.1",
  movementEngineVersion: [
    getMovementEngineDefinition("fall_cooling").version,
    getMovementEngineDefinition("fall_entry_cooling").version,
  ].join("+"),
  river: WHITE_RIVER_PROFILE,
  biologyProfiles: [
    GREAT_LAKES_CHINOOK_BIOLOGY_PROFILE,
    GREAT_LAKES_STEELHEAD_FALL_ENTRY_BIOLOGY_PROFILE,
  ],
  runs: [WHITE_FALL_CHINOOK_RUN_PROFILE, WHITE_FALL_STEELHEAD_RUN_PROFILE],
};
