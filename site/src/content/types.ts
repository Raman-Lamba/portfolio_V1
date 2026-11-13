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
export type ProjectDetails = { problem: string; approach: string; result: string; stack: string[] };
