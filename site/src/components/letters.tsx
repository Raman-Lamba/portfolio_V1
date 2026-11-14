import { navItems } from '@/content/nav';
import { site } from '@/content/site';
import { SectionHeading } from './section-heading';

const link = 'underline underline-offset-4 hover:text-accent';
const page = navItems.find((n) => n.id === 'contact')?.page;

export const letterSubjects = [
  { id: 'freelance', label: 'Commission a project', subject: 'Freelance commission' },
  { id: 'role', label: 'Discuss a role', subject: 'Full-time role' },
] as const;

const mailto = (subject: string) => `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;

export function Letters() {
  return (
    <section id="contact" aria-labelledby="contact-heading">
      <SectionHeading id="contact-heading" page={page}>
        Letters to the Editor
      </SectionHeading>
      <p className="mt-3 font-body">Commissions, roles, questions: write in.</p>
      {/* the coupon: dashed cut line, scissors, two pre-addressed envelopes */}
      <div className="coupon relative mt-4 border-2 border-dashed border-ink p-4 pt-5">
        <span
          aria-hidden="true"
          className="absolute -top-3 left-4 bg-paper px-1 font-label text-xs uppercase tracking-[0.3em]"
        >
          ✂ Clip and send
        </span>
        <div className="flex flex-wrap gap-3">
          {letterSubjects.map((s, i) => (
            <a
              key={s.id}
              href={mailto(s.subject)}
              className={`inline-block border-2 border-ink px-4 py-2 font-label text-sm uppercase tracking-widest transition duration-100 active:scale-[0.97] hover:border-accent hover:bg-accent hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${i === 0 ? 'border-burnt bg-burnt text-paper' : ''}`}
            >
              {s.label}
            </a>
          ))}
        </div>
        <p className="mt-3 font-body text-sm">
          Or write directly:{' '}
          <a href={`mailto:${site.email}`} className={`${link} font-mono text-[0.85em]`}>
            {site.email}
          </a>
        </p>
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1 font-label text-sm uppercase tracking-widest">
        <li>
          <a href={site.linkedin} className={link} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </li>
        <li>
          <a href={site.github} className={link} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </li>
      </ul>
    </section>
  );
}
