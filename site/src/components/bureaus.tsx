import { bureaus } from '@/content/bureaus';

export function Bureaus() {
  return (
    <section id="bureaus" aria-labelledby="bureaus-heading" className="mt-8">
      <h2
        id="bureaus-heading"
        className="border-b-2 border-ink pb-1 font-label text-sm font-semibold uppercase tracking-[0.3em]"
      >
        From our bureaus
      </h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {bureaus.map((b) => (
          <article key={b.id} className="border border-ink p-4">
            <p className="font-label text-xs uppercase tracking-[0.25em] text-accent">{b.dates}</p>
            <h3 className="mt-1 font-display text-xl font-bold">{b.org}</h3>
            <p className="font-body text-sm italic">{b.role}</p>
            <p className="mt-2 font-body">{b.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
