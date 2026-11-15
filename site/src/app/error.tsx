'use client'; // error boundaries must be client components

const action = 'inline-flex min-h-11 items-center underline underline-offset-4 hover:text-accent';

export default function ErrorPage({ retry }: { error: unknown; retry: () => void }) {
  return (
    <main id="main" className="mx-auto max-w-3xl px-4 py-16 text-center">
      <p className="font-label text-sm uppercase tracking-[0.3em] text-accent">Stop the presses</p>
      <h1 className="mt-2 font-display text-5xl font-black sm:text-6xl">The press has jammed</h1>
      <p className="mt-4 font-body text-lg italic">
        Something broke while this page was being printed. Give it a moment, then run it again.
      </p>
      <p className="mt-6 flex flex-wrap justify-center gap-x-6 font-label text-sm font-semibold uppercase tracking-widest">
        <button type="button" onClick={() => retry()} className={`${action} cursor-pointer uppercase tracking-widest`}>
          Run the press again
        </button>
        {/* a full page load, on purpose: client navigation may be what is broken */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/" className={action}>
          Front page<span aria-hidden="true"> →</span>
        </a>
      </p>
    </main>
  );
}
