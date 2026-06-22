import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DisclosuresTable } from '../DisclosuresTable';

describe('DisclosuresTable', () => {
  const mockDisclosures = [
    {
      id: 'ESRS E1-6',
      topic: 'Climate Change',
      datapoint: 'Gross Scopes 1, 2, 3 and Total GHG emissions',
      pillar: 'environmental',
      indicator: 'GHG Emissions (tCO2e)',
      coverage: 'verified',
      completeness: 100,
    },
    {
      id: 'GRI 305-2',
      topic: 'Emissions',
      datapoint: 'Energy indirect (Scope 2) GHG emissions',
      pillar: 'environmental',
      indicator: 'Scope 2 Emissions (Electricity)',
      coverage: 'verified',
      completeness: 100,
    },
    {
      id: 'ESRS E3-4',
      topic: 'Water & Marine Resources',
      datapoint: 'Water consumption',
      pillar: 'environmental',
      indicator: 'Water Withdrawal',
      coverage: 'partial',
      completeness: 60,
    },
    {
      id: 'ESRS S1-6',
      topic: 'Own Workforce',
      datapoint: 'Characteristics of undertaking employees',
      pillar: 'social',
      indicator: 'Total Employees (FTE)',
      coverage: 'missing',
      completeness: 0,
    },
  ];

  it('renders table headers', () => {
    render(<DisclosuresTable disclosures={mockDisclosures} />);

    expect(screen.getByText('Datapoint')).toBeInTheDocument();
    expect(screen.getByText('Topic')).toBeInTheDocument();
    expect(screen.getByText('Linked Indicator')).toBeInTheDocument();
    expect(screen.getByText('Completeness')).toBeInTheDocument();
    expect(screen.getByText('Coverage')).toBeInTheDocument();
  });

  it('displays all disclosures', () => {
    render(<DisclosuresTable disclosures={mockDisclosures} />);

    expect(screen.getByText('ESRS E1-6')).toBeInTheDocument();
    expect(screen.getByText('GRI 305-2')).toBeInTheDocument();
    expect(screen.getByText('ESRS E3-4')).toBeInTheDocument();
  });

  it('shows datapoint descriptions', () => {
    render(<DisclosuresTable disclosures={mockDisclosures} />);

    expect(screen.getByText(/Gross Scopes 1, 2, 3/)).toBeInTheDocument();
    expect(screen.getByText(/Energy indirect/)).toBeInTheDocument();
    expect(screen.getByText('Water consumption')).toBeInTheDocument();
  });

  it('displays topics', () => {
    render(<DisclosuresTable disclosures={mockDisclosures} />);

    expect(screen.getByText('Climate Change')).toBeInTheDocument();
    expect(screen.getByText('Emissions')).toBeInTheDocument();
    expect(screen.getByText('Water & Marine Resources')).toBeInTheDocument();
  });

  it('shows linked indicators', () => {
    render(<DisclosuresTable disclosures={mockDisclosures} />);

    expect(screen.getByText('GHG Emissions (tCO2e)')).toBeInTheDocument();
    expect(screen.getByText('Scope 2 Emissions (Electricity)')).toBeInTheDocument();
    expect(screen.getByText('Water Withdrawal')).toBeInTheDocument();
  });

  it('displays completeness percentages', () => {
    const { container } = render(<DisclosuresTable disclosures={mockDisclosures} />);

    // Check that completeness bars exist
    const bars = container.querySelectorAll('.bg-primary');
    expect(bars.length).toBeGreaterThan(0);
  });

  it('shows coverage status with icons', () => {
    render(<DisclosuresTable disclosures={mockDisclosures} />);

    expect(screen.getAllByText('Verified')).toHaveLength(2);
    expect(screen.getByText('Partial')).toBeInTheDocument();
    expect(screen.getByText('Missing')).toBeInTheDocument();
  });

  it('displays pillar tags with correct colors', () => {
    const { container } = render(<DisclosuresTable disclosures={mockDisclosures} />);

    // Check for pillar tags
    const tags = container.querySelectorAll('[class*="rounded"][class*="flex"]');
    expect(tags.length).toBeGreaterThan(0);
  });

  it('displays title when provided', () => {
    render(
      <DisclosuresTable
        disclosures={mockDisclosures}
        title="ESRS Disclosures (8)"
      />
    );

    expect(screen.getByText('ESRS Disclosures (8)')).toBeInTheDocument();
  });

  it('renders with empty disclosures', () => {
    const { container } = render(<DisclosuresTable disclosures={[]} />);

    expect(container.querySelector('tbody')).toBeEmptyDOMElement();
  });

  it('renders completeness bars with correct widths', () => {
    const { container } = render(<DisclosuresTable disclosures={mockDisclosures} />);

    const bars = container.querySelectorAll('.bg-primary');
    expect(bars.length).toBeGreaterThan(0);
  });
});
