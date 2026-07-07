'use client';

/**
 * Land_Stratify_Designer — panel de diseño de la estratificación (spec
 * MJM-FB-MRV-IT-001-V0 §2.5): ingesta KML/KMZ del AOI, selección de era
 * (Era 1 K-Means / Era 2 DI / ambas), parámetros CFG y disparo de la corrida.
 *
 * Los estratos objetivo se eligen por `degradation_rank` canónico (E1 = más
 * degradado = rojo … E5 = mejor = verde oscuro), nunca por stratum_id crudo.
 */

import { useMemo, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent, ReactNode } from 'react';

import { Badge, Button, Card, ProgressBar, SectionTitle, StatChip } from '@/components/common/ui';
import { createAoiFromKml } from '@/lib/strat_api';
import { CFG, defaultParams, ERA_DESCRIPTION, ERA_LABEL } from '@/lib/strat_config';
import { buildDemoAoi } from '@/lib/strat_demo_aoi';
import type { GeometryValidation } from '@/lib/strat_kml';
import { rankColor, stratumName } from '@/lib/strat_palette';
import type { AoiType, DegradationRank, Era, StratAOI, StratParams } from '@/lib/strat_types';

export interface DesignerProps {
  aoi: StratAOI | null;
  validation: GeometryValidation | null;
  running: boolean;
  progress: { era: Era; pct: number; detail: string } | null;
  error: string | null;
  onAoiChange: (aoi: StratAOI | null, validation: GeometryValidation | null) => void;
  onRun: (eras: Era[], params: StratParams) => void;
}

type EraChoice = Era | 'both';

const INPUT_CLS =
  'rounded-cardSm border border-forest/15 bg-cream px-3 py-2 text-sm focus:outline-forest';

const ALL_RANKS: DegradationRank[] = [1, 2, 3, 4, 5];

/** Ranks con color de fondo claro (amarillo / verde claro) → texto forest. */
const LIGHT_RANKS: DegradationRank[] = [3, 4];

const AOI_TYPE_LABEL: Record<AoiType, string> = { field: 'Campo', qu: 'QU' };

function parseNum(value: string, fallback: number): number {
  if (value.trim() === '') return fallback;
  const n = Number(value.replace(',', '.'));
  return Number.isFinite(n) ? n : fallback;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function NumberField({
  label,
  value,
  onChange,
  suffix,
  min,
  max,
  step,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-moss">{label}</span>
      <span className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(e.target.value)}
          className={`${INPUT_CLS} w-full`}
        />
        {suffix && <span className="shrink-0 text-xs text-brandGrey">{suffix}</span>}
      </span>
    </label>
  );
}

