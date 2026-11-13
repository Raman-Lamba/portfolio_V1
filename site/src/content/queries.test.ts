import { describe, it, expect } from 'vitest';
import { getLead, getStories, getAd, getFolders } from './queries';
import { projects } from './projects';

describe('queries', () => {
  it('returns the lead project', () => {
    expect(getLead().slug).toBe('qiskit-portfolio-optimization');
  });
  it('returns three front-page stories, none of them the lead', () => {
    const stories = getStories();
    expect(stories.map((s) => s.slug)).toEqual([
      'gold-price-forecasting',
      'options-strategy-simulator',
      'trade-simulator',
    ]);
    expect(stories.some((s) => s.lead)).toBe(false);
  });
  it('finds an ad by id and throws on an unknown id', () => {
    expect(getAd('wanted').href).toBe('#contact');
    expect(() => getAd('nope')).toThrow(/nope/);
  });
});

describe('getFolders', () => {
  it('groups projects into four case files, honouring cross-listing', () => {
    const folders = getFolders();
    expect(folders.map((f) => f.id)).toEqual(['finance', 'ml-ai', 'web', 'marketing']);
    const gold = projects.find((p) => p.slug === 'gold-price-forecasting')!;
    expect(folders.filter((f) => f.projects.includes(gold)).map((f) => f.id)).toEqual(['finance', 'ml-ai']);
    for (const f of folders) expect(f.projects.length).toBeGreaterThan(0);
  });
});
