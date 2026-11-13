import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LeadStory } from './lead-story';
import { getLead } from '@/content/queries';

describe('LeadStory', () => {
  it('shows kicker, headline, credit, deck, numbers and the continued link', () => {
    const lead = getLead();
    render(<LeadStory project={lead} />);
    expect(screen.getByText(lead.kicker)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: lead.title })).toBeInTheDocument();
    expect(screen.getByText(lead.credit)).toBeInTheDocument();
    expect(screen.getByText(lead.deck)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'By the numbers' })).toBeInTheDocument();
    for (const m of lead.metrics) {
      expect(screen.getByText(m.value)).toBeInTheDocument();
      expect(screen.getByText(m.label)).toBeInTheDocument();
    }
    expect(screen.getByRole('link', { name: `Continued on A3: ${lead.title}` })).toHaveAttribute(
      'href',
      `/work/${lead.slug}`,
    );
  });
});
