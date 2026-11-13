# Portfolio Phase 2a: Front Page Top Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The top of the front page under the masthead: lead story with a "By the numbers" box, a tall ad beside it, a row of three stories, and a wide ad banner, responsive down to one column on phones.

**Architecture:** Small presentational server components in `site/src/components/`, fed by tiny query helpers in `site/src/content/queries.ts` over the existing typed data. `FrontPage` composes them; `page.tsx` renders `Masthead` then `FrontPage`. No images yet: the lead story uses a CSS halftone plate as an abstract placeholder (real project images arrive in phase 3).

**Tech Stack:** Next.js 16 (App Router), Tailwind v4 tokens from phase 1, Vitest + Testing Library.

Spec: `docs/superpowers/specs/2026-11-13-portfolio-design.md` (sections 4-6). Plan 2b (index box, bureaus, folders shell, classifieds, editorial, letters, footer, third ad) follows; markets strip and wire are phase 4.

## Global Constraints
- **Read `site/AGENTS.md` first** and the relevant guide under `site/node_modules/next/dist/docs/` before writing Next.js code: this Next.js version (16) has breaking changes versus common training data. Cache Components is enabled: server components must not call `new Date()`.
- Tokens only (Tailwind classes from phase 1): `bg-paper`, `text-ink`, `border-ink`, `text-accent`, `font-display`, `font-body`, `font-label`, `font-mono`. Paper `#efe6d0`, ink `#1b1612`, one accent oxblood `#8b1e1e`. No new colours, no new fonts.
- Layout A, vertical scroll only. Desktop (lg) two columns for the lead row; stories in 3 columns from `md`; everything one column on phones. No horizontal scroll at 390px width.
- Accessibility: one `h1` (masthead), `h2` for the lead, `h3` for stories; ads are `aside` landmarks labelled "Advertisement"; decorative art is `aria-hidden`; link text is meaningful.
- Content comes only from `site/src/content/*` (no copy hard-coded in components, except fixed labels: "By the numbers", "Advertisement", "Continued on A3").
- `/work/[slug]` links render now but 404 until phase 3 (expected).
- No dependency added (the `motion` library arrives in phase 3).
- UBS appears only as a result (already true in the data); do not add any description of it.
- No phone number anywhere. Secrets never committed.
- Every commit message ends with these two lines:
  `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`
  `Claude-Session: https://claude.ai/code/session_018QB7mo8gTaSmrUpoNJB9Sc`
- Run commands from `C:\Users\DeLL\Desktop\Portfolio\site` unless stated. Work on a new branch `phase2a-front-page-top` created from `main`.

## File Structure
- `site/src/content/queries.ts` (+ `.test.ts`): `getLead`, `getStories`, `getAd`.
- `site/src/components/smart-link.tsx`: internal path -> `next/link`, anything else -> `<a>`.
- `site/src/components/ad.tsx` (+ test): `Ad`.
- `site/src/components/numbers-box.tsx`, `halftone-plate.tsx`, `lead-story.tsx` (+ test): lead story parts.
- `site/src/components/story-card.tsx` (+ test): `StoryCard`.
- `site/src/components/front-page.tsx` (+ test): composition.
- `site/src/app/page.tsx`: modify.

---

### Task 1: Content queries (TDD)

**Files:**
- Create: `site/src/content/queries.ts`
- Test: `site/src/content/queries.test.ts`

**Interfaces:**
- Consumes: `projects` (`./projects`), `ads` (`./ads`), types `Project`, `Ad` (`./types`).
- Produces: `getLead(): Project` (the project with `lead: true`); `getStories(): Project[]` (exactly 3: `gold-price-forecasting`, `options-strategy-simulator`, `trade-simulator`, in that order); `getAd(id: string): Ad`. All throw an `Error` on a missing item.

- [ ] **Step 1: Write the failing test** `queries.test.ts`

```ts
import { describe, it, expect } from 'vitest';
import { getLead, getStories, getAd } from './queries';

describe('queries', () => {
  it('returns the lead project', () => {
    expect(getLead().slug).toBe('qiskit-portfolio-optimization');
  });
  it('returns three front-page stories, none of them the lead', () => {
    const stories = getStories();
    expect(stories.map((s) => s.slug)).toEqual([
      'gold-price-forecasting',
      'options-strategy-simulator',
      'trade-simulator',
    ]);
    expect(stories.some((s) => s.lead)).toBe(false);
  });
  it('finds an ad by id and throws on an unknown id', () => {
    expect(getAd('wanted').href).toBe('#contact');
    expect(() => getAd('nope')).toThrow(/nope/);
  });
});
```

