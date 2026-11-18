import Image from 'next/image';
import type { Project } from '@/content/types';
import { isWinner } from '@/content/queries';
import { SmartLink } from './smart-link';
import { Stamp } from './stamp';

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
      <div className="relative shrink-0 self-start">
        <Image
          src={`/images/plates/${project.slug}.png`}
          alt=""
          width={1200}
          height={480}
          sizes="6rem"
          className="h-24 w-24 border border-ink object-cover"
        />
        {/* decorative: the credit line above already says what was won */}
        {isWinner(project) && (
          <Stamp className="absolute -bottom-3 right-0 bg-paper text-xs" tilt="-8deg">
            Winner
          </Stamp>
        )}
      </div>
    </article>
  );
}
