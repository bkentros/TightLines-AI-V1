/**
 * colorPaletteImages.ts
 *
 * Maps ColorFamily values → one of three color-palette swatch images.
 *
 * Images live in: assets/images/colorpalette/
 *   natural.png  — olive / tan / brown (match-the-hatch, earthy tones)
 *   bright.png   — pink / chartreuse / orange (reaction / flash colors)
 *   dark.png     — purple / charcoal / navy (silhouette / depth colors)
 */

// NOTE: `ColorFamily` used to live on `recommenderContracts.ts` but the
// rebuild engine collapsed it into a free-form `color_style: string` on
// RankedRecommendation. We keep the map here as a typed lookup so callers
// that still classify output into palette swatches keep a stable interface,
// even though the app currently only uses `ALL_COLOR_PALETTE_IMAGES` for
// preloading. If a future caller needs the palette, they can pass any of
// the keys below.
export type ColorFamily =
  | 'natural_match'
  | 'shad_silver'
  | 'craw_pattern'
  | 'shrimp_tan'
  | 'crab_olive'
  | 'gold_amber'
  | 'chartreuse_white'
  | 'flash_heavy'
  | 'dark_silhouette';

type PaletteKey = 'natural' | 'bright' | 'dark';

const PALETTE_IMAGES: Record<PaletteKey, ReturnType<typeof require>> = {
  natural: require('../assets/images/colorpalette/natural.png'),
  bright:  require('../assets/images/colorpalette/bright.png'),
  dark:    require('../assets/images/colorpalette/dark.png'),
};

const COLOR_FAMILY_TO_PALETTE: Record<ColorFamily, PaletteKey> = {
  natural_match:    'natural',
  shad_silver:      'natural',
  craw_pattern:     'natural',
  shrimp_tan:       'natural',
  crab_olive:       'natural',
  gold_amber:       'natural',
  chartreuse_white: 'bright',
  flash_heavy:      'bright',
  dark_silhouette:  'dark',
};

/** Returns the palette swatch image for a given color family. */
export function getColorPaletteImage(
  colorFamily: ColorFamily,
): ReturnType<typeof require> {
  const key = COLOR_FAMILY_TO_PALETTE[colorFamily] ?? 'natural';
  return PALETTE_IMAGES[key];
}

/** All three palette images as an array for bulk preloading. */
export const ALL_COLOR_PALETTE_IMAGES = Object.values(PALETTE_IMAGES);
