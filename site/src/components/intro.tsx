import Image from 'next/image';
import { about } from '@/content/about';
import { site } from '@/content/site';
import { SmartLink } from './smart-link';

const cta =
  'inline-block border-2 border-ink px-4 py-2 font-label text-sm uppercase tracking-widest transition duration-100 active:scale-[0.97] hover:border-accent hover:bg-accent hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

export function Intro() {
  return (
    <section id="intro" aria-labelledby="intro-heading" className="mt-6 border-b-2 border-ink pb-6">
      <div className="grid gap-6 md:grid-cols-[10rem_1fr] md:grid-rows-[auto_1fr] md:gap-x-6 md:gap-y-4">
        <Image
          src={site.photo}
          alt={`Portrait of ${site.name}`}
          width={590}
          height={845}
          className="h-auto w-32 border border-ink grayscale contrast-125 md:w-40"
        />
        <div className="@container md:col-start-2 md:row-span-2 md:row-start-1">
          <h2
            id="intro-heading"
            className="whitespace-nowrap font-display text-[clamp(1.1rem,5.4cqw,4rem)] font-bold leading-[1.05]"
          >
            {about.headline}
          </h2>
          <div className="mt-4 font-body text-lg leading-[1.45] md:columns-2 md:gap-8 md:[column-rule:1px_solid_var(--color-ink)]">
            {about.paragraphs.map((p) => (
              <p key={p} className="hyphens-auto text-justify [&:not(:first-child)]:indent-5">
                {p}
              </p>
            ))}
          </div>
          <blockquote className="mt-5 border-l-4 border-accent pl-3 font-display text-2xl italic">
            {about.pullQuote}
          </blockquote>
        </div>
        <div className="flex flex-wrap gap-3 md:col-start-1 md:row-start-2 md:flex-col md:items-stretch md:self-start">
          <SmartLink href="#contact" className={`${cta} bg-ink text-paper text-center`}>
            Hire me
          </SmartLink>
          <SmartLink href="/resume" className={`${cta} text-center`}>
            Résumé
          </SmartLink>
        </div>
      </div>
    </section>
  );
}
