import type { PointM, PolygonM, RingM, WaterReaderPreprocessResult } from '../contracts.ts';
import { bboxM, distanceM } from '../metrics.ts';
import { clamp } from '../shoreline.ts';
import type { WaterReaderIslandFeature, WaterReaderNeckCandidate, WaterReaderPointCandidate, WaterReaderSaddleCandidate } from './types.ts';
import { nearestPointOnRing, pointInWaterOrBoundary, segmentSamplesInsideWater } from './validation.ts';

type RasterCell = {
  ix: number;
  iy: number;
  center: PointM;
  distanceToShoreM: number;
  widthM: number;
  axis?: 'x' | 'y';
};

type WidthFeatureCandidate = {
  endpointA: PointM;
  endpointB: PointM;
  center: PointM;
  widthM: number;
  leftExpansionRatio: number;
  rightExpansionRatio: number;
  confidence: number;
  score: number;
  qaFlags: string[];
  metrics: Record<string, number | string | boolean | null>;
};

type WaterMask = {
  mask: Uint8Array;
  nx: number;
  ny: number;
  bounds: { minX: number; minY: number; maxX: number; maxY: number };
  cellSizeM: number;
};

type ConstrictionContext = {
  islands?: WaterReaderIslandFeature[];
  points?: WaterReaderPointCandidate[];
};

type ApproachAreaMetrics = {
  leftApproachAreaSqM: number;
  rightApproachAreaSqM: number;
  sideAreaBalance: number;
  minSideAreaSqM: number;
  maxSideAreaSqM: number;
  minSideLakeAreaRatio: number;
  approachSampleCellCount: number;
  terminalBackwaterRejected: boolean;
};

type ConnectorBasinMetrics = {
  leftConnectorBasinAreaSqM: number;
  rightConnectorBasinAreaSqM: number;
  minConnectorBasinAreaSqM: number;
  maxConnectorBasinAreaSqM: number;
  minConnectorBasinLakeAreaRatio: number;
  connectorBasinBalance: number;
  terminalPocketConnector: boolean;
  connectorBasinInconclusive: boolean;
  connectorBasinSplitSucceeded: boolean;
  connectorBasinSplitFailed: boolean;
  connectorBasinApproximation: string;
};

export function detectNeckAndSaddleCandidates(preprocess: WaterReaderPreprocessResult, context: ConstrictionContext = {}): {
  necks: WaterReaderNeckCandidate[];
  saddles: WaterReaderSaddleCandidate[];
} {
  const polygon = preprocess.primaryPolygon;
  const metrics = preprocess.metrics;
  if (!polygon || !metrics || polygon.exterior.length < 4) return { necks: [], saddles: [] };
  const raster = rasterizeWaterMask(polygon, metrics.longestDimensionM);
  if (raster.waterCells.length < 20) return { necks: [], saddles: [] };
  const waterToleranceM = clamp(metrics.longestDimensionM * 0.0015, 5, 30);
  const principal = principalAxis(metrics.bboxM);
  const centerline = [
    ...medialAxisLikeCells(raster.waterCells, raster.cellSizeM),
    ...transectWidthCells(raster.waterCells, raster.cellSizeM, 'x'),
    ...transectWidthCells(raster.waterCells, raster.cellSizeM, 'y'),
  ];
  if (centerline.length < 4) return { necks: [], saddles: [] };
  const searchDistanceM = clamp(metrics.longestDimensionM * 0.12, 60, 800);
  const centerlineIndex = new RasterCellSpatialIndex(centerline, Math.max(raster.cellSizeM * 2, searchDistanceM * 0.25));
  const waterCellIndex = new RasterCellSpatialIndex(raster.waterCells, Math.max(raster.cellSizeM * 2, searchDistanceM * 0.22));
  const raw = centerline
    .filter((cell) => isLocalWidthMinimum(cell, centerlineIndex, searchDistanceM * 0.35, cell.axis ?? principal))
    .sort((a, b) => a.widthM - b.widthM);

  const selected: WidthFeatureCandidate[] = [];
  for (const cell of raw) {
    if (selected.some((candidate) => distanceM(candidate.center, cell.center) < metrics.longestDimensionM * 0.02)) continue;
    const axis = cell.axis ?? principal;
    const expansion = expansionRatios(cell, centerlineIndex, axis, searchDistanceM);
    if (!Number.isFinite(expansion.left) || !Number.isFinite(expansion.right)) continue;
    if (expansion.left < 1.45 || expansion.right < 1.45) continue;
    const endpoints = opposingShoreEndpoints(cell.center, polygon);
    if (!endpoints) continue;
    const endpointA = nearestPointOnRing(endpoints.a, polygon.exterior);
    const endpointB = nearestPointOnRing(endpoints.b, polygon.exterior);
    if (
      !pointInWaterOrBoundary(cell.center, polygon, waterToleranceM) ||
      !segmentSamplesInsideWater(endpointA, endpointB, polygon, 8, waterToleranceM)
    ) {
      continue;
    }
    const endpointWidthM = distanceM(endpointA, endpointB);
    if (endpointWidthM <= raster.cellSizeM * 1.25) continue;
    const widthM = Math.max(cell.widthM, endpointWidthM);
    const widthToAverage = metrics.averageLakeWidthM > 0 ? widthM / metrics.averageLakeWidthM : Infinity;
    const gateAxis = normalize({ x: endpointB.x - endpointA.x, y: endpointB.y - endpointA.y }) ?? (axis === 'x' ? { x: 0, y: 1 } : { x: 1, y: 0 });
    const travelAxis = { x: -gateAxis.y, y: gateAxis.x };
    const approach = approachAreaMetrics({
      center: cell.center,
      travelAxis,
      widthM,
      raster,
      waterCellIndex,
      searchDistanceM,
      lakeAreaSqM: metrics.areaSqM,
    });
    const connector = connectorBasinMetrics({
      center: cell.center,
      endpointA,
      endpointB,
      travelAxis,
      widthM,
      raster,
      lakeAreaSqM: metrics.areaSqM,
    });
    const weakerExpansionRatio = Math.min(expansion.left, expansion.right);
    const strongerExpansionRatio = Math.max(expansion.left, expansion.right);
    const expansionBalance = weakerExpansionRatio / Math.max(1, strongerExpansionRatio);
    const constrictionKind = classifyConstrictionKind({
      widthM,
      widthToAverage,
      longestDimensionM: metrics.longestDimensionM,
      weakerExpansionRatio,
      expansionBalance,
      approach,
      connector,
    });
    const mediumTravelValue = constrictionKind !== 'micro_pinch' && constrictionKind !== 'saddle_gap' ? 1 : 0;
    const scoreDampener = constrictionKind === 'micro_pinch' ? 0.03 : constrictionKind === 'pinch_point' ? 0.78 : 1;
    const confidence = clamp(
      0.45 * clamp((Math.min(expansion.left, expansion.right) - 1) / 2.2, 0, 1) +
        0.35 * clamp(1 - widthToAverage, 0, 1) +
        0.12 * clamp(cell.distanceToShoreM / Math.max(raster.cellSizeM, 1), 0, 1) +
        0.08 * mediumTravelValue,
      0,
      1,
    );
    const travelValueScore = clamp(
      0.35 * clamp((weakerExpansionRatio - 1.35) / 1.8, 0, 1) +
        0.28 * approach.sideAreaBalance +
        0.22 * clamp(approach.minSideLakeAreaRatio / 0.008, 0, 1) +
        0.15 * clamp((0.58 - widthToAverage) / 0.34, 0, 1),
      0,
      1,
    );
    selected.push({
      endpointA,
      endpointB,
      center: cell.center,
      widthM,
      leftExpansionRatio: expansion.left,
      rightExpansionRatio: expansion.right,
      confidence,
      score: confidence * Math.min(expansion.left, expansion.right) * (0.55 + travelValueScore) * scoreDampener / Math.max(widthToAverage, 0.05),
      qaFlags: [
        'approx_width_field',
        'preliminary_raster_width_field',
        ...(constrictionKind === 'neck' ? ['premium_neck_connector'] : []),
        ...(constrictionKind === 'pinch_point' ? ['valuable_pinch_point'] : []),
        ...(constrictionKind === 'micro_pinch' ? ['micro_pinch_low_value', 'micro_pinch_score_dampened'] : []),
        ...(approach.terminalBackwaterRejected ? ['terminal_backwater_medium_constriction_rejected'] : []),
      ],
      metrics: {
        widthM,
        widthToAverage,
        leftExpansionRatio: expansion.left,
        rightExpansionRatio: expansion.right,
        weakerExpansionRatio,
        strongerExpansionRatio,
        expansionBalance,
        cellSizeM: raster.cellSizeM,
        transectAxis: axis,
        constrictionKind,
        constrictionTravelValueScore: travelValueScore,
        mediumConstrictionHasTravelValue: mediumTravelValue >= 1,
        scoreDampener,
        leftApproachAreaSqM: approach.leftApproachAreaSqM,
        rightApproachAreaSqM: approach.rightApproachAreaSqM,
        minSideAreaSqM: approach.minSideAreaSqM,
        maxSideAreaSqM: approach.maxSideAreaSqM,
        sideAreaBalance: approach.sideAreaBalance,
        minSideLakeAreaRatio: approach.minSideLakeAreaRatio,
        approachSampleCellCount: approach.approachSampleCellCount,
        terminalBackwaterRejected: approach.terminalBackwaterRejected,
        leftConnectorBasinAreaSqM: connector.leftConnectorBasinAreaSqM,
        rightConnectorBasinAreaSqM: connector.rightConnectorBasinAreaSqM,
        minConnectorBasinAreaSqM: connector.minConnectorBasinAreaSqM,
        maxConnectorBasinAreaSqM: connector.maxConnectorBasinAreaSqM,
        minConnectorBasinLakeAreaRatio: connector.minConnectorBasinLakeAreaRatio,
        connectorBasinBalance: connector.connectorBasinBalance,
        terminalPocketConnector: connector.terminalPocketConnector,
        connectorBasinInconclusive: connector.connectorBasinInconclusive,
        connectorBasinSplitSucceeded: connector.connectorBasinSplitSucceeded,
        connectorBasinSplitFailed: connector.connectorBasinSplitFailed,
        connectorBasinApproximation: connector.connectorBasinApproximation,
      },
    });
    if (selected.length >= 64) break;
  }

  const necks: WaterReaderNeckCandidate[] = [];
  const saddles: WaterReaderSaddleCandidate[] = [];
  for (const candidate of selected) {
    const widthToAverage = metrics.averageLakeWidthM > 0 ? candidate.widthM / metrics.averageLakeWidthM : Infinity;
    if (
      widthToAverage < 0.25 &&
      candidate.leftExpansionRatio >= 2 &&
      candidate.rightExpansionRatio >= 2
    ) {
      necks.push({ ...candidate, featureClass: 'neck' });
    } else if (
      widthToAverage >= 0.25 &&
      widthToAverage <= 0.5 &&
      candidate.leftExpansionRatio >= 1.5 &&
      candidate.rightExpansionRatio >= 1.5 &&
      (
        candidate.metrics.mediumConstrictionHasTravelValue === true ||
        (
          numericMetric(candidate.metrics.weakerExpansionRatio) >= 1.5 &&
          numericMetric(candidate.metrics.expansionBalance) >= 0.35
        )
      )
    ) {
      saddles.push({ ...candidate, featureClass: 'saddle' });
    }
  }
  const gapSaddles = detectSaddleGapCandidates({
    polygon,
    metrics,
    raster,
    waterCellIndex,
    searchDistanceM,
    waterToleranceM,
    islands: context.islands ?? [],
    points: context.points ?? [],
  });

  return {
    necks: dedupeWidthFeatures(necks),
    saddles: dedupeWidthFeatures([...saddles, ...gapSaddles]),
  };
}

