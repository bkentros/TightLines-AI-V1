/**
 * Future Water Reader **aerial-only** read result shapes (types only).
 *
 * Guardrails for implementers — not enforced at runtime here:
 * - No underwater structure or bathymetric claims unless a separately approved depth/bathymetry mode generates the result.
 * - No implication of exact fish location; zones are layout/geometry callouts, not proof of fish presence, structure, depth, cover, or access.
 * - Aerial-only V1 semantics: confidence is **never** `"high"`; use {@link WaterReaderAerialOnlyConfidence} only.
 * - Avoid depth vocabulary in {@link WaterReaderAerialZoneReasonCode} labels and parallel human-readable copy unless/until approved depth-mode results exist.
 *
 * Nothing in this file performs scoring, inference, fetching, caching, persistence, or export — engine TBD.
 */

/** Registry linkage for approved CONUS aerial path (mirror DB / policy semantics). Not an API URL. */
export const WR_REGISTRY_USGS_TNM_NAIP_PLUS = "usgs_tnm_naip_plus" as const;
/** National aerial policy row key (coverage CONUS-first per product policy). */
export const WR_POLICY_USGS_TNM_NAIP_PLUS_NATIONAL = "usgs_tnm_naip_plus_national" as const;

/** Wire / doc version for `WaterReaderAerialOnlyReadResult` (bump when fields change). */
export const WR_AERIAL_ONLY_RESULT_CONTRACT_ID = "water_reader_aerial_only_result_v0" as const;

/**
 * Resolved result source mode — distinct from unresolved search `WaterReaderSourceMode`.
 * `'aerial_only'` means this payload was produced strictly under aerial ortho + waterbody geometry rules.
 */
export type WaterReaderAerialOnlyResultSourceMode = "aerial_only";

/**
 * Aerial-only Water Reader never exposes `"high"` confidence for the overall read (per master plan).
 * Use `"moderate"` where older copy said “medium.”
 */
export type WaterReaderAerialOnlyConfidence = "low" | "moderate";

/**
 * Per-zone confidence under the same aerial-only ceiling (no `"high"`).
 */
export type WaterReaderAerialZoneConfidence = WaterReaderAerialOnlyConfidence;

/**
 * Conservative reason codes: labels for UI/engine routing only. They do **not** prove fish presence, underwater
 * structure, depth, cover, productivity, inlet/outlet behavior, or safe/legal access.
 */
export type WaterReaderAerialZoneReasonCode =
  | "waterbody_geometry_context"
  | "shoreline_area_geometry_context"
  | "map_region_callout"
  | "visible_boundary_context_uncertain"
  | "operator_review_placeholder";

/**
 * Normalized planar coordinates over the rendered **whole-waterbody map** viewport (preview/world map image).
 * Units are fractions [0..1] of overlay width and height — not WGS84, not raster pixels until a renderer resolves scale.
 */
export interface WaterReaderNormalizedPlanarOverlayRect01 {
  readonly coordinateKind: "normalized_planar_whole_waterbody_overlay_01";
  /** Left edge fraction (0–1 inclusive). */
  x: number;
  /** Top edge fraction (0–1 inclusive). */
  y: number;
  /** Width fraction (0–1 inclusive). */
  w: number;
  /** Height fraction (0–1 inclusive). */
  h: number;
}

/**
 * Cues versus what this aerial-only payload explicitly did **not** use. Values are stubs until an approved engine
 * populates them; callers must treat unknown/unset as “not demonstrated here.”
 */
export interface WaterReaderAerialZoneEvidence {
  /**
   * True only when polygon/waterbody layout from approved geometry legitimately anchored the zone (future engine).
   * Until populated by an engine, omit or supply `false` as appropriate — do **not** imply analysis ran in-contract v0.
   */
  geometryBackedCue: boolean;
  /**
   * Reserved for a future approved engine that could mark orthophoto-derived hypotheses. **Contract v0:** always
   * `false` — this field stays unpopulated (no implication that inference ran).
   */
  visibleImageryHypothesisUsed: false;
  /** Structural constant for aerial-only: depth products were not used in producing this zone. */
  depthEvidenceUsed: false;
  /** Structural constant for aerial-only: bathymetry was not used. */
  bathymetryEvidenceUsed: false;
}

