import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ForAgentsPage from './page';
import { agents } from '@/content/agents';
import { projects } from '@/content/projects';

describe('/for-agents', () => {
  it('states who he is, answers every question and indexes every project', () => {
    const { container } = render(<ForAgentsPage />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('AI and finance');
    for (const f of agents.faq) expect(screen.getByRole('heading', { level: 3, name: f.q })).toBeInTheDocument();
    for (const p of projects) {
      expect(screen.getByRole('link', { name: p.title })).toHaveAttribute('href', `/work/${p.slug}`);
    }
    expect(screen.getByRole('link', { name: 'llms.txt' })).toHaveAttribute('href', '/llms.txt');
    const ld = container.querySelector('script[type="application/ld+json"]')!;
    expect(JSON.parse(ld.textContent!)['@graph']).toHaveLength(2);
  });
});
