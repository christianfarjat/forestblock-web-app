'use client';

/**
 * Store demo de IntegrityX Barrio.
 *
 * Fuente de verdad del MVP sin backend: estado en memoria + localStorage,
 * seeds deterministas y las MISMAS reglas que tendrá la API real:
 *  - RBAC en cada acción (ixb_rbac) + scoping por barrio/vivienda.
 *  - Máquina de estados: declarado → verificado → auditado (o rechazado).
 *  - Verificado/auditado ⇒ inmutable + hash-stamp (ixb_hash + ixb_chain).
 *  - Log de auditoría append-only (nunca se edita ni borra una entrada).
 *  - Segregación de funciones: quien audita ≠ quien verificó.
 *
 * En Fase 2 estas acciones se convierten en endpoints (misma semántica,
 * ver lib/ixb_api.ts); los componentes no cambian de contrato.
 */
import { useSyncExternalStore } from 'react';
import {
  agregarInventario,
  calcularRegistro,
  filtrarRegistros,
  type FactorPorVariable,
  type FiltroInventario,
} from './ixb_carbon';
import { getAnclaje } from './ixb_chain';
import { FACTORES_LOCALES } from './ixb_factors';
import { payloadRegistro, payloadReporte, sha256Hex } from './ixb_hash';
import { can } from './ixb_rbac';
import { construirSeed } from './ixb_seed';
import type {
  Aviso,
  Barrio,
  Calculo,
  CumplimientoRequisito,
  EntradaAuditoria,
  EstadoVerificacion,
  Evidencia,
  Factor,
  FuenteRegistro,
  HashStamp,
  Mejora,
  Meta,
  Persona,
  Registro,
  Reporte,
  RespuestaRequisito,
  VariableId,
  Vivienda,
} from './ixb_types';
import { claveRegistro, VARIABLE_BY_ID } from './ixb_types';

export const STORE_VERSION = 1;
const KEY = 'ixb-demo-v1';

export interface EstadoIxb {
  version: number;
  listo: boolean;
  barrios: Barrio[];
  viviendas: Vivienda[];
  personas: Persona[];
  factores: Factor[];
  /** Overrides variable→factor asignados por el Backoffice Técnico. */
  factorPorVariable: FactorPorVariable;
  registros: Registro[];
  mejoras: Mejora[];
  metas: Meta[];
  avisos: Aviso[];
  respuestas: RespuestaRequisito[];
  reportes: Reporte[];
  stamps: HashStamp[];
  auditoria: EntradaAuditoria[];
  personaActualId: string;
}

const VACIO: EstadoIxb = Object.freeze({
  version: STORE_VERSION,
  listo: false,
  barrios: [],
  viviendas: [],
  personas: [],
  factores: [],
  factorPorVariable: {},
  registros: [],
  mejoras: [],
  metas: [],
  avisos: [],
  respuestas: [],
  reportes: [],
  stamps: [],
  auditoria: [],
  personaActualId: '',
});

// ---------------------------------------------------------------------------
// Núcleo del store (suscripción + persistencia)
// ---------------------------------------------------------------------------

let estado: EstadoIxb = VACIO;
const listeners = new Set<() => void>();

function emitir(): void {
  listeners.forEach((l) => l());
}

function subscribe(l: () => void): () => void {
  listeners.add(l);
  return () => listeners.delete(l);
}

let persistTimer: ReturnType<typeof setTimeout> | null = null;
function persistir(): void {
  if (typeof window === 'undefined') return;
  if (persistTimer) clearTimeout(persistTimer);
  persistTimer = setTimeout(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(estado));
    } catch (e) {
      // Cuota superada (evidencia pesada): la demo sigue en memoria.
      console.warn('IXB: no se pudo persistir el estado demo', e);
    }
  }, 250);
}

function setEstado(next: EstadoIxb): void {
  estado = next;
  persistir();
  emitir();
}

/** Hook de lectura: devuelve la referencia de estado (estable entre cambios). */
export function useIxbState(): EstadoIxb {
  return useSyncExternalStore(
    subscribe,
    () => estado,
    () => VACIO
  );
}

