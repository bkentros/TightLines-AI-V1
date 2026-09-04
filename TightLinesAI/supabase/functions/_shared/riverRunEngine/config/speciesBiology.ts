import type { SpeciesBiologyProfile } from "../types.ts";

export const GREAT_LAKES_CHINOOK_BIOLOGY_PROFILE: SpeciesBiologyProfile = {
  biologyProfileId: "great_lakes_chinook_v1",
  species: "chinook_salmon",
  commonName: "Chinook salmon",
  scientificName: "Oncorhynchus tshawytscha",
  region: "great_lakes",
  movementEngineId: "fall_cooling",
  migrationPurpose: "spawning",
  semelparous: true,
  adultMigrationTemperature: {
    supportiveMinF: 51,
    supportiveMaxF: 63,
    tooWarmF: 68,
    migrationBarrierF: 70,
  },
  environmentalResponse: {
    risingFlow: "supportive_within_fishable_bounds",
    precipitation: "precursor_only",
    strongSignalRequiresMeasuredGaugeResponse: true,
    peakFloodIsAutomaticallyPositive: false,
  },
  evidenceNotes:
    "Great Lakes adult Chinook are fall spawning migrants. Cooling water and a measured river rise can support upstream movement, while warm water and severe high flow constrain the signal. Precipitation is only a precursor and cannot substitute for a measured hydraulic response.",
  sourceNotes:
    "Michigan DNR Chinook profile https://www.michigan.gov/dnr/education/michigan-species/fish-species/chinook-salmon ; EPA Region 10 salmonid temperature issue paper https://www.epa.gov/sites/default/files/2018-01/documents/r10-water-quality-temperature-issue-paper5-2001.pdf . Profile values are Great Lakes fall-migration defaults; each river still requires its own timing, presence, hydraulics, sources, and replay audit.",
};

/** Pacific salmon profiles require river-specific measured-flow calibration. */
export const PACIFIC_FALL_CHINOOK_BIOLOGY_PROFILE: SpeciesBiologyProfile = {
  biologyProfileId: "pacific_fall_chinook_v1",
  species: "chinook_salmon",
  commonName: "Chinook Salmon",
  scientificName: "Oncorhynchus tshawytscha",
  region: "pacific_northwest",
  movementEngineId: "fall_cooling",
  migrationPurpose: "spawning",
  semelparous: true,
  adultMigrationTemperature: {
    supportiveMinF: 44,
    preferredMinF: 48,
    supportiveMaxF: 62,
    tooWarmF: 68,
    migrationBarrierF: 72,
  },
  environmentalResponse: {
    risingFlow: "supportive_within_fishable_bounds",
    precipitation: "precursor_only",
    strongSignalRequiresMeasuredGaugeResponse: true,
    peakFloodIsAutomaticallyPositive: false,
  },
  evidenceNotes:
    "Pacific fall Chinook are semelparous spawning migrants. Streamflow can alter adult migration timing, but each Push implementation must use a reach-representative gauge, river-specific rise thresholds, and a severe-flow fail-safe. Migration Stage and Seasonal Presence remain fixed river-specific calendars, while Activity remains conditional responsiveness.",
  sourceNotes:
    "NOAA Pacific salmon life-history material, EPA Region 10 salmonid temperature review, and river-specific WDFW/tribal evidence. Dates, endpoints, opportunity strength, measurements, and Activity remain river-specific.",
};

export const PACIFIC_FALL_COHO_BIOLOGY_PROFILE: SpeciesBiologyProfile = {
  biologyProfileId: "pacific_fall_coho_v1",
  species: "coho_salmon",
  commonName: "Coho Salmon",
  scientificName: "Oncorhynchus kisutch",
  region: "pacific_northwest",
  movementEngineId: "fall_cooling",
  migrationPurpose: "spawning",
  semelparous: true,
  adultMigrationTemperature: {
    supportiveMinF: 42,
    preferredMinF: 45,
    supportiveMaxF: 60,
    tooWarmF: 64,
    migrationBarrierF: 68,
  },
  environmentalResponse: {
    risingFlow: "supportive_within_fishable_bounds",
    precipitation: "precursor_only",
    strongSignalRequiresMeasuredGaugeResponse: true,
    peakFloodIsAutomaticallyPositive: false,
  },
  evidenceNotes:
    "Pacific coho are semelparous spawning migrants. Streamflow can alter adult migration timing, but each Push implementation must use a reach-representative gauge, river-specific rise thresholds, and a severe-flow fail-safe. A hydraulic event estimates movement support only and does not establish fish entry or abundance.",
  sourceNotes:
    "NOAA Pacific coho life-history material, EPA Region 10 salmonid temperature review, and river-specific WDFW/tribal evidence. Dates, endpoints, opportunity strength, measurements, and Activity remain river-specific.",
};

