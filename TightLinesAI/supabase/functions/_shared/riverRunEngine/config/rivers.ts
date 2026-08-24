import type { RiverProfile } from "../types.ts";

export const PERE_MARQUETTE_RIVER_PROFILE: RiverProfile = {
  riverId: "pere_marquette",
  displayName: "Pere Marquette River",
  state: "MI",
  region: "great_lakes",
  timezone: "America/Detroit",
  mouthLat: 43.9547,
  mouthLon: -86.4526,
  hydraulicSources: [
    {
      sourceId: "pm_scottville_usgs",
      provider: "USGS",
      siteId: "04122500",
      name: "Pere Marquette River at Scottville, MI",
      role: "primary",
      primaryMetric: "flow_cfs",
      availableMetrics: ["flow_cfs", "gage_height_ft"],
      historyYearsAvailable: 86,
      maxAgeHours: 6,
      reachQuality: "good",
      reachNotes:
        "Official USGS gauge in the Lower river at Scottville. It is the accepted hydraulic reference for lower-mainstem Fishability and measured river response; it does not directly measure middle- or upper-river fishing shape. Discharge is scored and gage height is context only.",
    },
  ],
  waterTemperatureSources: [
    {
      sourceId: "pm_maple_leaf_temperature",
      provider: "MONITOR_MY_WATERSHED",
      siteId: "Maple Leaf",
      seriesId: "4939",
      name: "Pere Marquette River at Maple Leaf",
      role: "primary",
      priority: 1,
      sourceType: "nearby_gauge",
      maxAgeHours: 2,
      smoothingWindowHours: 3,
      minValidF: 30,
      maxValidF: 85,
      maxRateChangeFPerHour: 3,
      maxPeerDifferenceF: 5,
      historicalStartYear: 2021,
      historicalEndYear: 2025,
      reachNotes:
        "Furthest-downstream audited PMTU water-temperature station, at the approved Middle river/Upper river orientation boundary. It is the primary measured-water signal and must not be described as a lower-river temperature reading.",
      attribution:
        "Pere Marquette Trout Unlimited via Monitor My Watershed, CC BY-SA 4.0.",
    },
    {
      sourceId: "pm_bowman_temperature",
      provider: "MONITOR_MY_WATERSHED",
      siteId: "PMTU60-1",
      seriesId: "3209",
      name: "Pere Marquette River at Bowman Bridge / 60th Street",
      role: "fallback",
      priority: 2,
      sourceType: "nearby_gauge",
      maxAgeHours: 2,
      smoothingWindowHours: 3,
      minValidF: 30,
      maxValidF: 85,
      maxRateChangeFPerHour: 3,
      maxPeerDifferenceF: 5,
      reachNotes:
        "Audited Upper river measured-water fallback at Bowman/60th Street. It must not silently claim Middle or Lower river temperature.",
      attribution:
        "Pere Marquette Trout Unlimited via Monitor My Watershed, CC BY-SA 4.0.",
    },
    {
      sourceId: "pm_m37_temperature",
      provider: "MONITOR_MY_WATERSHED",
      siteId: "PMTU37-1",
      seriesId: "3201",
      name: "Pere Marquette River at M-37",
      role: "validation",
      priority: 3,
      sourceType: "nearby_gauge",
      maxAgeHours: 2,
      smoothingWindowHours: 3,
      minValidF: 30,
      maxValidF: 85,
      maxRateChangeFPerHour: 3,
      maxPeerDifferenceF: 5,
      reachNotes:
        "Upper river validation and final fallback source at M-37. The sensor was repositioned in 2023; water depth is not used. It must not silently claim Middle or Lower river temperature.",
      attribution:
        "Pere Marquette Trout Unlimited via Monitor My Watershed, CC BY-SA 4.0.",
    },
  ],
  weatherPoints: [
    {
      weatherPointId: "pm_baldwin_watershed_weather",
      lat: 43.8619566,
      lon: -85.8814513,
      role: "primary",
    },
  ],
  foundation: {
    version: "pere-marquette-foundation-v2",
    corridorLengthMiles: 67,
    upstreamTerminus:
      "The Forks, where the Middle Branch and Little South Branch form the Pere Marquette mainstem, approximately one-half mile upstream of M-37",
    downstreamTerminus:
      "The Pere Marquette mainstem mouth at the east end of Pere Marquette Lake; the lake, Ludington harbor, and Lake Michigan are staging context rather than inland-mainstem sections",
    targetSpecies: ["chinook_salmon", "coho_salmon", "steelhead"],
    reaches: [
      {
        reachId: "pm_lake_harbor_context",
        displayName:
          "Pere Marquette Lake, Ludington harbor, and Lake Michigan staging context",
        order: 1,
        role: "mouth_context",
        gaugeRepresented: false,
        notes:
          "Pre-run and staging context only. It must not be described as proof that fish have entered the Pere Marquette mainstem.",
        sourceNotes:
          "Michigan DNR Pere Marquette Natural River description and Michigan DNR Chinook, Coho, and Steelhead species profiles.",
      },
      {
        reachId: "pm_lower_mainstem",
        displayName: "Lower river — Pere Marquette Lake to Scottville",
        order: 2,
        role: "lower",
        gaugeRepresented: true,
        notes:
          "The Scottville discharge station is the accepted lower-mainstem hydraulic reference. Fishability conclusions belong to this reach and must not be presented as direct measurements of the middle or upper river.",
        sourceNotes:
          "USGS 04122500; Michigan DNR Natural Rivers material; Michigan DNR 2011 Pere Marquette River Angler Survey; Ludington-area public river map.",
      },
      {
        reachId: "pm_middle_mainstem",
        displayName: "Middle river — Scottville to Maple Leaf",
        order: 3,
        role: "middle",
        gaugeRepresented: false,
        notes:
          "Includes the Custer, Indian Bridge/Reek Road, and Walhalla corridor. The former Custer sea-lamprey barrier was removed; it is not a current migration limit. Maple Leaf sits at the approved middle-to-upper orientation boundary.",
        sourceNotes:
          "Michigan DNR and USFS river maps; Michigan DNR 2011 Pere Marquette River Angler Survey; Great Lakes Fishery Trust Custer Barrier Free Fishing Access completion record; USGS electric-weir review.",
      },
      {
        reachId: "pm_upper_mainstem",
        displayName: "Upper river — Maple Leaf to M-37",
        order: 4,
        role: "upper",
        gaugeRepresented: false,
        notes:
          "Uses M-37 as the recognizable public upstream orientation point. The researched mainstem begins at the Forks about one-half mile upstream, but that technical origin is not used in public section copy. No active mainstem dam or weir was found in the corridor. The Baldwin River Dam is on a tributary and does not define this section.",
        sourceNotes:
          "Michigan DNR Natural Rivers description; Monitor My Watershed Maple Leaf, PMTU60-1, and PMTU37-1 station metadata; Michigan DNR Baldwin River Dam grants; Conservation Resource Alliance 2025-2027 work plan.",
      },
    ],
    primaryGaugeReachId: "pm_lower_mainstem",
    contextualGaugeSiteIds: [],
    weatherStrategy: {
      mode: "single_point",
      primaryWeatherPointId: "pm_baldwin_watershed_weather",
      basinRepresentation:
        "Modeled Open-Meteo precipitation near Baldwin in the upper watershed. It is precursor context, not an observed rain gauge, a river response, or proof of conditions in every PM section.",
      sourceNotes:
        "Open-Meteo point-weather adapter and the accepted PM Push replay location. Scottville discharge remains the required measured hydraulic response for strong Push language.",
    },
    stateRegulations: [
      {
        state: "MI",
        version: "michigan-2026-fishing-regulations-through-2027-03-31",
        jurisdiction:
          "Michigan DNR; mainstem Pere Marquette regulations vary across named reaches from M-37 downstream through Old US-31 and the lower river",
        reminderCopy:
          "Pere Marquette regulations change by reach. Check the current Michigan fishing regulations and posted boundaries before choosing access, tackle, harvest, or fishing methods.",
        accessAndSafetyNotes:
          "River Run section names are orientation ranges, not legal access or safety determinations. Do not infer public entry, wading, boating, or one uniform gear rule from a Lower, Middle, or Upper river recommendation.",
        sourceNotes:
          "Michigan DNR 2026 Fishing Regulations, effective through March 31, 2027, and current Michigan Fisheries Orders: https://www.michigan.gov/dnr/things-to-do/fishing/fishing-regulations",
      },
    ],
    evidenceNotes:
      "Foundation research completed August 9, 2026 and owner wording corrected August 10, 2026 in docs/river_run_pm_copy_foundation.md. The public mainstem model is Lower river (Pere Marquette Lake-Scottville), Middle river (Scottville-Maple Leaf), and Upper river (Maple Leaf-M-37). M-37 is the recognizable public orientation endpoint; the technical mainstem origin at the Forks remains internal geography about one-half mile upstream. The historic Custer electrical sea-lamprey barrier operated with a fishway from 2000-2009 and was later removed; it is not a current barrier. The deteriorating Baldwin River Dam remains a tributary project and must never be described as a Pere Marquette mainstem dam. Scottville flow represents lower-mainstem fishability. Maple Leaf is the primary measured-water-temperature station at the middle/upper boundary; Bowman and M-37 are upstream fallbacks. The Baldwin weather point is modeled upper-watershed context. Current regulations change by reach and must be checked independently before any public access or methods statement. No species timing, presence curve, threshold, or copy determination is changed by this river-level foundation.",
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
      "PM condition evidence refreshes every four hours from the configured staging start through the historical-presence tail, with a final 21:00 local rollover that publishes tomorrow's Activity Outlook. Push still starts and stops on its separate main-run window. The protected server job runs 17 minutes after the hour so the newest USGS and PMTU transmissions have time to arrive. Outside that seasonal window, the river refreshes once daily.",
  },
  conditionDataCapabilities: {
    hydraulics: { status: "available" },
    waterTemperature: { status: "available" },
  },
  supportStatus: "beta",
  gaugeLimitationCopy:
    "Flow and Fishability are based on the Lower river gauge at Scottville. The Middle river (Scottville–Maple Leaf) and Upper river (Maple Leaf–M-37) can differ and are not directly measured by that gauge.",
};

