# Portfolio Phase 1: Scaffold Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A running Next.js site in `site/` with the paper/ink design tokens, fonts, a typed content model filled with real portfolio data, and a live-dated newspaper masthead.

**Architecture:** App lives in `site/` (repo root keeps content folders and docs). Content is typed TypeScript data in `site/src/content/`, validated by tests. A small pure function formats the dateline; a tiny client component shows it after mount so the build never freezes the date.

**Tech Stack:** Next.js (App Router, TypeScript, `src/` dir), Tailwind CSS v4 (CSS-first `@theme`), `next/font/google`, Vitest + Testing Library (jsdom).

Spec: `docs/superpowers/specs/2026-11-13-portfolio-design.md`. Phases 2-5 get separate plans.

## Global Constraints
- Masthead: name "Raman Lamba", tagline "Software for financial decisions", location "Hyderabad", availability "Open for freelance & full-time roles", "Vol. I, No. 1".
- Colours: paper `#efe6d0`, ink `#1b1612`, one accent oxblood `#8b1e1e`.
- Fonts: Playfair Display (headlines), Source Serif 4 (body), Barlow Condensed (labels), IBM Plex Mono (numbers).
- Contact: `ramanlamba2022@gmail.com`, `https://www.linkedin.com/in/raman-lamba/`, `https://github.com/Raman-Lamba`. **No phone number anywhere.**
- UBS Financial Challenge appears as a result only: no problem statement, solution or figures.
- No dependency that this phase does not use (the `motion` library is added in phase 3).
- Secrets never committed; `.env` is already git-ignored.
- Every commit message ends with these two lines:
  `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`
  `Claude-Session: https://claude.ai/code/session_018QB7mo8gTaSmrUpoNJB9Sc`
- Run all commands from `C:\Users\DeLL\Desktop\Portfolio\site` unless a step says otherwise.

## File Structure
- `site/vitest.config.ts`, `site/vitest.setup.ts`: test tooling.
- `site/src/lib/dateline.ts` (+ `.test.ts`): `formatDateline(date)`.
- `site/src/content/types.ts`: shared types and `sections`.
- `site/src/content/site.ts`: identity and contact data.
- `site/src/content/projects.ts`, `bureaus.ts`, `ads.ts`, `awards.ts`: the data.
- `site/src/content/content.test.ts`: validates the data and assets.
- `site/src/components/dateline.tsx`, `masthead.tsx` (+ `masthead.test.tsx`).
- `site/src/app/globals.css`, `layout.tsx`, `page.tsx`: tokens, fonts, home page.
- `site/public/images/raman.jpg`, `site/public/resume/RamanLamba_Resume_Fintech.pdf`: assets.

---

### Task 1: Scaffold the app and test tooling

**Files:**
- Create: `site/` (generated), `site/vitest.config.ts`, `site/vitest.setup.ts`
- Modify: `site/package.json` (scripts)

**Interfaces:**
- Produces: `npm test` (runs `vitest run`), alias `@` -> `site/src`.

- [ ] **Step 1: Generate the app**

Run from repo root `C:\Users\DeLL\Desktop\Portfolio`:
```bash
npx create-next-app@latest site --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes
```
Expected: `site/` created. If `site/.git` exists, delete it (the repo root already tracks everything).

- [ ] **Step 2: Install test tooling**

```bash
cd site && npm i -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: { environment: 'jsdom', setupFiles: ['./vitest.setup.ts'] },
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
});
```

- [ ] **Step 4: Create `vitest.setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(cleanup);
```

- [ ] **Step 5: Add the test script**

In `package.json` `scripts`, add `"test": "vitest run"`.

- [ ] **Step 6: Verify tooling and build**

Run: `npx vitest run --passWithNoTests && npm run build`
Expected: both succeed.

- [ ] **Step 7: Commit**

```bash
cd .. && git add site && git commit -m "feat: scaffold Next.js app with Vitest"
```
(append the two trailer lines from Global Constraints)

---

### Task 2: Dateline formatter (TDD)

**Files:**
- Create: `site/src/lib/dateline.ts`
- Test: `site/src/lib/dateline.test.ts`

**Interfaces:**
- Produces: `formatDateline(d: Date): string` returning e.g. `Friday, 13 November 2026`, using the Asia/Kolkata calendar date.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { formatDateline } from './dateline';

