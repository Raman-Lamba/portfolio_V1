import { resumeFull } from '@/content/resume-full';
import { site } from '@/content/site';

const label = 'font-label text-sm font-semibold uppercase tracking-[0.3em]';

function Entries({ entries }: { entries: { org: string; role: string; dates: string; bullets: string[] }[] }) {
  return (
    <div className="space-y-5">
      {entries.map((e) => (
        <article key={e.org}>
          <h3 className="font-display text-xl font-bold">
            {e.org} <span className="font-body text-base font-normal italic">{e.role}</span>
          </h3>
          <p className="font-label text-xs uppercase tracking-[0.2em] text-accent">{e.dates}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 font-body">
            {e.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

function Row({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="grid gap-3 border-t border-ink py-6 md:grid-cols-[10rem_1fr]">
      <h2 id={id} className={label}>
        {title}
      </h2>
      <div>{children}</div>
    </section>
  );
}

export function ResumePage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="font-display text-4xl font-black">{site.name}</h1>
      <p className="mt-1 font-body italic">{resumeFull.summary}</p>
      <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1 font-body underline-offset-4">
        <li>
          <a href={`mailto:${site.email}`} className="underline">
            {site.email}
          </a>
        </li>
        <li>
          <a href={site.linkedin} className="underline">
            LinkedIn
          </a>
        </li>
        <li>
          <a href={site.github} className="underline">
            GitHub
          </a>
        </li>
      </ul>
      <p className="mt-4">
        <a
          href={site.resumePdf}
          download
          className="inline-block border-2 border-ink bg-ink px-4 py-2 font-label text-sm uppercase tracking-widest text-paper"
        >
          Download PDF
        </a>
      </p>

      <div className="mt-6">
        <Row id="resume-education" title="Education">
          <div className="space-y-3">
            {resumeFull.education.map((e) => (
              <article key={e.school}>
                <h3 className="font-display text-xl font-bold">{e.school}</h3>
                <p className="font-body">{e.detail}</p>
                <p className="font-label text-xs uppercase tracking-[0.2em] text-accent">{e.dates}</p>
              </article>
            ))}
          </div>
        </Row>
        <Row id="resume-experience" title="Experience">
          <Entries entries={resumeFull.experience} />
        </Row>
        <Row id="resume-honours" title="Awards & competitions">
          <ul className="list-disc space-y-2 pl-5 font-body">
            {resumeFull.honours.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </Row>
        <Row id="resume-projects" title="Projects">
          <Entries entries={resumeFull.projects} />
        </Row>
        <Row id="resume-skills" title="Skills">
          <dl className="space-y-1 font-body">
            {resumeFull.skills.map((s) => (
              <div key={s.label}>
                <dt className="inline font-bold">{s.label}: </dt>
                <dd className="inline">{s.items}</dd>
              </div>
            ))}
          </dl>
        </Row>
      </div>
    </article>
  );
}
