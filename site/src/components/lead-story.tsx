import type { Project } from '@/content/types';
import { HalftonePlate } from './halftone-plate';
import { NumbersBox } from './numbers-box';
import { SmartLink } from './smart-link';

export function LeadStory({ project }: { project: Project }) {
  return (
    <article className="border-b border-ink pb-6 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
      <p className="font-label text-sm font-semibold uppercase tracking-[0.25em] text-accent">
        {project.kicker}
      </p>
      <h2 className="mt-1 font-display text-4xl font-black leading-[1.05] sm:text-5xl">
        {project.title}
      </h2>
      <p className="mt-2 font-body text-lg italic">{project.credit}</p>
      <HalftonePlate caption={`${project.title}, ${project.year}`} />
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
