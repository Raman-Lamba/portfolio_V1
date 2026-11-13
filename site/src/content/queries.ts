import { projects } from './projects';
import { ads } from './ads';
import { sections, type Ad, type Project } from './types';

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

export function getFolders() {
  return sections.map((s) => ({ ...s, projects: projects.filter((p) => p.sections.includes(s.id)) }));
}
