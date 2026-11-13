# Portfolio Phase 3a: Project Pages and Résumé Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every link on the front page land somewhere: a `/work/[slug]` article page for each of the 12 projects, a styled 404 page, and a `/resume` page with a PDF download; plus the polish items from the 2b review.

**Architecture:** Server components only. Project write-ups live in a separate `content/details.ts` (problem, approach, result, stack) keyed by slug, so `projects.ts` stays small; projects without a write-up still get a page from their deck and numbers. The résumé page renders from a structured `content/resume-full.ts`. Routes follow the Next.js 16 dynamic-route API (`params` is a Promise; `generateStaticParams` prerenders all 12 slugs).

**Tech Stack:** Next.js 16 (App Router, Cache Components on), Tailwind v4 tokens, Vitest + Testing Library. No new dependency (the `motion` library arrives in plan 3b).

Spec: `docs/superpowers/specs/2026-11-13-portfolio-design.md` (sections 3, 6-8). Plan 3b (folder opening, fan-out, focus-and-dim, grain stacking, back pill) follows. Real project images are not in this plan: pages reuse the halftone plate until the owner supplies screenshots.

## Global Constraints
- **Read `site/AGENTS.md` first.** Next.js 16 specifics relevant here (from the bundled docs): `params` is a `Promise` (`const { slug } = await params`); `generateStaticParams` returns `{ slug: string }[]`; `notFound()` from `next/navigation` renders the 404; metadata via `generateMetadata`. Cache Components is on: no `new Date()` in server components.
- Tokens only (`bg-paper`, `bg-ink`, `text-paper`, `bg-ink/10`-style, `text-ink`, `border-ink`, `text-accent`, `font-display/body/label/mono`). No hex colours, no new fonts.
- Heading outline per page: exactly one `h1`; sections are `h2`; items `h3`. Page `main` has `id="main"` (the skip link targets it).
- Content only from `site/src/content/*`, except fixed labels (page chrome, "The problem", "The approach", "The result", "Built with", "Key figures", "Front page", "Page not found").
- Write-up copy in `details.ts` uses only the verified facts given in this plan. The owner must confirm the Options Strategy Simulator status wording before launch.
- UBS appears only as a result; no description of the competition problem or solution. No phone number anywhere (the résumé page must not show one). No secrets. No new dependency.
- External links use `target="_blank"` with `rel="noopener noreferrer"`. Decorative glyphs (arrows) are `aria-hidden`.
- Commit trailers: end every commit with a `Claude-Session: https://claude.ai/code/session_018QB7mo8gTaSmrUpoNJB9Sc` line and a `Co-Authored-By: Claude <your own model name> <noreply@anthropic.com>` line (the actual author model is accepted).
- Run commands from `C:\Users\DeLL\Desktop\Portfolio\site` unless stated. Work on branch `phase3a-work-and-resume-pages` (the controller creates it from `main`).

## File Structure
- Modify: `components/ad.tsx`, `classifieds.tsx`, `front-page.tsx` (+ tests), `content/about.ts`, `content/types.ts`, `content/queries.ts` (+ test).
- Create: `content/details.ts`, `content/details.test.ts`, `content/resume-full.ts`, `content/resume-full.test.ts`.
- Create components: `back-bar.tsx`, `project-article.tsx`, `resume-page.tsx` (+ tests).
- Create routes: `app/work/[slug]/page.tsx` (+ test), `app/not-found.tsx` (+ test), `app/resume/page.tsx` (+ test).

---

### Task 1: Review carry-overs (TDD)

**Files:**
- Modify: `site/src/components/ad.tsx`, `classifieds.tsx`, `front-page.tsx`, `site/src/content/about.ts`
- Modify tests: `site/src/components/ad.test.tsx`, `front-page.test.tsx`

**Interfaces:**
- Produces: each ad's landmark is named `Advertisement: <headline>` (so the three are distinguishable); the three stories sit in a `section` headed by an `sr-only` `h2` "More stories"; the résumé download link's arrow is `aria-hidden`; the bio says "In summer 2026".

- [ ] **Step 1: Update the tests first**

In `ad.test.tsx`, change the landmark lookup `getByRole('complementary', { name: 'Advertisement' })` to `getByRole('complementary', { name: /^Advertisement: / })`.
In `front-page.test.tsx`: change `getAllByRole('complementary', { name: 'Advertisement' })` to `getAllByRole('complementary', { name: /^Advertisement: / })`, and add to the heading loop's list a check right after it:
```tsx
    expect(screen.getByRole('heading', { level: 2, name: 'More stories' })).toBeInTheDocument();
```

- [ ] **Step 2: Run, expect failure**

