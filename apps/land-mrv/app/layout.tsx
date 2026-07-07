import type { Metadata } from 'next';
import localFont from 'next/font/local';
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
  title: 'ForestTrack · Land_MRV — ForestBlock',
  description:
    'Land_MRV (ForestTrack): diseño de muestreo y estratificación T0 para línea base y monitoreo MRV — ForestBlock Suite.',
};

type LayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="es" className={aeonik.variable}>
      <body className="min-h-screen bg-cream font-aeonik text-forest">{children}</body>
    </html>
  );
}
