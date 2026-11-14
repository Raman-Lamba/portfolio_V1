import { classifieds } from '@/content/resume';

export function Classifieds() {
  return (
    <section id="classifieds" aria-labelledby="classifieds-heading">
      <h2
        id="classifieds-heading"
        className="border-b-2 border-ink pb-1 font-label text-sm font-semibold uppercase tracking-[0.3em]"
      >
        Classifieds
      </h2>
      <div className="mt-3">
        {classifieds.map((c) => (
          <article key={c.id} className="mb-3 border border-ink p-2 font-body text-sm leading-snug">
            <h3 className="font-label text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-accent">
              {c.heading}
            </h3>
            <p>
              <strong className="font-label uppercase tracking-wide">{c.lead}</strong> {c.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