Run: `npx vitest run src/components/ad.test.tsx src/components/front-page.test.tsx`
Expected: FAIL (landmark names and the "More stories" heading).

- [ ] **Step 3: `ad.tsx`:** change `<aside aria-label="Advertisement" ...>` to `<aside aria-label={`Advertisement: ${ad.headline}`} ...>` (keep every class).

- [ ] **Step 4: `front-page.tsx`:** replace the stories block
```tsx
        <div className="mt-6 grid divide-y divide-ink border-y-2 border-ink md:grid-cols-3 md:divide-x md:divide-y-0">
          {stories.map((s) => (
            <StoryCard key={s.slug} project={s} />
          ))}
        </div>
```
with
```tsx
        <section aria-labelledby="stories-heading" className="mt-6">
          <h2 id="stories-heading" className="sr-only">
            More stories
          </h2>
          <div className="grid divide-y divide-ink border-y-2 border-ink md:grid-cols-3 md:divide-x md:divide-y-0">
            {stories.map((s) => (
              <StoryCard key={s.slug} project={s} />
            ))}
          </div>
        </section>
```

- [ ] **Step 5: `classifieds.tsx`:** change the download link's text from `Download the résumé (PDF) →` to `Download the résumé (PDF)<span aria-hidden="true"> →</span>`.

- [ ] **Step 6: `about.ts`:** in the second paragraph change `This summer I worked on private credit deals at Oxane Partners` to `In summer 2026 I worked on private credit deals at Oxane Partners`.

- [ ] **Step 7: Run all, expect pass**

Run: `npx vitest run && npm run lint`
Expected: all tests pass, lint clean.

- [ ] **Step 8: Commit**

```bash
cd .. && git add site/src && git commit -m "fix: unique ad landmark names, stories heading, decorative arrow, dated bio"
```
(append trailers)

---

### Task 2: Project write-ups and queries (TDD)

**Files:**
- Modify: `site/src/content/types.ts`, `site/src/content/queries.ts`
- Create: `site/src/content/details.ts`
- Test: `site/src/content/details.test.ts`

**Interfaces:**
- Produces: `ProjectDetails = { problem: string; approach: string; result: string; stack: string[] }` (types.ts); `projectDetails: Record<string, ProjectDetails>` (details.ts, keyed by project slug); `getProject(slug: string): Project | undefined`; `getDetails(slug: string): ProjectDetails | undefined`; `getProjectSlugs(): string[]` (all 12 slugs in `projects` order).

- [ ] **Step 1: Write the failing test** `details.test.ts`

```ts
import { describe, it, expect } from 'vitest';
import { projectDetails } from './details';
import { projects } from './projects';
import { getDetails, getProject, getProjectSlugs } from './queries';

describe('project details', () => {
  it('only describes existing projects and fills every field', () => {
    const slugs = projects.map((p) => p.slug);
    for (const [slug, d] of Object.entries(projectDetails)) {
      expect(slugs).toContain(slug);
      expect(d.problem.length).toBeGreaterThan(0);
      expect(d.approach.length).toBeGreaterThan(0);
      expect(d.result.length).toBeGreaterThan(0);
      expect(d.stack.length).toBeGreaterThan(0);
    }
  });
  it('covers the lead and the front-page stories', () => {
    for (const slug of [
      'qiskit-portfolio-optimization',
      'gold-price-forecasting',
      'options-strategy-simulator',
      'trade-simulator',
    ]) {
      expect(projectDetails[slug]).toBeDefined();
    }
  });
  it('contains no phone number and no UBS mention', () => {
    const all = JSON.stringify(projectDetails);
    expect(all).not.toMatch(/\d{10}/);
    expect(all).not.toMatch(/UBS/);
  });
  it('exposes lookups by slug', () => {
    expect(getProjectSlugs()).toEqual(projects.map((p) => p.slug));
    expect(getProject('gold-price-forecasting')?.title).toBe('Gold Price Forecasting');
    expect(getProject('nope')).toBeUndefined();
    expect(getDetails('gold-price-forecasting')?.stack).toContain('PyTorch');
    expect(getDetails('spotify-campaign')).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run, expect failure**

Run: `npx vitest run src/content/details.test.ts`
Expected: FAIL (module `./details` not found).

- [ ] **Step 3: Add the type** to `types.ts` (append):

```ts
export type ProjectDetails = { problem: string; approach: string; result: string; stack: string[] };
```

- [ ] **Step 4: Create `details.ts`**

```ts
import type { ProjectDetails } from './types';