function ahora(): string {
  return new Date().toISOString();
}

function nuevoId(pref: string): string {
  return `${pref}_${globalThis.crypto.randomUUID().slice(0, 8)}`;
}

function entrada(
  s: EstadoIxb,
  actor: Persona,
  accion: string,
  targetType: string,
  targetId: string,
  ts: string,
  antes?: string,
  despues?: string
): EntradaAuditoria {
  return {
    id: `aud_${String(s.auditoria.length).padStart(6, '0')}`,
    actor: actor.id,
    actorRol: actor.rol,
    accion,
    targetType,
    targetId,
    antes,
    despues,
    timestamp: ts,
  };
}

// ---------------------------------------------------------------------------
// Núcleos puros de transición de estado (los usan las acciones y el seed)
// ---------------------------------------------------------------------------

export function factoresRecord(s: EstadoIxb): Record<string, Factor> {
  return Object.fromEntries(s.factores.map((f) => [f.id, f]));
}

function calculoDe(s: EstadoIxb, registro: Registro): Calculo {
  return calcularRegistro(registro, factoresRecord(s), s.factorPorVariable);
}

async function selloRegistro(
  s: EstadoIxb,
  registro: Registro,
  actor: Persona,
  ts: string,
  sufijo: 'verificado' | 'auditado'
): Promise<HashStamp> {
  const payload = payloadRegistro({ ...registro, calculo: calculoDe(s, registro) });
  const sha = await sha256Hex(payload);
  const anclaje = await getAnclaje().anclar(sha);
  return {
    id: `stamp_${registro.id}_${sufijo}`,
    targetType: 'registro',
    targetId: registro.id,
    sha256: sha,
    chain: anclaje.chain,
    txHash: anclaje.txHash,
    blockNumber: anclaje.blockNumber,
    timestamp: ts,
    signer: actor.id,
    esDemo: anclaje.esDemo,
    payloadCanonico: payload,
  };
}

async function nucleoVerificar(
  s: EstadoIxb,
  actor: Persona,
  registroId: string,
  ts: string
): Promise<EstadoIxb> {
  if (!can(actor.rol, 'cambiar_estado')) throw new Error('Sin permiso para cambiar estados.');
  const reg = s.registros.find((r) => r.id === registroId);
  if (!reg) throw new Error('Registro inexistente.');
  if (reg.estado !== 'declarado') {
    throw new Error(`Solo se verifica un registro declarado (estado actual: ${reg.estado}).`);
  }
  const verificado: Registro = { ...reg, estado: 'verificado', verificadoPor: actor.id, verificadoEn: ts };
  const stamp = await selloRegistro(s, verificado, actor, ts, 'verificado');
  return {
    ...s,
    registros: s.registros.map((r) => (r.id === registroId ? verificado : r)),
    stamps: [...s.stamps, stamp],
    auditoria: [
      ...s.auditoria,
      entrada(s, actor, 'registro.verificar', 'registro', registroId, ts, 'declarado', 'verificado'),
    ],
  };
}

async function nucleoAuditar(
  s: EstadoIxb,
  actor: Persona,
  registroId: string,
  ts: string
): Promise<EstadoIxb> {
  if (!can(actor.rol, 'cambiar_estado')) throw new Error('Sin permiso para cambiar estados.');
  const reg = s.registros.find((r) => r.id === registroId);
  if (!reg) throw new Error('Registro inexistente.');
  if (reg.estado !== 'verificado') {
    throw new Error(`Solo se audita un registro verificado (estado actual: ${reg.estado}).`);
  }
  if (reg.verificadoPor === actor.id) {
    throw new Error('Segregación de funciones: quien audita debe ser distinto de quien verificó.');
  }
  const auditado: Registro = { ...reg, estado: 'auditado', auditadoPor: actor.id, auditadoEn: ts };
  const stamp = await selloRegistro(s, auditado, actor, ts, 'auditado');
  return {
    ...s,
    registros: s.registros.map((r) => (r.id === registroId ? auditado : r)),
    stamps: [...s.stamps, stamp],
    auditoria: [
      ...s.auditoria,
      entrada(s, actor, 'registro.auditar', 'registro', registroId, ts, 'verificado', 'auditado'),
    ],
  };
}

