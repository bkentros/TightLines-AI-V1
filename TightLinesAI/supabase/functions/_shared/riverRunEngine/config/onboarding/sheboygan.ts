import type {
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
import { buildWeatherOnlyActivity } from "./weatherOnlyActivity.ts";
import { WISCONSIN_FIXED_FLOW_SEASONAL_NORMALS } from "./wisconsinFixedFlowSeasonal.generated.ts";

export const SHEBOYGAN_RIVER_PROFILE: RiverProfile = {
  riverId: "sheboygan",
  displayName: "Sheboygan River",
  state: "WI",
  region: "great_lakes",
  timezone: "America/Chicago",
  mouthLat: 43.748,
  mouthLon: -87.694,
  hydraulicSources: [{
    sourceId: "sheboygan_i43_usgs",
    provider: "USGS",
    siteId: "04086000",
    name: "Sheboygan River at Sheboygan — near I-43",
    role: "primary",
    primaryMetric: "flow_cfs",
    availableMetrics: ["flow_cfs", "gage_height_ft"],
    historyYearsAvailable: 75,
    maxAgeHours: 2,
    reachQuality: "good",
    reachNotes:
      "Measured 0.2 mile below I-43 and 3.9 miles above the mouth. It directly represents the upper Urban River, gives downstream context for Kohler, and does not directly measure the harbor.",
  }],
  waterTemperatureSources: [],
  fixedFlowSeasonalBaseline: {
    baselineVersion: "sheboygan-i43-recent-date-window-2019-2025-v2",
    historicalStartYear: 2019,
    historicalEndYear: 2025,
    attribution:
      "U.S. Geological Survey approved daily mean discharge, fixed 2019–2025 recent-regime comparison period, with date-relative coverage through Feb. 15 for the complete supported report tail.",
    normals: WISCONSIN_FIXED_FLOW_SEASONAL_NORMALS.sheboygan,
  },
  weatherPoints: [{
    weatherPointId: "sheboygan_i43_weather",
    lat: 43.7413889,
    lon: -87.7521111,
    role: "primary",
  }],
  foundation: {
    version: "sheboygan-foundation-v4-release",
    corridorLengthMiles: 9.9,
    downstreamTerminus: "Sheboygan Harbor mouth at Lake Michigan",
    upstreamTerminus:
      "Downstream face of Waelderhaus Dam in Kohler for all four supported runs",
    targetSpecies: [
      "chinook_salmon",
      "coho_salmon",
      "steelhead",
      "lake_run_brown_trout",
    ],
    reaches: [
      {
        reachId: "sheboygan_harbor_lower_city",
        displayName: "Harbor & Lower City — Lake Michigan to Kiwanis Park",
        order: 1,
        role: "harbor",
        gaugeRepresented: false,
        notes:
          "Lake entry and lower-city corridor. Harbor conditions can differ from the I-43 station, and section naming does not establish universal shoreline access.",
        sourceNotes:
          "Wisconsin DNR Sheboygan River AOC material and fall tributary access guide; owner-approved Gate 2 section decision.",
      },
      {
        reachId: "sheboygan_urban_river",
        displayName: "Urban River — Kiwanis Park to I-43",
        order: 2,
        role: "middle",
        gaugeRepresented: true,
        notes:
          "Kiwanis and Esslingen provide recognizable lower and middle reference points. USGS 04086000 directly measures the upstream edge near I-43.",
        sourceNotes:
          "Wisconsin DNR fall tributary access guide and USGS 04086000 station description.",
      },
      {
        reachId: "sheboygan_kohler",
        displayName: "Kohler Reach — I-43 to Waelderhaus Dam",
        order: 3,
        role: "terminal",
        gaugeRepresented: false,
        notes:
          "The corridor ends below the current first DNR-listed impassable barrier. Kohler shoreline must not be presented as universally public access.",
        sourceNotes:
          "Wisconsin DNR waterbody and VHS barrier records, county dam record, and owner-approved Gate 2 endpoint decision.",
      },
    ],
    primaryGaugeReachId: "sheboygan_urban_river",
    contextualGaugeSiteIds: [],
    weatherStrategy: {
      mode: "single_point",
      primaryWeatherPointId: "sheboygan_i43_weather",
      basinRepresentation:
        "Modeled weather at I-43 is context only; it does not measure river temperature, flow response, clarity, or fish movement.",
      sourceNotes:
        "Production-shaped Open-Meteo probe at the USGS station coordinates, 2026-08-26.",
    },
    stateRegulations: [{
      state: "WI",
      version: "wisconsin-2026-2027-fishing-regulations",
      jurisdiction: "Wisconsin DNR Lake Michigan tributary regulations",
      reminderCopy:
        "From Sept. 15 through the first Saturday in May, fishing in Lake Michigan tributaries is prohibited from one-half hour after sunset to one-half hour before sunrise. Check current Wisconsin regulations, fish-consumption advice, posted signs, property access, and emergency orders.",
      accessAndSafetyNotes:
        "Section labels are orientation ranges, not promises of legal access, safe wading or boating, or equal fish distribution.",
      sourceNotes:
        "Wisconsin DNR 2026-2027 fishing regulations and Lake Michigan tributary fall-fishing guidance; recheck at release.",
    }],
    evidenceNotes:
      "Owner-approved Sheboygan identity, three-section mouth-to-Waelderhaus corridor, night restriction, and four-species 8/8/5/8 portfolio. Current stocking and direct DNR section guidance establish recurring opportunity but are not adult-return counts.",
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
      "Gauge Read resolves flow and height independently at an hourly product cadence. The source has no accepted temperature series and carries an official possible-discontinuation notice for 2026-10-01; stale or failed readings must fail closed and later valid values must recover automatically.",
  },
  conditionDataCapabilities: {
    hydraulics: { status: "available" },
    waterTemperature: {
      status: "unavailable",
      notes:
        "No accepted continuous measured-water-temperature source represents the Sheboygan corridor; air temperature and Lake Michigan observations are not substitutes.",
    },
  },
  supportStatus: "beta",
  gaugeLimitationCopy:
    "Measured near I-43, 3.9 miles above the mouth. This station does not directly represent the harbor or water above Waelderhaus Dam. USGS warns it may be discontinued on Oct. 1, 2026 without replacement funding.",
  regulationReminderCopy:
    "From Sept. 15 through the first Saturday in May, Lake Michigan tributary night-fishing restrictions apply. Verify current Wisconsin rules, fish-consumption advice, posted signs, property access, and emergency orders before fishing.",
};

const SHEBOYGAN_BASELINE = {
  metric: "flow_cfs" as const,
  version: "sheboygan-i43-recent-fall-2019-2025-v1",
  hasPercentileBaselines: true,
  coveredWindowPercent: 1,
  minimumHistoryYears: 7,
  sourceNotes:
    "USGS 04086000 daily mean discharge for the fixed Aug. 1-Jan. 31 windows in 2019-2025. The audit contained 1,256 observations: p10 87, p25 118, median 201, p75 338, p90 674, and p95 875 CFS. The recent interval is used because its distribution differs materially from the longer post-Franklin-removal record.",
};

const SHEBOYGAN_FISHABILITY: FishabilityBands = {
  version: "sheboygan-i43-fishability-v2",
  metric: "flow_cfs",
  sourceLabel: "Urban River near I-43",
  tooLow: { max: 87 },
  lowFishable: { min: 87, max: 118 },
  ideal: { min: 118, max: 338 },
  highFishable: { min: 338, max: 674 },
  blownOut: { min: 875 },
  caps: {
    staleGauge: 55,
    unknownTrend: 49,
    veryLow: 45,
    blownOut: 24,
    sharpRiseHigh: 40,
  },
  evidenceNotes:
    "Accepted recent-season percentile bands describe presentation shape only near the I-43 station. The p90-p95 interval is intentionally very high rather than being folded into ordinary high-fishable water. They do not estimate fish abundance, clarity, access, wading or boating safety, harbor conditions, or the ungauged Kohler reach.",
  sourceNotes:
    "USGS 04086000 daily mean discharge audit for Aug. 1-Jan. 31 in 2019-2025, rechecked 2026-08-27. Boundaries use p10/p25/p75/p90/p95 so exceptional high water cannot receive the same grade as an ordinary high-fishable presentation.",
};

const primitiveCapabilities: AuditedRiverRunProfile["primitiveCapabilities"] = {
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
      "No measured water-temperature baseline supports a Sheboygan Migration Timing model.",
  },
  push: {
    status: "unavailable",
    reason: "no_accepted_historical_baseline",
    notes:
      "Flow alone cannot be presented as confirmed fish movement, and no measured river temperature is accepted.",
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
  riverId: "sheboygan",
  season: "fall" as const,
  runStageCopyStrategy: "onboarding_corridor" as const,
  primitiveCapabilities,
  fishabilityBands: SHEBOYGAN_FISHABILITY,
  baselineCoverage: SHEBOYGAN_BASELINE,
  publicAudit: {
    isEnabled: true,
    auditVersion: "sheboygan-four-species-release-audit-v1",
    notes:
      "Owner accepted all four Sheboygan fall profiles for public catalog promotion on 2026-08-29. Production deployment remains a separate explicit release action.",
  },
};

export const SHEBOYGAN_FALL_CHINOOK_RUN_PROFILE: AuditedRiverRunProfile = {
  ...sharedRunFields,
  runId: "sheboygan_fall_chinook",
  biologyProfileId: "great_lakes_chinook_v1",
  displayName: "Fall Chinook",
  species: "chinook_salmon",
  runType: "fall_spawn",
  movementEngineId: "fall_cooling",
  runWindow: {
    preRunStart: "08-01",
    stagingStart: "08-15",
    start: "08-25",
    beginningEnd: "09-10",
    buildingEstablishedStart: "09-11",
    buildingBroadStart: "09-20",
    peakStart: "10-01",
    peak: "10-10",
    peakEnd: "10-20",
    taperingEnd: "11-02",
    end: "11-10",
    lateEnd: "11-20",
    postRunLateCopyEnd: "11-30",
  },
  historicalPresence: presence({
    maximum: 8,
    version: "sheboygan-chinook-presence-v1-release",
    anchors: [
      { dayOffsetFromStart: 0, fractionOfMaximum: .08 },
      { dayOffsetFromStart: 10, fractionOfMaximum: .22 },
      { dayOffsetFromStart: 17, fractionOfMaximum: .4 },
      { dayOffsetFromStart: 26, fractionOfMaximum: .62 },
      { dayOffsetFromStart: 37, fractionOfMaximum: .82 },
      { dayOffsetFromStart: 46, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 56, fractionOfMaximum: .9 },
      { dayOffsetFromStart: 69, fractionOfMaximum: .55 },
      { dayOffsetFromStart: 77, fractionOfMaximum: .22 },
      { dayOffsetFromStart: 87, fractionOfMaximum: .06 },
      { dayOffsetFromStart: 97, fractionOfMaximum: 0 },
    ],
    evidenceNotes:
      "Owner/local 8/10 broad-opportunity calibration. Modern Wisconsin DNR weir timing centers regional Chinook abundance in early October, while direct Sheboygan occurrence and all three approved sections corroborate recurrence. Comparator timing and stocking are not Sheboygan return counts.",
    sourceNotes:
      "Wisconsin DNR 2024 Lake Michigan stocking summary, Chinook life history, Sheboygan access material, current regulations, and owner-relayed Wisconsin local calibration recorded 2026-08-26.",
  }),
  activity: buildWeatherOnlyActivity({
    version: "sheboygan-fall-chinook-weather-activity-v2-release",
    profile: "chinook_fall_reaction",
    reachIds: [
      "sheboygan_harbor_lower_city",
      "sheboygan_urban_river",
      "sheboygan_kohler",
    ],
    weatherPointId: "sheboygan_i43_weather",
    inputNotes:
      "I-43 hydraulics remain available to Fishability and Gauge Read but are excluded from Activity because no same-reach measured river temperature completes the observed-river contract. Modeled I-43 weather is the only Activity scoring source.",
    scopeCopy:
      "This Limited weather-only read uses modeled weather near I-43 for the Harbor, Urban River, and legal Kohler corridor below Waelderhaus Dam; it does not measure river level, clarity, or water temperature, which can differ by reach.",
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
      peakEnd: "10-20",
      taperingEnd: "11-02",
      endingEnd: "11-20",
    },
    evidenceNotes:
      "Hidden Chinook response candidate for a fish already present in the Sheboygan corridor. It scores effective light and restrained same-block precipitation only, with conservative weather-only ceilings and a continuous terminal lifecycle decline. It cannot infer temperature, river response, movement, abundance, catch probability, access, or safety.",
  }),
  researchNotes:
    "Hidden Gate 4B broad Chinook candidate. Waelderhaus is the hard endpoint, the night restriction precedes section guidance, and Activity remains explicitly Limited and weather-only.",
  sourceNotes: "docs/onboarding/river-run/sheboygan/runs/fall-chinook.md",
};

