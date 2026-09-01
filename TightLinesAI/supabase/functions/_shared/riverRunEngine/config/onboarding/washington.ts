import type {
  AuditedRiverRunProfile,
  BaselineCoverage,
  FishabilityBands,
  HistoricalPresenceConfig,
  RiverProfile,
  RiverRunConfigurationDocument,
} from "../../types.ts";
import { getMovementEngineDefinition } from "../movementEngines.ts";
import { withSeasonalZonePlan } from "../seasonalZonePlans.ts";
import {
  PACIFIC_FALL_CHINOOK_BIOLOGY_PROFILE,
  PACIFIC_FALL_COHO_BIOLOGY_PROFILE,
} from "../speciesBiology.ts";
import { GREEN_HISTORICAL_WATER_TEMPERATURE_NORMALS } from "./greenHistoricalTemperature.generated.ts";
import { PUYALLUP_HISTORICAL_WATER_TEMPERATURE_NORMALS } from "./puyallupHistoricalTemperature.generated.ts";
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

const WA_REGULATION_COPY =
  "Washington river salmon seasons and retention rules can change by reach and emergency rule. Check the current WDFW pamphlet, emergency rules, tribal closures, and posted access restrictions before fishing.";

export const GREEN_RIVER_PROFILE: RiverProfile = {
  riverId: "green",
  displayName: "Green/Duwamish River",
  state: "WA",
  region: "pacific_northwest",
  timezone: "America/Los_Angeles",
  mouthLat: 47.588,
  mouthLon: -122.343,
  hydraulicSources: [{
    sourceId: "green_auburn_usgs",
    provider: "USGS",
    siteId: "12113000",
    name: "Green River near Auburn, WA",
    role: "primary",
    primaryMetric: "flow_cfs",
    availableMetrics: ["flow_cfs", "gage_height_ft"],
    historyYearsAvailable: 39,
    maxAgeHours: 2,
    reachQuality: "good",
    reachNotes:
      "The station represents the Auburn/Big Soos mainstem reach. It does not represent the tidally affected Duwamish, the upper gorge, or the municipal watershed.",
  }],
  waterTemperatureSources: [],
  historicalWaterTemperatureSource: {
    sourceId: "green_auburn_historical_temperature",
    provider: "USGS",
    siteId: "12113000",
    name: "Green River near Auburn — discontinued historical sensor",
    historicalStartYear: 1981,
    historicalEndYear: 1986,
    windowRadiusDays: 3,
    baselineVersion:
      "green-auburn-approved-calendar-window-temperature-1981-1986-v1",
    reachNotes:
      "Historical-only Auburn/Big Soos mainstem context from a discontinued sensor. It is never today's temperature, a live trend, or a substitute for the tidal Duwamish or upper Green.",
    attribution:
      "U.S. Geological Survey approved annual water-data reports; exact published daily means are pooled within the selected calendar date ±3 days, never imputed, and each displayed average requires at least two qualifying years.",
    normals: GREEN_HISTORICAL_WATER_TEMPERATURE_NORMALS,
  },
  fishCountSources: [{
    sourceId: "green_soos_wdfw_returns",
    provider: "WDFW_ESCAPEMENT",
    facilityName: "Soos Creek Hatchery",
    observationType: "hatchery_return",
    eligibleSpecies: ["chinook_salmon", "coho_salmon"],
    sourceUrl: "https://wdfw.wa.gov/fishing/management/hatcheries/escapement",
    updateCadence: "weekly",
    maximumAgeHours: 240,
    preliminary: true,
    operatingSeason:
      "Fall spawning return cycle; facility dates vary by species and stock",
    representedReach: "Soos Creek facility near its Green River confluence",
    limitation:
      "Cumulative facility returns are not total Green/Duwamish abundance; fish can spawn or be harvested below the rack.",
    recapturePolicy:
      "Use reported adult/jack stock rows only; do not sum dispositions into returns.",
    attribution:
      "Washington Department of Fish and Wildlife In-Season Hatchery Escapement Report",
  }],
  weatherPoints: [{
    weatherPointId: "green_auburn_weather",
    lat: 47.31,
    lon: -122.11,
    role: "primary",
  }],
  foundation: {
    version: "green-wa-foundation-v1-owner-review",
    corridorLengthMiles: 40,
    downstreamTerminus:
      "Official Duwamish River mouth line at the southern tip of Harbor Island",
    upstreamTerminus:
      "Tacoma municipal watershed boundary below the Headworks diversion",
    targetSpecies: ["chinook_salmon", "coho_salmon"],
    reaches: [
      {
        reachId: "green_lower_duwamish",
        displayName: "Lower Duwamish — Harbor Island to Tukwila",
        order: 1,
        role: "downstream",
        gaugeRepresented: false,
        notes:
          "Tidally affected lower-river entry corridor; the Auburn gauge is not extrapolated here.",
        sourceNotes: "WDFW 2026-27 permanent rules and USGS 12113390 metadata.",
      },
      {
        reachId: "green_middle_auburn",
        displayName: "Middle Green — Tukwila to Highway 18/Auburn",
        order: 2,
        role: "middle",
        gaugeRepresented: true,
        notes:
          "Includes the Big Soos junction and Auburn gauge reach. Reach-specific closures and retention rules still apply.",
        sourceNotes:
          "WDFW 2026-27 rules, King County watershed material, USGS 12113000.",
      },
      {
        reachId: "green_upper_accessible",
        displayName:
          "Upper Green — Auburn-Black Diamond Road to watershed boundary",
        order: 3,
        role: "terminal",
        gaugeRepresented: false,
        notes:
          "Biological corridor below Tacoma Headworks. The Highway 18-to-Auburn-Black Diamond Road section is a regulatory gap and is not implied to be open fishing water.",
        sourceNotes:
          "WDFW 2026-27 rules, King County, and USACE Howard Hanson passage status.",
      },
    ],
    locations: [{
      locationId: "green_tacoma_headworks",
      officialName:
        "Tacoma Headworks diversion and municipal watershed boundary",
      aliases: ["Tacoma diversion dam", "Headworks"],
      state: "WA",
      latitude: 47.205,
      longitude: -121.996,
      coordinateSource: "USACE Howard Hanson project mapping; orientation only",
      coordinateStatus: "provisional",
      reachId: "green_upper_accessible",
      kind: "barrier",
      fishPassage: "limited",
      publicUpstreamLimit: true,
      publicAccess: "not_public",
      fishingSuitability: { bank: "no", wading: "no", boat: "no" },
      beginnerSuitable: false,
      restrictionNotes:
        "The municipal watershed is closed to public entry. Upstream adult trap-and-haul does not establish a continuous public migration corridor; downstream passage at Howard Hanson remains incomplete.",
      sourceNotes:
        "USACE Howard Hanson Additional Water Storage Project, accessed 2026-08-30.",
    }],
    primaryGaugeReachId: "green_middle_auburn",
    contextualGaugeSiteIds: ["12113390"],
    weatherStrategy: {
      mode: "single_point",
      primaryWeatherPointId: "green_auburn_weather",
      basinRepresentation:
        "Modeled Auburn weather provides broad lower/middle-corridor light and precipitation context only.",
      sourceNotes:
        "Open-Meteo production provider; point selected at the accepted hydraulic reach.",
    },
    stateRegulations: [{
      state: "WA",
      version: "washington-2026-27-permanent-plus-emergency",
      jurisdiction: "WDFW Green/Duwamish River",
      reminderCopy: WA_REGULATION_COPY,
      accessAndSafetyNotes:
        "The river contains closed sections, changing salmon-retention rules, tidal water, private property, and a closed municipal watershed. Section names are orientation only.",
      sourceNotes:
        "Washington WAC 220-312-040 as amended by WSR 26-13-052 and current WDFW emergency-rule index; recheck immediately before release.",
    }],
    evidenceNotes:
      "The product ends below the Tacoma municipal watershed. Howard Hanson/Headworks trap-and-haul is not presented as a continuous passage chain. Chinook and coho are independently calibrated; fish-count observations at Soos Creek are facility returns, not river abundance.",
  },
  conditionRefreshSchedule: {
    activeSlots: ACTIVE_SLOTS,
    inactiveSlots: ["00:00"],
    evidenceNotes:
      "USGS 12113000 reports 15-minute discharge and gage height. Its water-temperature record is discontinued; qualifying calendar-date ±3-day 1981-1986 archival averages are static context only.",
  },
  conditionDataCapabilities: {
    hydraulics: { status: "available" },
    waterTemperature: {
      status: "unavailable",
      notes:
        "USGS 12113000 returned no current parameter 00010 observations. Where archival coverage qualifies, the app may show an explicitly historical same-calendar-date ±3-day average only.",
    },
  },
  supportStatus: "beta",
  gaugeLimitationCopy:
    "Flow and height are live near Auburn and describe that mainstem reach. The lower Duwamish is tidal, the upper river can differ, and there is no live representative water-temperature sensor; any temperature shown is a 1981-1986 historical same-calendar-date ±3-day average, not today's reading.",
  regulationReminderCopy: WA_REGULATION_COPY,
};

