# Portfolio Phase 3b: Case File Interactions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the "From the archive" folders open like the reference site's folders: click a case file, the page dims to faint paper, and that folder's projects fan out as captioned clippings (with a back pill, Esc, deep link and Back-button support), with the paper grain staying visible over everything.

**Architecture:** The folder section becomes a small client component (`CaseFilesView`) that keeps its server-rendered list of links (so it still works without JavaScript) and adds an "Open case file" button per folder. Opening renders a native `<dialog>` (`CaseFileDialog`) shown with `showModal()`: the browser provides the focus trap, Esc handling, inert background and focus return. Open state lives in the URL hash (`#file-finance`) through a tiny `useSyncExternalStore` hook, so `/` stays statically prerendered. A pure `fanLayout(n)` function computes each clipping's tilt and lift; `motion` animates only the entrance (opacity + translate, short stagger); the exit is a fast CSS opacity fade.

**Tech Stack:** Next.js 16 (App Router, Cache Components on), Tailwind v4 tokens, `motion` (new dependency, React API at `motion/react`), Vitest + Testing Library.

Spec: `docs/superpowers/specs/2026-11-13-portfolio-design.md` (sections 3, 5, 6: focus-and-dim, folders that open, fan-out with captions, back pill). Out of scope: intercepting routes for `/work` (clippings simply link to the project pages), bureaus opening, a clean Qiskit chart, the markets strip and wire (phase 4), polish pass (phase 5).

## Global Constraints
- **Read `site/AGENTS.md` first** and the relevant bundled Next.js 16 docs before writing Next.js code. Cache Components is on: no `new Date()` in server components. Client components must start with `'use client'`.
- **`motion` is the only new dependency.** After installing, confirm the React entry point (`import { motion, useReducedMotion } from 'motion/react'`) by checking `site/node_modules/motion/package.json` `exports`; if the API differs in the installed version, adapt minimally and report.
- Motion rules: animate only `transform` and `opacity`; entrance 260ms with ease-out cubic-bezier `[0.23, 1, 0.32, 1]`, stagger 45ms per clipping, start from `y: 24` and `opacity: 0` (never from scale 0); exit is faster than the entrance: 150ms opacity via a CSS transition; buttons give press feedback with `active:scale-[0.97]` and a 100ms transform transition; respect reduced motion (`useReducedMotion()`: no entrance animation, instant close).
- Native `<dialog>` with `showModal()`; Esc (the `cancel` event) and a click on the dialog's own backdrop area close it; focus returns to the opening button (native behaviour); page scroll is locked while open and restored after.
- Tokens only (`bg-paper`, `bg-paper/95`, `bg-ink/15`, `text-ink`, `border-ink`, `text-accent`, `font-display/body/label/mono`); no hex colours in components, no new fonts. The tilt uses the CSS `rotate` property (Tailwind `rotate-(--r)`) so it never conflicts with motion's `transform`.
- Positioned elements are now allowed (the dialog, the back pill, the tape strips) because the grain overlay gets an explicit high z-index in Task 2.
- Without JavaScript the folder cards still show their project links (the list stays server-rendered); the button is an enhancement.
- Heading outline: the dialog's heading is an `h2` "Case file: <label>"; each clipping title is an `h3` containing the link to `/work/<slug>`.
- No phone number, no UBS description (UBS appears only as a result elsewhere; nothing in this plan touches it), no secrets, no other new dependency.
- Commit trailers: end every commit with a `Claude-Session: https://claude.ai/code/session_018QB7mo8gTaSmrUpoNJB9Sc` line and a `Co-Authored-By: Claude <your own model name> <noreply@anthropic.com>` line (the actual author model is accepted).
- Run commands from `C:\Users\DeLL\Desktop\Portfolio\site` unless stated. Work on branch `phase3b-case-file-interactions` (the controller creates it from `main`).

## File Structure
- Create: `src/lib/fan-layout.ts` (+ test), `src/lib/use-folder-hash.ts` (+ test).
- Modify: `src/content/queries.ts` (+ test), `src/app/globals.css`, `site/package.json` and lockfile, `src/components/case-files.tsx`, `src/components/case-files.test.tsx`.
- Create: `src/components/case-file-dialog.tsx` (+ test), `src/components/case-files-view.tsx` (+ test).

