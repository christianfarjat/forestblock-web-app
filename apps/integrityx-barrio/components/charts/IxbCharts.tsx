'use client';

/**
 * Charts del módulo — Recharts con marca única de datos (#2F7D46, validada
 * contra superficie clara). La identidad va en ejes y etiquetas directas, no
 * en el color; grillas recesivas; tooltips en card blanca.
 */
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { fmtKgCO2e, mesLabel } from '@/lib/ixb_format';

export const DATA_HUE = '#2F7D46';
const GRID = '#ECECE6';
const INK = '#182D1F';
const MUTED = '#76756E';

function TooltipCard({
  active,
  payload,
  label,
  labelFormatter,
}: {
  active?: boolean;
  payload?: { value?: number | string }[];
  label?: string;
  labelFormatter?: (l: string) => string;
}) {
  if (!active || !payload?.length) return null;
  const v = payload[0]?.value;
  return (
    <div className="rounded-cardSm border border-borderGray bg-white px-3 py-2 text-xs shadow-card">
      <div className="font-medium text-forest">{labelFormatter && label ? labelFormatter(label) : label}</div>
      <div className="mt-0.5 text-brandGrey">{typeof v === 'number' ? fmtKgCO2e(v) : v}</div>
    </div>
  );
}

/** Serie mensual de huella (kg CO₂e) — barras verticales, un solo tono. */
export function SerieMensualChart({ data }: { data: { periodo: string; kg: number }[] }) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={GRID} />
          <XAxis
            dataKey="periodo"
            tickFormatter={mesLabel}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: MUTED }}
          />
          <YAxis
            tickFormatter={(v: number) => (v >= 1000 ? `${(v / 1000).toFixed(1)} t` : `${v} kg`)}
            tickLine={false}
            axisLine={false}
            width={52}
            tick={{ fontSize: 11, fill: MUTED }}
          />
          <Tooltip content={<TooltipCard labelFormatter={mesLabel} />} cursor={{ fill: '#F4F7EE' }} />
          <Bar dataKey="kg" fill={DATA_HUE} radius={[4, 4, 0, 0]} maxBarSize={34} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Composición por categoría / variable — barras horizontales con etiqueta directa. */
export function ComposicionChart({
  data,
  height = 220,
}: {
  data: { nombre: string; kg: number }[];
  height?: number;
}) {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 64, left: 8, bottom: 4 }}
        >
          <CartesianGrid horizontal={false} stroke={GRID} />
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="nombre"
            width={168}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: INK }}
          />
          <Tooltip content={<TooltipCard />} cursor={{ fill: '#F4F7EE' }} />
          <Bar dataKey="kg" fill={DATA_HUE} radius={[0, 4, 4, 0]} maxBarSize={18}>
            <LabelList
              dataKey="kg"
              position="right"
              formatter={(v: number) => fmtKgCO2e(v)}
              style={{ fontSize: 11, fill: MUTED }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
