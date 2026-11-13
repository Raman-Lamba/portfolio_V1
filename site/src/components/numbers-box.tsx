import type { Metric } from '@/content/types';

export function NumbersBox({ metrics }: { metrics: Metric[] }) {
  if (metrics.length === 0) return null;
  return (
    <div className="mt-4 border-y-2 border-ink py-3">
      <h3 className="font-label text-xs font-semibold uppercase tracking-[0.3em]">By the numbers</h3>
      <ul className="mt-2 flex flex-wrap gap-x-8 gap-y-3">
        {metrics.map((m) => (
          <li key={m.label}>
            <span className="block font-mono text-2xl font-medium">{m.value}</span>
            <span className="block font-body text-sm italic">{m.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