describe('formatDateline', () => {
  it('formats in newspaper style', () => {
    expect(formatDateline(new Date('2026-11-13T06:00:00Z'))).toBe('Friday, 13 November 2026');
  });
  it('uses the Hyderabad (IST) date, not UTC', () => {
    // 20:00 UTC on 13 Nov is 01:30 IST on 14 Nov
    expect(formatDateline(new Date('2026-11-13T20:00:00Z'))).toBe('Saturday, 14 November 2026');
  });
});
```

- [ ] **Step 2: Run it, expect failure**

Run: `npx vitest run src/lib/dateline.test.ts`
Expected: FAIL (module `./dateline` not found).

- [ ] **Step 3: Implement**

```ts
export function formatDateline(d: Date): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata',
  }).formatToParts(d);
  const p = Object.fromEntries(parts.map((x) => [x.type, x.value]));
  return `${p.weekday}, ${p.day} ${p.month} ${p.year}`;
}
```
Built from parts so the comma never depends on the ICU version.

- [ ] **Step 4: Run, expect pass**

Run: `npx vitest run src/lib/dateline.test.ts`
Expected: 2 passed.

- [ ] **Step 5: Commit**

```bash
git add site/src/lib && git commit -m "feat: add newspaper dateline formatter"
```
(append trailers)

---

### Task 3: Content model, data and assets (TDD)

**Files:**
- Create: `site/src/content/types.ts`, `site.ts`, `projects.ts`, `bureaus.ts`, `ads.ts`, `awards.ts`
- Create: `site/public/images/raman.jpg`, `site/public/resume/RamanLamba_Resume_Fintech.pdf` (copied)
- Test: `site/src/content/content.test.ts`

**Interfaces:**
- Produces: `Section`, `sections`, `Metric`, `Project`, `Bureau`, `Ad`, `Award` (types.ts); `site` (site.ts); `projects: Project[]`; `bureaus: Bureau[]`; `ads: Ad[]`; `awards: Award[]`.

- [ ] **Step 1: Copy assets** (from repo root)

```bash
mkdir -p site/public/images site/public/resume
cp "Photo/WhatsApp Image 2026-11-13 at 6.11.29 PM.jpeg" site/public/images/raman.jpg
cp resume/RamanLamba_Resume_Fintech.pdf site/public/resume/RamanLamba_Resume_Fintech.pdf
```

- [ ] **Step 2: Write the failing test** `site/src/content/content.test.ts`

```ts
import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { sections } from './types';
import { site } from './site';
import { projects } from './projects';
import { bureaus } from './bureaus';
import { ads } from './ads';
import { awards } from './awards';

const everything = JSON.stringify({ site, projects, bureaus, ads, awards });

