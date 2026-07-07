/**
 * Motor DEMO de Land_Stratify — simula client-side la corrida del engine GEE
 * (strat_gee_service) cuando no hay backend configurado, para poder recorrer
 * el flujo completo: KML → estratos → DI → puntos Neyman → export.
 *
 * La corrida es determinística: misma AOI + era + params ⇒ mismo resultado
 * (semilla derivada del nombre del AOI), en el espíritu de los golden tests
 * ENTE (§2.9). El engine real (ENTE_VM0042_v15.js / ente_v15_di_module.py)
 * reemplaza este módulo vía strat_api cuando NEXT_PUBLIC_STRATIFY_API_URL
 * apunta al backend.
 */

import { CFG } from './strat_config';
import {
  bboxOfGeometry,
  distanceMeters,
  distanceToRingMeters,
  geometryAreaHa,
  hashSeed,
  metersPerDegree,
  mulberry32,
  pointInPolygon,
} from './strat_geo';
import { assignDegradationRanks, rankColor, stratumName } from './strat_palette';
import { estimateHalfCiPct, neymanAllocation, type NeymanStratumInput } from './strat_neyman';
import type {
  DegradationRank,
  DiThreshold,
  Era,
  MultiPolygonGeometry,
  PointType,
  Position,
  QuMatrixRow,
  SamplingDesign,
  SamplingPoint,
  SamplingPointFlags,
  StratAOI,
  StratParams,
  StratRun,
  StratRunResult,
  Stratum,
} from './strat_types';

export type ProgressCallback = (progress: number, detail: string) => void;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

interface DemoCell {
  i: number;
  j: number;
  center: Position;
  /** Condición 0..1 (1 = mejor). Proxy del stack NDVI/SOC estandarizado. */
  condition: number;
  /** Índice de degradación 0..1 (1 = más degradado). Solo Era 2. */
  di: number;
  /** ID crudo del clusterer/umbral — arbitrario a propósito. */
  stratum_id: number;
  rank: DegradationRank;
  soc: number;
  ndvi: number;
}

interface DemoGrid {
  cells: DemoCell[];
  cellIndex: Map<string, DemoCell>;
  cols: number;
  rows: number;
  lonStep: number;
  latStep: number;
  cellAreaHa: number;
}

/** Campo suave pseudo-aleatorio (mezcla de armónicos con fases sembradas). */
function makeConditionField(seed: number): (x: number, y: number) => number {
  const rng = mulberry32(seed);
  const harmonics = Array.from({ length: 4 }, (_, k) => ({
    amp: 1 / (k + 1),
    fx: 1.5 + rng() * 3.5 * (k + 1),
    fy: 1.5 + rng() * 3.5 * (k + 1),
    px: rng() * Math.PI * 2,
    py: rng() * Math.PI * 2,
  }));
  return (x: number, y: number) => {
    let v = 0;
    for (const h of harmonics) {
      v += h.amp * Math.sin(h.fx * x + h.px) * Math.cos(h.fy * y + h.py);
    }
    return v;
  };
}

