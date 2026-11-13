import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Ad } from './ad';
import { ads } from '@/content/ads';

describe('Ad', () => {
  it('renders the contact ad as a coupon', () => {
    render(<Ad ad={ads[0]} layout="tall" />);
    expect(screen.getByRole('complementary', { name: 'Advertisement' })).toBeInTheDocument();
    expect(screen.getByText(/WANTED: a developer who reads balance sheets/, { selector: 'p' })).toBeInTheDocument();
    const link = screen.getByRole('link', { name: 'Clip the coupon: WANTED: a developer who reads balance sheets' });
    expect(link).toHaveAttribute('href', '#contact');
    expect(link.textContent).toContain('✂');
  });
  it('links a project ad to its story without the scissors', () => {
    render(<Ad ad={ads[1]} layout="wide" />);
    const link = screen.getByRole('link', { name: 'Read the story: Backtest before you bet' });
    expect(link).toHaveAttribute('href', '/work/gold-price-forecasting');
    expect(link.textContent).not.toContain('✂');
  });
});
