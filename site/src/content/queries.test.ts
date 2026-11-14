import { describe, it, expect } from 'vitest';
import { getLead, getStories, getAd, getFolders, getFolderClippings } from './queries';
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

describe('getFolderClippings', () => {
  it('mirrors the folders and attaches the first figure when there is one', () => {
    const folders = getFolderClippings();
    expect(folders.map((f) => f.id)).toEqual(['finance', 'ml-ai', 'web', 'marketing']);
    const finance = folders[0];
    const qiskit = finance.clippings.find((c) => c.slug === 'qiskit-portfolio-optimization')!;
    expect(qiskit.title).toBe('Quantum Portfolio Optimization');
    expect(qiskit.figure?.src).toBe('/images/projects/qiskit-hardware-valid-rate.png');
    const marketing = folders[3];
    expect(marketing.clippings.map((c) => c.slug)).toEqual(['spotify-campaign']);
    expect(marketing.clippings[0].figure).toBeUndefined();
    const web = folders[2].clippings.find((c) => c.slug === 'lecture-hall-booking')!;
    expect(web.figure?.src).toBe('/images/projects/lecture-hall-booking.png');
  });
  it('gives every clipping a title, kicker and credit', () => {
    for (const f of getFolderClippings()) {
      for (const c of f.clippings) {
        expect(c.title.length).toBeGreaterThan(0);
        expect(c.kicker.length).toBeGreaterThan(0);
        expect(c.credit.length).toBeGreaterThan(0);
      }
    }
  });
});
