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

export const RIVER_RUN_SPECIES_BIOLOGY_PROFILES: SpeciesBiologyProfile[] = [
  GREAT_LAKES_CHINOOK_BIOLOGY_PROFILE,
  GREAT_LAKES_COHO_BIOLOGY_PROFILE,
  GREAT_LAKES_STEELHEAD_FALL_ENTRY_BIOLOGY_PROFILE,
];
