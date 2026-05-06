import type { PointM, PolygonM, RingM } from '../contracts';
import { distanceM } from '../metrics';
import {
  distanceToPolygonBoundary,
  pointInWaterOrBoundary,
} from '../features/validation';
import type { WaterReaderPlacedZone, WaterReaderZoneDraft } from './types';

export type ZoneMaterializeResult =
  | { ok: true; zone: Omit<WaterReaderPlacedZone, 'zoneId'> }
  | { ok: false; reason: string };

export function buildOvalRing(
  center: PointM,
  majorAxisM: number,
  minorAxisM: number,
  rotationRad: number,
  samples = 72,
): RingM {
  const ring: RingM = [];
  const majorRadius = majorAxisM / 2;
  const minorRadius = minorAxisM / 2;
  const cos = Math.cos(rotationRad);
  const sin = Math.sin(rotationRad);
  for (let i = 0; i < samples; i++) {
    const theta = (Math.PI * 2 * i) / samples;
    const localX = Math.cos(theta) * majorRadius;
    const localY = Math.sin(theta) * minorRadius;
    ring.push({
      x: center.x + localX * cos - localY * sin,
      y: center.y + localX * sin + localY * cos,
    });
  }
  return ring;
}

export function materializeZoneDraft(params: {
  draft: WaterReaderZoneDraft;
  polygon: PolygonM;
  longestDimensionM: number;
  toleranceM?: number;
}): ZoneMaterializeResult {
  const { draft, polygon } = params;
  const defaultToleranceM = Math.max(3, params.longestDimensionM * 0.0015);
  const toleranceM = params.toleranceM ?? (
    draft.featureClass === 'island'
      ? Math.max(1, Math.min(defaultToleranceM, draft.minorAxisM * 0.08))
      : defaultToleranceM
  );
  if (!Number.isFinite(draft.majorAxisM) || !Number.isFinite(draft.minorAxisM)) {
    return { ok: false, reason: 'invalid_zone_axes' };
  }
  if (draft.majorAxisM <= 0 || draft.minorAxisM <= 0) return { ok: false, reason: 'invalid_zone_axes' };
  const centerInsideWater = pointInWaterOrBoundary(draft.ovalCenter, polygon, toleranceM);
  const outsideWaterCenterAllowed = wholeFeatureOutsideWaterCenterAllowed(draft, params.longestDimensionM);
  if (!centerInsideWater && !outsideWaterCenterAllowed) {
    return { ok: false, reason: 'zone_center_outside_water' };
  }

  const shorelineDistance = distanceToPolygonBoundary(draft.anchor, polygon);
  if (shorelineDistance > toleranceM) return { ok: false, reason: 'zone_anchor_not_shoreline' };

  const unclippedRing = buildOvalRing(draft.ovalCenter, draft.majorAxisM, draft.minorAxisM, draft.rotationRad);
  const frameContact = featureFrameContactSatisfied(draft, toleranceM);
  if (!frameContact.ok) {
    return { ok: false, reason: 'zone_no_shoreline_contact' };
  }

  const fraction = sampleVisibleWaterFraction(draft, polygon, toleranceM);
  const islandEdgeRecovery = islandEdgeLargeRecoveryAllowed(draft, fraction);
  const islandStructureArea = draft.featureClass === 'island' && draft.placementKind === 'island_structure_area';
  const boundedFeatureEnvelopeRecovery = boundedFeatureEnvelopeWaterRecoveryAllowed(draft, fraction, params.longestDimensionM);
  const acceptedOutsideWaterCenter = !centerInsideWater && outsideWaterCenterAllowed && frameContact.ok;
  const groupedConstrictionShoulderRecovery = groupedConstrictionShoulderRecoveryAllowed(draft, frameContact.count, params.longestDimensionM);
  const maxVisibleWaterFraction = islandStructureArea
    ? 1
    : islandEdgeRecovery
      ? 0.995
      : groupedConstrictionShoulderRecovery
        ? 0.97
        : boundedFeatureEnvelopeRecovery
          ? 0.9
          : 0.75;
  const minOutsideOvalBoundaryFraction = islandStructureArea
    ? 0
    : islandEdgeRecovery
      ? 0.005
      : groupedConstrictionShoulderRecovery
        ? 0.01
        : boundedFeatureEnvelopeRecovery
          ? 0.05
          : 0.2;
  const minVisibleWaterFraction = acceptedOutsideWaterCenter ? 0.24 : 0.5;
  if (fraction.visibleWaterFraction < minVisibleWaterFraction) return { ok: false, reason: 'zone_visible_fraction_too_low' };
  if (fraction.visibleWaterFraction > maxVisibleWaterFraction) return { ok: false, reason: 'zone_visible_fraction_too_high' };
  if (fraction.outsideOvalBoundaryFraction < minOutsideOvalBoundaryFraction) return { ok: false, reason: 'zone_no_bank_side_boundary' };
  const frameLocality = acceptedOutsideWaterCenter
    ? featureFrameLocalitySatisfied(draft, fraction.visibleWaterPoints, toleranceM)
    : featureFrameLocalityNotRequired(draft);
  if (acceptedOutsideWaterCenter && !frameLocality.ok) {
    return { ok: false, reason: 'zone_feature_frame_locality_failed' };
  }
  if (
    draft.featureClass !== 'neck' &&
    draft.featureClass !== 'saddle' &&
    draft.featureClass !== 'dam' &&
    !islandEdgeRecovery &&
    !boundedFeatureEnvelopeRecovery &&
    fraction.visibleWaterFraction > 0.72
  ) {
    return { ok: false, reason: 'zone_bridges_too_much_local_width' };
  }

  return {
    ok: true,
    zone: {
      sourceFeatureId: draft.sourceFeatureId,
      featureClass: draft.featureClass,
      placementKind: draft.placementKind,
      anchor: draft.anchor,
      ovalCenter: draft.ovalCenter,
      majorAxisM: draft.majorAxisM,
      minorAxisM: draft.minorAxisM,
      rotationRad: draft.rotationRad,
      unclippedRing,
      visibleWaterRing: fraction.visibleWaterRing,
      visibleWaterFraction: fraction.visibleWaterFraction,
      diagnostics: {
        ...draft.diagnostics,
        shorelineDistanceM: shorelineDistance,
        outsideOvalBoundaryFraction: fraction.outsideOvalBoundaryFraction,
        visibleWaterFractionCeiling: maxVisibleWaterFraction,
        outsideOvalBoundaryFractionFloor: minOutsideOvalBoundaryFraction,
        boundedFeatureEnvelopeWaterRecoveryCandidate: boundedFeatureEnvelopeRecovery,
        wholeFeatureOutsideWaterCenterAllowed: outsideWaterCenterAllowed,
        wholeFeatureOutsideWaterCenterAccepted: acceptedOutsideWaterCenter,
        wholeFeatureCenterInsideWater: centerInsideWater,
        featureFrameContactSatisfied: frameContact.ok,
        featureFrameContactSatisfiedCount: frameContact.count,
        featureFrameContactAnchorCount: draft.featureFrameContactAnchors?.length ?? 1,
        featureFrameContactToleranceM: draft.featureFrameContactToleranceM ?? toleranceM,
        featureFrameLocalitySatisfied: frameLocality.ok,
        featureFrameLocalityRadiusM: frameLocality.radiusM,
        featureFrameMaxVisibleWaterDistanceM: frameLocality.maxVisibleWaterDistanceM,
        featureFrameMaxAnchorDistanceM: frameLocality.maxAnchorDistanceM,
        featureFrameLocalityAnchorCount: frameLocality.anchorCount,
        featureFrameLocalityChecked: acceptedOutsideWaterCenter,
        groupedConstrictionShoulderRecoveryCandidate: groupedConstrictionShoulderRecovery,
        visibleWaterFractionFloor: minVisibleWaterFraction,
        islandLargeRecoveryCandidate: islandEdgeRecovery,
        islandLargeRecoveryAccepted: islandEdgeRecovery && numericDiagnostic(draft.diagnostics.islandSizeMultiplierApplied ?? draft.diagnostics.selectedSizeFactor) >= 1.5,
        waterSampleCount: fraction.waterSampleCount,
        totalSampleCount: fraction.totalSampleCount,
      },
      qaFlags: [...draft.qaFlags],
    },
  };
}

