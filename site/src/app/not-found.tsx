import type { Metadata } from 'next';
import { BackBar } from '@/components/back-bar';
import { Footer } from '@/components/footer';
import { SmartLink } from '@/components/smart-link';

export const metadata: Metadata = { title: 'Page not found | Raman Lamba' };

const link = 'inline-flex min-h-11 items-center underline underline-offset-4 hover:text-accent';

export default function NotFound() {
  return (
    <>
      <BackBar />
      <main id="main" className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="font-label text-sm uppercase tracking-[0.3em] text-accent">Error 404 · Lost and found</p>
        <h1 className="mt-2 font-display text-5xl font-black sm:text-6xl">Page not found</h1>
        <p className="mt-4 font-body text-lg italic">This page was not in today&apos;s edition.</p>

        <div className="mx-auto mt-8 max-w-md border-4 border-double border-ink px-5 py-6">
          <p className="font-label text-sm font-semibold uppercase tracking-[0.3em]">Missing</p>
          <p className="mt-2 font-body text-lg leading-snug">
            One page. Last seen somewhere between the front page and the archive. Answers to no known address. If
            found, please return to the editor.
          </p>
        </div>

        <p className="mt-8 font-body italic">
          <strong className="font-label not-italic uppercase tracking-widest">Correction:</strong> an earlier link
          suggested this page exists. It does not. We regret the error.
        </p>

        <p className="mt-6 flex flex-wrap justify-center gap-x-6 font-label text-sm font-semibold uppercase tracking-widest">
          <SmartLink href="/" className={link}>
            Read the front page<span aria-hidden="true"> →</span>
          </SmartLink>
          <SmartLink href="/resume" className={link}>
            Résumé<span aria-hidden="true"> →</span>
          </SmartLink>
        </p>
      </main>
      <Footer />
    </>
  );
}