export function detectPointSeededNeckCandidates(
  preprocess: WaterReaderPreprocessResult,
  points: WaterReaderPointCandidate[],
): WaterReaderNeckCandidate[] {
  const polygon = preprocess.primaryPolygon;
  const metrics = preprocess.metrics;
  if (!polygon || !metrics || polygon.exterior.length < 4) return [];
  const waterToleranceM = clamp(metrics.longestDimensionM * 0.0015, 5, 30);
  const maxSearchM = clamp(metrics.longestDimensionM * 0.09, 120, 700);
  const candidates: WaterReaderNeckCandidate[] = [];

  for (const point of points) {
    if (point.featureClass && point.featureClass !== 'main_lake_point') continue;
    const orientationLength = Math.hypot(point.orientationVector.x, point.orientationVector.y);
    if (orientationLength < 0.2) continue;
    const concaveHits = numericMetric(point.metrics.concaveScaleHits);
    const baseToTipM = distanceM(point.baseMidpoint, point.tip);
    if (
      point.confidence < 0.8 ||
      concaveHits < 4 ||
      baseToTipM < metrics.longestDimensionM * 0.025 ||
      point.protrusionLengthM < metrics.longestDimensionM * 0.03
    ) continue;

    const ray = pointSeededOppositeShoreRay({
      tip: point.tip,
      direction: { x: point.orientationVector.x / orientationLength, y: point.orientationVector.y / orientationLength },
      polygon,
      maxSearchM,
      waterToleranceM,
    });
    if (!ray) continue;
    const endpointA = nearestPointOnRing(point.tip, polygon.exterior);
    const endpointB = nearestPointOnRing(ray.point, polygon.exterior);
    const widthM = distanceM(endpointA, endpointB);
    const widthToAverage = metrics.averageLakeWidthM > 0 ? widthM / metrics.averageLakeWidthM : Infinity;
    if (
      widthM < 40 ||
      widthM > metrics.longestDimensionM * 0.055 ||
      widthToAverage > 0.14 ||
      point.protrusionLengthM / Math.max(widthM, 1) < 0.75 ||
      !segmentSamplesInsideWater(endpointA, endpointB, polygon, 10, waterToleranceM)
    ) continue;

    const expansionRatio = clamp(point.protrusionLengthM / Math.max(widthM, 1) * 2.35, 2.2, 6.5);
    const confidence = clamp(0.72 + point.confidence * 0.18 + clamp((0.14 - widthToAverage) / 0.14, 0, 1) * 0.1, 0, 0.94);
    candidates.push({
      featureClass: 'neck',
      endpointA,
      endpointB,
      center: midpoint(endpointA, endpointB),
      widthM,
      leftExpansionRatio: expansionRatio,
      rightExpansionRatio: expansionRatio,
      confidence,
      score: confidence * expansionRatio / Math.max(widthToAverage, 0.05),
      qaFlags: [...point.qaFlags, 'point_seeded_neck_rescue', 'opposite_shoreline_ray_confirmed', 'premium_neck_connector'],
      metrics: {
        seededFromPoint: true,
        constrictionKind: 'neck',
        premiumNeckConnector: true,
        sourcePointConfidence: point.confidence,
        sourcePointProtrusionLengthM: point.protrusionLengthM,
        sourcePointBaseToTipM: baseToTipM,
        widthM,
        widthToAverage,
        leftExpansionRatio: expansionRatio,
        rightExpansionRatio: expansionRatio,
        oppositeShoreRayDistanceM: ray.distanceM,
      },
    });
  }

  return dedupeWidthFeatures(candidates);
}