export const SHEBOYGAN_FALL_COHO_RUN_PROFILE: AuditedRiverRunProfile = {
  ...sharedRunFields,
  runId: "sheboygan_fall_coho",
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
    peakEnd: "10-31",
    taperingEnd: "11-20",
    end: "11-30",
    lateEnd: "12-10",
    postRunLateCopyEnd: "12-20",
  },
  historicalPresence: presence({
    maximum: 8,
    version: "sheboygan-coho-presence-v1-release",
    anchors: [
      { dayOffsetFromStart: 0, fractionOfMaximum: .06 },
      { dayOffsetFromStart: 10, fractionOfMaximum: .2 },
      { dayOffsetFromStart: 21, fractionOfMaximum: .52 },
      { dayOffsetFromStart: 30, fractionOfMaximum: .8 },
      { dayOffsetFromStart: 40, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 51, fractionOfMaximum: .9 },
      { dayOffsetFromStart: 71, fractionOfMaximum: .52 },
      { dayOffsetFromStart: 81, fractionOfMaximum: .24 },
      { dayOffsetFromStart: 91, fractionOfMaximum: .08 },
      { dayOffsetFromStart: 101, fractionOfMaximum: 0 },
    ],
    evidenceNotes:
      "Owner/local 8/10 broad-opportunity calibration. DNR stocked 66,094 Coho in the Sheboygan River in 2024, after 115,236 in 2023, and identifies September-through-December tributary entry regionally. Direct river return counts are absent, so confidence remains medium.",
    sourceNotes:
      "Wisconsin DNR 2023-2024 Lake Michigan stocking summaries, Coho life history, Sheboygan access material, current regulations, and owner-relayed Wisconsin local calibration recorded 2026-08-26.",
  }),
  activity: buildWeatherOnlyActivity({
    version: "sheboygan-fall-coho-weather-activity-v2-release",
    profile: "coho_fall_reaction",
    reachIds: [
      "sheboygan_harbor_lower_city",
      "sheboygan_urban_river",
      "sheboygan_kohler",
    ],
    weatherPointId: "sheboygan_i43_weather",
    inputNotes:
      "I-43 hydraulics remain available to Fishability and Gauge Read but are excluded from Activity because no same-reach measured river temperature completes the observed-river contract. Modeled I-43 weather is the only Activity scoring source.",
    scopeCopy:
      "This Limited weather-only read uses modeled weather near I-43 for the Harbor, Urban River, and legal Kohler corridor below Waelderhaus Dam; it does not measure river level, clarity, or water temperature, which can differ by reach.",
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
      peakEnd: "10-31",
      taperingEnd: "11-20",
      endingEnd: "12-10",
    },
    evidenceNotes:
      "Hidden Coho response candidate for a fish already present in the Sheboygan corridor. It scores effective light and restrained same-block precipitation only, with conservative weather-only ceilings and a continuous terminal lifecycle decline. It cannot infer temperature, river response, movement, abundance, catch probability, access, or safety.",
  }),
  researchNotes:
    "Hidden Gate 4B broad Coho candidate. The 8/10 ceiling is owner calibration, not a stocking-to-return conversion, and Activity remains explicitly Limited and weather-only.",
  sourceNotes: "docs/onboarding/river-run/sheboygan/runs/fall-coho.md",
};