export const PUYALLUP_RIVER_PROFILE: RiverProfile = {
  riverId: "puyallup",
  displayName: "Puyallup River",
  state: "WA",
  region: "pacific_northwest",
  timezone: "America/Los_Angeles",
  mouthLat: 47.278,
  mouthLon: -122.43,
  hydraulicSources: [{
    sourceId: "puyallup_puyallup_usgs",
    provider: "USGS",
    siteId: "12101500",
    name: "Puyallup River at Puyallup, WA",
    role: "primary",
    primaryMetric: "flow_cfs",
    availableMetrics: ["flow_cfs", "gage_height_ft"],
    historyYearsAvailable: 38,
    maxAgeHours: 2,
    reachQuality: "good",
    reachNotes:
      "The station is at river mile 6.6, just upstream of Clarks Creek, and represents the lower mainstem. It does not represent the Carbon confluence or reaches above it.",
  }],
  waterTemperatureSources: [],
  historicalWaterTemperatureSource: {
    sourceId: "puyallup_ecology_historical_temperature",
    provider: "WA_ECOLOGY",
    siteId: "10A040",
    name: "Puyallup R @ USGS Puyallup — inactive Ecology sensor",
    historicalStartYear: 2023,
    historicalEndYear: 2025,
    windowRadiusDays: 3,
    baselineVersion:
      "puyallup-ecology-provisional-calendar-window-temperature-2023-2025-v1",
    reachNotes:
      "Historical-only lower-mainstem context from Ecology station 10A040 at the Puyallup USGS site. The station is currently inactive, coverage is limited, and this is never today's temperature or a reading for the Carbon confluence.",
    attribution:
      "Washington Department of Ecology published mean-daily tables; only good provisional or good provisional edited values are pooled within the selected calendar date ±3 days, never imputed, and each displayed average requires two qualifying years.",
    normals: PUYALLUP_HISTORICAL_WATER_TEMPERATURE_NORMALS,
  },
  fishCountSources: [{
    sourceId: "puyallup_voights_wdfw_returns",
    provider: "WDFW_ESCAPEMENT",
    facilityName: "Voights Creek Hatchery",
    reportFacilityName: "VOIGHTS CR HATCHERY",
    observationType: "hatchery_return",
    eligibleSpecies: ["chinook_salmon", "coho_salmon"],
    sourceUrl: "https://wdfw.wa.gov/fishing/management/hatcheries/escapement",
    updateCadence: "weekly",
    maximumAgeHours: 240,
    preliminary: true,
    operatingSeason:
      "Fall spawning return cycle; facility dates vary by species and stock",
    representedReach: "Voights Creek Hatchery in the Puyallup basin",
    limitation:
      "Cumulative hatchery returns are not a census of the Puyallup River or fish available to anglers.",
    recapturePolicy:
      "Preserve origin/stock and adult/jack rows; never add dispositions to the return total.",
    attribution:
      "Washington Department of Fish and Wildlife In-Season Hatchery Escapement Report",
  }],
  weatherPoints: [{
    weatherPointId: "puyallup_lower_weather",
    lat: 47.19,
    lon: -122.32,
    role: "primary",
  }],
  foundation: {
    version: "puyallup-wa-foundation-v1-owner-review",
    corridorLengthMiles: 26,
    downstreamTerminus: "11th Street Bridge official river mouth",
    upstreamTerminus: "Carbon River confluence",
    targetSpecies: ["chinook_salmon", "coho_salmon"],
    reaches: [
      {
        reachId: "puyallup_lower",
        displayName: "Lower Puyallup — 11th Street Bridge to Clarks Creek",
        order: 1,
        role: "downstream",
        gaugeRepresented: true,
        notes:
          "Glacial lower mainstem and accepted gauge reach. The 400-foot Clarks Creek closure is excluded from fishing guidance.",
        sourceNotes: "WDFW 2026-27 rules and USGS 12101500 metadata.",
      },
      {
        reachId: "puyallup_middle",
        displayName: "Middle Puyallup — Clarks Creek to East Main",
        order: 2,
        role: "middle",
        gaugeRepresented: false,
        notes:
          "Reach-specific days, night closure, anti-snagging, and salmon rules apply.",
        sourceNotes: "WDFW 2026-27 rules.",
      },
      {
        reachId: "puyallup_upper_salmon",
        displayName: "Upper salmon reach — East Main to Carbon River",
        order: 3,
        role: "terminal",
        gaugeRepresented: false,
        notes:
          "The current public salmon opportunity ends at the Carbon confluence even though the biological system continues upstream.",
        sourceNotes:
          "WDFW 2026-27 rules and Puyallup Tribal Fisheries watershed description.",
      },
    ],
    primaryGaugeReachId: "puyallup_lower",
    contextualGaugeSiteIds: ["12093500"],
    weatherStrategy: {
      mode: "single_point",
      primaryWeatherPointId: "puyallup_lower_weather",
      basinRepresentation:
        "Modeled lower-valley weather supplies broad light and precipitation context; it does not infer glacier runoff, turbidity, or water temperature.",
      sourceNotes: "Open-Meteo production provider; lower-corridor point.",
    },
    stateRegulations: [{
      state: "WA",
      version: "washington-2026-27-permanent-plus-emergency",
      jurisdiction: "WDFW Puyallup River",
      reminderCopy: WA_REGULATION_COPY,
      accessAndSafetyNotes:
        "Days open, retention, barbless hooks, anti-snagging, night closure, and the Clarks Creek exclusion vary by date/reach. Glacial flow and levees add hazards.",
      sourceNotes:
        "Washington WAC 220-312-040 as amended by WSR 26-13-052 and current WDFW emergency-rule index; recheck at release.",
    }],
    evidenceNotes:
      "The lower public salmon corridor ends at the Carbon River under current permanent rules. Voights Creek returns are a facility sample and may include hatchery/natural origin and disposition categories; they are not a whole-river census.",
  },
  conditionRefreshSchedule: {
    activeSlots: ACTIVE_SLOTS,
    inactiveSlots: ["00:00"],
    evidenceNotes:
      "USGS 12101500 reports 15-minute discharge and gage height. Ecology 10A040 at the same site is currently inactive; qualifying 2023-2025 calendar-date ±3-day averages are static context only.",
  },
  conditionDataCapabilities: {
    hydraulics: { status: "available" },
    waterTemperature: {
      status: "unavailable",
      notes:
        "USGS 12101500 returned no current parameter 00010 observations. Where the limited Ecology 10A040 archive has two qualifying years, the app may show an explicitly historical calendar-date ±3-day average only.",
    },
  },
  supportStatus: "beta",
  gaugeLimitationCopy:
    "Flow and height are live in the lower river at Puyallup, just upstream of Clarks Creek. They do not represent the Carbon confluence. There is no live representative water-temperature sensor; any temperature shown is a limited 2023-2025 historical calendar-date ±3-day average from a currently inactive Ecology station, not today's reading.",
  regulationReminderCopy: WA_REGULATION_COPY,
};