// Keyed by project slug. Copy uses only verified facts about each project.
export const projectDetails: Record<string, ProjectDetails> = {
  'qiskit-portfolio-optimization': {
    problem:
      'Pick the best set of stocks for a portfolio: high return, low risk, a fixed number of stocks and, at the top level, a cap per sector. The search space grows quickly: 4,096 bitstrings at 12 stocks and 184,756 portfolios at 20.',
    approach:
      'QAOA with a mixer that keeps the number of stocks fixed and a start state made only of valid portfolios, so every sample is a valid answer. At 20 stocks a second design keeps both the count and the sector rule inside the circuit. Every result was checked against brute force, and the fast simulator was checked against the real Qiskit circuit.',
    result:
      'At 12 stocks the mixer beat penalty-based QAOA by 3.7 to 20 times and a random valid pick by 57 times, while greedy search stayed far cheaper, which the write-up says plainly. On the real ibm_fez chip, with error suppression, the 12-stock circuit gave a clear signal above noise.',
    stack: ['Qiskit', 'Python', 'NumPy'],
  },
  'gold-price-forecasting': {
    problem:
      'Forecast short-term gold prices under uncertainty, then turn the forecasts into trading decisions.',
    approach:
      'A probabilistic CNN-LSTM trained on 3,939 trading days, 9 macroeconomic indicators and more than 45 engineered features, with quantile models and checks on calibration and uncertainty. A risk-based strategy turns the model outputs into buy and sell signals.',
    result:
      '54-58% directional accuracy on 5-day forecasts and an 18% backtested strategy return. Feature-importance analysis looked at interest rates, the USD index, inflation and crude oil to see which indicators were most predictive.',
    stack: ['PyTorch', 'Python', 'Time series'],
  },
  'options-strategy-simulator': {
    problem:
      'Options strategies are hard to learn from textbooks. This game shows a real historical setup, lets you pick a strategy, then reveals how all ten would have done.',
    approach:
      'A Python pipeline fetches NSE F&O data from 2019 to 2024 and builds a pool of historical scenarios spread across market regimes, loaded into Supabase. A Next.js front end runs the rounds, and the backend scores all ten strategies using real entry premiums and the actual expiry settlement.',
    result:
      'A single-player learning game: ten rounds per playthrough, realized P&L for every strategy each round, your pick ranked against the rest, and a shared leaderboard.',
    stack: ['Python', 'Supabase', 'Next.js'],
  },
  'trade-simulator': {
    problem: 'Estimate the cost of a trade before placing it, in real time.',
    approach:
      'An online-learning SGD model predicts slippage tick by tick, an Almgren-Chriss model estimates market impact, and a logistic-regression classifier labels a trade as maker or taker. All three run in one live pipeline.',
    result:
      'A real-time analysis app documented model by model, with the parameters and the reasoning behind each choice.',
    stack: ['Python', 'scikit-learn'],
  },
  'deribit-oms': {
    problem:
      'Place, cancel and modify orders on a crypto derivatives exchange from code, and watch the order book live.',
    approach:
      'A C++ client built with cpr for HTTP requests, nlohmann_json for parsing and libwebsockets for streaming. It includes a WebSocket server that sends the live order book to several clients, refreshed every second.',
    result: "Works against Deribit's test exchange and suits synchronous calls best.",
    stack: ['C++', 'libwebsockets', 'cpr', 'nlohmann_json'],
  },
  'asian-paints-valuation': {
    problem: 'What is Asian Paints worth, and is the market price justified?',
    approach:
      'An Excel model combining an FCFF-based DCF (WACC 13.7%), a two-stage dividend discount model and peer multiples, benchmarked against Berger Paints and Kansai Nerolac using EMIS financials.',
    result:
      'An intrinsic value of Rs 586 per share against a market price of about Rs 2,580, concluding the stock was overvalued.',
    stack: ['Excel', 'EMIS'],
  },
  'lecture-hall-booking': {
    problem: 'Book lecture halls without ever double-booking one.',
    approach:
      'An interactive 3D building built with React Three Fiber that matches the real floor plan, with Supabase for sign-in, the database and realtime updates. A database constraint makes overlapping bookings impossible.',
    result: 'Multi-user booking for 11 rooms across three floors, live on Vercel.',
    stack: ['Next.js', 'React Three Fiber', 'Supabase', 'Tailwind CSS'],
  },
};
```

- [ ] **Step 5: Add the lookups to `queries.ts`.** Change the types import to include the new type (`import { sections, type Ad, type Project, type ProjectDetails } from './types';`), add `import { projectDetails } from './details';` with the other imports, and append:

```ts
export function getProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getDetails(slug: string): ProjectDetails | undefined {
  return projectDetails[slug];
}
```

- [ ] **Step 6: Run, expect pass**

Run: `npx vitest run src/content`
Expected: all content tests pass.

- [ ] **Step 7: Commit**

```bash
cd .. && git add site/src/content && git commit -m "feat: add project write-ups and slug lookups"
```
(append trailers)

---

### Task 3: Project pages, back bar and 404 (TDD)

**Files:**
- Create: `site/src/components/back-bar.tsx`, `site/src/components/project-article.tsx`, `site/src/app/work/[slug]/page.tsx`, `site/src/app/not-found.tsx`
- Test: `site/src/components/project-article.test.tsx`, `site/src/app/work/[slug]/page.test.tsx`, `site/src/app/not-found.test.tsx`

**Interfaces:**
- Consumes: `getProject`, `getDetails`, `getProjectSlugs` (`@/content/queries`); `Project`, `ProjectDetails` (`@/content/types`); `HalftonePlate`, `NumbersBox`, `Footer`, `SmartLink`; `site` (`@/content/site`).
- Produces: `BackBar()`; `ProjectArticle({ project, details? })` (one `h1`; sr-only `h2` "Key figures"; when `details` is present, `h2`s "The problem", "The approach", "The result", "Built with"; an external link when `project.link` exists); route `/work/[slug]` (default export `WorkPage`, plus `generateStaticParams`, `generateMetadata`); `NotFound()`.

- [ ] **Step 1: Write the failing tests**

`project-article.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectArticle } from './project-article';
import { getDetails, getProject } from '@/content/queries';

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
  it('opens an external project link safely in a new tab', () => {
    const project = getProject('lecture-hall-booking')!;
    render(<ProjectArticle project={project} details={getDetails('lecture-hall-booking')} />);
    const link = screen.getByRole('link', { name: /Live site/ });
    expect(link).toHaveAttribute('href', 'https://lecture-hall-booking.vercel.app');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
```
`src/app/work/[slug]/page.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import WorkPage, { generateMetadata, generateStaticParams } from './page';
import { projects } from '@/content/projects';

describe('work page', () => {
  it('prerenders every project slug', () => {
    expect(generateStaticParams().map((p) => p.slug)).toEqual(projects.map((p) => p.slug));
  });
  it('renders the article with a way back to the front page', async () => {
    render(await WorkPage({ params: Promise.resolve({ slug: 'gold-price-forecasting' }) }));
    expect(screen.getByRole('heading', { level: 1, name: 'Gold Price Forecasting' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Front page/ })).toHaveAttribute('href', '/');
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
  it('sets the title metadata', async () => {
    const meta = await generateMetadata({ params: Promise.resolve({ slug: 'gold-price-forecasting' }) });
    expect(meta.title).toBe('Gold Price Forecasting | Raman Lamba');
  });
  it('404s for an unknown slug', async () => {
    await expect(WorkPage({ params: Promise.resolve({ slug: 'nope' }) })).rejects.toThrow();
  });
});
```
`not-found.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import NotFound from './not-found';

describe('NotFound', () => {
  it('says so and links back to the front page', () => {
    render(<NotFound />);
    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Front page/ })).toHaveAttribute('href', '/');
  });
});
```

- [ ] **Step 2: Run, expect failure**

Run: `npx vitest run src/components/project-article.test.tsx src/app`
Expected: FAIL (modules not found).

- [ ] **Step 3: `back-bar.tsx`**

```tsx
import { site } from '@/content/site';
import { SmartLink } from './smart-link';

export function BackBar() {
  return (
    <header className="border-b-4 border-double border-ink px-4 py-3">
      <div className="mx-auto flex max-w-3xl items-baseline justify-between gap-4 font-label text-sm uppercase tracking-widest">
        <SmartLink href="/" className="underline underline-offset-4 hover:text-accent">
          <span aria-hidden="true">← </span>Front page
        </SmartLink>
        <span>{site.name}</span>
      </div>
    </header>
  );
}
```

- [ ] **Step 4: `project-article.tsx`**

```tsx
import type { Project, ProjectDetails } from '@/content/types';
import { HalftonePlate } from './halftone-plate';
import { NumbersBox } from './numbers-box';

const sectionHeading =
  'mt-8 border-b-2 border-ink pb-1 font-label text-sm font-semibold uppercase tracking-[0.3em]';
const paragraph = 'mt-3 font-body text-lg leading-relaxed';

export function ProjectArticle({ project, details }: { project: Project; details?: ProjectDetails }) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <p className="font-label text-sm font-semibold uppercase tracking-[0.25em] text-accent">
        {project.kicker}
      </p>
      <h1 className="mt-1 font-display text-4xl font-black leading-[1.05] sm:text-5xl">{project.title}</h1>
      <p className="mt-2 font-body text-lg italic">{project.credit}</p>
      <HalftonePlate caption={`${project.title}, ${project.year}`} />
      <p className="mt-4 font-body text-lg leading-relaxed">{project.deck}</p>
      <h2 className="sr-only">Key figures</h2>
      <NumbersBox metrics={project.metrics} />
      {details && (
        <>
          <h2 className={sectionHeading}>The problem</h2>
          <p className={paragraph}>{details.problem}</p>
          <h2 className={sectionHeading}>The approach</h2>
          <p className={paragraph}>{details.approach}</p>
          <h2 className={sectionHeading}>The result</h2>
          <p className={paragraph}>{details.result}</p>
          <h2 className={sectionHeading}>Built with</h2>
          <ul className="mt-3 flex flex-wrap gap-2 font-mono text-sm">
            {details.stack.map((s) => (
              <li key={s} className="border border-ink px-2 py-0.5">
                {s}
              </li>
            ))}
          </ul>
        </>
      )}
      {project.link && (
        <p className="mt-8">
          <a
            href={project.link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-label text-sm font-semibold uppercase tracking-widest text-accent underline underline-offset-4"
          >
            {project.link.label}
            <span aria-hidden="true"> →</span>
          </a>
        </p>
      )}
    </article>
  );
}
```

- [ ] **Step 5: `src/app/work/[slug]/page.tsx`**

```tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BackBar } from '@/components/back-bar';
import { Footer } from '@/components/footer';
import { ProjectArticle } from '@/components/project-article';
import { getDetails, getProject, getProjectSlugs } from '@/content/queries';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: `${project.title} | Raman Lamba`, description: project.deck };
}

