/**
 * Seeds demo — 3 barrios MJM (handoff: Tres Pinos · Laguna de las Pampas ·
 * Chacras de San Andrés), 30 viviendas, 6 meses de registros (ene–jun 2026).
 *
 * Determinístico: PRNG con semilla fija → misma demo en cualquier máquina.
 * Todos los nombres de personas son ficticios. Los registros nacen
 * `declarado`; el store procesa las listas `paraVerificar` / `paraAuditar` /
 * `paraRechazar` a través de las MISMAS acciones que usa la UI (con actores
 * técnicos), para que los sellos y el log de auditoría sean reales.
 */
import type {
  Aviso,
  Barrio,
  Mejora,
  Meta,
  Persona,
  Registro,
  RespuestaRequisito,
  VariableId,
  Vivienda,
} from './ixb_types';

// PRNG mulberry32 — determinismo del seed (misma técnica que land-mrv).
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SEMILLA = 20260714;

export const PERIODOS_SEED = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06'];
export const PERIODO_ACTUAL = '2026-07';

export const BARRIOS_SEED: Barrio[] = [
  {
    id: 'b_trespinos',
    nombre: 'Tres Pinos',
    ubicacion: 'Prov. de Buenos Aires (demo)',
    descripcion: 'Barrio de viviendas sustentables MJM — gas de red, parquización nativa.',
  },
  {
    id: 'b_laguna',
    nombre: 'Laguna de las Pampas',
    ubicacion: 'Prov. de Buenos Aires (demo)',
    descripcion: 'Barrio lacustre MJM — GLP, riego de espacios comunes desde laguna.',
  },
  {
    id: 'b_chacras',
    nombre: 'Chacras de San Andrés',
    ubicacion: 'Prov. de Buenos Aires (demo)',
    descripcion: 'Chacras MJM — GLP, biodigestores domiciliarios, compostaje.',
  },
];

const TIPOLOGIAS = ['Casa 2 dorm.', 'Casa 3 dorm.', 'Dúplex', 'Casa 4 dorm.', 'Cabaña'];

export const PERSONAS_SEED: Persona[] = [
  {
    id: 'p_res_ana',
    nombre: 'Ana Suárez',
    rol: 'resident',
    email: 'ana@demo.integrityx',
    barrioId: 'b_trespinos',
    viviendaId: 'v_trespinos_07',
  },
  {
    id: 'p_res_bruno',
    nombre: 'Bruno Díaz',
    rol: 'resident',
    email: 'bruno@demo.integrityx',
    barrioId: 'b_laguna',
    viviendaId: 'v_laguna_03',
  },
  {
    id: 'p_com_marta',
    nombre: 'Marta Giménez',
    rol: 'committee',
    barrioId: 'b_trespinos',
    viviendaId: null,
  },
  {
    id: 'p_cons_pablo',
    nombre: 'Pablo Ferrer',
    rol: 'consortium',
    barrioId: 'b_trespinos',
    viviendaId: null,
  },
  {
    id: 'p_adm_lucia',
    nombre: 'Lucía Kaplan',
    rol: 'barrio_admin',
    barrioId: 'b_trespinos',
    viviendaId: null,
  },
  { id: 'p_dev_mjm', nombre: 'Equipo MJM Inversiones', rol: 'developer', barrioId: null, viviendaId: null },
  {
    id: 'p_tec_diego',
    nombre: 'Diego Roldán (ForestBlock)',
    rol: 'tech_admin',
    barrioId: null,
    viviendaId: null,
  },
  {
    id: 'p_tec_sofia',
    nombre: 'Sofía Beltrán (ForestBlock)',
    rol: 'tech_admin',
    barrioId: null,
    viviendaId: null,
  },
  {
    id: 'p_ver_vvb',
    nombre: 'Verificadora Pampa VVB',
    rol: 'verifier',
    barrioId: null,
    viviendaId: null,
  },
];

export interface SeedResult {
  barrios: Barrio[];
  viviendas: Vivienda[];
  personas: Persona[];
  registros: Registro[];
  mejoras: Mejora[];
  metas: Meta[];
  avisos: Aviso[];
  respuestas: RespuestaRequisito[];
  /** Ids a procesar por el store con las acciones reales (sellos de verdad). */
  paraVerificar: string[];
  paraAuditar: string[];
  paraRechazar: { id: string; nota: string }[];
}

