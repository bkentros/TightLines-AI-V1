import type {
  WaterReaderEngineSupportStatus,
  WaterReaderProductionSvgResult,
  WaterReaderSeason,
  WaterReaderSeasonGroup,
} from "../waterReaderEngine/index.ts";
import type {
  WaterbodyPolygonGeoJson,
  WaterbodyPreviewBbox,
  WaterbodyType,
  WaterReaderPolygonSupportStatus,
} from "../waterReader/index.ts";

export const WATER_READER_READ_FEATURE = "water_reader_read_v1" as const;
export const WATER_READER_APP_SVG_WIDTH = 420;
export const WATER_READER_ENGINE_VERSION = "water-reader-engine-v1" as const;

export type WaterReaderReadCacheStatus = "hit" | "miss";

export interface WaterReaderReadRequest {
  lakeId: string;
  currentDate?: string;
}

export interface WaterReaderReadTimingDiagnostics {
  fetchMs: number;
  cacheMs?: number;
  preprocessMs: number;
  featuresMs: number;
  zonesMs: number;
  legendMs: number;
  displayMs: number;
  renderMs: number;
  totalMs: number;
}

export interface WaterReaderReadResponse {
  feature: typeof WATER_READER_READ_FEATURE;
  lakeId: string;
  name: string;
  state: string;
  county?: string | null;
  waterbodyType: WaterbodyType | string;
  centroid: {
    lat: number;
    lon: number;
  };
  bbox: WaterbodyPreviewBbox | null;
  areaSqM?: number | null;
  areaAcres?: number | null;
  perimeterM?: number | null;
  geometryIsValid: boolean;
  geometryValidityDetail?: string | null;
  componentCount: number;
  interiorRingCount: number;
  waterReaderSupportStatus: WaterReaderPolygonSupportStatus;
  waterReaderSupportReason: string;
  polygonQaFlags: string[];
  engineSupportStatus: WaterReaderEngineSupportStatus;
  engineSupportReason: string;
  displayedEntryCount: number;
  retainedEntryCount: number;
  rendererWarningCount: number;
  season: WaterReaderSeason | string;
  seasonGroup?: WaterReaderSeasonGroup | null;
  productionSvgResult: WaterReaderProductionSvgResult | null;
  fallbackMessage: string | null;
  cacheStatus?: WaterReaderReadCacheStatus;
  seasonContextKey?: string;
  mapWidth?: number;
  engineVersion?: string;
  timings?: WaterReaderReadTimingDiagnostics;
}

export interface WaterbodyPolygonForWaterReaderRead {
  lakeId: string;
  name: string;
  state: string;
  county?: string | null;
  waterbodyType: WaterbodyType | string;
  centroid: {
    lat: number;
    lon: number;
  };
  bbox: WaterbodyPreviewBbox | null;
  areaSqM?: number | null;
  areaAcres?: number | null;
  perimeterM?: number | null;
  geojson: WaterbodyPolygonGeoJson | null;
  geometryIsValid: boolean;
  geometryValidityDetail?: string | null;
  componentCount: number;
  interiorRingCount: number;
  waterReaderSupportStatus: WaterReaderPolygonSupportStatus;
  waterReaderSupportReason: string;
  polygonQaFlags: string[];
}

export interface WaterReaderSeasonContext {
  season: WaterReaderSeason | string;
  seasonGroup: WaterReaderSeasonGroup | "unknown";
  inTransitionWindow: boolean;
  transitionFrom: WaterReaderSeason | null;
  transitionTo: WaterReaderSeason | null;
  seasonContextKey: string;
}
