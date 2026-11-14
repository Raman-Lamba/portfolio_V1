# Front Page Reorder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the intro to the top of the front page, show work before experience, and align the "Open case file" buttons at the bottom of equal-height cards.

**Architecture:** A new `Intro` section (portrait, headline, the existing bio paragraphs in two columns, pull quote, Hire me / Résumé buttons) replaces the old bottom `Editorial` section. `FrontPage` is re-composed in the new order. The nav data and its tests follow the new section list. The case-file cards become flex columns with the button pushed to the bottom.

**Tech Stack:** Next.js 16 (App Router, Cache Components on), Tailwind v4 tokens, `next/image`, Vitest + Testing Library.

New page order: masthead, index box, **intro**, lead story + coupon ad, three stories (+ "See all work" link), wide ad, **case files (archive)**, **bureaus (experience)**, classifieds + letters (two columns), quantum ad, footer.

## Global Constraints
- **Read `site/AGENTS.md` first.** Cache Components is on: no `new Date()` in server components.
- Tokens only (`bg-paper`, `bg-ink`, `text-paper`, `bg-ink/10`, `text-ink`, `border-ink`, `text-accent`, `font-display/body/label/mono`); no hex colours, no new fonts, no new dependency.
- Heading outline: one `h1` (masthead); every page section is an `h2` with an id and `aria-labelledby`; the intro's `h2` is `about.headline`.
- Content comes only from `site/src/content/*`; fixed labels allowed: "Hire me", "Résumé", "See all work in the archive", section headings.
- Decorative glyphs (arrows) are `aria-hidden`. No phone number; UBS only as a result elsewhere (this plan adds no UBS text). No secrets.
- Section ids come from `navItems`; every index link must point at an existing id.
- Commit trailers: end every commit with a `Claude-Session: https://claude.ai/code/session_018QB7mo8gTaSmrUpoNJB9Sc` line and a `Co-Authored-By: Claude <your own model name> <noreply@anthropic.com>` line (the actual author model is accepted).
- Run commands from `C:\Users\DeLL\Desktop\Portfolio\site` unless stated. Work on branch `front-page-reorder` (the controller creates it from `main`).

## File Structure
- Modify: `content/nav.ts`, `content/resume.test.ts` (nav assertion), `components/front-page.tsx` (+ test), `components/case-files-view.tsx`, `components/case-files.test.tsx`.
- Create: `components/intro.tsx` (+ test).
- Delete: `components/editorial.tsx`, `components/editorial.test.tsx`.

---

### Task 1: Intro section (TDD)

**Files:**
- Create: `site/src/components/intro.tsx`, `site/src/components/intro.test.tsx`

**Interfaces:**
- Consumes: `about` (`@/content/about`: `headline`, `paragraphs`, `pullQuote`), `site` (`@/content/site`), `SmartLink`.
- Produces: `Intro()`: `<section id="intro" aria-labelledby="intro-heading">` with the portrait (`Portrait of <name>`), an `h2` `about.headline`, every paragraph, the pull quote in a `blockquote`, and two links: "Hire me" (`#contact`) and "Résumé" (`/resume`). (Nothing else changes in this task: the page still uses the old layout; Task 3 recomposes it.)

- [ ] **Step 1: Write the failing test.**

Create `intro.test.tsx`:
```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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
      expect.stringContaining('raman.jpg'),
    );
    for (const p of about.paragraphs) expect(screen.getByText(p)).toBeInTheDocument();
    expect(screen.getByText(about.pullQuote)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Hire me' })).toHaveAttribute('href', '#contact');
    expect(screen.getByRole('link', { name: 'Résumé' })).toHaveAttribute('href', '/resume');
  });
});
```
Run `npx vitest run src/components/intro.test.tsx`; expected FAIL (module not found).

- [ ] **Step 2: Create `intro.tsx`.**

