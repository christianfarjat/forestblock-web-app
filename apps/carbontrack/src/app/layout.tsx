import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'carbonTrack — ESG Tracking & Disclosure Platform',
  description: 'Enterprise-grade ESG performance tracking, evidence management, and audit-ready reporting',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-bg text-text">
        {children}
      </body>
    </html>
  );
}
