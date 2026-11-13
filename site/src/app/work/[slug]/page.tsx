import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BackBar } from '@/components/back-bar';
import { Footer } from '@/components/footer';
import { ProjectArticle } from '@/components/project-article';
import { getDetails, getFigures, getProject, getProjectSlugs } from '@/content/queries';

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
      <main id="main">
        <ProjectArticle project={project} details={getDetails(slug)} figures={getFigures(slug)} />
      </main>
      <Footer />
    </>
  );
}