function PillOption({
  active,
  onClick,
  children,
  title,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-pill px-3.5 py-1.5 text-xs font-medium transition-all ${
        active
          ? 'bg-forest text-limeSoft'
          : 'border border-forest/20 bg-transparent text-forest hover:bg-forest/5'
      }`}
    >
      {children}
    </button>
  );
}

export default function Land_Stratify_Designer(props: DesignerProps): JSX.Element {
  const { aoi, validation, running, progress, error, onAoiChange, onRun } = props;

  // --- Ingesta KML -----------------------------------------------------------
  const [aoiType, setAoiType] = useState<AoiType>('field');
  const [aoiName, setAoiName] = useState('');
  const [loadingKml, setLoadingKml] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Era + parámetros ------------------------------------------------------
  const initial = useMemo(() => defaultParams(), []);
  const [eraChoice, setEraChoice] = useState<EraChoice>('both');
  const [nClasses, setNClasses] = useState(String(initial.n_classes));
  const [targetRanks, setTargetRanks] = useState<DegradationRank[]>([...initial.target_ranks]);
  const [halfciTarget, setHalfciTarget] = useState(String(initial.halfci_target_pct));
  const [spacingM, setSpacingM] = useState(String(initial.spacing_m));
  const [minDistanceM, setMinDistanceM] = useState(String(initial.min_distance_m));
  const [diOpen, setDiOpen] = useState(false);

  const eras: Era[] = useMemo(
    () => (eraChoice === 'both' ? ['era1_kmeans', 'era2_di'] : [eraChoice]),
    [eraChoice],
  );

  async function handleFile(file: File) {
    setLocalError(null);
    setLoadingKml(true);
    try {
      const res = await createAoiFromKml(file, aoiType, aoiName.trim() || undefined);
      onAoiChange(res.aoi, res.validation);
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : 'No se pudo procesar el archivo KML.');
    } finally {
      setLoadingKml(false);
    }
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
    e.target.value = '';
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  }

  function useDemoAoi() {
    setLocalError(null);
    onAoiChange(buildDemoAoi(), { ok: true, errors: [], warnings: [] });
  }

  function toggleRank(rank: DegradationRank) {
    setTargetRanks((prev) =>
      prev.includes(rank) ? prev.filter((r) => r !== rank) : [...prev, rank],
    );
  }

  function handleRun() {
    if (!aoi || running || targetRanks.length === 0) return;
    const params: StratParams = {
      // Dominio canónico degradation_rank = 1..5 ⇒ máximo 5 clases.
      n_classes: clamp(Math.round(parseNum(nClasses, CFG.n_classes)), 3, 5),
      target_ranks: [...targetRanks].sort((a, b) => a - b),
      halfci_target_pct: clamp(parseNum(halfciTarget, CFG.halfci_target_pct), 1, 50),
      spacing_m: clamp(parseNum(spacingM, CFG.spacing_m), 10, 5000),
      min_distance_m: clamp(parseNum(minDistanceM, CFG.min_distance_m), 1, 5000),
      ...(eras.includes('era2_di') ? { di_weights: { ...CFG.di.weights } } : {}),
    };
    onRun(eras, params);
  }

  const validationErrors = validation?.errors ?? [];
  const validationWarnings = validation?.warnings ?? [];

  return (
    <Card>
      <SectionTitle right={<Badge tone="grey">strat_</Badge>}>
        Diseño de estratificación
      </SectionTitle>

      <div className="divide-y divide-forest/10">
        {/* 1 · Ingesta KML */}
        <div className="space-y-3 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-moss">Tipo de AOI</span>
            <PillOption active={aoiType === 'field'} onClick={() => setAoiType('field')}>
              Campo
            </PillOption>
            <PillOption active={aoiType === 'qu'} onClick={() => setAoiType('qu')}>
              QU
            </PillOption>
          </div>

          <input
            type="text"
            value={aoiName}
            onChange={(e) => setAoiName(e.target.value)}
            placeholder="Nombre del AOI (opcional)"
            className={`${INPUT_CLS} w-full`}
          />

          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-cardSm border-2 border-dashed px-4 py-6 text-center transition-colors ${
              dragOver ? 'border-limeBright bg-limeSoft/30' : 'border-forest/15 bg-cream'
            }`}
          >
            {loadingKml ? (
              <span className="text-sm font-medium text-moss">Cargando KML…</span>
            ) : (
              <>
                <span className="text-sm font-medium text-forest">
                  Arrastrá el KML/KMZ del AOI acá
                </span>
                <span className="text-xs text-brandGrey">
                  o hacé clic para elegir un archivo (.kml / .kmz) — 1 perímetro + N potreros
                </span>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".kml,.kmz"
              className="hidden"
              onChange={handleInputChange}
            />
          </div>

          <Button variant="outline" className="w-full" onClick={useDemoAoi} disabled={loadingKml}>
            Usar AOI de ejemplo (QU · estepa patagónica)
          </Button>

          {localError && (
            <p className="flex items-start gap-1.5 text-xs text-customRed">
              <span aria-hidden>⚠</span>
              <span>{localError}</span>
            </p>
          )}
          {validationErrors.map((msg, i) => (
            <p key={`err-${i}`} className="flex items-start gap-1.5 text-xs text-customRed">
              <span aria-hidden>⚠</span>
              <span>{msg}</span>
            </p>
          ))}
          {validationWarnings.map((msg, i) => (
            <p
              key={`warn-${i}`}
              className="flex items-start gap-1.5 rounded-cardSm border border-customYellow bg-customYellow/25 px-3 py-1.5 text-xs text-forest"
            >
              <span aria-hidden>⚠</span>
              <span>{msg}</span>
            </p>
          ))}
        </div>

        {/* 2 · Resumen del AOI */}
        {aoi && (
          <div className="space-y-3 py-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-moss">AOI cargado</span>
              <Button variant="ghost" className="!px-3 !py-1 !text-xs" onClick={() => onAoiChange(null, null)}>
                Quitar AOI
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <StatChip label="Nombre" value={aoi.name} />
              <StatChip label="Tipo" value={AOI_TYPE_LABEL[aoi.aoi_type]} />
              <StatChip
                label="Área"
                value={`${aoi.area_ha.toLocaleString('es-AR', {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                })} ha`}
              />
              <StatChip
                label={aoi.aoi_type === 'qu' ? 'Campos miembros' : 'Potreros'}
                value={aoi.potreros.length.toLocaleString('es-AR')}
              />
              <StatChip label="Fuente KML" value={aoi.source_kml_uri ?? '—'} />
            </div>
          </div>
        )}

        {/* 3 · Era */}
        <div className="space-y-2 py-4">
          <span className="block text-xs font-medium text-moss">Era de estratificación</span>
          <div className="flex flex-wrap gap-2">
            <PillOption
              active={eraChoice === 'era1_kmeans'}
              onClick={() => setEraChoice('era1_kmeans')}
            >
              Era 1 · K-Means
            </PillOption>
            <PillOption active={eraChoice === 'era2_di'} onClick={() => setEraChoice('era2_di')}>
              Era 2 · DI
            </PillOption>
            <PillOption active={eraChoice === 'both'} onClick={() => setEraChoice('both')}>
              Ambas eras
            </PillOption>
          </div>
          <div className="space-y-1">
            {eras.map((era) => (
              <p key={era} className="text-xs text-brandGrey">
                <span className="font-medium text-forest">{ERA_LABEL[era]}:</span>{' '}
                {ERA_DESCRIPTION[era]}
              </p>
            ))}
          </div>
        </div>

        {/* 4 · Parámetros */}
        <div className="space-y-4 py-4">
          <span className="block text-xs font-medium text-moss">Parámetros (CFG)</span>

          <div className="grid grid-cols-2 gap-3">
            <NumberField
              label="Clases (n_classes)"
              value={nClasses}
              onChange={setNClasses}
              min={3}
              max={5}
              step={1}
            />
            <NumberField
              label="HalfCI objetivo"
              value={halfciTarget}
              onChange={setHalfciTarget}
              suffix="%"
              min={1}
              step={1}
            />
            <NumberField
              label="Espaciado"
              value={spacingM}
              onChange={setSpacingM}
              suffix="m"
              min={0}
              step={10}
            />
            <NumberField
              label="Distancia mínima"
              value={minDistanceM}
              onChange={setMinDistanceM}
              suffix="m"
              min={0}
              step={10}
            />
          </div>

          <div>
            <span className="mb-1.5 block text-xs font-medium text-moss">
              Estratos objetivo (por degradation_rank)
            </span>
            <div className="flex flex-wrap gap-2">
              {ALL_RANKS.map((rank) => {
                const selected = targetRanks.includes(rank);
                const color = rankColor(rank);
                const lightBg = LIGHT_RANKS.includes(rank);
                return (
                  <button
                    key={rank}
                    type="button"
                    role="checkbox"
                    aria-checked={selected}
                    title={stratumName(rank)}
                    onClick={() => toggleRank(rank)}
                    style={
                      selected
                        ? { backgroundColor: color, borderColor: color }
                        : { borderColor: color }
                    }
                    className={`flex items-center gap-1.5 rounded-pill border px-3 py-1.5 text-xs font-medium transition-all ${
                      selected
                        ? lightBg
                          ? 'text-forest'
                          : 'text-white'
                        : 'bg-white text-forest hover:bg-forest/5'
                    }`}
                  >
                    {!selected && (
                      <span
                        aria-hidden
                        className="h-2.5 w-2.5 rounded-pill"
                        style={{ backgroundColor: color }}
                      />
                    )}
                    <span>{selected ? '✓ ' : ''}E{rank}</span>
                  </button>
                );
              })}
            </div>
            {targetRanks.length === 0 && (
              <p className="mt-1.5 flex items-start gap-1.5 text-xs text-customRed">
                <span aria-hidden>⚠</span>
                <span>Seleccioná al menos un estrato objetivo.</span>
              </p>
            )}
          </div>

          <div className="rounded-cardSm border border-forest/10 bg-cream">
            <button
              type="button"
              aria-expanded={diOpen}
              onClick={() => setDiOpen((v) => !v)}
              className="flex w-full items-center justify-between px-3 py-2 text-xs font-medium text-forest"
            >
              <span>Pesos DI (Era 2)</span>
              <span aria-hidden className="text-brandGrey">
                {diOpen ? '▴' : '▾'}
              </span>
            </button>
            {diOpen && (
              <ul className="border-t border-forest/10 px-3 py-2">
                {Object.entries(CFG.di.weights).map(([key, weight]) => (
                  <li
                    key={key}
                    className="flex items-center justify-between py-0.5 text-xs text-moss"
                  >
                    <span className="font-mono">{key}</span>
                    <span className="font-medium text-forest">
                      {weight.toLocaleString('es-AR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* 5 · Ejecutar */}
        <div className="space-y-3 pt-4">
          <Button
            variant="primary"
            className="w-full"
            onClick={handleRun}
            disabled={!aoi || running || targetRanks.length === 0}
          >
            Ejecutar estratificación
          </Button>

          {running && progress && (
            <ProgressBar
              pct={progress.pct}
              label={`${ERA_LABEL[progress.era]} — ${progress.detail}`}
            />
          )}

          {error && (
            <div className="flex items-start gap-1.5 rounded-cardSm border border-customRed/30 bg-customRed/10 px-3 py-2 text-xs text-customRed">
              <span aria-hidden>⚠</span>
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
