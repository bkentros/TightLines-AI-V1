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
import { featureZonePriority, featureZoneScore, visibleZoneCap, zoneDraftSort } from './priority';
import { materializeZoneDraft, violatesZoneCrowding, zonesOverlap } from './invariants';
import type {
  WaterReaderPlacedZone,
  WaterReaderFeatureZoneCoverage,
  WaterReaderStructureConfluenceGroup,
  WaterReaderZoneUnitDiagnostics,
  WaterReaderZoneDraft,
  WaterReaderZonePlacementDiagnostics,
  WaterReaderZonePlacementKind,
  WaterReaderZonePlacementOptions,
  WaterReaderZonePlacementResult,
} from './types';

const ASPECT_RATIO = 1.6;
const OFFSET_FACTORS = [0, 0.03, 0.06, 0.09, 0.12, 0.16, 0.2, 0.25, 0.32, 0.4] as const;
const STANDARD_SIZE_FACTORS = [1, 0.85, 0.7] as const;
const LARGE_SIZE_FACTORS = [1, 0.85, 0.72, 0.6] as const;
const LARGE_OFFSET_FACTORS = [-0.08, -0.04, 0, 0.06, 0.12, 0.2, 0.32] as const;
const CONSTRICTION_SIZE_FACTORS = [1, 0.85, 0.72, 0.6] as const;
const POINT_SIZE_FACTORS = [1, 0.85] as const;
const POINT_SIDE_FRACTIONS = [0.35, 0.45, 0.55] as const;
const POINT_OPEN_SIDE_FRACTIONS = [0.45, 0.55] as const;
const POINT_OFFSET_FACTORS = [-0.06, -0.03, 0.04, 0.12, 0.24] as const;
const POINT_TIP_OFFSET_FACTORS = [-0.04, 0, 0.1, 0.22] as const;
const FALLBACK_SIZE_FACTORS = [0.85, 0.7, 0.58] as const;
const FALLBACK_OFFSET_FACTORS = [-0.03, 0.04, 0.12, 0.22, 0.34] as const;
const ISLAND_EDGE_SIZE_FACTORS = [1.15, 1, 0.85, 0.7, 0.55] as const;
const ISLAND_EDGE_OFFSET_FACTORS = [-0.02, 0, 0.04, 0.08, 0.14, 0.22] as const;
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
    zoneCount: 0,
    selectedFeatureIds: [],
    suppressedFeatureIds: features.map((feature) => feature.featureId),
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
  const drafts = buildFeatureZoneDrafts({ features, polygon: primaryPolygon, season, longestDimensionM: metrics.longestDimensionM });
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
    zoneCount: 0,
    selectedFeatureIds: [],
    suppressedFeatureIds: [],
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
  diagnostics.suppressedFeatureIds = diagnostics.featureCoverage
    .filter((coverage) => !coverage.producedVisibleZones)
    .map((coverage) => coverage.featureId);
  diagnostics.selectedFeatureCount = diagnostics.selectedFeatureIds.length;
  diagnostics.suppressedFeatureCount = diagnostics.suppressedFeatureIds.length;
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
}): WaterReaderZoneDraft[] {
  const coveIds = new Set(params.features.filter((feature) => feature.featureClass === 'cove').map((feature) => feature.featureId));
  const drafts: WaterReaderZoneDraft[] = [];
  for (const feature of params.features) {
    switch (feature.featureClass) {
      case 'neck':
        drafts.push(...constrictionDrafts(feature, params));
        break;
      case 'saddle':
        drafts.push(...constrictionDrafts(feature, params));
        break;
      case 'main_lake_point':
        drafts.push(...pointDrafts(feature, params));
        break;
      case 'secondary_point':
        if (feature.parentCoveId && coveIds.has(feature.parentCoveId)) drafts.push(...pointDrafts(feature, params));
        break;
      case 'cove':
        drafts.push(...coveDrafts(feature, params));
        break;
      case 'island':
        drafts.push(...islandDrafts(feature, params));
        break;
      case 'dam':
        drafts.push(...damDrafts(feature, params));
        break;
      case 'universal':
        break;
    }
  }
  return drafts;
}

