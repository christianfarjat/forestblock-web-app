'use client';

/**
 * Backoffice Técnico (§5.3) — administradores técnicos, ForestBlock y
 * verificador externo (read-only).
 *
 * Bandeja de revisión → estados Declarado→Verificado→Auditado (máquina
 * explícita + segregación de funciones), inventario ISO 14064 con factores
 * trazables, expediente de certificación exportable, hash-stamp y log de
 * auditoría append-only.
 */
import { useMemo, useState } from 'react';
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
  Tabs,
} from '@/components/common/ui';
import { fmtKgCO2e, fmtNum, fmtTCO2e, mesLabel } from '@/lib/ixb_format';
import { calcularRegistro } from '@/lib/ixb_carbon';
import { descargarArchivo, reporteACsv, reporteAJson } from '@/lib/ixb_export';
import { can } from '@/lib/ixb_rbac';
import { PERIODOS_SEED } from '@/lib/ixb_seed';
import {
  actualizarFactor,
  asignarFactorVariable,
  auditarRegistro,
  crearFactor,
  factorEfectivo,
  factoresRecord,
  generarReporte,
  inventarioDe,
  nombrePersona,
  personaActual,
  rechazarRegistro,
  sellarReporte,
  stampsDe,
  useIxbState,
  verificarMejora,
  verificarRegistro,
  type EstadoIxb,
} from '@/lib/ixb_store';
import type {
  EstadoVerificacion,
  Factor,
  Persona,
  Registro,
  VariableId,
} from '@/lib/ixb_types';
import { CATEGORIA_ISO_LABEL, VARIABLE_BY_ID, VARIABLES, type CategoriaIso, type ScopeGhg } from '@/lib/ixb_types';

const TABS = [
  { id: 'bandeja', label: '📥 Bandeja de revisión' },
  { id: 'inventario', label: '🌍 Inventario y expediente' },
  { id: 'factores', label: '⚖️ Factores de emisión' },
  { id: 'auditoria', label: '🧾 Log de auditoría' },
];

