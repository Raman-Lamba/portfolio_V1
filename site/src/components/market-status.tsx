'use client';

import { useEffect, useState } from 'react';
import { isOpen, summarise, type Quote, type Region } from '@/lib/feeds';

// The report is cached for hours, so open/closed is re-decided here from the session window
// on the viewer's clock (starting from the server's value to keep hydration identical).
function useOpen(lead: Quote) {
  const [open, setOpen] = useState(lead.open === true);
  const start = lead.session?.start;
  const end = lead.session?.end;
  useEffect(() => {
    if (start === undefined || end === undefined) return;
    const tick = () => setOpen(isOpen({ ...lead, session: { start, end } }));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only the window matters
  }, [start, end]);
  return open;
}

export function MarketBadge({ lead }: { lead: Quote }) {
  const open = useOpen(lead);
  return (
    <p
      className={`border-2 px-2 py-0.5 font-label text-xs font-semibold uppercase tracking-[0.25em] ${open ? 'border-burnt text-burnt' : 'border-ink'}`}
    >
      {open ? 'Market open' : 'Market closed'}
    </p>
  );
}

export function MarketSummary({ region, rows }: { region: Region; rows: Quote[] }) {
  const open = useOpen(rows[0]);
  return <p className="mt-3 border-t border-ink pt-2 font-body italic">{summarise(region, rows, open)}</p>;
}
