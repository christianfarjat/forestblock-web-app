'use client';

/**
 * Land_Stratify — Vista de mapa (Leaflet, spec MJM-FB-MRV-IT-001-V0).
 *
 * Se importa SIEMPRE con next/dynamic ssr:false desde el page, por lo que acá
 * podemos usar leaflet/react-leaflet directo (sin window en top-level: solo
 * imports de tipos y componentes).
 *
 * Requisito canónico: colores y numeración E1..E5 SIEMPRE por
 * `degradation_rank` (1 = más degradado = rojo … 5 = mejor = verde oscuro),
 * nunca por `stratum_id` crudo.
 */

import 'leaflet/dist/leaflet.css';

import { useEffect, useMemo, useRef } from 'react';
import type { LatLngTuple } from 'leaflet';
import {
  CircleMarker,
  LayerGroup,
  LayersControl,
  MapContainer,
  Polygon,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
} from 'react-leaflet';

import { bboxOfGeometry } from '@/lib/strat_geo';
import {
  POINT_TYPE_LABEL,
  POINT_TYPE_RING,
  diColor,
  rankColor,
  stratumName,
} from '@/lib/strat_palette';
import type {
  DegradationRank,
  Era,
  MultiPolygonGeometry,
  PointType,
  PolygonGeometry,
  Position,
  QaStatus,
  SamplingPoint,
  SamplingPointFlags,
  StratAOI,
  StratRunResult,
  Stratum,
} from '@/lib/strat_types';

export interface MapViewProps {
  aoi: StratAOI | null;
  results: Partial<Record<Era, StratRunResult>>;
  activeEra: Era;
  selectedPointId: string | null;
  onSelectPoint: (pointId: string | null) => void;
}

// ---------------------------------------------------------------------------
// Conversión GeoJSON ([lon, lat]) → Leaflet ([lat, lng])
// ---------------------------------------------------------------------------

function ringToLatLngs(ring: Position[]): LatLngTuple[] {
  return ring.map(([lon, lat]): LatLngTuple => [lat, lon]);
}

function polygonToLatLngs(poly: PolygonGeometry): LatLngTuple[][] {
  return poly.coordinates.map(ringToLatLngs);
}

function multiPolygonToLatLngs(geom: MultiPolygonGeometry): LatLngTuple[][][] {
  return geom.coordinates.map((polyCoords) => polyCoords.map(ringToLatLngs));
}

// ---------------------------------------------------------------------------
// Constantes de presentación
// ---------------------------------------------------------------------------

const DEFAULT_CENTER: LatLngTuple = [-42.55, -70.55];
const DEFAULT_ZOOM = 9;

const POINT_RADIUS: Record<PointType, number> = {
  primary: 7,
  replacement: 5.5,
  alternative: 5,
};

const QA_LABEL: Record<QaStatus, string> = {
  ok: 'OK',
  review: 'Revisar',
  replaced: 'Reemplazado',
};

const FLAG_LABELS: { key: keyof SamplingPointFlags; label: string }[] = [
  { key: 'near_aoi_boundary', label: 'cerca del límite del AOI' },
  { key: 'near_strata_boundary', label: 'cerca de borde de estrato' },
  { key: 'on_road', label: 'sobre camino' },
];

function fmtNum(v: number, maxDecimals = 1): string {
  return v.toLocaleString('es-AR', { maximumFractionDigits: maxDecimals });
}

/** DI medio del estrato para la rampa continua (fallback por rank si falta). */
function diMid(s: Stratum): number {
  if (s.di_min !== undefined && s.di_max !== undefined) {
    return (s.di_min + s.di_max) / 2;
  }
  // rank 1 (más degradado) → DI ≈ 1 … rank 5 (mejor) → DI ≈ 0
  return (5 - s.degradation_rank) / 4;
}

// ---------------------------------------------------------------------------
// Helpers de mapa (dentro del MapContainer)
// ---------------------------------------------------------------------------

function FitToAoi({ aoi }: { aoi: StratAOI | null }): null {
  const map = useMap();
  useEffect(() => {
    if (!aoi) return;
    const b = bboxOfGeometry(aoi.geometry);
    map.fitBounds(
      [
        [b.minLat, b.minLon],
        [b.maxLat, b.maxLon],
      ],
      { padding: [20, 20] },
    );
  }, [aoi, map]);
  return null;
}