---

### Task 1: Fan layout helper (TDD)

**Files:**
- Create: `site/src/lib/fan-layout.ts`
- Test: `site/src/lib/fan-layout.test.ts`

**Interfaces:**
- Produces: `fanLayout(n: number): { rotate: number; lift: number }[]` of length `n` (empty for `n <= 0`). `rotate` is degrees: `(i - mid) * 3`, rounded to 1 decimal, clamped to ±8, where `mid = (n - 1) / 2`. `lift` is pixels: `round(|i - mid| * 10)`.

- [ ] **Step 1: Write the failing test** `fan-layout.test.ts`

```ts
import { describe, it, expect } from 'vitest';
import { fanLayout } from './fan-layout';

describe('fanLayout', () => {
  it('returns nothing for no items', () => {
    expect(fanLayout(0)).toEqual([]);
  });
  it('keeps a single item level and flat', () => {
    expect(fanLayout(1)).toEqual([{ rotate: 0, lift: 0 }]);
  });
  it('fans three items symmetrically', () => {
    expect(fanLayout(3)).toEqual([
      { rotate: -3, lift: 10 },
      { rotate: 0, lift: 0 },
      { rotate: 3, lift: 10 },
    ]);
  });
  it('fans an even count around the middle', () => {
    expect(fanLayout(4).map((f) => f.rotate)).toEqual([-4.5, -1.5, 1.5, 4.5]);
  });
  it('clamps the tilt at 8 degrees', () => {
    const rotations = fanLayout(7).map((f) => f.rotate);
    expect(rotations[0]).toBe(-8);
    expect(rotations[6]).toBe(8);
    expect(Math.max(...rotations.map(Math.abs))).toBeLessThanOrEqual(8);
  });
});
```

- [ ] **Step 2: Run, expect failure**

Run: `npx vitest run src/lib/fan-layout.test.ts`
Expected: FAIL (module `./fan-layout` not found).

- [ ] **Step 3: Implement** `fan-layout.ts`

```ts
// Tilt (degrees) and lift (pixels) for each clipping in a hand-placed fan.
export function fanLayout(n: number): { rotate: number; lift: number }[] {
  if (n <= 0) return [];
  const mid = (n - 1) / 2;
  return Array.from({ length: n }, (_, i) => {
    const d = i - mid;
    const rotate = Math.max(-8, Math.min(8, Math.round(d * 3 * 10) / 10));
    return { rotate: rotate === 0 ? 0 : rotate, lift: Math.round(Math.abs(d) * 10) };
  });
}
```
(`rotate === 0 ? 0 : rotate` normalises `-0` so the single-item test passes.)

- [ ] **Step 4: Run, expect pass**

Run: `npx vitest run src/lib/fan-layout.test.ts`
Expected: 5 passed.

- [ ] **Step 5: Commit**

```bash
cd .. && git checkout -b phase3b-case-file-interactions 2>/dev/null; git add site/src/lib && git commit -m "feat: add fan layout helper"
```
(append trailers; skip the `checkout -b` if the branch already exists)

---

### Task 2: Install motion and lift the grain overlay

**Files:**
- Modify: `site/package.json`, `site/package-lock.json`, `site/src/app/globals.css`

**Interfaces:**
- Produces: the `motion` package (React API `motion/react`); a `.paper-grain` class that gives any element the same paper grain as the page; the grain overlay now has `z-index: 100`.

- [ ] **Step 1: Install**

Run: `npm install motion`
Then check the entry point exists: `node -e "console.log(Object.keys(require('./node_modules/motion/package.json').exports).join(' '))"` (the output must include `./react`). If not, report what the installed package exposes and stop for guidance.

- [ ] **Step 2: Update `globals.css`.** Replace the existing grain rule (the block starting `body::before {` ... closing `}`) with this one, keeping every other rule unchanged:

```css
/* faint paper grain: on the page, and on any element that opts in (a native <dialog> is in the top layer, so it needs its own) */
body::before,
.paper-grain::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 100;
  pointer-events: none;
  opacity: 0.07;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
}
```
Keep the data-URI exactly as it already is in the file (copy it from the existing rule if it differs from the above).

- [ ] **Step 3: Verify**

