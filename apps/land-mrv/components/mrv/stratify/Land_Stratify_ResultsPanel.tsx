'use client';

/**
 * Land_Stratify_ResultsPanel — resultados de una corrida de estratificación
 * (spec MJM-FB-MRV-IT-001-V0 §2.5): resumen de corrida, tabla de estratos,
 * evidencia DI (Era 2), puntos del diseño de muestreo y exports ENTE.
 *
 * Requisito canónico: colores y numeración E1..E5 SIEMPRE por
 * `degradation_rank` (1 = más degradado = rojo … 5 = mejor = verde oscuro),
 * nunca por `stratum_id` crudo del clusterer.
 */

import { useMemo, useState } from 'react';

import {
  Badge,
  Button,
  Card,
  SectionTitle,
  StatChip,
  type BadgeTone,
} from '@/components/common/ui';
import { activePrimaries } from '@/lib/strat_api';
import { ERA_LABEL } from '@/lib/strat_config';
import {
  aoiSlug,
  buildExportBundle,
  buildKmz,
  downloadBlob,
  downloadText,
  toPointsCsv,
  toPointsGeoJSON,
  toStatsCsv,
  toStrataGeoJSON,
} from '@/lib/strat_export';
import { POINT_TYPE_LABEL, rankColor } from '@/lib/strat_palette';
import type {
  DegradationRank,
  Era,
  PointType,
  QaStatus,
  SamplingPoint,
  StratRunResult,
} from '@/lib/strat_types';

export interface ResultsPanelProps {
  results: Partial<Record<Era, StratRunResult>>;
  activeEra: Era;
  onActiveEraChange: (era: Era) => void;
  selectedPointId: string | null;
  onSelectPoint: (pointId: string | null) => void;
  onReplacePoint: (era: Era, pointId: string) => void;
  replaceBusyPointId: string | null;
}

// ---------------------------------------------------------------------------
// Constantes y helpers de presentación
// ---------------------------------------------------------------------------

const ERA_ORDER: Era[] = ['era1_kmeans', 'era2_di'];

const ALL_RANKS: DegradationRank[] = [1, 2, 3, 4, 5];

/** Ranks con color de fondo claro (amarillo / verde claro) → texto forest. */
const LIGHT_RANKS: DegradationRank[] = [3, 4];

type PointFilter = 'all' | PointType | 'flags';

const POINT_FILTERS: { id: PointFilter; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'primary', label: 'Primarios' },
  { id: 'replacement', label: 'Reemplazos' },
  { id: 'alternative', label: 'Alternativos' },
  { id: 'flags', label: 'Con flags' },
];

const TYPE_BADGE_TONE: Record<PointType, BadgeTone> = {
  primary: 'forest',
  replacement: 'blue',
  alternative: 'grey',
};

const QA_BADGE: Record<QaStatus, { tone: BadgeTone; label: string }> = {
  ok: { tone: 'lime', label: 'OK' },
  review: { tone: 'yellow', label: 'Revisar' },
  replaced: { tone: 'grey', label: 'reemplazado' },
};

/** Formateo es-AR con decimales fijos. */
function fmt(value: number, decimals = 1): string {
  return value.toLocaleString('es-AR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function truncateId(id: string, max = 10): string {
  return id.length > max ? `${id.slice(0, max)}…` : id;
}

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Error generando el export.';
}

function hasFlags(p: SamplingPoint): boolean {
  return p.flags.near_aoi_boundary || p.flags.near_strata_boundary || p.flags.on_road;
}

/** Chip E{rank} con el color canónico de la paleta por degradation_rank. */
function RankChip({ rank }: { rank: DegradationRank }) {
  const light = LIGHT_RANKS.includes(rank);
  return (
    <span
      className={`inline-flex items-center rounded-pill px-2 py-0.5 text-[11px] font-bold ${
        light ? 'text-forest' : 'text-white'
      }`}
      style={{ backgroundColor: rankColor(rank) }}
    >
      E{rank}
    </span>
  );
}

/**
 * Variante mono de StatChip (mismo look) — StatChip solo acepta `value: string`
 * y acá el valor va en monoespaciado con truncate (ids / prefijos GCS).
 */
function MonoStatChip({ label, value, title }: { label: string; value: string; title?: string }) {
  return (
    <div className="min-w-0 rounded-cardSm border border-forest/10 bg-cream px-3 py-2" title={title}>
      <div className="text-[11px] uppercase tracking-wide text-brandGrey">{label}</div>
      <div className="truncate font-mono text-xs font-bold leading-5">{value}</div>
    </div>
  );
}

