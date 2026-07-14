/**
 * IntegrityX Barrio — modelo de datos (handoff §7) + catálogo de variables.
 *
 * Regla de producto (§13): la app NO certifica — mide, monitorea y prepara.
 * Todo dato tiene estado de verificación: declarado → verificado → auditado.
 */

// ---------------------------------------------------------------------------
// Roles (handoff §2)
// ---------------------------------------------------------------------------

export type Rol =
  | 'resident'
  | 'committee'
  | 'consortium'
  | 'barrio_admin'
  | 'developer'
  | 'tech_admin'
  | 'verifier'
  | 'superadmin';

export const ROL_LABEL: Record<Rol, string> = {
  resident: 'Residente',
  committee: 'Comité de Sostenibilidad',
  consortium: 'Consorcio',
  barrio_admin: 'Administración del barrio',
  developer: 'Desarrollador (MJM)',
  tech_admin: 'Administrador técnico (ForestBlock)',
  verifier: 'Verificador externo (solo lectura)',
  superadmin: 'Superadmin',
};

// ---------------------------------------------------------------------------
// Estados del dato (§0, §5.3) — máquina explícita
// ---------------------------------------------------------------------------

export type EstadoVerificacion = 'declarado' | 'verificado' | 'auditado' | 'rechazado';

export const ESTADO_LABEL: Record<EstadoVerificacion, string> = {
  declarado: 'Declarado',
  verificado: 'Verificado',
  auditado: 'Auditado',
  rechazado: 'Rechazado',
};

// ---------------------------------------------------------------------------
// Clasificación de inventario (§6): ISO 14064-1:2018 + mapeo GHG Protocol
// ---------------------------------------------------------------------------

export type CategoriaIso = 1 | 2 | 3 | 4 | 5 | 6;
export type ScopeGhg = 1 | 2 | 3;

export const CATEGORIA_ISO_LABEL: Record<CategoriaIso, string> = {
  1: 'Cat. 1 — Emisiones y remociones directas',
  2: 'Cat. 2 — Indirectas por energía importada',
  3: 'Cat. 3 — Indirectas por transporte',
  4: 'Cat. 4 — Indirectas por productos y servicios utilizados',
  5: 'Cat. 5 — Indirectas por uso de productos propios',
  6: 'Cat. 6 — Indirectas por otras fuentes',
};

// ---------------------------------------------------------------------------
// Entidades núcleo
// ---------------------------------------------------------------------------

export interface Barrio {
  id: string;
  nombre: string;
  ubicacion: string; // municipio / provincia (texto libre en MVP)
  descripcion?: string;
  /** GeoJSON del polígono (Fase 2 — capa satelital GEE/ForestScan). */
  geojson?: unknown;
}

export interface Vivienda {
  id: string;
  barrioId: string;
  lote: string; // identificador visible, p.ej. "TP-07"
  tipologia: string;
  superficieM2: number;
  ocupantes: number;
}

/** Usuario + su vínculo (User/UserBarrio/Propiedad del §7, aplanado para el MVP). */
export interface Persona {
  id: string;
  nombre: string;
  rol: Rol;
  email?: string;
  /** null → alcance multi-barrio (developer, tech_admin, verifier, superadmin). */
  barrioId: string | null;
  /** Solo residentes: su vivienda. */
  viviendaId: string | null;
}

export interface Evidencia {
  id: string;
  tipo: 'factura' | 'foto' | 'documento';
  nombre: string;
  /** dataURL en modo demo; URL firmada de Cloud Storage en producción. */
  url: string;
  sha256?: string;
}

export type FuenteRegistro = 'residente' | 'administracion' | 'medidor' | 'factura_ocr';

export interface Registro {
  id: string;
  barrioId: string;
  /** null → áreas comunes del barrio (alumbrado, riego, etc.). */
  viviendaId: string | null;
  variable: VariableId;
  /** Valor en la unidad canónica de la variable. */
  valor: number;
  unidad: string;
  /** Período mensual 'YYYY-MM'. Única carga por (vivienda|barrio, variable, período). */
  periodo: string;
  fuente: FuenteRegistro;
  estado: EstadoVerificacion;
  evidencia: Evidencia[];
  notaAuditor?: string;
  creadoPor: string; // personaId
  creadoEn: string; // ISO datetime
  verificadoPor?: string;
  verificadoEn?: string;
  auditadoPor?: string;
  auditadoEn?: string;
}

