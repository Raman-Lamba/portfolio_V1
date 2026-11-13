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
    <aside aria-label="Advertisement" className={`${frame} ${shape} border-ink p-4 text-center`}>
      <p className="font-label text-[0.7rem] uppercase tracking-[0.3em]">Advertisement</p>
      <p className="font-display text-2xl font-black uppercase leading-tight">{ad.headline}</p>
      <p className="font-body italic">{ad.body}</p>
      <SmartLink
        href={ad.href}
        className="font-label text-sm font-semibold uppercase tracking-widest text-accent underline underline-offset-4"
      >
        <span aria-hidden="true">{coupon ? '✂ ' : ''}</span>
        {ad.cta}
        <span className="sr-only">: {ad.headline}</span>
        <span aria-hidden="true"> →</span>
      </SmartLink>
    </aside>
  );
}
