import type { MetadataRoute } from 'next';
import { abs } from '@/lib/seo';

// Everything is public and welcome, including the AI crawlers.
const crawlers = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'PerplexityBot', 'Google-Extended', 'CCBot'];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }, ...crawlers.map((userAgent) => ({ userAgent, allow: '/' }))],
    sitemap: abs('/sitemap.xml'),
  };
}
