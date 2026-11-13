import type { Metadata } from 'next';
import { Playfair_Display, Source_Serif_4, Barlow_Condensed, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', weight: ['700', '900'] });
const source = Source_Serif_4({ subsets: ['latin'], variable: '--font-source' });
const barlow = Barlow_Condensed({ subsets: ['latin'], variable: '--font-barlow', weight: ['500', '600', '700'] });
const plex = IBM_Plex_Mono({ subsets: ['latin'], variable: '--font-plex', weight: ['400', '500'] });

export const metadata: Metadata = {
  title: 'Raman Lamba | Software for financial decisions',
  description: 'Finance and code: models, simulators and tools for financial decisions. Open for freelance and full-time roles.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${source.variable} ${barlow.variable} ${plex.variable}`}>
      <body>{children}</body>
    </html>
  );
}
