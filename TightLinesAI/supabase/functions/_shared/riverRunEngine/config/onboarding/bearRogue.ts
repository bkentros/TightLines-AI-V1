import type {
  ActivityRules,
  AuditedRiverRunProfile,
  BaselineCoverage,
  FishabilityBands,
  HistoricalPresenceConfig,
  PushRules,
  RiverProfile,
  RiverRunConfigurationDocument,
  RiverRunPrimitiveCapabilities,
  RiverRunSpecies,
  SeasonalZonePlan,
} from "../../types.ts";
import { buildDirectEventPushRules } from "../directPush.ts";
import { getMovementEngineDefinition } from "../movementEngines.ts";
import {
  GREAT_LAKES_CHINOOK_BIOLOGY_PROFILE,
  GREAT_LAKES_COHO_BIOLOGY_PROFILE,
  GREAT_LAKES_STEELHEAD_FALL_ENTRY_BIOLOGY_PROFILE,
} from "../speciesBiology.ts";
import { buildWeatherOnlyActivity } from "./weatherOnlyActivity.ts";

const ACTIVE_SLOTS = [
  "00:00",
  "04:00",
  "08:00",
  "12:00",
  "16:00",
  "20:00",
  "21:00",
];

export const BEAR_CREEK_MANISTEE_RIVER_PROFILE: RiverProfile = {
  riverId: "bear_creek_manistee",
  displayName: "Bear Creek (Manistee)",
  state: "MI",
  region: "great_lakes",
  timezone: "America/Detroit",
  mouthLat: 44.292388,
  mouthLon: -86.11684,
  hydraulicSources: [],
  waterTemperatureSources: [],
  historicalHydraulicSource: {
    sourceId: "bear_creek_coates_usgs_archive",
    provider: "USGS",
    siteId: "04125700",
    name: "Bear Creek near Brethren, MI",
    metric: "flow_cfs",
    historicalStartYear: 1958,
    historicalEndYear: 1968,
    baselineVersion: "bear-creek-coates-field-measurements-1958-1968-v1",
    reachNotes:
      "Sparse manual discharge measurements at Coates Highway, the upstream endpoint of the supported corridor. The archive is not a continuous record and does not describe current conditions downstream.",
    attribution:
      "U.S. Geological Survey field-measurement archive, station 04125700.",
    coverageNote:
      "Thirty-six approved field measurements across ten sampled years from 1958 through 1968. Observations are concentrated in January, April, July, and October, so the aggregate is historical context rather than a seasonal normal.",
    normal: {
      average: 156.37,
      p10: 88.2,
      p25: 103.5,
      median: 135.5,
      p75: 193.25,
      p90: 228.5,
      historicalYears: 10,
      sampleCount: 36,
      years: [1958, 1960, 1961, 1962, 1963, 1964, 1965, 1966, 1967, 1968],
    },
  },
  weatherPoints: [{
    weatherPointId: "bear_creek_coates_weather",
    lat: 44.313893,
    lon: -86.048137,
    role: "primary",
  }],
  foundation: {
    version: "bear-creek-manistee-foundation-v1-release",
    corridorLengthMiles: 6.5,
    downstreamTerminus: "Confluence with the Manistee River below Tippy Dam",
    upstreamTerminus: "Coates Highway / County Road 600",
    targetSpecies: ["chinook_salmon", "coho_salmon", "steelhead"],
    reaches: [
      {
        reachId: "bear_creek_lower",
        displayName:
          "Lower Bear Creek — Manistee confluence to River Road access area",
        order: 1,
        role: "lower",
        gaugeRepresented: false,
        notes:
          "Lower half of the federally designated corridor. The boundary names orient the seasonal model and do not assert public access along private frontage.",
        sourceNotes:
          "U.S. Fish and Wildlife Service National Wild and Scenic Rivers Bear Creek description; Michigan DNR Bear Creek status report; USGS NHDPlus hydrography checked 2026-09-18.",
      },
      {
        reachId: "bear_creek_upper",
        displayName:
          "Upper designated Bear Creek — River Road access area to Coates Highway",
        order: 2,
        role: "upper",
        gaugeRepresented: false,
        notes:
          "Upper half of the 6.5-mile designated corridor, ending at the current Type 3 upstream boundary. USGS 04125700 is historical field-measurement context only.",
        sourceNotes:
          "U.S. Fish and Wildlife Service Bear Creek river page; Michigan Fisheries Order FO-200.26; USGS monitoring location 04125700.",
      },
    ],
    locations: [
      {
        locationId: "bear_creek_coates_endpoint",
        officialName: "Bear Creek at Coates Highway",
        aliases: ["County Road 600", "USGS 04125700"],
        state: "MI",
        latitude: 44.313893,
        longitude: -86.048137,
        coordinateSource: "USGS monitoring location 04125700",
        coordinateStatus: "verified",
        reachId: "bear_creek_upper",
        kind: "barrier",
        fishPassage: "passable",
        publicUpstreamLimit: true,
        publicAccess: "unknown",
        fishingSuitability: {
          bank: "unknown",
          wading: "unknown",
          boat: "unknown",
        },
        beginnerSuitable: false,
        restrictionNotes:
          "This is a product and regulation boundary, not a verified fishing-access or navigation pin.",
        sourceNotes:
          "USGS station metadata and Michigan Fisheries Order FO-200.26; checked 2026-09-18.",
      },
      {
        locationId: "bear_creek_manistee_confluence",
        officialName: "Bear Creek–Manistee River confluence",
        state: "MI",
        latitude: 44.292388,
        longitude: -86.11684,
        coordinateSource:
          "USGS NLDI/NHDPlus downstream navigation from monitoring location 04125700",
        coordinateStatus: "verified",
        reachId: "bear_creek_lower",
        kind: "landmark",
        fishPassage: "passable",
        publicAccess: "unknown",
        fishingSuitability: {
          bank: "unknown",
          wading: "unknown",
          boat: "unknown",
        },
        beginnerSuitable: false,
        restrictionNotes:
          "Hydrographic confluence coordinate only; no public-access or safe-entry claim is made.",
        sourceNotes:
          "USGS NLDI/NHDPlus flowline endpoint and Michigan DNR watershed description; checked 2026-09-18.",
      },
    ],
    primaryGaugeReachId: null,
    contextualGaugeSiteIds: ["04125700"],
    weatherStrategy: {
      mode: "single_point",
      primaryWeatherPointId: "bear_creek_coates_weather",
      basinRepresentation:
        "Modeled weather at Coates Highway is basin context only. It does not substitute for measured creek flow, stage, clarity, or water temperature.",
      sourceNotes:
        "USGS 04125700 coordinates anchor the weather point. Weather-only Activity is explicitly separated from the station's sparse historical field-measurement archive.",
    },
    regulation: {
      version: "michigan-fo-200.26-effective-2026-04-01",
      legalReach:
        "County Road 600 / Coates Highway downstream to the Manistee River",
      waterType: "type_3",
      yearRoundTroutSalmon: true,
      rainbowTroutPossessionLimit:
        "No more than one rainbow trout (steelhead) may be possessed in the Type 3 reach.",
      specialArtificialLureWindow: {
        start: "08-01",
        end: "11-15",
        description:
          "From August 1 through November 15, inclusive, fishing is restricted to artificial lures in the listed Bear Creek reach.",
      },
      noUnverifiedDistanceClosureConfigured: true,
      accessAndSafetyNotes:
        "Check the current Michigan fishing regulations and posted boundaries. Reach names do not grant access across private land or establish safe wading.",
      sourceNotes:
        "Michigan DNR 2026 Fishing Regulations and Fisheries Order FO-200.26, accessed 2026-09-18.",
    },
    evidenceNotes:
      "Michigan DNR documents naturally reproducing Chinook, Coho, and Steelhead in Bear Creek and recommends their continued self-sustaining management. The product corridor is deliberately limited to the current Type 3 reach from Coates Highway downstream. Historical USGS site 04125700 has sparse field measurements from 1958-1968, not a live or daily series, and is never presented as current conditions.",
  },
  conditionRefreshSchedule: {
    activeSlots: ACTIVE_SLOTS,
    inactiveSlots: ["00:00"],
    evidenceNotes:
      "Stage and Seasonal Presence are deterministic daily reads. Activity uses modeled weather only; the historical discharge archive is static display context and never a scored or live input.",
  },
  conditionDataCapabilities: {
    hydraulics: {
      status: "unavailable",
      notes:
        "USGS 04125700 contains only sparse historical field measurements and no accepted live continuous series.",
    },
    waterTemperature: {
      status: "unavailable",
      notes:
        "No accepted continuous measured-water-temperature source represents the Coates Highway–to–Manistee corridor.",
    },
  },
  supportStatus: "beta",
  gaugeLimitationCopy:
    "Bear Creek has no accepted live gauge. USGS 04125700 contributes 36 sparse field measurements from 1958–1968 as archive context only; they are not current conditions, a seasonal normal, or a scored input.",
  regulationReminderCopy:
    "Check current Michigan Type 3 rules and posted boundaries. Artificial lures are required in the listed Bear Creek reach from August 1 through November 15.",
};

