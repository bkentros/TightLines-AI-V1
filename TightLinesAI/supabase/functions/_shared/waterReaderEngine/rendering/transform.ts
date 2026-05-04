import type { PointM, PolygonM, RingM } from '../contracts.ts';
import type { WaterReaderDisplayModel } from '../display-model.ts';
import type { WaterReaderSvgTransform, WaterReaderSvgTransformInput } from './types.ts';

export function buildWaterReaderSvgTransform(input: WaterReaderSvgTransformInput): WaterReaderSvgTransform {
  const bounds = geometryBounds(input.displayModel, input.lakePolygon);
  const rawW = Math.max(1, bounds.maxX - bounds.minX);
  const rawH = Math.max(1, bounds.maxY - bounds.minY);
  const padM = Math.max(rawW, rawH) * 0.055;
  const minX = bounds.minX - padM;
  const maxX = bounds.maxX + padM;
  const minY = bounds.minY - padM;
  const maxY = bounds.maxY + padM;
  const worldW = Math.max(1, maxX - minX);
  const worldH = Math.max(1, maxY - minY);
  const innerW = input.mapWidth - input.padding * 2;
  const mapHeight = Math.max(360, (innerW * worldH) / worldW);
  const scale = innerW / worldW;
  const mapBottomY = input.padding + mapHeight;
  const mapLegendGap = Math.max(34, input.padding * 1.25);
  const height = Math.ceil(mapBottomY + mapLegendGap + input.legendHeight + input.padding);
  return {
    minX,
    maxY,
    scale,
    padding: input.padding,
    mapWidth: input.mapWidth,
    mapHeight,
    legendTop: mapBottomY + mapLegendGap,
    mapBottomY,
    mapLegendGap,
    width: input.mapWidth,
    height,
    viewBox: `0 0 ${input.mapWidth} ${height}`,
  };
}

export function svgPoint(point: PointM, transform: WaterReaderSvgTransform): PointM {
  return {
    x: transform.padding + (point.x - transform.minX) * transform.scale,
    y: transform.padding + (transform.maxY - point.y) * transform.scale,
  };
}

export function svgPathForRing(ring: RingM, transform: WaterReaderSvgTransform, close: boolean): string {
  if (ring.length === 0) return '';
  const first = svgPoint(ring[0]!, transform);
  const parts = [`M ${format(first.x)} ${format(first.y)}`];
  for (let i = 1; i < ring.length; i++) {
    const point = svgPoint(ring[i]!, transform);
    parts.push(`L ${format(point.x)} ${format(point.y)}`);
  }
  if (close) parts.push('Z');
  return parts.join(' ');
}

export function svgPathForPolygon(polygon: PolygonM, transform: WaterReaderSvgTransform): string {
  return [polygon.exterior, ...polygon.holes]
    .map((ring) => svgPathForRing(ring, transform, true))
    .filter(Boolean)
    .join(' ');
}

export function format(value: number): string {
  return Number.isFinite(value) ? value.toFixed(2) : '0.00';
}

function geometryBounds(displayModel: WaterReaderDisplayModel, lakePolygon?: PolygonM | null) {
  const points: PointM[] = [];
  if (lakePolygon) {
    points.push(...lakePolygon.exterior, ...lakePolygon.holes.flat());
  }
  for (const entry of displayModel.displayedEntries) {
    for (const zone of entry.zones) points.push(...zone.unclippedRing, ...zone.visibleWaterRing, zone.center, zone.anchor);
  }
  if (points.length === 0) return { minX: 0, maxX: 1, minY: 0, maxY: 1 };
  return points.reduce(
    (bounds, point) => ({
      minX: Math.min(bounds.minX, point.x),
      maxX: Math.max(bounds.maxX, point.x),
      minY: Math.min(bounds.minY, point.y),
      maxY: Math.max(bounds.maxY, point.y),
    }),
    { minX: points[0]!.x, maxX: points[0]!.x, minY: points[0]!.y, maxY: points[0]!.y },
  );
}
