import { bureaus } from '@/content/bureaus';
import { navItems } from '@/content/nav';
import { SectionHeading } from './section-heading';

const page = navItems.find((n) => n.id === 'bureaus')?.page;

// Internships as press passes: a dark header band, a punched hole, the dateline as the pass's validity.
export function Bureaus() {
  return (
    <section id="bureaus" aria-labelledby="bureaus-heading" className="mt-8">
      <SectionHeading id="bureaus-heading" page={page}>
        From our bureaus
      </SectionHeading>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {bureaus.map((b, i) => (
          <article
            key={b.id}
            className="press-pass relative flex flex-col border-2 border-ink bg-sheet shadow-[0_6px_16px_rgba(27,22,18,0.18)] transition-transform duration-150 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none"
          >
            <div className="flex items-center justify-between bg-ink px-3 py-2 font-label text-xs uppercase tracking-[0.3em] text-paper">
              <span>Press</span>
              <span className="font-mono text-[0.65rem] tracking-normal">Nº {String(i + 1).padStart(3, '0')}</span>
            </div>
            <div className="flex flex-1 flex-col p-4">
              <p className="font-label text-xs uppercase tracking-[0.25em] text-accent">{b.dates}</p>
              <h3 className="mt-1 font-display text-2xl font-bold leading-tight">{b.org}</h3>
              <p className="font-body text-sm italic">{b.role}</p>
              <p className="mt-3 border-t border-dashed border-ink/50 pt-3 font-body leading-snug">{b.summary}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