export const SHEBOYGAN_FALL_STEELHEAD_RUN_PROFILE: AuditedRiverRunProfile = {
  ...sharedRunFields,
  runId: "sheboygan_fall_steelhead",
  biologyProfileId: "great_lakes_steelhead_fall_entry_v1",
  displayName: "Fall Steelhead",
  species: "steelhead",
  runType: "fall_entry",
  movementEngineId: "fall_entry_cooling",
  runWindow: {
    preRunStart: "08-01",
    stagingStart: "08-15",
    start: "09-01",
    beginningEnd: "09-10",
    buildingEstablishedStart: "09-11",
    buildingBroadStart: "09-20",
    peakStart: "09-25",
    peak: "10-01",
    peakEnd: "10-15",
    taperingEnd: "11-15",
    end: "12-15",
    lateEnd: "01-15",
    postRunLateCopyEnd: "01-31",
  },
  historicalPresence: presence({
    maximum: 5,
    version: "sheboygan-steelhead-fall-presence-v2-local-peak-release",
    anchors: [
      { dayOffsetFromStart: 0, fractionOfMaximum: .12 },
      { dayOffsetFromStart: 10, fractionOfMaximum: .35 },
      { dayOffsetFromStart: 19, fractionOfMaximum: .65 },
      { dayOffsetFromStart: 30, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 44, fractionOfMaximum: .9 },
      { dayOffsetFromStart: 75, fractionOfMaximum: .75 },
      { dayOffsetFromStart: 105, fractionOfMaximum: .62 },
    ],
    evidenceNotes:
      "Owner/local 5/10 broad fall-opportunity calibration with an exact Oct. 1 peak anchor supplied by a Wisconsin angler. DNR stocked 19,248 Rainbow Trout in the Sheboygan River in 2024 and directly lists Steelhead throughout the approved corridor. The surrounding stage and presence shoulders are conservative interpolations around the field anchor; this is not a spring model or a count of returns.",
    sourceNotes:
      "Wisconsin DNR 2024 Lake Michigan stocking summary, 2026 Steelhead strain timing, Sheboygan access material, current regulations, and owner-relayed Wisconsin local calibration recorded 2026-08-26.",
  }),
  activity: buildWeatherOnlyActivity({
    version:
      "sheboygan-fall-steelhead-weather-activity-v2-local-calendar-draft",
    profile: "steelhead_feeding",
    reachIds: [
      "sheboygan_harbor_lower_city",
      "sheboygan_urban_river",
      "sheboygan_kohler",
    ],
    weatherPointId: "sheboygan_i43_weather",
    inputNotes:
      "I-43 hydraulics remain available to Fishability and Gauge Read but are excluded from Activity because no same-reach measured river temperature completes the observed-river contract. Modeled I-43 weather is the only Activity scoring source.",
    scopeCopy:
      "This Limited weather-only read uses modeled weather near I-43 for the Harbor, Urban River, and legal Kohler corridor below Waelderhaus Dam; it does not measure river level, clarity, or water temperature, which can differ by reach.",
    evidenceNotes:
      "Hidden Steelhead response candidate for a living fish already present in the Sheboygan corridor. It scores effective light and restrained same-block precipitation, applies the 0.80 Limited-evidence scale, and has no salmon mortality ramp, taper penalty, or ending cap. It cannot infer temperature-led feeding, river response, movement, abundance, catch probability, access, or safety.",
  }),
  researchNotes:
    "Hidden Gate 4B fall-entry candidate. Completion means only that this model stops; surviving Steelhead may overwinter and later spawn or return lakeward. Activity remains explicitly Limited and weather-only.",
  sourceNotes: "docs/onboarding/river-run/sheboygan/runs/fall-steelhead.md",
};

