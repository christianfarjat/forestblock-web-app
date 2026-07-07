/**
 * Exports de Land_Stratify (spec §2.5.5) — replica la nomenclatura ENTE:
 * 00_Estratos.geojson · 00_Estratos.kml · 00_Estratos_Stats.csv ·
 * 00_Puntos.geojson · 00_Puntos.kml · bundle KMZ para GuruMaps/Google Earth.
 */

import JSZip from 'jszip';

import { POINT_TYPE_LABEL } from './strat_palette';
import type { SamplingPoint, StratRunResult, Stratum } from './strat_types';

/** Color KML (aabbggrr) desde hex #rrggbb. */
function kmlColor(hex: string, alpha = 'b3'): string {
  const h = hex.replace('#', '');
  const r = h.slice(0, 2);
  const g = h.slice(2, 4);
  const b = h.slice(4, 6);
  return `${alpha}${b}${g}${r}`.toLowerCase();
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function aoiSlug(result: StratRunResult): string {
  return result.aoi.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ---------------------------------------------------------------------------
// GeoJSON
// ---------------------------------------------------------------------------

export function toStrataGeoJSON(result: StratRunResult): string {
  const features = result.strata.map((s) => ({
    type: 'Feature',
    properties: {
      name: s.name,
      stratum_id: s.stratum_id,
      degradation_rank: s.degradation_rank,
      color_hex: s.color_hex,
      area_ha: s.area_ha,
      pct: s.pct,
      mean_ndvi: s.mean_ndvi,
      mean_soc_tc_ha: s.mean_soc,
      di_min: s.di_min ?? null,
      di_max: s.di_max ?? null,
      n_neyman: s.n_neyman,
      halfci_pct: s.halfci_pct ?? null,
      era: result.run.era,
    },
    geometry: s.geometry,
  }));
  return JSON.stringify({ type: 'FeatureCollection', features }, null, 2);
}

export function toPointsGeoJSON(result: StratRunResult): string {
  const features = result.points.map((p) => ({
    type: 'Feature',
    properties: {
      point_id: p.point_id,
      stratum_id: p.stratum_id,
      degradation_rank: p.degradation_rank,
      point_type: p.point_type,
      qa_status: p.qa_status,
      elevation: p.elevation ?? null,
      soc_pred_tc_ha: p.soc_pred_tc_ha ?? null,
      ndvi: p.ndvi ?? null,
      near_aoi_boundary: p.flags.near_aoi_boundary,
      near_strata_boundary: p.flags.near_strata_boundary,
      on_road: p.flags.on_road,
      replaces_point_id: p.replaces_point_id ?? null,
      era: result.run.era,
    },
    geometry: { type: 'Point', coordinates: [p.lon, p.lat] },
  }));
  return JSON.stringify({ type: 'FeatureCollection', features }, null, 2);
}

// ---------------------------------------------------------------------------
// KML
// ---------------------------------------------------------------------------

function stratumKmlPlacemark(s: Stratum): string {
  const polys = s.geometry.coordinates
    .map((poly) => {
      const rings = poly
        .map((ring, idx) => {
          const coords = ring.map(([lon, lat]) => `${lon},${lat},0`).join(' ');
          const tag = idx === 0 ? 'outerBoundaryIs' : 'innerBoundaryIs';
          return `<${tag}><LinearRing><coordinates>${coords}</coordinates></LinearRing></${tag}>`;
        })
        .join('');
      return `<Polygon><tessellate>1</tessellate>${rings}</Polygon>`;
    })
    .join('');
  return `
    <Placemark>
      <name>${esc(s.name)}</name>
      <styleUrl>#stratum-rank-${s.degradation_rank}</styleUrl>
      <ExtendedData>
        <Data name="degradation_rank"><value>${s.degradation_rank}</value></Data>
        <Data name="stratum_id"><value>${s.stratum_id}</value></Data>
        <Data name="area_ha"><value>${s.area_ha}</value></Data>
        <Data name="pct"><value>${s.pct}</value></Data>
        <Data name="mean_ndvi"><value>${s.mean_ndvi}</value></Data>
        <Data name="mean_soc_tc_ha"><value>${s.mean_soc}</value></Data>
        <Data name="n_neyman"><value>${s.n_neyman}</value></Data>
      </ExtendedData>
      <MultiGeometry>${polys}</MultiGeometry>
    </Placemark>`;
}

function pointKmlPlacemark(p: SamplingPoint): string {
  const desc = [
    `Tipo: ${POINT_TYPE_LABEL[p.point_type]}`,
    `Estrato: E${p.degradation_rank}`,
    `QA: ${p.qa_status}`,
    p.elevation !== undefined ? `Elevación: ${p.elevation} m` : '',
    p.soc_pred_tc_ha !== undefined ? `SOC pred.: ${p.soc_pred_tc_ha} tC/ha` : '',
    p.ndvi !== undefined ? `NDVI: ${p.ndvi}` : '',
    p.flags.near_aoi_boundary ? '⚑ cerca del límite del AOI' : '',
    p.flags.near_strata_boundary ? '⚑ cerca de borde de estrato' : '',
    p.flags.on_road ? '⚑ sobre camino' : '',
  ]
    .filter(Boolean)
    .join('\n');
  return `
    <Placemark>
      <name>${esc(p.point_id)}</name>
      <description>${esc(desc)}</description>
      <styleUrl>#point-${p.point_type}-rank-${p.degradation_rank}</styleUrl>
      <ExtendedData>
        <Data name="point_type"><value>${p.point_type}</value></Data>
        <Data name="degradation_rank"><value>${p.degradation_rank}</value></Data>
        <Data name="qa_status"><value>${p.qa_status}</value></Data>
      </ExtendedData>
      <Point><coordinates>${p.lon},${p.lat},0</coordinates></Point>
    </Placemark>`;
}

function kmlStyles(result: StratRunResult): string {
  const strataStyles = result.strata
    .map(
      (s) => `
    <Style id="stratum-rank-${s.degradation_rank}">
      <LineStyle><color>${kmlColor(s.color_hex, 'ff')}</color><width>1.5</width></LineStyle>
      <PolyStyle><color>${kmlColor(s.color_hex, '99')}</color></PolyStyle>
    </Style>`,
    )
    .join('');

  const iconByType: Record<string, string> = {
    primary: 'http://maps.google.com/mapfiles/kml/shapes/placemark_circle_highlight.png',
    replacement: 'http://maps.google.com/mapfiles/kml/shapes/placemark_circle.png',
    alternative: 'http://maps.google.com/mapfiles/kml/shapes/open-diamond.png',
  };
  const seen = new Set<string>();
  const pointStyles = result.points
    .map((p) => {
      const id = `point-${p.point_type}-rank-${p.degradation_rank}`;
      if (seen.has(id)) return '';
      seen.add(id);
      const stratum = result.strata.find((s) => s.degradation_rank === p.degradation_rank);
      const color = kmlColor(stratum?.color_hex ?? '#182D1F', 'ff');
      return `
    <Style id="${id}">
      <IconStyle>
        <color>${color}</color>
        <scale>${p.point_type === 'primary' ? 1.1 : 0.9}</scale>
        <Icon><href>${iconByType[p.point_type]}</href></Icon>
      </IconStyle>
      <LabelStyle><scale>0.8</scale></LabelStyle>
    </Style>`;
    })
    .join('');

  return strataStyles + pointStyles;
}

/** Documento KML completo (estratos + puntos en folders separados). */
export function toCombinedKml(result: StratRunResult): string {
  const strataPm = [...result.strata]
    .sort((a, b) => a.degradation_rank - b.degradation_rank)
    .map(stratumKmlPlacemark)
    .join('\n');
  const pointsPm = result.points.map(pointKmlPlacemark).join('\n');
  const title = `${result.aoi.name} — Land_Stratify ${result.run.era === 'era1_kmeans' ? 'Era 1 (K-Means)' : 'Era 2 (DI)'}`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${esc(title)}</name>
    ${kmlStyles(result)}
    <Folder>
      <name>00_Estratos</name>
      ${strataPm}
    </Folder>
    <Folder>
      <name>00_Puntos</name>
      ${pointsPm}
    </Folder>
  </Document>
</kml>`;
}

export function toStrataKml(result: StratRunResult): string {
  const strataPm = [...result.strata]
    .sort((a, b) => a.degradation_rank - b.degradation_rank)
    .map(stratumKmlPlacemark)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${esc(`${result.aoi.name} — 00_Estratos`)}</name>
    ${kmlStyles({ ...result, points: [] })}
    ${strataPm}
  </Document>
</kml>`;
}

export function toPointsKml(result: StratRunResult): string {
  const pointsPm = result.points.map(pointKmlPlacemark).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${esc(`${result.aoi.name} — 00_Puntos`)}</name>
    ${kmlStyles({ ...result, strata: result.strata })}
    ${pointsPm}
  </Document>
</kml>`;
}

// ---------------------------------------------------------------------------
// CSV
// ---------------------------------------------------------------------------

function csvRow(values: (string | number | boolean | null | undefined)[]): string {
  return values
    .map((v) => {
      if (v === null || v === undefined) return '';
      const s = String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    })
    .join(',');
}

export function toStatsCsv(result: StratRunResult): string {
  const header = csvRow([
    'stratum',
    'degradation_rank',
    'stratum_id_raw',
    'area_ha',
    'pct',
    'mean_ndvi',
    'mean_soc_tc_ha',
    'di_min',
    'di_max',
    'n_neyman',
    'halfci_pct',
    'era',
  ]);
  const rows = [...result.strata]
    .sort((a, b) => a.degradation_rank - b.degradation_rank)
    .map((s) =>
      csvRow([
        s.name,
        s.degradation_rank,
        s.stratum_id,
        s.area_ha,
        s.pct,
        s.mean_ndvi,
        s.mean_soc,
        s.di_min,
        s.di_max,
        s.n_neyman,
        s.halfci_pct,
        result.run.era,
      ]),
    );
  return [header, ...rows].join('\n');
}

export function toPointsCsv(result: StratRunResult): string {
  const header = csvRow([
    'point_id',
    'point_type',
    'degradation_rank',
    'stratum_id_raw',
    'lat',
    'lon',
    'elevation_m',
    'qa_status',
    'soc_pred_tc_ha',
    'ndvi',
    'near_aoi_boundary',
    'near_strata_boundary',
    'on_road',
    'replaces_point_id',
    'era',
  ]);
  const rows = result.points.map((p) =>
    csvRow([
      p.point_id,
      p.point_type,
      p.degradation_rank,
      p.stratum_id,
      p.lat.toFixed(6),
      p.lon.toFixed(6),
      p.elevation,
      p.qa_status,
      p.soc_pred_tc_ha,
      p.ndvi,
      p.flags.near_aoi_boundary,
      p.flags.near_strata_boundary,
      p.flags.on_road,
      p.replaces_point_id,
      result.run.era,
    ]),
  );
  return [header, ...rows].join('\n');
}

// ---------------------------------------------------------------------------
// Bundles
// ---------------------------------------------------------------------------

/** KMZ (doc.kml comprimido) — abre en GuruMaps / Google Earth. */
export async function buildKmz(result: StratRunResult): Promise<Blob> {
  const zip = new JSZip();
  zip.file('doc.kml', toCombinedKml(result));
  return zip.generateAsync({
    type: 'blob',
    mimeType: 'application/vnd.google-earth.kmz',
    compression: 'DEFLATE',
  });
}

/** Bundle ZIP completo con la nomenclatura ENTE (§2.5.5). */
export async function buildExportBundle(result: StratRunResult): Promise<Blob> {
  const zip = new JSZip();
  zip.file('00_Estratos.geojson', toStrataGeoJSON(result));
  zip.file('00_Estratos.kml', toStrataKml(result));
  zip.file('00_Estratos_Stats.csv', toStatsCsv(result));
  zip.file('00_Puntos.geojson', toPointsGeoJSON(result));
  zip.file('00_Puntos.kml', toPointsKml(result));
  zip.file('00_Puntos.csv', toPointsCsv(result));
  const kmz = await buildKmz(result);
  zip.file(`${aoiSlug(result)}_${result.run.era}.kmz`, kmz);
  return zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function downloadText(text: string, filename: string, mime = 'text/plain'): void {
  downloadBlob(new Blob([text], { type: `${mime};charset=utf-8` }), filename);
}
