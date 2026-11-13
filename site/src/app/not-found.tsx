import { BackBar } from '@/components/back-bar';
import { Footer } from '@/components/footer';

export default function NotFound() {
  return (
    <>
      <BackBar />
      <main id="main" className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="font-label text-sm uppercase tracking-[0.3em] text-accent">Error 404</p>
        <h1 className="mt-2 font-display text-5xl font-black">Page not found</h1>
        <p className="mt-4 font-body text-lg italic">This page was not in today&apos;s edition.</p>
      </main>
      <Footer />
    </>
  );
}