export const BETSIE_RIVER_PROFILE: RiverProfile = {
  riverId: "betsie",
  displayName: "Betsie River",
  state: "MI",
  region: "great_lakes",
  timezone: "America/Detroit",
  mouthLat: 44.6291652,
  mouthLon: -86.2459287,
  hydraulicSources: [],
  waterTemperatureSources: [],
  weatherPoints: [
    {
      weatherPointId: "betsie_homestead_weather_context",
      lat: 44.596362,
      lon: -86.079163,
      role: "primary",
    },
  ],
  foundation: {
    version: "betsie-foundation-v1",
    corridorLengthMiles: 10,
    upstreamTerminus:
      "The current signed fishing closure below Homestead Dam; River Run does not recommend fall migratory water above the structure",
    downstreamTerminus:
      "The Betsie River transition into Betsie Lake; Betsie Lake, Frankfort harbor, and Lake Michigan are staging context",
    targetSpecies: ["chinook_salmon", "coho_salmon", "steelhead"],
    reaches: [
      {
        reachId: "betsie_lake_harbor_context",
        displayName:
          "Lake Michigan, Frankfort harbor, and Betsie Lake staging context",
        order: 1,
        role: "mouth_context",
        gaugeRepresented: false,
        notes:
          "Pre-run and staging context only. It must not be described as proof that fish have entered the Betsie River.",
        sourceNotes:
          "Michigan DNR Betsie Natural River Plan and Fisheries Report 24.",
      },
      {
        reachId: "betsie_lake_to_us31",
        displayName: "Betsie Lake–US-31 reach",
        order: 2,
        role: "downstream",
        gaugeRepresented: false,
        notes:
          "Approved downstream River Run reach from the lake-to-river transition to the US-31 bridge. USGS 04126600 has discrete field measurements only and does not provide a live Fishability source.",
        sourceNotes:
          "Michigan DNR Fisheries Report 24 lower creel segment; USGS 04126600 inventory.",
      },
      {
        reachId: "betsie_us31_to_homestead",
        displayName: "US-31–Homestead reach",
        order: 3,
        role: "terminal",
        gaugeRepresented: false,
        notes:
          "Approved terminal River Run reach from US-31 to the current signed Homestead closure. The structure permits limited passage, but River Run guidance ends below it and never recommends fall migratory water above it.",
        sourceNotes:
          "Michigan DNR Homestead access description, Fisheries Report 24, forest compartment 27 material, and 2026 fishing regulations.",
      },
    ],
    locations: [
      {
        locationId: "betsie_homestead_barrier",
        officialName: "Homestead Dam lamprey barrier and fish-passage facility",
        aliases: ["Homestead Dam", "Homestead"],
        state: "MI",
        latitude: 44.596362,
        longitude: -86.079163,
        coordinateSource:
          "Michigan DNR Central Lake Michigan Management Unit access-site record",
        coordinateStatus: "verified",
        reachId: "betsie_us31_to_homestead",
        kind: "barrier",
        fishPassage: "limited",
        publicUpstreamLimit: true,
        publicAccess: "restricted",
        fishingSuitability: {
          bank: "limited",
          wading: "unknown",
          boat: "limited",
        },
        beginnerSuitable: false,
        restrictionNotes:
          "River Run recommendations end at the signed closure. Fishing is closed within 300 feet August 1–November 15 and within 100 feet November 16–July 31; current signs and regulations control.",
        sourceNotes:
          "Michigan DNR Homestead structure/access description and 2026 Michigan Fishing Regulations, verified 2026-08-10.",
      },
    ],
    primaryGaugeReachId: null,
    contextualGaugeSiteIds: [],
    weatherStrategy: {
      mode: "single_point",
      primaryWeatherPointId: "betsie_homestead_weather_context",
      basinRepresentation:
        "Modeled hourly light, cloud, and precipitation context near Homestead. It does not observe river level, clarity, or measured water temperature.",
      sourceNotes:
        "Open-Meteo point-weather adapter at the accepted Homestead context coordinates.",
    },
    stateRegulations: [
      {
        state: "MI",
        version: "michigan-2026-fishing-regulations-through-2027-03-31",
        jurisdiction:
          "Michigan DNR; Betsie River and Homestead seasonal closure rules",
        reminderCopy:
          "Fishing is closed within 300 feet of Homestead from August 1 through November 15 and within 100 feet from November 16 through July 31. Follow current regulations and signed boundaries.",
        accessAndSafetyNotes:
          "River Run reach names are orientation ranges, not public-access or safety determinations. The US-31–Homestead reach ends at the current signed closure, not at the structure.",
        sourceNotes:
          "Michigan DNR 2026 Fishing Regulations and Fisheries Order 204 material.",
      },
    ],
    evidenceNotes:
      "Foundation researched and approved 2026-08-10 in docs/river_run_betsie_copy_foundation.md. The public river model uses two named reaches: Betsie Lake–US-31 and US-31–Homestead, ending at the current signed closure. Lower/Middle/Upper terminology is prohibited. Michigan DNR describes limited fish passage at Homestead, so River Run treats it as a conservative public guidance endpoint without claiming absolute biological impassability. No accepted continuous hydraulic or measured-water-temperature source represents the corridor; Activity remains weather-only with Limited confidence.",
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
      "Run Stage and Fish In River remain deterministic daily primitives. Active-season refreshes support the explicitly weather-only Activity model using four-hour light, cloud, and precipitation windows; they do not imply a live hydraulic or measured-water-temperature observation.",
  },
  conditionDataCapabilities: {
    hydraulics: {
      status: "unavailable",
      notes:
        "No accepted live gauge is located at or below Homestead Dam and representative of the core migratory-fishing corridor. Remote or differently situated readings are not substituted.",
    },
    waterTemperature: {
      status: "unavailable",
      notes:
        "No accepted live measured-water-temperature source represents the below-Homestead migratory-fishing corridor. Air temperature is explicitly prohibited as a substitute.",
    },
  },
  supportStatus: "beta",
  gaugeLimitationCopy:
    "No sufficiently accurate and consistent live flow gauge or measured water-temperature sensor represents the Betsie below Homestead. Push, Fishability, and Migration Timing are unavailable. Activity is a Limited-confidence weather-only outlook; Run Stage and Fish In River remain seasonal context.",
  regulationReminderCopy:
    "Fishing is closed within 300 feet of Homestead's lamprey barrier and fish-passage facility from August 1 through November 15, and within 100 feet from November 16 through July 31. Follow current regulations and signed boundaries.",
};

