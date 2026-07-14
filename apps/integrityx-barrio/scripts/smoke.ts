/**
 * Smoke tests del núcleo (npm run smoke) — sin framework:
 * motor de carbono (golden values), serialización canónica + SHA-256,
 * anclaje demo determinístico y determinismo del seed.
 * El motor debe dar EXACTAMENTE lo mismo acá y en el navegador (y en el
 * futuro servicio Python: estos son los golden tests de paridad).
 */
import { agregarInventario, calcularRegistro } from '../lib/ixb_carbon';
import { getAnclaje } from '../lib/ixb_chain';
import { FACTOR_BY_ID } from '../lib/ixb_factors';
import { canonicalJson, payloadRegistro, sha256Hex } from '../lib/ixb_hash';
import { construirSeed } from '../lib/ixb_seed';
import type { Registro } from '../lib/ixb_types';

let fallos = 0;
let corridos = 0;

function check(nombre: string, cond: boolean, extra?: string) {
  corridos += 1;
  if (cond) {
    console.log(`  ✓ ${nombre}`);
  } else {
    fallos += 1;
    console.error(`  ✗ ${nombre}${extra ? ` — ${extra}` : ''}`);
  }
}

function reg(parcial: Partial<Registro> & Pick<Registro, 'id' | 'variable' | 'valor'>): Registro {
  return {
    barrioId: 'b_test',
    viviendaId: 'v_test',
    unidad: 'u',
    periodo: '2026-01',
    fuente: 'residente',
    estado: 'declarado',
    evidencia: [],
    creadoPor: 'p_test',
    creadoEn: '2026-02-01T00:00:00.000Z',
    ...parcial,
  };
}

async function main() {
  console.log('— canonicalJson / sha256 —');
  check(
    'claves ordenadas y sin espacios',
    canonicalJson({ b: 1, a: { d: 2, c: 3 }, z: [1, { y: 2, x: 1 }] }) ===
      '{"a":{"c":3,"d":2},"b":1,"z":[1,{"x":1,"y":2}]}'
  );
  check('descarta undefined', canonicalJson({ a: 1, b: undefined }) === '{"a":1}');
  const shaAbc = await sha256Hex('abc');
  check(
    'sha256("abc") vector conocido',
    shaAbc === 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    shaAbc
  );

  console.log('— motor de carbono (golden) —');
  const c1 = calcularRegistro(reg({ id: 'r1', variable: 'energia_red', valor: 100 }), FACTOR_BY_ID);
  check('energía 100 kWh × 0,3 = 30 kg (cat 2 / scope 2)', c1.kgCO2e === 30 && c1.categoriaIso === 2 && c1.scopeGhg === 2);
  check('snapshot del factor con fuente', !!c1.factorSnapshot?.fuente && c1.factorSnapshot.calibrar === true);

  const c2 = calcularRegistro(reg({ id: 'r2', variable: 'gas_natural', valor: 10 }), FACTOR_BY_ID);
  check('gas 10 m³ × 1,96 = 19,6 kg (cat 1 / scope 1)', c2.kgCO2e === 19.6 && c2.categoriaIso === 1 && c2.scopeGhg === 1);

  const c3 = calcularRegistro(reg({ id: 'r3', variable: 'solar_autoconsumo', valor: 250 }), FACTOR_BY_ID);
  check('solar es informativa → sin kg (no netea, §6)', c3.kgCO2e === null);

  const c4 = calcularRegistro(reg({ id: 'r4', variable: 'efluentes_tratados', valor: 8 }), FACTOR_BY_ID);
  check('efluentes sin factor asignado → null (pendiente calibración)', c4.kgCO2e === null && c4.factorId === null);

  const c5 = calcularRegistro(reg({ id: 'r5', variable: 'efluentes_tratados', valor: 8 }), FACTOR_BY_ID, {
    efluentes_tratados: 'f_glp',
  });
  check('override del técnico: efluentes con factor asignado calcula', c5.kgCO2e === 23.84 && c5.factorId === 'f_glp');

  const { totales } = agregarInventario(
    [
      reg({ id: 'r1', variable: 'energia_red', valor: 100 }),
      reg({ id: 'r2', variable: 'gas_natural', valor: 10 }),
      reg({ id: 'r3', variable: 'solar_autoconsumo', valor: 250 }),
      reg({ id: 'r4', variable: 'efluentes_tratados', valor: 8 }),
      reg({ id: 'r6', variable: 'residuos_relleno', valor: 20, estado: 'rechazado' }),
    ],
    FACTOR_BY_ID
  );
  check('total = 49,6 kg (rechazado excluido; informativa aparte)', totales.totalKg === 49.6, String(totales.totalKg));
  check('cat1=19,6 · cat2=30', totales.porCategoriaIso[1] === 19.6 && totales.porCategoriaIso[2] === 30);
  check('scope1=19,6 · scope2=30', totales.porScope[1] === 19.6 && totales.porScope[2] === 30);
  check('1 registro sin factor (efluentes)', totales.registrosSinFactor === 1);
  check('flag factores de referencia activo (elec calibrar)', totales.usaFactoresDeReferencia === true);

  console.log('— payload sellado + anclaje demo —');
  const registro = reg({ id: 'r_sello', variable: 'energia_red', valor: 123.4, estado: 'verificado', verificadoPor: 'p_tec' });
  const payload = payloadRegistro({ ...registro, calculo: calcularRegistro(registro, FACTOR_BY_ID) });
  check('payload canónico estable (roundtrip)', canonicalJson(JSON.parse(payload)) === payload);
  const sha = await sha256Hex(payload);
  const a1 = await getAnclaje().anclar(sha);
  const a2 = await getAnclaje().anclar(sha);
  check('anclaje demo determinístico (misma tx)', a1.txHash === a2.txHash && a1.esDemo === true);
  check('sha estable del payload', sha === (await sha256Hex(payload)));

  console.log('— seed determinístico —');
  const s1 = construirSeed();
  const s2 = construirSeed();
  check('mismo seed ⇒ mismos datos', JSON.stringify(s1) === JSON.stringify(s2));
  check('3 barrios / 30 viviendas', s1.barrios.length === 3 && s1.viviendas.length === 30);
  check(`registros generados (${s1.registros.length}) > 600`, s1.registros.length > 600);
  check(`para verificar (${s1.paraVerificar.length}) > 150`, s1.paraVerificar.length > 150);
  check('para auditar ⊂ para verificar', s1.paraAuditar.every((id) => s1.paraVerificar.includes(id)));
  check('rechazos de ejemplo presentes', s1.paraRechazar.length >= 1);
  const claves = new Set(s1.registros.map((r) => `${r.barrioId}|${r.viviendaId}|${r.variable}|${r.periodo}`));
  check('sin duplicados (vivienda, variable, período)', claves.size === s1.registros.length);

  console.log(`\n${corridos} checks · ${fallos} fallos`);
  if (fallos > 0) process.exit(1);
}

void main();