function numericDiagnostic(value: number | string | boolean | string[] | null | undefined): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function islandEdgeLargeRecoveryAllowed(
  draft: WaterReaderZoneDraft,
  fraction: { visibleWaterFraction: number; outsideOvalBoundaryFraction: number },
): boolean {
  if (draft.featureClass !== 'island') return false;
  if (draft.placementKind === 'island_structure_area') {
    return fraction.visibleWaterFraction <= 1 && fraction.outsideOvalBoundaryFraction >= 0;
  }
  if (draft.placementKind !== 'island_mainland') return false;
  const semantic = draft.anchorSemanticId;
  if (semantic !== 'island_mainland_primary' && semantic !== 'island_mainland_recovery' && semantic !== 'island_shoreline_recovery') {
    return false;
  }
  return fraction.visibleWaterFraction <= 0.995 && fraction.outsideOvalBoundaryFraction >= 0.005;
}

function boundedFeatureEnvelopeWaterRecoveryAllowed(
  draft: WaterReaderZoneDraft,
  fraction: { visibleWaterFraction: number; outsideOvalBoundaryFraction: number },
  longestDimensionM: number,
): boolean {
  if (draft.diagnostics.featureEnvelopeModelVersion !== 'feature-envelope-v1') return false;
  if (fraction.outsideOvalBoundaryFraction < 0.05 || fraction.visibleWaterFraction > 0.9) return false;
  const L = Math.max(1, longestDimensionM);
  switch (draft.placementKind) {
    case 'main_point_structure_area':
      return draft.majorAxisM <= L * 0.06;
    case 'secondary_point_structure_area':
      return draft.majorAxisM <= L * 0.045;
    case 'cove_structure_area':
      return draft.majorAxisM <= L * 0.075;
    case 'neck_structure_area':
    case 'saddle_structure_area':
      return draft.majorAxisM <= L * 0.07 && draft.majorAxisM / Math.max(1, draft.minorAxisM) <= 3.4;
    case 'dam_structure_area':
      return draft.majorAxisM <= L * 0.065;
    default:
      return false;
  }
}