export const ROGUE_MI_RIVER_PROFILE: RiverProfile = {
  riverId: "rogue_mi",
  displayName: "Rogue River",
  state: "MI",
  region: "great_lakes",
  timezone: "America/Detroit",
  mouthLat: 43.061178,
  mouthLon: -85.585854,
  hydraulicSources: [{
    sourceId: "rogue_rockford_usgs",
    provider: "USGS",
    siteId: "04118500",
    name: "Rogue River near Rockford, MI",
    role: "primary",
    primaryMetric: "flow_cfs",
    availableMetrics: ["flow_cfs", "gage_height_ft"],
    historyYearsAvailable: 69,
    maxAgeHours: 2,
    reachQuality: "good",
    reachNotes:
      "The Packer Drive station is 2.2 river miles upstream from the Grand River and represents the lower Rogue corridor only. Rockford Dam regulates flow about two miles upstream of the station.",
  }],
  waterTemperatureSources: [],
  weatherPoints: [{
    weatherPointId: "rogue_rockford_weather",
    lat: 43.082249,
    lon: -85.590865,
    role: "primary",
  }],
  foundation: {
    version: "rogue-mi-foundation-v1-release",
    corridorLengthMiles: 6.6,
    downstreamTerminus: "Confluence with the Grand River",
    upstreamTerminus: "Rockford Dam",
    targetSpecies: ["chinook_salmon", "coho_salmon", "steelhead"],
    reaches: [
      {
        reachId: "rogue_lower",
        displayName: "Lower Rogue — Grand River confluence to Packer Drive",
        order: 1,
        role: "lower",
        gaugeRepresented: true,
        notes:
          "The accepted live USGS source directly represents this lower reach; it does not describe the full corridor or water immediately below Rockford Dam.",
        sourceNotes:
          "USGS 04118500 station description and NLDI/NHDPlus hydrography; checked 2026-09-18.",
      },
      {
        reachId: "rogue_middle",
        displayName: "Middle Rogue — Packer Drive to 10 Mile Road",
        order: 2,
        role: "middle",
        gaugeRepresented: false,
        notes:
          "Middle migration reach used by the DNR creel-section split. The Packer Drive gauge is downstream context, not direct measurement of this whole reach.",
        sourceNotes:
          "Michigan DNR 2002-2004 inland creel report, Sites 502 and 503; USGS 04118500 metadata.",
      },
      {
        reachId: "rogue_upper_tailwater",
        displayName: "Rockford tailwater — 10 Mile Road to Rockford Dam",
        order: 3,
        role: "terminal",
        gaugeRepresented: false,
        notes:
          "Upper migratory corridor below the conservative hard endpoint at Rockford Dam. No passage above the dam is implied.",
        sourceNotes:
          "Michigan DNR Better Fishing Waters and Spring Trout guidance; Grand River assessment; current trout regulations.",
      },
    ],
    locations: [
      {
        locationId: "rogue_rockford_dam",
        officialName: "Rockford Dam",
        state: "MI",
        latitude: 43.119086,
        longitude: -85.56235,
        coordinateSource:
          "USGS NLDI/NHDPlus mainstem geometry reconciled to Michigan DNR and EGLE Rockford Dam references",
        coordinateStatus: "verified",
        reachId: "rogue_upper_tailwater",
        kind: "barrier",
        fishPassage: "impassable",
        publicUpstreamLimit: true,
        publicAccess: "unknown",
        fishingSuitability: { bank: "unknown", wading: "unknown", boat: "no" },
        beginnerSuitable: false,
        restrictionNotes:
          "The dam is the migratory product endpoint. This record is not a verified fishing-access point and does not authorize approach to the structure.",
        sourceNotes:
          "Michigan DNR Better Fishing Waters separates migratory species below Rockford Dam from the brown-trout fishery above; EGLE identifies the active impoundment; checked 2026-09-18.",
      },
      {
        locationId: "rogue_packer_gauge",
        officialName: "Rogue River near Rockford, MI",
        aliases: ["Packer Drive gauge", "USGS 04118500"],
        state: "MI",
        latitude: 43.082249,
        longitude: -85.590865,
        coordinateSource: "USGS monitoring location 04118500",
        coordinateStatus: "verified",
        reachId: "rogue_lower",
        kind: "gauge",
        fishPassage: "passable",
        publicAccess: "unknown",
        fishingSuitability: {
          bank: "unknown",
          wading: "unknown",
          boat: "unknown",
        },
        beginnerSuitable: false,
        restrictionNotes:
          "Station location only; no public fishing access, parking, or safe-entry claim is made.",
        sourceNotes: "USGS 04118500 station metadata; checked 2026-09-18.",
      },
      {
        locationId: "rogue_grand_confluence",
        officialName: "Rogue River–Grand River confluence",
        state: "MI",
        latitude: 43.061178,
        longitude: -85.585854,
        coordinateSource:
          "USGS NLDI/NHDPlus downstream navigation from monitoring location 04118500",
        coordinateStatus: "verified",
        reachId: "rogue_lower",
        kind: "landmark",
        fishPassage: "passable",
        publicAccess: "unknown",
        fishingSuitability: {
          bank: "unknown",
          wading: "unknown",
          boat: "unknown",
        },
        beginnerSuitable: false,
        restrictionNotes:
          "Hydrographic confluence coordinate only; no public-access or safe-entry claim is made.",
        sourceNotes:
          "USGS NLDI/NHDPlus flowline endpoint and Michigan DNR Natural Rivers description; checked 2026-09-18.",
      },
    ],
    primaryGaugeReachId: "rogue_lower",
    contextualGaugeSiteIds: [],
    weatherStrategy: {
      mode: "single_point",
      primaryWeatherPointId: "rogue_rockford_weather",
      basinRepresentation:
        "Modeled weather at the Packer Drive gauge accompanies measured lower-corridor discharge and never substitutes for measured water temperature.",
      sourceNotes:
        "USGS 04118500 coordinates anchor the weather point used by the fixed 2019–2025 lower-corridor Activity replay.",
    },
    stateRegulations: [{
      state: "MI",
      version: "michigan-fo-200.26-effective-2026-04-01",
      jurisdiction: "Michigan Department of Natural Resources",
      reminderCopy:
        "The Rogue River downstream to the Grand River is listed as Type 4. Check current Type 4 seasons, size and possession limits, and posted site rules before fishing.",
      accessAndSafetyNotes:
        "Reach names provide seasonal orientation only and do not guarantee public access, parking, legal methods, boating, wading, or safe conditions.",
      sourceNotes:
        "Michigan DNR 2026 Fishing Regulations and Fisheries Order FO-200.26, accessed 2026-09-18.",
    }],
    evidenceNotes:
      "Michigan DNR identifies Chinook, Coho, and Steelhead opportunity below Rockford Dam, while the fishery above the dam is presented as brown trout. The accepted corridor therefore ends at the dam. DNR creel Sites 502 and 503 supply river-specific monthly fall observations; USGS 04118500 supplies current lower-reach flow and gage height but no accepted live water temperature.",
  },
  conditionRefreshSchedule: {
    activeSlots: ACTIVE_SLOTS,
    inactiveSlots: ["00:00"],
    evidenceNotes:
      "Gauge Read follows source freshness. Stage and Seasonal Presence are deterministic daily reads; lower-reach Activity, Fishing Shape, and hydraulic Push are freshness-gated to USGS 04118500.",
  },
  conditionDataCapabilities: {
    hydraulics: { status: "available" },
    waterTemperature: {
      status: "unavailable",
      notes:
        "USGS 04118500 provides current flow and gage height but no accepted continuous water-temperature series.",
    },
  },
  supportStatus: "beta",
  gaugeLimitationCopy:
    "USGS 04118500 at Packer Drive represents the lower Rogue only; it does not measure water temperature or conditions throughout the Rockford tailwater.",
  regulationReminderCopy:
    "Check current Michigan Type 4 rules and posted boundaries before fishing the Rogue River below Rockford Dam.",
};

