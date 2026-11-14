import Image from 'next/image';
import type { Ad as AdData } from '@/content/types';
import { SmartLink } from './smart-link';

export function Ad({ ad, layout }: { ad: AdData; layout: 'tall' | 'wide' }) {
  const coupon = ad.href === '#contact';
  const frame = coupon ? 'border-2 border-dashed' : 'border-4 border-double';
  const shape =
    layout === 'tall'
      ? 'flex flex-col items-center justify-center gap-3 py-10'
      : 'flex flex-col items-center justify-between gap-3 sm:flex-row';
  return (
    <aside aria-label={`Advertisement: ${ad.headline}`} className={`${frame} ${shape} border-ink p-4 text-center`}>
      {layout === 'wide' && (
        <Image
          src={`/images/ads/${ad.id}.png`}
          alt=""
          width={1200}
          height={480}
          sizes="10rem"
          className="h-24 w-40 shrink-0 border border-ink object-cover"
        />
      )}
      <p className="font-label text-[0.7rem] uppercase tracking-[0.3em]">Advertisement</p>
      <p className="font-display text-2xl font-black uppercase leading-tight">{ad.headline}</p>
      <p className="font-body italic">{ad.body}</p>
      <SmartLink
        href={ad.href}
        className={`font-label text-sm font-semibold uppercase tracking-widest ${coupon ? 'bg-burnt px-3 py-1.5 text-paper hover:bg-ink' : 'text-burnt underline underline-offset-4'}`}
      >
        <span aria-hidden="true">{coupon ? '✂ ' : ''}</span>
        {ad.cta}
        <span className="sr-only">: {ad.headline}</span>
        <span aria-hidden="true"> →</span>
      </SmartLink>
    </aside>
  );
}
