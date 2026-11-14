import Image from 'next/image';

// Engraving-style illustration generated for each project (public/images/plates/<slug>.png).
export function HalftonePlate({ slug, caption }: { slug: string; caption?: string }) {
  return (
    <figure className="mt-4">
      <Image
        src={`/images/plates/${slug}.png`}
        alt=""
        width={1200}
        height={480}
        sizes="(min-width: 1024px) 48rem, 100vw"
        className="h-auto w-full border border-ink"
      />
      {caption && <figcaption className="mt-1 font-body text-xs italic">{caption}</figcaption>}
    </figure>
  );
}
