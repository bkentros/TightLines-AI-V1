export type RiverRunRiverSize = "small" | "medium" | "large";

const RIVER_SIZE_IMAGES: Record<
  RiverRunRiverSize,
  ReturnType<typeof require>
> = {
  small: require("../assets/images/river-run/river_small.png"),
  medium: require("../assets/images/river-run/river_medium.png"),
  large: require("../assets/images/river-run/river_large.png"),
};

const RIVER_SIZE_BY_ID: Record<string, RiverRunRiverSize> = {
  pere_marquette: "medium",
  betsie: "small",
  white: "medium",
  big_manistee: "large",
  muskegon: "large",
  st_joseph: "large",
  grand: "large",
  platte: "large",
  au_sable: "large",
};

export function getRiverRunRiverSize(
  riverId: string | null | undefined,
): RiverRunRiverSize | null {
  if (!riverId) return null;
  return RIVER_SIZE_BY_ID[riverId] ?? null;
}

export function getRiverRunRiverImage(
  riverId: string | null | undefined,
): ReturnType<typeof require> | null {
  const size = getRiverRunRiverSize(riverId);
  return size ? RIVER_SIZE_IMAGES[size] : null;
}
