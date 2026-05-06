import type { PointM, PolygonM, RingM, WaterReaderEngineInput, WaterReaderPreprocessResult, WaterReaderSeason } from '../contracts';
import { distanceM } from '../metrics';
import { lookupWaterReaderSeason } from '../seasons';
import {
  lerpPoint,
  nearestPointOnRing,
  pointInWaterOrBoundary,
  ringCentroid,
} from '../features/validation';
import type {
  WaterReaderCoveFeature,
  WaterReaderDamFeature,
  WaterReaderDetectedFeature,
  WaterReaderIslandFeature,
  WaterReaderNeckFeature,
  WaterReaderPointFeature,
  WaterReaderSaddleFeature,
} from '../features/types';
import { featureZonePriority, visibleZoneCap, zoneDraftSort } from './priority';
import { materializeZoneDraft, violatesZoneCrowding, zonesOverlap } from './invariants';
import type {
  WaterReaderFeatureEnvelopeDiagnostics,
  WaterReaderFeatureEnvelopeGeometryKind,
  WaterReaderFeatureEnvelopeSemanticId,
  WaterReaderPlacedZone,
  WaterReaderFeatureZoneCoverage,
  WaterReaderStructureConfluenceGroup,
  WaterReaderZoneUnitDiagnostics,
  WaterReaderZoneDraft,
  WaterReaderZonePlacementDiagnostics,
  WaterReaderZonePlacementKind,
  WaterReaderZonePlacementOptions,
  WaterReaderZonePlacementResult,
  WaterReaderZonePlacementSemanticId,
} from './types';

const ASPECT_RATIO = 1.6;
const OFFSET_FACTORS = [0, 0.03, 0.06, 0.09, 0.12, 0.16, 0.2, 0.25, 0.32, 0.4] as const;
const STANDARD_SIZE_FACTORS = [1, 0.85, 0.7] as const;
const LARGE_SIZE_FACTORS = [1, 0.85, 0.72, 0.6] as const;
const LARGE_OFFSET_FACTORS = [-0.08, -0.04, 0, 0.06, 0.12, 0.2, 0.32] as const;
const CONSTRICTION_SIZE_FACTORS = [1, 0.85, 0.72, 0.6] as const;
const COVE_BACK_SIZE_FACTORS = [1.1, 1, 0.85, 0.7, 0.58] as const;
const COVE_BACK_FALLBACK_SIZE_FACTORS = [1.1, 1, 0.85, 0.7, 0.58, 0.48] as const;
const COVE_BACK_OFFSET_FACTORS = [-0.02, 0, 0.04, 0.08, 0.12, 0.18, 0.26, 0.34, 0.42] as const;
const COVE_BACK_FALLBACK_OFFSET_FACTORS = [-0.02, 0, 0.04, 0.08, 0.12, 0.18, 0.26, 0.34] as const;
const POINT_SIZE_FACTORS = [1, 0.85] as const;
const POINT_SIDE_FRACTIONS = [0.35, 0.45, 0.55] as const;
const POINT_OPEN_SIDE_FRACTIONS = [0.45, 0.55] as const;
const OPEN_WATER_SIDE_SAMPLE_STEPS = 17;
const OPEN_WATER_SIDE_RADIAL_ANGLES = 32;
const OPEN_WATER_SIDE_MIN_WATER_SAMPLES = 8;
const OPEN_WATER_SIDE_TIE_THRESHOLD_PCT = 0.08;
const POINT_OFFSET_FACTORS = [-0.06, -0.03, 0.04, 0.12, 0.24] as const;
const POINT_TIP_OFFSET_FACTORS = [-0.04, 0, 0.1, 0.22] as const;
const FALLBACK_SIZE_FACTORS = [0.85, 0.7, 0.58] as const;
const FALLBACK_OFFSET_FACTORS = [-0.03, 0.04, 0.12, 0.22, 0.34] as const;
const ISLAND_EDGE_SIZE_FACTORS = [2.5, 2, 1.5, 1.1, 1, 0.9, 0.8, 0.7, 0.55] as const;
const ISLAND_ENDPOINT_SIZE_FACTORS = [0.55, 0.42, 0.32, 0.24, 0.18] as const;
const ISLAND_EDGE_OFFSET_FACTORS = [-0.02, 0, 0.04, 0.08, 0.14, 0.22, 0.32, 0.42] as const;
const ISLAND_ENDPOINT_OFFSET_FACTORS = [-0.04, -0.02, 0, 0.03, 0.06, 0.1, 0.16] as const;
const TARGET_VISIBLE_WATER_FRACTION = 0.62;
const MAX_CANDIDATES_PER_PLACEMENT = 10;
const MAX_VALID_CANDIDATES_PER_CONSTRICTION_PLACEMENT = 4;
const MAX_SHORELINE_FRAME_VARIANTS = 5;
const TRACE_PAIR_OVERLAP_SCORE = 0.03;
const LIGHT_PAIR_OVERLAP_SCORE = 0.18;
const MODERATE_PAIR_OVERLAP_SCORE = 0.32;

type PairOverlapClass =
  | 'none_or_trace_pair_overlap'
  | 'allowed_light_pair_overlap'
  | 'allowed_moderate_pair_overlap'
  | 'strong_pair_overlap';

type LakeSizeBand = 'small' | 'medium' | 'large' | 'unknown';

type AxisSizing = {
  naturalMajorAxisM: number;
  baseMajorAxisM: number;
  minClampM: number;
  maxClampM: number;
  clampReason: string;
};

type DraftSizingMetadata = AxisSizing & {
  lakeSizeBand?: LakeSizeBand;
  readableFloorMajorAxisM?: number | null;
  readableFloorApplied?: boolean | null;
  pointProtrusionLengthM?: number | null;
  pointSideSlopeLengthM?: number | null;
  constrictionWidthM?: number | null;
  constrictionMinorAxisWidthCapM?: number | null;
  constrictionMinorAxisWidthCapRatio?: number | null;
  constrictionPreferredMinorAxisM?: number | null;
  constrictionFallbackMinorAxisM?: number | null;
  islandReadableFloorM?: number | null;
  islandNaturalScaleM?: number | null;
  islandReadableFloorApplied?: boolean | null;
  islandLocalScaleMeters?: number | null;
  islandSizeCapM?: number | null;
  islandSizeCapApplied?: boolean | null;
  islandSizeCapReason?: string | null;
  islandZoneRepresentsWholeIsland?: boolean | null;
  maxCandidateMajorAxisM?: number | null;
};

export function featureEnvelopePlacementKindForFeature(
  featureClass: WaterReaderDetectedFeature['featureClass'],
): WaterReaderZonePlacementKind | null {
  switch (featureClass) {
    case 'main_lake_point':
      return 'main_point_structure_area';
    case 'secondary_point':
      return 'secondary_point_structure_area';
    case 'cove':
      return 'cove_structure_area';
    case 'neck':
      return 'neck_structure_area';
    case 'saddle':
      return 'saddle_structure_area';
    case 'island':
      return 'island_structure_area';
    case 'dam':
      return 'dam_structure_area';
    case 'universal':
      return null;
  }
}

export function featureEnvelopeSemanticIdForFeature(
  featureClass: WaterReaderDetectedFeature['featureClass'],
): WaterReaderZonePlacementSemanticId | null {
  return featureEnvelopePlacementKindForFeature(featureClass) as WaterReaderFeatureEnvelopeSemanticId | null;
}

export function featureEnvelopeDiagnostics(
  feature: WaterReaderDetectedFeature,
  includes: string[],
  geometryKind: WaterReaderFeatureEnvelopeGeometryKind,
  suppressionReason: string | null = null,
): WaterReaderFeatureEnvelopeDiagnostics {
  return {
    featureEnvelopeModelVersion: 'feature-envelope-v1',
    featureEnvelopeSourceFeatureId: feature.featureId,
    featureEnvelopeGeometryKind: geometryKind,
    featureEnvelopeIncludes: [...includes].sort((a, b) => a.localeCompare(b)),
    featureEnvelopeSeasonInvariant: true,
    featureEnvelopeSuppressionReason: suppressionReason,
    seasonalEmphasisOnly: true,
  };
}

function featureFrameKindForFeature(featureClass: WaterReaderDetectedFeature['featureClass']): string {
  switch (featureClass) {
    case 'main_lake_point':
      return 'main_point_feature_frame';
    case 'secondary_point':
      return 'secondary_point_feature_frame';
    case 'cove':
      return 'cove_feature_frame';
    case 'neck':
      return 'neck_feature_frame';
    case 'saddle':
      return 'saddle_feature_frame';
    case 'island':
      return 'island_feature_frame';
    case 'dam':
      return 'dam_feature_frame';
    case 'universal':
      return 'universal_fallback_frame';
  }
}

export function placeWaterReaderZones(
  preprocessResult: WaterReaderPreprocessResult,
  features: WaterReaderDetectedFeature[],
  input: WaterReaderEngineInput,
  options: WaterReaderZonePlacementOptions = {},
): WaterReaderZonePlacementResult {
  const seasonLookup = lookupWaterReaderSeason(input.state, input.currentDate ?? new Date());
  const season = seasonLookup?.season ?? 'summer';
  const seasonGroup = seasonLookup?.seasonGroup ?? null;
  const primaryPolygon = preprocessResult.primaryPolygon;
  const metrics = preprocessResult.metrics;
  const emptyDiagnostics: WaterReaderZonePlacementDiagnostics = {
    draftCount: 0,
    materializedCandidateCount: 0,
    validCandidateCount: 0,
    unitCombinationAttemptCount: 0,
    placementTimingMs: {},
    unitDiagnostics: [],
    confluenceGroupCount: 0,
    confluenceGroups: [],
    detectedFeatureCount: features.length,
    selectedFeatureCount: 0,
    suppressedFeatureCount: features.length,
    selectedFeatureSuppressionCount: features.length,
    detectedUnrepresentableFeatureCount: 0,
    zoneCount: 0,
    selectedFeatureIds: [],
    suppressedFeatureIds: features.map((feature) => feature.featureId),
    selectedFeatureSuppressionIds: features.map((feature) => feature.featureId),
    detectedUnrepresentableFeatureIds: [],
    rejectedByReason: {},
    droppedByReason: {},
    universalFallbackAllowed: options.allowUniversalFallback === true,
    universalFallbackApplied: false,
    featureCoverage: [],
  };
  if (preprocessResult.supportStatus === 'not_supported' || !primaryPolygon || !metrics) {
    return { zones: [], season, seasonGroup, qaFlags: ['zone_placement_not_supported'], diagnostics: emptyDiagnostics };
  }

  const startMs = Date.now();
  const drafts = buildFeatureZoneDrafts({
    features,
    polygon: primaryPolygon,
    season,
    longestDimensionM: metrics.longestDimensionM,
    averageLakeWidthM: metrics.averageLakeWidthM,
    lakeAreaSqM: metrics.areaSqM,
    acreage: input.acreage,
  });
  const draftMs = Date.now() - startMs;
  const selected = selectValidZonesByUnit({
    drafts,
    polygon: primaryPolygon,
    longestDimensionM: metrics.longestDimensionM,
    cap: visibleZoneCap(input.acreage),
  });
  const selectMs = Date.now() - startMs - draftMs;

  const qaFlags: string[] = [];
  const diagnostics: WaterReaderZonePlacementDiagnostics = {
    draftCount: drafts.length,
    materializedCandidateCount: selected.materializedCandidateCount,
    validCandidateCount: selected.validCandidateCount,
    unitCombinationAttemptCount: selected.unitCombinationAttemptCount,
    placementTimingMs: {
      draftMs,
      selectMs,
      totalMs: Date.now() - startMs,
    },
    unitDiagnostics: selected.unitDiagnostics,
    confluenceGroupCount: 0,
    confluenceGroups: [],
    detectedFeatureCount: features.length,
    selectedFeatureCount: 0,
    suppressedFeatureCount: 0,
    selectedFeatureSuppressionCount: 0,
    detectedUnrepresentableFeatureCount: 0,
    zoneCount: 0,
    selectedFeatureIds: [],
    suppressedFeatureIds: [],
    selectedFeatureSuppressionIds: [],
    detectedUnrepresentableFeatureIds: [],
    rejectedByReason: selected.rejectedByReason,
    droppedByReason: selected.droppedByReason,
    universalFallbackAllowed: options.allowUniversalFallback === true,
    universalFallbackApplied: false,
    featureCoverage: [],
  };
  let zones = selected.zones;
  if (options.allowUniversalFallback === true && zones.length < 2) {
    qaFlags.push('universal_fallback_applied');
    const fallback = addUniversalFallbackZones({
      zones,
      polygon: primaryPolygon,
      longestDimensionM: metrics.longestDimensionM,
      cap: visibleZoneCap(input.acreage),
    });
    zones = fallback.zones;
    diagnostics.universalFallbackApplied = fallback.applied;
    Object.assign(diagnostics.rejectedByReason, mergeCounts(diagnostics.rejectedByReason, fallback.rejectedByReason));
    Object.assign(diagnostics.droppedByReason, mergeCounts(diagnostics.droppedByReason, fallback.droppedByReason));
  }
  const dependencyResult = enforceSecondaryPointDependencies(zones, features);
  zones = dependencyResult.zones;
  if (dependencyResult.droppedSecondaryCount > 0) {
    diagnostics.droppedByReason = mergeCounts(diagnostics.droppedByReason, {
      parent_cove_not_zoned: dependencyResult.droppedSecondaryCount,
    });
  }
  zones = assignZoneIds(zones);
  const confluenceResult = annotateStructureConfluence(zones);
  zones = confluenceResult.zones;
  diagnostics.confluenceGroupCount = confluenceResult.groups.length;
  diagnostics.confluenceGroups = confluenceResult.groups;
  diagnostics.featureCoverage = buildFeatureCoverage({
    features,
    drafts,
    zones,
    season,
    unitOutcomes: selected.unitOutcomes,
    secondaryDependencyDrops: dependencyResult.droppedFeatureIds,
  });
  diagnostics.zoneCount = zones.length;
  diagnostics.selectedFeatureIds = diagnostics.featureCoverage
    .filter((coverage) => coverage.producedVisibleZones)
    .map((coverage) => coverage.featureId);
  diagnostics.detectedUnrepresentableFeatureIds = diagnostics.featureCoverage
    .filter((coverage) => coverage.reason === 'feature_frame_unrepresentable')
    .map((coverage) => coverage.featureId);
  diagnostics.selectedFeatureSuppressionIds = diagnostics.featureCoverage
    .filter((coverage) => !coverage.producedVisibleZones && coverage.reason !== 'feature_frame_unrepresentable')
    .map((coverage) => coverage.featureId);
  diagnostics.suppressedFeatureIds = diagnostics.selectedFeatureSuppressionIds;
  diagnostics.selectedFeatureCount = diagnostics.selectedFeatureIds.length;
  diagnostics.selectedFeatureSuppressionCount = diagnostics.selectedFeatureSuppressionIds.length;
  diagnostics.suppressedFeatureCount = diagnostics.selectedFeatureSuppressionCount;
  diagnostics.detectedUnrepresentableFeatureCount = diagnostics.detectedUnrepresentableFeatureIds.length;
  if (zones.length > visibleZoneCap(input.acreage)) {
    qaFlags.push('zone_cap_exceeded_for_structure_coverage');
  }
  if (zones.length === 0) {
    qaFlags.push('no_visible_seasonal_zones');
    if (features.some((feature) => isActiveHighPriorityFeature(feature, season))) {
      qaFlags.push('high_priority_structure_unrendered');
    }
  }

  return {
    zones,
    season,
    seasonGroup,
    qaFlags,
    diagnostics,
  };
}

function buildFeatureZoneDrafts(params: {
  features: WaterReaderDetectedFeature[];
  polygon: PolygonM;
  season: WaterReaderSeason;
  longestDimensionM: number;
  averageLakeWidthM: number;
  lakeAreaSqM: number;
  acreage?: number | null;
}): WaterReaderZoneDraft[] {
  const coveIds = new Set(params.features.filter((feature) => feature.featureClass === 'cove').map((feature) => feature.featureId));
  const covesById = new Map(params.features
    .filter((feature): feature is WaterReaderCoveFeature => feature.featureClass === 'cove')
    .map((feature) => [feature.featureId, feature]));
  const drafts: WaterReaderZoneDraft[] = [];
  for (const feature of params.features) {
    switch (feature.featureClass) {
      case 'neck':
        drafts.push(...constrictionStructureAreaDrafts(feature, params));
        break;
      case 'saddle':
        drafts.push(...constrictionStructureAreaDrafts(feature, params));
        break;
      case 'main_lake_point':
        drafts.push(...pointStructureAreaDrafts(feature, params));
        break;
      case 'secondary_point':
        if (feature.parentCoveId && coveIds.has(feature.parentCoveId)) drafts.push(...pointStructureAreaDrafts(feature, { ...params, covesById }));
        break;
      case 'cove':
        drafts.push(...coveStructureAreaDrafts(feature, params));
        break;
      case 'island':
        drafts.push(...islandStructureAreaDrafts(feature, params));
        break;
      case 'dam':
        drafts.push(...damStructureAreaDrafts(feature, params));
        break;
      case 'universal':
        break;
    }
  }
  return drafts;
}

function pointStructureAreaDrafts(
  feature: WaterReaderPointFeature,
  params: { polygon: PolygonM; longestDimensionM: number; averageLakeWidthM: number; lakeAreaSqM: number; acreage?: number | null; covesById?: Map<string, WaterReaderCoveFeature> },
): WaterReaderZoneDraft[] {
  const placementKind = feature.featureClass === 'secondary_point' ? 'secondary_point_structure_area' : 'main_point_structure_area';
  const geometryKind: WaterReaderFeatureEnvelopeGeometryKind = 'point_local_span';
  const includes = feature.featureClass === 'secondary_point'
    ? ['tip', 'left_slope', 'right_slope', 'local_secondary_point_span']
    : ['tip', 'left_slope', 'right_slope', 'local_point_span'];
  const refs = [feature.tip, feature.leftSlope, feature.rightSlope, feature.baseMidpoint].filter((point): point is PointM => Boolean(point));
  const localSpanM = maxPairDistanceM(refs);
  const sideSpanM = distanceM(feature.leftSlope, feature.rightSlope);
  const protrusionM = finiteNumber(feature.protrusionLengthM, localSpanM * 0.55);
  const floorM = readableFloorMajorAxisM(placementKind, params.longestDimensionM, params.acreage);
  const lakeCapM = params.longestDimensionM * (feature.featureClass === 'secondary_point' ? 0.038 : 0.055);
  const sideCapM = Math.max(sideSpanM * 1.7 + protrusionM * 0.65, floorM * 1.08);
  const majorAxisM = clamp(localSpanM * 1.18 + Math.max(14, sideSpanM * 0.18), floorM, Math.max(floorM, Math.min(lakeCapM, sideCapM)));
  const minorAxisM = clamp(Math.max(majorAxisM / 2.15, protrusionM * 0.72, floorM * 0.52), majorAxisM * 0.42, majorAxisM * 0.76);
  const center = averagePoint(refs);
  const anchor = shorelineAnchor(feature.tip, params.polygon);
  const sideCentroid = averagePoint([feature.leftSlope, feature.rightSlope]);
  const sideRotation = Math.atan2(feature.rightSlope.y - feature.leftSlope.y, feature.rightSlope.x - feature.leftSlope.x);
  const axisRotation = normalizeAngle(sideRotation + Math.PI / 2);
  const candidateCenters = [
    center,
    lerpPoint(feature.tip, center, 0.72),
    lerpPoint(anchor, feature.tip, 0.55),
    lerpPoint(anchor, sideCentroid, 0.52),
    lerpPoint(feature.tip, sideCentroid, 0.48),
    feature.baseMidpoint ? lerpPoint(feature.baseMidpoint, feature.tip, 0.58) : lerpPoint(center, feature.tip, 0.35),
    ...inwardOffsetCenters({
      anchor,
      polygon: params.polygon,
      longestDimensionM: params.longestDimensionM,
      majorAxisM,
      preferredDirection: feature.baseMidpoint
        ? { x: feature.tip.x - feature.baseMidpoint.x, y: feature.tip.y - feature.baseMidpoint.y }
        : { x: feature.tip.x - sideCentroid.x, y: feature.tip.y - sideCentroid.y },
      fallbackNormal: { x: center.x - anchor.x, y: center.y - anchor.y },
      offsetFactors: [0.18, 0.3, 0.42],
    }),
  ];
  const frameContactAnchors = uniquePoints([
    anchor,
    shorelineAnchor(feature.tip, params.polygon),
    shorelineAnchor(feature.leftSlope, params.polygon),
    shorelineAnchor(feature.rightSlope, params.polygon),
    feature.baseMidpoint ? shorelineAnchor(feature.baseMidpoint, params.polygon) : null,
    feature.tip,
    feature.leftSlope,
    feature.rightSlope,
  ].filter((point): point is PointM => Boolean(point)));
  const rotations = uniqueNumbers([axisRotation, sideRotation]);
  const sizeFactors = [1, 0.84, 0.68, 0.54] as const;
  const pointRenderLobeMajorAxisM = clamp(
    Math.max(floorM * 0.58, sideSpanM * 0.62 + protrusionM * 0.22),
    floorM * 0.5,
    majorAxisM * 0.68,
  );
  const pointRenderLobeMinorAxisM = clamp(
    Math.max(floorM * 0.34, pointRenderLobeMajorAxisM * 0.56),
    floorM * 0.28,
    majorAxisM * 0.48,
  );
  const pointTipRenderLobeMajorAxisM = Math.max(floorM * 0.52, pointRenderLobeMajorAxisM * 0.84);
  const pointTipRenderLobeMinorAxisM = Math.max(floorM * 0.32, pointRenderLobeMinorAxisM * 0.9);
  const drafts: WaterReaderZoneDraft[] = [];
  const pointCenters = uniquePoints(candidateCenters);
  for (const [centerIndex, ovalCenter] of pointCenters.entries()) {
    const centerAnchors = uniquePoints([anchor, shorelineAnchor(ovalCenter, params.polygon)]);
    for (const [sizeIndex, sizeFactor] of sizeFactors.entries()) {
      for (const [rotationIndex, rotationRad] of rotations.entries()) {
        for (const [anchorIndex, candidateAnchor] of centerAnchors.entries()) {
          drafts.push(makeFeatureEnvelopeDraft({
            feature,
            placementKind,
            semanticId: placementKind,
            geometryKind,
            includes,
            anchor: candidateAnchor,
            ovalCenter,
            majorAxisM: Math.max(floorM * 0.62, majorAxisM * sizeFactor),
            minorAxisM: Math.max(floorM * 0.38, minorAxisM * sizeFactor),
            rotationRad,
            candidateSuffix: `point-recovery-c${centerIndex + 1}-a${anchorIndex + 1}-s${sizeIndex + 1}-r${rotationIndex + 1}`,
            recoveryTier: sizeIndex === 0 && centerIndex <= 1 ? 'full_point_reference' : 'bounded_point_recovery',
            polygon: params.polygon,
            longestDimensionM: params.longestDimensionM,
            averageLakeWidthM: params.averageLakeWidthM,
            lakeAreaSqM: params.lakeAreaSqM,
            acreage: params.acreage,
            featureFrameAllowsOutsideWaterCenter: true,
            featureFrameContactAnchors: frameContactAnchors,
            featureFrameContactToleranceM: Math.max(8, minorAxisM * 0.22),
            featureFrameLocalityRadiusM: Math.max(majorAxisM * 0.72, localSpanM * 1.15),
            additionalDiagnostics: {
              localPointSpanM: roundDiagnosticNumber(localSpanM),
              pointSideSlopeSpanM: roundDiagnosticNumber(sideSpanM),
              wholeFeaturePointEnvelopeCandidate: true,
              wholeFeatureOutsideWaterCenterEligible: true,
              pointEnvelopeLakeCapM: roundDiagnosticNumber(lakeCapM),
              pointEnvelopeSideCapM: roundDiagnosticNumber(sideCapM),
              featureEnvelopeRenderShape: 'merged_point_lobes',
              featureEnvelopeRenderLobeCount: 3,
              featureEnvelopeRenderLobe1Kind: 'tip_lobe',
              featureEnvelopeRenderLobe1CenterX: roundDiagnosticNumber(feature.tip.x),
              featureEnvelopeRenderLobe1CenterY: roundDiagnosticNumber(feature.tip.y),
              featureEnvelopeRenderLobe1MajorAxisM: roundDiagnosticNumber(pointTipRenderLobeMajorAxisM),
              featureEnvelopeRenderLobe1MinorAxisM: roundDiagnosticNumber(pointTipRenderLobeMinorAxisM),
              featureEnvelopeRenderLobe1RotationRad: roundDiagnosticNumber(axisRotation),
              featureEnvelopeRenderLobe2Kind: 'left_shoulder_lobe',
              featureEnvelopeRenderLobe2CenterX: roundDiagnosticNumber(feature.leftSlope.x),
              featureEnvelopeRenderLobe2CenterY: roundDiagnosticNumber(feature.leftSlope.y),
              featureEnvelopeRenderLobe2MajorAxisM: roundDiagnosticNumber(pointRenderLobeMajorAxisM),
              featureEnvelopeRenderLobe2MinorAxisM: roundDiagnosticNumber(pointRenderLobeMinorAxisM),
              featureEnvelopeRenderLobe2RotationRad: roundDiagnosticNumber(sideRotation),
              featureEnvelopeRenderLobe3Kind: 'right_shoulder_lobe',
              featureEnvelopeRenderLobe3CenterX: roundDiagnosticNumber(feature.rightSlope.x),
              featureEnvelopeRenderLobe3CenterY: roundDiagnosticNumber(feature.rightSlope.y),
              featureEnvelopeRenderLobe3MajorAxisM: roundDiagnosticNumber(pointRenderLobeMajorAxisM),
              featureEnvelopeRenderLobe3MinorAxisM: roundDiagnosticNumber(pointRenderLobeMinorAxisM),
              featureEnvelopeRenderLobe3RotationRad: roundDiagnosticNumber(sideRotation),
              pointEnvelopeTipLobeIncluded: true,
              pointEnvelopeLeftShoulderLobeIncluded: true,
              pointEnvelopeRightShoulderLobeIncluded: true,
              featureEnvelopeAnchorAdjustedToShoreline: distanceM(candidateAnchor, feature.tip) > 0.01,
              pointEnvelopeRecoveryCenterIndex: centerIndex + 1,
              pointEnvelopeRecoveryAnchorIndex: anchorIndex + 1,
              pointEnvelopeRecoverySizeFactor: sizeFactor,
              pointEnvelopeRecoveryRotationIndex: rotationIndex + 1,
              selectedSizeFactor: sizeFactor,
              selectedAnchorIndex: anchorIndex + 1,
              selectedRotationIndex: rotationIndex + 1,
              featureFrameCandidateCenterCount: pointCenters.length,
              featureFrameContactAnchorCount: centerAnchors.length,
              featureFrameWaterSideInteriorCandidateCount: pointCenters.length,
              featureFrameContactWindowCount: 1,
            },
          }));
        }
      }
    }
  }
  return drafts;
}

