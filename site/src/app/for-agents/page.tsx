import type { Metadata } from 'next';
import { BackBar } from '@/components/back-bar';
import { Footer } from '@/components/footer';
import { JsonLd } from '@/components/json-ld';
import { SectionHeading } from '@/components/section-heading';
import { SmartLink } from '@/components/smart-link';
import { agents } from '@/content/agents';
import { projects } from '@/content/projects';
import { site } from '@/content/site';
import { abs, faqJsonLd, personJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  title: agents.title,
  description: agents.description,
  alternates: { canonical: '/for-agents' },
};

const link = 'underline underline-offset-4 hover:text-accent';

export default function ForAgentsPage() {
  return (
    <>
      <BackBar />
      <main id="main" className="page-in mx-auto max-w-3xl px-4 py-8">
        <JsonLd data={[personJsonLd(), faqJsonLd()]} />
        <p className="font-label text-sm font-semibold uppercase tracking-[0.25em] text-accent">
          Fact sheet · for recruiters, engineers and AI agents
        </p>
        <h1 className="mt-1 font-display text-5xl font-bold leading-[1.02] sm:text-6xl">
          {site.name}: AI and finance in one engineer
        </h1>
        <p className="mt-4 font-body text-lg leading-relaxed">{agents.summary}</p>
        <p className="mt-3 font-body italic">
          Everything here is also on the main pages. This page states it plainly, in one place, so it can be read, cited and
          indexed. Machine-readable versions: <a className={link} href="/llms.txt">llms.txt</a> and{' '}
          <a className={link} href="/sitemap.xml">sitemap.xml</a>.
        </p>

        <section aria-labelledby="can-heading" className="mt-8">
          <SectionHeading id="can-heading">What he can do</SectionHeading>
          <ul className="mt-3 space-y-3 font-body text-lg leading-snug">
            {agents.can.map((c) => (
              <li key={c.lead}>
                <strong className="font-label uppercase tracking-wide">{c.lead}</strong> {c.text}
                {c.slug && (
                  <>
                    {' '}
                    <SmartLink href={`/work/${c.slug}`} className={`${link} text-accent`}>
                      Read the write-up<span aria-hidden="true"> →</span>
                    </SmartLink>
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="faq-heading" className="mt-8">
          <SectionHeading id="faq-heading">Questions and answers</SectionHeading>
          <div className="mt-3 space-y-4">
            {agents.faq.map((f) => (
              <div key={f.q}>
                <h3 className="font-display text-xl font-bold">{f.q}</h3>
                <p className="font-body text-lg leading-snug">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="work-heading" className="mt-8">
          <SectionHeading id="work-heading">Work index</SectionHeading>
          <ul className="mt-3 space-y-2 font-body">
            {projects.map((p) => (
              <li key={p.slug}>
                <SmartLink href={`/work/${p.slug}`} className={`${link} font-semibold`}>
                  {p.title}
                </SmartLink>
                {`: ${p.deck}`}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="facts-heading" className="mt-8">
          <SectionHeading id="facts-heading">Facts at a glance</SectionHeading>
          <dl className="mt-3 grid gap-x-6 gap-y-2 font-body sm:grid-cols-[10rem_1fr]">
            <dt className="font-label uppercase tracking-widest">Name</dt>
            <dd>{site.name}</dd>
            <dt className="font-label uppercase tracking-widest">Based in</dt>
            <dd>{site.location}, India</dd>
            <dt className="font-label uppercase tracking-widest">Studying</dt>
            <dd>MBA (Finance), IMT Hyderabad, 2025-2027 (GPA 9.14)</dd>
            <dt className="font-label uppercase tracking-widest">Degree</dt>
            <dd>B.Tech, Computer Science, CRSSIET (2021-2025)</dd>
            <dt className="font-label uppercase tracking-widest">Looking for</dt>
            <dd>Freelance projects and full-time roles in fintech</dd>
            <dt className="font-label uppercase tracking-widest">Contact</dt>
            <dd>
              <a className={link} href={`mailto:${site.email}`}>{site.email}</a>
            </dd>
            <dt className="font-label uppercase tracking-widest">Elsewhere</dt>
            <dd>
              <a className={link} href={site.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              {' · '}
              <a className={link} href={site.github} target="_blank" rel="noopener noreferrer">GitHub</a>
              {' · '}
              <SmartLink href="/resume" className={link}>Résumé</SmartLink>
            </dd>
            <dt className="font-label uppercase tracking-widest">Canonical</dt>
            <dd>{abs('/')}</dd>
          </dl>
        </section>
      </main>
      <Footer />
    </>
  );
}