export const BIG_MANISTEE_RIVER_PROFILE: RiverProfile = {
  riverId: "big_manistee",
  displayName: "Big Manistee River",
  state: "MI",
  region: "great_lakes",
  timezone: "America/Detroit",
  // USGS Manistee Lake context location; the condition engine uses the
  // Wellston/Tippy weather point below rather than this fallback coordinate.
  mouthLat: 44.2438918469541,
  mouthLon: -86.3034192845299,
  hydraulicSources: [
    {
      sourceId: "big_manistee_wellston_usgs",
      provider: "USGS",
      siteId: "04125550",
      name: "Manistee River near Wellston, MI — below Tippy Dam",
      role: "primary",
      primaryMetric: "flow_cfs",
      availableMetrics: ["flow_cfs", "gage_height_ft"],
      historyYearsAvailable: 29,
      maxAgeHours: 6,
      reachQuality: "good",
      reachNotes:
        "Official USGS station approximately 700 feet below Tippy Dam. It represents the Tippy tailwater and upper migratory corridor, not the full lower river. Discharge is the scored hydraulic metric; gage height remains context.",
    },
    {
      sourceId: "big_manistee_sherman_usgs_context",
      provider: "USGS",
      siteId: "04124000",
      name: "Manistee River near Sherman, MI — upstream context",
      role: "upstream_context",
      primaryMetric: "flow_cfs",
      availableMetrics: ["flow_cfs"],
      historyYearsAvailable: 29,
      maxAgeHours: 24,
      reachQuality: "acceptable",
      reachNotes:
        "Upstream contextual gauge above the Tippy reservoir system. It is never blended with Wellston and is not used as the primary migratory-reach signal.",
    },
  ],
  waterTemperatureSources: [
    {
      sourceId: "big_manistee_wellston_temperature",
      provider: "USGS",
      siteId: "04125550",
      name: "Manistee River near Wellston, MI — measured water temperature",
      role: "primary",
      priority: 1,
      sourceType: "same_gauge",
      maxAgeHours: 6,
      smoothingWindowHours: 3,
      minValidF: 30,
      maxValidF: 85,
      maxRateChangeFPerHour: 3,
      maxPeerDifferenceF: 5,
      reachNotes:
        "USGS parameter 00010 at the same below-Tippy station as the primary discharge. It is the primary measured-water signal for the gauged tailwater reach; air temperature is not substituted.",
      attribution:
        "U.S. Geological Survey Water Data for the Nation; continuous and daily values are provisional and subject to revision.",
    },
  ],
  weatherPoints: [
    {
      weatherPointId: "big_manistee_wellston_weather",
      lat: 44.259444593202346,
      lon: -85.94162479609616,
      role: "primary",
    },
  ],
  foundation: {
    version: "big-manistee-foundation-v2",
    corridorLengthMiles: 25,
    upstreamTerminus:
      "Tippy Dam; upstream obstruction and migratory-fishery terminus",
    downstreamTerminus:
      "Railroad bridge below M-55 / Manistee Lake approach; mouth and harbor are separate context",
    targetSpecies: ["chinook_salmon", "coho_salmon", "steelhead"],
    reaches: [
      {
        reachId: "big_manistee_tippy_tailwater",
        displayName: "Upper river (High Bridge–Tippy Dam)",
        order: 1,
        role: "tailwater",
        gaugeRepresented: true,
        notes:
          "The entire High Bridge–Tippy Dam corridor is the approved Upper river. The Tippy Dam area is the primary emphasis within it, not a fourth public section. Wellston constrains live-condition copy to this upper section.",
        sourceNotes:
          "Michigan DNR Tippy Dam Recreation Area General Management Plan; USGS 04125550 metadata and EGLE hydrologic report identifying the station approximately 700 feet below Tippy Dam.",
      },
      {
        reachId: "big_manistee_high_bridge_to_bear_creek",
        displayName: "Middle river (Bear Creek–High Bridge)",
        order: 2,
        role: "middle",
        gaugeRepresented: false,
        notes:
          "Middle corridor with distinct access and tributary context. Do not describe it as directly measured by Wellston.",
        sourceNotes:
          "Michigan DNR 2022–2023 Manistee River creel-survey segmentation and Tippy Dam management plan.",
      },
      {
        reachId: "big_manistee_bear_creek_to_m55",
        displayName: "Lower river (M-55–Bear Creek)",
        order: 3,
        role: "lower",
        gaugeRepresented: false,
        notes:
          "Lower migratory corridor toward Manistee Lake. Tributary, temperature, access, and hydraulic conditions can differ materially from the Tippy tailwater.",
        sourceNotes:
          "Michigan DNR 2022–2023 Manistee River creel-survey segmentation; Michigan DNR Type 3 legal boundary in FO-200.25.",
      },
      {
        reachId: "big_manistee_manistee_lake_harbor",
        displayName: "Manistee Lake, mouth, and harbor context",
        order: 4,
        role: "mouth_context",
        gaugeRepresented: false,
        notes:
          "Terminal lake/harbor context is not interchangeable with the freshwater tailwater gauge and must not receive Wellston-specific Fishability claims.",
        sourceNotes:
          "U.S. Fish and Wildlife Service Manistee River recreational corridor description; USGS Manistee Lake monitoring-location context.",
      },
    ],
    locations: [
      {
        locationId: "big_manistee_tippy_dam",
        officialName: "Tippy Dam",
        aliases: ["Tippy", "Tippy Hydroelectric Dam"],
        state: "MI",
        latitude: 44.2585,
        longitude: -85.9417,
        coordinateSource:
          "Michigan DNR Tippy Dam Recreation Area mapping; approximate structure point",
        coordinateStatus: "provisional",
        reachId: "big_manistee_tippy_tailwater",
        kind: "barrier",
        fishPassage: "impassable",
        publicUpstreamLimit: true,
        publicAccess: "restricted",
        fishingSuitability: {
          bank: "limited",
          wading: "unknown",
          boat: "limited",
        },
        beginnerSuitable: false,
        restrictionNotes:
          "Tippy Dam blocks upstream passage for Chinook, Coho, and Steelhead. River Run recommendations end below the dam. Follow current signs, booms, closures, and dam-safety notices.",
        sourceNotes:
          "Michigan DNR Slagle Creek Status Report 2014-183 and Manistee River Hodenpyl-to-Red Bridge Status Report 2004-2 explicitly state that Tippy Dam blocks upstream fish migration; passage last verified 2026-08-10.",
      },
    ],
    primaryGaugeReachId: "big_manistee_tippy_tailwater",
    contextualGaugeSiteIds: ["04124000", "04123500"],
    weatherStrategy: {
      mode: "single_point",
      primaryWeatherPointId: "big_manistee_wellston_weather",
      basinRepresentation:
        "Modeled Open-Meteo precipitation at the Wellston/Tippy target reach. It is contextual precursor evidence, not a rain-gauge observation and not a substitute for measured tailwater response.",
      sourceNotes:
        "Open-Meteo point-weather adapter; point selected to align precipitation context with the audited primary reach. A future multi-point basin weighting extension requires separate replay validation.",
    },
    regulation: {
      version: "michigan-fo-200.25-2025-effective-2026-regulations",
      legalReach:
        "Manistee River from Tippy Dam downstream to the railroad bridge below M-55 (T21N, R16W, S6)",
      waterType: "type_3",
      yearRoundTroutSalmon: true,
      rainbowTroutPossessionLimit:
        "Daily possession limit may include no more than one Rainbow Trout year-round on this reach.",
      specialArtificialLureWindow: {
        start: "08-01",
        end: "11-15",
        description:
          "Special artificial-lure/terminal-gear regulations apply during the August 1 through November 15 window; check the current Michigan regulations and Fisheries Orders.",
      },
      noUnverifiedDistanceClosureConfigured: true,
      accessAndSafetyNotes:
        "Do not invent a Tippy-specific distance closure. Follow current DNR closure notices, Consumers Energy safety information, signs, booms, and posted boundaries; methods can change by reach and season.",
      sourceNotes:
        "Michigan DNR FO-200.25, 2026 Michigan Fishing Regulations, current Tippy Dam Recreation Area page, and Consumers Energy dam-safety information.",
    },
    evidenceNotes:
      "Foundation reverified and owner-approved August 10, 2026. Public sections are Lower river (M-55–Bear Creek), Middle river (Bear Creek–High Bridge), and Upper river (High Bridge–Tippy Dam), with Tippy-area emphasis inside the Upper river. Tippy is an impassable upstream migration barrier. Wellston is completely regulated by Tippy and represents the Upper river only. No species timing, strength, presence curve, hydraulic threshold, or Fishability band is configured here.",
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
      "The observed Wellston discharge and measured-water-temperature feeds are available at approximately 15-minute cadence. Six four-hour condition slots plus the 21:00 Activity rollover provide current reads and the next-day outlook without changing species timing. Freshness, provisional status, and shared source gaps must be preserved.",
  },
  conditionDataCapabilities: {
    hydraulics: { status: "available" },
    waterTemperature: { status: "available" },
  },
  supportStatus: "beta",
  gaugeLimitationCopy:
    "Based on USGS 04125550 approximately 700 feet below Tippy Dam. It represents the Upper river (High Bridge–Tippy Dam), especially the Tippy Dam area. Conditions can differ in the Middle river, Lower river, Manistee Lake, and harbor.",
  regulationReminderCopy:
    "The Big Manistee below Tippy is a Type 3 reach extending to the railroad bridge below M-55, with a year-round one-Rainbow-Trout limit and special artificial-lure rules during the August 1–November 15 window. Follow current Michigan regulations, DNR closure notices, dam-safety information, and posted boundaries. Fishing methods can change by reach and season.",
};

