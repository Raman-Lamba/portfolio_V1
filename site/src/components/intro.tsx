import Image from 'next/image';
import { about } from '@/content/about';
import { site } from '@/content/site';
import { SmartLink } from './smart-link';

const cta =
  'inline-block border-2 border-ink px-4 py-2 font-label text-sm uppercase tracking-widest transition-transform duration-100 active:scale-[0.97]';

export function Intro() {
  return (
    <section id="intro" aria-labelledby="intro-heading" className="mt-6 border-b-2 border-ink pb-6">
      <div className="grid gap-6 md:grid-cols-[10rem_1fr]">
        <Image
          src={site.photo}
          alt={`Portrait of ${site.name}`}
          width={590}
          height={845}
          className="h-auto w-32 border border-ink grayscale contrast-125 md:w-40"
        />
        <div>
          <h2 id="intro-heading" className="font-display text-3xl font-bold italic leading-tight sm:text-4xl">
            {about.headline}
          </h2>
          <div className="mt-3 font-body md:columns-2 md:gap-6">
            {about.paragraphs.map((p) => (
              <p key={p} className="mb-2 break-inside-avoid">
                {p}
              </p>
            ))}
          </div>
          <blockquote className="mt-3 border-l-4 border-accent pl-3 font-display text-lg italic">
            {about.pullQuote}
          </blockquote>
          <div className="mt-4 flex flex-wrap gap-3">
            <SmartLink href="#contact" className={`${cta} bg-ink text-paper`}>
              Hire me
            </SmartLink>
            <SmartLink href="/resume" className={cta}>
              Résumé
            </SmartLink>
          </div>
        </div>
      </div>
    </section>
  );
}
