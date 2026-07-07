'use client';

/**
 * Primitivas UI compartidas de Land_MRV — lenguaje visual ForestBlock/ForestScan:
 * crema #FCFFF6, verde bosque #182D1F, limas #BFF179/#DAFAA1, Aeonik,
 * radios card 28/18 y pills.
 */

import Link from 'next/link';
import type { ReactNode } from 'react';

export function TopBar({ subtitle }: { subtitle?: string }) {
  return (
    <header className="sticky top-0 z-[1200] border-b border-forest/10 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-5 py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-pill bg-forest text-sm font-bold text-limeBright">
            FB
          </span>
          <span className="leading-tight">
            <span className="block text-[15px] font-medium tracking-tight">
              ForestBlock · <span className="font-bold">ForestTrack</span>
            </span>
            <span className="block text-xs text-brandGrey">
              {subtitle ?? 'Land_MRV — Monitoreo, Reporte y Verificación'}
            </span>
          </span>
        </Link>
        <nav className="flex items-center gap-2">
          <Badge tone="lime">Land_MRV</Badge>
          <Badge tone="grey">Beta · Phase 1</Badge>
        </nav>
      </div>
    </header>
  );
}

export type BadgeTone = 'lime' | 'forest' | 'grey' | 'red' | 'yellow' | 'blue';

const BADGE_TONES: Record<BadgeTone, string> = {
  lime: 'bg-limeSoft text-forest',
  forest: 'bg-forest text-limeSoft',
  grey: 'bg-forest/5 text-moss border border-forest/10',
  red: 'bg-customRed/10 text-customRed',
  yellow: 'bg-customYellow/40 text-forest',
  blue: 'bg-[#0518F5]/10 text-[#0518F5]',
};

export function Badge({ children, tone = 'grey' }: { children: ReactNode; tone?: BadgeTone }) {
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-pill px-2.5 py-0.5 text-[11px] font-medium ${BADGE_TONES[tone]}`}
    >
      {children}
    </span>
  );
}

export type ButtonVariant = 'primary' | 'ghost' | 'onforest' | 'outline';

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-forest text-limeSoft hover:shadow-cardHover disabled:opacity-40 disabled:hover:shadow-none',
  onforest: 'bg-limeBright text-forest hover:shadow-cardHover disabled:opacity-40',
  ghost: 'bg-transparent text-forest hover:bg-forest/5 disabled:opacity-40',
  outline:
    'bg-transparent text-forest border border-forest/20 hover:bg-forest/5 disabled:opacity-40',
};

export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled,
  type = 'button',
  className = '',
  title,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  type?: 'button' | 'submit';
  className?: string;
  title?: string;
}) {
  return (
    <button
      type={type}
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-pill px-4 py-2 text-sm font-medium transition-all ${BUTTON_VARIANTS[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Card({
  children,
  className = '',
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <section
      className={`rounded-card border border-forest/10 bg-white shadow-card ${padded ? 'p-5' : ''} ${className}`}
    >
      {children}
    </section>
  );
}

export function SectionTitle({
  children,
  right,
  className = '',
}: {
  children: ReactNode;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-3 flex items-center justify-between gap-3 ${className}`}>
      <h2 className="text-[15px] font-bold tracking-tight">{children}</h2>
      {right}
    </div>
  );
}

export function ProgressBar({ pct, label }: { pct: number; label?: string }) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div>
      {label && (
        <div className="mb-1 flex items-center justify-between text-xs text-moss">
          <span className="truncate">{label}</span>
          <span className="ml-2 font-medium text-forest">{Math.round(clamped)}%</span>
        </div>
      )}
      <div className="h-2 overflow-hidden rounded-pill bg-forest/10">
        <div
          className="h-full rounded-pill bg-limeBright transition-all duration-300"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

export function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-cardSm border border-forest/10 bg-cream px-3 py-2">
      <div className="text-[11px] uppercase tracking-wide text-brandGrey">{label}</div>
      <div className="text-sm font-bold">{value}</div>
    </div>
  );
}

export function DemoBanner({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <div className="rounded-cardSm border border-customYellow bg-customYellow/25 px-4 py-2.5 text-xs text-forest">
      <strong>Modo demo:</strong> no hay backend configurado (
      <code className="font-mono">NEXT_PUBLIC_STRATIFY_API_URL</code>). La estratificación corre
      con un engine simulado client-side — el flujo, el modelo de datos y los exports son los
      reales; los valores espectrales no. Al conectar el backend FastAPI (motor GEE de
      Land_Screening) la UI usa los mismos contratos.
    </div>
  );
}