- [ ] **Step 2: Run, expect failure**

Run: `npx vitest run src/content/queries.test.ts`
Expected: FAIL (module `./queries` not found).

- [ ] **Step 3: Implement** `queries.ts`

```ts
import { projects } from './projects';
import { ads } from './ads';
import type { Ad, Project } from './types';

const STORY_SLUGS = ['gold-price-forecasting', 'options-strategy-simulator', 'trade-simulator'];

function bySlug(slug: string): Project {
  const p = projects.find((x) => x.slug === slug);
  if (!p) throw new Error(`Unknown project slug: ${slug}`);
  return p;
}

export function getLead(): Project {
  const p = projects.find((x) => x.lead);
  if (!p) throw new Error('No lead project');
  return p;
}

export function getStories(): Project[] {
  return STORY_SLUGS.map(bySlug);
}

export function getAd(id: string): Ad {
  const a = ads.find((x) => x.id === id);
  if (!a) throw new Error(`Unknown ad id: ${id}`);
  return a;
}
```

- [ ] **Step 4: Run, expect pass**

Run: `npx vitest run src/content/queries.test.ts`
Expected: 3 passed.

- [ ] **Step 5: Commit**

```bash
cd .. && git checkout -b phase2a-front-page-top && git add site/src/content && git commit -m "feat: add front-page content queries"
```
(append trailers)

---

### Task 2: SmartLink and Ad (TDD)

**Files:**
- Create: `site/src/components/smart-link.tsx`, `site/src/components/ad.tsx`
- Test: `site/src/components/ad.test.tsx`

**Interfaces:**
- Consumes: `Ad` type (`@/content/types`), `ads` (`@/content/ads`).
- Produces: `SmartLink({ href: string } & anchor props)`; `Ad({ ad: Ad; layout: 'tall' | 'wide' })` rendering an `aside` landmark named "Advertisement". An ad whose `href` is `#contact` is the coupon: dashed border and a ✂ before the call to action.

- [ ] **Step 1: Write the failing test** `ad.test.tsx`

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Ad } from './ad';
import { ads } from '@/content/ads';

describe('Ad', () => {
  it('renders the contact ad as a coupon', () => {
    render(<Ad ad={ads[0]} layout="tall" />);
    expect(screen.getByRole('complementary', { name: 'Advertisement' })).toBeInTheDocument();
    expect(screen.getByText(/WANTED: a developer who reads balance sheets/)).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /Clip the coupon/ });
    expect(link).toHaveAttribute('href', '#contact');
    expect(link.textContent).toContain('✂');
  });
  it('links a project ad to its story without the scissors', () => {
    render(<Ad ad={ads[1]} layout="wide" />);
    const link = screen.getByRole('link', { name: /Read the story/ });
    expect(link).toHaveAttribute('href', '/work/gold-price-forecasting');
    expect(link.textContent).not.toContain('✂');
  });
});
```

- [ ] **Step 2: Run, expect failure**

Run: `npx vitest run src/components/ad.test.tsx`
Expected: FAIL (modules not found).

- [ ] **Step 3: Implement** `smart-link.tsx`

```tsx
import Link from 'next/link';
import type { ComponentProps } from 'react';

type Props = Omit<ComponentProps<'a'>, 'href'> & { href: string };

// Internal paths use next/link; anchors (#contact) and external URLs use a plain <a>.
export function SmartLink({ href, ...rest }: Props) {
  return href.startsWith('/') ? <Link href={href} {...rest} /> : <a href={href} {...rest} />;
}
```

- [ ] **Step 4: Implement** `ad.tsx`

```tsx
import type { Ad as AdData } from '@/content/types';
import { SmartLink } from './smart-link';

