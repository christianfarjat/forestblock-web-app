'use client';

/**
 * Dashboard de ForestTrack (Land_MRV) — spec MJM-FB-MRV-IT-001-V0.
 * Hero + grid de módulos MRV: Land_Stratify (activo, Beta), Land_Monitor y
 * Land_Report (próximamente).
 */

import { Badge, DemoBanner, TopBar } from '@/components/common/ui';
import LandStratifyCard from '@/components/mrv/LandStratifyCard';
import ModuleCard from '@/components/mrv/ModuleCard';
import { isDemoMode } from '@/lib/strat_api';

export default function LandMrvDashboardPage() {
  return (
    <>
      <TopBar />
      <main className="mx-auto max-w-[1180px] px-5 pb-14 pt-8">
        <section className="mb-6 flex flex-col items-start gap-3">
          <Badge tone="lime">ForestTrack · Land_MRV</Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Monitoreo, Reporte y Verificación
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-moss">
            Ciclo MRV completo para proyectos de carbono en tierras: línea base T0 con
            estratificación y diseño de muestreo, re-muestreo en cada período de monitoreo (MLP) y
            evidencia auditable para la VVB bajo Verra VM0042.
          </p>
        </section>

        {isDemoMode && (
          <div className="mb-6">
            <DemoBanner visible={isDemoMode} />
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          <LandStratifyCard />

          <ModuleCard
            title="Land_Monitor"
            code="mlp_"
            description="Re-muestreo y monitoreo MLP: seguimiento de los puntos T0 en cada período de monitoreo, control de cambios de estrato y actualización del diseño de muestreo."
            badge={{ label: 'Próximamente', tone: 'grey' }}
            disabled
            accentClass="bg-mintGreen"
            stats={[
              { label: 'Ciclo', value: 'MLP · períodos' },
              { label: 'Input', value: 'Diseño T0' },
              { label: 'Salida', value: 'Δ estratos / SOC' },
            ]}
          />

          <ModuleCard
            title="Land_Report"
            code="vvb_"
            description="Evidencia y reportes para la VVB: consolida corridas, umbrales DI, QA de puntos y exports auditables para la verificación del proyecto."
            badge={{ label: 'Próximamente', tone: 'grey' }}
            disabled
            accentClass="bg-borderGray"
            stats={[
              { label: 'Evidencia', value: 'DI + QA puntos' },
              { label: 'Formato', value: 'PDF / GeoJSON' },
              { label: 'Estándar', value: 'Verra VM0042' },
            ]}
          />
        </div>

        <footer className="mt-10 border-t border-forest/10 pt-4 text-xs text-brandGrey">
          ForestBlock Suite · ForestScan / ForestTrack — Spec MJM-FB-MRV-IT-001-V0 · Beta Phase 1
        </footer>
      </main>
    </>
  );
}