export function detectPointSeededPinchCandidates(
  preprocess: WaterReaderPreprocessResult,
  points: WaterReaderPointCandidate[],
): WaterReaderNeckCandidate[] {
  const polygon = preprocess.primaryPolygon;
  const metrics = preprocess.metrics;
  if (!polygon || !metrics || polygon.exterior.length < 4) return [];
  const waterToleranceM = clamp(metrics.longestDimensionM * 0.0015, 5, 30);
  const maxSearchM = clamp(metrics.longestDimensionM * 0.11, 140, 850);
  const candidates: WaterReaderNeckCandidate[] = [];

  for (const point of points) {
    if (point.featureClass && point.featureClass !== 'main_lake_point') continue;
    const orientationLength = Math.hypot(point.orientationVector.x, point.orientationVector.y);
    if (orientationLength < 0.2) continue;
    const baseToTipM = distanceM(point.baseMidpoint, point.tip);
    if (
      point.confidence < 0.7 ||
      baseToTipM < metrics.longestDimensionM * 0.018 ||
      point.protrusionLengthM < metrics.longestDimensionM * 0.022
    ) continue;

    const direction = { x: point.orientationVector.x / orientationLength, y: point.orientationVector.y / orientationLength };
    const ray = pointSeededOppositeShoreRay({
      tip: point.tip,
      direction,
      polygon,
      maxSearchM,
      waterToleranceM,
    });
    if (!ray) continue;
    const endpointA = nearestPointOnRing(point.tip, polygon.exterior);
    const endpointB = nearestPointOnRing(ray.point, polygon.exterior);
    const widthM = distanceM(endpointA, endpointB);
    const widthToAverage = metrics.averageLakeWidthM > 0 ? widthM / metrics.averageLakeWidthM : Infinity;
    if (
      widthM < 35 ||
      widthM > Math.min(150, metrics.longestDimensionM * 0.075) ||
      widthToAverage < 0.035 ||
      widthToAverage > 0.18 ||
      point.protrusionLengthM / Math.max(widthM, 1) < 0.45 ||
      !segmentSamplesInsideWater(endpointA, endpointB, polygon, 10, waterToleranceM)
    ) continue;

    const expansionRatio = clamp(point.protrusionLengthM / Math.max(widthM, 1) * 1.75, 1.65, 4.6);
    const confidence = clamp(0.62 + point.confidence * 0.18 + clamp((0.18 - widthToAverage) / 0.18, 0, 1) * 0.1, 0, 0.86);
    candidates.push({
      featureClass: 'neck',
      endpointA,
      endpointB,
      center: midpoint(endpointA, endpointB),
      widthM,
      leftExpansionRatio: expansionRatio,
      rightExpansionRatio: expansionRatio,
      confidence,
      score: confidence * expansionRatio / Math.max(widthToAverage, 0.05),
      qaFlags: [...point.qaFlags, 'point_seeded_pinch_rescue', 'opposite_shoreline_ray_confirmed', 'valuable_pinch_point'],
      metrics: {
        seededFromPoint: true,
        seededFromPointPinch: true,
        constrictionKind: 'pinch_point',
        sourcePointConfidence: point.confidence,
        sourcePointProtrusionLengthM: point.protrusionLengthM,
        sourcePointBaseToTipM: baseToTipM,
        widthM,
        widthToAverage,
        leftExpansionRatio: expansionRatio,
        rightExpansionRatio: expansionRatio,
        oppositeShoreRayDistanceM: ray.distanceM,
      },
    });
  }

  return dedupeWidthFeatures(candidates);
}

function numericMetric(value: number | string | boolean | null | undefined): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function detectSaddleGapCandidates(params: {
  polygon: PolygonM;
  metrics: NonNullable<WaterReaderPreprocessResult['metrics']>;
  raster: { waterCells: RasterCell[]; cellSizeM: number; nx: number; ny: number };
  waterCellIndex: RasterCellSpatialIndex;
  searchDistanceM: number;
  waterToleranceM: number;
  islands: WaterReaderIslandFeature[];
  points: WaterReaderPointCandidate[];
}): WaterReaderSaddleCandidate[] {
  const candidates: WaterReaderSaddleCandidate[] = [];
  const maxIslands = params.islands.slice(0, 8);
  for (const island of maxIslands) {
    const mainland = nearestRingPair(island.ring, params.polygon.exterior);
    if (mainland) {
      const candidate = buildSaddleGapCandidate({
        ...params,
        endpointA: mainland.a,
        endpointB: mainland.b,
        saddleGapType: 'island_mainland_gap',
        sourceScore: clamp(island.areaSqM / Math.max(1, params.metrics.areaSqM * 0.01), 0.25, 3),
      });
      if (candidate) candidates.push(candidate);
    }
  }

  for (let i = 0; i < maxIslands.length; i++) {
    for (let j = i + 1; j < maxIslands.length; j++) {
      const pair = nearestRingPair(maxIslands[i]!.ring, maxIslands[j]!.ring);
      if (!pair) continue;
      const candidate = buildSaddleGapCandidate({
        ...params,
        endpointA: pair.a,
        endpointB: pair.b,
        saddleGapType: 'island_island_gap',
        sourceScore: clamp((maxIslands[i]!.areaSqM + maxIslands[j]!.areaSqM) / Math.max(1, params.metrics.areaSqM * 0.015), 0.25, 3),
      });
      if (candidate) candidates.push(candidate);
    }
  }

  const strongPoints = params.points
    .filter((point) => point.confidence >= 0.72 && point.featureClass !== 'secondary_point')
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
  const pointSearchM = clamp(params.metrics.longestDimensionM * 0.14, 140, 900);
  for (const point of strongPoints) {
    const orientationLength = Math.hypot(point.orientationVector.x, point.orientationVector.y);
    if (orientationLength < 0.2) continue;
    const direction = { x: point.orientationVector.x / orientationLength, y: point.orientationVector.y / orientationLength };
    const hit = pointSeededOppositeShoreRay({
      tip: point.tip,
      direction,
      polygon: params.polygon,
      maxSearchM: pointSearchM,
      waterToleranceM: params.waterToleranceM,
    });
    if (!hit) continue;
    const candidate = buildSaddleGapCandidate({
      ...params,
      endpointA: nearestPointOnRing(point.tip, params.polygon.exterior),
      endpointB: nearestPointOnRing(hit.point, params.polygon.exterior),
      saddleGapType: 'point_to_shore_gap',
      sourceScore: clamp(point.confidence + point.protrusionLengthM / Math.max(hit.distanceM, 1), 0.25, 3),
    });
    if (candidate) candidates.push(candidate);
  }

  for (let i = 0; i < strongPoints.length; i++) {
    for (let j = i + 1; j < strongPoints.length; j++) {
      const a = strongPoints[i]!;
      const b = strongPoints[j]!;
      const gapVector = normalize({ x: b.tip.x - a.tip.x, y: b.tip.y - a.tip.y });
      if (!gapVector) continue;
      const facesGapA = dot(a.orientationVector, gapVector);
      const facesGapB = dot(b.orientationVector, { x: -gapVector.x, y: -gapVector.y });
      if (facesGapA < 0.22 || facesGapB < 0.22) continue;
      const candidate = buildSaddleGapCandidate({
        ...params,
        endpointA: nearestPointOnRing(a.tip, params.polygon.exterior),
        endpointB: nearestPointOnRing(b.tip, params.polygon.exterior),
        saddleGapType: 'point_to_point_gap',
        sourceScore: clamp((a.confidence + b.confidence) * 0.5 + (facesGapA + facesGapB) * 0.5, 0.25, 3),
      });
      if (candidate) candidates.push(candidate);
    }
  }

  candidates.push(...detectShorelineSaddleProbeCandidates(params));

  return dedupeWidthFeatures(candidates).slice(0, 4);
}