export function Ad({ ad, layout }: { ad: AdData; layout: 'tall' | 'wide' }) {
  const coupon = ad.href === '#contact';
  const frame = coupon ? 'border-2 border-dashed' : 'border-4 border-double';
  const shape =
    layout === 'tall'
      ? 'flex flex-col items-center justify-center gap-3 py-10'
      : 'flex flex-col items-center justify-between gap-3 sm:flex-row';
  return (
    <aside aria-label="Advertisement" className={`${frame} ${shape} border-ink p-4 text-center`}>
      <p className="font-label text-[0.7rem] uppercase tracking-[0.3em]">Advertisement</p>
      <p className="font-display text-2xl font-black uppercase leading-tight">{ad.headline}</p>
      <p className="font-body italic">{ad.body}</p>
      <SmartLink
        href={ad.href}
        className="font-label text-sm font-semibold uppercase tracking-widest text-accent underline underline-offset-4"
      >
        {coupon ? '✂ ' : ''}
        {ad.cta} →
      </SmartLink>
    </aside>
  );
}
```

- [ ] **Step 5: Run, expect pass**

Run: `npx vitest run src/components/ad.test.tsx`
Expected: 2 passed, output free of warnings.

- [ ] **Step 6: Commit**

```bash
cd .. && git add site/src/components && git commit -m "feat: add Ad component and SmartLink"
```
(append trailers)

---

### Task 3: Lead story (TDD)

**Files:**
- Create: `site/src/components/numbers-box.tsx`, `site/src/components/halftone-plate.tsx`, `site/src/components/lead-story.tsx`
- Test: `site/src/components/lead-story.test.tsx`

**Interfaces:**
- Consumes: `Project`, `Metric` (`@/content/types`); `SmartLink` (`./smart-link`); `getLead()` (`@/content/queries`).
- Produces: `NumbersBox({ metrics: Metric[] })` (renders nothing for an empty list); `HalftonePlate({ caption: string })`; `LeadStory({ project: Project })` rendering an `article` with an `h2` of the title.

- [ ] **Step 1: Write the failing test** `lead-story.test.tsx`

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LeadStory } from './lead-story';
import { getLead } from '@/content/queries';

describe('LeadStory', () => {
  it('shows kicker, headline, credit, deck, numbers and the continued link', () => {
    const lead = getLead();
    render(<LeadStory project={lead} />);
    expect(screen.getByText(lead.kicker)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: lead.title })).toBeInTheDocument();
    expect(screen.getByText(lead.credit)).toBeInTheDocument();
    expect(screen.getByText(lead.deck)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'By the numbers' })).toBeInTheDocument();
    for (const m of lead.metrics) {
      expect(screen.getByText(m.value)).toBeInTheDocument();
      expect(screen.getByText(m.label)).toBeInTheDocument();
    }
    expect(screen.getByRole('link', { name: /Continued on A3/ })).toHaveAttribute(
      'href',
      `/work/${lead.slug}`,
    );
  });
});
```

- [ ] **Step 2: Run, expect failure**

Run: `npx vitest run src/components/lead-story.test.tsx`
Expected: FAIL (module `./lead-story` not found).

- [ ] **Step 3: Implement** `numbers-box.tsx`

```tsx
import type { Metric } from '@/content/types';

export function NumbersBox({ metrics }: { metrics: Metric[] }) {
  if (metrics.length === 0) return null;
  return (
    <section aria-label="By the numbers" className="mt-4 border-y-2 border-ink py-3">
      <h3 className="font-label text-xs font-semibold uppercase tracking-[0.3em]">By the numbers</h3>
      <ul className="mt-2 flex flex-wrap gap-x-8 gap-y-3">
        {metrics.map((m) => (
          <li key={m.label}>
            <span className="block font-mono text-2xl font-medium">{m.value}</span>
            <span className="block font-body text-sm italic">{m.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 4: Implement** `halftone-plate.tsx`

```tsx
// Abstract halftone art used until real project images arrive (phase 3).
export function HalftonePlate({ caption }: { caption: string }) {
  return (
    <figure className="mt-4">
      <div
        aria-hidden="true"
        className="h-48 w-full border border-ink sm:h-64"
        style={{
          backgroundColor: '#d9cdb0',
          backgroundImage:
            'radial-gradient(circle, #1b1612 22%, transparent 24%), radial-gradient(circle, #1b1612 10%, transparent 12%)',
          backgroundSize: '9px 9px, 4px 4px',
        }}
      />
      <figcaption className="mt-1 font-body text-xs italic">{caption}</figcaption>
    </figure>
  );
}
```

- [ ] **Step 5: Implement** `lead-story.tsx`

```tsx
import type { Project } from '@/content/types';
import { HalftonePlate } from './halftone-plate';
import { NumbersBox } from './numbers-box';
import { SmartLink } from './smart-link';