const TH_CLS = 'whitespace-nowrap px-3 py-2 text-left font-semibold';
const TH_NUM_CLS = 'whitespace-nowrap px-3 py-2 text-right font-semibold';
const TH_STICKY = 'sticky top-0 z-[1] bg-white';

// ---------------------------------------------------------------------------
// Panel
// ---------------------------------------------------------------------------

export default function Land_Stratify_ResultsPanel({
  results,
  activeEra,
  onActiveEraChange,
  selectedPointId,
  onSelectPoint,
  onReplacePoint,
  replaceBusyPointId,
}: ResultsPanelProps): JSX.Element {
  const [pointFilter, setPointFilter] = useState<PointFilter>('all');
  const [busyExport, setBusyExport] = useState<'zip' | 'kmz' | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  const eras = ERA_ORDER.filter((era) => results[era] !== undefined);
  const result = results[activeEra];

  const sortedStrata = useMemo(
    () => (result ? [...result.strata].sort((a, b) => a.degradation_rank - b.degradation_rank) : []),
    [result],
  );

  const filteredPoints = useMemo(() => {
    if (!result) return [];
    const pts = [...result.points].sort(
      (a, b) => a.degradation_rank - b.degradation_rank || a.point_id.localeCompare(b.point_id),
    );
    if (pointFilter === 'all') return pts;
    if (pointFilter === 'flags') return pts.filter(hasFlags);
    return pts.filter((p) => p.point_type === pointFilter);
  }, [result, pointFilter]);

  // 0) Sin corridas todavía --------------------------------------------------
  if (eras.length === 0) {
    return (
      <Card>
        <SectionTitle>Resultados</SectionTitle>
        <p className="text-sm text-moss">
          Todavía no hay corridas — subí un KML y ejecutá la estratificación.
        </p>
      </Card>
    );
  }

  // 1) Tabs de era ------------------------------------------------------------
  const eraTabs = (
    <div className="flex flex-wrap gap-2">
      {eras.map((era) => (
        <button
          key={era}
          type="button"
          onClick={() => onActiveEraChange(era)}
          className={`rounded-pill px-4 py-1.5 text-sm font-medium transition-colors ${
            era === activeEra
              ? 'bg-forest text-limeSoft'
              : 'bg-forest/5 text-forest hover:bg-forest/10'
          }`}
        >
          {ERA_LABEL[era]}
        </button>
      ))}
    </div>
  );

  if (!result) {
    return (
      <Card>
        <SectionTitle>Resultados</SectionTitle>
        {eraTabs}
        <p className="mt-4 text-sm text-moss">
          No hay resultados para {ERA_LABEL[activeEra]} todavía.
        </p>
      </Card>
    );
  }

  const { run, design } = result;
  const hasDi = sortedStrata.some((s) => s.di_min !== undefined && s.di_max !== undefined);
  const totalArea = sortedStrata.reduce((acc, s) => acc + s.area_ha, 0);
  const totalN = sortedStrata.reduce((acc, s) => acc + s.n_neyman, 0);
  const targetLabel = [...design.target_strata]
    .sort((a, b) => a - b)
    .map((r) => `E${r}`)
    .join(', ');

  // 6) Exports ----------------------------------------------------------------
  const handleAsyncExport = async (kind: 'zip' | 'kmz') => {
    setExportError(null);
    setBusyExport(kind);
    try {
      if (kind === 'zip') {
        const blob = await buildExportBundle(result);
        downloadBlob(blob, `${aoiSlug(result)}_${run.era}_export.zip`);
      } else {
        const blob = await buildKmz(result);
        downloadBlob(blob, `${aoiSlug(result)}_${run.era}.kmz`);
      }
    } catch (err) {
      setExportError(errorMessage(err));
    } finally {
      setBusyExport(null);
    }
  };

  const handleSyncExport = (fn: () => void) => {
    setExportError(null);
    try {
      fn();
    } catch (err) {
      setExportError(errorMessage(err));
    }
  };

  return (
    <Card>
      <SectionTitle>Resultados</SectionTitle>
      {eraTabs}

      <div className="mt-5 space-y-6">
        {/* 2) Resumen de corrida ------------------------------------------- */}
        <div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <MonoStatChip label="Corrida" value={truncateId(run.id)} title={run.id} />
            <StatChip
              label="Estado"
              value={run.status === 'done' ? 'done ✓' : run.status}
            />
            <StatChip
              label="Método"
              value={design.method === 'neyman' ? 'Neyman' : 'Proporcional'}
            />
            <StatChip label="Puntos totales" value={design.total_points.toLocaleString('es-AR')} />
            <StatChip
              label="HalfCI objetivo"
              value={`${design.halfci_target_pct.toLocaleString('es-AR')}%`}
            />
            <StatChip
              label="Primarios activos"
              value={activePrimaries(result.points).length.toLocaleString('es-AR')}
            />
            <MonoStatChip label="Salida" value={run.gcs_prefix ?? '—'} title={run.gcs_prefix} />
          </div>
          <div className="mt-2">
            <Badge tone="grey">estratos objetivo: {targetLabel}</Badge>
          </div>
        </div>

        {/* 3) Tabla de estratos --------------------------------------------- */}
        <div>
          <SectionTitle right={<Badge tone="grey">{ERA_LABEL[activeEra]}</Badge>}>
            Estratos
          </SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="text-[11px] uppercase text-brandGrey">
                <tr className="border-b border-forest/10">
                  <th className={TH_CLS}>Estrato</th>
                  <th className={TH_NUM_CLS}>Área (ha)</th>
                  <th className={TH_NUM_CLS}>%</th>
                  <th className={TH_NUM_CLS}>NDVI medio</th>
                  <th className={TH_NUM_CLS}>SOC medio</th>
                  {hasDi && <th className={TH_NUM_CLS}>DI (min–max)</th>}
                  <th className={TH_NUM_CLS}>n (Neyman)</th>
                  <th className={TH_NUM_CLS}>HalfCI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest/5">
                {sortedStrata.map((s) => (
                  <tr key={s.id}>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-3 w-3 shrink-0 rounded-[3px]"
                          style={{ backgroundColor: s.color_hex }}
                        />
                        <span className="font-bold">{s.name}</span>
                      </div>
                      <span className="block pl-5 text-xs text-brandGrey">
                        id crudo {s.stratum_id}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">{fmt(s.area_ha, 1)}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{fmt(s.pct, 1)}%</td>
                    <td className="px-3 py-2 text-right tabular-nums">{fmt(s.mean_ndvi, 3)}</td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {fmt(s.mean_soc, 1)} tC/ha
                    </td>
                    {hasDi && (
                      <td className="px-3 py-2 text-right tabular-nums">
                        {s.di_min !== undefined && s.di_max !== undefined
                          ? `${fmt(s.di_min, 3)}–${fmt(s.di_max, 3)}`
                          : '—'}
                      </td>
                    )}
                    <td className="px-3 py-2 text-right font-bold tabular-nums">
                      {s.n_neyman > 0 ? s.n_neyman.toLocaleString('es-AR') : '—'}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {s.halfci_pct === undefined ? (
                        '—'
                      ) : s.halfci_pct <= design.halfci_target_pct ? (
                        <Badge tone="lime">{fmt(s.halfci_pct, 1)}% ✓</Badge>
                      ) : (
                        <Badge tone="yellow">{fmt(s.halfci_pct, 1)}%</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-forest/10 font-bold">
                  <td className="px-3 py-2">Total</td>
                  <td className="px-3 py-2 text-right tabular-nums">{fmt(totalArea, 1)}</td>
                  <td className="px-3 py-2 text-right tabular-nums">100%</td>
                  <td className="px-3 py-2 text-right">—</td>
                  <td className="px-3 py-2 text-right">—</td>
                  {hasDi && <td className="px-3 py-2 text-right">—</td>}
                  <td className="px-3 py-2 text-right tabular-nums">
                    {totalN.toLocaleString('es-AR')}
                  </td>
                  <td className="px-3 py-2 text-right">—</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* 4) Evidencia DI (solo Era 2) ------------------------------------- */}
        {activeEra === 'era2_di' && result.di_thresholds && result.di_thresholds.length > 0 && (
          <div>
            <SectionTitle>Umbrales DI (evidencia VVB)</SectionTitle>
            <div className="overflow-x-auto">
              <table className="w-full max-w-[520px] text-sm">
                <thead className="text-[11px] uppercase text-brandGrey">
                  <tr className="border-b border-forest/10">
                    <th className={TH_CLS}>Estrato</th>
                    <th className={TH_CLS}>Etiqueta</th>
                    <th className={TH_NUM_CLS}>Rango DI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest/5">
                  {[...result.di_thresholds]
                    .sort((a, b) => a.degradation_rank - b.degradation_rank)
                    .map((t) => (
                      <tr key={t.degradation_rank}>
                        <td className="px-3 py-1.5">
                          <RankChip rank={t.degradation_rank} />
                        </td>
                        <td className="px-3 py-1.5">{t.label}</td>
                        <td className="px-3 py-1.5 text-right tabular-nums">
                          {fmt(t.di_min, 3)}–{fmt(t.di_max, 3)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeEra === 'era2_di' && result.qu_matrix && result.qu_matrix.length > 0 && (
          <div>
            <SectionTitle>Matriz QU × Estrato</SectionTitle>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="text-[11px] uppercase">
                  <tr className="border-b border-forest/10">
                    <th className={`${TH_CLS} text-brandGrey`}>Unidad</th>
                    <th className={`${TH_NUM_CLS} text-brandGrey`}>Área (ha)</th>
                    {ALL_RANKS.map((r) => (
                      <th
                        key={r}
                        className={`${TH_NUM_CLS} ${
                          LIGHT_RANKS.includes(r) ? 'text-forest' : 'text-white'
                        }`}
                        style={{ backgroundColor: rankColor(r) }}
                      >
                        E{r}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest/5">
                  {result.qu_matrix.map((row) => (
                    <tr key={row.unit_name}>
                      <td className="px-3 py-1.5 font-medium">{row.unit_name}</td>
                      <td className="px-3 py-1.5 text-right tabular-nums">
                        {fmt(row.area_ha, 1)}
                      </td>
                      {ALL_RANKS.map((r) => (
                        <td key={r} className="px-3 py-1.5 text-right tabular-nums">
                          {fmt(row.pct_by_rank[r], 1)}%
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5) Puntos de muestreo -------------------------------------------- */}
        <div>
          <SectionTitle
            right={
              <div className="flex flex-wrap justify-end gap-1.5">
                {POINT_FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setPointFilter(f.id)}
                    className={`rounded-pill px-3 py-1 text-xs font-medium transition-colors ${
                      pointFilter === f.id
                        ? 'bg-forest text-limeSoft'
                        : 'bg-forest/5 text-forest hover:bg-forest/10'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            }
          >
            Puntos de diseño de muestreo
          </SectionTitle>
          <p className="mb-2 text-xs text-brandGrey">
            {filteredPoints.length.toLocaleString('es-AR')} de{' '}
            {result.points.length.toLocaleString('es-AR')} puntos
          </p>
          <div className="custom-scrollbar max-h-[420px] overflow-x-auto overflow-y-auto rounded-cardSm border border-forest/10">
            <table className="w-full min-w-[980px] text-sm">
              <thead className="text-[11px] uppercase text-brandGrey">
                <tr>
                  <th className={`${TH_CLS} ${TH_STICKY}`}>Punto</th>
                  <th className={`${TH_CLS} ${TH_STICKY}`}>Tipo</th>
                  <th className={`${TH_CLS} ${TH_STICKY}`}>Estrato</th>
                  <th className={`${TH_NUM_CLS} ${TH_STICKY}`}>Lat</th>
                  <th className={`${TH_NUM_CLS} ${TH_STICKY}`}>Lon</th>
                  <th className={`${TH_NUM_CLS} ${TH_STICKY}`}>Elev. (m)</th>
                  <th className={`${TH_NUM_CLS} ${TH_STICKY}`}>SOC (tC/ha)</th>
                  <th className={`${TH_NUM_CLS} ${TH_STICKY}`}>NDVI</th>
                  <th className={`${TH_CLS} ${TH_STICKY}`}>QA</th>
                  <th className={`${TH_CLS} ${TH_STICKY}`}>Flags</th>
                  <th className={`${TH_NUM_CLS} ${TH_STICKY}`}>Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest/5">
                {filteredPoints.length === 0 && (
                  <tr>
                    <td colSpan={11} className="px-3 py-6 text-center text-sm text-moss">
                      Sin puntos para este filtro.
                    </td>
                  </tr>
                )}
                {filteredPoints.map((p) => {
                  const selected = selectedPointId === p.point_id;
                  const busy = replaceBusyPointId === p.point_id;
                  return (
                    <tr
                      key={p.id}
                      onClick={() => onSelectPoint(selected ? null : p.point_id)}
                      className={`cursor-pointer transition-colors ${
                        selected ? 'bg-limeSoft/40' : 'hover:bg-cream'
                      }`}
                    >
                      <td className="px-3 py-1.5 font-mono text-xs font-bold">{p.point_id}</td>
                      <td className="px-3 py-1.5">
                        <Badge tone={TYPE_BADGE_TONE[p.point_type]}>
                          {POINT_TYPE_LABEL[p.point_type]}
                        </Badge>
                      </td>
                      <td className="px-3 py-1.5">
                        <RankChip rank={p.degradation_rank} />
                      </td>
                      <td className="px-3 py-1.5 text-right font-mono text-xs">
                        {p.lat.toFixed(5)}
                      </td>
                      <td className="px-3 py-1.5 text-right font-mono text-xs">
                        {p.lon.toFixed(5)}
                      </td>
                      <td className="px-3 py-1.5 text-right tabular-nums">
                        {p.elevation !== undefined ? fmt(p.elevation, 0) : '—'}
                      </td>
                      <td className="px-3 py-1.5 text-right tabular-nums">
                        {p.soc_pred_tc_ha !== undefined ? fmt(p.soc_pred_tc_ha, 1) : '—'}
                      </td>
                      <td className="px-3 py-1.5 text-right tabular-nums">
                        {p.ndvi !== undefined ? fmt(p.ndvi, 3) : '—'}
                      </td>
                      <td className="px-3 py-1.5">
                        <Badge tone={QA_BADGE[p.qa_status].tone}>
                          {QA_BADGE[p.qa_status].label}
                        </Badge>
                      </td>
                      <td className="px-3 py-1.5">
                        <div className="flex items-center gap-1.5">
                          {p.flags.near_aoi_boundary && (
                            <span
                              title="Cerca del límite del AOI"
                              className="cursor-help text-sm leading-none text-customRed"
                            >
                              ⚑
                            </span>
                          )}
                          {p.flags.near_strata_boundary && (
                            <span
                              title="Cerca de borde de estrato"
                              className="cursor-help text-sm leading-none text-customRed"
                            >
                              ⚑
                            </span>
                          )}
                          {p.flags.on_road && (
                            <span
                              title="Sobre camino"
                              className="cursor-help text-sm leading-none text-customRed"
                            >
                              ⚑
                            </span>
                          )}
                          {p.replaces_point_id && (
                            <Badge tone="blue">reemplaza a {p.replaces_point_id}</Badge>
                          )}
                        </div>
                      </td>
                      <td
                        className="px-3 py-1.5 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {p.point_type === 'primary' && p.qa_status !== 'replaced' && (
                          <Button
                            variant="outline"
                            className="!px-2.5 !py-1 !text-xs"
                            disabled={busy}
                            onClick={() => onReplacePoint(activeEra, p.point_id)}
                          >
                            {busy ? '…' : 'Reemplazar'}
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 6) Exports -------------------------------------------------------- */}
        <div>
          <SectionTitle>Exports</SectionTitle>
          <p className="-mt-2 mb-3 text-xs text-moss">
            Nomenclatura ENTE — listos para campo y para la VVB
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              disabled={busyExport === 'zip'}
              onClick={() => void handleAsyncExport('zip')}
            >
              {busyExport === 'zip' ? 'Generando…' : 'Bundle ZIP completo'}
            </Button>
            <Button
              variant="outline"
              disabled={busyExport === 'kmz'}
              onClick={() => void handleAsyncExport('kmz')}
            >
              {busyExport === 'kmz' ? 'Generando…' : 'KMZ (Google Earth / GuruMaps)'}
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                handleSyncExport(() =>
                  downloadText(toStrataGeoJSON(result), '00_Estratos.geojson', 'application/geo+json'),
                )
              }
            >
              00_Estratos.geojson
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                handleSyncExport(() =>
                  downloadText(toPointsGeoJSON(result), '00_Puntos.geojson', 'application/geo+json'),
                )
              }
            >
              00_Puntos.geojson
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                handleSyncExport(() =>
                  downloadText(toStatsCsv(result), '00_Estratos_Stats.csv', 'text/csv'),
                )
              }
            >
              00_Estratos_Stats.csv
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                handleSyncExport(() => downloadText(toPointsCsv(result), '00_Puntos.csv', 'text/csv'))
              }
            >
              00_Puntos.csv
            </Button>
          </div>
          {exportError && <p className="mt-2 text-xs text-customRed">{exportError}</p>}
        </div>
      </div>
    </Card>
  );
}
