/**
 * AOI de ejemplo para el modo demo: una QU sintética en la estepa patagónica
 * (~zona Río Negro/Chubut) con 3 campos miembros, inspirada en el caso de uso
 * ENTE (QU2 Corvalán). Sirve para recorrer el flujo sin subir un KML.
 */

import { polygonAreaHa } from './strat_geo';
import type { PolygonGeometry, StratAOI } from './strat_types';

const PERIMETER: PolygonGeometry = {
  type: 'Polygon',
  coordinates: [
    [
      [-70.62, -42.52],
      [-70.545, -42.535],
      [-70.5, -42.515],
      [-70.472, -42.545],
      [-70.478, -42.585],
      [-70.53, -42.605],
      [-70.60, -42.595],
      [-70.635, -42.56],
      [-70.62, -42.52],
    ],
  ],
};

const POTRERO_NORTE: PolygonGeometry = {
  type: 'Polygon',
  coordinates: [
    [
      [-70.61, -42.527],
      [-70.55, -42.537],
      [-70.505, -42.52],
      [-70.51, -42.555],
      [-70.60, -42.555],
      [-70.61, -42.527],
    ],
  ],
};

const POTRERO_ESTE: PolygonGeometry = {
  type: 'Polygon',
  coordinates: [
    [
      [-70.505, -42.522],
      [-70.475, -42.548],
      [-70.481, -42.582],
      [-70.51, -42.59],
      [-70.508, -42.556],
      [-70.505, -42.522],
    ],
  ],
};

const POTRERO_SUR: PolygonGeometry = {
  type: 'Polygon',
  coordinates: [
    [
      [-70.60, -42.558],
      [-70.512, -42.558],
      [-70.514, -42.592],
      [-70.532, -42.602],
      [-70.598, -42.592],
      [-70.628, -42.562],
      [-70.60, -42.558],
    ],
  ],
};

export function buildDemoAoi(): StratAOI {
  return {
    id: 'aoi_demo_qu2',
    name: 'QU Demo — Estepa Patagónica',
    aoi_type: 'qu',
    geometry: PERIMETER,
    potreros: [
      { name: 'Campo Norte', geometry: POTRERO_NORTE, area_ha: polygonAreaHa(POTRERO_NORTE) },
      { name: 'Campo Este', geometry: POTRERO_ESTE, area_ha: polygonAreaHa(POTRERO_ESTE) },
      { name: 'Campo Sur', geometry: POTRERO_SUR, area_ha: polygonAreaHa(POTRERO_SUR) },
    ],
    source_kml_uri: 'demo://qu-estepa-patagonica.kml',
    area_ha: polygonAreaHa(PERIMETER),
    created_at: new Date().toISOString(),
  };
}