export function LeadStory({ project }: { project: Project }) {
  return (
    <article className="border-b border-ink pb-6 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
      <p className="font-label text-sm font-semibold uppercase tracking-[0.25em] text-accent">
        {project.kicker}
      </p>
      <h2 className="mt-1 font-display text-4xl font-black leading-[1.05] sm:text-5xl">
        {project.title}
      </h2>
      <p className="mt-2 font-body text-lg italic">{project.credit}</p>
      <HalftonePlate caption={`${project.title}, ${project.year}`} />
      <p className="mt-4 font-body text-lg leading-relaxed first-letter:float-left first-letter:pr-2 first-letter:font-display first-letter:text-6xl first-letter:font-black first-letter:leading-[0.8]">
        {project.deck}
      </p>
      <NumbersBox metrics={project.metrics} />
      <SmartLink
        href={`/work/${project.slug}`}
        className="mt-4 inline-block font-label text-sm font-semibold uppercase tracking-widest text-accent underline underline-offset-4"
      >
        Continued on A3 →
      </SmartLink>
    </article>
  );
}
```

- [ ] **Step 6: Run, expect pass**

Run: `npx vitest run src/components/lead-story.test.tsx`
Expected: 1 passed. (`getByText(lead.title)` is not used; the heading query covers it.)

- [ ] **Step 7: Commit**

```bash
cd .. && git add site/src/components && git commit -m "feat: add lead story with numbers box"
```
(append trailers)

---

### Task 4: Story card (TDD)

**Files:**
- Create: `site/src/components/story-card.tsx`
- Test: `site/src/components/story-card.test.tsx`

**Interfaces:**
- Consumes: `Project` (`@/content/types`), `SmartLink` (`./smart-link`), `getStories()` (`@/content/queries`).
- Produces: `StoryCard({ project: Project })` rendering an `article` with an `h3` whose text is a link to `/work/<slug>`.

- [ ] **Step 1: Write the failing test** `story-card.test.tsx`

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StoryCard } from './story-card';
import { getStories } from '@/content/queries';

describe('StoryCard', () => {
  it('shows kicker, linked headline, credit and deck', () => {
    const story = getStories()[0];
    render(<StoryCard project={story} />);
    expect(screen.getByText(story.kicker)).toBeInTheDocument();
    const link = screen.getByRole('link', { name: story.title });
    expect(link).toHaveAttribute('href', `/work/${story.slug}`);
    expect(screen.getByRole('heading', { level: 3 })).toContainElement(link);
    expect(screen.getByText(story.credit)).toBeInTheDocument();
    expect(screen.getByText(story.deck)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run, expect failure**

Run: `npx vitest run src/components/story-card.test.tsx`
Expected: FAIL (module `./story-card` not found).

- [ ] **Step 3: Implement** `story-card.tsx`

```tsx
import type { Project } from '@/content/types';
import { SmartLink } from './smart-link';

export function StoryCard({ project }: { project: Project }) {
  return (
    <article className="py-4 md:px-4 md:first:pl-0 md:last:pr-0">
      <p className="font-label text-xs font-semibold uppercase tracking-[0.25em] text-accent">
        {project.kicker}
      </p>
      <h3 className="mt-1 font-display text-2xl font-bold leading-tight">
        <SmartLink href={`/work/${project.slug}`} className="hover:underline">
          {project.title}
        </SmartLink>
      </h3>
      <p className="mt-1 font-body text-sm italic">{project.credit}</p>
      <p className="mt-2 font-body">{project.deck}</p>
    </article>
  );
}
```

- [ ] **Step 4: Run, expect pass**

Run: `npx vitest run src/components/story-card.test.tsx`
Expected: 1 passed.

- [ ] **Step 5: Commit**

```bash
cd .. && git add site/src/components && git commit -m "feat: add story card"
```
(append trailers)

---

### Task 5: Compose the front page and verify (TDD + visual)

**Files:**
- Create: `site/src/components/front-page.tsx`
- Modify: `site/src/app/page.tsx` (full replacement)
- Test: `site/src/components/front-page.test.tsx`

**Interfaces:**
- Consumes: `LeadStory`, `StoryCard`, `Ad`, `getLead`, `getStories`, `getAd`, `Masthead` (existing, `@/components/masthead`).
- Produces: `FrontPage()` returning `<main id="main">`; `page.tsx` renders `<Masthead />` then `<FrontPage />`.

- [ ] **Step 1: Write the failing test** `front-page.test.tsx`

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FrontPage } from './front-page';

describe('FrontPage', () => {
  it('composes lead story, three stories and two ads', () => {
    render(<FrontPage />);
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Quantum Portfolio Optimization' }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(4);
    expect(screen.getAllByRole('complementary', { name: 'Advertisement' })).toHaveLength(2);
    const hrefs = screen.getAllByRole('link').map((a) => a.getAttribute('href'));
    expect(hrefs).toContain('/work/qiskit-portfolio-optimization');
    expect(hrefs).toContain('/work/gold-price-forecasting');
    expect(hrefs).toContain('#contact');
  });
});
```