describe('content', () => {
  it('has unique project slugs', () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
  it('puts every project in at least one known section', () => {
    const ids = sections.map((s) => s.id);
    for (const p of projects) {
      expect(p.sections.length).toBeGreaterThan(0);
      for (const s of p.sections) expect(ids).toContain(s);
    }
  });
  it('has every section populated', () => {
    for (const s of sections) expect(projects.some((p) => p.sections.includes(s.id))).toBe(true);
  });
  it('has exactly one lead story', () => {
    expect(projects.filter((p) => p.lead)).toHaveLength(1);
  });
  it('gives every project a credit line', () => {
    for (const p of projects) expect(p.credit.length).toBeGreaterThan(0);
  });
  it('has three ads that link to the contact block or a real project', () => {
    expect(ads).toHaveLength(3);
    const slugs = projects.map((p) => `/work/${p.slug}`);
    for (const a of ads) expect(a.href === '#contact' || slugs.includes(a.href)).toBe(true);
  });
  it('has three bureaus and three awards', () => {
    expect(bureaus).toHaveLength(3);
    expect(awards).toHaveLength(3);
  });
  it('contains no phone number', () => {
    expect(everything).not.toMatch(/\d{10}/);
  });
  it('shows UBS as a result only', () => {
    expect(everything.match(/UBS/g)).toHaveLength(1);
    expect(awards.find((a) => a.id === 'ubs')).toEqual({
      id: 'ubs', title: 'First place, UBS Financial Challenge', credit: 'Team Cygnus', year: 2026,
    });
  });
  it('points to assets that exist', () => {
    expect(existsSync(path.join(__dirname, '..', '..', 'public', site.photo))).toBe(true);
    expect(existsSync(path.join(__dirname, '..', '..', 'public', site.resumePdf))).toBe(true);
  });
});
```

- [ ] **Step 3: Run it, expect failure**

Run: `npx vitest run src/content`
Expected: FAIL (modules not found).

- [ ] **Step 4: Create `types.ts`**

```ts
export type Section = 'finance' | 'ml-ai' | 'web' | 'marketing';

export const sections: { id: Section; label: string }[] = [
  { id: 'finance', label: 'Finance' },
  { id: 'ml-ai', label: 'ML & AI' },
  { id: 'web', label: 'Web' },
  { id: 'marketing', label: 'Marketing' },
];

export type Metric = { value: string; label: string };

export type Project = {
  slug: string;
  title: string;
  kicker: string;
  deck: string;
  sections: Section[];
  credit: string;
  year: number;
  lead?: boolean;
  metrics: Metric[];
  link?: { label: string; href: string };
};

export type Bureau = { id: string; org: string; role: string; dates: string; summary: string };
export type Ad = { id: string; headline: string; body: string; cta: string; href: string };
export type Award = { id: string; title: string; credit: string; year: number };
```

- [ ] **Step 5: Create `site.ts`**

```ts
export const site = {
  name: 'Raman Lamba',
  tagline: 'Software for financial decisions',
  location: 'Hyderabad',
  availability: 'Open for freelance & full-time roles',
  volume: 'Vol. I, No. 1',
  email: 'ramanlamba2022@gmail.com',
  linkedin: 'https://www.linkedin.com/in/raman-lamba/',
  github: 'https://github.com/Raman-Lamba',
  photo: '/images/raman.jpg',
  resumePdf: '/resume/RamanLamba_Resume_Fintech.pdf',
} as const;
```

- [ ] **Step 6: Create `projects.ts`**

```ts
import type { Project } from './types';

export const projects: Project[] = [
  {
    slug: 'qiskit-portfolio-optimization',
    title: 'Quantum Portfolio Optimization',
    kicker: 'Finance · Quantum',
    deck: 'QAOA that picks stocks under a sector cap, checked against brute force and classical methods, and run on real IBM hardware.',
    sections: ['finance', 'ml-ai'],
    credit: 'Solo entry · Winner, Qiskit Fall Fest 2026',
    year: 2026,
    lead: true,
    metrics: [
      { value: '3.7-20x', label: 'vs penalty QAOA (12 stocks)' },
      { value: '184,756', label: 'portfolios brute-forced (20 stocks)' },
    ],
  },
  {
    slug: 'gold-price-forecasting',
    title: 'Gold Price Forecasting',
    kicker: 'Finance · ML',
    deck: 'A probabilistic CNN-LSTM that forecasts gold under uncertainty and drives a risk-based trading strategy.',
    sections: ['finance', 'ml-ai'],
    credit: 'Solo project',
    year: 2026,
    metrics: [
      { value: '54-58%', label: 'directional accuracy, 5-day' },
      { value: '18%', label: 'backtested strategy return' },
      { value: '3,939', label: 'trading days' },
    ],
  },
  {
    slug: 'options-strategy-simulator',
    title: 'Options Strategy Simulator',
    kicker: 'Finance · Web',
    deck: 'A game on real NSE F&O data: pick a strategy, then see realized P&L for all ten.',
    sections: ['finance', 'web'],
    credit: 'Solo project',
    year: 2026,
    metrics: [
      { value: '10', label: 'strategies scored per round' },
      { value: '2019-24', label: 'NSE data window' },
    ],
  },
  {
    slug: 'trade-simulator',
    title: 'Trade Simulator',
    kicker: 'Finance · ML',
    deck: 'Real-time trade analytics: an online-learning slippage model, Almgren-Chriss market impact and a maker/taker classifier.',
    sections: ['finance', 'ml-ai'],
    credit: 'Solo project',
    year: 2025,
    metrics: [{ value: '3', label: 'models in one live pipeline' }],
  },
  {
    slug: 'deribit-oms',
    title: 'Deribit Order Management System',
    kicker: 'Finance · Systems',
    deck: 'A C++ client that places, cancels and modifies orders on Deribit testnet and serves a live order book over WebSocket.',
    sections: ['finance'],
    credit: 'Solo project',
    year: 2024,
    metrics: [{ value: '1 s', label: 'order-book refresh' }],
  },
  {
    slug: 'asian-paints-valuation',
    title: 'Asian Paints Valuation',
    kicker: 'Finance · Equity',
    deck: 'FCFF DCF, two-stage DDM and peer multiples against Berger Paints and Kansai Nerolac.',
    sections: ['finance'],
    credit: 'Solo project',
    year: 2026,
    metrics: [
      { value: '13.7%', label: 'WACC' },
      { value: 'Rs 586', label: 'intrinsic value vs ~Rs 2,580 CMP' },
    ],
  },
  {
    slug: 'apl-apollo-research-challenge',
    title: 'APL Apollo Tubes Research Report',
    kicker: 'Finance · Equity',
    deck: 'Team equity research report for the CFA Institute Research Challenge; I built the relative valuation.',
    sections: ['finance'],
    credit: 'Team submission · Relative valuation',
    year: 2026,
    metrics: [{ value: '16', label: 'page report' }],
  },
  {
    slug: 'lecture-hall-booking',
    title: 'Lecture Hall Booking',
    kicker: 'Web',
    deck: 'A booking system shown as an interactive 3D building, with a database rule that makes double-booking impossible.',
    sections: ['web'],
    credit: 'Solo project',
    year: 2026,
    metrics: [{ value: '11', label: 'rooms across 3 floors' }],
    link: { label: 'Live site', href: 'https://lecture-hall-booking.vercel.app' },
  },
  {
    slug: 'ai-interviewer',
    title: 'AI Interviewer',
    kicker: 'AI',
    deck: 'A voice interviewer using speech-to-text, an LLM and text-to-speech, with an evaluation script.',
    sections: ['ml-ai'],
    credit: 'Solo project',
    year: 2025,
    metrics: [{ value: '3', label: 'speech-to-text options' }],
  },
  {
    slug: 'mindbloom',
    title: 'MindBloom',
    kicker: 'AI · Web',
    deck: 'A RAG chatbot grounded in a psychology book, with sign-in and chat history.',
    sections: ['ml-ai', 'web'],
    credit: 'Solo project',
    year: 2025,
    metrics: [{ value: 'RAG', label: 'answers retrieved from the book' }],
  },
  {
    slug: 'sales-forecasting',
    title: 'Sales Forecasting',
    kicker: 'ML',
    deck: 'A Prophet-based forecasting app, with ARIMA, LSTM and XGBoost compared honestly.',
    sections: ['ml-ai'],
    credit: 'Solo project',
    year: 2025,
    metrics: [{ value: '4', label: 'models compared' }],
  },
  {
    slug: 'spotify-campaign',
    title: 'Spotify: Every Version of You Has a Soundtrack',
    kicker: 'Marketing',
    deck: 'A print and video campaign concept built on hyper-personalization.',
    sections: ['marketing'],
    credit: 'Team project · Contributor, pages 1-4',
    year: 2026,
    metrics: [{ value: '2', label: 'executions: print and video' }],
  },
];
```

- [ ] **Step 7: Create `bureaus.ts`**

```ts
import type { Bureau } from './types';

export const bureaus: Bureau[] = [
  {
    id: 'oxane',
    org: 'Oxane Partners',
    role: 'Summer Intern, Private Credit',
    dates: 'Apr - Jun 2026',
    summary: "Deal analysis, modelling and onboarding on Oxane's native architecture through a dynamic, metadata-driven design.",
  },
  {
    id: 'jivika',
    org: 'Jivika',
    role: 'Developer',
    dates: 'Jun 2025',
    summary: 'Built backend for an AI job-candidate matching system with embeddings and vector search.',
  },
  {
    id: 'coding-blocks',
    org: 'Coding Blocks',
    role: 'Teaching Assistant',
    dates: 'Aug 2024 - Feb 2025',
    summary: 'Twice-weekly DSA doubt sessions for students, plus interview assistance.',
  },
];
```

- [ ] **Step 8: Create `ads.ts`**

```ts
import type { Ad } from './types';

export const ads: Ad[] = [
  {
    id: 'wanted',
    headline: 'WANTED: a developer who reads balance sheets',
    body: 'Inquire within.',
    cta: 'Clip the coupon',
    href: '#contact',
  },
  {
    id: 'backtest',
    headline: 'Backtest before you bet',
    body: 'Probabilistic gold forecasts, with the uncertainty shown.',
    cta: 'Read the story',
    href: '/work/gold-price-forecasting',
  },
  {
    id: 'quantum',
    headline: 'Quantum portfolios, now in stock',
    body: 'Winner, Qiskit Fall Fest 2026.',
    cta: 'Read the story',
    href: '/work/qiskit-portfolio-optimization',
  },
];
```

- [ ] **Step 9: Create `awards.ts`**

```ts
import type { Award } from './types';

export const awards: Award[] = [
  { id: 'ubs', title: 'First place, UBS Financial Challenge', credit: 'Team Cygnus', year: 2026 },
  { id: 'qiskit', title: 'Winner, Qiskit Fall Fest 2026 (IIIT-Delhi)', credit: 'Solo entry', year: 2026 },
  { id: 'cfa', title: 'CFA Institute Research Challenge', credit: 'Team submission, IMT Hyderabad', year: 2026 },
];
```

- [ ] **Step 10: Run, expect pass**

Run: `npx vitest run src/content`
Expected: 10 passed.

- [ ] **Step 11: Commit**

```bash
cd .. && git add site && git commit -m "feat: add typed content data and assets"
```
(append trailers)

---

### Task 4: Design tokens, fonts and masthead (TDD)

**Files:**
- Create: `site/src/components/dateline.tsx`, `site/src/components/masthead.tsx`
- Modify: `site/src/app/globals.css` (replace), `site/src/app/layout.tsx` (replace), `site/src/app/page.tsx` (replace)
- Test: `site/src/components/masthead.test.tsx`

**Interfaces:**
- Consumes: `site` from `@/content/site`; `formatDateline(d: Date): string` from `@/lib/dateline`.
- Produces: `<Dateline now?: Date className?: string />` (client); `<Masthead now?: Date />`; Tailwind classes `bg-paper`, `text-ink`, `border-ink`, `text-accent`, `font-display`, `font-body`, `font-label`, `font-mono`.

- [ ] **Step 1: Write the failing test** `masthead.test.tsx`

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Masthead } from './masthead';

describe('Masthead', () => {
  it('shows name, tagline, availability, location and the live date', () => {
    render(<Masthead now={new Date('2026-11-13T06:00:00Z')} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Raman Lamba' })).toBeInTheDocument();
    expect(screen.getByText('Software for financial decisions')).toBeInTheDocument();
    expect(screen.getByText('Open for freelance & full-time roles')).toBeInTheDocument();
    expect(screen.getByText('Hyderabad')).toBeInTheDocument();
    expect(screen.getByText('Friday, 13 November 2026')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it, expect failure**

Run: `npx vitest run src/components`
Expected: FAIL (module `./masthead` not found).

- [ ] **Step 3: Create `dateline.tsx`**

```tsx
'use client';
import { useEffect, useState } from 'react';
import { formatDateline } from '@/lib/dateline';

// Set after mount so the statically built page never freezes the date.
export function Dateline({ now, className }: { now?: Date; className?: string }) {
  const [text, setText] = useState('');
  useEffect(() => setText(formatDateline(now ?? new Date())), [now]);
  return (
    <time className={className} suppressHydrationWarning>
      {text}
    </time>
  );
}
```

- [ ] **Step 4: Create `masthead.tsx`**

```tsx
import { site } from '@/content/site';
import { Dateline } from './dateline';

export function Masthead({ now }: { now?: Date }) {
  return (
    <header className="border-b-[6px] border-double border-ink px-4 py-3">
      <div className="flex justify-between gap-4 font-label text-xs uppercase tracking-[0.18em]">
        <p>{site.availability}</p>
        <p className="text-right">
          <span className="block">{site.location}</span>
          <Dateline now={now} className="block min-h-[1em]" />
          <span className="block">{site.volume}</span>
        </p>
      </div>
      <h1 className="mt-2 text-center font-display text-5xl font-black tracking-tight sm:text-7xl">
        {site.name}
      </h1>
      <p className="mt-1 text-center font-label text-sm uppercase tracking-[0.3em]">{site.tagline}</p>
    </header>
  );
}
```

- [ ] **Step 5: Replace `globals.css`**

```css
@import "tailwindcss";

@theme inline {
  --color-paper: #efe6d0;
  --color-ink: #1b1612;
  --color-accent: #8b1e1e;
  --font-display: var(--font-playfair), Georgia, serif;
  --font-body: var(--font-source), Georgia, serif;
  --font-label: var(--font-barlow), "Arial Narrow", sans-serif;
  --font-mono: var(--font-plex), ui-monospace, monospace;
}

body {
  background: var(--color-paper);
  color: var(--color-ink);
  font-family: var(--font-body);
}

/* faint paper grain */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  opacity: 0.07;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
}