function buildGrid(aoi: StratAOI, seed: number): DemoGrid {
  const bbox = bboxOfGeometry(aoi.geometry);
  const midLat = (bbox.minLat + bbox.maxLat) / 2;
  const { mLon, mLat } = metersPerDegree(midLat);
  const widthM = Math.max(1, (bbox.maxLon - bbox.minLon) * mLon);
  const heightM = Math.max(1, (bbox.maxLat - bbox.minLat) * mLat);

  const bboxAreaHa = (widthM * heightM) / 10000;
  const insideRatio = Math.min(1, Math.max(0.05, aoi.area_ha / bboxAreaHa));
  const totalCellsNeeded = CFG.demo_target_cells / insideRatio;
  const aspect = widthM / heightM;
  const cols = Math.max(24, Math.min(110, Math.round(Math.sqrt(totalCellsNeeded * aspect))));
  const rows = Math.max(24, Math.min(110, Math.round(totalCellsNeeded / cols)));

  const lonStep = (bbox.maxLon - bbox.minLon) / cols;
  const latStep = (bbox.maxLat - bbox.minLat) / rows;
  const cellAreaHa = ((lonStep * mLon) * (latStep * mLat)) / 10000;

  const field = makeConditionField(seed);
  const cells: DemoCell[] = [];
  const cellIndex = new Map<string, DemoCell>();

  let minV = Infinity;
  let maxV = -Infinity;
  const raw: { i: number; j: number; center: Position; v: number }[] = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const lon = bbox.minLon + (i + 0.5) * lonStep;
      const lat = bbox.minLat + (j + 0.5) * latStep;
      const center: Position = [lon, lat];
      if (!pointInPolygon(center, aoi.geometry)) continue;
      const v = field(i / cols, j / rows);
      raw.push({ i, j, center, v });
      if (v < minV) minV = v;
      if (v > maxV) maxV = v;
    }
  }

  const span = maxV - minV || 1;
  const jitter = mulberry32(seed ^ 0x9e3779b9);
  for (const r of raw) {
    const condition = Math.max(0, Math.min(1, (r.v - minV) / span));
    const soc = 18 + 42 * condition + (jitter() - 0.5) * 4;
    const ndvi = 0.15 + 0.55 * condition + (jitter() - 0.5) * 0.04;
    const cell: DemoCell = {
      i: r.i,
      j: r.j,
      center: r.center,
      condition,
      di: 0,
      stratum_id: 0,
      rank: 3,
      soc,
      ndvi,
    };
    cells.push(cell);
    cellIndex.set(`${r.i}:${r.j}`, cell);
  }

  return { cells, cellIndex, cols, rows, lonStep, latStep, cellAreaHa };
}

/** Cuantiles de condición → etiquetas de cluster (simula K-Means ordenado). */
function quantileLabels(cells: DemoCell[], nClasses: number): number[] {
  const sorted = [...cells].map((c) => c.condition).sort((a, b) => a - b);
  const thresholds: number[] = [];
  for (let k = 1; k < nClasses; k++) {
    thresholds.push(sorted[Math.floor((k * sorted.length) / nClasses)]);
  }
  return cells.map((c) => {
    let label = 0;
    while (label < thresholds.length && c.condition > thresholds[label]) label++;
    return label; // 0..nClasses-1, ordenado por condición ascendente
  });
}

/** Permutación sembrada — simula que el clusterer devuelve IDs arbitrarios. */
function seededPermutation(n: number, seed: number): number[] {
  const rng = mulberry32(seed ^ 0x51ed270b);
  const perm = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }
  return perm;
}

function classifyEra1(grid: DemoGrid, nClasses: number, seed: number): void {
  const labels = quantileLabels(grid.cells, nClasses);
  // stratum_id crudo: permutación de las clases (como wekaKMeans, sin orden garantizado)
  const perm = seededPermutation(nClasses, seed);
  grid.cells.forEach((cell, idx) => {
    cell.stratum_id = perm[labels[idx]] + 1;
  });
}

interface DiBinEdge {
  /** stratum_id crudo del bin (1 = "DI bajo (mejor)" — caso busnadiego a propósito). */
  stratum_id: number;
  di_min: number;
  di_max: number;
}

function classifyEra2(grid: DemoGrid, nClasses: number, seed: number): DiBinEdge[] {
  const noise = mulberry32(seed ^ 0x7f4a7c15);
  for (const cell of grid.cells) {
    cell.di = Math.max(0, Math.min(1, 1 - cell.condition + (noise() - 0.5) * 0.08));
  }
  const dis = grid.cells.map((c) => c.di);
  const diMin = Math.min(...dis);
  const diMax = Math.max(...dis);
  const width = (diMax - diMin) / nClasses || 1;

  // stratum_id crudo por bin de DI ascendente: id 1 = "DI bajo (mejor)" —
  // reproduce el caso busnadiego que el re-ranking canónico debe corregir.
  for (const cell of grid.cells) {
    const bin = Math.min(nClasses - 1, Math.floor((cell.di - diMin) / width));
    cell.stratum_id = bin + 1;
  }

  const edges: DiBinEdge[] = [];
  for (let bin = 0; bin < nClasses; bin++) {
    edges.push({
      stratum_id: bin + 1,
      di_min: diMin + bin * width,
      di_max: bin === nClasses - 1 ? diMax : diMin + (bin + 1) * width,
    });
  }
  return edges;
}

