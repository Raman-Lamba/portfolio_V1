# Portfolio Phase 2b: Front Page Lower Sections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish the static front page: accessibility fixes carried over from 2a, an index box (navigation), bureaus, case files (closed folders), classifieds (résumé), editorial (about), letters (contact), the third ad and a footer, all in one composed page that works on phones.

**Architecture:** Same pattern as 2a: small server components in `site/src/components/`, fed by typed data in `site/src/content/` plus two query helpers. Section ids come from one `nav` data file so the index box and the sections cannot drift apart. `FrontPage` composes everything; the footer sits outside `<main>`.

**Tech Stack:** Next.js 16 (App Router), Tailwind v4 tokens, `next/image` for the portrait, Vitest + Testing Library.

Spec: `docs/superpowers/specs/2026-11-13-portfolio-design.md` (sections 4-7). Not in this plan: opening folders, fan-out, `/work/[slug]`, `/resume` page and real images (phase 3); markets strip and wire (phase 4).

## Global Constraints
- **Read `site/AGENTS.md` first** and the relevant guide in `site/node_modules/next/dist/docs/` before writing Next.js code (Next.js 16, Cache Components on: no `new Date()` in server components).
- Tokens only: `bg-paper`, `bg-ink/10`-style opacity of tokens, `text-ink`, `border-ink`, `text-accent`, `font-display`, `font-body`, `font-label`, `font-mono`. No hex colours in components, no new fonts.
- Heading outline: `h1` masthead; every page section is an `h2` with an id and `aria-labelledby`; items inside are `h3`. Ads stay `aside` landmarks labelled "Advertisement".
- Do not position elements (`relative`, `absolute`, `sticky`, `fixed`) except the skip link while focused: the paper-grain overlay is `position: fixed` with no z-index and positioned elements would paint above it.
- Content comes only from `site/src/content/*`; fixed labels allowed: section headings, "Inside today", "Case file:", "Advertisement", "Continued on A3", "Printed in".
- UBS appears only as a result: the classifieds build their honours line from the existing `awards` data; no new text describing the competition. No phone number anywhere. No new dependency. Secrets never committed.
- `#contact` must exist (the coupon ad links to it); every index link must point at an existing id.
- Contact is a `mailto:` link plus LinkedIn and GitHub: a form is intentionally deferred (it needs a backend).
- The bio in `about.ts` is a draft written from known facts for the owner to review before launch.
- Commit trailers: end every commit with the `Claude-Session: https://claude.ai/code/session_018QB7mo8gTaSmrUpoNJB9Sc` line and a `Co-Authored-By: Claude <your own model name> <noreply@anthropic.com>` line (the actual author model is accepted).
- Run commands from `C:\Users\DeLL\Desktop\Portfolio\site` unless stated. Work on branch `phase2b-front-page-lower` created from `main` (the controller creates it).

## File Structure
- Modify: `components/ad.tsx`, `lead-story.tsx`, `numbers-box.tsx`, `halftone-plate.tsx`, `masthead.tsx`, `front-page.tsx`, `app/layout.tsx` (+ their tests).
- Create: `content/nav.ts`, `content/resume.ts`, `content/about.ts`, `content/resume.test.ts`; modify `content/queries.ts` (+ test).
- Create components: `skip-link.tsx`, `index-box.tsx`, `bureaus.tsx`, `case-files.tsx`, `classifieds.tsx`, `editorial.tsx`, `letters.tsx`, `footer.tsx` (+ one test each).

---

### Task 1: Carry-over accessibility and polish fixes

**Files:**
- Modify: `site/src/components/ad.tsx`, `lead-story.tsx`, `numbers-box.tsx`, `halftone-plate.tsx`, `masthead.tsx`, `site/src/app/layout.tsx`
- Modify tests: `site/src/components/ad.test.tsx`, `lead-story.test.tsx`
- Create: `site/src/components/skip-link.tsx`, `skip-link.test.tsx`

**Interfaces:**
- Produces: `SkipLink()` (anchor to `#main`, visible only when focused). Link accessible names: ad links are `"<cta>: <headline>"`, the lead link is `"Continued on A3: <title>"`.

- [ ] **Step 1: Update the tests first** (they should fail)

