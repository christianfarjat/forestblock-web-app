/**
 * Kit de integración — tab/card de acceso al módulo "Barrio" para la app
 * IntegrityX (o cualquier host React).
 *
 * AUTOCONTENIDO: solo depende de React. Los estilos son inline con los tokens
 * ForestBlock/IntegrityX, así funciona igual en un host con o sin Tailwind.
 * Copiá este archivo al repo de IntegrityX (o publicalo como paquete interno)
 * y usalo así:
 *
 *   <IntegrityXBarrioTab
 *     href={process.env.NEXT_PUBLIC_IXB_URL!}
 *     habilitado={org.features?.barrio === true}   // feature flag por organización
 *     activo={pathname.startsWith('/barrio')}
 *   />
 *
 * SSO: ver integration/README.md — recomendado compartir el proyecto Firebase
 * (misma sesión, cero tokens en URLs). No pasar tokens largos por querystring.
 */
import React from 'react';

const T = {
  forest: '#182D1F',
  cream: '#FCFFF6',
  lime: '#BFF179',
  limeSoft: '#DAFAA1',
  grey: '#76756E',
  border: '#E0E0E0',
} as const;

/** Ícono "barrio" inline (sin dependencias de librerías de íconos). */
export function IconoBarrio({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden focusable="false">
      <path
        d="M3 11.5 7 8l4 3.5V20H3v-8.5ZM13 10l4.5-4L22 10v10h-9V10Z"
        stroke={color}
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M6.2 20v-3.4h1.6V20M16.6 20v-3.8h2V20" stroke={color} strokeWidth="1.7" />
    </svg>
  );
}

export interface IntegrityXBarrioTabProps {
  /** URL del módulo desplegado (p. ej. https://barrio.integrityx.app). */
  href: string;
  /** Feature flag: si la organización tiene el módulo habilitado. */
  habilitado?: boolean;
  /** Marca el tab como activo (ruta actual). */
  activo?: boolean;
  /** Abrir en nueva pestaña (default true si el href es externo). */
  nuevaPestana?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  style?: React.CSSProperties;
  className?: string;
  etiqueta?: string;
}

/** Item de navegación (sidebar / tab bar) para la app IntegrityX. */
export function IntegrityXBarrioTab({
  href,
  habilitado = true,
  activo = false,
  nuevaPestana,
  onClick,
  style,
  className,
  etiqueta = 'Barrio',
}: IntegrityXBarrioTabProps) {
  const externo = /^https?:\/\//.test(href);
  const abrirNueva = nuevaPestana ?? externo;

  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 14px',
    borderRadius: 999,
    fontFamily: "'Aeonik','Manrope',system-ui,sans-serif",
    fontSize: 14,
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'opacity .15s ease',
    ...(activo
      ? { background: T.forest, color: T.lime }
      : { background: 'transparent', color: 'inherit' }),
    ...(habilitado ? {} : { opacity: 0.45, cursor: 'not-allowed', pointerEvents: 'none' }),
    ...style,
  };

  return (
    <a
      href={habilitado ? href : undefined}
      aria-disabled={!habilitado}
      title={habilitado ? 'IntegrityX Barrio — MRV de barrios sustentables' : 'Módulo no habilitado para tu organización'}
      target={abrirNueva ? '_blank' : undefined}
      rel={abrirNueva ? 'noopener noreferrer' : undefined}
      onClick={onClick}
      style={base}
      className={className}
    >
      <IconoBarrio size={18} />
      <span>{etiqueta}</span>
      {!habilitado && (
        <span
          style={{
            fontSize: 10,
            padding: '2px 8px',
            borderRadius: 999,
            background: T.limeSoft,
            color: T.forest,
          }}
        >
          próximamente
        </span>
      )}
    </a>
  );
}

/** Card de módulo para un launcher/grid de la home de IntegrityX. */
export function IntegrityXBarrioCard({
  href,
  habilitado = true,
}: Pick<IntegrityXBarrioTabProps, 'href' | 'habilitado'>) {
  return (
    <a
      href={habilitado ? href : undefined}
      aria-disabled={!habilitado}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'block',
        maxWidth: 360,
        padding: 24,
        borderRadius: 28,
        border: `1px solid ${T.border}`,
        background: '#fff',
        color: T.forest,
        textDecoration: 'none',
        fontFamily: "'Aeonik','Manrope',system-ui,sans-serif",
        boxShadow: '0 10px 26px rgba(25,44,31,.10)',
        opacity: habilitado ? 1 : 0.55,
        pointerEvents: habilitado ? 'auto' : 'none',
      }}
    >
      <span
        style={{
          display: 'inline-grid',
          placeItems: 'center',
          width: 44,
          height: 44,
          borderRadius: 18,
          background: T.forest,
          color: T.lime,
        }}
      >
        <IconoBarrio size={24} />
      </span>
      <div style={{ marginTop: 12, fontSize: 18, fontWeight: 500 }}>
        IntegrityX <span style={{ background: T.lime, borderRadius: 999, padding: '1px 8px' }}>Barrio</span>
      </div>
      <p style={{ marginTop: 8, fontSize: 13.5, lineHeight: 1.5, color: T.grey }}>
        Medición, monitoreo y preparación de certificación para barrios de viviendas sustentables.
        Huella ISO 14064-1 por vivienda y del barrio, evidencia verificada y sellado en blockchain.
      </p>
      <span style={{ display: 'inline-block', marginTop: 12, fontSize: 13, fontWeight: 500 }}>
        {habilitado ? 'Abrir módulo →' : 'No habilitado para tu organización'}
      </span>
    </a>
  );
}

/**
 * Construye la URL de entrada al módulo con contexto de la sesión IntegrityX.
 * SOLO metadatos no sensibles (org y superficie sugerida). El login real lo
 * resuelve el SSO compartido — nunca pasar ID tokens por querystring.
 */
export function buildBarrioUrl(
  base: string,
  opts?: { orgId?: string; superficie?: 'residente' | 'gestion' | 'tecnico' }
): string {
  const url = new URL(base);
  if (opts?.orgId) url.searchParams.set('org', opts.orgId);
  if (opts?.superficie) url.pathname = `/${opts.superficie}`;
  return url.toString();
}