const ROGUE_FISHABILITY: FishabilityBands = {
  version: "rogue-packer-fishability-2019-2025-v1",
  metric: "flow_cfs",
  sourceLabel: "Packer Drive lower Rogue",
  tooLow: { max: 107 },
  lowFishable: { min: 107, max: 133 },
  ideal: { min: 133, max: 225 },
  highFishable: { min: 225, max: 359.5 },
  blownOut: { min: 446.25 },
  caps: {
    staleGauge: 55,
    unknownTrend: 49,
    veryLow: 45,
    blownOut: 24,
    sharpRiseHigh: 40,
  },
  evidenceNotes:
    "Lower-Rogue presentation shape only. It is not fish abundance, clarity, passage, access, wading safety, or a whole-river condition rating.",
  sourceNotes:
    "USGS 04118500 approved daily mean discharge for fixed Aug. 1–Jan. 15 windows in 2019–2025 (1,176 observations): p10 107, p25 133, median 176, p75 225, p90 359.5, and p95 446.25 CFS. The p90–p95 interval is intentionally very high.",
};

const ROGUE_BASELINE: BaselineCoverage = {
  metric: "flow_cfs",
  version: "rogue-packer-fall-2019-2025-v1",
  hasPercentileBaselines: true,
  coveredWindowPercent: 1,
  minimumHistoryYears: 7,
  sourceNotes:
    "USGS 04118500 approved daily mean discharge covers every day in the fixed Aug. 1–Jan. 15 windows for 2019–2025: 1,176 observations.",
};

