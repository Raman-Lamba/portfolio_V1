import { projects } from './projects';
import { ads } from './ads';
import { projectDetails } from './details';
import { projectFigures } from './figures';
import { sections, type Ad, type Project, type ProjectDetails, type ProjectFigure, type Section } from './types';

const STORY_SLUGS = ['qiskit-portfolio-optimization', 'gold-price-forecasting', 'options-strategy-simulator'];

function bySlug(slug: string): Project {
  const p = projects.find((x) => x.slug === slug);
  if (!p) throw new Error(`Unknown project slug: ${slug}`);
  return p;
}

// A project that won something gets the "Winner" stamp wherever it appears on the front page.
export const isWinner = (p: Project) => /winner|first place/i.test(p.credit);

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

export function getProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getDetails(slug: string): ProjectDetails | undefined {
  return projectDetails[slug];
}

export function getFigures(slug: string): ProjectFigure[] {
  return projectFigures[slug] ?? [];
}

// Up to `n` other projects that share a section with this one, nearest sections first.
export function getRelated(slug: string, n = 3): Project[] {
  const me = getProject(slug);
  if (!me) return [];
  const seen = new Set<string>([slug]);
  const out: Project[] = [];
  for (const s of me.sections) {
    for (const p of projects) {
      if (out.length >= n) return out;
      if (!seen.has(p.slug) && p.sections.includes(s)) {
        seen.add(p.slug);
        out.push(p);
      }
    }
  }
  return out;
}

export type Clipping = {
  slug: string;
  title: string;
  kicker: string;
  credit: string;
  figure?: ProjectFigure;
};

export type FolderClippings = { id: Section; label: string; clippings: Clipping[] };

export function getFolderClippings(): FolderClippings[] {
  return getFolders().map((f) => ({
    id: f.id,
    label: f.label,
    clippings: f.projects.map((p) => ({
      slug: p.slug,
      title: p.title,
      kicker: p.kicker,
      credit: p.credit,
      figure: getFigures(p.slug)[0],
    })),
  }));
}