export const COWLITZ_RIVER_PROFILE: RiverProfile = {
  riverId: "cowlitz",
  displayName: "Cowlitz River",
  state: "WA",
  region: "pacific_northwest",
  timezone: "America/Los_Angeles",
  mouthLat: 46.102,
  mouthLon: -122.91,
  hydraulicSources: [
    {
      sourceId: "cowlitz_castle_rock_usgs",
      provider: "USGS",
      siteId: "14243000",
      name: "Cowlitz River at Castle Rock, WA",
      role: "primary",
      primaryMetric: "flow_cfs",
      availableMetrics: ["flow_cfs", "gage_height_ft"],
      historyYearsAvailable: 99,
      maxAgeHours: 2,
      reachQuality: "good",
      reachNotes:
        "Castle Rock represents the lower mainstem after major tributary inputs. It does not represent the Barrier Dam tailwater or project releases before downstream tributaries join.",
    },
    {
      sourceId: "cowlitz_below_mayfield_usgs",
      provider: "USGS",
      siteId: "14238000",
      name: "Cowlitz River below Mayfield Dam, WA",
      role: "upstream_context",
      primaryMetric: "flow_cfs",
      availableMetrics: ["flow_cfs", "gage_height_ft"],
      historyYearsAvailable: 75,
      maxAgeHours: 2,
      reachQuality: "acceptable",
      reachNotes:
        "Project-release context 1.1 miles upstream of Barrier Dam. It is not the primary lower-river reading and may change rapidly with hydropower operations.",
    },
  ],
  waterTemperatureSources: [],
  fishCountSources: [{
    sourceId: "cowlitz_separator_tpu_recoveries",
    provider: "TACOMA_POWER",
    facilityName: "Cowlitz Salmon Hatchery Adult Separator",
    observationType: "separator_recovery",
    eligibleSpecies: ["chinook_salmon", "coho_salmon", "steelhead"],
    sourceUrl:
      "https://www.mytpu.org/community-environment-parks/hydropower-natural-resources/cowlitz-river-project/cowlitz-fish-report/",
    updateCadence: "weekly",
    maximumAgeHours: 240,
    preliminary: true,
    operatingSeason:
      "Species-specific recurring run windows published in the weekly tables",
    representedReach:
      "Barrier Dam adult separator at the upstream end of the lower-river corridor",
    limitation:
      "Separator recoveries omit fish below the facility and harvest below it; they are not total lower-river abundance.",
    recapturePolicy:
      "Use Total Returns only. Recycling and destination/disposition columns can contain recaptures and must not be summed.",
    attribution:
      "Tacoma Power Cowlitz Fish Report and Weekly Adult Collection Totals",
  }],
  weatherPoints: [{
    weatherPointId: "cowlitz_castle_rock_weather",
    lat: 46.28,
    lon: -122.91,
    role: "primary",
  }],
  foundation: {
    version: "cowlitz-wa-foundation-v1-owner-review",
    corridorLengthMiles: 51,
    downstreamTerminus:
      "Official mouth boundary one-half mile downstream of the lowermost railroad bridge",
    upstreamTerminus: "Barrier Dam adult separator exclusion boundary",
    targetSpecies: ["chinook_salmon", "coho_salmon"],
    reaches: [
      {
        reachId: "cowlitz_lower",
        displayName: "Lower Cowlitz — mouth to Lexington",
        order: 1,
        role: "downstream",
        gaugeRepresented: true,
        notes:
          "Castle Rock supplies lower-mainstem hydraulics, not whole-corridor conditions.",
        sourceNotes: "WDFW 2026-27 rules and USGS 14243000 metadata.",
      },
      {
        reachId: "cowlitz_middle",
        displayName: "Middle Cowlitz — Lexington to Mill Creek",
        order: 2,
        role: "middle",
        gaugeRepresented: false,
        notes:
          "A long regulated mainstem reach with tributary influence downstream of the project.",
        sourceNotes:
          "WDFW 2026-27 rules and Tacoma Power Cowlitz project material.",
      },
      {
        reachId: "cowlitz_barrier_reach",
        displayName: "Barrier reach — Mill Creek to Barrier Dam",
        order: 3,
        role: "terminal",
        gaugeRepresented: false,
        notes:
          "Adults are diverted into the separator. The posted dam/intake exclusion is outside guidance; transported fish above the project are a separate management context.",
        sourceNotes:
          "WDFW 2026-27 rules and Tacoma Power Cowlitz Salmon Hatchery description.",
      },
    ],
    locations: [{
      locationId: "cowlitz_barrier_dam",
      officialName: "Cowlitz Salmon Hatchery Barrier Dam and Adult Separator",
      aliases: ["Barrier Dam", "Cowlitz adult separator"],
      state: "WA",
      latitude: 46.515,
      longitude: -122.63,
      coordinateSource:
        "Tacoma Power Cowlitz project mapping; orientation only",
      coordinateStatus: "provisional",
      riverMile: 49.9,
      reachId: "cowlitz_barrier_reach",
      kind: "barrier",
      fishPassage: "limited",
      publicUpstreamLimit: true,
      publicAccess: "restricted",
      fishingSuitability: { bank: "limited", wading: "no", boat: "no" },
      beginnerSuitable: false,
      restrictionNotes:
        "All returning adults are diverted to the separator; transport destinations and recaptures must not be presented as natural continuous passage. Obey the posted 400-foot/1,700-foot exclusion boundaries.",
      sourceNotes:
        "Tacoma Power Cowlitz Fisheries Programs and WDFW 2026-27 rules.",
    }],
    primaryGaugeReachId: "cowlitz_lower",
    contextualGaugeSiteIds: ["14238000"],
    weatherStrategy: {
      mode: "single_point",
      primaryWeatherPointId: "cowlitz_castle_rock_weather",
      basinRepresentation:
        "Modeled Castle Rock weather supplies broad lower-corridor light and precipitation context only.",
      sourceNotes:
        "Open-Meteo production provider; point near the accepted primary gauge.",
    },
    stateRegulations: [{
      state: "WA",
      version: "washington-2026-27-permanent-plus-emergency",
      jurisdiction: "WDFW Cowlitz River",
      reminderCopy: WA_REGULATION_COPY,
      accessAndSafetyNotes:
        "Rules differ below Lexington, Mill Creek, Barrier Dam, and above the project. Dam operations can change flow quickly; section names do not establish safe access.",
      sourceNotes:
        "Washington WAC 220-312-030 as amended by WSR 26-13-052 and current WDFW emergency-rule index; recheck at release.",
    }],
    evidenceNotes:
      "Barrier Dam ends the continuous lower-river migration model. Tacoma Power separator totals are adult recoveries, not total lower-river abundance; recycling and transport dispositions require duplicate-aware interpretation.",
  },
  conditionRefreshSchedule: {
    activeSlots: ACTIVE_SLOTS,
    inactiveSlots: ["00:00"],
    evidenceNotes:
      "USGS 14243000 and 14238000 report 15-minute discharge and gage height. The Castle Rock station is primary; the project station is context only.",
  },
  conditionDataCapabilities: {
    hydraulics: { status: "available" },
    waterTemperature: {
      status: "unavailable",
      notes:
        "Neither accepted USGS mainstem station returned parameter 00010 observations. Tacoma Power's weekly temperature is context, not an hourly live Activity sensor.",
    },
  },
  supportStatus: "beta",
  gaugeLimitationCopy:
    "The primary flow and height reading is at Castle Rock. Below-Mayfield flow is separate project context, and neither station provides live water temperature.",
  regulationReminderCopy: WA_REGULATION_COPY,
};

