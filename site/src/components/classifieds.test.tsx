import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Classifieds } from './classifieds';
import { classifieds } from '@/content/resume';

describe('Classifieds', () => {
  it('shows each classified', () => {
    render(<Classifieds />);
    expect(screen.getByRole('heading', { level: 2, name: 'Classifieds' })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(classifieds.length);
    expect(screen.getByText(/GPA 8\.99/)).toBeInTheDocument();
  });
});
