import { site } from '@/content/site';

const link = 'underline underline-offset-4 hover:text-accent';

export function Letters() {
  return (
    <section id="contact" aria-labelledby="contact-heading">
      <h2
        id="contact-heading"
        className="border-b-2 border-ink pb-1 font-label text-sm font-semibold uppercase tracking-[0.3em]"
      >
        Letters to the Editor
      </h2>
      <p className="mt-3 font-body">Commissions, roles, questions: write in.</p>
      <ul className="mt-2 space-y-1 font-body">
        <li>
          <a href={`mailto:${site.email}`} className={link}>
            {site.email}
          </a>
        </li>
        <li>
          <a href={site.linkedin} className={link}>
            LinkedIn
          </a>
        </li>
        <li>
          <a href={site.github} className={link}>
            GitHub
          </a>
        </li>
      </ul>
    </section>
  );
}
