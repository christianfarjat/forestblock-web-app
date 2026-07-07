/**
 * Ingesta KML/KMZ de Land_Stratify — espejo client-side del schema KMZ
 * unificado de m14_landscan (`parse_kmz_unificado` / `validar_geometria`):
 * 1 perímetro + N subdivisiones (potreros de un campo, o campos miembros de una QU).
 *
 * En producción el archivo se sube a `POST /api/v2/stratify/aoi/from-kml` y el
 * parse canónico lo hace el backend con m14; este parser da la vista previa y
 * habilita el modo demo sin backend.
 */

import JSZip from 'jszip';

import {
  centroidOfRing,
  distanceToRingMeters,
  geometryAreaHa,
  pointInPolygon,
  polygonAreaHa,
} from './strat_geo';
import type { AoiType, PolygonGeometry, Position, StratAOI, StratPotrero } from './strat_types';

export interface ParsedPlacemark {
  name: string;
  geometry: PolygonGeometry;
  area_ha: number;
}

export interface GeometryValidation {
  ok: boolean;
  errors: string[];
  warnings: string[];
}

export interface ParsedKmlFile {
  source_name: string;
  placemarks: ParsedPlacemark[];
  validation: GeometryValidation;
}

const KMZ_MAGIC = [0x50, 0x4b]; // "PK"

/** Lee un File .kml o .kmz y devuelve los placemarks poligonales. */
export async function parseKmlOrKmz(file: File): Promise<ParsedKmlFile> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer.slice(0, 2));
  const isKmz =
    file.name.toLowerCase().endsWith('.kmz') ||
    (bytes.length >= 2 && bytes[0] === KMZ_MAGIC[0] && bytes[1] === KMZ_MAGIC[1]);

  let kmlText: string;
  if (isKmz) {
    const zip = await JSZip.loadAsync(buffer);
    // Ignorar basura de macOS (__MACOSX/, forks AppleDouble "._x.kml"): no son KML.
    const candidates = zip
      .file(/\.kml$/i)
      .filter((f) => !f.name.startsWith('__MACOSX/') && !f.name.split('/').pop()?.startsWith('._'));
    const entry =
      zip.file('doc.kml') ?? candidates.sort((a, b) => a.name.localeCompare(b.name))[0];
    if (!entry) {
      return {
        source_name: file.name,
        placemarks: [],
        validation: { ok: false, errors: ['El KMZ no contiene ningún archivo .kml.'], warnings: [] },
      };
    }
    kmlText = await entry.async('text');
  } else {
    kmlText = new TextDecoder('utf-8').decode(buffer);
  }

  return parseKmlText(kmlText, file.name);
}

/** Parsea el texto KML y extrae todos los polígonos con su nombre. */
export function parseKmlText(kmlText: string, sourceName: string): ParsedKmlFile {
  const errors: string[] = [];
  const warnings: string[] = [];
  const placemarks: ParsedPlacemark[] = [];

  let doc: Document;
  try {
    doc = new DOMParser().parseFromString(kmlText, 'text/xml');
  } catch {
    return {
      source_name: sourceName,
      placemarks: [],
      validation: { ok: false, errors: ['No se pudo leer el XML del KML.'], warnings: [] },
    };
  }
  if (doc.getElementsByTagName('parsererror').length > 0) {
    return {
      source_name: sourceName,
      placemarks: [],
      validation: { ok: false, errors: ['El KML tiene XML inválido.'], warnings: [] },
    };
  }

  const pmNodes = Array.from(doc.getElementsByTagName('Placemark'));
  let unnamed = 0;
  for (const pm of pmNodes) {
    const nameNode = pm.getElementsByTagName('name')[0];
    const polygons = Array.from(pm.getElementsByTagName('Polygon'));
    if (polygons.length === 0) continue;

    for (const polyNode of polygons) {
      const geometry = parsePolygonNode(polyNode);
      if (!geometry) {
        warnings.push(`Se ignoró un polígono sin coordenadas válidas en "${nameNode?.textContent?.trim() ?? sourceName}".`);
        continue;
      }
      let name = nameNode?.textContent?.trim() ?? '';
      if (!name) {
        unnamed += 1;
        name = `Polígono ${unnamed}`;
      } else if (polygons.length > 1) {
        name = `${name} (${polygons.indexOf(polyNode) + 1})`;
      }
      placemarks.push({ name, geometry, area_ha: polygonAreaHa(geometry) });
    }
  }

  if (placemarks.length === 0) {
    errors.push('El KML no contiene ningún polígono (se esperaba el perímetro del campo o de la QU).');
  }

  const validation = validarGeometria(placemarks);
  return {
    source_name: sourceName,
    placemarks,
    validation: {
      ok: errors.length === 0 && validation.ok,
      errors: [...errors, ...validation.errors],
      warnings: [...warnings, ...validation.warnings],
    },
  };
}

