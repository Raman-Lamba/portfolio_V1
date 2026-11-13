import { site } from '@/content/site';
import { SmartLink } from './smart-link';

export function BackBar() {
  return (
    <header className="border-b-4 border-double border-ink px-4 py-3">
      <div className="mx-auto flex max-w-3xl items-baseline justify-between gap-4 font-label text-sm uppercase tracking-widest">
        <SmartLink href="/" className="underline underline-offset-4 hover:text-accent">
          <span aria-hidden="true">← </span>Front page
        </SmartLink>
        <span>{site.name}</span>
      </div>
    </header>
  );
}