export const SHEBOYGAN_FALL_BROWN_TROUT_RUN_PROFILE: AuditedRiverRunProfile = {
  ...sharedRunFields,
  runId: "sheboygan_fall_brown_trout",
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
    maximum: 8,
    version: "sheboygan-lake-run-brown-presence-v1-release",
    anchors: [
      { dayOffsetFromStart: 0, fractionOfMaximum: .06 },
      { dayOffsetFromStart: 14, fractionOfMaximum: .18 },
      { dayOffsetFromStart: 31, fractionOfMaximum: .52 },
      { dayOffsetFromStart: 45, fractionOfMaximum: .8 },
      { dayOffsetFromStart: 55, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 70, fractionOfMaximum: .9 },
      { dayOffsetFromStart: 80, fractionOfMaximum: .72 },
      { dayOffsetFromStart: 91, fractionOfMaximum: .48 },
      { dayOffsetFromStart: 106, fractionOfMaximum: .25 },
    ],
    evidenceNotes:
      "Owner/local 8/10 broad-opportunity calibration. DNR stocked 44,691 Seeforellen yearlings directly into the Sheboygan River in 2024 and lists Brown Trout at Kiwanis, Esslingen, and Kohler. Regional current evidence supports October tributary entry and ripe/spawning adults in November-early December. Surviving adults may hold or return lakeward; no salmon death curve applies.",
    sourceNotes:
      "Wisconsin DNR 2024 Lake Michigan stocking summary, 2026 fishing report, Brown Trout life history, Lake Michigan trout/salmon questions, Sheboygan access material, current regulations, and owner-relayed Wisconsin local calibration recorded 2026-08-26.",
  }),
  activity: buildWeatherOnlyActivity({
    version: "sheboygan-fall-brown-trout-weather-activity-v1-release",
    profile: "brown_trout_fall_reaction",
    reachIds: [
      "sheboygan_harbor_lower_city",
      "sheboygan_urban_river",
      "sheboygan_kohler",
    ],
    weatherPointId: "sheboygan_i43_weather",
    inputNotes:
      "I-43 hydraulics remain available to Fishability and Gauge Read but are excluded from Activity because no same-reach measured river temperature completes the observed-river contract. Modeled I-43 weather is the only Activity scoring source.",
    scopeCopy:
      "This Limited weather-only read uses modeled weather near I-43 for the Harbor, Urban River, and legal Kohler corridor below Waelderhaus Dam; it does not measure river level, clarity, or water temperature, which can differ by reach.",
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
      "Hidden lake-run Brown Trout response candidate for a living repeat spawner already present in the Sheboygan corridor. It scores effective light and restrained same-block precipitation, applies the 0.80 Limited-evidence scale, and uses only a five-point Peak response nudge capped at 80 to preserve lifecycle shape. It has no salmon mortality ramp, taper penalty, ending cap, or universal lake-return assumption. It cannot infer temperature-led feeding, river response, movement, abundance, catch probability, access, or safety.",
  }),
  researchNotes:
    "Hidden Gate 4B repeat-spawner candidate. Waelderhaus is the physical endpoint, distribution is broad, post-spawn copy preserves hold-versus-lakeward uncertainty, and Activity remains explicitly Limited and weather-only.",
  sourceNotes: "docs/onboarding/river-run/sheboygan/runs/fall-brown-trout.md",
};

