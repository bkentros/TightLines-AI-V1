/**
 * Phase A deterministic aerial V1 primitives (geometry extraction **not** implemented here).
 * See `docs/WATER_READER_MASTER_PLAN.md` §0.5.22–§0.5.23. No imagery fetch, no Supabase, no depth inference.
 */

import type {
  AerialTilePlan,
  WaterbodyPreviewBbox,
  WaterbodyAerialGeometryCandidateRow,
} from './waterReaderContracts';
import type { AerialReadTilePlan } from './waterReaderAerialTilePlan';
import {
  WR_AERIAL_ONLY_RESULT_CONTRACT_ID,
  WR_POLICY_USGS_TNM_NAIP_PLUS_NATIONAL,
  WR_REGISTRY_USGS_TNM_NAIP_PLUS,
  type WaterReaderAerialOnlyConfidence,
  type WaterReaderAerialOnlyReadResult,
  type WaterReaderAerialReadZones3To5,
  type WaterReaderAerialReadZoneSummary,
  type WaterReaderAerialResultWaterbodyIdentity,
  type WaterReaderAerialZoneConfidence,
  type WaterReaderAerialZoneEvidence,
  type WaterReaderAerialZoneReasonCode,
  type WaterReaderNormalizedPlanarOverlayRect01,
} from './waterReaderResultContracts';
import { USGS_TNM_ATTRIBUTION } from './usgsTnmAerialSnapshot';

/** §0.5.23 example sketch — sums to 1.0 */
export const WR_AERIAL_FEATURE_WEIGHT_POINT = 0.18;
export const WR_AERIAL_FEATURE_WEIGHT_COVE = 0.22;
export const WR_AERIAL_FEATURE_WEIGHT_NECKDOWN = 0.2;
export const WR_AERIAL_FEATURE_WEIGHT_ISLAND_TURN = 0.18;
export const WR_AERIAL_FEATURE_WEIGHT_COMPLEXITY = 0.12;
export const WR_AERIAL_FEATURE_WEIGHT_OVERLAP_DISTRIBUTION = 0.1;

/**
 * RPC `plan_waterbody_aerial_geometry_candidates` overlays can span large tile rectangles on the lake frame.
 * Client caps fractions so presentation stays compact (~10–14%) around normalized anchors (RPC rows unchanged).
 */
export const WR_GEOMETRY_RPC_GRID_OVERLAY_FRAC_CAP = 0.13;

/**
 * Coarse grid scoring stays below {@link WR_AERIAL_ZONE_MODERATE_MIN_FINAL} so zones remain conservative until richer detectors exist.
 */
export const WR_GEOMETRY_RPC_GRID_BASE_SCORE_CAP = 0.4;

/**
 * Names the current RPC-backed presentation path: **prototype** coarse polygon/grid windows only — not shoreline-sampled
 * point/cove/neckdown/island detection. Does not alter public contract types; use in comments/review only.
 */
export const WR_AERIAL_GEOMETRY_PIPELINE_COARSE_GRID = 'coarse_geometry_grid' as const;

/** §0.5.23 confidence mapping (calibrated floors — document when tuning). */
export const WR_AERIAL_ZONE_MODERATE_MIN_FINAL = 0.45;
export const WR_AERIAL_ZONE_MODERATE_REQUIRES_MONTH_M = 0.94;
export const WR_AERIAL_READ_MODERATE_MIN_MODERATE_ZONES = 3;
export const WR_AERIAL_READ_MODERATE_REQUIRES_MONTH_M = 0.96;

/** Diversity term (§0.5.23). */
export const WR_AERIAL_DIVERSITY_LAMBDA = 0.05;
/** Hard cap per neighbor for selection pairwise diversity (paired with bounded ramp below; avoids λ/(d+ε) divergence). */
export const WR_AERIAL_DIVERSITY_MAX_NEIGHBOR_PENALTY = WR_AERIAL_DIVERSITY_LAMBDA;
export const WR_AERIAL_DIVERSITY_EPSILON = 1e-6;
/** Normalized map plane: minimum centroid separation before accepting another zone (NMS sketch). */
export const WR_AERIAL_SEPARATION_THRESHOLD_NORMALIZED = 0.08;

/** Index 0 = January … index 11 = December (§0.5.23). */
export const WR_AERIAL_MONTH_MULTIPLIERS: readonly number[] = [
  0.88, 0.88, 0.9, 0.94, 0.98, 1.0, 1.0, 0.99, 0.98, 0.95, 0.9, 0.88,
];

export type WaterReaderAerialMonthConfidenceBias = 'winter_low' | 'transition_low' | 'standard';

export interface WaterReaderAerialMonthWeight {
  month: number;
  multiplier: number;
  confidenceBias: WaterReaderAerialMonthConfidenceBias;
}

/** Planned geometry feature hooks — detection TBD Phase A polygon work. */
export type WaterReaderAerialEngineFeatureTag =
  | 'point_protrusion'
  | 'cove_pocket'
  | 'neckdown_constriction'
  | 'island_inside_turn'
  | 'shoreline_complexity'
  | 'coverage_distribution'
  /** Bbox/tile-plan anchor only — not polygon shoreline detection (§0.5.23 proxy path). */
  | 'tile_bbox_proxy_anchor';

export interface WaterReaderAerialNormalizedPoint01 {
  x: number;
  y: number;
}

/** Engine wiring provenance — drives contract `geometryBackedCue` and proxy limitation stamping. */
export type WaterReaderAerialCandidateSource = 'geometry_candidate' | 'tile_plan_proxy';

