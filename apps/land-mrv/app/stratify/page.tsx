'use client';

/**
 * Land_Stratify — página del módulo (ForestTrack / Land_MRV).
 * Orquesta Designer → corrida(s) Era 1 / Era 2 → MapView + ResultsPanel.
 * Las corridas GEE son background jobs (§2.5); acá solo se dispara y se
 * muestra progreso.
 */

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useCallback, useRef, useState } from 'react';

import { Badge, Card, DemoBanner, TopBar } from '@/components/common/ui';
import Land_Stratify_Designer from '@/components/mrv/stratify/Land_Stratify_Designer';
import Land_Stratify_ResultsPanel from '@/components/mrv/stratify/Land_Stratify_ResultsPanel';
import { isDemoMode, replacePrimaryPoint, startStratRun } from '@/lib/strat_api';
import type { GeometryValidation } from '@/lib/strat_kml';
import type { Era, StratAOI, StratParams, StratRunResult } from '@/lib/strat_types';

const Land_Stratify_MapView = dynamic(
  () => import('@/components/mrv/stratify/Land_Stratify_MapView'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-sm text-moss">
        Cargando mapa…
      </div>
    ),
  },
);

export default function StratifyPage() {
  const [aoi, setAoi] = useState<StratAOI | null>(null);
  const [validation, setValidation] = useState<GeometryValidation | null>(null);
  const [results, setResults] = useState<Partial<Record<Era, StratRunResult>>>({});
  const [activeEra, setActiveEra] = useState<Era>('era1_kmeans');
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState<{ era: Era; pct: number; detail: string } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const [replaceBusyPointId, setReplaceBusyPointId] = useState<string | null>(null);
  /** Token de corrida: invalida resultados en vuelo si cambia el AOI o llega otra corrida. */
  const runSeqRef = useRef(0);

  const handleAoiChange = useCallback(
    (nextAoi: StratAOI | null, nextValidation: GeometryValidation | null) => {
      runSeqRef.current += 1;
      setAoi(nextAoi);
      setValidation(nextValidation);
      setResults({});
      setSelectedPointId(null);
      setError(null);
      setProgress(null);
      setRunning(false);
    },
    [],
  );

  const handleRun = useCallback(
    async (eras: Era[], params: StratParams) => {
      if (!aoi || eras.length === 0 || running) return;
      const token = ++runSeqRef.current;
      setRunning(true);
      setError(null);
      setSelectedPointId(null);
      setActiveEra(eras[0]);
      // Limpiar SOLO las eras que se van a correr: una corrida de Era 2 no
      // debe borrar el resultado previo de Era 1 del mismo AOI.
      setResults((prev) => {
        const copy = { ...prev };
        for (const era of eras) delete copy[era];
        return copy;
      });
      try {
        for (const era of eras) {
          setProgress({ era, pct: 0, detail: 'Encolando corrida…' });
          const result = await startStratRun(aoi, era, params, (pct, detail) => {
            if (runSeqRef.current === token) setProgress({ era, pct, detail });
          });
          if (runSeqRef.current !== token) return; // el AOI cambió durante la corrida
          // Update funcional: no pisa reemplazos hechos mientras corría la otra era.
          setResults((prev) => ({ ...prev, [era]: result }));
        }
      } catch (e) {
        if (runSeqRef.current === token) {
          setError(e instanceof Error ? e.message : 'La corrida terminó con error.');
        }
      } finally {
        if (runSeqRef.current === token) {
          setRunning(false);
          setProgress(null);
        }
      }
    },
    [aoi, running],
  );

  const handleReplacePoint = useCallback(
    async (era: Era, pointId: string) => {
      const result = results[era];
      if (!result || replaceBusyPointId) return;
      setReplaceBusyPointId(pointId);
      setError(null);
      try {
        const updated = await replacePrimaryPoint(result, pointId);
        setResults((prev) => ({ ...prev, [era]: updated }));
      } catch (e) {
        setError(e instanceof Error ? e.message : 'No se pudo reemplazar el punto.');
      } finally {
        setReplaceBusyPointId(null);
      }
    },
    [results, replaceBusyPointId],
  );

  return (
    <div className="min-h-screen">
      <TopBar subtitle="Land_Stratify — Diseño de Muestreo / Estratificación T0" />
      <main className="mx-auto max-w-[1400px] px-5 pb-16 pt-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link
              href="/"
              className="text-xs font-medium text-moss underline-offset-2 hover:underline"
            >
              ← Dashboard Land_MRV
            </Link>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">Land_Stratify</h1>
            <p className="text-sm text-brandGrey">
              Un KML de campo o QU → estratos (Era 1 · K-Means / Era 2 · DI) + puntos de diseño
              de muestreo Neyman para la línea base T0.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone="lime">Beta · Phase 1</Badge>
            <Badge tone="grey">VM0042</Badge>
          </div>
        </div>

        <DemoBanner visible={isDemoMode} />

        <div className="mt-5 grid items-start gap-5 lg:grid-cols-[400px,minmax(0,1fr)]">
          <Land_Stratify_Designer
            aoi={aoi}
            validation={validation}
            running={running}
            progress={progress}
            error={error}
            onAoiChange={handleAoiChange}
            onRun={handleRun}
          />
          <Card padded={false} className="relative h-[640px] overflow-hidden">
            <Land_Stratify_MapView
              aoi={aoi}
              results={results}
              activeEra={activeEra}
              selectedPointId={selectedPointId}
              onSelectPoint={setSelectedPointId}
            />
          </Card>
        </div>

        <div className="mt-5">
          <Land_Stratify_ResultsPanel
            results={results}
            activeEra={activeEra}
            onActiveEraChange={setActiveEra}
            selectedPointId={selectedPointId}
            onSelectPoint={setSelectedPointId}
            onReplacePoint={handleReplacePoint}
            replaceBusyPointId={replaceBusyPointId}
          />
        </div>
      </main>
    </div>
  );
}
