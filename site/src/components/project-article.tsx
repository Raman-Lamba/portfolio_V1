import Image from 'next/image';
import type { Project, ProjectDetails, ProjectFigure } from '@/content/types';
import { HalftonePlate } from './halftone-plate';
import { NumbersBox } from './numbers-box';

const sectionHeading =
  'mt-8 border-b-2 border-ink pb-1 font-label text-sm font-semibold uppercase tracking-[0.3em]';
const paragraph = 'mt-3 font-body text-lg leading-relaxed';

export function ProjectArticle({
  project,
  details,
  figures = [],
}: {
  project: Project;
  details?: ProjectDetails;
  figures?: ProjectFigure[];
}) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <p className="font-label text-sm font-semibold uppercase tracking-[0.25em] text-accent">
        {project.kicker}
      </p>
      <h1 className="mt-1 font-display text-5xl font-bold leading-[1.02] sm:text-6xl">{project.title}</h1>
      <p className="mt-2 font-body text-lg italic">{project.credit}</p>
      {figures.length === 0 && <HalftonePlate slug={project.slug} caption={`${project.title}, ${project.year}`} />}
      <p className="mt-4 font-body text-lg leading-relaxed">{project.deck}</p>
      {project.metrics.length > 0 && <h2 className="sr-only">Key figures</h2>}
      <NumbersBox metrics={project.metrics} />
      {details && (
        <>
          <h2 className={sectionHeading}>The problem</h2>
          <p className={paragraph}>{details.problem}</p>
          <h2 className={sectionHeading}>The approach</h2>
          <p className={paragraph}>{details.approach}</p>
          <h2 className={sectionHeading}>The result</h2>
          <p className={paragraph}>{details.result}</p>
          <h2 className={sectionHeading}>Built with</h2>
          <ul className="mt-3 flex flex-wrap gap-2 font-mono text-sm">
            {details.stack.map((s) => (
              <li key={s} className="border border-ink px-2 py-0.5">
                {s}
              </li>
            ))}
          </ul>
        </>
      )}
      {figures.length > 0 && (
        <>
          <h2 className={sectionHeading}>Figures</h2>
          {figures.map((f) => (
            <figure key={f.src} className="mt-4">
              <Image
                src={f.src}
                alt={f.alt}
                width={f.width}
                height={f.height}
                sizes="(min-width: 768px) 48rem, 100vw"
                className="h-auto w-full border border-ink"
              />
              <figcaption className="mt-1 font-body text-sm italic">{f.caption}</figcaption>
            </figure>
          ))}
        </>
      )}
      {project.downloads && (
        <ul className="mt-8 space-y-1 font-label text-sm font-semibold uppercase tracking-widest">
          {project.downloads.map((d) => (
            <li key={d.href}>
              <a href={d.href} download className="text-accent underline underline-offset-4">
                {d.label}
                <span aria-hidden="true"> ↓</span>
              </a>
              <span className="ml-2 font-mono text-xs font-normal normal-case tracking-normal text-ink/70">({d.note})</span>
            </li>
          ))}
        </ul>
      )}
      {(project.link || project.source) && (
        <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-label text-sm font-semibold uppercase tracking-widest">
          {project.link && (
            <a
              href={project.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-4"
            >
              {project.link.label}
              <span aria-hidden="true"> →</span>
            </a>
          )}
          {project.source && (
            <a
              href={project.source}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-4"
            >
              Source code on GitHub
              <span aria-hidden="true"> →</span>
            </a>
          )}
        </p>
      )}
    </article>
  );
}
