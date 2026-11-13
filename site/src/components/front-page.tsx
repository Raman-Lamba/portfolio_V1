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