function wholeFeatureOutsideWaterCenterAllowed(draft: WaterReaderZoneDraft, longestDimensionM: number): boolean {
  if (draft.featureFrameAllowsOutsideWaterCenter !== true) return false;
  if (draft.diagnostics.featureEnvelopeModelVersion !== 'feature-envelope-v1') return false;
  const L = Math.max(1, longestDimensionM);
  switch (draft.placementKind) {
    case 'main_point_structure_area':
      return draft.majorAxisM <= L * 0.06 && draft.minorAxisM <= L * 0.046;
    case 'secondary_point_structure_area':
      return draft.majorAxisM <= L * 0.05 && draft.minorAxisM <= L * 0.038;
    case 'island_structure_area':
      return draft.majorAxisM <= L * 0.25;
    default:
      return false;
  }
}

function groupedConstrictionShoulderRecoveryAllowed(
  draft: WaterReaderZoneDraft,
  contactCount: number,
  longestDimensionM: number,
): boolean {
  if (draft.placementKind !== 'neck_structure_area' && draft.placementKind !== 'saddle_structure_area') return false;
  if (draft.diagnostics.featureEnvelopeModelVersion !== 'feature-envelope-v1') return false;
  if (contactCount < Math.max(2, draft.featureFrameContactMinCount ?? 2)) return false;
  const L = Math.max(1, longestDimensionM);
  return draft.majorAxisM <= L * 0.07 && draft.majorAxisM / Math.max(1, draft.minorAxisM) <= 3.4;
}

function featureFrameContactSatisfied(
  draft: WaterReaderZoneDraft,
  toleranceM: number,
): { ok: boolean; count: number } {
  const anchors = draft.featureFrameContactAnchors && draft.featureFrameContactAnchors.length > 0
    ? draft.featureFrameContactAnchors
    : [draft.anchor];
  const multiplier = draft.placementKind === 'saddle_structure_area' || draft.placementKind === 'neck_structure_area'
    ? 1.18
    : 1.08;
  const tolerance = Math.max(toleranceM, draft.featureFrameContactToleranceM ?? 0);
  let count = 0;
  for (const anchor of anchors) {
    if (pointInEllipse(anchor, draft.ovalCenter, draft.majorAxisM, draft.minorAxisM, draft.rotationRad, multiplier)) {
      count++;
      continue;
    }
    if (ellipseEdgeDistanceM(anchor, draft.ovalCenter, draft.majorAxisM, draft.minorAxisM, draft.rotationRad) <= tolerance) {
      count++;
    }
  }
  const required = draft.featureFrameContactMinCount ?? 1;
  return { ok: count >= required, count };
}