export const MUSKEGON_RIVER_PROFILE: RiverProfile = {
  riverId: "muskegon",
  displayName: "Muskegon River",
  state: "MI",
  region: "great_lakes",
  timezone: "America/Detroit",
  mouthLat: 43.2473,
  mouthLon: -86.3312,
  hydraulicSources: [{
    sourceId: "muskegon_croton_usgs",
    provider: "USGS",
    siteId: "04121970",
    name: "Muskegon River near Croton, MI — below Croton Dam",
    role: "primary",
    primaryMetric: "flow_cfs",
    availableMetrics: ["flow_cfs", "gage_height_ft"],
    historyYearsAvailable: 30,
    maxAgeHours: 6,
    reachQuality: "good",
    reachNotes:
      "Official USGS station on the right bank 75 feet below Croton Drive and about 1,000 feet below Croton Dam. Flow is completely regulated by the dam. It represents the Croton tailwater, not the entire river to Muskegon Lake.",
  }],
  waterTemperatureSources: [{
    sourceId: "muskegon_croton_temperature",
    provider: "USGS",
    siteId: "04121970",
    name: "Muskegon River near Croton, MI — measured water temperature",
    role: "primary",
    priority: 1,
    sourceType: "same_gauge",
    maxAgeHours: 6,
    smoothingWindowHours: 3,
    minValidF: 30,
    maxValidF: 85,
    maxRateChangeFPerHour: 3,
    maxPeerDifferenceF: 5,
    reachNotes:
      "USGS parameter 00010 at the same below-Croton station as discharge. It is measured tailwater temperature; air temperature and upstream reservoir readings are not substitutes.",
    attribution:
      "U.S. Geological Survey Water Data for the Nation; continuous and daily values are provisional and subject to revision.",
  }],
  weatherPoints: [{
    weatherPointId: "muskegon_croton_weather",
    lat: 43.4347,
    lon: -85.6653,
    role: "primary",
  }],
  foundation: {
    version: "muskegon-foundation-v2",
    corridorLengthMiles: 42,
    upstreamTerminus:
      "Croton Dam; hard upstream barrier and migratory-fishery terminus",
    downstreamTerminus:
      "Muskegon Lake approach; Muskegon Lake and the Lake Michigan channel are separate staging context",
    targetSpecies: ["chinook_salmon", "coho_salmon", "steelhead"],
    reaches: [
      {
        reachId: "muskegon_croton_tailwater",
        displayName: "Upper river (Newaygo–Croton Dam)",
        order: 3,
        role: "tailwater",
        gaugeRepresented: true,
        notes:
          "The entire Newaygo–Croton Dam corridor is the approved Upper river. The Croton Dam area is the primary emphasis within it, not a fourth public section. USGS 04121970 directly represents only the immediate regulated tailwater.",
        sourceNotes:
          "USGS 04121970 station metadata; Michigan DNR Central Lake Michigan Management Unit access and fishery description.",
      },
      {
        reachId: "muskegon_m120_to_newaygo",
        displayName: "Middle river (M-120–Newaygo)",
        order: 2,
        role: "middle",
        gaugeRepresented: false,
        notes:
          "The approved middle migratory section. It is not directly represented by the Croton tailwater gauge, and public geography does not imply permission at every bank or parcel.",
        sourceNotes:
          "Michigan DNR Central Lake Michigan Management Unit; 2022–2023 Muskegon River creel survey Site 151.",
      },
      {
        reachId: "muskegon_lake_to_m120",
        displayName: "Lower river (Muskegon Lake–M-120)",
        order: 1,
        role: "lower",
        gaugeRepresented: false,
        notes:
          "The approved lakeward migratory section. It is generally deeper and not directly represented by the Croton tailwater gauge; submerged wood and reach-specific access require caution.",
        sourceNotes:
          "Michigan DNR Central Lake Michigan Management Unit; 2022–2023 Muskegon River creel survey Site 152.",
      },
      {
        reachId: "muskegon_lake_context",
        displayName: "Muskegon Lake, channel, and river-entrance context",
        order: 4,
        role: "mouth_context",
        gaugeRepresented: false,
        notes:
          "Staging context is separate from the Lower river and is not proof of river entry. It is not interchangeable with the Croton tailwater gauge.",
        sourceNotes:
          "Michigan DNR Central Lake Michigan Management Unit fishing-water descriptions.",
      },
    ],
    locations: [
      {
        locationId: "muskegon_croton_dam",
        officialName: "Croton Dam",
        aliases: ["Croton Hydroelectric Plant", "Croton Hardy Dam"],
        state: "MI",
        latitude: 43.4389,
        longitude: -85.6662,
        coordinateSource:
          "Michigan DNR Muskegon River access mapping; approximate structure point",
        coordinateStatus: "provisional",
        reachId: "muskegon_croton_tailwater",
        kind: "barrier",
        fishPassage: "impassable",
        publicUpstreamLimit: true,
        publicAccess: "restricted",
        fishingSuitability: {
          bank: "limited",
          wading: "unknown",
          boat: "limited",
        },
        beginnerSuitable: false,
        restrictionNotes:
          "Croton Dam blocks upstream passage for Chinook, Coho, and Steelhead. River Run recommendations end below the dam. Follow current signs, booms, closures, and dam-safety notices.",
        sourceNotes:
          "Michigan DNR Muskegon Lake Status Report 0448 (2025) states that Croton Dam is the first upstream fish-passage barrier and Lake Michigan and Muskegon Lake migratory fish cannot pass it; last verified 2026-08-11.",
      },
      {
        locationId: "muskegon_newaygo_dam_removed",
        officialName: "Newaygo Dam site",
        aliases: ["former Newaygo Dam"],
        state: "MI",
        latitude: 43.4222,
        longitude: -85.802,
        coordinateSource:
          "USGS 04122001 Bridge Street at Newaygo station metadata; approximate former-dam vicinity",
        coordinateStatus: "provisional",
        reachId: "muskegon_croton_tailwater",
        kind: "barrier",
        fishPassage: "passable",
        publicUpstreamLimit: false,
        publicAccess: "unknown",
        fishingSuitability: {
          bank: "unknown",
          wading: "unknown",
          boat: "unknown",
        },
        beginnerSuitable: false,
        restrictionNotes:
          "Newaygo Dam was completely removed in 1969. Never describe it as an active barrier, dam tailwater, or migration endpoint.",
        sourceNotes:
          "Michigan DNR Muskegon Lake Status Report 0448 (2025) and USGS 04122001 station history; removal status last verified 2026-08-11.",
      },
    ],
    primaryGaugeReachId: "muskegon_croton_tailwater",
    contextualGaugeSiteIds: ["04122001"],
    weatherStrategy: {
      mode: "single_point",
      primaryWeatherPointId: "muskegon_croton_weather",
      basinRepresentation:
        "Modeled precipitation at the Croton scored reach is precursor context only and never substitutes for measured discharge response.",
      sourceNotes:
        "Open-Meteo point-weather adapter aligned with the primary scored reach.",
    },
    regulation: {
      version: "michigan-fo-200.25-current-review-required",
      legalReach:
        "Muskegon River downstream from Croton Dam; rules vary by designated reach and must be checked in current Michigan regulations",
      waterType: "type_3",
      yearRoundTroutSalmon: true,
      rainbowTroutPossessionLimit:
        "Check the current Michigan Fishing Regulations and Fisheries Order FO-200 before fishing; limits and gear rules may change by reach and season.",
      specialArtificialLureWindow: {
        start: "08-01",
        end: "11-15",
        description:
          "Do not infer a special gear rule from another river. Check the current Muskegon reach listing and posted notices.",
      },
      noUnverifiedDistanceClosureConfigured: true,
      accessAndSafetyNotes:
        "Named reaches describe geography, not access permission. Use established public access, respect private land, posted closures, dam warnings, swift current, submerged wood, and current regulations.",
      sourceNotes:
        "Michigan DNR FO-200 and current fishing regulations; DNR Central Lake Michigan Management Unit; Consumers Energy Croton recreation and dam-safety information.",
    },
    evidenceNotes:
      "Foundation reverified and owner-approved August 11, 2026. Public sections are Lower river (Muskegon Lake–M-120), Middle river (M-120–Newaygo), and Upper river (Newaygo–Croton Dam), with Croton-area emphasis inside the Upper river. Croton Dam is the impassable upstream migration boundary for all three target species; Newaygo Dam was removed in 1969. USGS 04121970 is about 1,000 feet below Croton Dam and represents only the immediate regulated tailwater. USGS 04122001 at Newaygo is partial-record high-water context and powers no primitive.",
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
      "USGS 04121970 provides near-real-time discharge and measured water temperature. Six active daily refreshes preserve the regulated tailwater response during supported run windows, and the 21:00 refresh publishes a clearly labeled next-day Activity forecast.",
  },
  conditionDataCapabilities: {
    hydraulics: { status: "available" },
    waterTemperature: { status: "available" },
  },
  supportStatus: "beta",
  gaugeLimitationCopy:
    "Based on USGS 04121970 about 1,000 feet below Croton Dam. It represents the Croton Dam area within the Upper river (Newaygo–Croton Dam). Conditions can differ elsewhere in the Upper river, Middle river, Lower river, Muskegon Lake, and channel.",
  regulationReminderCopy:
    "Croton Dam is the hard upstream migration boundary. Fish only legal water below the dam, use established public access, respect private land and posted closures, and check current Michigan regulations and dam-safety notices.",
};

