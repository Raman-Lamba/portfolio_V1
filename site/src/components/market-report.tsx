import { cacheLife } from 'next/cache';
import { fetchMarketReport, summarise, type MarketReport as Report, type Quote, type Region } from '@/lib/feeds';

const zones: Record<Region, { tz: string; locale: string }> = {
  India: { tz: 'Asia/Kolkata', locale: 'en-IN' },
  US: { tz: 'America/New_York', locale: 'en-US' },
};

function asOf(region: Region, time?: number) {
  if (!time) return '';
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: zones[region].tz,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(time);
}

function Table({ region, rows }: { region: Region; rows: Quote[] }) {
  if (rows.length === 0) return null;
  const open = rows[0].open === true;
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <h3 className="font-display text-2xl font-bold">{region}</h3>
        <p className="font-label text-xs uppercase tracking-widest">
          <span className={open ? 'text-accent' : undefined}>{open ? 'Open' : 'Closed'}</span>
          <span className="font-mono normal-case tracking-normal"> · as of {asOf(region, rows[0].time)}</span>
        </p>
      </div>
      <table className="mt-2 w-full border-t border-ink font-mono text-sm">
        <caption className="sr-only">{region} market indices, level and daily change</caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">Index</th>
            <th scope="col">Level</th>
            <th scope="col">Change</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink/30">
          {rows.map((q) => (
            <tr key={q.label}>
              <th scope="row" className="py-1 text-left font-label text-sm font-semibold uppercase tracking-widest">
                {q.label}
              </th>
              <td className="py-1 text-right">
                {q.price.toLocaleString(zones[region].locale, { maximumFractionDigits: 2 })}
              </td>
              <td className={`py-1 pl-3 text-right ${q.changePct < 0 ? 'text-accent' : ''}`}>
                <span aria-hidden="true">{q.changePct < 0 ? '▼' : '▲'}</span>
                <span className="sr-only">{q.changePct < 0 ? 'down' : 'up'}</span> {Math.abs(q.changePct).toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 font-body italic">{summarise(region, rows)}</p>
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
      <div className="mt-4 grid gap-8 md:grid-cols-2 md:divide-x md:divide-ink [&>div:last-child]:md:pl-8">
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
