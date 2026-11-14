import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Intro } from './intro';
import { about } from '@/content/about';

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

describe('Intro', () => {
  it('shows the portrait, headline, bio, pull quote and the two calls to action', () => {
    const { container } = render(<Intro />);
    expect(container.querySelector('#intro')).not.toBeNull();
    expect(screen.getByRole('heading', { level: 2, name: about.headline })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Portrait of Raman Lamba' })).toHaveAttribute(
      'src',
      expect.stringContaining('raman.jpg'),
    );
    for (const p of about.paragraphs) expect(screen.getByText(p)).toBeInTheDocument();
    expect(screen.getByText(about.pullQuote)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Hire me' })).toHaveAttribute('href', '#contact');
    expect(screen.getByRole('link', { name: 'Résumé' })).toHaveAttribute('href', '/resume');
  });
});
