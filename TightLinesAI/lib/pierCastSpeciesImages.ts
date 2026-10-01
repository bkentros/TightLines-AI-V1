import type { PierCastSpeciesId } from "./pierCastContracts";

const PIER_CAST_SPECIES_IMAGES: Record<
  PierCastSpeciesId,
  ReturnType<typeof require>
> = {
  chinook_salmon: require("../assets/images/fish/chinook_salmon.png"),
  coho_salmon: require("../assets/images/fish/coho_salmon.png"),
  steelhead: require("../assets/images/fish/steelhead.png"),
  brown_trout: require("../assets/images/fish/migratory_brown_trout.png"),
  lake_trout: require("../assets/images/fish/lake_trout.png"),
  walleye: require("../assets/images/fish/walleye.png"),
  smallmouth_bass: require("../assets/images/fish/smallmouth_bass.png"),
  freshwater_drum: require("../assets/images/fish/freshwater_drum.png"),
  yellow_perch: require("../assets/images/fish/yellow_perch.png"),
  lake_whitefish: require("../assets/images/fish/lake_whitefish.png"),
  round_whitefish: require("../assets/images/fish/round_whitefish.png"),
  channel_catfish: require("../assets/images/fish/channel_catfish.png"),
  largemouth_bass: require("../assets/images/fish/largemouth_bass.png"),
  atlantic_salmon: require("../assets/images/fish/atlantic_salmon.png"),
  northern_pike: require("../assets/images/fish/northern_pike.png"),
  burbot: require("../assets/images/fish/burbot.png"),
  white_perch: require("../assets/images/fish/white_perch.png"),
  white_bass: require("../assets/images/fish/white_bass.png"),
  bluegill: require("../assets/images/fish/bluegill.png"),
};

export function getPierCastSpeciesImage(
  speciesId: PierCastSpeciesId,
): ReturnType<typeof require> {
  return PIER_CAST_SPECIES_IMAGES[speciesId];
}