function coveStructureAreaDrafts(
  feature: WaterReaderCoveFeature,
  params: { polygon: PolygonM; longestDimensionM: number; averageLakeWidthM: number; lakeAreaSqM: number; acreage?: number | null },
): WaterReaderZoneDraft[] {
  const placementKind = 'cove_structure_area';
  const mouthMidpoint = midpoint(feature.mouthLeft, feature.mouthRight);
  const innerReference = feature.shorePath[Math.max(0, Math.floor(feature.shorePath.length / 2))] ?? feature.back;
  const refs = [feature.mouthLeft, feature.mouthRight, feature.back, innerReference];
  const localExtentM = Math.max(maxPairDistanceM(refs), feature.mouthWidthM, feature.coveDepthM);
  const floorM = readableFloorMajorAxisM(placementKind, params.longestDimensionM, params.acreage);
  const broadScanCapM = params.longestDimensionM * 0.072;
  const coveReferenceCapM = Math.max(floorM, Math.max(feature.mouthWidthM * 1.55, feature.coveDepthM * 1.45));
  const majorAxisM = clamp(localExtentM * 1.05, floorM, Math.max(floorM, Math.min(broadScanCapM, coveReferenceCapM)));
  const minorAxisM = clamp(Math.max(feature.mouthWidthM * 0.92, majorAxisM / 2.35, floorM * 0.55), majorAxisM * 0.38, majorAxisM * 0.78);
  const rotationRad = Math.atan2(mouthMidpoint.y - feature.back.y, mouthMidpoint.x - feature.back.x);
  const shoulderCenter = averagePoint([feature.mouthLeft, feature.mouthRight, innerReference]);
  const centers = [
    lerpPoint(feature.back, mouthMidpoint, 0.42),
    lerpPoint(feature.back, mouthMidpoint, 0.55),
    lerpPoint(feature.back, innerReference, 0.42),
    lerpPoint(innerReference, mouthMidpoint, 0.42),
    shoulderCenter,
    averagePoint(refs),
  ];
  const anchors = uniquePoints([
    shorelineAnchor(feature.back, params.polygon),
    shorelineAnchor(innerReference, params.polygon),
    shorelineAnchor(feature.mouthLeft, params.polygon),
    shorelineAnchor(feature.mouthRight, params.polygon),
  ]);
  const rotations = uniqueNumbers([rotationRad, Math.atan2(feature.mouthRight.y - feature.mouthLeft.y, feature.mouthRight.x - feature.mouthLeft.x)]);
  const sizeFactors = [1, 0.82, 0.66, 0.5] as const;
  const drafts: WaterReaderZoneDraft[] = [];
  const coveCenters = uniquePoints(centers);
  for (const [centerIndex, ovalCenter] of coveCenters.entries()) {
    const centerAnchors = uniquePoints([...anchors, shorelineAnchor(ovalCenter, params.polygon)]).slice(0, 5);
    for (const [anchorIndex, anchor] of centerAnchors.entries()) {
      for (const [sizeIndex, sizeFactor] of sizeFactors.entries()) {
        for (const [rotationIndex, candidateRotation] of rotations.entries()) {
          drafts.push(makeFeatureEnvelopeDraft({
            feature,
            placementKind,
            semanticId: placementKind,
            geometryKind: 'cove_local_envelope',
            includes: ['mouth_left', 'mouth_right', 'back_reference', 'inner_shoreline_reference'],
            anchor,
            ovalCenter,
            majorAxisM: Math.max(floorM * 0.58, majorAxisM * sizeFactor),
            minorAxisM: Math.max(floorM * 0.36, minorAxisM * sizeFactor),
            rotationRad: candidateRotation,
            candidateSuffix: `cove-recovery-c${centerIndex + 1}-a${anchorIndex + 1}-s${sizeIndex + 1}-r${rotationIndex + 1}`,
            recoveryTier: sizeIndex === 0 && centerIndex <= 1 ? 'full_cove_reference' : 'conservative_bounded_cove_reference',
            polygon: params.polygon,
            longestDimensionM: params.longestDimensionM,
            averageLakeWidthM: params.averageLakeWidthM,
            lakeAreaSqM: params.lakeAreaSqM,
            acreage: params.acreage,
            additionalDiagnostics: {
              coveEnvelopeLocalExtentM: roundDiagnosticNumber(localExtentM),
              coveEnvelopeBroadScanCapM: roundDiagnosticNumber(broadScanCapM),
              coveEnvelopeReferenceCapM: roundDiagnosticNumber(coveReferenceCapM),
              coveEnvelopeRecoveryCenterIndex: centerIndex + 1,
              coveEnvelopeRecoveryAnchorIndex: anchorIndex + 1,
              coveEnvelopeRecoverySizeFactor: sizeFactor,
              coveEnvelopeRecoveryRotationIndex: rotationIndex + 1,
              coveEnvelopeConservativeBoundedReference: sizeIndex > 0 || centerIndex > 1,
              selectedSizeFactor: sizeFactor,
              selectedAnchorIndex: anchorIndex + 1,
              selectedRotationIndex: rotationIndex + 1,
              featureFrameCandidateCenterCount: coveCenters.length,
              featureFrameContactAnchorCount: centerAnchors.length,
              featureFrameWaterSideInteriorCandidateCount: coveCenters.length,
              featureFrameContactWindowCount: 2,
            },
          }));
        }
      }
    }
  }
  return drafts;
}

function constrictionStructureAreaDrafts(
  feature: WaterReaderNeckFeature | WaterReaderSaddleFeature,
  params: { polygon: PolygonM; longestDimensionM: number; averageLakeWidthM: number; lakeAreaSqM: number; acreage?: number | null },
): WaterReaderZoneDraft[] {
  const placementKind = feature.featureClass === 'neck' ? 'neck_structure_area' : 'saddle_structure_area';
  const spanM = distanceM(feature.endpointA, feature.endpointB);
  const floorM = readableFloorMajorAxisM(placementKind, params.longestDimensionM, params.acreage);
  const lakeCapM = params.longestDimensionM * (feature.featureClass === 'neck' ? 0.065 : 0.058);
  const widthCapM = Math.max(floorM, feature.widthM * (feature.featureClass === 'neck' ? 3.1 : 2.7) + spanM * 0.55);
  const majorAxisM = clamp(spanM * 1.22 + feature.widthM * 1.25, floorM, Math.max(floorM, Math.min(lakeCapM, widthCapM)));
  const minorAxisM = clamp(Math.max(feature.widthM * 1.75, majorAxisM / 3.15, floorM * 0.48), majorAxisM * 0.32, majorAxisM * 0.68);
  const center = midpoint(feature.endpointA, feature.endpointB);
  const axis = normalize({ x: feature.endpointB.x - feature.endpointA.x, y: feature.endpointB.y - feature.endpointA.y }) ?? { x: 1, y: 0 };
  const perpendicular = { x: -axis.y, y: axis.x };
  const shoulderOffsetM = Math.max(feature.widthM * 0.36, minorAxisM * 0.16);
  const centers = uniquePoints([
    center,
    { x: center.x + perpendicular.x * shoulderOffsetM, y: center.y + perpendicular.y * shoulderOffsetM },
    { x: center.x - perpendicular.x * shoulderOffsetM, y: center.y - perpendicular.y * shoulderOffsetM },
    lerpPoint(center, feature.endpointA, 0.18),
    lerpPoint(center, feature.endpointB, 0.18),
  ]);
  const anchors = uniquePoints([
    shorelineAnchor(feature.endpointA, params.polygon),
    shorelineAnchor(feature.endpointB, params.polygon),
  ]);
  const shoulderWindowM = Math.max(spanM * 0.08, feature.widthM * 0.35, 10);
  const shoulderLobeMajorAxisM = clamp(
    Math.max(floorM * 0.68, feature.widthM * 1.55, spanM * 0.42),
    floorM * 0.55,
    majorAxisM * 0.72,
  );
  const shoulderLobeMinorAxisM = clamp(
    Math.max(floorM * 0.42, feature.widthM * 1.25, shoulderLobeMajorAxisM * 0.58),
    floorM * 0.34,
    majorAxisM * 0.58,
  );
  const contactAnchors = uniquePoints([
    ...anchors,
    feature.endpointA,
    feature.endpointB,
    { x: feature.endpointA.x + axis.x * shoulderWindowM, y: feature.endpointA.y + axis.y * shoulderWindowM },
    { x: feature.endpointA.x - axis.x * shoulderWindowM, y: feature.endpointA.y - axis.y * shoulderWindowM },
    { x: feature.endpointB.x + axis.x * shoulderWindowM, y: feature.endpointB.y + axis.y * shoulderWindowM },
    { x: feature.endpointB.x - axis.x * shoulderWindowM, y: feature.endpointB.y - axis.y * shoulderWindowM },
  ]);
  const sizeFactors = [1, 0.86, 0.7] as const;
  const drafts: WaterReaderZoneDraft[] = [];
  for (const [centerIndex, ovalCenter] of centers.entries()) {
    for (const [anchorIndex, anchor] of anchors.entries()) {
      for (const [sizeIndex, sizeFactor] of sizeFactors.entries()) {
        drafts.push(makeFeatureEnvelopeDraft({
          feature,
          placementKind,
          semanticId: placementKind,
          geometryKind: 'constriction_grouped_shoulders',
          includes: ['shoreline_a_shoulder', 'shoreline_b_shoulder', 'constriction_reference'],
          anchor,
          ovalCenter,
          majorAxisM: Math.max(floorM * 0.7, majorAxisM * sizeFactor),
          minorAxisM: Math.max(floorM * 0.42, minorAxisM * sizeFactor),
          rotationRad: Math.atan2(feature.endpointB.y - feature.endpointA.y, feature.endpointB.x - feature.endpointA.x),
          candidateSuffix: `grouped-shoulders-c${centerIndex + 1}-a${anchorIndex + 1}-s${sizeIndex + 1}`,
          recoveryTier: centerIndex === 0 && sizeIndex === 0 ? 'grouped_shoulder_reference' : 'bounded_grouped_shoulder_recovery',
          polygon: params.polygon,
          longestDimensionM: params.longestDimensionM,
          averageLakeWidthM: params.averageLakeWidthM,
          lakeAreaSqM: params.lakeAreaSqM,
          acreage: params.acreage,
          allowPairCrowding: true,
          featureFrameContactAnchors: contactAnchors,
          featureFrameContactToleranceM: Math.max(10, minorAxisM * 0.28, shoulderWindowM),
          featureFrameContactMinCount: 2,
          featureFrameLocalityRadiusM: Math.max(majorAxisM * 0.82, spanM * 1.18),
          additionalDiagnostics: {
            constrictionSpanM: roundDiagnosticNumber(spanM),
            constrictionEnvelopeLakeCapM: roundDiagnosticNumber(lakeCapM),
            constrictionEnvelopeWidthCapM: roundDiagnosticNumber(widthCapM),
            constrictionEnvelopeShoulderOffsetM: roundDiagnosticNumber(shoulderOffsetM),
            featureEnvelopeRenderShape: 'paired_shoulder_lobes',
            featureEnvelopeRenderLobeCount: 2,
            featureEnvelopeRenderLobe1Kind: 'shoreline_a_shoulder_lobe',
            featureEnvelopeRenderLobe1CenterX: roundDiagnosticNumber(feature.endpointA.x),
            featureEnvelopeRenderLobe1CenterY: roundDiagnosticNumber(feature.endpointA.y),
            featureEnvelopeRenderLobe1MajorAxisM: roundDiagnosticNumber(shoulderLobeMajorAxisM),
            featureEnvelopeRenderLobe1MinorAxisM: roundDiagnosticNumber(shoulderLobeMinorAxisM),
            featureEnvelopeRenderLobe1RotationRad: roundDiagnosticNumber(Math.atan2(feature.endpointB.y - feature.endpointA.y, feature.endpointB.x - feature.endpointA.x)),
            featureEnvelopeRenderLobe2Kind: 'shoreline_b_shoulder_lobe',
            featureEnvelopeRenderLobe2CenterX: roundDiagnosticNumber(feature.endpointB.x),
            featureEnvelopeRenderLobe2CenterY: roundDiagnosticNumber(feature.endpointB.y),
            featureEnvelopeRenderLobe2MajorAxisM: roundDiagnosticNumber(shoulderLobeMajorAxisM),
            featureEnvelopeRenderLobe2MinorAxisM: roundDiagnosticNumber(shoulderLobeMinorAxisM),
            featureEnvelopeRenderLobe2RotationRad: roundDiagnosticNumber(Math.atan2(feature.endpointA.y - feature.endpointB.y, feature.endpointA.x - feature.endpointB.x)),
            constrictionRepresentation: 'paired_lobe_feature_envelope',
            constrictionPairedShoulderCoverage: true,
            constrictionEnvelopeRatio: roundDiagnosticNumber(majorAxisM / Math.max(1, spanM)),
            constrictionEnvelopeRecoveryCenterIndex: centerIndex + 1,
            constrictionEnvelopeRecoveryAnchorIndex: anchorIndex + 1,
            constrictionEnvelopeRecoverySizeFactor: sizeFactor,
            constrictionShoulderContactWindowM: roundDiagnosticNumber(shoulderWindowM),
            groupedShoulderContactWindowCandidate: true,
            selectedSizeFactor: sizeFactor,
            selectedAnchorIndex: anchorIndex + 1,
            featureFrameCandidateCenterCount: centers.length,
            featureFrameContactAnchorCount: anchors.length,
            featureFrameWaterSideInteriorCandidateCount: centers.length,
            featureFrameContactWindowCount: 2,
            readabilityFallbackReason: 'feature_envelope_grouped_shoulders',
          },
        }));
      }
    }
  }
  return drafts;
}

function islandStructureAreaDrafts(
  feature: WaterReaderIslandFeature,
  params: { polygon: PolygonM; longestDimensionM: number; averageLakeWidthM: number; lakeAreaSqM: number; acreage?: number | null },
): WaterReaderZoneDraft[] {
  const ringCenter = ringCentroid(feature.ring);
  const anchor = feature.endpointA ?? nearestPointOnRing(ringCenter, feature.ring);
  const localRadiusM = Math.max(8, islandLocalScale(feature) / 2);
  const bufferM = clamp(localRadiusM * 0.42, 12, Math.max(14, params.longestDimensionM * 0.008));
  const readableFloorM = readableFloorMajorAxisM('island_structure_area', params.longestDimensionM, params.acreage);
  const floorM = Math.min(readableFloorM, Math.max(90, localRadiusM * 2.6 + bufferM * 2));
  const naturalIslandEnvelopeM = localRadiusM * 2.4 + bufferM * 2.2;
  const lakeCapM = Math.max(naturalIslandEnvelopeM, Math.min(params.longestDimensionM * 0.075, localRadiusM * 3.4 + bufferM * 2.5));
  const majorAxisM = clamp(naturalIslandEnvelopeM, floorM, Math.max(floorM, lakeCapM));
  const minorAxisM = clamp(localRadiusM * 2 + bufferM * 2, majorAxisM * 0.62, majorAxisM * 0.96);
  const islandContactAnchors = uniquePoints([
    anchor,
    ...(feature.endpointB ? [feature.endpointB] : []),
    ...sampleRingPoints(feature.ring, 8),
  ]);
  const centers = [
    ringCenter,
    lerpPoint(ringCenter, anchor, 0.08),
    lerpPoint(ringCenter, anchor, -0.08),
  ];
  const rotationRad = feature.endpointB
    ? Math.atan2(feature.endpointB.y - anchor.y, feature.endpointB.x - anchor.x)
    : 0;
  return centers.map((ovalCenter, index) =>
    makeFeatureEnvelopeDraft({
      feature,
      placementKind: 'island_structure_area',
      semanticId: 'island_structure_area',
      geometryKind: 'island_structure_envelope',
      includes: ['island_ring', 'island_edge', 'adjacent_water_buffer'],
      anchor,
      ovalCenter,
      majorAxisM,
      minorAxisM,
      rotationRad,
      candidateSuffix: `island-centered-${index + 1}`,
      polygon: params.polygon,
      longestDimensionM: params.longestDimensionM,
      averageLakeWidthM: params.averageLakeWidthM,
      lakeAreaSqM: params.lakeAreaSqM,
      acreage: params.acreage,
      featureFrameAllowsOutsideWaterCenter: true,
      featureFrameContactAnchors: islandContactAnchors,
      featureFrameContactToleranceM: Math.max(6, bufferM * 0.45),
      featureFrameContactMinCount: 1,
      featureFrameLocalityRadiusM: Math.max(majorAxisM * 0.82, localRadiusM + bufferM * 2.4),
      additionalDiagnostics: {
        islandEnvelopeReadableFloorM: roundDiagnosticNumber(readableFloorM),
        islandStructureAreaCentered: index === 0,
        islandStructureAreaCenterSource: index === 0 ? 'island_ring_centroid' : 'bounded_centroid_recovery',
        islandCentroidX: roundDiagnosticNumber(ringCenter.x),
        islandCentroidY: roundDiagnosticNumber(ringCenter.y),
        islandEnvelopeRingCenterX: roundDiagnosticNumber(ringCenter.x),
        islandEnvelopeRingCenterY: roundDiagnosticNumber(ringCenter.y),
        islandEnvelopeLocalRadiusM: roundDiagnosticNumber(localRadiusM),
        islandBufferRadiusM: roundDiagnosticNumber(localRadiusM + bufferM),
        islandEnvelopeAdjacentWaterBufferM: roundDiagnosticNumber(bufferM),
        islandLandInteriorClippedByLakeHole: params.polygon.holes.some((hole) => ringsSameByCoordinate(hole, feature.ring)),
        islandLandHoleClippingBehavior: 'lake_polygon_evenodd_hole_clip',
        islandEnvelopeRecoveryCenterIndex: index + 1,
        featureFrameCandidateCenterCount: centers.length,
        featureFrameContactAnchorCount: islandContactAnchors.length,
        featureFrameWaterSideInteriorCandidateCount: centers.length,
        featureFrameContactWindowCount: islandContactAnchors.length,
      },
    }),
  );
}

function damStructureAreaDrafts(
  feature: WaterReaderDamFeature,
  params: { polygon: PolygonM; longestDimensionM: number; averageLakeWidthM: number; lakeAreaSqM: number; acreage?: number | null },
): WaterReaderZoneDraft[] {
  const floorM = readableFloorMajorAxisM('dam_structure_area', params.longestDimensionM, params.acreage);
  const lakeCapM = params.longestDimensionM * 0.06;
  const majorAxisM = clamp(feature.segmentLengthM * 1.12 + floorM * 0.18, floorM, Math.max(floorM, lakeCapM));
  const minorAxisM = clamp(Math.max(majorAxisM / 3.45, floorM * 0.45), majorAxisM * 0.28, majorAxisM * 0.58);
  return [
    makeFeatureEnvelopeDraft({
      feature,
      placementKind: 'dam_structure_area',
      semanticId: 'dam_structure_area',
      geometryKind: 'dam_segment_envelope',
      includes: ['dam_segment', 'left_transition_corner', 'right_transition_corner'],
      anchor: feature.cornerA,
      ovalCenter: midpoint(feature.cornerA, feature.cornerB),
      majorAxisM,
      minorAxisM,
      rotationRad: Math.atan2(feature.cornerB.y - feature.cornerA.y, feature.cornerB.x - feature.cornerA.x),
      candidateSuffix: 'dam-segment',
      polygon: params.polygon,
      longestDimensionM: params.longestDimensionM,
      averageLakeWidthM: params.averageLakeWidthM,
      lakeAreaSqM: params.lakeAreaSqM,
      acreage: params.acreage,
      additionalDiagnostics: {
        damEnvelopeLakeCapM: roundDiagnosticNumber(lakeCapM),
        featureFrameCandidateCenterCount: 1,
        featureFrameContactAnchorCount: 1,
        featureFrameWaterSideInteriorCandidateCount: 1,
        featureFrameContactWindowCount: 1,
      },
    }),
  ];
}

function makeFeatureEnvelopeDraft(params: {
  feature: WaterReaderDetectedFeature;
  placementKind: WaterReaderZonePlacementKind;
  semanticId: WaterReaderFeatureEnvelopeSemanticId;
  geometryKind: WaterReaderFeatureEnvelopeGeometryKind;
  includes: string[];
  anchor: PointM;
  ovalCenter: PointM;
  majorAxisM: number;
  minorAxisM: number;
  rotationRad: number;
  candidateSuffix: string;
  recoveryTier?: string;
  polygon: PolygonM;
  longestDimensionM: number;
  averageLakeWidthM: number;
  lakeAreaSqM: number;
  acreage?: number | null;
  allowPairCrowding?: boolean;
  featureFrameAllowsOutsideWaterCenter?: boolean;
  featureFrameContactAnchors?: PointM[];
  featureFrameContactToleranceM?: number;
  featureFrameContactMinCount?: number;
  featureFrameLocalityRadiusM?: number;
  additionalDiagnostics?: Record<string, number | string | boolean | string[] | null>;
}): WaterReaderZoneDraft {
  const prominence = featureProminenceDiagnostics({
    feature: params.feature,
    placementKind: params.placementKind,
    longestDimensionM: params.longestDimensionM,
    averageLakeWidthM: params.averageLakeWidthM,
    lakeAreaSqM: params.lakeAreaSqM,
    acreage: params.acreage,
    readableFloorApplied: true,
  });
  const rawSourceRank = params.feature.metrics.rank;
  const sourceRank = typeof rawSourceRank === 'number' && Number.isFinite(rawSourceRank) ? rawSourceRank : 9999;
  const unitScore = prominence.featureProminenceScore;
  return {
    unitId: params.feature.featureId,
    candidateKey: `${params.feature.featureId}:${params.placementKind}`,
    unitPriority: featureZonePriority(params.feature),
    unitScore,
    sourceFeatureId: params.feature.featureId,
    featureClass: params.feature.featureClass,
    placementKind: params.placementKind,
    placementSemanticId: params.semanticId,
    anchorSemanticId: params.semanticId,
    anchor: params.anchor,
    ovalCenter: params.ovalCenter,
    majorAxisM: params.majorAxisM,
    minorAxisM: params.minorAxisM,
    rotationRad: params.rotationRad,
    diagnostics: {
      sourceRank,
      unitScore,
      placementSemanticId: params.semanticId,
      anchorSemanticId: params.semanticId,
      selectedSizeFactor: 1,
      featureEnvelopeRecoveryTier: params.recoveryTier ?? 'primary_feature_envelope',
      featureFrameKind: featureFrameKindForFeature(params.feature.featureClass),
      featureFrameSourceFeatureId: params.feature.featureId,
      featureFrameFallbackTier: params.recoveryTier ?? 'primary_feature_envelope',
      readableFloorM: roundDiagnosticNumber(readableFloorMajorAxisM(params.placementKind, params.longestDimensionM, params.acreage)),
      seasonalPlacementUsed: false,
      ...prominence,
      ...featureEnvelopeDiagnostics(params.feature, params.includes, params.geometryKind),
      ...params.additionalDiagnostics,
    },
    qaFlags: ['shoreline_hugging_oval', 'feature_envelope_zone', `feature_envelope_candidate:${params.candidateSuffix}`],
    allowPairCrowding: params.allowPairCrowding ?? false,
    featureFrameAllowsOutsideWaterCenter: params.featureFrameAllowsOutsideWaterCenter,
    featureFrameContactAnchors: params.featureFrameContactAnchors,
    featureFrameContactToleranceM: params.featureFrameContactToleranceM,
    featureFrameContactMinCount: params.featureFrameContactMinCount,
    featureFrameLocalityRadiusM: params.featureFrameLocalityRadiusM,
  };
}

function constrictionDrafts(
  feature: WaterReaderNeckFeature | WaterReaderSaddleFeature,
  params: { polygon: PolygonM; longestDimensionM: number; averageLakeWidthM: number; lakeAreaSqM: number; acreage?: number | null },
): WaterReaderZoneDraft[] {
  const kind = feature.featureClass === 'neck' ? 'neck_shoulder' : 'saddle_shoulder';
  const sizing = constrictionShoulderSizing(feature, params.longestDimensionM, params.acreage);
  return [feature.endpointA, feature.endpointB].flatMap((anchor, index) =>
    makeAnchoredDraft({
      feature,
      anchor,
      waterDirection: index === 0
        ? { x: feature.endpointB.x - feature.endpointA.x, y: feature.endpointB.y - feature.endpointA.y }
        : { x: feature.endpointA.x - feature.endpointB.x, y: feature.endpointA.y - feature.endpointB.y },
      shorelineRing: params.polygon.exterior,
      polygon: params.polygon,
      longestDimensionM: params.longestDimensionM,
      averageLakeWidthM: params.averageLakeWidthM,
      lakeAreaSqM: params.lakeAreaSqM,
      acreage: params.acreage,
      placementKind: kind,
      placementSemanticId: feature.featureClass === 'neck' ? 'neck_shoulder_endpoint' : 'saddle_shoulder_endpoint',
      anchorSemanticId: feature.featureClass === 'neck' ? 'neck_shoulder_endpoint' : 'saddle_shoulder_endpoint',
      largeFeature: true,
      baseMajorAxisM: sizing.baseMajorAxisM,
      sizingMetadata: sizing,
      strictInwardNormal: true,
      offsetFactors: LARGE_OFFSET_FACTORS,
      sizeFactors: CONSTRICTION_SIZE_FACTORS,
      unitSuffix: `shoulder-${index + 1}`,
      allowPairCrowding: true,
    }),
  );
}

function pointDrafts(
  feature: WaterReaderPointFeature,
  params: { polygon: PolygonM; season: WaterReaderSeason; longestDimensionM: number; averageLakeWidthM: number; lakeAreaSqM: number; acreage?: number | null; covesById?: Map<string, WaterReaderCoveFeature> },
): WaterReaderZoneDraft[] {
  if (feature.featureClass === 'secondary_point') {
    return secondaryPointDrafts(feature, params);
  }

  if (params.season === 'spring' || params.season === 'fall') {
    return [
      ...pointSideDrafts(feature, feature.leftSlope, 'left', 'main_point_side', params),
      ...pointSideDrafts(feature, feature.rightSlope, 'right', 'main_point_side', params),
    ];
  }

  if (params.season === 'summer') {
    return [
      ...pointOpenSideDrafts(feature, params),
      ...makePointTipDraft(feature, params),
    ];
  }

  return pointOpenSideDrafts(feature, params, true);
}

function secondaryPointDrafts(
  feature: WaterReaderPointFeature,
  params: { polygon: PolygonM; season: WaterReaderSeason; longestDimensionM: number; averageLakeWidthM: number; lakeAreaSqM: number; acreage?: number | null; covesById?: Map<string, WaterReaderCoveFeature> },
): WaterReaderZoneDraft[] {
  const kind = params.season === 'spring' ? 'secondary_point_back' : 'secondary_point_mouth';
  const parentCove = feature.parentCoveId ? params.covesById?.get(feature.parentCoveId) : undefined;
  const orientation = secondaryPointParentCoveOrientation(feature, parentCove);
  const primarySlope = params.season === 'spring' ? orientation.backFacingSlope : orientation.mouthFacingSlope;
  const primarySemanticId: WaterReaderZonePlacementSemanticId = orientation.isTrueParentCoveGeometry
    ? params.season === 'spring'
      ? 'secondary_point_back_true'
      : 'secondary_point_mouth_true'
    : parentCove
      ? 'secondary_point_parent_cove_axis_recovery'
      : 'secondary_point_parent_cove_missing';
  const primaryAnchor = orientation.isTrueParentCoveGeometry
    ? lerpPoint(feature.tip, primarySlope, 0.45)
    : params.season === 'spring'
      ? feature.baseMidpoint
      : farthestPoint(feature.baseMidpoint, [feature.leftSlope, feature.rightSlope]);
  const anchors = [
    { point: primaryAnchor, fallback: false, kind: 'secondary_point_primary', index: 0 },
    { point: lerpPoint(feature.tip, feature.leftSlope, 0.45), fallback: true, kind: 'secondary_point_parent_failed_recovery', index: 1 },
    { point: lerpPoint(feature.tip, feature.rightSlope, 0.45), fallback: true, kind: 'secondary_point_parent_failed_recovery', index: 2 },
    { point: feature.tip, fallback: true, kind: 'secondary_point_tip_transition', index: 3 },
  ];
  return anchors.flatMap((anchor) =>
    makeAnchoredDraft({
      feature,
      anchor: anchor.point,
      preferredRotationRad: Math.atan2(primaryAnchor.y - feature.tip.y, primaryAnchor.x - feature.tip.x),
      includePerpendicularRotation: true,
      preferredRotationOnly: true,
      shorelineRing: params.polygon.exterior,
      polygon: params.polygon,
      longestDimensionM: params.longestDimensionM,
      averageLakeWidthM: params.averageLakeWidthM,
      lakeAreaSqM: params.lakeAreaSqM,
      acreage: params.acreage,
      placementKind: kind,
      placementSemanticId: anchor.fallback
        ? anchor.kind === 'secondary_point_tip_transition'
          ? 'secondary_point_tip_transition'
          : 'secondary_point_side_recovery'
        : primarySemanticId,
      anchorSemanticId: anchor.fallback
        ? anchor.kind === 'secondary_point_tip_transition'
          ? 'secondary_point_tip_transition'
          : 'secondary_point_side_recovery'
        : primarySemanticId,
      baseMajorAxisM: pointSizing(feature, kind, params.longestDimensionM, params.acreage).baseMajorAxisM,
      sizingMetadata: pointSizing(feature, kind, params.longestDimensionM, params.acreage),
      strictInwardNormal: params.season === 'winter',
      sizeFactors: anchor.fallback ? FALLBACK_SIZE_FACTORS : POINT_SIZE_FACTORS,
      offsetFactors: anchor.fallback ? FALLBACK_OFFSET_FACTORS : POINT_OFFSET_FACTORS,
      unitSuffix: 'primary',
      diagnostics: {
        ...pointAnchorDiagnostics(feature, anchor.point, {
          source: anchor.kind,
          fraction: anchor.index === 0 ? 0 : 0.45,
        }),
        ...orientation.diagnostics,
        ...(anchor.fallback ? fallbackDiagnostics(anchor.kind, anchor.index) : {}),
      },
    }),
  );
}

