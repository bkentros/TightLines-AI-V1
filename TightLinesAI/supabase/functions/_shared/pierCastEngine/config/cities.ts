import type {
  PierCastCityProfile,
  PierCastCitySpeciesProfile,
  PierCastSpeciesId,
  PierCastSpeciesInheritance,
} from "../types.ts";
import {
  getPierCastCoreSeasonalCurve,
  PIER_CAST_CITY_TEMPERATURE_SOURCES,
} from "./coreCalibration.ts";

function species(
  speciesId: PierCastSpeciesId,
  inheritance: PierCastSpeciesInheritance,
  limitation: string | null = null,
  seasonalOpportunityCurve:
    PierCastCitySpeciesProfile["seasonalOpportunityCurve"] = null,
): PierCastCitySpeciesProfile {
  return {
    speciesId,
    inheritance,
    seasonalOpportunityCurve,
    ratingEnabled: false,
    limitation,
  };
}

const unresolved = (speciesId: PierCastSpeciesId, limitation: string) =>
  species(speciesId, "unresolved", limitation);

const coreSpecies = (
  cityId: PierCastCityProfile["cityId"],
  speciesId: PierCastSpeciesId,
  inheritance: PierCastSpeciesInheritance,
  limitation: string | null = null,
) =>
  species(
    speciesId,
    inheritance,
    limitation,
    getPierCastCoreSeasonalCurve(cityId, speciesId),
  );

