import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import { CaseFiles } from './case-files';
import { projects } from '@/content/projects';
import { sections } from '@/content/types';

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

describe('CaseFiles', () => {
  it('shows a case file per section listing its projects as links', () => {
    render(<CaseFiles />);
    expect(screen.getByRole('heading', { level: 2, name: 'From the archive' })).toBeInTheDocument();
    for (const s of sections) {
      expect(screen.getByRole('heading', { level: 3, name: `Case file: ${s.label}` })).toBeInTheDocument();
    }
    // each folder shows its first four titles as links; the rest are inside the folder
    const expected = sections.reduce(
      (n, s) => n + Math.min(4, projects.filter((p) => p.sections.includes(s.id)).length),
      0,
    );
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(expected);
    expect(links.every((l) => l.getAttribute('href')?.startsWith('/work/'))).toBe(true);
  });
});

describe('CaseFiles interaction', () => {
  beforeAll(() => {
    HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    });
    HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
      this.removeAttribute('open');
    });
  });
  beforeEach(() => {
    window.history.replaceState(null, '', '/');
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('has an open button per case file and no dialog until one is used', () => {
    render(<CaseFiles />);
    for (const s of sections) {
      expect(screen.getByRole('button', { name: `Open case file: ${s.label}` })).toHaveAttribute('aria-haspopup', 'dialog');
    }
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('opens the clicked folder, puts it in the URL, then closes it again', () => {
    render(<CaseFiles />);
    fireEvent.click(screen.getByRole('button', { name: 'Open case file: Finance' }));
    const dialog = screen.getByRole('dialog', { name: 'Case file: Finance' });
    expect(window.location.hash).toBe('#file-finance');
    expect(within(dialog).getAllByRole('heading', { level: 3 }).length).toBeGreaterThan(3);
    fireEvent.click(within(dialog).getByRole('button', { name: 'Close case file' }));
    act(() => {
      vi.advanceTimersByTime(150);
    });
    // history.back() resolves asynchronously in jsdom; the dialog unmounts as soon as the hash clears
    return vi.waitFor(() => expect(screen.queryByRole('dialog')).toBeNull(), { timeout: 2000 });
  });

  it('opens straight from a deep link', () => {
    window.history.replaceState(null, '', '/#file-web');
    render(<CaseFiles />);
    expect(screen.getByRole('dialog', { name: 'Case file: Web' })).toBeInTheDocument();
  });

  it('makes the whole folder the button', () => {
    render(<CaseFiles />);
    for (const s of sections) {
      const button = screen.getByRole('button', { name: `Open case file: ${s.label}` });
      expect(button.className).toContain('inset-0');
      expect(button.closest('article')).not.toBeNull();
    }
  });
});
