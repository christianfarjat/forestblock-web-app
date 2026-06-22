'use client';

import React from 'react';
import { AppShell } from '@forestblock/ui/esg';

export default function ESGLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
