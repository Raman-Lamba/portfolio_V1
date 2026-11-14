import { site } from '@/content/site';
import { BackLink } from './back-link';

export function BackBar() {
  return (
    <header className="border-b-4 border-double border-ink px-4 py-3">
      <div className="mx-auto flex max-w-3xl items-baseline justify-between gap-4 font-label text-sm uppercase tracking-widest">
        <BackLink className="underline underline-offset-4 hover:text-accent">
          <span aria-hidden="true">← </span>Front page
        </BackLink>
        <span>{site.name}</span>
      </div>
    </header>
  );
}
