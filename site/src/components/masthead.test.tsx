import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { Masthead } from './masthead';
import { site } from '@/content/site';

describe('Masthead', () => {
  it('shows name, tagline, availability, location and the live date', () => {
    render(<Masthead now={new Date('2026-11-13T06:00:00Z')} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Raman Lamba' })).toBeInTheDocument();
    expect(screen.getByText('Software for financial decisions')).toBeInTheDocument();
    expect(screen.getByText('Open for freelance & full-time roles')).toBeInTheDocument();
    expect(screen.getByText('Hyderabad')).toBeInTheDocument();
    expect(screen.getByText('Friday, 13 November 2026')).toBeInTheDocument();
  });

  it('prints an edition strip under the nameplate', () => {
    render(<Masthead />);
    const strip = screen.getByRole('list', { name: 'Edition' });
    const items = within(strip).getAllByRole('listitem').map((li) => li.textContent);
    expect(items).toEqual([...site.edition]);
    expect(items).toContain('Price: one email');
  });

  it('inks the nameplate in with a press animation that reduced-motion can switch off', () => {
    render(<Masthead />);
    expect(screen.getByRole('heading', { level: 1 }).className).toContain('masthead-plate');
  });
});
