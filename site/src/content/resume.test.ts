import { describe, it, expect } from 'vitest';
import { classifieds } from './resume';
import { about } from './about';
import { navItems } from './nav';

describe('résumé, about and nav content', () => {
  it('has the four classifieds', () => {
    expect(classifieds.map((c) => c.id)).toEqual(['wanted', 'skills', 'finance', 'honours']);
    for (const c of classifieds) {
      expect(c.lead.length).toBeGreaterThan(0);
      expect(c.body.length).toBeGreaterThan(0);
    }
  });
  it('builds the honours line from the awards data, result only', () => {
    const honours = classifieds.find((c) => c.id === 'honours')!;
    expect(honours.body).toContain('First place, UBS Financial Challenge (Team Cygnus).');
    expect(honours.body).toContain('Winner, Qiskit Fall Fest 2026 (IIIT-Delhi) (Solo entry).');
  });
  it('has no phone number and mentions UBS exactly once', () => {
    const all = JSON.stringify({ classifieds, about });
    expect(all).not.toMatch(/\d{10}/);
    expect(all.match(/UBS/g)).toHaveLength(1);
  });
  it('has an about headline, paragraphs and pull quote', () => {
    expect(about.headline.length).toBeGreaterThan(0);
    expect(about.paragraphs.length).toBeGreaterThanOrEqual(2);
    expect(about.pullQuote.length).toBeGreaterThan(0);
  });
  it('has unique nav ids', () => {
    const ids = navItems.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(['bureaus', 'files', 'classifieds', 'editorial', 'contact']);
  });
});