Run: `npx vitest run && npm run lint && npm run build`
Expected: all existing tests pass (56), lint clean, build succeeds. `git diff --stat` must show only `package.json`, `package-lock.json` and `globals.css` changed.

- [ ] **Step 4: Commit**

```bash
cd .. && git add site/package.json site/package-lock.json site/src/app/globals.css && git commit -m "feat: add motion and raise the paper grain above positioned elements"
```
(append trailers)

---

### Task 3: Folder clippings query (TDD)

**Files:**
- Modify: `site/src/content/queries.ts`, `site/src/content/queries.test.ts`

**Interfaces:**
- Consumes: `getFolders()` and `getFigures(slug)` (already in `queries.ts`), `ProjectFigure`, `Section` types.
- Produces: `Clipping = { slug: string; title: string; kicker: string; credit: string; figure?: ProjectFigure }`; `FolderClippings = { id: Section; label: string; clippings: Clipping[] }`; `getFolderClippings(): FolderClippings[]` (same folder order as `getFolders()`; `figure` is the project's first figure or `undefined`). All plain serialisable data, so it can be passed from a server component to a client component.

- [ ] **Step 1: Write the failing test.** Add `getFolderClippings` to the imports of `queries.test.ts` and append:

```ts
describe('getFolderClippings', () => {
  it('mirrors the folders and attaches the first figure when there is one', () => {
    const folders = getFolderClippings();
    expect(folders.map((f) => f.id)).toEqual(['finance', 'ml-ai', 'web', 'marketing']);
    const finance = folders[0];
    const qiskit = finance.clippings.find((c) => c.slug === 'qiskit-portfolio-optimization')!;
    expect(qiskit.title).toBe('Quantum Portfolio Optimization');
    expect(qiskit.figure?.src).toBe('/images/projects/qiskit-hardware-runs.png');
    const marketing = folders[3];
    expect(marketing.clippings.map((c) => c.slug)).toEqual(['spotify-campaign']);
    expect(marketing.clippings[0].figure).toBeUndefined();
    const web = folders[2].clippings.find((c) => c.slug === 'lecture-hall-booking')!;
    expect(web.figure?.src).toBe('/images/projects/lecture-hall-booking.png');
  });
  it('gives every clipping a title, kicker and credit', () => {
    for (const f of getFolderClippings()) {
      for (const c of f.clippings) {
        expect(c.title.length).toBeGreaterThan(0);
        expect(c.kicker.length).toBeGreaterThan(0);
        expect(c.credit.length).toBeGreaterThan(0);
      }
    }
  });
});
```

- [ ] **Step 2: Run, expect failure**

Run: `npx vitest run src/content/queries.test.ts`
Expected: FAIL (`getFolderClippings` is not a function).

- [ ] **Step 3: Implement.** In `queries.ts` make sure `Section` and `ProjectFigure` are in the types import (merge into the existing import line), then append:

```ts
export type Clipping = {
  slug: string;
  title: string;
  kicker: string;
  credit: string;
  figure?: ProjectFigure;
};

export type FolderClippings = { id: Section; label: string; clippings: Clipping[] };

export function getFolderClippings(): FolderClippings[] {
  return getFolders().map((f) => ({
    id: f.id,
    label: f.label,
    clippings: f.projects.map((p) => ({
      slug: p.slug,
      title: p.title,
      kicker: p.kicker,
      credit: p.credit,
      figure: getFigures(p.slug)[0],
    })),
  }));
}
```
(`Section` is exported from `./types`; `getFolders` and `getFigures` are defined earlier in the same file.)

- [ ] **Step 4: Run, expect pass**

Run: `npx vitest run src/content`
Expected: all content tests pass.

- [ ] **Step 5: Commit**

```bash
cd .. && git add site/src/content && git commit -m "feat: add folder clippings query"
```
(append trailers)

---

### Task 4: Folder hash hook (TDD)

**Files:**
- Create: `site/src/lib/use-folder-hash.ts`
- Test: `site/src/lib/use-folder-hash.test.tsx`

**Interfaces:**
- Produces: `useFolderHash(ids: readonly string[]): { openId: string | null; open: (id: string) => void; close: () => void }`. `openId` is the id in a `#file-<id>` URL hash when that id is in `ids`, else `null`; it is `null` on the server and on first hydration render. `open(id)` does `history.pushState(null, '', '#file-<id>')` and updates; `close()` calls `history.back()` if this hook pushed the entry, otherwise `history.replaceState` to the path without a hash; both update subscribers. Also reacts to `popstate` and `hashchange`.

- [ ] **Step 1: Write the failing test** `use-folder-hash.test.tsx`

```tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useFolderHash } from './use-folder-hash';

const ids = ['finance', 'ml-ai', 'web', 'marketing'];

describe('useFolderHash', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/');
  });

  it('is closed when there is no hash', () => {
    const { result } = renderHook(() => useFolderHash(ids));
    expect(result.current.openId).toBeNull();
  });

  it('opens from a deep link and ignores unknown ids', () => {
    window.history.replaceState(null, '', '/#file-web');
    const a = renderHook(() => useFolderHash(ids));
    expect(a.result.current.openId).toBe('web');
    window.history.replaceState(null, '', '/#file-nope');
    const b = renderHook(() => useFolderHash(ids));
    expect(b.result.current.openId).toBeNull();
  });

  it('open() pushes the hash and close() goes back', async () => {
    const { result } = renderHook(() => useFolderHash(ids));
    act(() => result.current.open('finance'));
    expect(window.location.hash).toBe('#file-finance');
    expect(result.current.openId).toBe('finance');
    act(() => result.current.close());
    await waitFor(() => expect(result.current.openId).toBeNull());
    expect(window.location.hash).toBe('');
  });

  it('close() clears a deep-linked hash without going back', () => {
    window.history.replaceState(null, '', '/#file-ml-ai');
    const { result } = renderHook(() => useFolderHash(ids));
    expect(result.current.openId).toBe('ml-ai');
    act(() => result.current.close());
    expect(result.current.openId).toBeNull();
    expect(window.location.hash).toBe('');
  });
});
```

- [ ] **Step 2: Run, expect failure**

Run: `npx vitest run src/lib/use-folder-hash.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement** `use-folder-hash.ts`

```ts
'use client';
import { useCallback, useRef, useSyncExternalStore } from 'react';

const PREFIX = '#file-';
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener('popstate', cb);
  window.addEventListener('hashchange', cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener('popstate', cb);
    window.removeEventListener('hashchange', cb);
  };
}

