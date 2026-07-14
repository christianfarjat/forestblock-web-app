/**
 * Formatos es-AR y comparaciones amigables para el Portal Residente.
 * Las equivalencias usan constantes CON FUENTE (§13: nada inventado);
 * son aproximaciones comunicacionales y se presentan como tales.
 */

const nf0 = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 1 });
const nf2 = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 2 });

export function fmtNum(n: number, dec: 0 | 1 | 2 = 1): string {
  return (dec === 0 ? nf0 : dec === 1 ? nf1 : nf2).format(n);
}

/** kg → representación amigable (kg si <1000, t si no). */
export function fmtKgCO2e(kg: number): string {
  if (Math.abs(kg) >= 1000) return `${nf2.format(kg / 1000)} t CO₂e`;
  return `${nf1.format(kg)} kg CO₂e`;
}

export function fmtTCO2e(kg: number): string {
  return `${nf2.format(kg / 1000)} t CO₂e`;
}

export function fmtPct(p: number): string {
  return `${nf0.format(p)}%`;
}

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

/** '2026-03' → 'mar 2026' */
export function mesLabel(periodo: string): string {
  const [y, m] = periodo.split('-').map(Number);
  if (!y || !m || m < 1 || m > 12) return periodo;
  return `${MESES[m - 1]} ${y}`;
}

export function periodoAnterior(periodo: string): string {
  const [y, m] = periodo.split('-').map(Number);
  const d = new Date(Date.UTC(y, m - 2, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

export function listaPeriodos(desde: string, hasta: string): string[] {
  const out: string[] = [];
  let [y, m] = desde.split('-').map(Number);
  const [yh, mh] = hasta.split('-').map(Number);
  while (y < yh || (y === yh && m <= mh)) {
    out.push(`${y}-${String(m).padStart(2, '0')}`);
    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Comparaciones amigables (con fuente y supuestos explícitos)
// ---------------------------------------------------------------------------

export const COMPARACIONES = {
  kgCO2PorKmAuto: {
    valor: 0.1816,
    detalle:
      'Auto naftero medio: 2,27 kgCO₂/L (IPCC 2006) × supuesto 8 L/100 km = 0,18 kgCO₂/km.',
  },
  kgCO2PorArbolAnio: {
    valor: 22,
    detalle: 'Árbol urbano medio ≈ 22 kg CO₂ absorbidos por año (US EPA, equivalencias GEI).',
  },
} as const;

/** Explicación simple de una huella mensual, sin jerga (§5.1). */
export function explicarHuella(kg: number): { texto: string; detalle: string }[] {
  if (kg <= 0) return [];
  const km = Math.round(kg / COMPARACIONES.kgCO2PorKmAuto.valor);
  const arbolesMes = kg / (COMPARACIONES.kgCO2PorArbolAnio.valor / 12);
  return [
    {
      texto: `Equivale a manejar unos ${nf0.format(km)} km en un auto naftero.`,
      detalle: COMPARACIONES.kgCO2PorKmAuto.detalle,
    },
    {
      texto: `Se necesitan ~${nf0.format(Math.ceil(arbolesMes))} árboles absorbiendo todo el mes para compensarlo.`,
      detalle: COMPARACIONES.kgCO2PorArbolAnio.detalle,
    },
  ];
}

export function variacionPct(actual: number, anterior: number): number | null {
  if (!anterior) return null;
  return Math.round(((actual - anterior) / anterior) * 100);
}
