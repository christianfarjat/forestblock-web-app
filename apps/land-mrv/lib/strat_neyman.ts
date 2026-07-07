/**
 * Asignación Neyman para el diseño de muestreo estratificado (spec §2.5.4).
 * Matemática pura y portable — misma lógica que el módulo de muestreo de
 * ENTE_VM0042_v15: n_h ∝ W_h·S_h sobre los estratos objetivo, con mínimo por
 * estrato y HalfCI% estimado por estrato (objetivo ≤ 10%).
 */

import type { DegradationRank } from './strat_types';

const Z_95 = 1.96;

export interface NeymanStratumInput {
  degradation_rank: DegradationRank;
  /** Superficie del estrato (ha). */
  area_ha: number;
  /** Desvío estándar de la variable objetivo (SOC tC/ha) dentro del estrato. */
  sd: number;
  /** Media de la variable objetivo (SOC tC/ha) dentro del estrato. */
  mean: number;
}

export interface NeymanAllocation {
  degradation_rank: DegradationRank;
  /** Peso W_h del estrato entre los objetivo. */
  weight: number;
  /** n asignado (primarios). */
  n: number;
  /** HalfCI% estimado con el n asignado. */
  halfci_pct: number;
}

export interface NeymanResult {
  allocations: NeymanAllocation[];
  total_points: number;
  /** true si todos los estratos objetivo cumplen el HalfCI% objetivo. */
  meets_target: boolean;
}

/** HalfCI% de un estrato: (z·S_h/√n) / media, en %. */
export function estimateHalfCiPct(n: number, sd: number, mean: number): number {
  if (n <= 0 || mean <= 0) return Infinity;
  return ((Z_95 * sd) / Math.sqrt(n) / mean) * 100;
}

/** n mínimo para alcanzar el HalfCI% objetivo en un estrato. */
export function nForHalfCi(sd: number, mean: number, halfciTargetPct: number): number {
  if (mean <= 0 || halfciTargetPct <= 0) return 0;
  const halfciAbs = (halfciTargetPct / 100) * mean;
  return Math.ceil(((Z_95 * sd) / halfciAbs) ** 2);
}

/**
 * Asignación Neyman sobre los estratos objetivo.
 *
 * 1. n base por estrato para cumplir el HalfCI% objetivo de forma individual.
 * 2. El total se reparte proporcional a W_h·S_h (Neyman) y se aplica el mínimo
 *    por estrato; si algún estrato queda por encima del HalfCI% objetivo, se
 *    refuerza hasta cumplirlo (cap de seguridad para no explotar el diseño).
 */
export function neymanAllocation(
  strata: NeymanStratumInput[],
  targetRanks: DegradationRank[],
  halfciTargetPct: number,
  minPerStratum: number,
  maxPerStratum = 60,
): NeymanResult {
  const target = strata.filter((s) => targetRanks.includes(s.degradation_rank) && s.area_ha > 0);
  if (target.length === 0) {
    return { allocations: [], total_points: 0, meets_target: false };
  }

  const totalArea = target.reduce((acc, s) => acc + s.area_ha, 0);
  const denom = target.reduce((acc, s) => acc + (s.area_ha / totalArea) * s.sd, 0);

  // Total requerido: máximo entre la suma de n individuales (conservador) y
  // el mínimo estructural por estrato.
  const nIndividual = target.map((s) => nForHalfCi(s.sd, s.mean, halfciTargetPct));
  const nTotal = Math.max(
    nIndividual.reduce((a, b) => a + b, 0),
    target.length * minPerStratum,
  );

  const allocations: NeymanAllocation[] = target.map((s) => {
    const weight = s.area_ha / totalArea;
    const share = denom > 0 ? (weight * s.sd) / denom : 1 / target.length;
    let n = Math.round(nTotal * share);
    n = Math.max(n, minPerStratum);
    // Refuerzo: cumplir el HalfCI% objetivo del estrato si el reparto quedó corto.
    const nNeeded = nForHalfCi(s.sd, s.mean, halfciTargetPct);
    n = Math.max(n, Math.min(nNeeded, maxPerStratum));
    n = Math.min(n, maxPerStratum);
    return {
      degradation_rank: s.degradation_rank,
      weight,
      n,
      halfci_pct: estimateHalfCiPct(n, s.sd, s.mean),
    };
  });

  const total = allocations.reduce((acc, a) => acc + a.n, 0);
  const meets = allocations.every((a) => a.halfci_pct <= halfciTargetPct + 1e-9);
  return { allocations, total_points: total, meets_target: meets };
}
