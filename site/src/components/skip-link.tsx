export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:bg-paper focus:p-2 focus:font-label focus:text-sm focus:uppercase focus:tracking-widest"
    >
      Skip to content
    </a>
  );
}
