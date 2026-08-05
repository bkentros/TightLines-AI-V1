const RIVER_RUN_SPECIES_IMAGES: Record<
  string,
  ReturnType<typeof require>
> = {
  chinook_salmon: require("../assets/images/fish/chinook_salmon.png"),
  coho_salmon: require("../assets/images/fish/coho_salmon.png"),
  steelhead: require("../assets/images/fish/steelhead.png"),
};

export function getRiverRunSpeciesImage(
  species: string | null | undefined,
): ReturnType<typeof require> | null {
  if (!species) return null;
  return RIVER_RUN_SPECIES_IMAGES[species] ?? null;
}
