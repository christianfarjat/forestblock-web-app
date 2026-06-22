import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TrendChart } from '../TrendChart';

// Mock recharts to avoid canvas rendering issues in tests
vi.mock('recharts', async () => {
  const actual = await vi.importActual('recharts');
  return {
    ...(actual as any),
    LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
    Line: ({ name }: any) => <div data-testid="line">{name}</div>,
    XAxis: () => <div data-testid="x-axis">XAxis</div>,
    YAxis: () => <div data-testid="y-axis">YAxis</div>,
    CartesianGrid: () => <div data-testid="grid">Grid</div>,
    Tooltip: () => <div data-testid="tooltip">Tooltip</div>,
    Legend: () => <div data-testid="legend">Legend</div>,
    ResponsiveContainer: ({ children }: any) => <div data-testid="responsive">{children}</div>,
  };
});

describe('TrendChart', () => {
  const mockData = [
    { month: 'Jan', environmental: 1320, social: 86 },
    { month: 'Feb', environmental: 1310, social: 87 },
    { month: 'Mar', environmental: 1290, social: 88 },
  ];

  const mockLines = [
    { key: 'environmental', name: 'Environmental', color: 'rgb(30, 107, 76)' },
    { key: 'social', name: 'Social', color: 'rgb(14, 78, 90)' },
  ];

  it('renders the title', () => {
    render(
      <TrendChart
        data={mockData}
        lines={mockLines}
        title="Test Chart"
      />
    );

    expect(screen.getByText('Test Chart')).toBeInTheDocument();
  });

  it('renders responsive container', () => {
    render(
      <TrendChart
        data={mockData}
        lines={mockLines}
      />
    );

    expect(screen.getByTestId('responsive')).toBeInTheDocument();
  });

  it('renders line chart components', () => {
    render(
      <TrendChart
        data={mockData}
        lines={mockLines}
      />
    );

    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('grid')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  it('renders axes', () => {
    render(
      <TrendChart
        data={mockData}
        lines={mockLines}
      />
    );

    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
  });

  it('renders lines for each data series', () => {
    render(
      <TrendChart
        data={mockData}
        lines={mockLines}
      />
    );

    const lines = screen.getAllByTestId('line');
    expect(lines.length).toBeGreaterThan(0);
  });

  it('applies custom className', () => {
    const { container } = render(
      <TrendChart
        data={mockData}
        lines={mockLines}
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders without title', () => {
    const { container } = render(
      <TrendChart
        data={mockData}
        lines={mockLines}
      />
    );

    expect(container.querySelector('h3')).not.toBeInTheDocument();
  });
});
