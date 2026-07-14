'use client';

/**
 * Backoffice Gestión (§5.2) — comité, consorcio, administración, desarrollador.
 * Dashboards agregados por barrio y multi-barrio, viviendas y usuarios, metas,
 * cuestionario de adecuación a estándares y comunicación a vecinos.
 *
 * Privacidad (§8): los valores por vivienda solo se muestran a roles con
 * permiso `ver_valores_viviendas`; comité/consorcio ven agregados y estados.
 */
import { useMemo, useState } from 'react';
import { ComposicionChart, SerieMensualChart } from '@/components/charts/IxbCharts';
import {
  Badge,
  Banner,
  Boton,
  Card,
  Cargando,
  EmptyState,
  Field,
  inputCls,
  Modal,
  ProgressBar,
  SectionTitle,
  Stat,
} from '@/components/common/ui';
import { fmtKgCO2e, fmtNum, fmtPct, mesLabel } from '@/lib/ixb_format';
import { barriosVisibles, can, superficiesDe } from '@/lib/ixb_rbac';
import { PERIODOS_SEED } from '@/lib/ixb_seed';
import {
  agregarMeta,
  guardarVivienda,
  inventarioDe,
  participacion,
  personaActual,
  publicarAviso,
  serieMensual,
  setRespuestaRequisito,
  useIxbState,
} from '@/lib/ixb_store';
import { ESTANDARES, REQUISITOS_POR_ESTANDAR, scoreEstandar } from '@/lib/ixb_standards';
import type { CumplimientoRequisito, Meta, Persona, Vivienda } from '@/lib/ixb_types';
import { CATEGORIA_ISO_LABEL, VARIABLE_BY_ID, type CategoriaIso } from '@/lib/ixb_types';
import type { EstadoIxb } from '@/lib/ixb_store';