const capabilities: AuditedRiverRunProfile["primitiveCapabilities"] = {
  migrationStage: { status: "available" },
  activity: { status: "available" },
  fishInRiver: { status: "available" },
  fishability: {
    status: "unavailable",
    reason: "no_accepted_historical_baseline",
    notes:
      "Hydraulics are visible, but no owner-accepted absolute Fishing Shape bands exist yet.",
  },
  migrationTiming: {
    status: "unavailable",
    reason: "no_accepted_historical_baseline",
    notes:
      "The current product does not expose a live migration-timing primitive.",
  },
  push: {
    status: "unavailable",
    reason: "no_accepted_water_temperature_source",
    notes:
      "The current product does not expose Push, and no representative live water-temperature source is accepted.",
  },
};

const GREEN_CAPABILITIES: AuditedRiverRunProfile["primitiveCapabilities"] = {
  ...capabilities,
  fishability: { status: "available" },
};

const PUYALLUP_CAPABILITIES: AuditedRiverRunProfile["primitiveCapabilities"] = {
  ...capabilities,
  fishability: { status: "available" },
};

const COWLITZ_CAPABILITIES: AuditedRiverRunProfile["primitiveCapabilities"] = {
  ...capabilities,
  fishability: { status: "available" },
};

const GREEN_FISHABILITY: FishabilityBands = {
  version: "green-auburn-fishability-v1-owner-review",
  metric: "flow_cfs",
  sourceLabel: "Auburn / Big Soos mainstem reach",
  tooLow: { max: 230 },
  lowFishable: { min: 230, max: 290 },
  ideal: { min: 290, max: 1000 },
  highFishable: { min: 1000, max: 3000 },
  blownOut: { min: 6800 },
  caps: {
    staleGauge: 55,
    unknownTrend: 49,
    veryLow: 45,
    blownOut: 24,
    sharpRiseHigh: 40,
  },
  evidenceNotes:
    "Accepted owner-review calibration from the July 20-December 15 USGS 12113000 approved daily-discharge distribution for water years 1988-2025: p5 231, p25 291, median 420, p75 1,000, p95 3,000, and p99 6,834 CFS. Rounded fixed bands describe presentation shape near Auburn/Big Soos only; they are not access, safety, abundance, or tidal-lower-river thresholds.",
  sourceNotes:
    "USGS 12113000 approved daily values, 1988-2025 fall union, audited 2026-08-31; public fishing-access scope corroborated by City of Auburn Fenster Nature Park and City of Kent Three Friends Fishing Hole records.",
};

