import { resumeFull } from '@/content/resume-full';
import { site } from '@/content/site';

type Tilt = React.CSSProperties & { '--r': string };

function Sheet({
  href,
  tag,
  cta,
  download,
  tilt,
  className,
  primary,
  children,
}: {
  href: string;
  tag: string;
  cta: string;
  download?: boolean;
  tilt: string;
  className: string;
  primary?: boolean;
  children: React.ReactNode;
}) {
  const style: Tilt = { '--r': tilt };
  return (
    <a
      href={href}
      download={download}
      aria-label={`${tag}: ${cta}`}
      style={style}
      className={`group absolute block aspect-[8.5/11] w-[54%] rotate-(--r) border border-ink/50 bg-sheet p-3 shadow-[0_8px_20px_rgba(27,22,18,0.28)] transition duration-150 hover:z-10 hover:-translate-y-2 hover:rotate-0 focus-visible:z-10 focus-visible:-translate-y-2 focus-visible:rotate-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none ${className}`}
    >
      <span className="absolute -top-3 left-3 bg-ink px-2 py-0.5 font-label text-[0.65rem] uppercase tracking-widest text-paper">
        {tag}
      </span>
      <span aria-hidden="true" className="block overflow-hidden pt-2 font-body text-[7px] leading-[1.4]">
        {children}
      </span>
      <span
        aria-hidden="true"
        className={`absolute bottom-2 border px-2 py-0.5 font-label text-[0.65rem] uppercase tracking-widest group-hover:bg-ink group-hover:text-paper ${primary ? 'right-2 border-burnt bg-burnt text-paper' : 'left-2 border-ink bg-paper'}`}
      >
        {cta}
      </span>
    </a>
  );
}

type Entry = { org: string; role: string; bullets: string[] };

function entry(e: Entry, n = 2) {
  return (
    <span key={e.org} className="mt-1.5 block">
      <strong className="block text-[8px]">
        {e.org} <span className="font-normal italic">{e.role}</span>
      </strong>
      {e.bullets.slice(0, n).map((b) => (
        <span key={b} className="block">
          • {b}
        </span>
      ))}
    </span>
  );
}

export function ResumeDocs() {
  const jobs = resumeFull.experience;
  const projects = resumeFull.projects;
  return (
    <section aria-labelledby="docs-heading">
      <h2
        id="docs-heading"
        className="border-b-2 border-ink pb-1 font-label text-sm font-semibold uppercase tracking-[0.3em]"
      >
        The résumé, on file
      </h2>
      <div className="relative mt-6 h-[24rem] sm:h-[28rem]">
        <Sheet href="/resume" tag="Résumé" cta="Read online →" tilt="-3deg" className="left-0 top-0">
          <strong className="block text-[10px]">{site.name}</strong>
          <span className="block italic">{resumeFull.summary}</span>
          <strong className="mt-2 block uppercase tracking-widest">Experience</strong>
          {entry(jobs[0], 3)}
          {entry(jobs[1])}
          {entry(jobs[2])}
        </Sheet>
        <Sheet href={site.resumePdf} download primary tag="PDF" cta="Download ↓" tilt="2.5deg" className="right-0 top-8">
          <strong className="block uppercase tracking-widest">Education</strong>
          {resumeFull.education.map((e) => (
            <span key={e.school} className="block">
              {e.school}, {e.detail}
            </span>
          ))}
          <strong className="mt-2 block uppercase tracking-widest">Projects</strong>
          {projects.slice(0, 4).map((j) => entry(j, 1))}
          <strong className="mt-2 block uppercase tracking-widest">Skills</strong>
          {resumeFull.skills.map((k) => (
            <span key={k.label} className="block">
              <strong>{k.label}.</strong> {k.items}
            </span>
          ))}
        </Sheet>
      </div>
    </section>
  );
}