In `ad.test.tsx`, replace the two link lookups so they use the full accessible names:
```tsx
const link = screen.getByRole('link', { name: 'Clip the coupon: WANTED: a developer who reads balance sheets' });
```
and
```tsx
const link = screen.getByRole('link', { name: 'Read the story: Backtest before you bet' });
```
(keep the `href` and ✂ assertions as they are).

In `lead-story.test.tsx`, replace the continued-link lookup with:
```tsx
expect(screen.getByRole('link', { name: `Continued on A3: ${lead.title}` })).toHaveAttribute(
  'href',
  `/work/${lead.slug}`,
);
```
Create `skip-link.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SkipLink } from './skip-link';

describe('SkipLink', () => {
  it('links to the main content', () => {
    render(<SkipLink />);
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main');
  });
});
```

- [ ] **Step 2: Run, expect failures**

Run: `npx vitest run src/components`
Expected: FAIL (ad and lead-story name lookups; skip-link module missing).

- [ ] **Step 3: Fix `ad.tsx`** (replace the `SmartLink` block)

```tsx
      <SmartLink
        href={ad.href}
        className="font-label text-sm font-semibold uppercase tracking-widest text-accent underline underline-offset-4"
      >
        <span aria-hidden="true">{coupon ? '✂ ' : ''}</span>
        {ad.cta}
        <span className="sr-only">: {ad.headline}</span>
        <span aria-hidden="true"> →</span>
      </SmartLink>
```

- [ ] **Step 4: Fix `lead-story.tsx`** (replace the `SmartLink` block)

```tsx
      <SmartLink
        href={`/work/${project.slug}`}
        className="mt-4 inline-block font-label text-sm font-semibold uppercase tracking-widest text-accent underline underline-offset-4"
      >
        Continued on A3
        <span className="sr-only">: {project.title}</span>
        <span aria-hidden="true"> →</span>
      </SmartLink>
```

- [ ] **Step 5: Fix `numbers-box.tsx`**: change the wrapper `<section aria-label="By the numbers" className=...>` and its closing tag to `<div className=...>` / `</div>` (same classes). The `h3` "By the numbers" stays.

- [ ] **Step 6: Fix `halftone-plate.tsx`** to use tokens instead of hex values. Replace the plate `div` with:
```tsx
      <div
        aria-hidden="true"
        className="h-48 w-full border border-ink bg-ink/15 text-ink sm:h-64"
        style={{
          backgroundImage:
            'radial-gradient(circle, currentColor 22%, transparent 24%), radial-gradient(circle, currentColor 10%, transparent 12%)',
          backgroundSize: '9px 9px, 4px 4px',
        }}
      />
```

- [ ] **Step 7: Fix `masthead.tsx`** so the ears stack on narrow phones. Change the ears container class from `flex justify-between gap-4 font-label text-xs uppercase tracking-[0.18em]` to `flex flex-col gap-2 font-label text-xs uppercase tracking-[0.18em] sm:flex-row sm:justify-between sm:gap-4`, and the right ear `<p className="text-right">` to `<p className="sm:text-right">`.

- [ ] **Step 8: Create `skip-link.tsx`**

```tsx
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:bg-paper focus:p-2 focus:font-label focus:text-sm focus:uppercase focus:tracking-widest"
    >
      Skip to content
    </a>
  );
}
```
In `layout.tsx`, import it (`import { SkipLink } from '@/components/skip-link';`) and render `<SkipLink />` as the first child of `<body>`.

- [ ] **Step 9: Run everything, expect pass**

Run: `npx vitest run && npm run lint`
Expected: all tests pass, lint clean.

- [ ] **Step 10: Commit**

```bash
cd .. && git checkout -b phase2b-front-page-lower 2>/dev/null; git add site/src && git commit -m "fix: accessible link names, tokenised halftone, stacked masthead ears, skip link"
```
(append trailers; skip the `checkout -b` if the branch already exists)

---

### Task 2: Content: nav, résumé classifieds, about, folders query (TDD)

**Files:**
- Create: `site/src/content/nav.ts`, `site/src/content/resume.ts`, `site/src/content/about.ts`
- Modify: `site/src/content/queries.ts`
- Test: `site/src/content/resume.test.ts`; modify `site/src/content/queries.test.ts`

