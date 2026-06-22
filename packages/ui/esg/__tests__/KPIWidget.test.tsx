import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KPIWidget } from '../KPIWidget';

describe('KPIWidget', () => {
  it('renders label and value', () => {
    render(
      <KPIWidget
        label="Total Emissions"
        value={1240}
        unit="tCO2e"
      />
    );

    expect(screen.getByText('Total Emissions')).toBeInTheDocument();
    expect(screen.getByText(/1,?240/)).toBeInTheDocument();
    expect(screen.getByText('tCO2e')).toBeInTheDocument();
  });

  it('displays trend when provided', () => {
    render(
      <KPIWidget
        label="GHG Emissions"
        value={1240}
        unit="tCO2e"
        trend={-12}
        trendDirection="down"
      />
    );

    expect(screen.getByText(/12%/)).toBeInTheDocument();
    expect(screen.getByText('vs last month')).toBeInTheDocument();
  });

  it('displays target when provided', () => {
    render(
      <KPIWidget
        label="Emissions"
        value={1240}
        unit="tCO2e"
        target={1500}
      />
    );

    expect(screen.getByText(/Target: 1,?500/)).toBeInTheDocument();
  });

  it('displays methodology tooltip when provided', () => {
    render(
      <KPIWidget
        label="Scope 1"
        value={340}
        unit="tCO2e"
        methodology="Direct combustion emissions"
      />
    );

    expect(screen.getByText('Direct combustion emissions')).toBeInTheDocument();
  });

  it('renders status indicator dot', () => {
    const { container } = render(
      <KPIWidget
        label="On Track KPI"
        value={100}
        status="on_track"
      />
    );

    const statusDot = container.querySelector('.opacity-70');
    expect(statusDot).toBeInTheDocument();
  });

  it('formats large numbers with commas', () => {
    render(
      <KPIWidget
        label="Large number"
        value={2400000}
      />
    );

    expect(screen.getByText(/2,400,?000/)).toBeInTheDocument();
  });

  it('handles string values', () => {
    render(
      <KPIWidget
        label="Status"
        value="Active"
      />
    );

    expect(screen.getByText('Active')).toBeInTheDocument();
  });
});
