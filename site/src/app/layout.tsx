import type { Metadata } from 'next';
import { Old_Standard_TT, Newsreader, UnifrakturCook, Barlow_Condensed, IBM_Plex_Mono } from 'next/font/google';
import { SkipLink } from '@/components/skip-link';
import './globals.css';

const standard = Old_Standard_TT({ subsets: ['latin'], variable: '--font-standard', weight: ['400', '700'], style: ['normal', 'italic'] });
const news = Newsreader({ subsets: ['latin'], variable: '--font-news', style: ['normal', 'italic'] });
const fraktur = UnifrakturCook({ subsets: ['latin'], variable: '--font-fraktur', weight: '700' });
const barlow = Barlow_Condensed({ subsets: ['latin'], variable: '--font-barlow', weight: ['500', '600', '700'] });
const plex = IBM_Plex_Mono({ subsets: ['latin'], variable: '--font-plex', weight: ['400', '500'] });

export const metadata: Metadata = {
  title: 'Raman Lamba | Software for financial decisions',
  description: 'Finance and code: models, simulators and tools for financial decisions. Open for freelance and full-time roles.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${standard.variable} ${news.variable} ${fraktur.variable} ${barlow.variable} ${plex.variable}`}>
      <body>
        <SkipLink />
        {children}
      </body>
    </html>
  );
}
