import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Bureaus } from './bureaus';
import { bureaus } from '@/content/bureaus';

describe('Bureaus', () => {
  it('shows one card per internship under a section heading', () => {
    render(<Bureaus />);
    expect(screen.getByRole('heading', { level: 2, name: 'From our bureaus' })).toBeInTheDocument();
    for (const b of bureaus) {
      expect(screen.getByRole('heading', { level: 3, name: b.org })).toBeInTheDocument();
      expect(screen.getByText(b.role)).toBeInTheDocument();
      expect(screen.getByText(b.summary)).toBeInTheDocument();
      expect(screen.getByText(b.dates)).toBeInTheDocument();
    }
  });
});
