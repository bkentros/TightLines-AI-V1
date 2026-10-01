import AsyncStorage from "@react-native-async-storage/async-storage";

import type { PierCastGreatLakeIdV4 } from "./pierCastConditionsV4";
import type { PierCastSpeciesId } from "./pierCastContracts";

export const PIER_CAST_TARGET_PREFERENCE_KEY =
  "tightlines_pier_cast_target_species_v1";

const PIER_CAST_SPECIES_IDS = new Set<PierCastSpeciesId>([
  "chinook_salmon",
  "coho_salmon",
  "steelhead",
  "brown_trout",
  "lake_trout",
  "walleye",
  "smallmouth_bass",
  "freshwater_drum",
  "yellow_perch",
  "lake_whitefish",
  "round_whitefish",
  "channel_catfish",
  "largemouth_bass",
  "atlantic_salmon",
  "northern_pike",
  "burbot",
  "white_perch",
  "white_bass",
]);

export function parsePierCastTargetSpecies(
  value: unknown,
): PierCastSpeciesId | null {
  return typeof value === "string" &&
      PIER_CAST_SPECIES_IDS.has(value as PierCastSpeciesId)
    ? value as PierCastSpeciesId
    : null;
}

export async function readPierCastTargetPreference(): Promise<
  PierCastSpeciesId | null
> {
  try {
    return parsePierCastTargetSpecies(
      await AsyncStorage.getItem(PIER_CAST_TARGET_PREFERENCE_KEY),
    );
  } catch {
    return null;
  }
}

export async function writePierCastTargetPreference(
  speciesId: PierCastSpeciesId,
): Promise<void> {
  try {
    await AsyncStorage.setItem(PIER_CAST_TARGET_PREFERENCE_KEY, speciesId);
  } catch {
    // A remembered target is a convenience, never a requirement for PierCast.
  }
}

export const PIER_CAST_LAKE_FILTER_KEY = "tightlines_pier_cast_lake_filter_v1";
export const PIER_CAST_CITY_LAKES_KEY = "tightlines_pier_cast_city_lakes_v1";

const PIER_CAST_LAKE_IDS = new Set<PierCastGreatLakeIdV4>([
  "superior",
  "michigan",
  "huron",
  "erie",
  "ontario",
]);

/** Remembered Standings lake filter ("all" or a Great Lake id). */
export async function readPierCastLakeFilter(): Promise<
  "all" | PierCastGreatLakeIdV4
> {
  try {
    const value = await AsyncStorage.getItem(PIER_CAST_LAKE_FILTER_KEY);
    return value && PIER_CAST_LAKE_IDS.has(value as PierCastGreatLakeIdV4)
      ? value as PierCastGreatLakeIdV4
      : "all";
  } catch {
    return "all";
  }
}

export async function writePierCastLakeFilter(
  lake: "all" | PierCastGreatLakeIdV4,
): Promise<void> {
  try {
    await AsyncStorage.setItem(PIER_CAST_LAKE_FILTER_KEY, lake);
  } catch {
    // Convenience only.
  }
}

/**
 * City → lake lookup learned from leaderboard rows. The catalog does not carry
 * a lake, so Find your PierCast uses this cache to group cities by lake.
 */
export async function readPierCastCityLakes(): Promise<
  Record<string, PierCastGreatLakeIdV4>
> {
  try {
    const raw = await AsyncStorage.getItem(PIER_CAST_CITY_LAKES_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    const lakes: Record<string, PierCastGreatLakeIdV4> = {};
    for (const [cityId, lakeId] of Object.entries(parsed as Record<string, unknown>)) {
      if (
        typeof lakeId === "string" &&
        PIER_CAST_LAKE_IDS.has(lakeId as PierCastGreatLakeIdV4)
      ) {
        lakes[cityId] = lakeId as PierCastGreatLakeIdV4;
      }
    }
    return lakes;
  } catch {
    return {};
  }
}

export async function writePierCastCityLakes(
  lakes: Record<string, PierCastGreatLakeIdV4>,
): Promise<void> {
  try {
    await AsyncStorage.setItem(PIER_CAST_CITY_LAKES_KEY, JSON.stringify(lakes));
  } catch {
    // Convenience only.
  }
}