function secondaryPointParentCoveOrientation(
  feature: WaterReaderPointFeature,
  parentCove: WaterReaderCoveFeature | undefined,
): {
  backFacingSlope: PointM;
  mouthFacingSlope: PointM;
  isTrueParentCoveGeometry: boolean;
  diagnostics: Record<string, number | string | boolean | null>;
} {
  if (!parentCove) {
    return {
      backFacingSlope: feature.baseMidpoint,
      mouthFacingSlope: farthestPoint(feature.baseMidpoint, [feature.leftSlope, feature.rightSlope]),
      isTrueParentCoveGeometry: false,
      diagnostics: {
        secondaryPointParentCoveGeometry: 'missing',
        parentCoveId: feature.parentCoveId ?? null,
      },
    };
  }

  const mouthMidpoint = midpoint(parentCove.mouthLeft, parentCove.mouthRight);
  const leftBackDistance = distanceM(feature.leftSlope, parentCove.back);
  const rightBackDistance = distanceM(feature.rightSlope, parentCove.back);
  const leftMouthDistance = distanceM(feature.leftSlope, mouthMidpoint);
  const rightMouthDistance = distanceM(feature.rightSlope, mouthMidpoint);
  const leftBackScore = leftBackDistance - leftMouthDistance;
  const rightBackScore = rightBackDistance - rightMouthDistance;
  const leftIsBackFacing = leftBackScore <= rightBackScore;
  return {
    backFacingSlope: leftIsBackFacing ? feature.leftSlope : feature.rightSlope,
    mouthFacingSlope: leftIsBackFacing ? feature.rightSlope : feature.leftSlope,
    isTrueParentCoveGeometry: true,
    diagnostics: {
      secondaryPointParentCoveGeometry: 'true',
      parentCoveId: parentCove.featureId,
      parentCoveAxisMouthToBackM: distanceM(mouthMidpoint, parentCove.back),
      leftSlopeDistanceToParentCoveBackM: leftBackDistance,
      rightSlopeDistanceToParentCoveBackM: rightBackDistance,
      leftSlopeDistanceToParentCoveMouthM: leftMouthDistance,
      rightSlopeDistanceToParentCoveMouthM: rightMouthDistance,
      backFacingSlopeSide: leftIsBackFacing ? 'left' : 'right',
      mouthFacingSlopeSide: leftIsBackFacing ? 'right' : 'left',
    },
  };
}

function pointSideDrafts(
  feature: WaterReaderPointFeature,
  slope: PointM,
  side: 'left' | 'right',
  placementKind: WaterReaderZonePlacementKind,
  params: { polygon: PolygonM; longestDimensionM: number; averageLakeWidthM: number; lakeAreaSqM: number; acreage?: number | null },
): WaterReaderZoneDraft[] {
  const sizing = pointSizing(feature, placementKind, params.longestDimensionM, params.acreage);
  return POINT_SIDE_FRACTIONS.flatMap((fraction) => {
    const anchor = lerpPoint(feature.tip, slope, fraction);
    return makeAnchoredDraft({
      feature,
      anchor,
      preferredRotationRad: Math.atan2(slope.y - feature.tip.y, slope.x - feature.tip.x),
      includePerpendicularRotation: true,
      preferredRotationOnly: true,
      strictInwardNormal: true,
      sizeFactors: POINT_SIZE_FACTORS,
      offsetFactors: POINT_OFFSET_FACTORS,
      shorelineRing: params.polygon.exterior,
      polygon: params.polygon,
      longestDimensionM: params.longestDimensionM,
      averageLakeWidthM: params.averageLakeWidthM,
      lakeAreaSqM: params.lakeAreaSqM,
      acreage: params.acreage,
      placementKind,
      placementSemanticId: 'main_point_side',
      anchorSemanticId: 'main_point_side',
      baseMajorAxisM: sizing.baseMajorAxisM,
      sizingMetadata: sizing,
      unitSuffix: side,
      diagnostics: pointAnchorDiagnostics(feature, anchor, {
        source: `point_${side}_interpolated`,
        fraction,
      }),
    });
  });
}

function makePointTipDraft(
  feature: WaterReaderPointFeature,
  params: { polygon: PolygonM; longestDimensionM: number; averageLakeWidthM: number; lakeAreaSqM: number; acreage?: number | null },
): WaterReaderZoneDraft[] {
  const tipNearCenter = lerpPoint(feature.tip, feature.baseMidpoint, 0.08);
  const sizing = pointSizing(feature, 'main_point_tip', params.longestDimensionM, params.acreage);
  return makeAnchoredDraft({
    feature,
    anchor: feature.tip,
    preferredRotationRad: Math.atan2(feature.rightSlope.y - feature.leftSlope.y, feature.rightSlope.x - feature.leftSlope.x),
    includePerpendicularRotation: true,
    preferredRotationOnly: true,
    strictInwardNormal: true,
    sizeFactors: POINT_SIZE_FACTORS,
    offsetFactors: POINT_TIP_OFFSET_FACTORS,
    centerOverrides: [
      {
        center: feature.tip,
        anchorSemanticId: 'main_point_tip',
        diagnostics: {
          pointTipCenteredCandidate: true,
          pointTipCenterDistanceM: 0,
          pointTipPlacementMode: 'tip_centered',
        },
      },
      {
        center: tipNearCenter,
        anchorSemanticId: 'main_point_tip_near',
        diagnostics: {
          pointTipCenteredCandidate: false,
          pointTipCenterDistanceM: distanceM(feature.tip, tipNearCenter),
          pointTipPlacementMode: 'tip_near',
        },
      },
    ],
    shorelineRing: params.polygon.exterior,
    polygon: params.polygon,
    longestDimensionM: params.longestDimensionM,
      averageLakeWidthM: params.averageLakeWidthM,
      lakeAreaSqM: params.lakeAreaSqM,
      acreage: params.acreage,
    placementKind: 'main_point_tip',
    placementSemanticId: 'main_point_tip',
    anchorSemanticId: 'main_point_tip',
    baseMajorAxisM: sizing.baseMajorAxisM,
    sizingMetadata: sizing,
    unitSuffix: 'tip',
    diagnostics: pointAnchorDiagnostics(feature, feature.tip, {
      source: 'point_tip',
      fraction: 0,
    }, 'fallback_rejected'),
  });
}

function pointOpenSideDrafts(
  feature: WaterReaderPointFeature,
  params: { polygon: PolygonM; longestDimensionM: number; averageLakeWidthM: number; lakeAreaSqM: number; acreage?: number | null },
  singleSide = false,
): WaterReaderZoneDraft[] {
  const sizing = pointSizing(feature, 'main_point_open_water', params.longestDimensionM, params.acreage);
  const openWaterSide = openWaterSideForPoint(feature, params.polygon, params.longestDimensionM);
  const sideDrafts = [
    {
      slope: feature.leftSlope,
      source: 'point_open_left_interpolated',
      side: 'left' as const,
    },
    {
      slope: feature.rightSlope,
      source: 'point_open_right_interpolated',
      side: 'right' as const,
    },
  ];
  const selectedSide = sideDrafts.find((side) => side.side === openWaterSide.side) ?? sideDrafts[0]!;
  const selectedSides = singleSide ? [selectedSide] : [selectedSide];
  return selectedSides.flatMap((side) =>
    POINT_OPEN_SIDE_FRACTIONS.flatMap((fraction) =>
      makeAnchoredDraft({
        feature,
        anchor: lerpPoint(feature.tip, side.slope, fraction),
        preferredRotationRad: Math.atan2(side.slope.y - feature.tip.y, side.slope.x - feature.tip.x),
        includePerpendicularRotation: true,
        preferredRotationOnly: true,
        strictInwardNormal: true,
        sizeFactors: POINT_SIZE_FACTORS,
        offsetFactors: POINT_OFFSET_FACTORS,
        shorelineRing: params.polygon.exterior,
        polygon: params.polygon,
        longestDimensionM: params.longestDimensionM,
        averageLakeWidthM: params.averageLakeWidthM,
        lakeAreaSqM: params.lakeAreaSqM,
        acreage: params.acreage,
        placementKind: 'main_point_open_water',
        placementSemanticId: 'main_point_open_water_area',
        anchorSemanticId: openWaterSide.resolved ? 'main_point_open_water_area' : 'main_point_open_water_recovery',
        baseMajorAxisM: sizing.baseMajorAxisM,
        sizingMetadata: sizing,
        unitSuffix: 'open',
        diagnostics: {
          ...pointAnchorDiagnostics(feature, lerpPoint(feature.tip, side.slope, fraction), {
            source: side.source,
            fraction,
          }),
          ...openWaterSide.diagnostics,
          ...(openWaterSide.resolved
            ? {}
            : {
                fallbackPlacementUsed: true,
                fallbackPlacementKind: 'main_point_broad_water_recovery',
                fallbackPlacementReason: 'open_water_side_area_unresolved',
                fallbackAttemptIndex: 0,
              }),
        },
      }),
    )
  );
}

function openWaterSideForPoint(
  feature: WaterReaderPointFeature,
  polygon: PolygonM,
  longestDimensionM: number,
): {
  side: 'left' | 'right';
  resolved: boolean;
  diagnostics: Record<string, number | string | boolean | null>;
} {
  const comparison = compareOpenWaterSideArea({
    polygon,
    center: feature.tip,
    lineA: feature.baseMidpoint,
    lineB: feature.tip,
    sideA: feature.leftSlope,
    sideB: feature.rightSlope,
    longestDimensionM,
  });
  if (comparison.resolved) {
    return {
      side: comparison.openSide === 'a' ? 'left' : 'right',
      resolved: true,
      diagnostics: openWaterSideDiagnostics('main_point', comparison),
    };
  }
  const fallbackSide = distanceM(feature.leftSlope, feature.baseMidpoint) >= distanceM(feature.rightSlope, feature.baseMidpoint)
    ? 'left'
    : 'right';
  return {
    side: fallbackSide,
    resolved: false,
    diagnostics: {
      ...openWaterSideDiagnostics('main_point', comparison),
      openWaterSideFallback: 'farthest_slope_from_base',
    },
  };
}

function pointAnchorDiagnostics(
  feature: WaterReaderPointFeature,
  anchor: PointM,
  params: { source: string; fraction: number },
  pointTipPlacementMode?: 'tip_centered' | 'tip_near' | 'fallback_rejected',
): Record<string, number | string | boolean | null> {
  return {
    pointAnchorSource: params.source,
    pointSideFractionFromTip: params.fraction,
    distanceFromTipM: distanceM(anchor, feature.tip),
    distanceFromBaseM: distanceM(anchor, feature.baseMidpoint),
    ...(pointTipPlacementMode
      ? {
          pointTipCenteredCandidate: false,
          pointTipCenterDistanceM: distanceM(anchor, feature.tip),
          pointTipPlacementMode,
        }
      : {}),
  };
}

function coveDrafts(
  feature: WaterReaderCoveFeature,
  params: { polygon: PolygonM; season: WaterReaderSeason; longestDimensionM: number; averageLakeWidthM: number; lakeAreaSqM: number; acreage?: number | null },
): WaterReaderZoneDraft[] {
  const strongestMouth = feature.leftIrregularity >= feature.rightIrregularity ? feature.mouthLeft : feature.mouthRight;
  const oppositeMouth = feature.leftIrregularity >= feature.rightIrregularity ? feature.mouthRight : feature.mouthLeft;
  const strongestSide: 'left' | 'right' = feature.leftIrregularity >= feature.rightIrregularity ? 'left' : 'right';
  const oppositeSide: 'left' | 'right' = strongestSide === 'left' ? 'right' : 'left';
  const mouthMidpoint = midpoint(feature.mouthLeft, feature.mouthRight);
  const coveAxisToMouth = normalize({
    x: mouthMidpoint.x - feature.back.x,
    y: mouthMidpoint.y - feature.back.y,
  }) ?? undefined;
  const coveBackRotationRad = Math.atan2(feature.mouthRight.y - feature.mouthLeft.y, feature.mouthRight.x - feature.mouthLeft.x);
  const make = (
    anchor: PointM,
    placementKind: WaterReaderZonePlacementKind,
    placementSemanticId: WaterReaderZonePlacementSemanticId,
    anchorSemanticId: WaterReaderZonePlacementSemanticId,
    fallbackKind: string | null,
    fallbackAttemptIndex: number,
    strictInwardNormal = false,
  ) =>
    makeAnchoredDraft({
      feature,
      anchor,
      shorelineRing: params.polygon.exterior,
      polygon: params.polygon,
      longestDimensionM: params.longestDimensionM,
      averageLakeWidthM: params.averageLakeWidthM,
      lakeAreaSqM: params.lakeAreaSqM,
      acreage: params.acreage,
      placementKind,
      placementSemanticId,
      anchorSemanticId,
      baseMajorAxisM: coveSizing(feature, placementKind, params.longestDimensionM, params.acreage).baseMajorAxisM,
      sizingMetadata: coveSizing(feature, placementKind, params.longestDimensionM, params.acreage),
      unitSuffix: 'primary',
      waterDirection: placementKind === 'cove_back' ? coveAxisToMouth : undefined,
      preferredRotationRad: placementKind === 'cove_back' ? coveBackRotationRad : undefined,
      preferredRotationOnly: false,
      strictInwardNormal: placementKind === 'cove_back' ? true : strictInwardNormal,
      sizeFactors: placementKind === 'cove_back'
        ? fallbackKind
          ? COVE_BACK_FALLBACK_SIZE_FACTORS
          : COVE_BACK_SIZE_FACTORS
        : fallbackKind ? FALLBACK_SIZE_FACTORS : STANDARD_SIZE_FACTORS,
      offsetFactors: placementKind === 'cove_back'
        ? fallbackKind ? COVE_BACK_FALLBACK_OFFSET_FACTORS : COVE_BACK_OFFSET_FACTORS
        : fallbackKind ? FALLBACK_OFFSET_FACTORS : OFFSET_FACTORS,
      diagnostics: {
        ...(fallbackKind ? fallbackDiagnostics(fallbackKind, fallbackAttemptIndex) : {}),
        ...(placementKind === 'cove_back'
          ? {
              coveBackAxisAlignedCandidate: true,
              coveBackWaterDirectionBearingRad: coveAxisToMouth ? Math.atan2(coveAxisToMouth.y, coveAxisToMouth.x) : null,
              coveBackRotationBearingRad: coveBackRotationRad,
              coveBackOffsetPolicy: 'axis_to_mouth_midpoint',
              coveBackRotationPolicy: 'local_back_tangent_then_mouth_chord',
            }
          : {}),
      },
    });

  if (params.season === 'spring') {
    return [
      ...make(feature.back, 'cove_back', 'cove_back_primary', 'cove_back_primary', null, 0),
      ...make(coveWallAnchor(feature, 'left', 0.04), 'cove_back', 'cove_back_pocket_recovery', 'cove_back_pocket_recovery_left', 'cove_back_pocket_recovery_left', 1),
      ...make(coveWallAnchor(feature, 'right', 0.04), 'cove_back', 'cove_back_pocket_recovery', 'cove_back_pocket_recovery_right', 'cove_back_pocket_recovery_right', 2),
      ...make(coveWallAnchor(feature, 'left', 0.08), 'cove_back', 'cove_back_pocket_recovery', 'cove_back_pocket_recovery_left', 'cove_back_pocket_recovery_left', 3),
      ...make(coveWallAnchor(feature, 'right', 0.08), 'cove_back', 'cove_back_pocket_recovery', 'cove_back_pocket_recovery_right', 'cove_back_pocket_recovery_right', 4),
      ...make(coveWallAnchor(feature, 'left', 0.14), 'cove_back', 'cove_back_pocket_recovery', 'cove_back_pocket_recovery_left', 'cove_back_pocket_recovery_left', 5),
      ...make(coveWallAnchor(feature, 'right', 0.14), 'cove_back', 'cove_back_pocket_recovery', 'cove_back_pocket_recovery_right', 'cove_back_pocket_recovery_right', 6),
      ...make(coveWallAnchor(feature, 'left', 0.24), 'cove_back', 'cove_back_pocket_recovery', 'cove_back_pocket_recovery_left', 'cove_back_pocket_recovery_left', 7),
      ...make(coveWallAnchor(feature, 'right', 0.24), 'cove_back', 'cove_back_pocket_recovery', 'cove_back_pocket_recovery_right', 'cove_back_pocket_recovery_right', 8),
      ...make(coveWallAnchor(feature, 'left', 0.5), 'cove_back', 'cove_back_primary', 'cove_inner_shoreline_left', 'cove_inner_wall_midpoint_left', 9),
      ...make(coveWallAnchor(feature, 'right', 0.5), 'cove_back', 'cove_back_primary', 'cove_inner_shoreline_right', 'cove_inner_wall_midpoint_right', 10),
      ...make(strongestMouth, 'cove_back', 'cove_back_primary', 'cove_mouth_shoulder_recovery', 'cove_mouth_shoulder_fallback', 11),
    ];
  }
  if (params.season === 'summer' || params.season === 'winter') {
    return [
      ...make(strongestMouth, 'cove_mouth', 'cove_mouth_primary', 'cove_mouth_primary', null, 0, params.season === 'winter'),
      ...make(oppositeMouth, 'cove_mouth', 'cove_mouth_primary', 'cove_opposite_mouth', 'cove_opposite_mouth_shoulder_fallback', 1, params.season === 'winter'),
      ...make(coveWallAnchor(feature, strongestSide, 0.78), 'cove_mouth', 'cove_mouth_primary', 'cove_near_mouth_inner_wall', 'cove_near_mouth_inner_wall', 2, params.season === 'winter'),
      ...make(coveWallAnchor(feature, oppositeSide, 0.78), 'cove_mouth', 'cove_mouth_primary', 'cove_near_mouth_inner_wall_opposite', 'cove_near_mouth_inner_wall_opposite', 3, params.season === 'winter'),
    ];
  }
  return [
    ...make(coveIrregularSideAnchor(feature), 'cove_irregular_side', 'cove_irregular_side_midpoint', 'cove_irregular_side_midpoint', null, 0),
    ...make(coveWallAnchor(feature, strongestSide, 0.55), 'cove_irregular_side', 'cove_irregular_side_midpoint', 'cove_irregular_side_midpoint', 'cove_irregular_side_midpoint', 1),
    ...make(coveWallAnchor(feature, strongestSide, 0.78), 'cove_irregular_side', 'cove_irregular_side_midpoint', 'cove_irregular_side_closer_to_mouth', 'cove_irregular_side_closer_to_mouth', 2),
    ...make(coveWallAnchor(feature, strongestSide, 0.28), 'cove_irregular_side', 'cove_irregular_side_midpoint', 'cove_irregular_side_closer_to_back', 'cove_irregular_side_closer_to_back', 3),
    ...make(strongestMouth, 'cove_irregular_side', 'cove_irregular_side_midpoint', 'cove_mouth_shoulder_recovery', 'cove_mouth_shoulder_fallback', 4),
  ];
}

function islandDrafts(
  feature: WaterReaderIslandFeature,
  params: { polygon: PolygonM; season: WaterReaderSeason; longestDimensionM: number; averageLakeWidthM: number; lakeAreaSqM: number; acreage?: number | null },
): WaterReaderZoneDraft[] {
  const centroid = ringCentroid(feature.ring);
  const mainlandAnchor = nearestPointOnRing(centroid, params.polygon.exterior);
  const mainlandFacingEdge = mainlandFacingIslandEdge(centroid, mainlandAnchor, feature.ring);
  const mainlandFacingRecoveryEdge = nearestPointOnRing(mainlandAnchor, feature.ring);
  const mainlandArcRecoveryAnchors = mainlandSideIslandRecoveryAnchors(
    feature,
    mainlandFacingEdge ?? mainlandFacingRecoveryEdge,
    mainlandAnchor,
  );
  const islandOpenWater = openWaterSideForIsland(feature, params.polygon, params.longestDimensionM, mainlandAnchor);
  const openWaterEdge = islandOpenWater.anchor;
  const openWaterRecoveryAnchors = openWaterSideIslandRecoveryAnchors(
    feature,
    openWaterEdge,
    islandOpenWater.openWaterDirection,
  );
  const primaryKind = params.season === 'spring'
    ? 'island_mainland' as const
    : params.season === 'fall'
      ? 'island_endpoint' as const
      : 'island_open_water' as const;
  const anchors = params.season === 'spring'
    ? [
        ...(mainlandFacingEdge
          ? [{ point: mainlandFacingEdge, ring: feature.ring, fallback: false, kind: 'island_mainland_primary', semantic: 'island_mainland_primary' as const, index: 0 }]
          : [{ point: mainlandFacingRecoveryEdge, ring: feature.ring, fallback: true, kind: 'island_mainland_ray_recovery', semantic: 'island_mainland_recovery' as const, index: 0 }]),
        { point: mainlandFacingRecoveryEdge, ring: feature.ring, fallback: true, kind: 'island_mainland_edge_recovery', semantic: 'island_mainland_recovery' as const, index: 1 },
        ...mainlandArcRecoveryAnchors,
        { point: feature.endpointA, ring: feature.ring, fallback: true, kind: 'island_alternate_endpoint', semantic: 'island_shoreline_recovery' as const, index: 20 },
        { point: feature.endpointB, ring: feature.ring, fallback: true, kind: 'island_alternate_endpoint', semantic: 'island_shoreline_recovery' as const, index: 21 },
        { point: openWaterEdge, ring: feature.ring, fallback: true, kind: 'island_open_water_side', semantic: 'island_open_water_recovery' as const, index: 22 },
      ]
    : params.season === 'fall'
      ? [
          ...islandEndpointAnchors(feature, feature.endpointA, 'island_endpoint_a', 'endpoint-a', 0),
          ...islandEndpointAnchors(feature, feature.endpointB, 'island_endpoint_b', 'endpoint-b', 10),
        ]
      : [
          {
            point: openWaterEdge,
            ring: feature.ring,
            fallback: !islandOpenWater.resolved,
            kind: islandOpenWater.resolved ? 'island_open_water_primary' : 'island_open_water_broad_water_recovery',
            semantic: islandOpenWater.resolved ? 'island_open_water_area' as const : 'island_open_water_recovery' as const,
            index: 0,
          },
          ...openWaterRecoveryAnchors,
          { point: feature.endpointB, ring: feature.ring, fallback: true, kind: 'island_local_shoreline_recovery', semantic: 'island_shoreline_recovery' as const, index: 20 },
          { point: feature.endpointA, ring: feature.ring, fallback: true, kind: 'island_local_shoreline_recovery', semantic: 'island_shoreline_recovery' as const, index: 21 },
          { point: mainlandFacingRecoveryEdge, ring: feature.ring, fallback: true, kind: 'island_mainland_facing_fallback', semantic: 'island_shoreline_recovery' as const, index: 22 },
        ];

  return anchors.flatMap((anchor) => {
    const orientation = islandOrientationForAnchor(feature, anchor.point, anchor.semantic, anchor.kind, mainlandAnchor);
    return makeAnchoredDraft({
      feature,
      anchor: anchor.point,
      preferredRotationRad: orientation.rotationRad,
      preferredRotationOnly: true,
      shorelineRing: anchor.ring,
      polygon: params.polygon,
      longestDimensionM: params.longestDimensionM,
      averageLakeWidthM: params.averageLakeWidthM,
      lakeAreaSqM: params.lakeAreaSqM,
      acreage: params.acreage,
      placementKind: primaryKind,
      placementSemanticId: primaryKind === 'island_mainland'
        ? 'island_mainland_primary'
        : primaryKind === 'island_endpoint'
          ? anchor.semantic
          : 'island_open_water_area',
      anchorSemanticId: anchor.semantic,
      unitSuffix: 'suffix' in anchor ? anchor.suffix : 'primary',
      baseMajorAxisM: islandEdgeSizing(feature, primaryKind, params.longestDimensionM, params.acreage).baseMajorAxisM,
      sizingMetadata: islandEdgeSizing(feature, primaryKind, params.longestDimensionM, params.acreage),
      sizeFactors: primaryKind === 'island_endpoint' ? ISLAND_ENDPOINT_SIZE_FACTORS : islandEdgeSizeFactorsForAnchor(anchor.semantic),
      offsetFactors: primaryKind === 'island_endpoint' ? ISLAND_ENDPOINT_OFFSET_FACTORS : ISLAND_EDGE_OFFSET_FACTORS,
      centerOverrides: [
        {
          center: anchor.point,
          diagnostics: fallbackDiagnostics('island_shoreline_center_fallback', anchor.index + 10),
        },
      ],
      diagnostics: {
        ...(primaryKind === 'island_open_water' ? islandOpenWater.diagnostics : {}),
        ...(primaryKind === 'island_mainland'
          ? {
              islandMainlandFacingMethod: mainlandFacingEdge ? 'centroid_to_nearest_mainland_ray' : 'nearest_mainland_edge_recovery',
              islandMainlandFacingRayResolved: mainlandFacingEdge !== null,
            }
          : {}),
        ...(anchor.fallback ? fallbackDiagnostics(anchor.kind, anchor.index) : {}),
        ...(primaryKind === 'island_open_water' && anchor.index === 0 && !islandOpenWater.resolved
          ? {
              fallbackPlacementReason: 'open_water_side_area_unresolved',
              fallbackPlacementKind: 'island_open_water_broad_water_recovery',
            }
          : {}),
        ...orientation.diagnostics,
      },
    });
  });
}

function islandOrientationForAnchor(
  feature: WaterReaderIslandFeature,
  anchor: PointM,
  semantic: WaterReaderZonePlacementSemanticId,
  sourceKind: string,
  mainlandAnchor: PointM,
): {
  rotationRad: number;
  diagnostics: Record<string, number | string | boolean | null>;
} {
  const localScaleM = islandLocalScale(feature);
  const localTangent = localRingTangentAtPoint(feature.ring, anchor, clamp(localScaleM * 0.18, 20, 120));
  const mainlandVector = normalize({ x: mainlandAnchor.x - anchor.x, y: mainlandAnchor.y - anchor.y });
  const principalAxis = normalize({
    x: feature.endpointB.x - feature.endpointA.x,
    y: feature.endpointB.y - feature.endpointA.y,
  });
  const fallback = localTangent ?? principalAxis ?? mainlandVector ?? { x: 1, y: 0 };
  const source = localTangent
    ? 'local_edge_tangent'
    : mainlandVector && semantic === 'island_mainland_primary'
      ? 'mainland_vector'
      : semantic.includes('recovery')
        ? 'shoreline_recovery'
        : 'fallback';
  const rotationRad = Math.atan2(fallback.y, fallback.x);
  return {
    rotationRad,
    diagnostics: {
      islandOrientationSource: source,
      islandSelectedEdgeBearingRad: rotationRad,
      islandZoneRotationRad: rotationRad,
      islandSideSelectionReason: sourceKind,
      islandOrientationFallbackReason: source === 'fallback' ? 'local_edge_and_mainland_vectors_unavailable' : null,
    },
  };
}