/**
 * Big Manistee-specific Chinook thermal profile. The shared Great Lakes
 * profile remains the PM/default biology contract; the regulated Tippy
 * tailwater needs its own adult-migration thresholds because Chinook can
 * enter while Wellston is still in the upper 60s, then respond to cooling
 * through the core fall window.
 */
export const BIG_MANISTEE_CHINOOK_BIOLOGY_PROFILE: SpeciesBiologyProfile = {
  biologyProfileId: "big_manistee_chinook_v1",
  species: "chinook_salmon",
  commonName: "Chinook salmon",
  scientificName: "Oncorhynchus tshawytscha",
  region: "great_lakes",
  movementEngineId: "fall_cooling",
  migrationPurpose: "spawning",
  semelparous: true,
  adultMigrationTemperature: {
    coldHoldingF: 43,
    supportiveMinF: 45,
    preferredMinF: 50,
    supportiveMaxF: 64,
    tooWarmF: 68,
    migrationBarrierF: 72,
  },
  environmentalResponse: {
    risingFlow: "supportive_within_fishable_bounds",
    precipitation: "precursor_only",
    strongSignalRequiresMeasuredGaugeResponse: true,
    peakFloodIsAutomaticallyPositive: false,
  },
  evidenceNotes:
    "Big Manistee adult Chinook can enter during warm late-summer water, but active fall movement is expected to become more reliable as the Wellston tailwater cools through the 60s and 50s. The profile is river-specific biology, not a live run-strength estimate.",
  sourceNotes:
    "Michigan DNR Chinook profile https://www.michigan.gov/dnr/education/michigan-species/fish-species/chinook-salmon ; Michigan DNR Manistee River below Tippy Dam report https://www.dnr.state.mi.us/publications/pdfs/DNRFishLibrary/StatusoftheFisheryResourceReports/0088_2004_ManisteeRiver.pdf ; EPA Region 10 salmonid temperature review https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=P100T9NB.TXT ; Big Manistee guide observations https://manisteeriverlodge.com/fishingreport/2024-archived-fishing-report/ . Wellston-specific values remain beta until replay and owner acceptance.",
};

export const MUSKEGON_CHINOOK_BIOLOGY_PROFILE: SpeciesBiologyProfile = {
  ...BIG_MANISTEE_CHINOOK_BIOLOGY_PROFILE,
  biologyProfileId: "muskegon_chinook_v1",
  evidenceNotes:
    "Muskegon adult Chinook can enter during warm late-summer tailwater, while cooling through the 60s and 50s improves active-movement context. These thresholds describe Croton-tailwater movement conditions, not abundance.",
  sourceNotes:
    "Michigan DNR Chinook profile and Muskegon River fishery descriptions; USGS 04121970 measured-water record; EPA salmonid temperature review.",
};

export const ST_JOSEPH_CHINOOK_BIOLOGY_PROFILE: SpeciesBiologyProfile = {
  ...BIG_MANISTEE_CHINOOK_BIOLOGY_PROFILE,
  biologyProfileId: "st_joseph_chinook_v1",
  evidenceNotes:
    "St. Joseph adult Chinook enter a large, warm interstate mainstem from late August. Cooling improves active movement, but the river-specific profile preserves plausible entry through the mid-60s and distinguishes the 68F warm constraint from the 72F migration barrier. These thresholds describe movement conditions at Niles, not abundance or passage through every ladder.",
  sourceNotes:
    "Indiana DNR Lake Michigan fall Chinook guidance; USGS 04101500 Niles measured-water archive; Michigan DNR Chinook biology; EPA salmonid temperature review. The profile is St. Joseph-specific and remains owner-gated pending live review.",
};

export const GREAT_LAKES_COHO_BIOLOGY_PROFILE: SpeciesBiologyProfile = {
  biologyProfileId: "great_lakes_coho_v1",
  species: "coho_salmon",
  commonName: "Coho salmon",
  scientificName: "Oncorhynchus kisutch",
  region: "great_lakes",
  movementEngineId: "fall_cooling",
  migrationPurpose: "spawning",
  semelparous: true,
  adultMigrationTemperature: {
    supportiveMinF: 50,
    supportiveMaxF: 62,
    tooWarmF: 68,
    migrationBarrierF: 70,
  },
  environmentalResponse: {
    risingFlow: "supportive_within_fishable_bounds",
    precipitation: "precursor_only",
    strongSignalRequiresMeasuredGaugeResponse: true,
    peakFloodIsAutomaticallyPositive: false,
  },
  evidenceNotes:
    "Great Lakes adult Coho are fall-to-early-winter spawning migrants. Cooling water and a measured river rise can support movement, but rain alone does not confirm a push and flood-stage water is not automatically favorable. The shared profile supplies biological defaults without supplying river-specific dates or abundance.",
  sourceNotes:
    "Michigan DNR Coho profile https://www.michigan.gov/dnr/education/michigan-species/fish-species/coho-salmon ; NOAA Great Lakes salmonid biological context https://www.fisheries.noaa.gov/ ; USDA Forest Service coho migration-temperature research https://research.fs.usda.gov/treesearch/65503 . Profile values are conservative Great Lakes fall-migration defaults rather than PM telemetry thresholds; each river still requires its own timing, presence, hydraulics, sources, and replay audit.",
};

