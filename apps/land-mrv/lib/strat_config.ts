/**
 * CFG central parametrizable de Land_Stratify (spec §2.8).
 * Defaults tomados del pipeline ENTE (ENTE_VM0042_v15.js / ente_v15_di_module.py).
 * Al conectar el engine real, reconciliar estos valores con el CFG del backend.
 */

import type { DegradationRank, DiWeights, StratParams } from './strat_types';

export const CFG = {
  /** Número de clases/estratos. */
  n_classes: 5,
  /** Estratos objetivo del muestreo: los 3 más degradados (configurable). */
  target_ranks: [1, 2, 3] as DegradationRank[],
  /** HalfCI% objetivo por estrato. */
  halfci_target_pct: 10,
  /** Espaciado orientativo entre puntos (m). */
  spacing_m: 100,
  /** Distancia mínima entre puntos (m). */
  min_distance_m: 50,
  /** Reemplazos modelados por estrato, como fracción de los primarios. */
  replacement_ratio: 0.5,
  /** Puntos alternativos por estrato objetivo. */
  alternatives_per_stratum: 2,
  /** Mínimo de primarios por estrato objetivo. */
  min_points_per_stratum: 3,
  /** Pesos del Índice de Degradación (Era 2) — suman 1.0. */
  di: {
    weights: {
      ndvi_mean: 0.25,
      ndvi_trend: 0.1,
      bsi: 0.15,
      msavi2: 0.1,
      ndwi: 0.05,
      si: 0.05,
      swir: 0.05,
      soc: 0.15,
      slope: 0.1,
    } as DiWeights,
  },
  /** Resolución objetivo del grid del modo demo (celdas dentro del AOI). */
  demo_target_cells: 1800,
  /** Área mínima aceptada para un AOI (ha). */
  min_aoi_area_ha: 1,
};

export function defaultParams(era?: 'era1_kmeans' | 'era2_di'): StratParams {
  return {
    n_classes: CFG.n_classes,
    target_ranks: [...CFG.target_ranks],
    halfci_target_pct: CFG.halfci_target_pct,
    spacing_m: CFG.spacing_m,
    min_distance_m: CFG.min_distance_m,
    ...(era === 'era2_di' ? { di_weights: { ...CFG.di.weights } } : {}),
  };
}

export const ERA_LABEL: Record<'era1_kmeans' | 'era2_di', string> = {
  era1_kmeans: 'Era 1 · K-Means legacy',
  era2_di: 'Era 2 · DI armonizado',
};

export const ERA_DESCRIPTION: Record<'era1_kmeans' | 'era2_di', string> = {
  era1_kmeans:
    'Clustering K-Means (5 clases) sobre el stack espectral estandarizado (modo kmeans_legacy, v14).',
  era2_di:
    'Índice de Degradación continuo (pesos CFG) → umbrales → estratos, con matriz QU×Estrato y validación de homogeneidad VVB (modo di_armonizado, v15).',
};
