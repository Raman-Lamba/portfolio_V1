import type { Project } from '@/content/types';
import { SmartLink } from './smart-link';

export function StoryCard({ project }: { project: Project }) {
  return (
    <article className="py-4 md:px-4 md:first:pl-0 md:last:pr-0">
      <p className="font-label text-xs font-semibold uppercase tracking-[0.25em] text-accent">
        {project.kicker}
      </p>
      <h3 className="mt-1 font-display text-3xl font-bold leading-[1.1]">
        <SmartLink href={`/work/${project.slug}`} className="hover:underline">
          {project.title}
        </SmartLink>
      </h3>
      <p className="mt-1 font-body text-sm italic">{project.credit}</p>
      <p className="mt-2 font-body">{project.deck}</p>
    </article>
  );
}
