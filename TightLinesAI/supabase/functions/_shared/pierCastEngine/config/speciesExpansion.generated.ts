/* eslint-disable */
/**
 * GENERATED FILE — DO NOT HAND EDIT.
 * Source: evidence-frozen PierCast species-expansion Pass 1 artifacts.
 * Regenerate with npm run generate:pier-cast:species-expansion.
 */
import type { PierCastSpeciesId, PierCastTemperatureCurve } from "../types.ts";

export const PIER_CAST_SPECIES_EXPANSION_VERSION = "piercast-v3-species-expansion-v1" as const;
export const PIER_CAST_SPECIES_EXPANSION_SOURCE_SHA256 = "262ac68062f4861317fab221a00ca220399c1f1dba37b64eef26558dc89776ab" as const;
export const PIER_CAST_SPECIES_EXPANSION_ADMITTED_PAIR_KEYS = [
  "harbor_beach_mi/atlantic_salmon",
  "harbor_beach_mi/steelhead",
  "harbor_beach_mi/lake_trout",
  "harbor_beach_mi/walleye",
  "harbor_beach_mi/northern_pike",
  "oscoda_mi/northern_pike",
  "port_sanilac_mi/atlantic_salmon",
  "port_sanilac_mi/chinook_salmon",
  "port_sanilac_mi/brown_trout",
  "port_sanilac_mi/lake_trout",
  "port_sanilac_mi/yellow_perch",
  "port_sanilac_mi/walleye",
  "port_sanilac_mi/smallmouth_bass",
  "port_sanilac_mi/white_bass",
  "ludington_mi/northern_pike",
  "ludington_mi/burbot",
  "grand_haven_mi/white_perch",
  "grand_haven_mi/white_bass",
  "grand_haven_mi/bluegill",
  "grand_haven_mi/lake_whitefish",
  "manistee_mi/northern_pike",
  "manistee_mi/burbot",
  "frankfort_elberta_mi/northern_pike",
  "frankfort_elberta_mi/walleye"
] as const;
export const PIER_CAST_SPECIES_EXPANSION_NEW_SPECIES = [
  {
    "speciesId": "burbot",
    "displayName": "Burbot",
    "scientificName": "Lota lota",
    "admittedCities": [
      "ludington_mi",
      "manistee_mi"
    ]
  },
  {
    "speciesId": "white_perch",
    "displayName": "White Perch",
    "scientificName": "Morone americana",
    "admittedCities": [
      "grand_haven_mi"
    ]
  },
  {
    "speciesId": "white_bass",
    "displayName": "White Bass",
    "scientificName": "Morone chrysops",
    "admittedCities": [
      "grand_haven_mi",
      "port_sanilac_mi"
    ]
  },
  {
    "speciesId": "bluegill",
    "displayName": "Bluegill",
    "scientificName": "Lepomis macrochirus",
    "admittedCities": [
      "grand_haven_mi"
    ]
  }
] as const satisfies readonly {
  speciesId: PierCastSpeciesId;
  displayName: string;
  scientificName: string;
  admittedCities: readonly string[];
}[];
export const PIER_CAST_SPECIES_EXPANSION_TEMPERATURE_CURVES = [
  {
    "speciesId": "burbot",
    "curve": {
      "curveId": "burbot__shared_temperature__v0_1_research",
      "calibrationStatus": "provisional",
      "acceptedDomainC": [
        0,
        23
      ],
      "knots": [
        {
          "temperatureC": 0,
          "suitability": 0.9
        },
        {
          "temperatureC": 2,
          "suitability": 1
        },
        {
          "temperatureC": 6,
          "suitability": 1
        },
        {
          "temperatureC": 10,
          "suitability": 1
        },
        {
          "temperatureC": 12,
          "suitability": 1
        },
        {
          "temperatureC": 14,
          "suitability": 0.95
        },
        {
          "temperatureC": 16,
          "suitability": 0.65
        },
        {
          "temperatureC": 18,
          "suitability": 0.35
        },
        {
          "temperatureC": 20,
          "suitability": 0.15
        },
        {
          "temperatureC": 23,
          "suitability": 0.05
        }
      ]
    }
  },
  {
    "speciesId": "white_perch",
    "curve": {
      "curveId": "white_perch__shared_temperature__v0_1_research",
      "calibrationStatus": "provisional",
      "acceptedDomainC": [
        0,
        34
      ],
      "knots": [
        {
          "temperatureC": 0,
          "suitability": 0.25
        },
        {
          "temperatureC": 4,
          "suitability": 0.35
        },
        {
          "temperatureC": 8,
          "suitability": 0.5
        },
        {
          "temperatureC": 12,
          "suitability": 0.65
        },
        {
          "temperatureC": 16,
          "suitability": 0.75
        },
        {
          "temperatureC": 20,
          "suitability": 0.85
        },
        {
          "temperatureC": 24,
          "suitability": 0.95
        },
        {
          "temperatureC": 26,
          "suitability": 1
        },
        {
          "temperatureC": 30,
          "suitability": 1
        },
        {
          "temperatureC": 32,
          "suitability": 0.8
        },
        {
          "temperatureC": 34,
          "suitability": 0.4
        }
      ]
    }
  },
  {
    "speciesId": "white_bass",
    "curve": {
      "curveId": "white_bass__shared_temperature__v0_1_research",
      "calibrationStatus": "provisional",
      "acceptedDomainC": [
        0,
        35
      ],
      "knots": [
        {
          "temperatureC": 0,
          "suitability": 0.3
        },
        {
          "temperatureC": 4,
          "suitability": 0.4
        },
        {
          "temperatureC": 8,
          "suitability": 0.55
        },
        {
          "temperatureC": 12,
          "suitability": 0.75
        },
        {
          "temperatureC": 14,
          "suitability": 0.9
        },
        {
          "temperatureC": 18,
          "suitability": 0.95
        },
        {
          "temperatureC": 22,
          "suitability": 1
        },
        {
          "temperatureC": 28,
          "suitability": 1
        },
        {
          "temperatureC": 31,
          "suitability": 0.9
        },
        {
          "temperatureC": 33,
          "suitability": 0.55
        },
        {
          "temperatureC": 35,
          "suitability": 0.2
        }
      ]
    }
  },
  {
    "speciesId": "bluegill",
    "curve": {
      "curveId": "bluegill__shared_temperature__v0_1_research",
      "calibrationStatus": "provisional",
      "acceptedDomainC": [
        0,
        36
      ],
      "knots": [
        {
          "temperatureC": 0,
          "suitability": 0.25
        },
        {
          "temperatureC": 4,
          "suitability": 0.35
        },
        {
          "temperatureC": 8,
          "suitability": 0.45
        },
        {
          "temperatureC": 12,
          "suitability": 0.6
        },
        {
          "temperatureC": 16,
          "suitability": 0.8
        },
        {
          "temperatureC": 18,
          "suitability": 0.95
        },
        {
          "temperatureC": 21,
          "suitability": 1
        },
        {
          "temperatureC": 27,
          "suitability": 1
        },
        {
          "temperatureC": 30,
          "suitability": 0.85
        },
        {
          "temperatureC": 33,
          "suitability": 0.45
        },
        {
          "temperatureC": 36,
          "suitability": 0.1
        }
      ]
    }
  }
] as const satisfies readonly {
  speciesId: PierCastSpeciesId;
  curve: PierCastTemperatureCurve;
}[];
export const PIER_CAST_SPECIES_EXPANSION_REGULATION_NOTICES = [
  {
    "noticeId": "grand_haven_november_single_hook_restriction",
    "cityId": "grand_haven_mi",
    "speciesId": "all",
    "startMonthDay": "11-01",
    "endMonthDay": "11-30",
    "reasonCode": "special_tackle_restriction",
    "title": "November single-hook restriction",
    "message": "Within the defined Port of Grand Haven during November, use only one single-pointed, unweighted hook no larger than one-half inch from point to shank. Verify current regulations before fishing.",
    "evidenceIds": [
      "EXP_MI_FO202_26",
      "EXP_MI_REGS_2026"
    ]
  }
] as const;
