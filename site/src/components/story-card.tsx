import Image from 'next/image';
import type { Project } from '@/content/types';
import { SmartLink } from './smart-link';

export function StoryCard({ project }: { project: Project }) {
  return (
    <article className="flex gap-3 py-4">
      <div className="min-w-0 flex-1">
        <p className="font-label text-xs font-semibold uppercase tracking-[0.25em] text-accent">
          {project.kicker}
        </p>
        <h3 className="mt-1 font-display text-2xl font-bold leading-[1.1]">
          <SmartLink href={`/work/${project.slug}`} className="hover:underline">
            {project.title}
          </SmartLink>
        </h3>
        <p className="mt-1 font-body text-sm italic">{project.credit}</p>
        <p className="mt-2 line-clamp-3 font-body">{project.deck}</p>
      </div>
      <Image
        src={`/images/plates/${project.slug}.png`}
        alt=""
        width={1200}
        height={480}
        sizes="6rem"
        className="h-24 w-24 shrink-0 border border-ink object-cover"
      />
    </article>
  );
}