/** Infer provenance when omitted on legacy raw inputs (tile proxy tag/kinds imply proxy). */
export function inferWaterReaderAerialCandidateSource(
  raw: Pick<WaterReaderAerialRawCandidateInput, 'candidateSource' | 'featureTag' | 'explanationAnchorKind'>,
): WaterReaderAerialCandidateSource {
  if (raw.candidateSource === 'tile_plan_proxy') return 'tile_plan_proxy';
  if (raw.candidateSource === 'geometry_candidate') return 'geometry_candidate';
  if (raw.featureTag === 'tile_bbox_proxy_anchor') return 'tile_plan_proxy';
  if (raw.explanationAnchorKind === 'tile_plan_proxy') return 'tile_plan_proxy';
  return 'geometry_candidate';
}

/** Scores for one candidate zone (additive model §0.5.23). */
export interface WaterReaderAerialEngineScores {
  base: number;
  monthAdjusted: number;
  diversityPenalty: number;
  final: number;
}

/** Minimal candidate record for pipeline wiring — **not** polygon-derived yet when values are stubs. */
export interface WaterReaderAerialEngineCandidate {
  id: string;
  anchor: WaterReaderAerialNormalizedPoint01;
  overlayRect: WaterReaderNormalizedPlanarOverlayRect01;
  featureTag: WaterReaderAerialEngineFeatureTag;
  scores: WaterReaderAerialEngineScores;
  reasonCode: WaterReaderAerialZoneReasonCode;
  confidence: WaterReaderAerialZoneConfidence;
  /** Carried from raw selection — drives read-level evidence (polygon-backed vs tile-plan proxy). */
  candidateSource: WaterReaderAerialCandidateSource;
  /** Set when producing copy via selection (`selectWaterReaderAerialCandidates`). */
  deterministicExplanation?: string;
}

/** Pre-scored input for ranking/NMS (**not** from polygon detectors in this slice). */
export interface WaterReaderAerialRawCandidateInput {
  id: string;
  anchor: WaterReaderAerialNormalizedPoint01;
  /** Width fraction (0–1) for overlay construction. */
  overlayWidthFrac: number;
  /** Height fraction (0–1) for overlay construction. */
  overlayHeightFrac: number;
  featureTag: WaterReaderAerialEngineFeatureTag;
  /** Base feature aggregate `S_i` ∈ [0,1]; clamped by engine. */
  baseScore: number;
  /**
   * **`geometry_candidate`** when omitted — polygon/feature pipeline inputs; **`tile_plan_proxy`** set by
   * {@link buildAerialProxyCandidatesFromTilePlan} (also inferable from {@link inferWaterReaderAerialCandidateSource}).
   */
  candidateSource?: WaterReaderAerialCandidateSource;
  /**
   * When `tile_plan_proxy`, explanations stay tile-metadata honest (no inferred shoreline features).
   * Omitted defaults to geometry-feature copy for backward compatibility.
   */
  explanationAnchorKind?: 'geometry_feature' | 'tile_plan_proxy';
}

/** Deterministic-select outcome wrapper (caller maps to read-level contracts later). */
export interface WaterReaderAerialCandidateSelectionWarning {
  code: string;
  message: string;
}

export interface WaterReaderAerialCandidateSelectionResult {
  selected: WaterReaderAerialEngineCandidate[];
  /** True when fewer than `minZones` zones were selected (`options.minZones`). */
  shortfall: boolean;
  warnings: WaterReaderAerialCandidateSelectionWarning[];
}

export interface WaterReaderAerialCandidateSelectionOptions {
  /** Default 5. */
  maxZones?: number;
  /** Default 3 (`WaterReaderReadZones3To5`). */
  minZones?: number;
  /** NMS min anchor separation in normalized overlay space — default {@link WR_AERIAL_SEPARATION_THRESHOLD_NORMALIZED}. */
  separationThresholdNormalized?: number;
}

function confidenceBiasForMultiplier(m: number): WaterReaderAerialMonthConfidenceBias {
  if (m < 0.9) return 'winter_low';
  if (m < 0.96) return 'transition_low';
  return 'standard';
}

/**
 * Deterministic calendar month in **1–12**. Non-finite inputs default to **6** (Jun).
 * Rounds fractional months; wraps out-of-range integers (e.g. 13→1, 0→12).
 */
export function normalizeCalendarMonth(month: unknown): number {
  const raw = typeof month === 'number' && Number.isFinite(month) ? Math.round(month) : NaN;
  if (!Number.isFinite(raw)) return 6;
  const wrapped = ((((raw - 1) % 12) + 12) % 12) + 1;
  return wrapped;
}

export function getWaterReaderAerialMonthWeight(monthInput: unknown): WaterReaderAerialMonthWeight {
  const month = normalizeCalendarMonth(monthInput);
  const multiplier = WR_AERIAL_MONTH_MULTIPLIERS[month - 1];
  return {
    month,
    multiplier,
    confidenceBias: confidenceBiasForMultiplier(multiplier),
  };
}

export function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

/**
 * §0.5.23-style score stack: `base` is [0,1] weighted sum; month scales; **`rawDiversityDuplicateScore`** is a separate duplicate-mass hook (not the selection pairwise ramp used in **`selectWaterReaderAerialCandidates`**).
 */
export function composeAerialScores01(
  base: number,
  monthMultiplier: number,
  rawDiversityDuplicateScore: number,
): WaterReaderAerialEngineScores {
  const b = clamp01(base);
  const m = clamp01(monthMultiplier);
  const dup = Number.isFinite(rawDiversityDuplicateScore) ? Math.max(0, rawDiversityDuplicateScore) : 0;
  const monthAdjusted = clamp01(b * m);
  const diversityPenalty = WR_AERIAL_DIVERSITY_LAMBDA * dup + WR_AERIAL_DIVERSITY_EPSILON;
  const final = clamp01(monthAdjusted - diversityPenalty);
  return {
    base: b,
    monthAdjusted,
    diversityPenalty,
    final,
  };
}

