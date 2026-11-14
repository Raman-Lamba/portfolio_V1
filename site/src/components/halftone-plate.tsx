import Image from 'next/image';

// Engraving-style illustration generated for each project (public/images/plates/<slug>.png).
export function HalftonePlate({
  slug,
  caption,
  priority = false,
  children,
}: {
  slug: string;
  caption?: string;
  priority?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <figure className="relative mt-4">
      <Image
        src={`/images/plates/${slug}.png`}
        alt=""
        width={1200}
        height={480}
        sizes="(min-width: 1024px) 48rem, 100vw"
        priority={priority}
        className="h-auto w-full border border-ink"
      />
      {children}
      {caption && <figcaption className="mt-1 font-body text-xs italic">{caption}</figcaption>}
    </figure>
  );
}