const DI_LABEL_SCALE = ['DI muy alto', 'DI alto', 'DI medio', 'DI bajo', 'DI muy bajo'];

/**
 * Tabla de umbrales DI (evidencia VVB) construida DESPUÉS del re-ranking
 * canónico: solo bins poblados, con el mismo rank que sus estratos y labels
 * relativos (peor = "DI muy alto" … mejor = "DI muy bajo"). Mantiene la tabla
 * consistente con los estratos aunque un bin quede vacío.
 */
function buildDiThresholds(
  edges: DiBinEdge[],
  rankMap: Map<number, DegradationRank>,
): DiThreshold[] {
  const populated = edges.filter((e) => rankMap.has(e.stratum_id));
  const sorted = [...populated].sort(
    (a, b) => (rankMap.get(a.stratum_id) ?? 3) - (rankMap.get(b.stratum_id) ?? 3),
  );
  const k = sorted.length;
  return sorted.map((e, idx) => ({
    degradation_rank: rankMap.get(e.stratum_id) as DegradationRank,
    di_min: e.di_min,
    di_max: e.di_max,
    label: DI_LABEL_SCALE[k <= 1 ? 0 : Math.round((idx * 4) / (k - 1))],
  }));
}

/**
 * Re-ranking canónico (§2.4): ordena los stratum_id crudos por condición media
 * ascendente y asigna rank 1 (rojo, peor) … 5 (verde oscuro, mejor).
 */
function applyCanonicalRanks(grid: DemoGrid): Map<number, DegradationRank> {
  const byId = new Map<number, { sum: number; n: number }>();
  for (const cell of grid.cells) {
    const acc = byId.get(cell.stratum_id) ?? { sum: 0, n: 0 };
    acc.sum += cell.condition;
    acc.n += 1;
    byId.set(cell.stratum_id, acc);
  }
  const clusters = Array.from(byId.entries()).map(([stratum_id, acc]) => ({
    stratum_id,
    condition_score: acc.sum / acc.n,
  }));
  const rankMap = assignDegradationRanks(clusters);
  for (const cell of grid.cells) {
    cell.rank = rankMap.get(cell.stratum_id) ?? 3;
  }
  return rankMap;
}

/** Une celdas contiguas de una misma fila y rank en rectángulos (menos polígonos). */
function rankGeometry(grid: DemoGrid, rank: DegradationRank, bboxMin: Position): MultiPolygonGeometry {
  const polys: Position[][][] = [];
  const byRow = new Map<number, number[]>();
  for (const cell of grid.cells) {
    if (cell.rank !== rank) continue;
    const row = byRow.get(cell.j) ?? [];
    row.push(cell.i);
    byRow.set(cell.j, row);
  }
  for (const [j, cols] of byRow) {
    cols.sort((a, b) => a - b);
    let runStart = cols[0];
    let prev = cols[0];
    const flushRun = (endI: number) => {
      const lon0 = bboxMin[0] + runStart * grid.lonStep;
      const lon1 = bboxMin[0] + (endI + 1) * grid.lonStep;
      const lat0 = bboxMin[1] + j * grid.latStep;
      const lat1 = bboxMin[1] + (j + 1) * grid.latStep;
      polys.push([
        [
          [lon0, lat0],
          [lon1, lat0],
          [lon1, lat1],
          [lon0, lat1],
          [lon0, lat0],
        ],
      ]);
    };
    for (let k = 1; k < cols.length; k++) {
      if (cols[k] !== prev + 1) {
        flushRun(prev);
        runStart = cols[k];
      }
      prev = cols[k];
    }
    flushRun(prev);
  }
  return { type: 'MultiPolygon', coordinates: polys };
}

function std(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const v = values.reduce((acc, x) => acc + (x - mean) ** 2, 0) / (values.length - 1);
  return Math.sqrt(v);
}