/**
 * Euclidean distance between two planar points using their stored `x`/`y` values.
 * For overlay-backed anchors, callers should pass coordinates in normalized [0,1] space; the math does not coerce inputs.
 */
export function normalizedPointDistance01(
  a: WaterReaderAerialNormalizedPoint01,
  b: WaterReaderAerialNormalizedPoint01,
): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

/**
 * Axis-aligned rect centered on anchor, **clamped** to stay inside the unit viewport.
 */
export function makeOverlayRectAroundAnchor01(
  anchorX: number,
  anchorY: number,
  widthFrac: number,
  heightFrac: number,
): WaterReaderNormalizedPlanarOverlayRect01 {
  const w = clamp01(widthFrac);
  const h = clamp01(heightFrac);
  const ax = clamp01(anchorX);
  const ay = clamp01(anchorY);
  let x = ax - w / 2;
  let y = ay - h / 2;
  x = Math.max(0, Math.min(x, 1 - w));
  y = Math.max(0, Math.min(y, 1 - h));
  return {
    coordinateKind: 'normalized_planar_whole_waterbody_overlay_01',
    x,
    y,
    w,
    h,
  };
}

/**
 * Minimal bbox-only tile plan for proxy anchors (`contextBbox` + ordered close tiles).
 * Does not include polygons — callers map server `AerialTilePlan` or client `AerialReadTilePlan` via helpers below.
 */
export interface AerialTilePlanLikeForProxy {
  readonly contextBbox: WaterbodyPreviewBbox;
  readonly tiles: readonly { readonly id: number; readonly bbox: WaterbodyPreviewBbox }[];
}

export interface BuildAerialProxyCandidatesFromTilePlanResult {
  readonly rawCandidates: WaterReaderAerialRawCandidateInput[];
  readonly warnings: WaterReaderAerialCandidateSelectionWarning[];
}

/** Conservative low base score for bbox-proxy candidates (keeps zones in low confidence vs geometry detectors). */
export const WR_TILE_PLAN_PROXY_BASE_SCORE = 0.12;

/** Append to read limitations when assembling results from tile-plan proxies (polygon unavailable). */
export const WR_TILE_PLAN_PROXY_NO_POLYGON_LIMITATION =
  'Starting areas use planned aerial tile anchors on the lake frame; authoritative waterbody polygon geometry was not available to detect points, coves, neckdowns, or islands.' as const;

/** Maps client `planAerialReadTiles` output into {@link AerialTilePlanLikeForProxy}. */
export function toAerialTilePlanLikeFromClientTilePlan(plan: AerialReadTilePlan): AerialTilePlanLikeForProxy {
  const tiles = [...plan.closeTiles]
    .sort((a, b) => a.id - b.id)
    .map((t) => ({ id: t.id, bbox: t.bbox }));
  return { contextBbox: plan.contextBbox, tiles };
}

/** Maps Edge `waterbody-aerial-tile-plan` {@link AerialTilePlan} into {@link AerialTilePlanLikeForProxy}. */
export function toAerialTilePlanLikeFromServerTilePlan(plan: AerialTilePlan): AerialTilePlanLikeForProxy {
  const tiles = [...plan.tiles]
    .sort((a, b) => a.id - b.id)
    .map((t) => ({ id: t.id, bbox: t.bbox }));
  return { contextBbox: plan.contextBbox, tiles };
}

function anchorFromTileCenterInContext01(
  context: WaterbodyPreviewBbox,
  tile: WaterbodyPreviewBbox,
): WaterReaderAerialNormalizedPoint01 {
  const cx = (tile.minLon + tile.maxLon) / 2;
  const cy = (tile.minLat + tile.maxLat) / 2;
  const w = context.maxLon - context.minLon;
  const h = context.maxLat - context.minLat;
  if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) {
    return { x: 0.5, y: 0.5 };
  }
  return {
    x: clamp01((cx - context.minLon) / w),
    y: clamp01((cy - context.minLat) / h),
  };
}

/**
 * Deterministic bbox/tile-plan **proxy** raw candidates — **not** polygon shoreline detection.
 * Spreads anchors from tile centers normalized into the lake `contextBbox` frame (§0.5.23 degraded path).
 */
export function buildAerialProxyCandidatesFromTilePlan(
  plan: AerialTilePlanLikeForProxy,
  options?: { overlayWidthFrac?: number; overlayHeightFrac?: number; baseScore?: number },
): BuildAerialProxyCandidatesFromTilePlanResult {
  const warnings: WaterReaderAerialCandidateSelectionWarning[] = [
    {
      code: 'TILE_PLAN_PROXY_NO_POLYGON_GEOMETRY',
      message:
        'Candidates are bbox/tile-plan anchors only; no lake polygon shoreline geometry was supplied to this engine.',
    },
  ];
  const ow = clamp01(options?.overlayWidthFrac ?? 0.09);
  const oh = clamp01(options?.overlayHeightFrac ?? 0.09);
  const baseScore = clamp01(
    typeof options?.baseScore === 'number' && Number.isFinite(options.baseScore)
      ? options.baseScore
      : WR_TILE_PLAN_PROXY_BASE_SCORE,
  );

  const sortedTiles = [...plan.tiles].sort((a, b) => {
    const idCmp = a.id - b.id;
    if (idCmp !== 0) return idCmp;
    return a.bbox.minLon - b.bbox.minLon;
  });
  const rawCandidates: WaterReaderAerialRawCandidateInput[] = [];
  for (const t of sortedTiles) {
    rawCandidates.push({
      id: `tile_proxy_${String(t.id)}`,
      anchor: anchorFromTileCenterInContext01(plan.contextBbox, t.bbox),
      overlayWidthFrac: ow,
      overlayHeightFrac: oh,
      featureTag: 'tile_bbox_proxy_anchor',
      baseScore,
      candidateSource: 'tile_plan_proxy',
      explanationAnchorKind: 'tile_plan_proxy',
    });
  }

  return { rawCandidates, warnings };
}

