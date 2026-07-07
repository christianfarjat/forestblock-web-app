/**
 * Paleta canónica de estratos — atada a `degradation_rank`, NUNCA a `stratum_id`.
 * 1 = más degradado = rojo … 5 = mejor condición = verde oscuro (spec §2.4).
 * Resuelve la inconsistencia busnadiego↔msierra (E1 "DI Bajo mejor" debe
 * re-rankearse, no colorearse como rojo).
 */

import type { DegradationRank, PointType } from './strat_types';

export const STRAT_PALETTE: Record<DegradationRank, string> = {
  1: '#C62D1F', // rojo — muy degradado
  2: '#E07B27', // naranja
  3: '#E8C531', // amarillo
  4: '#8FBC5A', // verde claro
  5: '#2E5D3C', // verde oscuro — mejor condición
};

export const STRAT_RANK_LABEL: Record<DegradationRank, string> = {
  1: 'Muy degradado',
  2: 'Degradado',
  3: 'Moderado',
  4: 'Bueno',
  5: 'Muy bueno',
};

/** Nombre canónico del estrato: la numeración E1..E5 sigue al rank, no al clusterer. */
export function stratumName(rank: DegradationRank): string {
  return `E${rank} · ${STRAT_RANK_LABEL[rank]}`;
}

export function rankColor(rank: DegradationRank): string {
  return STRAT_PALETTE[rank];
}

/**
 * Asigna degradation_rank canónico a clusters crudos ordenándolos por condición
 * ascendente (NDVI+SOC): el cluster de peor condición recibe rank 1 (rojo).
 * Independiente del stratum_id que devuelva el clusterer.
 */
export function assignDegradationRanks<T extends { stratum_id: number; condition_score: number }>(
  clusters: T[],
): Map<number, DegradationRank> {
  const orden = [...clusters].sort((a, b) => a.condition_score - b.condition_score);
  const map = new Map<number, DegradationRank>();
  orden.forEach((c, i) => {
    map.set(c.stratum_id, (Math.min(i, 4) + 1) as DegradationRank);
  });
  return map;
}

/**
 * Rampa continua para el raster DI (12_DI), en tonos verdes:
 * DI 0 = mejor condición (verde profundo) … DI 1 = más degradado (pálido).
 */
const DI_RAMP: [number, string][] = [
  [0.0, '#1E4D2B'],
  [0.25, '#4E7B3A'],
  [0.5, '#8FBC5A'],
  [0.75, '#C9DC8A'],
  [1.0, '#EFF5D2'],
];

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function rgbToHex([r, g, b]: [number, number, number]): string {
  const c = (v: number) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}

/** Color del DI continuo (0 = mejor, 1 = más degradado). */
export function diColor(di: number): string {
  const v = Math.max(0, Math.min(1, di));
  for (let i = 0; i < DI_RAMP.length - 1; i++) {
    const [t0, c0] = DI_RAMP[i];
    const [t1, c1] = DI_RAMP[i + 1];
    if (v <= t1) {
      const f = t1 === t0 ? 0 : (v - t0) / (t1 - t0);
      const a = hexToRgb(c0);
      const b = hexToRgb(c1);
      return rgbToHex([
        a[0] + (b[0] - a[0]) * f,
        a[1] + (b[1] - a[1]) * f,
        a[2] + (b[2] - a[2]) * f,
      ]);
    }
  }
  return DI_RAMP[DI_RAMP.length - 1][1];
}

export const POINT_TYPE_LABEL: Record<PointType, string> = {
  primary: 'Primario',
  replacement: 'Reemplazo',
  alternative: 'Alternativo',
};

/** Color del anillo/ícono del punto según tipo (el relleno usa el color del estrato). */
export const POINT_TYPE_RING: Record<PointType, string> = {
  primary: '#182D1F',
  replacement: '#0518F5',
  alternative: '#76756E',
};