// ---------------------------------------------------------------------------
// Factores de emisión (§4.6) — todo factor con fuente, nada inventado (§13)
// ---------------------------------------------------------------------------

export interface Factor {
  id: string;
  nombre: string;
  origen: 'local' | 'climatiq';
  /** activity_id de Climatiq cuando aplique (Autopilot / búsqueda). */
  activityId?: string;
  region: string;
  /** kgCO₂e por unidad canónica de la variable asociada. */
  valor: number;
  unidad: string; // p.ej. 'kgCO₂e/kWh'
  /** Cita obligatoria de la fuente del factor. */
  fuente: string;
  vigencia: string;
  /** Derivación / supuestos (PCI, densidad, GWP…). */
  metodo?: string;
  /**
   * true → valor de REFERENCIA para el demo: debe reemplazarse por el factor
   * oficial vigente (o Climatiq) antes de cualquier uso real. La UI lo señala.
   */
  calibrar: boolean;
}

/** Resultado del motor (§6). En el MVP se deriva en memoria y se materializa
 *  (con snapshot de factor) al sellar un registro o generar un reporte. */
export interface Calculo {
  registroId: string;
  factorId: string | null;
  factorSnapshot: Pick<Factor, 'valor' | 'unidad' | 'fuente' | 'vigencia' | 'calibrar'> | null;
  /** null → sin factor asignado (queda excluido del total y visible como pendiente). */
  kgCO2e: number | null;
  categoriaIso: CategoriaIso;
  scopeGhg: ScopeGhg;
  motorVersion: string;
}

// ---------------------------------------------------------------------------
// Estándares y adecuación (§5.2)
// ---------------------------------------------------------------------------

export interface Estandar {
  id: string;
  nombre: string;
  descripcion: string;
  fuente: string;
}

export interface Requisito {
  id: string;
  estandarId: string;
  texto: string;
  ayuda?: string;
  peso: number;
}

export type CumplimientoRequisito = 'si' | 'parcial' | 'no' | 'sin_dato';

export interface RespuestaRequisito {
  requisitoId: string;
  barrioId: string;
  cumple: CumplimientoRequisito;
  nota?: string;
  actualizadoPor: string;
  actualizadoEn: string;
}

// ---------------------------------------------------------------------------
// Gestión: mejoras, metas, comunicación (§5.1 / §5.2)
// ---------------------------------------------------------------------------

export interface Mejora {
  id: string;
  viviendaId: string;
  barrioId: string;
  tipo: string; // key de MEJORA_TIPOS
  descripcion?: string;
  fecha: string; // 'YYYY-MM'
  estado: EstadoVerificacion;
  creadoPor: string;
}

export const MEJORA_TIPOS: Record<string, { label: string; icono: string }> = {
  termotanque_solar: { label: 'Termotanque solar', icono: '☀️' },
  paneles: { label: 'Paneles fotovoltaicos', icono: '🔆' },
  aislacion: { label: 'Aislación térmica', icono: '🧱' },
  led: { label: 'Iluminación 100% LED', icono: '💡' },
  riego_goteo: { label: 'Riego por goteo', icono: '💧' },
  compostera: { label: 'Compostera domiciliaria', icono: '🪱' },
  biodigestor: { label: 'Biodigestor', icono: '♻️' },
};

export interface Meta {
  id: string;
  barrioId: string;
  titulo: string;
  kpi: 'huella_por_vivienda' | 'participacion' | 'energia_red' | 'agua_red' | 'residuos_relleno';
  /** Valor objetivo del KPI (en la unidad del KPI; para % usar 0–100). */
  objetivo: number;
  unidad: string;
  plazo: string; // 'YYYY-MM'
  creadaPor: string;
}

