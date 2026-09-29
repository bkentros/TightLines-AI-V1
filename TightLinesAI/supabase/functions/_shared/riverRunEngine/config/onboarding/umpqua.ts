import type {
  ActivityRules,
  AuditedRiverRunProfile,
  BaselineCoverage,
  FishabilityBands,
  HistoricalPresenceConfig,
  PushRules,
  RiverProfile,
  RiverRunConfigurationDocument,
  SeasonalZonePlan,
} from "../../types.ts";
import { buildDirectEventPushRules } from "../directPush.ts";
import { getMovementEngineDefinition } from "../movementEngines.ts";
import {
  PACIFIC_FALL_CHINOOK_BIOLOGY_PROFILE,
  PACIFIC_FALL_COHO_BIOLOGY_PROFILE,
} from "../speciesBiology.ts";

const ACTIVE_SLOTS = [
  "00:00",
  "04:00",
  "08:00",
  "12:00",
  "16:00",
  "20:00",
  "21:00",
];

const OR_REGULATION_COPY =
  "Umpqua salmon seasons, retention rules, gear restrictions, and reach closures can change in season. Check the current Oregon Southwest Zone regulations, regulation updates, posted closures, licenses, and site conditions before fishing.";

const ODFW_UPDATES_URL = "https://myodfw.com/articles/regulation-updates";

export const UMPQUA_MAINSTEM_RIVER_PROFILE: RiverProfile = {
  riverId: "umpqua_mainstem",
  displayName: "Umpqua River (Mainstem)",
  state: "OR",
  region: "pacific_northwest",
  timezone: "America/Los_Angeles",
  mouthLat: 43.669,
  mouthLon: -124.204,
  hydraulicSources: [{
    sourceId: "umpqua_mainstem_elkton_usgs",
    provider: "USGS",
    siteId: "14321000",
    name: "Umpqua River near Elkton, OR",
    role: "primary",
    primaryMetric: "flow_cfs",
    availableMetrics: ["flow_cfs", "gage_height_ft"],
    historyYearsAvailable: 121,
    maxAgeHours: 2,
    reachQuality: "good",
    reachNotes:
      "Measured in the middle mainstem near Elkton around river mile 56.9. It does not represent the tidal estuary, Winchester Bay, or the upper mainstem near River Forks.",
  }],
  waterTemperatureSources: [{
    sourceId: "umpqua_mainstem_elkton_temperature",
    provider: "USGS",
    siteId: "14321000",
    name: "Umpqua River near Elkton — measured water temperature",
    role: "primary",
    priority: 1,
    sourceType: "same_gauge",
    maxAgeHours: 2,
    smoothingWindowHours: 3,
    minValidF: 32,
    maxValidF: 86,
    maxRateChangeFPerHour: 4,
    maxPeerDifferenceF: 6,
    historicalStartYear: 1985,
    historicalEndYear: 2025,
    reachNotes:
      "Measured at Elkton in the middle mainstem. The split record has long gaps and only two complete recent fall seasons, so it is Gauge Read context and never an Activity or Push input for these runs.",
    attribution:
      "U.S. Geological Survey Water Data for the Nation; recent readings are provisional and subject to revision.",
  }],
  weatherPoints: [{
    weatherPointId: "umpqua_mainstem_elkton_weather",
    lat: 43.5859502208726,
    lon: -123.555372650329,
    role: "primary",
  }],
  foundation: {
    version: "umpqua-mainstem-foundation-v1-pass2-2026-09-28",
    corridorLengthMiles: 111.5,
    downstreamTerminus: "Visible jetty tips at Winchester Bay",
    upstreamTerminus: "North Umpqua/South Umpqua confluence at River Forks",
    targetSpecies: ["chinook_salmon", "coho_salmon"],
    reaches: [
      {
        reachId: "umpqua_mainstem_estuary_lower",
        displayName: "Umpqua Estuary & Lower River — jetties to Scottsburg",
        order: 1,
        role: "lower",
        gaugeRepresented: false,
        notes:
          "Visible jetty tips through Winchester Bay and the tidal lower river to Scottsburg Bridge/head of tide near river mile 28.",
        sourceNotes:
          "Oregon DSL Umpqua navigability notice, ODFW Southwest Zone, and Douglas County access records.",
      },
      {
        reachId: "umpqua_mainstem_middle_elkton",
        displayName: "Middle Umpqua — Scottsburg to Elkton",
        order: 2,
        role: "middle",
        gaugeRepresented: true,
        notes:
          "Scottsburg Bridge/head of tide to USGS 14321000 near river mile 56.9; this is the only hydraulically represented mainstem reach.",
        sourceNotes:
          "USGS 14321000 station metadata, Oregon DSL, and Douglas County access records.",
      },
      {
        reachId: "umpqua_mainstem_upper_forks",
        displayName: "Upper Mainstem — Elkton to River Forks",
        order: 3,
        role: "terminal",
        gaugeRepresented: false,
        notes:
          "USGS 14321000 to the North/South Umpqua confluence near river mile 111.5. North and South Umpqua are separate rivers and excluded here.",
        sourceNotes:
          "Oregon DSL river miles, ODFW Southwest Zone, and BLM Umpqua access material.",
      },
    ],
    locations: [
      {
        locationId: "umpqua_mainstem_scottsburg_county_park",
        officialName: "Scottsburg County Park",
        state: "OR",
        latitude: 43.6496619,
        longitude: -123.8390207,
        coordinateSource: "USGS GNIS feature 2668145",
        coordinateStatus: "verified",
        reachId: "umpqua_mainstem_estuary_lower",
        kind: "access",
        fishPassage: "not_applicable",
        publicAccess: "verified",
        fishingSuitability: { bank: "limited", wading: "unknown", boat: "yes" },
        beginnerSuitable: false,
        restrictionNotes:
          "Fishing and boat access are source-listed, but bank extent, wading conditions, parking, tides, and launch safety must be confirmed on site.",
        sourceNotes:
          "Douglas County Scottsburg County Park facility page and USGS GNIS.",
      },
      {
        locationId: "umpqua_mainstem_scott_creek_county_park",
        officialName: "Scott Creek County Park",
        state: "OR",
        latitude: 43.6735992,
        longitude: -123.6878898,
        coordinateSource: "USGS GNIS",
        coordinateStatus: "verified",
        reachId: "umpqua_mainstem_middle_elkton",
        kind: "access",
        fishPassage: "not_applicable",
        publicAccess: "verified",
        fishingSuitability: { bank: "limited", wading: "unknown", boat: "yes" },
        beginnerSuitable: false,
        restrictionNotes:
          "Fishing and boat access are source-listed; the listing is not a safe-wading or year-round launch assurance.",
        sourceNotes:
          "Douglas County Scott Creek County Park facility page and USGS GNIS.",
      },
      {
        locationId: "umpqua_mainstem_tyee_campground",
        officialName: "Tyee Campground — Umpqua River",
        state: "OR",
        latitude: 43.485025,
        longitude: -123.4842667,
        coordinateSource: "Bureau of Land Management",
        coordinateStatus: "verified",
        reachId: "umpqua_mainstem_upper_forks",
        kind: "access",
        fishPassage: "not_applicable",
        publicAccess: "verified",
        fishingSuitability: { bank: "limited", wading: "unknown", boat: "no" },
        beginnerSuitable: false,
        restrictionNotes:
          "BLM describes stairs to river access. Water level, wading, bank conditions, campground operations, and neighboring frontage remain unverified.",
        sourceNotes: "Bureau of Land Management Tyee Campground page.",
      },
      {
        locationId: "umpqua_mainstem_river_forks_limit",
        officialName: "River Forks — North/South Umpqua Confluence",
        state: "OR",
        latitude: 43.2712649,
        longitude: -123.4436747,
        coordinateSource: "USGS GNIS and Oregon Department of State Lands",
        coordinateStatus: "verified",
        reachId: "umpqua_mainstem_upper_forks",
        kind: "barrier",
        fishPassage: "not_applicable",
        publicUpstreamLimit: true,
        publicAccess: "restricted",
        fishingSuitability: { bank: "no", wading: "no", boat: "no" },
        beginnerSuitable: false,
        restrictionNotes:
          "Product-scope boundary only. This confluence marker is not a physical fish barrier, access recommendation, or fishing spot; North and South Umpqua are separate river products.",
        sourceNotes:
          "USGS GNIS confluence coordinates and Oregon DSL Umpqua river-mile framework.",
      },
    ],
    primaryGaugeReachId: "umpqua_mainstem_middle_elkton",
    contextualGaugeSiteIds: [],
    weatherStrategy: {
      mode: "single_point",
      primaryWeatherPointId: "umpqua_mainstem_elkton_weather",
      basinRepresentation:
        "Modeled weather near Elkton supports the represented middle reach only.",
      sourceNotes: "Open-Meteo point paired to USGS 14321000.",
    },
    stateRegulations: [{
      state: "OR",
      version: "oregon-southwest-zone-2026",
      jurisdiction: "Oregon DFW Southwest Zone and in-season updates",
      reminderCopy: OR_REGULATION_COPY,
      accessAndSafetyNotes:
        "Named public sites do not make adjoining frontage public. Tributary-mouth closures, health advisories, tides, launch conditions, and posted property boundaries must be checked independently.",
      sourceNotes:
        `ODFW Southwest Zone, fall coastal salmon management, and ${ODFW_UPDATES_URL}; recheck before release.`,
    }],
    evidenceNotes:
      "The scoped product is the Pacific mouth-to-River Forks mainstem only. Winchester Dam is on North Umpqua and cannot supply mainstem Fish Counts. No mainstem dam, weir, or recurring official counter passed the source audit.",
  },
  conditionRefreshSchedule: {
    activeSlots: ACTIVE_SLOTS,
    inactiveSlots: ["00:00"],
    evidenceNotes:
      "Flow, height, and measured temperature resolve independently at USGS 14321000. Activity and Push use flow plus weather only; measured temperature remains display context until five complete recent fall seasons pass replay.",
  },
  conditionDataCapabilities: {
    hydraulics: { status: "available" },
    waterTemperature: { status: "available" },
  },
  supportStatus: "beta",
  gaugeLimitationCopy:
    "Measured near Elkton in the middle mainstem—not in Winchester Bay, the tidal lower river, or the upper mainstem. Flow can describe Elkton workability and response only; it is not fish presence, abundance, access, or safety evidence. Temperature is shown as context and does not score these fall runs.",
  regulationReminderCopy: OR_REGULATION_COPY,
};

