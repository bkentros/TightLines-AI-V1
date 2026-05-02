import type { LonLat, PointM, RingM } from './contracts';

const METERS_PER_DEG_LON_AT_EQUATOR = 111320;
const METERS_PER_DEG_LAT = 110540;

export interface LocalProjection {
  origin: LonLat;
  lat0: number;
  lon0: number;
  project(point: LonLat): PointM;
  unproject(point: PointM): LonLat;
}

export function createLocalProjection(origin: LonLat): LocalProjection {
  const lat0 = origin.lat;
  const lon0 = origin.lon;
  const cosLat0 = Math.cos((lat0 * Math.PI) / 180);
  const lonScale = cosLat0 * METERS_PER_DEG_LON_AT_EQUATOR;

  return {
    origin,
    lat0,
    lon0,
    project(point: LonLat): PointM {
      return {
        x: (point.lon - lon0) * lonScale,
        y: (point.lat - lat0) * METERS_PER_DEG_LAT,
      };
    },
    unproject(point: PointM): LonLat {
      return {
        lon: lon0 + point.x / lonScale,
        lat: lat0 + point.y / METERS_PER_DEG_LAT,
      };
    },
  };
}

export function projectRing(ring: LonLat[], projection: LocalProjection): RingM {
  return ring.map((point) => projection.project(point));
}

export function unprojectRing(ring: RingM, projection: LocalProjection): LonLat[] {
  return ring.map((point) => projection.unproject(point));
}

export function projectRings(rings: LonLat[][], projection: LocalProjection): RingM[] {
  return rings.map((ring) => projectRing(ring, projection));
}

export function unprojectRings(rings: RingM[], projection: LocalProjection): LonLat[][] {
  return rings.map((ring) => unprojectRing(ring, projection));
}
