import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Editorial } from './editorial';
import { about } from '@/content/about';

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

describe('Editorial', () => {
  it('shows the portrait, headline, paragraphs and pull quote', () => {
    render(<Editorial />);
    expect(screen.getByRole('heading', { level: 2, name: 'Editorial' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Portrait of Raman Lamba' })).toHaveAttribute(
      'src',
      expect.stringContaining('raman.jpg'),
    );
    expect(screen.getByRole('heading', { level: 3, name: about.headline })).toBeInTheDocument();
    for (const p of about.paragraphs) expect(screen.getByText(p)).toBeInTheDocument();
    expect(screen.getByText(about.pullQuote)).toBeInTheDocument();
  });
});
