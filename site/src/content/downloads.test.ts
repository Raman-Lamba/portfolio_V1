import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { projects } from './projects';

describe('project downloads and links', () => {
  it('points every download at a file that exists', () => {
    for (const p of projects) {
      for (const d of p.downloads ?? []) {
        expect(existsSync(path.join(__dirname, '..', '..', 'public', d.href))).toBe(true);
      }
    }
  });
  it('sends MindBloom to the master branch', () => {
    expect(projects.find((p) => p.slug === 'mindbloom')?.source).toBe(
      'https://github.com/Raman-Lamba/MindBloom-Final/tree/master',
    );
  });
});