function nucleoRechazar(
  s: EstadoIxb,
  actor: Persona,
  registroId: string,
  nota: string,
  ts: string
): EstadoIxb {
  if (!can(actor.rol, 'cambiar_estado')) throw new Error('Sin permiso para cambiar estados.');
  const reg = s.registros.find((r) => r.id === registroId);
  if (!reg) throw new Error('Registro inexistente.');
  if (reg.estado === 'auditado') throw new Error('Un registro auditado no puede rechazarse.');
  if (!nota.trim()) throw new Error('El rechazo requiere una nota para el residente.');
  const rechazado: Registro = { ...reg, estado: 'rechazado', notaAuditor: nota.trim() };
  return {
    ...s,
    registros: s.registros.map((r) => (r.id === registroId ? rechazado : r)),
    auditoria: [
      ...s.auditoria,
      entrada(s, actor, 'registro.rechazar', 'registro', registroId, ts, reg.estado, 'rechazado'),
    ],
  };
}

// ---------------------------------------------------------------------------
// Boot / seed
// ---------------------------------------------------------------------------

let bootPromise: Promise<void> | null = null;

export function initIxbStore(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (!bootPromise) bootPromise = boot();
  return bootPromise;
}

async function boot(): Promise<void> {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as EstadoIxb;
      if (parsed?.version === STORE_VERSION && Array.isArray(parsed.registros)) {
        estado = { ...parsed, listo: true };
        emitir();
        return;
      }
    }
  } catch {
    // JSON corrupto o versión vieja → seed fresco
  }
  await sembrar();
}

