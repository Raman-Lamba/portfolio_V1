import type { Metric } from '@/content/types';

export function NumbersBox({ metrics }: { metrics: Metric[] }) {
  if (metrics.length === 0) return null;
  return (
    <div className="mt-4 border-y-2 border-ink py-3">
      <h3 className="font-label text-xs font-semibold uppercase tracking-[0.3em]">By the numbers</h3>
      {/* a ledger row: each figure sits on its own oxblood tick, numerals lined up */}
      <ul className="mt-2 flex flex-wrap gap-x-8 gap-y-3">
        {metrics.map((m) => (
          <li key={m.label} className="border-l-2 border-accent pl-3">
            <span className="block font-mono text-2xl font-medium tabular-nums">{m.value}</span>
            <span className="block font-body text-sm italic">{m.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
