import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Letters, letterSubjects } from './letters';
import { site } from '@/content/site';

describe('Letters', () => {
  it('is the contact anchor with email, LinkedIn and GitHub', () => {
    const { container } = render(<Letters />);
    expect(container.querySelector('#contact')).not.toBeNull();
    expect(screen.getByRole('heading', { level: 2, name: 'Letters to the Editor' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: site.email })).toHaveAttribute('href', `mailto:${site.email}`);
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('href', site.linkedin);
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', site.github);
    for (const name of ['LinkedIn', 'GitHub']) {
      const a = screen.getByRole('link', { name });
      expect(a).toHaveAttribute('target', '_blank');
      expect(a).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });

  it('offers a pre-addressed letter for freelance work and one for a role', () => {
    render(<Letters />);
    expect(letterSubjects).toHaveLength(2);
    for (const s of letterSubjects) {
      const href = screen.getByRole('link', { name: s.label }).getAttribute('href')!;
      expect(href.startsWith(`mailto:${site.email}?subject=`)).toBe(true);
      expect(decodeURIComponent(href.split('subject=')[1])).toBe(s.subject);
    }
  });

  it('shows no phone number', () => {
    const { container } = render(<Letters />);
    expect(container.textContent).not.toMatch(/\+91|\d{10}/);
    expect(container.querySelector('a[href^="tel:"]')).toBeNull();
  });
});