const ROGUE_HYDRAULIC_TREND = {
  rising24h: { absolute: 12, percent: 7 },
  meaningfulRise24h: { absolute: 32, percent: 16 },
  sharpRise24h: { absolute: 63, percent: 33 },
};

function capabilities(
  riverId: "bear_creek_manistee" | "rogue_mi",
): RiverRunPrimitiveCapabilities {
  const bear = riverId === "bear_creek_manistee";
  return {
    migrationStage: { status: "available" },
    activity: { status: "available" },
    fishInRiver: { status: "available" },
    fishability: bear
      ? {
        status: "unavailable",
        reason: "no_accepted_hydraulic_source",
        notes:
          "No accepted live hydraulic source represents Bear Creek; the sparse archive is display-only.",
      }
      : { status: "available" },
    migrationTiming: {
      status: "unavailable",
      reason: "no_accepted_historical_baseline",
      notes:
        "No accepted paired hydraulic and measured-water-temperature baseline supports early, typical, or delayed timing.",
    },
    push: bear
      ? {
        status: "unavailable",
        reason: "no_accepted_hydraulic_or_water_temperature_source",
        notes:
          "Bear Creek has neither accepted live hydraulics nor measured water temperature; modeled weather and archive context cannot create Push.",
      }
      : { status: "available" },
  };
}

function profileForSpecies(
  species: RunInput["species"],
): ActivityRules["profile"] {
  if (species === "chinook_salmon") return "chinook_fall_reaction";
  if (species === "coho_salmon") return "coho_fall_reaction";
  return "steelhead_feeding";
}

function activityForRun(input: RunInput): ActivityRules {
  const profile = profileForSpecies(input.species);
  const salmon = input.species !== "steelhead";
  const stageResponseAdjustment = input.riverId === "rogue_mi"
    ? salmon
      ? {
        pre_run: -5,
        beginning: -5,
        building: 4,
        peak: input.species === "coho_salmon" ? 7 : 6,
        tapering: 6,
        ending: 6,
        post_run: 6,
      }
      : {
        pre_run: -6,
        beginning: -3,
        building: 4,
        peak: 7,
        tapering: 5,
        ending: 5,
        post_run: 5,
      }
    : salmon
    ? {
      pre_run: -5,
      beginning: -5,
      building: 0,
      peak: 0,
      tapering: 0,
      ending: 0,
      post_run: 0,
    }
    : {
      pre_run: -6,
      beginning: -3,
      building: 0,
      peak: 0,
      tapering: 0,
      ending: 0,
      post_run: 0,
    };
  if (input.riverId === "bear_creek_manistee") {
    return buildWeatherOnlyActivity({
      version: `${input.runId}-weather-activity-v1`,
      profile,
      reachIds: ["bear_creek_lower", "bear_creek_upper"],
      weatherPointId: "bear_creek_coates_weather",
      inputNotes:
        "Modeled weather at Coates Highway is the only Activity input. The USGS field-measurement archive is historical display context and is never scored.",
      scopeCopy:
        "This Limited weather-only read covers the Coates Highway–to–Manistee corridor. It does not measure creek level, clarity, water temperature, fish movement, abundance, access, or safety.",
      stageResponseAdjustment,
      stageResponseMaximum: 90,
      ...(salmon
        ? {
          lifecycle: {
            peakEnd: input.runWindow.peakEnd,
            taperingEnd: input.runWindow.taperingEnd,
            endingEnd: input.runWindow.lateEnd,
          },
        }
        : {}),
      evidenceNotes:
        "Fixed 2007–2025 Open-Meteo replay at the Coates Highway anchor. Effective light and restrained same-block precipitation are scored; no river state is inferred. The 90-point stage ceiling, Limited confidence, species profiles, terminal-salmon lifecycle constraints, and Steelhead evidence scale remain intact.",
    });
  }
  return {
    version: `${input.runId}-lower-rogue-flow-activity-v2`,
    profile,
    dataMode: "observed_river",
    minimumInputContract: "weather_and_one_measured_river_input",
    confidenceCeiling: "Limited",
    inputReach: {
      reachIds: ["rogue_lower"],
      hydraulicSourceIds: ["rogue_rockford_usgs"],
      waterTemperatureSourceIds: [],
      weatherPointIds: ["rogue_rockford_weather"],
      notes:
        "Packer Drive discharge is the sole measured river input and represents only the lower Rogue. Gauge height is presentation context, not a second Activity signal.",
    },
    scopeCopy:
      "This Limited read combines measured Packer Drive discharge with modeled light and precipitation for the lower Rogue only. It does not directly describe the middle reach, Rockford tailwater, clarity, temperature, fish passage, abundance, access, or safety.",
    weights: {
      light: 0.30,
      waterTemperature: 0,
      riverBehavior: 0.60,
      weather: 0.10,
    },
    temperature: profile === "chinook_fall_reaction"
      ? {
        coldF: 43,
        preferredMinF: 48,
        preferredMaxF: 62,
        warmF: 68,
        barrierF: 72,
      }
      : profile === "coho_fall_reaction"
      ? {
        coldF: 40,
        preferredMinF: 45,
        preferredMaxF: 60,
        warmF: 64,
        barrierF: 68,
      }
      : {
        coldF: 36,
        preferredMinF: 42,
        preferredMaxF: 58,
        warmF: 64,
        barrierF: 68,
      },
    hydraulicTrend: ROGUE_HYDRAULIC_TREND,
    stageResponseAdjustment,
    caps: {
      noMeasuredRiverData: 60,
      noWaterTemperature: 100,
      lateRun: salmon ? 75 : 100,
      ending: salmon ? 42 : 100,
      stageResponseMaximum: 90,
      ...(salmon
        ? {
          taperingPenalty: 15,
          lifecycleRamp: {
            peakEnd: input.runWindow.peakEnd,
            taperingEnd: input.runWindow.taperingEnd,
            endingEnd: input.runWindow.lateEnd,
          },
        }
        : {}),
    },
    evidenceNotes:
      "Fixed 2019–2025 lower-Rogue replay uses approved USGS 04118500 daily discharge, paired positive-rise percentiles, and hourly modeled weather. Water temperature has zero weight and no temperature-shaped rule can raise or lower Activity. Owner-requested Rogue-only calibration adds a bounded +4 Building response and +6 from Peak through the already declining salmon lifecycle (with Coho retaining its prior one-point Peak shape correction); Steelhead receives +4 Building, +7 Peak, and +5 through its living-fish tail. The existing Limited-confidence ceiling keeps every positively adjusted block at 69 or below.",
  };
}

