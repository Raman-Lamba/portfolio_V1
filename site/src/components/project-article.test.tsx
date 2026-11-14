import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectArticle } from './project-article';
import { getDetails, getFigures, getProject } from '@/content/queries';

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

describe('ProjectArticle', () => {
  it('shows the write-up sections and stack for a described project', () => {
    const project = getProject('gold-price-forecasting')!;
    const details = getDetails('gold-price-forecasting')!;
    render(<ProjectArticle project={project} details={details} />);
    expect(screen.getByRole('heading', { level: 1, name: project.title })).toBeInTheDocument();
    for (const name of ['Key figures', 'The problem', 'The approach', 'The result', 'Built with']) {
      expect(screen.getByRole('heading', { level: 2, name })).toBeInTheDocument();
    }
    expect(screen.getByText(details.problem)).toBeInTheDocument();
    expect(screen.getByText(details.result)).toBeInTheDocument();
    expect(screen.getByText('PyTorch')).toBeInTheDocument();
    for (const m of project.metrics) expect(screen.getByText(m.value)).toBeInTheDocument();
  });
  it('falls back to the deck and numbers when there is no write-up', () => {
    const project = getProject('spotify-campaign')!;
    render(<ProjectArticle project={project} />);
    expect(screen.getByText(project.deck)).toBeInTheDocument();
    expect(screen.getByText(project.credit)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'The problem' })).toBeNull();
  });
  it('shows real figures with captions and drops the halftone art when it has them', () => {
    const project = getProject('gold-price-forecasting')!;
    const figures = getFigures('gold-price-forecasting');
    render(<ProjectArticle project={project} figures={figures} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Figures' })).toBeInTheDocument();
    for (const f of figures) {
      expect(screen.getByRole('img', { name: f.alt })).toHaveAttribute('src', f.src);
      expect(screen.getByText(f.caption)).toBeInTheDocument();
    }
  });
  it('opens an external project link safely in a new tab', () => {
    const project = getProject('lecture-hall-booking')!;
    render(<ProjectArticle project={project} details={getDetails('lecture-hall-booking')} />);
    const link = screen.getByRole('link', { name: /Live site/ });
    expect(link).toHaveAttribute('href', 'https://lecture-hall-booking.vercel.app');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('links to the public source code and the live build when they exist', () => {
    render(<ProjectArticle project={getProject('lecture-hall-booking')!} />);
    const source = screen.getByRole('link', { name: /Source code on GitHub/ });
    expect(source).toHaveAttribute('href', 'https://github.com/Raman-Lamba/Lecture-Hall-Booking');
    expect(source).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByRole('link', { name: /Live site/ })).toHaveAttribute('href', 'https://lecture-hall-booking.vercel.app');
  });
  it('shows no source link for work without a public repository', () => {
    render(<ProjectArticle project={getProject('asian-paints-valuation')!} />);
    expect(screen.queryByRole('link', { name: /Source code/ })).toBeNull();
  });

  it('offers downloadable files where a project has them', () => {
    render(<ProjectArticle project={getProject('asian-paints-valuation')!} />);
    const link = screen.getByRole('link', { name: /Download the valuation workbook/ });
    expect(link).toHaveAttribute('href', '/downloads/asian-paints-valuation.xlsx');
    expect(link).toHaveAttribute('download');
  });
});
