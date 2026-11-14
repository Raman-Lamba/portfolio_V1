import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MarketReportView } from './market-report';

const q = (label: string, price: number, changePct: number, open = false) => ({
  label,
  price,
  changePct,
  open,
  time: Date.parse('2026-11-13T10:00:00Z'),
});

describe('MarketReportView', () => {
  it('shows an India and a US table with status, direction and a summary', () => {
    render(
      <MarketReportView
        report={{
          India: [q('Nifty 50', 25144.3, -0.61), q('Sensex', 81592.45, 0.7)],
          US: [q('S&P 500', 7561.67, 0.4, true)],
        }}
      />,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Markets today' })).toBeInTheDocument();
    const india = screen.getByRole('table', { name: /India market indices/ });
    expect(screen.getAllByText('Nifty 50').length).toBeGreaterThan(0);
    expect(within(india).getByText('Sensex')).toBeInTheDocument();
    expect(within(india).getByText('up')).toBeInTheDocument();
    expect(screen.getAllByText('down').length).toBeGreaterThan(0);
    expect(screen.getByText('Market open')).toBeInTheDocument();
    expect(screen.getByText('Market closed')).toBeInTheDocument();
    expect(screen.getByText(/IST/)).toBeInTheDocument();
    expect(screen.getByText(/Indian equities ended lower: Nifty 50 -0\.61%/)).toBeInTheDocument();
    expect(screen.getByText(/Delayed, not advice/)).toBeInTheDocument();
  });
  it('drops a region without data and hides entirely when both are empty', () => {
    const { rerender, container } = render(<MarketReportView report={{ India: [q('Nifty 50', 1, 1)], US: [] }} />);
    expect(screen.queryByRole('heading', { level: 3, name: 'US' })).toBeNull();
    rerender(<MarketReportView report={{ India: [], US: [] }} />);
    expect(container).toBeEmptyDOMElement();
  });
});