function detectShorelineSaddleProbeCandidates(params: {
  polygon: PolygonM;
  metrics: NonNullable<WaterReaderPreprocessResult['metrics']>;
  raster: { waterCells: RasterCell[]; cellSizeM: number; nx: number; ny: number };
  waterCellIndex: RasterCellSpatialIndex;
  searchDistanceM: number;
  waterToleranceM: number;
}): WaterReaderSaddleCandidate[] {
  const ring = params.polygon.exterior;
  if (ring.length < 12) return [];

  const candidates: WaterReaderSaddleCandidate[] = [];
  const targetSamples = 240;
  const step = Math.max(1, Math.floor(ring.length / targetSamples));
  const maxSearchM = Math.min(
    params.metrics.longestDimensionM * 0.085,
    Math.max(140, params.metrics.averageLakeWidthM * 0.72),
  );
  const minSpacingM = Math.max(160, params.metrics.averageLakeWidthM * 0.18, params.metrics.longestDimensionM * 0.012);
  const waterProbeM = Math.max(8, params.waterToleranceM * 1.35);

  for (let i = 0; i < ring.length; i += step) {
    const point = ring[i]!;
    const prev = ring[(i - step + ring.length) % ring.length]!;
    const next = ring[(i + step) % ring.length]!;
    const tangent = normalize({ x: next.x - prev.x, y: next.y - prev.y });
    if (!tangent) continue;

    const normals = [
      { x: -tangent.y, y: tangent.x },
      { x: tangent.y, y: -tangent.x },
    ];
    for (const direction of normals) {
      const waterProbe = { x: point.x + direction.x * waterProbeM, y: point.y + direction.y * waterProbeM };
      if (!pointInWaterOrBoundary(waterProbe, params.polygon, params.waterToleranceM)) continue;
      const hit = rayRingIntersection(point, direction, ring);
      if (!hit) continue;
      const hitDistanceM = distanceM(point, hit);
      if (hitDistanceM < Math.max(45, params.metrics.longestDimensionM * 0.006) || hitDistanceM > maxSearchM) continue;
      if (candidates.some((candidate) => distanceM(candidate.center, midpoint(point, hit)) < minSpacingM)) continue;

      const widthToAverage = params.metrics.averageLakeWidthM > 0 ? hitDistanceM / params.metrics.averageLakeWidthM : Infinity;
      const candidate = buildSaddleGapCandidate({
        ...params,
        endpointA: nearestPointOnRing(point, ring),
        endpointB: nearestPointOnRing(hit, ring),
        saddleGapType: 'shoreline_opposing_bank_gap',
        saddleProbeType: widthToAverage >= 0.32 ? 'arm_mouth_gap' : 'opposing_bank_gap',
        sourceScore: clamp(0.65 + widthToAverage * 1.25, 0.25, 2.2),
      });
      if (candidate) candidates.push(candidate);
      break;
    }
    if (candidates.length >= 8) break;
  }

  return dedupeWidthFeatures(candidates).slice(0, 6);
}

function buildSaddleGapCandidate(params: {
  polygon: PolygonM;
  metrics: NonNullable<WaterReaderPreprocessResult['metrics']>;
  raster: { waterCells: RasterCell[]; cellSizeM: number; nx: number; ny: number };
  waterCellIndex: RasterCellSpatialIndex;
  searchDistanceM: number;
  waterToleranceM: number;
  endpointA: PointM;
  endpointB: PointM;
  saddleGapType: string;
  saddleProbeType?: string;
  sourceScore: number;
}): WaterReaderSaddleCandidate | null {
  const widthM = distanceM(params.endpointA, params.endpointB);
  const widthToAverage = params.metrics.averageLakeWidthM > 0 ? widthM / params.metrics.averageLakeWidthM : Infinity;
  if (
    widthM < Math.max(45, params.metrics.longestDimensionM * 0.006) ||
    widthM > Math.min(params.metrics.longestDimensionM * 0.085, Math.max(90, params.metrics.averageLakeWidthM * 0.7)) ||
    widthToAverage < 0.18 ||
    widthToAverage > 0.62
  ) {
    return null;
  }
  const center = midpoint(params.endpointA, params.endpointB);
  if (
    !pointInWaterOrBoundary(center, params.polygon, params.waterToleranceM) ||
    !segmentSamplesInsideWater(params.endpointA, params.endpointB, params.polygon, 10, params.waterToleranceM)
  ) {
    return null;
  }
  const gapAxis = normalize({ x: params.endpointB.x - params.endpointA.x, y: params.endpointB.y - params.endpointA.y });
  if (!gapAxis) return null;
  const travelAxis = { x: -gapAxis.y, y: gapAxis.x };
  const approach = approachAreaMetrics({
    center,
    travelAxis,
    widthM,
    raster: params.raster,
    waterCellIndex: params.waterCellIndex,
    searchDistanceM: params.searchDistanceM,
    lakeAreaSqM: params.metrics.areaSqM,
  });
  if (
    approach.terminalBackwaterRejected ||
    approach.sideAreaBalance < 0.28 ||
    approach.minSideLakeAreaRatio < 0.0022 ||
    approach.minSideAreaSqM < Math.max(widthM * widthM * 2.4, params.metrics.areaSqM * 0.0014)
  ) {
    return null;
  }
  const leftExpansionRatio = clamp(Math.sqrt(approach.leftApproachAreaSqM) / Math.max(widthM, 1), 1.25, 7);
  const rightExpansionRatio = clamp(Math.sqrt(approach.rightApproachAreaSqM) / Math.max(widthM, 1), 1.25, 7);
  const weakerExpansionRatio = Math.min(leftExpansionRatio, rightExpansionRatio);
  const strongerExpansionRatio = Math.max(leftExpansionRatio, rightExpansionRatio);
  const expansionBalance = weakerExpansionRatio / Math.max(1, strongerExpansionRatio);
  if (weakerExpansionRatio < 1.55 || expansionBalance < 0.32) return null;
  const travelValueScore = clamp(
    0.3 * clamp((weakerExpansionRatio - 1.35) / 2.1, 0, 1) +
      0.3 * approach.sideAreaBalance +
      0.25 * clamp(approach.minSideLakeAreaRatio / 0.009, 0, 1) +
      0.15 * params.sourceScore / 3,
    0,
    1,
  );
  const confidence = clamp(
    0.48 + travelValueScore * 0.28 + clamp((0.62 - widthToAverage) / 0.44, 0, 1) * 0.12 + clamp((weakerExpansionRatio - 1.5) / 2.5, 0, 1) * 0.12,
    0,
    0.9,
  );
  return {
    featureClass: 'saddle',
    endpointA: params.endpointA,
    endpointB: params.endpointB,
    center,
    widthM,
    leftExpansionRatio,
    rightExpansionRatio,
    confidence,
    score: confidence * (0.8 + travelValueScore) * weakerExpansionRatio * 3.2 / Math.max(widthToAverage, 0.08),
    qaFlags: [
      'saddle_gap_detector',
      params.saddleGapType,
      ...(params.saddleProbeType ? ['saddle_gap_probe', params.saddleProbeType] : []),
    ],
    metrics: {
      widthM,
      widthToAverage,
      leftExpansionRatio,
      rightExpansionRatio,
      weakerExpansionRatio,
      strongerExpansionRatio,
      expansionBalance,
      constrictionKind: 'saddle_gap',
      saddleGapType: params.saddleGapType,
      saddleProbeType: params.saddleProbeType ?? null,
      saddleProbeRejectReason: params.saddleProbeType ? 'accepted' : null,
      constrictionTravelValueScore: travelValueScore,
      leftApproachAreaSqM: approach.leftApproachAreaSqM,
      rightApproachAreaSqM: approach.rightApproachAreaSqM,
      minSideAreaSqM: approach.minSideAreaSqM,
      maxSideAreaSqM: approach.maxSideAreaSqM,
      sideAreaBalance: approach.sideAreaBalance,
      minSideLakeAreaRatio: approach.minSideLakeAreaRatio,
      approachSampleCellCount: approach.approachSampleCellCount,
      terminalBackwaterRejected: approach.terminalBackwaterRejected,
    },
  };
}