function constrictionDrafts(
  feature: WaterReaderNeckFeature | WaterReaderSaddleFeature,
  params: { polygon: PolygonM; longestDimensionM: number },
): WaterReaderZoneDraft[] {
  const kind = feature.featureClass === 'neck' ? 'neck_shoulder' : 'saddle_shoulder';
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
      placementKind: kind,
      largeFeature: true,
      baseMajorAxisM: constrictionShoulderMajorAxisM(feature, params.longestDimensionM),
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
  params: { polygon: PolygonM; season: WaterReaderSeason; longestDimensionM: number },
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
      ...makePointTipDraft(feature, params),
      ...pointOpenSideDrafts(feature, params),
    ];
  }

  return pointOpenSideDrafts(feature, params, true);
}

function secondaryPointDrafts(
  feature: WaterReaderPointFeature,
  params: { polygon: PolygonM; season: WaterReaderSeason; longestDimensionM: number },
): WaterReaderZoneDraft[] {
  const kind = params.season === 'spring' ? 'secondary_point_back' : 'secondary_point_mouth';
  const primaryAnchor = params.season === 'spring'
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
      placementKind: kind,
      strictInwardNormal: params.season === 'winter',
      sizeFactors: anchor.fallback ? FALLBACK_SIZE_FACTORS : POINT_SIZE_FACTORS,
      offsetFactors: anchor.fallback ? FALLBACK_OFFSET_FACTORS : POINT_OFFSET_FACTORS,
      unitSuffix: 'primary',
      diagnostics: {
        ...pointAnchorDiagnostics(feature, anchor.point, {
          source: anchor.kind,
          fraction: anchor.index === 0 ? 0 : 0.45,
        }),
        ...(anchor.fallback ? fallbackDiagnostics(anchor.kind, anchor.index) : {}),
      },
    }),
  );
}

function pointSideDrafts(
  feature: WaterReaderPointFeature,
  slope: PointM,
  side: 'left' | 'right',
  placementKind: WaterReaderZonePlacementKind,
  params: { polygon: PolygonM; longestDimensionM: number },
): WaterReaderZoneDraft[] {
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
      placementKind,
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
  params: { polygon: PolygonM; longestDimensionM: number },
): WaterReaderZoneDraft[] {
  const tipNearCenter = lerpPoint(feature.tip, feature.baseMidpoint, 0.08);
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
        diagnostics: {
          pointTipCenteredCandidate: true,
          pointTipCenterDistanceM: 0,
          pointTipPlacementMode: 'tip_centered',
        },
      },
      {
        center: tipNearCenter,
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
    placementKind: 'main_point_tip',
    unitSuffix: 'tip',
    diagnostics: pointAnchorDiagnostics(feature, feature.tip, {
      source: 'point_tip',
      fraction: 0,
    }, 'fallback_rejected'),
  });
}

