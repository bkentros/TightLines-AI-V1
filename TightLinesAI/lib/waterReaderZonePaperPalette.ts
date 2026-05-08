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
  // Pass-4 — pushed another step brighter so zones POP at first glance.
  // The earlier "paper-warm" palette was reading as desaturated and
  // vintage; these values still keep their paper-family identity but
  // lean noticeably toward field-guide vibrancy. Each hue is now clearly
  // distinguishable from its neighbors at thumbnail scale, on both the
  // map polygons and the legend swatches.
  main_lake_point: '#4A8A45',      // vivid forest-green (was #366D33)
  secondary_point: '#A8D26B',      // bright moss-lime (was #8FB85B)
  cove: '#E89E2C',                 // bright honey-bronze (was #D4922A)
  neck: '#ED7F33',                 // bright rust-orange (was #DD7430)
  island: '#7A5840',               // lighter, warmer walnut (was #5A4030)
  saddle: '#5BC4B5',               // bright teal (was #4DAA9C)
  dam: '#E84733',                  // brighter alarm red (was #D74033)
  structure_confluence: '#BA5582', // bright plum-magenta (was #A04970)
  universal: '#F5BA48',            // brighter gold (was #F2AC34)
} as const;

export function paperWarmColorForFeature(key: string | undefined): string {
  if (!key) return '#3A2E22';
  return (
    PAPER_WARM_FEATURE_COLORS[key as PaperWarmFeatureKey] ?? '#3A2E22'
  );
}
