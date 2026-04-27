import type { WaterbodyPreviewBbox, WaterbodySearchResult } from './waterReaderContracts';
import {
  isValidWgs84Bbox,
  isValidWgs84Centroid,
  wgs84BboxFromCentroidAcres,
} from './usgsTnmAerialSnapshot';

export type Wgs84Bbox = WaterbodyPreviewBbox;

export interface AerialReadCloseTile {
  id: number;
  row: number;
  col: number;
  bbox: Wgs84Bbox;
  prototypeVisibleCategory: string;
}

export interface AerialReadTilePlan {
  contextBbox: Wgs84Bbox;
  closeTiles: AerialReadCloseTile[];
  gridRows: number;
  gridCols: number;
  overlapRatio: number;
  source: 'previewBbox' | 'centroidAcresFallback';
}

const DEFAULT_CLOSE_TILE_COUNT = 9;
const MAX_CLOSE_TILE_COUNT = 12;
const TILE_OVERLAP_RATIO = 0.25;

const PROTOTYPE_VISIBLE_CATEGORIES = [
  'shoreline point',
  'cove / pocket',
  'inlet / outlet',
  'island edge',
  'neckdown',
  'visible vegetation / cover',
  'dock / shade line',
  'shoreline complexity',
] as const;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function clampBbox(bbox: Wgs84Bbox): Wgs84Bbox {
  return {
    minLon: clamp(bbox.minLon, -180, 180),
    minLat: clamp(bbox.minLat, -90, 90),
    maxLon: clamp(bbox.maxLon, -180, 180),
    maxLat: clamp(bbox.maxLat, -90, 90),
  };
}

function closeTileCount(surfaceAreaAcres: number | null | undefined, requested?: number): number {
  if (typeof requested === 'number' && Number.isFinite(requested)) {
    return clamp(Math.floor(requested), 1, MAX_CLOSE_TILE_COUNT);
  }
  if (typeof surfaceAreaAcres === 'number' && Number.isFinite(surfaceAreaAcres)) {
    if (surfaceAreaAcres < 40) return 4;
    if (surfaceAreaAcres < 180) return 6;
  }
  return DEFAULT_CLOSE_TILE_COUNT;
}

function gridForTileCount(count: number): { rows: number; cols: number } {
  if (count <= 4) return { rows: 2, cols: 2 };
  if (count <= 6) return { rows: 2, cols: 3 };
  if (count <= 9) return { rows: 3, cols: 3 };
  return { rows: 3, cols: 4 };
}

export function planAerialReadTiles(
  waterbody: Pick<WaterbodySearchResult, 'previewBbox' | 'centroid' | 'surfaceAreaAcres'>,
  options?: { closeTileCount?: number },
): AerialReadTilePlan | null {
  const previewBbox = waterbody.previewBbox;
  const hasPreviewBbox = previewBbox != null && isValidWgs84Bbox(previewBbox);
  const contextBbox = hasPreviewBbox
    ? previewBbox
    : isValidWgs84Centroid(
        typeof waterbody.centroid?.lat === 'number' ? waterbody.centroid.lat : NaN,
        typeof waterbody.centroid?.lon === 'number' ? waterbody.centroid.lon : NaN,
      )
      ? wgs84BboxFromCentroidAcres(
          waterbody.centroid!.lat,
          waterbody.centroid!.lon,
          waterbody.surfaceAreaAcres ?? undefined,
        )
      : null;

  if (contextBbox == null || !isValidWgs84Bbox(contextBbox)) {
    return null;
  }

  const count = closeTileCount(waterbody.surfaceAreaAcres, options?.closeTileCount);
  const { rows, cols } = gridForTileCount(count);
  const width = contextBbox.maxLon - contextBbox.minLon;
  const height = contextBbox.maxLat - contextBbox.minLat;
  const tileWidth = width / (cols - TILE_OVERLAP_RATIO * (cols - 1));
  const tileHeight = height / (rows - TILE_OVERLAP_RATIO * (rows - 1));
  const xStep = tileWidth * (1 - TILE_OVERLAP_RATIO);
  const yStep = tileHeight * (1 - TILE_OVERLAP_RATIO);

  const closeTiles: AerialReadCloseTile[] = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if (closeTiles.length >= count) break;
      const minLon = contextBbox.minLon + col * xStep;
      const minLat = contextBbox.minLat + row * yStep;
      const bbox = clampBbox({
        minLon,
        minLat,
        maxLon: minLon + tileWidth,
        maxLat: minLat + tileHeight,
      });
      if (!isValidWgs84Bbox(bbox)) continue;
      const id = closeTiles.length + 1;
      closeTiles.push({
        id,
        row,
        col,
        bbox,
        prototypeVisibleCategory: PROTOTYPE_VISIBLE_CATEGORIES[(id - 1) % PROTOTYPE_VISIBLE_CATEGORIES.length],
      });
    }
  }

  return {
    contextBbox,
    closeTiles,
    gridRows: rows,
    gridCols: cols,
    overlapRatio: TILE_OVERLAP_RATIO,
    source: hasPreviewBbox ? 'previewBbox' : 'centroidAcresFallback',
  };
}