function pointOpenSideDrafts(
  feature: WaterReaderPointFeature,
  params: { polygon: PolygonM; longestDimensionM: number },
  singleSide = false,
): WaterReaderZoneDraft[] {
  const sideDrafts = [
    {
      slope: feature.leftSlope,
      source: 'point_open_left_interpolated',
    },
    {
      slope: feature.rightSlope,
      source: 'point_open_right_interpolated',
    },
  ];
  const selectedSides = singleSide
    ? [sideDrafts.sort((a, b) => distanceM(b.slope, feature.baseMidpoint) - distanceM(a.slope, feature.baseMidpoint))[0]!]
    : sideDrafts;
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
        placementKind: 'main_point_open_water',
        unitSuffix: 'open',
        diagnostics: pointAnchorDiagnostics(feature, lerpPoint(feature.tip, side.slope, fraction), {
          source: side.source,
          fraction,
        }),
      }),
    )
  );
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
  params: { polygon: PolygonM; season: WaterReaderSeason; longestDimensionM: number },
): WaterReaderZoneDraft[] {
  const strongestMouth = feature.leftIrregularity >= feature.rightIrregularity ? feature.mouthLeft : feature.mouthRight;
  const oppositeMouth = feature.leftIrregularity >= feature.rightIrregularity ? feature.mouthRight : feature.mouthLeft;
  const strongestSide: 'left' | 'right' = feature.leftIrregularity >= feature.rightIrregularity ? 'left' : 'right';
  const oppositeSide: 'left' | 'right' = strongestSide === 'left' ? 'right' : 'left';
  const make = (
    anchor: PointM,
    placementKind: WaterReaderZonePlacementKind,
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
      placementKind,
      unitSuffix: 'primary',
      strictInwardNormal,
      sizeFactors: fallbackKind ? FALLBACK_SIZE_FACTORS : STANDARD_SIZE_FACTORS,
      offsetFactors: fallbackKind ? FALLBACK_OFFSET_FACTORS : OFFSET_FACTORS,
      diagnostics: fallbackKind ? fallbackDiagnostics(fallbackKind, fallbackAttemptIndex) : undefined,
    });

  if (params.season === 'spring') {
    return [
      ...make(feature.back, 'cove_back', null, 0),
      ...make(coveWallAnchor(feature, 'left', 0.5), 'cove_back', 'cove_inner_wall_midpoint_left', 1),
      ...make(coveWallAnchor(feature, 'right', 0.5), 'cove_back', 'cove_inner_wall_midpoint_right', 2),
      ...make(strongestMouth, 'cove_back', 'cove_mouth_shoulder_fallback', 3),
    ];
  }
  if (params.season === 'summer' || params.season === 'winter') {
    return [
      ...make(strongestMouth, 'cove_mouth', null, 0, params.season === 'winter'),
      ...make(oppositeMouth, 'cove_mouth', 'cove_opposite_mouth_shoulder_fallback', 1, params.season === 'winter'),
      ...make(coveWallAnchor(feature, strongestSide, 0.78), 'cove_mouth', 'cove_near_mouth_inner_wall', 2, params.season === 'winter'),
      ...make(coveWallAnchor(feature, oppositeSide, 0.78), 'cove_mouth', 'cove_near_mouth_inner_wall_opposite', 3, params.season === 'winter'),
    ];
  }
  return [
    ...make(coveIrregularSideAnchor(feature), 'cove_irregular_side', null, 0),
    ...make(coveWallAnchor(feature, strongestSide, 0.55), 'cove_irregular_side', 'cove_irregular_side_midpoint', 1),
    ...make(coveWallAnchor(feature, strongestSide, 0.78), 'cove_irregular_side', 'cove_irregular_side_closer_to_mouth', 2),
    ...make(coveWallAnchor(feature, strongestSide, 0.28), 'cove_irregular_side', 'cove_irregular_side_closer_to_back', 3),
    ...make(strongestMouth, 'cove_irregular_side', 'cove_mouth_shoulder_fallback', 4),
  ];
}