```tsx
import Image from 'next/image';
import { about } from '@/content/about';
import { site } from '@/content/site';
import { SmartLink } from './smart-link';

const cta =
  'inline-block border-2 border-ink px-4 py-2 font-label text-sm uppercase tracking-widest transition-transform duration-100 active:scale-[0.97]';

export function Intro() {
  return (
    <section id="intro" aria-labelledby="intro-heading" className="mt-6 border-b-2 border-ink pb-6">
      <div className="grid gap-6 md:grid-cols-[10rem_1fr]">
        <Image
          src={site.photo}
          alt={`Portrait of ${site.name}`}
          width={590}
          height={845}
          className="h-auto w-32 border border-ink grayscale contrast-125 md:w-40"
        />
        <div>
          <h2 id="intro-heading" className="font-display text-3xl font-bold italic leading-tight sm:text-4xl">
            {about.headline}
          </h2>
          <div className="mt-3 font-body md:columns-2 md:gap-6">
            {about.paragraphs.map((p) => (
              <p key={p} className="mb-2 break-inside-avoid">
                {p}
              </p>
            ))}
          </div>
          <blockquote className="mt-3 border-l-4 border-accent pl-3 font-display text-lg italic">
            {about.pullQuote}
          </blockquote>
          <div className="mt-4 flex flex-wrap gap-3">
            <SmartLink href="#contact" className={`${cta} bg-ink text-paper`}>
              Hire me
            </SmartLink>
            <SmartLink href="/resume" className={cta}>
              Résumé
            </SmartLink>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Run, expect pass.** `npx vitest run src/components/intro.test.tsx && npm run lint`. Expected: 1 passed, lint clean. (The page does not use `Intro` yet; that is Task 3.)

- [ ] **Step 4: Commit.**

```bash
cd .. && git add site/src/components/intro.tsx site/src/components/intro.test.tsx && git commit -m "feat: add the top-of-page intro section"
```
(append trailers)

---

### Task 2: Align the case-file buttons (TDD)

**Files:**
- Modify: `site/src/components/case-files-view.tsx`, `site/src/components/case-files.test.tsx`

**Interfaces:**
- Produces: each case-file card is a flex column; the "Open case file" button has `mt-auto self-start` so all four buttons sit on the same line at the bottom of equal-height cards.

- [ ] **Step 1: Add the failing test** to the `CaseFiles interaction` describe in `case-files.test.tsx`:

```tsx
  it('pins every open button to the bottom of its card so they line up', () => {
    render(<CaseFiles />);
    for (const s of sections) {
      const button = screen.getByRole('button', { name: `Open case file: ${s.label}` });
      expect(button.className).toContain('mt-auto');
      expect(button.closest('article')!.className).toContain('flex-col');
    }
  });
```
Run `npx vitest run src/components/case-files.test.tsx`; expected FAIL on the new test.

- [ ] **Step 2: Edit `case-files-view.tsx`** with three class changes (nothing else):
  - the card `<article key={f.id} className="border-2 border-ink bg-ink/10 p-4">` becomes `className="flex flex-col border-2 border-ink bg-ink/10 p-4"`;
  - the project list `<ul className="space-y-1 font-body text-sm">` becomes `className="mb-4 space-y-1 font-body text-sm"`;
  - the button's class string: replace `mt-3 border-2 border-ink` with `mt-auto self-start border-2 border-ink` (keep the rest of its classes).

- [ ] **Step 3: Run, expect pass.** `npx vitest run src/components/case-files.test.tsx && npm run lint`. Expected: all case-files tests pass, lint clean.

- [ ] **Step 4: Commit.**

```bash
cd .. && git add site/src/components/case-files-view.tsx site/src/components/case-files.test.tsx && git commit -m "fix: align the open case file buttons at the bottom of the cards"
```
(append trailers)

---

### Task 3: Recompose the front page, update the nav and verify (TDD + visual)

**Files:**
- Modify: `site/src/components/front-page.tsx` (full replacement), `site/src/components/front-page.test.tsx` (full replacement), `site/src/content/nav.ts` (full replacement), `site/src/content/resume.test.ts` (one assertion)
- Delete: `site/src/components/editorial.tsx`, `site/src/components/editorial.test.tsx`

**Interfaces:**
- Consumes: `Intro`, `IndexBox`, `LeadStory`, `StoryCard`, `Ad`, `CaseFiles`, `Bureaus`, `Classifieds`, `Letters`, `Footer`, `getAd`, `getLead`, `getStories`.
- Produces: `FrontPage()` in the new order, with a "See all work in the archive" link (`#files`) under the stories, and the classifieds + letters in two columns; `navItems` in page order (`intro`, `files`, `bureaus`, `classifieds`, `contact`); the old `Editorial` section is gone.