const getSnapshot = () => window.location.hash;
const getServerSnapshot = () => '';

// Which case file is open, kept in the URL hash so Back closes it and links can deep-link to it.
export function useFolderHash(ids: readonly string[]) {
  const hash = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const candidate = hash.startsWith(PREFIX) ? hash.slice(PREFIX.length) : null;
  const openId = candidate !== null && ids.includes(candidate) ? candidate : null;
  const pushed = useRef(false);

  const open = useCallback((id: string) => {
    window.history.pushState(null, '', `${PREFIX}${id}`);
    pushed.current = true;
    emit();
  }, []);

  const close = useCallback(() => {
    if (pushed.current) {
      pushed.current = false;
      window.history.back();
      return;
    }
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
    emit();
  }, []);

  return { openId, open, close };
}
```

- [ ] **Step 4: Run, expect pass**

Run: `npx vitest run src/lib/use-folder-hash.test.tsx && npm run lint`
Expected: 4 passed, lint clean. If the `history.back()` test is flaky because jsdom traverses history asynchronously, keep `waitFor` and report what you observed.

- [ ] **Step 5: Commit**

```bash
cd .. && git add site/src/lib && git commit -m "feat: add folder hash hook"
```
(append trailers)

---

### Task 5: The case file dialog (TDD)

**Files:**
- Create: `site/src/components/case-file-dialog.tsx`
- Test: `site/src/components/case-file-dialog.test.tsx`

**Interfaces:**
- Consumes: `Clipping` type (`@/content/queries`, type import only), `fanLayout` (`@/lib/fan-layout`), `SmartLink`, `motion`/`useReducedMotion` (`motion/react`), `next/image`.
- Produces: `CaseFileDialog({ label: string; clippings: Clipping[]; onClose: () => void })`: a native `<dialog>` named by its `h2` "Case file: <label>", shown with `showModal()` on mount; one `li` per clipping with an `h3` link to `/work/<slug>`, the kicker, the credit and (when present) the figure as an image; a "Close case file" button. Closing (button, Esc `cancel` event, or a click on the dialog itself) fades out for 150ms (0 with reduced motion) and then calls `onClose` once.

- [ ] **Step 1: Write the failing test** `case-file-dialog.test.tsx`

```tsx
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
      expect(within(dialog).getByText(c.credit)).toBeInTheDocument();
    }
    expect(within(dialog).getAllByRole('heading', { level: 3 })).toHaveLength(web.clippings.length);
    const hall = web.clippings.find((c) => c.slug === 'lecture-hall-booking')!;
    expect(within(dialog).getByRole('img', { name: hall.figure!.alt })).toHaveAttribute('src', hall.figure!.src);
  });

  it('locks page scroll while open and restores it on unmount', () => {
    const { unmount } = render(<CaseFileDialog label={web.label} clippings={web.clippings} onClose={() => {}} />);
    expect(document.body.style.overflow).toBe('hidden');
    unmount();
    expect(document.body.style.overflow).toBe('');
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
});
```

- [ ] **Step 2: Run, expect failure**

Run: `npx vitest run src/components/case-file-dialog.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement** `case-file-dialog.tsx`

