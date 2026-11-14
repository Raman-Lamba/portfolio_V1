import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MarketsStrip, Wire } from './live-strip';

describe('MarketsStrip', () => {
  it('shows each quote with direction and the disclaimer', () => {
    render(
      <MarketsStrip
        quotes={[
          { label: 'Nifty 50', price: 25144.3, changePct: -0.61 },
          { label: 'USD/INR', price: 88.1, changePct: 0.1 },
        ]}
      />,
    );
    expect(screen.getByText('Nifty 50')).toBeInTheDocument();
    expect(screen.getByText('down')).toBeInTheDocument();
    expect(screen.getByText('up')).toBeInTheDocument();
    expect(screen.getByText(/delayed, not advice/i)).toBeInTheDocument();
  });
  it('renders nothing without quotes', () => {
    const { container } = render(<MarketsStrip quotes={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe('Wire', () => {
  it('links out safely', () => {
    render(<Wire headline={{ title: 'Big news', summary: 'Why it matters.', source: 'Mint', url: 'https://example.com/a' }} />);
    expect(screen.getByText('Why it matters.')).toBeInTheDocument();
    const a = screen.getByRole('link', { name: 'Big news' });
    expect(a).toHaveAttribute('target', '_blank');
    expect(a).toHaveAttribute('rel', 'noopener noreferrer');
  });
  it('renders nothing without a headline', () => {
    const { container } = render(<Wire headline={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});