function mainlandSideIslandRecoveryAnchors(
  feature: WaterReaderIslandFeature,
  mainlandSideAnchor: PointM,
  mainlandAnchor: PointM,
): Array<{ point: PointM; ring: RingM; fallback: boolean; kind: string; semantic: 'island_mainland_recovery'; index: number }> {
  const frame = nearestRingSegmentFrame(mainlandSideAnchor, feature.ring);
  if (!frame) return [];
  const localScaleM = islandLocalScale(feature);
  const distances = [
    clamp(localScaleM * 0.06, 12, 70),
    clamp(localScaleM * 0.12, 24, 120),
    clamp(localScaleM * 0.2, 36, 180),
  ];
  const anchors: Array<{ point: PointM; ring: RingM; fallback: boolean; kind: string; semantic: 'island_mainland_recovery'; index: number }> = [];
  let index = 2;
  for (const distance of distances) {
    for (const direction of [-1, 1] as const) {
      const point = pointAlongRing(frame.point, feature.ring, frame.segmentIndex, distance, direction);
      if (!point) continue;
      const sideStillFacesMainland = dot(
        normalize({ x: mainlandAnchor.x - point.x, y: mainlandAnchor.y - point.y }) ?? { x: 0, y: 0 },
        normalize({ x: mainlandAnchor.x - mainlandSideAnchor.x, y: mainlandAnchor.y - mainlandSideAnchor.y }) ?? { x: 0, y: 0 },
      ) >= 0.25;
      if (!sideStillFacesMainland) continue;
      if (anchors.some((anchor) => distanceM(anchor.point, point) < 3)) continue;
      anchors.push({
        point,
        ring: feature.ring,
        fallback: true,
        kind: 'island_mainland_arc_recovery',
        semantic: 'island_mainland_recovery',
        index: index++,
      });
    }
  }
  return anchors;
}

function openWaterSideIslandRecoveryAnchors(
  feature: WaterReaderIslandFeature,
  openWaterSideAnchor: PointM,
  openWaterDirection: PointM,
): Array<{ point: PointM; ring: RingM; fallback: boolean; kind: string; semantic: 'island_open_water_recovery' | 'island_open_water_same_side_recovery'; index: number }> {
  const frame = nearestRingSegmentFrame(openWaterSideAnchor, feature.ring);
  if (!frame) return [];
  const localScaleM = islandLocalScale(feature);
  const distances = [
    clamp(localScaleM * 0.04, 8, 50),
    clamp(localScaleM * 0.09, 16, 95),
    clamp(localScaleM * 0.16, 28, 150),
  ];
  const baseDirection = normalize(openWaterDirection) ?? { x: 1, y: 0 };
  const anchors: Array<{ point: PointM; ring: RingM; fallback: boolean; kind: string; semantic: 'island_open_water_recovery' | 'island_open_water_same_side_recovery'; index: number }> = [];
  let index = 1;
  for (const distance of distances) {
    for (const direction of [-1, 1] as const) {
      const point = pointAlongRing(frame.point, feature.ring, frame.segmentIndex, distance, direction);
      if (!point) continue;
      const sideStillFacesOpenWater = dot(
        normalize({ x: point.x - ringCentroid(feature.ring).x, y: point.y - ringCentroid(feature.ring).y }) ?? { x: 0, y: 0 },
        baseDirection,
      ) >= 0.12;
      if (!sideStillFacesOpenWater) continue;
      if (anchors.some((anchor) => distanceM(anchor.point, point) < 3)) continue;
      anchors.push({
        point,
        ring: feature.ring,
        fallback: true,
        kind: 'island_open_water_same_side_recovery',
        semantic: 'island_open_water_same_side_recovery',
        index: index++,
      });
    }
  }
  anchors.push({
    point: frame.point,
    ring: feature.ring,
    fallback: true,
    kind: 'island_open_water_local_recovery',
    semantic: 'island_open_water_recovery',
    index: 10,
  });
  return anchors;
}

function islandEdgeSizeFactorsForAnchor(anchorSemanticId: WaterReaderZonePlacementSemanticId): readonly number[] {
  switch (anchorSemanticId) {
    case 'island_mainland_primary':
      return ISLAND_EDGE_SIZE_FACTORS;
    case 'island_mainland_recovery':
      return [2, 1.5, 1.1, 1, 0.9, 0.8, 0.7, 0.55] as const;
    case 'island_open_water_recovery':
    case 'island_open_water_same_side_recovery':
      return [1.5, 1.1, 1, 0.9, 0.8, 0.7, 0.55, 0.42, 0.32, 0.24, 0.18, 0.12] as const;
    case 'island_shoreline_recovery':
    case 'island_alternate_endpoint_recovery':
      return [1.1, 1, 0.9, 0.8, 0.7, 0.55, 0.42, 0.32, 0.24, 0.18] as const;
    default:
      return ISLAND_EDGE_SIZE_FACTORS;
  }
}

function localRingTangentAtPoint(ring: RingM, anchor: PointM, windowMeters: number): PointM | null {
  if (ring.length < 2) return null;
  const frame = nearestRingSegmentFrame(anchor, ring);
  if (!frame) return null;
  const backward = pointAlongRing(frame.point, ring, frame.segmentIndex, windowMeters, -1);
  const forward = pointAlongRing(frame.point, ring, frame.segmentIndex, windowMeters, 1);
  const tangent = backward && forward
    ? normalize({ x: forward.x - backward.x, y: forward.y - backward.y })
    : normalize({ x: frame.b.x - frame.a.x, y: frame.b.y - frame.a.y });
  return tangent;
}

function nearestRingSegmentFrame(point: PointM, ring: RingM): { segmentIndex: number; point: PointM; a: PointM; b: PointM } | null {
  if (ring.length < 2) return null;
  let best: { segmentIndex: number; point: PointM; a: PointM; b: PointM; distance: number } | null = null;
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i]!;
    const b = ring[(i + 1) % ring.length]!;
    const nearest = nearestPointOnSegmentLocal(point, a, b);
    const d = distanceM(point, nearest);
    if (!best || d < best.distance) {
      best = { segmentIndex: i, point: nearest, a, b, distance: d };
    }
  }
  return best;
}

function mainlandFacingIslandEdge(centroid: PointM, mainlandAnchor: PointM, ring: RingM): PointM | null {
  const direction = normalize({ x: mainlandAnchor.x - centroid.x, y: mainlandAnchor.y - centroid.y });
  if (!direction || ring.length < 2) return null;
  let bestPoint: PointM | null = null;
  let bestDistance = Infinity;
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i]!;
    const b = ring[(i + 1) % ring.length]!;
    const intersection = raySegmentIntersection(centroid, direction, a, b);
    if (!intersection) continue;
    if (intersection.rayDistance < bestDistance) {
      bestDistance = intersection.rayDistance;
      bestPoint = intersection.point;
    }
  }
  return bestPoint;
}

function raySegmentIntersection(origin: PointM, direction: PointM, a: PointM, b: PointM): { point: PointM; rayDistance: number } | null {
  const segment = { x: b.x - a.x, y: b.y - a.y };
  const denominator = cross(direction, segment);
  if (Math.abs(denominator) < 1e-9) return null;
  const delta = { x: a.x - origin.x, y: a.y - origin.y };
  const rayDistance = cross(delta, segment) / denominator;
  const segmentT = cross(delta, direction) / denominator;
  if (rayDistance < -1e-6 || segmentT < -1e-6 || segmentT > 1 + 1e-6) return null;
  return {
    point: { x: origin.x + direction.x * rayDistance, y: origin.y + direction.y * rayDistance },
    rayDistance,
  };
}

function islandEndpointAnchors(
  feature: WaterReaderIslandFeature,
  endpoint: PointM,
  semantic: 'island_endpoint_a' | 'island_endpoint_b',
  suffix: 'endpoint-a' | 'endpoint-b',
  baseIndex: number,
): Array<{ point: PointM; ring: RingM; fallback: boolean; kind: string; semantic: 'island_endpoint_a' | 'island_endpoint_b'; index: number; suffix: 'endpoint-a' | 'endpoint-b' }> {
  const anchors: Array<{ point: PointM; ring: RingM; fallback: boolean; kind: string; semantic: 'island_endpoint_a' | 'island_endpoint_b'; index: number; suffix: 'endpoint-a' | 'endpoint-b' }> = [
    { point: endpoint, ring: feature.ring, fallback: false, kind: semantic, semantic, index: baseIndex, suffix },
  ];
  const endpointIndex = nearestIndex(endpoint, feature.ring);
  if (endpointIndex < 0) return anchors;
  const current = feature.ring[endpointIndex]!;
  const previous = feature.ring[(endpointIndex - 1 + feature.ring.length) % feature.ring.length]!;
  const next = feature.ring[(endpointIndex + 1) % feature.ring.length]!;
  anchors.push(
    { point: lerpPoint(current, previous, 0.18), ring: feature.ring, fallback: true, kind: `${semantic}_local_recovery`, semantic, index: baseIndex + 1, suffix },
    { point: lerpPoint(current, next, 0.18), ring: feature.ring, fallback: true, kind: `${semantic}_local_recovery`, semantic, index: baseIndex + 2, suffix },
    { point: lerpPoint(current, previous, 0.34), ring: feature.ring, fallback: true, kind: `${semantic}_local_recovery`, semantic, index: baseIndex + 3, suffix },
    { point: lerpPoint(current, next, 0.34), ring: feature.ring, fallback: true, kind: `${semantic}_local_recovery`, semantic, index: baseIndex + 4, suffix },
  );
  return anchors;
}

function openWaterSideForIsland(
  feature: WaterReaderIslandFeature,
  polygon: PolygonM,
  longestDimensionM: number,
  mainlandAnchor: PointM,
): {
  anchor: PointM;
  openWaterDirection: PointM;
  resolved: boolean;
  diagnostics: Record<string, number | string | boolean | null>;
} {
  const centroid = ringCentroid(feature.ring);
  const mainlandVector = normalize({ x: mainlandAnchor.x - centroid.x, y: mainlandAnchor.y - centroid.y }) ?? { x: 1, y: 0 };
  const divider = { x: -mainlandVector.y, y: mainlandVector.x };
  const radius = Math.max(1, longestDimensionM * 0.2);
  const awayPoint = { x: centroid.x - mainlandVector.x * radius, y: centroid.y - mainlandVector.y * radius };
  const mainlandSidePoint = { x: centroid.x + mainlandVector.x * radius, y: centroid.y + mainlandVector.y * radius };
  const comparison = compareOpenWaterSideArea({
    polygon,
    center: centroid,
    lineA: { x: centroid.x - divider.x * radius, y: centroid.y - divider.y * radius },
    lineB: { x: centroid.x + divider.x * radius, y: centroid.y + divider.y * radius },
    sideA: awayPoint,
    sideB: mainlandSidePoint,
    longestDimensionM,
  });
  const target = comparison.resolved
    ? comparison.openSide === 'a' ? awayPoint : mainlandSidePoint
    : awayPoint;
  const openWaterDirection = normalize({ x: target.x - centroid.x, y: target.y - centroid.y }) ?? { x: -mainlandVector.x, y: -mainlandVector.y };
  return {
    anchor: nearestPointOnRing(target, feature.ring),
    openWaterDirection,
    resolved: comparison.resolved,
    diagnostics: {
      ...openWaterSideDiagnostics('island', comparison),
      ...(comparison.resolved ? {} : { openWaterSideFallback: 'away_from_nearest_mainland' }),
    },
  };
}

function damDrafts(
  feature: WaterReaderDamFeature,
  params: { polygon: PolygonM; longestDimensionM: number; averageLakeWidthM: number; lakeAreaSqM: number; acreage?: number | null },
): WaterReaderZoneDraft[] {
  return [
    { point: feature.cornerA, suffix: 'a' },
    { point: feature.cornerB, suffix: 'b' },
  ].flatMap((anchor) =>
    makeAnchoredDraft({
      feature,
      anchor: anchor.point,
      shorelineRing: params.polygon.exterior,
      polygon: params.polygon,
      longestDimensionM: params.longestDimensionM,
      averageLakeWidthM: params.averageLakeWidthM,
      lakeAreaSqM: params.lakeAreaSqM,
      acreage: params.acreage,
      placementKind: 'dam_corner',
      placementSemanticId: 'dam_corner',
      anchorSemanticId: 'dam_corner',
      largeFeature: true,
      baseMajorAxisM: damCornerSizing(feature, params.longestDimensionM, params.acreage).baseMajorAxisM,
      sizingMetadata: damCornerSizing(feature, params.longestDimensionM, params.acreage),
      strictInwardNormal: true,
      offsetFactors: LARGE_OFFSET_FACTORS,
      sizeFactors: CONSTRICTION_SIZE_FACTORS,
      unitSuffix: anchor.suffix,
    }),
  );
}

function constrictionShoulderSizing(
  feature: WaterReaderNeckFeature | WaterReaderSaddleFeature,
  longestDimensionM: number,
  acreage?: number | null,
): DraftSizingMetadata {
  const widthScaled = feature.widthM * (feature.featureClass === 'neck' ? 4 : 3.2);
  const widthMax = feature.widthM * (feature.featureClass === 'neck' ? 4.75 : 4);
  const lakeScaled = longestDimensionM * (feature.featureClass === 'neck' ? 0.065 : 0.06);
  const readableFloorM = readableFloorMajorAxisM(feature.featureClass === 'neck' ? 'neck_shoulder' : 'saddle_shoulder', longestDimensionM, acreage);
  const minimumM = readableFloorM;
  const maxClampM = Math.max(minimumM, Math.min(lakeScaled, widthMax));
  const baseMajorAxisM = clampM(widthScaled, minimumM, maxClampM);
  return {
    naturalMajorAxisM: widthScaled,
    baseMajorAxisM,
    minClampM: minimumM,
    maxClampM,
    clampReason: constrictionClampReason(widthScaled, minimumM, lakeScaled, widthMax, maxClampM),
    readableFloorMajorAxisM: readableFloorM,
    readableFloorApplied: baseMajorAxisM > widthScaled + 0.001,
    lakeSizeBand: lakeSizeBandForAcreage(acreage),
    constrictionWidthM: feature.widthM,
    constrictionMinorAxisWidthCapM: feature.widthM * (feature.featureClass === 'neck' ? 0.85 : 0.75),
    constrictionMinorAxisWidthCapRatio: feature.featureClass === 'neck' ? 0.85 : 0.75,
    constrictionPreferredMinorAxisM: Math.min(baseMajorAxisM / ASPECT_RATIO, feature.widthM * (feature.featureClass === 'neck' ? 1.05 : 0.95), Math.max(baseMajorAxisM / 6, feature.widthM * (feature.featureClass === 'neck' ? 0.85 : 0.75))),
    constrictionFallbackMinorAxisM: Math.min(baseMajorAxisM / ASPECT_RATIO, feature.widthM * (feature.featureClass === 'neck' ? 0.85 : 0.75)),
  };
}

function islandEdgeSizing(
  feature: WaterReaderIslandFeature,
  placementKind: WaterReaderZonePlacementKind,
  longestDimensionM: number,
  acreage?: number | null,
): DraftSizingMetadata {
  const islandScaled = Math.sqrt(Math.max(1, feature.areaSqM)) * 0.42;
  const islandLocalScaleM = islandLocalScale(feature);
  const readableFloorM = readableFloorMajorAxisM(placementKind, longestDimensionM, acreage);
  const naturalMajorAxisM = islandScaled;
  const minClampM = Math.min(readableFloorM, Math.max(readableFloorM * 0.72, islandLocalScaleM * 2.5));
  const lakePctCapM = longestDimensionM * (lakeSizeBandForAcreage(acreage) === 'large' ? 0.06 : 0.1);
  const localCapM = Math.max(readableFloorM * 0.72, islandLocalScaleM * 2.5);
  const islandSizeCapM = Math.max(180, Math.min(lakePctCapM, localCapM));
  const naturalMaxM = Math.max(180, Math.min(longestDimensionM * 0.025, islandSizeCapM));
  const maxClampM = Math.max(minClampM, naturalMaxM);
  const baseMajorAxisM = clampM(naturalMajorAxisM, minClampM, maxClampM);
  const sizeCapApplied = islandSizeCapM < readableFloorM - 0.001 || islandSizeCapM < longestDimensionM * 0.025 - 0.001;
  return {
    naturalMajorAxisM,
    baseMajorAxisM,
    minClampM,
    maxClampM,
    clampReason: clampReason(naturalMajorAxisM, minClampM, maxClampM),
    lakeSizeBand: lakeSizeBandForAcreage(acreage),
    readableFloorMajorAxisM: readableFloorM,
    readableFloorApplied: baseMajorAxisM > naturalMajorAxisM + 0.001,
    islandReadableFloorM: readableFloorM,
    islandNaturalScaleM: islandScaled,
    islandReadableFloorApplied: baseMajorAxisM > naturalMajorAxisM + 0.001,
    islandLocalScaleMeters: islandLocalScaleM,
    islandSizeCapM,
    islandSizeCapApplied: sizeCapApplied,
    islandSizeCapReason: sizeCapApplied ? 'local_island_scale_cap' : null,
    islandZoneRepresentsWholeIsland: baseMajorAxisM >= islandLocalScaleM * 1.2 && islandLocalScaleM <= readableFloorM * 0.45,
    maxCandidateMajorAxisM: islandSizeCapM,
  };
}

function islandLocalScale(feature: WaterReaderIslandFeature): number {
  const endpointDistance = distanceM(feature.endpointA, feature.endpointB);
  const bounds = boundsForRing(feature.ring);
  const bboxDiagonal = Math.hypot(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY);
  const areaScale = Math.sqrt(Math.max(1, feature.areaSqM));
  return Math.max(1, endpointDistance, bboxDiagonal, areaScale);
}

function sampleRingPoints(ring: RingM, count: number): PointM[] {
  if (ring.length === 0 || count <= 0) return [];
  const step = Math.max(1, Math.floor(ring.length / count));
  const points: PointM[] = [];
  for (let i = 0; i < ring.length && points.length < count; i += step) {
    points.push(ring[i]!);
  }
  return points;
}

function ringsSameByCoordinate(a: RingM, b: RingM): boolean {
  if (a === b) return true;
  if (a.length !== b.length || a.length === 0) return false;
  const sameForward = a.every((point, index) => distanceM(point, b[index]!) < 0.5);
  if (sameForward) return true;
  return a.every((point, index) => distanceM(point, b[b.length - 1 - index]!) < 0.5);
}

function boundsForRing(ring: RingM): { minX: number; maxX: number; minY: number; maxY: number } {
  if (ring.length === 0) return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
  return ring.reduce((bounds, point) => ({
    minX: Math.min(bounds.minX, point.x),
    maxX: Math.max(bounds.maxX, point.x),
    minY: Math.min(bounds.minY, point.y),
    maxY: Math.max(bounds.maxY, point.y),
  }), { minX: ring[0]!.x, maxX: ring[0]!.x, minY: ring[0]!.y, maxY: ring[0]!.y });
}

function pointSizing(
  feature: WaterReaderPointFeature,
  placementKind: WaterReaderZonePlacementKind,
  longestDimensionM: number,
  acreage?: number | null,
): DraftSizingMetadata {
  const sideSlopeLength = average([
    distanceM(feature.tip, feature.leftSlope),
    distanceM(feature.tip, feature.rightSlope),
  ]);
  const lakeSizeBand = lakeSizeBandForAcreage(acreage);
  let naturalMajorAxisM: number;
  let minClampM: number;
  let maxClampM: number;
  if (feature.featureClass === 'secondary_point') {
    naturalMajorAxisM = feature.protrusionLengthM * 0.8;
    minClampM = readableFloorMajorAxisM(placementKind, longestDimensionM, acreage);
    maxClampM = longestDimensionM * 0.065;
  } else if (placementKind === 'main_point_tip') {
    naturalMajorAxisM = Math.max(feature.protrusionLengthM * 0.65, sideSlopeLength * 0.35);
    minClampM = readableFloorMajorAxisM(placementKind, longestDimensionM, acreage);
    maxClampM = longestDimensionM * 0.07;
  } else {
    naturalMajorAxisM = Math.max(feature.protrusionLengthM * 1.05, sideSlopeLength * 0.6);
    minClampM = readableFloorMajorAxisM(placementKind, longestDimensionM, acreage);
    maxClampM = longestDimensionM * 0.09;
  }
  maxClampM = Math.max(maxClampM, minClampM);
  const baseMajorAxisM = clampM(naturalMajorAxisM, minClampM, maxClampM);
  return {
    naturalMajorAxisM,
    baseMajorAxisM,
    minClampM,
    maxClampM,
    clampReason: clampReason(naturalMajorAxisM, minClampM, maxClampM),
    lakeSizeBand,
    readableFloorMajorAxisM: minClampM,
    readableFloorApplied: baseMajorAxisM > naturalMajorAxisM + 0.001,
    pointProtrusionLengthM: feature.protrusionLengthM,
    pointSideSlopeLengthM: sideSlopeLength,
  };
}

function coveSizing(
  feature: WaterReaderCoveFeature,
  placementKind: WaterReaderZonePlacementKind,
  longestDimensionM: number,
  acreage?: number | null,
): DraftSizingMetadata {
  let naturalMajorAxisM: number;
  let maxClampM = longestDimensionM * 0.08;
  if (placementKind === 'cove_back') {
    naturalMajorAxisM = Math.max(feature.coveDepthM * 0.8, feature.mouthWidthM * 0.5);
  } else if (placementKind === 'cove_mouth') {
    naturalMajorAxisM = feature.mouthWidthM * 0.65;
  } else {
    const sidePathLengthM = selectedCoveSidePathLengthM(feature);
    naturalMajorAxisM = sidePathLengthM > 0
      ? sidePathLengthM * 0.45
      : Math.max(feature.coveDepthM, feature.mouthWidthM) * 0.65;
  }
  const minClampM = readableFloorMajorAxisM(placementKind, longestDimensionM, acreage);
  maxClampM = Math.max(maxClampM, minClampM);
  const baseMajorAxisM = clampM(naturalMajorAxisM, minClampM, maxClampM);
  return {
    naturalMajorAxisM,
    baseMajorAxisM,
    minClampM,
    maxClampM,
    clampReason: clampReason(naturalMajorAxisM, minClampM, maxClampM),
    lakeSizeBand: lakeSizeBandForAcreage(acreage),
    readableFloorMajorAxisM: minClampM,
    readableFloorApplied: baseMajorAxisM > naturalMajorAxisM + 0.001,
  };
}

function damCornerSizing(feature: WaterReaderDamFeature, longestDimensionM: number, acreage?: number | null): DraftSizingMetadata {
  const naturalMajorAxisM = feature.segmentLengthM * 0.18;
  const minClampM = readableFloorMajorAxisM('dam_corner', longestDimensionM, acreage);
  const maxClampM = Math.max(longestDimensionM * 0.08, minClampM);
  const baseMajorAxisM = clampM(naturalMajorAxisM, minClampM, maxClampM);
  return {
    naturalMajorAxisM,
    baseMajorAxisM,
    minClampM,
    maxClampM,
    clampReason: clampReason(naturalMajorAxisM, minClampM, maxClampM),
    lakeSizeBand: lakeSizeBandForAcreage(acreage),
    readableFloorMajorAxisM: minClampM,
    readableFloorApplied: baseMajorAxisM > naturalMajorAxisM + 0.001,
  };
}

