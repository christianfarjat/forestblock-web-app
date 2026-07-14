'use client';

/**
 * Portal Residente (§5.1) — lenguaje simple, cero jerga.
 * El residente solo ve SU vivienda (RBAC + row-level, §8).
 */
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ComposicionChart, SerieMensualChart } from '@/components/charts/IxbCharts';
import {
  Badge,
  Banner,
  Boton,
  Card,
  Cargando,
  EmptyState,
  EstadoBadge,
  Field,
  inputCls,
  Modal,
  SectionTitle,
  SelloBadge,
  Stat,
} from '@/components/common/ui';
import { explicarHuella, fmtKgCO2e, fmtNum, mesLabel, variacionPct } from '@/lib/ixb_format';
import { can } from '@/lib/ixb_rbac';
import {
  agregarMejora,
  inventarioDe,
  personaActual,
  serieMensual,
  stampsDe,
  useIxbState,
} from '@/lib/ixb_store';
import { PERIODO_ACTUAL, PERIODOS_SEED } from '@/lib/ixb_seed';
import type { VariableId } from '@/lib/ixb_types';
import { MEJORA_TIPOS, VARIABLE_BY_ID } from '@/lib/ixb_types';

const TIPS: Partial<Record<VariableId, string[]>> = {
  energia_red: [
    'Desenchufá los aparatos en modo espera: pueden ser hasta un 10% de tu factura.',
    'Si usás aire, 24 °C es el punto justo entre confort y consumo.',
  ],
  gas_natural: [
    'Sellá puertas y ventanas antes del invierno: es la mejora más barata.',
    'Un termotanque solar baja fuerte el gas de todo el año.',
  ],
  glp: ['Aislá techos y aberturas: cada garrafa rinde más.', 'Evaluá termotanque solar para el agua caliente.'],
  agua_red: ['Regá de noche o temprano: se evapora menos.', 'Aireadores en canillas: mismo confort, menos agua.'],
  residuos_relleno: [
    'Los orgánicos son la mitad de la bolsa: compostalos y bajás tu basura a la mitad.',
    'Separá reciclables limpios y secos.',
  ],
  combustible_nafta: ['Coordiná viajes con vecinos para las compras.', 'Para distancias cortas, la bici gana.'],
  combustible_gasoil: ['Mantené presión de neumáticos: menos consumo.', 'Agrupá trámites en un solo viaje.'],
};