// Curvas estacionales hemisferio sur (ene..jun): AC en verano, calefacción en invierno.
const CURVA_ELEC = [1.2, 1.05, 0.9, 0.95, 1.1, 1.3];
const CURVA_GAS = [0.5, 0.5, 0.7, 1.0, 1.6, 2.4];
const CURVA_AGUA = [1.35, 1.25, 1.05, 0.9, 0.8, 0.75];
const CURVA_SOLAR = [1.3, 1.15, 1.0, 0.85, 0.7, 0.6];

function redondea(v: number, dec = 1): number {
  const f = 10 ** dec;
  return Math.round(v * f) / f;
}

export function construirSeed(): SeedResult {
  const rng = mulberry32(SEMILLA);
  const viviendas: Vivienda[] = [];
  const registros: Registro[] = [];
  const mejoras: Mejora[] = [];
  const paraVerificar: string[] = [];
  const paraAuditar: string[] = [];
  const paraRechazar: { id: string; nota: string }[] = [];

  const conteos: Record<string, number> = { b_trespinos: 12, b_laguna: 10, b_chacras: 8 };

  for (const barrio of BARRIOS_SEED) {
    const n = conteos[barrio.id];
    const pref = barrio.id.replace('b_', '');
    const sigla = { b_trespinos: 'TP', b_laguna: 'LP', b_chacras: 'CH' }[barrio.id];

    for (let i = 1; i <= n; i++) {
      const vivId = `v_${pref}_${String(i).padStart(2, '0')}`;
      const ocupantes = 1 + Math.floor(rng() * 5);
      viviendas.push({
        id: vivId,
        barrioId: barrio.id,
        lote: `${sigla}-${String(i).padStart(2, '0')}`,
        tipologia: TIPOLOGIAS[Math.floor(rng() * TIPOLOGIAS.length)],
        superficieM2: Math.round(70 + rng() * 150),
        ocupantes,
      });

      const conSolar = i % 3 === 0;
      const conCompost = rng() < 0.4 || barrio.id === 'b_chacras';
      const usaGasoil = rng() < 0.25;
      const baseElec = (120 + rng() * 120) * (0.7 + ocupantes * 0.15);
      const baseGas = 18 + rng() * 30; // m³ (solo Tres Pinos: gas de red)
      const baseGlp = 6 + rng() * 10; // kg
      const baseAgua = (6 + rng() * 8) * (0.6 + ocupantes * 0.2);
      const baseResiduos = (12 + rng() * 10) * (0.5 + ocupantes * 0.25);
      const baseComb = 25 + rng() * 60;
      const baseSolar = 160 + rng() * 160;

      PERIODOS_SEED.forEach((periodo, mIdx) => {
        // Participación: ~87% de los meses cargados (mide completitud real).
        if (rng() > 0.87) return;
        const creadoEn = `${periodo}-0${3 + (i % 5)}T12:00:00.000Z`;
        const push = (variable: VariableId, valor: number, unidad: string, conEvidencia = false) => {
          const id = `reg_${pref}_${String(i).padStart(2, '0')}_${variable}_${periodo}`;
          registros.push({
            id,
            barrioId: barrio.id,
            viviendaId: vivId,
            variable,
            valor,
            unidad,
            periodo,
            fuente: 'residente',
            estado: 'declarado',
            evidencia: conEvidencia
              ? [
                  {
                    id: `ev_${id}`,
                    tipo: 'factura',
                    nombre: `factura-${variable}-${sigla}-${String(i).padStart(2, '0')}-${periodo}.pdf (demo)`,
                    url: '',
                  },
                ]
              : [],
            creadoPor: vivId === 'v_trespinos_07' ? 'p_res_ana' : vivId === 'v_laguna_03' ? 'p_res_bruno' : `seed:${vivId}`,
            creadoEn,
          });
          // Meses 1–2: verificados por técnica/o; mes 1 de Tres Pinos: auditado.
          if (mIdx <= 1) paraVerificar.push(id);
          if (mIdx === 0 && barrio.id === 'b_trespinos') paraAuditar.push(id);
        };

        push('energia_red', redondea(baseElec * CURVA_ELEC[mIdx] * (0.9 + rng() * 0.2)), 'kWh', mIdx <= 1 && rng() < 0.35);
        if (barrio.id === 'b_trespinos') {
          push('gas_natural', redondea(baseGas * CURVA_GAS[mIdx] * (0.9 + rng() * 0.2)), 'm³', mIdx <= 1 && rng() < 0.3);
        } else {
          push('glp', redondea(baseGlp * CURVA_GAS[mIdx] * (0.9 + rng() * 0.2)), 'kg');
        }
        push('agua_red', redondea(baseAgua * CURVA_AGUA[mIdx] * (0.9 + rng() * 0.2)), 'm³');
        push('residuos_relleno', redondea(baseResiduos * (0.85 + rng() * 0.3)), 'kg');
        if (usaGasoil) {
          push('combustible_gasoil', redondea(baseComb * (0.8 + rng() * 0.4)), 'L');
        } else {
          push('combustible_nafta', redondea(baseComb * (0.8 + rng() * 0.4)), 'L');
        }
        if (conSolar) push('solar_autoconsumo', redondea(baseSolar * CURVA_SOLAR[mIdx] * (0.85 + rng() * 0.3)), 'kWh');
        if (conCompost) push('compost', redondea(4 + rng() * 10), 'kg');
        if (barrio.id === 'b_chacras') push('efluentes_tratados', redondea(5 + ocupantes * 1.5 + rng() * 3), 'm³');
      });

      // Mejoras declaradas (§5.1) — alimentan cuestionario y tips.
      if (conSolar) {
        mejoras.push({
          id: `mej_${vivId}_paneles`,
          viviendaId: vivId,
          barrioId: barrio.id,
          tipo: 'paneles',
          fecha: '2025-11',
          estado: 'verificado',
          creadoPor: `seed:${vivId}`,
        });
      }
      if (rng() < 0.3) {
        mejoras.push({
          id: `mej_${vivId}_led`,
          viviendaId: vivId,
          barrioId: barrio.id,
          tipo: 'led',
          fecha: '2026-02',
          estado: 'declarado',
          creadoPor: `seed:${vivId}`,
        });
      }
      if (barrio.id === 'b_chacras') {
        mejoras.push({
          id: `mej_${vivId}_biodigestor`,
          viviendaId: vivId,
          barrioId: barrio.id,
          tipo: 'biodigestor',
          fecha: '2025-08',
          estado: 'verificado',
          creadoPor: `seed:${vivId}`,
        });
      }
    }

    // Áreas comunes del barrio (§5.2): alumbrado, riego, mantenimiento.
    PERIODOS_SEED.forEach((periodo, mIdx) => {
      const creadoEn = `${periodo}-08T15:00:00.000Z`;
      const pushComun = (variable: VariableId, valor: number, unidad: string) => {
        const id = `reg_${pref}_comunes_${variable}_${periodo}`;
        registros.push({
          id,
          barrioId: barrio.id,
          viviendaId: null,
          variable,
          valor,
          unidad,
          periodo,
          fuente: 'administracion',
          estado: 'declarado',
          evidencia: [],
          creadoPor: barrio.id === 'b_trespinos' ? 'p_adm_lucia' : 'seed:administracion',
          creadoEn,
        });
        if (mIdx <= 1) paraVerificar.push(id);
      };
      pushComun('energia_red', redondea(380 + n * 18 * CURVA_ELEC[mIdx] + rng() * 60), 'kWh');
      pushComun('agua_red', redondea((25 + n * 4) * CURVA_AGUA[mIdx] + rng() * 10), 'm³');
      pushComun('combustible_gasoil', redondea(18 + rng() * 30), 'L');
    });
  }

  // Rechazos de ejemplo (flujo de bandeja técnica).
  const r1 = registros.find((r) => r.periodo === '2026-03' && r.variable === 'energia_red' && r.barrioId === 'b_laguna');
  if (r1) paraRechazar.push({ id: r1.id, nota: 'Valor fuera de rango histórico (+310%). Confirmar lectura del medidor o adjuntar factura.' });
  const r2 = registros.find((r) => r.periodo === '2026-03' && r.variable === 'residuos_relleno' && r.barrioId === 'b_trespinos');
  if (r2) paraRechazar.push({ id: r2.id, nota: 'Evidencia ilegible. Volver a subir la foto de la boleta de pesaje.' });

  const metas: Meta[] = [
    {
      id: 'meta_tp_huella',
      barrioId: 'b_trespinos',
      titulo: 'Bajar la huella media por vivienda a 450 kg CO₂e/mes',
      kpi: 'huella_por_vivienda',
      objetivo: 450,
      unidad: 'kg CO₂e/viv./mes',
      plazo: '2026-12',
      creadaPor: 'p_com_marta',
    },
    {
      id: 'meta_tp_part',
      barrioId: 'b_trespinos',
      titulo: 'Llegar a 90% de viviendas cargando datos todos los meses',
      kpi: 'participacion',
      objetivo: 90,
      unidad: '%',
      plazo: '2026-10',
      creadaPor: 'p_com_marta',
    },
    {
      id: 'meta_lp_part',
      barrioId: 'b_laguna',
      titulo: 'Alcanzar 85% de participación mensual',
      kpi: 'participacion',
      objetivo: 85,
      unidad: '%',
      plazo: '2026-11',
      creadaPor: 'p_dev_mjm',
    },
    {
      id: 'meta_ch_energia',
      barrioId: 'b_chacras',
      titulo: 'Mantener el consumo eléctrico bajo 300 kWh/viv./mes',
      kpi: 'energia_red',
      objetivo: 300,
      unidad: 'kWh/viv./mes',
      plazo: '2026-12',
      creadaPor: 'p_dev_mjm',
    },
  ];

  const avisos: Aviso[] = [
    {
      id: 'av_tp_asamblea',
      barrioId: 'b_trespinos',
      tipo: 'aviso',
      titulo: 'Asamblea del Comité de Sostenibilidad — jueves 19 hs, SUM',
      cuerpo:
        'Repasamos el avance de la meta de huella y elegimos las capacitaciones del semestre. ¡Traé tu factura de luz para cargarla juntos!',
      publicadoEn: '2026-06-28T18:00:00.000Z',
      autor: 'p_com_marta',
    },
    {
      id: 'av_tp_capacitacion',
      barrioId: 'b_trespinos',
      tipo: 'capacitacion',
      titulo: 'Taller de compostaje domiciliario — sábado 10 hs',
      cuerpo: 'Aprendé a arrancar tu compostera. Cupos limitados, anotate respondiendo este aviso.',
      publicadoEn: '2026-07-02T14:00:00.000Z',
      autor: 'p_com_marta',
    },
    {
      id: 'av_lp_encuesta',
      barrioId: 'b_laguna',
      tipo: 'encuesta',
      titulo: '¿Sumamos luminarias solares en el sector de la laguna?',
      cuerpo: 'Encuesta abierta hasta fin de mes para priorizar la inversión de expensas verdes.',
      publicadoEn: '2026-07-05T12:00:00.000Z',
      autor: 'seed:administracion',
    },
  ];

  // Cuestionario de adecuación: avance dispar entre barrios (demo realista).
  const resp = (
    barrioId: string,
    requisitoId: string,
    cumple: RespuestaRequisito['cumple'],
    nota?: string
  ): RespuestaRequisito => ({
    requisitoId,
    barrioId,
    cumple,
    nota,
    actualizadoPor: barrioId === 'b_trespinos' ? 'p_com_marta' : 'p_dev_mjm',
    actualizadoEn: '2026-06-15T12:00:00.000Z',
  });

  const respuestas: RespuestaRequisito[] = [
    resp('b_trespinos', 'req_edge_energia', 'parcial', 'Falta consolidar línea base local.'),
    resp('b_trespinos', 'req_edge_agua', 'si'),
    resp('b_trespinos', 'req_edge_materiales', 'parcial'),
    resp('b_trespinos', 'req_edge_medicion', 'si'),
    resp('b_trespinos', 'req_edge_renovable', 'parcial', '4 de 12 viviendas con paneles.'),
    resp('b_trespinos', 'req_iso_limites', 'si'),
    resp('b_trespinos', 'req_iso_datos', 'parcial', '6 de 12 meses cargados.'),
    resp('b_trespinos', 'req_iso_factores', 'parcial', 'Factor de red pendiente de calibración.'),
    resp('b_trespinos', 'req_iso_evidencia', 'parcial'),
    resp('b_trespinos', 'req_iso_remociones', 'si'),
    resp('b_trespinos', 'req_sites_nativa', 'si'),
    resp('b_trespinos', 'req_sites_riego', 'parcial'),
    resp('b_laguna', 'req_edge_agua', 'parcial'),
    resp('b_laguna', 'req_iso_limites', 'si'),
    resp('b_laguna', 'req_iso_datos', 'parcial'),
    resp('b_laguna', 'req_sites_pluvial', 'si', 'Retención natural en laguna.'),
    resp('b_chacras', 'req_sites_compost', 'si'),
    resp('b_chacras', 'req_iso_limites', 'parcial'),
    resp('b_chacras', 'req_edge_renovable', 'parcial'),
  ];

  return {
    barrios: BARRIOS_SEED,
    viviendas,
    personas: PERSONAS_SEED,
    registros,
    mejoras,
    metas,
    avisos,
    respuestas,
    paraVerificar,
    paraAuditar,
    paraRechazar,
  };
}