export default function BackofficeTecnico() {
  const s = useIxbState();
  const persona = personaActual(s);
  const [tab, setTab] = useState('bandeja');

  if (!s.listo) return <Cargando />;
  if (!persona || !can(persona.rol, 'revisar_registros')) {
    return (
      <EmptyState icono="🔬" titulo="Esta superficie es del equipo técnico">
        Elegí una persona técnica (Diego, Sofía) o la verificadora externa en el selector.
      </EmptyState>
    );
  }

  const soloLectura = !can(persona.rol, 'cambiar_estado');

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-medium">Backoffice Técnico</h1>
          <p className="text-sm text-brandGrey">
            {soloLectura
              ? 'Acceso de verificación: solo lectura sobre datos, evidencia, sellos y auditoría.'
              : 'Revisión de evidencia, estados del dato, factores, expediente y sellado.'}
          </p>
        </div>
        {soloLectura && <Badge tone="audited">👁 Rol verificador — read-only</Badge>}
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'bandeja' && <BandejaRevision s={s} persona={persona} soloLectura={soloLectura} />}
      {tab === 'inventario' && <InventarioExpediente s={s} persona={persona} soloLectura={soloLectura} />}
      {tab === 'factores' && <GestionFactores s={s} persona={persona} soloLectura={soloLectura} />}
      {tab === 'auditoria' && <LogAuditoria s={s} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Bandeja de revisión
// ---------------------------------------------------------------------------

function BandejaRevision({
  s,
  persona,
  soloLectura,
}: {
  s: EstadoIxb;
  persona: Persona;
  soloLectura: boolean;
}) {
  const [fBarrio, setFBarrio] = useState('todos');
  const [fEstado, setFEstado] = useState<EstadoVerificacion | 'todos'>('declarado');
  const [fPeriodo, setFPeriodo] = useState('todos');
  const [abierto, setAbierto] = useState<string | null>(null);
  const [rechazoId, setRechazoId] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');

  const filtrados = useMemo(
    () =>
      s.registros
        .filter(
          (r) =>
            (fBarrio === 'todos' || r.barrioId === fBarrio) &&
            (fEstado === 'todos' || r.estado === fEstado) &&
            (fPeriodo === 'todos' || r.periodo === fPeriodo)
        )
        .sort((a, b) => (a.periodo === b.periodo ? a.id.localeCompare(b.id) : b.periodo.localeCompare(a.periodo)))
        .slice(0, 120),
    [s.registros, fBarrio, fEstado, fPeriodo]
  );

  const conteo = (estado: EstadoVerificacion) => s.registros.filter((r) => r.estado === estado).length;

  async function accion(id: string, fn: () => Promise<void> | void) {
    setBusy(id);
    setError('');
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Acción rechazada.');
    } finally {
      setBusy(null);
    }
  }

  const mejorasPendientes = s.mejoras.filter((m) => m.estado === 'declarado');

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-4">
        <Stat icono="⏳" label="Declarados" value={conteo('declarado')} />
        <Stat icono="✓" label="Verificados" value={conteo('verificado')} sub="con hash-stamp" />
        <Stat icono="✓✓" label="Auditados" value={conteo('auditado')} sub="doble control" />
        <Stat icono="✕" label="Rechazados" value={conteo('rechazado')} />
      </div>

      <Card>
        <div className="mb-3 flex flex-wrap gap-2">
          <select className={`${inputCls} !w-auto`} value={fBarrio} onChange={(e) => setFBarrio(e.target.value)}>
            <option value="todos">Todos los barrios</option>
            {s.barrios.map((b) => (
              <option key={b.id} value={b.id}>
                {b.nombre}
              </option>
            ))}
          </select>
          <select
            className={`${inputCls} !w-auto`}
            value={fEstado}
            onChange={(e) => setFEstado(e.target.value as EstadoVerificacion | 'todos')}
          >
            <option value="todos">Todos los estados</option>
            <option value="declarado">Declarados</option>
            <option value="verificado">Verificados</option>
            <option value="auditado">Auditados</option>
            <option value="rechazado">Rechazados</option>
          </select>
          <select className={`${inputCls} !w-auto`} value={fPeriodo} onChange={(e) => setFPeriodo(e.target.value)}>
            <option value="todos">Todos los períodos</option>
            {PERIODOS_SEED.map((p) => (
              <option key={p} value={p}>
                {mesLabel(p)}
              </option>
            ))}
          </select>
          <span className="self-center text-xs text-brandGrey">
            {filtrados.length} registros (máx. 120 en pantalla)
          </span>
        </div>

        {error && (
          <div className="mb-3">
            <Banner tone="warn">{error}</Banner>
          </div>
        )}

        <div className="space-y-2">
          {filtrados.map((r) => (
            <FilaRegistro
              key={r.id}
              s={s}
              r={r}
              abierto={abierto === r.id}
              onToggle={() => setAbierto(abierto === r.id ? null : r.id)}
              soloLectura={soloLectura}
              busy={busy === r.id}
              onVerificar={() => accion(r.id, () => verificarRegistro(persona, r.id))}
              onAuditar={() => accion(r.id, () => auditarRegistro(persona, r.id))}
              onRechazar={() => setRechazoId(r.id)}
            />
          ))}
          {filtrados.length === 0 && <EmptyState icono="📭" titulo="Nada con esos filtros" />}
        </div>
      </Card>

      {mejorasPendientes.length > 0 && (
        <Card>
          <SectionTitle sub="Mejoras declaradas por residentes, pendientes de revisión.">
            🔧 Mejoras declaradas ({mejorasPendientes.length})
          </SectionTitle>
          <div className="flex flex-wrap gap-2">
            {mejorasPendientes.map((m) => {
              const viv = s.viviendas.find((v) => v.id === m.viviendaId);
              return (
                <span key={m.id} className="inline-flex items-center gap-2 rounded-pill border border-borderGray bg-white px-3 py-1.5 text-xs">
                  {viv?.lote} · {m.tipo} ({mesLabel(m.fecha)})
                  {!soloLectura && (
                    <button className="text-verified underline" onClick={() => accion(m.id, () => verificarMejora(persona, m.id))}>
                      verificar
                    </button>
                  )}
                </span>
              );
            })}
          </div>
        </Card>
      )}

      <ModalRechazo
        registroId={rechazoId}
        onClose={() => setRechazoId(null)}
        onConfirm={(nota) => {
          if (rechazoId) void accion(rechazoId, () => rechazarRegistro(persona, rechazoId, nota));
          setRechazoId(null);
        }}
      />
    </div>
  );
}

