import { hobbies } from '@/content/hobbies';
import { SectionHeading } from './section-heading';

export function SportsDesk() {
  return (
    <section id="sports" aria-labelledby="sports-heading">
      <SectionHeading id="sports-heading">Sports desk</SectionHeading>
      <p className="mt-3 font-label text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-accent">
        {hobbies.kicker}
      </p>
      <ul className="mt-2 grid grid-cols-3 divide-x divide-ink border-y-2 border-ink">
        {hobbies.stats.map((s) => (
          <li key={s.label} className="px-3 py-3 first:pl-0">
            <span className="block font-display text-3xl font-bold leading-none tabular-nums sm:text-4xl">
              {s.value}
            </span>
            <span className="mt-1 block font-body text-sm italic leading-snug">{s.label}</span>
          </li>
        ))}
      </ul>
      <p className="mt-2 font-body text-sm italic">{hobbies.note}</p>
    </section>
  );
}