```tsx
'use client';
import { useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import type { Clipping } from '@/content/queries';
import { fanLayout } from '@/lib/fan-layout';
import { SmartLink } from './smart-link';

type Props = { label: string; clippings: Clipping[]; onClose: () => void };

export function CaseFileDialog({ label, clippings, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const reduce = useReducedMotion();
  const [closing, setClosing] = useState(false);
  const fan = fanLayout(clippings.length);

  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
      dialog?.close();
    };
  }, []);

  useEffect(() => {
    if (!closing) return;
    const t = window.setTimeout(onClose, reduce ? 0 : 150);
    return () => window.clearTimeout(t);
  }, [closing, onClose, reduce]);

  const requestClose = () => setClosing(true);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        requestClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) requestClose();
      }}
      className={`paper-grain fixed inset-0 m-0 h-dvh max-h-none w-dvw max-w-none overflow-y-auto border-0 bg-paper/95 p-0 text-ink transition-opacity duration-150 ${closing ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-10">
        <h2
          id={titleId}
          className="border-b-2 border-ink pb-1 font-label text-sm font-semibold uppercase tracking-[0.3em]"
        >
          Case file: {label}
        </h2>
        <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {clippings.map((c, i) => (
            <motion.li
              key={c.slug}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.26, ease: [0.23, 1, 0.32, 1], delay: i * 0.045 }}
              style={{ '--r': `${fan[i].rotate}deg`, '--lift': `${fan[i].lift}px` } as React.CSSProperties}
              className="relative border-2 border-ink bg-paper p-3 md:mt-(--lift) md:rotate-(--r)"
            >
              <span aria-hidden="true" className="absolute -top-2 left-1/2 h-4 w-16 -translate-x-1/2 bg-ink/15" />
              {c.figure && (
                <Image
                  src={c.figure.src}
                  alt={c.figure.alt}
                  width={c.figure.width}
                  height={c.figure.height}
                  sizes="(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw"
                  className="h-40 w-full border border-ink object-cover object-top"
                />
              )}
              <p className="mt-2 font-label text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                {c.kicker}
              </p>
              <h3 className="font-display text-xl font-bold leading-tight">
                <SmartLink href={`/work/${c.slug}`} className="hover:underline">
                  {c.title}
                </SmartLink>
              </h3>
              <p className="mt-1 font-body text-sm italic">{c.credit}</p>
            </motion.li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        onClick={requestClose}
        className="fixed bottom-4 right-4 border-2 border-ink bg-paper px-4 py-2 font-label text-sm uppercase tracking-widest transition-transform duration-100 active:scale-[0.97]"
      >
        <span aria-hidden="true">← </span>Close case file
      </button>
    </dialog>
  );
}
```

- [ ] **Step 4: Run, expect pass**

Run: `npx vitest run src/components/case-file-dialog.test.tsx && npm run lint`
Expected: 5 passed, lint clean. The button's accessible name is "Close case file" (the arrow is `aria-hidden`). If `motion`'s `useReducedMotion` throws in jsdom because `window.matchMedia` is missing, add a `matchMedia` stub (`window.matchMedia = vi.fn().mockReturnValue({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} })`) in this test's `beforeAll` only, and report it.

- [ ] **Step 5: Commit**

```bash
cd .. && git add site/src/components && git commit -m "feat: add case file dialog with fanned clippings"
```
(append trailers)

---

### Task 6: Wire the folders to the dialog (TDD)

**Files:**
- Create: `site/src/components/case-files-view.tsx`
- Modify: `site/src/components/case-files.tsx` (full replacement), `site/src/components/case-files.test.tsx` (extend)

**Interfaces:**
- Consumes: `getFolderClippings()`, `FolderClippings` (`@/content/queries`), `useFolderHash`, `CaseFileDialog`, `SmartLink`.
- Produces: `CaseFilesView({ folders: FolderClippings[] })` (client): the "From the archive" section, one card per folder with its project links and an "Open case file" button (accessible name `Open case file: <label>`, `aria-haspopup="dialog"`), the dialog when `openId` matches; `CaseFiles()` (server) stays the exported entry and passes `getFolderClippings()` to the view. Section id `files` and heading text are unchanged.

- [ ] **Step 1: Extend the test first** (`case-files.test.tsx`). Keep the existing test unchanged, and add the following imports and tests (merge imports with the existing ones; the existing file already imports `render`, `screen`, `CaseFiles`, `projects` and `sections`):

```tsx
import { vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { fireEvent, within, act } from '@testing-library/react';

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

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
});
```
Note: with fake timers `vi.waitFor` needs real timers; if the last test case hangs, switch that one test to `vi.useRealTimers()` before the `waitFor` (and say so in the report). Run: `npx vitest run src/components/case-files.test.tsx`; expected FAIL (no buttons yet).

- [ ] **Step 2: Create `case-files-view.tsx`**

```tsx
'use client';
import { useMemo } from 'react';
import type { FolderClippings } from '@/content/queries';
import { useFolderHash } from '@/lib/use-folder-hash';
import { CaseFileDialog } from './case-file-dialog';
import { SmartLink } from './smart-link';