export default async function WorkPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return (
    <>
      <BackBar />
      <main id="main">
        <ProjectArticle project={project} details={getDetails(slug)} />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 6: `src/app/not-found.tsx`**

```tsx
import { BackBar } from '@/components/back-bar';
import { Footer } from '@/components/footer';

export default function NotFound() {
  return (
    <>
      <BackBar />
      <main id="main" className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="font-label text-sm uppercase tracking-[0.3em] text-accent">Error 404</p>
        <h1 className="mt-2 font-display text-5xl font-black">Page not found</h1>
        <p className="mt-4 font-body text-lg italic">This page was not in today&apos;s edition.</p>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 7: Run, expect pass**

Run: `npx vitest run src/components/project-article.test.tsx src/app && npm run lint`
Expected: all pass (3 + 4 + 1 tests), lint clean. If `render(await WorkPage(...))` complains about the async server component, report the exact error and keep the plan's intent (call the function, render the returned element).

- [ ] **Step 8: Commit**

```bash
cd .. && git add site/src && git commit -m "feat: add project pages, back bar and 404 page"
```
(append trailers)

---

### Task 4: Résumé data and page (TDD)

**Files:**
- Create: `site/src/content/resume-full.ts`, `site/src/components/resume-page.tsx`, `site/src/app/resume/page.tsx`
- Test: `site/src/content/resume-full.test.ts`, `site/src/components/resume-page.test.tsx`, `site/src/app/resume/page.test.tsx`

**Interfaces:**
- Consumes: `site` (`@/content/site`); `BackBar`, `Footer`.
- Produces: `resumeFull` (summary, education, experience, honours, projects, skills; see code); `ResumePage()` (`h1` "Raman Lamba", an `a download` pill to `site.resumePdf`, `h2` sections "Education", "Experience", "Awards & competitions", "Projects", "Skills", with `h3` per entry); route `/resume` (default export `ResumeRoute`, `metadata`).

- [ ] **Step 1: Write the failing tests**

`resume-full.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { resumeFull } from './resume-full';

describe('resumeFull', () => {
  it('has education, three roles with bullets, honours, projects and skills', () => {
    expect(resumeFull.education.map((e) => e.school)).toEqual([
      'Institute of Management Technology Hyderabad',
      'CRSSIET, NCR',
    ]);
    expect(resumeFull.experience.map((r) => r.org)).toEqual(['Oxane Partners', 'Jivika', 'Coding Blocks']);
    for (const r of resumeFull.experience) expect(r.bullets.length).toBeGreaterThan(0);
    expect(resumeFull.honours).toHaveLength(3);
    expect(resumeFull.projects.length).toBeGreaterThanOrEqual(5);
    expect(resumeFull.skills.map((s) => s.label)).toEqual(['Finance', 'Code & Data', 'Tools']);
  });
  it('has no phone number and mentions UBS exactly once, as a result', () => {
    const all = JSON.stringify(resumeFull);
    expect(all).not.toMatch(/\d{10}/);
    expect(all.match(/UBS/g)).toHaveLength(1);
  });
});
```
`resume-page.test.tsx`:
```tsx
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
  });
});
```
`src/app/resume/page.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ResumeRoute, { metadata } from './page';