function makeAnchoredDraft(params: {
  feature: WaterReaderDetectedFeature;
  anchor: PointM;
  waterDirection?: PointM;
  preferredRotationRad?: number;
  includePerpendicularRotation?: boolean;
  preferredRotationOnly?: boolean;
  strictInwardNormal?: boolean;
  offsetFactors?: readonly number[];
  sizeFactors?: readonly number[];
  centerOverrides?: Array<{
    center: PointM;
    anchorSemanticId?: WaterReaderZonePlacementSemanticId;
    diagnostics: Record<string, number | string | boolean | null>;
  }>;
  shorelineRing: RingM;
  polygon: PolygonM;
  longestDimensionM: number;
  averageLakeWidthM?: number;
  lakeAreaSqM?: number;
  acreage?: number | null;
  placementKind: WaterReaderZonePlacementKind;
  placementSemanticId: WaterReaderZonePlacementSemanticId;
  anchorSemanticId: WaterReaderZonePlacementSemanticId;
  largeFeature?: boolean;
  baseMajorAxisM?: number;
  sizingMetadata?: DraftSizingMetadata;
  unitSuffix?: string;
  allowPairCrowding?: boolean;
  diagnostics?: Record<string, number | string | boolean | null>;
}): WaterReaderZoneDraft[] {
  const frame = shorelineFrame(params.anchor, params.shorelineRing, params.polygon, params.longestDimensionM);
  if (!frame) return [];
  const frames = params.largeFeature
    ? shorelineFrameVariants(frame, params.anchor, params.shorelineRing, params.polygon, params.longestDimensionM)
    : [frame];
  const baseMajorAxisM = params.baseMajorAxisM ??
    Math.max(params.longestDimensionM * (params.largeFeature ? 0.1 : 0.08), params.longestDimensionM * 0.04, 24);
  const sizeFactors = params.sizeFactors ?? (params.largeFeature ? LARGE_SIZE_FACTORS : STANDARD_SIZE_FACTORS);
  const candidateKey = `${params.feature.featureId}:${params.placementKind}:${params.unitSuffix ?? 'primary'}`;
  const prominence = featureProminenceDiagnostics({
    feature: params.feature,
    placementKind: params.placementKind,
    longestDimensionM: params.longestDimensionM,
    averageLakeWidthM: params.averageLakeWidthM,
    lakeAreaSqM: params.lakeAreaSqM,
    acreage: params.acreage,
    readableFloorApplied: params.sizingMetadata?.readableFloorApplied === true || params.sizingMetadata?.islandReadableFloorApplied === true,
  });
  const drafts: WaterReaderZoneDraft[] = [];
  for (let anchorIndex = 0; anchorIndex < frames.length; anchorIndex++) {
    const candidateFrame = frames[anchorIndex]!;
    const normalOptions = inwardNormalOptions({
      anchor: candidateFrame.anchor,
      preferredDirection: params.waterDirection,
      fallbackNormal: candidateFrame.inwardNormal,
      polygon: params.polygon,
      longestDimensionM: params.longestDimensionM,
      strictInwardNormal: params.strictInwardNormal,
    });
      const rotationOptions = zoneRotationOptions(
      candidateFrame.rotationRad,
      params.waterDirection,
      params.largeFeature === true || params.includePerpendicularRotation === true,
      params.preferredRotationRad,
      params.preferredRotationOnly,
    );
    for (let normalIndex = 0; normalIndex < normalOptions.length; normalIndex++) {
      const inwardNormal = normalOptions[normalIndex]!;
      for (let rotationIndex = 0; rotationIndex < rotationOptions.length; rotationIndex++) {
      const rotationRad = rotationOptions[rotationIndex]!;
      for (const sizeFactor of sizeFactors) {
        const rawMajorAxisM = baseMajorAxisM * sizeFactor;
        const majorAxisM = params.sizingMetadata?.maxCandidateMajorAxisM
          ? Math.min(rawMajorAxisM, params.sizingMetadata.maxCandidateMajorAxisM)
          : rawMajorAxisM;
        const sizeMultiplierApplied = baseMajorAxisM > 0 ? majorAxisM / baseMajorAxisM : sizeFactor;
          const defaultMinorAxisM = majorAxisM / ASPECT_RATIO;
          const minorAxisVariants = minorAxisDraftVariants(
            params.feature,
            params.sizingMetadata,
            majorAxisM,
            defaultMinorAxisM,
            candidateFrame.recovered,
          );
        for (const minorVariant of minorAxisVariants) {
          const minorAxisM = minorVariant.minorAxisM;
          const sizingDiagnostics = sizingDiagnosticsForDraft(params.sizingMetadata, {
            majorAxisM,
            minorAxisM,
            defaultMinorAxisM,
            sizeFactor,
          });
          const islandCandidateCapApplied = params.feature.featureClass === 'island' && majorAxisM < rawMajorAxisM - 0.001;
          const islandCandidateCapDiagnostics: Record<string, number | string | boolean | string[] | null> = params.feature.featureClass === 'island'
            ? {
                islandSizeCapApplied: params.sizingMetadata?.islandSizeCapApplied === true || islandCandidateCapApplied,
                islandSizeCapReason: islandCandidateCapApplied ? 'candidate_multiplier_local_cap' : params.sizingMetadata?.islandSizeCapReason ?? null,
              }
            : {};
          const sizingQaFlags = sizingQaFlagsForDraft(params.feature, params.placementKind, params.sizingMetadata, {
            majorAxisM,
            minorAxisM,
            defaultMinorAxisM,
            sizeFactor,
          });
          for (const override of params.centerOverrides ?? []) {
            const semanticAnchorId = candidateFrame.recovered
              ? recoveredAnchorSemantic(params.feature, params.anchorSemanticId)
              : override.anchorSemanticId ?? params.anchorSemanticId;
            const semanticDiagnostics = zoneSemanticDiagnostics({
              feature: params.feature,
              placementKind: params.placementKind,
              placementSemanticId: params.placementSemanticId,
              anchorSemanticId: semanticAnchorId,
              anchor: candidateFrame.anchor,
              sizeFactor,
              rejectedCandidateReasons: null,
            });
            drafts.push({
              unitId: params.feature.featureId,
              candidateKey,
              unitPriority: featureZonePriority(params.feature),
              unitScore: prominence.featureProminenceScore,
              sourceFeatureId: params.feature.featureId,
              featureClass: params.feature.featureClass,
              placementKind: params.placementKind,
              placementSemanticId: params.placementSemanticId,
              anchorSemanticId: semanticAnchorId,
              anchor: candidateFrame.anchor,
              ovalCenter: override.center,
              majorAxisM,
              minorAxisM,
              rotationRad,
              diagnostics: {
                sourceRank: params.feature.metrics.rank ?? null,
                shorelineOffsetFactor: null,
                selectedOffsetFactor: null,
                selectedSizeFactor: sizeFactor,
                islandSizeMultiplierApplied: params.feature.featureClass === 'island' ? sizeMultiplierApplied : null,
                selectedAnchorIndex: anchorIndex,
                selectedNormalIndex: normalIndex,
                selectedRotationIndex: rotationIndex,
                unitSuffix: params.unitSuffix ?? null,
                placementSemanticId: params.placementSemanticId,
                anchorSemanticId: semanticAnchorId,
                unitScore: prominence.featureProminenceScore,
                featureProminenceScore: prominence.featureProminenceScore,
                featureProminenceSource: prominence.featureProminenceSource,
                featureProminenceFallbackUsed: prominence.featureProminenceFallbackUsed,
                ...sizingDiagnostics,
                ...islandCandidateCapDiagnostics,
                ...semanticDiagnostics,
                ...minorVariant.diagnostics,
                ...params.diagnostics,
                ...override.diagnostics,
                constrictionEndpointRecovered: candidateFrame.recovered,
                constrictionEndpointSearchMeters: candidateFrame.searchMeters,
                constrictionEndpointCandidateCount: frames.length,
              },
              qaFlags: ['shoreline_hugging_oval', ...sizingQaFlags],
              allowPairCrowding: params.allowPairCrowding,
            });
          }
          for (const offsetFactor of params.offsetFactors ?? OFFSET_FACTORS) {
            const semanticAnchorId = candidateFrame.recovered ? recoveredAnchorSemantic(params.feature, params.anchorSemanticId) : params.anchorSemanticId;
            const semanticDiagnostics = zoneSemanticDiagnostics({
              feature: params.feature,
              placementKind: params.placementKind,
              placementSemanticId: params.placementSemanticId,
              anchorSemanticId: semanticAnchorId,
              anchor: candidateFrame.anchor,
              sizeFactor,
              rejectedCandidateReasons: null,
            });
            drafts.push({
              unitId: params.feature.featureId,
              candidateKey,
              unitPriority: featureZonePriority(params.feature),
              unitScore: prominence.featureProminenceScore,
              sourceFeatureId: params.feature.featureId,
              featureClass: params.feature.featureClass,
              placementKind: params.placementKind,
              placementSemanticId: params.placementSemanticId,
              anchorSemanticId: semanticAnchorId,
              anchor: candidateFrame.anchor,
              ovalCenter: {
                x: candidateFrame.anchor.x + inwardNormal.x * majorAxisM * offsetFactor,
                y: candidateFrame.anchor.y + inwardNormal.y * majorAxisM * offsetFactor,
              },
              majorAxisM,
              minorAxisM,
              rotationRad,
              diagnostics: {
                sourceRank: params.feature.metrics.rank ?? null,
                shorelineOffsetFactor: offsetFactor,
                selectedOffsetFactor: offsetFactor,
                selectedSizeFactor: sizeFactor,
                islandSizeMultiplierApplied: params.feature.featureClass === 'island' ? sizeMultiplierApplied : null,
                selectedAnchorIndex: anchorIndex,
                selectedNormalIndex: normalIndex,
                selectedRotationIndex: rotationIndex,
                unitSuffix: params.unitSuffix ?? null,
                placementSemanticId: params.placementSemanticId,
                anchorSemanticId: semanticAnchorId,
                unitScore: prominence.featureProminenceScore,
                featureProminenceScore: prominence.featureProminenceScore,
                featureProminenceSource: prominence.featureProminenceSource,
                featureProminenceFallbackUsed: prominence.featureProminenceFallbackUsed,
                ...sizingDiagnostics,
                ...islandCandidateCapDiagnostics,
                ...semanticDiagnostics,
                ...minorVariant.diagnostics,
                ...params.diagnostics,
                constrictionEndpointRecovered: candidateFrame.recovered,
                constrictionEndpointSearchMeters: candidateFrame.searchMeters,
                constrictionEndpointCandidateCount: frames.length,
              },
              qaFlags: ['shoreline_hugging_oval', ...sizingQaFlags],
              allowPairCrowding: params.allowPairCrowding,
            });
          }
        }
        }
      }
    }
  }
  return drafts;
}

function recoveredAnchorSemantic(
  feature: WaterReaderDetectedFeature,
  fallback: WaterReaderZonePlacementSemanticId,
): WaterReaderZonePlacementSemanticId {
  if (feature.featureClass === 'neck') return 'neck_shoulder_approach';
  if (feature.featureClass === 'saddle') return 'saddle_shoulder_approach';
  return 'shoreline_frame_recovery' satisfies WaterReaderZonePlacementSemanticId;
}

function zoneSemanticDiagnostics(params: {
  feature: WaterReaderDetectedFeature;
  placementKind: WaterReaderZonePlacementKind;
  placementSemanticId: WaterReaderZonePlacementSemanticId;
  anchorSemanticId: WaterReaderZonePlacementSemanticId;
  anchor: PointM;
  sizeFactor: number;
  rejectedCandidateReasons: Record<string, number> | null;
}): Record<string, number | string | boolean | null> {
  const semanticFallbackUsed = semanticFallbackUsedFor(params.placementSemanticId, params.anchorSemanticId);
  const confidenceTier = semanticConfidenceTier(params.feature, params.anchorSemanticId, semanticFallbackUsed);
  const rejectedReason = params.rejectedCandidateReasons ? primaryRejectedReason(params.rejectedCandidateReasons) : '';
  const diagnostics: Record<string, number | string | boolean | null> = {
    intendedSeasonalSemantic: params.placementSemanticId,
    actualAnchorSemantic: params.anchorSemanticId,
    semanticFallbackUsed,
    semanticFallbackReason: semanticFallbackUsed ? semanticFallbackReasonFor(params.anchorSemanticId, rejectedReason) : null,
    semanticConfidenceTier: confidenceTier,
    displayReadabilityTier: displayReadabilityTier(params.sizeFactor, confidenceTier),
  };
  if (params.feature.featureClass === 'cove') {
    const distanceFromBackM = distanceM(params.anchor, params.feature.back);
    const scaleM = Math.max(params.feature.coveDepthM, params.feature.shorePathLengthM * 0.5, 1);
    const coveTier = covePlacementTier(params.anchorSemanticId);
    diagnostics.intendedCoveSemantic = params.placementSemanticId;
    diagnostics.actualCoveAnchorSemantic = params.anchorSemanticId;
    diagnostics.intendedSeasonalSemantic = params.placementKind === 'cove_back' ? 'cove_back_pocket' : params.placementSemanticId;
    diagnostics.covePlacementTier = coveTier;
    diagnostics.coveFallbackUsed = coveTier !== 'true_back';
    diagnostics.coveFallbackReason = coveTier === 'true_back'
      ? null
      : rejectedReason || coveFallbackReasonForTier(coveTier);
    diagnostics.coveFallbackDistanceFromBackPct = roundDiagnosticNumber(clamp((distanceFromBackM / scaleM) * 100, 0, 999));
    diagnostics.coveWeakSpringFallbackRetained = false;
  }
  if (params.feature.featureClass === 'island') {
    diagnostics.islandSizeAttemptMultiplier = params.sizeFactor;
    diagnostics.islandSizeRecoveryRejectedReason = params.sizeFactor >= 1.5 ? null : rejectedReason || null;
  }
  if (params.feature.featureClass === 'neck' || params.feature.featureClass === 'saddle') {
    const approach = params.anchorSemanticId === 'neck_shoulder_approach' || params.anchorSemanticId === 'saddle_shoulder_approach';
    diagnostics.constrictionApproachCandidateAttempted = true;
    diagnostics.constrictionApproachCandidateUsed = approach;
    diagnostics.constrictionApproachRejectedReason = approach ? null : rejectedReason || null;
  }
  return diagnostics;
}

function covePlacementTier(anchorSemanticId: WaterReaderZonePlacementSemanticId): string {
  switch (anchorSemanticId) {
    case 'cove_back_primary':
      return 'true_back';
    case 'cove_back_pocket_recovery':
    case 'cove_back_pocket_recovery_left':
    case 'cove_back_pocket_recovery_right':
      return 'near_back_recovery';
    case 'cove_inner_shoreline_left':
    case 'cove_inner_shoreline_right':
    case 'cove_inner_wall_midpoint_left':
    case 'cove_inner_wall_midpoint_right':
      return 'inner_shoreline_recovery';
    case 'cove_mouth_shoulder_recovery':
      return 'mouth_shoulder_recovery';
    default:
      return 'mouth_shoulder_recovery';
  }
}

function coveFallbackReasonForTier(tier: string): string {
  switch (tier) {
    case 'near_back_recovery':
      return 'true_back_candidate_failed';
    case 'inner_shoreline_recovery':
      return 'true_and_near_back_candidates_failed';
    case 'mouth_shoulder_recovery':
      return 'back_and_inner_cove_candidates_failed';
    default:
      return 'cove_candidate_recovery_selected';
  }
}

function semanticFallbackUsedFor(
  intended: WaterReaderZonePlacementSemanticId,
  actual: WaterReaderZonePlacementSemanticId,
): boolean {
  if (intended === actual) return false;
  if (actual.includes('recovery') || actual.includes('fallback') || actual.includes('proxy') || actual.includes('inner') || actual.includes('approach')) return true;
  if (actual === 'shoreline_frame_recovery') return true;
  return false;
}

function semanticFallbackReasonFor(anchorSemanticId: WaterReaderZonePlacementSemanticId, rejectedReason: string): string {
  if (rejectedReason) return rejectedReason;
  if (anchorSemanticId.includes('approach')) return 'approach_anchor_selected';
  if (anchorSemanticId.includes('inner')) return 'primary_or_back_pocket_candidate_failed';
  if (anchorSemanticId.includes('mouth')) return 'back_and_inner_cove_candidates_failed';
  if (anchorSemanticId.includes('recovery') || anchorSemanticId.includes('fallback') || anchorSemanticId.includes('proxy')) return 'primary_candidate_failed';
  return 'semantic_anchor_differs_from_intent';
}

function semanticConfidenceTier(
  feature: WaterReaderDetectedFeature,
  anchorSemanticId: WaterReaderZonePlacementSemanticId,
  semanticFallbackUsed: boolean,
): 'exact' | 'recovery' | 'fallback_line' | 'failed_candidate_recovered' {
  if ((feature.featureClass === 'neck' || feature.featureClass === 'saddle') && anchorSemanticId.includes('approach')) return 'recovery';
  if (!semanticFallbackUsed) return 'exact';
  if (anchorSemanticId === 'shoreline_frame_recovery' || anchorSemanticId.includes('fallback') || anchorSemanticId.includes('proxy')) return 'failed_candidate_recovered';
  return 'recovery';
}

function displayReadabilityTier(sizeFactor: number, confidenceTier: string): string {
  if (confidenceTier === 'fallback_line') return 'line_fallback';
  if (sizeFactor >= 1) return 'readable';
  if (sizeFactor >= 0.72) return 'recovered_readable';
  return 'compact_recovery';
}

function minorAxisDraftVariants(
  feature: WaterReaderDetectedFeature,
  sizing: DraftSizingMetadata | undefined,
  majorAxisM: number,
  defaultMinorAxisM: number,
  approachCandidate: boolean,
): Array<{ minorAxisM: number; diagnostics: Record<string, number | string | boolean | null> }> {
  const fallbackCap = sizing?.constrictionMinorAxisWidthCapM ?? null;
  const constrictionWidthM = sizing?.constrictionWidthM ?? null;
  if ((feature.featureClass !== 'neck' && feature.featureClass !== 'saddle') || fallbackCap === null || constrictionWidthM === null || constrictionWidthM <= 0) {
    return [{
      minorAxisM: defaultMinorAxisM,
      diagnostics: {
        zoneAspectRatio: defaultMinorAxisM > 0 ? majorAxisM / defaultMinorAxisM : null,
        constrictionOvalCandidateUsed: false,
        constrictionLineFallbackUsed: false,
      },
    }];
  }

  const fallbackMinorAxisM = Math.min(defaultMinorAxisM, fallbackCap);
  const aspectProtectedMinorAxisM = majorAxisM / 6;
  const preferredWidthCapM = constrictionWidthM * (
    approachCandidate
      ? feature.featureClass === 'neck' ? 2.8 : 2.4
      : feature.featureClass === 'neck' ? 1.05 : 0.95
  );
  const preferredMinorAxisM = Math.min(defaultMinorAxisM, preferredWidthCapM, Math.max(fallbackMinorAxisM, aspectProtectedMinorAxisM));
  const preferredAspectRatio = preferredMinorAxisM > 0 ? majorAxisM / preferredMinorAxisM : null;
  const fallbackAspectRatio = fallbackMinorAxisM > 0 ? majorAxisM / fallbackMinorAxisM : null;
  const variants = [{
    minorAxisM: preferredMinorAxisM,
    diagnostics: {
      zoneAspectRatio: preferredAspectRatio,
      constrictionOvalCandidateUsed: preferredAspectRatio !== null && preferredAspectRatio <= 6.05,
      constrictionLineFallbackUsed: preferredAspectRatio !== null && preferredAspectRatio > 6.05,
      ...(preferredAspectRatio !== null && preferredAspectRatio > 6.05
        ? {
            semanticFallbackUsed: true,
            semanticFallbackReason: 'approach_candidate_not_selected',
            semanticConfidenceTier: 'fallback_line',
            displayReadabilityTier: 'line_fallback',
          }
        : {}),
      constrictionPreferredMinorAxisM: preferredMinorAxisM,
      constrictionFallbackMinorAxisM: fallbackMinorAxisM,
    },
  }];
  if (Math.abs(preferredMinorAxisM - fallbackMinorAxisM) > 0.5) {
    variants.push({
      minorAxisM: fallbackMinorAxisM,
      diagnostics: {
        zoneAspectRatio: fallbackAspectRatio,
        constrictionOvalCandidateUsed: false,
        constrictionLineFallbackUsed: fallbackAspectRatio !== null && fallbackAspectRatio > 6.05,
        ...(fallbackAspectRatio !== null && fallbackAspectRatio > 6.05
          ? {
              semanticFallbackUsed: true,
              semanticFallbackReason: 'approach_candidate_not_selected',
              semanticConfidenceTier: 'fallback_line',
              displayReadabilityTier: 'line_fallback',
            }
          : {}),
        constrictionPreferredMinorAxisM: preferredMinorAxisM,
        constrictionFallbackMinorAxisM: fallbackMinorAxisM,
      },
    });
  }
  return variants;
}

function selectValidZonesByUnit(params: {
  drafts: WaterReaderZoneDraft[];
  polygon: PolygonM;
  longestDimensionM: number;
  cap: number;
}): {
  zones: WaterReaderPlacedZone[];
  rejectedByReason: Record<string, number>;
  droppedByReason: Record<string, number>;
  unitOutcomes: Record<string, WaterReaderFeatureZoneCoverage['reason']>;
  unitDiagnostics: WaterReaderZoneUnitDiagnostics[];
  materializedCandidateCount: number;
  validCandidateCount: number;
  unitCombinationAttemptCount: number;
} {
  void params.cap;
  const groups = groupDrafts(params.drafts).sort((a, b) => zoneDraftSort(a.drafts[0]!, b.drafts[0]!));
  const selected: WaterReaderPlacedZone[] = [];
  const rejectedByReason: Record<string, number> = {};
  const droppedByReason: Record<string, number> = {};
  const unitOutcomes: Record<string, WaterReaderFeatureZoneCoverage['reason']> = {};
  const unitDiagnostics: WaterReaderZoneUnitDiagnostics[] = [];
  let materializedCandidateCount = 0;
  let validCandidateCount = 0;
  let unitCombinationAttemptCount = 0;
  for (const group of groups) {
    const groupStartMs = Date.now();
    const firstDraft = group.drafts[0]!;
    const placementKinds = uniquePlacementKinds(group.drafts);
    let unitMaterializedCandidateCount = 0;
    let unitValidCandidateCount = 0;
    let unitCombinationAttemptCountForGroup = 0;
    let unitSelected = false;
    let unitReason: WaterReaderFeatureZoneCoverage['reason'] | string = 'feature_unit_not_selected';
    let unitRejectedCandidateReasons: Record<string, number> = {};
    let unitPrimaryRejectedCandidateReason: string | null = null;
    const finishUnit = () => {
      const featureEnvelopeSuppressionReason = !unitSelected && unitPrimaryRejectedCandidateReason
        ? unitPrimaryRejectedCandidateReason
        : null;
      const frameUnrepresentableReason = !unitSelected && unitPrimaryRejectedCandidateReason
        ? featureFrameUnrepresentableReason(firstDraft.featureClass, unitPrimaryRejectedCandidateReason)
        : null;
      unitDiagnostics.push({
        featureId: group.unitId,
        featureClass: firstDraft.featureClass,
        placementKinds,
        draftCount: group.drafts.length,
        materializedCandidateCount: unitMaterializedCandidateCount,
        validCandidateCount: unitValidCandidateCount,
        unitCombinationAttemptCount: unitCombinationAttemptCountForGroup,
        elapsedMs: Date.now() - groupStartMs,
        selected: unitSelected,
        reason: unitReason,
        primaryRejectedCandidateReason: unitPrimaryRejectedCandidateReason,
        rejectedCandidateReasons: unitRejectedCandidateReasons,
        featureEnvelopeSuppressionReason,
        featureFrameKind: typeof firstDraft.diagnostics.featureFrameKind === 'string' ? firstDraft.diagnostics.featureFrameKind : null,
        featureFrameFallbackTier: typeof firstDraft.diagnostics.featureFrameFallbackTier === 'string'
          ? firstDraft.diagnostics.featureFrameFallbackTier
          : typeof firstDraft.diagnostics.featureEnvelopeRecoveryTier === 'string'
            ? firstDraft.diagnostics.featureEnvelopeRecoveryTier
            : null,
        featureFrameUnrepresentableReason: frameUnrepresentableReason,
      });
    };
    const candidateGroups = groupCandidateDrafts(group.drafts);
    const canUseOneZoneFallback = firstDraft.featureClass === 'main_lake_point';
    const candidatesByPlacement: Array<Array<Omit<WaterReaderPlacedZone, 'zoneId'>>> = [];
    let rejected = false;
    for (const candidateGroup of candidateGroups) {
      const result = validZoneCandidates({
        drafts: candidateGroup.drafts,
        polygon: params.polygon,
        longestDimensionM: params.longestDimensionM,
      });
      materializedCandidateCount += result.materializedCandidateCount;
      validCandidateCount += result.validCandidateCount;
      unitMaterializedCandidateCount += result.materializedCandidateCount;
      unitValidCandidateCount += result.validCandidateCount;
      unitRejectedCandidateReasons = mergeCounts(unitRejectedCandidateReasons, result.rejectedCandidateReasons);
      if (result.primaryReason) unitPrimaryRejectedCandidateReason = result.primaryReason;
      if (result.candidates.length === 0) {
        increment(rejectedByReason, result.primaryReason);
        if (!canUseOneZoneFallback) {
          rejected = true;
          const reason = firstDraft.featureClass === 'island'
            ? islandSuppressionReason(result.primaryReason)
            : `rejected_invariant:${result.primaryReason}` as WaterReaderFeatureZoneCoverage['reason'];
          unitOutcomes[group.unitId] = reason;
          unitReason = reason;
          break;
        }
        continue;
      }
      candidatesByPlacement.push(result.candidates);
    }
    if (rejected) {
      finishUnit();
      continue;
    }
    if (candidatesByPlacement.length === 0) {
      const reason = unitPrimaryRejectedCandidateReason
        ? `rejected_invariant:${unitPrimaryRejectedCandidateReason}` as WaterReaderFeatureZoneCoverage['reason']
        : 'no_valid_draft';
      unitOutcomes[group.unitId] = reason;
      unitReason = reason;
      finishUnit();
      continue;
    }
    const combination = chooseBestUnitCombination({
      candidatesByPlacement,
      selected,
      longestDimensionM: params.longestDimensionM,
    });
    unitCombinationAttemptCount += combination.attemptCount;
    unitCombinationAttemptCountForGroup += combination.attemptCount;
    if (!combination.zones) {
      if (canUseOneZoneFallback) {
        const single = chooseBestSingleZoneFallback({
          candidatesByPlacement,
          selected,
          longestDimensionM: params.longestDimensionM,
        });
        unitCombinationAttemptCount += single.attemptCount;
        unitCombinationAttemptCountForGroup += single.attemptCount;
        if (single.zone) {
          selected.push({ ...annotatePointFallbackIfNeeded(single.zone, group.drafts, candidatesByPlacement, combination.reason, false), zoneId: '' });
          unitOutcomes[group.unitId] = 'zoned';
          unitSelected = true;
          unitReason = 'zoned';
          finishUnit();
          continue;
        }
      }
      increment(droppedByReason, combination.reason);
      unitOutcomes[group.unitId] = combination.reason === 'overlap_higher_priority_zone'
        ? 'dropped_overlap_higher_priority_zone'
        : combination.reason === 'zone_crowding'
          ? 'dropped_zone_crowding'
          : combination.reason === 'internal_overlap'
            ? 'dropped_internal_overlap'
            : combination.reason === 'rejected_heavy_pair_overlap'
              ? 'rejected_heavy_pair_overlap'
            : 'feature_unit_not_selected';
      unitReason = unitOutcomes[group.unitId]!;
      finishUnit();
      continue;
    }
    const unitHasTipZone = combination.zones.some((zone) => zone.placementKind === 'main_point_tip');
    const annotatedZones = annotatePairOverlapIfNeeded(combination.zones);
    selected.push(...annotatedZones.map((zone) => ({
      ...annotatePointFallbackIfNeeded(zone, group.drafts, candidatesByPlacement, '', unitHasTipZone),
      zoneId: '',
    })));
    unitOutcomes[group.unitId] = 'zoned';
    unitSelected = true;
    unitReason = 'zoned';
    finishUnit();
  }
  return {
    zones: selected,
    rejectedByReason,
    droppedByReason,
    unitOutcomes,
    unitDiagnostics,
    materializedCandidateCount,
    validCandidateCount,
    unitCombinationAttemptCount,
  };
}

function addUniversalFallbackZones(params: {
  zones: WaterReaderPlacedZone[];
  polygon: PolygonM;
  longestDimensionM: number;
  cap: number;
}): { zones: WaterReaderPlacedZone[]; applied: boolean; rejectedByReason: Record<string, number>; droppedByReason: Record<string, number> } {
  const drafts = universalDrafts(params.polygon, params.longestDimensionM);
  const selected = [...params.zones];
  const rejectedByReason: Record<string, number> = {};
  const droppedByReason: Record<string, number> = {};
  let applied = false;
  for (const candidateGroup of groupCandidateDrafts(drafts)) {
    if (selected.length >= Math.max(2, params.cap)) break;
    const result = chooseBestZoneCandidate({
      drafts: candidateGroup.drafts,
      polygon: params.polygon,
      longestDimensionM: params.longestDimensionM,
    });
    if (!result.zone) {
      increment(rejectedByReason, result.primaryReason);
      continue;
    }
    const zone = { ...result.zone, zoneId: '' };
    if (selected.some((existing) => zonesOverlap(zone, existing))) {
      increment(droppedByReason, 'overlap_higher_priority_zone');
      continue;
    }
    selected.push(zone);
    applied = true;
    if (selected.length >= 2) break;
  }
  return { zones: selected, applied, rejectedByReason, droppedByReason };
}

function enforceSecondaryPointDependencies(
  zones: WaterReaderPlacedZone[],
  features: WaterReaderDetectedFeature[],
): { zones: WaterReaderPlacedZone[]; droppedFeatureIds: Set<string>; droppedSecondaryCount: number } {
  const coveFeatureIdsWithZones = new Set(
    zones.filter((zone) => zone.featureClass === 'cove').map((zone) => zone.sourceFeatureId),
  );
  const droppedFeatureIds = new Set<string>();
  const secondaryFeatureIdsWithZones = new Set(
    zones.filter((zone) => zone.featureClass === 'secondary_point').map((zone) => zone.sourceFeatureId),
  );
  const secondaryRecoveryIds = new Set<string>();
  for (const feature of features) {
    if (feature.featureClass === 'secondary_point') {
      const parentZoned = !!feature.parentCoveId && coveFeatureIdsWithZones.has(feature.parentCoveId);
      if (!parentZoned && secondaryFeatureIdsWithZones.has(feature.featureId)) {
        secondaryRecoveryIds.add(feature.featureId);
      } else if (!parentZoned) {
        droppedFeatureIds.add(feature.featureId);
      }
    }
  }
  const annotatedZones = zones.map((zone) => secondaryRecoveryIds.has(zone.sourceFeatureId)
    ? {
        ...zone,
        diagnostics: {
          ...zone.diagnostics,
          parentCoveSuppressedButSecondaryRecovered: true,
          fallbackPlacementUsed: true,
          fallbackPlacementKind: zone.diagnostics.fallbackPlacementKind ?? 'secondary_point_parent_failed_recovery',
        },
        qaFlags: [...zone.qaFlags, 'secondary_point_parent_failed_recovery'],
      }
    : zone);
  if (droppedFeatureIds.size === 0) return { zones: annotatedZones, droppedFeatureIds, droppedSecondaryCount: 0 };
  return {
    zones: annotatedZones.filter((zone) => !droppedFeatureIds.has(zone.sourceFeatureId)),
    droppedFeatureIds,
    droppedSecondaryCount: droppedFeatureIds.size,
  };
}

function buildFeatureCoverage(params: {
  features: WaterReaderDetectedFeature[];
  drafts: WaterReaderZoneDraft[];
  zones: WaterReaderPlacedZone[];
  season: WaterReaderSeason;
  unitOutcomes: Record<string, WaterReaderFeatureZoneCoverage['reason']>;
  secondaryDependencyDrops: Set<string>;
}): WaterReaderFeatureZoneCoverage[] {
  const draftCounts = new Map<string, number>();
  for (const draft of params.drafts) draftCounts.set(draft.unitId, (draftCounts.get(draft.unitId) ?? 0) + 1);
  const zoneCounts = new Map<string, number>();
  for (const zone of params.zones) zoneCounts.set(zone.sourceFeatureId, (zoneCounts.get(zone.sourceFeatureId) ?? 0) + 1);

  return params.features.map((feature) => {
    const zoneCount = zoneCounts.get(feature.featureId) ?? 0;
    if (zoneCount > 0) {
      return {
        featureId: feature.featureId,
        featureClass: feature.featureClass,
        zoneCount,
        producedVisibleZones: true,
        reason: 'zoned',
        unrepresentableReason: null,
      };
    }
    const rawReason = featureCoverageReason({
      feature,
      season: params.season,
      hasDrafts: (draftCounts.get(feature.featureId) ?? 0) > 0,
      unitOutcome: params.unitOutcomes[feature.featureId],
      secondaryDependencyDrops: params.secondaryDependencyDrops,
    });
    const unrepresentableReason = featureFrameUnrepresentableReason(feature.featureClass, rawReason);
    return {
      featureId: feature.featureId,
      featureClass: feature.featureClass,
      zoneCount: 0,
      producedVisibleZones: false,
      reason: unrepresentableReason ? 'feature_frame_unrepresentable' : rawReason,
      unrepresentableReason,
    };
  });
}

