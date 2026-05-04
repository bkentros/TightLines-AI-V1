import {
  buildWaterReaderDisplayModel,
  buildWaterReaderLegend,
  buildWaterReaderProductionSvg,
  detectWaterReaderFeatures,
  placeWaterReaderZones,
  preprocessWaterReaderGeometry,
  type WaterReaderEngineSupportStatus,
  type WaterReaderProductionSvgResult,
} from './water-reader-engine';
import type {
  WaterbodyPolygonResponse,
  WaterReaderPolygonSupportStatus,
} from './waterReaderContracts';

export const WATER_READER_APP_SVG_WIDTH = 420;

export type WaterReaderEngineRead = {
  supportStatus: WaterReaderEngineSupportStatus;
  supportReason: string;
  displayedEntryCount: number;
  retainedEntryCount: number;
  rendererWarningCount: number;
  season: string;
  seasonGroup?: string | null;
  productionSvgResult: WaterReaderProductionSvgResult | null;
  fallbackMessage: string | null;
};

export function buildWaterReaderEngineRead(
  polygonPayload: WaterbodyPolygonResponse,
  currentDate = new Date(),
): WaterReaderEngineRead {
  const input = {
    lakeId: polygonPayload.lakeId,
    name: polygonPayload.name,
    state: polygonPayload.state,
    acreage: polygonPayload.areaAcres,
    geojson: polygonPayload.geojson,
    currentDate,
  };
  const preprocess = preprocessWaterReaderGeometry(input);
  const features = detectWaterReaderFeatures(preprocess, input);
  const zoneResult = placeWaterReaderZones(preprocess, features, input, { allowUniversalFallback: false });
  const legend = buildWaterReaderLegend(zoneResult, { state: input.state, currentDate: input.currentDate });
  const displayModel = buildWaterReaderDisplayModel(zoneResult, legend, {
    acreage: input.acreage,
    longestDimensionM: preprocess.metrics?.longestDimensionM,
  });

  const fallbackMessage = waterReaderFallbackMessage({
    polygonPayload,
    supportStatus: preprocess.supportStatus,
    supportReason: preprocess.supportReason,
    hasPrimaryPolygon: Boolean(preprocess.primaryPolygon),
    hasMetrics: Boolean(preprocess.metrics),
    displayedEntryCount: displayModel.displayedEntries.length,
  });

  const productionSvgResult =
    !fallbackMessage && preprocess.primaryPolygon
      ? buildWaterReaderProductionSvg(displayModel, {
          lakePolygon: preprocess.primaryPolygon,
          title: polygonPayload.name,
          subtitle: `${zoneResult.season} seasonal structure | polygon geometry`,
          mapWidth: WATER_READER_APP_SVG_WIDTH,
        })
      : null;

  return {
    supportStatus: preprocess.supportStatus,
    supportReason: preprocess.supportReason,
    displayedEntryCount: displayModel.displayedEntries.length,
    retainedEntryCount: displayModel.retainedEntries.length,
    rendererWarningCount: productionSvgResult?.summary.warningCount ?? 0,
    season: zoneResult.season,
    seasonGroup: zoneResult.seasonGroup,
    productionSvgResult,
    fallbackMessage,
  };
}

export function waterReaderFallbackMessage(args: {
  polygonPayload: WaterbodyPolygonResponse;
  supportStatus: WaterReaderEngineSupportStatus;
  supportReason: string;
  hasPrimaryPolygon: boolean;
  hasMetrics: boolean;
  displayedEntryCount: number;
}): string | null {
  if (!args.polygonPayload.geojson) {
    return 'This waterbody does not have polygon geometry available for a Water Reader map yet.';
  }
  if (!args.polygonPayload.geometryIsValid) {
    return 'This polygon needs geometry cleanup before Water Reader can draw a trustworthy structure map.';
  }
  if (args.polygonPayload.waterReaderSupportStatus === 'not_supported') {
    return args.polygonPayload.waterReaderSupportReason || 'This polygon is not supported for a Water Reader map yet.';
  }
  if (args.supportStatus === 'not_supported') {
    return args.supportReason || 'This polygon is not supported for a Water Reader map yet.';
  }
  if (!args.hasPrimaryPolygon || !args.hasMetrics) {
    return 'This polygon could not be projected into lake-space geometry for a trustworthy read.';
  }
  if (args.displayedEntryCount === 0) {
    return 'No trustworthy seasonal structure zones passed the geometry filters for this outline. Nothing was added to fill space.';
  }
  return null;
}

export function limitedReadNote(
  status: WaterReaderPolygonSupportStatus | WaterReaderEngineSupportStatus,
  reason?: string,
): string | null {
  if (status === 'limited') {
    return reason
      ? `Limited read: ${reason}`
      : 'Limited read: the polygon supports a conservative map, but some geometry quality checks are constrained.';
  }
  if (status === 'needs_review') {
    return reason
      ? `Review-needed read: ${reason}`
      : 'Review-needed read: the polygon can render, but its geometry should be reviewed before treating every structure label as app-ready.';
  }
  return null;
}