const GREEN_BASELINE: BaselineCoverage = {
  metric: "flow_cfs",
  version: "green-auburn-1988-2025-fall-v1",
  hasPercentileBaselines: true,
  coveredWindowPercent: 1,
  minimumHistoryYears: 38,
  sourceNotes:
    "USGS 12113000 approved daily discharge covers all 5,662 dates in the July 20-December 15 union across water years 1988-2025.",
};

const PUYALLUP_FISHABILITY: FishabilityBands = {
  version: "puyallup-clarks-fishability-v1-owner-review",
  metric: "flow_cfs",
  sourceLabel: "Puyallup / Clarks lower-mainstem reach",
  tooLow: { max: 940 },
  lowFishable: { min: 940, max: 1380 },
  ideal: { min: 1380, max: 2620 },
  highFishable: { min: 2620, max: 5330 },
  blownOut: { min: 11900 },
  caps: {
    staleGauge: 55,
    unknownTrend: 49,
    veryLow: 45,
    blownOut: 24,
    sharpRiseHigh: 40,
  },
  evidenceNotes:
    "Accepted owner-review calibration from the July 15-December 5 USGS 12101500 approved daily-discharge distribution for 1988-2025: p5 935, p25 1,380, median 1,850, p75 2,620, p95 5,335, and p99 11,858 CFS. Rounded fixed bands describe presentation shape in the lower mainstem near Puyallup/Clarks only; they are not turbidity, access, safety, abundance, or upper-river thresholds.",
  sourceNotes:
    "USGS 12101500 approved daily values, 1988-2025 Chinook/coho seasonal union, audited 2026-08-31; scope is limited to the gauge-represented lower mainstem.",
};

const PUYALLUP_BASELINE: BaselineCoverage = {
  metric: "flow_cfs",
  version: "puyallup-clarks-1988-2025-fall-v1",
  hasPercentileBaselines: true,
  coveredWindowPercent: 1,
  minimumHistoryYears: 38,
  sourceNotes:
    "USGS 12101500 approved daily discharge covers all 5,472 dates in the July 15-December 5 union across 1988-2025.",
};

const COWLITZ_FISHABILITY: FishabilityBands = {
  version: "cowlitz-castle-rock-fishability-v1-owner-review",
  metric: "flow_cfs",
  sourceLabel: "Castle Rock lower-mainstem reach",
  tooLow: { max: 2840 },
  lowFishable: { min: 2840, max: 3830 },
  ideal: { min: 3830, max: 12200 },
  highFishable: { min: 12200, max: 21500 },
  blownOut: { min: 34100 },
  caps: {
    staleGauge: 55,
    unknownTrend: 49,
    veryLow: 45,
    blownOut: 24,
    sharpRiseHigh: 40,
  },
  evidenceNotes:
    "Accepted owner-review calibration from the July 15-February 15 USGS 14243000 approved daily-discharge distribution for the complete modern 2001-2025 record: p5 2,840, p25 3,830, median 5,860, p75 12,200, p95 21,500, and p99 34,100 CFS. Rounded fixed bands describe presentation shape near Castle Rock below the Toutle only; they are not Barrier-tailwater, dam-release safety, access, abundance, or catch thresholds.",
  sourceNotes:
    "USGS 14243000 approved daily values, complete 2001-2025 Chinook/coho seasonal union, audited 2026-08-31; the 1985-2000 seasonal-record interval was excluded from calibration.",
};

const COWLITZ_BASELINE: BaselineCoverage = {
  metric: "flow_cfs",
  version: "cowlitz-castle-rock-2001-2025-fall-winter-v1",
  hasPercentileBaselines: true,
  coveredWindowPercent: 1,
  minimumHistoryYears: 25,
  sourceNotes:
    "USGS 14243000 approved daily discharge covers all 5,400 dates in the July 15-February 15 union across 2001-2025; the station's documented 1985-2000 seasonal interval is not mixed into this baseline.",
};

function presence(
  maximum: HistoricalPresenceConfig["maximum"],
  distributionScope: HistoricalPresenceConfig["distributionScope"],
  version: string,
  anchors: HistoricalPresenceConfig["anchors"],
  evidenceNotes: string,
  sourceNotes: string,
): HistoricalPresenceConfig {
  return {
    maximum,
    distributionScope,
    curveVersion: version,
    anchors,
    evidenceNotes,
    sourceNotes,
  };
}

