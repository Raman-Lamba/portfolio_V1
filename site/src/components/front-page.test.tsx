import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FrontPage } from './front-page';

describe('FrontPage', () => {
  it('composes lead story, three stories and two ads', () => {
    render(<FrontPage />);
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Quantum Portfolio Optimization' }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(4);
    expect(screen.getAllByRole('complementary', { name: 'Advertisement' })).toHaveLength(2);
    const hrefs = screen.getAllByRole('link').map((a) => a.getAttribute('href'));
    expect(hrefs).toContain('/work/qiskit-portfolio-optimization');
    expect(hrefs).toContain('/work/gold-price-forecasting');
    expect(hrefs).toContain('#contact');
  });
});