export function mapEngineFeatureTagToReasonCode(
  tag: WaterReaderAerialEngineFeatureTag,
): WaterReaderAerialZoneReasonCode {
  switch (tag) {
    case 'point_protrusion':
    case 'neckdown_constriction':
    case 'shoreline_complexity':
      return 'shoreline_area_geometry_context';
    case 'cove_pocket':
      return 'map_region_callout';
    case 'island_inside_turn':
      return 'waterbody_geometry_context';
    case 'coverage_distribution':
      return 'map_region_callout';
    case 'tile_bbox_proxy_anchor':
      return 'visible_boundary_context_uncertain';
    default: {
      const _exhaustive: never = tag;
      return _exhaustive;
    }
  }
}

export function mapFinalScoreAndMonthToZoneConfidence(
  finalScore: number,
  monthMultiplier: number,
): WaterReaderAerialZoneConfidence {
  if (
    finalScore >= WR_AERIAL_ZONE_MODERATE_MIN_FINAL &&
    monthMultiplier >= WR_AERIAL_ZONE_MODERATE_REQUIRES_MONTH_M
  ) {
    return 'moderate';
  }
  return 'low';
}

export function mapZonesToOverallReadConfidence(
  zoneConfidences: readonly WaterReaderAerialZoneConfidence[],
  monthMultiplier: number,
): WaterReaderAerialOnlyConfidence {
  const moderateCount = zoneConfidences.filter((z) => z === 'moderate').length;
  if (
    moderateCount >= WR_AERIAL_READ_MODERATE_MIN_MODERATE_ZONES &&
    monthMultiplier >= WR_AERIAL_READ_MODERATE_REQUIRES_MONTH_M
  ) {
    return 'moderate';
  }
  return 'low';
}

export interface DeterministicZoneExplanationInput {
  featureTag: WaterReaderAerialEngineFeatureTag;
  month: number;
  reasonCode: WaterReaderAerialZoneReasonCode;
  confidence: WaterReaderAerialZoneConfidence;
  /** Defaults to coarse-grid framing wording; tile-plan proxies must pass `tile_plan_proxy`. */
  explanationAnchorKind?: 'geometry_feature' | 'tile_plan_proxy';
}

/**
 * Deterministic copy only — no fish-catch promise, no access routing, no depth/bathymetry/contour claim, no inference of model/AI narration.
 */
export function buildDeterministicZoneExplanation(input: DeterministicZoneExplanationInput): string {
  const month = normalizeCalendarMonth(input.month);
  const anchorKind = input.explanationAnchorKind ?? 'geometry_feature';
  const head =
    anchorKind === 'tile_plan_proxy'
      ? `Selected by deterministic tile-plan anchor placement — month ${String(month)} — feature ${input.featureTag} (tile bbox normalized to the lake frame; not shoreline polygon detection).`
      : `Selected from coarse polygon/grid sampling — month ${String(month)} — prototype preview only (${WR_AERIAL_GEOMETRY_PIPELINE_COARSE_GRID}: not detected shoreline features, points, coves, neckdowns, islands, “complexity,” orthophoto tracing, or imagery inference).`;
  const parts = [
    head,
    `Reason: ${input.reasonCode}.`,
    `Confidence: ${input.confidence} (${input.confidence === 'moderate' ? 'thresholds satisfied for aerial-only scoring' : 'conservative aerial-only scoring'}).`,
    'Limitations: no depth charts, bathymetry, or contours were used.',
    'This is coarse framing only — not final starting-area detection, a fish zone, or a guarantee of presence or catch location.',
  ];
  return parts.join(' ');
}

const DEFAULT_SELECTION_MAX_ZONES = 5;
const DEFAULT_SELECTION_MIN_ZONES = 3;

interface InternalPreparedRankingRow {
  raw: WaterReaderAerialRawCandidateInput;
  base: number;
  monthAdjusted: number;
  diversityPenalty: number;
  final: number;
}

function aerialRankingCompareDesc(a: InternalPreparedRankingRow, b: InternalPreparedRankingRow): number {
  const byFinal = b.final - a.final;
  if (Math.abs(byFinal) > 1e-12) return byFinal;
  const ft = a.raw.featureTag.localeCompare(b.raw.featureTag, 'en');
  if (ft !== 0) return ft;
  return a.raw.id.localeCompare(b.raw.id, 'en');
}

/**
 * Bounded neighbor penalty for pairwise diversity during selection:
 * ramps linearly from **λ** when distance is zero toward **0** when **`d`** reaches **`separationScale`**, capped by **`WR_AERIAL_DIVERSITY_MAX_NEIGHBOR_PENALTY`**. Shares the same scale as NMS so scores stay stable near duplicate anchors (**§0.5.23**; NMS removes spatial duplicates afterward).
 */
export function boundedNeighborDiversityPenalty01(distance: number, separationScale?: number): number {
  const scale =
    typeof separationScale === 'number' && separationScale > 1e-12
      ? separationScale
      : WR_AERIAL_SEPARATION_THRESHOLD_NORMALIZED;
  const d = Number.isFinite(distance) && distance >= 0 ? distance : 0;
  const ramp = WR_AERIAL_DIVERSITY_LAMBDA * Math.max(0, 1 - d / scale);
  return Math.min(ramp, WR_AERIAL_DIVERSITY_MAX_NEIGHBOR_PENALTY);
}

