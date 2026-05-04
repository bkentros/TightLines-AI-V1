import type { PointM, RingM, WaterReaderFeatureClass, WaterReaderSeason, WaterReaderSeasonGroup } from '../contracts.ts';

export type WaterReaderZonePlacementKind =
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
  | 'saddle_shoulder_endpoint'
  | 'shoreline_frame_recovery'
  | 'island_mainland_primary'
  | 'island_open_water_area'
  | 'island_open_water_proxy'
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
  diagnostics: Record<string, number | string | boolean | null>;
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
  zoneCount: number;
  selectedFeatureIds: string[];
  suppressedFeatureIds: string[];
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
}

export type WaterReaderFeatureZoneCoverageReason =
  | 'zoned'
  | 'seasonal_skip'
  | 'no_valid_draft'
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
}

export interface WaterReaderZoneDraft extends Omit<WaterReaderPlacedZone, 'zoneId' | 'unclippedRing' | 'visibleWaterRing' | 'visibleWaterFraction'> {
  placementSemanticId: WaterReaderZonePlacementSemanticId;
  anchorSemanticId: WaterReaderZonePlacementSemanticId;
  unitId: string;
  candidateKey?: string;
  unitPriority: number;
  unitScore: number;
  allowPairCrowding?: boolean;
}
