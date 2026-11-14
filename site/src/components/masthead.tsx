import { site } from '@/content/site';
import { Dateline } from './dateline';

export function Masthead({ now }: { now?: Date }) {
  return (
    <header className="masthead px-4 pt-3">
      <div className="flex flex-col gap-2 font-label text-xs uppercase tracking-[0.18em] sm:flex-row sm:justify-between sm:gap-4">
        <p className="w-fit border border-ink px-2 py-1 leading-none">
          <span aria-hidden="true" className="mr-1.5 text-burnt">●</span>
          {site.availability}
        </p>
        <p className="sm:text-right">
          <span className="block">{site.location}</span>
          <Dateline now={now} className="block min-h-[1em]" />
          <span className="block">{site.volume}</span>
        </p>
      </div>
      <h1 className="masthead-plate mt-2 text-center font-masthead text-6xl sm:text-8xl">{site.name}</h1>
      <p className="masthead-tagline mt-1 text-center font-label text-sm uppercase tracking-[0.3em]">
        {site.tagline}
      </p>
      <ul
        aria-label="Edition"
        className="masthead-edition mt-3 flex flex-wrap justify-between gap-x-6 gap-y-1 border-y border-ink py-1 font-label text-[0.7rem] uppercase tracking-[0.2em]"
      >
        {site.edition.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <div aria-hidden="true" className="masthead-rule mt-[3px] border-b-[6px] border-double border-ink" />
    </header>
  );
}