export default function PortalResidente() {
  const s = useIxbState();
  const persona = personaActual(s);
  const [mejoraOpen, setMejoraOpen] = useState(false);

  if (!s.listo) return <Cargando />;

  if (!persona || !can(persona.rol, 'cargar_registros') || !persona.viviendaId) {
    return (
      <EmptyState icono="🏡" titulo="Esta superficie es para residentes">
        Elegí una persona con rol Residente en el selector de arriba (por ejemplo, Ana Suárez) para
        recorrer el portal.
      </EmptyState>
    );
  }

  const vivienda = s.viviendas.find((v) => v.id === persona.viviendaId)!;
  const barrio = s.barrios.find((b) => b.id === vivienda.barrioId)!;
  const misRegistros = s.registros.filter((r) => r.viviendaId === vivienda.id);

  const ultimoPeriodo =
    misRegistros.length > 0
      ? misRegistros.reduce((max, r) => (r.periodo > max ? r.periodo : max), '0000-00')
      : null;

  const inv = ultimoPeriodo
    ? inventarioDe(s, { viviendaId: vivienda.id, periodoDesde: ultimoPeriodo, periodoHasta: ultimoPeriodo })
    : null;
  const invAnterior = ultimoPeriodo
    ? inventarioDe(s, {
        viviendaId: vivienda.id,
        periodoDesde: prevPeriodo(ultimoPeriodo),
        periodoHasta: prevPeriodo(ultimoPeriodo),
      })
    : null;

  const serie = serieMensual(s, { viviendaId: vivienda.id }, PERIODOS_SEED);
  const variacion =
    inv && invAnterior ? variacionPct(inv.totales.totalKg, invAnterior.totales.totalKg) : null;

  const composicion = inv
    ? Object.entries(inv.totales.porVariable)
        .map(([vid, kg]) => ({
          nombre: `${VARIABLE_BY_ID[vid]?.icono ?? ''} ${VARIABLE_BY_ID[vid]?.nombreSimple ?? vid}`,
          kg: kg as number,
        }))
        .sort((a, b) => b.kg - a.kg)
    : [];

  const solarMes = inv?.registros.find((r) => r.variable === 'solar_autoconsumo')?.valor ?? 0;
  const compostMes = inv?.registros.find((r) => r.variable === 'compost')?.valor ?? 0;

  // Gamificación simple: racha de meses con al menos una carga.
  const mesesConCarga = new Set(misRegistros.map((r) => r.periodo));
  let racha = 0;
  for (let i = PERIODOS_SEED.length - 1; i >= 0; i--) {
    if (mesesConCarga.has(PERIODOS_SEED[i])) racha += 1;
    else break;
  }

  const rechazados = misRegistros.filter((r) => r.estado === 'rechazado');
  const topVariable = composicion[0]
    ? (Object.entries(inv!.totales.porVariable).sort((a, b) => (b[1] as number) - (a[1] as number))[0][0] as VariableId)
    : null;
  const tips = topVariable ? (TIPS[topVariable] ?? []) : [];
  const avisos = s.avisos.filter((a) => a.barrioId === barrio.id);
  const misMejoras = s.mejoras.filter((m) => m.viviendaId === vivienda.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-medium">¡Hola, {persona.nombre.split(' ')[0]}! 👋</h1>
          <p className="text-sm text-brandGrey">
            Tu casa: lote {vivienda.lote} · {vivienda.tipologia} · {barrio.nombre}
          </p>
        </div>
        <Link href="/residente/cargar">
          <Boton>＋ Cargar datos del mes</Boton>
        </Link>
      </div>

      {rechazados.length > 0 && (
        <Banner tone="warn">
          <strong>Hay {rechazados.length} dato(s) para revisar:</strong>{' '}
          {rechazados
            .map((r) => `${VARIABLE_BY_ID[r.variable]?.nombreSimple} de ${mesLabel(r.periodo)}`)
            .join(', ')}
          . Mirá la nota del equipo técnico más abajo y volvé a cargarlos.
        </Banner>
      )}

      {inv && ultimoPeriodo ? (
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <SectionTitle sub={`Con los datos que cargaste de ${mesLabel(ultimoPeriodo)}.`}>
              Tu huella del mes
            </SectionTitle>
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-4xl font-medium text-forest">{fmtKgCO2e(inv.totales.totalKg)}</span>
              {variacion !== null && (
                <Badge tone={variacion <= 0 ? 'verified' : 'declared'}>
                  {variacion <= 0 ? '▼' : '▲'} {Math.abs(variacion)}% vs. {mesLabel(prevPeriodo(ultimoPeriodo))}
                </Badge>
              )}
            </div>
            <ul className="mt-3 space-y-1.5">
              {explicarHuella(inv.totales.totalKg).map((e) => (
                <li key={e.texto} className="text-sm text-filtersGray" title={e.detalle}>
                  💬 {e.texto}
                </li>
              ))}
            </ul>
            {inv.totales.usaFactoresDeReferencia && (
              <p className="mt-3 text-xs text-brandGrey">
                ⚠ Algunos números usan factores de referencia en calibración — el equipo técnico los
                está ajustando con las fuentes oficiales.
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {solarMes > 0 && (
                <Badge tone="lime" title="Se muestra aparte: no se descuenta de tu huella.">
                  🔆 Generaste {fmtNum(solarMes, 0)} kWh solares
                </Badge>
              )}
              {compostMes > 0 && (
                <Badge tone="lime" title="Se muestra aparte: no se descuenta de tu huella.">
                  🪱 Compostaste {fmtNum(compostMes, 0)} kg
                </Badge>
              )}
            </div>
          </Card>

          <div className="grid content-start gap-4">
            <Stat icono="🔥" label="Racha de carga" value={`${racha} ${racha === 1 ? 'mes' : 'meses'}`} sub="Meses seguidos con datos cargados" />
            <Stat
              icono="🏅"
              label="Logros"
              value={
                <span className="flex flex-wrap gap-1 text-sm">
                  {racha >= 3 && <Badge tone="lime">3+ meses al día</Badge>}
                  {solarMes > 0 && <Badge tone="lime">Energía solar</Badge>}
                  {compostMes > 0 && <Badge tone="lime">Compostaje</Badge>}
                  {misMejoras.length > 0 && <Badge tone="lime">{misMejoras.length} mejora(s)</Badge>}
                  {racha < 3 && solarMes === 0 && compostMes === 0 && misMejoras.length === 0 && (
                    <span className="text-brandGrey">Cargá datos para sumar logros</span>
                  )}
                </span>
              }
            />
          </div>
        </div>
      ) : (
        <EmptyState icono="📥" titulo="Todavía no cargaste datos">
          Empezá por el primer mes: lleva menos de 5 minutos y podés sacar los números de tus
          facturas.
        </EmptyState>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <SectionTitle sub="kg CO₂e por mes — tu evolución.">Tu evolución</SectionTitle>
          <SerieMensualChart data={serie} />
        </Card>
        <Card>
          <SectionTitle sub="De dónde sale tu huella (mes mostrado).">¿Qué la genera?</SectionTitle>
          {composicion.length ? (
            <ComposicionChart data={composicion} />
          ) : (
            <p className="text-sm text-brandGrey">Sin datos del mes todavía.</p>
          )}
          {tips.length > 0 && (
            <div className="mt-3 rounded-cardSm bg-limeSoft/50 p-3">
              <div className="text-sm font-medium">💡 Para bajar tu mayor consumo:</div>
              <ul className="mt-1 list-inside list-disc text-sm text-filtersGray">
                {tips.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      </div>

      <Card>
        <SectionTitle sub="Cada dato pasa por revisión técnica: Declarado → Verificado → Auditado. Los verificados quedan sellados con un hash en blockchain.">
          Mis cargas y su estado
        </SectionTitle>
        <div className="space-y-3">
          {[...mesesConCarga]
            .sort()
            .reverse()
            .slice(0, 6)
            .map((periodo) => {
              const delMes = misRegistros.filter((r) => r.periodo === periodo);
              return (
                <div key={periodo} className="rounded-cardSm border border-borderGray p-3">
                  <div className="mb-2 text-sm font-medium">{mesLabel(periodo)}</div>
                  <div className="flex flex-wrap gap-2">
                    {delMes.map((r) => {
                      const sello = stampsDe(s, r.id).at(-1);
                      return (
                        <span key={r.id} className="inline-flex items-center gap-1.5 rounded-pill border border-borderGray bg-white px-2 py-1 text-xs">
                          <span>{VARIABLE_BY_ID[r.variable]?.icono}</span>
                          <span>
                            {VARIABLE_BY_ID[r.variable]?.nombreSimple}: {fmtNum(r.valor, 1)} {r.unidad}
                          </span>
                          <EstadoBadge estado={r.estado} />
                          {sello && <SelloBadge esDemo={sello.esDemo} href={`/verificar?sello=${sello.id}`} />}
                          {r.estado === 'rechazado' && r.notaAuditor && (
                            <span className="text-customRed" title={r.notaAuditor}>
                              ⓘ nota
                            </span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                  {delMes.some((r) => r.estado === 'rechazado') && (
                    <p className="mt-2 text-xs text-customRed">
                      {delMes
                        .filter((r) => r.estado === 'rechazado')
                        .map((r) => `«${r.notaAuditor}»`)
                        .join(' · ')}{' '}
                      —{' '}
                      <Link className="underline" href={`/residente/cargar?periodo=${periodo}`}>
                        corregir ahora
                      </Link>
                    </p>
                  )}
                </div>
              );
            })}
          {mesesConCarga.size === 0 && <p className="text-sm text-brandGrey">Sin cargas todavía.</p>}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <SectionTitle
            right={
              <Boton size="sm" variant="secondary" onClick={() => setMejoraOpen(true)}>
                ＋ Declarar mejora
              </Boton>
            }
            sub="Las mejoras suman al puntaje del barrio en los estándares."
          >
            Mejoras de mi casa
          </SectionTitle>
          {misMejoras.length ? (
            <ul className="space-y-2">
              {misMejoras.map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-2 rounded-cardSm border border-borderGray px-3 py-2 text-sm">
                  <span>
                    {MEJORA_TIPOS[m.tipo]?.icono} {MEJORA_TIPOS[m.tipo]?.label ?? m.tipo}
                    <span className="ml-2 text-xs text-brandGrey">{mesLabel(m.fecha)}</span>
                  </span>
                  <EstadoBadge estado={m.estado} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-brandGrey">
              ¿Pusiste paneles, aislaste el techo o armaste una compostera? Declaralo acá.
            </p>
          )}
        </Card>

        <Card>
          <SectionTitle sub="Novedades del Comité de Sostenibilidad y la administración.">
            El barrio se mueve
          </SectionTitle>
          {avisos.length ? (
            <ul className="space-y-2">
              {avisos.map((a) => (
                <li key={a.id} className="rounded-cardSm border border-borderGray p-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    {a.tipo === 'encuesta' ? '🗳' : a.tipo === 'capacitacion' ? '🎓' : '📣'} {a.titulo}
                  </div>
                  <p className="mt-1 text-sm text-filtersGray">{a.cuerpo}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-brandGrey">Sin avisos por ahora.</p>
          )}
        </Card>
      </div>

      <ModalMejora open={mejoraOpen} onClose={() => setMejoraOpen(false)} viviendaId={vivienda.id} />
    </div>
  );
}

function prevPeriodo(p: string): string {
  const [y, m] = p.split('-').map(Number);
  const d = new Date(Date.UTC(y, m - 2, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

function ModalMejora({
  open,
  onClose,
  viviendaId,
}: {
  open: boolean;
  onClose: () => void;
  viviendaId: string;
}) {
  const s = useIxbState();
  const persona = personaActual(s);
  const [tipo, setTipo] = useState('termotanque_solar');
  const [desc, setDesc] = useState('');
  const [error, setError] = useState('');
  const fechaDefault = useMemo(() => PERIODO_ACTUAL, []);

  return (
    <Modal open={open} onClose={onClose} title="Declarar una mejora">
      <div className="space-y-3">
        <Field label="¿Qué mejora hiciste?">
          <select className={inputCls} value={tipo} onChange={(e) => setTipo(e.target.value)}>
            {Object.entries(MEJORA_TIPOS).map(([k, v]) => (
              <option key={k} value={k}>
                {v.icono} {v.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Contanos un poco más (opcional)">
          <textarea
            className={inputCls}
            rows={2}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Marca, m² aislados, cantidad de paneles…"
          />
        </Field>
        {error && <Banner tone="warn">{error}</Banner>}
        <div className="flex justify-end gap-2">
          <Boton variant="ghost" onClick={onClose}>
            Cancelar
          </Boton>
          <Boton
            onClick={() => {
              try {
                agregarMejora(persona!, { viviendaId, tipo, descripcion: desc, fecha: fechaDefault });
                setDesc('');
                onClose();
              } catch (e) {
                setError(e instanceof Error ? e.message : 'No se pudo guardar.');
              }
            }}
          >
            Declarar
          </Boton>
        </div>
        <p className="text-xs text-brandGrey">
          La mejora queda <strong>declarada</strong>; el equipo técnico puede verificarla con
          evidencia.
        </p>
      </div>
    </Modal>
  );
}
