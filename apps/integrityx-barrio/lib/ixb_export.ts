/**
 * Exports del expediente de certificación (§5.3): JSON completo (con
 * cálculos, factores snapshot y sello) y CSV para planilla del verificador.
 */
import { canonicalJson } from './ixb_hash';
import type { HashStamp, Registro, Reporte } from './ixb_types';
import { CATEGORIA_ISO_LABEL, VARIABLE_BY_ID } from './ixb_types';

export function descargarArchivo(nombre: string, contenido: string, mime: string): void {
  const blob = new Blob([contenido], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombre;
  a.click();
  URL.revokeObjectURL(url);
}

export function reporteAJson(reporte: Reporte, stamp?: HashStamp): string {
  return JSON.stringify(
    {
      _generadoPor: 'IntegrityX Barrio (ForestBlock) — expediente en preparación; la certificación la emite un tercero acreditado',
      reporte,
      selloIntegridad: stamp
        ? {
            sha256: stamp.sha256,
            chain: stamp.chain,
            txHash: stamp.txHash,
            esDemo: stamp.esDemo,
            payloadCanonico: stamp.payloadCanonico,
          }
        : null,
    },
    null,
    2
  );
}

const CSV_SEP = ';'; // es-AR: coma decimal → separador punto y coma

function csvCell(v: string | number | null | undefined): string {
  if (v === null || v === undefined) return '';
  const s = String(v).replace(/"/g, '""');
  return /[";\n]/.test(s) ? `"${s}"` : s;
}

export function reporteACsv(reporte: Reporte, registros: Registro[]): string {
  const regPorId = new Map(registros.map((r) => [r.id, r]));
  const filas: string[][] = [
    [
      'registro_id',
      'vivienda',
      'variable',
      'periodo',
      'valor',
      'unidad',
      'estado',
      'kgCO2e',
      'categoria_iso',
      'scope_ghg',
      'factor_valor',
      'factor_unidad',
      'factor_fuente',
      'factor_requiere_calibracion',
    ],
  ];
  for (const c of reporte.calculos) {
    const r = regPorId.get(c.registroId);
    if (!r) continue;
    filas.push([
      c.registroId,
      r.viviendaId ?? 'areas_comunes',
      VARIABLE_BY_ID[r.variable]?.nombre ?? r.variable,
      r.periodo,
      String(r.valor),
      r.unidad,
      r.estado,
      c.kgCO2e === null ? 'SIN FACTOR' : String(c.kgCO2e),
      CATEGORIA_ISO_LABEL[c.categoriaIso],
      `Scope ${c.scopeGhg}`,
      c.factorSnapshot ? String(c.factorSnapshot.valor) : '',
      c.factorSnapshot?.unidad ?? '',
      c.factorSnapshot?.fuente ?? '',
      c.factorSnapshot?.calibrar ? 'SI' : 'NO',
    ]);
  }
  return filas.map((f) => f.map(csvCell).join(CSV_SEP)).join('\n');
}

/** Payload de verificación pública portable (se puede pegar en /verificar). */
export function stampAJsonPublico(stamp: HashStamp): string {
  return canonicalJson({
    sha256: stamp.sha256,
    chain: stamp.chain,
    txHash: stamp.txHash,
    timestamp: stamp.timestamp,
    esDemo: stamp.esDemo,
    payload: JSON.parse(stamp.payloadCanonico),
  });
}