export const NORTH_UMPQUA_RIVER_PROFILE: RiverProfile = {
  riverId: "north_umpqua",
  displayName: "North Umpqua River",
  state: "OR",
  region: "pacific_northwest",
  timezone: "America/Los_Angeles",
  mouthLat: 43.2712649,
  mouthLon: -123.4436747,
  hydraulicSources: [{
    sourceId: "north_umpqua_winchester_usgs",
    provider: "USGS",
    siteId: "14319500",
    name: "North Umpqua River at Winchester, OR",
    role: "primary",
    primaryMetric: "flow_cfs",
    availableMetrics: ["flow_cfs", "gage_height_ft"],
    historyYearsAvailable: 72,
    maxAgeHours: 2,
    reachQuality: "good",
    reachNotes:
      "Measured at North Umpqua river mile 1.8 in the lower reach, not at Winchester Dam. It does not represent Rock Creek, the Wild and Scenic corridor, or hydro-project reaches upstream.",
  }],
  waterTemperatureSources: [{
    sourceId: "north_umpqua_winchester_temperature",
    provider: "USGS",
    siteId: "14319500",
    name: "North Umpqua River at Winchester — measured water temperature",
    role: "primary",
    priority: 1,
    sourceType: "same_gauge",
    maxAgeHours: 2,
    smoothingWindowHours: 3,
    minValidF: 32,
    maxValidF: 86,
    maxRateChangeFPerHour: 4,
    maxPeerDifferenceF: 6,
    historicalStartYear: 1985,
    historicalEndYear: 2025,
    reachNotes:
      "Co-located with lower-river flow at USGS 14319500. It does not represent the middle/upper North Umpqua; the long 1992-2015 archive gap must remain disclosed.",
    attribution:
      "U.S. Geological Survey Water Data for the Nation; recent readings are provisional and subject to revision.",
  }],
  fishCountSources: [{
    sourceId: "north_umpqua_winchester_coho",
    provider: "ODFW_WINCHESTER",
    facilityName: "Winchester Dam Counting Station",
    observationType: "ladder_passage",
    eligibleSpecies: ["coho_salmon"],
    sourceUrl: "https://myodfw.com/winchester-dam-fish-counts",
    updateCadence: "seasonal",
    maximumAgeHours: 240,
    preliminary: true,
    operatingSeason:
      "Coho passage season September 1 through January 30; ODFW strata reports are irregular and can lag observations by one to two months.",
    representedReach:
      "Classified ladder passage at Winchester Dam on the lower North Umpqua",
    limitation:
      "Winchester counts are classified ladder passage—not fish below the dam, fish that do not pass, retainable hatchery abundance, total river abundance, or catch probability. Counts since 2015 are strata estimates that ODFW describes as at least 90 percent accurate.",
    recapturePolicy:
      "Use the current season's coho total once ODFW reports it. Jacks are already included in ODFW wild, hatchery, and total counts and must never be added again. Never carry a prior final season into the current season.",
    attribution:
      "Oregon Department of Fish and Wildlife Winchester Dam fish counts",
  }],
  weatherPoints: [{
    weatherPointId: "north_umpqua_winchester_weather",
    lat: 43.270966666666666,
    lon: -123.41154444444444,
    role: "primary",
  }],
  foundation: {
    version: "north-umpqua-foundation-v1-pass2-2026-09-28",
    corridorLengthMiles: 69,
    downstreamTerminus: "North/South Umpqua confluence at River Forks",
    upstreamTerminus: "ODFW marker just below Soda Springs Dam",
    targetSpecies: ["coho_salmon"],
    reaches: [
      {
        reachId: "north_umpqua_lower_winchester",
        displayName: "Lower North Umpqua — mouth to Winchester",
        order: 1,
        role: "lower",
        gaugeRepresented: true,
        notes:
          "North Umpqua mouth to the Old Highway 99/Winchester closure near river mile 6.5. USGS 14319500 is at river mile 1.8, not at the dam.",
        sourceNotes:
          "USGS 14319500, ODFW Southwest Zone, and Winchester Dam materials.",
      },
      {
        reachId: "north_umpqua_middle_rock_creek",
        displayName: "Middle North Umpqua — Winchester to Rock Creek",
        order: 2,
        role: "middle",
        gaugeRepresented: false,
        notes:
          "From 200 feet above Winchester Dam through Lone Rock to painted lines above Rock Creek near river mile 35.7; legal closures remain explicit gaps.",
        sourceNotes:
          "ODFW Southwest Zone and BLM North Umpqua Wild and Scenic River material.",
      },
      {
        reachId: "north_umpqua_upper_wsr",
        displayName: "Upper North Umpqua — Fly Area to Soda Springs",
        order: 3,
        role: "terminal",
        gaugeRepresented: false,
        notes:
          "Deadline Falls Fly Area boundary to the marker just below Soda Springs Dam near river mile 69. Fly-only and no-watercraft restrictions apply in portions of this corridor.",
        sourceNotes:
          "ODFW Southwest Zone, BLM North Umpqua Wild and Scenic River, and PacifiCorp passage material.",
      },
    ],
    locations: [
      {
        locationId: "north_umpqua_hestness_landing",
        officialName: "Hestness Landing County Park",
        state: "OR",
        latitude: 43.2845602,
        longitude: -123.3914653,
        coordinateSource: "USGS GNIS feature 1132982",
        coordinateStatus: "verified",
        reachId: "north_umpqua_lower_winchester",
        kind: "access",
        fishPassage: "not_applicable",
        publicAccess: "verified",
        fishingSuitability: { bank: "limited", wading: "unknown", boat: "yes" },
        beginnerSuitable: false,
        restrictionNotes:
          "Boat and fishing access are source-listed; bank extent, wading, current, launch condition, and proximity to Winchester closures must be checked independently.",
        sourceNotes:
          "Douglas County Hestness Landing County Park page and USGS GNIS.",
      },
      {
        locationId: "north_umpqua_swiftwater_day_use",
        officialName: "Swiftwater Day Use Area",
        state: "OR",
        latitude: 43.33314,
        longitude: -123.00476,
        coordinateSource: "Bureau of Land Management",
        coordinateStatus: "verified",
        reachId: "north_umpqua_middle_rock_creek",
        kind: "access",
        fishPassage: "not_applicable",
        publicAccess: "verified",
        fishingSuitability: { bank: "yes", wading: "unknown", boat: "no" },
        beginnerSuitable: false,
        restrictionNotes:
          "BLM identifies bank fishing and an accessible platform. Fly-only water begins a few hundred yards upriver; never route into the painted-lines-to-Deadline closure.",
        sourceNotes: "Bureau of Land Management Swiftwater Day Use Area page.",
      },
      {
        locationId: "north_umpqua_susan_creek",
        officialName: "Susan Creek Campground",
        state: "OR",
        latitude: 43.2966667,
        longitude: -122.8933333,
        coordinateSource: "Bureau of Land Management",
        coordinateStatus: "verified",
        reachId: "north_umpqua_upper_wsr",
        kind: "access",
        fishPassage: "not_applicable",
        publicAccess: "verified",
        fishingSuitability: { bank: "limited", wading: "unknown", boat: "no" },
        beginnerSuitable: false,
        restrictionNotes:
          "Fishing access is source-listed. Fly-fishing-only and no-angling-from-watercraft rules apply in the Wild and Scenic section; site conditions are not guaranteed.",
        sourceNotes: "Bureau of Land Management Susan Creek Campground page.",
      },
      {
        locationId: "north_umpqua_winchester_dam",
        officialName: "Winchester Dam",
        state: "OR",
        latitude: 43.28393794,
        longitude: -123.3539244,
        coordinateSource: "ODFW Fish Passage Barriers feature 18305",
        coordinateStatus: "verified",
        reachId: "north_umpqua_lower_winchester",
        kind: "dam",
        fishPassage: "limited",
        publicAccess: "restricted",
        fishingSuitability: { bank: "no", wading: "no", boat: "no" },
        beginnerSuitable: false,
        restrictionNotes:
          "Biological passage/count landmark only. The adjacent no-angling gap is not a Spot Finder access.",
        sourceNotes: "ODFW Winchester Dam fish-count and passage materials.",
      },
      {
        locationId: "north_umpqua_soda_springs_dam",
        officialName: "Soda Springs Dam",
        state: "OR",
        latitude: 43.302789,
        longitude: -122.49497129,
        coordinateSource: "ODFW Fish Passage Barriers feature 18436",
        coordinateStatus: "verified",
        reachId: "north_umpqua_upper_wsr",
        kind: "barrier",
        fishPassage: "passable",
        publicUpstreamLimit: true,
        publicAccess: "restricted",
        fishingSuitability: { bank: "no", wading: "no", boat: "no" },
        beginnerSuitable: false,
        restrictionNotes:
          "The product stops at the legal marker below the dam despite physical fish passage. Dam facilities are not configured as fishing access.",
        sourceNotes:
          "ODFW barrier GIS and PacifiCorp North Umpqua project material.",
      },
    ],
    primaryGaugeReachId: "north_umpqua_lower_winchester",
    contextualGaugeSiteIds: ["14317450"],
    weatherStrategy: {
      mode: "single_point",
      primaryWeatherPointId: "north_umpqua_winchester_weather",
      basinRepresentation:
        "Modeled weather near lower-river USGS 14319500 supports the represented lower reach only.",
      sourceNotes: "Open-Meteo point paired to USGS 14319500.",
    },
    stateRegulations: [{
      state: "OR",
      version: "oregon-southwest-zone-2026",
      jurisdiction: "Oregon DFW Southwest Zone and in-season updates",
      reminderCopy: OR_REGULATION_COPY,
      accessAndSafetyNotes:
        "Winchester, Rock Creek/Deadline, fly-only, watercraft, dam, and posted property restrictions create discontinuous legal access. A Seasonal Zone never means the full section is open or safe.",
      sourceNotes:
        `ODFW Southwest Zone and ${ODFW_UPDATES_URL}; recheck before release.`,
    }],
    evidenceNotes:
      "The product runs from River Forks to the legal marker below Soda Springs. Winchester and Soda Springs pass fish but remain legal/access boundaries. Slide Creek, Toketee, the reservoir, and all reaches above the product endpoint are excluded.",
  },
  conditionRefreshSchedule: {
    activeSlots: ACTIVE_SLOTS,
    inactiveSlots: ["00:00"],
    evidenceNotes:
      "Flow, height, and measured temperature resolve independently at USGS 14319500. Idleyld site 14317450 remains context-only and is never substituted or averaged into lower-reach scoring.",
  },
  conditionDataCapabilities: {
    hydraulics: { status: "available" },
    waterTemperature: { status: "available" },
  },
  supportStatus: "beta",
  gaugeLimitationCopy:
    "Measured at North Umpqua river mile 1.8 in the lower reach—not at Winchester Dam, Rock Creek, or the upper Wild and Scenic corridor. The read is lower-reach conditional context, never whole-river fish presence, passage, abundance, access, or safety evidence.",
  regulationReminderCopy: OR_REGULATION_COPY,
};

