import Image from 'next/image';
import { about } from '@/content/about';
import { site } from '@/content/site';

export function Editorial() {
  return (
    <section id="editorial" aria-labelledby="editorial-heading">
      <h2
        id="editorial-heading"
        className="border-b-2 border-ink pb-1 font-label text-sm font-semibold uppercase tracking-[0.3em]"
      >
        Editorial
      </h2>
      <Image
        src={site.photo}
        alt={`Portrait of ${site.name}`}
        width={590}
        height={845}
        className="mt-3 h-auto w-40 border border-ink grayscale contrast-125"
      />
      <h3 className="mt-3 font-display text-2xl font-bold italic leading-tight">{about.headline}</h3>
      {about.paragraphs.map((p) => (
        <p key={p} className="mt-2 font-body">
          {p}
        </p>
      ))}
      <blockquote className="mt-3 border-l-4 border-accent pl-3 font-display text-lg italic">
        {about.pullQuote}
      </blockquote>
    </section>
  );
}