function roguePush(input: RunInput): PushRules {
  const profile = profileForSpecies(input.species);
  return buildDirectEventPushRules({
    version: `${input.runId}-hydraulic-push-v1`,
    fishability: ROGUE_FISHABILITY,
    hydraulicTrend: ROGUE_HYDRAULIC_TREND,
    activityProfile: profile,
    movementTemperature: input.species === "chinook_salmon"
      ? {
        supportiveMinF: 51,
        supportiveMaxF: 63,
        tooWarmF: 68,
        migrationBarrierF: 70,
      }
      : input.species === "coho_salmon"
      ? {
        supportiveMinF: 50,
        supportiveMaxF: 62,
        tooWarmF: 68,
        migrationBarrierF: 70,
      }
      : {
        coldHoldingF: 39,
        preferredMinF: 46,
        supportiveMinF: 40,
        supportiveMaxF: 52,
        tooWarmF: 60,
        migrationBarrierF: 70,
      },
    temperatureMode: "disabled",
    evidenceConfidence: "lower",
    maximumLevel: 2,
    limitationCopy:
      "Hydraulic-only signal at Packer Drive in the lower Rogue; no measured water temperature corroborates the event and no whole-corridor movement is inferred.",
    evidenceNotes:
      "Positive-only hydraulic Push uses the 2019–2025 fixed fall-window replay. Positive daily rises were 12 CFS/6.9% at p50, 31.75 CFS/15.6% at p75, and 63.37 CFS/33.1% at p90; paired rounded thresholds require both absolute and relative change.",
    sourceNotes:
      "USGS 04118500 approved daily discharge, fixed Aug. 1–Jan. 15 windows for 2019–2025. The signal represents the Packer Drive lower reach only; temperature, precipitation, and wind cannot trigger it.",
  });
}

function presence(
  maximum: HistoricalPresenceConfig["maximum"],
  distributionScope: HistoricalPresenceConfig["distributionScope"],
  curveVersion: string,
  anchors: HistoricalPresenceConfig["anchors"],
  evidenceNotes: string,
  sourceNotes: string,
): HistoricalPresenceConfig {
  return {
    maximum,
    distributionScope,
    curveVersion,
    anchors,
    evidenceNotes,
    sourceNotes,
  };
}

function bearPlan(
  runId: string,
  living: boolean,
): SeasonalZonePlan {
  return {
    version: `${runId}-seasonal-zone-v1-release`,
    earlyApproach: {
      label: "Manistee River near the Bear Creek confluence",
      sourceNotes:
        "Michigan DNR identifies Bear Creek as a Manistee River tributary below Tippy Dam. This is broad receiving-river direction, not verified access.",
    },
    phases: {
      beginning: ["bear_creek_lower"],
      buildingEarly: ["bear_creek_upper"],
      buildingEstablished: ["bear_creek_upper"],
      buildingBroad: ["bear_creek_upper"],
      peak: ["bear_creek_lower", "bear_creek_upper"],
      tapering: living
        ? ["bear_creek_lower", "bear_creek_upper"]
        : ["bear_creek_upper"],
      ending: living
        ? ["bear_creek_lower", "bear_creek_upper"]
        : ["bear_creek_upper"],
    },
    evidenceNotes:
      "The plan uses only the accepted Coates-to-confluence corridor. Early phases begin at the Manistee connection, salmon late phases emphasize spawning water upstream, and living Steelhead retain both reaches. It is seasonal orientation, not a live fish-location or access claim.",
  };
}

function roguePlan(
  runId: string,
  living: boolean,
): SeasonalZonePlan {
  return {
    version: `${runId}-seasonal-zone-v1-release`,
    earlyApproach: {
      label: "Grand River near the Rogue River confluence",
      sourceNotes:
        "Michigan DNR identifies the Rogue as a major Grand River tributary. This is broad receiving-river direction, not verified access.",
    },
    phases: {
      beginning: ["rogue_lower"],
      buildingEarly: ["rogue_middle"],
      buildingEstablished: ["rogue_middle", "rogue_upper_tailwater"],
      buildingBroad: ["rogue_middle", "rogue_upper_tailwater"],
      peak: ["rogue_lower", "rogue_middle", "rogue_upper_tailwater"],
      tapering: living
        ? ["rogue_lower", "rogue_middle", "rogue_upper_tailwater"]
        : ["rogue_middle", "rogue_upper_tailwater"],
      ending: living
        ? ["rogue_lower", "rogue_middle", "rogue_upper_tailwater"]
        : ["rogue_upper_tailwater"],
    },
    evidenceNotes:
      "DNR creel sections and the Rockford Dam endpoint support a lower-to-upper seasonal orientation without implying equal distribution. Salmon late phases emphasize the dam-bounded upper corridor; living Steelhead retain the full corridor.",
  };
}

type RunInput = {
  runId: string;
  riverId: "bear_creek_manistee" | "rogue_mi";
  displayName: string;
  species: Extract<
    RiverRunSpecies,
    "chinook_salmon" | "coho_salmon" | "steelhead"
  >;
  biologyProfileId: string;
  runType: "fall_spawn" | "fall_entry";
  movementEngineId: "fall_cooling" | "fall_entry_cooling";
  runWindow: AuditedRiverRunProfile["runWindow"];
  historicalPresence: HistoricalPresenceConfig;
  seasonalZonePlan: SeasonalZonePlan;
  researchNotes: string;
  sourceNotes: string;
};

