import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SportsDesk } from './sports-desk';
import { hobbies } from '@/content/hobbies';

describe('SportsDesk', () => {
  it('lists each personal best under a Sports desk heading', () => {
    render(<SportsDesk />);
    expect(screen.getByRole('heading', { level: 2, name: 'Sports desk' })).toBeInTheDocument();
    for (const s of hobbies.stats) {
      expect(screen.getByText(s.value)).toBeInTheDocument();
      expect(screen.getByText(s.label)).toBeInTheDocument();
    }
  });
});