function featureCoverageReason(params: {
  feature: WaterReaderDetectedFeature;
  season: WaterReaderSeason;
  hasDrafts: boolean;
  unitOutcome: WaterReaderFeatureZoneCoverage['reason'] | undefined;
  secondaryDependencyDrops: Set<string>;
}): WaterReaderFeatureZoneCoverage['reason'] {
  if (params.secondaryDependencyDrops.has(params.feature.featureId)) return 'parent_cove_not_zoned';
  if (!params.hasDrafts) {
    if (isSeasonalZoneSkip(params.feature, params.season)) return 'seasonal_skip';
    if (params.feature.featureClass === 'secondary_point') return 'parent_cove_not_zoned';
    return 'no_valid_draft';
  }
  return params.unitOutcome && params.unitOutcome !== 'zoned' ? params.unitOutcome : 'feature_unit_not_selected';
}

function featureFrameUnrepresentableReason(featureClass: WaterReaderDetectedFeature['featureClass'], reason: string | undefined): string | null {
  if (!reason) return null;
  if (featureClass === 'universal') return null;
  if (reason === 'parent_cove_not_zoned' || reason === 'seasonal_skip') return null;
  if (reason === 'no_valid_draft') return 'no_valid_feature_frame_draft';
  if (reason.startsWith('rejected_invariant:')) return reason.slice('rejected_invariant:'.length);
  if (reason === 'micro_island_unrenderable_without_open_water_zone') return reason;
  if (reason === 'island_edge_zone_failed_hard_invariants') return reason;
  if (reason === 'feature_unit_not_selected') return null;
  if (reason.startsWith('dropped_') || reason === 'rejected_heavy_pair_overlap') return null;
  return reason;
}

function isSeasonalZoneSkip(feature: WaterReaderDetectedFeature, season: WaterReaderSeason): boolean {
  void feature;
  void season;
  return false;
}

function isActiveHighPriorityFeature(feature: WaterReaderDetectedFeature, season: WaterReaderSeason): boolean {
  if (isSeasonalZoneSkip(feature, season)) return false;
  return feature.featureClass === 'neck' ||
    feature.featureClass === 'saddle' ||
    feature.featureClass === 'dam' ||
    feature.featureClass === 'main_lake_point';
}

function islandSuppressionReason(primaryReason: string): WaterReaderFeatureZoneCoverage['reason'] {
  if (primaryReason === 'zone_visible_fraction_too_high') return 'micro_island_unrenderable_without_open_water_zone';
  return 'island_edge_zone_failed_hard_invariants';
}

function universalDrafts(polygon: PolygonM, longestDimensionM: number): WaterReaderZoneDraft[] {
  const longestMidpoint = longestSegmentMidpoint(polygon.exterior);
  const centroidAnchor = nearestPointOnRing(ringCentroid(polygon.exterior), polygon.exterior);
  const anchors = distanceM(longestMidpoint, centroidAnchor) >= longestDimensionM * 0.3
    ? [
        { anchor: longestMidpoint, kind: 'universal_longest_shoreline' as const, id: 'universal-longest' },
        { anchor: centroidAnchor, kind: 'universal_centroid_shoreline' as const, id: 'universal-centroid' },
      ]
    : [{ anchor: centroidAnchor, kind: 'universal_centroid_shoreline' as const, id: 'universal-centroid' }];

  return anchors.flatMap((item) =>
    makeAnchoredDraft({
      feature: {
        featureId: item.id,
        featureClass: 'universal',
        score: 0,
        qaFlags: [],
        metrics: {},
      },
      anchor: item.anchor,
      shorelineRing: polygon.exterior,
      polygon,
      longestDimensionM,
      placementKind: item.kind,
      placementSemanticId: item.kind,
      anchorSemanticId: item.kind,
      unitSuffix: item.id,
    }),
  ).map((draft) => ({ ...draft, qaFlags: [...draft.qaFlags, 'universal_fallback_zone'] }));
}

function shorelineFrame(anchor: PointM, ring: RingM, polygon: PolygonM, longestDimensionM: number) {
  if (ring.length < 2) return null;
  let bestIndex = 0;
  let bestPoint = ring[0]!;
  let bestDistance = Infinity;
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i]!;
    const b = ring[(i + 1) % ring.length]!;
    const point = nearestPointOnSegmentLocal(anchor, a, b);
    const d = distanceM(anchor, point);
    if (d < bestDistance) {
      bestDistance = d;
      bestPoint = point;
      bestIndex = i;
    }
  }
  const a = ring[bestIndex]!;
  const b = ring[(bestIndex + 1) % ring.length]!;
  const tangent = normalize({ x: b.x - a.x, y: b.y - a.y }) ?? { x: 1, y: 0 };
  const normals = [
    { x: -tangent.y, y: tangent.x },
    { x: tangent.y, y: -tangent.x },
  ];
  const probe = Math.max(2, Math.min(25, longestDimensionM * 0.002));
  const inwardNormal = normals.find((normal) =>
    pointInWaterOrBoundary({ x: bestPoint.x + normal.x * probe, y: bestPoint.y + normal.y * probe }, polygon, probe),
  );
  if (!inwardNormal) return null;
  return {
    anchor: bestPoint,
    inwardNormal,
    rotationRad: Math.atan2(tangent.y, tangent.x),
    bestIndex,
    recovered: false,
    searchMeters: 0,
  };
}

function shorelineFrameVariants(
  baseFrame: NonNullable<ReturnType<typeof shorelineFrame>>,
  sourceAnchor: PointM,
  ring: RingM,
  polygon: PolygonM,
  longestDimensionM: number,
): NonNullable<ReturnType<typeof shorelineFrame>>[] {
  const maxShiftM = Math.max(70, Math.min(420, longestDimensionM * 0.025));
  const recoveredFrames: NonNullable<ReturnType<typeof shorelineFrame>>[] = [];
  for (const point of shorelineWindowPoints(ring, baseFrame.bestIndex, baseFrame.anchor, maxShiftM)) {
    if (distanceM(point, baseFrame.anchor) < 1 || distanceM(point, sourceAnchor) > maxShiftM * 1.25) continue;
    const frame = shorelineFrame(point, ring, polygon, longestDimensionM);
    if (!frame) continue;
    if (distanceM(baseFrame.anchor, frame.anchor) < 1) continue;
    if (recoveredFrames.some((existing) => distanceM(existing.anchor, frame.anchor) < 1)) continue;
    recoveredFrames.push({ ...frame, recovered: true, searchMeters: maxShiftM });
  }
  return [baseFrame, ...diverseShorelineFrames(baseFrame, recoveredFrames, MAX_SHORELINE_FRAME_VARIANTS - 1)];
}

function diverseShorelineFrames(
  baseFrame: NonNullable<ReturnType<typeof shorelineFrame>>,
  recoveredFrames: NonNullable<ReturnType<typeof shorelineFrame>>[],
  limit: number,
): NonNullable<ReturnType<typeof shorelineFrame>>[] {
  if (limit <= 0 || recoveredFrames.length === 0) return [];
  const tangent = { x: Math.cos(baseFrame.rotationRad), y: Math.sin(baseFrame.rotationRad) };
  const enriched = recoveredFrames.map((frame) => ({
    frame,
    signedDistance: dot({ x: frame.anchor.x - baseFrame.anchor.x, y: frame.anchor.y - baseFrame.anchor.y }, tangent),
    distance: distanceM(frame.anchor, baseFrame.anchor),
  }));
  const forward = enriched.filter((item) => item.signedDistance >= 0).sort((a, b) => a.distance - b.distance);
  const backward = enriched.filter((item) => item.signedDistance < 0).sort((a, b) => a.distance - b.distance);
  const selected: NonNullable<ReturnType<typeof shorelineFrame>>[] = [];
  for (const item of [forward[0], backward[0], forward[forward.length - 1], backward[backward.length - 1]]) {
    if (!item) continue;
    if (selected.some((existing) => distanceM(existing.anchor, item.frame.anchor) < 1)) continue;
    selected.push(item.frame);
    if (selected.length >= limit) break;
  }
  if (selected.length < limit) {
    for (const item of enriched.sort((a, b) => a.distance - b.distance)) {
      if (selected.some((existing) => distanceM(existing.anchor, item.frame.anchor) < 1)) continue;
      selected.push(item.frame);
      if (selected.length >= limit) break;
    }
  }
  return selected;
}

function shorelineWindowPoints(ring: RingM, segmentIndex: number, anchor: PointM, searchMeters: number): PointM[] {
  const distances = [0.25, 0.5, 0.75, 1].map((fraction) => searchMeters * fraction);
  return distances.flatMap((distance) => [
    pointAlongRing(anchor, ring, segmentIndex, distance, 1),
    pointAlongRing(anchor, ring, segmentIndex, distance, -1),
  ]).filter((point): point is PointM => point !== null);
}

function pointAlongRing(
  start: PointM,
  ring: RingM,
  segmentIndex: number,
  targetDistanceM: number,
  direction: 1 | -1,
): PointM | null {
  const n = ring.length;
  if (n < 2 || targetDistanceM <= 0) return null;
  let remaining = targetDistanceM;
  let current = start;
  let index = segmentIndex;
  for (let step = 0; step < n + 2; step++) {
    const nextIndex = direction === 1 ? index + 1 : index;
    const next = ring[((nextIndex % n) + n) % n];
    if (!next) return null;
    const segmentLength = distanceM(current, next);
    if (segmentLength >= remaining && segmentLength > 0) {
      return lerpPoint(current, next, remaining / segmentLength);
    }
    remaining -= segmentLength;
    current = next;
    index += direction;
  }
  return null;
}

function inwardNormalOptions(params: {
  anchor: PointM;
  preferredDirection?: PointM;
  fallbackNormal: PointM;
  polygon: PolygonM;
  longestDimensionM: number;
  strictInwardNormal?: boolean;
}): PointM[] {
  const options: PointM[] = [];
  const preferred = params.preferredDirection ? normalize(params.preferredDirection) : null;
  const probe = Math.max(2, Math.min(35, params.longestDimensionM * 0.003));
  const tolerance = Math.max(2, params.longestDimensionM * 0.0015);
  if (preferred) addNormalOption(options, preferred);
  addNormalOption(options, params.fallbackNormal);
  addNormalOption(options, { x: -params.fallbackNormal.x, y: -params.fallbackNormal.y });

  const waterFirst = options.filter((normal) =>
    pointInWaterOrBoundary(
      { x: params.anchor.x + normal.x * probe, y: params.anchor.y + normal.y * probe },
      params.polygon,
      tolerance,
    ),
  );
  if (params.strictInwardNormal === true && waterFirst.length > 0) return [waterFirst[0]!];
  return waterFirst.length > 0 ? waterFirst : options;
}

function zoneRotationOptions(
  baseRotationRad: number,
  waterDirection: PointM | undefined,
  expanded: boolean,
  preferredRotationRad?: number,
  preferredRotationOnly?: boolean,
): number[] {
  const options: number[] = [];
  if (preferredRotationOnly === true && typeof preferredRotationRad === 'number' && Number.isFinite(preferredRotationRad)) {
    addRotationOption(options, preferredRotationRad);
    if (expanded) addRotationOption(options, preferredRotationRad + Math.PI / 2);
    return options;
  }
  addRotationOption(options, baseRotationRad);
  if (typeof preferredRotationRad === 'number' && Number.isFinite(preferredRotationRad)) {
    addRotationOption(options, preferredRotationRad);
  }
  if (expanded) {
    addRotationOption(options, baseRotationRad + Math.PI / 2);
    if (typeof preferredRotationRad === 'number' && Number.isFinite(preferredRotationRad)) {
      addRotationOption(options, preferredRotationRad + Math.PI / 2);
    }
  }
  return options;
}

function addRotationOption(options: number[], rotationRad: number): void {
  const normalized = normalizeAngle(rotationRad);
  if (options.some((existing) => Math.abs(Math.cos(existing - normalized)) > 0.999)) return;
  options.push(normalized);
}

function normalizeAngle(rotationRad: number): number {
  let out = rotationRad;
  while (out <= -Math.PI) out += Math.PI * 2;
  while (out > Math.PI) out -= Math.PI * 2;
  return out;
}

function addNormalOption(options: PointM[], normal: PointM): void {
  const n = normalize(normal);
  if (!n) return;
  if (options.some((existing) => Math.abs(dot(existing, n)) > 0.999)) return;
  options.push(n);
}

function dot(a: PointM, b: PointM): number {
  return a.x * b.x + a.y * b.y;
}

function groupDrafts(drafts: WaterReaderZoneDraft[]) {
  const map = new Map<string, WaterReaderZoneDraft[]>();
  for (const draft of drafts) {
    const existing = map.get(draft.unitId) ?? [];
    existing.push(draft);
    map.set(draft.unitId, existing);
  }
  return [...map.entries()].map(([unitId, groupDrafts]) => ({ unitId, drafts: groupDrafts }));
}

function groupCandidateDrafts(drafts: WaterReaderZoneDraft[]) {
  const map = new Map<string, WaterReaderZoneDraft[]>();
  for (const draft of drafts) {
    const key = draft.candidateKey ?? `${draft.unitId}:${draft.placementKind}:${draft.sourceFeatureId}`;
    const existing = map.get(key) ?? [];
    existing.push(draft);
    map.set(key, existing);
  }
  return [...map.entries()]
    .map(([candidateKey, candidateDrafts]) => ({ candidateKey, drafts: candidateDrafts }))
    .sort((a, b) => a.candidateKey.localeCompare(b.candidateKey));
}

function uniquePlacementKinds(drafts: WaterReaderZoneDraft[]): WaterReaderZonePlacementKind[] {
  return [...new Set(drafts.map((draft) => draft.placementKind))].sort((a, b) => a.localeCompare(b));
}

function validCandidateLimit(drafts: WaterReaderZoneDraft[]): number {
  const first = drafts[0];
  if (!first) return MAX_CANDIDATES_PER_PLACEMENT;
  if (first.featureClass === 'neck' || first.featureClass === 'saddle' || first.featureClass === 'dam') {
    return MAX_VALID_CANDIDATES_PER_CONSTRICTION_PLACEMENT;
  }
  return MAX_CANDIDATES_PER_PLACEMENT;
}

function prioritizeDraftsForMaterialization(drafts: WaterReaderZoneDraft[]): WaterReaderZoneDraft[] {
  return [...drafts].sort((a, b) => {
    const aTip = draftTipPreference(a);
    const bTip = draftTipPreference(b);
    if (aTip !== bTip) return aTip - bTip;

    const aAnchor = numberDiagnostic(a.diagnostics.selectedAnchorIndex);
    const bAnchor = numberDiagnostic(b.diagnostics.selectedAnchorIndex);
    if (aAnchor !== bAnchor) return aAnchor - bAnchor;

    const aOffset = offsetMaterializationScore(a);
    const bOffset = offsetMaterializationScore(b);
    if (Math.abs(aOffset - bOffset) > 0.0001) return aOffset - bOffset;

    const aSize = numberDiagnostic(a.diagnostics.selectedSizeFactor);
    const bSize = numberDiagnostic(b.diagnostics.selectedSizeFactor);
    if (Math.abs(aSize - bSize) > 0.0001) return bSize - aSize;

    const aRotation = numberDiagnostic(a.diagnostics.selectedRotationIndex);
    const bRotation = numberDiagnostic(b.diagnostics.selectedRotationIndex);
    if (aRotation !== bRotation) return aRotation - bRotation;

    const aNormal = numberDiagnostic(a.diagnostics.selectedNormalIndex);
    const bNormal = numberDiagnostic(b.diagnostics.selectedNormalIndex);
    return aNormal - bNormal;
  });
}

function draftTipPreference(draft: WaterReaderZoneDraft): number {
  if (draft.placementKind !== 'main_point_tip') return 0;
  const mode = draft.diagnostics.pointTipPlacementMode;
  if (mode === 'tip_centered') return 0;
  if (mode === 'tip_near') return 1;
  return 2;
}

function offsetMaterializationScore(draft: WaterReaderZoneDraft): number {
  const raw = draft.diagnostics.selectedOffsetFactor ?? draft.diagnostics.shorelineOffsetFactor;
  if (typeof raw !== 'number' || !Number.isFinite(raw)) return 0;
  const target = draft.featureClass === 'neck' || draft.featureClass === 'saddle' || draft.featureClass === 'dam'
    ? 0.12
    : draft.featureClass === 'cove' && draft.placementKind === 'cove_back'
      ? 0.12
      : 0.04;
  return Math.abs(raw - target);
}

function validZoneCandidates(params: {
  drafts: WaterReaderZoneDraft[];
  polygon: PolygonM;
  longestDimensionM: number;
}): {
  candidates: Array<Omit<WaterReaderPlacedZone, 'zoneId'>>;
  primaryReason: string;
  rejectedCandidateReasons: Record<string, number>;
  materializedCandidateCount: number;
  validCandidateCount: number;
} {
  const rejectedCandidateReasons: Record<string, number> = {};
  const candidates: Array<{ zone: Omit<WaterReaderPlacedZone, 'zoneId'>; draft: WaterReaderZoneDraft }> = [];
  const draftLimit = validCandidateLimit(params.drafts);
  let materializedCandidateCount = 0;
  for (const draft of prioritizeDraftsForMaterialization(params.drafts)) {
    materializedCandidateCount++;
    const result = materializeZoneDraft({
      draft,
      polygon: params.polygon,
      longestDimensionM: params.longestDimensionM,
    });
    if (result.ok) {
      candidates.push({ zone: result.zone, draft });
    } else {
      increment(rejectedCandidateReasons, result.reason);
    }
    if (candidates.length >= draftLimit) break;
  }
  if (candidates.length === 0) {
    return {
      candidates: [],
      primaryReason: primaryRejectedReason(rejectedCandidateReasons),
      rejectedCandidateReasons,
      materializedCandidateCount,
      validCandidateCount: 0,
    };
  }
  return {
    candidates: candidates
      .sort(compareZoneCandidates)
      .slice(0, draftLimit)
      .map((candidate) => withCandidateDiagnostics(candidate, params.drafts.length, rejectedCandidateReasons)),
    primaryReason: '',
    rejectedCandidateReasons,
    materializedCandidateCount,
    validCandidateCount: candidates.length,
  };
}

function chooseBestUnitCombination(params: {
  candidatesByPlacement: Array<Array<Omit<WaterReaderPlacedZone, 'zoneId'>>>;
  selected: WaterReaderPlacedZone[];
  longestDimensionM: number;
}): { zones: Array<Omit<WaterReaderPlacedZone, 'zoneId'>> | null; reason: string; attemptCount: number } {
  let best: Array<Omit<WaterReaderPlacedZone, 'zoneId'>> | null = null;
  const rejected: Record<string, number> = {};
  let attemptCount = 0;

  function visit(index: number, current: Array<Omit<WaterReaderPlacedZone, 'zoneId'>>): void {
    if (index >= params.candidatesByPlacement.length) {
      attemptCount++;
      const reason = unitCombinationRejectReason(current, params.selected, params.longestDimensionM);
      if (reason) {
        increment(rejected, reason);
        return;
      }
      if (!best || compareZoneCombinations(current, best) < 0) best = [...current];
      return;
    }
    for (const candidate of params.candidatesByPlacement[index] ?? []) {
      const next = [...current, candidate];
      visit(index + 1, next);
    }
  }

  visit(0, []);
  return best
    ? { zones: best, reason: '', attemptCount }
    : { zones: null, reason: primaryRejectedReason(rejected) || 'internal_overlap', attemptCount };
}

function chooseBestSingleZoneFallback(params: {
  candidatesByPlacement: Array<Array<Omit<WaterReaderPlacedZone, 'zoneId'>>>;
  selected: WaterReaderPlacedZone[];
  longestDimensionM: number;
}): { zone: Omit<WaterReaderPlacedZone, 'zoneId'> | null; reason: string; attemptCount: number } {
  let best: Omit<WaterReaderPlacedZone, 'zoneId'> | null = null;
  const rejected: Record<string, number> = {};
  let attemptCount = 0;
  for (const candidate of params.candidatesByPlacement.flat()) {
    attemptCount++;
    const reason = unitCombinationRejectReason([candidate], params.selected, params.longestDimensionM);
    if (reason) {
      increment(rejected, reason);
      continue;
    }
    if (!best || compareSingleZoneFallback(candidate, best) < 0) {
      best = candidate;
    }
  }
  return best
    ? { zone: best, reason: '', attemptCount }
    : { zone: null, reason: primaryRejectedReason(rejected) || 'feature_unit_not_selected', attemptCount };
}

function annotatePointFallbackIfNeeded(
  zone: Omit<WaterReaderPlacedZone, 'zoneId'>,
  unitDrafts: WaterReaderZoneDraft[],
  candidatesByPlacement: Array<Array<Omit<WaterReaderPlacedZone, 'zoneId'>>>,
  fallbackReason: string,
  unitHasTipZone: boolean,
): Omit<WaterReaderPlacedZone, 'zoneId'> {
  if (zone.featureClass !== 'main_lake_point' || zone.placementKind === 'main_point_tip') return zone;
  if (unitHasTipZone) return zone;
  if (!unitDrafts.some((draft) => draft.placementKind === 'main_point_tip')) return zone;
  const tipValidCandidateCount = candidatesByPlacement
    .flat()
    .filter((candidate) => candidate.placementKind === 'main_point_tip').length;
  const suppressedBy = tipValidCandidateCount === 0
    ? 'no_valid_tip_candidate'
    : fallbackReason === 'internal_overlap' ||
        fallbackReason === 'overlap_higher_priority_zone' ||
        fallbackReason === 'zone_cap'
      ? fallbackReason
      : fallbackReason
        ? 'other'
        : 'other';
  return {
    ...zone,
    diagnostics: {
      ...zone.diagnostics,
      pointTipRejectedReason: fallbackReason || (tipValidCandidateCount > 0 ? 'tip_not_selected_in_best_valid_set' : 'no_valid_tip_candidate'),
      pointTipValidCandidateCount: tipValidCandidateCount,
      pointTipSuppressedBy: suppressedBy,
    },
    qaFlags: tipValidCandidateCount === 0
      ? [...new Set([...zone.qaFlags, 'point_tip_rejected_no_valid_candidate'])]
      : zone.qaFlags,
  };
}

function compareSingleZoneFallback(a: Omit<WaterReaderPlacedZone, 'zoneId'>, b: Omit<WaterReaderPlacedZone, 'zoneId'>): number {
  const aRank = summerPointFallbackRank(a);
  const bRank = summerPointFallbackRank(b);
  if (aRank !== bRank) return aRank - bRank;
  const aVisibleScore = Math.abs(a.visibleWaterFraction - TARGET_VISIBLE_WATER_FRACTION);
  const bVisibleScore = Math.abs(b.visibleWaterFraction - TARGET_VISIBLE_WATER_FRACTION);
  if (Math.abs(aVisibleScore - bVisibleScore) > 0.025) return aVisibleScore - bVisibleScore;
  return b.majorAxisM - a.majorAxisM;
}

function summerPointFallbackRank(zone: Omit<WaterReaderPlacedZone, 'zoneId'>): number {
  if (zone.featureClass !== 'main_lake_point') return 0;
  if (zone.placementKind === 'main_point_open_water' && zone.anchorSemanticId === 'main_point_open_water_area') return 0;
  if (zone.placementKind === 'main_point_open_water') return 1;
  if (zone.placementKind === 'main_point_tip' && pointTipFallbackIsAttached(zone)) return 2;
  if (zone.placementKind === 'main_point_tip') return 5;
  return 3;
}

function pointTipFallbackIsAttached(zone: Omit<WaterReaderPlacedZone, 'zoneId'>): boolean {
  const distanceFromTipM = numberDiagnostic(zone.diagnostics.distanceFromTipM);
  const majorAxisM = Math.max(zone.majorAxisM, 1);
  const outside = outsidePreferenceScore(zone);
  return distanceFromTipM <= majorAxisM * 0.35 && outside >= 0.08;
}

function unitCombinationRejectReason(
  zones: Array<Omit<WaterReaderPlacedZone, 'zoneId'>>,
  selected: WaterReaderPlacedZone[],
  longestDimensionM: number,
): string | null {
  void zones;
  void selected;
  void longestDimensionM;
  return null;
}

function internalOverlapRejectReason(zones: Array<Omit<WaterReaderPlacedZone, 'zoneId'> | WaterReaderPlacedZone>): string | null {
  void zones;
  return null;
}

function violatesSameShoreClusterCrowding(
  candidateZones: Array<Omit<WaterReaderPlacedZone, 'zoneId'>>,
  selected: WaterReaderPlacedZone[],
  longestDimensionM: number,
): boolean {
  const all = [...selected, ...candidateZones].filter((zone) => !isConstrictionZone(zone));
  if (all.length < 3) return false;
  const radius = longestDimensionM * 0.12;
  const chainSpan = radius * 1.55;
  for (let i = 0; i < all.length; i++) {
    for (let j = i + 1; j < all.length; j++) {
      for (let k = j + 1; k < all.length; k++) {
        const trio = [all[i]!, all[j]!, all[k]!];
        if (!trio.some((zone) => candidateZones.includes(zone))) continue;
        const distances = [
          distanceM(trio[0].ovalCenter, trio[1].ovalCenter),
          distanceM(trio[0].ovalCenter, trio[2].ovalCenter),
          distanceM(trio[1].ovalCenter, trio[2].ovalCenter),
        ];
        if (Math.max(...distances) <= chainSpan && distances.filter((distance) => distance <= radius).length >= 2) {
          return true;
        }
      }
    }
  }
  return false;
}

function isConstrictionZone(zone: Omit<WaterReaderPlacedZone, 'zoneId'> | WaterReaderPlacedZone): boolean {
  return zone.featureClass === 'neck' || zone.featureClass === 'saddle' || zone.featureClass === 'dam';
}

function compareZoneCombinations(
  a: Array<Omit<WaterReaderPlacedZone, 'zoneId'>>,
  b: Array<Omit<WaterReaderPlacedZone, 'zoneId'>>,
): number {
  const aPair = pairOverlapPreference(a);
  const bPair = pairOverlapPreference(b);
  if (aPair !== bPair) return aPair - bPair;

  const aVisible = average(a.map((zone) => Math.abs(zone.visibleWaterFraction - TARGET_VISIBLE_WATER_FRACTION)));
  const bVisible = average(b.map((zone) => Math.abs(zone.visibleWaterFraction - TARGET_VISIBLE_WATER_FRACTION)));
  if (Math.abs(aVisible - bVisible) > 0.015) return aVisible - bVisible;
  const aOutside = average(a.map(outsidePreferenceScore));
  const bOutside = average(b.map(outsidePreferenceScore));
  if (Math.abs(aOutside - bOutside) > 0.025) return bOutside - aOutside;
  const aSize = average(a.map((zone) => zone.majorAxisM));
  const bSize = average(b.map((zone) => zone.majorAxisM));
  return bSize - aSize;
}

function pairOverlapPreference(zones: Array<Omit<WaterReaderPlacedZone, 'zoneId'>>): number {
  if (!isPairedStructuralCombination(zones)) return 0;
  const severity = pairOverlapSeverity(zones[0]!, zones[1]!);
  switch (severity.classification) {
    case 'none_or_trace_pair_overlap':
      return 0;
    case 'allowed_light_pair_overlap':
      return 1;
    case 'allowed_moderate_pair_overlap':
      return 2;
    case 'strong_pair_overlap':
      return 3;
  }
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function clampM(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(value, max));
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(value, max));
}

function norm(value: number, low: number, high: number): number {
  if (!Number.isFinite(value) || high <= low) return 0;
  return clamp((value - low) / (high - low), 0, 1);
}

