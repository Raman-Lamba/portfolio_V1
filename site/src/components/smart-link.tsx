import Link from 'next/link';
import type { ComponentProps } from 'react';

type Props = Omit<ComponentProps<'a'>, 'href'> & { href: string };

// Internal paths use next/link; anchors (#contact) and external URLs use a plain <a>.
export function SmartLink({ href, ...rest }: Props) {
  return href.startsWith('/') ? <Link href={href} {...rest} /> : <a href={href} {...rest} />;
}