const AVAILABLE_CAPABILITIES: AuditedRiverRunProfile["primitiveCapabilities"] =
  {
    migrationStage: { status: "available" },
    activity: { status: "available" },
    fishInRiver: { status: "available" },
    fishability: { status: "available" },
    migrationTiming: {
      status: "unavailable",
      reason: "no_accepted_historical_baseline",
      notes:
        "No independent observed timing feed passed the representative-reach, recurring-publication, freshness, and revision audit.",
    },
    push: { status: "available" },
  };

const MAINSTEM_FISHABILITY: FishabilityBands = {
  version: "umpqua_mainstem-fishability-v1-pass3-2026-09-28",
  metric: "flow_cfs",
  sourceLabel: "Elkton middle mainstem",
  tooLow: { max: 960 },
  lowFishable: { min: 960, max: 1110 },
  ideal: { min: 1110, max: 3240 },
  highFishable: { min: 3240, max: 10500 },
  blownOut: { min: 17500 },
  caps: {
    staleGauge: 55,
    unknownTrend: 65,
    veryLow: 35,
    blownOut: 20,
    sharpRiseHigh: 40,
  },
  evidenceNotes:
    "Calibrated from 4,590 approved daily means in the fixed 1996-2025 Aug. 1-Dec. 31 window with zero boundary violations.",
  sourceNotes:
    "USGS 14321000 approved daily discharge. Elkton reach only; tide, turbidity, debris, safety, access, fish presence, and other reaches are unmeasured.",
};

