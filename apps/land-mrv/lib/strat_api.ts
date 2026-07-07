/**
 * Cliente API de Land_Stratify — endpoints de la spec §2.6 (strat_router):
 *
 *   POST /api/v2/stratify/aoi/from-kml
 *   POST /api/v2/stratify/runs
 *   GET  /api/v2/stratify/runs/{id}
 *   GET  /api/v2/stratify/runs/{id}/strata
 *   GET  /api/v2/stratify/runs/{id}/points
 *   POST /api/v2/stratify/runs/{id}/points/{pid}/replace
 *   GET  /api/v2/stratify/runs/{id}/export
 *
 * Si NEXT_PUBLIC_STRATIFY_API_URL no está configurada, el módulo corre en
 * MODO DEMO: parse KML client-side + engine simulado (strat_mock), con el
 * mismo contrato, para poder recorrer el flujo completo sin backend.
 */

import { buildAoiFromPlacemarks, parseKmlOrKmz, type GeometryValidation } from './strat_kml';
import { runDemoStratification, type ProgressCallback } from './strat_mock';
import type {
  AoiType,
  Era,
  SamplingPoint,
  StratAOI,
  StratParams,
  StratRunResult,
} from './strat_types';

const API_BASE = process.env.NEXT_PUBLIC_STRATIFY_API_URL ?? '';

export const isDemoMode = API_BASE === '';

export interface CreateAoiResponse {
  /** null si la validación de geometría falló. */
  aoi: StratAOI | null;
  validation: GeometryValidation;
}

/** Corridas demo en memoria (el backend real persiste en PostGIS). */
const demoRuns = new Map<string, StratRunResult>();

// ---------------------------------------------------------------------------
// Ingesta AOI
// ---------------------------------------------------------------------------

export async function createAoiFromKml(
  file: File,
  aoiType: AoiType,
  name?: string,
): Promise<CreateAoiResponse> {
  if (isDemoMode) {
    const parsed = await parseKmlOrKmz(file);
    if (!parsed.validation.ok) {
      return { aoi: null, validation: parsed.validation };
    }
    const aoi = buildAoiFromPlacemarks(parsed, aoiType, name);
    return { aoi, validation: parsed.validation };
  }

  const form = new FormData();
  form.append('file', file);
  form.append('aoi_type', aoiType);
  if (name) form.append('name', name);
  const res = await fetch(`${API_BASE}/api/v2/stratify/aoi/from-kml`, {
    method: 'POST',
    body: form,
  });
  if (!res.ok) {
    throw new Error(`Error ${res.status} al subir el KML: ${await res.text()}`);
  }
  const data = await res.json();
  return {
    aoi: data.aoi ?? data,
    validation: data.validation ?? { ok: true, errors: [], warnings: [] },
  };
}

// ---------------------------------------------------------------------------
// Corridas
// ---------------------------------------------------------------------------

const POLL_MS = 2500;
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * Dispara una corrida y espera el resultado completo. En modo real la corrida
 * es un background job (§2.5: nunca GEE sincrónico) — acá se postea y se
 * pollea el estado hasta `done`.
 */
export async function startStratRun(
  aoi: StratAOI,
  era: Era,
  params: StratParams,
  onProgress?: ProgressCallback,
): Promise<StratRunResult> {
  if (isDemoMode) {
    const result = await runDemoStratification(aoi, era, params, onProgress);
    demoRuns.set(result.run.id, result);
    return result;
  }

  const createRes = await fetch(`${API_BASE}/api/v2/stratify/runs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ aoi_id: aoi.id, era, params }),
  });
  if (!createRes.ok) {
    throw new Error(`Error ${createRes.status} al crear la corrida: ${await createRes.text()}`);
  }
  const { id: runId } = await createRes.json();

  // Poll del background job
  for (;;) {
    const res = await fetch(`${API_BASE}/api/v2/stratify/runs/${runId}`);
    if (!res.ok) throw new Error(`Error ${res.status} consultando la corrida ${runId}.`);
    const run = await res.json();
    onProgress?.(run.progress ?? 0, run.status_detail ?? run.status);
    if (run.status === 'error') {
      throw new Error(run.error ?? 'La corrida terminó con error.');
    }
    if (run.status === 'done') {
      const [strataRes, pointsRes] = await Promise.all([
        fetch(`${API_BASE}/api/v2/stratify/runs/${runId}/strata`),
        fetch(`${API_BASE}/api/v2/stratify/runs/${runId}/points?format=geojson`),
      ]);
      if (!strataRes.ok || !pointsRes.ok) {
        throw new Error('La corrida terminó pero falló la descarga de estratos/puntos.');
      }
      const strataData = await strataRes.json();
      const pointsData = await pointsRes.json();
      return {
        run,
        aoi,
        strata: strataData.strata ?? strataData,
        design: strataData.design ?? pointsData.design,
        points: pointsData.points ?? pointsData,
        di_thresholds: strataData.di_thresholds,
        qu_matrix: strataData.qu_matrix,
      };
    }
    await sleep(POLL_MS);
  }
}

// ---------------------------------------------------------------------------
// Reemplazo de puntos
// ---------------------------------------------------------------------------

/**
 * Reemplaza un primario por su reemplazo modelado (§2.6): el primario queda
 * `qa_status = replaced` y el primer reemplazo disponible del mismo estrato se
 * promueve a primario (con `replaces_point_id`).
 */
export async function replacePrimaryPoint(
  result: StratRunResult,
  pointId: string,
): Promise<StratRunResult> {
  if (!isDemoMode) {
    const res = await fetch(
      `${API_BASE}/api/v2/stratify/runs/${result.run.id}/points/${encodeURIComponent(pointId)}/replace`,
      { method: 'POST' },
    );
    if (!res.ok) {
      throw new Error(`Error ${res.status} al reemplazar el punto: ${await res.text()}`);
    }
    const pointsRes = await fetch(
      `${API_BASE}/api/v2/stratify/runs/${result.run.id}/points?format=geojson`,
    );
    if (!pointsRes.ok) {
      throw new Error(
        `El punto se reemplazó pero falló la recarga de puntos (${pointsRes.status}).`,
      );
    }
    const pointsData = await pointsRes.json();
    return { ...result, points: pointsData.points ?? pointsData };
  }

  const points = result.points.map((p) => ({ ...p }));
  const primary = points.find((p) => p.point_id === pointId && p.point_type === 'primary');
  if (!primary) {
    throw new Error(`No se encontró el punto primario ${pointId}.`);
  }
  if (primary.qa_status === 'replaced') {
    return result;
  }
  const replacement = points.find(
    (p) =>
      p.point_type === 'replacement' &&
      p.degradation_rank === primary.degradation_rank &&
      p.replaces_point_id === undefined &&
      p.qa_status !== 'replaced',
  );
  if (!replacement) {
    throw new Error(
      `El estrato E${primary.degradation_rank} no tiene reemplazos modelados disponibles.`,
    );
  }
  primary.qa_status = 'replaced';
  replacement.point_type = 'primary';
  replacement.replaces_point_id = primary.point_id;
  replacement.qa_status = 'ok';

  const updated: StratRunResult = { ...result, points };
  demoRuns.set(result.run.id, updated);
  return updated;
}

/** Puntos activos del diseño (primarios no reemplazados + promovidos). */
export function activePrimaries(points: SamplingPoint[]): SamplingPoint[] {
  return points.filter((p) => p.point_type === 'primary' && p.qa_status !== 'replaced');
}