function featureFrameLocalitySatisfied(
  draft: WaterReaderZoneDraft,
  visibleWaterPoints: PointM[],
  toleranceM: number,
): {
  ok: boolean;
  radiusM: number | null;
  maxVisibleWaterDistanceM: number | null;
  maxAnchorDistanceM: number | null;
  anchorCount: number;
} {
  const anchors = draft.featureFrameContactAnchors && draft.featureFrameContactAnchors.length > 0
    ? draft.featureFrameContactAnchors
    : [draft.anchor];
  const radiusM = draft.featureFrameLocalityRadiusM;
  const maxAnchorDistanceM = maxPairDistanceM(anchors);
  const maxVisibleWaterDistanceM = maxNearestAnchorDistanceM(visibleWaterPoints, anchors);
  if (!Number.isFinite(radiusM) || !radiusM || radiusM <= 0) {
    return { ok: false, radiusM: null, maxVisibleWaterDistanceM, maxAnchorDistanceM, anchorCount: anchors.length };
  }
  if (visibleWaterPoints.length === 0 || anchors.length === 0 || maxVisibleWaterDistanceM === null) {
    return { ok: false, radiusM, maxVisibleWaterDistanceM, maxAnchorDistanceM, anchorCount: anchors.length };
  }
  const tolerance = Math.max(toleranceM, radiusM * 0.02);
  return {
    ok: maxVisibleWaterDistanceM <= radiusM + tolerance,
    radiusM,
    maxVisibleWaterDistanceM,
    maxAnchorDistanceM,
    anchorCount: anchors.length,
  };
}

function featureFrameLocalityNotRequired(draft: WaterReaderZoneDraft) {
  const anchors = draft.featureFrameContactAnchors && draft.featureFrameContactAnchors.length > 0
    ? draft.featureFrameContactAnchors
    : [draft.anchor];
  const radiusM = draft.featureFrameLocalityRadiusM ?? null;
  return {
    ok: true,
    radiusM,
    maxVisibleWaterDistanceM: null,
    maxAnchorDistanceM: maxPairDistanceM(anchors),
    anchorCount: anchors.length,
  };
}

function maxNearestAnchorDistanceM(points: PointM[], anchors: PointM[]): number | null {
  if (points.length === 0 || anchors.length === 0) return null;
  let maxDistance = 0;
  for (const point of points) {
    let nearest = Number.POSITIVE_INFINITY;
    for (const anchor of anchors) nearest = Math.min(nearest, distanceM(point, anchor));
    if (Number.isFinite(nearest)) maxDistance = Math.max(maxDistance, nearest);
  }
  return maxDistance;
}

function maxPairDistanceM(points: PointM[]): number | null {
  if (points.length < 2) return points.length === 1 ? 0 : null;
  let maxDistance = 0;
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      maxDistance = Math.max(maxDistance, distanceM(points[i]!, points[j]!));
    }
  }
  return maxDistance;
}

export function zonesOverlap(a: WaterReaderPlacedZone, b: WaterReaderPlacedZone): boolean {
  const centerDistance = distanceM(a.ovalCenter, b.ovalCenter);
  if (centerDistance > (a.majorAxisM + b.majorAxisM) * 0.55) return false;
  if (pointInEllipse(a.ovalCenter, b.ovalCenter, b.majorAxisM, b.minorAxisM, b.rotationRad, 0.92)) return true;
  if (pointInEllipse(b.ovalCenter, a.ovalCenter, a.majorAxisM, a.minorAxisM, a.rotationRad, 0.92)) return true;

  const sampleStep = Math.max(1, Math.floor(a.visibleWaterRing.length / 12));
  for (let i = 0; i < a.visibleWaterRing.length; i += sampleStep) {
    if (pointInEllipse(a.visibleWaterRing[i]!, b.ovalCenter, b.majorAxisM, b.minorAxisM, b.rotationRad, 0.92)) return true;
  }
  const otherStep = Math.max(1, Math.floor(b.visibleWaterRing.length / 12));
  for (let i = 0; i < b.visibleWaterRing.length; i += otherStep) {
    if (pointInEllipse(b.visibleWaterRing[i]!, a.ovalCenter, a.majorAxisM, a.minorAxisM, a.rotationRad, 0.92)) return true;
  }
  return false;
}