function releasedRun(input: RunInput): AuditedRiverRunProfile {
  const rogue = input.riverId === "rogue_mi";
  return {
    runId: input.runId,
    riverId: input.riverId,
    biologyProfileId: input.biologyProfileId,
    displayName: input.displayName,
    species: input.species,
    season: "fall",
    runType: input.runType,
    movementEngineId: input.movementEngineId,
    runStageCopyStrategy: "onboarding_corridor",
    primitiveCapabilities: capabilities(input.riverId),
    runWindow: input.runWindow,
    historicalPresence: input.historicalPresence,
    seasonalZonePlan: input.seasonalZonePlan,
    activity: activityForRun(input),
    ...(rogue
      ? {
        push: roguePush(input),
        fishabilityBands: ROGUE_FISHABILITY,
        baselineCoverage: ROGUE_BASELINE,
      }
      : {}),
    researchNotes: input.researchNotes,
    sourceNotes: input.sourceNotes,
    publicAudit: {
      isEnabled: true,
      auditVersion: `${input.runId}-pass2-release-audit-${rogue ? "v2" : "v1"}`,
      notes: rogue
        ? "Pass 2 implementation completed September 19, 2026. Rogue Activity v2 adds owner-requested, bounded stage response after a complete 2019–2025 replay while retaining Limited confidence, lower-reach source scope, the existing 69-point positive-adjustment ceiling, and zero replay invariant violations. Production deployment remains a separate action."
        : "Pass 2 implementation completed September 19, 2026 with fixed-period Activity replay, source-isolated weather-only behavior, access/source review, client compatibility, and release-level automated checks. Production deployment remains a separate action.",
    },
  };
}

export const BEAR_CREEK_FALL_CHINOOK_RUN_PROFILE = releasedRun({
  runId: "bear_creek_manistee_fall_chinook",
  riverId: "bear_creek_manistee",
  displayName: "Fall Chinook",
  species: "chinook_salmon",
  biologyProfileId: "great_lakes_chinook_v1",
  runType: "fall_spawn",
  movementEngineId: "fall_cooling",
  runWindow: {
    preRunStart: "08-10",
    stagingStart: "08-20",
    start: "09-01",
    beginningEnd: "09-10",
    buildingEstablishedStart: "09-11",
    buildingBroadStart: "09-16",
    peakStart: "09-20",
    peak: "09-25",
    peakEnd: "10-10",
    taperingEnd: "10-20",
    end: "11-05",
    lateEnd: "11-12",
    postRunLateCopyEnd: "11-19",
  },
  historicalPresence: presence(
    6,
    "sectional",
    "bear-creek-manistee-fall-chinook-presence-v1-release",
    [
      { dayOffsetFromStart: 0, fractionOfMaximum: 0.08 },
      { dayOffsetFromStart: 9, fractionOfMaximum: 0.25 },
      { dayOffsetFromStart: 19, fractionOfMaximum: 0.7 },
      { dayOffsetFromStart: 24, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 39, fractionOfMaximum: 0.8 },
      { dayOffsetFromStart: 49, fractionOfMaximum: 0.42 },
      { dayOffsetFromStart: 65, fractionOfMaximum: 0.1 },
      { dayOffsetFromStart: 79, fractionOfMaximum: 0 },
    ],
    "A 6/10 corridor-relative ceiling reflects a recurring, naturally reproducing Chinook run documented by DNR surveys and Master Angler records. Dates are conservative calibration from the Bear/Manistee system record, not a live count or lakewide abundance claim.",
    "Michigan DNR Bear Creek status report (2014, renumbered 2024) and Manistee River below Tippy Dam status report; dossier E-001/E-006.",
  ),
  seasonalZonePlan: bearPlan("bear-creek-manistee-fall-chinook", false),
  researchNotes:
    "Public Pass 2 seasonal profile. Bear-specific natural reproduction is direct evidence; exact phase boundaries are conservative owner calibration because no adult counting facility supplies daily Bear Creek timing.",
  sourceNotes:
    "docs/onboarding/river-run/bear_creek_manistee/river-onboarding.md; evidence cutoff 2026-09-18.",
});

export const BEAR_CREEK_FALL_COHO_RUN_PROFILE = releasedRun({
  runId: "bear_creek_manistee_fall_coho",
  riverId: "bear_creek_manistee",
  displayName: "Fall Coho",
  species: "coho_salmon",
  biologyProfileId: "great_lakes_coho_v1",
  runType: "fall_spawn",
  movementEngineId: "fall_cooling",
  runWindow: {
    preRunStart: "09-01",
    stagingStart: "09-10",
    start: "09-20",
    beginningEnd: "09-30",
    buildingEstablishedStart: "10-01",
    buildingBroadStart: "10-10",
    peakStart: "10-20",
    peak: "10-25",
    peakEnd: "11-05",
    taperingEnd: "11-20",
    end: "12-05",
    lateEnd: "12-15",
    postRunLateCopyEnd: "12-22",
  },
  historicalPresence: presence(
    4,
    "sectional",
    "bear-creek-manistee-fall-coho-presence-v1-release",
    [
      { dayOffsetFromStart: 0, fractionOfMaximum: 0.08 },
      { dayOffsetFromStart: 10, fractionOfMaximum: 0.22 },
      { dayOffsetFromStart: 30, fractionOfMaximum: 0.65 },
      { dayOffsetFromStart: 35, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 46, fractionOfMaximum: 0.82 },
      { dayOffsetFromStart: 61, fractionOfMaximum: 0.45 },
      { dayOffsetFromStart: 76, fractionOfMaximum: 0.1 },
      { dayOffsetFromStart: 93, fractionOfMaximum: 0 },
    ],
    "A 4/10 ceiling keeps Bear Coho below Chinook: DNR documents a self-sustaining population and recurring juvenile production, while adult catch evidence is much thinner. The curve is corridor-relative seasonal opportunity, not a fish count.",
    "Michigan DNR Bear Creek status report survey tables and management direction; dossier E-001.",
  ),
  seasonalZonePlan: bearPlan("bear-creek-manistee-fall-coho", false),
  researchNotes:
    "Public Pass 2 seasonal profile. The later curve reflects Coho biology and Bear-specific natural reproduction while preserving lower confidence in adult opportunity strength.",
  sourceNotes:
    "docs/onboarding/river-run/bear_creek_manistee/river-onboarding.md; evidence cutoff 2026-09-18.",
});

