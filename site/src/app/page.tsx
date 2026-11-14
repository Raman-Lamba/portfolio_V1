import { FrontPage } from '@/components/front-page';
import { JsonLd } from '@/components/json-ld';
import { Masthead } from '@/components/masthead';
import { personJsonLd, websiteJsonLd } from '@/lib/seo';

export default function Home() {
  return (
    <>
      <JsonLd data={[personJsonLd(), websiteJsonLd()]} />
      <Masthead />
      <FrontPage />
    </>
  );
}
