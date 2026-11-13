import { describe, it, expect } from 'vitest';
import { projectDetails } from './details';
import { projects } from './projects';
import { getDetails, getProject, getProjectSlugs } from './queries';

describe('project details', () => {
  it('only describes existing projects and fills every field', () => {
    const slugs = projects.map((p) => p.slug);
    for (const [slug, d] of Object.entries(projectDetails)) {
      expect(slugs).toContain(slug);
      expect(d.problem.length).toBeGreaterThan(0);
      expect(d.approach.length).toBeGreaterThan(0);
      expect(d.result.length).toBeGreaterThan(0);
      expect(d.stack.length).toBeGreaterThan(0);
    }
  });
  it('covers the lead and the front-page stories', () => {
    for (const slug of [
      'qiskit-portfolio-optimization',
      'gold-price-forecasting',
      'options-strategy-simulator',
      'trade-simulator',
    ]) {
      expect(projectDetails[slug]).toBeDefined();
    }
  });
  it('contains no phone number and no UBS mention', () => {
    const all = JSON.stringify(projectDetails);
    expect(all).not.toMatch(/\d{10}/);
    expect(all).not.toMatch(/UBS/);
  });
  it('exposes lookups by slug', () => {
    expect(getProjectSlugs()).toEqual(projects.map((p) => p.slug));
    expect(getProject('gold-price-forecasting')?.title).toBe('Gold Price Forecasting');
    expect(getProject('nope')).toBeUndefined();
    expect(getDetails('gold-price-forecasting')?.stack).toContain('PyTorch');
    expect(getDetails('spotify-campaign')).toBeUndefined();
  });
});
