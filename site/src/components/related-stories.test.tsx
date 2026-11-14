import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { RelatedStories } from './related-stories';
import { getRelated } from '@/content/queries';

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

describe('getRelated', () => {
  it('returns up to three other projects from the same sections, never itself', () => {
    const related = getRelated('qiskit-portfolio-optimization');
    expect(related).toHaveLength(3);
    expect(related.map((p) => p.slug)).not.toContain('qiskit-portfolio-optimization');
    for (const p of related) expect(p.sections).toContain('finance');
  });
  it('falls back to the second section when the first runs dry, and handles unknown slugs', () => {
    // marketing has one project, so Spotify has nothing to show
    expect(getRelated('spotify-campaign')).toEqual([]);
    expect(getRelated('nope')).toEqual([]);
    // MindBloom is ml-ai + web: three others exist across the two
    expect(getRelated('mindbloom')).toHaveLength(3);
  });
});

describe('RelatedStories', () => {
  it('links each related story under a labelled nav and renders nothing when empty', () => {
    const related = getRelated('gold-price-forecasting');
    render(<RelatedStories projects={related} />);
    const nav = screen.getByRole('navigation', { name: 'Elsewhere in the archive' });
    for (const p of related) {
      expect(within(nav).getByRole('link', { name: p.title })).toHaveAttribute('href', `/work/${p.slug}`);
    }
    const { container } = render(<RelatedStories projects={[]} />);
    expect(container.querySelector('nav')).toBeNull();
  });
});
