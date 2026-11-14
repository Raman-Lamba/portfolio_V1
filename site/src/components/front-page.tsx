import { Suspense } from 'react';
import { getAd, getLead, getStories } from '@/content/queries';
import { LiveMarkets, LiveWire } from './live-strip';
import { LiveMarketReport } from './market-report';
import { Ad } from './ad';
import { Bureaus } from './bureaus';
import { CaseFiles } from './case-files';
import { Classifieds } from './classifieds';
import { Footer } from './footer';
import { IndexBox } from './index-box';
import { Intro } from './intro';
import { LeadStory } from './lead-story';
import { Letters } from './letters';
import { ResumeDocs } from './resume-docs';
import { SportsDesk } from './sports-desk';
import { StoryCard } from './story-card';

export function FrontPage() {
  const lead = getLead();
  const stories = getStories();
  return (
    <>
      <main id="main" className="mx-auto max-w-6xl px-4 py-6">
        <IndexBox />
        {/* live strips are fetched in the browser; on paper they would be stale, so the print edition drops them */}
        <div className="print:hidden">
          <Suspense fallback={null}>
            <LiveMarkets />
          </Suspense>
        </div>
        <Intro />
        <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <LeadStory project={lead} />
          <div className="space-y-4">
            <div className="print:hidden">
              <Suspense fallback={null}>
                <LiveWire />
              </Suspense>
            </div>
            <section aria-labelledby="stories-heading">
              <h2
                id="stories-heading"
                className="border-b-2 border-ink pb-1 font-label text-sm font-semibold uppercase tracking-[0.3em]"
              >
                <span className="sr-only">More stories</span>
                <span aria-hidden="true">Also in this edition</span>
              </h2>
              <div className="divide-y divide-ink">
                {stories.map((s) => (
                  <StoryCard key={s.slug} project={s} />
                ))}
              </div>
              <p className="border-t-2 border-ink pt-2 text-right">
                <a
                  href="#files"
                  className="font-label text-sm font-semibold uppercase tracking-widest text-accent underline underline-offset-4"
                >
                  See all work in the archive<span aria-hidden="true"> →</span>
                </a>
              </p>
            </section>
          </div>
        </div>
        <div className="print:hidden">
          <Suspense fallback={null}>
            <LiveMarketReport />
          </Suspense>
        </div>
        <div className="mt-6">
          <Ad ad={getAd('wanted')} layout="wide" />
        </div>
        <CaseFiles />
        <Bureaus />
        <div className="mt-8">
          <Ad ad={getAd('backtest')} layout="wide" />
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:divide-x lg:divide-ink">
          <div className="space-y-8 lg:pr-6">
            <Classifieds />
            <SportsDesk />
          </div>
          <div className="space-y-8 lg:pl-6">
            <Letters />
            <ResumeDocs />
          </div>
        </div>
        <div className="mt-8">
          <Ad ad={getAd('quantum')} layout="wide" />
        </div>
      </main>
      <Footer />
    </>
  );
}