const NORTH_FISHABILITY: FishabilityBands = {
  version: "north_umpqua-fishability-v1-pass3-2026-09-28",
  metric: "flow_cfs",
  sourceLabel: "Lower North Umpqua at river mile 1.8",
  tooLow: { max: 815 },
  lowFishable: { min: 815, max: 925 },
  ideal: { min: 925, max: 3170 },
  highFishable: { min: 3170, max: 6830 },
  blownOut: { min: 11000 },
  caps: {
    staleGauge: 55,
    unknownTrend: 65,
    veryLow: 35,
    blownOut: 20,
    sharpRiseHigh: 40,
  },
  evidenceNotes:
    "Calibrated from 4,080 approved daily means in the fixed 1996-2025 Aug. 28-Jan. 10 window with zero boundary violations.",
  sourceNotes:
    "USGS 14319500 approved daily discharge. Lower reach only; turbidity, debris, upper-project effects, safety, access, fish presence, and other reaches are unmeasured.",
};

const MAINSTEM_BASELINE: BaselineCoverage = {
  metric: "flow_cfs",
  version: "umpqua-mainstem-elkton-fall-1996-2025-v1",
  hasPercentileBaselines: true,
  coveredWindowPercent: 1,
  minimumHistoryYears: 30,
  sourceNotes:
    "USGS 14321000 approved daily means; fixed 1996-2025 fall calibration window.",
};

