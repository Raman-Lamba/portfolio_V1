import { getFolders } from '@/content/queries';
import { SmartLink } from './smart-link';

export function CaseFiles() {
  return (
    <section id="files" aria-labelledby="files-heading" className="mt-8">
      <h2
        id="files-heading"
        className="border-b-2 border-ink pb-1 font-label text-sm font-semibold uppercase tracking-[0.3em]"
      >
        From the archive
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {getFolders().map((f) => (
          <article key={f.id} className="border-2 border-ink bg-ink/10 p-4">
            <h3 className="mb-3 inline-block border-b-2 border-ink pb-0.5 font-label text-xs font-semibold uppercase tracking-widest">
              Case file: {f.label}
            </h3>
            <ul className="space-y-1 font-body text-sm">
              {f.projects.map((p) => (
                <li key={p.slug}>
                  <SmartLink href={`/work/${p.slug}`} className="hover:underline">
                    {p.title}
                  </SmartLink>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
