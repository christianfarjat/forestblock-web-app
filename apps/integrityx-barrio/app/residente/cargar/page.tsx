'use client';

/**
 * Wizard de carga guiada (§5.1): pocos pasos, íconos, lenguaje llano,
 * evidencia opcional (foto/factura). El OCR con Gemini/Document AI
 * autocompleta en Fase 2 — el campo ya guarda el archivo con su hash.
 */
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
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
  ProgressBar,
} from '@/components/common/ui';
import { fmtKgCO2e, fmtNum, mesLabel } from '@/lib/ixb_format';
import { sha256HexBytes } from '@/lib/ixb_hash';
import { can } from '@/lib/ixb_rbac';
import { PERIODOS_SEED, PERIODO_ACTUAL } from '@/lib/ixb_seed';
import {
  factorEfectivo,
  guardarRegistro,
  personaActual,
  useIxbState,
} from '@/lib/ixb_store';
import type { Evidencia, Registro, VariableId } from '@/lib/ixb_types';
import { VARIABLE_BY_ID, VARIABLES } from '@/lib/ixb_types';

const GRUPOS: { id: string; titulo: string; icono: string; intro: string; vars: VariableId[] }[] = [
  {
    id: 'energia',
    titulo: 'Energía',
    icono: '⚡',
    intro: 'Los números están en tus facturas de luz y gas. Si no usás alguno, dejalo vacío.',
    vars: ['energia_red', 'gas_natural', 'glp', 'solar_autoconsumo'],
  },
  {
    id: 'agua',
    titulo: 'Agua',
    icono: '🚿',
    intro: 'El consumo figura en la factura o el medidor. El biodigestor es solo si tenés.',
    vars: ['agua_red', 'efluentes_tratados'],
  },
  {
    id: 'movilidad',
    titulo: 'Movilidad',
    icono: '🚗',
    intro: 'Litros que cargaste en el mes para los vehículos de tu casa.',
    vars: ['combustible_nafta', 'combustible_gasoil'],
  },
  {
    id: 'residuos',
    titulo: 'Residuos',
    icono: '🗑️',
    intro: 'Una bolsa grande llena pesa unos 5 kg. El compost se anota aparte, ¡suma logros!',
    vars: ['residuos_relleno', 'compost'],
  },
];

const PERIODOS_DISPONIBLES = [...PERIODOS_SEED, PERIODO_ACTUAL];

export default function PaginaCargar() {
  return (
    <Suspense fallback={<Cargando />}>
      <WizardCarga />
    </Suspense>
  );
}

type ResumenGuardado = { guardados: string[]; omitidos: string[]; errores: string[] };

