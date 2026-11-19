import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { Intro } from './intro';
import { about } from '@/content/about';

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

describe('Intro', () => {
  it('shows the portrait, headline, bio, pull quote and the two calls to action', () => {
    const { container } = render(<Intro />);
    expect(container.querySelector('#intro')).not.toBeNull();
    expect(screen.getByRole('heading', { level: 2, name: about.headline })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Portrait of Raman Lamba' })).toHaveAttribute(
      'src',
      expect.stringContaining('raman-portrait.jpg'),
    );
    for (const p of about.paragraphs) expect(screen.getByText(p)).toBeInTheDocument();
    expect(screen.getByText(about.pullQuote)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Hire me' })).toHaveAttribute('href', '#contact');
    expect(screen.getByRole('link', { name: 'Résumé' })).toHaveAttribute('href', '/resume');
  });

  it('boxes the brief: three desks drawn from the content, each with a bold lead', () => {
    render(<Intro />);
    const brief = screen.getByRole('complementary', { name: about.brief.heading });
    const items = within(brief).getAllByRole('listitem');
    expect(items).toHaveLength(3);
    for (const b of about.brief.items) {
      expect(within(brief).getByText(b.lead)).toBeInTheDocument();
      expect(within(brief).getByText(b.text, { exact: false })).toBeInTheDocument();
    }
    // the calls to action live inside the brief so it reads as one unit
    expect(within(brief).getByRole('link', { name: 'Hire me' })).toBeInTheDocument();
  });

  it('keeps the brief honest: the two wins as results, the case competition left to the Notices', () => {
    const record = about.brief.items.find((b) => b.lead === 'On the record.')!;
    expect(record.text).toMatch(/Qiskit Fall Fest 2026 \(solo entry\)/);
    expect(record.text).toMatch(/First place in a finance case competition \(Team Cygnus\)/);
    expect(JSON.stringify(about)).not.toMatch(/UBS|\d{10}|\+91/);
  });
});
