export type LonLat = {
  lon: number;
  lat: number;
};

export type PointM = {
  x: number;
  y: number;
};

export type RingM = PointM[];

export type PolygonM = {
  exterior: RingM;
  holes: RingM[];
};

export type WaterReaderSeason = 'spring' | 'summer' | 'fall' | 'winter';

export type WaterReaderSeasonGroup =
  | 'deep_south'
  | 'south'
  | 'baseline'
  | 'north'
  | 'mild_coastal_desert';

export type WaterReaderEngineSupportStatus =
  | 'supported'
  | 'limited'
  | 'needs_review'
  | 'not_supported';

export type WaterReaderFeatureClass =
  | 'main_lake_point'
  | 'secondary_point'
  | 'cove'
  | 'neck'
  | 'island'
  | 'saddle'
  | 'dam'
  | 'universal';

export interface WaterReaderPolygonGeoJson {
  type: 'Polygon' | 'MultiPolygon';
  coordinates: unknown;
}

export interface WaterReaderEngineInput {
  lakeId?: string;
  name?: string;
  state: string;
  acreage?: number | null;
  currentDate?: Date;
  geojson: WaterReaderPolygonGeoJson | null | undefined;
}

export interface WaterReaderLakeMetrics {
  areaSqM: number;
  perimeterM: number;
  longestDimensionM: number;
  averageLakeWidthM: number;
  bboxM: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  };
  componentCount: number;
  holeCount: number;
}

export interface WaterReaderProjectionInfo {
  origin: LonLat;
  lat0: number;
  lon0: number;
}

export interface WaterReaderPreprocessResult {
  supportStatus: WaterReaderEngineSupportStatus;
  supportReason: string;
  qaFlags: string[];
  projection?: WaterReaderProjectionInfo;
  primaryPolygon?: PolygonM;
  secondaryComponents?: PolygonM[];
  metrics?: WaterReaderLakeMetrics;
  resampledExterior?: RingM;
  simplifiedExterior?: RingM;
  smoothedExterior?: RingM;
  resampleSpacingM?: number;
  simplifyToleranceM?: number;
  smoothingSigmaM?: number;
}

export interface WaterReaderFeatureBase {
  featureId: string;
  featureClass: WaterReaderFeatureClass;
  rank?: number;
  score?: number;
  metrics?: Record<string, number | string | boolean | null>;
  qaFlags: string[];
}

export type WaterReaderFeature = WaterReaderFeatureBase & {
  geometry?: Record<string, unknown>;
};

export interface WaterReaderZone {
  zoneId: string;
  featureId: string;
  featureClass: WaterReaderFeatureClass;
  rank: number;
  anchor: PointM;
  center: PointM;
  radiusLongM: number;
  radiusShortM: number;
  rotationRad: number;
  colorHex: string;
  qaFlags: string[];
}

export interface WaterReaderLegendEntry {
  number?: number;
  entryId?: string;
  zoneId: string;
  zoneIds?: string[];
  featureClass?: WaterReaderFeatureClass | 'structure_confluence';
  placementKind?: string;
  placementKinds?: string[];
  colorHex?: string;
  templateId?: string;
  title: string;
  body: string;
  transitionWarning?: string;
  isConfluence?: boolean;
}

export interface WaterReaderEngineOutput {
  supportStatus: WaterReaderEngineSupportStatus;
  supportReason: string;
  season?: WaterReaderSeason;
  seasonGroup?: WaterReaderSeasonGroup;
  metrics?: WaterReaderLakeMetrics;
  features: WaterReaderFeature[];
  zones: WaterReaderZone[];
  legend: WaterReaderLegendEntry[];
  qaFlags: string[];
}
