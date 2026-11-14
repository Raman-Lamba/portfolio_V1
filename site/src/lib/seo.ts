import { agents } from '@/content/agents';
import { site } from '@/content/site';

// Set NEXT_PUBLIC_SITE_URL to the real domain at deploy time.
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
export const abs = (path: string) => `${siteUrl}${path}`;

export function personJsonLd() {
  return {
    '@type': 'Person',
    '@id': abs('/#person'),
    name: site.name,
    url: abs('/'),
    image: abs(site.photo),
    jobTitle: 'Fintech engineer',
    description: agents.summary,
    email: site.email,
    address: { '@type': 'PostalAddress', addressLocality: 'Hyderabad', addressCountry: 'IN' },
    alumniOf: [
      { '@type': 'CollegeOrUniversity', name: 'Institute of Management Technology Hyderabad' },
      { '@type': 'CollegeOrUniversity', name: 'CRSSIET, NCR' },
    ],
    knowsAbout: agents.topics,
    sameAs: [site.linkedin, site.github],
  };
}

export function websiteJsonLd() {
  return {
    '@type': 'WebSite',
    '@id': abs('/#website'),
    url: abs('/'),
    name: `${site.name}: ${site.tagline}`,
    description: agents.description,
    inLanguage: 'en',
    publisher: { '@id': abs('/#person') },
  };
}

export function faqJsonLd() {
  return {
    '@type': 'FAQPage',
    mainEntity: agents.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
