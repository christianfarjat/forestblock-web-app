import React from 'react';
import { AppShell } from '@/components/esg/AppShell';

export const metadata = {
  title: 'carbonTrack — ESG Tracking',
  description: 'Environmental, Social & Governance tracking for ForestBlock',
};

export default function ESGLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
