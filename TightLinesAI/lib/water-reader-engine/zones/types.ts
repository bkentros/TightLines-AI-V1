import type { PointM, RingM, WaterReaderFeatureClass, WaterReaderSeason, WaterReaderSeasonGroup } from '../contracts';

// Feature-envelope contracts are the Pass 2 target geometry model:
// - main_point_structure_area / secondary_point_structure_area: one merged local zone covering the detected tip, immediate tip-adjacent water, and both adjacent side/shoulder references, bounded to the point's local feature span. The conceptual oval center may be land-side/outside-water only when clipping leaves valid local water attached to the point frame. Rendering may use deterministic tip/left/right lobes, but the display contract remains one point feature envelope.
// - cove_structure_area: one bounded local zone covering the detected cove structure reference, including mouth shoulders and inner/back reference, but not an entire large arm when the cove scan is broad.
// - neck_structure_area / saddle_structure_area: one grouped shoulder area representing both sides of the constriction, not the center throat and not pencil-line strokes. Rendering may use deterministic paired shoulder lobes, but the display contract remains one constriction feature envelope.
// - island_structure_area: one island-centered structure area derived from the island ring/centroid and extending beyond island shoreline into adjacent water; visual output must not imply island land is water.
// - dam_structure_area: one local zone covering the dam segment and both transition corners.
// - universal fallbacks remain optional and explicitly separate from feature-envelope structure areas.
export type WaterReaderFeatureEnvelopePlacementKind =
  | 'main_point_structure_area'
  | 'secondary_point_structure_area'
  | 'cove_structure_area'
  | 'neck_structure_area'
  | 'saddle_structure_area'
  | 'island_structure_area'
  | 'dam_structure_area';

export type WaterReaderFeatureEnvelopeSemanticId = WaterReaderFeatureEnvelopePlacementKind;

export type WaterReaderFeatureEnvelopeGeometryKind =
  | 'point_local_span'
  | 'cove_local_envelope'
  | 'constriction_grouped_shoulders'
  | 'island_structure_envelope'
  | 'dam_segment_envelope';

export interface WaterReaderFeatureEnvelopeDiagnostics {
  featureEnvelopeModelVersion: 'feature-envelope-v1';
  featureEnvelopeSourceFeatureId: string;
  featureEnvelopeGeometryKind: WaterReaderFeatureEnvelopeGeometryKind;
  featureEnvelopeIncludes: string[];
  featureEnvelopeSeasonInvariant: true;
  featureEnvelopeSuppressionReason: string | null;
  seasonalEmphasisOnly: true;
}

export type WaterReaderZonePlacementKind =
  | WaterReaderFeatureEnvelopePlacementKind
  | 'neck_shoulder'
  | 'saddle_shoulder'
  | 'main_point_side'
  | 'main_point_tip'
  | 'main_point_open_water'
  | 'cove_back'
  | 'cove_mouth'
  | 'cove_irregular_side'
  | 'secondary_point_back'
  | 'secondary_point_mouth'
  | 'island_mainland'
  | 'island_open_water'
  | 'island_endpoint'
  | 'dam_corner'
  | 'universal_longest_shoreline'
  | 'universal_centroid_shoreline';

export type WaterReaderZonePlacementSemanticId =
  | WaterReaderFeatureEnvelopeSemanticId
  | 'main_point_side'
  | 'main_point_tip'
  | 'main_point_tip_near'
  | 'main_point_open_water_area'
  | 'main_point_open_water_proxy'
  | 'main_point_open_water_recovery'
  | 'secondary_point_back_proxy'
  | 'secondary_point_mouth_proxy'
  | 'secondary_point_back_true'
  | 'secondary_point_mouth_true'
  | 'secondary_point_parent_cove_missing'
  | 'secondary_point_parent_cove_axis_recovery'
  | 'secondary_point_side_recovery'
  | 'secondary_point_tip_transition'
  | 'cove_back_primary'
  | 'cove_back_pocket_recovery'
  | 'cove_back_pocket_recovery_left'
  | 'cove_back_pocket_recovery_right'
  | 'cove_inner_shoreline_left'
  | 'cove_inner_shoreline_right'
  | 'cove_inner_wall_midpoint_left'
  | 'cove_inner_wall_midpoint_right'
  | 'cove_mouth_shoulder_recovery'
  | 'cove_mouth_primary'
  | 'cove_opposite_mouth'
  | 'cove_near_mouth_inner_wall'
  | 'cove_near_mouth_inner_wall_opposite'
  | 'cove_irregular_side_midpoint'
  | 'cove_irregular_side_closer_to_mouth'
  | 'cove_irregular_side_closer_to_back'
  | 'neck_shoulder_endpoint'
  | 'neck_shoulder_approach'
  | 'saddle_shoulder_endpoint'
  | 'saddle_shoulder_approach'
  | 'shoreline_frame_recovery'
  | 'island_mainland_primary'
  | 'island_open_water_area'
  | 'island_open_water_proxy'
  | 'island_open_water_same_side_recovery'
  | 'island_endpoint_a'
  | 'island_endpoint_b'
  | 'island_alternate_endpoint_recovery'
  | 'island_mainland_recovery'
  | 'island_shoreline_recovery'
  | 'island_open_water_recovery'
  | 'dam_corner'
  | 'universal_longest_shoreline'
  | 'universal_centroid_shoreline';

