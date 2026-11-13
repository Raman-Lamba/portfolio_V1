'use client';
import { useMemo } from 'react';
import type { FolderClippings } from '@/content/queries';
import { useFolderHash } from '@/lib/use-folder-hash';
import { CaseFileDialog } from './case-file-dialog';
import { SmartLink } from './smart-link';

export function CaseFilesView({ folders }: { folders: FolderClippings[] }) {
  const ids = useMemo(() => folders.map((f) => f.id), [folders]);
  const { openId, open, close } = useFolderHash(ids);
  const openFolder = folders.find((f) => f.id === openId);

  return (
    <section id="files" aria-labelledby="files-heading" className="mt-8">
      <h2
        id="files-heading"
        className="border-b-2 border-ink pb-1 font-label text-sm font-semibold uppercase tracking-[0.3em]"
      >
        From the archive
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {folders.map((f) => (
          <article key={f.id} className="border-2 border-ink bg-ink/10 p-4">
            <h3 className="mb-3 inline-block border-b-2 border-ink pb-0.5 font-label text-xs font-semibold uppercase tracking-widest">
              Case file: {f.label}
            </h3>
            <ul className="space-y-1 font-body text-sm">
              {f.clippings.map((c) => (
                <li key={c.slug}>
                  <SmartLink href={`/work/${c.slug}`} className="hover:underline">
                    {c.title}
                  </SmartLink>
                </li>
              ))}
            </ul>
            <button
              type="button"
              aria-haspopup="dialog"
              onClick={() => open(f.id)}
              className="mt-3 border-2 border-ink px-3 py-1 font-label text-xs uppercase tracking-widest transition-transform duration-100 active:scale-[0.97]"
            >
              Open case file<span className="sr-only">: {f.label}</span>
            </button>
          </article>
        ))}
      </div>
      {openFolder && (
        <CaseFileDialog
          key={openFolder.id}
          label={openFolder.label}
          clippings={openFolder.clippings}
          onClose={close}
        />
      )}
    </section>
  );
}