const NORTH_BASELINE: BaselineCoverage = {
  metric: "flow_cfs",
  version: "north-umpqua-winchester-fall-1996-2025-v1",
  hasPercentileBaselines: true,
  coveredWindowPercent: 1,
  minimumHistoryYears: 30,
  sourceNotes:
    "USGS 14319500 approved daily means; fixed 1996-2025 fall calibration window.",
};

const MAINSTEM_ZONE_BASE = {
  earlyApproach: {
    label: "Umpqua Estuary / Winchester Bay",
    sourceNotes:
      "ODFW identifies the Umpqua bay/mainstem fishery and lower-river fall salmon entry. This is receiving-water orientation, never an access or navigation pin.",
  },
  phases: {
    beginning: ["umpqua_mainstem_estuary_lower"],
    buildingEarly: ["umpqua_mainstem_middle_elkton"],
    buildingEstablished: ["umpqua_mainstem_middle_elkton"],
    buildingBroad: [
      "umpqua_mainstem_middle_elkton",
      "umpqua_mainstem_upper_forks",
    ],
    peak: [
      "umpqua_mainstem_estuary_lower",
      "umpqua_mainstem_middle_elkton",
      "umpqua_mainstem_upper_forks",
    ],
    tapering: [
      "umpqua_mainstem_middle_elkton",
      "umpqua_mainstem_upper_forks",
    ],
    ending: ["umpqua_mainstem_upper_forks"],
  },
  evidenceNotes:
    "Species-specific evidence independently supports the estuary-to-River Forks progression. Access remains limited to audited sites, and tributary-mouth closures remain explicit legal gaps.",
};

const MAINSTEM_CHINOOK_ZONE: SeasonalZonePlan = {
  ...MAINSTEM_ZONE_BASE,
  version: "umpqua-mainstem-fall-chinook-zone-v1-pass3-2026-09-28",
};

const MAINSTEM_COHO_ZONE: SeasonalZonePlan = {
  ...MAINSTEM_ZONE_BASE,
  version: "umpqua-mainstem-fall-coho-zone-v1-pass3-2026-09-28",
};

const NORTH_COHO_ZONE: SeasonalZonePlan = {
  version: "north-umpqua-fall-coho-zone-v1-pass3-2026-09-28",
  earlyApproach: {
    label: "River Forks / lower North Umpqua entry",
    sourceNotes:
      "Douglas County and ODFW identify the confluence/entry relationship. This is orientation, not a River Forks access pin.",
  },
  phases: {
    beginning: ["north_umpqua_lower_winchester"],
    buildingEarly: ["north_umpqua_middle_rock_creek"],
    buildingEstablished: ["north_umpqua_middle_rock_creek"],
    buildingBroad: [
      "north_umpqua_middle_rock_creek",
      "north_umpqua_upper_wsr",
    ],
    peak: [
      "north_umpqua_lower_winchester",
      "north_umpqua_middle_rock_creek",
      "north_umpqua_upper_wsr",
    ],
    tapering: [
      "north_umpqua_middle_rock_creek",
      "north_umpqua_upper_wsr",
    ],
    ending: ["north_umpqua_upper_wsr"],
  },
  evidenceNotes:
    "Winchester, Rock Creek/Deadline, fly-only, watercraft, and Soda Springs restrictions remain explicit overlays. Phase geography never implies uniform legality, access, or gauge representation.",
};

function mainstemActivity(input: {
  version: string;
  profile: ActivityRules["profile"];
  hydraulicTrend: NonNullable<ActivityRules["hydraulicTrend"]>;
  lifecycle: NonNullable<ActivityRules["caps"]["lifecycleRamp"]>;
}): ActivityRules {
  return {
    version: input.version,
    profile: input.profile,
    dataMode: "observed_river",
    minimumInputContract: "weather_and_one_measured_river_input",
    confidenceCeiling: "Limited",
    inputReach: {
      reachIds: ["umpqua_mainstem_middle_elkton"],
      hydraulicSourceIds: ["umpqua_mainstem_elkton_usgs"],
      waterTemperatureSourceIds: [],
      weatherPointIds: ["umpqua_mainstem_elkton_weather"],
      notes:
        "Only Elkton flow and same-neighborhood weather score. Measured Elkton temperature remains display context with zero score and cap influence.",
    },
    scopeCopy:
      "Hydraulic-only read for the Elkton middle reach. It estimates conditional responsiveness only if fish are present; it does not establish presence, abundance, exact location, catch probability, or conditions in the estuary or upper mainstem.",
    weights: {
      light: 0.3,
      waterTemperature: 0,
      riverBehavior: 0.6,
      weather: 0.1,
    },
    hydraulicTrend: input.hydraulicTrend,
    temperature: input.profile === "coho_fall_reaction"
      ? {
        coldF: 40,
        preferredMinF: 45,
        preferredMaxF: 60,
        warmF: 64,
        barrierF: 68,
      }
      : {
        coldF: 43,
        preferredMinF: 48,
        preferredMaxF: 62,
        warmF: 68,
        barrierF: 72,
      },
    caps: {
      noMeasuredRiverData: 60,
      noWaterTemperature: 100,
      lateRun: 75,
      ending: 42,
      taperingPenalty: 15,
      lifecycleRamp: input.lifecycle,
    },
    evidenceNotes:
      "The fixed 2019-2025 replay covered 854/854 expected days with four blocks per day, Peak highest, shoulders within 20 points, and zero invariant or controlled-test failures. Confidence remains Limited because representative measured temperature did not meet the five-season replay minimum.",
  };
}