export default function BackofficeGestion() {
  const s = useIxbState();
  const persona = personaActual(s);
  const [barrioId, setBarrioId] = useState<string>('');
  const [periodo, setPeriodo] = useState(PERIODOS_SEED.at(-1)!);
  const [modalViv, setModalViv] = useState(false);
  const [modalMeta, setModalMeta] = useState(false);
  const [modalAviso, setModalAviso] = useState(false);

  if (!s.listo) return <Cargando />;
  if (!persona || !superficiesDe(persona.rol).includes('gestion')) {
    return (
      <EmptyState icono="📊" titulo="Esta superficie es para gestión">
        Elegí una persona de comité, consorcio, administración o desarrollador en el selector.
      </EmptyState>
    );
  }

  const visibles = barriosVisibles(persona, s.barrios);
  const barrio = visibles.find((b) => b.id === barrioId) ?? visibles[0];
  if (!barrio) return <EmptyState icono="🏘" titulo="Sin barrios asignados" />;

  const viviendasBarrio = s.viviendas.filter((v) => v.barrioId === barrio.id);
  const invMes = inventarioDe(s, { barrioId: barrio.id, periodoDesde: periodo, periodoHasta: periodo });
  const part = participacion(s, barrio.id, periodo);
  const pendientes = s.registros.filter((r) => r.barrioId === barrio.id && r.estado === 'declarado').length;
  const serie = serieMensual(s, { barrioId: barrio.id }, PERIODOS_SEED);

  const porCategoria = (Object.entries(invMes.totales.porCategoriaIso) as [string, number][])
    .filter(([, kg]) => kg > 0)
    .map(([cat, kg]) => ({
      nombre: CATEGORIA_ISO_LABEL[Number(cat) as CategoriaIso].replace(/^Cat\. \d — /, `C${cat} · `),
      kg,
    }))
    .sort((a, b) => b.kg - a.kg);

  const multibarrio = can(persona.rol, 'ver_multibarrio')
    ? s.barrios.map((b) => {
        const inv = inventarioDe(s, { barrioId: b.id, periodoDesde: periodo, periodoHasta: periodo });
        const n = s.viviendas.filter((v) => v.barrioId === b.id).length || 1;
        return { nombre: b.nombre, kg: Math.round((inv.totales.totalKg / n) * 10) / 10 };
      })
    : null;

  const veValores = can(persona.rol, 'ver_valores_viviendas');
  const puedeViviendas = can(persona.rol, 'gestionar_viviendas');
  const puedeMetas = can(persona.rol, 'gestionar_metas');
  const puedeAvisos = can(persona.rol, 'publicar_avisos');
  const puedeCuestionario = can(persona.rol, 'responder_cuestionario');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-medium">Gestión — {barrio.nombre}</h1>
          <p className="text-sm text-brandGrey">{barrio.descripcion ?? barrio.ubicacion}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {visibles.length > 1 && (
            <select className={`${inputCls} !w-auto`} value={barrio.id} onChange={(e) => setBarrioId(e.target.value)}>
              {visibles.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nombre}
                </option>
              ))}
            </select>
          )}
          <select className={`${inputCls} !w-auto`} value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
            {PERIODOS_SEED.map((p) => (
              <option key={p} value={p}>
                {mesLabel(p)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icono="🌍" label={`Huella ${mesLabel(periodo)}`} value={fmtKgCO2e(invMes.totales.totalKg)} sub={`${invMes.totales.registrosIncluidos} registros (todos los estados)`} />
        <Stat
          icono="🏠"
          label="Huella por vivienda"
          value={fmtKgCO2e(viviendasBarrio.length ? invMes.totales.totalKg / viviendasBarrio.length : 0)}
          sub={`${viviendasBarrio.length} viviendas`}
        />
        <Stat icono="🙌" label="Participación" value={fmtPct(part.pct)} sub={`${part.cargaron}/${part.total} viviendas cargaron ${mesLabel(periodo)}`} />
        <Stat icono="🕐" label="Pendientes de revisión" value={pendientes} sub="Registros declarados en el barrio" />
      </div>

      {invMes.totales.usaFactoresDeReferencia && (
        <Banner tone="warn">
          ⚠ El inventario usa factores <strong>de referencia en calibración</strong> (p. ej. red
          eléctrica). El Backoffice Técnico los reemplaza por los oficiales antes del expediente.
        </Banner>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <SectionTitle sub="kg CO₂e por mes — todas las viviendas + áreas comunes.">Evolución del barrio</SectionTitle>
          <SerieMensualChart data={serie} />
        </Card>
        <Card>
          <SectionTitle sub={`Composición por categoría ISO 14064-1 (${mesLabel(periodo)}).`}>Categorías del inventario</SectionTitle>
          {porCategoria.length ? <ComposicionChart data={porCategoria} /> : <p className="text-sm text-brandGrey">Sin datos del mes.</p>}
          <p className="mt-2 text-xs text-brandGrey">
            🌳 Remociones (parquización, suelos): se reportan <strong>aparte</strong> cuando llegue la
            capa satelital (Fase 2) — nunca se netean contra las emisiones.
          </p>
        </Card>
      </div>

      {multibarrio && (
        <Card>
          <SectionTitle sub={`Comparación multi-barrio (${mesLabel(periodo)}): kg CO₂e por vivienda.`}>
            Cartera MJM
          </SectionTitle>
          <ComposicionChart data={multibarrio} height={150} />
        </Card>
      )}

      <Card>
        <SectionTitle
          right={
            puedeMetas ? (
              <Boton size="sm" variant="secondary" onClick={() => setModalMeta(true)}>
                ＋ Nueva meta
              </Boton>
            ) : undefined
          }
          sub="Metas del barrio y su avance, medidas con los datos cargados."
        >
          🎯 Metas
        </SectionTitle>
        <MetasLista s={s} barrioId={barrio.id} periodo={periodo} />
      </Card>

      <Card>
        <SectionTitle
          right={
            puedeViviendas ? (
              <Boton size="sm" variant="secondary" onClick={() => setModalViv(true)}>
                ＋ Alta de vivienda
              </Boton>
            ) : undefined
          }
          sub={
            veValores
              ? 'Completitud y huella por vivienda del mes seleccionado.'
              : 'Completitud por vivienda. Los valores individuales de consumo son datos sensibles: tu rol ve agregados (privacidad §8).'
          }
        >
          🏘 Viviendas ({viviendasBarrio.length})
        </SectionTitle>
        <TablaViviendas s={s} viviendas={viviendasBarrio} periodo={periodo} veValores={veValores} />
      </Card>

      <Card>
        <SectionTitle sub="Autoevaluación de preparación (orientativa) — la certificación la emite un tercero acreditado.">
          📋 Adecuación a estándares
        </SectionTitle>
        <CuestionarioEstandares s={s} barrioId={barrio.id} editable={puedeCuestionario} persona={persona} />
      </Card>

      <Card>
        <SectionTitle
          right={
            puedeAvisos ? (
              <Boton size="sm" variant="secondary" onClick={() => setModalAviso(true)}>
                ＋ Publicar
              </Boton>
            ) : undefined
          }
          sub="Avisos, encuestas y capacitaciones que ven los residentes."
        >
          📣 Comunicación
        </SectionTitle>
        <ul className="space-y-2">
          {s.avisos
            .filter((a) => a.barrioId === barrio.id)
            .map((a) => (
              <li key={a.id} className="rounded-cardSm border border-borderGray p-3 text-sm">
                <span className="font-medium">
                  {a.tipo === 'encuesta' ? '🗳' : a.tipo === 'capacitacion' ? '🎓' : '📣'} {a.titulo}
                </span>
                <p className="mt-1 text-filtersGray">{a.cuerpo}</p>
              </li>
            ))}
          {s.avisos.filter((a) => a.barrioId === barrio.id).length === 0 && (
            <p className="text-sm text-brandGrey">Sin publicaciones.</p>
          )}
        </ul>
      </Card>

      <ModalVivienda open={modalViv} onClose={() => setModalViv(false)} persona={persona} barrioId={barrio.id} />
      <ModalMeta open={modalMeta} onClose={() => setModalMeta(false)} persona={persona} barrioId={barrio.id} />
      <ModalAviso open={modalAviso} onClose={() => setModalAviso(false)} persona={persona} barrioId={barrio.id} />
    </div>
  );
}

// ---------------------------------------------------------------------------

function MetasLista({ s, barrioId, periodo }: { s: EstadoIxb; barrioId: string; periodo: string }) {
  const metas = s.metas.filter((m) => m.barrioId === barrioId);
  const viviendas = s.viviendas.filter((v) => v.barrioId === barrioId).length || 1;

  function actualDe(meta: Meta): { actual: number; pct: number; mejorMenor: boolean } {
    if (meta.kpi === 'participacion') {
      const p = participacion(s, barrioId, periodo).pct;
      return { actual: p, pct: Math.min(100, Math.round((p / meta.objetivo) * 100)), mejorMenor: false };
    }
    if (meta.kpi === 'huella_por_vivienda') {
      const inv = inventarioDe(s, { barrioId, periodoDesde: periodo, periodoHasta: periodo });
      const actual = inv.totales.totalKg / viviendas;
      return { actual, pct: actual > 0 ? Math.min(100, Math.round((meta.objetivo / actual) * 100)) : 100, mejorMenor: true };
    }
    // KPIs de consumo medio por vivienda (energía / agua / residuos)
    const suma = s.registros
      .filter((r) => r.barrioId === barrioId && r.periodo === periodo && r.variable === meta.kpi && r.estado !== 'rechazado')
      .reduce((acc, r) => acc + r.valor, 0);
    const actual = suma / viviendas;
    return { actual, pct: actual > 0 ? Math.min(100, Math.round((meta.objetivo / actual) * 100)) : 100, mejorMenor: true };
  }

  if (!metas.length) return <p className="text-sm text-brandGrey">Sin metas definidas.</p>;
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {metas.map((m) => {
        const { actual, pct, mejorMenor } = actualDe(m);
        const logrado = mejorMenor ? actual <= m.objetivo : actual >= m.objetivo;
        return (
          <div key={m.id} className="rounded-cardSm border border-borderGray p-3">
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm font-medium">{m.titulo}</span>
              {logrado && <Badge tone="verified">✓ lograda</Badge>}
            </div>
            <div className="mt-1 text-xs text-brandGrey">
              Hoy: <strong>{fmtNum(actual, 1)}</strong> {m.unidad} · objetivo {mejorMenor ? '≤' : '≥'}{' '}
              {fmtNum(m.objetivo, 0)} · plazo {mesLabel(m.plazo)}
            </div>
            <div className="mt-2">
              <ProgressBar pct={pct} tone={logrado ? 'lime' : 'forest'} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TablaViviendas({
  s,
  viviendas,
  periodo,
  veValores,
}: {
  s: EstadoIxb;
  viviendas: Vivienda[];
  periodo: string;
  veValores: boolean;
}) {
  return (
    <div className="custom-scrollbar overflow-x-auto">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="border-b border-borderGray text-left text-xs uppercase tracking-wide text-brandGrey">
            <th className="py-2 pr-3">Lote</th>
            <th className="py-2 pr-3">Tipología</th>
            <th className="py-2 pr-3">m² / ocupantes</th>
            <th className="py-2 pr-3">Carga {mesLabel(periodo)}</th>
            {veValores && <th className="py-2 pr-3">Huella {mesLabel(periodo)}</th>}
          </tr>
        </thead>
        <tbody>
          {viviendas.map((v) => {
            const delMes = s.registros.filter(
              (r) => r.viviendaId === v.id && r.periodo === periodo && r.estado !== 'rechazado'
            );
            const inv = veValores
              ? inventarioDe(s, { viviendaId: v.id, periodoDesde: periodo, periodoHasta: periodo })
              : null;
            return (
              <tr key={v.id} className="border-b border-borderGray/60">
                <td className="py-2 pr-3 font-medium">{v.lote}</td>
                <td className="py-2 pr-3">{v.tipologia}</td>
                <td className="py-2 pr-3 text-brandGrey">
                  {v.superficieM2} m² · {v.ocupantes} 👤
                </td>
                <td className="py-2 pr-3">
                  {delMes.length ? (
                    <Badge tone="lime">{delMes.length} variables</Badge>
                  ) : (
                    <Badge tone="declared">sin carga</Badge>
                  )}
                </td>
                {veValores && (
                  <td className="py-2 pr-3">{inv ? fmtKgCO2e(inv.totales.totalKg) : '—'}</td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function CuestionarioEstandares({
  s,
  barrioId,
  editable,
  persona,
}: {
  s: EstadoIxb;
  barrioId: string;
  editable: boolean;
  persona: Persona;
}) {
  const [abierto, setAbierto] = useState<string | null>(null);
  const OPCIONES: { v: CumplimientoRequisito; label: string }[] = [
    { v: 'si', label: 'Sí' },
    { v: 'parcial', label: 'Parcial' },
    { v: 'no', label: 'No' },
    { v: 'sin_dato', label: 'Sin dato' },
  ];

  return (
    <div className="space-y-3">
      {ESTANDARES.map((est) => {
        const score = scoreEstandar(est.id, barrioId, s.respuestas);
        const open = abierto === est.id;
        return (
          <div key={est.id} className="rounded-cardSm border border-borderGray">
            <button
              className="flex w-full flex-wrap items-center justify-between gap-3 p-3 text-left"
              onClick={() => setAbierto(open ? null : est.id)}
            >
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">{est.nombre}</div>
                <div className="text-xs text-brandGrey">
                  {est.descripcion} <em>({est.fuente})</em>
                </div>
              </div>
              <div className="flex w-40 items-center gap-2">
                <ProgressBar pct={score.pct} />
                <span className="text-sm font-medium">{score.pct}%</span>
              </div>
              <span className="text-brandGrey">{open ? '▴' : '▾'}</span>
            </button>
            {open && (
              <div className="space-y-2 border-t border-borderGray p-3">
                {REQUISITOS_POR_ESTANDAR[est.id].map((req) => {
                  const resp = s.respuestas.find((r) => r.requisitoId === req.id && r.barrioId === barrioId);
                  return (
                    <div key={req.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                      <div className="min-w-0 flex-1">
                        <span title={req.ayuda}>{req.texto}</span>
                        <span className="ml-2 text-xs text-brandGrey">peso {req.peso}</span>
                        {resp?.nota && <div className="text-xs text-brandGrey">↳ {resp.nota}</div>}
                      </div>
                      {editable ? (
                        <select
                          className={`${inputCls} !w-auto !py-1 text-xs`}
                          value={resp?.cumple ?? 'sin_dato'}
                          onChange={(e) =>
                            setRespuestaRequisito(
                              persona,
                              req.id,
                              barrioId,
                              e.target.value as CumplimientoRequisito
                            )
                          }
                        >
                          {OPCIONES.map((o) => (
                            <option key={o.v} value={o.v}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <Badge tone={resp?.cumple === 'si' ? 'verified' : resp?.cumple === 'parcial' ? 'declared' : 'neutral'}>
                          {OPCIONES.find((o) => o.v === (resp?.cumple ?? 'sin_dato'))?.label}
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Modales de gestión
// ---------------------------------------------------------------------------

function ModalVivienda({
  open,
  onClose,
  persona,
  barrioId,
}: {
  open: boolean;
  onClose: () => void;
  persona: Persona;
  barrioId: string;
}) {
  const [lote, setLote] = useState('');
  const [tipologia, setTipologia] = useState('Casa 3 dorm.');
  const [superficie, setSuperficie] = useState('120');
  const [ocupantes, setOcupantes] = useState('3');
  const [error, setError] = useState('');

  return (
    <Modal open={open} onClose={onClose} title="Alta de vivienda">
      <div className="space-y-3">
        <Field label="Lote">
          <input className={inputCls} value={lote} onChange={(e) => setLote(e.target.value)} placeholder="TP-13" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Tipología">
            <input className={inputCls} value={tipologia} onChange={(e) => setTipologia(e.target.value)} />
          </Field>
          <Field label="Superficie (m²)">
            <input className={inputCls} type="number" value={superficie} onChange={(e) => setSuperficie(e.target.value)} />
          </Field>
        </div>
        <Field label="Ocupantes">
          <input className={inputCls} type="number" value={ocupantes} onChange={(e) => setOcupantes(e.target.value)} />
        </Field>
        {error && <Banner tone="warn">{error}</Banner>}
        <div className="flex justify-end gap-2">
          <Boton variant="ghost" onClick={onClose}>
            Cancelar
          </Boton>
          <Boton
            onClick={() => {
              try {
                guardarVivienda(persona, {
                  barrioId,
                  lote,
                  tipologia,
                  superficieM2: Number(superficie) || 0,
                  ocupantes: Number(ocupantes) || 1,
                });
                setLote('');
                onClose();
              } catch (e) {
                setError(e instanceof Error ? e.message : 'No se pudo guardar.');
              }
            }}
          >
            Guardar
          </Boton>
        </div>
      </div>
    </Modal>
  );
}

function ModalMeta({
  open,
  onClose,
  persona,
  barrioId,
}: {
  open: boolean;
  onClose: () => void;
  persona: Persona;
  barrioId: string;
}) {
  const [titulo, setTitulo] = useState('');
  const [kpi, setKpi] = useState<Meta['kpi']>('huella_por_vivienda');
  const [objetivo, setObjetivo] = useState('400');
  const [plazo, setPlazo] = useState('2026-12');
  const [error, setError] = useState('');

  const KPIS: { v: Meta['kpi']; label: string; unidad: string }[] = [
    { v: 'huella_por_vivienda', label: 'Huella por vivienda', unidad: 'kg CO₂e/viv./mes' },
    { v: 'participacion', label: 'Participación de carga', unidad: '%' },
    { v: 'energia_red', label: 'Electricidad media', unidad: 'kWh/viv./mes' },
    { v: 'agua_red', label: 'Agua media', unidad: 'm³/viv./mes' },
    { v: 'residuos_relleno', label: 'Residuos medios', unidad: 'kg/viv./mes' },
  ];
  const kpiSel = KPIS.find((k) => k.v === kpi)!;

  return (
    <Modal open={open} onClose={onClose} title="Nueva meta del barrio">
      <div className="space-y-3">
        <Field label="Título">
          <input className={inputCls} value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Bajar la huella media a…" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="KPI">
            <select className={inputCls} value={kpi} onChange={(e) => setKpi(e.target.value as Meta['kpi'])}>
              {KPIS.map((k) => (
                <option key={k.v} value={k.v}>
                  {k.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label={`Objetivo (${kpiSel.unidad})`}>
            <input className={inputCls} type="number" value={objetivo} onChange={(e) => setObjetivo(e.target.value)} />
          </Field>
        </div>
        <Field label="Plazo (AAAA-MM)">
          <input className={inputCls} value={plazo} onChange={(e) => setPlazo(e.target.value)} />
        </Field>
        {error && <Banner tone="warn">{error}</Banner>}
        <div className="flex justify-end gap-2">
          <Boton variant="ghost" onClick={onClose}>
            Cancelar
          </Boton>
          <Boton
            onClick={() => {
              try {
                if (!titulo.trim()) throw new Error('Poné un título.');
                agregarMeta(persona, {
                  barrioId,
                  titulo: titulo.trim(),
                  kpi,
                  objetivo: Number(objetivo) || 0,
                  unidad: kpiSel.unidad,
                  plazo,
                });
                setTitulo('');
                onClose();
              } catch (e) {
                setError(e instanceof Error ? e.message : 'No se pudo guardar.');
              }
            }}
          >
            Crear meta
          </Boton>
        </div>
      </div>
    </Modal>
  );
}

function ModalAviso({
  open,
  onClose,
  persona,
  barrioId,
}: {
  open: boolean;
  onClose: () => void;
  persona: Persona;
  barrioId: string;
}) {
  const [tipo, setTipo] = useState<'aviso' | 'encuesta' | 'capacitacion'>('aviso');
  const [titulo, setTitulo] = useState('');
  const [cuerpo, setCuerpo] = useState('');
  const [error, setError] = useState('');

  return (
    <Modal open={open} onClose={onClose} title="Publicar a los vecinos">
      <div className="space-y-3">
        <Field label="Tipo">
          <select className={inputCls} value={tipo} onChange={(e) => setTipo(e.target.value as typeof tipo)}>
            <option value="aviso">📣 Aviso</option>
            <option value="encuesta">🗳 Encuesta</option>
            <option value="capacitacion">🎓 Capacitación</option>
          </select>
        </Field>
        <Field label="Título">
          <input className={inputCls} value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        </Field>
        <Field label="Mensaje">
          <textarea className={inputCls} rows={3} value={cuerpo} onChange={(e) => setCuerpo(e.target.value)} />
        </Field>
        {error && <Banner tone="warn">{error}</Banner>}
        <div className="flex justify-end gap-2">
          <Boton variant="ghost" onClick={onClose}>
            Cancelar
          </Boton>
          <Boton
            onClick={() => {
              try {
                if (!titulo.trim() || !cuerpo.trim()) throw new Error('Completá título y mensaje.');
                publicarAviso(persona, { barrioId, tipo, titulo: titulo.trim(), cuerpo: cuerpo.trim() });
                setTitulo('');
                setCuerpo('');
                onClose();
              } catch (e) {
                setError(e instanceof Error ? e.message : 'No se pudo publicar.');
              }
            }}
          >
            Publicar
          </Boton>
        </div>
      </div>
    </Modal>
  );
}