function pointFlags(
  grid: DemoGrid,
  cell: DemoCell,
  p: Position,
  aoi: StratAOI,
  spacingM: number,
): SamplingPointFlags {
  // Distancia al borde considerando también los huecos del AOI.
  const distBoundary = Math.min(
    ...aoi.geometry.coordinates.map((ring) => distanceToRingMeters(p, ring)),
  );
  const neighbors = [
    grid.cellIndex.get(`${cell.i - 1}:${cell.j}`),
    grid.cellIndex.get(`${cell.i + 1}:${cell.j}`),
    grid.cellIndex.get(`${cell.i}:${cell.j - 1}`),
    grid.cellIndex.get(`${cell.i}:${cell.j + 1}`),
  ];
  const nearStrata = neighbors.some((n) => n !== undefined && n.rank !== cell.rank);
  return {
    near_aoi_boundary: distBoundary < spacingM,
    near_strata_boundary: nearStrata,
    on_road: false,
  };
}

function samplePointsForRank(
  grid: DemoGrid,
  rank: DegradationRank,
  counts: { primary: number; replacement: number; alternative: number },
  params: StratParams,
  aoi: StratAOI,
  designId: string,
  rankToRawId: Map<DegradationRank, number>,
  placed: Position[],
  rng: () => number,
): SamplingPoint[] {
  const cells = grid.cells.filter((c) => c.rank === rank);
  // Orden sembrado de candidatos (Fisher–Yates)
  const order = [...cells];
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const out: SamplingPoint[] = [];
  const seq: Record<PointType, number> = { primary: 0, replacement: 0, alternative: 0 };
  const prefix: Record<PointType, string> = { primary: 'P', replacement: 'R', alternative: 'A' };

  const wanted: PointType[] = [
    ...Array(counts.primary).fill('primary' as PointType),
    ...Array(counts.replacement).fill('replacement' as PointType),
    ...Array(counts.alternative).fill('alternative' as PointType),
  ];

  // Cada punto reintenta sobre TODAS las celdas del estrato (wrap-around):
  // un candidato rechazado por jitter/min_distance no se consume para siempre.
  let start = 0;
  for (const type of wanted) {
    let placedOk = false;
    for (let k = 0; k < order.length && !placedOk; k++) {
      const cell = order[(start + k) % order.length];
      const jlon = (rng() - 0.5) * grid.lonStep * 0.6;
      const jlat = (rng() - 0.5) * grid.latStep * 0.6;
      const p: Position = [cell.center[0] + jlon, cell.center[1] + jlat];
      if (!pointInPolygon(p, aoi.geometry)) continue;
      const tooClose = placed.some((q) => distanceMeters(p, q) < params.min_distance_m);
      if (tooClose) continue;

      start = (start + k + 1) % order.length;
      placedOk = true;
      placed.push(p);
      seq[type] += 1;
      const flags = pointFlags(grid, cell, p, aoi, params.spacing_m);
      const hasFlag = flags.near_aoi_boundary || flags.near_strata_boundary || flags.on_road;
      out.push({
        id: `pt_${designId}_${rank}_${prefix[type]}${seq[type]}`,
        design_id: designId,
        point_id: `E${rank}-${prefix[type]}${String(seq[type]).padStart(2, '0')}`,
        stratum_id: rankToRawId.get(rank) ?? rank,
        degradation_rank: rank,
        lat: p[1],
        lon: p[0],
        elevation: Math.round(250 + 180 * cell.condition + (rng() - 0.5) * 20),
        point_type: type,
        qa_status: hasFlag ? 'review' : 'ok',
        soc_pred_tc_ha: Number(cell.soc.toFixed(1)),
        ndvi: Number(cell.ndvi.toFixed(3)),
        flags,
      });
      break;
    }
  }
  return out;
}

function buildQuMatrix(grid: DemoGrid, aoi: StratAOI): QuMatrixRow[] {
  if (aoi.potreros.length === 0) return [];
  const rows: QuMatrixRow[] = [];
  for (const potrero of aoi.potreros) {
    const inside = grid.cells.filter((c) => pointInPolygon(c.center, potrero.geometry));
    if (inside.length === 0) continue;
    const pct: Record<DegradationRank, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const cell of inside) {
      pct[cell.rank] += 1;
    }
    (Object.keys(pct) as unknown as DegradationRank[]).forEach((r) => {
      pct[r] = Number(((pct[r] / inside.length) * 100).toFixed(1));
    });
    rows.push({
      unit_name: potrero.name,
      area_ha: Number(potrero.area_ha.toFixed(1)),
      pct_by_rank: pct,
    });
  }
  return rows;
}

