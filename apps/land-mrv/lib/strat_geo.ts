/**
 * Helpers geométricos livianos para Land_Stratify (sin dependencias externas).
 * Coordenadas GeoJSON: [lon, lat]. Distancias en metros, áreas en hectáreas.
 */

import type {
  MultiPolygonGeometry,
  PolygonGeometry,
  Position,
  StratGeometry,
} from './strat_types';

const R_EARTH = 6371008.8; // radio medio (m)

export function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Metros por grado de longitud/latitud a una latitud dada. */
export function metersPerDegree(lat: number): { mLon: number; mLat: number } {
  const mLat = (Math.PI * R_EARTH) / 180;
  return { mLon: mLat * Math.cos(toRad(lat)), mLat };
}

/** Distancia haversine (m) entre dos posiciones [lon, lat]. */
export function distanceMeters(a: Position, b: Position): number {
  const dLat = toRad(b[1] - a[1]);
  const dLon = toRad(b[0] - a[0]);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a[1])) * Math.cos(toRad(b[1])) * Math.sin(dLon / 2) ** 2;
  return 2 * R_EARTH * Math.asin(Math.min(1, Math.sqrt(s)));
}

export interface Bbox {
  minLon: number;
  minLat: number;
  maxLon: number;
  maxLat: number;
}

export function bboxOfRing(ring: Position[]): Bbox {
  let minLon = Infinity;
  let minLat = Infinity;
  let maxLon = -Infinity;
  let maxLat = -Infinity;
  for (const [lon, lat] of ring) {
    if (lon < minLon) minLon = lon;
    if (lat < minLat) minLat = lat;
    if (lon > maxLon) maxLon = lon;
    if (lat > maxLat) maxLat = lat;
  }
  return { minLon, minLat, maxLon, maxLat };
}

export function bboxOfGeometry(geom: StratGeometry): Bbox {
  const rings: Position[][] =
    geom.type === 'Polygon' ? geom.coordinates : geom.coordinates.flat();
  const boxes = rings.map(bboxOfRing);
  return {
    minLon: Math.min(...boxes.map((b) => b.minLon)),
    minLat: Math.min(...boxes.map((b) => b.minLat)),
    maxLon: Math.max(...boxes.map((b) => b.maxLon)),
    maxLat: Math.max(...boxes.map((b) => b.maxLat)),
  };
}

export function centroidOfRing(ring: Position[]): Position {
  let lon = 0;
  let lat = 0;
  const n = ring.length > 1 && isSamePos(ring[0], ring[ring.length - 1]) ? ring.length - 1 : ring.length;
  for (let i = 0; i < n; i++) {
    lon += ring[i][0];
    lat += ring[i][1];
  }
  return [lon / n, lat / n];
}

function isSamePos(a: Position, b: Position): boolean {
  return a[0] === b[0] && a[1] === b[1];
}

/**
 * Área (ha) de un anillo por shoelace en proyección equirectangular local.
 * Aproximación suficiente para AOIs prediales (< ~50 km de extensión).
 */
export function ringAreaHa(ring: Position[]): number {
  if (ring.length < 4) return 0;
  const [, latC] = centroidOfRing(ring);
  const { mLon, mLat } = metersPerDegree(latC);
  let sum = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    const x1 = ring[i][0] * mLon;
    const y1 = ring[i][1] * mLat;
    const x2 = ring[i + 1][0] * mLon;
    const y2 = ring[i + 1][1] * mLat;
    sum += x1 * y2 - x2 * y1;
  }
  return Math.abs(sum / 2) / 10000;
}

/** Área (ha) de un polígono con huecos (anillo exterior − interiores). */
export function polygonAreaHa(poly: PolygonGeometry): number {
  if (poly.coordinates.length === 0) return 0;
  const outer = ringAreaHa(poly.coordinates[0]);
  const holes = poly.coordinates.slice(1).reduce((acc, r) => acc + ringAreaHa(r), 0);
  return Math.max(0, outer - holes);
}

export function geometryAreaHa(geom: StratGeometry): number {
  if (geom.type === 'Polygon') return polygonAreaHa(geom);
  return geom.coordinates.reduce(
    (acc, coords) => acc + polygonAreaHa({ type: 'Polygon', coordinates: coords }),
    0,
  );
}

/** Ray casting: punto dentro de un anillo. */
export function pointInRing(p: Position, ring: Position[]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersects =
      yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

/** Punto dentro de un polígono (respeta huecos). */
export function pointInPolygon(p: Position, poly: PolygonGeometry): boolean {
  if (poly.coordinates.length === 0) return false;
  if (!pointInRing(p, poly.coordinates[0])) return false;
  for (const hole of poly.coordinates.slice(1)) {
    if (pointInRing(p, hole)) return false;
  }
  return true;
}

/** Distancia (m) de un punto al borde de un anillo (mínimo punto-segmento). */
export function distanceToRingMeters(p: Position, ring: Position[]): number {
  const { mLon, mLat } = metersPerDegree(p[1]);
  const px = p[0] * mLon;
  const py = p[1] * mLat;
  let best = Infinity;
  for (let i = 0; i < ring.length - 1; i++) {
    const ax = ring[i][0] * mLon;
    const ay = ring[i][1] * mLat;
    const bx = ring[i + 1][0] * mLon;
    const by = ring[i + 1][1] * mLat;
    const dx = bx - ax;
    const dy = by - ay;
    const len2 = dx * dx + dy * dy;
    const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2));
    const qx = ax + t * dx;
    const qy = ay + t * dy;
    best = Math.min(best, Math.hypot(px - qx, py - qy));
  }
  return best;
}

/** RNG determinístico (mulberry32) para reproducibilidad de corridas demo. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Hash estable de un string → semilla uint32. */
export function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