export const SHEBOYGAN_CONFIGURATION_DOCUMENT: RiverRunConfigurationDocument = {
  schemaVersion: "river-run-config-v1",
  configVersion: "2026-08-29-sheboygan-four-species-release.5",
  movementEngineVersion: [
    getMovementEngineDefinition("fall_cooling").version,
    getMovementEngineDefinition("fall_entry_cooling").version,
    getMovementEngineDefinition("fall_repeat_spawner_cooling").version,
  ].join("+"),
  river: SHEBOYGAN_RIVER_PROFILE,
  biologyProfiles: [
    GREAT_LAKES_CHINOOK_BIOLOGY_PROFILE,
    GREAT_LAKES_COHO_BIOLOGY_PROFILE,
    GREAT_LAKES_STEELHEAD_FALL_ENTRY_BIOLOGY_PROFILE,
    GREAT_LAKES_LAKE_RUN_BROWN_TROUT_BIOLOGY_PROFILE,
  ],
  runs: [
    SHEBOYGAN_FALL_CHINOOK_RUN_PROFILE,
    SHEBOYGAN_FALL_COHO_RUN_PROFILE,
    SHEBOYGAN_FALL_STEELHEAD_RUN_PROFILE,
    SHEBOYGAN_FALL_BROWN_TROUT_RUN_PROFILE,
  ],
};