export interface WaterReaderAerialReadZoneSummary {
  /** Stable id for UI keys (UUID or engine string). */
  id: string;
  /** Short label for map legend (not a fish location claim). */
  label: string;
  /** Where to draw on the whole-map renderer (normalized overlay space). */
  overlayRect: WaterReaderNormalizedPlanarOverlayRect01;
  reasonCode: WaterReaderAerialZoneReasonCode;
  /** Plain-language wording; must remain consistent with reasonCode conservatism. */
  humanExplanation: string;
  confidence: WaterReaderAerialZoneConfidence;
  evidence: WaterReaderAerialZoneEvidence;
}

/**
 * Exactly three, four, or five zone summaries per aerial-only read envelope.
 */
export type WaterReaderAerialReadZones3To5 =
  | readonly [WaterReaderAerialReadZoneSummary, WaterReaderAerialReadZoneSummary, WaterReaderAerialReadZoneSummary]
  | readonly [WaterReaderAerialReadZoneSummary, WaterReaderAerialReadZoneSummary, WaterReaderAerialReadZoneSummary, WaterReaderAerialReadZoneSummary]
  | readonly [
      WaterReaderAerialReadZoneSummary,
      WaterReaderAerialReadZoneSummary,
      WaterReaderAerialReadZoneSummary,
      WaterReaderAerialReadZoneSummary,
      WaterReaderAerialReadZoneSummary,
    ];

export interface WaterReaderAerialResultWaterbodyIdentity {
  lakeId: string;
  name: string;
  state: string;
  county?: string | null;
  /** Must align with backbone waterbody taxonomy. */
  waterbodyType: "lake" | "pond" | "reservoir";
}

/**
 * Attribution string must satisfy provider obligations — typically TNM NAIP Plus language from imagery path parity.
 */
export interface WaterReaderAerialImageryPolicyRef {
  sourceRegistryId: typeof WR_REGISTRY_USGS_TNM_NAIP_PLUS;
  aerialPolicyKey: typeof WR_POLICY_USGS_TNM_NAIP_PLUS_NATIONAL;
}

/** Client / pipeline bookkeeping; omit or stub until engine fills. */
export interface WaterReaderAerialResultGenerationMeta {
  /** ISO 8601 when the hypothetical engine assembled the payload. */
  generatedAt: string;
  /** Optional immutable contract id for versioning wire payloads from this repo. */
  contractId: typeof WR_AERIAL_ONLY_RESULT_CONTRACT_ID;
}

/** Non-engine placeholder — future engine swaps for real stamping. */
export type WaterReaderAerialEngineStub = "pending_engine_impl";

/** Top-level aerial-only Water Reader outcome (future edge → app). */
export interface WaterReaderAerialOnlyReadResult extends WaterReaderAerialResultGenerationMeta {
  waterbody: WaterReaderAerialResultWaterbodyIdentity;
  sourceMode: WaterReaderAerialOnlyResultSourceMode;
  imagerySource: WaterReaderAerialImageryPolicyRef;
  /** Full attribution line(s) owed to imagery policy (UI surfaces verbatim elsewhere today). */
  attribution: string;
  /** Highest-level confidence bound for entire read (`high` forbidden). */
  overallConfidence: WaterReaderAerialOnlyConfidence;
  /**
   * Human-honest limitations; must explicitly state no depth charts, bathymetry, or contour layers were used in this read.
   */
  limitations: readonly string[];
  /**
   * Exactly 3–5 starting-area summaries; not exact fish-coordinate claims ({@link WaterReaderAerialReadZones3To5}).
   */
  zones: WaterReaderAerialReadZones3To5;
  /**
   * Tracks generator until production engine exists — keep `prototype`/`stub` truthful in UI footers when present.
   */
  enginePlaceholder?: WaterReaderAerialEngineStub;
}
