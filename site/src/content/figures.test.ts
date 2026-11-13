import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { projectFigures } from './figures';
import { projects } from './projects';
import { getFigures } from './queries';

describe('project figures', () => {
  it('only belongs to existing projects and has complete entries', () => {
    const slugs = projects.map((p) => p.slug);
    for (const [slug, figs] of Object.entries(projectFigures)) {
      expect(slugs).toContain(slug);
      expect(figs.length).toBeGreaterThan(0);
      for (const f of figs) {
        expect(f.alt.length).toBeGreaterThan(10);
        expect(f.caption.length).toBeGreaterThan(10);
        expect(f.width).toBeGreaterThan(0);
        expect(f.height).toBeGreaterThan(0);
      }
    }
  });
  it('points at image files that exist', () => {
    for (const figs of Object.values(projectFigures)) {
      for (const f of figs) {
        expect(existsSync(path.join(__dirname, '..', '..', 'public', f.src))).toBe(true);
      }
    }
  });
  it('covers the screenshot projects and names nothing private', () => {
    for (const slug of [
      'options-strategy-simulator',
      'qiskit-portfolio-optimization',
      'gold-price-forecasting',
      'lecture-hall-booking',
    ]) {
      expect(getFigures(slug).length).toBeGreaterThan(0);
    }
    expect(getFigures('gold-price-forecasting')).toHaveLength(2);
    expect(getFigures('spotify-campaign')).toEqual([]);
    expect(JSON.stringify(projectFigures)).not.toMatch(/imthyderabad|@/);
  });

  it('leads the gold project with the diagnostics chart (a better thumbnail)', () => {
    expect(getFigures('gold-price-forecasting')[0].src).toBe('/images/projects/gold-residual-diagnostics.png');
  });
});