export const ST_JOSEPH_RIVER_PROFILE: RiverProfile = {
  riverId: "st_joseph",
  displayName: "St. Joseph River",
  state: "MI",
  presentationContexts: [
    {
      state: "MI",
      defaultReachId: "st_joseph_lower_michigan",
      regulationReminderCopy:
        "Use current Michigan regulations and posted notices in Michigan water. Fish ladders, dam safety zones, access rules, and legal methods can change; an Indiana selection does not describe this reach.",
    },
    {
      state: "IN",
      defaultReachId: "st_joseph_indiana",
      regulationReminderCopy:
        "Use current Indiana regulations and posted notices in Indiana water. No fishing is allowed within 100 feet of a fish-ladder entrance or exit; a Michigan selection does not describe this reach.",
    },
  ],
  region: "great_lakes",
  timezone: "America/Detroit",
  mouthLat: 42.1149,
  mouthLon: -86.4935,
  hydraulicSources: [
    {
      sourceId: "st_joseph_niles_usgs",
      provider: "USGS",
      siteId: "04101500",
      name: "St. Joseph River at Niles, MI",
      role: "primary",
      primaryMetric: "flow_cfs",
      availableMetrics: ["flow_cfs", "gage_height_ft"],
      historyYearsAvailable: 95,
      maxAgeHours: 6,
      reachQuality: "good",
      reachNotes:
        "Official USGS mainstem station about one mile downstream of the French Paper/Niles hydroelectric project. Discharge is the sole scored hydraulic metric. It represents the Niles reach, not the harbor, lower river, every dam tailwater, South Bend, Mishawaka, or Twin Branch.",
    },
    {
      sourceId: "st_joseph_mottville_usgs_context",
      provider: "USGS",
      siteId: "04101000",
      name: "St. Joseph River at Mottville, MI — upstream context",
      role: "upstream_context",
      primaryMetric: "flow_cfs",
      availableMetrics: ["flow_cfs", "gage_height_ft"],
      historyYearsAvailable: 80,
      maxAgeHours: 24,
      reachQuality: "acceptable",
      reachNotes:
        "Context above the supported Lake Michigan migratory corridor and above Twin Branch. It is never blended into St. Joseph scoring and cannot describe angling conditions below Twin Branch.",
    },
  ],
  waterTemperatureSources: [
    {
      sourceId: "st_joseph_niles_temperature",
      provider: "USGS",
      siteId: "04101500",
      name: "St. Joseph River at Niles, MI — measured water temperature",
      role: "primary",
      priority: 1,
      sourceType: "same_gauge",
      maxAgeHours: 6,
      smoothingWindowHours: 3,
      minValidF: 32,
      maxValidF: 85,
      maxRateChangeFPerHour: 3,
      maxPeerDifferenceF: 5,
      reachNotes:
        "USGS parameter 00010 at the same Niles station as primary discharge. It is the measured-water signal for the Niles reach and must not be described as direct measurement of Indiana or the lower river.",
      attribution:
        "U.S. Geological Survey Water Data for the Nation; continuous and daily values may be provisional and subject to revision.",
    },
  ],
  weatherPoints: [
    {
      weatherPointId: "st_joseph_niles_weather",
      lat: 41.8292138,
      lon: -86.2597325,
      role: "primary",
    },
  ],
  foundation: {
    version: "st-joseph-foundation-v1",
    corridorLengthMiles: 63,
    upstreamTerminus:
      "Base of Twin Branch Dam in Mishawaka; first impassable mainstem barrier",
    downstreamTerminus:
      "Lake Michigan at the St. Joseph harbor and river mouth",
    targetSpecies: ["chinook_salmon", "coho_salmon", "steelhead"],
    reaches: [
      {
        reachId: "st_joseph_harbor_mouth",
        displayName: "Lake Michigan staging water, harbor, and river mouth",
        order: 1,
        role: "harbor",
        gaugeRepresented: false,
        notes:
          "Lakeward staging and entry context. Niles flow and temperature do not directly measure this water.",
        sourceNotes:
          "Michigan DNR St. Joseph River Assessment and USGS/National Map mouth context.",
      },
      {
        reachId: "st_joseph_lower_michigan",
        displayName: "Lower river to Berrien Springs",
        order: 2,
        role: "lower",
        gaugeRepresented: false,
        notes:
          "Lower Michigan entry corridor through Benton Harbor and St. Joseph to the first passable dam at Berrien Springs.",
        sourceNotes:
          "Michigan DNR St. Joseph River Assessment; FERC French Paper environmental assessment river-mile sequence.",
      },
      {
        reachId: "st_joseph_middle_michigan",
        displayName: "Berrien Springs through Buchanan",
        order: 3,
        role: "middle",
        gaugeRepresented: false,
        notes:
          "Fish can continue through the Berrien Springs and Buchanan passage facilities; neither is the run-ending barrier.",
        sourceNotes:
          "Indiana DNR South Bend Fish Ladder program; FERC project sequence at river miles 24.6 and 35.2.",
      },
      {
        reachId: "st_joseph_niles",
        displayName: "Niles and the primary-gauge reach",
        order: 4,
        role: "middle",
        gaugeRepresented: true,
        notes:
          "The primary USGS flow and measured-temperature station represents this mainstem reach below the French Paper/Niles passage facility.",
        sourceNotes:
          "USGS 04101500 station inventory; FERC French Paper Project No. 10624 environmental assessment.",
      },
      {
        reachId: "st_joseph_indiana",
        displayName: "South Bend through Mishawaka",
        order: 5,
        role: "upper",
        gaugeRepresented: false,
        notes:
          "Indiana corridor through the passable Seitz Park and Central Park facilities. Conditions are not directly measured by the Niles gauge.",
        sourceNotes:
          "Indiana DNR South Bend Fish Ladder program; City of Mishawaka Central Park information.",
      },
      {
        reachId: "st_joseph_twin_branch",
        displayName: "Legal water below Twin Branch Dam",
        order: 6,
        role: "tailwater",
        gaugeRepresented: false,
        notes:
          "Final supported reach. The model and all upstream guidance stop at the base of Twin Branch Dam.",
        sourceNotes:
          "Indiana DNR South Bend Fish Ladder program and Bodine State Fish Hatchery corridor description.",
      },
    ],
    locations: [
      {
        locationId: "st_joseph_mouth",
        officialName: "St. Joseph River mouth",
        state: "MI",
        latitude: 42.1149,
        longitude: -86.4935,
        coordinateSource: "USGS National Map river-mouth context",
        coordinateStatus: "provisional",
        riverMile: 0,
        reachId: "st_joseph_harbor_mouth",
        kind: "landmark",
        fishPassage: "not_applicable",
        publicAccess: "unknown",
        fishingSuitability: { bank: "unknown", wading: "no", boat: "unknown" },
        beginnerSuitable: false,
        restrictionNotes:
          "Landmark only until individual harbor access, navigation, and seasonal rules are verified.",
        sourceNotes: "Michigan DNR St. Joseph River Assessment.",
      },
      {
        locationId: "st_joseph_berrien_springs_ladder",
        officialName: "Berrien Springs Dam fish ladder",
        aliases: ["Berrien Springs Dam"],
        state: "MI",
        latitude: 41.945,
        longitude: -86.32833333,
        coordinateSource: "Michigan EGLE Database of Michigan Regulated Dams",
        coordinateStatus: "verified",
        riverMile: 24.6,
        reachId: "st_joseph_lower_michigan",
        kind: "fish_ladder",
        fishPassage: "passable",
        publicAccess: "restricted",
        fishingSuitability: { bank: "unknown", wading: "no", boat: "no" },
        beginnerSuitable: false,
        restrictionNotes:
          "The ladder is fish passage, not a fishing destination. Verify current posted closures and dam safety boundaries before using nearby legal water.",
        sourceNotes:
          "Indiana DNR ladder sequence; Michigan EGLE dam coordinates; FERC river mile 24.6.",
      },
      {
        locationId: "st_joseph_buchanan_ladder",
        officialName: "Buchanan Dam fish ladder",
        aliases: ["Buchanan Dam"],
        state: "MI",
        latitude: 41.83909,
        longitude: -86.35126,
        coordinateSource:
          "Michigan Great Lakes Water Trails, Michigan Coastal Zone Management-funded location record",
        coordinateStatus: "verified",
        riverMile: 35.2,
        reachId: "st_joseph_middle_michigan",
        kind: "fish_ladder",
        fishPassage: "passable",
        publicAccess: "restricted",
        fishingSuitability: { bank: "unknown", wading: "no", boat: "no" },
        beginnerSuitable: false,
        restrictionNotes:
          "Do not direct anglers into the ladder or a posted dam safety zone. Nearby access requires separate verification.",
        sourceNotes:
          "Indiana DNR ladder sequence; FERC river mile 35.2; Michigan Great Lakes Water Trails coordinate record.",
      },
      {
        locationId: "st_joseph_french_paper_ladder",
        officialName: "French Paper Hydroelectric Project fish ladder",
        aliases: ["Niles Dam fish ladder", "French Paper Project Dam"],
        state: "MI",
        latitude: 41.817653,
        longitude: -86.259103,
        coordinateSource:
          "FERC Project No. 10624 environmental assessment project-location reference",
        coordinateStatus: "verified",
        riverMile: 44.5,
        reachId: "st_joseph_niles",
        kind: "fish_ladder",
        fishPassage: "passable",
        publicAccess: "restricted",
        fishingSuitability: { bank: "unknown", wading: "no", boat: "no" },
        beginnerSuitable: false,
        restrictionNotes:
          "This is the mainstem Niles passage facility, not the separate Dowagiac River structure also called Niles Dam. Follow posted project restrictions.",
        sourceNotes:
          "FERC Project No. 10624 at river mile 44.5; Indiana DNR calls the passage facility Niles.",
      },
      {
        locationId: "st_joseph_niles_gauge",
        officialName: "USGS 04101500 St. Joseph River at Niles, MI",
        state: "MI",
        latitude: 41.8292138,
        longitude: -86.2597325,
        coordinateSource: "USGS station inventory, NAD83 service metadata",
        coordinateStatus: "verified",
        reachId: "st_joseph_niles",
        kind: "gauge",
        fishPassage: "not_applicable",
        publicAccess: "not_public",
        fishingSuitability: { bank: "no", wading: "no", boat: "no" },
        beginnerSuitable: false,
        restrictionNotes:
          "Monitoring location only; it is not configured as public fishing access.",
        sourceNotes:
          "USGS station 04101500 inventory and Water Services metadata.",
      },
      {
        locationId: "st_joseph_south_bend_ladder",
        officialName: "South Bend Fish Ladder at Seitz Park",
        aliases: ["South Bend Dam fish ladder", "Seitz Park fish ladder"],
        state: "IN",
        latitude: 41.6783,
        longitude: -86.2462,
        coordinateSource: "City of South Bend Seitz Park project mapping",
        coordinateStatus: "provisional",
        riverMile: 58.2,
        reachId: "st_joseph_indiana",
        kind: "fish_ladder",
        fishPassage: "passable",
        publicAccess: "verified",
        fishingSuitability: { bank: "no", wading: "no", boat: "no" },
        beginnerSuitable: false,
        restrictionNotes:
          "The public may view the ladder, but Indiana prohibits fishing within 100 feet of its entrance and exit.",
        sourceNotes:
          "Indiana DNR South Bend Fish Ladder page; FERC South Bend Dam river mile 58.2; coordinate awaits final municipal GIS confirmation.",
      },
      {
        locationId: "st_joseph_mishawaka_ladder",
        officialName: "Mishawaka fish ladder at Central Park",
        aliases: ["Central Park fish ladder", "Mishawaka Dam fish ladder"],
        state: "IN",
        latitude: 41.6631,
        longitude: -86.1773,
        coordinateSource: "City of Mishawaka Central Park mapping",
        coordinateStatus: "provisional",
        riverMile: 62.2,
        reachId: "st_joseph_indiana",
        kind: "fish_ladder",
        fishPassage: "passable",
        publicAccess: "verified",
        fishingSuitability: { bank: "limited", wading: "no", boat: "no" },
        beginnerSuitable: false,
        restrictionNotes:
          "Central Park has public river-wall fishing, but Indiana prohibits fishing within 100 feet of the ladder entrance and exit. Posted boundaries control.",
        sourceNotes:
          "Indiana DNR ladder page; City of Mishawaka Central Park page; FERC calls this the Elkhart Dam at river mile 62.2.",
      },
      {
        locationId: "st_joseph_twin_branch_barrier",
        officialName: "Twin Branch Dam",
        state: "IN",
        latitude: 41.66574,
        longitude: -86.13267,
        coordinateSource: "City of Mishawaka Twin Branch Park mapping",
        coordinateStatus: "provisional",
        riverMile: 65.7,
        reachId: "st_joseph_twin_branch",
        kind: "barrier",
        fishPassage: "impassable",
        publicAccess: "restricted",
        fishingSuitability: { bank: "unknown", wading: "no", boat: "no" },
        beginnerSuitable: false,
        restrictionNotes:
          "Hard upstream limit. Never direct anglers above the dam or into posted safety zones; nearby legal access requires separate verification.",
        sourceNotes:
          "Indiana DNR defines the base of Twin Branch as the 63-mile upstream limit; FERC places it at river mile 65.7. Coordinate awaits final utility or municipal GIS confirmation.",
      },
    ],
    primaryGaugeReachId: "st_joseph_niles",
    contextualGaugeSiteIds: ["04101000"],
    weatherStrategy: {
      mode: "single_point",
      primaryWeatherPointId: "st_joseph_niles_weather",
      basinRepresentation:
        "Modeled point weather at Niles supplies restrained local context. It is not basin-wide observed rainfall and cannot substitute for measured mainstem response.",
      sourceNotes:
        "Open-Meteo point-weather adapter aligned with the primary Niles gauge reach.",
    },
    stateRegulations: [
      {
        state: "MI",
        version: "michigan-2026-reviewed-2026-08-09",
        jurisdiction:
          "Michigan water from Lake Michigan to the Indiana state line",
        reminderCopy:
          "Check the current Michigan Fishing Regulations, Fisheries Orders, posted dam restrictions, and access notices before fishing.",
        accessAndSafetyNotes:
          "Named structures are not automatic public access. Do not enter fish ladders, posted safety zones, private property, or water beyond personal boating or wading ability.",
        sourceNotes:
          "Michigan DNR 2026 Fishing Regulations and Michigan DNR St. Joseph River Assessment; release review completed August 9, 2026. Recheck current official rules each season.",
      },
      {
        state: "IN",
        version: "indiana-2026-2027-reviewed-2026-08-09",
        jurisdiction: "Indiana St. Joseph River below Twin Branch Dam",
        reminderCopy:
          "Check the current Indiana Fishing Guide and posted notices. No fishing is allowed within 100 feet of a fish-ladder entrance or exit.",
        accessAndSafetyNotes:
          "Use verified public access, respect private land, and stay outside posted dam and ladder boundaries. Twin Branch is the upstream endpoint.",
        sourceNotes:
          "Indiana DNR 2026-2027 Fishing Guide and South Bend Fish Ladder page; release review completed August 9, 2026. Recheck current official rules each season.",
      },
    ],
    evidenceNotes:
      "Canonical foundation researched and release-reviewed August 2026. The five intermediate dams have fish passage and are not biological endpoints. Twin Branch is the only configured impassable upstream barrier. Coordinates marked provisional cannot drive beginner-facing access guidance until final official GIS verification.",
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
      "USGS 04101500 reports near-real-time discharge and same-station measured water temperature. Six active daily refreshes reuse the regulated-river schedule while species windows remain unconfigured, and the 21:00 refresh publishes a clearly labeled next-day Activity forecast.",
  },
  conditionDataCapabilities: {
    hydraulics: { status: "available" },
    waterTemperature: { status: "available" },
  },
  supportStatus: "beta",
  gaugeLimitationCopy:
    "Based on the USGS gauge at Niles. It describes the Niles reach; the harbor, lower river, individual dam tailwaters, South Bend, Mishawaka, and Twin Branch may look different.",
  regulationReminderCopy:
    "Select Michigan or Indiana for the correct jurisdiction. Always verify current official regulations, public access, posted closures, and dam safety boundaries.",
};

export const RIVER_RUN_RIVER_PROFILES: RiverProfile[] = [
  PERE_MARQUETTE_RIVER_PROFILE,
  BETSIE_RIVER_PROFILE,
  BIG_MANISTEE_RIVER_PROFILE,
  MUSKEGON_RIVER_PROFILE,
  ST_JOSEPH_RIVER_PROFILE,
];