export function CaseFilesView({ folders }: { folders: FolderClippings[] }) {
  const ids = useMemo(() => folders.map((f) => f.id), [folders]);
  const { openId, open, close } = useFolderHash(ids);
  const openFolder = folders.find((f) => f.id === openId);

  return (
    <section id="files" aria-labelledby="files-heading" className="mt-8">
      <h2
        id="files-heading"
        className="border-b-2 border-ink pb-1 font-label text-sm font-semibold uppercase tracking-[0.3em]"
      >
        From the archive
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {folders.map((f) => (
          <article key={f.id} className="border-2 border-ink bg-ink/10 p-4">
            <h3 className="mb-3 inline-block border-b-2 border-ink pb-0.5 font-label text-xs font-semibold uppercase tracking-widest">
              Case file: {f.label}
            </h3>
            <ul className="space-y-1 font-body text-sm">
              {f.clippings.map((c) => (
                <li key={c.slug}>
                  <SmartLink href={`/work/${c.slug}`} className="hover:underline">
                    {c.title}
                  </SmartLink>
                </li>
              ))}
            </ul>
            <button
              type="button"
              aria-haspopup="dialog"
              onClick={() => open(f.id)}
              className="mt-3 border-2 border-ink px-3 py-1 font-label text-xs uppercase tracking-widest transition-transform duration-100 active:scale-[0.97]"
            >
              Open case file<span className="sr-only">: {f.label}</span>
            </button>
          </article>
        ))}
      </div>
      {openFolder && (
        <CaseFileDialog
          key={openFolder.id}
          label={openFolder.label}
          clippings={openFolder.clippings}
          onClose={close}
        />
      )}
    </section>
  );
}
```

- [ ] **Step 3: Replace `case-files.tsx`** (server component, keeps its name and export):

```tsx
import { getFolderClippings } from '@/content/queries';
import { CaseFilesView } from './case-files-view';