**Interfaces:**
- Produces: `navItems` (readonly array of `{ id, label, page }`, ids `bureaus`, `files`, `classifieds`, `editorial`, `contact`); `Classified = { id; heading; lead; body }` and `classifieds: Classified[]` (ids `wanted`, `skills`, `finance`, `honours`); `about = { headline; paragraphs: string[]; pullQuote }`; `getFolders(): { id: Section; label: string; projects: Project[] }[]` (in `sections` order, cross-listed projects appear in each folder they declare).

- [ ] **Step 1: Write failing tests**

Append to `queries.test.ts` (and add `import { projects } from './projects';` and `getFolders` to the imports):
```ts
describe('getFolders', () => {
  it('groups projects into four case files, honouring cross-listing', () => {
    const folders = getFolders();
    expect(folders.map((f) => f.id)).toEqual(['finance', 'ml-ai', 'web', 'marketing']);
    const gold = projects.find((p) => p.slug === 'gold-price-forecasting')!;
    expect(folders.filter((f) => f.projects.includes(gold)).map((f) => f.id)).toEqual(['finance', 'ml-ai']);
    for (const f of folders) expect(f.projects.length).toBeGreaterThan(0);
  });
});
```
Create `resume.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { classifieds } from './resume';
import { about } from './about';
import { navItems } from './nav';

describe('résumé, about and nav content', () => {
  it('has the four classifieds', () => {
    expect(classifieds.map((c) => c.id)).toEqual(['wanted', 'skills', 'finance', 'honours']);
    for (const c of classifieds) {
      expect(c.lead.length).toBeGreaterThan(0);
      expect(c.body.length).toBeGreaterThan(0);
    }
  });
  it('builds the honours line from the awards data, result only', () => {
    const honours = classifieds.find((c) => c.id === 'honours')!;
    expect(honours.body).toContain('First place, UBS Financial Challenge (Team Cygnus).');
    expect(honours.body).toContain('Winner, Qiskit Fall Fest 2026 (IIIT-Delhi) (Solo entry).');
  });
  it('has no phone number and mentions UBS exactly once', () => {
    const all = JSON.stringify({ classifieds, about });
    expect(all).not.toMatch(/\d{10}/);
    expect(all.match(/UBS/g)).toHaveLength(1);
  });
  it('has an about headline, paragraphs and pull quote', () => {
    expect(about.headline.length).toBeGreaterThan(0);
    expect(about.paragraphs.length).toBeGreaterThanOrEqual(2);
    expect(about.pullQuote.length).toBeGreaterThan(0);
  });
  it('has unique nav ids', () => {
    const ids = navItems.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(['bureaus', 'files', 'classifieds', 'editorial', 'contact']);
  });
});
```

- [ ] **Step 2: Run, expect failure**

Run: `npx vitest run src/content`
Expected: FAIL (modules and `getFolders` missing).

- [ ] **Step 3: Create `nav.ts`**

```ts
// Section ids shared by the index box and the sections themselves. Page labels are decorative.
export const navItems = [
  { id: 'bureaus', label: 'Bureaus', page: 'A4' },
  { id: 'files', label: 'Case files', page: 'A5' },
  { id: 'classifieds', label: 'Classifieds', page: 'B1' },
  { id: 'editorial', label: 'Editorial', page: 'B2' },
  { id: 'contact', label: 'Letters', page: 'B3' },
] as const;
```

- [ ] **Step 4: Create `resume.ts`**

```ts
import { awards } from './awards';

export type Classified = { id: string; heading: string; lead: string; body: string };

// Built from the awards data so the competition result is stated once, as a result only.
const honours = awards
  .filter((a) => a.id !== 'cfa')
  .map((a) => `${a.title} (${a.credit}).`)
  .join(' ');

export const classifieds: Classified[] = [
  {
    id: 'wanted',
    heading: 'Situations Wanted',
    lead: 'FINTECH ENGINEER.',
    body: 'MBA (Finance), IMT Hyderabad, GPA 9.14; B.Tech Computer Science. Builds models, simulators and data tools. Private credit, valuation, ML. Open to freelance and full-time roles.',
  },
  {
    id: 'skills',
    heading: 'Skills for Hire',
    lead: 'CODE & DATA.',
    body: 'Python, SQL, TypeScript/Next.js, C++, PyTorch, scikit-learn, Qiskit, RAG (Pinecone, ChromaDB), Supabase.',
  },
  {
    id: 'finance',
    heading: 'Skills for Hire',
    lead: 'FINANCE.',
    body: 'DCF, DDM, relative valuation, financial modelling, private credit, covenant monitoring. Excel, Power BI, Tableau.',
  },
  { id: 'honours', heading: 'Notices', lead: 'WINNERS.', body: honours },
];
```