const NORTH_COHO_ACTIVITY: ActivityRules = {
  version: "north-umpqua-fall-coho-full-activity-v1-pass3-2026-09-28",
  profile: "coho_fall_reaction",
  dataMode: "observed_river",
  minimumInputContract: "weather_and_one_measured_river_input",
  inputReach: {
    reachIds: ["north_umpqua_lower_winchester"],
    hydraulicSourceIds: ["north_umpqua_winchester_usgs"],
    waterTemperatureSourceIds: ["north_umpqua_winchester_temperature"],
    weatherPointIds: ["north_umpqua_winchester_weather"],
    notes:
      "Only co-located lower-reach flow and measured temperature plus same-neighborhood weather score. Idleyld remains context-only and cannot substitute or average into this model.",
  },
  scopeCopy:
    "Full observed-river read for the lower North Umpqua near river mile 1.8. It estimates conditional responsiveness only if fish are present; it does not establish presence, abundance, exact location, catch probability, or middle/upper-river conditions.",
  weights: {
    light: 0.25,
    waterTemperature: 0.35,
    riverBehavior: 0.3,
    weather: 0.1,
  },
  hydraulicTrend: {
    rising24h: { absolute: 39, percent: 4.4 },
    meaningfulRise24h: { absolute: 170, percent: 14.1 },
    sharpRise24h: { absolute: 640, percent: 44.7 },
  },
  temperature: {
    coldF: 40,
    preferredMinF: 45,
    preferredMaxF: 60,
    warmF: 64,
    barrierF: 68,
  },
  caps: {
    noMeasuredRiverData: 60,
    noWaterTemperature: 60,
    lateRun: 75,
    ending: 42,
    taperingPenalty: 15,
    lifecycleRamp: {
      peakEnd: "11-20",
      taperingEnd: "12-05",
      endingEnd: "01-10",
    },
  },
  evidenceNotes:
    "The fixed 2019-2025 replay covered 952/952 expected days with four blocks per day, Peak highest, shoulders within 20 points, and zero invariant or controlled-test failures.",
};

function presence(
  maximum: HistoricalPresenceConfig["maximum"],
  version: string,
  anchors: HistoricalPresenceConfig["anchors"],
  evidenceNotes: string,
): HistoricalPresenceConfig {
  return {
    maximum,
    distributionScope: "broad",
    curveVersion: version,
    anchors,
    evidenceNotes,
    sourceNotes:
      "ODFW Umpqua fish counts, spawning survey/assessment, sport-catch, fall coastal salmon management, Southwest Zone, and spawning-timing sources reconciled in the Pass 1-3 dossiers.",
  };
}

function push(input: {
  version: string;
  fishability: FishabilityBands;
  hydraulicTrend: NonNullable<ActivityRules["hydraulicTrend"]>;
  profile: ActivityRules["profile"];
  temperatureMode: NonNullable<PushRules["directEvent"]>["temperature"];
  sourceNotes: string;
}): PushRules {
  return buildDirectEventPushRules({
    version: input.version,
    fishability: input.fishability,
    hydraulicTrend: input.hydraulicTrend,
    activityProfile: input.profile,
    movementTemperature: input.profile === "coho_fall_reaction"
      ? {
        supportiveMinF: 42,
        preferredMinF: 45,
        supportiveMaxF: 60,
        tooWarmF: 64,
        migrationBarrierF: 68,
      }
      : {
        supportiveMinF: 44,
        preferredMinF: 48,
        supportiveMaxF: 62,
        tooWarmF: 68,
        migrationBarrierF: 72,
      },
    temperatureMode: input.temperatureMode,
    evidenceNotes:
      "Positive-only direct event-state model calibrated on the exact run start-through-taper window. Live reads require trailing four-hour medians and matched 12/24-hour windows, freeze the onset baseline, retain no longer than 48 hours at .65/.35 fractions, downgrade stale inputs, fail closed without a trigger, and keep severe-high flow Neutral. Precipitation is unscored.",
    sourceNotes: input.sourceNotes,
  });
}

const MAINSTEM_TREND = {
  rising24h: { absolute: 30, percent: 2.9 },
  meaningfulRise24h: { absolute: 140, percent: 9.4 },
  sharpRise24h: { absolute: 765, percent: 34 },
};

const NORTH_TREND = {
  rising24h: { absolute: 39, percent: 4.4 },
  meaningfulRise24h: { absolute: 170, percent: 14.1 },
  sharpRise24h: { absolute: 640, percent: 44.7 },
};

const HIDDEN_AUDIT = {
  isEnabled: false,
  auditVersion: "umpqua-fall-pass4-hidden-review-v1",
  notes:
    "Pass 4 implementation is intentionally restricted to authenticated owner review behind river_run_umpqua_fall_v1. Public catalog enablement, deployment, and release are not authorized.",
};