/** Corre la estratificación demo completa para una era. */
export async function runDemoStratification(
  aoi: StratAOI,
  era: Era,
  params: StratParams,
  onProgress?: ProgressCallback,
): Promise<StratRunResult> {
  if (params.n_classes < 3 || params.n_classes > 5) {
    throw new Error('n_classes debe estar entre 3 y 5 (dominio canónico E1..E5).');
  }
  const seed = params.seed ?? hashSeed(`${aoi.name}|${aoi.area_ha.toFixed(2)}`);
  const runId = `run_demo_${era}_${seed.toString(36)}`;
  const designId = `dsg_${runId}`;
  const createdAt = new Date().toISOString();
  const aoiSlug = aoi.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const run: StratRun = {
    id: runId,
    aoi_id: aoi.id,
    era,
    params,
    status: 'running',
    progress: 5,
    created_at: createdAt,
    gcs_prefix: `gs://forestscan-stratify/${aoiSlug}/${runId}/ (demo)`,
  };

  onProgress?.(5, 'Inicializando engine (demo local, sin GEE)…');
  await sleep(250);

  onProgress?.(20, 'Construyendo stack de features y grid del AOI…');
  const grid = buildGrid(aoi, seed);
  if (grid.cells.length < 25) {
    throw new Error(
      'El AOI es demasiado chico o la geometría no contiene celdas — verificar el KML.',
    );
  }
  await sleep(250);

  let diBinEdges: DiBinEdge[] | undefined;
  if (era === 'era1_kmeans') {
    onProgress?.(45, 'Clustering K-Means (5 clases) sobre el stack estandarizado…');
    classifyEra1(grid, params.n_classes, seed);
  } else {
    onProgress?.(45, 'Calculando Índice de Degradación (DI) y umbrales…');
    diBinEdges = classifyEra2(grid, params.n_classes, seed);
  }
  await sleep(250);

  onProgress?.(60, 'Asignando degradation_rank canónico (1 = más degradado = rojo)…');
  const rankMap = applyCanonicalRanks(grid);
  const rankToRawId = new Map<DegradationRank, number>();
  for (const [rawId, rank] of rankMap) {
    rankToRawId.set(rank, rawId);
  }
  // Umbrales DI derivados del MISMO rankMap canónico que los estratos.
  const diThresholds = diBinEdges ? buildDiThresholds(diBinEdges, rankMap) : undefined;
  await sleep(150);

  onProgress?.(70, 'Calculando estadística por estrato…');
  const bbox = bboxOfGeometry(aoi.geometry);
  const bboxMin: Position = [bbox.minLon, bbox.minLat];
  const totalCells = grid.cells.length;

  const ranksPresent = Array.from(new Set(grid.cells.map((c) => c.rank))).sort(
    (a, b) => a - b,
  ) as DegradationRank[];

  const neymanInputs: NeymanStratumInput[] = [];
  const strataBase = ranksPresent.map((rank) => {
    const cells = grid.cells.filter((c) => c.rank === rank);
    const socs = cells.map((c) => c.soc);
    const meanSoc = socs.reduce((a, b) => a + b, 0) / socs.length;
    const sdSoc = std(socs);
    const meanNdvi = cells.reduce((a, c) => a + c.ndvi, 0) / cells.length;
    const areaHa = cells.length * grid.cellAreaHa;
    neymanInputs.push({ degradation_rank: rank, area_ha: areaHa, sd: sdSoc, mean: meanSoc });
    const dis = cells.map((c) => c.di);
    return {
      rank,
      cells,
      areaHa,
      pct: (cells.length / totalCells) * 100,
      meanSoc,
      sdSoc,
      meanNdvi,
      diMin: era === 'era2_di' ? Math.min(...dis) : undefined,
      diMax: era === 'era2_di' ? Math.max(...dis) : undefined,
    };
  });
  await sleep(150);

  onProgress?.(80, 'Diseño de muestreo: asignación Neyman sobre estratos objetivo…');
  const neyman = neymanAllocation(
    neymanInputs,
    params.target_ranks,
    params.halfci_target_pct,
    CFG.min_points_per_stratum,
  );
  const allocByRank = new Map(neyman.allocations.map((a) => [a.degradation_rank, a]));

  const design: SamplingDesign = {
    id: designId,
    run_id: runId,
    method: 'neyman',
    target_strata: [...params.target_ranks].sort((a, b) => a - b),
    halfci_target_pct: params.halfci_target_pct,
    spacing_m: params.spacing_m,
    min_distance_m: params.min_distance_m,
    total_points: 0,
  };

  onProgress?.(88, 'Generando primarios + reemplazos + alternativos con flags…');
  const rng = mulberry32(seed ^ 0x2545f491);
  const placed: Position[] = [];
  const points: SamplingPoint[] = [];
  for (const rank of design.target_strata) {
    const alloc = allocByRank.get(rank);
    if (!alloc) continue;
    const counts = {
      primary: alloc.n,
      replacement: Math.ceil(alloc.n * CFG.replacement_ratio),
      alternative: CFG.alternatives_per_stratum,
    };
    points.push(
      ...samplePointsForRank(grid, rank, counts, params, aoi, designId, rankToRawId, placed, rng),
    );
  }
  design.total_points = points.length;
  await sleep(200);

  // n y HalfCI% reportados con los primarios REALMENTE ubicados: si la
  // saturación espacial (min_distance vs superficie) dejó puntos afuera,
  // la tabla no debe prometer un n que el terreno no tiene.
  const actualPrimaries = new Map<DegradationRank, number>();
  for (const p of points) {
    if (p.point_type === 'primary') {
      actualPrimaries.set(p.degradation_rank, (actualPrimaries.get(p.degradation_rank) ?? 0) + 1);
    }
  }
  const shortfallRanks: DegradationRank[] = [];

  onProgress?.(95, 'Preparando exports (00_Estratos / 00_Puntos / stats)…');
  const strata: Stratum[] = strataBase.map((s) => {
    const alloc = allocByRank.get(s.rank);
    const nActual = alloc ? actualPrimaries.get(s.rank) ?? 0 : 0;
    if (alloc && nActual < alloc.n) shortfallRanks.push(s.rank);
    return {
      id: `str_${runId}_${s.rank}`,
      run_id: runId,
      stratum_id: rankToRawId.get(s.rank) ?? s.rank,
      degradation_rank: s.rank,
      name: stratumName(s.rank),
      color_hex: rankColor(s.rank),
      area_ha: Number(s.areaHa.toFixed(1)),
      pct: Number(s.pct.toFixed(1)),
      mean_ndvi: Number(s.meanNdvi.toFixed(3)),
      mean_soc: Number(s.meanSoc.toFixed(1)),
      di_min: s.diMin !== undefined ? Number(s.diMin.toFixed(3)) : undefined,
      di_max: s.diMax !== undefined ? Number(s.diMax.toFixed(3)) : undefined,
      n_neyman: nActual,
      halfci_pct:
        alloc && nActual > 0
          ? Number(estimateHalfCiPct(nActual, s.sdSoc, s.meanSoc).toFixed(1))
          : undefined,
      geometry: rankGeometry(grid, s.rank, bboxMin),
    };
  });

  const quMatrix =
    era === 'era2_di' && aoi.aoi_type === 'qu' ? buildQuMatrix(grid, aoi) : undefined;
  await sleep(150);

  run.status = 'done';
  run.progress = 100;
  run.status_detail =
    shortfallRanks.length > 0
      ? `Corrida demo completa — n ajustado por saturación espacial (min_distance) en E${shortfallRanks.join(', E')}`
      : 'Corrida demo completa';
  onProgress?.(100, 'Corrida completa.');

  return {
    run,
    aoi,
    strata,
    design,
    points,
    di_thresholds: diThresholds,
    qu_matrix: quMatrix,
  };
}
