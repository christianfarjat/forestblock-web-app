/**
 * Estándares y cuestionario de adecuación (handoff §5.2).
 *
 * Son listas de verificación ORIENTATIVAS para preparar certificación:
 * la certificación la emite un tercero acreditado (§13). Los textos citan
 * el criterio de referencia de cada estándar.
 */
import type { CumplimientoRequisito, Estandar, Requisito, RespuestaRequisito } from './ixb_types';

export const ESTANDARES: Estandar[] = [
  {
    id: 'est_edge',
    nombre: 'EDGE (IFC) — referencia viviendas',
    descripcion:
      'Criterio de referencia 20/20/20: al menos 20% de ahorro en energía, agua y energía incorporada en materiales vs. línea base local.',
    fuente: 'EDGE Buildings — IFC (Banco Mundial)',
  },
  {
    id: 'est_iso14064',
    nombre: 'ISO 14064-1 — preparación del inventario GEI',
    descripcion:
      'Preparación del inventario de gases de efecto invernadero del barrio para verificación de tercera parte (ISO 14064-3).',
    fuente: 'ISO 14064-1:2018',
  },
  {
    id: 'est_sites',
    nombre: 'Áreas exteriores sustentables — referencia SITES',
    descripcion:
      'Buenas prácticas de paisaje: vegetación, agua, suelo y materiales en espacios comunes.',
    fuente: 'SITES v2 (GBCI) — referencia orientativa',
  },
];

export const REQUISITOS: Requisito[] = [
  // EDGE
  {
    id: 'req_edge_energia',
    estandarId: 'est_edge',
    texto: 'Ahorro de energía ≥ 20% vs. línea base local',
    ayuda: 'Medidas pasivas + eficiencia activa; se demuestra con la app EDGE y datos medidos.',
    peso: 3,
  },
  {
    id: 'req_edge_agua',
    estandarId: 'est_edge',
    texto: 'Ahorro de agua ≥ 20% vs. línea base local',
    ayuda: 'Griferías eficientes, reúso, riego eficiente.',
    peso: 3,
  },
  {
    id: 'req_edge_materiales',
    estandarId: 'est_edge',
    texto: 'Energía incorporada en materiales ≥ 20% menor',
    peso: 2,
  },
  {
    id: 'req_edge_medicion',
    estandarId: 'est_edge',
    texto: 'Medición individual de energía y agua por vivienda',
    peso: 1,
  },
  {
    id: 'req_edge_renovable',
    estandarId: 'est_edge',
    texto: 'Generación renovable en sitio',
    peso: 1,
  },
  // ISO 14064
  {
    id: 'req_iso_limites',
    estandarId: 'est_iso14064',
    texto: 'Límites del inventario definidos (organizacionales y de reporte)',
    peso: 2,
  },
  {
    id: 'req_iso_datos',
    estandarId: 'est_iso14064',
    texto: '12 meses continuos de datos de actividad',
    ayuda: 'Series completas por vivienda y áreas comunes, con evidencia.',
    peso: 3,
  },
  {
    id: 'req_iso_factores',
    estandarId: 'est_iso14064',
    texto: 'Factores de emisión con fuente y vigencia documentadas',
    peso: 3,
  },
  {
    id: 'req_iso_evidencia',
    estandarId: 'est_iso14064',
    texto: 'Evidencia digitalizada y trazable por registro',
    peso: 2,
  },
  {
    id: 'req_iso_revision',
    estandarId: 'est_iso14064',
    texto: 'Revisión técnica independiente del inventario (pre-verificación)',
    peso: 3,
  },
  {
    id: 'req_iso_remociones',
    estandarId: 'est_iso14064',
    texto: 'Remociones reportadas aparte (sin netear)',
    peso: 1,
  },
  // SITES
  {
    id: 'req_sites_nativa',
    estandarId: 'est_sites',
    texto: 'Vegetación nativa / adaptada en espacios comunes',
    peso: 2,
  },
  {
    id: 'req_sites_riego',
    estandarId: 'est_sites',
    texto: 'Riego eficiente (goteo, sensores, horarios)',
    peso: 2,
  },
  {
    id: 'req_sites_pluvial',
    estandarId: 'est_sites',
    texto: 'Gestión de agua de lluvia (retención / infiltración)',
    peso: 2,
  },
  {
    id: 'req_sites_compost',
    estandarId: 'est_sites',
    texto: 'Compostaje comunitario operativo',
    peso: 1,
  },
  {
    id: 'req_sites_luz',
    estandarId: 'est_sites',
    texto: 'Iluminación exterior eficiente y de bajo impacto',
    peso: 1,
  },
];

export const REQUISITOS_POR_ESTANDAR: Record<string, Requisito[]> = ESTANDARES.reduce(
  (acc, est) => {
    acc[est.id] = REQUISITOS.filter((r) => r.estandarId === est.id);
    return acc;
  },
  {} as Record<string, Requisito[]>
);

const VALOR_CUMPLE: Record<CumplimientoRequisito, number> = {
  si: 1,
  parcial: 0.5,
  no: 0,
  sin_dato: 0,
};

/** Score 0–100 ponderado por peso. `sin_dato` cuenta 0 (conservador). */
export function scoreEstandar(
  estandarId: string,
  barrioId: string,
  respuestas: RespuestaRequisito[]
): { pct: number; respondidos: number; total: number } {
  const reqs = REQUISITOS_POR_ESTANDAR[estandarId] ?? [];
  const byReq = new Map(
    respuestas.filter((r) => r.barrioId === barrioId).map((r) => [r.requisitoId, r])
  );
  let suma = 0;
  let pesoTotal = 0;
  let respondidos = 0;
  for (const req of reqs) {
    pesoTotal += req.peso;
    const resp = byReq.get(req.id);
    if (resp && resp.cumple !== 'sin_dato') respondidos += 1;
    suma += req.peso * VALOR_CUMPLE[resp?.cumple ?? 'sin_dato'];
  }
  return {
    pct: pesoTotal === 0 ? 0 : Math.round((suma / pesoTotal) * 100),
    respondidos,
    total: reqs.length,
  };
}
