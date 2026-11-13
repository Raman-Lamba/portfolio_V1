import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { FrontPage } from './front-page';

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

describe('FrontPage', () => {
  it('composes every section and keeps the index links valid', () => {
    render(<FrontPage />);
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Printed in Hyderabad');
    expect(
      screen.getByRole('heading', { level: 2, name: 'Quantum Portfolio Optimization' }),
    ).toBeInTheDocument();
    for (const name of ['From our bureaus', 'From the archive', 'Classifieds', 'Editorial', 'Letters to the Editor']) {
      expect(screen.getByRole('heading', { level: 2, name })).toBeInTheDocument();
    }
    expect(screen.getAllByRole('complementary', { name: 'Advertisement' })).toHaveLength(3);

    const nav = screen.getByRole('navigation', { name: 'Inside today' });
    for (const a of within(nav).getAllByRole('link')) {
      const id = a.getAttribute('href')!.slice(1);
      expect(document.getElementById(id)).not.toBeNull();
    }
    const hrefs = screen.getAllByRole('link').map((a) => a.getAttribute('href'));
    expect(hrefs).toContain('#contact');
    expect(hrefs).toContain('/work/qiskit-portfolio-optimization');
  });
});
