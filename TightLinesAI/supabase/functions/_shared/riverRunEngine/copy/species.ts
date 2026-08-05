import type { RiverRunSpecies } from "../types.ts";

export function anglerSpeciesName(species: RiverRunSpecies): string {
  switch (species) {
    case "chinook_salmon":
      return "Chinook salmon";
    case "coho_salmon":
      return "Coho salmon";
    case "steelhead":
      return "Steelhead";
    case "skamania":
      return "Skamania steelhead";
    case "lake_run_brown_trout":
      return "migratory brown trout";
    case "atlantic_salmon":
      return "Atlantic salmon";
  }
}