export function CaseFiles() {
  return <CaseFilesView folders={getFolderClippings()} />;
}
```

- [ ] **Step 4: Run, expect pass**

Run: `npx vitest run && npm run lint && npm run build`
Expected: the whole suite passes (the original case-files test, the three new ones, and everything else), lint clean, build succeeds, and `/` is still listed as static (`○`). If the build complains about `useSyncExternalStore` or the hash under Cache Components, report the exact message.

- [ ] **Step 5: Commit**

```bash
cd .. && git add site/src && git commit -m "feat: open case files into a dialog of fanned clippings"
```
(append trailers)

---

### Task 7: Verify in a real browser

**Files:** none changed unless a check fails.

- [ ] **Step 1: Build and serve**

Run `npm run build` then start `npm run start` in the background; confirm `/` returns 200.

- [ ] **Step 2: Screenshot the open states.** A deep link opens the dialog on load, so plain headless screenshots work. With `S=C:/Users/DeLL/AppData/Local/Temp/claude/4aba391c15a3e597/cb0fdf3d-6d28-4b06-a3f3-2b2c90d5b6ec/scratchpad` and Chrome at `/c/Program Files/Google/Chrome/Application/chrome.exe`, take (outside the repo, `--virtual-time-budget=5000` so the entrance animation finishes):
  - `http://localhost:3000/` at 1280x2600 (closed state: folders have an "Open case file" button),
  - `http://localhost:3000/#file-finance` at 1280x900,
  - `http://localhost:3000/#file-web` at 1280x900 (has real screenshots as thumbnails),
  - `http://localhost:3000/#file-finance` at about 500 wide, tall (single column; headless Chrome will not go below about 500px).
  Read each image. Expected for the open states: the page behind is faded to a pale paper tone, a "Case file: ..." heading, clippings with tape strips and slight tilts and a staggered vertical offset on desktop (flat and single-column on narrow), thumbnails for projects that have figures, a "← Close case file" pill at the bottom right, and the paper grain visible over the dialog. Closed state: unchanged apart from the new buttons.
- [ ] **Step 3: Check links and status.** `curl -s -o /dev/null -w '%{http_code}'` for `/`, `/#file-finance` (the server ignores the hash: 200), `/work/lecture-hall-booking` (200). Stop the server; confirm port 3000 is free.
- [ ] **Step 4: Report** what each screenshot showed. If a clipping overlaps its neighbours badly, a tilt is too strong, the dim is not visible, or the grain is missing over the dialog, fix minimally (tilt constants in `fan-layout.ts`, `bg-paper/95` opacity, or the `paper-grain` class) and re-run tests, lint and build before committing the fix:

```bash
cd .. && git add site/src && git commit -m "fix: tune case file dialog after browser check"
```
(append trailers; skip if no fix was needed)

---

## Self-Review
- **Spec coverage (3b):** folders that open with focus-and-dim (full-viewport paper-tinted dialog), fan-out of captioned clippings with slight tilts and offsets (`fanLayout`), thumbnails from the real screenshots, a bottom-right back pill, keyboard support (Esc, focus trap and focus return from the native dialog), URL deep links and Back-button behaviour via the hash, reduced-motion respect, grain stacking fixed. Not here by design: intercepting routes for `/work`, bureaus opening, the stipple portrait, the clean Qiskit chart, phase 4 feeds, a polish pass.
- **Placeholders:** none; every step has complete code and commands. Two spots tell the implementer exactly what to do if the environment disagrees (jsdom `matchMedia`, `history.back()` timing).
- **Type consistency:** `Clipping`/`FolderClippings` are defined in `queries.ts` (Task 3) and used by `CaseFileDialog` (Task 5, type import) and `CaseFilesView` (Task 6); `fanLayout` returns `{ rotate, lift }[]` consumed as `fan[i].rotate` / `fan[i].lift`; `useFolderHash` returns `{ openId, open, close }` consumed in Task 6; `Close case file` and `Open case file: <label>` names match between components and tests; `sections` labels (`Finance`, `Web`) match the `getFolders` labels.
- **Known risks:** `motion`'s React API name and jsdom support are checked in Tasks 2 and 5; `history.back()` is asynchronous in jsdom (Task 4 uses `waitFor`); Tailwind v4's `rotate-(--r)` and `mt-(--lift)` syntax is confirmed by the browser check in Task 7; the dialog is in the browser's top layer, so it carries its own `paper-grain` pseudo-element instead of relying on the body's.
