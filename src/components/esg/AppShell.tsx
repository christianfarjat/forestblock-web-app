'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AppShellProps {
  children: React.ReactNode;
}

const navItems = [
  { label: 'Overview', href: '/esg/overview', icon: '📊' },
  { label: 'Environmental', href: '/esg/environmental', icon: '🌱' },
  { label: 'Social', href: '/esg/social', icon: '👥' },
  { label: 'Governance', href: '/esg/governance', icon: '⚖️' },
  { label: 'Evidence Vault', href: '/esg/evidence', icon: '📁' },
  { label: 'Reports', href: '/esg/reports', icon: '📄' },
];

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-bg">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-border flex flex-col">
        {/* Logo area */}
        <div className="px-5 py-5 border-b border-divider">
          <h1 className="text-xl font-bold text-primary">carbonTrack</h1>
          <p className="text-xs text-text-muted mt-1">ESG Tracking</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-soft text-primary font-medium'
                    : 'text-text-muted hover:bg-surface-alt hover:text-text'
                }`}
              >
                <span>{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-divider text-xs text-text-faint">
          <p>© 2026 ForestBlock</p>
          <p>Demo Data</p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-surface border-b border-border px-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-text">ForestBlock Demo Org</h2>
            <span className="text-xs bg-primary-soft text-primary px-2 py-1 rounded">2024 Report</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-surface-alt rounded-lg transition-colors">
              🔔
            </button>
            <button className="p-2 hover:bg-surface-alt rounded-lg transition-colors">
              👤
            </button>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto bg-bg p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