function PanToSelected({
  points,
  selectedPointId,
}: {
  points: SamplingPoint[];
  selectedPointId: string | null;
}): null {
  const map = useMap();
  // points en un ref: panear SOLO cuando cambia la selección, no cuando la
  // lista de puntos se actualiza (reemplazo, cambio de era).
  const pointsRef = useRef(points);
  pointsRef.current = points;
  useEffect(() => {
    if (!selectedPointId) return;
    const p = pointsRef.current.find((pt) => pt.point_id === selectedPointId);
    if (p) map.panTo([p.lat, p.lon]);
  }, [selectedPointId, map]);
  return null;
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export default function Land_Stratify_MapView({
  aoi,
  results,
  activeEra,
  selectedPointId,
  onSelectPoint,
}: MapViewProps): JSX.Element {
  const result = results[activeEra];

  /** Estratos del resultado activo, ordenados por degradation_rank (canónico). */
  const strataSorted = useMemo<Stratum[]>(
    () =>
      result ? [...result.strata].sort((a, b) => a.degradation_rank - b.degradation_rank) : [],
    [result],
  );

  /** Color de estrato por degradation_rank (nunca por stratum_id crudo). */
  const colorByRank = useMemo<Map<DegradationRank, string>>(() => {
    const m = new Map<DegradationRank, string>();
    for (const s of strataSorted) m.set(s.degradation_rank, s.color_hex);
    return m;
  }, [strataSorted]);

  return (
    <div className="relative h-full w-full">
      <MapContainer
        key="land-stratify-map"
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom
        className="h-full w-full"
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Satélite (Esri)">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="OpenStreetMap">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
          </LayersControl.BaseLayer>

          {aoi && (
            <LayersControl.Overlay checked name="Perímetro AOI">
              <Polygon
                positions={ringToLatLngs(aoi.geometry.coordinates[0] ?? [])}
                pathOptions={{ fill: false, color: '#BFF179', weight: 3 }}
              />
            </LayersControl.Overlay>
          )}

          {aoi && aoi.potreros.length > 0 && (
            <LayersControl.Overlay checked name="Potreros / campos">
              <LayerGroup>
                {aoi.potreros.map((pot, i) => (
                  <Polygon
                    key={`${pot.name}-${i}`}
                    positions={polygonToLatLngs(pot.geometry)}
                    pathOptions={{ fill: false, color: 'white', weight: 1.5, dashArray: '6 6' }}
                  >
                    <Tooltip>{pot.name}</Tooltip>
                  </Polygon>
                ))}
              </LayerGroup>
            </LayersControl.Overlay>
          )}

          {result && (
            <LayersControl.Overlay checked name="Estratos">
              <LayerGroup>
                {strataSorted.map((s) => (
                  <Polygon
                    key={s.id}
                    positions={multiPolygonToLatLngs(s.geometry)}
                    pathOptions={{
                      color: 'transparent',
                      weight: 0,
                      fillColor: s.color_hex,
                      fillOpacity: 0.55,
                    }}
                  >
                    <Tooltip sticky>{s.name}</Tooltip>
                  </Polygon>
                ))}
              </LayerGroup>
            </LayersControl.Overlay>
          )}

          {activeEra === 'era2_di' && result && (
            <LayersControl.Overlay name="DI (continuo)">
              <LayerGroup>
                {strataSorted.map((s) => (
                  <Polygon
                    key={`di-${s.id}`}
                    positions={multiPolygonToLatLngs(s.geometry)}
                    pathOptions={{
                      color: 'transparent',
                      weight: 0,
                      fillColor: diColor(diMid(s)),
                      fillOpacity: 0.65,
                    }}
                  />
                ))}
              </LayerGroup>
            </LayersControl.Overlay>
          )}

          {result && (
            <LayersControl.Overlay checked name="Puntos de muestreo">
              <LayerGroup>
                {result.points.map((p) => {
                  const fill = colorByRank.get(p.degradation_rank) ?? rankColor(p.degradation_rank);
                  const replaced = p.qa_status === 'replaced';
                  const activeFlags = FLAG_LABELS.filter((f) => p.flags[f.key]);
                  return (
                    <CircleMarker
                      key={p.id}
                      center={[p.lat, p.lon]}
                      radius={POINT_RADIUS[p.point_type]}
                      pathOptions={{
                        fillColor: fill,
                        color: POINT_TYPE_RING[p.point_type],
                        weight: 2,
                        opacity: replaced ? 0.35 : 1,
                        fillOpacity: replaced ? 0.35 : 0.9,
                      }}
                      eventHandlers={{ click: () => onSelectPoint(p.point_id) }}
                    >
                      <Popup>
                        <div className="min-w-[190px] space-y-1 text-xs">
                          <div className="font-mono text-[13px] font-bold text-forest">
                            {p.point_id}
                          </div>
                          <div>
                            <span className="text-brandGrey">Tipo:</span>{' '}
                            {POINT_TYPE_LABEL[p.point_type]}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span
                              className="inline-block h-2.5 w-2.5 shrink-0 rounded-[3px]"
                              style={{ backgroundColor: fill }}
                            />
                            <span>{stratumName(p.degradation_rank)}</span>
                          </div>
                          <div>
                            <span className="text-brandGrey">Lat/Lon:</span> {p.lat.toFixed(5)},{' '}
                            {p.lon.toFixed(5)}
                          </div>
                          {p.elevation !== undefined && (
                            <div>
                              <span className="text-brandGrey">Elevación:</span>{' '}
                              {fmtNum(p.elevation, 0)} m
                            </div>
                          )}
                          {p.soc_pred_tc_ha !== undefined && (
                            <div>
                              <span className="text-brandGrey">SOC pred:</span>{' '}
                              {fmtNum(p.soc_pred_tc_ha, 1)} tC/ha
                            </div>
                          )}
                          {p.ndvi !== undefined && (
                            <div>
                              <span className="text-brandGrey">NDVI:</span>{' '}
                              {p.ndvi.toLocaleString('es-AR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </div>
                          )}
                          <div>
                            <span className="text-brandGrey">QA:</span> {QA_LABEL[p.qa_status]}
                          </div>
                          {activeFlags.length > 0 && (
                            <div>
                              <span className="text-brandGrey">Flags:</span>
                              <ul className="mt-0.5 list-disc pl-4 text-customRed">
                                {activeFlags.map((f) => (
                                  <li key={f.key}>{f.label}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </Popup>
                    </CircleMarker>
                  );
                })}
              </LayerGroup>
            </LayersControl.Overlay>
          )}
        </LayersControl>

        <FitToAoi aoi={aoi} />
        <PanToSelected points={result?.points ?? []} selectedPointId={selectedPointId} />
      </MapContainer>

      {/* Leyenda */}
      <div className="absolute bottom-3 left-3 z-[1000] max-w-[220px] rounded-cardSm bg-white/95 p-3 text-xs shadow-card">
        {result ? (
          <div className="space-y-1">
            {strataSorted.map((s) => (
              <div key={s.id} className="flex items-center gap-2">
                <span
                  className="h-3 w-3 shrink-0 rounded-[4px]"
                  style={{ backgroundColor: s.color_hex }}
                />
                <span className="min-w-0 flex-1 truncate text-forest">{s.name}</span>
                <span className="shrink-0 text-brandGrey">{fmtNum(s.pct, 1)}%</span>
              </div>
            ))}
            <div className="my-2 border-t border-forest/10" />
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 shrink-0 rounded-pill bg-forest" />
              <span className="text-forest">Primario</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 shrink-0 rounded-pill border-2 border-[#0518F5] bg-white" />
              <span className="text-forest">Reemplazo</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 shrink-0 rounded-pill border-2 border-[#76756E] bg-white" />
              <span className="text-forest">Alternativo</span>
            </div>
          </div>
        ) : (
          <p className="text-moss">Ejecutá una corrida para ver estratos y puntos</p>
        )}
      </div>

      {/* Hint sin AOI */}
      {!aoi && (
        <div className="pointer-events-none absolute inset-0 z-[999] flex items-center justify-center bg-forest/30 backdrop-blur-[1px]">
          <div className="rounded-cardSm bg-white px-5 py-3 text-sm font-medium text-forest shadow-card">
            Subí un KML de campo o QU para empezar
          </div>
        </div>
      )}
    </div>
  );
}