describe('resume route', () => {
  it('renders the résumé with a way back and sets the title', () => {
    render(<ResumeRoute />);
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Front page/ })).toHaveAttribute('href', '/');
    expect(metadata.title).toBe('Résumé | Raman Lamba');
  });
});
```

- [ ] **Step 2: Run, expect failure**

Run: `npx vitest run src/content/resume-full.test.ts src/components/resume-page.test.tsx src/app/resume`
Expected: FAIL (modules not found).

- [ ] **Step 3: `resume-full.ts`** (mirrors the one-page résumé PDF)

```ts
export type ResumeEntry = { org: string; role: string; dates: string; bullets: string[] };

export const resumeFull = {
  summary:
    'MBA (Finance) candidate and CS engineer who builds models, simulators and data tools for finance. First place at the UBS Financial Challenge; winner of Qiskit Fall Fest 2026. Experience in private credit operations, equity valuation, and ML for markets.',
  education: [
    {
      school: 'Institute of Management Technology Hyderabad',
      detail: 'PGDM, Finance (GPA 9.14)',
      dates: 'Jul 2025 - Mar 2027',
    },
    { school: 'CRSSIET, NCR', detail: 'B.Tech, Computer Science (82.22%)', dates: 'Jul 2021 - Jun 2025' },
  ],
  experience: [
    {
      org: 'Oxane Partners',
      role: 'Summer Intern, Private Credit (Gurugram)',
      dates: 'Apr - Jun 2026',
      bullets: [
        "Analysed, modelled and onboarded 2 private credit deals (AUM > $100M) onto Oxane's native platform, validating deal data and documents so both went live with accurate data.",
        'Designed and built an automated covenant-monitoring alert system with double-step verification for early breach detection and escalation.',
        'Built a metadata-driven data architecture that cut manual configuration in deal onboarding and improved data integrity and traceability.',
      ],
    },
    {
      org: 'Jivika',
      role: 'Developer (startup)',
      dates: 'Jun 2025',
      bullets: [
        'Built backend for an AI job-candidate matching system (TypeScript, embeddings, Qdrant vector search); fixed the matching API response format.',
      ],
    },
    {
      org: 'Coding Blocks',
      role: 'Teaching Assistant (Delhi)',
      dates: 'Aug 2024 - Feb 2025',
      bullets: [
        'Solved student doubts on DSA problems in twice-weekly sessions, assisted students in interviews, reviewed 500+ practice problems and ran 24+ extra concept sessions.',
      ],
    },
  ] satisfies ResumeEntry[],
  honours: [
    'First place, UBS Financial Challenge (Team Cygnus, Sep 2026). Winning team in a finance case competition; led most of the analysis and solution design.',
    'Winner, Qiskit Fall Fest 2026 (IIIT-Delhi), Track 2 Quantum Optimization. Solo entry; reached the Advanced level.',
    'CFA Institute Research Challenge: relative valuation for APL Apollo Tubes in the IMT Hyderabad team report.',
  ],
  projects: [
    {
      org: 'Quantum Portfolio Optimization (QAOA)',
      role: 'Qiskit, Python',
      dates: '2026',
      bullets: [
        'Chose 10 of 20 stocks under a sector cap, verified against brute force on 184,756 portfolios; a constraint-preserving mixer beat penalty-based QAOA by 3.7-20x (12 stocks); ran on IBM ibm_fez hardware.',
      ],
    },
    {
      org: 'Quantitative Gold Price Forecasting',
      role: 'PyTorch, time series',
      dates: 'Mar 2026',
      bullets: [
        'Probabilistic CNN-LSTM on 3,939 trading days, 9 macro indicators and 45+ features: 54-58% directional accuracy on 5-day forecasts; a risk-based strategy backtested at an 18% return.',
      ],
    },
    {
      org: 'Asian Paints Valuation',
      role: 'Excel, IMT Hyderabad',
      dates: 'Sep 2026',
      bullets: [
        'FCFF DCF (WACC 13.7%), two-stage DDM and peer multiples vs Berger Paints and Kansai Nerolac; intrinsic value Rs 586/share vs CMP ~Rs 2,580, concluding the stock was overvalued.',
      ],
    },
    {
      org: 'Options Strategy Simulator',
      role: 'Python, Supabase, Next.js',
      dates: 'Aug 2026',
      bullets: [
        'Game on real NSE F&O data (2019-2024): computes realized P&L for 10 strategies per scenario, with a regime-stratified scenario pool.',
      ],
    },
    {
      org: 'Trade Simulator & Deribit OMS',
      role: 'Python, C++',
      dates: '2024-25',
      bullets: [
        'Real-time slippage model (online SGD), Almgren-Chriss market impact and maker/taker classifier; C++ order management client for Deribit testnet with a live order-book WebSocket server.',
      ],
    },
  ] satisfies ResumeEntry[],
  skills: [
    {
      label: 'Finance',
      items: 'DCF, DDM, relative valuation, financial modelling, private credit, covenant monitoring',
    },
    {
      label: 'Code & Data',
      items: 'Python, SQL, TypeScript/Next.js, C++, PyTorch, scikit-learn, Qiskit, RAG (Pinecone, ChromaDB), Supabase',
    },
    { label: 'Tools', items: 'Excel, Power BI, Tableau, Git' },
  ],
};
```

- [ ] **Step 4: `resume-page.tsx`**

```tsx
import { resumeFull } from '@/content/resume-full';
import { site } from '@/content/site';

