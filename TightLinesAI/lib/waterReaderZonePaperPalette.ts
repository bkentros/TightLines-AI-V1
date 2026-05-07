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
  // Main features → forest / moss spine. Anchor of the system; we keep
  // forest pure but bump moss with more chroma so the two greens read as
  // distinct hues against the new mint-gradient lake fill.
  main_lake_point: '#2E4A2A',     // paper.forest (anchor)
  secondary_point: '#7C9D4F',     // brighter sage-moss (was #5B7A3E)
  // Coves carry warm gold. Bumped a touch toward the bronze side so they
  // don't read as the same hue as the FAIR-tier gold pill elsewhere.
  cove: '#C68522',                // brighter goldDk (was #B87818)
  // Necks/pinches → rust. Already vibrant against paper; left alone.
  neck: '#CC6A22',                // paper.rust
  // Islands → walnut. Visual weight feature; stays anchored.
  island: '#3A2E22',              // paper.walnut
  // Saddles → warmer teal with more chroma so cool features still
  // legibly read as "cool" against the warm zone palette around them.
  saddle: '#3F8B80',              // brighter teal (was #357A6F)
  // Dam corners → red. Mirrors the SKIP / accent treatment.
  dam: '#C8352C',                 // paper.red
  // Confluence → richer plum so overlap groups pop against single-zone
  // rows in the legend without crossing into screaming-magenta territory.
  structure_confluence: '#8C3F60', // richer plum (was #7A3A52)
  // Universal pond fallback → the same gold pivot the rest of the app uses.
  universal: '#E8A02E',           // paper.gold
} as const;

export function paperWarmColorForFeature(key: string | undefined): string {
  if (!key) return '#3A2E22';
  return (
    PAPER_WARM_FEATURE_COLORS[key as PaperWarmFeatureKey] ?? '#3A2E22'
  );
}
