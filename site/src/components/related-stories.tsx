import Image from 'next/image';
import type { Project } from '@/content/types';
import { SmartLink } from './smart-link';

// "Elsewhere in the archive": small cross-links at the foot of an article so no story is a dead end.
export function RelatedStories({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;
  return (
    <nav aria-labelledby="related-heading" className="mx-auto max-w-3xl px-4 pb-10">
      <h2
        id="related-heading"
        className="border-b-2 border-ink pb-1 font-label text-sm font-semibold uppercase tracking-[0.3em]"
      >
        Elsewhere in the archive
      </h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-3">
        {projects.map((p) => (
          <li key={p.slug} className="flex gap-3 border border-ink p-3">
            <Image
              src={`/images/plates/${p.slug}.png`}
              alt=""
              width={1200}
              height={480}
              sizes="4rem"
              className="h-16 w-16 shrink-0 border border-ink object-cover"
            />
            <div className="min-w-0">
              <p className="font-label text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-accent">
                {p.kicker}
              </p>
              <SmartLink
                href={`/work/${p.slug}`}
                className="font-display text-lg font-bold leading-tight hover:underline"
              >
                {p.title}
              </SmartLink>
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
}
