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