function WizardCarga() {
  const s = useIxbState();
  const persona = personaActual(s);
  const params = useSearchParams();

  const [paso, setPaso] = useState(0); // 0 período · 1..4 grupos · 5 revisión · 6 éxito
  const [periodo, setPeriodo] = useState(params.get('periodo') ?? PERIODOS_SEED.at(-1)!);
  const [valores, setValores] = useState<Partial<Record<VariableId, string>>>({});
  const [evidencias, setEvidencias] = useState<Record<string, Evidencia[]>>({});
  const [guardando, setGuardando] = useState(false);
  const [resumen, setResumen] = useState<ResumenGuardado | null>(null);

  const existentes = useMemo(() => {
    const map = new Map<VariableId, Registro>();
    if (!persona?.viviendaId) return map;
    for (const r of s.registros) {
      if (r.viviendaId === persona.viviendaId && r.periodo === periodo) map.set(r.variable, r);
    }
    return map;
  }, [s.registros, persona?.viviendaId, periodo]);

  // Prefill con lo ya declarado/rechazado del período elegido.
  useEffect(() => {
    const iniciales: Partial<Record<VariableId, string>> = {};
    existentes.forEach((r, vid) => {
      iniciales[vid] = String(r.valor);
    });
    setValores(iniciales);
  }, [existentes]);

  if (!s.listo) return <Cargando />;
  if (!persona || !can(persona.rol, 'cargar_registros') || !persona.viviendaId) {
    return (
      <EmptyState icono="🏡" titulo="Esta pantalla es para residentes">
        Elegí una persona con rol Residente en el selector de arriba.
      </EmptyState>
    );
  }

  const vivienda = s.viviendas.find((v) => v.id === persona.viviendaId)!;
  const totalPasos = GRUPOS.length + 2;
  const pct = Math.round((Math.min(paso, totalPasos - 1) / (totalPasos - 1)) * 100);

  const bloqueado = (vid: VariableId) => {
    const e = existentes.get(vid);
    return e ? e.estado === 'verificado' || e.estado === 'auditado' : false;
  };

  const aGuardar = (): { vid: VariableId; valor: number; nuevo: boolean }[] => {
    const out: { vid: VariableId; valor: number; nuevo: boolean }[] = [];
    for (const g of GRUPOS) {
      for (const vid of g.vars) {
        const crudo = valores[vid]?.trim();
        if (!crudo) continue;
        const valor = Number(crudo.replace(',', '.'));
        if (!Number.isFinite(valor) || valor < 0) continue;
        if (bloqueado(vid)) continue;
        const previo = existentes.get(vid);
        const evidenciaNueva = (evidencias[g.id] ?? []).length > 0;
        if (previo && previo.valor === valor && !evidenciaNueva && previo.estado === 'declarado') continue;
        out.push({ vid, valor, nuevo: !previo });
      }
    }
    return out;
  };

  async function confirmar() {
    setGuardando(true);
    const res: ResumenGuardado = { guardados: [], omitidos: [], errores: [] };
    for (const g of GRUPOS) {
      let evidenciaPendiente = evidencias[g.id] ?? [];
      for (const vid of g.vars) {
        const item = aGuardar().find((x) => x.vid === vid);
        if (!item) continue;
        try {
          await guardarRegistro(persona!, {
            viviendaId: vivienda.id,
            variable: vid,
            valor: item.valor,
            periodo,
            evidencia: evidenciaPendiente,
          });
          evidenciaPendiente = []; // la evidencia del grupo va al primer dato guardado
          res.guardados.push(VARIABLE_BY_ID[vid].nombreSimple);
        } catch (e) {
          res.errores.push(
            `${VARIABLE_BY_ID[vid].nombreSimple}: ${e instanceof Error ? e.message : 'error'}`
          );
        }
      }
    }
    existentes.forEach((r, vid) => {
      if (bloqueado(vid)) res.omitidos.push(VARIABLE_BY_ID[vid].nombreSimple);
    });
    setResumen(res);
    setGuardando(false);
    setPaso(totalPasos);
  }

  // ---- Paso éxito -----------------------------------------------------------
  if (paso === totalPasos && resumen) {
    return (
      <Card className="mx-auto max-w-xl text-center">
        <div className="text-5xl">🎉</div>
        <h1 className="mt-2 text-xl font-medium">¡Listo! Datos de {mesLabel(periodo)} enviados</h1>
        <p className="mt-2 text-sm text-filtersGray">
          {resumen.guardados.length > 0
            ? `Guardamos: ${resumen.guardados.join(', ')}.`
            : 'No hubo cambios para guardar.'}{' '}
          Quedan <strong>declarados</strong> hasta que el equipo técnico los verifique.
        </p>
        {resumen.omitidos.length > 0 && (
          <p className="mt-2 text-xs text-brandGrey">
            Ya verificados (no se tocan): {resumen.omitidos.join(', ')}.
          </p>
        )}
        {resumen.errores.length > 0 && (
          <div className="mt-3 text-left">
            <Banner tone="warn">{resumen.errores.join(' · ')}</Banner>
          </div>
        )}
        <div className="mt-5 flex justify-center gap-2">
          <Link href="/residente">
            <Boton>Ver mi huella</Boton>
          </Link>
          <Boton
            variant="ghost"
            onClick={() => {
              setResumen(null);
              setPaso(0);
            }}
          >
            Cargar otro mes
          </Boton>
        </div>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-medium">Carga mensual — {vivienda.lote}</h1>
          <p className="text-sm text-brandGrey">
            Paso {Math.min(paso + 1, totalPasos)} de {totalPasos} · sin jerga, prometido 🤝
          </p>
        </div>
        <Link href="/residente" className="text-sm text-brandGrey underline">
          Salir
        </Link>
      </div>
      <ProgressBar pct={pct} />

      {paso === 0 && (
        <Card>
          <h2 className="text-lg font-medium">¿De qué mes son los datos?</h2>
          <p className="mb-3 text-sm text-brandGrey">
            Podés cargar el mes pasado o completar meses anteriores.
          </p>
          <div className="flex flex-wrap gap-2">
            {PERIODOS_DISPONIBLES.map((p) => {
              const tiene = s.registros.some(
                (r) => r.viviendaId === vivienda.id && r.periodo === p
              );
              return (
                <button
                  key={p}
                  onClick={() => setPeriodo(p)}
                  className={`rounded-pill border px-4 py-2 text-sm ${
                    periodo === p
                      ? 'border-forest bg-forest text-limeBright'
                      : 'border-borderGray bg-white hover:border-forest'
                  }`}
                >
                  {mesLabel(p)} {tiene ? '·✓' : ''}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-brandGrey">✓ = ya tiene datos (podés completar o corregir lo declarado).</p>
          <div className="mt-4 flex justify-end">
            <Boton onClick={() => setPaso(1)}>Empezar →</Boton>
          </div>
        </Card>
      )}

      {paso >= 1 && paso <= GRUPOS.length && (
        <PasoGrupo
          key={GRUPOS[paso - 1].id}
          grupo={GRUPOS[paso - 1]}
          periodo={periodo}
          valores={valores}
          setValores={setValores}
          evidencias={evidencias[GRUPOS[paso - 1].id] ?? []}
          setEvidencias={(ev) => setEvidencias((prev) => ({ ...prev, [GRUPOS[paso - 1].id]: ev }))}
          existentes={existentes}
          onAtras={() => setPaso(paso - 1)}
          onSeguir={() => setPaso(paso + 1)}
        />
      )}

      {paso === GRUPOS.length + 1 && (
        <Card>
          <h2 className="text-lg font-medium">Revisá antes de enviar</h2>
          <p className="mb-3 text-sm text-brandGrey">
            Estimación con los factores vigentes — el número final lo confirma la verificación
            técnica.
          </p>
          <RevisionTabla s={s} items={aGuardar()} />
          <div className="mt-4 flex justify-between">
            <Boton variant="ghost" onClick={() => setPaso(paso - 1)}>
              ← Volver
            </Boton>
            <Boton onClick={confirmar} disabled={guardando || aGuardar().length === 0}>
              {guardando ? 'Guardando…' : `Enviar ${aGuardar().length} dato(s) ✓`}
            </Boton>
          </div>
        </Card>
      )}
    </div>
  );
}

function PasoGrupo({
  grupo,
  periodo,
  valores,
  setValores,
  evidencias,
  setEvidencias,
  existentes,
  onAtras,
  onSeguir,
}: {
  grupo: (typeof GRUPOS)[number];
  periodo: string;
  valores: Partial<Record<VariableId, string>>;
  setValores: React.Dispatch<React.SetStateAction<Partial<Record<VariableId, string>>>>;
  evidencias: Evidencia[];
  setEvidencias: (ev: Evidencia[]) => void;
  existentes: Map<VariableId, Registro>;
  onAtras: () => void;
  onSeguir: () => void;
}) {
  const [errorArchivo, setErrorArchivo] = useState('');

  async function agregarArchivo(file: File) {
    setErrorArchivo('');
    if (file.size > 400_000) {
      setErrorArchivo('El archivo supera 400 KB (límite de la demo). Probá con una foto más liviana.');
      return;
    }
    const buf = await file.arrayBuffer();
    const sha = await sha256HexBytes(buf);
    const url = await new Promise<string>((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(String(fr.result));
      fr.onerror = () => reject(fr.error);
      fr.readAsDataURL(file);
    });
    setEvidencias([
      ...evidencias,
      {
        id: `ev_${sha.slice(0, 10)}`,
        tipo: file.type.startsWith('image/') ? 'foto' : 'factura',
        nombre: file.name,
        url,
        sha256: sha,
      },
    ]);
  }

  return (
    <Card>
      <h2 className="text-lg font-medium">
        {grupo.icono} {grupo.titulo} — {mesLabel(periodo)}
      </h2>
      <p className="mb-4 text-sm text-brandGrey">{grupo.intro}</p>

      <div className="space-y-4">
        {grupo.vars.map((vid) => {
          const def = VARIABLE_BY_ID[vid];
          const previo = existentes.get(vid);
          const lockeado = previo && (previo.estado === 'verificado' || previo.estado === 'auditado');
          return (
            <div key={vid} className="rounded-cardSm border border-borderGray p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-medium">
                  {def.icono} {def.nombreSimple}{' '}
                  {def.informativa && (
                    <Badge tone="lime" title="Se muestra aparte: no suma a tu huella.">
                      aparte
                    </Badge>
                  )}
                </span>
                {previo && <EstadoBadge estado={previo.estado} />}
              </div>
              <p className="mt-1 text-xs text-brandGrey">{def.ayuda}</p>
              {previo?.estado === 'rechazado' && previo.notaAuditor && (
                <p className="mt-1 text-xs text-customRed">Nota del técnico: «{previo.notaAuditor}»</p>
              )}
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="any"
                  disabled={!!lockeado}
                  placeholder="Dejar vacío si no aplica"
                  className={`${inputCls} max-w-52 disabled:bg-backgroundGray`}
                  value={valores[vid] ?? ''}
                  onChange={(e) => setValores((prev) => ({ ...prev, [vid]: e.target.value }))}
                />
                <span className="text-sm text-brandGrey">{def.unidad}</span>
              </div>
              {lockeado && (
                <p className="mt-1 text-xs text-brandGrey">
                  Este dato ya fue {previo!.estado} y quedó sellado: para corregirlo hablá con la
                  administración.
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-cardSm bg-backgroundGray p-3">
        <Field
          label="📎 Adjuntar foto o factura (opcional)"
          help="En la próxima fase, la IA lee la factura y completa los números por vos (OCR). El archivo se guarda con su huella digital (SHA-256)."
        >
          <input
            type="file"
            accept="image/*,application/pdf"
            className="block w-full text-xs text-brandGrey file:mr-3 file:rounded-pill file:border-0 file:bg-forest file:px-4 file:py-2 file:text-xs file:font-medium file:text-limeBright"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void agregarArchivo(f);
              e.target.value = '';
            }}
          />
        </Field>
        {errorArchivo && <p className="mt-1 text-xs text-customRed">{errorArchivo}</p>}
        {evidencias.length > 0 && (
          <ul className="mt-2 space-y-1">
            {evidencias.map((ev) => (
              <li key={ev.id} className="flex items-center justify-between gap-2 text-xs">
                <span className="truncate">
                  {ev.tipo === 'foto' ? '🖼' : '📄'} {ev.nombre}{' '}
                  <span className="text-brandGrey">sha256:{ev.sha256?.slice(0, 10)}…</span>
                </span>
                <button
                  className="text-customRed"
                  onClick={() => setEvidencias(evidencias.filter((x) => x.id !== ev.id))}
                >
                  quitar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 flex justify-between">
        <Boton variant="ghost" onClick={onAtras}>
          ← Volver
        </Boton>
        <Boton onClick={onSeguir}>Seguir →</Boton>
      </div>
    </Card>
  );
}

function RevisionTabla({
  s,
  items,
}: {
  s: ReturnType<typeof useIxbState>;
  items: { vid: VariableId; valor: number; nuevo: boolean }[];
}) {
  if (items.length === 0) {
    return <Banner tone="info">No hay datos nuevos ni corregidos para enviar.</Banner>;
  }
  let total = 0;
  let hayReferencia = false;
  const filas = items.map(({ vid, valor, nuevo }) => {
    const def = VARIABLE_BY_ID[vid];
    const factor = factorEfectivo(s, vid);
    const kg = !def.informativa && factor ? valor * factor.valor : null;
    if (kg !== null) total += kg;
    if (factor?.calibrar && kg !== null) hayReferencia = true;
    return { def, valor, kg, factor, nuevo };
  });

  return (
    <div className="space-y-2">
      {filas.map(({ def, valor, kg, factor, nuevo }) => (
        <div
          key={def.id}
          className="flex flex-wrap items-center justify-between gap-2 rounded-cardSm border border-borderGray px-3 py-2 text-sm"
        >
          <span>
            {def.icono} {def.nombreSimple}: <strong>{fmtNum(valor, 1)}</strong> {def.unidad}{' '}
            {!nuevo && <Badge tone="declared">corrección</Badge>}
          </span>
          <span className="text-brandGrey" title={factor ? `${factor.nombre} — ${factor.fuente}` : undefined}>
            {def.informativa
              ? 'se muestra aparte'
              : kg !== null
                ? `≈ ${fmtKgCO2e(kg)}${factor?.calibrar ? ' ⚠' : ''}`
                : 'cálculo pendiente (sin factor asignado)'}
          </span>
        </div>
      ))}
      <div className="flex items-center justify-between rounded-cardSm bg-limeSoft/50 px-3 py-2 text-sm font-medium">
        <span>Huella estimada de lo que estás enviando</span>
        <span>≈ {fmtKgCO2e(total)}</span>
      </div>
      {hayReferencia && (
        <p className="text-xs text-brandGrey">
          ⚠ = usa un factor de referencia en calibración; puede ajustarse en la verificación.
        </p>
      )}
    </div>
  );
}
