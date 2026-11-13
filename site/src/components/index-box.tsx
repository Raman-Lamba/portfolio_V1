import { navItems } from '@/content/nav';

export function IndexBox() {
  return (
    <nav aria-label="Inside today" className="border-2 border-ink p-3">
      <p className="font-label text-xs font-semibold uppercase tracking-[0.3em]">Inside today</p>
      <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-1 font-label text-sm uppercase tracking-widest">
        {navItems.map((n) => (
          <li key={n.id}>
            <a href={`#${n.id}`} className="hover:underline">
              {n.label} <span className="font-mono text-xs">{n.page}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