function computePairwiseDiversityPenaltySum01(
  anchor: WaterReaderAerialNormalizedPoint01,
  allAnchors: readonly WaterReaderAerialNormalizedPoint01[],
  selfIdx: number,
  separationScaleForDiversity: number,
): number {
  let sum = 0;
  for (let j = 0; j < allAnchors.length; j += 1) {
    if (j === selfIdx) continue;
    const d = normalizedPointDistance01(anchor, allAnchors[j]);
    sum += boundedNeighborDiversityPenalty01(d, separationScaleForDiversity);
  }
  return sum;
}

function minNormalizedDistanceToAnchors01(
  anchor: WaterReaderAerialNormalizedPoint01,
  accepted: readonly InternalPreparedRankingRow[],
): number {
  if (accepted.length === 0) return Infinity;
  let min = Infinity;
  for (const row of accepted) {
    min = Math.min(min, normalizedPointDistance01(anchor, row.raw.anchor));
  }
  return min;
}

/**
 * Deterministic aerial zone selection: pairwise diversity uses **bounded** neighbor terms (ramp + cap; not λ/(d+ε)), then sort by **`S''`**, greedy NMS by anchor separation (**§0.5.23**).
 *
 * Polygon detectors are **not** supplied here — callers feed pre-derived candidates/scores only.
 */
export function selectWaterReaderAerialCandidates(
  rawCandidates: readonly WaterReaderAerialRawCandidateInput[],
  monthInput: unknown,
  options?: WaterReaderAerialCandidateSelectionOptions,
): WaterReaderAerialCandidateSelectionResult {
  let maxZones = options?.maxZones ?? DEFAULT_SELECTION_MAX_ZONES;
  let minZones = options?.minZones ?? DEFAULT_SELECTION_MIN_ZONES;
  const separation =
    typeof options?.separationThresholdNormalized === 'number' && Number.isFinite(options.separationThresholdNormalized)
      ? Math.max(0, options.separationThresholdNormalized)
      : WR_AERIAL_SEPARATION_THRESHOLD_NORMALIZED;

  if (maxZones < 1) maxZones = 1;
  if (minZones < 1) minZones = 1;
  if (minZones > maxZones) {
    minZones = maxZones;
  }

  /** Same scale as NMS (fallback when threshold is 0 — avoids divide-by-zero in the diversity ramp). */
  const diversitySeparationScale =
    separation > 1e-12 ? separation : WR_AERIAL_SEPARATION_THRESHOLD_NORMALIZED;

  const month = normalizeCalendarMonth(monthInput);
  const mw = getWaterReaderAerialMonthWeight(month);
  const m = mw.multiplier;

  const warnings: WaterReaderAerialCandidateSelectionWarning[] = [];

  const n = rawCandidates.length;
  if (n === 0) {
    return {
      selected: [],
      shortfall: minZones > 0,
      warnings: [{ code: 'NO_INPUT_CANDIDATES', message: 'No raw candidates supplied for deterministic selection.' }],
    };
  }

  const bases = rawCandidates.map((r) => clamp01(r.baseScore));
  const anchorsNorm = rawCandidates.map((r) => ({
    x: clamp01(r.anchor.x),
    y: clamp01(r.anchor.y),
  }));

  const preparedAll: InternalPreparedRankingRow[] = [];
  for (let i = 0; i < n; i += 1) {
    const raw = rawCandidates[i];
    const base = bases[i];
    const monthAdjusted = clamp01(base * m);
    const diversityPenalty = computePairwiseDiversityPenaltySum01(
      anchorsNorm[i],
      anchorsNorm,
      i,
      diversitySeparationScale,
    );
    let finalScore = clamp01(monthAdjusted - diversityPenalty);
    if (!Number.isFinite(finalScore)) finalScore = 0;
    preparedAll.push({
      raw: {
        ...raw,
        baseScore: base,
        anchor: anchorsNorm[i],
        overlayWidthFrac: clamp01(raw.overlayWidthFrac),
        overlayHeightFrac: clamp01(raw.overlayHeightFrac),
        candidateSource: inferWaterReaderAerialCandidateSource(raw),
      },
      base,
      monthAdjusted,
      diversityPenalty,
      final: finalScore,
    });
  }

  const sorted = [...preparedAll].sort(aerialRankingCompareDesc);

  const nmsChosen: InternalPreparedRankingRow[] = [];
  for (const row of sorted) {
    if (nmsChosen.length >= maxZones) break;
    if (nmsChosen.length === 0) {
      nmsChosen.push(row);
      continue;
    }
    const minD = minNormalizedDistanceToAnchors01(row.raw.anchor, nmsChosen);
    if (minD >= separation) {
      nmsChosen.push(row);
    }
  }

  const selected: WaterReaderAerialEngineCandidate[] = nmsChosen.map((row) => {
    const reasonCode = mapEngineFeatureTagToReasonCode(row.raw.featureTag);
    const confidence = mapFinalScoreAndMonthToZoneConfidence(row.final, m);
    const overlayRect = makeOverlayRectAroundAnchor01(
      row.raw.anchor.x,
      row.raw.anchor.y,
      row.raw.overlayWidthFrac,
      row.raw.overlayHeightFrac,
    );
    const deterministicExplanation = buildDeterministicZoneExplanation({
      featureTag: row.raw.featureTag,
      month,
      reasonCode,
      confidence,
      explanationAnchorKind: row.raw.explanationAnchorKind ?? 'geometry_feature',
    });
    return {
      id: row.raw.id,
      anchor: row.raw.anchor,
      overlayRect,
      featureTag: row.raw.featureTag,
      candidateSource: inferWaterReaderAerialCandidateSource(row.raw),
      scores: {
        base: row.base,
        monthAdjusted: row.monthAdjusted,
        diversityPenalty: row.diversityPenalty,
        final: row.final,
      },
      reasonCode,
      confidence,
      deterministicExplanation,
    };
  });

  const shortfall = selected.length < minZones;
  if (shortfall) {
    warnings.push({
      code: 'MIN_ZONES_SHORTFALL',
      message:
        `Selected ${String(selected.length)} zone(s); minimum requested was ${String(minZones)} (geometry separation or insufficient candidates).`,
    });
  }

  return { selected, shortfall, warnings };
}