export interface WaterReaderPlacedZone {
  zoneId: string;
  sourceFeatureId: string;
  featureClass: WaterReaderFeatureClass;
  placementKind: WaterReaderZonePlacementKind;
  placementSemanticId?: WaterReaderZonePlacementSemanticId;
  anchorSemanticId?: WaterReaderZonePlacementSemanticId;
  anchor: PointM;
  ovalCenter: PointM;
  majorAxisM: number;
  minorAxisM: number;
  rotationRad: number;
  unclippedRing: RingM;
  visibleWaterRing: RingM;
  visibleWaterFraction: number;
  diagnostics: Record<string, number | string | boolean | string[] | null>;
  qaFlags: string[];
}

export interface WaterReaderZonePlacementResult {
  zones: WaterReaderPlacedZone[];
  season: WaterReaderSeason;
  seasonGroup: WaterReaderSeasonGroup | null;
  qaFlags: string[];
  diagnostics: WaterReaderZonePlacementDiagnostics;
}

export interface WaterReaderZonePlacementDiagnostics {
  draftCount: number;
  materializedCandidateCount: number;
  validCandidateCount: number;
  unitCombinationAttemptCount: number;
  placementTimingMs: Record<string, number>;
  unitDiagnostics: WaterReaderZoneUnitDiagnostics[];
  confluenceGroupCount: number;
  confluenceGroups: WaterReaderStructureConfluenceGroup[];
  detectedFeatureCount: number;
  selectedFeatureCount: number;
  suppressedFeatureCount: number;
  selectedFeatureSuppressionCount: number;
  detectedUnrepresentableFeatureCount: number;
  zoneCount: number;
  selectedFeatureIds: string[];
  suppressedFeatureIds: string[];
  selectedFeatureSuppressionIds: string[];
  detectedUnrepresentableFeatureIds: string[];
  rejectedByReason: Record<string, number>;
  droppedByReason: Record<string, number>;
  universalFallbackAllowed: boolean;
  universalFallbackApplied: boolean;
  featureCoverage: WaterReaderFeatureZoneCoverage[];
}

export interface WaterReaderZonePlacementOptions {
  allowUniversalFallback?: boolean;
}

export type WaterReaderStructureConfluenceStrength = 'light' | 'strong';

export interface WaterReaderStructureConfluenceGroup {
  groupId: string;
  strength: WaterReaderStructureConfluenceStrength;
  memberZoneIds: string[];
  memberSourceFeatureIds: string[];
  memberFeatureClasses: WaterReaderFeatureClass[];
  memberPlacementKinds: WaterReaderZonePlacementKind[];
  mergeReason?: string;
  compactnessRatio?: number;
  envelopeMajorAxisM?: number;
  largestMemberAxisM?: number;
  renderedAsUnifiedEnvelope?: boolean;
}

export type WaterReaderFeatureZoneCoverageReason =
  | 'zoned'
  | 'seasonal_skip'
  | 'no_valid_draft'
  | 'feature_frame_unrepresentable'
  | `rejected_invariant:${string}`
  | 'dropped_zone_cap'
  | 'dropped_overlap_higher_priority_zone'
  | 'dropped_zone_crowding'
  | 'dropped_internal_overlap'
  | 'rejected_heavy_pair_overlap'
  | 'unrenderable_tight_constriction'
  | 'micro_island_unrenderable_without_open_water_zone'
  | 'island_edge_zone_failed_hard_invariants'
  | 'parent_cove_not_zoned'
  | 'feature_unit_not_selected';

export interface WaterReaderFeatureZoneCoverage {
  featureId: string;
  featureClass: WaterReaderFeatureClass;
  zoneCount: number;
  producedVisibleZones: boolean;
  reason: WaterReaderFeatureZoneCoverageReason;
  unrepresentableReason?: string | null;
}

export interface WaterReaderZoneUnitDiagnostics {
  featureId: string;
  featureClass: WaterReaderFeatureClass;
  placementKinds: WaterReaderZonePlacementKind[];
  draftCount: number;
  materializedCandidateCount: number;
  validCandidateCount: number;
  unitCombinationAttemptCount: number;
  elapsedMs: number;
  selected: boolean;
  reason: WaterReaderFeatureZoneCoverageReason | string;
  primaryRejectedCandidateReason?: string | null;
  rejectedCandidateReasons?: Record<string, number>;
  featureEnvelopeSuppressionReason?: string | null;
  featureFrameKind?: string | null;
  featureFrameFallbackTier?: string | null;
  featureFrameUnrepresentableReason?: string | null;
}

export interface WaterReaderZoneDraft extends Omit<WaterReaderPlacedZone, 'zoneId' | 'unclippedRing' | 'visibleWaterRing' | 'visibleWaterFraction'> {
  placementSemanticId: WaterReaderZonePlacementSemanticId;
  anchorSemanticId: WaterReaderZonePlacementSemanticId;
  unitId: string;
  candidateKey?: string;
  unitPriority: number;
  unitScore: number;
  allowPairCrowding?: boolean;
  featureFrameAllowsOutsideWaterCenter?: boolean;
  featureFrameContactAnchors?: PointM[];
  featureFrameContactToleranceM?: number;
  featureFrameContactMinCount?: number;
  featureFrameLocalityRadiusM?: number;
}