function weatherActivity(input: {
  riverId: "green" | "puyallup" | "cowlitz";
  species: "chinook" | "coho";
  reaches: string[];
  weatherPointId: string;
  peakEnd: string;
  taperingEnd: string;
  lateEnd: string;
}) {
  const speciesLabel = input.species === "chinook" ? "Chinook" : "Coho";
  return buildWeatherOnlyActivity({
    version:
      `${input.riverId}-fall-${input.species}-weather-activity-v1-owner-review`,
    profile: input.species === "chinook"
      ? "chinook_fall_reaction"
      : "coho_fall_reaction",
    reachIds: input.reaches,
    weatherPointId: input.weatherPointId,
    inputNotes:
      "The accepted USGS gauge remains visible in Gauge Read, but no compatible representative live water temperature exists. Hydraulics and historical temperature context are excluded from Activity.",
    scopeCopy:
      `This Limited weather-only read estimates conditional ${speciesLabel} responsiveness from modeled light and same-block precipitation. It does not measure water temperature, river response, movement, abundance, or whether anglers will catch fish.`,
    stageResponseAdjustment: { pre_run: -5, beginning: -5 },
    lifecycle: {
      peakEnd: input.peakEnd,
      taperingEnd: input.taperingEnd,
      endingEnd: input.lateEnd,
    },
    evidenceNotes:
      "Owner-review calibration uses only the existing weather-only mechanics. No flow trend, Push, Migration Timing, facility count, or historical temperature contributes to the score.",
  });
}

const hiddenAudit = {
  isEnabled: false,
  auditVersion: "washington-six-run-owner-review-v1",
  notes:
    "Research/configuration candidate only. Public audit remains intentionally disabled until replay, rendered owner acceptance, regulation recheck, and explicit release authorization.",
};

export const GREEN_FALL_CHINOOK_RUN_PROFILE: AuditedRiverRunProfile = {
  runId: "green_fall_chinook",
  riverId: "green",
  biologyProfileId: "pacific_fall_chinook_v1",
  displayName: "Fall Chinook",
  species: "chinook_salmon",
  season: "fall",
  runType: "fall_spawn",
  movementEngineId: "fall_cooling",
  runStageCopyStrategy: "onboarding_corridor",
  primitiveCapabilities: GREEN_CAPABILITIES,
  fishabilityBands: GREEN_FISHABILITY,
  baselineCoverage: GREEN_BASELINE,
  runWindow: {
    preRunStart: "06-20",
    stagingStart: "07-10",
    start: "07-20",
    beginningEnd: "08-19",
    buildingEstablishedStart: "08-20",
    buildingBroadStart: "09-01",
    peakStart: "09-10",
    peak: "09-20",
    peakEnd: "10-05",
    taperingEnd: "10-25",
    end: "11-05",
    lateEnd: "11-15",
    postRunLateCopyEnd: "11-20",
  },
  historicalPresence: presence(
    7,
    "broad",
    "green-chinook-presence-v1-owner-review",
    [
      { dayOffsetFromStart: 0, fractionOfMaximum: .05 },
      { dayOffsetFromStart: 31, fractionOfMaximum: .25 },
      { dayOffsetFromStart: 52, fractionOfMaximum: .65 },
      { dayOffsetFromStart: 62, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 77, fractionOfMaximum: .85 },
      { dayOffsetFromStart: 97, fractionOfMaximum: .4 },
      { dayOffsetFromStart: 108, fractionOfMaximum: .1 },
      { dayOffsetFromStart: 118, fractionOfMaximum: 0 },
    ],
    "Conservative river-specific curve: WDFW places entry beginning in July; King County passage evidence spans mid-August-November; current WDFW management places spawning mid-September-early November.",
    "WDFW Green River Chinook management plan; King County fish-passage report; Soos Creek weekly/final hatchery returns as facility-only calibration.",
  ),
  activity: weatherActivity({
    riverId: "green",
    species: "chinook",
    reaches: [
      "green_lower_duwamish",
      "green_middle_auburn",
      "green_upper_accessible",
    ],
    weatherPointId: "green_auburn_weather",
    peakEnd: "10-05",
    taperingEnd: "10-25",
    lateEnd: "11-15",
  }),
  researchNotes:
    "Hidden Washington owner-review candidate. Soos counts never alter Stage, Presence, or Activity.",
  sourceNotes: "docs/onboarding/river-run/green/river-onboarding.md",
  publicAudit: hiddenAudit,
};

export const GREEN_FALL_COHO_RUN_PROFILE: AuditedRiverRunProfile = {
  ...GREEN_FALL_CHINOOK_RUN_PROFILE,
  runId: "green_fall_coho",
  biologyProfileId: "pacific_fall_coho_v1",
  displayName: "Fall Coho",
  species: "coho_salmon",
  runWindow: {
    preRunStart: "07-20",
    stagingStart: "08-10",
    start: "08-20",
    beginningEnd: "09-04",
    buildingEstablishedStart: "09-05",
    buildingBroadStart: "09-15",
    peakStart: "09-20",
    peak: "10-05",
    peakEnd: "10-25",
    taperingEnd: "11-15",
    end: "12-01",
    lateEnd: "12-15",
    postRunLateCopyEnd: "12-20",
  },
  historicalPresence: presence(
    8,
    "broad",
    "green-coho-presence-v1-owner-review",
    [
      { dayOffsetFromStart: 0, fractionOfMaximum: .05 },
      { dayOffsetFromStart: 16, fractionOfMaximum: .25 },
      { dayOffsetFromStart: 31, fractionOfMaximum: .55 },
      { dayOffsetFromStart: 46, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 66, fractionOfMaximum: .85 },
      { dayOffsetFromStart: 87, fractionOfMaximum: .45 },
      { dayOffsetFromStart: 103, fractionOfMaximum: .15 },
      { dayOffsetFromStart: 117, fractionOfMaximum: 0 },
    ],
    "Conservative curve follows documented mid-August-December migration and modern Soos Creek cumulative returns, with a broad September-October core.",
    "King County fish-passage report; WDFW Soos Creek coho HGMP and weekly/final escapement reports.",
  ),
  activity: weatherActivity({
    riverId: "green",
    species: "coho",
    reaches: [
      "green_lower_duwamish",
      "green_middle_auburn",
      "green_upper_accessible",
    ],
    weatherPointId: "green_auburn_weather",
    peakEnd: "10-25",
    taperingEnd: "11-15",
    lateEnd: "12-15",
  }),
};

