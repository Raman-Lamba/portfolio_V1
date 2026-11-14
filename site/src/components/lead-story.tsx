import type { Project } from '@/content/types';
import { HalftonePlate } from './halftone-plate';
import { NumbersBox } from './numbers-box';
import { SmartLink } from './smart-link';
import { Stamp } from './stamp';

export function LeadStory({ project }: { project: Project }) {
  const winner = /winner|first place/i.test(project.credit);
  return (
    <article className="border-b border-ink pb-6 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
      <p className="font-label text-sm font-semibold uppercase tracking-[0.25em] text-accent">
        {project.kicker}
      </p>
      <h2 className="mt-1 font-display text-5xl font-bold leading-[1.02] sm:text-6xl lg:text-7xl">
        {project.title}
      </h2>
      <p className="mt-2 font-body text-lg italic">{project.credit}</p>
      <HalftonePlate slug={project.slug} caption={`${project.title}, ${project.year}`} priority>
        {winner && (
          <Stamp className="absolute right-3 top-3 text-base sm:right-5 sm:top-5 sm:text-xl" tilt="-8deg">
            Winner
          </Stamp>
        )}
      </HalftonePlate>
      <p className="mt-4 font-body text-lg leading-relaxed first-letter:float-left first-letter:pr-2 first-letter:font-display first-letter:text-6xl first-letter:font-black first-letter:leading-[0.8]">
        {project.deck}
      </p>
      <NumbersBox metrics={project.metrics} />
      <SmartLink
        href={`/work/${project.slug}`}
        className="mt-4 inline-block font-label text-sm font-semibold uppercase tracking-widest text-accent underline underline-offset-4"
      >
        Continued on A3
        <span className="sr-only">: {project.title}</span>
        <span aria-hidden="true"> →</span>
      </SmartLink>
    </article>
  );
}