@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```

- [ ] **Step 6: Replace `layout.tsx`**

```tsx
import type { Metadata } from 'next';
import { Playfair_Display, Source_Serif_4, Barlow_Condensed, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', weight: ['700', '900'] });
const source = Source_Serif_4({ subsets: ['latin'], variable: '--font-source' });
const barlow = Barlow_Condensed({ subsets: ['latin'], variable: '--font-barlow', weight: ['500', '600', '700'] });
const plex = IBM_Plex_Mono({ subsets: ['latin'], variable: '--font-plex', weight: ['400', '500'] });

export const metadata: Metadata = {
  title: 'Raman Lamba | Software for financial decisions',
  description: 'Finance and code: models, simulators and tools for financial decisions. Open for freelance and full-time roles.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${source.variable} ${barlow.variable} ${plex.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 7: Replace `page.tsx`**

```tsx
import { Masthead } from '@/components/masthead';

export default function Home() {
  return (
    <>
      <Masthead />
      <main className="mx-auto max-w-6xl px-4" />
    </>
  );
}
```

- [ ] **Step 8: Run, expect pass**

Run: `npx vitest run`
Expected: all tests pass (dateline 2, content 10, masthead 1).

- [ ] **Step 9: Commit**

```bash
cd .. && git add site && git commit -m "feat: add design tokens, fonts and masthead"
```
(append trailers)

---

### Task 5: Verify the running site

**Files:** none changed unless a check fails.

- [ ] **Step 1: Lint and build**

Run: `npm run lint && npm run build`
Expected: both succeed. Fix anything reported, then re-run.

- [ ] **Step 2: Serve and screenshot**

```bash
npm run start &
sleep 5
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --window-size=1280,500 --virtual-time-budget=4000 --screenshot=masthead.png http://localhost:3000
```
Expected: `masthead.png` shows cream paper, the large serif name, tagline, the left ear with availability and the right ear with Hyderabad, today's date and "Vol. I, No. 1", and a double rule underneath. Stop the server afterwards and delete `masthead.png` (or move it outside the repo).

- [ ] **Step 3: Check the date is live**

The date in the screenshot must be today's, not the build date. If it is empty, the `virtual-time-budget` was too short; re-run with a larger value before concluding it is broken.

- [ ] **Step 4: Confirm nothing sensitive is tracked**

Run (repo root): `git ls-files | grep -iE "\.env|node_modules" ; echo done`
Expected: only `done` printed.

- [ ] **Step 5: Commit any fixes** (skip if none)

```bash
git add site && git commit -m "fix: address lint and build findings"
```
(append trailers)

---

## Self-Review
- **Spec coverage (phase 1 only):** stack and tooling (Task 1), content as typed data with real credits, solo/team labels and result-only UBS (Task 3), tokens, fonts, grain, reduced-motion (Task 4), masthead with ears, tagline, live date and volume (Task 4), assets, résumé without phone (Task 3). Phases 2-5 (components, folders, routes, live feeds, polish) are deliberately out of scope here.
- **Placeholders:** none. Every code step has full code.
- **Type consistency:** `Dateline` takes `now?: Date` and `className?: string`; `Masthead` takes `now?: Date` and passes it through; `formatDateline(d: Date): string` is used with that signature; `site.photo` and `site.resumePdf` are defined in Task 3 and tested there.
- **Known risk:** `create-next-app` may generate a slightly different default layout or CSS than assumed; Tasks 4's files are full replacements, so this only matters if the generated `eslint` config flags them.
