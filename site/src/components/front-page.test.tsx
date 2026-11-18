import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { FrontPage } from './front-page';
import { about } from '@/content/about';

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
      screen.getByRole('heading', { level: 2, name: 'Loan Reconciliation Agent' }),
    ).toBeInTheDocument();
    for (const name of [
      about.headline,
      'More stories',
      'From the archive',
      'From our bureaus',
      'Classifieds',
      'Letters to the Editor',
    ]) {
      expect(screen.getByRole('heading', { level: 2, name })).toBeInTheDocument();
    }
    expect(screen.queryByRole('heading', { level: 2, name: 'Editorial' })).toBeNull();
    expect(screen.getAllByRole('complementary', { name: /^Advertisement: / })).toHaveLength(3);

    const nav = screen.getByRole('navigation', { name: 'Inside today' });
    for (const a of within(nav).getAllByRole('link')) {
      const id = a.getAttribute('href')!.slice(1);
      expect(document.getElementById(id)).not.toBeNull();
    }
    const hrefs = screen.getAllByRole('link').map((a) => a.getAttribute('href'));
    expect(hrefs).toContain('#contact');
    expect(hrefs).toContain('#files');
    expect(hrefs).toContain('/work/fineract-loan-reconciliation');
    expect(hrefs).toContain('/work/qiskit-portfolio-optimization');
  });

  it('puts the intro first, then work, then experience, then contact', () => {
    render(<FrontPage />);
    const order = ['intro', 'files', 'bureaus', 'classifieds', 'contact'].map(
      (id) => document.getElementById(id)!,
    );
    for (let i = 0; i < order.length - 1; i++) {
      expect(order[i].compareDocumentPosition(order[i + 1]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    }
    const lead = screen.getByRole('heading', { level: 2, name: 'Loan Reconciliation Agent' });
    expect(order[0].compareDocumentPosition(lead) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(lead.compareDocumentPosition(order[1]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('offers a link from the stories to the full archive', () => {
    render(<FrontPage />);
    expect(screen.getByRole('link', { name: /See all work in the archive/ })).toHaveAttribute('href', '#files');
  });
});
