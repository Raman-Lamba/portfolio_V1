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
  /** Public GitHub repository, only when the repo is public. */
  source?: string;
  /** Files served from /public/downloads. */
  downloads?: { label: string; href: string; note: string }[];
};

export type Bureau = { id: string; org: string; role: string; dates: string; summary: string };
export type Ad = { id: string; headline: string; body: string; cta: string; href: string };
export type Award = { id: string; title: string; credit: string; year: number };
export type ProductNotes = { user: string; decisions: string[]; measure: string };
export type ProjectDetails = {
  problem: string;
  approach: string;
  result: string;
  stack: string[];
  /** Product framing: who it is for, the trade-offs made and how success would be measured. */
  product?: ProductNotes;
};

export type ProjectFigure = { src: string; alt: string; caption: string; width: number; height: number };
