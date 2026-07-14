/**
 * Motor de huella (handoff §6):
 *
 *   emisiones (kgCO₂e) = dato_actividad × factor_de_emisión
 *
 * Funciones puras y deterministas: mismos (registro, factores) → mismo
 * resultado. El motor clasifica por categoría ISO 14064-1 y mapea a
 * GHG Protocol Scope 1/2/3. Las variables `informativa` (solar, compost)
 * se reportan APARTE y nunca netean (§6: remociones/evitadas no se netean).
 *
 * El módulo es TypeScript puro sin dependencias — portable tal cual al
 * servicio Python/FastAPI de Fase 2 (misma semántica, golden tests en
 * scripts/smoke.ts).
 */
import type {
  Calculo,
  CategoriaIso,
  Factor,
  Registro,
  ScopeGhg,
  TotalesInventario,
  VariableId,
} from './ixb_types';
import { VARIABLE_BY_ID } from './ixb_types';

export const MOTOR_VERSION = 'ixb-carbon-0.1.0';

/** Mapa variable→factor efectivo: default del catálogo + overrides del
 *  Backoffice Técnico (p.ej. asignar factor calibrado a `efluentes_tratados`). */
export type FactorPorVariable = Partial<Record<VariableId, string | null>>;

/** Cálculo de un registro. `factores` es el set vigente (locales + Climatiq). */
export function calcularRegistro(
  registro: Registro,
  factores: Record<string, Factor>,
  factorPorVariable?: FactorPorVariable
): Calculo {
  const def = VARIABLE_BY_ID[registro.variable];
  if (!def) {
    throw new Error(`Variable desconocida: ${registro.variable}`);
  }
  const base: Omit<Calculo, 'kgCO2e' | 'factorId' | 'factorSnapshot'> = {
    registroId: registro.id,
    categoriaIso: def.categoriaIso,
    scopeGhg: def.scopeGhg,
    motorVersion: MOTOR_VERSION,
  };

  const factorId =
    factorPorVariable && registro.variable in factorPorVariable
      ? (factorPorVariable[registro.variable] ?? null)
      : def.factorId;

  if (def.informativa || !factorId) {
    return { ...base, factorId: factorId ?? null, factorSnapshot: null, kgCO2e: null };
  }

  const factor = factores[factorId];
  if (!factor) {
    return { ...base, factorId, factorSnapshot: null, kgCO2e: null };
  }

  const kg = redondear(registro.valor * factor.valor);
  return {
    ...base,
    factorId: factor.id,
    factorSnapshot: {
      valor: factor.valor,
      unidad: factor.unidad,
      fuente: factor.fuente,
      vigencia: factor.vigencia,
      calibrar: factor.calibrar,
    },
    kgCO2e: kg,
  };
}

/** 3 decimales de kg — estable para hashing y suficiente para vivienda/mes. */
function redondear(kg: number): number {
  return Math.round(kg * 1000) / 1000;
}

export interface FiltroInventario {
  barrioId?: string;
  viviendaId?: string | null; // null explícito → solo áreas comunes
  periodoDesde?: string;
  periodoHasta?: string;
  estados?: Registro['estado'][];
}

export function filtrarRegistros(registros: Registro[], filtro: FiltroInventario): Registro[] {
  return registros.filter((r) => {
    if (filtro.barrioId && r.barrioId !== filtro.barrioId) return false;
    if (filtro.viviendaId !== undefined && r.viviendaId !== filtro.viviendaId) return false;
    if (filtro.periodoDesde && r.periodo < filtro.periodoDesde) return false;
    if (filtro.periodoHasta && r.periodo > filtro.periodoHasta) return false;
    if (filtro.estados && !filtro.estados.includes(r.estado)) return false;
    return true;
  });
}

const CATEGORIAS: CategoriaIso[] = [1, 2, 3, 4, 5, 6];
const SCOPES: ScopeGhg[] = [1, 2, 3];

/** Agrega cálculos a totales de inventario. Los rechazados nunca entran. */
export function agregarInventario(
  registros: Registro[],
  factores: Record<string, Factor>,
  factorPorVariable?: FactorPorVariable
): { totales: TotalesInventario; calculos: Calculo[] } {
  const incluibles = registros.filter((r) => r.estado !== 'rechazado');
  const calculos = incluibles.map((r) => calcularRegistro(r, factores, factorPorVariable));

  const porCategoriaIso = Object.fromEntries(CATEGORIAS.map((c) => [c, 0])) as Record<
    CategoriaIso,
    number
  >;
  const porScope = Object.fromEntries(SCOPES.map((s) => [s, 0])) as Record<ScopeGhg, number>;
  const porVariable: Partial<Record<VariableId, number>> = {};

  let totalKg = 0;
  let sinFactor = 0;
  let usaReferencia = false;

  calculos.forEach((c, i) => {
    if (c.kgCO2e === null) {
      const def = VARIABLE_BY_ID[incluibles[i].variable];
      if (!def.informativa) sinFactor += 1;
      return;
    }
    totalKg += c.kgCO2e;
    porCategoriaIso[c.categoriaIso] += c.kgCO2e;
    porScope[c.scopeGhg] += c.kgCO2e;
    const v = incluibles[i].variable;
    porVariable[v] = (porVariable[v] ?? 0) + c.kgCO2e;
    if (c.factorSnapshot?.calibrar) usaReferencia = true;
  });

  return {
    totales: {
      totalKg: redondear(totalKg),
      porCategoriaIso: mapRedondeo(porCategoriaIso),
      porScope: mapRedondeo(porScope),
      porVariable: Object.fromEntries(
        Object.entries(porVariable).map(([k, v]) => [k, redondear(v as number)])
      ) as Partial<Record<VariableId, number>>,
      registrosIncluidos: incluibles.length,
      registrosSinFactor: sinFactor,
      usaFactoresDeReferencia: usaReferencia,
    },
    calculos,
  };
}

function mapRedondeo<K extends string | number>(rec: Record<K, number>): Record<K, number> {
  return Object.fromEntries(
    Object.entries(rec).map(([k, v]) => [k, redondear(v as number)])
  ) as Record<K, number>;
}

/** Suma de variables informativas (solar, compost) — se muestran aparte. */
export function totalInformativa(registros: Registro[], variable: VariableId): number {
  return redondear(
    registros
      .filter((r) => r.variable === variable && r.estado !== 'rechazado')
      .reduce((acc, r) => acc + r.valor, 0)
  );
}