function pointSeededOppositeShoreRay(params: {
  tip: PointM;
  direction: PointM;
  polygon: PolygonM;
  maxSearchM: number;
  waterToleranceM: number;
}): { point: PointM; distanceM: number } | null {
  const waterProbe = {
    x: params.tip.x + params.direction.x * Math.max(6, params.waterToleranceM),
    y: params.tip.y + params.direction.y * Math.max(6, params.waterToleranceM),
  };
  if (!pointInWaterOrBoundary(waterProbe, params.polygon, params.waterToleranceM)) return null;
  const hit = rayRingIntersection(params.tip, params.direction, params.polygon.exterior);
  if (!hit) return null;
  const rayDistanceM = distanceM(params.tip, hit);
  if (rayDistanceM < Math.max(40, params.waterToleranceM * 2) || rayDistanceM > params.maxSearchM) return null;
  return { point: hit, distanceM: rayDistanceM };
}

function rasterizeWaterMask(polygon: PolygonM, longestDimensionM: number): {
  waterCells: RasterCell[];
  cellSizeM: number;
  nx: number;
  ny: number;
} {
  const bounds = bboxM(polygon.exterior);
  let cellSizeM = clamp(longestDimensionM / 650, 2, 25);
  while (
    Math.ceil((bounds.maxX - bounds.minX) / cellSizeM) > 900 ||
    Math.ceil((bounds.maxY - bounds.minY) / cellSizeM) > 900
  ) {
    cellSizeM *= 1.2;
  }
  const nx = Math.max(1, Math.ceil((bounds.maxX - bounds.minX) / cellSizeM));
  const ny = Math.max(1, Math.ceil((bounds.maxY - bounds.minY) / cellSizeM));
  const waterMask = buildWaterMask({ polygon, bounds, nx, ny, cellSizeM });
  const distanceCells = chamferDistanceToLand(waterMask.mask, nx, ny);
  const waterCells: RasterCell[] = [];
  for (let index = 0; index < waterMask.mask.length; index++) {
    if (waterMask.mask[index] !== 1) continue;
    const ix = index % nx;
    const iy = Math.floor(index / nx);
    const center = {
      x: bounds.minX + (ix + 0.5) * cellSizeM,
      y: bounds.minY + (iy + 0.5) * cellSizeM,
    };
    const distanceToShoreM = Math.max(cellSizeM * 0.5, distanceCells[index]! * cellSizeM);
    waterCells.push({ ix, iy, center, distanceToShoreM, widthM: distanceToShoreM * 2 });
  }
  return { waterCells, cellSizeM, nx, ny };
}

function buildWaterMask(params: {
  polygon: PolygonM;
  bounds: WaterMask['bounds'];
  nx: number;
  ny: number;
  cellSizeM: number;
}): WaterMask {
  const { polygon, bounds, nx, ny, cellSizeM } = params;
  const mask = new Uint8Array(nx * ny);
  for (let iy = 0; iy < ny; iy++) {
    const y = bounds.minY + (iy + 0.5) * cellSizeM;
    for (const [startX, endX] of scanlineIntervals(polygon.exterior, y)) {
      fillMaskInterval(mask, bounds, nx, iy, cellSizeM, startX, endX, 1);
    }
    for (const hole of polygon.holes) {
      for (const [startX, endX] of scanlineIntervals(hole, y)) {
        fillMaskInterval(mask, bounds, nx, iy, cellSizeM, startX, endX, 0);
      }
    }
  }
  return { mask, nx, ny, bounds, cellSizeM };
}

function scanlineIntervals(ring: RingM, y: number): Array<[number, number]> {
  const xs: number[] = [];
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i]!;
    const b = ring[(i + 1) % ring.length]!;
    if ((a.y > y) === (b.y > y)) continue;
    const x = ((b.x - a.x) * (y - a.y)) / (b.y - a.y || 1e-12) + a.x;
    if (Number.isFinite(x)) xs.push(x);
  }
  xs.sort((a, b) => a - b);
  const intervals: Array<[number, number]> = [];
  for (let i = 0; i + 1 < xs.length; i += 2) {
    const start = xs[i]!;
    const end = xs[i + 1]!;
    if (end > start) intervals.push([start, end]);
  }
  return intervals;
}

function fillMaskInterval(
  mask: Uint8Array,
  bounds: WaterMask['bounds'],
  nx: number,
  iy: number,
  cellSizeM: number,
  startX: number,
  endX: number,
  value: 0 | 1,
) {
  const startIx = Math.max(0, Math.ceil((startX - bounds.minX) / cellSizeM - 0.5));
  const endIx = Math.min(nx - 1, Math.floor((endX - bounds.minX) / cellSizeM - 0.5));
  for (let ix = startIx; ix <= endIx; ix++) mask[iy * nx + ix] = value;
}

function chamferDistanceToLand(mask: Uint8Array, nx: number, ny: number): Float64Array {
  const distances = new Float64Array(mask.length);
  const diagonal = Math.SQRT2;
  for (let iy = 0; iy < ny; iy++) {
    for (let ix = 0; ix < nx; ix++) {
      const index = iy * nx + ix;
      distances[index] = mask[index] === 1 && ix > 0 && iy > 0 && ix < nx - 1 && iy < ny - 1 ? Infinity : 0;
    }
  }
  for (let iy = 0; iy < ny; iy++) {
    for (let ix = 0; ix < nx; ix++) {
      const index = iy * nx + ix;
      if (distances[index] === 0) continue;
      relaxDistance(distances, nx, ny, ix, iy, -1, 0, 1);
      relaxDistance(distances, nx, ny, ix, iy, 0, -1, 1);
      relaxDistance(distances, nx, ny, ix, iy, -1, -1, diagonal);
      relaxDistance(distances, nx, ny, ix, iy, 1, -1, diagonal);
    }
  }
  for (let iy = ny - 1; iy >= 0; iy--) {
    for (let ix = nx - 1; ix >= 0; ix--) {
      const index = iy * nx + ix;
      if (distances[index] === 0) continue;
      relaxDistance(distances, nx, ny, ix, iy, 1, 0, 1);
      relaxDistance(distances, nx, ny, ix, iy, 0, 1, 1);
      relaxDistance(distances, nx, ny, ix, iy, 1, 1, diagonal);
      relaxDistance(distances, nx, ny, ix, iy, -1, 1, diagonal);
    }
  }
  return distances;
}

function relaxDistance(
  distances: Float64Array,
  nx: number,
  ny: number,
  ix: number,
  iy: number,
  dx: number,
  dy: number,
  weight: number,
) {
  const ox = ix + dx;
  const oy = iy + dy;
  if (ox < 0 || oy < 0 || ox >= nx || oy >= ny) return;
  const index = iy * nx + ix;
  const other = oy * nx + ox;
  const candidate = distances[other]! + weight;
  if (candidate < distances[index]!) distances[index] = candidate;
}

function medialAxisLikeCells(cells: RasterCell[], cellSizeM: number): RasterCell[] {
  const byKey = new Map(cells.map((cell) => [`${cell.ix}:${cell.iy}`, cell] as const));
  return cells.filter((cell) => {
    if (cell.distanceToShoreM < cellSizeM * 0.75) return false;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        const neighbor = byKey.get(`${cell.ix + dx}:${cell.iy + dy}`);
        if (neighbor && neighbor.distanceToShoreM > cell.distanceToShoreM + cellSizeM * 0.2) return false;
      }
    }
    return true;
  });
}

