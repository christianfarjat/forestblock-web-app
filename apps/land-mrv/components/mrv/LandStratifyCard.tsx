'use client';

/**
 * Card del módulo Land_Stratify (spec MJM-FB-MRV-IT-001-V0 §2.7):
 * Diseño de Muestreo / Estratificación T0. La numeración E1..E5 sigue al
 * degradation_rank canónico (1 = más degradado … 5 = mejor condición).
 */

import ModuleCard from '@/components/mrv/ModuleCard';

export default function LandStratifyCard() {
  return (
    <ModuleCard
      title="Land_Stratify"
      code="strat_"
      description="Diseño de Muestreo / Estratificación T0: clasifica el AOI en 5 estratos por degradación (E1 más degradado → E5 mejor condición) y asigna los puntos de muestreo con Neyman por estrato. Es la línea base MRV del proyecto bajo Verra VM0042."
      href="/stratify"
      badge={{ label: 'Beta', tone: 'lime' }}
      stats={[
        { label: 'Eras', value: '2 · K-Means / DI' },
        { label: 'Input', value: 'KML campo / QU' },
        { label: 'Salida', value: 'Estratos + Puntos' },
      ]}
    />
  );
}