export const GREAT_LAKES_STEELHEAD_FALL_ENTRY_BIOLOGY_PROFILE:
  SpeciesBiologyProfile = {
    biologyProfileId: "great_lakes_steelhead_fall_entry_v1",
    species: "steelhead",
    commonName: "Steelhead",
    scientificName: "Oncorhynchus mykiss",
    region: "great_lakes",
    movementEngineId: "fall_entry_cooling",
    migrationPurpose: "pre_spawn_overwintering",
    semelparous: false,
    adultMigrationTemperature: {
      coldHoldingF: 39,
      supportiveMinF: 40,
      preferredMinF: 46,
      supportiveMaxF: 52,
      tooWarmF: 60,
      migrationBarrierF: 70,
    },
    environmentalResponse: {
      risingFlow: "supportive_within_fishable_bounds",
      precipitation: "precursor_only",
      strongSignalRequiresMeasuredGaugeResponse: true,
      peakFloodIsAutomaticallyPositive: false,
    },
    evidenceNotes:
      "Great Lakes steelhead can enter tributaries in fall, overwinter, spawn in spring, and survive to return in later years. Cooling water and a measured river rise can support fall entry, while movement slows markedly around 39F even though fish remain present and can continue feeding. This profile therefore separates active fall entry from winter holding instead of applying a semelparous salmon exit curve.",
    sourceNotes:
      "Michigan DNR steelhead profile https://www.michigan.gov/dnr/education/michigan-species/fish-species/steelhead ; Workman et al. Pere Marquette telemetry reports water temperature as the dominant movement correlate and increased movement above approximately 4C/39F; Great Lakes tributary telemetry likewise documents near cessation of upstream movement near 4C. Temperature values are reusable Great Lakes fall-entry defaults; river dates, opportunity strength, sources, and hydraulics remain river-specific.",
  };

export const GREAT_LAKES_LAKE_RUN_BROWN_TROUT_BIOLOGY_PROFILE:
  SpeciesBiologyProfile = {
    biologyProfileId: "great_lakes_lake_run_brown_trout_v1",
    species: "lake_run_brown_trout",
    commonName: "Lake-run brown trout",
    scientificName: "Salmo trutta",
    region: "great_lakes",
    movementEngineId: "fall_repeat_spawner_cooling",
    migrationPurpose: "spawning",
    semelparous: false,
    adultMigrationTemperature: {
      coldHoldingF: 38,
      supportiveMinF: 40,
      preferredMinF: 44,
      supportiveMaxF: 58,
      tooWarmF: 64,
      migrationBarrierF: 70,
    },
    environmentalResponse: {
      risingFlow: "supportive_within_fishable_bounds",
      precipitation: "precursor_only",
      strongSignalRequiresMeasuredGaugeResponse: true,
      peakFloodIsAutomaticallyPositive: false,
    },
    evidenceNotes:
      "Great Lakes lake-run brown trout enter tributaries in fall to spawn. Unlike Chinook and Coho, they are repeat spawners: surviving adults may remain in tributary holding water or return to the lake after spawning. The engine therefore ends the tracked fall migration without applying salmon mortality or claiming all fish left the river.",
    sourceNotes:
      "Wisconsin DNR 2026 Fishing Report; Wisconsin DNR Lake Michigan trout and salmon questions; Wisconsin DNR Seeforellen brood program. Temperature values are conservative Great Lakes fall-migration defaults pending river-specific Activity replay.",
  };

export const RIVER_RUN_SPECIES_BIOLOGY_PROFILES: SpeciesBiologyProfile[] = [
  GREAT_LAKES_CHINOOK_BIOLOGY_PROFILE,
  GREAT_LAKES_COHO_BIOLOGY_PROFILE,
  GREAT_LAKES_STEELHEAD_FALL_ENTRY_BIOLOGY_PROFILE,
  GREAT_LAKES_LAKE_RUN_BROWN_TROUT_BIOLOGY_PROFILE,
];
