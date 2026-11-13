import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Letters } from './letters';
import { site } from '@/content/site';

describe('Letters', () => {
  it('is the contact anchor with email, LinkedIn and GitHub', () => {
    const { container } = render(<Letters />);
    expect(container.querySelector('#contact')).not.toBeNull();
    expect(screen.getByRole('heading', { level: 2, name: 'Letters to the Editor' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: site.email })).toHaveAttribute('href', `mailto:${site.email}`);
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('href', site.linkedin);
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', site.github);
  });
});
