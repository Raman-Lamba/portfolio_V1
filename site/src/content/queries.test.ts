import { describe, it, expect } from 'vitest';
import { getLead, getStories, getAd } from './queries';

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
