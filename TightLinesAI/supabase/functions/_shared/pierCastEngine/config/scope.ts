import type { PierCastCityId, PierCastSpeciesId } from "../types.ts";

/**
 * PierCast v1 launch scope. Expansion requires a deliberate versioned change;
 * discovery/research records outside this set cannot become covered product
 * scope by being added to a city profile.
 */
export const PIER_CAST_SCOPE_VERSION = "piercast-five-city-four-species-v1";

export const PIER_CAST_FROZEN_CITY_IDS = [
  "ludington_mi",
  "grand_haven_mi",
  "manistee_mi",
  "frankfort_elberta_mi",
  "sheboygan_wi",
] as const satisfies readonly PierCastCityId[];

export const PIER_CAST_FROZEN_SPECIES_IDS = [
  "chinook_salmon",
  "coho_salmon",
  "steelhead",
  "brown_trout",
] as const satisfies readonly PierCastSpeciesId[];

export const PIER_CAST_FROZEN_COVERED_STRUCTURE_IDS = [
  "ludington_north_breakwater",
  "grand_haven_south_pier",
  "manistee_north_pier",
  "frankfort_north_breakwater",
  "elberta_south_breakwater",
  "sheboygan_north_pier",
  "sheboygan_south_pier",
] as const;