- [ ] **Step 5: Create `about.ts`** (draft for owner review)

```ts
export const about = {
  headline: 'I read balance sheets and write code',
  paragraphs: [
    'I am an MBA (Finance) student at IMT Hyderabad with a computer science degree behind me, so I can read a balance sheet and ship the software that works on it.',
    'My projects range from probabilistic gold forecasts and an options-strategy simulator to a quantum portfolio optimiser that won Qiskit Fall Fest 2026. This summer I worked on private credit deals at Oxane Partners; before business school I helped students with data structures and algorithms at Coding Blocks.',
    'I am open to freelance projects and full-time roles in fintech.',
  ],
  pullQuote: 'Finance and code, in one pair of hands.',
};
```

- [ ] **Step 6: Add `getFolders` to `queries.ts`** (add `sections` to the types import: `import { sections, type Ad, type Project } from './types';`, replacing the existing type import) and append:
```ts
export function getFolders() {
  return sections.map((s) => ({ ...s, projects: projects.filter((p) => p.sections.includes(s.id)) }));
}
```

- [ ] **Step 7: Run, expect pass**

Run: `npx vitest run src/content`
Expected: all content tests pass (phase 1's 10, queries 4, résumé 5).

- [ ] **Step 8: Commit**

```bash
cd .. && git add site/src/content && git commit -m "feat: add nav, classifieds, about content and folders query"
```
(append trailers)

---

### Task 3: Index box (TDD)

**Files:**
- Create: `site/src/components/index-box.tsx`
- Test: `site/src/components/index-box.test.tsx`

**Interfaces:**
- Consumes: `navItems` (`@/content/nav`).
- Produces: `IndexBox()` rendering `<nav aria-label="Inside today">` with one in-page link per nav item (`href="#<id>"`).

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { IndexBox } from './index-box';
import { navItems } from '@/content/nav';

describe('IndexBox', () => {
  it('links to every section with its page label', () => {
    render(<IndexBox />);
    const nav = screen.getByRole('navigation', { name: 'Inside today' });
    const links = within(nav).getAllByRole('link');
    expect(links).toHaveLength(navItems.length);
    expect(within(nav).getByRole('link', { name: /Bureaus/ })).toHaveAttribute('href', '#bureaus');
    expect(within(nav).getByRole('link', { name: /Letters/ })).toHaveAttribute('href', '#contact');
    expect(nav).toHaveTextContent('B1');
  });
});
```

- [ ] **Step 2: Run, expect failure**

Run: `npx vitest run src/components/index-box.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement**

```tsx
import { navItems } from '@/content/nav';

export function IndexBox() {
  return (
    <nav aria-label="Inside today" className="border-2 border-ink p-3">
      <p className="font-label text-xs font-semibold uppercase tracking-[0.3em]">Inside today</p>
      <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-1 font-label text-sm uppercase tracking-widest">
        {navItems.map((n) => (
          <li key={n.id}>
            <a href={`#${n.id}`} className="hover:underline">
              {n.label} <span className="font-mono text-xs">{n.page}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

- [ ] **Step 4: Run, expect pass**

Run: `npx vitest run src/components/index-box.test.tsx`
Expected: 1 passed.

- [ ] **Step 5: Commit**

```bash
cd .. && git add site/src/components && git commit -m "feat: add index box navigation"
```
(append trailers)

---

### Task 4: Bureaus and case files (TDD)

**Files:**
- Create: `site/src/components/bureaus.tsx`, `site/src/components/case-files.tsx`
- Test: `site/src/components/bureaus.test.tsx`, `site/src/components/case-files.test.tsx`

**Interfaces:**
- Consumes: `bureaus` (`@/content/bureaus`), `getFolders()` (`@/content/queries`), `projects` (`@/content/projects`), `SmartLink` (`./smart-link`).
- Produces: `Bureaus()` (`<section id="bureaus">`, `h2` "From our bureaus", an `article` + `h3` per bureau); `CaseFiles()` (`<section id="files">`, `h2` "From the archive", one `article` per folder with `h3` "Case file: <label>" and a list of links to `/work/<slug>`).

- [ ] **Step 1: Write the failing tests**

`bureaus.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Bureaus } from './bureaus';
import { bureaus } from '@/content/bureaus';

describe('Bureaus', () => {
  it('shows one card per internship under a section heading', () => {
    render(<Bureaus />);
    expect(screen.getByRole('heading', { level: 2, name: 'From our bureaus' })).toBeInTheDocument();
    for (const b of bureaus) {
      expect(screen.getByRole('heading', { level: 3, name: b.org })).toBeInTheDocument();
      expect(screen.getByText(b.role)).toBeInTheDocument();
      expect(screen.getByText(b.summary)).toBeInTheDocument();
      expect(screen.getByText(b.dates)).toBeInTheDocument();
    }
  });
});
```
`case-files.test.tsx`:
```tsx
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
```

- [ ] **Step 2: Run, expect failure**

Run: `npx vitest run src/components/bureaus.test.tsx src/components/case-files.test.tsx`
Expected: FAIL (modules not found).

- [ ] **Step 3: Implement `bureaus.tsx`**

```tsx
import { bureaus } from '@/content/bureaus';

export function Bureaus() {
  return (
    <section id="bureaus" aria-labelledby="bureaus-heading" className="mt-8">
      <h2
        id="bureaus-heading"
        className="border-b-2 border-ink pb-1 font-label text-sm font-semibold uppercase tracking-[0.3em]"
      >
        From our bureaus
      </h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {bureaus.map((b) => (
          <article key={b.id} className="border border-ink p-4">
            <p className="font-label text-xs uppercase tracking-[0.25em] text-accent">{b.dates}</p>
            <h3 className="mt-1 font-display text-xl font-bold">{b.org}</h3>
            <p className="font-body text-sm italic">{b.role}</p>
            <p className="mt-2 font-body">{b.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Implement `case-files.tsx`**

```tsx
import { getFolders } from '@/content/queries';
import { SmartLink } from './smart-link';

export function CaseFiles() {
  return (
    <section id="files" aria-labelledby="files-heading" className="mt-8">
      <h2
        id="files-heading"
        className="border-b-2 border-ink pb-1 font-label text-sm font-semibold uppercase tracking-[0.3em]"
      >
        From the archive
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {getFolders().map((f) => (
          <article key={f.id} className="border-2 border-ink bg-ink/10 p-4">
            <h3 className="mb-3 inline-block border-b-2 border-ink pb-0.5 font-label text-xs font-semibold uppercase tracking-widest">
              Case file: {f.label}
            </h3>
            <ul className="space-y-1 font-body text-sm">
              {f.projects.map((p) => (
                <li key={p.slug}>
                  <SmartLink href={`/work/${p.slug}`} className="hover:underline">
                    {p.title}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
```
(Opening and fan-out come in phase 3; for now each folder is a plain list, which doubles as the no-JavaScript fallback.)

- [ ] **Step 5: Run, expect pass**

Run: `npx vitest run src/components/bureaus.test.tsx src/components/case-files.test.tsx`
Expected: 2 passed.

- [ ] **Step 6: Commit**

```bash
cd .. && git add site/src/components && git commit -m "feat: add bureaus and case files sections"
```
(append trailers)

---

### Task 5: Classifieds, editorial and letters (TDD)

**Files:**
- Create: `site/src/components/classifieds.tsx`, `editorial.tsx`, `letters.tsx`
- Test: `classifieds.test.tsx`, `editorial.test.tsx`, `letters.test.tsx` (same folder)

**Interfaces:**
- Consumes: `classifieds` (`@/content/resume`), `about` (`@/content/about`), `site` (`@/content/site`).
- Produces: `Classifieds()` (`<section id="classifieds">`, `h2` "Classifieds", an `article` + `h3` per classified, and a plain `<a>` "Download the résumé (PDF)" to `site.resumePdf`); `Editorial()` (`<section id="editorial">`, `h2` "Editorial", portrait via `next/image`, `h3` headline, paragraphs, blockquote); `Letters()` (`<section id="contact">`, `h2` "Letters to the Editor", mailto, LinkedIn and GitHub links).

- [ ] **Step 1: Write the failing tests**

`classifieds.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Classifieds } from './classifieds';
import { classifieds } from '@/content/resume';
import { site } from '@/content/site';

describe('Classifieds', () => {
  it('shows each classified and a résumé download link', () => {
    render(<Classifieds />);
    expect(screen.getByRole('heading', { level: 2, name: 'Classifieds' })).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(classifieds.length);
    expect(screen.getByText(/GPA 9\.14/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Download the résumé/ })).toHaveAttribute('href', site.resumePdf);
  });
});
```
`editorial.test.tsx` (mocks `next/image` so the test does not depend on the image optimiser):
```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Editorial } from './editorial';
import { about } from '@/content/about';

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

describe('Editorial', () => {
  it('shows the portrait, headline, paragraphs and pull quote', () => {
    render(<Editorial />);
    expect(screen.getByRole('heading', { level: 2, name: 'Editorial' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Portrait of Raman Lamba' })).toHaveAttribute(
      'src',
      expect.stringContaining('raman.jpg'),
    );
    expect(screen.getByRole('heading', { level: 3, name: about.headline })).toBeInTheDocument();
    for (const p of about.paragraphs) expect(screen.getByText(p)).toBeInTheDocument();
    expect(screen.getByText(about.pullQuote)).toBeInTheDocument();
  });
});
```
`letters.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Letters } from './letters';
import { site } from '@/content/site';

describe('Letters', () => {
  it('is the contact anchor with email, LinkedIn and GitHub', () => {
    const { container } = render(<Letters />);
    expect(container.querySelector('#contact')).not.toBeNull();
    expect(screen.getByRole('heading', { level: 2, name: 'Letters to the Editor' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: site.email })).toHaveAttribute('href', `mailto:${site.email}`);
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('href', site.linkedin);
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', site.github);
  });
});
```

- [ ] **Step 2: Run, expect failure**

Run: `npx vitest run src/components/classifieds.test.tsx src/components/editorial.test.tsx src/components/letters.test.tsx`
Expected: FAIL (modules not found).

- [ ] **Step 3: Implement `classifieds.tsx`**

```tsx
import { classifieds } from '@/content/resume';
import { site } from '@/content/site';

export function Classifieds() {
  return (
    <section id="classifieds" aria-labelledby="classifieds-heading">
      <h2
        id="classifieds-heading"
        className="border-b-2 border-ink pb-1 font-label text-sm font-semibold uppercase tracking-[0.3em]"
      >
        Classifieds
      </h2>
      <div className="mt-3">
        {classifieds.map((c) => (
          <article key={c.id} className="mb-3 border border-ink p-2 font-body text-sm leading-snug">
            <h3 className="font-label text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-accent">
              {c.heading}
            </h3>
            <p>
              <strong className="font-label uppercase tracking-wide">{c.lead}</strong> {c.body}
            </p>
          </article>
        ))}
      </div>
      <a
        href={site.resumePdf}
        download
        className="font-label text-sm font-semibold uppercase tracking-widest text-accent underline underline-offset-4"
      >
        Download the résumé (PDF) →
      </a>
    </section>
  );
}
```

- [ ] **Step 4: Implement `editorial.tsx`**

```tsx
import Image from 'next/image';
import { about } from '@/content/about';
import { site } from '@/content/site';

export function Editorial() {
  return (
    <section id="editorial" aria-labelledby="editorial-heading">
      <h2
        id="editorial-heading"
        className="border-b-2 border-ink pb-1 font-label text-sm font-semibold uppercase tracking-[0.3em]"
      >
        Editorial
      </h2>
      <Image
        src={site.photo}
        alt={`Portrait of ${site.name}`}
        width={590}
        height={845}
        className="mt-3 h-auto w-40 border border-ink grayscale contrast-125"
      />
      <h3 className="mt-3 font-display text-2xl font-bold italic leading-tight">{about.headline}</h3>
      {about.paragraphs.map((p) => (
        <p key={p} className="mt-2 font-body">
          {p}
        </p>
      ))}
      <blockquote className="mt-3 border-l-4 border-accent pl-3 font-display text-lg italic">
        {about.pullQuote}
      </blockquote>
    </section>
  );
}
```
(The stipple filter on the portrait is a later polish; grayscale and contrast give the press-photo look for now.)

- [ ] **Step 5: Implement `letters.tsx`**

```tsx
import { site } from '@/content/site';

const link = 'underline underline-offset-4 hover:text-accent';

export function Letters() {
  return (
    <section id="contact" aria-labelledby="contact-heading">
      <h2
        id="contact-heading"
        className="border-b-2 border-ink pb-1 font-label text-sm font-semibold uppercase tracking-[0.3em]"
      >
        Letters to the Editor
      </h2>
      <p className="mt-3 font-body">Commissions, roles, questions: write in.</p>
      <ul className="mt-2 space-y-1 font-body">
        <li>
          <a href={`mailto:${site.email}`} className={link}>
            {site.email}
          </a>
        </li>
        <li>
          <a href={site.linkedin} className={link}>
            LinkedIn
          </a>
        </li>
        <li>
          <a href={site.github} className={link}>
            GitHub
          </a>
        </li>
      </ul>
    </section>
  );
}
```

- [ ] **Step 6: Run, expect pass**

Run: `npx vitest run src/components/classifieds.test.tsx src/components/editorial.test.tsx src/components/letters.test.tsx`
Expected: 3 passed.

- [ ] **Step 7: Commit**

```bash
cd .. && git add site/src/components && git commit -m "feat: add classifieds, editorial and letters sections"
```
(append trailers)

---

### Task 6: Footer, compose the full page and verify (TDD + visual)

**Files:**
- Create: `site/src/components/footer.tsx`, `site/src/components/footer.test.tsx`
- Modify: `site/src/components/front-page.tsx` (full replacement), `site/src/components/front-page.test.tsx` (full replacement)

**Interfaces:**
- Consumes: everything above plus the 2a components (`LeadStory`, `StoryCard`, `Ad`, `getAd`, `getLead`, `getStories`).
- Produces: `Footer()` (a `<footer>` reading `Printed in <location> · <name>`); `FrontPage()` returning a fragment of `<main id="main">` and `<Footer />`.

- [ ] **Step 1: Write the failing tests**

`footer.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from './footer';

describe('Footer', () => {
  it('is the colophon', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toHaveTextContent('Printed in Hyderabad · Raman Lamba');
  });
});
```
`front-page.test.tsx` (replace the whole file):
```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { FrontPage } from './front-page';

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
    for (const name of ['From our bureaus', 'From the archive', 'Classifieds', 'Editorial', 'Letters to the Editor']) {
      expect(screen.getByRole('heading', { level: 2, name })).toBeInTheDocument();
    }
    expect(screen.getAllByRole('complementary', { name: 'Advertisement' })).toHaveLength(3);

    const nav = screen.getByRole('navigation', { name: 'Inside today' });
    for (const a of within(nav).getAllByRole('link')) {
      const id = a.getAttribute('href')!.slice(1);
      expect(document.getElementById(id)).not.toBeNull();
    }
    const hrefs = screen.getAllByRole('link').map((a) => a.getAttribute('href'));
    expect(hrefs).toContain('#contact');
    expect(hrefs).toContain('/work/qiskit-portfolio-optimization');
  });
});
```

- [ ] **Step 2: Run, expect failure**

Run: `npx vitest run src/components/footer.test.tsx src/components/front-page.test.tsx`
Expected: FAIL (footer missing; front-page lacks the new sections).

- [ ] **Step 3: Implement `footer.tsx`**

```tsx
import { site } from '@/content/site';

export function Footer() {
  return (
    <footer className="mx-auto mt-10 max-w-6xl border-t-4 border-double border-ink px-4 py-4 text-center font-label text-xs uppercase tracking-[0.25em]">
      Printed in {site.location} · {site.name}
    </footer>
  );
}
```

- [ ] **Step 4: Replace `front-page.tsx`**

```tsx
import { getAd, getLead, getStories } from '@/content/queries';
import { Ad } from './ad';
import { Bureaus } from './bureaus';
import { CaseFiles } from './case-files';
import { Classifieds } from './classifieds';
import { Editorial } from './editorial';
import { Footer } from './footer';
import { IndexBox } from './index-box';
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
        <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <LeadStory project={lead} />
          <Ad ad={getAd('wanted')} layout="tall" />
        </div>
        <div className="mt-6 grid divide-y divide-ink border-y-2 border-ink md:grid-cols-3 md:divide-x md:divide-y-0">
          {stories.map((s) => (
            <StoryCard key={s.slug} project={s} />
          ))}
        </div>
        <div className="mt-6">
          <Ad ad={getAd('backtest')} layout="wide" />
        </div>
        <Bureaus />
        <CaseFiles />
        <div className="mt-8 grid gap-8 lg:grid-cols-3 lg:divide-x lg:divide-ink [&>section]:lg:px-4 [&>section:first-child]:lg:pl-0 [&>section:last-child]:lg:pr-0">
          <Classifieds />
          <Editorial />
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
Page order and the no-grid-assumption for stories stay as in 2a. If the arbitrary-variant classes on the 3-column wrapper do not render as intended in the screenshot, replace them with `lg:px-4` classes passed to each of the three sections' outer elements and report the change.

- [ ] **Step 5: Run the full suite, lint and build**

Run: `npx vitest run && npm run lint && npm run build`
Expected: all tests pass, lint clean, build succeeds.

- [ ] **Step 6: Visual check**

Start the production server in the background (`npm run start`), then from the repo root, with `S=C:/Users/DeLL/AppData/Local/Temp/claude/4aba391c15a3e597/cb0fdf3d-6d28-4b06-a3f3-2b2c90d5b6ec/scratchpad` and Chrome at `/c/Program Files/Google/Chrome/Application/chrome.exe`, take a desktop screenshot (`--window-size=1280,3200`) and a phone one (render the page inside a 390px-wide iframe, because headless Chrome will not go below about 500px; keep that helper HTML outside the repo). Save as `S/full-desktop.png` and `S/full-mobile.png`. Read both. Expected desktop: masthead, an "Inside today" box, lead + tall coupon, three stories, wide ad, three bureau cards, four case-file cards, then three columns (Classifieds | Editorial with a grayscale portrait | Letters), a wide quantum ad, and a footer. Expected phone: one column, no horizontal overflow, masthead ears stacked and left-aligned. Also click-test the anchors by checking `http://localhost:3000/#contact` loads (the page must contain an element with `id="contact"`). Stop the server and confirm port 3000 is free. Keep screenshots outside the repo.

- [ ] **Step 7: Commit**

```bash
cd .. && git add site/src && git commit -m "feat: compose the full front page with footer"
```
(append trailers)

---

## Self-Review
- **Spec coverage (2b):** index box as navigation (spec: Index box), bureaus as press-card-style cards for the three internships, case-file folders per section (closed; opening is phase 3), classifieds from the résumé with a PDF download, editorial about with portrait and pull quote, letters with email/LinkedIn/GitHub (the short form is deferred and flagged), third ad above the footer, colophon footer, one-column phone stack, plus the 2a carry-overs (descriptive link names, aria-hidden glyphs, tokenised halftone, no redundant landmark, stacked masthead ears, skip link). Not here by design: folder opening/fan-out, `/work` and `/resume` pages, real images, stipple filter (phase 3 or polish); markets strip and wire (phase 4).
- **Placeholders:** none; every step has complete code. The bio is real draft copy flagged for the owner's review.
- **Type consistency:** `navItems` ids (`bureaus`, `files`, `classifieds`, `editorial`, `contact`) match the section `id`s in Tasks 4-5 and the front-page test; `getFolders()` returns `{id,label,projects}` and `CaseFiles` uses exactly those; `classifieds`/`about` shapes match their components; `Ad` props unchanged; accessible link names in Task 1 match the tests that Task 6's front-page test relies on (it uses `href` checks, not names).
- **Known risks:** `next/image` is mocked in the two tests that render the editorial, so the real optimiser path is only exercised by the build and the screenshot; Tailwind arbitrary-variant selectors on the three-column wrapper (`[&>section]:lg:px-4`) must be confirmed in the screenshot (the fallback is spelled out in Task 6); a dashed-coupon `#contact` anchor jump lands under no sticky header, so no scroll offset is needed.
