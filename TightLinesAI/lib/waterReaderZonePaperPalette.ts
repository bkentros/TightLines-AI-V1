/**
 * FinFindr Water Read feature palette.
 *
 * Mirrors the keys of `WATER_READER_FEATURE_COLORS` in the Supabase shared
 * engine, but repaints them into the dashboard-era FinFindr map language:
 * pale blue water, quiet land, and high-signal structure zones that stay
 * easy to tell apart on small mobile screens.
 *
 * Each feature has two values:
 *   • `PAPER_WARM_FEATURE_COLORS[key]` — the **base** color, used for the
 *     zone fill and the legend swatch background.
 *   • `PAPER_WARM_FEATURE_MOTIF_COLORS[key]` — the **motif** color used to
 *     stamp a pattern (dots / waves / hatch / rings / …) on top of the
 *     base in `water-reader-paperify-svg`. Always a darker/more-saturated
 *     cousin of the base so the pattern reads as ink-on-color rather than
 *     competing with it.
 */

export type PaperWarmFeatureKey =
  | 'main_lake_point'
  | 'secondary_point'
  | 'cove'
  | 'neck'
  | 'island'
  | 'saddle'
  | 'dam'
  | 'structure_confluence'
  | 'universal';

export const PAPER_WARM_FEATURE_COLORS: Record<PaperWarmFeatureKey, string> = {
  // Pass-6: main_lake_point shifted from pink (#FF4FA3) to forest green
  // to dial back the pink/purple bias of the palette (was point + island
  // + confluence all in the magenta family). Green also reads naturally
  // as "land jutting into water", strengthening the visual metaphor.
  main_lake_point: '#1FA85C',
  secondary_point: '#B9F24D',
  cove: '#28C8FF',
  neck: '#FFD53D',
  island: '#9B5CFF',
  saddle: '#FF8A2A',
  dam: '#FF5A4F',
  structure_confluence: '#E04CFF',
  universal: '#42E89D',
} as const;

/**
 * Motif color — the darker / desaturated companion that draws the pattern
 * stamp on top of each base color. Tuned so the motif reads as ~25–35%
 * darker than the base, with enough hue continuity that it still feels
 * "of the same family" rather than a foreign ink.
 */
export const PAPER_WARM_FEATURE_MOTIF_COLORS: Record<PaperWarmFeatureKey, string> = {
  main_lake_point: '#0F5430',
  secondary_point: '#4E7A1A',
  cove: '#0B6FA1',
  neck: '#8C6A0B',
  island: '#4E2C8E',
  saddle: '#8C3F0B',
  dam: '#7A1A12',
  structure_confluence: '#7A1E92',
  universal: '#1E7A52',
} as const;

export function paperWarmColorForFeature(key: string | undefined): string {
  if (!key) return '#0A1B2E';
  return (
    PAPER_WARM_FEATURE_COLORS[key as PaperWarmFeatureKey] ?? '#0A1B2E'
  );
}

export function paperWarmMotifColorForFeature(key: string | undefined): string {
  if (!key) return 'rgba(28,36,25,0.55)';
  return (
    PAPER_WARM_FEATURE_MOTIF_COLORS[key as PaperWarmFeatureKey] ??
    'rgba(28,36,25,0.55)'
  );
}
