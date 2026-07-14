/**
 * Factores de emisión locales (handoff §4.6) — "factores privados".
 *
 * REGLA §13 — no fabricar factores: cada entrada declara `fuente`, `vigencia`
 * y `metodo` (derivación). Los marcados `calibrar: true` son valores de
 * REFERENCIA para el demo y deben reemplazarse por el factor oficial vigente
 * (Secretaría de Energía / CAMMESA, prestador local o Climatiq) antes de
 * cualquier uso real; la UI los señala en cada número derivado.
 *
 * En producción el motor prioriza el factor local cuando existe y cae a
 * Climatiq (activityId) cuando no — misma interfaz `Factor`.
 *
 * Nota de alcance MVP: los factores de combustión incluyen solo CO₂ (los
 * aportes de CH₄ y N₂O de la combustión son menores y se incorporan en la
 * calibración técnica de Fase 2).
 */
import type { Factor } from './ixb_types';

export const FACTORES_LOCALES: Factor[] = [
  {
    id: 'f_elec_ar',
    nombre: 'Electricidad — red argentina (SADI)',
    origen: 'local',
    activityId: 'electricity-supply_grid-source_supplier_mix', // candidato Climatiq
    region: 'AR',
    valor: 0.3,
    unidad: 'kgCO₂e/kWh',
    fuente:
      'VALOR DE REFERENCIA (demo). Reemplazar por el factor oficial de la red argentina publicado por la Secretaría de Energía / CAMMESA para el año del inventario.',
    vigencia: 'DEMO — sin vigencia oficial',
    metodo:
      'Factor medio de red (orden de magnitud histórico del SADI). En producción: factor privado oficial en Climatiq o tabla local con cita y año.',
    calibrar: true,
  },
  {
    id: 'f_gas_natural',
    nombre: 'Gas natural de red — combustión residencial',
    origen: 'local',
    region: 'AR',
    valor: 1.96,
    unidad: 'kgCO₂/m³',
    fuente: 'IPCC 2006 GL Vol. 2, Tabla 2.2 — gas natural: 56,1 tCO₂/TJ (sobre PCI).',
    vigencia: 'IPCC 2006 (vigente como default)',
    metodo:
      '56,1 kgCO₂/GJ × PCI ≈ 35,0 MJ/m³ (0,9 × PCS 9.300 kcal/m³ de referencia ENARGAS) = 1,96 kgCO₂/m³. Ajustar PCI según factura/distribuidora.',
    calibrar: true,
  },
  {
    id: 'f_glp',
    nombre: 'GLP (garrafa / granel) — combustión',
    origen: 'local',
    region: 'GLOBAL',
    valor: 2.98,
    unidad: 'kgCO₂/kg',
    fuente: 'IPCC 2006 GL Vol. 2, Tabla 2.2 — GLP: 63,1 tCO₂/TJ (sobre PCI).',
    vigencia: 'IPCC 2006 (vigente como default)',
    metodo: '63,1 kgCO₂/GJ × PCI 47,3 MJ/kg (default IPCC) = 2,98 kgCO₂/kg.',
    calibrar: false,
  },
  {
    id: 'f_nafta',
    nombre: 'Nafta — combustión vehicular',
    origen: 'local',
    region: 'GLOBAL',
    valor: 2.27,
    unidad: 'kgCO₂/L',
    fuente: 'IPCC 2006 GL Vol. 2, Tabla 2.2 — gasolina motor: 69,3 tCO₂/TJ (sobre PCI).',
    vigencia: 'IPCC 2006 (vigente como default)',
    metodo: '69,3 kgCO₂/GJ × PCI 44,3 MJ/kg × densidad 0,74 kg/L ≈ 2,27 kgCO₂/L.',
    calibrar: false,
  },
  {
    id: 'f_gasoil',
    nombre: 'Gasoil — combustión vehicular / maquinaria',
    origen: 'local',
    region: 'GLOBAL',
    valor: 2.68,
    unidad: 'kgCO₂/L',
    fuente: 'IPCC 2006 GL Vol. 2, Tabla 2.2 — diésel: 74,1 tCO₂/TJ (sobre PCI).',
    vigencia: 'IPCC 2006 (vigente como default)',
    metodo: '74,1 kgCO₂/GJ × PCI 43,0 MJ/kg × densidad 0,84 kg/L ≈ 2,68 kgCO₂/L.',
    calibrar: false,
  },
  {
    id: 'f_agua',
    nombre: 'Agua potable de red — provisión',
    origen: 'local',
    activityId: 'water-supply', // candidato Climatiq
    region: 'UK (proxy)',
    valor: 0.344,
    unidad: 'kgCO₂e/m³',
    fuente:
      'DEFRA/BEIS UK GHG Conversion Factors 2023 — water supply. PROXY extranjero: no representa la matriz argentina.',
    vigencia: '2023 (UK)',
    metodo: 'Usar dato del prestador local o factor Climatiq regional en producción.',
    calibrar: true,
  },
  {
    id: 'f_residuos',
    nombre: 'Residuos sólidos urbanos a relleno sanitario',
    origen: 'local',
    activityId: 'waste-type_municipal-disposal_method_landfill', // candidato Climatiq
    region: 'UK (proxy)',
    valor: 0.446,
    unidad: 'kgCO₂e/kg',
    fuente:
      'DEFRA/BEIS UK GHG Conversion Factors 2023 — municipal waste to landfill (≈446 kgCO₂e/t). PROXY: calibrar con gestión local (CEAMSE u operador).',
    vigencia: '2023 (UK)',
    metodo: 'Incluye CH₄ de descomposición según mix UK; ajustar a condiciones locales.',
    calibrar: true,
  },
];

export const FACTOR_BY_ID: Record<string, Factor> = Object.fromEntries(
  FACTORES_LOCALES.map((f) => [f.id, f])
);