function finiteNumber(value: number | undefined, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function roundDiagnosticNumber(value: number): number {
  return Number.isFinite(value) ? Number(value.toFixed(2)) : 0;
}

function clampReason(value: number, min: number, max: number): string {
  if (!Number.isFinite(value)) return 'invalid_min_clamp';
  if (value < min) return 'min_clamp';
  if (value > max) return 'max_clamp';
  return 'natural';
}

function constrictionClampReason(
  naturalMajorAxisM: number,
  minClampM: number,
  lakeMaxM: number,
  widthMaxM: number,
  maxClampM: number,
): string {
  if (naturalMajorAxisM < minClampM) return 'min_clamp';
  if (naturalMajorAxisM <= maxClampM) return 'natural';
  return widthMaxM <= lakeMaxM ? 'max_width_cap' : 'max_lake_cap';
}

function lakeSizeBandForAcreage(acreage?: number | null): LakeSizeBand {
  if (typeof acreage !== 'number' || !Number.isFinite(acreage) || acreage <= 0) return 'unknown';
  if (acreage < 100) return 'small';
  if (acreage <= 1000) return 'medium';
  return 'large';
}

function readableFloorMajorAxisM(
  placementKind: WaterReaderZonePlacementKind,
  longestDimensionM: number,
  acreage?: number | null,
): number {
  const band = lakeSizeBandForAcreage(acreage);
  const L = Math.max(1, longestDimensionM);
  const resolvedBand = band === 'unknown' ? 'large' : band;
  const table: Record<string, Record<Exclude<LakeSizeBand, 'unknown'>, { absoluteM: number; pct: number }>> = {
    dam_corner: {
      small: { absoluteM: 70, pct: 0.0575 },
      medium: { absoluteM: 125, pct: 0.0525 },
      large: { absoluteM: 340, pct: 0.0375 },
    },
    dam_structure_area: {
      small: { absoluteM: 70, pct: 0.0575 },
      medium: { absoluteM: 125, pct: 0.0525 },
      large: { absoluteM: 340, pct: 0.0375 },
    },
    neck_shoulder: {
      small: { absoluteM: 70, pct: 0.0575 },
      medium: { absoluteM: 125, pct: 0.0525 },
      large: { absoluteM: 340, pct: 0.0375 },
    },
    neck_structure_area: {
      small: { absoluteM: 70, pct: 0.0575 },
      medium: { absoluteM: 125, pct: 0.0525 },
      large: { absoluteM: 340, pct: 0.0375 },
    },
    saddle_shoulder: {
      small: { absoluteM: 65, pct: 0.0525 },
      medium: { absoluteM: 115, pct: 0.0475 },
      large: { absoluteM: 310, pct: 0.0335 },
    },
    saddle_structure_area: {
      small: { absoluteM: 65, pct: 0.0525 },
      medium: { absoluteM: 115, pct: 0.0475 },
      large: { absoluteM: 310, pct: 0.0335 },
    },
    main_point_side: {
      small: { absoluteM: 80, pct: 0.065 },
      medium: { absoluteM: 140, pct: 0.0575 },
      large: { absoluteM: 390, pct: 0.04 },
    },
    main_point_structure_area: {
      small: { absoluteM: 80, pct: 0.065 },
      medium: { absoluteM: 140, pct: 0.0575 },
      large: { absoluteM: 390, pct: 0.04 },
    },
    main_point_open_water: {
      small: { absoluteM: 80, pct: 0.065 },
      medium: { absoluteM: 140, pct: 0.0575 },
      large: { absoluteM: 390, pct: 0.04 },
    },
    main_point_tip: {
      small: { absoluteM: 70, pct: 0.055 },
      medium: { absoluteM: 120, pct: 0.05 },
      large: { absoluteM: 340, pct: 0.035 },
    },
    cove_back: {
      small: { absoluteM: 75, pct: 0.06 },
      medium: { absoluteM: 135, pct: 0.055 },
      large: { absoluteM: 370, pct: 0.04 },
    },
    cove_structure_area: {
      small: { absoluteM: 75, pct: 0.06 },
      medium: { absoluteM: 135, pct: 0.055 },
      large: { absoluteM: 370, pct: 0.04 },
    },
    cove_mouth: {
      small: { absoluteM: 75, pct: 0.06 },
      medium: { absoluteM: 135, pct: 0.055 },
      large: { absoluteM: 370, pct: 0.04 },
    },
    cove_irregular_side: {
      small: { absoluteM: 75, pct: 0.06 },
      medium: { absoluteM: 135, pct: 0.055 },
      large: { absoluteM: 370, pct: 0.04 },
    },
    island_mainland: {
      small: { absoluteM: 75, pct: 0.06 },
      medium: { absoluteM: 140, pct: 0.0525 },
      large: { absoluteM: 380, pct: 0.0375 },
    },
    island_structure_area: {
      small: { absoluteM: 75, pct: 0.06 },
      medium: { absoluteM: 140, pct: 0.0525 },
      large: { absoluteM: 380, pct: 0.0375 },
    },
    island_open_water: {
      small: { absoluteM: 75, pct: 0.06 },
      medium: { absoluteM: 140, pct: 0.0525 },
      large: { absoluteM: 380, pct: 0.0375 },
    },
    island_endpoint: {
      small: { absoluteM: 75, pct: 0.06 },
      medium: { absoluteM: 140, pct: 0.0525 },
      large: { absoluteM: 380, pct: 0.0375 },
    },
    secondary_point_back: {
      small: { absoluteM: 65, pct: 0.0525 },
      medium: { absoluteM: 110, pct: 0.0475 },
      large: { absoluteM: 310, pct: 0.0325 },
    },
    secondary_point_structure_area: {
      small: { absoluteM: 65, pct: 0.0525 },
      medium: { absoluteM: 110, pct: 0.0475 },
      large: { absoluteM: 310, pct: 0.0325 },
    },
    secondary_point_mouth: {
      small: { absoluteM: 65, pct: 0.0525 },
      medium: { absoluteM: 110, pct: 0.0475 },
      large: { absoluteM: 310, pct: 0.0325 },
    },
  };
  const row = table[placementKind] ?? table.main_point_side;
  const floor = row[resolvedBand];
  return Math.max(floor.absoluteM, L * floor.pct);
}

function featureProminenceDiagnostics(params: {
  feature: WaterReaderDetectedFeature;
  placementKind: WaterReaderZonePlacementKind;
  longestDimensionM: number;
  averageLakeWidthM?: number;
  lakeAreaSqM?: number;
  acreage?: number | null;
  readableFloorApplied: boolean;
}): { featureProminenceScore: number; featureProminenceSource: string; featureProminenceFallbackUsed: boolean } {
  const L = Math.max(1, params.longestDimensionM);
  const avgW = Math.max(1, params.averageLakeWidthM ?? 0);
  const lakeArea = Math.max(1, params.lakeAreaSqM ?? 0);
  const confidence = 'confidence' in params.feature ? finiteNumber(params.feature.confidence, 0.5) : 0.5;
  let score: number | null = null;
  let source = `${params.feature.featureClass}_formula`;
  switch (params.feature.featureClass) {
    case 'dam':
      score = 100 * (
        0.45 * norm(params.feature.segmentLengthM / L, 0.03, 0.12) +
        0.35 * confidence +
        0.20 * norm(params.feature.rSquared, 0, 1)
      );
      break;
    case 'neck': {
      const avgExpansionRatio = average([params.feature.leftExpansionRatio, params.feature.rightExpansionRatio]);
      score = 100 * (
        0.40 * norm(1 - params.feature.widthM / avgW, 0.50, 0.90) +
        0.30 * norm(avgExpansionRatio, 1.5, 4.0) +
        0.30 * confidence
      );
      break;
    }
    case 'saddle': {
      const avgExpansionRatio = average([params.feature.leftExpansionRatio, params.feature.rightExpansionRatio]);
      score = 100 * (
        0.35 * norm(1 - params.feature.widthM / avgW, 0.25, 0.70) +
        0.35 * norm(avgExpansionRatio, 1.3, 3.5) +
        0.30 * confidence
      );
      break;
    }
    case 'main_lake_point':
    case 'secondary_point': {
      const adaptivePointThresholdPct = params.acreage && params.acreage < 100 ? 0.03 : params.acreage && params.acreage <= 1000 ? 0.04 : 0.05;
      const left = distanceM(params.feature.tip, params.feature.leftSlope);
      const right = distanceM(params.feature.tip, params.feature.rightSlope);
      const sideSlopeSymmetry = Math.min(left, right) / Math.max(left, right, 1);
      score = 100 * (
        0.45 * norm(params.feature.protrusionLengthM / L, adaptivePointThresholdPct, 0.12) +
        0.25 * confidence +
        0.20 * norm(params.feature.turnAngleRad, 1.05, 2.8) +
        0.10 * sideSlopeSymmetry
      );
      if (params.feature.featureClass === 'secondary_point') score *= 0.85;
      break;
    }
    case 'cove': {
      const avgIrregularity = average([params.feature.leftIrregularity, params.feature.rightIrregularity]);
      score = 100 * (
        0.35 * norm(params.feature.coveAreaSqM / lakeArea, 0.0005, 0.015) +
        0.25 * norm(params.feature.depthRatio, 2, 5) +
        0.20 * norm(params.feature.pathRatio, 2.5, 7) +
        0.20 * norm(avgIrregularity, 0.2, 1.5)
      );
      break;
    }
    case 'island':
      score = 100 * (
        0.45 * norm(params.feature.areaSqM / lakeArea, 0.00005, 0.004) +
        0.25 * norm(Math.sqrt(Math.max(1, params.feature.areaSqM)) / L, 0.003, 0.03) +
        0.20 * norm(params.feature.nearestMainlandDistanceM / avgW, 0.05, 0.5) +
        0.10 * (params.readableFloorApplied ? 1 : 0)
      );
      break;
    case 'universal':
      score = null;
      source = 'feature_score_fallback';
      break;
  }
  const fallbackUsed = score === null || !Number.isFinite(score);
  const finalScore = fallbackUsed ? finiteNumber(params.feature.score, 0) : score ?? 0;
  return {
    featureProminenceScore: roundDiagnosticNumber(clamp(finalScore, 0, 100)),
    featureProminenceSource: fallbackUsed ? 'feature_score_fallback' : source,
    featureProminenceFallbackUsed: fallbackUsed,
  };
}

function sizingDiagnosticsForDraft(
  sizing: DraftSizingMetadata | undefined,
  draft: { majorAxisM: number; minorAxisM: number; defaultMinorAxisM: number; sizeFactor: number },
): Record<string, number | string | boolean | null> {
  if (!sizing) return {};
  const minorCap = sizing.constrictionMinorAxisWidthCapM ?? null;
  const width = sizing.constrictionWidthM ?? null;
  const protrusion = sizing.pointProtrusionLengthM ?? null;
  const sideSlope = sizing.pointSideSlopeLengthM ?? null;
  return {
    naturalMajorAxisM: sizing.naturalMajorAxisM,
    readableFloorMajorAxisM: sizing.readableFloorMajorAxisM ?? sizing.minClampM,
    readableFloorApplied: sizing.readableFloorApplied ?? false,
    majorAxisClampReason: sizing.clampReason,
    sizeNaturalMajorAxisM: sizing.naturalMajorAxisM,
    sizeBaseMajorAxisM: sizing.baseMajorAxisM,
    sizeFinalMajorAxisM: draft.majorAxisM,
    sizeDefaultMinorAxisM: draft.defaultMinorAxisM,
    sizeFinalMinorAxisM: draft.minorAxisM,
    sizeMinClampM: sizing.minClampM,
    sizeMaxClampM: sizing.maxClampM,
    sizeClampReason: sizing.clampReason,
    pointZoneLakeSizeBand: sizing.lakeSizeBand ?? null,
    majorAxisToPointProtrusionRatio: protrusion && protrusion > 0 ? draft.majorAxisM / protrusion : null,
    majorAxisToPointSideSlopeRatio: sideSlope && sideSlope > 0 ? draft.majorAxisM / sideSlope : null,
    majorAxisToFeatureWidthRatio: width && width > 0 ? draft.majorAxisM / width : null,
    minorAxisToFeatureWidthRatio: width && width > 0 ? draft.minorAxisM / width : null,
    constrictionMinorAxisWidthCapM: minorCap,
    constrictionMinorAxisWidthCapApplied: minorCap !== null && draft.defaultMinorAxisM > minorCap + 0.001,
    constrictionPreferredMinorAxisM: sizing.constrictionPreferredMinorAxisM ?? null,
    constrictionFallbackMinorAxisM: sizing.constrictionFallbackMinorAxisM ?? null,
    islandReadableFloorM: sizing.islandReadableFloorM ?? null,
    islandNaturalScaleM: sizing.islandNaturalScaleM ?? null,
    islandReadableFloorApplied: sizing.islandReadableFloorApplied ?? null,
    islandLocalScaleMeters: sizing.islandLocalScaleMeters ?? null,
    islandSizeCapApplied: sizing.islandSizeCapApplied ?? null,
    islandSizeCapReason: sizing.islandSizeCapReason ?? null,
    islandSizeCapM: sizing.islandSizeCapM ?? null,
    islandZoneRepresentsWholeIsland: sizing.islandZoneRepresentsWholeIsland ?? null,
    zoneSizeRecoveryFactorApplied: draft.sizeFactor < 0.999,
  };
}

function sizingQaFlagsForDraft(
  feature: WaterReaderDetectedFeature,
  placementKind: WaterReaderZonePlacementKind,
  sizing: DraftSizingMetadata | undefined,
  draft: { majorAxisM: number; minorAxisM: number; defaultMinorAxisM: number; sizeFactor: number },
): string[] {
  if (!sizing) return draft.sizeFactor < 0.999 ? ['zone_size_recovery_factor_applied'] : [];
  const flags: string[] = [];
  if (
    feature.featureClass === 'main_lake_point' &&
    (placementKind === 'main_point_side' || placementKind === 'main_point_open_water') &&
    sizing.lakeSizeBand === 'large' &&
    Math.abs(draft.majorAxisM - sizing.minClampM) <= Math.max(1, sizing.minClampM * 0.015)
  ) {
    flags.push('point_zone_near_large_lake_minimum');
  }
  if ((feature.featureClass === 'neck' || feature.featureClass === 'saddle') && sizing.clampReason === 'max_width_cap') {
    flags.push('constriction_major_axis_width_capped');
  }
  if ((feature.featureClass === 'neck' || feature.featureClass === 'saddle') && draft.defaultMinorAxisM > draft.minorAxisM + 0.001) {
    flags.push('constriction_minor_axis_width_capped');
  }
  if (
    (feature.featureClass === 'neck' || feature.featureClass === 'saddle') &&
    typeof sizing.constrictionWidthM === 'number' &&
    sizing.constrictionWidthM > 0 &&
    draft.majorAxisM / sizing.constrictionWidthM > (feature.featureClass === 'neck' ? 4.4 : 3.7)
  ) {
    flags.push('constriction_zone_large_for_connector_review');
  }
  if (feature.featureClass === 'island' && sizing.islandReadableFloorApplied === true) {
    flags.push('island_readable_floor_applied');
  }
  if (draft.sizeFactor < 0.999) flags.push('zone_size_recovery_factor_applied');
  return [...new Set(flags)];
}

function chooseBestZoneCandidate(params: {
  drafts: WaterReaderZoneDraft[];
  polygon: PolygonM;
  longestDimensionM: number;
}): { zone: Omit<WaterReaderPlacedZone, 'zoneId'> | null; primaryReason: string } {
  const rejectedCandidateReasons: Record<string, number> = {};
  let best: { zone: Omit<WaterReaderPlacedZone, 'zoneId'>; draft: WaterReaderZoneDraft } | null = null;
  for (const draft of params.drafts) {
    const result = materializeZoneDraft({
      draft,
      polygon: params.polygon,
      longestDimensionM: params.longestDimensionM,
    });
    if (result.ok) {
      const candidate = { zone: result.zone, draft };
      if (!best || compareZoneCandidates(candidate, best) < 0) best = candidate;
      if (!isCoveBackCandidate(candidate) && isExcellentCandidate(candidate.zone)) {
        return {
          zone: withCandidateDiagnostics(candidate, params.drafts.length, rejectedCandidateReasons),
          primaryReason: '',
        };
      }
    } else {
      increment(rejectedCandidateReasons, result.reason);
    }
  }
  if (!best) return { zone: null, primaryReason: primaryRejectedReason(rejectedCandidateReasons) };

  return {
    zone: withCandidateDiagnostics(best, params.drafts.length, rejectedCandidateReasons),
    primaryReason: '',
  };
}

function withCandidateDiagnostics(
  chosen: { zone: Omit<WaterReaderPlacedZone, 'zoneId'>; draft: WaterReaderZoneDraft },
  candidateCount: number,
  rejectedCandidateReasons: Record<string, number>,
): Omit<WaterReaderPlacedZone, 'zoneId'> {
  const primaryReason = primaryRejectedReason(rejectedCandidateReasons);
  return {
    ...chosen.zone,
    placementSemanticId: chosen.draft.placementSemanticId,
    anchorSemanticId: chosen.draft.anchorSemanticId,
    diagnostics: {
      ...chosen.zone.diagnostics,
      candidateCount,
      selectedOffsetFactor: chosen.draft.diagnostics.selectedOffsetFactor ?? chosen.draft.diagnostics.shorelineOffsetFactor ?? null,
      selectedSizeFactor: chosen.draft.diagnostics.selectedSizeFactor ?? null,
      selectedAnchorIndex: chosen.draft.diagnostics.selectedAnchorIndex ?? null,
      selectedNormalIndex: chosen.draft.diagnostics.selectedNormalIndex ?? null,
      selectedRotationIndex: chosen.draft.diagnostics.selectedRotationIndex ?? null,
      rejectedCandidateReasons: JSON.stringify(rejectedCandidateReasons),
      ...(chosen.zone.featureClass === 'cove'
        ? {
            coveRejectedCandidateReasons: Object.keys(rejectedCandidateReasons).sort(),
            coveWeakSpringFallbackRetained: false,
          }
        : {}),
      ...selectedSemanticRecoveryDiagnostics(chosen.zone, primaryReason),
      ...(chosen.zone.diagnostics.fallbackPlacementUsed === true
        ? { fallbackPlacementReason: primaryReason || chosen.zone.diagnostics.fallbackPlacementReason || 'primary_candidate_failed' }
        : {}),
    },
  };
}

function selectedSemanticRecoveryDiagnostics(
  zone: Omit<WaterReaderPlacedZone, 'zoneId'>,
  primaryReason: string,
): Record<string, number | string | boolean | null> {
  const diagnostics: Record<string, number | string | boolean | null> = {};
  if (zone.diagnostics.semanticFallbackUsed === true && primaryReason) {
    diagnostics.semanticFallbackReason = primaryReason;
    if (zone.featureClass === 'cove') diagnostics.coveFallbackReason = primaryReason;
  }
  if (zone.featureClass === 'island') {
    const multiplier = numberDiagnostic(zone.diagnostics.islandSizeAttemptMultiplier);
    if (multiplier < 1.5) diagnostics.islandSizeRecoveryRejectedReason = primaryReason || 'larger_island_candidate_not_selected';
  }
  if (zone.featureClass === 'neck' || zone.featureClass === 'saddle') {
    if (zone.diagnostics.constrictionApproachCandidateUsed !== true) {
      diagnostics.constrictionApproachRejectedReason = primaryReason || 'approach_candidate_not_selected';
    }
    if (zone.diagnostics.constrictionLineFallbackUsed === true) {
      diagnostics.semanticFallbackUsed = true;
      diagnostics.semanticFallbackReason = primaryReason || 'approach_candidate_not_selected';
      diagnostics.semanticConfidenceTier = 'fallback_line';
      diagnostics.displayReadabilityTier = 'line_fallback';
    }
  }
  return diagnostics;
}

function isExcellentCandidate(zone: Omit<WaterReaderPlacedZone, 'zoneId'>): boolean {
  const visibleScore = Math.abs(zone.visibleWaterFraction - TARGET_VISIBLE_WATER_FRACTION);
  const outside = numberDiagnostic(zone.diagnostics.outsideOvalBoundaryFraction);
  return visibleScore <= 0.012 && outside >= 0.25;
}

function isCoveBackCandidate(candidate: {
  zone: Omit<WaterReaderPlacedZone, 'zoneId'>;
  draft: WaterReaderZoneDraft;
}): boolean {
  return candidate.zone.featureClass === 'cove' && candidate.zone.placementKind === 'cove_back';
}

function compareZoneCandidates(
  a: { zone: Omit<WaterReaderPlacedZone, 'zoneId'>; draft: WaterReaderZoneDraft },
  b: { zone: Omit<WaterReaderPlacedZone, 'zoneId'>; draft: WaterReaderZoneDraft },
): number {
  const aTip = tipPlacementPreference(a.zone);
  const bTip = tipPlacementPreference(b.zone);
  if (aTip !== bTip) return aTip - bTip;

  const aVisibleScore = Math.abs(a.zone.visibleWaterFraction - TARGET_VISIBLE_WATER_FRACTION);
  const bVisibleScore = Math.abs(b.zone.visibleWaterFraction - TARGET_VISIBLE_WATER_FRACTION);
  const semanticPreference = coveBackSemanticPreference(a, b);
  if (semanticPreference !== 0) return semanticPreference;
  const islandPreference = islandMainlandSemanticPreference(a, b);
  if (islandPreference !== 0) return islandPreference;
  const islandOpenWaterPreference = islandOpenWaterSemanticPreference(a, b);
  if (islandOpenWaterPreference !== 0) return islandOpenWaterPreference;
  const readableFloorPreference = readableFloorCandidatePreference(a.zone, b.zone, aVisibleScore, bVisibleScore);
  if (readableFloorPreference !== 0) return readableFloorPreference;
  const constrictionShapePreference = constrictionOvalCandidatePreference(a.zone, b.zone, aVisibleScore, bVisibleScore);
  if (constrictionShapePreference !== 0) return constrictionShapePreference;
  if (Math.abs(aVisibleScore - bVisibleScore) > 0.025) return aVisibleScore - bVisibleScore;

  const aOutside = outsidePreferenceScore(a.zone);
  const bOutside = outsidePreferenceScore(b.zone);
  if (Math.abs(aOutside - bOutside) > 0.025) return bOutside - aOutside;

  if (Math.abs(a.zone.majorAxisM - b.zone.majorAxisM) > 0.01) return b.zone.majorAxisM - a.zone.majorAxisM;

  const aOffset = numberDiagnostic(a.draft.diagnostics.selectedOffsetFactor);
  const bOffset = numberDiagnostic(b.draft.diagnostics.selectedOffsetFactor);
  return aOffset - bOffset;
}

function readableFloorCandidatePreference(
  a: Omit<WaterReaderPlacedZone, 'zoneId'>,
  b: Omit<WaterReaderPlacedZone, 'zoneId'>,
  aVisibleScore: number,
  bVisibleScore: number,
): number {
  if (a.featureClass !== b.featureClass || a.placementKind !== b.placementKind) return 0;
  if (aVisibleScore > 0.08 || bVisibleScore > 0.08) return 0;
  if (outsidePreferenceScore(a) < 0.2 || outsidePreferenceScore(b) < 0.2) return 0;
  const aFloor = numberDiagnostic(a.diagnostics.readableFloorMajorAxisM);
  const bFloor = numberDiagnostic(b.diagnostics.readableFloorMajorAxisM);
  const aFloorSized = aFloor > 0 && a.majorAxisM >= aFloor * 0.98;
  const bFloorSized = bFloor > 0 && b.majorAxisM >= bFloor * 0.98;
  if (aFloorSized !== bFloorSized) return aFloorSized ? -1 : 1;
  if (!aFloorSized && !bFloorSized && a.diagnostics.readableFloorApplied !== true && b.diagnostics.readableFloorApplied !== true) return 0;
  if (Math.abs(a.majorAxisM - b.majorAxisM) <= 0.01) return 0;
  return b.majorAxisM - a.majorAxisM;
}

function constrictionOvalCandidatePreference(
  a: Omit<WaterReaderPlacedZone, 'zoneId'>,
  b: Omit<WaterReaderPlacedZone, 'zoneId'>,
  aVisibleScore: number,
  bVisibleScore: number,
): number {
  if (a.featureClass !== b.featureClass || a.placementKind !== b.placementKind) return 0;
  if (a.featureClass !== 'neck' && a.featureClass !== 'saddle') return 0;
  if (aVisibleScore > 0.08 || bVisibleScore > 0.08) return 0;
  if (outsidePreferenceScore(a) < 0.2 || outsidePreferenceScore(b) < 0.2) return 0;
  const aOval = a.diagnostics.constrictionOvalCandidateUsed === true;
  const bOval = b.diagnostics.constrictionOvalCandidateUsed === true;
  if (aOval !== bOval) return aOval ? -1 : 1;
  const aAspect = numberDiagnostic(a.diagnostics.zoneAspectRatio);
  const bAspect = numberDiagnostic(b.diagnostics.zoneAspectRatio);
  if (aAspect > 0 && bAspect > 0 && Math.abs(aAspect - bAspect) > 0.15) return aAspect - bAspect;
  return 0;
}

function islandMainlandSemanticPreference(
  a: { zone: Omit<WaterReaderPlacedZone, 'zoneId'>; draft: WaterReaderZoneDraft },
  b: { zone: Omit<WaterReaderPlacedZone, 'zoneId'>; draft: WaterReaderZoneDraft },
): number {
  if (a.zone.featureClass !== 'island' || b.zone.featureClass !== 'island') return 0;
  if (a.zone.placementKind !== 'island_mainland' || b.zone.placementKind !== 'island_mainland') return 0;
  return islandMainlandCandidateRank(a.zone, a.draft) - islandMainlandCandidateRank(b.zone, b.draft);
}

function islandMainlandCandidateRank(
  zone: Omit<WaterReaderPlacedZone, 'zoneId'>,
  draft: WaterReaderZoneDraft,
): number {
  if (zone.anchorSemanticId === 'island_mainland_primary') return 1;
  const fallbackKind = String(zone.diagnostics.fallbackPlacementKind ?? draft.diagnostics.fallbackPlacementKind ?? '');
  if (zone.anchorSemanticId === 'island_mainland_recovery' || fallbackKind === 'island_mainland_edge_recovery' || fallbackKind === 'island_mainland_ray_recovery') return 2;
  if (zone.anchorSemanticId === 'island_shoreline_recovery' && fallbackKind === 'island_mainland_edge_recovery') return 2;
  if (zone.anchorSemanticId === 'island_shoreline_recovery') return 3;
  if (zone.anchorSemanticId === 'island_open_water_recovery') return 4;
  return 5;
}

function islandOpenWaterSemanticPreference(
  a: { zone: Omit<WaterReaderPlacedZone, 'zoneId'>; draft: WaterReaderZoneDraft },
  b: { zone: Omit<WaterReaderPlacedZone, 'zoneId'>; draft: WaterReaderZoneDraft },
): number {
  if (a.zone.featureClass !== 'island' || b.zone.featureClass !== 'island') return 0;
  if (a.zone.placementKind !== 'island_open_water' || b.zone.placementKind !== 'island_open_water') return 0;
  return islandOpenWaterCandidateRank(a.zone, a.draft) - islandOpenWaterCandidateRank(b.zone, b.draft);
}

function islandOpenWaterCandidateRank(
  zone: Omit<WaterReaderPlacedZone, 'zoneId'>,
  draft: WaterReaderZoneDraft,
): number {
  const semantic = zone.anchorSemanticId ?? draft.anchorSemanticId;
  if (semantic === 'island_open_water_area') return 1;
  if (semantic === 'island_open_water_same_side_recovery') return 2;
  if (semantic === 'island_open_water_recovery') return 3;
  if (semantic === 'island_shoreline_recovery') return 4;
  if (semantic === 'island_alternate_endpoint_recovery') return 5;
  return 6;
}

function coveBackSemanticPreference(
  a: { zone: Omit<WaterReaderPlacedZone, 'zoneId'>; draft: WaterReaderZoneDraft },
  b: { zone: Omit<WaterReaderPlacedZone, 'zoneId'>; draft: WaterReaderZoneDraft },
): number {
  if (a.zone.featureClass !== 'cove' || b.zone.featureClass !== 'cove') return 0;
  if (a.zone.placementKind !== 'cove_back' || b.zone.placementKind !== 'cove_back') return 0;
  return coveBackSemanticRank(a.draft.anchorSemanticId) - coveBackSemanticRank(b.draft.anchorSemanticId);
}

function coveBackSemanticRank(anchorSemanticId: WaterReaderPlacedZone['anchorSemanticId']): number {
  switch (anchorSemanticId) {
    case 'cove_back_primary':
      return 1;
    case 'cove_back_pocket_recovery_left':
    case 'cove_back_pocket_recovery_right':
      return 2;
    case 'cove_inner_shoreline_left':
    case 'cove_inner_shoreline_right':
    case 'cove_inner_wall_midpoint_left':
    case 'cove_inner_wall_midpoint_right':
      return 3;
    case 'cove_mouth_shoulder_recovery':
      return 4;
    default:
      return 5;
  }
}

function tipPlacementPreference(zone: Omit<WaterReaderPlacedZone, 'zoneId'>): number {
  if (zone.placementKind !== 'main_point_tip') return 0;
  const mode = zone.diagnostics.pointTipPlacementMode;
  if (mode === 'tip_centered') return 0;
  if (mode === 'tip_near') return 1;
  return 2;
}

function outsidePreferenceScore(zone: Omit<WaterReaderPlacedZone, 'zoneId'>): number {
  const outside = numberDiagnostic(zone.diagnostics.outsideOvalBoundaryFraction);
  return Math.min(outside, 0.45);
}

function numberDiagnostic(value: number | string | boolean | string[] | null | undefined): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function primaryRejectedReason(reasons: Record<string, number>): string {
  const entries = Object.entries(reasons).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  return entries[0]?.[0] ?? 'zone_no_valid_candidates';
}

function assignZoneIds(zones: WaterReaderPlacedZone[]): WaterReaderPlacedZone[] {
  return zones.map((zone, index) => ({ ...zone, zoneId: `zone-${index + 1}` }));
}

function hasInternalOverlap(zones: WaterReaderPlacedZone[]): boolean {
  return hasInternalOverlapLoose(zones);
}

function hasInternalOverlapLoose(zones: Array<Omit<WaterReaderPlacedZone, 'zoneId'> | WaterReaderPlacedZone>): boolean {
  if (isPairedStructuralCombination(zones)) return false;
  for (let i = 0; i < zones.length; i++) {
    for (let j = i + 1; j < zones.length; j++) {
      if (zonesOverlapLoose(zones[i]!, zones[j]!)) return true;
    }
  }
  return false;
}

function zonesOverlapLoose(
  a: Omit<WaterReaderPlacedZone, 'zoneId'> | WaterReaderPlacedZone,
  b: Omit<WaterReaderPlacedZone, 'zoneId'> | WaterReaderPlacedZone,
): boolean {
  return zonesOverlap({ ...a, zoneId: 'a' }, { ...b, zoneId: 'b' });
}

function isPairedStructuralCombination(zones: Array<Omit<WaterReaderPlacedZone, 'zoneId'> | WaterReaderPlacedZone>): boolean {
  return zones.length === 2 &&
    zones[0]?.sourceFeatureId === zones[1]?.sourceFeatureId &&
    zones[0]?.featureClass === zones[1]?.featureClass &&
    isPairedStructuralZone(zones[0]!) &&
    isPairedStructuralZone(zones[1]!);
}

function isPairedStructuralZone(zone: Omit<WaterReaderPlacedZone, 'zoneId'> | WaterReaderPlacedZone): boolean {
  return (
    (zone.featureClass === 'neck' && zone.placementKind === 'neck_shoulder') ||
    (zone.featureClass === 'saddle' && zone.placementKind === 'saddle_shoulder') ||
    (zone.featureClass === 'dam' && zone.placementKind === 'dam_corner')
  );
}

function annotatePairOverlapIfNeeded(
  zones: Array<Omit<WaterReaderPlacedZone, 'zoneId'>>,
): Array<Omit<WaterReaderPlacedZone, 'zoneId'>> {
  if (!isPairedStructuralCombination(zones)) return zones;
  const severity = pairOverlapSeverity(zones[0]!, zones[1]!);
  return zones.map((zone) => ({
    ...zone,
    diagnostics: {
      ...zone.diagnostics,
      pairOverlapScore: severity.score,
      pairOverlapClassification: severity.classification,
      pairOverlapSampleCount: severity.sampleCount,
    },
  }));
}

function pairOverlapSeverity(
  a: Omit<WaterReaderPlacedZone, 'zoneId'> | WaterReaderPlacedZone,
  b: Omit<WaterReaderPlacedZone, 'zoneId'> | WaterReaderPlacedZone,
): { score: number; classification: PairOverlapClass; sampleCount: number } {
  const score = pairOverlapScore(a, b);
  return {
    score,
    classification: classifyPairOverlapScore(score),
    sampleCount: PAIR_OVERLAP_SAMPLE_POINTS.length,
  };
}

function classifyPairOverlapScore(score: number): PairOverlapClass {
  if (score <= TRACE_PAIR_OVERLAP_SCORE) return 'none_or_trace_pair_overlap';
  if (score <= LIGHT_PAIR_OVERLAP_SCORE) return 'allowed_light_pair_overlap';
  if (score <= MODERATE_PAIR_OVERLAP_SCORE) return 'allowed_moderate_pair_overlap';
  return 'strong_pair_overlap';
}

const PAIR_OVERLAP_SAMPLE_POINTS = (() => {
  const points: Array<{ x: number; y: number }> = [];
  const steps = 8;
  for (let ix = 0; ix <= steps; ix++) {
    const ux = -1 + (2 * ix) / steps;
    for (let iy = 0; iy <= steps; iy++) {
      const uy = -1 + (2 * iy) / steps;
      if (ux * ux + uy * uy <= 1) points.push({ x: ux, y: uy });
    }
  }
  return points;
})();

function pairOverlapScore(
  a: Omit<WaterReaderPlacedZone, 'zoneId'> | WaterReaderPlacedZone,
  b: Omit<WaterReaderPlacedZone, 'zoneId'> | WaterReaderPlacedZone,
): number {
  // Deterministic approximation: sample a fixed grid inside each ellipse and count
  // how much of either full oval falls inside the other. This intentionally uses
  // unclipped ellipse geometry, not lake pixels, so same-feature pair overlap is
  // judged independently from shoreline clipping while each zone still must pass
  // all individual water/shoreline invariants before this check is reached.
  const aInB = sampledEllipseOverlapFraction(a, b);
  const bInA = sampledEllipseOverlapFraction(b, a);
  return Math.max(aInB, bInA);
}

function sampledEllipseOverlapFraction(
  source: Omit<WaterReaderPlacedZone, 'zoneId'> | WaterReaderPlacedZone,
  target: Omit<WaterReaderPlacedZone, 'zoneId'> | WaterReaderPlacedZone,
): number {
  let inside = 0;
  for (const sample of PAIR_OVERLAP_SAMPLE_POINTS) {
    const world = ellipseLocalToWorld(sample, source);
    if (pointInZoneEllipse(world, target, 1)) inside++;
  }
  return PAIR_OVERLAP_SAMPLE_POINTS.length > 0 ? inside / PAIR_OVERLAP_SAMPLE_POINTS.length : 0;
}

function ellipseLocalToWorld(
  point: PointM,
  zone: Omit<WaterReaderPlacedZone, 'zoneId'> | WaterReaderPlacedZone,
): PointM {
  const majorRadius = zone.majorAxisM / 2;
  const minorRadius = zone.minorAxisM / 2;
  const cos = Math.cos(zone.rotationRad);
  const sin = Math.sin(zone.rotationRad);
  const localX = point.x * majorRadius;
  const localY = point.y * minorRadius;
  return {
    x: zone.ovalCenter.x + localX * cos - localY * sin,
    y: zone.ovalCenter.y + localX * sin + localY * cos,
  };
}

function pointInZoneEllipse(
  point: PointM,
  zone: Omit<WaterReaderPlacedZone, 'zoneId'> | WaterReaderPlacedZone,
  scale = 1,
): boolean {
  const majorRadius = (zone.majorAxisM / 2) * scale;
  const minorRadius = (zone.minorAxisM / 2) * scale;
  if (majorRadius <= 0 || minorRadius <= 0) return false;
  const dx = point.x - zone.ovalCenter.x;
  const dy = point.y - zone.ovalCenter.y;
  const cos = Math.cos(-zone.rotationRad);
  const sin = Math.sin(-zone.rotationRad);
  const localX = dx * cos - dy * sin;
  const localY = dx * sin + dy * cos;
  return (localX * localX) / (majorRadius * majorRadius) + (localY * localY) / (minorRadius * minorRadius) <= 1;
}

function annotateStructureConfluence(
  zones: WaterReaderPlacedZone[],
): { zones: WaterReaderPlacedZone[]; groups: WaterReaderStructureConfluenceGroup[] } {
  if (zones.length < 2) {
    return {
      zones: zones.map((zone) => withConfluenceDiagnostics(zone, null)),
      groups: [],
    };
  }
  const parent = zones.map((_, index) => index);
  const strengths = new Map<string, 'light' | 'strong'>();
  const reasons = new Map<string, string>();

  const find = (index: number): number => {
    while (parent[index] !== index) {
      parent[index] = parent[parent[index]!]!;
      index = parent[index]!;
    }
    return index;
  };
  const union = (a: number, b: number, strength: 'light' | 'strong', reason: string) => {
    const ra = find(a);
    const rb = find(b);
    if (ra === rb) {
      const key = String(ra);
      if (strength === 'strong') strengths.set(key, 'strong');
      else if (!strengths.has(key)) strengths.set(key, 'light');
      reasons.set(key, confluenceReasonPreference(reasons.get(key), reason));
      return;
    }
    const root = Math.min(ra, rb);
    const child = Math.max(ra, rb);
    parent[child] = root;
    const existing = strengths.get(String(ra)) === 'strong' || strengths.get(String(rb)) === 'strong';
    strengths.set(String(root), existing || strength === 'strong' ? 'strong' : 'light');
    reasons.set(String(root), confluenceReasonPreference(confluenceReasonPreference(reasons.get(String(ra)), reasons.get(String(rb))), reason));
  };

  for (let i = 0; i < zones.length; i++) {
    for (let j = i + 1; j < zones.length; j++) {
      const candidate = confluencePairCandidate(zones[i]!, zones[j]!);
      if (candidate) {
        union(i, j, candidate.strength, candidate.reason);
      }
    }
  }

  const memberIndexes = new Map<number, number[]>();
  for (let i = 0; i < zones.length; i++) {
    const root = find(i);
    const existing = memberIndexes.get(root) ?? [];
    existing.push(i);
    memberIndexes.set(root, existing);
  }

  const groups: WaterReaderStructureConfluenceGroup[] = [];
  const groupIds = new Map<number, string>();
  let groupNumber = 1;
  for (const [root, indexes] of [...memberIndexes.entries()].sort((a, b) => a[0] - b[0])) {
    if (indexes.length < 2) continue;
    const members = indexes.map((index) => zones[index]!);
    const compactness = confluenceCompactness(members);
    if (!compactness.compact) continue;
    const groupId = `confluence-${groupNumber++}`;
    groupIds.set(root, groupId);
    groups.push({
      groupId,
      strength: strengths.get(String(root)) ?? 'light',
      memberZoneIds: members.map((zone) => zone.zoneId),
      memberSourceFeatureIds: [...new Set(members.map((zone) => zone.sourceFeatureId))],
      memberFeatureClasses: [...new Set(members.map((zone) => zone.featureClass))],
      memberPlacementKinds: [...new Set(members.map((zone) => zone.placementKind))],
      mergeReason: reasons.get(String(root)) ?? 'visible_overlap',
      compactnessRatio: roundDiagnosticNumber(compactness.ratio),
      envelopeMajorAxisM: roundDiagnosticNumber(compactness.envelopeMajorAxisM),
      largestMemberAxisM: roundDiagnosticNumber(compactness.largestMemberAxisM),
      renderedAsUnifiedEnvelope: true,
    });
  }

  return {
    zones: zones.map((zone, index) => {
      const root = find(index);
      const groupId = groupIds.get(root) ?? null;
      const group = groupId ? groups.find((item) => item.groupId === groupId) ?? null : null;
      return withConfluenceDiagnostics(zone, group);
    }),
    groups,
  };
}

function confluencePairCandidate(
  a: WaterReaderPlacedZone,
  b: WaterReaderPlacedZone,
): { strength: 'light' | 'strong'; reason: string } | null {
  const sameSource = a.sourceFeatureId === b.sourceFeatureId;
  const sameFeatureClass = a.featureClass === b.featureClass;
  if (!sameSource && !sameFeatureClass) return null;
  const score = pairOverlapScore(a, b);
  if (score <= LIGHT_PAIR_OVERLAP_SCORE) return null;
  if (!sameSource && sameFeatureClass) {
    const compactness = confluenceCompactness([a, b]);
    if (score < 0.62 || !compactness.compact || compactness.ratio > 1.45) return null;
  }
  return {
    strength: score > MODERATE_PAIR_OVERLAP_SCORE ? 'strong' : 'light',
    reason: sameSource
      ? (score > MODERATE_PAIR_OVERLAP_SCORE ? 'same_source_visible_overlap_heavy' : 'same_source_visible_overlap_light')
      : (score > MODERATE_PAIR_OVERLAP_SCORE ? 'same_class_extreme_compact_overlap_heavy' : 'same_class_extreme_compact_overlap_light'),
  };
}

function confluenceCompactness(zones: WaterReaderPlacedZone[]): {
  compact: boolean;
  ratio: number;
  envelopeMajorAxisM: number;
  largestMemberAxisM: number;
} {
  const points = zones.flatMap((zone) => zone.visibleWaterRing.length >= 3 ? zone.visibleWaterRing : zone.unclippedRing);
  const bounds = boundsForRing(points.length > 0 ? points : zones.map((zone) => zone.ovalCenter));
  const envelopeMajorAxisM = Math.hypot(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY);
  const largestMemberAxisM = Math.max(...zones.map((zone) => zone.majorAxisM), 1);
  const ratio = envelopeMajorAxisM / largestMemberAxisM;
  const sameOrNearSource = new Set(zones.map((zone) => zone.sourceFeatureId)).size < zones.length;
  const maxRatio = sameOrNearSource ? 2.9 : 2.35;
  return {
    compact: ratio <= maxRatio,
    ratio,
    envelopeMajorAxisM,
    largestMemberAxisM,
  };
}

function confluenceReasonPreference(a: string | undefined, b: string | undefined): string {
  if (!a) return b ?? 'visible_overlap';
  if (!b) return a;
  const rank = (reason: string) => reason.includes('heavy') ? 0 : reason.includes('same') ? 1 : reason.includes('near') ? 2 : 3;
  return rank(a) <= rank(b) ? a : b;
}

function withConfluenceDiagnostics(
  zone: WaterReaderPlacedZone,
  group: WaterReaderStructureConfluenceGroup | null,
): WaterReaderPlacedZone {
  const groupId = group?.groupId ?? null;
  return {
    ...zone,
    diagnostics: {
      ...zone.diagnostics,
      structureConfluenceGroupId: groupId,
      structureConfluenceStrength: group?.strength ?? 'none',
      structureConfluenceMemberCount: group?.memberZoneIds.length ?? 0,
      structureConfluenceMergeReason: group?.mergeReason ?? null,
      structureConfluenceCompactnessRatio: group?.compactnessRatio ?? null,
      structureConfluenceEnvelopeMajorAxisM: group?.envelopeMajorAxisM ?? null,
      structureConfluenceLargestMemberAxisM: group?.largestMemberAxisM ?? null,
      structureConfluenceRenderedAsUnifiedEnvelope: group?.renderedAsUnifiedEnvelope ?? false,
    },
    qaFlags: groupId ? [...zone.qaFlags, 'structure_confluence'] : zone.qaFlags,
  };
}

function increment(counts: Record<string, number>, key: string): void {
  counts[key] = (counts[key] ?? 0) + 1;
}

function mergeCounts(a: Record<string, number>, b: Record<string, number>): Record<string, number> {
  const out = { ...a };
  for (const [key, value] of Object.entries(b)) out[key] = (out[key] ?? 0) + value;
  return out;
}

function fallbackDiagnostics(kind: string, attemptIndex: number): Record<string, number | string | boolean | null> {
  return {
    fallbackPlacementUsed: true,
    fallbackPlacementReason: 'primary_candidate_failed',
    fallbackPlacementKind: kind,
    fallbackAttemptIndex: attemptIndex,
  };
}

function coveIrregularSideAnchor(feature: WaterReaderCoveFeature): PointM {
  const backIndex = nearestIndex(feature.back, feature.shorePath);
  if (backIndex < 0) return feature.back;
  if (feature.leftIrregularity >= feature.rightIrregularity) {
    return feature.shorePath[Math.max(0, Math.floor(backIndex / 2))] ?? feature.back;
  }
  const halfway = Math.floor((backIndex + feature.shorePath.length - 1) / 2);
  return feature.shorePath[Math.min(feature.shorePath.length - 1, halfway)] ?? feature.back;
}

function coveWallAnchor(feature: WaterReaderCoveFeature, side: 'left' | 'right', fractionFromBackToMouth: number): PointM {
  const mouth = side === 'left' ? feature.mouthLeft : feature.mouthRight;
  const target = lerpPoint(feature.back, mouth, fractionFromBackToMouth);
  return nearestPointOnRing(target, feature.shorePath.length >= 2 ? feature.shorePath : [feature.back, mouth]);
}

function selectedCoveSidePathLengthM(feature: WaterReaderCoveFeature): number {
  const backIndex = nearestIndex(feature.back, feature.shorePath);
  if (backIndex <= 0 || backIndex >= feature.shorePath.length - 1) return feature.shorePathLengthM / 2;
  const start = feature.leftIrregularity >= feature.rightIrregularity ? 0 : backIndex;
  const end = feature.leftIrregularity >= feature.rightIrregularity ? backIndex : feature.shorePath.length - 1;
  let length = 0;
  for (let i = start + 1; i <= end; i++) {
    length += distanceM(feature.shorePath[i - 1]!, feature.shorePath[i]!);
  }
  return length;
}

function nearestIndex(point: PointM, ring: RingM): number {
  let bestIndex = -1;
  let bestDistance = Infinity;
  for (let i = 0; i < ring.length; i++) {
    const d = distanceM(point, ring[i]!);
    if (d < bestDistance) {
      bestDistance = d;
      bestIndex = i;
    }
  }
  return bestIndex;
}

type OpenWaterSideAreaComparison = {
  resolved: boolean;
  openSide: 'a' | 'b';
  sideASampleCount: number;
  sideBSampleCount: number;
  totalWaterSampleCount: number;
  searchRadiusM: number;
  sampleSpacingM: number;
  radialAngleCount: number;
  unresolvedReason: string | null;
  dividerMode: string;
};

function compareOpenWaterSideArea(params: {
  polygon: PolygonM;
  center: PointM;
  lineA: PointM;
  lineB: PointM;
  sideA: PointM;
  sideB: PointM;
  longestDimensionM: number;
}): OpenWaterSideAreaComparison {
  const searchRadiusM = Math.max(1, params.longestDimensionM * 0.2);
  const divider = openWaterDividerLine(params);
  const sideASign = sideOfLine(params.sideA, divider.lineA, divider.lineB);
  const sideBSign = sideOfLine(params.sideB, divider.lineA, divider.lineB);
  if (sideASign === 0 || sideBSign === 0 || sideASign === sideBSign) {
    return {
      resolved: false,
      openSide: 'a',
      sideASampleCount: 0,
      sideBSampleCount: 0,
      totalWaterSampleCount: 0,
      searchRadiusM,
      sampleSpacingM: 0,
      radialAngleCount: OPEN_WATER_SIDE_RADIAL_ANGLES,
      unresolvedReason: 'side_reference_degenerate',
      dividerMode: divider.mode,
    };
  }

  let sideASampleCount = 0;
  let sideBSampleCount = 0;
  const sampleSpacingM = Math.min(200, Math.max(40, searchRadiusM / 18));
  const radialRingCount = Math.max(1, Math.ceil(searchRadiusM / sampleSpacingM));
  const adjustedSpacingM = searchRadiusM / radialRingCount;
  for (let radiusIndex = 1; radiusIndex <= radialRingCount; radiusIndex++) {
    const radiusM = Math.min(searchRadiusM, radiusIndex * adjustedSpacingM);
    for (let angleIndex = 0; angleIndex < OPEN_WATER_SIDE_RADIAL_ANGLES; angleIndex++) {
      const angleRad = (Math.PI * 2 * angleIndex) / OPEN_WATER_SIDE_RADIAL_ANGLES;
      const sample = {
        x: params.center.x + Math.cos(angleRad) * radiusM,
        y: params.center.y + Math.sin(angleRad) * radiusM,
      };
      if (!pointInWaterOrBoundary(sample, params.polygon, Math.max(1, params.longestDimensionM * 0.0005))) continue;
      const sampleSign = sideOfLine(sample, divider.lineA, divider.lineB);
      if (sampleSign === sideASign) sideASampleCount++;
      else if (sampleSign === sideBSign) sideBSampleCount++;
    }
  }
  const totalWaterSampleCount = sideASampleCount + sideBSampleCount;
  const differencePct = totalWaterSampleCount > 0
    ? Math.abs(sideASampleCount - sideBSampleCount) / totalWaterSampleCount
    : 0;
  const unresolvedReason = totalWaterSampleCount < OPEN_WATER_SIDE_MIN_WATER_SAMPLES
    ? 'insufficient_water_samples'
    : differencePct < OPEN_WATER_SIDE_TIE_THRESHOLD_PCT
      ? 'side_counts_tied'
      : null;
  const resolved = unresolvedReason === null;
  return {
    resolved,
    openSide: sideASampleCount >= sideBSampleCount ? 'a' : 'b',
    sideASampleCount,
    sideBSampleCount,
    totalWaterSampleCount,
    searchRadiusM,
    sampleSpacingM: adjustedSpacingM,
    radialAngleCount: OPEN_WATER_SIDE_RADIAL_ANGLES,
    unresolvedReason,
    dividerMode: divider.mode,
  };
}

function openWaterDividerLine(params: {
  center: PointM;
  lineA: PointM;
  lineB: PointM;
  sideA: PointM;
  sideB: PointM;
}): { lineA: PointM; lineB: PointM; mode: string } {
  const primaryASign = sideOfLine(params.sideA, params.lineA, params.lineB);
  const primaryBSign = sideOfLine(params.sideB, params.lineA, params.lineB);
  if (primaryASign !== 0 && primaryBSign !== 0 && primaryASign !== primaryBSign) {
    return { lineA: params.lineA, lineB: params.lineB, mode: 'feature_axis' };
  }

  const sideVector = { x: params.sideA.x - params.sideB.x, y: params.sideA.y - params.sideB.y };
  const normal = normalize(sideVector);
  if (!normal) return { lineA: params.lineA, lineB: params.lineB, mode: 'degenerate' };
  const dividerDirection = { x: -normal.y, y: normal.x };
  return {
    lineA: { x: params.center.x - dividerDirection.x, y: params.center.y - dividerDirection.y },
    lineB: { x: params.center.x + dividerDirection.x, y: params.center.y + dividerDirection.y },
    mode: 'side_reference_axis',
  };
}

function openWaterSideDiagnostics(
  featureKind: string,
  comparison: OpenWaterSideAreaComparison,
): Record<string, number | string | boolean | null> {
  return {
    openWaterSideMethod: 'deterministic_area_sampling',
    openWaterSideSamplingPattern: 'radial_rings',
    openWaterSideDividerMode: comparison.dividerMode,
    openWaterSideFeatureKind: featureKind,
    openWaterSideResolved: comparison.resolved,
    openWaterSideSelectedSide: comparison.openSide,
    openWaterSideSampleSteps: OPEN_WATER_SIDE_SAMPLE_STEPS,
    openWaterSideRadialAngleCount: comparison.radialAngleCount,
    openWaterSideSampleSpacingM: comparison.sampleSpacingM,
    openWaterSideMinimumWaterSamples: OPEN_WATER_SIDE_MIN_WATER_SAMPLES,
    openWaterSideTieThresholdPct: OPEN_WATER_SIDE_TIE_THRESHOLD_PCT,
    openWaterSideUnresolvedReason: comparison.unresolvedReason,
    openWaterSideSearchRadiusM: comparison.searchRadiusM,
    openWaterSideASampleCount: comparison.sideASampleCount,
    openWaterSideBSampleCount: comparison.sideBSampleCount,
    openWaterSideTotalWaterSampleCount: comparison.totalWaterSampleCount,
  };
}

function sideOfLine(point: PointM, a: PointM, b: PointM): -1 | 0 | 1 {
  const cross = (b.x - a.x) * (point.y - a.y) - (b.y - a.y) * (point.x - a.x);
  if (Math.abs(cross) < 1e-6) return 0;
  return cross > 0 ? 1 : -1;
}

function cross(a: PointM, b: PointM): number {
  return a.x * b.y - a.y * b.x;
}

function farthestPoint(from: PointM, points: PointM[]): PointM {
  return [...points].sort((a, b) => distanceM(b, from) - distanceM(a, from))[0] ?? from;
}

function midpoint(a: PointM, b: PointM): PointM {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function shorelineAnchor(point: PointM, polygon: PolygonM): PointM {
  return nearestPointOnRing(point, polygon.exterior);
}

function inwardOffsetCenters(params: {
  anchor: PointM;
  polygon: PolygonM;
  longestDimensionM: number;
  majorAxisM: number;
  preferredDirection?: PointM;
  fallbackNormal: PointM;
  offsetFactors: readonly number[];
}): PointM[] {
  const normals = inwardNormalOptions({
    anchor: params.anchor,
    preferredDirection: params.preferredDirection,
    fallbackNormal: params.fallbackNormal,
    polygon: params.polygon,
    longestDimensionM: params.longestDimensionM,
  });
  return normals.flatMap((normal) => params.offsetFactors.map((factor) => ({
    x: params.anchor.x + normal.x * params.majorAxisM * factor,
    y: params.anchor.y + normal.y * params.majorAxisM * factor,
  })));
}

function averagePoint(points: PointM[]): PointM {
  if (points.length === 0) return { x: 0, y: 0 };
  return {
    x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
    y: points.reduce((sum, point) => sum + point.y, 0) / points.length,
  };
}

function maxPairDistanceM(points: PointM[]): number {
  let maxDistanceM = 0;
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      maxDistanceM = Math.max(maxDistanceM, distanceM(points[i]!, points[j]!));
    }
  }
  return maxDistanceM;
}

