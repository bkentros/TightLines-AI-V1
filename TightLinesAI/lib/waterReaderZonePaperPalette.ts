/**
 * Paper-warm Water Reader feature palette.
 *
 * Mirrors the keys of `WATER_READER_FEATURE_COLORS` in the supabase shared
 * engine (`supabase/functions/_shared/waterReaderEngine/legend.ts`), but the
 * hex values are warmed and desaturated to live alongside the FinFindr paper
 * canvas. Both this module and the engine's color constant must stay in
 * lock-step — when one changes, change the other and bump
 * `WATER_READER_ENGINE_VERSION` so cached SVG rows regenerate.
 *
 * Used by:
 *  - `lib/water-reader-paperify-svg.ts` (client-side fallback recolor for
 *    cached pre-bump rows).
 *  - `components/water-reader/WaterReaderLegend.tsx` (paper number swatches).
 *
 * Why warm-paper instead of the spec hues:
 *  The engine's launch palette (#1E5FBF main point, #2E8B57 cove, #D946EF
 *  confluence, etc.) was tuned against a near-white SVG backdrop. On the
 *  warm paper canvas (#E8DFC9 paper / #F0E8D4 paperLight) those hues read
 *  as too saturated and break the editorial register every other surface
 *  (Home, How's Fishing, Recommender) lives in. The FinFindr-family swap
 *  below keeps the original color *meaning* (each feature class still has
 *  its own deterministic, glance-recognizable hue) but anchors them in the
 *  paper/ink/forest/gold/walnut/red/moss vocabulary that exists in
 *  `lib/theme.ts::paper.*`.
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
  // Main features → forest / moss spine.
  main_lake_point: '#2E4A2A', // paper.forest — anchor of the system.
  secondary_point: '#5B7A3E', // paper.moss — softer companion to forest.
  // Coves carry the warm gold (the same hue used for "FAIR" tier elsewhere).
  cove: '#B87818', // paper.goldDk — readable on paperLight without screaming.
  // Necks/pinches → rust, the warm orange that already lives in paper.
  neck: '#CC6A22', // paper.rust.
  // Islands → walnut, the warm dark brown for visually heavier features.
  island: '#3A2E22', // paper.walnut.
  // Saddles → warmer teal that reads as "cool but still in the paper family".
  saddle: '#357A6F',
  // Dam corners → red, mirrors the SKIP / accent treatment.
  dam: '#C8352C', // paper.red.
  // Confluence → muted magenta-walnut so overlap groups still pop without
  // resorting to the screaming #D946EF magenta.
  structure_confluence: '#7A3A52',
  // Universal pond fallback → the same gold pivot the rest of the app uses.
  universal: '#E8A02E', // paper.gold.
} as const;

export function paperWarmColorForFeature(key: string | undefined): string {
  if (!key) return '#3A2E22';
  return (
    PAPER_WARM_FEATURE_COLORS[key as PaperWarmFeatureKey] ?? '#3A2E22'
  );
}