function islandDrafts(
  feature: WaterReaderIslandFeature,
  params: { polygon: PolygonM; season: WaterReaderSeason; longestDimensionM: number },
): WaterReaderZoneDraft[] {
  const centroid = ringCentroid(feature.ring);
  const mainlandAnchor = nearestPointOnRing(centroid, params.polygon.exterior);
  const mainlandFacingEdge = nearestPointOnRing(mainlandAnchor, feature.ring);
  const awayVector = normalize({ x: centroid.x - mainlandAnchor.x, y: centroid.y - mainlandAnchor.y }) ?? { x: 1, y: 0 };
  const openWaterEdge = nearestPointOnRing({
    x: centroid.x + awayVector.x * Math.max(1, Math.sqrt(Math.max(1, feature.areaSqM))),
    y: centroid.y + awayVector.y * Math.max(1, Math.sqrt(Math.max(1, feature.areaSqM))),
  }, feature.ring);
  const primaryKind = params.season === 'spring'
    ? 'island_mainland' as const
    : params.season === 'fall'
      ? 'island_endpoint' as const
      : 'island_open_water' as const;
  const anchors = params.season === 'spring'
    ? [
        { point: mainlandFacingEdge, ring: feature.ring, fallback: false, kind: 'island_mainland_primary', index: 0 },
        { point: feature.endpointA, ring: feature.ring, fallback: true, kind: 'island_alternate_endpoint', index: 1 },
        { point: feature.endpointB, ring: feature.ring, fallback: true, kind: 'island_alternate_endpoint', index: 2 },
        { point: openWaterEdge, ring: feature.ring, fallback: true, kind: 'island_open_water_side', index: 3 },
      ]
    : params.season === 'fall'
      ? [
          { point: feature.endpointA, ring: feature.ring, fallback: false, kind: 'island_primary', index: 0 },
          { point: feature.endpointB, ring: feature.ring, fallback: true, kind: 'island_alternate_endpoint', index: 1 },
          { point: openWaterEdge, ring: feature.ring, fallback: true, kind: 'island_open_water_side', index: 2 },
          { point: mainlandFacingEdge, ring: feature.ring, fallback: true, kind: 'island_mainland_facing_fallback', index: 3 },
        ]
      : [
          { point: openWaterEdge, ring: feature.ring, fallback: false, kind: 'island_primary', index: 0 },
          { point: feature.endpointB, ring: feature.ring, fallback: true, kind: 'island_alternate_endpoint', index: 1 },
          { point: feature.endpointA, ring: feature.ring, fallback: true, kind: 'island_alternate_endpoint', index: 2 },
          { point: mainlandFacingEdge, ring: feature.ring, fallback: true, kind: 'island_mainland_facing_fallback', index: 3 },
        ];

  return anchors.flatMap((anchor) =>
    makeAnchoredDraft({
      feature,
      anchor: anchor.point,
      shorelineRing: anchor.ring,
      polygon: params.polygon,
      longestDimensionM: params.longestDimensionM,
      placementKind: primaryKind,
      unitSuffix: 'primary',
      baseMajorAxisM: islandEdgeMajorAxisM(feature, params.longestDimensionM),
      sizeFactors: ISLAND_EDGE_SIZE_FACTORS,
      offsetFactors: ISLAND_EDGE_OFFSET_FACTORS,
      centerOverrides: [
        {
          center: anchor.point,
          diagnostics: fallbackDiagnostics('island_shoreline_center_fallback', anchor.index + 10),
        },
      ],
      diagnostics: anchor.fallback ? fallbackDiagnostics(anchor.kind, anchor.index) : undefined,
    }),
  );
}

function damDrafts(
  feature: WaterReaderDamFeature,
  params: { polygon: PolygonM; longestDimensionM: number },
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
      placementKind: 'dam_corner',
      largeFeature: true,
      strictInwardNormal: true,
      offsetFactors: LARGE_OFFSET_FACTORS,
      sizeFactors: CONSTRICTION_SIZE_FACTORS,
      unitSuffix: anchor.suffix,
    }),
  );
}

function constrictionShoulderMajorAxisM(
  feature: WaterReaderNeckFeature | WaterReaderSaddleFeature,
  longestDimensionM: number,
): number {
  const widthScaled = feature.widthM * (feature.featureClass === 'neck' ? 5.5 : 4.5);
  const lakeScaled = longestDimensionM * (feature.featureClass === 'neck' ? 0.075 : 0.085);
  return Math.max(42, Math.min(lakeScaled, widthScaled, longestDimensionM * 0.1));
}

