'use client';

/**
 * Card genérica de módulo MRV para el dashboard de ForestTrack (Land_MRV).
 * Look ForestBlock/ForestScan: card blanca rounded-card, acento circular de
 * color, code en mono, StatChips y CTA pill. Hover: sombra + lift sutil.
 */

import Link from 'next/link';
import { Badge, Button, Card, StatChip } from '@/components/common/ui';

export interface ModuleCardStat {
  label: string;
  value: string;
}

export interface ModuleCardProps {
  title: string;
  code: string;
  description: string;
  href?: string;
  badge?: { label: string; tone: 'lime' | 'grey' };
  stats: ModuleCardStat[];
  disabled?: boolean;
  /** Clase de fondo del círculo de acento (default 'bg-limeBright'). */
  accentClass?: string;
}

export default function ModuleCard({
  title,
  code,
  description,
  href,
  badge,
  stats,
  disabled = false,
  accentClass = 'bg-limeBright',
}: ModuleCardProps) {
  const actionable = Boolean(href) && !disabled;

  return (
    <Card className="flex h-full flex-col gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-cardHover">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className={`h-10 w-10 shrink-0 rounded-pill border border-forest/10 ${accentClass}`}
          />
          <div className="leading-tight">
            <h3 className="text-lg font-bold tracking-tight">{title}</h3>
            <span className="font-mono text-[11px] text-brandGrey">{code}</span>
          </div>
        </div>
        {badge && <Badge tone={badge.tone}>{badge.label}</Badge>}
      </div>

      <p className="text-sm leading-relaxed text-moss">{description}</p>

      <div className="grid grid-cols-3 gap-2">
        {stats.map((stat) => (
          <StatChip key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </div>

      <div className="mt-auto pt-1">
        {actionable && href ? (
          <Link href={href} className="inline-flex">
            <Button variant="primary">Abrir módulo</Button>
          </Link>
        ) : (
          <Button variant="outline" disabled>
            Próximamente
          </Button>
        )}
      </div>
    </Card>
  );
}