function uniquePoints(points: PointM[]): PointM[] {
  const out: PointM[] = [];
  for (const point of points) {
    if (out.some((existing) => distanceM(existing, point) < 0.5)) continue;
    out.push(point);
  }
  return out;
}

function uniqueNumbers(values: number[]): number[] {
  const out: number[] = [];
  for (const value of values) {
    if (!Number.isFinite(value)) continue;
    const normalized = normalizeAngle(value);
    if (out.some((existing) => Math.abs(Math.cos(existing - normalized)) > 0.999)) continue;
    out.push(normalized);
  }
  return out;
}

function longestSegmentMidpoint(ring: RingM): PointM {
  let bestLength = -Infinity;
  let best = ring[0] ?? { x: 0, y: 0 };
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i]!;
    const b = ring[(i + 1) % ring.length]!;
    const length = distanceM(a, b);
    if (length > bestLength) {
      bestLength = length;
      best = lerpPoint(a, b, 0.5);
    }
  }
  return best;
}

function nearestPointOnSegmentLocal(p: PointM, a: PointM, b: PointM): PointM {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return a;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2));
  return { x: a.x + dx * t, y: a.y + dy * t };
}

function normalize(vector: PointM): PointM | null {
  const length = Math.hypot(vector.x, vector.y);
  if (length === 0) return null;
  return { x: vector.x / length, y: vector.y / length };
}