/** Deterministic map-legend line — geometry catalog only (**§0.5.23**), not a fish or structure claim. */
export function waterReaderAerialZoneLegendLabelFromFeatureTag(tag: WaterReaderAerialEngineFeatureTag): string {
  switch (tag) {
    case 'point_protrusion':
      return 'Point / shoreline angle (geometry)';
    case 'cove_pocket':
      return 'Cove / pocket (geometry)';
    case 'neckdown_constriction':
      return 'Neckdown / narrow connection (geometry)';
    case 'island_inside_turn':
      return 'Island inside turn (geometry)';
    case 'shoreline_complexity':
    case 'coverage_distribution':
      // Neutral label for RPC coarse grid (WR_AERIAL_GEOMETRY_PIPELINE_COARSE_GRID) — internal tags are not detections.
      return 'Coarse grid window (preview)';
    case 'tile_bbox_proxy_anchor':
      return 'Tile-plan anchor (boundary uncertain)';
    default: {
      const _e: never = tag;
      return _e;
    }
  }
}

/** Standard limitations string list for deterministic engine output (order stable). */
export const AERIAL_ONLY_ENGINE_STANDARD_LIMITATIONS: readonly string[] = [
  'No depth charts, bathymetry, or contour layers were used in this read.',
  'No orthophoto pixel classification, automated imagery labeling, or hidden vision-model inference was used.',
  'No public/private shoreline access, trespass eligibility, or legal boundary suitability is asserted.',
  'Zones are coarse map-overlay previews on the lake frame — not validated production starting picks, exact fish GPS coordinates, or feature detection.',
  'Aerial-only read confidence stays low or moderate per policy (never high).',
];

export interface BuildWaterReaderAerialOnlyResultFromCandidatesInput {
  waterbody: WaterReaderAerialResultWaterbodyIdentity;
  /** Length must be 3–5 (e.g. `selectWaterReaderAerialCandidates`). */
  selectedCandidates: readonly WaterReaderAerialEngineCandidate[];
  monthInput: unknown;
  /** ISO 8601; defaults to current time unless set (tests). */
  generatedAtIso?: string;
  /**
   * Optional override for all zones’ `geometryBackedCue`. Prefer relying on each candidate’s
   * {@link WaterReaderAerialEngineCandidate.candidateSource}; **`tile_plan_proxy` zones never become geometry-backed**
   * even when this is `true`. When omitted, cues follow provenance per zone.
   */
  evidenceGeometryBacked?: boolean;
  /** Extra limitation lines merged after standard (+ auto proxy line); duplicate strings omitted. */
  additionalLimitations?: readonly string[];
}

function zoneGeometryBackedCueFromProvenance(
  candidateSource: WaterReaderAerialCandidateSource,
  evidenceGeometryBackedOverride: boolean | undefined,
): boolean {
  const intrinsic = candidateSource === 'geometry_candidate';
  if (evidenceGeometryBackedOverride === false) return false;
  if (candidateSource === 'tile_plan_proxy') return false;
  if (evidenceGeometryBackedOverride === true) return true;
  return intrinsic;
}

function mergeAerialOnlyEngineLimitations(options: {
  readonly anyTilePlanProxy: boolean;
  readonly additionalLimitations?: readonly string[];
}): readonly string[] {
  const base = [...AERIAL_ONLY_ENGINE_STANDARD_LIMITATIONS];
  const seen = new Set(base);
  if (options.anyTilePlanProxy && !seen.has(WR_TILE_PLAN_PROXY_NO_POLYGON_LIMITATION)) {
    base.push(WR_TILE_PLAN_PROXY_NO_POLYGON_LIMITATION);
    seen.add(WR_TILE_PLAN_PROXY_NO_POLYGON_LIMITATION);
  }
  for (const line of options.additionalLimitations ?? []) {
    if (line.length === 0) continue;
    if (!seen.has(line)) {
      base.push(line);
      seen.add(line);
    }
  }
  return base;
}

export type WaterReaderAerialOnlyResultBuildFailureReason = 'INSUFFICIENT_CANDIDATES' | 'INVALID_ZONE_COUNT';

export type WaterReaderAerialOnlyResultFromCandidatesOutcome =
  | { ok: true; result: WaterReaderAerialOnlyReadResult }
  | { ok: false; reason: WaterReaderAerialOnlyResultBuildFailureReason };

function toReadZones3To5(
  zones: readonly WaterReaderAerialReadZoneSummary[],
): WaterReaderAerialReadZones3To5 {
  const len = zones.length;
  if (len === 3) return [zones[0], zones[1], zones[2]];
  if (len === 4) return [zones[0], zones[1], zones[2], zones[3]];
  if (len === 5) return [zones[0], zones[1], zones[2], zones[3], zones[4]];
  throw new RangeError('zones must have length 3, 4, or 5');
}

/**
 * Maps engine-selected candidates into **`WaterReaderAerialOnlyReadResult`** (no stub placeholder; not the mock builder).
 */
