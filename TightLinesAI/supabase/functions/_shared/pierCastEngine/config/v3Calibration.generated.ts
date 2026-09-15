/* eslint-disable */
/**
 * GENERATED FILE — DO NOT HAND EDIT.
 * Source: Pass 1 evidence-reviewed, disabled runtime candidates.
 * Regenerate with npm run generate:pier-cast:v3-pass2-config.
 */
import type { PierCastV3PairCalibration } from "./v3Calibration.ts";

export const PIER_CAST_V3_CONFIG_VERSION = "piercast-v3-nine-city-core-four-pass2-v1" as const;
export const PIER_CAST_V3_SOURCE_SCHEMA_VERSION = "piercast-v3-disabled-runtime-candidates-v1" as const;
export const PIER_CAST_V3_SOURCE_SHA256 = "0a7f4060d8e4b9b777bec3f0d127e220e5cb0bd059fc79b27334345b3787e2e1" as const;
export const PIER_CAST_V3_CALIBRATION_SHA256 = "8ec12997e71c80817b577bea662e21e421aa5e3709eeaceb8fd4755b65ebe7fe" as const;
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
  }
] as const satisfies readonly PierCastV3PairCalibration[];
