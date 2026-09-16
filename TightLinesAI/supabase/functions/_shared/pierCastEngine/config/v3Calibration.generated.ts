/* eslint-disable */
/**
 * GENERATED FILE — DO NOT HAND EDIT.
 * Source: Pass 1 evidence-reviewed, disabled runtime candidates.
 * Regenerate with npm run generate:pier-cast:v3-pass2-config.
 */
import type { PierCastV3PairCalibration } from "./v3Calibration.ts";

export const PIER_CAST_V3_CONFIG_VERSION = "piercast-v3-twelve-city-species-expansion-v4" as const;
export const PIER_CAST_V3_SOURCE_SCHEMA_VERSION = "piercast-v3-composite-source-v4" as const;
export const PIER_CAST_V3_SOURCE_SHA256 = "e8958fc021022f73bab2125bec4a20300adc4eb78890a6d3eafb806c33d00137" as const;
export const PIER_CAST_V3_CALIBRATION_SHA256 = "9770fac05f845c388e5aa9fd374b89e6236f822b09936fae3ebe955c2a9befb8" as const;
export const PIER_CAST_V3_RATING_ENABLED = false as const;
export const PIER_CAST_V3_PUBLIC_ENABLED = false as const;

export const PIER_CAST_V3_PAIR_CALIBRATIONS = [
  {
    "pairKey": "ludington_mi/chinook_salmon",
    "cityId": "ludington_mi",
    "speciesId": "chinook_salmon",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "ludington_mi__chinook_salmon__spring_nearshore_transient__v3_pass1",
        "modeId": "spring_nearshore_transient",
        "fisheryStrength": 5,
        "availabilityKnots": [
          {
            "monthDay": "03-15",
            "availability": 0
          },
          {
            "monthDay": "04-16",
            "availability": 0.35
          },
          {
            "monthDay": "05-14",
            "availability": 0.72
          },
          {
            "monthDay": "06-03",
            "availability": 1
          },
          {
            "monthDay": "06-12",
            "availability": 0.78
          },
          {
            "monthDay": "06-22",
            "availability": 0.32
          },
          {
            "monthDay": "06-30",
            "availability": 0
          }
        ],
        "thermalCurveId": "chinook_salmon__shared_temperature__v0_2",
        "modeName": "Spring nearshore transient",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "F5",
          "F6",
          "F10",
          "F41",
          "F43",
          "F44",
          "F45"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "ludington_mi__chinook_salmon__summer_coldwater_access__v3_pass1",
        "modeId": "summer_coldwater_access",
        "fisheryStrength": 5.1,
        "availabilityKnots": [
          {
            "monthDay": "06-01",
            "availability": 0
          },
          {
            "monthDay": "06-29",
            "availability": 0.35
          },
          {
            "monthDay": "07-24",
            "availability": 0.72
          },
          {
            "monthDay": "08-10",
            "availability": 1
          },
          {
            "monthDay": "08-14",
            "availability": 0.78
          },
          {
            "monthDay": "08-17",
            "availability": 0.32
          },
          {
            "monthDay": "08-20",
            "availability": 0
          }
        ],
        "thermalCurveId": "chinook_salmon__shared_temperature__v0_2",
        "modeName": "Summer cold-water access",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "F5",
          "F6",
          "F10",
          "F41",
          "F43",
          "F44",
          "F45"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "ludington_mi__chinook_salmon__fall_harbor_staging__v3_pass1",
        "modeId": "fall_harbor_staging",
        "fisheryStrength": 8.3,
        "availabilityKnots": [
          {
            "monthDay": "07-20",
            "availability": 0
          },
          {
            "monthDay": "08-05",
            "availability": 0.35
          },
          {
            "monthDay": "08-20",
            "availability": 0.72
          },
          {
            "monthDay": "08-30",
            "availability": 1
          },
          {
            "monthDay": "09-21",
            "availability": 0.78
          },
          {
            "monthDay": "10-14",
            "availability": 0.32
          },
          {
            "monthDay": "11-01",
            "availability": 0
          }
        ],
        "thermalCurveId": "chinook_salmon__shared_temperature__v0_2",
        "modeName": "Fall harbor staging",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "F5",
          "F6",
          "F10",
          "F41",
          "F43",
          "F44",
          "F45"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "ludington_mi/coho_salmon",
    "cityId": "ludington_mi",
    "speciesId": "coho_salmon",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "ludington_mi__coho_salmon__spring_nearshore__v3_pass1",
        "modeId": "spring_nearshore",
        "fisheryStrength": 2.8,
        "availabilityKnots": [
          {
            "monthDay": "02-15",
            "availability": 0
          },
          {
            "monthDay": "03-07",
            "availability": 0.35
          },
          {
            "monthDay": "03-24",
            "availability": 0.72
          },
          {
            "monthDay": "04-05",
            "availability": 1
          },
          {
            "monthDay": "05-05",
            "availability": 0.78
          },
          {
            "monthDay": "06-06",
            "availability": 0.32
          },
          {
            "monthDay": "06-30",
            "availability": 0
          }
        ],
        "thermalCurveId": "coho_salmon__shared_temperature__v0_2",
        "modeName": "Spring nearshore",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "F2",
          "F7",
          "F9",
          "F33",
          "F35",
          "F46",
          "F49"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "ludington_mi__coho_salmon__summer_coldwater_access__v3_pass1",
        "modeId": "summer_coldwater_access",
        "fisheryStrength": 2.7,
        "availabilityKnots": [
          {
            "monthDay": "06-10",
            "availability": 0
          },
          {
            "monthDay": "07-06",
            "availability": 0.35
          },
          {
            "monthDay": "07-30",
            "availability": 0.72
          },
          {
            "monthDay": "08-15",
            "availability": 1
          },
          {
            "monthDay": "08-19",
            "availability": 0.78
          },
          {
            "monthDay": "08-22",
            "availability": 0.32
          },
          {
            "monthDay": "08-25",
            "availability": 0
          }
        ],
        "thermalCurveId": "coho_salmon__shared_temperature__v0_2",
        "modeName": "Summer cold-water access",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "F2",
          "F7",
          "F9",
          "F33",
          "F35",
          "F46",
          "F49"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "ludington_mi__coho_salmon__fall_harbor_staging__v3_pass1",
        "modeId": "fall_harbor_staging",
        "fisheryStrength": 5.6,
        "availabilityKnots": [
          {
            "monthDay": "08-01",
            "availability": 0
          },
          {
            "monthDay": "09-02",
            "availability": 0.35
          },
          {
            "monthDay": "09-30",
            "availability": 0.72
          },
          {
            "monthDay": "10-20",
            "availability": 1
          },
          {
            "monthDay": "11-04",
            "availability": 0.78
          },
          {
            "monthDay": "11-19",
            "availability": 0.32
          },
          {
            "monthDay": "12-01",
            "availability": 0
          }
        ],
        "thermalCurveId": "coho_salmon__shared_temperature__v0_2",
        "modeName": "Fall harbor staging",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "F2",
          "F7",
          "F9",
          "F33",
          "F35",
          "F46",
          "F49"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "ludington_mi/steelhead",
    "cityId": "ludington_mi",
    "speciesId": "steelhead",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "ludington_mi__steelhead__winter_spring_thermal_front__v3_pass1",
        "modeId": "winter_spring_thermal_front",
        "fisheryStrength": 6,
        "availabilityKnots": [
          {
            "monthDay": "01-01",
            "availability": 0.55
          },
          {
            "monthDay": "03-15",
            "availability": 0.8
          },
          {
            "monthDay": "04-15",
            "availability": 1
          },
          {
            "monthDay": "05-15",
            "availability": 0.35
          },
          {
            "monthDay": "06-01",
            "availability": 0
          },
          {
            "monthDay": "11-15",
            "availability": 0
          },
          {
            "monthDay": "12-31",
            "availability": 0.55
          }
        ],
        "thermalCurveId": "steelhead__shared_temperature__v0_2",
        "modeName": "Winter and spring thermal-front opportunity",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "F1",
          "F2",
          "F3",
          "F4",
          "F33",
          "F35",
          "F49",
          "F50"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "ludington_mi__steelhead__summer_thermal_break_or_upwelling__v3_pass1",
        "modeId": "summer_thermal_break_or_upwelling",
        "fisheryStrength": 3,
        "availabilityKnots": [
          {
            "monthDay": "05-20",
            "availability": 0
          },
          {
            "monthDay": "05-25",
            "availability": 0.35
          },
          {
            "monthDay": "05-29",
            "availability": 0.72
          },
          {
            "monthDay": "06-01",
            "availability": 1
          },
          {
            "monthDay": "07-06",
            "availability": 0.78
          },
          {
            "monthDay": "08-13",
            "availability": 0.32
          },
          {
            "monthDay": "09-10",
            "availability": 0
          }
        ],
        "thermalCurveId": "steelhead__shared_temperature__v0_2",
        "modeName": "Summer thermal break or upwelling",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "F1",
          "F2",
          "F3",
          "F4",
          "F33",
          "F35",
          "F49",
          "F50"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "ludington_mi__steelhead__fall_harbor_staging__v3_pass1",
        "modeId": "fall_harbor_staging",
        "fisheryStrength": 8.1,
        "availabilityKnots": [
          {
            "monthDay": "08-25",
            "availability": 0
          },
          {
            "monthDay": "09-16",
            "availability": 0.35
          },
          {
            "monthDay": "10-06",
            "availability": 0.72
          },
          {
            "monthDay": "10-20",
            "availability": 1
          },
          {
            "monthDay": "11-09",
            "availability": 0.78
          },
          {
            "monthDay": "11-29",
            "availability": 0.32
          },
          {
            "monthDay": "12-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "steelhead__shared_temperature__v0_2",
        "modeName": "Fall harbor staging",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "F1",
          "F2",
          "F3",
          "F4",
          "F33",
          "F35",
          "F49",
          "F50"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "ludington_mi/brown_trout",
    "cityId": "ludington_mi",
    "speciesId": "brown_trout",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "ludington_mi__brown_trout__winter_harbor_open_water__v3_pass1",
        "modeId": "winter_harbor_open_water",
        "fisheryStrength": 4.9,
        "availabilityKnots": [
          {
            "monthDay": "01-01",
            "availability": 0.9
          },
          {
            "monthDay": "01-15",
            "availability": 1
          },
          {
            "monthDay": "03-01",
            "availability": 0.65
          },
          {
            "monthDay": "04-01",
            "availability": 0
          },
          {
            "monthDay": "10-15",
            "availability": 0
          },
          {
            "monthDay": "11-15",
            "availability": 0.45
          },
          {
            "monthDay": "12-31",
            "availability": 0.9
          }
        ],
        "thermalCurveId": "brown_trout__shared_temperature__v0_2",
        "modeName": "Winter harbor open water",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "F1",
          "F2",
          "F39",
          "F46",
          "F47",
          "M2"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "ludington_mi__brown_trout__spring_nearshore__v3_pass1",
        "modeId": "spring_nearshore",
        "fisheryStrength": 7.6,
        "availabilityKnots": [
          {
            "monthDay": "02-15",
            "availability": 0
          },
          {
            "monthDay": "03-07",
            "availability": 0.35
          },
          {
            "monthDay": "03-24",
            "availability": 0.72
          },
          {
            "monthDay": "04-05",
            "availability": 1
          },
          {
            "monthDay": "05-10",
            "availability": 0.78
          },
          {
            "monthDay": "06-17",
            "availability": 0.32
          },
          {
            "monthDay": "07-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "brown_trout__shared_temperature__v0_2",
        "modeName": "Spring nearshore",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "F1",
          "F2",
          "F39",
          "F46",
          "F47",
          "M2"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "ludington_mi__brown_trout__fall_harbor__v3_pass1",
        "modeId": "fall_harbor",
        "fisheryStrength": 2.7,
        "availabilityKnots": [
          {
            "monthDay": "08-01",
            "availability": 0
          },
          {
            "monthDay": "09-12",
            "availability": 0.35
          },
          {
            "monthDay": "10-20",
            "availability": 0.72
          },
          {
            "monthDay": "11-15",
            "availability": 1
          },
          {
            "monthDay": "11-21",
            "availability": 0.78
          },
          {
            "monthDay": "11-27",
            "availability": 0.32
          },
          {
            "monthDay": "12-01",
            "availability": 0
          }
        ],
        "thermalCurveId": "brown_trout__shared_temperature__v0_2",
        "modeName": "Fall harbor",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "F1",
          "F2",
          "F39",
          "F46",
          "F47",
          "M2"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "grand_haven_mi/chinook_salmon",
    "cityId": "grand_haven_mi",
    "speciesId": "chinook_salmon",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "grand_haven_mi__chinook_salmon__spring_nearshore_transient__v3_pass1",
        "modeId": "spring_nearshore_transient",
        "fisheryStrength": 3.8,
        "availabilityKnots": [
          {
            "monthDay": "03-15",
            "availability": 0
          },
          {
            "monthDay": "04-08",
            "availability": 0.35
          },
          {
            "monthDay": "04-30",
            "availability": 0.72
          },
          {
            "monthDay": "05-15",
            "availability": 1
          },
          {
            "monthDay": "05-31",
            "availability": 0.78
          },
          {
            "monthDay": "06-17",
            "availability": 0.32
          },
          {
            "monthDay": "06-30",
            "availability": 0
          }
        ],
        "thermalCurveId": "chinook_salmon__shared_temperature__v0_2",
        "modeName": "Spring nearshore transient",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "F12",
          "F18",
          "F43",
          "F44",
          "F45",
          "F48",
          "M1"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "grand_haven_mi__chinook_salmon__summer_coldwater_access__v3_pass1",
        "modeId": "summer_coldwater_access",
        "fisheryStrength": 4.7,
        "availabilityKnots": [
          {
            "monthDay": "06-01",
            "availability": 0
          },
          {
            "monthDay": "06-29",
            "availability": 0.35
          },
          {
            "monthDay": "07-24",
            "availability": 0.72
          },
          {
            "monthDay": "08-10",
            "availability": 1
          },
          {
            "monthDay": "08-14",
            "availability": 0.78
          },
          {
            "monthDay": "08-17",
            "availability": 0.32
          },
          {
            "monthDay": "08-20",
            "availability": 0
          }
        ],
        "thermalCurveId": "chinook_salmon__shared_temperature__v0_2",
        "modeName": "Summer cold-water access",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "F12",
          "F18",
          "F43",
          "F44",
          "F45",
          "F48",
          "M1"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "grand_haven_mi__chinook_salmon__fall_harbor_staging__v3_pass1",
        "modeId": "fall_harbor_staging",
        "fisheryStrength": 7.8,
        "availabilityKnots": [
          {
            "monthDay": "07-20",
            "availability": 0
          },
          {
            "monthDay": "08-09",
            "availability": 0.35
          },
          {
            "monthDay": "08-27",
            "availability": 0.72
          },
          {
            "monthDay": "09-08",
            "availability": 1
          },
          {
            "monthDay": "09-27",
            "availability": 0.78
          },
          {
            "monthDay": "10-17",
            "availability": 0.32
          },
          {
            "monthDay": "11-01",
            "availability": 0
          }
        ],
        "thermalCurveId": "chinook_salmon__shared_temperature__v0_2",
        "modeName": "Fall harbor staging",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "F12",
          "F18",
          "F43",
          "F44",
          "F45",
          "F48",
          "M1"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "grand_haven_mi/coho_salmon",
    "cityId": "grand_haven_mi",
    "speciesId": "coho_salmon",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "grand_haven_mi__coho_salmon__spring_nearshore__v3_pass1",
        "modeId": "spring_nearshore",
        "fisheryStrength": 6.8,
        "availabilityKnots": [
          {
            "monthDay": "02-15",
            "availability": 0
          },
          {
            "monthDay": "03-19",
            "availability": 0.35
          },
          {
            "monthDay": "04-17",
            "availability": 0.72
          },
          {
            "monthDay": "05-07",
            "availability": 1
          },
          {
            "monthDay": "05-26",
            "availability": 0.78
          },
          {
            "monthDay": "06-15",
            "availability": 0.32
          },
          {
            "monthDay": "06-30",
            "availability": 0
          }
        ],
        "thermalCurveId": "coho_salmon__shared_temperature__v0_2",
        "modeName": "Spring nearshore",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "F16",
          "F17",
          "F37",
          "F46",
          "F47",
          "F52",
          "M1"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "grand_haven_mi__coho_salmon__summer_coldwater_access__v3_pass1",
        "modeId": "summer_coldwater_access",
        "fisheryStrength": 4.3,
        "availabilityKnots": [
          {
            "monthDay": "06-10",
            "availability": 0
          },
          {
            "monthDay": "07-06",
            "availability": 0.35
          },
          {
            "monthDay": "07-30",
            "availability": 0.72
          },
          {
            "monthDay": "08-15",
            "availability": 1
          },
          {
            "monthDay": "08-19",
            "availability": 0.78
          },
          {
            "monthDay": "08-22",
            "availability": 0.32
          },
          {
            "monthDay": "08-25",
            "availability": 0
          }
        ],
        "thermalCurveId": "coho_salmon__shared_temperature__v0_2",
        "modeName": "Summer cold-water access",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "F16",
          "F17",
          "F37",
          "F46",
          "F47",
          "F52",
          "M1"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "grand_haven_mi__coho_salmon__fall_harbor_staging__v3_pass1",
        "modeId": "fall_harbor_staging",
        "fisheryStrength": 8.8,
        "availabilityKnots": [
          {
            "monthDay": "08-01",
            "availability": 0
          },
          {
            "monthDay": "08-17",
            "availability": 0.35
          },
          {
            "monthDay": "08-31",
            "availability": 0.72
          },
          {
            "monthDay": "09-10",
            "availability": 1
          },
          {
            "monthDay": "10-09",
            "availability": 0.78
          },
          {
            "monthDay": "11-08",
            "availability": 0.32
          },
          {
            "monthDay": "12-01",
            "availability": 0
          }
        ],
        "thermalCurveId": "coho_salmon__shared_temperature__v0_2",
        "modeName": "Fall harbor staging",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "F16",
          "F17",
          "F37",
          "F46",
          "F47",
          "F52",
          "M1"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "grand_haven_mi/steelhead",
    "cityId": "grand_haven_mi",
    "speciesId": "steelhead",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "grand_haven_mi__steelhead__winter_spring_thermal_front__v3_pass1",
        "modeId": "winter_spring_thermal_front",
        "fisheryStrength": 7.1,
        "availabilityKnots": [
          {
            "monthDay": "01-01",
            "availability": 0.55
          },
          {
            "monthDay": "03-15",
            "availability": 0.8
          },
          {
            "monthDay": "04-15",
            "availability": 1
          },
          {
            "monthDay": "05-15",
            "availability": 0.35
          },
          {
            "monthDay": "06-01",
            "availability": 0
          },
          {
            "monthDay": "11-15",
            "availability": 0
          },
          {
            "monthDay": "12-31",
            "availability": 0.55
          }
        ],
        "thermalCurveId": "steelhead__shared_temperature__v0_2",
        "modeName": "Winter and spring thermal-front opportunity",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "F13",
          "F14",
          "F15",
          "F34",
          "F38",
          "F42",
          "F43",
          "F49",
          "F50"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "grand_haven_mi__steelhead__summer_thermal_break_or_upwelling__v3_pass1",
        "modeId": "summer_thermal_break_or_upwelling",
        "fisheryStrength": 8.8,
        "availabilityKnots": [
          {
            "monthDay": "05-20",
            "availability": 0
          },
          {
            "monthDay": "05-30",
            "availability": 0.35
          },
          {
            "monthDay": "06-09",
            "availability": 0.72
          },
          {
            "monthDay": "06-15",
            "availability": 1
          },
          {
            "monthDay": "07-15",
            "availability": 0.78
          },
          {
            "monthDay": "08-17",
            "availability": 0.32
          },
          {
            "monthDay": "09-10",
            "availability": 0
          }
        ],
        "thermalCurveId": "steelhead__shared_temperature__v0_2",
        "modeName": "Summer thermal break or upwelling",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "F13",
          "F14",
          "F15",
          "F34",
          "F38",
          "F42",
          "F43",
          "F49",
          "F50"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "grand_haven_mi__steelhead__fall_harbor_staging__v3_pass1",
        "modeId": "fall_harbor_staging",
        "fisheryStrength": 9.2,
        "availabilityKnots": [
          {
            "monthDay": "08-25",
            "availability": 0
          },
          {
            "monthDay": "09-20",
            "availability": 0.35
          },
          {
            "monthDay": "10-14",
            "availability": 0.72
          },
          {
            "monthDay": "10-30",
            "availability": 1
          },
          {
            "monthDay": "11-15",
            "availability": 0.78
          },
          {
            "monthDay": "12-02",
            "availability": 0.32
          },
          {
            "monthDay": "12-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "steelhead__shared_temperature__v0_2",
        "modeName": "Fall harbor staging",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "F13",
          "F14",
          "F15",
          "F34",
          "F38",
          "F42",
          "F43",
          "F49",
          "F50"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "grand_haven_mi/brown_trout",
    "cityId": "grand_haven_mi",
    "speciesId": "brown_trout",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "grand_haven_mi__brown_trout__winter_harbor_open_water__v3_pass1",
        "modeId": "winter_harbor_open_water",
        "fisheryStrength": 5,
        "availabilityKnots": [
          {
            "monthDay": "01-01",
            "availability": 0.9
          },
          {
            "monthDay": "01-15",
            "availability": 1
          },
          {
            "monthDay": "03-01",
            "availability": 0.65
          },
          {
            "monthDay": "04-01",
            "availability": 0
          },
          {
            "monthDay": "10-15",
            "availability": 0
          },
          {
            "monthDay": "11-15",
            "availability": 0.45
          },
          {
            "monthDay": "12-31",
            "availability": 0.9
          }
        ],
        "thermalCurveId": "brown_trout__shared_temperature__v0_2",
        "modeName": "Winter harbor open water",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "F13",
          "F16",
          "F36",
          "F46",
          "F47",
          "M2"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "grand_haven_mi__brown_trout__spring_nearshore__v3_pass1",
        "modeId": "spring_nearshore",
        "fisheryStrength": 7.6,
        "availabilityKnots": [
          {
            "monthDay": "02-15",
            "availability": 0
          },
          {
            "monthDay": "03-11",
            "availability": 0.35
          },
          {
            "monthDay": "03-31",
            "availability": 0.72
          },
          {
            "monthDay": "04-15",
            "availability": 1
          },
          {
            "monthDay": "05-17",
            "availability": 0.78
          },
          {
            "monthDay": "06-20",
            "availability": 0.32
          },
          {
            "monthDay": "07-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "brown_trout__shared_temperature__v0_2",
        "modeName": "Spring nearshore",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "F13",
          "F16",
          "F36",
          "F46",
          "F47",
          "M2"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "grand_haven_mi__brown_trout__fall_harbor__v3_pass1",
        "modeId": "fall_harbor",
        "fisheryStrength": 2.9,
        "availabilityKnots": [
          {
            "monthDay": "08-01",
            "availability": 0
          },
          {
            "monthDay": "09-12",
            "availability": 0.35
          },
          {
            "monthDay": "10-20",
            "availability": 0.72
          },
          {
            "monthDay": "11-15",
            "availability": 1
          },
          {
            "monthDay": "11-21",
            "availability": 0.78
          },
          {
            "monthDay": "11-27",
            "availability": 0.32
          },
          {
            "monthDay": "12-01",
            "availability": 0
          }
        ],
        "thermalCurveId": "brown_trout__shared_temperature__v0_2",
        "modeName": "Fall harbor",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "F13",
          "F16",
          "F36",
          "F46",
          "F47",
          "M2"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "manistee_mi/chinook_salmon",
    "cityId": "manistee_mi",
    "speciesId": "chinook_salmon",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "manistee_mi__chinook_salmon__spring_nearshore_transient__v3_pass1",
        "modeId": "spring_nearshore_transient",
        "fisheryStrength": 6.5,
        "availabilityKnots": [
          {
            "monthDay": "03-15",
            "availability": 0
          },
          {
            "monthDay": "04-16",
            "availability": 0.35
          },
          {
            "monthDay": "05-14",
            "availability": 0.72
          },
          {
            "monthDay": "06-03",
            "availability": 1
          },
          {
            "monthDay": "06-12",
            "availability": 0.78
          },
          {
            "monthDay": "06-22",
            "availability": 0.32
          },
          {
            "monthDay": "06-30",
            "availability": 0
          }
        ],
        "thermalCurveId": "chinook_salmon__shared_temperature__v0_2",
        "modeName": "Spring nearshore transient",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "F5",
          "F6",
          "F10",
          "F41",
          "F43",
          "F44",
          "F45",
          "F51"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "manistee_mi__chinook_salmon__summer_coldwater_access__v3_pass1",
        "modeId": "summer_coldwater_access",
        "fisheryStrength": 6.5,
        "availabilityKnots": [
          {
            "monthDay": "06-01",
            "availability": 0
          },
          {
            "monthDay": "06-29",
            "availability": 0.35
          },
          {
            "monthDay": "07-24",
            "availability": 0.72
          },
          {
            "monthDay": "08-10",
            "availability": 1
          },
          {
            "monthDay": "08-14",
            "availability": 0.78
          },
          {
            "monthDay": "08-17",
            "availability": 0.32
          },
          {
            "monthDay": "08-20",
            "availability": 0
          }
        ],
        "thermalCurveId": "chinook_salmon__shared_temperature__v0_2",
        "modeName": "Summer cold-water access",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "F5",
          "F6",
          "F10",
          "F41",
          "F43",
          "F44",
          "F45",
          "F51"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "manistee_mi__chinook_salmon__fall_harbor_staging__v3_pass1",
        "modeId": "fall_harbor_staging",
        "fisheryStrength": 9.5,
        "availabilityKnots": [
          {
            "monthDay": "07-20",
            "availability": 0
          },
          {
            "monthDay": "08-05",
            "availability": 0.35
          },
          {
            "monthDay": "08-20",
            "availability": 0.72
          },
          {
            "monthDay": "08-30",
            "availability": 1
          },
          {
            "monthDay": "09-21",
            "availability": 0.78
          },
          {
            "monthDay": "10-14",
            "availability": 0.32
          },
          {
            "monthDay": "11-01",
            "availability": 0
          }
        ],
        "thermalCurveId": "chinook_salmon__shared_temperature__v0_2",
        "modeName": "Fall harbor staging",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "F5",
          "F6",
          "F10",
          "F41",
          "F43",
          "F44",
          "F45",
          "F51"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "manistee_mi/coho_salmon",
    "cityId": "manistee_mi",
    "speciesId": "coho_salmon",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "manistee_mi__coho_salmon__spring_nearshore__v3_pass1",
        "modeId": "spring_nearshore",
        "fisheryStrength": 3.8,
        "availabilityKnots": [
          {
            "monthDay": "02-15",
            "availability": 0
          },
          {
            "monthDay": "03-21",
            "availability": 0.35
          },
          {
            "monthDay": "04-19",
            "availability": 0.72
          },
          {
            "monthDay": "05-10",
            "availability": 1
          },
          {
            "monthDay": "05-28",
            "availability": 0.78
          },
          {
            "monthDay": "06-16",
            "availability": 0.32
          },
          {
            "monthDay": "06-30",
            "availability": 0
          }
        ],
        "thermalCurveId": "coho_salmon__shared_temperature__v0_2",
        "modeName": "Spring nearshore",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "A12",
          "F2",
          "F25",
          "F26",
          "F35",
          "F36",
          "F41",
          "F51"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "manistee_mi__coho_salmon__summer_coldwater_access__v3_pass1",
        "modeId": "summer_coldwater_access",
        "fisheryStrength": 3.5,
        "availabilityKnots": [
          {
            "monthDay": "06-10",
            "availability": 0
          },
          {
            "monthDay": "07-06",
            "availability": 0.35
          },
          {
            "monthDay": "07-30",
            "availability": 0.72
          },
          {
            "monthDay": "08-15",
            "availability": 1
          },
          {
            "monthDay": "08-19",
            "availability": 0.78
          },
          {
            "monthDay": "08-22",
            "availability": 0.32
          },
          {
            "monthDay": "08-25",
            "availability": 0
          }
        ],
        "thermalCurveId": "coho_salmon__shared_temperature__v0_2",
        "modeName": "Summer cold-water access",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "A12",
          "F2",
          "F25",
          "F26",
          "F35",
          "F36",
          "F41",
          "F51"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "manistee_mi__coho_salmon__fall_harbor_staging__v3_pass1",
        "modeId": "fall_harbor_staging",
        "fisheryStrength": 8.2,
        "availabilityKnots": [
          {
            "monthDay": "08-01",
            "availability": 0
          },
          {
            "monthDay": "08-27",
            "availability": 0.35
          },
          {
            "monthDay": "09-19",
            "availability": 0.72
          },
          {
            "monthDay": "10-05",
            "availability": 1
          },
          {
            "monthDay": "10-25",
            "availability": 0.78
          },
          {
            "monthDay": "11-15",
            "availability": 0.32
          },
          {
            "monthDay": "12-01",
            "availability": 0
          }
        ],
        "thermalCurveId": "coho_salmon__shared_temperature__v0_2",
        "modeName": "Fall harbor staging",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "A12",
          "F2",
          "F25",
          "F26",
          "F35",
          "F36",
          "F41",
          "F51"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "manistee_mi/steelhead",
    "cityId": "manistee_mi",
    "speciesId": "steelhead",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "manistee_mi__steelhead__winter_spring_thermal_front__v3_pass1",
        "modeId": "winter_spring_thermal_front",
        "fisheryStrength": 6.8,
        "availabilityKnots": [
          {
            "monthDay": "01-01",
            "availability": 0.55
          },
          {
            "monthDay": "03-15",
            "availability": 0.8
          },
          {
            "monthDay": "04-15",
            "availability": 1
          },
          {
            "monthDay": "05-15",
            "availability": 0.35
          },
          {
            "monthDay": "06-01",
            "availability": 0
          },
          {
            "monthDay": "11-15",
            "availability": 0
          },
          {
            "monthDay": "12-31",
            "availability": 0.55
          }
        ],
        "thermalCurveId": "steelhead__shared_temperature__v0_2",
        "modeName": "Winter and spring thermal-front opportunity",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "A12",
          "F1",
          "F3",
          "F4",
          "F23",
          "F24",
          "F25",
          "F27",
          "F35",
          "F42",
          "F49"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "manistee_mi__steelhead__summer_thermal_break_or_upwelling__v3_pass1",
        "modeId": "summer_thermal_break_or_upwelling",
        "fisheryStrength": 4.8,
        "availabilityKnots": [
          {
            "monthDay": "05-20",
            "availability": 0
          },
          {
            "monthDay": "06-04",
            "availability": 0.35
          },
          {
            "monthDay": "06-17",
            "availability": 0.72
          },
          {
            "monthDay": "06-26",
            "availability": 1
          },
          {
            "monthDay": "07-23",
            "availability": 0.78
          },
          {
            "monthDay": "08-20",
            "availability": 0.32
          },
          {
            "monthDay": "09-10",
            "availability": 0
          }
        ],
        "thermalCurveId": "steelhead__shared_temperature__v0_2",
        "modeName": "Summer thermal break or upwelling",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "A12",
          "F1",
          "F3",
          "F4",
          "F23",
          "F24",
          "F25",
          "F27",
          "F35",
          "F42",
          "F49"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "manistee_mi__steelhead__fall_harbor_staging__v3_pass1",
        "modeId": "fall_harbor_staging",
        "fisheryStrength": 10,
        "availabilityKnots": [
          {
            "monthDay": "08-25",
            "availability": 0
          },
          {
            "monthDay": "09-20",
            "availability": 0.35
          },
          {
            "monthDay": "10-12",
            "availability": 0.72
          },
          {
            "monthDay": "10-28",
            "availability": 1
          },
          {
            "monthDay": "11-14",
            "availability": 0.78
          },
          {
            "monthDay": "12-02",
            "availability": 0.32
          },
          {
            "monthDay": "12-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "steelhead__shared_temperature__v0_2",
        "modeName": "Fall harbor staging",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "A12",
          "F1",
          "F3",
          "F4",
          "F23",
          "F24",
          "F25",
          "F27",
          "F35",
          "F42",
          "F49"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "manistee_mi/brown_trout",
    "cityId": "manistee_mi",
    "speciesId": "brown_trout",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "manistee_mi__brown_trout__winter_harbor_open_water__v3_pass1",
        "modeId": "winter_harbor_open_water",
        "fisheryStrength": 5.2,
        "availabilityKnots": [
          {
            "monthDay": "01-01",
            "availability": 0.9
          },
          {
            "monthDay": "01-15",
            "availability": 1
          },
          {
            "monthDay": "03-01",
            "availability": 0.65
          },
          {
            "monthDay": "04-01",
            "availability": 0
          },
          {
            "monthDay": "10-15",
            "availability": 0
          },
          {
            "monthDay": "11-15",
            "availability": 0.45
          },
          {
            "monthDay": "12-31",
            "availability": 0.9
          }
        ],
        "thermalCurveId": "brown_trout__shared_temperature__v0_2",
        "modeName": "Winter harbor open water",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "F1",
          "F2",
          "F23",
          "F27",
          "F29",
          "F36",
          "F39",
          "F47",
          "M2"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "manistee_mi__brown_trout__spring_nearshore__v3_pass1",
        "modeId": "spring_nearshore",
        "fisheryStrength": 8.2,
        "availabilityKnots": [
          {
            "monthDay": "02-15",
            "availability": 0
          },
          {
            "monthDay": "03-09",
            "availability": 0.35
          },
          {
            "monthDay": "03-28",
            "availability": 0.72
          },
          {
            "monthDay": "04-10",
            "availability": 1
          },
          {
            "monthDay": "05-14",
            "availability": 0.78
          },
          {
            "monthDay": "06-18",
            "availability": 0.32
          },
          {
            "monthDay": "07-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "brown_trout__shared_temperature__v0_2",
        "modeName": "Spring nearshore",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "F1",
          "F2",
          "F23",
          "F27",
          "F29",
          "F36",
          "F39",
          "F47",
          "M2"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "manistee_mi__brown_trout__fall_harbor__v3_pass1",
        "modeId": "fall_harbor",
        "fisheryStrength": 3.1,
        "availabilityKnots": [
          {
            "monthDay": "08-01",
            "availability": 0
          },
          {
            "monthDay": "09-12",
            "availability": 0.35
          },
          {
            "monthDay": "10-20",
            "availability": 0.72
          },
          {
            "monthDay": "11-15",
            "availability": 1
          },
          {
            "monthDay": "11-21",
            "availability": 0.78
          },
          {
            "monthDay": "11-27",
            "availability": 0.32
          },
          {
            "monthDay": "12-01",
            "availability": 0
          }
        ],
        "thermalCurveId": "brown_trout__shared_temperature__v0_2",
        "modeName": "Fall harbor",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "F1",
          "F2",
          "F23",
          "F27",
          "F29",
          "F36",
          "F39",
          "F47",
          "M2"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "frankfort_elberta_mi/chinook_salmon",
    "cityId": "frankfort_elberta_mi",
    "speciesId": "chinook_salmon",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "frankfort_elberta_mi__chinook_salmon__spring_nearshore_transient__v3_pass1",
        "modeId": "spring_nearshore_transient",
        "fisheryStrength": 3.7,
        "availabilityKnots": [
          {
            "monthDay": "03-15",
            "availability": 0
          },
          {
            "monthDay": "04-21",
            "availability": 0.35
          },
          {
            "monthDay": "05-23",
            "availability": 0.72
          },
          {
            "monthDay": "06-15",
            "availability": 1
          },
          {
            "monthDay": "06-20",
            "availability": 0.78
          },
          {
            "monthDay": "06-26",
            "availability": 0.32
          },
          {
            "monthDay": "06-30",
            "availability": 0
          }
        ],
        "thermalCurveId": "chinook_salmon__shared_temperature__v0_2",
        "modeName": "Spring nearshore transient",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "F7",
          "F18",
          "F30",
          "F40",
          "F43",
          "F48"
        ],
        "limitations": [
          "Michigan DNR Pier/Dock estimates and direct breakwall reports establish shore reachability; the provisional magnitude remains subject to outcome validation.",
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "frankfort_elberta_mi__chinook_salmon__summer_coldwater_access__v3_pass1",
        "modeId": "summer_coldwater_access",
        "fisheryStrength": 8.8,
        "availabilityKnots": [
          {
            "monthDay": "06-01",
            "availability": 0
          },
          {
            "monthDay": "06-29",
            "availability": 0.35
          },
          {
            "monthDay": "07-24",
            "availability": 0.72
          },
          {
            "monthDay": "08-10",
            "availability": 1
          },
          {
            "monthDay": "08-14",
            "availability": 0.78
          },
          {
            "monthDay": "08-17",
            "availability": 0.32
          },
          {
            "monthDay": "08-20",
            "availability": 0
          }
        ],
        "thermalCurveId": "chinook_salmon__shared_temperature__v0_2",
        "modeName": "Summer cold-water access",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "F7",
          "F18",
          "F30",
          "F40",
          "F43",
          "F48"
        ],
        "limitations": [
          "Michigan DNR Pier/Dock estimates and direct breakwall reports establish shore reachability; the provisional magnitude remains subject to outcome validation.",
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "frankfort_elberta_mi__chinook_salmon__fall_harbor_staging__v3_pass1",
        "modeId": "fall_harbor_staging",
        "fisheryStrength": 9.7,
        "availabilityKnots": [
          {
            "monthDay": "07-20",
            "availability": 0
          },
          {
            "monthDay": "07-31",
            "availability": 0.35
          },
          {
            "monthDay": "08-09",
            "availability": 0.72
          },
          {
            "monthDay": "08-16",
            "availability": 1
          },
          {
            "monthDay": "09-12",
            "availability": 0.78
          },
          {
            "monthDay": "10-10",
            "availability": 0.32
          },
          {
            "monthDay": "11-01",
            "availability": 0
          }
        ],
        "thermalCurveId": "chinook_salmon__shared_temperature__v0_2",
        "modeName": "Fall harbor staging",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "F7",
          "F18",
          "F30",
          "F40",
          "F43",
          "F48"
        ],
        "limitations": [
          "Michigan DNR Pier/Dock estimates and direct breakwall reports establish shore reachability; the provisional magnitude remains subject to outcome validation.",
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "frankfort_elberta_mi/coho_salmon",
    "cityId": "frankfort_elberta_mi",
    "speciesId": "coho_salmon",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "frankfort_elberta_mi__coho_salmon__spring_nearshore__v3_pass1",
        "modeId": "spring_nearshore",
        "fisheryStrength": 2.8,
        "availabilityKnots": [
          {
            "monthDay": "02-15",
            "availability": 0
          },
          {
            "monthDay": "03-11",
            "availability": 0.35
          },
          {
            "monthDay": "03-31",
            "availability": 0.72
          },
          {
            "monthDay": "04-15",
            "availability": 1
          },
          {
            "monthDay": "05-12",
            "availability": 0.78
          },
          {
            "monthDay": "06-09",
            "availability": 0.32
          },
          {
            "monthDay": "06-30",
            "availability": 0
          }
        ],
        "thermalCurveId": "coho_salmon__shared_temperature__v0_2",
        "modeName": "Spring nearshore",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "F3",
          "F7",
          "F25",
          "F48",
          "F49",
          "M1"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "frankfort_elberta_mi__coho_salmon__summer_coldwater_access__v3_pass1",
        "modeId": "summer_coldwater_access",
        "fisheryStrength": 6.1,
        "availabilityKnots": [
          {
            "monthDay": "06-10",
            "availability": 0
          },
          {
            "monthDay": "07-06",
            "availability": 0.35
          },
          {
            "monthDay": "07-30",
            "availability": 0.72
          },
          {
            "monthDay": "08-15",
            "availability": 1
          },
          {
            "monthDay": "08-19",
            "availability": 0.78
          },
          {
            "monthDay": "08-22",
            "availability": 0.32
          },
          {
            "monthDay": "08-25",
            "availability": 0
          }
        ],
        "thermalCurveId": "coho_salmon__shared_temperature__v0_2",
        "modeName": "Summer cold-water access",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "F3",
          "F7",
          "F25",
          "F48",
          "F49",
          "M1"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "frankfort_elberta_mi__coho_salmon__fall_harbor_staging__v3_pass1",
        "modeId": "fall_harbor_staging",
        "fisheryStrength": 8.6,
        "availabilityKnots": [
          {
            "monthDay": "08-01",
            "availability": 0
          },
          {
            "monthDay": "08-19",
            "availability": 0.35
          },
          {
            "monthDay": "09-04",
            "availability": 0.72
          },
          {
            "monthDay": "09-15",
            "availability": 1
          },
          {
            "monthDay": "10-12",
            "availability": 0.78
          },
          {
            "monthDay": "11-09",
            "availability": 0.32
          },
          {
            "monthDay": "12-01",
            "availability": 0
          }
        ],
        "thermalCurveId": "coho_salmon__shared_temperature__v0_2",
        "modeName": "Fall harbor staging",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "F3",
          "F7",
          "F25",
          "F48",
          "F49",
          "M1"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "frankfort_elberta_mi/steelhead",
    "cityId": "frankfort_elberta_mi",
    "speciesId": "steelhead",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "frankfort_elberta_mi__steelhead__winter_spring_thermal_front__v3_pass1",
        "modeId": "winter_spring_thermal_front",
        "fisheryStrength": 7,
        "availabilityKnots": [
          {
            "monthDay": "01-01",
            "availability": 0.55
          },
          {
            "monthDay": "03-15",
            "availability": 0.8
          },
          {
            "monthDay": "04-15",
            "availability": 1
          },
          {
            "monthDay": "05-15",
            "availability": 0.35
          },
          {
            "monthDay": "06-01",
            "availability": 0
          },
          {
            "monthDay": "11-15",
            "availability": 0
          },
          {
            "monthDay": "12-31",
            "availability": 0.55
          }
        ],
        "thermalCurveId": "steelhead__shared_temperature__v0_2",
        "modeName": "Winter and spring thermal-front opportunity",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "F1",
          "F3",
          "F7",
          "F19",
          "F25",
          "F31",
          "F35",
          "F46",
          "F49"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "frankfort_elberta_mi__steelhead__summer_thermal_break_or_upwelling__v3_pass1",
        "modeId": "summer_thermal_break_or_upwelling",
        "fisheryStrength": 5.2,
        "availabilityKnots": [
          {
            "monthDay": "05-20",
            "availability": 0
          },
          {
            "monthDay": "06-11",
            "availability": 0.35
          },
          {
            "monthDay": "07-01",
            "availability": 0.72
          },
          {
            "monthDay": "07-15",
            "availability": 1
          },
          {
            "monthDay": "08-04",
            "availability": 0.78
          },
          {
            "monthDay": "08-25",
            "availability": 0.32
          },
          {
            "monthDay": "09-10",
            "availability": 0
          }
        ],
        "thermalCurveId": "steelhead__shared_temperature__v0_2",
        "modeName": "Summer thermal break or upwelling",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "F1",
          "F3",
          "F7",
          "F19",
          "F25",
          "F31",
          "F35",
          "F46",
          "F49"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "frankfort_elberta_mi__steelhead__fall_harbor_staging__v3_pass1",
        "modeId": "fall_harbor_staging",
        "fisheryStrength": 9.8,
        "availabilityKnots": [
          {
            "monthDay": "08-25",
            "availability": 0
          },
          {
            "monthDay": "09-15",
            "availability": 0.35
          },
          {
            "monthDay": "10-03",
            "availability": 0.72
          },
          {
            "monthDay": "10-16",
            "availability": 1
          },
          {
            "monthDay": "11-06",
            "availability": 0.78
          },
          {
            "monthDay": "11-28",
            "availability": 0.32
          },
          {
            "monthDay": "12-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "steelhead__shared_temperature__v0_2",
        "modeName": "Fall harbor staging",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "F1",
          "F3",
          "F7",
          "F19",
          "F25",
          "F31",
          "F35",
          "F46",
          "F49"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "frankfort_elberta_mi/brown_trout",
    "cityId": "frankfort_elberta_mi",
    "speciesId": "brown_trout",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "frankfort_elberta_mi__brown_trout__winter_harbor_open_water__v3_pass1",
        "modeId": "winter_harbor_open_water",
        "fisheryStrength": 5.3,
        "availabilityKnots": [
          {
            "monthDay": "01-01",
            "availability": 0.9
          },
          {
            "monthDay": "01-15",
            "availability": 1
          },
          {
            "monthDay": "03-01",
            "availability": 0.65
          },
          {
            "monthDay": "04-01",
            "availability": 0
          },
          {
            "monthDay": "10-15",
            "availability": 0
          },
          {
            "monthDay": "11-15",
            "availability": 0.45
          },
          {
            "monthDay": "12-31",
            "availability": 0.9
          }
        ],
        "thermalCurveId": "brown_trout__shared_temperature__v0_2",
        "modeName": "Winter harbor open water",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "F1",
          "F30",
          "F46",
          "M2"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "frankfort_elberta_mi__brown_trout__spring_nearshore__v3_pass1",
        "modeId": "spring_nearshore",
        "fisheryStrength": 7.5,
        "availabilityKnots": [
          {
            "monthDay": "02-15",
            "availability": 0
          },
          {
            "monthDay": "03-07",
            "availability": 0.35
          },
          {
            "monthDay": "03-24",
            "availability": 0.72
          },
          {
            "monthDay": "04-05",
            "availability": 1
          },
          {
            "monthDay": "05-10",
            "availability": 0.78
          },
          {
            "monthDay": "06-17",
            "availability": 0.32
          },
          {
            "monthDay": "07-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "brown_trout__shared_temperature__v0_2",
        "modeName": "Spring nearshore",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "F1",
          "F30",
          "F46",
          "M2"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "frankfort_elberta_mi__brown_trout__fall_harbor__v3_pass1",
        "modeId": "fall_harbor",
        "fisheryStrength": 3.1,
        "availabilityKnots": [
          {
            "monthDay": "08-01",
            "availability": 0
          },
          {
            "monthDay": "09-12",
            "availability": 0.35
          },
          {
            "monthDay": "10-20",
            "availability": 0.72
          },
          {
            "monthDay": "11-15",
            "availability": 1
          },
          {
            "monthDay": "11-21",
            "availability": 0.78
          },
          {
            "monthDay": "11-27",
            "availability": 0.32
          },
          {
            "monthDay": "12-01",
            "availability": 0
          }
        ],
        "thermalCurveId": "brown_trout__shared_temperature__v0_2",
        "modeName": "Fall harbor",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "F1",
          "F30",
          "F46",
          "M2"
        ],
        "limitations": [
          "Monthly port evidence cannot validate individual daily ordinates or catch probability.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "sheboygan_wi/chinook_salmon",
    "cityId": "sheboygan_wi",
    "speciesId": "chinook_salmon",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "sheboygan_wi__chinook_salmon__spring_nearshore_transient__v3_pass1",
        "modeId": "spring_nearshore_transient",
        "fisheryStrength": 2.3,
        "availabilityKnots": [
          {
            "monthDay": "03-15",
            "availability": 0
          },
          {
            "monthDay": "04-21",
            "availability": 0.35
          },
          {
            "monthDay": "05-23",
            "availability": 0.72
          },
          {
            "monthDay": "06-15",
            "availability": 1
          },
          {
            "monthDay": "06-20",
            "availability": 0.78
          },
          {
            "monthDay": "06-26",
            "availability": 0.32
          },
          {
            "monthDay": "06-30",
            "availability": 0
          }
        ],
        "thermalCurveId": "chinook_salmon__shared_temperature__v0_2",
        "modeName": "Spring nearshore transient",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "S1",
          "S5",
          "W1",
          "W2",
          "W3",
          "W4",
          "W5",
          "W6",
          "W8",
          "W9",
          "W12"
        ],
        "limitations": [
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "sheboygan_wi__chinook_salmon__summer_coldwater_access__v3_pass1",
        "modeId": "summer_coldwater_access",
        "fisheryStrength": 7.6,
        "availabilityKnots": [
          {
            "monthDay": "06-01",
            "availability": 0
          },
          {
            "monthDay": "06-29",
            "availability": 0.35
          },
          {
            "monthDay": "07-24",
            "availability": 0.72
          },
          {
            "monthDay": "08-10",
            "availability": 1
          },
          {
            "monthDay": "08-14",
            "availability": 0.78
          },
          {
            "monthDay": "08-17",
            "availability": 0.32
          },
          {
            "monthDay": "08-20",
            "availability": 0
          }
        ],
        "thermalCurveId": "chinook_salmon__shared_temperature__v0_2",
        "modeName": "Summer cold-water access",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "S1",
          "S5",
          "W1",
          "W2",
          "W3",
          "W4",
          "W5",
          "W6",
          "W8",
          "W9",
          "W12"
        ],
        "limitations": [
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "sheboygan_wi__chinook_salmon__fall_harbor_staging__v3_pass1",
        "modeId": "fall_harbor_staging",
        "fisheryStrength": 9.4,
        "availabilityKnots": [
          {
            "monthDay": "07-20",
            "availability": 0
          },
          {
            "monthDay": "08-06",
            "availability": 0.35
          },
          {
            "monthDay": "08-21",
            "availability": 0.72
          },
          {
            "monthDay": "08-31",
            "availability": 1
          },
          {
            "monthDay": "09-22",
            "availability": 0.78
          },
          {
            "monthDay": "10-15",
            "availability": 0.32
          },
          {
            "monthDay": "11-01",
            "availability": 0
          }
        ],
        "thermalCurveId": "chinook_salmon__shared_temperature__v0_2",
        "modeName": "Fall harbor staging",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "S1",
          "S5",
          "W1",
          "W2",
          "W3",
          "W4",
          "W5",
          "W6",
          "W8",
          "W9",
          "W12"
        ],
        "limitations": [
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "sheboygan_wi/coho_salmon",
    "cityId": "sheboygan_wi",
    "speciesId": "coho_salmon",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "sheboygan_wi__coho_salmon__spring_nearshore__v3_pass1",
        "modeId": "spring_nearshore",
        "fisheryStrength": 7.7,
        "availabilityKnots": [
          {
            "monthDay": "02-15",
            "availability": 0
          },
          {
            "monthDay": "03-11",
            "availability": 0.35
          },
          {
            "monthDay": "03-31",
            "availability": 0.72
          },
          {
            "monthDay": "04-15",
            "availability": 1
          },
          {
            "monthDay": "05-12",
            "availability": 0.78
          },
          {
            "monthDay": "06-09",
            "availability": 0.32
          },
          {
            "monthDay": "06-30",
            "availability": 0
          }
        ],
        "thermalCurveId": "coho_salmon__shared_temperature__v0_2",
        "modeName": "Spring nearshore",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "S1",
          "S6",
          "S8",
          "W1",
          "W3",
          "W4",
          "W5",
          "W6",
          "W8",
          "W9",
          "W11"
        ],
        "limitations": [
          "Current local relevance plus repeated structure-specific historical records support the frozen provisional curve; contemporary Sheboygan-only monthly effort remains unavailable and is handled by the validation confidence gate.",
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "sheboygan_wi__coho_salmon__summer_coldwater_access__v3_pass1",
        "modeId": "summer_coldwater_access",
        "fisheryStrength": 7.5,
        "availabilityKnots": [
          {
            "monthDay": "06-10",
            "availability": 0
          },
          {
            "monthDay": "06-24",
            "availability": 0.35
          },
          {
            "monthDay": "07-06",
            "availability": 0.72
          },
          {
            "monthDay": "07-15",
            "availability": 1
          },
          {
            "monthDay": "07-29",
            "availability": 0.78
          },
          {
            "monthDay": "08-14",
            "availability": 0.32
          },
          {
            "monthDay": "08-25",
            "availability": 0
          }
        ],
        "thermalCurveId": "coho_salmon__shared_temperature__v0_2",
        "modeName": "Summer cold-water access",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "S1",
          "S6",
          "S8",
          "W1",
          "W3",
          "W4",
          "W5",
          "W6",
          "W8",
          "W9",
          "W11"
        ],
        "limitations": [
          "Current local relevance plus repeated structure-specific historical records support the frozen provisional curve; contemporary Sheboygan-only monthly effort remains unavailable and is handled by the validation confidence gate.",
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "sheboygan_wi__coho_salmon__fall_harbor_staging__v3_pass1",
        "modeId": "fall_harbor_staging",
        "fisheryStrength": 7,
        "availabilityKnots": [
          {
            "monthDay": "08-01",
            "availability": 0
          },
          {
            "monthDay": "08-17",
            "availability": 0.35
          },
          {
            "monthDay": "08-30",
            "availability": 0.72
          },
          {
            "monthDay": "09-09",
            "availability": 1
          },
          {
            "monthDay": "10-08",
            "availability": 0.78
          },
          {
            "monthDay": "11-08",
            "availability": 0.32
          },
          {
            "monthDay": "12-01",
            "availability": 0
          }
        ],
        "thermalCurveId": "coho_salmon__shared_temperature__v0_2",
        "modeName": "Fall harbor staging",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "S1",
          "S6",
          "S8",
          "W1",
          "W3",
          "W4",
          "W5",
          "W6",
          "W8",
          "W9",
          "W11"
        ],
        "limitations": [
          "Current local relevance plus repeated structure-specific historical records support the frozen provisional curve; contemporary Sheboygan-only monthly effort remains unavailable and is handled by the validation confidence gate.",
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "sheboygan_wi/steelhead",
    "cityId": "sheboygan_wi",
    "speciesId": "steelhead",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "sheboygan_wi__steelhead__winter_spring_thermal_front__v3_pass1",
        "modeId": "winter_spring_thermal_front",
        "fisheryStrength": 6.8,
        "availabilityKnots": [
          {
            "monthDay": "01-01",
            "availability": 0.55
          },
          {
            "monthDay": "03-15",
            "availability": 0.8
          },
          {
            "monthDay": "04-15",
            "availability": 1
          },
          {
            "monthDay": "05-15",
            "availability": 0.35
          },
          {
            "monthDay": "06-01",
            "availability": 0
          },
          {
            "monthDay": "11-15",
            "availability": 0
          },
          {
            "monthDay": "12-31",
            "availability": 0.55
          }
        ],
        "thermalCurveId": "steelhead__shared_temperature__v0_2",
        "modeName": "Winter and spring thermal-front opportunity",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "S1",
          "S7",
          "W1",
          "W3",
          "W4",
          "W5",
          "W6",
          "W7",
          "W8"
        ],
        "limitations": [
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "sheboygan_wi__steelhead__summer_thermal_break_or_upwelling__v3_pass1",
        "modeId": "summer_thermal_break_or_upwelling",
        "fisheryStrength": 7.3,
        "availabilityKnots": [
          {
            "monthDay": "05-20",
            "availability": 0
          },
          {
            "monthDay": "06-11",
            "availability": 0.35
          },
          {
            "monthDay": "07-01",
            "availability": 0.72
          },
          {
            "monthDay": "07-15",
            "availability": 1
          },
          {
            "monthDay": "08-04",
            "availability": 0.78
          },
          {
            "monthDay": "08-25",
            "availability": 0.32
          },
          {
            "monthDay": "09-10",
            "availability": 0
          }
        ],
        "thermalCurveId": "steelhead__shared_temperature__v0_2",
        "modeName": "Summer thermal break or upwelling",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "S1",
          "S7",
          "W1",
          "W3",
          "W4",
          "W5",
          "W6",
          "W7",
          "W8"
        ],
        "limitations": [
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "sheboygan_wi__steelhead__fall_harbor_staging__v3_pass1",
        "modeId": "fall_harbor_staging",
        "fisheryStrength": 6.3,
        "availabilityKnots": [
          {
            "monthDay": "08-25",
            "availability": 0
          },
          {
            "monthDay": "09-12",
            "availability": 0.35
          },
          {
            "monthDay": "09-29",
            "availability": 0.72
          },
          {
            "monthDay": "10-10",
            "availability": 1
          },
          {
            "monthDay": "11-02",
            "availability": 0.78
          },
          {
            "monthDay": "11-27",
            "availability": 0.32
          },
          {
            "monthDay": "12-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "steelhead__shared_temperature__v0_2",
        "modeName": "Fall harbor staging",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "S1",
          "S7",
          "W1",
          "W3",
          "W4",
          "W5",
          "W6",
          "W7",
          "W8"
        ],
        "limitations": [
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "sheboygan_wi/brown_trout",
    "cityId": "sheboygan_wi",
    "speciesId": "brown_trout",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "sheboygan_wi__brown_trout__winter_harbor_open_water__v3_pass1",
        "modeId": "winter_harbor_open_water",
        "fisheryStrength": 5.7,
        "availabilityKnots": [
          {
            "monthDay": "01-01",
            "availability": 0.9
          },
          {
            "monthDay": "01-15",
            "availability": 1
          },
          {
            "monthDay": "03-01",
            "availability": 0.65
          },
          {
            "monthDay": "04-01",
            "availability": 0
          },
          {
            "monthDay": "10-15",
            "availability": 0
          },
          {
            "monthDay": "11-15",
            "availability": 0.45
          },
          {
            "monthDay": "12-31",
            "availability": 0.9
          }
        ],
        "thermalCurveId": "brown_trout__shared_temperature__v0_2",
        "modeName": "Winter harbor open water",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "S1",
          "W1",
          "W3",
          "W4",
          "W5",
          "W6",
          "W7",
          "W8",
          "W9",
          "W10",
          "W11",
          "W12"
        ],
        "limitations": [
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "sheboygan_wi__brown_trout__spring_nearshore__v3_pass1",
        "modeId": "spring_nearshore",
        "fisheryStrength": 7.8,
        "availabilityKnots": [
          {
            "monthDay": "02-15",
            "availability": 0
          },
          {
            "monthDay": "03-11",
            "availability": 0.35
          },
          {
            "monthDay": "03-31",
            "availability": 0.72
          },
          {
            "monthDay": "04-15",
            "availability": 1
          },
          {
            "monthDay": "05-17",
            "availability": 0.78
          },
          {
            "monthDay": "06-20",
            "availability": 0.32
          },
          {
            "monthDay": "07-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "brown_trout__shared_temperature__v0_2",
        "modeName": "Spring nearshore",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "S1",
          "W1",
          "W3",
          "W4",
          "W5",
          "W6",
          "W7",
          "W8",
          "W9",
          "W10",
          "W11",
          "W12"
        ],
        "limitations": [
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "sheboygan_wi__brown_trout__fall_harbor__v3_pass1",
        "modeId": "fall_harbor",
        "fisheryStrength": 4.5,
        "availabilityKnots": [
          {
            "monthDay": "08-01",
            "availability": 0
          },
          {
            "monthDay": "08-17",
            "availability": 0.35
          },
          {
            "monthDay": "08-30",
            "availability": 0.72
          },
          {
            "monthDay": "09-09",
            "availability": 1
          },
          {
            "monthDay": "10-08",
            "availability": 0.78
          },
          {
            "monthDay": "11-08",
            "availability": 0.32
          },
          {
            "monthDay": "12-01",
            "availability": 0
          }
        ],
        "thermalCurveId": "brown_trout__shared_temperature__v0_2",
        "modeName": "Fall harbor",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "S1",
          "W1",
          "W3",
          "W4",
          "W5",
          "W6",
          "W7",
          "W8",
          "W9",
          "W10",
          "W11",
          "W12"
        ],
        "limitations": [
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "port_washington_wi/chinook_salmon",
    "cityId": "port_washington_wi",
    "speciesId": "chinook_salmon",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "port_washington_wi__chinook_salmon__summer_coldwater_access__v3_pass1",
        "modeId": "summer_coldwater_access",
        "fisheryStrength": 7.1,
        "availabilityKnots": [
          {
            "monthDay": "06-01",
            "availability": 0
          },
          {
            "monthDay": "06-29",
            "availability": 0.35
          },
          {
            "monthDay": "07-24",
            "availability": 0.72
          },
          {
            "monthDay": "08-10",
            "availability": 1
          },
          {
            "monthDay": "08-14",
            "availability": 0.78
          },
          {
            "monthDay": "08-17",
            "availability": 0.32
          },
          {
            "monthDay": "08-20",
            "availability": 0
          }
        ],
        "thermalCurveId": "chinook_salmon__shared_temperature__v0_2",
        "modeName": "Summer cold-water access",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "PW_ACCESS_001",
          "PW_SPECIES_001",
          "PW_CURRENT_001",
          "PW_HARVEST_001",
          "PW_SEASON_2022",
          "PW_SEASON_2023",
          "PW_SEASON_2024"
        ],
        "limitations": [
          "City-harbor shadow candidate supported by Wisconsin DNR Port Washington access/fishing guidance, Ozaukee County pier harvest, statewide pier seasonality, and current local pier/shore reporting; the numeric curve is a provisional FinFindr calibration.",
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "port_washington_wi__chinook_salmon__fall_harbor_staging__v3_pass1",
        "modeId": "fall_harbor_staging",
        "fisheryStrength": 7.2,
        "availabilityKnots": [
          {
            "monthDay": "07-20",
            "availability": 0
          },
          {
            "monthDay": "07-30",
            "availability": 0.35
          },
          {
            "monthDay": "08-09",
            "availability": 0.72
          },
          {
            "monthDay": "08-15",
            "availability": 1
          },
          {
            "monthDay": "09-11",
            "availability": 0.78
          },
          {
            "monthDay": "10-10",
            "availability": 0.32
          },
          {
            "monthDay": "11-01",
            "availability": 0
          }
        ],
        "thermalCurveId": "chinook_salmon__shared_temperature__v0_2",
        "modeName": "Fall harbor staging",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "PW_ACCESS_001",
          "PW_SPECIES_001",
          "PW_CURRENT_001",
          "PW_HARVEST_001",
          "PW_SEASON_2022",
          "PW_SEASON_2023",
          "PW_SEASON_2024"
        ],
        "limitations": [
          "City-harbor shadow candidate supported by Wisconsin DNR Port Washington access/fishing guidance, Ozaukee County pier harvest, statewide pier seasonality, and current local pier/shore reporting; the numeric curve is a provisional FinFindr calibration.",
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "port_washington_wi/coho_salmon",
    "cityId": "port_washington_wi",
    "speciesId": "coho_salmon",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "port_washington_wi__coho_salmon__spring_nearshore__v3_pass1",
        "modeId": "spring_nearshore",
        "fisheryStrength": 7.8,
        "availabilityKnots": [
          {
            "monthDay": "02-15",
            "availability": 0
          },
          {
            "monthDay": "03-13",
            "availability": 0.35
          },
          {
            "monthDay": "04-04",
            "availability": 0.72
          },
          {
            "monthDay": "04-20",
            "availability": 1
          },
          {
            "monthDay": "05-15",
            "availability": 0.78
          },
          {
            "monthDay": "06-10",
            "availability": 0.32
          },
          {
            "monthDay": "06-30",
            "availability": 0
          }
        ],
        "thermalCurveId": "coho_salmon__shared_temperature__v0_2",
        "modeName": "Spring nearshore",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "PW_ACCESS_001",
          "PW_SPECIES_001",
          "PW_CURRENT_001",
          "PW_HARVEST_001",
          "PW_SEASON_2022",
          "PW_SEASON_2023",
          "PW_SEASON_2024"
        ],
        "limitations": [
          "City-harbor shadow candidate supported by Wisconsin DNR Port Washington access/fishing guidance, Ozaukee County pier harvest, statewide pier seasonality, and current local pier/shore reporting; the numeric curve is a provisional FinFindr calibration.",
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "port_washington_wi__coho_salmon__summer_coldwater_access__v3_pass1",
        "modeId": "summer_coldwater_access",
        "fisheryStrength": 4.2,
        "availabilityKnots": [
          {
            "monthDay": "06-10",
            "availability": 0
          },
          {
            "monthDay": "06-26",
            "availability": 0.35
          },
          {
            "monthDay": "07-10",
            "availability": 0.72
          },
          {
            "monthDay": "07-20",
            "availability": 1
          },
          {
            "monthDay": "08-02",
            "availability": 0.78
          },
          {
            "monthDay": "08-15",
            "availability": 0.32
          },
          {
            "monthDay": "08-25",
            "availability": 0
          }
        ],
        "thermalCurveId": "coho_salmon__shared_temperature__v0_2",
        "modeName": "Summer cold-water access",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "PW_ACCESS_001",
          "PW_SPECIES_001",
          "PW_CURRENT_001",
          "PW_HARVEST_001",
          "PW_SEASON_2022",
          "PW_SEASON_2023",
          "PW_SEASON_2024"
        ],
        "limitations": [
          "City-harbor shadow candidate supported by Wisconsin DNR Port Washington access/fishing guidance, Ozaukee County pier harvest, statewide pier seasonality, and current local pier/shore reporting; the numeric curve is a provisional FinFindr calibration.",
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "port_washington_wi__coho_salmon__fall_harbor_staging__v3_pass1",
        "modeId": "fall_harbor_staging",
        "fisheryStrength": 6.8,
        "availabilityKnots": [
          {
            "monthDay": "08-01",
            "availability": 0
          },
          {
            "monthDay": "08-16",
            "availability": 0.35
          },
          {
            "monthDay": "08-29",
            "availability": 0.72
          },
          {
            "monthDay": "09-07",
            "availability": 1
          },
          {
            "monthDay": "10-07",
            "availability": 0.78
          },
          {
            "monthDay": "11-07",
            "availability": 0.32
          },
          {
            "monthDay": "12-01",
            "availability": 0
          }
        ],
        "thermalCurveId": "coho_salmon__shared_temperature__v0_2",
        "modeName": "Fall harbor staging",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "PW_ACCESS_001",
          "PW_SPECIES_001",
          "PW_CURRENT_001",
          "PW_HARVEST_001",
          "PW_SEASON_2022",
          "PW_SEASON_2023",
          "PW_SEASON_2024"
        ],
        "limitations": [
          "City-harbor shadow candidate supported by Wisconsin DNR Port Washington access/fishing guidance, Ozaukee County pier harvest, statewide pier seasonality, and current local pier/shore reporting; the numeric curve is a provisional FinFindr calibration.",
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "port_washington_wi/steelhead",
    "cityId": "port_washington_wi",
    "speciesId": "steelhead",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "port_washington_wi__steelhead__winter_spring_thermal_front__v3_pass1",
        "modeId": "winter_spring_thermal_front",
        "fisheryStrength": 5.2,
        "availabilityKnots": [
          {
            "monthDay": "01-01",
            "availability": 0.55
          },
          {
            "monthDay": "03-15",
            "availability": 0.8
          },
          {
            "monthDay": "04-15",
            "availability": 1
          },
          {
            "monthDay": "05-15",
            "availability": 0.35
          },
          {
            "monthDay": "06-01",
            "availability": 0
          },
          {
            "monthDay": "11-15",
            "availability": 0
          },
          {
            "monthDay": "12-31",
            "availability": 0.55
          }
        ],
        "thermalCurveId": "steelhead__shared_temperature__v0_2",
        "modeName": "Winter and spring thermal-front opportunity",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "PW_ACCESS_001",
          "PW_SPECIES_001",
          "PW_CURRENT_001",
          "PW_HARVEST_001",
          "PW_SEASON_2022",
          "PW_SEASON_2023",
          "PW_SEASON_2024"
        ],
        "limitations": [
          "City-harbor shadow candidate supported by Wisconsin DNR Port Washington access/fishing guidance, Ozaukee County pier harvest, statewide pier seasonality, and current local pier/shore reporting; the numeric curve is a provisional FinFindr calibration.",
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "port_washington_wi__steelhead__summer_thermal_break_or_upwelling__v3_pass1",
        "modeId": "summer_thermal_break_or_upwelling",
        "fisheryStrength": 5,
        "availabilityKnots": [
          {
            "monthDay": "05-20",
            "availability": 0
          },
          {
            "monthDay": "06-11",
            "availability": 0.35
          },
          {
            "monthDay": "07-01",
            "availability": 0.72
          },
          {
            "monthDay": "07-15",
            "availability": 1
          },
          {
            "monthDay": "08-04",
            "availability": 0.78
          },
          {
            "monthDay": "08-25",
            "availability": 0.32
          },
          {
            "monthDay": "09-10",
            "availability": 0
          }
        ],
        "thermalCurveId": "steelhead__shared_temperature__v0_2",
        "modeName": "Summer thermal break or upwelling",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "PW_ACCESS_001",
          "PW_SPECIES_001",
          "PW_CURRENT_001",
          "PW_HARVEST_001",
          "PW_SEASON_2022",
          "PW_SEASON_2023",
          "PW_SEASON_2024"
        ],
        "limitations": [
          "City-harbor shadow candidate supported by Wisconsin DNR Port Washington access/fishing guidance, Ozaukee County pier harvest, statewide pier seasonality, and current local pier/shore reporting; the numeric curve is a provisional FinFindr calibration.",
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "port_washington_wi/brown_trout",
    "cityId": "port_washington_wi",
    "speciesId": "brown_trout",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "port_washington_wi__brown_trout__winter_harbor_open_water__v3_pass1",
        "modeId": "winter_harbor_open_water",
        "fisheryStrength": 4.1,
        "availabilityKnots": [
          {
            "monthDay": "01-01",
            "availability": 0.9
          },
          {
            "monthDay": "01-15",
            "availability": 1
          },
          {
            "monthDay": "03-01",
            "availability": 0.65
          },
          {
            "monthDay": "04-01",
            "availability": 0
          },
          {
            "monthDay": "10-15",
            "availability": 0
          },
          {
            "monthDay": "11-15",
            "availability": 0.45
          },
          {
            "monthDay": "12-31",
            "availability": 0.9
          }
        ],
        "thermalCurveId": "brown_trout__shared_temperature__v0_2",
        "modeName": "Winter harbor open water",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "PW_ACCESS_001",
          "PW_SPECIES_001",
          "PW_CURRENT_001",
          "PW_HARVEST_001",
          "PW_SEASON_2022",
          "PW_SEASON_2023",
          "PW_SEASON_2024"
        ],
        "limitations": [
          "City-harbor shadow candidate supported by Wisconsin DNR Port Washington access/fishing guidance, Ozaukee County pier harvest, statewide pier seasonality, and current local pier/shore reporting; the numeric curve is a provisional FinFindr calibration.",
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "port_washington_wi__brown_trout__spring_nearshore__v3_pass1",
        "modeId": "spring_nearshore",
        "fisheryStrength": 7,
        "availabilityKnots": [
          {
            "monthDay": "02-15",
            "availability": 0
          },
          {
            "monthDay": "03-05",
            "availability": 0.35
          },
          {
            "monthDay": "03-21",
            "availability": 0.72
          },
          {
            "monthDay": "04-01",
            "availability": 1
          },
          {
            "monthDay": "05-08",
            "availability": 0.78
          },
          {
            "monthDay": "06-16",
            "availability": 0.32
          },
          {
            "monthDay": "07-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "brown_trout__shared_temperature__v0_2",
        "modeName": "Spring nearshore",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "PW_ACCESS_001",
          "PW_SPECIES_001",
          "PW_CURRENT_001",
          "PW_HARVEST_001",
          "PW_SEASON_2022",
          "PW_SEASON_2023",
          "PW_SEASON_2024"
        ],
        "limitations": [
          "City-harbor shadow candidate supported by Wisconsin DNR Port Washington access/fishing guidance, Ozaukee County pier harvest, statewide pier seasonality, and current local pier/shore reporting; the numeric curve is a provisional FinFindr calibration.",
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "milwaukee_wi/chinook_salmon",
    "cityId": "milwaukee_wi",
    "speciesId": "chinook_salmon",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "milwaukee_wi__chinook_salmon__summer_coldwater_access__v3_pass1",
        "modeId": "summer_coldwater_access",
        "fisheryStrength": 7,
        "availabilityKnots": [
          {
            "monthDay": "06-01",
            "availability": 0
          },
          {
            "monthDay": "06-29",
            "availability": 0.35
          },
          {
            "monthDay": "07-24",
            "availability": 0.72
          },
          {
            "monthDay": "08-10",
            "availability": 1
          },
          {
            "monthDay": "08-14",
            "availability": 0.78
          },
          {
            "monthDay": "08-17",
            "availability": 0.32
          },
          {
            "monthDay": "08-20",
            "availability": 0
          }
        ],
        "thermalCurveId": "chinook_salmon__shared_temperature__v0_2",
        "modeName": "Summer cold-water access",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "WI_ACCESS_2026",
          "WI_EXACT_PIER_SPECIES_2023",
          "WI_COUNTY_MODE_1998_2024",
          "WI_SEASON_2022",
          "WI_SEASON_2023",
          "WI_SEASON_2024"
        ],
        "limitations": [
          "City-harbor shadow candidate supported by exact Wisconsin DNR access/species guidance, county pier-mode recurrence, statewide pier temporal shape, and dated local reports. The numeric curve is a provisional FinFindr calibration.",
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "milwaukee_wi__chinook_salmon__fall_harbor_staging__v3_pass1",
        "modeId": "fall_harbor_staging",
        "fisheryStrength": 7,
        "availabilityKnots": [
          {
            "monthDay": "07-20",
            "availability": 0
          },
          {
            "monthDay": "07-30",
            "availability": 0.35
          },
          {
            "monthDay": "08-09",
            "availability": 0.72
          },
          {
            "monthDay": "08-15",
            "availability": 1
          },
          {
            "monthDay": "09-11",
            "availability": 0.78
          },
          {
            "monthDay": "10-10",
            "availability": 0.32
          },
          {
            "monthDay": "11-01",
            "availability": 0
          }
        ],
        "thermalCurveId": "chinook_salmon__shared_temperature__v0_2",
        "modeName": "Fall harbor staging",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "WI_ACCESS_2026",
          "WI_EXACT_PIER_SPECIES_2023",
          "WI_COUNTY_MODE_1998_2024",
          "WI_SEASON_2022",
          "WI_SEASON_2023",
          "WI_SEASON_2024"
        ],
        "limitations": [
          "City-harbor shadow candidate supported by exact Wisconsin DNR access/species guidance, county pier-mode recurrence, statewide pier temporal shape, and dated local reports. The numeric curve is a provisional FinFindr calibration.",
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "milwaukee_wi/coho_salmon",
    "cityId": "milwaukee_wi",
    "speciesId": "coho_salmon",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "milwaukee_wi__coho_salmon__spring_nearshore__v3_pass1",
        "modeId": "spring_nearshore",
        "fisheryStrength": 7.6,
        "availabilityKnots": [
          {
            "monthDay": "02-15",
            "availability": 0
          },
          {
            "monthDay": "03-25",
            "availability": 0.35
          },
          {
            "monthDay": "04-27",
            "availability": 0.72
          },
          {
            "monthDay": "05-20",
            "availability": 1
          },
          {
            "monthDay": "06-03",
            "availability": 0.78
          },
          {
            "monthDay": "06-19",
            "availability": 0.32
          },
          {
            "monthDay": "06-30",
            "availability": 0
          }
        ],
        "thermalCurveId": "coho_salmon__shared_temperature__v0_2",
        "modeName": "Spring nearshore",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "WI_ACCESS_2026",
          "WI_EXACT_PIER_SPECIES_2023",
          "WI_COUNTY_MODE_1998_2024",
          "WI_SEASON_2022",
          "WI_SEASON_2023",
          "WI_SEASON_2024"
        ],
        "limitations": [
          "City-harbor shadow candidate supported by exact Wisconsin DNR access/species guidance, county pier-mode recurrence, statewide pier temporal shape, and dated local reports. The numeric curve is a provisional FinFindr calibration.",
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "milwaukee_wi__coho_salmon__summer_coldwater_access__v3_pass1",
        "modeId": "summer_coldwater_access",
        "fisheryStrength": 4.4,
        "availabilityKnots": [
          {
            "monthDay": "06-10",
            "availability": 0
          },
          {
            "monthDay": "06-26",
            "availability": 0.35
          },
          {
            "monthDay": "07-10",
            "availability": 0.72
          },
          {
            "monthDay": "07-20",
            "availability": 1
          },
          {
            "monthDay": "08-02",
            "availability": 0.78
          },
          {
            "monthDay": "08-15",
            "availability": 0.32
          },
          {
            "monthDay": "08-25",
            "availability": 0
          }
        ],
        "thermalCurveId": "coho_salmon__shared_temperature__v0_2",
        "modeName": "Summer cold-water access",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "WI_ACCESS_2026",
          "WI_EXACT_PIER_SPECIES_2023",
          "WI_COUNTY_MODE_1998_2024",
          "WI_SEASON_2022",
          "WI_SEASON_2023",
          "WI_SEASON_2024"
        ],
        "limitations": [
          "City-harbor shadow candidate supported by exact Wisconsin DNR access/species guidance, county pier-mode recurrence, statewide pier temporal shape, and dated local reports. The numeric curve is a provisional FinFindr calibration.",
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "milwaukee_wi__coho_salmon__fall_harbor_staging__v3_pass1",
        "modeId": "fall_harbor_staging",
        "fisheryStrength": 6.2,
        "availabilityKnots": [
          {
            "monthDay": "08-01",
            "availability": 0
          },
          {
            "monthDay": "08-16",
            "availability": 0.35
          },
          {
            "monthDay": "08-29",
            "availability": 0.72
          },
          {
            "monthDay": "09-07",
            "availability": 1
          },
          {
            "monthDay": "10-07",
            "availability": 0.78
          },
          {
            "monthDay": "11-07",
            "availability": 0.32
          },
          {
            "monthDay": "12-01",
            "availability": 0
          }
        ],
        "thermalCurveId": "coho_salmon__shared_temperature__v0_2",
        "modeName": "Fall harbor staging",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "WI_ACCESS_2026",
          "WI_EXACT_PIER_SPECIES_2023",
          "WI_COUNTY_MODE_1998_2024",
          "WI_SEASON_2022",
          "WI_SEASON_2023",
          "WI_SEASON_2024"
        ],
        "limitations": [
          "City-harbor shadow candidate supported by exact Wisconsin DNR access/species guidance, county pier-mode recurrence, statewide pier temporal shape, and dated local reports. The numeric curve is a provisional FinFindr calibration.",
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "milwaukee_wi/steelhead",
    "cityId": "milwaukee_wi",
    "speciesId": "steelhead",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "milwaukee_wi__steelhead__winter_spring_thermal_front__v3_pass1",
        "modeId": "winter_spring_thermal_front",
        "fisheryStrength": 4.6,
        "availabilityKnots": [
          {
            "monthDay": "01-01",
            "availability": 0.55
          },
          {
            "monthDay": "03-15",
            "availability": 0.8
          },
          {
            "monthDay": "04-15",
            "availability": 1
          },
          {
            "monthDay": "05-15",
            "availability": 0.35
          },
          {
            "monthDay": "06-01",
            "availability": 0
          },
          {
            "monthDay": "11-15",
            "availability": 0
          },
          {
            "monthDay": "12-31",
            "availability": 0.55
          }
        ],
        "thermalCurveId": "steelhead__shared_temperature__v0_2",
        "modeName": "Winter and spring thermal-front opportunity",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "WI_ACCESS_2026",
          "WI_EXACT_PIER_SPECIES_2023",
          "WI_COUNTY_MODE_1998_2024",
          "WI_SEASON_2022",
          "WI_SEASON_2023",
          "WI_SEASON_2024"
        ],
        "limitations": [
          "City-harbor shadow candidate supported by exact Wisconsin DNR access/species guidance, county pier-mode recurrence, statewide pier temporal shape, and dated local reports. The numeric curve is a provisional FinFindr calibration.",
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "milwaukee_wi__steelhead__summer_thermal_break_or_upwelling__v3_pass1",
        "modeId": "summer_thermal_break_or_upwelling",
        "fisheryStrength": 4.4,
        "availabilityKnots": [
          {
            "monthDay": "05-20",
            "availability": 0
          },
          {
            "monthDay": "06-11",
            "availability": 0.35
          },
          {
            "monthDay": "07-01",
            "availability": 0.72
          },
          {
            "monthDay": "07-15",
            "availability": 1
          },
          {
            "monthDay": "08-04",
            "availability": 0.78
          },
          {
            "monthDay": "08-25",
            "availability": 0.32
          },
          {
            "monthDay": "09-10",
            "availability": 0
          }
        ],
        "thermalCurveId": "steelhead__shared_temperature__v0_2",
        "modeName": "Summer thermal break or upwelling",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "WI_ACCESS_2026",
          "WI_EXACT_PIER_SPECIES_2023",
          "WI_COUNTY_MODE_1998_2024",
          "WI_SEASON_2022",
          "WI_SEASON_2023",
          "WI_SEASON_2024"
        ],
        "limitations": [
          "City-harbor shadow candidate supported by exact Wisconsin DNR access/species guidance, county pier-mode recurrence, statewide pier temporal shape, and dated local reports. The numeric curve is a provisional FinFindr calibration.",
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "milwaukee_wi/brown_trout",
    "cityId": "milwaukee_wi",
    "speciesId": "brown_trout",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "milwaukee_wi__brown_trout__winter_harbor_open_water__v3_pass1",
        "modeId": "winter_harbor_open_water",
        "fisheryStrength": 3.9,
        "availabilityKnots": [
          {
            "monthDay": "01-01",
            "availability": 0.9
          },
          {
            "monthDay": "01-15",
            "availability": 1
          },
          {
            "monthDay": "03-01",
            "availability": 0.65
          },
          {
            "monthDay": "04-01",
            "availability": 0
          },
          {
            "monthDay": "10-15",
            "availability": 0
          },
          {
            "monthDay": "11-15",
            "availability": 0.45
          },
          {
            "monthDay": "12-31",
            "availability": 0.9
          }
        ],
        "thermalCurveId": "brown_trout__shared_temperature__v0_2",
        "modeName": "Winter harbor open water",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "WI_ACCESS_2026",
          "WI_EXACT_PIER_SPECIES_2023",
          "WI_COUNTY_MODE_1998_2024",
          "WI_SEASON_2022",
          "WI_SEASON_2023",
          "WI_SEASON_2024"
        ],
        "limitations": [
          "City-harbor shadow candidate supported by exact Wisconsin DNR access/species guidance, county pier-mode recurrence, statewide pier temporal shape, and dated local reports. The numeric curve is a provisional FinFindr calibration.",
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "milwaukee_wi__brown_trout__spring_nearshore__v3_pass1",
        "modeId": "spring_nearshore",
        "fisheryStrength": 6.6,
        "availabilityKnots": [
          {
            "monthDay": "02-15",
            "availability": 0
          },
          {
            "monthDay": "03-05",
            "availability": 0.35
          },
          {
            "monthDay": "03-21",
            "availability": 0.72
          },
          {
            "monthDay": "04-01",
            "availability": 1
          },
          {
            "monthDay": "05-08",
            "availability": 0.78
          },
          {
            "monthDay": "06-16",
            "availability": 0.32
          },
          {
            "monthDay": "07-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "brown_trout__shared_temperature__v0_2",
        "modeName": "Spring nearshore",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "WI_ACCESS_2026",
          "WI_EXACT_PIER_SPECIES_2023",
          "WI_COUNTY_MODE_1998_2024",
          "WI_SEASON_2022",
          "WI_SEASON_2023",
          "WI_SEASON_2024"
        ],
        "limitations": [
          "City-harbor shadow candidate supported by exact Wisconsin DNR access/species guidance, county pier-mode recurrence, statewide pier temporal shape, and dated local reports. The numeric curve is a provisional FinFindr calibration.",
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "racine_wi/chinook_salmon",
    "cityId": "racine_wi",
    "speciesId": "chinook_salmon",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "racine_wi__chinook_salmon__summer_coldwater_access__v3_pass1",
        "modeId": "summer_coldwater_access",
        "fisheryStrength": 7.3,
        "availabilityKnots": [
          {
            "monthDay": "06-01",
            "availability": 0
          },
          {
            "monthDay": "06-29",
            "availability": 0.35
          },
          {
            "monthDay": "07-24",
            "availability": 0.72
          },
          {
            "monthDay": "08-10",
            "availability": 1
          },
          {
            "monthDay": "08-14",
            "availability": 0.78
          },
          {
            "monthDay": "08-17",
            "availability": 0.32
          },
          {
            "monthDay": "08-20",
            "availability": 0
          }
        ],
        "thermalCurveId": "chinook_salmon__shared_temperature__v0_2",
        "modeName": "Summer cold-water access",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "WI_ACCESS_2026",
          "WI_EXACT_PIER_SPECIES_2023",
          "WI_COUNTY_MODE_1998_2024",
          "WI_SEASON_2022",
          "WI_SEASON_2023",
          "WI_SEASON_2024"
        ],
        "limitations": [
          "City-harbor shadow candidate supported by exact Wisconsin DNR access/species guidance, county pier-mode recurrence, statewide pier temporal shape, and dated local reports. The numeric curve is a provisional FinFindr calibration.",
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "racine_wi__chinook_salmon__fall_harbor_staging__v3_pass1",
        "modeId": "fall_harbor_staging",
        "fisheryStrength": 7.4,
        "availabilityKnots": [
          {
            "monthDay": "07-20",
            "availability": 0
          },
          {
            "monthDay": "07-30",
            "availability": 0.35
          },
          {
            "monthDay": "08-09",
            "availability": 0.72
          },
          {
            "monthDay": "08-15",
            "availability": 1
          },
          {
            "monthDay": "09-11",
            "availability": 0.78
          },
          {
            "monthDay": "10-10",
            "availability": 0.32
          },
          {
            "monthDay": "11-01",
            "availability": 0
          }
        ],
        "thermalCurveId": "chinook_salmon__shared_temperature__v0_2",
        "modeName": "Fall harbor staging",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "WI_ACCESS_2026",
          "WI_EXACT_PIER_SPECIES_2023",
          "WI_COUNTY_MODE_1998_2024",
          "WI_SEASON_2022",
          "WI_SEASON_2023",
          "WI_SEASON_2024"
        ],
        "limitations": [
          "City-harbor shadow candidate supported by exact Wisconsin DNR access/species guidance, county pier-mode recurrence, statewide pier temporal shape, and dated local reports. The numeric curve is a provisional FinFindr calibration.",
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "racine_wi/coho_salmon",
    "cityId": "racine_wi",
    "speciesId": "coho_salmon",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "racine_wi__coho_salmon__spring_nearshore__v3_pass1",
        "modeId": "spring_nearshore",
        "fisheryStrength": 7.6,
        "availabilityKnots": [
          {
            "monthDay": "02-15",
            "availability": 0
          },
          {
            "monthDay": "03-13",
            "availability": 0.35
          },
          {
            "monthDay": "04-04",
            "availability": 0.72
          },
          {
            "monthDay": "04-20",
            "availability": 1
          },
          {
            "monthDay": "05-15",
            "availability": 0.78
          },
          {
            "monthDay": "06-10",
            "availability": 0.32
          },
          {
            "monthDay": "06-30",
            "availability": 0
          }
        ],
        "thermalCurveId": "coho_salmon__shared_temperature__v0_2",
        "modeName": "Spring nearshore",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "WI_ACCESS_2026",
          "WI_EXACT_PIER_SPECIES_2023",
          "WI_COUNTY_MODE_1998_2024",
          "WI_SEASON_2022",
          "WI_SEASON_2023",
          "WI_SEASON_2024"
        ],
        "limitations": [
          "City-harbor shadow candidate supported by exact Wisconsin DNR access/species guidance, county pier-mode recurrence, statewide pier temporal shape, and dated local reports. The numeric curve is a provisional FinFindr calibration.",
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "racine_wi__coho_salmon__summer_coldwater_access__v3_pass1",
        "modeId": "summer_coldwater_access",
        "fisheryStrength": 4.8,
        "availabilityKnots": [
          {
            "monthDay": "06-10",
            "availability": 0
          },
          {
            "monthDay": "06-26",
            "availability": 0.35
          },
          {
            "monthDay": "07-10",
            "availability": 0.72
          },
          {
            "monthDay": "07-20",
            "availability": 1
          },
          {
            "monthDay": "08-02",
            "availability": 0.78
          },
          {
            "monthDay": "08-15",
            "availability": 0.32
          },
          {
            "monthDay": "08-25",
            "availability": 0
          }
        ],
        "thermalCurveId": "coho_salmon__shared_temperature__v0_2",
        "modeName": "Summer cold-water access",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "WI_ACCESS_2026",
          "WI_EXACT_PIER_SPECIES_2023",
          "WI_COUNTY_MODE_1998_2024",
          "WI_SEASON_2022",
          "WI_SEASON_2023",
          "WI_SEASON_2024"
        ],
        "limitations": [
          "City-harbor shadow candidate supported by exact Wisconsin DNR access/species guidance, county pier-mode recurrence, statewide pier temporal shape, and dated local reports. The numeric curve is a provisional FinFindr calibration.",
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "racine_wi__coho_salmon__fall_harbor_staging__v3_pass1",
        "modeId": "fall_harbor_staging",
        "fisheryStrength": 7.3,
        "availabilityKnots": [
          {
            "monthDay": "08-01",
            "availability": 0
          },
          {
            "monthDay": "08-16",
            "availability": 0.35
          },
          {
            "monthDay": "08-29",
            "availability": 0.72
          },
          {
            "monthDay": "09-07",
            "availability": 1
          },
          {
            "monthDay": "10-07",
            "availability": 0.78
          },
          {
            "monthDay": "11-07",
            "availability": 0.32
          },
          {
            "monthDay": "12-01",
            "availability": 0
          }
        ],
        "thermalCurveId": "coho_salmon__shared_temperature__v0_2",
        "modeName": "Fall harbor staging",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "WI_ACCESS_2026",
          "WI_EXACT_PIER_SPECIES_2023",
          "WI_COUNTY_MODE_1998_2024",
          "WI_SEASON_2022",
          "WI_SEASON_2023",
          "WI_SEASON_2024"
        ],
        "limitations": [
          "City-harbor shadow candidate supported by exact Wisconsin DNR access/species guidance, county pier-mode recurrence, statewide pier temporal shape, and dated local reports. The numeric curve is a provisional FinFindr calibration.",
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "racine_wi/steelhead",
    "cityId": "racine_wi",
    "speciesId": "steelhead",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "racine_wi__steelhead__winter_spring_thermal_front__v3_pass1",
        "modeId": "winter_spring_thermal_front",
        "fisheryStrength": 5.3,
        "availabilityKnots": [
          {
            "monthDay": "01-01",
            "availability": 0.55
          },
          {
            "monthDay": "03-15",
            "availability": 0.8
          },
          {
            "monthDay": "04-15",
            "availability": 1
          },
          {
            "monthDay": "05-15",
            "availability": 0.35
          },
          {
            "monthDay": "06-01",
            "availability": 0
          },
          {
            "monthDay": "11-15",
            "availability": 0
          },
          {
            "monthDay": "12-31",
            "availability": 0.55
          }
        ],
        "thermalCurveId": "steelhead__shared_temperature__v0_2",
        "modeName": "Winter and spring thermal-front opportunity",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "WI_ACCESS_2026",
          "WI_EXACT_PIER_SPECIES_2023",
          "WI_COUNTY_MODE_1998_2024",
          "WI_SEASON_2022",
          "WI_SEASON_2023",
          "WI_SEASON_2024"
        ],
        "limitations": [
          "City-harbor shadow candidate supported by exact Wisconsin DNR access/species guidance, county pier-mode recurrence, statewide pier temporal shape, and dated local reports. The numeric curve is a provisional FinFindr calibration.",
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "racine_wi__steelhead__summer_thermal_break_or_upwelling__v3_pass1",
        "modeId": "summer_thermal_break_or_upwelling",
        "fisheryStrength": 5.7,
        "availabilityKnots": [
          {
            "monthDay": "05-20",
            "availability": 0
          },
          {
            "monthDay": "06-11",
            "availability": 0.35
          },
          {
            "monthDay": "07-01",
            "availability": 0.72
          },
          {
            "monthDay": "07-15",
            "availability": 1
          },
          {
            "monthDay": "08-04",
            "availability": 0.78
          },
          {
            "monthDay": "08-25",
            "availability": 0.32
          },
          {
            "monthDay": "09-10",
            "availability": 0
          }
        ],
        "thermalCurveId": "steelhead__shared_temperature__v0_2",
        "modeName": "Summer thermal break or upwelling",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "WI_ACCESS_2026",
          "WI_EXACT_PIER_SPECIES_2023",
          "WI_COUNTY_MODE_1998_2024",
          "WI_SEASON_2022",
          "WI_SEASON_2023",
          "WI_SEASON_2024"
        ],
        "limitations": [
          "City-harbor shadow candidate supported by exact Wisconsin DNR access/species guidance, county pier-mode recurrence, statewide pier temporal shape, and dated local reports. The numeric curve is a provisional FinFindr calibration.",
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "racine_wi__steelhead__fall_harbor_staging__v3_pass1",
        "modeId": "fall_harbor_staging",
        "fisheryStrength": 2.5,
        "availabilityKnots": [
          {
            "monthDay": "08-25",
            "availability": 0
          },
          {
            "monthDay": "08-28",
            "availability": 0.35
          },
          {
            "monthDay": "08-30",
            "availability": 0.72
          },
          {
            "monthDay": "09-01",
            "availability": 1
          },
          {
            "monthDay": "10-08",
            "availability": 0.78
          },
          {
            "monthDay": "11-16",
            "availability": 0.32
          },
          {
            "monthDay": "12-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "steelhead__shared_temperature__v0_2",
        "modeName": "Fall harbor staging",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "WI_ACCESS_2026",
          "WI_EXACT_PIER_SPECIES_2023",
          "WI_COUNTY_MODE_1998_2024",
          "WI_SEASON_2022",
          "WI_SEASON_2023",
          "WI_SEASON_2024"
        ],
        "limitations": [
          "City-harbor shadow candidate supported by exact Wisconsin DNR access/species guidance, county pier-mode recurrence, statewide pier temporal shape, and dated local reports. The numeric curve is a provisional FinFindr calibration.",
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "racine_wi/brown_trout",
    "cityId": "racine_wi",
    "speciesId": "brown_trout",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "racine_wi__brown_trout__winter_harbor_open_water__v3_pass1",
        "modeId": "winter_harbor_open_water",
        "fisheryStrength": 3.9,
        "availabilityKnots": [
          {
            "monthDay": "01-01",
            "availability": 0.9
          },
          {
            "monthDay": "01-15",
            "availability": 1
          },
          {
            "monthDay": "03-01",
            "availability": 0.65
          },
          {
            "monthDay": "04-01",
            "availability": 0
          },
          {
            "monthDay": "10-15",
            "availability": 0
          },
          {
            "monthDay": "11-15",
            "availability": 0.45
          },
          {
            "monthDay": "12-31",
            "availability": 0.9
          }
        ],
        "thermalCurveId": "brown_trout__shared_temperature__v0_2",
        "modeName": "Winter harbor open water",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "WI_ACCESS_2026",
          "WI_EXACT_PIER_SPECIES_2023",
          "WI_COUNTY_MODE_1998_2024",
          "WI_SEASON_2022",
          "WI_SEASON_2023",
          "WI_SEASON_2024"
        ],
        "limitations": [
          "City-harbor shadow candidate supported by exact Wisconsin DNR access/species guidance, county pier-mode recurrence, statewide pier temporal shape, and dated local reports. The numeric curve is a provisional FinFindr calibration.",
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "racine_wi__brown_trout__spring_nearshore__v3_pass1",
        "modeId": "spring_nearshore",
        "fisheryStrength": 6.7,
        "availabilityKnots": [
          {
            "monthDay": "02-15",
            "availability": 0
          },
          {
            "monthDay": "03-05",
            "availability": 0.35
          },
          {
            "monthDay": "03-21",
            "availability": 0.72
          },
          {
            "monthDay": "04-01",
            "availability": 1
          },
          {
            "monthDay": "05-08",
            "availability": 0.78
          },
          {
            "monthDay": "06-16",
            "availability": 0.32
          },
          {
            "monthDay": "07-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "brown_trout__shared_temperature__v0_2",
        "modeName": "Spring nearshore",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "WI_ACCESS_2026",
          "WI_EXACT_PIER_SPECIES_2023",
          "WI_COUNTY_MODE_1998_2024",
          "WI_SEASON_2022",
          "WI_SEASON_2023",
          "WI_SEASON_2024"
        ],
        "limitations": [
          "City-harbor shadow candidate supported by exact Wisconsin DNR access/species guidance, county pier-mode recurrence, statewide pier temporal shape, and dated local reports. The numeric curve is a provisional FinFindr calibration.",
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "kenosha_wi/chinook_salmon",
    "cityId": "kenosha_wi",
    "speciesId": "chinook_salmon",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "kenosha_wi__chinook_salmon__summer_coldwater_access__v3_pass1",
        "modeId": "summer_coldwater_access",
        "fisheryStrength": 6.6,
        "availabilityKnots": [
          {
            "monthDay": "06-01",
            "availability": 0
          },
          {
            "monthDay": "06-29",
            "availability": 0.35
          },
          {
            "monthDay": "07-24",
            "availability": 0.72
          },
          {
            "monthDay": "08-10",
            "availability": 1
          },
          {
            "monthDay": "08-14",
            "availability": 0.78
          },
          {
            "monthDay": "08-17",
            "availability": 0.32
          },
          {
            "monthDay": "08-20",
            "availability": 0
          }
        ],
        "thermalCurveId": "chinook_salmon__shared_temperature__v0_2",
        "modeName": "Summer cold-water access",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "WI_ACCESS_2026",
          "WI_EXACT_PIER_SPECIES_2023",
          "WI_COUNTY_MODE_1998_2024",
          "WI_SEASON_2022",
          "WI_SEASON_2023",
          "WI_SEASON_2024"
        ],
        "limitations": [
          "City-harbor shadow candidate supported by exact Wisconsin DNR access/species guidance, county pier-mode recurrence, statewide pier temporal shape, and dated local reports. The numeric curve is a provisional FinFindr calibration.",
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "kenosha_wi__chinook_salmon__fall_harbor_staging__v3_pass1",
        "modeId": "fall_harbor_staging",
        "fisheryStrength": 6.7,
        "availabilityKnots": [
          {
            "monthDay": "07-20",
            "availability": 0
          },
          {
            "monthDay": "07-30",
            "availability": 0.35
          },
          {
            "monthDay": "08-09",
            "availability": 0.72
          },
          {
            "monthDay": "08-15",
            "availability": 1
          },
          {
            "monthDay": "09-11",
            "availability": 0.78
          },
          {
            "monthDay": "10-10",
            "availability": 0.32
          },
          {
            "monthDay": "11-01",
            "availability": 0
          }
        ],
        "thermalCurveId": "chinook_salmon__shared_temperature__v0_2",
        "modeName": "Fall harbor staging",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "WI_ACCESS_2026",
          "WI_EXACT_PIER_SPECIES_2023",
          "WI_COUNTY_MODE_1998_2024",
          "WI_SEASON_2022",
          "WI_SEASON_2023",
          "WI_SEASON_2024"
        ],
        "limitations": [
          "City-harbor shadow candidate supported by exact Wisconsin DNR access/species guidance, county pier-mode recurrence, statewide pier temporal shape, and dated local reports. The numeric curve is a provisional FinFindr calibration.",
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "kenosha_wi/coho_salmon",
    "cityId": "kenosha_wi",
    "speciesId": "coho_salmon",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "kenosha_wi__coho_salmon__spring_nearshore__v3_pass1",
        "modeId": "spring_nearshore",
        "fisheryStrength": 8,
        "availabilityKnots": [
          {
            "monthDay": "02-15",
            "availability": 0
          },
          {
            "monthDay": "03-13",
            "availability": 0.35
          },
          {
            "monthDay": "04-04",
            "availability": 0.72
          },
          {
            "monthDay": "04-20",
            "availability": 1
          },
          {
            "monthDay": "05-15",
            "availability": 0.78
          },
          {
            "monthDay": "06-10",
            "availability": 0.32
          },
          {
            "monthDay": "06-30",
            "availability": 0
          }
        ],
        "thermalCurveId": "coho_salmon__shared_temperature__v0_2",
        "modeName": "Spring nearshore",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "WI_ACCESS_2026",
          "WI_EXACT_PIER_SPECIES_2023",
          "WI_COUNTY_MODE_1998_2024",
          "WI_SEASON_2022",
          "WI_SEASON_2023",
          "WI_SEASON_2024"
        ],
        "limitations": [
          "City-harbor shadow candidate supported by exact Wisconsin DNR access/species guidance, county pier-mode recurrence, statewide pier temporal shape, and dated local reports. The numeric curve is a provisional FinFindr calibration.",
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "kenosha_wi__coho_salmon__summer_coldwater_access__v3_pass1",
        "modeId": "summer_coldwater_access",
        "fisheryStrength": 4.5,
        "availabilityKnots": [
          {
            "monthDay": "06-10",
            "availability": 0
          },
          {
            "monthDay": "06-26",
            "availability": 0.35
          },
          {
            "monthDay": "07-10",
            "availability": 0.72
          },
          {
            "monthDay": "07-20",
            "availability": 1
          },
          {
            "monthDay": "08-02",
            "availability": 0.78
          },
          {
            "monthDay": "08-15",
            "availability": 0.32
          },
          {
            "monthDay": "08-25",
            "availability": 0
          }
        ],
        "thermalCurveId": "coho_salmon__shared_temperature__v0_2",
        "modeName": "Summer cold-water access",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "WI_ACCESS_2026",
          "WI_EXACT_PIER_SPECIES_2023",
          "WI_COUNTY_MODE_1998_2024",
          "WI_SEASON_2022",
          "WI_SEASON_2023",
          "WI_SEASON_2024"
        ],
        "limitations": [
          "City-harbor shadow candidate supported by exact Wisconsin DNR access/species guidance, county pier-mode recurrence, statewide pier temporal shape, and dated local reports. The numeric curve is a provisional FinFindr calibration.",
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "kenosha_wi__coho_salmon__fall_harbor_staging__v3_pass1",
        "modeId": "fall_harbor_staging",
        "fisheryStrength": 6.4,
        "availabilityKnots": [
          {
            "monthDay": "08-01",
            "availability": 0
          },
          {
            "monthDay": "08-16",
            "availability": 0.35
          },
          {
            "monthDay": "08-29",
            "availability": 0.72
          },
          {
            "monthDay": "09-07",
            "availability": 1
          },
          {
            "monthDay": "10-07",
            "availability": 0.78
          },
          {
            "monthDay": "11-07",
            "availability": 0.32
          },
          {
            "monthDay": "12-01",
            "availability": 0
          }
        ],
        "thermalCurveId": "coho_salmon__shared_temperature__v0_2",
        "modeName": "Fall harbor staging",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "WI_ACCESS_2026",
          "WI_EXACT_PIER_SPECIES_2023",
          "WI_COUNTY_MODE_1998_2024",
          "WI_SEASON_2022",
          "WI_SEASON_2023",
          "WI_SEASON_2024"
        ],
        "limitations": [
          "City-harbor shadow candidate supported by exact Wisconsin DNR access/species guidance, county pier-mode recurrence, statewide pier temporal shape, and dated local reports. The numeric curve is a provisional FinFindr calibration.",
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "kenosha_wi/steelhead",
    "cityId": "kenosha_wi",
    "speciesId": "steelhead",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "kenosha_wi__steelhead__winter_spring_thermal_front__v3_pass1",
        "modeId": "winter_spring_thermal_front",
        "fisheryStrength": 4.3,
        "availabilityKnots": [
          {
            "monthDay": "01-01",
            "availability": 0.55
          },
          {
            "monthDay": "03-15",
            "availability": 0.8
          },
          {
            "monthDay": "04-15",
            "availability": 1
          },
          {
            "monthDay": "05-15",
            "availability": 0.35
          },
          {
            "monthDay": "06-01",
            "availability": 0
          },
          {
            "monthDay": "11-15",
            "availability": 0
          },
          {
            "monthDay": "12-31",
            "availability": 0.55
          }
        ],
        "thermalCurveId": "steelhead__shared_temperature__v0_2",
        "modeName": "Winter and spring thermal-front opportunity",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "WI_ACCESS_2026",
          "WI_EXACT_PIER_SPECIES_2023",
          "WI_COUNTY_MODE_1998_2024",
          "WI_SEASON_2022",
          "WI_SEASON_2023",
          "WI_SEASON_2024"
        ],
        "limitations": [
          "City-harbor shadow candidate supported by exact Wisconsin DNR access/species guidance, county pier-mode recurrence, statewide pier temporal shape, and dated local reports. The numeric curve is a provisional FinFindr calibration.",
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "kenosha_wi__steelhead__summer_thermal_break_or_upwelling__v3_pass1",
        "modeId": "summer_thermal_break_or_upwelling",
        "fisheryStrength": 4.2,
        "availabilityKnots": [
          {
            "monthDay": "05-20",
            "availability": 0
          },
          {
            "monthDay": "06-11",
            "availability": 0.35
          },
          {
            "monthDay": "07-01",
            "availability": 0.72
          },
          {
            "monthDay": "07-15",
            "availability": 1
          },
          {
            "monthDay": "08-04",
            "availability": 0.78
          },
          {
            "monthDay": "08-25",
            "availability": 0.32
          },
          {
            "monthDay": "09-10",
            "availability": 0
          }
        ],
        "thermalCurveId": "steelhead__shared_temperature__v0_2",
        "modeName": "Summer thermal break or upwelling",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "WI_ACCESS_2026",
          "WI_EXACT_PIER_SPECIES_2023",
          "WI_COUNTY_MODE_1998_2024",
          "WI_SEASON_2022",
          "WI_SEASON_2023",
          "WI_SEASON_2024"
        ],
        "limitations": [
          "City-harbor shadow candidate supported by exact Wisconsin DNR access/species guidance, county pier-mode recurrence, statewide pier temporal shape, and dated local reports. The numeric curve is a provisional FinFindr calibration.",
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "kenosha_wi__steelhead__fall_harbor_staging__v3_pass1",
        "modeId": "fall_harbor_staging",
        "fisheryStrength": 2.1,
        "availabilityKnots": [
          {
            "monthDay": "08-25",
            "availability": 0
          },
          {
            "monthDay": "08-28",
            "availability": 0.35
          },
          {
            "monthDay": "08-30",
            "availability": 0.72
          },
          {
            "monthDay": "09-01",
            "availability": 1
          },
          {
            "monthDay": "10-08",
            "availability": 0.78
          },
          {
            "monthDay": "11-16",
            "availability": 0.32
          },
          {
            "monthDay": "12-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "steelhead__shared_temperature__v0_2",
        "modeName": "Fall harbor staging",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "WI_ACCESS_2026",
          "WI_EXACT_PIER_SPECIES_2023",
          "WI_COUNTY_MODE_1998_2024",
          "WI_SEASON_2022",
          "WI_SEASON_2023",
          "WI_SEASON_2024"
        ],
        "limitations": [
          "City-harbor shadow candidate supported by exact Wisconsin DNR access/species guidance, county pier-mode recurrence, statewide pier temporal shape, and dated local reports. The numeric curve is a provisional FinFindr calibration.",
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "kenosha_wi/brown_trout",
    "cityId": "kenosha_wi",
    "speciesId": "brown_trout",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "kenosha_wi__brown_trout__winter_harbor_open_water__v3_pass1",
        "modeId": "winter_harbor_open_water",
        "fisheryStrength": 3.5,
        "availabilityKnots": [
          {
            "monthDay": "01-01",
            "availability": 0.9
          },
          {
            "monthDay": "01-15",
            "availability": 1
          },
          {
            "monthDay": "03-01",
            "availability": 0.65
          },
          {
            "monthDay": "04-01",
            "availability": 0
          },
          {
            "monthDay": "10-15",
            "availability": 0
          },
          {
            "monthDay": "11-15",
            "availability": 0.45
          },
          {
            "monthDay": "12-31",
            "availability": 0.9
          }
        ],
        "thermalCurveId": "brown_trout__shared_temperature__v0_2",
        "modeName": "Winter harbor open water",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "WI_ACCESS_2026",
          "WI_EXACT_PIER_SPECIES_2023",
          "WI_COUNTY_MODE_1998_2024",
          "WI_SEASON_2022",
          "WI_SEASON_2023",
          "WI_SEASON_2024"
        ],
        "limitations": [
          "City-harbor shadow candidate supported by exact Wisconsin DNR access/species guidance, county pier-mode recurrence, statewide pier temporal shape, and dated local reports. The numeric curve is a provisional FinFindr calibration.",
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "kenosha_wi__brown_trout__spring_nearshore__v3_pass1",
        "modeId": "spring_nearshore",
        "fisheryStrength": 5.8,
        "availabilityKnots": [
          {
            "monthDay": "02-15",
            "availability": 0
          },
          {
            "monthDay": "03-05",
            "availability": 0.35
          },
          {
            "monthDay": "03-21",
            "availability": 0.72
          },
          {
            "monthDay": "04-01",
            "availability": 1
          },
          {
            "monthDay": "05-08",
            "availability": 0.78
          },
          {
            "monthDay": "06-16",
            "availability": 0.32
          },
          {
            "monthDay": "07-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "brown_trout__shared_temperature__v0_2",
        "modeName": "Spring nearshore",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "WI_ACCESS_2026",
          "WI_EXACT_PIER_SPECIES_2023",
          "WI_COUNTY_MODE_1998_2024",
          "WI_SEASON_2022",
          "WI_SEASON_2023",
          "WI_SEASON_2024"
        ],
        "limitations": [
          "City-harbor shadow candidate supported by exact Wisconsin DNR access/species guidance, county pier-mode recurrence, statewide pier temporal shape, and dated local reports. The numeric curve is a provisional FinFindr calibration.",
          "No comparable city-specific pier effort denominator is published; the decimal is a bounded FinFindr calibration judgment.",
          "Shared surface-temperature compatibility is provisional and is not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "ludington_mi/lake_trout",
    "cityId": "ludington_mi",
    "speciesId": "lake_trout",
    "ratingEnabled": false,
    "closedWindows": [],
    "modes": [
      {
        "modeCalibrationId": "ludington_mi__lake_trout__cold_season_nearshore__v3_secondary_v1",
        "modeId": "cold_season_nearshore",
        "fisheryStrength": 3.8,
        "availabilityKnots": [
          {
            "monthDay": "10-15",
            "availability": 0
          },
          {
            "monthDay": "11-15",
            "availability": 0.45
          },
          {
            "monthDay": "01-20",
            "availability": 1
          },
          {
            "monthDay": "03-15",
            "availability": 0.78
          },
          {
            "monthDay": "04-30",
            "availability": 0.28
          },
          {
            "monthDay": "05-31",
            "availability": 0
          }
        ],
        "thermalCurveId": "lake_trout__additional_thermal_research__v0_1",
        "modeName": "Cold-season nearshore access",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "MI_CREEL",
          "B_2521a66",
          "B_257279c",
          "MI_STOCKING",
          "SECONDARY_MI_ROADMAP",
          "THERMAL_LAKE_TROUT_USGS"
        ],
        "limitations": [
          "Port-level Pier/Dock effort is not target-specific and cannot validate an individual daily score.",
          "The shared surface-temperature response is a broad secondary modifier, not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "ludington_mi__lake_trout__summer_coldwater_access__v3_secondary_v1",
        "modeId": "summer_coldwater_access",
        "fisheryStrength": 3.4,
        "availabilityKnots": [
          {
            "monthDay": "05-01",
            "availability": 0
          },
          {
            "monthDay": "06-01",
            "availability": 0.45
          },
          {
            "monthDay": "07-10",
            "availability": 1
          },
          {
            "monthDay": "08-20",
            "availability": 0.55
          },
          {
            "monthDay": "09-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "lake_trout__additional_thermal_research__v0_1",
        "modeName": "Summer cold-water access",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "MI_CREEL",
          "B_2521a66",
          "B_257279c",
          "MI_STOCKING",
          "SECONDARY_MI_ROADMAP",
          "THERMAL_LAKE_TROUT_USGS"
        ],
        "limitations": [
          "Port-level Pier/Dock effort is not target-specific and cannot validate an individual daily score.",
          "The shared surface-temperature response is a broad secondary modifier, not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "ludington_mi/smallmouth_bass",
    "cityId": "ludington_mi",
    "speciesId": "smallmouth_bass",
    "ratingEnabled": false,
    "closedWindows": [],
    "modes": [
      {
        "modeCalibrationId": "ludington_mi__smallmouth_bass__warm_season_harbor__v3_secondary_v1",
        "modeId": "warm_season_harbor",
        "fisheryStrength": 5.2,
        "availabilityKnots": [
          {
            "monthDay": "03-15",
            "availability": 0
          },
          {
            "monthDay": "04-20",
            "availability": 0.25
          },
          {
            "monthDay": "05-20",
            "availability": 0.7
          },
          {
            "monthDay": "06-25",
            "availability": 1
          },
          {
            "monthDay": "08-20",
            "availability": 0.9
          },
          {
            "monthDay": "09-25",
            "availability": 0.35
          },
          {
            "monthDay": "11-01",
            "availability": 0
          }
        ],
        "thermalCurveId": "smallmouth_bass__additional_thermal_research__v0_1",
        "modeName": "Warm-season harbor fishery",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "MI_CREEL",
          "B_2e736eb",
          "B_364ea3a",
          "B_3eeac7b",
          "B_425abbc",
          "B_41407c5",
          "B_2d7cf51",
          "THERMAL_SMALLMOUTH_WIDNR"
        ],
        "limitations": [
          "Port-level Pier/Dock effort is not target-specific and cannot validate an individual daily score.",
          "The shared surface-temperature response is a broad secondary modifier, not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "ludington_mi/freshwater_drum",
    "cityId": "ludington_mi",
    "speciesId": "freshwater_drum",
    "ratingEnabled": false,
    "closedWindows": [],
    "modes": [
      {
        "modeCalibrationId": "ludington_mi__freshwater_drum__warm_season_bottom_fishery__v3_secondary_v1",
        "modeId": "warm_season_bottom_fishery",
        "fisheryStrength": 5,
        "availabilityKnots": [
          {
            "monthDay": "04-01",
            "availability": 0
          },
          {
            "monthDay": "05-05",
            "availability": 0.45
          },
          {
            "monthDay": "06-10",
            "availability": 0.85
          },
          {
            "monthDay": "07-15",
            "availability": 1
          },
          {
            "monthDay": "08-25",
            "availability": 0.9
          },
          {
            "monthDay": "10-01",
            "availability": 0.3
          },
          {
            "monthDay": "11-01",
            "availability": 0
          }
        ],
        "thermalCurveId": "freshwater_drum__additional_thermal_research__v0_1",
        "modeName": "Warm-season bottom fishery",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "MI_CREEL",
          "B_421929e",
          "B_423b34d",
          "THERMAL_DRUM_USGS"
        ],
        "limitations": [
          "Port-level Pier/Dock effort is not target-specific and cannot validate an individual daily score.",
          "The shared surface-temperature response is a broad secondary modifier, not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "ludington_mi/yellow_perch",
    "cityId": "ludington_mi",
    "speciesId": "yellow_perch",
    "ratingEnabled": false,
    "closedWindows": [],
    "modes": [
      {
        "modeCalibrationId": "ludington_mi__yellow_perch__spring_nearshore_schooling__v3_secondary_v1",
        "modeId": "spring_nearshore_schooling",
        "fisheryStrength": 6,
        "availabilityKnots": [
          {
            "monthDay": "02-15",
            "availability": 0
          },
          {
            "monthDay": "03-20",
            "availability": 0.35
          },
          {
            "monthDay": "05-20",
            "availability": 1
          },
          {
            "monthDay": "06-01",
            "availability": 0.55
          },
          {
            "monthDay": "06-25",
            "availability": 0
          }
        ],
        "thermalCurveId": "yellow_perch__additional_thermal_research__v0_1",
        "modeName": "Spring nearshore schooling",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "MI_CREEL",
          "B_323f6bf",
          "B_35ed629",
          "B_3614332",
          "B_364ea3a",
          "B_3675eed",
          "SECONDARY_MI_ROADMAP",
          "THERMAL_PERCH_USGS"
        ],
        "limitations": [
          "Port-level Pier/Dock effort is not target-specific and cannot validate an individual daily score.",
          "The shared surface-temperature response is a broad secondary modifier, not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "ludington_mi__yellow_perch__summer_harbor_schooling__v3_secondary_v1",
        "modeId": "summer_harbor_schooling",
        "fisheryStrength": 7.6,
        "availabilityKnots": [
          {
            "monthDay": "05-15",
            "availability": 0
          },
          {
            "monthDay": "06-16",
            "availability": 0.55
          },
          {
            "monthDay": "07-12",
            "availability": 1
          },
          {
            "monthDay": "08-20",
            "availability": 0.75
          },
          {
            "monthDay": "10-01",
            "availability": 0.2
          },
          {
            "monthDay": "11-01",
            "availability": 0
          }
        ],
        "thermalCurveId": "yellow_perch__additional_thermal_research__v0_1",
        "modeName": "Summer harbor schooling",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "MI_CREEL",
          "B_323f6bf",
          "B_35ed629",
          "B_3614332",
          "B_364ea3a",
          "B_3675eed",
          "SECONDARY_MI_ROADMAP",
          "THERMAL_PERCH_USGS"
        ],
        "limitations": [
          "Port-level Pier/Dock effort is not target-specific and cannot validate an individual daily score.",
          "The shared surface-temperature response is a broad secondary modifier, not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "grand_haven_mi/lake_trout",
    "cityId": "grand_haven_mi",
    "speciesId": "lake_trout",
    "ratingEnabled": false,
    "closedWindows": [],
    "modes": [
      {
        "modeCalibrationId": "grand_haven_mi__lake_trout__cold_season_nearshore__v3_secondary_v1",
        "modeId": "cold_season_nearshore",
        "fisheryStrength": 3.6,
        "availabilityKnots": [
          {
            "monthDay": "10-15",
            "availability": 0
          },
          {
            "monthDay": "11-15",
            "availability": 0.45
          },
          {
            "monthDay": "01-20",
            "availability": 1
          },
          {
            "monthDay": "03-15",
            "availability": 0.78
          },
          {
            "monthDay": "04-30",
            "availability": 0.28
          },
          {
            "monthDay": "05-31",
            "availability": 0
          }
        ],
        "thermalCurveId": "lake_trout__additional_thermal_research__v0_1",
        "modeName": "Cold-season nearshore access",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "MI_CREEL",
          "MI_STOCKING",
          "SECONDARY_MI_ROADMAP",
          "THERMAL_LAKE_TROUT_USGS"
        ],
        "limitations": [
          "Port-level Pier/Dock effort is not target-specific and cannot validate an individual daily score.",
          "The shared surface-temperature response is a broad secondary modifier, not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "grand_haven_mi__lake_trout__summer_coldwater_access__v3_secondary_v1",
        "modeId": "summer_coldwater_access",
        "fisheryStrength": 3.4,
        "availabilityKnots": [
          {
            "monthDay": "05-01",
            "availability": 0
          },
          {
            "monthDay": "06-01",
            "availability": 0.45
          },
          {
            "monthDay": "07-10",
            "availability": 1
          },
          {
            "monthDay": "08-20",
            "availability": 0.55
          },
          {
            "monthDay": "09-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "lake_trout__additional_thermal_research__v0_1",
        "modeName": "Summer cold-water access",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "MI_CREEL",
          "MI_STOCKING",
          "SECONDARY_MI_ROADMAP",
          "THERMAL_LAKE_TROUT_USGS"
        ],
        "limitations": [
          "Port-level Pier/Dock effort is not target-specific and cannot validate an individual daily score.",
          "The shared surface-temperature response is a broad secondary modifier, not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "grand_haven_mi/smallmouth_bass",
    "cityId": "grand_haven_mi",
    "speciesId": "smallmouth_bass",
    "ratingEnabled": false,
    "closedWindows": [],
    "modes": [
      {
        "modeCalibrationId": "grand_haven_mi__smallmouth_bass__warm_season_harbor__v3_secondary_v1",
        "modeId": "warm_season_harbor",
        "fisheryStrength": 4.8,
        "availabilityKnots": [
          {
            "monthDay": "03-15",
            "availability": 0
          },
          {
            "monthDay": "04-20",
            "availability": 0.25
          },
          {
            "monthDay": "05-20",
            "availability": 0.7
          },
          {
            "monthDay": "06-25",
            "availability": 1
          },
          {
            "monthDay": "08-20",
            "availability": 0.9
          },
          {
            "monthDay": "09-25",
            "availability": 0.35
          },
          {
            "monthDay": "11-01",
            "availability": 0
          }
        ],
        "thermalCurveId": "smallmouth_bass__additional_thermal_research__v0_1",
        "modeName": "Warm-season harbor fishery",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "MI_CREEL",
          "B_207cdc1",
          "B_3ebb776",
          "B_425abbc",
          "B_3e9b7f3",
          "THERMAL_SMALLMOUTH_WIDNR"
        ],
        "limitations": [
          "Port-level Pier/Dock effort is not target-specific and cannot validate an individual daily score.",
          "The shared surface-temperature response is a broad secondary modifier, not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "grand_haven_mi/freshwater_drum",
    "cityId": "grand_haven_mi",
    "speciesId": "freshwater_drum",
    "ratingEnabled": false,
    "closedWindows": [],
    "modes": [
      {
        "modeCalibrationId": "grand_haven_mi__freshwater_drum__warm_season_bottom_fishery__v3_secondary_v1",
        "modeId": "warm_season_bottom_fishery",
        "fisheryStrength": 7.2,
        "availabilityKnots": [
          {
            "monthDay": "04-01",
            "availability": 0
          },
          {
            "monthDay": "05-05",
            "availability": 0.45
          },
          {
            "monthDay": "06-10",
            "availability": 0.85
          },
          {
            "monthDay": "07-15",
            "availability": 1
          },
          {
            "monthDay": "08-25",
            "availability": 0.9
          },
          {
            "monthDay": "10-01",
            "availability": 0.3
          },
          {
            "monthDay": "11-01",
            "availability": 0
          }
        ],
        "thermalCurveId": "freshwater_drum__additional_thermal_research__v0_1",
        "modeName": "Warm-season bottom fishery",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "MI_CREEL",
          "B_3588f66",
          "B_3614332",
          "B_36281c5",
          "B_3a65224",
          "B_41a3a94",
          "B_41b62ae",
          "B_41c718b",
          "B_41e9e6e",
          "B_4280cb4",
          "THERMAL_DRUM_USGS"
        ],
        "limitations": [
          "Port-level Pier/Dock effort is not target-specific and cannot validate an individual daily score.",
          "The shared surface-temperature response is a broad secondary modifier, not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "grand_haven_mi/yellow_perch",
    "cityId": "grand_haven_mi",
    "speciesId": "yellow_perch",
    "ratingEnabled": false,
    "closedWindows": [],
    "modes": [
      {
        "modeCalibrationId": "grand_haven_mi__yellow_perch__spring_nearshore_schooling__v3_secondary_v1",
        "modeId": "spring_nearshore_schooling",
        "fisheryStrength": 4.4,
        "availabilityKnots": [
          {
            "monthDay": "02-15",
            "availability": 0
          },
          {
            "monthDay": "03-20",
            "availability": 0.35
          },
          {
            "monthDay": "05-10",
            "availability": 1
          },
          {
            "monthDay": "06-01",
            "availability": 0.55
          },
          {
            "monthDay": "06-25",
            "availability": 0
          }
        ],
        "thermalCurveId": "yellow_perch__additional_thermal_research__v0_1",
        "modeName": "Spring nearshore schooling",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "MI_CREEL",
          "MI_2025",
          "SECONDARY_MI_ROADMAP",
          "THERMAL_PERCH_USGS"
        ],
        "limitations": [
          "Port-level Pier/Dock effort is not target-specific and cannot validate an individual daily score.",
          "The shared surface-temperature response is a broad secondary modifier, not the fish's experienced temperature.",
          "Recent recruitment is encouraging but is not converted into an automatic score increase; the ceiling remains below historical harvest-era strength."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "grand_haven_mi__yellow_perch__summer_harbor_schooling__v3_secondary_v1",
        "modeId": "summer_harbor_schooling",
        "fisheryStrength": 6,
        "availabilityKnots": [
          {
            "monthDay": "05-15",
            "availability": 0
          },
          {
            "monthDay": "06-16",
            "availability": 0.55
          },
          {
            "monthDay": "08-05",
            "availability": 1
          },
          {
            "monthDay": "08-20",
            "availability": 0.75
          },
          {
            "monthDay": "10-01",
            "availability": 0.2
          },
          {
            "monthDay": "11-01",
            "availability": 0
          }
        ],
        "thermalCurveId": "yellow_perch__additional_thermal_research__v0_1",
        "modeName": "Summer harbor schooling",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "MI_CREEL",
          "MI_2025",
          "SECONDARY_MI_ROADMAP",
          "THERMAL_PERCH_USGS"
        ],
        "limitations": [
          "Port-level Pier/Dock effort is not target-specific and cannot validate an individual daily score.",
          "The shared surface-temperature response is a broad secondary modifier, not the fish's experienced temperature.",
          "Recent recruitment is encouraging but is not converted into an automatic score increase; the ceiling remains below historical harvest-era strength."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "grand_haven_mi/round_whitefish",
    "cityId": "grand_haven_mi",
    "speciesId": "round_whitefish",
    "ratingEnabled": false,
    "closedWindows": [],
    "modes": [
      {
        "modeCalibrationId": "grand_haven_mi__round_whitefish__spring_menominee__v3_secondary_v1",
        "modeId": "spring_menominee",
        "fisheryStrength": 3.8,
        "availabilityKnots": [
          {
            "monthDay": "02-15",
            "availability": 0
          },
          {
            "monthDay": "03-20",
            "availability": 0.4
          },
          {
            "monthDay": "04-15",
            "availability": 1
          },
          {
            "monthDay": "05-10",
            "availability": 0.45
          },
          {
            "monthDay": "06-01",
            "availability": 0
          }
        ],
        "thermalCurveId": "round_whitefish__additional_thermal_research__v0_1",
        "modeName": "Spring menominee fishery",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "MI_CREEL",
          "B_2cce8db",
          "B_2cea412",
          "ROUND_DECLINE",
          "P2_GLFC1987",
          "P2_ROUND_JUVENILE2023"
        ],
        "limitations": [
          "Port-level Pier/Dock effort is not target-specific and cannot validate an individual daily score.",
          "The shared surface-temperature response is a broad secondary modifier, not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "grand_haven_mi/channel_catfish",
    "cityId": "grand_haven_mi",
    "speciesId": "channel_catfish",
    "ratingEnabled": false,
    "closedWindows": [],
    "modes": [
      {
        "modeCalibrationId": "grand_haven_mi__channel_catfish__warm_season_channel__v3_secondary_v1",
        "modeId": "warm_season_channel",
        "fisheryStrength": 5.8,
        "availabilityKnots": [
          {
            "monthDay": "03-20",
            "availability": 0
          },
          {
            "monthDay": "05-01",
            "availability": 0.45
          },
          {
            "monthDay": "06-20",
            "availability": 0.8
          },
          {
            "monthDay": "08-10",
            "availability": 1
          },
          {
            "monthDay": "10-05",
            "availability": 0.55
          },
          {
            "monthDay": "11-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "channel_catfish__additional_thermal_research__v0_1",
        "modeName": "Warm-season channel fishery",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "MI_CREEL",
          "B_3588f66",
          "B_14ccdb0",
          "P2_CATFISH_RELEASE2025"
        ],
        "limitations": [
          "Port-level Pier/Dock effort is not target-specific and cannot validate an individual daily score.",
          "The shared surface-temperature response is a broad secondary modifier, not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "grand_haven_mi/largemouth_bass",
    "cityId": "grand_haven_mi",
    "speciesId": "largemouth_bass",
    "ratingEnabled": false,
    "closedWindows": [],
    "modes": [
      {
        "modeCalibrationId": "grand_haven_mi__largemouth_bass__warm_season_harbor_cover__v3_secondary_v1",
        "modeId": "warm_season_harbor_cover",
        "fisheryStrength": 6.2,
        "availabilityKnots": [
          {
            "monthDay": "03-15",
            "availability": 0
          },
          {
            "monthDay": "04-20",
            "availability": 0.25
          },
          {
            "monthDay": "05-20",
            "availability": 0.7
          },
          {
            "monthDay": "06-25",
            "availability": 1
          },
          {
            "monthDay": "08-20",
            "availability": 0.9
          },
          {
            "monthDay": "09-25",
            "availability": 0.35
          },
          {
            "monthDay": "11-01",
            "availability": 0
          }
        ],
        "thermalCurveId": "largemouth_bass__additional_thermal_research__v0_1",
        "modeName": "Warm-season harbor-cover fishery",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "MI_CREEL",
          "B_207cdc1",
          "B_3e9b7f3",
          "B_3eeac7b",
          "B_426de2b",
          "THERMAL_LARGEMOUTH_MIDNR"
        ],
        "limitations": [
          "Port-level Pier/Dock effort is not target-specific and cannot validate an individual daily score.",
          "The shared surface-temperature response is a broad secondary modifier, not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "manistee_mi/lake_trout",
    "cityId": "manistee_mi",
    "speciesId": "lake_trout",
    "ratingEnabled": false,
    "closedWindows": [],
    "modes": [
      {
        "modeCalibrationId": "manistee_mi__lake_trout__cold_season_nearshore__v3_secondary_v1",
        "modeId": "cold_season_nearshore",
        "fisheryStrength": 4,
        "availabilityKnots": [
          {
            "monthDay": "10-15",
            "availability": 0
          },
          {
            "monthDay": "11-15",
            "availability": 0.45
          },
          {
            "monthDay": "01-20",
            "availability": 1
          },
          {
            "monthDay": "03-15",
            "availability": 0.78
          },
          {
            "monthDay": "04-30",
            "availability": 0.28
          },
          {
            "monthDay": "05-31",
            "availability": 0
          }
        ],
        "thermalCurveId": "lake_trout__additional_thermal_research__v0_1",
        "modeName": "Cold-season nearshore access",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "MI_CREEL",
          "B_3155afc",
          "B_3548e2b",
          "B_39595be",
          "MI_STOCKING",
          "SECONDARY_MI_ROADMAP",
          "THERMAL_LAKE_TROUT_USGS"
        ],
        "limitations": [
          "Port-level Pier/Dock effort is not target-specific and cannot validate an individual daily score.",
          "The shared surface-temperature response is a broad secondary modifier, not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "manistee_mi__lake_trout__summer_coldwater_access__v3_secondary_v1",
        "modeId": "summer_coldwater_access",
        "fisheryStrength": 3.6,
        "availabilityKnots": [
          {
            "monthDay": "05-01",
            "availability": 0
          },
          {
            "monthDay": "06-01",
            "availability": 0.45
          },
          {
            "monthDay": "07-10",
            "availability": 1
          },
          {
            "monthDay": "08-20",
            "availability": 0.55
          },
          {
            "monthDay": "09-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "lake_trout__additional_thermal_research__v0_1",
        "modeName": "Summer cold-water access",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "MI_CREEL",
          "B_3155afc",
          "B_3548e2b",
          "B_39595be",
          "MI_STOCKING",
          "SECONDARY_MI_ROADMAP",
          "THERMAL_LAKE_TROUT_USGS"
        ],
        "limitations": [
          "Port-level Pier/Dock effort is not target-specific and cannot validate an individual daily score.",
          "The shared surface-temperature response is a broad secondary modifier, not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "manistee_mi/walleye",
    "cityId": "manistee_mi",
    "speciesId": "walleye",
    "ratingEnabled": false,
    "closedWindows": [],
    "modes": [
      {
        "modeCalibrationId": "manistee_mi__walleye__spring_low_light__v3_secondary_v1",
        "modeId": "spring_low_light",
        "fisheryStrength": 4.2,
        "availabilityKnots": [
          {
            "monthDay": "03-01",
            "availability": 0
          },
          {
            "monthDay": "04-01",
            "availability": 0.5
          },
          {
            "monthDay": "05-10",
            "availability": 1
          },
          {
            "monthDay": "06-10",
            "availability": 0.4
          },
          {
            "monthDay": "07-01",
            "availability": 0
          }
        ],
        "thermalCurveId": "walleye__additional_thermal_research__v0_1",
        "modeName": "Spring low-light fishery",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "MI_CREEL",
          "B_3176352",
          "B_3588f66",
          "B_3987c22",
          "B_14ccdb0",
          "P2_WALLEYE_TELEMETRY2025"
        ],
        "limitations": [
          "Port-level Pier/Dock effort is not target-specific and cannot validate an individual daily score.",
          "The shared surface-temperature response is a broad secondary modifier, not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "manistee_mi/smallmouth_bass",
    "cityId": "manistee_mi",
    "speciesId": "smallmouth_bass",
    "ratingEnabled": false,
    "closedWindows": [],
    "modes": [
      {
        "modeCalibrationId": "manistee_mi__smallmouth_bass__warm_season_harbor__v3_secondary_v1",
        "modeId": "warm_season_harbor",
        "fisheryStrength": 5,
        "availabilityKnots": [
          {
            "monthDay": "03-15",
            "availability": 0
          },
          {
            "monthDay": "04-20",
            "availability": 0.25
          },
          {
            "monthDay": "05-20",
            "availability": 0.7
          },
          {
            "monthDay": "06-25",
            "availability": 1
          },
          {
            "monthDay": "08-20",
            "availability": 0.9
          },
          {
            "monthDay": "09-25",
            "availability": 0.35
          },
          {
            "monthDay": "11-01",
            "availability": 0
          }
        ],
        "thermalCurveId": "smallmouth_bass__additional_thermal_research__v0_1",
        "modeName": "Warm-season harbor fishery",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "MI_CREEL",
          "B_366250d",
          "B_3675eed",
          "B_3a65224",
          "B_3abfd6e",
          "THERMAL_SMALLMOUTH_WIDNR"
        ],
        "limitations": [
          "Port-level Pier/Dock effort is not target-specific and cannot validate an individual daily score.",
          "The shared surface-temperature response is a broad secondary modifier, not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "manistee_mi/freshwater_drum",
    "cityId": "manistee_mi",
    "speciesId": "freshwater_drum",
    "ratingEnabled": false,
    "closedWindows": [],
    "modes": [
      {
        "modeCalibrationId": "manistee_mi__freshwater_drum__warm_season_bottom_fishery__v3_secondary_v1",
        "modeId": "warm_season_bottom_fishery",
        "fisheryStrength": 4.7,
        "availabilityKnots": [
          {
            "monthDay": "04-01",
            "availability": 0
          },
          {
            "monthDay": "05-05",
            "availability": 0.45
          },
          {
            "monthDay": "06-10",
            "availability": 0.85
          },
          {
            "monthDay": "07-15",
            "availability": 1
          },
          {
            "monthDay": "08-25",
            "availability": 0.9
          },
          {
            "monthDay": "10-01",
            "availability": 0.3
          },
          {
            "monthDay": "11-01",
            "availability": 0
          }
        ],
        "thermalCurveId": "freshwater_drum__additional_thermal_research__v0_1",
        "modeName": "Warm-season bottom fishery",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "MI_CREEL",
          "B_2e736eb",
          "B_366250d",
          "B_3a521c4",
          "B_3a65224",
          "B_3ebb776",
          "THERMAL_DRUM_USGS"
        ],
        "limitations": [
          "Port-level Pier/Dock effort is not target-specific and cannot validate an individual daily score.",
          "The shared surface-temperature response is a broad secondary modifier, not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "manistee_mi/yellow_perch",
    "cityId": "manistee_mi",
    "speciesId": "yellow_perch",
    "ratingEnabled": false,
    "closedWindows": [],
    "modes": [
      {
        "modeCalibrationId": "manistee_mi__yellow_perch__spring_nearshore_schooling__v3_secondary_v1",
        "modeId": "spring_nearshore_schooling",
        "fisheryStrength": 7.2,
        "availabilityKnots": [
          {
            "monthDay": "02-15",
            "availability": 0
          },
          {
            "monthDay": "03-20",
            "availability": 0.35
          },
          {
            "monthDay": "05-05",
            "availability": 1
          },
          {
            "monthDay": "06-01",
            "availability": 0.55
          },
          {
            "monthDay": "06-25",
            "availability": 0
          }
        ],
        "thermalCurveId": "yellow_perch__additional_thermal_research__v0_1",
        "modeName": "Spring nearshore schooling",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "MI_CREEL",
          "B_1953bab",
          "B_3176352",
          "B_3588f66",
          "B_3614332",
          "B_36281c5",
          "B_323f6bf",
          "B_3de4822",
          "SECONDARY_MI_ROADMAP",
          "THERMAL_PERCH_USGS"
        ],
        "limitations": [
          "Port-level Pier/Dock effort is not target-specific and cannot validate an individual daily score.",
          "The shared surface-temperature response is a broad secondary modifier, not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "manistee_mi__yellow_perch__summer_harbor_schooling__v3_secondary_v1",
        "modeId": "summer_harbor_schooling",
        "fisheryStrength": 4.5,
        "availabilityKnots": [
          {
            "monthDay": "05-15",
            "availability": 0
          },
          {
            "monthDay": "06-16",
            "availability": 0.55
          },
          {
            "monthDay": "07-10",
            "availability": 1
          },
          {
            "monthDay": "08-20",
            "availability": 0.75
          },
          {
            "monthDay": "10-01",
            "availability": 0.2
          },
          {
            "monthDay": "11-01",
            "availability": 0
          }
        ],
        "thermalCurveId": "yellow_perch__additional_thermal_research__v0_1",
        "modeName": "Summer harbor schooling",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "MI_CREEL",
          "B_1953bab",
          "B_3176352",
          "B_3588f66",
          "B_3614332",
          "B_36281c5",
          "B_323f6bf",
          "B_3de4822",
          "SECONDARY_MI_ROADMAP",
          "THERMAL_PERCH_USGS"
        ],
        "limitations": [
          "Port-level Pier/Dock effort is not target-specific and cannot validate an individual daily score.",
          "The shared surface-temperature response is a broad secondary modifier, not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "manistee_mi/round_whitefish",
    "cityId": "manistee_mi",
    "speciesId": "round_whitefish",
    "ratingEnabled": false,
    "closedWindows": [],
    "modes": [
      {
        "modeCalibrationId": "manistee_mi__round_whitefish__fall_menominee__v3_secondary_v1",
        "modeId": "fall_menominee",
        "fisheryStrength": 4.1,
        "availabilityKnots": [
          {
            "monthDay": "08-15",
            "availability": 0
          },
          {
            "monthDay": "09-20",
            "availability": 0.35
          },
          {
            "monthDay": "10-25",
            "availability": 0.85
          },
          {
            "monthDay": "11-15",
            "availability": 1
          },
          {
            "monthDay": "12-15",
            "availability": 0.35
          },
          {
            "monthDay": "01-10",
            "availability": 0
          }
        ],
        "thermalCurveId": "round_whitefish__additional_thermal_research__v0_1",
        "modeName": "Fall menominee fishery",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "MI_CREEL",
          "B_3548e2b",
          "B_3de4822",
          "ROUND_DECLINE",
          "SECONDARY_MI_ROADMAP",
          "P2_GLFC1987",
          "P2_ROUND_JUVENILE2023"
        ],
        "limitations": [
          "Port-level Pier/Dock effort is not target-specific and cannot validate an individual daily score.",
          "The shared surface-temperature response is a broad secondary modifier, not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "frankfort_elberta_mi/lake_trout",
    "cityId": "frankfort_elberta_mi",
    "speciesId": "lake_trout",
    "ratingEnabled": false,
    "closedWindows": [],
    "modes": [
      {
        "modeCalibrationId": "frankfort_elberta_mi__lake_trout__cold_season_nearshore__v3_secondary_v1",
        "modeId": "cold_season_nearshore",
        "fisheryStrength": 4,
        "availabilityKnots": [
          {
            "monthDay": "10-15",
            "availability": 0
          },
          {
            "monthDay": "11-15",
            "availability": 0.45
          },
          {
            "monthDay": "01-20",
            "availability": 1
          },
          {
            "monthDay": "03-15",
            "availability": 0.78
          },
          {
            "monthDay": "04-30",
            "availability": 0.28
          },
          {
            "monthDay": "05-31",
            "availability": 0
          }
        ],
        "thermalCurveId": "lake_trout__additional_thermal_research__v0_1",
        "modeName": "Cold-season nearshore access",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "MI_CREEL",
          "B_4160ba5",
          "MI_STOCKING",
          "SECONDARY_MI_ROADMAP",
          "THERMAL_LAKE_TROUT_USGS"
        ],
        "limitations": [
          "Port-level Pier/Dock effort is not target-specific and cannot validate an individual daily score.",
          "The shared surface-temperature response is a broad secondary modifier, not the fish's experienced temperature."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "frankfort_elberta_mi__lake_trout__summer_coldwater_access__v3_secondary_v1",
        "modeId": "summer_coldwater_access",
        "fisheryStrength": 3.8,
        "availabilityKnots": [
          {
            "monthDay": "05-01",
            "availability": 0
          },
          {
            "monthDay": "06-01",
            "availability": 0.45
          },
          {
            "monthDay": "07-10",
            "availability": 1
          },
          {
            "monthDay": "08-20",
            "availability": 0.55
          },
          {
            "monthDay": "09-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "lake_trout__additional_thermal_research__v0_1",
        "modeName": "Summer cold-water access",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "MI_CREEL",
          "B_4160ba5",
          "MI_STOCKING",
          "SECONDARY_MI_ROADMAP",
          "THERMAL_LAKE_TROUT_USGS"
        ],
        "limitations": [
          "Port-level Pier/Dock effort is not target-specific and cannot validate an individual daily score.",
          "The shared surface-temperature response is a broad secondary modifier, not the fish's experienced temperature."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "racine_wi/yellow_perch",
    "cityId": "racine_wi",
    "speciesId": "yellow_perch",
    "ratingEnabled": false,
    "closedWindows": [
      {
        "startMonthDay": "05-01",
        "endMonthDay": "06-15",
        "reasonCode": "species_regulation_closed",
        "evidenceIds": [
          "WI_REGULATIONS_2026_27"
        ]
      }
    ],
    "modes": [
      {
        "modeCalibrationId": "racine_wi__yellow_perch__summer_harbor_schooling__v3_secondary_v1",
        "modeId": "summer_harbor_schooling",
        "fisheryStrength": 4.8,
        "availabilityKnots": [
          {
            "monthDay": "05-15",
            "availability": 0
          },
          {
            "monthDay": "06-16",
            "availability": 0.55
          },
          {
            "monthDay": "07-20",
            "availability": 1
          },
          {
            "monthDay": "08-20",
            "availability": 0.75
          },
          {
            "monthDay": "10-01",
            "availability": 0.2
          },
          {
            "monthDay": "11-01",
            "availability": 0
          }
        ],
        "thermalCurveId": "yellow_perch__additional_thermal_research__v0_1",
        "modeName": "Summer harbor schooling",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "WI_ACCESS_2026",
          "WI_WEEKLY_2024_07_15",
          "WI_WEEKLY_2024_07_29",
          "WI_WEEKLY_2024_08",
          "V3_WI_PERCH_STATUS",
          "WI_SEASON_2024",
          "WI_REGULATIONS_2026_27",
          "THERMAL_PERCH_USGS"
        ],
        "limitations": [
          "Port-level Pier/Dock effort is not target-specific and cannot validate an individual daily score.",
          "The shared surface-temperature response is a broad secondary modifier, not the fish's experienced temperature.",
          "Wisconsin's published month table pools Lake Michigan and Green Bay; only its broad summer shape is used, while city magnitude is capped by Racine-specific shoreline observations."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "kenosha_wi/yellow_perch",
    "cityId": "kenosha_wi",
    "speciesId": "yellow_perch",
    "ratingEnabled": false,
    "closedWindows": [
      {
        "startMonthDay": "05-01",
        "endMonthDay": "06-15",
        "reasonCode": "species_regulation_closed",
        "evidenceIds": [
          "WI_REGULATIONS_2026_27"
        ]
      }
    ],
    "modes": [
      {
        "modeCalibrationId": "kenosha_wi__yellow_perch__summer_harbor_schooling__v3_secondary_v1",
        "modeId": "summer_harbor_schooling",
        "fisheryStrength": 5.4,
        "availabilityKnots": [
          {
            "monthDay": "05-15",
            "availability": 0
          },
          {
            "monthDay": "06-16",
            "availability": 0.55
          },
          {
            "monthDay": "07-20",
            "availability": 1
          },
          {
            "monthDay": "08-20",
            "availability": 0.75
          },
          {
            "monthDay": "10-01",
            "availability": 0.2
          },
          {
            "monthDay": "11-01",
            "availability": 0
          }
        ],
        "thermalCurveId": "yellow_perch__additional_thermal_research__v0_1",
        "modeName": "Summer harbor schooling",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "WI_ACCESS_2026",
          "WI_WEEKLY_2024_07_15",
          "WI_WEEKLY_2024_07_29",
          "WI_WEEKLY_2024_08",
          "V3_WI_PERCH_STATUS",
          "WI_SEASON_2024",
          "WI_REGULATIONS_2026_27",
          "THERMAL_PERCH_USGS"
        ],
        "limitations": [
          "Port-level Pier/Dock effort is not target-specific and cannot validate an individual daily score.",
          "The shared surface-temperature response is a broad secondary modifier, not the fish's experienced temperature.",
          "Wisconsin's published month table pools Lake Michigan and Green Bay; only its broad summer shape is used, while city magnitude is capped by repeated Kenosha pier/harbor observations."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "harbor_beach_mi/coho_salmon",
    "cityId": "harbor_beach_mi",
    "speciesId": "coho_salmon",
    "ratingEnabled": false,
    "publicEnabled": false,
    "promotionEligible": false,
    "closedWindows": [],
    "modes": [
      {
        "modeCalibrationId": "harbor_beach_mi__coho_salmon__spring_coldwater_pier__v3_lake_huron_v1",
        "modeId": "spring_coldwater_pier",
        "fisheryStrength": 5.8,
        "availabilityKnots": [
          {
            "monthDay": "12-15",
            "availability": 0.12
          },
          {
            "monthDay": "02-15",
            "availability": 0.2
          },
          {
            "monthDay": "03-20",
            "availability": 0.62
          },
          {
            "monthDay": "04-20",
            "availability": 1
          },
          {
            "monthDay": "05-20",
            "availability": 0.58
          },
          {
            "monthDay": "06-20",
            "availability": 0
          },
          {
            "monthDay": "10-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "coho_salmon__shared_temperature__v0_2",
        "modeName": "Spring cold-water pier fishery",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "LH_DNR_2022_04_20",
          "LH_DNR_2024_10_09"
        ],
        "limitations": [
          "Spring magnitude is bounded by exact pier/catwalk reports; boat-only lake reports are excluded.",
          "Weekly agency observations establish seasonal opportunity, not catch probability or a promise at every casting position.",
          "LMHOFS surface temperature is a bounded compatibility modifier and may differ from fish-experienced water."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "harbor_beach_mi__coho_salmon__fall_harbor_staging__v3_lake_huron_v1",
        "modeId": "fall_harbor_staging",
        "fisheryStrength": 4.7,
        "availabilityKnots": [
          {
            "monthDay": "06-15",
            "availability": 0
          },
          {
            "monthDay": "08-20",
            "availability": 0.18
          },
          {
            "monthDay": "09-18",
            "availability": 1
          },
          {
            "monthDay": "10-15",
            "availability": 0.55
          },
          {
            "monthDay": "11-15",
            "availability": 0.12
          },
          {
            "monthDay": "12-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "coho_salmon__shared_temperature__v0_2",
        "modeName": "Fall harbor staging",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "LH_DNR_2025_09_24",
          "LH_DNR_2024_10_09"
        ],
        "limitations": [
          "Fall staging is episodic and the city-harbor curve does not imply river-only or offshore availability.",
          "Weekly agency observations establish seasonal opportunity, not catch probability or a promise at every casting position.",
          "LMHOFS surface temperature is a bounded compatibility modifier and may differ from fish-experienced water."
        ],
        "promotionEligible": false
      }
    ]
  },
  {
    "pairKey": "harbor_beach_mi/smallmouth_bass",
    "cityId": "harbor_beach_mi",
    "speciesId": "smallmouth_bass",
    "ratingEnabled": false,
    "publicEnabled": false,
    "promotionEligible": false,
    "closedWindows": [],
    "modes": [
      {
        "modeCalibrationId": "harbor_beach_mi__smallmouth_bass__warm_season_breakwall__v3_lake_huron_v1",
        "modeId": "warm_season_breakwall",
        "fisheryStrength": 4.9,
        "availabilityKnots": [
          {
            "monthDay": "03-15",
            "availability": 0
          },
          {
            "monthDay": "05-01",
            "availability": 0.32
          },
          {
            "monthDay": "06-15",
            "availability": 0.78
          },
          {
            "monthDay": "07-20",
            "availability": 1
          },
          {
            "monthDay": "09-10",
            "availability": 0.7
          },
          {
            "monthDay": "10-20",
            "availability": 0.2
          },
          {
            "monthDay": "11-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "smallmouth_bass__additional_thermal_research__v0_1",
        "modeName": "Warm-season breakwall fishery",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "LH_DNR_2025_09_24"
        ],
        "limitations": [
          "Warm-season opportunity is confined to the public city-harbor boundary and does not transfer from inland or boat fisheries.",
          "Weekly agency observations establish seasonal opportunity, not catch probability or a promise at every casting position.",
          "LMHOFS surface temperature is a bounded compatibility modifier and may differ from fish-experienced water."
        ],
        "promotionEligible": false
      }
    ]
  },
  {
    "pairKey": "oscoda_mi/atlantic_salmon",
    "cityId": "oscoda_mi",
    "speciesId": "atlantic_salmon",
    "ratingEnabled": false,
    "publicEnabled": false,
    "promotionEligible": false,
    "closedWindows": [],
    "modes": [
      {
        "modeCalibrationId": "oscoda_mi__atlantic_salmon__spring_coldwater_pier__v3_lake_huron_v1",
        "modeId": "spring_coldwater_pier",
        "fisheryStrength": 8.4,
        "availabilityKnots": [
          {
            "monthDay": "12-15",
            "availability": 0.12
          },
          {
            "monthDay": "02-15",
            "availability": 0.2
          },
          {
            "monthDay": "03-20",
            "availability": 0.62
          },
          {
            "monthDay": "04-20",
            "availability": 1
          },
          {
            "monthDay": "05-20",
            "availability": 0.58
          },
          {
            "monthDay": "06-20",
            "availability": 0
          },
          {
            "monthDay": "10-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "atlantic_salmon__shared_temperature__v0_1",
        "modeName": "Spring cold-water pier fishery",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "LH_DNR_2024_04_17",
          "LH_DNR_2024_04_24",
          "LH_DNR_2024_05_01",
          "LH_DNR_2025_04_16",
          "LH_DNR_2026_05_13"
        ],
        "limitations": [
          "Spring magnitude is bounded by exact pier/catwalk reports; boat-only lake reports are excluded.",
          "Weekly agency observations establish seasonal opportunity, not catch probability or a promise at every casting position.",
          "LMHOFS surface temperature is a bounded compatibility modifier and may differ from fish-experienced water."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "oscoda_mi__atlantic_salmon__fall_harbor_staging__v3_lake_huron_v1",
        "modeId": "fall_harbor_staging",
        "fisheryStrength": 5.9,
        "availabilityKnots": [
          {
            "monthDay": "06-15",
            "availability": 0
          },
          {
            "monthDay": "08-20",
            "availability": 0.18
          },
          {
            "monthDay": "09-18",
            "availability": 1
          },
          {
            "monthDay": "10-15",
            "availability": 0.55
          },
          {
            "monthDay": "11-15",
            "availability": 0.12
          },
          {
            "monthDay": "12-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "atlantic_salmon__shared_temperature__v0_1",
        "modeName": "Fall harbor staging",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "LH_DNR_2025_09_24",
          "LH_DNR_2025_11_05"
        ],
        "limitations": [
          "Fall staging is episodic and the city-harbor curve does not imply river-only or offshore availability.",
          "Weekly agency observations establish seasonal opportunity, not catch probability or a promise at every casting position.",
          "LMHOFS surface temperature is a bounded compatibility modifier and may differ from fish-experienced water."
        ],
        "promotionEligible": false
      }
    ]
  },
  {
    "pairKey": "oscoda_mi/steelhead",
    "cityId": "oscoda_mi",
    "speciesId": "steelhead",
    "ratingEnabled": false,
    "publicEnabled": false,
    "promotionEligible": false,
    "closedWindows": [],
    "modes": [
      {
        "modeCalibrationId": "oscoda_mi__steelhead__spring_coldwater_pier__v3_lake_huron_v1",
        "modeId": "spring_coldwater_pier",
        "fisheryStrength": 7.4,
        "availabilityKnots": [
          {
            "monthDay": "12-15",
            "availability": 0.12
          },
          {
            "monthDay": "02-15",
            "availability": 0.2
          },
          {
            "monthDay": "03-20",
            "availability": 0.62
          },
          {
            "monthDay": "04-20",
            "availability": 1
          },
          {
            "monthDay": "05-20",
            "availability": 0.58
          },
          {
            "monthDay": "06-20",
            "availability": 0
          },
          {
            "monthDay": "10-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "steelhead__shared_temperature__v0_2",
        "modeName": "Spring cold-water pier fishery",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "LH_DNR_2024_04_17",
          "LH_DNR_2024_04_24",
          "LH_DNR_2025_04_02",
          "LH_DNR_2026_05_13"
        ],
        "limitations": [
          "Spring magnitude is bounded by exact pier/catwalk reports; boat-only lake reports are excluded.",
          "Weekly agency observations establish seasonal opportunity, not catch probability or a promise at every casting position.",
          "LMHOFS surface temperature is a bounded compatibility modifier and may differ from fish-experienced water."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "oscoda_mi__steelhead__fall_harbor_staging__v3_lake_huron_v1",
        "modeId": "fall_harbor_staging",
        "fisheryStrength": 5.3,
        "availabilityKnots": [
          {
            "monthDay": "06-15",
            "availability": 0
          },
          {
            "monthDay": "08-20",
            "availability": 0.18
          },
          {
            "monthDay": "09-18",
            "availability": 1
          },
          {
            "monthDay": "10-15",
            "availability": 0.55
          },
          {
            "monthDay": "11-15",
            "availability": 0.12
          },
          {
            "monthDay": "12-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "steelhead__shared_temperature__v0_2",
        "modeName": "Fall harbor staging",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "LH_DNR_2025_11_05"
        ],
        "limitations": [
          "Fall staging is episodic and the city-harbor curve does not imply river-only or offshore availability.",
          "Weekly agency observations establish seasonal opportunity, not catch probability or a promise at every casting position.",
          "LMHOFS surface temperature is a bounded compatibility modifier and may differ from fish-experienced water."
        ],
        "promotionEligible": false
      }
    ]
  },
  {
    "pairKey": "oscoda_mi/walleye",
    "cityId": "oscoda_mi",
    "speciesId": "walleye",
    "ratingEnabled": false,
    "publicEnabled": false,
    "promotionEligible": false,
    "closedWindows": [],
    "modes": [
      {
        "modeCalibrationId": "oscoda_mi__walleye__spring_low_light__v3_lake_huron_v1",
        "modeId": "spring_low_light",
        "fisheryStrength": 6.8,
        "availabilityKnots": [
          {
            "monthDay": "02-15",
            "availability": 0
          },
          {
            "monthDay": "03-25",
            "availability": 0.45
          },
          {
            "monthDay": "05-01",
            "availability": 1
          },
          {
            "monthDay": "06-15",
            "availability": 0.4
          },
          {
            "monthDay": "07-10",
            "availability": 0
          }
        ],
        "thermalCurveId": "walleye__additional_thermal_research__v0_1",
        "modeName": "Spring low-light pier fishery",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "LH_DNR_2024_04_17",
          "LH_DNR_2024_05_01",
          "LH_DNR_2024_05_08",
          "LH_DNR_2025_04_16",
          "LH_DNR_2026_05_13"
        ],
        "limitations": [
          "Reports establish repeated spring pier catches; time-of-day precision is not inferred.",
          "Weekly agency observations establish seasonal opportunity, not catch probability or a promise at every casting position.",
          "LMHOFS surface temperature is a bounded compatibility modifier and may differ from fish-experienced water."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "oscoda_mi__walleye__fall_low_light__v3_lake_huron_v1",
        "modeId": "fall_low_light",
        "fisheryStrength": 4.8,
        "availabilityKnots": [
          {
            "monthDay": "07-20",
            "availability": 0
          },
          {
            "monthDay": "08-25",
            "availability": 0.35
          },
          {
            "monthDay": "09-20",
            "availability": 1
          },
          {
            "monthDay": "10-25",
            "availability": 0.4
          },
          {
            "monthDay": "11-20",
            "availability": 0
          }
        ],
        "thermalCurveId": "walleye__additional_thermal_research__v0_1",
        "modeName": "Fall low-light pier fishery",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "LH_DNR_2025_09_17"
        ],
        "limitations": [
          "Fall evidence is thinner than spring evidence, so this mode has a lower ceiling.",
          "Weekly agency observations establish seasonal opportunity, not catch probability or a promise at every casting position.",
          "LMHOFS surface temperature is a bounded compatibility modifier and may differ from fish-experienced water."
        ],
        "promotionEligible": false
      }
    ]
  },
  {
    "pairKey": "oscoda_mi/lake_trout",
    "cityId": "oscoda_mi",
    "speciesId": "lake_trout",
    "ratingEnabled": false,
    "publicEnabled": false,
    "promotionEligible": false,
    "closedWindows": [],
    "modes": [
      {
        "modeCalibrationId": "oscoda_mi__lake_trout__spring_coldwater_pier__v3_lake_huron_v1",
        "modeId": "spring_coldwater_pier",
        "fisheryStrength": 4.6,
        "availabilityKnots": [
          {
            "monthDay": "12-15",
            "availability": 0.12
          },
          {
            "monthDay": "02-15",
            "availability": 0.2
          },
          {
            "monthDay": "03-20",
            "availability": 0.62
          },
          {
            "monthDay": "04-20",
            "availability": 1
          },
          {
            "monthDay": "05-20",
            "availability": 0.58
          },
          {
            "monthDay": "06-20",
            "availability": 0
          },
          {
            "monthDay": "10-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "lake_trout__additional_thermal_research__v0_1",
        "modeName": "Spring cold-water pier fishery",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "LH_DNR_2024_04_17",
          "LH_DNR_2024_04_24"
        ],
        "limitations": [
          "Spring magnitude is bounded by exact pier/catwalk reports; boat-only lake reports are excluded.",
          "Weekly agency observations establish seasonal opportunity, not catch probability or a promise at every casting position.",
          "LMHOFS surface temperature is a bounded compatibility modifier and may differ from fish-experienced water."
        ],
        "promotionEligible": false
      }
    ]
  },
  {
    "pairKey": "oscoda_mi/coho_salmon",
    "cityId": "oscoda_mi",
    "speciesId": "coho_salmon",
    "ratingEnabled": false,
    "publicEnabled": false,
    "promotionEligible": false,
    "closedWindows": [],
    "modes": [
      {
        "modeCalibrationId": "oscoda_mi__coho_salmon__spring_coldwater_pier__v3_lake_huron_v1",
        "modeId": "spring_coldwater_pier",
        "fisheryStrength": 4.4,
        "availabilityKnots": [
          {
            "monthDay": "12-15",
            "availability": 0.12
          },
          {
            "monthDay": "02-15",
            "availability": 0.2
          },
          {
            "monthDay": "03-20",
            "availability": 0.62
          },
          {
            "monthDay": "04-20",
            "availability": 1
          },
          {
            "monthDay": "05-20",
            "availability": 0.58
          },
          {
            "monthDay": "06-20",
            "availability": 0
          },
          {
            "monthDay": "10-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "coho_salmon__shared_temperature__v0_2",
        "modeName": "Spring cold-water pier fishery",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "LH_DNR_2025_04_02"
        ],
        "limitations": [
          "Spring magnitude is bounded by exact pier/catwalk reports; boat-only lake reports are excluded.",
          "Weekly agency observations establish seasonal opportunity, not catch probability or a promise at every casting position.",
          "LMHOFS surface temperature is a bounded compatibility modifier and may differ from fish-experienced water."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "oscoda_mi__coho_salmon__fall_harbor_staging__v3_lake_huron_v1",
        "modeId": "fall_harbor_staging",
        "fisheryStrength": 6.5,
        "availabilityKnots": [
          {
            "monthDay": "06-15",
            "availability": 0
          },
          {
            "monthDay": "08-20",
            "availability": 0.18
          },
          {
            "monthDay": "09-18",
            "availability": 1
          },
          {
            "monthDay": "10-15",
            "availability": 0.55
          },
          {
            "monthDay": "11-15",
            "availability": 0.12
          },
          {
            "monthDay": "12-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "coho_salmon__shared_temperature__v0_2",
        "modeName": "Fall harbor staging",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "LH_DNR_2025_09_17",
          "LH_DNR_2025_09_24",
          "LH_DNR_2025_11_05"
        ],
        "limitations": [
          "Fall staging is episodic and the city-harbor curve does not imply river-only or offshore availability.",
          "Weekly agency observations establish seasonal opportunity, not catch probability or a promise at every casting position.",
          "LMHOFS surface temperature is a bounded compatibility modifier and may differ from fish-experienced water."
        ],
        "promotionEligible": false
      }
    ]
  },
  {
    "pairKey": "oscoda_mi/chinook_salmon",
    "cityId": "oscoda_mi",
    "speciesId": "chinook_salmon",
    "ratingEnabled": false,
    "publicEnabled": false,
    "promotionEligible": false,
    "closedWindows": [],
    "modes": [
      {
        "modeCalibrationId": "oscoda_mi__chinook_salmon__fall_harbor_staging__v3_lake_huron_v1",
        "modeId": "fall_harbor_staging",
        "fisheryStrength": 5.5,
        "availabilityKnots": [
          {
            "monthDay": "06-15",
            "availability": 0
          },
          {
            "monthDay": "08-20",
            "availability": 0.18
          },
          {
            "monthDay": "09-18",
            "availability": 1
          },
          {
            "monthDay": "10-15",
            "availability": 0.55
          },
          {
            "monthDay": "11-15",
            "availability": 0.12
          },
          {
            "monthDay": "12-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "chinook_salmon__shared_temperature__v0_2",
        "modeName": "Fall harbor staging",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "LH_DNR_2025_09_24"
        ],
        "limitations": [
          "Fall staging is episodic and the city-harbor curve does not imply river-only or offshore availability.",
          "Weekly agency observations establish seasonal opportunity, not catch probability or a promise at every casting position.",
          "LMHOFS surface temperature is a bounded compatibility modifier and may differ from fish-experienced water."
        ],
        "promotionEligible": false
      }
    ]
  },
  {
    "pairKey": "oscoda_mi/smallmouth_bass",
    "cityId": "oscoda_mi",
    "speciesId": "smallmouth_bass",
    "ratingEnabled": false,
    "publicEnabled": false,
    "promotionEligible": false,
    "closedWindows": [],
    "modes": [
      {
        "modeCalibrationId": "oscoda_mi__smallmouth_bass__warm_season_pier__v3_lake_huron_v1",
        "modeId": "warm_season_pier",
        "fisheryStrength": 4.5,
        "availabilityKnots": [
          {
            "monthDay": "03-15",
            "availability": 0
          },
          {
            "monthDay": "05-01",
            "availability": 0.32
          },
          {
            "monthDay": "06-15",
            "availability": 0.78
          },
          {
            "monthDay": "07-20",
            "availability": 1
          },
          {
            "monthDay": "09-10",
            "availability": 0.7
          },
          {
            "monthDay": "10-20",
            "availability": 0.2
          },
          {
            "monthDay": "11-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "smallmouth_bass__additional_thermal_research__v0_1",
        "modeName": "Warm-season pier fishery",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "LH_DNR_2018_09_06",
          "LH_DNR_2025_11_05"
        ],
        "limitations": [
          "Warm-season opportunity is confined to the public city-harbor boundary and does not transfer from inland or boat fisheries.",
          "Weekly agency observations establish seasonal opportunity, not catch probability or a promise at every casting position.",
          "LMHOFS surface temperature is a bounded compatibility modifier and may differ from fish-experienced water."
        ],
        "promotionEligible": false
      }
    ]
  },
  {
    "pairKey": "oscoda_mi/channel_catfish",
    "cityId": "oscoda_mi",
    "speciesId": "channel_catfish",
    "ratingEnabled": false,
    "publicEnabled": false,
    "promotionEligible": false,
    "closedWindows": [],
    "modes": [
      {
        "modeCalibrationId": "oscoda_mi__channel_catfish__warm_season_bottom_fishery__v3_lake_huron_v1",
        "modeId": "warm_season_bottom_fishery",
        "fisheryStrength": 4.2,
        "availabilityKnots": [
          {
            "monthDay": "03-15",
            "availability": 0
          },
          {
            "monthDay": "05-01",
            "availability": 0.32
          },
          {
            "monthDay": "06-15",
            "availability": 0.78
          },
          {
            "monthDay": "07-20",
            "availability": 1
          },
          {
            "monthDay": "09-10",
            "availability": 0.7
          },
          {
            "monthDay": "10-20",
            "availability": 0.2
          },
          {
            "monthDay": "11-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "channel_catfish__additional_thermal_research__v0_1",
        "modeName": "Warm-season bottom fishery",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "LH_DNR_2018_09_06",
          "LH_DNR_2024_04_24",
          "LH_DNR_2025_11_05"
        ],
        "limitations": [
          "Warm-season opportunity is confined to the public city-harbor boundary and does not transfer from inland or boat fisheries.",
          "Weekly agency observations establish seasonal opportunity, not catch probability or a promise at every casting position.",
          "LMHOFS surface temperature is a bounded compatibility modifier and may differ from fish-experienced water."
        ],
        "promotionEligible": false
      }
    ]
  },
  {
    "pairKey": "oscoda_mi/freshwater_drum",
    "cityId": "oscoda_mi",
    "speciesId": "freshwater_drum",
    "ratingEnabled": false,
    "publicEnabled": false,
    "promotionEligible": false,
    "closedWindows": [],
    "modes": [
      {
        "modeCalibrationId": "oscoda_mi__freshwater_drum__warm_season_bottom_fishery__v3_lake_huron_v1",
        "modeId": "warm_season_bottom_fishery",
        "fisheryStrength": 3.9,
        "availabilityKnots": [
          {
            "monthDay": "03-15",
            "availability": 0
          },
          {
            "monthDay": "05-01",
            "availability": 0.32
          },
          {
            "monthDay": "06-15",
            "availability": 0.78
          },
          {
            "monthDay": "07-20",
            "availability": 1
          },
          {
            "monthDay": "09-10",
            "availability": 0.7
          },
          {
            "monthDay": "10-20",
            "availability": 0.2
          },
          {
            "monthDay": "11-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "freshwater_drum__additional_thermal_research__v0_1",
        "modeName": "Warm-season bottom fishery",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "LH_DNR_2018_09_06",
          "LH_DNR_2024_04_24"
        ],
        "limitations": [
          "Warm-season opportunity is confined to the public city-harbor boundary and does not transfer from inland or boat fisheries.",
          "Weekly agency observations establish seasonal opportunity, not catch probability or a promise at every casting position.",
          "LMHOFS surface temperature is a bounded compatibility modifier and may differ from fish-experienced water."
        ],
        "promotionEligible": false
      }
    ]
  },
  {
    "pairKey": "port_sanilac_mi/coho_salmon",
    "cityId": "port_sanilac_mi",
    "speciesId": "coho_salmon",
    "ratingEnabled": false,
    "publicEnabled": false,
    "promotionEligible": false,
    "closedWindows": [],
    "modes": [
      {
        "modeCalibrationId": "port_sanilac_mi__coho_salmon__spring_coldwater_pier__v3_lake_huron_v1",
        "modeId": "spring_coldwater_pier",
        "fisheryStrength": 6.4,
        "availabilityKnots": [
          {
            "monthDay": "12-15",
            "availability": 0.12
          },
          {
            "monthDay": "02-15",
            "availability": 0.2
          },
          {
            "monthDay": "03-20",
            "availability": 0.62
          },
          {
            "monthDay": "04-20",
            "availability": 1
          },
          {
            "monthDay": "05-20",
            "availability": 0.58
          },
          {
            "monthDay": "06-20",
            "availability": 0
          },
          {
            "monthDay": "10-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "coho_salmon__shared_temperature__v0_2",
        "modeName": "Spring cold-water pier fishery",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "LH_DNR_2022_04_20"
        ],
        "limitations": [
          "Spring magnitude is bounded by exact pier/catwalk reports; boat-only lake reports are excluded.",
          "Weekly agency observations establish seasonal opportunity, not catch probability or a promise at every casting position.",
          "LMHOFS surface temperature is a bounded compatibility modifier and may differ from fish-experienced water."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "port_sanilac_mi__coho_salmon__fall_harbor_staging__v3_lake_huron_v1",
        "modeId": "fall_harbor_staging",
        "fisheryStrength": 5.8,
        "availabilityKnots": [
          {
            "monthDay": "06-15",
            "availability": 0
          },
          {
            "monthDay": "08-20",
            "availability": 0.18
          },
          {
            "monthDay": "09-18",
            "availability": 1
          },
          {
            "monthDay": "10-15",
            "availability": 0.55
          },
          {
            "monthDay": "11-15",
            "availability": 0.12
          },
          {
            "monthDay": "12-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "coho_salmon__shared_temperature__v0_2",
        "modeName": "Fall harbor staging",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "LH_DNR_2024_10_09",
          "LH_DNR_2025_09_10",
          "LH_DNR_2025_09_24"
        ],
        "limitations": [
          "Fall staging is episodic and the city-harbor curve does not imply river-only or offshore availability.",
          "Weekly agency observations establish seasonal opportunity, not catch probability or a promise at every casting position.",
          "LMHOFS surface temperature is a bounded compatibility modifier and may differ from fish-experienced water."
        ],
        "promotionEligible": false
      }
    ]
  },
  {
    "pairKey": "port_sanilac_mi/steelhead",
    "cityId": "port_sanilac_mi",
    "speciesId": "steelhead",
    "ratingEnabled": false,
    "publicEnabled": false,
    "promotionEligible": false,
    "closedWindows": [],
    "modes": [
      {
        "modeCalibrationId": "port_sanilac_mi__steelhead__spring_coldwater_pier__v3_lake_huron_v1",
        "modeId": "spring_coldwater_pier",
        "fisheryStrength": 4.5,
        "availabilityKnots": [
          {
            "monthDay": "12-15",
            "availability": 0.12
          },
          {
            "monthDay": "02-15",
            "availability": 0.2
          },
          {
            "monthDay": "03-20",
            "availability": 0.62
          },
          {
            "monthDay": "04-20",
            "availability": 1
          },
          {
            "monthDay": "05-20",
            "availability": 0.58
          },
          {
            "monthDay": "06-20",
            "availability": 0
          },
          {
            "monthDay": "10-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "steelhead__shared_temperature__v0_2",
        "modeName": "Spring cold-water pier fishery",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "LH_DNR_2022_04_20",
          "LH_DNR_2024_05_08"
        ],
        "limitations": [
          "Spring magnitude is bounded by exact pier/catwalk reports; boat-only lake reports are excluded.",
          "Weekly agency observations establish seasonal opportunity, not catch probability or a promise at every casting position.",
          "LMHOFS surface temperature is a bounded compatibility modifier and may differ from fish-experienced water."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "port_sanilac_mi__steelhead__fall_harbor_staging__v3_lake_huron_v1",
        "modeId": "fall_harbor_staging",
        "fisheryStrength": 4.3,
        "availabilityKnots": [
          {
            "monthDay": "06-15",
            "availability": 0
          },
          {
            "monthDay": "08-20",
            "availability": 0.18
          },
          {
            "monthDay": "09-18",
            "availability": 1
          },
          {
            "monthDay": "10-15",
            "availability": 0.55
          },
          {
            "monthDay": "11-15",
            "availability": 0.12
          },
          {
            "monthDay": "12-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "steelhead__shared_temperature__v0_2",
        "modeName": "Fall harbor staging",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "LH_DNR_2025_09_24"
        ],
        "limitations": [
          "Fall staging is episodic and the city-harbor curve does not imply river-only or offshore availability.",
          "Weekly agency observations establish seasonal opportunity, not catch probability or a promise at every casting position.",
          "LMHOFS surface temperature is a bounded compatibility modifier and may differ from fish-experienced water."
        ],
        "promotionEligible": false
      }
    ]
  },
  {
    "pairKey": "port_sanilac_mi/northern_pike",
    "cityId": "port_sanilac_mi",
    "speciesId": "northern_pike",
    "ratingEnabled": false,
    "publicEnabled": false,
    "promotionEligible": false,
    "closedWindows": [],
    "modes": [
      {
        "modeCalibrationId": "port_sanilac_mi__northern_pike__warm_season_breakwall__v3_lake_huron_v1",
        "modeId": "warm_season_breakwall",
        "fisheryStrength": 5.1,
        "availabilityKnots": [
          {
            "monthDay": "03-15",
            "availability": 0
          },
          {
            "monthDay": "05-01",
            "availability": 0.32
          },
          {
            "monthDay": "06-15",
            "availability": 0.78
          },
          {
            "monthDay": "07-20",
            "availability": 1
          },
          {
            "monthDay": "09-10",
            "availability": 0.7
          },
          {
            "monthDay": "10-20",
            "availability": 0.2
          },
          {
            "monthDay": "11-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "northern_pike__shared_temperature__v0_1",
        "modeName": "Warm-season breakwall fishery",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "LH_DNR_2024_05_08",
          "LH_DNR_2025_09_24"
        ],
        "limitations": [
          "Warm-season opportunity is confined to the public city-harbor boundary and does not transfer from inland or boat fisheries.",
          "Weekly agency observations establish seasonal opportunity, not catch probability or a promise at every casting position.",
          "LMHOFS surface temperature is a bounded compatibility modifier and may differ from fish-experienced water."
        ],
        "promotionEligible": false
      }
    ]
  },
  {
    "pairKey": "harbor_beach_mi/atlantic_salmon",
    "cityId": "harbor_beach_mi",
    "speciesId": "atlantic_salmon",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "harbor_beach_mi__atlantic_salmon__spring_coldwater_pier__v3_species_expansion_v1",
        "modeId": "spring_coldwater_pier",
        "fisheryStrength": 5.2,
        "availabilityKnots": [
          {
            "monthDay": "02-15",
            "availability": 0
          },
          {
            "monthDay": "03-20",
            "availability": 0.25
          },
          {
            "monthDay": "04-25",
            "availability": 1
          },
          {
            "monthDay": "05-25",
            "availability": 0.6
          },
          {
            "monthDay": "06-25",
            "availability": 0
          }
        ],
        "thermalCurveId": "atlantic_salmon__shared_temperature__v0_1",
        "modeName": "Spring cold-water harbor opportunity",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "EXP_MI_LH_ROADMAP"
        ],
        "limitations": [
          "FisheryStrength is an ordinal calibration ceiling, not catch probability, fish abundance or a government rating.",
          "Weekly reports establish occurrence and timing but not standardized target effort.",
          "Surface temperature is a bounded compatibility modifier and may not equal fish-experienced temperature.",
          "All modes remain private and promotion-blocked until Pass 2 implementation tests and owner review are complete."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "harbor_beach_mi__atlantic_salmon__fall_harbor_return__v3_species_expansion_v1",
        "modeId": "fall_harbor_return",
        "fisheryStrength": 4.8,
        "availabilityKnots": [
          {
            "monthDay": "07-15",
            "availability": 0
          },
          {
            "monthDay": "08-25",
            "availability": 0.2
          },
          {
            "monthDay": "09-25",
            "availability": 1
          },
          {
            "monthDay": "10-20",
            "availability": 0.6
          },
          {
            "monthDay": "11-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "atlantic_salmon__shared_temperature__v0_1",
        "modeName": "Fall harbor return",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "EXP_MI_LH_ROADMAP"
        ],
        "limitations": [
          "FisheryStrength is an ordinal calibration ceiling, not catch probability, fish abundance or a government rating.",
          "Weekly reports establish occurrence and timing but not standardized target effort.",
          "Surface temperature is a bounded compatibility modifier and may not equal fish-experienced temperature.",
          "All modes remain private and promotion-blocked until Pass 2 implementation tests and owner review are complete."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "harbor_beach_mi/steelhead",
    "cityId": "harbor_beach_mi",
    "speciesId": "steelhead",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "harbor_beach_mi__steelhead__coolwater_port_opportunity__v3_species_expansion_v1",
        "modeId": "coolwater_port_opportunity",
        "fisheryStrength": 5.6,
        "availabilityKnots": [
          {
            "monthDay": "02-15",
            "availability": 0
          },
          {
            "monthDay": "03-20",
            "availability": 0.2
          },
          {
            "monthDay": "04-25",
            "availability": 1
          },
          {
            "monthDay": "06-30",
            "availability": 0.55
          },
          {
            "monthDay": "08-15",
            "availability": 0.4
          },
          {
            "monthDay": "10-01",
            "availability": 0.85
          },
          {
            "monthDay": "11-15",
            "availability": 0.1
          },
          {
            "monthDay": "12-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "steelhead__shared_temperature__v0_2",
        "modeName": "Spring-through-fall cool-water port opportunity",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "EXP_MI_LH_ROADMAP",
          "EXP_HB_SHALLOW_2022",
          "EXP_HB_STEELHEAD_2014"
        ],
        "limitations": [
          "FisheryStrength is an ordinal calibration ceiling, not catch probability, fish abundance or a government rating.",
          "Weekly reports establish occurrence and timing but not standardized target effort.",
          "Surface temperature is a bounded compatibility modifier and may not equal fish-experienced temperature.",
          "All modes remain private and promotion-blocked until Pass 2 implementation tests and owner review are complete."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "harbor_beach_mi/lake_trout",
    "cityId": "harbor_beach_mi",
    "speciesId": "lake_trout",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "harbor_beach_mi__lake_trout__reachable_coldwater_port__v3_species_expansion_v1",
        "modeId": "reachable_coldwater_port",
        "fisheryStrength": 5.3,
        "availabilityKnots": [
          {
            "monthDay": "01-15",
            "availability": 0
          },
          {
            "monthDay": "03-01",
            "availability": 0.2
          },
          {
            "monthDay": "05-01",
            "availability": 1
          },
          {
            "monthDay": "07-15",
            "availability": 0.25
          },
          {
            "monthDay": "09-15",
            "availability": 0.55
          },
          {
            "monthDay": "10-25",
            "availability": 0.8
          },
          {
            "monthDay": "12-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "lake_trout__additional_thermal_research__v0_1",
        "modeName": "Reachable cold-water port fishery",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "EXP_MI_LH_ROADMAP",
          "EXP_HB_SHALLOW_2022"
        ],
        "limitations": [
          "FisheryStrength is an ordinal calibration ceiling, not catch probability, fish abundance or a government rating.",
          "Weekly reports establish occurrence and timing but not standardized target effort.",
          "Surface temperature is a bounded compatibility modifier and may not equal fish-experienced temperature.",
          "All modes remain private and promotion-blocked until Pass 2 implementation tests and owner review are complete."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "harbor_beach_mi/walleye",
    "cityId": "harbor_beach_mi",
    "speciesId": "walleye",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "harbor_beach_mi__walleye__warm_season_low_light_breakwall__v3_species_expansion_v1",
        "modeId": "warm_season_low_light_breakwall",
        "fisheryStrength": 6,
        "availabilityKnots": [
          {
            "monthDay": "03-15",
            "availability": 0
          },
          {
            "monthDay": "04-20",
            "availability": 0.25
          },
          {
            "monthDay": "06-01",
            "availability": 0.55
          },
          {
            "monthDay": "07-20",
            "availability": 0.75
          },
          {
            "monthDay": "09-15",
            "availability": 0.9
          },
          {
            "monthDay": "10-15",
            "availability": 1
          },
          {
            "monthDay": "11-15",
            "availability": 0.1
          },
          {
            "monthDay": "12-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "walleye__additional_thermal_research__v0_1",
        "modeName": "Warm-season low-light breakwall fishery",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "EXP_MI_LH_ROADMAP",
          "EXP_HB_WALLEYE_2018",
          "EXP_HB_WALLEYE_2021"
        ],
        "limitations": [
          "FisheryStrength is an ordinal calibration ceiling, not catch probability, fish abundance or a government rating.",
          "Weekly reports establish occurrence and timing but not standardized target effort.",
          "Surface temperature is a bounded compatibility modifier and may not equal fish-experienced temperature.",
          "All modes remain private and promotion-blocked until Pass 2 implementation tests and owner review are complete."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "harbor_beach_mi/northern_pike",
    "cityId": "harbor_beach_mi",
    "speciesId": "northern_pike",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "harbor_beach_mi__northern_pike__warm_season_harbor__v3_species_expansion_v1",
        "modeId": "warm_season_harbor",
        "fisheryStrength": 4.6,
        "availabilityKnots": [
          {
            "monthDay": "04-01",
            "availability": 0
          },
          {
            "monthDay": "05-15",
            "availability": 0.35
          },
          {
            "monthDay": "07-15",
            "availability": 0.75
          },
          {
            "monthDay": "09-15",
            "availability": 1
          },
          {
            "monthDay": "10-31",
            "availability": 0.2
          },
          {
            "monthDay": "11-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "northern_pike__shared_temperature__v0_1",
        "modeName": "Warm-season harbor casting",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "EXP_HB_2025_09_17"
        ],
        "limitations": [
          "FisheryStrength is an ordinal calibration ceiling, not catch probability, fish abundance or a government rating.",
          "Weekly reports establish occurrence and timing but not standardized target effort.",
          "Surface temperature is a bounded compatibility modifier and may not equal fish-experienced temperature.",
          "All modes remain private and promotion-blocked until Pass 2 implementation tests and owner review are complete."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "oscoda_mi/northern_pike",
    "cityId": "oscoda_mi",
    "speciesId": "northern_pike",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "oscoda_mi__northern_pike__spring_river_mouth__v3_species_expansion_v1",
        "modeId": "spring_river_mouth",
        "fisheryStrength": 5,
        "availabilityKnots": [
          {
            "monthDay": "02-15",
            "availability": 0
          },
          {
            "monthDay": "03-20",
            "availability": 0.25
          },
          {
            "monthDay": "04-25",
            "availability": 1
          },
          {
            "monthDay": "05-25",
            "availability": 0.7
          },
          {
            "monthDay": "06-30",
            "availability": 0
          }
        ],
        "thermalCurveId": "northern_pike__shared_temperature__v0_1",
        "modeName": "Spring river-mouth opportunity",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "EXP_MI_LH_ROADMAP"
        ],
        "limitations": [
          "FisheryStrength is an ordinal calibration ceiling, not catch probability, fish abundance or a government rating.",
          "Weekly reports establish occurrence and timing but not standardized target effort.",
          "Surface temperature is a bounded compatibility modifier and may not equal fish-experienced temperature.",
          "All modes remain private and promotion-blocked until Pass 2 implementation tests and owner review are complete."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "oscoda_mi__northern_pike__fall_lower_river_mouth__v3_species_expansion_v1",
        "modeId": "fall_lower_river_mouth",
        "fisheryStrength": 4.2,
        "availabilityKnots": [
          {
            "monthDay": "07-15",
            "availability": 0
          },
          {
            "monthDay": "08-20",
            "availability": 0.25
          },
          {
            "monthDay": "09-25",
            "availability": 1
          },
          {
            "monthDay": "10-31",
            "availability": 0.35
          },
          {
            "monthDay": "11-20",
            "availability": 0
          }
        ],
        "thermalCurveId": "northern_pike__shared_temperature__v0_1",
        "modeName": "Fall lower-river and mouth opportunity",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "EXP_OSC_2022_09_28"
        ],
        "limitations": [
          "FisheryStrength is an ordinal calibration ceiling, not catch probability, fish abundance or a government rating.",
          "Weekly reports establish occurrence and timing but not standardized target effort.",
          "Surface temperature is a bounded compatibility modifier and may not equal fish-experienced temperature.",
          "All modes remain private and promotion-blocked until Pass 2 implementation tests and owner review are complete."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "port_sanilac_mi/atlantic_salmon",
    "cityId": "port_sanilac_mi",
    "speciesId": "atlantic_salmon",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "port_sanilac_mi__atlantic_salmon__spring_breakwall__v3_species_expansion_v1",
        "modeId": "spring_breakwall",
        "fisheryStrength": 6.3,
        "availabilityKnots": [
          {
            "monthDay": "02-15",
            "availability": 0
          },
          {
            "monthDay": "03-20",
            "availability": 0.3
          },
          {
            "monthDay": "04-25",
            "availability": 0.9
          },
          {
            "monthDay": "05-20",
            "availability": 1
          },
          {
            "monthDay": "06-20",
            "availability": 0.35
          },
          {
            "monthDay": "07-10",
            "availability": 0
          }
        ],
        "thermalCurveId": "atlantic_salmon__shared_temperature__v0_1",
        "modeName": "Spring breakwall fishery",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "EXP_MI_LH_ROADMAP",
          "EXP_PS_2022_05_11",
          "EXP_PS_2019_06_13",
          "EXP_PS_2024_05_29"
        ],
        "limitations": [
          "FisheryStrength is an ordinal calibration ceiling, not catch probability, fish abundance or a government rating.",
          "Weekly reports establish occurrence and timing but not standardized target effort.",
          "Surface temperature is a bounded compatibility modifier and may not equal fish-experienced temperature.",
          "All modes remain private and promotion-blocked until Pass 2 implementation tests and owner review are complete."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "port_sanilac_mi__atlantic_salmon__fall_harbor_return__v3_species_expansion_v1",
        "modeId": "fall_harbor_return",
        "fisheryStrength": 5.2,
        "availabilityKnots": [
          {
            "monthDay": "07-15",
            "availability": 0
          },
          {
            "monthDay": "08-25",
            "availability": 0.2
          },
          {
            "monthDay": "09-25",
            "availability": 0.8
          },
          {
            "monthDay": "10-20",
            "availability": 1
          },
          {
            "monthDay": "11-20",
            "availability": 0.2
          },
          {
            "monthDay": "12-10",
            "availability": 0
          }
        ],
        "thermalCurveId": "atlantic_salmon__shared_temperature__v0_1",
        "modeName": "Fall harbor return",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "EXP_MI_LH_ROADMAP"
        ],
        "limitations": [
          "FisheryStrength is an ordinal calibration ceiling, not catch probability, fish abundance or a government rating.",
          "Weekly reports establish occurrence and timing but not standardized target effort.",
          "Surface temperature is a bounded compatibility modifier and may not equal fish-experienced temperature.",
          "All modes remain private and promotion-blocked until Pass 2 implementation tests and owner review are complete."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "port_sanilac_mi/chinook_salmon",
    "cityId": "port_sanilac_mi",
    "speciesId": "chinook_salmon",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "port_sanilac_mi__chinook_salmon__spring_coldwater_transient__v3_species_expansion_v1",
        "modeId": "spring_coldwater_transient",
        "fisheryStrength": 4.8,
        "availabilityKnots": [
          {
            "monthDay": "02-15",
            "availability": 0
          },
          {
            "monthDay": "03-25",
            "availability": 0.25
          },
          {
            "monthDay": "05-01",
            "availability": 1
          },
          {
            "monthDay": "06-10",
            "availability": 0.3
          },
          {
            "monthDay": "07-01",
            "availability": 0
          }
        ],
        "thermalCurveId": "chinook_salmon__shared_temperature__v0_2",
        "modeName": "Spring cold-water transient",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "EXP_MI_LH_ROADMAP",
          "EXP_PS_CITY"
        ],
        "limitations": [
          "FisheryStrength is an ordinal calibration ceiling, not catch probability, fish abundance or a government rating.",
          "Weekly reports establish occurrence and timing but not standardized target effort.",
          "Surface temperature is a bounded compatibility modifier and may not equal fish-experienced temperature.",
          "All modes remain private and promotion-blocked until Pass 2 implementation tests and owner review are complete."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "port_sanilac_mi__chinook_salmon__fall_harbor_staging__v3_species_expansion_v1",
        "modeId": "fall_harbor_staging",
        "fisheryStrength": 5,
        "availabilityKnots": [
          {
            "monthDay": "07-15",
            "availability": 0
          },
          {
            "monthDay": "08-20",
            "availability": 0.35
          },
          {
            "monthDay": "09-20",
            "availability": 1
          },
          {
            "monthDay": "10-20",
            "availability": 0.45
          },
          {
            "monthDay": "11-10",
            "availability": 0
          }
        ],
        "thermalCurveId": "chinook_salmon__shared_temperature__v0_2",
        "modeName": "Fall harbor staging",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "EXP_MI_LH_ROADMAP",
          "EXP_PS_CITY"
        ],
        "limitations": [
          "FisheryStrength is an ordinal calibration ceiling, not catch probability, fish abundance or a government rating.",
          "Weekly reports establish occurrence and timing but not standardized target effort.",
          "Surface temperature is a bounded compatibility modifier and may not equal fish-experienced temperature.",
          "All modes remain private and promotion-blocked until Pass 2 implementation tests and owner review are complete."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "port_sanilac_mi/brown_trout",
    "cityId": "port_sanilac_mi",
    "speciesId": "brown_trout",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "port_sanilac_mi__brown_trout__spring_nearshore__v3_species_expansion_v1",
        "modeId": "spring_nearshore",
        "fisheryStrength": 4.8,
        "availabilityKnots": [
          {
            "monthDay": "01-15",
            "availability": 0
          },
          {
            "monthDay": "03-01",
            "availability": 0.25
          },
          {
            "monthDay": "04-20",
            "availability": 1
          },
          {
            "monthDay": "05-25",
            "availability": 0.55
          },
          {
            "monthDay": "07-01",
            "availability": 0
          }
        ],
        "thermalCurveId": "brown_trout__shared_temperature__v0_2",
        "modeName": "Spring nearshore trout opportunity",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "EXP_MI_LH_ROADMAP",
          "EXP_PS_CITY"
        ],
        "limitations": [
          "FisheryStrength is an ordinal calibration ceiling, not catch probability, fish abundance or a government rating.",
          "Weekly reports establish occurrence and timing but not standardized target effort.",
          "Surface temperature is a bounded compatibility modifier and may not equal fish-experienced temperature.",
          "All modes remain private and promotion-blocked until Pass 2 implementation tests and owner review are complete."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "port_sanilac_mi__brown_trout__fall_coolwater_return__v3_species_expansion_v1",
        "modeId": "fall_coolwater_return",
        "fisheryStrength": 4.5,
        "availabilityKnots": [
          {
            "monthDay": "07-15",
            "availability": 0
          },
          {
            "monthDay": "08-25",
            "availability": 0.2
          },
          {
            "monthDay": "09-25",
            "availability": 0.8
          },
          {
            "monthDay": "10-20",
            "availability": 1
          },
          {
            "monthDay": "11-20",
            "availability": 0.15
          },
          {
            "monthDay": "12-10",
            "availability": 0
          }
        ],
        "thermalCurveId": "brown_trout__shared_temperature__v0_2",
        "modeName": "Fall cool-water return",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "EXP_MI_LH_ROADMAP"
        ],
        "limitations": [
          "FisheryStrength is an ordinal calibration ceiling, not catch probability, fish abundance or a government rating.",
          "Weekly reports establish occurrence and timing but not standardized target effort.",
          "Surface temperature is a bounded compatibility modifier and may not equal fish-experienced temperature.",
          "All modes remain private and promotion-blocked until Pass 2 implementation tests and owner review are complete."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "port_sanilac_mi/lake_trout",
    "cityId": "port_sanilac_mi",
    "speciesId": "lake_trout",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "port_sanilac_mi__lake_trout__reachable_coldwater_port__v3_species_expansion_v1",
        "modeId": "reachable_coldwater_port",
        "fisheryStrength": 5.5,
        "availabilityKnots": [
          {
            "monthDay": "01-15",
            "availability": 0
          },
          {
            "monthDay": "03-01",
            "availability": 0.2
          },
          {
            "monthDay": "05-01",
            "availability": 1
          },
          {
            "monthDay": "07-15",
            "availability": 0.5
          },
          {
            "monthDay": "09-15",
            "availability": 0.6
          },
          {
            "monthDay": "10-20",
            "availability": 0.75
          },
          {
            "monthDay": "12-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "lake_trout__additional_thermal_research__v0_1",
        "modeName": "Reachable cold-water port fishery",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "EXP_MI_LH_ROADMAP",
          "EXP_PS_CITY"
        ],
        "limitations": [
          "FisheryStrength is an ordinal calibration ceiling, not catch probability, fish abundance or a government rating.",
          "Weekly reports establish occurrence and timing but not standardized target effort.",
          "Surface temperature is a bounded compatibility modifier and may not equal fish-experienced temperature.",
          "All modes remain private and promotion-blocked until Pass 2 implementation tests and owner review are complete."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "port_sanilac_mi/yellow_perch",
    "cityId": "port_sanilac_mi",
    "speciesId": "yellow_perch",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "port_sanilac_mi__yellow_perch__warm_season_breakwall__v3_species_expansion_v1",
        "modeId": "warm_season_breakwall",
        "fisheryStrength": 5,
        "availabilityKnots": [
          {
            "monthDay": "03-15",
            "availability": 0
          },
          {
            "monthDay": "05-01",
            "availability": 0.25
          },
          {
            "monthDay": "06-15",
            "availability": 0.75
          },
          {
            "monthDay": "08-01",
            "availability": 1
          },
          {
            "monthDay": "09-20",
            "availability": 0.7
          },
          {
            "monthDay": "11-01",
            "availability": 0
          }
        ],
        "thermalCurveId": "yellow_perch__additional_thermal_research__v0_1",
        "modeName": "Warm-season breakwall perch fishery",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "EXP_MI_BETTER_WATERS",
          "EXP_PS_CITY"
        ],
        "limitations": [
          "FisheryStrength is an ordinal calibration ceiling, not catch probability, fish abundance or a government rating.",
          "Weekly reports establish occurrence and timing but not standardized target effort.",
          "Surface temperature is a bounded compatibility modifier and may not equal fish-experienced temperature.",
          "All modes remain private and promotion-blocked until Pass 2 implementation tests and owner review are complete."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "port_sanilac_mi/walleye",
    "cityId": "port_sanilac_mi",
    "speciesId": "walleye",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "port_sanilac_mi__walleye__warm_season_low_light_breakwall__v3_species_expansion_v1",
        "modeId": "warm_season_low_light_breakwall",
        "fisheryStrength": 6.2,
        "availabilityKnots": [
          {
            "monthDay": "03-15",
            "availability": 0
          },
          {
            "monthDay": "04-25",
            "availability": 0.25
          },
          {
            "monthDay": "06-15",
            "availability": 0.75
          },
          {
            "monthDay": "08-15",
            "availability": 0.9
          },
          {
            "monthDay": "10-01",
            "availability": 1
          },
          {
            "monthDay": "11-15",
            "availability": 0.15
          },
          {
            "monthDay": "12-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "walleye__additional_thermal_research__v0_1",
        "modeName": "Warm-season low-light breakwall fishery",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "EXP_MI_LH_ROADMAP",
          "EXP_PS_CITY",
          "EXP_PS_2019_06_13"
        ],
        "limitations": [
          "FisheryStrength is an ordinal calibration ceiling, not catch probability, fish abundance or a government rating.",
          "Weekly reports establish occurrence and timing but not standardized target effort.",
          "Surface temperature is a bounded compatibility modifier and may not equal fish-experienced temperature.",
          "All modes remain private and promotion-blocked until Pass 2 implementation tests and owner review are complete."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "port_sanilac_mi/smallmouth_bass",
    "cityId": "port_sanilac_mi",
    "speciesId": "smallmouth_bass",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "port_sanilac_mi__smallmouth_bass__warm_season_breakwall__v3_species_expansion_v1",
        "modeId": "warm_season_breakwall",
        "fisheryStrength": 5.4,
        "availabilityKnots": [
          {
            "monthDay": "03-15",
            "availability": 0
          },
          {
            "monthDay": "05-01",
            "availability": 0.45
          },
          {
            "monthDay": "06-15",
            "availability": 0.9
          },
          {
            "monthDay": "07-25",
            "availability": 1
          },
          {
            "monthDay": "09-15",
            "availability": 0.75
          },
          {
            "monthDay": "10-31",
            "availability": 0.1
          },
          {
            "monthDay": "11-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "smallmouth_bass__additional_thermal_research__v0_1",
        "modeName": "Warm-season breakwall fishery",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "EXP_PS_2022_06_15",
          "EXP_PS_2025_05_21"
        ],
        "limitations": [
          "FisheryStrength is an ordinal calibration ceiling, not catch probability, fish abundance or a government rating.",
          "Weekly reports establish occurrence and timing but not standardized target effort.",
          "Surface temperature is a bounded compatibility modifier and may not equal fish-experienced temperature.",
          "All modes remain private and promotion-blocked until Pass 2 implementation tests and owner review are complete."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "port_sanilac_mi/white_bass",
    "cityId": "port_sanilac_mi",
    "speciesId": "white_bass",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "port_sanilac_mi__white_bass__summer_breakwall_schooling__v3_species_expansion_v1",
        "modeId": "summer_breakwall_schooling",
        "fisheryStrength": 4.5,
        "availabilityKnots": [
          {
            "monthDay": "04-01",
            "availability": 0
          },
          {
            "monthDay": "05-15",
            "availability": 0.25
          },
          {
            "monthDay": "06-20",
            "availability": 0.8
          },
          {
            "monthDay": "07-25",
            "availability": 1
          },
          {
            "monthDay": "08-25",
            "availability": 0.65
          },
          {
            "monthDay": "10-01",
            "availability": 0
          }
        ],
        "thermalCurveId": "white_bass__shared_temperature__v0_1_research",
        "modeName": "Summer breakwall schooling opportunity",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "EXP_MI_LH_ROADMAP",
          "EXP_PS_2022_06_15"
        ],
        "limitations": [
          "FisheryStrength is an ordinal calibration ceiling, not catch probability, fish abundance or a government rating.",
          "Weekly reports establish occurrence and timing but not standardized target effort.",
          "Surface temperature is a bounded compatibility modifier and may not equal fish-experienced temperature.",
          "All modes remain private and promotion-blocked until Pass 2 implementation tests and owner review are complete."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "ludington_mi/northern_pike",
    "cityId": "ludington_mi",
    "speciesId": "northern_pike",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "ludington_mi__northern_pike__warm_season_harbor__v3_species_expansion_v1",
        "modeId": "warm_season_harbor",
        "fisheryStrength": 5.2,
        "availabilityKnots": [
          {
            "monthDay": "03-15",
            "availability": 0
          },
          {
            "monthDay": "05-01",
            "availability": 0.3
          },
          {
            "monthDay": "06-15",
            "availability": 0.65
          },
          {
            "monthDay": "07-20",
            "availability": 0.9
          },
          {
            "monthDay": "08-15",
            "availability": 1
          },
          {
            "monthDay": "09-20",
            "availability": 0.65
          },
          {
            "monthDay": "10-20",
            "availability": 0.4
          },
          {
            "monthDay": "11-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "northern_pike__shared_temperature__v0_1",
        "modeName": "Warm-season harbor fishery",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "EXP_MI_CREEL"
        ],
        "limitations": [
          "FisheryStrength is an ordinal calibration ceiling, not catch probability, fish abundance or a government rating.",
          "Weekly reports establish occurrence and timing but not standardized target effort.",
          "Surface temperature is a bounded compatibility modifier and may not equal fish-experienced temperature.",
          "All modes remain private and promotion-blocked until Pass 2 implementation tests and owner review are complete."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "ludington_mi/burbot",
    "cityId": "ludington_mi",
    "speciesId": "burbot",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "ludington_mi__burbot__winter_harbor_bottom__v3_species_expansion_v1",
        "modeId": "winter_harbor_bottom",
        "fisheryStrength": 4.6,
        "availabilityKnots": [
          {
            "monthDay": "01-15",
            "availability": 0.9
          },
          {
            "monthDay": "02-10",
            "availability": 1
          },
          {
            "monthDay": "03-15",
            "availability": 0.55
          },
          {
            "monthDay": "04-15",
            "availability": 0
          },
          {
            "monthDay": "11-15",
            "availability": 0
          },
          {
            "monthDay": "12-15",
            "availability": 0.5
          }
        ],
        "thermalCurveId": "burbot__shared_temperature__v0_1_research",
        "modeName": "Winter harbor bottom-fishing opportunity",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "EXP_MI_LM_ROADMAP",
          "THERM_BURBOT_2016"
        ],
        "limitations": [
          "FisheryStrength is an ordinal calibration ceiling, not catch probability, fish abundance or a government rating.",
          "Weekly reports establish occurrence and timing but not standardized target effort.",
          "Surface temperature is a bounded compatibility modifier and may not equal fish-experienced temperature.",
          "All modes remain private and promotion-blocked until Pass 2 implementation tests and owner review are complete."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "grand_haven_mi/white_perch",
    "cityId": "grand_haven_mi",
    "speciesId": "white_perch",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "grand_haven_mi__white_perch__warm_season_harbor_schooling__v3_species_expansion_v1",
        "modeId": "warm_season_harbor_schooling",
        "fisheryStrength": 5.6,
        "availabilityKnots": [
          {
            "monthDay": "03-15",
            "availability": 0
          },
          {
            "monthDay": "05-15",
            "availability": 0.15
          },
          {
            "monthDay": "06-20",
            "availability": 0.45
          },
          {
            "monthDay": "07-20",
            "availability": 0.8
          },
          {
            "monthDay": "08-20",
            "availability": 1
          },
          {
            "monthDay": "09-20",
            "availability": 0.9
          },
          {
            "monthDay": "10-20",
            "availability": 0.45
          },
          {
            "monthDay": "11-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "white_perch__shared_temperature__v0_1_research",
        "modeName": "Warm-season harbor schooling opportunity",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "EXP_MI_CREEL",
          "EXP_GH_WHITE_PERCH_2017"
        ],
        "limitations": [
          "FisheryStrength is an ordinal calibration ceiling, not catch probability, fish abundance or a government rating.",
          "Weekly reports establish occurrence and timing but not standardized target effort.",
          "Surface temperature is a bounded compatibility modifier and may not equal fish-experienced temperature.",
          "All modes remain private and promotion-blocked until Pass 2 implementation tests and owner review are complete."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "grand_haven_mi/white_bass",
    "cityId": "grand_haven_mi",
    "speciesId": "white_bass",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "grand_haven_mi__white_bass__summer_harbor_schooling__v3_species_expansion_v1",
        "modeId": "summer_harbor_schooling",
        "fisheryStrength": 5.2,
        "availabilityKnots": [
          {
            "monthDay": "03-15",
            "availability": 0
          },
          {
            "monthDay": "05-15",
            "availability": 0.15
          },
          {
            "monthDay": "06-20",
            "availability": 0.5
          },
          {
            "monthDay": "07-20",
            "availability": 0.75
          },
          {
            "monthDay": "08-15",
            "availability": 1
          },
          {
            "monthDay": "09-20",
            "availability": 0.25
          },
          {
            "monthDay": "10-31",
            "availability": 0
          }
        ],
        "thermalCurveId": "white_bass__shared_temperature__v0_1_research",
        "modeName": "Summer harbor schooling opportunity",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "EXP_MI_CREEL"
        ],
        "limitations": [
          "FisheryStrength is an ordinal calibration ceiling, not catch probability, fish abundance or a government rating.",
          "Weekly reports establish occurrence and timing but not standardized target effort.",
          "Surface temperature is a bounded compatibility modifier and may not equal fish-experienced temperature.",
          "All modes remain private and promotion-blocked until Pass 2 implementation tests and owner review are complete."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "grand_haven_mi/bluegill",
    "cityId": "grand_haven_mi",
    "speciesId": "bluegill",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "grand_haven_mi__bluegill__warm_season_pier__v3_species_expansion_v1",
        "modeId": "warm_season_pier",
        "fisheryStrength": 5.8,
        "availabilityKnots": [
          {
            "monthDay": "04-01",
            "availability": 0
          },
          {
            "monthDay": "05-20",
            "availability": 0.1
          },
          {
            "monthDay": "06-20",
            "availability": 0.45
          },
          {
            "monthDay": "07-20",
            "availability": 0.75
          },
          {
            "monthDay": "08-15",
            "availability": 1
          },
          {
            "monthDay": "09-20",
            "availability": 0.45
          },
          {
            "monthDay": "10-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "bluegill__shared_temperature__v0_1_research",
        "modeName": "Warm-season pier fishery",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "EXP_MI_CREEL",
          "EXP_GH_BLUEGILL_2021"
        ],
        "limitations": [
          "FisheryStrength is an ordinal calibration ceiling, not catch probability, fish abundance or a government rating.",
          "Weekly reports establish occurrence and timing but not standardized target effort.",
          "Surface temperature is a bounded compatibility modifier and may not equal fish-experienced temperature.",
          "All modes remain private and promotion-blocked until Pass 2 implementation tests and owner review are complete."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "grand_haven_mi/lake_whitefish",
    "cityId": "grand_haven_mi",
    "speciesId": "lake_whitefish",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "grand_haven_mi__lake_whitefish__spring_coldwater_pier__v3_species_expansion_v1",
        "modeId": "spring_coldwater_pier",
        "fisheryStrength": 3.3,
        "availabilityKnots": [
          {
            "monthDay": "01-15",
            "availability": 0
          },
          {
            "monthDay": "03-15",
            "availability": 0.2
          },
          {
            "monthDay": "04-20",
            "availability": 1
          },
          {
            "monthDay": "05-20",
            "availability": 0.25
          },
          {
            "monthDay": "06-15",
            "availability": 0
          }
        ],
        "thermalCurveId": "lake_whitefish__additional_thermal_research__v0_1",
        "modeName": "Spring cold-water pier opportunity",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "EXP_MI_CREEL"
        ],
        "limitations": [
          "FisheryStrength is an ordinal calibration ceiling, not catch probability, fish abundance or a government rating.",
          "Weekly reports establish occurrence and timing but not standardized target effort.",
          "Surface temperature is a bounded compatibility modifier and may not equal fish-experienced temperature.",
          "All modes remain private and promotion-blocked until Pass 2 implementation tests and owner review are complete."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "grand_haven_mi__lake_whitefish__lawful_fall_spawning_aggregation__v3_species_expansion_v1",
        "modeId": "lawful_fall_spawning_aggregation",
        "fisheryStrength": 4,
        "availabilityKnots": [
          {
            "monthDay": "07-15",
            "availability": 0
          },
          {
            "monthDay": "09-15",
            "availability": 0.15
          },
          {
            "monthDay": "10-20",
            "availability": 0.45
          },
          {
            "monthDay": "11-15",
            "availability": 1
          },
          {
            "monthDay": "12-15",
            "availability": 0.2
          },
          {
            "monthDay": "12-31",
            "availability": 0
          }
        ],
        "thermalCurveId": "lake_whitefish__additional_thermal_research__v0_1",
        "modeName": "Lawful fall spawning-aggregation opportunity",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "EXP_MI_CREEL",
          "EXP_GH_WHITEFISH_2025",
          "EXP_MI_FO202_26"
        ],
        "limitations": [
          "FisheryStrength is an ordinal calibration ceiling, not catch probability, fish abundance or a government rating.",
          "Weekly reports establish occurrence and timing but not standardized target effort.",
          "Surface temperature is a bounded compatibility modifier and may not equal fish-experienced temperature.",
          "All modes remain private and promotion-blocked until Pass 2 implementation tests and owner review are complete.",
          "Historical November snagging harvest is excluded from lawful bite-strength calibration; the current single-hook restriction must be displayed."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "manistee_mi/northern_pike",
    "cityId": "manistee_mi",
    "speciesId": "northern_pike",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "manistee_mi__northern_pike__spring_harbor__v3_species_expansion_v1",
        "modeId": "spring_harbor",
        "fisheryStrength": 5,
        "availabilityKnots": [
          {
            "monthDay": "02-15",
            "availability": 0
          },
          {
            "monthDay": "04-01",
            "availability": 0.2
          },
          {
            "monthDay": "05-15",
            "availability": 1
          },
          {
            "monthDay": "06-20",
            "availability": 0.55
          },
          {
            "monthDay": "07-20",
            "availability": 0.1
          },
          {
            "monthDay": "08-01",
            "availability": 0
          }
        ],
        "thermalCurveId": "northern_pike__shared_temperature__v0_1",
        "modeName": "Spring harbor opportunity",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "EXP_MI_CREEL",
          "EXP_NW_2022_05_04",
          "EXP_NW_2024_04_24"
        ],
        "limitations": [
          "FisheryStrength is an ordinal calibration ceiling, not catch probability, fish abundance or a government rating.",
          "Weekly reports establish occurrence and timing but not standardized target effort.",
          "Surface temperature is a bounded compatibility modifier and may not equal fish-experienced temperature.",
          "All modes remain private and promotion-blocked until Pass 2 implementation tests and owner review are complete."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "manistee_mi__northern_pike__late_summer_fall_harbor__v3_species_expansion_v1",
        "modeId": "late_summer_fall_harbor",
        "fisheryStrength": 4.6,
        "availabilityKnots": [
          {
            "monthDay": "06-15",
            "availability": 0
          },
          {
            "monthDay": "08-01",
            "availability": 0.35
          },
          {
            "monthDay": "09-15",
            "availability": 1
          },
          {
            "monthDay": "10-20",
            "availability": 0.7
          },
          {
            "monthDay": "11-20",
            "availability": 0
          }
        ],
        "thermalCurveId": "northern_pike__shared_temperature__v0_1",
        "modeName": "Late-summer and fall harbor opportunity",
        "evidenceGrade": "A",
        "fisheryEvidenceIds": [
          "EXP_MI_CREEL"
        ],
        "limitations": [
          "FisheryStrength is an ordinal calibration ceiling, not catch probability, fish abundance or a government rating.",
          "Weekly reports establish occurrence and timing but not standardized target effort.",
          "Surface temperature is a bounded compatibility modifier and may not equal fish-experienced temperature.",
          "All modes remain private and promotion-blocked until Pass 2 implementation tests and owner review are complete."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "manistee_mi/burbot",
    "cityId": "manistee_mi",
    "speciesId": "burbot",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "manistee_mi__burbot__winter_harbor_bottom__v3_species_expansion_v1",
        "modeId": "winter_harbor_bottom",
        "fisheryStrength": 4.5,
        "availabilityKnots": [
          {
            "monthDay": "01-01",
            "availability": 0.2
          },
          {
            "monthDay": "02-01",
            "availability": 0.75
          },
          {
            "monthDay": "02-20",
            "availability": 1
          },
          {
            "monthDay": "03-20",
            "availability": 0.65
          },
          {
            "monthDay": "04-15",
            "availability": 0
          },
          {
            "monthDay": "12-01",
            "availability": 0
          }
        ],
        "thermalCurveId": "burbot__shared_temperature__v0_1_research",
        "modeName": "Winter harbor bottom-fishing opportunity",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "EXP_MI_LM_ROADMAP",
          "THERM_BURBOT_2016"
        ],
        "limitations": [
          "FisheryStrength is an ordinal calibration ceiling, not catch probability, fish abundance or a government rating.",
          "Weekly reports establish occurrence and timing but not standardized target effort.",
          "Surface temperature is a bounded compatibility modifier and may not equal fish-experienced temperature.",
          "All modes remain private and promotion-blocked until Pass 2 implementation tests and owner review are complete."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "frankfort_elberta_mi/northern_pike",
    "cityId": "frankfort_elberta_mi",
    "speciesId": "northern_pike",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "frankfort_elberta_mi__northern_pike__spring_harbor__v3_species_expansion_v1",
        "modeId": "spring_harbor",
        "fisheryStrength": 4.5,
        "availabilityKnots": [
          {
            "monthDay": "02-15",
            "availability": 0
          },
          {
            "monthDay": "03-20",
            "availability": 0.25
          },
          {
            "monthDay": "04-25",
            "availability": 1
          },
          {
            "monthDay": "05-25",
            "availability": 0.6
          },
          {
            "monthDay": "06-30",
            "availability": 0
          }
        ],
        "thermalCurveId": "northern_pike__shared_temperature__v0_1",
        "modeName": "Spring harbor opportunity",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "EXP_MI_CREEL",
          "EXP_NW_2022_05_04",
          "EXP_NW_2024_04_24"
        ],
        "limitations": [
          "FisheryStrength is an ordinal calibration ceiling, not catch probability, fish abundance or a government rating.",
          "Weekly reports establish occurrence and timing but not standardized target effort.",
          "Surface temperature is a bounded compatibility modifier and may not equal fish-experienced temperature.",
          "All modes remain private and promotion-blocked until Pass 2 implementation tests and owner review are complete."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "frankfort_elberta_mi__northern_pike__late_summer_harbor__v3_species_expansion_v1",
        "modeId": "late_summer_harbor",
        "fisheryStrength": 3.8,
        "availabilityKnots": [
          {
            "monthDay": "06-15",
            "availability": 0
          },
          {
            "monthDay": "07-20",
            "availability": 0.2
          },
          {
            "monthDay": "08-20",
            "availability": 0.7
          },
          {
            "monthDay": "09-15",
            "availability": 1
          },
          {
            "monthDay": "10-20",
            "availability": 0.2
          },
          {
            "monthDay": "11-10",
            "availability": 0
          }
        ],
        "thermalCurveId": "northern_pike__shared_temperature__v0_1",
        "modeName": "Late-summer harbor occurrence",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "EXP_MI_CREEL"
        ],
        "limitations": [
          "FisheryStrength is an ordinal calibration ceiling, not catch probability, fish abundance or a government rating.",
          "Weekly reports establish occurrence and timing but not standardized target effort.",
          "Surface temperature is a bounded compatibility modifier and may not equal fish-experienced temperature.",
          "All modes remain private and promotion-blocked until Pass 2 implementation tests and owner review are complete."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  },
  {
    "pairKey": "frankfort_elberta_mi/walleye",
    "cityId": "frankfort_elberta_mi",
    "speciesId": "walleye",
    "ratingEnabled": false,
    "modes": [
      {
        "modeCalibrationId": "frankfort_elberta_mi__walleye__spring_harbor_low_light__v3_species_expansion_v1",
        "modeId": "spring_harbor_low_light",
        "fisheryStrength": 4.5,
        "availabilityKnots": [
          {
            "monthDay": "02-15",
            "availability": 0
          },
          {
            "monthDay": "03-20",
            "availability": 0.2
          },
          {
            "monthDay": "04-25",
            "availability": 0.85
          },
          {
            "monthDay": "05-15",
            "availability": 1
          },
          {
            "monthDay": "06-20",
            "availability": 0.25
          },
          {
            "monthDay": "07-01",
            "availability": 0
          }
        ],
        "thermalCurveId": "walleye__additional_thermal_research__v0_1",
        "modeName": "Spring low-light harbor opportunity",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "EXP_NW_2022_05_04",
          "EXP_NW_2024_04_24"
        ],
        "limitations": [
          "FisheryStrength is an ordinal calibration ceiling, not catch probability, fish abundance or a government rating.",
          "Weekly reports establish occurrence and timing but not standardized target effort.",
          "Surface temperature is a bounded compatibility modifier and may not equal fish-experienced temperature.",
          "All modes remain private and promotion-blocked until Pass 2 implementation tests and owner review are complete."
        ],
        "promotionEligible": false
      },
      {
        "modeCalibrationId": "frankfort_elberta_mi__walleye__late_summer_low_light__v3_species_expansion_v1",
        "modeId": "late_summer_low_light",
        "fisheryStrength": 3.8,
        "availabilityKnots": [
          {
            "monthDay": "06-15",
            "availability": 0
          },
          {
            "monthDay": "07-15",
            "availability": 0.6
          },
          {
            "monthDay": "08-20",
            "availability": 0.5
          },
          {
            "monthDay": "09-15",
            "availability": 1
          },
          {
            "monthDay": "10-20",
            "availability": 0.1
          },
          {
            "monthDay": "11-10",
            "availability": 0
          }
        ],
        "thermalCurveId": "walleye__additional_thermal_research__v0_1",
        "modeName": "Late-summer low-light occurrence",
        "evidenceGrade": "B",
        "fisheryEvidenceIds": [
          "EXP_MI_CREEL"
        ],
        "limitations": [
          "FisheryStrength is an ordinal calibration ceiling, not catch probability, fish abundance or a government rating.",
          "Weekly reports establish occurrence and timing but not standardized target effort.",
          "Surface temperature is a bounded compatibility modifier and may not equal fish-experienced temperature.",
          "All modes remain private and promotion-blocked until Pass 2 implementation tests and owner review are complete."
        ],
        "promotionEligible": false
      }
    ],
    "publicEnabled": false,
    "promotionEligible": false
  }
] as const satisfies readonly PierCastV3PairCalibration[];
