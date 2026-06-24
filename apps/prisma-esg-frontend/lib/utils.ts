import { IndicatorStatus, Pillar } from '@/types';

export function getPillarColor(pillar: Pillar): string {
  switch (pillar) {
    case 'environmental':
      return '#10b981';
    case 'social':
      return '#3b82f6';
    case 'governance':
      return '#f59e0b';
    default:
      return '#6b7280';
  }
}

export function getPillarLabel(pillar: Pillar): string {
  switch (pillar) {
    case 'environmental':
      return 'Environmental';
    case 'social':
      return 'Social';
    case 'governance':
      return 'Governance';
    default:
      return pillar;
  }
}

export function getStatusColor(status: IndicatorStatus): string {
  switch (status) {
    case 'on_track':
      return '#10b981';
    case 'attention':
      return '#f59e0b';
    case 'at_risk':
      return '#ef4444';
    case 'not_started':
      return '#9ca3af';
    default:
      return '#6b7280';
  }
}

export function getStatusLabel(status: IndicatorStatus): string {
  return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

export function calculateCompleteness(indicators: Array<{ completeness: number }>): number {
  if (indicators.length === 0) return 0;
  const total = indicators.reduce((sum, ind) => sum + ind.completeness, 0);
  return total / indicators.length;
}

export function groupIndicatorsByPillar(indicators: Array<{ pillar: Pillar } & Record<string, unknown>>) {
  return {
    environmental: indicators.filter(ind => ind.pillar === 'environmental'),
    social: indicators.filter(ind => ind.pillar === 'social'),
    governance: indicators.filter(ind => ind.pillar === 'governance'),
  };
}

export function calculatePillarStats(indicators: Array<{ pillar: Pillar; status: IndicatorStatus }>) {
  const stats = {
    environmental: { total: 0, onTrack: 0 },
    social: { total: 0, onTrack: 0 },
    governance: { total: 0, onTrack: 0 },
  };

  indicators.forEach(ind => {
    const pillar = ind.pillar as keyof typeof stats;
    stats[pillar].total += 1;
    if (ind.status === 'on_track') {
      stats[pillar].onTrack += 1;
    }
  });

  return stats;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

export function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
