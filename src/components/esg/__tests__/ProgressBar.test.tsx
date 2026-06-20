import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressBar } from '../ProgressBar';

describe('ProgressBar', () => {
  it('renders label and percentage', () => {
    render(
      <ProgressBar
        label="Emissions Reduction"
        current={75}
        target={100}
        unit="%"
      />
    );

    expect(screen.getByText('Emissions Reduction')).toBeInTheDocument();
    expect(screen.getByText('75% / 100%')).toBeInTheDocument();
  });

  it('displays progress bar with correct width', () => {
    const { container } = render(
      <ProgressBar
        label="Progress"
        current={50}
        target={100}
        unit="%"
      />
    );

    const bar = container.querySelector('.h-full');
    expect(bar).toHaveStyle('width: 50%');
  });

  it('handles completion (100%)', () => {
    const { container } = render(
      <ProgressBar
        label="Complete"
        current={100}
        target={100}
        unit="%"
      />
    );

    const bar = container.querySelector('.h-full');
    expect(bar).toHaveStyle('width: 100%');
  });

  it('shows on_track status color', () => {
    const { container } = render(
      <ProgressBar
        label="On Track"
        current={80}
        target={100}
        status="on_track"
      />
    );

    const bar = container.querySelector('.bg-success');
    expect(bar).toBeInTheDocument();
  });

  it('shows attention status color', () => {
    const { container } = render(
      <ProgressBar
        label="Attention"
        current={50}
        target={100}
        status="attention"
      />
    );

    const bar = container.querySelector('.bg-warning');
    expect(bar).toBeInTheDocument();
  });

  it('shows at_risk status color', () => {
    const { container } = render(
      <ProgressBar
        label="At Risk"
        current={20}
        target={100}
        status="at_risk"
      />
    );

    const bar = container.querySelector('.bg-danger');
    expect(bar).toBeInTheDocument();
  });

  it('uses custom unit', () => {
    render(
      <ProgressBar
        label="Water"
        current={2400}
        target={2000}
        unit="m³"
      />
    );

    expect(screen.getByText('2400m³ / 2000m³')).toBeInTheDocument();
  });

  it('handles values exceeding target', () => {
    const { container } = render(
      <ProgressBar
        label="Over Target"
        current={150}
        target={100}
        unit="%"
      />
    );

    const bar = container.querySelector('.h-full');
    // Should be capped at 100%
    expect(bar).toHaveStyle('width: 100%');
  });
});
