import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BackLink } from './back-link';
import { PREV_KEY } from './nav-tracker';

const back = vi.fn();

describe('BackLink', () => {
  beforeEach(() => {
    back.mockClear();
    vi.spyOn(window.history, 'back').mockImplementation(back);
    sessionStorage.clear();
    window.history.pushState(null, '', '/a');
    window.history.pushState(null, '', '/b');
  });

  it('steps back in history when the visitor came from the front page', () => {
    sessionStorage.setItem(PREV_KEY, '/');
    render(<BackLink>Front page</BackLink>);
    fireEvent.click(screen.getByRole('link', { name: 'Front page' }));
    expect(back).toHaveBeenCalledTimes(1);
  });

  it('is a plain link to the front page on a direct visit', () => {
    render(<BackLink>Front page</BackLink>);
    const link = screen.getByRole('link', { name: 'Front page' });
    expect(link).toHaveAttribute('href', '/');
    fireEvent.click(link);
    expect(back).not.toHaveBeenCalled();
  });

  it('does not step back when the previous page was another project', () => {
    sessionStorage.setItem(PREV_KEY, '/work/other');
    render(<BackLink>Front page</BackLink>);
    fireEvent.click(screen.getByRole('link', { name: 'Front page' }));
    expect(back).not.toHaveBeenCalled();
  });
});
