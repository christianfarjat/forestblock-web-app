import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IndicatorsTable } from '../IndicatorsTable';

describe('IndicatorsTable', () => {
  const mockIndicators = [
    {
      id: 'ind_001',
      name: 'GHG Emissions',
      value: 1240,
      unit: 'tCO2e',
      target: 1500,
      status: 'on_track' as const,
      evidence: 'verified' as const,
      frameworks: ['ESRS', 'GRI'],
    },
    {
      id: 'ind_002',
      name: 'Water Withdrawal',
      value: 2400,
      unit: 'm³',
      target: 2000,
      status: 'at_risk' as const,
      evidence: 'partial' as const,
      frameworks: ['ESRS'],
    },
  ];

  it('renders table with headers', () => {
    render(<IndicatorsTable indicators={mockIndicators} />);

    expect(screen.getByText('Indicator')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
    expect(screen.getByText('Target')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Evidence')).toBeInTheDocument();
  });

  it('renders all indicators', () => {
    render(<IndicatorsTable indicators={mockIndicators} />);

    expect(screen.getByText('GHG Emissions')).toBeInTheDocument();
    expect(screen.getByText('Water Withdrawal')).toBeInTheDocument();
  });

  it('displays indicator values and units', () => {
    render(<IndicatorsTable indicators={mockIndicators} />);

    expect(screen.getByText(/1,?240/)).toBeInTheDocument();
    expect(screen.getByText('tCO2e')).toBeInTheDocument();
    expect(screen.getByText(/2,?400/)).toBeInTheDocument();
    expect(screen.getByText('m³')).toBeInTheDocument();
  });

  it('displays targets', () => {
    render(<IndicatorsTable indicators={mockIndicators} />);

    expect(screen.getByText(/1,?500/)).toBeInTheDocument();
    expect(screen.getByText(/2,?000/)).toBeInTheDocument();
  });

  it('shows status badges with correct colors', () => {
    render(<IndicatorsTable indicators={mockIndicators} />);

    expect(screen.getByText('On Track')).toBeInTheDocument();
    expect(screen.getByText('At Risk')).toBeInTheDocument();
  });

  it('displays evidence icons and labels', () => {
    render(<IndicatorsTable indicators={mockIndicators} />);

    expect(screen.getByText('Verified')).toBeInTheDocument();
    expect(screen.getByText('Partial')).toBeInTheDocument();
  });

  it('renders framework badges', () => {
    render(<IndicatorsTable indicators={mockIndicators} />);

    expect(screen.getAllByText('ESRS')[0]).toBeInTheDocument();
    expect(screen.getAllByText('GRI')[0]).toBeInTheDocument();
  });

  it('displays title when provided', () => {
    render(
      <IndicatorsTable
        indicators={mockIndicators}
        title="Key Indicators"
      />
    );

    expect(screen.getByText('Key Indicators')).toBeInTheDocument();
  });

  it('handles empty indicators list', () => {
    const { container } = render(<IndicatorsTable indicators={[]} />);

    expect(container.querySelector('tbody')).toBeEmptyDOMElement();
  });

  it('handles indicators without targets', () => {
    const indicatorsNoTarget = [
      {
        id: 'ind_001',
        name: 'Metric',
        value: 100,
        status: 'on_track' as const,
        evidence: 'verified' as const,
      },
    ];

    render(<IndicatorsTable indicators={indicatorsNoTarget as any} />);

    expect(screen.getByText('Metric')).toBeInTheDocument();
  });
});