export interface Aviso {
  id: string;
  barrioId: string;
  tipo: 'aviso' | 'encuesta' | 'capacitacion';
  titulo: string;
  cuerpo: string;
  publicadoEn: string;
  autor: string;
}

// ---------------------------------------------------------------------------
// Integridad: hash-stamp (§10) y auditoría append-only (§8)
// ---------------------------------------------------------------------------

export interface HashStamp {
  id: string;
  targetType: 'registro' | 'reporte';
  targetId: string;
  sha256: string;
  chain: 'polygon-demo' | 'polygon' | 'opentimestamps';
  txHash: string;
  blockNumber?: number;
  timestamp: string;
  signer: string;
  /** true → anclaje SIMULADO (demo). La UI lo comunica siempre. */
  esDemo: boolean;
  /** JSON canónico sellado — transparencia y verificación pública en demo. */
  payloadCanonico: string;
}

export interface EntradaAuditoria {
  id: string;
  actor: string; // personaId
  actorRol: Rol;
  accion: string;
  targetType: string;
  targetId: string;
  antes?: string;
  despues?: string;
  timestamp: string;
}

// ---------------------------------------------------------------------------
// Expediente / reportes (§5.3)
// ---------------------------------------------------------------------------

export interface TotalesInventario {
  totalKg: number;
  porCategoriaIso: Record<CategoriaIso, number>;
  porScope: Record<ScopeGhg, number>;
  porVariable: Partial<Record<VariableId, number>>;
  registrosIncluidos: number;
  registrosSinFactor: number;
  usaFactoresDeReferencia: boolean;
}

export interface Reporte {
  id: string;
  tipo: 'inventario_iso' | 'expediente_certificacion';
  barrioId: string;
  periodoDesde: string;
  periodoHasta: string;
  /** Solo registros en estos estados entran al inventario del expediente. */
  estadosIncluidos: EstadoVerificacion[];
  totales: TotalesInventario;
  /** Snapshot completo de cálculos (registro + factor usado) — reproducibilidad. */
  calculos: Calculo[];
  generadoPor: string;
  generadoEn: string;
  stampId?: string;
}

// ---------------------------------------------------------------------------
// Catálogo de variables de carga (§5.1) — lenguaje simple para residentes
// ---------------------------------------------------------------------------

export type VariableId =
  | 'energia_red'
  | 'solar_autoconsumo'
  | 'gas_natural'
  | 'glp'
  | 'combustible_nafta'
  | 'combustible_gasoil'
  | 'agua_red'
  | 'efluentes_tratados'
  | 'residuos_relleno'
  | 'compost';

export interface VariableDef {
  id: VariableId;
  nombre: string; // técnico
  nombreSimple: string; // portal residente
  icono: string;
  unidad: string; // canónica
  ayuda: string; // lenguaje llano, sin jerga
  ambito: 'vivienda' | 'barrio' | 'ambos';
  categoriaIso: CategoriaIso;
  scopeGhg: ScopeGhg;
  /** null → sin factor asignado (p.ej. pendiente de calibración técnica). */
  factorId: string | null;
  /** true → no suma huella: se muestra aparte (§6: no netear). */
  informativa?: boolean;
}