export const PUYALLUP_FALL_CHINOOK_RUN_PROFILE: AuditedRiverRunProfile = {
  ...GREEN_FALL_CHINOOK_RUN_PROFILE,
  runId: "puyallup_fall_chinook",
  riverId: "puyallup",
  displayName: "Fall Chinook",
  primitiveCapabilities: PUYALLUP_CAPABILITIES,
  fishabilityBands: PUYALLUP_FISHABILITY,
  baselineCoverage: PUYALLUP_BASELINE,
  seasonalZoneReachIds: [
    "puyallup_lower",
    "puyallup_middle",
    "puyallup_upper_salmon",
  ],
  runWindow: {
    preRunStart: "06-20",
    stagingStart: "07-01",
    start: "07-15",
    beginningEnd: "07-31",
    buildingEstablishedStart: "08-01",
    buildingBroadStart: "08-15",
    peakStart: "08-20",
    peak: "09-01",
    peakEnd: "09-20",
    taperingEnd: "10-01",
    end: "10-15",
    lateEnd: "10-25",
    postRunLateCopyEnd: "10-31",
  },
  historicalPresence: presence(
    8,
    "broad",
    "puyallup-chinook-presence-v1-owner-review",
    [
      { dayOffsetFromStart: 0, fractionOfMaximum: .05 },
      { dayOffsetFromStart: 17, fractionOfMaximum: .25 },
      { dayOffsetFromStart: 32, fractionOfMaximum: .6 },
      { dayOffsetFromStart: 48, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 67, fractionOfMaximum: .75 },
      { dayOffsetFromStart: 78, fractionOfMaximum: .35 },
      { dayOffsetFromStart: 92, fractionOfMaximum: .08 },
      { dayOffsetFromStart: 102, fractionOfMaximum: 0 },
    ],
    "Voights and Clarks collection programs operate July-October; recent weekly Voights returns build sharply from early through late September. Calendar separates migration from the August 19 public opener.",
    "NOAA 2026 Puyallup hatchery-program PEPD; WDFW weekly/final Voights Creek reports; WDFW current rules.",
  ),
  activity: weatherActivity({
    riverId: "puyallup",
    species: "chinook",
    reaches: ["puyallup_lower", "puyallup_middle", "puyallup_upper_salmon"],
    weatherPointId: "puyallup_lower_weather",
    peakEnd: "09-20",
    taperingEnd: "10-01",
    lateEnd: "10-25",
  }),
  researchNotes:
    "Hidden lower-Puyallup salmon-corridor candidate. No guidance above the Carbon confluence.",
  sourceNotes: "docs/onboarding/river-run/puyallup/river-onboarding.md",
};

export const PUYALLUP_FALL_COHO_RUN_PROFILE: AuditedRiverRunProfile = {
  ...PUYALLUP_FALL_CHINOOK_RUN_PROFILE,
  runId: "puyallup_fall_coho",
  biologyProfileId: "pacific_fall_coho_v1",
  displayName: "Fall Coho",
  species: "coho_salmon",
  runWindow: {
    preRunStart: "07-25",
    stagingStart: "08-15",
    start: "08-25",
    beginningEnd: "09-09",
    buildingEstablishedStart: "09-10",
    buildingBroadStart: "09-20",
    peakStart: "09-25",
    peak: "10-05",
    peakEnd: "10-25",
    taperingEnd: "11-10",
    end: "11-25",
    lateEnd: "12-05",
    postRunLateCopyEnd: "12-10",
  },
  historicalPresence: presence(
    7,
    "broad",
    "puyallup-coho-presence-v1-owner-review",
    [
      { dayOffsetFromStart: 0, fractionOfMaximum: .05 },
      { dayOffsetFromStart: 16, fractionOfMaximum: .25 },
      { dayOffsetFromStart: 31, fractionOfMaximum: .7 },
      { dayOffsetFromStart: 42, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 62, fractionOfMaximum: .8 },
      { dayOffsetFromStart: 78, fractionOfMaximum: .4 },
      { dayOffsetFromStart: 93, fractionOfMaximum: .12 },
      { dayOffsetFromStart: 102, fractionOfMaximum: 0 },
    ],
    "Voights coho collection is concentrated in fall, with recent weekly reports showing substantial returns by late September/October. The curve preserves a November tail without claiming facility totals census the river.",
    "NOAA 2026 Puyallup hatchery-program PEPD; WDFW weekly/final Voights Creek reports.",
  ),
  activity: weatherActivity({
    riverId: "puyallup",
    species: "coho",
    reaches: ["puyallup_lower", "puyallup_middle", "puyallup_upper_salmon"],
    weatherPointId: "puyallup_lower_weather",
    peakEnd: "10-25",
    taperingEnd: "11-10",
    lateEnd: "12-05",
  }),
};