function parsePolygonNode(polyNode: Element): PolygonGeometry | null {
  const outer = polyNode.getElementsByTagName('outerBoundaryIs')[0];
  const outerCoords = outer
    ? parseCoordinates(outer.getElementsByTagName('coordinates')[0]?.textContent ?? '')
    : parseCoordinates(polyNode.getElementsByTagName('coordinates')[0]?.textContent ?? '');
  if (outerCoords.length < 3) return null;

  const rings: Position[][] = [closeRing(outerCoords)];
  for (const inner of Array.from(polyNode.getElementsByTagName('innerBoundaryIs'))) {
    const hole = parseCoordinates(inner.getElementsByTagName('coordinates')[0]?.textContent ?? '');
    if (hole.length >= 3) rings.push(closeRing(hole));
  }
  return { type: 'Polygon', coordinates: rings };
}

function parseCoordinates(text: string): Position[] {
  const coords: Position[] = [];
  // El spec KML separa tuplas por whitespace y componentes por coma sin espacios,
  // pero hay exports con "lon, lat": normalizar espacios alrededor de comas
  // evita que Number('') === 0 fabrique vértices en el ecuador/meridiano 0.
  const normalized = text.trim().replace(/\s*,\s*/g, ',');
  for (const token of normalized.split(/\s+/)) {
    const parts = token.split(',');
    if (parts.length < 2 || parts[0] === '' || parts[1] === '') continue;
    const lon = Number(parts[0]);
    const lat = Number(parts[1]);
    if (!Number.isFinite(lon) || !Number.isFinite(lat)) continue;
    coords.push([lon, lat]);
  }
  return coords;
}

function closeRing(ring: Position[]): Position[] {
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) {
    return [...ring, [first[0], first[1]]];
  }
  return ring;
}

/** Validación de geometría (espíritu de `validar_geometria` de m14). */
export function validarGeometria(placemarks: ParsedPlacemark[]): GeometryValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const pm of placemarks) {
    for (const ring of pm.geometry.coordinates) {
      if (ring.length < 4) {
        errors.push(`"${pm.name}": anillo con menos de 4 vértices.`);
        continue;
      }
      for (const [lon, lat] of ring) {
        if (lon < -180 || lon > 180 || lat < -90 || lat > 90) {
          errors.push(`"${pm.name}": coordenadas fuera de rango (lon ${lon}, lat ${lat}).`);
          break;
        }
      }
    }
    if (pm.area_ha <= 0) {
      errors.push(`"${pm.name}": polígono con área nula.`);
    } else if (pm.area_ha < 0.01) {
      warnings.push(`"${pm.name}": área muy chica (${pm.area_ha.toFixed(4)} ha) — verificar el KML.`);
    }
  }

  return { ok: errors.length === 0, errors, warnings };
}

/**
 * Construye el StratAOI desde los placemarks: el polígono de mayor área es el
 * perímetro; los demás (si caen dentro) son potreros/campos miembros.
 */
export function buildAoiFromPlacemarks(
  parsed: ParsedKmlFile,
  aoiType: AoiType,
  aoiName?: string,
): StratAOI {
  if (parsed.placemarks.length === 0) {
    throw new Error('El KML no contiene polígonos.');
  }

  const sorted = [...parsed.placemarks].sort((a, b) => b.area_ha - a.area_ha);
  const perimeter = sorted[0];
  const potreros: StratPotrero[] = [];

  // Contención tolerante: los potreros suelen compartir aristas con el perímetro
  // (ray casting da false para puntos exactamente sobre el borde), así que un
  // vértice cuenta como "adentro" si está dentro o a < 2 m del borde exterior.
  const BORDER_TOL_M = 2;
  for (const pm of sorted.slice(1)) {
    const ring = pm.geometry.coordinates[0];
    const centroidInside = pointInPolygon(centroidOfRing(ring), perimeter.geometry);
    const verticesOk = ring.every(
      (p) =>
        pointInPolygon(p, perimeter.geometry) ||
        distanceToRingMeters(p, perimeter.geometry.coordinates[0]) < BORDER_TOL_M,
    );
    if (centroidInside && verticesOk) {
      potreros.push({ name: pm.name, geometry: pm.geometry, area_ha: pm.area_ha });
    }
  }

  const id = `aoi_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  return {
    id,
    name: aoiName?.trim() || perimeter.name || parsed.source_name.replace(/\.(kml|kmz)$/i, ''),
    aoi_type: aoiType,
    geometry: perimeter.geometry,
    potreros,
    source_kml_uri: parsed.source_name,
    area_ha: geometryAreaHa(perimeter.geometry),
    created_at: new Date().toISOString(),
  };
}
