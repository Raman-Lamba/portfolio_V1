import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CaseFiles } from './case-files';
import { projects } from '@/content/projects';
import { sections } from '@/content/types';

describe('CaseFiles', () => {
  it('shows a case file per section listing its projects as links', () => {
    render(<CaseFiles />);
    expect(screen.getByRole('heading', { level: 2, name: 'From the archive' })).toBeInTheDocument();
    for (const s of sections) {
      expect(screen.getByRole('heading', { level: 3, name: `Case file: ${s.label}` })).toBeInTheDocument();
    }
    const expected = projects.reduce((n, p) => n + p.sections.length, 0);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(expected);
    expect(links.map((l) => l.getAttribute('href'))).toContain('/work/lecture-hall-booking');
  });
});
