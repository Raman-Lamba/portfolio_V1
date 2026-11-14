import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BackBar } from '@/components/back-bar';
import { Footer } from '@/components/footer';
import { JsonLd } from '@/components/json-ld';
import { ProjectArticle } from '@/components/project-article';
import { RelatedStories } from '@/components/related-stories';
import { site } from '@/content/site';
import { abs } from '@/lib/seo';
import { getDetails, getFigures, getProject, getProjectSlugs, getRelated } from '@/content/queries';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: `${project.title} | Raman Lamba`, description: project.deck };
}

export default async function WorkPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return (
    <>
      <BackBar />
      <main id="main" className="page-in">
        <JsonLd
          data={{
            '@type': 'CreativeWork',
            headline: project.title,
            description: project.deck,
            url: abs(`/work/${slug}`),
            dateCreated: String(project.year),
            keywords: getDetails(slug)?.stack.join(', '),
            creator: { '@id': abs('/#person'), '@type': 'Person', name: site.name },
          }}
        />
        <ProjectArticle project={project} details={getDetails(slug)} figures={getFigures(slug)} />
        <RelatedStories projects={getRelated(slug)} />
      </main>
      <Footer />
    </>
  );
}
