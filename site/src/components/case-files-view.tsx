'use client';
import { useMemo } from 'react';
import type { FolderClippings } from '@/content/queries';
import { navItems } from '@/content/nav';
import { useFolderHash } from '@/lib/use-folder-hash';
import { CaseFileDialog } from './case-file-dialog';
import { SectionHeading } from './section-heading';
import { SmartLink } from './smart-link';
import { Stamp } from './stamp';

const SHOWN = 4;
const page = navItems.find((n) => n.id === 'files')?.page;
const tilts = ['-5deg', '7deg', '-8deg', '4deg'];

export function CaseFilesView({ folders }: { folders: FolderClippings[] }) {
  const ids = useMemo(() => folders.map((f) => f.id), [folders]);
  const { openId, open, close } = useFolderHash(ids);
  const openFolder = folders.find((f) => f.id === openId);

  return (
    <section id="files" aria-labelledby="files-heading" className="mt-8">
      <SectionHeading id="files-heading" page={page}>
        From the archive
      </SectionHeading>
      <p className="mt-2 font-body italic">Pick a folder to open the case file.</p>
      <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {folders.map((f, i) => (
          <article key={f.id} className="group relative flex flex-col">
            {/* tab */}
            <div className="relative z-10 -mb-[2px] w-fit rounded-t-md border-2 border-b-0 border-ink bg-manila px-3 py-1">
              <h3 className="font-label text-xs font-semibold uppercase tracking-widest">
                Case file: {f.label}
              </h3>
            </div>
            {/* body: papers poke out of the top and rise on hover; the folder lifts off the desk */}
            <div className="relative flex flex-1 flex-col rounded-b-md rounded-tr-md border-2 border-ink bg-manila transition-[transform,box-shadow] duration-150 group-hover:-translate-y-1 group-hover:shadow-[0_10px_22px_rgba(27,22,18,0.22)] group-focus-within:-translate-y-1 group-focus-within:shadow-[0_10px_22px_rgba(27,22,18,0.22)] motion-reduce:transition-none motion-reduce:group-hover:transform-none">
              <div
                aria-hidden="true"
                className="absolute -top-4 left-[52%] right-3 h-10 -rotate-2 border border-ink bg-sheet transition-transform duration-150 group-hover:-translate-y-2 group-focus-within:-translate-y-2 motion-reduce:transition-none"
              />
              <div
                aria-hidden="true"
                className="absolute -top-2 left-[48%] right-6 h-10 rotate-1 border border-ink bg-paper transition-transform duration-150 group-hover:-translate-y-1 group-focus-within:-translate-y-1 motion-reduce:transition-none"
              />
              <div className="folder-front relative mt-5 flex flex-1 flex-col border-t-2 border-ink bg-manila-dark p-4 transition-transform duration-150 [transform-origin:bottom] group-hover:[transform:perspective(700px)_rotateX(-5deg)] motion-reduce:transition-none motion-reduce:group-hover:transform-none">
                <Stamp className="absolute right-3 top-3 opacity-80" tilt={tilts[i % tilts.length]}>
                  Filed
                </Stamp>
                <p className="font-mono text-xs uppercase tracking-widest text-accent">
                  Nº {String(i + 1).padStart(2, '0')} · {f.clippings.length}{' '}
                  {f.clippings.length === 1 ? 'clipping' : 'clippings'}
                </p>
                <ul className="mt-2 space-y-1 font-body text-sm">
                  {f.clippings.slice(0, SHOWN).map((c) => (
                    <li key={c.slug}>
                      <SmartLink href={`/work/${c.slug}`} className="relative z-10 hover:underline">
                        {c.title}
                      </SmartLink>
                    </li>
                  ))}
                  {f.clippings.length > SHOWN && (
                    <li className="italic">and {f.clippings.length - SHOWN} more inside</li>
                  )}
                </ul>
                <p
                  aria-hidden="true"
                  className="mt-auto pt-4 font-label text-sm font-semibold uppercase tracking-widest text-accent"
                >
                  Open the folder →
                </p>
              </div>
            </div>
            {/* the whole folder is the button; titles above it stay separate links */}
            <button
              type="button"
              aria-haspopup="dialog"
              onClick={() => open(f.id)}
              className="absolute inset-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              <span className="sr-only">Open case file: {f.label}</span>
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
