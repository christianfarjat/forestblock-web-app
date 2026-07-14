import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { AppShell } from '@/components/common/AppShell';
import { Providers } from '@/components/common/Providers';
import './globals.css';

const aeonik = localFont({
  src: [
    { path: '../fonts/Aeonik-Light.otf', weight: '300', style: 'normal' },
    { path: '../fonts/Aeonik-Regular.otf', weight: '400', style: 'normal' },
    { path: '../fonts/Aeonik-Medium.otf', weight: '500', style: 'normal' },
    { path: '../fonts/Aeonik-Bold.otf', weight: '700', style: 'normal' },
  ],
  variable: '--font-aeonik',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'IntegrityX Barrio — MRV de barrios sustentables · ForestBlock',
  description:
    'Medición, monitoreo y preparación de certificación de sustentabilidad para barrios de viviendas. Módulo habilitable dentro de IntegrityX (ForestBlock / MJM).',
  manifest: '/manifest.webmanifest',
  icons: { icon: '/icons/icon.svg' },
};

export const viewport: Viewport = {
  themeColor: '#182D1F',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={aeonik.variable}>
      <body className="min-h-screen bg-cream font-aeonik text-forest">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