export const BEAR_CREEK_FALL_STEELHEAD_RUN_PROFILE = releasedRun({
  runId: "bear_creek_manistee_fall_steelhead",
  riverId: "bear_creek_manistee",
  displayName: "Fall Steelhead",
  species: "steelhead",
  biologyProfileId: "great_lakes_steelhead_fall_entry_v1",
  runType: "fall_entry",
  movementEngineId: "fall_entry_cooling",
  runWindow: {
    preRunStart: "08-25",
    stagingStart: "09-05",
    start: "09-15",
    beginningEnd: "09-30",
    buildingEstablishedStart: "10-01",
    buildingBroadStart: "10-15",
    peakStart: "11-01",
    peak: "11-15",
    peakEnd: "11-30",
    taperingEnd: "12-15",
    end: "12-31",
    lateEnd: "01-15",
    postRunLateCopyEnd: "01-31",
  },
  historicalPresence: presence(
    5,
    "broad",
    "bear-creek-manistee-fall-steelhead-presence-v1-release",
    [
      { dayOffsetFromStart: 0, fractionOfMaximum: 0.05 },
      { dayOffsetFromStart: 15, fractionOfMaximum: 0.2 },
      { dayOffsetFromStart: 30, fractionOfMaximum: 0.45 },
      { dayOffsetFromStart: 47, fractionOfMaximum: 0.72 },
      { dayOffsetFromStart: 61, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 76, fractionOfMaximum: 0.86 },
      { dayOffsetFromStart: 91, fractionOfMaximum: 0.65 },
      { dayOffsetFromStart: 107, fractionOfMaximum: 0.5 },
      { dayOffsetFromStart: 138, fractionOfMaximum: 0 },
    ],
    "A 5/10 fall-entry ceiling recognizes a recurring self-sustaining Steelhead population without borrowing the larger Manistee mainstem ceiling. The winter tail ends this model only; it does not claim living fish have left Bear Creek.",
    "Michigan DNR Bear Creek status report management direction, survey history, and Manistee-system context; dossier E-001/E-006.",
  ),
  seasonalZonePlan: bearPlan("bear-creek-manistee-fall-steelhead", true),
  researchNotes:
    "Public Pass 2 fall-entry profile. This is the fall-entry experience only; spring spawning is not merged into or scored by this calendar.",
  sourceNotes:
    "docs/onboarding/river-run/bear_creek_manistee/river-onboarding.md; evidence cutoff 2026-09-18.",
});

export const ROGUE_MI_FALL_CHINOOK_RUN_PROFILE = releasedRun({
  runId: "rogue_mi_fall_chinook",
  riverId: "rogue_mi",
  displayName: "Fall Chinook",
  species: "chinook_salmon",
  biologyProfileId: "great_lakes_chinook_v1",
  runType: "fall_spawn",
  movementEngineId: "fall_cooling",
  runWindow: {
    preRunStart: "08-15",
    stagingStart: "08-25",
    start: "09-01",
    beginningEnd: "09-15",
    buildingEstablishedStart: "09-16",
    buildingBroadStart: "09-25",
    peakStart: "10-01",
    peak: "10-10",
    peakEnd: "10-31",
    taperingEnd: "11-07",
    end: "11-15",
    lateEnd: "11-22",
    postRunLateCopyEnd: "11-29",
  },
  historicalPresence: presence(
    6,
    "sectional",
    "rogue-mi-fall-chinook-presence-v1-release",
    [
      { dayOffsetFromStart: 0, fractionOfMaximum: 0.08 },
      { dayOffsetFromStart: 14, fractionOfMaximum: 0.28 },
      { dayOffsetFromStart: 30, fractionOfMaximum: 0.78 },
      { dayOffsetFromStart: 39, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 60, fractionOfMaximum: 0.6 },
      { dayOffsetFromStart: 68, fractionOfMaximum: 0.25 },
      { dayOffsetFromStart: 75, fractionOfMaximum: 0.08 },
      { dayOffsetFromStart: 89, fractionOfMaximum: 0 },
    ],
    "A 6/10 corridor-relative ceiling is supported by DNR identification of a good below-dam Chinook fishery and substantial 2002-2003 lower-Rogue creel observations. September is entry/building, October is dominant, and early November is residual.",
    "Michigan DNR Better Fishing Waters and Inland Creel 2000-2006 Estimates, 2002-2003 Sites 502/503; dossier E-002/E-004.",
  ),
  seasonalZonePlan: roguePlan("rogue-mi-fall-chinook", false),
  researchNotes:
    "Public Pass 2 profile independently calibrated from Rogue monthly creel bins. Date boundaries inside those bins are explicit conservative interpolation, not daily count observations.",
  sourceNotes:
    "docs/onboarding/river-run/rogue_mi/river-onboarding.md; evidence cutoff 2026-09-18.",
});

