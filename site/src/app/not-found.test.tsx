import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import NotFound, { metadata } from './not-found';

describe('NotFound', () => {
  it('titles the page', () => {
    expect(metadata.title).toBe('Page not found | Raman Lamba');
  });

  it('says so and links back to the front page', () => {
    render(<NotFound />);
    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Front page/ })).toHaveAttribute('href', '/');
  });
});
