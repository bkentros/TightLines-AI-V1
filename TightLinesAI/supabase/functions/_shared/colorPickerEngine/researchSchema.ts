/** Research data only. Reviewed heuristics are not measured effectiveness or rankings. */
export const CLARITIES = ["clear", "stained", "dirty"] as const;
export const LIGHT_STATES = ["sunny", "cloudy"] as const;
export type Clarity = typeof CLARITIES[number];
export type LightState = typeof LIGHT_STATES[number];
export type CellKey = `${Clarity}_${LightState}`;
export const CELL_KEYS: readonly CellKey[] = [
  "clear_sunny", "clear_cloudy", "stained_sunny", "stained_cloudy", "dirty_sunny", "dirty_cloudy",
];

export interface ResearchSource {
  id: string;
  title: string;
  url: string;
  kind: "angler_guidance" | "manufacturer_guidance" | "product_catalog";
  accessedOn: string;
  consultedVia: "page" | "search_excerpt";
  supports: string;
  limitations: string;
}

export interface ColorPattern {
  id: string;
  name: string;
  aliases: string[];
  material: "soft_plastic" | "skirt_and_plastic" | "hair_feather" | "hard_finish" |
    "metal" | "mixed_blade" | "fly_fiber" | "fly_flash" | "fly_popper";
  opacity: "opaque" | "translucent" | "sparse_fiber";
  finish: "matte" | "satin" | "pearl" | "metallic" | "flake" | "mixed";
  flash: "none" | "subtle" | "strong";
  /** Common visual pattern, not an assertion of local prey or species response. */
  visualDescription: string;
  components: Record<string, string>;
  /** Context needed to draw a complete bait; excluded from recommended color identity. */
  illustrationHardware?: Record<string, string>;
  /** Human-facing illustration reference only; not a fish-vision model. */
  swatches: string[];
  sourceIds: string[];
  /** A recipe may be editorial even when its base palette is directly documented. */
  constructionBasis: "documented_palette" | "editorial_recipe";
}

export interface PoolResearchProfile {
  id: string;
  sourceIds: string[];
  principle: string;
  extension: string;
  /** Explicit authoring allowlists; no automatic trait/family inheritance. */
  cells: Record<CellKey, string[]>;
  lightPolicy: "documented_direction_editorial_application" | "retain_without_supported_exclusion";
  rationale: Record<CellKey, string>;
}

export interface BaitResearchBinding {
  typeId: string;
  profileId: string;
  /** Physical/color compatibility gate independent of the cell pool. */
  compatiblePatternIds: string[];
  constructionNotes: string;
  sourceIds: string[];
}

export interface ReviewedPool {
  typeId: string;
  clarity: Clarity;
  light: LightState;
  patternIds: string[];
  profileId: string;
  sourceIds: string[];
  rationale: string;
  reviewStatus: "reviewed_heuristic";
  evidenceBasis: "editorial_application_of_cited_guidance";
}
