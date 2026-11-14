import type { Metadata } from 'next';
import { Old_Standard_TT, Newsreader, UnifrakturCook, Barlow_Condensed, IBM_Plex_Mono } from 'next/font/google';
import { SkipLink } from '@/components/skip-link';
import { agents } from '@/content/agents';
import { siteUrl } from '@/lib/seo';
import './globals.css';

const standard = Old_Standard_TT({ subsets: ['latin'], variable: '--font-standard', weight: ['400', '700'], style: ['normal', 'italic'] });
const news = Newsreader({ subsets: ['latin'], variable: '--font-news', style: ['normal', 'italic'] });
const fraktur = UnifrakturCook({ subsets: ['latin'], variable: '--font-fraktur', weight: '700' });
const barlow = Barlow_Condensed({ subsets: ['latin'], variable: '--font-barlow', weight: ['500', '600', '700'] });
const plex = IBM_Plex_Mono({ subsets: ['latin'], variable: '--font-plex', weight: ['400', '500'] });

const title = 'Raman Lamba | AI and finance engineer: software for financial decisions';
const description =
  'Raman Lamba builds AI, machine-learning and quantum models for finance: probabilistic forecasting, options and market-microstructure tools, private credit analysis. MBA (Finance) candidate in Hyderabad, open to freelance and full-time fintech roles.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: agents.topics,
  authors: [{ name: 'Raman Lamba', url: siteUrl }],
  creator: 'Raman Lamba',
  alternates: { canonical: '/', types: { 'text/plain': '/llms.txt' } },
  robots: { index: true, follow: true },
  openGraph: { type: 'website', siteName: 'Raman Lamba', title, description, locale: 'en_IN', url: '/' },
  twitter: { card: 'summary_large_image', title, description },
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
