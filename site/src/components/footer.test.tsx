import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './footer';

describe('Footer', () => {
  it('is the colophon', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Printed in Hyderabad · Raman Lamba');
  });
});
