// Abstract halftone art used until real project images arrive (phase 3).
export function HalftonePlate({ caption }: { caption: string }) {
  return (
    <figure className="mt-4">
      <div
        aria-hidden="true"
        className="h-48 w-full border border-ink bg-ink/15 text-ink sm:h-64"
        style={{
          backgroundImage:
            'radial-gradient(circle, currentColor 22%, transparent 24%), radial-gradient(circle, currentColor 10%, transparent 12%)',
          backgroundSize: '9px 9px, 4px 4px',
        }}
      />
      <figcaption className="mt-1 font-body text-xs italic">{caption}</figcaption>
    </figure>
  );
}
