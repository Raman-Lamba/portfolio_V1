import { describe, it, expect } from 'vitest';
import { resumeFull } from './resume-full';

describe('resumeFull', () => {
  it('has education, three roles with bullets, honours, projects and skills', () => {
    expect(resumeFull.education.map((e) => e.school)).toEqual([
      'Institute of Management Technology Hyderabad',
      'CRSSIET, NCR',
    ]);
    expect(resumeFull.experience.map((r) => r.org)).toEqual(['Oxane Partners', 'Jivika', 'Coding Blocks']);
    for (const r of resumeFull.experience) expect(r.bullets.length).toBeGreaterThan(0);
    expect(resumeFull.honours).toHaveLength(3);
    expect(resumeFull.projects.length).toBeGreaterThanOrEqual(5);
    expect(resumeFull.skills.map((s) => s.label)).toEqual(['Finance', 'Code & Data', 'Tools']);
  });
  it('has no phone number and mentions UBS exactly once, as a result', () => {
    const all = JSON.stringify(resumeFull);
    expect(all).not.toMatch(/\d{10}/);
    expect(all.match(/UBS/g)).toHaveLength(1);
  });
});
