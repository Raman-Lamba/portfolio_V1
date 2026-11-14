import { cacheLife } from 'next/cache';
import { fetchMarketReport, summarise, type MarketReport as Report, type Quote, type Region } from '@/lib/feeds';

const zones: Record<Region, { tz: string; locale: string }> = {
  India: { tz: 'Asia/Kolkata', locale: 'en-IN' },
  US: { tz: 'America/New_York', locale: 'en-US' },
};

function asOf(region: Region, time?: number) {
  if (!time) return '';
  const when = new Intl.DateTimeFormat('en-GB', {
    timeZone: zones[region].tz,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(time);
  return `${when} ${region === 'India' ? 'IST' : 'ET'}`;
}

function Change({ pct, big }: { pct: number; big?: boolean }) {
  const down = pct < 0;
  const text = `${Math.abs(pct).toFixed(2)}%`;
  const arrow = down ? '▼' : '▲';
  const word = <span className="sr-only">{down ? 'down' : 'up'}</span>;
  if (big) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 font-mono text-lg ${down ? 'bg-accent text-paper' : 'bg-ink text-paper'}`}>
        <span aria-hidden="true">{arrow}</span>
        {word}
        {text}
      </span>
    );
  }
  return (
    <span className={down ? 'text-accent' : undefined}>
      <span aria-hidden="true">{arrow}</span> {word}
      {text}
    </span>
  );
}

function Table({ region, rows }: { region: Region; rows: Quote[] }) {
  if (rows.length === 0) return null;
  const [lead, ...rest] = rows;
  const open = lead.open === true;
  const fmt = (n: number) => n.toLocaleString(zones[region].locale, { maximumFractionDigits: 2 });
  return (
    <div className="min-w-0 border-2 border-ink p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-3xl font-bold leading-none">{region}</h3>
          <p className="mt-1 font-mono text-xs">As of {asOf(region, lead.time)}</p>
        </div>
        <p
          className={`border-2 px-2 py-0.5 font-label text-xs font-semibold uppercase tracking-[0.25em] ${open ? 'border-burnt text-burnt' : 'border-ink'}`}
        >
          {open ? 'Market open' : 'Market closed'}
        </p>
      </div>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-1 border-y-2 border-ink py-3">
        <div>
          <p className="font-label text-xs font-semibold uppercase tracking-[0.25em]">{lead.label}</p>
          <p className="font-display text-5xl font-bold leading-none tabular-nums">{fmt(lead.price)}</p>
        </div>
        <Change pct={lead.changePct} big />
      </div>
      <table className="w-full font-mono text-sm">
        <caption className="sr-only">{region} market indices, level and daily change</caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">Index</th>
            <th scope="col">Level</th>
            <th scope="col">Change</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink/30">
          {rest.map((q) => (
            <tr key={q.label}>
              <th scope="row" className="py-1.5 text-left font-label text-sm font-semibold uppercase tracking-widest">
                {q.label}
              </th>
              <td className="py-1.5 text-right tabular-nums">{fmt(q.price)}</td>
              <td className="w-24 py-1.5 text-right tabular-nums">
                <Change pct={q.changePct} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 border-t border-ink pt-2 font-body italic">{summarise(region, rows)}</p>
    </div>
  );
}

export function MarketReportView({ report }: { report: Report }) {
  if (report.India.length === 0 && report.US.length === 0) return null;
  return (
    <section id="markets" aria-labelledby="markets-heading" className="mt-8">
      <h2
        id="markets-heading"
        className="border-b-2 border-ink pb-1 font-label text-sm font-semibold uppercase tracking-[0.3em]"
      >
        Markets today
      </h2>
      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <Table region="India" rows={report.India} />
        <Table region="US" rows={report.US} />
      </div>
      <p className="mt-3 font-label text-xs uppercase tracking-widest">
        Delayed, not advice. Daily change against the previous close. Source: Yahoo Finance.
      </p>
    </section>
  );
}

export async function LiveMarketReport() {
  'use cache';
  cacheLife('hours');
  return <MarketReportView report={await fetchMarketReport()} />;
}
