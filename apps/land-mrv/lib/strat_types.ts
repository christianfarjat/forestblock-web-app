/**
 * Land_Stratify — modelo de datos (espejo frontend del modelo Pydantic/PostGIS
 * de la spec MJM-FB-MRV-IT-001-V0 §2.4).
 *
 * Requisito canónico: `degradation_rank` (1 = más degradado = rojo … 5 = mejor =
 * verde oscuro) se calcula SIEMPRE ordenando clusters/umbrales por condición
 * ascendente (NDVI+SOC), independiente del `stratum_id` crudo del clusterer.
 * La paleta se ata a `degradation_rank`, nunca a `stratum_id`.
 */

export type Era = 'era1_kmeans' | 'era2_di';
export type AoiType = 'field' | 'qu';
export type RunStatus = 'queued' | 'running' | 'done' | 'error';
export type PointType = 'primary' | 'replacement' | 'alternative';
export type QaStatus = 'ok' | 'review' | 'replaced';
export type SamplingMethod = 'neyman' | 'proportional';
export type DegradationRank = 1 | 2 | 3 | 4 | 5;

/** GeoJSON mínimo usado por el módulo ([lon, lat]). */
export type Position = [number, number];

export interface PolygonGeometry {
  type: 'Polygon';
  coordinates: Position[][];
}

export interface MultiPolygonGeometry {
  type: 'MultiPolygon';
  coordinates: Position[][][];
}

export type StratGeometry = PolygonGeometry | MultiPolygonGeometry;

/** Subdivisión del schema KMZ unificado m14 (1 perímetro + N potreros). */
export interface StratPotrero {
  name: string;
  geometry: PolygonGeometry;
  area_ha: number;
}

export interface StratAOI {
  id: string;
  name: string;
  aoi_type: AoiType;
  parent_qu_id?: string | null;
  /** Perímetro del campo o de la QU. */
  geometry: PolygonGeometry;
  /** Potreros (field) o campos miembros (qu), si el KML los trae. */
  potreros: StratPotrero[];
  source_kml_uri?: string;
  area_ha: number;
  created_at: string;
}

export interface DiWeights {
  ndvi_mean: number;
  ndvi_trend: number;
  bsi: number;
  msavi2: number;
  ndwi: number;
  si: number;
  swir: number;
  soc: number;
  slope: number;
}

export interface StratParams {
  /** Número de clases/estratos (3..5, default 5 — el dominio canónico de rank es 1..5). */
  n_classes: number;
  /** Estratos objetivo del muestreo, por degradation_rank (default los 3 más degradados). */
  target_ranks: DegradationRank[];
  /** HalfCI% objetivo por estrato (default ≤ 10%). */
  halfci_target_pct: number;
  spacing_m: number;
  min_distance_m: number;
  /** Pesos del Índice de Degradación (solo Era 2). */
  di_weights?: DiWeights;
  /** Semilla de reproducibilidad de la corrida. */
  seed?: number;
}

export interface StratRun {
  id: string;
  aoi_id: string;
  era: Era;
  params: StratParams;
  status: RunStatus;
  /** 0..100 — progreso del background job. */
  progress: number;
  status_detail?: string;
  gcs_prefix?: string;
  error?: string;
  created_at: string;
}

export interface Stratum {
  id: string;
  run_id: string;
  /** ID crudo devuelto por el clusterer/umbral — NO usar para color ni orden. */
  stratum_id: number;
  /** 1 = más degradado (rojo) … 5 = mejor (verde oscuro). Canónico entre eras y campos. */
  degradation_rank: DegradationRank;
  name: string;
  color_hex: string;
  area_ha: number;
  pct: number;
  mean_ndvi: number;
  /** SOC medio (tC/ha, SoilGrids/predicho). */
  mean_soc: number;
  /** Rango DI del estrato (solo Era 2). */
  di_min?: number;
  di_max?: number;
  /** n asignado por Neyman (0 si el estrato no es objetivo). */
  n_neyman: number;
  /** HalfCI% estimado con el n asignado. */
  halfci_pct?: number;
  geometry: MultiPolygonGeometry;
}

export interface SamplingPointFlags {
  near_aoi_boundary: boolean;
  near_strata_boundary: boolean;
  on_road: boolean;
}

export interface SamplingPoint {
  id: string;
  design_id: string;
  /** Ej. "E1-P01" (primario), "E1-R01" (reemplazo), "E1-A01" (alternativo). */
  point_id: string;
  stratum_id: number;
  degradation_rank: DegradationRank;
  lat: number;
  lon: number;
  elevation?: number;
  point_type: PointType;
  qa_status: QaStatus;
  soc_pred_tc_ha?: number;
  ndvi?: number;
  flags: SamplingPointFlags;
  /** Si es un reemplazo promovido, point_id del primario que sustituye. */
  replaces_point_id?: string;
}

export interface SamplingDesign {
  id: string;
  run_id: string;
  method: SamplingMethod;
  /** degradation_ranks objetivo del muestreo. */
  target_strata: DegradationRank[];
  halfci_target_pct: number;
  spacing_m: number;
  min_distance_m: number;
  total_points: number;
}

/** Tabla de umbrales DI → estrato (evidencia VVB, Era 2). */
export interface DiThreshold {
  degradation_rank: DegradationRank;
  di_min: number;
  di_max: number;
  label: string;
}

/** Fila de la matriz QU×Estrato (Era 2, AOI tipo QU). */
export interface QuMatrixRow {
  unit_name: string;
  area_ha: number;
  /** % de superficie de la unidad en cada degradation_rank. */
  pct_by_rank: Record<DegradationRank, number>;
}

/** Resultado completo de una corrida, tal como lo consume la UI. */
export interface StratRunResult {
  run: StratRun;
  aoi: StratAOI;
  strata: Stratum[];
  design: SamplingDesign;
  points: SamplingPoint[];
  di_thresholds?: DiThreshold[];
  qu_matrix?: QuMatrixRow[];
}