function transectWidthCells(cells: RasterCell[], cellSizeM: number, axis: 'x' | 'y'): RasterCell[] {
  const groups = new Map<number, RasterCell[]>();
  for (const cell of cells) {
    const key = axis === 'x' ? cell.ix : cell.iy;
    const group = groups.get(key);
    if (group) group.push(cell);
    else groups.set(key, [cell]);
  }
  const out: RasterCell[] = [];
  for (const [key, group] of groups) {
    const sorted = [...group].sort((a, b) => (axis === 'x' ? a.iy - b.iy : a.ix - b.ix));
    const runs: RasterCell[][] = [];
    let current: RasterCell[] = [];
    for (const cell of sorted) {
      const prev = current[current.length - 1];
      const adjacent = !prev || (axis === 'x' ? cell.iy === prev.iy + 1 : cell.ix === prev.ix + 1);
      if (!adjacent) {
        if (current.length > 0) runs.push(current);
        current = [];
      }
      current.push(cell);
    }
    if (current.length > 0) runs.push(current);
    const run = runs.sort((a, b) => b.length - a.length)[0];
    if (!run || run.length < 2) continue;
    const first = run[0]!;
    const last = run[run.length - 1]!;
    const widthM =
      axis === 'x'
        ? Math.abs(last.center.y - first.center.y) + cellSizeM
        : Math.abs(last.center.x - first.center.x) + cellSizeM;
    const center = {
      x: axis === 'x' ? first.center.x : (first.center.x + last.center.x) / 2,
      y: axis === 'x' ? (first.center.y + last.center.y) / 2 : first.center.y,
    };
    out.push({
      ix: axis === 'x' ? key : Math.round((first.ix + last.ix) / 2),
      iy: axis === 'x' ? Math.round((first.iy + last.iy) / 2) : key,
      center,
      distanceToShoreM: widthM / 2,
      widthM,
      axis,
    });
  }
  return out;
}

function principalAxis(bounds: { minX: number; minY: number; maxX: number; maxY: number }): 'x' | 'y' {
  return bounds.maxX - bounds.minX >= bounds.maxY - bounds.minY ? 'x' : 'y';
}

function isLocalWidthMinimum(cell: RasterCell, cells: RasterCellSpatialIndex, radiusM: number, axis: 'x' | 'y'): boolean {
  const centerProjection = axis === 'x' ? cell.center.x : cell.center.y;
  const neighbors = cells.query({
    minX: axis === 'x' ? centerProjection - radiusM : cell.center.x - radiusM * 0.45,
    maxX: axis === 'x' ? centerProjection + radiusM : cell.center.x + radiusM * 0.45,
    minY: axis === 'x' ? cell.center.y - radiusM * 0.45 : centerProjection - radiusM,
    maxY: axis === 'x' ? cell.center.y + radiusM * 0.45 : centerProjection + radiusM,
  }).filter((other) => {
    const p = axis === 'x' ? other.center.x : other.center.y;
    const cross = axis === 'x' ? Math.abs(other.center.y - cell.center.y) : Math.abs(other.center.x - cell.center.x);
    return Math.abs(p - centerProjection) <= radiusM && cross <= radiusM * 0.45;
  });
  if (neighbors.length < 3) return false;
  const minWidth = Math.min(...neighbors.map((other) => other.widthM));
  return cell.widthM <= minWidth * 1.08;
}

function expansionRatios(cell: RasterCell, cells: RasterCellSpatialIndex, axis: 'x' | 'y', searchDistanceM: number): {
  left: number;
  right: number;
} {
  const centerProjection = axis === 'x' ? cell.center.x : cell.center.y;
  const crossCenter = axis === 'x' ? cell.center.y : cell.center.x;
  const sideMax = (dir: -1 | 1) => {
    const minProjection = centerProjection + searchDistanceM * 0.25 * dir;
    const maxProjection = centerProjection + searchDistanceM * dir;
    const rangeMin = Math.min(minProjection, maxProjection);
    const rangeMax = Math.max(minProjection, maxProjection);
    const widths = cells
      .query({
        minX: axis === 'x' ? rangeMin : crossCenter - searchDistanceM * 0.55,
        maxX: axis === 'x' ? rangeMax : crossCenter + searchDistanceM * 0.55,
        minY: axis === 'x' ? crossCenter - searchDistanceM * 0.55 : rangeMin,
        maxY: axis === 'x' ? crossCenter + searchDistanceM * 0.55 : rangeMax,
      })
      .filter((other) => {
        const projection = axis === 'x' ? other.center.x : other.center.y;
        const cross = axis === 'x' ? other.center.y : other.center.x;
        const along = (projection - centerProjection) * dir;
        return along >= searchDistanceM * 0.25 && along <= searchDistanceM && Math.abs(cross - crossCenter) <= searchDistanceM * 0.55;
      })
      .map((other) => other.widthM);
    return widths.length > 0 ? Math.max(...widths) / Math.max(cell.widthM, 1e-9) : NaN;
  };
  return { left: sideMax(-1), right: sideMax(1) };
}

function classifyConstrictionKind(params: {
  widthM: number;
  widthToAverage: number;
  longestDimensionM: number;
  weakerExpansionRatio: number;
  expansionBalance: number;
  approach: ApproachAreaMetrics;
  connector: ConnectorBasinMetrics;
}): 'neck' | 'pinch_point' | 'micro_pinch' | 'saddle_gap' {
  const tinyAbsoluteWidth = params.widthM < Math.max(24, params.longestDimensionM * 0.0045);
  const veryNarrowRelative = params.widthToAverage > 0 && params.widthToAverage < 0.035;
  const connectorSucceeded = params.connector.connectorBasinSplitSucceeded && !params.connector.connectorBasinInconclusive;
  const weakConnector = connectorSucceeded && (
    params.connector.terminalPocketConnector ||
    params.connector.minConnectorBasinLakeAreaRatio < 0.006 ||
    params.connector.connectorBasinBalance < 0.16
  );
  const weakApproach =
    params.approach.terminalBackwaterRejected ||
    params.approach.sideAreaBalance < 0.2 ||
    params.approach.minSideLakeAreaRatio < 0.0016;
  const weakLocalStructure = params.weakerExpansionRatio < 1.55 || params.expansionBalance < 0.28;
  const badSignalCount = [
    tinyAbsoluteWidth,
    veryNarrowRelative,
    weakApproach,
    weakConnector,
    weakLocalStructure,
  ].filter(Boolean).length;
  if ((tinyAbsoluteWidth || veryNarrowRelative) && badSignalCount >= 3) return 'micro_pinch';

  const meaningfulConnector =
    connectorSucceeded &&
    params.connector.minConnectorBasinLakeAreaRatio >= 0.012 &&
    params.connector.connectorBasinBalance >= 0.24 &&
    !params.connector.terminalPocketConnector;
  if (
    params.widthToAverage < 0.25 &&
    params.weakerExpansionRatio >= 2 &&
    params.expansionBalance >= 0.28 &&
    meaningfulConnector
  ) return 'neck';

  const valuablePinch =
    params.widthToAverage >= 0.035 &&
    params.widthToAverage <= 0.58 &&
    params.weakerExpansionRatio >= 1.45 &&
    params.expansionBalance >= 0.28 &&
    !params.approach.terminalBackwaterRejected &&
    params.approach.sideAreaBalance >= 0.22 &&
    (
      !connectorSucceeded ||
      (
        params.connector.minConnectorBasinLakeAreaRatio >= 0.004 &&
        params.connector.connectorBasinBalance >= 0.12 &&
        !params.connector.terminalPocketConnector
      )
    );
  if (valuablePinch) return 'pinch_point';

  const localTwoLobeSaddle =
    params.widthToAverage >= 0.22 &&
    params.widthToAverage <= 0.58 &&
    params.weakerExpansionRatio >= 1.65 &&
    params.expansionBalance >= 0.4 &&
    !params.approach.terminalBackwaterRejected &&
    params.approach.sideAreaBalance >= 0.24 &&
    params.approach.minSideLakeAreaRatio >= 0.002;
  if (localTwoLobeSaddle || params.connector.connectorBasinInconclusive) return 'pinch_point';
  return tinyAbsoluteWidth || veryNarrowRelative ? 'micro_pinch' : 'pinch_point';
}

