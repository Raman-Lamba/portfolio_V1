import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { sections } from './types';
import { site } from './site';
import { projects } from './projects';
import { bureaus } from './bureaus';
import { ads } from './ads';
import { awards } from './awards';

const everything = JSON.stringify({ site, projects, bureaus, ads, awards });

describe('content', () => {
  it('has unique project slugs', () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
  it('puts every project in at least one known section', () => {
    const ids = sections.map((s) => s.id);
    for (const p of projects) {
      expect(p.sections.length).toBeGreaterThan(0);
      for (const s of p.sections) expect(ids).toContain(s);
    }
  });
  it('has every section populated', () => {
    for (const s of sections) expect(projects.some((p) => p.sections.includes(s.id))).toBe(true);
  });
  it('has exactly one lead story', () => {
    expect(projects.filter((p) => p.lead)).toHaveLength(1);
  });
  it('gives every project a credit line', () => {
    for (const p of projects) expect(p.credit.length).toBeGreaterThan(0);
  });
  it('has three ads that link to the contact block or a real project', () => {
    expect(ads).toHaveLength(3);
    const slugs = projects.map((p) => `/work/${p.slug}`);
    for (const a of ads) expect(a.href === '#contact' || slugs.includes(a.href)).toBe(true);
  });
  it('has three bureaus and three awards', () => {
    expect(bureaus).toHaveLength(3);
    expect(awards).toHaveLength(3);
  });
  it('contains no phone number', () => {
    expect(everything).not.toMatch(/\d{10}/);
  });
  it('shows UBS as a result only', () => {
    expect(everything.match(/UBS/g)).toHaveLength(1);
    expect(awards.find((a) => a.id === 'ubs')).toEqual({
      id: 'ubs', title: 'First place, UBS Financial Challenge', credit: 'Team Cygnus', year: 2026,
    });
  });
  it('points to assets that exist', () => {
    expect(existsSync(path.join(__dirname, '..', '..', 'public', site.photo))).toBe(true);
    expect(existsSync(path.join(__dirname, '..', '..', 'public', site.portrait.src))).toBe(true);
    expect(existsSync(path.join(__dirname, '..', '..', 'public', site.resumePdf))).toBe(true);
  });
});
