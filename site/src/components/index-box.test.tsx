import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { IndexBox } from './index-box';
import { navItems } from '@/content/nav';

describe('IndexBox', () => {
  it('links to every section with its page label', () => {
    render(<IndexBox />);
    const nav = screen.getByRole('navigation', { name: 'Inside today' });
    const links = within(nav).getAllByRole('link');
    expect(links).toHaveLength(navItems.length);
    expect(within(nav).getByRole('link', { name: /Bureaus/ })).toHaveAttribute('href', '#bureaus');
    expect(within(nav).getByRole('link', { name: /Letters/ })).toHaveAttribute('href', '#contact');
    expect(nav).toHaveTextContent('B1');
  });
});
