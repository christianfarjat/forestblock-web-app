import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PillarCard } from '../PillarCard';

describe('PillarCard', () => {
  const mockHighlights = [
    { label: 'Scope 1', value: '340 tCO2e', trend: -8 },
    { label: 'Scope 2', value: '520 tCO2e', trend: -15 },
  ];

  it('renders pillar type and total indicators', () => {
    render(
      <PillarCard
        type="environmental"
        totalIndicators={24}
        completeness={92}
        status="on_track"
        highlights={mockHighlights}
      />
    );

    expect(screen.getByText('Environmental')).toBeInTheDocument();
    expect(screen.getByText('24 indicators')).toBeInTheDocument();
  });

  it('displays completeness percentage and bar', () => {
    render(
      <PillarCard
        type="social"
        totalIndicators={18}
        completeness={85}
        status="on_track"
        highlights={mockHighlights}
      />
    );

    expect(screen.getByText('Data Completeness')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('displays status badge', () => {
    render(
      <PillarCard
        type="governance"
        totalIndicators={12}
        completeness={88}
        status="attention"
        highlights={mockHighlights}
      />
    );

    expect(screen.getByText('Attention')).toBeInTheDocument();
  });

  it('renders all highlights with trends', () => {
    render(
      <PillarCard
        type="environmental"
        totalIndicators={24}
        completeness={92}
        status="on_track"
        highlights={mockHighlights}
      />
    );

    expect(screen.getByText('Scope 1')).toBeInTheDocument();
    expect(screen.getByText('340 tCO2e')).toBeInTheDocument();
    expect(screen.getByText('Scope 2')).toBeInTheDocument();
    expect(screen.getByText('520 tCO2e')).toBeInTheDocument();
  });

  it('uses correct icon for each pillar type', () => {
    const { rerender } = render(
      <PillarCard
        type="environmental"
        totalIndicators={24}
        completeness={92}
        status="on_track"
        highlights={mockHighlights}
      />
    );

    expect(screen.getByText('🌱')).toBeInTheDocument();

    rerender(
      <PillarCard
        type="social"
        totalIndicators={18}
        completeness={85}
        status="on_track"
        highlights={mockHighlights}
      />
    );

    expect(screen.getByText('👥')).toBeInTheDocument();
  });

  it('applies correct color for status', () => {
    const { container } = render(
      <PillarCard
        type="environmental"
        totalIndicators={24}
        completeness={92}
        status="at_risk"
        highlights={mockHighlights}
      />
    );

    const statusBadge = screen.getByText('At Risk');
    expect(statusBadge).toHaveClass('text-danger');
  });
});
