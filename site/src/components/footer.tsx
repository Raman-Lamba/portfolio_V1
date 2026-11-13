import { site } from '@/content/site';

export function Footer() {
  return (
    <footer className="mx-auto mt-10 max-w-6xl border-t-4 border-double border-ink px-4 py-4 text-center font-label text-xs uppercase tracking-[0.25em]">
      Printed in {site.location} · {site.name}
    </footer>
  );
}
