import { site } from '@/content/site';
import { Dateline } from './dateline';

export function Masthead({ now }: { now?: Date }) {
  return (
    <header className="border-b-[6px] border-double border-ink px-4 py-3">
      <div className="flex flex-col gap-2 font-label text-xs uppercase tracking-[0.18em] sm:flex-row sm:justify-between sm:gap-4">
        <p>{site.availability}</p>
        <p className="sm:text-right">
          <span className="block">{site.location}</span>
          <Dateline now={now} className="block min-h-[1em]" />
          <span className="block">{site.volume}</span>
        </p>
      </div>
      <h1 className="mt-2 text-center font-display text-5xl font-black tracking-tight sm:text-7xl">
        {site.name}
      </h1>
      <p className="mt-1 text-center font-label text-sm uppercase tracking-[0.3em]">{site.tagline}</p>
    </header>
  );
}