function approachAreaMetrics(params: {
  center: PointM;
  travelAxis: PointM;
  widthM: number;
  raster: { waterCells: RasterCell[]; cellSizeM: number; nx: number; ny: number };
  waterCellIndex: RasterCellSpatialIndex;
  searchDistanceM: number;
  lakeAreaSqM: number;
}): ApproachAreaMetrics {
  const axis = normalize(params.travelAxis) ?? { x: 1, y: 0 };
  const perpendicular = { x: -axis.y, y: axis.x };
  const innerOffsetM = Math.max(params.widthM * 0.55, params.raster.cellSizeM * 2);
  const outerOffsetM = clamp(params.searchDistanceM, params.widthM * 2.6, Math.max(params.widthM * 2.7, params.searchDistanceM));
  const halfCrossM = clamp(
    Math.max(params.widthM * 2.2, params.searchDistanceM * 0.26),
    params.widthM * 1.25,
    Math.max(params.widthM * 1.3, params.searchDistanceM * 0.56),
  );
  const queryRadiusM = Math.hypot(outerOffsetM, halfCrossM) + params.raster.cellSizeM;
  const cells = params.waterCellIndex.query({
    minX: params.center.x - queryRadiusM,
    maxX: params.center.x + queryRadiusM,
    minY: params.center.y - queryRadiusM,
    maxY: params.center.y + queryRadiusM,
  });
  let leftCells = 0;
  let rightCells = 0;
  for (const cell of cells) {
    const dx = cell.center.x - params.center.x;
    const dy = cell.center.y - params.center.y;
    const along = dx * axis.x + dy * axis.y;
    const crossDistance = Math.abs(dx * perpendicular.x + dy * perpendicular.y);
    if (crossDistance > halfCrossM) continue;
    if (along >= innerOffsetM && along <= outerOffsetM) rightCells++;
    else if (along <= -innerOffsetM && along >= -outerOffsetM) leftCells++;
  }
  const cellAreaSqM = params.raster.cellSizeM * params.raster.cellSizeM;
  const leftApproachAreaSqM = leftCells * cellAreaSqM;
  const rightApproachAreaSqM = rightCells * cellAreaSqM;
  const minSideAreaSqM = Math.min(leftApproachAreaSqM, rightApproachAreaSqM);
  const maxSideAreaSqM = Math.max(leftApproachAreaSqM, rightApproachAreaSqM);
  const sideAreaBalance = maxSideAreaSqM > 0 ? minSideAreaSqM / maxSideAreaSqM : 0;
  const minSideLakeAreaRatio = params.lakeAreaSqM > 0 ? minSideAreaSqM / params.lakeAreaSqM : 0;
  const terminalBackwaterRejected =
    leftCells < 4 ||
    rightCells < 4 ||
    sideAreaBalance < 0.18 ||
    minSideAreaSqM < Math.max(params.widthM * params.widthM * 1.7, params.lakeAreaSqM * 0.001);
  return {
    leftApproachAreaSqM,
    rightApproachAreaSqM,
    sideAreaBalance,
    minSideAreaSqM,
    maxSideAreaSqM,
    minSideLakeAreaRatio,
    approachSampleCellCount: leftCells + rightCells,
    terminalBackwaterRejected,
  };
}

function connectorBasinMetrics(params: {
  center: PointM;
  endpointA: PointM;
  endpointB: PointM;
  travelAxis: PointM;
  widthM: number;
  raster: { waterCells: RasterCell[]; cellSizeM: number; nx: number; ny: number };
  lakeAreaSqM: number;
}): ConnectorBasinMetrics {
  const axis = normalize(params.travelAxis) ?? { x: 1, y: 0 };
  const gateAxis = normalize({ x: params.endpointB.x - params.endpointA.x, y: params.endpointB.y - params.endpointA.y });
  if (!gateAxis) return emptyConnectorBasinMetrics(params.lakeAreaSqM, 'invalid_gate_axis');
  const waterByKey = new Map(params.raster.waterCells.map((cell) => [`${cell.ix}:${cell.iy}`, cell] as const));
  const gateHalfLengthM = distanceM(params.endpointA, params.endpointB) / 2;
  const gateBlockHalfWidthM = Math.max(params.raster.cellSizeM * 1.7, Math.min(34, params.widthM * 0.55));
  const gateBlockHalfLengthM = gateHalfLengthM + Math.max(params.raster.cellSizeM * 1.5, params.widthM * 0.3);
  const blocked = new Set<string>();
  for (const cell of params.raster.waterCells) {
    const dx = cell.center.x - params.center.x;
    const dy = cell.center.y - params.center.y;
    const alongGate = Math.abs(dx * gateAxis.x + dy * gateAxis.y);
    const acrossGate = Math.abs(dx * axis.x + dy * axis.y);
    if (alongGate <= gateBlockHalfLengthM && acrossGate <= gateBlockHalfWidthM) {
      blocked.add(`${cell.ix}:${cell.iy}`);
    }
  }
  const seedDistanceM = Math.max(params.widthM * 1.8, params.raster.cellSizeM * 4, 28);
  const seedA = nearestUnblockedWaterCell({
    target: { x: params.center.x + axis.x * seedDistanceM, y: params.center.y + axis.y * seedDistanceM },
    waterCells: params.raster.waterCells,
    blocked,
  });
  const seedB = nearestUnblockedWaterCell({
    target: { x: params.center.x - axis.x * seedDistanceM, y: params.center.y - axis.y * seedDistanceM },
    waterCells: params.raster.waterCells,
    blocked,
  });
  if (!seedA || !seedB) return emptyConnectorBasinMetrics(params.lakeAreaSqM, 'missing_basin_seed');

  const fillA = floodFillWaterCells(seedA, waterByKey, blocked, params.raster.nx, params.raster.ny);
  const seedBKey = `${seedB.ix}:${seedB.iy}`;
  const splitFailed = fillA.visited.has(seedBKey);
  const fillB = splitFailed
    ? { visited: new Set<string>(), count: 0 }
    : floodFillWaterCells(seedB, waterByKey, blocked, params.raster.nx, params.raster.ny);
  const cellAreaSqM = params.raster.cellSizeM * params.raster.cellSizeM;
  const leftConnectorBasinAreaSqM = fillA.count * cellAreaSqM;
  const rightConnectorBasinAreaSqM = fillB.count * cellAreaSqM;
  const minConnectorBasinAreaSqM = Math.min(leftConnectorBasinAreaSqM, rightConnectorBasinAreaSqM);
  const maxConnectorBasinAreaSqM = Math.max(leftConnectorBasinAreaSqM, rightConnectorBasinAreaSqM);
  const minConnectorBasinLakeAreaRatio = params.lakeAreaSqM > 0 ? minConnectorBasinAreaSqM / params.lakeAreaSqM : 0;
  const connectorBasinBalance = maxConnectorBasinAreaSqM > 0 ? minConnectorBasinAreaSqM / maxConnectorBasinAreaSqM : 0;
  const splitSucceeded = !splitFailed && fillA.count > 0 && fillB.count > 0;
  const terminalPocketConnector = splitSucceeded && (
    minConnectorBasinLakeAreaRatio < 0.004 ||
    minConnectorBasinAreaSqM < Math.max(params.widthM * params.widthM * 6, params.lakeAreaSqM * 0.0025)
  );
  return {
    leftConnectorBasinAreaSqM,
    rightConnectorBasinAreaSqM,
    minConnectorBasinAreaSqM,
    maxConnectorBasinAreaSqM,
    minConnectorBasinLakeAreaRatio,
    connectorBasinBalance,
    terminalPocketConnector,
    connectorBasinInconclusive: !splitSucceeded,
    connectorBasinSplitSucceeded: splitSucceeded,
    connectorBasinSplitFailed: splitFailed,
    connectorBasinApproximation: splitFailed ? 'gate_block_did_not_split_water' : 'gate_block_flood_fill',
  };
}

