import { agents } from '@/content/agents';
import { projects } from '@/content/projects';
import { site } from '@/content/site';
import { abs } from './seo';

// Plain-text summary for language-model crawlers (the llms.txt convention).
export function llmsText(): string {
  return [
    `# ${site.name}`,
    '',
    `> ${agents.summary}`,
    '',
    '## Start here',
    `- [Fact sheet](${abs('/for-agents')}): who he is, what he can do, questions and answers`,
    `- [Résumé](${abs('/resume')}): full résumé page (PDF: ${abs(site.resumePdf)})`,
    `- [Front page](${abs('/')}): the portfolio, laid out as a newspaper`,
    '',
    '## Projects',
    ...projects.map((p) => `- [${p.title}](${abs(`/work/${p.slug}`)}): ${p.deck}`),
    '',
    '## Contact',
    `- Email: ${site.email}`,
    `- LinkedIn: ${site.linkedin}`,
    `- GitHub: ${site.github}`,
    `- Location: ${site.location}, India. Open to freelance projects and full-time fintech roles.`,
    '',
    '## Topics',
    agents.topics.join(', '),
    '',
  ].join('\n');
}
