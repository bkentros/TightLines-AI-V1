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

/** Daily recommender theme — authoritative value comes from `scenario_summary.color_palette_theme`. */
export type PaletteThemeKey = 'natural' | 'bright' | 'dark';

type PaletteKey = PaletteThemeKey;

const PALETTE_IMAGES: Record<PaletteKey, ReturnType<typeof require>> = {
  natural: require('../assets/images/colorpalette/natural.png'),
  bright:  require('../assets/images/colorpalette/bright.png'),
  dark:    require('../assets/images/colorpalette/dark.png'),
};

const COLOR_FAMILY_TO_PALETTE: Record<ColorFamily, PaletteKey> = {
  natural_match:      'natural',
  shad_silver:        'natural',
  craw_pattern:       'natural',
  shrimp_tan:         'natural',
  crab_olive:         'natural',
  gold_amber:         'natural',
  chartreuse_white:   'bright',
  flash_heavy:        'bright',
  dark_silhouette:    'dark',
};

/** Decorative paint chips for the daily theme strip (pairs with swatch artwork). */
export const PALETTE_THEME_SWATCHES: Record<PaletteThemeKey, readonly string[]> = {
  natural: ['#3D4F35', '#8B6914', '#A8987A'],
  bright: ['#E11D48', '#BEE600', '#EA580C'],
  dark: ['#0B1220', '#4C1D95', '#1E293B'],
};

const PALETTE_THEME_COPY: Record<
  PaletteThemeKey,
  { title: string; subtitle: string; rubric: string }
> = {
  natural: {
    title: 'Natural palette',
    subtitle:
      'Green pumpkin, shad, craw, and earth tones — let finish and profile do the work in clearer water.',
    rubric: 'MATCH · SUBTLE FLASH',
  },
  bright: {
    title: 'Bright reaction palette',
    subtitle:
      'Chartreuse, white, hot pink, and orange — cut through stain, mud, and low visibility.',
    rubric: 'CONTRAST · PUNCH',
  },
  dark: {
    title: 'Dark silhouette palette',
    subtitle:
      'Black, purple, and midnight blue — strong profiles when light is thin or fish are looking up.',
    rubric: 'SILHOUETTE · DEPTH',
  },
};

/** Short editorial labels for the recommender "color of the day" card. */
export function paletteThemeCopy(theme: PaletteThemeKey): {
  title: string;
  subtitle: string;
  rubric: string;
} {
  return PALETTE_THEME_COPY[theme];
}

/** Swatch plate image for the three presentation themes. */
export function getPaletteThemeImage(
  theme: PaletteThemeKey,
): ReturnType<typeof require> {
  return PALETTE_IMAGES[theme] ?? PALETTE_IMAGES.natural;
}

/** Returns the palette swatch image for a given color family. */
export function getColorPaletteImage(
  colorFamily: ColorFamily,
): ReturnType<typeof require> {
  const key = COLOR_FAMILY_TO_PALETTE[colorFamily] ?? 'natural';
  return PALETTE_IMAGES[key];
}

/** All three palette images as an array for bulk preloading. */
export const ALL_COLOR_PALETTE_IMAGES = Object.values(PALETTE_IMAGES);
