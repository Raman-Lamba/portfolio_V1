import type { MetadataRoute } from 'next';
import { getProjectSlugs } from '@/content/queries';
import { abs } from '@/lib/seo';

const updated = new Date('2026-11-14');

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: '/', priority: 1 },
    { path: '/for-agents', priority: 0.9 },
    { path: '/resume', priority: 0.8 },
    ...getProjectSlugs().map((slug) => ({ path: `/work/${slug}`, priority: 0.7 })),
  ];
  return pages.map((p) => ({ url: abs(p.path), lastModified: updated, priority: p.priority }));
}
