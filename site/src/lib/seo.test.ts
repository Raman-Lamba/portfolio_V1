import { describe, it, expect } from 'vitest';
import { abs, faqJsonLd, personJsonLd } from './seo';
import { llmsText } from './llms';
import { agents } from '@/content/agents';
import { projects } from '@/content/projects';
import robots from '@/app/robots';
import sitemap from '@/app/sitemap';

describe('seo helpers', () => {
  it('builds absolute urls', () => {
    expect(abs('/resume')).toMatch(/^https?:\/\/.+\/resume$/);
  });
  it('describes the person with real, checkable facts', () => {
    const p = personJsonLd();
    expect(p.name).toBe('Raman Lamba');
    expect(p.sameAs.join(' ')).toContain('github.com/Raman-Lamba');
    expect(p.knowsAbout).toContain('QAOA');
  });
  it('turns every FAQ entry into a question with an answer', () => {
    const faq = faqJsonLd();
    expect(faq.mainEntity).toHaveLength(agents.faq.length);
    expect(faq.mainEntity[0].acceptedAnswer.text.length).toBeGreaterThan(20);
  });
  it('keeps the private details out of everything it publishes', () => {
    const all = JSON.stringify([personJsonLd(), agents]) + llmsText();
    expect(all).not.toMatch(/\+?\d[\d ]{8,}\d/);
    expect(all).not.toMatch(/problem statement|settlement instruction/i);
    // the case competition is named once, as a result (in the FAQ), and nowhere else
    expect(JSON.stringify(agents).match(/UBS/g) ?? []).toHaveLength(1);
    expect(llmsText()).not.toMatch(/UBS/);
  });
});

describe('llms.txt', () => {
  it('links the fact sheet and every project', () => {
    const t = llmsText();
    expect(t.startsWith('# Raman Lamba')).toBe(true);
    expect(t).toContain('/for-agents');
    for (const p of projects) expect(t).toContain(`/work/${p.slug}`);
  });
});

describe('robots and sitemap', () => {
  it('welcomes crawlers, including AI ones, and points at the sitemap', () => {
    const r = robots();
    const agentsSeen = (r.rules as { userAgent: string }[]).map((x) => x.userAgent);
    expect(agentsSeen).toEqual(expect.arrayContaining(['*', 'GPTBot', 'ClaudeBot']));
    expect(r.sitemap).toContain('/sitemap.xml');
  });
  it('lists the home page, the fact sheet, the résumé and every project', () => {
    const urls = sitemap().map((s) => s.url);
    expect(urls.some((u) => u.endsWith('/for-agents'))).toBe(true);
    expect(urls.filter((u) => u.includes('/work/'))).toHaveLength(projects.length);
  });
});