function FilaRegistro({
  s,
  r,
  abierto,
  onToggle,
  soloLectura,
  busy,
  onVerificar,
  onAuditar,
  onRechazar,
}: {
  s: EstadoIxb;
  r: Registro;
  abierto: boolean;
  onToggle: () => void;
  soloLectura: boolean;
  busy: boolean;
  onVerificar: () => void;
  onAuditar: () => void;
  onRechazar: () => void;
}) {
  const def = VARIABLE_BY_ID[r.variable];
  const viv = r.viviendaId ? s.viviendas.find((v) => v.id === r.viviendaId) : null;
  const barrio = s.barrios.find((b) => b.id === r.barrioId);
  const calculo = calcularRegistro(r, factoresRecord(s), s.factorPorVariable);
  const sellos = stampsDe(s, r.id);
  const auditRegistro = s.auditoria.filter((a) => a.targetId === r.id).slice(-6);

  return (
    <div className="rounded-cardSm border border-borderGray">
      <button className="flex w-full flex-wrap items-center gap-2 p-3 text-left text-sm" onClick={onToggle}>
        <span className="w-24 shrink-0 font-medium">{viv ? viv.lote : '🏞 comunes'}</span>
        <span className="w-40 shrink-0">
          {def?.icono} {def?.nombre ?? r.variable}
        </span>
        <span className="w-28 shrink-0">
          {fmtNum(r.valor, 1)} {r.unidad}
        </span>
        <span className="w-20 shrink-0 text-brandGrey">{mesLabel(r.periodo)}</span>
        <span className="hidden text-xs text-brandGrey sm:inline">{barrio?.nombre}</span>
        <span className="ml-auto flex items-center gap-2">
          {r.evidencia.length > 0 && <span title={`${r.evidencia.length} evidencia(s)`}>📎{r.evidencia.length}</span>}
          {calculo.kgCO2e !== null ? (
            <span className="text-xs text-brandGrey" title={calculo.factorSnapshot?.fuente}>
              {fmtKgCO2e(calculo.kgCO2e)}
              {calculo.factorSnapshot?.calibrar ? ' ⚠' : ''}
            </span>
          ) : def?.informativa ? (
            <Badge tone="lime">aparte</Badge>
          ) : (
            <Badge tone="declared">sin factor</Badge>
          )}
          <EstadoBadge estado={r.estado} />
          {sellos.length > 0 && <SelloBadge esDemo={sellos[sellos.length - 1].esDemo} />}
          <span className="text-brandGrey">{abierto ? '▴' : '▾'}</span>
        </span>
      </button>

      {abierto && (
        <div className="space-y-3 border-t border-borderGray p-3 text-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <div className="text-xs font-medium uppercase text-brandGrey">Detalle</div>
              <ul className="mt-1 space-y-0.5 text-filtersGray">
                <li>Cargado por: {nombrePersona(s, r.creadoPor)} · {new Date(r.creadoEn).toLocaleDateString('es-AR')}</li>
                <li>Fuente: {r.fuente}</li>
                <li>
                  Clasificación: {CATEGORIA_ISO_LABEL[calculo.categoriaIso]} · GHG Scope {calculo.scopeGhg}
                </li>
                {calculo.factorSnapshot && (
                  <li>
                    Factor: {fmtNum(calculo.factorSnapshot.valor, 2)} {calculo.factorSnapshot.unidad}{' '}
                    <span className="text-xs text-brandGrey">({calculo.factorSnapshot.fuente})</span>
                  </li>
                )}
                {r.notaAuditor && <li className="text-customRed">Nota: «{r.notaAuditor}»</li>}
                {r.verificadoPor && <li>Verificó: {nombrePersona(s, r.verificadoPor)}</li>}
                {r.auditadoPor && <li>Auditó: {nombrePersona(s, r.auditadoPor)}</li>}
              </ul>
            </div>
            <div>
              <div className="text-xs font-medium uppercase text-brandGrey">Evidencia</div>
              {r.evidencia.length ? (
                <ul className="mt-1 space-y-1">
                  {r.evidencia.map((ev) => (
                    <li key={ev.id} className="flex items-center gap-2">
                      {ev.url.startsWith('data:image') ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={ev.url} alt={ev.nombre} className="h-10 w-10 rounded object-cover" />
                      ) : (
                        <span>📄</span>
                      )}
                      <span className="min-w-0 truncate text-xs">
                        {ev.nombre}
                        {ev.sha256 && <span className="text-brandGrey"> · sha256:{ev.sha256.slice(0, 12)}…</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-xs text-brandGrey">Sin evidencia adjunta (aceptable para declarado; requerida para auditar consumos altos).</p>
              )}
            </div>
          </div>

          {sellos.length > 0 && (
            <div>
              <div className="text-xs font-medium uppercase text-brandGrey">Sellos de integridad</div>
              <ul className="mt-1 space-y-1 text-xs">
                {sellos.map((st) => (
                  <li key={st.id} className="flex flex-wrap items-center gap-2">
                    <SelloBadge esDemo={st.esDemo} href={`/verificar?sello=${st.id}`} />
                    <code className="text-brandGrey">sha256:{st.sha256.slice(0, 16)}…</code>
                    <code className="text-brandGrey">tx:{st.txHash.slice(0, 14)}…</code>
                    <span className="text-brandGrey">{new Date(st.timestamp).toLocaleDateString('es-AR')}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {auditRegistro.length > 0 && (
            <div>
              <div className="text-xs font-medium uppercase text-brandGrey">Historial</div>
              <ul className="mt-1 space-y-0.5 text-xs text-brandGrey">
                {auditRegistro.map((a) => (
                  <li key={a.id}>
                    {new Date(a.timestamp).toLocaleString('es-AR')} · {nombrePersona(s, a.actor)} · {a.accion}
                    {a.antes ? ` (${a.antes} → ${a.despues})` : ''}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!soloLectura && (
            <div className="flex flex-wrap gap-2 border-t border-borderGray pt-3">
              {r.estado === 'declarado' && (
                <>
                  <Boton size="sm" onClick={onVerificar} disabled={busy}>
                    {busy ? '…' : '✓ Verificar y sellar'}
                  </Boton>
                  <Boton size="sm" variant="danger" onClick={onRechazar} disabled={busy}>
                    ✕ Rechazar
                  </Boton>
                </>
              )}
              {r.estado === 'verificado' && (
                <>
                  <Boton size="sm" onClick={onAuditar} disabled={busy} title="Debe hacerlo alguien distinto de quien verificó">
                    {busy ? '…' : '✓✓ Auditar (doble control)'}
                  </Boton>
                  <Boton size="sm" variant="danger" onClick={onRechazar} disabled={busy}>
                    ✕ Rechazar
                  </Boton>
                </>
              )}
              {(r.estado === 'auditado' || r.estado === 'rechazado') && (
                <span className="text-xs text-brandGrey">
                  {r.estado === 'auditado' ? 'Cerrado con doble control.' : 'Esperando corrección del residente.'}
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ModalRechazo({
  registroId,
  onClose,
  onConfirm,
}: {
  registroId: string | null;
  onClose: () => void;
  onConfirm: (nota: string) => void;
}) {
  const [nota, setNota] = useState('');
  return (
    <Modal open={registroId !== null} onClose={onClose} title="Rechazar registro">
      <div className="space-y-3">
        <Field label="Nota para el residente (obligatoria)" help="Explicá en lenguaje llano qué corregir.">
          <textarea className={inputCls} rows={3} value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Ej.: el valor parece incluir dos meses; revisá la factura adjunta." />
        </Field>
        <div className="flex justify-end gap-2">
          <Boton variant="ghost" onClick={onClose}>
            Cancelar
          </Boton>
          <Boton
            variant="danger"
            onClick={() => {
              onConfirm(nota);
              setNota('');
            }}
            disabled={!nota.trim()}
          >
            Rechazar
          </Boton>
        </div>
      </div>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Inventario ISO 14064 + expediente
// ---------------------------------------------------------------------------

function InventarioExpediente({
  s,
  persona,
  soloLectura,
}: {
  s: EstadoIxb;
  persona: Persona;
  soloLectura: boolean;
}) {
  const [barrioId, setBarrioId] = useState(s.barrios[0]?.id ?? '');
  const [desde, setDesde] = useState(PERIODOS_SEED[0]);
  const [hasta, setHasta] = useState(PERIODOS_SEED.at(-1)!);
  const [estados, setEstados] = useState<EstadoVerificacion[]>(['verificado', 'auditado']);
  const [tipo, setTipo] = useState<'inventario_iso' | 'expediente_certificacion'>('expediente_certificacion');
  const [error, setError] = useState('');
  const [busyRep, setBusyRep] = useState<string | null>(null);

  const inv = inventarioDe(s, { barrioId, periodoDesde: desde, periodoHasta: hasta, estados });
  const barrio = s.barrios.find((b) => b.id === barrioId);

  const toggleEstado = (e: EstadoVerificacion) =>
    setEstados((prev) => (prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]));

  return (
    <div className="space-y-4">
      <Card>
        <SectionTitle sub="El inventario agrega dato_actividad × factor por categoría ISO 14064-1 y Scope GHG. Elegí qué estados entran (para expediente: verificado + auditado).">
          Inventario — {barrio?.nombre}
        </SectionTitle>
        <div className="flex flex-wrap items-end gap-3">
          <Field label="Barrio">
            <select className={`${inputCls} !w-auto`} value={barrioId} onChange={(e) => setBarrioId(e.target.value)}>
              {s.barrios.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.nombre}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Desde">
            <select className={`${inputCls} !w-auto`} value={desde} onChange={(e) => setDesde(e.target.value)}>
              {PERIODOS_SEED.map((p) => (
                <option key={p} value={p}>
                  {mesLabel(p)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Hasta">
            <select className={`${inputCls} !w-auto`} value={hasta} onChange={(e) => setHasta(e.target.value)}>
              {PERIODOS_SEED.map((p) => (
                <option key={p} value={p}>
                  {mesLabel(p)}
                </option>
              ))}
            </select>
          </Field>
          <div className="flex gap-2 pb-1">
            {(['declarado', 'verificado', 'auditado'] as EstadoVerificacion[]).map((e) => (
              <label key={e} className="flex items-center gap-1 text-xs">
                <input type="checkbox" checked={estados.includes(e)} onChange={() => toggleEstado(e)} />
                {e}
              </label>
            ))}
          </div>
        </div>

        <div className="custom-scrollbar mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-borderGray text-left text-xs uppercase tracking-wide text-brandGrey">
                <th className="py-2 pr-3">Categoría ISO 14064-1</th>
                <th className="py-2 pr-3 text-right">kg CO₂e</th>
                <th className="py-2 pr-3 text-right">t CO₂e</th>
              </tr>
            </thead>
            <tbody>
              {(Object.entries(inv.totales.porCategoriaIso) as [string, number][]).map(([cat, kg]) => (
                <tr key={cat} className="border-b border-borderGray/60">
                  <td className="py-1.5 pr-3">{CATEGORIA_ISO_LABEL[Number(cat) as CategoriaIso]}</td>
                  <td className="py-1.5 pr-3 text-right">{fmtNum(kg, 1)}</td>
                  <td className="py-1.5 pr-3 text-right">{fmtNum(kg / 1000, 2)}</td>
                </tr>
              ))}
              <tr className="font-medium">
                <td className="py-2 pr-3">Total</td>
                <td className="py-2 pr-3 text-right">{fmtNum(inv.totales.totalKg, 1)}</td>
                <td className="py-2 pr-3 text-right">{fmtTCO2e(inv.totales.totalKg)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-xs text-brandGrey">
          <span>GHG Protocol:</span>
          {(Object.entries(inv.totales.porScope) as [string, number][]).map(([sc, kg]) => (
            <Badge key={sc} tone="neutral">
              Scope {sc}: {fmtKgCO2e(kg)}
            </Badge>
          ))}
          <span className="ml-auto">{inv.totales.registrosIncluidos} registros incluidos</span>
        </div>

        {inv.totales.registrosSinFactor > 0 && (
          <div className="mt-3">
            <Banner tone="warn">
              {inv.totales.registrosSinFactor} registro(s) <strong>sin factor asignado</strong> (p. ej.
              efluentes/biodigestor) quedan fuera del total — asignalos en la pestaña Factores.
            </Banner>
          </div>
        )}
        {inv.totales.usaFactoresDeReferencia && (
          <div className="mt-2">
            <Banner tone="warn">
              El total usa factores <strong>de referencia (calibrar)</strong>. Reemplazalos por el factor
              oficial vigente antes de emitir el expediente.
            </Banner>
          </div>
        )}

        {!soloLectura && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-borderGray pt-4">
            <select className={`${inputCls} !w-auto`} value={tipo} onChange={(e) => setTipo(e.target.value as typeof tipo)}>
              <option value="expediente_certificacion">Expediente de certificación</option>
              <option value="inventario_iso">Inventario ISO (interno)</option>
            </select>
            <Boton
              onClick={() => {
                setError('');
                try {
                  generarReporte(persona, { tipo, barrioId, periodoDesde: desde, periodoHasta: hasta, estadosIncluidos: estados });
                } catch (e) {
                  setError(e instanceof Error ? e.message : 'No se pudo generar.');
                }
              }}
            >
              Generar reporte con snapshot
            </Boton>
            {error && <span className="text-xs text-customRed">{error}</span>}
          </div>
        )}
      </Card>

      <Card>
        <SectionTitle sub="Snapshot congelado de cálculos y factores. Sellalo (hash en cadena) y exportalo para el certificador (ISO/EDGE/SITES). El documento dice “en preparación”: certifica un tercero.">
          🗂 Expedientes generados
        </SectionTitle>
        {s.reportes.length === 0 && <p className="text-sm text-brandGrey">Todavía no generaste reportes.</p>}
        <div className="space-y-2">
          {s.reportes.map((rep) => {
            const stamp = rep.stampId ? s.stamps.find((st) => st.id === rep.stampId) : undefined;
            const b = s.barrios.find((x) => x.id === rep.barrioId);
            return (
              <div key={rep.id} className="flex flex-wrap items-center gap-2 rounded-cardSm border border-borderGray p-3 text-sm">
                <span className="font-medium">
                  {rep.tipo === 'expediente_certificacion' ? '📑 Expediente' : '📄 Inventario'} — {b?.nombre}
                </span>
                <span className="text-brandGrey">
                  {mesLabel(rep.periodoDesde)} → {mesLabel(rep.periodoHasta)} · {rep.estadosIncluidos.join('+')}
                </span>
                <Badge tone="neutral">{fmtTCO2e(rep.totales.totalKg)}</Badge>
                {stamp ? (
                  <SelloBadge esDemo={stamp.esDemo} href={`/verificar?sello=${stamp.id}`} />
                ) : (
                  <Badge tone="declared">sin sellar</Badge>
                )}
                <span className="ml-auto flex gap-2">
                  {!soloLectura && !stamp && (
                    <Boton
                      size="sm"
                      variant="secondary"
                      disabled={busyRep === rep.id}
                      onClick={async () => {
                        setBusyRep(rep.id);
                        try {
                          await sellarReporte(persona, rep.id);
                        } catch (e) {
                          setError(e instanceof Error ? e.message : 'No se pudo sellar.');
                        } finally {
                          setBusyRep(null);
                        }
                      }}
                    >
                      ⛓ Sellar
                    </Boton>
                  )}
                  <Boton size="sm" variant="ghost" onClick={() => descargarArchivo(`${rep.id}.json`, reporteAJson(rep, stamp), 'application/json')}>
                    JSON
                  </Boton>
                  <Boton size="sm" variant="ghost" onClick={() => descargarArchivo(`${rep.id}.csv`, reporteACsv(rep, s.registros), 'text/csv')}>
                    CSV
                  </Boton>
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Factores de emisión
// ---------------------------------------------------------------------------

function GestionFactores({
  s,
  persona,
  soloLectura,
}: {
  s: EstadoIxb;
  persona: Persona;
  soloLectura: boolean;
}) {
  const [editando, setEditando] = useState<Factor | null>(null);
  const [creando, setCreando] = useState(false);
  const puede = can(persona.rol, 'gestionar_factores') && !soloLectura;

  return (
    <div className="space-y-4">
      <Card>
        <SectionTitle
          right={
            puede ? (
              <Boton size="sm" variant="secondary" onClick={() => setCreando(true)}>
                ＋ Factor local
              </Boton>
            ) : undefined
          }
          sub="Regla §13: ningún factor sin fuente. Los marcados “calibrar” son valores de referencia del demo — se reemplazan por el oficial vigente (Secretaría de Energía / CAMMESA / prestador) o por Climatiq."
        >
          ⚖️ Factores vigentes
        </SectionTitle>
        <div className="custom-scrollbar overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-borderGray text-left text-xs uppercase tracking-wide text-brandGrey">
                <th className="py-2 pr-3">Factor</th>
                <th className="py-2 pr-3">Valor</th>
                <th className="py-2 pr-3">Vigencia</th>
                <th className="py-2 pr-3">Origen</th>
                <th className="py-2 pr-3">Fuente</th>
                <th className="py-2 pr-3" />
              </tr>
            </thead>
            <tbody>
              {s.factores.map((f) => (
                <tr key={f.id} className="border-b border-borderGray/60 align-top">
                  <td className="py-2 pr-3">
                    <div className="font-medium">{f.nombre}</div>
                    <div className="text-xs text-brandGrey">{f.region}</div>
                  </td>
                  <td className="py-2 pr-3 whitespace-nowrap">
                    {fmtNum(f.valor, 2)} <span className="text-xs text-brandGrey">{f.unidad}</span>
                    {f.calibrar && (
                      <div>
                        <Badge tone="declared">⚠ calibrar</Badge>
                      </div>
                    )}
                  </td>
                  <td className="py-2 pr-3 text-xs">{f.vigencia}</td>
                  <td className="py-2 pr-3 text-xs">{f.origen}</td>
                  <td className="max-w-64 py-2 pr-3 text-xs text-brandGrey" title={`${f.fuente}${f.metodo ? ` — ${f.metodo}` : ''}`}>
                    <span className="line-clamp-2">{f.fuente}</span>
                  </td>
                  <td className="py-2 pr-3">
                    {puede && (
                      <Boton size="sm" variant="ghost" onClick={() => setEditando(f)}>
                        Editar
                      </Boton>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <SectionTitle sub="Qué factor usa cada variable. “Sin factor” = el dato se registra pero no suma al inventario (queda señalado). Ejemplo real: efluentes/biodigestor espera calibración técnica (IPCC 2019, cap. 6).">
          🔗 Asignación variable → factor
        </SectionTitle>
        <div className="grid gap-2 md:grid-cols-2">
          {VARIABLES.filter((v) => !v.informativa).map((v) => {
            const efectivo = factorEfectivo(s, v.id);
            return (
              <div key={v.id} className="flex items-center justify-between gap-2 rounded-cardSm border border-borderGray px-3 py-2 text-sm">
                <span className="min-w-0">
                  {v.icono} {v.nombre}
                  {!efectivo && <Badge tone="declared">sin factor</Badge>}
                </span>
                {puede ? (
                  <select
                    className={`${inputCls} !w-52 !py-1 text-xs`}
                    value={efectivo?.id ?? ''}
                    onChange={(e) => {
                      try {
                        asignarFactorVariable(persona, v.id, e.target.value || null);
                      } catch (err) {
                        alert(err instanceof Error ? err.message : 'Error');
                      }
                    }}
                  >
                    <option value="">— sin factor —</option>
                    {s.factores.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.nombre}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="text-xs text-brandGrey">{efectivo?.nombre ?? '—'}</span>
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-brandGrey">
          🔮 Con <code>CLIMATIQ_API_KEY</code> (Fase 2), acá se buscan factores del dataset Climatiq
          (944k+, GHG Protocol, tCO₂e GWP100) y se suben los locales como factores privados.
        </p>
      </Card>

      <ModalFactor
        factor={editando}
        creando={creando}
        onClose={() => {
          setEditando(null);
          setCreando(false);
        }}
        persona={persona}
      />
    </div>
  );
}

function ModalFactor({
  factor,
  creando,
  onClose,
  persona,
}: {
  factor: Factor | null;
  creando: boolean;
  onClose: () => void;
  persona: Persona;
}) {
  const open = creando || factor !== null;
  const [nombre, setNombre] = useState('');
  const [valor, setValor] = useState('');
  const [unidad, setUnidad] = useState('');
  const [fuente, setFuente] = useState('');
  const [vigencia, setVigencia] = useState('');
  const [metodo, setMetodo] = useState('');
  const [calibrar, setCalibrar] = useState(false);
  const [error, setError] = useState('');
  const [cargado, setCargado] = useState<string | null>(null);

  // Sincronizar el formulario al abrir (id distinto o alta nueva).
  const claveActual = factor?.id ?? (creando ? '__nuevo__' : null);
  if (open && cargado !== claveActual) {
    setCargado(claveActual);
    setNombre(factor?.nombre ?? '');
    setValor(factor ? String(factor.valor) : '');
    setUnidad(factor?.unidad ?? 'kgCO₂e/…');
    setFuente(factor?.fuente ?? '');
    setVigencia(factor?.vigencia ?? '');
    setMetodo(factor?.metodo ?? '');
    setCalibrar(factor?.calibrar ?? false);
    setError('');
  }

  return (
    <Modal open={open} onClose={onClose} title={factor ? `Editar — ${factor.nombre}` : 'Nuevo factor local'} wide>
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Nombre">
          <input className={inputCls} value={nombre} onChange={(e) => setNombre(e.target.value)} disabled={!!factor} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Valor">
            <input className={inputCls} type="number" step="any" value={valor} onChange={(e) => setValor(e.target.value)} />
          </Field>
          <Field label="Unidad">
            <input className={inputCls} value={unidad} onChange={(e) => setUnidad(e.target.value)} disabled={!!factor} />
          </Field>
        </div>
        <Field label="Fuente (obligatoria)" help="Cita verificable: organismo, documento, año.">
          <textarea className={inputCls} rows={2} value={fuente} onChange={(e) => setFuente(e.target.value)} />
        </Field>
        <Field label="Vigencia">
          <input className={inputCls} value={vigencia} onChange={(e) => setVigencia(e.target.value)} placeholder="2026 (oficial) / DEMO" />
        </Field>
        <Field label="Método / derivación (opcional)">
          <textarea className={inputCls} rows={2} value={metodo} onChange={(e) => setMetodo(e.target.value)} />
        </Field>
        <label className="flex items-center gap-2 self-end pb-2 text-sm">
          <input type="checkbox" checked={calibrar} onChange={(e) => setCalibrar(e.target.checked)} />
          Requiere calibración (valor de referencia)
        </label>
      </div>
      {error && (
        <div className="mt-3">
          <Banner tone="warn">{error}</Banner>
        </div>
      )}
      <div className="mt-4 flex justify-end gap-2">
        <Boton variant="ghost" onClick={onClose}>
          Cancelar
        </Boton>
        <Boton
          onClick={() => {
            try {
              if (factor) {
                actualizarFactor(persona, factor.id, {
                  valor: Number(valor),
                  fuente,
                  vigencia,
                  metodo: metodo || undefined,
                  calibrar,
                });
              } else {
                crearFactor(persona, {
                  nombre,
                  valor: Number(valor),
                  unidad,
                  fuente,
                  vigencia: vigencia || 's/d',
                  metodo: metodo || undefined,
                  calibrar,
                  region: 'AR',
                });
              }
              onClose();
            } catch (e) {
              setError(e instanceof Error ? e.message : 'No se pudo guardar.');
            }
          }}
        >
          Guardar (queda auditado)
        </Boton>
      </div>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Log de auditoría
// ---------------------------------------------------------------------------

function LogAuditoria({ s }: { s: EstadoIxb }) {
  const [filtro, setFiltro] = useState('todas');
  const acciones = useMemo(
    () => Array.from(new Set(s.auditoria.map((a) => a.accion))).sort(),
    [s.auditoria]
  );
  const filas = s.auditoria
    .filter((a) => filtro === 'todas' || a.accion === filtro)
    .slice(-300)
    .reverse();

  return (
    <Card>
      <SectionTitle
        right={
          <select className={`${inputCls} !w-auto`} value={filtro} onChange={(e) => setFiltro(e.target.value)}>
            <option value="todas">Todas las acciones</option>
            {acciones.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        }
        sub="Append-only: cada acción queda registrada con actor, rol y antes/después. Nunca se edita ni se borra (§8)."
      >
        🧾 Log de auditoría ({s.auditoria.length} entradas)
      </SectionTitle>
      <div className="custom-scrollbar max-h-[520px] overflow-auto">
        <table className="w-full min-w-[760px] text-xs">
          <thead className="sticky top-0 bg-white">
            <tr className="border-b border-borderGray text-left uppercase tracking-wide text-brandGrey">
              <th className="py-2 pr-3">Fecha</th>
              <th className="py-2 pr-3">Actor</th>
              <th className="py-2 pr-3">Acción</th>
              <th className="py-2 pr-3">Target</th>
              <th className="py-2 pr-3">Cambio</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((a) => (
              <tr key={a.id} className="border-b border-borderGray/50 align-top">
                <td className="whitespace-nowrap py-1.5 pr-3 text-brandGrey">
                  {new Date(a.timestamp).toLocaleString('es-AR')}
                </td>
                <td className="py-1.5 pr-3">
                  {nombrePersona(s, a.actor)} <span className="text-brandGrey">({a.actorRol})</span>
                </td>
                <td className="py-1.5 pr-3">{a.accion}</td>
                <td className="py-1.5 pr-3 text-brandGrey">
                  {a.targetType}:{a.targetId.length > 28 ? `${a.targetId.slice(0, 28)}…` : a.targetId}
                </td>
                <td className="max-w-72 py-1.5 pr-3 text-brandGrey">
                  {a.antes || a.despues ? (
                    <span className="line-clamp-2">
                      {a.antes ?? '∅'} → {a.despues ?? '∅'}
                    </span>
                  ) : (
                    '—'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