function islandEdgeMajorAxisM(feature: WaterReaderIslandFeature, longestDimensionM: number): number {
  const islandScaled = Math.sqrt(Math.max(1, feature.areaSqM)) * 0.42;
  return Math.max(28, Math.min(islandScaled, longestDimensionM * 0.025, 180));
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
  centerOverrides?: Array<{ center: PointM; diagnostics: Record<string, number | string | boolean | null> }>;
  shorelineRing: RingM;
  polygon: PolygonM;
  longestDimensionM: number;
  placementKind: WaterReaderZonePlacementKind;
  largeFeature?: boolean;
  baseMajorAxisM?: number;
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
          const majorAxisM = baseMajorAxisM * sizeFactor;
          const minorAxisM = majorAxisM / ASPECT_RATIO;
          for (const override of params.centerOverrides ?? []) {
            drafts.push({
              unitId: params.feature.featureId,
              candidateKey,
              unitPriority: featureZonePriority(params.feature),
              unitScore: featureZoneScore(params.feature),
              sourceFeatureId: params.feature.featureId,
              featureClass: params.feature.featureClass,
              placementKind: params.placementKind,
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
                selectedAnchorIndex: anchorIndex,
                selectedNormalIndex: normalIndex,
                selectedRotationIndex: rotationIndex,
                unitSuffix: params.unitSuffix ?? null,
                ...params.diagnostics,
                ...override.diagnostics,
                constrictionEndpointRecovered: candidateFrame.recovered,
                constrictionEndpointSearchMeters: candidateFrame.searchMeters,
                constrictionEndpointCandidateCount: frames.length,
              },
              qaFlags: ['shoreline_hugging_oval'],
              allowPairCrowding: params.allowPairCrowding,
            });
          }
          for (const offsetFactor of params.offsetFactors ?? OFFSET_FACTORS) {
            drafts.push({
              unitId: params.feature.featureId,
              candidateKey,
              unitPriority: featureZonePriority(params.feature),
              unitScore: featureZoneScore(params.feature),
              sourceFeatureId: params.feature.featureId,
              featureClass: params.feature.featureClass,
              placementKind: params.placementKind,
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
                selectedAnchorIndex: anchorIndex,
                selectedNormalIndex: normalIndex,
                selectedRotationIndex: rotationIndex,
                unitSuffix: params.unitSuffix ?? null,
                ...params.diagnostics,
                constrictionEndpointRecovered: candidateFrame.recovered,
                constrictionEndpointSearchMeters: candidateFrame.searchMeters,
                constrictionEndpointCandidateCount: frames.length,
              },
              qaFlags: ['shoreline_hugging_oval'],
              allowPairCrowding: params.allowPairCrowding,
            });
          }
        }
      }
    }
  }
  return drafts;
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
    const finishUnit = () => {
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
      unitOutcomes[group.unitId] = 'no_valid_draft';
      unitReason = 'no_valid_draft';
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
      };
    }
    return {
      featureId: feature.featureId,
      featureClass: feature.featureClass,
      zoneCount: 0,
      producedVisibleZones: false,
      reason: featureCoverageReason({
        feature,
        season: params.season,
        hasDrafts: (draftCounts.get(feature.featureId) ?? 0) > 0,
        unitOutcome: params.unitOutcomes[feature.featureId],
        secondaryDependencyDrops: params.secondaryDependencyDrops,
      }),
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
  const target = draft.featureClass === 'neck' || draft.featureClass === 'saddle' || draft.featureClass === 'dam' ? 0.12 : 0.04;
  return Math.abs(raw - target);
}

function validZoneCandidates(params: {
  drafts: WaterReaderZoneDraft[];
  polygon: PolygonM;
  longestDimensionM: number;
}): {
  candidates: Array<Omit<WaterReaderPlacedZone, 'zoneId'>>;
  primaryReason: string;
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
  };
}

function compareSingleZoneFallback(a: Omit<WaterReaderPlacedZone, 'zoneId'>, b: Omit<WaterReaderPlacedZone, 'zoneId'>): number {
  if (a.placementKind === 'main_point_tip' && b.placementKind !== 'main_point_tip') return -1;
  if (b.placementKind === 'main_point_tip' && a.placementKind !== 'main_point_tip') return 1;
  const aVisibleScore = Math.abs(a.visibleWaterFraction - TARGET_VISIBLE_WATER_FRACTION);
  const bVisibleScore = Math.abs(b.visibleWaterFraction - TARGET_VISIBLE_WATER_FRACTION);
  if (Math.abs(aVisibleScore - bVisibleScore) > 0.025) return aVisibleScore - bVisibleScore;
  return b.majorAxisM - a.majorAxisM;
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
      if (isExcellentCandidate(candidate.zone)) {
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
    diagnostics: {
      ...chosen.zone.diagnostics,
      candidateCount,
      selectedOffsetFactor: chosen.draft.diagnostics.selectedOffsetFactor ?? chosen.draft.diagnostics.shorelineOffsetFactor ?? null,
      selectedSizeFactor: chosen.draft.diagnostics.selectedSizeFactor ?? null,
      selectedAnchorIndex: chosen.draft.diagnostics.selectedAnchorIndex ?? null,
      selectedNormalIndex: chosen.draft.diagnostics.selectedNormalIndex ?? null,
      selectedRotationIndex: chosen.draft.diagnostics.selectedRotationIndex ?? null,
      rejectedCandidateReasons: JSON.stringify(rejectedCandidateReasons),
      ...(chosen.zone.diagnostics.fallbackPlacementUsed === true
        ? { fallbackPlacementReason: primaryReason || chosen.zone.diagnostics.fallbackPlacementReason || 'primary_candidate_failed' }
        : {}),
    },
  };
}