export const UMPQUA_MAINSTEM_FALL_CHINOOK_RUN: AuditedRiverRunProfile = {
  runId: "umpqua_mainstem_fall_chinook",
  riverId: "umpqua_mainstem",
  biologyProfileId: "pacific_fall_chinook_v1",
  displayName: "Mainstem Fall Chinook",
  species: "chinook_salmon",
  season: "fall",
  runType: "fall_spawn",
  movementEngineId: "fall_cooling",
  primitiveCapabilities: AVAILABLE_CAPABILITIES,
  runStageCopyStrategy: "onboarding_corridor",
  seasonalZoneReachIds: [
    "umpqua_mainstem_estuary_lower",
    "umpqua_mainstem_middle_elkton",
    "umpqua_mainstem_upper_forks",
  ],
  seasonalZonePlan: MAINSTEM_CHINOOK_ZONE,
  runWindow: {
    preRunStart: "07-15",
    stagingStart: "08-01",
    start: "08-15",
    beginningEnd: "08-31",
    buildingEstablishedStart: "09-01",
    buildingBroadStart: "09-15",
    peakStart: "09-20",
    peak: "10-05",
    peakEnd: "10-20",
    taperingEnd: "11-05",
    end: "11-15",
    lateEnd: "11-30",
    postRunLateCopyEnd: "12-15",
  },
  historicalPresence: presence(
    6,
    "umpqua-mainstem-fall-chinook-presence-v1-pass3-2026-09-28",
    [
      { dayOffsetFromStart: 0, fractionOfMaximum: 0.06 },
      { dayOffsetFromStart: 17, fractionOfMaximum: 0.2 },
      { dayOffsetFromStart: 36, fractionOfMaximum: 0.6 },
      { dayOffsetFromStart: 51, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 66, fractionOfMaximum: 0.78 },
      { dayOffsetFromStart: 82, fractionOfMaximum: 0.38 },
      { dayOffsetFromStart: 92, fractionOfMaximum: 0.15 },
      { dayOffsetFromStart: 107, fractionOfMaximum: 0.03 },
      { dayOffsetFromStart: 122, fractionOfMaximum: 0 },
    ],
    "A conservative broad 6/10 ceiling reflects recurring 1,187-2,743 expanded annual code-102 harvest in six available 2019-2025 files while preserving uncertainty from recent critical-abundance status and the absence of a representative mainstem counter.",
  ),
  activity: mainstemActivity({
    version:
      "umpqua-mainstem-fall-chinook-hydraulic-activity-v1-pass3-2026-09-28",
    profile: "chinook_fall_reaction",
    hydraulicTrend: MAINSTEM_TREND,
    lifecycle: {
      peakEnd: "10-20",
      taperingEnd: "11-05",
      endingEnd: "11-30",
    },
  }),
  push: push({
    version: "umpqua_mainstem_fall_chinook-direct-push-v1-pass3-2026-09-28",
    fishability: MAINSTEM_FISHABILITY,
    hydraulicTrend: MAINSTEM_TREND,
    profile: "chinook_fall_reaction",
    temperatureMode: "disabled",
    sourceNotes:
      "USGS 14321000 Elkton discharge; exact 2019-2025 Aug. 15-Dec. 5 calibration union. Measured temperature is disabled.",
  }),
  fishabilityBands: MAINSTEM_FISHABILITY,
  baselineCoverage: MAINSTEM_BASELINE,
  userCopyHints: {
    stagingTip:
      "Use the estuary orientation for context, then verify current legal access and tide before traveling.",
    endingTip:
      "The terminal tail is biological presence—not a promise of harvestable fish or open access.",
  },
  researchNotes:
    "Mainstem biological presence is independent from harvest rules. Winchester Dam counts are excluded because the facility is on North Umpqua above River Forks.",
  sourceNotes: "docs/onboarding/river-run/umpqua_mainstem/river-onboarding.md",
  publicAudit: HIDDEN_AUDIT,
};

export const UMPQUA_MAINSTEM_FALL_COHO_RUN: AuditedRiverRunProfile = {
  runId: "umpqua_mainstem_fall_coho",
  riverId: "umpqua_mainstem",
  biologyProfileId: "pacific_fall_coho_v1",
  displayName: "Mainstem Fall Coho",
  species: "coho_salmon",
  season: "fall",
  runType: "fall_spawn",
  movementEngineId: "fall_cooling",
  primitiveCapabilities: AVAILABLE_CAPABILITIES,
  runStageCopyStrategy: "onboarding_corridor",
  seasonalZoneReachIds: [
    "umpqua_mainstem_estuary_lower",
    "umpqua_mainstem_middle_elkton",
    "umpqua_mainstem_upper_forks",
  ],
  seasonalZonePlan: MAINSTEM_COHO_ZONE,
  runWindow: {
    preRunStart: "08-15",
    stagingStart: "09-01",
    start: "09-10",
    beginningEnd: "09-25",
    buildingEstablishedStart: "09-26",
    buildingBroadStart: "10-10",
    peakStart: "10-20",
    peak: "11-05",
    peakEnd: "11-20",
    taperingEnd: "12-05",
    end: "12-15",
    lateEnd: "12-31",
    postRunLateCopyEnd: "01-10",
  },
  historicalPresence: presence(
    7,
    "umpqua-mainstem-fall-coho-presence-v1-pass3-2026-09-28",
    [
      { dayOffsetFromStart: 0, fractionOfMaximum: 0.05 },
      { dayOffsetFromStart: 16, fractionOfMaximum: 0.18 },
      { dayOffsetFromStart: 40, fractionOfMaximum: 0.55 },
      { dayOffsetFromStart: 56, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 71, fractionOfMaximum: 0.82 },
      { dayOffsetFromStart: 86, fractionOfMaximum: 0.48 },
      { dayOffsetFromStart: 96, fractionOfMaximum: 0.22 },
      { dayOffsetFromStart: 112, fractionOfMaximum: 0.05 },
      { dayOffsetFromStart: 122, fractionOfMaximum: 0 },
    ],
    "A broad 7/10 ceiling reflects distinct Lower/Middle Umpqua populations and recurring mainstem/bay harvest, including 5,307 expanded fish in 2024, while preserving uncertainty from annual variation and the absence of a representative mainstem counter.",
  ),
  activity: mainstemActivity({
    version: "umpqua-mainstem-fall-coho-hydraulic-activity-v1-pass3-2026-09-28",
    profile: "coho_fall_reaction",
    hydraulicTrend: MAINSTEM_TREND,
    lifecycle: {
      peakEnd: "11-20",
      taperingEnd: "12-05",
      endingEnd: "12-31",
    },
  }),
  push: push({
    version: "umpqua_mainstem_fall_coho-direct-push-v1-pass3-2026-09-28",
    fishability: MAINSTEM_FISHABILITY,
    hydraulicTrend: MAINSTEM_TREND,
    profile: "coho_fall_reaction",
    temperatureMode: "disabled",
    sourceNotes:
      "USGS 14321000 Elkton discharge; exact 2019-2025 Aug. 15-Dec. 5 calibration union. Measured temperature is disabled.",
  }),
  fishabilityBands: MAINSTEM_FISHABILITY,
  baselineCoverage: MAINSTEM_BASELINE,
  userCopyHints: {
    peakTip:
      "Biological presence includes wild and hatchery-origin coho. In 2026, retention is hatchery coho only in open sections; verify current rules before fishing.",
    endingTip:
      "The terminal tail is biological presence, not a current harvest or abundance claim.",
  },
  researchNotes:
    "Biological presence is independent from harvestability. Current 2026 opportunity is hatchery-only where open; Winchester counts are excluded from the mainstem.",
  sourceNotes: "docs/onboarding/river-run/umpqua_mainstem/river-onboarding.md",
  publicAudit: HIDDEN_AUDIT,
};

