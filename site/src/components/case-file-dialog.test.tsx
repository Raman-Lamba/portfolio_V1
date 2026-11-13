import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import { CaseFileDialog } from './case-file-dialog';
import { getFolderClippings } from '@/content/queries';

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

beforeAll(() => {
  // jsdom does not implement the modal dialog methods
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.removeAttribute('open');
  });
});

const web = getFolderClippings().find((f) => f.id === 'web')!;

describe('CaseFileDialog', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.style.overflow = '';
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('opens modally with a named heading and one clipping per project', () => {
    render(<CaseFileDialog label={web.label} clippings={web.clippings} onClose={() => {}} />);
    const dialog = screen.getByRole('dialog', { name: 'Case file: Web' });
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
    expect(within(dialog).getByRole('heading', { level: 2, name: 'Case file: Web' })).toBeInTheDocument();
    for (const c of web.clippings) {
      const link = within(dialog).getByRole('link', { name: c.title });
      expect(link).toHaveAttribute('href', `/work/${c.slug}`);
      const item = within(dialog).getByRole('link', { name: c.title }).closest('li')!;
      expect(within(item).getByText(c.credit)).toBeInTheDocument();
    }
    expect(within(dialog).getAllByRole('heading', { level: 3 })).toHaveLength(web.clippings.length);
    const hall = web.clippings.find((c) => c.slug === 'lecture-hall-booking')!;
    expect(within(dialog).getByRole('img', { name: hall.figure!.alt })).toHaveAttribute('src', hall.figure!.src);
  });

  it('focuses the dialog itself on open', () => {
    render(<CaseFileDialog label={web.label} clippings={web.clippings} onClose={() => {}} />);
    expect(screen.getByRole('dialog')).toHaveFocus();
  });

  it('locks page scroll while open and restores it on unmount', () => {
    document.body.style.overflow = 'scroll';
    const { unmount } = render(<CaseFileDialog label={web.label} clippings={web.clippings} onClose={() => {}} />);
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).toBe('scroll');
  });

  it('fades out then calls onClose once from the close button', () => {
    const onClose = vi.fn();
    render(<CaseFileDialog label={web.label} clippings={web.clippings} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: 'Close case file' }));
    expect(onClose).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape (the cancel event) without letting the browser close it first', () => {
    const onClose = vi.fn();
    render(<CaseFileDialog label={web.label} clippings={web.clippings} onClose={onClose} />);
    const dialog = screen.getByRole('dialog');
    const cancel = new Event('cancel', { cancelable: true });
    fireEvent(dialog, cancel);
    expect(cancel.defaultPrevented).toBe(true);
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes when the dialog backdrop area is clicked, but not when a clipping is clicked', () => {
    const onClose = vi.fn();
    render(<CaseFileDialog label={web.label} clippings={web.clippings} onClose={onClose} />);
    const dialog = screen.getByRole('dialog');
    fireEvent.click(within(dialog).getAllByRole('heading', { level: 3 })[0]);
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.click(dialog);
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('blurs the backdrop layer, not the dialog (keeps fixed children fixed)', () => {
    render(<CaseFileDialog label={web.label} clippings={web.clippings} onClose={() => {}} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('backdrop:backdrop-blur-sm');
    expect(dialog.className).not.toMatch(/(^|\s)backdrop-blur-sm/);
  });

  it('returns focus to the opener on unmount', () => {
    const button = document.createElement('button');
    document.body.appendChild(button);
    button.focus();
    const { unmount } = render(<CaseFileDialog label={web.label} clippings={web.clippings} onClose={() => {}} />);
    unmount();
    expect(button).toHaveFocus();
    button.remove();
  });
});