export const COWLITZ_FALL_CHINOOK_RUN_PROFILE: AuditedRiverRunProfile = {
  ...GREEN_FALL_CHINOOK_RUN_PROFILE,
  runId: "cowlitz_fall_chinook",
  riverId: "cowlitz",
  displayName: "Fall Chinook",
  primitiveCapabilities: COWLITZ_CAPABILITIES,
  fishabilityBands: COWLITZ_FISHABILITY,
  baselineCoverage: COWLITZ_BASELINE,
  runWindow: {
    preRunStart: "07-01",
    stagingStart: "07-20",
    start: "08-01",
    beginningEnd: "08-14",
    buildingEstablishedStart: "08-15",
    buildingBroadStart: "08-25",
    peakStart: "09-01",
    peak: "09-15",
    peakEnd: "09-30",
    taperingEnd: "10-20",
    end: "11-15",
    lateEnd: "12-01",
    postRunLateCopyEnd: "12-10",
  },
  historicalPresence: presence(
    6,
    "broad",
    "cowlitz-fall-chinook-presence-v1-owner-review",
    [
      { dayOffsetFromStart: 0, fractionOfMaximum: .05 },
      { dayOffsetFromStart: 14, fractionOfMaximum: .3 },
      { dayOffsetFromStart: 31, fractionOfMaximum: .75 },
      { dayOffsetFromStart: 46, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 61, fractionOfMaximum: .8 },
      { dayOffsetFromStart: 81, fractionOfMaximum: .4 },
      { dayOffsetFromStart: 107, fractionOfMaximum: .12 },
      { dayOffsetFromStart: 122, fractionOfMaximum: 0 },
    ],
    "Tacoma Power explicitly defines the recurring fall-Chinook count season as August-December; weekly distributions and five-year comparisons support a September-weighted core.",
    "Tacoma Power Cowlitz weekly adult-collection tables/graphs; WDFW Cowlitz rules and NOAA Lower Columbia recovery context.",
  ),
  activity: weatherActivity({
    riverId: "cowlitz",
    species: "chinook",
    reaches: ["cowlitz_lower", "cowlitz_middle", "cowlitz_barrier_reach"],
    weatherPointId: "cowlitz_castle_rock_weather",
    peakEnd: "09-30",
    taperingEnd: "10-20",
    lateEnd: "12-01",
  }),
  researchNotes:
    "Hidden lower-Cowlitz candidate ending at Barrier Dam. Separator counts do not alter scored reads.",
  sourceNotes: "docs/onboarding/river-run/cowlitz/river-onboarding.md",
};

export const COWLITZ_FALL_COHO_RUN_PROFILE: AuditedRiverRunProfile = {
  ...COWLITZ_FALL_CHINOOK_RUN_PROFILE,
  runId: "cowlitz_fall_coho",
  biologyProfileId: "pacific_fall_coho_v1",
  displayName: "Fall Coho",
  species: "coho_salmon",
  runWindow: {
    preRunStart: "07-15",
    stagingStart: "08-01",
    start: "08-15",
    beginningEnd: "08-31",
    buildingEstablishedStart: "09-01",
    buildingBroadStart: "09-15",
    peakStart: "09-20",
    peak: "10-10",
    peakEnd: "10-31",
    taperingEnd: "11-30",
    end: "01-15",
    lateEnd: "02-01",
    postRunLateCopyEnd: "02-15",
  },
  historicalPresence: presence(
    9,
    "broad",
    "cowlitz-coho-presence-v1-owner-review",
    [
      { dayOffsetFromStart: 0, fractionOfMaximum: .05 },
      { dayOffsetFromStart: 17, fractionOfMaximum: .25 },
      { dayOffsetFromStart: 37, fractionOfMaximum: .65 },
      { dayOffsetFromStart: 57, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 78, fractionOfMaximum: .85 },
      { dayOffsetFromStart: 108, fractionOfMaximum: .5 },
      { dayOffsetFromStart: 153, fractionOfMaximum: .15 },
      { dayOffsetFromStart: 170, fractionOfMaximum: .05 },
    ],
    "Tacoma Power defines the coho return season from August into winter and publishes weekly hatchery/natural separator recoveries plus five-year comparisons. The long tail reflects observed facility timing, not equal opportunity throughout the corridor.",
    "Tacoma Power Cowlitz weekly adult-collection tables/graphs and fisheries program; NOAA Lower Columbia coho recovery plan.",
  ),
  activity: weatherActivity({
    riverId: "cowlitz",
    species: "coho",
    reaches: ["cowlitz_lower", "cowlitz_middle", "cowlitz_barrier_reach"],
    weatherPointId: "cowlitz_castle_rock_weather",
    peakEnd: "10-31",
    taperingEnd: "11-30",
    lateEnd: "02-01",
  }),
};

export const WASHINGTON_DRAFT_RIVERS = [
  GREEN_RIVER_PROFILE,
  PUYALLUP_RIVER_PROFILE,
  COWLITZ_RIVER_PROFILE,
];
export const WASHINGTON_DRAFT_RUNS = [
  GREEN_FALL_CHINOOK_RUN_PROFILE,
  GREEN_FALL_COHO_RUN_PROFILE,
  PUYALLUP_FALL_CHINOOK_RUN_PROFILE,
  PUYALLUP_FALL_COHO_RUN_PROFILE,
  COWLITZ_FALL_CHINOOK_RUN_PROFILE,
  COWLITZ_FALL_COHO_RUN_PROFILE,
].map(withSeasonalZonePlan);

function washingtonConfigurationDocument(
  river: RiverProfile,
): RiverRunConfigurationDocument {
  return {
    schemaVersion: "river-run-config-v1",
    configVersion: river.riverId === "green"
      ? "2026-08-31-green-washington-owner-review.2+seasonal-zone-v2"
      : `2026-08-31-${river.riverId}-washington-owner-review.2+seasonal-zone-v2`,
    movementEngineVersion: getMovementEngineDefinition("fall_cooling").version,
    river,
    biologyProfiles: [
      PACIFIC_FALL_CHINOOK_BIOLOGY_PROFILE,
      PACIFIC_FALL_COHO_BIOLOGY_PROFILE,
    ],
    runs: WASHINGTON_DRAFT_RUNS.filter((run) => run.riverId === river.riverId),
  };
}

export const GREEN_CONFIGURATION_DOCUMENT = washingtonConfigurationDocument(
  GREEN_RIVER_PROFILE,
);
export const PUYALLUP_CONFIGURATION_DOCUMENT = washingtonConfigurationDocument(
  PUYALLUP_RIVER_PROFILE,
);
export const COWLITZ_CONFIGURATION_DOCUMENT = washingtonConfigurationDocument(
  COWLITZ_RIVER_PROFILE,
);

export const WASHINGTON_DRAFT_CONFIGURATION_DOCUMENTS:
  RiverRunConfigurationDocument[] = [
    GREEN_CONFIGURATION_DOCUMENT,
    PUYALLUP_CONFIGURATION_DOCUMENT,
    COWLITZ_CONFIGURATION_DOCUMENT,
  ];
