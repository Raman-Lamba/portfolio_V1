import Image from 'next/image';
import { about } from '@/content/about';
import { site } from '@/content/site';
import { InkDust } from './ink-dust';
import { SmartLink } from './smart-link';

const cta =
  'inline-block border-2 border-ink px-4 py-3 font-label text-sm uppercase tracking-widest transition duration-100 active:scale-[0.97] hover:border-accent hover:bg-accent hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

export function Intro() {
  return (
    <section id="intro" aria-labelledby="intro-heading" className="mt-6 border-b-2 border-ink pb-6">
      <div className="grid gap-6 md:grid-cols-[12rem_1fr] md:gap-x-8">
        <figure>
          {/* the halftone portrait loosens into ink dust as it scrolls off the top of the page */}
          <InkDust source="image" className="w-36 md:w-full">
            <Image
              src={site.portrait.src}
              alt={`Portrait of ${site.name}`}
              width={site.portrait.width}
              height={site.portrait.height}
              sizes="(min-width: 768px) 12rem, 9rem"
              priority
              className="h-auto w-full border border-ink bg-paper"
            />
          </InkDust>
          <figcaption className="mt-1 border-b border-ink pb-1 font-body text-xs italic">
            {site.name}, MBA (Finance) candidate at IMT Hyderabad.
          </figcaption>
        </figure>
        <div className="@container">
          <h2
            id="intro-heading"
            className="whitespace-nowrap font-display text-[clamp(1.1rem,5.4cqw,4rem)] font-bold leading-[1.05]"
          >
            {about.headline}
          </h2>
          <div className="mt-4 font-body text-lg leading-[1.45] md:columns-2 md:gap-8 md:[column-rule:1px_solid_var(--color-ink)]">
            {about.paragraphs.map((p) => (
              <p key={p} className="hyphens-auto md:text-justify [&:not(:first-child)]:indent-5">
                {p}
              </p>
            ))}
          </div>
          <aside
            aria-labelledby="brief-heading"
            className="mt-5 border-y-4 border-double border-ink py-4 md:grid md:grid-cols-[1fr_auto] md:items-end md:gap-8"
          >
            <div>
              <h3 id="brief-heading" className="font-label text-xs font-semibold uppercase tracking-[0.3em]">
                {about.brief.heading}
              </h3>
              <p className="mt-1 font-display text-2xl italic leading-tight">{about.pullQuote}</p>
              <ul className="mt-3 space-y-1.5 font-body leading-snug">
                {about.brief.items.map((b) => (
                  <li key={b.lead} className="flex gap-2">
                    <span aria-hidden="true" className="mt-[0.45em] h-1.5 w-1.5 shrink-0 bg-accent" />
                    <span>
                      <strong className="font-label uppercase tracking-wide">{b.lead}</strong> {b.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4 flex gap-3 md:mt-0 md:flex-col">
              <SmartLink href="#contact" className={`${cta} flex-1 border-burnt bg-burnt text-center text-paper md:flex-none`}>
                Hire me
              </SmartLink>
              <SmartLink href="/resume" className={`${cta} flex-1 text-center md:flex-none`}>
                Résumé
              </SmartLink>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
