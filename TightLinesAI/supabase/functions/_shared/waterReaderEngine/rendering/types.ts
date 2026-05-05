import type { PointM, PolygonM } from '../contracts.ts';
import type { WaterReaderDisplayModel } from '../display-model.ts';

export type WaterReaderRenderWarningCode =
  | 'missing_lake_polygon'
  | 'invalid_geometry'
  | 'missing_zone_path'
  | 'missing_label_anchor'
  | 'display_legend_count_mismatch'
  | 'long_label_leader'
  | 'legend_overflow_risk';

export interface WaterReaderRenderWarning {
  code: WaterReaderRenderWarningCode;
  message: string;
  entryId?: string;
  zoneId?: string;
}

export interface WaterReaderRenderSummary {
  displayedEntryCount: number;
  renderedNumberCount: number;
  calloutLabelCount: number;
  renderedStandaloneCount: number;
  renderedConfluenceCount: number;
  displayLegendEntryCount: number;
  retainedRenderedCount: number;
  warningCount: number;
  maxLabelLeaderLengthPx?: number;
  longLabelLeaderCount?: number;
  mapBottomY: number;
  firstLegendRowY: number;
  mapLegendGap: number;
  width: number;
  height: number;
  viewBox: string;
}

export interface WaterReaderProductionSvgOptions {
  lakePolygon?: PolygonM | null;
  title?: string;
  subtitle?: string;
  padding?: number;
  mapWidth?: number;
}

export interface WaterReaderProductionSvgResult {
  svg: string;
  warnings: WaterReaderRenderWarning[];
  summary: WaterReaderRenderSummary;
}

export interface WaterReaderSvgTransform {
  minX: number;
  maxY: number;
  scale: number;
  padding: number;
  mapWidth: number;
  mapHeight: number;
  legendTop: number;
  mapBottomY: number;
  mapLegendGap: number;
  width: number;
  height: number;
  viewBox: string;
}

export interface WaterReaderSvgTransformInput {
  displayModel: WaterReaderDisplayModel;
  lakePolygon?: PolygonM | null;
  padding: number;
  mapWidth: number;
  legendHeight: number;
}

export type WaterReaderLabelAnchor = {
  point: PointM;
  warning?: WaterReaderRenderWarning;
};