export const NORTH_UMPQUA_FALL_COHO_RUN: AuditedRiverRunProfile = {
  runId: "north_umpqua_fall_coho",
  riverId: "north_umpqua",
  biologyProfileId: "pacific_fall_coho_v1",
  displayName: "North Umpqua Fall Coho",
  species: "coho_salmon",
  season: "fall",
  runType: "fall_spawn",
  movementEngineId: "fall_cooling",
  primitiveCapabilities: AVAILABLE_CAPABILITIES,
  runStageCopyStrategy: "onboarding_corridor",
  seasonalZoneReachIds: [
    "north_umpqua_lower_winchester",
    "north_umpqua_middle_rock_creek",
    "north_umpqua_upper_wsr",
  ],
  seasonalZonePlan: NORTH_COHO_ZONE,
  runWindow: {
    preRunStart: "08-20",
    stagingStart: "08-28",
    start: "09-01",
    beginningEnd: "09-20",
    buildingEstablishedStart: "09-21",
    buildingBroadStart: "10-10",
    peakStart: "10-20",
    peak: "11-05",
    peakEnd: "11-20",
    taperingEnd: "12-05",
    end: "12-20",
    lateEnd: "01-10",
    postRunLateCopyEnd: "01-30",
  },
  historicalPresence: presence(
    7,
    "north-umpqua-fall-coho-presence-v1-pass3-2026-09-28",
    [
      { dayOffsetFromStart: 0, fractionOfMaximum: 0.02 },
      { dayOffsetFromStart: 20, fractionOfMaximum: 0.1 },
      { dayOffsetFromStart: 39, fractionOfMaximum: 0.35 },
      { dayOffsetFromStart: 49, fractionOfMaximum: 0.65 },
      { dayOffsetFromStart: 65, fractionOfMaximum: 1 },
      { dayOffsetFromStart: 80, fractionOfMaximum: 0.82 },
      { dayOffsetFromStart: 95, fractionOfMaximum: 0.5 },
      { dayOffsetFromStart: 110, fractionOfMaximum: 0.24 },
      { dayOffsetFromStart: 131, fractionOfMaximum: 0.05 },
      { dayOffsetFromStart: 151, fractionOfMaximum: 0 },
    ],
    "A broad 7/10 ceiling reflects the long Winchester series, recent finalized returns of roughly 1,700-7,400, and broad documented habitat distribution. It remains below 8 because Winchester is not a whole-corridor census and marked retention opportunity is sparse.",
  ),
  activity: NORTH_COHO_ACTIVITY,
  push: push({
    version: "north_umpqua_fall_coho-direct-push-v1-pass3-2026-09-28",
    fishability: NORTH_FISHABILITY,
    hydraulicTrend: NORTH_TREND,
    profile: "coho_fall_reaction",
    temperatureMode: "trigger_and_constraint",
    sourceNotes:
      "USGS 14319500 co-located lower-reach discharge and measured temperature; exact 2019-2025 Sep. 1-Dec. 5 calibration window.",
  }),
  fishabilityBands: NORTH_FISHABILITY,
  baselineCoverage: NORTH_BASELINE,
  waterTemperature: {
    sourcePriority: ["north_umpqua_winchester_temperature"],
    upstreamFallbackPositiveSignalCap: 0,
    notes:
      "Only co-located lower-reach temperature scores. Idleyld context is never substituted, averaged, or allowed to create a positive signal.",
  },
  userCopyHints: {
    peakTip:
      "Presence and Winchester passage are predominantly wild fish. In 2026, retention is hatchery coho only in open sections, and marked harvest opportunity is sparse.",
    endingTip:
      "The January tail represents declining biological presence, not a promise of legal access or retainable fish.",
  },
  researchNotes:
    "Winchester Fish Counts are a separate zero-influence facility observation. They are neither retainable fish counts nor a whole-corridor census.",
  sourceNotes: "docs/onboarding/river-run/north_umpqua/river-onboarding.md",
  publicAudit: HIDDEN_AUDIT,
};

export const UMPQUA_DRAFT_RIVERS: RiverProfile[] = [
  UMPQUA_MAINSTEM_RIVER_PROFILE,
  NORTH_UMPQUA_RIVER_PROFILE,
];

export const UMPQUA_DRAFT_RUNS: AuditedRiverRunProfile[] = [
  UMPQUA_MAINSTEM_FALL_CHINOOK_RUN,
  UMPQUA_MAINSTEM_FALL_COHO_RUN,
  NORTH_UMPQUA_FALL_COHO_RUN,
];

function configurationDocument(
  river: RiverProfile,
  runs: AuditedRiverRunProfile[],
): RiverRunConfigurationDocument {
  return {
    schemaVersion: "river-run-config-v1",
    configVersion: `2026-09-29-${river.riverId}-fall-pass4-hidden-v1`,
    movementEngineVersion: getMovementEngineDefinition("fall_cooling").version,
    river,
    biologyProfiles: river.riverId === "umpqua_mainstem"
      ? [
        PACIFIC_FALL_CHINOOK_BIOLOGY_PROFILE,
        PACIFIC_FALL_COHO_BIOLOGY_PROFILE,
      ]
      : [PACIFIC_FALL_COHO_BIOLOGY_PROFILE],
    runs,
  };
}

export const UMPQUA_MAINSTEM_CONFIGURATION_DOCUMENT = configurationDocument(
  UMPQUA_MAINSTEM_RIVER_PROFILE,
  [UMPQUA_MAINSTEM_FALL_CHINOOK_RUN, UMPQUA_MAINSTEM_FALL_COHO_RUN],
);

export const NORTH_UMPQUA_CONFIGURATION_DOCUMENT = configurationDocument(
  NORTH_UMPQUA_RIVER_PROFILE,
  [NORTH_UMPQUA_FALL_COHO_RUN],
);

export const UMPQUA_DRAFT_CONFIGURATION_DOCUMENTS:
  RiverRunConfigurationDocument[] = [
    UMPQUA_MAINSTEM_CONFIGURATION_DOCUMENT,
    NORTH_UMPQUA_CONFIGURATION_DOCUMENT,
  ];