- [ ] **Step 1: Update the tests first.** In `resume.test.ts` change `expect(ids).toEqual(['bureaus', 'files', 'classifieds', 'editorial', 'contact']);` to `expect(ids).toEqual(['intro', 'files', 'bureaus', 'classifieds', 'contact']);`. Then replace `front-page.test.tsx` with:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { FrontPage } from './front-page';
import { about } from '@/content/about';

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

describe('FrontPage', () => {
  it('composes every section and keeps the index links valid', () => {
    render(<FrontPage />);
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Printed in Hyderabad');
    expect(
      screen.getByRole('heading', { level: 2, name: 'Quantum Portfolio Optimization' }),
    ).toBeInTheDocument();
    for (const name of [
      about.headline,
      'More stories',
      'From the archive',
      'From our bureaus',
      'Classifieds',
      'Letters to the Editor',
    ]) {
      expect(screen.getByRole('heading', { level: 2, name })).toBeInTheDocument();
    }
    expect(screen.queryByRole('heading', { level: 2, name: 'Editorial' })).toBeNull();
    expect(screen.getAllByRole('complementary', { name: /^Advertisement: / })).toHaveLength(3);

    const nav = screen.getByRole('navigation', { name: 'Inside today' });
    for (const a of within(nav).getAllByRole('link')) {
      const id = a.getAttribute('href')!.slice(1);
      expect(document.getElementById(id)).not.toBeNull();
    }
    const hrefs = screen.getAllByRole('link').map((a) => a.getAttribute('href'));
    expect(hrefs).toContain('#contact');
    expect(hrefs).toContain('#files');
    expect(hrefs).toContain('/work/qiskit-portfolio-optimization');
  });

  it('puts the intro first, then work, then experience, then contact', () => {
    render(<FrontPage />);
    const order = ['intro', 'files', 'bureaus', 'classifieds', 'contact'].map(
      (id) => document.getElementById(id)!,
    );
    for (let i = 0; i < order.length - 1; i++) {
      expect(order[i].compareDocumentPosition(order[i + 1]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    }
    const lead = screen.getByRole('heading', { level: 2, name: 'Quantum Portfolio Optimization' });
    expect(order[0].compareDocumentPosition(lead) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(lead.compareDocumentPosition(order[1]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('offers a link from the stories to the full archive', () => {
    render(<FrontPage />);
    expect(screen.getByRole('link', { name: /See all work in the archive/ })).toHaveAttribute('href', '#files');
  });
});
```
Run `npx vitest run src/components/front-page.test.tsx src/content/resume.test.ts`; expected FAIL.

- [ ] **Step 2: Replace `nav.ts`.**

```ts
// Section ids shared by the index box and the sections themselves, in page order. Page labels are decorative (A3 is reserved for "Continued on A3").
export const navItems = [
  { id: 'intro', label: 'About', page: 'A2' },
  { id: 'files', label: 'Case files', page: 'A4' },
  { id: 'bureaus', label: 'Bureaus', page: 'A5' },
  { id: 'classifieds', label: 'Classifieds', page: 'B1' },
  { id: 'contact', label: 'Letters', page: 'B2' },
] as const;
```
Delete the old section: `git rm src/components/editorial.tsx src/components/editorial.test.tsx` (replaced by `Intro`; do not leave it unused).

- [ ] **Step 2b: Replace `front-page.tsx`.**

```tsx
import { getAd, getLead, getStories } from '@/content/queries';
import { Ad } from './ad';
import { Bureaus } from './bureaus';
import { CaseFiles } from './case-files';
import { Classifieds } from './classifieds';
import { Footer } from './footer';
import { IndexBox } from './index-box';
import { Intro } from './intro';
import { LeadStory } from './lead-story';
import { Letters } from './letters';
import { StoryCard } from './story-card';

export function FrontPage() {
  const lead = getLead();
  const stories = getStories();
  return (
    <>
      <main id="main" className="mx-auto max-w-6xl px-4 py-6">
        <IndexBox />
        <Intro />
        <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <LeadStory project={lead} />
          <Ad ad={getAd('wanted')} layout="tall" />
        </div>
        <section aria-labelledby="stories-heading" className="mt-6">
          <h2 id="stories-heading" className="sr-only">
            More stories
          </h2>
          <div className="grid divide-y divide-ink border-y-2 border-ink md:grid-cols-3 md:divide-x md:divide-y-0">
            {stories.map((s) => (
              <StoryCard key={s.slug} project={s} />
            ))}
          </div>
          <p className="mt-2 text-right">
            <a
              href="#files"
              className="font-label text-sm font-semibold uppercase tracking-widest text-accent underline underline-offset-4"
            >
              See all work in the archive<span aria-hidden="true"> →</span>
            </a>
          </p>
        </section>
        <div className="mt-6">
          <Ad ad={getAd('backtest')} layout="wide" />
        </div>
        <CaseFiles />
        <Bureaus />
        <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:divide-x lg:divide-ink [&>section]:lg:px-4 [&>section:first-child]:lg:pl-0 [&>section:last-child]:lg:pr-0">
          <Classifieds />
          <Letters />
        </div>
        <div className="mt-8">
          <Ad ad={getAd('quantum')} layout="wide" />
        </div>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Run everything.** `npx vitest run && npm run lint && npm run build`. Expected: all tests pass, lint clean, build succeeds, `/` still static (`○`).

- [ ] **Step 4: Visual check.** Start `npm run start` in the background. With `S=C:/Users/DeLL/AppData/Local/Temp/claude/4aba391c15a3e597/cb0fdf3d-6d28-4b06-a3f3-2b2c90d5b6ec/scratchpad` and Chrome at `/c/Program Files/Google/Chrome/Application/chrome.exe`, screenshot (outside the repo) `http://localhost:3000/` at 1280x4200 (`reorder-desktop.png`) and in a 390px-wide iframe at a tall height (`reorder-mobile.png`; helper HTML in the scratchpad, headless Chrome will not go below about 500px). Read both. Expected desktop: masthead, index box (About, Case files, Bureaus, Classifieds, Letters), then the intro strip (portrait left; headline, two-column bio, pull quote, dark "Hire me" and outlined "Résumé" buttons), then the lead story with the coupon ad, the three stories with "See all work in the archive →" under them, the wide ad, the case files with the four "Open case file" buttons all on one line at the bottom of equal-height cards, the three bureau cards, then classifieds and letters side by side, the quantum ad and the footer. Expected phone: the same order in one column, intro portrait above the text. Stop the server and confirm port 3000 is free.

- [ ] **Step 5: Commit.**

```bash
cd .. && git add -A site/src/components/front-page.tsx site/src/components/front-page.test.tsx site/src/components/editorial.tsx site/src/components/editorial.test.tsx site/src/content/nav.ts site/src/content/resume.test.ts && git commit -m "feat: reorder the front page: intro first, work before experience"
```
(append trailers)

---

## Self-Review
- **Coverage of the request:** intro at the top (Task 1, placed in Task 3), work before experience (case files then bureaus, Task 3), a nudge to the archive ("See all work", Task 3), aligned case-file buttons (Task 2). The editorial section is removed rather than duplicated.
- **Placeholders:** none; all code and exact class edits are given.
- **Type consistency:** `navItems` ids (`intro`, `files`, `bureaus`, `classifieds`, `contact`) match the section ids rendered by `Intro` (`intro`), `CaseFiles` (`files`), `Bureaus` (`bureaus`), `Classifieds` (`classifieds`), `Letters` (`contact`) and the tests in Task 1 and Task 3; the index-box test (unchanged) still finds `#bureaus`, `#contact` and the page label `B1`.
- **Known risks:** every commit stays green (Task 1 only adds `Intro`; Task 3 swaps the nav, deletes `Editorial` and recomposes together); Tailwind arbitrary-variant classes on the two-column wrapper carry over from 2b and are confirmed by the screenshot.
