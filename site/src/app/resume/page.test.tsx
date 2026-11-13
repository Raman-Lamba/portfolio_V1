import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ResumeRoute, { metadata } from './page';

describe('resume route', () => {
  it('renders the résumé with a way back and sets the title', () => {
    render(<ResumeRoute />);
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Front page/ })).toHaveAttribute('href', '/');
    expect(metadata.title).toBe('Résumé | Raman Lamba');
  });
});
