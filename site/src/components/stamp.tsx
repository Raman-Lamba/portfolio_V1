// A rubber-stamp label (oxblood ink, slightly askew). Decorative unless `label` is given for screen readers.
export function Stamp({
  children,
  label,
  tilt = '-6deg',
  className = '',
}: {
  children: React.ReactNode;
  label?: string;
  tilt?: string;
  className?: string;
}) {
  const style = { '--r': tilt } as React.CSSProperties;
  return (
    <span
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      style={style}
      className={`stamp inline-block rotate-(--r) border-[3px] border-accent px-2 py-0.5 font-label text-sm font-bold uppercase leading-none tracking-[0.2em] text-accent ${className}`}
    >
      {children}
    </span>
  );
}
