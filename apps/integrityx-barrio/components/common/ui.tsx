'use client';

/**
 * Primitivas UI IntegrityX Barrio — tokens ForestBlock (crema/verde bosque/
 * limas, radios 18/28, pills). Sin dependencias de componentes externas.
 */
import { ReactNode } from 'react';
import type { EstadoVerificacion } from '@/lib/ixb_types';
import { ESTADO_LABEL } from '@/lib/ixb_types';

export function cx(...cls: (string | false | null | undefined)[]): string {
  return cls.filter(Boolean).join(' ');
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cx('rounded-card bg-white shadow-card p-5 md:p-6', className)}>{children}</div>
  );
}

export function SectionTitle({
  children,
  right,
  sub,
}: {
  children: ReactNode;
  right?: ReactNode;
  sub?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
      <div>
        <h2 className="text-lg font-medium text-forest">{children}</h2>
        {sub ? <p className="mt-0.5 text-sm text-brandGrey">{sub}</p> : null}
      </div>
      {right}
    </div>
  );
}

type BotonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
};

export function Boton({ variant = 'primary', size = 'md', className, ...props }: BotonProps) {
  return (
    <button
      {...props}
      className={cx(
        'inline-flex items-center justify-center gap-1.5 rounded-pill font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40',
        size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-5 py-2.5 text-sm',
        variant === 'primary' && 'bg-forest text-limeBright hover:bg-forestInk',
        variant === 'secondary' && 'bg-limeBright text-forest hover:bg-limeSoft',
        variant === 'ghost' && 'border border-borderGray bg-white text-forest hover:bg-backgroundGray',
        variant === 'danger' && 'bg-white border border-customRed text-customRed hover:bg-red-50',
        className
      )}
    />
  );
}

export type TonoBadge = 'neutral' | 'lime' | 'declared' | 'verified' | 'audited' | 'red';

const TONO_BADGE: Record<TonoBadge, string> = {
  neutral: 'bg-backgroundGray text-filtersGray border border-borderGray',
  lime: 'bg-limeSoft text-forest border border-sageGreen',
  declared: 'bg-amber-50 text-declared border border-declared/40',
  verified: 'bg-green-50 text-verified border border-verified/40',
  audited: 'bg-blue-50 text-audited border border-audited/40',
  red: 'bg-red-50 text-customRed border border-customRed/40',
};

export function Badge({
  tone = 'neutral',
  children,
  title,
}: {
  tone?: TonoBadge;
  children: ReactNode;
  title?: string;
}) {
  return (
    <span
      title={title}
      className={cx(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-pill px-2.5 py-0.5 text-xs font-medium',
        TONO_BADGE[tone]
      )}
    >
      {children}
    </span>
  );
}

const ESTADO_TONE: Record<EstadoVerificacion, TonoBadge> = {
  declarado: 'declared',
  verificado: 'verified',
  auditado: 'audited',
  rechazado: 'red',
};

const ESTADO_ICON: Record<EstadoVerificacion, string> = {
  declarado: '⏳',
  verificado: '✓',
  auditado: '✓✓',
  rechazado: '✕',
};

export function EstadoBadge({ estado }: { estado: EstadoVerificacion }) {
  return (
    <Badge tone={ESTADO_TONE[estado]}>
      <span aria-hidden>{ESTADO_ICON[estado]}</span> {ESTADO_LABEL[estado]}
    </Badge>
  );
}

export function SelloBadge({ esDemo, href }: { esDemo: boolean; href?: string }) {
  const inner = (
    <Badge tone="lime" title="Hash SHA-256 anclado en cadena — ver verificación pública">
      ⛓ Sellado{esDemo ? ' (demo)' : ''}
    </Badge>
  );
  return href ? (
    <a href={href} className="hover:opacity-80">
      {inner}
    </a>
  ) : (
    inner
  );
}

export function Stat({
  label,
  value,
  sub,
  icono,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  icono?: string;
}) {
  return (
    <Card className="!p-4">
      <div className="flex items-start gap-3">
        {icono ? <div className="text-2xl leading-none">{icono}</div> : null}
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wide text-brandGrey">{label}</div>
          <div className="mt-1 text-2xl font-medium text-forest">{value}</div>
          {sub ? <div className="mt-0.5 text-xs text-brandGrey">{sub}</div> : null}
        </div>
      </div>
    </Card>
  );
}

export function Banner({
  tone = 'info',
  children,
}: {
  tone?: 'info' | 'warn' | 'ok';
  children: ReactNode;
}) {
  return (
    <div
      className={cx(
        'rounded-cardSm border px-4 py-3 text-sm',
        tone === 'info' && 'border-borderGray bg-backgroundGray text-filtersGray',
        tone === 'warn' && 'border-declared/40 bg-amber-50 text-declared',
        tone === 'ok' && 'border-verified/40 bg-green-50 text-verified'
      )}
    >
      {children}
    </div>
  );
}

export function Field({
  label,
  help,
  children,
}: {
  label: string;
  help?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-forest">{label}</span>
      {children}
      {help ? <span className="mt-1 block text-xs text-brandGrey">{help}</span> : null}
    </label>
  );
}

export const inputCls =
  'w-full rounded-cardSm border border-borderGray bg-white px-3 py-2 text-sm text-forest outline-none focus:border-forest';

export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-forest/40 p-4"
      onClick={onClose}
    >
      <div
        className={cx(
          'max-h-[90vh] w-full overflow-y-auto rounded-card bg-white p-6 shadow-cardHover animate-fade-in',
          wide ? 'max-w-3xl' : 'max-w-lg'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="text-lg font-medium text-forest">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-pill px-2 text-xl text-brandGrey hover:text-forest"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ProgressBar({ pct, tone = 'lime' }: { pct: number; tone?: 'lime' | 'forest' }) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div className="h-2 w-full overflow-hidden rounded-pill bg-backgroundGray">
      <div
        className={cx('h-full rounded-pill', tone === 'lime' ? 'bg-sageGreen' : 'bg-forest')}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export function EmptyState({
  icono,
  titulo,
  children,
}: {
  icono: string;
  titulo: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-cardSm border border-dashed border-borderGray py-10 text-center">
      <div className="text-3xl">{icono}</div>
      <div className="font-medium text-forest">{titulo}</div>
      {children ? <div className="max-w-md text-sm text-brandGrey">{children}</div> : null}
    </div>
  );
}

export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="scrollbar-hidden flex gap-2 overflow-x-auto">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={cx(
            'whitespace-nowrap rounded-pill px-4 py-2 text-sm font-medium transition-colors',
            active === t.id
              ? 'bg-forest text-limeBright'
              : 'bg-white text-forest border border-borderGray hover:bg-backgroundGray'
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function Cargando({ texto = 'Preparando la demo…' }: { texto?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-24 text-brandGrey">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-borderGray border-t-forest" />
      <p className="text-sm">{texto}</p>
    </div>
  );
}

/** Aviso permanente §13: la app no certifica. */
export function DisclaimerCertificacion() {
  return (
    <p className="text-xs text-brandGrey">
      IntegrityX Barrio <strong>mide, monitorea y prepara</strong> la información. La certificación
      la emite un tercero acreditado. Todo dato exhibe su estado:{' '}
      <span className="text-declared">Declarado</span> →{' '}
      <span className="text-verified">Verificado</span> →{' '}
      <span className="text-audited">Auditado</span>.
    </p>
  );
}
