import type { Metadata } from 'next';
import { BackBar } from '@/components/back-bar';
import { Footer } from '@/components/footer';
import { ResumePage } from '@/components/resume-page';

export const metadata: Metadata = {
  title: 'Résumé | Raman Lamba',
  description: 'Résumé of Raman Lamba: finance and code, private credit, valuation and ML.',
};

export default function ResumeRoute() {
  return (
    <>
      <BackBar />
      <main id="main">
        <ResumePage />
      </main>
      <Footer />
    </>
  );
}
