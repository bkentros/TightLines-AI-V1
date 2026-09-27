import type { FeatureCollection, MultiLineString } from "geojson";

import type { PierCastGreatLakeId } from "./pierCastGreatLakes";

export type PierCastWindFramePoint = {
  nodeId: string;
  lakeId: PierCastGreatLakeId;
  latitude: number;
  longitude: number;
  validAt: string;
  speedMph: number;
  directionDegrees: number;
  gustMph: number;
};

export type PierCastWindArrowProperties = {
  nodeId: string;
  lakeId: PierCastGreatLakeId;
  speedMph: number;
  gustMph: number;
  directionDegrees: number;
  travelDirectionDegrees: number;
  tone: string;
  width: number;
};

export const PIER_CAST_WIND_SCALE_STOPS = [
  { speedMph: 0, tone: "#D7F7FF", label: "CALM" },
  { speedMph: 8, tone: "#67E8D1", label: "LIGHT" },
  { speedMph: 16, tone: "#F1D36B", label: "BREEZY" },
  { speedMph: 25, tone: "#FF8B61", label: "STRONG" },
  { speedMph: 35, tone: "#F0529C", label: "HARD" },
] as const;

const EARTH_RADIUS_M = 6_371_008.8;

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.max(minimum, Math.min(maximum, value));
}

function hexChannel(hex: string, offset: number): number {
  return Number.parseInt(hex.slice(offset, offset + 2), 16);
}

function interpolateHex(from: string, to: string, fraction: number): string {
  const channel = (offset: number) =>
    Math.round(
      hexChannel(from, offset) +
        (hexChannel(to, offset) - hexChannel(from, offset)) * fraction,
    ).toString(16).padStart(2, "0");
  return `#${channel(1)}${channel(3)}${channel(5)}`.toUpperCase();
}

export function pierCastWindColor(speedMph: number): string {
  const value = Number.isFinite(speedMph) ? Math.max(0, speedMph) : 0;
  for (let index = 1; index < PIER_CAST_WIND_SCALE_STOPS.length; index += 1) {
    const upper = PIER_CAST_WIND_SCALE_STOPS[index]!;
    if (value > upper.speedMph) continue;
    const lower = PIER_CAST_WIND_SCALE_STOPS[index - 1]!;
    return interpolateHex(
      lower.tone,
      upper.tone,
      (value - lower.speedMph) / (upper.speedMph - lower.speedMph),
    );
  }
  return PIER_CAST_WIND_SCALE_STOPS.at(-1)!.tone;
}

export function pierCastWindBandLabel(speedMph: number): string {
  const value = Number.isFinite(speedMph) ? Math.max(0, speedMph) : 0;
  let match: (typeof PIER_CAST_WIND_SCALE_STOPS)[number] =
    PIER_CAST_WIND_SCALE_STOPS[0];
  for (const stop of PIER_CAST_WIND_SCALE_STOPS) {
    if (value < stop.speedMph) break;
    match = stop;
  }
  return match.label;
}

/** Meteorological direction is where wind comes from; anglers need where it travels. */
export function pierCastWindTravelDirection(directionDegrees: number): number {
  if (!Number.isFinite(directionDegrees)) return 0;
  return (directionDegrees + 180 + 360) % 360;
}

export function pierCastWindCompassDirection(
  directionDegrees: number,
): "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW" {
  const labels = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as const;
  if (!Number.isFinite(directionDegrees)) return "N";
  const normalized = (directionDegrees % 360 + 360) % 360;
  return labels[Math.round(normalized / 45) % labels.length]!;
}

function destination(
  longitude: number,
  latitude: number,
  bearingDegrees: number,
  distanceM: number,
): [number, number] {
  const radians = (degrees: number) => degrees * Math.PI / 180;
  const degrees = (value: number) => value * 180 / Math.PI;
  const angularDistance = distanceM / EARTH_RADIUS_M;
  const latitude1 = radians(latitude);
  const longitude1 = radians(longitude);
  const bearing = radians(bearingDegrees);
  const latitude2 = Math.asin(
    Math.sin(latitude1) * Math.cos(angularDistance) +
      Math.cos(latitude1) * Math.sin(angularDistance) * Math.cos(bearing),
  );
  const longitude2 = longitude1 + Math.atan2(
    Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(latitude1),
    Math.cos(angularDistance) - Math.sin(latitude1) * Math.sin(latitude2),
  );
  return [degrees(longitude2), degrees(latitude2)];
}

/**
 * Produces native-map arrow geometry instead of hundreds of React markers.
 * Arrow length is held near a readable screen size at every zoom while speed
 * remains encoded by length, width, and color.
 */
export function buildPierCastWindArrowGeoJson(
  points: readonly PierCastWindFramePoint[],
  zoom: number,
): FeatureCollection<MultiLineString, PierCastWindArrowProperties> {
  const safeZoom = clamp(Number.isFinite(zoom) ? zoom : 4, 3, 14);
  return {
    type: "FeatureCollection",
    features: points.flatMap((point) => {
      if (
        !Number.isFinite(point.latitude) ||
        !Number.isFinite(point.longitude) ||
        !Number.isFinite(point.speedMph) ||
        !Number.isFinite(point.gustMph) ||
        !Number.isFinite(point.directionDegrees)
      ) return [];
      const travelDirectionDegrees = pierCastWindTravelDirection(
        point.directionDegrees,
      );
      const pixels = clamp(12 + point.speedMph * 0.48, 12, 30);
      const metresPerPixel = 156_543.03392 *
        Math.cos(point.latitude * Math.PI / 180) /
        2 ** safeZoom;
      const distanceM = pixels * metresPerPixel;
      const start: [number, number] = [point.longitude, point.latitude];
      const end = destination(
        point.longitude,
        point.latitude,
        travelDirectionDegrees,
        distanceM,
      );
      const headDistanceM = Math.max(4 * metresPerPixel, distanceM * 0.32);
      const headLeft = destination(
        end[0],
        end[1],
        travelDirectionDegrees + 150,
        headDistanceM,
      );
      const headRight = destination(
        end[0],
        end[1],
        travelDirectionDegrees + 210,
        headDistanceM,
      );
      return [{
        type: "Feature" as const,
        id: point.nodeId,
        properties: {
          nodeId: point.nodeId,
          lakeId: point.lakeId,
          speedMph: point.speedMph,
          gustMph: point.gustMph,
          directionDegrees: point.directionDegrees,
          travelDirectionDegrees,
          tone: pierCastWindColor(point.speedMph),
          width: clamp(1.05 + point.speedMph / 20, 1.05, 3.1),
        },
        geometry: {
          type: "MultiLineString" as const,
          coordinates: [
            [start, end],
            [headLeft, end],
            [headRight, end],
          ],
        },
      }];
    }),
  };
}

export function summarizePierCastWindFrame(
  points: readonly PierCastWindFramePoint[],
):
  | { averageMph: number; strongestMph: number; strongestGustMph: number }
  | null {
  if (points.length === 0) return null;
  return {
    averageMph: Math.round(
      points.reduce((total, point) => total + point.speedMph, 0) /
        points.length,
    ),
    strongestMph: Math.round(
      Math.max(...points.map((point) => point.speedMph)),
    ),
    strongestGustMph: Math.round(
      Math.max(...points.map((point) => point.gustMph)),
    ),
  };
}
