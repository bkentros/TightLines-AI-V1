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
  if (!pointInWaterOrBoundary(draft.ovalCenter, polygon, toleranceM)) {
    return { ok: false, reason: 'zone_center_outside_water' };
  }

  const shorelineDistance = distanceToPolygonBoundary(draft.anchor, polygon);
  if (shorelineDistance > toleranceM) return { ok: false, reason: 'zone_anchor_not_shoreline' };

  const unclippedRing = buildOvalRing(draft.ovalCenter, draft.majorAxisM, draft.minorAxisM, draft.rotationRad);
  if (!pointInEllipse(draft.anchor, draft.ovalCenter, draft.majorAxisM, draft.minorAxisM, draft.rotationRad, 1.08)) {
    return { ok: false, reason: 'zone_no_shoreline_contact' };
  }

  const fraction = sampleVisibleWaterFraction(draft, polygon, toleranceM);
  if (fraction.visibleWaterFraction < 0.5) return { ok: false, reason: 'zone_visible_fraction_too_low' };
  if (fraction.visibleWaterFraction > 0.75) return { ok: false, reason: 'zone_visible_fraction_too_high' };
  if (fraction.outsideOvalBoundaryFraction < 0.2) return { ok: false, reason: 'zone_no_bank_side_boundary' };
  if (
    draft.featureClass !== 'neck' &&
    draft.featureClass !== 'saddle' &&
    draft.featureClass !== 'dam' &&
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
        waterSampleCount: fraction.waterSampleCount,
        totalSampleCount: fraction.totalSampleCount,
      },
      qaFlags: [...draft.qaFlags],
    },
  };
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
      if (pointInWaterOrBoundary(point, polygon, toleranceM)) waterSampleCount++;
    }
  }

  const boundary = buildOvalRing(draft.ovalCenter, draft.majorAxisM, draft.minorAxisM, draft.rotationRad, 96);
  let outsideBoundaryCount = 0;
  for (const point of boundary) {
    if (pointInWaterOrBoundary(point, polygon, toleranceM)) {
      visibleWaterRing.push(point);
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