- [ ] **Step 2: Run, expect failure**

Run: `npx vitest run src/components/front-page.test.tsx`
Expected: FAIL (module `./front-page` not found).

- [ ] **Step 3: Implement** `front-page.tsx`

```tsx
import { getAd, getLead, getStories } from '@/content/queries';
import { Ad } from './ad';
import { LeadStory } from './lead-story';
import { StoryCard } from './story-card';

export function FrontPage() {
  const lead = getLead();
  const stories = getStories();
  return (
    <main id="main" className="mx-auto max-w-6xl px-4 py-6">
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
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
    </main>
  );
}
```

- [ ] **Step 4: Replace `page.tsx`**

```tsx
import { FrontPage } from '@/components/front-page';
import { Masthead } from '@/components/masthead';

export default function Home() {
  return (
    <>
      <Masthead />
      <FrontPage />
    </>
  );
}
```

- [ ] **Step 5: Run the full suite, lint and build**

Run: `npx vitest run && npm run lint && npm run build`
Expected: all tests pass (phase 1's 13 plus the new ones), lint clean, build succeeds.

- [ ] **Step 6: Visual check**

Start the production server in the background (`npm run start`), then from the repo root:
```bash
S="C:/Users/DeLL/AppData/Local/Temp/claude/4aba391c15a3e597/cb0fdf3d-6d28-4b06-a3f3-2b2c90d5b6ec/scratchpad"
C="/c/Program Files/Google/Chrome/Application/chrome.exe"
"$C" --headless=new --disable-gpu --window-size=1280,1500 --virtual-time-budget=4000 --screenshot="$S/front-desktop.png" http://localhost:3000
"$C" --headless=new --disable-gpu --window-size=390,2600 --virtual-time-budget=4000 --screenshot="$S/front-mobile.png" http://localhost:3000
```
Read both images. Expected desktop: masthead, then lead story (left, wide) with halftone plate, drop cap on the deck, "By the numbers" box and "Continued on A3" link, beside a tall dashed coupon ad (right); below, three stories in columns with vertical rules; below that, a wide double-border ad. Expected mobile: one column, nothing cut off at the right edge, ads and stories stacked. Stop the server afterwards and confirm port 3000 is free. Keep screenshots outside the repo.

- [ ] **Step 7: Commit**

```bash
cd .. && git add site/src && git commit -m "feat: compose front page top"
```
(append trailers)

---

## Self-Review
- **Spec coverage (2a scope):** lead story with kicker, headline, deck, byline/credit, drop cap, "By the numbers" and "Continued" link (spec section 6 Lead story); tall ad beside lead and wide banner after the stories, coupon with ✂ (Ad); three-story clippings row as story cards (the cut-out styling of clippings comes in phase 3 with folders); responsive one-column stack. Deferred on purpose: index box, bureaus, folders, classifieds, editorial, letters, footer and the third ad (plan 2b); markets strip and wire (phase 4); real images, opening interactions and `/work/[slug]` (phase 3).
- **Placeholders:** none; every code step is complete.
- **Type consistency:** `Ad` takes `{ ad: Ad; layout: 'tall' | 'wide' }` everywhere; `getLead/getStories/getAd` signatures match their uses; `SmartLink` is used by `Ad`, `LeadStory`, `StoryCard`; test names for headings and links match the rendered text (`By the numbers`, `Continued on A3 →`, `Clip the coupon`, `Read the story`).
- **Known risks:** `border-double` needs at least 3px (hence `border-4`); `first-letter:` utilities depend on Tailwind v4's variant support, which the visual check confirms; story `deck` text is long on `md` widths, so check wrapping in the screenshot.
