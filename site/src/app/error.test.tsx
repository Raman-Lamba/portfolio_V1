import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import ErrorPage from './error';

describe('ErrorPage', () => {
  it('offers a retry and a way back to the front page', () => {
    const retry = vi.fn();
    render(<ErrorPage error={new Error('boom')} retry={retry} />);
    expect(screen.getByRole('heading', { level: 1, name: 'The press has jammed' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Run the press again' }));
    expect(retry).toHaveBeenCalledOnce();
    expect(screen.getByRole('link', { name: /Front page/ })).toHaveAttribute('href', '/');
  });
});