function isExcellentCandidate(zone: Omit<WaterReaderPlacedZone, 'zoneId'>): boolean {
  const visibleScore = Math.abs(zone.visibleWaterFraction - TARGET_VISIBLE_WATER_FRACTION);
  const outside = numberDiagnostic(zone.diagnostics.outsideOvalBoundaryFraction);
  return visibleScore <= 0.012 && outside >= 0.25;
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
  if (Math.abs(aVisibleScore - bVisibleScore) > 0.025) return aVisibleScore - bVisibleScore;

  const aOutside = outsidePreferenceScore(a.zone);
  const bOutside = outsidePreferenceScore(b.zone);
  if (Math.abs(aOutside - bOutside) > 0.025) return bOutside - aOutside;

  if (Math.abs(a.zone.majorAxisM - b.zone.majorAxisM) > 0.01) return b.zone.majorAxisM - a.zone.majorAxisM;

  const aOffset = numberDiagnostic(a.draft.diagnostics.selectedOffsetFactor);
  const bOffset = numberDiagnostic(b.draft.diagnostics.selectedOffsetFactor);
  return aOffset - bOffset;
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

function numberDiagnostic(value: number | string | boolean | null | undefined): number {
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
      zones: zones.map((zone) => withConfluenceDiagnostics(zone, null, 'none', 0)),
      groups: [],
    };
  }
  const parent = zones.map((_, index) => index);
  const strengths = new Map<string, 'light' | 'strong'>();

  const find = (index: number): number => {
    while (parent[index] !== index) {
      parent[index] = parent[parent[index]!]!;
      index = parent[index]!;
    }
    return index;
  };
  const union = (a: number, b: number, strength: 'light' | 'strong') => {
    const ra = find(a);
    const rb = find(b);
    if (ra === rb) {
      const key = String(ra);
      if (strength === 'strong') strengths.set(key, 'strong');
      else if (!strengths.has(key)) strengths.set(key, 'light');
      return;
    }
    const root = Math.min(ra, rb);
    const child = Math.max(ra, rb);
    parent[child] = root;
    const existing = strengths.get(String(ra)) === 'strong' || strengths.get(String(rb)) === 'strong';
    strengths.set(String(root), existing || strength === 'strong' ? 'strong' : 'light');
  };

  for (let i = 0; i < zones.length; i++) {
    for (let j = i + 1; j < zones.length; j++) {
      const score = pairOverlapScore(zones[i]!, zones[j]!);
      if (score > LIGHT_PAIR_OVERLAP_SCORE) {
        union(i, j, score > MODERATE_PAIR_OVERLAP_SCORE ? 'strong' : 'light');
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
    const groupId = `confluence-${groupNumber++}`;
    groupIds.set(root, groupId);
    const members = indexes.map((index) => zones[index]!);
    groups.push({
      groupId,
      strength: strengths.get(String(root)) ?? 'light',
      memberZoneIds: members.map((zone) => zone.zoneId),
      memberSourceFeatureIds: [...new Set(members.map((zone) => zone.sourceFeatureId))],
      memberFeatureClasses: [...new Set(members.map((zone) => zone.featureClass))],
      memberPlacementKinds: [...new Set(members.map((zone) => zone.placementKind))],
    });
  }

  return {
    zones: zones.map((zone, index) => {
      const root = find(index);
      const groupId = groupIds.get(root) ?? null;
      const group = groupId ? groups.find((item) => item.groupId === groupId) : null;
      return withConfluenceDiagnostics(zone, groupId, group?.strength ?? 'none', group?.memberZoneIds.length ?? 0);
    }),
    groups,
  };
}

function withConfluenceDiagnostics(
  zone: WaterReaderPlacedZone,
  groupId: string | null,
  strength: 'none' | 'light' | 'strong',
  memberCount: number,
): WaterReaderPlacedZone {
  return {
    ...zone,
    diagnostics: {
      ...zone.diagnostics,
      structureConfluenceGroupId: groupId,
      structureConfluenceStrength: strength,
      structureConfluenceMemberCount: memberCount,
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

function farthestPoint(from: PointM, points: PointM[]): PointM {
  return [...points].sort((a, b) => distanceM(b, from) - distanceM(a, from))[0] ?? from;
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