export const VARIABLES: VariableDef[] = [
  {
    id: 'energia_red',
    nombre: 'Electricidad de red',
    nombreSimple: 'Luz (electricidad)',
    icono: '⚡',
    unidad: 'kWh',
    ayuda: 'Los kWh del mes están en tu factura de luz, o podés sacar una foto y la leemos.',
    ambito: 'ambos',
    categoriaIso: 2,
    scopeGhg: 2,
    factorId: 'f_elec_ar',
  },
  {
    id: 'solar_autoconsumo',
    nombre: 'Generación solar autoconsumida',
    nombreSimple: 'Energía solar generada',
    icono: '🔆',
    unidad: 'kWh',
    ayuda: 'Si tenés paneles: cuánta energía generaste este mes (lo dice el inversor o la app).',
    ambito: 'vivienda',
    categoriaIso: 2,
    scopeGhg: 2,
    factorId: null,
    informativa: true,
  },
  {
    id: 'gas_natural',
    nombre: 'Gas natural de red',
    nombreSimple: 'Gas de red',
    icono: '🔥',
    unidad: 'm³',
    ayuda: 'Los m³ del mes figuran en tu factura de gas.',
    ambito: 'vivienda',
    categoriaIso: 1,
    scopeGhg: 1,
    factorId: 'f_gas_natural',
  },
  {
    id: 'glp',
    nombre: 'GLP (garrafa / zeppelin)',
    nombreSimple: 'Garrafa o zeppelin (GLP)',
    icono: '🫙',
    unidad: 'kg',
    ayuda: 'Kilos de gas envasado que usaste en el mes (una garrafa común trae 10 kg).',
    ambito: 'vivienda',
    categoriaIso: 1,
    scopeGhg: 1,
    factorId: 'f_glp',
  },
  {
    id: 'combustible_nafta',
    nombre: 'Nafta (vehículos del hogar)',
    nombreSimple: 'Nafta que cargaste',
    icono: '⛽',
    unidad: 'L',
    ayuda: 'Litros de nafta que cargaste en el mes para los autos o la moto de tu casa.',
    ambito: 'vivienda',
    categoriaIso: 3,
    scopeGhg: 3,
    factorId: 'f_nafta',
  },
  {
    id: 'combustible_gasoil',
    nombre: 'Gasoil (vehículos del hogar)',
    nombreSimple: 'Gasoil que cargaste',
    icono: '🛻',
    unidad: 'L',
    ayuda: 'Litros de gasoil del mes (camioneta, generador, maquinaria).',
    ambito: 'ambos',
    categoriaIso: 3,
    scopeGhg: 3,
    factorId: 'f_gasoil',
  },
  {
    id: 'agua_red',
    nombre: 'Agua de red',
    nombreSimple: 'Agua',
    icono: '🚿',
    unidad: 'm³',
    ayuda: 'Los m³ del mes están en la factura o el medidor de agua.',
    ambito: 'ambos',
    categoriaIso: 4,
    scopeGhg: 3,
    factorId: 'f_agua',
  },
  {
    id: 'efluentes_tratados',
    nombre: 'Efluentes tratados (biodigestor)',
    nombreSimple: 'Biodigestor',
    icono: '♻️',
    unidad: 'm³',
    ayuda: 'Si tu casa trata efluentes con biodigestor: m³ tratados en el mes (aprox.).',
    ambito: 'ambos',
    categoriaIso: 1,
    scopeGhg: 1,
    // Sin factor en el MVP a propósito: requiere calibración técnica (IPCC 2019
    // Refinement, cap. 6 — aguas residuales). El Backoffice Técnico puede asignarlo.
    factorId: null,
  },
  {
    id: 'residuos_relleno',
    nombre: 'Residuos a relleno sanitario',
    nombreSimple: 'Basura que sacaste',
    icono: '🗑️',
    unidad: 'kg',
    ayuda: 'Kilos de basura común del mes (una bolsa grande llena pesa unos 5 kg).',
    ambito: 'ambos',
    categoriaIso: 4,
    scopeGhg: 3,
    factorId: 'f_residuos',
  },
  {
    id: 'compost',
    nombre: 'Orgánicos compostados',
    nombreSimple: 'Compost',
    icono: '🪱',
    unidad: 'kg',
    ayuda: 'Kilos de restos orgánicos que compostaste en lugar de tirar a la basura.',
    ambito: 'ambos',
    categoriaIso: 4,
    scopeGhg: 3,
    factorId: null,
    informativa: true,
  },
];

export const VARIABLE_BY_ID: Record<string, VariableDef> = Object.fromEntries(
  VARIABLES.map((v) => [v.id, v])
);

/** Período 'YYYY-MM' → clave de unicidad de un registro. */
export function claveRegistro(r: Pick<Registro, 'barrioId' | 'viviendaId' | 'variable' | 'periodo'>): string {
  return `${r.barrioId}|${r.viviendaId ?? 'comunes'}|${r.variable}|${r.periodo}`;
}
