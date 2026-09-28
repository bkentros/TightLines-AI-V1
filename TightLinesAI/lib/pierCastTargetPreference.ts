import AsyncStorage from "@react-native-async-storage/async-storage";

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
