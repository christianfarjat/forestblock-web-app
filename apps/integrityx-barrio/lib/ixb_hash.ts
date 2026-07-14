/**
 * Serialización canónica + SHA-256 (handoff §10, paso 1).
 *
 * El sello es reproducible: mismo contenido → mismo JSON canónico → mismo
 * hash. Claves ordenadas, sin espacios, sin `undefined`. Solo el hash viaja
 * a la cadena; ningún dato personal (§13).
 */

export function canonicalJson(value: unknown): string {
  return JSON.stringify(sortValue(value));
}

function sortValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortValue);
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    return Object.fromEntries(entries.map(([k, v]) => [k, sortValue(v)]));
  }
  if (typeof value === 'number' && !Number.isFinite(value)) {
    throw new Error('canonicalJson: número no finito');
  }
  return value;
}

/** SHA-256 hex vía WebCrypto (browser y Node ≥18 exponen globalThis.crypto). */
export async function sha256Hex(text: string): Promise<string> {
  return sha256HexBytes(new TextEncoder().encode(text));
}

/** SHA-256 hex de bytes (evidencia subida: integridad del archivo). */
export async function sha256HexBytes(data: ArrayBuffer | Uint8Array): Promise<string> {
  const buf = data instanceof Uint8Array ? (data.buffer as ArrayBuffer).slice(data.byteOffset, data.byteOffset + data.byteLength) : data;
  const digest = await globalThis.crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Payload sellado de un registro: el contenido verificable, sin campos
 * volátiles de UI. Incluye el cálculo aplicado (snapshot del factor) para que
 * la verificación pública pueda reconstruir el número exacto.
 */
export function payloadRegistro(registro: {
  id: string;
  barrioId: string;
  viviendaId: string | null;
  variable: string;
  valor: number;
  unidad: string;
  periodo: string;
  fuente: string;
  estado: string;
  evidencia: { nombre: string; sha256?: string }[];
  verificadoPor?: string;
  auditadoPor?: string;
  notaAuditor?: string;
  calculo?: unknown;
}): string {
  return canonicalJson({
    tipo: 'registro',
    id: registro.id,
    barrioId: registro.barrioId,
    viviendaId: registro.viviendaId,
    variable: registro.variable,
    valor: registro.valor,
    unidad: registro.unidad,
    periodo: registro.periodo,
    fuente: registro.fuente,
    estado: registro.estado,
    evidencia: registro.evidencia.map((e) => ({ nombre: e.nombre, sha256: e.sha256 })),
    verificadoPor: registro.verificadoPor,
    auditadoPor: registro.auditadoPor,
    notaAuditor: registro.notaAuditor,
    calculo: registro.calculo,
  });
}

export function payloadReporte(reporte: {
  id: string;
  tipo: string;
  barrioId: string;
  periodoDesde: string;
  periodoHasta: string;
  estadosIncluidos: string[];
  totales: unknown;
  calculos: unknown[];
  generadoPor: string;
  generadoEn: string;
}): string {
  return canonicalJson({
    tipo: 'reporte',
    id: reporte.id,
    subtipo: reporte.tipo,
    barrioId: reporte.barrioId,
    periodoDesde: reporte.periodoDesde,
    periodoHasta: reporte.periodoHasta,
    estadosIncluidos: [...reporte.estadosIncluidos].sort(),
    totales: reporte.totales,
    calculos: reporte.calculos,
    generadoPor: reporte.generadoPor,
    generadoEn: reporte.generadoEn,
  });
}
