// Section rule with an optional folio ("Page A4") that matches the index box.
export function SectionHeading({
  id,
  page,
  children,
  className = '',
}: {
  id: string;
  page?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      id={id}
      className={`flex items-baseline justify-between gap-4 border-b-2 border-ink pb-1 font-label text-sm font-semibold uppercase tracking-[0.3em] ${className}`}
    >
      <span>{children}</span>
      {page && (
        <span aria-hidden="true" className="shrink-0 font-mono text-xs tracking-normal">
          Page {page}
        </span>
      )}
    </h2>
  );
}