export function buildWaterReaderAerialOnlyResultFromCandidates(
  input: BuildWaterReaderAerialOnlyResultFromCandidatesInput,
): WaterReaderAerialOnlyResultFromCandidatesOutcome {
  const n = input.selectedCandidates.length;
  if (n < 3) return { ok: false, reason: 'INSUFFICIENT_CANDIDATES' };
  if (n > 5) return { ok: false, reason: 'INVALID_ZONE_COUNT' };

  const month = normalizeCalendarMonth(input.monthInput);
  const m = getWaterReaderAerialMonthWeight(month).multiplier;
  const override = input.evidenceGeometryBacked;
  const anyTilePlanProxy = input.selectedCandidates.some((c) => c.candidateSource === 'tile_plan_proxy');

  const zonesBuild: WaterReaderAerialReadZoneSummary[] = input.selectedCandidates.map((c) => {
    const human =
      c.deterministicExplanation ??
      buildDeterministicZoneExplanation({
        featureTag: c.featureTag,
        month,
        reasonCode: c.reasonCode,
        confidence: c.confidence,
        explanationAnchorKind:
          c.candidateSource === 'tile_plan_proxy' ? 'tile_plan_proxy' : 'geometry_feature',
      });
    const zoneEvidence: WaterReaderAerialZoneEvidence = {
      geometryBackedCue: zoneGeometryBackedCueFromProvenance(c.candidateSource, override),
      visibleImageryHypothesisUsed: false,
      depthEvidenceUsed: false,
      bathymetryEvidenceUsed: false,
    };
    return {
      id: c.id,
      label: waterReaderAerialZoneLegendLabelFromFeatureTag(c.featureTag),
      overlayRect: c.overlayRect,
      reasonCode: c.reasonCode,
      humanExplanation: human,
      confidence: c.confidence,
      evidence: zoneEvidence,
    };
  });

  const zones = toReadZones3To5(zonesBuild);
  const overallConfidence = mapZonesToOverallReadConfidence(
    zonesBuild.map((z) => z.confidence),
    m,
  );

  const generatedAt = input.generatedAtIso ?? new Date().toISOString();

  const limitations = mergeAerialOnlyEngineLimitations({
    anyTilePlanProxy,
    additionalLimitations: input.additionalLimitations,
  });

  const result: WaterReaderAerialOnlyReadResult = {
    generatedAt,
    contractId: WR_AERIAL_ONLY_RESULT_CONTRACT_ID,
    waterbody: input.waterbody,
    sourceMode: 'aerial_only',
    imagerySource: {
      sourceRegistryId: WR_REGISTRY_USGS_TNM_NAIP_PLUS,
      aerialPolicyKey: WR_POLICY_USGS_TNM_NAIP_PLUS_NATIONAL,
    },
    attribution: USGS_TNM_ATTRIBUTION,
    overallConfidence,
    limitations,
    zones,
  };

  return { ok: true, result };
}

/**
 * Maps Edge/RPC geometry candidate rows ({@link WaterbodyAerialGeometryCandidateRow}) into deterministic engine raw inputs.
 * Does not fetch remote data — callers supply rows already validated server-side.
 * Presentation path: {@link WR_AERIAL_GEOMETRY_PIPELINE_COARSE_GRID} (prototype coarse grid — not shoreline-sampled features).
 */
export function waterReaderAerialGeometryRowsToRawCandidates(
  rows: readonly WaterbodyAerialGeometryCandidateRow[],
): WaterReaderAerialRawCandidateInput[] {
  return rows.map((row) => ({
    id: `geom_${row.lakeId}_${String(row.candidateId)}`,
    anchor: { x: row.normalizedAnchorX, y: row.normalizedAnchorY },
    overlayWidthFrac: Math.min(clamp01(row.overlayW), WR_GEOMETRY_RPC_GRID_OVERLAY_FRAC_CAP),
    overlayHeightFrac: Math.min(clamp01(row.overlayH), WR_GEOMETRY_RPC_GRID_OVERLAY_FRAC_CAP),
    featureTag: row.featureTag,
    baseScore: Math.min(clamp01(row.baseScore), WR_GEOMETRY_RPC_GRID_BASE_SCORE_CAP),
    candidateSource: 'geometry_candidate',
    explanationAnchorKind: 'geometry_feature',
  }));
}

/** Builds {@link WaterReaderAerialResultWaterbodyIdentity} from one RPC geometry row (identity repeats per row). */
export function waterbodyIdentityFromGeometryCandidateRow(
  row: WaterbodyAerialGeometryCandidateRow,
): WaterReaderAerialResultWaterbodyIdentity {
  return {
    lakeId: row.lakeId,
    name: row.name,
    state: row.state,
    county: row.county,
    waterbodyType: row.waterbodyType,
  };
}

export type WaterReaderAerialGeometryOrchestrationFailureReason =
  | 'INSUFFICIENT_GEOMETRY_CANDIDATE_ROWS'
  | 'INSUFFICIENT_ZONES_AFTER_SELECTION'
  | WaterReaderAerialOnlyResultBuildFailureReason;

export interface BuildWaterReaderAerialOnlyGeometryResultFromCandidateRowsInput {
  rows: readonly WaterbodyAerialGeometryCandidateRow[];
  /** When omitted, derived from {@link rows}[0]. */
  waterbody?: WaterReaderAerialResultWaterbodyIdentity;
  monthInput: unknown;
  generatedAtIso?: string;
  selection?: WaterReaderAerialCandidateSelectionOptions;
}

export type BuildWaterReaderAerialOnlyGeometryResultFromCandidateRowsOutcome =
  | {
      ok: true;
      result: WaterReaderAerialOnlyReadResult;
      warnings: readonly WaterReaderAerialCandidateSelectionWarning[];
      selectedCount: number;
    }
  | {
      ok: false;
      reason: WaterReaderAerialGeometryOrchestrationFailureReason;
      warnings: readonly WaterReaderAerialCandidateSelectionWarning[];
      selectedCount: number;
    };

/**
 * Deterministic aerial read from **server geometry candidate rows** (no tile-plan proxy path).
 * Pipeline: {@link waterReaderAerialGeometryRowsToRawCandidates} → {@link selectWaterReaderAerialCandidates} →
 * {@link buildWaterReaderAerialOnlyResultFromCandidates}. Does not assemble payloads server-side — client wiring only.
 */
