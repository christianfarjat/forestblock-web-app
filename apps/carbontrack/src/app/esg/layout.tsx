import React from 'react';
import { AppShell } from '@forestblock/ui/esg';

export const metadata = {
  title: 'carbonTrack — ESG Tracking',
  description: 'Environmental, Social & Governance tracking',
};

export default function ESGLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
