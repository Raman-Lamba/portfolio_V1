import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import WorkPage, { generateMetadata, generateStaticParams } from './page';
import { projects } from '@/content/projects';

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

describe('work page', () => {
  it('prerenders every project slug', () => {
    expect(generateStaticParams().map((p) => p.slug)).toEqual(projects.map((p) => p.slug));
  });
  it('renders the article with a way back to the front page', async () => {
    render(await WorkPage({ params: Promise.resolve({ slug: 'gold-price-forecasting' }) }));
    expect(screen.getByRole('heading', { level: 1, name: 'Gold Price Forecasting' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Front page/ })).toHaveAttribute('href', '/');
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
  it('sets the title metadata', async () => {
    const meta = await generateMetadata({ params: Promise.resolve({ slug: 'gold-price-forecasting' }) });
    expect(meta.title).toBe('Gold Price Forecasting | Raman Lamba');
  });
  it('404s for an unknown slug', async () => {
    await expect(WorkPage({ params: Promise.resolve({ slug: 'nope' }) })).rejects.toThrow();
  });
});
