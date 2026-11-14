import { Suspense } from 'react';
import { getAd, getLead, getStories } from '@/content/queries';
import { LiveMarkets, LiveWire } from './live-strip';
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
        <Suspense fallback={null}>
          <LiveMarkets />
        </Suspense>
        <Intro />
        <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <LeadStory project={lead} />
          <div className="space-y-4">
            <Ad ad={getAd('wanted')} layout="tall" />
            <Suspense fallback={null}>
              <LiveWire />
            </Suspense>
          </div>
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