/** ts determinista para el procesamiento seed: día 20 del mes siguiente. */
function tsSeedPara(periodo: string, hora: string): string {
  const [y, m] = periodo.split('-').map(Number);
  const d = new Date(Date.UTC(y, m, 20)); // mes siguiente (m es 1-based)
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-20T${hora}`;
}

async function sembrar(): Promise<void> {
  const seed = construirSeed();
  let s: EstadoIxb = {
    version: STORE_VERSION,
    listo: false,
    barrios: seed.barrios,
    viviendas: seed.viviendas,
    personas: seed.personas,
    factores: FACTORES_LOCALES,
    factorPorVariable: {},
    registros: seed.registros,
    mejoras: seed.mejoras,
    metas: seed.metas,
    avisos: seed.avisos,
    respuestas: seed.respuestas,
    reportes: [],
    stamps: [],
    auditoria: [],
    personaActualId: 'p_res_ana',
  };

  const diego = seed.personas.find((p) => p.id === 'p_tec_diego')!;
  const sofia = seed.personas.find((p) => p.id === 'p_tec_sofia')!;
  const porId = new Map(seed.registros.map((r) => [r.id, r]));

  for (const id of seed.paraVerificar) {
    const reg = porId.get(id)!;
    s = await nucleoVerificar(s, diego, id, tsSeedPara(reg.periodo, '10:00:00.000Z'));
  }
  for (const id of seed.paraAuditar) {
    const reg = porId.get(id)!;
    s = await nucleoAuditar(s, sofia, id, tsSeedPara(reg.periodo, '16:00:00.000Z'));
  }
  for (const { id, nota } of seed.paraRechazar) {
    const reg = porId.get(id)!;
    s = nucleoRechazar(s, diego, id, nota, tsSeedPara(reg.periodo, '11:30:00.000Z'));
  }

  estado = { ...s, listo: true };
  persistir();
  emitir();
}

export async function resetDemo(): Promise<void> {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY);
  estado = VACIO;
  emitir();
  await sembrar();
}

// ---------------------------------------------------------------------------
// Sesión demo (selector de persona — SSO IntegrityX simulado)
// ---------------------------------------------------------------------------

export function setPersonaActual(personaId: string): void {
  if (!estado.personas.some((p) => p.id === personaId)) return;
  setEstado({ ...estado, personaActualId: personaId });
}

export function personaActual(s: EstadoIxb): Persona | null {
  return s.personas.find((p) => p.id === s.personaActualId) ?? null;
}

// ---------------------------------------------------------------------------
// Acciones — carga de datos (Portal Residente / áreas comunes)
// ---------------------------------------------------------------------------

export interface InputRegistro {
  viviendaId: string | null;
  barrioId?: string; // requerido solo para áreas comunes
  variable: VariableId;
  valor: number;
  evidencia?: Evidencia[];
  periodo: string;
  fuente?: FuenteRegistro;
}

const RE_PERIODO = /^\d{4}-(0[1-9]|1[0-2])$/;

export async function guardarRegistro(actor: Persona, input: InputRegistro): Promise<Registro> {
  const def = VARIABLE_BY_ID[input.variable];
  if (!def) throw new Error('Variable desconocida.');
  if (!RE_PERIODO.test(input.periodo)) throw new Error('Período inválido (formato AAAA-MM).');
  if (!Number.isFinite(input.valor) || input.valor < 0 || input.valor > 1e7) {
    throw new Error('Valor fuera de rango.');
  }

  let barrioId: string;
  if (input.viviendaId) {
    const viv = estado.viviendas.find((v) => v.id === input.viviendaId);
    if (!viv) throw new Error('Vivienda inexistente.');
    if (def.ambito === 'barrio') throw new Error('Esta variable es de áreas comunes.');
    const esPropia = actor.viviendaId === input.viviendaId;
    if (!(esPropia ? can(actor.rol, 'cargar_registros') : can(actor.rol, 'gestionar_viviendas'))) {
      throw new Error('Solo podés cargar datos de tu vivienda.');
    }
    barrioId = viv.barrioId;
  } else {
    if (!can(actor.rol, 'cargar_areas_comunes')) {
      throw new Error('Sin permiso para cargar áreas comunes.');
    }
    if (def.ambito === 'vivienda') throw new Error('Esta variable es por vivienda.');
    barrioId = input.barrioId ?? actor.barrioId ?? '';
    if (!estado.barrios.some((b) => b.id === barrioId)) throw new Error('Barrio inexistente.');
    if (actor.barrioId && actor.barrioId !== barrioId) throw new Error('Fuera de tu barrio.');
  }

  const ts = ahora();
  const clave = claveRegistro({ barrioId, viviendaId: input.viviendaId, variable: input.variable, periodo: input.periodo });
  const existente = estado.registros.find((r) => claveRegistro(r) === clave);

  if (existente && (existente.estado === 'verificado' || existente.estado === 'auditado')) {
    throw new Error(
      `El dato de ${def.nombreSimple.toLowerCase()} de ese mes ya fue ${existente.estado}. Para corregirlo, contactá a la administración.`
    );
  }

  if (existente) {
    // Corrección de un declarado/rechazado: vuelve a declarado.
    const corregido: Registro = {
      ...existente,
      valor: input.valor,
      evidencia: [...existente.evidencia, ...(input.evidencia ?? [])],
      estado: 'declarado',
      notaAuditor: undefined,
      creadoPor: actor.id,
      creadoEn: ts,
    };
    setEstado({
      ...estado,
      registros: estado.registros.map((r) => (r.id === existente.id ? corregido : r)),
      auditoria: [
        ...estado.auditoria,
        entrada(estado, actor, 'registro.corregir', 'registro', existente.id, ts, String(existente.valor), String(input.valor)),
      ],
    });
    return corregido;
  }

  const nuevo: Registro = {
    id: nuevoId('reg'),
    barrioId,
    viviendaId: input.viviendaId,
    variable: input.variable,
    valor: input.valor,
    unidad: def.unidad,
    periodo: input.periodo,
    fuente: input.fuente ?? (input.viviendaId ? 'residente' : 'administracion'),
    estado: 'declarado',
    evidencia: input.evidencia ?? [],
    creadoPor: actor.id,
    creadoEn: ts,
  };
  setEstado({
    ...estado,
    registros: [...estado.registros, nuevo],
    auditoria: [
      ...estado.auditoria,
      entrada(estado, actor, 'registro.cargar', 'registro', nuevo.id, ts, undefined, `${input.variable}=${input.valor} ${def.unidad} (${input.periodo})`),
    ],
  });
  return nuevo;
}

// ---------------------------------------------------------------------------
// Acciones — Backoffice Técnico (estados, factores, expediente)
// ---------------------------------------------------------------------------

export async function verificarRegistro(actor: Persona, registroId: string): Promise<void> {
  setEstado(await nucleoVerificar(estado, actor, registroId, ahora()));
}

export async function auditarRegistro(actor: Persona, registroId: string): Promise<void> {
  setEstado(await nucleoAuditar(estado, actor, registroId, ahora()));
}

export function rechazarRegistro(actor: Persona, registroId: string, nota: string): void {
  setEstado(nucleoRechazar(estado, actor, registroId, nota, ahora()));
}

export function actualizarFactor(
  actor: Persona,
  factorId: string,
  cambios: Partial<Pick<Factor, 'valor' | 'fuente' | 'vigencia' | 'metodo' | 'calibrar'>>
): void {
  if (!can(actor.rol, 'gestionar_factores')) throw new Error('Sin permiso para gestionar factores.');
  const factor = estado.factores.find((f) => f.id === factorId);
  if (!factor) throw new Error('Factor inexistente.');
  if (cambios.valor !== undefined && !(Number.isFinite(cambios.valor) && cambios.valor >= 0)) {
    throw new Error('Valor de factor inválido.');
  }
  if (cambios.fuente !== undefined && !cambios.fuente.trim()) {
    throw new Error('Todo factor debe citar su fuente (regla de producto §13).');
  }
  const ts = ahora();
  const actualizado = { ...factor, ...cambios };
  setEstado({
    ...estado,
    factores: estado.factores.map((f) => (f.id === factorId ? actualizado : f)),
    auditoria: [
      ...estado.auditoria,
      entrada(
        estado,
        actor,
        'factor.actualizar',
        'factor',
        factorId,
        ts,
        JSON.stringify({ valor: factor.valor, fuente: factor.fuente, vigencia: factor.vigencia, calibrar: factor.calibrar }),
        JSON.stringify({ valor: actualizado.valor, fuente: actualizado.fuente, vigencia: actualizado.vigencia, calibrar: actualizado.calibrar })
      ),
    ],
  });
}

export function crearFactor(
  actor: Persona,
  datos: Omit<Factor, 'id' | 'origen'> & { origen?: Factor['origen'] }
): Factor {
  if (!can(actor.rol, 'gestionar_factores')) throw new Error('Sin permiso para gestionar factores.');
  if (!datos.nombre.trim() || !datos.unidad.trim()) throw new Error('Nombre y unidad son obligatorios.');
  if (!datos.fuente.trim()) throw new Error('Todo factor debe citar su fuente (regla de producto §13).');
  if (!(Number.isFinite(datos.valor) && datos.valor >= 0)) throw new Error('Valor de factor inválido.');
  const nuevo: Factor = { ...datos, origen: datos.origen ?? 'local', id: nuevoId('f_custom') };
  const ts = ahora();
  setEstado({
    ...estado,
    factores: [...estado.factores, nuevo],
    auditoria: [
      ...estado.auditoria,
      entrada(estado, actor, 'factor.crear', 'factor', nuevo.id, ts, undefined, `${nuevo.nombre} = ${nuevo.valor} ${nuevo.unidad}`),
    ],
  });
  return nuevo;
}

export function asignarFactorVariable(actor: Persona, variable: VariableId, factorId: string | null): void {
  if (!can(actor.rol, 'gestionar_factores')) throw new Error('Sin permiso para gestionar factores.');
  if (factorId && !estado.factores.some((f) => f.id === factorId)) throw new Error('Factor inexistente.');
  const antes = estado.factorPorVariable[variable] ?? VARIABLE_BY_ID[variable]?.factorId ?? null;
  const ts = ahora();
  setEstado({
    ...estado,
    factorPorVariable: { ...estado.factorPorVariable, [variable]: factorId },
    auditoria: [
      ...estado.auditoria,
      entrada(estado, actor, 'factor.asignar', 'variable', variable, ts, antes ?? 'sin factor', factorId ?? 'sin factor'),
    ],
  });
}

export function generarReporte(
  actor: Persona,
  opts: {
    tipo: Reporte['tipo'];
    barrioId: string;
    periodoDesde: string;
    periodoHasta: string;
    estadosIncluidos: EstadoVerificacion[];
  }
): Reporte {
  if (!can(actor.rol, 'generar_expediente')) throw new Error('Sin permiso para generar expedientes.');
  const registros = filtrarRegistros(estado.registros, {
    barrioId: opts.barrioId,
    periodoDesde: opts.periodoDesde,
    periodoHasta: opts.periodoHasta,
    estados: opts.estadosIncluidos,
  });
  const { totales, calculos } = agregarInventario(registros, factoresRecord(estado), estado.factorPorVariable);
  const ts = ahora();
  const reporte: Reporte = {
    id: nuevoId('rep'),
    tipo: opts.tipo,
    barrioId: opts.barrioId,
    periodoDesde: opts.periodoDesde,
    periodoHasta: opts.periodoHasta,
    estadosIncluidos: opts.estadosIncluidos,
    totales,
    calculos,
    generadoPor: actor.id,
    generadoEn: ts,
  };
  setEstado({
    ...estado,
    reportes: [...estado.reportes, reporte],
    auditoria: [
      ...estado.auditoria,
      entrada(estado, actor, 'reporte.generar', 'reporte', reporte.id, ts, undefined, `${opts.tipo} ${opts.barrioId} ${opts.periodoDesde}→${opts.periodoHasta}`),
    ],
  });
  return reporte;
}

export async function sellarReporte(actor: Persona, reporteId: string): Promise<void> {
  if (!can(actor.rol, 'generar_expediente')) throw new Error('Sin permiso para sellar reportes.');
  const rep = estado.reportes.find((r) => r.id === reporteId);
  if (!rep) throw new Error('Reporte inexistente.');
  if (rep.stampId) throw new Error('El reporte ya está sellado.');
  const payload = payloadReporte(rep);
  const sha = await sha256Hex(payload);
  const anclaje = await getAnclaje().anclar(sha);
  const ts = ahora();
  const stamp: HashStamp = {
    id: `stamp_${rep.id}`,
    targetType: 'reporte',
    targetId: rep.id,
    sha256: sha,
    chain: anclaje.chain,
    txHash: anclaje.txHash,
    blockNumber: anclaje.blockNumber,
    timestamp: ts,
    signer: actor.id,
    esDemo: anclaje.esDemo,
    payloadCanonico: payload,
  };
  setEstado({
    ...estado,
    reportes: estado.reportes.map((r) => (r.id === reporteId ? { ...r, stampId: stamp.id } : r)),
    stamps: [...estado.stamps, stamp],
    auditoria: [
      ...estado.auditoria,
      entrada(estado, actor, 'reporte.sellar', 'reporte', reporteId, ts, undefined, sha),
    ],
  });
}

// ---------------------------------------------------------------------------
// Acciones — Backoffice Gestión
// ---------------------------------------------------------------------------

export function guardarVivienda(
  actor: Persona,
  datos: Omit<Vivienda, 'id'> & { id?: string }
): Vivienda {
  if (!can(actor.rol, 'gestionar_viviendas')) throw new Error('Sin permiso para gestionar viviendas.');
  if (actor.barrioId && actor.barrioId !== datos.barrioId) throw new Error('Fuera de tu barrio.');
  if (!datos.lote.trim()) throw new Error('El lote es obligatorio.');
  const ts = ahora();
  if (datos.id) {
    const previa = estado.viviendas.find((v) => v.id === datos.id);
    if (!previa) throw new Error('Vivienda inexistente.');
    const actualizada: Vivienda = { ...previa, ...datos, id: previa.id };
    setEstado({
      ...estado,
      viviendas: estado.viviendas.map((v) => (v.id === previa.id ? actualizada : v)),
      auditoria: [
        ...estado.auditoria,
        entrada(estado, actor, 'vivienda.actualizar', 'vivienda', previa.id, ts, JSON.stringify(previa), JSON.stringify(actualizada)),
      ],
    });
    return actualizada;
  }
  const nueva: Vivienda = { ...datos, id: nuevoId('v') };
  setEstado({
    ...estado,
    viviendas: [...estado.viviendas, nueva],
    auditoria: [
      ...estado.auditoria,
      entrada(estado, actor, 'vivienda.crear', 'vivienda', nueva.id, ts, undefined, `${nueva.lote} (${nueva.tipologia})`),
    ],
  });
  return nueva;
}

export function setRespuestaRequisito(
  actor: Persona,
  requisitoId: string,
  barrioId: string,
  cumple: CumplimientoRequisito,
  nota?: string
): void {
  if (!can(actor.rol, 'responder_cuestionario')) throw new Error('Sin permiso para el cuestionario.');
  if (actor.barrioId && actor.barrioId !== barrioId) throw new Error('Fuera de tu barrio.');
  const ts = ahora();
  const previa = estado.respuestas.find((r) => r.requisitoId === requisitoId && r.barrioId === barrioId);
  const nueva: RespuestaRequisito = {
    requisitoId,
    barrioId,
    cumple,
    nota: nota?.trim() || undefined,
    actualizadoPor: actor.id,
    actualizadoEn: ts,
  };
  setEstado({
    ...estado,
    respuestas: previa
      ? estado.respuestas.map((r) => (r === previa ? nueva : r))
      : [...estado.respuestas, nueva],
    auditoria: [
      ...estado.auditoria,
      entrada(estado, actor, 'cuestionario.responder', 'requisito', `${barrioId}:${requisitoId}`, ts, previa?.cumple, cumple),
    ],
  });
}

export function agregarMeta(actor: Persona, datos: Omit<Meta, 'id' | 'creadaPor'>): void {
  if (!can(actor.rol, 'gestionar_metas')) throw new Error('Sin permiso para gestionar metas.');
  if (actor.barrioId && actor.barrioId !== datos.barrioId) throw new Error('Fuera de tu barrio.');
  const nueva: Meta = { ...datos, id: nuevoId('meta'), creadaPor: actor.id };
  const ts = ahora();
  setEstado({
    ...estado,
    metas: [...estado.metas, nueva],
    auditoria: [
      ...estado.auditoria,
      entrada(estado, actor, 'meta.crear', 'meta', nueva.id, ts, undefined, nueva.titulo),
    ],
  });
}

export function publicarAviso(actor: Persona, datos: Omit<Aviso, 'id' | 'publicadoEn' | 'autor'>): void {
  if (!can(actor.rol, 'publicar_avisos')) throw new Error('Sin permiso para publicar avisos.');
  if (actor.barrioId && actor.barrioId !== datos.barrioId) throw new Error('Fuera de tu barrio.');
  const ts = ahora();
  const nuevo: Aviso = { ...datos, id: nuevoId('av'), publicadoEn: ts, autor: actor.id };
  setEstado({
    ...estado,
    avisos: [nuevo, ...estado.avisos],
    auditoria: [
      ...estado.auditoria,
      entrada(estado, actor, 'aviso.publicar', 'aviso', nuevo.id, ts, undefined, nuevo.titulo),
    ],
  });
}

export function agregarMejora(
  actor: Persona,
  datos: { viviendaId: string; tipo: string; descripcion?: string; fecha: string }
): void {
  const viv = estado.viviendas.find((v) => v.id === datos.viviendaId);
  if (!viv) throw new Error('Vivienda inexistente.');
  const esPropia = actor.viviendaId === datos.viviendaId;
  if (!(esPropia ? can(actor.rol, 'cargar_registros') : can(actor.rol, 'gestionar_viviendas'))) {
    throw new Error('Solo podés declarar mejoras de tu vivienda.');
  }
  const ts = ahora();
  const nueva: Mejora = {
    id: nuevoId('mej'),
    viviendaId: viv.id,
    barrioId: viv.barrioId,
    tipo: datos.tipo,
    descripcion: datos.descripcion?.trim() || undefined,
    fecha: datos.fecha,
    estado: 'declarado',
    creadoPor: actor.id,
  };
  setEstado({
    ...estado,
    mejoras: [...estado.mejoras, nueva],
    auditoria: [
      ...estado.auditoria,
      entrada(estado, actor, 'mejora.declarar', 'mejora', nueva.id, ts, undefined, datos.tipo),
    ],
  });
}

export function verificarMejora(actor: Persona, mejoraId: string): void {
  if (!can(actor.rol, 'cambiar_estado')) throw new Error('Sin permiso para cambiar estados.');
  const mejora = estado.mejoras.find((m) => m.id === mejoraId);
  if (!mejora || mejora.estado !== 'declarado') throw new Error('Mejora inexistente o ya revisada.');
  const ts = ahora();
  setEstado({
    ...estado,
    mejoras: estado.mejoras.map((m) => (m.id === mejoraId ? { ...m, estado: 'verificado' } : m)),
    auditoria: [
      ...estado.auditoria,
      entrada(estado, actor, 'mejora.verificar', 'mejora', mejoraId, ts, 'declarado', 'verificado'),
    ],
  });
}

// ---------------------------------------------------------------------------
// Selectores derivados (puros — reciben el estado del hook)
// ---------------------------------------------------------------------------

export function inventarioDe(s: EstadoIxb, filtro: FiltroInventario) {
  const registros = filtrarRegistros(s.registros, filtro);
  return { registros, ...agregarInventario(registros, factoresRecord(s), s.factorPorVariable) };
}

export function serieMensual(
  s: EstadoIxb,
  filtro: Omit<FiltroInventario, 'periodoDesde' | 'periodoHasta'>,
  periodos: string[]
): { periodo: string; kg: number }[] {
  return periodos.map((periodo) => {
    const registros = filtrarRegistros(s.registros, { ...filtro, periodoDesde: periodo, periodoHasta: periodo });
    const { totales } = agregarInventario(registros, factoresRecord(s), s.factorPorVariable);
    return { periodo, kg: totales.totalKg };
  });
}

/** % de viviendas del barrio con al menos un registro en el período. */
export function participacion(
  s: EstadoIxb,
  barrioId: string,
  periodo: string
): { cargaron: number; total: number; pct: number } {
  const viviendas = s.viviendas.filter((v) => v.barrioId === barrioId);
  const conCarga = new Set(
    s.registros
      .filter((r) => r.barrioId === barrioId && r.viviendaId && r.periodo === periodo && r.estado !== 'rechazado')
      .map((r) => r.viviendaId as string)
  );
  const cargaron = viviendas.filter((v) => conCarga.has(v.id)).length;
  const total = viviendas.length;
  return { cargaron, total, pct: total ? Math.round((cargaron / total) * 100) : 0 };
}

export function stampsDe(s: EstadoIxb, targetId: string): HashStamp[] {
  return s.stamps.filter((st) => st.targetId === targetId);
}

export function nombrePersona(s: EstadoIxb, personaId: string): string {
  if (personaId.startsWith('seed:')) return 'Carga demo';
  return s.personas.find((p) => p.id === personaId)?.nombre ?? personaId;
}

/** Factor efectivo de una variable (override del técnico o default). */
export function factorEfectivo(s: EstadoIxb, variable: VariableId): Factor | null {
  const id =
    variable in s.factorPorVariable
      ? s.factorPorVariable[variable]
      : VARIABLE_BY_ID[variable]?.factorId;
  return id ? (factoresRecord(s)[id] ?? null) : null;
}
