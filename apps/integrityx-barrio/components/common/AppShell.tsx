'use client';

/**
 * Shell de la webapp: branding IntegrityX ▸ Barrio, navegación por superficie
 * (§2: Portal Residente / Backoffice Gestión / Backoffice Técnico) y el
 * selector de persona demo, que simula el SSO de IntegrityX (en producción:
 * Firebase / Identity Platform con roles en custom claims).
 */
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { superficiesDe } from '@/lib/ixb_rbac';
import { personaActual, resetDemo, setPersonaActual, useIxbState } from '@/lib/ixb_store';
import { ROL_LABEL } from '@/lib/ixb_types';
import { cx, DisclaimerCertificacion } from './ui';

const NAV = [
  { href: '/', label: 'Inicio', superficie: null },
  { href: '/residente', label: 'Mi casa', superficie: 'residente' as const },
  { href: '/gestion', label: 'Gestión', superficie: 'gestion' as const },
  { href: '/tecnico', label: 'Técnico', superficie: 'tecnico' as const },
  { href: '/verificar', label: 'Verificar sello', superficie: null },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const s = useIxbState();
  const persona = personaActual(s);
  const pathname = usePathname();
  const habilitadas = persona ? superficiesDe(persona.rol) : [];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-borderGray bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-cardSm bg-forest text-lg text-limeBright">
              ⌂
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-bold tracking-tight text-forest">
                IntegrityX <span className="rounded-pill bg-limeBright px-2 py-0.5 text-xs">Barrio</span>
              </span>
              <span className="block text-[11px] text-brandGrey">
                MRV de barrios sustentables · ForestBlock
              </span>
            </span>
          </Link>

          <nav className="scrollbar-hidden order-3 -mx-1 flex w-full gap-1 overflow-x-auto md:order-none md:w-auto md:flex-1">
            {NAV.filter((n) => n.superficie === null || habilitadas.includes(n.superficie)).map(
              (n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className={cx(
                    'whitespace-nowrap rounded-pill px-3.5 py-1.5 text-sm font-medium',
                    pathname === n.href
                      ? 'bg-forest text-limeBright'
                      : 'text-forest hover:bg-limeSoft/60'
                  )}
                >
                  {n.label}
                </Link>
              )
            )}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <label className="sr-only" htmlFor="persona-switch">
              Persona demo (SSO IntegrityX simulado)
            </label>
            <select
              id="persona-switch"
              value={s.personaActualId}
              onChange={(e) => setPersonaActual(e.target.value)}
              disabled={!s.listo}
              title="SSO IntegrityX (demo): cambiá de persona para ver cada superficie y su RBAC"
              className="max-w-[220px] rounded-pill border border-borderGray bg-white px-3 py-1.5 text-xs text-forest outline-none focus:border-forest"
            >
              {s.personas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} — {ROL_LABEL[p.rol]}
                </option>
              ))}
            </select>
            <span className="hidden rounded-pill border border-declared/40 bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-declared sm:inline">
              MODO DEMO
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>

      <footer className="border-t border-borderGray bg-white/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <DisclaimerCertificacion />
          <button
            onClick={() => {
              if (confirm('¿Restablecer la demo a los datos iniciales? Se pierden las cargas locales.')) {
                void resetDemo();
              }
            }}
            className="self-start whitespace-nowrap rounded-pill border border-borderGray px-3 py-1 text-xs text-brandGrey hover:text-forest"
          >
            ↺ Reiniciar demo
          </button>
        </div>
      </footer>
    </div>
  );
}
