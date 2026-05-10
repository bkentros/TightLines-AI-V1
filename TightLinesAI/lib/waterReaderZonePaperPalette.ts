/**
 * FinFindr Water Read feature palette.
 *
 * Mirrors the keys of `WATER_READER_FEATURE_COLORS` in the Supabase shared
 * engine, but repaints them into the dashboard-era FinFindr map language:
 * pale blue water, quiet land, and high-signal structure zones that stay
 * easy to tell apart on small mobile screens.
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
  main_lake_point: '#FF4FA3',
  secondary_point: '#B9F24D',
  cove: '#28C8FF',
  neck: '#FFD53D',
  island: '#9B5CFF',
  saddle: '#FF8A2A',
  dam: '#FF5A4F',
  structure_confluence: '#E04CFF',
  universal: '#42E89D',
} as const;

export function paperWarmColorForFeature(key: string | undefined): string {
  if (!key) return '#0A1B2E';
  return (
    PAPER_WARM_FEATURE_COLORS[key as PaperWarmFeatureKey] ?? '#0A1B2E'
  );
}