export const ROGUE_MI_FALL_COHO_RUN_PROFILE = releasedRun({
  runId: "rogue_mi_fall_coho",
  riverId: "rogue_mi",
  displayName: "Fall Coho",
  species: "coho_salmon",
  biologyProfileId: "great_lakes_coho_v1",
  runType: "fall_spawn",
  movementEngineId: "fall_cooling",
  runWindow: {
    preRunStart: "09-01",
    stagingStart: "09-15",
    start: "10-01",
    beginningEnd: "10-10",
    buildingEstablishedStart: "10-11",
    buildingBroadStart: "10-20",
    peakStart: "10-25",
    peak: "11-01",
    peakEnd: "11-10",
    taperingEnd: "11-20",
    end: "11-30",
    lateEnd: "12-10",
    postRunLateCopyEnd: "12-17",
  },
  historicalPresence: presence(
    2,
    "concentrated",
    "rogue-mi-fall-coho-presence-v1-release",
    [
      { dayOffsetFromStart: 0, fractionOfMaximum: 0.08 },
      { dayOffsetFromStart: 9, fractionOfMaximum: 0.28 },
      { dayOffsetFromStart: 24, fractionOfMaximum: 0.75 },
      { dayOffsetFromStart: 31, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 40, fractionOfMaximum: 0.7 },
      { dayOffsetFromStart: 50, fractionOfMaximum: 0.35 },
      { dayOffsetFromStart: 60, fractionOfMaximum: 0.08 },
      { dayOffsetFromStart: 77, fractionOfMaximum: 0 },
    ],
    "A deliberately low 2/10 ceiling reflects confirmed but sparse Rogue Coho observations: DNR lists the species below Rockford Dam, while 2002-2003 creel tables record only small October observations compared with Chinook and Steelhead.",
    "Michigan DNR Better Fishing Waters and Inland Creel 2000-2006 Estimates, 2002-2003 Sites 502/503; dossier E-002/E-004.",
  ),
  seasonalZonePlan: roguePlan("rogue-mi-fall-coho", false),
  researchNotes:
    "Public Pass 2 profile. Coho is retained as a recurring but low-strength run; it is not inflated to match neighboring Grand River or Rogue Chinook opportunity.",
  sourceNotes:
    "docs/onboarding/river-run/rogue_mi/river-onboarding.md; evidence cutoff 2026-09-18.",
});

export const ROGUE_MI_FALL_STEELHEAD_RUN_PROFILE = releasedRun({
  runId: "rogue_mi_fall_steelhead",
  riverId: "rogue_mi",
  displayName: "Fall Steelhead",
  species: "steelhead",
  biologyProfileId: "great_lakes_steelhead_fall_entry_v1",
  runType: "fall_entry",
  movementEngineId: "fall_entry_cooling",
  runWindow: {
    preRunStart: "08-15",
    stagingStart: "08-25",
    start: "09-01",
    beginningEnd: "09-15",
    buildingEstablishedStart: "09-16",
    buildingBroadStart: "10-01",
    peakStart: "10-20",
    peak: "11-15",
    peakEnd: "11-30",
    taperingEnd: "12-15",
    end: "12-31",
    lateEnd: "01-15",
    postRunLateCopyEnd: "01-31",
  },
  historicalPresence: presence(
    7,
    "broad",
    "rogue-mi-fall-steelhead-presence-v1-release",
    [
      { dayOffsetFromStart: 0, fractionOfMaximum: 0.08 },
      { dayOffsetFromStart: 14, fractionOfMaximum: 0.22 },
      { dayOffsetFromStart: 30, fractionOfMaximum: 0.48 },
      { dayOffsetFromStart: 49, fractionOfMaximum: 0.72 },
      { dayOffsetFromStart: 75, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 90, fractionOfMaximum: 0.9 },
      { dayOffsetFromStart: 105, fractionOfMaximum: 0.72 },
      { dayOffsetFromStart: 121, fractionOfMaximum: 0.58 },
      { dayOffsetFromStart: 152, fractionOfMaximum: 0 },
    ],
    "A 7/10 fall-entry ceiling reflects the Rogue's agency-recognized Steelhead fishery and recurring September-November lower-Rogue creel observations. November is the fall high; the terminal zero ends this model and does not claim living fish left the river.",
    "Michigan DNR Spring Trout guidance, Better Fishing Waters, Grand River assessment, and 2002-2003 inland creel Sites 502/503; dossier E-002/E-003/E-004.",
  ),
  seasonalZonePlan: roguePlan("rogue-mi-fall-steelhead", true),
  researchNotes:
    "Public Pass 2 fall-entry profile. Spring spawning opportunity is biologically real but intentionally outside this fall-entry calendar and current engine scope.",
  sourceNotes:
    "docs/onboarding/river-run/rogue_mi/river-onboarding.md; evidence cutoff 2026-09-18.",
});

export const BEAR_CREEK_MANISTEE_RUNS = [
  BEAR_CREEK_FALL_CHINOOK_RUN_PROFILE,
  BEAR_CREEK_FALL_COHO_RUN_PROFILE,
  BEAR_CREEK_FALL_STEELHEAD_RUN_PROFILE,
];

export const ROGUE_MI_RUNS = [
  ROGUE_MI_FALL_CHINOOK_RUN_PROFILE,
  ROGUE_MI_FALL_COHO_RUN_PROFILE,
  ROGUE_MI_FALL_STEELHEAD_RUN_PROFILE,
];

const BIOLOGY_PROFILES = [
  GREAT_LAKES_CHINOOK_BIOLOGY_PROFILE,
  GREAT_LAKES_COHO_BIOLOGY_PROFILE,
  GREAT_LAKES_STEELHEAD_FALL_ENTRY_BIOLOGY_PROFILE,
];

export const BEAR_CREEK_MANISTEE_CONFIGURATION_DOCUMENT:
  RiverRunConfigurationDocument = {
    schemaVersion: "river-run-config-v1",
    configVersion: "2026-09-18-bear-creek-manistee-pass2-release-v1",
    movementEngineVersion: [
      getMovementEngineDefinition("fall_cooling").version,
      getMovementEngineDefinition("fall_entry_cooling").version,
    ].join("+"),
    river: BEAR_CREEK_MANISTEE_RIVER_PROFILE,
    biologyProfiles: BIOLOGY_PROFILES,
    runs: BEAR_CREEK_MANISTEE_RUNS,
  };

export const ROGUE_MI_CONFIGURATION_DOCUMENT: RiverRunConfigurationDocument = {
  schemaVersion: "river-run-config-v1",
  configVersion: "2026-09-19-rogue-mi-activity-v2",
  movementEngineVersion: [
    getMovementEngineDefinition("fall_cooling").version,
    getMovementEngineDefinition("fall_entry_cooling").version,
  ].join("+"),
  river: ROGUE_MI_RIVER_PROFILE,
  biologyProfiles: BIOLOGY_PROFILES,
  runs: ROGUE_MI_RUNS,
};
