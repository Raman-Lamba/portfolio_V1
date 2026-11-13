import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Masthead } from './masthead';

describe('Masthead', () => {
  it('shows name, tagline, availability, location and the live date', () => {
    render(<Masthead now={new Date('2026-11-13T06:00:00Z')} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Raman Lamba' })).toBeInTheDocument();
    expect(screen.getByText('Software for financial decisions')).toBeInTheDocument();
    expect(screen.getByText('Open for freelance & full-time roles')).toBeInTheDocument();
    expect(screen.getByText('Hyderabad')).toBeInTheDocument();
    expect(screen.getByText('Friday, 13 November 2026')).toBeInTheDocument();
  });
});
