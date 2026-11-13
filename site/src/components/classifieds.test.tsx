import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Classifieds } from './classifieds';
import { classifieds } from '@/content/resume';
import { site } from '@/content/site';

describe('Classifieds', () => {
  it('shows each classified and a résumé download link', () => {
    render(<Classifieds />);
    expect(screen.getByRole('heading', { level: 2, name: 'Classifieds' })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(classifieds.length);
    expect(screen.getByText(/GPA 9\.14/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Download the résumé/ })).toHaveAttribute('href', site.resumePdf);
  });
});