export function violatesZoneCrowding(
  candidate: WaterReaderPlacedZone,
  selected: WaterReaderPlacedZone[],
  longestDimensionM: number,
): boolean {
  const radius = longestDimensionM * 0.12;
  const nearby = selected.filter((zone) => distanceM(zone.ovalCenter, candidate.ovalCenter) <= radius);
  if (nearby.length < 2) return false;
  const withCandidate = [...nearby, candidate];
  const constrictions = withCandidate.filter((zone) => zone.featureClass === 'neck' || zone.featureClass === 'saddle');
  if (constrictions.length > 0) {
    const nonConstrictions = withCandidate.length - constrictions.length;
    return nonConstrictions > 1;
  }
  return true;
}

function sampleVisibleWaterFraction(draft: WaterReaderZoneDraft, polygon: PolygonM, toleranceM: number) {
  let totalSampleCount = 0;
  let waterSampleCount = 0;
  const visibleWaterRing: RingM = [];
  const visibleWaterPoints: RingM = [];
  const majorRadius = draft.majorAxisM / 2;
  const minorRadius = draft.minorAxisM / 2;
  const cos = Math.cos(draft.rotationRad);
  const sin = Math.sin(draft.rotationRad);
  const steps = 13;

  for (let ix = 0; ix <= steps; ix++) {
    const ux = -1 + (2 * ix) / steps;
    for (let iy = 0; iy <= steps; iy++) {
      const uy = -1 + (2 * iy) / steps;
      if (ux * ux + uy * uy > 1) continue;
      totalSampleCount++;
      const point = {
        x: draft.ovalCenter.x + ux * majorRadius * cos - uy * minorRadius * sin,
        y: draft.ovalCenter.y + ux * majorRadius * sin + uy * minorRadius * cos,
      };
      if (pointInWaterOrBoundary(point, polygon, toleranceM)) {
        waterSampleCount++;
        visibleWaterPoints.push(point);
      }
    }
  }

  const boundary = buildOvalRing(draft.ovalCenter, draft.majorAxisM, draft.minorAxisM, draft.rotationRad, 96);
  let outsideBoundaryCount = 0;
  for (const point of boundary) {
    if (pointInWaterOrBoundary(point, polygon, toleranceM)) {
      visibleWaterRing.push(point);
      visibleWaterPoints.push(point);
    } else {
      outsideBoundaryCount++;
    }
  }

  return {
    visibleWaterFraction: totalSampleCount > 0 ? waterSampleCount / totalSampleCount : 0,
    visibleWaterRing,
    outsideOvalBoundaryFraction: boundary.length > 0 ? outsideBoundaryCount / boundary.length : 0,
    waterSampleCount,
    totalSampleCount,
    visibleWaterPoints,
  };
}

function pointInEllipse(
  point: PointM,
  center: PointM,
  majorAxisM: number,
  minorAxisM: number,
  rotationRad: number,
  scale = 1,
): boolean {
  const majorRadius = (majorAxisM / 2) * scale;
  const minorRadius = (minorAxisM / 2) * scale;
  if (majorRadius <= 0 || minorRadius <= 0) return false;
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  const cos = Math.cos(-rotationRad);
  const sin = Math.sin(-rotationRad);
  const localX = dx * cos - dy * sin;
  const localY = dx * sin + dy * cos;
  return (localX * localX) / (majorRadius * majorRadius) + (localY * localY) / (minorRadius * minorRadius) <= 1;
}

function ellipseEdgeDistanceM(
  point: PointM,
  center: PointM,
  majorAxisM: number,
  minorAxisM: number,
  rotationRad: number,
): number {
  const majorRadius = majorAxisM / 2;
  const minorRadius = minorAxisM / 2;
  if (majorRadius <= 0 || minorRadius <= 0) return Number.POSITIVE_INFINITY;
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  const cos = Math.cos(-rotationRad);
  const sin = Math.sin(-rotationRad);
  const localX = dx * cos - dy * sin;
  const localY = dx * sin + dy * cos;
  const angle = Math.atan2(localY / minorRadius, localX / majorRadius);
  const edgeX = Math.cos(angle) * majorRadius;
  const edgeY = Math.sin(angle) * minorRadius;
  return Math.hypot(localX - edgeX, localY - edgeY);
}