export function buildWaterReaderAerialOnlyGeometryResultFromCandidateRows(
  input: BuildWaterReaderAerialOnlyGeometryResultFromCandidateRowsInput,
): BuildWaterReaderAerialOnlyGeometryResultFromCandidateRowsOutcome {
  const rows = input.rows;
  if (rows.length < 3) {
    return {
      ok: false,
      reason: 'INSUFFICIENT_GEOMETRY_CANDIDATE_ROWS',
      warnings: [],
      selectedCount: 0,
    };
  }

  const waterbody =
    input.waterbody ?? waterbodyIdentityFromGeometryCandidateRow(rows[0]!);

  const raw = waterReaderAerialGeometryRowsToRawCandidates(rows);
  const sel = selectWaterReaderAerialCandidates(raw, input.monthInput, input.selection);

  if (sel.selected.length < 3) {
    return {
      ok: false,
      reason: 'INSUFFICIENT_ZONES_AFTER_SELECTION',
      warnings: [...sel.warnings],
      selectedCount: sel.selected.length,
    };
  }

  const assembled = buildWaterReaderAerialOnlyResultFromCandidates({
    waterbody,
    selectedCandidates: sel.selected,
    monthInput: input.monthInput,
    generatedAtIso: input.generatedAtIso,
  });

  if (!assembled.ok) {
    return {
      ok: false,
      reason: assembled.reason,
      warnings: [...sel.warnings],
      selectedCount: sel.selected.length,
    };
  }

  return {
    ok: true,
    result: assembled.result,
    warnings: [...sel.warnings],
    selectedCount: sel.selected.length,
  };
}

/**
 * **Tile-plan / bbox proxy orchestration only — not a production “real read.”**
 *
 * Produces {@link WaterReaderAerialOnlyReadResult} from **planned aerial tile bboxes** normalized into the lake frame:
 * **no** polygon shoreline geometry, **no** orthophoto fetch or pixel analysis, **no** caching/persistence.
 * Intended for plumbing/tests until polygon-backed candidates exist; callers must not present this as authoritative structure detection.
 *
 * Pipeline: {@link buildAerialProxyCandidatesFromTilePlan} → {@link selectWaterReaderAerialCandidates} →
 * {@link buildWaterReaderAerialOnlyResultFromCandidates} (provenance stamps proxy limitations / `geometryBackedCue` automatically).
 */
export type WaterReaderAerialOnlyProxyOrchestrationFailureReason =
  | 'NO_PROXY_RAW_CANDIDATES'
  | 'INSUFFICIENT_ZONES_AFTER_SELECTION'
  | WaterReaderAerialOnlyResultBuildFailureReason;

export interface BuildWaterReaderAerialOnlyProxyResultFromTilePlanInput {
  waterbody: WaterReaderAerialResultWaterbodyIdentity;
  /** Bbox-only tile layout ({@link AerialTilePlanLikeForProxy}) — not polygon geometry. */
  tilePlan: AerialTilePlanLikeForProxy;
  monthInput: unknown;
  /** ISO 8601 timestamp on the envelope; defaults when omitted. */
  generatedAtIso?: string;
  /** Passed through to {@link buildAerialProxyCandidatesFromTilePlan}. */
  proxyCandidateOptions?: { overlayWidthFrac?: number; overlayHeightFrac?: number; baseScore?: number };
  /** Selection/NMS; defaults match {@link selectWaterReaderAerialCandidates} (max 5, min 3). */
  selection?: WaterReaderAerialCandidateSelectionOptions;
}

export type BuildWaterReaderAerialOnlyProxyResultFromTilePlanOutcome =
  | {
      ok: true;
      result: WaterReaderAerialOnlyReadResult;
      /** Combined warnings from proxy builder + selection (preserved order). */
      warnings: readonly WaterReaderAerialCandidateSelectionWarning[];
      selectedCount: number;
    }
  | {
      ok: false;
      reason: WaterReaderAerialOnlyProxyOrchestrationFailureReason;
      warnings: readonly WaterReaderAerialCandidateSelectionWarning[];
      /** Zones accepted by NMS before read assembly (may be fewer than three). */
      selectedCount: number;
    };

export function buildWaterReaderAerialOnlyProxyResultFromTilePlan(
  input: BuildWaterReaderAerialOnlyProxyResultFromTilePlanInput,
): BuildWaterReaderAerialOnlyProxyResultFromTilePlanOutcome {
  const built = buildAerialProxyCandidatesFromTilePlan(input.tilePlan, input.proxyCandidateOptions);
  const warningsHead = [...built.warnings];

  if (built.rawCandidates.length === 0) {
    return {
      ok: false,
      reason: 'NO_PROXY_RAW_CANDIDATES',
      warnings: warningsHead,
      selectedCount: 0,
    };
  }

  const sel = selectWaterReaderAerialCandidates(built.rawCandidates, input.monthInput, input.selection);
  const mergedWarnings = [...warningsHead, ...sel.warnings];

  if (sel.selected.length < 3) {
    return {
      ok: false,
      reason: 'INSUFFICIENT_ZONES_AFTER_SELECTION',
      warnings: mergedWarnings,
      selectedCount: sel.selected.length,
    };
  }

  const assembled = buildWaterReaderAerialOnlyResultFromCandidates({
    waterbody: input.waterbody,
    selectedCandidates: sel.selected,
    monthInput: input.monthInput,
    generatedAtIso: input.generatedAtIso,
  });

  if (!assembled.ok) {
    return {
      ok: false,
      reason: assembled.reason,
      warnings: mergedWarnings,
      selectedCount: sel.selected.length,
    };
  }

  return {
    ok: true,
    result: assembled.result,
    warnings: mergedWarnings,
    selectedCount: sel.selected.length,
  };
}
