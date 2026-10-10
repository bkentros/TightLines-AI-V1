import type { PierCastSpeciesId } from "./pierCastContracts";

/**
 * Pixel bounds of the visible fish inside each species PNG (alpha > 16),
 * measured from `assets/images/fish/*`. The artwork carries uneven
 * transparent padding, and deep-bodied fish (drum, perch, bluegill) are much
 * taller than salmonids, so cropping every image to one fixed ratio clips
 * fins. `PierCastFishCrop` uses these bounds to fit the whole fish exactly.
 * Re-measure if an image in `pierCastSpeciesImages.ts` changes.
 */
export type PierCastSpeciesImageBounds = Readonly<{
  imageWidth: number;
  imageHeight: number;
  left: number;
  top: number;
  right: number;
  bottom: number;
}>;

export const PIER_CAST_SPECIES_IMAGE_BOUNDS: Record<
  PierCastSpeciesId,
  PierCastSpeciesImageBounds
> = {
  chinook_salmon: { imageWidth: 1254, imageHeight: 1254, left: 20, top: 357, right: 1241, bottom: 821 },
  coho_salmon: { imageWidth: 1254, imageHeight: 1254, left: 27, top: 336, right: 1219, bottom: 871 },
  steelhead: { imageWidth: 1448, imageHeight: 1086, left: 25, top: 293, right: 1421, bottom: 801 },
  brown_trout: { imageWidth: 1774, imageHeight: 887, left: 32, top: 105, right: 1753, bottom: 789 },
  lake_trout: { imageWidth: 1254, imageHeight: 1254, left: 17, top: 330, right: 1244, bottom: 875 },
  walleye: { imageWidth: 1254, imageHeight: 1254, left: 12, top: 365, right: 1240, bottom: 888 },
  smallmouth_bass: { imageWidth: 1024, imageHeight: 1024, left: 24, top: 270, right: 1007, bottom: 696 },
  freshwater_drum: { imageWidth: 1254, imageHeight: 1254, left: 11, top: 248, right: 1244, bottom: 1010 },
  yellow_perch: { imageWidth: 1254, imageHeight: 1254, left: 11, top: 272, right: 1242, bottom: 945 },
  lake_whitefish: { imageWidth: 1254, imageHeight: 1254, left: 16, top: 296, right: 1240, bottom: 908 },
  round_whitefish: { imageWidth: 1254, imageHeight: 1254, left: 21, top: 327, right: 1236, bottom: 893 },
  channel_catfish: { imageWidth: 1254, imageHeight: 1254, left: 12, top: 333, right: 1243, bottom: 858 },
  largemouth_bass: { imageWidth: 1024, imageHeight: 1024, left: 11, top: 284, right: 1009, bottom: 701 },
  atlantic_salmon: { imageWidth: 1448, imageHeight: 1086, left: 21, top: 280, right: 1428, bottom: 777 },
  northern_pike: { imageWidth: 2056, imageHeight: 765, left: 45, top: 109, right: 2018, bottom: 656 },
  burbot: { imageWidth: 1254, imageHeight: 1254, left: 21, top: 466, right: 1233, bottom: 825 },
  white_perch: { imageWidth: 1254, imageHeight: 1254, left: 33, top: 296, right: 1235, bottom: 948 },
  white_bass: { imageWidth: 1254, imageHeight: 1254, left: 39, top: 331, right: 1227, bottom: 923 },
  bluegill: { imageWidth: 1254, imageHeight: 1254, left: 52, top: 233, right: 1218, bottom: 1018 },
};
