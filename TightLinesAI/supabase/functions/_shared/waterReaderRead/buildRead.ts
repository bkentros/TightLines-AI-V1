import {
  buildWaterReaderDisplayModel,
  buildWaterReaderLegend,
  buildWaterReaderProductionSvg,
  detectWaterReaderFeatures,
  placeWaterReaderZones,
  preprocessWaterReaderGeometry,
} from "../waterReaderEngine/index.ts";
import type { WaterReaderEngineSupportStatus } from "../waterReaderEngine/index.ts";
import type {
  WaterbodyPolygonForWaterReaderRead,
  WaterReaderReadResponse,
  WaterReaderReadTimingDiagnostics,
} from "./contracts.ts";
import {
  WATER_READER_APP_SVG_WIDTH,
  WATER_READER_ENGINE_VERSION,
  WATER_READER_READ_FEATURE,
} from "./contracts.ts";
import { buildWaterReaderSeasonContext } from "./seasonContext.ts";

export function buildServerWaterReaderRead(params: {
  polygonPayload: WaterbodyPolygonForWaterReaderRead;
  currentDate: Date;
  fetchMs: number;
}): WaterReaderReadResponse {
  const totalStarted = Date.now() - params.fetchMs;
  const input = {
    lakeId: params.polygonPayload.lakeId,
    name: params.polygonPayload.name,
    state: params.polygonPayload.state,
    acreage: params.polygonPayload.areaAcres,
    geojson: params.polygonPayload.geojson,
    currentDate: params.currentDate,
  };

  const preprocessStarted = Date.now();
  const preprocess = preprocessWaterReaderGeometry(input);
  const featuresStarted = Date.now();
  const features = detectWaterReaderFeatures(preprocess, input);
  const zonesStarted = Date.now();
  const zoneResult = placeWaterReaderZones(preprocess, features, input, { allowUniversalFallback: false });
  const legendStarted = Date.now();
  const legend = buildWaterReaderLegend(zoneResult, { state: input.state, currentDate: input.currentDate });
  const displayStarted = Date.now();
  const displayModel = buildWaterReaderDisplayModel(zoneResult, legend, {
    acreage: input.acreage,
    longestDimensionM: preprocess.metrics?.longestDimensionM,
    lakePolygon: preprocess.primaryPolygon,
  });
  const renderStarted = Date.now();

  const fallbackMessage = waterReaderFallbackMessage({
    polygonPayload: params.polygonPayload,
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
        title: params.polygonPayload.name,
        subtitle: `Structure areas | ${zoneResult.season} legend guidance | polygon geometry`,
        mapWidth: WATER_READER_APP_SVG_WIDTH,
      })
      : null;
  const doneAt = Date.now();
  const seasonContext = buildWaterReaderSeasonContext(input.state, input.currentDate);

  const timings: WaterReaderReadTimingDiagnostics = {
    fetchMs: params.fetchMs,
    preprocessMs: featuresStarted - preprocessStarted,
    featuresMs: zonesStarted - featuresStarted,
    zonesMs: legendStarted - zonesStarted,
    legendMs: displayStarted - legendStarted,
    displayMs: renderStarted - displayStarted,
    renderMs: doneAt - renderStarted,
    totalMs: doneAt - totalStarted,
  };

  return {
    feature: WATER_READER_READ_FEATURE,
    lakeId: params.polygonPayload.lakeId,
    name: params.polygonPayload.name,
    state: params.polygonPayload.state,
    county: params.polygonPayload.county,
    waterbodyType: params.polygonPayload.waterbodyType,
    centroid: params.polygonPayload.centroid,
    bbox: params.polygonPayload.bbox,
    areaSqM: params.polygonPayload.areaSqM,
    areaAcres: params.polygonPayload.areaAcres,
    perimeterM: params.polygonPayload.perimeterM,
    geometryIsValid: params.polygonPayload.geometryIsValid,
    geometryValidityDetail: params.polygonPayload.geometryValidityDetail,
    componentCount: params.polygonPayload.componentCount,
    interiorRingCount: params.polygonPayload.interiorRingCount,
    waterReaderSupportStatus: params.polygonPayload.waterReaderSupportStatus,
    waterReaderSupportReason: params.polygonPayload.waterReaderSupportReason,
    polygonQaFlags: params.polygonPayload.polygonQaFlags,
    originalVertexCount: params.polygonPayload.originalVertexCount,
    runtimeVertexCount: params.polygonPayload.runtimeVertexCount,
    runtimeComponentCount: params.polygonPayload.runtimeComponentCount,
    runtimeInteriorRingCount: params.polygonPayload.runtimeInteriorRingCount,
    runtimeSimplified: params.polygonPayload.runtimeSimplified,
    runtimeSimplificationTolerance: params.polygonPayload.runtimeSimplificationTolerance,
    engineSupportStatus: preprocess.supportStatus,
    engineSupportReason: preprocess.supportReason,
    displayedEntryCount: displayModel.displayedEntries.length,
    retainedEntryCount: displayModel.retainedEntries.length,
    rendererWarningCount: productionSvgResult?.summary.warningCount ?? 0,
    season: zoneResult.season,
    seasonGroup: zoneResult.seasonGroup,
    productionSvgResult,
    fallbackMessage,
    cacheStatus: "miss",
    seasonContextKey: seasonContext.seasonContextKey,
    mapWidth: WATER_READER_APP_SVG_WIDTH,
    engineVersion: WATER_READER_ENGINE_VERSION,
    timings,
  };
}

export function waterReaderFallbackMessage(args: {
  polygonPayload: WaterbodyPolygonForWaterReaderRead;
  supportStatus: WaterReaderEngineSupportStatus;
  supportReason: string;
  hasPrimaryPolygon: boolean;
  hasMetrics: boolean;
  displayedEntryCount: number;
}): string | null {
  if (!args.polygonPayload.geojson) {
    return "This waterbody does not have polygon geometry available for a Water Reader map yet.";
  }
  if (!args.polygonPayload.geometryIsValid) {
    return "This polygon needs geometry cleanup before Water Reader can draw a trustworthy structure map.";
  }
  if (args.polygonPayload.waterReaderSupportStatus === "not_supported") {
    return args.polygonPayload.waterReaderSupportReason || "This polygon is not supported for a Water Reader map yet.";
  }
  if (args.supportStatus === "not_supported") {
    return args.supportReason || "This polygon is not supported for a Water Reader map yet.";
  }
  if (!args.hasPrimaryPolygon || !args.hasMetrics) {
    return "This polygon could not be projected into lake-space geometry for a trustworthy read.";
  }
  if (args.displayedEntryCount === 0) {
    return "No trustworthy structure areas passed the geometry filters for this outline. Nothing was added to fill space.";
  }
  return null;
}

export function limitedReadNote(
  status: WaterbodyPolygonForWaterReaderRead["waterReaderSupportStatus"] | WaterReaderEngineSupportStatus,
  reason?: string,
): string | null {
  if (status === "limited") {
    return reason
      ? `Limited read: ${reason}`
      : "Limited read: the polygon supports a conservative map, but some geometry quality checks are constrained.";
  }
  if (status === "needs_review") {
    return reason
      ? `Review-needed read: ${reason}`
      : "Review-needed read: the polygon can render, but its geometry should be reviewed before treating every structure label as app-ready.";
  }
  return null;
}
