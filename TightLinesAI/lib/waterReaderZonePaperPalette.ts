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
  // Bumped one step brighter than the conservative paper-warm vocabulary —
  // each hue keeps its paper-family identity but gains 10–15% chroma /
  // luminosity so zones pop against the new mint-gradient water and the
  // tan island land color. The whole map now reads as a vibrant printed
  // plate rather than a desaturated vintage scan.
  main_lake_point: '#366D33',      // brighter forest (was #2E4A2A)
  secondary_point: '#8FB85B',      // brighter sage-moss (was #7C9D4F)
  cove: '#D4922A',                 // brighter goldDk-bronze (was #C68522)
  neck: '#DD7430',                 // brighter rust (was #CC6A22)
  island: '#5A4030',               // lighter walnut so islands read clearly (was #3A2E22)
  saddle: '#4DAA9C',               // brighter, more chromatic teal (was #3F8B80)
  dam: '#D74033',                  // brighter red (was #C8352C)
  structure_confluence: '#A04970', // brighter plum (was #8C3F60)
  universal: '#F2AC34',            // brighter gold (was #E8A02E)
} as const;

export function paperWarmColorForFeature(key: string | undefined): string {
  if (!key) return '#3A2E22';
  return (
    PAPER_WARM_FEATURE_COLORS[key as PaperWarmFeatureKey] ?? '#3A2E22'
  );
}
