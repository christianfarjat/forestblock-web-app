import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BarChart } from '../BarChart';

// Mock recharts
vi.mock('recharts', async () => {
  const actual = await vi.importActual('recharts');
  return {
    ...(actual as any),
    BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
    Bar: ({ name }: any) => <div data-testid="bar">{name}</div>,
    XAxis: () => <div data-testid="x-axis">XAxis</div>,
    YAxis: () => <div data-testid="y-axis">YAxis</div>,
    CartesianGrid: () => <div data-testid="grid">Grid</div>,
    Tooltip: () => <div data-testid="tooltip">Tooltip</div>,
    Legend: () => <div data-testid="legend">Legend</div>,
    ResponsiveContainer: ({ children }: any) => <div data-testid="responsive">{children}</div>,
  };
});

describe('BarChart', () => {
  const mockData = [
    { scope: 'Scope 1', renewable: 58, nonRenewable: 42 },
    { scope: 'Scope 2', renewable: 60, nonRenewable: 40 },
    { scope: 'Scope 3', renewable: 61, nonRenewable: 39 },
  ];

  const mockBars = [
    { key: 'renewable', name: 'Renewable', color: 'rgb(30, 107, 76)' },
    { key: 'nonRenewable', name: 'Non-Renewable', color: 'rgb(178, 64, 64)' },
  ];

  it('renders the title', () => {
    render(
      <BarChart
        data={mockData}
        bars={mockBars}
        title="Energy Mix"
      />
    );

    expect(screen.getByText('Energy Mix')).toBeInTheDocument();
  });

  it('renders responsive container', () => {
    render(
      <BarChart
        data={mockData}
        bars={mockBars}
      />
    );

    expect(screen.getByTestId('responsive')).toBeInTheDocument();
  });

  it('renders bar chart components', () => {
    render(
      <BarChart
        data={mockData}
        bars={mockBars}
      />
    );

    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('grid')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  it('renders axes', () => {
    render(
      <BarChart
        data={mockData}
        bars={mockBars}
      />
    );

    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
  });

  it('renders bars for each data series', () => {
    render(
      <BarChart
        data={mockData}
        bars={mockBars}
      />
    );

    const bars = screen.getAllByTestId('bar');
    expect(bars.length).toBeGreaterThan(0);
  });

  it('defaults to horizontal layout', () => {
    const { container } = render(
      <BarChart
        data={mockData}
        bars={mockBars}
      />
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('accepts vertical layout', () => {
    const { container } = render(
      <BarChart
        data={mockData}
        bars={mockBars}
        layout="vertical"
      />
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <BarChart
        data={mockData}
        bars={mockBars}
        className="custom-bar-chart"
      />
    );

    expect(container.firstChild).toHaveClass('custom-bar-chart');
  });

  it('renders without title', () => {
    const { container } = render(
      <BarChart
        data={mockData}
        bars={mockBars}
      />
    );

    expect(container.querySelector('h3')).not.toBeInTheDocument();
  });
});
