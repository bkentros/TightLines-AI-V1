import type { PointM, RingM, WaterReaderFeatureClass } from '../contracts';

export interface WaterReaderDetectedFeatureBase {
  featureId: string;
  featureClass: WaterReaderFeatureClass;
  score: number;
  qaFlags: string[];
  metrics: Record<string, number | string | boolean | null>;
}

export interface WaterReaderPointFeature extends WaterReaderDetectedFeatureBase {
  featureClass: 'main_lake_point' | 'secondary_point';
  tip: PointM;
  leftSlope: PointM;
  rightSlope: PointM;
  baseMidpoint: PointM;
  orientationVector: PointM;
  protrusionLengthM: number;
  turnAngleRad: number;
  confidence: number;
  parentCoveId?: string;
}

export interface WaterReaderCoveFeature extends WaterReaderDetectedFeatureBase {
  featureClass: 'cove';
  mouthLeft: PointM;
  mouthRight: PointM;
  mouthWidthM: number;
  back: PointM;
  shorePath: RingM;
  coveBoundary: RingM;
  shorePathLengthM: number;
  pathRatio: number;
  coveDepthM: number;
  depthRatio: number;
  coveAreaSqM: number;
  leftIrregularity: number;
  rightIrregularity: number;
  covePolygon: RingM;
}

export interface WaterReaderIslandFeature extends WaterReaderDetectedFeatureBase {
  featureClass: 'island';
  ring: RingM;
  areaSqM: number;
  endpointA: PointM;
  endpointB: PointM;
  nearestMainlandDistanceM: number;
}

export interface WaterReaderNeckFeature extends WaterReaderDetectedFeatureBase {
  featureClass: 'neck';
  endpointA: PointM;
  endpointB: PointM;
  center: PointM;
  widthM: number;
  leftExpansionRatio: number;
  rightExpansionRatio: number;
  confidence: number;
}

export interface WaterReaderSaddleFeature extends WaterReaderDetectedFeatureBase {
  featureClass: 'saddle';
  endpointA: PointM;
  endpointB: PointM;
  center: PointM;
  widthM: number;
  leftExpansionRatio: number;
  rightExpansionRatio: number;
  confidence: number;
}

export interface WaterReaderDamFeature extends WaterReaderDetectedFeatureBase {
  featureClass: 'dam';
  cornerA: PointM;
  cornerB: PointM;
  segmentLengthM: number;
  rSquared: number;
  confidence: number;
}

export interface WaterReaderUniversalPlaceholderFeature extends WaterReaderDetectedFeatureBase {
  featureClass: 'universal';
}

export type WaterReaderDetectedFeature =
  | WaterReaderPointFeature
  | WaterReaderCoveFeature
  | WaterReaderIslandFeature
  | WaterReaderNeckFeature
  | WaterReaderSaddleFeature
  | WaterReaderDamFeature
  | WaterReaderUniversalPlaceholderFeature;

export type WaterReaderPointCandidate = Omit<WaterReaderPointFeature, 'featureId' | 'featureClass' | 'parentCoveId'> & {
  featureClass?: 'main_lake_point' | 'secondary_point';
};

export type WaterReaderCoveCandidate = Omit<WaterReaderCoveFeature, 'featureId'>;
export type WaterReaderNeckCandidate = Omit<WaterReaderNeckFeature, 'featureId'>;
export type WaterReaderSaddleCandidate = Omit<WaterReaderSaddleFeature, 'featureId'>;
export type WaterReaderDamCandidate = Omit<WaterReaderDamFeature, 'featureId'>;