const label = 'font-label text-sm font-semibold uppercase tracking-[0.3em]';

function Entries({ entries }: { entries: { org: string; role: string; dates: string; bullets: string[] }[] }) {
  return (
    <div className="space-y-5">
      {entries.map((e) => (
        <article key={e.org}>
          <h3 className="font-display text-xl font-bold">
            {e.org} <span className="font-body text-base font-normal italic">{e.role}</span>
          </h3>
          <p className="font-label text-xs uppercase tracking-[0.2em] text-accent">{e.dates}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 font-body">
            {e.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

function Row({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="grid gap-3 border-t border-ink py-6 md:grid-cols-[10rem_1fr]">
      <h2 id={id} className={label}>
        {title}
      </h2>
      <div>{children}</div>
    </section>
  );
}

export function ResumePage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="font-display text-4xl font-black">{site.name}</h1>
      <p className="mt-1 font-body italic">{resumeFull.summary}</p>
      <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1 font-body underline-offset-4">
        <li>
          <a href={`mailto:${site.email}`} className="underline">
            {site.email}
          </a>
        </li>
        <li>
          <a href={site.linkedin} className="underline">
            LinkedIn
          </a>
        </li>
        <li>
          <a href={site.github} className="underline">
            GitHub
          </a>
        </li>
      </ul>
      <p className="mt-4">
        <a
          href={site.resumePdf}
          download
          className="inline-block border-2 border-ink bg-ink px-4 py-2 font-label text-sm uppercase tracking-widest text-paper"
        >
          Download PDF
        </a>
      </p>

      <div className="mt-6">
        <Row id="resume-education" title="Education">
          <div className="space-y-3">
            {resumeFull.education.map((e) => (
              <article key={e.school}>
                <h3 className="font-display text-xl font-bold">{e.school}</h3>
                <p className="font-body">{e.detail}</p>
                <p className="font-label text-xs uppercase tracking-[0.2em] text-accent">{e.dates}</p>
              </article>
            ))}
          </div>
        </Row>
        <Row id="resume-experience" title="Experience">
          <Entries entries={resumeFull.experience} />
        </Row>
        <Row id="resume-honours" title="Awards & competitions">
          <ul className="list-disc space-y-2 pl-5 font-body">
            {resumeFull.honours.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </Row>
        <Row id="resume-projects" title="Projects">
          <Entries entries={resumeFull.projects} />
        </Row>
        <Row id="resume-skills" title="Skills">
          <dl className="space-y-1 font-body">
            {resumeFull.skills.map((s) => (
              <div key={s.label}>
                <dt className="inline font-bold">{s.label}: </dt>
                <dd className="inline">{s.items}</dd>
              </div>
            ))}
          </dl>
        </Row>
      </div>
    </article>
  );
}
```

- [ ] **Step 5: `src/app/resume/page.tsx`**

```tsx
import type { Metadata } from 'next';
import { BackBar } from '@/components/back-bar';
import { Footer } from '@/components/footer';
import { ResumePage } from '@/components/resume-page';

export const metadata: Metadata = {
  title: 'Résumé | Raman Lamba',
  description: 'Résumé of Raman Lamba: finance and code, private credit, valuation and ML.',
};

export default function ResumeRoute() {
  return (
    <>
      <BackBar />
      <main id="main">
        <ResumePage />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 6: Run, expect pass**

Run: `npx vitest run src/content/resume-full.test.ts src/components/resume-page.test.tsx src/app/resume && npm run lint`
Expected: 2 + 1 + 1 tests pass, lint clean. (`getByRole('heading', { level: 3, name: new RegExp(r.org) })` matches the org even though the role text is inside the same `h3`.)

- [ ] **Step 7: Commit**

```bash
cd .. && git add site/src && git commit -m "feat: add resume page and structured resume data"
```
(append trailers)

---

### Task 5: Link the résumé page from the classifieds, then verify everything

**Files:**
- Modify: `site/src/components/classifieds.tsx`, `site/src/components/classifieds.test.tsx`

**Interfaces:**
- Produces: the classifieds section has two links: "Read the full résumé" to `/resume` and "Download the résumé (PDF)" to `site.resumePdf`.

- [ ] **Step 1: Update the test first.** In `classifieds.test.tsx` add, after the PDF link assertion:
```tsx
    expect(screen.getByRole('link', { name: /Read the full résumé/ })).toHaveAttribute('href', '/resume');
```
Run `npx vitest run src/components/classifieds.test.tsx`; expected FAIL.

- [ ] **Step 2: Implement.** In `classifieds.tsx` add `import { SmartLink } from './smart-link';` and replace the existing download `<a ...>...</a>` block with a wrapper holding both links:
```tsx
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        <SmartLink
          href="/resume"
          className="font-label text-sm font-semibold uppercase tracking-widest text-accent underline underline-offset-4"
        >
          Read the full résumé<span aria-hidden="true"> →</span>
        </SmartLink>
        <a
          href={site.resumePdf}
          download
          className="font-label text-sm font-semibold uppercase tracking-widest text-accent underline underline-offset-4"
        >
          Download the résumé (PDF)<span aria-hidden="true"> →</span>
        </a>
      </div>
```
(keep the existing import of `site`).

- [ ] **Step 3: Run the full suite, lint and build**

Run: `npx vitest run && npm run lint && npm run build`
Expected: all tests pass; build succeeds and its route list shows `/`, `/resume`, `/work/[slug]` with all 12 slugs prerendered (static), plus the not-found page. Report the route table.

- [ ] **Step 4: Visual and link check**

Start the production server in the background (`npm run start`). With `S=C:/Users/DeLL/AppData/Local/Temp/claude/4aba391c15a3e597/cb0fdf3d-6d28-4b06-a3f3-2b2c90d5b6ec/scratchpad` and Chrome at `/c/Program Files/Google/Chrome/Application/chrome.exe`, take screenshots (outside the repo) of: `/work/qiskit-portfolio-optimization` (desktop 1280x2200), `/work/spotify-campaign` (desktop 1280x1400, a page without a write-up), `/resume` (desktop 1280x2400), `/resume` in a 390px-wide iframe (helper HTML kept in the scratchpad folder; headless Chrome will not go below about 500px), and `/nope` (the 404 page, 1280x900). Read each image. Expected: a back bar with "← Front page" and the name, then the article (kicker, big title, credit, halftone plate, deck, numbers box, then The problem / The approach / The result / Built with); the résumé page with label-left, content-right rows and a dark "Download PDF" pill; the 404 page centred with "Page not found". Also use `curl -s -o /dev/null -w '%{http_code}'` to confirm 200 for `/`, `/resume`, `/work/gold-price-forecasting` and `/work/lecture-hall-booking`, and 404 for `/work/nope`. Stop the server; confirm port 3000 is free.

- [ ] **Step 5: Commit**

```bash
cd .. && git add site/src && git commit -m "feat: link resume page from classifieds"
```
(append trailers)

---

## Self-Review
- **Spec coverage (3a):** article pages per project with problem/approach/result/stack (spec section 3 routes and section 7 case studies, limited to verified facts); `/resume` page with PDF download and no phone number (spec sections 3, 8); classifieds open `/resume` (spec section 6); styled 404; all front-page links (`Continued on A3`, story cards, case-file lists, ads) now resolve. Review carry-overs done: ad landmark names, "More stories" outline, decorative arrow, dated bio. Not here by design: folder opening, fan-out, focus-and-dim, back pill, grain stacking and the `motion` library (plan 3b); real project images; markets strip and wire (phase 4); the stipple portrait and editorial drop cap (polish).
- **Placeholders:** none; every step has complete code and exact commands. Write-up copy is real, limited to facts verified from the repos, résumé and decks.
- **Type consistency:** `ProjectDetails` is defined once (types.ts) and used by `details.ts`, `queries.ts` and `ProjectArticle`; `getProject/getDetails/getProjectSlugs` are used by the route and tests with matching signatures; `resumeFull` entries share the `{ org, role, dates, bullets }` shape that `Entries` expects (`satisfies ResumeEntry[]`); `BackBar` and `Footer` are reused on all three new routes.
- **Known risks:** testing async server components with `render(await Page(...))` depends on the installed Vitest/React versions (Task 3 step 7 says what to do if it fails); under Cache Components, `notFound()` behaviour for unknown slugs is verified in the build/curl step; the `Options Strategy Simulator` result copy describes the designed game: the owner should confirm its current status before launch.
