import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResumeDocs } from './resume-docs';
import { site } from '@/content/site';

describe('ResumeDocs', () => {
  it('offers the résumé online and as a PDF download', () => {
    render(<ResumeDocs />);
    expect(screen.getByRole('link', { name: 'Résumé: Read online →' })).toHaveAttribute('href', '/resume');
    const pdf = screen.getByRole('link', { name: 'PDF: Download ↓' });
    expect(pdf).toHaveAttribute('href', site.resumePdf);
    expect(pdf).toHaveAttribute('download');
  });
});