export const PIER_CAST_CITY_PROFILES: readonly PierCastCityProfile[] = [
  {
    cityId: "ludington_mi",
    displayName: "Ludington",
    stateCode: "MI",
    timezone: "America/Detroit",
    tentative: false,
    publicEnabled: false,
    waterTemperatureSource: PIER_CAST_CITY_TEMPERATURE_SOURCES.ludington_mi,
    structures: [
      {
        structureId: "ludington_north_breakwater",
        displayName: "North Breakwater",
        municipality: "Ludington",
        disposition: "candidate",
        accessStatus: "not_live_verified",
        limitation:
          "Live access and forecast-area representation are not approved.",
      },
      {
        structureId: "ludington_stub_pier",
        displayName: "Stub Pier",
        municipality: "Ludington",
        disposition: "unresolved",
        accessStatus: "route_unverified",
        limitation:
          "The DNR alias has not been mapped to a verified structure and route.",
      },
      {
        structureId: "ludington_south_breakwater",
        displayName: "South Breakwater",
        municipality: "Ludington",
        disposition: "excluded",
        accessStatus: "route_unverified",
        limitation: "Public route and fishing access remain unverified.",
      },
    ],
    species: [
      coreSpecies("ludington_mi", "chinook_salmon", "candidate"),
      coreSpecies("ludington_mi", "coho_salmon", "candidate"),
      coreSpecies("ludington_mi", "steelhead", "candidate"),
      coreSpecies("ludington_mi", "brown_trout", "candidate"),
      unresolved("lake_trout", "No adequate covered-pier season evidence."),
      unresolved("walleye", "No adequate covered-pier season evidence."),
      species(
        "smallmouth_bass",
        "conditional",
        "Depends on stub-pier identity and access.",
      ),
      species("freshwater_drum", "candidate"),
      unresolved("yellow_perch", "No adequate covered-pier season evidence."),
      unresolved("lake_whitefish", "No adequate covered-pier season evidence."),
      species(
        "round_whitefish",
        "historical_lead",
        "Contemporary corroboration required.",
      ),
      unresolved("channel_catfish", "No adequate covered-pier evidence."),
      unresolved("largemouth_bass", "No adequate covered-pier evidence."),
    ],
  },
  {
    cityId: "grand_haven_mi",
    displayName: "Grand Haven",
    stateCode: "MI",
    timezone: "America/Detroit",
    tentative: false,
    publicEnabled: false,
    waterTemperatureSource: PIER_CAST_CITY_TEMPERATURE_SOURCES.grand_haven_mi,
    structures: [
      {
        structureId: "grand_haven_south_pier",
        displayName: "South Pier",
        municipality: "Grand Haven",
        disposition: "candidate",
        accessStatus: "not_live_verified",
        limitation:
          "Live access and forecast-area representation are not approved.",
      },
      {
        structureId: "grand_haven_north_pier",
        displayName: "North Pier / Fisherman's Pier",
        municipality: "Grand Haven",
        disposition: "excluded",
        accessStatus: "reported_closed",
        limitation:
          "Reported closed during major construction; no automatic 2028 activation.",
      },
    ],
    species: [
      coreSpecies("grand_haven_mi", "chinook_salmon", "candidate"),
      coreSpecies("grand_haven_mi", "coho_salmon", "candidate"),
      coreSpecies("grand_haven_mi", "steelhead", "candidate"),
      coreSpecies("grand_haven_mi", "brown_trout", "candidate"),
      species(
        "lake_trout",
        "conditional",
        "Grouped agency lead; individual pier season unresolved.",
      ),
      species(
        "walleye",
        "conditional",
        "Grouped agency lead; individual pier season unresolved.",
      ),
      species(
        "smallmouth_bass",
        "historical_lead",
        "Current pier-specific season needs corroboration.",
      ),
      species("freshwater_drum", "candidate"),
      species(
        "yellow_perch",
        "conditional",
        "Grouped and boat evidence cannot establish a pier season.",
      ),
      species(
        "lake_whitefish",
        "candidate",
        "Narrow November port context; lawful method remains separate.",
      ),
      species(
        "round_whitefish",
        "conditional",
        "Local lead needs a current season review.",
      ),
      species("channel_catfish", "candidate"),
      species(
        "largemouth_bass",
        "candidate",
        "Secondary target with a direct warm-season report.",
      ),
    ],
  },
  {
    cityId: "manistee_mi",
    displayName: "Manistee",
    stateCode: "MI",
    timezone: "America/Detroit",
    tentative: false,
    publicEnabled: false,
    waterTemperatureSource: PIER_CAST_CITY_TEMPERATURE_SOURCES.manistee_mi,
    structures: [
      {
        structureId: "manistee_north_pier",
        displayName: "North Pier",
        municipality: "Manistee",
        disposition: "candidate",
        accessStatus: "not_live_verified",
        limitation:
          "Live access and forecast-area representation are not approved.",
      },
      {
        structureId: "manistee_south_breakwater",
        displayName: "South Breakwater",
        municipality: "Manistee",
        disposition: "excluded",
        accessStatus: "reported_closed",
        limitation:
          "Connector closure has no authoritative reopening confirmation.",
      },
      {
        structureId: "manistee_stub_pier",
        displayName: "South-side Stub Pier",
        municipality: "Manistee",
        disposition: "unresolved",
        accessStatus: "route_unverified",
        limitation: "Alias, entrance, and fishing boundary require mapping.",
      },
    ],
    species: [
      coreSpecies("manistee_mi", "chinook_salmon", "candidate"),
      coreSpecies("manistee_mi", "coho_salmon", "candidate"),
      coreSpecies("manistee_mi", "steelhead", "candidate"),
      coreSpecies("manistee_mi", "brown_trout", "candidate"),
      species("lake_trout", "conditional", "Limited direct pier record."),
      species("walleye", "candidate"),
      species("smallmouth_bass", "candidate"),
      species("freshwater_drum", "candidate"),
      species("yellow_perch", "candidate"),
      species("lake_whitefish", "conditional", "Limited direct record."),
      species(
        "round_whitefish",
        "historical_lead",
        "Contemporary corroboration required.",
      ),
      unresolved("channel_catfish", "No adequate covered-pier evidence."),
      unresolved(
        "largemouth_bass",
        "No species-specific covered-pier evidence.",
      ),
    ],
  },
  {
    cityId: "frankfort_elberta_mi",
    displayName: "Frankfort",
    stateCode: "MI",
    timezone: "America/Detroit",
    tentative: false,
    publicEnabled: false,
    waterTemperatureSource:
      PIER_CAST_CITY_TEMPERATURE_SOURCES.frankfort_elberta_mi,
    structures: [
      {
        structureId: "frankfort_north_breakwater",
        displayName: "Frankfort North Breakwater",
        municipality: "Frankfort",
        disposition: "candidate",
        accessStatus: "route_unverified",
        limitation:
          "Current approach and forecast-area representation are not approved.",
      },
      {
        structureId: "elberta_south_breakwater",
        displayName: "Elberta South Breakwater",
        municipality: "Elberta",
        disposition: "candidate",
        accessStatus: "route_unverified",
        limitation:
          "Current approach and shared representation are not approved.",
      },
    ],
    species: [
      coreSpecies(
        "frankfort_elberta_mi",
        "chinook_salmon",
        "conditional",
        "Inside-pier trolling evidence does not establish shore reachability.",
      ),
      coreSpecies("frankfort_elberta_mi", "coho_salmon", "candidate"),
      coreSpecies("frankfort_elberta_mi", "steelhead", "candidate"),
      coreSpecies("frankfort_elberta_mi", "brown_trout", "candidate"),
      unresolved("lake_trout", "Offshore evidence is excluded."),
      species("walleye", "conditional", "Inside-pier trolling lead only."),
      unresolved(
        "smallmouth_bass",
        "No adequate covered-pier evidence; Leland reports excluded.",
      ),
      unresolved("freshwater_drum", "No adequate covered-pier evidence."),
      unresolved("yellow_perch", "No adequate covered-pier evidence."),
      unresolved("lake_whitefish", "No adequate covered-pier evidence."),
      species(
        "round_whitefish",
        "historical_lead",
        "Contemporary corroboration required.",
      ),
      unresolved("channel_catfish", "No adequate covered-pier evidence."),
      unresolved("largemouth_bass", "No adequate covered-pier evidence."),
    ],
  },
  {
    cityId: "sheboygan_wi",
    displayName: "Sheboygan",
    stateCode: "WI",
    timezone: "America/Chicago",
    tentative: true,
    publicEnabled: false,
    waterTemperatureSource: PIER_CAST_CITY_TEMPERATURE_SOURCES.sheboygan_wi,
    structures: [
      {
        structureId: "sheboygan_north_pier",
        displayName: "North Pier",
        municipality: "Sheboygan",
        disposition: "unresolved",
        accessStatus: "route_unverified",
        limitation:
          "Current navigation point, approach, and representation are unresolved.",
      },
      {
        structureId: "sheboygan_south_pier",
        displayName: "South Pier",
        municipality: "Sheboygan",
        disposition: "unresolved",
        accessStatus: "route_unverified",
        limitation:
          "Current navigation point, approach, and representation are unresolved.",
      },
    ],
    species: [
      coreSpecies("sheboygan_wi", "chinook_salmon", "candidate"),
      coreSpecies(
        "sheboygan_wi",
        "coho_salmon",
        "unresolved",
        "Species-specific local pier corroboration required.",
      ),
      coreSpecies("sheboygan_wi", "steelhead", "candidate"),
      coreSpecies("sheboygan_wi", "brown_trout", "candidate"),
      unresolved("lake_trout", "No adequate covered-pier evidence."),
      unresolved("walleye", "No adequate covered-pier evidence."),
      unresolved("smallmouth_bass", "No adequate covered-pier evidence."),
      unresolved("freshwater_drum", "No adequate covered-pier evidence."),
      unresolved("yellow_perch", "No adequate covered-pier evidence."),
      unresolved("lake_whitefish", "No adequate covered-pier evidence."),
      unresolved("round_whitefish", "No adequate covered-pier evidence."),
      unresolved("channel_catfish", "No adequate covered-pier evidence."),
      unresolved("largemouth_bass", "No adequate covered-pier evidence."),
    ],
  },
] as const;

export function getPierCastCityProfile(
  cityId: PierCastCityProfile["cityId"],
): PierCastCityProfile | null {
  return PIER_CAST_CITY_PROFILES.find((city) => city.cityId === cityId) ?? null;
}
