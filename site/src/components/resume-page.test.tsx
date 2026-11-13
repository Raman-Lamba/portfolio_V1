import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResumePage } from './resume-page';
import { resumeFull } from '@/content/resume-full';
import { site } from '@/content/site';

describe('ResumePage', () => {
  it('shows the sections, every role and a PDF download', () => {
    render(<ResumePage />);
    expect(screen.getByRole('heading', { level: 1, name: 'Raman Lamba' })).toBeInTheDocument();
    for (const name of ['Education', 'Experience', 'Awards & competitions', 'Projects', 'Skills']) {
      expect(screen.getByRole('heading', { level: 2, name })).toBeInTheDocument();
    }
    for (const r of resumeFull.experience) {
      expect(screen.getByRole('heading', { level: 3, name: new RegExp(r.org) })).toBeInTheDocument();
    }
    expect(screen.getByRole('link', { name: /Download PDF/ })).toHaveAttribute('href', site.resumePdf);
    expect(screen.getByRole('link', { name: site.email })).toHaveAttribute('href', `mailto:${site.email}`);
    for (const name of ['LinkedIn', 'GitHub']) {
      const a = screen.getByRole('link', { name });
      expect(a).toHaveAttribute('target', '_blank');
      expect(a).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });
});
