const RIVER_RUN_SPECIES_IMAGES: Record<
  string,
  ReturnType<typeof require>
> = {
  chinook_salmon: require("../assets/images/fish/chinook_salmon.png"),
  coho_salmon: require("../assets/images/fish/coho_salmon.png"),
  steelhead: require("../assets/images/fish/steelhead.png"),
  lake_run_brown_trout: require("../assets/images/fish/migratory_brown_trout.png"),
  atlantic_salmon: require("../assets/images/fish/atlantic_salmon.png"),
};

// These scales normalize the visible, non-transparent fish length inside the
// shared 128-point hero stage. The source PNG canvases use different aspect
// ratios and transparent padding, so one scale cannot produce equal artwork.
const RIVER_RUN_SPECIES_HERO_SCALE: Record<string, number> = {
  chinook_salmon: 2,
  coho_salmon: 2.04,
  steelhead: 1.51,
  lake_run_brown_trout: 1,
  atlantic_salmon: 1.5,
};

export function getRiverRunSpeciesImage(
  species: string | null | undefined,
): ReturnType<typeof require> | null {
  if (!species) return null;
  return RIVER_RUN_SPECIES_IMAGES[species] ?? null;
}

export function getRiverRunSpeciesHeroScale(
  species: string | null | undefined,
): number {
  if (!species) return 1;
  return RIVER_RUN_SPECIES_HERO_SCALE[species] ?? 1;
}