function emptyConnectorBasinMetrics(lakeAreaSqM: number, reason: string): ConnectorBasinMetrics {
  return {
    leftConnectorBasinAreaSqM: 0,
    rightConnectorBasinAreaSqM: 0,
    minConnectorBasinAreaSqM: 0,
    maxConnectorBasinAreaSqM: 0,
    minConnectorBasinLakeAreaRatio: lakeAreaSqM > 0 ? 0 : 0,
    connectorBasinBalance: 0,
    terminalPocketConnector: false,
    connectorBasinInconclusive: true,
    connectorBasinSplitSucceeded: false,
    connectorBasinSplitFailed: true,
    connectorBasinApproximation: reason,
  };
}

function nearestUnblockedWaterCell(params: {
  target: PointM;
  waterCells: RasterCell[];
  blocked: Set<string>;
}): RasterCell | null {
  let best: RasterCell | null = null;
  let bestDistance = Infinity;
  for (const cell of params.waterCells) {
    if (params.blocked.has(`${cell.ix}:${cell.iy}`)) continue;
    const d = distanceM(cell.center, params.target);
    if (d < bestDistance) {
      bestDistance = d;
      best = cell;
    }
  }
  return best;
}

function floodFillWaterCells(
  seed: RasterCell,
  waterByKey: Map<string, RasterCell>,
  blocked: Set<string>,
  nx: number,
  ny: number,
): { visited: Set<string>; count: number } {
  const startKey = `${seed.ix}:${seed.iy}`;
  const visited = new Set<string>();
  if (blocked.has(startKey) || !waterByKey.has(startKey)) return { visited, count: 0 };
  const queue: RasterCell[] = [seed];
  visited.add(startKey);
  for (let index = 0; index < queue.length; index++) {
    const cell = queue[index]!;
    const neighbors = [
      [cell.ix + 1, cell.iy],
      [cell.ix - 1, cell.iy],
      [cell.ix, cell.iy + 1],
      [cell.ix, cell.iy - 1],
    ] as const;
    for (const [ix, iy] of neighbors) {
      if (ix < 0 || iy < 0 || ix >= nx || iy >= ny) continue;
      const key = `${ix}:${iy}`;
      if (visited.has(key) || blocked.has(key)) continue;
      const next = waterByKey.get(key);
      if (!next) continue;
      visited.add(key);
      queue.push(next);
    }
  }
  return { visited, count: visited.size };
}

function nearestRingPair(a: RingM, b: RingM): { a: PointM; b: PointM; distanceM: number } | null {
  let bestA: PointM | null = null;
  let bestB: PointM | null = null;
  let bestDistance = Infinity;
  const aStep = Math.max(1, Math.floor(a.length / 160));
  const bStep = Math.max(1, Math.floor(b.length / 220));
  for (let i = 0; i < a.length; i += aStep) {
    const pointA = a[i]!;
    for (let j = 0; j < b.length; j += bStep) {
      const pointB = b[j]!;
      const d = distanceM(pointA, pointB);
      if (d < bestDistance) {
        bestDistance = d;
        bestA = pointA;
        bestB = pointB;
      }
    }
  }
  if (!bestA || !bestB) return null;
  return { a: bestA, b: bestB, distanceM: bestDistance };
}

class RasterCellSpatialIndex {
  private readonly cellSizeM: number;
  private readonly minX: number;
  private readonly minY: number;
  private readonly buckets = new Map<string, RasterCell[]>();

  constructor(cells: RasterCell[], cellSizeM: number) {
    this.cellSizeM = Math.max(1, cellSizeM);
    let minX = Infinity;
    let minY = Infinity;
    for (const cell of cells) {
      minX = Math.min(minX, cell.center.x);
      minY = Math.min(minY, cell.center.y);
    }
    this.minX = minX === Infinity ? 0 : minX;
    this.minY = minY === Infinity ? 0 : minY;
    for (const cell of cells) {
      const key = this.keyForPoint(cell.center);
      const bucket = this.buckets.get(key);
      if (bucket) bucket.push(cell);
      else this.buckets.set(key, [cell]);
    }
  }

  query(bounds: { minX: number; minY: number; maxX: number; maxY: number }): RasterCell[] {
    const minIx = this.ix(bounds.minX);
    const maxIx = this.ix(bounds.maxX);
    const minIy = this.iy(bounds.minY);
    const maxIy = this.iy(bounds.maxY);
    const out: RasterCell[] = [];
    for (let ix = minIx; ix <= maxIx; ix++) {
      for (let iy = minIy; iy <= maxIy; iy++) {
        for (const cell of this.buckets.get(`${ix}:${iy}`) ?? []) {
          if (
            cell.center.x >= bounds.minX &&
            cell.center.x <= bounds.maxX &&
            cell.center.y >= bounds.minY &&
            cell.center.y <= bounds.maxY
          ) {
            out.push(cell);
          }
        }
      }
    }
    return out;
  }

  private keyForPoint(point: PointM): string {
    return `${this.ix(point.x)}:${this.iy(point.y)}`;
  }

  private ix(x: number): number {
    return Math.floor((x - this.minX) / this.cellSizeM);
  }

  private iy(y: number): number {
    return Math.floor((y - this.minY) / this.cellSizeM);
  }
}

function opposingShoreEndpoints(center: PointM, polygon: PolygonM): { a: PointM; b: PointM } | null {
  const nearest = nearestPointOnRing(center, polygon.exterior);
  const vx = nearest.x - center.x;
  const vy = nearest.y - center.y;
  const len = Math.hypot(vx, vy);
  if (len === 0) return null;
  const dir = { x: vx / len, y: vy / len };
  const positive = rayRingIntersection(center, dir, polygon.exterior);
  const negative = rayRingIntersection(center, { x: -dir.x, y: -dir.y }, polygon.exterior);
  if (positive && negative) return { a: positive, b: negative };
  return null;
}

function rayRingIntersection(origin: PointM, dir: PointM, ring: RingM): PointM | null {
  let bestT = Infinity;
  let best: PointM | null = null;
  for (let i = 0; i < ring.length; i++) {
    const hit = raySegmentIntersection(origin, dir, ring[i]!, ring[(i + 1) % ring.length]!);
    if (hit && hit.t > 0 && hit.t < bestT) {
      bestT = hit.t;
      best = hit.point;
    }
  }
  return best;
}

function raySegmentIntersection(origin: PointM, dir: PointM, a: PointM, b: PointM): { t: number; point: PointM } | null {
  const sx = b.x - a.x;
  const sy = b.y - a.y;
  const denom = cross(dir, { x: sx, y: sy });
  if (Math.abs(denom) < 1e-9) return null;
  const ao = { x: a.x - origin.x, y: a.y - origin.y };
  const t = cross(ao, { x: sx, y: sy }) / denom;
  const u = cross(ao, dir) / denom;
  if (t <= 0 || u < -1e-9 || u > 1 + 1e-9) return null;
  return { t, point: { x: origin.x + dir.x * t, y: origin.y + dir.y * t } };
}

function cross(a: PointM, b: PointM): number {
  return a.x * b.y - a.y * b.x;
}

function dot(a: PointM, b: PointM): number {
  return a.x * b.x + a.y * b.y;
}

function normalize(vector: PointM): PointM | null {
  const length = Math.hypot(vector.x, vector.y);
  if (length <= 1e-9) return null;
  return { x: vector.x / length, y: vector.y / length };
}

function midpoint(a: PointM, b: PointM): PointM {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function dedupeWidthFeatures<T extends { center: PointM; score: number; widthM: number }>(features: T[]): T[] {
  const sorted = [...features].sort((a, b) => b.score - a.score);
  const kept: T[] = [];
  for (const feature of sorted) {
    if (kept.some((existing) => distanceM(existing.center, feature.center) < Math.max(60, Math.min(existing.widthM, feature.widthM) * 2.2))) continue;
    kept.push(feature);
  }
  return kept;
}
